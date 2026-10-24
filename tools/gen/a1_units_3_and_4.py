# -*- coding: utf-8 -*-
"""Generator for A1 Unit 3 (Numbers & Time) and Unit 4 (Food & Drink).
Creates 8 fully integrated interactive lessons based on Gramática del uso,
Español 2000, and المرشد في اللغة الأسبانية.
"""
import json
import os

OUT = 'content/drafts/a1'

def opt(oid, text, textAr=None, correct=False, why=None):
    o = {"id": oid, "text": text}
    if textAr:
        o["textAr"] = textAr
    o["isCorrect"] = bool(correct)
    if why:
        o["distractorRationaleAr"] = why
    return o

def to_diff_int(d):
    if isinstance(d, int):
        return d
    return {"easy": 1, "medium": 2, "hard": 3}.get(d, 1)

def choice_ex(eid, typ, instructionAr, skills, difficulty, promptAr, stemEs, stemAr, options, targetVocab, explanationAr, audioKey=None, speechEs=None):
    d = {
        "id": eid,
        "type": typ,
        "mode": "graded",
        "instructionAr": instructionAr,
        "skills": skills,
        "difficulty": to_diff_int(difficulty),
        "promptAr": promptAr,
        "stemEs": stemEs,
        "stemAr": stemAr,
        "options": options,
        "targetVocab": targetVocab,
        "explanationAr": explanationAr,
        "scoring": {"mode": "all_or_nothing"}
    }
    if audioKey:
        d["audioKey"] = audioKey
    if speechEs:
        d["speechEs"] = speechEs
    correct = [o["id"] for o in options if o.get("isCorrect")]
    d["answerKey"] = {
        "correctOptionIds": correct,
        "selectedOptionId": correct[0] if correct else ""
    }
    fb = {o["id"]: o["distractorRationaleAr"] for o in options if not o.get("isCorrect") and o.get("distractorRationaleAr")}
    if fb:
        d["errorFeedback"] = fb
    return d

def fill_ex(eid, instructionAr, skills, difficulty, promptAr, stemEs, stemAr, targetVocab, acceptableAnswers, explanationAr):
    return {
        "id": eid,
        "type": "fill_blank",
        "mode": "graded",
        "instructionAr": instructionAr,
        "skills": skills,
        "difficulty": to_diff_int(difficulty),
        "promptAr": promptAr,
        "stemEs": stemEs,
        "stemAr": stemAr,
        "targetVocab": targetVocab,
        "explanationAr": explanationAr,
        "answerKey": {
            "accepted": acceptableAnswers,
            "acceptableAnswers": acceptableAnswers,
            "caseSensitive": False
        },
        "scoring": {"mode": "all_or_nothing"}
    }

def order_ex(eid, instructionAr, skills, difficulty, tokens, accepted_str, explanationAr, targetVocab):
    items = []
    tokenOrder = []
    for i, tok in enumerate(tokens):
        tid = f"{eid}_t{i+1}"
        items.append({"id": tid, "kind": "token", "text": tok})
        tokenOrder.append(tid)
    return {
        "id": eid,
        "type": "word_order",
        "mode": "graded",
        "instructionAr": instructionAr,
        "skills": skills,
        "difficulty": to_diff_int(difficulty),
        "items": items,
        "answerKey": {
            "accepted": [accepted_str],
            "tokenOrder": tokenOrder
        },
        "explanationAr": explanationAr,
        "targetVocab": targetVocab,
        "scoring": {"mode": "all_or_nothing"}
    }

def speak_ex(eid, instructionAr, skills, difficulty, promptAr, stemEs, stemAr, audioKey, targetVocab, modelAnswer, explanationAr):
    return {
        "id": eid,
        "type": "speak_with_text",
        "mode": "graded",
        "instructionAr": instructionAr,
        "skills": skills,
        "difficulty": to_diff_int(difficulty),
        "promptAr": promptAr,
        "stemEs": stemEs,
        "stemAr": stemAr,
        "audioKey": audioKey,
        "targetVocab": targetVocab,
        "explanationAr": explanationAr,
        "answerKey": {
            "referenceAudioKey": audioKey,
            "modelAnswer": modelAnswer
        },
        "scoring": {"mode": "all_or_nothing"}
    }

def lesson_doc(doc, exercises):
    doc["exercises"] = exercises
    return {
        "schemaVersion": "1.0.0",
        "lesson": doc
    }

def review_block():
    return {
        "status": "draft",
        "authors": ["فريق المنهج — تكامل كتب القواعد والمصادر (Gramática del uso, Español 2000, المرشد)"],
        "spanishReviewer": None,
        "translationReviewer": None,
        "reviewedAt": None,
        "notes": "مسودة جاهزة للتدقيق البشري، معتمدة على مصادر القواعد المعتمدة ومصممة للمتعلم العربي."
    }

# ==============================================================================
# UNIT 3: a1-u3-numbers-time
# ==============================================================================

# Lesson 1: a1-numeros-20-100
L_NUM = {
    "slug": "a1-numeros-20-100",
    "titleAr": "الأرقام من 20 إلى 100: تركيب الأعداد والأسعار البسيطة",
    "level": "A1",
    "programSlug": "main-track",
    "unitSlug": "a1-u3-numbers-time",
    "objectiveAr": "أن يقرأ المتعلم ويكتب الأرقام من 20 إلى 100، مع إتقان دمج العشرينيات ككلمة واحدة (veinticinco) وفصل ما بعدها بحرف العطف y (treinta y uno) وفهم الأسعار البسيطة.",
    "estimatedMinutes": 12,
    "skills": ["vocabulary", "listening", "reading", "writing", "speaking"],
    "newVocabulary": ["veinte", "treinta", "cuarenta", "cincuenta", "sesenta", "setenta", "ochenta", "noventa", "cien", "euro"],
    "reviewVocabulary": ["uno", "dos", "tres", "cuatro", "cinco"],
    "targetStructures": [
        "¿Cuánto cuesta? — Cuesta treinta y cinco euros.",
        "Tengo veinticinco euros.",
        "El billete cuesta cuarenta euros."
    ],
    "grammarTopics": ["numeros-cardinales-20-100", "grafia-veinti", "conector-y-numeros"],
    "scenarios": [
        {
            "contextAr": "أحمد في مكتبة بمدريد يسأل البائع عن أسعار الكتب والدفاتر بالأرقام الإسبانية.",
            "settingAr": "مكتبة لبيع الكتب في وسط المدينة",
            "lines": [
                {
                    "es": "Buenos días, ¿cuánto cuesta este libro de español?",
                    "ar": "صباح الخير، كم يبلغ سعر كتاب اللغة الإسبانية هذا؟",
                    "arEg": "صباح الخير، بكام كتاب الإسباني ده؟",
                    "audioKey": "pending/a1-num-sc-1"
                },
                {
                    "es": "Cuesta veinticinco euros.",
                    "ar": "سعره خمسة وعشرون يورو.",
                    "arEg": "سعره خمسة وعشرين يورو.",
                    "audioKey": "pending/a1-num-sc-2"
                },
                {
                    "es": "¿Y ese diccionario grande?",
                    "ar": "وماذا عن ذلك القاموس الكبير؟",
                    "arEg": "وده بكام، القاموس الكبير ده؟",
                    "audioKey": "pending/a1-num-sc-3"
                },
                {
                    "es": "Ese cuesta cuarenta y cinco euros.",
                    "ar": "ذاك سعره خمسة وأربعون يورو.",
                    "arEg": "ده سعره خمسة وأربعين يورو.",
                    "audioKey": "pending/a1-num-sc-4"
                }
            ]
        }
    ],
    "culturalNoteAr": "في إسبانيا والاتحاد الأوروبي العملة الرسمية هي اليورو (euro). تذكر أن الأعداد من 16 إلى 29 تُكتب كلمة واحدة متصلة (مثل: veintidós, veinticinco)، بينما من 31 فصاعداً يُفصل بين العشرات والآحاد بحرف y (مثل: treinta y uno).",
    "pedagogicalRationaleAr": "المتعلم العربي معتاد على تقديم الآحاد على العشرات في لغته (خمسة وعشرون)، بينما في الإسبانية تُذكر العشرات أولاً ثم الآحاد (treinta y cinco). كما يكثر الخلط الإملائي بكتابة 'veinte y uno' بدلاً من الصيغة المدمجة المعيارية 'veintiuno'.",
    "status": "draft",
    "review": review_block()
}

