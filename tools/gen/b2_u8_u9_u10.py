# -*- coding: utf-8 -*-
"""B2 Units 8 (Public Speaking & Presentations), 9 (Official & Diplomatic Correspondence), 10 (Deep Culture & Linguistic Diversity).
12 Lessons completing B2 Units 8, 9, and 10 based on:
- Aula Plus 4 & 5 (B2.1 & B2.2)
- Gramática del uso del español B1-B2 (Fórmulas de cortesía, registro protocolario, marcadores orales)
- Nuevo Español 2000 Nivel Superior
- المرشد في اللغة الأسبانية (أساليب الإلقاء والمراسلات الرسمية والفروق الثقافية الإقليمية)
"""
import sys, os
sys.path.insert(0, os.path.dirname(__file__))
from common import opt, choice_ex, fill_ex, order_ex, speak_ex, lesson_doc, review_block

# ==============================================================================
# UNIT 8: b2-u8-presentations (العروض التقديمية والتحدث أمام الجمهور)
# ==============================================================================

def make_lesson_apertura_presentacion_audiencia():
    slug = "b2-apertura-presentacion-audiencia"
    doc = {
        "slug": slug,
        "unitSlug": "b2-u8-presentations",
        "levelCode": "B2",
        "titleAr": "افتتاح العرض التقديمي: كسر الجليد وجذب انتباه الجمهور",
        "titleEs": "Apertura de presentaciones: Captación de la atención y estructura inicial",
        "subtitleAr": "الترحيب الرسمي، طرح الخطاف (el gancho)، وتحديد أهداف المحاضرة",
        "order": 1,
        "estimatedMinutes": 20,
        "cefrLevel": "B2",
        "review": review_block(),
        "pedagogy": {
            "learningObjectivesAr": [
                "أن يفتتح المتعلم عرضاً تقديمياً أمام الجمهور بأسلوب واثق ومحترف.",
                "أن يوظف تقنيات استهلال الخطابة: gancho inicial, pregunta retórica, agradecer la presencia, hoja de ruta.",
                "أن يحدد هيكل العرض ووقته بوضوح تام في الدقائق الأولى."
            ],
            "grammarPoints": [
                {
                    "titleAr": "التراكيب الخطابية لافتتاح العروض والترحيب بالجمهور",
                    "explanationAr": "1. **الترحيب الرسمي والشكر على الحضور**:\n- *Es un verdadero honor y un placer estar hoy aquí con todos ustedes*.\n- *Quiero agradecerles de antemano su presencia en esta conferencia*.\n2. **طرح الخطاف التشويقي (El gancho inicial)**:\n- *¿Se han preguntado alguna vez cómo será nuestra vida dentro de veinte años?*\n- *Permítanme comenzar con un dato impactante que cambiará su perspectiva*.\n3. **عرض خارطة الطريق التقديمية (La hoja de ruta)**:\n- *He estructurado mi intervención en tres bloques principales*:\n- *En primer lugar abordaremos... A continuación analizaremos... y finalmente concluiremos con...*"
                }
            ],
            "commonMistakesAr": [
                "البدء بالاعتذار عن الارتباك أو الأعطال الفنية؛ المتحدث المحترف يبدأ مباشرة بنبرة إيجابية وواثقة.",
                "الإطالة في المقدمات النظرية بدلاً من الانتقال السريع لصلب الموضوع وخارطة الطريق."
            ],
            "dialectNotes": [
                {
                    "region": "EG",
                    "noteAr": "في افتتاح البريزنتيشن بنقول «يشرفني وجودي معاكم النهارده، وهقسم كلامي لتلت نقط أساسية وهبدأ بسؤال مهم». بالإسبانية: Es un placer estar aquí; he dividido mi exposición en tres puntos clave y comenzaré con una pregunta."
                }
            ],
            "culturalNoteAr": "الجمهور في إسبانيا وأمريكا اللاتينية يقدر العفوية والتواصل البصري الحقيقي (contacto visual) والدفء الإنساني بجانب المادة المعرفية الدقيقة."
        },
        "contentBlocks": [
            {
                "id": f"cb-{slug}-intro",
                "type": "explanation",
                "titleAr": "مفاتيح افتتاح العرض المؤثر",
                "bodyAr": "أهم التراكيب والتقنيات:\n- **el gancho inicial**: الخطاف الاستهلالي لجذب انتباه المستمعين من اللحظة الأولى\n- **la hoja de ruta**: خارطة طريق العرض والخطوط العريضة المقررة\n- **la pregunta retórica**: السؤال البلاغي الذي يثير التفكير دون انتظار إجابة\n- **el contacto visual**: التواصل البصري المستمر مع مختلف أرجاء القاعة\n- **estructurar la intervención**: تقسيم المداخلة وترتيب فقراتها بوضوح\n- **agradecer la presencia**: توجيه الشكر الخالص للحضور على تواجدهم",
                "examples": [
                    {"es": "El ponente utilizó una pregunta retórica como gancho inicial de su exposición.", "ar": "استخدم المحاضر سؤالاً بلاغياً كخطاف استهلالي في عرضه."},
                    {"es": "Antes de profundizar, permítanme trazar una breve hoja de ruta de la sesión.", "ar": "قبل التعمق، اسمحوا لي برسم خارطة طريق موجزة للجلسة."},
                    {"es": "Agradezco sinceramente su presencia e interés en este simposio internacional.", "ar": "أشكر بصدق حضوركم واهتمامكم بهذا المؤتمر الدولي."}
                ]
            }
        ],
        "newVocabulary": ["gancho inicial", "hoja de ruta", "pregunta retórica", "contacto visual", "estructurar", "agradecer la presencia"],
        "reviewVocabulary": ["presentación", "público"]
    }

    exs = [
        choice_ex(
            "ex-b2-apa-1", "word_choice",
            "اختر التقنية الخطابية التي تعني العبارة أو القصة الافتتاحية الجاذبة لانتباه الجمهور",
            ["vocabulary"], 1,
            "ماذا نسمي العنصر التشويقي في بداية العرض الذي يشد أذهان الحاضرين؟",
            "Un buen _____ al inicio de la charla evita que la audiencia pierda el interés.",
            "... الجيد في مستهل الحديث يمنع تشتت انتباه الجمهور وفقدان اهتمامه.",
            [
                opt("a", "gancho inicial", "الخطاف التشويقي الاستهلالي (الصواب)", True),
                opt("b", "desenlace", "الحل النهائي", False, "البداية المشوقة تسمى el gancho inicial."),
                opt("c", "sesgo", "انحياز صحفي", False, "التقنية الخطابية هي el gancho inicial.")
            ],
            ["gancho inicial", "hoja de ruta"],
            "el gancho inicial (hook) هو السؤال أو الواقعة المفاجئة التي يفتتح بها المتحدث لجذب انتباه الحاضرين."
        ),
        fill_ex(
            "ex-b2-apa-2",
            "أكمل بالمصطلح الذي يعني المخطط الزمني وخارطة الطريق للعرض: la _____ de ruta",
            ["vocabulary", "writing"], 1,
            "اكتب الكلمة الناقصة في التعبير: la _____ de ruta (خارطة الطريق):",
            "A continuación les presento la _____ de ruta de los temas que vamos a tratar hoy.",
            "فيما يلي أعرض عليكم خارطة ... للموضوعات التي سنتناولها اليوم.",
            ["hoja de ruta"],
            ["hoja"],
            "la hoja de ruta هي خارطة الطريق التي تحدد محطات وفقرات العرض التقديمي."
        ),
        choice_ex(
            "ex-b2-apa-3", "word_choice",
            "حدد الأسلوب البلاغي الذي يطرح فيه المتحدث سؤالاً لتحفيز التفكير دون انتظار جواب شفهي",
            ["vocabulary"], 2,
            "ماذا نسمي السؤال الموجه للجمهور لإثارة التأمل الذاتي وليس لأخذ إجابة؟",
            "El conferenciante lanzó una _____ para hacer reflexionar al auditorio sobre el futuro.",
            "ألقى المحاضر ... لجعل الحاضرين يتأملون في شأن المستقبل.",
            [
                opt("a", "pregunta retórica", "سؤال بلاغي استنكاري وتأملي (الصواب)", True),
                opt("b", "cita textual", "اقتباس حرفي", False, "السؤال التأملي يسمى pregunta retórica."),
                opt("c", "acta", "محضر جلسة", False, "الأسلوب هو pregunta retórica.")
            ],
            ["pregunta retórica", "gancho inicial", "contacto visual"],
            "la pregunta retórica هي السؤال البلاغي الذي يحفز ذهن المتلقي دون حاجة لإجابة فورية."
        ),
        order_ex(
            "ex-b2-apa-4",
            "رتّب الجملة الافتتاحية للترحيب بالجمهور وتحديد محاور الحديث",
            ["grammar", "writing"], 2,
            ["Es", "un", "placer", "estar", "hoy", "aquí", "con", "todos", "ustedes"],
            "Es un placer estar hoy aquí con todos ustedes",
            "الترتيب: العبارة Es un placer ثم المصدر estar ثم الظرف hoy aquí ثم شبه الجملة con todos ustedes.",
            ["agradecer la presencia", "estructurar"]
        ),
        choice_ex(
            "ex-b2-apa-5", "listen_choose",
            "استمع للمتحدث وحدد السلوك غير اللفظي الذي يوصي به لجذب ثقة الحضور",
            ["listening", "vocabulary"], 2,
            "استمع لنصيحة مدرب الخطابة التقديمية",
            "Es crucial mantener el contacto visual con toda la sala para proyectar seguridad.",
            "من الحاسم الحفاظ على التواصل البصري مع كامل القاعة لبث الثقة في الحضور.",
            [
                opt("a", "contacto visual", "التواصل البصري المباشر مع الحاضرين (الصواب)", True),
                opt("b", "mirar al suelo", "النظر إلى الأرض", False, "المدرب شدد على el contacto visual."),
                opt("c", "leer notas fijas", "القراءة الجامدة من الورق", False, "النصيحة كانت التواصل البصري contacto visual.")
            ],
            ["contacto visual", "estructurar"],
            "المدرب قال: 'Es crucial mantener el contacto visual con toda la sala'.",
            audioKey="pending/b2_contacto_visual_proyectar_seguridad.mp3",
            speechEs="Es crucial mantener el contacto visual con toda la sala para proyectar seguridad."
        ),
        speak_ex(
            "ex-b2-apa-6",
            "انطق عبارتك الافتتاحية بثقة وجاذبية عالية أمام المنصة",
            ["speaking", "pronunciation"], 2,
            "انطق الجملة التالية كخطيب مفوه يفتتح ندوته الدولية:",
            "Agradezco de antemano su presencia y les presento la hoja de ruta que guiará nuestra exposición de hoy.",
            "أشكر مقدماً حضوركم وأعرض عليكم خارطة الطريق التي ستوجه عرضنا لهذا اليوم.",
            "pending/b2_agradezco_presencia_hoja_ruta.mp3",
            ["agradecer la presencia", "hoja de ruta", "estructurar", "gancho inicial"],
            "Agradezco de antemano su presencia y les presento la hoja de ruta que guiará nuestra exposición de hoy.",
            "انتبه لنطق agradezco de antemano و hoja de ruta بنبرة ترحيبية دافئة وجذابة."
        )
    ]
    return lesson_doc(doc, exs, level="B2")


def make_lesson_descripcion_graficos_tendencias():
    slug = "b2-descripcion-graficos-tendencias"
    doc = {
        "slug": slug,
        "unitSlug": "b2-u8-presentations",
        "levelCode": "B2",
        "titleAr": "شرح الرسوم البيانية والإحصائيات: لغة الأرقام والاتجاهات",
        "titleEs": "Descripción de gráficos y datos cuantitativos: Tendencias y proyecciones",
        "subtitleAr": "التعبير عن الصعود الصاروخي (dispararse)، الاستقرار، والتقلبات في العروض",
        "order": 2,
        "estimatedMinutes": 20,
        "cefrLevel": "B2",
        "review": review_block(),
        "pedagogy": {
            "learningObjectivesAr": [
                "أن يصف المتعلم رسوماً بيانية وجداول إحصائية بدقة وسلاسة أمام الجمهور.",
                "أن يوظف مفردات حركة المؤشرات: dispararse, desplomarse, estancarse, tocar fondo, experimentar un repunte.",
                "أن يقارن بين المتغيرات في الرسوم البيانية الدائرية والأعمدة والخطوط البيانية."
            ],
            "grammarPoints": [
                {
                    "titleAr": "التراكيب والأفعال المتخصصة في وصف الرسوم والمنحنيات",
                    "explanationAr": "1. **أفعال الصعود السريع والهبوط الحاد**:\n- *Subir con fuerza / Dispararse*: Las exportaciones se dispararon en el tercer trimestre.\n- *Caer en picado / Desplomarse*: El valor de las acciones se desplomó tras la noticia.\n2. **التعبير عن الاستقرار والركود والارتداد**:\n- *Estancarse / Permanecer estable*: Los salarios se han estancado en la última década.\n- *Experimentar un repunte*: La demanda experimentó un notable repunte en primavera.\n3. **الإشارة البصرية للمخطط**:\n- *Como pueden apreciar en el eje de abscisas / ordenadas...*\n- *Este gráfico de barras ilustra con nitidez la brecha entre ambos grupos*."
                }
            ],
            "commonMistakesAr": [
                "الاقتصار على *sube* و *baja* البسيطة لوصف كل التغيرات؛ العرض الاحترافي يتطلب مفردات معبرة عن سرعة وزاوية التغير (*se disparó, se estancó, tocó fondo*).",
                "قراءة كل الأرقام حرفياً على الشريحة بدلاً من تفسير الاتجاه العام والمغزى والرسالة وراء البيانات."
            ],
            "dialectNotes": [
                {
                    "region": "EG",
                    "noteAr": "في قراءة الشارت بنقول «زي ما هو باين في الرسم البياني، المبيعات نطت فجأة بعد ما كانت مستقرة والأسهم نزلت للأرض». بالإسبانية: Como muestra el gráfico, las ventas se dispararon tras un periodo de estancamiento."
                }
            ],
            "culturalNoteAr": "الخبراء الإسبان يفضلون المخططات البيانية النظيفة (Gráficos despejados) التي تبرز الاتجاه الاستراتيجي مع تجنب إغراق الشريحة بالمعطيات الزائدة."
        },
        "contentBlocks": [
            {
                "id": f"cb-{slug}-intro",
                "type": "explanation",
                "titleAr": "معجم حركة المنحنيات والمؤشرات",
                "bodyAr": "أهم أفعال ومفاهيم الرسوم البيانية:\n- **dispararse**: يقفز ويصعد بسرعة صاروخية حادة\n- **desplomarse**: ينهار ويهوي سقوطاً حاداً\n- **estancarse**: يستقر ويركد بلا حركة ولا نمو\n- **experimentar un repunte**: يشهد انتعاشة وارتداداً صعودياً إيجابياً\n- **tocar fondo**: يلامس القاع في أدنى مستوياته قبل التعافي\n- **el gráfico de barras/sectores**: المخطط بالأعمدة أو بالقطاعات الدائرية",
                "examples": [
                    {"es": "Como observan en la curva azul, las ventas se dispararon un treinta por ciento.", "ar": "كما تلاحظون في المنحنى الأزرق، قفزت المبيعات قفزة صاروخية بنسبة ثلاثين بالمائة."},
                    {"es": "Tras varios meses de caída, el índice bursátil tocó fondo en agosto y luego repuntó.", "ar": "بعد شهور من الهبوط، لامس المؤشر القاع في أغسطس ثم ارتد صعوداً."},
                    {"es": "El gráfico de barras ilustra con claridad la distribución del gasto por departamentos.", "ar": "يوضح الرسم البياني بالأعمدة توزيع النفقات حسب الأقسام بجلاء."}
                ]
            }
        ],
        "newVocabulary": ["dispararse", "desplomarse", "estancarse", "experimentar un repunte", "tocar fondo", "gráfico de barras"],
        "reviewVocabulary": ["gráfico", "número"]
    }

    exs = [
        choice_ex(
            "ex-b2-dgt-1", "word_choice",
            "اختر الفعل الذي يعبر عن الصعود الصاروخي الحاد والمفاجئ للأرقام",
            ["vocabulary"], 1,
            "أي فعل تصف به منحنى بياني قفز فجأة إلى القمة بسرعة فائقة؟",
            "Durante el confinamiento, la demanda de comercio electrónico se _____ de forma espectacular.",
            "خلال فترة الإغلاق، ... الطلب على التجارة الإلكترونية بشكل مذهل وصاروخي.",
            [
                opt("a", "disparó", "صعد صعوداً صاروخياً فائقاً (الصواب)", True),
                opt("b", "estancó", "ركد وثبت في مكانه", False, "القفزة السريعة يعبر عنها بـ se disparó."),
                opt("c", "desplomó", "سقط وانهار", False, "الصعود الصاروخي هو se disparó.")
            ],
            ["dispararse", "desplomarse"],
            "dispararse يعني القفز السريع الحاد للقيم الإحصائية كالسهم المنطلق."
        ),
        fill_ex(
            "ex-b2-dgt-2",
            "أكمل بالمصطلح الذي يعني وصول المؤشر إلى أدنى درك ممكن: tocar _____",
            ["vocabulary", "writing"], 1,
            "اكتب الكلمة الناقصة في التعبير: tocar _____ (يلامس القاع في التراجع):",
            "La economía tocó _____ durante el primer trimestre antes de iniciar la paulatina recuperación.",
            "لامس الاقتصاد ... خلال الربع الأول قبل أن يبدأ التعافي التدريجي.",
            ["tocar fondo"],
            ["fondo"],
            "tocar fondo تعني بلوغ أدنى نقطة سلبية ممكنة قبل بدء الارتداد الصاعد."
        ),
        choice_ex(
            "ex-b2-dgt-3", "word_choice",
            "حدد الفعل الذي يصف الانهيار والسقوط العمودي المفاجئ للأسهم أو المبيعات",
            ["vocabulary"], 2,
            "ما هي الكلمة التي تعني 'الهبوط الحر الحاد والانهيار الكامل للأرقام'؟",
            "Tras la publicación de los malos resultados, el valor de la empresa se _____ en bolsa.",
            "إثر نشر النتائج السيئة، ...ت قيمة الشركة في البورصة وهوت سقوطاً حاداً.",
            [
                opt("a", "desplomó", "انهارت وهوت سقوطاً حاداً (الصواب)", True),
                opt("b", "disparó", "قفزت للأعلى", False, "الانهيار الحاد يسمى se desplomó."),
                opt("c", "evocó", "استحضرت ذكرى", False, "الهبوط الحاد هو se desplomó.")
            ],
            ["desplomarse", "dispararse", "estancarse"],
            "desplomarse يعني الانهيار والسقوط السريع الحاد للمؤشرات المالية."
        ),
        order_ex(
            "ex-b2-dgt-4",
            "رتّب الجملة التوضيحية لشرح معطيات الرسم البياني بالأعمدة",
            ["grammar", "writing"], 2,
            ["Este", "gráfico", "de", "barras", "muestra", "la", "evolución", "mensual"],
            "Este gráfico de barras muestra la evolución mensual",
            "الترتيب: اسم الإشارة Este ثم الموصوف gráfico ثم النعت de barras ثم الفعل muestra ثم المفعول la evolución mensual.",
            ["gráfico de barras", "estancarse"]
        ),
        choice_ex(
            "ex-b2-dgt-5", "listen_choose",
            "استمع للمحلل المالي وحدد التغير الإيجابي الذي طرأ على المنحنى في الربيع",
            ["listening", "vocabulary"], 2,
            "استمع لشرح المخطط البياني في النشرة الاقتصادية",
            "A partir de mayo, las exportaciones experimentaron un notable repunte.",
            "ابتداءً من شهر مايو، شهدت الصادرات انتعاشة وارتداداً صعودياً ملحوظاً.",
            [
                opt("a", "experimentar un repunte", "شهد انتعاشة وارتداداً إيجابياً صاعداً (الصواب)", True),
                opt("b", "desplomarse", "انهارت تماماً", False, "المحلل قال: experimentaron un notable repunte."),
                opt("c", "tocar fondo", "بلغت القاع السلبي", False, "الحدث كان انتعاشة: un repunte.")
            ],
            ["experimentar un repunte", "tocar fondo"],
            "المحلل قال بوضوح: 'las exportaciones experimentaron un notable repunte'.",
            audioKey="pending/b2_exportaciones_notable_repunte.mp3",
            speechEs="A partir de mayo, las exportaciones experimentaron un notable repunte."
        ),
        speak_ex(
            "ex-b2-dgt-6",
            "انطق عبارتك لشرح الرسم البياني بأسلوب تحليلي فصيح ومخارج حروف واضحة",
            ["speaking", "pronunciation"], 2,
            "انطق الجملة التالية كخبير يعلق على شاشة المؤشرات أمام الحاضرين:",
            "Como muestra el gráfico de barras, las cifras se dispararon en verano tras tocar fondo en invierno.",
            "كما يُظهر الرسم البياني بالأعمدة، قفزت الأرقام صعوداً في الصيف بعد ملامستها القاع في الشتاء.",
            "pending/b2_grafico_barras_cifras_dispararon.mp3",
            ["gráfico de barras", "dispararse", "tocar fondo", "experimentar un repunte"],
            "Como muestra el gráfico de barras, las cifras se dispararon en verano tras tocar fondo en invierno.",
            "انتبه لنطق gráfico de barras و se dispararon و tocar fondo بنبرة شارحة وواضحة."
        )
    ]
    return lesson_doc(doc, exs, level="B2")


