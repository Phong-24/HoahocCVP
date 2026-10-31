-- Xóa toàn bộ dữ liệu mẫu (tài liệu, bài tập, buổi học mẫu). Chạy lại nhiều lần vẫn an toàn.
-- Giữ nguyên: 75 tài liệu bán "Buổi N", trang web học tập hữu ích, tài khoản, đơn hàng, Hỏi đáp, đánh giá.
begin;

-- 1) Tài liệu bán mẫu (mọi tài liệu không có nhãn "Buổi N"); video, file kèm, lượt tải đi theo
delete from shop_docs where tag is null or tag !~ '^Buổi [0-9]+$';

-- 2) Tài liệu miễn phí mẫu (chưa có file PDF thật)
delete from free_docs f
where not exists (select 1 from file_secrets s where s.owner_type = 'free_doc' and s.owner_id = f.id and s.storage_key is not null);

-- 3) Bài tập mẫu (kèm đáp án, bài làm, bình luận của các bài đó)
delete from unlocks where kind = 'solution';
delete from exercises;

-- 4) Các buổi học mẫu của khóa học hiện hành (giữ tên khóa học)
delete from lessons;

-- 5) Dọn mã file / mã video không còn thuộc về mục nào
delete from file_secrets s where
  (s.owner_type = 'shop_doc'   and not exists (select 1 from shop_docs x where x.id = s.owner_id)) or
  (s.owner_type = 'shop_file'  and not exists (select 1 from shop_doc_files x where x.id = s.owner_id)) or
  (s.owner_type = 'shop_video' and not exists (select 1 from shop_videos x where x.id = s.owner_id)) or
  (s.owner_type = 'free_doc'   and not exists (select 1 from free_docs x where x.id = s.owner_id)) or
  (s.owner_type = 'lesson_file' and not exists (select 1 from lesson_files x where x.id = s.owner_id));

-- 6) Thông báo trỏ tới tài liệu đã xóa
delete from notifications n where
  (n.link ~ '^shop:[0-9]+$' and not exists (select 1 from shop_docs x where x.id = substr(n.link, 6)::bigint)) or
  (n.link ~ '^free:[0-9]+$' and not exists (select 1 from free_docs x where x.id = substr(n.link, 6)::bigint));

commit;

select 'Tài liệu bán' as muc, count(*) from shop_docs
union all select 'Tài liệu miễn phí', count(*) from free_docs
union all select 'Bài tập', count(*) from exercises
union all select 'Buổi học', count(*) from lessons
union all select 'Trang web hữu ích', count(*) from useful_links;
