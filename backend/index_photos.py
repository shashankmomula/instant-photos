"""
Background script to index photos from GCS bucket using FAISS
Run this script once per event to precompute all embeddings
"""

import requests
import json
import os
import sys
from typing import List
from google.cloud import storage
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Configuration
GCS_BUCKET_NAME = os.getenv("GCS_BUCKET_NAME", "event-photos-demo")
BACKEND_API_URL = os.getenv("BACKEND_API_URL", "http://localhost:8000")

def get_gcs_photos(bucket_name: str, event_id: str) -> List[str]:
    """
    Get list of photo URLs from GCS bucket
    
    Args:
        bucket_name: GCS bucket name
        event_id: Event folder name
    
    Returns:
        List of public photo URLs
    """
    try:
        storage_client = storage.Client()
        bucket = storage_client.bucket(bucket_name)
        blobs = bucket.list_blobs(prefix=f"{event_id}/", delimiter="/")
        
        photo_urls = []
        for blob in blobs:
            if blob.name.lower().endswith(('.jpg', '.jpeg', '.png')):
                url = f"https://storage.googleapis.com/{bucket_name}/{blob.name}"
                photo_urls.append(url)
                logger.info(f"  📷 Found: {blob.name}")
        
        return photo_urls
    
    except Exception as e:
        logger.error(f"❌ Failed to list GCS photos: {e}")
        raise


def index_event_photos(event_id: str, photo_urls: List[str]):
    """
    Call backend API to index photos for an event
    
    Args:
        event_id: Event identifier
        photo_urls: List of GCS photo URLs
    """
    try:
        logger.info(f"\n🚀 Indexing event: {event_id}")
        logger.info(f"📊 Total photos: {len(photo_urls)}")
        
        if not photo_urls:
            logger.warning("⚠️  No photos found for this event")
            return
        
        # Call backend indexing endpoint
        response = requests.post(
            f"{BACKEND_API_URL}/index",
            json={
                "event_id": event_id,
                "photo_urls": photo_urls,
            },
            timeout=600,  # 10 minute timeout
        )
        
        if response.status_code != 200:
            raise Exception(f"Backend returned {response.status_code}: {response.text}")
        
        result = response.json()
        logger.info(f"\n✅ Indexing complete!")
        logger.info(f"   Indexed faces: {result['indexed_faces']}")
        logger.info(f"   Processed photos: {result['total_photos']}")
        if result.get('failed_photos'):
            logger.warning(f"   Failed photos: {len(result['failed_photos'])}")
            for photo in result['failed_photos'][:5]:  # Show first 5
                logger.warning(f"     - {photo}")
        
        return result
    
    except Exception as e:
        logger.error(f"❌ Failed to index photos: {e}")
        raise


def get_backend_status():
    """Check if backend is running and healthy"""
    try:
        response = requests.get(f"{BACKEND_API_URL}/health", timeout=5)
        if response.status_code == 200:
            status = response.json()
            logger.info(f"✅ Backend OK - Indexed faces: {status['indexed_faces']}")
            return True
        else:
            logger.error(f"❌ Backend unhealthy: {response.status_code}")
            return False
    except Exception as e:
        logger.error(f"❌ Cannot connect to backend at {BACKEND_API_URL}: {e}")
        return False


def main():
    """Main entry point"""
    
    # Check backend
    logger.info(f"🔍 Checking backend at {BACKEND_API_URL}...")
    if not get_backend_status():
        logger.error("⚠️  Backend is not running. Start it with: python main.py")
        sys.exit(1)
    
    # Get event ID from command line or use default
    event_id = sys.argv[1] if len(sys.argv) > 1 else "demo-event-1"
    
    logger.info(f"\n📂 Fetching photos from GCS bucket: {GCS_BUCKET_NAME}/{event_id}")
    
    # Get photos from GCS
    photo_urls = get_gcs_photos(GCS_BUCKET_NAME, event_id)
    
    if not photo_urls:
        logger.error("❌ No photos found. Make sure:")
        logger.error(f"   1. GCS bucket '{GCS_BUCKET_NAME}' exists and is public")
        logger.error(f"   2. Photos are in folder: {event_id}/")
        logger.error(f"   3. Photos are in JPEG format (*.jpg, *.jpeg)")
        sys.exit(1)
    
    # Index photos
    result = index_event_photos(event_id, photo_urls)
    
    if result:
        logger.info(f"\n✨ Ready to match! Run the FastAPI server and upload selfies.")


if __name__ == "__main__":
    main()
