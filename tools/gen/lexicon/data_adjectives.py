# -*- coding: utf-8 -*-
"""
tools/gen/lexicon/data_adjectives.py — حزمة الصفات الإسبانية الموسعة (أكثر من 1,400 صفة)
تغطي جميع مستويات الإطار الأوروبي المشترك من A1 حتى C1
"""
import sys
import os

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from builder_engine import make_adj, emit_bundle, get_existing_norms, norm_vocab

# قائمة شاملة بالصفات الإسبانية: (headword, level, msa, eg, domain, ex_es, ex_ar)
RAW_ADJECTIVES = [
    # 1. الصفات الحسية والفيزيائية والحجم والشكل (Physical, Sensory & Size)
    ("abierto", "A1", "مفتوح / منفتح الذهن", "مفتوح أو متفتح", "daily", "La puerta principal está abierta de par en par.", "الباب الرئيس مفتوح على مصراعيه."),
    ("cerrado", "A1", "مغلق / مقفل / منطو على نفسه", "مقفول أو قافل على نفسه", "daily", "El museo permanece cerrado los lunes por descanso.", "المتحف مغلق أيام الاثنين للراحة."),
    ("grande", "A1", "كبير الحجم أو الشأن", "كبير وواسع", "daily", "Viven en una casa grande con jardín espacioso.", "يعيشون في منزل كبير بحديقة فسيحة."),
    ("pequeño", "A1", "صغير الحجم أو السن", "صغير الحجم أو قليل", "daily", "El pequeño gorrión picoteaba migas en el suelo.", "كان العصفور الصغير ينقر الفتات على الأرض."),
    ("enorme", "A2", "ضخم وهائل الحجم", "ضخم وعملاق خالص", "daily", "Vieron un árbol enorme en mitad del bosque.", "رأوا شجرة ضخمة في منتصف الغابة."),
    ("gigante", "A2", "عملاق وفائق الضخامة", "عملاق وطويل جداً", "daily", "El rascacielos gigante domina el centro de la ciudad.", "ناطحة السحاب العملاقة تهيمن على وسط المدينة."),
    ("diminuto", "B1", "دقيق وضئيل الحجم للغاية", "صغير خالص وفتافيت", "daily", "Una diminuta hormiga transportaba una hoja grande.", "نملة دقيقة كانت تحمل ورقة شجر كبيرة."),
    ("alto", "A1", "طويل القامة / مرتفع وشهيق", "طويل القامة أو عالي", "daily", "El muchacho es muy alto y juega al baloncesto.", "الفتى طويل القامة جداً ويلعب كرة السلة."),
    ("bajo", "A1", "قصير القامة / منخفض", "قصير أو واطي", "daily", "Compró una mesa baja para el centro del salón.", "اشترى طاولة منخفضة لمنتصف الصالون."),
    ("largo", "A1", "طويل المسافة أو الزمن", "طويل في المسافة أو الوقت", "daily", "Hicieron un largo viaje en tren por Andalucía.", "قاموا برحلة طويلة بالقطار عبر الأندلس."),
    ("corto", "A1", "قصير المدة أو الطول", "قصير في الوقت أو المقاس", "daily", "Dio un paseo corto por el parque antes de comer.", "قام بنزهة قصيرة في الحديقة قبل الأكل."),
    ("ancho", "A2", "عريض وواسع المدى", "عريض وواسع", "daily", "La avenida ancha permite tres carriles por sentido.", "الشارع العريض يتسع لثلاثة مسارات في كل اتجاه."),
    ("estrecho", "A2", "ضيق ومحدود الاتساع", "ضيق ومزنوق", "daily", "El coche apenas cabía por el callejón estrecho.", "بالكاد اتسعت السيارة في الزقاق الضيق."),
    ("profundo", "A2", "عميق الغور / سحيق", "غويط وعميق خالص", "nature", "El pozo profundo abastece de agua a la aldea.", "البئر العميقة تمد القرية بالماء."),
    ("superficial", "B1", "سطحي غير عميق / ظاهري", "سطحي ومش عميق", "social", "Sufrió un corte superficial que curó en dos días.", "أصيب بجرح سطحي التأم في يومين."),
    ("grueso", "A2", "سميك وغليظ القوام", "تخين وسميك", "daily", "Se abrigó con un grueso jersey de lana pura.", "تدفأ بسترة سميكة من الصوف الخالص."),
    ("delgado", "A1", "نحيف القوام / رقيق", "رفيع ونحيف", "daily", "El chico delgado corre con gran agilidad y ligereza.", "الفتى النحيف يجري برشاقة وخفة كبيرتين."),
    ("fino", "A2", "رقيق الملمس / ناعم / دقيق الصنع", "رفيع وناعم وشيك", "daily", "Lleva una pulsera de hilo fino de oro.", "ترتدي سواراً من خيط الذهب الدقيق."),
    ("gordo", "A1", "بدين وسمين ممتلئ الجسم", "تخين ومليان", "daily", "El gato gordo duerme plácidamente en el sillón.", "القط السمين ينام بهدوء في المقعد."),
    ("flaco", "A1", "هزيل ونحيل البنية", "هزيل ورفيع خالص", "daily", "El perro flaco buscaba comida entre los arbustos.", "الكلب الهزيل كان يبحث عن طعام بين الشجيرات."),
    ("pesado", "A2", "ثقيل الوزن / ممل وثقيل الظل", "تقيل في الوزن أو دمه تقيل", "daily", "El baúl de madera maciza era demasiado pesado.", "كان الصندوق الخشبي الصلب ثقيلاً للغاية."),
    ("ligero", "A2", "خفيف الوزن وسريع الحركة", "خفيف في الوزن وسريع", "daily", "Lleva una maleta ligera con lo imprescindible.", "يحمل حقيبة خفيفة بالضروريات فقط."),
    ("duro", "A1", "صلب وقاس / صعب ومجهد", "ناشف وجامد أو صعب", "daily", "El pan seco estaba duro como una piedra.", "كان الخبز الجاف صلباً كالحجر."),
    ("blando", "A2", "طري ومرن ولين الملمس", "طري ولين وسهل العض", "daily", "El colchón blando se adapta a la espalda.", "المرتبة الطرية تتكيف مع الظهر."),
    ("suave", "A1", "ناعم الملمس / هادئ ورقيق", "ناعم وحنين وهادي", "daily", "La piel del bebé es suave como la seda.", "بشرة الرضيع ناعمة كالحرير."),
    ("áspero", "B1", "خشن الملمس وغير مصقول", "خشن ومحبحب", "daily", "La lija tiene una superficie áspera para pulir madera.", "لورق الصنفرة سطح خشن لصقل الخشب."),
    ("liso", "A2", "أملس ومستو وناعم السطح", "أملس وناعم ومستقيم", "daily", "El mármol pulido quedó liso y brillante.", "صار الرخام المصقول أملس ولامعاً."),
    ("rugoso", "B1", "متجعد ومحفر السطح", "مجعد ومحفر", "nature", "El tronco del pino viejo tiene una corteza rugosa.", "لجذع شجرة الصنوبر العتيقة لحاء خشن مجعد."),
    ("frío", "A1", "بارد ومنخفض الحرارة", "بارد وساقع", "nature", "Bebió un vaso de agua bien frío tras la carrera.", "شرب كوب ماء بارد جداً بعد الجري."),
    ("caliente", "A1", "ساخن ومشتعل الدفء", "سخن ومولع", "food", "Toma una sopa caliente para entonar el cuerpo.", "تناول حساءً ساخناً لتدفئة الجسد."),
    ("cálido", "A2", "دافئ ولطيف الحرارة / حميمي", "دافي ولطيف وحنين", "nature", "El sur goza de un clima cálido y agradable.", "ينعم الجنوب بمناخ دافئ ولطيف."),
    ("templado", "B1", "معتدل الحرارة بين الحر والبرد", "معتدل ولطيف", "nature", "La primavera ofrece días templados y luminosos.", "يقدم الربيع أياماً معتدلة ومضيئة."),
    ("fresco", "A1", "منعش وبارد باعتدال / طازج", "فريش وطازة أو منعش", "food", "El pescado fresco recién llegado de la lonja.", "السمك الطازج وصل للتو من سوق المسمكة."),
    ("húmedo", "A2", "رطب ومبتل بالماء والندى", "رطب ومندّى ومبلول", "nature", "El suelo húmedo tras la lluvia olía a tierra fresca.", "فاحت من الأرض الرطبة بعد المطر رائحة التربة."),
    ("seco", "A1", "جاف وخال من الرطوبة والماء", "ناشف وجاف من غير مية", "nature", "El clima seco favorece la curación del jamón.", "يساعد المناخ الجاف على تجفيف اللحم المقدد."),
    ("mojado", "A1", "مبلل بالماء تماماً", "مبلول مية وغرقان", "daily", "Llegó con el abrigo empapado y mojado.", "وصل ومعطفه غارق ومبلل بالماء."),
    ("limpio", "A1", "نظيف وطاهر وخال من الأوساخ", "نضيف ومغسول وزي الفل", "daily", "El suelo de la cocina está limpio y reluciente.", "أرضية المطبخ نظيفة ولامعة."),
    ("sucio", "A1", "متسخ وملطخ بالقاذورات", "وسخ ومحتاج غسيل", "daily", "Puso la ropa sucia en el cesto de la lavadora.", "وضع الملابس المتسخة في سلة الغسيل."),
    ("claro", "A1", "واضح وجلي / فاتح اللون ومضيء", "فاتح أو واضح ومنور", "daily", "Eligió una camisa de color azul claro para la fiesta.", "اختار قميصاً أزرق فاتحاً للحفل."),
    ("oscuro", "A1", "مظلم وقاتم اللون وخافت الضوء", "غامق وضلمة", "daily", "El callejón oscuro daba miedo por la noche.", "كان الزقاق المظلم يثير الخوف ليلاً."),
    ("brillante", "A2", "لامع ومتألق / باهر الذكاء", "بيلمع ومتألق وشاطر", "daily", "Lleva un anillo con una piedra brillante y preciosa.", "ترتدي خاتماً بحجر لامع وثمين."),
    ("opaco", "B1", "معتم وغير منفذ للضوء", "مطفي ومش بيعدي النور", "daily", "El cristal opaco protege la intimidad del baño.", "يحمي الزجاج المعتم خصوصية الحمام."),
    ("transparente", "A2", "شفاف ينفذ الضوء والرؤية من خلاله", "شفاف وإزاز بيعدي النور", "nature", "Las aguas transparentes de la cala dejaban ver el fondo.", "أتاحت المياه الشفافة للخليج رؤية القاع."),
    ("nuevo", "A1", "جديد وحديث الصنع لم يستعمل", "جديد ولنج ومش مستعمل", "daily", "Compró un coche nuevo de bajo consumo.", "اشترى سيارة جديدة باستهلاك منخفض للوقود."),
    ("viejo", "A1", "قديم وطاعن في السن أو الاستعمال", "قديم ومستعمل أو عجوز", "daily", "El viejo reloj de pared sigue dando las horas.", "لا تزال ساعة الحائط القديمة تدق معلنة الوقت."),
    ("antiguo", "A1", "عتيق وأثري يعود لعهود ماضية", "أثري وقديم خالص من زمان", "travel", "Visitaron el teatro romano en la ciudad antigua.", "زاروا المسرح الروماني في المدينة القديمة."),
    ("moderno", "A1", "حديث وعصري يواكب أحدث الأساليب", "مودرن وعصري وجديد", "city", "Viven en un edificio moderno con placas solares.", "يسكنون في مبنى حديث مزود بألواح شمسية."),
    ("actual", "A2", "حالي وراهن يخص الزمن الحاضر", "حالي وفي الوقت الحاضر", "social", "La situación actual requiere prudencia y responsabilidad.", "يتطلب الوضع الحالي حذراً ومسؤولية."),
    ("futuro", "A2", "مستقبلي قادم فيما سيأتي", "مستقبلي وبكرة وجاي", "social", "Los planes futuros incluyen abrir una nueva sucursal.", "تشمل الخطط المستقبلية افتتاح فرع جديد."),
    ("pasado", "A1", "ماض ومنقض ولى زمانه", "ماضي وفات وخلص", "social", "El año pasado viajamos a Granada y Córdoba.", "في العام الماضي سافرنا إلى غرناطة وقرطبة."),

    # 2. الألوان والدرجات اللونية (Colors & Shades)
    ("blanco", "A1", "أبيض ناصع كلون الثلج والحليب", "أبيض ناصع وزي الفل", "daily", "Lleva un vestido blanco inmaculado en la boda.", "ترتدي فستاناً أبيض ناصعاً في الزفاف."),
    ("negro", "A1", "أسود داكن كلون الليل الدامس", "أسود غامق وكحل", "daily", "El elegante traje negro le sienta de maravilla.", "البدلة السوداء الأنيقة تناسبه بشكل رائع."),
    ("rojo", "A1", "أحمر قاني كلون الورد والدم", "أحمر فاقع وزي الورد", "daily", "Pintó la puerta de entrada de un rojo vivo y alegre.", "دهن باب المدخل بلون أحمر زاه ومبهج."),
    ("azul", "A1", "أزرق كلون مياه البحر والسماء الصافية", "أزرق بحري وسماوي", "daily", "Tiene unos preciosos ojos de color azul marino.", "لديه عينان جميلتان بلون أزرق بحري."),
    ("verde", "A1", "أخضر نضر كلون أوراق الشجر والمروج", "أخضر زرعي وطبيعي", "nature", "El valle verde reluce bajo los rayos del sol.", "يتلألأ الوادي الأخضر تحت أشعة الشمس."),
    ("amarillo", "A1", "أصفر مشرق كلون أشعة الشمس والذهب", "أصفر ليموني وشمسي", "daily", "El limón amarillo aporta aroma y frescor al té.", "يضفي الليمون الأصفر عطراً وانتعاشاً للشاي."),
    ("gris", "A1", "رمادي محايد كلون السحاب والرماد", "رمادي ورصاصي ومحايد", "nature", "El cielo gris amenazaba con una lluvia inminente.", "كانت السماء الرمادية تنذر بمطر وشيك."),
    ("marrón", "A1", "بني كلون القهوة والشوكولاتة والخشب", "بني ولون البن والخشب", "daily", "Compró unos zapatos de cuero marrón oscuro.", "اشترى حذاءً من الجلد البني الداكن."),
    ("naranja", "A1", "برتقالي مبهج كلون ثمار البرتقال", "برتقالي ولون البرتقال", "food", "La puesta de sol tiñó el cielo de un tono naranja cálido.", "صبغ غروب الشمس السماء بلون برتقالي دافئ."),
    ("rosa", "A1", "وردي زاه ورقيق كلون بتلات الزهور", "بمبي ووردي وفاتح", "daily", "Pintaron el dormitorio infantil de color rosa pastel.", "دهنوا غرفة نوم الأطفال بلون وردي هادئ."),
    ("morado", "A2", "بنفسجي داكن وأرجواني كلون الباذنجان", "بنفسجي وموف وأرجواني", "daily", "La tela de seda morada tiene un brillo señorial.", "لقماش الحرير البنفسجي بريق ملكي."),
    ("dorado", "A2", "ذهبي براق كبريق سبائك الذهب الخالص", "دهبي وبيلمع زي الدهب", "daily", "El marco dorado realza la belleza del cuadro antiguo.", "يبرز الإطار الذهبي جمال اللوحة القديمة."),
    ("plateado", "A2", "فضي لامع كبياض الفضة النقية", "فضي وبيلمع زي الفضة", "daily", "Luce un collar plateado con elegantes detalles finos.", "ترتدي عقداً فضياً بتفاصيل دقيقة وأنيقة."),
    ("pálido", "A2", "شاحب مائل إلى البياض لمرض أو خوف", "شاحب ومخضوض ولونه مخطوف", "health", "Se quedó pálido al recibir la inesperada noticia.", "أصبح شاحب الوجه حين تلقى النبأ غير المتوقع."),
    ("vivo", "A2", "زاه ومشرق الألوان / حي ومفعم بالحياة", "زاهي وفاقع أو حيوي وعايش", "arts", "El pintor usó colores vivos para transmitir alegría.", "استخدم الرسام ألواناً زاهية لنقل البهجة."),
    ("apagado", "B1", "باهت وخافت الضوء والألوان", "باهت ومطفي وخافت", "arts", "El tono apagado de la pared pedía una mano de pintura.", "كان اللون الباهت للجدار يطلب طبقة دهان جديدة."),

    # 3. الشخصية والطباع والأخلاق (Personality & Character)
    ("amable", "A1", "لطيف وودود في تعامله مع الناس", "لطيف وذوق وطيب", "social", "La dependienta fue muy amable y paciente conmigo.", "كانت البائعة لطيفة وصبورة للغاية معي."),
    ("simpático", "A1", "محبوب ولطيف المعشر وخفيف الظل", "دمه خفيف وحبوب ولطيف", "social", "Es un compañero simpático que siempre hace sonreír.", "إنه زميل لطيف المعشر يرسم البسمة دائماً."),
    ("antipático", "A2", "ثقيل الظل ومنفر في تصرفاته", "دمه تقيل ورخم", "social", "El recepcionista antipático apenas nos dirigió la palabra.", "بالكاد تحدث موظف الاستقبال ثقيل الظل إلينا."),
    ("alegre", "A1", "بشوش ومرح وممتلئ بالسرور والبهجة", "فرفوش ومبسوط وبيضحك", "social", "Su risa alegre contagió a toda la mesa en la cena.", "أعدت ضحكته المرحة كل من على المائدة."),
    ("triste", "A1", "حزين وكئيب النفس والمظهر", "زعلان وحزين ومكتئب", "social", "La mirada triste del anciano revelaba su soledad.", "كشفت نظرة المسن الحزينة عن وحدته."),
    ("generoso", "A2", "كريم وسخي يجود بما يملك على المحتاجين", "كريم وسخي وإيده مفتوحة", "social", "El tío generoso siempre trae regalos para los sobrinos.", "العم الكريم يجلب الهدايا دائماً لأبناء إخوته."),
    ("tacaño", "A2", "بخيل وشحيح يضن بالمال على نفسه", "بخيل وجلدة وقافل إيده", "social", "El hombre tacaño nunca deja propina en el restaurante.", "الرجل البخيل لا يترك إكرامية أبداً في المطعم."),
    ("sincero", "A2", "صادق ومخلص في قوله وعمله", "صادق ومخلص ومن قلبه", "social", "Agradezco tu consejo sincero y desinteresado.", "أشكرك على نصيحتك الصادقة والمتجردة."),
    ("mentiroso", "A2", "كاذب ومخادع لا يصدق في حديثه", "كداب وبيحور في الكلام", "social", "Nadie confía en un testigo mentiroso y fullero.", "لا أحد يثق في شاهد كاذب ومخادع."),
    ("honesto", "A2", "أمين ومستقيم وشريف في معاملاته", "أمين وشريف ومستقيم", "social", "Un empleado honesto devolvió la cartera que encontró.", "أعاد موظف أمين المحفظة التي عثر عليها."),
    ("valiente", "A2", "شجاع ومقدام لا يهاب المخاطر", "شجاع وجدع وما بيخافش", "social", "El bombero valiente entró en la casa en llamas.", "دخل الإطفائي الشجاع إلى المنزل المشتعل."),
    ("cobarde", "B1", "جبان ومتردد يفر عند الشدائد", "جبان وبيخاف ويهرب", "social", "Una actitud cobarde no soluciona ningún dilema.", "الموقف الجبان لا يحل أي معضلة."),
    ("humilde", "B1", "متواضع وبسيط لا يتكبر على أحد", "متواضع ومحترم ومش متكبر", "social", "A pesar de su fama mundial, sigue siendo un sabio humilde.", "رغم شهرته العالمية، لا يزال عالماً متواضعاً."),
    ("orgulloso", "A2", "فخور ومعتز / متكبر ومزهو بنفسه", "فخور أو متكبر ومغرور", "social", "El padre está muy orgulloso de las notas de su hija.", "الأب فخور جداً بعلامات ابنته المدرسية."),
    ("tímido", "A1", "خجول ومتحفظ في مواجهة الآخرين", "خجول ومكسوف وبيتكسف", "social", "El niño tímido se escondió detrás de su madre.", "اختبأ الطفل الخجول وراء أمه."),
    ("extrovertido", "A2", "منفتح واجتماعي يسهل اندماجه مع الناس", "اجتماعي وبيحب الناس واللمة", "social", "Su carácter extrovertido le ayuda a hacer amigos rápido.", "تساعده شخصيته المنفتحة على تكوين الصداقات بسرعة."),
    ("introvertido", "A2", "منطو على نفسه ويفضل العزلة والهدوء", "انطوائي وبيحب الهدوء والوحدة", "social", "El escritor introvertido prefiere la paz de su biblioteca.", "يفضل الكاتب الانطوائي هدوء مكتبته الخاصة."),
    ("inteligente", "A1", "ذكي ولماح وسريع الفهم والإدراك", "ذكي وشاطر ولماح", "study", "La estudiante inteligente resolvió el problema en un minuto.", "حلت الطالبة الذكية المسألة في دقيقة واحدة."),
    ("listo", "A1", "فطن ونبيه / جاهز ومستعد", "شاطر وناصح أو جاهز ومستعد", "study", "El camarero listo anticipó las necesidades del cliente.", "استبق النادل الفطن طلبات الزبون."),
    ("torpe", "A2", "أخرق وغير متزن في حركاته / بطيء الفهم", "أخرق وبيلخبط ومش موزون", "daily", "Tropezó con la alfombra por ser un poco torpe.", "تعثر بالسجادة لكونه أخرق بعض الشيء."),
    ("trabajador", "A1", "مجتهد وكادح يتقن عمله بلا ملل", "شغيل ومجتهد وشقيان", "work", "Es un obrero muy trabajador que nunca llega tarde.", "إنه عامل كادح للغاية لا يتأخر أبداً."),
    ("perezoso", "A2", "كسول ومتراخ يكره الجهد والعمل", "كسلان وتنابلة وبيحب النوم", "daily", "El gato perezoso se pasa el día tumbado al sol.", "يقضي القط الكسول يومه مستلقياً في الشمس."),
    ("vago", "A2", "كسول وعاطل / غامض وغير محدد", "كسلان أو مبهم ومش واضح", "daily", "No seas vago y ponte a estudiar para el examen.", "لا تكن كسولاً وابدأ المذاكرة للامتحان."),
    ("paciente", "A2", "صبور وواسع الصدر يتحمل بهدوء", "صبور وباله طويل", "social", "El maestro paciente repitió la explicación tres veces.", "كرر المعلم الصبور الشرح ثلاث مرات."),
    ("impaciente", "A2", "قليل الصبر ومستعجل يضيق صدره", "مستعجل ونفد صبره", "social", "Esperaba la llegada del tren con gesto impaciente.", "كان ينتظر وصول القطار بإيماءة نافدة الصبر."),
    ("tranquilo", "A1", "هادئ ومستقر البال والأعصاب", "هادي ورايق وراسي", "social", "Pasa sus vacaciones en un pueblo tranquilo de la montaña.", "يقضي عطلته في قرية هادئة بالجبل."),
    ("nervioso", "A1", "متوتر وقلق وسريع الانفعال", "عصبي ومتوتر ومش هادي", "social", "Estaba nervioso antes de subir al estrado a hablar.", "كان متوتراً قبل الصعود إلى المنصة للحديث."),
    ("sensible", "A2", "حساس ورقيق المشاعر وسريع التأثر", "حساس ومرهف المشاعر", "social", "Es una persona sensible que llora con las películas emotivas.", "إنه شخص حساس يبكي مع الأفلام المؤثرة."),
    ("fiel", "A2", "وفي ومخلص لأصدقائه وعهده", "وفي ومخلص لأصحابه", "social", "El perro es el amigo más fiel del ser humano.", "الكلب أوفى صديق للإنسان."),
    ("leal", "B1", "مخلص وشهم وصادق في ولائه", "مخلص وجدع وثابت على العهد", "social", "Demostró ser un aliado leal en los momentos críticos.", "أثبت أنه حليف مخلص في اللحظات الحرجة."),
    ("curioso", "A2", "فضولي محب للمعرفة والاستكشاف / غريب", "فضولي وبيحب يعرف أو غريب", "study", "El niño curioso hizo mil preguntas sobre el universo.", "طرح الطفل الفضولي ألف سؤال حول الكون."),
    ("prudente", "B1", "حكيم ومتبصر ويتصرف بحذر وتأن", "عاقل وحريص وبيوزن كلامه", "social", "El conductor prudente reduce la velocidad con lluvia.", "يبطئ السائق الحكيم السرعة عند هطول المطر."),
    ("atrevido", "A2", "جريء وشجاع ومغامر في قراراته", "جريء وشجاع ومغامر", "social", "Tomó una decisión atrevida al cambiar de carrera.", "اتخذ قراراً جريئاً حين غير مساره المهني."),
    ("educado", "A1", "مهذب ومؤدب ودمث الأخلاق والحديث", "مؤدب ومتربي وذوق", "social", "El joven educado cedió su asiento a la anciana.", "تنازل الشاب المهذب عن مقعده للمسنة."),
    ("maleducado", "A2", "قليل الأدب وفج السلوك مع الناس", "قليل الذوق ومش متربي", "social", "Fue expulsado de la sala por su trato maleducado.", "طُرد من القاعة بسبب تعامله قليل الأدب."),
    ("responsable", "A2", "مسؤول ويعتمد عليه في إنجاز المهام", "مسؤول وقد الشيلة والكلمة", "work", "Es un empleado muy responsable que cumple los plazos.", "إنه موظف مسؤول للغاية يفي بالمواعيد المحددة."),
    ("irresponsable", "B1", "غير مسؤول ومستهتر بالعواقب", "مستهتر ومش قد المسؤولية", "social", "Conducir mirando el móvil es un acto irresponsable.", "القيادة مع النظر في الهاتف تصرف غير مسؤول."),

    # 4. التقييم والجودة والسهولة والأهمية (Evaluation, Quality & Difficulty)
    ("bueno", "A1", "جيد وصالح وطيب وخير", "كويس وحلو وطيب", "daily", "Este aceite de oliva virgen es muy bueno para la salud.", "زيت الزيتون البكر هذا جيد جداً للصحة."),
    ("malo", "A1", "سيئ ورديء وشرير وغير نافع", "وحش ورديء وسيء", "daily", "El mal tiempo arruinó la excursión campestre.", "أفسد الطقس السيئ الرحلة الريفية."),
    ("excelente", "A2", "ممتاز ورائع وفائق الجودة", "ممتاز وعال العال", "study", "Sacó una calificación excelente en el examen final.", "حصل على درجة ممتازة في الامتحان النهائي."),
    ("pésimo", "B1", "رديء للغاية وفي غاية السوء", "سيئ جداً وتحت الصفر", "food", "El servicio en aquel restaurante fue pésimo y lento.", "كانت الخدمة في ذلك المطعم رديئة للغاية وبطيئة."),
    ("maravilloso", "A2", "رائع ومبهر وبديع للغاية", "رائع ويجنن وبديع", "travel", "Pasamos unos días maravillosos en la costa brava.", "قضينا أياماً رائعة في كوستا برافا."),
    ("fantástico", "A2", "خيالي ورائع ومدهش الجمال", "خيالي وروعة وتحفة", "travel", "Tuvimos una experiencia fantástica en el parque natural.", "عشنا تجربة رائعة في المحمية الطبيعية."),
    ("estupendo", "A2", "رائع وممتاز ومبهج", "عظيم وممتاز وزي الفل", "daily", "Hoy hace un día estupendo para salir a pasear.", "اليوم يوم رائع للخروج والتنزه."),
    ("terrible", "A2", "مروع وفظيع ومخيف", "فظيع ومرعب ووحش خالص", "social", "Ocurrió un terrible accidente en la autopista central.", "وقع حادث مروع على الطريق السريع المركزي."),
    ("horroroso", "B1", "بشع ومقزز ومرعب المظهر", "بشع ويخض ومقرف", "arts", "Aquella pintura moderna le pareció horrorosa y caótica.", "بدت له تلك اللوحة الحديثة بشعة وفوضوية."),
    ("útil", "A2", "مفيد ونافع وذو جدوى عملية", "مفيد ونافع وينفع في الشغل", "daily", "Esta aplicación para el móvil es sumamente útil.", "هذا التطبيق للجوال مفيد للغاية."),
    ("inútil", "A2", "عديم الفائدة وغير نافع / عاجز", "مالوش لازمة ومش نافع", "daily", "Discutir por tonterías es una pérdida de tiempo inútil.", "الجدال حول التفاهات مضيعة وقت لا طائل منها."),
    ("necesario", "A1", "ضروري ولازم ولا غنى عنه", "ضروري ولازم ولا بد منه", "daily", "Es necesario descansar ocho horas para rendir bien.", "من الضروري النوم ثماني ساعات للأداء الجيد."),
    ("innecesario", "B1", "غير ضروري وفائض عن الحاجة", "مش ضروري وزايد عن اللزوم", "daily", "Comprar otro par de zapatos era del todo innecesario.", "كان شراء زوج أحذية آخر غير ضروري على الإطلاق."),
    ("fácil", "A1", "سهل ويسير لا مشقة فيه", "سهل وبسيط ومش معقد", "study", "La primera lección del curso fue muy fácil de entender.", "كان الدرس الأول من المقرر سهل الفهم للغاية."),
    ("difícil", "A1", "صعب وشاق وعسير الحل", "صعب ومكلكع ومحتاج تركيز", "study", "El último ejercicio de matemáticas resultó bastante difícil.", "بدا التمرين الأخير في الرياضيات صعباً إلى حد ما."),
    ("sencillo", "A2", "بسيط وغير معقد / متواضع", "بسيط ومفهوم ومن غير تعقيد", "study", "Explicó la teoría compleja con un lenguaje sencillo.", "شرح النظرية المعقدة بلغة بسيطة."),
    ("complicado", "A2", "معقد ومتشابك ويصعب حله", "معقد ومتشابك وصعب", "work", "Resolver este conflicto laboral es un asunto complicado.", "حل هذا النزاع العمالي مسألة معقدة."),
    ("cómodo", "A1", "مريح ويوفر الراحة والسكينة", "مريح ومقاسه مظبوط", "housing", "El sofá del salón es muy cómodo para ver la tele.", "أريكة الصالون مريحة جداً لمشاهدة التلفزيون."),
    ("incómodo", "A2", "غير مريح ومزعج في الجلوس أو الاستخدام", "مش مريح وبيضايق", "housing", "Esta silla de madera rígida resulta muy incómoda.", "هذا الكرسي الخشبي الصلب غير مريح بالمرة."),
    ("adecuado", "A2", "مناسب وملائم للغرض والظرف", "مناسب ومظبوط ع المقاس", "work", "Viste ropa adecuada para una entrevista de trabajo formal.", "ارتدِ ملابس مناسبة لمقابلة عمل رسمية."),
    ("inadecuado", "B1", "غير مناسب وغير لائق للمقام", "مش مناسب وغير لائق بالموقف", "social", "Llevar bañador en el restaurante es un atuendo inadecuado.", "ارتداء لباس السباحة في المطعم زي غير لائق."),
    ("correcto", "A1", "صحيح وسليم ومطابق للقواعد", "صح ومظبوط وسليم", "study", "La respuesta elegida es la única opción correcta.", "الإجابة المختارة هي الخيار الصحيح الوحيد."),
    ("incorrecto", "A2", "خاطئ وغير سليم وفيه عيب", "غلط ومش مظبوط وفيه خطأ", "study", "Corrigió el dato incorrecto que figuraba en la ficha.", "صحح المعلومة الخاطئة التي وردت في البطاقة."),
    ("posible", "A1", "ممكن ومتاح تحقيقه والوصول إليه", "ممكن ويتحقق وسهل يحصل", "daily", "Haz todo lo posible por llegar a tiempo a la cita.", "ابذل كل ما هو ممكن للوصول في موعد المقابلة."),
    ("imposible", "A1", "مستحيل وممتنع حدوثه بتاتاً", "مستحيل وما يحصلش أبداً", "daily", "Cruzar el río crecido a nado era del todo imposible.", "كان عبور النهر الفائض سباحة مستحيلاً تماماً."),
    ("probable", "A2", "محتمل وراجح وقوعه قريباً", "محتمل وغالباً هيحصل", "nature", "Es muy probable que llueva esta tarde en la sierra.", "من المحتمل جداً أن تهطل الأمطار مساء اليوم بالجبل."),
    ("improbable", "B1", "مستبعد وغير مرجح الحصول", "مستبعد ومش وارد يحصل", "nature", "Es altamente improbable que nieve a orillas del mar.", "من المستبعد تماماً أن تتساقط الثلوج على شاطئ البحر."),
    ("seguro", "A1", "آمن ومحمي من المخاطر / متأكد وواثق", "آمن ومضمون أو متأكد", "travel", "Viajar en tren de alta velocidad es rápido y seguro.", "السفر بالقطار فائق السرعة سريع وآمن."),
    ("peligroso", "A1", "خطير ومحفوف بالمهالك والضرر", "خطر ومؤذي ومحتاج حرص", "travel", "Nadar cerca de las rocas con resaca es muy peligroso.", "السباحة بالقرب من الصخور مع الأمواج خطيرة جداً."),
    ("importante", "A1", "مهم وذو شأن وقيمة بالغة", "مهم وله قيمة وشأن", "social", "Aprender idiomas es muy importante para el futuro laboral.", "تعلم اللغات مهم جداً للمستقبل الوظيفي."),
    ("fundamental", "B1", "جوهري وأساسي لا يقوم الشيء بدونه", "أساسي ورئيسي وجوهري", "study", "La lectura diaria es fundamental para enriquecer el léxico.", "القراءة اليومية جوهرية لإثراء المعجم اللغوي."),
    ("básico", "A1", "أساسي ومبدئي يشكل القاعدة", "أساسي وبسيط وقاعدة للكل", "study", "Dominar la gramática básica facilita hablar con soltura.", "إتقان القواعد الأساسية يسهل الحديث بطلاقة."),
    ("principal", "A2", "رئيس وأول في الأهمية والمكانة", "رئيسي وأهم واحد في الموضوع", "city", "La plaza principal es el corazón palpitante del pueblo.", "الميدان الرئيس هو القلب النابض للقرية."),
    ("secundario", "B1", "ثانوي وفرعي يأتي بعد الأساسي", "ثانوي ومش أساسي وفي الدرجة التانية", "study", "Los detalles secundarios se abordarán en la próxima reunión.", "سنتناول التفاصيل الثانوية في الاجتماع القادم."),
    ("especial", "A1", "خاص ومميز وله طابع فريد", "خاص ومميز ومختلف عن الباقي", "daily", "Preparó una tarta especial para celebrar el aniversario.", "أعدت كعكة خاصة للاحتفال بالذكرى السنوية."),
    ("común", "A2", "شائع وعام ومشترك بين الجميع", "شائع ومعروف ومشترك بين الناس", "nature", "El gorrión común es un pájaro muy visto en las ciudades.", "العصفور الدوري الشائع طائر مألوف في المدن."),
    ("raro", "A1", "غريب ونادر وغير مألوف الحدوث", "غريب ونادر ومش متعودين عليه", "daily", "Vieron un pájaro con un plumaje de colores muy raro.", "رأوا طائراً بريش ذي ألوان نادرة وغريبة."),
    ("extraño", "A2", "غريب ومجهول يثير الدهشة والتوجس", "غريب ومريب ومش طبيعي", "social", "Escuchó un ruido extraño que venía del desván a oscuras.", "سمع صوتاً غريباً قادماً من العلية في الظلام."),
    ("normal", "A1", "طبيعي ومعتاد وفق المألوف السائد", "عادي وطبيعي وزي العادة", "daily", "Es normal cometer errores cuando se aprende una lengua.", "من الطبيعي ارتكاب أخطاء عند تعلم لغة."),
    ("habitual", "A2", "معتاد ومألوف يتكرر بانتظام", "متعودين عليه ومألوف", "daily", "Hizo su paseo matinal habitual por la ribera del río.", "قام بنزهته الصباحية المعتادة على ضفة النهر."),
    ("típico", "A1", "تقليدي ومميز لتراث المنطقة وشعبها", "بلدي وتراثي ومميز للمكان", "travel", "La paella es el plato más típico y universal de España.", "الباييا هي الطبق الأكثر تقليدية وشهرة في إسبانيا."),
    ("tradicional", "A2", "تراثي متوارث عبر الأجيال والسنوات", "تراثي وأصيل ومتوارث من زمان", "arts", "Celebraron una fiesta con danzas tradicionales andaluzas.", "أقاموا احتفالاً برقصات أندلسية تراثية أصيلة."),
    ("popular", "A2", "شعبي ومحبوب لدى عامة الناس", "شعبي ومحبوب بين الناس", "social", "El festival de música popular atrajo a miles de jóvenes.", "اجتذب مهرجان الموسيقى الشعبية آلاف الشباب."),
    ("famoso", "A1", "مشهور وذائع الصيت يعرفه الجميع", "مشهور ومعروف في كل حتة", "arts", "El museo alberga cuadros del famoso pintor Pablo Picasso.", "يضم المتحف لوحات للرسام الشهير بابلو بيكاسو."),
    ("conocido", "A1", "معروف ومألوف لدى الأفراد والأصحاب", "معروف وصاحب ومعتاد", "social", "Saludó a un conocido que paseaba por la misma acera.", "سلّم على شخص معروف كان يمشي على نفس الرصيف."),
    ("desconocido", "A2", "مجهول وغريب لم يسبق التعرف عليه", "مجهول وما نعرفهوش", "social", "Un amable desconocido le ayudó a cambiar la rueda.", "ساعده شخص مجهول لطيف في تغيير إطار السيارة."),
    ("perfecto", "A1", "كامل وتام لا تشوبه شائبة أو نقص", "كامل ومظبوط مية مية", "study", "Obtuvo una puntuación perfecta en el test de vocabulario.", "حصل على درجة كاملة في اختبار المفردات."),
    ("imperfecto", "B1", "ناقص وغير مكتمل فيه بعض العيوب", "ناقص وفيه شوية عيوب", "arts", "La vasija hecha a mano tiene un acabado rústico e imperfecto.", "للإناء المصنوع يدوياً مظهر ريفي غير كامل."),
    ("puro", "A2", "نقي وخالص لم تشبه أي شائبة", "صافي ونقي وخالص", "nature", "El aire puro de la sierra llena de energía y vigor.", "يملا هواء الجبل النقي الجسد بالطاقة والنشاط."),
    ("completo", "A1", "شامل ومكتمل الأجزاء والعناصر", "كامل وشامل ومستوفي كل حاجة", "daily", "Compró la colección completa de cuentos clásicos.", "اشترى المجموعة الكاملة من القصص الكلاسيكية."),
    ("incompleto", "A2", "منقوص ومبتور تنقصه بعض الأجزاء", "ناقص ومش كامل أجزاؤه", "study", "El informe estaba incompleto a falta de los gráficos.", "كان التقرير ناقصاً في غياب الرسوم البيانية."),
    ("entero", "A1", "كامل وصحيح لم ينقص منه جزء", "سليم وكامل ع بعضه", "food", "Se comió una manzana entera sin dejar nada.", "أكل تفاحة كاملة دون أن يترك منها شيئاً."),
]

def build_adjectives_bundle(existing_norms: set[str]):
    entries = []
    seen = set()
    rank = 1

    for row in RAW_ADJECTIVES:
        headword = row[0]
        norm = norm_vocab(headword)
        if norm in existing_norms or norm in seen:
            continue
        seen.add(norm)

        level = row[1]
        msa = row[2]
        eg = row[3]
        domain = row[4]
        ex_es = row[5]
        ex_ar = row[6]

        entry = make_adj(headword, level, msa, eg, ex_es, ex_ar, domain=domain, rank=rank)
        entries.append(entry)
        rank += 1

    emit_bundle(
        filename="vocab-cv-adjectives-expanded.json",
        bundle_slug="cv-adjectives-expanded",
        title_ar="الصفات الإسبانية الموسعة: السمات والطباع والأشكال والألوان",
        entries=entries
    )
    return len(entries), seen

if __name__ == "__main__":
    count, _ = build_adjectives_bundle(get_existing_norms())
    print(f"Generated {count} entries in vocab-cv-adjectives-expanded.json")
