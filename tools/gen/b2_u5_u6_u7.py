# -*- coding: utf-8 -*-
"""B2 Units 5 (Academic Writing), 6 (Negotiation & Persuasion), 7 (Environment & Society).
12 Lessons completing B2 Units 5, 6, and 7 based on:
- Aula Plus 4 & 5 (B2.1 & B2.2)
- Gramática del uso del español B1-B2 (Condicionales complejos, oraciones concesivas y causales)
- Nuevo Español 2000 Nivel Superior
- المرشد في اللغة الأسبانية (أساليب الكتابة الأكاديمية والتفاوض والبيئة)
"""
import sys, os
sys.path.insert(0, os.path.dirname(__file__))
from common import opt, choice_ex, fill_ex, order_ex, speak_ex, lesson_doc, review_block

# ==============================================================================
# UNIT 5: b2-u5-academic (الكتابة الأكاديمية والبحث العلمي)
# ==============================================================================

def make_lesson_estructura_ensayo_academico():
    slug = "b2-estructura-ensayo-academico"
    doc = {
        "slug": slug,
        "unitSlug": "b2-u5-academic",
        "levelCode": "B2",
        "titleAr": "هيكل المقال والبحث الأكاديمي: الأطروحة والبرهان المنهجي",
        "titleEs": "Estructura del ensayo académico: Hipótesis, argumentación y rigor metodológico",
        "subtitleAr": "صياغة الفرضية (la hipótesis)، تفريع الفصول، والتدرج المنطقي في عرض الأدلة",
        "order": 1,
        "estimatedMinutes": 20,
        "cefrLevel": "B2",
        "review": review_block(),
        "pedagogy": {
            "learningObjectivesAr": [
                "أن يركب المتعلم هيكلاً أكاديمياً متكاملاً لمقال بحثي (مقدمة، فرضية، عرض، استنتاج).",
                "أن يوظف مفاهيم البحث العلمي: hipótesis de partida, marco teórico, metodología, refutación.",
                "أن يصيغ الفرضية العلمية بلغة موضوعية مجردة بعيدة عن الذاتية."
            ],
            "grammarPoints": [
                {
                    "titleAr": "التراكيب الاصطلاحية لصياغة الفرضيات والمنهج الأكاديمي",
                    "explanationAr": "1. **طرح الفرضية التأسيسية**:\n- *Partimos de la hipótesis de que + Indicativo*: Partimos de la hipótesis de que la educación bilingüe mejora la cognición.\n- *El presente estudio tiene por objeto analizar...*\n2. **تحديد الإطار النظري والمنهجية**:\n- *En el marco teórico se revisan las corrientes principales*.\n- *Se adopta un enfoque cualitativo / cuantitativo para evaluar los resultados*.\n3. **الانتقال المنطقي بين الأقسام**:\n- *Una vez delimitado el objeto de estudio, procede examinar...*"
                }
            ],
            "commonMistakesAr": [
                "استخدام ضمير المتكلم 'yo' في الأبحاث الأكاديمية؛ العرف الجامعي الإسباني يفرض استخدام صيغة الجمع التواضعي (partimos de) أو الصيغة غير الشخصية (se plantea que).",
                "صياغة فرضية عامة غير قابلة للاختبار التجريبي أو القياس المنهجي."
            ],
            "dialectNotes": [
                {
                    "region": "EG",
                    "noteAr": "في الأبحاث الجامعية بنقول «البحث بتاعنا بيبدأ من فرضية إن التكنولوجيا بتغير سلوك المستهلك وبنعتمد على إطار نظري واضح». بالإسبانية: Partimos de la hipótesis de que la tecnología transforma el consumo, dentro de un marco teórico riguroso."
                }
            ],
            "culturalNoteAr": "الجامعات في إسبانيا وأمريكا اللاتينية تتبع معايير APA و MLA الصارمة في صياغة الرسائل والأبحاث (TFG و TFM والأطروحات)."
        },
        "contentBlocks": [
            {
                "id": f"cb-{slug}-intro",
                "type": "explanation",
                "titleAr": "ركائز البحث والمقال الأكاديمي",
                "bodyAr": "المفاهيم المنهجية:\n- **la hipótesis de partida**: الفرضية المبدئية التي ينطلق منها البحث للإثبات أو النفي\n- **el marco teórico**: الإطار النظري والمفاهيمي المؤسس للدراسة\n- **el rigor metodológico**: الصرامة المنهجية والدقة العلمية\n- **el enfoque cualitativo/cuantitativo**: المنهج الكيفي النوعي أو الكمي الإحصائي\n- **delimitar**: يحدد ويحصر نطاق موضوع البحث بدقة\n- **el objeto de estudio**: موضوع الدراسة والظاهرة الخاضعة للفحص",
                "examples": [
                    {"es": "El primer capítulo está dedicado a establecer el marco teórico de la investigación.", "ar": "الفصل الأول مكرس لتأسيس الإطار النظري للبحث."},
                    {"es": "Partimos de la hipótesis de que existe una correlación positiva entre ambas variables.", "ar": "ننطلق من الفرضية القائلة بوجود ارتباط طردي إيجابي بين المتغيرين."},
                    {"es": "Es imprescindible delimitar con precisión el objeto de estudio para evitar dispersiones.", "ar": "من الضروري تحديد موضوع الدراسة بدقة لتفادي التشتت."}
                ]
            }
        ],
        "newVocabulary": ["hipótesis", "marco teórico", "rigor metodológico", "enfoque", "delimitar", "objeto de estudio"],
        "reviewVocabulary": ["estudio", "investigación"]
    }

    exs = [
        choice_ex(
            "ex-b2-eea-1", "word_choice",
            "اختر المصطلح الأكاديمي الذي يدل على الفرضية الأساسية للبحث",
            ["vocabulary"], 1,
            "ما هي العبارة التي تعني 'الفرضية العلمية التي يسعى الباحث لاختبار صحتها'؟",
            "La _____ principal de este trabajo sostiene que el bilingüismo previene el deterioro cognitivo.",
            "... الرئيسية لهذا العمل تذهب إلى أن الثنائية اللغوية تقي من التدهور المعرفي.",
            [
                opt("a", "hipótesis", "الفرضية العلمية القابلة للاختبار (الصواب)", True),
                opt("b", "anécdota", "طرفة شخصية", False, "في البحث العلمي ننطلق من الفرضية la hipótesis."),
                opt("c", "trama", "حبكة روائية", False, "المصطلح الأكاديمي هو la hipótesis.")
            ],
            ["hipótesis", "marco teórico"],
            "la hipótesis هي الفرضية والتخمين العلمي المنهجي الذي ينطلق منه البحث للإثبات أو الدحض."
        ),
        fill_ex(
            "ex-b2-eea-2",
            "أكمل بالمصطلح الذي يعني المنهج المتبع في البحث: (el _____ metodológico)",
            ["vocabulary", "writing"], 1,
            "اكتب الكلمة المذكرة التي تعني 'المقاربة أو المنهجية': un _____ cualitativo.",
            "Para analizar las entrevistas en profundidad adoptamos un _____ cualitativo riguroso.",
            "لتحليل المقابلات المعمقة اعتمدنا مقاربة ومنهجاً نوعياً صارماً.",
            ["enfoque"],
            ["enfoque"],
            "el enfoque هو المقاربة أو المنظور المنهجي المعتمد في دراسة الظاهرة."
        ),
        choice_ex(
            "ex-b2-eea-3", "word_choice",
            "حدد المفهوم الأكاديمي الذي يشمل النظريات السابقة والمفاهيم التأسيسية للمجال",
            ["vocabulary"], 2,
            "ماذا نسمي الباب المخصص لمراجعة الأدبيات السابقة والنظريات القائمة في الرسالة؟",
            "En el _____ se analizan las aportaciones de los sociólogos más destacados del siglo XX.",
            "في ... يتم تحليل إسهامات أبرز علماء الاجتماع في القرن العشرين.",
            [
                opt("a", "marco teórico", "الإطار النظري والمفاهيمي (الصواب)", True),
                opt("b", "orden del día", "جدول الأعمال", False, "في الرسائل يسمى الإطار النظري el marco teórico."),
                opt("c", "acta", "محضر جلسة", False, "المفهوم هو el marco teórico.")
            ],
            ["marco teórico", "rigor metodológico", "hipótesis"],
            "el marco teórico هو الإطار النظري الذي يستند إليه الباحث لتأصيل مفاهيمه."
        ),
        order_ex(
            "ex-b2-eea-4",
            "رتّب الجملة الأكاديمية للدلالة على حصر وتحديد نطاق البحث",
            ["grammar", "writing"], 2,
            ["Es", "fundamental", "delimitar", "con", "claridad", "el", "objeto", "de", "estudio"],
            "Es fundamental delimitar con claridad el objeto de estudio",
            "الترتيب: العبارة Es fundamental ثم الفعل delimitar ثم شبه الجملة con claridad ثم المفعول el objeto de estudio.",
            ["delimitar", "objeto de estudio"]
        ),
        choice_ex(
            "ex-b2-eea-5", "listen_choose",
            "استمع للمناقشة الأكاديمية وحدد الميزة المنهجية التي أشادت بها لجنة التحكيم",
            ["listening", "vocabulary"], 2,
            "استمع لتقييم رئيس لجنة مناقشة الدكتوراه",
            "El tribunal valora especialmente el rigor metodológico demostrado en la tesis doctoral.",
            "تثمن اللجنة بشكل خاص الصرامة المنهجية التي ظهرت في أطروحة الدكتوراه.",
            [
                opt("a", "rigor metodológico", "الصرامة والدقة المنهجية العالية (الصواب)", True),
                opt("b", "falta de fuentes", "نقص المراجع", False, "اللجنة أشادت بـ el rigor metodológico."),
                opt("c", "subjetividad", "الذاتية والانطباعية", False, "الإشادة كانت بالصرامة المنهجية rigor metodológico.")
            ],
            ["rigor metodológico", "enfoque"],
            "رئيس اللجنة قال: 'valora especialmente el rigor metodológico'.",
            audioKey="pending/b2_rigor_metodologico_tesis.mp3",
            speechEs="El tribunal valora especialmente el rigor metodológico demostrado en la tesis doctoral."
        ),
        speak_ex(
            "ex-b2-eea-6",
            "انطق عبارتك التأسيسية لعرض أطروحتك العلمية بنبرة باحث واثق ورصين",
            ["speaking", "pronunciation"], 2,
            "انطق الجملة التالية لافتتاح عرض بحثك الأكاديمي أمام اللجنة:",
            "Partimos de la hipótesis de que existe una estrecha relación entre ambas variables dentro del marco teórico analizado.",
            "ننطلق من الفرضية القائلة بوجود علاقة وثيقة بين كلا المتغيرين ضمن الإطار النظري المحلل.",
            "pending/b2_partimos_hipotesis_relacion_variables.mp3",
            ["hipótesis", "marco teórico", "rigor metodológico"],
            "Partimos de la hipótesis de que existe una estrecha relación entre ambas variables dentro del marco teórico analizado.",
            "انتبه لنطق hipótesis بالتشديد على حرف ó ونطق teórico بسلاسة وفصاحة."
        )
    ]
    return lesson_doc(doc, exs, level="B2")


