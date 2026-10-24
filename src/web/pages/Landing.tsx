import { useEffect, useState } from 'react';
import { AudioDemo } from '../components/AudioDemo';
import { Icon, SectionHead } from '../components/ui';
import { TopicScene, type TopicKey } from '../components/Illustrations';
import { api } from '../api';
import { useAuth } from '../state';

interface TrackRow {
  slug: string;
  title_ar: string;
  kind: string;
  level_code: string | null;
  units_count: number;
  lessons_count: number;
}

const LEVELS: { code: string; title: string; desc: string }[] = [
  { code: 'PREA1', title: 'التمهيد', desc: 'التحية والتعريف بالنفس والأرقام — أول خطواتك في اللغة.' },
  { code: 'A1', title: 'المبتدئ', desc: 'جمل يومية كاملة: المقهى، المنزل، العائلة، والمواصلات.' },
  { code: 'A2', title: 'الأساسي', desc: 'الماضي والحاضر والمستقبل في مواقف الحياة والعمل.' },
  { code: 'B1', title: 'المتوسط', desc: 'التعبير عن الرأي، والرسائل المهنية، والمواقف المعقدة.' },
  { code: 'B2', title: 'فوق المتوسط', desc: 'النقاش والتلخيص والكتابة المهنية بثقة أكبر.' },
  { code: 'C1', title: 'المتقدم', desc: 'الطلاقة في النقاشات المتخصصة والنصوص المعمّقة.' },
];

const SITUATIONS: { topic: TopicKey; title: string; desc: string }[] = [
  { topic: 'cafe', title: 'في المقهى والمطعم', desc: 'اطلب، واستفسر عن الأسعار، وتعامل مع النادل بثقة.' },
  { topic: 'home', title: 'المنزل والحياة اليومية', desc: 'صف بيتك وروتينك وعائلتك بجمل طبيعية.' },
  { topic: 'shopping', title: 'التسوق', desc: 'اسأل عن المقاسات والأسعار، وقارن بين الخيارات.' },
  { topic: 'travel', title: 'السفر والفندق', desc: 'احجز، واسأل عن الاتجاهات، وحل مشكلات الرحلة.' },
  { topic: 'work', title: 'العمل', desc: 'عرّف بنفسك مهنيًا، وراسل زملاءك، وناقش مهامك.' },
  { topic: 'phone', title: 'المكالمات', desc: 'افتتح المكالمة، واطلب التحويل، ودوّن الرسائل.' },
];

const STEPS: { icon: 'cap' | 'target' | 'chat'; title: string; desc: string }[] = [
  { icon: 'cap', title: 'أنشئ حسابك', desc: 'حساب واحد يحفظ تقدمك ونقاطك ومراجعاتك على الخادم.' },
  { icon: 'target', title: 'حدّد مستواك أو ابدأ من الصفر', desc: 'اختبار تحديد مستوى من 10 أسئلة، أو ابدأ من التمهيد مباشرة.' },
  { icon: 'chat', title: 'تعلّم بالمواقف', desc: 'درسًا بعد درس: استمع، وتحدّث، وراجع — والمنهج يفتح لك الخطوة التالية.' },
];

