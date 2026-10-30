-- BƯỚC 3: cập nhật cơ sở dữ liệu + nạp dữ liệu mẫu. Chỉ chạy MỘT lần.
-- =====================================================================
--  Hóa Học Thầy Phòng – cơ sở dữ liệu (Supabase / PostgreSQL)
--  Chạy toàn bộ file này một lần trong Supabase: SQL Editor → New query → Run.
--  Chạy lại nhiều lần vẫn an toàn (dùng "if not exists" / "or replace").
-- =====================================================================

-- ---------------------------------------------------------------------
-- 1. Tài khoản và hạng thành viên
-- ---------------------------------------------------------------------
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  nick text not null unique check (char_length(nick) between 2 and 24),
  phone text,
  is_teacher boolean not null default false,
  vip_until timestamptz,
  student_until timestamptz,
  student_from_lesson int not null default 1,        -- vào giữa khóa: mở từ buổi này
  student_extra_lessons int[] not null default '{}', -- buổi cũ được thầy tặng
  student_ever boolean not null default false,       -- đã từng là Học viên (gia hạn giảm 50%)
  correct_count int not null default 0,
  comment_banned boolean not null default false,
  created_at timestamptz not null default now()
);

-- Hạng hiện tại: teacher > student > vip > member
create or replace function public.role_of(uid uuid) returns text
language sql stable security definer set search_path = public as $$
  select case
    when p.is_teacher then 'teacher'
    when p.student_until > now() then 'student'
    when p.vip_until > now() then 'vip'
    else 'member' end
  from profiles p where p.id = uid
$$;

create or replace function public.is_teacher() returns boolean
language sql stable security definer set search_path = public as $$
  select coalesce((select is_teacher from profiles where id = auth.uid()), false)
$$;

-- Tự tạo hồ sơ khi có người đăng ký (biệt danh lấy từ metadata hoặc email)
create or replace function public.handle_new_user() returns trigger
language plpgsql security definer set search_path = public as $$
declare base text; n text; i int := 0;
begin
  base := coalesce(nullif(new.raw_user_meta_data->>'nick', ''), split_part(coalesce(new.email, 'hocsinh'), '@', 1));
  base := left(regexp_replace(base, '\s+', '', 'g'), 20);
  if char_length(base) < 2 then base := 'HocSinh'; end if;
  n := base;
  while exists (select 1 from profiles where nick = n) loop
    i := i + 1; n := base || i;
  end loop;
  insert into profiles (id, nick) values (new.id, n);
  return new;
end $$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users
  for each row execute function public.handle_new_user();

alter table profiles enable row level security;
drop policy if exists "profiles: tự xem" on profiles;
create policy "profiles: tự xem" on profiles for select using (id = auth.uid() or is_teacher());
-- Người dùng chỉ được đổi biệt danh, số điện thoại qua hàm update_my_profile (không sửa hạng trực tiếp)

create or replace function public.update_my_profile(p_nick text, p_phone text) returns void
language plpgsql security definer set search_path = public as $$
begin
  update profiles set nick = coalesce(nullif(trim(p_nick), ''), nick), phone = p_phone where id = auth.uid();
end $$;

-- Biệt danh công khai (dùng hiển thị bình luận, hỏi đáp)
create or replace view public.public_profiles with (security_invoker = false) as
  select id, nick, role_of(id) as role from profiles;
grant select on public.public_profiles to anon, authenticated;

-- ---------------------------------------------------------------------
-- 2. Bảng giá (thầy sửa trong bảng này, không cần sửa mã)
-- ---------------------------------------------------------------------
create table if not exists public.prices (
  key text primary key,
  amount int not null,
  label text
);
insert into prices (key, amount, label) values
  ('vip_month', 150000, 'Gói VIP 1 tháng'),
  ('vip_year', 1500000, 'Gói VIP 1 năm'),
  ('student', 8000000, 'Gói Học viên 12 tháng'),
  ('student_renew', 4000000, 'Gia hạn gói Học viên (giảm 50%)'),
  ('lesson', 150000, 'Mua lẻ một buổi học cũ')
on conflict (key) do nothing;
alter table prices enable row level security;
drop policy if exists "prices: ai cũng xem" on prices;
create policy "prices: ai cũng xem" on prices for select using (true);
drop policy if exists "prices: thầy sửa" on prices;
create policy "prices: thầy sửa" on prices for all using (is_teacher()) with check (is_teacher());

-- ---------------------------------------------------------------------
-- 3. Bài tập (phần đề công khai; đáp án nằm ở bảng riêng, không đọc trực tiếp được)
-- ---------------------------------------------------------------------
create table if not exists public.exercises (
  id bigint generated always as identity primary key,
  level text not null check (level in ('basic', 'adv')),
  category text not null check (category in ('Đại cương','Cơ chế','Chuỗi','Cấu tạo chất','Hợp chất cao phân tử','Hóa sinh','Khác')),
  kind text not null default 'mcq' check (kind in ('mcq', 'essay')),
  title text,
  stem text not null,
  options jsonb,          -- ["A","B","C","D"] cho trắc nghiệm
  images jsonb,           -- [["duong/dan.png", rong, cao], ...] sơ đồ của đề
  ask text,               -- yêu cầu (tự luận)
  is_new boolean not null default true,
  published boolean not null default true,
  created_at timestamptz not null default now()
);
create index if not exists exercises_order on exercises (level, id);

create table if not exists public.exercise_keys (
  exercise_id bigint primary key references exercises(id) on delete cascade,
  answer int,             -- chỉ số đáp án đúng (0..3)
  explain text,           -- giải thích ngắn (bài cơ bản)
  short_answer text,      -- đáp số (bài nâng cao)
  solution jsonb,         -- các bước lời giải chi tiết
  answer_images jsonb     -- hình đáp án (tự luận)
);

alter table exercises enable row level security;
alter table exercise_keys enable row level security;
drop policy if exists "exercises: xem bài đã đăng" on exercises;
create policy "exercises: xem bài đã đăng" on exercises for select using (published or is_teacher());
drop policy if exists "exercises: thầy quản lý" on exercises;
create policy "exercises: thầy quản lý" on exercises for all using (is_teacher()) with check (is_teacher());
drop policy if exists "keys: thầy quản lý" on exercise_keys;
create policy "keys: thầy quản lý" on exercise_keys for all using (is_teacher()) with check (is_teacher());

-- Bài làm của thành viên (khách không lưu)
create table if not exists public.attempts (
  user_id uuid references profiles(id) on delete cascade,
  exercise_id bigint references exercises(id) on delete cascade,
  choice int,
  correct boolean,
  done boolean not null default true,
  created_at timestamptz not null default now(),
  primary key (user_id, exercise_id)
);
alter table attempts enable row level security;
drop policy if exists "attempts: của mình" on attempts;
create policy "attempts: của mình" on attempts for select using (user_id = auth.uid());

-- Mở lời giải bằng quảng cáo
create table if not exists public.unlocks (
  user_id uuid references profiles(id) on delete cascade,
  kind text not null check (kind in ('solution', 'free_doc')),
  ref_id bigint not null,
  created_at timestamptz not null default now(),
  primary key (user_id, kind, ref_id)
);
alter table unlocks enable row level security;
drop policy if exists "unlocks: của mình" on unlocks;
create policy "unlocks: của mình" on unlocks for select using (user_id = auth.uid());

