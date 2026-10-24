# -*- coding: utf-8 -*-
"""B2 Units 2 (News Analysis), 3 (Literature & Metaphors), 4 (Professional Communication).
12 Lessons completing B2 Units 2, 3, and 4 based on:
- Aula Plus 4 & 5 (B2.1 & B2.2)
- Gramática del uso del español B1-B2 (Pasiva refleja, estilo indirecto complejo, conectores discursivos)
- Nuevo Español 2000 Nivel Superior
- المرشد في اللغة الأسبانية (أساليب الصحافة، الأدب، والتواصل المهني الراقي)
"""
import sys, os
sys.path.insert(0, os.path.dirname(__file__))
from common import opt, choice_ex, fill_ex, order_ex, speak_ex, lesson_doc, review_block

# ==============================================================================
# UNIT 2: b2-u2-news (الأخبار وتحليلها والخطاب الإعلامي)
# ==============================================================================

def make_lesson_analisis_prensa_editorial():
    slug = "b2-analisis-prensa-editorial"
    doc = {
        "slug": slug,
        "unitSlug": "b2-u2-news",
        "levelCode": "B2",
        "titleAr": "تحليل الصحافة والافتتاحيات: نبرة المقال والخطاب الإخباري",
        "titleEs": "Análisis de prensa: Editoriales, tono discursivo y sesgo informativo",
        "subtitleAr": "تفكيك المقال الافتتاحي (editorial)، كشف التوجه الفكري، ولغة النقد الصحفي",
        "order": 1,
        "estimatedMinutes": 20,
        "cefrLevel": "B2",
        "review": review_block(),
        "pedagogy": {
            "learningObjectivesAr": [
                "أن يحلل المتعلم المقال الافتتاحي ويفكك موقفه الضمني ونبرته النقدية.",
                "أن يوظف مصطلحات التحليل الإعلامي: editorial, sesgo, línea editorial, titular capcioso.",
                "أن يميز بين اللغة الإخبارية المحايدة ولغة التوجيه والضغط الرأي."
            ],
            "grammarPoints": [
                {
                    "titleAr": "التراكيب الأسلوبية في الافتتاحيات الصحفية",
                    "explanationAr": "1. **إسناد الرأي للهيئة التحريرية دون ذكر اسم محدد**:\n- *El diario sostiene que...* / *Desde esta tribuna se defiende que...*\n2. **التعبير عن النقد والتحذير المبطن**:\n- *Resulta alarmante que + Subjuntivo*: Resulta alarmante que el gobierno no tome medidas urgentes.\n- *Cabe señalar que + Indicativo*: Cabe señalar que las cifras contradicen el optimismo oficial.\n3. **المفاضلة والتقييم الحذر**:\n- *Lejos de solucionar el problema, esta ley...*"
                }
            ],
            "commonMistakesAr": [
                "استخدام *el editorial* و *la editorial* بنفس المعنى؛ *el editorial* هو المقال الافتتاحي التحريري، بينما *la editorial* هي دار النشر.",
                "استخدام المضارع الإخباري بعد العبارات التقييمية المؤثرة (الخطأ: *resulta alarmante que hay*; الصواب: resulta alarmante que haya بالمنصوب)."
            ],
            "dialectNotes": [
                {
                    "region": "EG",
                    "noteAr": "في الصحافة المصرية بنقول «افتتاحية الجريدة بتوجه نقد لاذع للسياسات دي». بالإسبانية: El editorial del diario critica duramente estas medidas y advierte de sus repercusiones."
                }
            ],
            "culturalNoteAr": "الصحافة الإسبانية الكبرى (مثل El País أو El Mundo أو La Vanguardia) تولي الافتتاحية وزناً سياسياً وثقافياً حاسماً، وتعبر عن التوجه الأيديولوجي للصحيفة."
        },
        "contentBlocks": [
            {
                "id": f"cb-{slug}-intro",
                "type": "explanation",
                "titleAr": "المفاهيم المحورية في الصحافة التحليلية",
                "bodyAr": "المصطلحات الأساسية:\n- **el editorial**: المقال الافتتاحي الذي يعبر عن رأي الجريدة ككل\n- **la línea editorial**: التوجه الفكري والسياسي للصحيفة\n- **el sesgo**: التحيز وعدم الحياد في معالجة الخبر\n- **resulta alarmante que**: يثير القلق والذعر أن (+ منصُوب)\n- **cabe señalar que**: تجدر الإشارة والتنويه إلى أن (+ إخباري)\n- **la repercusión**: الصدى والأثر والتداعيات",
                "examples": [
                    {"es": "El editorial de hoy subraya la necesidad de una reforma fiscal inmediata.", "ar": "تشدد افتتاحية اليوم على ضرورة إجراء إصلاح ضريبي عاجل."},
                    {"es": "Resulta alarmante que los jóvenes encuentren tantas barreras para independizarse.", "ar": "يثير القلق الشديد أن يواجه الشباب كل هذه العوائق للاستقلال."},
                    {"es": "Cabe señalar que la línea editorial del periódico siempre ha defendido la transparencia.", "ar": "تجدر الإشارة إلى أن الخط التحريري للصحيفة دافع دوماً عن الشفافية."}
                ]
            }
        ],
        "newVocabulary": ["editorial", "línea editorial", "sesgo", "resulta alarmante que", "cabe señalar que", "repercusión"],
        "reviewVocabulary": ["noticia", "periódico"]
    }

    exs = [
        choice_ex(
            "ex-b2-ape-1", "word_choice",
            "اختر المفردة التي تدل على المقال المعبر عن رأي الجريدة الرسمي",
            ["vocabulary"], 1,
            "ما هو المصطلح الذي يدل على المقال المعبر عن موقف المؤسسة الصحفية بالكامل؟",
            "En _____ de hoy, el periódico critica duramente la subida impositiva.",
            "في ... اليوم، تنتقد الجريدة بشدة الزيادة الضريبية.",
            [
                opt("a", "el editorial", "المقال الافتتاحي المذكر (الصواب)", True),
                opt("b", "la editorial", "دار النشر المؤنثة", False, "المقال الافتتاحي مذكر (el editorial)، بينما دار النشر مؤنثة (la editorial)."),
                opt("c", "el titular", "العنوان الرئيسي فقط", False, "المقال التحليلي الرسمي يسمى el editorial.")
            ],
            ["editorial"],
            "el editorial (بصيغة المذكر) هو المقال الافتتاحي للصحيفة."
        ),
        fill_ex(
            "ex-b2-ape-2",
            "صرف فعل haber بالمنصوب بعد العبارة الصحفية التقييمية: (haya)",
            ["grammar", "writing"], 1,
            "اكتب تصريف فعل haber بالمنصوب بعد التركيب التقييمي: Resulta alarmante que _____ tanta desigualdad.",
            "Resulta alarmante que _____ tanta precariedad en el empleo juvenil.",
            "يثير القلق الشديد أن يوجد هذا القدر من الهشاشة في توظيف الشباب.",
            ["resulta alarmante que"],
            ["haya"],
            "بعد العبارة التقييمية resulta alarmante que نستخدم المنصوب: haya."
        ),
        choice_ex(
            "ex-b2-ape-3", "word_choice",
            "حدد المصطلح الذي يعبر عن التوجه والانحياز غير المحايد للصحيفة",
            ["vocabulary"], 2,
            "ما هي الكلمة التي تعني 'الميل غير الموضوعي أو الانحياز الأيديولوجي'؟",
            "El informe carece de rigor objetivo debido a un claro _____ ideológico.",
            "يفتقر التقرير إلى الصرامة الموضوعية نظراً لوجود ... أيديولوجي واضح.",
            [
                opt("a", "sesgo", "تحيز أو انحياز (الصواب)", True),
                opt("b", "línea editorial", "خط تحريري محايد", False, "الميل غير العادل يسمى sesgo."),
                opt("c", "repercusión", "أثر ورجع صدى", False, "الانحياز يسمى sesgo.")
            ],
            ["sesgo", "línea editorial", "repercusión"],
            "el sesgo هو التحيز أو الميل غير المحايد في عرض الحقائق."
        ),
        order_ex(
            "ex-b2-ape-4",
            "رتّب الجملة التحريرية لتأكيد استقلالية الخط الصحفي",
            ["grammar", "writing"], 2,
            ["Cabe", "señalar", "que", "defendemos", "nuestra", "línea", "editorial"],
            "Cabe señalar que defendemos nuestra línea editorial",
            "الترتيب: العبارة الاستهلالية Cabe señalar que ثم الفعل defendemos ثم المفعول nuestra línea editorial.",
            ["cabe señalar que", "línea editorial"]
        ),
        choice_ex(
            "ex-b2-ape-5", "listen_choose",
            "استمع للتسجيل وحدد الأثر المجتمعي الذي تحذر منه الافتتاحية",
            ["listening", "vocabulary"], 2,
            "استمع لنص التحليل الافتتاحي المذاع وحدد الكلمة الدالة على التداعيات",
            "Esta decisión política tendrá graves repercusiones en la economía de las familias.",
            "سيكون لهذا القرار السياسي تداعيات خطيرة على اقتصاد الأسر.",
            [
                opt("a", "repercusiones", "تداعيات وانعكاسات خطيرة (الصواب)", True),
                opt("b", "soluciones", "حلول اقتصادية", False, "المتحدث حذر من repercusiones."),
                opt("c", "sesgos", "انحيازات فقط", False, "التحذير كان من التداعيات repercusiones.")
            ],
            ["repercusión", "sesgo"],
            "المتحدث قال: 'tendrá graves repercusiones en la economía'.",
            audioKey="pending/b2_repercusiones_economia_familias.mp3",
            speechEs="Esta decisión política tendrá graves repercusiones en la economía de las familias."
        ),
        speak_ex(
            "ex-b2-ape-6",
            "انطق عبارتك التحليلية لتقييم مقال الرأي بأسلوب صحفي رفيع",
            ["speaking", "pronunciation"], 2,
            "انطق الجملة التالية لنقد مقال صحفي بلغة رصينة وموضوعية:",
            "Cabe señalar que el artículo muestra un sesgo evidente y no aporta datos contrastados.",
            "تجدر الإشارة إلى أن المقال يُظهر تحيزاً جلياً ولا يقدم بيانات موثقة.",
            "pending/b2_cabe_senalar_sesgo_evidente.mp3",
            ["cabe señalar que", "sesgo"],
            "Cabe señalar que el artículo muestra un sesgo evidente y no aporta datos contrastados.",
            "انتبه لنطق señlar و evidente بنبرة تحليلية متزنة وفصيحة."
        )
    ]
    return lesson_doc(doc, exs, level="B2")


