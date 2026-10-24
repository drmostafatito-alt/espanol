# -*- coding: utf-8 -*-
"""A2 Unit 3: a2-u3-future-plans (الخطط والمستقبل القريب).
4 Lessons based on Aula Plus 2 Unidad 9 and Gramática del uso Capítulos 38-39.
"""
from common import opt, choice_ex, fill_ex, order_ex, speak_ex, lesson_doc, review_block

def make_lesson_ir_a():
    slug = "a2-ir-a-infinitivo"
    doc = {
        "slug": slug,
        "unitSlug": "a2-u3-future-plans",
        "levelCode": "A2",
        "titleAr": "المستقبل القريب: التعبير عن النوايا والخطط بـ Ir a + Infinitivo",
        "titleEs": "El futuro próximo: ir a + infinitivo",
        "subtitleAr": "تركيب النية المؤكدة والخطط القريبة مقابل التنبؤ البعيد",
        "order": 1,
        "estimatedMinutes": 18,
        "cefrLevel": "A2",
        "review": review_block(),
        "pedagogy": {
            "learningObjectivesAr": [
                "أن يصوغ المتعلم تركيب المستقبل القريب: تصريف ir في المضارع + حرف الجر a + الفعل في المصدر.",
                "أن يستخدم التركيب للتعبير عن خطط ونوايا مؤكدة الحدوث في المستقبل القريب.",
                "أن يربط التركيب بظروف الزمان المستقبلية (esta tarde, este fin de semana, el próximo año)."
            ],
            "grammarPoints": [
                {
                    "titleAr": "قاعدة Ir a + Infinitivo",
                    "explanationAr": "يُعد تركيب Ir a + infinitivo الصيغة الأكثر استخداماً في المحادثة الإسبانية اليومية للتعبير عن المستقبل:\n- voy a + مصدر (voy a estudiar)\n- vas a + مصدر (vas a viajar)\n- va a + مصدر (va a comer)\n- vamos a + مصدر (vamos a salir)\n- vais a + مصدر (vais a comprar)\n- van a + مصدر (van a trabajar)\nقاعدة هامة: لا تنسَ أبداً حرف الجر a بين فعل ir والمصدر (الصواب: voy a comer، والخطأ الشائع: *voy comer*)."
                }
            ],
            "commonMistakesAr": [
                "حذف حرف الجر a بتأثير الترجمة الحرفية (مثل قول *voy trabajar* بدلاً من voy a trabajar).",
                "تصريف الفعل الثاني بدلاً من تركه في المصدر (مثل قول *voy a estudio* بدلاً من voy a estudiar)."
            ],
            "dialectNotes": [
                {
                    "region": "EG",
                    "noteAr": "في العامية المصرية نستخدم حرف «حـ» أو كلمة «رايح» للمستقبل القريب: «أنا رايح أذاكر / حأشتري عربية». في الإسبانية نفس التركيب بالضبط: Voy a estudiar / Voy a comprar un coche."
                }
            ],
            "culturalNoteAr": "في إسبانيا وأمريكا اللاتينية، يُفضل المتحدثون استخدام ir a + infinitivo في أكثر من 80% من مواقف الحديث عن المستقبل اليومي بدلاً من صيغة المستقبل البسيط (futuro simple)."
        },
        "contentBlocks": [
            {
                "id": f"cb-{slug}-intro",
                "type": "explanation",
                "titleAr": "صيغة المستقبل القريب",
                "bodyAr": "التركيب القياسي للتعبير عما تنوي فعله:\n- **تصريف ir في الحاضر** + **a** + **المصدر**\n- **el plan**: الخطة / المشروع\n- **pensar**: يفكر / ينوي\n- **el proyecto**: المشروع\n- **próximo**: القادم / المقبل\n- **el fin de semana**: عطلة نهاية الأسبوع\n- **decidir**: يقرر",
                "examples": [
                    {"es": "Voy a viajar a Madrid el próximo mes.", "ar": "سوف أسافر إلى مدريد الشهر القادم."},
                    {"es": "¿Qué vas a hacer este fin de semana?", "ar": "ماذا ستفعل في عطلة نهاية هذا الأسبوع؟"},
                    {"es": "Vamos a empezar un proyecto nuevo.", "ar": "سوف نبدأ مشروعاً جديداً."}
                ]
            }
        ],
        "newVocabulary": ["pensar", "plan", "próximo", "fin de semana", "proyecto", "decidir"],
        "reviewVocabulary": ["viaje", "estudiar"]
    }

    exs = [
        choice_ex(
            "ex-a2-ira-1", "word_choice",
            "اختر حرف الجر الإلزامي في تركيب المستقبل القريب",
            ["grammar"], 1,
            "ما هو الحرف الذي يفصل بين تصريف ir والفعل المصدر؟",
            "Mañana voy _____ descansar todo el día.",
            "غداً سأستريح طوال اليوم.",
            [
                opt("a", "a", "حرف الجر الإلزامي في التركيب", True),
                opt("b", "de", "حرف جر خاطئ في هذا التركيب", False, "التركيب النحوي هو ir a + infinitivo وليس de."),
                opt("c", "en", "حرف جر غير مناسب", False, "لا نستخدم en مع المستقبل القريب.")
            ],
            ["decidir"],
            "القاعدة الذهبية: تركيب المستقبل القريب يتطلب دائماً حرف الجر a: voy a descansar."
        ),
        fill_ex(
            "ex-a2-ira-2",
            "أكمل تصريف فعل ir مع ضمير الجمع nosotros",
            ["grammar", "writing"], 1,
            "اكتب تصريف ir مع nosotros لتكوين المستقبل القريب",
            "El próximo lunes _____ a comenzar el nuevo curso.",
            "الاثنين القادم سوف نبدأ الدورة الجديدة.",
            ["vamos"],
            ["vamos"],
            "تصريف الفعل ir مع نحن (nosotros) هو vamos."
        ),
        choice_ex(
            "ex-a2-ira-3", "word_choice",
            "اختر المصطلح المناسب لعطلة نهاية الأسبوع",
            ["vocabulary", "reading"], 2,
            "كيف نعبّر بالإسبانية عن يومي العطلة الأسبوعية؟",
            "Voy al campo este _____ con mi familia.",
            "سأذهب إلى الريف ... مع عائلتي.",
            [
                opt("a", "fin de semana", "عطلة نهاية الأسبوع", True),
                opt("b", "proyecto", "مشروع", False, "proyecto تعني مشروعاً ولا تعبر عن العطلة الزمانية."),
                opt("c", "plan", "خطة", False, "العبارة الزمنية المحددة هي este fin de semana.")
            ],
            ["fin de semana", "proyecto", "plan"],
            "التعبير الإسباني لعطلة نهاية الأسبوع هو el fin de semana."
        ),
        order_ex(
            "ex-a2-ira-4",
            "رتّب الجملة للتعبير عن النية في السفر الصيف القادم",
            ["grammar", "writing"], 2,
            ["Voy", "a", "viajar", "el", "próximo", "verano"],
            "Voy a viajar el próximo verano",
            "الترتيب السليم: الفعل المساعد وحرف الجر Voy a ثم المصدر viajar ثم الظرف el próximo verano.",
            ["próximo", "viaje"]
        ),
        choice_ex(
            "ex-a2-ira-5", "listen_choose",
            "استمع وحدد قرار المتحدث للمستقبل",
            ["listening", "vocabulary"], 2,
            "استمع للتسجيل وحدد الفعل الذي ينوي المتحدث اتخاذه",
            "He decidido que voy a cambiar de trabajo.",
            "لقد قررت أنني سأغير وظيفتي.",
            [
                opt("a", "decidir", "يقرر", True),
                opt("b", "pensar", "يفكر", False, "المتحدث قال بوضوح: He decidido (قررت)."),
                opt("c", "estudiar", "يدرس", False, "المتحدث لم يذكر الدراسة.")
            ],
            ["decidir", "pensar", "estudiar"],
            "المتحدث صرّح بقراره قائلاً: He decidido que voy a cambiar de trabajo.",
            audioKey="pending/a2_he_decidido_cambiar.mp3",
            speechEs="He decidido que voy a cambiar de trabajo."
        ),
        speak_ex(
            "ex-a2-ira-6",
            "انطق خطتك المستقبلية لدراسة اللغة",
            ["speaking", "pronunciation"], 2,
            "أخبر زميلك بأنك ستدرس الإسبانية بجدية هذا الأسبوع",
            "Voy a estudiar español todos los días.",
            "سوف أدرس الإسبانية كل يوم.",
            "pending/a2_voy_a_estudiar.mp3",
            ["estudiar", "plan"],
            "Voy a estudiar español todos los días.",
            "احرص على وصل الصوت بين voy و a لتصبح نبرة واحدة طبيعية: voya."
        )
    ]
    return lesson_doc(doc, exs)

