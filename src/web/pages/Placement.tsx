import { useState } from 'react';
import { api } from '../api';
import { useAuth } from '../state';
import { Icon, LevelBadge, ProgressBar } from '../components/ui';
import { TopicScene, CartoonScene, cartoonForQuestion } from '../components/Illustrations';

interface Question {
  id: number;
  level: 'PREA1' | 'A1' | 'A2';
  promptAr: string;
  stemEs?: string;
  options: { id: string; text: string; correct: boolean }[];
  explanationAr: string;
}

const QUESTIONS: Question[] = [
  // المرحلة الأولى: التمهيد وأساسيات البداية (Pre-A1)
  {
    id: 1,
    level: 'PREA1',
    promptAr: 'ما هي التحية المناسبة في الصباح بالإسبانية؟',
    options: [
      { id: 'a', text: 'Buenos días', correct: true },
      { id: 'b', text: 'Buenas noches', correct: false },
      { id: 'c', text: 'Hasta luego', correct: false },
      { id: 'd', text: 'Por favor', correct: false },
    ],
    explanationAr: 'Buenos días تعني «صباح الخير»، بينما Buenas noches للمساء والليل، وHasta luego تعني «إلى اللقاء».',
  },
  {
    id: 2,
    level: 'PREA1',
    promptAr: 'اختر الرد المناسب على السؤال: «¿Cómo te llamas?» (ما اسمك؟)',
    options: [
      { id: 'a', text: 'Me llamo Omar', correct: true },
      { id: 'b', text: 'Tengo treinta años', correct: false },
      { id: 'c', text: 'Soy de El Cairo', correct: false },
      { id: 'd', text: 'Muy bien, gracias', correct: false },
    ],
    explanationAr: 'Me llamo… هو التعبير الطبيعي لذكر الاسم (اسمي عمر).',
  },
  {
    id: 3,
    level: 'PREA1',
    promptAr: 'ما هو الترتيب الصحيح للأرقام: 1، 2، 3 بالإسبانية؟',
    options: [
      { id: 'a', text: 'uno, dos, tres', correct: true },
      { id: 'b', text: 'tres, dos, uno', correct: false },
      { id: 'c', text: 'cuatro, cinco, seis', correct: false },
      { id: 'd', text: 'primero, segundo, tercero', correct: false },
    ],
    explanationAr: 'uno = واحد، dos = اثنان، tres = ثلاثة.',
  },

  // المرحلة الثانية: المستوى التأسيسي (A1)
  {
    id: 4,
    level: 'A1',
    promptAr: 'أكمل الجملة بأداة التعريف المناسبة: «____ casa es grande.» (المنزل كبير)',
    options: [
      { id: 'a', text: 'La', correct: true },
      { id: 'b', text: 'El', correct: false },
      { id: 'c', text: 'Los', correct: false },
      { id: 'd', text: 'Un', correct: false },
    ],
    explanationAr: 'كلمة casa اسم مؤنث مفرد ينتهي بـ a، لذا تأخذ أداة التعريف المؤنثة La.',
  },
  {
    id: 5,
    level: 'A1',
    promptAr: 'اختر التصريف الصحيح للفعل Hablar مع الضمير Yo (أنا أتكلم الإسبانية):',
    stemEs: 'Yo ____ español todos los días.',
    options: [
      { id: 'a', text: 'hablo', correct: true },
      { id: 'b', text: 'hablas', correct: false },
      { id: 'c', text: 'habla', correct: false },
      { id: 'd', text: 'hablamos', correct: false },
    ],
    explanationAr: 'في المضارع البسيط، تصريف أفعال المجموعة الأولى مع Yo ينتهي بـ -o: Yo hablo.',
  },
  {
    id: 6,
    level: 'A1',
    promptAr: 'للإخبار عن مكان تواجدك الحالي، أي فعل تختار؟ «أنا في المكتب الآن»:',
    options: [
      { id: 'a', text: 'Estoy en la oficina ahora', correct: true },
      { id: 'b', text: 'Soy en la oficina ahora', correct: false },
      { id: 'c', text: 'Tengo en la oficina ahora', correct: false },
      { id: 'd', text: 'Hago en la oficina ahora', correct: false },
    ],
    explanationAr: 'الفعل Estar يُستخدم للموقع والحالة المؤقتة (Estoy en… = أنا في مكان كذا). الفعل Ser للسمات الدائمة والهوية.',
  },
  {
    id: 7,
    level: 'A1',
    promptAr: 'في المطعم، كيف تطلب كوب ماء بأسلوب مهذب؟',
    options: [
      { id: 'a', text: 'Un vaso de agua, por favor', correct: true },
      { id: 'b', text: 'Quiero agua ahora mismo', correct: false },
      { id: 'c', text: 'De nada, un vaso', correct: false },
      { id: 'd', text: '¿Dónde está la cuenta?', correct: false },
    ],
    explanationAr: '«Un vaso de agua, por favor» هو الأسلوب اليومي المهذب والقياسي للطلب.',
  },

  // المرحلة الثالثة: المستوى المتوسط الأساسي (A2)
  {
    id: 8,
    level: 'A2',
    promptAr: 'اختر الجملة الصحيحة مع فعل الإعجاب Gustar (يعجبني هذا الكتاب):',
    options: [
      { id: 'a', text: 'Me gusta este libro', correct: true },
      { id: 'b', text: 'Yo gusto este libro', correct: false },
      { id: 'c', text: 'Me gustan este libro', correct: false },
      { id: 'd', text: 'A mí gusto este libro', correct: false },
    ],
    explanationAr: 'الفعل Gustar يُطابق الشيء المُعجَب به؛ بما أن este libro مفرد، فالصيغة هي gusta مع ضمير المفعول me.',
  },
  {
    id: 9,
    level: 'A2',
    promptAr: 'اختر صيغة الماضي البسيط (Pretérito Indefinido) لجملة «أمس ذهبتُ إلى السينما»:',
    stemEs: 'Ayer ____ al cine con mis amigos.',
    options: [
      { id: 'a', text: 'fui', correct: true },
      { id: 'b', text: 'voy', correct: false },
      { id: 'c', text: 'iba', correct: false },
      { id: 'd', text: 'he ido', correct: false },
    ],
    explanationAr: 'الفعل Ir في الماضي البسيط المكتمل مع Yo هو fui (ذهبتُ).',
  },
  {
    id: 10,
    level: 'A2',
    promptAr: 'ما معنى الجملة الإسبانية: «¿Cuánto tiempo hace que vives en Madrid?»',
    options: [
      { id: 'a', text: 'منذ متى وأنت تعيش في مدريد؟', correct: true },
      { id: 'b', text: 'كم تكلفة العيش في مدريد؟', correct: false },
      { id: 'c', text: 'هل تفضل العيش في مدريد؟', correct: false },
      { id: 'd', text: 'متى ستسافر إلى مدريد؟', correct: false },
    ],
    explanationAr: 'التركيب «¿Cuánto tiempo hace que + فعل في المضارع؟» يُستخدم للسؤال عن مدة استمرار حدث بدأ في الماضي وما زال قائمًا.',
  },
];

