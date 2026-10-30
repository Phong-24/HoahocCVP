(function () {
  "use strict";
  /* ================= dữ liệu ================= */
  var BASIC = [
    { id: "b1", g: "Hóa sinh", t: "Glycine có pK₁ = 2,34 (α-COOH) và pK₂ = 9,60 (α-NH₃⁺). Điểm đẳng điện pI của glycine bằng", o: ["5,97", "6,97", "4,67", "7,00"], a: 0,
      e: "Chuỗi bên trung tính nên pI = (pK₁ + pK₂)/2 = (2,34 + 9,60)/2 = 5,97." },
    { id: "b2", g: "Hóa sinh", t: "Khi đun với ninhydrin, amino acid nào cho màu vàng thay vì tím xanh?", o: ["Glycine", "Proline", "Tyrosine", "Lysine"], a: 1,
      e: "Proline là amin bậc hai, tạo sản phẩm iminium màu vàng (≈ 440 nm)." },
    { id: "b3", g: "Cấu tạo chất", t: "Số ancol đồng phân cấu tạo ứng với công thức C₄H₁₀O là", o: ["3", "4", "5", "7"], a: 1,
      e: "Butan-1-ol, butan-2-ol, 2-metylpropan-1-ol, 2-metylpropan-2-ol: 4 ancol (tính cả ete thì có 7 đồng phân)." },
    { id: "b4", g: "Đại cương", t: "Fe + HNO₃ (loãng) → Fe(NO₃)₃ + NO + H₂O. Tổng hệ số nguyên tối giản của phương trình là", o: ["8", "9", "10", "12"], a: 1,
      e: "Fe + 4HNO₃ → Fe(NO₃)₃ + NO + 2H₂O, tổng hệ số 1 + 4 + 1 + 1 + 2 = 9." },
    { id: "b5", g: "Đại cương", t: "Các dung dịch cùng nồng độ 0,1 M, dung dịch nào có pH nhỏ nhất?", o: ["CH₃COOH", "NH₄Cl", "HCl", "NaHCO₃"], a: 2,
      e: "HCl là axit mạnh, phân li hoàn toàn nên pH = 1, nhỏ nhất trong bốn dung dịch." },
    { id: "b6", g: "Hóa sinh", t: "Phản ứng biuret cho màu tím cần phân tử có tối thiểu bao nhiêu liên kết peptide?", o: ["1", "2", "3", "Không cần"], a: 1,
      e: "Cu²⁺ phối trí với N của ít nhất hai liên kết peptide liền kề, nên từ tripeptide trở lên mới dương tính." },
    { id: "b7", g: "Đại cương", t: "Chất nào sau đây là chất điện li mạnh?", o: ["CH₃COOH", "H₂O", "NaCl", "C₂H₅OH"], a: 2,
      e: "NaCl là muối tan, phân li hoàn toàn trong nước; CH₃COOH và H₂O điện li yếu, C₂H₅OH không điện li." },
    { id: "b8", g: "Cấu tạo chất", t: "Số amin bậc một là đồng phân cấu tạo ứng với công thức C₃H₉N là", o: ["1", "2", "3", "4"], a: 1,
      e: "Propan-1-amin và propan-2-amin: 2 amin bậc một (C₃H₉N có tổng cộng 4 amin)." },
    { id: "b9", g: "Hợp chất cao phân tử", t: "Polime nào sau đây được điều chế bằng phản ứng trùng ngưng?", o: ["Polietilen", "Poli(vinyl clorua)", "Nilon-6,6", "Polistiren"], a: 2,
      e: "Nilon-6,6 tạo từ hexametylenđiamin và axit ađipic, tách nước (trùng ngưng); ba polime còn lại điều chế bằng trùng hợp." },
    { id: "b10", g: "Cơ chế", t: "Phản ứng của CH₃Br với OH⁻ trong dung môi phân cực không proton xảy ra chủ yếu theo cơ chế", o: ["SN1", "SN2", "E1", "E2"], a: 1,
      e: "Cacbon bậc một ít cản trở không gian, tác nhân nucleophin mạnh, dung môi không proton: thuận lợi cho SN2." },
    { id: "b11", g: "Hóa sinh", t: "Glucozơ và fructozơ đều phản ứng với chất nào sau đây?", o: ["Nước brom", "H₂ (Ni, t°)", "Dung dịch NaCl", "Dung dịch HCl loãng"], a: 1,
      e: "Cả hai đều bị khử bởi H₂ (Ni, t°) tạo sobitol; fructozơ không làm mất màu nước brom." },
    { id: "b12", g: "Khác", isNew: true, t: "Ở điều kiện thường, chất nào sau đây là chất khí?", o: ["Metylamin", "Anilin", "Glyxin", "Etanol"], a: 0,
      e: "Metylamin sôi ở khoảng −6 °C nên là chất khí; anilin, etanol là chất lỏng, glyxin là chất rắn." },
    { id: "b13", g: "Đại cương", isNew: true, t: "Cấu hình electron của nguyên tử Fe (Z = 26) là", o: ["[Ar]3d⁶4s²", "[Ar]3d⁵4s¹", "[Ar]3d⁷4s¹", "[Ar]3d⁸"], a: 0,
      e: "Fe có 26 electron: [Ar] (18e) + 3d⁶4s²." }
  ];
  var ADV = [
    { id: "a1", g: "Đại cương", t: "Hòa tan hoàn toàn 5,6 g Fe trong dung dịch HNO₃ loãng, dư, thu được V lít khí NO (đktc, sản phẩm khử duy nhất). Giá trị của V là", o: ["1,12", "2,24", "3,36", "4,48"], a: 1, ans: "V = 2,24 lít",
      s: ["n(Fe) = 5,6 : 56 = 0,1 mol. HNO₃ dư nên Fe lên Fe³⁺.", "Bảo toàn electron: 3·n(Fe) = 3·n(NO) ⇒ n(NO) = 0,1 mol.", "V = 0,1 × 22,4 = 2,24 lít."] },
    { id: "a2", g: "Hóa sinh", t: "Ở pH 6,0, khi điện di, tripeptide Lys–Gly–Glu sẽ", o: ["Di chuyển về cực âm", "Di chuyển về cực dương", "Gần như đứng yên", "Bị thủy phân"], a: 2, ans: "Gần như đứng yên (pI ≈ 6,1)",
      s: ["Các nhóm ion hóa: đầu N (pKa ≈ 8), chuỗi bên Lys (≈ 10,5) mang điện dương; đầu C (≈ 3,5), chuỗi bên Glu (≈ 4,25) mang điện âm.", "Ở pH 6: hai nhóm dương đều bị proton hóa (+2), hai nhóm axit đều đã phân li (−2), điện tích tổng ≈ 0.", "pI ≈ (4,25 + 8)/2 ≈ 6,1, gần pH 6 nên peptide gần như không di chuyển."] },
    { id: "a3", g: "Hóa sinh", t: "Đốt cháy hoàn toàn 0,1 mol một α-amino acid X (phân tử có 1 nhóm NH₂ và 1 nhóm COOH, mạch hở, no) thu được 0,3 mol CO₂. X là", o: ["Glycine", "Alanine", "Valine", "Lysine"], a: 1, ans: "X là alanine",
      s: ["Số nguyên tử C = n(CO₂) : n(X) = 0,3 : 0,1 = 3.", "α-amino acid no, 1 NH₂, 1 COOH có 3 C: CH₃–CH(NH₂)–COOH.", "Vậy X là alanine (Ala)."] },
    { id: "a4", g: "Cơ chế", t: "Đun 2-brom-2-metylbutan với KOH trong etanol, sản phẩm hữu cơ chính là", o: ["2-metylbut-1-en", "2-metylbut-2-en", "3-metylbut-1-en", "2-metylbutan-2-ol"], a: 1, ans: "2-metylbut-2-en",
      s: ["KOH/etanol, đun nóng: ưu tiên phản ứng tách E2.", "H có thể tách ở C1 (CH₃) hoặc C3 (CH₂); theo quy tắc Zaitsev, anken nhiều nhóm thế hơn là sản phẩm chính.", "Sản phẩm chính: (CH₃)₂C=CH–CH₃, tức 2-metylbut-2-en."] }
  ];
  var DOC_CATS = ["Tất cả", "Đề thi HSG QG", "Đề thi IChO", "Đề thi Duyên hải", "Sách", "Chuyên đề khác"];
  var DOCS = [
    { id: "qg1", cat: "Đề thi HSG QG", tag: "Đề thi HSG QG", title: "Đề thi chọn HSG Quốc gia môn Hóa học – ngày thi thứ nhất", pages: 12, acc: "open" },
    { id: "qg2", cat: "Đề thi HSG QG", tag: "Đề thi HSG QG", title: "Đề thi chọn HSG Quốc gia – ngày thi thứ hai, kèm hướng dẫn chấm", pages: 20, acc: "ad" },
    { id: "icho1", cat: "Đề thi IChO", tag: "Đề thi IChO · Bản dịch", title: "Đề thi IChO – phần lý thuyết (bản dịch tiếng Việt)", pages: 28, acc: "ad" },
    { id: "icho2", cat: "Đề thi IChO", tag: "Đề thi IChO · Bản dịch", title: "Bài chuẩn bị IChO (Preparatory Problems) – phần Hữu cơ", pages: 34, acc: "ad" },
    { id: "dh1", cat: "Đề thi Duyên hải", tag: "Đề thi Duyên hải", title: "Đề thi Duyên hải và Đồng bằng Bắc Bộ – Hóa 10", pages: 10, acc: "open" },
    { id: "dh2", cat: "Đề thi Duyên hải", tag: "Đề thi Duyên hải", title: "Đề thi Duyên hải và Đồng bằng Bắc Bộ – Hóa 11, có đáp án", pages: 16, acc: "ad" },
    { id: "sach1", cat: "Sách", tag: "Sách", title: "Sổ tay công thức và phản ứng Hóa học THPT", pages: 64, acc: "ad" },
    { id: "pka", cat: "Chuyên đề khác", tag: "Chuyên đề · Bảng tra", title: "Bảng pKa và pI của 20 amino acid chuẩn", pages: 2, acc: "open" },
    { id: "canbang", cat: "Chuyên đề khác", tag: "Chuyên đề", title: "Cân bằng phản ứng oxi hóa – khử", pages: 18, acc: "ad" },
    { id: "dinhtinh", cat: "Chuyên đề khác", tag: "Chuyên đề", title: "Phản ứng định tính nhận biết amino acid", pages: 10, acc: "ad" }
  ];
  var SHOP_CATS = ["Tất cả", "Bài giảng lý thuyết và bài tập ứng dụng", "Bài tập theo chương", "Các chuyên đề", "Đề thi thử", "Tài liệu khác"];
  var STUDENT_FREE = ["Bài giảng lý thuyết và bài tập ứng dụng", "Bài tập theo chương"];
  var SHOP = [
    { id: "aminofull", dl: 1248, preview: "https://drive.google.com/file/d/MAU/view", cat: "Bài giảng lý thuyết và bài tập ứng dụng", tag: "Bài giảng · Lớp 12", title: "Amino acid và peptide – lý thuyết và bài tập ứng dụng", pages: 38, price: 59000, vids: ["Amino acid: tính axit–bazơ và pI", "Peptide: cấu tạo và thủy phân"] },
    { id: "carbo", dl: 856, cat: "Bài giảng lý thuyết và bài tập ứng dụng", tag: "Bài giảng · Lớp 12", title: "Carbohydrate – lý thuyết và bài tập ứng dụng", pages: 42, price: 69000, vids: ["Monosaccharide và cấu trúc vòng", "Disaccharide, polysaccharide"] },
    { id: "chuong-ancol", dl: 2310, cat: "Bài tập theo chương", tag: "Bài tập · Lớp 11", title: "Bài tập chương Ancol – Phenol, có lời giải", pages: 24, price: 39000 },
    { id: "chuong-amin", dl: 1902, cat: "Bài tập theo chương", tag: "Bài tập · Lớp 12", title: "Bài tập chương Amin – Amino acid – Protein, có lời giải", pages: 28, price: 39000 },
    { id: "trinhtu", dl: 417, cat: "Các chuyên đề", tag: "Chuyên đề · HSG", title: "Xác định trình tự peptide: Edman, khối phổ, cắt chọn lọc", pages: 30, price: 79000, vids: ["Phương pháp Edman", "Khối phổ và cắt chọn lọc"] },
    { id: "cochehc", dl: 689, cat: "Các chuyên đề", tag: "Chuyên đề · HSG", title: "Cơ chế phản ứng hữu cơ: thế, tách, cộng", pages: 52, price: 99000 },
    { id: "thithu", dl: 3054, cat: "Đề thi thử", tag: "Đề thi thử · Lớp 12", title: "Bộ 10 đề thi thử tốt nghiệp THPT, lời giải chi tiết", pages: 80, price: 89000 },
    { id: "vsosh", dl: 205, cat: "Tài liệu khác", tag: "Đề thi nước ngoài · Bản dịch", title: "Đề thi Olympic Hóa học Toàn Nga – các bài Hữu cơ (bản dịch)", pages: 74, price: 149000 },
    { id: "dapan", dl: 318, cat: "Tài liệu khác", tag: "Đề thi nước ngoài · Lời giải", title: "Lời giải chi tiết đề HSG Toàn Nga 2024", pages: 46, price: 99000, vids: ["Chữa bài 1–2: tổng hợp hữu cơ", "Chữa bài 3: xác định cấu trúc", "Chữa bài 4–5: cơ chế phản ứng"] }
  ];
  var COURSE = {
    id: "huuco-2627", name: "Khóa Hữu cơ 2026–2027", price: 3000000,
    desc: "Khóa đang học: hệ thống Hóa hữu cơ từ đại cương đến chuỗi tổng hợp, dành cho học sinh ôn thi HSG và đại học.",
    meta: [["Lịch học", "thầy bổ sung"], ["Hình thức", "Online qua Microsoft Teams"], ["Thời gian", "09/2026 – 05/2027"]],
    lessons: [
      { n: 1, d: "08/09/2026", t: "Đại cương hóa hữu cơ, đồng phân", docs: ["Bài giảng buổi 1 (PDF)", "Bài tập về nhà buổi 1"], vids: ["Bản ghi buổi 1"] },
      { n: 2, d: "15/09/2026", t: "Hiệu ứng electron, tính axit – bazơ", docs: ["Bài giảng buổi 2 (PDF)", "Bài tập về nhà buổi 2"], vids: ["Bản ghi buổi 2"] },
      { n: 3, d: "22/09/2026", t: "Hiđrocacbon no và không no", docs: ["Bài giảng buổi 3 (PDF)"], vids: ["Bản ghi buổi 3", "Chữa bài tập buổi 3"] },
      { n: 4, d: "29/09/2026", t: "Cơ chế thế SN1, SN2", docs: ["Bài giảng buổi 4 (PDF)", "Bài tập cơ chế"], vids: ["Bản ghi buổi 4"] },
      { n: 5, d: "06/10/2026", t: "Cơ chế tách E1, E2 và cạnh tranh thế – tách", docs: ["Bài giảng buổi 5 (PDF)"], vids: ["Bản ghi buổi 5"] },
      { n: 6, d: "13/10/2026", t: "Ancol, phenol, ete", docs: ["Bài giảng buổi 6 (PDF)", "Đề kiểm tra giữa kỳ"], vids: ["Bản ghi buổi 6"], isNew: true }
    ]
  };
  var REVIEWS = [
    { n: "Phụ huynh (mẫu)", who: "Phụ huynh", s: 5, t: "Đánh giá minh họa: thầy nhắn nhận xét tiến bộ hằng tháng, con tự tin hơn với phần hữu cơ.", ts: "Ví dụ" },
    { n: "HọcTròHóa (mẫu)", who: "Học sinh", s: 5, t: "Đánh giá minh họa: lời giải chi tiết, dễ hiểu, phần chuỗi tổng hợp được chữa rất kỹ.", ts: "Ví dụ" },
    { n: "Học sinh (mẫu)", who: "Học sinh", s: 4, t: "Đánh giá minh họa: bài tập nhiều và sát đề, mong có thêm video chữa đề.", ts: "Ví dụ" }
  ];
  var CM_SEED = {
    b1: [{ n: "Ion_Natri", r: "member", t: "Nếu chuỗi bên có nhóm axit thì tính pI thế nào ạ?", ts: "2 ngày trước" },
         { n: "Thầy Phòng", r: "teacher", t: "Lấy trung bình hai pKa nằm hai bên dạng trung hòa điện, tức α-COOH và COOH chuỗi bên. Ví dụ Asp: pI = (1,88 + 3,65)/2 ≈ 2,77.", ts: "2 ngày trước" }],
    b4: [{ n: "KaliKa", r: "member", t: "Em hay quên phần HNO₃ làm môi trường, có mẹo gì không ạ?", ts: "Hôm qua" },
         { n: "TitanHóa", r: "vip", t: "Đếm N ở vế phải trước: 3 trong Fe(NO₃)₃ + 1 trong NO = 4 HNO₃, xong rồi mới cân bằng H₂O.", ts: "Hôm qua" }],
    a1: [{ n: "MolBenzen", r: "member", t: "Nếu HNO₃ không dư thì sao ạ?", ts: "3 ngày trước" },
         { n: "Thầy Phòng", r: "teacher", t: "Khi đó Fe dư có thể khử Fe³⁺ về Fe²⁺, số mol electron nhường thay đổi nên phải xét lượng HNO₃ cụ thể. Thầy sẽ đăng thêm bài dạng này.", ts: "3 ngày trước" }]
  };
  var CATS = ["Tất cả", "Đại cương", "Cơ chế", "Chuỗi", "Cấu tạo chất", "Hợp chất cao phân tử", "Hóa sinh", "Khác"];
  var TOPICS = [
    { id: "t1", n: "MolBenzen", r: "member", g: "Khác", ts: "3 giờ trước", best: 1, title: "Phân biệt ba ancol bậc 1, 2, 3 bằng thuốc thử nào?",
      body: "Em có ba lọ mất nhãn: propan-1-ol, propan-2-ol và 2-metylpropan-2-ol. Dùng CuO đun nóng thì nhận ra được ancol bậc 3, còn bậc 1 và bậc 2 em chưa biết làm tiếp thế nào ạ.",
      replies: [{ n: "TitanHóa", r: "vip", t: "Lấy sản phẩm oxi hóa bằng CuO đem tráng bạc: bậc 1 tạo anđehit nên có kết tủa Ag, bậc 2 tạo xeton nên không có.", ts: "2 giờ trước", likes: 4 },
                { n: "Thầy Phòng", r: "teacher", t: "Đúng hướng rồi. Có thể dùng thêm thuốc thử Lucas (ZnCl₂ trong HCl đặc): bậc 3 vẩn đục ngay, bậc 2 sau vài phút, bậc 1 gần như không đổi ở nhiệt độ phòng.", ts: "1 giờ trước", likes: 7 }] },
    { id: "t5", n: "HydroKid", r: "member", g: "Chuỗi", ts: "5 giờ trước", title: "Xác định X, Y trong chuỗi C₂H₄ → X → Y → CH₃COOC₂H₅",
      body: "Biết X và Y đều phản ứng được với Na. Em nghĩ X là ancol nhưng chưa chắc Y là gì ạ.",
      replies: [{ n: "TitanHóa", r: "vip", t: "X là C₂H₅OH (hiđrat hóa etilen), Y là CH₃COOH (lên men giấm X). Y tác dụng với C₂H₅OH, xúc tác H₂SO₄ đặc, tạo etyl axetat.", ts: "4 giờ trước", likes: 2 }] },
    { id: "t2", n: "AxitAmin12", r: "student", g: "Hóa sinh", ts: "Hôm qua", title: "Vì sao đipeptit không có phản ứng màu biure?",
      body: "Đề hỏi Gly-Ala có phản ứng màu biure không, em chọn có nhưng đáp án là không. Thầy và các bạn giải thích giúp em với.",
      replies: [{ n: "Ion_Natri", r: "vip", t: "Cu²⁺ cần phối trí với N của ít nhất hai liên kết peptit. Đipeptit chỉ có một liên kết peptit nên không tạo được phức màu tím.", ts: "Hôm qua", likes: 3 }] },
    { id: "t3", n: "KaliKa", r: "member", g: "Đại cương", ts: "2 ngày trước", title: "Cân bằng FeS₂ + HNO₃ đặc nóng thế nào cho nhanh?",
      body: "Phản ứng tạo Fe(NO₃)₃, H₂SO₄, NO₂ và H₂O. Em cân bằng mãi không ra, có mẹo gì không ạ?",
      replies: [{ n: "MolBenzen", r: "member", t: "Coi cả phân tử FeS₂ nhường 15e (Fe nhường 1e, 2S nhường 14e), mỗi N⁺⁵ nhận 1e nên cần 15 NO₂:\nFeS₂ + 18HNO₃ → Fe(NO₃)₃ + 2H₂SO₄ + 15NO₂ + 7H₂O", ts: "2 ngày trước", likes: 5 }] },
    { id: "t4", n: "Ion_Natri", r: "vip", g: "Cơ chế", ts: "4 ngày trước", title: "Ôn phần cơ chế SN1, SN2, E1, E2 thế nào để không nhầm?",
      body: "Em đang ôn thi HSG cấp thành phố, phần cơ chế thế và tách em hay nhầm. Mọi người gợi ý giúp em cách ôn với.",
      replies: [{ n: "Thầy Phòng", r: "teacher", t: "Em lập bảng so sánh bốn cơ chế theo bậc cacbon, tác nhân (bazơ hay nucleophin, mạnh hay yếu), dung môi và nhiệt độ. Mỗi ngày làm 5 bài dự đoán sản phẩm rồi đối chiếu với bảng.", ts: "3 ngày trước", likes: 9 }] }
  ];
  var ROLES = { guest: "Khách", member: "Thành viên", vip: "VIP", student: "Học viên", teacher: "Thầy (quản trị)" };
  var VIP_QUOTA = 5;
  var CFG = window.HHTP_CONFIG || {};
  var LIVE = !!(CFG.supabaseUrl && CFG.supabaseAnonKey && window.supabase);
  var sb = LIVE ? window.supabase.createClient(CFG.supabaseUrl, CFG.supabaseAnonKey) : null;
  if (LIVE) { BASIC = []; ADV = []; CM_SEED = {}; TOPICS = []; REVIEWS = []; DOCS = []; SHOP = []; COURSE = { name: "Khóa học hiện hành", desc: "Đang tải…", meta: [], lessons: [] }; }

  /* ================= trạng thái ================= */
  var KEY = "hhtp-demo-v3";
  function fresh() { return { role: "guest", nick: "", pts: 0, correct: 0, ans: {}, sol: {}, opened: {}, bought: {}, vipUsed: 0, studentExpired: false, dl: {}, done: {}, exPage: {}, access: null, lessonBought: {}, codes: [], accounts: null, review: null, cm: {}, topics: [], rep: {}, solved: {}, likes: {} }; }
  var st = fresh();
  if (!LIVE) { try { var raw = localStorage.getItem(KEY); if (raw) { var o = JSON.parse(raw); for (var k in o) st[k] = o[k]; } } catch (e) {} }
  if (st.role === "guest") { st.ans = {}; st.sol = {}; st.done = {}; st.exPage = {}; }
  function save() {
    if (LIVE) { try { localStorage.setItem("hhtp-live", JSON.stringify({ exPage: st.exPage })); } catch (e) {} return; }
    var o = st;
    if (st.role === "guest") { o = {}; for (var k in st) o[k] = st[k]; o.ans = {}; o.sol = {}; o.done = {}; o.exPage = {}; o.correct = 0; }
    try { localStorage.setItem(KEY, JSON.stringify(o)); } catch (e) {}
  }
  var logged = function () { return st.role !== "guest"; };
  var noAds = function () { return st.role === "vip" || st.role === "student" || st.role === "teacher"; };
  function $(id) { return document.getElementById(id); }
  function el(tag, cls, text) { var e = document.createElement(tag); if (cls) e.className = cls; if (text != null) e.textContent = text; return e; }
  function vnd(n) { return n.toLocaleString("vi-VN") + "đ"; }
  function toast(msg) { var t = el("div", "toast", msg); document.body.appendChild(t); setTimeout(function () { t.remove(); }, 2700); }

  /* ================= hộp thoại ================= */
  var timer = null;
  function closeModal() { clearInterval(timer); $("modal").hidden = true; $("modalBox").innerHTML = ""; $("modalBox").classList.remove("wide"); }
  function openModal(build) { var box = $("modalBox"); box.innerHTML = ""; build(box); $("modal").hidden = false; var f = box.querySelector("button,input"); if (f) f.focus(); }
  $("modal").addEventListener("click", function (e) { if (e.target === $("modal")) closeModal(); });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape" && !$("modal").hidden) closeModal(); });

  function head(box, eyebrow, title) { box.appendChild(el("span", "eyebrow", eyebrow)); var h = el("h3", null, title); h.id = "mTitle"; h.style.fontSize = "18px"; box.appendChild(h); }
  function row(box, btns) { var r = el("div", "mrow"); btns.forEach(function (b) { r.appendChild(b); }); box.appendChild(r); }
  function button(cls, text, fn) { var b = el("button", "btn " + cls, text); b.type = "button"; b.addEventListener("click", fn); return b; }

  function showAd(title, onDone) {
    openModal(function (box) {
      head(box, "Xem quảng cáo để mở", title);
      var ad = el("div", "fakead"); var inner = el("div"); var c = el("div", "count", "10");
      inner.appendChild(c); inner.appendChild(document.createTextNode("Quảng cáo video ngắn (mô phỏng Google Offerwall). Trên trang thật, Google chọn quảng cáo và độ dài."));
      ad.appendChild(inner); box.appendChild(ad);
      var done = button("amber", "Nhận nội dung", function () { closeModal(); onDone(); }); done.disabled = true;
      row(box, [button("ghost", "Để sau", closeModal), done]);
      var n = 10; clearInterval(timer);
      timer = setInterval(function () { n--; c.textContent = n > 0 ? n : "✓"; if (n <= 0) { clearInterval(timer); done.disabled = false; done.focus(); } }, 1000);
    });
  }

  function showLogin(reason, onDone) {
    if (LIVE) { liveLogin(reason, onDone); return; }
    openModal(function (box) {
      head(box, "Đăng nhập", reason || "Tạo tài khoản miễn phí");
      box.appendChild(el("p", "note", "Không cần mật khẩu mới. Biệt danh hiện khi bình luận, hỏi đáp và đánh giá (không cần dùng họ tên thật)."));
      var f = el("div", "field"); var lb = el("label", null, "Biệt danh"); lb.htmlFor = "nickIn";
      var inp = el("input"); inp.type = "text"; inp.id = "nickIn"; inp.maxLength = 18; inp.placeholder = "Ví dụ: HydroKid"; inp.value = st.nick || "";
      inp.style.cssText = "width:100%;padding:10px 12px;border:1.5px solid var(--line);border-radius:8px;background:var(--surface);color:var(--ink)";
      f.appendChild(lb); f.appendChild(inp); box.appendChild(f);
      function go() { st.nick = (inp.value || "").trim() || "HọcTròHóa"; if (st.role === "guest") st.role = "member"; save(); closeModal(); renderAll(); toast("Đã đăng nhập: " + st.nick); if (onDone) onDone(); }
      row(box, [button("ghost", "Tiếp tục với Zalo", go), button("", "Tiếp tục với Google", go)]);
    });
  }

  function showQR(title, amount, onPaid) {
    if (LIVE) { openModal(function (box) { head(box, "Thanh toán", title); box.appendChild(el("p", null, "Thanh toán QR tự động đang được kết nối và sẽ mở trong thời gian tới. Cần gấp, vui lòng nhắn Zalo cho thầy.")); row(box, [button("", "Đóng", closeModal)]); }); return; }
    var code = "HHTP" + Math.floor(1000 + Math.random() * 9000);
    openModal(function (box) {
      head(box, "Thanh toán bằng mã QR", title);
      box.appendChild(el("div", "qr", "Mã VietQR mẫu. Trang thật hiển thị mã riêng cho đơn này, quét bằng app ngân hàng."));
      var dl = el("dl", "kv");
      [["Số tiền", vnd(amount)], ["Nội dung", code], ["Ngân hàng", "thầy bổ sung"], ["Số tài khoản", "thầy bổ sung"]].forEach(function (p) { dl.appendChild(el("dt", null, p[0])); dl.appendChild(el("dd", null, p[1])); });
      box.appendChild(dl);
      box.appendChild(el("p", "note", "Hệ thống tự xác nhận khi tiền về đúng nội dung, không cần chụp màn hình gửi thầy."));
      row(box, [button("ghost", "Hủy", closeModal), button("", "Mô phỏng: đã chuyển khoản", function () { closeModal(); onPaid(); })]);
    });
  }

  /* ================= bài tập ================= */
  var tab = "basic";
  var exCat = "Tất cả";
  $("tabBasic").addEventListener("click", function () { tab = "basic"; exCat = "Tất cả"; renderEx(); });
  $("tabAdv").addEventListener("click", function () { tab = "adv"; exCat = "Tất cả"; renderEx(); });
  var ESSAY = LIVE ? [] : (window.BAITAP_TL || []).map(function (q) { q.g = q.g || "Chuỗi"; q.essay = true; return q; });

  var PER = { basic: 5, adv: 2 }, exQ = "", pageNow = {};
  function fold(x) { return String(x).toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/đ/g, "d"); }
  function isDone(q) { return q.essay ? !!st.done[q.id] : st.ans[q.id] != null; }
  function paginate(items, per) { var pages = [], cur = [], used = 0; items.forEach(function (q) { var w = q.essay ? per : 1; if (used + w > per && cur.length) { pages.push(cur); cur = []; used = 0; } cur.push(q); used += w; }); if (cur.length) pages.push(cur); return pages; }
  function pager(n, cur, go) {
    var w = el("nav", "pager"); w.setAttribute("aria-label", "Chuyển trang");
    var prev = button("ghost sm", "‹ Trước", function () { go(cur - 1); }); prev.disabled = cur === 0; w.appendChild(prev);
    for (var i = 0; i < n; i++) (function (i) { var b = button(i === cur ? "sm" : "ghost sm", String(i + 1), function () { go(i); }); if (i === cur) b.setAttribute("aria-current", "page"); w.appendChild(b); })(i);
    var next = button("ghost sm", "Sau ›", function () { go(cur + 1); }); next.disabled = cur >= n - 1; w.appendChild(next);
    return w;
  }
  $("exSearch").addEventListener("input", function (e) { exQ = e.target.value; pageNow.search = 0; renderEx(); });
  function renderEx() {
    $("tabBasic").setAttribute("aria-selected", String(tab === "basic"));
    $("tabAdv").setAttribute("aria-selected", String(tab === "adv"));
    var bn = $("exBanner"); bn.innerHTML = "";
    if (logged()) bn.appendChild(el("span", null, "Bài làm của " + st.nick + " được ghi nhớ: lần sau mở lại sẽ tiếp tục từ trang có bài chưa làm. Đã làm đúng " + st.correct + " bài."));
    else { bn.appendChild(el("span", null, "Bạn đang là khách: bài làm không được lưu, lần sau mở lại sẽ bắt đầu từ đầu. Đăng nhập để lưu bài làm và tham gia thảo luận.")); bn.appendChild(button("sm", "Đăng nhập", function () { showLogin(); })); }
    var list = $("qlist"); list.innerHTML = "";
    var basicPool = BASIC.map(function (q, i) { q.no = i + 1; q.lv = "basic"; return q; });
    var advPool = ADV.concat(ESSAY).map(function (q, i) { q.no = i + 1; q.lv = "adv"; return q; });
    var searching = fold(exQ).trim().length > 0;
    $("exCats").hidden = searching; $("exTabs").hidden = searching;
    var items, per, key;
    if (searching) {
      var words = fold(exQ).trim().split(/\s+/);
      items = basicPool.concat(advPool).filter(function (q) { var h = fold([q.t, (q.o || []).join(" "), q.text, q.name, q.g, q.e, q.ans].join(" ")); return words.every(function (w) { return h.indexOf(w) >= 0; }); });
      per = 5; key = "search";
      list.appendChild(el("p", "note", items.length ? "Tìm thấy " + items.length + " bài cho “" + exQ.trim() + "” (cả Cơ bản và Nâng cao)." : "Không tìm thấy bài nào cho “" + exQ.trim() + "”. Thử từ khóa khác, ví dụ: peptide, SN2, pH, polime."));
    } else {
      var pool = tab === "basic" ? basicPool : advPool;
      var cats = $("exCats"); cats.innerHTML = "";
      CATS.forEach(function (c) {
        var n = c === "Tất cả" ? pool.length : pool.filter(function (q) { return q.g === c; }).length;
        var b = el("button", "tab sm", c + " (" + n + ")"); b.type = "button"; b.setAttribute("aria-pressed", String(c === exCat));
        b.addEventListener("click", function () { exCat = c; renderEx(); }); cats.appendChild(b);
      });
      items = pool.filter(function (q) { return exCat === "Tất cả" || q.g === exCat; });
      per = PER[tab]; key = tab + "|" + exCat;
      if (!items.length) list.appendChild(el("p", "card note", "Mục " + exCat + " chưa có bài " + (tab === "basic" ? "cơ bản" : "nâng cao") + ". Thầy sẽ bổ sung sớm."));
    }
    var pages = paginate(items, per);
    if (!pages.length) return;
    var cur = pageNow[key];
    if (cur == null) {
      cur = 0;
      if (logged() && !searching) {
        var saved = st.exPage[key], firstOpen = -1;
        pages.some(function (pg, i) { if (pg.some(function (q) { return !isDone(q); })) { firstOpen = i; return true; } return false; });
        cur = firstOpen >= 0 ? firstOpen : (saved != null ? saved : pages.length - 1);
        if (cur > 0) list.appendChild(el("p", "resume", "Tiếp tục từ trang " + (cur + 1) + ": các trang trước bạn đã làm xong."));
      }
      pageNow[key] = cur;
    }
    cur = Math.max(0, Math.min(cur, pages.length - 1));
    function go(i) { pageNow[key] = i; if (logged() && !searching) { st.exPage[key] = i; save(); } renderEx(); $("exTabs").scrollIntoView({ behavior: "smooth", block: "start" }); }
    var doneCount = items.filter(isDone).length;
    var head2 = el("div", "pghead"); head2.appendChild(el("span", "note", "Trang " + (cur + 1) + "/" + pages.length + " · " + (tab === "basic" || searching ? "5 bài mỗi trang" : "1–2 bài mỗi trang") + (logged() ? " · đã làm " + doneCount + "/" + items.length : "")));
    list.appendChild(head2);
    pages[cur].forEach(function (q) { list.appendChild(q.essay ? essayCard(q, q.no - 1) : qCard(q, q.no - 1, q.lv === "adv")); });
    if (pages.length > 1) list.appendChild(pager(pages.length, cur, go));
    if (!searching && cur === pages.length - 1) list.appendChild(el("p", "note", "Bài mới thầy đăng sẽ được thêm vào các trang sau, không chèn vào giữa bài cũ."));
  }

  function qCard(q, i, adv) {
    var c = el("article", "card q");
    var top = el("div", "q-top"); var lab = el("span", "lvl" + (adv ? " adv" : ""), (adv ? "Nâng cao" : "Cơ bản") + " · Câu " + (i + 1)); if (q.isNew) { var nw = el("span", "badge ok", "Mới"); nw.style.marginLeft = "6px"; lab.appendChild(nw); } top.appendChild(lab);
    top.appendChild(el("span", "note", q.g + (adv ? " · lời giải chi tiết mở bằng quảng cáo" : "")));
    c.appendChild(top); c.appendChild(el("p", "q-text", q.t));
    var opts = el("div", "opts"), picked = st.ans[q.id];
    q.o.forEach(function (txt, j) {
      var b = el("button", "opt"); b.type = "button"; b.appendChild(el("span", "k", "ABCD"[j])); b.appendChild(el("span", null, txt));
      if (picked != null) { b.disabled = true; if (j === q.a) b.classList.add("right"); else if (j === picked) b.classList.add("wrong"); }
      b.addEventListener("click", function () { answer(q, j); });
      opts.appendChild(b);
    });
    c.appendChild(opts);
    if (picked != null && LIVE && q.a == null) { fetchKey(q); c.appendChild(el("p", "note", "Đang tải đáp án…")); c.appendChild(discussion(q, picked)); return c; }
    if (picked != null) {
      var ok = picked === q.a;
      c.appendChild(el("div", "result " + (ok ? "ok" : "no"), (ok ? "Chính xác. " : "Chưa đúng. ") + (adv ? "Đáp số: " + q.ans + "." : q.e)));
      if (adv) {
        if ((st.sol[q.id] || noAds()) && LIVE && !q.s) { fetchSolution(q, false); c.appendChild(el("p", "note", "Đang tải lời giải…")); }
        else if (st.sol[q.id] || noAds()) {
          var s = el("div", "solution"); s.appendChild(el("b", null, "Lời giải chi tiết"));
          var ol = el("ol"); ol.style.cssText = "margin:6px 0 0;padding-left:20px;display:grid;gap:4px"; q.s.forEach(function (x) { ol.appendChild(el("li", null, x)); }); s.appendChild(ol); c.appendChild(s);
        } else {
          var r = el("div", "mrow"); r.style.justifyContent = "flex-start";
          r.appendChild(button("amber sm", "Xem lời giải chi tiết (1 quảng cáo)", function () { showAd("Lời giải: Nâng cao · Câu " + (i + 1), function () { st.sol[q.id] = true; save(); if (LIVE) { q._s = false; fetchSolution(q, true); } else renderEx(); toast("Đã mở lời giải"); }); }));
          var up = el("a", "btn sm ghost", "VIP: xem không cần quảng cáo"); up.href = "#thanh-vien"; r.appendChild(up);
          c.appendChild(r);
        }
      }
    }
    c.appendChild(discussion(q, picked));
    return c;
  }

  function schemes(arr, alt) {
    var w = el("div", "schemes"); w.appendChild(el("span", "swipe", "Vuốt ngang để xem hết sơ đồ"));
    arr.forEach(function (x, k) { var f = el("figure", "scheme"), im = el("img"); im.src = x[0]; im.width = x[1]; im.height = x[2]; im.loading = "lazy"; im.alt = alt + (arr.length > 1 ? " (phần " + (k + 1) + ")" : ""); f.appendChild(im); w.appendChild(f); });
    return w;
  }
  function essayCard(q, i) {
    var c = el("article", "card q");
    var top = el("div", "q-top"); top.appendChild(el("span", "lvl adv", "Nâng cao · Câu " + (i + 1) + " · Tự luận"));
    var tg = el("span", "note", q.g); top.appendChild(tg); c.appendChild(top);
    c.appendChild(el("h3", null, "Tổng hợp " + q.name)); c.lastChild.style.fontSize = "17px";
    c.appendChild(el("p", null, q.text));
    c.appendChild(schemes(q.de, "Sơ đồ tổng hợp " + q.name));
    var ask = el("p", "ask"); ask.appendChild(el("b", null, "Yêu cầu: ")); ask.appendChild(document.createTextNode(q.ask || "xác định công thức cấu tạo các chất được đánh số trong sơ đồ.")); c.appendChild(ask);
    var shown = st.sol[q.id] || noAds();
    if (shown && LIVE && !q.da) { fetchSolution(q, false); c.appendChild(el("p", "note", "Đang tải đáp án…")); }
    else if (shown) {
      var s = el("div", "solution"); s.style.display = "grid"; s.style.gap = "8px"; s.appendChild(el("b", null, "Đáp án"));
      s.appendChild(schemes(q.da, "Đáp án bài " + q.name)); c.appendChild(s);
    } else {
      var r = el("div", "mrow"); r.style.justifyContent = "flex-start";
      r.appendChild(button("amber sm", "Xem đáp án (1 quảng cáo)", function () { showAd("Đáp án: Tổng hợp " + q.name, function () { st.sol[q.id] = true; save(); if (LIVE) { q._s = false; fetchSolution(q, true); } else renderEx(); toast("Đã mở đáp án"); }); }));
      var up = el("a", "btn sm ghost", "VIP: xem không cần quảng cáo"); up.href = "#thanh-vien"; r.appendChild(up);
      c.appendChild(r);
    }
    if (logged()) {
      var dn = el("div", "mrow"); dn.style.justifyContent = "flex-start";
      if (st.done[q.id]) dn.appendChild(el("span", "badge ok", "✓ Đã làm xong"));
      else dn.appendChild(button("ghost sm", "Đánh dấu đã làm xong", function () { if (LIVE) sb.rpc("mark_done", { p_ex: q.db }).then(function (r) { if (r.error) sbErr(r.error); }); st.done[q.id] = true; save(); renderEx(); toast("Đã ghi nhớ bài làm"); }));
      c.appendChild(dn);
    }
    c.appendChild(discussion(q, shown ? 1 : null));
    return c;
  }

  function answer(q, j) {
    if (st.ans[q.id] != null) return;
    if (LIVE) {
      if (q._busy) return; q._busy = true;
      sb.rpc("submit_answer", { p_ex: q.db, p_choice: j }).then(function (r) {
        q._busy = false;
        if (r.error) { sbErr(r.error, "Chưa gửi được bài làm"); return; }
        st.ans[q.id] = j; q.a = r.data.answer; q.e = r.data.explain; q.ans = r.data.short_answer; q._k = true;
        if (r.data.correct && logged()) st.correct++;
        renderEx(); renderAcct(); toast(r.data.correct ? "Chính xác" : "Chưa đúng, xem giải thích bên dưới");
      });
      return;
    }
    st.ans[q.id] = j; var ok = j === q.a;
    if (ok && logged()) { st.pts += ADV.indexOf(q) >= 0 ? 20 : 10; st.correct++; }
    save(); renderEx(); renderAcct();
    toast(ok ? "Chính xác" : "Chưa đúng, xem giải thích bên dưới");
  }

  /* ================= thảo luận và hỏi đáp ================= */
  var openDisc = {}, forumCat = "Tất cả", forumQ = "", forumOpen = null;
  function rel(ts) {
    if (typeof ts === "string") return ts;
    var m = Math.round((Date.now() - ts) / 60000);
    if (m < 1) return "Vừa xong"; if (m < 60) return m + " phút trước";
    var h = Math.round(m / 60); if (h < 24) return h + " giờ trước";
    return Math.round(h / 24) + " ngày trước";
  }
  function badge(r) { var map = { teacher: ["t", "Thầy"], vip: ["vip", "VIP"], student: ["st", "Học viên"] }; return map[r] ? el("span", "badge " + map[r][0], map[r][1]) : null; }
  function cmtEl(c, extra) {
    var w = el("div", "cmt"); var av = el("span", "av" + (c.r === "teacher" ? " t" : ""), c.n.charAt(0).toUpperCase()); av.setAttribute("aria-hidden", "true"); w.appendChild(av);
    var b = el("div"); var who = el("div", "who"); who.appendChild(el("span", null, c.n)); var bg = badge(c.r); if (bg) who.appendChild(bg); who.appendChild(el("time", null, rel(c.ts)));
    b.appendChild(who); b.appendChild(el("p", null, c.t)); if (extra) b.appendChild(extra); w.appendChild(b); return w;
  }
  function me(text) { return { n: st.nick, r: st.role, t: text, ts: Date.now() }; }
  function composer(ph, label, onPost) {
    if (!logged()) {
      var r = el("div", "mrow"); r.style.cssText = "justify-content:flex-start;align-items:center";
      r.appendChild(el("span", "note", "Đăng nhập để tham gia thảo luận."));
      r.appendChild(button("sm ghost", "Đăng nhập", function () { showLogin("Đăng nhập để bình luận"); })); return r;
    }
    var f = el("form", "cform"); var ta = el("textarea"); ta.placeholder = ph; ta.maxLength = 1000; ta.setAttribute("aria-label", label);
    var r2 = el("div", "mrow"); r2.style.cssText = "justify-content:space-between;align-items:center";
    r2.appendChild(el("span", "note", "Đăng với tên " + st.nick + " · viết đúng chủ đề, lịch sự"));
    var sb = el("button", "btn sm", "Gửi"); sb.type = "submit"; r2.appendChild(sb);
    f.appendChild(ta); f.appendChild(r2);
    f.addEventListener("submit", function (e) { e.preventDefault(); var v = ta.value.trim(); if (v.length < 2) { ta.focus(); return; } onPost(v); });
    return f;
  }
  function discussion(q, picked) {
    var list = (CM_SEED[q.id] || []).concat(st.cm[q.id] || []);
    var dt = el("details", "disc"); if (openDisc[q.id]) dt.open = true;
    dt.addEventListener("toggle", function () { openDisc[q.id] = dt.open; });
    dt.appendChild(el("summary", null, "Thảo luận (" + list.length + ")"));
    var box = el("div", "cmts");
    if (picked == null && list.length) box.appendChild(el("p", "note", "Bình luận có thể lộ đáp án, nên làm bài trước khi đọc."));
    list.forEach(function (c) { box.appendChild(cmtEl(c)); });
    if (!list.length) box.appendChild(el("p", "note", "Chưa có bình luận. Hãy hỏi thêm hoặc chia sẻ cách giải của bạn."));
    box.appendChild(composer("Hỏi thêm hoặc chia sẻ cách giải khác…", "Bình luận bài này", function (v) {
      if (LIVE) { if (banned()) return; sb.from("comments").insert({ exercise_id: q.db, user_id: LV.prof.id, body: v }).then(function (r) { if (r.error) { sbErr(r.error, "Chưa gửi được"); return; } openDisc[q.id] = true; loadComments().then(function () { renderEx(); toast("Đã gửi bình luận"); }); }); return; }
      (st.cm[q.id] = st.cm[q.id] || []).push(me(v)); openDisc[q.id] = true; save(); renderEx(); toast("Đã gửi bình luận");
    }));
    dt.appendChild(box); return dt;
  }

  function allTopics() { return st.topics.slice().reverse().concat(TOPICS); }
  function repliesOf(t) { return (t.replies || []).concat(st.rep[t.id] || []); }
  function bestOf(t) { return st.solved[t.id] != null ? st.solved[t.id] : t.best; }
  function topicMeta(t) {
    var rs = repliesOf(t), m = el("div", "tmeta"); m.appendChild(el("span", "lvl", t.g));
    if (t.pending) m.appendChild(el("span", "badge st", "Chờ thầy duyệt"));
    if (t.hasImg || t.imgUrl) m.appendChild(el("span", "badge", "📷 Có ảnh"));
    if (bestOf(t) != null) m.appendChild(el("span", "badge ok", "Đã giải quyết"));
    if (rs.some(function (r) { return r.r === "teacher"; })) m.appendChild(el("span", "badge t", "Thầy đã trả lời"));
    return m;
  }
  function renderForum() {
    var bn = $("forumBanner"); bn.innerHTML = "";
    if (logged()) { bn.appendChild(el("span", null, "Gặp bài khó thì đặt câu hỏi, ghi rõ đề và chỗ đang vướng để được trả lời nhanh hơn.")); bn.appendChild(button("sm", "Đặt câu hỏi", askModal)); }
    else { bn.appendChild(el("span", null, "Ai cũng đọc được. Đăng nhập để đặt câu hỏi và trả lời.")); bn.appendChild(button("sm", "Đăng nhập", function () { showLogin("Đăng nhập để hỏi bài"); })); }
    var box = $("forum"); box.innerHTML = "";
    var t0 = forumOpen && allTopics().filter(function (t) { return t.id === forumOpen; })[0];
    $("forumTools").hidden = !!t0;
    if (t0) { renderTopic(box, t0); return; }
    forumOpen = null;
    var cats = $("forumCats"); cats.innerHTML = "";
    CATS.forEach(function (c) { var b = el("button", "tab", c); b.type = "button"; b.setAttribute("aria-pressed", String(c === forumCat)); b.addEventListener("click", function () { forumCat = c; renderForum(); }); cats.appendChild(b); });
    var q = forumQ.trim().toLowerCase();
    var list = allTopics().filter(function (t) { return (forumCat === "Tất cả" || t.g === forumCat) && (!q || (t.title + " " + t.body).toLowerCase().indexOf(q) >= 0); });
    if (!list.length) { var e = el("p", "card note", "Chưa có câu hỏi phù hợp. Bạn có thể đặt câu hỏi mới."); box.appendChild(e); }
    list.forEach(function (t) {
      var b = el("button", "topic"); b.type = "button";
      b.appendChild(topicMeta(t)); b.appendChild(el("h3", null, t.title));
      var m2 = el("div", "tmeta"); m2.appendChild(el("span", null, t.n + " · " + rel(t.ts))); m2.appendChild(el("span", null, "· " + repliesOf(t).length + " trả lời")); b.appendChild(m2);
      b.addEventListener("click", function () { forumOpen = t.id; renderForum(); window.scrollTo(0, 0); });
      box.appendChild(b);
    });
  }
  function renderTopic(box, t) {
    var back = el("button", "linkbtn", "← Tất cả câu hỏi"); back.type = "button"; back.style.cssText += ";justify-self:start;font-size:14px";
    back.addEventListener("click", function () { forumOpen = null; renderForum(); }); box.appendChild(back);
    var card = el("article", "card post"); card.appendChild(topicMeta(t)); card.appendChild(el("h3", null, t.title));
    var tex = null; if (LIVE && !t.mine) { tex = el("div", "cact"); var trp = el("button", "linkbtn", "Báo cáo"); trp.type = "button"; trp.style.color = "var(--muted)"; trp.addEventListener("click", function () { liveReport("topic", t.id); }); tex.appendChild(trp); }
    card.appendChild(cmtEl({ n: t.n, r: t.r, t: t.body, ts: t.ts }, tex)); box.appendChild(card);
    if (t.imgUrl || t.hasImg) {
      var fig = el("a", "timg"); fig.target = "_blank"; fig.rel = "noopener"; fig.title = "Bấm để xem ảnh lớn"; card.appendChild(fig);
      var showImg = function (u) { fig.href = u; var im = el("img"); im.src = u; im.alt = "Ảnh đính kèm câu hỏi"; im.loading = "lazy"; fig.appendChild(im); };
      if (t.imgUrl) showImg(t.imgUrl);
      else { fig.appendChild(el("span", "note", "Đang tải ảnh…")); authToken().then(function (tok) { return fetch("/api/forum-image?topic=" + t.id, { headers: tok ? { Authorization: "Bearer " + tok } : {} }); }).then(function (r) { if (!r.ok) throw 0; return r.blob(); }).then(function (b) { fig.innerHTML = ""; t.imgUrl = URL.createObjectURL(b); showImg(t.imgUrl); }).catch(function () { fig.innerHTML = ""; fig.appendChild(el("span", "note", "Không tải được ảnh.")); }); }
    }
    if (t.pending) {
      var pn = el("div", "card cact"); box.appendChild(pn);
      if (st.role === "teacher") { pn.appendChild(el("span", null, "Câu hỏi đang chờ duyệt.")); pn.appendChild(button("sm", "Duyệt", function () { setTopic(t.id, { approved: true }, "Đã duyệt câu hỏi"); })); pn.appendChild(button("ghost sm", "Từ chối", function () { setTopic(t.id, { hidden: true }, "Đã từ chối câu hỏi"); })); pn.appendChild(banCtl(t.uid, t.n)); return; }
      else { pn.appendChild(el("span", "note", "Câu hỏi đang chờ thầy duyệt. Chỉ bạn thấy câu hỏi này cho đến khi được duyệt.")); return; }
    }
    var rs = repliesOf(t), best = bestOf(t);
    var wrap = el("div", "card cmts"); wrap.appendChild(el("h3", null, rs.length ? rs.length + " câu trả lời" : "Chưa có câu trả lời")); wrap.lastChild.style.fontSize = "16px";
    rs.forEach(function (r, i) {
      var ex = el("div", "cact"), k = t.id + ":" + i, liked = !!st.likes[k], n = (r.likes || 0) + (liked ? 1 : 0);
      var lb = el("button", "linkbtn", (liked ? "Đã thấy hữu ích" : "Hữu ích") + " · " + n); lb.type = "button"; lb.setAttribute("aria-pressed", String(liked));
      lb.addEventListener("click", function () { if (!logged()) { showLogin("Đăng nhập để bình chọn"); return; } if (LIVE) { liveLike(t, i); return; } if (st.likes[k]) delete st.likes[k]; else st.likes[k] = true; save(); renderForum(); });
      ex.appendChild(lb);
      if (i === best) ex.appendChild(el("span", "badge ok", "✓ Câu trả lời đúng"));
      else if (t.mine && best == null) { var pb = el("button", "linkbtn", "Chọn là câu trả lời đúng"); pb.type = "button"; pb.addEventListener("click", function () { if (LIVE) { liveBest(t, i); return; } st.solved[t.id] = i; save(); renderForum(); toast("Đã đánh dấu câu hỏi đã giải quyết"); }); ex.appendChild(pb); }
      var rp = el("button", "linkbtn", "Báo cáo"); rp.type = "button"; rp.style.color = "var(--muted)"; rp.addEventListener("click", function () { if (LIVE) { liveReport("reply", r.rid); return; } toast("Đã gửi báo cáo, thầy sẽ xem xét"); }); ex.appendChild(rp);
      var ce = cmtEl(r, ex); if (i === best) ce.classList.add("best"); wrap.appendChild(ce);
    });
    wrap.appendChild(composer("Viết câu trả lời của bạn…", "Trả lời câu hỏi", function (v) { if (LIVE) { liveReply(t, v); return; } (st.rep[t.id] = st.rep[t.id] || []).push(me(v)); save(); renderForum(); toast("Đã gửi câu trả lời"); }));
    box.appendChild(wrap);
  }
  /* Ảnh đính kèm: tối đa 1.000.000 byte; ảnh lớn hơn được tự thu nhỏ thành JPG */
  var IMG_MAX = 1000000;
  function shrinkImage(f) {
    if (!/^image\/(png|jpeg|webp|gif)$/.test(f.type)) return Promise.reject(new Error("Chỉ nhận ảnh PNG, JPG, WEBP hoặc GIF."));
    if (f.size <= IMG_MAX) return Promise.resolve(f);
    if (f.type === "image/gif") return Promise.reject(new Error("Ảnh GIF quá 1 MB, hãy chọn ảnh nhỏ hơn."));
    return new Promise(function (ok, bad) {
      var im = new Image(), u = URL.createObjectURL(f);
      im.onload = function () {
        URL.revokeObjectURL(u);
        var tries = [[1600, 0.85], [1280, 0.8], [1024, 0.72], [800, 0.65]];
        (function next(i) {
          if (i >= tries.length) { bad(new Error("Ảnh quá lớn, không thu nhỏ được dưới 1 MB.")); return; }
          var k = Math.min(1, tries[i][0] / Math.max(im.naturalWidth, im.naturalHeight));
          var c = document.createElement("canvas"); c.width = Math.round(im.naturalWidth * k); c.height = Math.round(im.naturalHeight * k);
          var g = c.getContext("2d"); g.fillStyle = "#fff"; g.fillRect(0, 0, c.width, c.height); g.drawImage(im, 0, 0, c.width, c.height);
          c.toBlob(function (b) { if (b && b.size <= IMG_MAX) ok(b); else next(i + 1); }, "image/jpeg", tries[i][1]);
        })(0);
      };
      im.onerror = function () { URL.revokeObjectURL(u); bad(new Error("Không đọc được ảnh này.")); };
      im.src = u;
    });
  }
  function askModal() {
    openModal(function (box) {
      head(box, "Hỏi bài", "Đặt câu hỏi mới");
      if (LIVE && st.role !== "teacher") box.appendChild(el("p", "note", "Câu hỏi sẽ hiện cho mọi người sau khi thầy duyệt."));
      function field(label, node) { var f = el("div", "field"); var lb = el("label", null, label); lb.htmlFor = node.id; f.appendChild(lb); f.appendChild(node); box.appendChild(f); return node; }
      var ti = el("input", "inp"); ti.type = "text"; ti.id = "askTitle"; ti.maxLength = 120; ti.placeholder = "Ví dụ: Cân bằng phản ứng FeS₂ + HNO₃";
      field("Tiêu đề", ti);
      var sel = el("select", "inp"); sel.id = "askCat"; CATS.slice(1).forEach(function (c) { sel.appendChild(el("option", null, c)); });
      field("Chuyên mục", sel);
      var body = el("textarea", "inp"); body.id = "askBody"; body.maxLength = 2000; body.placeholder = "Chép đề bài và ghi rõ em đang vướng ở bước nào.";
      field("Nội dung", body);
      var pick = { blob: null };
      var fi = el("input", "inp"); fi.type = "file"; fi.id = "askImg"; fi.accept = "image/png,image/jpeg,image/webp,image/gif";
      field("Ảnh đính kèm (không bắt buộc, tối đa 1 MB)", fi);
      var pvw = el("div", "cact"); box.appendChild(pvw);
      fi.addEventListener("change", function () {
        pvw.innerHTML = ""; pick.blob = null; var f = fi.files[0]; if (!f) return;
        pvw.appendChild(el("span", "note", "Đang xử lý ảnh…"));
        shrinkImage(f).then(function (b) {
          pick.blob = b; pvw.innerHTML = "";
          var im = el("img"); im.src = URL.createObjectURL(b); im.alt = "Ảnh đính kèm"; im.style.cssText = "max-height:120px;max-width:200px;border-radius:8px;border:1px solid var(--line)"; pvw.appendChild(im);
          pvw.appendChild(el("span", "note", Math.round(b.size / 1024) + " KB" + (b !== f ? " (đã tự thu nhỏ từ " + Math.round(f.size / 1024) + " KB)" : "")));
          pvw.appendChild(button("ghost sm", "Bỏ ảnh", function () { pick.blob = null; fi.value = ""; pvw.innerHTML = ""; }));
        }).catch(function (e) { pvw.innerHTML = ""; fi.value = ""; pvw.appendChild(el("span", "err", e.message)); });
      });
      var err = el("p", "err"); err.hidden = true; box.appendChild(err);
      row(box, [button("ghost", "Hủy", closeModal), button("", "Đăng câu hỏi", function () {
        var tt = ti.value.trim(), bd = body.value.trim();
        var msg = tt.length < 8 ? "Tiêu đề cần rõ hơn (ít nhất 8 ký tự)." : bd.length < 10 ? "Viết thêm nội dung câu hỏi." : "";
        if (msg) { err.textContent = msg; err.hidden = false; return; }
        if (LIVE) { if (banned()) return; liveAsk(sel.value, tt, bd, pick.blob).then(function (ok) { if (ok) { closeModal(); if (location.hash !== "#hoi-dap") location.hash = "#hoi-dap"; } }); return; }
        var t = { id: "u" + Date.now(), n: st.nick, r: st.role, g: sel.value, title: tt, body: bd, ts: Date.now(), mine: true, replies: [], imgUrl: pick.blob ? URL.createObjectURL(pick.blob) : null };
        st.topics.push(t); forumOpen = t.id; save(); closeModal();
        if (location.hash !== "#hoi-dap") location.hash = "#hoi-dap";
        renderForum(); toast("Đã đăng câu hỏi");
      })]);
    });
  }
  $("forumSearch").addEventListener("input", function (e) { forumQ = e.target.value; renderForum(); });

  /* ================= tài liệu ================= */
  function docCard(d, lockText, lockCls, meta, btn) {
    var c = el("article", "doc"); c.appendChild(el("span", "tag", d.tag)); c.appendChild(el("h3", null, d.title)); c.appendChild(el("span", "meta", meta));
    var act = el("div", "act"); act.appendChild(el("span", "lock " + lockCls, lockText)); act.appendChild(btn); c.appendChild(act); return c;
  }
  function showVideos(d) {
    openModal(function (box) {
      head(box, "Video bài giảng", d.title);
      box.appendChild(el("div", "fakead", "Trình phát video ngay trên trang. Bản thật: video lưu trên dịch vụ phát video, chỉ tài khoản đã mua và còn hạn mới xem được."));
      var ol = el("ol"); ol.style.cssText = "margin:0;padding-left:20px;display:grid;gap:6px;font-size:14.5px";
      d.vids.forEach(function (v) { var li = el("li"); var b = el("button", "linkbtn", v); b.type = "button"; b.style.fontSize = "14.5px"; b.addEventListener("click", function () { toast("Bản thật sẽ phát: " + v); }); li.appendChild(b); ol.appendChild(li); });
      box.appendChild(ol);
      row(box, [button("", "Đóng", closeModal)]);
    });
  }
  function dlCount(d) { return (d.dl || 0) + ((st.dl || {})[d.id] || 0); }
  function download(d) {
    if (LIVE) { sb.rpc("record_download", { p_doc: d.dbId }).then(function (r) { if (r.error) { sbErr(r.error); return; } d.dl = Number(r.data) || d.dl + 1; renderShop(); openFile(d); }); return; }
    st.dl = st.dl || {}; st.dl[d.id] = (st.dl[d.id] || 0) + 1; save(); openFile(d); renderShop(); }
  function previewUrl(u) {
    if (!u) return "";
    var m = u.match(/drive\.google\.com\/file\/d\/([\w-]+)/) || u.match(/drive\.google\.com\/(?:open|uc)\?(?:.*&)?id=([\w-]+)/);
    if (m) return "https://drive.google.com/file/d/" + m[1] + "/preview";
    var g = u.match(/docs\.google\.com\/(document|presentation|spreadsheets)\/d\/([\w-]+)/);
    if (g) return "https://docs.google.com/" + g[1] + "/d/" + g[2] + "/preview";
    return u;
  }
  function showPreview(d) {
    openModal(function (box) {
      box.classList.add("wide");
      head(box, "Xem thử", d.title);
      var fr = el("iframe", "pv"); fr.src = previewUrl(d.preview); fr.title = "Xem thử: " + d.title; fr.setAttribute("allow", "autoplay"); fr.setAttribute("referrerpolicy", "no-referrer");
      box.appendChild(fr);
      box.appendChild(el("p", "note", "Bản xem thử, chỉ xem trực tuyến. Mua tài liệu để xem toàn bộ và tải PDF."));
      row(box, [button("ghost", "Đóng", closeModal)]);
    });
  }
  function shopExtra(c, d, unlocked) {
    var x = el("div", "dx");
    var top = el("div", "mrow"); top.style.cssText = "justify-content:space-between;align-items:center";
    top.appendChild(el("span", "note", dlCount(d).toLocaleString("vi-VN") + " lượt tải"));
    if (d.preview) top.appendChild(button("ghost sm", "👁 Xem thử", function () { showPreview(d); }));
    x.appendChild(top);
    if (d.vids) {
      var v = el("div", "vids");
      v.appendChild(el("b", null, "Video đính kèm (" + d.vids.length + ")"));
      var ul = el("ul");
      d.vids.forEach(function (t, vi) {
        var li = el("li");
        if (unlocked) { var a = el("button", "linkbtn", "▶ " + t); a.type = "button"; a.addEventListener("click", function () { playVideo(d, t, vi); }); li.appendChild(a); }
        else { li.className = "locked"; li.appendChild(el("span", null, "🔒 " + t)); }
        ul.appendChild(li);
      });
      v.appendChild(ul);
      if (!unlocked) v.appendChild(el("span", "note", "Link video mở sau khi thanh toán"));
      x.appendChild(v);
    }
    c.insertBefore(x, c.querySelector(".act"));
    return c;
  }
  function playVideo(d, t, vi) {
    if (LIVE && d.vidIds) { liveVideo("shop_video", d.vidIds[vi], d.title, t); return; }
    if (LIVE && d.lessonFileId) { liveVideo("lesson_file", d.lessonFileId, d.title, t); return; }
    openModal(function (box) {
      head(box, d.title, t);
      box.appendChild(el("div", "fakead", "Trình phát video (Bunny Stream). Link có mã khóa, tự hết hạn sau vài giờ và chỉ mở được bằng tài khoản đã mua."));
      row(box, [button("", "Đóng", closeModal)]);
    });
  }
  function openFile(d, mode) {
    if (LIVE && d.dbId) { liveFile(String(d.id).charAt(0) === "f" ? "free_doc" : "shop_doc", d.dbId, mode || "download", d.title); return; }
    toast("Bản thật sẽ mở file PDF: " + d.title); }

  var docCat = "Tất cả", shopCat = "Tất cả";
  function catChips(id, cats, pool, cur, set) {
    var box = $(id); box.innerHTML = "";
    cats.forEach(function (c) {
      var n = c === "Tất cả" ? pool.length : pool.filter(function (d) { return d.cat === c; }).length;
      var b = el("button", "tab sm", c + " (" + n + ")"); b.type = "button"; b.setAttribute("aria-pressed", String(c === cur));
      b.addEventListener("click", function () { set(c); }); box.appendChild(b);
    });
  }
  function renderDocs() {
    catChips("docCats", DOC_CATS, DOCS, docCat, function (c) { docCat = c; renderDocs(); });
    var box = $("docsFree"); box.innerHTML = "";
    DOCS.filter(function (d) { return docCat === "Tất cả" || d.cat === docCat; }).forEach(function (d) {
      var open = d.acc === "open" || st.opened[d.id] || noAds(), btn, lk, cls;
      if (d.acc === "open") { lk = "Đọc tự do"; cls = "free"; }
      else if (noAds()) { lk = "Mở thẳng (" + ROLES[st.role] + ")"; cls = "vip"; }
      else { lk = st.opened[d.id] ? "Đã mở" : "Mở bằng 1 quảng cáo"; cls = "ad"; }
      if (open) btn = button("sm", "Mở tài liệu", function () { openFile(d, "view"); });
      else btn = button("amber sm", "Xem quảng cáo để mở", function () { showAd(d.title, function () { st.opened[d.id] = true; save(); renderDocs(); toast("Đã mở: " + d.title); }); });
      box.appendChild(docCard(d, lk, cls, d.pages + " trang · PDF", btn));
    });
  }

  /* quyền truy cập tài liệu mua: 12 tháng kể từ ngày mở, gia hạn 50% giá gốc; Học viên giảm 50% */
  var DAY = 864e5;
  function plusYear(from) { var d = new Date(from); d.setFullYear(d.getFullYear() + 1); return d.toISOString(); }
  function vnDate(iso) { return new Date(iso).toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric" }); }
  function access(d) { var v = st.bought[d.id]; if (!v || v === true) return v === true ? "active" : "none"; return new Date(v) > new Date() ? "active" : "expired"; }
  function expiry(d) { var v = st.bought[d.id]; return v && v !== true ? v : null; }
  function grant(d) { var cur = expiry(d), base = cur && new Date(cur) > new Date() ? cur : new Date().toISOString(); st.bought[d.id] = plusYear(base); save(); }
  function priceFor(d, renew) { if (renew) return Math.round(d.price * 0.5 / 1000) * 1000; var p = d.price; if (st.role === "student") p = p * 0.5; else if (st.role === "vip") p = p * 0.85; return Math.round(p / 1000) * 1000; }

  function renderShop() {
    var bn = $("shopBanner"); bn.innerHTML = "";
    var rule = " Mỗi tài liệu mở được dùng 12 tháng; gia hạn bằng 50% giá gốc.";
    if (st.role === "student") bn.appendChild(el("span", null, "Gói Học viên: mở miễn phí mục Bài giảng lý thuyết và bài tập ứng dụng, Bài tập theo chương; các mục khác giảm 50% khi mua." + rule));
    else if (st.role === "vip") bn.appendChild(el("span", null, "Gói VIP: giảm 15% khi mua tài liệu." + rule));
    else { bn.appendChild(el("span", null, "Mua lẻ từng tài liệu, dùng trong 12 tháng. VIP giảm 15%. Học viên mở miễn phí bài giảng và bài tập theo chương, các mục khác giảm 50%.")); var a = el("a", "btn sm ghost", "Xem các gói"); a.href = "#thanh-vien"; bn.appendChild(a); }
    catChips("shopCats", SHOP_CATS, SHOP, shopCat, function (c) { shopCat = c; renderShop(); });
    var box = $("docsShop"); box.innerHTML = "";
    SHOP.filter(function (d) { return shopCat === "Tất cả" || d.cat === shopCat; }).forEach(function (d) {
      var acc = access(d), btn, lk, cls = "paid", meta = d.pages + " trang · xem online hoặc tải PDF";
      if (st.role === "student" && STUDENT_FREE.indexOf(d.cat) >= 0) {
        btn = el("span"); btn.style.cssText = "display:flex;gap:6px;flex-wrap:wrap";
        btn.appendChild(button("sm", "Xem online", function () { if (LIVE) { openFile(d, "view"); return; } toast("Bản thật mở trình xem PDF trên trang: " + d.title); }));
        btn.appendChild(button("ghost sm", "Tải PDF", function () { download(d); }));
        box.appendChild(shopExtra(docCard(d, "Mở bằng gói Học viên", "vip", meta, btn), d, true)); return;
      }
      if (acc === "active") {
        lk = "Đã mở · đến " + vnDate(expiry(d)); cls = "free";
        btn = el("span"); btn.style.cssText = "display:flex;gap:6px;flex-wrap:wrap";
        btn.appendChild(button("sm", "Xem online", function () { if (LIVE) { openFile(d, "view"); return; } toast("Bản thật mở trình xem PDF trên trang: " + d.title); }));
        btn.appendChild(button("ghost sm", "Tải PDF", function () { download(d); }));
        var sim = el("button", "linkbtn", "Thử: tua đến lúc hết hạn"); sim.type = "button";
        sim.addEventListener("click", function () { st.bought[d.id] = new Date(Date.now() - DAY).toISOString(); save(); renderShop(); });
        var c0 = shopExtra(docCard(d, lk, cls, meta, btn), d, true); c0.appendChild(sim); box.appendChild(c0); return;
      }
      var renew = acc === "expired", price = priceFor(d, renew);
      if (renew) lk = "Hết hạn ngày " + vnDate(expiry(d));
      else lk = vnd(price);
      {
        btn = button(renew ? "amber sm" : "sm", (renew ? "Gia hạn 12 tháng · " : "Mua bằng QR · ") + vnd(price), function () {
          if (LIVE) { livePay(renew ? "doc_renew" : "doc", d.dbId, (renew ? "Gia hạn: " : "") + d.title); return; }
          var pay = function () { showQR((renew ? "Gia hạn: " : "") + d.title, price, function () { grant(d); renderShop(); toast((renew ? "Đã gia hạn" : "Đã mở tài liệu") + ", dùng đến " + vnDate(expiry(d))); }); };
          if (!logged()) showLogin("Đăng nhập để lưu tài liệu đã mua", pay); else pay();
        });
      }
      var c = shopExtra(docCard(d, lk, renew ? "ad" : cls, meta, btn), d, false);
      if (!renew && cls !== "vip") {
        var lock = c.querySelector(".lock"); lock.className = "price";
        if (st.role === "student" || st.role === "vip") { lock.textContent = ""; var old = el("s", null, vnd(d.price)); old.style.cssText = "color:var(--muted);font-size:13px;margin-right:6px"; lock.appendChild(old); lock.appendChild(document.createTextNode(vnd(price))); }
      }
      box.appendChild(c);
    });
  }

  /* ================= thành viên ================= */
  function payPlan(title, amount, onPaid, reason) { var go = function () { showQR(title, amount, onPaid); }; if (!logged()) showLogin(reason, go); else go(); }
  function buyVip(months) { if (LIVE) { livePay(months === 12 ? "vip_year" : "vip_month", null, "Gói VIP " + (months === 12 ? "1 năm" : "1 tháng")); return; } payPlan("Gói VIP " + (months === 12 ? "1 năm" : "1 tháng"), months === 12 ? 1500000 : 150000, function () { st.role = "vip"; save(); renderAll(); toast("Đã kích hoạt VIP " + (months === 12 ? "1 năm" : "1 tháng")); }, "Đăng nhập để kích hoạt VIP"); }
  function buyStudent() { if (LIVE) { livePay("student", null, st.studentExpired ? "Gia hạn gói Học viên 12 tháng (giảm 50%)" : "Gói Học viên 12 tháng"); return; } var renew = !!st.studentExpired; payPlan(renew ? "Gia hạn gói Học viên 12 tháng (giảm 50%)" : "Gói Học viên 12 tháng", renew ? 4000000 : 8000000, function () { st.role = "student"; st.studentExpired = false; save(); renderAll(); toast(renew ? "Đã gia hạn gói Học viên" : "Đã kích hoạt gói Học viên"); }, "Đăng nhập để đăng ký gói Học viên"); }
  function renderTiers() {
    var box = $("tiers"); box.innerHTML = "";
    var T = [
      { k: "member", name: "Miễn phí", cost: "0đ", per: "", items: ["Bài tập cơ bản, đáp số bài nâng cao", "Bình luận, hỏi đáp, đánh giá", "Lời giải, tài liệu: xem 1 quảng cáo"] },
      { k: "vip", name: "VIP", cost: "150.000đ", per: "/tháng · hoặc 1.500.000đ/năm", items: ["Không quảng cáo", "Mọi lời giải chi tiết", "Tài liệu miễn phí và tài liệu xem quảng cáo: mở thẳng, không cần xem quảng cáo", "Giảm 15% khi mua tài liệu trả phí", "Khóa học hiện hành: cần gói Học viên", "Mua theo năm tiết kiệm 300.000đ so với 12 tháng lẻ"], mark: true },
      { k: "student", name: "Học viên", cost: st.studentExpired ? "4.000.000đ" : "8.000.000đ", per: st.studentExpired ? "/năm · giá gia hạn (giảm 50%)" : "/năm", items: ["Học miễn phí khóa Hữu cơ của năm đăng ký; truy cập miễn phí tài liệu, video ở Khóa học hiện hành", "Không quảng cáo, mọi lời giải chi tiết", "Tài liệu miễn phí và tài liệu xem quảng cáo: mở thẳng, không cần xem quảng cáo", "Mở khóa miễn phí mục Bài giảng lý thuyết và bài tập ứng dụng, Bài tập theo chương", "Giảm 50% khi mua tài liệu ở các mục còn lại", "Hết hạn: tài khoản trở về Thành viên thường; gia hạn được giảm 50% (4.000.000đ/năm)"] }
    ];
    T.forEach(function (t) {
      var c = el("div", "tier" + (t.mark ? " mark" : ""));
      c.appendChild(el("h3", null, t.name));
      var cost = el("div", "cost", t.cost); if (t.per) cost.appendChild(el("small", null, " " + t.per)); c.appendChild(cost);
      var ul = el("ul"); t.items.forEach(function (x) { ul.appendChild(el("li", null, x)); }); c.appendChild(ul);
      var act = el("div"); act.style.cssText = "margin-top:auto;display:grid;gap:8px";
      if (st.role === t.k || (t.k === "member" && logged() && st.role === "member")) {
        act.appendChild(el("span", "chip" + (t.k === "vip" ? " vip" : ""), "Gói hiện tại")); act.lastChild.style.justifySelf = "start";
        if (t.k === "student") { var sim = el("button", "linkbtn", "Thử: tua đến lúc gói Học viên hết hạn"); sim.type = "button"; sim.style.justifySelf = "start"; sim.addEventListener("click", function () { st.role = "member"; st.studentExpired = true; save(); renderAll(); toast("Gói Học viên đã hết hạn, tài khoản trở về Thành viên"); }); act.appendChild(sim); }
      } else if (t.k === "member") { if (!logged()) act.appendChild(button("ghost", "Tạo tài khoản", function () { showLogin(); })); }
      else if (t.k === "vip") { act.appendChild(button("vip", "VIP 1 tháng · 150.000đ", function () { buyVip(1); })); act.appendChild(button("ghost", "VIP 1 năm · 1.500.000đ", function () { buyVip(12); })); }
      else act.appendChild(button("amber", st.studentExpired ? "Gia hạn Học viên · 4.000.000đ" : "Đăng ký gói Học viên", buyStudent));
      c.appendChild(act); box.appendChild(c);
    });
  }

  /* ================= khóa học hiện hành ================= */
  var LESSON_PRICE = 150000;
  function lessonOpen(n) {
    if (st.role === "teacher") return true;
    if (st.role !== "student") return false;
    if (!st.access) return true;
    return n >= st.access.from || st.access.extra.indexOf(n) >= 0 || !!st.lessonBought[n];
  }
  function activateCode(raw) {
    var code = raw.trim().toUpperCase(), c = st.codes.filter(function (x) { return x.code === code; })[0];
    if (!c) return "Mã không đúng. Kiểm tra lại mã thầy gửi qua Zalo.";
    if (c.usedBy) return "Mã này đã được dùng.";
    if (!logged()) return "Đăng nhập trước khi nhập mã.";
    c.usedBy = st.nick; c.usedAt = Date.now();
    st.role = "student"; st.studentExpired = false;
    st.access = { from: c.from, extra: [], exp: c.exp, by: "Mã " + c.code };
    upsertAccount({ nick: st.nick, role: "student", from: c.from, extra: [], exp: c.exp, paid: c.paid || "", src: "Mã kích hoạt " + c.code });
    save(); renderAll(); return "";
  }
  function renderCourse() {
    var C = COURSE, last = C.lessons.length;
    var hd = $("courseHead"); hd.innerHTML = "";
    hd.appendChild(el("span", "eyebrow", "Khóa đang học"));
    hd.appendChild(el("h3", null, C.name)); hd.lastChild.style.fontSize = "20px";
    hd.appendChild(el("p", null, C.desc));
    var dl = el("dl", "kv"); C.meta.forEach(function (m) { dl.appendChild(el("dt", null, m[0])); var dd = el("dd", m[1] === "thầy bổ sung" ? "fill" : null, m[1]); dd.style.fontFamily = "var(--body)"; dl.appendChild(dd); }); hd.appendChild(dl);
    var nd = C.lessons.reduce(function (a, l) { return a + l.docs.length; }, 0), nv = C.lessons.reduce(function (a, l) { return a + l.vids.length; }, 0);
    hd.appendChild(el("p", "note", last + " buổi đã đăng · " + nd + " tài liệu · " + nv + " video. Buổi mới được thêm vào cuối danh sách."));
    var bx = el("div", "mrow"); bx.style.cssText = "justify-content:flex-start;align-items:center";
    if (st.role === "teacher") bx.appendChild(el("span", "chip", "Thầy: xem toàn bộ · quản lý ở trang Quản trị"));
    else if (st.role === "student") {
      if (st.access) bx.appendChild(el("span", "chip amber", "Học viên vào giữa khóa · mở từ buổi " + st.access.from + (st.access.extra.length ? " + buổi " + st.access.extra.join(", ") : "") + " · hết hạn " + vnDate(st.access.exp)));
      else bx.appendChild(el("span", "chip amber", "Học viên: truy cập toàn bộ khóa học"));
    } else {
      bx.appendChild(el("span", "price", "8.000.000đ")); bx.appendChild(el("span", "note", "gói Học viên, gồm toàn bộ khóa"));
      bx.appendChild(button("amber", "Đăng ký gói Học viên", buyStudent));
    }
    hd.appendChild(bx);
    if (st.role !== "student" && st.role !== "teacher") {
      var cw = el("div", "codebox");
      cw.appendChild(el("p", "note", "Vào học giữa khóa? Nhắn Zalo cho thầy để được tính phí theo số buổi còn lại; thầy gửi mã kích hoạt, nhập mã dưới đây để mở khóa."));
      var f = el("form", "mrow"); f.style.cssText = "justify-content:flex-start;align-items:center";
      var inp = el("input", "inp"); inp.type = "text"; inp.placeholder = "Mã kích hoạt, ví dụ HC27-B11-7QX4"; inp.setAttribute("aria-label", "Mã kích hoạt"); inp.style.maxWidth = "280px";
      var sb = el("button", "btn sm", "Kích hoạt"); sb.type = "submit";
      f.appendChild(inp); f.appendChild(sb); cw.appendChild(f);
      var er = el("p", "err"); er.hidden = true; cw.appendChild(er);
      f.addEventListener("submit", function (e) { e.preventDefault(); if (!logged()) { showLogin("Đăng nhập để nhập mã kích hoạt"); return; }
        if (LIVE) { liveRedeem(inp.value).then(function (m) { if (m) { er.textContent = m; er.hidden = false; } else toast("Đã kích hoạt gói Học viên"); }); return; }
        var m = activateCode(inp.value); if (m) { er.textContent = m; er.hidden = false; } else toast("Đã kích hoạt gói Học viên"); });
      hd.appendChild(cw);
    }
    var box = $("lessons"); box.innerHTML = "";
    C.lessons.forEach(function (l) {
      var open = lessonOpen(l.n);
      var c = el("article", "card lesson");
      var top = el("div", "q-top"); var lb = el("span", "lvl", "Buổi " + l.n + " · " + l.d); if (l.isNew) { var nw = el("span", "badge ok", "Mới"); nw.style.marginLeft = "6px"; lb.appendChild(nw); } top.appendChild(lb);
      top.appendChild(el("span", "note", l.docs.length + " tài liệu · " + l.vids.length + " video")); c.appendChild(top);
      c.appendChild(el("h3", null, l.t));
      var ul = el("ul", "res");
      l.docs.forEach(function (d, di) { var li = el("li"); if (open) { var b = el("button", "linkbtn", "📄 " + d); b.type = "button"; b.addEventListener("click", function () { if (LIVE && l.docIds) { liveFile("lesson_file", l.docIds[di], "view", d); return; } toast("Bản thật mở/tải PDF: " + d); }); li.appendChild(b); } else { li.className = "locked"; li.textContent = "🔒 " + d; } ul.appendChild(li); });
      l.vids.forEach(function (v, vi) { var li = el("li"); if (open) { var b = el("button", "linkbtn", "▶ " + v); b.type = "button"; b.addEventListener("click", function () { playVideo({ title: C.name + " · Buổi " + l.n, lessonFileId: l.vidIds && l.vidIds[vi] }, v); }); li.appendChild(b); } else { li.className = "locked"; li.textContent = "🔒 " + v; } ul.appendChild(li); });
      c.appendChild(ul);
      if (!open && st.role === "student" && st.access) {
        c.appendChild(el("p", "note", "Buổi học trước khi bạn vào khóa."));
        c.appendChild(button("ghost sm", "Mua buổi này · " + vnd(LESSON_PRICE), function () { if (LIVE) { livePay("lesson", l.id, "Buổi " + l.n + ": " + l.t); return; } showQR("Buổi " + l.n + ": " + l.t, LESSON_PRICE, function () { st.lessonBought[l.n] = true; save(); renderCourse(); toast("Đã mở buổi " + l.n); }); }));
        c.lastChild.style.justifySelf = "start";
      }
      box.appendChild(c);
    });
  }

  /* ================= quản trị (thầy) ================= */
  var ACCOUNTS0 = [
    { nick: "AxitAmin12", phone: "09xx xxx 214", role: "student", from: 1, extra: [], exp: "2027-05-31", paid: "8.000.000đ", src: "Đăng ký đầu khóa" },
    { nick: "Ion_Natri", phone: "09xx xxx 587", role: "student", from: 1, extra: [], exp: "2027-05-31", paid: "8.000.000đ", src: "Đăng ký đầu khóa" },
    { nick: "MolBenzen", phone: "08xx xxx 330", role: "member" },
    { nick: "KaliKa", phone: "03xx xxx 902", role: "vip" },
    { nick: "TitanHóa", phone: "09xx xxx 765", role: "member" }
  ];
  function accounts() { if (!st.accounts) st.accounts = JSON.parse(JSON.stringify(ACCOUNTS0)); return st.accounts; }
  function upsertAccount(a) { var L = accounts(), f = L.filter(function (x) { return x.nick === a.nick; })[0]; if (f) { for (var k in a) f[k] = a[k]; } else L.push(a); }
  function newCode(from) { var A = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789", r = ""; for (var i = 0; i < 4; i++) r += A[Math.floor(Math.random() * A.length)]; return "HC27-B" + from + "-" + r; }
  function lessonSelect(id, def) {
    var s = el("select", "inp"); s.id = id;
    for (var n = 1; n <= COURSE.lessons.length + 1; n++) { var o = el("option", null, n <= COURSE.lessons.length ? "Buổi " + n + " · " + COURSE.lessons[n - 1].t : "Buổi " + n + " (buổi kế tiếp, chưa đăng)"); o.value = n; if (n === def) o.selected = true; s.appendChild(o); }
    return s;
  }
  function fld(box, label, node) { var f = el("div", "field"); var lb = el("label", null, label); lb.htmlFor = node.id; f.appendChild(lb); f.appendChild(node); box.appendChild(f); return node; }
  function renderAdmin() {
    var box = $("adminBox"); box.innerHTML = "";
    if (st.role !== "teacher") { box.appendChild(el("p", "card note", LIVE ? "Trang này chỉ dành cho thầy." : "Trang này chỉ dành cho thầy. Trong bản mẫu, chọn vai trò \"Thầy\" ở cuối trang để xem.")); return; }
    if (LIVE) { renderAdminLive(box); renderContentAdmin(box); renderPayments(box); renderModeration(box); return; }
    var L = accounts(), nextLesson = COURSE.lessons.length + 1;
    var g = el("div", "grid2"); g.style.alignItems = "start";
    /* cấp quyền */
    var c1 = el("form", "card"); c1.style.cssText = "display:grid;gap:12px";
    c1.appendChild(el("h3", null, "Cấp quyền Học viên thủ công")); c1.lastChild.style.fontSize = "17px";
    c1.appendChild(el("p", "note", "Dùng cho học sinh vào giữa khóa đã đóng tiền trực tiếp hoặc chuyển khoản cho thầy."));
    var who = el("input", "inp"); who.id = "gWho"; who.setAttribute("list", "accList"); who.placeholder = "Gõ biệt danh hoặc số điện thoại";
    var dlst = el("datalist"); dlst.id = "accList"; L.concat(logged() && !L.some(function (x) { return x.nick === st.nick; }) ? [{ nick: st.nick, phone: "tài khoản thử của bạn" }] : []).forEach(function (a) { var o = el("option"); o.value = a.nick; o.label = a.phone || ""; dlst.appendChild(o); });
    fld(c1, "Tài khoản", who); c1.appendChild(dlst);
    var from = fld(c1, "Mở khóa học từ buổi", lessonSelect("gFrom", Math.max(1, nextLesson - 1)));
    var exWrap = el("fieldset", "field"); exWrap.appendChild(el("legend", null, "Tặng thêm buổi cũ (không bắt buộc)")); var exBox = el("div", "checks"); exWrap.appendChild(exBox); c1.appendChild(exWrap);
    function drawExtra() { exBox.innerHTML = ""; for (var n = 1; n < +from.value; n++) { var lb = el("label"); var cb = el("input"); cb.type = "checkbox"; cb.value = n; lb.appendChild(cb); lb.appendChild(document.createTextNode(" Buổi " + n)); exBox.appendChild(lb); } if (+from.value === 1) exBox.appendChild(el("span", "note", "Mở từ buổi 1 nên không cần tặng thêm.")); }
    from.addEventListener("change", drawExtra); drawExtra();
    var gg = el("div", "grid2");
    var exp = el("input", "inp"); exp.type = "date"; exp.id = "gExp"; exp.value = "2027-05-31"; fld(gg, "Ngày hết hạn", exp);
    var paid = el("input", "inp"); paid.type = "text"; paid.id = "gPaid"; paid.placeholder = "Ví dụ: 5.500.000đ"; fld(gg, "Số tiền đã thu", paid);
    c1.appendChild(gg);
    var note = el("input", "inp"); note.type = "text"; note.id = "gNote"; note.placeholder = "Ví dụ: chuyển khoản, vào từ buổi 11"; fld(c1, "Ghi chú", note);
    var err = el("p", "err"); err.hidden = true; c1.appendChild(err);
    var sb = el("button", "btn", "Cấp quyền"); sb.type = "submit"; sb.style.justifySelf = "start"; c1.appendChild(sb);
    c1.addEventListener("submit", function (e) {
      e.preventDefault(); var n = who.value.trim();
      if (!n) { err.textContent = "Chọn tài khoản cần cấp quyền."; err.hidden = false; return; }
      if (!exp.value) { err.textContent = "Chọn ngày hết hạn."; err.hidden = false; return; }
      var extra = Array.prototype.map.call(exBox.querySelectorAll("input:checked"), function (x) { return +x.value; });
      var rec = { nick: n, role: "student", from: +from.value, extra: extra, exp: exp.value, paid: paid.value.trim(), note: note.value.trim(), src: "Cấp thủ công" };
      upsertAccount(rec);
      if (n === st.nick) st.access = { from: rec.from, extra: extra, exp: rec.exp, by: "Thầy cấp" };
      save(); renderAdmin(); toast("Đã cấp gói Học viên cho " + n + " (từ buổi " + rec.from + ")");
    });
    g.appendChild(c1);
    /* mã kích hoạt */
    var c2 = el("div", "card"); c2.style.cssText = "display:grid;gap:12px";
    c2.appendChild(el("h3", null, "Tạo mã kích hoạt")); c2.lastChild.style.fontSize = "17px";
    c2.appendChild(el("p", "note", "Gửi mã qua Zalo sau khi nhận tiền; học sinh tự nhập mã ở trang Khóa học hiện hành. Mỗi mã dùng một lần."));
    var cf = lessonSelect("cFrom", Math.max(1, nextLesson - 1)); fld(c2, "Mở khóa học từ buổi", cf);
    var cg = el("div", "grid2");
    var cexp = el("input", "inp"); cexp.type = "date"; cexp.id = "cExp"; cexp.value = "2027-05-31"; fld(cg, "Ngày hết hạn", cexp);
    var cpaid = el("input", "inp"); cpaid.type = "text"; cpaid.id = "cPaid"; cpaid.placeholder = "Ví dụ: 5.500.000đ"; fld(cg, "Số tiền đã thu", cpaid);
    c2.appendChild(cg);
    var mk = button("", "Tạo mã", function () { var c = { code: newCode(+cf.value), from: +cf.value, exp: cexp.value || "2027-05-31", paid: cpaid.value.trim(), usedBy: null, ts: Date.now() }; st.codes.unshift(c); save(); renderAdmin(); toast("Đã tạo mã " + c.code); });
    mk.style.justifySelf = "start"; c2.appendChild(mk);
    if (st.codes.length) {
      var t = el("table"); var th = el("thead"); var hr = el("tr"); ["Mã", "Từ buổi", "Hết hạn", "Trạng thái", ""].forEach(function (x) { hr.appendChild(el("th", null, x)); }); th.appendChild(hr); t.appendChild(th);
      var tb = el("tbody");
      st.codes.forEach(function (c) {
        var tr = el("tr"); tr.appendChild(el("td", "mono", c.code)); tr.appendChild(el("td", null, String(c.from))); tr.appendChild(el("td", null, vnDate(c.exp)));
        tr.appendChild(el("td", null, c.usedBy ? "Đã dùng: " + c.usedBy : "Chưa dùng"));
        var td = el("td"); if (!c.usedBy) { var cp = el("button", "linkbtn", "Sao chép"); cp.type = "button"; cp.addEventListener("click", function () { try { navigator.clipboard.writeText(c.code); } catch (e) {} toast("Đã sao chép " + c.code); }); td.appendChild(cp); } tr.appendChild(td);
        tb.appendChild(tr);
      });
      t.appendChild(tb); var tw = el("div", "tablebox"); tw.appendChild(t); c2.appendChild(tw);
      c2.appendChild(el("p", "note", "Thử: sao chép mã, chuyển sang vai trò Thành viên ở cuối trang, vào Khóa học hiện hành và nhập mã."));
    }
    g.appendChild(c2);
    box.appendChild(g);
    /* danh sách */
    var c3 = el("div", "card tablebox"); c3.style.cssText = "display:grid;gap:10px";
    c3.appendChild(el("h3", null, "Danh sách học viên khóa " + COURSE.name.replace("Khóa ", ""))); c3.lastChild.style.fontSize = "17px";
    var S = L.filter(function (a) { return a.role === "student"; });
    if (!S.length) c3.appendChild(el("p", "note", "Chưa có học viên."));
    else {
      var t3 = el("table"); var h3 = el("thead"); var r3 = el("tr"); ["Tài khoản", "Mở từ buổi", "Hết hạn", "Đã thu", "Nguồn", ""].forEach(function (x) { r3.appendChild(el("th", null, x)); }); h3.appendChild(r3); t3.appendChild(h3);
      var b3 = el("tbody");
      S.forEach(function (a) {
        var tr = el("tr"); tr.appendChild(el("td", null, a.nick + (a.phone ? " · " + a.phone : "")));
        tr.appendChild(el("td", null, a.from + (a.extra && a.extra.length ? " (+ " + a.extra.join(", ") + ")" : "")));
        tr.appendChild(el("td", null, vnDate(a.exp))); tr.appendChild(el("td", null, a.paid || "—")); tr.appendChild(el("td", null, a.src + (a.note ? " · " + a.note : "")));
        var td = el("td"); td.style.whiteSpace = "nowrap";
        var gh = el("button", "linkbtn", "Gia hạn 1 năm"); gh.type = "button"; gh.addEventListener("click", function () { var d = new Date(a.exp); d.setFullYear(d.getFullYear() + 1); a.exp = d.toISOString().slice(0, 10); if (a.nick === st.nick && st.access) st.access.exp = a.exp; save(); renderAdmin(); toast("Đã gia hạn " + a.nick + " đến " + vnDate(a.exp)); });
        var th2 = el("button", "linkbtn", "Thu hồi"); th2.type = "button"; th2.style.cssText = "color:var(--bad);margin-left:12px"; th2.addEventListener("click", function () { a.role = "member"; if (a.nick === st.nick) st.access = null; save(); renderAdmin(); toast("Đã thu hồi quyền Học viên của " + a.nick); });
        td.appendChild(gh); td.appendChild(th2); tr.appendChild(td); b3.appendChild(tr);
      });
      t3.appendChild(b3); c3.appendChild(t3);
    }
    c3.appendChild(el("p", "note", "Tài khoản hết hạn tự trở về Thành viên. Trang thật sẽ gửi Zalo nhắc gia hạn trước 7 ngày."));
    box.appendChild(c3);
  }

  /* ================= đánh giá thầy ================= */
  var rvStars = 5, rvEdit = false;
  function stars(n) { var sp = el("span", "stars", "★★★★★".slice(0, n) + "☆☆☆☆☆".slice(0, 5 - n)); sp.setAttribute("aria-label", n + " trên 5 sao"); return sp; }
  function renderReviews() {
    var all = (st.review ? [st.review] : []).concat(REVIEWS);
    var pub = all.filter(function (r) { return !r.pending; });
    var avg = pub.length ? pub.reduce(function (a, r) { return a + r.s; }, 0) / pub.length : 0;
    var h = $("rvAvg"); h.innerHTML = "";
    if (pub.length) { h.appendChild(stars(Math.round(avg))); h.appendChild(el("b", null, " " + avg.toFixed(1).replace(".", ",") + "/5")); h.appendChild(el("span", "note", " · " + pub.length + " đánh giá")); }
    else h.appendChild(el("span", "note", "Chưa có đánh giá"));
    if (LIVE && $("rvNote")) $("rvNote").textContent = "Thành viên có tài khoản viết đánh giá; mỗi tài khoản một đánh giá, thầy duyệt trước khi hiện.";
    var box = $("reviews"); box.innerHTML = "";
    all.forEach(function (r) {
      var ex = el("div"); ex.appendChild(stars(r.s));
      var c = cmtEl({ n: r.n, r: r.r, t: r.t, ts: r.ts }, null);
      var who = c.querySelector(".who"); who.insertBefore(el("span", "badge", r.who), who.querySelector("time"));
      c.querySelector("p").before(ex);
      if (r.pending) who.insertBefore(el("span", "badge st", "Chờ thầy duyệt"), who.querySelector("time"));
      if (r === st.review) { var ed = el("button", "linkbtn", "Sửa đánh giá"); ed.type = "button"; ed.addEventListener("click", function () { rvEdit = true; rvStars = r.s; renderReviews(); }); c.lastChild.appendChild(ed); }
      box.appendChild(c);
    });
    var fw = $("rvForm"); fw.innerHTML = "";
    if (!logged()) {
      var r0 = el("div", "mrow"); r0.style.cssText = "justify-content:flex-start;align-items:center";
      r0.appendChild(el("span", "note", "Đăng nhập để viết đánh giá về thầy."));
      r0.appendChild(button("sm", "Đăng nhập", function () { showLogin("Đăng nhập để đánh giá"); })); fw.appendChild(r0); return;
    }
    if (st.review && !rvEdit) { fw.appendChild(el("p", "note", "Cảm ơn bạn đã đánh giá. Mỗi tài khoản có một đánh giá, có thể sửa bất kỳ lúc nào.")); return; }
    var f = el("form", "cform");
    var sr = el("div", "starpick"); sr.setAttribute("role", "radiogroup"); sr.setAttribute("aria-label", "Số sao");
    [1, 2, 3, 4, 5].forEach(function (k) { var b = el("button", "star" + (k <= rvStars ? " on" : ""), "★"); b.type = "button"; b.setAttribute("role", "radio"); b.setAttribute("aria-checked", String(k === rvStars)); b.setAttribute("aria-label", k + " sao"); b.addEventListener("click", function () { rvStars = k; renderReviews(); }); sr.appendChild(b); });
    var row1 = el("div", "mrow"); row1.style.cssText = "justify-content:space-between;align-items:center";
    row1.appendChild(sr);
    var sel = el("select", "inp"); sel.style.maxWidth = "160px"; sel.setAttribute("aria-label", "Bạn là");
    ["Học sinh", "Phụ huynh"].forEach(function (x) { var o = el("option", null, x); if (st.review && st.review.who === x) o.selected = true; sel.appendChild(o); });
    row1.appendChild(sel); f.appendChild(row1);
    var ta = el("textarea"); ta.placeholder = "Cảm nhận của bạn về cách dạy, tài liệu, sự tiến bộ…"; ta.maxLength = 800; ta.setAttribute("aria-label", "Nội dung đánh giá"); if (st.review) ta.value = st.review.t; f.appendChild(ta);
    var r2 = el("div", "mrow"); r2.style.cssText = "justify-content:space-between;align-items:center";
    r2.appendChild(el("span", "note", "Đăng với tên " + st.nick + " · đánh giá được thầy duyệt trước khi hiện"));
    var sbt = el("button", "btn sm", st.review ? "Lưu đánh giá" : "Gửi đánh giá"); sbt.type = "submit"; r2.appendChild(sbt); f.appendChild(r2);
    f.addEventListener("submit", function (e) { e.preventDefault(); var v = ta.value.trim(); if (v.length < 10) { ta.focus(); toast("Viết thêm vài câu cảm nhận nhé"); return; }
      if (LIVE) { liveSaveReview(sel.value, rvStars, v); return; }
      st.review = { n: st.nick, r: st.role, who: sel.value, s: rvStars, t: v, ts: Date.now() }; rvEdit = false; save(); renderReviews(); toast("Đã gửi đánh giá"); });
    fw.appendChild(f);
  }

  /* ================= đăng ký học ================= */
  /* Thầy dán link Google Form vào 3 dòng "form" dưới đây; để trống thì nút báo đang chờ link. */
  var REG_FORMS = [
    { k: "online", name: "Đăng ký lớp online", form: "", desc: "Lớp nhóm học qua Microsoft Teams, có bản ghi buổi học để xem lại.", items: ["Lớp cơ bản và lớp nâng cao", "Lịch cố định trong tuần", "Tài liệu, video trên trang Khóa học hiện hành"] },
    { k: "1-1", name: "Đăng ký học 1-1", form: "", desc: "Thầy kèm riêng, lộ trình theo mục tiêu và lịch của từng học sinh.", items: ["Trực tuyến hoặc trực tiếp tại Hà Nội", "Lấy lại nền, thi tốt nghiệp, đại học, HSG", "Lịch học thỏa thuận"] },
    { k: "doi-tuyen", name: "Đăng ký học theo đội tuyển", form: "", desc: "Dành cho đội tuyển HSG của trường hoặc nhóm học sinh ôn thi chung.", items: ["Ôn thi HSG cấp tỉnh/thành phố, Quốc gia", "Online cho cả đội hoặc thầy dạy tại trường", "Chuyên đề theo yêu cầu của đội"] }
  ];
  REG_FORMS.forEach(function (r) { if (CFG.forms && CFG.forms[r.k]) r.form = CFG.forms[r.k]; });
  function renderReg() {
    var box = $("regCards"); box.innerHTML = "";
    REG_FORMS.forEach(function (r) {
      var c = el("article", "card reg");
      c.appendChild(el("h3", null, r.name)); c.appendChild(el("p", null, r.desc));
      var ul = el("ul"); r.items.forEach(function (x) { ul.appendChild(el("li", null, x)); }); c.appendChild(ul);
      c.appendChild(el("p", "note", "Học phí, lịch khai giảng: thầy bổ sung"));
      if (r.form) { var a = el("a", "btn", "Đăng ký qua Google Form ↗"); a.href = r.form; a.target = "_blank"; a.rel = "noopener"; c.appendChild(a); }
      else { c.appendChild(button("", "Đăng ký qua Google Form ↗", function () { toast("Chờ thầy gửi link Google Form cho mục \"" + r.name + "\""); })); c.appendChild(el("span", "fill", "Link Google Form: thầy cung cấp")); c.lastChild.style.cssText = "align-self:flex-start;font-size:13px"; }
      box.appendChild(c);
    });
  }

  /* =====================================================================
     CHẾ ĐỘ THẬT: nối với Supabase (bật khi config.js có supabaseUrl)
     ===================================================================== */
  var LV = { pageKey: "hhtp-live" };
  function sbErr(e, prefix) { toast((prefix || "Lỗi") + ": " + (e && (e.message || e.error_description) || "không rõ")); }
  function liveLogin(reason, onDone) {
    openModal(function (box) {
      head(box, "Đăng nhập", reason || "Đăng nhập hoặc tạo tài khoản");
      box.appendChild(el("p", "note", "Nhập email, trang gửi một đường link đăng nhập vào hộp thư. Bấm link là vào được, không cần mật khẩu. Lần đầu đăng nhập sẽ tự tạo tài khoản."));
      var inp = el("input", "inp"); inp.type = "email"; inp.id = "emailIn"; inp.placeholder = "email@vidu.com"; inp.autocomplete = "email";
      fld(box, "Email", inp);
      var msg = el("p", "note"); msg.hidden = true; box.appendChild(msg);
      var send = button("", "Gửi link đăng nhập", function () {
        var em = inp.value.trim();
        if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(em)) { msg.textContent = "Email chưa đúng định dạng."; msg.hidden = false; return; }
        send.disabled = true; send.textContent = "Đang gửi…";
        sb.auth.signInWithOtp({ email: em, options: { emailRedirectTo: location.origin + location.pathname } }).then(function (r) {
          send.disabled = false; send.textContent = "Gửi lại link";
          if (r.error) { msg.textContent = "Chưa gửi được: " + r.error.message; msg.hidden = false; return; }
          msg.textContent = "Đã gửi. Mở hộp thư " + em + " (xem cả mục Spam/Quảng cáo), bấm link “Log In” để đăng nhập. Có thể đóng cửa sổ này."; msg.hidden = false;
          LV.after = onDone || null;
        });
      });
      row(box, [button("ghost", "Đóng", closeModal), send]);
      var or = el("p", "note", "hoặc"); or.style.textAlign = "center"; box.appendChild(or);
      var g = button("ghost", "Đăng nhập bằng Google", function () { LV.after = onDone || null; sb.auth.signInWithOAuth({ provider: "google", options: { redirectTo: location.origin + location.pathname } }).then(function (r) { if (r.error) sbErr(r.error, "Chưa đăng nhập Google được"); }); });
      g.style.width = "100%"; box.appendChild(g);
    });
  }
  function accountMenu() {
    openModal(function (box) {
      head(box, "Tài khoản", st.nick);
      var dl = el("dl", "kv"); [["Hạng", ROLES[st.role] || st.role], ["Email", LV.email || ""], ["Bài làm đúng", String(st.correct)]].forEach(function (p) { dl.appendChild(el("dt", null, p[0])); var dd = el("dd", null, p[1]); dd.style.fontFamily = "var(--body)"; dl.appendChild(dd); });
      if (LV.prof && LV.prof.vip_until && new Date(LV.prof.vip_until) > new Date()) { dl.appendChild(el("dt", null, "VIP đến")); dl.appendChild(el("dd", null, vnDate(LV.prof.vip_until))); }
      if (LV.prof && LV.prof.student_until && new Date(LV.prof.student_until) > new Date()) { dl.appendChild(el("dt", null, "Học viên đến")); dl.appendChild(el("dd", null, vnDate(LV.prof.student_until))); }
      box.appendChild(dl);
      var nk = el("input", "inp"); nk.id = "nickEdit"; nk.maxLength = 24; nk.value = st.nick; fld(box, "Biệt danh (hiện khi bình luận, hỏi đáp)", nk);
      row(box, [button("ghost", "Đăng xuất", function () { sb.auth.signOut().then(function () { closeModal(); toast("Đã đăng xuất"); }); }),
        button("", "Lưu biệt danh", function () {
          var v = nk.value.trim(); if (v.length < 2) { toast("Biệt danh cần ít nhất 2 ký tự"); return; }
          sb.rpc("update_my_profile", { p_nick: v, p_phone: LV.prof ? LV.prof.phone : null }).then(function (r) { if (r.error) { sbErr(r.error, /duplicate|unique/i.test(r.error.message) ? "Biệt danh đã có người dùng" : "Chưa lưu được"); return; } st.nick = v; closeModal(); renderAll(); toast("Đã lưu biệt danh"); });
        })]);
    });
  }
  function mapExercises(rows) {
    var b = [], a = [], e = [];
    rows.forEach(function (x) {
      var q = { id: "x" + x.id, db: x.id, g: x.category, isNew: x.is_new };
      if (x.kind === "essay") { q.essay = true; q.name = (x.title || "").replace(/^Tổng hợp\s+/, "") || "Bài " + x.id; q.text = x.stem; q.de = x.images || []; q.ask = x.ask; e.push(q); }
      else { q.t = x.stem; q.o = x.options || []; (x.level === "basic" ? b : a).push(q); }
    });
    BASIC = b; ADV = a; ESSAY = e;
  }
  function loadExercises() {
    return sb.from("exercises").select("id,level,category,kind,title,stem,options,images,ask,is_new").order("id").then(function (r) { if (r.error) { sbErr(r.error, "Không tải được bài tập"); return; } mapExercises(r.data || []); });
  }
  function fetchKey(q) {
    if (q._k) return; q._k = true;
    sb.rpc("submit_answer", { p_ex: q.db, p_choice: st.ans[q.id] }).then(function (r) { if (r.error) return; q.a = r.data.answer; q.e = r.data.explain; q.ans = r.data.short_answer; renderEx(); });
  }
  function fetchSolution(q, viaAd) {
    if (q._s) return; q._s = true;
    sb.rpc("get_solution", { p_ex: q.db, p_via_ad: !!viaAd }).then(function (r) {
      if (r.error) { q._s = false; sbErr(r.error); return; }
      q.s = r.data.solution || []; q.da = r.data.answer_images || []; if (r.data.short_answer) q.ans = r.data.short_answer; renderEx();
    });
  }
  function loadComments() {
    return sb.from("comments").select("id,exercise_id,user_id,body,created_at").order("id").then(function (r) {
      if (r.error) return;
      var ids = {}; (r.data || []).forEach(function (c) { ids[c.user_id] = 1; });
      var list = Object.keys(ids);
      var done = function (pp) {
        var by = {}; (pp || []).forEach(function (p) { by[p.id] = p; });
        CM_SEED = {}; (r.data || []).forEach(function (c) { var p = by[c.user_id] || { nick: "?", role: "member" }; (CM_SEED["x" + c.exercise_id] = CM_SEED["x" + c.exercise_id] || []).push({ n: p.nick, r: p.role, t: c.body, ts: new Date(c.created_at).getTime() }); });
      };
      if (!list.length) { done([]); return; }
      return sb.from("public_profiles").select("id,nick,role").in("id", list).then(function (x) { done(x.data); });
    });
  }
  function loadCourse() {
    return sb.from("courses").select("id,name,description,meta").eq("active", true).order("id", { ascending: false }).limit(1).then(function (r) {
      if (r.error || !r.data || !r.data.length) return;
      var c = r.data[0];
      return sb.from("lessons").select("id,n,title,held_on,lesson_files(id,kind,title,position)").eq("course_id", c.id).order("n").then(function (l) {
        if (l.error) return;
        var ls = (l.data || []).map(function (x) {
          var f = (x.lesson_files || []).slice().sort(function (p, q) { return p.position - q.position; });
          var fp = f.filter(function (z) { return z.kind === "pdf"; }), fv = f.filter(function (z) { return z.kind === "video"; });
          return { id: x.id, n: x.n, d: x.held_on ? vnDate(x.held_on) : "", t: x.title, docs: fp.map(function (z) { return z.title; }), docIds: fp.map(function (z) { return z.id; }), vids: fv.map(function (z) { return z.title; }), vidIds: fv.map(function (z) { return z.id; }) };
        });
        if (ls.length) ls[ls.length - 1].isNew = true;
        COURSE = { id: c.id, name: c.name, desc: c.description || "", meta: c.meta || [], lessons: ls };
      });
    });
  }
  function loadMine(uid) {
    var p1 = sb.from("profiles").select("*").eq("id", uid).single();
    var p2 = sb.rpc("role_of", { uid: uid });
    var p3 = sb.from("attempts").select("exercise_id,choice,done");
    var p4 = sb.from("unlocks").select("kind,ref_id");
    var p5 = sb.from("lesson_purchases").select("lesson_id");
    return Promise.all([p1, p2, p3, p4, p5]).then(function (R) {
      var prof = R[0].data; LV.prof = prof;
      if (!prof) return;
      st.nick = prof.nick; st.role = R[1].data || "member"; st.correct = prof.correct_count || 0;
      st.ans = {}; st.done = {}; st.sol = {};
      (R[2].data || []).forEach(function (a) { if (a.choice != null) st.ans["x" + a.exercise_id] = a.choice; if (a.done) st.done["x" + a.exercise_id] = true; });
      (R[3].data || []).forEach(function (u) { if (u.kind === "solution") st.sol["x" + u.ref_id] = true; });
      st.access = null;
      if (st.role === "student" && (prof.student_from_lesson > 1 || (prof.student_extra_lessons || []).length)) st.access = { from: prof.student_from_lesson, extra: prof.student_extra_lessons || [], exp: prof.student_until, by: "" };
      st.lessonBought = {}; var bought = (R[4].data || []).map(function (x) { return x.lesson_id; });
      (COURSE.lessons || []).forEach(function (l) { if (bought.indexOf(l.id) >= 0) st.lessonBought[l.n] = true; });
      st.studentExpired = !!(prof.student_ever && st.role !== "student");
    });
  }
  function liveSession(session) {
    var u = session && session.user;
    LV.email = u ? u.email : "";
    var base = { role: "guest", nick: "", correct: 0, ans: {}, sol: {}, done: {}, access: null, lessonBought: {} };
    var keepPage = st.exPage || {};
    for (var k in base) st[k] = base[k];
    st.exPage = keepPage;
    BASIC.concat(ADV, ESSAY).forEach(function (q) { delete q._k; delete q._s; });
    var p = (u ? loadMine(u.id) : Promise.resolve()).then(function () { return Promise.all([loadForum(), loadReviews(), loadShop()]); });
    return p.then(function () { pageNow = {}; renderAll(); if (u && LV.after) { var f = LV.after; LV.after = null; f(); } });
  }
  function liveRedeem(code) {
    return sb.rpc("redeem_code", { p_code: code }).then(function (r) {
      if (r.error) return r.error.message.replace(/^.*?:\s*/, "");
      return sb.auth.getSession().then(function (s) { return liveSession(s.data.session); }).then(function () { return ""; });
    });
  }
  function renderAdminLive(box) {
    var g = el("div", "grid2"); g.style.alignItems = "start"; box.appendChild(g);
    var c1 = el("form", "card"); c1.style.cssText = "display:grid;gap:12px"; g.appendChild(c1);
    c1.appendChild(el("h3", null, "Cấp quyền Học viên thủ công")); c1.lastChild.style.fontSize = "17px";
    c1.appendChild(el("p", "note", "Học sinh cần đăng nhập trang ít nhất một lần để có tài khoản. Gõ đúng biệt danh của học sinh."));
    var who = el("input", "inp"); who.id = "gWho"; who.setAttribute("list", "accList"); who.placeholder = "Biệt danh của học sinh"; fld(c1, "Tài khoản", who);
    var dlst = el("datalist"); dlst.id = "accList"; c1.appendChild(dlst);
    sb.from("profiles").select("id,nick,phone").order("nick").then(function (r) { (r.data || []).forEach(function (p) { var o = el("option"); o.value = p.nick; o.label = p.phone || ""; dlst.appendChild(o); }); LV.accounts = r.data || []; });
    var nextLesson = (COURSE.lessons || []).length + 1;
    var from = fld(c1, "Mở khóa học từ buổi", lessonSelect("gFrom", Math.max(1, nextLesson - 1)));
    var exWrap = el("fieldset", "field"); exWrap.appendChild(el("legend", null, "Tặng thêm buổi cũ (không bắt buộc)")); var exBox = el("div", "checks"); exWrap.appendChild(exBox); c1.appendChild(exWrap);
    function drawExtra() { exBox.innerHTML = ""; for (var n = 1; n < +from.value; n++) { var lb = el("label"); var cb = el("input"); cb.type = "checkbox"; cb.value = n; lb.appendChild(cb); lb.appendChild(document.createTextNode(" Buổi " + n)); exBox.appendChild(lb); } if (+from.value === 1) exBox.appendChild(el("span", "note", "Mở từ buổi 1 nên không cần tặng thêm.")); }
    from.addEventListener("change", drawExtra); drawExtra();
    var gg = el("div", "grid2");
    var exp = el("input", "inp"); exp.type = "date"; exp.id = "gExp"; exp.value = "2027-05-31"; fld(gg, "Ngày hết hạn", exp);
    var paid = el("input", "inp"); paid.id = "gPaid"; paid.placeholder = "Ví dụ: 5.500.000đ"; fld(gg, "Số tiền đã thu", paid); c1.appendChild(gg);
    var note = el("input", "inp"); note.id = "gNote"; note.placeholder = "Ví dụ: chuyển khoản"; fld(c1, "Ghi chú", note);
    var err = el("p", "err"); err.hidden = true; c1.appendChild(err);
    var sbtn = el("button", "btn", "Cấp quyền"); sbtn.type = "submit"; sbtn.style.justifySelf = "start"; c1.appendChild(sbtn);
    c1.addEventListener("submit", function (e) {
      e.preventDefault(); err.hidden = true;
      var acc = (LV.accounts || []).filter(function (p) { return p.nick === who.value.trim(); })[0];
      if (!acc) { err.textContent = "Không tìm thấy tài khoản có biệt danh này."; err.hidden = false; return; }
      var extra = Array.prototype.map.call(exBox.querySelectorAll("input:checked"), function (x) { return +x.value; });
      sb.rpc("admin_grant_student", { p_user: acc.id, p_from: +from.value, p_extra: extra, p_expires: exp.value, p_paid: paid.value.trim(), p_note: note.value.trim() }).then(function (r) {
        if (r.error) { err.textContent = r.error.message; err.hidden = false; return; }
        toast("Đã cấp gói Học viên cho " + acc.nick); renderAdmin();
      });
    });
    var c2 = el("div", "card"); c2.style.cssText = "display:grid;gap:12px"; g.appendChild(c2);
    c2.appendChild(el("h3", null, "Tạo mã kích hoạt")); c2.lastChild.style.fontSize = "17px";
    c2.appendChild(el("p", "note", "Gửi mã qua Zalo sau khi nhận tiền; học sinh nhập mã ở trang Khóa học hiện hành. Mỗi mã dùng một lần."));
    var cf = lessonSelect("cFrom", Math.max(1, nextLesson - 1)); fld(c2, "Mở khóa học từ buổi", cf);
    var cg = el("div", "grid2");
    var cexp = el("input", "inp"); cexp.type = "date"; cexp.id = "cExp"; cexp.value = "2027-05-31"; fld(cg, "Ngày hết hạn", cexp);
    var cpaid = el("input", "inp"); cpaid.id = "cPaid"; cpaid.placeholder = "Ví dụ: 5.500.000đ"; fld(cg, "Số tiền đã thu", cpaid); c2.appendChild(cg);
    var mk = button("", "Tạo mã", function () { sb.rpc("admin_create_code", { p_from: +cf.value, p_expires: cexp.value || "2027-05-31", p_paid: cpaid.value.trim() }).then(function (r) { if (r.error) { sbErr(r.error); return; } toast("Đã tạo mã " + r.data); renderAdmin(); }); });
    mk.style.justifySelf = "start"; c2.appendChild(mk);
    var tw = el("div", "tablebox"); c2.appendChild(tw);
    sb.from("activation_codes").select("code,from_lesson,expires_on,used_by,used_at,created_at").order("created_at", { ascending: false }).limit(50).then(function (r) {
      if (!r.data || !r.data.length) { tw.appendChild(el("p", "note", "Chưa có mã nào.")); return; }
      var t = el("table"); var hr = el("tr"); ["Mã", "Từ buổi", "Hết hạn", "Trạng thái", ""].forEach(function (x) { hr.appendChild(el("th", null, x)); }); var th = el("thead"); th.appendChild(hr); t.appendChild(th);
      var tb = el("tbody"); r.data.forEach(function (c) {
        var tr = el("tr"); tr.appendChild(el("td", "mono", c.code)); tr.appendChild(el("td", null, String(c.from_lesson))); tr.appendChild(el("td", null, vnDate(c.expires_on))); tr.appendChild(el("td", null, c.used_by ? "Đã dùng" : "Chưa dùng"));
        var td = el("td"); if (!c.used_by) { var cp = el("button", "linkbtn", "Sao chép"); cp.type = "button"; cp.addEventListener("click", function () { try { navigator.clipboard.writeText(c.code); } catch (e) {} toast("Đã sao chép " + c.code); }); td.appendChild(cp); } tr.appendChild(td); tb.appendChild(tr);
      }); t.appendChild(tb); tw.appendChild(t);
    });
    var c3 = el("div", "card tablebox"); c3.style.cssText = "display:grid;gap:10px"; box.appendChild(c3);
    c3.appendChild(el("h3", null, "Danh sách học viên")); c3.lastChild.style.fontSize = "17px";
    sb.rpc("admin_students").then(function (r) {
      var S = r.data || [];
      if (!S.length) { c3.appendChild(el("p", "note", "Chưa có học viên.")); return; }
      var t = el("table"); var hr = el("tr"); ["Tài khoản", "Mở từ buổi", "Hết hạn", "Trạng thái", "Ghi chú", ""].forEach(function (x) { hr.appendChild(el("th", null, x)); }); var th = el("thead"); th.appendChild(hr); t.appendChild(th);
      var tb = el("tbody"); S.forEach(function (a) {
        var active = new Date(a.student_until) > new Date(), n = a.last_note || {};
        var tr = el("tr"); tr.appendChild(el("td", null, a.nick + (a.phone ? " · " + a.phone : "")));
        tr.appendChild(el("td", null, a.student_from_lesson + ((a.student_extra_lessons || []).length ? " (+ " + a.student_extra_lessons.join(", ") + ")" : "")));
        tr.appendChild(el("td", null, vnDate(a.student_until))); tr.appendChild(el("td", null, active ? "Đang học" : "Hết hạn"));
        tr.appendChild(el("td", null, [n.paid, n.note, n.code ? "Mã " + n.code : ""].filter(Boolean).join(" · ") || "—"));
        var td = el("td"); td.style.whiteSpace = "nowrap";
        var gh = el("button", "linkbtn", "Gia hạn 1 năm"); gh.type = "button"; gh.addEventListener("click", function () { var d = new Date(Math.max(new Date(a.student_until), new Date())); d.setFullYear(d.getFullYear() + 1); sb.rpc("admin_grant_student", { p_user: a.id, p_from: a.student_from_lesson, p_extra: a.student_extra_lessons || [], p_expires: d.toISOString().slice(0, 10), p_paid: "", p_note: "Gia hạn" }).then(function (x) { if (x.error) { sbErr(x.error); return; } toast("Đã gia hạn " + a.nick); renderAdmin(); }); });
        var rv = el("button", "linkbtn", "Thu hồi"); rv.type = "button"; rv.style.cssText = "color:var(--bad);margin-left:12px"; rv.addEventListener("click", function () { if (!confirm("Thu hồi quyền Học viên của " + a.nick + "?")) return; sb.rpc("admin_revoke_student", { p_user: a.id }).then(function (x) { if (x.error) { sbErr(x.error); return; } toast("Đã thu hồi"); renderAdmin(); }); });
        td.appendChild(gh); if (active) td.appendChild(rv); tr.appendChild(td); tb.appendChild(tr);
      }); t.appendChild(tb); c3.appendChild(t);
    });
  }
  /* ---- Hỏi đáp (thật) ---- */
  function nickMap(ids) {
    ids = Object.keys(ids || {}); if (!ids.length) return Promise.resolve({});
    return sb.from("public_profiles").select("id,nick,role").in("id", ids).then(function (r) { var m = {}; (r.data || []).forEach(function (p) { m[p.id] = p; }); return m; });
  }
  function loadForum() {
    var uid = LV.prof && LV.prof.id;
    return Promise.all([
      sb.from("topics").select("id,user_id,category,title,body,best_reply_id,approved,image_key,created_at").order("id", { ascending: false }),
      sb.from("replies").select("id,topic_id,user_id,body,created_at").order("id"),
      sb.from("reply_likes").select("user_id,reply_id")
    ]).then(function (R) {
      var T = R[0].data || [], P = R[1].data || [], L = R[2].data || [], ids = {};
      T.forEach(function (t) { ids[t.user_id] = 1; }); P.forEach(function (p) { ids[p.user_id] = 1; });
      return nickMap(ids).then(function (m) {
        var who = function (id) { return m[id] || { nick: "?", role: "member" }; };
        st.likes = {}; st.solved = {}; st.topics = []; st.rep = {};
        TOPICS = T.map(function (t) {
          var reps = P.filter(function (p) { return p.topic_id === t.id; });
          var o = { id: t.id, n: who(t.user_id).nick, r: who(t.user_id).role, g: t.category, title: t.title, body: t.body, ts: new Date(t.created_at).getTime(), mine: t.user_id === uid, uid: t.user_id, pending: t.approved === false, hasImg: !!t.image_key, replies: [] };
          reps.forEach(function (p, i) {
            var total = L.filter(function (l) { return l.reply_id === p.id; }).length, mineLike = L.some(function (l) { return l.reply_id === p.id && l.user_id === uid; });
            if (mineLike) st.likes[t.id + ":" + i] = true;
            o.replies.push({ rid: p.id, n: who(p.user_id).nick, r: who(p.user_id).role, t: p.body, ts: new Date(p.created_at).getTime(), likes: total - (mineLike ? 1 : 0) });
            if (t.best_reply_id === p.id) o.best = i;
          });
          return o;
        });
      });
    });
  }
  function forumAfter(msg) { return loadForum().then(function () { renderForum(); if (msg) toast(msg); }); }
  function liveLike(t, i) {
    var r = t.replies[i], k = t.id + ":" + i;
    var q = st.likes[k] ? sb.from("reply_likes").delete().eq("user_id", LV.prof.id).eq("reply_id", r.rid) : sb.from("reply_likes").insert({ user_id: LV.prof.id, reply_id: r.rid });
    q.then(function (x) { if (x.error) { sbErr(x.error); return; } forumAfter(); });
  }
  function liveBest(t, i) { sb.from("topics").update({ best_reply_id: t.replies[i].rid }).eq("id", t.id).then(function (x) { if (x.error) { sbErr(x.error); return; } forumAfter("Đã đánh dấu câu hỏi đã giải quyết"); }); }
  function liveReply(t, v) { if (banned()) return; sb.from("replies").insert({ topic_id: t.id, user_id: LV.prof.id, body: v }).then(function (x) { if (x.error) { sbErr(x.error, "Chưa gửi được"); return; } forumAfter("Đã gửi câu trả lời"); }); }
  function uploadForumImage(blob) {
    if (!blob) return Promise.resolve(null);
    toast("Đang tải ảnh lên…");
    return authToken().then(function (tok) { return fetch("/api/forum-image", { method: "PUT", headers: { Authorization: "Bearer " + tok, "Content-Type": blob.type || "application/octet-stream" }, body: blob }); })
      .then(function (r) { return r.json().catch(function () { return {}; }).then(function (j) { if (!r.ok) throw new Error(j.error || ("Lỗi " + r.status)); return j.key; }); });
  }
  function liveAsk(cat, title, body, img) {
    return uploadForumImage(img).catch(function (e) { toast("Chưa tải được ảnh: " + e.message); return false; }).then(function (key) {
      if (key === false) return { error: null, skip: true };
      return sb.from("topics").insert({ user_id: LV.prof.id, category: cat, title: title, body: body, image_key: key || null }).select("id").single();
    }).then(function (x) {
      if (x.skip) return false;
      if (x.error) { sbErr(x.error, "Chưa đăng được"); return false; }
      forumOpen = x.data.id; return forumAfter(st.role === "teacher" ? "Đã đăng câu hỏi" : "Đã gửi câu hỏi, thầy sẽ duyệt trước khi hiện cho mọi người").then(function () { return true; });
    });
  }
  function liveReport(type, id) {
    if (!logged()) { showLogin("Đăng nhập để báo cáo"); return; }
    sb.from("reports").insert({ user_id: LV.prof.id, target_type: type, target_id: id }).then(function (x) { if (x.error) { sbErr(x.error); return; } toast("Đã gửi báo cáo, thầy sẽ xem xét"); });
  }

  /* ---- Đánh giá thầy (thật) ---- */
  function loadReviews() {
    return sb.from("reviews").select("user_id,who,stars,body,approved,updated_at").order("updated_at", { ascending: false }).then(function (r) {
      var rows = r.data || [], ids = {}; rows.forEach(function (x) { ids[x.user_id] = 1; });
      return nickMap(ids).then(function (m) {
        var uid = LV.prof && LV.prof.id;
        var map = function (x) { var p = m[x.user_id] || { nick: "?", role: "member" }; return { n: p.nick, r: p.role, who: x.who, s: x.stars, t: x.body, ts: new Date(x.updated_at).getTime(), pending: !x.approved }; };
        REVIEWS = rows.filter(function (x) { return x.approved && x.user_id !== uid; }).map(map);
        var mine = rows.filter(function (x) { return x.user_id === uid; })[0];
        st.review = mine ? map(mine) : null;
      });
    });
  }
  function liveSaveReview(who, s, body) {
    if (banned()) return;
    sb.from("reviews").upsert({ user_id: LV.prof.id, who: who, stars: s, body: body }, { onConflict: "user_id" }).then(function (x) {
      if (x.error) { sbErr(x.error, "Chưa gửi được"); return; }
      rvEdit = false; loadReviews().then(function () { renderReviews(); toast("Đã gửi đánh giá, thầy sẽ duyệt trước khi hiện"); });
    });
  }

  /* ---- Cấm đăng bài ---- */
  function banText(v) { if (!v) return ""; return /infinity/i.test(String(v)) ? "vô thời hạn" : "đến " + new Date(v).toLocaleString("vi-VN", { hour: "2-digit", minute: "2-digit", day: "2-digit", month: "2-digit", year: "numeric" }); }
  function isBanned(v) { return !!v && (/infinity/i.test(String(v)) || new Date(v) > new Date()); }
  function banned() {
    var v = LV.prof && LV.prof.banned_until;
    if (!isBanned(v)) return false;
    toast("Tài khoản của bạn đang bị khóa đăng bài " + banText(v) + ". Liên hệ thầy qua Zalo nếu có nhầm lẫn."); return true;
  }
  function setTopic(id, patch, msg) {
    sb.from("topics").update(patch).eq("id", id).then(function (r) { if (r.error) { sbErr(r.error); return; } toast(msg); if (patch.hidden) forumOpen = null; forumAfter(); if (location.hash === "#quan-tri") renderAdmin(); });
  }
  function banCtl(uid, nick) {
    var w = el("span", "cact"); if (!uid) return w;
    var s = el("select", "inp"); s.style.maxWidth = "150px"; s.setAttribute("aria-label", "Thời hạn cấm " + nick);
    [["7", "Cấm 1 tuần"], ["30", "Cấm 1 tháng"], ["", "Cấm vô thời hạn"]].forEach(function (o) { var op = el("option", null, o[1]); op.value = o[0]; s.appendChild(op); });
    w.appendChild(s);
    w.appendChild(button("sm amber", "Cấm " + nick, function () {
      var label = s.options[s.selectedIndex].text.toLowerCase();
      if (!confirm(label.charAt(0).toUpperCase() + label.slice(1) + " tài khoản " + nick + "? Bạn ấy vẫn đăng nhập và xem được, nhưng không đăng bài, bình luận hay trả lời được.")) return;
      sb.rpc("admin_ban", { p_user: uid, p_days: s.value ? +s.value : null }).then(function (r) { if (r.error) { sbErr(r.error); return; } toast("Đã cấm " + nick + " " + banText(r.data)); if (location.hash === "#quan-tri") renderAdmin(); });
    }));
    return w;
  }

  /* ---- Quản trị: duyệt đánh giá, xử lý báo cáo ---- */
  function renderModeration(box) {
    /* Câu hỏi chờ duyệt */
    var cq = el("div", "card"); cq.style.cssText = "display:grid;gap:10px"; box.appendChild(cq);
    cq.appendChild(el("h3", null, "Câu hỏi chờ duyệt")); cq.lastChild.style.fontSize = "17px";
    var qBox = el("div", "cmts"); cq.appendChild(qBox);
    sb.from("topics").select("id,user_id,category,title,body,created_at").eq("approved", false).eq("hidden", false).order("id").then(function (r) {
      var rows = r.data || []; if (!rows.length) { qBox.appendChild(el("p", "note", "Không có câu hỏi nào chờ duyệt.")); return; }
      var ids = {}; rows.forEach(function (x) { ids[x.user_id] = 1; });
      nickMap(ids).then(function (m) { rows.forEach(function (x) {
        var nk = (m[x.user_id] || {}).nick || "?";
        var ex = el("div", "cact");
        ex.appendChild(button("sm", "Duyệt", function () { setTopic(x.id, { approved: true }, "Đã duyệt câu hỏi"); }));
        ex.appendChild(button("ghost sm", "Từ chối", function () { setTopic(x.id, { hidden: true }, "Đã từ chối câu hỏi"); }));
        ex.appendChild(banCtl(x.user_id, nk));
        qBox.appendChild(cmtEl({ n: nk, r: (m[x.user_id] || {}).role, t: "[" + x.category + "] " + x.title + " — " + x.body, ts: new Date(x.created_at).getTime() }, ex));
      }); });
    });
    /* Cấm đăng bài */
    var cb = el("div", "card"); cb.style.cssText = "display:grid;gap:10px"; box.appendChild(cb);
    cb.appendChild(el("h3", null, "Cấm đăng bài")); cb.lastChild.style.fontSize = "17px";
    cb.appendChild(el("p", "note", "Thành viên bị cấm vẫn đăng nhập, xem bài và dùng tài liệu đã mua, nhưng không đặt câu hỏi, trả lời, bình luận hay viết đánh giá được. Hết hạn cấm thì tự mở lại."));
    var bf = el("div", "cact"); cb.appendChild(bf);
    var bw = el("input", "inp"); bw.placeholder = "Biệt danh thành viên"; bw.setAttribute("list", "banList"); bw.setAttribute("aria-label", "Biệt danh cần cấm"); bw.style.maxWidth = "240px"; bf.appendChild(bw);
    var bl = el("datalist"); bl.id = "banList"; bf.appendChild(bl);
    var bsel = el("select", "inp"); bsel.style.maxWidth = "170px"; bsel.setAttribute("aria-label", "Thời hạn cấm");
    [["7", "1 tuần"], ["30", "1 tháng"], ["", "Vô thời hạn"]].forEach(function (o) { var op = el("option", null, o[1]); op.value = o[0]; bsel.appendChild(op); }); bf.appendChild(bsel);
    var accs = [];
    bf.appendChild(button("sm amber", "Cấm", function () {
      var a = accs.filter(function (p) { return p.nick === bw.value.trim(); })[0];
      if (!a) { toast("Không tìm thấy thành viên có biệt danh này"); return; }
      if (!confirm("Cấm " + a.nick + " " + bsel.options[bsel.selectedIndex].text.toLowerCase() + "?")) return;
      sb.rpc("admin_ban", { p_user: a.id, p_days: bsel.value ? +bsel.value : null }).then(function (r) { if (r.error) { sbErr(r.error); return; } toast("Đã cấm " + a.nick + " " + banText(r.data)); renderAdmin(); });
    }));
    var bt = el("div", "tablebox"); cb.appendChild(bt);
    sb.from("profiles").select("id,nick,is_teacher,banned_until").order("nick").then(function (r) {
      accs = (r.data || []).filter(function (p) { return !p.is_teacher; });
      accs.forEach(function (p) { var o = el("option"); o.value = p.nick; bl.appendChild(o); });
      var on = accs.filter(function (p) { return isBanned(p.banned_until); });
      if (!on.length) { bt.appendChild(el("p", "note", "Hiện không có ai bị cấm.")); return; }
      var t = el("table"); var hr = el("tr"); ["Thành viên", "Bị cấm", ""].forEach(function (x) { hr.appendChild(el("th", null, x)); }); var th = el("thead"); th.appendChild(hr); t.appendChild(th);
      var tb = el("tbody"); on.forEach(function (p) {
        var tr = el("tr"); tr.appendChild(el("td", null, p.nick)); tr.appendChild(el("td", null, banText(p.banned_until)));
        var td = el("td"); var ub = el("button", "linkbtn", "Bỏ cấm"); ub.type = "button";
        ub.addEventListener("click", function () { sb.rpc("admin_ban", { p_user: p.id, p_days: 0 }).then(function (x) { if (x.error) { sbErr(x.error); return; } toast("Đã bỏ cấm " + p.nick); renderAdmin(); }); });
        td.appendChild(ub); tr.appendChild(td); tb.appendChild(tr);
      }); t.appendChild(tb); bt.appendChild(t);
    });
    var c = el("div", "card"); c.style.cssText = "display:grid;gap:10px"; box.appendChild(c);
    c.appendChild(el("h3", null, "Đánh giá chờ duyệt")); c.lastChild.style.fontSize = "17px";
    var rvBox = el("div", "cmts"); c.appendChild(rvBox);
    sb.from("reviews").select("user_id,who,stars,body,updated_at").eq("approved", false).order("updated_at").then(function (r) {
      var rows = r.data || []; if (!rows.length) { rvBox.appendChild(el("p", "note", "Không có đánh giá nào chờ duyệt.")); return; }
      var ids = {}; rows.forEach(function (x) { ids[x.user_id] = 1; });
      nickMap(ids).then(function (m) { rows.forEach(function (x) {
        var ex = el("div", "cact"); ex.appendChild(stars(x.stars));
        var ok = el("button", "btn sm", "Duyệt"); ok.type = "button"; ok.addEventListener("click", function () { sb.from("reviews").update({ approved: true }).eq("user_id", x.user_id).then(function (y) { if (y.error) { sbErr(y.error); return; } toast("Đã duyệt"); renderAdmin(); }); }); ex.appendChild(ok);
        rvBox.appendChild(cmtEl({ n: (m[x.user_id] || {}).nick || "?", r: (m[x.user_id] || {}).role, t: x.who + ": " + x.body, ts: new Date(x.updated_at).getTime() }, ex));
      }); });
    });
    var c2 = el("div", "card"); c2.style.cssText = "display:grid;gap:10px"; box.appendChild(c2);
    c2.appendChild(el("h3", null, "Báo cáo vi phạm")); c2.lastChild.style.fontSize = "17px";
    var rpBox = el("div", "cmts"); c2.appendChild(rpBox);
    sb.from("reports").select("id,target_type,target_id,created_at").eq("resolved", false).order("id").then(function (r) {
      var rows = r.data || []; if (!rows.length) { rpBox.appendChild(el("p", "note", "Không có báo cáo mới.")); return; }
      var tbl = { comment: "comments", topic: "topics", reply: "replies" }, label = { comment: "Bình luận bài tập", topic: "Câu hỏi", reply: "Câu trả lời", review: "Đánh giá" };
      rows.forEach(function (x) {
        var line = el("div", "cact"); line.appendChild(el("b", null, label[x.target_type] + " #" + x.target_id));
        var txt = el("span", "note", "Đang tải nội dung…"); line.appendChild(txt);
        var banSlot = el("span"); 
        if (tbl[x.target_type]) sb.from(tbl[x.target_type]).select(x.target_type === "topic" ? "user_id,title,body" : "user_id,body").eq("id", x.target_id).single().then(function (y) {
          txt.textContent = y.data ? "“" + (y.data.title ? y.data.title + ": " : "") + y.data.body.slice(0, 140) + "”" : "(đã xóa)";
          if (y.data) { var o = {}; o[y.data.user_id] = 1; nickMap(o).then(function (m) { banSlot.appendChild(banCtl(y.data.user_id, (m[y.data.user_id] || {}).nick || "người viết")); }); }
        });
        var hide = el("button", "btn sm amber", "Ẩn nội dung"); hide.type = "button";
        hide.addEventListener("click", function () { sb.from(tbl[x.target_type]).update({ hidden: true }).eq("id", x.target_id).then(function () { return sb.from("reports").update({ resolved: true }).eq("id", x.id); }).then(function () { toast("Đã ẩn"); renderAdmin(); }); });
        var skip = el("button", "btn sm ghost", "Bỏ qua"); skip.type = "button";
        skip.addEventListener("click", function () { sb.from("reports").update({ resolved: true }).eq("id", x.id).then(function () { renderAdmin(); }); });
        if (tbl[x.target_type]) line.appendChild(hide); line.appendChild(skip); line.appendChild(banSlot); rpBox.appendChild(line);
      });
    });
  }

  /* ---- File PDF và video thật ---- */
  function authToken() { return sb.auth.getSession().then(function (s) { return s.data.session ? s.data.session.access_token : ""; }); }
  function liveFile(type, id, mode, title) {
    if (type !== "free_doc" && !logged()) { showLogin("Đăng nhập để mở tài liệu"); return; }
    var win = mode === "view" ? window.open("", "_blank") : null;
    if (win) win.document.write("<p style='font:16px system-ui;padding:20px'>Đang mở tài liệu…</p>");
    toast("Đang tải tài liệu…");
    authToken().then(function (tok) {
      return fetch("/api/file?type=" + type + "&id=" + id + "&mode=" + (mode === "view" ? "view" : "download"), { headers: tok ? { Authorization: "Bearer " + tok } : {} });
    }).then(function (r) {
      if (!r.ok) return r.json().catch(function () { return {}; }).then(function (j) { throw new Error(j.error || ("Lỗi " + r.status)); });
      return r.blob();
    }).then(function (b) {
      var url = URL.createObjectURL(new Blob([b], { type: "application/pdf" }));
      if (win) { win.location.href = url; }
      else { var a = document.createElement("a"); a.href = url; a.download = (title || "tai-lieu").replace(/[\\/:*?"<>|]+/g, " ").trim() + ".pdf"; document.body.appendChild(a); a.click(); a.remove(); }
      setTimeout(function () { URL.revokeObjectURL(url); }, 120000);
    }).catch(function (e) { if (win) win.close(); toast(e.message); });
  }
  function liveVideo(type, id, title, t) {
    if (!id) { toast("Video chưa được gắn."); return; }
    openModal(function (box) {
      box.classList.add("wide");
      head(box, title, t);
      var holder = el("div", "note", "Đang tải video…"); box.appendChild(holder);
      row(box, [button("ghost", "Đóng", closeModal)]);
      authToken().then(function (tok) { return fetch("/api/video?type=" + type + "&id=" + id, { headers: { Authorization: "Bearer " + tok } }); })
        .then(function (r) { return r.json().then(function (j) { if (!r.ok) throw new Error(j.error || ("Lỗi " + r.status)); return j; }); })
        .then(function (j) {
          var fr = el("iframe", "pv vid"); fr.src = j.url; fr.title = t; fr.setAttribute("allow", "accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture"); fr.allowFullscreen = true;
          holder.replaceWith(fr);
          if (st.nick) { var wm = el("p", "note", "Video dành cho tài khoản " + st.nick + (LV.email ? " (" + LV.email + ")" : "") + ". Vui lòng không chia sẻ."); fr.after(wm); }
        }).catch(function (e) { holder.textContent = e.message; });
    });
  }

  /* ---- Thanh toán QR thật ---- */
  function bankCfg() { var b = CFG.bank || {}; return b.bin && b.accountNo ? b : null; }
  function livePay(type, itemId, title) {
    if (!logged()) { showLogin("Đăng nhập để thanh toán", function () { livePay(type, itemId, title); }); return; }
    var bank = bankCfg();
    if (!bank) { openModal(function (box) { head(box, "Thanh toán", title); box.appendChild(el("p", null, "Thầy chưa cấu hình tài khoản nhận tiền. Vui lòng nhắn Zalo cho thầy.")); row(box, [button("", "Đóng", closeModal)]); }); return; }
    sb.rpc("create_order", { p_type: type, p_item: itemId == null ? null : itemId }).then(function (r) {
      if (r.error) { sbErr(r.error, "Chưa tạo được đơn"); return; }
      var o = r.data, memo = ((bank.contentPrefix || "") + " " + o.code).trim();
      openModal(function (box) {
        head(box, "Thanh toán bằng mã QR", title);
        var img = el("img"); img.alt = "Mã QR chuyển khoản " + vnd(o.amount) + ", nội dung " + memo;
        img.src = "https://img.vietqr.io/image/" + encodeURIComponent(bank.bin) + "-" + encodeURIComponent(bank.accountNo) + "-compact2.png?amount=" + o.amount + "&addInfo=" + encodeURIComponent(memo) + "&accountName=" + encodeURIComponent(bank.accountName || "");
        img.style.cssText = "width:240px;max-width:100%;margin:0 auto;display:block;border-radius:8px;background:#fff";
        box.appendChild(img);
        var dl = el("dl", "kv");
        [["Số tiền", vnd(o.amount)], ["Nội dung", memo], ["Ngân hàng", bank.bankName || ""], ["Số tài khoản", bank.accountNo], ["Chủ tài khoản", bank.accountName || ""]].forEach(function (p) { dl.appendChild(el("dt", null, p[0])); dl.appendChild(el("dd", null, p[1])); });
        box.appendChild(dl);
        var stt = el("p", "note", "Quét mã bằng app ngân hàng. Giữ nguyên nội dung " + memo + " để hệ thống tự nhận. Đang chờ tiền về…"); box.appendChild(stt);
        row(box, [button("ghost", "Đóng", closeModal)]);
        var tries = 0;
        clearInterval(timer);
        timer = setInterval(function () {
          tries++; if (tries > 300) { clearInterval(timer); stt.textContent = "Chưa thấy tiền về. Nếu đã chuyển khoản, vui lòng nhắn Zalo cho thầy kèm mã " + o.code + "."; return; }
          sb.from("orders").select("status").eq("code", o.code).single().then(function (x) {
            if (x.data && x.data.status === "paid") {
              clearInterval(timer); closeModal();
              sb.auth.getSession().then(function (s) { return liveSession(s.data.session); }).then(function () { toast("Đã nhận thanh toán, cảm ơn bạn!"); });
            }
          });
        }, 3000);
      });
    });
  }

  /* ---- Tài liệu, tài liệu bán (thật) ---- */
  function loadDocs() {
    return sb.from("free_docs").select("id,category,tag,title,pages,access").order("id").then(function (r) {
      if (r.error) return;
      DOCS = (r.data || []).map(function (d) { return { id: "f" + d.id, dbId: d.id, cat: d.category, tag: d.tag || d.category, title: d.title, pages: d.pages, acc: d.access }; });
    });
  }
  function loadShop() {
    var q = [sb.from("shop_docs").select("id,category,tag,title,pages,price,preview_url").order("id"), sb.from("shop_videos").select("id,doc_id,title,position").order("position"), sb.from("shop_doc_stats").select("id,downloads")];
    if (LV.prof) q.push(sb.from("doc_access").select("doc_id,expires_at").eq("user_id", LV.prof.id));
    return Promise.all(q).then(function (R) {
      var vids = R[1].data || [], stats = {}; (R[2].data || []).forEach(function (s) { stats[s.id] = s.downloads; });
      SHOP = (R[0].data || []).map(function (d) {
        var vv = vids.filter(function (x) { return x.doc_id === d.id; }), v = vv.map(function (x) { return x.title; });
        return { id: "s" + d.id, dbId: d.id, cat: d.category, tag: d.tag || d.category, title: d.title, pages: d.pages, price: d.price, preview: d.preview_url || "", vids: v.length ? v : undefined, vidIds: vv.map(function (x) { return x.id; }), dl: stats[d.id] || 0 };
      });
      st.bought = {}; st.dl = {};
      (R[3] && R[3].data || []).forEach(function (a) { st.bought["s" + a.doc_id] = a.expires_at; });
      if (st.role === "teacher") SHOP.forEach(function (d) { st.bought[d.id] = "2099-12-31T00:00:00Z"; });
    });
  }
  /* ---- Quản trị: nội dung (tài liệu, video, buổi học) ---- */
  function uploadPdf(type, id, file, done) {
    if (!file) return;
    if (!/pdf$/i.test(file.type) && !/\.pdf$/i.test(file.name)) { toast("Chỉ nhận file PDF"); return; }
    toast("Đang tải lên " + file.name + "…");
    authToken().then(function (tok) { return fetch("/api/admin/file?type=" + type + "&id=" + id, { method: "PUT", headers: { Authorization: "Bearer " + tok, "Content-Type": "application/pdf" }, body: file }); })
      .then(function (r) { return r.json().then(function (j) { if (!r.ok) throw new Error(j.error || ("Lỗi " + r.status)); return j; }); })
      .then(function () { toast("Đã tải lên " + file.name); if (done) done(); })
      .catch(function (e) { toast("Chưa tải lên được: " + e.message); });
  }
  function saveBunny(type, id, vid, done) {
    sb.from("file_secrets").upsert({ owner_type: type, owner_id: id, bunny_video_id: vid.trim() || null }, { onConflict: "owner_type,owner_id" }).then(function (r) { if (r.error) { sbErr(r.error); return; } toast("Đã lưu mã video"); if (done) done(); });
  }
  function pdfCell(type, id, has, reload) {
    var w = el("div", "cact");
    w.appendChild(el("span", has ? "badge ok" : "badge", has ? "✓ Có PDF" : "Chưa có PDF"));
    var lb = el("label", "btn ghost sm", has ? "Thay PDF" : "Tải PDF lên"); var fi = el("input"); fi.type = "file"; fi.accept = "application/pdf,.pdf"; fi.hidden = true;
    fi.addEventListener("change", function () { uploadPdf(type, id, fi.files[0], reload); }); lb.appendChild(fi); w.appendChild(lb);
    return w;
  }
  /* Tên có nút Sửa (và Xóa nếu cho phép) cho trang Quản trị */
  function nameCell(prefix, text, table, id, done, canDelete, tag) {
    var w = el("span", "cact"); w.style.gap = "6px";
    function show() {
      w.innerHTML = ""; w.appendChild(el(tag || "span", null, prefix + text));
      var e = el("button", "linkbtn", "Sửa tên"); e.type = "button"; e.style.marginLeft = "8px"; e.addEventListener("click", edit); w.appendChild(e);
      if (canDelete) {
        var x = el("button", "linkbtn", "Xóa"); x.type = "button"; x.style.cssText = "color:var(--bad);margin-left:8px";
        x.addEventListener("click", function () { if (!confirm("Xóa “" + text + "”?")) return; sb.from(table).delete().eq("id", id).then(function (r) { if (r.error) { sbErr(r.error); return; } toast("Đã xóa"); done(); }); });
        w.appendChild(x);
      }
    }
    function edit() {
      w.innerHTML = ""; var inp = el("input", "inp"); inp.value = text; inp.style.maxWidth = "320px"; inp.setAttribute("aria-label", "Tên mới"); w.appendChild(inp);
      w.appendChild(button("sm", "Lưu", function () {
        var v = inp.value.trim(); if (!v) { toast("Tên không được để trống"); return; }
        sb.from(table).update({ title: v }).eq("id", id).then(function (r) { if (r.error) { sbErr(r.error); return; } text = v; toast("Đã sửa tên"); show(); done(); });
      }));
      w.appendChild(button("ghost sm", "Hủy", show)); inp.focus();
    }
    show(); return w;
  }
  function vidCell(type, id, cur, reload) {
    var w = el("div", "cact");
    var inp = el("input", "inp"); inp.placeholder = "Video ID trên Bunny"; inp.value = cur || ""; inp.style.maxWidth = "260px"; inp.setAttribute("aria-label", "Video ID Bunny");
    w.appendChild(inp); w.appendChild(button("sm", "Lưu", function () { saveBunny(type, id, inp.value, reload); }));
    if (cur) w.appendChild(el("span", "badge ok", "✓ Đã gắn"));
    return w;
  }
  function miniForm(fields, submitLabel, onSubmit) {
    var f = el("form", "mini"); var vals = {};
    fields.forEach(function (fd) {
      var node;
      if (fd.options) { node = el("select", "inp"); fd.options.forEach(function (o) { var arr = Array.isArray(o); var op = el("option", null, arr ? o[1] : o); op.value = arr ? o[0] : o; node.appendChild(op); }); }
      else { node = el("input", "inp"); node.type = fd.type || "text"; node.placeholder = fd.ph || ""; if (fd.value) node.value = fd.value; }
      node.setAttribute("aria-label", fd.label); node.title = fd.label; if (fd.w) node.style.maxWidth = fd.w; vals[fd.k] = node; f.appendChild(node);
    });
    var b = el("button", "btn sm", submitLabel); b.type = "submit"; f.appendChild(b);
    f.addEventListener("submit", function (e) { e.preventDefault(); var o = {}; for (var k in vals) o[k] = vals[k].value.trim(); onSubmit(o, f); });
    return f;
  }
  function renderContentAdmin(box) {
    var wrap = el("div", "card"); wrap.style.cssText = "display:grid;gap:14px"; box.appendChild(wrap);
    wrap.appendChild(el("h3", null, "Nội dung: tài liệu, video, buổi học")); wrap.lastChild.style.fontSize = "17px";
    wrap.appendChild(el("p", "note", "PDF lưu trong kho Cloudflare R2. Video tải lên Bunny Stream trước, rồi dán Video ID vào đây. Link xem thử là link Google Drive chỉ cho xem."));
    var body = el("div"); body.style.cssText = "display:grid;gap:14px"; wrap.appendChild(body);
    function reload() { renderContentAdmin.reloading = true; body.innerHTML = ""; draw(); }
    function draw() {
      Promise.all([
        sb.from("shop_docs").select("id,category,tag,title,pages,price,preview_url,published").order("id"),
        sb.from("shop_videos").select("id,doc_id,title,position").order("position"),
        sb.from("free_docs").select("id,category,tag,title,pages,access,published").order("id"),
        sb.from("courses").select("id,name").eq("active", true).order("id", { ascending: false }).limit(1),
        sb.from("file_secrets").select("owner_type,owner_id,storage_key,bunny_video_id")
      ]).then(function (R) {
        var sec = {}; (R[4].data || []).forEach(function (x) { sec[x.owner_type + ":" + x.owner_id] = x; });
        var S = function (t, i) { return sec[t + ":" + i] || {}; };
        /* Tài liệu bán */
        var d1 = el("details", "adm"); d1.open = true; d1.appendChild(el("summary", null, "Tài liệu bán (" + (R[0].data || []).length + ")")); body.appendChild(d1);
        d1.appendChild(miniForm([
          { k: "category", label: "Mục", options: SHOP_CATS.slice(1) }, { k: "title", label: "Tên tài liệu", ph: "Tên tài liệu" },
          { k: "tag", label: "Nhãn nhỏ", ph: "Nhãn, ví dụ Bài giảng · Lớp 12", w: "220px" }, { k: "pages", label: "Số trang", ph: "Số trang", type: "number", w: "110px" }, { k: "price", label: "Giá (đồng)", ph: "Giá, ví dụ 59000", type: "number", w: "150px" }
        ], "Thêm tài liệu bán", function (o) {
          if (!o.title || !o.price) { toast("Cần tên và giá"); return; }
          sb.from("shop_docs").insert({ category: o.category, title: o.title, tag: o.tag || null, pages: +o.pages || null, price: +o.price }).then(function (r) { if (r.error) { sbErr(r.error); return; } toast("Đã thêm tài liệu"); reload(); loadShop().then(renderShop); });
        }));
        (R[0].data || []).forEach(function (d) {
          var c = el("div", "admrow" + (d.published ? "" : " off"));
          var h = el("div", "cact"); h.appendChild(nameCell("", d.title, "shop_docs", d.id, function () { reload(); loadShop().then(renderShop); }, false, "b")); h.appendChild(el("span", "note", d.category + " · " + vnd(d.price) + (d.published ? "" : " · đang ẩn")));
          h.appendChild(button("ghost sm", d.published ? "Ẩn" : "Hiện", function () { sb.from("shop_docs").update({ published: !d.published }).eq("id", d.id).then(function () { reload(); loadShop().then(renderShop); }); }));
          c.appendChild(h);
          c.appendChild(pdfCell("shop_doc", d.id, !!S("shop_doc", d.id).storage_key, reload));
          var pv = el("div", "cact"); var pin = el("input", "inp"); pin.type = "url"; pin.placeholder = "Link xem thử (Google Drive)"; pin.value = d.preview_url || ""; pin.style.maxWidth = "360px"; pin.setAttribute("aria-label", "Link xem thử");
          pv.appendChild(pin); pv.appendChild(button("sm", "Lưu link xem thử", function () { sb.from("shop_docs").update({ preview_url: pin.value.trim() || null }).eq("id", d.id).then(function (x) { if (x.error) { sbErr(x.error); return; } toast("Đã lưu link xem thử"); loadShop().then(renderShop); }); }));
          c.appendChild(pv);
          (R[1].data || []).filter(function (v) { return v.doc_id === d.id; }).forEach(function (v) {
            var vr = el("div", "cact"); vr.appendChild(nameCell("▶ ", v.title, "shop_videos", v.id, function () { reload(); loadShop().then(renderShop); }, true)); vr.appendChild(vidCell("shop_video", v.id, S("shop_video", v.id).bunny_video_id, reload)); c.appendChild(vr);
          });
          c.appendChild(miniForm([{ k: "t", label: "Tên video mới", ph: "Tên video đính kèm mới", w: "320px" }], "Thêm video", function (o) {
            if (!o.t) return; var n = (R[1].data || []).filter(function (v) { return v.doc_id === d.id; }).length;
            sb.from("shop_videos").insert({ doc_id: d.id, title: o.t, position: n }).then(function (r) { if (r.error) { sbErr(r.error); return; } reload(); loadShop().then(renderShop); });
          }));
          d1.appendChild(c);
        });
        /* Tài liệu miễn phí */
        var d2 = el("details", "adm"); d2.appendChild(el("summary", null, "Tài liệu miễn phí / xem quảng cáo (" + (R[2].data || []).length + ")")); body.appendChild(d2);
        d2.appendChild(miniForm([
          { k: "category", label: "Mục", options: DOC_CATS.slice(1) }, { k: "title", label: "Tên tài liệu", ph: "Tên tài liệu" },
          { k: "tag", label: "Nhãn nhỏ", ph: "Nhãn", w: "200px" }, { k: "pages", label: "Số trang", ph: "Số trang", type: "number", w: "110px" },
          { k: "access", label: "Cách mở", options: [["open", "Đọc tự do"], ["ad", "Xem quảng cáo"]], w: "170px" }
        ], "Thêm tài liệu", function (o) {
          if (!o.title) { toast("Cần tên tài liệu"); return; }
          sb.from("free_docs").insert({ category: o.category, title: o.title, tag: o.tag || null, pages: +o.pages || null, access: o.access }).then(function (r) { if (r.error) { sbErr(r.error); return; } toast("Đã thêm tài liệu"); reload(); loadDocs().then(renderDocs); });
        }));
        (R[2].data || []).forEach(function (d) {
          var c = el("div", "admrow" + (d.published ? "" : " off"));
          var h = el("div", "cact"); h.appendChild(nameCell("", d.title, "free_docs", d.id, function () { reload(); loadDocs().then(renderDocs); }, false, "b")); h.appendChild(el("span", "note", d.category + " · " + (d.access === "ad" ? "xem quảng cáo" : "đọc tự do") + (d.published ? "" : " · đang ẩn")));
          h.appendChild(button("ghost sm", d.published ? "Ẩn" : "Hiện", function () { sb.from("free_docs").update({ published: !d.published }).eq("id", d.id).then(function () { reload(); loadDocs().then(renderDocs); }); }));
          c.appendChild(h); c.appendChild(pdfCell("free_doc", d.id, !!S("free_doc", d.id).storage_key, reload)); d2.appendChild(c);
        });
        /* Khóa học hiện hành */
        var course = (R[3].data || [])[0];
        var d3 = el("details", "adm"); d3.appendChild(el("summary", null, "Khóa học hiện hành" + (course ? ": " + course.name : ""))); body.appendChild(d3);
        if (!course) { d3.appendChild(el("p", "note", "Chưa có khóa học.")); return; }
        sb.from("lessons").select("id,n,title,held_on,lesson_files(id,kind,title,position)").eq("course_id", course.id).order("n").then(function (L) {
          var ls = L.data || [];
          d3.appendChild(miniForm([{ k: "title", label: "Tên buổi học", ph: "Tên buổi học mới" }, { k: "date", label: "Ngày học", type: "date", w: "170px" }], "Thêm buổi " + (ls.length + 1), function (o) {
            if (!o.title) { toast("Cần tên buổi học"); return; }
            sb.from("lessons").insert({ course_id: course.id, n: ls.length + 1, title: o.title, held_on: o.date || null }).then(function (r) { if (r.error) { sbErr(r.error); return; } toast("Đã thêm buổi học"); reload(); loadCourse().then(renderCourse); });
          }));
          ls.slice().reverse().forEach(function (l) {
            var c = el("div", "admrow"); c.appendChild(nameCell("Buổi " + l.n + ": ", l.title, "lessons", l.id, function () { reload(); loadCourse().then(renderCourse); }, false, "b")); if (l.held_on) c.appendChild(el("span", "note", vnDate(l.held_on)));
            (l.lesson_files || []).sort(function (a, b) { return a.position - b.position; }).forEach(function (f) {
              var fr = el("div", "cact"); fr.appendChild(nameCell(f.kind === "pdf" ? "📄 " : "▶ ", f.title, "lesson_files", f.id, function () { reload(); loadCourse().then(renderCourse); }, true));
              fr.appendChild(f.kind === "pdf" ? pdfCell("lesson_file", f.id, !!S("lesson_file", f.id).storage_key, reload) : vidCell("lesson_file", f.id, S("lesson_file", f.id).bunny_video_id, reload));
              c.appendChild(fr);
            });
            c.appendChild(miniForm([{ k: "kind", label: "Loại", options: [["pdf", "Tài liệu PDF"], ["video", "Video"]], w: "160px" }, { k: "t", label: "Tên", ph: "Tên tài liệu hoặc video", w: "300px" }], "Thêm vào buổi " + l.n, function (o) {
              if (!o.t) return;
              sb.from("lesson_files").insert({ lesson_id: l.id, kind: o.kind, title: o.t, position: (l.lesson_files || []).length }).then(function (r) { if (r.error) { sbErr(r.error); return; } reload(); loadCourse().then(renderCourse); });
            }));
            d3.appendChild(c);
          });
        });
      });
    }
    draw();
  }

  function renderShopAdmin(box) {
    var c = el("div", "card tablebox"); c.style.cssText = "display:grid;gap:10px"; box.appendChild(c);
    c.appendChild(el("h3", null, "Tài liệu bán: link xem thử")); c.lastChild.style.fontSize = "17px";
    c.appendChild(el("p", "note", "Dán link Google Drive của bản xem thử (vài trang đầu). Trong Google Drive: Chia sẻ → Bất kỳ ai có đường liên kết → Người xem; bấm bánh răng, bỏ tick “Người xem có thể thấy tùy chọn tải xuống, in và sao chép”. Để trống nếu không có bản xem thử."));
    sb.from("shop_docs").select("id,title,preview_url").order("id").then(function (r) {
      var t = el("table"); var hr = el("tr"); ["Tài liệu", "Link xem thử", ""].forEach(function (x) { hr.appendChild(el("th", null, x)); }); var th = el("thead"); th.appendChild(hr); t.appendChild(th);
      var tb = el("tbody");
      (r.data || []).forEach(function (d) {
        var tr = el("tr"); tr.appendChild(el("td", null, d.title));
        var td = el("td"); var inp = el("input", "inp"); inp.type = "url"; inp.placeholder = "https://drive.google.com/file/d/…"; inp.value = d.preview_url || ""; inp.setAttribute("aria-label", "Link xem thử: " + d.title); inp.style.minWidth = "240px"; td.appendChild(inp); tr.appendChild(td);
        var td2 = el("td"); td2.appendChild(button("sm", "Lưu", function () { sb.from("shop_docs").update({ preview_url: inp.value.trim() || null }).eq("id", d.id).then(function (x) { if (x.error) { sbErr(x.error); return; } toast("Đã lưu link xem thử"); loadShop().then(renderShop); }); })); tr.appendChild(td2);
        tb.appendChild(tr);
      });
      t.appendChild(tb); c.appendChild(t);
    });
  }
  function renderPayments(box) {
    var c = el("div", "card tablebox"); c.style.cssText = "display:grid;gap:10px"; box.appendChild(c);
    c.appendChild(el("h3", null, "Đơn hàng gần đây")); c.lastChild.style.fontSize = "17px";
    sb.from("orders").select("code,item_type,amount,status,created_at,paid_at,user_id").order("created_at", { ascending: false }).limit(30).then(function (r) {
      var rows = r.data || []; if (!rows.length) { c.appendChild(el("p", "note", "Chưa có đơn hàng.")); return; }
      var ids = {}; rows.forEach(function (x) { ids[x.user_id] = 1; });
      nickMap(ids).then(function (m) {
        var names = { doc: "Tài liệu", doc_renew: "Gia hạn tài liệu", vip_month: "VIP 1 tháng", vip_year: "VIP 1 năm", student: "Gói Học viên", student_renew: "Gia hạn Học viên", lesson: "Buổi học lẻ" };
        var t = el("table"); var hr = el("tr"); ["Mã", "Tài khoản", "Loại", "Số tiền", "Trạng thái", "Thời gian"].forEach(function (x) { hr.appendChild(el("th", null, x)); }); var th = el("thead"); th.appendChild(hr); t.appendChild(th);
        var tb = el("tbody"); rows.forEach(function (x) {
          var tr = el("tr"); tr.appendChild(el("td", "mono", x.code)); tr.appendChild(el("td", null, (m[x.user_id] || {}).nick || "?")); tr.appendChild(el("td", null, names[x.item_type] || x.item_type));
          tr.appendChild(el("td", "num", vnd(x.amount))); tr.appendChild(el("td", x.status === "paid" ? "yes" : "no", x.status === "paid" ? "Đã thanh toán" : "Chờ thanh toán"));
          tr.appendChild(el("td", null, new Date(x.paid_at || x.created_at).toLocaleString("vi-VN"))); tb.appendChild(tr);
        }); t.appendChild(tb); c.appendChild(t);
      });
    });
  }

  function liveInit() {
    document.querySelectorAll(".demo").forEach(function (x) { x.hidden = true; });
    var bar = el("div", "livebar", "Trang đang chạy thử: dữ liệu và thanh toán là thật. Tài liệu, video nào thầy chưa tải lên sẽ báo “chưa có file”.");
    document.querySelector("main").prepend(bar);
    try { var o = JSON.parse(localStorage.getItem(LV.pageKey) || "{}"); st.exPage = o.exPage || {}; } catch (e) {}
    Promise.all([loadExercises(), loadComments(), loadCourse(), loadDocs()]).then(function () {
      return sb.auth.getSession();
    }).then(function (s) { return liveSession(s.data.session); }).then(function () {
      sb.auth.onAuthStateChange(function (ev, session) { if (ev === "SIGNED_IN" || ev === "SIGNED_OUT") { closeModal(); liveSession(session).then(function () { if (ev === "SIGNED_IN") toast("Đã đăng nhập: " + st.nick); }); } });
      if (location.hash && /access_token|error_description/.test(location.hash)) { history.replaceState(null, "", location.pathname); route(); }
    });
  }

  /* ================= khung chung ================= */
  function renderAcct() {
    var a = $("acct"); a.innerHTML = "";
    if (!logged()) { a.appendChild(button("sm", "Đăng nhập", function () { showLogin(); })); return; }
    if (st.role === "teacher") { var ad = el("a", "chip", "Thầy · Quản trị"); ad.href = "#quan-tri"; a.appendChild(ad); if (!LIVE) return; }
    else if (st.role !== "member") a.appendChild(el("span", "chip " + (st.role === "vip" ? "vip" : "amber"), ROLES[st.role]));
    var c = el(LIVE ? "button" : "span", "chip"); c.appendChild(el("span", null, st.nick)); c.title = LIVE ? "Tài khoản" : "Biệt danh";
    if (LIVE) { c.type = "button"; c.style.border = "none"; c.style.cursor = "pointer"; c.addEventListener("click", accountMenu); }
    a.appendChild(c);
  }
  function renderAds() { document.querySelectorAll(".ad").forEach(function (x) { x.hidden = noAds(); }); }
  function renderHome() { $("homeQ").textContent = BASIC.length ? BASIC[Math.floor(Date.now() / 864e5) % BASIC.length].t : "Thầy sẽ đăng bài sớm."; }
  function renderRoleSeg() { document.querySelectorAll("#roleSeg button").forEach(function (b) { b.setAttribute("aria-pressed", String(b.dataset.r === st.role)); }); }
  function renderAll() { renderAcct(); renderAds(); renderHome(); renderEx(); renderDocs(); renderShop(); renderTiers(); renderReviews(); renderForum(); renderCourse(); renderAdmin(); renderRoleSeg(); $("navAdmin").hidden = st.role !== "teacher"; }

  document.querySelectorAll("#roleSeg button").forEach(function (b) {
    b.addEventListener("click", function () { st.role = b.dataset.r; if (st.role !== "guest" && !st.nick) st.nick = "HọcTròHóa"; if (st.role === "student") { st.studentExpired = false; st.access = null; } save(); renderAll(); toast("Đang xem với vai trò: " + ROLES[st.role]); });
  });
  $("btnReset").addEventListener("click", function () { st = fresh(); save(); renderAll(); toast("Đã đặt lại bản mẫu"); });
  $("btnZalo").addEventListener("click", function () {
    openModal(function (box) {
      head(box, "Liên hệ", "Nhắn Zalo cho thầy");
      var phone = (CFG.zalo || "").replace(/\D/g, "");
      if (!phone) { box.appendChild(el("p", "note", "Thầy chưa cập nhật số Zalo.")); row(box, [button("", "Đóng", closeModal)]); return; }
      var link = "https://zalo.me/" + phone;
      if (window.qrcode) {
        var q = window.qrcode(0, "M"); q.addData(link); q.make();
        var img = el("img"); img.src = q.createDataURL(6, 2); img.alt = "Mã QR Zalo của thầy, số " + phone;
        img.style.cssText = "width:200px;height:200px;margin:0 auto;display:block;border-radius:8px;background:#fff;image-rendering:pixelated";
        box.appendChild(img);
        box.appendChild(el("p", "note", "Quét mã bằng ứng dụng Zalo (mục Quét QR) hoặc camera điện thoại.")); box.lastChild.style.textAlign = "center";
      }
      var dl = el("dl", "kv"); dl.appendChild(el("dt", null, "Zalo")); dl.appendChild(el("dd", null, phone.replace(/(\d{4})(\d{3})(\d+)/, "$1 $2 $3"))); box.appendChild(dl);
      var open = el("a", "btn", "Mở Zalo nhắn tin"); open.href = link; open.target = "_blank"; open.rel = "noopener";
      row(box, [button("ghost", "Đóng", closeModal), open]);
    });
  });

  var VIEWS = ["trang-chu", "bai-tap", "khoa-hoc", "hoi-dap", "tai-lieu", "mua-tai-lieu", "dang-ky-hoc", "thanh-vien", "gioi-thieu", "quan-tri", "chinh-sach"];
  function route() {
    var h = (location.hash || "").replace("#", ""); if (VIEWS.indexOf(h) < 0) h = "trang-chu";
    VIEWS.forEach(function (v) { $("v-" + v).hidden = v !== h; });
    document.querySelectorAll("nav a").forEach(function (a) { if (a.getAttribute("href") === "#" + h) { a.setAttribute("aria-current", "page"); a.scrollIntoView({ block: "nearest", inline: "nearest" }); } else a.removeAttribute("aria-current"); });
    window.scrollTo(0, 0);
  }
  window.addEventListener("hashchange", route);
  renderReg(); renderAll(); route();
  if (LIVE) liveInit();
})();
