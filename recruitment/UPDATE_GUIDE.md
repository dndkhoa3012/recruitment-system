# HƯỚNG DẪN VẬN HÀNH & CẬP NHẬT WEB TUYỂN DỤNG

Tài liệu này dùng để lưu trữ các lệnh quan trọng khi vận hành website Tuyển Dụng (Recruitment).

---

## 1. CẬP NHẬT NHANH (Khuyên dùng) - ~5-7 phút ⚡

Build trên Mac (có cache, nhanh), kéo lên VPS ngay (không chờ Watchtower).
Yêu cầu nhập mật khẩu VPS khi được hỏi.

```bash
./deploy-fast.sh "Ghi chú cập nhật"
```
*   Build image trên Mac (có cache) → push Docker Hub → SSH kéo VPS ngay.
*   Không cần đợi Watchtower 5 phút.
*   VPS KHÔNG bị tốn RAM (build trên Mac).

---

## 2. CẬP NHẬT TỰ ĐỘNG - ~15 phút (Dùng khi không có ở máy)

Build từ đầu, không dùng cache. Chạy xong là đi làm việc khác.

```bash
./deploy.sh "Ghi chú cập nhật"
```
*   Build & Push lên Docker Hub.
*   VPS tự phát hiện và cập nhật sau 5 phút.

---

## 3. CẬP NHẬT THỦ CÔNG TRÊN VPS (Khi cần)

SSH vào VPS và chạy:
```bash
ssh root@103.159.50.249
```
```bash
cd /var/www/recruitment-system/recruitment && git pull origin main && docker compose up -d --build
```

---

## 4. LỆNH CỨU HỘ KHẨN CẤP (Khi cần reset hoàn toàn)

Dùng khi web bị lỗi nặng hoặc muốn đảm bảo mọi thứ sạch sẽ nhất.

```bash
ssh root@103.159.50.249 "cd /var/www/recruitment-system/recruitment && docker compose down && docker compose up -d --build"
```

---

## 4. CÁCH XEM TIẾN ĐỘ & LOGS

**Xem tiến độ Update (Watchtower):**
```bash
ssh root@103.159.50.249 "docker logs -f recruitment_watchtower"
```

**Xem logs (lỗi/trạng thái) của Web Tuyển Dụng:**
```bash
ssh root@103.159.50.249 "docker logs -f recruitment_app"
```

---

## 5. THÔNG TIN DATABASE (Để kết nối Navicat)

*   **Tab SSH:**
    *   **Host:** `103.159.50.249`
    *   **Port:** `22` (Quan trọng)
    *   **User:** `root`
    *   **Password:** (Mật khẩu VPS)

*   **Tab General:**
    *   **Host:** `localhost`
    *   **Port:** `3307`
    *   **User:** `recruitment`
    *   **Password:** `RecruitPass2024`

---

## *Ghi chú kỹ thuật (Cho Dev)*
-   **Đường dẫn project trên VPS:** `/var/www/recruitment-system/recruitment`
-   **Database:** MySQL 8.0 (Volume: `mysql_data`).