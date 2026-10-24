# -*- coding: utf-8 -*-
"""A2 Units 4 (Comparisons & Superlatives) and 5 (Experiences & Pretérito Perfecto).
8 Lessons based on Aula Plus 2 Unidades 3 & 4 and Gramática del uso Capítulos 28-30 & 46-48.
"""
from common import opt, choice_ex, fill_ex, order_ex, speak_ex, lesson_doc, review_block

# ==============================================================================
# UNIT 4: a2-u4-comparisons (المقارنة والتفضيل والكميات)
# ==============================================================================

def make_lesson_comparativos_superioridad():
    slug = "a2-comparativos-superioridad"
    doc = {
        "slug": slug,
        "unitSlug": "a2-u4-comparisons",
        "levelCode": "A2",
        "titleAr": "صيغ المقارنة: التفوق والنقصان بـ Más que و Menos que والمقارنات الشاذة",
        "titleEs": "Los comparativos de superioridad e inferioridad",
        "subtitleAr": "تركيب más... que و menos... que والمقارنات الشاذة: mejor, peor, mayor, menor",
        "order": 1,
        "estimatedMinutes": 18,
        "cefrLevel": "A2",
        "review": review_block(),
        "pedagogy": {
            "learningObjectivesAr": [
                "أن يصوغ المتعلم مقارنة التفوق: más + صفة/اسم/ظرف + que بدقة.",
                "أن يصوغ مقارنة النقصان: menos + صفة/اسم/ظرف + que.",
                "أن يستخدم المقارنات الشاذة الأساسية: mejor (أفضل من bueno), peor (أسوأ من malo), mayor (أكبر عمراً), menor (أصغر عمراً)."
            ],
            "grammarPoints": [
                {
                    "titleAr": "تراكيب المقارنة والمقارنات الشاذة",
                    "explanationAr": "للمقارنة بين طرفين في الإسبانية نستخدم:\n- **más + صفة + que**: Juan es más alto que Pedro (خوان أطول من بيدرو).\n- **menos + صفة + que**: Esta casa es menos cara que esa (هذا البيت أقل ثمناً من ذاك).\nالمقارنات الشاذة لا تأخذ más أو menos قبلها:\n- bueno -> **mejor que** (أفضل من)\n- malo -> **peor que** (أسوأ من)\n- grande en edad -> **mayor que** (أكبر سناً من)\n- pequeño en edad -> **menor que** (أصغر سناً من)"
                }
            ],
            "commonMistakesAr": [
                "استخدام de بدلاً من que في المقارنة العامة بتأثير الفرنسية أو الإنجليزية (الصواب: más alto que، والخطأ: *más alto de*؛ نستخدم de فقط مع الأرقام: más de 20 euros).",
                "قول *más mejor* أو *más peor* (هذا خطأ فاحش في الإسبانية؛ الصواب: mejor و peor مباشرة)."
            ],
            "dialectNotes": [
                {
                    "region": "EG",
                    "noteAr": "في مصر نقول: «أحمد أطول من علي، وده أحسن من ده». في الإسبانية: Ahmed es más alto que Ali, y esto es mejor que eso."
                }
            ],
            "culturalNoteAr": "عند إبداء الرأي والمقارنة بين الخدمات والمطاعم في إسبانيا، من المعتاد جداً استخدام mejor que و peor que للتوصية المباشرة."
        },
        "contentBlocks": [
            {
                "id": f"cb-{slug}-intro",
                "type": "explanation",
                "titleAr": "صيغ المقارنة الشائعة",
                "bodyAr": "أدوات المقارنة والمصطلحات الشاذة:\n- **más ... que**: أكثر ... من\n- **menos ... que**: أقل ... من\n- **mejor que**: أفضل من (مقارنة شاذة لـ bueno)\n- **peor que**: أسوأ من (مقارنة شاذة لـ malo)\n- **mayor que**: أكبر سناً من\n- **menor que**: أصغر سناً من",
                "examples": [
                    {"es": "Madrid es más grande que Valencia.", "ar": "مدريد أكبر من فالنسيا."},
                    {"es": "Este restaurante es mejor que el otro.", "ar": "هذا المطعم أفضل من الآخر."},
                    {"es": "Mi hermano es mayor que yo.", "ar": "أخي أكبر مني سناً."}
                ]
            }
        ],
        "newVocabulary": ["más", "menos", "que", "mejor", "peor", "mayor", "menor"],
        "reviewVocabulary": ["grande", "pequeño"]
    }

    exs = [
        choice_ex(
            "ex-a2-cmp-1", "word_choice",
            "اختر الأداة الصحيحة في جملة المقارنة",
            ["grammar"], 1,
            "ما هي الكلمة التي تعني 'من' في المقارنة بين شيئين؟",
            "El tren es más rápido _____ el autobús.",
            "القطار أسرع ... الحافلة.",
            [
                opt("a", "que", "أداة المقارنة القياسية (الصواب)", True),
                opt("b", "de", "تستخدم مع الأرقام فقط", False, "في المقارنة العامة بين اسمين نستخدم que وليس de."),
                opt("c", "como", "تستخدم في مقارنة التساوي", False, "como تأتي مع tan للتساوي وليس مع más.")
            ],
            ["más", "que"],
            "في المقارنة بين طرفين نستخدم دائماً más + صفة + que."
        ),
        fill_ex(
            "ex-a2-cmp-2",
            "اكتب المقارنة الشاذة لـ 'أفضل من'",
            ["grammar", "writing"], 1,
            "اكتب الكلمة الإسبانية التي تعني 'أفضل' (المقارنة الشاذة من bueno)",
            "Tu pronunciación es _____ que antes.",
            "نطقك أفضل من قبل.",
            ["mejor"],
            ["mejor"],
            "المقارنة الشاذة من الصفة bueno هي mejor (أفضل)."
        ),
        choice_ex(
            "ex-a2-cmp-3", "word_choice",
            "اختر الكلمة الدالة على كِبَر السن",
            ["vocabulary", "reading"], 2,
            "كيف تصف أن أخاك يسبقك في العمر والسنوات؟",
            "Mi hermano tiene 30 años y yo 25; él es _____ que yo.",
            "أخي عمره 30 سنة وأنا 25؛ هو ... مني سناً.",
            [
                opt("a", "mayor", "أكبر سناً", True),
                opt("b", "menor", "أصغر سناً", False, "هو عمره 30 وأنت 25، فهو أكبر mayor وليس أصغر."),
                opt("c", "peor", "أسوأ", False, "peor مقارنة للجودة السيئة ولا تدل على السن.")
            ],
            ["mayor", "menor", "peor", "que"],
            "للمقارنة في العمر نستخدم mayor (أكبر سناً) و menor (أصغر سناً)."
        ),
        order_ex(
            "ex-a2-cmp-4",
            "رتّب الجملة للمقارنة بين المدينة والقرية في الهدوء",
            ["grammar", "writing"], 2,
            ["El", "pueblo", "es", "menos", "ruidoso", "que", "la", "ciudad"],
            "El pueblo es menos ruidoso que la ciudad",
            "الترتيب السليم: الطرف الأول El pueblo ثم الفعل es ثم menos ruidoso ثم que والطرف الثاني la ciudad.",
            ["menos", "que"]
        ),
        choice_ex(
            "ex-a2-cmp-5", "listen_choose",
            "استمع وحدد نتيجة المقارنة بين الفندقين",
            ["listening", "vocabulary"], 2,
            "استمع للتسجيل وحدد تقييم المتحدث للفندق الجديد",
            "Este hotel es mucho mejor que el anterior.",
            "هذا الفندق أفضل بكثير من السابق.",
            [
                opt("a", "mejor", "أفضل", True),
                opt("b", "peor", "أسوأ", False, "المتحدث قال mejor وليس peor."),
                opt("c", "menor", "أصغر", False, "المتحدث تحدث عن الجودة وليس الحجم.")
            ],
            ["mejor", "peor", "menor", "que"],
            "المتحدث قال بوضوح: mucho mejor que el anterior.",
            audioKey="pending/a2_hotel_mejor_que.mp3",
            speechEs="Este hotel es mucho mejor que el anterior."
        ),
        speak_ex(
            "ex-a2-cmp-6",
            "انطق المقارنة بين وسيلتي المواصلات",
            ["speaking", "pronunciation"], 2,
            "انطق الجملة موضحاً أن المترو أسرع من الحافلة بطلاقة",
            "El metro es más rápido que el autobús.",
            "المترو أسرع من الأتوبيس.",
            "pending/a2_metro_mas_rapido.mp3",
            ["más", "que"],
            "El metro es más rápido que el autobús.",
            "احرص على مد الصوت في más والنبر على المقطع الأول في rápido."
        )
    ]
    return lesson_doc(doc, exs)

