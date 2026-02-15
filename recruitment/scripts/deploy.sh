#!/bin/bash

# Configuration
VPS_USER="root"
VPS_IP="103.159.50.249"
APP_DIR="/var/www/recruitment"

echo "🚀 Starting deployment to $VPS_IP..."

# 1. Push local changes
echo "📦 Pushing local changes to GitHub..."
git push origin main

# 2. Connect to VPS and deploy
echo "CONN Connecting to VPS..."
ssh -t $VPS_USER@$VPS_IP "cd $APP_DIR && git pull origin main && docker compose up -d --build && docker image prune -f"

echo "🎉 Deployment complete!"