EX_NUM = [
    choice_ex(
        "a1_num_1_listen",
        "listen_choose",
        "استمع إلى السعر وحدد الرقم الصحيح المذكور.",
        ["listening", "vocabulary"],
        "easy",
        "استمع جيداً إلى البائع وهو يذكر سعر الكتاب:",
        "El libro de gramática cuesta treinta y cinco euros.",
        "كتاب القواعد سعره خمسة وثلاثون يورو.",
        [
            opt("a1_num_1_a", "Treinta y cinco euros", "35 يورو", True),
            opt("a1_num_1_b", "Cincuenta y tres euros", "53 يورو", False, "هذا الرقم 53 (cincuenta y tres)، عكست الآحاد والعشرات."),
            opt("a1_num_1_c", "Veinticinco euros", "25 يورو", False, "هذا الرقم 25 (veinticinco)، والمطلوب 35.")
        ],
        ["treinta", "cinco", "euro"],
        "نطق البائع treinta y cinco euros أي 35 يورو. لاحظ تقديم العشرات على الآحاد.",
        audioKey="pending/a1-num-ex-1",
        speechEs="El libro de gramática cuesta treinta y cinco euros."
    ),
    choice_ex(
        "a1_num_2_orthography",
        "word_choice",
        "اختر الإملاء الإسباني الصحيح للرقم 24.",
        ["grammar", "writing"],
        "medium",
        "أي من الخيارات التالية يمثل الكتابة المعيارية للرقم 24 في الإسبانية؟",
        "En mi clase hay ____ estudiantes.",
        "في صفي يوجد ____ طالباً.",
        [
            opt("a1_num_2_a", "veinticuatro", "أربعة وعشرون (متصلة)", True),
            opt("a1_num_2_b", "veinte y cuatro", "عشرون وأربعة (منفصلة)", False, "خطأ شائع: الأرقام في العشرينيات تُدمج في كلمة واحدة مبدوءة بـ veinti-."),
            opt("a1_num_2_c", "cuarenta y dos", "اثنان وأربعون", False, "هذا يعني 42، وليس 24.")
        ],
        ["veinte", "cuatro"],
        "الأعداد من 21 إلى 29 تُكتب ككلمة واحدة متصلة تبدأ بـ veinti-، مثل veinticuatro."
    ),
    fill_ex(
        "a1_num_3_fill",
        "اكتب كلمة العشرات الناقصة لإكمال الرقم 40 بالحروف.",
        ["writing", "vocabulary"],
        "medium",
        "أكمل الجملة بكتابة الرقم 40 بالإسبانية (cuarenta):",
        "El diccionario cuesta ____ euros.",
        "القاموس يكلف ____ يورو.",
        ["cuarenta", "euro"],
        ["cuarenta"],
        "العدد 40 يُكتب بالإسبانية: cuarenta بحرف c في البداية."
    ),
    order_ex(
        "a1_num_4_order",
        "رتّب الكلمات لتكوين جملة تخبر فيها عن سعر تذكرة السفر.",
        ["grammar", "reading"],
        "medium",
        ["El", "billete", "cuesta", "cincuenta", "euros."],
        "El billete cuesta cincuenta euros.",
        "الترتيب المعياري: الفاعل El billete + الفعل cuesta + العدد cincuenta + التمييز euros.",
        ["cincuenta", "euro"]
    ),
    choice_ex(
        "a1_num_5_diff",
        "word_choice",
        "اختر الرقم الإسباني المقابل للعدد 80.",
        ["vocabulary"],
        "easy",
        "ما هو اللفظ الإسباني للرقم ثمانون (80)؟",
        "Mi abuelo tiene ____ años.",
        "جدي يبلغ من العمر ____ عاماً.",
        [
            opt("a1_num_5_a", "ochenta", "ثمانون", True),
            opt("a1_num_5_b", "setenta", "سبعون", False, "setenta تعني 70."),
            opt("a1_num_5_c", "sesenta", "ستون", False, "sesenta تعني 60.")
        ],
        ["ochenta", "setenta", "sesenta"],
        "العدد 80 هو ochenta مشتق من ocho (ثمانية)."
    ),
    speak_ex(
        "a1_num_6_speak",
        "انطق جملة السعر بصوت واضح.",
        ["speaking"],
        "medium",
        "اقرأ الجملة التالية بصوت واضح للإخبار بأن السعر هو مئة يورو:",
        "Cuesta cien euros en total.",
        "السعر مئة يورو في المجموع.",
        "pending/a1-num-ex-6",
        ["cien", "euro"],
        "Cuesta cien euros en total.",
        "تأكد من نطق c في cien كحرف ثاء خفيف في النطق القشتالي الإسباني."
    )
]

# Lesson 2: a1-la-hora
L_HORA = {
    "slug": "a1-la-hora",
    "titleAr": "الساعة والوقت: السؤال عن الوقت والإخبار به",
    "level": "A1",
    "programSlug": "main-track",
    "unitSlug": "a1-u3-numbers-time",
    "objectiveAr": "أن يسأل المتعلم عن الوقت باستخدام ¿Qué hora es? ويخبر به بدقة مستخدماً Es la una و Son las dos... مع الكسور (y cuarto, y media, menos cuarto).",
    "estimatedMinutes": 12,
    "skills": ["speaking", "listening", "grammar", "vocabulary", "reading"],
    "newVocabulary": ["hora", "tiempo", "minuto", "tarde", "mañana", "noche"],
    "reviewVocabulary": ["uno", "dos", "tres", "cuatro", "cinco"],
    "targetStructures": [
        "¿Qué hora es? — Es la una en punto.",
        "Son las tres y media.",
        "Son las cinco menos cuarto."
    ],
    "grammarTopics": ["la-hora-ser", "es-la-una-vs-son-las", "expresiones-cuarto-media"],
    "scenarios": [
        {
            "contextAr": "عمر يسأل زميلته الإسبانية صوفيا في محطة المترو عن الوقت لكي لا يفوته موعد القطار.",
            "settingAr": "رصيف محطة المترو في مدريد",
            "lines": [
                {
                    "es": "Perdona, Sofía, ¿tienes hora? ¿Qué hora es?",
                    "ar": "معذرة يا صوفيا، كم الساعة الآن؟",
                    "arEg": "لو سمحتي يا صوفيا، الساعة كام دلوقتي؟",
                    "audioKey": "pending/a1-hor-sc-1"
                },
                {
                    "es": "Sí, mira, son las tres y cuarto.",
                    "ar": "نعم، انظر، إنها الثالثة والربع.",
                    "arEg": "أيوه، بص، الساعة تلاتة وربع.",
                    "audioKey": "pending/a1-hor-sc-2"
                },
                {
                    "es": "¡Perfecto! Nuestro tren sale a las tres y media.",
                    "ar": "ممتاز! قطارنا يغادر في الثالثة والنصف.",
                    "arEg": "تمام جداً! القطر بتاعنا هيطلع تلاتة ونص.",
                    "audioKey": "pending/a1-hor-sc-3"
                },
                {
                    "es": "Tenemos quince minutos todavía.",
                    "ar": "ما زال لدينا خمس عشرة دقيقة.",
                    "arEg": "معانا لسه ربع ساعة.",
                    "audioKey": "pending/a1-hor-sc-4"
                }
            ]
        }
    ],
    "culturalNoteAr": "في الثقافة الإسبانية، يُستخدم 'Es la una' فقط مع الساعة الواحدة لأنها مفرد مؤنث (la una)، بينما يُستخدم 'Son las...' مع جميع الساعات الأخرى (Son las dos, Son las tres...). كما يُستخدم 'menos cuarto' للتعبير عن 'إلا ربع'.",
    "pedagogicalRationaleAr": "يقع المتعلم العربي كثيراً في خطأ استخدام 'Son' مع الساعة الواحدة (مثل *Son la una)، أو نسيان أداة التعريف (مثل *Son dos). القاعدة الصارمة: الساعة 1 مفرد (Es la una)، ومن 2 فصاعداً جمع (Son las...).",
    "status": "draft",
    "review": review_block()
}

