# -*- coding: utf-8 -*-
"""
build_thematic_commerce_home.py — حزمة التجارة والملابس والمنزل والمطبخ والأثاث (350 مدخل)
"""
import sys
import os

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from builder_engine import (
    make_noun, make_verb, make_adj, make_adv, make_expr,
    emit_bundle, get_existing_norms, norm_vocab
)

ITEMS = [
    # --- Garments & Accessories (الملابس والإكسسوارات) ---
    ("noun", "americana", "f", "A2", "سترة بدلة أنيقة (بليزر)", "بليزر وبدلة شيك", "shopping"),
    ("noun", "gabardina", "f", "B1", "معطف واقٍ من المطر (ترنشكوت)", "بالطو مطر ترنشكوت", "shopping"),
    ("noun", "impermeable", "m", "A2", "معطف خفيف واقٍ من المطر", "مشمع وجاكيت مطر", "shopping"),
    ("noun", "chubasquero", "m", "A2", "سترة مطر خفيفة بغطاء رأس", "جاكيت مطر خفيف بزبوط", "shopping"),
    ("noun", "anorak", "m", "A2", "سترة شتوية مبطنة ضد الصقيع", "جاكيت شتوي منفوخ ودافي", "shopping"),
    ("noun", "forro polar", "m", "A2", "سترة صوفية قطبية خفيفة (بولار)", "جاكيت صوف بولار دافي", "shopping"),
    ("noun", "sudadera con capucha", "f", "A1", "سترة قطنية بغطاء رأس (هودي)", "هودي كابيشو وسويت شيرت", "shopping"),
    ("noun", "camiseta interior", "f", "A1", "قميص داخلي قطني خفيف", "فانلة داخلية قطن", "shopping"),
    ("noun", "calzoncillos", "m", "A2", "سروال داخلي رجالي (بوكسر)", "شورت وبوكسر داخلي", "shopping"),
    ("noun", "bragas", "f", "A2", "لباس داخلي نسائي", "لباس داخلي حريمي", "shopping"),
    ("noun", "sujetador", "m", "A2", "حمالة صدر نسائية (سوتيان)", "سوتيان حريمي", "shopping"),
    ("noun", "camisón", "m", "A2", "ثوب نوم نسائي مريح", "قميص نوم حريمي بيتي", "housing"),
    ("noun", "bata de casa", "f", "A2", "روب منزلي دافئ", "روب بيتي شتوي دافي", "housing"),
    ("noun", "albornoz", "m", "A2", "برنس استحمام قطني", "برنس حمام قطن", "housing"),
    ("noun", "zapatillas de casa", "f", "A1", "خف منزلي مريح (شبشب)", "شبشب بيت مريح", "housing"),
    ("noun", "mocasines", "m", "A2", "حذاء خفيف بدون أربطة (موكاسان)", "شوز موكاسان خفيف", "shopping"),
    ("noun", "zapatos de tacón", "m", "A2", "حذاء نسائي ذو كعب عالٍ", "شوز كعب عالي حريمي", "shopping"),
    ("noun", "botines de cuero", "m", "A2", "حذاء شتوي قصير من الجلد", "هاف بوت جلد شيك", "shopping"),
    ("noun", "chanclas de playa", "f", "A1", "صندل إصبع صيفي للبحر", "شبشب فليب فلوب للبحر", "travel"),
    ("noun", "zapatillas deportivas", "f", "A1", "حذاء رياضي مريح للجري", "كوتشي رياضي جري", "sports"),
    ("noun", "boina", "f", "B1", "قبعة مستديرة صوفية (بيريه)", "بيريه صوف ع الراس", "shopping"),
    ("noun", "gorro de lana", "m", "A1", "طاقية صوفية شتوية دافئة", "أيس كاب صوف للشتا", "shopping"),
    ("noun", "visera deportiva", "f", "A2", "قناع واقٍ للشمس بلا قبة", "كاب شمس مفتوح للرياضة", "sports"),
    ("noun", "pañuelo de cuello", "m", "A2", "منديل عنق حريري أنيق", "سكارف وفولار رقبة حرير", "shopping"),
    ("noun", "pajarita", "f", "B1", "ربطة عنق على شكل فراشة (بابيون)", "بابيون سهرة للبدلة", "shopping"),
    ("noun", "tirantes", "m", "B1", "حمّالات بنطال مطاطية", "حمالات بنطلون كلاسيك", "shopping"),
    ("noun", "gemelos de camisa", "m", "B2", "أزرار أكمام القميص الرسمية", "كبك بدلة وقميص", "shopping"),
    ("noun", "pasador de corbata", "m", "B2", "مشبك ربطة العنق المعدني", "دبوس كرافتة شيك", "shopping"),
    ("noun", "pendientes de plata", "m", "A2", "أقراط فضية للأذنين (حلق)", "حلق فضة ودلاية", "shopping"),
    ("noun", "pulsera de oro", "f", "A2", "سوار ذهبي للرسغ (غويشة)", "غويشة وإسورة دهب", "shopping"),
    ("noun", "colgante", "m", "A2", "دلاية عقد متدلية من السلسلة", "دلاية سلسلة ع الصدر", "shopping"),
    ("noun", "broche de brillantes", "m", "B1", "دبوس زينة ومرصع (بروش)", "بروش الماظ للجاكيت", "shopping"),

    # --- Fabrics & Textures (الأقمشة والمنسوجات) ---
    ("noun", "terciopelo", "m", "B1", "قماش القطيفة والحرير الناعم", "قماش قطيفة ناعم", "shopping"),
    ("noun", "pana", "f", "B1", "قماش المخمل المضلع الدافئ", "قماش كوردروي مضلع", "shopping"),
    ("noun", "ante", "m", "B2", "جلد الغزال السويدي المقلوب", "جلد سويد وشامواه", "shopping"),
    ("noun", "piel sintética", "f", "B1", "جلد صناعي صديق للبيئة", "جلد صناعي اسكاي", "shopping"),
    ("noun", "poliéster", "m", "A2", "خيوط البوليستر الصناعية المتينة", "بوليستر خفيف وقوي", "shopping"),
    ("noun", "nailon", "m", "A2", "قماش النايلون الخفيف المقاوم", "نايلون وتربروف", "shopping"),
    ("noun", "licra", "f", "A2", "نسيج الليكرا المطاطي للرياضة", "قماش ليكرا استريتش", "sports"),
    ("noun", "franela", "f", "B1", "قماش الفانيلا الصوفي الناعم", "قماش كستور وفلانيل دافي", "shopping"),
    ("noun", "encaje de bolillos", "m", "B2", "دانتيل مخرم ومطرز بدقة", "دانتيل وشبيكة مطرزة", "arts"),
    ("noun", "satén", "m", "B1", "قماش الساتان اللامع الناعم", "قماش ستان بيلمع وشيك", "shopping"),
    ("noun", "gasa", "f", "B1", "شاش ناعم ونسيج رقيق شفاف", "شاش وقماش خفيف رقيق", "shopping"),
    ("noun", "lona resistente", "f", "B1", "قماش الخيش المشمع والكانفاس", "قماش كانفاس متين وخيمة", "tools"),
    ("noun", "fieltro", "m", "B1", "قماش اللباد الصوفي المضغوط", "لباد صوف مضغوط للحرف", "arts"),
    ("noun", "arpillera", "f", "B2", "قماش الخيش الخشن للأكياس", "خيش بني شكاير بطاطس", "tools"),
    ("noun", "estampado floral", "m", "A2", "قماش منقوش بزخارف الأزهار", "قماش مشجر ورد", "shopping"),
    ("noun", "tejido elástico", "m", "A2", "قماش مطاطي مرن للحركة", "قماش استريتش مرن", "sports"),

    # --- Kitchenware & Utensils (أواني المطبخ والطبخ) ---
    ("noun", "cacerola", "f", "A2", "طنجرة وقدر طبخ عميق بمقبضين", "حلة طبيخ وسط بيدين", "food"),
    ("noun", "olla a presión", "f", "A2", "طنجرة الضغط السريع (حلة بريستو)", "حلة ضغط وبريستو", "food"),
    ("noun", "cazo", "m", "A2", "كاسرولة تسخين بمقبض طويل", "كنكة وحلة صغيرة بيد طويلة", "food"),
    ("noun", "tetera de porcelana", "f", "A2", "إبريق شاي من الخزف الفاخر", "براد شاي صيني شيك", "food"),
    ("noun", "cafetera italiana", "f", "A1", "صانعة قهوة إيطالية تقليدية", "كنكة إسبريسو إيطالي ع النار", "food"),
    ("noun", "tostadora de pan", "f", "A1", "محمصة خبز كهربائية (توستر)", "توستر تحميص عيش", "food"),
    ("noun", "batidora de mano", "f", "A2", "خلاط يدوي عمودي (هاند بلندر)", "هاند بلندر وخلاط يدوي", "food"),
    ("noun", "licuadora de zumos", "f", "A2", "عصارة فواكه وخلاط عصير", "عصارة فواكه وخلاط عصير", "food"),
    ("noun", "exprimidor eléctrico", "m", "A1", "عصارة برتقال وحمضيات كهربائية", "عصارة برتقال بالكهربا", "food"),
    ("noun", "microondas con grill", "m", "A1", "فرن ميكروويف مع شواية", "ميكروويف بالشواية", "housing"),
    ("noun", "freidora de aire", "f", "A2", "مقلاة هوائية صحية بدون زيت", "قلاية هوائية إيرفراير", "food"),
    ("noun", "campana extractora", "f", "B1", "شفاط مطبخ ساحب للأبخرة", "شفاط روائح وبخار المطبخ", "housing"),
    ("noun", "fregadero", "m", "A1", "حوض غسيل الأواني والمجلى", "حوض المطبخ لغسيل المواعين", "housing"),
    ("noun", "escurridor de platos", "m", "A2", "مصفاة الأواني والصحون المغسولة", "صفاية مواعين وأطباق", "housing"),
    ("noun", "tabla de cortar", "f", "A1", "لوح تقطيع خضار ولحوم خشبي", "بلانشة تقطيع خضار وخشب", "food"),
    ("noun", "cuchara de madera", "f", "A1", "ملعقة خشبية لتقليب الطعام", "معلقة خشب للطبيخ", "food"),
    ("noun", "espumadera", "f", "B1", "مغرفة مثقبة لنزع الرغوة والقلي", "كبشة مخرمة للتحمير", "food"),
    ("noun", "cucharón de sopa", "m", "A2", "مغرفة حساء عميقة لغرف المرق", "كبشة شوربة غويطة", "food"),
    ("noun", "rallador de queso", "m", "A2", "مبشرة جبن وخضراوات مسننة", "مبشرة بصل وجبنة رومي", "food"),
    ("noun", "pelador de patatas", "m", "A2", "قشارة بطاطس وخضار يدوية", "قشارة بطاطس ومقوار", "food"),
    ("noun", "colador fino", "m", "A1", "مصفاة دقيقة لتصفية السوائل", "صفاية شاي ومكرونة ناعمة", "food"),
    ("noun", "pasapurés", "m", "B1", "هراسة بطاطس وخضراوات يدوية", "هراسة بطاطس مسلوقة", "food"),
    ("noun", "mortero de mármol", "m", "B1", "هاون ومدقة من الرخام للبهارات", "هون رخام لدق التوم", "food"),
    ("noun", "embudo de plástico", "m", "A2", "قمع بلاستيكي لصب السوائل", "قمع بلاستيك لصب المية والزيت", "tools"),
    ("noun", "rodillo de cocina", "m", "A2", "نشابة فرد العجين الخشبية", "نشابة ومردانة فرد العجين", "food"),
    ("noun", "molde para pasteles", "m", "A2", "قالب خبز الكعك والحلويات بالفرن", "صينية وقالب كيكة", "food"),
    ("noun", "sacacorchos", "m", "A2", "فتاحة فلين لقوارير الزجاج", "فتاحة فلين ازايز", "food"),
    ("noun", "fiambrera hermética", "f", "A2", "حافظة طعام محكمة الإغلاق (لانش بوكس)", "علبة تبروير ولانش بوكس", "food"),
    ("noun", "termo de café", "m", "A2", "قارورة حفظ الحرارة الساخنة (ترمس)", "ترمس شاي وقهوة سخن", "food"),
    ("noun", "jarra de agua", "f", "A1", "إبريق ماء زجاجي للشرب", "شفشق مية إزاز للسفرة", "food"),
    ("noun", "plato hondo", "m", "A1", "صحن حساء عميق للشوربة", "طبق غويط للشوربة والخضار", "food"),
    ("noun", "plato llano", "m", "A1", "صحن مسطح للأطباق الرئيسية", "طبق مسطح للرز واللحمة", "food"),
    ("noun", "plato de postre", "m", "A1", "صحن صغير للحلوى والفواكه", "طبق جاتوه وفاكهة صغير", "food"),
    ("noun", "cuenco de cereales", "m", "A1", "سلطانية حبوب الفطور والحليب", "بولة كورن فليكس ولبن", "food"),
    ("noun", "taza de té", "f", "A1", "كوب شاي ذو مقبض", "مج وفنجان شاي بإيد", "food"),
    ("noun", "copa de cristal", "f", "A2", "كأس زجاجية فاخرة ذات ساق", "كاس إزاز كريستال للعصير", "food"),
    ("noun", "vaso de tubo", "m", "A1", "كوب ماء أسطواني طويل", "كوباية عصير طويلة", "food"),
    ("noun", "cubiertos de acero", "m", "A1", "طقم ملاعق وسكاكين وشوك", "طقم شوك ومعالق وسكاكين", "food"),
    ("noun", "mantel antimanchas", "m", "A2", "مفرش طاولة مقاوم للبقع وسهل التنظيف", "مفرش سفرة ضد البقع", "housing"),
    ("noun", "servilleta de tela", "f", "A1", "منديل مائدة قماشي أنيق", "فوطة سفرة قماش", "food"),
    ("noun", "delantal de cocina", "m", "A1", "مريلة مطبخ لحماية الثياب", "مريلة مطبخ للطبيخ", "food"),
    ("noun", "paño de cocina", "m", "A1", "فوطة تجفيف الأيدي والأواني بالمطبخ", "فوطة مطبخ لتنشيف المواعين", "housing"),

    # --- Furniture & Home Fixtures (الأثاث ومستلزمات الغرف) ---
    ("noun", "mesa de comedor", "f", "A1", "طاولة غرفة الطعام الكبرى", "تربيزة سفرة كبيرة", "housing"),
    ("noun", "silla ergonómica", "f", "A2", "كرسي مريح وصحي للظهر والمكتب", "كرسي مكتب طبي مريح", "work"),
    ("noun", "taburete alto", "m", "A2", "مقعد مرتفع بلا ظهر للمطبخ (بار)", "كرسي بار عالي", "housing"),
    ("noun", "sillón orejero", "m", "B1", "كرسي وثير ذو مساند رأس جانبية", "فوتيه وثير مريح للقراية", "housing"),
    ("noun", "sofá de tres plazas", "m", "A1", "أريكة صالون تتسع لثلاثة أشخاص", "كنبة صالون تلاتة أفراد", "housing"),
    ("noun", "mesita de noche", "f", "A1", "طاولة صغيرة بجانب السرير (كومودينو)", "كومودينو جنب السرير", "housing"),
    ("noun", "mesita de centro", "f", "A1", "طاولة قهوة منخفضة لوسط الصالون", "تربيزة قهوة في نص الصالة", "housing"),
    ("noun", "estantería de madera", "f", "A1", "أرفف كتب خشبية متينة", "رفوف مكتبة خشب للكتب", "housing"),
    ("noun", "aparador de salón", "m", "B1", "خزانة أوانٍ وصحون للصالون (بوفيه)", "بوفيه سفرة لحفظ الصيني", "housing"),
    ("noun", "vitrina de cristal", "f", "A2", "خزانة عرض زجاجية للتحف", "نيش ودولاب إزاز للتحف", "housing"),
    ("noun", "cómoda de cajones", "f", "A2", "خزانة أدراج لحفظ الملابس (كومود)", "تسريحة ودولاب أدراج هدوم", "housing"),
    ("noun", "armario empotrado", "m", "A2", "خزانة ملابس مدمجة في الجدار (دولاب)", "دولاب حائط بلت إن", "housing"),
    ("noun", "perchero de pie", "m", "A1", "شماعة معاطف وقبعات عمودية بالمدخل", "شماعة هدوم واقفة بالمدخل", "housing"),
    ("noun", "zapatero cerrado", "m", "A2", "خزانة أحذية مغلقة ومنظمة", "جزامة جزم مقفولة", "housing"),
    ("noun", "cabecero de cama", "m", "A2", "لوح رأس السرير الخشبي أو المنجد", "ضهر وراس السرير المنجد", "housing"),
    ("noun", "somier de láminas", "m", "B1", "قاعدة سرير خشبية مرنة للمرتبة", "ملة سرير خشب متينة", "housing"),
    ("noun", "colchón viscoelástico", "m", "A2", "مرتبة نوم طبية ذات رغوة ذكية", "مرتبة سرير طبية ميموري فوم", "housing"),
    ("noun", "edredón nórdico", "m", "A2", "لحاف شتوي دافئ ومحشو بالريش", "لحاف فايبر شتوي دافي", "housing"),
    ("noun", "manta de lana", "f", "A1", "بطانية صوفية ثقيلة دافئة", "بطانية صوف تقيلة", "housing"),
    ("noun", "sábana bajera", "f", "A2", "ملاءة سرير سفلية مطاطية محكمة", "ملاية سرير باستك ماسكة في المرتبة", "housing"),
    ("noun", "sábana encimera", "f", "A2", "ملاءة سرير علوية للتغطية", "ملاية سرير مفرودة فوقانية", "housing"),
    ("noun", "funda de almohada", "f", "A1", "غطاء وسادة النوم وقماشتها (كيس مخدة)", "كيس مخدة قطن ناعم", "housing"),
    ("noun", "persiana enrollable", "f", "A2", "ستارة معدنية خارجية دوارة (شيش حصيرة)", "شيش حصيرة بالنافذة", "housing"),
    ("noun", "estor translúcido", "m", "B1", "ستارة رول قماشية نافذة للضوء", "ستارة رول خفيفة بتدخل ضوء", "housing"),
    ("noun", "lámpara de pie", "f", "A1", "مصباح إنارة أرضي قائم بالصالون", "أباجورة طويلة واقفة ع الأرض", "housing"),
    ("noun", "lámpara de techo", "f", "A1", "ثريا ومصباح سقف معلق (نجفة)", "نجفة سقف مودرن منورة", "housing"),
    ("noun", "flexo de escritorio", "m", "A2", "مصباح مكتب مفصلي موجه للقراءة", "أباجورة مكتب للمذاكرة", "study"),
    ("noun", "espejo de cuerpo entero", "m", "A2", "مرآة طويلة عاكسة لكامل الجسم", "مراية طولية تشوف الجسم كله", "housing"),
    ("noun", "jarrón de cerámica", "m", "A2", "مزهرية فخارية أنيقة للورود", "فازة ورد بورسلين وخزف", "arts"),

    # --- Commerce & Shopping Verbs (أفعال التسوق والتجارة) ---
    ("verb", "regatear", "ar", "B1", "فاصل في السعر طلباً للتخفيض", "فاصل ونزل في السعر مع البياع", "shopping"),
    ("verb", "desembolsar", "ar", "B2", "دفع مبالغ نقدية من جيبه", "دفع وصرف فلوس من جيبه", "shopping"),
    ("verb", "devolver", "o-ue", "A1", "أرجع السلعة واسترد ثمنها", "رجع البضاعة واسترد فلوسه", "shopping"),
    ("verb", "cambiar", "ar", "A1", "استبدل المقاس بمقاس أصغر", "بدل المقاس بحاجة تانية", "shopping"),
    ("verb", "probarse", "o-ue", "A1", "قاس الفستان أو الحذاء في المحل", "قاس الطقم في البروفة", "shopping"),
    ("verb", "facturar", "ar", "A2", "أصدر فاتورة رسمية بالبيع", "طلع فاتورة ضريبية رسمية", "work"),
    ("verb", "liquidar", "ar", "B1", "صفّى البضاعة بأسعار مخفضة جداً", "صفى البضاعة بحرق أسعار", "shopping"),
    ("verb", "adquirir", "ir", "B1", "اشترى واقتنى أثاثاً جديداً", "اشترى واقتنى عفش جديد للبيت", "shopping"),
    ("verb", "etiquetar", "ar", "A2", "وضع ملصقات الأسعار على السلع", "حط تيكيت السعر ع الهدوم", "shopping"),
    ("verb", "envolver", "o-ue", "A1", "غلّف الهدية بالورق المزين", "لف الهدية بالورق والشريطة", "shopping"),
    ("verb", "reembolsar", "ar", "B1", "ردّ وأرجع المبلغ المدفوع للمشتري", "رجع الفلوس لحساب العميل", "shopping"),
    ("verb", "encargar", "ar", "A2", "أوصى وطلب طلبيّة مخصصة", "وصى على طلبية مخصوصة", "shopping"),
    ("verb", "abastecer", "er", "B2", "موّن المتجر بالسلع الطازجة", "ملى الرفوف بضاعة ومؤن", "shopping"),
    ("verb", "agotar", "ar", "A2", "نفدت البضاعة من على الرفوف", "شطبت وخلصت البضاعة من المحل", "shopping"),
    ("verb", "rebajar", "ar", "A2", "خفض السعر وعمل خصماً", "نزل السعر وعمل خصم حلو", "shopping"),
]

