#!/bin/bash

# Script Deploy Nhanh - Build trên Mac (có cache) + Cập nhật VPS ngay lập tức
# Nhanh hơn deploy.sh vì:
#   1. Dùng Docker cache → build nhanh hơn (2-5 phút thay vì 15 phút)
#   2. SSH vào VPS kéo về ngay, không cần đợi Watchtower 5 phút
# Yêu cầu: Nhập mật khẩu VPS khi được hỏi

VPS_IP="103.159.50.249"
VPS_PATH="/var/www/recruitment-system/recruitment"

echo "🚀 Bắt đầu quy trình Deploy Nhanh..."

# 1. Lưu code lên Git
echo "📂 Đang lưu code lên Git..."
git add .
COMMIT_MSG="Auto deploy: $(date '+%Y-%m-%d %H:%M:%S')"
if [ ! -z "$1" ]; then
  COMMIT_MSG="$1"
fi
git commit -m "$COMMIT_MSG" || echo "⚠️  Không có thay đổi nào để commit."
git push origin main

# 2. Build Image trên Mac (có cache - nhanh hơn nhiều)
echo "📦 Đang build image (có cache)..."
docker build -t dndkhoa3012/recruitment-app:latest . --platform linux/amd64

# 3. Push lên Docker Hub
echo "☁️  Đang đẩy lên Docker Hub..."
docker push dndkhoa3012/recruitment-app:latest

# 4. SSH vào VPS, kéo bản mới về và khởi động lại ngay (không chờ Watchtower)
echo "🖥️  Đang cập nhật VPS ngay lập tức..."
ssh root@$VPS_IP "cd $VPS_PATH && docker compose pull && docker compose up -d"

echo ""
echo "✅ DEPLOY NHANH HOÀN TẤT!"
echo "🌐 Website đã được cập nhật ngay lập tức!"
