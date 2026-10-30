/*
  Mở / tải file PDF đã kiểm tra quyền.
  GET /api/file?type=shop_doc|free_doc|lesson_file&id=123&mode=view|download
  Biến môi trường: SUPABASE_URL, SUPABASE_SERVICE_KEY; ràng buộc R2: FILES.
  Đóng dấu tên người mua lên PDF khi WATERMARK = "1" (cần gói Workers Paid vì xử lý PDF tốn CPU).
*/
import { json, tokenOf, getUser, canAccess, secretOf, TYPES } from "../_lib/common.js";

function ascii(s) { return String(s || "").normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/đ/g, "d").replace(/Đ/g, "D").replace(/[^\x20-\x7E]/g, ""); }

async function stamp(bytes, label) {
  const { PDFDocument, StandardFonts, rgb, degrees } = await import("../_lib/pdf-lib.esm.min.js");
  const pdf = await PDFDocument.load(bytes, { ignoreEncryption: true });
  const font = await pdf.embedFont(StandardFonts.Helvetica);
  for (const page of pdf.getPages()) {
    const { width, height } = page.getSize();
    page.drawText(label, { x: 24, y: 14, size: 8, font, color: rgb(0.45, 0.45, 0.45) });
    page.drawText(label, { x: width * 0.18, y: height * 0.35, size: 18, font, color: rgb(0.6, 0.6, 0.6), opacity: 0.18, rotate: degrees(35) });
  }
  return pdf.save();
}

export async function onRequestGet({ request, env }) {
  if (!env.FILES) return json({ error: "Chưa cấu hình kho file (R2)." }, 503);
  const url = new URL(request.url);
  const type = url.searchParams.get("type"), id = url.searchParams.get("id"), mode = url.searchParams.get("mode") === "download" ? "attachment" : "inline";
  if (!TYPES.includes(type) || type === "shop_video") return json({ error: "Loại file không hợp lệ" }, 400);
  const token = tokenOf(request);
  if (!(await canAccess(env, token, type, id))) return json({ error: token ? "Bạn chưa có quyền mở tài liệu này." : "Cần đăng nhập." }, 403);
  const sec = await secretOf(env, type, id);
  if (!sec || !sec.storage_key) return json({ error: "Thầy chưa tải file lên cho tài liệu này." }, 404);
  const obj = await env.FILES.get(sec.storage_key);
  if (!obj) return json({ error: "Không tìm thấy file trong kho." }, 404);
  const headers = { "Content-Type": "application/pdf", "Cache-Control": "private, no-store", "Content-Disposition": `${mode}; filename="tai-lieu-${type}-${id}.pdf"` };
  if (env.WATERMARK === "1" && type !== "free_doc") {
    const u = await getUser(env, token);
    const label = ascii(`Hoa Hoc Thay Phong - ban cua: ${u && u.email || ""} - ${new Date().toISOString().slice(0, 10)}`);
    try { return new Response(await stamp(await obj.arrayBuffer(), label), { headers }); }
    catch (e) { return json({ error: "Không đóng dấu được file: " + e.message }, 500); }
  }
  return new Response(obj.body, { headers });
}
