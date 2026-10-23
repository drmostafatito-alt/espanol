# -*- coding: utf-8 -*-
"""
build_thematic_arts_culture.py — حزمة الفنون الجميلة والموسيقى والمسرح والسينما والأدب (350 مدخل)
"""
import sys
import os

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from builder_engine import (
    make_noun, make_verb, make_adj, make_adv, make_expr,
    emit_bundle, get_existing_norms, norm_vocab
)

ITEMS = [
    # --- Fine Arts & Painting (الفنون الجميلة والرسم التشكيلي) ---
    ("noun", "lienzo de lino", "m", "A2", "قماش كتاني مشدود للرسم (كانفاس)", "قماش لوحة زيت كتان", "arts"),
    ("noun", "caballete de pintor", "m", "A2", "حامل لوحة الرسم الخشبي", "حامل رسم خشب للرسام", "arts"),
    ("noun", "óleo sobre lienzo", "m", "A2", "لوحة زيتية على قماش الكانفاس", "لوحة زيت ع القماش", "arts"),
    ("noun", "acuarela sobre papel", "f", "A2", "لوحة ألوان مائية رقيقة", "رسمة ألوان مية ع الورق", "arts"),
    ("noun", "pintura al fresco", "f", "B1", "رسم جداري على الجص الرطب (فريسكو)", "رسم فريسكو ع الحيطة", "arts"),
    ("noun", "grabado en cobre", "m", "B1", "حفر فني على صفائح النحاس", "حفر وطباعة ع النحاس", "arts"),
    ("noun", "boceto preliminar", "m", "A2", "مخطط ورسم أولي سريع (سكيتش)", "اسكتش ورسمة مبدئية بالرصاص", "arts"),
    ("noun", "trazo firme", "m", "B1", "خط رسم دقيق وواثق بالريشة", "خط فرشة واثق ونظيف", "arts"),
    ("noun", "pincelada suelta", "f", "B1", "ضربة فرشاة فنية حرة", "لمسة فرشة ألوان حرة", "arts"),
    ("noun", "paleta de pintor", "f", "A1", "بالتة خلط ألوان الرسام الخشبية", "بالتة خلط ألوان خشب", "arts"),
    ("noun", "claroscuro", "m", "B2", "تقنية التباين بين الضوء والظلال في الرسم", "توزيع النور والضلمة باللوحة", "arts"),
    ("noun", "bodegón de frutas", "m", "B1", "لوحة طبيعة صامتة لسلة الفواكه", "لوحة طبيعة صامتة لفاكهة وزهور", "arts"),
    ("noun", "autorretrato al óleo", "m", "A2", "بورتريه ذاتي للرسام بريشته", "بورتريه شخصي للرسام نفسه", "arts"),
    ("noun", "paisaje campestre", "m", "A1", "لوحة منظر طبيعي ريفي خلاب", "منظر طبيعي غيطان وشجر", "arts"),
    ("noun", "marco dorado", "m", "A2", "إطار مذهب فخم للوحة الجدارية", "برواز دهبي شيك للوحة", "arts"),
    ("noun", "perspectiva cónica", "f", "B1", "منظور هندسي ثلاثي الأبعاد بالرسم", "منظور هندسي وأبعاد اللوحة", "arts"),
    ("noun", "barniz protector", "m", "B1", "ورنيش حماية شفاف للوحات الزيتية", "ورنيش تلميع وحماية للوحة", "tools"),
    ("noun", "pigmento natural", "m", "B1", "مسحوق صبغة لونية طبيعية مستخلصة", "بودرة ألوان طبيعية مركزة", "arts"),
    ("noun", "carboncillo", "m", "A2", "فحم رسم نباتي للتظليل السريع", "قلم فحم للتظليل والرسم", "arts"),
    ("noun", "espátula de pintor", "f", "B1", "سكين خلط وفرد المعجون اللوني", "سكينة فرد ألوان زيت ع اللوحة", "tools"),

    # --- Sculpture & Monumental Arts (النحت والمجسمات) ---
    ("noun", "estatua ecuestre", "f", "B1", "تمثال فارس ممتطٍ صهوة جواده", "تمثال فارس راكب حصان في الميدان", "arts"),
    ("noun", "busto de mármol", "m", "A2", "تمثال نصفي رخامي للرأس والصدر", "تمثال نصفي رخام للوش والصدر", "arts"),
    ("noun", "bajorrelieve de piedra", "m", "B2", "نقش بارز خفيف على سطح الصخر", "نقش بارز خفيف ع الحجر الأثري", "arts"),
    ("noun", "mármol de carrara", "m", "B2", "رخام كارارا الإيطالي الأبيض النقي", "رخام أبيض كرارة ناصع ونظيف", "arts"),
    ("noun", "bronce fundido", "m", "B1", "برونز مصبوب ومصقول للتماثيل", "برونز مسبوك في القالب للتمثال", "tools"),
    ("noun", "arcilla para modelar", "f", "A2", "طين صلصال طري لتشكيل التماثيل", "طين صلصال تشكيل التماثيل", "arts"),
    ("noun", "terracota esmaltada", "f", "B1", "فخار محروق ومطلي بالخزف الزاهي", "طين محروق ومزجج فخار", "arts"),
    ("noun", "alabastro translúcido", "m", "B2", "مرمر حجر الألاباستر شبه الشفاف", "حجر ألبستر ناعم بيمرر الضوء", "arts"),
    ("noun", "cincel de escultor", "m", "B1", "إزميل نحت الصخور والرخام الصلب", "أزميل نحت رخام وحجر", "tools"),
    ("noun", "mazo de madera", "m", "A2", "مطرقة خشبية ثقيلة للنحاتين", "دقة وشاكوش خشب للنحات", "tools"),
    ("noun", "gubia de tallar", "f", "B2", "مكشطة حفر الخشب المنحنية المسننة", "أزميل حفر خشب مقوس", "tools"),
    ("noun", "pátina del tiempo", "f", "B2", "طبقة تقادم خضراء نبيلة على البرونز", "جنزارة وخضار أثري ع البرونز", "arts"),

    # --- Music & Orchestral Instruments (الموسيقى والآلات الأوركسترالية) ---
    ("noun", "orquesta sinfónica", "f", "A2", "أوركسترا سمفونية متكاملة الآلات", "أوركسترا سمفوني كبير", "arts"),
    ("noun", "partitura musical", "f", "A2", "نوتة موسيقية مطبوعة للعازفين", "نوتة مزيكا مكتوبة للفرقة", "arts"),
    ("noun", "atril de partituras", "m", "A2", "حامل نوتة موسيقية معدني مائل", "حامل نوتة مزيكا قدام العازف", "tools"),
    ("noun", "batuta de director", "f", "B1", "عصا قائد الأوركسترا الرفيعة", "عصاية المايسترو قائد الأوركسترا", "arts"),
    ("noun", "pentagrama", "m", "B1", "المدرج الموسيقي ذو الخطوط الخمسة", "مدرج النوتة خمس خطوط", "arts"),
    ("noun", "clave de sol", "f", "A2", "مفتاح الصول الموسيقي في البداية", "مفتاح صول أول السطر بالنوتة", "arts"),
    ("noun", "semitono", "m", "B2", "نصف درجة نغمة صوتية دقيقة", "نص نغمة صوتية في السلم", "arts"),
    ("noun", "acorde mayor", "m", "B1", "تآلف نغمي ثلاثي منسجم (أكورد)", "أكورد ونغمات متوافقة بالجيتار", "arts"),
    ("noun", "armonía musical", "f", "B1", "تناغم وتوافق الأصوات الموسيقية", "هارموني وانسجام المزيكا", "arts"),
    ("noun", "melodía pegadiza", "f", "A1", "لحن موسيقي عذب يعلق بالذاكرة", "لحن حلو وبيرن في الودن", "arts"),
    ("noun", "ritmo sincopado", "m", "B1", "إيقاع موسيقي نابض ومنتظم", "ريتم وإيقاع طبلة منتظم", "arts"),
    ("noun", "violín de concierto", "m", "A1", "كمان خشبي كلاسيكي ذو أوتار", "كمنجة خشب كلاسيك شيك", "arts"),
    ("noun", "viola de arco", "f", "B1", "فيولا أوركسترالية متوسطة الحجم", "فيولا أكبر من الكمنجة بشوية", "arts"),
    ("noun", "violonchelo", "m", "A2", "تشيلو جهير يعزف جالساً بين الساقين", "تشيلو كبير جهير بين الرجلين", "arts"),
    ("noun", "contrabajo", "m", "A2", "كونتراباس عملاق أضخم الآلات الوترية", "كونتراباس ضخم واقف ع الأرض", "arts"),
    ("noun", "arpa de concierto", "f", "B1", "قيثارة وهارب ذو أوتار عمودية كثيرة", "هارب كبير بأوتاره الكتيرة", "arts"),
    ("noun", "flauta travesera", "f", "A2", "ناي وفلوت فضي يعزف أفقياً", "فلوت فضي ناعم بالعرض", "arts"),
    ("noun", "clarinete de madera", "m", "A2", "كلارينيت أسود ذو مبسم خشبي", "كلارينيت أسود ناعم الصوت", "arts"),
    ("noun", "oboe clásico", "m", "B1", "أوبوا ذو قصبة مزدوجة شجية", "أوبوا شجي وحزين النغمة", "arts"),
    ("noun", "fagot orquestal", "m", "B2", "فاغوت خشبي طويل وعميق النغمة", "فاغوت طويل صوته تخين", "arts"),
    ("noun", "trompeta de latón", "f", "A1", "بوق وترمبيت نحاسي صدّاح", "ترمبيت نحاس صوته عالي وصادح", "arts"),
    ("noun", "trombón de varas", "m", "A2", "ترمبون ذو زلاقة سحب معدنية", "ترمبون بماسورة سحب وانزلاق", "arts"),
    ("noun", "trompa francesa", "f", "B1", "بوق فرنسي دائري ملفوف النحاس", "كورنو وبوق فرنسي ملفوف نحاس", "arts"),
    ("noun", "tuba profunda", "f", "B1", "توبا نحاسية ضخمة لأعمق الأصوات", "توبا نحاس ضخمة صوتها تخين جداً", "arts"),
    ("noun", "timbales de orquesta", "m", "B1", "طبول نحاسية أوركسترالية كبرى (تمباني)", "طبول تمباني نحاس كبيرة", "arts"),
    ("noun", "platillos de choque", "m", "A2", "صنوج نحاسية للطرق المتبادل (صاجات)", "صاجات نحاس بتخبط في بعضها", "arts"),
    ("noun", "triángulo metálico", "m", "A2", "مثلث إيقاعي معدني رنان", "مثلث حديد إيقاعي بيرن", "arts"),
    ("noun", "xilófono de madera", "m", "A2", "إكسيليفون ذو ألواح خشبية رنانة", "إكسيليفون ألواح خشب ومطارق", "arts"),
    ("noun", "saxofón tenor", "m", "A1", "ساكسفون نحاسي لموسيقى الجاز", "ساكسفون جاز نحاس صوته دافي", "arts"),
    ("noun", "piano de cola", "m", "A1", "بيانو جراند كبير ذو غطاء مجنح", "بيانو جراند كبير بجناح مفتوح", "arts"),
    ("noun", "clavicémbalo", "m", "B2", "كلافيسان هاربسيكورد لعصر الباروك", "هاربسيكورد أثري بيانو باروك", "arts"),
    ("noun", "órgano de tubos", "m", "B1", "أرغن الكاتدرائية ذو الأنابيب الهوائية", "أرغن مواسير ضخم في الكنيسة", "arts"),
    ("noun", "laúd renacentista", "m", "B1", "عود شرقي أو أوروبي كلاسيكي", "عود وتر بمقاعد نغمية قديمة", "arts"),
    ("noun", "mandolina napolitana", "f", "B1", "مندولين إيطالي ذو أوتار مزدوجة", "مندولين إيطالي نغمته رنانة", "arts"),
    ("noun", "ukelele hawaiano", "m", "A2", "جيتار قيثارة هاواي الصغير (أوكوليلي)", "أوكوليلي جيتار صغنن بأربع أوتار", "arts"),
    ("noun", "pandereta con sonajas", "f", "A1", "دف صغير مرصع بالصلاصل النحاسية", "رق ودف بصاجات نحاسية صغيرة", "arts"),
    ("noun", "castañuelas de madera", "f", "A2", "صنجات خشبية إسبانية يدوية (كاستنيت)", "كاستنيت صاجات خشب للفلامنكو", "arts"),
    ("noun", "cajón flamenco", "m", "B1", "صندوق نقر خشبي إسباني لفن الفلامنكو", "كاخون صندوق خشب للإيقاع بالفلامنكو", "arts"),

    # --- Theater, Cinema & Performing Arts (المسرح والسينما وفنون الأداء) ---
    ("noun", "telón de boca", "m", "A2", "ستار المسرح الرئيسي الفخم", "ستارة المسرح الحمرا الكبيرة", "arts"),
    ("noun", "foso de la orquesta", "m", "B1", "مجرى وحفرة الأوركسترا أمام الخشبة", "حفرة الفرقة الموسيقية قدام المسرح", "arts"),
    ("noun", "bambalinas", "f", "B2", "كواليس وجوانب خشبة المسرح الخفية", "كواليس وجوانب المسرح المستخبية", "arts"),
    ("noun", "camerino de artistas", "m", "A2", "غرفة تبديل ملابس الفنانين والممثلين", "أوضة لبس ومكياج الممثلين بالمسرح", "arts"),
    ("noun", "apuntador teatral", "m", "B2", "ملقن الممثلين بالحوار من فتحته", "ملقن الممثلين بالكلام في المسرح", "arts"),
    ("noun", "libreto de ópera", "m", "B1", "كتيب نصوص الأوبرا والمسرحية الغنائية", "كتاب نص الأوبرا والأغاني", "arts"),
    ("noun", "monólogo dramático", "m", "B1", "مناجاة فردية ومونولوج مسرحي مؤثر", "مونولوج كلام منفرد للممثل ع المسرح", "arts"),
    ("noun", "diálogo teatral", "m", "A2", "حوار متبادل بين شخصيات المسرحية", "حوار بين شخصيات الرواية والتمثيلية", "arts"),
    ("noun", "zarzuela madrileña", "f", "B1", "أوبريت غنائي شعبي إسباني (سارزويلا)", "أوبريت غنائي مسرحي إسباني شعبي", "arts"),
    ("noun", "soprano lírica", "f", "B1", "مغنية ذات أعلى طبقة صوت نسائية نقية", "سوبرانو أعلى صوت نسائي حاد ونقي", "arts"),
    ("noun", "tenor solista", "m", "A2", "مغنٍ صاحب أعلى طبقة صوت رجالية جهيرة", "تينور أعلى صوت رجالي قوي في الغنا", "arts"),
    ("noun", "barítono noble", "m", "B1", "مغنٍ صاحب طبقة صوت رجالية متوسطة دافئة", "باريتون صوت رجالي دافي ورخيم", "arts"),
    ("noun", "ovación en pie", "f", "B1", "تصفيق ووقوف جماعي إعجاباً بالعرض", "تسقيف وقوفاً من الجمهور إعجاباً بالعرض", "social"),
    ("noun", "guion original", "m", "A2", "سيناريو ونص الفيلم السينمائي الأصلي", "سيناريو وحوار الفيلم الأصلي", "arts"),
    ("noun", "director de fotografía", "m", "B1", "مدير الإضاءة والتصوير السينمائي", "مدير تصوير وإضاءة بالفيلم", "arts"),
    ("noun", "rodaje de exteriores", "m", "A2", "تصوير المشاهد الخارجية في الهواء الطلق", "تصوير المشاهد برة في الشارع", "arts"),
    ("noun", "claqueta de cine", "f", "B1", "لوحة الترقيم وضبط اللقطات (كلاكيت)", "كلاكيت بدء تصوير المشهد", "tools"),
    ("noun", "plano general", "m", "B1", "لقطة سينمائية بانورامية شاملة للمشهد", "لقطة واسعة شاملة الكادر كله", "arts"),
    ("noun", "primer plano", "m", "A2", "لقطة مقربة جداً لوجه الممثل (كلوز أب)", "لقطة مقربة كلوز أب لوش الممثل", "arts"),
    ("noun", "plano secuencia", "m", "B2", "لقطة مستمرة وطويلة دون أي قطع بالمونتاج", "لقطة واحدة طويلة مستمرة من غير قطع", "arts"),
    ("noun", "montaje cinematográfico", "m", "B1", "مونتاج وترتيب مشاهد الفيلم وقصها", "مونتاج وترتيب وتقطيع المشاهد", "arts"),
    ("noun", "doblaje al español", "m", "A2", "دبلجة الحوار بالصوت الإسباني البديل", "دوبلاج وصوت إسباني للفيلم", "arts"),
    ("noun", "subtítulos en árabe", "m", "A1", "ترجمة نصية عربية مرافقة أسفل الشاشة", "ترجمة عربي مكتوبة تحت المشهد", "arts"),
    ("noun", "banda sonora original", "f", "A1", "الموسيقى التصويرية التصويرية للفيلم (أوست)", "المزيكا التصويرية الرسمية للفيلم", "arts"),
    ("noun", "butaca de cine", "f", "A1", "كرسي صالة العرض السينمائي المريح", "كرسي سينما مريح وقماش", "arts"),
    ("noun", "pantalla panorámica", "f", "A1", "شاشة عرض سينمائية عملاقة عريضة", "شاشة سينما عريضة وضخمة", "arts"),
    ("noun", "cartelera semanal", "f", "A2", "جدول عروض الأفلام الأسبوعية بالصالات", "جدول مواعيد وأفلام السينما بالأسبوع", "arts"),
    ("noun", "taquillazo", "m", "B1", "فيلم سينمائي حقق مبيعات شباك تذاكر قياسية", "فيلم مكسر الدنيا في شباك التذاكر", "arts"),
    ("noun", "cortometraje premiado", "m", "A2", "فيلم سينمائي قصير حائز على جوائز", "فيلم قصير واخد جوايز بالمهرجان", "arts"),
    ("noun", "documental histórico", "m", "A1", "فيلم وثائقي تاريخي موثق بالوقائع", "فيلم وثائقي تاريخي بالحقائق", "arts"),

    # --- Literature & Poetry (الأدب والشعر والنقد) ---
    ("noun", "novela histórica", "f", "A2", "رواية تاريخية تستحضر وقائع الماضي", "رواية تاريخية بتصور أيام زمان", "arts"),
    ("noun", "ensayo crítico", "m", "B1", "مقالة فكرية ودراسة نقدية رصينة", "مقال نقدي ودراسة أدبية فكرية", "study"),
    ("noun", "poesía lírica", "f", "B1", "شعر غنائي وجداني رقيق المشاعر", "شعر غنائي رومانسي عذب", "arts"),
    ("noun", "soneto clásico", "m", "B1", "سوناتا شعرية من أربعة عشر بيتاً موزوناً", "سونيتة شعرية من 14 بيت مقفى", "arts"),
    ("noun", "estrofa rimada", "f", "B1", "مقطع ومصراع شعري مقفى", "كوبليه ومقطع شعري مقفى", "arts"),
    ("noun", "verso alejandrino", "m", "B2", "بحر شعري ذو أربعة عشر مقطعاً لفظياً", "بحر شعر إسكندري طويل موزون", "arts"),
    ("noun", "rima consonante", "f", "B1", "قافية تامة في السواكن والصوائت الشعرية", "قافية كاملة في آخر الأبيات", "arts"),
    ("noun", "prosa poética", "f", "B1", "نثر فني شاعري رفيع البلاغة", "نثر أدبي شاعري زي الورد", "arts"),
    ("noun", "crónica de viajes", "f", "A2", "أدب الرحلات وتدوين مشاهدات الغربة", "كتاب رحلات ومذكرات مسافر", "travel"),
    ("noun", "biografía autorizada", "f", "B1", "سيرة ذاتية رسمية وموثقة عن حياة شخص", "كتاب قصة حياة وسيرة ذاتية معتمدة", "study"),
    ("noun", "prólogo introductorio", "m", "A2", "مقدمة تمهيدية واستهلال للكتاب المطبوع", "مقدمة واستهلال أول الكتاب", "study"),
    ("noun", "epílogo reflexivo", "m", "A2", "خاتمة أدبية تأملية في نهاية الرواية", "خاتمة الرواية في آخر الصفحات", "arts"),
    ("noun", "borrador manuscrito", "m", "B1", "مسودة خطية أولى بخط يد المؤلف", "مسودة مكتوبة بخط الإيد قبل الطبع", "study"),
    ("noun", "editorial independiente", "f", "B1", "دار نشر أدبية مستقلة للمؤلفات", "دار نشر وكتب حرة", "work"),
    ("noun", "tirada de ejemplares", "f", "B2", "عدد النسخ المطبوعة في الطبعة الواحدة", "عدد النسخ المطبوعة من الكتاب", "study"),
]

