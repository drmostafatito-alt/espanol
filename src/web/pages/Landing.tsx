import { useEffect, useState } from 'react';
import { AudioDemo } from '../components/AudioDemo';
import { Icon, SectionHead } from '../components/ui';
import { TopicScene, type TopicKey } from '../components/Illustrations';
import { api } from '../api';
import { PHOTOS } from '../assets/photos';
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
          صورة فوتوغرافية حقيقية لشارع إسباني،
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
        <div className="hero-art hero-media">
          <img src={PHOTOS.heroStreet} className="photo photo-hero" alt="شارع في برشلونة" />
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

      {/* ماذا ستتعلم؟ — بطاقات بصورة فوتوغرافية أعلى العنوان، كالنموذج */}
      <section className="section">
        <SectionHead kicker="مواقف حقيقية" title="ماذا ستتعلم؟" desc="أربعة سياقات عملية تدور حولها دروسك من أول يوم." />
        <div className="grid cols-2">
          <article className="card card-hover learn-card">
            <div className="photo-head"><img src={PHOTOS.travelWindow} className="photo" alt="مسافر ينظر من نافذة طائرة" /></div>
            <div className="learn-card-body">
              <h3>السفر</h3>
              <p className="small muted">احجز، اسأل عن الاتجاهات، وتنقّل بثقة في إسبانيا وأمريكا اللاتينية.</p>
              <button className="btn secondary sm" onClick={() => navigate(user ? '/learn' : '/signup')}>ابدأ من حسابك</button>
            </div>
          </article>
          <article className="card card-hover learn-card">
            <div className="photo-head"><img src={PHOTOS.paella} className="photo" alt="طبق باييلا إسباني" /></div>
            <div className="learn-card-body">
              <h3>المطاعم والطعام</h3>
              <p className="small muted">اطلب طعامك وتواصل في المواقف اليومية داخل المطعم والمقهى.</p>
              <button className="btn secondary sm" onClick={() => navigate(user ? '/learn' : '/signup')}>ابدأ من حسابك</button>
            </div>
          </article>
          <article className="card card-hover learn-card">
            <div className="photo-head"><img src={PHOTOS.workLaptop} className="photo" alt="سيدة تعمل على لابتوب وتحمل قهوة" /></div>
            <div className="learn-card-body">
              <h3>العمل والكول سنتر</h3>
              <p className="small muted">تعلّم مفردات ومواقف خدمة العملاء والتواصل المهني.</p>
              <button className="btn secondary sm" onClick={() => navigate(user ? '/learn' : '/signup')}>ابدأ من حسابك</button>
            </div>
          </article>
          <article className="card card-hover learn-card">
            <div className="photo-head"><img src={PHOTOS.marketPeppers} className="photo" alt="سوق لا بوكيريا في برشلونة" /></div>
            <div className="learn-card-body">
              <h3>الحياة اليومية</h3>
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
