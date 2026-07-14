# EasyLap - Tài liệu chức năng và giao diện

## 1. Tổng quan dự án

EasyLap là ứng dụng tư vấn chọn mua laptop theo nhu cầu cá nhân. Người dùng trả lời một bài quiz ngắn về nhóm người dùng, ngân sách, mức độ di chuyển, thời gian sử dụng và các ưu tiên. Hệ thống phân tích câu trả lời, đối chiếu với dữ liệu laptop, tính điểm phù hợp và đề xuất các mẫu laptop tốt nhất kèm lý do lựa chọn.

Dự án hiện có hai phần:

- Ứng dụng chính: `frontend` React/Vite và `backend` Express/Supabase.
- Prototype tĩnh ở thư mục gốc: `index.html`, `style.css`, `app.js`, `data.js`, dùng để demo ý tưởng LaptopMatchVN/EasyLap với quiz, kết quả, so sánh và mục kiến thức 5 phút.

## 2. Nhóm người dùng và phân quyền

### 2.1 Khách chưa đăng nhập

- Xem trang chủ.
- Đăng ký tài khoản.
- Đăng nhập tài khoản.
- Không truy cập được quiz, danh sách laptop, kết quả, yêu thích, lịch sử, hồ sơ và trang quản trị.

### 2.2 Người dùng đã đăng nhập

- Làm quiz tư vấn laptop.
- Xem kết quả gợi ý.
- Duyệt danh sách laptop.
- Tìm kiếm, lọc, sắp xếp laptop.
- Xem chi tiết laptop.
- Lưu hoặc bỏ lưu laptop yêu thích.
- Thêm laptop vào danh sách so sánh.
- So sánh tối đa 3 laptop.
- Xem lịch sử làm quiz.
- Cập nhật hồ sơ cá nhân.
- Đăng xuất.

### 2.3 Quản trị viên

Quản trị viên có toàn bộ quyền của người dùng thường và thêm:

- Truy cập Admin Dashboard.
- Xem thống kê số laptop và số câu hỏi quiz.
- Thêm, sửa, xóa laptop.
- Thêm, sửa, xóa câu hỏi quiz.
- Kích hoạt hoặc ẩn câu hỏi quiz.

## 3. Luồng sử dụng chính

1. Người dùng vào trang chủ EasyLap.
2. Nếu chưa có tài khoản, người dùng đăng ký hoặc đăng nhập.
3. Người dùng làm quiz.
4. Hệ thống tải câu hỏi chung.
5. Sau khi người dùng chọn nhóm người dùng, hệ thống tải thêm câu hỏi riêng theo nhóm.
6. Người dùng hoàn thành quiz.
7. Backend tính cấu hình khuyến nghị và chấm điểm từng laptop.
8. Hệ thống trả về top laptop phù hợp nhất.
9. Người dùng có thể lưu yêu thích, xem chi tiết, thêm vào so sánh hoặc làm lại quiz.
10. Kết quả quiz được lưu vào lịch sử của tài khoản.

## 4. Chức năng frontend

### 4.1 Trang chủ `/`

Mục tiêu: giới thiệu EasyLap và dẫn người dùng vào luồng tư vấn.

Thành phần giao diện:

- Hero section với thông điệp "Không rành laptop vẫn chọn được máy phù hợp".
- Nút bắt đầu:
  - Nếu đã đăng nhập: đi đến `/quiz`.
  - Nếu chưa đăng nhập: đi đến `/login`.
- Khối vấn đề người dùng thường gặp:
  - Rối rắm thông số kỹ thuật.
  - Mua sai nhu cầu.
  - Quá nhiều lựa chọn.
- Khối cách EasyLap hoạt động theo 3 bước:
  - Trả lời câu hỏi.
  - Hệ thống phân tích.
  - Nhận gợi ý.
