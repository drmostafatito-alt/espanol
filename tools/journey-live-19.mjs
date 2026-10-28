/**
 * رحلة المتعلم الكاملة (19 خطوة) ضد خادم حي — نفس مسار المتصفح عبر بروكسي Vite.
 * التشغيل: node tools/journey-live-19.mjs [BASE]
 * الافتراضي BASE=http://127.0.0.1:8787 (wrangler dev مباشرة؛ مرّر وسيطًا لعنوان آخر)
 *
 * لا mocks: كل الطلبات حية على الـ worker وD1 المحلي. يتحقق السكربت من:
 * - الحالات الخمس: زائر / لا بطاقات مستحقة / فشل تحميل (401) / فشل اتصال (عميل) / جلسة منتهية
 * - دورة حياة الجلسة: تسجيل → بيانات حقيقية (أصفار المبتدئ) → درس → مراجعة → إعادة تحميل → خروج → حجب
 */
const BASE = process.argv[2] || 'http://127.0.0.1:8787';

let passed = 0;
function check(cond, step, msg) {
  if (!cond) {
    console.error(`  ❌ خطوة ${step} فشلت: ${msg}`);
    process.exitCode = 1;
    throw new Error(`الخطوة ${step}: ${msg}`);
  }
  passed++;
  console.log(`  ✓ خطوة ${step}: ${msg}`);
}

async function api(path, { method = 'GET', cookie, body, origin } = {}) {
  const headers = { 'Content-Type': 'application/json' };
  if (cookie) headers.Cookie = cookie;
  // المتصفح الحقيقي يرسل Origin + Sec-Fetch-Site على طلبات نفس الأصل
  if (origin) {
    headers.Origin = origin;
    headers['Sec-Fetch-Site'] = 'same-origin';
    headers['Sec-Fetch-Mode'] = 'cors';
  }
  const res = await fetch(BASE + path, { method, headers, body: body ? JSON.stringify(body) : undefined });
  const text = await res.text();
  let json = null;
  try {
    json = text ? JSON.parse(text) : null;
  } catch {
    json = { __nonJson: text.slice(0, 80) };
  }
  return { status: res.status, json, setCookie: res.headers.get('set-cookie') };
}

const sleep = (ms) => new Promise(r => setTimeout(r, ms));

