/* Hàm dùng chung cho các API của trang. */
// Khóa công khai của Supabase (giống site/config.js) – dùng để gọi API thay mặt người dùng
export const PUBLISHABLE_KEY = "sb_publishable_a2C6G585tACFQpTgdxXUEw_PXxi4S58";

export const json = (obj, status = 200, extra) => new Response(JSON.stringify(obj), { status, headers: { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store", ...(extra || {}) } });

const base = env => env.SUPABASE_URL.replace(/\/$/, "");

// Gọi Supabase bằng quyền máy chủ (bỏ qua phân quyền) – chỉ dùng cho bảng bí mật
export async function asServer(env, path, init = {}) {
  const key = env.SUPABASE_SERVICE_KEY;
  const headers = { apikey: key, "Content-Type": "application/json", ...(init.headers || {}) };
  if (key.startsWith("eyJ")) headers.Authorization = "Bearer " + key;
  return fetch(base(env) + path, { ...init, headers });
}

// Gọi Supabase thay mặt người dùng (theo phân quyền của người đó)
export async function asUser(env, token, path, init = {}) {
  const headers = { apikey: env.SUPABASE_PUBLISHABLE_KEY || PUBLISHABLE_KEY, "Content-Type": "application/json", ...(init.headers || {}) };
  if (token) headers.Authorization = "Bearer " + token;
  return fetch(base(env) + path, { ...init, headers });
}

export function tokenOf(request) {
  const h = request.headers.get("Authorization") || "";
  return h.startsWith("Bearer ") ? h.slice(7) : "";
}

export async function getUser(env, token) {
  if (!token) return null;
  const r = await asUser(env, token, "/auth/v1/user");
  if (!r.ok) return null;
  return r.json();
}

export async function rpcAsUser(env, token, fn, args) {
  const r = await asUser(env, token, "/rest/v1/rpc/" + fn, { method: "POST", body: JSON.stringify(args) });
  if (!r.ok) return null;
  return r.json();
}

export async function one(r) { if (!r.ok) return null; const a = await r.json(); return Array.isArray(a) ? a[0] || null : a; }

// Thông tin bí mật của file: đường dẫn trong R2, mã video Bunny
export async function secretOf(env, type, id) {
  return one(await asServer(env, `/rest/v1/file_secrets?owner_type=eq.${encodeURIComponent(type)}&owner_id=eq.${Number(id)}&select=storage_key,bunny_video_id`));
}

// Người dùng có được mở nội dung này không
export async function canAccess(env, token, type, id) {
  id = Number(id);
  if (!id) return false;
  if (type === "free_doc") {
    const d = await one(await asUser(env, token, `/rest/v1/free_docs?id=eq.${id}&select=id`));
    return !!d;
  }
  if (!token) return false;
  if (type === "shop_doc") {
    const s = await rpcAsUser(env, token, "doc_status", { p_doc: id });
    return s === "active" || s === "student_free";
  }
  if (type === "shop_video") {
    const v = await one(await asUser(env, token, `/rest/v1/shop_videos?id=eq.${id}&select=doc_id`));
    if (!v) return false;
    const s = await rpcAsUser(env, token, "doc_status", { p_doc: v.doc_id });
    return s === "active" || s === "student_free";
  }
  if (type === "lesson_file") {
    const f = await one(await asUser(env, token, `/rest/v1/lesson_files?id=eq.${id}&select=lesson_id`));
    if (!f) return false;
    return (await rpcAsUser(env, token, "lesson_open", { p_lesson: f.lesson_id })) === true;
  }
  return false;
}

export async function isTeacher(env, token) {
  const u = await getUser(env, token);
  if (!u) return false;
  const p = await one(await asUser(env, token, `/rest/v1/profiles?id=eq.${u.id}&select=is_teacher`));
  return !!(p && p.is_teacher);
}

export const TYPES = ["free_doc", "shop_doc", "shop_video", "lesson_file"];