EX_HORA = [
    choice_ex(
        "a1_hor_1_listen",
        "listen_choose",
        "استمع إلى المحادثة وحدد التوقيت المذكور.",
        ["listening", "vocabulary"],
        "easy",
        "استمع جيداً للإخبار عن الوقت:",
        "Ahora mismo son las tres y media.",
        "في الوقت الحالي الساعة الثالثة والنصف.",
        [
            opt("a1_hor_1_a", "Son las tres y media", "الثالثة والنصف (03:30)", True),
            opt("a1_hor_1_b", "Son las tres y cuarto", "الثالثة والربع (03:15)", False, "هذا التوقيت هو y cuarto (والربع)، بينما الصوت قال y media (والنصف)."),
            opt("a1_hor_1_c", "Son las dos y media", "الثانية والنصف (02:30)", False, "الصوت ذكر las tres (الثالثة)، وليس las dos.")
        ],
        ["hora", "tres"],
        "التعبير son las tres y media يعني الثالثة والنصف بدقة.",
        audioKey="pending/a1-hor-ex-1",
        speechEs="Ahora mismo son las tres y media."
    ),
    choice_ex(
        "a1_hor_2_verb_ser",
        "word_choice",
        "اختر صيغة الفعل المناسبة للساعة الواحدة تماماً.",
        ["grammar"],
        "medium",
        "كيف نقول بالإسبانية: «إنها الساعة الواحدة تماماً»؟",
        "____ la una en punto.",
        "____ الواحدة تماماً.",
        [
            opt("a1_hor_2_a", "Es", "إنها (للمفرد)", True),
            opt("a1_hor_2_b", "Son", "إنها (للجمع)", False, "خطأ: الساعة الواحدة مفرد وتأخذ Es la una، بينما Son تُستخدم من الساعة الثانية فصاعداً."),
            opt("a1_hor_2_c", "Está", "يوجد/يكون للمكان", False, "الفعل estar لا يُستخدم للإخبار عن الوقت إطلاقاً.")
        ],
        ["hora", "uno"],
        "الساعة الواحدة مفرد وتأخذ صيغة المفرد Es la una، أما بقية الساعات فتأخذ صيغة الجمع Son las..."
    ),
    fill_ex(
        "a1_hor_3_fill",
        "أكمل سؤال الساعة بالكلمة الصحيحة.",
        ["writing", "grammar"],
        "easy",
        "اكتب الكلمة الناقصة للسؤال عن الوقت: «كم الساعة؟»",
        "¿Qué ____ es, por favor?",
        "كم ____ الآن من فضلك؟",
        ["hora", "tiempo"],
        ["hora"],
        "السؤال القياسي عن الوقت في الإسبانية هو دائماً: ¿Qué hora es?"
    ),
    order_ex(
        "a1_hor_4_order",
        "رتّب الكلمات لقول: «إنها الرابعة إلا ربعاً».",
        ["grammar", "reading"],
        "medium",
        ["Son", "las", "cuatro", "menos", "cuarto."],
        "Son las cuatro menos cuarto.",
        "التركيب المعياري للوقت: الفعل الجمع Son + الأداة las + العدد cuatro + صيغة الاستثناء menos cuarto.",
        ["cuatro", "hora"]
    ),
    choice_ex(
        "a1_hor_5_period",
        "word_choice",
        "اختر الفترة الزمنية المناسبة لوقت الظهيرة وما بعدها.",
        ["vocabulary"],
        "easy",
        "عندما تكون الساعة الخامسة عصراً، نقول: Son las cinco de la...",
        "Son las cinco de la ____.",
        "إنها الخامسة من بعد الـ____.",
        [
            opt("a1_hor_5_a", "tarde", "الظهيرة / العصر", True),
            opt("a1_hor_5_b", "mañana", "الصباح", False, "mañana تعني الصباح الباكر وقبل الظهر."),
            opt("a1_hor_5_c", "noche", "الليل", False, "noche تعني الليل بعد غروب الشمس.")
        ],
        ["tarde", "mañana", "noche"],
        "فترة الظهيرة والمساء حتى غروب الشمس يُطلق عليها بالإسبانية: la tarde."
    ),
    speak_ex(
        "a1_hor_6_speak",
        "انطق الإخبار بالساعة بنطق واضح.",
        ["speaking"],
        "medium",
        "اقرأ الجملة بصوت مسموع وواضح للإخبار بأن الساعة هي الثانية والربع:",
        "Son las dos y cuarto de la tarde.",
        "إنها الثانية والربع بعد الظهر.",
        "pending/a1-hor-ex-6",
        ["dos", "tarde"],
        "Son las dos y cuarto de la tarde.",
        "انتبه لنطق حرف d في dos وربط الكلمات بسلاسة: Son las dos y cuarto."
    )
]

# Lesson 3: a1-dias-meses
L_DIAS = {
    "slug": "a1-dias-meses",
    "titleAr": "أيام الأسبوع والشهور: المذكر والتكرار وتحديد التواريخ",
    "level": "A1",
    "programSlug": "main-track",
    "unitSlug": "a1-u3-numbers-time",
    "objectiveAr": "أن يذكر المتعلم أيام الأسبوع والشهور، ويستخدم أداة التعريف المذكرة el/los للتعبير عن المواعيد والتكرار وحرف الجر en مع الشهور بدقة.",
    "estimatedMinutes": 12,
    "skills": ["vocabulary", "grammar", "reading", "listening", "speaking"],
    "newVocabulary": ["lunes", "martes", "miércoles", "jueves", "viernes", "sábado", "domingo", "mes", "día", "año"],
    "reviewVocabulary": ["uno", "dos", "tres"],
    "targetStructures": [
        "El lunes tengo clase de español.",
        "Los domingos descanso en casa.",
        "Mi examen es en junio."
    ],
    "grammarTopics": ["dias-semana-genero", "articulo-el-los-dias", "preposicion-en-meses"],
    "scenarios": [
        {
            "contextAr": "فاطمة ترتّب جدول دراستها الأسبوعي مع صديقتها الإسبانية كارمن في الجامعة.",
            "settingAr": "مكتبة الجامعة في غرناطة",
            "lines": [
                {
                    "es": "¿Qué días tienes clase de español, Fátima?",
                    "ar": "في أي الأيام لديك حصة اللغة الإسبانية يا فاطمة؟",
                    "arEg": "عندك كورس إسباني في أيام إيه يا فاطمة؟",
                    "audioKey": "pending/a1-dia-sc-1"
                },
                {
                    "es": "Tengo clase los lunes y los miércoles por la tarde.",
                    "ar": "لدي حصة يومي الاثنين والأربعاء بعد الظهر.",
                    "arEg": "عندي كورس كل إتنين وأربع بعد الضهر.",
                    "audioKey": "pending/a1-dia-sc-2"
                },
                {
                    "es": "¿Y qué haces los fines de semana?",
                    "ar": "وماذا تفعلين في عطلات نهاية الأسبوع؟",
                    "arEg": "وبتعملي إيه في الويك إند؟",
                    "audioKey": "pending/a1-dia-sc-3"
                },
                {
                    "es": "El sábado salgo con amigos y el domingo descanso.",
                    "ar": "يوم السبت أخرج مع الأصدقاء، ويوم الأحد أستريح.",
                    "arEg": "السبت بخرج مع أصحابي والحد برتاح.",
                    "audioKey": "pending/a1-dia-sc-4"
                }
            ]
        }
    ],
    "culturalNoteAr": "أيام الأسبوع في اللغة الإسبانية كلها مذكرة وتبدأ بحرف صغير (minúscula) في السياق العادي ما لم تكن في أول الجملة. والأهم أننا لا نستخدم حرف الجر 'في' مع الأيام، بل نستخدم أداة التعريف مباشرة: 'El lunes' تعني 'يوم الاثنين'.",
    "pedagogicalRationaleAr": "من الأخطاء الكلاسيكية للناطق بالعربية والإنجليزية قول *En lunes (In Monday / في الاثنين). في الإسبانية يُقال حصراً: El lunes. كما أن الجمع للتكرار يكون بتغيير الأداة فقط: Los lunes / Los martes لأن الكلمة تنتهي بحرف s أصلاً.",
    "status": "draft",
    "review": review_block()
}