def make_lesson_pasiva_periodistica_se():
    slug = "b2-pasiva-periodistica-se"
    doc = {
        "slug": slug,
        "unitSlug": "b2-u2-news",
        "levelCode": "B2",
        "titleAr": "أسلوب المبني للمجهول الصحفي: Pasiva con Ser و Pasiva Refleja",
        "titleEs": "La voz pasiva y la pasiva refleja en el lenguaje periodístico",
        "subtitleAr": "الصياغة الإخبارية المجردة ونقل الوقائع الرسمية بـ (Fue aprobado) و (Se prevé)",
        "order": 2,
        "estimatedMinutes": 20,
        "cefrLevel": "B2",
        "review": review_block(),
        "pedagogy": {
            "learningObjectivesAr": [
                "أن يتقن المتعلم صياغة المبني للمجهول التام (Ser + participio) في نقل الأخبار المكتملة.",
                "أن يستخدم المبني للمجهول الانعكاسي (Pasiva refleja con Se) لإعطاء طابع مؤسسي محايد.",
                "أن يطابق اسم المفعول في النوع والعدد مع المبتدأ في المبني للمجهول الكلاسيكي."
            ],
            "grammarPoints": [
                {
                    "titleAr": "قواعد المبني للمجهول في الصحافة الإسبانية",
                    "explanationAr": "1. **المبني للمجهول التام (Ser + Participio + por + Agente)**:\n- *El acuerdo fue firmado por los dos ministros* (طابق firmado مع el acuerdo).\n- *Las medidas fueron anunciadas ayer* (طابقت anunciadas مع las medidas مؤنث جمع).\n2. **المبني للمجهول بالصيغة الانعكاسية (Se + Verbo en 3ª persona)**:\n- يُفضل دائماً في العناوين والبيانات الرسمية:\n- *Se prevé un aumento de las temperaturas* (مفرد مع un aumento).\n- *Se investigan las causas del accidente* (جمع مع las causas)."
                }
            ],
            "commonMistakesAr": [
                "نسيان مطابقة اسم المفعول مع الفاعل في المبني للمجهول مع Ser (الخطأ: *Las leyes fueron aprobado*; الصواب: Las leyes fueron aprobadas).",
                "استخدام المبني للمجهول مع Ser مع الأفعال غير المتعدية أو في لغة الحوار اليومية غير الرسمية."
            ],
            "dialectNotes": [
                {
                    "region": "EG",
                    "noteAr": "في الإسبانية الإخبارية نادراً ما بنقول مين الفاعل لو مش مهم، فبنستخدم المبني للمجهول: Se suspendieron los vuelos (عُلِّقت الرحلات الجوية) بدلاً من إلغاء الشركة للرحلات."
                }
            ],
            "culturalNoteAr": "توصي أدلة أسلوب كبرى الصحف الإسبانية (مثل كتاب أسلوب El País) بتفضيل Pasiva Refleja (Se acordó) على Pasiva con Ser (Fue acordado) للحفاظ على حيوية اللغة وخفتها."
        },
        "contentBlocks": [
            {
                "id": f"cb-{slug}-intro",
                "type": "explanation",
                "titleAr": "صيغ المبني للمجهول الإخباري",
                "bodyAr": "الأنماط الرئيسية:\n- **ser aprobado/a**: تمت الموافقة عليه رسمياً\n- **se prevé que**: من المتوقع والمقدّر أن\n- **se constata que**: يُلاحَظ ويُثبَت واقعياً أن\n- **se convoca**: تتم الدعوة إلى والانعقاد\n- **la promulgación**: الإصدار والاعتماد القانوني للتشريع\n- **el decreto**: المرسوم أو القرار الحكومي الرسمي",
                "examples": [
                    {"es": "El nuevo decreto fue promulgado por el jefe de Estado.", "ar": "تم إصدار المرسوم الجديد من قِبل رئيس الدولة."},
                    {"es": "Se prevé que la economía crezca un dos por ciento este año.", "ar": "من المتوقع أن ينمو الاقتصاد بنسبة اثنين بالمائة هذا العام."},
                    {"es": "Se convocaron elecciones anticipadas tras la moción de censura.", "ar": "تمت الدعوة إلى انتخابات مبكرة إثر حجب الثقة."}
                ]
            }
        ],
        "newVocabulary": ["promulgado", "decreto", "se prevé que", "se constata que", "convocar", "acuerdo"],
        "reviewVocabulary": ["gobierno", "ley"]
    }

    exs = [
        choice_ex(
            "ex-b2-ppr-1", "word_choice",
            "اختر اسم المفعول المطابق لقواعد التذكير والتأنيث مع جمع المؤنث",
            ["grammar"], 1,
            "أي اسم مفعول يناسب العبارة: Las reformas fiscales fueron _____ por el parlamento؟",
            "Las reformas fiscales fueron _____ ayer por la tarde.",
            "تم إقرار الإصلاحات الضريبية بعد ظهر أمس.",
            [
                opt("a", "aprobadas", "جمع مؤنث مطابق لـ las reformas (الصواب)", True),
                opt("b", "aprobado", "مفرد مذكر غير مطابق", False, "الفاعل las reformas جمع مؤنث ولذا يجب مطابقة اسم المفعول aprobadas."),
                opt("c", "aprobada", "مفرد مؤنث", False, "المبتدأ جمع (reformas) وليس مفرداً.")
            ],
            ["promulgado", "decreto"],
            "في المبني للمجهول مع Ser، يطابق اسم المفعول المبتدأ في النوع والعدد: las reformas fueron aprobadas."
        ),
        fill_ex(
            "ex-b2-ppr-2",
            "أكمل صيغة المبني للمجهول الانعكاسي مع الجمع: (prevén)",
            ["grammar", "writing"], 1,
            "اكتب تصريف فعل prever بصيغة المبني للمجهول الانعكاسي مع الجمع: Se _____ fuertes lluvias.",
            "Para este fin de semana se _____ fuertes precipitaciones en la costa.",
            "لعطلة نهاية هذا الأسبوع يُتوقَّع هطول أمطار غزيرة على الساحل.",
            ["se prevé que"],
            ["prevén"],
            "مع المبتدأ الجمع (fuertes precipitaciones) يصرّف الفعل في الجمع: se prevén."
        ),
        choice_ex(
            "ex-b2-ppr-3", "word_choice",
            "حدد المصطلح الرسمي الذي يعني إصدار واعتماد القرار القانوني",
            ["vocabulary"], 2,
            "ما هو الفعل الذي يدل على 'نشر وإصدار المرسوم الحكومي رسمياً في الجريدة'؟",
            "El nuevo decreto ley fue _____ esta misma mañana por el presidente.",
            "تم ... المرسوم بقانون الجديد صباح هذا اليوم من قبل الرئيس.",
            [
                opt("a", "promulgado", "تم إصداره ونشره رسمياً (الصواب)", True),
                opt("b", "convocado", "تمت الدعوة إليه", False, "المرسوم يتم إصداره promulgado."),
                opt("c", "previsto", "متوقع", False, "الاعتماد الرسمي هو الإصدار promulgado.")
            ],
            ["promulgado", "decreto", "convocar"],
            "promulgar un decreto تعني إصدار مرسوم قانوني واعتماده رسمياً."
        ),
        order_ex(
            "ex-b2-ppr-4",
            "رتّب الجملة الإخبارية بصيغة المبني للمجهول الانعكاسي",
            ["grammar", "writing"], 2,
            ["Se", "convocaron", "elecciones", "generales", "para", "julio"],
            "Se convocaron elecciones generales para julio",
            "الترتيب: الضمير Se ثم الفعل الجمع convocaron ثم المبتدأ elecciones generales ثم الظرف para julio.",
            ["convocar", "acuerdo"]
        ),
        choice_ex(
            "ex-b2-ppr-5", "listen_choose",
            "استمع لنشرة الأخبار وحدد ما تم رصده وتأكيده واقعياً",
            ["listening", "grammar"], 2,
            "استمع للبيان الإخباري وحدد التعبير غير الشخصي الدال على الرصد المؤكد",
            "Se constata un descenso significativo en la tasa de desempleo juvenil.",
            "يُلاحَظ ويُثبَت انخفاض ملحوظ في معدل بطالة الشباب.",
            [
                opt("a", "se constata que", "يُلاحَظ ويُثبَت واقعياً (الصواب)", True),
                opt("b", "se duda que", "يُشكك في", False, "المذيع قال: Se constata un descenso."),
                opt("c", "se desmiente que", "يتم النفي", False, "العبارة المستخدمة هي se constata.")
            ],
            ["se constata que", "se prevé que"],
            "المذيع قال بوضوح: 'Se constata un descenso significativo'.",
            audioKey="pending/b2_se_constata_descenso_paro.mp3",
            speechEs="Se constata un descenso significativo en la tasa de desempleo juvenil."
        ),
        speak_ex(
            "ex-b2-ppr-6",
            "انطق البيان الإخباري بصوت مذيع محترف مستخدماً المبني للمجهول",
            ["speaking", "pronunciation"], 2,
            "انطق الجملة التالية بأسلوب إذاعي واثق ومخارج حروف واضحة:",
            "El histórico acuerdo fue firmado y se prevé su entrada en vigor el próximo mes.",
            "تم توقيع الاتفاق التاريخي ومن المتوقع دخوله حيز التنفيذ الشهر القادم.",
            "pending/b2_acuerdo_firmado_entrada_vigor.mp3",
            ["acuerdo", "se prevé que", "promulgado"],
            "El histórico acuerdo fue firmado y se prevé su entrada en vigor el próximo mes.",
            "انتبه لنطق acuerdo و firmado ومطابقة النبرة الرصينة للأخبار الجادة."
        )
    ]
    return lesson_doc(doc, exs, level="B2")


def make_lesson_hechos_vs_opiniones():
    slug = "b2-hechos-vs-opiniones"
    doc = {
        "slug": slug,
        "unitSlug": "b2-u2-news",
        "levelCode": "B2",
        "titleAr": "التمييز بين الحقائق والآراء: الموضوعية والتلاعب الدلالي",
        "titleEs": "Hechos frente a opiniones: Objetividad y manipulación discursiva",
        "subtitleAr": "كشف المغالطات (falacias)، العبارات التقييمية، والأدلة الإحصائية القاطعة",
        "order": 3,
        "estimatedMinutes": 20,
        "cefrLevel": "B2",
        "review": review_block(),
        "pedagogy": {
            "learningObjectivesAr": [
                "أن يفرز المتعلم بين البيانات القابلة للإثبات (Hechos) والأحكام التقديرية (Opiniones).",
                "أن يكشف الكلمات ذات الشحنة التقييمية الإيجابية أو السلبية الموجهة للرأي العام.",
                "أن يعبر عن الدقة والتحقق: contrastar fuentes, dato fidedigno, juicio de valor."
            ],
            "grammarPoints": [
                {
                    "titleAr": "التراكيب الدالة على الحقيقة مقابل التقدير الذاتي",
                    "explanationAr": "1. **إبراز الحقيقة المثبتة (Hechos contrastados)**:\n- *Está científicamente demostrado que + Indicativo*: Está demostrado que la medida redujo el tráfico.\n- *Los datos confirman de forma fehaciente que...*\n2. **التعامل مع الأحكام التقديرية (Juicios de valor)**:\n- *A juicio de los analistas*: وفق تقدير المحللين (رأي وليس حقيقة قاطعة).\n- *Resulta cuestionable afirmar que + Subjuntivo*: يثير التشكيك الزعم بأن..."
                }
            ],
            "commonMistakesAr": [
                "خلط التقرير الإحصائي الصرف بالحكم الشخصي المبطن (مثل اعتبار *un éxito rotundo* حقيقة بينما هي حكم تقييمي juicio de valor).",
                "استخدام الإخباري بعد عبارات التشكيك الموجهة للرأي (الخطأ: *es cuestionable que es cierto*; الصواب: es cuestionable que sea cierto)."
            ],
            "dialectNotes": [
                {
                    "region": "EG",
                    "noteAr": "في النقاشات بنقول «دي مش معلومة مؤكدة، ده مجرد وجهة نظر شخصية وانطباع». بالإسبانية: Eso no es un hecho contrastado, sino un simple juicio de valor sin fundamento empírico."
                }
            ],
            "culturalNoteAr": "تأسست في إسبانيا والعالم اللاتيني منصات رائدة لتدقيق الحقائق (مثل Maldita.es و Newtral) لفرز الشائعات عن الوقائع المثبتة."
        },
        "contentBlocks": [
            {
                "id": f"cb-{slug}-intro",
                "type": "explanation",
                "titleAr": "أدوات التمييز بين الواقع والرأي",
                "bodyAr": "المفاهيم التحليلية:\n- **el hecho contrastado**: الواقعة المثبتة بالمصادر المستقلة\n- **el juicio de valor**: الحكم التقييمي الذاتي المستند للشعور أو الفكر\n- **el dato fehaciente**: المعلومة القاطعة والدليل الدامغ\n- **contrastar fuentes**: مقارنة المصادر والتحقق من صحتها\n- **resulta cuestionable que**: يثير الشك والجدل أن (+ منصُوب)\n- **la falacia**: المغالطة المنطقية التي تبدو صحيحة ظاهرياً",
                "examples": [
                    {"es": "El aumento del IPC es un hecho comprobado, pero calificarlo de catástrofe es un juicio de valor.", "ar": "ارتفاع مؤشر الأسعار حقيقة مثبتة، لكن وصفه بالكارثة هو حكم تقييمي ذاتي."},
                    {"es": "Antes de publicar la noticia, el periodista contrastó tres fuentes independientes.", "ar": "قبل نشر الخبر، تحقق الصحفي من ثلاثة مصادر مستقلة."},
                    {"es": "Resulta cuestionable que esa medida vaya a resolver la inflación.", "ar": "يثير الشك أن تؤدي تلك الخطوة إلى حل مشكلة التضخم."}
                ]
            }
        ],
        "newVocabulary": ["hecho contrastado", "juicio de valor", "dato fehaciente", "contrastar", "resulta cuestionable que", "falacia"],
        "reviewVocabulary": ["verdad", "opinión"]
    }

    exs = [
        choice_ex(
            "ex-b2-hvo-1", "word_choice",
            "حدد العبارة التي تعبر عن حكم ذاتي وليس حقيقة مثبتة بالأرقام",
            ["vocabulary"], 1,
            "أي من الجمل التالية يعتبر حكماً تقييمياً (juicio de valor)؟",
            "El proyecto fue el más brillante y transformador de la década.",
            "كان المشروع الأكثر عبقرية وتغييراً في العقد.",
            [
                opt("a", "juicio de valor", "حكم تقييمي ذاتي يعتمد على الذوق والانطباع (الصواب)", True),
                opt("b", "hecho contrastado", "حقيقة إحصائية مثبتة", False, "وصف 'الأكثر عبقرية' هو تقييم ذاتي غير قابل للقياس المادي المباشر."),
                opt("c", "dato fehaciente", "رقم رسمي موثق", False, "هذا انطباع وليس رقماً موثقاً.")
            ],
            ["juicio de valor", "hecho contrastado", "dato fehaciente"],
            "الأوصاف الحماسية التفضيلية تعتبر أحكاماً قيمية ذاتية (juicios de valor)."
        ),
        fill_ex(
            "ex-b2-hvo-2",
            "صرف فعل tener بالمنصوب بعد العبارة التشكيكية: (tenga)",
            ["grammar", "writing"], 1,
            "اكتب تصريف فعل tener بالمنصوب: Resulta cuestionable que este plan _____ éxito.",
            "Resulta cuestionable que la nueva estrategia _____ un impacto inmediato en el mercado.",
            "يثير الشك والجدل أن يكون للاستراتيجية الجديدة تأثير فوري في السوق.",
            ["resulta cuestionable que"],
            ["tenga"],
            "بعد العبارة التشكيكية resulta cuestionable que نستخدم المنصوب: tenga."
        ),
        choice_ex(
            "ex-b2-hvo-3", "word_choice",
            "اختر الفعل الذي يعني التحقق من صحة الخبر بمقارنة عدة مصادر",
            ["vocabulary"], 2,
            "ما هو الفعل المهني الذي يطلقه الصحفيون على مقارنة الروايات للتأكد من صدقها؟",
            "El redactor se negó a publicar el rumor sin antes _____ rigurosamente los datos.",
            "رفض المحرر نشر الشائعة قبل أن ... البيانات بصرامة.",
            [
                opt("a", "contrastar", "يقارن المصادر ويدققها (الصواب)", True),
                opt("b", "opinar", "يبدي رأيه فقط", False, "التحقق المهني يسمى التثبت والمقارنة contrastar."),
                opt("c", "admitir", "يعترف", False, "التثبت من الخبر يسمى contrastar fuentes.")
            ],
            ["contrastar", "hecho contrastado"],
            "contrastar información يعني تدقيق البيانات ومقارنتها عبر عدة مصادر مستقلة."
        ),
        order_ex(
            "ex-b2-hvo-4",
            "رتّب الجملة لرفض الحجة القائمة على مغالطة منطقية",
            ["grammar", "writing"], 2,
            ["Ese", "argumento", "se", "basa", "en", "una", "falacia"],
            "Ese argumento se basa en una falacia",
            "الترتيب: المبتدأ Ese argumento ثم الفعل والانعكاس se basa ثم شبه الجملة en una falacia.",
            ["falacia", "juicio de valor"]
        ),
        choice_ex(
            "ex-b2-hvo-5", "listen_choose",
            "استمع للتسجيل وحدد المعيار الذي يطلبه الخبير لإثبات الادعاء",
            ["listening", "vocabulary"], 2,
            "استمع لحديث الخبير في الندوة الصحفية",
            "Necesitamos datos fehacientes y no meras suposiciones políticas.",
            "نحتاج إلى بيانات قاطعة وأدلة دامغة وليس مجرد تكهنات سياسية.",
            [
                opt("a", "dato fehaciente", "بيانات قاطعة وأدلة دامغة (الصواب)", True),
                opt("b", "suposiciones", "تخمينات فقط", False, "الخبير شدد على ضرورة توفير datos fehacientes."),
                opt("c", "falacias", "مغالطات", False, "المطلوب كان الأدلة الدامغة datos fehacientes.")
            ],
            ["dato fehaciente", "falacia"],
            "المتحدث قال بصرامة: 'Necesitamos datos fehacientes'.",
            audioKey="pending/b2_datos_fehacientes_suposiciones.mp3",
            speechEs="Necesitamos datos fehacientes y no meras suposiciones políticas."
        ),
        speak_ex(
            "ex-b2-hvo-6",
            "انطق عبارتك للتفريق بين الدليل العلمي والحكم الانطباعي",
            ["speaking", "pronunciation"], 2,
            "انطق الجملة التالية بأسلوب نقدي أكاديمي رصين:",
            "Debemos distinguir con claridad entre un hecho contrastado y un simple juicio de valor.",
            "يجب أن نميز بوضوح بين الحقيقة المثبتة والحكم التقديري الذاتي البسيط.",
            "pending/b2_distinguir_hecho_juicio_valor.mp3",
            ["hecho contrastado", "juicio de valor", "contrastar"],
            "Debemos distinguir con claridad entre un hecho contrastado y un simple juicio de valor.",
            "انتبه لنطق distinguir و contrastado بوضوح وبلا تردد."
        )
    ]
    return lesson_doc(doc, exs, level="B2")