def make_lesson_citacion_fuentes_academicas():
    slug = "b2-citacion-fuentes-academicas"
    doc = {
        "slug": slug,
        "unitSlug": "b2-u5-academic",
        "levelCode": "B2",
        "titleAr": "أدوات الاستشهاد ونقل آراء الباحثين: التوثيق والأمانة العلمية",
        "titleEs": "Citación de fuentes y discurso referido académico: Rigor y honestidad intelectual",
        "subtitleAr": "نقل النظريات بـ (según afirma), المقارنة بين الآراء، وتفادي الانتحال العلمي (el plagio)",
        "order": 2,
        "estimatedMinutes": 20,
        "cefrLevel": "B2",
        "review": review_block(),
        "pedagogy": {
            "learningObjectivesAr": [
                "أن ينقل المتعلم آراء المفكرين والباحثين بدقة مستخدماً أفعال الإحالة الأكاديمية.",
                "أن يوظف صيغ التوثيق: como señala, en palabras de, citando a, tal como sostiene.",
                "أن يميز بين الاقتباس الحرفي المباشر (cita textual) وإعادة الصياغة التفسيرية (paráfrasis)."
            ],
            "grammarPoints": [
                {
                    "titleAr": "تراكيب الإسناد الأكاديمي وعزو الآراء لأصحابها",
                    "explanationAr": "1. **أفعال الإحالة العلمية المتخصصة**:\n- *Postular / Proponer*: Habermas postula que la acción comunicativa busca el entendimiento.\n- *Cuestionar / Matizar*: Chomsky matiza las teorías empiristas sobre el lenguaje.\n2. **تراكيب الإسناد غير المباشر**:\n- *Tal como sostiene García Márquez en su ensayo sobre la ortografía...*\n- *A tenor de lo expuesto por los investigadores...*\n3. **تفادي الانتحال العلمي بـ Paráfrasis الدقيقة**:\n- إعادة صياغة الفكرة مع الاحتفاظ بالإسناد للمؤلف الأصلي."
                }
            ],
            "commonMistakesAr": [
                "الاقتصار على فعل *dice que* المبتذل في الكتابة الجامعية بدلاً من الأفعال الأكاديمية الدقيقة (*sostiene, argumenta, refuta*).",
                "نقل كلام المؤلف حرفياً دون وضعه بين علامتي تنصيص معقوفتين « » وذكر الصفحة المرجعية."
            ],
            "dialectNotes": [
                {
                    "region": "EG",
                    "noteAr": "في الأبحاث بنقول «زي ما بيقول الدكتور فلان في كتابه، النظرية دي محتاجة مراجعة». بالإسبانية: Tal como sostiene el profesor Rodríguez en su obra, dicha teoría requiere una revisión crítica."
                }
            ],
            "culturalNoteAr": "الجامعات الناطقة بالإسبانية تستخدم علامتي التنصيص اللاتينية المزدوجة « » (comillas latinas o españolas) كأولوية أسلوبية قبل التنصيص الإنجليزي \" \"."
        },
        "contentBlocks": [
            {
                "id": f"cb-{slug}-intro",
                "type": "explanation",
                "titleAr": "معجم الاستشهاد الأكاديمي",
                "bodyAr": "أدوات التوثيق:\n- **tal como sostiene**: تماماً كما يذهب ويؤكد (الباحث فلان)\n- **en palabras de**: بعبارة وكلمات الكاتب\n- **la cita textual**: الاقتباس الحرفي بنصه الكامل بين علامات تنصيص\n- **la paráfrasis**: إعادة صياغة الفكرة بأسلوب الباحث الخاص مع حفظ المرجع\n- **el plagio**: الانتحال والسرقة الأدبية أو العلمية\n- **la bibliografía consultada**: قائمة المراجع والمصادر المستشارة في البحث",
                "examples": [
                    {"es": "Tal como sostiene Umberto Eco, un libro está hecho de otros libros.", "ar": "تماماً كما يؤكد أومبرتو إيكو، فإن الكتاب مصنوع من كتب أخرى."},
                    {"es": "Para evitar el plagio académico, es obligatorio citar la fuente original de cada dato.", "ar": "لتفادي الانتحال الأكاديمي، من الإلزامي توثيق المصدر الأصلي لكل معلومة."},
                    {"es": "La paráfrasis permite integrar las ideas de otros autores de manera fluida en el texto.", "ar": "تتيح إعادة الصياغة دمج أفكار المؤلفين الآخرين بسلاسة في النص."}
                ]
            }
        ],
        "newVocabulary": ["tal como sostiene", "en palabras de", "cita textual", "paráfrasis", "plagio", "bibliografía"],
        "reviewVocabulary": ["fuente", "autor"]
    }

    exs = [
        choice_ex(
            "ex-b2-cfa-1", "word_choice",
            "اختر المصطلح الذي يعني الاقتباس الحرفي المنقول بنصه الكامل",
            ["vocabulary"], 1,
            "ماذا نسمي نقل كلام المؤلف بحروفه الأصلية بين علامات تنصيص؟",
            "Si incluimos una _____ de más de cuarenta palabras, debemos sangrar el párrafo.",
            "إذا أدرجنا ... تزيد عن أربعين كلمة، يجب إزاحة الفقرة بهامش مستقل.",
            [
                opt("a", "cita textual", "اقتباس حرفي مباشر (الصواب)", True),
                opt("b", "paráfrasis", "إعادة صياغة بفهم الباحث", False, "النقل الحرفي بالكلمات الأصلية يسمى cita textual."),
                opt("c", "plagio", "سرقة علمية", False, "الاقتباس النظامي الموثق يسمى cita textual.")
            ],
            ["cita textual", "paráfrasis", "plagio"],
            "la cita textual هي الاقتباس الحرفي الذي ينقل العبارة بنصها الأصلي دون تعديل."
        ),
        fill_ex(
            "ex-b2-cfa-2",
            "صرف فعل sostener بالماضي البسيط مع المفرد الغائب هو: (sostuvo)",
            ["grammar", "writing"], 1,
            "اكتب تصريف الفعل: El filósofo _____ que el lenguaje determina el pensamiento.",
            "En su célebre ensayo de 1970, el autor _____ que la cultura es un sistema dinámico.",
            "في مقاله الشهير عام 1970، ذهب المؤلف وأكد أن الثقافة نظام ديناميكي.",
            ["tal como sostiene"],
            ["sostuvo"],
            "في الماضي البسيط مع الغائب: sostuvo."
        ),
        choice_ex(
            "ex-b2-cfa-3", "word_choice",
            "حدد الجريمة الأكاديمية الناتجة عن نسب أفكار الآخرين للنفس دون توثيق المرجع",
            ["vocabulary"], 2,
            "ما هو المصطلح القانوني والأكاديمي للسرقة الفكرية ونقل أبحاث الغير دون عزو؟",
            "El uso de software especializado permite a las universidades detectar el _____ con facilidad.",
            "يتيح استخدام البرمجيات المتخصصة للجامعات كشف ... بسهولة بالغة.",
            [
                opt("a", "plagio", "الانتحال والسرقة العلمية (الصواب)", True),
                opt("b", "enfoque", "المنهج العلمي", False, "السرقة العلمية تسمى el plagio."),
                opt("c", "marco teórico", "الإطار النظري", False, "الجريمة الأكاديمية تسمى plagio.")
            ],
            ["plagio", "cita textual", "bibliografía"],
            "el plagio هو انتحال أفكار أو نصوص الآخرين ونسبتها للذات دون توثيق نظامي."
        ),
        order_ex(
            "ex-b2-cfa-4",
            "رتّب الجملة الاستشهادية لنقل فكرة الباحث الشهير",
            ["grammar", "writing"], 2,
            ["Tal", "como", "sostiene", "el", "autor", "la", "educación", "es", "fundamental"],
            "Tal como sostiene el autor la educación es fundamental",
            "الترتيب: العبارة الاستشهادية Tal como sostiene ثم الفاعل el autor ثم جملة المضمون la educación es fundamental.",
            ["tal como sostiene", "en palabras de"]
        ),
        choice_ex(
            "ex-b2-cfa-5", "listen_choose",
            "استمع للمحاضرة الجامعية وحدد التقنية التي ينصح بها الأستاذ لتجنب الاقتباس الحرفي الزائد",
            ["listening", "vocabulary"], 2,
            "استمع لنصيحة الأستاذ الجامعي لطلبة الدراسات العليا",
            "Recomiendo recurrir a una buena paráfrasis para enriquecer el texto con voz propia.",
            "أنصح باللجوء إلى إعادة صياغة جيدة لإثراء النص بصوتكم البحثي الخاص.",
            [
                opt("a", "paráfrasis", "إعادة الصياغة التفسيرية الحافظة للمصدر (الصواب)", True),
                opt("b", "plagio", "الانتحال", False, "الأستاذ أوصى بـ paráfrasis."),
                opt("c", "supresión", "حذف المراجع", False, "التقنية المقترحة هي la paráfrasis.")
            ],
            ["paráfrasis", "cita textual"],
            "الأستاذ قال: 'Recomiendo recurrir a una buena paráfrasis'.",
            audioKey="pending/b2_parafrasis_voz_propia_investigador.mp3",
            speechEs="Recomiendo recurrir a una buena paráfrasis para enriquecer el texto con voz propia."
        ),
        speak_ex(
            "ex-b2-cfa-6",
            "انطق عبارتك الاستشهادية التوثيقية بلغة أكاديمية رصينة وأمينة",
            ["speaking", "pronunciation"], 2,
            "انطق الجملة التالية لتوثيق فكرة مرجعية في بحثك الأكاديمي:",
            "Tal como sostiene la bibliografía especializada, es imprescindible contrastar todas las fuentes consultadas.",
            "تماماً كما تؤكد المراجع المتخصصة، من الضروري مقارنة جميع المصادر المستشارة وتدقيقها.",
            "pending/b2_tal_como_sostiene_bibliografia.mp3",
            ["tal como sostiene", "bibliografía", "cita textual"],
            "Tal como sostiene la bibliografía especializada, es imprescindible contrastar todas las fuentes consultadas.",
            "انتبه لنطق bibliografía مع النبرة على حرف í و especializada بنطق إسباني متقن."
        )
    ]
    return lesson_doc(doc, exs, level="B2")


def make_lesson_conectores_causa_efecto_avanzados():
    slug = "b2-conectores-causa-efecto-avanzados"
    doc = {
        "slug": slug,
        "unitSlug": "b2-u5-academic",
        "levelCode": "B2",
        "titleAr": "الروابط السببية والاستنتاجية المتقدمة: بناء النسق البراهيني",
        "titleEs": "Conectores de causa, consecuencia y conclusión: El entramado argumentativo",
        "subtitleAr": "التعليل بـ (puesto que, dado que, a causa de) والاستنتاج بـ (por ende, de ahí que)",
        "order": 3,
        "estimatedMinutes": 20,
        "cefrLevel": "B2",
        "review": review_block(),
        "pedagogy": {
            "learningObjectivesAr": [
                "أن يوظف المتعلم روابط سببية واستنتاجية راقية تتجاوز porque و por eso البسيطة.",
                "أن يطبق قواعد النحو المرافقة لكل رابط (مثل de ahí que + Subjuntivo و dado que + Indicativo).",
                "أن ينسج فقرة برهانية محكمة تربط المقدمات بالنتائج الرياضية والمنطقية."
            ],
            "grammarPoints": [
                {
                    "titleAr": "قواعد الروابط السببية والاستنتاجية الرفيعة",
                    "explanationAr": "1. **الروابط السببية ذات السجل الأكاديمي (Causales cultos)**:\n- *Dado que / Puesto que / Ya que + Indicativo*: Dado que no existen precedentes, el juez actuó con cautela.\n- *A causa de / Debido a + Sustantivo o Infinitivo*: Las pérdidas se produjeron debido a la crisis global.\n2. **الروابط الاستنتاجية والتعليلية التبعية (Consecutivas)**:\n- *Por consiguiente / Por ende + Indicativo*: La demanda creció; por consiguiente, aumentaron los precios.\n- **قاعدة ذهبية هامة**: *De ahí que + Subjuntivo* (من هنا جاء أن...):\n- *El informe contenía errores graves; de ahí que fuera rechazado por el comité*."
                }
            ],
            "commonMistakesAr": [
                "استخدام المضارع الإخباري بعد **de ahí que**؛ هذه الأداة تتطلب دوماً صيغة **المنصوب (Subjuntivo)** حصراً (الخطأ: *de ahí que es necesario*; الصواب: de ahí que sea necesario).",
                "وضع *porque* في أول الجملة المستقلة؛ في الإسبانية الفصحى الأكاديمية لا تبدأ الجملة بـ porque بل بـ *Puesto que* أو *Dado que*."
            ],
            "dialectNotes": [
                {
                    "region": "EG",
                    "noteAr": "في الكلام المقالي بنقول «بما إن المعطيات واضحة، فبالتالي النتيجة حتمية، ومن هنا جه قرار الإلغاء». بالإسبانية: Dado que las pruebas son concluyentes, por ende la decisión es firme; de ahí que se cancelara el acto."
                }
            ],
            "culturalNoteAr": "الأسلوب الأكاديمي الإسباني يولي الروابط البلاغية (conectores discursivos) مكانة مركزية، ويعتبر غيابها أو تكرار نفس الرابط دليلاً على ضعف الصنعة اللغوية."
        },
        "contentBlocks": [
            {
                "id": f"cb-{slug}-intro",
                "type": "explanation",
                "titleAr": "جدول الروابط البرهانية الرفيعة",
                "bodyAr": "الروابط الرئيسية وقواعدها:\n- **dado que / puesto que**: بما أن / نظراً لأن (+ إخباري Indicativo)\n- **de ahí que**: ومن هنا كان أن (+ منصُوب Subjuntivo إلزامياً)\n- **por ende / por consiguiente**: وبناءً على ذلك / وبالتالي\n- **a raíz de**: على إثر وبفعل حدث محوري\n- **en virtud de**: بمقتضى وبموجب سند قانوني أو علمي\n- **en suma**: خلاصة القول ومجمله",
                "examples": [
                    {"es": "Dado que los resultados fueron concluyentes, el laboratorio aprobó la vacuna.", "ar": "بما أن النتائج كانت حاسمة وقاطعة، وافق المختبر على اللقاح."},
                    {"es": "El experimento carecía de grupo de control; de ahí que sus conclusiones sean dudosas.", "ar": "افتقرت التجربة لمجموعة ضابطة؛ ومن هنا كانت استنتاجاتها موضع شك (المنصوب: sean)."},
                    {"es": "En virtud del acuerdo firmado, ambas instituciones compartirán recursos.", "ar": "بمقتضى الاتفاق الموقع، ستتشارك المؤسستان الموارد."}
                ]
            }
        ],
        "newVocabulary": ["dado que", "puesto que", "de ahí que", "por ende", "a raíz de", "en virtud de"],
        "reviewVocabulary": ["porque", "por tanto"]
    }

    exs = [
        choice_ex(
            "ex-b2-cca-1", "word_choice",
            "اختر صيغة الفعل المناسبة بعد الرابط الاستنتاجي de ahí que",
            ["grammar"], 1,
            "أي تصريف لفعل ser نستخدم في: El presupuesto era insuficiente; de ahí que el plan _____ cancelado؟",
            "El presupuesto era insuficiente; de ahí que el plan _____ cancelado.",
            "كانت الميزانية غير كافية؛ ومن هنا أُلغي المشروع.",
            [
                opt("a", "fuera", "صيغة المنصوب في الماضي Imperfecto de Subjuntivo (الصواب)", True),
                opt("b", "fue", "ماضي إخباري Indefinido لا يصح بعد de ahí que", False, "الرابط de ahí que يتطلب صيغة المنصوب Subjuntivo حصراً."),
                opt("c", "era", "ماضي ناقص إخباري", False, "بعد de ahí que يجب استخدام المنصوب: fuera.")
            ],
            ["de ahí que", "puesto que"],
            "de ahí que يتطلب إلزامياً صيغة المنصوب Subjuntivo: de ahí que fuera cancelado."
        ),
        fill_ex(
            "ex-b2-cca-2",
            "صرف فعل tener بالمنصوب بعد de ahí que في الحاضر: (tenga)",
            ["grammar", "writing"], 1,
            "اكتب تصريف الفعل بالمنصوب: La ley es ambigua; de ahí que _____ múltiples interpretaciones.",
            "El texto carece de claridad; de ahí que _____ tantas lecturas contradictorias.",
            "يفتقر النص للوضوح؛ ومن هنا كان له كل هذه القراءات المتناقضة.",
            ["de ahí que"],
            ["tenga"],
            "بعد de ahí que في المضارع نستخدم المنصوب الحاضر: tenga."
        ),
        choice_ex(
            "ex-b2-cca-3", "word_choice",
            "حدد الرابط السببي الأكاديمي المناسب لبدء الجملة كبديل لـ porque",
            ["vocabulary"], 2,
            "أي رابط رسمي نستخدم في مطلع الفقرة لتقديم العلة والسبب؟",
            "_____ no se alcanzaron los objetivos previstos, la dirección reestructuró el equipo.",
            "... لم تتحقق الأهداف المقررة، أعادت الإدارة هيكلة الفريق.",
            [
                opt("a", "Dado que", "بما أن ونظراً لأن (الصواب في مستهل الجملة)", True),
                opt("b", "Porque", "رابط سببي لا تبدأ به الجملة الأكاديمية", False, "الجملة الأكاديمية لا تبدأ بـ porque بل بـ Dado que أو Puesto que."),
                opt("c", "De ahí que", "رابط استنتاجي يأخذ المنصوب", False, "الرابط السببي في البداية هو Dado que.")
            ],
            ["dado que", "puesto que", "por ende"],
            "dado que أو puesto que هما الرابطان القياسيان لافتتاح الجملة السببية في السجل الأكاديمي."
        ),
        order_ex(
            "ex-b2-cca-4",
            "رتّب الجملة الاستنتاجية الرصينة باستخدام الرابط por ende",
            ["grammar", "writing"], 2,
            ["No", "hubo", "inversión", "y", "por", "ende", "la", "producción", "cayó"],
            "No hubo inversión y por ende la producción cayó",
            "الترتيب: الجملة الأولى No hubo inversión ثم أداة العطف y ثم الرابط por ende ثم النتيجة la producción cayó.",
            ["por ende", "dado que"]
        ),
        choice_ex(
            "ex-b2-cca-5", "listen_choose",
            "استمع للبيان القانوني وحدد الأساس الشرعي الذي استند إليه القرار",
            ["listening", "vocabulary"], 2,
            "استمع لمنطوق الحكم القضائي أو الإداري",
            "En virtud de las facultades delegadas, se decreta la clausura preventiva del recinto.",
            "بمقتضى الصلاحيات المفوضة، يُقرر الإغلاق الاحترازي للمنشأة.",
            [
                opt("a", "en virtud de", "بمقتضى وبموجب السند القانوني (الصواب)", True),
                opt("b", "a pesar de", "بالرغم من", False, "المتحدث استند إلى: En virtud de las facultades."),
                opt("c", "en contra de", "ضد", False, "العبارة كانت: En virtud de.")
            ],
            ["en virtud de", "a raíz de"],
            "المتحدث قال بصرامة: 'En virtud de las facultades delegadas'.",
            audioKey="pending/b2_en_virtud_facultades_delegadas.mp3",
            speechEs="En virtud de las facultades delegadas, se decreta la clausura preventiva del recinto."
        ),
        speak_ex(
            "ex-b2-cca-6",
            "انطق عبارتك البرهانية مستخدماً رابط de ahí que مع المنصوب بدقة تامة",
            ["speaking", "pronunciation"], 2,
            "انطق الجملة التالية مطبقاً قاعدة المنصوب السليمة بصوت رخيم:",
            "La muestra no era representativa; de ahí que los resultados carezcan de validez estadística.",
            "لم تكن العينة ممثلة للمجتمع؛ ومن هنا افتقرت النتائج للصلاحية الإحصائية.",
            "pending/b2_muestra_representativa_validez.mp3",
            ["de ahí que", "por ende", "dado que"],
            "La muestra no era representativa; de ahí que los resultados carezcan de validez estadística.",
            "انتبه لنطق carezcan بصيغة المنصوب ونطق representativa بفصاحة وتأنٍ."
        )
    ]
    return lesson_doc(doc, exs, level="B2")


