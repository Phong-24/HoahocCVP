# Hướng dẫn đưa trang lên mạng

Làm lần lượt từng bước. Xong bước nào thì báo Claude để kiểm tra rồi làm tiếp.
Giao diện các trang dịch vụ có thể đổi chút ít; nếu không thấy đúng tên nút, chụp màn hình gửi Claude.

**Quy tắc an toàn:** mật khẩu, khóa bí mật (secret key, service_role key) chỉ thầy giữ và tự dán vào trang cài đặt của dịch vụ. Không gửi qua chat, không dán vào mã nguồn trên GitHub.

---

## Bước 1. Đưa trang lên Cloudflare Pages (chế độ mẫu)

Sau bước này trang đã có địa chỉ thật dạng `ten-du-an.pages.dev`, chạy giống bản mẫu (chưa có tài khoản thật, thanh toán là mô phỏng).

1. Vào https://dash.cloudflare.com/sign-up, đăng ký tài khoản Cloudflare (miễn phí) bằng email của thầy.
2. Trong trang quản lý, chọn **Workers & Pages** → **Create** (Tạo) → thẻ **Pages** → **Import an existing Git repository** (Kết nối Git).
3. Chọn **GitHub**, đăng nhập tài khoản **Phong-24**, cho phép Cloudflare truy cập kho **HoahocCVP**.
4. Chọn kho **HoahocCVP** → **Begin setup**, điền:
   - **Project name:** `hoahoccvp` (tên này thành địa chỉ `hoahoccvp.pages.dev`)
   - **Production branch:** `main`
   - **Framework preset:** `None`
   - **Build command:** để trống
   - **Build output directory:** `site`
5. Bấm **Save and Deploy**. Chờ khoảng 1 phút, Cloudflare báo **Success** và hiện địa chỉ trang.
6. Mở địa chỉ đó trên điện thoại và máy tính, gửi địa chỉ cho Claude.

Từ giờ mỗi khi Claude cập nhật mã trên GitHub, Cloudflare tự đưa bản mới lên sau khoảng 1 phút.

---

## Bước 2. Tạo cơ sở dữ liệu Supabase

Supabase giữ tài khoản người dùng, bài làm, bình luận, đơn hàng…

1. Vào https://supabase.com, bấm **Start your project**, đăng nhập bằng GitHub (tài khoản Phong-24).
2. **New project**:
   - **Name:** `hoahoccvp`
   - **Database Password:** bấm **Generate a password**, chép lại và cất kỹ (sổ tay, trình quản lý mật khẩu). Không gửi cho ai.
   - **Region:** `Southeast Asia (Singapore)` (gần Việt Nam nhất, trang chạy nhanh hơn)
   - Gói **Free**
3. Chờ dự án tạo xong (1–2 phút).
4. Mở menu bên trái → **SQL Editor** → **New query**.
5. Mở file `supabase/schema.sql` trong kho GitHub (bấm vào file → nút **Copy raw file**), dán toàn bộ vào ô soạn thảo → bấm **Run**. Thấy dòng **Success. No rows returned** là xong.
6. Mở **Project Settings** (bánh răng) → **API** (hoặc **Data API** / **API Keys**), tìm 2 giá trị:
   - **Project URL** (dạng `https://xxxx.supabase.co`)
   - **anon public** key (chuỗi dài bắt đầu bằng `eyJ...`, hoặc khóa dạng `sb_publishable_...`)

   Hai giá trị này là loại **công khai**, được phép gửi cho Claude để gắn vào trang.
   **Không** gửi khóa **service_role** / **secret**.

Gửi Claude: địa chỉ trang ở Bước 1, Project URL và anon public key ở Bước 2.

---

## Các bước tiếp theo (Claude sẽ gửi hướng dẫn chi tiết khi tới lượt)

3. Bật đăng nhập Google (và Zalo nếu cần) trong Supabase.
4. Đặt tài khoản của thầy làm quản trị.
5. Tạo kho lưu file PDF (Cloudflare R2) và thư viện video (Bunny Stream).
6. Kết nối nhận tiền QR tự động vào tài khoản ngân hàng cá nhân.
7. Mua và gắn tên miền riêng.
8. Gắn link 3 Google Form đăng ký học, số Zalo, thông tin giới thiệu.
