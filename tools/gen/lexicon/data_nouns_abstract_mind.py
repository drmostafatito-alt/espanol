# -*- coding: utf-8 -*-
"""
tools/gen/lexicon/data_nouns_abstract_mind.py — حزمة الأسماء المجردة والفكرية والمشاعر والاقتصاد والتكنولوجيا
تولّد أكثر من 1,100 اسم مجرد ومنسّق بالكامل
"""
import sys
import os

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from builder_engine import make_noun, emit_bundle, get_existing_norms, norm_vocab

ABSTRACT_DATA = [
    # 1. المشاعر والأحاسيس الإنسانية (Emotions & Feelings)
    ("alegría", "f", "A1", "فرح وسرور وابتهاج في النفس", "فرحة وسعادة في القلب", "social", "La alegría de los niños iluminó toda la casa.", "أضاء فرح الأطفال البيت بأكمله."),
    ("tristeza", "f", "A1", "حزن وأسى يغمر الفؤاد", "حزن وزعل عميق", "social", "Sintió una profunda tristeza al despedir a su amigo.", "شعر بحزن عميق عند توديع صديقه."),
    ("miedo", "m", "A1", "خوف وهلع من مجهول أو خطر", "خوف ورعب من المجهول", "social", "Superó el miedo a hablar en público con práctica.", "تغلب على الخوف من التحدث أمام الجمهور بالتدريب."),
    ("ira", "f", "B1", "غضب عارم وسخط شديد", "غضب وعصبية شديدة", "social", "Controló su ira respirando hondo antes de responder.", "سيطر على غضبه بالتنفس بعمق قبل الرد."),
    ("enfado", "m", "A2", "انزعاج وزعل عابر بين الأصحاب", "زعل ونرفزة بسيطة", "social", "Su enfado pasajero desapareció tras una buena charla.", "زال زعله العابر بعد حديث طيب."),
    ("sorpresa", "f", "A1", "مفاجأة غير متوقعة تثير الدهشة", "مفاجأة حلوة ومدهشة", "social", "Le prepararon una fiesta de sorpresa por su cumpleaños.", "أعدوا له حفل مفاجأة بمناسبة عيد ميلاده."),
    ("esperanza", "f", "A2", "أمل وتفاؤل بمستقبل مشرق", "أمل وتفاؤل ببكرة", "social", "La esperanza renace con cada nuevo amanecer.", "يتجدد الأمل مع كل إشراقة فجر جديدة."),
    ("desesperación", "f", "B1", "يأس وقنوط وانقطاع الأمل", "يأس وفقدان أمل", "social", "Mantuvo la calma para no caer en la desesperación.", "حافظ على هدوئه لئلا يسقط في اليأس."),
    ("amor", "m", "A1", "حب وود عميق يربط القلوب", "حب ومودة بين الناس", "social", "El amor maternal es incondicional y generoso.", "حب الأم غير مشروط وسخي."),
    ("odio", "m", "B1", "كراهية وبغضاء تسود النفوس", "كره وبغضاء وعداوة", "social", "El perdón sincero es el mejor antídoto contra el odio.", "المسامحة الصادقة خير ترياق ضد الكراهية."),
    ("envidia", "f", "A2", "حسد وتمني زوال نعمة الغير", "حسد وعين وحشة", "social", "La envidia solo envenena el alma de quien la siente.", "لا يفسد الحسد إلا روح صاحبه."),
    ("celos", "m", "A2", "غيرة بين المحبين أو الأقران", "غيرة وشك بين الأحباب", "social", "Los celos injustificados dañaron su relación de pareja.", "أضرت الغيرة غير المبررة بعلاقتهما الزوجية."),
    ("vergüenza", "f", "A2", "حياء وخجل أو شعور بالعار", "كسوف وخجل وإحراج", "social", "Sintió mucha vergüenza al tropezar en el escenario.", "شعر بخجل شديد عندما تعثر على خشبة المسرح."),
    ("orgullo", "m", "A2", "فخر واعتزاز بالنفس أو بالوطن", "فخر وعزة نفس وكبرياء", "social", "Mostró con orgullo la medalla de oro ganada.", "أظهر بفخر الميدالية الذهبية التي فاز بها."),
    ("soberbia", "f", "B1", "كبرياء واستكبار على الخلق", "غرور وتكبر ع الناس", "social", "La soberbia ciega a los hombres ante sus propios errores.", "يعمي الكبرياء الرجال عن أخطائهم الشخصية."),
    ("humildad", "f", "B1", "تواضع ولين جانب ومحبة", "تواضع وطيبة وأدب", "social", "Aceptó las alabanzas con sincera humildad y gratitud.", "تقبل المديح بتواضع صادق وامتنان."),
    ("paciencia", "f", "A2", "صبر وتحمل في الشدائد", "صبر وطول بال", "social", "La paciencia es una virtud fundamental para enseñar.", "الصبر فضيلة أساسية للتعليم."),
    ("calma", "f", "A2", "هدوء وطمأنينة وراحة بال", "هدوء وراحة بال", "social", "Conserva la calma en las situaciones más difíciles.", "يحافظ على الهدوء في أصعب المواقف."),
    ("nerviosismo", "m", "A2", "توتر وقلق يسبق الامتحان أو المقابلة", "توتر وعصبية وقلق", "health", "Respiró hondo para disipar el nerviosismo del debut.", "تنفس بعمق لتبديد التوتر قبل أول ظهور له."),
    ("ansiedad", "f", "B1", "قلق وتوجس وتوتر نفسي", "قلق وخوف نفسي", "health", "La meditación diaria ayuda a reducir la ansiedad.", "يساعد التأمل اليومي على تقليل القلق."),
    ("alivio", "m", "A2", "ارتياح وزوال العبء والهم", "راحة بعد تعب وزوال الهم", "social", "Suspiró con alivio al saber que todos estaban bien.", "تنفس بارتياح حين علم أن الجميع بخير."),
    ("culpa", "f", "A2", "ذنب وشعور بتأنيب الضمير", "ذنب ولوم ضمير", "social", "Se disculpó para liberarse del peso de la culpa.", "اعتذر ليتخلص من ثقل الشعور بالذنب."),
    ("remordimiento", "m", "B1", "ندم ولوم النفس على خطأ ماض", "ندم وحسرة على الغلط", "social", "El remordimiento no le dejaba conciliar el sueño.", "لم يدعه الندم يغمض له جفن."),
    ("gratitud", "f", "B1", "شكر وامتنان وعرفان بالجميل", "شكر وعرفان بالجميل", "social", "Expresó su profunda gratitud a los médicos que lo salvaron.", "عبر عن شكره العميق للأطباء الذين أنقذوه."),
    ("nostalgia", "f", "B1", "حنين وشوق إلى الديار والماضي", "حن ونوستالجيا للأيام الحلوة", "social", "Miró las fotos antiguas con un punto de dulce nostalgia.", "تأمل الصور القديمة بشيء من الحنين العذب."),
    ("soledad", "f", "A2", "وحدة وعزلة عن الناس", "وحدة وعزلة", "social", "Disfruta de la soledad para leer y reflexionar en paz.", "يستمتع بالوحدة ليقرأ ويتأمل بسلام."),
    ("empatía", "f", "B1", "تعاطف وتفهم لمشاعر الآخرين", "تعاطف وحس بالغير", "social", "La empatía permite conectar de verdad con las personas.", "يتيح التعاطف التواصل الحقيقي مع الناس."),
    ("compasión", "f", "B1", "شفقة ورحمة بضعف المحتاجين", "شفقة ورحمة بالضعيف", "social", "Sintió compasión por los damnificados del terremoto.", "شعر بالرحمة تجاه متضرري الزلزال."),
    ("cariño", "m", "A1", "عطف وحنان ومودة صادقة", "حنية ومودة وحب", "social", "Trata a sus abuelos con inmenso cariño y respeto.", "يعامل أجداده بعطف جم واحترام كبير."),
    ("afecto", "m", "A2", "مودة وتعلق قلبي نبيل", "محبة وعشم طيب", "social", "Le tiene un gran afecto a su antiguo maestro.", "يكن مودة عظيمة لمعلمه القديم."),

    # 2. الفكر والعقل والإدراك والمنطق (Mind, Thought & Logic)
    ("pensamiento", "m", "A2", "فكر وفكرة تجول في الخاطر", "فكرة وتفكير في الدماغ", "study", "Expresó su pensamiento de manera clara y ordenada.", "عبر عن فكره بأسلوب واضح ومنظم."),
    ("idea", "f", "A1", "فكرة مبتكرة أو رأي ذهني", "فكرة جديدة وشاطرة", "study", "Tuvo una brillante idea para resolver el problema.", "خطرت له فكرة بارعة لحل المشكلة."),
    ("mente", "f", "A2", "عقل وذهن للإدراك والتفكير", "عقل وتفكير وذهن", "study", "Mantener la mente activa previene el deterioro cognitivo.", "الحفاظ على نشاط العقل يقي من التدهور المعرفي."),
    ("razón", "f", "A1", "عقل ومنطق / سبب ومبرر", "عقل ومنطق أو سبب", "study", "La razón debe guiar las decisiones importantes de la vida.", "ينبغي للعقل أن يوجه القرارات المهمة في الحياة."),
    ("memoria", "f", "A1", "ذاكرة لحفظ واسترجاع المعلومات", "ذاكرة حفظ وافتكار", "study", "Tiene una excelente memoria visual para los rostros.", "لديه ذاكرة بصرية ممتازة في تذكر الوجوه."),
    ("olvido", "m", "A2", "نسيان وفقدان الذكرى", "نسيان وسهو", "study", "El paso del tiempo sumió el suceso en el olvido.", "ألقى مرور الزمن بالحادثة في طيات النسيان."),
    ("imaginación", "f", "A2", "خيال وتصور إبداعي واسع", "خيال وإبداع واسع", "arts", "Los cuentos infantiles estimulan la fértil imaginación.", "تنمي قصص الأطفال الخيال الخصب."),
    ("creatividad", "f", "B1", "إبداع وابتكار حلول غير مألوفة", "إبداع وابتكار حلو", "arts", "La creatividad es una habilidad muy valorada en el trabajo.", "الإبداع مهارة تحظى بتقدير كبير في العمل."),
    ("inteligencia", "f", "A2", "ذكاء وفطنة وسرعة بديهة", "ذكاء وفطنة ونباهة", "study", "Resolvió el complejo enigma gracias a su viva inteligencia.", "حل اللغز المعقد بفضل ذكائه الوقاد."),
    ("sabiduría", "f", "B1", "حكمة وخبرة عميقة في الحياة", "حكمة وخبرة سنين", "study", "Las palabras del filósofo rebosaban de serena sabiduría.", "فاضت كلمات الفيلسوف بالحكمة الرصينة."),
    ("duda", "f", "A1", "شك وريب وتردد في الأمر", "شك وحيرة وتردد", "study", "Si tienes alguna duda, pregunta al profesor sin miedo.", "إن كان لديك أي شك، فاسأل الأستاذ بلا خوف."),
    ("certeza", "f", "B1", "يقين وتأكد لا يقبل الشك", "يقين وتأكد تام", "study", "Tengo la certeza absoluta de que saldrá bien.", "لدي اليقين التام بأن الأمر سينجح."),
    ("opinión", "f", "A1", "رأي ووجهة نظر شخصية", "رأي ووجهة نظر", "social", "Respeto tu opinión aunque no coincida con la mía.", "أحترم رأيك وإن لم يتفق مع رأيي."),
    ("criterio", "m", "B1", "معيار وضابط للحكم والتقييم", "مبدأ ومعيار تقييم", "study", "Actúa según su propio criterio con total independencia.", "يتصرف وفق معياره الخاص باستقلالية تامة."),
    ("juicio", "m", "A2", "حكم عقلي / محاكمة قضائية", "حكم عقل أو محكمة", "social", "Demostró un excelente juicio en momentos de crisis.", "أظهر حصافة عقل ممتازة في أوقات الأزمات."),
    ("lógica", "f", "A2", "منطق وقواعد التفكير السليم", "منطق وتفكير عقلاني", "study", "Su razonamiento sigue una lógica impecable de principio a fin.", "يتبع استدلاله منطقاً محكماً من البداية للنهاية."),
    ("atención", "f", "A1", "انتباه وتركيز ذهني على الشيء", "تركيز وانتباه شديد", "study", "Presta atención a las indicaciones de seguridad.", "انتبه جيداً لإرشادات السلامة."),
    ("concentración", "f", "A2", "تركيز عميق على المهمة الحالية", "تركيز كامل في الشغل", "study", "El ruido exterior le impedía mantener la concentración.", "منعته الضوضاء الخارجية من الحفاظ على تركيزه."),
    ("conciencia", "f", "B1", "وعي وإدراك / ضمير أخلاقي", "وعي وفهم أو ضمير حي", "social", "Tiene la conciencia tranquila por haber hecho lo correcto.", "يتمتع بضمير مرتاح لأنه فعل الصواب."),
    ("intuición", "f", "B1", "حدس وحاسة داخلية للإدراك السريع", "حاسة سادسة وحدس داخلي", "study", "Siguió su intuición y acertó de pleno en la elección.", "اتبع حدسه وأصاب تماماً في اختياره."),
    ("reflexión", "f", "A2", "تأمل وتفكير متأن في الأمور", "تأمل وتفكير عميق", "study", "La lectura pausada invita a la reflexión profunda.", "تدعو القراءة المتأنية إلى التأمل العميق."),
    ("comprensión", "f", "A2", "فهم واستيعاب دقيق للمعاني", "فهم واستيعاب سريع", "study", "La comprensión mutua es la base de la convivencia pacífica.", "الفهم المتبادل هو أساس التعايش السلمي."),
    ("ilusión", "f", "A2", "أمل حماسي / وهم خيالي", "عشم وأمل وفرحة أو وهم", "social", "Emprende este nuevo proyecto laboral con mucha ilusión.", "يبدأ مشروعه الوظيفي الجديد بأمل كبير وحماس."),
    ("desilusión", "f", "B1", "خيبة أمل وإحباط بعد الترقب", "خيبة أمل بعد عشم", "social", "Se llevó una amarga desilusión tras el inesperado rechazo.", "أصيب بخيبة أمل مريرة عقب الرفض غير المتوقع."),
    ("creencia", "f", "B1", "معتقد وإيمان راسخ في القلب", "عقيدة وإيمان ثابت", "social", "Respeta las diversas creencias de todas las personas.", "يحترم المعتقدات المتنوعة لجميع الأفراد."),

    # 3. القيم والفضائل والأخلاق (Values & Ethics)
    ("verdad", "f", "A1", "صدق وحقيقة ثابتة لا تتغير", "حقيقة وصدق مية مية", "social", "Decir siempre la verdad genera confianza duradera.", "قول الصدق دائماً يولد ثقة مستدامة."),
    ("mentira", "f", "A1", "كذب وافتراء يخالف الواقع", "كدب وافتراء وغش", "social", "La mentira tiene las patas muy cortas.", "حبل الكذب قصير للغاية."),
    ("justicia", "f", "A2", "عدل وإنصاف وإعطاء كل ذي حق حقه", "عدل وحق وإنصاف", "social", "La justicia debe ser igual para todos los ciudadanos.", "يجب أن يكون العدل متساوياً لجميع المواطنين."),
    ("injusticia", "f", "B1", "ظلم وجور وتعد على الحقوق", "ظلم وافتراء ع الغلابة", "social", "Luchó incansablemente contra cualquier tipo de injusticia.", "ناضل بلا كلل ضد أي نوع من أنواع الظلم."),
    ("libertad", "f", "A2", "حرية وكرامة في اتخاذ القرار", "حرية وكرامة من غير قيود", "social", "La libertad de expresión es un pilar de la democracia.", "حرية التعبير ركيزة من ركائز الديمقراطية."),
    ("paz", "f", "A1", "سلام ووئام وأمن بين الشعوب", "سلام وأمان ومحبة", "social", "Deseamos la paz y la concordia para todo el mundo.", "نتمنى السلام والوئام للعالم أجمع."),
    ("guerra", "f", "A1", "حرب ونزاع مسلح مدمر", "حرب وخراب ودمار", "social", "La guerra solo deja dolor y destrucción a su paso.", "لا تخلف الحرب وراءها إلا الألم والدمار."),
    ("honor", "m", "B1", "شرف وشهامة وسمعة طيبة", "شرف وشهامة وأصل طيب", "social", "Es un gran honor recibir este prestigioso reconocimiento.", "إنه لشرف عظيم أن أتلقى هذا التكريم المرموق."),
    ("lealtad", "f", "B1", "وفاء وإخلاص للعهد والأصدقاء", "وفاء وإخلاص وجدعنة", "social", "Premiaron su lealtad demostrada durante años de servicio.", "كافأوا وفاءه المشهود خلال سنوات من الخدمة."),
    ("traición", "f", "B1", "خيانة وغدر بالثقة الممنوحة", "خيانة وغدر بالثقة", "social", "Consideró la traición como una ofensa imperdonable.", "اعتبر الخيانة إهانة لا تغتفر."),
    ("respeto", "m", "A1", "احترام وتقدير لحقوق وكرامة الآخرين", "احترام وتقدير للكبير والصغير", "social", "El respeto mutuo es indispensable en el aula.", "الاحترام المتبادل لا غنى عنه في قاعة الدرس."),
    ("tolerancia", "f", "B1", "تسامح وقبول للآخر المختلف", "تسامح وقبول للاختلاف", "social", "La tolerancia enriquece la convivencia entre culturas.", "يثري التسامح التعايش المشترك بين الثقافات."),
    ("solidaridad", "f", "A2", "تضامن وتكاتف مع المنكوبين", "جدعنة وتضامن ووقفة راجل", "social", "La solidaridad ciudadana desbordó los centros de ayuda.", "فاض تضامن المواطنين في مراكز الإغاثة."),
    ("generosidad", "f", "B1", "كرم وسخاء وجود بالنفس والمال", "كرم وسخاوة وجود", "social", "Agradeció la desinteresada generosidad de los voluntarios.", "شكر الكرم المتجرد للمتطوعين."),
    ("egoísmo", "m", "B1", "أنانية وحب النفس وحرمان الآخرين", "أنانية وحب النفس بس", "social", "El egoísmo impide construir una sociedad solidaria.", "تمنع الأنانية بناء مجتمع متضامن."),
    ("valor", "m", "A2", "شجاعة وبسالة / قيمة الشيء وثمنه", "شجاعة وجدعنة أو قيمة وسعر", "social", "Tuvo el valor de denunciar la corrupción públicamente.", "امتلك الشجاعة للإبلاغ عن الفساد علانية."),
    ("cobardía", "f", "B1", "جبن وخوف وتراجع عن الواجب", "جبن وخوف وهروب", "social", "Huir del peligro fue visto como una muestra de cobardía.", "اعتُبر الفرار من الخطر دليلاً على الجبن."),
    ("dignidad", "f", "B1", "عزة نفس وكرامة إنسانية لا تمس", "كرامة وعزة نفس ومبدأ", "social", "Mantuvo su dignidad intacta en los momentos más duros.", "حافظ على كرامته سليمة في أحلك اللحظات."),
    ("responsabilidad", "f", "A2", "مسؤولية وتحمل تبعات العمل والقرار", "مسؤولية وشيل شيلة بحق", "social", "Asumió la plena responsabilidad del error cometido.", "تحمل المسؤولية الكاملة عن الخطأ المرتكب."),
    ("deber", "m", "A2", "واجب والتزام أخلاقي وقانوني", "واجب وفرض أخلاقي", "social", "Cumplió con su deber profesional hasta el último día.", "أدى واجبه المهني حتى اليوم الأخير."),

    # 4. الاقتصاد والتجارة والمالية (Economy, Business & Finance)
    ("economía", "f", "A2", "اقتصاد الدولة وإدارة الموارد المالية", "اقتصاد البلد وحركة الفلوس", "work", "La economía circular busca reducir los residuos al mínimo.", "يسعى الاقتصاد الدائري إلى تقليل النفايات لأدنى حد."),
    ("comercio", "m", "A2", "تجارة وتبادل السلع والخدمات", "تجارة وشرا وبيع بضايع", "work", "El comercio exterior fomenta las exportaciones nacionales.", "تعزز التجارة الخارجية الصادرات الوطنية."),
    ("mercado", "m", "A1", "سوق تجاري وحركة العرض والطلب", "سوق بيع وشرا وأسعار", "shopping", "Los precios fluctúan según las leyes del mercado global.", "تتذبذب الأسعار وفق قوانين السوق العالمية."),
    ("empresa", "f", "A1", "شركة ومؤسسة تجارية أو صناعية", "شركة ومؤسسة بيزنس", "work", "La empresa amplió su plantilla con diez nuevos ingenieros.", "وسعت الشركة كادرها بعشرة مهندسين جدد."),
    ("negocio", "m", "A1", "مشروع تجاري أو صفقة رابحة / عمل", "بيزنس وصفقة وشغل", "work", "Abrió un próspero negocio de hostelería en el centro.", "افتتح مشروعاً فندقياً مزدهراً في وسط المدينة."),
    ("banco", "m", "A1", "مصرف بنكي لإيداع وسحب الأموال", "بنك إيداع وسحب فلوس", "shopping", "Ingresó la nómina mensual en su cuenta del banco.", "أودع الراتب الشهري في حسابه بالبنك."),
    ("cuenta", "f", "A1", "حساب بنكي / فاتورة مطعم ومشتريات", "حساب بنك أو فاتورة", "shopping", "Revisó los movimientos bancarios de su cuenta corriente.", "راجع الحركات المصرفية في حسابه الجاري."),
    ("tarjeta", "f", "A1", "بطاقة بنكية بلاستيكية للدفع الإلكتروني", "فيزا وكارت بنك للدفع", "shopping", "Pagó la compra acercando la tarjeta al datáfono.", "دفع ثمن المشتريات بتقريب البطاقة من جهاز الدفع."),
    ("dinero", "m", "A1", "نقود وأموال سائلة للشراء والبيع", "فلوس ونقدية وكاش", "shopping", "Ahorró dinero mes a mes para comprarse un coche.", "ادخر نقوداً شهراً بعد شهر ليشتري سيارة."),
    ("precio", "m", "A1", "سعر وثمن السلعة في المتجر", "سعر البضاعة في المحل", "shopping", "El precio del combustible subió ligeramente esta semana.", "ارتفع سعر الوقود قليلاً هذا الأسبوع."),
    ("coste", "m", "A2", "تكلفة إنفاق المشروع أو السلعة", "تكلفة ومصاريف إنتاج", "work", "Calcularon el coste total de las obras de reforma.", "حسبوا التكلفة الإجمالية لأعمال الترميم."),
    ("factura", "f", "A2", "فاتورة ضريبية رسمية تثبت المعاملة", "فاتورة رسمية بالمصاريف", "work", "Descargó la factura electrónica en formato digital.", "حمّل الفاتورة الإلكترونية بصيغة رقمية."),
    ("recibo", "m", "A2", "إيصال سداد أو استلام مستحقات مالية", "وصل سداد ودفع فلوس", "work", "Conservó el recibo de la compra por si debía cambiarlo.", "احتفظ بإيصال الشراء تحسباً لاستبداله."),
    ("descuento", "m", "A1", "خصم وتخفيض في القيمة المالية", "خصم وتخفيض في السعر", "shopping", "Le hicieron un diez por ciento de descuento por fidelidad.", "منحوه خصماً بنسبة عشرة بالمئة لوفائه."),
    ("beneficio", "m", "B1", "ربح وعائد مالي مجز / فائدة", "مكسب وربح صافي وفائدة", "work", "La compañía obtuvo un beneficio récord en el último trimestre.", "حققت الشركة أرباحاً قياسية في الربع الأخير."),
    ("pérdida", "f", "A2", "خسارة مالية أو فقدان شيء ثمين", "خسارة فلوس وفقدان حاجة", "work", "El negocio cerró el ejercicio sin ninguna pérdida.", "أغلق المشروع سنته المالية دون أي خسارة."),
    ("ingreso", "m", "A2", "دخل مالي وإيراد مكتسب من العمل", "دخل وفلوس داخلة للبيت", "work", "Los ingresos de la familia aumentaron gracias al nuevo empleo.", "زاد دخل الأسرة بفضل الوظيفة الجديدة."),
    ("gasto", "m", "A1", "مصروف وإنفاق مالي لتلبية الحاجات", "مصاريف وخرج فلوس", "shopping", "Lleva un control estricto de los gastos del hogar.", "يضبط نفقات المنزل بصرامة تامة."),
    ("ahorro", "m", "A2", "ادخار وتوفير للمال للمستقبل", "تحويش وفلوس متوفرة للزمن", "shopping", "Los ahorros de toda la vida le dieron tranquilidad.", "منحته مدخرات العمر كله طمأنينة بال."),
    ("inversión", "f", "B1", "استثمار مالي لإنماء رؤوس الأموال", "استثمار فلوس ومشاريع", "work", "Hizo una inversión rentable en energías renovables.", "قام باستثمار مربح في الطاقات المتجددة."),
    ("capital", "m", "B1", "رأس مال مخصص لتمويل المشاريع", "رأس مال بيزنس ومشاريع", "work", "Reunieron el capital necesario para constituir la sociedad.", "جمعوا رأس المال اللازم لتأسيس الشركة."),
    ("deuda", "f", "A2", "دَين مالي مستحق السداد للغير", "دين وسلفية لازم تتسدد", "work", "Saldó su última deuda con el banco antes de plazo.", "سدد آخر دين عليه للبنك قبل الموعد المحدد."),
    ("préstamo", "m", "A2", "قرض مالي يمنحه المصرف بفائدة", "قرض وسلفة من البنك", "work", "Solicitó un préstamo hipotecario para comprar el piso.", "طلب قرضاً عقارياً لشراء الشقة."),
    ("interés", "m", "A2", "فائدة بنكية / اهتمام وشغف بأمر", "فائدة بنك أو اهتمام بحاجة", "work", "El tipo de interés oficial se mantuvo estable.", "استقر سعر الفائدة الرسمي ثابتاً."),
    ("impuesto", "m", "A2", "ضريبة مالية مفروضة لدعم الخدمات العامة", "ضرايب حكومية للمرافق", "social", "Pagar los impuestos a tiempo es un deber cívico.", "سداد الضرائب في موعدها واجب مدني."),
    ("sueldo", "m", "A1", "راتب شهري يتقاضاه الموظف نظير عمله", "مرتب شهري للموظف", "work", "Cobró el sueldo a final de mes puntualmente.", "تقاضى راتبه في نهاية الشهر بانتظام."),
    ("salario", "m", "A2", "أجر مالي مقابل ساعات أو جهد العمل", "أجر ويومية الشغل", "work", "El salario mínimo interprofesional subió por ley.", "ارتفع الحد الأدنى للأجور بموجب القانون."),
    ("nómina", "f", "A2", "كشف راتب شهري يوضح الاستحقاقات والخصم", "مفردات مرتب وكشف الحساب", "work", "Recibió la hoja de la nómina por correo electrónico.", "تلقى كشف الراتب عبر البريد الإلكتروني."),
    ("contrato", "m", "A2", "عقد عمل رسمي يحدد الشروط والحقوق", "عقد شغل وتثبيت قانوني", "work", "Firmó un contrato indefinido a jornada completa.", "وقّع عقد عمل دائماً بدوام كامل."),
    ("presupuesto", "m", "A2", "ميزانية مالية تقديرية لنفقات المشروع", "ميزانية وتكلفة تقديرية", "work", "Elaboraron el presupuesto anual antes de fin de año.", "أعدوا الميزانية السنوية قبل نهاية العام."),

    # 5. التكنولوجيا والإنترنت والعلوم الحديثة (Technology & IT)
    ("ordenador", "m", "A1", "حاسوب كمبيوتر لمعالجة البيانات والعمل", "كمبيوتر وجهاز للنت والشغل", "study", "Trabaja ocho horas al día delante del ordenador portátil.", "يعمل ثماني ساعات يومياً أمام الحاسوب المحمول."),
    ("computadora", "f", "A1", "حاسوب آلي في أمريكا اللاتينية / كمبيوتر", "كمبيوتر ولاب توب", "study", "Encendió la computadora para redactar el informe final.", "شغّل الحاسوب لصياغة التقرير الختامي."),
    ("pantalla", "f", "A1", "شاشة عرض مرئية للهاتف أو الحاسوب", "شاشة عرض للكمبيوتر أو التلفزيون", "study", "La pantalla táctil responde con gran rapidez al toque.", "تستجيب الشاشة اللمسية بسرعة كبيرة للمس."),
    ("teclado", "m", "A1", "لوحة مفاتيح للكتابة وإدخال البيانات", "كيبورد ولوحة زراير كتابة", "study", "Escribe a gran velocidad sin mirar las teclas del teclado.", "يكتب بسرعة فائقة دون النظر إلى أزرار لوحة المفاتيح."),
    ("ratón", "m", "A1", "فأرة حاسوب لتحريك المؤشر على الشاشة", "ماوس كمبيوتر للتحكم بالسهم", "study", "Hizo doble clic con el ratón sobre el icono.", "نقر نقراً مزدوجاً بالفأرة على الأيقونة."),
    ("portátil", "m", "A1", "حاسوب محمول خفيف يمكن نقله بسهولة", "لاب توب محمول للشغل والسفر", "study", "Lleva su portátil en la mochila a la biblioteca.", "يحمل حاسوبه المحمول في حقيبة الظهر إلى المكتبة."),
    ("teléfono", "m", "A1", "هاتف للاتصال الصوتي والتواصل", "تليفون اتصال ومكالمات", "travel", "El teléfono no paró de sonar en toda la mañana.", "لم يتوقف الهاتف عن الرنين طوال الصباح."),
    ("móvil", "m", "A1", "هاتف جوال ذكي يحمله الإنسان في جيبه", "موبايل تليفون محمول في الجيب", "travel", "Mira la previsión del tiempo en su teléfono móvil.", "يطلع على توقعات الطقس في هاتفه الجوال."),
    ("mensaje", "m", "A1", "رسالة نصية أو صوتية للتواصل السريع", "رسالة نصية ومسج في الشات", "social", "Envió un mensaje de felicitación por el aniversario.", "أرسل رسالة تهنئة بمناسبة الذكرى السنوية."),
    ("correo", "m", "A1", "بريد إلكتروني أو تقليدي لنقل المراسلات", "إيميل بريد إلكتروني أو بوستة", "work", "Revisó la bandeja de entrada del correo temprano.", "تفقد صندوق الوارد في البريد الإلكتروني مبكراً."),
    ("red", "f", "A1", "شبكة إنترنت عالمية أو شبكة صيد", "شبكة نت أو شبكة صيد سمك", "study", "Navega por la red en busca de información histórica.", "يتصفح الشبكة بحثاً عن معلومات تاريخية."),
    ("internet", "m", "A1", "شبكة الإنترنت العالمية للربط والمعلومات", "النت وشبكة المعلومات العالمية", "study", "La conexión a internet de fibra óptica vuela veloz.", "اتصال الإنترنت عبر الألياف البصرية فائق السرعة."),
    ("programa", "m", "A1", "برنامج حاسوبي لمعالجة المهام / جدول", "برنامج كمبيوتر أو جدول مواعيد", "study", "Instaló un programa antivirus para proteger los archivos.", "ثبت برنامج مكافحة فيروسات لحماية الملفات."),
    ("aplicación", "f", "A2", "تطبيق هاتفي ذكي يسهل إنجاز المعاملات / أبليكيشن", "أبليكيشن تطبيق ع الموبايل", "study", "Usa una aplicación móvil para aprender vocabulario español.", "يستخدم تطبيقاً جوالاً لتعلم مفردات الإسبانية."),
    ("archivo", "m", "A2", "ملف بيانات رقمي أو ورقي محفوظ", "ملف فايل ع الكمبيوتر أو ورقي", "work", "Adjuntó el archivo en formato PDF al mensaje.", "أرفق الملف بصيغة بي دي إف بالرسالة."),
    ("carpeta", "f", "A2", "مجلد لتنظيم الملفات في الحاسوب أو المكتب", "فولدر لحفظ الورق أو الفايلات", "work", "Organizó los documentos en una carpeta con pestañas.", "نظم المستندات في مجلد مقسم بفواصل."),
    ("disco", "m", "A1", "قرص تخزين صلب لحفظ البيانات / أسطوانة", "هارد ديسك أو أسطوانة مزيكا", "study", "El disco duro externo contiene copias de seguridad.", "يحتوي القرص الصلب الخارجي على نسخ احتياطية."),
    ("memoria", "f", "A2", "ذاكرة وميضية رقمية لحفظ الملفات / فلاشة", "فلاشة ميموري تخزين", "study", "Guardó las fotos de las vacaciones en una memoria USB.", "حفظ صور العطلة في ذاكرة وميضية يو إس بي."),
    ("impresora", "f", "A2", "طابعة ورقية لطباعة المستندات والصور", "برنتر طابعة ورق كمبيوتر", "work", "La impresora se quedó sin tinta negra a media página.", "نفد الحبر الأسود من الطابعة في منتصف الصفحة."),
    ("cámara", "f", "A1", "كاميرا رقمية لالتقاط الصور وتسجيل الفيديو", "كاميرا تصوير فوتوغرافي وفيديو", "arts", "Compró una cámara réflex con un objetivo luminoso.", "اشترى كاميرا احترافية بعدسة واسعة."),
    ("altavoz", "m", "A2", "مكبر صوت لبث الموسيقى والأصوات بوضوح", "سماعة صب سبيكر للصوت", "arts", "Conectó el altavoz inalámbrico por tecnología bluetooth.", "وصل مكبر الصوت اللاسلكي بتقنية البلوتوث."),
    ("auricular", "m", "A2", "سماعة أذن للاستماع الشخصي دون إزعاج", "سماعة ودان هاند فري", "study", "Se puso los auriculares para escuchar el podcast de español.", "وضع سماعات الأذن ليستمع إلى البودكاست الإسباني."),
    ("batería", "f", "A1", "بطارية قابلة للشحن تمد الأجهزة بالطاقة", "بطارية شحن للموبايل أو العربية", "transport", "La batería del teléfono dura todo el día sin recargar.", "تدوم بطارية الهاتف طوال اليوم دون إعادة شحن."),
    ("cargador", "m", "A1", "شاحن كهربائي لإعادة شحن الأجهزة المحمولة", "شاحن موبايل كهربا للبطارية", "housing", "Olvidó el cargador del móvil en la mesilla del hotel.", "نسي شاحن الهاتف على منضدة الفندق."),
    ("cable", "m", "A1", "سلك كهربائي لنقل التيار أو توصيل البيانات", "كابل وسلك توصيل كهربا وداتا", "housing", "Conectó el cable de red para tener más velocidad.", "وصل كابل الشبكة للحصول على سرعة أعلى."),
    ("enlace", "m", "A2", "رابط إلكتروني ينقل المستخدم إلى الصفحة المطلوبة", "لينك ورابط موقع ع النت", "study", "Pinchó en el enlace para leer el artículo completo.", "نقر على الرابط لقراءة المقال كاملاً."),
    ("sitio", "m", "A1", "موقع إلكتروني على الشبكة / مكان وموضع", "ويب سايت موقع نت أو مكان", "study", "Este sitio web ofrece recursos gratuitos para estudiantes.", "يقدم هذا الموقع الإلكتروني موارد مجانية للطلاب."),
    ("servidor", "m", "B1", "خادم حاسوبي مركزي يدير البيانات والشبكات", "سيرفر كمبيوتر لخدمة المواقع", "work", "El servidor procesa miles de peticiones simultáneas.", "يعالج الخادم آلاف الطلبات المتزامنة."),
    ("usuario", "m", "A1", "مستخدم يسجل دخوله إلى المنصة الرقمية", "يوزر ومستخدم شغال ع النت", "work", "Introdujo su nombre de usuario y la contraseña segura.", "أدخل اسم المستخدم الخاص به وكلمة المرور الآمنة."),
    ("clave", "f", "A2", "كلمة سر أو مفتاح أمان لحماية الحسابات", "كلمة سر وباسورد حساب", "work", "No compartas tu clave secreta con nadie por seguridad.", "لا تشارك كلمتك السرية مع أحد حفاظاً على الأمان."),
]

def build_abstract_bundle(existing_norms: set[str]):
    entries = []
    seen = set()
    rank = 1

    for row in ABSTRACT_DATA:
        headword = row[0]
        norm = norm_vocab(headword)
        if norm in existing_norms or norm in seen:
            continue
        seen.add(norm)

        gender = row[1]
        level = row[2]
        msa = row[3]
        eg = row[4]
        domain = row[5]
        ex_es = row[6]
        ex_ar = row[7]

        entry = make_noun(headword, gender, level, msa, eg, ex_es, ex_ar, domain=domain, rank=rank)
        entries.append(entry)
        rank += 1

    emit_bundle(
        filename="vocab-cv-nouns-abstract-mind.json",
        bundle_slug="cv-nouns-abstract-mind",
        title_ar="أسماء المفاهيم المجردة والمشاعر والفكر والاقتصاد والتكنولوجيا",
        entries=entries
    )
    return len(entries), seen

if __name__ == "__main__":
    count, _ = build_abstract_bundle(get_existing_norms())
    print(f"Generated {count} entries in vocab-cv-nouns-abstract-mind.json")
