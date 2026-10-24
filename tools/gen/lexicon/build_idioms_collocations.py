# -*- coding: utf-8 -*-
"""
build_idioms_collocations.py — حزمة التعبيرات الاصطلاحية والمتلازمات اللفظية والأمثال (A2/B1/B2/C1)
"""
import sys
import os

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from builder_engine import (
    make_expr, emit_bundle, get_existing_norms, norm_vocab
)

# Tuple structure for expressions:
# (headword, kind, level, msa, eg, ex_es, ex_ar, domain)
# kind in ("expression", "idiom", "collocation")
RAW_EXPRESSIONS = [
    # --- Everyday Idioms & Expressions ---
    ("a brazo partido", "idiom", "B2", "بجهد مضنٍ وبسالة دون سلاح", "بكل ما أوتي من قوة", "Lucharon a brazo partido contra las adversidades.", "ناضلوا بكل بسالة وجهد مضنٍ ضد الشدائد.", "social"),
    ("a buenas horas", "idiom", "B1", "في وقت متأخر جداً (بعد فوات الأوان)", "بعد فوات الأوان وبعد ما طارت الطيور", "Llegas a buenas horas, ya terminó la fiesta.", "تصل في وقت متأخر جداً، لقد انتهت الحفلة بالفعل.", "daily"),
    ("a campo traviesa", "idiom", "B2", "عبر الحقول وخارج الطرق المعبدة", "في قلب الغيطان بعيد عن الطريق", "Caminaron a campo traviesa durante horas.", "ساروا عبر الحقول وخارج الطرق المعبدة لعدة ساعات.", "travel"),
    ("a cántaros", "idiom", "A2", "بالمزاريب / بغزارة شديدة", "زي المطر من الشقوق ومزاريب", "Llueve a cántaros y no llevo paraguas.", "تمطر بغزارة شديدة ولا أحمل مظلة.", "daily"),
    ("a capa y espada", "idiom", "B2", "بكل استماتة ودون هوادة", "بكل ما فيه ودفاع مستميت", "Defendió su inocencia a capa y espada ante todos.", "دافع عن براءته بكل استماتة ودون هوادة أمام الجميع.", "social"),
    ("a ciencia cierta", "idiom", "B1", "على وجه اليقين التام", "بشكل متأكد مية بالمية", "Nadie sabe a ciencia cierta qué ocurrió allí.", "لا أحد يعلم على وجه اليقين التام ماذا حدث هناك.", "study"),
    ("a contracorriente", "idiom", "B2", "عكس التيار السائد", "عكس التيار", "Siempre le ha gustado remar a contracorriente.", "لطالما أحب السباحة عكس التيار السائد وتحدي السائد.", "social"),
    ("a cuerpo de rey", "idiom", "B1", "في رغد ونعيم كالملوك", "عيشة ملوك وعز", "En el hotel nos trataron a cuerpo de rey.", "عاملونا في الفندق برغد ونعيم كالملوك.", "travel"),
    ("a duras penas", "idiom", "B1", "بمشقة بالغة وبالكاد", "بالعافية وبطلوع الروح", "Logró aprobar el examen a duras penas.", "تمكن من اجتياز الامتحان بمشقة بالغة وبالكاد.", "study"),
    ("a flor de piel", "idiom", "B2", "على وشك الانفجار شعورياً", "على أعصابه والمشاعر جياشة", "Tiene las emociones a flor de piel estos días.", "مشاعره جياشة وحساسة للغاية هذه الأيام.", "social"),
    ("a la bartola", "idiom", "B2", "في كسل وتراخٍ تام", "مأنتخ ومش سائل في حاجة", "Se tumbó a la bartola sin preocuparse de nada.", "استلقى في كسل وتراخٍ تام دون أن يبالي بشيء.", "daily"),
    ("a la chita callando", "idiom", "C1", "في سرية وتكتم تامين", "من تحت لتحت في السكات", "Compró la empresa a la chita callando.", "اشترى الشركة في سرية وتكتم تامين دون إثارة انتباه.", "society"),
    ("a la fuerza", "idiom", "A2", "بالإكراه والقوة", "غصب عنه وبالعافية", "Nadie debe aprender un idioma a la fuerza.", "لا ينبغي لأحد أن يتعلم لغة بالإكراه والضغط.", "study"),
    ("a la intemperie", "idiom", "B1", "في العراء دون مأوى", "في الشارع وتحت السما", "Tuvieron que dormir a la intemperie por el terremoto.", "اضطروا للنوم في العراء دون مأوى بسبب الزلزال.", "daily"),
    ("a la luz de", "collocation", "B2", "على ضوء / بالنظر إلى", "على ضوء وعلى أساس", "Debemos reevaluar el plan a la luz de los nuevos datos.", "يجب أن نعيد تقييم الخطة على ضوء البيانات الجديدة.", "study"),
    ("a la orden del día", "idiom", "B1", "أمر مألوف وشائع يومياً", "على ودنه ومألوف كل يوم", "Los retrasos están a la orden del día en esta línea.", "أصبحت التأخيرات أمراً مألوفاً وشائعاً يومياً في هذا الخط.", "transport"),
    ("a la primera de cambio", "idiom", "B2", "عند أول فرصة سانحة أو عائق", "مع أول عثرة أو أول فرصة", "Se rindió a la primera de cambio sin intentarlo más.", "استسلم عند أول فرصة سانحة أو عائق دون المحاولة مجدداً.", "social"),
    ("a las mil maravillas", "idiom", "A2", "على أكمل وجه وبأروع ما يكون", "زي الفل تمام ومية مية", "El proyecto marcha a las mil maravillas.", "يسير المشروع على أكمل وجه وبأروع ما يكون.", "work"),
    ("a las tantas", "idiom", "B1", "في ساعة متأخرة جداً من الليل", "في وقت متأخر بعد نص الليل", "Llegó a casa a las tantas tras el concierto.", "وصل إلى البيت في ساعة متأخرة جداً بعد الحفل.", "daily"),
    ("a marchas forzadas", "idiom", "B2", "بأقصى سرعة وعلى عجل مضاعف", "بأقصى سرعة ومن غير نوم", "Trabajan a marchas forzadas para inaugurar a tiempo.", "يعملون بأقصى سرعة وعلى عجل لافتتاح المشروع في موعده.", "work"),
    ("a menudo", "collocation", "A1", "غالباً / في أحيان كثيرة", "كتير وفي أوقات كتير", "Viaja a menudo por motivos de trabajo.", "يسافر غالباً وفي أحيان كثيرة لأسباب تتعلق بالعمل.", "travel"),
    ("a ojos cerrados", "idiom", "B1", "بثقة عمياء ودون تردد", "على عمى وبثقة مقفولة", "Confío en su criterio a ojos cerrados.", "أثق برأيه وحكمه بثقة عمياء ودون تردد.", "social"),
    ("a oscuras", "collocation", "A2", "في الظلام الدامس", "في العتمة والضلمة", "Nos quedamos a oscuras por el corte de luz.", "بقينا في الظلام الدامس بسبب انقطاع التيار الكهربائي.", "housing"),
    ("a paso de tortuga", "idiom", "A2", "ببطء شديد كالسلاحف", "ببطء زي السلحفة", "El tráfico avanza a paso de tortuga hoy.", "تسير حركة المرور ببطء شديد كالسلاحف اليوم.", "transport"),
    ("a pedir de boca", "idiom", "B1", "وفق المرام تماماً كما نتمنى", "زي ما الكتاب بيقول وبالتمام", "Todo salió a pedir de boca en la ceremonia.", "سار كل شيء وفق المرام تماماً في الحفل.", "social"),
    ("a pesar de", "collocation", "A2", "على الرغم من / بالرغم من", "على الرغم من ورغم كدة", "Llegó puntual a pesar de la lluvia torrencial.", "وصل في الموعد المحدد على الرغم من المطر الغزير.", "daily"),
    ("a pierna suelta", "idiom", "B1", "بنوم عميق ومستغرق بلا قلق", "نوم عميق ومرتاح البال", "Durmió a pierna suelta durante diez horas.", "نام بنوم عميق ومستغرق بلا قلق لعشر ساعات كاملة.", "health"),
    ("a plazos", "collocation", "B1", "بالتقسيط المريح", "بالقسط وعلى دفعات", "Compró el electrodoméstico a plazos sin intereses.", "اشترى الجهاز الكهربائي بالتقسيط المريح دون فوائد.", "shopping"),
    ("a prueba de bombas", "idiom", "B2", "شديد المتانة والصمود", "يتحمل ومامنهوش خوف", "Tienen una amistad a prueba de bombas desde niños.", "تجمعهما صداقة شديدة المتانة والصمود منذ الطفولة.", "social"),
    ("a quemarropa", "idiom", "B2", "من مسافة قريبة جداً وبمباغتة", "من مسافة قريبة وعلى طول", "Le disparó la pregunta a quemarropa sin previo aviso.", "وجّه إليه السؤال بمباغتة ومن مسافة قريبة دون تمهيد.", "social"),
    ("a rajatabla", "idiom", "B2", "بحذافيره وبدقة صارمة", "بحذافيره ومن غير تهاون", "Cumple las normas sanitarias a rajatabla.", "يطبق القواعد الصحية بحذافيرها وبدقة صارمة.", "health"),
    ("a regañadientes", "idiom", "B1", "على مضض وتذمر", "غصب عنه وهو بيبرطم", "Aceptó ayudar en la mudanza a regañadientes.", "وافق على المساعدة في نقل الأثاث على مضض وتذمر.", "social"),
    ("a rienda suelta", "idiom", "B2", "بإطلاق العنان ودون قيود", "طلق العنان وساب الحبل", "Dio rienda suelta a su imaginación creativa.", "أطلق العنان لخياله الإبداعي دون قيود.", "arts"),
    ("a tientas", "idiom", "B1", "تلمساً بالأيدي في الظلمة", "بيتلمس في الضلمة", "Buscó el interruptor a tientas por la pared.", "بحث عن مفتاح النور تلمساً بيديه على الحائط.", "housing"),
    ("a toda costa", "collocation", "B1", "بأي ثمن ومهما كلف الأمر", "بأي تمن ومهما كان", "Quería ganar la carrera a toda costa.", "أراد الفوز بالسباق بأي ثمن ومهما كلف الأمر.", "sports"),
    ("a toda prisa", "collocation", "A2", "بأقصى سرعة واستعجال", "بسرعة الصاروخ وعلى عجل", "Salió a toda prisa para no perder el tren.", "خرج بأقصى سرعة واستعجال كي لا يفوته القطار.", "travel"),
    ("a tiro de piedra", "idiom", "B1", "على مرمى حجر (قريب جداً)", "على رمية حجر وقريب أوي", "La playa queda a tiro de piedra del apartamento.", "يقع الشاطئ على مرمى حجر وقريب جداً من الشقة.", "housing"),
    ("a tontas y a locas", "idiom", "B2", "بعشوائية وطيش بلا تدبر", "كده وخلاص من غير عقل", "Actuó a tontas y a locas y perdió la inversión.", "تصرّف بعشوائية وطيش بلا تدبر فخسر استثماره.", "daily"),
    ("a solas", "collocation", "A2", "على انفراد / بمفرده", "لوحده وعلى انفراد", "Prefiero hablar de esto a solas contigo.", "أفضل مناقشة هذا الأمر على انفراد معك.", "social"),
    ("abrir el apetito", "collocation", "A2", "فتح الشهية للطعام", "فتح النفس للأكل", "El aroma del pan recién horneado abre el apetito.", "تفتح رائحة الخبز الطازج الشهية للطعام.", "food"),
    ("abrir el corazón", "collocation", "B1", "فتح قلبه وباح بأسراره", "فتح قلبه وباح باللي جواه", "Decidió abrir el corazón a su mejor amiga.", "قرر أن يفتح قلبه ويبوح بأسراره لصديقته المقربة.", "social"),
    ("abrir los ojos", "collocation", "A2", "فتح عينيه / أدرك الحقيقة", "صحصح وشاف الحقيقة", "El desengaño le ayudó a abrir los ojos a tiempo.", "ساعدته الخيبة على فتح عينيه وإدراك الحقيقة في الوقت المناسب.", "social"),
    ("ahogarse en un vaso de agua", "idiom", "B1", "ضخم الأمور وعجز أمام أتفه عقبة", "غرق في شبر مية", "No te preocupes tanto, no te ahogues en un vaso de agua.", "لا تقلق كثيراً، ولا تضخم الأمور وتغرق في شبر ماء.", "daily"),
    ("al aire libre", "collocation", "A2", "في الهواء الطلق", "في الهوا الطلق برة", "Nos encanta hacer deporte al aire libre los domingos.", "نعشق ممارسة الرياضة في الهواء الطلق أيام الأحد.", "sports"),
    ("al cabo de", "collocation", "A2", "بعد انقضاء / في نهاية مدة", "بعد مرور وقت", "Volvió a su tierra al cabo de diez años en el extranjero.", "عاد إلى وطنه بعد انقضاء عشر سنوات في الغربة.", "travel"),
    ("al dedillo", "idiom", "B1", "عن ظهر قلب وبإتقان تام", "زي اسمه وبصم", "Se sabe el temario del examen al dedillo.", "يحفظ مقررات الامتحان عن ظهر قلب وبإتقان تام.", "study"),
    ("al fin y al cabo", "collocation", "B1", "في نهاية المطاف / في المحصلة", "في الآخر وفي النهاية", "Al fin y al cabo, somos una gran familia.", "في نهاية المطاف والمحصلة، نحن أسرة واحدة مترابطة.", "family"),
    ("al pie de la letra", "idiom", "B1", "حرفياً دون أي تبديل", "بالحرف ومن غير تغيير", "Siguió las instrucciones del médico al pie de la letra.", "اتبع تعليمات الطبيب حرفياً ودون أي تبديل.", "health"),
    ("andar con pies de plomo", "idiom", "B2", "توخى الحذر الشديد والتؤدة", "يمشي على بيض وبحذر شديد", "En este negocio hay que andar con pies de plomo.", "في هذه المعاملة التجارية ينبغي توخي الحذر الشديد والتؤدة.", "work"),
    ("andar por las ramas", "idiom", "B1", "حاد عن الموضوع وأطنب", "يلف ويدور وميدخلش في الموضوع", "Ve al grano y no andes por las ramas.", "ادخل في صلب الموضوع مباشرة ولا تحد عنه بالدوران.", "daily"),
    ("armarse de valor", "collocation", "B1", "تسلح بالشجاعة والجرأة", "قوّى قلبه واتشجع", "Tuvo que armarse de valor para hablar en público.", "اضطر للتسلح بالشجاعة والجرأة ليتحدث أمام الجمهور.", "social"),
    ("atacar cabos", "idiom", "B2", "ربط الخيوط واستنتج الحقيقة", "جمع الخيوط وفهم الموضوع", "Al atar cabos comprendió toda la estratagema.", "عندما ربط الخيوط ببعضها فهم الحيلة والمؤامرة كاملة.", "study"),
    ("bailar con la más fea", "idiom", "B2", "تحمل أصعب المهام وأكثرها شقاءً", "شال الليلة الصعبة كلها", "En este reparto le tocó bailar con la más fea.", "في هذا التوزيع للمهام كان نصيبه تحمل أصعبها وأشقها.", "work"),
    ("bajar la guardia", "collocation", "B1", "تراخى وغفل عن الحذر", "نزل حذره وغفل شوية", "No podemos bajar la guardia ante la pandemia.", "لا يمكننا التراخي والغفلة عن الحيطة والحذر أمام الوباء.", "health"),
    ("bajar los brazos", "collocation", "B1", "استسلم وتخلى عن النضال", "رفع الراية واستسلم", "A pesar del cansancio, nunca bajó los brazos.", "على الرغم من الإرهاق الشديد، لم يستسلم ولم يتخل عن النضال قط.", "social"),
    ("borrón y cuenta nueva", "idiom", "B1", "صفحة جديدة ونسيان الماضي", "عفا الله عما سلف وصفحة جديدة", "Hagamos borrón y cuenta nueva para convivir en paz.", "لنفتح صفحة جديدة وننسَ ما سلف لنعيش في وئام وسلام.", "social"),
    ("buena fe", "collocation", "B1", "حسن نية وصدق طوية", "نية صافية وحسن نية", "Actuó de buena fe sin intención de perjudicar a nadie.", "تصرّف بحسن نية وصدق طوية دون قصد إيذاء أحد.", "social"),
    ("cabeza de turco", "idiom", "B2", "كبش فداء يُحمل وزر غيره", "كبش فدا وشال الغلطة", "Le utilizaron como cabeza de turco para tapar el fraude.", "اتخذوا منه كبش فداء للتغطية على عملية الاحتيال.", "society"),
    ("caer bien", "collocation", "A1", "نال الإعجاب واستلطف", "دخل قلبه وخفيف على القلب", "El nuevo compañero de trabajo me cae muy bien.", "أستلطف زميل العمل الجديد كثيراً فهو مريح المعشر.", "social"),
    ("caer como agua de mayo", "idiom", "B2", "جاء في أوانه كالغيث النافع", "جه في وقته زي المطر المنقذ", "La noticia del premio cayó como agua de mayo en la empresa.", "جاء خبر الفوز بالجائزة في أوانه كالغيث النافع للمؤسسة.", "daily"),
    ("caer en la cuenta", "collocation", "B1", "فطن للأمر واستوعب فجأة", "أخد باله فجأة وفهم", "Tardé unos minutos en caer en la cuenta de mi error.", "تأخرت بضع دقائق قبل أن أفطن لخطئي وأستوعبه فجأة.", "study"),
    ("caer en saco roto", "idiom", "B2", "ذهب سدى بلا صدى", "راح في الهوا ومحدش سمع", "Sus sabios consejos cayeron en saco roto.", "ذهبت نصائحه الحكيمة سدى ودون أن تجد لها أي صدى.", "social"),
    ("caer en saco roto", "idiom", "B2", "ذهب سدى", "ذهب سدى", "La advertencia cayó en saco roto por desidia.", "ذهبت التحذيرات سدى بسبب الإهمال.", "social"),
    ("caer gordo", "collocation", "A2", "ثقل على النفس واستُثقل", "دمه تقيل على قلبه", "Ese vecino ruidoso me cae gordo desde el primer día.", "أستثقل ذلك الجار الصاخب وأجده ثقيلاً على النفس منذ اللقاء الأول.", "social"),
    ("cambiar de idea", "collocation", "A2", "غيّر رأيه وقناعاته", "غيّر رأيه وفكر في حاجة تانية", "Iba a viajar hoy, pero decidió cambiar de idea.", "كان ينوي السفر اليوم، لكنه قرر تغيير رأيه.", "daily"),
    ("cambiar de opinión", "collocation", "A2", "بدّل وجهة نظره", "بدّل رأيه", "Es de sabios cambiar de opinión cuando hay nuevas pruebas.", "من سمات الحكماء تبديل وجهة النظر عند ظهور أدلة جديدة.", "study"),
    ("cantar las cuarenta", "idiom", "B2", "وبخ بحزم وقال الحقيقة في الوجه", "سمعه كلمتين في جنابه", "El jefe le cantó las cuarenta por llegar tarde siempre.", "وبخه المدير بحزم وقال له الحقيقة في وجهه لتكرار تأخره.", "work"),
    ("cargar las pilas", "idiom", "A2", "شحن طاقته واستعاد نشاطه", "شحن طاقته وروّق", "Las vacaciones en la montaña sirven para cargar las pilas.", "تُفيد الإجازة في الجبال في شحن الطاقة واستعادة النشاط.", "health"),
    ("chuparse el dedo", "idiom", "B1", "ساذج يُخدع بسهولة", "مش ساذج علشان يضحك عليه", "No creas que me chupo el dedo, sé bien lo que buscas.", "لا تظن أنني ساذج أُخدع بسهولة، فأنا أعلم جيداً ما تبتغيه.", "social"),
    ("coger el toro por los cuernos", "idiom", "B2", "واجه المعضلة بشجاعة ومباشرة", "مسك المشكلة من قرونها بشجاعة", "Hay que coger el toro por los cuernos y solucionar esto ya.", "ينبغي مواجهة المعضلة بشجاعة ومباشرة وحلها في الحال.", "work"),
    ("con el corazón en la mano", "idiom", "B1", "بكل صدق وإخلاص وصراحة", "بكل صراحة ومن قلبه", "Te hablo con el corazón en la mano, sin falsedades.", "أتحدث إليك بكل صدق وإخلاص وصراحة دون أي زيف.", "social"),
    ("con las manos en la masa", "idiom", "A2", "متلبساً بالجرم المشهود", "متلبس بالجرم المشهود", "La policía pilló al ladrón con las manos en la masa.", "ضبطت الشرطة السارق متلبساً بالجرم المشهود داخل البيت.", "society"),
    ("con lupa", "idiom", "B1", "بتدقيق وفحص فائق الدقة", "بالمجهر وبالميكروسكوب", "Revisó el contrato con lupa antes de estampar su firma.", "فحص بنود العقد بتدقيق فائق قبل أن يوقع عليه.", "work"),
    ("consultar con la almohada", "idiom", "B1", "تمهل وفكر ملياً قبل القرار", "نام وفكر كويس قبل ما يقرر", "No te precipites, consúltalo con la almohada esta noche.", "لا تتعجل، بل تمهل وفكر في الأمر ملياً هذه الليلة.", "daily"),
    ("contra viento y marea", "idiom", "B2", "رغم أنف كل الصعاب والعقبات", "رغم الصعاب والظروف كلها", "Sacó adelante a sus hijos contra viento y marea.", "ربى أولاده ونهض بهم رغم أنف كل الصعاب والعقبات.", "family"),
    ("cortar por lo sano", "idiom", "B2", "بتر المشكلة من جذورها بحسم", "قطع الشك باليقين وجاب آخرها", "Decidió cortar por lo sano y romper relaciones con él.", "قرر بتر المشكلة من جذورها بحسم وقطع كل صلاته به.", "social"),
    ("costar un ojo de la cara", "idiom", "A2", "باهظ الثمن للغاية", "غالي أوي ويكلف دم قلبك", "Ese coche deportivo debe costar un ojo de la cara.", "لا بد أن تلك السيارة الرياضية باهظة الثمن للغاية وتكلف ثروة.", "shopping"),
    ("costar un riñón", "idiom", "B1", "كلف ثمناً فاحشاً", "يكلف الكلية بتاعته وغالي موت", "La reparación de la caldera me va a costar un riñón.", "سيكلفني تصليح السخان ثمناً فاحشاً وخطيراً.", "housing"),
    ("dar calabazas", "idiom", "B1", "رفض طلباً عاطفياً / أسقط طالباً", "رفضت حبه / سقط في الامتحان", "Ella le dio calabazas cuando le pidió matrimonio.", "رفضت طلبه حينما طلب الزواج منها بود ولطف.", "social"),
    ("dar con la tecla", "idiom", "B2", "اهتدى للحل الصحيح والمفتاح", "لقى السر والحل الصح", "Tras muchos ensayos dio con la tecla del fallo informático.", "بعد تجارب عديدة اهتدى للحل الصحيح ولسبب العطل التقني.", "science"),
    ("dar de qué hablar", "collocation", "B1", "أثار الجدل ولفت الأحاديث", "عمل قلق وخلى الناس تتكلم", "Su polémico vestido dio de qué hablar en la gala.", "أثار ثوبها المثير للجدل أحاديث الحاضرين في الحفل الكبير.", "arts"),
    ("dar el brazo a torcer", "idiom", "B2", "أذعن وتنازل عن عناده", "لين دماغه ورضي يتنازل", "Es muy testarudo y nunca da el brazo a torcer.", "إنه عنيد جداً ولا يذعن ولا يتنازل عن موقفه أبداً.", "social"),
    ("dar gato por liebre", "idiom", "B1", "غش وباع الرديء مكان الأصيل", "غشه وباعه ترماي", "En ese mercado intentaron darme gato por liebre con la lana.", "حاولوا في تلك السوق غشي وبيع الصوف الرديء مكان الأصيل.", "shopping"),
    ("dar la cara", "collocation", "B1", "واجه العواقب بشجاعة ولم يختبئ", "واجه ووقف راجل", "El director supo dar la cara ante la junta de vecinos.", "استطاع المدير مواجهة الموقف بشجاعة أمام مجلس السكان.", "social"),
    ("dar la lata", "idiom", "A2", "أزعج وألح بإصرار ممل", "صدع ودوش على الفاضي", "Deja de dar la lata con la misma pregunta una y otra vez.", "كف عن الإزعاج والإلحاح الممل بنفس السؤال مراراً وتكراراً.", "daily"),
    ("dar la vuelta a la tortilla", "idiom", "B2", "قلب الموقف لصالحه تماماً", "قلب الترابيزة لصالحه", "El equipo supo dar la vuelta a la tortilla en el segundo tiempo.", "استطاع الفريق قلب الموقف لصالحه تماماً في الشوط الثاني.", "sports"),
    ("dar luz verde", "collocation", "B1", "منح الضوء الأخضر والموافقة", "إدى الضوء الأخضر والموافقة", "El ayuntamiento dio luz verde a la obra del polideportivo.", "منحت البلدية الضوء الأخضر والموافقة لبناء المجمع الرياضي.", "city"),
    ("dar por sentado", "collocation", "B1", "اعتبر الأمر مسلماً به ومفروغاً منه", "اعتبره مفروغ منه ومسلم بيه", "No des por sentado que vendrán todos a la reunión.", "لا تعتبر حضور الجميع إلى الاجتماع أمراً مسلماً به ومفروغاً منه.", "work"),
    ("darse cuenta", "collocation", "A2", "انتبه وأدرك الأمر", "أخد باله واستوعب", "Se dio cuenta de que había olvidado las llaves dentro.", "انتبه وأدرك فجأة أنه نسي المفاتيح داخل البيت.", "housing"),
    ("de buena gana", "collocation", "B1", "برحابة صدر وطيب خاطر", "من كل قلبه وعن طيب خاطر", "Aceptaría el reto de buena gana si tuviera tiempo.", "لقبلت التحدي برحابة صدر وطيب خاطر لو كان لدي متسع من الوقت.", "social"),
    ("de cabo a rabo", "idiom", "B1", "من أوله إلى آخره دون إغفال", "من طقطق لسلام عليكم", "Se leyó la novela de cabo a rabo en una noche.", "قرأ الرواية من أولها إلى آخرها دون إغفال في ليلة واحدة.", "arts"),
    ("de golpe y porrazo", "idiom", "B2", "فجأة ومن غير سابق إنذار", "فجأة كده ومن غير تمهيد", "Cambiaron las condiciones laborales de golpe y porrazo.", "غيّروا شروط العمل فجأة ومن غير أي سابق إنذار.", "work"),
    ("de mala gana", "collocation", "B1", "بتكاسل وتبرم وضيق", "من غير نفس وقرفان", "Limpió la cocina de mala gana y refunfuñando.", "نظف المطبخ بتكاسل وضيق وهو يتمتم متبرماً.", "daily"),
    ("de memoria", "collocation", "A1", "عن ظهر قلب بالحفظ", "صم ومن الذاكرة", "Recitó el poema de memoria ante toda la clase.", "ألقى القصيدة عن ظهر قلب وبالحفظ التام أمام زملائه.", "study"),
    ("de ninguna manera", "collocation", "A1", "على الإطلاق وبأي حال من الأحوال", "ولا بأي شكل ومستحيل", "No pienso tolerar esa falta de respeto de ninguna manera.", "لن أتساهل مع قلة الاحترام تلك على الإطلاق وبأي حال.", "social"),
    ("de par en par", "collocation", "A2", "على مصراعيه مفتوحاً تماماً", "مفتوح على مصراعيه ع الآخر", "Abrió la ventana de par en par para ventilar la casa.", "فتح النافذة على مصراعيها لتهوية أرجاء المنزل.", "housing"),
    ("de sol a sol", "idiom", "B1", "من الشروق حتى الغروب كدحاً", "من طلوع الشمس لمغيبها شغال", "Los campesinos trabajaban de sol a sol en la siega.", "كان الفلاحون يكدحون من الشروق حتى الغروب في موسم الحصاد.", "nature"),
    ("de un tirón", "collocation", "B1", "في جلسة واحدة متواصلة", "سحبة واحدة وشروة واحدة", "Escribió el artículo entero de un tirón.", "كتب المقال كاملاً في جلسة واحدة متواصلة ودون انقطاع.", "work"),
    ("de uvas a peras", "idiom", "B2", "نادراً جداً وعلى فترات متباعدة", "فين وفين ومن العيد للعيد", "Solo visita a sus primos de uvas a peras.", "لا يزور أبناء عمومته إلا نادراً جداً وعلى فترات متباعدة.", "family"),
    ("del dicho al hecho", "idiom", "B1", "بين القول والفعل بون شاسع", "الكلام سهل والفعل صعب", "Del dicho al hecho hay un gran trecho en política.", "بين القول والفعل بون شاسع ومسافة كبيرة في عالم السياسة.", "society"),
    ("echar de menos", "collocation", "A1", "اشتاق وافتقد شخصاً", "وحشه وافتقده جداً", "Echo de menos a mi familia cuando viajo lejos.", "أشتاق إلى عائلتي وأفتقدها كثيراً عندما أسافر بعيداً.", "family"),
    ("echar el cerrojo", "collocation", "B1", "أغلق الباب بالمزلاج بإحكام", "قفل الباب بالترباس والضبة", "Asegúrate de echar el cerrojo al salir del piso.", "تأكد من إغلاق الباب بالمزلاج بإحكام عند مغادرة الشقة.", "housing"),
    ("echar leña al fuego", "idiom", "B1", "صب الزيت على النار وزاد الخلاف", "ولعها أكتر وصب زيت على النار", "Con ese comentario solo vas a echar leña al fuego.", "بتعليقك هذا لن تفعل سوى صب الزيت على النار وزيادة الخلاف.", "social"),
    ("echar una mano", "collocation", "A2", "مد يد العون والمساعدة", "مد إيده وساعد", "Ven a echar una mano con las bolsas de la compra.", "تعالَ ومد يد العون والمساعدة في حمل أكياس البقالة.", "daily"),
    ("el pan de cada día", "idiom", "B1", "الخبز اليومي المألوف للجميع", "عيشنا اليومي وحاجة عادية", "El estrés en la oficina es el pan de cada día.", "أصبح التوتر في المكتب بمثابة الخبز اليومي المألوف لجميع الموظفين.", "work"),
    ("en carne propia", "idiom", "B1", "في شخصه وتجربته الذاتية", "على جلده وبنفسه جربها", "Sufrió en carne propia las consecuencias de la crisis.", "عاش في شخصه وتجربته الذاتية عواقب الأزمة الاقتصادية القاسية.", "social"),
    ("en cueros", "collocation", "B2", "عارٍ تماماً بلا ملابس", "ملط ومن غير هدوم", "El niño corría en cueros por la orilla del mar.", "كان الصغير يركض عارياً تماماً على شاطئ البحر.", "daily"),
    ("en definitiva", "collocation", "B1", "باختصار وخلاصة القول", "في الخلاصة وعلى بلاطة", "En definitiva, fue una experiencia enriquecedora para todos.", "باختصار وخلاصة القول، كانت تجربة ثرية ومفيدة للجميع.", "study"),
    ("en el fondo", "collocation", "A2", "في أعماق نفسه وحقيقة أمره", "في قرارة نفسه ومن جواه", "En el fondo sabe que cometió una imprudencia.", "في أعماق نفسه وحقيقة أمره يعلم أنه ارتكب حماقة.", "social"),
    ("en fila india", "collocation", "A2", "في رتل واحد وراء بعضهم", "ورا بعض في طابور واحد", "Los excursionistas avanzaban en fila india por el sendero.", "كان المتجولون يتقدمون في رتل واحد وراء بعضهم على الدرب.", "travel"),
    ("en menos que canta un gallo", "idiom", "B1", "في طرفة عين وبسرعة فائقة", "في غمضة عين وقبل ما يقول يا فكيك", "Arregló el pinchazo en menos que canta un gallo.", "أصلح ثقب الإطار في طرفة عين وبسرعة فائقة.", "transport"),
    ("en primer lugar", "collocation", "A2", "في المقام الأول وبدايةً", "أول حاجة وفي الأول", "En primer lugar, quiero agradecerles su asistencia.", "في المقام الأول وبدايةً، أود أن أشكركم على حضوركم الطيب.", "study"),
    ("en punto", "collocation", "A1", "تماماً عند رأس الساعة", "بالظبط ورأس الساعة", "El tren saldrá a las ocho en punto de la mañana.", "سينطلق القطار في تمام الساعة الثامنة صباحاً بالتحديد.", "travel"),
    ("en un abrir y cerrar de ojos", "idiom", "A2", "في لمح البصر وغفلة الزمان", "في غمضة عين ولمح البصر", "El ladrón desapareció en un abrir y cerrar de ojos.", "توارى اللص عن الأنظار في لمح البصر وغفلة الزمان.", "society"),
    ("en un dos por tres", "idiom", "A2", "في ثوانٍ معدودة بسرعة", "في كلمتين وبسرعة صاروخ", "Hizo la tarea escolar en un dos por tres.", "أنهى واجبه المدرسي في ثوانٍ معدودة وبسرعة فائقة.", "study"),
    ("en vilo", "idiom", "B2", "في ترقب وتوجس مشدود الأعصاب", "على أعصابه وقلقان أوي", "El final de la serie nos mantuvo en vilo toda la noche.", "أبقتنا نهاية المسلسل في ترقب وتوجس مشدودي الأعصاب طوال الليل.", "arts"),
    ("encogerse de hombros", "collocation", "A2", "هز كتفيه تعبيراً عن الجهل أو اللامبالاة", "رفع كتافه ومش فارقة معاه", "Al preguntarle la hora se limitó a encogerse de hombros.", "حينما سألته عن الوقت اكتفى بهز كتفيه دون اكتراث.", "daily"),
    ("estar al loro", "idiom", "B2", "يقظ ومنتبه لكل شاردة وواردة", "مصحصح وواخد باله كويس", "Hay que estar al loro para no perderse ninguna oferta.", "يجب أن تكون يقظاً ومنتبهاً كي لا تفوتك أي من العروض المميزة.", "shopping"),
    ("estar como una cabra", "idiom", "A2", "مجنون التصرفات ومتهور", "مجنون وفاقد عقله", "Ese chico hace cosas insólitas, está como una cabra.", "يفعل هذا الفتى أموراً بالغة الغرابة فهو مجنون التصرفات ومتهور.", "social"),
    ("estar de más", "collocation", "B1", "فائض لا حاجة إليه وزائد", "زيادة ومفيش منه داعي", "Tus comentarios despectivos están de más en esta mesa.", "إن تعليقاتك الازدرائية فائضة ولا حاجة إليها على هذه المائدة.", "social"),
    ("estar en ascuas", "idiom", "B2", "على أحرّ من الجمر في حيرة", "على نار وقلقان جداً", "Esperaba los resultados del examen y estaba en ascuas.", "كان ينتظر نتائج الامتحان وهو على أحر من الجمر في قلق وترقب.", "study"),
    ("estar en Babia", "idiom", "B1", "شارد الذهن وغائب عن الوعي", "سرحان وفي دنيا تانية", "No prestó atención en clase porque estaba en Babia.", "لم ينتبه في الصف لأنه كان شارد الذهن وغائباً عما حوله.", "study"),
    ("estar en blanco", "collocation", "A2", "خالي الذهن وناسي لكل معلومة", "مخه فاضي ونسي كل حاجة", "Llegó al examen y se quedó totalmente en blanco.", "وصل إلى قاعة الامتحان وأصبح ذهنه خالياً تماماً ونسي كل شيء.", "study"),
    ("estar en el paro", "collocation", "A2", "عاطل عن العمل ويتلقى الإعانة", "عاطل ومش لاقي شغل", "Por desgracia, lleva seis meses estando en el paro.", "للأسف، أمضى ستة أشهر وهو عاطل عن العمل ويبحث عن وظيفة.", "work"),
    ("estar en la luna", "idiom", "A2", "في عالم آخر وغارق في الشرود", "سرحان في القمر وغايب", "Le hablas y no responde porque está en la luna.", "تحدثه ولا يرد عليك لأنه غارق في الشرود وفي عالم آخر.", "social"),
    ("estar en las nubes", "idiom", "A2", "سارح بين السحاب بعيداً عن الواقع", "في السحاب وسرحان", "Mira por la ventana y parece estar siempre en las nubes.", "ينظر من النافذة ويبدو دائماً سارحاً بين السحاب بعيداً عن الواقع.", "daily"),
    ("estar hasta la coronilla", "idiom", "B1", "فاض به الكيل وطفح الكيل عنده", "زهقان لحد النخاع وطافح الكيل", "Estoy hasta la coronilla de tantas quejas continuas.", "لقد فاض بي الكيل وطفح عندي من كثرة الشكاوى المتواصلة.", "daily"),
    ("hacer caso", "collocation", "A1", "أصغى وأخذ بالنصيحة", "سمع الكلام واهتم", "Debes hacer caso a las advertencias de tu maestro.", "يجب عليك أن تصغي لنصائح أستاذك وتأخذ بتوجيهاته.", "study"),
    ("hacer de las suyas", "idiom", "B1", "عاود حركاته وشقاوته المعتادة", "رجع لعوايده وحركاته", "El gato travieso volvió a hacer de las suyas en el salón.", "عاود القط المشاغب حركاته وشقاوته المعتادة في غرفة الجلوس.", "daily"),
    ("hacer el agosto", "idiom", "B2", "جنى أرباحاً طائلة في فرصة ذهبية", "عمل قرشين حلوين واستغل الموسم", "Los comerciantes de la playa hacen el agosto en verano.", "يجني تجار الشاطئ أرباحاً طائلة في موسم الصيف الواعد.", "work"),
    ("hacer la vista gorda", "idiom", "B1", "تغاضى وتغافل عمداً عن المخالفة", "طنش وعمل نفسه مش شايف", "El policía decidió hacer la vista gorda con la falta leve.", "قرر الشرطي التغاضي والتغافل عمداً عن المخالفة البسيطة.", "society"),
    ("hacer puente", "collocation", "A2", "وصل العطلة بضم يوم بين عطلتين", "أخد يوم إجازة يشبك الأسبوع", "Los empleados harán puente el próximo viernes.", "سيصل الموظفون عطلة نهاية الأسبوع بضم يوم الجمعة القادم.", "work"),
    ("hacer trampas", "collocation", "A2", "غش وتلاعب في اللعب أو الاختبار", "غش ولعب من تحت الترابيزة", "No vale hacer trampas en las partidas de cartas.", "لا يجوز الغش والتلاعب في جولات لعب الورق.", "sports"),
    ("hacerse el sueco", "idiom", "B2", "تظاهر بعدم الفهم والتجاهل", "عمل نفسه عبيط ومش فاهم", "Cuando le reclamé la deuda se hizo el sueco.", "حينما طالبته بسداد الدين تظاهر بعدم الفهم وتجاهل طلبي.", "social"),
    ("irse por los cerros de Úbeda", "idiom", "B2", "شط عن الموضوع وتشعب في استطراد", "شطح في الكلام وساب أصل الحكاية", "El orador se fue por los cerros de Úbeda sin responder.", "شط الخطيب عن الموضوع وتشعب في استطرادات دون الإجابة.", "study"),
    ("jugar con fuego", "idiom", "B1", "جازف وتعامل مع الخطر بتهور", "لعب بالنار واستهون", "Invertir sin saber es como jugar con fuego.", "إن الاستثمار دون معرفة وافية هو بمثابة اللعب بالنار والمجازفة.", "work"),
    ("levantar la liebre", "idiom", "B2", "كشف السر ولفت الانتباه للمستور", "فضح المستور وفجر القنبلة", "El periodista levantó la liebre sobre la red corrupta.", "كشف الصحفي المستور ولفت الانتباه لوجود شبكة الفساد.", "society"),
    ("llamar al pan pan y al vino vino", "idiom", "B2", "سمى الأشياء بأسمائها بلا مواربة", "سمى الحاجة باسمها على بلاطة", "Prefiero hablar con claridad y llamar al pan pan.", "أفضل الحديث بكل صراحة ووضوح وتسمية الأشياء بأسمائها.", "social"),
    ("llover sobre mojado", "idiom", "B2", "توالت عليه المصائب والمتاعب", "المصايب بتيجي ورا بعض على نفس المشكلة", "Tras la pérdida del empleo, la avería del coche fue llover sobre mojado.", "بعد فقدان الوظيفة، جاء تعطل السيارة بمثابة مصيبة تضاف إلى سابقتها.", "daily"),
    ("meter la pata", "idiom", "A2", "أخطأ خطأً فادحاً وأحرج نفسه", "جاب العيد ولخبط الدنيا", "Metí la pata al revelar el regalo sorpresa.", "أخطأت خطأً فادحاً وأحرجت نفسي حين كشفت عن الهدية المفاجئة.", "social"),
    ("meterse en camisa de once varas", "idiom", "B2", "أقحم نفسه في ورطة لا تعنيه", "حشر مناخيره في اللي ملوش فيه ولبس", "No te metas en camisa de once varas con sus disputas.", "لا تقحم نفسك في ورطة لا تعنيك وتتدخل في خلافاتهم العائلية.", "social"),
    ("mirar de reojo", "collocation", "B1", "نظر بطرف عينه خلسة أو بارتياب", "بص بطرف عينه كده", "El vigilante le miraba de reojo con cierta desconfianza.", "كان الحارس يرمقه بطرف عينه خلسة وبشيء من الارتياب.", "social"),
    ("morderse la lengua", "idiom", "B1", "كتم غيظه وامتنع عن الكلام بحكمة", "مسك لسانه وسكت بالعافية", "Tuve que morderme la lengua para no desatar una discusión.", "اضطررت لكتم غيظي والامتناع عن الكلام كي لا أثير جدالاً عقيماً.", "social"),
    ("no dar pie con bola", "idiom", "B1", "تخبط وفشل في إصابة أي صواب", "مش مظبوط ومبيعملش حاجة صح", "Hoy estoy disperso y no doy pie con bola.", "أنا اليوم مشتت الذهن للغاية وأتخبط ولا أوفق في أي عمل.", "daily"),
    ("no tener pelos en la lengua", "idiom", "B1", "صريح لا يتردد في قول الحق", "لسانه صريح ومبيخافش", "Dice lo que piensa sin rodeos, no tiene pelos en la lengua.", "يقول ما يعتقده دون مواربة، فهو صريح وجريء في إبداء رأيه.", "social"),
    ("ojo por ojo", "idiom", "B1", "المعاملة بالمثل (العين بالعين)", "العين بالعين والسن بالسن", "El principio de ojo por ojo solo engendra más violencia.", "إن مبدأ العين بالعين والمعاملة بالمثل لا يولد سوى مزيد من العنف.", "society"),
    ("pagar el pato", "idiom", "B1", "تحمل وزر وخطأ لم يرتكبه", "شال الليلة ودفع الفاتورة", "Los becarios siempre acaban pagando el pato de los retrasos.", "ينتهي الأمر بالمتدربين دائماً إلى تحمل وزر تأخيرات لم يرتكبوها.", "work"),
    ("partir de cero", "collocation", "B1", "بدأ من نقطة الصفر مجدداً", "بدأ من الصفر على نظيف", "Tras el incendio tuvieron que partir de cero con el negocio.", "بعد الحريق اضطروا للبدء من نقطة الصفر مجدداً في تجارتهم.", "work"),
    ("pedir peras al olmo", "idiom", "B1", "طلب المستحيل والمأمول من غير أهله", "بيطلب لبن العصفور من اللي ميملكوش", "Exigirle paciencia a un niño inquieto es pedir peras al olmo.", "إن مطالبة طفل مفرط الحركة بالصبر بمثابة طلب المستحيل من غير أهله.", "daily"),
    ("perder la cabeza", "collocation", "B1", "فقد صوابه وعقله من الغضب أو الشغف", "فقد عقله واتجنن", "No pierdas la cabeza por una simple provocación verbal.", "لا تفقد صوابك وعقلك لمجرد استفزاز كلامي عابر.", "social"),
    ("poner el dedo en la llaga", "idiom", "B2", "أصاب كبد الحقيقة ومكمن الوجع", "حط إيده على الجرح بالظبط", "Su crítica certera puso el dedo en la llaga de la corrupción.", "أصابت انتقاداته الدقيقة كبد الحقيقة ووضعت الإصبع على مكمن الفساد.", "society"),
    ("poner la mano en el fuego", "idiom", "B1", "أقسم على براءة فلان بثقة تامة", "حط إيده في النار وثقته عمياء", "Pongo la mano en el fuego por su honestidad intachable.", "أضع يدي في النار وأقسم على أمانته ونزاهته النقية بلا أدنى شك.", "social"),
    ("poner los puntos sobre las íes", "idiom", "B2", "وضع النقاط على الحروف بوضوح حاسم", "حط النقط على الحروف بصراحة", "Reunió a los socios para poner los puntos sobre las íes.", "جمع الشركاء لوضع النقاط على الحروف بكل وضوح وحسم.", "work"),
    ("ponerse las pilas", "idiom", "A2", "شمر عن ساعد الجد واجتهد", "شد حيله وشمر وصحي لنفسه", "Tienes que ponerte las pilas si quieres aprobar el curso.", "يجب عليك أن تشمر عن ساعد الجد وتجتهد إذا أردت النجاح في الدورة.", "study"),
    ("por si las moscas", "idiom", "A2", "تحسباً لأي طارئ وللاحتياط", "علشان لو حصل أي حاجة وللاحتياط", "Lleva un paraguas en el coche, por si las moscas.", "احمل مظلة في السيارة تحسباً لأي طارئ وللاحتياط من المطر.", "daily"),
    ("prestar atención", "collocation", "A1", "أعار انتباهاً وأنصت بتركيز", "ركّز وفتح ودانه", "Debes prestar atención a las explicaciones del profesor.", "يجب عليك أن تعير انتباهاً وتصغي لشروح المعلم في الصف.", "study"),
    ("quedarse de piedra", "idiom", "B1", "تسمر في مكانه من شدة الذهول", "اتسمر مكانه ومصدقش", "Se quedó de piedra al ver a su hermano tras veinte años.", "تسمر في مكانه من شدة الذهول حين رأى شقيقه بعد عشرين عاماً.", "social"),
    ("quitarse el sombrero", "idiom", "B1", "انحنى احتراماً وإعجاباً بإنجازه", "رفع له القبعة احتراماً وإعجاباً", "Hay que quitarse el sombrero ante su dedicación solidaria.", "يجب أن ينحني المرء إعجاباً وتقديراً لتفانيه وتضامنه الإنساني.", "social"),
    ("sacar de quicio", "idiom", "B1", "أخرجه عن طوره وأفقده صوابه", "عصبه وخرجه عن شعوره", "El ruido persistente de las obras me saca de quicio.", "إن الضجيج المستمر لأعمال البناء يخرجني عن طوري ويفقدني هدوئي.", "housing"),
    ("ser pan comido", "idiom", "A2", "في غاية السهولة واليسر", "زي شربة المية وسهل جداً", "El primer nivel del videojuego es pan comido.", "إن المستوى الأول من لعبة الفيديو في غاية السهولة واليسر.", "daily"),
    ("ser uña y carne", "idiom", "A2", "روحان في جسد واحد لا يفترقان", "زي السمنة على العسل وروحين في جسد", "Desde el colegio ellos dos han sido uña y carne.", "منذ أيام المدرسة وهما روحان في جسد واحد لا يفترقان أبداً.", "social"),
    ("sin ton ni son", "idiom", "B2", "بلا أدنى مناسبة ولا مبرر منطقي", "من غير مناسبة ولا سياق", "Empezó a gritar en la reunión sin ton ni son.", "بدأ في الصراخ في الاجتماع بلا أدنى مناسبة ولا مبرر منطقي.", "work"),
    ("tener en cuenta", "collocation", "A2", "أخذ بعين الاعتبار والحسبان", "حط في حسابه واعتبره", "Debemos tener en cuenta la opinión de los usuarios.", "يجب علينا أن نأخذ بعين الاعتبار والحسبان آراء المستخدمين.", "work"),
    ("tirar la casa por la ventana", "idiom", "B1", "أنفق بسخاء وبذخ في احتفال", "صرف ببذخ ومبخلش بحاجة", "Tiraron la casa por la ventana para la boda de su hija.", "أنفقوا بسخاء وبذخ عظيمين بمناسبة حفل زفاف ابنتهم الكبرى.", "family"),
    ("tirar la toalla", "idiom", "A2", "استسلم ورمى المنديل معلناً العجز", "رمى الفوطة واستسلم", "Aunque el camino era difícil, no quiso tirar la toalla.", "على الرغم من وعورة الطريق، لم يشأ أن يستسلم ويرمي المنديل.", "sports"),
    ("tomar el pelo", "idiom", "A2", "مازحه خادعاً / داعبه بسخرية", "بيشتغله وبيضحك عليه بهزار", "No te enfades, solo te estaba tomando el pelo un rato.", "لا تغضب، فكل ما في الأمر أنني كنت أمازحك وأداعبك بسخرية ودية.", "social"),
    ("ver las estrellas", "idiom", "A2", "رأى النجوم ظهراً من شدة الألم", "شاف النجوم في عز الظهر من الوجع", "Al golpearse el dedo del pie vio las estrellas del dolor.", "عندما اصطدم إصبع قدمه بالحافة رأى النجوم ظهراً من شدة الألم.", "health"),
    ("vivir al día", "collocation", "B1", "عاش يومه بيومه دون ادخار", "عايش يوم بيوم من غير تحويش", "Muchas familias humildes se ven obligadas a vivir al día.", "تجد الكثير من الأسر البسيطة نفسها مضطرة للعيش يوماً بيوم بلا ادخار.", "daily"),
    ("volver a las andadas", "idiom", "B2", "انتكس وعاد لعاداته القديمة السيئة", "رجع لريمة القديمة وعاد لطبعه", "Prometió cuidarse, pero volvió a las andadas enseguida.", "وعد بالاعتناء بصحته، لكنه سرعان ما انتكس وعاد لعاداته القديمة.", "health"),
]

def main():
    existing = get_existing_norms(exclude_slugs={"cv-idioms-collocations"})
    entries = []
    skipped = 0

    for item in RAW_EXPRESSIONS:
        head = item[0]
        norm = norm_vocab(head)
        if norm in existing:
            skipped += 1
            continue

        kind = item[1]
        level = item[2]
        msa = item[3]
        eg = item[4]
        ex_es = item[5]
        ex_ar = item[6]
        domain = item[7] if len(item) > 7 else "daily"

        entry = make_expr(head, kind, level, msa, eg, ex_es, ex_ar, domain=domain, rank=8)
        entries.append(entry)
        existing.add(norm)

    print(f"Idioms & Collocations: Prepared {len(entries)} new entries (skipped {skipped} existing).")
    emit_bundle("vocab-cv-idioms-collocations.json", "cv-idioms-collocations", "التعبيرات الاصطلاحية والمتلازمات اللفظية والأمثال", entries)

if __name__ == "__main__":
    main()