def make_lesson_gestion_preguntas_respuestas():
    slug = "b2-gestion-preguntas-respuestas"
    doc = {
        "slug": slug,
        "unitSlug": "b2-u8-presentations",
        "levelCode": "B2",
        "titleAr": "إدارة فقرة الأسئلة والأجوبة: اللباقة وإعادة توجيه الاستفسارات",
        "titleEs": "Gestión del turno de preguntas (Q&A): Cortesía, aplazamiento y control del debate",
        "subtitleAr": "التعامل مع الأسئلة المحرجة أو الطويلة، شكر السائل، وتأجيل ما يلزم للخاص",
        "order": 3,
        "estimatedMinutes": 20,
        "cefrLevel": "B2",
        "review": review_block(),
        "pedagogy": {
            "learningObjectivesAr": [
                "أن يدير المتعلم جولة الأسئلة والأجوبة (Turno de preguntas) بكفاءة وكياسة تامة.",
                "أن يوظف صيغ التعامل مع المتدخلين: le agradezco la pregunta, si le parece bien lo comentamos en la pausa, ceñirse al tema.",
                "أن يعيد صياغة الأسئلة المعقدة أو المبهمة للتأكد من فهم القاعة قبل الإجابة."
            ],
            "grammarPoints": [
                {
                    "titleAr": "التراكيب الدبلوماسية للرد وتأجيل النقاش في المحاضرات",
                    "explanationAr": "1. **تثمين السؤال وإعادة صياغته (Reformulación cortés)**:\n- *Le agradezco enormemente esta pregunta tan pertinente*.\n- *Si he entendido bien, su inquietud se centra en... ¿es correcto?*\n2. **تأجيل الرد المفصل للاستراحة لتفادي احتكار الوقت**:\n- *Por razones de tiempo, si le parece oportuno, podemos profundizar en ese detalle durante la pausa para el café*.\n3. **إعادة توجيه النقاش الخارج عن السياق**:\n- *Es un tema sumamente interesante, aunque se aleja un poco del objetivo de esta sesión; no obstante...*"
                }
            ],
            "commonMistakesAr": [
                "الدخول في شجار أو مناظرة ثنائية طويلة مع سائل واحد؛ القاعدة الذهبية: إجابة مقتضبة في دقيقة ثم تحويل النقاش الموسع للاستراحة.",
                "التظاهر بمعرفة إجابة سؤال مجهول؛ الأسلوب المهني يعتمد الصدق: *En este momento no dispongo de ese dato exacto, pero con gusto se lo remito por correo*."
            ],
            "dialectNotes": [
                {
                    "region": "EG",
                    "noteAr": "في فقرة الأسئلة لما حد يسأل سؤال طويل أو خارج الموضوع بنقول «سؤال ممتاز، بس عشان الوقت ممكن ندردش فيه بالتفصيل في البريك». بالإسبانية: Es una pregunta muy interesante; si le parece, para no robar tiempo a los demás, lo comentamos tranquilamente en la pausa."
                }
            ],
            "culturalNoteAr": "في المؤتمرات الإسبانية يُعتبر شكر السائل قبل الإجابة (Muchas gracias por su pregunta) من قواعد اللباقة الأساسية التي تبني احتراماً متبادلاً."
        },
        "contentBlocks": [
            {
                "id": f"cb-{slug}-intro",
                "type": "explanation",
                "titleAr": "فن إدارة النقاش مع الجمهور",
                "bodyAr": "العبارات القيادية في جولة الأسئلة:\n- **el turno de preguntas**: جولة وفقرة الأسئلة والأجوبة المخصصة في نهاية العرض\n- **agradecer la intervención**: شكر السائل على مداخلته القيمة\n- **tratar en la pausa**: تأجيل النقاش المفصل للاستراحة غير الرسمية\n- **ceñirse al tema**: الالتزام بالموضوع ومحور المحاضرة دون استطراد\n- **reformular la pregunta**: إعادة صياغة السؤال بصوت مسموع ليتأكد الجميع منه\n- **abrir el turno de palabra**: فتح المجال للجمهور لطلب الكلمة",
                "examples": [
                    {"es": "Abrimos ahora el turno de preguntas para que puedan plantear sus dudas.", "ar": "نفتح الآن فقرة الأسئلة لكي تتمكنوا من طرح استفساراتكم."},
                    {"es": "Agradezco su interesante pregunta, que da en el clavo del debate.", "ar": "أشكركم على سؤالكم المثير للاهتمام، والذي يصيب كبد النقاش بدقة."},
                    {"es": "Le ruego que nos ciñamos al tema principal para que otros compañeros puedan intervenir.", "ar": "أرجو أن نلتزم بالموضوع الرئيسي ليتسنى للزملاء الآخرين المداخلة."}
                ]
            }
        ],
        "newVocabulary": ["turno de preguntas", "agradecer la intervención", "tratar en la pausa", "ceñirse al tema", "reformular", "abrir el turno"],
        "reviewVocabulary": ["duda", "respuesta"]
    }

    exs = [
        choice_ex(
            "ex-b2-gpr-1", "word_choice",
            "اختر العبارة المهذبة المناسبة لتأجيل سؤال تفصيلي جانبي إلى وقت الاستراحة",
            ["vocabulary"], 1,
            "كيف تحول نقاشاً تفصيلياً مع أحد الحاضرين بلباقة دون تضييع وقت المحاضرة؟",
            "Es un aspecto muy técnico; si le parece bien, lo _____ para no restar tiempo a la sala.",
            "هذه نقطة فنية دقيقة للغاية؛ إن بدا لكم الأمر مناسباً، سنتناولها ... لكي لا نقتطع من وقت القاعة.",
            [
                opt("a", "tratamos en la pausa", "نتناولها في الاستراحة بهدوء (الصواب)", True),
                opt("b", "olvidamos para siempre", "ننساها للأبد", False, "اللباقة تقتضي تأجيلها للاستراحة: lo tratamos en la pausa."),
                opt("c", "anulamos del contrato", "نلغيها من العقد", False, "الأسلوب اللبق هو tratamos en la pausa.")
            ],
            ["tratar en la pausa", "turno de preguntas"],
            "tratar en la pausa هي الصيغة الاحترافية لتأجيل الأسئلة المتخصصة المطولة دون إحراج السائل."
        ),
        fill_ex(
            "ex-b2-gpr-2",
            "أكمل بالفعل الذي يعني الالتزام والتقيد التام بموضوع الجلسة: _____ al tema",
            ["vocabulary", "writing"], 1,
            "اكتب الفعل المصدر الانعكاسي في التعبير: _____ al tema (يتقيد بالموضوع):",
            "Para aprovechar al máximo los minutos finales, les ruego ceñirse al _____ central.",
            "للاستفادة القصوى من الدقائق الأخيرة، أرجو منكم التقيد بالموضوع المركزي.",
            ["ceñirse al tema"],
            ["tema"],
            "ceñirse al tema تعني التقيد التام بفحوى الموضوع وعدم الاستطراد خارجه."
        ),
        choice_ex(
            "ex-b2-gpr-3", "word_choice",
            "حدد العبارة الرسمية التي يعلن بها المحاضر عن بدء فقرة استقبال أسئلة الحاضرين",
            ["vocabulary"], 2,
            "ما هي العبارة التي تعلن بها عن فتح باب الأسئلة والمداخلات في ختام المحاضرة؟",
            "Con esto concluyo mi exposición y _____ de preguntas a todos los presentes.",
            "بهذا أختتم عرضي و... لطرح الأسئلة لجميع الحاضرين.",
            [
                opt("a", "abro el turno", "أفتح المجال وباب الأسئلة (الصواب)", True),
                opt("b", "levanto la sesión", "أرفع الجلسة نهائياً", False, "قبل رفع الجلسة نفتح باب الأسئلة: abro el turno de preguntas."),
                opt("c", "hago una concesión", "أقدم تنازلاً", False, "الافتتاح يسمى abrir el turno.")
            ],
            ["abrir el turno", "turno de preguntas", "agradecer la intervención"],
            "abrir el turno de preguntas هي العبارة المعتمدة لبدء تلقي استفسارات الجمهور."
        ),
        order_ex(
            "ex-b2-gpr-4",
            "رتّب الجملة اللبقة لإعادة صياغة استفسار السائل قبل الشروع في الإجابة",
            ["grammar", "writing"], 2,
            ["Permítame", "reformular", "su", "pregunta", "para", "asegurarme", "de", "entenderla"],
            "Permítame reformular su pregunta para asegurarme de entenderla",
            "الترتيب: الطلب المهذب Permítame reformular ثم المفعول su pregunta ثم الغرض para asegurarme de entenderla.",
            ["reformular", "agradecer la intervención"]
        ),
        choice_ex(
            "ex-b2-gpr-5", "listen_choose",
            "استمع للمتحدث وحدد عبارة الشكر والتقدير التي وجهها للسائل في المؤتمر",
            ["listening", "vocabulary"], 2,
            "استمع لرد المحاضر على السؤال من الصف الأول",
            "Muchas gracias por su intervención; ha tocado un punto verdaderamente fundamental.",
            "شكراً جزيلاً على مداخلتكم؛ لقد تطرقتم لنقطة جوهرية بحق.",
            [
                opt("a", "agradecer la intervención", "شكر السائل وتثمين مداخلته القيمة (الصواب)", True),
                opt("b", "criticar la pregunta", "نقد السؤال ورفضه", False, "المحاضر بدأ بـ: Muchas gracias por su intervención."),
                opt("c", "cerrar la sala", "إغلاق القاعة", False, "السلوك كان شكر المداخلة: agradecer la intervención.")
            ],
            ["agradecer la intervención", "turno de preguntas"],
            "المتحدث قال بتهذيب: 'Muchas gracias por su intervención'.",
            audioKey="pending/b2_gracias_intervencion_punto_fundamental.mp3",
            speechEs="Muchas gracias por su intervención; ha tocado un punto verdaderamente fundamental."
        ),
        speak_ex(
            "ex-b2-gpr-6",
            "انطق جملتك القيادية لإدارة فقرة الأسئلة بلباقة وتوجيه ذكي للوقت",
            ["speaking", "pronunciation"], 2,
            "انطق العبارة التالية لإدارة الحوار الختامي مع الجمهور بحكمة واحترافية:",
            "Agradezco enormemente su intervención; para ceñirnos al tiempo, abrimos el turno de preguntas breves.",
            "أشكركم جزيل الشكر على مداخلتكم؛ وللالتزام بالوقت المحدد، نفتح المجال للأسئلة الموجزة.",
            "pending/b2_agradezco_intervencion_turno_preguntas.mp3",
            ["agradecer la intervención", "ceñirse al tema", "abrir el turno", "turno de preguntas"],
            "Agradezco enormemente su intervención; para ceñirnos al tiempo, abrimos el turno de preguntas breves.",
            "انتبه لنطق ceñirnos al tiempo و turno de preguntas بابتسامة ولباقة وثقة."
        )
    ]
    return lesson_doc(doc, exs, level="B2")


