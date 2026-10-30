// Sinh supabase/seed.sql từ dữ liệu mẫu trong site/app.js và site/baitap.js
const fs = require('fs'), vm = require('vm');
const app = fs.readFileSync(__dirname + '/../site/app.js', 'utf8');
function grab(name) { const i = app.indexOf('var ' + name + ' = '); let j = app.indexOf('\n  ];', i); if (name === 'COURSE') j = app.indexOf('\n  };', i); return vm.runInNewContext('(' + app.slice(app.indexOf('=', i) + 1, j + 4).replace(/;\s*$/, '') + ')'); }
const BASIC = grab('BASIC'), ADV = grab('ADV'), DOCS = grab('DOCS'), SHOP = grab('SHOP'), COURSE = grab('COURSE');
const ctx = { window: {} }; vm.runInNewContext(fs.readFileSync(__dirname + '/../site/baitap.js', 'utf8'), ctx);
const ESSAY = ctx.window.BAITAP_TL;
const q = s => s == null ? 'null' : "'" + String(s).replace(/'/g, "''") + "'";
const j = v => v == null ? 'null' : q(JSON.stringify(v)) + '::jsonb';
let out = ['-- Dữ liệu mẫu ban đầu (sinh tự động bởi tools/make-seed.js). Chạy một lần sau schema.sql.', 'begin;'];
function ex(level, kind, cat, title, stem, opts, imgs, ask, isNew, key) {
  out.push(`with e as (insert into exercises (level, category, kind, title, stem, options, images, ask, is_new) values (${q(level)}, ${q(cat)}, ${q(kind)}, ${q(title)}, ${q(stem)}, ${j(opts)}, ${j(imgs)}, ${q(ask)}, ${isNew ? 'true' : 'false'}) returning id)
insert into exercise_keys (exercise_id, answer, explain, short_answer, solution, answer_images) select id, ${key.answer == null ? 'null' : key.answer}, ${q(key.explain)}, ${q(key.short)}, ${j(key.solution)}, ${j(key.images)} from e;`);
}
BASIC.forEach(b => ex('basic', 'mcq', b.g, null, b.t, b.o, null, null, !!b.isNew, { answer: b.a, explain: b.e }));
ADV.forEach(a => ex('adv', 'mcq', a.g, null, a.t, a.o, null, null, !!a.isNew, { answer: a.a, short: a.ans, solution: a.s }));
ESSAY.forEach(e => ex('adv', 'essay', e.g || 'Chuỗi', 'Tổng hợp ' + e.name, e.text, null, e.de, 'xác định công thức cấu tạo các chất được đánh số trong sơ đồ.', true, { images: e.da }));
DOCS.forEach(d => out.push(`insert into free_docs (category, tag, title, pages, access) values (${q(d.cat)}, ${q(d.tag)}, ${q(d.title)}, ${d.pages}, ${q(d.acc)});`));
SHOP.forEach(d => {
  out.push(`with d as (insert into shop_docs (category, tag, title, pages, price, base_downloads) values (${q(d.cat)}, ${q(d.tag)}, ${q(d.title)}, ${d.pages}, ${d.price}, ${d.dl || 0}) returning id)
insert into shop_videos (doc_id, title, position) select d.id, v.t, v.p from d, (values ${(d.vids || ['__none__']).map((t, i) => `(${q(t)}, ${i})`).join(', ')}) as v(t, p) where v.t <> '__none__';`);
});
out.push(`insert into courses (name, description, meta) values (${q(COURSE.name)}, ${q(COURSE.desc)}, ${j(COURSE.meta)});`);
COURSE.lessons.forEach(l => {
  const [dd, mm, yy] = l.d.split('/');
  const files = l.docs.map(t => ['pdf', t]).concat(l.vids.map(t => ['video', t]));
  out.push(`with l as (insert into lessons (course_id, n, title, held_on) select id, ${l.n}, ${q(l.t)}, '${yy}-${mm}-${dd}' from courses where name = ${q(COURSE.name)} returning id)
insert into lesson_files (lesson_id, kind, title, position) select l.id, f.k, f.t, f.p from l, (values ${files.map((f, i) => `(${q(f[0])}, ${q(f[1])}, ${i})`).join(', ')}) as f(k, t, p);`);
});
out.push('commit;');
fs.writeFileSync(__dirname + '/../supabase/seed.sql', out.join('\n') + '\n');
console.log('BASIC', BASIC.length, 'ADV', ADV.length, 'ESSAY', ESSAY.length, 'DOCS', DOCS.length, 'SHOP', SHOP.length, 'LESSONS', COURSE.lessons.length);