def make_lesson_resumen_conclusiones_investigacion():
    slug = "b2-resumen-conclusiones-investigacion"
    doc = {
        "slug": slug,
        "unitSlug": "b2-u5-academic",
        "levelCode": "B2",
        "titleAr": "ملخص البحث والاستنتاجات: صياغة التوصيات وآفاق المستقبل",
        "titleEs": "El resumen (abstract) y las conclusiones: Síntesis y prospectiva investigadora",
        "subtitleAr": "كتابة الخلاصة المكثفة، استعراض المخرجات، واقتراح دراسات مستقبلية",
        "order": 4,
        "estimatedMinutes": 20,
        "cefrLevel": "B2",
        "review": review_block(),
        "pedagogy": {
            "learningObjectivesAr": [
                "أن يحرر المتعلم ملخصاً أكاديمياً مكثفاً (Abstract) يعكس جوهر البحث في 150-200 كلمة.",
                "أن يصيغ الاستنتاجات النهائية بأسلوب تركيبي يربط المخرجات بالفرضية الأولى.",
                "أن يفتح آفاقاً للبحوث المستقبلية بـ prospectiva و líneas de investigación futuras."
            ],
            "grammarPoints": [
                {
                    "titleAr": "التراكيب التلخيصية والآفاق المستقبلية في خاتمة الأبحاث",
                    "explanationAr": "1. **التأكيد على ثبوت الفرضية أو دحضها**:\n- *Los hallazgos confirman de manera incontestable la hipótesis inicial*.\n- *Los datos desmienten la premisa de la que partíamos*.\n2. **التلخيص التركيبي النهائي**:\n- *A modo de síntesis, cabe concluir que...*\n- *En resumidas cuentas, la investigación pone de manifiesto...*\n3. **فتح خطوط بحثية مستقبلية (Prospectiva)**:\n- *Queda abierta una prometedora línea de investigación en torno a...*\n- *Sería deseable que futuros estudios profundizaran en...*"
                }
            ],
            "commonMistakesAr": [
                "إدراج معلومات أو بيانات جديدة في فصل الاستنتاجات؛ الاستنتاج مخصص للتركيب والتأمل وليس لعرض معطيات جديدة.",
                "صياغة ملخص Research Abstract مفكك يفتقر للكلمات المفتاحية الأساسية (palabras clave)."
            ],
            "dialectNotes": [
                {
                    "region": "EG",
                    "noteAr": "في خاتمة البحث بنقول «خلاصة البحث بتأكد صحة الفرضية، وبنوصي الباحثين بعد كده يركزوا على النقطة الفلانية». بالإسبانية: En conclusión, los hallazgos confirman la hipótesis, y sugerimos abrir nuevas líneas de investigación en este campo."
                }
            ],
            "culturalNoteAr": "معظم الدوريات العلمية الإسبانية (مثل مجلات CSIC) تفرض نشر الملخص باللغتين الإسبانية والإنجليزية، مع إدراج ما بين 4 إلى 6 كلمات مفتاحية (palabras clave / keywords)."
        },
        "contentBlocks": [
            {
                "id": f"cb-{slug}-intro",
                "type": "explanation",
                "titleAr": "أدوات التلخيص والاستنتاج العلمي",
                "bodyAr": "المفردات الختامية:\n- **el resumen analítico (abstract)**: الملخص العلمي المكثف للبحث\n- **las palabras clave**: الكلمات المفتاحية الدالة على المحتوى والمجال\n- **los hallazgos**: المكتشفات والنتائج التجريبية والميدانية المحققة\n- **poner de manifiesto**: يوضح ويجلي ويبرز للعيان\n- **a modo de síntesis**: على سبيل التلخيص والتركيب العام\n- **la prospectiva**: النظرة المستقبلية واستشراف آفاق التطور",
                "examples": [
                    {"es": "El resumen debe incluir el objetivo, la metodología y los principales hallazgos.", "ar": "يجب أن يتضمن الملخص الهدف والمنهجية وأبرز النتائج والمكتشفات."},
                    {"es": "Los hallazgos ponen de manifiesto la necesidad de actualizar los protocolos.", "ar": "توضح النتائج بجلاء ضرورة تحديث البروتوكولات المعمول بها."},
                    {"es": "A modo de síntesis, cabe concluir que la hipótesis ha quedado plenamente corroborada.", "ar": "على سبيل التركيب والتلخيص، تجدر الإشارة إلى أن الفرضية تأكدت تماماً."}
                ]
            }
        ],
        "newVocabulary": ["hallazgo", "palabras clave", "poner de manifiesto", "a modo de síntesis", "prospectiva", "corroborar"],
        "reviewVocabulary": ["conclusión", "resumen"]
    }

    exs = [
        choice_ex(
            "ex-b2-rci-1", "word_choice",
            "اختر المصطلح الذي يعني النتائج والمكتشفات غير المسبوقة التي توصل لها البحث",
            ["vocabulary"], 1,
            "ما هي الكلمة الإسبانية التي تدل على 'النتائج والمكتشفات المستخلصة من التحقيق'؟",
            "Los _____ de este estudio abren nuevas vías para el tratamiento de la patología.",
            "... هذه الدراسة تفتح مسارات جديدة لعلاج هذه الحالة المرضية.",
            [
                opt("a", "hallazgos", "النتائج والمكتشفات الميدانية (الصواب)", True),
                opt("b", "malentendidos", "سوء التفاهم", False, "النتائج العلمية تسمى los hallazgos."),
                opt("c", "congojas", "أحزان وغصات", False, "المصطلح العلمي هو los hallazgos.")
            ],
            ["hallazgo", "corroborar"],
            "los hallazgos هي المكتشفات والنتائج الإيجابية التي يسفر عنها التحقيق العلمي."
        ),
        fill_ex(
            "ex-b2-rci-2",
            "أكمل بالفعل المركب الذي يعني 'يجلي ويبرز بوضوح': pone de _____",
            ["vocabulary", "writing"], 1,
            "اكتب الكلمة الناقصة في التعبير الأكاديمي: pone de _____ (يجلي ويبرز للعيان):",
            "La investigación pone de _____ la urgente necesidad de invertir en energías limpias.",
            "يُبرز البحث بجلاء الحاجة الملحة للاستثمار في الطاقات النظيفة.",
            ["poner de manifiesto"],
            ["manifiesto"],
            "poner de manifiesto تعني إبراز الشيء وإظهاره بوضوح وجلاء."
        ),
        choice_ex(
            "ex-b2-rci-3", "word_choice",
            "حدد الفعل الأكاديمي الذي يعني تأكيد صحة الفرضية وثبوتها بالأدلة",
            ["vocabulary"], 2,
            "أي فعل راقٍ يعني 'تثبيت الفرضية ودعمها بالأدلة القاطعة'؟",
            "Los experimentos empíricos permitieron _____ definitivamente la teoría del investigador.",
            "أتاحت التجارب الميدانية ... نظرية الباحث بشكل نهائي وقاطع.",
            [
                opt("a", "corroborar", "يثبت ويؤكد صحة الفرضية بالأدلة (الصواب)", True),
                opt("b", "evocar", "يستحضر ذكرى شاعرية", False, "تثبيت الفرضية علمياً يسمى corroborar."),
                opt("c", "limar", "يبرد ويسوي", False, "المصطلح العلمي هو corroborar la hipótesis.")
            ],
            ["corroborar", "hallazgo", "palabras clave"],
            "corroborar una hipótesis يعني إثبات صحتها والتأكد من مطابقتها للواقع التجريبي."
        ),
        order_ex(
            "ex-b2-rci-4",
            "رتّب الجملة الاستنتاجية التلخيصية لخاتمة البحث",
            ["grammar", "writing"], 2,
            ["A", "modo", "de", "síntesis", "los", "resultados", "son", "muy", "positivos"],
            "A modo de síntesis los resultados son muy positivos",
            "الترتيب: العبارة التلخيصية A modo de síntesis ثم المبتدأ los resultados ثم الفعل son ثم الخبر muy positivos.",
            ["a modo de síntesis", "prospectiva"]
        ),
        choice_ex(
            "ex-b2-rci-5", "listen_choose",
            "استمع للمتحدث وحدد ما تحتاجه الفهارس وقواعد البيانات لتصنيف البحث",
            ["listening", "vocabulary"], 2,
            "استمع لتعليمات مجلة النشر العلمي للمؤلفين",
            "Es obligatorio incluir cinco palabras clave que definan con precisión el campo temático.",
            "من الإلزامي إدراج خمس كلمات مفتاحية تحدد بدقة المجال الموضوعي.",
            [
                opt("a", "palabras clave", "كلمات مفتاحية دالة (الصواب)", True),
                opt("b", "metáforas", "استعارات شعرية", False, "المطلوب في الفهرسة palabras clave."),
                opt("c", "anécdotas", "نوادر", False, "المصطلح المكتبي هو palabras clave.")
            ],
            ["palabras clave", "a modo de síntesis"],
            "المتحدث قال: 'cinco palabras clave que definan con precisión'.",
            audioKey="pending/b2_cinco_palabras_clave_campo.mp3",
            speechEs="Es obligatorio incluir cinco palabras clave que definan con precisión el campo temático."
        ),
        speak_ex(
            "ex-b2-rci-6",
            "انطق خلاصة بحثك العلمي بثقة متناهية وأسلوب استنتاجي رفيع",
            ["speaking", "pronunciation"], 2,
            "انطق الجملة الختامية التالية لتقديم التوصية والآفاق المستقبلية لبحثك:",
            "A modo de síntesis, los hallazgos corroboran la hipótesis y abren una prometedora prospectiva investigadora.",
            "على سبيل التركيب والتلخيص، تثبت النتائج صحة الفرضية وتفتح آفاقاً مستقبلية واعدة للبحث.",
            "pending/b2_sintesis_hallazgos_corroboran.mp3",
            ["a modo de síntesis", "corroborar", "hallazgo", "prospectiva"],
            "A modo de síntesis, los hallazgos corroboran la hipótesis y abren una prometedora prospectiva investigadora.",
            "انتبه لنطق síntesis و corroboran و prospectiva بمخارج صوتية رصينة ومتقنة."
        )
    ]
    return lesson_doc(doc, exs, level="B2")


# ==============================================================================
# UNIT 6: b2-u6-negotiation (التفاوض والإقناع والاتفاقيات التجارية)
# ==============================================================================