def make_lesson_entrevista_periodistica():
    slug = "b2-entrevista-periodistica"
    doc = {
        "slug": slug,
        "unitSlug": "b2-u2-news",
        "levelCode": "B2",
        "titleAr": "إجراء المقابلة الصحفية: نقل التصريحات وصياغة الأسئلة الذكية",
        "titleEs": "La entrevista periodística: Formulación de preguntas incisivas y cita de declaraciones",
        "subtitleAr": "إدارة الحوار مع الشخصيات العامة، الاستدراك، ونقل الأقوال (según declaró)",
        "order": 4,
        "estimatedMinutes": 20,
        "cefrLevel": "B2",
        "review": review_block(),
        "pedagogy": {
            "learningObjectivesAr": [
                "أن يوجه المتعلم أسئلة صحفية ذكية ودبلوماسية ومحرجة بلباقة لشخصيات مسؤولة.",
                "أن ينقل تصريحات الضيف بأمانة باستخدام أفعال القول المتنوعة: asegurar, desmentir, sostener, puntualizar.",
                "أن يتعامل مع التهرب من الإجابة بصيغ إعادة التوجيه الصحفي اللبق."
            ],
            "grammarPoints": [
                {
                    "titleAr": "أفعال القول المتخصصة وصيغ الاستدراك في الحوار الصحفي",
                    "explanationAr": "1. **تنويع أفعال القول بدلاً من decir**:\n- *Asegurar*: يؤكد بحزم (Aseguró que no dimitirá).\n- *Puntualizar*: يوضح نقطة محددة بدقة (Puntualizó que las cifras eran provisionales).\n- *Reiterar*: يكرر ويشدد على الموقف (Reiteró su compromiso con el diálogo).\n2. **صيغ إعادة توجيه السؤال عند التهرب**:\n- *Permítame insistir en este punto*: اسمح لي أن ألح على هذه النقطة.\n- *Con el debido respeto, no ha respondido a mi pregunta sobre...*"
                }
            ],
            "commonMistakesAr": [
                "الاعتماد الحصري على فعل dijo que مما يفقد التقرير الصحفي دقته وتنوعه الدلالي.",
                "استخدام أسلوب هجومي فظ بدلاً من الحزم الدبلوماسي المحترف الذي يفرضه ميثاق الشرف الصحفي."
            ],
            "dialectNotes": [
                {
                    "region": "EG",
                    "noteAr": "المحاور الشاطر لما الضيف يلف ويدور بيقوله: «مع احترامي لحضرتك، ده مبيجاوبش على سؤالي عن الميزانية». بالإسبانية: Con todo respeto, no ha contestado a mi pregunta sobre los fondos públicos."
                }
            ],
            "culturalNoteAr": "الصحفيون في إسبانيا وأمريكا اللاتينية يتمتعون بجرأة واستقلالية عالية في مساءلة الساسة، وتعتبر برامج المقابلات المعمقة من أعلى البرامج مشاهدة."
        },
        "contentBlocks": [
            {
                "id": f"cb-{slug}-intro",
                "type": "explanation",
                "titleAr": "ترسانة الحوار الصحفي المهني",
                "bodyAr": "أهم التراكيب:\n- **puntualizar**: يوضح ويدقق جزئية خاصة\n- **reiterar**: يكرر ويعيد التأكيد على الموقف\n- **asegurar tajantemente**: يؤكد بشكل قاطع لا يقبل الشك\n- **permítame insistir**: اسمح لي بالإلحاح والعودة للسؤال\n- **con el debido respeto**: مع كامل الاحترام والتقدير الواجب\n- **la declaración jurada**: الإقرار الرسمي المصحوب بقسم أو تأكيد معلن",
                "examples": [
                    {"es": "El ministro puntualizó que las ayudas no se suspenderán bajo ninguna circunstancia.", "ar": "أوضح الوزير بدقة أن المساعدات لن تُعلَّق تحت أي ظرف من الظروف."},
                    {"es": "Permítame insistir: ¿cuándo se publicará el informe completo?", "ar": "اسمح لي بالإلحاح: متى سيُنشر التقرير بالكامل؟"},
                    {"es": "El portavoz aseguró tajantemente que no habrá recortes en sanidad.", "ar": "أكد المتحدث بشكل قاطع أنه لن تكون هناك اقتطاعات في قطاع الصحة."}
                ]
            }
        ],
        "newVocabulary": ["puntualizar", "reiterar", "asegurar", "permítame insistir", "con el debido respeto", "declaración"],
        "reviewVocabulary": ["entrevista", "pregunta"]
    }

    exs = [
        choice_ex(
            "ex-b2-enp-1", "word_choice",
            "اختر الفعل الصحفي الذي يعني توضيح نقطة بعينها وتصحيح تفصيل دقيق",
            ["vocabulary"], 1,
            "أي فعل قول يعبر عن 'إضافة توضيح دقيق ومحدد لتفادي سوء الفهم'؟",
            "Al término de la reunión, la portavoz _____ que el pacto aún no era definitivo.",
            "في ختام الاجتماع، ... المتحدثة بدقة أن الاتفاق لم يكن نهائياً بعد.",
            [
                opt("a", "puntualizó", "أوضحت ودققت نقطة محددة (الصواب)", True),
                opt("b", "habló", "تحدثت بشكل عام", False, "التوضيح التفصيلي يسمى puntualizar."),
                opt("c", "preguntó", "سألت", False, "المتحدثة هي التي أوضحت puntualizó.")
            ],
            ["puntualizar", "declaración"],
            "puntualizar يعني التدقيق والتوضيح الدقيق لجزئية محددة في الحديث."
        ),
        fill_ex(
            "ex-b2-enp-2",
            "صرف فعل reiterar بالماضي البسيط مع الفاعل الغائب هو: (reiteró)",
            ["grammar", "writing"], 1,
            "اكتب تصريف فعل reiterar في الماضي البسيط المفرد: El diplomático _____ su llamada a la paz.",
            "El presidente _____ su compromiso absoluto con la transparencia democrática.",
            "كرر الرئيس تأكيد التزامه المطلق بالشفافية الديمقراطية.",
            ["reiterar"],
            ["reiteró"],
            "في الماضي البسيط مع الغائب: reiteró."
        ),
        choice_ex(
            "ex-b2-enp-3", "word_choice",
            "حدد العبارة الدبلوماسية المناسبة للعودة للسؤال بعد محاولة الضيف التهرب",
            ["vocabulary"], 2,
            "كيف تعيد الضيف للسؤال بإصرار صحفي محترف ولبق؟",
            "_____, señor consejero: ¿cuál es el coste exacto de la infraestructura?",
            "...، حضرة المستشار: ما هي التكلفة الدقيقة للبنية التحتية؟",
            [
                opt("a", "Permítame insistir", "اسمح لي بالإلحاح على النقطة (الصواب)", True),
                opt("b", "Me da igual", "لا يهمني", False, "أسلوب غير لائق إطلاقاً في المقابلة الصحفية."),
                opt("c", "Usted miente", "أنت تكذب", False, "الصحفي المحترف يستخدم اللباقة الصارمة مثل Permítame insistir.")
            ],
            ["permítame insistir", "con el debido respeto"],
            "Permítame insistir هي الصيغة الاحترافية لإعادة توجيه السؤال بحزم ولباقة."
        ),
        order_ex(
            "ex-b2-enp-4",
            "رتّب الجملة لنقل تأكيد المسؤول الصحفي بحزم",
            ["grammar", "writing"], 2,
            ["El", "ministro", "aseguró", "que", "cumplirá", "sus", "promesas"],
            "El ministro aseguró que cumplirá sus promesas",
            "الترتيب: الفاعل El ministro ثم فعل القول aseguró ثم أداة الربط que ثم الفعل cumplirá ثم المفعول sus promesas.",
            ["asegurar", "declaración"]
        ),
        choice_ex(
            "ex-b2-enp-5", "listen_choose",
            "استمع لسؤال الصحفي وحدد العبارة المهذبة التي استهل بها استدراكه",
            ["listening", "vocabulary"], 2,
            "استمع للمقابلة الإذاعية الحية مع المسؤول",
            "Con el debido respeto, los ciudadanos merecen una explicación más detallada.",
            "مع كامل الاحترام والتقدير، يستحق المواطنون تفسيراً أكثر تفصيلاً.",
            [
                opt("a", "Con el debido respeto", "مع الاحترام والتقدير الواجب (الصواب)", True),
                opt("b", "Sin ninguna duda", "بلا أدنى شك", False, "الصحفي استهل بـ Con el debido respeto."),
                opt("c", "Por consiguiente", "وبالتالي", False, "الاستهلال كان Con el debido respeto.")
            ],
            ["con el debido respeto", "permítame insistir"],
            "الصحفي قال بتهذيب وحزم: 'Con el debido respeto'.",
            audioKey="pending/b2_con_debido_respeto_ciudadanos.mp3",
            speechEs="Con el debido respeto, los ciudadanos merecen una explicación más detallada."
        ),
        speak_ex(
            "ex-b2-enp-6",
            "انطق سؤالك الصحفي الاستقصائي بحزم ولباقة دبلوماسية",
            ["speaking", "pronunciation"], 2,
            "انطق الجملة التالية لطلب توضيح رسمي في المؤتمر الصحفي:",
            "Permítame insistir, señor ministro: ¿cuándo se harán públicas las conclusiones del informe?",
            "اسمح لي بالإلحاح معالي الوزير: متى ستُعلن نتائج التقرير للرأي العام؟",
            "pending/b2_permitame_insistir_senor_ministro.mp3",
            ["permítame insistir", "puntualizar", "asegurar"],
            "Permítame insistir, señor ministro: ¿cuándo se harán públicas las conclusiones del informe?",
            "انتبه لنبرة السؤال الاستقصائي المهذب والقوي في آن واحد."
        )
    ]
    return lesson_doc(doc, exs, level="B2")


# ==============================================================================
# UNIT 3: b2-u3-literature (نصوص أدبية مبسطة والصور البلاغية)
# ==============================================================================

