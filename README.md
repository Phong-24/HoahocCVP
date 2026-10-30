# Hóa Học Thầy Phòng

Trang web học Hóa của thầy Phòng: bài tập (Cơ bản / Nâng cao, có tìm kiếm, ghi nhớ bài làm), Khóa học hiện hành, Hỏi đáp, Tài liệu, Mua tài liệu, Đăng ký học, Gói thành viên (VIP, Học viên), Giới thiệu thầy và trang Quản trị.

## Cấu trúc

| Thư mục | Nội dung |
|---|---|
| `site/` | Trang web (HTML, CSS, JavaScript). Cloudflare Pages phục vụ thư mục này. |
| `site/config.js` | Cấu hình công khai: địa chỉ Supabase, link Google Form, số Zalo. |
| `supabase/schema.sql` | Cơ sở dữ liệu: bảng, phân quyền, hàm (giá, quyền xem tài liệu, mã kích hoạt, đơn hàng). |
| `docs/HUONG-DAN.md` | Hướng dẫn từng bước đưa trang lên mạng. |

## Trạng thái

- Đã có: giao diện đầy đủ; cơ sở dữ liệu Supabase; đăng nhập email và Google; thanh toán QR tự động qua SePay.
- Đang làm: nối giao diện với Supabase (đăng nhập, lưu bài làm, bình luận, hỏi đáp, đánh giá, quản trị), thanh toán QR, PDF đóng dấu tên, video Bunny Stream.

Khi `supabaseUrl` trong `site/config.js` còn trống, trang chạy ở chế độ mẫu: dữ liệu lưu tạm trên trình duyệt, thanh toán là mô phỏng.
