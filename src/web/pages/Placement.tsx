import { useState } from 'react';
import { api } from '../api';
import { useAuth } from '../state';
import { Icon } from '../components/icons';
import { Mascot } from '../components/Mascot';
import { ProgressBar } from '../components/ui';

interface Question {
  id: number;
  level: 'PREA1' | 'A1' | 'A2';
  promptAr: string;
  stemEs?: string;
  options: { id: string; text: string; correct: boolean }[];
  explanationAr: string;
}

const QUESTIONS: Question[] = [
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
  {
    id: 4,
    level: 'A1',
    promptAr: 'أكمل الجملة بأداة التعريف المناسبة: «____ casa es grande.» (المنزل كبير)',
    stemEs: '____ casa es grande.',
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
      { id: 'd', text: 'متى ستعيش في مدريد؟', correct: false },
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
        <div className="card" style={{ marginTop: 'var(--s-6)' }}>
          <h2>تسجيل الدخول مطلوب</h2>
          <p className="muted">يرجى تسجيل الدخول أو إنشاء حساب لحفظ نتيجتك وفتح المستويات تلقائيًا.</p>
          <button className="btn navy" onClick={() => navigate('/login')}>تسجيل الدخول</button>
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
    if (index + 1 < QUESTIONS.length) setIndex(i => i + 1);
  };
  const handlePrev = () => {
    if (index > 0) setIndex(i => i - 1);
  };

  const handleFinish = async () => {
    setSubmitting(true);
    setError(null);
    let correctCount = 0;
    for (const q of QUESTIONS) {
      const chosenId = answers[q.id];
      const correctOption = q.options.find(o => o.correct);
      if (chosenId && correctOption && chosenId === correctOption.id) correctCount++;
    }
    const scorePct = Math.round((correctCount / QUESTIONS.length) * 100);
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
        <div className="card result-hero" style={{ marginTop: 'var(--s-6)' }}>
          <div className="result-mascot" style={{ width: 150 }}>
            <Mascot mood={result.passed ? 'celebrate' : 'wave'} size={150} />
          </div>
          <h1 style={{ marginTop: 0 }}>نتيجة اختبار تحديد المستوى</h1>
          <p className="lead" style={{ margin: 'var(--s-2) 0' }}>
            نسبة الإجابات الصحيحة: <strong className="num">{result.score}%</strong>
          </p>
          <div className={`feedback ${result.passed ? 'ok' : 'neutral'}`} style={{ textAlign: 'start', margin: 'var(--s-4) 0' }}>
            <span className="feedback-icon">
              <Icon name={result.passed ? 'check' : 'info'} size={20} />
            </span>
            <div>
              <strong>المستوى الموصى به: {result.unlockedLevel}</strong>
              <p style={{ margin: '2px 0 0' }}>{result.messageAr}</p>
              {result.xpAwarded > 0 && (
                <p className="row small" style={{ color: 'var(--color-success-strong)', margin: 'var(--s-2) 0 0', gap: 'var(--s-1)' }}>
                  <Icon name="star" size={16} /> تمت إضافة <strong>+{result.xpAwarded} XP</strong> إلى رصيدك كمكافأة على اجتياز التقييم!
                </p>
              )}
            </div>
          </div>
          <button className="btn navy" onClick={() => navigate('/learn')}>
            الانتقال إلى خريطة المنهج والدروس ←
          </button>
        </div>
      </div>
    );
  }

  const answeredCount = Object.keys(answers).length;
  const progressPct = Math.round(((index + 1) / QUESTIONS.length) * 100);

  return (
    <div className="container" style={{ maxWidth: 720 }}>
      <div className="lesson-top" style={{ marginTop: 'var(--s-4)' }}>
        <button className="btn ghost icon-btn" onClick={() => navigate('/learn')} aria-label="خروج من الاختبار">
          <Icon name="close" size={22} />
        </button>
        <div className="lesson-title">
          <h1 style={{ fontSize: '1.25rem' }}>اختبار تحديد المستوى</h1>
          <span className="small muted">10 أسئلة سريعة لتقييم معرفتك الحالية</span>
        </div>
        <span className="badge navy">{current.level}</span>
      </div>

      <ProgressBar value={progressPct} label="تقدم الاختبار" />

      <div className="card" style={{ marginTop: 'var(--s-4)' }}>
        <p className="small muted num" style={{ marginBottom: 'var(--s-3)' }}>
          السؤال {index + 1} من {QUESTIONS.length}
        </p>

        <div className="question-scene">
          <Mascot size={104} />
          <div className="speech-bubble">
            {current.stemEs ? (
              <>
                <p className="bubble-es es" dir="ltr">{current.stemEs}</p>
                <p className="bubble-ar">{current.promptAr}</p>
              </>
            ) : (
              <p className="bubble-es" style={{ fontSize: '1.15rem' }}>{current.promptAr}</p>
            )}
          </div>
        </div>

        <div role="group" aria-label="خيارات الإجابة">
          {current.options.map(opt => (
            <label key={opt.id} className={`choice ${selectedOptionId === opt.id ? 'selected' : ''}`}>
              <input
                type="radio"
                name={`placement-q-${current.id}`}
                value={opt.id}
                checked={selectedOptionId === opt.id}
                onChange={() => handleSelect(opt.id)}
              />
              <span className="es">{opt.text}</span>
            </label>
          ))}
        </div>

        {error && <div className="alert" role="alert" style={{ marginTop: 'var(--s-3)' }}>{error}</div>}

        <div className="row" style={{ justifyContent: 'space-between', marginTop: 'var(--s-5)' }}>
          <button type="button" className="btn ghost" onClick={handlePrev} disabled={index === 0 || submitting}>
            ← السابق
          </button>
          {index + 1 < QUESTIONS.length ? (
            <button type="button" className="btn navy" onClick={handleNext} disabled={!selectedOptionId || submitting}>
              التالي →
            </button>
          ) : (
            <button
              type="button"
              className="btn success"
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
