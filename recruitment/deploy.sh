#!/bin/bash

# Script Deploy "Một Chạm" (One-touch Deployment)
# Chỉ cần chạy ./deploy.sh là xong!

echo "🚀 Bắt đầu quy trình Deploy tự động..."

# 1. Build Image (cho chip Intel/AMD của VPS)
echo "📦 Đang đóng gói code (Build)..."
docker build -t dndkhoa3012/recruitment-app:latest . --platform linux/amd64

# 2. Push Image lên Docker Hub
echo "☁️ Đang đẩy lên mây (Push)..."
docker push dndkhoa3012/recruitment-app:latest

echo "✅ HOÀN TẤT!"
echo "📡 VPS sẽ tự động phát hiện và cập nhật sau khoảng 5 phút."
echo "☕ Anh có thể đi pha cà phê được rồi!"