-- Nộp đáp án trắc nghiệm: trả về đúng/sai và phần được phép xem
create or replace function public.submit_answer(p_ex bigint, p_choice int) returns jsonb
language plpgsql security definer set search_path = public as $$
declare k exercise_keys; e exercises; ok boolean;
begin
  select * into e from exercises where id = p_ex and published;
  if not found then raise exception 'Không tìm thấy bài'; end if;
  select * into k from exercise_keys where exercise_id = p_ex;
  ok := (k.answer = p_choice);
  if auth.uid() is not null then
    insert into attempts (user_id, exercise_id, choice, correct) values (auth.uid(), p_ex, p_choice, ok)
      on conflict (user_id, exercise_id) do nothing;
    if found and ok then update profiles set correct_count = correct_count + 1 where id = auth.uid(); end if;
  end if;
  return jsonb_build_object('correct', ok, 'answer', k.answer,
    'explain', case when e.level = 'basic' then k.explain end,
    'short_answer', case when e.level = 'adv' then k.short_answer end);
end $$;

-- Đánh dấu đã làm xong bài tự luận
create or replace function public.mark_done(p_ex bigint) returns void
language sql security definer set search_path = public as $$
  insert into attempts (user_id, exercise_id, done) values (auth.uid(), p_ex, true)
  on conflict (user_id, exercise_id) do update set done = true;
$$;

-- Ghi nhận đã xem quảng cáo để mở lời giải / tài liệu
create or replace function public.record_ad_unlock(p_kind text, p_ref bigint) returns void
language sql security definer set search_path = public as $$
  insert into unlocks (user_id, kind, ref_id) values (auth.uid(), p_kind, p_ref) on conflict do nothing;
$$;

-- Lấy lời giải chi tiết / đáp án tự luận: VIP, Học viên, thầy, đã xem quảng cáo (p_via_ad), hoặc đã mở trước đó
drop function if exists public.get_solution(bigint);
create or replace function public.get_solution(p_ex bigint, p_via_ad boolean default false) returns jsonb
language plpgsql security definer set search_path = public as $$
declare k exercise_keys; r text;
begin
  r := coalesce(role_of(auth.uid()), 'guest');
  if r not in ('vip', 'student', 'teacher') and not p_via_ad
     and not exists (select 1 from unlocks where user_id = auth.uid() and kind = 'solution' and ref_id = p_ex) then
    raise exception 'Cần xem quảng cáo hoặc là VIP để mở lời giải';
  end if;
  if p_via_ad and auth.uid() is not null then
    insert into unlocks (user_id, kind, ref_id) values (auth.uid(), 'solution', p_ex) on conflict do nothing;
  end if;
  select * into k from exercise_keys where exercise_id = p_ex;
  return jsonb_build_object('solution', k.solution, 'answer_images', k.answer_images, 'short_answer', k.short_answer);
end $$;

-- ---------------------------------------------------------------------
-- 4. Bình luận bài tập, Hỏi đáp, Báo cáo, Đánh giá thầy
-- ---------------------------------------------------------------------
create table if not exists public.comments (
  id bigint generated always as identity primary key,
  exercise_id bigint not null references exercises(id) on delete cascade,
  user_id uuid not null references profiles(id) on delete cascade,
  body text not null check (char_length(body) between 2 and 1000),
  hidden boolean not null default false,
  created_at timestamptz not null default now()
);
create table if not exists public.topics (
  id bigint generated always as identity primary key,
  user_id uuid not null references profiles(id) on delete cascade,
  category text not null check (category in ('Đại cương','Cơ chế','Chuỗi','Cấu tạo chất','Hợp chất cao phân tử','Hóa sinh','Khác')),
  title text not null check (char_length(title) between 8 and 120),
  body text not null check (char_length(body) between 10 and 2000),
  image_key text,
  best_reply_id bigint,
  hidden boolean not null default false,
  created_at timestamptz not null default now()
);
create table if not exists public.replies (
  id bigint generated always as identity primary key,
  topic_id bigint not null references topics(id) on delete cascade,
  user_id uuid not null references profiles(id) on delete cascade,
  body text not null check (char_length(body) between 2 and 2000),
  hidden boolean not null default false,
  created_at timestamptz not null default now()
);
create table if not exists public.reply_likes (
  user_id uuid references profiles(id) on delete cascade,
  reply_id bigint references replies(id) on delete cascade,
  primary key (user_id, reply_id)
);
create table if not exists public.reports (
  id bigint generated always as identity primary key,
  user_id uuid references profiles(id) on delete set null,
  target_type text not null check (target_type in ('comment', 'topic', 'reply', 'review')),
  target_id bigint not null,
  reason text,
  resolved boolean not null default false,
  created_at timestamptz not null default now()
);
create table if not exists public.reviews (
  user_id uuid primary key references profiles(id) on delete cascade,
  who text not null check (who in ('Học sinh', 'Phụ huynh')),
  stars int not null check (stars between 1 and 5),
  body text not null check (char_length(body) between 10 and 800),
  approved boolean not null default false,
  updated_at timestamptz not null default now()
);

alter table comments enable row level security;
alter table topics enable row level security;
alter table replies enable row level security;
alter table reply_likes enable row level security;
alter table reports enable row level security;
alter table reviews enable row level security;

create or replace function public.can_post() returns boolean
language sql stable security definer set search_path = public as $$
  select coalesce((select not comment_banned from profiles where id = auth.uid()), false)
$$;

drop policy if exists "comments: xem" on comments;
create policy "comments: xem" on comments for select using (not hidden or is_teacher());
drop policy if exists "comments: viết" on comments;
create policy "comments: viết" on comments for insert with check (user_id = auth.uid() and can_post());
drop policy if exists "comments: thầy quản lý" on comments;
create policy "comments: thầy quản lý" on comments for update using (is_teacher());

drop policy if exists "topics: xem" on topics;
create policy "topics: xem" on topics for select using (not hidden or is_teacher());
drop policy if exists "topics: đăng" on topics;
create policy "topics: đăng" on topics for insert with check (user_id = auth.uid() and can_post());
drop policy if exists "topics: người hỏi chọn đáp án, thầy quản lý" on topics;
create policy "topics: người hỏi chọn đáp án, thầy quản lý" on topics for update using (user_id = auth.uid() or is_teacher());

drop policy if exists "replies: xem" on replies;
create policy "replies: xem" on replies for select using (not hidden or is_teacher());
drop policy if exists "replies: trả lời" on replies;
create policy "replies: trả lời" on replies for insert with check (user_id = auth.uid() and can_post());
drop policy if exists "replies: thầy quản lý" on replies;
create policy "replies: thầy quản lý" on replies for update using (is_teacher());

drop policy if exists "likes: xem" on reply_likes;
create policy "likes: xem" on reply_likes for select using (true);
drop policy if exists "likes: của mình" on reply_likes;
create policy "likes: của mình" on reply_likes for all using (user_id = auth.uid()) with check (user_id = auth.uid());

drop policy if exists "reports: gửi" on reports;
create policy "reports: gửi" on reports for insert with check (user_id = auth.uid());
drop policy if exists "reports: thầy xem" on reports;
create policy "reports: thầy xem" on reports for all using (is_teacher());