def make_lesson_conclusion_llamada_accion():
    slug = "b2-conclusion-llamada-accion"
    doc = {
        "slug": slug,
        "unitSlug": "b2-u8-presentations",
        "levelCode": "B2",
        "titleAr": "خاتمة العرض والدعوة للعمل: ترك أثر باقٍ لدى الجمهور",
        "titleEs": "Conclusión de presentaciones y llamada a la acción (Call to Action): Cierre memorable",
        "subtitleAr": "تلخيص الرسالة الجوهرية (takeaway message)، الإلهام، وتوديع الجمهور بحفاوة",
        "order": 4,
        "estimatedMinutes": 20,
        "cefrLevel": "B2",
        "review": review_block(),
        "pedagogy": {
            "learningObjectivesAr": [
                "أن يختتم المتعلم عرضه التقديمي بخاتمة ملهمة وقوية لا تُنسى.",
                "أن يصيغ دعوة صريحة ومقنعة للعمل (Llamada a la acción / Call to action).",
                "أن يلخص فكرته المحورية في عبارة واحدة مكثفة ونافذة (mensaje clave)."
            ],
            "grammarPoints": [
                {
                    "titleAr": "التراكيب البلاغية والتحفيزية لخاتمة العروض",
                    "explanationAr": "1. **صياغة الفكرة الجوهرية المكثفة (El mensaje clave)**:\n- *Si solo pudieran quedarse con una idea de hoy, me gustaría que fuera esta...*\n- *La conclusión fundamental que debemos extraer es que el cambio depende de nosotros*.\n2. **الدعوة المؤثرة للعمل (Llamada a la acción / Call to Action)**:\n- استخدام صيغة الأمر الشامل للجميع بـ *Nosotros* أو صيغة الحث:\n- *No esperemos al mañana: demos el paso hoy mismo hacia la sostenibilidad*.\n- *Les invito a sumarse a esta iniciativa transformadora*.\n3. **عبارة الوداع والامتنان الختامية**:\n- *Ha sido un verdadero placer; muchísimas gracias por su atención y entusiasmo*."
                }
            ],
            "commonMistakesAr": [
                "إنهاء العرض فجأة بعبارة ضعيفة مثل *Ya está* أو *Eso era todo*; الخاتمة هي آخر ما ينطبع في ذاكرة الجمهور ويجب أن تكون في قمة القوة.",
                "تقديم نقاط جديدة تماماً في الخاتمة بدلاً من تركيز الرسالة المحورية ودعوة الحاضرين للتطبيق العملي."
            ],
            "dialectNotes": [
                {
                    "region": "EG",
                    "noteAr": "في قفلة البريزنتيشن بنقول «لو هتخرجوا بكلمة واحدة من النهاردة خليها دي، وعايز كل واحد فيكم يبدأ يطبق من بكرة». بالإسبانية: Si solo se quedan con una idea, que sea esta: el momento de actuar es ahora. ¡Muchas gracias!"
                }
            ],
            "culturalNoteAr": "الخطباء الإسبان واللاتينيون يميلون لاختتام أحاديثهم باقتباس شعري أو حكمة تاريخية عميقة لإضفاء صبغة وجدانية وفكرية راقية على العرض."
        },
        "contentBlocks": [
            {
                "id": f"cb-{slug}-intro",
                "type": "explanation",
                "titleAr": "عناصر الختام الاستثنائي للعرض",
                "bodyAr": "أدوات الخاتمة القوية:\n- **la llamada a la acción (call to action)**: الدعوة الصريحة للعمل والتحرك الفوري\n- **el mensaje clave**: الرسالة الجوهرية والفكرة المركزية المستخلصة\n- **el cierre memorable**: الخاتمة التي لا تُنسى وتترك صدى عميقاً في الأذهان\n- **dar el paso**: يتخذ الخطوة ويبادر بالفعل الإيجابي\n- **sumarse a la iniciativa**: ينضم للمبادرة ويشارك فيها بحماس\n- **el broche de oro**: مسك الختام واللمسة الختامية الذهبية",
                "examples": [
                    {"es": "El ponente puso el broche de oro a su conferencia con una emotiva llamada a la acción.", "ar": "وضع المحاضر مسك الختام لمؤتمره بدعوة مؤثرة للعمل والتحرك."},
                    {"es": "El mensaje clave de esta charla es que la innovación debe ser inclusiva.", "ar": "الرسالة الجوهرية لهذه المحاضرة هي أن الابتكار يجب أن يكون شاملاً للجميع."},
                    {"es": "Les invito formalmente a dar el paso y liderar juntos este cambio.", "ar": "أدعوكم رسمياً لاتخاذ الخطوة وقيادة هذا التغيير معاً."}
                ]
            }
        ],
        "newVocabulary": ["llamada a la acción", "mensaje clave", "cierre memorable", "dar el paso", "sumarse", "broche de oro"],
        "reviewVocabulary": ["conclusión", "gracias"]
    }

    exs = [
        choice_ex(
            "ex-b2-cla-1", "word_choice",
            "اختر المفهوم الخطابي الذي يعني توجيه دعوة صريحة ومحفزة للجمهور للتحرك والتطبيق",
            ["vocabulary"], 1,
            "ماذا نسمي الدعوة الختامية التي تحث المستمعين على اتخاذ إجراء فوري؟",
            "Toda presentación persuasiva debe concluir con una clara y contundente _____.",
            "يجب أن يختتم كل عرض إقناعي بـ ... واضحة وقاطعة.",
            [
                opt("a", "llamada a la acción", "دعوة صريحة للعمل والتحرك (الصواب)", True),
                opt("b", "anécdota", "طرفة عابرة", False, "الخاتمة المحفزة تسمى llamada a la acción."),
                opt("c", "rescisión", "فسخ عقد", False, "المصطلح الخطابي هو llamada a la acción.")
            ],
            ["llamada a la acción", "mensaje clave"],
            "la llamada a la acción (call to action) هي التحفيز الختامي الذي يدعو الجمهور لترجمة الأفكار إلى خطوات عملية."
        ),
        fill_ex(
            "ex-b2-cla-2",
            "أكمل بالتعبير الاصطلاحي الإسباني الذي يعني 'وضع مسك الختام': el broche de _____",
            ["vocabulary", "writing"], 1,
            "اكتب الكلمة الناقصة في التعبير: el broche de _____ (مسك الختام المتوج للحدث):",
            "La ovación unánime del auditorio puso el broche de _____ a tres días de intensos debates.",
            "وضع التصفيق الحار بالإجماع من الجمهور مسك ... لثلاثة أيام من المناقشات المكثفة.",
            ["broche de oro"],
            ["oro"],
            "poner el broche de oro هو التعبير الاصطلاحي لوضع مسك الختام والتتويج الأرقى للحدث."
        ),
        choice_ex(
            "ex-b2-cla-3", "word_choice",
            "حدد التعبير الذي يعني الفكرة المركزية الجوهرية التي يراد للجمهور حفظها والرجوع بها",
            ["vocabulary"], 2,
            "ما هي العبارة التي تدل على 'الخلاصة الأساسية ومغزى الحديث كله'؟",
            "Si han de recordar una sola idea de mi intervención, que sea este _____ transformador.",
            "إذا كان لكم أن تتذكروا فكرة واحدة فقط من مداخلتي، فلتكن هذه ... التغييرية.",
            [
                opt("a", "mensaje clave", "الرسالة الجوهرية المركزية (الصواب)", True),
                opt("b", "sesgo", "انحياز", False, "الفكرة الأساسية تسمى el mensaje clave."),
                opt("c", "acta", "محضر اجتماع", False, "الخلاصة هي el mensaje clave.")
            ],
            ["mensaje clave", "cierre memorable", "dar el paso"],
            "el mensaje clave (takeaway) هو الرسالة الذهبية المركزة التي تلخص هدف العرض كله."
        ),
        order_ex(
            "ex-b2-cla-4",
            "رتّب الجملة التحفيزية لحث الجمهور على اتخاذ الخطوة الإيجابية معاً",
            ["grammar", "writing"], 2,
            ["Les", "invito", "a", "dar", "el", "paso", "hacia", "el", "futuro"],
            "Les invito a dar el paso hacia el futuro",
            "الترتيب: الضمير Les ثم الفعل invito ثم حرف الجر a ثم التعبير المصدر dar el paso ثم شبه الجملة hacia el futuro.",
            ["dar el paso", "sumarse"]
        ),
        choice_ex(
            "ex-b2-cla-5", "listen_choose",
            "استمع للمتحدث في اللحظات الأخيرة وحدد نوع الخاتمة التي استطاع تحقيقها",
            ["listening", "vocabulary"], 2,
            "استمع لتصفيق الجمهور بعد الكلمات الأخيرة للمحاضر",
            "Con unas palabras cargadas de esperanza y convicción, logró un cierre verdaderamente memorable.",
            "بكلمات مفعمة بالأمل واليقين، نجح في تحقيق خاتمة لا تُنسى بحق.",
            [
                opt("a", "cierre memorable", "خاتمة لا تُنسى ومؤثرة في الأذهان (الصواب)", True),
                opt("b", "corte técnico", "انقطاع تقني مفاجئ", False, "التقرير وصفها بـ cierre verdaderamente memorable."),
                opt("c", "disculpa vacía", "اعتذار فارغ", False, "الوصف كان cierre memorable.")
            ],
            ["cierre memorable", "llamada a la acción"],
            "المتحدث قال: 'logró un cierre verdaderamente memorable'.",
            audioKey="pending/b2_cierre_verdaderamente_memorable.mp3",
            speechEs="Con unas palabras cargadas de esperanza y convicción, logró un cierre verdaderamente memorable."
        ),
        speak_ex(
            "ex-b2-cla-6",
            "انطق خاتمتك الخطابية الملهمة بنبرة حماسية ومؤثرة تحث الجمهور على الفعل",
            ["speaking", "pronunciation"], 2,
            "انطق الجملة التالية كقائد يختتم كلمته الرئيسية في الملتقى السنوي:",
            "Este es nuestro mensaje clave: les invito a dar el paso, sumarse a esta visión y poner el broche de oro al proyecto.",
            "هذه هي رسالتنا الجوهرية: أدعوكم لاتخاذ الخطوة، والانضمام إلى هذه الرؤية ووضع مسك الختام للمشروع.",
            "pending/b2_mensaje_clave_dar_paso_broche_oro.mp3",
            ["mensaje clave", "dar el paso", "sumarse", "broche de oro"],
            "Este es nuestro mensaje clave: les invito a dar el paso, sumarse a esta visión y poner el broche de oro al proyecto.",
            "انتبه لنطق mensaje clave و dar el paso و broche de oro بنبرة احتفالية ملهمة ومؤثرة."
        )
    ]
    return lesson_doc(doc, exs, level="B2")


# ==============================================================================
# UNIT 9: b2-u9-formal-writing (المراسلات الرسمية والشكاوى والعرائض الإدارية)
# ==============================================================================

def make_lesson_reclamaciones_juridicas_instancias():
    slug = "b2-reclamaciones-juridicas-instancias"
    doc = {
        "slug": slug,
        "unitSlug": "b2-u9-formal-writing",
        "levelCode": "B2",
        "titleAr": "العرائض الرسمية والشكاوى القانونية: مخاطبة الإدارات الحكومية",
        "titleEs": "Instancias administrativas y reclamaciones jurídicas: Lenguaje procedimental",
        "subtitleAr": "صيغة الطلب الرسمي (Expone / Solicita)، التظلمات الإدارية، والمرافعة الشكلية",
        "order": 1,
        "estimatedMinutes": 20,
        "cefrLevel": "B2",
        "review": review_block(),
        "pedagogy": {
            "learningObjectivesAr": [
                "أن يحرر المتعلم عريضة رسمية (Instancia administrativa) متوافقة مع الإجراءات القانونية الإسبانية.",
                "أن يتقن الهيكل الثنائي الشهير: EXPONE (حيثيات الواقعة) و SOLICITA (الطلبات النظامية).",
                "أن يوظف مصطلحات القانون الإداري: interponer un recurso, plazo de alegaciones, silencio administrativo, providencia."
            ],
            "grammarPoints": [
                {
                    "titleAr": "البنية الإلزامية للعريضة الإدارية في النظام الإسباني",
                    "explanationAr": "1. **ديباجة التعريف بمقدم الطلب**:\n- *Don/Doña [Nombre], mayor de edad, con DNI/NIE n.º [X], con domicilio a efectos de notificaciones en... ante este organismo comparece y*\n2. **قسم الحيثيات والوقائع (EXPONE)**:\n- *PRIMERO.- Que con fecha de... le fue denegada la solicitud...*\n- *SEGUNDO.- Que dicha resolución contraviene lo dispuesto en el artículo...*\n3. **قسم المطالب القانونية (SOLICITA)**:\n- *SOLICITA: Que teniendo por presentado este escrito, se sirva admitirlo a trámite y declare la nulidad de...*"
                }
            ],
            "commonMistakesAr": [
                "خلط الحيثيات بالأسباب؛ خانة EXPONE تسرد الوقائع بموضوعية (Que ocurrió tal cosa)، بينما خانة SOLICITA تقتصر على ما تطلبه من الإدارة حصراً.",
                "نسيان عبارة الاختتام الإلزامية في العرائض الإسبانية: *Es justicia que pide en [Ciudad], a [Fecha]*."
            ],
            "dialectNotes": [
                {
                    "region": "EG",
                    "noteAr": "في المصالح الحكومية الإسبانية كتابة الطلب أو التظلم الرسمي ليها قالب صارم: بتعرف نفسك وتكتب EXPONE (حيث إنه حصل كذا) وبعدين SOLICITA (لذلك أرجو التكرم بالموافقة على كذا). بالإسبانية: Se redacta formalmente con EXPONE y SOLICITA."
                }
            ],
            "culturalNoteAr": "الإدارة العامة في إسبانيا تخضع لقانون المسطرة الإدارية المشتركة (Ley 39/2015 del Procedimiento Administrativo Común)، والتي تحدد القواعد الشكلية لإيداع العرائض والطعون."
        },
        "contentBlocks": [
            {
                "id": f"cb-{slug}-intro",
                "type": "explanation",
                "titleAr": "هيكل العريضة والتظلم الإداري الرسمي",
                "bodyAr": "المفاهيم القانونية والإجرائية:\n- **la instancia administrativa**: العريضة والطلب الرسمي المقدم لسلطة عامة\n- **el EXPONE**: قسم عرض الوقائع والأسانيد التي يستند إليها الطلب\n- **el SOLICITA**: قسم تحديد المطالب المرجو صدور قرار بشأنها\n- **admitir a trámite**: قبول العريضة شكلاً وبدء إجراءات فحصها الإداري\n- **interponer un recurso**: تقديم طعن وتظلم قانوني ضد قرار صادر\n- **el silencio administrativo**: الصمت والسكوت الإداري بعد انقضاء المهلة القانونية",
                "examples": [
                    {"es": "El ciudadano presentó una instancia administrativa solicitando la revisión del expediente.", "ar": "قدم المواطن عريضة إدارية يطلب فيها مراجعة ملف قضيته."},
                    {"es": "En el apartado EXPONE se detallan los antecedentes de hecho que motivan el escrito.", "ar": "في قسم 'يعرض' (EXPONE) تُفصل السوابق الواقعية الدافعة لكتابة المذكرة."},
                    {"es": "El juzgado acordó admitir a trámite el recurso contencioso interpuesto.", "ar": "قررت المحكمة قبول الطعن القضائي المودع شكلاً وبدء النظر فيه."}
                ]
            }
        ],
        "newVocabulary": ["instancia", "EXPONE", "SOLICITA", "admitir a trámite", "interponer un recurso", "silencio administrativo"],
        "reviewVocabulary": ["documento", "derecho"]
    }

    exs = [
        choice_ex(
            "ex-b2-rji-1", "word_choice",
            "اختر القسم في العريضة الإدارية المخصص لعرض الوقائع والأسانيد التي يستند إليها المواطن",
            ["vocabulary"], 1,
            "تحت أي عنوان نكتب حيثيات وسوابق المشكلة في العريضة الرسمية الإسبانية؟",
            "En el apartado _____, el solicitante expone cronológicamente los hechos ocurridos.",
            "في قسم ...، يعرض مقدم الطلب زمنياً الوقائع التي حدثت.",
            [
                opt("a", "EXPONE", "قسم عرض الحيثيات والوقائع (الصواب)", True),
                opt("b", "SOLICITA", "قسم المطالب فقط", False, "الوقائع تعرض في قسم EXPONE."),
                opt("c", "BIBLIOGRAFÍA", "المراجع", False, "في العريضة الرسمية نستخدم EXPONE.")
            ],
            ["EXPONE", "SOLICITA", "instancia"],
            "EXPONE هو العنوان الإجرائي الإلزامي لسرد الوقائع التي بنيت عليها العريضة."
        ),
        fill_ex(
            "ex-b2-rji-2",
            "أكمل بالتعبير القانوني الذي يعني قبول الطلب شكلاً وبدء فحصه: admitir a _____",
            ["vocabulary", "writing"], 1,
            "اكتب الكلمة الناقصة في التعبير الإداري: admitir a _____ (قبول المعاملة للنظر فيها):",
            "El ministerio decidió admitir a _____ la reclamación presentada por los afectados.",
            "قررت الوزارة قبول الشكوى المقدمة من المتضررين شكلاً وبدء فحصها النظامي.",
            ["admitir a trámite"],
            ["trámite", "tramite"],
            "admitir a trámite تعني قبول العريضة شكلياً والبدء في الإجراءات القانونية لفحصها."
        ),
        choice_ex(
            "ex-b2-rji-3", "word_choice",
            "حدد المصطلح القانوني الذي يعني الطعن والتظلم الرسمي ضد قرار صادر من جهة إدارية",
            ["vocabulary"], 2,
            "ما هو التعبير القانوني المعتمد لـ 'تقديم طعن رسمي ضد قرار إداري جائر'؟",
            "El afectado dispone de un mes de plazo para _____ de alzada ante el superior jerárquico.",
            "أمام المتضرر مهلة شهر لـ ... استئنافي أمام الرئيس الإداري الأعلى.",
            [
                opt("a", "interponer un recurso", "تقديم طعن وتظلم قانوني (الصواب)", True),
                opt("b", "hacer una metáfora", "صنع استعارة", False, "الطعن الإداري يسمى interponer un recurso."),
                opt("c", "firmar la paz", "توقيع السلام", False, "المصطلح القانوني هو interponer un recurso.")
            ],
            ["interponer un recurso", "instancia", "silencio administrativo"],
            "interponer un recurso تعني إيداع طعن واستئناف رسمي ضد قرار إداري."
        ),
        order_ex(
            "ex-b2-rji-4",
            "رتّب الجملة الإجرائية لتقديم طلب إداري رسمي للمحافظة",
            ["grammar", "writing"], 2,
            ["Presentó", "una", "instancia", "administrativa", "ante", "el", "ayuntamiento"],
            "Presentó una instancia administrativa ante el ayuntamiento",
            "الترتيب: الفعل Presentó ثم المفعول una instancia administrativa ثم شبه الجملة ante el ayuntamiento.",
            ["instancia", "EXPONE"]
        ),
        choice_ex(
            "ex-b2-rji-5", "listen_choose",
            "استمع للمستشار الإداري وحدد الأثر القانوني المترتب على عدم رد الإدارة خلال المهلة",
            ["listening", "vocabulary"], 2,
            "استمع لشرح المحامي لحالة غياب الرد من البلدية",
            "Al no recibir contestación en seis meses, opera la figura del silencio administrativo negativo.",
            "عند عدم تلقي رد خلال ستة أشهر، تسري قاعدة الصمت الإداري المعتبر بمثابة رفض.",
            [
                opt("a", "silencio administrativo", "قاعدة السكوت والصمت الإداري القانونية (الصواب)", True),
                opt("b", "acuerdo verbal", "اتفاق شفهي غير موثق", False, "المحامي أشار إلى: el silencio administrativo."),
                opt("c", "consenso pleno", "توافق تام", False, "الحالة هي الصمت الإداري silencio administrativo.")
            ],
            ["silencio administrativo", "admitir a trámite"],
            "المستشار قال بوضوح: 'opera la figura del silencio administrativo'.",
            audioKey="pending/b2_silencio_administrativo_negativo.mp3",
            speechEs="Al no recibir contestación en seis meses, opera la figura del silencio administrativo negativo."
        ),
        speak_ex(
            "ex-b2-rji-6",
            "انطق صيغة المطلب الإداري الرسمي كما تُتلى في المحاكم والمصالح الحكومية",
            ["speaking", "pronunciation"], 2,
            "انطق الجملة التالية كصيغة اختتام قانونية لعريضة تظلم إداري:",
            "Por todo ello, SOLICITA que se admita a trámite esta instancia y se declare nula la sanción impuesta.",
            "بناءً على كل ما تقدم، يُلتمس قبول هذه العريضة شكلاً وإعلان بطلان العقوبة المفروضة.",
            "pending/b2_solicita_admita_tramite_instancia.mp3",
            ["SOLICITA", "admitir a trámite", "instancia", "EXPONE"],
            "Por todo ello, SOLICITA que se admita a trámite esta instancia y se declare nula la sanción impuesta.",
            "انتبه لنطق SOLICITA و se admita a trámite بنبرة قانونية صارمة وفصيحة."
        )
    ]
    return lesson_doc(doc, exs, level="B2")