export function Placement({ navigate }: { navigate: (to: string) => void }) {
  const { user } = useAuth();
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<{
    passed: boolean;
    score: number;
    unlockedLevel: string;
    xpAwarded: number;
    messageAr: string;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);

  if (!user) {
    return (
      <div className="container" style={{ maxWidth: 640 }}>
        <div className="card" style={{ textAlign: 'center' }}>
          <Icon name="lock" size={32} label="تسجيل الدخول مطلوب" />
          <h2>تسجيل الدخول مطلوب</h2>
          <p className="muted">يرجى تسجيل الدخول أو إنشاء حساب لحفظ نتيجتك وفتح المستويات تلقائيًا.</p>
          <button className="btn" onClick={() => navigate('/login')}>تسجيل الدخول</button>
        </div>
      </div>
    );
  }

  const current = QUESTIONS[index];
  if (!current) return null;
  const selectedOptionId = answers[current.id];

  const handleSelect = (optionId: string) => {
    if (result) return;
    setAnswers(prev => ({ ...prev, [current.id]: optionId }));
  };

  const handleNext = () => {
    if (index + 1 < QUESTIONS.length) {
      setIndex(i => i + 1);
    }
  };

  const handlePrev = () => {
    if (index > 0) {
      setIndex(i => i - 1);
    }
  };

  const handleFinish = async () => {
    setSubmitting(true);
    setError(null);

    // حساب الدرجة الفعلية
    let correctCount = 0;
    for (const q of QUESTIONS) {
      const chosenId = answers[q.id];
      const correctOption = q.options.find(o => o.correct);
      if (chosenId && correctOption && chosenId === correctOption.id) {
        correctCount++;
      }
    }

    const scorePct = Math.round((correctCount / QUESTIONS.length) * 100);
    // إذا أحرز 70% أو أكثر يستحق تخطي Pre-A1 وفتح A1
    // إذا أحرز 90% أو أكثر يمكنه فتح A2
    const targetLevel = scorePct >= 80 ? 'A2' : 'A1';

    try {
      const res = await api.submitPlacement({
        targetLevel,
        answers,
        score: scorePct,
        answersCount: Object.keys(answers).length,
      });
      setResult({
        passed: res.passed,
        score: res.score,
        unlockedLevel: res.unlockedLevel,
        xpAwarded: res.xpAwarded,
        messageAr: res.messageAr,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'تعذّر إرسال نتيجة الاختبار.');
    } finally {
      setSubmitting(false);
    }
  };

  if (result) {
    return (
      <div className="container" style={{ maxWidth: 680 }}>
        <div className="card" style={{ textAlign: 'center' }}>
          <div style={{ width: 190, maxWidth: '100%', margin: '0 auto var(--s-2)' }}>
            <CartoonScene cartoon={result.passed ? 'trophy' : 'study'} label={result.passed ? 'كأس اجتياز اختبار تحديد المستوى' : 'طالب يراجع للمحاولة التالية'} />
          </div>
          <Icon name={result.passed ? 'checkCircle' : 'book'} size={40} label={result.passed ? 'تم الاجتياز' : 'نتيجة الاختبار'} />
          <h1 style={{ marginBottom: 'var(--s-1)' }}>نتيجة اختبار تحديد المستوى</h1>
          <p className="lead" style={{ margin: 'var(--s-2) 0' }}>
            نسبة الإجابات الصحيحة: <strong className="num">{result.score}%</strong>
          </p>

          <div
            className={`card feedback ${result.passed ? 'ok' : 'neutral'}`}
            style={{ textAlign: 'right', margin: 'var(--s-3) 0' }}
          >
            <strong>المستوى الموصى به: {result.unlockedLevel}</strong>
            <p style={{ margin: 'var(--s-1) 0 0' }}>{result.messageAr}</p>
            {result.xpAwarded > 0 && (
              <p className="small" style={{ color: 'var(--c-primary-strong)', margin: 'var(--s-1) 0 0' }}>
                <Icon name="star" size={16} /> تمت إضافة <strong>+{result.xpAwarded} XP</strong> إلى رصيدك كمكافأة على اجتياز التقييم!
              </p>
            )}
          </div>

          <div className="row" style={{ justifyContent: 'center', gap: 'var(--s-2)', marginTop: 'var(--s-4)', flexWrap: 'wrap' }}>
            <button className="btn" onClick={() => navigate('/learn')}>
              الانتقال إلى خريطة المنهج <Icon name="arrowL" size={17} />
            </button>
            <button className="btn secondary" onClick={() => navigate('/learn?level=PREA1')}>
              ابدأ من التمهيد (Pre-A1)
            </button>
          </div>
        </div>
      </div>
    );
  }

  const answeredCount = Object.keys(answers).length;
  const progressPct = Math.round(((index + 1) / QUESTIONS.length) * 100);

  return (
    <div className="container" style={{ maxWidth: 680 }}>
      <div className="card card-green" style={{ marginBottom: 'var(--s-4)' }}>
        <div className="row" style={{ gap: 'var(--s-3)', alignItems: 'flex-start' }}>
          <div style={{ width: 72, flex: 'none' }}>
            <TopicScene topic="greetings" label="مشهد تحية وتعريف بالإسبانية" />
          </div>
          <div style={{ flex: 1 }}>
            <span className="kicker">اختبار تحديد المستوى</span>
            <h1 style={{ margin: 'var(--s-1) 0' }}>اختبار تحديد المستوى</h1>
            <p className="muted" style={{ margin: 0 }}>
              10 أسئلة سريعة لتقييم معرفتك الحالية وتخطي ما تعرفه مسبقًا. أجب بما تعرفه فعلًا — النتيجة النهائية يحسبها الخادم، ولا تُعرض الإجابات الصحيحة أثناء الاختبار.
            </p>
          </div>
        </div>
        <div className="row" style={{ justifyContent: 'space-between', marginTop: 'var(--s-3)' }}>
          <span className="small muted num">السؤال {index + 1} من {QUESTIONS.length}</span>
          <button className="btn ghost sm" onClick={() => navigate('/learn')}>
            <Icon name="x" size={16} /> خروج
          </button>
        </div>
        <ProgressBar value={progressPct} label="تقدم الاختبار" />
      </div>

      <div className="card">
        <div className="row" style={{ justifyContent: 'space-between', marginBottom: 'var(--s-2)' }}>
          <LevelBadge level={current.level} />
          <span className="small muted num">
            أجبت على {answeredCount} من {QUESTIONS.length}
          </span>
        </div>

        <h2 style={{ fontSize: '1.25rem', marginTop: 0 }}>{current.promptAr}</h2>
        {/* رسم الموقف فوق السؤال — مطابق لموضوع سؤال التحديد نفسه */}
        <div style={{ width: 168, maxWidth: '100%', margin: '0 auto var(--s-2)' }}>
          <CartoonScene
            cartoon={cartoonForQuestion({ instructionAr: current.promptAr, stemEs: current.stemEs })}
            label={`رسم يوضح موقف السؤال: ${current.promptAr}`}
          />
        </div>
        {current.stemEs && (
          <p className="es" dir="ltr" style={{ fontSize: '1.2rem', fontWeight: 600, margin: 'var(--s-2) 0' }}>
            {current.stemEs}
          </p>
        )}

        <div role="group" aria-label="خيارات الإجابة" style={{ marginTop: 'var(--s-3)' }}>
          {current.options.map(opt => (
            <label
              key={opt.id}
              className={`choice ${selectedOptionId === opt.id ? 'selected' : ''}`}
            >
              <input
                type="radio"
                name={`placement-q-${current.id}`}
                value={opt.id}
                checked={selectedOptionId === opt.id}
                onChange={() => handleSelect(opt.id)}
              />
              <span className="es" style={{ fontSize: '1.05rem' }}>{opt.text}</span>
              {selectedOptionId === opt.id && <Icon name="check" size={18} label="الخيار المحدد" />}
            </label>
          ))}
        </div>

        {error && <div className="alert" role="alert" style={{ marginTop: 'var(--s-3)' }}>{error}</div>}

        <div className="row" style={{ justifyContent: 'space-between', marginTop: 'var(--s-4)' }}>
          <button
            type="button"
            className="btn ghost sm"
            onClick={handlePrev}
            disabled={index === 0 || submitting}
          >
            ← السابق
          </button>

          {index + 1 < QUESTIONS.length ? (
            <button
              type="button"
              className="btn sm"
              onClick={handleNext}
              disabled={!selectedOptionId || submitting}
            >
              التالي →
            </button>
          ) : (
            <button
              type="button"
              className="btn sm"
              onClick={handleFinish}
              disabled={answeredCount < QUESTIONS.length || submitting}
            >
              {submitting ? 'جارٍ التقييم…' : `إنهاء التقييم (${answeredCount}/${QUESTIONS.length})`}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