drop policy if exists "reviews: xem đã duyệt" on reviews;
create policy "reviews: xem đã duyệt" on reviews for select using (approved or user_id = auth.uid() or is_teacher());
drop policy if exists "reviews: viết của mình" on reviews;
create policy "reviews: viết của mình" on reviews for insert with check (user_id = auth.uid() and not approved);
drop policy if exists "reviews: sửa của mình" on reviews;
create policy "reviews: sửa của mình" on reviews for update using (user_id = auth.uid() or is_teacher());

-- Sửa đánh giá thì phải duyệt lại (trừ khi thầy sửa)
create or replace function public.review_reapprove() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  if not is_teacher() then new.approved := false; end if;
  new.updated_at := now();
  return new;
end $$;
drop trigger if exists reviews_reapprove on reviews;
create trigger reviews_reapprove before update on reviews for each row execute function review_reapprove();

-- Người hỏi chỉ được đổi best_reply_id (không sửa nội dung, không tự bỏ ẩn)
create or replace function public.topic_guard() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  if not is_teacher() then
    new.title := old.title; new.body := old.body; new.category := old.category;
    new.hidden := old.hidden; new.user_id := old.user_id;
  end if;
  return new;
end $$;
drop trigger if exists topics_guard on topics;
create trigger topics_guard before update on topics for each row execute function topic_guard();

-- ---------------------------------------------------------------------
-- 5. Tài liệu miễn phí / xem quảng cáo, và tài liệu bán
-- ---------------------------------------------------------------------
create table if not exists public.free_docs (
  id bigint generated always as identity primary key,
  category text not null check (category in ('Đề thi HSG QG','Đề thi IChO','Đề thi Duyên hải','Sách','Chuyên đề khác')),
  tag text, title text not null, pages int,
  access text not null default 'open' check (access in ('open', 'ad')),
  published boolean not null default true,
  created_at timestamptz not null default now()
);
create table if not exists public.shop_docs (
  id bigint generated always as identity primary key,
  category text not null check (category in ('Bài giảng lý thuyết và bài tập ứng dụng','Bài tập theo chương','Các chuyên đề','Đề thi thử','Tài liệu khác')),
  tag text, title text not null, pages int,
  price int not null check (price >= 0),
  base_downloads int not null default 0,
  published boolean not null default true,
  created_at timestamptz not null default now()
);
create table if not exists public.shop_videos (
  id bigint generated always as identity primary key,
  doc_id bigint not null references shop_docs(id) on delete cascade,
  title text not null,
  position int not null default 0
);
-- Phần bí mật: đường dẫn file trong kho lưu trữ, mã video Bunny (chỉ máy chủ đọc)
create table if not exists public.file_secrets (
  owner_type text not null check (owner_type in ('free_doc', 'shop_doc', 'shop_video', 'lesson_file')),
  owner_id bigint not null,
  storage_key text,       -- đường dẫn file PDF trên Cloudflare R2
  bunny_video_id text,    -- mã video trên Bunny Stream
  primary key (owner_type, owner_id)
);
create table if not exists public.doc_access (
  user_id uuid references profiles(id) on delete cascade,
  doc_id bigint references shop_docs(id) on delete cascade,
  expires_at timestamptz not null,
  primary key (user_id, doc_id)
);
create table if not exists public.downloads (
  id bigint generated always as identity primary key,
  doc_id bigint not null references shop_docs(id) on delete cascade,
  user_id uuid references profiles(id) on delete set null,
  created_at timestamptz not null default now()
);

alter table free_docs enable row level security;
alter table shop_docs enable row level security;
alter table shop_videos enable row level security;
alter table file_secrets enable row level security;
alter table doc_access enable row level security;
alter table downloads enable row level security;

drop policy if exists "free_docs: xem" on free_docs;
create policy "free_docs: xem" on free_docs for select using (published or is_teacher());
drop policy if exists "free_docs: thầy" on free_docs;
create policy "free_docs: thầy" on free_docs for all using (is_teacher()) with check (is_teacher());
drop policy if exists "shop_docs: xem" on shop_docs;
create policy "shop_docs: xem" on shop_docs for select using (published or is_teacher());
drop policy if exists "shop_docs: thầy" on shop_docs;
create policy "shop_docs: thầy" on shop_docs for all using (is_teacher()) with check (is_teacher());
drop policy if exists "shop_videos: xem tên" on shop_videos;
create policy "shop_videos: xem tên" on shop_videos for select using (true);
drop policy if exists "shop_videos: thầy" on shop_videos;
create policy "shop_videos: thầy" on shop_videos for all using (is_teacher()) with check (is_teacher());
drop policy if exists "file_secrets: thầy" on file_secrets;
create policy "file_secrets: thầy" on file_secrets for all using (is_teacher()) with check (is_teacher());
drop policy if exists "doc_access: của mình" on doc_access;
create policy "doc_access: của mình" on doc_access for select using (user_id = auth.uid() or is_teacher());

-- Số lượt tải công khai
create or replace view public.shop_doc_stats with (security_invoker = false) as
  select d.id, d.base_downloads + count(x.id) as downloads
  from shop_docs d left join downloads x on x.doc_id = d.id group by d.id;
grant select on public.shop_doc_stats to anon, authenticated;

-- Quyền với một tài liệu bán: 'student_free' | 'active' | 'expired' | 'none'
create or replace function public.doc_status(p_doc bigint, uid uuid default auth.uid()) returns text
language plpgsql stable security definer set search_path = public as $$
declare d shop_docs; a doc_access; r text;
begin
  select * into d from shop_docs where id = p_doc;
  r := role_of(uid);
  if r = 'teacher' then return 'active'; end if;
  if r = 'student' and d.category in ('Bài giảng lý thuyết và bài tập ứng dụng', 'Bài tập theo chương') then return 'student_free'; end if;
  select * into a from doc_access where user_id = uid and doc_id = p_doc;
  if not found then return 'none'; end if;
  return case when a.expires_at > now() then 'active' else 'expired' end;
end $$;

-- Giá người dùng phải trả: mua lần đầu có giảm theo hạng; gia hạn = 50% giá gốc
create or replace function public.doc_price(p_doc bigint, uid uuid default auth.uid()) returns int
language plpgsql stable security definer set search_path = public as $$
declare d shop_docs; st text; r text; p numeric;
begin
  select * into d from shop_docs where id = p_doc;
  st := doc_status(p_doc, uid);
  if st = 'expired' then return round(d.price * 0.5 / 1000) * 1000; end if;
  r := role_of(uid); p := d.price;
  if r = 'student' then p := p * 0.5; elsif r = 'vip' then p := p * 0.85; end if;
  return round(p / 1000) * 1000;
end $$;

-- ---------------------------------------------------------------------
-- 6. Khóa học hiện hành, buổi học, mã kích hoạt
-- ---------------------------------------------------------------------
create table if not exists public.courses (
  id bigint generated always as identity primary key,
  name text not null,
  description text,
  meta jsonb,                 -- [["Lịch học","..."],["Hình thức","..."]]
  active boolean not null default true
);
create table if not exists public.lessons (
  id bigint generated always as identity primary key,
  course_id bigint not null references courses(id) on delete cascade,
  n int not null,
  title text not null,
  held_on date,
  created_at timestamptz not null default now(),
  unique (course_id, n)
);
create table if not exists public.lesson_files (
  id bigint generated always as identity primary key,
  lesson_id bigint not null references lessons(id) on delete cascade,
  kind text not null check (kind in ('pdf', 'video')),
  title text not null,
  position int not null default 0
);
create table if not exists public.lesson_purchases (
  user_id uuid references profiles(id) on delete cascade,
  lesson_id bigint references lessons(id) on delete cascade,
  primary key (user_id, lesson_id)
);
create table if not exists public.activation_codes (
  code text primary key,
  from_lesson int not null default 1,
  expires_on date not null,
  paid_note text,
  created_at timestamptz not null default now(),
  used_by uuid references profiles(id),
  used_at timestamptz
);
create table if not exists public.admin_log (
  id bigint generated always as identity primary key,
  admin_id uuid references profiles(id),
  target_id uuid references profiles(id),
  action text not null,
  data jsonb,
  created_at timestamptz not null default now()
);