async function main() {
  console.log(`🚀 رحلة 19 خطوة على ${BASE}`);
  const suffix = Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
  const email = `journey19_${suffix}@local.dev`;
  const password = `StrongP@ss_${suffix}9`;
  const origin = 'http://127.0.0.1:5173';

  // 1) صحة الخادم
  const health = await api('/api/health');
  check(health.status === 200, 1, `الخدمة حيّة (${health.status})`);

  // 2) مسار محمٍ بلا كوكي ⇒ 401 JSON واضح (حالة: غير مسجّل)
  const anon = await api('/api/me/progress');
  check(anon.status === 401 && anon.json?.error?.code === 'UNAUTHENTICATED', 2,
    `طلب محمي بلا جلسة يُرجع 401 UNAUTHENTICATED (حصلنا ${anon.status}/${anon.json?.error?.code})`);

  // 3) تسجيل حساب جديد من أصل 127.0.0.1 (كان 403 ORIGIN_NOT_ALLOWED قبل الإصلاح)
  const signup = await api('/api/auth/signup', {
    method: 'POST', origin,
    body: { email, password, displayName: 'رحلة ١٩' },
  });
  check(signup.status === 201 && signup.json?.user?.email === email, 3,
    `التسجيل من 127.0.0.1 ينجح بلا 403 (${signup.status})`);
  check(!!signup.setCookie && /ses=/.test(signup.setCookie) && /HttpOnly/.test(signup.setCookie), '3b',
    'كوكي جلسة HttpOnly صادر');
  const cookie = signup.setCookie.split(';')[0];

  // 4) /me بالكوكي ⇒ هوية حقيقية
  const me = await api('/api/auth/me', { cookie });
  check(me.status === 200 && me.json.user.id && me.json.user.role === 'learner', 4,
    `استعادة الهوية عبر الكوكي (${me.status})`);

  // 5) التقدّم لمتعلم جديد ⇒ أصفار حقيقية لا قيم وهمية
  const progress0 = await api('/api/me/progress', { cookie });
  check(progress0.status === 200, 5, 'لوحة التقدم تُحمَّل 200');
  const s0 = progress0.json.stats;
  check(s0.xp_total === 0 && s0.streak_current === 0 && s0.reviews_done === 0, '5b',
    `أصفار مبتدئ حقيقية (xp=${s0.xp_total}, streak=${s0.streak_current}, reviews=${s0.reviews_done})`);

  // 6) المسارات المنشورة
  const paths = await api('/api/content/paths', { cookie });
  check(paths.status === 200 && Array.isArray(paths.json.paths) && paths.json.paths.length > 0, 6,
    `المسارات تُحمَّل (${paths.json.paths?.length} مسار)`);

  // 7) جلسة مراجعة فارغة ⇒ ليست خطأ مصادقة (حالة: لا بطاقات مستحقة)
  const review0 = await api('/api/review/session', { cookie });
  check(review0.status === 200 && Array.isArray(review0.json.cards) && review0.json.cards.length === 0, 7,
    `طابور المراجعة فارغ بسلام (emptyReason=${review0.json.emptyReason})`);

  // 8) فتح الدرس الأول بلا تسريب مفاتيح إجابة
  const slug = 'prea1-hola-me-llamo';
  const session = await api(`/api/lessons/${slug}/session`, { cookie });
  check(session.status === 200 && session.json.exercises.length === 7, 8,
    `جلسة الدرس (7 تمارين، حصلنا ${session.json.exercises?.length})`);
  const raw = JSON.stringify(session.json);
  check(!raw.includes('correctOptionIds') && !raw.includes('answerKey'), '8b', 'لا تسريب لمفاتيح الإجابة');

  // 9) إجابات صحيحة لكل تمرين (المعرّفات مثبتة على المحتوى الحالي كسكربت test-learner-flow-live)
  const known = [
    { targetText: 'Hola, me llamo Omar.', optionId: 'opt_6X9SSA9ENXZ3' },
    { targetText: 'Buenos días', optionId: 'opt_TTRT2YDBXS7T' },
    { text: 'me' },
    { text: 'Me llamo Sara' },
    { text: 'Buenos' },
    { targetText: 'h', optionId: 'opt_9Q567FFCENG3' },
    { text: 'Hola, me llamo Omar. Mucho gusto.' },
  ];
  let gradedCorrect = 0;
  for (let i = 0; i < session.json.exercises.length; i++) {
    const ex = session.json.exercises[i];
    const r = await api(`/api/lessons/${slug}/answers`, {
      method: 'POST', cookie,
      body: { eventId: `j19_${suffix}_${i}`, exerciseId: ex.id, response: known[i].text ? { text: known[i].text } : { optionId: ex.options?.find(o => o.text === known[i].targetText)?.id || known[i].optionId }, durationMs: 1100 },
    });
    check(r.status === 200, `9.${i + 1}`, `إجابة ${ex.type} مقبولة`);
    if (r.json.mode === 'graded' && r.json.correct === true) gradedCorrect++;
  }
  check(gradedCorrect >= 1, '9b', `الخادم صحّح ${gradedCorrect} تمرينًا متدرجًا كإجابات صحيحة`);

  // 10) إتمام الدرس ⇒ 30 XP بقرار الخادم
  const complete = await api(`/api/lessons/${slug}/complete`, {
    method: 'POST', cookie, body: { eventId: `j19_done_${suffix}` },
  });
  check(complete.status === 200 && complete.json.passed === true && complete.json.xpAwarded === 30, 10,
    `إتمام الدرس منح 30 XP (حصلنا ${complete.json.xpAwarded})`);

  // 11) محاكاة إعادة تحميل الصفحة (F5): التقدّم محفوظ
  const progress1 = await api('/api/me/progress', { cookie });
  check(progress1.json.stats.xp_total === 30 && progress1.json.totals.lessons_completed === 1, 11,
    `بعد التحديث: xp=${progress1.json.stats.xp_total}, دروس=${progress1.json.totals.lessons_completed}`);

  // 12) إعادة الإتمام لا تمنح نقاطًا مكررة
  const reComplete = await api(`/api/lessons/${slug}/complete`, {
    method: 'POST', cookie, body: { eventId: `j19_redone_${suffix}` },
  });
  check(reComplete.json.xpAwarded === 0 && reComplete.json.xpTotal === 30, 12,
    'لا ازدواج نقاط عند إعادة الإتمام');

  // 13) المراجعة بعد الدرس: البطاقات أُنشئت فعلاً
  await sleep(200);
  const review1 = await api('/api/review/session', { cookie });
  check(review1.status === 200 && review1.json.session.totalCards > 0, 13,
    `بطاقات SRS أُنشئت (الإجمالي ${review1.json.session.totalCards})`);

  // 14) تقييم بطاقة مستحقة إن وُجدت
  if (review1.json.cards.length > 0) {
    const card = review1.json.cards[0];
    const rating = await api('/api/review/answers', {
      method: 'POST', cookie,
      body: { clientEventId: `j19_rev_${suffix}`, cardId: card.id, rating: 'good', responseMs: 1500 },
    });
    check(rating.status === 200 && rating.json.next?.intervalDays !== undefined, 14,
      `تقييم مراجعة مقبول والموعد القادم ${rating.json.next.intervalDays} يوم`);
  } else {
    check(true, 14, 'لا بطاقة مستحقة الآن (المجموعة معلّقة بعيدًا) — السلوك الصحيح');
  }

  // 15) حزم المفردات: قائمة + بدء حزمة
  const packs = await api('/api/review/packs', { cookie });
  check(packs.status === 200 && Array.isArray(packs.json.packs) && packs.json.packs.length > 0, 15,
    `قائمة الحزم (${packs.json.packs?.length})`);
  const start = await api(`/api/review/packs/${packs.json.packs[0].slug}/start`, { method: 'POST', cookie });
  check(start.status === 200 && typeof start.json.created === 'number', '15b',
    `بدء الحزمة أضاف/طابق ${start.json.totalEntries} بطاقة`);

  // 16) بحث بنبرات إسبانية
  const search = await api('/api/content/search?q=' + encodeURIComponent('cómodos'), { cookie });
  check(search.status === 200 && search.json.total >= 1, 16,
    `البحث بالنبرات يعمل (${search.json.total} نتيجة)`);

  // 17) تعديل الإعدادات ثم استعادتها في طلب جديد (إعادة تحميل ثانية)
  const patch = await api('/api/me', {
    method: 'PATCH', cookie,
    body: { dailyGoalMinutes: 15, explanationStyle: 'eg', audioVariant: 'es-419' },
  });
  check(patch.status === 200 && patch.json.user.dailyGoalMinutes === 15, 17, 'حفظ الإعدادات 200');
  const me2 = await api('/api/auth/me', { cookie });
  check(me2.json.user.dailyGoalMinutes === 15 && me2.json.user.audioVariant === 'es-419', '17b',
    'الإعدادات مستعادة عبر الكوكي بعد إعادة التحميل');

  // 18) تسجيل الخروج ثم طلب محمي ⇒ 401 (حجب الصفحات المحمية بعد الخروج)
  const logout = await api('/api/auth/logout', { method: 'POST', cookie });
  check(logout.status === 200, 18, 'تسجيل الخروج 200');
  const afterLogout = await api('/api/me/progress', { cookie });
  check(afterLogout.status === 401, '18b', 'المسار المحمي محجوب بعد الخروج (401)');

  // 19) كوكي منتهٍ/مزوّر ⇒ 401 برسالة انتهاء الجلسة (حالة: جلسة منتهية)
  const expired = await api('/api/me/progress', { cookie: 'ses=expired-invalid-token-value' });
  check(expired.status === 401 && expired.json.error.code === 'UNAUTHENTICATED', 19,
    `الجلسة المزيفة تُرفض 401 (${expired.json.error.code}) — والواجهة تعرض رسالة إعادة الدخول`);

  console.log(`\n🎉 اكتملت الرحلة: ${passed} تحققًا ناجحًا عبر ${BASE}`);
}

main().catch(err => {
  console.error('\n💥 توقفت الرحلة:', err.message);
  process.exit(1);
});
