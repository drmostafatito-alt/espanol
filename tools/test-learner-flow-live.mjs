/**
 * ============================================================================
 * اختبار عملي حي لمسار المتعلم والبحث الذكي بالتشكيل
 * ============================================================================
 * يختبر على خادم التطوير الحي (http://127.0.0.1:8787):
 *   1. تسجيل حساب محلي جديد.
 *   2. التحقق من رصيد البداية (0 XP، 0 دروس مكتملة).
 *   3. فتح درس مستورد (prea1-hola-me-llamo) والتأكد من عدم تسريب الإجابات.
 *   4. إرسال إجابات التمارين وتصحيحها على الخادم.
 *   5. إتمام الدرس واحتساب 30 XP.
 *   6. استعادة الجلسة (محاكاة F5 وتحديث الصفحة) والتحقق من حفظ التقدم ونقاط XP.
 *   7. منع تكرار منح XP عند إعادة الإتمام.
 *   8. البحث بكلمات إسبانية ذات نبرات وتشكيل (cómodos, cuánto, está, días, adiós).
 *   9. فتح درس فعلي من نتائج البحث (a1-colores-ropa) وتحميل تمارينه الستة بنجاح.
 */

const BASE = 'http://127.0.0.1:8787';

function assert(condition, message) {
  if (!condition) {
    console.error(`❌ فشل التحقق: ${message}`);
    process.exit(1);
  }
}