def make_lesson_carta_motivacion_becas_empleo():
    slug = "b2-carta-motivacion-becas-empleo"
    doc = {
        "slug": slug,
        "unitSlug": "b2-u9-formal-writing",
        "levelCode": "B2",
        "titleAr": "خطاب الدافع للمنح والوظائف العليا: التميز وإبراز القيمة",
        "titleEs": "La carta de motivación para becas y puestos de alta cualificación: Persuasión y perfil",
        "subtitleAr": "صياغة الغايات الأكاديمية والمهنية، التوفيق بين السيرة ومتطلبات الجهة المانحة",
        "order": 2,
        "estimatedMinutes": 20,
        "cefrLevel": "B2",
        "review": review_block(),
        "pedagogy": {
            "learningObjectivesAr": [
                "أن يحرر المتعلم خطاب دافع (Carta de motivación) مقنعاً وتنافسياً لطلب منحة أو وظيفة عليا.",
                "أن يوظف عبارات إبراز الكفاءة والشغف: idoneidad, vocación investigadora, encajar en el perfil, trayectoria sólida.",
                "أن يربط إنجازاته السابقة بالأهداف الاستراتيجية للمؤسسة أو الجامعة المانحة."
            ],
            "grammarPoints": [
                {
                    "titleAr": "التراكيب البلاغية والذاتية في خطابات الدافع التنافسية",
                    "explanationAr": "1. **إبراز الملاءمة التامة للمنصب (Idoneidad)**:\n- *Considero que mi perfil profesional y académico se ajusta con precisión a los requisitos de la convocatoria*.\n- *Mi sólida trayectoria en el sector comercial me avala para asumir esta responsabilidad*.\n2. **التعبير عن الدافع والشغف المهني**:\n- *Lo que me impulsa a solicitar esta prestigiosa beca es mi profunda vocación por la investigación en...*\n- *Esta oportunidad representaría un hito decisivo en mi desarrollo profesional*.\n3. **عرض القيمة المضافة التي سيقدمها المرشح**:\n- *Estoy convencido/a de que puedo aportar una visión innovadora y un firme compromiso con la excelencia*."
                }
            ],
            "commonMistakesAr": [
                "تكرار بيانات السيرة الذاتية سردياً؛ خطاب الدافع وُجد لتفسير 'لماذا أنت؟ ولماذا هذه الجهة؟' وليس لسرد التواريخ المذكورة في الـ CV.",
                "استخدام نبرة توسل غير احترافية بدلاً من لغة الثقة المتزنة والشغف العلمي المؤسسي."
            ],
            "dialectNotes": [
                {
                    "region": "EG",
                    "noteAr": "في جواب الدافع للمنحة بنقول «أنا بقدم عشان دراستي وخبرتي متفصلين على شروط المنحة، وعندي طموح أعمل أبحاث تفيد المجتمع». بالإسبانية: Solicito esta beca porque mi perfil y mi vocación investigadora encajan plenamente con los objetivos de su institución."
                }
            ],
            "culturalNoteAr": "لجان الاختيار الإسبانية تفضل خطابات الدافع التي لا تتجاوز صفحة واحدة A4 (un folio) مكتوبة بفقرات متوازنة وخط رسمي مقروء."
        },
        "contentBlocks": [
            {
                "id": f"cb-{slug}-intro",
                "type": "explanation",
                "titleAr": "ركائز خطاب الدافع المتميز",
                "bodyAr": "المفاهيم التنافسية:\n- **la carta de motivación**: خطاب الدافع الموجه للجان الانتقاء والقبول\n- **la idoneidad**: الأهلية والملاءمة التامة للمنصب أو المنحة\n- **la vocación investigadora**: الشغف العلمي والميل الصادق للبحث الأكاديمي\n- **encajar en el perfil**: يطابق الشروط والمواصفات المطلوبة تماماً\n- **la trayectoria sólida**: المسار المهني والأكاديمي الراسخ والحافل بالإنجازات\n- **la convocatoria**: الإعلان الرسمي عن فتح باب الترشح للمنح أو الوظائف",
                "examples": [
                    {"es": "Mi formación académica y mi experiencia avalan mi idoneidad para esta prestigiosa beca.", "ar": "تزكي خلفيتي الأكاديمية وخبرتي أهليتي التامة لهذه المنحة المرموقة."},
                    {"es": "Mi perfil encaja a la perfección con los requisitos exigidos en la convocatoria pública.", "ar": "يطابق ملفي شروط الإعلان الرسمي العام بدقة متناهية."},
                    {"es": "Esta maestría supondrá un hito fundamental en mi trayectoria científica.", "ar": "ستمثل دراسة الماجستير هذه محطة فارقة في مساري العلمي."}
                ]
            }
        ],
        "newVocabulary": ["carta de motivación", "idoneidad", "vocación investigadora", "encajar en el perfil", "trayectoria sólida", "convocatoria"],
        "reviewVocabulary": ["beca", "experiencia"]
    }

    exs = [
        choice_ex(
            "ex-b2-cmb-1", "word_choice",
            "اختر الكلمة التي تعني الأهلية والملاءمة العالية للمنصب المتقدم له",
            ["vocabulary"], 1,
            "ما هو المصطلح الذي يدل على 'مطابقة المؤهلات والصفات لمتطلبات الوظيفة'؟",
            "El tribunal evaluador destacó la indiscutible _____ del candidato seleccionado.",
            "أشادت لجنة التقييم بـ ... التي لا جدال فيها للمرشح المختار.",
            [
                opt("a", "idoneidad", "الأهلية والملاءمة التامة (الصواب)", True),
                opt("b", "desolación", "وحشة وخيبة أمل", False, "الأهلية والكفاءة تسمى la idoneidad."),
                opt("c", "falacia", "مغالطة", False, "المصطلح الإداري هو la idoneidad.")
            ],
            ["idoneidad", "carta de motivación"],
            "la idoneidad هي الأهلية والكفاءة والملاءمة النموذجية لشغل وظيفة أو نيل منحة."
        ),
        fill_ex(
            "ex-b2-cmb-2",
            "أكمل بالمصطلح الذي يعني إعلان فتح باب الترشح: la _____ pública",
            ["vocabulary", "writing"], 1,
            "اكتب الكلمة المؤنثة الناقصة: la _____ de becas (إعلان مسابقة المنح):",
            "Los plazos de entrega de solicitudes se detallan en las bases de la _____ oficial.",
            "مواعيد تقديم الطلبات مفصلة في شروط وضوابط ... الرسمية.",
            ["convocatoria"],
            ["convocatoria"],
            "la convocatoria هي الإعلان والدعوة الرسمية لفتح باب التقدم لمسابقة أو وظيفة."
        ),
        choice_ex(
            "ex-b2-cmb-3", "word_choice",
            "حدد التعبير الذي يعني الشغف الفطري والتوجه الصادق نحو البحث العلمي",
            ["vocabulary"], 2,
            "ما هي العبارة التي تعبر عن 'الحب العميق والدافع الذاتي لمواصلة الاستقصاء الأكاديمي'؟",
            "Desde la universidad he sentido una profunda _____ que me llevó a publicar artículos.",
            "منذ مرحلة دراستي الجامعية وأنا أشعر بـ ... عميق دفعني لنشر مقالات بحثية.",
            [
                opt("a", "vocación investigadora", "الشغف والميل الصادق للبحث العلمي (الصواب)", True),
                opt("b", "sanción disuasoria", "عقوبة رادعة", False, "الشغف العلمي يسمى vocación investigadora."),
                opt("c", "congoja", "غصة حزن", False, "التعبير الدقيق هو vocación investigadora.")
            ],
            ["vocación investigadora", "trayectoria sólida", "encajar en el perfil"],
            "la vocación investigadora هي الدافع والشغف الذاتي المخلص للبحث والاستكشاف العلمي."
        ),
        order_ex(
            "ex-b2-cmb-4",
            "رتّب الجملة لإبراز مطابقة مؤهلاتك لشروط المنحة في خطاب الدافع",
            ["grammar", "writing"], 2,
            ["Mi", "perfil", "académico", "encaja", "con", "los", "requisitos", "exigidos"],
            "Mi perfil académico encaja con los requisitos exigidos",
            "الترتيب: المبتدأ Mi perfil académico ثم الفعل encaja ثم شبه الجملة con los requisitos exigidos.",
            ["encajar en el perfil", "convocatoria"]
        ),
        choice_ex(
            "ex-b2-cmb-5", "listen_choose",
            "استمع لرئيس لجنة المنح وحدد العامل الحاسم الذي أهّل المرشح للفوز",
            ["listening", "vocabulary"], 2,
            "استمع لتقييم لجنة التحكيم لخطابات الدافع المقدمة",
            "Decidimos conceder la beca a la candidata por su trayectoria sólida y su clara vocación.",
            "قررنا منح المنحة للمرشحة نظراً لمسارها الراسخ وشغفها الواضح بالبحث.",
            [
                opt("a", "trayectoria sólida", "مسار مهني وأكاديمي راسخ وحافل (الصواب)", True),
                opt("b", "edad avanzada", "سن متقدمة", False, "السبب كان: su trayectoria sólida y su clara vocación."),
                opt("c", "suerte fortuita", "حظ مصادفة", False, "المعيار كان المسار الراسخ trayectoria sólida.")
            ],
            ["trayectoria sólida", "vocación investigadora"],
            "رئيس اللجنة قال: 'por su trayectoria sólida y su clara vocación'.",
            audioKey="pending/b2_conceder_beca_trayectoria_solida.mp3",
            speechEs="Decidimos conceder la beca a la candidata por su trayectoria sólida y su clara vocación."
        ),
        speak_ex(
            "ex-b2-cmb-6",
            "انطق عبارتك التنافسية في خطاب الدافع باعتزاز واثق واستعداد للإسهام في التميز",
            ["speaking", "pronunciation"], 2,
            "انطق الجملة التالية لبيان أهليتك وشغفك في المقابلة أو الخطاب التنافسي:",
            "Mi trayectoria sólida avala mi idoneidad para esta convocatoria y deseo aportar todo mi potencial a su equipo.",
            "يزكي مساري الراسخ أهليتي لهذه المسابقة، وأرغب في تقديم كامل طاقتي وإمكاناتي لفريقكم.",
            "pending/b2_trayectoria_avala_idoneidad_convocatoria.mp3",
            ["trayectoria sólida", "idoneidad", "convocatoria", "encajar en el perfil"],
            "Mi trayectoria sólida avala mi idoneidad para esta convocatoria y deseo aportar todo mi potencial a su equipo.",
            "انتبه لنطق trayectoria sólida و idoneidad بنبرة تنبض بالحماس الرصين والثقة."
        )
    ]
    return lesson_doc(doc, exs, level="B2")