export function Landing({ navigate }: { navigate: (to: string) => void }) {
  const { user } = useAuth();
  const [tracks, setTracks] = useState<TrackRow[] | null>(null);

  // مسارات حقيقية فقط من الخادم؛ إن تعذّر الوصول (زائر بلا صلاحية) تُخفى الأرقام
  // ولا يُعرض أي مسار غير موجود.
  useEffect(() => {
    let alive = true;
    api.paths()
      .then(p => {
        if (!alive) return;
        setTracks(p.paths.filter(t => t.kind !== 'main'));
      })
      .catch(() => {
        if (!alive) return;
        setTracks([]);
      });
    return () => {
      alive = false;
    };
  }, []);

  const scrollToId = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      el.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' });
    }
  };

  return (
    <div className="container">
      {/* البطل — لغة Picture 1: عنوان عريض كحلي بكلمة برتقالية، زر برتقالي،
          مشهد SVG مرسوم كودًا بدل الصورة (لا آلية صور في المشروع)،
          وشريط كحلي داكن Viaja / Trabaja / Vive أسفل المشهد. */}
      <section className="hero-landing">
        <div>
          <span className="kicker">منصة عربية لتعلّم الإسبانية</span>
          <h1>
            تعلّم الإسبانية <span className="accent-word">بطريقة طبيعية</span> وواقعية
          </h1>
          <p className="lead">
            من الصفر حتى الاحتراف، من خلال مواقف الحياة اليومية، ومحادثات حقيقية،
            وتمارين ممتعة. نساعدك على التحدث بثقة.
          </p>
          <div className="row hero-cta" style={{ marginTop: 'var(--s-5)', gap: 'var(--s-3)' }}>
            <button className="btn lg" onClick={() => navigate(user ? '/learn' : '/signup')}>
              ابدأ الآن <Icon name="arrowL" size={19} />
            </button>
            <button className="btn secondary lg" onClick={() => scrollToId('levels')}>
              استكشف المنهج
            </button>
          </div>
          <p className="small muted" style={{ marginTop: 'var(--s-4)' }}>
            لا شهادات معتمدة ولا وعود وظائف — ما نقدمه تعلّم منظّم بتصحيح فوري
            وحفظ دقيق لتقدمك. التفاصيل في صفحة الشفافية.
          </p>
        </div>
        <div className="hero-art" role="img" aria-label="مشهد مرسوم لشارع إسباني مشمس بأشجار برتقال وفقاعة ترحيب ¡Hola!">
          <svg viewBox="0 0 600 430" xmlns="http://www.w3.org/2000/svg" role="presentation">
            <defs>
              <linearGradient id="heroSky" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#fde68a" />
                <stop offset="60%" stopColor="#fed7aa" />
                <stop offset="100%" stopColor="#ffedd5" />
              </linearGradient>
            </defs>
            <rect width="600" height="430" fill="url(#heroSky)" />
            {/* شمس */}
            <circle cx="492" cy="72" r="42" fill="#f97316" opacity="0.9" />
            <circle cx="492" cy="72" r="30" fill="#fbbf24" />
            {/* مبانٍ بطراز البلدة القديمة: أبراج وأقواس */}
            <rect x="30" y="130" width="110" height="210" rx="6" fill="#e8b07d" />
            <rect x="30" y="130" width="110" height="14" fill="#c97e4a" />
            <rect x="58" y="180" width="22" height="40" rx="11" fill="#13294b" opacity="0.75" />
            <rect x="92" y="180" width="22" height="40" rx="11" fill="#13294b" opacity="0.75" />
            <rect x="58" y="250" width="22" height="40" rx="11" fill="#13294b" opacity="0.6" />
            <rect x="92" y="250" width="22" height="40" rx="11" fill="#13294b" opacity="0.6" />
            <rect x="150" y="90" width="120" height="250" rx="6" fill="#f3d9a4" />
            <path d="M150 90 L210 40 L270 90 Z" fill="#c97e4a" />
            <rect x="196" y="52" width="28" height="44" rx="4" fill="#13294b" opacity="0.7" />
            <rect x="178" y="150" width="24" height="52" rx="12" fill="#13294b" opacity="0.75" />
            <rect x="218" y="150" width="24" height="52" rx="12" fill="#13294b" opacity="0.75" />
            <rect x="178" y="240" width="24" height="52" rx="12" fill="#13294b" opacity="0.6" />
            <rect x="218" y="240" width="24" height="52" rx="12" fill="#13294b" opacity="0.6" />
            <rect x="280" y="150" width="130" height="190" rx="6" fill="#d99a63" />
            <rect x="280" y="150" width="130" height="14" fill="#b06a35" />
            <rect x="308" y="200" width="26" height="46" rx="13" fill="#13294b" opacity="0.75" />
            <rect x="352" y="200" width="26" height="46" rx="13" fill="#13294b" opacity="0.75" />
            <rect x="308" y="270" width="26" height="46" rx="13" fill="#13294b" opacity="0.6" />
            <rect x="352" y="270" width="26" height="46" rx="13" fill="#13294b" opacity="0.6" />
            <rect x="420" y="110" width="140" height="230" rx="6" fill="#eec27a" />
            <path d="M420 110 L490 62 L560 110 Z" fill="#c97e4a" />
            <rect x="448" y="170" width="24" height="50" rx="12" fill="#13294b" opacity="0.75" />
            <rect x="492" y="170" width="24" height="50" rx="12" fill="#13294b" opacity="0.75" />
            <rect x="448" y="250" width="24" height="50" rx="12" fill="#13294b" opacity="0.6" />
            <rect x="492" y="250" width="24" height="50" rx="12" fill="#13294b" opacity="0.6" />
            {/* شارع */}
            <rect x="0" y="340" width="600" height="90" fill="#d9b98c" />
            <rect x="0" y="340" width="600" height="8" fill="#b98d5a" />
            {/* أشجار برتقال */}
            <g>
              <rect x="72" y="300" width="10" height="44" fill="#7c4a21" />
              <circle cx="77" cy="288" r="34" fill="#16a34a" />
              <circle cx="62" cy="296" r="8" fill="#f97316" />
              <circle cx="92" cy="282" r="8" fill="#f97316" />
              <circle cx="80" cy="306" r="7" fill="#f97316" />
            </g>
            <g>
              <rect x="512" y="300" width="10" height="44" fill="#7c4a21" />
              <circle cx="517" cy="288" r="34" fill="#16a34a" />
              <circle cx="502" cy="296" r="8" fill="#f97316" />
              <circle cx="532" cy="282" r="8" fill="#f97316" />
              <circle cx="520" cy="306" r="7" fill="#f97316" />
            </g>
            {/* فقاعة ترحيب */}
            <g>
              <rect x="330" y="66" width="150" height="62" rx="18" fill="#ffffff" />
              <path d="M360 128 L372 146 L388 128 Z" fill="#ffffff" />
              <text x="405" y="106" textAnchor="middle" fontSize="30" fontWeight="800" fill="#13294b" fontFamily="Source Sans 3, sans-serif">¡Hola!</text>
            </g>
            {/* عبارة بخط مائل كما في النموذج */}
            <text x="40" y="60" fontSize="24" fontStyle="italic" fill="#13294b" fontFamily="Source Sans 3, sans-serif">Un nuevo</text>
            <text x="40" y="88" fontSize="24" fontStyle="italic" fill="#13294b" fontFamily="Source Sans 3, sans-serif">idioma,</text>
            <text x="40" y="116" fontSize="24" fontStyle="italic" fill="#13294b" fontFamily="Source Sans 3, sans-serif">más oportunidades</text>
          </svg>
        </div>
      </section>

      {/* شريط داكن: Viaja / Trabaja / Vive */}
      <section className="hero-dark-strip" aria-label="لماذا تتعلم الإسبانية">
        <div className="hero-dark-item">
          <span className="hero-dark-icon" aria-hidden="true"><Icon name="plane" size={24} /></span>
          <div><b dir="ltr">Viaja</b><span>سافر بثقة</span></div>
        </div>
        <div className="hero-dark-item">
          <span className="hero-dark-icon" aria-hidden="true"><Icon name="briefcase" size={24} /></span>
          <div><b dir="ltr">Trabaja</b><span>تواصل في العمل</span></div>
        </div>
        <div className="hero-dark-item">
          <span className="hero-dark-icon" aria-hidden="true"><Icon name="home" size={24} /></span>
          <div><b dir="ltr">Vive</b><span>اكتشف ثقافة جديدة</span></div>
        </div>
      </section>

      {/* كيف تبدأ */}
      <section className="section">
        <SectionHead kicker="ابدأ اليوم" title="كيف تبدأ التعلّم؟" desc="ثلاث خطوات تفصلك عن أول جملة إسبانية تنطقها بثقة." />
        <div className="feature-grid">
          {STEPS.map((s, i) => (
            <article className="card card-hover" key={s.title}>
              <div className="feature-item">
                <span className="track-art" aria-hidden="true"><Icon name={s.icon} size={26} /></span>
                <div>
                  <span className="small muted num">خطوة {i + 1}</span>
                  <h3 style={{ margin: '2px 0 var(--s-1)' }}>{s.title}</h3>
                  <p className="small muted" style={{ margin: 0 }}>{s.desc}</p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* المستويات */}
      <section className="section" id="levels">
        <SectionHead kicker="رحلة منظمة" title="من التمهيد حتى C1" desc="ستة مستويات متدرجة، كل مستوى يفتح الذي بعده بإتقانك للسابق." />
        <div className="level-strip">
          {LEVELS.map(l => (
            <article className="card card-hover level-card" key={l.code}>
              <span className="level-code" dir="ltr">{l.code}</span>
              <h3 style={{ margin: 'var(--s-2) 0 var(--s-1)' }}>{l.title}</h3>
              <p className="small muted" style={{ margin: 0 }}>{l.desc}</p>
            </article>
          ))}
        </div>
      </section>

      {/* مواقف الحياة */}
      <section className="section">
        <SectionHead kicker="تعلّم بالسياق" title="تعلّم من مواقف الحياة اليومية" desc="كل درس يدور حول موقف حقيقي: ماذا تقول، وماذا تسمع، وماذا ترد." />
        <div className="feature-grid">
          {SITUATIONS.map(s => (
            <article className="card card-hover" key={s.title}>
              <div className="feature-item">
                <span className="track-art" aria-hidden="true" style={{ width: 56, height: 56, padding: 6 }}>
                  <TopicScene topic={s.topic} />
                </span>
                <div>
                  <h3 style={{ margin: '0 0 var(--s-1)' }}>{s.title}</h3>
                  <p className="small muted" style={{ margin: 0 }}>{s.desc}</p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* ماذا ستتعلم؟ — بطاقات تدرجية بدل الصور، كالنموذج */}
      <section className="section">
        <SectionHead kicker="مواقف حقيقية" title="ماذا ستتعلم؟" desc="أربعة سياقات عملية تدور حولها دروسك من أول يوم." />
        <div className="grid cols-2">
          <article className="card card-hover learn-card">
            <div className="learn-card-art travel">
              <span className="learn-card-icon" aria-hidden="true"><Icon name="plane" size={26} /></span>
              <h3>السفر</h3>
            </div>
            <div className="learn-card-body">
              <p className="small muted">احجز، اسأل عن الاتجاهات، وتنقّل بثقة في إسبانيا وأمريكا اللاتينية.</p>
              <button className="btn secondary sm" onClick={() => navigate(user ? '/learn' : '/signup')}>ابدأ من حسابك</button>
            </div>
          </article>
          <article className="card card-hover learn-card">
            <div className="learn-card-art food">
              <span className="learn-card-icon" aria-hidden="true"><Icon name="cup" size={26} /></span>
              <h3>المطاعم والطعام</h3>
            </div>
            <div className="learn-card-body">
              <p className="small muted">اطلب طعامك وتواصل في المواقف اليومية داخل المطعم والمقهى.</p>
              <button className="btn secondary sm" onClick={() => navigate(user ? '/learn' : '/signup')}>ابدأ من حسابك</button>
            </div>
          </article>
          <article className="card card-hover learn-card">
            <div className="learn-card-art work">
              <span className="learn-card-icon" aria-hidden="true"><Icon name="headset" size={26} /></span>
              <h3>العمل والكول سنتر</h3>
            </div>
            <div className="learn-card-body">
              <p className="small muted">تعلّم مفردات ومواقف خدمة العملاء والتواصل المهني.</p>
              <button className="btn secondary sm" onClick={() => navigate(user ? '/learn' : '/signup')}>ابدأ من حسابك</button>
            </div>
          </article>
          <article className="card card-hover learn-card">
            <div className="learn-card-art daily">
              <span className="learn-card-icon" aria-hidden="true"><Icon name="home" size={26} /></span>
              <h3>الحياة اليومية</h3>
            </div>
            <div className="learn-card-body">
              <p className="small muted">تحيات، تعارف، تسوّق، ومواقف الحياة اليومية بجمل طبيعية.</p>
              <button className="btn secondary sm" onClick={() => navigate(user ? '/learn' : '/signup')}>ابدأ من حسابك</button>
            </div>
          </article>
        </div>
      </section>

      {/* الاستماع والمهارات + جرّب الصوت */}
      <section className="section">
        <div className="grid cols-2">
          <article className="card">
            <h2>الاستماع والكلمات والجمل والمحادثات</h2>
            <ul className="list-plain small">
              <li><Icon name="check" size={17} /> تمارين استماع واختيار، وبناء جمل، ومطابقة، وإكمال فراغ.</li>
              <li><Icon name="check" size={17} /> نطق بميكروفون المتصفح للتدريب على التحدث.</li>
              <li><Icon name="check" size={17} /> تصحيح فوري على الخادم مع شرح لكل إجابة.</li>
              <li><Icon name="check" size={17} /> شرح بالفصحى مع توضيح مصري عند الحاجة — وأنت تختار الأسلوب.</li>
            </ul>
          </article>
          <article className="card">
            <h2>جرّب الصوت الآن</h2>
            <p className="small muted">اضغط استمع لتسمع الجملة بنطق المتصفح — هكذا يعمل الصوت داخل الدروس.</p>
            <AudioDemo text="Quiero un café, por favor." audioKey="pending/a1-cafe-quiero-cafe-con-leche" />
          </article>
        </div>
      </section>

      {/* المسارات المتخصصة — بيانات حقيقية فقط */}
      {tracks !== null && tracks.length > 0 && (
        <section className="section">
          <SectionHead kicker="مسارات عملية" title="مسارات متخصصة" desc="مسارات تطبيقية بجانب المنهج الأساسي، بمحتواها ووحداتها الحقيقية." />
          <div className="grid cols-2">
            {tracks.map(t => (
              <article className="card card-hover" key={t.slug}>
                <div className="track-card">
                  <span className="track-art" aria-hidden="true">
                    <Icon name={t.slug === 'travel' ? 'plane' : t.slug === 'callcenter' ? 'headset' : 'book'} size={28} />
                  </span>
                  <div>
                    <h3 style={{ margin: '0 0 var(--s-1)' }}>{t.title_ar}</h3>
                    <p className="small muted" style={{ margin: 0 }}>
                      <span className="num">{t.lessons_count}</span> درسًا · <span className="num">{t.units_count}</span> وحدة
                      {t.level_code ? <> · <span className="badge sm">{t.level_code}</span></> : null}
                    </p>
                    <button className="btn secondary sm" style={{ marginTop: 'var(--s-3)' }} onClick={() => navigate(user ? '/learn' : '/signup')}>
                      {user ? 'متابعة من لوحتي' : 'ابدأ من حسابك'}
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>
      )}

      {/* المراجعة والتقدم */}
      <section className="section">
        <div className="card card-green">
          <div className="feature-item">
            <span className="track-art" aria-hidden="true"><Icon name="target" size={26} /></span>
            <div>
              <h2 style={{ margin: '0 0 var(--s-1)' }}>طريقة المراجعة والتقدم</h2>
              <p className="muted" style={{ margin: 0, maxWidth: '66ch' }}>
                مفردات دروسك تدخل تلقائيًا في المراجعة المتباعدة: تتذكر قبل أن ترى الإجابة،
                وتقيّم تذكّرك، فيحدد الخادم موعد المراجعة التالية. وكل XP تكسبه محفوظ في حسابك
                بعد تحقق الخادم — لا نقاط وهمية.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* دعوة أخيرة */}
      <section className="section" style={{ textAlign: 'center' }}>
        <h2>أول جملة إسبانية لك أقرب مما تظن</h2>
        <p className="lead" style={{ marginInline: 'auto' }}>
          أنشئ حسابك وابدأ من التمهيد، أو حدّد مستواك إن كنت تعرف شيئًا من الإسبانية من قبل.
        </p>
        <div className="row" style={{ justifyContent: 'center', marginTop: 'var(--s-4)' }}>
          <button className="btn lg" onClick={() => navigate(user ? '/learn' : '/signup')}>ابدأ رحلتك</button>
          <button className="btn secondary lg" onClick={() => navigate('/login')}>لديّ حساب</button>
        </div>
      </section>
    </div>
  );
}
