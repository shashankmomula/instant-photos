"""
Vercel serverless function entry point for FastAPI backend
"""
import sys
import os
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

try:
    # Add parent directory to path so we can import main
    backend_dir = os.path.join(os.path.dirname(__file__), '..')
    sys.path.insert(0, backend_dir)
    
    logger.info(f"Importing from: {backend_dir}")
    
    from mangum import Mangum
    from main import app
    
    # Wrap FastAPI app with Mangum for AWS Lambda/Vercel compatibility
    # Disable lifespan for serverless (cold starts)
    handler = Mangum(app, lifespan="off")
    
    logger.info("✅ Handler initialized successfully")
    
except Exception as e:
    logger.error(f"❌ Failed to initialize handler: {e}")
    import traceback
    import json
    logger.error(traceback.format_exc())
    
    # Create a minimal error handler
    def error_handler(event, context):
        return {
            "statusCode": 500,
            "headers": {"Content-Type": "application/json"},
            "body": json.dumps({
                "error": "Handler initialization failed",
                "message": str(e),
                "traceback": traceback.format_exc()
            })
        }
    
    handler = error_handler
