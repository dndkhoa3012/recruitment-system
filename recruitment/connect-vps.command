#!/bin/bash

# SSH Auto-Connect to VPS
# Double-click this file to connect

echo "🔌 Connecting to VPS..."
echo "Server: 103.159.50.249"
echo "User: root"
echo ""
echo "⚠️  Khi được hỏi password, paste: D7g7aZYeMhvfiMJg"
echo "   (Password không hiện khi gõ - đây là bình thường!)"
echo ""

# Connect to VPS
ssh root@103.159.50.249

# Keep terminal open if connection fails
if [ $? -ne 0 ]; then
    echo ""
    echo "❌ Connection failed!"
    echo ""
    read -p "Press Enter to close..."
fi