EX_DIAS = [
    choice_ex(
        "a1_dia_1_listen",
        "listen_choose",
        "استمع وحدد اليوم الذي تقام فيه الحصة.",
        ["listening", "vocabulary"],
        "easy",
        "استمع جيداً إلى فاطمة وهي تذكر يوم حصتها:",
        "Tengo clase de conversación el viernes.",
        "لدي حصة محادثة يوم الجمعة.",
        [
            opt("a1_dia_1_a", "El viernes", "يوم الجمعة", True),
            opt("a1_dia_1_b", "El jueves", "يوم الخميس", False, "el jueves تعني الخميس، والمذكور هو الجمعة."),
            opt("a1_dia_1_c", "El martes", "يوم الثلاثاء", False, "el martes تعني الثلاثاء.")
        ],
        ["viernes", "día"],
        "الصوت ذكر بوضوح el viernes أي يوم الجمعة.",
        audioKey="pending/a1-dia-ex-1",
        speechEs="Tengo clase de conversación el viernes."
    ),
    choice_ex(
        "a1_dia_2_article",
        "word_choice",
        "اختر الأداة الصحيحة للدلالة على يوم السبت القادم.",
        ["grammar"],
        "medium",
        "كيف نقول: «يوم السبت أذهب إلى المركز الثقافي»؟",
        "____ sábado voy al centro cultural.",
        "____ السبت أذهب إلى المركز الثقافي.",
        [
            opt("a1_dia_2_a", "El", "أداة التعريف للمذكر المفرد", True),
            opt("a1_dia_2_b", "En", "حرف الجر 'في'", False, "خطأ متكرر: لا نستخدم حرف الجر En مع أيام الأسبوع، بل أداة التعريف El."),
            opt("a1_dia_2_c", "La", "أداة التعريف للمؤنث", False, "أيام الأسبوع كلها مذكرة في الإسبانية ولا تأخذ La أبداً.")
        ],
        ["sábado", "día"],
        "أيام الأسبوع مذكرة وتأخذ أداة التعريف El للدلالة على الموعد، ولا يُستخدم معها حرف الجر En."
    ),
    fill_ex(
        "a1_dia_3_fill",
        "أكمل اسم اليوم الأول في أسبوع العمل بإسبانيا.",
        ["writing", "vocabulary"],
        "easy",
        "اكتب اسم يوم «الاثنين» بالإسبانية في الفراغ:",
        "El primer día de trabajo es el ____.",
        "أول يوم عمل في الأسبوع هو يوم الـ____.",
        ["lunes", "día"],
        ["lunes"],
        "يوم الاثنين في الإسبانية هو el lunes وهو اليوم الأول في أسبوع العمل الأوروبي."
    ),
    order_ex(
        "a1_dia_4_order",
        "رتّب الجملة لبيان تكرار النشاط كل يوم أحد.",
        ["grammar", "reading"],
        "medium",
        ["Los", "domingos", "descanso", "en", "casa."],
        "Los domingos descanso en casa.",
        "الترتيب: أداة الجمع مع اليوم Los domingos + الفعل descanso + شبه الجملة en casa.",
        ["domingo", "día"]
    ),
    choice_ex(
        "a1_dia_5_plural",
        "word_choice",
        "كيف نعبّر عن تكرار النشاط كل يوم ثلاثاء؟",
        ["grammar"],
        "medium",
        "للتعبير عن أن الحدث يتكرر كل ثلاثاء، نستخدم:",
        "Tengo reunión todos ____.",
        "لدي اجتماع كل ____.",
        [
            opt("a1_dia_5_a", "los martes", "أيام الثلاثاء (جمع الأداة)", True),
            opt("a1_dia_5_b", "los marteses", "جمع خاطئ بزيادة es", False, "الكلمات المنتهية بـ s في المفرد لا يتغير رسمها في الجمع، بل تتغير الأداة فقط (los martes)."),
            opt("a1_dia_5_c", "en martes", "في الثلاثاء", False, "لا يُستخدم حرف الجر En مع الأيام.")
        ],
        ["martes", "día"],
        "أيام الأسبوع المنتهية بحرف s في المفرد تُجمع فقط بتغيير أداة التعريف: el martes تصبح los martes."
    ),
    speak_ex(
        "a1_dia_6_speak",
        "انطق الجملة موضحاً اليوم والنشاط بنطق واضح.",
        ["speaking"],
        "medium",
        "اقرأ الجملة بصوت واضح:",
        "El miércoles tengo una cita importante.",
        "يوم الأربعاء لدي موعد هام.",
        "pending/a1-dia-ex-6",
        ["miércoles", "día"],
        "El miércoles tengo una cita importante.",
        "ركز على نطق النبرة في miér-coles وحرف c المرقق."
    )
]

# Lesson 4: a1-cita
L_CITA = {
    "slug": "a1-cita",
    "titleAr": "تحديد موعد: الاتفاق والتأكيد والمكان",
    "level": "A1",
    "programSlug": "main-track",
    "unitSlug": "a1-u3-numbers-time",
    "objectiveAr": "أن يتفق المتعلم على موعد مع صديق أو زميل مستخدماً ¿A qué hora quedamos? والرد بـ A las... مع استعمال حرف الجر a مع ساعات المواعيد.",
    "estimatedMinutes": 12,
    "skills": ["speaking", "listening", "reading", "writing", "grammar"],
    "newVocabulary": ["hora", "tiempo", "tarde", "mañana", "lunes", "viernes"],
    "reviewVocabulary": ["amigo", "casa", "tres", "dos"],
    "targetStructures": [
        "¿A qué hora quedamos? — Quedamos a las seis.",
        "¿Te viene bien el viernes por la tarde?",
        "De acuerdo, nos vemos allí."
    ],
    "grammarTopics": ["preposicion-a-horas", "verbo-quedar", "confirmar-cita"],
    "scenarios": [
        {
            "contextAr": "يوسف يتفق مع زميله مانويل على موعد للقاء في وسط المدينة لمراجعة مشروع دراسي.",
            "settingAr": "محادثة هاتفية بين زميلين",
            "lines": [
                {
                    "es": "Hola, Manuel, ¿quedamos mañana para estudiar?",
                    "ar": "مرحباً مانويل، هل نلتقي غداً للدراسة؟",
                    "arEg": "أهلاً يا مانويل، نتقابل بكرة عشان نذاكر؟",
                    "audioKey": "pending/a1-cit-sc-1"
                },
                {
                    "es": "Sí, buena idea. ¿A qué hora quedamos?",
                    "ar": "نعم، فكرة جيدة. في أي ساعة نلتقي؟",
                    "arEg": "أيوه فكرة حلوة، هنتقابل الساعة كام؟",
                    "audioKey": "pending/a1-cit-sc-2"
                },
                {
                    "es": "¿Te viene bien a las cinco de la tarde?",
                    "ar": "هل يناسبك في الخامسة مساءً؟",
                    "arEg": "يناسبك الساعة خمسة بعد الظهر؟",
                    "audioKey": "pending/a1-cit-sc-3"
                },
                {
                    "es": "Perfecto, quedamos a las cinco en la cafetería central.",
                    "ar": "ممتاز، نلتقي في الخامسة في المقهى المركزي.",
                    "arEg": "تمام، نتقابل الساعة خمسة في الكافيه المركزي.",
                    "audioKey": "pending/a1-cit-sc-4"
                }
            ]
        }
    ],
    "culturalNoteAr": "الفعل 'quedar' من أهم الأفعال اليومية في إسبانيا ويعني 'الاتفاق على موعد أو لقاء'. وعند تحديد ساعة اللقاء يجب دائماً وضع حرف الجر 'a' (مثل: Quedamos a las seis)، وحذفه خطأ لغوي جسيم.",
    "pedagogicalRationaleAr": "الفارق الجوهري بين السؤال عن التوقيت الحالي ¿Qué hora es? (والإجابة بـ Son las tres) وبين تحديد موعد ¿A qué hora quedamos? (والإجابة بـ A las tres). المتعلم العربي قد يخلط بينهما ويحذف حرف الجر 'a'.",
    "status": "draft",
    "review": review_block()
}

EX_CITA = [
    choice_ex(
        "a1_cit_1_listen",
        "listen_choose",
        "استمع للمكالمة وحدد ساعة الموعد المتفق عليها.",
        ["listening", "speaking"],
        "easy",
        "استمع جيداً لتأكيد الموعد بين الصديقين:",
        "Entonces quedamos el viernes a las seis de la tarde.",
        "إذن نلتقي يوم الجمعة في السادسة مساءً.",
        [
            opt("a1_cit_1_a", "A las seis de la tarde", "في السادسة مساءً (18:00)", True),
            opt("a1_cit_1_b", "A las cinco de la tarde", "في الخامسة مساءً (17:00)", False, "الصوت حدد السادسة (a las seis)، وليس الخامسة."),
            opt("a1_cit_1_c", "A las ocho de la tarde", "في الثامنة مساءً (20:00)", False, "لم يُذكر موعد الثامنة في الصوت.")
        ],
        ["viernes", "tarde", "hora"],
        "الصوت أكد الموعد بقوله: a las seis de la tarde أي في السادسة مساءً.",
        audioKey="pending/a1-cit-ex-1",
        speechEs="Entonces quedamos el viernes a las seis de la tarde."
    ),
    choice_ex(
        "a1_cit_2_prep_a",
        "word_choice",
        "اختر حرف الجر الإجباري عند تحديد ساعة الموعد.",
        ["grammar"],
        "medium",
        "كيف نقول: «نلتقي في تمام الساعة الثالثة»؟",
        "Quedamos ____ las tres en la plaza.",
        "نلتقي ____ الثالثة في الساحة.",
        [
            opt("a1_cit_2_a", "a", "حرف الجر 'في تمام'", True),
            opt("a1_cit_2_b", "en", "حرف الجر 'في المكان'", False, "خطأ عربي شائع: en لا تُستخدم مع ساعات المواعيد، بل a las..."),
            opt("a1_cit_2_c", "de", "حرف الجر 'من / عن'", False, "حرف الجر de يُستخدم للفترة (de la tarde) وليس للساعة المحددة للقاء.")
        ],
        ["tres", "hora"],
        "مع المواعيد نستخدم دائماً حرف الجر a: Quedamos a las tres."
    ),
    fill_ex(
        "a1_cit_3_fill",
        "أكمل كلمة الفترة الزمنية المسائية.",
        ["writing", "vocabulary"],
        "medium",
        "أكمل الجملة بالكلمة المناسبة: «نلتقي غداً بعد الظهر»:",
        "Nos vemos mañana por la ____.",
        "نلتقي غداً بعد الـ____.",
        ["tarde", "mañana"],
        ["tarde"],
        "الفترة المسائية بعد الظهر يُعبّر عنها بـ por la tarde."
    ),
    order_ex(
        "a1_cit_4_order",
        "رتّب الكلمات لتكوين سؤال السؤال عن موعد اللقاء.",
        ["grammar", "speaking"],
        "medium",
        ["¿A", "qué", "hora", "quedamos", "mañana?"],
        "¿A qué hora quedamos mañana?",
        "تركيب السؤال عن موعد اللقاء: حرف الجر ¿A + أداة الاستفهام qué + كلمة hora + الفعل quedamos + الظرف mañana?",
        ["hora", "mañana"]
    ),
    choice_ex(
        "a1_cit_5_confirm",
        "word_choice",
        "اختر العبارة الملائمة للموافقة على الموعد المقترح.",
        ["vocabulary", "speaking"],
        "easy",
        "عندما يقترح صديقك موعداً مناسباً، كيف تجيبه بالموافقة؟",
        "— ¿A las cinco? — Sí, ____, me viene perfecto.",
        "— في الخامسة؟ — نعم، ____، هذا يناسبني تماماً.",
        [
            opt("a1_cit_5_a", "de acuerdo", "موافق / حسناً", True),
            opt("a1_cit_5_b", "hasta luego", "إلى اللقاء لاحقاً", False, "هذه عبارة توديع وليست قبولاً للموعد."),
            opt("a1_cit_5_c", "lo siento", "أنا آسف", False, "هذه عبارة اعتذار ورفض.")
        ],
        ["tiempo", "hora"],
        "عبارة De acuerdo هي التعبير الشائع في الإسبانية لقبول الموعد وتأكيده."
    ),
    speak_ex(
        "a1_cit_6_speak",
        "انطق جملة الاتفاق على الموعد بثقة.",
        ["speaking"],
        "medium",
        "اقرأ الجملة بصوت واضح ومسموع:",
        "Quedamos el viernes a las cuatro de la tarde.",
        "نلتقي يوم الجمعة في الرابعة بعد الظهر.",
        "pending/a1-cit-ex-6",
        ["viernes", "tarde", "hora"],
        "Quedamos el viernes a las cuatro de la tarde.",
        "انتبه لنطق حرف d في quedamos ونطق cu-a-tro دون إسقاط حرف u."
    )
]

