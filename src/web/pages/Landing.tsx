import { useAuthOptional } from '../state';
import { Icon, type IconName } from '../components/icons';
import { SafeImage } from '../components/ui';
import { LANDING_TOPICS, HERO_IMAGE, trackImageSources, trackImageSrcSet } from '../components/tracks';
import { Solecito, SoftPattern } from '../components/Illustrations';

/* أربع فوائد فقط — كل واحدة تجيب عن حاجة حقيقية، بأيقونات من نظامنا الموحّد */
const BENEFITS: { icon: IconName; title: string; text: string }[] = [
  { icon: 'volume', title: 'الاستماع والنطق', text: 'تدرّب على نطق إسبانيا المعاصر مع زر استماع واضح في كل جملة.' },
  { icon: 'chat', title: 'محادثات يومية', text: 'جمل حقيقية من مواقف الحياة اليومية بدل حفظ قوائم كلمات معزولة.' },
  { icon: 'plane', title: 'السفر والعمل', text: 'مطارات، فنادق، مطاعم ومكالمات خدمة عملاء — لغة تستخدمها فعلًا.' },
  { icon: 'cards', title: 'مراجعة الكلمات', text: 'مراجعة متباعدة ذكية تثبّت المفردات في ذاكرتك طويلة المدى.' },
];

/* رحلة الطالب في ثلاث خطوات — تصف ما يفعله التطبيق فعلًا لا وعودًا */
const STEPS: { n: string; title: string; text: string; icon: IconName }[] = [
  { n: '1', title: 'اختر مسارك', text: 'مسار أساسي متدرّج من الحروف حتى المحادثة المتقدمة، أو مسار السفر والكول سنتر.', icon: 'route' },
  { n: '2', title: 'تعلّم درسًا قصيرًا', text: 'هدف واضح، مفردات في جمل، ثم تمارين استماع وترتيب وترجمة بتغذية راجعة فورية.', icon: 'book' },
  { n: '3', title: 'ثبّت ثم تقدّم', text: 'مراجعة متباعدة تعيد ما تحتاجه فقط، وخريطة تفتح الدرس التالي عند إتقان السابق.', icon: 'cards' },
];

/* سلّم المستويات الحقيقي في المنهج (PREA1 → C1) */
const LADDER = [
  { code: 'PREA1', label: 'البداية' },
  { code: 'A1', label: 'مبتدئ' },
  { code: 'A2', label: 'أساسي' },
  { code: 'B1', label: 'متوسط' },
  { code: 'B2', label: 'متقدّم' },
  { code: 'C1', label: 'إتقان' },
];