def make_lesson_literatura_narrativa_contemporanea():
    slug = "b2-literatura-narrativa-contemporanea"
    doc = {
        "slug": slug,
        "unitSlug": "b2-u3-literature",
        "levelCode": "B2",
        "titleAr": "السرد الأدبي المعاصر: فهم النصوص وعوالم الرواية",
        "titleEs": "La narrativa contemporánea: Comprensión lectora y mundos ficcionales",
        "subtitleAr": "تحليل مقاطع من غابرييل غارسيا ماركيز وكارلوس زافون، وبناء الفضاء الروائي",
        "order": 1,
        "estimatedMinutes": 20,
        "cefrLevel": "B2",
        "review": review_block(),
        "pedagogy": {
            "learningObjectivesAr": [
                "أن يقرأ المتعلم نصوصاً أدبية من الأدب الإسباني واللاتيني ويفهم دلالاتها العميقة.",
                "أن يتعرف على تقنيات السرد الأدبي: narrador omnisciente, atmósfera, trama, desenlace.",
                "أن يحلل تداخل الأزمنة السردية في الوصف الأدبي للأماكن والأشخاص."
            ],
            "grammarPoints": [
                {
                    "titleAr": "استخدامات الأزمنة في السرد الأدبي التعبيري",
                    "explanationAr": "1. **رسم الأجواء والمشاهد بـ Imperfecto**:\n- *La lluvia caía sin tregua sobre los tejados de la ciudad vieja* (وصف مستمر وحالة).\n2. **كسر الإيقاع السردي بالحدث الفجائي بـ Indefinido**:\n- *De repente, una sombra cruzó el umbral de la puerta* (حدث قاطع ومفاجئ).\n3. **الاسترجاع الزمني بالماضي الأسبق Pluscuamperfecto**:\n- *Aquel coronel había esperado una carta durante más de treinta años*."
                }
            ],
            "commonMistakesAr": [
                "الترجمة الحرفية للصور البلاغية التي تفسد جمالية النص (مثل ترجمة *sin tregua* بـ 'بلا هدنة عسكرية' بدلاً من 'بلا انقطاع أو هوادة').",
                "الخلط بين الحدث الرئيسي والخلفية الوصفية في التحليل الأدبي للنصوص."
            ],
            "dialectNotes": [
                {
                    "region": "EG",
                    "noteAr": "في قراءة الروايات بنقول «الكاتب راسم جو غامض والأحداث بتشدك للنهاية». بالإسبانية: El autor crea una atmósfera de misterio envolvente que atrapa al lector hasta el desenlace."
                }
            ],
            "culturalNoteAr": "الأدب المكتوب بالإسبانية حاز على ست جوائز نوبل (بينهم غابرييل غارسيا ماركيز وماريو فارغاس يوسا)، وتعتبر 'الواقعية السحرية' Realismo Mágico من أبرز مساهماته العالمية."
        },
        "contentBlocks": [
            {
                "id": f"cb-{slug}-intro",
                "type": "explanation",
                "titleAr": "مفاتيح التحليل الروائي والسردي",
                "bodyAr": "المصطلحات الأدبية:\n- **la trama**: الحبكة الروائية وتصاعد الأحداث\n- **el desenlace**: الحل وخاتمة الرواية أو العقدة\n- **la atmósfera**: الجو النفسي والعام الذي يفرضه المكان والوصف\n- **el narrador omnisciente**: الراوي العليم الذي يعرف دواخل الشخصيات\n- **el umbral**: العتبة وبداية المدخل\n- **sin tregua**: بلا هوادة وبلا توقف",
                "examples": [
                    {"es": "La trama de la novela gira en torno a un enigma familiar no resuelto.", "ar": "تدور حبكة الرواية حول لغز عائلي لم يُحل بعد."},
                    {"es": "El autor logra crear una atmósfera de suspense que cautiva al lector.", "ar": "ينجح الكاتب في خلق جو من التشويق يأسر القارئ."},
                    {"es": "Al llegar al umbral de la biblioteca olvidada, Daniel sintió un escalofrío.", "ar": "عند وصوله إلى عتبة المكتبة المنسية، شعر دانيال بقشعريرة تسري في بدنه."}
                ]
            }
        ],
        "newVocabulary": ["trama", "desenlace", "atmósfera", "narrador omnisciente", "umbral", "sin tregua"],
        "reviewVocabulary": ["novela", "autor"]
    }

    exs = [
        choice_ex(
            "ex-b2-lnc-1", "word_choice",
            "اختر المصطلح الأدبي الذي يدل على حبكة القصة وتتابع أحداثها",
            ["vocabulary"], 1,
            "ما هي الكلمة الإسبانية التي تعني 'الحبكة الروائية'؟",
            "La _____ de la historia se complica cuando aparece un personaje inesperado.",
            "تتعقد ... القصة عندما تظهر شخصية غير متوقعة.",
            [
                opt("a", "trama", "الحبكة الروائية (الصواب)", True),
                opt("b", "editorial", "الافتتاحية", False, "في الأدب تسمى الحبكة la trama."),
                opt("c", "repercusión", "التداعيات", False, "الحبكة هي la trama.")
            ],
            ["trama", "desenlace"],
            "la trama هي الحبكة السردية وتتابع العقد والأحداث في الرواية."
        ),
        fill_ex(
            "ex-b2-lnc-2",
            "أكمل بالمصطلح الذي يعني حل العقدة وخاتمة القصة: (el _____)",
            ["vocabulary", "writing"], 1,
            "اكتب الكلمة المذكرة التي تعني 'خاتمة الرواية وفك العقدة السردية' (el _____)",
            "Nadie se esperaba un _____ tan trágico y conmovedor al final del libro.",
            "لم يتوقع أحد ... مأساوياً ومؤثراً إلى هذا الحد في نهاية الكتاب.",
            ["desenlace"],
            ["desenlace"],
            "el desenlace هو الخاتمة وفك العقدة الدرامية للقصة."
        ),
        choice_ex(
            "ex-b2-lnc-3", "word_choice",
            "حدد نوع الراوي الذي يعلم بكل مشاعر وأفكار الشخصيات وخفاياها",
            ["vocabulary"], 2,
            "ماذا نسمي الراوي الكلي المعرفة في النقد الأدبي؟",
            "La historia está narrada por un _____, que conoce los pensamientos íntimos de todos.",
            "تُروى القصة عبر ...، يعلم الأفكار الحميمة للجميع.",
            [
                opt("a", "narrador omnisciente", "الراوي العليم المحيط بكل شيء (الصواب)", True),
                opt("b", "testigo", "شاهد عيان محدود", False, "الراوي الذي يعرف كل خفايا الشخصيات يسمى narrador omnisciente."),
                opt("c", "protagonista", "البطل نفسه", False, "المحيط بكل الشخصيات هو الراوي العليم narrador omnisciente.")
            ],
            ["narrador omnisciente", "atmósfera", "trama"],
            "el narrador omnisciente هو الراوي العليم في السرد الروائي."
        ),
        order_ex(
            "ex-b2-lnc-4",
            "رتّب الجملة الوصفية الأدبية لبناء الجو الروائي الغامض",
            ["grammar", "writing"], 2,
            ["El", "viento", "soplaba", "sin", "tregua", "en", "la", "noche"],
            "El viento soplaba sin tregua en la noche",
            "الترتيب: الفاعل El viento ثم الفعل الماضي الوصفي soplaba ثم التعبير sin tregua ثم شبه الجملة en la noche.",
            ["sin tregua", "atmósfera"]
        ),
        choice_ex(
            "ex-b2-lnc-5", "listen_choose",
            "استمع للمقطع الروائي المسجل وحدد المكان الذي توقف عنده البطل",
            ["listening", "vocabulary"], 2,
            "استمع للقراءة الأدبية البليغة وحدد موضع الوقوف",
            "Se detuvo temblando en el umbral de la vieja mansión abandonada.",
            "توقف وهو يرتجف عند عتبة القصر القديم المهجور.",
            [
                opt("a", "en el umbral", "عند العتبة ومدخل القصر (الصواب)", True),
                opt("b", "en el tejado", "على السطح", False, "الراوي قال: en el umbral."),
                opt("c", "en el sótano", "في القبو", False, "الوقوف كان عند العتبة: en el umbral.")
            ],
            ["umbral", "sin tregua"],
            "القارئ قال: 'en el umbral de la vieja mansión'.",
            audioKey="pending/b2_umbral_mansion_abandonada.mp3",
            speechEs="Se detuvo temblando en el umbral de la vieja mansión abandonada."
        ),
        speak_ex(
            "ex-b2-lnc-6",
            "انطق التعبير الأدبي بنبرة سردية مؤثرة ورخيمة",
            ["speaking", "pronunciation"], 2,
            "انطق الجملة التالية كراوٍ أدبي محترف في قراءة قصة:",
            "La novela envuelve al lector en una atmósfera mágica desde las primeras páginas.",
            "تأسر الرواية القارئ في جو سحري آخاذ منذ الصفحات الأولى.",
            "pending/b2_novela_atmosfera_magica.mp3",
            ["atmósfera", "trama", "desenlace"],
            "La novela envuelve al lector en una atmósfera mágica desde las primeras páginas.",
            "انتبه لنطق atmósfera بالتشديد على المقطع الأول والمد الإيقاعي الجميل."
        )
    ]
    return lesson_doc(doc, exs, level="B2")


def make_lesson_metaforas_recursos_literarios():
    slug = "b2-metaforas-recursos-literarios"
    doc = {
        "slug": slug,
        "unitSlug": "b2-u3-literature",
        "levelCode": "B2",
        "titleAr": "الاستعارة والصور البلاغية: التعبير المجازي والأدبي الرفيع",
        "titleEs": "Metáforas y recursos literarios: Lenguaje figurado y expresividad poética",
        "subtitleAr": "التشبيه، الاستعارة، التشخيص، وفهم المعاني المجازية في الثقافة الإسبانية",
        "order": 2,
        "estimatedMinutes": 20,
        "cefrLevel": "B2",
        "review": review_block(),
        "pedagogy": {
            "learningObjectivesAr": [
                "أن يتعرف المتعلم على الصور البلاغية الرئيسية: metáfora, símil, personificación, hipérbole.",
                "أن يفسر المعنى المجازي الكامن وراء التعبيرات الشعرية الإسبانية.",
                "أن يبتكر تعبيرات مجازية راقية لإثراء كتاباته الوصفية والمقالية."
            ],
            "grammarPoints": [
                {
                    "titleAr": "التراكيب اللغوية للصياغات البلاغية",
                    "explanationAr": "1. **التشبيه الصريح (El símil)**:\n- استخدام أدوات المقارنة: *como, cual, a modo de, semejante a*.\n- *Tus ojos brillaban como dos luceros en la penumbra*.\n2. **الاستعارة المكنية والتصريحية (La metáfora)**:\n- مطابقة مستعار لمستعار منه مباشرة دون أداة:\n- *El tiempo es oro* / *El otoño de la vida* (رمز للشيخوخة).\n3. **التشخيص وإعطاء الجماد صفات بشرية (La personificación)**:\n- *La ciudad despertaba lentamente* / *El viento susurraba secretos*."
                }
            ],
            "commonMistakesAr": [
                "الفهم الحرفي للصور البلاغية (مثل اعتبار *lágrimas de cocodrilo* دموع حقيقية لتمساح بدلاً من كونها دموع تماسيح خادعة ومنافقة).",
                "الخلط بين الاستعارة (بلا أداة) والتشبيه (بأداة تشبيه مثل como)."
            ],
            "dialectNotes": [
                {
                    "region": "EG",
                    "noteAr": "في مصر بنقول «ده كلامه بينقط عسل» أو «الوقت سرقنا». بالإسبانية المقابل المجازي: El tiempo vuela (الوقت يطير) و Sus palabras destilan dulzura."
                }
            ],
            "culturalNoteAr": "الشعر الإسباني في القرن الذهبي (غونغورا وكيفيدو) وفي جيل 27 (فيديريكو غارثيا لوركا) تميز بالثراء الاستعاري المبهر المستلهم من الطبيعة الأندلسية."
        },
        "contentBlocks": [
            {
                "id": f"cb-{slug}-intro",
                "type": "explanation",
                "titleAr": "الأدوات البلاغية ومجازاتها",
                "bodyAr": "أهم الصور البلاغية:\n- **la metáfora**: الاستعارة المباشرة بنقل المعنى من مجال لآخر\n- **el símil**: التشبيه الصريح بوجود أداة تشبيه (como)\n- **la personificación**: التشخيص وإضفاء صفات إنسانية على الطبيعة والجماد\n- **la hipérbole**: المبالغة والغلو الشعري لتأكيد المعنى\n- **evocar**: يستحضر الذاكرة والمشاعر\n- **la penumbra**: الغبش والضوء الخافت بين النور والظلمة",
                "examples": [
                    {"es": "El verso 'el rumor del río lloraba en la noche' es una clara personificación.", "ar": "البيت 'خرير النهر كان يبكي في الليل' تشخيص بلاغي واضح."},
                    {"es": "Al decir 'su voz era música para mis oídos', el autor emplea una metáfora.", "ar": "بقوله 'صوته كان موسيقى لآذاني'، يستخدم الكاتب استعارة."},
                    {"es": "Aquella melodía melancólica lograba evocar recuerdos de su lejana infancia.", "ar": "استطاع ذلك اللحن الشجي أن يستحضر ذكريات طفولته البعيدة."}
                ]
            }
        ],
        "newVocabulary": ["metáfora", "símil", "personificación", "hipérbole", "evocar", "penumbra"],
        "reviewVocabulary": ["poesía", "verso"]
    }

    exs = [
        choice_ex(
            "ex-b2-mrl-1", "word_choice",
            "حدد الصورة البلاغية في جملة: El viento aullaba de dolor entre los árboles",
            ["vocabulary"], 1,
            "ما هي البلاغة المستخدمة عندما ينسب للرياح فعل 'العويل من الألم'؟",
            "El viento aullaba de dolor en medio de la tormenta.",
            "كانت الريح تعوي من الألم في قلب العاصفة.",
            [
                opt("a", "personificación", "تشخيص للريح بصفات بشرية حيوانية متألمة (الصواب)", True),
                opt("b", "símil", "تشبيه صريح", False, "لا توجد أداة تشبيه como بل نُسب الفعل مباشرة للريح فصار تشخيصاً personificación."),
                opt("c", "hipérbole", "مبالغة رقمية", False, "الصورة الأدبية تسمى التشخيص personificación.")
            ],
            ["personificación", "símil", "metáfora"],
            "la personificación هي خلع الصفات الإنسانية والشعورية على الجماد والظواهر الطبيعية."
        ),
        fill_ex(
            "ex-b2-mrl-2",
            "أكمل بالمصطلح الذي يعني المبالغة الفائقة لتأكيد المعنى: (la _____)",
            ["vocabulary", "writing"], 1,
            "اكتب الكلمة البلاغية المؤنثة التي تعني 'المبالغة والمجاز التضخيمي' (la _____)",
            "Al decir 'te he esperado mil años' el poeta recurre a una evidente _____ poética.",
            "بقوله 'انتظرتك ألف عام' يلجأ الشاعر إلى ... شعرية واضحة.",
            ["hipérbole"],
            ["hipérbole"],
            "la hipérbole هي المبالغة البلاغية غير الحرفية لتأكيد عظم الشعور."
        ),
        choice_ex(
            "ex-b2-mrl-3", "word_choice",
            "اختر الفعل الذي يعني استحضار المشاعر والذكريات القديمة في النفس",
            ["vocabulary"], 2,
            "أي فعل أدبي يعني 'استدعاء الذكرى وإيقاظها في الوجدان'؟",
            "El aroma del jazmín lograba _____ las tardes de verano en el patio andaluz.",
            "استطاع شذا الياسمين أن ... أمسيات الصيف في الفناء الأندلسي.",
            [
                opt("a", "evocar", "يستحضر الذكرى والمشاعر (الصواب)", True),
                opt("b", "olvidar", "ينسى", False, "إيقاظ الذكريات يسمى evocar."),
                opt("c", "sesgar", "ينحاز", False, "الفعل الأدبي الدقيق هو evocar.")
            ],
            ["evocar", "penumbra"],
            "evocar يعني استحضار صورة أو ذكرى أو إحساس في الذاكرة والوجدان."
        ),
        order_ex(
            "ex-b2-mrl-4",
            "رتّب الجملة الشعرية الوصفية بأسلوب التشبيه الصريح",
            ["grammar", "writing"], 2,
            ["Tus", "ojos", "brillan", "como", "estrellas", "en", "la", "penumbra"],
            "Tus ojos brillan como estrellas en la penumbra",
            "الترتيب: المبتدأ Tus ojos ثم الفعل brillan ثم أداة التشبيه como ثم المشبه به estrellas ثم شبه الجملة en la penumbra.",
            ["símil", "penumbra"]
        ),
        choice_ex(
            "ex-b2-mrl-5", "listen_choose",
            "استمع للشطر الشعري وحدد الضوء الخافت الذي يصفه الشاعر",
            ["listening", "vocabulary"], 2,
            "استمع للإلقاء الشعري الرقيق وحدد الكلمة الدالة على الغبش والضوء الشاحب",
            "Caminaban en silencio envueltos en la dulce penumbra del atardecer.",
            "كانا يسيران في صمت يلفهما غبش الغروب العذب.",
            [
                opt("a", "penumbra", "الضوء الخافت الشاحب بين النور والظلمة (الصواب)", True),
                opt("b", "claridad", "الوضوح التام والسطوع", False, "الشاعر قال: en la dulce penumbra."),
                opt("c", "tormenta", "عاصفة", False, "الكلمة المذكورة هي penumbra.")
            ],
            ["penumbra", "evocar"],
            "الشاعر قال بوضوح: 'la dulce penumbra del atardecer'.",
            audioKey="pending/b2_dulce_penumbra_atardecer.mp3",
            speechEs="Caminaban en silencio envueltos en la dulce penumbra del atardecer."
        ),
        speak_ex(
            "ex-b2-mrl-6",
            "انطق التعبير الاستعاري بإحساس شعري ومخارج حروف واضحة",
            ["speaking", "pronunciation"], 2,
            "انطق العبارة البلاغية التالية بجمال ورصانة لغوية:",
            "El autor utiliza una poderosa metáfora para describir el paso implacable del tiempo.",
            "يوظف الكاتب استعارة قوية لوصف مسير الوقت الذي لا يرحم.",
            "pending/b2_poderosa_metafora_tiempo.mp3",
            ["metáfora", "evocar", "símil"],
            "El autor utiliza una poderosa metáfora para describir el paso implacable del tiempo.",
            "انتبه لنطق metáfora مع النبرة على حرف á و implacable بنطق فصيح."
        )
    ]
    return lesson_doc(doc, exs, level="B2")


