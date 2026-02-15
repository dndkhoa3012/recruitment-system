#!/bin/bash

echo "🔍 Step 1: Checking PM2 processes..."
pm2 list

echo ""
echo "🔍 Step 2: Checking current ports in use..."
ss -tulpn | grep LISTEN

echo ""
echo "🔧 Step 3: Installing UFW firewall..."
apt update && apt install -y ufw

echo ""
echo "🔓 Step 4: Configuring firewall rules..."

# Essential ports
ufw allow 22/tcp    # SSH - CRITICAL!
ufw allow 80/tcp    # HTTP
ufw allow 443/tcp   # HTTPS
ufw allow 3000/tcp  # Docker app

# Check if other apps need ports
echo ""
echo "📋 Current PM2 apps and their ports:"
pm2 jlist | grep -E '"name"|"port"' || true

echo ""
echo "⚠️  If you see other ports in PM2, add them with: ufw allow PORT/tcp"
echo ""

# Enable UFW
echo "🔥 Step 5: Enabling firewall..."
ufw --force enable

echo ""
echo "✅ Step 6: Firewall status:"
ufw status verbose

echo ""
echo "🎉 Done! Now try accessing http://103.159.50.249 in your browser!"