def make_lesson_comunicacion_institucional_diplomatica():
    slug = "b2-comunicacion-institucional-diplomatica"
    doc = {
        "slug": slug,
        "unitSlug": "b2-u9-formal-writing",
        "levelCode": "B2",
        "titleAr": "التواصل المؤسسي والدبلوماسي: مخاطبة الهيئات الرسمية والسفارات",
        "titleEs": "Comunicación institucional y diplomática: Protocolo, notas verbales y cortesía ceremonial",
        "subtitleAr": "المراسلات بين المؤسسات الدستورية والسفارات، ألقاب التشريف، والمذكرات الرسمية",
        "order": 3,
        "estimatedMinutes": 20,
        "cefrLevel": "B2",
        "review": review_block(),
        "pedagogy": {
            "learningObjectivesAr": [
                "أن يكتب المتعلم مذكرة رسمية أو خطاباً بروتوكولياً موجهاً لهيئة دبلوماسية أو دستورية.",
                "أن يطبق قواعد ألقاب التشريف الرسمية: Excelentísimo/a Señor/a (Excmo./a Sr./a), Ilustrísimo/a Señor/a.",
                "أن يوظف صيغة الغائب الدبلوماسية (Nota verbal): La Embajada aprovecha la oportunidad para reiterar..."
            ],
            "grammarPoints": [
                {
                    "titleAr": "الصيغ الدبلوماسية الثابتة في المذكرات الشفهية والمراسلات الرسمية",
                    "explanationAr": "1. **صيغة الافتتاح في المذكرات الدبلوماسية (Nota Verbal)**:\n- استخدام صيغة الغائب المجردة دائماً:\n- *La Embajada de España saluda atentamente al Ministerio de Asuntos Exteriores y tiene el honor de comunicarle...*\n2. **ألقاب التشريف القانونية في المراسلات الإسبانية**:\n- **Excelentísimo/a Señor/a (Excmo./a Sr./a)**: مخصصة للوزراء، السفراء، نواب البرلمان ورؤساء المحاكم العليا.\n- **Ilustrísimo/a Señor/a (Ilmo./a Sr./a)**: للمديرين العامين وعمداء الكليات وأعضاء الهيئات القضائية.\n3. **الصيغة الختامية الدبلوماسية المعتمدة عالمياً**:\n- *Aprovecha la oportunidad para reiterar las seguridades de su más distinguida consideración*."
                }
            ],
            "commonMistakesAr": [
                "استخدام ضمير المتكلم (yo أو nosotros) في المذكرة الدبلوماسية؛ المذكرة الدبلوماسية تُحرر دوماً بصيغة الغائب المجرد (La Embajada saluda...).",
                "الخلط في استخدام ألقاب التشريف الرسمية واختصاراتها المعتمدة في الدولة."
            ],
            "dialectNotes": [
                {
                    "region": "EG",
                    "noteAr": "في المخاطبات الدبلوماسية والسفارات بنستخدم الألقاب الرسمية زي «معالي السفير» و«سعادة الوزير» وبنختم بـ «وتفضلوا بقبول فائق الاحترام والتقدير». بالإسبانية: Excelentísimo Señor Embajador... reitera las seguridades de su más distinguida consideración."
                }
            ],
            "culturalNoteAr": "البروتوكول الإسباني (Protocolo del Estado) تحكمه مراسيم ملكية دقيقة تحدد أسبقية السلطات وألقاب التعظيم الدستورية الملزمة في كافة المكاتبات الحكومية."
        },
        "contentBlocks": [
            {
                "id": f"cb-{slug}-intro",
                "type": "explanation",
                "titleAr": "قواعد التحرير الدبلوماسي والمؤسسي",
                "bodyAr": "أهم التراكيب البروتوكولية:\n- **la nota verbal**: المذكرة الرسمية الدبلوماسية المتبادلة بين السفارات والوزارات\n- **Excelentísimo/a Señor/a (Excmo./a Sr./a)**: لقب التعظيم الدستوري لأصحاب المعالي الوزراء والسفراء\n- **el cuerpo diplomático**: السلك الدبلوماسي المعتمد في الدولة\n- **reiterar las seguridades de su consideración**: يجدد الإعراب عن فائق الاحترام والتقدير الدبلوماسي\n- **tener el honor de**: يتشرف بـ\n- **el protocolo ceremonial**: قواعد المراسم والتشريفات الرسمية للدولة",
                "examples": [
                    {"es": "La Embajada tiene el honor de remitir adjunta la nota verbal correspondiente.", "ar": "تتشرف السفارة بأن ترسل طياً المذكرة الدبلوماسية المعنية."},
                    {"es": "El escrito fue dirigido al Excmo. Sr. Ministro de Asuntos Exteriores.", "ar": "وُجّه الخطاب إلى معالي وزير الشؤون الخارجية الموقر."},
                    {"es": "Aprovecha la ocasión para reiterar las seguridades de su más alta consideración.", "ar": "تغتنم هذه المناسبة لتجدد الإعراب عن أسمى آيات التقدير والاحترام."}
                ]
            }
        ],
        "newVocabulary": ["nota verbal", "Excelentísimo Señor", "cuerpo diplomático", "distinguida consideración", "tener el honor de", "protocolo"],
        "reviewVocabulary": ["gobierno", "ministro"]
    }

    exs = [
        choice_ex(
            "ex-b2-cid-1", "word_choice",
            "اختر الوثيقة الدبلوماسية الرسمية المتبادلة بين السفارة ووزارة الخارجية المكتوبة بصيغة الغائب",
            ["vocabulary"], 1,
            "ماذا نسمي المراسلة الدبلوماسية المكتوبة بصيغة الغائب المجرد التي تنتهي بعبارة 'أسمى آيات التقدير'؟",
            "La delegación extranjera remitió una _____ solicitando una reunión bilateral urgente.",
            "أرسلت البعثة الأجنبية ... تطلب فيها عقد اجتماع ثنائي عاجل.",
            [
                opt("a", "nota verbal", "المذكرة الدبلوماسية الرسمية (الصواب)", True),
                opt("b", "trama", "حبكة قصة", False, "المراسلة الدبلوماسية تسمى nota verbal."),
                opt("c", "orden del día", "جدول أعمال", False, "الوثيقة هي la nota verbal.")
            ],
            ["nota verbal", "protocolo"],
            "la nota verbal هي المذكرة الرسمية المتبادلة في الأعراف الدبلوماسية بين البعثات والوزارات."
        ),
        fill_ex(
            "ex-b2-cid-2",
            "أكمل بالتعبير الدبلوماسي الفصيح للشرف والاعتزاز: tener el _____ de",
            ["vocabulary", "writing"], 1,
            "اكتب الكلمة المذكرة الناقصة: tener el _____ de (يتشرف بـ):",
            "Esta embajada tiene el _____ de invitar a su excelencia a la recepción del día nacional.",
            "تتشرف هذه السفارة بدعوة سعادتكم لحفل الاستقبال بمناسبة اليوم الوطني.",
            ["tener el honor de"],
            ["honor"],
            "tener el honor de هي العبارة البروتوكولية القياسية للدلالة على الشرف في المراسلات الرسمية."
        ),
        choice_ex(
            "ex-b2-cid-3", "word_choice",
            "حدد لقب التعظيم الدستوري الصحيح الموجه لوزير أو سفير في المملكة الإسبانية",
            ["vocabulary"], 2,
            "ما هو اللقب البروتوكولي الإلزامي لمخاطبة معالي الوزير أو سعادة السفير؟",
            "La carta iba encabezada con el tratamiento oficial: _____ Ministro de Cooperación.",
            "تصدّر الخطاب اللقب البروتوكولي الرسمي: ... وزير التعاون الدولي.",
            [
                opt("a", "Excelentísimo Señor", "معالي السيد الموقر (الصواب الدستوري)", True),
                opt("b", "Querido colega", "زميلي العزيز بالعامية", False, "اللقب الدستوري للوزراء والسفراء هو Excelentísimo Señor."),
                opt("c", "Don simple", "السيد المجرد فقط", False, "اللقب الرسمي المعتمد هو Excelentísimo Señor.")
            ],
            ["Excelentísimo Señor", "cuerpo diplomático", "protocolo"],
            "Excelentísimo/a Señor/a (Excmo./a Sr./a) هو لقب التشريف المخصص دستورياً للوزراء والسفراء وكبار مسؤولي الدولة."
        ),
        order_ex(
            "ex-b2-cid-4",
            "رتّب العبارة البروتوكولية الدبلوماسية لتأكيد أسمى آيات التقدير والاحترام",
            ["grammar", "writing"], 2,
            ["Reitera", "las", "seguridades", "de", "su", "más", "distinguida", "consideración"],
            "Reitera las seguridades de su más distinguida consideración",
            "الترتيب: الفعل Reitera ثم المفعول las seguridades ثم شبه الجملة de su más distinguida consideración.",
            ["distinguida consideración", "nota verbal"]
        ),
        choice_ex(
            "ex-b2-cid-5", "listen_choose",
            "استمع للبيان البروتوكولي وحدد الهيئة التي تمثل السفراء المعتمدين في العاصمة",
            ["listening", "vocabulary"], 2,
            "استمع لمراسم الاستقبال الرسمي في القصر الملكي",
            "Su Majestad el Rey recibió en audiencia solemne a los miembros del cuerpo diplomático.",
            "استقبل جلالة الملك في جلسة رسمية مهيبة أعضاء السلك الدبلوماسي.",
            [
                opt("a", "cuerpo diplomático", "السلك الدبلوماسي المعتمد (الصواب)", True),
                opt("b", "parque eólico", "حقل طاقة الرياح", False, "الاستقبال كان لأعضاء el cuerpo diplomático."),
                opt("c", "empresa privada", "شركة خاصة", False, "المفهوم هو السلك الدبلوماسي cuerpo diplomático.")
            ],
            ["cuerpo diplomático", "protocolo"],
            "المتحدث قال بمهابة: 'a los miembros del cuerpo diplomático'.",
            audioKey="pending/b2_audiencia_cuerpo_diplomatico_rey.mp3",
            speechEs="Su Majestad el Rey recibió en audiencia solemne a los miembros del cuerpo diplomático."
        ),
        speak_ex(
            "ex-b2-cid-6",
            "انطق جملتك البروتوكولية بوقار دبلوماسي رفيع ومخارج حروف متزنة وفصيحة",
            ["speaking", "pronunciation"], 2,
            "انطق العبارة الدبلوماسية التالية كما تُحرر في مذكرات السفارات الرسمية:",
            "La Embajada saluda al Excmo. Sr. Ministro y tiene el honor de reiterar las seguridades de su más distinguida consideración.",
            "تحيي السفارة معالي السيد الوزير وتتشرف بأن تجدد لسيادته الإعراب عن فائق تقديرها واحترامها.",
            "pending/b2_embajada_reitera_distinguida_consideracion.mp3",
            ["Excelentísimo Señor", "tener el honor de", "distinguida consideración", "nota verbal"],
            "La Embajada saluda al Excmo. Sr. Ministro y tiene el honor de reiterar las seguridades de su más distinguida consideración.",
            "انتبه لنطق Excmo. Sr. كـ Excelentísimo Señor ونطق distinguida consideración بوقار رصين."
        )
    ]
    return lesson_doc(doc, exs, level="B2")


def make_lesson_formulas_protocolarias_cierre():
    slug = "b2-formulas-protocolarias-cierre"
    doc = {
        "slug": slug,
        "unitSlug": "b2-u9-formal-writing",
        "levelCode": "B2",
        "titleAr": "الصيغ الختامية والتوقيع: أصول التوثيق والمراسلات الإدارية",
        "titleEs": "Fórmulas de cierre protocolario, antefirma y validación documental",
        "subtitleAr": "التفريق بين المقامات، صيغ ما قبل التوقيع (antefirma)، والأختام الرقمية",
        "order": 4,
        "estimatedMinutes": 20,
        "cefrLevel": "B2",
        "review": review_block(),
        "pedagogy": {
            "learningObjectivesAr": [
                "أن يختار المتعلم الصيغة الختامية الدقيقة المطابقة لمقام المرسل إليه وسياق الخطاب.",
                "أن يوظف صيغ الختام البروتوكولية: Le saluda muy atentamente, Dios guarde a V.E. muchos años, Atentamente.",
                "أن يصيغ خانة التوقيع والصفة الوظيفية (antefirma) والتصديق الإداري الرقمي (CSV)."
            ],
            "grammarPoints": [
                {
                    "titleAr": "تدرج صيغ الختام حسب درجات الرسمية والمقام الإداري",
                    "explanationAr": "1. **المستوى البروتوكولي الأسمى (Stricto sensu)**:\n- *Aprovecho la ocasión para testimoniarle mi más alta consideración personal y estima*.\n- في القضاء القديم: *Dios guarde a V.E. muchos años*.\n2. **المستوى الإداري والمؤسسي الرفيع**:\n- *Agradeciendo de antemano su atención, le saluda con la mayor consideración...*\n- *Sin otro particular, queda a su disposición atentamente...*\n3. **عناصر ما قبل التوقيع (La antefirma)**:\n- المنصب والصفة أولاً ثم الاسم ثم التوقيع:\n- *El Director General de Relaciones Institucionales, [Firma], Fdo.: [Nombre y Apellidos]*."
                }
            ],
            "commonMistakesAr": [
                "استخدام *un saludo* أو *saludos cordiales* في خطاب موجه لوزير أو هيئة قضائية؛ هذه الصيغ مخصصة لزملاء العمل المتساوين في المرتبة وتعد غير لائقة في السجل البروتوكولي العالي.",
                "عدم ذكر الصفة الوظيفية الرسمية في Antefirma قبل الاسم والتوقيع."
            ],
            "dialectNotes": [
                {
                    "region": "EG",
                    "noteAr": "في ختام المكاتبات الرسمية للوزير أو الجهات القضائية بنقول «وتفضلوا بقبول فائق الاحترام والتقدير، وتوقيع فلان الفلاني بصفته الوظيفية». بالإسبانية: Le saluda con la más distinguida consideración, Fdo.: El Director General."
                }
            ],
            "culturalNoteAr": "في إسبانيا الحديثة، تم استبدال التوقيع اليدوي تدريجياً بالتوقيع الإلكتروني المعزز (Firma digital con certificado FNMT)، والذي يتضمن كود التحقق الآمن (CSV)."
        },
        "contentBlocks": [
            {
                "id": f"cb-{slug}-intro",
                "type": "explanation",
                "titleAr": "صيغ الختام البروتوكولي والتوقيع الإداري",
                "bodyAr": "النماذج القياسية للاختتام:\n- **con la más alta consideración**: بأسمى درجات الاحترام والتقدير الرفيع\n- **sin otro particular**: ختاماً ودون أي تفاصيل أخرى إضافية\n- **la antefirma**: بيان الصفة الوظيفية الرسمية المسبقة لاسم الموقع وتوقيعه\n- **el código seguro de verificación (CSV)**: كود التحقق الآمن من صحة الوثيقة الرقمية\n- **Fdo. (Firmado)**: اختصار رسمي معتمد يسبق اسم الموقع بعد التوقيع\n- **surtir efectos legales**: ينتج آثاره القانونية الكاملة والملزمة",
                "examples": [
                    {"es": "Sin otro particular, aprovecho la ocasión para testimoniarle mi más alta consideración.", "ar": "وختاماً دون تفاصيل أخرى، أغتنم هذه المناسبة لأعرب لسيادتكم عن أسمى آيات تقديري."},
                    {"es": "En la antefirma debe constar con claridad el cargo institucional del firmante.", "ar": "يجب أن يرد بوضوح في خانة ما قبل التوقيع المنصب المؤسسي للموقّع."},
                    {"es": "El documento incluye un código seguro de verificación (CSV) para surtir plenos efectos legales.", "ar": "تتضمن الوثيقة كود تحقق آمناً لإنتاج كامل آثارها القانونية."}
                ]
            }
        ],
        "newVocabulary": ["más alta consideración", "sin otro particular", "antefirma", "código seguro", "Fdo.", "surtir efectos legales"],
        "reviewVocabulary": ["firma", "carta"]
    }

    exs = [
        choice_ex(
            "ex-b2-fpc-1", "word_choice",
            "اختر العبارة البروتوكولية الأكثر رصانة لختام خطاب موجه لمسؤول دولة رفيع",
            ["vocabulary"], 1,
            "أي صيغة ختامية تناسب مخاطبة رئيس هيئة أو وزير دولة؟",
            "_____, le saluda atentamente con la más distinguida consideración.",
            "...، يحيطكم بخالص التحية مع أسمى آيات التقدير والاحترام.",
            [
                opt("a", "Sin otro particular", "ختاماً دون إضافة أخرى في السياق الرسمي (الصواب)", True),
                opt("b", "Bueno hasta luego", "حسناً إلى اللقاء بالعامية", False, "الخطاب الرسمي يختتم بـ Sin otro particular."),
                opt("c", "Chao amigo", "مع السلامة يا صديقي", False, "السجل البروتوكولي يتطلب Sin otro particular.")
            ],
            ["sin otro particular", "más alta consideración"],
            "Sin otro particular هي العبارة الانتقالية القياسية قبل التحية الختامية في المراسلات الإدارية."
        ),
        fill_ex(
            "ex-b2-fpc-2",
            "أكمل الاختصار الرسمي الذي يسبق اسم الموقع بعد توقيعه: (_____.: Don Carlos López)",
            ["vocabulary", "writing"], 1,
            "اكتب الاختصار الرسمي المكون من ثلاثة أحرف لكلمة Firmado (موقّع من قِبل):",
            "El Director General de Recursos Humanos, [Firma], _____.: Antonio Morales.",
            "المدير العام للموارد البشرية، [التوقيع]، الموقّع أدناه: أنطونيو موراليس.",
            ["Fdo."],
            ["Fdo"],
            "Fdo. هو الاختصار الإداري القانوني المعتمد لكلمة Firmado."
        ),
        choice_ex(
            "ex-b2-fpc-3", "word_choice",
            "حدد الجزء في الخطاب الرسمي الذي يوضح الصفة الوظيفية والمنصب قبل الاسم والتوقيع",
            ["vocabulary"], 2,
            "ماذا يسمى الموضع الذي يسبق التوقيع لتحديد صفة المسؤول الاعتبارية؟",
            "En la _____ figuraba el sello del decano de la facultad de derecho.",
            "في خانة ... كان يظهر ختم عميد كلية الحقوق وصفته الرسمية.",
            [
                opt("a", "antefirma", "خانة ما قبل التوقيع والصفة الوظيفية (الصواب)", True),
                opt("b", "trama", "حبكة قصة", False, "الموقع الإداري يسمى la antefirma."),
                opt("c", "sesgo", "انحياز", False, "المصطلح الوثائقي هو la antefirma.")
            ],
            ["antefirma", "surtir efectos legales", "Fdo."],
            "la antefirma هي الفقرة التي تسبق التوقيع وتتضمن اسم المنصب والمؤسسة التي يمثلها الموقع."
        ),
        order_ex(
            "ex-b2-fpc-4",
            "رتّب الجملة القانونية للدلالة على السريان والآثار القانونية الملزمة للوثيقة",
            ["grammar", "writing"], 2,
            ["Este", "documento", "firmado", "va", "a", "surtir", "plenos", "efectos", "legales"],
            "Este documento firmado va a surtir plenos efectos legales",
            "الترتيب: المبتدأ Este documento firmado ثم الفعل va a surtir ثم المفعول plenos efectos legales.",
            ["surtir efectos legales", "código seguro"]
        ),
        choice_ex(
            "ex-b2-fpc-5", "listen_choose",
            "استمع للمسؤول الإداري وحدد الأداة التكنولوجية المطبوعة على الوثيقة لإثبات صحتها",
            ["listening", "vocabulary"], 2,
            "استمع لتعليمات التحقق من صحة الشهادة الإدارية الإلكترونية",
            "Puede verificar la autenticidad del certificado mediante el código seguro impreso al pie.",
            "يمكنكم التحقق من صحة الشهادة بواسطة كود التحقق الآمن المطبوع في أسفلها.",
            [
                opt("a", "código seguro", "كود التحقق الآمن المعتمد إلكترونياً (الصواب)", True),
                opt("b", "marca de agua falsa", "علامة مائية مقلدة", False, "المسؤول قال: el código seguro impreso al pie."),
                opt("c", "firma manual ilegible", "توقيع يدوي غير مقروء", False, "الأداة كانت كود التحقق الآمن código seguro.")
            ],
            ["código seguro", "surtir efectos legales"],
            "المتحدث قال بوضوح: 'mediante el código seguro impreso al pie'.",
            audioKey="pending/b2_verificar_codigo_seguro_pie.mp3",
            speechEs="Puede verificar la autenticidad del certificado mediante el código seguro impreso al pie."
        ),
        speak_ex(
            "ex-b2-fpc-6",
            "انطق عبارتك الختامية البروتوكولية بوقار واحترام رسمي فائق",
            ["speaking", "pronunciation"], 2,
            "انطق الجملة التالية لختام خطابك الإداري الموجه لأعلى سلطة تنفيذية:",
            "Sin otro particular, aprovecho la ocasión para testimoniarle mi más alta consideración y respeto institucional.",
            "وختاماً دون إضافة أخرى، أغتنم هذه المناسبة لأعرب لسيادتكم عن أسمى آيات تقديري واحترامي المؤسسي.",
            "pending/b2_sin_otro_particular_alta_consideracion.mp3",
            ["sin otro particular", "más alta consideración", "antefirma", "surtir efectos legales"],
            "Sin otro particular, aprovecho la ocasión para testimoniarle mi más alta consideración y respeto institucional.",
            "انتبه لنطق testimoniarle و más alta consideración بنبرة بروتوكولية رفيعة وبالغة التهذيب."
        )
    ]
    return lesson_doc(doc, exs, level="B2")