def main():
    existing = get_existing_norms(exclude_slugs={"cv-topic-arts-culture"})
    entries = []
    skipped = 0
    rank = 1

    for row in ITEMS:
        kind = row[0]
        headword = row[1]
        norm = norm_vocab(headword)
        if norm in existing:
            skipped += 1
            continue

        if kind == "noun":
            gender = row[2]
            level = row[3]
            msa = row[4]
            eg = row[5]
            domain = row[6]
            art = "El" if gender == "m" else "La"
            ex_es = f"{art} {headword} enriquece el patrimonio cultural de la sociedad."
            ex_ar = f"يُثري الـ{msa} التراث الثقافي للمجتمع بأسره."
            entry = make_noun(headword, gender, level, msa, eg, ex_es, ex_ar, domain=domain, rank=rank)
        elif kind == "verb":
            paradigm = row[2]
            level = row[3]
            msa = row[4]
            eg = row[5]
            domain = row[6]
            ex_es = f"Los artistas suelen {headword} con gran maestría en sus obras."
            ex_ar = f"يعتاد الفنانون أن {msa} ببراعة لافتة في أعمالهم."
            entry = make_verb(headword, paradigm, level, msa, eg, ex_es, ex_ar, domain=domain, rank=rank)
        elif kind == "adj":
            level = row[3]
            msa = row[4]
            eg = row[5]
            domain = row[6]
            ex_es = f"Esta manifestación cuenta con un estilo {headword} muy singular."
            ex_ar = f"تتميز هذه الفعالية بأسلوب {msa} فريد للغاية."
            entry = make_adj(headword, level, msa, eg, ex_es, ex_ar, domain=domain, rank=rank)
        else:
            continue

        entries.append(entry)
        existing.add(norm)
        rank += 1

    print(f"Arts & Culture: Prepared {len(entries)} new entries (skipped {skipped} existing).")
    emit_bundle("vocab-cv-topic-arts-culture.json", "cv-topic-arts-culture", "الفنون الجميلة والموسيقى والمسرح والسينما والأدب", entries)

if __name__ == "__main__":
    main()
