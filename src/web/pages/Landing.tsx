import { AudioDemo } from '../components/AudioDemo';
import { Icon, type IconName, SpainFlag } from '../components/icons';
import { SafeImage } from '../components/ui';
import { LANDING_TOPICS } from '../components/tracks';

const BENEFITS: { icon: IconName; title: string; text: string }[] = [
  { icon: 'chat', title: 'محادثات من الحياة الواقعية', text: 'جمل حقيقية في مواقف يومية بدل حفظ قوائم كلمات منفصلة.' },
  { icon: 'volume', title: 'استماع ونطق صحيح', text: 'تدرّب على سمعك ولسانك بنطق إسبانيا المعاصر مع بدائل واضحة.' },
  { icon: 'book', title: 'قواعد مبسطة', text: 'نفكّك التركيب بعد الجملة، فتتعلم القاعدة من الاستخدام لا من الحفظ.' },
  { icon: 'sparkles', title: 'تعلّم تفاعلي', text: 'اختيارات، ترتيب جمل، استماع وتحدّث، مع تصحيح فوري من الخادم.' },
];

const STEPS = [
  { title: 'أنشئ حسابك', text: 'بريد وكلمة مرور فقط — بلا رسائل تسويقية.' },
  { title: 'حدّد مستواك', text: 'اختبار سريع يفتح لك المستوى المناسب فعليًا.' },
  { title: 'ابدأ أول درس', text: 'محادثات قصيرة تنتهي في دقائق معدودة.' },
  { title: 'تابع تقدمك', text: 'نقاط XP ومراجعة متباعدة تثبّت ما تعلّمته.' },
];