alter table courses enable row level security;
alter table lessons enable row level security;
alter table lesson_files enable row level security;
alter table lesson_purchases enable row level security;
alter table activation_codes enable row level security;
alter table admin_log enable row level security;

drop policy if exists "courses: xem" on courses;
create policy "courses: xem" on courses for select using (true);
drop policy if exists "courses: thầy" on courses;
create policy "courses: thầy" on courses for all using (is_teacher()) with check (is_teacher());
drop policy if exists "lessons: xem" on lessons;
create policy "lessons: xem" on lessons for select using (true);
drop policy if exists "lessons: thầy" on lessons;
create policy "lessons: thầy" on lessons for all using (is_teacher()) with check (is_teacher());
drop policy if exists "lesson_files: xem tên" on lesson_files;
create policy "lesson_files: xem tên" on lesson_files for select using (true);
drop policy if exists "lesson_files: thầy" on lesson_files;
create policy "lesson_files: thầy" on lesson_files for all using (is_teacher()) with check (is_teacher());
drop policy if exists "lesson_purchases: của mình" on lesson_purchases;
create policy "lesson_purchases: của mình" on lesson_purchases for select using (user_id = auth.uid() or is_teacher());
drop policy if exists "codes: thầy" on activation_codes;
create policy "codes: thầy" on activation_codes for all using (is_teacher()) with check (is_teacher());
drop policy if exists "admin_log: thầy" on admin_log;
create policy "admin_log: thầy" on admin_log for select using (is_teacher());

-- Có được mở buổi học không
create or replace function public.lesson_open(p_lesson bigint, uid uuid default auth.uid()) returns boolean
language plpgsql stable security definer set search_path = public as $$
declare l lessons; p profiles; r text;
begin
  select * into l from lessons where id = p_lesson;
  r := role_of(uid);
  if r = 'teacher' then return true; end if;
  if r <> 'student' then return false; end if;
  select * into p from profiles where id = uid;
  return l.n >= p.student_from_lesson or l.n = any (p.student_extra_lessons)
      or exists (select 1 from lesson_purchases where user_id = uid and lesson_id = p_lesson);
end $$;

-- Học sinh nhập mã kích hoạt
create or replace function public.redeem_code(p_code text) returns jsonb
language plpgsql security definer set search_path = public as $$
declare c activation_codes;
begin
  if auth.uid() is null then raise exception 'Cần đăng nhập'; end if;
  select * into c from activation_codes where code = upper(trim(p_code)) for update;
  if not found then raise exception 'Mã không đúng'; end if;
  if c.used_by is not null then raise exception 'Mã đã được dùng'; end if;
  update activation_codes set used_by = auth.uid(), used_at = now() where code = c.code;
  update profiles set student_until = (c.expires_on + 1)::timestamptz, student_from_lesson = c.from_lesson,
         student_extra_lessons = '{}', student_ever = true where id = auth.uid();
  insert into admin_log (target_id, action, data) values (auth.uid(), 'redeem_code', jsonb_build_object('code', c.code));
  return jsonb_build_object('from_lesson', c.from_lesson, 'expires_on', c.expires_on);
end $$;

-- Thầy cấp quyền Học viên thủ công
create or replace function public.admin_grant_student(p_user uuid, p_from int, p_extra int[], p_expires date, p_paid text, p_note text) returns void
language plpgsql security definer set search_path = public as $$
begin
  if not is_teacher() then raise exception 'Chỉ thầy được cấp quyền'; end if;
  update profiles set student_until = (p_expires + 1)::timestamptz, student_from_lesson = p_from,
         student_extra_lessons = coalesce(p_extra, '{}'), student_ever = true where id = p_user;
  insert into admin_log (admin_id, target_id, action, data)
    values (auth.uid(), p_user, 'grant_student', jsonb_build_object('from', p_from, 'extra', p_extra, 'expires', p_expires, 'paid', p_paid, 'note', p_note));
end $$;

create or replace function public.admin_revoke_student(p_user uuid) returns void
language plpgsql security definer set search_path = public as $$
begin
  if not is_teacher() then raise exception 'Chỉ thầy được thu hồi'; end if;
  update profiles set student_until = now() where id = p_user;
  insert into admin_log (admin_id, target_id, action) values (auth.uid(), p_user, 'revoke_student');
end $$;

create or replace function public.admin_create_code(p_from int, p_expires date, p_paid text) returns text
language plpgsql security definer set search_path = public as $$
declare alphabet text := 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; s text := ''; i int; v_code text;
begin
  if not is_teacher() then raise exception 'Chỉ thầy được tạo mã'; end if;
  loop
    s := '';
    for i in 1..4 loop s := s || substr(alphabet, 1 + floor(random() * length(alphabet))::int, 1); end loop;
    v_code := 'HC-B' || p_from || '-' || s;
    exit when not exists (select 1 from activation_codes a where a.code = v_code);
  end loop;
  insert into activation_codes (code, from_lesson, expires_on, paid_note) values (v_code, p_from, p_expires, p_paid);
  return v_code;
end $$;

-- Danh sách học viên cho trang Quản trị
create or replace function public.admin_students() returns table (
  id uuid, nick text, phone text, student_until timestamptz, student_from_lesson int, student_extra_lessons int[], last_note jsonb)
language sql stable security definer set search_path = public as $$
  select p.id, p.nick, p.phone, p.student_until, p.student_from_lesson, p.student_extra_lessons,
    (select data from admin_log l where l.target_id = p.id order by created_at desc limit 1)
  from profiles p
  where is_teacher() and p.student_until is not null
  order by p.student_until desc;
$$;

-- ---------------------------------------------------------------------
-- 7. Đơn hàng và thanh toán QR
-- ---------------------------------------------------------------------
create table if not exists public.orders (
  id bigint generated always as identity primary key,
  code text not null unique,           -- nội dung chuyển khoản, ví dụ HHTP48213
  user_id uuid not null references profiles(id) on delete cascade,
  item_type text not null check (item_type in ('doc', 'doc_renew', 'vip_month', 'vip_year', 'student', 'student_renew', 'lesson')),
  item_id bigint,
  amount int not null,
  status text not null default 'pending' check (status in ('pending', 'paid', 'cancelled')),
  bank_ref text,
  created_at timestamptz not null default now(),
  paid_at timestamptz
);
alter table orders enable row level security;
drop policy if exists "orders: của mình" on orders;
create policy "orders: của mình" on orders for select using (user_id = auth.uid() or is_teacher());

