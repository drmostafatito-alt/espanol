import { Icon, type IconName } from '../components/icons';
import { SafeImage } from '../components/ui';
import { LANDING_TOPICS } from '../components/tracks';

/* أربع فوائد فقط — كل واحدة تجيب عن حاجة حقيقية، بأيقونات من نظامنا الموحّد */
const BENEFITS: { icon: IconName; title: string; text: string }[] = [
  { icon: 'volume', title: 'الاستماع والنطق', text: 'تدرّب على نطق إسبانيا المعاصر مع زر استماع واضح في كل جملة.' },
  { icon: 'chat', title: 'محادثات يومية', text: 'جمل حقيقية من مواقف الحياة اليومية بدل حفظ قوائم كلمات معزولة.' },
  { icon: 'plane', title: 'السفر والعمل', text: 'مطارات، فنادق، مطاعم ومكالمات خدمة عملاء — لغة تستخدمها فعلًا.' },
  { icon: 'cards', title: 'مراجعة الكلمات', text: 'مراجعة متباعدة ذكية تثبّت المفردات في ذاكرتك طويلة المدى.' },
];

export function Landing({ navigate }: { navigate: (to: string) => void }) {
  const scrollTo = (id: string) =>
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });

  return (
    <div>
      {/* ---------------- الهيرو: ثلاث إجابات فقط — ماذا؟ كيف يساعدني؟ ماذا أفعل الآن؟ ---------------- */}
      <div className="container">
        <section className="hero-simple" aria-label="تعلّم الإسبانية خطوة بخطوة">
          <div className="hero-simple-text">
            <h1>اتعلّم الإسبانية <span className="accent">خطوة بخطوة</span></h1>
            <p className="lead">
              دروس عملية ومحادثات من الحياة اليومية، من الصفر حتى مستوى متقدم.
            </p>
            <div className="hero-actions">
              <button className="btn lg" onClick={() => navigate('/signup')}>
                ابدأ التعلّم <Icon name="arrow-left" size={18} />
              </button>
              <button className="btn secondary lg" onClick={() => navigate('/login')}>تسجيل الدخول</button>
            </div>
            <button className="hero-link" type="button" onClick={() => scrollTo('topics')}>
              أو استكشف المسارات أولًا
            </button>
          </div>
          <div className="hero-simple-media">
            <SafeImage
              src="/img/hero-spain.jpg"
              alt="مشهد دافئ لشارع إسباني في إشبيلية تتخلله الشرفات المزهرة"
              loading="eager"
            />
          </div>
        </section>
      </div>

      {/* ---------------- الفوائد ---------------- */}
      <div className="container">
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
            <p className="small muted" style={{ margin: 0 }}>مسارات حقيقية من المحتوى المنشور — كل بطاقة تفتح دروسًا فعلية.</p>
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
                  <SafeImage src={topic.image} alt="" />
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

        {/* ---------------- دعوة ختامية مختصرة ---------------- */}
        <section className="cta-band" aria-labelledby="cta-title">
          <div>
            <h2 id="cta-title">جاهز لتبدأ أول محادثة؟</h2>
            <p className="small" style={{ margin: 0 }}>أنشئ حسابك المجاني وافتح أول درس خلال دقيقة — وتقدّمك محفوظ من أول إجابة.</p>
          </div>
          <button className="btn lg" onClick={() => navigate('/signup')}>
            ابدأ التعلّم <Icon name="arrow-left" size={18} />
          </button>
        </section>
      </div>
    </div>
  );
}
