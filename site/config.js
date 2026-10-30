/*
  Cấu hình công khai của trang (không chứa mật khẩu hay khóa bí mật).
  Thầy chỉ sửa các giá trị trong dấu "" theo hướng dẫn ở docs/HUONG-DAN.md.
  Khi supabaseUrl còn trống, trang chạy ở CHẾ ĐỘ MẪU: dữ liệu lưu tạm trên trình duyệt, thanh toán là mô phỏng.
*/
window.HHTP_CONFIG = {
  supabaseUrl: "https://gslzetfiospsuveufmpr.supabase.co",
  supabaseAnonKey: "sb_publishable_a2C6G585tACFQpTgdxXUEw_PXxi4S58",

  /* Link Google Form cho 3 mục Đăng ký học */
  forms: {
    online: "",
    "1-1": "",
    "doi-tuyen": ""
  },

  /* Tài khoản nhận tiền (hiện trên mã QR). bin: mã ngân hàng theo VietQR, ví dụ MB = 970422, Vietcombank = 970436 */
  bank: {
    bin: "",
    bankName: "",
    accountNo: "",
    accountName: ""
  },

  /* Thông tin hiện ở chân trang */
  zalo: "",
  bctNotice: ""
};