-- Tạo đơn: giá luôn tính ở máy chủ, không tin giá từ trình duyệt
create or replace function public.create_order(p_type text, p_item bigint default null) returns jsonb
language plpgsql security definer set search_path = public as $$
declare amt int; c text; p profiles;
begin
  if auth.uid() is null then raise exception 'Cần đăng nhập'; end if;
  select * into p from profiles where id = auth.uid();
  if p_type in ('doc', 'doc_renew') then amt := doc_price(p_item);
  elsif p_type = 'lesson' then select amount into amt from prices where key = 'lesson';
  elsif p_type = 'student' and p.student_ever then  -- đã từng là Học viên: gia hạn giảm 50%
    p_type := 'student_renew'; select amount into amt from prices where key = 'student_renew';
  else select amount into amt from prices where key = p_type;
  end if;
  if amt is null then raise exception 'Không xác định được giá'; end if;
  loop
    c := 'HHTP' || lpad((floor(random() * 1000000))::text, 6, '0');
    exit when not exists (select 1 from orders where code = c);
  end loop;
  insert into orders (code, user_id, item_type, item_id, amount) values (c, auth.uid(), p_type, p_item, amt);
  return jsonb_build_object('code', c, 'amount', amt, 'type', p_type);
end $$;

-- Gọi từ máy chủ (webhook ngân hàng) khi tiền về đúng nội dung và đủ số tiền
create or replace function public.fulfill_order(p_code text, p_amount int, p_bank_ref text) returns text
language plpgsql security definer set search_path = public as $$
declare o orders; base timestamptz;
begin
  select * into o from orders where code = p_code for update;
  if not found then return 'not_found'; end if;
  if o.status = 'paid' then return 'already_paid'; end if;
  if p_amount < o.amount then return 'amount_too_low'; end if;
  update orders set status = 'paid', paid_at = now(), bank_ref = p_bank_ref where id = o.id;
  if o.item_type in ('doc', 'doc_renew') then
    insert into doc_access (user_id, doc_id, expires_at) values (o.user_id, o.item_id, now() + interval '12 months')
    on conflict (user_id, doc_id) do update set expires_at = greatest(doc_access.expires_at, now()) + interval '12 months';
  elsif o.item_type in ('vip_month', 'vip_year') then
    select greatest(coalesce(vip_until, now()), now()) into base from profiles where id = o.user_id;
    update profiles set vip_until = base + case when o.item_type = 'vip_year' then interval '12 months' else interval '1 month' end where id = o.user_id;
  elsif o.item_type in ('student', 'student_renew') then
    select greatest(coalesce(student_until, now()), now()) into base from profiles where id = o.user_id;
    update profiles set student_until = base + interval '12 months', student_ever = true,
      student_from_lesson = case when o.item_type = 'student' and student_until is null then 1 else student_from_lesson end
    where id = o.user_id;
  elsif o.item_type = 'lesson' then
    insert into lesson_purchases (user_id, lesson_id) values (o.user_id, o.item_id) on conflict do nothing;
  end if;
  return 'ok';
end $$;
revoke execute on function public.fulfill_order(text, int, text) from public, anon, authenticated;

-- Hàm chỉ máy chủ được gọi
revoke execute on function public.doc_status(bigint, uuid) from anon;
grant execute on function public.doc_status(bigint, uuid) to authenticated;

-- ---------------------------------------------------------------------
-- 8. Đặt thầy làm quản trị (chạy SAU khi thầy đã đăng nhập trang một lần):
--    update profiles set is_teacher = true where nick = 'BIET_DANH_CUA_THAY';
-- ---------------------------------------------------------------------

