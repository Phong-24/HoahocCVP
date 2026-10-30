/*
  Nhận thông báo tiền vào từ SePay và mở quyền cho đơn hàng tương ứng.
  Biến môi trường (Cloudflare Pages → Settings → Variables and Secrets):
    SUPABASE_URL               https://xxxx.supabase.co
    SUPABASE_SERVICE_KEY       khóa bí mật của Supabase (sb_secret_... hoặc service_role) – loại Secret
    SEPAY_API_KEY              API Key đặt khi tạo webhook trên SePay – loại Secret
    (tùy chọn) SEPAY_HMAC_SECRET  nếu dùng xác thực HMAC-SHA256
*/
const json = (obj, status = 200) => new Response(JSON.stringify(obj), { status, headers: { "Content-Type": "application/json" } });

function safeEqual(a, b) {
  a = String(a || ""); b = String(b || "");
  let diff = a.length ^ b.length;
  for (let i = 0; i < Math.max(a.length, b.length); i++) diff |= (a.charCodeAt(i) || 0) ^ (b.charCodeAt(i) || 0);
  return diff === 0;
}

async function hmacOk(raw, headers, secret) {
  const ts = headers.get("X-SePay-Timestamp") || "", sig = headers.get("X-SePay-Signature") || "";
  if (!/^\d+$/.test(ts) || Math.abs(Date.now() / 1000 - Number(ts)) > 300) return false;
  const key = await crypto.subtle.importKey("raw", new TextEncoder().encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  const mac = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(ts + "." + raw));
  const hex = [...new Uint8Array(mac)].map(b => b.toString(16).padStart(2, "0")).join("");
  return safeEqual("sha256=" + hex, sig);
}

export function findOrderCode(d) {
  const text = [d.code, d.content, d.description].filter(Boolean).join(" ").toUpperCase().replace(/[\s.\-_]/g, "");
  const m = text.match(/HHTP\d{6}/);
  return m ? m[0] : null;
}

async function supa(env, path, body, extraHeaders) {
  const key = env.SUPABASE_SERVICE_KEY;
  const headers = { apikey: key, "Content-Type": "application/json", ...(extraHeaders || {}) };
  if (key.startsWith("eyJ")) headers.Authorization = "Bearer " + key;
  return fetch(env.SUPABASE_URL.replace(/\/$/, "") + path, { method: "POST", headers, body: JSON.stringify(body) });
}

export async function onRequestPost({ request, env }) {
  if (!env.SUPABASE_URL || !env.SUPABASE_SERVICE_KEY) return json({ success: false, error: "missing config" }, 500);
  const raw = await request.text();
  let ok = false;
  if (env.SEPAY_API_KEY) ok = safeEqual(request.headers.get("Authorization"), "Apikey " + env.SEPAY_API_KEY);
  if (!ok && env.SEPAY_HMAC_SECRET) ok = await hmacOk(raw, request.headers, env.SEPAY_HMAC_SECRET);
  if (!ok) return json({ success: false, error: "unauthorized" }, 401);

  let d;
  try { d = JSON.parse(raw); } catch (e) { return json({ success: false, error: "bad json" }, 400); }

  const code = d.transferType === "in" ? findOrderCode(d) : null;
  let result = d.transferType === "in" ? "no_code" : "ignored_out";
  if (code) {
    const r = await supa(env, "/rest/v1/rpc/fulfill_order", { p_code: code, p_amount: Number(d.transferAmount) || 0, p_bank_ref: String(d.referenceCode || d.id || "") });
    if (!r.ok) return json({ success: false, error: "db " + r.status }, 500); // SePay sẽ gửi lại
    result = await r.json();
  }
  await supa(env, "/rest/v1/payment_events", { sepay_id: d.id || null, order_code: code, amount: Number(d.transferAmount) || 0, result: String(result), payload: d },
    { Prefer: "resolution=ignore-duplicates,return=minimal" }).catch(() => {});
  return json({ success: true });
}

export function onRequestGet() { return json({ ok: true, info: "SePay webhook endpoint" }); }