# ==============================================================================
# UNIT 10: b2-u10-culture-deep (الفروق الثقافية والإقليمية والتنوع الحضاري)
# ==============================================================================

def make_lesson_variedades_linguisticas_hispanas():
    slug = "b2-variedades-linguisticas-hispanas"
    doc = {
        "slug": slug,
        "unitSlug": "b2-u10-culture-deep",
        "levelCode": "B2",
        "titleAr": "التنوع اللغوي في العالم الإسباني: اللهجات والفروق المعجمية",
        "titleEs": "Variedades del español: Dialectología, voseo, seseo y riqueza léxica",
        "subtitleAr": "الإسبانية في الأندلس والأمريكتين (المكسيك، الأرجنتين، كولومبيا) والوحدة المعيارية",
        "order": 1,
        "estimatedMinutes": 20,
        "cefrLevel": "B2",
        "review": review_block(),
        "pedagogy": {
            "learningObjectivesAr": [
                "أن يتعرف المتعلم على الفروق الصوتية والنحوية الكبرى في العالم الإسباني (Seseo, Ceceo, Voseo).",
                "أن يفهم المتحدثين من مختلف الدول اللاتينية (الأرجنتين، المكسيك، الكاريبي، إسبانيا).",
                "أن يوظف مفاهيم علم اللهجات: norma panhispánica, americanismo, voseo, registro coloquial."
            ],
            "grammarPoints": [
                {
                    "titleAr": "الظواهر الصوتية والنحوية عبر جغرافية الإسبانية",
                    "explanationAr": "1. **الظواهر الصوتية الكبرى (Seseo y Distinción)**:\n- **Distinción** (في وسط وشمال إسبانيا): التمييز الصوتي بين /θ/ (حرفا z, c) و /s/ (casa مقابل caza).\n- **Seseo** (في الأندلس، الكناري وكافة أمريكا اللاتينية): نطق z و c كـ s دائماً.\n2. **ظاهرة الفوسيو (El Voseo) في الأرجنتين والأوروغواي**:\n- استخدام ضمير *vos* بدلاً من *tú* مع تصريف خاص في الحاضر:\n- *Vos tenés* (بدلاً من tú tienes) / *Vos sos* (بدلاً من tú eres) / *Vení* (تعال).\n3. **الفروق المعجمية الشائعة**:\n- الحاسوب: *ordenador* (إسبانيا) / *computadora* (المكسيك واللاتينية).\n- الهاتف النقال: *móvil* (إسبانيا) / *celular* (أمريكا اللاتينية)."
                }
            ],
            "commonMistakesAr": [
                "اعتبار لهجة إسبانيا هي 'الصحيحة' ولهجات أمريكا اللاتينية 'أقل صحة'؛ الأكاديميات اللغوية الـ 23 (ASALE) تؤكد أن الإسبانية لغة متعددة المراكز (policéntrica) ولكل تنوع أصالته ومعياره.",
                "الخلط بين voseo (ضمير مخاطب غير رسمي ودود في الأرجنتين vos) و vosotros (ضمير الجمع المخاطب غير الرسمي في إسبانيا)."
            ],
            "dialectNotes": [
                {
                    "region": "EG",
                    "noteAr": "زي ما عندنا في العربي لهجة مصرية وشامية ومغربية وكلنا بنفهم الفصحى، الإسباني فيه لهجة مدريد والأرجنتين والمكسيك، وكلهم بيفهموا الإسبانية المعيارية Panhispánica."
                }
            ],
            "culturalNoteAr": "أكثر من 90% من الناطقين بالإسبانية حول العالم يعيشون في القارة الأمريكية (المكسيك وحدها بها أكثر من 130 مليون ناطق)، مما يجعل الثقل الديموغرافي للغة لاتينياً بامتياز."
        },
        "contentBlocks": [
            {
                "id": f"cb-{slug}-intro",
                "type": "explanation",
                "titleAr": "خريطة اللهجات والتنوع اللساني",
                "bodyAr": "المفاهيم اللغوية المعاصرة:\n- **el voseo**: استخدام ضمير vos وتصريفاته الخاصة في ريو دي لا بلاتا (الأرجنتين وأوروغواي)\n- **el seseo**: نطق حروف c و z بصوت السين في أمريكا اللاتينية وجنوب إسبانيا\n- **el americanismo**: اللفظ أو المصطلح الأصيل الشائع في إسبانية القارة الأمريكية\n- **la norma panhispánica**: المعيار اللغوي المشترك المعتمد بين كافة الأكاديميات الإسبانية الـ 23\n- **la lengua policéntrica**: اللغة متعددة المراكز الثقافية التي لا تحتكر عاصمة واحدة صحتها\n- **el rasgo dialectal**: السمة اللهجية الصوتية أو الصرفية المميزة لمنطقة جغرافية",
                "examples": [
                    {"es": "En Argentina el voseo es la norma culta: dicen 'vos tenés' en lugar de 'tú tienes'.", "ar": "في الأرجنتين يُعد الفوسيو هو المعيار الفصيح: يقولون vos tenés بدلاً من tú tienes."},
                    {"es": "El seseo es un rasgo fonético compartido por millones de hispanohablantes en América.", "ar": "يُعد السينينو (Seseo) سمة صوتية يشترك فيها ملايين الناطقين بالإسبانية في أمريكا."},
                    {"es": "La Real Academia Española defiende una norma panhispánica plural e inclusiva.", "ar": "تدافع الأكاديمية الملكية الإسبانية عن معيار لغوي مشترك تعددي وشامل للجميع."}
                ]
            }
        ],
        "newVocabulary": ["voseo", "seseo", "americanismo", "norma panhispánica", "lengua policéntrica", "rasgo dialectal"],
        "reviewVocabulary": ["idioma", "acento"]
    }

    exs = [
        choice_ex(
            "ex-b2-vlh-1", "word_choice",
            "اختر الظاهرة اللغوية التي تتميز بها الأرجنتين باستخدام vos tenés بدلاً من tú tienes",
            ["vocabulary"], 1,
            "ماذا نسمي استخدام ضمير vos وتصريفاته المرافقة في منطقة ريو دي لا بلاتا؟",
            "El uso generalizado del _____ en Buenos Aires es un rasgo de identidad cultural.",
            "يُعد الاستخدام الواسع لـ ... في بوينس آيرس سمة من سمات الهوية الثقافية.",
            [
                opt("a", "voseo", "ظاهرة الفوسيو (Vos بدلاً من Tú) (الصواب)", True),
                opt("b", "seseo", "نطق السين فقط", False, "استخدام vos يسمى el voseo."),
                opt("c", "plagio", "انتحال", False, "الظاهرة النحوية تسمى el voseo.")
            ],
            ["voseo", "seseo", "rasgo dialectal"],
            "el voseo هو استبدال ضمير tú بـ vos مع تصريفات نبرية خاصة في الحاضر والأمر."
        ),
        fill_ex(
            "ex-b2-vlh-2",
            "أكمل بالسمة الصوتية لنطق z و c كحرف سين في أمريكا اللاتينية: el _____",
            ["vocabulary", "writing"], 1,
            "اكتب الكلمة المذكرة التي تدل على الظاهرة الصوتية الشائعة: el _____ (نطق z مثل s):",
            "El _____ hace que palabras como 'casa' y 'caza' suenen idénticas en casi toda América.",
            "يجعل ... كلمات مثل casa و caza تُنطق بشكل متطابق تماماً في معظم أنحاء أمريكا.",
            ["seseo"],
            ["seseo"],
            "el seseo هو نطق أصوات z و c (المتبوعة بـ e/i) كصوت /s/ الخالص."
        ),
        choice_ex(
            "ex-b2-vlh-3", "word_choice",
            "حدد المفهوم اللغوي الذي يقر بأن الإسبانية لغة لا تحتكرها دولة واحدة بل تتعدد مراكزها المعيارية",
            ["vocabulary"], 2,
            "ماذا نسمي اللغة التي تمتلك عدة معايير فصيحة معترف بها في عواصم متعددة؟",
            "El español es una _____, donde la norma de Madrid convive en igualdad con la de México o Bogotá.",
            "الإسبانية هي ...، حيث يتعايش معيار مدريد على قدم المساواة مع معيار مكسيكو أو بوغوتا.",
            [
                opt("a", "lengua policéntrica", "لغة متعددة المراكز المعيارية (الصواب)", True),
                opt("b", "lengua muerta", "لغة ميتة منقرضة", False, "الإسبانية لغة حية متعددة المراكز policéntrica."),
                opt("c", "falacia", "مغالطة", False, "المفهوم اللساني هو lengua policéntrica.")
            ],
            ["lengua policéntrica", "norma panhispánica", "americanismo"],
            "la lengua policéntrica هي اللغة التي تمتلك عدة نماذج معيارية مقبولة فصيحة في مختلف الأقطار."
        ),
        order_ex(
            "ex-b2-vlh-4",
            "رتّب الجملة اللسانية للتأكيد على التنوع الإيجابي للهجات الإسبانية",
            ["grammar", "writing"], 2,
            ["La", "norma", "panhispánica", "integra", "todos", "los", "rasgos", "dialectales"],
            "La norma panhispánica integra todos los rasgos dialectales",
            "الترتيب: المبتدأ La norma panhispánica ثم الفعل integra ثم المفعول todos los rasgos dialectales.",
            ["norma panhispánica", "rasgo dialectal"]
        ),
        choice_ex(
            "ex-b2-vlh-5", "listen_choose",
            "استمع للناقد اللغوي وحدد اللفظ الدال على المصطلحات الخاصة بالقارة الأمريكية",
            ["listening", "vocabulary"], 2,
            "استمع لبرنامج لغوي يناقش الفروق بين إسبانيا والمكسيك",
            "La palabra 'computadora' es un americanismo plenamente consolidado frente al 'ordenador' peninsular.",
            "تُعد كلمة 'computadora' لفظاً أمريكياً راسخاً في مقابل 'ordenador' الإيبيري.",
            [
                opt("a", "americanismo", "لفظ ومصطلح أمريكي لاتيني أصيل (الصواب)", True),
                opt("b", "voseo", "ضمير مخاطب فقط", False, "المتحدث وصفها بأنها americanismo."),
                opt("c", "error gramatical", "خطأ نحوي", False, "المصطلح المقبول هو americanismo.")
            ],
            ["americanismo", "voseo"],
            "المتحدث قال بوضوح: 'La palabra computadora es un americanismo plenamente consolidado'.",
            audioKey="pending/b2_computadora_americanismo_ordenador.mp3",
            speechEs="La palabra 'computadora' es un americanismo plenamente consolidado frente al 'ordenador' peninsular."
        ),
        speak_ex(
            "ex-b2-vlh-6",
            "انطق عبارتك اللسانية حول غنى وتنوع الإسبانية باعتزاز وفصاحة تامة",
            ["speaking", "pronunciation"], 2,
            "انطق الجملة التالية كباحث في اللسانيات يثمن التنوع الحضاري للإسبانية:",
            "El español es una lengua policéntrica enriquecida por el seseo, el voseo y una sólida norma panhispánica.",
            "الإسبانية لغة متعددة المراكز يثريها السينينو (seseo)، والفوسيو (voseo) ومعيار لغوي مشترك راسخ.",
            "pending/b2_lengua_policentrica_seseo_voseo.mp3",
            ["lengua policéntrica", "seseo", "voseo", "norma panhispánica"],
            "El español es una lengua policéntrica enriquecida por el seseo, el voseo y una sólida norma panhispánica.",
            "انتبه لنطق policéntrica مع النبرة على حرف é ونطق voseo و seseo بسلاسة."
        )
    ]
    return lesson_doc(doc, exs, level="B2")