def make_lesson_planes_proyectos():
    slug = "a2-planes-proyectos"
    doc = {
        "slug": slug,
        "unitSlug": "a2-u3-future-plans",
        "levelCode": "A2",
        "titleAr": "التعبير عن الخطط بـ Pensar و Querer والظروف الزمنية",
        "titleEs": "Planes y proyectos: pensar y querer",
        "subtitleAr": "التفريق بين النية (pensar + inf) والرغبة (querer + inf) وظروف الزمان",
        "order": 2,
        "estimatedMinutes": 18,
        "cefrLevel": "A2",
        "review": review_block(),
        "pedagogy": {
            "learningObjectivesAr": [
                "أن يميز المتعلم بين Pensar + infinitivo (التفكير في النية) و Querer + infinitivo (الرغبة في التنفيذ).",
                "أن يستخدم الظروف والعلامات الزمنية للمستقبل: mañana, el próximo año, el mes que viene.",
                "أن يصف مشروعاً شخصياً أو مهنياً بأسلوب مترابط."
            ],
            "grammarPoints": [
                {
                    "titleAr": "أفعال النوايا والمشاريع",
                    "explanationAr": "للتعبير عن الخطط المستقبلية غير المحسومة بعد، نستخدم:\n1. **Pensar + infinitivo**: Pienso cambiar de casa (أنوي / أفكر في تغيير منزلي).\n2. **Querer + infinitivo**: Quiero aprender a conducir (أريد / أرغب في تعلم القيادة).\n3. **Tener la intención de + infinitivo**: Tengo la intención de buscar otro empleo (لدي النية في البحث عن وظيفة أخرى)."
                }
            ],
            "commonMistakesAr": [
                "وضع حرف الجر en بعد pensar عندما يليه فعل في المصدر (الصحيح: pienso viajar، بينما pienso en ti تعني أفكر في شخص).",
                "تصريف الفعل الثاني بعد pensar أو querer (الصواب دائماً بقاء الفعل الثاني في المصدر)."
            ],
            "dialectNotes": [
                {
                    "region": "EG",
                    "noteAr": "في مصر نقول: «أنا ناوي أغير الشغل السنة الجاية، وعايز أبدأ مشروع». في الإسبانية: Pienso cambiar de trabajo el próximo año, y quiero empezar un proyecto."
                }
            ],
            "culturalNoteAr": "في الثقافة الإسبانية، من المعتاد مناقشة الخطط المستقبلية بمرونة وواقعية، واستخدام عبارات مثل «Si todo va bien» (إذا سارت الأمور على ما يرام) مع المشاريع الكبيرة."
        },
        "contentBlocks": [
            {
                "id": f"cb-{slug}-intro",
                "type": "explanation",
                "titleAr": "الخطط والنوايا المستقبلية",
                "bodyAr": "أهم التعبيرات لمناقشة المشاريع:\n- **mañana**: غداً\n- **el año**: السنة / العام\n- **el mes**: الشهر\n- **la intención**: النية / القصد\n- **cambiar**: يغيّر / يبدّل\n- **comenzar**: يبدأ (فعل ذو جذر متغير: e -> ie)",
                "examples": [
                    {"es": "El año que viene pienso comprar un piso.", "ar": "العام القادم أنوي شراء شقة."},
                    {"es": "Tengo la intención de cambiar de carrera.", "ar": "لدي النية لتغيير مساري المهني."},
                    {"es": "Mañana comienzo las clases.", "ar": "غداً أبدأ الحصص."}
                ]
            }
        ],
        "newVocabulary": ["mañana", "año", "mes", "intención", "cambiar", "comenzar"],
        "reviewVocabulary": ["trabajo", "horario"]
    }

    exs = [
        choice_ex(
            "ex-a2-pla-1", "word_choice",
            "اختر التركيب الصحيح للتعبير عن النية بفعل pensar",
            ["grammar"], 1,
            "ما هي الصيغة الصحيحة لقول 'أنوي الانتقال'؟",
            "El mes que viene _____ mudarme a otra ciudad.",
            "الشهر القادم ... الانتقال إلى مدينة أخرى.",
            [
                opt("a", "pienso", "أنوي / أفكر (الصواب)", True),
                opt("b", "pienso en", "خطأ عند وجود فعل مصدر", False, "مع المصدر لا نضع en بل يأتي المصدر مباشرة بعد pensar."),
                opt("c", "pensando", "صيغة اسم الفاعل غير المناسبة هنا", False, "نحتاج إلى فعل مصرف في المضارع يعبر عن النية.")
            ],
            ["mes", "cambiar"],
            "عند التعبير عن النية يلي فعل pensar المصدر مباشرة دون حرف جر: pienso mudarme."
        ),
        fill_ex(
            "ex-a2-pla-2",
            "اكتب الكلمة الدالة على الغد",
            ["vocabulary", "writing"], 1,
            "اكتب ظرف الزمان الإسباني الذي يعني 'غداً'",
            "_____ tenemos una reunión muy importante.",
            "غداً لدينا اجتماع مهم جداً.",
            ["mañana"],
            ["mañana", "manana"],
            "ظرف الزمان الذي يعني غداً هو mañana."
        ),
        choice_ex(
            "ex-a2-pla-3", "word_choice",
            "حدد التعبير المناسب لنية الشخص وتخطيطه",
            ["vocabulary", "reading"], 2,
            "ماذا تسمى العزيمة والنية الداخلية لفعل شيء؟",
            "Tengo la _____ de buscar un trabajo mejor.",
            "لدي ... في البحث عن عمل أفضل.",
            [
                opt("a", "intención", "النية / العزم", True),
                opt("b", "horario", "جدول مواعيد", False, "horario جدول الدوام وليس النية الشخصية."),
                opt("c", "año", "سنة", False, "año سنة زمنية ولا تكمل معنى العزيمة.")
            ],
            ["intención", "trabajo", "horario", "año"],
            "التركيب هو tener la intención de + infinitivo (لديه النية لـ...)."
        ),
        order_ex(
            "ex-a2-pla-4",
            "رتّب الجملة للتعبير عن بدء الدوام الجديد الشهر القادم",
            ["grammar", "writing"], 2,
            ["El", "próximo", "mes", "voy", "a", "cambiar", "de", "horario"],
            "El próximo mes voy a cambiar de horario",
            "الترتيب الصحيح: الظرف الزمني El próximo mes ثم المستقبل voy a ثم المصدر مع حرف الجر cambiar de horario.",
            ["mes", "cambiar", "horario"]
        ),
        choice_ex(
            "ex-a2-pla-5", "listen_choose",
            "استمع وحدد ما سيبدأه المتحدث العام القادم",
            ["listening", "vocabulary"], 2,
            "استمع للتسجيل وحدد خطة المتحدث",
            "El próximo año voy a comenzar un nuevo proyecto.",
            "العام القادم سوف أبدأ مشروعاً جديداً.",
            [
                opt("a", "comenzar", "يبدأ", True),
                opt("b", "cambiar", "يغير", False, "المتحدث قال comenzar (يبدأ) وليس cambiar."),
                opt("c", "trabajo", "عمل", False, "المتحدث ركز على بدء مشروع nuevo proyecto.")
            ],
            ["comenzar", "año", "cambiar", "trabajo"],
            "المتحدث قال: voy a comenzar un nuevo proyecto.",
            audioKey="pending/a2_comenzar_proyecto.mp3",
            speechEs="El próximo año voy a comenzar un nuevo proyecto."
        ),
        speak_ex(
            "ex-a2-pla-6",
            "انطق رغبتك في تغيير العمل مستقبلاً",
            ["speaking", "pronunciation"], 2,
            "أخبر زميلك بأنك تنوي تغيير عملك في المستقبل القريب",
            "Pienso cambiar de trabajo este año.",
            "أنوي تغيير عملي هذا العام.",
            "pending/a2_pienso_cambiar_trabajo.mp3",
            ["pensar", "cambiar", "trabajo", "año"],
            "Pienso cambiar de trabajo este año.",
            "تذكر كسر حرف i في pienso ونطق j في trabajo كـ خاء."
        )
    ]
    return lesson_doc(doc, exs)