def make_lesson_estrategias_negociacion_comercial():
    slug = "b2-estrategias-negociacion-comercial"
    doc = {
        "slug": slug,
        "unitSlug": "b2-u6-negotiation",
        "levelCode": "B2",
        "titleAr": "استراتيجيات التفاوض التجاري: تقديم العروض وبدائل الاتفاق",
        "titleEs": "Estrategias de negociación comercial: Oferta inicial y alternativas de acuerdo",
        "subtitleAr": "تحديد الهامش التفاوضي (el margen)، أسلوب رابح-رابح (ganar-ganar)، والمناورة",
        "order": 1,
        "estimatedMinutes": 20,
        "cefrLevel": "B2",
        "review": review_block(),
        "pedagogy": {
            "learningObjectivesAr": [
                "أن يفتتح المتعلم جولة مفاوضات تجارية ويحدد سقوف التفاوض والبدائل الممكنة.",
                "أن يوظف مصطلحات التفاوض الاحترافي: margen de maniobra, enfoque ganar-ganar, contraoferta, postura de partida.",
                "أن يطرح شروطه الأولية بمرونة وحزم دون كشف أوراقه التفاوضية دفعة واحدة."
            ],
            "grammarPoints": [
                {
                    "titleAr": "التراكيب الشرطية والافتراضية في إدارة المفاوضات",
                    "explanationAr": "1. **طرح العروض المشروطة بصيغة الاحترام (Condicional)**:\n- *Estaríamos dispuestos a mejorar el precio siempre y cuando aumenten el volumen de compra*.\n- *Nos plantearíamos una rebaja del 5% en caso de que el pago sea al contado*.\n2. **تحديد سقف التنازل (Margen de maniobra)**:\n- *Nuestro margen de maniobra es limitado en este apartado*.\n- *No podemos descender por debajo de este umbral de rentabilidad*."
                }
            ],
            "commonMistakesAr": [
                "استخدام لهجة هجومية أو التلويح بالانسحاب المبكر؛ التفاوض اللاتيني يقوم على بناء علاقة ودية مسبقة قبل الشروع في الأرقام الصعبة.",
                "نسيان استخدام صيغ التلطيف والشرط (estaríamos dispuestos بدلاً من estamos dispuestos) لإبقاء مساحة للمناورة."
            ],
            "dialectNotes": [
                {
                    "region": "EG",
                    "noteAr": "في التجارة بنقول «إحنا عايزين صفقة تكسب الطرفين، وعندنا مرونة لو زودتم الكمية». بالإسبانية: Buscamos un acuerdo en el que todos salgamos ganando y tenemos cierto margen de maniobra si amplían el pedido."
                }
            ],
            "culturalNoteAr": "في الثقافة الإسبانية والأمريكية اللاتينية، يُعتبر الغداء التمهيدي (comida de negocios) جزءاً لا يتجزأ من مسار التفاوض لبناء الثقة الشخصية (la confianza)."
        },
        "contentBlocks": [
            {
                "id": f"cb-{slug}-intro",
                "type": "explanation",
                "titleAr": "مبادئ واستراتيجيات التفاوض الفعّال",
                "bodyAr": "المفاهيم التفاوضية:\n- **el margen de maniobra**: هامش المناورة والتحرك التفاوضي المتاح\n- **el enfoque ganar-ganar (win-win)**: نهج المنفعة المتبادلة والربح المشترك للطرفين\n- **la contraoferta**: العرض المقابل البديل رداً على العرض الأول\n- **la postura de partida**: الموقف التفاوضي الابتدائي الذي تنطلق منه المحادثات\n- **el punto de fricción**: نقطة الخلاف والتوتر في بنود التفاوض\n- **estar dispuesto a**: مستعد لـ ومتقبل لتقديم تنازل معين",
                "examples": [
                    {"es": "Nuestra empresa siempre prioriza un enfoque ganar-ganar en todas las negociaciones.", "ar": "تمنح شركتنا دوماً الأولوية لنهج المنفعة المتبادلة في كافة المفاوضات."},
                    {"es": "Tras analizar su propuesta inicial, nos complace presentarles una contraoferta ventajosa.", "ar": "بعد دراسة مقترحكم المبدئي، يسرنا أن نقدم لكم عرضاً مقابلاً مجزياً."},
                    {"es": "Tenemos poco margen de maniobra respecto a los plazos de entrega pactados.", "ar": "لدينا هامش مناورة ضيق للغاية فيما يخص مواعيد التسليم المتفق عليها."}
                ]
            }
        ],
        "newVocabulary": ["margen de maniobra", "ganar-ganar", "contraoferta", "postura de partida", "punto de fricción", "estar dispuesto a"],
        "reviewVocabulary": ["precio", "negocio"]
    }

    exs = [
        choice_ex(
            "ex-b2-enc-1", "word_choice",
            "اختر المفهوم التفاوضي الذي يعني مصلحة ورضا الطرفين معاً",
            ["vocabulary"], 1,
            "ماذا نسمي نهج التفاوض الذي يهدف لعدم خروج أي طرف خاسراً من الطاولة؟",
            "Buscamos un acuerdo duradero basado en la filosofía de _____ para ambas compañías.",
            "نبحث عن اتفاق دائم يستند إلى فلسفة ... لكلا الشركتين.",
            [
                opt("a", "ganar-ganar", "الربح المشترك والمصلحة المتبادلة للطرفين (الصواب)", True),
                opt("b", "todo o nada", "الكل أو لا شيء الصارم", False, "النهج التشاركي يسمى ganar-ganar."),
                opt("c", "juicio de valor", "حكم تقييمي", False, "النهج هو ganar-ganar.")
            ],
            ["ganar-ganar", "margen de maniobra"],
            "el enfoque ganar-ganar هو استراتيجية التفاوض التي تحقق مكاسب متكافئة للجانبين."
        ),
        fill_ex(
            "ex-b2-enc-2",
            "أكمل بالمصطلح الذي يعني المساحة المتاحة للمرونة والتنازل: el margen de _____",
            ["vocabulary", "writing"], 1,
            "اكتب الكلمة الناقصة في التعبير: margen de _____ (هامش المناورة والتحرك):",
            "En cuanto a las tarifas aplicables, tenemos cierto margen de _____ si aumentan el volumen.",
            "فيما يتعلق بالأسعار المطبقة، لدينا قدر من هامش ... إذا رفعتم حجم المشتريات.",
            ["margen de maniobra"],
            ["maniobra"],
            "el margen de maniobra هو مدى المرونة المتاح للتفاوض دون الإخلال بالمصالح."
        ),
        choice_ex(
            "ex-b2-enc-3", "word_choice",
            "حدد المصطلح الذي يعبر عن العرض البديل الذي يقدمه الطرف الآخر رداً على العرض الأول",
            ["vocabulary"], 2,
            "ماذا نسمي المقترح المضاد الذي يقدمه المشتري لتعديل شروط البائع؟",
            "El cliente rechazó el primer presupuesto y nos envió una _____ mucho más ajustada.",
            "رفض العميل الميزانية الأولى وأرسل إلينا ... أكثر انخفاضاً ودقة.",
            [
                opt("a", "contraoferta", "عرض مقابل بديل (الصواب)", True),
                opt("b", "plagio", "انتحال", False, "العرض المضاد يسمى la contraoferta."),
                opt("c", "acta", "محضر اجتماع", False, "العرض البديل هو una contraoferta.")
            ],
            ["contraoferta", "postura de partida", "punto de fricción"],
            "la contraoferta هي الرد المقترح الذي يتضمن تعديلات سعرية أو شروطاً بديلة."
        ),
        order_ex(
            "ex-b2-enc-4",
            "رتّب الجملة التفاوضية لإبداء الاستعداد لتقديم تنازل مرن",
            ["grammar", "writing"], 2,
            ["Estaríamos", "dispuestos", "a", "flexibilizar", "los", "plazos", "de", "pago"],
            "Estaríamos dispuestos a flexibilizar los plazos de pago",
            "الترتيب: صيغة الشرط Estaríamos ثم النعت dispuestos ثم حرف الجر a ثم المصدر flexibilizar ثم المفعول los plazos de pago.",
            ["estar dispuesto a", "margen de maniobra"]
        ),
        choice_ex(
            "ex-b2-enc-5", "listen_choose",
            "استمع للمفاوض وحدد النقطة المعقدة التي يعتبرها حجر عثرة في الحوار",
            ["listening", "vocabulary"], 2,
            "استمع لمداخلة المفاوض التجاري في الاجتماع المغلق",
            "El plazo de garantía postventa sigue siendo el principal punto de fricción entre las partes.",
            "ما زالت مدة ضمان ما بعد البيع تمثل نقطة الخلاف والتوتر الرئيسية بين الطرفين.",
            [
                opt("a", "punto de fricción", "نقطة الخلاف والتوتر التفاوضي (الصواب)", True),
                opt("b", "consenso", "توافق تام", False, "المتحدث وصفها بأنها punto de fricción."),
                opt("c", "hallazgo", "اكتشاف علمي", False, "المصطلح كان punto de fricción.")
            ],
            ["punto de fricción", "postura de partida"],
            "المتحدث قال: 'el principal punto de fricción entre las partes'.",
            audioKey="pending/b2_punto_friccion_garantia_postventa.mp3",
            speechEs="El plazo de garantía postventa sigue siendo el principal punto de fricción entre las partes."
        ),
        speak_ex(
            "ex-b2-enc-6",
            "انطق عبارتك التفاوضية بمرونة وثقة عالية لإقناع الطرف المقابل بالاتفاق",
            ["speaking", "pronunciation"], 2,
            "انطق الجملة التالية لتقديم مقترح توافقي رابح-رابح على طاولة المفاوضات:",
            "Si aceptan nuestra contraoferta, estaríamos dispuestos a asumir los costes de transporte con un enfoque ganar-ganar.",
            "إذا قبلتم عرضنا المقابل، سنكون على استعداد لتحمل تكاليف الشحن وفق نهج المنفعة المتبادلة للطرفين.",
            "pending/b2_contraoferta_costes_transporte_ganar.mp3",
            ["contraoferta", "estar dispuesto a", "ganar-ganar", "margen de maniobra"],
            "Si aceptan nuestra contraoferta, estaríamos dispuestos a asumir los costes de transporte con un enfoque ganar-ganar.",
            "انتبه لنطق contraoferta و estaríamos dispuestos بنبرة مقنعة ومرنة."
        )
    ]
    return lesson_doc(doc, exs, level="B2")


def make_lesson_concesiones_condiciones_mutuas():
    slug = "b2-concesiones-condiciones-mutuas"
    doc = {
        "slug": slug,
        "unitSlug": "b2-u6-negotiation",
        "levelCode": "B2",
        "titleAr": "التنازلات والشروط المتبادلة: مقايضة المصالح في التفاوض",
        "titleEs": "Concesiones y condiciones mutuas: El intercambio estratégico de ventajas",
        "subtitleAr": "الصيغ الشرطية (siempre que, a condición de que) والمقايضة التكتيكية",
        "order": 2,
        "estimatedMinutes": 20,
        "cefrLevel": "B2",
        "review": review_block(),
        "pedagogy": {
            "learningObjectivesAr": [
                "أن يقايض المتعلم التنازلات بذكاء: لا تنازل دون مقابل ملموس في المقابل.",
                "أن يتقن أدوات الشرط المتطلبة للمنصوب: siempre y cuando, a condición de que, a cambio de que.",
                "أن يوظف مصطلحات مقايضة الشروط: hacer una concesión, ceder en, contrapartida, recíproco."
            ],
            "grammarPoints": [
                {
                    "titleAr": "قواعد أدوات الشرط الحصري مع المنصوب في المفاوضات",
                    "explanationAr": "1. **أدوات الشرط المقيد (Condicionales con Subjuntivo)**:\n- *Siempre y cuando + Subjuntivo*: Aceptamos el precio siempre y cuando mantengan la calidad.\n- *A condición de que + Subjuntivo*: Firmaremos el contrato a condición de que nos garanticen exclusividad.\n- *A cambio de que + Subjuntivo*: Reducimos los costes a cambio de que ustedes asuman el seguro.\n2. **التعبير عن التنازل المشروط**:\n- *Estamos dispuestos a ceder en este punto a cambio de una contrapartida equivalente*."
                }
            ],
            "commonMistakesAr": [
                "استخدام المضارع الإخباري بعد *siempre y cuando* أو *a condición de que* (الخطأ: *a condición de que nos dan exclusividad*; الصواب: a condición de que nos den exclusividad بالمنصوب).",
                "تقديم تنازلات مجانية دون طلب مقابل تعويضي متبادل (contrapartida)."
            ],
            "dialectNotes": [
                {
                    "region": "EG",
                    "noteAr": "في التجارة بنقول «إحنا موافقين نتنازل في النقطة دي بشرط إنكم تضمنوا لنا الدفع في ميعاده ومقابل ملموس». بالإسبانية: Estamos dispuestos a ceder en el precio a condición de que garanticen el pago puntual."
                }
            ],
            "culturalNoteAr": "القاعدة الذهبية في التفاوض التجاري الإسباني هي 'Nada es gratis': أي تنازل يقدمه أحد الطرفين يجب أن يقابله مكسب معادل في بند آخر للحفاظ على التوازن التعاقدي."
        },
        "contentBlocks": [
            {
                "id": f"cb-{slug}-intro",
                "type": "explanation",
                "titleAr": "أدوات التنازل والمقايضة المشروطة",
                "bodyAr": "المفردات والتراكيب:\n- **la concesión**: التنازل الممنوح للطرف المقابل\n- **la contrapartida**: المقابل والمكسب التعويضي الموازي\n- **ceder en**: يتنازل ويظهر مرونة في جزئية محددة\n- **siempre y cuando**: طالما وشريطة أن (+ منصُوب Subjuntivo)\n- **a condición de que**: شريطة أن وعلى أساس أن (+ منصُوب Subjuntivo)\n- **recíproco**: متبادل ومتكافئ بين الطرفين",
                "examples": [
                    {"es": "Haremos una concesión en la tarifa siempre y cuando el contrato sea por dos años.", "ar": "سنقدم تنازلاً في السعر شريطة أن يكون العقد لمدة عامين (المنصوب: sea)."},
                    {"es": "Aceptamos sus plazos a condición de que nos ofrezcan una contrapartida clara.", "ar": "نقبل بمواعيدكم شريطة أن تقدموا لنا مقابلاً واضحاً (المنصوب: ofrezcan)."},
                    {"es": "El acuerdo debe basarse en un compromiso recíproco y equilibrado.", "ar": "يجب أن يستند الاتفاق إلى التزام متبادل ومتوازن."}
                ]
            }
        ],
        "newVocabulary": ["concesión", "contrapartida", "ceder en", "siempre y cuando", "a condición de que", "recíproco"],
        "reviewVocabulary": ["condición", "acuerdo"]
    }

    exs = [
        choice_ex(
            "ex-b2-ccm-1", "word_choice",
            "اختر صيغة المنصوب المطلوبة بعد الرابط الشرطي a condición de que",
            ["grammar"], 1,
            "أي تصريف لفعل garantizar نستخدم بعد a condición de que؟",
            "Cederemos en este punto a condición de que ustedes _____ el suministro continuo.",
            "سنتنازل في هذه النقطة شريطة أن تضمنوا أنتم الإمداد المستمر.",
            [
                opt("a", "garanticen", "صيغة المنصوب مع ustedes (الصواب)", True),
                opt("b", "garantizan", "مضارع إخباري لا يصح بعد a condición de que", False, "الرابط a condición de que يتطلب صيغة المنصوب Subjuntivo."),
                opt("c", "garantizar", "مصدر لا يناسب وجود que", False, "مع وجود que والفاعل ustedes يجب تصريف الفعل بالمنصوب.")
            ],
            ["a condición de que", "ceder en", "concesión"],
            "بعد a condición de que يأتي الفعل إلزامياً بالمنصوب: a condición de que garanticen."
        ),
        fill_ex(
            "ex-b2-ccm-2",
            "صرف فعل firmar بالمنصوب الجمع بعد siempre y cuando: (firmen)",
            ["grammar", "writing"], 1,
            "اكتب تصريف الفعل بالمنصوب: Asumiremos el flete siempre y cuando ustedes _____ hoy el pedido.",
            "Les aplicaremos el descuento máximo siempre y cuando ustedes _____ el contrato esta semana.",
            "سنطبق عليكم الخصم الأقصى شريطة أن توقعوا العقد هذا الأسبوع.",
            ["siempre y cuando"],
            ["firmen"],
            "بعد siempre y cuando نستخدم المنصوب: firmen."
        ),
        choice_ex(
            "ex-b2-ccm-3", "word_choice",
            "حدد المصطلح الذي يعبر عن الميزة والتعويض المقابل المطلوب إزاء أي تنازل",
            ["vocabulary"], 2,
            "ما هي الكلمة التي تعني 'المقابل التعويضي المكافئ لتنازل قدمته'؟",
            "No podemos hacer rebajas sin exigir una _____ comercial adecuada.",
            "لا يمكننا تقديم تخفيضات دون المطالبة بـ ... تجاري مناسب ومكافئ.",
            [
                opt("a", "contrapartida", "المقابل التعويضي المتبادل (الصواب)", True),
                opt("b", "sesgo", "تحيز صحفي", False, "المقابل التفاوضي يسمى la contrapartida."),
                opt("c", "congoja", "غصة حزن", False, "المصطلح التجاري هو contrapartida.")
            ],
            ["contrapartida", "concesión", "recíproco"],
            "la contrapartida هي الفائدة أو التعويض الذي يطلبه المفاوض مقابل تنازله في بند آخر."
        ),
        order_ex(
            "ex-b2-ccm-4",
            "رتّب الجملة التفاوضية المشروطة لربط السعر بالدفع الفوري",
            ["grammar", "writing"], 2,
            ["Aceptamos", "el", "precio", "siempre", "y", "cuando", "paguen", "al", "contado"],
            "Aceptamos el precio siempre y cuando paguen al contado",
            "الترتيب: الفعل Aceptamos ثم المفعول el precio ثم أداة الشرط siempre y cuando ثم المنصوب paguen ثم شبه الجملة al contado.",
            ["siempre y cuando", "recíproco"]
        ),
        choice_ex(
            "ex-b2-ccm-5", "listen_choose",
            "استمع لمدير المبيعات وحدد التنازل الذي يعرضه على الشريك",
            ["listening", "vocabulary"], 2,
            "استمع للشروط المتبادلة في جولة المداولات",
            "Estamos dispuestos a ceder en los márgenes si obtenemos un compromiso recíproco.",
            "نحن على استعداد لتقديم تنازل في هوامش الأرباح إذا حصلنا على التزام متبادل.",
            [
                opt("a", "ceder en los márgenes", "التنازل في هوامش الأرباح (الصواب)", True),
                opt("b", "romper el acuerdo", "فسخ الاتفاق", False, "المتحدث قال: ceder en los márgenes."),
                opt("c", "aumentar los precios", "رفع الأسعار", False, "العرض كان التنازل ceder en los márgenes.")
            ],
            ["ceder en", "recíproco", "concesión"],
            "المتحدث قال بوضوح: 'Estamos dispuestos a ceder en los márgenes'.",
            audioKey="pending/b2_ceder_margenes_compromiso_reciproco.mp3",
            speechEs="Estamos dispuestos a ceder en los márgenes si obtenemos un compromiso recíproco."
        ),
        speak_ex(
            "ex-b2-ccm-6",
            "انطق جملتك التفاوضية لطلب مقابل تعويضي واضح بأسلوب لبق وحازم",
            ["speaking", "pronunciation"], 2,
            "انطق العبارة التالية لتوضيح شروطك المتبادلة أمام المفاوض الآخر:",
            "Haremos esta concesión a condición de que nos ofrezcan una contrapartida clara y un compromiso recíproco.",
            "سنقدم هذا التنازل شريطة أن تقدموا لنا مقابلاً واضحاً والتزاماً متبادلاً.",
            "pending/b2_concesion_condicion_contrapartida.mp3",
            ["concesión", "a condición de que", "contrapartida", "recíproco"],
            "Haremos esta concesión a condición de que nos ofrezcan una contrapartida clara y un compromiso recíproco.",
            "انتبه لنطق concesión و contrapartida و recíproco بنبرة تفاوضية متزنة ورصينة."
        )
    ]
    return lesson_doc(doc, exs, level="B2")