def make_lesson_comunicacion_no_verbal_gestos():
    slug = "b2-comunicacion-no-verbal-gestos"
    doc = {
        "slug": slug,
        "unitSlug": "b2-u10-culture-deep",
        "levelCode": "B2",
        "titleAr": "التواصل غير اللفظي ولغة الجسد: الإشارات والمسافات المكانية",
        "titleEs": "Comunicación no verbal en el mundo hispano: Proxémica, cinésica y gestualidad",
        "subtitleAr": "مسافة التقارب الشخصي، حركات اليدين التعبيرية، التقبيل والملامسة الاجتماعية",
        "order": 2,
        "estimatedMinutes": 20,
        "cefrLevel": "B2",
        "review": review_block(),
        "pedagogy": {
            "learningObjectivesAr": [
                "أن يفسر المتعلم الإشارات الجسدية الشائعة في إسبانيا وأمريكا اللاتينية بدقة.",
                "أن يدرك قواعد علم المسافات المكانية (Proxémica): المسافة الشخصية والاقتراب البدني والترحيب بالقبلتين (dos besos).",
                "أن يتجنب سوء الفهم الثقافي الناتج عن اختلاف معاني حركات اليدين وتعبيرات الوجه."
            ],
            "grammarPoints": [
                {
                    "titleAr": "التراكيب الوصفية لعلم الحركات والمسافات التفاعلية",
                    "explanationAr": "1. **علم المسافات المكانية (La proxémica)**:\n- *En la cultura hispana la distancia interpersonal es más reducida que en el norte de Europa*.\n- *El contacto físico ocasional durante la conversación denota cercanía y calidez, no invasión*.\n2. **لغة الجسد والحركات التعبيرية (La cinésica)**:\n- *Gesticular con las manos acompaña el ritmo del discurso y refuerza el significado*.\n- *El gesto de juntar los dedos hacia arriba (en el Río de la Plata) indica duda o '¿qué decís?'*.\n3. **عادات الترحيب والتحية الجسدية**:\n- *Los dos besos en las mejillas son la norma entre mujeres o entre hombre y mujer en contextos sociales*."
                }
            ],
            "commonMistakesAr": [
                "النفور أو التراجع إلى الخلف عند اقتراب المتحدث الإسباني؛ التراجع يفسر ثقافياً كعلامة برود أو رفض شخصي وليس كمجرد احترام للمساحة.",
                "مد اليد فقط للسلام بين امرأة ورجل في السياق الاجتماعي غير الرسمي؛ العرف المتبع هو تبادل قبلتين خفيفتين على الخدين (dos besos)."
            ],
            "dialectNotes": [
                {
                    "region": "EG",
                    "noteAr": "زينا في مصر والبلاد العربية، الإسبان بيحبوا يتكلموا بإيديهم ويقربوا منك ويسلموا بحرارة، وده بيعبر عن الدفء والجدعنة مش اقتحام للخصوصية. بالإسبانية: La cercanía física y la gesticulación denotan calidez y empatía."
                }
            ],
            "culturalNoteAr": "المجتمعات الإسبانية واللاتينية تصنف سوسيولوجياً ضمن ثقافات 'التواصل عالي السياق' (High-context) وثقافات 'التماس الجسدي' (Contact cultures)، حيث تلعب نبرة الصوت ولغة الجسد دوراً موازياً للكلمات المنطوقة."
        },
        "contentBlocks": [
            {
                "id": f"cb-{slug}-intro",
                "type": "explanation",
                "titleAr": "لغة الجسد والتفاعل البصري والمكاني",
                "bodyAr": "المفاهيم الثقافية والسلوكية:\n- **la proxémica**: علم المسافات المكانية بين المتحدثين في التواصل البشري\n- **la cinésica**: علم حركات الجسد والإيماءات التعبيرية المرافقة للكلام\n- **el contacto visual directo**: النظر المباشر في العين كدليل صدق واهتمام\n- **los dos besos**: عادة الترحيب الشهيرة بتقبيل الخدين في اللقاء الاجتماعي\n- **gesticular con las manos**: التلويح واستخدام اليدين أثناء الحديث لتأكيد المعنى\n- **la distancia interpersonal**: المسافة الفاصلة بين الأشخاص أثناء الحوار",
                "examples": [
                    {"es": "La proxémica explica por qué los españoles conversan a una distancia más corta que los anglosajones.", "ar": "يفسر علم المسافات المكانية لماذا يتحدث الإسبان على مسافة أقرب مقارنة بالأنجلوساكسون."},
                    {"es": "En España, saludar con dos besos es el estándar social habitual al ser presentado a alguien.", "ar": "في إسبانيا، يُعد الترحيب بقبلتين على الخدين هو المعيار الاجتماعي المعتاد عند التعارف."},
                    {"es": "Gesticular intensamente con las manos es una muestra de pasión comunicativa, no de enfado.", "ar": "إن التلويح الحماسي باليدين دليل على الشغف في التواصل، وليس علامة غضب."}
                ]
            }
        ],
        "newVocabulary": ["proxémica", "cinésica", "dos besos", "gesticular", "distancia interpersonal", "contacto físico"],
        "reviewVocabulary": ["saludo", "cuerpo"]
    }

    exs = [
        choice_ex(
            "ex-b2-cnv-1", "word_choice",
            "اختر العلم الذي يدرس المسافة المكانية والاقتراب الجسدي بين الأفراد في التواصل الثقافي",
            ["vocabulary"], 1,
            "ماذا نسمي العلم الذي يبحث في مدى التقارب أو التباعد المكاني بين المتحدثين في اللقاء؟",
            "La _____ varía notablemente entre las culturas nórdicas y las mediterráneas.",
            "يختلف علم ... بشكل ملحوظ بين الثقافات الإسكندنافية وثقافات حوض البحر المتوسط.",
            [
                opt("a", "proxémica", "علم المسافات المكانية التفاعلية (الصواب)", True),
                opt("b", "metáfora", "استعارة بلاغية", False, "علم المسافات بين الأفراد يسمى la proxémica."),
                opt("c", "trama", "حبكة قصة", False, "المفهوم السوسيولوجي هو la proxémica.")
            ],
            ["proxémica", "cinésica", "distancia interpersonal"],
            "la proxémica هي دراسة استخدام الفضاء والمكان والمسافة الشخصية الفاصلة بين الأفراد في التفاعل اليومي."
        ),
        fill_ex(
            "ex-b2-cnv-2",
            "أكمل بالفعل الذي يعني تحريك اليدين واستخدامهما بكثافة أثناء الحديث: _____ con las manos",
            ["vocabulary", "writing"], 1,
            "اكتب الفعل المصدر: _____ con las manos (يحرك يديه تعبيرياً مع الكلام):",
            "A muchos hispanohablantes les resulta casi imposible hablar sin _____ con las manos.",
            "يجد العديد من الناطقين بالإسبانية صعوبة بالغة في التحدث دون ... بأيديهم.",
            ["gesticular"],
            ["gesticular"],
            "gesticular تعني استخدام حركات اليدين والوجه للتعبير والمصاحبة الإيقاعية للكلام."
        ),
        choice_ex(
            "ex-b2-cnv-3", "word_choice",
            "حدد العرف الاجتماعي الإسباني الشهير للترحيب عند التعارف بين رجل وامرأة أو بين امرأتين",
            ["vocabulary"], 2,
            "ما هي التحية الجسدية المعتادة في المناسبات الاجتماعية والتعارف الودي في إسبانيا؟",
            "Al presentarme a su hermana, ella me saludó con _____ en las mejillas con total naturalidad.",
            "عندما قدمني إلى أخته، حيتني بـ ... على الخدين بكل عفوية وتلقائية.",
            [
                opt("a", "dos besos", "قبلتان على الخدين (الصواب العرفي الاجتماعي)", True),
                opt("b", "una reverencia", "انحناءة يابانية رسمية", False, "التحية المعتادة في إسبانيا هي dos besos."),
                opt("c", "un apretón frío", "مصافحة جافة بعيدة", False, "العرف الاجتماعي الشائع هو dos besos.")
            ],
            ["dos besos", "contacto físico", "distancia interpersonal"],
            "los dos besos (قبلة خفيفة على كل خد بدءاً من الأيمن) هي التحية الاجتماعية المعيارية في إسبانيا."
        ),
        order_ex(
            "ex-b2-cnv-4",
            "رتّب الجملة لوصف دفء التواصل البصري والجسدي في الثقافة الإسبانية",
            ["grammar", "writing"], 2,
            ["El", "contacto", "físico", "ocasional", "denota", "cercanía", "y", "calidez"],
            "El contacto físico ocasional denota cercanía y calidez",
            "الترتيب: المبتدأ El contacto físico ocasional ثم الفعل denota ثم المفعول المعطوف cercanía y calidez.",
            ["contacto físico", "distancia interpersonal"]
        ),
        choice_ex(
            "ex-b2-cnv-5", "listen_choose",
            "استمع للمستشار الثقافي وحدد السبب الحقيقي وراء حركات اليدين الكثيفة لدى المتحدث الإسباني",
            ["listening", "vocabulary"], 2,
            "استمع لنصيحة الخبير لرجال الأعمال الأجانب في مدريد",
            "Gesticular con entusiasmo es una señal de empatía y compromiso emocional con la conversación.",
            "إن التلويح التعبيري بحماس هو إشارة للتعاطف والالتزام العاطفي بالحديث، وليس توتراً.",
            [
                opt("a", "señal de empatía", "إشارة للتعاطف والدفء في التواصل (الصواب)", True),
                opt("b", "muestra de enfado", "دليل على الغضب الشديد", False, "الخبير أكد أنها señal de empatía."),
                opt("c", "falta de respeto", "قلة احترام", False, "الحركات تعبر عن التعاطف empatía.")
            ],
            ["gesticular", "cinésica"],
            "الخبير قال: 'Gesticular con entusiasmo es una señal de empatía'.",
            audioKey="pending/b2_gesticular_entusiasmo_empatia.mp3",
            speechEs="Gesticular con entusiasmo es una señal de empatía y compromiso emocional con la conversación."
        ),
        speak_ex(
            "ex-b2-cnv-6",
            "انطق عبارتك التوضيحية حول عادات التواصل غير اللفظي والمسافات بطلاقة ولباقة",
            ["speaking", "pronunciation"], 2,
            "انطق الجملة التالية كدليل ثقافي يشرح قواعد التفاعل والتقارب الجسدي في إسبانيا:",
            "La proxémica en el mundo hispano se caracteriza por una menor distancia interpersonal y el uso natural de los dos besos.",
            "يتميز علم المسافات في العالم الإسباني بمسافة شخصية أقصر واستخدام عفوي للترحيب بالقبلتين.",
            "pending/b2_proyemica_distancia_dos_besos.mp3",
            ["proxémica", "distancia interpersonal", "dos besos", "gesticular"],
            "La proxémica en el mundo hispano se caracteriza por una menor distancia interpersonal y el uso natural de los dos besos.",
            "انتبه لنطق proxémica مع النبرة على حرف é ونطق distancia interpersonal بفصاحة."
        )
    ]
    return lesson_doc(doc, exs, level="B2")


def make_lesson_patrimonio_cultural_inmaterial():
    slug = "b2-patrimonio-cultural-inmaterial"
    doc = {
        "slug": slug,
        "unitSlug": "b2-u10-culture-deep",
        "levelCode": "B2",
        "titleAr": "التراث الثقافي اللامادي والاحتفالات الكبرى: الهوية والتاريخ",
        "titleEs": "El patrimonio cultural inmaterial: Fiestas mayores, ritos y memoria colectiva",
        "subtitleAr": "الفلامنكو، الفاياس (Las Fallas)، ديا دي مويرتوس المكسيكي، والأعياد التراثية",
        "order": 3,
        "estimatedMinutes": 20,
        "cefrLevel": "B2",
        "review": review_block(),
        "pedagogy": {
            "learningObjectivesAr": [
                "أن يحلل المتعلم عناصر التراث الثقافي غير المادي في إسبانيا والعالم اللاتيني المعترف بها دولياً من اليونسكو.",
                "أن يوظف مفردات الأنثروبولوجيا الثقافية: patrimonio inmaterial, rito ancestral, memoria colectiva, fervor popular, sincretismo.",
                "أن يفسر الأبعاد الرمزية والتاريخية للاحتفالات الكبرى (الفاياس، الفلامنكو، أسبوع الآلام، ويوم الموتى)."
            ],
            "grammarPoints": [
                {
                    "titleAr": "التراكيب الأنثروبولوجية لوصف الممارسات الثقافية والتراث الحي",
                    "explanationAr": "1. **التعبير عن التجذر التاريخي والأصالة التراثية**:\n- *Esta tradición hunde sus raíces en ritos ancestrales paganos y cristianos*.\n- *Fue declarada Patrimonio Cultural Inmaterial de la Humanidad por la UNESCO*.\n2. **التعبير عن الامتزاج الثقافي (El sincretismo)**:\n- *El Día de Muertos en México es un claro ejemplo de sincretismo entre la cosmovisión prehispánica y la fe católica*.\n3. **التعبير عن الحماس والالتفاف الشعبي**:\n- *La fiesta se vive con un desbordante fervor popular que congrega a miles de personas*."
                }
            ],
            "commonMistakesAr": [
                "اعتبار الفلامنكو مجرد رقصة شعبية؛ الفلامنكو فن متكامل من الغناء والشعر والعزف المعقد (cante jondo, toque, baile) المعترف به عالمياً كإرث إنساني.",
                "الفهم السطحي لاحتفال 'Día de Muertos' بالمكسيك كأنه هالوين؛ هو في الحقيقة احتفال دافئ لتكريم ذكرى الأجداد ومحبتهم بروحانية وألوان مبهجة."
            ],
            "dialectNotes": [
                {
                    "region": "EG",
                    "noteAr": "في التراث بنقول «الأعياد دي مش مجرد فرفشة، دي عادات متوارثة من آلاف السنين بتعبر عن هوية الشعب وتاريخه». بالإسبانية: Estas fiestas no son mero ocio, sino ritos ancestrales que forman parte viva de la memoria colectiva."
                }
            ],
            "culturalNoteAr": "إسبانيا هي رابع دولة في العالم من حيث عدد المواقع والعناصر المدرجة في قوائم اليونسكو للتراث الإنساني، بما يعكس ثراء تاريخها المتنوع الروماني والعربي والأوروبي."
        },
        "contentBlocks": [
            {
                "id": f"cb-{slug}-intro",
                "type": "explanation",
                "titleAr": "معجم التراث الثقافي الحي",
                "bodyAr": "المفاهيم الأنثروبولوجية والتراثية:\n- **el patrimonio inmaterial**: التراث الثقافي اللامادي غير الملموس المحفوظ شفهياً وممارسياً\n- **el rito ancestral**: الطقس التراثي العريق المتوارث عبر أجيال متتالية\n- **la memoria colectiva**: الذاكرة الجمعية الحافظة لتاريخ وشعور المجتمع ككل\n- **el sincretismo**: الامتزاج والتوفيق الثقافي بين عقائد وتيارات حضارية مختلفة\n- **el fervor popular**: الحماس والتعلق الوجداني والشعبي الجارف بالاحتفال\n- **hunder sus raíces**: يضرب بجذوره العميقة في التاريخ القديم",
                "examples": [
                    {"es": "El flamenco fue declarado Patrimonio Inmaterial de la Humanidad por su incalculable valor artístico.", "ar": "أُعلن الفلامنكو تراثاً إنسانياً لامادياً نظراً لقيمته الفنية التي لا تُقدر بثمن."},
                    {"es": "Las Fallas de Valencia hunden sus raíces en los antiguos rituales de los carpinteros en honor a San José.", "ar": "تضرب احتفالات الفاياس في فالنسيا بجذورها في طقوس النجارين القديمة تكريماً للقديس يوسف."},
                    {"es": "El Día de Muertos refleja el sincretismo entre las tradiciones indígenas y el catolicismo.", "ar": "يعكس يوم الموتى الامتزاج الثقافي بين تقاليد السكان الأصليين والمسيحية الكاثوليكية."}
                ]
            }
        ],
        "newVocabulary": ["patrimonio inmaterial", "rito ancestral", "memoria colectiva", "sincretismo", "fervor popular", "hunde sus raíces"],
        "reviewVocabulary": ["tradición", "cultura"]
    }

    exs = [
        choice_ex(
            "ex-b2-pci-1", "word_choice",
            "اختر المصطلح المعترف به من اليونسكو للفنون الحية والتقاليد الشفهية والطقوس التراثية",
            ["vocabulary"], 1,
            "ماذا نسمي الفنون الشعبية والممارسات التقليدية الحية غير المحصورة في مبانٍ حجرية؟",
            "El flamenco y la dieta mediterránea forman parte del _____ protegido por la UNESCO.",
            "يشكل الفلامنكو والحمية المتوسطية جزءاً من ... المحمي من قِبل اليونسكو.",
            [
                opt("a", "patrimonio inmaterial", "التراث الثقافي اللامادي الحي (الصواب)", True),
                opt("b", "monumento de piedra", "النصب التذكاري الحجري فقط", False, "الفنون والتقاليد تسمى el patrimonio inmaterial."),
                opt("c", "decreto ley", "مرسوم قانوني", False, "المصطلح التراثي هو patrimonio inmaterial.")
            ],
            ["patrimonio inmaterial", "memoria colectiva"],
            "el patrimonio inmaterial هو التراث الثقافي غير المادي الذي يشمل التقاليد الحية والفنون الأدائية والاحتفالات."
        ),
        fill_ex(
            "ex-b2-pci-2",
            "أكمل بالمصطلح الذي يعني الامتزاج الثقافي والتوفيقي بين معتقدين أو حضارتين: el _____",
            ["vocabulary", "writing"], 1,
            "اكتب الكلمة المذكرة التي تدل على امتزاج التقاليد الأصلية بالواردة: el _____ cultural:",
            "Las fiestas andinas son un fascinante ejemplo de _____ religioso entre ritos incas y santos católicos.",
            "تعد احتفالات جبال الأنديز نموذجاً ساحراً للـ ... الديني بين طقوس الإنكا وقديسي الكاثوليكية.",
            ["sincretismo"],
            ["sincretismo"],
            "el sincretismo هو التوفيق والامتزاج الثقافي والديني بين تقاليد وحضارات متباينة."
        ),
        choice_ex(
            "ex-b2-pci-3", "word_choice",
            "حدد التعبير البلاغي الذي يعني امتداد أصول الشيء في أعماق التاريخ القديم",
            ["vocabulary"], 2,
            "ما هي العبارة التي تعني 'يرجع تاريخه وأصوله إلى زمن سحيق غابر'؟",
            "Esta fiesta primaveral _____ en antiguos rituales paganos dedicados a la fertilidad.",
            "هذا الاحتفال الربيعي ... في طقوس قديمة مكرسة للخصوبة.",
            [
                opt("a", "hunde sus raíces", "يضرب بجذوره في أعماق التاريخ (الصواب)", True),
                opt("b", "levanta la sesión", "يرفع الجلسة", False, "الأصل التاريخي يقال عنه: hunde sus raíces."),
                opt("c", "toca fondo", "يلامس القاع في هبوط الأرقام", False, "التعبير التراثي هو hunde sus raíces.")
            ],
            ["hunde sus raíces", "rito ancestral", "memoria colectiva"],
            "التعبير hundir sus raíces يعني أن يمتد أصل الشيء عميقاً في التاريخ والتقاليد العريقة."
        ),
        order_ex(
            "ex-b2-pci-4",
            "رتّب الجملة الأنثروبولوجية للتعبير عن الحماس والالتفاف الشعبي العارم في الأعياد",
            ["grammar", "writing"], 2,
            ["La", "fiesta", "se", "celebra", "con", "un", "gran", "fervor", "popular"],
            "La fiesta se celebra con un gran fervor popular",
            "الترتيب: المبتدأ La fiesta ثم الفعل se celebra ثم شبه الجملة con un gran fervor popular.",
            ["fervor popular", "rito ancestral"]
        ),
        choice_ex(
            "ex-b2-pci-5", "listen_choose",
            "استمع للمؤرخ الثقافي وحدد الوعاء الحافظ لذكريات الشعب وهويته المشتركة",
            ["listening", "vocabulary"], 2,
            "استمع للبرنامج الوثائقي عن أعياد الفاياس في فالنسيا",
            "Estas celebraciones centenarias permanecen vivas gracias a la fuerza de la memoria colectiva.",
            "تظل هذه الاحتفالات الممتدة لمئات السنين حية بفضل قوة الذاكرة الجمعية وتماسكها.",
            [
                opt("a", "memoria colectiva", "الذاكرة الجمعية الحافظة لتاريخ المجتمع (الصواب)", True),
                opt("b", "olvido institucional", "النسيان المؤسسي", False, "المؤرخ قال: gracias a la fuerza de la memoria colectiva."),
                opt("c", "congoja pasajera", "غصة حزن عابرة", False, "الحافظ هو الذاكرة الجمعية memoria colectiva.")
            ],
            ["memoria colectiva", "patrimonio inmaterial"],
            "المتحدث قال بوضوح: 'gracias a la fuerza de la memoria colectiva'.",
            audioKey="pending/b2_fuerza_memoria_colectiva_fiestas.mp3",
            speechEs="Estas celebraciones centenarias permanecen vivas gracias a la fuerza de la memoria colectiva."
        ),
        speak_ex(
            "ex-b2-pci-6",
            "انطق عبارتك التراثية باعتزاز ثقافي وتقدير عميق للتنوع الحضاري الإنساني",
            ["speaking", "pronunciation"], 2,
            "انطق الجملة التالية لتقديم رؤية أنثروبولوجية راقية للتراث الإسباني اللامادي:",
            "El flamenco es un patrimonio inmaterial que hunde sus raíces en la memoria colectiva y el sincretismo cultural.",
            "الفلامنكو تراث لامادي يضرب بجذوره في الذاكرة الجمعية والامتزاج الثقافي المتنوع.",
            "pending/b2_flamenco_patrimonio_inmaterial_memoria.mp3",
            ["patrimonio inmaterial", "hunde sus raíces", "memoria colectiva", "sincretismo"],
            "El flamenco es un patrimonio inmaterial que hunde sus raíces en la memoria colectiva y el sincretismo cultural.",
            "انتبه لنطق patrimonio inmaterial و sincretismo cultural بفخامة ورصانة لغوية."
        )
    ]
    return lesson_doc(doc, exs, level="B2")