- Khối lợi ích:
  - Tiết kiệm thời gian.
  - Chọn đúng nhu cầu.
  - Hiểu rõ lý do chọn.
  - Tránh bị ảnh hưởng bởi quảng cáo.

### 4.2 Đăng nhập `/login`

Chức năng:

- Nhập email và mật khẩu.
- Kiểm tra bắt buộc nhập đủ thông tin.
- Gửi thông tin đăng nhập lên backend.
- Lưu access token sau khi đăng nhập thành công.
- Điều hướng sang `/quiz`.
- Hiển thị lỗi nếu email hoặc mật khẩu không đúng.
- Có liên kết sang trang đăng ký.

Giao diện:

- Layout riêng cho auth.
- Logo EasyLap.
- Form gồm email, mật khẩu và nút đăng nhập.
- Thông báo lỗi bằng component `ErrorMessage`.

### 4.3 Đăng ký `/register`

Chức năng:

- Nhập họ tên, email, mật khẩu, xác nhận mật khẩu.
- Kiểm tra:
  - Không để trống thông tin.
  - Mật khẩu tối thiểu 6 ký tự.
  - Xác nhận mật khẩu phải khớp.
- Gửi yêu cầu tạo tài khoản.
- Hiển thị thông báo đăng ký thành công.
- Tự chuyển về trang đăng nhập sau khi đăng ký thành công.

Giao diện:

- Form đăng ký trong layout auth.
- Nút đăng ký có trạng thái loading.
- Link quay lại đăng nhập.

### 4.4 Quiz tư vấn `/quiz`

Chức năng:

- Tải câu hỏi chung từ API.
- Khi người dùng chọn nhóm người dùng, tải thêm câu hỏi riêng cho nhóm đó.
- Hỗ trợ câu hỏi một lựa chọn và nhiều lựa chọn.
- Lưu câu trả lời theo `question_key`.
- Hiển thị tiến trình làm quiz.
- Cho phép quay lại câu trước.
- Chỉ cho tiếp tục khi câu hiện tại đã được trả lời.
- Khi hoàn thành, gửi câu trả lời lên API gợi ý.
- Lưu kết quả tạm vào `sessionStorage`.
- Điều hướng sang trang kết quả.

Nhóm người dùng được backend hỗ trợ:

- `it_student`: Sinh viên Công nghệ thông tin / Lập trình.
- `finance_student`: Sinh viên Tài chính / Kinh tế.
- `design_student`: Sinh viên Thiết kế / Kiến trúc.
- `office_worker`: Nhân viên văn phòng.
- `content_creator`: Người sáng tạo nội dung / media.
- `gamer`: Người chơi game.
- `beginner`: Người dùng cơ bản / mua lần đầu.

Giao diện:

- Thanh tiến trình.
- Số câu hiện tại trên tổng số câu.
- Card câu hỏi.
- Danh sách đáp án dạng lựa chọn.
- Ghi chú câu hỏi chọn một hoặc chọn nhiều.
- Nút quay lại và tiếp tục/hoàn thành.
- Loading toàn màn hình khi tải câu hỏi.

### 4.5 Trang kết quả `/result`

Chức năng:

- Đọc kết quả quiz từ `sessionStorage`.
- Nếu chưa có kết quả, hiển thị trạng thái rỗng và nút làm quiz.
- Hiển thị nhóm người dùng và tóm tắt phân tích.
- Hiển thị cấu hình khuyến nghị:
  - CPU.
  - RAM.
  - SSD.
  - GPU.
  - Ghi chú.
- Hiển thị danh sách laptop được đề xuất.
- Mỗi laptop có thể:
  - Xem thông tin.
  - Thêm hoặc bỏ yêu thích.
  - Thêm vào so sánh.
- Giới hạn danh sách so sánh tối đa 3 máy.
- Có nút làm lại quiz, xem tất cả laptop và đến trang so sánh.

Giao diện:

- Header kết quả dạng card nổi bật.
- Lưới cấu hình khuyến nghị.
- Danh sách `ResultCard`.
- Trạng thái rỗng nếu chưa có kết quả.