# ==============================================================================
# UNIT 4: a1-u4-food-drink
# ==============================================================================

# Lesson 1: a1-vocabulario-comida
L_COM = {
    "slug": "a1-vocabulario-comida",
    "titleAr": "مفردات الطعام والشراب: تصنيف المأكولات والمشروبات الأساسية",
    "level": "A1",
    "programSlug": "main-track",
    "unitSlug": "a1-u4-food-drink",
    "objectiveAr": "أن يتعرّف المتعلم على أسماء الأطعمة والمشروبات الأساسية في الحياة اليومية مع أداة التعريف المناسبة ومراعاة جنس الكلمة (el pan, el agua, la leche...).",
    "estimatedMinutes": 12,
    "skills": ["vocabulary", "reading", "listening", "speaking", "grammar"],
    "newVocabulary": ["comida", "agua", "pan", "café", "leche", "té", "carne", "pescado", "pollo", "arroz"],
    "reviewVocabulary": ["casa", "bueno"],
    "targetStructures": [
        "Para desayunar tomo pan con café y leche.",
        "En el almuerzo hay arroz con pollo o pescado.",
        "Bebo un vaso de agua fresca."
    ],
    "grammarTopics": ["genero-sustantivos-comida", "el-agua-femenino", "articulos-comida"],
    "scenarios": [
        {
            "contextAr": "ياسمين تذهب إلى سوق الخضار والمواد الغذائية (el mercado) في برشلونة لشراء مؤونة الأسبوع.",
            "settingAr": "سوق حي غراسيّا في برشلونة",
            "lines": [
                {
                    "es": "Hola, buenos días. Necesito pan fresco, arroz y leche.",
                    "ar": "مرحباً، صباح الخير. أحتاج خبزاً طازجاً وأرزاً وحليباً.",
                    "arEg": "صباح الخير، محتاجة عيش طازة ورز ولبن.",
                    "audioKey": "pending/a1-com-sc-1"
                },
                {
                    "es": "Muy bien. ¿Desea también algo de carne o pescado?",
                    "ar": "ممتاز. هل ترغبين أيضاً في بعض اللحم أو السمك؟",
                    "arEg": "تمام. تحبي كمان لحمة ولا سمك؟",
                    "audioKey": "pending/a1-com-sc-2"
                },
                {
                    "es": "Sí, un kilo de pollo y una botella de agua mineral, por favor.",
                    "ar": "نعم، كيلو من الدجاج وقنينة ماء معدني، من فضلك.",
                    "arEg": "أيوه، كيلو فراخ وإزازة مية معدنية لو سمحت.",
                    "audioKey": "pending/a1-com-sc-3"
                },
                {
                    "es": "Perfecto, aquí tiene todo.",
                    "ar": "ممتاز، ها هي جميع طلباتك.",
                    "arEg": "تمام، اتفضلي كل طلباتك اهيه.",
                    "audioKey": "pending/a1-com-sc-4"
                }
            ]
        }
    ],
    "culturalNoteAr": "كلمة 'agua' مؤنثة في الأصل، لكنها تأخذ أداة التعريف المذكرة 'el' في المفرد (el agua) لتفادي التقاء نبرتي فتح متتاليتين (el agua وليس *la agua)، ولكن عند وصفها بصفة تعود إلى التأنيث: 'el agua fría'.",
    "pedagogicalRationaleAr": "قاعدة 'el agua' تسبب حيرة دائمة للمتعلمين. من الضروري توضيح أن الأداة مذكرة فقط لمنع الثقل الصوتي، بينما الكلمة والصفات التابعة لها مؤنثة بالكامل.",
    "status": "draft",
    "review": review_block()
}

EX_COM = [
    choice_ex(
        "a1_com_1_listen",
        "listen_choose",
        "استمع للمكونات وحدد الطبق المطلوب.",
        ["listening", "vocabulary"],
        "easy",
        "استمع جيداً للطبق الإسباني المذكور:",
        "Hoy tenemos un plato tradicional de arroz con pollo.",
        "اليوم لدينا طبق تقليدي من الأرز مع الدجاج.",
        [
            opt("a1_com_1_a", "Arroz con pollo", "أرز مع دجاج", True),
            opt("a1_com_1_b", "Arroz con pescado", "أرز مع سمك", False, "الصوت ذكر pollo (دجاج)، وليس pescado (سمك)."),
            opt("a1_com_1_c", "Pan con carne", "خبز مع لحم", False, "الصوت ذكر arroz (أرز)، وليس pan.")
        ],
        ["arroz", "pollo", "comida"],
        "الطبق المذكور في الصوت هو arroz con pollo (أرز بالدجاج).",
        audioKey="pending/a1-com-ex-1",
        speechEs="Hoy tenemos un plato tradicional de arroz con pollo."
    ),
    choice_ex(
        "a1_com_2_gender_agua",
        "word_choice",
        "اختر الأداة الصحيحة لكلمة agua في المفرد.",
        ["grammar"],
        "medium",
        "ما هي أداة التعريف المناسبة لكلمة agua المفردة؟",
        "Bebo un vaso de ____ agua.",
        "أشرب كوباً من الـ____ ماء.",
        [
            opt("a1_com_2_a", "el", "أداة التعريف el لتفادي الثقل الصوتي", True),
            opt("a1_com_2_b", "la", "أداة التعريف la", False, "خطأ: رغم أن كلمة agua مؤنثة، إلا أنها تبدأ بـ a منبورة فتأخذ el في المفرد منعاً للثقل."),
            opt("a1_com_2_c", "los", "أداة الجمع المذكر", False, "الكلمة هنا مفردة وليست جمعاً.")
        ],
        ["agua"],
        "كلمة agua مؤنثة ولكنها تأخذ أداة التعريف el في المفرد منعاً لالتقاء النبرتين: el agua."
    ),
    fill_ex(
        "a1_com_3_fill",
        "اكتب كلمة الخبز بالإسبانية لإكمال وجبة الإفطار.",
        ["writing", "vocabulary"],
        "easy",
        "اكتب كلمة «خبز» (pan) بالإسبانية في الفراغ:",
        "Por las mañanas como ____ con aceite de oliva.",
        "في الصباح آكل ____ مع زيت الزيتون.",
        ["pan", "comida"],
        ["pan"],
        "كلمة خبز في الإسبانية هي: pan وهي اسم مذكر (el pan)."
    ),
    order_ex(
        "a1_com_4_order",
        "رتّب الكلمات لقول: «في وجبة الغداء نأكل لحماً وأرزاً».",
        ["grammar", "reading"],
        "medium",
        ["En", "la", "comida", "comemos", "carne", "y", "arroz."],
        "En la comida comemos carne y arroz.",
        "الترتيب: شبه الجملة الظرفية En la comida + الفعل comemos + المفعول الأول carne + أداة العطف y + المفعول الثاني arroz.",
        ["comida", "carne", "arroz"]
    ),
    choice_ex(
        "a1_com_5_beverage",
        "word_choice",
        "اختر المشروب الساخن الشائع في الصباح بإسبانيا.",
        ["vocabulary"],
        "easy",
        "ما هو المشروب الذي يُطلب عادة في الصباح مصحوباً بالحليب (con leche)؟",
        "Por favor, un ____ con leche caliente.",
        "من فضلك، ____ بالحليب الساخن.",
        [
            opt("a1_com_5_a", "café", "قهوة", True),
            opt("a1_com_5_b", "pescado", "سمك", False, "pescado طعام مأكول وليس مشروباً."),
            opt("a1_com_5_c", "carne", "لحم", False, "carne طعام مأكول وليس مشروباً.")
        ],
        ["café", "leche", "té"],
        "القهوة بالحليب (café con leche) هي المشروب الصباحي الأكثر شهرة في إسبانيا."
    ),
    speak_ex(
        "a1_com_6_speak",
        "انطق جملة طلب الماء والخبز بنطق واضح.",
        ["speaking"],
        "medium",
        "اقرأ الجملة بصوت واضح لطلب الماء والخبز بأدب:",
        "Una botella de agua y pan, por favor.",
        "قنينة ماء وخبز، من فضلك.",
        "pending/a1-com-ex-6",
        ["agua", "pan"],
        "Una botella de agua y pan, por favor.",
        "احرص على مدّ الواو في agua ونطق حرف b بشكل مرقق في botella."
    )
]

