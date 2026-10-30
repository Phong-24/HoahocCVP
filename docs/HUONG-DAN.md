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

## Bước 3. Nạp dữ liệu ban đầu và cập nhật cơ sở dữ liệu

1. Supabase → **SQL Editor** → **New query**.
2. Dán toàn bộ file `supabase/buoc3.sql` (Claude gửi kèm) → **Run** → nếu hỏi thì chọn **Run and enable RLS**.
   File này cập nhật cơ sở dữ liệu và nạp bài tập, tài liệu, khóa học mẫu. **Chỉ chạy một lần** (chạy lần nữa sẽ nhân đôi bài mẫu).

## Bước 4. Bật đăng nhập bằng email

1. Supabase → **Authentication** → **URL Configuration**.
2. **Site URL:** `https://hoahoccvp.pages.dev` → **Save**.
3. **Redirect URLs** → **Add URL:** `https://hoahoccvp.pages.dev/**` → **Save**.

Lưu ý: dịch vụ gửi email có sẵn của Supabase chỉ gửi được vài email mỗi giờ, đủ để thử. Trước khi mở cho học sinh sẽ bật đăng nhập Google (không giới hạn).

## Bước 5. Đặt tài khoản của thầy làm quản trị

1. Mở https://hoahoccvp.pages.dev → **Đăng nhập** → nhập email của thầy → mở hộp thư, bấm link **Log In**.
2. Quay lại Supabase → **SQL Editor** → **New query**, dán dòng dưới (thay email của thầy) → **Run**:

   ```sql
   update profiles set is_teacher = true where id = (select id from auth.users where email = 'EMAIL_CUA_THAY@gmail.com');
   ```
3. Tải lại trang: góc trên hiện **Thầy · Quản trị**, menu có thêm **Quản trị**.

---

## Bước 6. Đăng nhập bằng Google

**Phần A – Google Cloud** (dùng tài khoản Google của thầy):

1. Vào https://console.cloud.google.com → đồng ý điều khoản nếu được hỏi.
2. Góc trên bên trái bấm ô chọn dự án → **New project** → tên `hoahoccvp` → **Create**. Chọn dự án vừa tạo.
3. Ô tìm kiếm trên cùng gõ **Google Auth Platform** (hoặc **OAuth consent screen**) → **Get started**:
   - **App name:** `Hóa Học Thầy Phòng`; **User support email:** email của thầy → **Next**
   - **Audience:** **External** → **Next**
   - **Contact information:** email của thầy → **Next** → tick đồng ý → **Create**
4. Mục **Audience** → bấm **Publish app** → **Confirm** (để mọi học sinh đăng nhập được, không chỉ tài khoản thử).
5. Mục **Clients** → **Create client**:
   - **Application type:** `Web application`; **Name:** `hoahoccvp`
   - **Authorized JavaScript origins** → **Add URI:** `https://hoahoccvp.pages.dev`
   - **Authorized redirect URIs** → **Add URI:** `https://gslzetfiospsuveufmpr.supabase.co/auth/v1/callback`
   - **Create** → hiện **Client ID** và **Client secret**. Giữ cửa sổ này mở (hoặc tải file JSON về).

**Phần B – Supabase:**

6. Supabase → **Authentication** → **Sign In / Providers** → **Google** → bật **Enable Sign in with Google**.
7. Dán **Client ID** và **Client Secret** (thầy tự dán, không gửi qua chat) → **Save**.
8. Mở trang web → **Đăng nhập** → **Đăng nhập bằng Google** để thử.

---

## Bước 7. Nhận tiền QR tự động (SePay)

Khi học sinh chuyển khoản đúng nội dung (mã đơn dạng `HHTP123456`), SePay báo cho trang và trang tự mở quyền.

**Phần A – Supabase**
1. **SQL Editor** → **New query** → dán lại toàn bộ file `supabase/schema.sql` (bản mới) → **Run** (chạy lại an toàn, không mất dữ liệu). **Không** chạy lại `buoc3.sql`.
2. **Project Settings** → **API Keys** → mục **Secret keys** → bấm hiện và **sao chép** khóa `sb_secret_...` (chỉ dán vào Cloudflare ở Phần C, không gửi qua chat).

**Phần B – SePay**
3. Đăng ký tại https://my.sepay.vn, xem mục gói dịch vụ để chọn gói phù hợp.
4. **Ngân hàng** → **Kết nối tài khoản** → chọn ngân hàng của thầy, chọn loại **cá nhân**, làm theo hướng dẫn xác thực.
5. (Nên làm) **Cấu hình công ty** → **Cấu trúc mã thanh toán**: tiền tố `HHTP`, phần số dài `6`.
6. **Webhooks** → **Thêm webhook**:
   - **Bắn webhook khi:** Có tiền vào
   - **Gọi đến URL:** `https://hoahoccvp.pages.dev/api/sepay-webhook`
   - **Kiểu chứng thực:** **API Key** → tạo một chuỗi dài, ngẫu nhiên (hoặc dùng chuỗi SePay tạo) và **chép lại**
   - **Request Content type:** `application/json`
   - **Lưu**

**Phần C – Cloudflare Pages**
7. Cloudflare → **Workers & Pages** → dự án **hoahoccvp** → **Settings** → **Variables and Secrets** → **Add**, thêm 3 biến (môi trường **Production**):
   - `SUPABASE_URL` (Type: Text) = `https://gslzetfiospsuveufmpr.supabase.co`
   - `SUPABASE_SERVICE_KEY` (Type: **Secret**) = khóa `sb_secret_...` ở bước 2
   - `SEPAY_API_KEY` (Type: **Secret**) = API Key ở bước 6
   → **Save**.
8. **Deployments** → bản mới nhất → **⋯** → **Retry deployment** (để trang nhận biến mới).

**Phần D – Gửi Claude** thông tin hiện trên mã QR (đây là thông tin công khai khi người khác chuyển khoản):
ngân hàng, số tài khoản, tên chủ tài khoản (viết không dấu như trên app ngân hàng).

---

## Các bước tiếp theo (Claude sẽ gửi hướng dẫn chi tiết khi tới lượt)

7. Tạo kho lưu file PDF (Cloudflare R2) và thư viện video (Bunny Stream).
9. Mua và gắn tên miền riêng.
10. Gắn link 3 Google Form đăng ký học, số Zalo, thông tin giới thiệu.