def make_lesson_comparativos_igualdad():
    slug = "a2-comparativos-igualdad"
    doc = {
        "slug": slug,
        "unitSlug": "a2-u4-comparisons",
        "levelCode": "A2",
        "titleAr": "مقارنة التساوي: Tan... como مع الصفات و Tanto... como مع الأسماء",
        "titleEs": "Los comparativos de igualdad",
        "subtitleAr": "التمييز الدقيق بين tan (للصفات والظروف) و tanto/a/os/as (للأسماء والكميات)",
        "order": 2,
        "estimatedMinutes": 18,
        "cefrLevel": "A2",
        "review": review_block(),
        "pedagogy": {
            "learningObjectivesAr": [
                "أن يطبق المتعلم مقارنة التساوي مع الصفات والظروف: tan + صفة + como.",
                "أن يطبق مقارنة التساوي مع الأسماء والكميات: tanto/tanta/tantos/tantas + اسم + como مع مطابقة الجنس والعدد.",
                "أن يستخدم التساوي مع الأفعال: فعل + tanto como (Trabaja tanto como tú)."
            ],
            "grammarPoints": [
                {
                    "titleAr": "الفرق بين Tan و Tanto في التساوي",
                    "explanationAr": "1. مع الصفات والظروف نستخدم **tan** الثابتة (بدون تغيير):\n- Juan es **tan alto como** su padre (خوان طويل مثل والده).\n2. مع الأسماء نستخدم **tanto/a/os/as** وتتطابق مع الاسم في التذكير والتأنيث والجمع:\n- Tengo **tanto dinero como** tú (عندي نفس القدر من المال مثلك - مفرد مذكر).\n- Tiene **tanta paciencia como** su madre (لديها نفس الصبر مثل والدتها - مفرد مؤنث).\n- Hay **tantos coches como** ayer (يوجد نفس عدد السيارات مثل الأمس - جمع مذكر).\n3. بعد الفعل مباشرة نستخدم **tanto como** الثابتة: Estudia tanto como yo (يدرس بقدر ما أدرس)."
                }
            ],
            "commonMistakesAr": [
                "استخدام tanto مع الصفات (مثل قول *tanto alto como*؛ الصواب: tan alto como).",
                "عدم مطابقة tanto مع الاسم المؤنث أو الجمع (مثل قول *tanto casas como* بدلاً من tantas casas como)."
            ],
            "dialectNotes": [
                {
                    "region": "EG",
                    "noteAr": "في مصر نقول: «أحمد شاطر زي كريم، وعنده كتب قد اللي عندي». في الإسبانية: Ahmed es tan inteligente como Karim, y tiene tantos libros como yo."
                }
            ],
            "culturalNoteAr": "الإسبان يستخدمون عبارة «igual de... que» كبديل شائع جداً في الحديث اليومي لـ «tan... como» (مثل: Es igual de caro que el otro)."
        },
        "contentBlocks": [
            {
                "id": f"cb-{slug}-intro",
                "type": "explanation",
                "titleAr": "صيغ التساوي",
                "bodyAr": "القواعد الأساسية للتساوي:\n- **tan + صفة + como**: بنفس قدر (الصفة)\n- **tanto/a/os/as + اسم + como**: بنفس الكمية والعدد\n- **igual**: متطابق / متساوٍ\n- **parecido**: شبيه / متشابه\n- **la cantidad**: الكمية / المقدار",
                "examples": [
                    {"es": "El piso es tan luminoso como el tuyo.", "ar": "الشقة مضيئة تماماً مثل شقتك."},
                    {"es": "Tengo tantos libros como tú.", "ar": "لدي نفس عدد الكتب مثلك."},
                    {"es": "Los dos precios son parecidos.", "ar": "السعران متشابهان."}
                ]
            }
        ],
        "newVocabulary": ["tan", "como", "tanto", "igual", "parecido", "cantidad"],
        "reviewVocabulary": ["caro", "barato"]
    }

    exs = [
        choice_ex(
            "ex-a2-igu-1", "word_choice",
            "اختر الأداة المناسبة لمقارنة التساوي مع صفة",
            ["grammar"], 1,
            "ما هي الأداة المستخدمة للتساوي قبل الصفة caro؟",
            "Este restaurante es _____ caro como el del centro.",
            "هذا المطعم غالٍ تماماً مثل مطعم وسط المدينة.",
            [
                opt("a", "tan", "تأتي قبل الصفات والظروف (الصواب)", True),
                opt("b", "tanto", "تأتي قبل الأسماء وليس الصفات", False, "مع الصفات نستخدم tan وليس tanto."),
                opt("c", "más", "مقارنة تفوق وليست تساوياً", False, "وجود como بعد الصفة يدل على مقارنة التساوي.")
            ],
            ["tan", "como", "caro"],
            "قبل الصفات مثل caro نستخدم دائماً أداة التساوي tan: tan caro como."
        ),
        fill_ex(
            "ex-a2-igu-2",
            "طابق أداة tanto مع الاسم المؤنث الجمع",
            ["grammar", "writing"], 1,
            "اكتب صيغة tanto المناسبة لكلمة habitaciones (جمع مؤنث)",
            "Nuestra casa tiene _____ habitaciones como la tuya.",
            "بيتنا به نفس عدد الغرف مثل بيتك.",
            ["tanto", "como"],
            ["tantas"],
            "كلمة habitaciones جمع مؤنث، فتطابقها أداة التساوي لتصبح tantas."
        ),
        choice_ex(
            "ex-a2-igu-3", "word_choice",
            "اختر الوصف الدال على التشابه بين أمرين",
            ["vocabulary", "reading"], 2,
            "عندما يتشابه أسلوبا عيش دون تطابق تام، فهما:",
            "Las dos costumbres son muy _____ en los dos países.",
            "العادتان ... جداً في البلدين.",
            [
                opt("a", "parecidas", "متشابهتان", True),
                opt("b", "cantidad", "كمية (اسم)", False, "cantidad اسم ولا يصف العادات هنا."),
                opt("c", "tanto", "قدر / كم", False, "tanto أداة ولا تصلح كصفة خبرية للجمع المؤنث.")
            ],
            ["parecido", "cantidad", "tanto"],
            "الصفة parecidas تعني متشابهتان وتتطابق مع las dos costumbres."
        ),
        order_ex(
            "ex-a2-igu-4",
            "رتّب الجملة للتعبير عن التساوي في العمل والجهد",
            ["grammar", "writing"], 2,
            ["Mi", "amigo", "trabaja", "tanto", "como", "yo"],
            "Mi amigo trabaja tanto como yo",
            "الترتيب السليم: الفاعل Mi amigo ثم الفعل trabaja ثم صيغة التساوي بعد الأفعال tanto como ثم الضمير yo.",
            ["tanto", "como"]
        ),
        choice_ex(
            "ex-a2-igu-5", "listen_choose",
            "استمع وحدد مقارنة السعر بين التذكرتين",
            ["listening", "vocabulary"], 2,
            "استمع للتسجيل وحدد ما قاله المتحدث عن الأسعار",
            "El billete de tren es tan barato como el de autobús.",
            "تذكرة القطار رخيصة تماماً مثل تذكرة الحافلة.",
            [
                opt("a", "tan", "متساويان في الرخص", True),
                opt("b", "más", "أكثر رخصاً", False, "المتحدث استخدم tan... como للتساوي."),
                opt("c", "menos", "أقل", False, "الجملة تفيد التساوي وليس التفوق أو النقصان.")
            ],
            ["tan", "como", "barato"],
            "المتحدث قال: tan barato como.",
            audioKey="pending/a2_tan_barato_como.mp3",
            speechEs="El billete de tren es tan barato como el de autobús."
        ),
        speak_ex(
            "ex-a2-igu-6",
            "انطق جملة التساوي في جودة الفندقين",
            ["speaking", "pronunciation"], 2,
            "أخبر زميلك بأن هذا الفندق ممتاز تماماً مثل الفندق الآخر",
            "Este hotel es tan bueno como el otro.",
            "هذا الفندق ممتاز مثل الآخر تماماً.",
            "pending/a2_tan_bueno_como.mp3",
            ["tan", "como"],
            "Este hotel es tan bueno como el otro.",
            "انتبه لنطق حرف b في bueno كـ صوت شفوي رقيق."
        )
    ]
    return lesson_doc(doc, exs)