### 4.6 Danh sách laptop `/laptops`

Chức năng:

- Tải danh sách laptop có phân trang.
- Tìm kiếm theo tên laptop, có debounce 500ms.
- Lọc laptop theo:
  - Hãng sản xuất.
  - Phân khúc giá.
  - Nhu cầu sử dụng.
  - CPU.
  - RAM.
  - Ổ cứng.
  - Card đồ họa.
  - Kích thước màn hình.
  - Độ phân giải.
  - Tính năng đặc biệt.
- Sắp xếp theo:
  - Mới nhất.
  - Giá thấp đến cao.
  - Giá cao đến thấp.
  - RAM cao đến thấp.
  - SSD cao đến thấp.
  - CPU mạnh nhất.
- Xóa toàn bộ bộ lọc.
- Mở/thu gọn panel bộ lọc.
- Hiển thị số bộ lọc đang active.
- Phân trang bằng nút trước/sau.
- Thêm hoặc bỏ yêu thích.
- Thêm laptop vào danh sách so sánh.

Giao diện:

- Tiêu đề và tổng số laptop tìm thấy.
- Dropdown sắp xếp.
- Khối bộ lọc với chip lựa chọn.
- Các nhóm bộ lọc có thể thu gọn.
- Lưới card laptop responsive.
- Trạng thái loading, lỗi và không tìm thấy kết quả.

### 4.7 Chi tiết laptop `/laptops/:id`

Chức năng:

- Tải thông tin chi tiết laptop theo id.
- Kiểm tra laptop có nằm trong danh sách yêu thích của người dùng không.
- Thêm hoặc bỏ yêu thích.
- Thêm laptop vào danh sách so sánh.
- Mở link mua hàng nếu có `shop_url`.
- Hiển thị ưu điểm, nhược điểm, nhóm phù hợp và tags.

Thông tin hiển thị:

- Ảnh laptop.
- Hãng.
- Tên máy.
- Giá.
- CPU.
- RAM.
- SSD.
- Màn hình.
- Cân nặng.
- Bảo hành.
- Ưu điểm.
- Nhược điểm.
- Phù hợp với.
- Tags.

### 4.8 So sánh laptop `/compare`

Chức năng:

- Đọc danh sách laptop so sánh từ `localStorage`.
- Giới hạn tối đa 3 laptop.
- Cần ít nhất 2 laptop để hiển thị bảng so sánh.
- Xóa từng laptop khỏi danh sách so sánh.
- Xóa toàn bộ danh sách so sánh.
- Nếu chưa đủ laptop, gợi ý thêm từ danh sách laptop hoặc kết quả quiz.

Giao diện:

- Header với số lượng máy đang so sánh.
- Trạng thái rỗng/chưa đủ máy.
- Bảng so sánh laptop qua component `CompareTable`.

### 4.9 Laptop yêu thích `/favorites`

Chức năng:

- Tải danh sách laptop yêu thích của người dùng.
- Hiển thị số lượng laptop đã lưu.
- Xem chi tiết laptop yêu thích.
- Xóa laptop khỏi danh sách yêu thích.
- Nếu chưa có laptop yêu thích, hiển thị CTA khám phá laptop.

Giao diện:

- Danh sách dạng card ngang.
- Ảnh nhỏ, hãng, tên, giá, cấu hình tóm tắt.
- Nút chi tiết và nút xóa.

### 4.10 Lịch sử quiz `/history`

Chức năng:

- Tải lịch sử làm quiz của người dùng.
- Hiển thị số lần làm quiz.
- Mỗi lần quiz hiển thị:
  - Nhóm người dùng.
  - Thời gian tạo.
  - Tóm tắt kết quả.
- Có thể mở rộng từng lịch sử để xem các laptop từng được gợi ý.
- Hiển thị điểm phù hợp của từng laptop trong lần gợi ý đó.