def make_lesson_persuasion_manejo_objeciones():
    slug = "b2-persuasion-manejo-objeciones"
    doc = {
        "slug": slug,
        "unitSlug": "b2-u6-negotiation",
        "levelCode": "B2",
        "titleAr": "أساليب الإقناع والتعامل مع الاعتراضات: اللباقة وإعادة التأطير",
        "titleEs": "Técnicas de persuasión y gestión de objeciones: Reframing y empatía estratégica",
        "subtitleAr": "امتصاص اعتراضات العميل (desarmar objeciones)، المقارنة الإيجابية، وحسم البيع",
        "order": 3,
        "estimatedMinutes": 20,
        "cefrLevel": "B2",
        "review": review_block(),
        "pedagogy": {
            "learningObjectivesAr": [
                "أن يمتص المتعلم اعتراضات العميل حول السعر أو الوقت ويعيد تأطيرها إيجابياً.",
                "أن يوظف استراتيجيات الإقناع: validar la inquietud, reframing (reencuadre), coste de oportunidad.",
                "أن يرد بدبلوماسية وثقة دون الدخول في جدل عقيم أو تكذيب الطرف الآخر."
            ],
            "grammarPoints": [
                {
                    "titleAr": "التراكيب الأسلوبية لإعادة التأطير وامتصاص الاعتراضات",
                    "explanationAr": "1. **إبداء التفهم أولاً لامتصاص المقاومة (Empatía táctica)**:\n- *Entiendo perfectamente su preocupación por el coste inicial...*\n- *Es una inquietud muy razonable y compartida por muchos clientes...*\n2. **إعادة التأطير ونقل التركيز من 'التكلفة' إلى 'الاستثمار والقيمة'**:\n- *Más que un gasto, le invito a verlo como una inversión altamente rentable*.\n- *Si analizamos el coste por año de amortización, el ahorro es evidente*.\n3. **طرح المقارنة المقنعة**:\n- *¿Qué coste tendría para su empresa no modernizar este sistema a tiempo?*"
                }
            ],
            "commonMistakesAr": [
                "الرد الدفاعي بـ *No tiene razón* أو *Eso no es verdad*؛ هذا ينهي المفاوضة فوراً؛ الأسلوب المهني يعتمد التحويل: *Entiendo su punto, sin embargo...*.",
                "التسرع بتقديم تخفيض سعري بمجرد أول اعتراض دون الدفاع عن القيمة المضافة وجودة المنتج."
            ],
            "dialectNotes": [
                {
                    "region": "EG",
                    "noteAr": "في المبيعات الشاطر لما الزبون يقوله «غاليا أوي»، بيقوله «أنا مقدر وجهة نظرك، بس ده استثمار هيوفرلك كتير على المدى البعيد». بالإسبانية: Comprendo su punto; no obstante, más que un gasto es una inversión que le ahorrará miles de euros a largo plazo."
                }
            ],
            "culturalNoteAr": "المفاوض الإسباني يقدر الإقناع القائم على الحقائق وجودة العلاقات الإنسانية ولا يستجيب جيداً لأساليب الضغط المفرط (aggressive selling)."
        },
        "contentBlocks": [
            {
                "id": f"cb-{slug}-intro",
                "type": "explanation",
                "titleAr": "ترسانة الإقناع وإدارة الاعتراضات",
                "bodyAr": "المفاهيم والأساليب:\n- **la objeción**: اعتراض العميل وتحفظه على بند أو سعر\n- **reencuadrar (reframing)**: إعادة تأطير الفكرة وتوجيه النظر لقيمتها الإيجابية\n- **la propuesta de valor**: القيمة المضافة الحقيقية التي يقدمها المنتج\n- **el coste de oportunidad**: تكلفة الفرصة البديلة الناتجة عن عدم اتخاذ القرار\n- **disipar dudas**: تبديد الشكوك وإزالة المخاوف لدى المشتري\n- **el argumento irrebatible**: الحجة القاطعة التي لا يمكن دحضها",
                "examples": [
                    {"es": "El comercial logró disipar todas las dudas técnicas del cliente con paciencia.", "ar": "نجح مندوب المبيعات في تبديد كافة الشكوك الفنية لدى العميل بصبر."},
                    {"es": "Al reencuadrar el precio como una inversión duradera, el cliente aceptó la propuesta.", "ar": "بإعادة تأطير السعر كاستثمار دائم، قبل العميل العرض."},
                    {"es": "Nuestra propuesta de valor se basa en la fiabilidad y el servicio postventa 24/7.", "ar": "تستند قيمتنا المضافة إلى الموثوقية وخدمة ما بعد البيع على مدار الساعة."}
                ]
            }
        ],
        "newVocabulary": ["objeción", "reencuadrar", "propuesta de valor", "coste de oportunidad", "disipar dudas", "irrebatible"],
        "reviewVocabulary": ["cliente", "precio"]
    }

    exs = [
        choice_ex(
            "ex-b2-pmo-1", "word_choice",
            "اختر الأسلوب المهني الذي يعني إعادة تقديم الفكرة من زاوية إيجابية جذابة",
            ["vocabulary"], 1,
            "ماذا نسمي تقنية تغيير المنظور ونقل التركيز من التكلفة إلى القيمة؟",
            "El negociador supo _____ la queja del cliente convirtiéndola en una ventaja competitiva.",
            "عرف المفاوض كيف ... شكوى العميل محولاً إياها إلى ميزة تنافسية.",
            [
                opt("a", "reencuadrar", "إعادة تأطير الفكرة بزاوية إيجابية (الصواب)", True),
                opt("b", "desmentir", "تكذيب العميل", False, "التقنية الإقناعية تسمى reencuadrar."),
                opt("c", "anular", "إلغاء", False, "الأسلوب هو إعادة التأطير reencuadrar.")
            ],
            ["reencuadrar", "objeción"],
            "reencuadrar (reframing) هي مهارة إعادة صياغة الاعتراض وتقديمه كفرصة وقيمة مضافة."
        ),
        fill_ex(
            "ex-b2-pmo-2",
            "أكمل بالمصطلح الذي يعني إزالة المخاوف والتوجسات: _____ dudas",
            ["vocabulary", "writing"], 1,
            "اكتب الفعل المصدر الذي يعني 'تبديد الشكوك وإزالتها': _____ dudas:",
            "Para cerrar la venta es imprescindible escuchar activamente y _____ todas las dudas del cliente.",
            "لإتمام الصفقة من الضروري الاستماع الفعال وتبديد كافة شكوك العميل.",
            ["disipar dudas"],
            ["disipar"],
            "disipar dudas تعني تبديد الشكوك وإزالة المخاوف بطرح البراهين."
        ),
        choice_ex(
            "ex-b2-pmo-3", "word_choice",
            "حدد المفهوم التسويقي الذي يمثل التميز والميزة التنافسية الحقيقية للخدمة",
            ["vocabulary"], 2,
            "ما هي العبارة التي تعني 'مجموع المزايا الحصرية والحلول التي يقدمها المنتج للمشتري'؟",
            "Nuestra _____ se diferencia de la competencia por ofrecer asistencia personalizada.",
            "تتميز ... لشركتنا عن المنافسين بتقديم دعم فني مخصص.",
            [
                opt("a", "propuesta de valor", "القيمة المضافة المعروضة (الصواب)", True),
                opt("b", "cita textual", "اقتباس حرفي", False, "المفهوم التجاري هو la propuesta de valor."),
                opt("c", "falacia", "مغالطة", False, "الميزة التنافسية تسمى propuesta de valor.")
            ],
            ["propuesta de valor", "coste de oportunidad", "irrebatible"],
            "la propuesta de valor هي القيمة المضافة الحقيقية والميزة الفريدة التي تحل مشكلات العميل."
        ),
        order_ex(
            "ex-b2-pmo-4",
            "رتّب الجملة الإقناعية لامتصاص اعتراض العميل على التكلفة",
            ["grammar", "writing"], 2,
            ["Entiendo", "su", "inquietud", "pero", "esta", "solución", "ahorra", "costes"],
            "Entiendo su inquietud pero esta solución ahorra costes",
            "الترتيب: عبارة التفهم Entiendo su inquietud ثم الاستدراك pero ثم المبتدأ esta solución ثم الفعل ahorra ثم المفعول costes.",
            ["objeción", "reencuadrar"]
        ),
        choice_ex(
            "ex-b2-pmo-5", "listen_choose",
            "استمع لخبير المبيعات وحدد نوع الحجة التي ينصح باستخدامها لإقناع المترددين",
            ["listening", "vocabulary"], 2,
            "استمع لمحاضرة تدريب فريق المبيعات",
            "Frente a esa objeción, debemos presentar un argumento técnico irrebatible.",
            "في مواجهة هذا الاعتراض، يجب أن نقدم حجة فنية قاطعة لا يمكن دحضها.",
            [
                opt("a", "argumento irrebatible", "حجة قاطعة دامغة لا تقبل الدحض (الصواب)", True),
                opt("b", "excusa vaga", "عذر مبهم", False, "الخبير أوصى بـ argumento irrebatible."),
                opt("c", "rebaja desesperada", "تخفيض عشوائي", False, "الحل كان الحجة القاطعة argumento irrebatible.")
            ],
            ["irrebatible", "objeción"],
            "الخبير قال: 'debemos presentar un argumento técnico irrebatible'.",
            audioKey="pending/b2_argumento_tecnico_irrebatible.mp3",
            speechEs="Frente a esa objeción, debemos presentar un argumento técnico irrebatible."
        ),
        speak_ex(
            "ex-b2-pmo-6",
            "انطق عبارتك الإقناعية لإعادة تأطير السعر كاستثمار رابح بثقة تامة",
            ["speaking", "pronunciation"], 2,
            "انطق الجملة التالية لتبديد قلق العميل بأسلوب استشاري راقٍ:",
            "Comprendo su inquietud por el precio; sin embargo, al disipar las dudas verá que nuestra propuesta de valor es irrebatible.",
            "أتفهم قلقكم بشأن السعر؛ ومع ذلك، عند تبديد الشكوك سترون أن قيمتنا المضافة قاطعة ومثبتة.",
            "pending/b2_comprendo_inquietud_propuesta_valor.mp3",
            ["propuesta de valor", "disipar dudas", "irrebatible", "objeción"],
            "Comprendo su inquietud por el precio; sin embargo, al disipar las dudas verá que nuestra propuesta de valor es irrebatible.",
            "انتبه لنطق propuesta de valor و irrebatible بنبرة إقناعية دافئة ومطمئنة."
        )
    ]
    return lesson_doc(doc, exs, level="B2")


def make_lesson_acuerdo_clausulas_contractuales():
    slug = "b2-acuerdo-clausulas-contractuales"
    doc = {
        "slug": slug,
        "unitSlug": "b2-u6-negotiation",
        "levelCode": "B2",
        "titleAr": "صياغة الاتفاقيات والبنود التعاقدية: اللغة القانونية والتثبيت النهائي",
        "titleEs": "El acuerdo final y las cláusulas contractuales: Lenguaje jurídico y formalización",
        "subtitleAr": "بنود السرية، غرامات التأخير (penalizaciones)، شروط الفسخ، وفض النزاعات",
        "order": 4,
        "estimatedMinutes": 20,
        "cefrLevel": "B2",
        "review": review_block(),
        "pedagogy": {
            "learningObjectivesAr": [
                "أن يقرأ المتعلم عقداً تجارياً إسبانياً ويفهم بنوده والتزاماته القانونية بدقة.",
                "أن يوظف مصطلحات العقود: cláusula, entrar en vigor, rescisión, confidencialidad, indemnización por daños.",
                "أن يصيغ شروط فض النزاعات وتحديد المحاكم المختصة (jurisdicción aplicable)."
            ],
            "grammarPoints": [
                {
                    "titleAr": "التراكيب القانونية الإلزامية في صياغة العقود",
                    "explanationAr": "1. **صياغة الالتزام المتبادل في ديباجة العقد**:\n- *Las partes acuerdan y convienen las siguientes cláusulas...*\n- *Ambas partes se comprometen a respetar escrupulosamente los términos pactados*.\n2. **التعبير عن السريان والمدة**:\n- *El presente contrato entrará en vigor a partir de la fecha de su firma*.\n- *Tendrá una vigencia de dos años prorrogables tácitamente*.\n3. **بنود الفسخ والتعويض**:\n- *El incumplimiento de cualquiera de las cláusulas facultará a la otra parte para rescindir el contrato*."
                }
            ],
            "commonMistakesAr": [
                "استخدام *cancelar el contrato* في الوثائق الرسمية بدلاً من المصطلح القانوني الدقيق **rescindir el contrato**.",
                "عدم الانتباه لصيغ التمديد التلقائي (prórroga tácita) التي قد تجدد التزامات العقد تلقائياً ما لم يتم الإخطار المسبق."
            ],
            "dialectNotes": [
                {
                    "region": "EG",
                    "noteAr": "في العقود بنقول «العقد ده هيدخل حيز التنفيذ من تاريخ توقيعه، وأي خرق للبنود يدي الحق في فسخ العقد مع التعويض». بالإسبانية: Este contrato entrará en vigor a la firma, y su incumplimiento facultará para rescindirlo con indemnización."
                }
            ],
            "culturalNoteAr": "العقود في إسبانيا تخضع للقانون المدني والتجاري المكتوب (Derecho continental) وتتطلب دقة قصوى في تحديد البنود والمحاكم المختصة (tribunales competentes)."
        },
        "contentBlocks": [
            {
                "id": f"cb-{slug}-intro",
                "type": "explanation",
                "titleAr": "البنود التعاقدية الأساسية",
                "bodyAr": "المفردات القانونية والتعاقدية:\n- **la cláusula**: البند والفقرة التعاقدية في الاتفاقية\n- **entrar en vigor**: يدخل حيز النفاذ والتنفيذ القانوني\n- **la rescisión**: الفسخ والإلغاء القانوني للعقد\n- **el incumplimiento**: الإخلال بالالتزام وعدم الوفاء بالبند\n- **el acuerdo de confidencialidad (NDA)**: اتفاقية السرية وحماية البيانات\n- **la jurisdicción competente**: الاختصاص القضائي والمحكمة المعتمدة للفصل في النزاع",
                "examples": [
                    {"es": "El presente contrato entrará en vigor al día siguiente de su firma por ambas partes.", "ar": "يدخل هذا العقد حيز النفاذ في اليوم التالي لتوقيعه من قِبل الطرفين."},
                    {"es": "Cualquier incumplimiento de las obligaciones dará derecho a la rescisión inmediata.", "ar": "أي إخلال بالالتزامات سيعطي الحق في الفسخ الفوري للعقد."},
                    {"es": "Ambas partes firmaron una cláusula estricta de confidencialidad para proteger la tecnología.", "ar": "وقع الطرفان بند سرية صارم لحماية التكنولوجيا المتبادلة."}
                ]
            }
        ],
        "newVocabulary": ["cláusula", "entrar en vigor", "rescisión", "incumplimiento", "confidencialidad", "jurisdicción"],
        "reviewVocabulary": ["contrato", "firma"]
    }

    exs = [
        choice_ex(
            "ex-b2-acc-1", "word_choice",
            "اختر المصطلح القانوني الدقيق الذي يعني فسخ العقد وإنهاء سريانه",
            ["vocabulary"], 1,
            "ما هي الكلمة القانونية المعتمدة لـ 'فسخ العقد وإلغائه بسبب إخلال أحد الأطراف'؟",
            "El impago continuado durante tres meses facultará al arrendador para la _____ del contrato.",
            "سيعطي استمرار عدم السداد مدة ثلاثة أشهر المؤجر الحق في ... العقد.",
            [
                opt("a", "rescisión", "الفسخ القانوني للتعاقد (الصواب)", True),
                opt("b", "hipótesis", "فرضية بحثية", False, "الفسخ القانوني يسمى la rescisión."),
                opt("c", "congoja", "غصة حزن", False, "المصطلح العقدي هو la rescisión.")
            ],
            ["rescisión", "incumplimiento", "cláusula"],
            "la rescisión de un contrato هي الإلغاء والفسخ القانوني للرابطة التعاقدية."
        ),
        fill_ex(
            "ex-b2-acc-2",
            "أكمل التعبير القانوني لسريان الاتفاقية ونفاذها: entrar en _____",
            ["vocabulary", "writing"], 1,
            "اكتب الكلمة الناقصة في التعبير: entrar en _____ (يدخل حيز النفاذ):",
            "Las nuevas condiciones pactadas van a entrar en _____ a partir del uno de enero.",
            "ستدخل الشروط الجديدة المتفق عليها حيز النفاذ والتطبيق ابتداءً من الأول من يناير.",
            ["entrar en vigor"],
            ["vigor"],
            "entrar en vigor تعني السريان القانوني ودخول الاتفاق حيز التطبيق الفعلي."
        ),
        choice_ex(
            "ex-b2-acc-3", "word_choice",
            "حدد البند التعاقدي الذي يحظر على الأطراف إفشاء أسرار العمل للغير",
            ["vocabulary"], 2,
            "ما هو البند الإلزامي الذي يحمي سرية البيانات والمعلومات المتبادلة؟",
            "Firmaron una estricta cláusula de _____ que prohíbe revelar información técnica a terceros.",
            "وقعوا بند ... صارم يحظر إفشاء المعلومات الفنية لأطراف ثالثة.",
            [
                opt("a", "confidencialidad", "السرية وكتمان الأسرار المهنية (الصواب)", True),
                opt("b", "símil", "تشبيه بلاغي", False, "بند كتمان الأسرار يسمى cláusula de confidencialidad."),
                opt("c", "falacia", "مغالطة", False, "البند هو السرية confidencialidad.")
            ],
            ["confidencialidad", "cláusula", "jurisdicción"],
            "la confidencialidad هي الالتزام القانوني بحفظ أسرار العمل وعدم إفشائها."
        ),
        order_ex(
            "ex-b2-acc-4",
            "رتّب الجملة القانونية لتحديد موعد سريان العقد",
            ["grammar", "writing"], 2,
            ["El", "presente", "acuerdo", "entrará", "en", "vigor", "tras", "la", "firma"],
            "El presente acuerdo entrará en vigor tras la firma",
            "الترتيب: المبتدأ El presente acuerdo ثم الفعل entrará en vigor ثم الظرف tras la firma.",
            ["entrar en vigor", "cláusula"]
        ),
        choice_ex(
            "ex-b2-acc-5", "listen_choose",
            "استمع للمستشار القانوني وحدد العواقب المترتبة على الإخلال بالبنود",
            ["listening", "vocabulary"], 2,
            "استمع لشرح المحامي لبنود العقد",
            "El incumplimiento de este compromiso acarreará severas indemnizaciones por daños.",
            "سيترتب على الإخلال بهذا الالتزام تعويضات مالية صارمة عن الأضرار.",
            [
                opt("a", "incumplimiento", "الإخلال بالالتزام وعدم الوفاء بالبند (الصواب)", True),
                opt("b", "éxito rotundo", "نجاح باهر", False, "المحامي حذر من el incumplimiento."),
                opt("c", "consenso", "توافق", False, "التحذير كان من الإخلال incumplimiento.")
            ],
            ["incumplimiento", "rescisión"],
            "المستشار القانوني قال: 'El incumplimiento de este compromiso acarreará severas indemnizaciones'.",
            audioKey="pending/b2_incumplimiento_compromiso_indemnizaciones.mp3",
            speechEs="El incumplimiento de este compromiso acarreará severas indemnizaciones por daños."
        ),
        speak_ex(
            "ex-b2-acc-6",
            "انطق جملتك الختامية لتثبيت توقيع العقد وسريان بنوده باعتزاز واحترافية",
            ["speaking", "pronunciation"], 2,
            "انطق العبارة التالية في ختام جلسة توقيع الاتفاقية التجارية الرسمية:",
            "Ambas partes aceptamos cada cláusula, formalizamos la confidencialidad y el contrato entra en vigor hoy.",
            "كلا الطرفين نقبل كل بند، ونعتمد السرية ويدخل العقد حيز النفاذ اليوم.",
            "pending/b2_aceptamos_clausula_confidencialidad_vigor.mp3",
            ["cláusula", "confidencialidad", "entrar en vigor", "rescisión"],
            "Ambas partes aceptamos cada cláusula, formalizamos la confidencialidad y el contrato entra en vigor hoy.",
            "انتبه لنطق cláusula و confidencialidad بوضوح قانوني رصين."
        )
    ]
    return lesson_doc(doc, exs, level="B2")