# Lesson 2: a1-pedir-en-cafe
L_CAFE = {
    "slug": "a1-pedir-en-cafe",
    "titleAr": "الطلب في المقهى والمطعم: الأسلوب المهذب والتعبير عن الرغبة",
    "level": "A1",
    "programSlug": "main-track",
    "unitSlug": "a1-u4-food-drink",
    "objectiveAr": "أن يطلب المتعلم طعاماً أو شراباً في مقهى بأسلوب مهذب مستخدماً Para mí, por favor أو Quisiera un café، ويفهم أسئلة النادل الشائعة.",
    "estimatedMinutes": 12,
    "skills": ["speaking", "listening", "vocabulary", "reading", "grammar"],
    "newVocabulary": ["café", "agua", "leche", "té", "pan", "comida"],
    "reviewVocabulary": ["dos", "tres", "bueno"],
    "targetStructures": [
        "¿Qué desea tomar? — Para mí, un café con leche, por favor.",
        "¿Me pone un té verde, por favor?",
        "¿Desea algo más? — Nada más, gracias."
    ],
    "grammarTopics": ["pedir-cortesia", "para-mi-por-favor", "interaccion-camarero"],
    "scenarios": [
        {
            "contextAr": "كريم يجلس في مقهى تقليدي في مدريد ويطلب إفطاره من النادل بأسلوب طبيعي ومؤدب.",
            "settingAr": "مقهى تقليدي صباحاً في ساحة بويرتا ديل سول",
            "lines": [
                {
                    "es": "¡Buenos días! ¿Qué van a tomar?",
                    "ar": "صباح الخير! ماذا ستشربون؟",
                    "arEg": "صباح الخير! تشربوا إيه؟",
                    "audioKey": "pending/a1-caf-sc-1"
                },
                {
                    "es": "Para mí un café con leche y una tostada con tomate, por favor.",
                    "ar": "بالنسبة لي قهوة بالحليب وخبز محمص بالطماطم، من فضلك.",
                    "arEg": "أنا قهوة باللبن وتوست بالطماطم لو سمحت.",
                    "audioKey": "pending/a1-caf-sc-2"
                },
                {
                    "es": "¿Y para su compañero?",
                    "ar": "وماذا عن زميلك؟",
                    "arEg": "ولصاحبك إيه؟",
                    "audioKey": "pending/a1-caf-sc-3"
                },
                {
                    "es": "Para él un té negro y un vaso de agua.",
                    "ar": "له شاي أسود وكوب ماء.",
                    "arEg": "هو شاي أسود وكوباية مية.",
                    "audioKey": "pending/a1-caf-sc-4"
                }
            ]
        }
    ],
    "culturalNoteAr": "في إسبانيا من أكثر الطرق طبيعية للطلب في المقهى استخدام عبارة 'Para mí...' (بالنسبة لي...) متبوعة باسم الطلب و'por favor'. لا يُحبذ استخدام صيغ الأمر الجافة.",
    "pedagogicalRationaleAr": "الناطقون بالعربية قد يلجأون للترجمة الحرفية لفعل 'أريد' (Quiero...) بصورة تبدو حادة أو جافة في المقهى الإسباني. تدريبهم على 'Para mí...' و'por favor' يمنحهم لغة طبيعية ومهذبة.",
    "status": "draft",
    "review": review_block()
}

EX_CAFE = [
    choice_ex(
        "a1_caf_1_listen",
        "listen_choose",
        "استمع لسؤال النادل وحدد ماذا يسأل.",
        ["listening", "vocabulary"],
        "easy",
        "استمع إلى سؤال النادل لزبائن الطاولة:",
        "Buenas tardes, ¿qué desean tomar?",
        "مساء الخير، ماذا ترغبون في تناوله؟",
        [
            opt("a1_caf_1_a", "¿Qué desean tomar?", "ماذا ترغبون في تناوله؟ (سؤال الطلب)", True),
            opt("a1_caf_1_b", "¿Cuánto cuesta?", "كم السعر؟", False, "سؤال الفاتورة يكون بـ ¿La cuenta? أو ¿Cuánto cuesta?."),
            opt("a1_caf_1_c", "¿Dónde está el baño?", "أين دورة المياه؟", False, "النادل يسأل عن المشروب (tomar).")
        ],
        ["café", "comida"],
        "النادل يرحب ويسأل عن رغبة الزبائن في الشرب بعبارة: ¿qué desean tomar?",
        audioKey="pending/a1-caf-ex-1",
        speechEs="Buenas tardes, ¿qué desean tomar?"
    ),
    choice_ex(
        "a1_caf_2_polite",
        "word_choice",
        "اختر العبارة المهذبة والأكثر شيوعاً لبدء طلبك.",
        ["speaking", "vocabulary"],
        "easy",
        "كيف تبدأ طلبك في المقهى بأسلوب إسباني أصيل ومهذب؟",
        "____ un café solo, por favor.",
        "____ قهوة سادة، من فضلك.",
        [
            opt("a1_caf_2_a", "Para mí", "بالنسبة لي (الصيغة الطبيعية)", True),
            opt("a1_caf_2_b", "Dámelo", "أعطني إياه (صيغة أمر جافة)", False, "صيغة غير مستحبة وتفتقر للياقة في التعامل مع النادل."),
            opt("a1_caf_2_c", "Para ti", "بالنسبة لك أنت", False, "Para ti تعني لك أنت، وليس لي أنا.")
        ],
        ["café"],
        "عبارة Para mí هي الأسلوب الأكثر تلقائية ولطفاً للطلب في المقاهي الإسبانية."
    ),
    fill_ex(
        "a1_caf_3_fill",
        "أكمل العبارة الإلزامية في أي طلب مهذب.",
        ["writing"],
        "easy",
        "اكتب كلمة «من فضلك» (por favor) في الفراغ:",
        "Un vaso de agua fría, por ____.",
        "كوب ماء بارد، من ____.",
        ["agua"],
        ["favor"],
        "العبارة المهذبة هي دائماً: por favor وتعني من فضلك."
    ),
    order_ex(
        "a1_caf_4_order",
        "رتّب كلمات الطلب لتكوين جملة كاملة وسليمة.",
        ["grammar", "reading"],
        "medium",
        ["Para", "mí", "un", "café", "con", "leche."],
        "Para mí un café con leche.",
        "الترتيب الطبيعي للطلب: صيغة التأدب Para mí + أداة التنكير un + الاسم café + حرف الجر con + المكمل leche.",
        ["café", "leche"]
    ),
    choice_ex(
        "a1_caf_5_more",
        "word_choice",
        "كيف تجيب النادل إذا سألك: ¿Desea algo más? وتريد أن تقول: لا شيء آخر، شكراً.",
        ["vocabulary", "speaking"],
        "medium",
        "ما هو التعبير المناسب للاكتفاء بالطلبات الحالية؟",
        "— ¿Desea algo más? — ____, gracias.",
        "— هل ترغب في شيء آخر؟ — ____، شكراً.",
        [
            opt("a1_caf_5_a", "Nada más", "لا شيء آخر", True),
            opt("a1_caf_5_b", "Mucho más", "أكثر بكثير", False, "هذا يعني رغبة في المزيد."),
            opt("a1_caf_5_c", "De nada", "على الرحب والسعة", False, "De nada تُقال رداً على الشكر، وليس رداً على السؤال عن الطلبات.")
        ],
        ["comida"],
        "عبارة Nada más, gracias تعني بكل تهذيب: لا شيء آخر، شكراً لك."
    ),
    speak_ex(
        "a1_caf_6_speak",
        "انطق جملة الطلب في المقهى بأسلوب مهذب وواضح.",
        ["speaking"],
        "medium",
        "اقرأ الجملة بصوت واضح ونبرة مهذبة:",
        "Para mí un té con leche caliente, por favor.",
        "بالنسبة لي شاي بالحليب الساخن، من فضلك.",
        "pending/a1-caf-ex-6",
        ["té", "leche"],
        "Para mí un té con leche caliente, por favor.",
        "حافظ على نبرة هادئة ومؤدبة مع وصل الحروف: té con leche caliente."
    )
]