Giao diện:

- Danh sách lịch sử dạng card.
- Nút mở rộng/thu gọn.
- Trạng thái rỗng nếu chưa làm quiz.

### 4.11 Hồ sơ cá nhân `/profile`

Chức năng:

- Hiển thị thông tin người dùng:
  - Avatar chữ cái đầu.
  - Họ tên.
  - Email.
  - Vai trò.
- Cho phép cập nhật họ tên.
- Email và vai trò chỉ đọc.
- Hiển thị thông báo thành công hoặc lỗi.

Giao diện:

- Card hồ sơ.
- Form cập nhật họ tên.
- Badge vai trò người dùng hoặc quản trị viên.

## 5. Chức năng quản trị

### 5.1 Admin Dashboard `/admin`

Chức năng:

- Chỉ admin được truy cập.
- Hiển thị thống kê:
  - Tổng số laptop trong hệ thống.
  - Tổng số câu hỏi quiz.
- Điều hướng nhanh đến:
  - Quản lý laptop.
  - Quản lý quiz.

Giao diện:

- Header Admin Dashboard.
- Hai card thống kê lớn.
- Nút quản lý tương ứng trong từng card.

### 5.2 Quản lý laptop `/admin/laptops`

Chức năng:

- Tải danh sách laptop.
- Thêm laptop mới.
- Sửa laptop hiện có.
- Xóa laptop sau khi xác nhận.
- Validate tối thiểu tên máy, hãng và giá.

Trường dữ liệu trong form:

- Tên máy.
- Hãng.
- Giá.
- CPU.
- CPU Score.
- RAM.
- SSD.
- GPU.
- GPU Type: integrated hoặc dedicated.
- Màn hình.
- Screen Score.
- Battery Score.
- Cân nặng.
- Bảo hành.
- Link ảnh.
- Link mua hàng.
- Có thể nâng cấp.
- Phù hợp với.
- Tags.
- Ưu điểm.
- Nhược điểm.

Giao diện:

- Nút thêm laptop.
- Form thêm/sửa dạng lưới.
- Bảng laptop gồm tên, hãng, giá, CPU, RAM/SSD và thao tác.
- Nút sửa và xóa trên từng dòng.

### 5.3 Quản lý quiz `/admin/quiz`

Chức năng:

- Tải danh sách câu hỏi quiz.
- Thêm câu hỏi mới.
- Sửa câu hỏi.
- Xóa câu hỏi sau khi xác nhận.
- Bật/tắt trạng thái hoạt động của câu hỏi.
- Quản lý danh sách lựa chọn cho từng câu hỏi.

Trường dữ liệu trong form:

- `questionKey`: khóa định danh câu hỏi.
- `questionGroup`: nhóm câu hỏi, ví dụ `common`, `it_student`, `gamer`.
- Nội dung câu hỏi.
- Loại câu hỏi: `single` hoặc `multiple`.
- Thứ tự hiển thị.
- Trạng thái kích hoạt.
- Các lựa chọn gồm label hiển thị và value gửi lên hệ thống.

Giao diện:

- Nút thêm câu hỏi.
- Form thêm/sửa.
- Danh sách option có thể thêm hoặc xóa.
- Bảng câu hỏi gồm câu hỏi, key, nhóm, loại, trạng thái và thao tác.

## 6. Điều hướng và layout

### 6.1 Main layout

Áp dụng cho các trang chính sau khi không nằm trong auth layout.

Thành phần:

- Navbar cố định trên đầu.
- Khu vực nội dung chính.
- Footer.

### 6.2 Navbar desktop

Khi chưa đăng nhập:

- Trang chủ.
- Đăng nhập.
- Đăng ký.

Khi đã đăng nhập:

- Trang chủ.
- Làm Quiz.
- Laptop.
- So sánh.
- Tài khoản.
- Đăng xuất.
- Link Admin nếu người dùng có vai trò admin.

### 6.3 Navbar mobile