# ==============================================================================
# UNIT 7: b2-u7-environment (البيئة والمجتمع والتحولات الديموغرافية)
# ==============================================================================

def make_lesson_cambio_climatico_sostenibilidad():
    slug = "b2-cambio-climatico-sostenibilidad"
    doc = {
        "slug": slug,
        "unitSlug": "b2-u7-environment",
        "levelCode": "B2",
        "titleAr": "التغير المناخي والاستدامة: التحديات البيئية الكبرى",
        "titleEs": "El cambio climático y la sostenibilidad: Desafíos ecológicos globales",
        "subtitleAr": "البصمة الكربونية (la huella de carbono)، الطاقة النظيفة، والاقتصاد الدائري",
        "order": 1,
        "estimatedMinutes": 20,
        "cefrLevel": "B2",
        "review": review_block(),
        "pedagogy": {
            "learningObjectivesAr": [
                "أن يناقش المتعلم قضايا الاحتباس الحراري والتدهور البيئي بلغة علمية دقيقة.",
                "أن يوظف مصطلحات الاستدامة: huella de carbono, efecto invernadero, biodiversidad, economía circular, transición ecológica.",
                "أن يقترح حلولاً عملية لتقليص الانبعاثات وإعادة تدوير الموارد."
            ],
            "grammarPoints": [
                {
                    "titleAr": "التراكيب التقييمية والتحذيرية في الخطاب البيئي",
                    "explanationAr": "1. **التعبير عن التهديد والتأثير البيئي**:\n- *El aumento de las temperaturas amenaza la biodiversidad de los ecosistemas*.\n- *Las emisiones de gases de efecto invernadero han alcanzado máximos históricos*.\n2. **التعبير عن الضرورة الحتمية للتحول**:\n- *Es imperativo que transitemos hacia un modelo de economía circular*.\n- *Se hace urgente reducir la huella de carbono en el transporte pesado*.\n3. **التراكيب الدالة على السبب والنتيجة البيئية**:\n- *La deforestación masiva trae consigo la desertificación del suelo*."
                }
            ],
            "commonMistakesAr": [
                "استخدام *el medio ambiente* ككلمتين منفصلتين أو الخلط بين *ecológico* و *económico*.",
                "استخدام الإخباري بعد التراكيب التقييمية الحتمية (الخطأ: *es imperativo que reducimos*; الصواب: es imperativo que reduzcamos بالمنصوب)."
            ],
            "dialectNotes": [
                {
                    "region": "EG",
                    "noteAr": "في قضايا البيئة بنقول «لازم نقلل الانبعاثات والبصمة الكربونية عشان نحمي الطبيعة ونسيب كوكب نظيف لعيالنا». بالإسبانية: Es vital reducir la huella de carbono y apostar por la transición ecológica para proteger el planeta."
                }
            ],
            "culturalNoteAr": "إسبانيا تحتل موقعاً رائداً عالمياً في إنتاج الطاقة الشمسية وطاقة الرياح، وتعتبر 'التحول البيئي' Transición Ecológica وزارة سيادية مستقلة في الحكومة."
        },
        "contentBlocks": [
            {
                "id": f"cb-{slug}-intro",
                "type": "explanation",
                "titleAr": "المفاهيم المحورية في قضايا البيئة",
                "bodyAr": "المصطلحات البيئية المتقدمة:\n- **la huella de carbono**: البصمة الكربونية وحجم الانبعاثات الفردية أو الصناعية\n- **el efecto invernadero**: الاحتباس الحراري وغازات الدفيئة\n- **la biodiversidad**: التنوع البيولوجي والتوازن الحيوي للكائنات\n- **la economía circular**: الاقتصاد الدائري القائم على إعادة الاستخدام والتدوير\n- **la transición ecológica**: التحول البيئي نحو الطاقة النظيفة والنماذج الخضراء\n- **es imperativo que**: من المحتوم والواجب قطعيًا أن (+ منصُوب Subjuntivo)",
                "examples": [
                    {"es": "Reducir la huella de carbono es el reto medioambiental más urgente del siglo.", "ar": "تقليص البصمة الكربونية هو التحدي البيئي الأكثر إلحاحاً في هذا القرن."},
                    {"es": "La economía circular busca eliminar los residuos mediante el reciclaje continuo.", "ar": "يسعى الاقتصاد الدائري إلى القضاء على النفايات من خلال التدوير المستمر."},
                    {"es": "Es imperativo que los gobiernos protejan la biodiversidad amenazada.", "ar": "من المحتوم والواجب أن تحمي الحكومات التنوع البيولوجي المهدد."}
                ]
            }
        ],
        "newVocabulary": ["huella de carbono", "efecto invernadero", "biodiversidad", "economía circular", "transición ecológica", "es imperativo que"],
        "reviewVocabulary": ["planeta", "naturaleza"]
    }

    exs = [
        choice_ex(
            "ex-b2-ccs-1", "word_choice",
            "اختر المصطلح البيئي الذي يقيس كمية غازات الاحتباس الحراري الناتجة عن نشاط الإنسان",
            ["vocabulary"], 1,
            "ما هي العبارة التي تعني 'الأثر البيئي المباشر من انبعاثات الكربون'؟",
            "Muchas empresas calculan su _____ para implementar medidas de compensación verde.",
            "تحسب العديد من الشركات ... الخاصة بها لتطبيق إجراءات التعويض الأخضر.",
            [
                opt("a", "huella de carbono", "البصمة الكربونية (الصواب)", True),
                opt("b", "propuesta de valor", "القيمة المضافة التجارية", False, "المقياس البيئي هو la huella de carbono."),
                opt("c", "acta", "محضر جلسة", False, "المصطلح البيئي هو huella de carbono.")
            ],
            ["huella de carbono", "efecto invernadero"],
            "la huella de carbono هي مقياس كمية انبعاثات ثاني أكسيد الكربون الناجمة عن نشاط بشري أو صناعي."
        ),
        fill_ex(
            "ex-b2-ccs-2",
            "صرف فعل adoptar بالمنصوب الجمع بعد es imperativo que: (adopten)",
            ["grammar", "writing"], 1,
            "اكتب تصريف الفعل بالمنصوب: Es imperativo que las industrias _____ tecnologías limpias.",
            "Es imperativo que los países desarrollados _____ modelos energéticos 100% renovables.",
            "من المحتوم أن تتبنى الدول المتقدمة نماذج طاقية متجددة بالكامل.",
            ["es imperativo que"],
            ["adopten"],
            "بعد es imperativo que نستخدم صيغة المنصوب Subjuntivo: adopten."
        ),
        choice_ex(
            "ex-b2-ccs-3", "word_choice",
            "حدد المفهوم الاقتصادي القائم على إعادة تدوير الموارد وتقليل الهدر بدلاً من النمط الاستهلاكي الخطي",
            ["vocabulary"], 2,
            "ماذا نسمي الاقتصاد المستدام الذي يحول النفايات إلى مواد خام متجددة؟",
            "La apuesta por la _____ permite alargar la vida útil de los productos y ahorrar materias primas.",
            "يتيح الرهان على ... إطالة العمر الافتراضي للمنتجات وتوفير المواد الخام.",
            [
                opt("a", "economía circular", "الاقتصاد الدائري المستدام (الصواب)", True),
                opt("b", "inflación", "تضخم نقدي", False, "النموذج البيئي هو la economía circular."),
                opt("c", "déficit", "عجز مالي", False, "النمط الاقتصادي البيئي هو economía circular.")
            ],
            ["economía circular", "transición ecológica", "biodiversidad"],
            "la economía circular هي النموذج المستدام الذي يقلل الهدر ويعيد استخدام الموارد في دورة مستمرة."
        ),
        order_ex(
            "ex-b2-ccs-4",
            "رتّب الجملة البيئية للتأكيد على حماية التنوع البيولوجي",
            ["grammar", "writing"], 2,
            ["Debemos", "proteger", "la", "biodiversidad", "marina", "del", "cambio", "climático"],
            "Debemos proteger la biodiversidad marina del cambio climático",
            "الترتيب: الفعل Debemos ثم المصدر proteger ثم المفعول la biodiversidad marina ثم شبه الجملة del cambio climático.",
            ["biodiversidad", "efecto invernadero"]
        ),
        choice_ex(
            "ex-b2-ccs-5", "listen_choose",
            "استمع للمتحدث في قمة المناخ وحدد الهدف الشامل الذي يسعى العالم لتحقيقه",
            ["listening", "vocabulary"], 2,
            "استمع لبيان مؤتمر الأمم المتحدة للمناخ",
            "Acelerar la transición ecológica es el único camino viable para frenar el calentamiento global.",
            "تسريع التحول البيئي هو السبيل الوحيد القابل للتطبيق لكبح جماح الاحتباس الحراري.",
            [
                opt("a", "transición ecológica", "التحول البيئي نحو الطاقة النظيفة (الصواب)", True),
                opt("b", "guerra comercial", "حرب تجارية", False, "المتحدث شدد على la transición ecológica."),
                opt("c", "consumismo", "نزعة استهلاكية", False, "المطلب كان التحول البيئي transición ecológica.")
            ],
            ["transición ecológica", "huella de carbono"],
            "المتحدث قال: 'Acelerar la transición ecológica es el único camino'.",
            audioKey="pending/b2_transicion_ecologica_calentamiento.mp3",
            speechEs="Acelerar la transición ecológica es el único camino viable para frenar el calentamiento global."
        ),
        speak_ex(
            "ex-b2-ccs-6",
            "انطق دعوتك لحماية الكوكب بلغة رصينة ومشاعر بيئية صادقة",
            ["speaking", "pronunciation"], 2,
            "انطق الجملة التالية كخبير بيئي يخاطب مؤتمراً دولياً:",
            "Es imperativo que aceleremos la transición ecológica, protejamos la biodiversidad y reduzcamos la huella de carbono.",
            "من المحتوم والواجب أن نسرع التحول البيئي، ونحمي التنوع البيولوجي ونقلص البصمة الكربونية.",
            "pending/b2_acelerar_transicion_biodiversidad_carbono.mp3",
            ["es imperativo que", "transición ecológica", "biodiversidad", "huella de carbono"],
            "Es imperativo que aceleremos la transición ecológica, protejamos la biodiversidad y reduzcamos la huella de carbono.",
            "انتبه لنطق صيغ المنصوب الثلاث المتتالية: aceleremos و protejamos و reduzcamos بحماس ورصانة."
        )
    ]
    return lesson_doc(doc, exs, level="B2")