def make_lesson_condiciones_futuro():
    slug = "a2-condiciones-futuro"
    doc = {
        "slug": slug,
        "unitSlug": "a2-u3-future-plans",
        "levelCode": "A2",
        "titleAr": "جمل الشرط الواقعية للمستقبل: Si + Presente, Futuro",
        "titleEs": "Oraciones condicionales de futuro: si + presente",
        "subtitleAr": "ربط الشروط المحتملة في الحاضر بالنتائج والخطط المستقبلية",
        "order": 3,
        "estimatedMinutes": 18,
        "cefrLevel": "A2",
        "review": review_block(),
        "pedagogy": {
            "learningObjectivesAr": [
                "أن يصوغ المتعلم جمل الشرط الواقعية: Si + المضارع البسيط، الجواب في المضارع أو المستقبل القريب (ir a + inf).",
                "أن يعبر عن الشروط المتعلقة بالوقت والمال والطقس (Si tengo tiempo, si hace buen tiempo).",
                "أن يوظف مفردات الاحتمال واليقين: seguro, posible, esperar, suerte."
            ],
            "grammarPoints": [
                {
                    "titleAr": "بنية جملة الشرط الواقعية (النوع الأول)",
                    "explanationAr": "عند الحديث عن شرط واقعي ممكن الحدوث في الحاضر أو المستقبل، نستخدم البنية التالية:\n**Si + فعل في المضارع البسيط (Presente)** ، **فعل النتيجة في المستقبل القريب (Ir a + inf) أو المضارع**.\nأمثلة:\n- Si tengo dinero, voy a comprar este coche (إذا توفر معي مال، سأشتري هذه السيارة).\n- Si hace buen tiempo mañana, vamos a ir al parque (إذا كان الجو جميلاً غداً، سنذهب إلى الحديقة).\nتنبيه نحوي حاسم: لا تضع صيغة المستقبل أبداً مباشرة بعد أداة الشرط Si (ممنوع قول *Si voy a tener dinero*)."
                }
            ],
            "commonMistakesAr": [
                "استخدام المستقبل مباشرة بعد Si الشرطية (الصحيح دائماً مضارع بسيط: Si tengo tiempo).",
                "الخلط بين sí (نعم مع علامة نبر) و si (إذا الشرطية بدون علامة نبر)."
            ],
            "dialectNotes": [
                {
                    "region": "EG",
                    "noteAr": "في مصر نقول: «لو الجو حلو بكرة حنخرج / لو معايا فلوس حشتري». في الإسبانية نفس المنطق: Si hace buen tiempo, vamos a salir."
                }
            ],
            "culturalNoteAr": "الإسبان يستخدمون عبارة «¡Mucha suerte!» (حظاً وفيراً!) أو «¡Ojalá!» عند الحديث عن الشروط والتطلعات المستقبلية الإيجابية."
        },
        "contentBlocks": [
            {
                "id": f"cb-{slug}-intro",
                "type": "explanation",
                "titleAr": "الشرط الواقعي للمستقبل",
                "bodyAr": "العناصر الأساسية لتركيب الشرط والنتيجة:\n- **el tiempo**: الوقت أو الطقس\n- **el dinero**: المال / الفلوس\n- **posible**: ممكن / محتمل\n- **seguro**: مؤكد / أكيد\n- **esperar**: ينتظر أو يأمل / يتمنى\n- **la suerte**: الحظ (buena suerte)",
                "examples": [
                    {"es": "Si tengo tiempo libre, voy a descansar.", "ar": "إذا كان لدي وقت فراغ، فسأرتاح."},
                    {"es": "Si apruebo el examen, es seguro que viajo.", "ar": "إذا اجتزت الامتحان، فمن المؤكد أنني سأسافر."},
                    {"es": "Espero tener suerte en la entrevista.", "ar": "آمل أن يحالفني الحظ في المقابلة."}
                ]
            }
        ],
        "newVocabulary": ["tiempo", "dinero", "posible", "seguro", "esperar", "suerte"],
        "reviewVocabulary": ["parque", "viaje"]
    }

    exs = [
        choice_ex(
            "ex-a2-cnd-1", "word_choice",
            "اختر الزمن الصحيح بعد أداة الشرط Si",
            ["grammar"], 1,
            "ما هو الزمن الذي يأتي مباشرة بعد Si في جمل الشرط الواقعية؟",
            "Si _____ buen tiempo mañana, vamos a la playa.",
            "إذا كان الجو جميلاً غداً، سنذهب إلى الشاطئ.",
            [
                opt("a", "hace", "مضارع بسيط (الصواب)", True),
                opt("b", "va a hacer", "مستقبل بعد si (خطأ)", False, "لا يجوز وضع المستقبل مباشرة بعد Si الشرطية في الإسبانية."),
                opt("c", "hizo", "ماضٍ بسيط", False, "الجملة تتحدث عن شرط مستقبلي وليس ماضياً.")
            ],
            ["tiempo"],
            "بعد Si الشرطية نضع دائماً الفعل في زمن المضارع البسيط: Si hace buen tiempo."
        ),
        fill_ex(
            "ex-a2-cnd-2",
            "اكتب الكلمة الإسبانية الدالة على المال",
            ["vocabulary", "writing"], 1,
            "اكتب كلمة 'المال / النقود' بالإسبانية بدقة",
            "Si tengo suficiente _____, voy a hacer un gran viaje.",
            "إذا كان لدي مال كافٍ، فسأقوم برحلة كبيرة.",
            ["dinero"],
            ["dinero"],
            "كلمة dinero تعني المال أو النقود وهي مذكرة."
        ),
        choice_ex(
            "ex-a2-cnd-3", "word_choice",
            "اختر الوصف الدال على التأكد واليقين",
            ["vocabulary", "reading"], 2,
            "إذا كنت متأكداً تماماً من حدوث النتيجة، فماذا تقول؟",
            "Es _____ que el equipo va a ganar el partido.",
            "من ... أن الفريق سيفوز بالمباراة.",
            [
                opt("a", "seguro", "مؤكد / يقيني", True),
                opt("b", "suerte", "حظ (اسم)", False, "suerte اسم ولا يصح وصفاً بعد es مباشرة هنا."),
                opt("c", "dinero", "مال", False, "dinero لا يكمل المعنى الوصفي.")
            ],
            ["seguro", "suerte", "dinero"],
            "تعبير Es seguro que يعني 'من المؤكد أن'."
        ),
        order_ex(
            "ex-a2-cnd-4",
            "رتّب الجملة الشرطية للذهاب إلى الحديقة",
            ["grammar", "writing"], 2,
            ["Si", "tengo", "tiempo", "voy", "al", "parque"],
            "Si tengo tiempo voy al parque",
            "الترتيب السليم: جملة الشرط أولاً Si tengo tiempo ثم جملة الجواب voy al parque.",
            ["tiempo", "parque"]
        ),
        choice_ex(
            "ex-a2-cnd-5", "listen_choose",
            "استمع وحدد أمنية المتحدث",
            ["listening", "vocabulary"], 2,
            "استمع للتسجيل وحدد الكلمة التي يعبر بها المتحدث عن تفاؤله",
            "Espero tener mucha suerte en el examen.",
            "آمل أن يحالفني حظ وافر في الامتحان.",
            [
                opt("a", "esperar", "يأمل / ينتظر", True),
                opt("b", "dinero", "مال", False, "المتحدث تمنى الحظ suerte ولم يذكر المال."),
                opt("c", "tiempo", "وقت", False, "المتحدث تحدث عن الأمل في التوفيق.")
            ],
            ["esperar", "suerte", "dinero", "tiempo"],
            "المتحدث قال: Espero tener mucha suerte.",
            audioKey="pending/a2_espero_suerte.mp3",
            speechEs="Espero tener mucha suerte en el examen."
        ),
        speak_ex(
            "ex-a2-cnd-6",
            "انطق جملة الشرط والنتيجة بطلاقة",
            ["speaking", "pronunciation"], 2,
            "أخبر صديقك بأنك ستسافر معه إذا كان الأمر ممكناً",
            "Si es posible, voy a viajar contigo.",
            "إذا كان ممكناً، فسوف أسافر معك.",
            "pending/a2_si_es_posible.mp3",
            ["posible", "viaje"],
            "Si es posible, voy a viajar contigo.",
            "احرص على خفض الصوت تدريجياً عند فاصلة الشرط: Si es posible, voy a viajar contigo."
        )
    ]
    return lesson_doc(doc, exs)