def make_lesson_superlativos():
    slug = "a2-superlativos"
    doc = {
        "slug": slug,
        "unitSlug": "a2-u4-comparisons",
        "levelCode": "A2",
        "titleAr": "صيغ التفضيل المطلق والنسبي: El más... واللاحقة -ísimo",
        "titleEs": "Los superlativos relativos y absolutos (-ísimo)",
        "subtitleAr": "تركيب التفضيل النسبي (el más alto de) والمطلق بلاحقة التضخيم (-ísimo/a)",
        "order": 3,
        "estimatedMinutes": 18,
        "cefrLevel": "A2",
        "review": review_block(),
        "pedagogy": {
            "learningObjectivesAr": [
                "أن يصوغ المتعلم التفضيل النسبي: أداة التعريف + más/menos + صفة + de (el más alto de la clase).",
                "أن يصوغ التفضيل المطلق بإضافة اللاحقة -ísimo/a مع التغييرات الإملائية الصوتية (altísimo, facilísimo).",
                "أن يستخدم صفات الإعجاب والروعة: maravilloso, bonito, famoso, interesante."
            ],
            "grammarPoints": [
                {
                    "titleAr": "التفضيل النسبي والتفضيل المطلق",
                    "explanationAr": "1. **التفضيل النسبي (Superlativo relativo)**: المقارنة مع مجموعة كاملة:\n- أداة التعريف + más/menos + صفة + **de** المجموعة:\n- Es **el edificio más alto de** la ciudad (هو المبنى الأكثر ارتفاعاً في المدينة).\n- Nota: نستخدم حرف الجر **de** لتحديد المجموعة وليس en.\n2. **التفضيل المطلق (Superlativo absoluto)**: التعبير عن الدرجة القصوى دون مقارنة بأحد:\n- إضافة **-ísimo / -ísima / -ísimos / -ísimas** لنهاية الصفة بعد حذف الحرف الصامت الأخير:\n- alto -> altísimo (عالٍ جداً / في غاية الارتفاع)\n- fácil -> facilísimo (سهل للغاية)\n- grande -> grandísimo (ضخم للغاية)"
                }
            ],
            "commonMistakesAr": [
                "استخدام en بدلاً من de مع المجموعة في التفضيل النسبي (مثل قول *el más grande en el mundo* بتأثير اللغات الأخرى؛ الصواب في الإسبانية دائماً: el más grande del mundo).",
                "نسيان علامة النبر (tilde) على اللاحقة -ísimo (الصواب: facilísimo, altísimo)."
            ],
            "dialectNotes": [
                {
                    "region": "EG",
                    "noteAr": "في مصر نقول: «ده أعلى مبنى في البلد / الامتحان كان سهل موووت». في الإسبانية: Es el edificio más alto de la ciudad / El examen fue facilísimo."
                }
            ],
            "culturalNoteAr": "الإسبان يعشقون استخدام اللاحقة -ísimo في المحادثات الودية اليومية للتعبير عن الحماس والامتنان: «¡Muchísimas gracias!» أو «¡Buenísimo!»."
        },
        "contentBlocks": [
            {
                "id": f"cb-{slug}-intro",
                "type": "explanation",
                "titleAr": "صيغ التفضيل والتضخيم",
                "bodyAr": "المفردات والتراكيب المفتاحية:\n- **el/la más ... de**: الأكثر ... في (المجموعة)\n- **altísimo**: مرتفع للغاية\n- **facilísimo**: سهل للغاية\n- **bonito**: جميل / لطيف\n- **maravilloso**: رائع / مذهل\n- **famoso**: شهير / مشهور\n- **interesante**: ممتع / شيق",
                "examples": [
                    {"es": "Es la playa más bonita de España.", "ar": "هو أجمل شاطئ في إسبانيا."},
                    {"es": "El viaje fue maravilloso y facilísimo.", "ar": "كانت الرحلة رائعة وسهلة للغاية."},
                    {"es": "Este museo es famosísimo en todo el mundo.", "ar": "هذا المتحف شهير للغاية في العالم بأسره."}
                ]
            }
        ],
        "newVocabulary": ["altísimo", "facilísimo", "bonito", "maravilloso", "famoso", "interesante"],
        "reviewVocabulary": ["fuerte", "rápido"]
    }

    exs = [
        choice_ex(
            "ex-a2-sup-1", "word_choice",
            "اختر حرف الجر الصحيح في التفضيل النسبي مع المجموعة",
            ["grammar"], 1,
            "ما هو حرف الجر الذي يربط صيغة التفضيل بالمجموعة؟",
            "Es el monumento más famoso _____ la ciudad.",
            "هو المعلم الأكثر شهرة ... المدينة.",
            [
                opt("a", "de", "حرف الجر القياسي لتحديد المجموعة (الصواب)", True),
                opt("b", "en", "خطأ ترجمة حرفية من العربية", False, "في الإسبانية نستخدم de لتحديد المجموعة في التفضيل وليس en."),
                opt("c", "por", "حرف جر للسبب أو المرور", False, "por لا تستخدم في صيغ التفضيل النسبي.")
            ],
            ["famoso"],
            "في التفضيل النسبي نستخدم دائماً حرف الجر de: el más famoso de la ciudad."
        ),
        fill_ex(
            "ex-a2-sup-2",
            "أضف لاحقة التفضيل المطلق لصفة fácil",
            ["grammar", "writing"], 1,
            "اكتب صفة fácil بعد إضافة لاحقة التفضيل المطلق -ísimo",
            "El examen de español fue _____ para los estudiantes.",
            "امتحان الإسبانية كان سهلاً للغاية للطلاب.",
            ["facilísimo"],
            ["facilísimo", "facilisimo"],
            "الصفة facilísimo تُشتق من fácil بإضافة -ísimo مع الحفاظ على النبرة الصوتية."
        ),
        choice_ex(
            "ex-a2-sup-3", "word_choice",
            "اختر الصفة الدالة على الروعة والإبهار",
            ["vocabulary", "reading"], 2,
            "كيف تصف منظراً طبيعياً خلاباً يبهر العيون؟",
            "Las vistas desde la montaña son _____.",
            "المناظر من الجبل ... للغاية.",
            [
                opt("a", "maravillosas", "رائعة ومذهلة", True),
                opt("b", "altísimo", "مذكر مفرد ولا يطابق vistas", False, "vistas جمع مؤنث ويجب مطابقة الصفة: maravillosas."),
                opt("c", "rápido", "سريع", False, "rápido لا تصف المناظر الطبيعية.")
            ],
            ["maravilloso", "altísimo", "rápido"],
            "الصفة maravillosas تعني رائعة وخاطفة للأنفاس وتطابق الفاعل المؤنث الجمع."
        ),
        order_ex(
            "ex-a2-sup-4",
            "رتّب الجملة لوصف المبنى الأعلى في العاصمة",
            ["grammar", "writing"], 2,
            ["Es", "el", "edificio", "más", "alto", "de", "Madrid"],
            "Es el edificio más alto de Madrid",
            "الترتيب السليم: الفعل Es ثم أداة التعريف والاسم el edificio ثم التفضيل más alto ثم المجرور de Madrid.",
            ["altísimo"]
        ),
        choice_ex(
            "ex-a2-sup-5", "listen_choose",
            "استمع وحدد وصف الكتاب المذكور في التسجيل",
            ["listening", "vocabulary"], 2,
            "استمع لرأي القارئ وحدد وصفه للرواية",
            "He leído un libro interesantísimo sobre la historia.",
            "لقد قرأت كتاباً شيقاً للغاية عن التاريخ.",
            [
                opt("a", "interesante", "شيق / ممتع للغاية", True),
                opt("b", "bonito", "جميل", False, "المتحدث استخدم تحديداً صيغة التضخيم interesantísimo."),
                opt("c", "famoso", "مشهور", False, "المتحدث وصف المحتوى بالتشويق وليس الشهرة.")
            ],
            ["interesante", "bonito", "famoso"],
            "المتحدث قال: libro interesantísimo.",
            audioKey="pending/a2_libro_interesantisimo.mp3",
            speechEs="He leído un libro interesantísimo sobre la historia."
        ),
        speak_ex(
            "ex-a2-sup-6",
            "انطق جملة الإعجاب بجمال المكان",
            ["speaking", "pronunciation"], 2,
            "عبر عن إعجابك بجمال المدينة الإسبانية بطلاقة",
            "Esta plaza es la más bonita de la ciudad.",
            "هذا الميدان هو الأجمل في المدينة.",
            "pending/a2_plaza_mas_bonita.mp3",
            ["bonito"],
            "Esta plaza es la más bonita de la ciudad.",
            "احرص على مد الصوت في más ونطق t و d برقة إسبانية طبيعية."
        )
    ]
    return lesson_doc(doc, exs)

