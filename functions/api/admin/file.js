/*
  Thầy tải file PDF lên kho R2.
  PUT /api/admin/file?type=shop_doc|shop_file|free_doc|lesson_file&id=123   (thân yêu cầu = nội dung PDF)
*/
import { json, tokenOf, isTeacher, asServer } from "../../_lib/common.js";

export async function onRequestPut({ request, env }) {
  if (!env.FILES) return json({ error: "Chưa cấu hình kho file (R2): thêm ràng buộc R2 tên FILES." }, 503);
  const token = tokenOf(request);
  if (!(await isTeacher(env, token))) return json({ error: "Chỉ thầy được tải file lên." }, 403);
  const url = new URL(request.url);
  const type = url.searchParams.get("type"), id = Number(url.searchParams.get("id"));
  if (!["shop_doc", "shop_file", "free_doc", "lesson_file"].includes(type) || !id) return json({ error: "Tham số không hợp lệ" }, 400);
  const ct = request.headers.get("Content-Type") || "";
  if (!ct.includes("pdf")) return json({ error: "Chỉ nhận file PDF." }, 415);
  const key = `${type}/${id}/${Date.now()}.pdf`;
  await env.FILES.put(key, request.body, { httpMetadata: { contentType: "application/pdf" } });
  const r = await asServer(env, "/rest/v1/file_secrets?on_conflict=owner_type,owner_id", {
    method: "POST", headers: { Prefer: "resolution=merge-duplicates,return=minimal" },
    body: JSON.stringify({ owner_type: type, owner_id: id, storage_key: key })
  });
  if (!r.ok) return json({ error: "Đã lưu file nhưng chưa ghi được vào cơ sở dữ liệu (" + r.status + ")." }, 500);
  return json({ ok: true, key });
}