Chức năng:

- Nút mở/đóng menu.
- Hiển thị các link chính theo trạng thái đăng nhập.
- Với người dùng đã đăng nhập có thêm:
  - Tài khoản của tôi.
  - Laptop yêu thích.
  - Lịch sử Quiz.
  - Đăng xuất.
  - Admin Dashboard nếu là admin.

### 6.4 Auth layout

Áp dụng cho:

- `/login`
- `/register`

Đặc điểm:

- Nền xám nhạt.
- Logo EasyLap ở giữa.
- Card form trắng.
- Nếu đã đăng nhập mà vào auth route thì tự chuyển về trang chủ.

## 7. Backend API

Backend dùng Express, Supabase và JWT/access token từ Supabase Auth. Các route chính đều nằm dưới tiền tố `/api`.

### 7.1 Health check

- `GET /`
  - Kiểm tra API đang chạy.
- `GET /api/health`
  - Kiểm tra trạng thái server.

### 7.2 Auth API

- `POST /api/auth/register`
  - Đăng ký tài khoản.
  - Có rate limit.
  - Validate bằng schema đăng ký.
- `POST /api/auth/login`
  - Đăng nhập.
  - Trả về access token, refresh token và thông tin user.
  - Có rate limit.
- `POST /api/auth/logout`
  - Đăng xuất.
  - Yêu cầu đăng nhập.
- `GET /api/auth/me`
  - Lấy thông tin người dùng hiện tại.
  - Yêu cầu đăng nhập.

### 7.3 Laptop API

Tất cả route laptop yêu cầu đăng nhập.

- `GET /api/laptops`
  - Lấy danh sách laptop.
  - Hỗ trợ tìm kiếm, lọc, sắp xếp và phân trang.
- `GET /api/laptops/filters/options`
  - Lấy các lựa chọn bộ lọc có kèm số lượng.
- `GET /api/laptops/:id`
  - Lấy chi tiết laptop theo id.

### 7.4 Quiz API

Tất cả route quiz yêu cầu đăng nhập.

- `GET /api/quiz/questions/common`
  - Lấy câu hỏi chung.
- `GET /api/quiz/questions/:group`
  - Lấy câu hỏi theo nhóm người dùng.
  - Backend kiểm tra nhóm hợp lệ trước khi trả dữ liệu.

### 7.5 Recommendation API

- `POST /api/recommend`
  - Yêu cầu đăng nhập.
  - Có rate limit riêng.
  - Nhận `commonAnswers` và `specificAnswers`.
  - Tính điểm laptop.
  - Lưu lịch sử quiz.
  - Lưu danh sách recommendation.
  - Trả về cấu hình khuyến nghị, tóm tắt và top laptop phù hợp.

Payload chính:

```json
{
  "commonAnswers": {
    "userGroup": "it_student",
    "budget": "15-20",
    "mobility": "medium",
    "usageYears": "3-4",
    "priorities": ["performance", "upgradeable"]
  },
  "specificAnswers": {}
}
```

### 7.6 User API

Tất cả route user yêu cầu đăng nhập.

- `GET /api/users/me`
  - Lấy hồ sơ người dùng hiện tại.
- `PUT /api/users/me`
  - Cập nhật hồ sơ.
- `GET /api/users/me/history`
  - Lấy lịch sử làm quiz.
- `GET /api/users/me/favorites/ids`
  - Lấy danh sách id laptop yêu thích.
- `GET /api/users/me/favorites`
  - Lấy danh sách laptop yêu thích đầy đủ.
- `POST /api/users/me/favorites`
  - Thêm laptop vào yêu thích.
- `DELETE /api/users/me/favorites/:laptopId`
  - Xóa laptop khỏi yêu thích.

### 7.7 Admin API

Tất cả route admin yêu cầu đăng nhập và vai trò admin.

- `POST /api/admin/laptops`
  - Tạo laptop.