def make_lesson_comparar_ciudades():
    slug = "a2-comparar-ciudades"
    doc = {
        "slug": slug,
        "unitSlug": "a2-u4-comparisons",
        "levelCode": "A2",
        "titleAr": "تطبيق مقارنة المدن ونمط المعيشة والخدمات الحضرية",
        "titleEs": "Comparar ciudades y formas de vida",
        "subtitleAr": "دمج المقارنات والتفضيل لوصف الضوضاء والهدوء وحركة السير",
        "order": 4,
        "estimatedMinutes": 18,
        "cefrLevel": "A2",
        "review": review_block(),
        "pedagogy": {
            "learningObjectivesAr": [
                "أن يقارن المتعلم بين مدينتين من حيث: السكان، حركة المرور، الهدوء، وتكاليف المعيشة.",
                "أن يوظف مفردات البيئة الحضرية: tráfico, ruido, tranquilo, moderno, antiguo, población.",
                "أن يقدم تحليلاً متوازناً لمزايا وعيوب العيش في المدينة الكبيرة مقابل القرية."
            ],
            "grammarPoints": [
                {
                    "titleAr": "دمج المقارنات في النص الوصفي المتكامل",
                    "explanationAr": "عند المقارنة بين المدن ندمج أدوات التفوق والتساوي والتفضيل:\n- في حركة المرور والضوضاء: En la capital hay **más tráfico y ruido que** en los pueblos.\n- في الهدوء: Los pueblos son **mucho más tranquilos que** las grandes metrópolis.\n- في الحداثة والتاريخ: Este barrio es **más moderno que** el centro histórico, pero el centro es **el más bonito de** todos."
                }
            ],
            "commonMistakesAr": [
                "تذكير palabra كـ población (población مؤنثة وتنتهي بـ -ción: la población).",
                "استخدام صفة ruido بدلاً من ruidoso لوصف المدينة (ruido هو اسم 'الضوضاء'، بينما الصفة هي ruidoso/a)."
            ],
            "dialectNotes": [
                {
                    "region": "EG",
                    "noteAr": "في مصر نقارن بين القاهرة والمحافظات: «الزحمة في القاهرة أكتر، بس الأقاليم أهدى بكتير». في الإسبانية: Hay más tráfico en El Cairo, pero los pueblos son más tranquilos."
                }
            ],
            "culturalNoteAr": "في إسبانيا، يفضل الكثير من الموظفين والعائلات العيش في مدن ساحلية هادئة مثل فالنسيا أو مالقة بدلاً من مدريد بسبب قلة الازدحام وجودة الحياة (la calidad de vida)."
        },
        "contentBlocks": [
            {
                "id": f"cb-{slug}-intro",
                "type": "explanation",
                "titleAr": "المقارنة الحضرية ونمط الحياة",
                "bodyAr": "أهم الكلمات للمقارنة بين المدن:\n- **el tráfico**: حركة المرور / الزحام\n- **el ruido**: الضوضاء / الصوت العالي\n- **tranquilo**: هادئ\n- **moderno**: حديث / عصري\n- **antiguo**: قديم / عريق\n- **la población**: عدد السكان",
                "examples": [
                    {"es": "Mi ciudad natal es más tranquila que la capital.", "ar": "مسقط رأسي أكثر هدوءاً من العاصمة."},
                    {"es": "En el centro hay demasiado tráfico y ruido.", "ar": "في المركز يوجد زحام وضوضاء مفرطة."},
                    {"es": "Madrid tiene una población mayor que Sevilla.", "ar": "مدريد لديها عدد سكان أكبر من إشبيلية."}
                ]
            }
        ],
        "newVocabulary": ["tráfico", "ruido", "tranquilo", "moderno", "antiguo", "población"],
        "reviewVocabulary": ["ciudad", "calle"]
    }

    exs = [
        choice_ex(
            "ex-a2-ciu-1", "word_choice",
            "اختر الوصف الدال على السكون وقلة الإزعاج",
            ["vocabulary"], 1,
            "ما هي الصفة الإسبانية التي تصف مكاناً لا يوجد به ضجيج؟",
            "Prefiero vivir en un pueblo _____ cerca de la montaña.",
            "أفضل العيش في قرية ... قرب الجبل.",
            [
                opt("a", "tranquilo", "هادئ ومريح (الصواب)", True),
                opt("b", "ruido", "ضوضاء (اسم)", False, "ruido اسم يعني ضوضاء والمطلوب صفة تصف القرية."),
                opt("c", "tráfico", "حركة مرور (اسم)", False, "tráfico اسم مرور ولا يصلح كصفة.")
            ],
            ["tranquilo", "ruido", "tráfico"],
            "الصفة tranquilo تعني هادئاً ومريحاً للأعصاب."
        ),
        fill_ex(
            "ex-a2-ciu-2",
            "اكتب الكلمة الدالة على حركة السير والمرور",
            ["vocabulary", "writing"], 1,
            "اكتب كلمة 'حركة المرور' بالإسبانية بدقة",
            "A las ocho de la mañana hay mucho _____ en la avenida.",
            "في تمام الثامنة صباحاً توجد حركة مرور كثيفة في الجادة.",
            ["tráfico"],
            ["tráfico", "trafico"],
            "كلمة tráfico تعني حركة المرور مع علامة النبر على المقطع الأول."
        ),
        choice_ex(
            "ex-a2-ciu-3", "word_choice",
            "حدد المصطلح الدال على عدد سكان المدينة",
            ["vocabulary", "reading"], 2,
            "ما هو المصطلح الجغرافي الذي يعبر عن مجموع السكان في منطقة معينة؟",
            "Esta provincia tiene una _____ de dos millones de personas.",
            "هذه المقاطعة لديها ... من مليوني شخص.",
            [
                opt("a", "población", "تعداد السكان", True),
                opt("b", "antiguo", "قديم (صفة)", False, "antiguo صفة ولا تدل على عدد السكان."),
                opt("c", "moderno", "حديث (صفة)", False, "moderno لا تعبر عن الإحصاء السكاني.")
            ],
            ["población", "antiguo", "moderno"],
            "كلمة población تعني عدد السكان أو التعداد السكاني وهي مؤنثة."
        ),
        order_ex(
            "ex-a2-ciu-4",
            "رتّب الجملة للمقارنة بين المدن القديمة والحديثة",
            ["grammar", "writing"], 2,
            ["El", "centro", "histórico", "es", "más", "antiguo", "que", "el", "barrio", "moderno"],
            "El centro histórico es más antiguo que el barrio moderno",
            "الترتيب السليم: الفاعل El centro histórico ثم الفعل es ثم más antiguo ثم que والمقارن به el barrio moderno.",
            ["antiguo", "moderno"]
        ),
        choice_ex(
            "ex-a2-ciu-5", "listen_choose",
            "استمع وحدد شكوى المتحدث من العيش في المركز",
            ["listening", "vocabulary"], 2,
            "استمع للتسجيل وحدد ما يزعج الساكن في شقته",
            "No puedo dormir bien porque hay demasiado ruido en la calle.",
            "لا أستطيع النوم جيداً لأن هناك ضوضاء مفرطة في الشارع.",
            [
                opt("a", "ruido", "ضوضاء وإزعاج", True),
                opt("b", "tranquilo", "هدوء", False, "المتحدث يشكو من عدم النوم بسبب الإزعاج وليس الهدوء."),
                opt("c", "moderno", "حداثة", False, "الشكوى مرتبطة بالصوت المرتفع ruido.")
            ],
            ["ruido", "calle", "tranquilo", "moderno"],
            "المتحدث قال: hay demasiado ruido en la calle.",
            audioKey="pending/a2_demasiado_ruido.mp3",
            speechEs="No puedo dormir bien porque hay demasiado ruido en la calle."
        ),
        speak_ex(
            "ex-a2-ciu-6",
            "انطق مقارنتك بين مدينتك والعاصمة",
            ["speaking", "pronunciation"], 2,
            "أخبر زميلك بأن مدينتك أكثر هدوءاً من العاصمة بوضوح",
            "Mi ciudad es más tranquila que la capital.",
            "مدينتي أكثر هدوءاً من العاصمة.",
            "pending/a2_ciudad_mas_tranquila.mp3",
            ["tranquilo", "ciudad"],
            "Mi ciudad es más tranquila que la capital.",
            "تذكر مطابقة صفة tranquila في التأنيث مع la ciudad."
        )
    ]
    return lesson_doc(doc, exs)

# ==============================================================================
# UNIT 5: a2-u5-experiences (الماضي القريب والخبرات بـ Pretérito Perfecto)
# ==============================================================================

