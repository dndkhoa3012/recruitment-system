# Hướng Dẫn Cập Nhật Siêu Tốc ("Một Chạm" - Zero-touch)

Từ giờ, để cập nhật web, anh **KHÔNG** cần SSH vào VPS, không cần nhớ lệnh dài dòng.
Mọi thứ đã được tự động hoá 100%.

---

## 1. Cách Cập Nhật Code Mới (Làm Hàng Ngày)

Sau khi sửa code xong trên máy tính, anh chỉ cần làm duy nhất 1 bước:

1.  Mở Terminal tại thư mục dự án.
2.  Chạy lệnh thần thánh này:

    ```bash
    ./deploy.sh
    ```
    *(Nếu máy báo lỗi quyền, hãy chạy: `chmod +x deploy.sh` trước nhé).*

👉 **XONG!** Lệnh này sẽ tự động đóng gói code và đẩy lên mây.
Hệ thống **"Watchtower"** trên VPS sẽ tự động phát hiện bản mới và cập nhật trong vòng **5 phút**. Anh cứ đi pha cà phê rồi quay lại kiểm tra web là được.

---

## 2. Cách Cứu Hộ (Khi Web Bị Lỗi/Sập)

Nếu web không tự cập nhật hoặc bị lỗi, anh vẫn có thể vào VPS kiểm tra như cũ:

1.  SSH vào VPS:
    ```bash
    ssh root@103.159.50.249
    ```
2.  Vào thư mục web:
    ```bash
    cd /var/www/recruitment-system/recruitment
    ```
3.  Kéo bản mới về chạy lại thủ công:
    ```bash
    docker compose pull
    docker compose up -d
    ```

---
**Lưu ý:**
-   Web Tuyển Dụng (`Recruitment`) chạy bằng **Docker + Watchtower** (Tự động cập nhật).
-   Các web cũ (`HR`, `FNB`, `Bar`) chạy bằng **PM2** (Cần bật thủ công nếu sập).