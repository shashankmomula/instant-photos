"""
Vercel serverless function entry point for FastAPI backend
"""
import sys
import os

# Add parent directory to path so we can import main
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..'))

from mangum import Mangum
from main import app

# Wrap FastAPI app with Mangum for AWS Lambda/Vercel compatibility
# Disable lifespan for serverless (cold starts)
handler = Mangum(app, lifespan="off")