- `PUT /api/admin/laptops/:id`
  - Cập nhật laptop.
- `DELETE /api/admin/laptops/:id`
  - Xóa laptop.
- `POST /api/admin/quiz/questions`
  - Tạo câu hỏi quiz.
- `PUT /api/admin/quiz/questions/:id`
  - Cập nhật câu hỏi quiz.
- `DELETE /api/admin/quiz/questions/:id`
  - Xóa câu hỏi quiz.

## 8. Logic gợi ý laptop

### 8.1 Quy trình xử lý

1. Nhận câu trả lời của người dùng.
2. Xác định nhóm người dùng và ngân sách.
3. Lọc laptop theo khoảng ngân sách.
4. Tính điểm từng laptop bằng hàm `calculateScore`.
5. Sắp xếp laptop theo điểm giảm dần.
6. Lấy top 5 laptop.
7. Tạo cấu hình khuyến nghị theo nhóm người dùng.
8. Tạo đoạn tóm tắt kết quả.
9. Lưu lần làm quiz vào bảng `quiz_attempts`.
10. Lưu từng laptop đề xuất vào bảng `recommendations`.
11. Trả kết quả về frontend.

### 8.2 Các nhóm tiêu chí chấm điểm

Điểm cuối cùng được quy về thang 0-100, dựa trên các nhóm tiêu chí:

- `N`: Mức khớp nhu cầu, dựa trên tags và `suitable_for`.
- `G`: Mức khớp ngân sách.
- `P`: Hiệu năng, dựa trên CPU, RAM, SSD, GPU.
- `W`: Khả năng di chuyển, dựa trên pin và cân nặng.
- `D`: Độ bền/khả năng nâng cấp.
- `F`: Tính năng bổ sung theo nhóm, ví dụ màn hình chuẩn màu, webcam tốt, tản nhiệt tốt, tần số quét cao.

Công thức chính:

```text
rawScore = 0.4 * N + 0.25 * G + 0.15 * perfFactor + 0.1 * W + 0.1 * D
finalScore = rawScore * 10
```

### 8.3 Cấu hình khuyến nghị theo nhóm

Hệ thống tạo cấu hình đề xuất riêng cho từng nhóm:

- Sinh viên IT: ưu tiên Core i5/Ryzen 5 trở lên, RAM 16GB, SSD 512GB, có thể nâng cấp.
- Sinh viên tài chính: ưu tiên máy tiết kiệm điện, RAM 8-16GB, SSD 256-512GB, pin tốt, nhẹ.
- Sinh viên thiết kế: ưu tiên CPU dòng H, RAM 16-32GB, SSD 512GB, GPU rời, màn hình chuẩn màu.
- Nhân viên văn phòng: ưu tiên Core i5/Ryzen 5, RAM 8-16GB, SSD 256-512GB, mỏng nhẹ, webcam/mic tốt.
- Gamer: ưu tiên CPU dòng H/HX, RAM 16GB, SSD 512GB, GPU RTX 3050/4050 trở lên, tản nhiệt tốt.
- Content creator: ưu tiên Core i7/i9 hoặc Ryzen 7/9, RAM 16-32GB, SSD 512GB-1TB, GPU RTX 3060/4060 trở lên.
- Beginner: ưu tiên Core i3/i5 hoặc Ryzen 3/5, RAM 8GB, SSD 256-512GB, dễ dùng và dễ bảo hành.

### 8.4 Lý do phù hợp và điểm đánh đổi

Với mỗi laptop được đề xuất, backend tạo:

- `matchReasons`: lý do máy phù hợp, ví dụ RAM 16GB, SSD 512GB, đúng ngân sách, nhẹ, có GPU rời, có thể nâng cấp.
- `tradeOffs`: điểm cần cân nhắc, ví dụ máy nặng, pin không lâu, không có GPU rời, màn hình chưa tối ưu cho thiết kế, không nâng cấp được.

## 9. Database Supabase