def make_lesson_perfecto_formacion():
    slug = "a2-perfecto-formacion"
    doc = {
        "slug": slug,
        "unitSlug": "a2-u5-experiences",
        "levelCode": "A2",
        "titleAr": "الماضي القريب المركب: صياغة Pretérito Perfecto بـ Haber واسم المفعول",
        "titleEs": "El pretérito perfecto compuesto: formación",
        "subtitleAr": "تصريف الفعل المساعد haber في الحاضر وتشكيل اسم المفعول المنتظم (-ado, -ido)",
        "order": 1,
        "estimatedMinutes": 18,
        "cefrLevel": "A2",
        "review": review_block(),
        "pedagogy": {
            "learningObjectivesAr": [
                "أن يصرف المتعلم الفعل المساعد haber في الحاضر بدقة: he, has, ha, hemos, habéis, han.",
                "أن يشتق اسم المفعول المنتظم (participio): أفعال -ar تأخذ -ado (hablado)، وأفعال -er/-ir تأخذ -ido (comido, vivido).",
                "أن يطبق القاعدة الصارمة: عدم الفصل بين haber واسم المفعول بأي كلمة إطلاقاً في الإسبانية."
            ],
            "grammarPoints": [
                {
                    "titleAr": "تركيب Pretérito Perfecto Compuesto",
                    "explanationAr": "يتكون الماضي القريب المركب من جزأين متلازمين:\n**تصريف فعل Haber في المضارع + اسم المفعول (Participio)**\n- yo **he** hablado / comido / vivido\n- tú **has** hablado / comido / vivido\n- él/ella/usted **ha** hablado / comido / vivido\n- nosotros **hemos** hablado / comido / vivido\n- vosotros **habéis** hablado / comido / vivido\n- ellos/ustedes **han** hablado / comido / vivido\nقاعدة حديدية في الإسبانية: اسم المفعول بعد haber يبقى دائماً مفرداً مذكراً منتهياً بـ o ولا يتغير أبداً مع الفاعل (نقول: María ha comido، ونقول: Ellas han comido، ولا نؤنث اسم المفعول أبداً)."
                }
            ],
            "commonMistakesAr": [
                "تأنيث أو جمع اسم المفعول بعد haber بتأثير الفرنسية (ممنوع في الإسبانية: الصواب دائماً مذكر مفرد: ellas han salido، والخطأ: *ellas han salidas*).",
                "الفصل بين haber واسم المفعول بكلمات مثل no أو ya (الصواب: ya he comido أو no he comido، ولا يجوز *he ya comido*)."
            ],
            "dialectNotes": [
                {
                    "region": "EG",
                    "noteAr": "في مصر نقول: «أنا لسه واكل / عشت في إسبانيا سنتين». في الإسبانية: He comido / He vivido dos años en España."
                }
            ],
            "culturalNoteAr": "في إسبانيا يُستخدم الماضي القريب بكثافة لأي حدث وقع في فترة زمنية لم تنتهِ بعد (مثل اليوم hoy، هذا الأسبوع esta semana، هذا الصباح esta mañana)."
        },
        "contentBlocks": [
            {
                "id": f"cb-{slug}-intro",
                "type": "explanation",
                "titleAr": "تكوين الماضي القريب",
                "bodyAr": "تصريفات الفعل المساعد haber وأسماء المفعول النموذجية:\n- **he**: تصريف haber مع yo\n- **has**: تصريف haber مع tú\n- **ha**: تصريف haber مع él/ella\n- **hemos**: تصريف haber مع nosotros\n- **habéis**: تصريف haber مع vosotros\n- **han**: تصريف haber مع ellos\n- **hablado**: اسم مفعول hablar (تحدث)\n- **comido**: اسم مفعول comer (أكل)\n- **vivido**: اسم مفعول vivir (عاش)",
                "examples": [
                    {"es": "Hoy he hablado con el director.", "ar": "اليوم تحدثت مع المدير."},
                    {"es": "¿Has comido paella alguna vez?", "ar": "¿هل أكلت الباييلا من قبل؟"},
                    {"es": "Hemos vivido en Madrid tres años.", "ar": "لقد عشنا في مدريد ثلاث سنوات."}
                ]
            }
        ],
        "newVocabulary": ["he", "has", "ha", "hemos", "habéis", "han", "hablado", "comido", "vivido"],
        "reviewVocabulary": ["viajar", "estudiar"]
    }

    exs = [
        choice_ex(
            "ex-a2-per-1", "word_choice",
            "اختر تصريف الفعل المساعد haber مع ضمير نحن nosotros",
            ["grammar"], 1,
            "ما هو تصريف الفعل المساعد haber المناسب لـ nosotros؟",
            "Esta mañana nosotros _____ terminado el informe.",
            "هذا الصباح نحن ... أنهينا التقرير.",
            [
                opt("a", "hemos", "تصريف haber مع nosotros (الصواب)", True),
                opt("b", "han", "تصريف الغائب الجمع ellos", False, "han تأتي مع هم/هن وليس مع نحن."),
                opt("c", "ha", "تصريف المفرد الغائب", False, "ha للمفرد وليس لضمير الجمع المتكلم.")
            ],
            ["hemos", "ha", "han"],
            "مع الضمير nosotros يكون تصريف الفعل المساعد دائماً hemos."
        ),
        fill_ex(
            "ex-a2-per-2",
            "اكتب اسم المفعول من الفعل estudiar",
            ["grammar", "writing"], 1,
            "اشتق اسم المفعول المنتظم من الفعل estudiar (أفعال -ar تأخذ -ado)",
            "Sara ha _____ mucho para este examen.",
            "سارة درست كثيراً لهذا الامتحان.",
            ["estudiado"],
            ["estudiado"],
            "أفعال المجموعة الأولى المنتهية بـ -ar يُصاغ اسم مفعولها بإضافة -ado: estudiado."
        ),
        choice_ex(
            "ex-a2-per-3", "word_choice",
            "اختر اسم المفعول الصحيح من الفعل vivir",
            ["grammar"], 2,
            "ما هو اسم المفعول من الفعل vivir المنتهي بـ -ir؟",
            "Mis abuelos han _____ en esa casa toda la vida.",
            "أجدادي عاشوا في ذلك البيت طوال حياتهم.",
            [
                opt("a", "vivido", "اسم المفعول الصحيح المنتهي بـ -ido", True),
                opt("b", "vividos", "خطأ جمع اسم المفعول بعد haber", False, "اسم المفعول بعد haber لا يُجمع أبداً في الإسبانية."),
                opt("c", "vivado", "نهاية خاطئة لأفعال المجموعة الثالثة", False, "أفعال -ir تأخذ -ido وليس -ado.")
            ],
            ["vivido", "han"],
            "أفعال -ir تأخذ اللاحقة -ido وتبقى مفردة مذكرة دائماً بعد haber: han vivido."
        ),
        order_ex(
            "ex-a2-per-4",
            "رتّب الجملة للتعبير عن تناول الغداء اليوم",
            ["grammar", "writing"], 2,
            ["Hoy", "he", "comido", "en", "un", "restaurante"],
            "Hoy he comido en un restaurante",
            "الترتيب السليم: ظرف الزمان Hoy ثم الفعل المركب he comido ثم شبه الجملة en un restaurante.",
            ["he", "comido"]
        ),
        choice_ex(
            "ex-a2-per-5", "listen_choose",
            "استمع وحدد ما فعله المتحدث هذا الصباح",
            ["listening", "vocabulary"], 2,
            "استمع للتسجيل وحدد النشاط الذي أنجزه المتحدث",
            "Esta mañana he hablado con el profesor de español.",
            "هذا الصباح تحدثت مع أستاذ الإسبانية.",
            [
                opt("a", "hablado", "تحدث", True),
                opt("b", "comido", "أكل", False, "المتحدث قال he hablado وليس he comido."),
                opt("c", "vivido", "عاش", False, "المتحدث تحدث عن مكالمة ونقاش مع الأستاذ.")
            ],
            ["hablado", "comido", "vivido", "he"],
            "المتحدث قال: he hablado con el profesor.",
            audioKey="pending/a2_he_hablado_profesor.mp3",
            speechEs="Esta mañana he hablado con el profesor de español."
        ),
        speak_ex(
            "ex-a2-per-6",
            "انطق جملتك بالماضي القريب بثقة",
            ["speaking", "pronunciation"], 2,
            "أخبر زميلك بأنك عشت في إسبانيا مدة عام",
            "He vivido un año en España.",
            "لقد عشت عاماً في إسبانيا.",
            "pending/a2_he_vivido_un_ano.mp3",
            ["vivido", "he"],
            "He vivido un año en España.",
            "تذكر أن حرف h في he صامت تماماً، وتنطق الكلمة كـ e قصيرة."
        )
    ]
    return lesson_doc(doc, exs)