def make_lesson_politicas_ambientales_subjuntivo():
    slug = "b2-politicas-ambientales-subjuntivo"
    doc = {
        "slug": slug,
        "unitSlug": "b2-u7-environment",
        "levelCode": "B2",
        "titleAr": "السياسات البيئية والتوصيات: صياغة اللوائح واستخدام المنصوب",
        "titleEs": "Políticas ambientales y marco regulatorio: Prescripciones con el subjuntivo",
        "subtitleAr": "اللوائح الملزمة، حظر الملوثات، واشتراط المعايير البيئية للمصانع",
        "order": 2,
        "estimatedMinutes": 20,
        "cefrLevel": "B2",
        "review": review_block(),
        "pedagogy": {
            "learningObjectivesAr": [
                "أن يصيغ المتعلم توصيات ولوائح تشريعية لحماية البيئة بأسلوب قانوني رصين.",
                "أن يوظف صيغ الأمر غير المباشر والمنصوب: instar a que, exigir que, prohibir que, ser preceptivo que.",
                "أن يطبق المعايير البيئية للمؤسسات: norma ambiental, vertido, emisión cero, sanción disuasoria."
            ],
            "grammarPoints": [
                {
                    "titleAr": "أفعال الإلزام والتوجيه التنظيمي مع المنصوب",
                    "explanationAr": "1. **أفعال الإلزام والمطالبة الرسمية (Exigir / Instar a que + Subjuntivo)**:\n- *La Unión Europea insta a que los Estados miembros reduzcan el uso de plásticos*.\n- *La normativa exige que las fábricas depuren sus aguas residuales antes del vertido*.\n2. **التعبير عن الحظر الصارم (Prohibir que + Subjuntivo)**:\n- *Se prohíbe taxativamente que se arrojen residuos tóxicos a los ríos*.\n3. **التراكيب الإلزامية غير الشخصية (Ser preceptivo / obligatorio que + Subjuntivo)**:\n- *Es preceptivo que los nuevos edificios cuenten con paneles solares*."
                }
            ],
            "commonMistakesAr": [
                "استخدام المضارع الإخباري بعد أفعال الحظر والمطالبة (الخطأ: *se prohíbe que tiran*; الصواب: se prohíbe que tiren بالمنصوب).",
                "استخدام كلمات عامة بدلاً من المصطلحات الفنية المعتمدة (مثل استخدام *basura líquida* بدلاً من المصطلح القانوني الصحيح **el vertido** للمخلفات السائلة)."
            ],
            "dialectNotes": [
                {
                    "region": "EG",
                    "noteAr": "في القوانين بنقول «القانون بيلزم المصانع تراجع انبعاثاتها وبيمنع إلقاء مخلفات الصرف في النيل مع عقوبات رادعة». بالإسبانية: La ley exige que las fábricas controlen sus emisiones y prohíbe que viertan residuos tóxicos."
                }
            ],
            "culturalNoteAr": "الاتحاد الأوروبي وإسبانيا يطبقان مبدأ 'Quien contamina, paga' (من يلوث يدفع)، حيث تفرض غرامات رادعة على الشركات المخالفة للضوابط البيئية."
        },
        "contentBlocks": [
            {
                "id": f"cb-{slug}-intro",
                "type": "explanation",
                "titleAr": "التشريعات والسياسات البيئية الإلزامية",
                "bodyAr": "المفردات القانونية والبيئية:\n- **instar a que**: يحث ويهيب رسمياً بـ (+ منصُوب Subjuntivo)\n- **prohibir taxativamente que**: يحظر بشكل قاطع وحاسم أن (+ منصُوب Subjuntivo)\n- **el vertido**: المخلفات السائلة والمصبات الصناعية الملوثة للمياه\n- **la normativa medioambiental**: اللائحة التنظيمية البيئية المعتمدة\n- **la sanción disuasoria**: العقوبة والغرامة الرادعة لمنع تكرار المخالفة\n- **las emisiones netas cero**: الانبعاثات الصفرية الصافية وتحييد الكربون",
                "examples": [
                    {"es": "El ministerio insta a que los ayuntamientos implanten zonas de bajas emisiones.", "ar": "تهيب الوزارة بالبلديات أن تقيم مناطق منخفضة الانبعاثات (المنصوب: implanten)."},
                    {"es": "Se prohíbe taxativamente que las fábricas realicen vertidos no tratados en el mar.", "ar": "يُحظر بشكل قاطع أن تقوم المصانع بمصبات غير معالجة في البحر (المنصوب: realicen)."},
                    {"es": "Es preceptivo aplicar sanciones disuasorias a quienes vulneren la normativa.", "ar": "من الإلزامي تطبيق عقوبات رادعة على من يخترق اللائحة التنظيمية."}
                ]
            }
        ],
        "newVocabulary": ["instar a que", "prohibir taxativamente que", "vertido", "normativa", "sanción disuasoria", "emisiones netas cero"],
        "reviewVocabulary": ["ley", "medio ambiente"]
    }

    exs = [
        choice_ex(
            "ex-b2-pas-1", "word_choice",
            "اختر صيغة المنصوب المناسبة بعد الفعل الرسمي instar a que",
            ["grammar"], 1,
            "أي تصريف لفعل reducir نستخدم بعد instar a que؟",
            "La cumbre insta a que los países desarrollados _____ sus emisiones contaminantes.",
            "تهيب القمة بالدول المتقدمة أن تخفض انبعاثاتها الملوثة.",
            [
                opt("a", "reduzcan", "صيغة المنصوب مع الدول جمع (الصواب)", True),
                opt("b", "reducen", "مضارع إخباري لا يصح بعد أفعال الحث والمطالبة", False, "التركيب instar a que يتطلب المنصوب Subjuntivo."),
                opt("c", "reducir", "مصدر لا يناسب وجود que والفاعل", False, "مع وجود que والفاعل يجب تصريف الفعل بالمنصوب.")
            ],
            ["instar a que", "emisiones netas cero"],
            "بعد instar a que يأتي الفعل مصرفاً بالمنصوب: instar a que reduzcan."
        ),
        fill_ex(
            "ex-b2-pas-2",
            "صرف فعل arrojar بالمنصوب بعد الحظر الصارم: (arrojen)",
            ["grammar", "writing"], 1,
            "اكتب تصريف الفعل بالمنصوب: Se prohíbe taxativamente que _____ plásticos al océano.",
            "La ley prohíbe que las industrias _____ sustancias tóxicas a la red fluvial.",
            "يحظر القانون على المنشآت الصناعية إلقاء مواد سامة في الشبكة النهرية.",
            ["prohibir taxativamente que"],
            ["arrojen"],
            "بعد prohibir que نستخدم المنصوب دائماً: arrojen."
        ),
        choice_ex(
            "ex-b2-pas-3", "word_choice",
            "حدد المصطلح البيئي الذي يطلق على المياه والمخلفات السائلة الملوثة التي تصرفها المصانع",
            ["vocabulary"], 2,
            "ما هي الكلمة التي تعني 'المصبات ومخلفات الصرف الصناعي السائل في الأنهار أو البحار'؟",
            "El tribunal sancionó a la petroquímica por realizar un _____ ilegal de residuos químicos.",
            "عاقبت المحكمة شركة البتروكيماويات لقيامها بـ ... غير قانوني للمخلفات الكيميائية.",
            [
                opt("a", "vertido", "مصبات المخلفات السائلة الصناعية (الصواب)", True),
                opt("b", "plagio", "انتحال", False, "المخلفات السائلة الملوثة تسمى el vertido."),
                opt("c", "sesgo", "تحيز", False, "المصطلح البيئي هو vertido.")
            ],
            ["vertido", "normativa", "sanción disuasoria"],
            "el vertido هو صرف وإلقاء المخلفات السائلة والنفايات في المجاري المائية."
        ),
        order_ex(
            "ex-b2-pas-4",
            "رتّب الجملة القانونية لتطبيق عقوبات رادعة على الملوثين",
            ["grammar", "writing"], 2,
            ["Es", "necesario", "imponer", "una", "sanción", "disuasoria", "al", "infractor"],
            "Es necesario imponer una sanción disuasoria al infractor",
            "الترتيب: العبارة Es necesario ثم المصدر imponer ثم المفعول una sanción disuasoria ثم شبه الجملة al infractor.",
            ["sanción disuasoria", "normativa"]
        ),
        choice_ex(
            "ex-b2-pas-5", "listen_choose",
            "استمع للبيان الوزاري وحدد الهدف المناخي المنشود لعام 2050",
            ["listening", "vocabulary"], 2,
            "استمع لإعلان وزيرة التحول البيئي",
            "Nuestro objetivo irrenunciable es alcanzar las emisiones netas cero para el año 2050.",
            "هدفنا الذي لا رجعة فيه هو الوصول إلى صافي انبعاثات صفري بحلول عام 2050.",
            [
                opt("a", "emisiones netas cero", "صافي انبعاثات صفري محايد للكربون (الصواب)", True),
                opt("b", "aumento de vertidos", "زيادة مصبات التلوث", False, "الوزيرة قالت: emisiones netas cero."),
                opt("c", "gasto público", "إنفاق عام فقط", False, "الهدف كان الانبعاثات الصفرية emisiones netas cero.")
            ],
            ["emisiones netas cero", "instar a que"],
            "الوزيرة قالت: 'alcanzar las emisiones netas cero para el año 2050'.",
            audioKey="pending/b2_emisiones_netas_cero_2050.mp3",
            speechEs="Nuestro objetivo irrenunciable es alcanzar las emisiones netas cero para el año 2050."
        ),
        speak_ex(
            "ex-b2-pas-6",
            "انطق التوجيه البيئي الرسمي بلغة حازمة ومخارج حروف واضحة ومقنعة",
            ["speaking", "pronunciation"], 2,
            "انطق الجملة التالية لفرض الامتثال للضوابط البيئية المعمول بها:",
            "La normativa medioambiental exige que las empresas reduzcan sus vertidos y alcancen emisiones netas cero.",
            "تلزم اللائحة البيئية الشركات بأن تخفض مصباتها وتصل إلى صافي انبعاثات صفري.",
            "pending/b2_normativa_reduzcan_vertidos_cero.mp3",
            ["normativa", "vertido", "emisiones netas cero", "instar a que"],
            "La normativa medioambiental exige que las empresas reduzcan sus vertidos y alcancen emisiones netas cero.",
            "انتبه لنطق normativa medioambiental و vertidos بأسلوب تشريعي صارم."
        )
    ]
    return lesson_doc(doc, exs, level="B2")


def make_lesson_transformacion_social_demografia():
    slug = "b2-transformacion-social-demografia"
    doc = {
        "slug": slug,
        "unitSlug": "b2-u7-environment",
        "levelCode": "B2",
        "titleAr": "التحولات المجتمعية والديموغرافية: الشيخوخة والهجرة والريف المهجور",
        "titleEs": "Transformaciones demográficas y cohesión social: Envejecimiento y la España vaciada",
        "subtitleAr": "تفريغ القرى (la despoblación)، الهرم السكاني، التكافل، ومستقبل المعاشات",
        "order": 3,
        "estimatedMinutes": 20,
        "cefrLevel": "B2",
        "review": review_block(),
        "pedagogy": {
            "learningObjectivesAr": [
                "أن يحلل المتعلم الظواهر الديموغرافية الكبرى في المجتمع الإسباني والأوروبي المعاصر.",
                "أن يوظف مصطلحات علم السكان: envejecimiento poblacional, tasa de natalidad, éxodo rural, España vaciada, relevo generacional.",
                "أن يربط بين الهجرة والاستقرار الاقتصادي واستدامة أنظمة التقاعد."
            ],
            "grammarPoints": [
                {
                    "titleAr": "التراكيب الإحصائية والتحليلية في علم الاجتماع السكاني",
                    "explanationAr": "1. **التعبير عن التحول الديموغرافي التراكمي**:\n- *La baja tasa de natalidad unida a la longevidad provoca el envejecimiento demográfico*.\n- *Se asiste a una progresiva inversión de la pirámide poblacional*.\n2. **التعبير عن ظاهرة الهجرة والنزوح الريفي**:\n- *El éxodo rural hacia las grandes urbes ha dado lugar a la llamada España vaciada*.\n3. **التحديات المستقبلية لصناديق التقاعد**:\n- *La falta de relevo generacional pone en riesgo la sostenibilidad del sistema de pensiones*."
                }
            ],
            "commonMistakesAr": [
                "استخدام *España vacía* بدلاً من المصطلح الأكثر دقة في الخطاب الاجتماعي الإسباني الراهن **la España vaciada** (للتأكيد على أن التفريغ كان نتيجة سياسات تنموية خاطئة).",
                "ترجمة 'الإحلال والتعاقب الجيلي' بـ *cambio de generaciones*؛ المصطلح السوسيولوجي المعتمد هو **el relevo generacional**."
            ],
            "dialectNotes": [
                {
                    "region": "EG",
                    "noteAr": "في قضايا السكان بنقول «أوروبا وإسبانيا فيها شيخوخة سكانية وقلة مواليد والقرى بتفضى من الشباب». بالإسبانية: España sufre un envejecimiento poblacional agudo y una despoblación rural que vacía los pueblos."
                }
            ],
            "culturalNoteAr": "قضية 'La España vaciada' (المناطق الداخلية والريفية في قشتالة وأراغون التي هجرها سكانها) تمثل أحد أكبر التحديات السياسية والاجتماعية في إسبانيا المعاصرة."
        },
        "contentBlocks": [
            {
                "id": f"cb-{slug}-intro",
                "type": "explanation",
                "titleAr": "مفاهيم التغير الديموغرافي والمجتمعي",
                "bodyAr": "المصطلحات الديموغرافية والاجتماعية:\n- **el envejecimiento poblacional**: شيخوخة السكان وارتفاع معدل الأعمار\n- **la tasa de natalidad**: معدل الولادات والخصوبة السنوية\n- **la España vaciada**: مصطلح إسباني شهير يطلق على المناطق الريفية المهجورة التي تعاني من النزوح\n- **el éxodo rural**: النزوح والهجرة الجماعية من الريف إلى المدن الكبرى\n- **el relevo generacional**: التعاقب والإحلال الجيلي في سوق العمل والمجتمع\n- **la pirámide poblacional**: الهرم السكاني وتوزع الفئات العمرية",
                "examples": [
                    {"es": "El envejecimiento poblacional plantea enormes retos para la sanidad y las pensiones.", "ar": "تفرض شيخوخة السكان تحديات هائلة على منظومتي الصحة والتقاعد."},
                    {"es": "Muchos municipios de la España vaciada ofrecen incentivos fiscales para atraer a familias jóvenes.", "ar": "تقدم بلديات عديدة في إسبانيا الريفية المهجورة حوافز ضريبية لجذب الأسر الشابة."},
                    {"es": "La inmigración contribuye decisivamente a garantizar el relevo generacional en sectores clave.", "ar": "تسهم الهجرة بشكل حاسم في ضمان التعاقب الجيلي في القطاعات الحيوية."}
                ]
            }
        ],
        "newVocabulary": ["envejecimiento poblacional", "tasa de natalidad", "España vaciada", "éxodo rural", "relevo generacional", "pirámide poblacional"],
        "reviewVocabulary": ["población", "sociedad"]
    }

    exs = [
        choice_ex(
            "ex-b2-tsd-1", "word_choice",
            "اختر المصطلح الاجتماعي الإسباني الشهير الذي يطلق على المناطق الريفية التي هجرها سكانها",
            ["vocabulary"], 1,
            "ما هو التعبير الشائع في الإعلام الإسباني لوصف القرى والمناطق الداخلية الخالية من الخدمات والشباب؟",
            "El problema de la despoblación en _____ exige un pacto de Estado integral.",
            "تتطلب مشكلة تفريغ السكان في ... ميثاق دولة شاملاً ومستداماً.",
            [
                opt("a", "España vaciada", "إسبانيا الريفية المفرغة من سكانها (الصواب)", True),
                opt("b", "gran urbe", "المدينة المليونية الكبرى", False, "المصطلح الذي يطلق على الريف المهجور هو la España vaciada."),
                opt("c", "costa turística", "الساحل السياحي المزدحم", False, "الظاهرة تسمى la España vaciada.")
            ],
            ["España vaciada", "éxodo rural"],
            "la España vaciada هو المفهوم السوسيولوجي الإسباني للمحافظات والمناطق الريفية التي تعاني من النزوح وتراجع الخدمات."
        ),
        fill_ex(
            "ex-b2-tsd-2",
            "أكمل بالمصطلح الذي يعني التعاقب والإحلال الجيلي: el _____ generacional",
            ["vocabulary", "writing"], 1,
            "اكتب الكلمة الناقصة في التعبير: relevo _____ (التعاقب الجيلي في سوق العمل):",
            "El sector agrícola necesita con urgencia un relevo _____ para evitar el abandono de las tierras.",
            "يحتاج القطاع الزراعي بإلحاح إلى تعاقب ... لتفادي التخلي عن الأراضي.",
            ["relevo generacional"],
            ["generacional"],
            "el relevo generacional هو تعاقب الأجيال وحلول الشباب محل المتقاعدين في سوق العمل."
        ),
        choice_ex(
            "ex-b2-tsd-3", "word_choice",
            "حدد الظاهرة السكانية الناتجة عن انخفاض المواليد وارتفاع متوسط العمر المتوقع",
            ["vocabulary"], 2,
            "ماذا نسمي التحول الديموغرافي الذي تزداد فيه نسبة كبار السن مقارنة بالشباب؟",
            "El progresivo _____ de la sociedad europea obliga a reformar el sistema público de pensiones.",
            "يفرض التزايد المطرد في ... المجتمع الأوروبي إصلاح نظام المعاشات العام.",
            [
                opt("a", "envejecimiento poblacional", "شيخوخة السكان (الصواب)", True),
                opt("b", "éxodo rural", "النزوح الريفي فقط", False, "تزايد كبار السن يسمى el envejecimiento poblacional."),
                opt("c", "consenso", "توافق سياسي", False, "المفهوم السكاني هو envejecimiento poblacional.")
            ],
            ["envejecimiento poblacional", "tasa de natalidad", "relevo generacional"],
            "el envejecimiento poblacional هو ارتفاع نسبة المسنين نتيجة طول العمر وانخفاض معدلات الخصوبة."
        ),
        order_ex(
            "ex-b2-tsd-4",
            "رتّب الجملة الديموغرافية لوصف أثر انخفاض المواليد",
            ["grammar", "writing"], 2,
            ["La", "baja", "tasa", "de", "natalidad", "afecta", "al", "crecimiento", "económico"],
            "La baja tasa de natalidad afecta al crecimiento económico",
            "الترتيب: المبتدأ La baja tasa de natalidad ثم الفعل afecta ثم شبه الجملة al crecimiento económico.",
            ["tasa de natalidad", "pirámide poblacional"]
        ),
        choice_ex(
            "ex-b2-tsd-5", "listen_choose",
            "استمع لخبير علم السكان وحدد حركة الهجرة التاريخية التي يصفها",
            ["listening", "vocabulary"], 2,
            "استمع للتحليل السوسيولوجي لتاريخ إسبانيا في القرن العشرين",
            "El masivo éxodo rural de los años sesenta concentró la población en las capitales industriales.",
            "أدى النزوح الريفي الهائل في الستينيات إلى تركيز السكان في العواصم الصناعية.",
            [
                opt("a", "éxodo rural", "النزوح والهجرة الكثيفة من الريف للمدينة (الصواب)", True),
                opt("b", "turismo estival", "سياحة صيفية عابرة", False, "الخبير تحدث عن el masivo éxodo rural."),
                opt("c", "inversión extranjera", "استثمار أجنبي", False, "الظاهرة السكانية كانت éxodo rural.")
            ],
            ["éxodo rural", "España vaciada"],
            "الخبير قال بوضوح: 'El masivo éxodo rural de los años sesenta'.",
            audioKey="pending/b2_masivo_exodo_rural_capitales.mp3",
            speechEs="El masivo éxodo rural de los años sesenta concentró la población en las capitales industriales."
        ),
        speak_ex(
            "ex-b2-tsd-6",
            "انطق عبارتك التحليلية حول التحديات الديموغرافية والريف المهجور بفصاحة وطلاقة",
            ["speaking", "pronunciation"], 2,
            "انطق الجملة التالية لتقديم تحليل سوسيولوجي لظاهرة السكان في إسبانيا المعاصرة:",
            "Para frenar el envejecimiento poblacional y revitalizar la España vaciada, es crucial garantizar el relevo generacional.",
            "لكبح جماح شيخوخة السكان وإنعاش إسبانيا الريفية المهجورة، من المحوري ضمان التعاقب الجيلي.",
            "pending/b2_frenar_envejecimiento_espana_vaciada.mp3",
            ["envejecimiento poblacional", "España vaciada", "relevo generacional", "éxodo rural"],
            "Para frenar el envejecimiento poblacional y revitalizar la España vaciada, es crucial garantizar el relevo generacional.",
            "انتبه لنطق envejecimiento و España vaciada و relevo generacional بطلاقة ووضوح."
        )
    ]
    return lesson_doc(doc, exs, level="B2")