### 9.1 Bảng `profiles`

Lưu hồ sơ người dùng.

Trường chính:

- `id`
- `full_name`
- `email`
- `role`
- `created_at`
- `updated_at`

### 9.2 Bảng `laptops`

Lưu dữ liệu laptop.

Trường chính:

- Thông tin định danh: `id`, `external_id`, `name`, `brand`, `type_name`.
- Giá: `price`, `price_usd`, `price_vnd`, `price_vnd_million`.
- CPU/GPU/RAM/SSD: `cpu`, `cpu_score`, `ram`, `ssd`, `gpu`, `gpu_type`, `dedicated_gpu`.
- Màn hình: `screen`, `inches`, `x_res`, `y_res`, `ppi`, `ips`, `touch_screen`, `screen_score`.
- Di chuyển: `weight`, `battery_score`.
- Khác: `upgradeable`, `warranty`, `suitable_for`, `tags`, `pros`, `cons`, `image_url`, `shop_url`.

### 9.3 Bảng `quiz_questions`

Lưu câu hỏi quiz.

Trường chính:

- `question_key`
- `question`
- `question_group`
- `type`
- `options`
- `display_order`
- `is_active`

### 9.4 Bảng `quiz_attempts`

Lưu mỗi lần người dùng làm quiz.

Trường chính:

- `user_id`
- `user_group`
- `common_answers`
- `specific_answers`
- `summary`
- `recommended_config`
- `created_at`

### 9.5 Bảng `recommendations`

Lưu laptop được gợi ý cho từng lần quiz.

Trường chính:

- `quiz_attempt_id`
- `user_id`
- `laptop_id`
- `final_score`
- `match_reasons`
- `trade_offs`

### 9.6 Bảng `favorite_laptops`

Lưu laptop yêu thích của người dùng.

Trường chính:

- `user_id`
- `laptop_id`
- `created_at`

Bảng có ràng buộc unique trên cặp `user_id` và `laptop_id` để tránh lưu trùng.

## 10. Bảo mật và kiểm soát truy cập

### 10.1 Frontend

- Token được lưu qua tiện ích `authStorage`.
- Axios tự gắn `Authorization: Bearer <token>` vào request.
- Nếu API trả 401, frontend xóa token và chuyển về `/login`.
- Route riêng tư được bọc bằng `PrivateRoute`.
- Route admin được bọc bằng `AdminRoute`.

### 10.2 Backend

- Dùng `helmet` để tăng bảo mật HTTP headers.
- Cấu hình CORS cho local, domain production và Vercel preview.
- Có rate limit chung cho `/api`.
- Có rate limit riêng cho auth và recommendation.
- Validate dữ liệu bằng `zod`.
- Middleware `requireAuth` bảo vệ route cần đăng nhập.
- Middleware `requireAdmin` bảo vệ route quản trị.

### 10.3 Database

Supabase bật Row Level Security cho:

- `profiles`
- `laptops`
- `quiz_questions`
- `quiz_attempts`
- `recommendations`
- `favorite_laptops`

Chính sách chính:

- Người dùng chỉ xem/cập nhật hồ sơ của chính mình.
- Người dùng đã đăng nhập được xem laptop và câu hỏi quiz active.
- Chỉ admin được thay đổi laptop và câu hỏi quiz.
- Người dùng chỉ xem/lưu/xóa dữ liệu lịch sử, recommendation và yêu thích của chính mình.

## 11. Công nghệ sử dụng

### 11.1 Frontend

- React.
- Vite.
- React Router.
- Axios.
- Tailwind CSS.
- Lucide React icons.

### 11.2 Backend

- Node.js.
- Express.
- Supabase JS.
- Zod.
- Helmet.
- CORS.
- Morgan.
- Express Rate Limit.
- CSV Parser cho import dữ liệu laptop.

### 11.3 Database và auth

- Supabase PostgreSQL.
- Supabase Auth.
- Row Level Security.