def make_lesson_participios_irregulares():
    slug = "a2-participios-irregulares"
    doc = {
        "slug": slug,
        "unitSlug": "a2-u5-experiences",
        "levelCode": "A2",
        "titleAr": "أسماء المفعول الشاذة: Participios Irregulares الأكثر استخداماً",
        "titleEs": "Los participios irregulares esenciales",
        "subtitleAr": "أهم أسماء المفعول الشاذة: hecho, dicho, visto, escrito, puesto, abierto",
        "order": 2,
        "estimatedMinutes": 18,
        "cefrLevel": "A2",
        "review": review_block(),
        "pedagogy": {
            "learningObjectivesAr": [
                "أن يحفظ ويطبق المتعلم أشهر أسماء المفعول الشاذة في الإسبانية.",
                "أن يصوغ الماضي القريب للأفعال الشاذة: hacer -> hecho, decir -> dicho, ver -> visto, escribir -> escrito, poner -> puesto, abrir -> abierto.",
                "أن يركب جملاً يومية واقعية للإخبار بالمهام المنجزة (Ya he hecho los deberes)."
            ],
            "grammarPoints": [
                {
                    "titleAr": "قائمة أسماء المفعول الشاذة الحاسمة",
                    "explanationAr": "بعض أهم الأفعال الإسبانية لا تتبع قاعدة -ado و -ido في اسم المفعول، بل لها صيغ شاذة يجب حفظها غيباً:\n- **hacer** -> **hecho** (فعلَ / صنَع)\n- **decir** -> **dicho** (قالَ)\n- **ver** -> **visto** (رأى / شاهد)\n- **escribir** -> **escrito** (كتَب)\n- **poner** -> **puesto** (وضَع)\n- **abrir** -> **abierto** (فتَح)\n- **volver** -> **vuelto** (عاد / رجع)\nتحذير: لا تحاول قياس هذه الأفعال (ممنوع قول *hacido* أو *decido* أو *escribido*)."
                }
            ],
            "commonMistakesAr": [
                "محاولة قياس أسماء المفعول الشاذة بإضافة -ido (مثل كتابة *hacido* بدلاً من hecho أو *escribido* بدلاً من escrito).",
                "الخلط بين dicho كاسم مفعول و dicho كمَثَل شعبي في السياقات الثقافية."
            ],
            "dialectNotes": [
                {
                    "region": "EG",
                    "noteAr": "في مصر نقول: «أنا عملت الواجب / شفت الفيلم ده / كتبت الرسالة». في الإسبانية مع الشواذ: He hecho los deberes / He visto esa película / He escrito el mensaje."
                }
            ],
            "culturalNoteAr": "الإسبان كثيراً ما يجيبون عند التأكيد بعبارة شهيرة تجمع اسمين للمفعول: «¡Dicho y hecho!» (بمجرد أن قيل نُفّذ على الفور!)."
        },
        "contentBlocks": [
            {
                "id": f"cb-{slug}-intro",
                "type": "explanation",
                "titleAr": "أسماء المفعول الشاذة الأساسية",
                "bodyAr": "الأفعال الشاذة الرئيسية وصيغ اسم مفعولها:\n- **hacer -> hecho**: he hecho (فعلتُ / عملتُ)\n- **decir -> dicho**: has dicho (قلتَ)\n- **ver -> visto**: hemos visto (رأينا / شاهدنا)\n- **escribir -> escrito**: ha escrito (كتبَ)\n- **poner -> puesto**: he puesto (وضعتُ)\n- **abrir -> abierto**: han abierto (فتحوا)",
                "examples": [
                    {"es": "¿Qué has hecho este fin de semana?", "ar": "ماذا فعلت في عطلة نهاية هذا الأسبوع؟"},
                    {"es": "Ya he escrito el correo electrónico.", "ar": "لقد كتبت البريد الإلكتروني بالفعل."},
                    {"es": "Hemos visto una película excelente.", "ar": "شاهدنا فيلماً ممتازاً."}
                ]
            }
        ],
        "newVocabulary": ["hecho", "dicho", "visto", "escrito", "puesto", "abierto"],
        "reviewVocabulary": ["hacer", "decir"]
    }

    exs = [
        choice_ex(
            "ex-a2-irr-1", "word_choice",
            "اختر اسم المفعول الشاذ للفعل hacer",
            ["grammar"], 1,
            "ما هو اسم المفعول الصحيح من الفعل hacer؟",
            "Hoy he _____ mucho trabajo en la oficina.",
            "اليوم قمت بـ ... عمل كثير في المكتب.",
            [
                opt("a", "hecho", "اسم المفعول الشاذ الصحيح (الصواب)", True),
                opt("b", "hacido", "خطأ قياس غير موجود في الإسبانية", False, "hacer فعل شاذ واسم مفعوله hecho وليس hacido."),
                opt("c", "haciendo", "صيغة استمرار gerundio", False, "بعد haber نحتاج اسم مفعول وليس gerundio.")
            ],
            ["hecho", "hacer"],
            "اسم المفعول من hacer هو hecho دائماً: he hecho."
        ),
        fill_ex(
            "ex-a2-irr-2",
            "اكتب اسم المفعول الشاذ للفعل ver",
            ["grammar", "writing"], 1,
            "اكتب اسم المفعول من الفعل ver (رأى / شاهد)",
            "¿Has _____ la última película de Almodóvar?",
            "هل رأيت آخر أفلام ألمودوبار؟",
            ["visto"],
            ["visto"],
            "اسم المفعول من الفعل ver هو visto."
        ),
        choice_ex(
            "ex-a2-irr-3", "word_choice",
            "حدد اسم المفعول الشاذ للفعل escribir",
            ["grammar", "reading"], 2,
            "ما هي الكلمة الصحيحة لقول 'لقد كتبتُ الرسالة'؟",
            "Ya he _____ la carta para el consulado.",
            "لقد ... الخطاب للقنصلية بالفعل.",
            [
                opt("a", "escrito", "اسم المفعول الشاذ الصحيح", True),
                opt("b", "escribido", "خطأ فاحش بقياس الشاذ", False, "escribir شاذ في اسم المفعول وصيغته escrito."),
                opt("c", "puesto", "اسم مفعول poner (وضع)", False, "puesto تعني وضعت وليس كتبت.")
            ],
            ["escrito", "puesto"],
            "اسم المفعول من escribir هو escrito."
        ),
        order_ex(
            "ex-a2-irr-4",
            "رتّب الجملة للتعبير عما قاله المدير اليوم",
            ["grammar", "writing"], 2,
            ["El", "jefe", "ha", "dicho", "la", "verdad"],
            "El jefe ha dicho la verdad",
            "الترتيب السليم: الفاعل El jefe ثم الفعل المركب ha dicho ثم المفعول به la verdad.",
            ["dicho", "decir"]
        ),
        choice_ex(
            "ex-a2-irr-5", "listen_choose",
            "استمع وحدد ما تم فتحه هذا الصباح",
            ["listening", "vocabulary"], 2,
            "استمع للتسجيل وحدد الفعل الشاذ المستخدم",
            "Han abierto una tienda nueva en mi calle.",
            "لقد فتحوا متجراً جديداً في شارعي.",
            [
                opt("a", "abierto", "فتحوا / مفتوح", True),
                opt("b", "puesto", "وضعوا", False, "المتحدث قال han abierto وليس han puesto."),
                opt("c", "hecho", "صنعوا", False, "الفعل المسموع هو abrir بصيغة اسم المفعول abierto.")
            ],
            ["abierto", "puesto", "hecho"],
            "اسم المفعول الشاذ من abrir هو abierto: han abierto.",
            audioKey="pending/a2_han_abierto_tienda.mp3",
            speechEs="Han abierto una tienda nueva en mi calle."
        ),
        speak_ex(
            "ex-a2-irr-6",
            "انطق جملة إتمامك للعمل اليوم",
            ["speaking", "pronunciation"], 2,
            "أخبر زميلك بأنك أنجزت كافة الواجبات والمهام بنطق سليم",
            "Ya he hecho todos los ejercicios.",
            "لقد قمت بحل جميع التمارين بالفعل.",
            "pending/a2_he_hecho_ejercicios.mp3",
            ["hecho", "hacer"],
            "Ya he hecho todos los ejercicios.",
            "تذكر أن حرف h في hecho صامت تماماً، وتنطق الكلمة: إيتشو."
        )
    ]
    return lesson_doc(doc, exs)