def make_lesson_debate_energia_desarrollo():
    slug = "b2-debate-energia-desarrollo"
    doc = {
        "slug": slug,
        "unitSlug": "b2-u7-environment",
        "levelCode": "B2",
        "titleAr": "مناظرة بيئية: الطاقة المتجددة مقابل التنمية والنمو الاقتصادي",
        "titleEs": "Debate ecológico: Energías renovables frente a soberanía energética y desarrollo",
        "subtitleAr": "المفاضلة بين الطاقة النووية، مزارع الرياح، وتكلفة الفاتورة الكهربائية",
        "order": 4,
        "estimatedMinutes": 20,
        "cefrLevel": "B2",
        "review": review_block(),
        "pedagogy": {
            "learningObjectivesAr": [
                "أن يشارك المتعلم في مناظرة متقدمة حول مزايا وعيوب مصادر الطاقة المختلفة.",
                "أن يوظف مصطلحات الجدل الطاقي: soberanía energética, parque eólico, energía fotovoltaica, descarbonización, dilema ético.",
                "أن يقدم حججاً مفحمة تدعم موقفه وتفند اعتراضات الخصم بموضوعية ولباقة."
            ],
            "grammarPoints": [
                {
                    "titleAr": "تراكيب المناظرة والمفاضلة المعقدة بين الخيارات التنموية",
                    "explanationAr": "1. **طرح المعضلة والمفاضلة الصعبة**:\n- *Nos encontramos ante un dilema ético y económico crucial...*\n- *¿Hasta qué punto es compatible el crecimiento ilimitado con los límites biofísicos del planeta?*\n2. **التعبير عن الاعتراض المقيد (Concesión matizada)**:\n- *Si bien es cierto que las renovables requieren inversión inicial, su coste operativo es nulo*.\n- *No se puede obviar el impacto paisajístico de los parques eólicos, pero el coste de no actuar es mayor*.\n3. **تأكيد السيادة الطاقية**:\n- *Apostar por la descarbonización es la única vía para garantizar nuestra soberanía energética*."
                }
            ],
            "commonMistakesAr": [
                "الاستقطاب الحاد في المناظرة واستخدام اتهامات شخصية بدلاً من التركيز على الأرقام وحقائق التكلفة والإنتاجية.",
                "الخلط بين مفهوم 'الطاقة النظيفة' (limpia) ومفهوم 'الطاقة المتجددة' (renovable)؛ فالطاقة النووية مثلاً منخفضة الكربون لكنها غير متجددة وتولد نفايات مشعة."
            ],
            "dialectNotes": [
                {
                    "region": "EG",
                    "noteAr": "في المناظرات بنقول «مع إن الطاقة الشمسية والرياح مكلفة في الأول، بس ده الخيار الوحيد عشان نستقل في طاقتنا ونحمي البيئة». بالإسبانية: Si bien la inversión es alta, las renovables son la única vía para lograr la soberanía energética."
                }
            ],
            "culturalNoteAr": "إسبانيا شهدت نقاشاً مجتمعياً واسعاً حول التوازن بين نشر محطات الطاقة الشمسية وطاقة الرياح في الريف والحفاظ على التنوع الحيوي والمناظر الطبيعية والزراعة التقليدية."
        },
        "contentBlocks": [
            {
                "id": f"cb-{slug}-intro",
                "type": "explanation",
                "titleAr": "ترسانة الجدل حول الطاقة والتنمية",
                "bodyAr": "المفاهيم المحورية للمناظرة:\n- **la soberanía energética**: السيادة والاستقلالية الطاقية وعدم الارتهان للغاز والنفط الخارجي\n- **el parque eólico**: حقل ومزرعة توربينات طاقة الرياح\n- **la energía fotovoltaica**: الطاقة الكهروضوئية الشمسية\n- **la descarbonización**: التخلص التدريجي من الوقود الأحفوري وتحييد الكربون\n- **el dilema ético**: المعضلة الأخلاقية والتنموية في المفاضلة بين أمرين ملحين\n- **el impacto paisajístico**: الأثر البصري والجمالي للمحطات على المنظر الطبيعي",
                "examples": [
                    {"es": "El despliegue de parques eólicos suscita debates por su impacto paisajístico en zonas rurales.", "ar": "يثير نشر مزارع الرياح نقاشات حول أثرها البصري على المشهد الطبيعي في المناطق الريفية."},
                    {"es": "Alcanzar la soberanía energética pasa necesariamente por acelerar la descarbonización.", "ar": "يمر تحقيق السيادة الطاقية بالضرورة عبر تسريع التخلص من الكربون."},
                    {"es": "La sociedad afronta el dilema ético de compatibilizar el progreso industrial con la ecología.", "ar": "يواجه المجتمع المعضلة الأخلاقية المتمثلة في التوفيق بين التقدم الصناعي وحماية البيئة."}
                ]
            }
        ],
        "newVocabulary": ["soberanía energética", "parque eólico", "energía fotovoltaica", "descarbonización", "dilema ético", "impacto paisajístico"],
        "reviewVocabulary": ["energía", "desarrollo"]
    }

    exs = [
        choice_ex(
            "ex-b2-ded-1", "word_choice",
            "اختر المصطلح الذي يعني قدرة الدولة على تأمين احتياجاتها من الطاقة دون التبعية للخارج",
            ["vocabulary"], 1,
            "ما هي العبارة الاستراتيجية التي تعني 'الاستقلالية وعدم الاعتماد على الوقود المستورد'؟",
            "La crisis del gas demostró la urgente necesidad de avanzar hacia la _____ nacional.",
            "أظهرت أزمة الغاز الحاجة الملحة للمضي قدماً نحو ... الوطنية.",
            [
                opt("a", "soberanía energética", "السيادة والاستقلالية الطاقية (الصواب)", True),
                opt("b", "tasa de natalidad", "معدل المواليد", False, "الاستقلال الطاقي يسمى la soberanía energética."),
                opt("c", "congoja", "غصة حزن", False, "المفهوم الاستراتيجي هو soberanía energética.")
            ],
            ["soberanía energética", "descarbonización"],
            "la soberanía energética هي استقلالية الدولة في إنتاج طاقتها بالاعتماد على مواردها الذاتية النظيفة."
        ),
        fill_ex(
            "ex-b2-ded-2",
            "أكمل بالمصطلح الذي يعني مجمع توربينات طاقة الرياح: el _____ eólico",
            ["vocabulary", "writing"], 1,
            "اكتب الكلمة المذكرة الناقصة: un _____ eólico (مزرعة لتوليد الطاقة من الرياح):",
            "La instalación del nuevo _____ eólico generará electricidad limpia para cien mil hogares.",
            "ستولد محطة حقل ... الجديد كهرباء نظيفة لمائة ألف منزل.",
            ["parque eólico"],
            ["parque"],
            "el parque eólico هو مجمع توربينات الرياح المخصص لتوليد الكهرباء."
        ),
        choice_ex(
            "ex-b2-ded-3", "word_choice",
            "حدد العملية الاقتصادية والصناعية التي تهدف للتخلص من حرق الوقود الأحفوري والانبعاثات",
            ["vocabulary"], 2,
            "ماذا نسمي المسار الشامل لإزالة الكربون من وسائل النقل والصناعة وتوليد الطاقة؟",
            "La _____ total de la economía exigirá cuantiosas inversiones en redes inteligentes.",
            "سيتطلب التخلص التام من ... في مفاصل الاقتصاد استثمارات ضخمة في الشبكات الذكية.",
            [
                opt("a", "descarbonización", "إزالة الكربون والتخلص من الوقود الأحفوري (الصواب)", True),
                opt("b", "rescisión", "فسخ عقد", False, "المسار البيئي يسمى la descarbonización."),
                opt("c", "paráfrasis", "إعادة صياغة", False, "المصطلح البيئي هو descarbonización.")
            ],
            ["descarbonización", "soberanía energética", "energía fotovoltaica"],
            "la descarbonización هي التحول الكامل نحو أنشطة لا تصدر انبعاثات كربونية ضارة بالمناخ."
        ),
        order_ex(
            "ex-b2-ded-4",
            "رتّب الجملة الحوارية لبيان المعضلة التنموية في المناظرة",
            ["grammar", "writing"], 2,
            ["Nos", "enfrentamos", "a", "un", "grave", "dilema", "ético", "y", "económico"],
            "Nos enfrentamos a un grave dilema ético y económico",
            "الترتيب: الفعل والانعكاس Nos enfrentamos ثم حرف الجر a ثم الموصوف un grave dilema ثم النعت ético y económico.",
            ["dilema ético", "impacto paisajístico"]
        ),
        choice_ex(
            "ex-b2-ded-5", "listen_choose",
            "استمع للمناظر المعارض وحدد العيب البيئي والبصري الذي يعترض عليه في المشروع",
            ["listening", "vocabulary"], 2,
            "استمع لحجة المتحدث في جلسة الاستماع العامة للبلدية",
            "Los vecinos protestan contra el grave impacto paisajístico de las megainstalaciones solares.",
            "يحتج السكان المحليون ضد الأثر البصري والمشهد الطبيعي المشوه للمنشآت الشمسية الضخمة.",
            [
                opt("a", "impacto paisajístico", "الأثر البصري وتشويه المشهد الطبيعي (الصواب)", True),
                opt("b", "soberanía energética", "سيادة طاقية", False, "الاعتراض كان على el grave impacto paisajístico."),
                opt("c", "beneficio mutuo", "فائدة مشتركة", False, "الشكوى كانت من impacto paisajístico.")
            ],
            ["impacto paisajístico", "parque eólico"],
            "المتحدث قال: 'el grave impacto paisajístico de las megainstalaciones'.",
            audioKey="pending/b2_impacto_paisajistico_megainstalaciones.mp3",
            speechEs="Los vecinos protestan contra el grave impacto paisajístico de las megainstalaciones solares."
        ),
        speak_ex(
            "ex-b2-ded-6",
            "انطق مرافعتك في المناظرة دفاعاً عن الطاقة النظيفة والسيادة الطاقية بقوة وإقناع",
            ["speaking", "pronunciation"], 2,
            "انطق الجملة التالية لتقديم حجة ختامية مقنعة في المناظرة البيئية:",
            "Para lograr la soberanía energética y frenar el cambio climático, la descarbonización es una prioridad absoluta.",
            "لتحقيق السيادة الطاقية وكبح جماح التغير المناخي، يُعد التخلص من الكربون أولوية مطلقة.",
            "pending/b2_soberania_energetica_descarbonizacion_prioridad.mp3",
            ["soberanía energética", "descarbonización", "dilema ético", "parque eólico"],
            "Para lograr la soberanía energética y frenar el cambio climático, la descarbonización es una prioridad absoluta.",
            "انتبه لنطق soberanía energética و descarbonización بنبرة سجالية واثقة ومفحمة."
        )
    ]
    return lesson_doc(doc, exs, level="B2")
