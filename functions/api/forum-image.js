/*
  Ảnh đính kèm câu hỏi Hỏi đáp (lưu trong kho R2, thư mục forum/).
  PUT /api/forum-image                 thân yêu cầu = ảnh (PNG, JPG, WEBP, GIF; tối đa 1.000.000 byte) → { key }
  GET /api/forum-image?topic=123       trả ảnh của câu hỏi nếu người xem được phép thấy câu hỏi đó
  GET /api/forum-image?reply=456       trả ảnh của câu trả lời (theo quyền xem câu trả lời)
*/
import { json, tokenOf, getUser, rpcAsUser, asUser, one } from "../_lib/common.js";

const MAX = 1000000;

function kindOf(b) {
  if (b.length > 8 && b[0] === 0x89 && b[1] === 0x50 && b[2] === 0x4e && b[3] === 0x47) return ["png", "image/png"];
  if (b.length > 3 && b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff) return ["jpg", "image/jpeg"];
  if (b.length > 12 && b[0] === 0x52 && b[1] === 0x49 && b[2] === 0x46 && b[3] === 0x46 && b[8] === 0x57 && b[9] === 0x45 && b[10] === 0x42 && b[11] === 0x50) return ["webp", "image/webp"];
  if (b.length > 6 && b[0] === 0x47 && b[1] === 0x49 && b[2] === 0x46 && b[3] === 0x38) return ["gif", "image/gif"];
  return null;
}

export async function onRequestPut({ request, env }) {
  if (!env.FILES) return json({ error: "Chưa cấu hình kho file (R2)." }, 503);
  const token = tokenOf(request);
  const user = await getUser(env, token);
  if (!user) return json({ error: "Cần đăng nhập để gửi ảnh." }, 401);
  if ((await rpcAsUser(env, token, "can_post", {})) !== true) return json({ error: "Tài khoản đang bị khóa đăng bài." }, 403);
  const len = Number(request.headers.get("Content-Length") || 0);
  if (len > MAX) return json({ error: "Ảnh quá 1 MB." }, 413);
  const buf = new Uint8Array(await request.arrayBuffer());
  if (!buf.length) return json({ error: "Chưa có ảnh." }, 400);
  if (buf.length > MAX) return json({ error: "Ảnh quá 1 MB." }, 413);
  const k = kindOf(buf);
  if (!k) return json({ error: "Chỉ nhận ảnh PNG, JPG, WEBP hoặc GIF." }, 415);
  const key = `forum/${user.id}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${k[0]}`;
  await env.FILES.put(key, buf, { httpMetadata: { contentType: k[1] } });
  return json({ ok: true, key });
}

export async function onRequestGet({ request, env }) {
  if (!env.FILES) return json({ error: "Chưa cấu hình kho file (R2)." }, 503);
  const q = new URL(request.url).searchParams;
  const isReply = q.has("reply"), id = Number(q.get(isReply ? "reply" : "topic"));
  if (!id) return json({ error: "Thiếu mã câu hỏi" }, 400);
  // Đọc theo quyền của người xem: câu hỏi chưa duyệt chỉ người hỏi và thầy thấy; câu trả lời bị ẩn chỉ thầy thấy
  const t = await one(await asUser(env, tokenOf(request), `/rest/v1/${isReply ? "replies" : "topics"}?id=eq.${id}&select=image_key`));
  if (!t || !t.image_key || !t.image_key.startsWith("forum/")) return json({ error: "Không có ảnh" }, 404);
  const obj = await env.FILES.get(t.image_key);
  if (!obj) return json({ error: "Không tìm thấy ảnh" }, 404);
  return new Response(obj.body, { headers: {
    "Content-Type": (obj.httpMetadata && obj.httpMetadata.contentType) || "application/octet-stream",
    "Cache-Control": "private, max-age=3600", "X-Content-Type-Options": "nosniff",
    "Content-Disposition": "inline"
  } });
}
