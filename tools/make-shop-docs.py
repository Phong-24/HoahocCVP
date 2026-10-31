# Tạo SQL nạp tài liệu bán theo buổi từ danh sách tên file PDF
import re, sys
A = """1. Các hiệu ứng hay gặp và ứng dụng.pdf|10. Polyen và alkin.pdf|11. Hợp chất chứa vòng thơm.pdf|12. Alcol và Phenol.pdf|13. Amin và dẫn xuất.pdf|14. Cơ kim và dẫn xuất RX.pdf|15. Aldehyde và Ketone_1.pdf|16. Aldehyde và Ketone_2.pdf|17. Acid carboxylic và dẫn xuất.pdf|18. Acid amin và peptide.pdf|19. CARBONHYDRAT.pdf|2. Nucleophil và Electrophil.pdf|20. ĐỀ THI THỬ SỐ 1.pdf|21. Dị vòng 6 cạnh 1 dị tố.pdf|22. Dị vòng 5 cạnh 1 dị tố.pdf|23. CƠ CHẾ PHẢN ỨNG.pdf|24. CƠ CHẾ PHẢN ỨNG 2.pdf|25. DÃY CHUYỂN HOÁ 1.pdf|26. DÃY CHUYỂN HOÁ 2.pdf|27. DÃY CHUYỂN HOÁ 3.pdf|28. Tổng hợp hữu cơ.pdf|29. TỔNG HỢP HỮU CƠ 2.pdf|3. Phản ứng thế SN.pdf|30. HOÁ SINH 1.pdf|31. HOÁ SINH 2.pdf|32_ĐỀ THI THỬ HSG QUỐC GIA MÔN HÓA.pdf|33. Phổ UV_IR_MS.pdf|34. PHỔ NMR.pdf|35. Đề 2.pdf|36. Đề 3.pdf|37. Đề thi thử số 4.pdf|38. Đề thi thử số 5.pdf|39. Đáp án_ĐỀ THI THỬ HSG QUỐC GIA MÔN HÓA.pdf|39. ĐỀ THI THỬ SỐ 1.pdf|4. Phản ứng thế gốc và Electrophil.pdf|40. Đáp án_ĐỀ THI THỬ HSG QUỐC GIA MÔN HÓA.pdf|40. Đề thi thử số 2.pdf|5. Phản ứng cộng.pdf|6. Phản ứng tách.pdf|7. Alkan và Cycloalkan.pdf|8. Alken_1.pdf|9. Alken_2.pdf"""
B = """1. BÀI TẬP CÁC HIỆU ỨNG_1.pdf|10 POLYEN VÀ ALKIN.pdf|11 HỢP CHẤT CHỨA VÒNG THƠM.pdf|12 Alcohol.pdf|13 Phenol.pdf|14 AMIN VÀ DẪN XUẤT.pdf|15 HỢP CHẤT CƠ KIM VÀ DẪN XUẤT R.pdf|16 Phức chất .pdf|17 Hợp chất carbonyl .pdf|18 HỢP CHẤT CARBONYL 2.pdf|19. Acid carboxylic và dẫn xuất.pdf|2. BÀI TẬP CÁC HIỆU ỨNG 2.pdf|20. CARBOHYDRATE.pdf|21. BÀI TẬP AMINOACID.pdf|22. BÀI TẬP DỊ VÒNG 6 CẠNH 1 DỊ TỐ.pdf|23. DỊ VÒNG 5 CẠNH 1 DỊ TỐ.pdf|24. Bài kiểm tra.pdf|25. CƠ CHẾ PHẢN ỨNG.pdf|26. CHUỖI PHẢN ỨNG.pdf|27. BÀI TẬP XÁC ĐỊNH CẤU TẠO CHẤT.pdf|28. BÀI LUYỆN TẬP 1.pdf|29. BÀI LUYỆN TẬP 2.pdf|3. PHẢN ỨNG THẾ NUCLEOPHIL.pdf|30. BÀI LUYỆN TẬP 3.pdf|31. TỔNG HỢP HỮU CƠ 1.pdf|32. TỔNG HỢP HỮU CƠ 2.pdf|33. HOÁ SINH.pdf|34. BÀI TẬP PHỔ.pdf|35. BÀI LUYỆN TẬP 4.pdf|4. PHẢN ỨNG THẾ GỐC VÀ THẾ ELECTROPHIL.pdf|5. PHẢN ỨNG CỘNG ELECTROPHIL VÀ NUCLEOPHIL.pdf|6. PHẢN ỨNG TÁCH.pdf|7. ALKAN VÀ CYCLO ALKAN.pdf|8 ALKEN 1.pdf|9 ALKEN 2.pdf"""
def parse(s, maxn):
    d = {}
    for f in s.split("|"):
        m = re.match(r"^(\d+)[._]?\s*(.+?)\s*\.pdf$", f)
        n, t = int(m.group(1)), m.group(2).strip()
        if n > maxn: continue
        if n in d and re.search(r"đáp án", t, re.I): continue
        if n in d and not re.search(r"đáp án", d[n], re.I): continue
        d[n] = t
    return d
q = lambda x: "'" + x.replace("'", "''") + "'"
rows = []
for cat, s, mx in (("Bài giảng lý thuyết và bài tập ứng dụng", A, 40), ("Bài tập theo chương", B, 35)):
    for n, t in sorted(parse(s, mx).items()):
        rows.append(f"  ({q(cat)}, {n}, {q(t)})")
print(f"""-- Nạp {len(rows)} tài liệu bán theo buổi (giá 150.000đ). Chạy lại không bị trùng.
-- 1) Ẩn các tài liệu mẫu cũ của 2 mục này (không xóa để giữ lịch sử thanh toán thử)
update shop_docs set published = false
where category in ('Bài giảng lý thuyết và bài tập ứng dụng', 'Bài tập theo chương')
  and (tag is null or tag !~ '^Buổi [0-9]+$');
-- 2) Thêm tài liệu mới
insert into shop_docs (category, tag, title, price, position)
select x.cat, 'Buổi ' || x.n, x.title, 150000, x.n
from (values
{",\n".join(rows)}
) as x(cat, n, title)
where not exists (select 1 from shop_docs d where d.category = x.cat and d.tag = 'Buổi ' || x.n);
select category, count(*) from shop_docs where published group by category order by 1;""")