## 12. Cấu hình môi trường

Backend cần các biến môi trường:

```env
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:5173
CORS_ORIGINS=
SUPABASE_URL=
SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
JWT_SECRET=
```

Frontend dùng:

```env
VITE_API_URL=http://localhost:5000/api
```

Nếu không có `VITE_API_URL`, frontend mặc định gọi `http://localhost:5000/api`.

## 13. Lệnh chạy dự án

### 13.1 Backend

```bash
cd backend
npm install
npm run dev
```

Hoặc chạy production:

```bash
cd backend
npm start
```

Import dữ liệu laptop từ CSV:

```bash
cd backend
npm run import:laptops
```

### 13.2 Frontend

```bash
cd frontend
npm install
npm run dev
```

Build frontend:

```bash
cd frontend
npm run build
```

Lint frontend:

```bash
cd frontend
npm run lint
```

## 14. Prototype tĩnh ở thư mục gốc

Ngoài ứng dụng React/Express chính, thư mục gốc còn có prototype tĩnh:

- `index.html`
- `style.css`
- `app.js`
- `data.js`

Prototype này có các màn hình:

- Trang chủ LaptopMatchVN/EasyLap.
- Quiz phân nhánh.
- Trang kết quả.
- So sánh laptop.
- Kiến thức 5 phút.

Prototype dùng dữ liệu laptop mẫu trong `data.js`, không cần backend và không có hệ thống tài khoản. Đây phù hợp để demo ý tưởng ban đầu hoặc trình bày giao diện nhanh.

## 15. Tóm tắt danh sách màn hình

| Màn hình | Đường dẫn | Quyền truy cập | Chức năng chính |
|---|---|---|---|
| Trang chủ | `/` | Công khai | Giới thiệu EasyLap, CTA làm quiz |
| Đăng nhập | `/login` | Chưa đăng nhập | Đăng nhập tài khoản |
| Đăng ký | `/register` | Chưa đăng nhập | Tạo tài khoản |
| Quiz | `/quiz` | Đã đăng nhập | Làm bài tư vấn laptop |
| Kết quả | `/result` | Đã đăng nhập | Xem cấu hình khuyến nghị và laptop phù hợp |
| Danh sách laptop | `/laptops` | Đã đăng nhập | Tìm kiếm, lọc, sắp xếp laptop |
| Chi tiết laptop | `/laptops/:id` | Đã đăng nhập | Xem thông số, ưu/nhược điểm, yêu thích, so sánh |
| So sánh | `/compare` | Đã đăng nhập | So sánh tối đa 3 laptop |
| Yêu thích | `/favorites` | Đã đăng nhập | Quản lý laptop đã lưu |
| Lịch sử | `/history` | Đã đăng nhập | Xem lịch sử làm quiz |
| Hồ sơ | `/profile` | Đã đăng nhập | Xem và cập nhật thông tin cá nhân |
| Admin Dashboard | `/admin` | Admin | Thống kê và điều hướng quản trị |
| Quản lý laptop | `/admin/laptops` | Admin | Thêm, sửa, xóa laptop |
| Quản lý quiz | `/admin/quiz` | Admin | Thêm, sửa, xóa câu hỏi quiz |

## 16. Tóm tắt giá trị của hệ thống

EasyLap giúp người dùng không rành laptop vẫn có thể chọn máy phù hợp bằng cách:

- Chuyển nhu cầu đời thường thành tiêu chí kỹ thuật.
- Gợi ý cấu hình phù hợp theo từng nhóm người dùng.
- Chấm điểm laptop dựa trên nhu cầu, ngân sách, hiệu năng, di chuyển và khả năng nâng cấp.
- Giải thích lý do nên chọn và điểm cần đánh đổi.
- Cho phép lưu yêu thích, so sánh và xem lại lịch sử tư vấn.
- Cung cấp khu quản trị để cập nhật dữ liệu laptop và câu hỏi quiz linh hoạt.
