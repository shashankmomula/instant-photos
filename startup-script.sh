#!/bin/bash

# Google Cloud Compute Engine Startup Script
# Automatically installs and runs the Event Photo Gallery Backend
# Use this in gcloud compute instances create --metadata-from-file startup-script=startup-script.sh

set -e

echo "🚀 Starting Event Photo Gallery Backend Setup..."

# Update system
sudo apt-get update
sudo apt-get install -y \
    python3-pip \
    git \
    build-essential \
    python3-dev \
    curl

# Install Python dependencies
echo "📦 Installing Python packages..."
pip3 install --upgrade pip
pip3 install fastapi uvicorn insightface faiss-cpu opencv-python numpy python-multipart google-cloud-storage Pillow pydantic python-dotenv

# Clone repository (or use gcloud source repositories)
# For this example, assuming code is already in /app/photo-gallery
cd /home/ubuntu
git clone https://github.com/yourusername/photo-gallery.git || echo "Repository not found, please upload manually"

cd photo-gallery/backend

# Create .env file
cat > .env << 'EOF'
GCS_BUCKET_NAME=event-photos-demo
BACKEND_API_URL=http://0.0.0.0:8000
FACE_MATCH_THRESHOLD=0.6
EOF

# Create systemd service
sudo tee /etc/systemd/system/photo-gallery.service > /dev/null << 'EOF'
[Unit]
Description=Event Photo Gallery Backend
After=network.target

[Service]
Type=simple
User=ubuntu
WorkingDirectory=/home/ubuntu/photo-gallery/backend
Environment="PATH=/usr/local/bin:/usr/bin:/bin"
ExecStart=/usr/bin/python3 /home/ubuntu/photo-gallery/backend/main.py
Restart=always
RestartSec=10
StandardOutput=append:/var/log/photo-gallery.log
StandardError=append:/var/log/photo-gallery.log

[Install]
WantedBy=multi-user.target
EOF

# Create log file
sudo touch /var/log/photo-gallery.log
sudo chown ubuntu:ubuntu /var/log/photo-gallery.log

# Enable and start service
sudo systemctl daemon-reload
sudo systemctl enable photo-gallery
sudo systemctl start photo-gallery

# Print startup info
echo ""
echo "✅ Setup complete! Status:"
sudo systemctl status photo-gallery
echo ""
echo "📊 Logs:"
echo "  tail -f /var/log/photo-gallery.log"
echo ""
echo "🔍 Health check:"
echo "  curl http://localhost:8000/health"
echo ""
echo "📸 To index photos:"
echo "  cd /home/ubuntu/photo-gallery/backend"
echo "  python3 index_photos.py demo-event-1"