def make_lesson_analisis_personajes_relato():
    slug = "b2-analisis-personajes-relato"
    doc = {
        "slug": slug,
        "unitSlug": "b2-u3-literature",
        "levelCode": "B2",
        "titleAr": "تحليل الشخصيات في القصة: البعد النفسي والصراع الداخلي",
        "titleEs": "Análisis de personajes: Dimensión psicológica, conflicto interior y evolución",
        "subtitleAr": "الشخصيات المركبة والمسطحة، الدوافع الخفية، والتحول الدرامي عبر الأحداث",
        "order": 3,
        "estimatedMinutes": 20,
        "cefrLevel": "B2",
        "review": review_block(),
        "pedagogy": {
            "learningObjectivesAr": [
                "أن يحلل المتعلم الأبعاد النفسية والأخلاقية للشخصية الروائية بدقة.",
                "أن يستخدم مصطلحات النقد السردي: personaje redondo/plano, conflicto interior, móvil, antagonista.",
                "أن يصف التحول والتطور الدرامي للشخصية من بداية القصة إلى نهايتها."
            ],
            "grammarPoints": [
                {
                    "titleAr": "تراكيب التعبير عن الصراع النفسي والتطور الذاتي",
                    "explanationAr": "1. **أفعال الصيرورة والتحول المعنوي والنفسي**:\n- *Volverse + صفة*: Se volvió desconfiado y solitario tras la traición.\n- *Llegar a ser*: Con los años llegó a ser una figura respetada y compasiva.\n2. **التعبير عن الصراع الداخلي المزدوج**:\n- *Debatirse entre*: El protagonista se debate entre el deber moral y el amor prohibido.\n3. **كشف الدوافع السلوكية**:\n- *Lo que mueve al personaje no es la ambición, sino el miedo al rechazo*."
                }
            ],
            "commonMistakesAr": [
                "استخدام *ponerse* للتعبير عن تغير الشخصية العميق الدائم؛ *ponerse* للحالات العارضة المؤقتة فقط (مثل الغضب العابر)، بينما التغير في الطبع والجوهر يأخذ *volverse* أو *hacerse*.",
                "وصف الشخصية بصفات سطحية دون تحليل الدوافع النفسية العميقة التي تقف وراء أفعالها."
            ],
            "dialectNotes": [
                {
                    "region": "EG",
                    "noteAr": "في تحليل شخصيات الرواية بنقول «البطل محتار بين واجبه وبين حبه وعنده صراع نفسي رهيب». بالإسبانية: El protagonista se debate entre su deber y su pasión en un constante conflicto interior."
                }
            ],
            "culturalNoteAr": "الأدب الإسباني يتميز بشخصيات خالدة تمثل الصراع بين المثالية والواقعية، ونموذجها الأبرز هو ثنائية 'دون كيخوتي وسانشو بانثا' لميغيل دي ثيربانتس."
        },
        "contentBlocks": [
            {
                "id": f"cb-{slug}-intro",
                "type": "explanation",
                "titleAr": "أدوات تفكيك الشخصية الروائية",
                "bodyAr": "المفاهيم النقدية:\n- **el conflicto interior**: الصراع النفسي الداخلي بين مبدأين متصارعين\n- **debatirse entre**: يتأرجح ويحتار ويتصارع في داخله بين أمرين\n- **el personaje redondo**: الشخصية المركبة ثلاثية الأبعاد التي تتطور وتفاجئ القارئ\n- **el antagonista**: الغريم والخصم المقابل للبطل في الحبكة\n- **el móvil**: الدافع والمحرك الحقيقي الخفي وراء السلوك\n- **la redención**: الخلاص والتكفير عن الذنب والتطهر الأخلاقي",
                "examples": [
                    {"es": "El protagonista es un personaje redondo cuya evolución moral asombra al lector.", "ar": "البطل شخصية مركبة متطورة يُذهل تحولها الأخلاقي القارئ."},
                    {"es": "El personaje se debate entre el deber patriótico y su amor clandestino.", "ar": "تتصارع الشخصية في داخلها بين الواجب الوطني وحبها السري."},
                    {"es": "Al final del relato, el héroe busca la redención a través del sacrificio.", "ar": "في ختام القصة، ينشد البطل الخلاص والتطهر عبر التضحية."}
                ]
            }
        ],
        "newVocabulary": ["conflicto interior", "debatirse entre", "personaje redondo", "antagonista", "móvil", "redención"],
        "reviewVocabulary": ["personaje", "héroe"]
    }

    exs = [
        choice_ex(
            "ex-b2-apr-1", "word_choice",
            "اختر المصطلح الذي يصف الشخصية المتطورة الغنية نفسياً التي تتغير مع الأحداث",
            ["vocabulary"], 1,
            "ماذا نسمي الشخصية المتطورة درامياً ذات الأبعاد النفسية العميقة؟",
            "Lejos de ser un arquetipo simple, es un _____ con contradicciones humanas.",
            "بعيداً عن كونه نموذجاً بسيطاً، فهو ... يحمل تناقضات إنسانية عميقة.",
            [
                opt("a", "personaje redondo", "شخصية مركبة نامية ومتطورة (الصواب)", True),
                opt("b", "personaje plano", "شخصية مسطحة ثابتة", False, "الشخصية المعقدة النامية تسمى personaje redondo."),
                opt("c", "antagonista", "غريم فقط", False, "المصطلح النقدي للشخصية المعقدة هو personaje redondo.")
            ],
            ["personaje redondo", "antagonista"],
            "el personaje redondo هو الشخصية المعقدة التي تشهد تحولاً وتطوراً نفسياً خلال الرواية."
        ),
        fill_ex(
            "ex-b2-apr-2",
            "صرف فعل debatirse في الحاضر مع الغائب المفرد هو: (se debate)",
            ["grammar", "writing"], 1,
            "اكتب تصريف الفعل: El capitán _____ entre la lealtad y su propia conciencia.",
            "A lo largo de la novela, el juez _____ entre aplicar la ley estricta o mostrar clemencia.",
            "على مدار الرواية، يتأرجح القاضي في صراع داخلي بين تطبيق القانون الصارم أو إظهار الرحمة.",
            ["debatirse entre"],
            ["se debate"],
            "تصريف الفعل الانعكاسي مع الغائب المفرد: se debate."
        ),
        choice_ex(
            "ex-b2-apr-3", "word_choice",
            "حدد المصطلح الذي يعبر عن الدافع والمحرك السلوكي الخفي لأفعال البطل",
            ["vocabulary"], 2,
            "ما هي الكلمة التي تعني 'الدافع النفسي والمحرك الحقيقي وراء اتخاذ القرار'؟",
            "El detective descubrió que el verdadero _____ del crimen fue la venganza.",
            "اكتشف المحقق أن ... الحقيقي وراء الجريمة كان الانتقام.",
            [
                opt("a", "móvil", "الدافع والمحرك الخفي (الصواب)", True),
                opt("b", "desenlace", "الحل النهائي", False, "الدافع وراء الفعل يسمى el móvil."),
                opt("c", "umbral", "العتبة", False, "المحرك يسمى el móvil.")
            ],
            ["móvil", "redención"],
            "el móvil هو الدافع والعلة التي تحرك الشخصية لارتكاب الفعل أو اتخاذ القرار."
        ),
        order_ex(
            "ex-b2-apr-4",
            "رتّب الجملة النقدية لتوضيح الصراع الداخلي للبطل",
            ["grammar", "writing"], 2,
            ["El", "antagonista", "sufre", "un", "profundo", "conflicto", "interior"],
            "El antagonista sufre un profundo conflicto interior",
            "الترتيب: الفاعل El antagonista ثم الفعل sufre ثم المفعول un profundo conflicto interior.",
            ["antagonista", "conflicto interior"]
        ),
        choice_ex(
            "ex-b2-apr-5", "listen_choose",
            "استمع للتحليل النقدي وحدد الغاية الأخلاقية التي ينشدها البطل في النهاية",
            ["listening", "vocabulary"], 2,
            "استمع لحديث الناقد الأدبي عن رواية التوبة والتحول",
            "Tras sus graves errores, el protagonista busca desesperadamente la redención.",
            "بعد أخطائه الفادحة، يبحث البطل باستماتة عن الخلاص والتطهر من الذنب.",
            [
                opt("a", "redención", "الخلاص والتطهر الأخلاقي (الصواب)", True),
                opt("b", "venganza", "الانتقام الأعمى", False, "الناقد أكد أنه يبحث عن la redención."),
                opt("c", "fama", "الشهرة", False, "المطلب كان الخلاص الأخلاقي redención.")
            ],
            ["redención", "móvil"],
            "الناقد قال: 'busca desesperadamente la redención'.",
            audioKey="pending/b2_redencion_errores_protagonista.mp3",
            speechEs="Tras sus graves errores, el protagonista busca desesperadamente la redención."
        ),
        speak_ex(
            "ex-b2-apr-6",
            "انطق عبارتك النقدية لتحليل شخصية الرواية بأسلوب أكاديمي فصيح",
            ["speaking", "pronunciation"], 2,
            "انطق الجملة التالية لتقديم تقييم نقدي معمق للشخصية الروائية:",
            "El personaje redondo se debate entre sus ambiciones personales y el deber moral.",
            "تتصارع الشخصية المركبة في داخلها بين طموحاتها الشخصية والواجب الأخلاقي.",
            "pending/b2_personaje_redondo_debate_deber.mp3",
            ["personaje redondo", "debatirse entre", "conflicto interior"],
            "El personaje redondo se debate entre sus ambiciones personales y el deber moral.",
            "انتبه لنطق personaje redondo و se debate بنبرة تحليلية واثقة."
        )
    ]
    return lesson_doc(doc, exs, level="B2")


def make_lesson_expresion_estetica_emociones():
    slug = "b2-expresion-estetica-emociones"
    doc = {
        "slug": slug,
        "unitSlug": "b2-u3-literature",
        "levelCode": "B2",
        "titleAr": "التعبير الجمالي عن المشاعر: لغة الوجدان في الأدب",
        "titleEs": "La expresión estética de las emociones: Sensibilidad poética y léxico afectivo",
        "subtitleAr": "التعبير عن الحنين (la nostalgia)، الشجن، الهيام، والفقد بأسلوب راقٍ",
        "order": 4,
        "estimatedMinutes": 20,
        "cefrLevel": "B2",
        "review": review_block(),
        "pedagogy": {
            "learningObjectivesAr": [
                "أن يوظف المتعلم معجماً عاطفياً أدبياً رفيعاً يتجاوز التعبيرات البسيطة المباشرة.",
                "أن يعبر عن المشاعر المركبة: añoranza, desasosiego, congoja, desolación, plenitud.",
                "أن يركب جملاً وجدانية شعرية تعكس التجربة الإنسانية العميقة."
            ],
            "grammarPoints": [
                {
                    "titleAr": "التراكيب التعبيرية للمشاعر المعقدة والشجن",
                    "explanationAr": "1. **التعبير عن الاستغراق في الشعور**:\n- *Inundar / Embargar*: La nostalgia lo inundó al contemplar la vieja fotografía.\n- *Sentir un profundo desasosiego*: أن يشعر بقلق واضطراب باطني مبهم.\n2. **التعبير عن الشوق والحنين (Añoranza)**:\n- *Añorar + اسم*: Añoro los tiempos en que éramos libres de preocupaciones.\n3. **الأفعال التي تأخذ طابعاً وجدانياً مؤثراً**:\n- *Conmover el alma*: هز الوجدان وأثّر في أعماق الروح."
                }
            ],
            "commonMistakesAr": [
                "استخدام *estar triste* دائماً للتعبير عن الحزن الوجودي الراقي؛ الأدب الإسباني يوفر مفردات بالغة الدقة مثل *el desasosiego* (القلق الوجودي) و *la añoranza* (الشوق المحموم).",
                "عدم التفريق بين nostalgia (حنين عام للماضي) و añoranza (شوق مؤلم لشخص أو مكان مفقود بعينه)."
            ],
            "dialectNotes": [
                {
                    "region": "EG",
                    "noteAr": "في التعبير عن الحنين الشديد بنقول «حاسس بوحشة وغربة وشوق فظيع لأيام زمان». بالإسبانية: Siento una inmensa añoranza y un desasosiego constante al recordar mi tierra."
                }
            ],
            "culturalNoteAr": "مصطلح 'Morriña' في غاليسيا (شمال إسبانيا) ومصطلح 'Saudade' الشقيق له في البرتغالية يمثلان ذروة التعبير الثقافي عن الحنين والشوق للأرض البعيدة."
        },
        "contentBlocks": [
            {
                "id": f"cb-{slug}-intro",
                "type": "explanation",
                "titleAr": "معجم الوجدان والمشاعر العميقة",
                "bodyAr": "المفردات الوجدانية:\n- **la añoranza**: الشوق العميق والحنين المؤلم لشيء أو شخص غائب\n- **el desasosiego**: القلق والاضطراب النفسي الداخلي وانعدام السكينة\n- **la congoja**: الغصة وضيق الصدر والحزن المعتصر للقلب\n- **la plenitud**: الامتلاء الروحي والرضا والسكينة التامة\n- **embargar**: يغمر المشاعر ويستولي على الوجدان بالكامل\n- **conmovedor**: مؤثر ومبكي ويهز المشاعر الإنسانية",
                "examples": [
                    {"es": "Una extraña sensación de desasosiego no lo dejaba dormir en paz.", "ar": "إحساس غريب بالاضطراب والقلق الداخلي لم يكن يدعه ينام بسلام."},
                    {"es": "Sintió una profunda añoranza al escuchar la canción de su juventud.", "ar": "شعر بحنين جارف وشوق عميق عند سماع أغنية شبابه."},
                    {"es": "La música de aquel violín era tan conmovedora que arrancó lágrimas a los presentes.", "ar": "كانت موسيقى ذلك الكمان مؤثرة لدرجة أنها استدرت دموع الحاضرين."}
                ]
            }
        ],
        "newVocabulary": ["añoranza", "desasosiego", "congoja", "plenitud", "embargar", "conmovedor"],
        "reviewVocabulary": ["tristeza", "emoción"]
    }

    exs = [
        choice_ex(
            "ex-b2-eee-1", "word_choice",
            "اختر المفردة الأدبية التي تعني القلق الباطني المربك وغياب السكينة",
            ["vocabulary"], 1,
            "ما هي الكلمة الوجدانية التي تدل على 'الاضطراب الروحي وانعدام الطمأنينة'؟",
            "Esa noticia inesperada causó un hondo _____ en el ánimo de la familia.",
            "أثار ذلك النبأ غير المتوقع ... عميقاً في وجدان الأسرة.",
            [
                opt("a", "desasosiego", "القلق والاضطراب الباطني وانعدام السكينة (الصواب)", True),
                opt("b", "plenitud", "الامتلاء والسكينة التامة", False, "الاضطراب المعاكس للسكينة هو el desasosiego."),
                opt("c", "sesgo", "تحيز صحفي", False, "المعنى الوجداني المقصود هو desasosiego.")
            ],
            ["desasosiego", "plenitud"],
            "el desasosiego هو الشعور بالانزعاج والاضطراب النفسي والقلق الوجودي الداخلي."
        ),
        fill_ex(
            "ex-b2-eee-2",
            "أكمل بالمفردة التي تعني الشوق العميق والحنين لأيام خلت: (la _____)",
            ["vocabulary", "writing"], 1,
            "اكتب الكلمة المؤنثة التي تعني 'الشوق المؤلم والحنين للغائب' (la _____)",
            "Vivía en el extranjero sumido en una amarga _____ por su patria lejana.",
            "كان يعيش في الغربة غارقاً في ... مريرة لوطنه البعيد.",
            ["añoranza"],
            ["añoranza"],
            "la añoranza هي الحنين الجارف والشوق المؤثر للأحباب أو الوطن."
        ),
        choice_ex(
            "ex-b2-eee-3", "word_choice",
            "حدد الفعل الذي يعبر عن استيلاء العاطفة الجياشة على كامل وجدان الإنسان",
            ["vocabulary"], 2,
            "أي فعل مجازي يعني 'أن تغمر المشاعر الإنسان وتسيطر على كيانه'؟",
            "Al contemplar el cuadro, una inmensa tristeza pareció _____ todo su ser.",
            "عند تأمل اللوحة، بدا وكأن حزناً غامراً ... كل كيانه ووجدانه.",
            [
                opt("a", "embargar", "يغمر ويستولي على الوجدان بالكامل (الصواب)", True),
                opt("b", "promulgar", "يصدر قانوناً", False, "الفعل العاطفي الدقيق هو embargar."),
                opt("c", "puntualizar", "يدقق في تفصيل", False, "استيلاء المشاعر يسمى embargar el ánimo.")
            ],
            ["embargar", "congoja"],
            "embargar المشاعر يعني أن تستولي عليه تماماً وتغمر كل حواسه."
        ),
        order_ex(
            "ex-b2-eee-4",
            "رتّب الجملة لوصف التأثير العاطفي المؤثر والمبكي للنص",
            ["grammar", "writing"], 2,
            ["Fue", "un", "discurso", "profundamente", "conmovedor", "para", "todos"],
            "Fue un discurso profundamente conmovedor para todos",
            "الترتيب: الفعل Fue ثم الموصوف un discurso ثم الظرف profundamente ثم النعت conmovedor ثم شبه الجملة para todos.",
            ["conmovedor", "plenitud"]
        ),
        choice_ex(
            "ex-b2-eee-5", "listen_choose",
            "استمع للقصيدة الصوتية وحدد الشعور الذي عبر عنه الكاتب بغصة الفؤاد",
            ["listening", "vocabulary"], 2,
            "استمع للتسجيل الصوتي المؤثر",
            "Sentía una congoja inexplicable en el pecho al despedirse en la estación.",
            "كان يشعر بغصة واعتصار لا يفسر في صدره عند الوداع في المحطة.",
            [
                opt("a", "congoja", "غصة واعتصار القلب بالحزن (الصواب)", True),
                opt("b", "alegría", "فرحة وابتهاج", False, "المتحدث قال: una congoja inexplicable."),
                opt("c", "plenitud", "امتلاء واكتفاء", False, "الشعور كان غصة congoja.")
            ],
            ["congoja", "desasosiego"],
            "المتحدث قال بألم: 'Sentía una congoja inexplicable en el pecho'.",
            audioKey="pending/b2_congoja_inexplicable_despedida.mp3",
            speechEs="Sentía una congoja inexplicable en el pecho al despedirse en la estación."
        ),
        speak_ex(
            "ex-b2-eee-6",
            "انطق عبارتك الأدبية للتعبير عن الامتلاء الروحي والسكينة التامة",
            ["speaking", "pronunciation"], 2,
            "انطق الجملة التالية بصفاء وسكينة وجمال نطق:",
            "En medio de la naturaleza silenciosa experimentó una inmensa sensación de plenitud y paz.",
            "في قلب الطبيعة الصامتة، عايش إحساساً هائلاً بالامتلاء الروحي والسلام.",
            "pending/b2_sensacion_plenitud_paz.mp3",
            ["plenitud", "añoranza", "conmovedor"],
            "En medio de la naturaleza silenciosa experimentó una inmensa sensación de plenitud y paz.",
            "انتبه لنطق plenitud و silenciosa بنبرة هادئة ورصينة."
        )
    ]
    return lesson_doc(doc, exs, level="B2")