def make_lesson_marcadores_experiencias():
    slug = "a2-marcadores-experiencias"
    doc = {
        "slug": slug,
        "unitSlug": "a2-u5-experiences",
        "levelCode": "A2",
        "titleAr": "علامات الخبرات الحياتية: Alguna vez و Ya و Todavía no",
        "titleEs": "Marcadores temporales de experiencia",
        "subtitleAr": "السؤال عن التجارب الحياتية السابقة والتعبير عن الإنجاز أو التأجيل",
        "order": 3,
        "estimatedMinutes": 18,
        "cefrLevel": "A2",
        "review": review_block(),
        "pedagogy": {
            "learningObjectivesAr": [
                "أن يسأل المتعلم عن التجارب الحياتية السابقة باستخدام: ¿Alguna vez has...? (هل سبق لك أن...؟).",
                "أن يجيب بالإيجاب باستخدام ya (بالفعل / تماماً) مع الفعل المركب.",
                "أن يجيب بالنفي باستخدام todavía no (ليس بعد) أو nunca (أبداً / قط)."
            ],
            "grammarPoints": [
                {
                    "titleAr": "مؤشرات الخبرة مع Pretérito Perfecto",
                    "explanationAr": "تُستخدم علامات زمنية مميزة مع الماضي القريب للسؤال عن الخبرات المتراكمة طوال العمر:\n1. **¿Alguna vez has + participio?**: هل سبق لك في أي وقت من حياتك أن فعلت كذا؟\n- ¿Alguna vez has estado en Toledo? (هل سبق لك أن زرت طليطلة؟)\n2. الإجابة بالإثبات: **Sí, ya he + participio**:\n- Sí, ya he visitado Toledo (نعم، لقد زرتها بالفعل).\n3. الإجابة بالنفي: **No, todavía no he + participio**:\n- No, todavía no he ido (لا، لم أذهب بعد).\n4. النفي المطلق: **No, nunca he + participio** / **Jamás he + participio** (لا، لم أزرها قط في حياتي)."
                }
            ],
            "commonMistakesAr": [
                "ترجمة 'لسه ما عملتش' بحرفية بوضع بعد الفعل (الصواب وضع todavía no قبل الفعل المساعد: todavía no he comido).",
                "الخلط بين ya (التي تفيد تحقق الفعل) و todavía (التي تفيد استمرار الحالة أو عدم تحققها مع no)."
            ],
            "dialectNotes": [
                {
                    "region": "EG",
                    "noteAr": "في مصر نقول: «عمرك سافرت إسبانيا؟ أيوة سافرت خلاص / لسه ما سافرتش / عمري ما سافرت». في الإسبانية: ¿Alguna vez has viajado? Sí, ya he viajado / No, todavía no / Nunca he viajado."
                }
            ],
            "culturalNoteAr": "في المقابلات الشخصية والتعارف في إسبانيا، يُعد السؤال بـ «¿Alguna vez has...?» مفتاحاً لفتح نقاشات ودية ممتعة حول السفر والرياضة والطبخ."
        },
        "contentBlocks": [
            {
                "id": f"cb-{slug}-intro",
                "type": "explanation",
                "titleAr": "مؤشرات الخبرة الحياتية",
                "bodyAr": "الكلمات الدالة على الخبرات:\n- **alguna vez**: في أي وقت / هل سبق لك\n- **nunca**: أبداً / قط\n- **jamás**: إطلاقاً / أبداً\n- **ya**: بالفعل / خلاص\n- **todavía no**: ليس بعد / لسه\n- **recientemente / últimamente**: مؤخراً / حديثاً",
                "examples": [
                    {"es": "¿Alguna vez has probado la comida mexicana?", "ar": "¿هل سبق لك أن تذوقت الطعام المكسيكي؟"},
                    {"es": "No, todavía no la he probado.", "ar": "لا، لم أتذوقه بعد."},
                    {"es": "Nunca he viajado en avión.", "ar": "لم أسافر بالطائرة قط في حياتي."}
                ]
            }
        ],
        "newVocabulary": ["alguna vez", "nunca", "jamás", "recientemente", "últimamente"],
        "reviewVocabulary": ["ya", "todavía"]
    }

    exs = [
        choice_ex(
            "ex-a2-exp-1", "word_choice",
            "اختر التعبير المناسب للسؤال عن التجارب السابقة",
            ["grammar"], 1,
            "ما هي العبارة التي تعني 'هل سبق لك يوماً'؟",
            "¿_____ has montado a caballo?",
            "هل ... ركبت حصاناً؟",
            [
                opt("a", "Alguna vez", "هل سبق لك يوماً (الصواب)", True),
                opt("b", "Todavía no", "ليس بعد (إجابة نفي)", False, "Todavía no تعني ليس بعد ولا تأتي كأداة استفهام هنا."),
                opt("c", "Nunca", "أبداً (نفي)", False, "Nunca تفيد النفي وليس الاستفسار عن التجربة.")
            ],
            ["alguna vez", "nunca", "todavía"],
            "السؤال القياسي عن التجارب الحياتية يبدأ بـ: ¿Alguna vez has...?"
        ),
        fill_ex(
            "ex-a2-exp-2",
            "اكتب الكلمة الدالة على تحقق الفعل بالفعل",
            ["vocabulary", "writing"], 1,
            "اكتب الكلمة الإسبانية القصيرة التي تعني 'بالفعل / تم الأمر'",
            "Sí, _____ he terminado de estudiar todo el temario.",
            "نعم، لقد انتهيت من دراسة كامل المقرر بالفعل.",
            ["ya"],
            ["ya"],
            "كلمة ya تسبق الفعل للدلالة على إنجاز الحدث وتحققه."
        ),
        choice_ex(
            "ex-a2-exp-3", "word_choice",
            "اختر التعبير الدال على عدم حدوث الفعل حتى اللحظة مع إمكانية حدوثه",
            ["grammar", "reading"], 2,
            "كيف تعبر عن أنك لم تزر الأندلس بعد ولكنك تنوي ذلك؟",
            "No, _____ he visitado Granada, pero quiero ir pronto.",
            "لا، ... أزر غرناطة، ولكنني أريد الذهاب قريباً.",
            [
                opt("a", "todavía no", "ليس بعد (مع ترقب الحدوث)", True),
                opt("b", "ya", "بالفعل (إثبات)", False, "ya تفيد وقوع الحدث بينما الجملة منفية."),
                opt("c", "alguna vez", "في أي وقت", False, "alguna vez تأتي في السؤال وليس في نفي الخبرة الحالية.")
            ],
            ["todavía", "ya", "alguna vez"],
            "عبارة todavía no تعني 'ليس بعد' وتفيد ترقب وقوع الفعل مستقبلاً."
        ),
        order_ex(
            "ex-a2-exp-4",
            "رتّب الجملة للنفي القاطع بعدم السفر بالقطار قط",
            ["grammar", "writing"], 2,
            ["Nunca", "he", "viajado", "en", "tren", "rápido"],
            "Nunca he viajado en tren rápido",
            "الترتيب السليم: أداة النفي المطلق Nunca ثم الفعل المركب he viajado ثم وسيلة النقل en tren rápido.",
            ["nunca"]
        ),
        choice_ex(
            "ex-a2-exp-5", "listen_choose",
            "استمع وحدد ما فعله المتحدث مؤخراً",
            ["listening", "vocabulary"], 2,
            "استمع للتسجيل وحدد الظرف الزمني المستخدم",
            "Últimamente he tenido muchas reuniones en el trabajo.",
            "مؤخراً كان لدي اجتماعات كثيرة في العمل.",
            [
                opt("a", "últimamente", "مؤخراً / في الآونة الأخيرة", True),
                opt("b", "nunca", "أبداً", False, "المتحدث قال últimamente وليس nunca."),
                opt("c", "jamás", "إطلاقاً", False, "المتحدث تحدث عن كثرة الاجتماعات مؤخراً.")
            ],
            ["últimamente", "nunca", "jamás"],
            "الظرف المستخدم هو últimamente ويعني في الآونة الأخيرة.",
            audioKey="pending/a2_ultimamente_reuniones.mp3",
            speechEs="Últimamente he tenido muchas reuniones en el trabajo."
        ),
        speak_ex(
            "ex-a2-exp-6",
            "انطق سؤالك لصديقك عن تجاربه السابقة",
            ["speaking", "pronunciation"], 2,
            "اسأل زميلك بنطق سليم عما إذا كان قد زار إسبانيا من قبل",
            "¿Alguna vez has estado en España?",
            "هل سبق لك أن زرت إسبانيا؟",
            "pending/a2_alguna_vez_espana.mp3",
            ["alguna vez"],
            "¿Alguna vez has estado en España?",
            "ارفع نبرة الصوت في نهاية السؤال الاستفهامي بنغم إسباني طبيعي."
        )
    ]
    return lesson_doc(doc, exs)