def make_lesson_choque_cultural_integracion():
    slug = "b2-choque-cultural-integracion"
    doc = {
        "slug": slug,
        "unitSlug": "b2-u10-culture-deep",
        "levelCode": "B2",
        "titleAr": "الصدام الثقافي والاندماج: التكيف والانفتاح على التنوع",
        "titleEs": "El choque cultural y la integración: Adaptación, interculturalidad y convivencia",
        "subtitleAr": "مراحل الصدمة الثقافية (choque cultural)، نبذ الصور النمطية، والعيش المشترك",
        "order": 4,
        "estimatedMinutes": 20,
        "cefrLevel": "B2",
        "review": review_block(),
        "pedagogy": {
            "learningObjectivesAr": [
                "أن يحلل المتعلم مراحل التكيف مع الثقافة الإسبانية الجديدة وتجاوز الصدمة الثقافية الأولى.",
                "أن يوظف مصطلحات التفاعل بين الثقافات: choque cultural, desmitificar estereotipos, convivencia armónica, empatía intercultural, aculturación.",
                "أن يشارك تجارب التنوع والاندماج الإيجابي بلغة منفتحة ومتزنة."
            ],
            "grammarPoints": [
                {
                    "titleAr": "التراكيب النفسية والاجتماعية لوصف مسار الاندماج الثقافي",
                    "explanationAr": "1. **التعبير عن مراحل الصدمة الثقافية (Fases del choque cultural)**:\n- *Al principio todo es fascinación (fase de luna de miel), luego surge la frustración ante las diferencias*.\n- *Con el tiempo se produce una adaptación paulatina basada en la comprensión recíproca*.\n2. **تفكيك الصور النمطية المسبقة (Desmitificar estereotipos)**:\n- *Es imperativo desmontar los prejuicios que distorsionan la realidad del otro*.\n- *Conocer de cerca la cultura permite superar clichés simplistas*.\n3. **التعبير عن العيش المشترك والتعددية (La convivencia)**:\n- *La verdadera interculturalidad no exige asimilación, sino una convivencia enriquecedora*."
                }
            ],
            "commonMistakesAr": [
                "استخدام مصطلح *asimilación* (الذوبان والتخلي عن الهوية الأصلية) كمرادف لـ *integración*؛ المفهوم الحديث في إسبانيا هو **la interculturalidad y la convivencia** (الاحتفاظ بالهوية الأصلية مع احترام قيم المجتمع المضيف).",
                "الاستسلام للتعميمات النمطية حول الشعوب (مثل 'كل الإسبان ينامون القيلولة طوال اليوم' أو 'اللاتينيون لا يلتزمون بالمواعيد')."
            ],
            "dialectNotes": [
                {
                    "region": "EG",
                    "noteAr": "في السفر بنقول «في الأول بتنصدم باختلاف العادات ومواعيد الأكل في إسبانيا، بس مع الوقت بتتعود وتفهم وتندمج». بالإسبانية: Al principio experimentas cierto choque cultural con los horarios, pero luego te adaptas y disfrutas de la convivencia."
                }
            ],
            "culturalNoteAr": "إسبانيا تحولت في العقود الثلاثة الأخيرة من بلد مصدر للمهاجرين إلى مجتمع متعدد الثقافات يستقبل ملايين المقيمين من أمريكا اللاتينية وشمال إفريقيا وأوروبا، مما جعل مفهوم 'La Convivencia' ركيزة وطنية."
        },
        "contentBlocks": [
            {
                "id": f"cb-{slug}-intro",
                "type": "explanation",
                "titleAr": "أدوات التكيف والتواصل بين الثقافات",
                "bodyAr": "المفاهيم السوسيولوجية للاندماج:\n- **el choque cultural**: الصدمة الثقافية والشعور بالارتباك أمام عادات بيئة جديدة\n- **desmitificar estereotipos**: تفكيك الصور النمطية والأحكام المسبقة وإبطالها\n- **la convivencia intercultural**: العيش المشترك والتفاعل الخلّاق بين ثقافات متنوعة\n- **la empatía intercultural**: التعاطف وتفهم وجهة نظر الآخر من منظوره الثقافي الخاص\n- **el cliché**: الكليشيه والفكرة المقولبة والمبتذلة عن شعب أو ثقافة\n- **la adaptación paulatina**: التكيف التدريجي والمتوازن مع المجتمع الجديد",
                "examples": [
                    {"es": "Superar el choque cultural inicial requiere paciencia, curiosidad y apertura mental.", "ar": "يتطلب تجاوز الصدمة الثقافية الأولية صبراً وفضولاً معرفياً وانفتاحاً ذهنياً."},
                    {"es": "Debemos desmitificar los estereotipos que impiden un diálogo intercultural sincero.", "ar": "ينبغي لنا تفكيك الصور النمطية التي تعوق قيام حوار صادق بين الثقافات."},
                    {"es": "La convivencia pacífica se fundamenta en el respeto a la diversidad y la empatía recíproca.", "ar": "يقوم العيش المشترك السلمي على احترام التنوع والتعاطف المتبادل."}
                ]
            }
        ],
        "newVocabulary": ["choque cultural", "desmitificar estereotipos", "convivencia", "empatía intercultural", "cliché", "adaptación paulatina"],
        "reviewVocabulary": ["integración", "extranjero"]
    }

    exs = [
        choice_ex(
            "ex-b2-cci-1", "word_choice",
            "اختر المصطلح النفسي والاجتماعي الذي يصف الارتباك الأولي للشخص في بيئة وثقافة جديدة",
            ["vocabulary"], 1,
            "ماذا نسمي الشعور بالصدمة والغرابة أمام اختلاف العادات في بلد جديد؟",
            "Muchos estudiantes extranjeros experimentan un breve _____ durante sus primeros meses en el país.",
            "يمر العديد من الطلاب المغتربين بـ ... قصير خلال أشهرهم الأولى في البلاد.",
            [
                opt("a", "choque cultural", "الصدمة الثقافية الأولية (الصواب)", True),
                opt("b", "acuerdo ganar-ganar", "اتفاق رابح-رابح", False, "الارتباك الثقافي يسمى el choque cultural."),
                opt("c", "acta oficial", "محضر رسمي", False, "المفهوم هو el choque cultural.")
            ],
            ["choque cultural", "adaptación paulatina"],
            "el choque cultural هو الارتباك والتوتر النفسي الناتج عن الانتقال لبيئة ثقافية مختلفة العادات والقيم."
        ),
        fill_ex(
            "ex-b2-cci-2",
            "أكمل بالمفهوم الاجتماعي الإسباني الأثير الذي يعني العيش المشترك السلمي: la _____",
            ["vocabulary", "writing"], 1,
            "اكتب الكلمة المؤنثة التي تعني 'العيش المشترك والانسجام المجتمعي': la _____ armónica:",
            "La escuela es el espacio privilegiado para fomentar la _____ intercultural y el respeto mutuo.",
            "المدرسة هي الفضاء النموذجي لتعزيز ... بين الثقافات والاحترام المتبادل.",
            ["convivencia"],
            ["convivencia"],
            "la convivencia هي العيش المشترك والوئام الاجتماعي اليومي بين مكونات المجتمع المتنوعة."
        ),
        choice_ex(
            "ex-b2-cci-3", "word_choice",
            "حدد الفعل الذي يعني تفنيد وإبطال الصور النمطية الخاطئة الشائعة عن الآخرين",
            ["vocabulary"], 2,
            "ما هي العبارة التي تعني 'إسقاط الأساطير والأفكار المسبقة عن ثقافة معينة'؟",
            "Viajar y convivir con la población local permite _____ y comprender la realidad cotidiana.",
            "يتيح السفر والعيش مع السكان المحليين ... وفهم الواقع المعاش بعيداً عن الكليشيهات.",
            [
                opt("a", "desmitificar estereotipos", "تفكيك الصور النمطية وإبطال الأساطير المسبقة (الصواب)", True),
                opt("b", "redactar instancias", "تحرير عرائض", False, "تفنيد الأفكار المسبقة يسمى desmitificar estereotipos."),
                opt("c", "ceder en el precio", "التنازل في السعر", False, "العبارة هي desmitificar estereotipos.")
            ],
            ["desmitificar estereotipos", "cliché", "empatía intercultural"],
            "desmitificar estereotipos تعني إزالة الهالات والأحكام المسبقة المغلوطة عن الشعوب."
        ),
        order_ex(
            "ex-b2-cci-4",
            "رتّب الجملة الإنسانية للتأكيد على قيمة التعاطف بين الثقافات",
            ["grammar", "writing"], 2,
            ["La", "empatía", "intercultural", "facilita", "una", "adaptación", "paulatina", "y", "feliz"],
            "La empatía intercultural facilita una adaptación paulatina y feliz",
            "الترتيب: المبتدأ La empatía intercultural ثم الفعل facilita ثم المفعول una adaptación paulatina y feliz.",
            ["empatía intercultural", "adaptación paulatina"]
        ),
        choice_ex(
            "ex-b2-cci-5", "listen_choose",
            "استمع للمتحدث في مؤتمر التعددية وحدد الفكرة المبتذلة التي يحذر من الوقوع في فخها",
            ["listening", "vocabulary"], 2,
            "استمع لمحاضرة الاندماج الاجتماعي في جامعة مدريد",
            "Debemos superar el simplista cliché de que las culturas son bloques herméticos e inmutables.",
            "يجب أن نتجاوز الكليشيه التبسيطي القائل بأن الثقافات كتل منغلقة وغير قابلة للتغير.",
            [
                opt("a", "simplista cliché", "الكليشيه السطحي المبتذل (الصواب)", True),
                opt("b", "dato fehaciente", "دليل قاطع", False, "المتحدث حذر من: el simplista cliché."),
                opt("c", "rito ancestral", "طقس عريق", False, "التحذير كان من الكليشيه cliché.")
            ],
            ["cliché", "desmitificar estereotipos"],
            "المتحدث قال بوضوح: 'Debemos superar el simplista cliché'.",
            audioKey="pending/b2_superar_simplista_cliche_culturas.mp3",
            speechEs="Debemos superar el simplista cliché de que las culturas son bloques herméticos e inmutables."
        ),
        speak_ex(
            "ex-b2-cci-6",
            "انطق دعوتك للتعايش والانفتاح الحضاري بنبرة إنسانية دافئة ومؤثرة",
            ["speaking", "pronunciation"], 2,
            "انطق الجملة التالية كرسالة حوار وتفاهم حضاري بين الشعوب:",
            "Para superar el choque cultural es vital desmitificar estereotipos y construir una convivencia basada en la empatía intercultural.",
            "لتجاوز الصدمة الثقافية من الحيوي تفكيك الصور النمطية وبناء عيش مشترك قائم على التعاطف بين الثقافات.",
            "pending/b2_superar_choque_convivencia_empatia.mp3",
            ["choque cultural", "desmitificar estereotipos", "convivencia", "empatía intercultural"],
            "Para superar el choque cultural es vital desmitificar estereotipos y construir una convivencia basada en la empatía intercultural.",
            "انتبه لنطق desmitificar estereotipos و convivencia و empatía intercultural بسلاسة وشعور إنساني صادق."
        )
    ]
    return lesson_doc(doc, exs, level="B2")