export function Landing({ navigate }: { navigate: (to: string) => void }) {
  const scrollTo = (id: string) =>
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });

  return (
    <div>
      {/* ---------------- الهيرو ---------------- */}
      <div className="container" style={{ paddingTop: 'var(--s-5)' }}>
        <section className="hero-scene" aria-label="تعلّم الإسبانية بطريقة طبيعية وواقعية">
          <div className="hero-content">
            <span className="badge primary" style={{ alignSelf: 'flex-start', marginBottom: 'var(--s-3)' }}>
              منصة تفاعلية متكاملة — من الصفر حتى C1
            </span>
            <h1>
              تعلّم الإسبانية
              <br />
              بطريقة <span className="accent">طبيعية</span>
              <br />
              وواقعية
            </h1>
            <p className="lead">
              من الحفر حتى الاحتراف، عبر مواقف من الحياة اليومية: محادثات حقيقية، استماع ونطق،
              وتمارين ممتعة تساعدك على التحدث بثقة.
            </p>
            <div className="hero-actions">
              <button className="btn" onClick={() => navigate('/signup')}>
                ابدأ رحلتك الآن <Icon name="arrow-left" size={18} />
              </button>
              <button className="btn secondary" onClick={() => scrollTo('topics')}>استكشف المنهج</button>
            </div>
            <div className="hero-mini-row">
              <div className="hero-mini">
                <Icon name="buildings" size={22} style={{ color: 'var(--color-primary)' }} />
                <span className="es">Vive</span>
                <span>اكتشف ثقافة جديدة</span>
              </div>
              <div className="hero-mini">
                <Icon name="briefcase" size={22} style={{ color: 'var(--color-info)' }} />
                <span className="es">Trabaja</span>
                <span>تواصل في العمل</span>
              </div>
              <div className="hero-mini">
                <Icon name="plane" size={22} style={{ color: 'var(--color-success)' }} />
                <span className="es">Viaja</span>
                <span>سافر بثقة</span>
              </div>
            </div>
          </div>
          <div className="hero-media">
            <SafeImage
              src="/img/hero-spain.jpg"
              alt="متعلم يجلس في مقهى بإشبيلية أمام كاتدرائية إشبيلية في ضوء الشمس الدافئ"
              loading="eager"
            />
            <span className="hero-bubble" aria-hidden="true">
              <SpainFlag size={20} />
              <span className="es">¡Hola!</span>
            </span>
            <span className="hero-handwrite handwrite">Un nuevo idioma, más oportunidades</span>
          </div>
        </section>
      </div>

      {/* ---------------- الفوائد ---------------- */}
      <div className="container">
        <section className="section" style={{ paddingBottom: 0 }}>
          <div className="section-head">
            <h2>لماذا تتعلم معنا؟</h2>
          </div>
          <div className="benefit-grid">
            {BENEFITS.map(b => (
              <article className="benefit-card" key={b.title}>
                <div className="benefit-icon"><Icon name={b.icon} size={28} /></div>
                <h3>{b.title}</h3>
                <p>{b.text}</p>
              </article>
            ))}
          </div>
        </section>

        {/* ---------------- ماذا ستتعلم ---------------- */}
        <section className="section" id="topics">
          <div className="section-head">
            <h2>ماذا ستتعلم؟</h2>
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
                  <SafeImage src={topic.image} alt={`صورة من مواقف ${topic.title} بالإسبانية`} />
                </div>
                <div className="topic-body">
                  <h3>{topic.title}</h3>
                  <p>{topic.description}</p>
                  <span className="go">استكشف المحتوى <Icon name="arrow-left" size={15} /></span>
                </div>
              </a>
            ))}
          </div>
        </section>

        {/* ---------------- كيف تبدأ ---------------- */}
        <section className="section" id="method" style={{ paddingTop: 0 }}>
          <div className="section-head">
            <h2>كيف تبدأ التعلم؟</h2>
          </div>
          <div className="steps">
            {STEPS.map((step, i) => (
              <article className="step-card" key={step.title}>
                <div className="step-num"><span className="num">{i + 1}</span></div>
                <h3>{step.title}</h3>
                <p>{step.text}</p>
              </article>
            ))}
          </div>
        </section>

        {/* ---------------- منهجنا والصوت ---------------- */}
        <section className="grid cols-2" style={{ paddingBottom: 'var(--s-6)' }}>
          <div className="card">
            <h2>منهجنا باختصار</h2>
            <ul className="list-plain small">
              <li>نبدأ من الجملة في موقف حقيقي ثم نفكّك تركيبها — لا حفظًا آليًا للقوائم.</li>
              <li>شرح بالفصحى مع توضيح مصري عند الحاجة، وأنت تختار أسلوبك من القائمة العلوية.</li>
              <li>الأساس إسبانية إسبانيا، مع تنبيه واضح لفروق أمريكا اللاتينية دون إرباك.</li>
              <li>كل نقطة XP وكل تقدم يُحسب على الخادم — لا عدّادات وهمية في متصفحك.</li>
            </ul>
          </div>
          <div className="card">
            <h2>جرّب الصوت الآن</h2>
            <AudioDemo text="Quiero un café, por favor." audioKey="pending/a1-cafe-quiero-cafe-con-leche" />
          </div>
        </section>

        {/* ---------------- دعوة ختامية ---------------- */}
        <section
          className="card"
          style={{
            background: 'var(--color-navy)',
            color: '#fff',
            textAlign: 'center',
            padding: 'var(--s-7) var(--s-5)',
            marginBottom: 'var(--s-6)',
          }}
        >
          <h2 style={{ color: '#fff' }}>جاهز تبدأ أول محادثة إسبانية؟</h2>
          <p style={{ color: 'rgba(255,255,255,0.82)', maxWidth: '52ch', margin: '0 auto var(--s-4)' }}>
            أنشئ حسابك المجاني وافتح أول درس خلال دقيقة. تقدمك محفوظ من أول إجابة.
          </p>
          <button className="btn" onClick={() => navigate('/signup')}>
            ابدأ رحلتك الآن <Icon name="arrow-left" size={18} />
          </button>
        </section>
      </div>
    </div>
  );
}