# ==============================================================================
# UNIT 4: b2-u4-professional (التواصل المهني وإدارة الاجتماعات والتقارير)
# ==============================================================================

def make_lesson_gestion_reuniones_orden_dia():
    slug = "b2-gestion-reuniones-orden-dia"
    doc = {
        "slug": slug,
        "unitSlug": "b2-u4-professional",
        "levelCode": "B2",
        "titleAr": "إدارة الاجتماعات المهنية: جدول الأعمال وتوزيع المداخلات",
        "titleEs": "Gestión de reuniones profesionales: Orden del día, moderación y toma de acuerdos",
        "subtitleAr": "افتتاح الجلسة، منح الكلمة، ضبط الوقت، وتلخيص المقررات بأسلوب تنفيذي",
        "order": 1,
        "estimatedMinutes": 20,
        "cefrLevel": "B2",
        "review": review_block(),
        "pedagogy": {
            "learningObjectivesAr": [
                "أن يدير المتعلم اجتماع عمل بالإسبانية من الافتتاح وحتى إقرار التوصيات.",
                "أن يوظف مصطلحات إدارة الجلسات: orden del día, ceder la palabra, someter a votación, levantar la sesión.",
                "أن يتدخل بلباقة لضبط الوقت ومقاطعة الاسترسال الخارج عن الموضوع."
            ],
            "grammarPoints": [
                {
                    "titleAr": "التراكيب الرسمية لضبط وتوجيه الحوار في الاجتماعات",
                    "explanationAr": "1. **افتتاح الاجتماع والتعريف بالبنود**:\n- *Damos comienzo a la reunión convocada para...*\n- *El primer punto del orden del día es abordar el presupuesto anual*.\n2. **منح الكلمة وتنظيم النقاش**:\n- *Tiene la palabra el director financiero* (الكلمة للمدير المالي).\n- *Le ruego que sea conciso para ajustarnos al tiempo previsto*.\n3. **إقرار التوصيات ورفع الجلسة**:\n- *Si no hay objeciones, queda aprobado este punto*.\n- *Se levanta la sesión* (تُرفع الجلسة رسميًا)."
                }
            ],
            "commonMistakesAr": [
                "ترجمة 'جدول الأعمال' حرفياً بـ *tabla de trabajo*؛ المصطلح الرسمي المعتمد هو **el orden del día**.",
                "استخدام أفعال دارجة غير مناسبة للاجتماع الرسمي مثل *cerrar la reunión* بدلاً من التعبير القانوني المؤسسي **levantar la sesión**."
            ],
            "dialectNotes": [
                {
                    "region": "EG",
                    "noteAr": "في الاجتماع لما بنحب نقول «نبدأ الاجتماع، والكلمة دلوقتي للأستاذ فلان عشان يكلمنا عن أول بند في جدول الأعمال». بالإسبانية: Iniciamos la sesión; tiene la palabra el señor Gómez para tratar el primer punto del orden del día."
                }
            ],
            "culturalNoteAr": "الاجتماعات في الشركات الإسبانية واللاتينية تتطلب موازنة بين الكفاءة الزمنية وإتاحة الفرصة لبناء التوافق الشخصي (consenso) بين الأطراف قبل اتخاذ القرار النهائي."
        },
        "contentBlocks": [
            {
                "id": f"cb-{slug}-intro",
                "type": "explanation",
                "titleAr": "المفردات والتراكيب القيادية في الاجتماعات",
                "bodyAr": "أهم التراكيب التنفيذية:\n- **el orden del día**: جدول أعمال الاجتماع المعتمد مسبقاً\n- **ceder la palabra**: منح الكلمة والإذن بالحديث لأحد الحاضرين\n- **el acta de la reunión**: محضر الاجتماع الرسمي المقيد للقرارات\n- **someter a votación**: طرح المقترح للتصويت الرسمي\n- **levantar la sesión**: رفع الجلسة واختتام الاجتماع\n- **el consenso**: التوافق والإجماع العام على القرار",
                "examples": [
                    {"es": "El primer punto del orden del día es la aprobación del acta anterior.", "ar": "البند الأول في جدول الأعمال هو التصديق على محضر الاجتماع السابق."},
                    {"es": "Cedo la palabra a nuestra directora de marketing para que exponga la campaña.", "ar": "أمنح الكلمة لمديرة التسويق لتعرض الخطة الترويجية."},
                    {"es": "Habiéndose tratado todos los puntos, se levanta la sesión.", "ar": "بعد مناقشة جميع البنود، تُرفع الجلسة رسمياً."}
                ]
            }
        ],
        "newVocabulary": ["orden del día", "ceder la palabra", "acta", "someter a votación", "levantar la sesión", "consenso"],
        "reviewVocabulary": ["reunión", "empresa"]
    }

    exs = [
        choice_ex(
            "ex-b2-grm-1", "word_choice",
            "اختر المصطلح المؤسسي الصحيح الذي يعني جدول أعمال الاجتماع",
            ["vocabulary"], 1,
            "ما هي العبارة المهنية المعتمدة لجدول الأعمال الموزع على الحاضرين؟",
            "Ruego a todos que revisen el _____ antes de comenzar los debates.",
            "أرجو من الجميع مراجعة ... قبل بدء المناقشات.",
            [
                opt("a", "orden del día", "جدول الأعمال الرسمي المعتمد (الصواب)", True),
                opt("b", "calendario diario", "التقويم اليومي", False, "جدول الأعمال يسمى el orden del día."),
                opt("c", "trama", "حبكة القصة", False, "المصطلح المؤسسي هو orden del día.")
            ],
            ["orden del día", "acta"],
            "el orden del día هو جدول بنود الأعمال والقضايا المطروحة للنقاش في الاجتماع."
        ),
        fill_ex(
            "ex-b2-grm-2",
            "أكمل بالوثيقة الرسمية التي تسجل مقررات الاجتماع ونقاشاته: (el _____)",
            ["vocabulary", "writing"], 1,
            "اكتب الكلمة المؤنثة مع الأداة المذكرة (el _____) التي تعني 'محضر الاجتماع الرسمي':",
            "La secretaria leyó el _____ de la sesión extraordinaria para su firma.",
            "تلت السكرتيرة ... الجلسة الاستثنائية لتوقيعه واعتماده.",
            ["acta"],
            ["acta"],
            "el acta هي وثيقة محضر الاجتماع القانونية التي تسجل المداولات."
        ),
        choice_ex(
            "ex-b2-grm-3", "word_choice",
            "حدد العبارة القيادية المستخدمة لمنح الدور في الكلام لزميل",
            ["vocabulary"], 2,
            "كيف تمنح الإذن بالكلام لشخص في الاجتماع المهني؟",
            "Para presentar el informe financiero, _____ al señor Rodríguez.",
            "لعرض التقرير المالي، ... للسيد رودريغيز.",
            [
                opt("a", "cedo la palabra", "أمنح الكلمة والإذن بالحديث (الصواب)", True),
                opt("b", "levanto la sesión", "أرفع الجلسة", False, "إعطاء الكلمة يسمى ceder la palabra."),
                opt("c", "pido perdón", "أطلب العفو", False, "منح الكلمة هو ceder la palabra.")
            ],
            ["ceder la palabra", "orden del día"],
            "ceder la palabra تعني إعطاء الدور في الحديث للمشارك."
        ),
        order_ex(
            "ex-b2-grm-4",
            "رتّب الجملة الرسمية لرفع الجلسة بعد استيفاء البنود",
            ["grammar", "writing"], 2,
            ["Sin", "más", "asuntos", "que", "tratar", "se", "levanta", "la", "sesión"],
            "Sin más asuntos que tratar se levanta la sesión",
            "الترتيب: العبارة Sin más asuntos que tratar ثم المبني للمجهول se levanta ثم المبتدأ la sesión.",
            ["levantar la sesión", "acta"]
        ),
        choice_ex(
            "ex-b2-grm-5", "listen_choose",
            "استمع لرئيس الاجتماع وحدد الإجراء الديمقراطي الذي يتخذه بشأن المقترح",
            ["listening", "vocabulary"], 2,
            "استمع للتوجيه الصوتي لرئيس مجلس الإدارة",
            "Si no hay más intervenciones, procedemos a someter a votación la propuesta.",
            "إذا لم تكن هناك مداخلات أخرى، سنشرع في طرح المقترح للتصويت.",
            [
                opt("a", "someter a votación", "طرح المقترح للتصويت الرسمي (الصواب)", True),
                opt("b", "cancelar la propuesta", "إلغاء المقترح", False, "الرئيس قال: someter a votación."),
                opt("c", "levantar la sesión", "رفع الجلسة فوراً", False, "الإجراء كان التصويت someter a votación.")
            ],
            ["someter a votación", "consenso"],
            "المتحدث قال: 'procedemos a someter a votación la propuesta'.",
            audioKey="pending/b2_someter_votacion_propuesta.mp3",
            speechEs="Si no hay más intervenciones, procedemos a someter a votación la propuesta."
        ),
        speak_ex(
            "ex-b2-grm-6",
            "انطق عبارتك لإدارة الاجتماع وتأكيد التوافق التام بين الحاضرين",
            ["speaking", "pronunciation"], 2,
            "انطق الجملة التالية بصفتك مديراً لجلسة عمل تنفيذية:",
            "Me alegra constatar que hemos alcanzado un sólido consenso sobre todos los puntos del orden del día.",
            "يسعدني أن أسجل أننا توصلنا إلى توافق صلب بشأن جميع بنود جدول الأعمال.",
            "pending/b2_solido_consenso_orden_dia.mp3",
            ["consenso", "orden del día", "ceder la palabra"],
            "Me alegra constatar que hemos alcanzado un sólido consenso sobre todos los puntos del orden del día.",
            "انتبه لنطق consenso و orden del día بلهجة تنفيذية قيادية واثقة."
        )
    ]
    return lesson_doc(doc, exs, level="B2")