# Lesson 3: a1-precios-cuentas
L_PREC = {
    "slug": "a1-precios-cuentas",
    "titleAr": "الأسعار والحساب: السؤال عن الثمن وطلب الفاتورة",
    "level": "A1",
    "programSlug": "main-track",
    "unitSlug": "a1-u4-food-drink",
    "objectiveAr": "أن يسأل المتعلم عن سعر الأشياء بـ ¿Cuánto cuesta / cuestan? ويطلب الحساب بـ La cuenta, por favor ويفهم الإجمالي بالأرقام واليورو.",
    "estimatedMinutes": 12,
    "skills": ["listening", "writing", "vocabulary", "speaking", "grammar"],
    "newVocabulary": ["cuenta", "euro", "costar", "café", "agua", "pan"],
    "reviewVocabulary": ["dos", "tres", "cuatro", "cinco"],
    "targetStructures": [
        "¿Cuánto cuesta el café? — Cuesta dos euros.",
        "¿Cuánto cuestan estos pasteles? — Cuestan cuatro euros.",
        "La cuenta, por favor. ¿Se puede pagar con tarjeta?"
    ],
    "grammarTopics": ["concordancia-verbo-costar", "pedir-la-cuenta", "numeros-precios-euros"],
    "scenarios": [
        {
            "contextAr": "ليلى تنهي فطورها في مطعم صغير في إشبيلية وتطلب الفاتورة من النادل وتدفع بالبطاقة المصرفية.",
            "settingAr": "مطعم تقليدي في حي سانتا كروز بإشبيلية",
            "lines": [
                {
                    "es": "Perdón, camarero, ¿me trae la cuenta, por favor?",
                    "ar": "معذرة أيها النادل، هل تحضر لي الحساب من فضلك؟",
                    "arEg": "لو سمحت يا كابتن، الحساب بعد إذنك؟",
                    "audioKey": "pending/a1-pre-sc-1"
                },
                {
                    "es": "Sí, claro. Son cinco euros con cincuenta céntimos.",
                    "ar": "نعم بالطبع. المجموع خمسة يورو وخمسون سنتاً.",
                    "arEg": "أيوه طبعاً. الحساب خمسة يورو ونص.",
                    "audioKey": "pending/a1-pre-sc-2"
                },
                {
                    "es": "¿Se puede pagar con tarjeta de crédito?",
                    "ar": "هل يمكن الدفع ببطاقة الائتمان؟",
                    "arEg": "ينفع أدفع بالفيزا؟",
                    "audioKey": "pending/a1-pre-sc-3"
                },
                {
                    "es": "Sí, por supuesto, ningún problema.",
                    "ar": "نعم بكل تأكيد، لا توجد مشكلة.",
                    "arEg": "أيوه طبعاً، مافيش أي مشكلة.",
                    "audioKey": "pending/a1-pre-sc-4"
                }
            ]
        }
    ],
    "culturalNoteAr": "طلب الحساب في إسبانيا يُقال عادة: 'La cuenta, por favor'. والبقشيش (la propina) اختياري وليس إجبارياً في الثقافة الإسبانية، ويُترك عادة كقطع نقدية صغيرة إذا كانت الخدمة ممتازة.",
    "pedagogicalRationaleAr": "الفعل costar يطابق الاسم الذي يليه: ¿Cuánto cuesta? للمفرد (el café)، و¿Cuánto cuestan? للجمع (los cafés). من الأخطاء المنتظمة استخدام صيغة المفرد cuesta دائماً مع الجمع.",
    "status": "draft",
    "review": review_block()
}

EX_PREC = [
    choice_ex(
        "a1_pre_1_listen",
        "listen_choose",
        "استمع للمبلغ وحدد إجمالي الفاتورة المطلوب.",
        ["listening", "vocabulary"],
        "easy",
        "استمع جيداً للنادل وهو يحدد قيمة الحساب الإجمالية:",
        "En total son cuatro euros con cincuenta.",
        "في المجموع أربعة يورو وخمسون سنتاً.",
        [
            opt("a1_pre_1_a", "Cuatro euros con cincuenta", "أربعة يورو ونصف (4,50 €)", True),
            opt("a1_pre_1_b", "Cinco euros con cuarenta", "خمسة يورو وأربعون سنتاً (5,40 €)", False, "عكست الأرقام: الصوت قال cuatro euros (أربعة يورو)."),
            opt("a1_pre_1_c", "Cuatro euros", "أربعة يورو فقط (4,00 €)", False, "الصوت ذكر معها con cincuenta (مع خمسين سنتاً).")
        ],
        ["euro", "cuenta", "cuatro"],
        "المبلغ المنطوق هو cuatro euros con cincuenta أي 4,50 يورو.",
        audioKey="pending/a1-pre-ex-1",
        speechEs="En total son cuatro euros con cincuenta."
    ),
    choice_ex(
        "a1_pre_2_agreement",
        "word_choice",
        "اختر صيغة الفعل costar المناسبة للاسم الجمع.",
        ["grammar"],
        "medium",
        "كيف نسأل عن سعر شيئين أو أكثر في الإسبانية؟",
        "¿Cuánto ____ estos dos cafés con leche?",
        "كم ____ هذان الفنجانان من القهوة بالحليب؟",
        [
            opt("a1_pre_2_a", "cuestan", "تكلفتها (للجمع)", True),
            opt("a1_pre_2_b", "cuesta", "تكلفتها (للمفرد فقط)", False, "خطأ: الفاعل هنا اسم جمع (estos dos cafés)، لذا يجب استخدام cuestan."),
            opt("a1_pre_2_c", "costar", "الفعل في المصدر", False, "لا يمكن وضع الفعل في المصدر في السؤال بدون تصريف.")
        ],
        ["costar", "café", "dos"],
        "الفاعل هنا جمع (estos dos cafés)، وبالتالي الفعل يطابق الجمع ويصبح: cuestan."
    ),
    fill_ex(
        "a1_pre_3_fill",
        "اكتب كلمة «الحساب / الفاتورة» بالإسبانية.",
        ["writing", "vocabulary"],
        "easy",
        "أكمل جملة طلب الفاتورة بكتابة كلمة (cuenta):",
        "Camarero, la ____, por favor.",
        "أيها النادل، الـ____، من فضلك.",
        ["cuenta"],
        ["cuenta"],
        "كلمة الحساب أو الفاتورة في المطعم هي la cuenta."
    ),
    order_ex(
        "a1_pre_4_order",
        "رتّب الكلمات للسؤال عن السعر الإجمالي.",
        ["grammar", "reading"],
        "medium",
        ["¿Cuánto", "es", "todo", "en", "total?"],
        "¿Cuánto es todo en total?",
        "الترتيب المعياري: أداة الاستفهام ¿Cuánto + فعل الكينونة es + الاسم todo + شبه الجملة en total?",
        ["cuenta", "euro"]
    ),
    choice_ex(
        "a1_pre_5_singular",
        "word_choice",
        "اختر صيغة السؤال المناسبة لاسم مفرد (قطعة الخبز).",
        ["grammar"],
        "easy",
        "للسؤال عن سعر قطعة الخبز المفردة نستخدم:",
        "¿Cuánto ____ esta barra de pan?",
        "كم ____ هذا الرغيف من الخبز؟",
        [
            opt("a1_pre_5_a", "cuesta", "يكلف (للمفرد)", True),
            opt("a1_pre_5_b", "cuestan", "تكلف (للجمع)", False, "الفاعل هنا مفرد (esta barra de pan) فيأخذ cuesta."),
            opt("a1_pre_5_c", "costamos", "نحن نكلف", False, "تصريف غير مناسب للضمير nosotros.")
        ],
        ["costar", "pan"],
        "الفاعل مفرد (esta barra de pan)، لذا نستخدم صيغة المفرد: cuesta."
    ),
    speak_ex(
        "a1_pre_6_speak",
        "انطق عبارة طلب الحساب بنبرة واضحة ومؤدبة.",
        ["speaking"],
        "medium",
        "اقرأ الجملة بصوت واضح لطلب الحساب في المطعم:",
        "La cuenta, por favor, y gracias por el servicio.",
        "الحساب من فضلك، وشكراً على الخدمة.",
        "pending/a1-pre-ex-6",
        ["cuenta"],
        "La cuenta, por favor, y gracias por el servicio.",
        "انتبه لنطق حرف c في cuenta ونبرة الـ favor المهذبة."
    )
]

