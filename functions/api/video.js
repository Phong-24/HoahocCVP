/*
  Trả về link phát video Bunny Stream có mã khóa, hết hạn sau 4 giờ.
  GET /api/video?type=shop_video|lesson_file&id=123   (gửi kèm Authorization: Bearer <token đăng nhập>)
  Biến môi trường: BUNNY_LIBRARY_ID (Text), BUNNY_TOKEN_KEY (Secret, "Token authentication key" của thư viện).
*/
import { json, tokenOf, canAccess, secretOf } from "../_lib/common.js";

async function sha256hex(s) {
  const d = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(s));
  return [...new Uint8Array(d)].map(b => b.toString(16).padStart(2, "0")).join("");
}

export async function onRequestGet({ request, env }) {
  if (!env.BUNNY_LIBRARY_ID) return json({ error: "Chưa cấu hình thư viện video." }, 503);
  const url = new URL(request.url);
  const type = url.searchParams.get("type"), id = url.searchParams.get("id");
  if (!["shop_video", "lesson_file"].includes(type)) return json({ error: "Loại không hợp lệ" }, 400);
  const token = tokenOf(request);
  if (!(await canAccess(env, token, type, id))) return json({ error: token ? "Bạn chưa có quyền xem video này." : "Cần đăng nhập." }, 403);
  const sec = await secretOf(env, type, id);
  if (!sec || !sec.bunny_video_id) return json({ error: "Thầy chưa gắn video này." }, 404);
  const vid = sec.bunny_video_id.trim();
  let src = `https://player.mediadelivery.net/embed/${encodeURIComponent(env.BUNNY_LIBRARY_ID)}/${encodeURIComponent(vid)}`;
  if (env.BUNNY_TOKEN_KEY) {
    const exp = Math.floor(Date.now() / 1000) + 4 * 3600;
    src += `?token=${await sha256hex(env.BUNNY_TOKEN_KEY + vid + exp)}&expires=${exp}`;
  }
  return json({ url: src });
}