export function Landing({ navigate }: { navigate: (to: string) => void }) {
  const user = useAuthOptional()?.user ?? null;
  const scrollTo = (id: string) =>
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });

  return (
    <div>
      {/* ---------------- الهيرو ---------------- */}
      <div className="container">
        <section className="hero-simple" aria-label="تعلّم الإسبانية خطوة بخطوة">
          <div className="hero-simple-text">
            <span className="pill-stat flame" style={{ marginBottom: 'var(--s-3)' }}>
              <Icon name="sparkles" size={16} /> إسبانية الناطقين بالعربية — شرح عربي ولغة إسبانية
            </span>
            <h1>اتعلّم الإسبانية <span className="accent">خطوة بخطوة</span></h1>
            <p className="lead">
              دروس عمليّة ومحادثات من الحياة اليومية، من الصفر حتى مستوى متقدم — مع خريطة مسار
              تعرف فيها دائمًا أين أنت، وما خطوتك التالية.
            </p>
            <div className="hero-actions">
              {user ? (
                <button className="btn lg" onClick={() => navigate('/learn')}>
                  متابعة التعلّم <Icon name="arrow-left" size={18} />
                </button>
              ) : (
                <>
                  <button className="btn lg" onClick={() => navigate('/signup')}>
                    ابدأ التعلّم <Icon name="arrow-left" size={18} />
                  </button>
                  <button className="btn secondary lg" onClick={() => navigate('/login')}>تسجيل الدخول</button>
                </>
              )}
            </div>
            <button className="hero-link" type="button" onClick={() => scrollTo('topics')}>
              أو استكشف المسارات أولًا
            </button>
          </div>
          <div className="hero-simple-media">
            <SafeImage
              src={HERO_IMAGE.src}
              srcSet={HERO_IMAGE.srcSet}
              sizes={HERO_IMAGE.sizes}
              sources={HERO_IMAGE.sources.map(s => ({ ...s, sizes: HERO_IMAGE.sizes }))}
              alt="مشهد دافئ لشارع إسباني في إشبيلية تتخلله الشرفات المزهرة"
              loading="eager"
              width={1100}
              height={614}
              fetchPriority="high"
              decoding="sync"
            />
            <span className="hero-mascot" aria-hidden="true">
              <Solecito mood="wave" size={104} />
            </span>
          </div>
        </section>
      </div>

      {/* ---------------- كيف تعمل الرحلة ---------------- */}
      <div className="container">
        <section className="section" id="how" aria-labelledby="how-title">
          <div className="section-head">
            <h2 id="how-title">كيف تسير الرحلة؟</h2>
          </div>
          <div className="steps-grid">
            {STEPS.map(s => (
              <article className="step-card" key={s.n}>
                <span className="step-num num">{s.n}</span>
                <span className="step-icon"><Icon name={s.icon} size={22} /></span>
                <h3>{s.title}</h3>
                <p>{s.text}</p>
              </article>
            ))}
          </div>
          <div className="ladder" aria-label="مستويات المنهج">
            {LADDER.map((l, i) => (
              <span className="ladder-step" key={l.code} style={{ ['--i' as string]: i }}>
                <b>{l.code}</b>
                <small>{l.label}</small>
              </span>
            ))}
          </div>
        </section>

        {/* ---------------- الفوائد ---------------- */}
        <section className="section" id="method" aria-labelledby="benefits-title">
          <div className="section-head">
            <h2 id="benefits-title">ماذا ستكسب؟</h2>
          </div>
          <div className="benefit-grid">
            {BENEFITS.map(b => (
              <article className="benefit-card" key={b.title}>
                <div className="benefit-icon"><Icon name={b.icon} size={26} /></div>
                <h3>{b.title}</h3>
                <p>{b.text}</p>
              </article>
            ))}
          </div>
        </section>

        {/* ---------------- المسارات التعليمية ---------------- */}
        <section className="section" id="topics" aria-labelledby="topics-title">
          <div className="section-head">
            <h2 id="topics-title">اختر مسارك التعليمي</h2>
            <p className="small muted" style={{ margin: 0 }}>مسارات من محتوى المنصة — كل بطاقة تفتح بحثًا في دروس ومفردات ذلك المسار.</p>
          </div>
          <div className="topic-grid">
            {LANDING_TOPICS.map(topic => (
              <a
                key={topic.title}
                className="topic-card"
                href={`/search?q=${encodeURIComponent(topic.query)}`}
                onClick={e => {
                  e.preventDefault();
                  navigate(`/search?q=${encodeURIComponent(topic.query)}`);
                }}
              >
                <div className="topic-media">
                  <SafeImage
                    src={topic.image}
                    srcSet={trackImageSrcSet(topic.image)}
                    sizes="(max-width: 700px) 45vw, 220px"
                    sources={[{ type: 'image/webp', srcSet: trackImageSources(topic.image).webp }]}
                    width={320}
                    height={180}
                    alt=""
                  />
                </div>
                <div className="topic-body">
                  <h3>{topic.title}</h3>
                  <p>{topic.description}</p>
                  <span className="go">استكشف المسار <Icon name="arrow-left" size={15} /></span>
                </div>
              </a>
            ))}
          </div>
        </section>

        {/* ---------------- دعوة ختامية ---------------- */}
        <section className="cta-band" aria-labelledby="cta-title">
          <SoftPattern className="cta-pattern" />
          <div className="cta-content">
            <h2 id="cta-title">جاهز لتبدأ أول محادثة؟</h2>
            <p className="small" style={{ margin: 0 }}>
              أنشئ حسابك المجاني وافتح أول درس خلال دقيقة — وتقدّمك محفوظ من أول إجابة.
            </p>
          </div>
          <Solecito mood="happy" size={92} />
          <button className="btn lg" onClick={() => navigate('/signup')}>
            ابدأ التعلّم <Icon name="arrow-left" size={18} />
          </button>
        </section>
      </div>
    </div>
  );
}