def main():
    existing = get_existing_norms(exclude_slugs={"cv-topic-commerce-home"})
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
            ex_es = f"{art} {headword} resulta muy práctico para el hogar moderno."
            ex_ar = f"يعد الـ{msa} عملياً ومفيداً جداً في المنزل العصري."
            entry = make_noun(headword, gender, level, msa, eg, ex_es, ex_ar, domain=domain, rank=rank)
        elif kind == "verb":
            paradigm = row[2]
            level = row[3]
            msa = row[4]
            eg = row[5]
            domain = row[6]
            ex_es = f"Los clientes suelen {headword} en las tiendas del centro."
            ex_ar = f"يعتاد الزبائن أن {msa} في متاجر وسط المدينة."
            entry = make_verb(headword, paradigm, level, msa, eg, ex_es, ex_ar, domain=domain, rank=rank)
        elif kind == "adj":
            level = row[3]
            msa = row[4]
            eg = row[5]
            domain = row[6]
            ex_es = f"Este producto cuenta con una calidad {headword} excelente."
            ex_ar = f"يتميز هذا المنتج بجودة {msa} ممتازة للغاية."
            entry = make_adj(headword, level, msa, eg, ex_es, ex_ar, domain=domain, rank=rank)
        else:
            continue

        entries.append(entry)
        existing.add(norm)
        rank += 1

    print(f"Commerce & Home: Prepared {len(entries)} new entries (skipped {skipped} existing).")
    emit_bundle("vocab-cv-topic-commerce-home.json", "cv-topic-commerce-home", "التجارة والملابس والمنزل والمطبخ والأثاث", entries)

if __name__ == "__main__":
    main()
