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

-- Duyệt câu hỏi và cấm đăng bài (thêm cột cho cơ sở dữ liệu đã có)
alter table profiles add column if not exists banned_until timestamptz;   -- 'infinity' = vô thời hạn
alter table topics add column if not exists approved boolean not null default true; -- câu hỏi cũ coi như đã duyệt
alter table topics alter column approved set default false;
-- Ảnh đính kèm câu hỏi phải nằm trong thư mục riêng của người hỏi
alter table topics drop constraint if exists topics_image_key_owner;
alter table topics add constraint topics_image_key_owner check (image_key is null or image_key like ('forum/' || user_id::text || '/%'));

create or replace function public.can_post() returns boolean
language sql stable security definer set search_path = public as $$
  select coalesce((select not comment_banned and (banned_until is null or banned_until <= now())
                   from profiles where id = auth.uid()), false)
$$;

drop policy if exists "comments: xem" on comments;
create policy "comments: xem" on comments for select using (not hidden or is_teacher());
drop policy if exists "comments: viết" on comments;
create policy "comments: viết" on comments for insert with check (user_id = auth.uid() and can_post());
drop policy if exists "comments: thầy quản lý" on comments;
create policy "comments: thầy quản lý" on comments for update using (is_teacher());

drop policy if exists "topics: xem" on topics;
create policy "topics: xem" on topics for select using ((approved and not hidden) or user_id = auth.uid() or is_teacher());
drop policy if exists "topics: đăng" on topics;
create policy "topics: đăng" on topics for insert with check (user_id = auth.uid() and can_post());
drop policy if exists "topics: người hỏi chọn đáp án, thầy quản lý" on topics;
create policy "topics: người hỏi chọn đáp án, thầy quản lý" on topics for update using (user_id = auth.uid() or is_teacher());

drop policy if exists "replies: xem" on replies;
create policy "replies: xem" on replies for select using (not hidden or is_teacher());
drop policy if exists "replies: trả lời" on replies;
create policy "replies: trả lời" on replies for insert with check (user_id = auth.uid() and can_post()
  and exists (select 1 from topics t where t.id = topic_id and t.approved and not t.hidden));
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
create policy "reviews: viết của mình" on reviews for insert with check (user_id = auth.uid() and not approved and can_post());
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
    new.hidden := old.hidden; new.user_id := old.user_id; new.approved := old.approved; new.image_key := old.image_key;
  end if;
  return new;
end $$;
drop trigger if exists topics_guard on topics;
create trigger topics_guard before update on topics for each row execute function topic_guard();

-- Câu hỏi mới của thành viên phải chờ thầy duyệt; câu hỏi của thầy hiện ngay
create or replace function public.topic_new() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  new.approved := is_teacher(); new.hidden := false; new.best_reply_id := null;
  return new;
end $$;
drop trigger if exists topics_new on topics;
create trigger topics_new before insert on topics for each row execute function topic_new();

-- Thầy cấm thành viên đăng bài: p_days = 7, 30…; null = vô thời hạn; 0 = bỏ cấm
create or replace function public.admin_ban(p_user uuid, p_days int) returns timestamptz
language plpgsql security definer set search_path = public as $$
declare v timestamptz;
begin
  if not is_teacher() then raise exception 'Chỉ thầy được làm việc này'; end if;
  if exists (select 1 from profiles where id = p_user and is_teacher) then raise exception 'Không thể cấm tài khoản quản trị'; end if;
  v := case when p_days is null then 'infinity'::timestamptz when p_days <= 0 then null else now() + make_interval(days => p_days) end;
  update profiles set banned_until = v where id = p_user;
  if not found then raise exception 'Không tìm thấy tài khoản'; end if;
  insert into admin_log (admin_id, target_id, action, data)
    values (auth.uid(), p_user, case when v is null then 'unban' else 'ban' end, jsonb_build_object('days', p_days));
  return v;