def make_lesson_informes_ejecutivos_kpis():
    slug = "b2-informes-ejecutivos-kpis"
    doc = {
        "slug": slug,
        "unitSlug": "b2-u4-professional",
        "levelCode": "B2",
        "titleAr": "التقارير التنفيذية ومؤشرات الأداء: صياغة النتائج والتوصيات",
        "titleEs": "Informes ejecutivos e indicadores de rendimiento (KPIs): Presentación de resultados",
        "subtitleAr": "تحليل الأرقام، المقارنة السنوية، واستخلاص التوصيات الاستراتيجية للمديرين",
        "order": 2,
        "estimatedMinutes": 20,
        "cefrLevel": "B2",
        "review": review_block(),
        "pedagogy": {
            "learningObjectivesAr": [
                "أن يصيغ المتعلم تقريراً تنفيذياً موجزاً يقدم الحقائق والنتائج بالأرقام.",
                "أن يوظف مصطلحات المؤشرات الاقتصادية: indicador clave, rendimiento, margen de beneficio, déficit, superávit.",
                "أن يقدم توصيات استراتيجية للمستقبل بصيغة الشرط والتوجيه المؤسسي."
            ],
            "grammarPoints": [
                {
                    "titleAr": "التراكيب الرياضية والتحليلية في التقارير الإدارية",
                    "explanationAr": "1. **التعبير عن النمو والانخفاض بالنسبة المئوية**:\n- *Las ventas se incrementaron en un 15% respecto al ejercicio anterior*.\n- *Se observa una contracción del margen de beneficio del 3%*.\n2. **التعبير عن الاستخلاص والتوصية التنفيذية**:\n- *A la luz de los datos obtenidos, se recomienda + Infinitivo / que + Subjuntivo*:\n- *A la luz de los resultados, se recomienda optimizar los procesos de producción*.\n3. **المقارنة التقييمية التراكمية**:\n- *En términos interanuales, el crecimiento ha sido sostenido*."
                }
            ],
            "commonMistakesAr": [
                "استخدام حرف الجر الخاطئ مع النسبة المئوية للزيادة أو النقصان؛ الصواب: *creció en un 10%* (وليس *creció con 10%*).",
                "الحشو الإنشائي في التقارير التنفيذية؛ النمط الإسباني المؤسسي يفرض الإيجاز المباشر والدقة الرقمية القاطعة."
            ],
            "dialectNotes": [
                {
                    "region": "EG",
                    "noteAr": "في التقرير الشهري بنقول «بناءً على الأرقام والمؤشرات دي، بنوصي بتقليل المصاريف وزيادة الإنتاجية». بالإسبانية: A la luz de estos indicadores clave, se recomienda reducir los costes operativos y maximizar la rentabilidad."
                }
            ],
            "culturalNoteAr": "الشركات الإسبانية متعددة الجنسيات (مثل Santander و Inditex و Telefónica) تعتمد معايير دولية صارمة في صياغة التقارير التنفيذية الموجزة الموجهة لمجالس الإدارة."
        },
        "contentBlocks": [
            {
                "id": f"cb-{slug}-intro",
                "type": "explanation",
                "titleAr": "معجم الأداء المالي والمؤسسي",
                "bodyAr": "المصطلحات الاقتصادية والتنفيذية:\n- **el indicador clave de rendimiento (KPI)**: مؤشر الأداء الرئيسي لقياس الإنجاز\n- **el margen de beneficio**: هامش الربح المحقق\n- **el superávit**: الفائض المالي الإيجابي\n- **el déficit**: العجز المالي السالب\n- **la rentabilidad**: المردودية والجدوى الاقتصادية\n- **en términos interanuales**: على أساس سنوي مقارن بنفس الفترة من العام السابق",
                "examples": [
                    {"es": "El margen de beneficio neto experimentó una notable mejora en el último trimestre.", "ar": "شهد هامش الربح الصافي تحسناً ملحوظاً في الربع الأخير."},
                    {"es": "La empresa cerró el ejercicio con superávit gracias a la expansión internacional.", "ar": "أغلقت الشركة سنتها المالية بفائض مالي بفضل التوسع الدولي."},
                    {"es": "En términos interanuales, la rentabilidad creció en un doce por ciento.", "ar": "على أساس سنوي، نمت المردودية بنسبة اثني عشر بالمائة."}
                ]
            }
        ],
        "newVocabulary": ["indicador clave", "margen de beneficio", "superávit", "déficit", "rentabilidad", "en términos interanuales"],
        "reviewVocabulary": ["resultado", "porcentaje"]
    }

    exs = [
        choice_ex(
            "ex-b2-iek-1", "word_choice",
            "اختر المصطلح المالي الذي يدل على وجود فائض مالي وليس عجزاً",
            ["vocabulary"], 1,
            "ما هي الكلمة التي تعني 'الفائض الإيجابي بين الإيرادات والمصروفات'؟",
            "Gracias al estricto control presupuestario, cerramos el año con un cómodo _____.",
            "بفضل الرقابة الصارمة على الميزانية، أنهينا العام بـ ... مريح.",
            [
                opt("a", "superávit", "فائض مالي إيجابي (الصواب)", True),
                opt("b", "déficit", "عجز مالي", False, "الفائض الإيجابي يسمى superávit."),
                opt("c", "sesgo", "تحيز", False, "الفائض المالي يسمى superávit.")
            ],
            ["superávit", "déficit", "rentabilidad"],
            "el superávit هو الفائض المالي عندما تفوق الإيرادات حجم النفقات."
        ),
        fill_ex(
            "ex-b2-iek-2",
            "أكمل بحرف الجر الصحيح للزيادة في النسبة المئوية: se incrementó _____ un 10%",
            ["grammar", "writing"], 1,
            "اكتب حرف الجر الإسباني المستخدم مع نسب النمو: creció _____ un cinco por ciento.",
            "El volumen de facturación se incrementó _____ un ocho por ciento en el segundo semestre.",
            "ارتفع حجم الأعمال بنسبة ثمانية بالمائة في النصف الثاني من العام.",
            ["en términos interanuales"],
            ["en"],
            "مع نسب الزيادة والنقصان نستخدم حرف الجر en: se incrementó en un 8%."
        ),
        choice_ex(
            "ex-b2-iek-3", "word_choice",
            "حدد المفهوم الاقتصادي الذي يقيس مدى جدوى المشروع وقدرته على تحقيق الأرباح",
            ["vocabulary"], 2,
            "ما هي الكلمة التي تعني 'المردودية والجدوى الربحية للاستثمار'؟",
            "Los inversores buscan proyectos que garanticen una alta _____ a medio plazo.",
            "يبحث المستثمرون عن مشاريع تضمن ... عالية على المدى المتوسط.",
            [
                opt("a", "rentabilidad", "مردودية وجدوى ربحية (الصواب)", True),
                opt("b", "congoja", "غصة حزن", False, "الجدوى الاقتصادية تسمى la rentabilidad."),
                opt("c", "acta", "محضر اجتماع", False, "المردودية هي la rentabilidad.")
            ],
            ["rentabilidad", "margen de beneficio", "indicador clave"],
            "la rentabilidad هي المردودية والقدرة على توليد عوائد وأرباح من رأس المال."
        ),
        order_ex(
            "ex-b2-iek-4",
            "رتّب الجملة التنفيذية لتسجيل مؤشر الأداء الرئيسي للمبيعات",
            ["grammar", "writing"], 2,
            ["Este", "indicador", "clave", "mide", "la", "satisfacción", "del", "cliente"],
            "Este indicador clave mide la satisfacción del cliente",
            "الترتيب: اسم الإشارة Este ثم الموصوف indicador ثم النعت clave ثم الفعل mide ثم المفعول la satisfacción del cliente.",
            ["indicador clave", "rentabilidad"]
        ),
        choice_ex(
            "ex-b2-iek-5", "listen_choose",
            "استمع لملخص التقرير السنوي وحدد نسبة التغير المقارنة بين العامين",
            ["listening", "vocabulary"], 2,
            "استمع للمدير المالي وهو يعرض التقرير السنوي",
            "En términos interanuales, el margen de beneficio creció de forma sostenida.",
            "على أساس سنوي مقارن، نما هامش الربح بشكل مطرد وثابت.",
            [
                opt("a", "en términos interanuales", "على أساس سنوي مقارن بالعام الماضي (الصواب)", True),
                opt("b", "con déficit", "مع عجز فادح", False, "التقرير ذكر: En términos interanuales."),
                opt("c", "sin beneficios", "بلا أرباح", False, "العبارة كانت: En términos interanuales.")
            ],
            ["en términos interanuales", "margen de beneficio"],
            "المسؤول قال بوضوح: 'En términos interanuales, el margen de beneficio creció'.",
            audioKey="pending/b2_terminos_interanuales_beneficio.mp3",
            speechEs="En términos interanuales, el margen de beneficio creció de forma sostenida."
        ),
        speak_ex(
            "ex-b2-iek-6",
            "انطق جملتك التقريرية بثقة واحترافية أمام مجلس الإدارة",
            ["speaking", "pronunciation"], 2,
            "انطق الجملة التالية لتقديم خلاصة الأداء المالي والتنفيذي:",
            "A la luz de los datos, hemos superado el objetivo de rentabilidad y cerrado el año con superávit.",
            "في ضوء البيانات، تجاوزنا هدف المردودية وأغلقنا العام بفائض مالي.",
            "pending/b2_datos_rentabilidad_superavit.mp3",
            ["rentabilidad", "superávit", "indicador clave"],
            "A la luz de los datos, hemos superado el objetivo de rentabilidad y cerrado el año con superávit.",
            "انتبه لنطق superávit بالتشديد على مقطع á ونطق rentabilidad بطلاقة."
        )
    ]
    return lesson_doc(doc, exs, level="B2")


def make_lesson_correspondencia_corporativa():
    slug = "b2-correspondencia-corporativa"
    doc = {
        "slug": slug,
        "unitSlug": "b2-u4-professional",
        "levelCode": "B2",
        "titleAr": "المراسلات المؤسسية والبريد التجاري الرفيع: لغة الأعمال الرسمية",
        "titleEs": "Correspondencia corporativa y comunicaciones B2B: Registro formal y cortesía ejecutiva",
        "subtitleAr": "مخاطبة العملاء والشركاء التجاريين، إرسال العروض، وصيغ اللباقة المؤسسية",
        "order": 3,
        "estimatedMinutes": 20,
        "cefrLevel": "B2",
        "review": review_block(),
        "pedagogy": {
            "learningObjectivesAr": [
                "أن يكتب المتعلم بريداً إلكترونياً تجارياً رسمياً (B2B) يتسم بالدقة واللباقة.",
                "أن يوظف صيغ المخاطبة والافتتاح والاختتام المؤسسية الرفيعة: Estimado/a, Atentamente, Quedamos a su entera disposición.",
                "أن يعبر عن الشراكة والتعاون وإرسال عروض الأسعار بصيغة التعظيم (Usted / Ustedes)."
            ],
            "grammarPoints": [
                {
                    "titleAr": "صيغ التحية واللباقة في الرسائل المؤسسية والتجارية",
                    "explanationAr": "1. **الافتتاحية وتحديد موضوع المراسلة**:\n- *Nos dirigimos a usted con el propósito de presentarle nuestra propuesta...*\n- *En respuesta a su atenta comunicación del pasado 12 de octubre...*\n2. **الإحالة إلى المرفقات والوثائق**:\n- *Adjunto a la presente remitimos el presupuesto detallado* (نرفق طي هذه الرسالة).\n3. **الصيغ الختامية الأنيقة**:\n- *Agradeciendo de antemano su atención, le saluda atentamente...*\n- *Quedamos a su entera disposición para cualquier aclaración que estime oportuna*."
                }
            ],
            "commonMistakesAr": [
                "خلط صيغ الخطاب غير الرسمي (tú) بصيغ الاحترام التجاري (usted) داخل نفس الخطاب.",
                "استخدام ترجمات ركيكة للاعتذار عن التأخير؛ الأسلوب المؤسسي الراقي يعتمد: *Rogamos disculpen las molestias que este retraso haya podido ocasionar*."
            ],
            "dialectNotes": [
                {
                    "region": "EG",
                    "noteAr": "في الإيميلات المؤسسية بين الشركات بنقفل بـ «ونحن في انتظار ردكم الكريم وتحت أمركم في أي استفسار». بالإسبانية: Quedamos a su entera disposición y a la espera de sus gratas noticias."
                }
            ],
            "culturalNoteAr": "المراسلات التجارية في إسبانيا وأمريكا اللاتينية تتميز بالتهذيب المتبادل والصيغ الاحترامية العريقة، ويُعتبر إغفال صيغ اللباقة نوعاً من الفظاظة الإدارية."
        },
        "contentBlocks": [
            {
                "id": f"cb-{slug}-intro",
                "type": "explanation",
                "titleAr": "هيكل الخطاب التجاري المؤسسي",
                "bodyAr": "العبارات النموذجية:\n- **nos dirigimos a usted**: نتوجه إلى سيادتكم\n- **adjunto remitimos**: نرسل لكم طياً ومرفقاً بالرسالة\n- **a su entera disposición**: تحت تصرفكم الكامل ورهن إشارتكم\n- **estimar oportuno**: يرى من المناسب والملائم\n- **atentamente**: مع خالص التقدير والاحترام (الخاتمة القياسية)\n- **la propuesta comercial**: العرض التجاري والتسعيري",
                "examples": [
                    {"es": "Nos dirigimos a usted para presentarle nuestra propuesta de colaboración estratégica.", "ar": "نتوجه إلى سيادتكم لعرض مقترحنا للتعاون الاستراتيجي."},
                    {"es": "Adjunto remitimos el catálogo de servicios con las tarifas actualizadas.", "ar": "نرفق لكم طياً دليل الخدمات مع الأسعار المحدثة."},
                    {"es": "Quedamos a su entera disposición para cuantas dudas puedan surgir.", "ar": "نبقى رهن إشارتكم التامة للإجابة عن أي استفسارات قد تطرأ."}
                ]
            }
        ],
        "newVocabulary": ["nos dirigimos a usted", "adjunto remitimos", "a su entera disposición", "estimar oportuno", "atentamente", "propuesta comercial"],
        "reviewVocabulary": ["correo", "cliente"]
    }

    exs = [
        choice_ex(
            "ex-b2-coc-1", "word_choice",
            "اختر العبارة الأكثر لباقة ورسمية لافتتاح الخطاب التجاري الموجه لمسؤول",
            ["vocabulary"], 1,
            "كيف تستهل خطابك التجاري الموجه لمدير شركة شريكة باحترام ولباقة؟",
            "_____ con el fin de trasladarle nuestra propuesta comercial para el próximo año.",
            "... بهدف إحاطتكم بعرضنا التجاري للعام القادم.",
            [
                opt("a", "Nos dirigimos a usted", "نتوجه إلى سيادتكم بصيغة الاحترام (الصواب)", True),
                opt("b", "Oye tú", "يا أنت بالعامية الفجة", False, "في لغة الأعمال نستخدم دائماً Nos dirigimos a usted."),
                opt("c", "Qué tal todo", "كيف الحال بشكل دارج", False, "الخطاب التجاري يتطلب Nos dirigimos a usted.")
            ],
            ["nos dirigimos a usted", "propuesta comercial"],
            "Nos dirigimos a usted هي الصيغة البروتوكولية القياسية لافتتاح المراسلات المؤسسية."
        ),
        fill_ex(
            "ex-b2-coc-2",
            "أكمل الخاتمة التجارية الرسمية الأكثر شيوعاً للدلالة على خالص التقدير: (_____)",
            ["vocabulary", "writing"], 1,
            "اكتب الكلمة الظرفية الرسمية التي تختتم بها الرسائل التجارية (مع خالص التحيات والتقدير):",
            "Sin otro particular, le saluda _____ el departamento de atención al cliente.",
            "وتفضلوا بقبول فائق الاحترام والتقدير، قسم خدمة العملاء.",
            ["atentamente"],
            ["atentamente"],
            "atentamente هي الخاتمة الرسمية القياسية للمراسلات التجارية والإدارية."
        ),
        choice_ex(
            "ex-b2-coc-3", "word_choice",
            "حدد العبارة التي تعني إرسال الوثائق والملفات مرفقة مع الخطاب",
            ["vocabulary"], 2,
            "ما هي العبارة الإدارية التي تعني 'نرفق طي هذه الرسالة الوثائق المطلوبة'؟",
            "_____ el presupuesto desglosado para su revisión y visto bueno.",
            "... الميزانية التقديرية المفصلة لمراجعتها واعتمادها.",
            [
                opt("a", "Adjunto remitimos", "نرسل لكم مرفقاً وطياً (الصواب)", True),
                opt("b", "Levantamos la sesión", "نرفع الجلسة", False, "الإرفاق التجاري يسمى Adjunto remitimos."),
                opt("c", "Tenemos la culpa", "نحن المخطئون", False, "إرفاق الملفات يسمى Adjunto remitimos.")
            ],
            ["adjunto remitimos", "propuesta comercial", "a su entera disposición"],
            "Adjunto remitimos تعني نرسل طيه أو نرفق بالرسالة."
        ),
        order_ex(
            "ex-b2-coc-4",
            "رتّب الجملة الختامية للتعبير عن الاستعداد التام لتقديم أي إيضاح",
            ["grammar", "writing"], 2,
            ["Quedamos", "a", "su", "entera", "disposición", "para", "cualquier", "consulta"],
            "Quedamos a su entera disposición para cualquier consulta",
            "الترتيب: الفعل Quedamos ثم شبه الجملة a su entera disposición ثم الغرض para cualquier consulta.",
            ["a su entera disposición", "atentamente"]
        ),
        choice_ex(
            "ex-b2-coc-5", "listen_choose",
            "استمع للرسالة الصوتية المسجلة وحدد ما يعرضه الموظف على العميل",
            ["listening", "vocabulary"], 2,
            "استمع لنص المراسلة المؤسسية الصوتية",
            "Le contactamos para presentarle una propuesta comercial exclusiva para su empresa.",
            "نتصل بسيادتكم لنقدم لكم عرضاً تجارياً حصرياً لشركتكم.",
            [
                opt("a", "propuesta comercial", "عرض تجاري حصري (الصواب)", True),
                opt("b", "reclamación judicial", "شكوى قضائية", False, "الموظف قال: una propuesta comercial exclusiva."),
                opt("c", "queja personal", "شكوى شخصية", False, "المعروض كان propuesta comercial.")
            ],
            ["propuesta comercial", "nos dirigimos a usted"],
            "المتحدث قال بوضوح: 'una propuesta comercial exclusiva para su empresa'.",
            audioKey="pending/b2_propuesta_comercial_exclusiva.mp3",
            speechEs="Le contactamos para presentarle una propuesta comercial exclusiva para su empresa."
        ),
        speak_ex(
            "ex-b2-coc-6",
            "انطق جملتك الختامية الأنيقة في ختام اتصال عمل مع شريك تجاري",
            ["speaking", "pronunciation"], 2,
            "انطق الجملة التالية بأسلوب مهني لبق ومحترم:",
            "Agradecemos su confianza y quedamos a su entera disposición para cualquier aclaración que estime oportuna.",
            "نشكر لكم ثقتكم ونبقى تحت تصرفكم التام لأي إيضاح ترونه مناسباً.",
            "pending/b2_confianza_entera_disposicion.mp3",
            ["a su entera disposición", "estimar oportuno", "atentamente"],
            "Agradecemos su confianza y quedamos a su entera disposición para cualquier aclaración que estime oportuna.",
            "انتبه لنطق entera disposición و estime oportuna بسلاسة ونبرة بالغة التهذيب."
        )
    ]
    return lesson_doc(doc, exs, level="B2")


