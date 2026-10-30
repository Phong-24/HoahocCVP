/*
  Cấu hình công khai của trang (không chứa mật khẩu hay khóa bí mật).
  Thầy chỉ sửa các giá trị trong dấu "" theo hướng dẫn ở docs/HUONG-DAN.md.
  Khi supabaseUrl còn trống, trang chạy ở CHẾ ĐỘ MẪU: dữ liệu lưu tạm trên trình duyệt, thanh toán là mô phỏng.
*/
window.HHTP_CONFIG = {
  supabaseUrl: "",
  supabaseAnonKey: "",

  /* Link Google Form cho 3 mục Đăng ký học */
  forms: {
    online: "",
    "1-1": "",
    "doi-tuyen": ""
  },

  /* Thông tin hiện ở chân trang */
  zalo: "",
  bctNotice: ""
};