def make_lesson_conversacion_planes():
    slug = "a2-conversacion-planes"
    doc = {
        "slug": slug,
        "unitSlug": "a2-u3-future-plans",
        "levelCode": "A2",
        "titleAr": "التنسيق مع الأصدقاء: الاتفاق على موعد وخطة مشتركة",
        "titleEs": "Quedar con amigos: planes y citas",
        "subtitleAr": "استخدام الفعل quedar واقتراح الأنشطة وتحديد نقطة اللقاء",
        "order": 4,
        "estimatedMinutes": 18,
        "cefrLevel": "A2",
        "review": review_block(),
        "pedagogy": {
            "learningObjectivesAr": [
                "أن يستخدم المتعلم الفعل quedar للاتفاق على موعد ومكان اللقاء مع الآخرين (¿Quedamos a las siete?).",
                "أن يقترح أنشطة ترفيهية مشتركة ويقبل أو يعتذر عن الدعوة بأدب.",
                "أن يوظف تعبيرات التوافق: juntos, libre, buena idea, no puedo."
            ],
            "grammarPoints": [
                {
                    "titleAr": "استخدامات الفعل Quedar للاتفاق والمواعيد",
                    "explanationAr": "الفعل **quedar** من أكثر الأفعال حيوية في الحياة الاجتماعية الإسبانية، وله عدة معانٍ سياقية دقيقة:\n1. الاتفاق على اللقاء: ¿Dónde quedamos? (أين نتقابل؟) / Quedamos en la plaza (نلتقي في الميدان).\n2. الاتفاق على الوقت: ¿A qué hora quedamos? (في أي ساعة نلتقي؟) / Quedamos a las ocho.\n3. صيغة الاقتراح المشترك في المضارع: ¿Quedamos mañana? (هل نلتقي غداً؟)."
                }
            ],
            "commonMistakesAr": [
                "الخلط بين quedar (يلتقي / يتفق على موعد) و quedarse (يبقى / يمكث في مكان كالمنزل: quedarse en casa).",
                "استخدام حرف الجر a للمكان بدلاً من en مع اللقاء (الصواب: quedamos en la plaza، وليس *quedamos a la plaza*)."
            ],
            "dialectNotes": [
                {
                    "region": "EG",
                    "noteAr": "في مصر نقول: «نتقابل فين وبكرة الساعة كام؟ نتقابل في الميدان سوا». في الإسبانية: ¿Dónde quedamos? Quedamos en la plaza juntos."
                }
            ],
            "culturalNoteAr": "ثقافة «quedar» في إسبانيا مقدسة في نهاية الأسبوع؛ حيث يلتقي الأصدقاء في ميدان عام أو مقهى لتناول «tapas» قبل التوجه إلى أي وجهة أخرى."
        },
        "contentBlocks": [
            {
                "id": f"cb-{slug}-intro",
                "type": "explanation",
                "titleAr": "الاتفاق على اللقاء والخطط",
                "bodyAr": "المفردات المفتاحية للتنسيق الاجتماعي:\n- **quedar**: يتفق على لقاء / يتقابل\n- **libre**: حر / غير مشغول (estar libre)\n- **visitar**: يزور\n- **el amigo / la amiga**: الصديق / الصديقة\n- **juntos**: معاً / سوياً\n- **la cita**: الموعد",
                "examples": [
                    {"es": "¿Estás libre este viernes por la tarde?", "ar": "¿هل أنت متفرغ مساء هذا الجمعة؟"},
                    {"es": "Quedamos en el centro a las seis.", "ar": "نلتقي في وسط المدينة عند السادسة."},
                    {"es": "Vamos a cenar juntos.", "ar": "سوف نتناول العشاء معاً."}
                ]
            }
        ],
        "newVocabulary": ["quedar", "libre", "visitar", "amigo", "juntos", "cita"],
        "reviewVocabulary": ["centro", "plaza"]
    }

    exs = [
        choice_ex(
            "ex-a2-cnv-1", "word_choice",
            "اختر صيغة الاقتراح الشائعة للقاء بين الأصدقاء",
            ["vocabulary"], 1,
            "كيف تقترح على صديقك اللقاء في المساء؟",
            "¿_____ esta tarde para tomar un café?",
            "هل ... بعد ظهر اليوم لتناول القهوة؟",
            [
                opt("a", "Quedamos", "نلتقي / نتفق على موعد (الصواب)", True),
                opt("b", "Quedo", "صيغة المتكلم المفرد فقط", False, "للاقتراح المشترك نستخدم صيغة الجمع نحن: Quedamos."),
                opt("c", "Quedan", "صيغة الغائب الجمع", False, "الخطاب هنا موجه للشخص المقابل للمشاركة معاً.")
            ],
            ["quedar", "amigo"],
            "صيغة ¿Quedamos...? هي الصيغة الإسبانية المعتادة لاقتراح اللقاء."
        ),
        fill_ex(
            "ex-a2-cnv-2",
            "اكتب الكلمة الدالة على التفرغ وعدم الانشغال",
            ["vocabulary", "writing"], 1,
            "اكتب الصفة الإسبانية التي تعني 'متفرغ / غير مشغول'",
            "El sábado por la mañana estoy _____.",
            "صباح السبت أنا متفرغ.",
            ["libre"],
            ["libre"],
            "كلمة libre تعني حراً أو متفرغاً (estar libre)."
        ),
        choice_ex(
            "ex-a2-cnv-3", "word_choice",
            "حدد الكلمة المعبرة عن الذهاب معاً",
            ["vocabulary", "reading"], 2,
            "عندما يقوم شخصان بنشاط في نفس الوقت والمكان، فهما يقومان به:",
            "Vamos a visitar el museo _____.",
            "سنزور المتحف ...",
            [
                opt("a", "juntos", "معاً / سوياً", True),
                opt("b", "cita", "موعد (اسم)", False, "cita اسم ولا يصلح كحال ظرفي يصف المعية."),
                opt("c", "libre", "متفرغ", False, "juntos هي الكلمة المناسبة لـ 'سوياً'.")
            ],
            ["juntos", "visitar", "cita", "libre"],
            "كلمة juntos تعني سوياً أو معاً."
        ),
        order_ex(
            "ex-a2-cnv-4",
            "رتّب الجملة لتحديد نقطة اللقاء في الميدان",
            ["grammar", "writing"], 2,
            ["Quedamos", "en", "la", "plaza", "a", "las", "ocho"],
            "Quedamos en la plaza a las ocho",
            "الترتيب السليم: الفعل Quedamos ثم المكان en la plaza ثم الوقت a las ocho.",
            ["quedar", "plaza"]
        ),
        choice_ex(
            "ex-a2-cnv-5", "listen_choose",
            "استمع وحدد مكان اللقاء المتفق عليه",
            ["listening", "vocabulary"], 2,
            "استمع للمكالمة وحدد أين اتفق الصديقان على المقابلة",
            "Podemos quedar en el centro a las siete.",
            "يمكننا اللقاء في وسط المدينة عند السابعة.",
            [
                opt("a", "centro", "وسط المدينة", True),
                opt("b", "plaza", "ميدان", False, "المتحدث قال en el centro وليس en la plaza."),
                opt("c", "visitar", "يزور", False, "المتحدث ذكر تحديداً موقع اللقاء: el centro.")
            ],
            ["centro", "plaza", "quedar", "visitar"],
            "المتحدث قال: quedar en el centro.",
            audioKey="pending/a2_quedar_centro.mp3",
            speechEs="Podemos quedar en el centro a las siete."
        ),
        speak_ex(
            "ex-a2-cnv-6",
            "انطق موافقتك على الموعد المشترك",
            ["speaking", "pronunciation"], 2,
            "أكد موعدك مع صديقك باللغة الإسبانية بحماس",
            "Muy bien, quedamos allí a las ocho.",
            "حسناً جداً، نلتقي هناك عند الثامنة.",
            "pending/a2_quedamos_alli.mp3",
            ["quedar", "cita"],
            "Muy bien, quedamos allí a las ocho.",
            "انتبه لنطق حرف ll كـ ياء مشبعة في allí."
        )
    ]
    return lesson_doc(doc, exs)

def get_lessons():
    return [
        make_lesson_ir_a(),
        make_lesson_planes_proyectos(),
        make_lesson_condiciones_futuro(),
        make_lesson_conversacion_planes()
    ]
