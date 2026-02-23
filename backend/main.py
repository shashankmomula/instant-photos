"""
FastAPI Backend for Event Photo Gallery MVP
Simplified version without heavy AI/ML dependencies for fast local testing
"""

from fastapi import FastAPI, File, UploadFile, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from contextlib import asynccontextmanager
import os
import json
from typing import List
import logging
import random
from google.cloud import storage
from google.oauth2 import service_account
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Configuration
EMBEDDINGS_METADATA_PATH = "embeddings_metadata.json"

# Global variables
embeddings_metadata = {}


def load_metadata():
    """Load metadata from disk or create new"""
    global embeddings_metadata
    if os.path.exists(EMBEDDINGS_METADATA_PATH):
        try:
            with open(EMBEDDINGS_METADATA_PATH, 'r') as f:
                embeddings_metadata = json.load(f)
                logger.info(f"✅ Loaded metadata with {len(embeddings_metadata)} photos")
        except Exception as e:
            logger.error(f"❌ Failed to load metadata: {e}")
            embeddings_metadata = {}
    else:
        embeddings_metadata = {}


def save_metadata():
    """Save metadata to disk"""
    try:
        with open(EMBEDDINGS_METADATA_PATH, 'w') as f:
            json.dump(embeddings_metadata, f, indent=2)
        logger.info("✅ Saved metadata")
    except Exception as e:
        logger.error(f"❌ Failed to save metadata: {e}")


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Lifespan event handler for startup and shutdown"""
    # Startup
    logger.info("🚀 Starting Event Photo Gallery API (MVP)...")
    load_metadata()
    logger.info("✅ Startup complete")
    yield
    # Shutdown (if needed)
    logger.info("🛑 Shutting down...")


# Initialize FastAPI app
app = FastAPI(title="Event Photo Gallery API (MVP)", version="1.0.0", lifespan=lifespan)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "mode": "MVP (simplified for testing)",
        "indexed_photos": len(embeddings_metadata),
    }


@app.post("/index")
async def index_event_photos(event_id: str, photo_urls: List[str]):
    """
    Index photos for an event (MVP version - stores URLs without AI)
    
    Args:
        event_id: Event identifier
        photo_urls: List of photo URLs from GCS
    
    Returns:
        Status and number of indexed photos
    """
    try:
        logger.info(f"📸 Indexing {len(photo_urls)} photos for event {event_id}")
        
        indexed_count = 0
        for i, photo_url in enumerate(photo_urls):
            try:
                # MVP: Store URL directly without face detection
                idx = str(len(embeddings_metadata))
                embeddings_metadata[idx] = {
                    "photo_url": photo_url,
                    "event_id": event_id,
                    "indexed": True,
                }
                indexed_count += 1
                logger.info(f"  ✅ Indexed: {photo_url}")
            except Exception as e:
                logger.error(f"  ❌ Failed to process photo: {e}")
        
        save_metadata()
        
        return {
            "status": "success",
            "event_id": event_id,
            "indexed_photos": indexed_count,
            "total_photos": len(photo_urls),
            "mode": "MVP",
        }
        
    except Exception as e:
        logger.error(f"❌ Indexing error: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/match")
async def match_selfie(selfie: UploadFile = File(...), event_id: str = Query(None)):
    """
    Match uploaded selfie - AI DISABLED
    For now, returns all photos for the event (if event_id provided)
    or all indexed photos
    
    Args:
        selfie: Uploaded image file (not used when AI disabled)
        event_id: Optional event ID to filter photos
    
    Returns:
        All photos for the event (AI matching disabled)
    """
    try:
        contents = await selfie.read()
        
        if not contents:
            raise HTTPException(status_code=400, detail="Invalid image file")
        
        logger.info(f"📸 Selfie uploaded (AI disabled - returning all photos)")
        
        # Get all photos, optionally filtered by event
        if event_id:
            all_photos = [
                m["photo_url"] 
                for m in embeddings_metadata.values() 
                if m.get("event_id") == event_id
            ]
        else:
            all_photos = [m["photo_url"] for m in embeddings_metadata.values()]
        
        if not all_photos:
            return {
                "status": "no_indexed_photos",
                "matched_photos": [],
                "similarity_scores": [],
                "face_detected": False,
                "mode": "AI_DISABLED",
                "note": "No photos indexed. Use /list-photos endpoint to get photos directly from GCS.",
            }
        
        logger.info(f"✅ Returning {len(all_photos)} photos (AI disabled)")
        
        return {
            "status": "success",
            "matched_photos": all_photos,
            "similarity_scores": [],
            "face_detected": False,
            "mode": "AI_DISABLED",
            "note": "AI face matching is currently disabled. All event photos are shown.",
        }
        
    except Exception as e:
        logger.error(f"❌ Matching error: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/list-photos")
async def list_event_photos(event_id: str = Query(..., description="Event identifier")):
    """
    List all photos for an event from GCS
    
    Args:
        event_id: Event identifier
    
    Returns:
        List of photo URLs from GCS
    """
    try:
        bucket_name = os.getenv("GCS_BUCKET_NAME", "event-photos-demo")
        
        # Initialize GCS client with explicit credentials
        try:
            credentials_path = os.getenv("GOOGLE_APPLICATION_CREDENTIALS")
            
            if credentials_path and os.path.exists(credentials_path):
                # Use explicit credentials file
                credentials = service_account.Credentials.from_service_account_file(credentials_path)
                storage_client = storage.Client(credentials=credentials, project=credentials.project_id)
                logger.info(f"✅ Using credentials from: {credentials_path}")
            else:
                # Fallback to application default credentials
                logger.warning(f"⚠️ GOOGLE_APPLICATION_CREDENTIALS not found or invalid: {credentials_path}")
                logger.warning("⚠️ Trying application default credentials...")
                storage_client = storage.Client()
            
            bucket = storage_client.bucket(bucket_name)
        except Exception as e:
            logger.error(f"❌ Failed to initialize GCS client: {e}")
            error_msg = f"GCS initialization failed. "
            if not credentials_path:
                error_msg += "GOOGLE_APPLICATION_CREDENTIALS not set in .env file. "
            elif not os.path.exists(credentials_path):
                error_msg += f"Credentials file not found: {credentials_path}. "
            else:
                error_msg += f"Error: {str(e)}. "
            error_msg += "Please check your .env file and credentials.json path."
            raise HTTPException(status_code=500, detail=error_msg)
        
        # List all blobs with the event prefix
        try:
            blobs = bucket.list_blobs(prefix=f"{event_id}/")
        except Exception as e:
            logger.error(f"❌ Failed to list blobs: {e}")
            raise HTTPException(status_code=500, detail=f"Failed to list GCS files: {str(e)}")
        
        photo_urls = []
        for blob in blobs:
            # Only include image files
            if blob.name.lower().endswith(('.jpg', '.jpeg', '.png', '.gif', '.webp')):
                # Construct public URL
                url = f"https://storage.googleapis.com/{bucket_name}/{blob.name}"
                photo_urls.append(url)
                # Log each photo URL for easy debugging
                logger.info(f"  📷 {url}")
        
        logger.info(f"📸 Found {len(photo_urls)} photos for event {event_id}")
        
        return {
            "status": "success",
            "event_id": event_id,
            "photos": photo_urls,
            "count": len(photo_urls),
        }
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"❌ Failed to list photos: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/status")
async def get_status():
    """Get current indexing status"""
    unique_photos = set(m.get("photo_url") for m in embeddings_metadata.values())
    return {
        "status": "ready",
        "mode": "MVP",
        "indexed_unique_photos": len(unique_photos),
        "total_entries": len(embeddings_metadata),
    }


@app.post("/demo/reset")
async def reset_index():
    """Reset index (for demo purposes)"""
    global embeddings_metadata
    embeddings_metadata = {}
    if os.path.exists(EMBEDDINGS_METADATA_PATH):
        try:
            os.remove(EMBEDDINGS_METADATA_PATH)
        except:
            pass
    logger.info("✅ Index reset")
    return {"status": "reset"}


if __name__ == "__main__":
    import uvicorn
    logger.info("🚀 Running Event Photo Gallery API in MVP Mode")
    logger.info("📝 This is a simplified version for quick testing")
    logger.info("📝 For production: Install insightface and faiss-cpu for AI face matching")
    uvicorn.run(app, host="0.0.0.0", port=8000, log_level="info")

def initialize_face_analyzer():
    """Placeholder - not used in MVP mode"""
    pass


def initialize_faiss_index():
    """Placeholder - not used in MVP mode"""
    pass