end $$;
revoke execute on function public.admin_ban(uuid, int) from public, anon;
grant execute on function public.admin_ban(uuid, int) to authenticated;

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
-- Link xem thử (ai cũng xem được, chỉ xem online)
alter table public.shop_docs add column if not exists preview_url text;
-- Thứ tự hiển thị trong mục (ví dụ số buổi)
alter table public.shop_docs add column if not exists position int not null default 0;
-- File PDF thứ hai trở đi của một tài liệu bán (ví dụ đáp án)
create table if not exists public.shop_doc_files (
  id bigint generated always as identity primary key,
  doc_id bigint not null references shop_docs(id) on delete cascade,
  title text not null,
  position int not null default 0
);
create table if not exists public.shop_videos (
  id bigint generated always as identity primary key,
  doc_id bigint not null references shop_docs(id) on delete cascade,
  title text not null,
  position int not null default 0
);
-- Phần bí mật: đường dẫn file trong kho lưu trữ, mã video Bunny (chỉ máy chủ đọc)
create table if not exists public.file_secrets (
  owner_type text not null,
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
alter table shop_doc_files enable row level security;
alter table file_secrets drop constraint if exists file_secrets_owner_type_check;
alter table file_secrets add constraint file_secrets_owner_type_check check (owner_type in ('free_doc', 'shop_doc', 'shop_file', 'shop_video', 'lesson_file'));
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
drop policy if exists "shop_doc_files: xem tên" on shop_doc_files;
create policy "shop_doc_files: xem tên" on shop_doc_files for select using (true);
drop policy if exists "shop_doc_files: thầy" on shop_doc_files;
create policy "shop_doc_files: thầy" on shop_doc_files for all using (is_teacher()) with check (is_teacher());
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

-- Ghi một lượt tải (chỉ khi người dùng có quyền với tài liệu); trả về tổng lượt tải mới
create or replace function public.record_download(p_doc bigint) returns bigint
language plpgsql security definer set search_path = public as $$
declare n bigint;
begin
  if auth.uid() is null or doc_status(p_doc) not in ('active', 'student_free') then
    raise exception 'Bạn chưa có quyền tải tài liệu này';
  end if;
  insert into downloads (doc_id, user_id) values (p_doc, auth.uid());
  select downloads into n from shop_doc_stats where id = p_doc;
  return n;
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

-- Danh sách học viên cho trang Quản trị (bản đầy đủ ở mục 10)
drop function if exists public.admin_students();
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
grant execute on function public.fulfill_order(text, int, text) to service_role;

-- Nhật ký tiền vào từ SePay (để thầy đối chiếu)
create table if not exists public.payment_events (
  id bigint generated always as identity primary key,
  sepay_id bigint unique,
  order_code text,
  amount int,
  result text,
  payload jsonb,
  created_at timestamptz not null default now()
);
alter table payment_events enable row level security;
drop policy if exists "payment_events: thầy xem" on payment_events;
create policy "payment_events: thầy xem" on payment_events for select using (is_teacher());

-- Hàm chỉ máy chủ được gọi
revoke execute on function public.doc_status(bigint, uuid) from anon;
grant execute on function public.doc_status(bigint, uuid) to authenticated;

-- ---------------------------------------------------------------------
-- 8. Thông báo và ảnh trong câu trả lời Hỏi đáp
-- ---------------------------------------------------------------------
alter table replies add column if not exists image_key text;
alter table replies drop constraint if exists replies_image_key_owner;
alter table replies add constraint replies_image_key_owner check (image_key is null or image_key like ('forum/' || user_id::text || '/%'));

alter table profiles add column if not exists notif_read_at timestamptz not null default now();

create table if not exists public.notifications (
  id bigint generated always as identity primary key,
  user_id uuid references profiles(id) on delete cascade,  -- null = gửi mọi thành viên, VIP, Học viên
  kind text not null,                                      -- doc_new, reply, approved, rejected, best, renew
  title text not null,
  body text,
  link text,                                               -- shop:5, free:3, topic:12, member
  dedupe text unique,                                      -- chống gửi trùng
  created_at timestamptz not null default now()
);
create index if not exists notifications_user_time on notifications (user_id, created_at desc);
alter table notifications enable row level security;
drop policy if exists "notifications: xem của mình" on notifications;
create policy "notifications: xem của mình" on notifications for select
  using (user_id = auth.uid() or (user_id is null and auth.uid() is not null and not is_teacher()));

-- Tài liệu mới (đã đăng và đã có PDF) → báo mọi người, mỗi tài liệu một lần
create or replace function public.notify_doc(p_type text, p_id bigint) returns void
language plpgsql security definer set search_path = public as $$
declare t text; c text; pub boolean; price int;
begin
  if not exists (select 1 from file_secrets where owner_type = p_type and owner_id = p_id and storage_key is not null) then return; end if;
  if p_type = 'shop_doc' then
    select title, category, published, shop_docs.price into t, c, pub, price from shop_docs where id = p_id;
    if pub and not exists (select 1 from notifications where dedupe = 'doc:shop:' || p_id) then
      -- Nhiều tài liệu cùng mục trong một ngày thì gộp thành một thông báo
      if exists (select 1 from notifications where dedupe like 'doc:shop:%' and body like c || ' ·%' and created_at > now() - interval '1 day') then
        insert into notifications (kind, title, body, link, dedupe)
        values ('doc_new', 'Nhiều tài liệu mới trong mục ' || c, c || ' · bấm để xem', 'shopcat:' || c, 'doccat:' || c || ':' || to_char(now() at time zone 'Asia/Ho_Chi_Minh', 'YYYYMMDD'))
        on conflict (dedupe) do update set created_at = now();
      else
        insert into notifications (kind, title, body, link, dedupe)
        values ('doc_new', 'Tài liệu mới: ' || t, c || ' · ' || replace(to_char(price, 'FM999,999,999'), ',', '.') || 'đ', 'shop:' || p_id, 'doc:shop:' || p_id)
        on conflict (dedupe) do nothing;
      end if;
    end if;
  elsif p_type = 'free_doc' then
    select title, category, published into t, c, pub from free_docs where id = p_id;
    if pub then
      insert into notifications (kind, title, body, link, dedupe)
      values ('doc_new', 'Tài liệu mới: ' || t, c || ' · miễn phí', 'free:' || p_id, 'doc:free:' || p_id)
      on conflict (dedupe) do nothing;
    end if;
  end if;
end $$;
revoke execute on function public.notify_doc(text, bigint) from public, anon, authenticated;

create or replace function public.trg_file_notify() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  if new.storage_key is not null and new.owner_type in ('shop_doc', 'free_doc') then perform notify_doc(new.owner_type, new.owner_id); end if;
  return new;
end $$;
drop trigger if exists file_secrets_notify on file_secrets;
create trigger file_secrets_notify after insert or update of storage_key on file_secrets for each row execute function trg_file_notify();

create or replace function public.trg_doc_published() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  if new.published and not old.published then
    perform notify_doc(case when tg_table_name = 'shop_docs' then 'shop_doc' else 'free_doc' end, new.id);
  end if;
  return new;
end $$;
drop trigger if exists shop_docs_published on shop_docs;
create trigger shop_docs_published after update of published on shop_docs for each row execute function trg_doc_published();
drop trigger if exists free_docs_published on free_docs;
create trigger free_docs_published after update of published on free_docs for each row execute function trg_doc_published();

-- Có câu trả lời mới → báo người hỏi và những người đã trả lời trong câu hỏi đó
create or replace function public.trg_reply_notify() returns trigger
language plpgsql security definer set search_path = public as $$
declare t topics; who text;
begin
  select * into t from topics where id = new.topic_id;
  select nick into who from profiles where id = new.user_id;
  insert into notifications (user_id, kind, title, body, link)
  select u, 'reply',
    case when u = t.user_id then who || ' đã trả lời câu hỏi của bạn' else who || ' cũng trả lời câu hỏi bạn tham gia' end,
    t.title, 'topic:' || t.id
  from (select t.user_id as u union select user_id from replies where topic_id = t.id and not hidden) x
  where u is not null and u <> new.user_id;
  return new;
end $$;
drop trigger if exists replies_notify on replies;
create trigger replies_notify after insert on replies for each row execute function trg_reply_notify();

-- Câu hỏi được duyệt / bị từ chối; câu trả lời được chọn là đúng
create or replace function public.trg_topic_notify() returns trigger
language plpgsql security definer set search_path = public as $$
declare ru uuid;
begin
  if new.approved and not old.approved then
    insert into notifications (user_id, kind, title, body, link, dedupe)
    values (new.user_id, 'approved', 'Câu hỏi của bạn đã được duyệt', new.title, 'topic:' || new.id, 'approved:' || new.id) on conflict (dedupe) do nothing;
  elsif new.hidden and not old.hidden and not new.approved then
    insert into notifications (user_id, kind, title, body, link, dedupe)
    values (new.user_id, 'rejected', 'Câu hỏi của bạn không được duyệt', new.title, 'topic:' || new.id, 'rejected:' || new.id) on conflict (dedupe) do nothing;
  end if;
  if new.best_reply_id is not null and new.best_reply_id is distinct from old.best_reply_id then
    select user_id into ru from replies where id = new.best_reply_id;
    if ru is not null and ru <> new.user_id then
      insert into notifications (user_id, kind, title, body, link, dedupe)
      values (ru, 'best', 'Câu trả lời của bạn được chọn là đúng', new.title, 'topic:' || new.id, 'best:' || new.best_reply_id) on conflict (dedupe) do nothing;
    end if;
  end if;
  return new;
end $$;
drop trigger if exists topics_notify on topics;
create trigger topics_notify after update on topics for each row execute function trg_topic_notify();

-- Nhắc gia hạn VIP / Học viên khi còn 5, 3, 1 ngày (tạo khi người dùng mở trang)
create or replace function public.sync_my_reminders() returns void
language plpgsql security definer set search_path = public as $$
declare p profiles; r record; d int; t int;
begin
  select * into p from profiles where id = auth.uid();
  if p.id is null or p.is_teacher then return; end if;
  for r in select 'vip' as k, 'Gói VIP' as name, p.vip_until as u union all select 'student', 'Gói Học viên', p.student_until loop
    if r.u is null or r.u <= now() or r.u = 'infinity' then continue; end if;
    d := ceil(extract(epoch from (r.u - now())) / 86400);
    t := case when d <= 1 then 1 when d <= 3 then 3 when d <= 5 then 5 end;
    if t is null then continue; end if;
    insert into notifications (user_id, kind, title, body, link, dedupe)
    values (p.id, 'renew', r.name || ' sắp hết hạn (còn ' || d || ' ngày)',
            'Hết hạn ngày ' || to_char(r.u at time zone 'Asia/Ho_Chi_Minh', 'DD/MM/YYYY') || '. Gia hạn để không bị gián đoạn.',
            'member', 'renew:' || r.k || ':' || p.id || ':' || to_char(r.u, 'YYYYMMDD') || ':' || t)
    on conflict (dedupe) do nothing;
  end loop;
end $$;
revoke execute on function public.sync_my_reminders() from public, anon;
grant execute on function public.sync_my_reminders() to authenticated;

create or replace function public.mark_notifs_read() returns timestamptz
language sql security definer set search_path = public as $$
  update profiles set notif_read_at = now() where id = auth.uid() returning notif_read_at;
$$;
revoke execute on function public.mark_notifs_read() from public, anon;
grant execute on function public.mark_notifs_read() to authenticated;

-- Thầy: số mục đang chờ xử lý
create or replace function public.admin_pending_counts() returns jsonb
language sql stable security definer set search_path = public as $$
  select case when is_teacher() then jsonb_build_object(
    'topics', (select count(*) from topics where not approved and not hidden),
    'reviews', (select count(*) from reviews where not approved),
    'reports', (select count(*) from reports where not resolved)) end;
$$;

-- ---------------------------------------------------------------------
-- 9. Trang web học tập hữu ích (link chỉ trả về qua hàm, sau khi xem quảng cáo)
-- ---------------------------------------------------------------------
create table if not exists public.useful_links (
  id bigint generated always as identity primary key,
  title text not null check (char_length(title) between 2 and 160),
  description text,
  published boolean not null default true,
  position int not null default 0,
  created_at timestamptz not null default now()
);
create table if not exists public.useful_link_urls (
  link_id bigint primary key references useful_links(id) on delete cascade,
  url text not null check (url ~* '^https?://[^\s]+$')
);
alter table useful_links enable row level security;
alter table useful_link_urls enable row level security;
drop policy if exists "useful_links: xem" on useful_links;
create policy "useful_links: xem" on useful_links for select using (published or is_teacher());
drop policy if exists "useful_links: thầy" on useful_links;
create policy "useful_links: thầy" on useful_links for all using (is_teacher()) with check (is_teacher());
drop policy if exists "useful_link_urls: thầy" on useful_link_urls;
create policy "useful_link_urls: thầy" on useful_link_urls for all using (is_teacher()) with check (is_teacher());

create or replace function public.open_link(p_id bigint) returns text
language sql stable security definer set search_path = public as $$
  select u.url from useful_link_urls u join useful_links l on l.id = u.link_id
  where l.id = p_id and (l.published or is_teacher());
$$;
grant execute on function public.open_link(bigint) to anon, authenticated;

-- ---------------------------------------------------------------------
-- 10. Học viên vào giữa khóa / nghỉ giữa chừng
--   Vào giữa khóa từ buổi k: không xem buổi < k (khóa hiện hành và tài liệu "Buổi N"
--   của 2 mục Bài giảng lý thuyết, Bài tập theo chương), trừ buổi thầy tặng.
--   Nghỉ từ buổi q: tài khoản về Thành viên, không xem từ buổi q trở đi;
--   các buổi đã học (từ k đến q-1) vẫn xem được đến hết hạn gói đã đóng.
-- ---------------------------------------------------------------------
alter table profiles add column if not exists student_to_lesson int;          -- nghỉ từ buổi này (không tính)
alter table profiles add column if not exists student_keep_until timestamptz; -- giữ quyền các buổi đã học đến ngày này

create or replace function public.student_has_lesson(uid uuid, n int) returns boolean
language plpgsql stable security definer set search_path = public as $$
declare p profiles;
begin
  select * into p from profiles where id = uid;
  if p.id is null or n is null then return false; end if;
  if not (p.student_until > now() or (p.student_keep_until > now() and p.student_to_lesson is not null)) then return false; end if;
  if n = any (p.student_extra_lessons) then return true; end if;
  if n < p.student_from_lesson then return false; end if;
  if p.student_to_lesson is not null and n >= p.student_to_lesson then return false; end if;
  return true;
end $$;

create or replace function public.doc_status(p_doc bigint, uid uuid default auth.uid()) returns text
language plpgsql stable security definer set search_path = public as $$
declare d shop_docs; a doc_access; r text; n int;
begin
  select * into d from shop_docs where id = p_doc;
  r := role_of(uid);
  if r = 'teacher' then return 'active'; end if;
  if d.category in ('Bài giảng lý thuyết và bài tập ứng dụng', 'Bài tập theo chương') then
    n := (regexp_match(coalesce(d.tag, ''), '^Buổi ([0-9]+)$'))[1]::int;
    if n is null and r = 'student' then return 'student_free'; end if;
    if n is not null and student_has_lesson(uid, n) then return 'student_free'; end if;
  end if;
  select * into a from doc_access where user_id = uid and doc_id = p_doc;
  if not found then return 'none'; end if;
  return case when a.expires_at > now() then 'active' else 'expired' end;
end $$;

create or replace function public.lesson_open(p_lesson bigint, uid uuid default auth.uid()) returns boolean
language plpgsql stable security definer set search_path = public as $$
declare l lessons;
begin
  select * into l from lessons where id = p_lesson;
  if role_of(uid) = 'teacher' then return true; end if;
  if exists (select 1 from lesson_purchases where user_id = uid and lesson_id = p_lesson) and role_of(uid) = 'student' then return true; end if;
  return student_has_lesson(uid, l.n);
end $$;

create or replace function public.admin_grant_student(p_user uuid, p_from int, p_extra int[], p_expires date, p_paid text, p_note text) returns void
language plpgsql security definer set search_path = public as $$
begin
  if not is_teacher() then raise exception 'Chỉ thầy được cấp quyền'; end if;
  update profiles set student_until = (p_expires + 1)::timestamptz, student_from_lesson = p_from,
         student_extra_lessons = coalesce(p_extra, '{}'), student_ever = true,
         student_to_lesson = null, student_keep_until = null where id = p_user;
  insert into admin_log (admin_id, target_id, action, data)
    values (auth.uid(), p_user, 'grant_student', jsonb_build_object('from', p_from, 'extra', p_extra, 'expires', p_expires, 'paid', p_paid, 'note', p_note));
end $$;

-- Thu hồi hẳn (không giữ buổi nào)
create or replace function public.admin_revoke_student(p_user uuid) returns void
language plpgsql security definer set search_path = public as $$
begin
  if not is_teacher() then raise exception 'Chỉ thầy được thu hồi'; end if;
  update profiles set student_until = now(), student_to_lesson = null, student_keep_until = null where id = p_user;
  insert into admin_log (admin_id, target_id, action) values (auth.uid(), p_user, 'revoke_student');
end $$;

-- Học viên nghỉ từ buổi p_lesson: về Thành viên, giữ các buổi đã học đến hết hạn gói
create or replace function public.admin_quit_student(p_user uuid, p_lesson int) returns void
language plpgsql security definer set search_path = public as $$
declare p profiles;
begin
  if not is_teacher() then raise exception 'Chỉ thầy được làm việc này'; end if;
  select * into p from profiles where id = p_user;
  if p.id is null then raise exception 'Không tìm thấy tài khoản'; end if;
  if p_lesson is null or p_lesson < 1 then raise exception 'Số buổi không hợp lệ'; end if;
  update profiles set
    student_keep_until = greatest(coalesce(p.student_keep_until, p.student_until), p.student_until),
    student_to_lesson = p_lesson,
    student_until = least(p.student_until, now())
  where id = p_user;
  insert into admin_log (admin_id, target_id, action, data) values (auth.uid(), p_user, 'quit_student', jsonb_build_object('from_lesson', p_lesson));
end $$;
revoke execute on function public.admin_quit_student(uuid, int) from public, anon;
grant execute on function public.admin_quit_student(uuid, int) to authenticated;

drop function if exists public.admin_students();
create or replace function public.admin_students() returns table (
  id uuid, nick text, phone text, student_until timestamptz, student_from_lesson int, student_extra_lessons int[],
  student_to_lesson int, student_keep_until timestamptz, last_note jsonb, email text)
language sql stable security definer set search_path = public as $$
  select p.id, p.nick, p.phone, p.student_until, p.student_from_lesson, p.student_extra_lessons,
    p.student_to_lesson, p.student_keep_until,
    (select data from admin_log l where l.target_id = p.id order by created_at desc limit 1),
    (select u.email::text from auth.users u where u.id = p.id)
  from profiles p
  where is_teacher() and p.student_until is not null
  order by p.student_until desc;
$$;

-- Thầy tìm tài khoản theo email hoặc biệt danh
create or replace function public.admin_accounts() returns table (id uuid, nick text, email text, role text, banned_until timestamptz)
language sql stable security definer set search_path = public as $$
  select p.id, p.nick, u.email::text, role_of(p.id), p.banned_until
  from profiles p join auth.users u on u.id = p.id
  where is_teacher()
  order by p.created_at desc
  limit 2000;
$$;
revoke execute on function public.admin_accounts() from public, anon;
grant execute on function public.admin_accounts() to authenticated;


-- ---------------------------------------------------------------------
-- 8. Đặt thầy làm quản trị (chạy SAU khi thầy đã đăng nhập trang một lần):
--    update profiles set is_teacher = true where nick = 'BIET_DANH_CUA_THAY';
-- ---------------------------------------------------------------------