def make_lesson_resolucion_conflictos_laborales():
    slug = "b2-resolucion-conflictos-laborales"
    doc = {
        "slug": slug,
        "unitSlug": "b2-u4-professional",
        "levelCode": "B2",
        "titleAr": "حل النزاعات المؤسسية وإدارة فرق العمل: الوساطة والتفاهم",
        "titleEs": "Resolución de conflictos laborales y mediación: Gestión de equipos y clima organizacional",
        "subtitleAr": "التعامل مع سوء التفاهم، الاستماع الفعال، والتوصل لحلول وسط ترضي الجميع",
        "order": 4,
        "estimatedMinutes": 20,
        "cefrLevel": "B2",
        "review": review_block(),
        "pedagogy": {
            "learningObjectivesAr": [
                "أن يتدخل المتعلم كوسيط لحل سوء التفاهم والنزاع بين أعضاء فريق العمل.",
                "أن يوظف مصطلحات الوساطة المهنية: mediación, limar asperezas, punto de encuentro, clima laboral.",
                "أن يقود حوار المصالحة باستخدام صيغ الاستماع الإيجابي ونزع فتيل التوتر."
            ],
            "grammarPoints": [
                {
                    "titleAr": "التراكيب الدبلوماسية لنزع فتيل الخلافات في بيئة العمل",
                    "explanationAr": "1. **إعادة صياغة الخلاف بنبرة موضوعية غير شخصية**:\n- *Entiendo que ambos puntos de vista tienen fundamentos válidos*.\n- *El problema no radica en las personas, sino en la falta de canales claros de comunicación*.\n2. **البحث عن أرضية مشتركة (Puntos de encuentro)**:\n- *Lo que nos une es el compromiso con el éxito del proyecto*.\n- *Debemos buscar una solución salomónica que satisfaga a ambas partes*.\n3. **الصيغ البلاغية لتلطيف الأجواء (Limar asperezas)**:\n- *Es momento de limar asperezas y mirar hacia adelante*."
                }
            ],
            "commonMistakesAr": [
                "الانحياز لأحد الطرفين أثناء الوساطة أو توجيه اللوم المباشر بـ *tienes la culpa*؛ الوسيط المهني يركز على *identificar el origen del malentendido*.",
                "استخدام كلمات تصعيدية مثل *es inaceptable* بدلاً من الصياغات التوفيقية مثل *resulta conveniente reconducir la situación*."
            ],
            "dialectNotes": [
                {
                    "region": "EG",
                    "noteAr": "في بيئة العمل لما بيحصل سوء تفاهم المدير الشاطر بيقول «نقعد مع بعض نصفي النفوس ونقرب وجهات النظر عشان مصلحة الشغل». بالإسبانية: Vamos a sentarnos a limar asperezas y acercar posturas por el bien del equipo."
                }
            ],
            "culturalNoteAr": "ثقافة العمل في العالم الإسباني تولي العلاقات الإنسانية والراحة النفسية في الفريق (el clima laboral) أهمية قصوى لضمان الإنتاجية وتجنب الاستقالات."
        },
        "contentBlocks": [
            {
                "id": f"cb-{slug}-intro",
                "type": "explanation",
                "titleAr": "أدوات الوساطة وفض النزاعات المهنية",
                "bodyAr": "المفاهيم والتراكيب التوفيقية:\n- **la mediación**: الوساطة المحايدة بين طرفين متنازعين\n- **limar asperezas**: تسوية الخلافات وإزالة الحزازات وتصفية النفوس\n- **el punto de encuentro**: الأرضية المشتركة ونقطة التلاقي\n- **el clima laboral**: المناخ العام وبيئة العمل النفسية والمعنوية\n- **el malentendido**: سوء التفاهم الناتج عن غموض التواصل\n- **acercar posturas**: تقريب وجهات النظر المتباينة",
                "examples": [
                    {"es": "El director intervino en la mediación para restablecer un buen clima laboral.", "ar": "تدخل المدير في الوساطة لاستعادة مناخ عمل إيجابي وصحي."},
                    {"es": "Ambas partes mostraron voluntad sincera de limar asperezas y colaborar.", "ar": "أبدى الطرفان رغبة صادقة في تسوية الخلافات وإزالة الحزازات والتعاون."},
                    {"es": "Debemos encontrar un punto de encuentro que beneficie a todo el departamento.", "ar": "ينبغي لنا إيجاد أرضية مشتركة تحقق مصلحة القسم بأكمله."}
                ]
            }
        ],
        "newVocabulary": ["mediación", "limar asperezas", "punto de encuentro", "clima laboral", "malentendido", "acercar posturas"],
        "reviewVocabulary": ["conflicto", "equipo"]
    }

    exs = [
        choice_ex(
            "ex-b2-rcl-1", "word_choice",
            "اختر التعبير الاصطلاحي الإسباني الذي يعني تصفية الخلافات وإزالة الحزازات",
            ["vocabulary"], 1,
            "ما هي العبارة الاصطلاحية التي تعني 'إزالة التوتر وتسوية الخلافات البسيطة بين الزملاء'؟",
            "Los dos directores se reunieron en privado para _____ tras la tensa discusión.",
            "اجتمع المديران على انفراد من أجل ... بعد النقاش المتوتر.",
            [
                opt("a", "limar asperezas", "تسوية الخلافات وإزالة الحزازات (الصواب)", True),
                opt("b", "levantar la sesión", "رفع الجلسة", False, "إزالة الخلافات تسمى اصطلاحاً limar asperezas."),
                opt("c", "someter a votación", "طرح للتصويت", False, "تصفية النفوس تسمى limar asperezas.")
            ],
            ["limar asperezas", "clima laboral"],
            "limar asperezas هو التعبير الشائع لتسوية الخلافات وتلطيف الأجواء بين الأطراف."
        ),
        fill_ex(
            "ex-b2-rcl-2",
            "أكمل بالمصطلح الذي يعني مناخ العمل والبيئة المعنوية في المؤسسة: (el _____ laboral)",
            ["vocabulary", "writing"], 1,
            "اكتب الكلمة المذكرة التي تدل على البيئة النفسية للعمل: un excelente _____ laboral.",
            "El exceso de competitividad tóxica perjudica gravemente el _____ laboral del equipo.",
            "المنافسة السامة المفرطة تضر بشدة بالمناخ المهني والنفسي للفريق.",
            ["clima laboral"],
            ["clima"],
            "el clima laboral هو مناخ وبيئة العمل المعنوية والنفسية في الشركة."
        ),
        choice_ex(
            "ex-b2-rcl-3", "word_choice",
            "حدد المصطلح الذي يعبر عن الأرضية المشتركة التي يلتقي عندها الطرفان",
            ["vocabulary"], 2,
            "ماذا نسمي نقطة التراضي والاتفاق المشترك في المفاوضات؟",
            "A pesar de sus diferencias iniciales, lograron hallar un _____ satisfactorio.",
            "على الرغم من خلافاتهم الأولية، نجحوا في إيجاد ... مُرضٍ للطرفين.",
            [
                opt("a", "punto de encuentro", "أرضية مشتركة ونقطة تلاقٍ (الصواب)", True),
                opt("b", "juicio de valor", "حكم تقييمي", False, "نقطة التراضي تسمى punto de encuentro."),
                opt("c", "sesgo", "انحياز", False, "الأرضية المشتركة هي punto de encuentro.")
            ],
            ["punto de encuentro", "acercar posturas", "mediación"],
            "el punto de encuentro هو الموقف الوسط والتوافقي الذي يلتقي عنده المتنازعون."
        ),
        order_ex(
            "ex-b2-rcl-4",
            "رتّب الجملة التوفيقية لتقريب وجهات النظر بين الزملاء",
            ["grammar", "writing"], 2,
            ["Es", "necesario", "acercar", "posturas", "para", "resolver", "el", "malentendido"],
            "Es necesario acercar posturas para resolver el malentendido",
            "الترتيب: العبارة Es necesario ثم الفعل acercar posturas ثم شبه الجملة الغائية para resolver el malentendido.",
            ["acercar posturas", "malentendido"]
        ),
        choice_ex(
            "ex-b2-rcl-5", "listen_choose",
            "استمع لوسيط الموارد البشرية وحدد الإجراء الذي يقترحه لحل الخلاف",
            ["listening", "vocabulary"], 2,
            "استمع لتوجيه خبير الموارد البشرية أثناء جلسة الوساطة",
            "Propongo un proceso de mediación constructiva para aclarar el malentendido.",
            "أقترح مسار وساطة بنّاءة لتوضيح سوء التفاهم الحاصل.",
            [
                opt("a", "mediación constructiva", "وساطة محايدة بنّاءة (الصواب)", True),
                opt("b", "sanción disciplinaria", "عقوبة تأديبية", False, "المسؤول اقترح mediación constructiva."),
                opt("c", "despido inmediato", "فصل فوري", False, "الحل المقترح كان الوساطة mediación.")
            ],
            ["mediación", "malentendido"],
            "المتحدث قال بوضوح: 'un proceso de mediación constructiva'.",
            audioKey="pending/b2_mediacion_constructiva_malentendido.mp3",
            speechEs="Propongo un proceso de mediación constructiva para aclarar el malentendido."
        ),
        speak_ex(
            "ex-b2-rcl-6",
            "انطق عبارتك التوفيقية لتهدئة الخلاف والدعوة للتعاون المثمر",
            ["speaking", "pronunciation"], 2,
            "انطق الجملة التالية كقائد فريق حكيم يسعى للمصالحة بين أعضائه:",
            "Debemos superar este malentendido, limar asperezas y centrar nuestra energía en los objetivos comunes.",
            "يجب أن نتجاوز سوء التفاهم هذا، وأن نصفي النفوس ونركز طاقتنا على أهدافنا المشتركة.",
            "pending/b2_superar_malentendido_limar_asperezas.mp3",
            ["limar asperezas", "malentendido", "punto de encuentro"],
            "Debemos superar este malentendido, limar asperezas y centrar nuestra energía en los objetivos comunes.",
            "انتبه لنطق limar asperezas و centrar nuestra energía بلهجة قيادية ودودة ومؤثرة."
        )
    ]
    return lesson_doc(doc, exs, level="B2")
