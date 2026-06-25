# EasyLap Backend

Hệ thống backend cho ứng dụng tư vấn mua laptop EasyLap.

## Cài đặt

1. Cài đặt các thư viện:
   ```bash
   npm install
   ```
2. Cấu hình biến môi trường:
   ```bash
   cp .env.example .env
   ```
3. Cập nhật các biến môi trường trong file `.env`:
   - `SUPABASE_URL`: URL của project Supabase
   - `SUPABASE_ANON_KEY`: Anon key của Supabase
   - `SUPABASE_SERVICE_ROLE_KEY`: Service role key của Supabase
   - `JWT_SECRET`: Secret key ngẫu nhiên

## Chạy ứng dụng

Chạy ở chế độ phát triển:
```bash
npm run dev
```

Chạy ở chế độ production:
```bash
npm start
```

## Database

1. Tạo project trên Supabase (https://supabase.com).
2. Vào SQL Editor của dự án.
3. Chép nội dung từ `database/schema.sql` và chạy để tạo bảng & cài đặt RLS.
4. Chép nội dung từ `database/seed.sql` và chạy để tạo dữ liệu mẫu ban đầu (chỉ bao gồm các bảng tĩnh, ví dụ user quiz, trừ laptop).
5. Để nạp dữ liệu Laptop từ file CSV:
   - Đảm bảo bạn đã lưu dữ liệu laptop dạng CSV vào thư mục `backend/data/laptops.csv`.
   - Trong file `.env` đã có `SUPABASE_URL` và `SUPABASE_SERVICE_ROLE_KEY`.
   - Chạy lệnh:
     ```bash
     npm run import:laptops
     ```
   - Chờ đến khi terminal báo import thành công.

## API Testing

Bạn có thể dùng Postman hoặc bất kỳ công cụ REST client nào để test các API endpoints. Chi tiết payload được định nghĩa trong mã nguồn.