def make_lesson_hablar_de_experiencias():
    slug = "a2-hablar-de-experiencias"
    doc = {
        "slug": slug,
        "unitSlug": "a2-u5-experiences",
        "levelCode": "A2",
        "titleAr": "التحدث عن الخبرات الحياتية والمهنية وتجربة أشياء جديدة",
        "titleEs": "Hablar de experiencias personales y laborales",
        "subtitleAr": "دمج Pretérito Perfecto لتقديم نبذة عن التجارب وتجربة الأطعمة والفرص",
        "order": 4,
        "estimatedMinutes": 18,
        "cefrLevel": "A2",
        "review": review_block(),
        "pedagogy": {
            "learningObjectivesAr": [
                "أن يتحدث المتعلم عن تجاربه الشخصية والمهنية السابقة بثقة وسلاسة.",
                "أن يوظف الفعل probar للتعبير عن تجربة طعام أو نشاط جديد لأول مرة.",
                "أن يصف تجربة العيش أو العمل في الخارج (en el extranjero) والفرص المتاحة (oportunidad)."
            ],
            "grammarPoints": [
                {
                    "titleAr": "سرد الخبرات في مقابلات العمل والتعارف",
                    "explanationAr": "عند الحديث عن سيرتك وتجاربك الشخصية ندمج الماضي القريب للتعبير عن إنجازات الحياة:\n- **En mi vida he hecho** muchas cosas interesantes (في حياتي قمت بأشياء كثيرة شيقة).\n- **He trabajado en el extranjero** durante dos años (عملتُ في الخارج مدة عامين).\n- **He tenido la oportunidad de** aprender idiomas (أتيحت لي الفرصة لتعلم اللغات).\n- **He probado** platos típicos de muchos países (جربتُ وتذوقتُ أطباقاً تقليدية من بلدان كثيرة)."
                }
            ],
            "commonMistakesAr": [
                "استخدام intentar بدلاً من probar عند الحديث عن تذوق الطعام أو تجربة الملابس (الصواب: probar la comida، بينما intentar تعني يحاول بذل جهد).",
                "الخلط بين en el extranjero (في الخارج / خارج الوطن) و un extranjero (شخص أجنبي غريب)."
            ],
            "dialectNotes": [
                {
                    "region": "EG",
                    "noteAr": "في مصر نقول: «أنا جربت الأكل الإسباني، واشتغلت برة في الخليج وجاتلي فرصة كويسة». في الإسبانية: He probado la comida española, he trabajado en el extranjero y he tenido una buena oportunidad."
                }
            ],
            "culturalNoteAr": "في إسبانيا، عند تجربة أكلة جديدة، يسألك المضيف باهتمام: «¿Qué tal? ¿Te ha gustado?» ومن اللياقة أن تجيب: «¡Está riquísimo! Me ha encantado»."
        },
        "contentBlocks": [
            {
                "id": f"cb-{slug}-intro",
                "type": "explanation",
                "titleAr": "الخبرات والفرص والتجارب",
                "bodyAr": "المفردات التعبيرية للحديث عن الخبرات:\n- **la experiencia**: الخبرة / التجربة الحياتية\n- **la vida**: الحياة\n- **el país**: البلد / الوطن\n- **el extranjero**: الخارج (vivir en el extranjero)\n- **la oportunidad**: الفرصة\n- **probar**: يجرّب / يتذوق (فعل يغير جذره: o -> ue)",
                "examples": [
                    {"es": "Ha sido una experiencia inolvidable.", "ar": "لقد كانت تجربة لا تُنسى."},
                    {"es": "He tenido la oportunidad de viajar por trabajo.", "ar": "أتيحت لي الفرصة للسفر من أجل العمل."},
                    {"es": "Nunca he probado este tipo de dulce.", "ar": "لم أجرب هذا النوع من الحلوى قط."}
                ]
            }
        ],
        "newVocabulary": ["experiencia", "vida", "país", "extranjero", "oportunidad", "probar"],
        "reviewVocabulary": ["empresa", "idiomas"]
    }

    exs = [
        choice_ex(
            "ex-a2-hex-1", "word_choice",
            "اختر الفعل المناسب لتذوق طعام جديد لأول مرة",
            ["vocabulary"], 1,
            "أي فعل إسباني يعني 'يجرب / يتذوق' طعاماً أو شراباً؟",
            "¿Has _____ alguna vez la tortilla española?",
            "هل ... التورتيا الإسبانية من قبل؟",
            [
                opt("a", "probado", "تذوقت / جربت (الصواب)", True),
                opt("b", "vivido", "عشت", False, "الأطعمة نستخدم معها probar للتذوق وليس vivir."),
                opt("c", "viajado", "سافرت", False, "viajado خاصة بالأسفار وليس الأطعمة.")
            ],
            ["probar", "experiencia"],
            "الفعل probar يعني يجرب أو يتذوق اسم مفعوله probado."
        ),
        fill_ex(
            "ex-a2-hex-2",
            "اكتب الكلمة الدالة على العيش خارج الوطن",
            ["vocabulary", "writing"], 1,
            "اكتب الكلمة الإسبانية التي تعني 'الخارج' (مثل: العمل في الخارج)",
            "Muchos jóvenes quieren trabajar en el _____.",
            "الكثير من الشباب يريدون العمل في الخارج.",
            ["extranjero"],
            ["extranjero"],
            "تعبير en el extranjero يعني في الخارج / خارج حدود الوطن."
        ),
        choice_ex(
            "ex-a2-hex-3", "word_choice",
            "اختر الكلمة المعبرة عن إتاحة الإمكانية المواتية",
            ["vocabulary", "reading"], 2,
            "ماذا تسمى المناسبة المواتية التي تفتح باب التطور؟",
            "Este trabajo ha sido una gran _____ para mi carrera.",
            "هذا العمل كان ... رائعة لمسيرتي المهنية.",
            [
                opt("a", "oportunidad", "فرصة مواتية", True),
                opt("b", "país", "بلد", False, "país تعني بلداً ولا تكمل المعنى المجازي للفرصة."),
                opt("c", "vida", "حياة", False, "التركيب الأنسب للوظيفة هو una gran oportunidad.")
            ],
            ["oportunidad", "país", "vida"],
            "كلمة oportunidad تعني فرصة سانحة (una gran oportunidad)."
        ),
        order_ex(
            "ex-a2-hex-4",
            "رتّب الجملة للتعبير عن خوض تجارب متعددة في الحياة",
            ["grammar", "writing"], 2,
            ["En", "mi", "vida", "he", "tenido", "muchas", "experiencias"],
            "En mi vida he tenido muchas experiencias",
            "الترتيب السليم: شبه الجملة En mi vida ثم الفعل المركب he tenido ثم المفعول به muchas experiencias.",
            ["vida", "experiencia"]
        ),
        choice_ex(
            "ex-a2-hex-5", "listen_choose",
            "استمع وحدد ما تعلمه المتحدث في رحلته",
            ["listening", "vocabulary"], 2,
            "استمع للتسجيل وحدد ما استفاده المتحدث من عيشه في الخارج",
            "Vivir en el extranjero ha sido una experiencia maravillosa.",
            "العيش في الخارج كان تجربة رائعة.",
            [
                opt("a", "experiencia", "تجربة وخبرة", True),
                opt("b", "empresa", "شركة", False, "المتحدث ركز على وصف التجربة الحياتية experiencia."),
                opt("c", "idiomas", "لغات", False, "المتحدث وصف المعيشة بالتجربة الرائعة.")
            ],
            ["experiencia", "extranjero", "empresa", "idiomas"],
            "المتحدث قال: una experiencia maravillosa.",
            audioKey="pending/a2_experiencia_maravillosa.mp3",
            speechEs="Vivir en el extranjero ha sido una experiencia maravillosa."
        ),
        speak_ex(
            "ex-a2-hex-6",
            "انطق رغبتك في اغتنام فرصة مهنية جديدة",
            ["speaking", "pronunciation"], 2,
            "أخبر زميلك بأنك حصلت على فرصة جيدة في بلد جديد",
            "He tenido una buena oportunidad en este país.",
            "لقد حصلت على فرصة جيدة في هذا البلد.",
            "pending/a2_buena_oportunidad.mp3",
            ["oportunidad", "país"],
            "He tenido una buena oportunidad en este país.",
            "احرص على نطق حرف d في oportunidad و p في país بانفجار هوائي خفيف."
        )
    ]
    return lesson_doc(doc, exs)

def get_lessons():
    return [
        make_lesson_comparativos_superioridad(),
        make_lesson_comparativos_igualdad(),
        make_lesson_superlativos(),
        make_lesson_comparar_ciudades(),
        make_lesson_perfecto_formacion(),
        make_lesson_participios_irregulares(),
        make_lesson_marcadores_experiencias(),
        make_lesson_hablar_de_experiencias()
    ]