# Lesson 4: a1-gustar
L_GUST = {
    "slug": "a1-gustar",
    "titleAr": "التفضيل والإعجاب: استخدام الفعل Gustar مع المفرد والجمع",
    "level": "A1",
    "programSlug": "main-track",
    "unitSlug": "a1-u4-food-drink",
    "objectiveAr": "أن يعبّر المتعلم عمّا يحبه وما لا يحبه من أطعمة ومشروبات باستخدام me gusta مع المفرد وme gustan مع الجمع، وفهم بنية الفاعل والمفعول في الفعل gustar.",
    "estimatedMinutes": 12,
    "skills": ["grammar", "speaking", "listening", "reading", "writing"],
    "newVocabulary": ["gustar", "café", "té", "agua", "pescado", "carne", "arroz", "pan", "comida"],
    "reviewVocabulary": ["bueno", "amigo"],
    "targetStructures": [
        "Me gusta mucho el café solo.",
        "No me gusta el pescado.",
        "Me gustan los platos tradicionales."
    ],
    "grammarTopics": ["verbo-gustar-estructura", "gusta-vs-gustan", "pronombres-ci-me-te-le"],
    "scenarios": [
        {
            "contextAr": "سارة وزميلها الإسباني بابلو يتحدثان في استراحة الغداء حول تفضيلاتهما في الطعام الإسباني والعربي.",
            "settingAr": "مطعم المعهد في فالنسيا",
            "lines": [
                {
                    "es": "¿Te gusta la paella tradicional, Sara?",
                    "ar": "هل تعجبك الباييلا التقليدية يا سارة؟",
                    "arEg": "بتحبي الباييلا الأصلية يا سارة؟",
                    "audioKey": "pending/a1-gus-sc-1"
                },
                {
                    "es": "¡Sí, me encanta! Me gusta mucho el arroz con marisco.",
                    "ar": "نعم، أعشقها! يعجبني كثيراً الأرز مع ثمار البحر.",
                    "arEg": "أيوه جداً! بيعجبني أوي الرز بفواكه البحر.",
                    "audioKey": "pending/a1-gus-sc-2"
                },
                {
                    "es": "¿Y qué no te gusta?",
                    "ar": "وما الذي لا يعجبك؟",
                    "arEg": "وإيه اللي مش بتحبيه؟",
                    "audioKey": "pending/a1-gus-sc-3"
                },
                {
                    "es": "No me gusta el café amargo ni la carne muy hecha.",
                    "ar": "لا تعجبني القهوة المرة ولا اللحم المطهو زيادة عن اللازم.",
                    "arEg": "مش بحب القهوة المرة ولا اللحمة المستوية زيادة.",
                    "audioKey": "pending/a1-gus-sc-4"
                }
            ]
        }
    ],
    "culturalNoteAr": "المطبخ الإسباني غني جداً بزيت الزيتون والأسماك والأرز، ويُعد الطعام جزءاً مركزياً من الحياة الاجتماعية والتواصل بين العائلة والأصدقاء.",
    "pedagogicalRationaleAr": "فعل gustar يمثل عقبة كبرى للمتعلم العربي لأنه يعني حرفياً 'يعجب'، فالشيء المعجب به هو الفاعل: 'Me gusta el arroz' (يعجبني الأرز) و'Me gustan los pescados' (تعجبني الأسماك)، بينما me هو ضمير مفعول به غير مباشر وليس فاعلاً.",
    "status": "draft",
    "review": review_block()
}

EX_GUST = [
    choice_ex(
        "a1_gus_1_listen",
        "listen_choose",
        "استمع للمتحدث وحدد ما يحبه وما يفضله.",
        ["listening", "vocabulary"],
        "easy",
        "استمع جيداً للمتحدث وهو يصف ما يعجبه:",
        "Me gusta mucho el té verde caliente.",
        "يعجبني كثيراً الشاي الأخضر الساخن.",
        [
            opt("a1_gus_1_a", "El té verde caliente", "الشاي الأخضر الساخن", True),
            opt("a1_gus_1_b", "El café con leche", "القهوة بالحليب", False, "الصوت ذكر el té verde (الشاي الأخضر) وليس القهوة."),
            opt("a1_gus_1_c", "El agua fría", "الماء البارد", False, "المتحدث لم يذكر الماء إطلاقاً.")
        ],
        ["gustar", "té"],
        "المتحدث صرح بوضوح: Me gusta mucho el té verde caliente.",
        audioKey="pending/a1-gus-ex-1",
        speechEs="Me gusta mucho el té verde caliente."
    ),
    choice_ex(
        "a1_gus_2_agreement",
        "word_choice",
        "اختر صيغة الفعل gustar المناسبة مع الاسم الجمع.",
        ["grammar"],
        "medium",
        "كيف تقول بالإسبانية: «تعجبني الأسماك الطازجة»؟",
        "A mí me ____ los pescados frescos.",
        "أنا تعجبني الأسماك الطازجة.",
        [
            opt("a1_gus_2_a", "gustan", "تعجبني (مع فاعل جمع)", True),
            opt("a1_gus_2_b", "gusta", "تعجبني (مع فاعل مفرد فقط)", False, "خطأ متكرر: الفاعل هو los pescados (جمع)، لذا يجب أن يكون الفعل gustan."),
            opt("a1_gus_2_c", "gusto", "أعجب (لضمير المتكلم yo)", False, "gusto تعني أنا أعجب غيري، وهنا الفاعل هو الأسماك وليس أنا.")
        ],
        ["gustar", "pescado"],
        "مع الأسماء الجمع مثل los pescados، يُصرّف فعل gustar بصيغة الغائب الجمع: gustan."
    ),
    fill_ex(
        "a1_gus_3_fill",
        "أكمل بصيغة المفرد للفعل gustar مع الأرز.",
        ["writing", "grammar"],
        "easy",
        "اكتب صيغة الفعل المناسبة مع الاسم المفرد (el arroz):",
        "No me ____ el arroz frío.",
        "لا يعجبني الأرز البارد.",
        ["gustar", "arroz"],
        ["gusta"],
        "مع الاسم المفرد (el arroz) نستخدم صيغة المفرد: gusta."
    ),
    order_ex(
        "a1_gus_4_order",
        "رتّب الكلمات لنفي الإعجاب بالطعام المذكور.",
        ["grammar", "reading"],
        "medium",
        ["No", "me", "gusta", "la", "carne", "frita."],
        "No me gusta la carne frita.",
        "تركيب النفي مع gustar: أداة النفي No + ضمير المفعول me + الفعل gusta + الاسم الفاعل la carne frita.",
        ["gustar", "carne"]
    ),
    choice_ex(
        "a1_gus_5_pronoun",
        "word_choice",
        "اختر الضمير المناسب عندما تسأل صديقك عما يحبه.",
        ["grammar"],
        "medium",
        "كيف تسأل صديقك: «هل يعجبك الطعام التقليدي؟»",
        "¿____ gusta la comida tradicional?",
        "هل يعجبك الطعام التقليدي؟",
        [
            opt("a1_gus_5_a", "Te", "ضمير المفعول للمخاطب المفرد tú", True),
            opt("a1_gus_5_b", "Tú", "ضمير الفاعل (لا يُستخدم مباشرة قبل gusta)", False, "مع فعل gustar نستخدم ضمير المفعول te وليس ضمير الفاعل tú."),
            opt("a1_gus_5_c", "Ti", "ضمير بعد حرف الجر", False, "Ti لا تأتي بمفردها قبل الفعل بل مع حرف الجر (a ti te gusta).")
        ],
        ["gustar", "comida"],
        "ضمير المفعول غير المباشر للمخاطب tú مع فعل gustar هو: te (¿Te gusta...?)."
    ),
    speak_ex(
        "a1_gus_6_speak",
        "انطق جملة التعبير عن الإعجاب بالطعام الإسباني بنطق صحيح.",
        ["speaking"],
        "medium",
        "اقرأ الجملة بصوت واضح مبيناً إعجابك بالطعام:",
        "Me gusta mucho el pan con aceite de oliva.",
        "يعجبني كثيراً الخبز مع زيت الزيتون.",
        "pending/a1-gus-ex-6",
        ["gustar", "pan"],
        "Me gusta mucho el pan con aceite de oliva.",
        "احرص على نطق حرف c في aceite كحرف ثاء ونطق حرف l بشكل واضح."
    )
]

def main():
    os.makedirs(OUT, exist_ok=True)
    all_lessons = [
        (L_NUM, EX_NUM, "lesson-a1-numeros-20-100.json"),
        (L_HORA, EX_HORA, "lesson-a1-la-hora.json"),
        (L_DIAS, EX_DIAS, "lesson-a1-dias-meses.json"),
        (L_CITA, EX_CITA, "lesson-a1-cita.json"),
        (L_COM, EX_COM, "lesson-a1-vocabulario-comida.json"),
        (L_CAFE, EX_CAFE, "lesson-a1-pedir-en-cafe.json"),
        (L_PREC, EX_PREC, "lesson-a1-precios-cuentas.json"),
        (L_GUST, EX_GUST, "lesson-a1-gustar.json")
    ]
    for doc, exercises, filename in all_lessons:
        full_doc = lesson_doc(doc, exercises)
        path = os.path.join(OUT, filename)
        with open(path, 'w', encoding='utf-8') as f:
            json.dump(full_doc, f, ensure_ascii=False, indent=2)
        print(f"Generated {path} with {len(exercises)} exercises.")

if __name__ == '__main__':
    main()