async function run() {
  console.log('🚀 بدء الاختبار العملي لمسار المتعلم والبحث الذكي على', BASE);

  // 1. تسجيل حساب محلي جديد
  const uniqueSuffix = Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
  const email = `learner_${uniqueSuffix}@local.dev`;
  const password = `StrongP@ssw0rd_${uniqueSuffix}!`;
  const name = `متعلم تجريبي ${uniqueSuffix}`;

  console.log(`\n1️⃣ تسجيل حساب محلي جديد: ${email}`);
  const signupRes = await fetch(`${BASE}/api/auth/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password, name }),
  });
  assert(signupRes.status === 201, `كود حالة التسجيل ${signupRes.status} (المتوقع 201)`);
  const signupData = await signupRes.json();
  assert(signupData.user && signupData.user.email === email, 'بيانات المستخدم المسجل صحيحة');

  const cookieHeader = signupRes.headers.get('set-cookie');
  assert(cookieHeader, 'استلام كوكي الجلسة');
  const sessionCookie = cookieHeader.split(';')[0];
  console.log('✅ تم تسجيل الحساب بنجاح وتم إنشاء جلسة مشفرة.');

  // 2. التحقق من رصيد البداية
  console.log('\n2️⃣ التحقق من رصيد البداية للمتعلم الجديد');
  const meRes = await fetch(`${BASE}/api/auth/me`, {
    headers: { Cookie: sessionCookie },
  });
  assert(meRes.status === 200, 'استرداد بيانات المستخدم الحالي');
  const meData = await meRes.json();
  assert(meData.user.email === email, 'البريد الإلكتروني يطابق المستخدم المسجل');

  const progressRes = await fetch(`${BASE}/api/me/progress`, {
    headers: { Cookie: sessionCookie },
  });
  assert(progressRes.status === 200, 'استرداد لوحة التقدم المبدئية');
  const initialProgress = await progressRes.json();
  assert(initialProgress.stats.xp_total === 0, `XP المبدئي هو ${initialProgress.stats.xp_total} (المتوقع 0)`);
  assert(initialProgress.totals.lessons_completed === 0, `عدد الدروس المكتملة المبدئي = ${initialProgress.totals.lessons_completed} (المتوقع 0)`);
  console.log('✅ رصيد البداية نظيف ومعزول: 0 XP و0 دروس مكتملة.');

  // 3. فتح درس مستورد
  const lessonSlug = 'prea1-hola-me-llamo';
  console.log(`\n3️⃣ فتح جلسة الدرس المستورد: ${lessonSlug}`);
  const sessionRes = await fetch(`${BASE}/api/lessons/${lessonSlug}/session`, {
    headers: { Cookie: sessionCookie },
  });
  assert(sessionRes.status === 200, `كود حالة جلسة الدرس ${sessionRes.status}`);
  const sessionData = await sessionRes.json();
  assert(sessionData.lesson.slug === lessonSlug, 'الدرس المسترجع يطابق المعرف');
  assert(sessionData.lesson.provenance?.status === 'unreviewed_sample', 'الدرس موسوم كعينة تجريبية بأمانة');
  assert(Array.isArray(sessionData.exercises) && sessionData.exercises.length === 7, `عدد التمارين = ${sessionData.exercises?.length} (المتوقع 7)`);

  // فحص عدم تسريب الإجابات في payload العميل
  const rawPayload = JSON.stringify(sessionData);
  assert(!rawPayload.includes('correctOptionIds'), 'عدم تسريب correctOptionIds في استجابة الجلسة');
  assert(!rawPayload.includes('is_correct'), 'عدم تسريب is_correct في استجابة الجلسة');
  console.log('✅ تم تحميل 7 تمارين فعلية مع إخفاء تام لمفاتيح الإجابة عن العميل.');

  // 4. إرسال إجابات التمارين وتصحيحها على الخادم
  console.log('\n4️⃣ حل التمارين وإرسال الإجابات للتصحيح على الخادم');
  const knownAnswers = [
    { exIdx: 0, targetText: 'Hola, me llamo Omar.', fallbackId: 'opt_6X9SSA9ENXZ3' },
    { exIdx: 1, targetText: 'Buenos días', fallbackId: 'opt_TTRT2YDBXS7T' },
    { exIdx: 2, response: { text: 'me' } },
    { exIdx: 3, response: { text: 'Me llamo Sara' } },
    { exIdx: 4, response: { text: 'Buenos' } },
    { exIdx: 5, targetText: 'h', fallbackId: 'opt_9Q567FFCENG3' },
    { exIdx: 6, response: { text: 'Hola, me llamo Omar. Mucho gusto.' } },
  ];

  for (let i = 0; i < sessionData.exercises.length; i++) {
    const ex = sessionData.exercises[i];
    const ans = knownAnswers[i];
    const eventId = `evt_attempt_${i}_${uniqueSuffix}`;
    const attemptRes = await fetch(`${BASE}/api/lessons/${lessonSlug}/answers`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Cookie: sessionCookie },
      body: JSON.stringify({
        eventId,
        exerciseId: ex.id,
        response: ans.response || { optionId: ex.options?.find(o => o.text === ans.targetText)?.id || ans.fallbackId },
        durationMs: 1200,
      }),
    });
    assert(attemptRes.status === 200, `كود حالة التمرين ${i + 1}: ${attemptRes.status}`);
    const attemptData = await attemptRes.json();
    if (attemptData.mode === 'graded') {
      assert(attemptData.correct === true, `إجابة التمرين ${i + 1} (${ex.type}) صحيحة`);
    } else {
      assert(attemptData.mode === 'participation', `التمرين ${i + 1} (${ex.type}) من نوع مشاركة`);
    }
    assert(attemptData.explanationAr && attemptData.explanationAr.length > 5, 'وجود شرح عربي مفيد للتمرين');
  }
  console.log('✅ تم حل وتصحيح جميع التمارين بنجاح على الخادم.');

  // 5. إتمام الدرس واحتساب XP
  console.log('\n5️⃣ إتمام الدرس واحتساب النقاط على الخادم');
  const completeEventId = `evt_complete_${uniqueSuffix}`;
  const completeRes = await fetch(`${BASE}/api/lessons/${lessonSlug}/complete`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Cookie: sessionCookie },
    body: JSON.stringify({ eventId: completeEventId }),
  });
  assert(completeRes.status === 200, `كود حالة إتمام الدرس ${completeRes.status}`);
  const completeData = await completeRes.json();
  assert(completeData.passed === true, 'تأكيد اجتياز الدرس واستيفاء شروط الإتقان');
  assert(completeData.xpAwarded === 30, `منح 30 XP (الفعلي ${completeData.xpAwarded})`);
  assert(completeData.xpTotal === 30, `إجمالي XP = 30 (الفعلي ${completeData.xpTotal})`);
  console.log('✅ تم إكمال الدرس ومُنح المتعلم 30 XP بنجاح.');

  // 6. استعادة الجلسة (محاكاة تحديث الصفحة F5)
  console.log('\n6️⃣ محاكاة تحديث الصفحة F5 واستعادة التقدم المحفوظ');
  const reloadRes = await fetch(`${BASE}/api/me/progress`, {
    headers: { Cookie: sessionCookie },
  });
  assert(reloadRes.status === 200, 'استرداد لوحة التقدم بعد التحديث');
  const reloadData = await reloadRes.json();
  assert(reloadData.stats.xp_total === 30, `XP بعد التحديث محفوظ بدقة: ${reloadData.stats.xp_total}`);
  assert(reloadData.totals.lessons_completed === 1, `الدروس المكتملة بعد التحديث: ${reloadData.totals.lessons_completed}`);
  const completedLesson = reloadData.lessons.find(l => l.slug === lessonSlug);
  assert(completedLesson && completedLesson.progress_status === 'completed', 'الدرس مسجل كـ completed في لوحة التقدم');
  console.log('✅ تم استعادة التقدم بدقة بعد تحديث الصفحة: XP=30 والدروس المكتملة=1.');

  // 7. التحقق من عدم مضاعفة النقاط عند إعادة الإتمام
  console.log('\n7️⃣ التحقق من الحماية ضد تكرار النقاط عند إعادة الإتمام');
  const reCompleteRes = await fetch(`${BASE}/api/lessons/${lessonSlug}/complete`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Cookie: sessionCookie },
    body: JSON.stringify({ eventId: `evt_recomplete_${uniqueSuffix}` }),
  });
  const reCompleteData = await reCompleteRes.json();
  assert(reCompleteData.xpAwarded === 0, `إعادة الإتمام لا تمنح نقاطًا إضافية (الفعلي ${reCompleteData.xpAwarded})`);
  assert(reCompleteData.xpTotal === 30, `رصيد XP ثابت عند 30 (الفعلي ${reCompleteData.xpTotal})`);
  console.log('✅ الحماية تعمل بصرامة: إعادة الدرس لا تمنح نقاطًا احتيالية.');

  // 8. البحث بكلمات إسبانية بها نبرات وتشكيل
  console.log('\n8️⃣ اختبار البحث الذكي بكلمات إسبانية ذات نبرات وتشكيل');
  const searchTests = [
    { query: 'cómodos', expectedSlug: 'a1-colores-ropa', minResults: 1 },
    { query: 'comodos', expectedSlug: 'a1-colores-ropa', minResults: 1 },
    { query: 'cuánto', expectedSlug: 'a1-comprar', minResults: 1 },
    { query: 'cuanto', expectedSlug: 'a1-comprar', minResults: 1 },
    { query: 'está', expectedKind: 'verb_form', minResults: 1 },
    { query: 'adiós', expectedKind: 'vocab', minResults: 1 },
  ];

  for (const st of searchTests) {
    const sRes = await fetch(`${BASE}/api/content/search?q=${encodeURIComponent(st.query)}`);
    assert(sRes.status === 200, `كود بحث ${st.query}: ${sRes.status}`);
    const sData = await sRes.json();
    assert(sData.total >= st.minResults, `نتائج البحث لـ ${st.query} >= ${st.minResults}`);
    if (st.expectedSlug) {
      const foundLesson = sData.results.find(r => r.url === `/learn/${st.expectedSlug}`);
      assert(foundLesson, `العثور على الدرس ${st.expectedSlug} في نتائج بحث «${st.query}»`);
    }
    console.log(`   - بحث «${st.query}»: ${sData.total} نتيجة | النتيجة الأولى: «${sData.results[0]?.title}» (${sData.results[0]?.matchReasonAr})`);
  }
  console.log('✅ البحث الذكي يتعامل بسلاسة مع النبرات والتجريد من التشكيل.');

  // 9. فتح درس فعلي من نتائج البحث (a1-colores-ropa)
  console.log('\n9️⃣ فتح درس فعلي مرتبط بنتيجة البحث: /learn/a1-colores-ropa');
  const targetLessonSlug = 'a1-colores-ropa';
  const targetSessionRes = await fetch(`${BASE}/api/lessons/${targetLessonSlug}/session`, {
    headers: { Cookie: sessionCookie },
  });
  assert(targetSessionRes.status === 200, `كود حالة الدرس الناتج عن البحث ${targetSessionRes.status}`);
  const targetData = await targetSessionRes.json();
  assert(targetData.lesson.slug === targetLessonSlug, 'تطابق معرف الدرس');
  assert(targetData.exercises.length === 6, `عدد تمارين الدرس المفتوح من البحث = ${targetData.exercises.length} (المتوقع 6)`);
  console.log(`✅ تم فتح الدرس المستهدف «${targetData.lesson.titleAr}» (${targetData.exercises.length} تمارين) بنجاح.`);

  console.log('\n🎉 اكتمل الاختبار العملي الحي بنجاح تام 100%!');
}

run().catch(err => {
  console.error('\n💥 خطأ غير متوقع أثناء الاختبار العملي:', err);
  process.exit(1);
});