-- Dữ liệu mẫu ban đầu (sinh tự động bởi tools/make-seed.js). Chạy một lần sau schema.sql.
begin;
with e as (insert into exercises (level, category, kind, title, stem, options, images, ask, is_new) values ('basic', 'Hóa sinh', 'mcq', null, 'Glycine có pK₁ = 2,34 (α-COOH) và pK₂ = 9,60 (α-NH₃⁺). Điểm đẳng điện pI của glycine bằng', '["5,97","6,97","4,67","7,00"]'::jsonb, null, null, false) returning id)
insert into exercise_keys (exercise_id, answer, explain, short_answer, solution, answer_images) select id, 0, 'Chuỗi bên trung tính nên pI = (pK₁ + pK₂)/2 = (2,34 + 9,60)/2 = 5,97.', null, null, null from e;
with e as (insert into exercises (level, category, kind, title, stem, options, images, ask, is_new) values ('basic', 'Hóa sinh', 'mcq', null, 'Khi đun với ninhydrin, amino acid nào cho màu vàng thay vì tím xanh?', '["Glycine","Proline","Tyrosine","Lysine"]'::jsonb, null, null, false) returning id)
insert into exercise_keys (exercise_id, answer, explain, short_answer, solution, answer_images) select id, 1, 'Proline là amin bậc hai, tạo sản phẩm iminium màu vàng (≈ 440 nm).', null, null, null from e;
with e as (insert into exercises (level, category, kind, title, stem, options, images, ask, is_new) values ('basic', 'Cấu tạo chất', 'mcq', null, 'Số ancol đồng phân cấu tạo ứng với công thức C₄H₁₀O là', '["3","4","5","7"]'::jsonb, null, null, false) returning id)
insert into exercise_keys (exercise_id, answer, explain, short_answer, solution, answer_images) select id, 1, 'Butan-1-ol, butan-2-ol, 2-metylpropan-1-ol, 2-metylpropan-2-ol: 4 ancol (tính cả ete thì có 7 đồng phân).', null, null, null from e;
with e as (insert into exercises (level, category, kind, title, stem, options, images, ask, is_new) values ('basic', 'Đại cương', 'mcq', null, 'Fe + HNO₃ (loãng) → Fe(NO₃)₃ + NO + H₂O. Tổng hệ số nguyên tối giản của phương trình là', '["8","9","10","12"]'::jsonb, null, null, false) returning id)
insert into exercise_keys (exercise_id, answer, explain, short_answer, solution, answer_images) select id, 1, 'Fe + 4HNO₃ → Fe(NO₃)₃ + NO + 2H₂O, tổng hệ số 1 + 4 + 1 + 1 + 2 = 9.', null, null, null from e;
with e as (insert into exercises (level, category, kind, title, stem, options, images, ask, is_new) values ('basic', 'Đại cương', 'mcq', null, 'Các dung dịch cùng nồng độ 0,1 M, dung dịch nào có pH nhỏ nhất?', '["CH₃COOH","NH₄Cl","HCl","NaHCO₃"]'::jsonb, null, null, false) returning id)
insert into exercise_keys (exercise_id, answer, explain, short_answer, solution, answer_images) select id, 2, 'HCl là axit mạnh, phân li hoàn toàn nên pH = 1, nhỏ nhất trong bốn dung dịch.', null, null, null from e;
with e as (insert into exercises (level, category, kind, title, stem, options, images, ask, is_new) values ('basic', 'Hóa sinh', 'mcq', null, 'Phản ứng biuret cho màu tím cần phân tử có tối thiểu bao nhiêu liên kết peptide?', '["1","2","3","Không cần"]'::jsonb, null, null, false) returning id)
insert into exercise_keys (exercise_id, answer, explain, short_answer, solution, answer_images) select id, 1, 'Cu²⁺ phối trí với N của ít nhất hai liên kết peptide liền kề, nên từ tripeptide trở lên mới dương tính.', null, null, null from e;
with e as (insert into exercises (level, category, kind, title, stem, options, images, ask, is_new) values ('basic', 'Đại cương', 'mcq', null, 'Chất nào sau đây là chất điện li mạnh?', '["CH₃COOH","H₂O","NaCl","C₂H₅OH"]'::jsonb, null, null, false) returning id)
insert into exercise_keys (exercise_id, answer, explain, short_answer, solution, answer_images) select id, 2, 'NaCl là muối tan, phân li hoàn toàn trong nước; CH₃COOH và H₂O điện li yếu, C₂H₅OH không điện li.', null, null, null from e;
with e as (insert into exercises (level, category, kind, title, stem, options, images, ask, is_new) values ('basic', 'Cấu tạo chất', 'mcq', null, 'Số amin bậc một là đồng phân cấu tạo ứng với công thức C₃H₉N là', '["1","2","3","4"]'::jsonb, null, null, false) returning id)
insert into exercise_keys (exercise_id, answer, explain, short_answer, solution, answer_images) select id, 1, 'Propan-1-amin và propan-2-amin: 2 amin bậc một (C₃H₉N có tổng cộng 4 amin).', null, null, null from e;
with e as (insert into exercises (level, category, kind, title, stem, options, images, ask, is_new) values ('basic', 'Hợp chất cao phân tử', 'mcq', null, 'Polime nào sau đây được điều chế bằng phản ứng trùng ngưng?', '["Polietilen","Poli(vinyl clorua)","Nilon-6,6","Polistiren"]'::jsonb, null, null, false) returning id)
insert into exercise_keys (exercise_id, answer, explain, short_answer, solution, answer_images) select id, 2, 'Nilon-6,6 tạo từ hexametylenđiamin và axit ađipic, tách nước (trùng ngưng); ba polime còn lại điều chế bằng trùng hợp.', null, null, null from e;
with e as (insert into exercises (level, category, kind, title, stem, options, images, ask, is_new) values ('basic', 'Cơ chế', 'mcq', null, 'Phản ứng của CH₃Br với OH⁻ trong dung môi phân cực không proton xảy ra chủ yếu theo cơ chế', '["SN1","SN2","E1","E2"]'::jsonb, null, null, false) returning id)
insert into exercise_keys (exercise_id, answer, explain, short_answer, solution, answer_images) select id, 1, 'Cacbon bậc một ít cản trở không gian, tác nhân nucleophin mạnh, dung môi không proton: thuận lợi cho SN2.', null, null, null from e;
with e as (insert into exercises (level, category, kind, title, stem, options, images, ask, is_new) values ('basic', 'Hóa sinh', 'mcq', null, 'Glucozơ và fructozơ đều phản ứng với chất nào sau đây?', '["Nước brom","H₂ (Ni, t°)","Dung dịch NaCl","Dung dịch HCl loãng"]'::jsonb, null, null, false) returning id)
insert into exercise_keys (exercise_id, answer, explain, short_answer, solution, answer_images) select id, 1, 'Cả hai đều bị khử bởi H₂ (Ni, t°) tạo sobitol; fructozơ không làm mất màu nước brom.', null, null, null from e;
with e as (insert into exercises (level, category, kind, title, stem, options, images, ask, is_new) values ('basic', 'Khác', 'mcq', null, 'Ở điều kiện thường, chất nào sau đây là chất khí?', '["Metylamin","Anilin","Glyxin","Etanol"]'::jsonb, null, null, true) returning id)
insert into exercise_keys (exercise_id, answer, explain, short_answer, solution, answer_images) select id, 0, 'Metylamin sôi ở khoảng −6 °C nên là chất khí; anilin, etanol là chất lỏng, glyxin là chất rắn.', null, null, null from e;
with e as (insert into exercises (level, category, kind, title, stem, options, images, ask, is_new) values ('basic', 'Đại cương', 'mcq', null, 'Cấu hình electron của nguyên tử Fe (Z = 26) là', '["[Ar]3d⁶4s²","[Ar]3d⁵4s¹","[Ar]3d⁷4s¹","[Ar]3d⁸"]'::jsonb, null, null, true) returning id)
insert into exercise_keys (exercise_id, answer, explain, short_answer, solution, answer_images) select id, 0, 'Fe có 26 electron: [Ar] (18e) + 3d⁶4s².', null, null, null from e;
with e as (insert into exercises (level, category, kind, title, stem, options, images, ask, is_new) values ('adv', 'Đại cương', 'mcq', null, 'Hòa tan hoàn toàn 5,6 g Fe trong dung dịch HNO₃ loãng, dư, thu được V lít khí NO (đktc, sản phẩm khử duy nhất). Giá trị của V là', '["1,12","2,24","3,36","4,48"]'::jsonb, null, null, false) returning id)
insert into exercise_keys (exercise_id, answer, explain, short_answer, solution, answer_images) select id, 1, null, 'V = 2,24 lít', '["n(Fe) = 5,6 : 56 = 0,1 mol. HNO₃ dư nên Fe lên Fe³⁺.","Bảo toàn electron: 3·n(Fe) = 3·n(NO) ⇒ n(NO) = 0,1 mol.","V = 0,1 × 22,4 = 2,24 lít."]'::jsonb, null from e;
with e as (insert into exercises (level, category, kind, title, stem, options, images, ask, is_new) values ('adv', 'Hóa sinh', 'mcq', null, 'Ở pH 6,0, khi điện di, tripeptide Lys–Gly–Glu sẽ', '["Di chuyển về cực âm","Di chuyển về cực dương","Gần như đứng yên","Bị thủy phân"]'::jsonb, null, null, false) returning id)
insert into exercise_keys (exercise_id, answer, explain, short_answer, solution, answer_images) select id, 2, null, 'Gần như đứng yên (pI ≈ 6,1)', '["Các nhóm ion hóa: đầu N (pKa ≈ 8), chuỗi bên Lys (≈ 10,5) mang điện dương; đầu C (≈ 3,5), chuỗi bên Glu (≈ 4,25) mang điện âm.","Ở pH 6: hai nhóm dương đều bị proton hóa (+2), hai nhóm axit đều đã phân li (−2), điện tích tổng ≈ 0.","pI ≈ (4,25 + 8)/2 ≈ 6,1, gần pH 6 nên peptide gần như không di chuyển."]'::jsonb, null from e;
with e as (insert into exercises (level, category, kind, title, stem, options, images, ask, is_new) values ('adv', 'Hóa sinh', 'mcq', null, 'Đốt cháy hoàn toàn 0,1 mol một α-amino acid X (phân tử có 1 nhóm NH₂ và 1 nhóm COOH, mạch hở, no) thu được 0,3 mol CO₂. X là', '["Glycine","Alanine","Valine","Lysine"]'::jsonb, null, null, false) returning id)
insert into exercise_keys (exercise_id, answer, explain, short_answer, solution, answer_images) select id, 1, null, 'X là alanine', '["Số nguyên tử C = n(CO₂) : n(X) = 0,3 : 0,1 = 3.","α-amino acid no, 1 NH₂, 1 COOH có 3 C: CH₃–CH(NH₂)–COOH.","Vậy X là alanine (Ala)."]'::jsonb, null from e;
with e as (insert into exercises (level, category, kind, title, stem, options, images, ask, is_new) values ('adv', 'Cơ chế', 'mcq', null, 'Đun 2-brom-2-metylbutan với KOH trong etanol, sản phẩm hữu cơ chính là', '["2-metylbut-1-en","2-metylbut-2-en","3-metylbut-1-en","2-metylbutan-2-ol"]'::jsonb, null, null, false) returning id)
insert into exercise_keys (exercise_id, answer, explain, short_answer, solution, answer_images) select id, 1, null, '2-metylbut-2-en', '["KOH/etanol, đun nóng: ưu tiên phản ứng tách E2.","H có thể tách ở C1 (CH₃) hoặc C3 (CH₂); theo quy tắc Zaitsev, anken nhiều nhóm thế hơn là sản phẩm chính.","Sản phẩm chính: (CH₃)₂C=CH–CH₃, tức 2-metylbut-2-en."]'::jsonb, null from e;
with e as (insert into exercises (level, category, kind, title, stem, options, images, ask, is_new) values ('adv', 'Chuỗi', 'essay', 'Tổng hợp Dactylol', 'Dactylol là một sesquiterpenoid bicyclic, thuộc nhóm sesquiterpen có cấu trúc bicyclo[6.3.0]undecane, được phát hiện lần đầu tiên trong loài hải sâm Caribbean Aplysia dactylomela vào năm 1977. Nó được tổng hợp như sau:', null, '[["img/bt/tl1_de1.png",536,140]]'::jsonb, 'xác định công thức cấu tạo các chất được đánh số trong sơ đồ.', true) returning id)
insert into exercise_keys (exercise_id, answer, explain, short_answer, solution, answer_images) select id, null, null, null, null, '[["img/bt/tl1_da1.png",528,88]]'::jsonb from e;
with e as (insert into exercises (level, category, kind, title, stem, options, images, ask, is_new) values ('adv', 'Chuỗi', 'essay', 'Tổng hợp Vibegron', 'Vibegron được biết đến với tên thương mại Gemtesa, là một loại thuốc dùng để điều trị chứng bàng quang hoạt động quá mức (Overactive Bladder - OAB) ở người trưởng thành. OAB là tình trạng co thắt không kiểm soát của cơ bàng quang, gây ra các triệu chứng như tiểu gấp, tiểu nhiều lần và tiểu không tự chủ. Nó được tổng hợp như sau?', null, '[["img/bt/tl2_de1.png",512,56],["img/bt/tl2_de2.png",528,73],["img/bt/tl2_de3.png",520,46],["img/bt/tl2_de4.png",412,62],["img/bt/tl2_de5.png",528,84]]'::jsonb, 'xác định công thức cấu tạo các chất được đánh số trong sơ đồ.', true) returning id)
insert into exercise_keys (exercise_id, answer, explain, short_answer, solution, answer_images) select id, null, null, null, null, '[["img/bt/tl2_da1.png",504,75],["img/bt/tl2_da2.png",540,93],["img/bt/tl2_da3.png",544,78],["img/bt/tl2_da4.png",76,76]]'::jsonb from e;
with e as (insert into exercises (level, category, kind, title, stem, options, images, ask, is_new) values ('adv', 'Chuỗi', 'essay', 'Tổng hợp Relugolix', 'Relugolix là một loại thuốc đường uống thuộc nhóm chất đối kháng hormone giải phóng gonadotropin (GnRH antagonist), được sử dụng trong điều trị ung thư tuyến tiền liệt, u xơ tử cung và lạc nội mạc tử cung. Nó được tổng hợp như sau:', null, '[["img/bt/tl3_de1.png",532,91],["img/bt/tl3_de2.png",528,56],["img/bt/tl3_de3.png",532,85],["img/bt/tl3_de4.png",256,125]]'::jsonb, 'xác định công thức cấu tạo các chất được đánh số trong sơ đồ.', true) returning id)
insert into exercise_keys (exercise_id, answer, explain, short_answer, solution, answer_images) select id, null, null, null, null, '[["img/bt/tl3_da1.png",500,98],["img/bt/tl3_da2.png",536,115],["img/bt/tl3_da3.png",540,141]]'::jsonb from e;
with e as (insert into exercises (level, category, kind, title, stem, options, images, ask, is_new) values ('adv', 'Chuỗi', 'essay', 'Tổng hợp Opicapone', 'Opicapone là một loại thuốc được sử dụng trong điều trị bệnh Parkinson, đặc biệt để giảm các triệu chứng "tắt" (off episodes) – tình trạng mà hiệu quả của levodopa giảm dần trước liều tiếp theo, gây ra các triệu chứng như cứng cơ, run và khó kiểm soát vận động. Nó được tổng hợp như sau:', null, '[["img/bt/tl4_de1.png",520,86],["img/bt/tl4_de2.png",508,123]]'::jsonb, 'xác định công thức cấu tạo các chất được đánh số trong sơ đồ.', true) returning id)
insert into exercise_keys (exercise_id, answer, explain, short_answer, solution, answer_images) select id, null, null, null, null, '[["img/bt/tl4_da1.png",512,128],["img/bt/tl4_da2.png",152,123]]'::jsonb from e;
insert into free_docs (category, tag, title, pages, access) values ('Đề thi HSG QG', 'Đề thi HSG QG', 'Đề thi chọn HSG Quốc gia môn Hóa học – ngày thi thứ nhất', 12, 'open');
insert into free_docs (category, tag, title, pages, access) values ('Đề thi HSG QG', 'Đề thi HSG QG', 'Đề thi chọn HSG Quốc gia – ngày thi thứ hai, kèm hướng dẫn chấm', 20, 'ad');
insert into free_docs (category, tag, title, pages, access) values ('Đề thi IChO', 'Đề thi IChO · Bản dịch', 'Đề thi IChO – phần lý thuyết (bản dịch tiếng Việt)', 28, 'ad');
insert into free_docs (category, tag, title, pages, access) values ('Đề thi IChO', 'Đề thi IChO · Bản dịch', 'Bài chuẩn bị IChO (Preparatory Problems) – phần Hữu cơ', 34, 'ad');
insert into free_docs (category, tag, title, pages, access) values ('Đề thi Duyên hải', 'Đề thi Duyên hải', 'Đề thi Duyên hải và Đồng bằng Bắc Bộ – Hóa 10', 10, 'open');
insert into free_docs (category, tag, title, pages, access) values ('Đề thi Duyên hải', 'Đề thi Duyên hải', 'Đề thi Duyên hải và Đồng bằng Bắc Bộ – Hóa 11, có đáp án', 16, 'ad');
insert into free_docs (category, tag, title, pages, access) values ('Sách', 'Sách', 'Sổ tay công thức và phản ứng Hóa học THPT', 64, 'ad');
insert into free_docs (category, tag, title, pages, access) values ('Chuyên đề khác', 'Chuyên đề · Bảng tra', 'Bảng pKa và pI của 20 amino acid chuẩn', 2, 'open');
insert into free_docs (category, tag, title, pages, access) values ('Chuyên đề khác', 'Chuyên đề', 'Cân bằng phản ứng oxi hóa – khử', 18, 'ad');
insert into free_docs (category, tag, title, pages, access) values ('Chuyên đề khác', 'Chuyên đề', 'Phản ứng định tính nhận biết amino acid', 10, 'ad');
with d as (insert into shop_docs (category, tag, title, pages, price, base_downloads) values ('Bài giảng lý thuyết và bài tập ứng dụng', 'Bài giảng · Lớp 12', 'Amino acid và peptide – lý thuyết và bài tập ứng dụng', 38, 59000, 1248) returning id)
insert into shop_videos (doc_id, title, position) select d.id, v.t, v.p from d, (values ('Amino acid: tính axit–bazơ và pI', 0), ('Peptide: cấu tạo và thủy phân', 1)) as v(t, p) where v.t <> '__none__';
with d as (insert into shop_docs (category, tag, title, pages, price, base_downloads) values ('Bài giảng lý thuyết và bài tập ứng dụng', 'Bài giảng · Lớp 12', 'Carbohydrate – lý thuyết và bài tập ứng dụng', 42, 69000, 856) returning id)
insert into shop_videos (doc_id, title, position) select d.id, v.t, v.p from d, (values ('Monosaccharide và cấu trúc vòng', 0), ('Disaccharide, polysaccharide', 1)) as v(t, p) where v.t <> '__none__';
with d as (insert into shop_docs (category, tag, title, pages, price, base_downloads) values ('Bài tập theo chương', 'Bài tập · Lớp 11', 'Bài tập chương Ancol – Phenol, có lời giải', 24, 39000, 2310) returning id)
insert into shop_videos (doc_id, title, position) select d.id, v.t, v.p from d, (values ('__none__', 0)) as v(t, p) where v.t <> '__none__';
with d as (insert into shop_docs (category, tag, title, pages, price, base_downloads) values ('Bài tập theo chương', 'Bài tập · Lớp 12', 'Bài tập chương Amin – Amino acid – Protein, có lời giải', 28, 39000, 1902) returning id)
insert into shop_videos (doc_id, title, position) select d.id, v.t, v.p from d, (values ('__none__', 0)) as v(t, p) where v.t <> '__none__';
with d as (insert into shop_docs (category, tag, title, pages, price, base_downloads) values ('Các chuyên đề', 'Chuyên đề · HSG', 'Xác định trình tự peptide: Edman, khối phổ, cắt chọn lọc', 30, 79000, 417) returning id)
insert into shop_videos (doc_id, title, position) select d.id, v.t, v.p from d, (values ('Phương pháp Edman', 0), ('Khối phổ và cắt chọn lọc', 1)) as v(t, p) where v.t <> '__none__';
with d as (insert into shop_docs (category, tag, title, pages, price, base_downloads) values ('Các chuyên đề', 'Chuyên đề · HSG', 'Cơ chế phản ứng hữu cơ: thế, tách, cộng', 52, 99000, 689) returning id)
insert into shop_videos (doc_id, title, position) select d.id, v.t, v.p from d, (values ('__none__', 0)) as v(t, p) where v.t <> '__none__';
with d as (insert into shop_docs (category, tag, title, pages, price, base_downloads) values ('Đề thi thử', 'Đề thi thử · Lớp 12', 'Bộ 10 đề thi thử tốt nghiệp THPT, lời giải chi tiết', 80, 89000, 3054) returning id)
insert into shop_videos (doc_id, title, position) select d.id, v.t, v.p from d, (values ('__none__', 0)) as v(t, p) where v.t <> '__none__';
with d as (insert into shop_docs (category, tag, title, pages, price, base_downloads) values ('Tài liệu khác', 'Đề thi nước ngoài · Bản dịch', 'Đề thi Olympic Hóa học Toàn Nga – các bài Hữu cơ (bản dịch)', 74, 149000, 205) returning id)
insert into shop_videos (doc_id, title, position) select d.id, v.t, v.p from d, (values ('__none__', 0)) as v(t, p) where v.t <> '__none__';
with d as (insert into shop_docs (category, tag, title, pages, price, base_downloads) values ('Tài liệu khác', 'Đề thi nước ngoài · Lời giải', 'Lời giải chi tiết đề HSG Toàn Nga 2024', 46, 99000, 318) returning id)
insert into shop_videos (doc_id, title, position) select d.id, v.t, v.p from d, (values ('Chữa bài 1–2: tổng hợp hữu cơ', 0), ('Chữa bài 3: xác định cấu trúc', 1), ('Chữa bài 4–5: cơ chế phản ứng', 2)) as v(t, p) where v.t <> '__none__';
insert into courses (name, description, meta) values ('Khóa Hữu cơ 2026–2027', 'Khóa đang học: hệ thống Hóa hữu cơ từ đại cương đến chuỗi tổng hợp, dành cho học sinh ôn thi HSG và đại học.', '[["Lịch học","thầy bổ sung"],["Hình thức","Online qua Microsoft Teams"],["Thời gian","09/2026 – 05/2027"]]'::jsonb);
with l as (insert into lessons (course_id, n, title, held_on) select id, 1, 'Đại cương hóa hữu cơ, đồng phân', '2026-09-08' from courses where name = 'Khóa Hữu cơ 2026–2027' returning id)
insert into lesson_files (lesson_id, kind, title, position) select l.id, f.k, f.t, f.p from l, (values ('pdf', 'Bài giảng buổi 1 (PDF)', 0), ('pdf', 'Bài tập về nhà buổi 1', 1), ('video', 'Bản ghi buổi 1', 2)) as f(k, t, p);
with l as (insert into lessons (course_id, n, title, held_on) select id, 2, 'Hiệu ứng electron, tính axit – bazơ', '2026-09-15' from courses where name = 'Khóa Hữu cơ 2026–2027' returning id)
insert into lesson_files (lesson_id, kind, title, position) select l.id, f.k, f.t, f.p from l, (values ('pdf', 'Bài giảng buổi 2 (PDF)', 0), ('pdf', 'Bài tập về nhà buổi 2', 1), ('video', 'Bản ghi buổi 2', 2)) as f(k, t, p);
with l as (insert into lessons (course_id, n, title, held_on) select id, 3, 'Hiđrocacbon no và không no', '2026-09-22' from courses where name = 'Khóa Hữu cơ 2026–2027' returning id)
insert into lesson_files (lesson_id, kind, title, position) select l.id, f.k, f.t, f.p from l, (values ('pdf', 'Bài giảng buổi 3 (PDF)', 0), ('video', 'Bản ghi buổi 3', 1), ('video', 'Chữa bài tập buổi 3', 2)) as f(k, t, p);
with l as (insert into lessons (course_id, n, title, held_on) select id, 4, 'Cơ chế thế SN1, SN2', '2026-09-29' from courses where name = 'Khóa Hữu cơ 2026–2027' returning id)
insert into lesson_files (lesson_id, kind, title, position) select l.id, f.k, f.t, f.p from l, (values ('pdf', 'Bài giảng buổi 4 (PDF)', 0), ('pdf', 'Bài tập cơ chế', 1), ('video', 'Bản ghi buổi 4', 2)) as f(k, t, p);
with l as (insert into lessons (course_id, n, title, held_on) select id, 5, 'Cơ chế tách E1, E2 và cạnh tranh thế – tách', '2026-10-06' from courses where name = 'Khóa Hữu cơ 2026–2027' returning id)
insert into lesson_files (lesson_id, kind, title, position) select l.id, f.k, f.t, f.p from l, (values ('pdf', 'Bài giảng buổi 5 (PDF)', 0), ('video', 'Bản ghi buổi 5', 1)) as f(k, t, p);
with l as (insert into lessons (course_id, n, title, held_on) select id, 6, 'Ancol, phenol, ete', '2026-10-13' from courses where name = 'Khóa Hữu cơ 2026–2027' returning id)
insert into lesson_files (lesson_id, kind, title, position) select l.id, f.k, f.t, f.p from l, (values ('pdf', 'Bài giảng buổi 6 (PDF)', 0), ('pdf', 'Đề kiểm tra giữa kỳ', 1), ('video', 'Bản ghi buổi 6', 2)) as f(k, t, p);
commit;
