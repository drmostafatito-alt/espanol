# -*- coding: utf-8 -*-
"""Generator for A1 Units 8 (Places & Directions), 9 (Work & Study), and 10 (Health & Emergency).
Completes 100% of Level A1 (all 10 units, 40 lessons).
Based on:
- Aula Internacional 1 & Plus 1 (Unidades 1, 2, 7, 9)
- Gramática del uso del español A1-B2 (Capítulos 4, 40, 70, 71, 72, 73)
- Español 2000 Nivel Elemental (Lecciones 4, 8, 9, Salud)
- المرشد في اللغة الأسبانية (المدينة والمواصلات، المهن وتأنيثها، أعضاء الجسم وأفعال الألم)
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
    # Ensure options have globally unique IDs prefixed by eid
    scoped_options = []
    for o in options:
        oid = o["id"]
        if not oid.startswith(eid):
            oid = f"{eid}_{oid}"
        so = dict(o)
        so["id"] = oid
        scoped_options.append(so)

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
        "options": scoped_options,
        "targetVocab": targetVocab,
        "explanationAr": explanationAr,
        "scoring": {"mode": "all_or_nothing"}
    }
    if audioKey:
        d["audioKey"] = audioKey
    if speechEs:
        d["speechEs"] = speechEs
    correct = [o["id"] for o in scoped_options if o.get("isCorrect")]
    d["answerKey"] = {
        "correctOptionIds": correct,
        "selectedOptionId": correct[0] if correct else ""
    }
    fb = {o["id"]: o["distractorRationaleAr"] for o in scoped_options if not o.get("isCorrect") and o.get("distractorRationaleAr")}
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
    doc["level"] = doc.get("level", "A1")
    if not doc.get("objectiveAr"):
        doc["objectiveAr"] = doc["pedagogy"]["learningObjectivesAr"][0]
    if not doc.get("skills"):
        doc["skills"] = ["vocabulary", "reading", "grammar", "listening", "speaking"]
    if "newVocabulary" in doc and doc["newVocabulary"] and isinstance(doc["newVocabulary"][0], dict):
        doc["newVocabulary"] = [v["headword"] for v in doc["newVocabulary"]]
    if "reviewVocabulary" in doc and doc["reviewVocabulary"] and isinstance(doc["reviewVocabulary"][0], dict):
        doc["reviewVocabulary"] = [v["headword"] for v in doc["reviewVocabulary"]]
    doc["exercises"] = exercises
    return {
        "schemaVersion": "1.0.0",
        "lesson": doc
    }

def review_block():
    return {
        "status": "draft",
        "authors": ["فريق المنهج — تكامل كتب القواعد والمصادر (Gramática del uso, Español 2000, Aula Internacional, المرشد)"],
        "spanishReviewer": None,
        "translationReviewer": None,
        "reviewedAt": None,
        "notes": "مسودة جاهزة للتدقيق البشري، معتمدة على مصادر القواعد المعتمدة ومصممة للمتعلم العربي."
    }

# ==============================================================================
# UNIT 8: a1-u8-places (الأماكن والاتجاهات)
# ==============================================================================

def make_lesson_lugares_ciudad():
    slug = "a1-lugares-ciudad"
    doc = {
        "slug": slug,
        "unitSlug": "a1-u8-places",
        "levelCode": "A1",
        "titleAr": "أماكن في المدينة: تسمية المعالم والمرافق العامة",
        "titleEs": "Lugares en la ciudad",
        "subtitleAr": "تعلم أسماء الأماكن والمرافق الحضرية وتمييز مذكرها ومؤنثها",
        "order": 1,
        "estimatedMinutes": 18,
        "cefrLevel": "A1",
        "review": review_block(),

        "pedagogy": {
            "learningObjectivesAr": [
                "أن يسمّي المتعلم الأماكن العامة الأساسية في المدينة بدقة.",
                "أن يميز بين الأماكن المذكرة (el museo, el parque, el banco) والمؤنثة (la plaza, la calle, la estación).",
                "أن يستخدم حرف الجر en للتعبير عن التواجد في مكان محدد."
            ],
            "grammarPoints": [
                {
                    "titleAr": "أدوات التعريف مع أماكن المدينة وحرف الجر en",
                    "explanationAr": "تُستخدم أداة التعريف (el للمذكر، la للمؤنث) مع الأماكن العامة: el parque (الحديقة)، el banco (البنك)، el museo (المتحف)، el supermercado (السوبرماركت)، بينما la plaza (الميدان)، la calle (الشارع)، la estación (المحطة)، la farmacia (الصيدلية). عند التعبير عن التواجد نستخدم حرف الجر en: Estoy en el parque (أنا في الحديقة)."
                }
            ],
            "commonMistakesAr": [
                "تذكير la calle أو la plaza بتأثير اللغة العربية (الشارع مذكر في العربية ومؤنث في الإسبانية: la calle).",
                "استخدام a بدلاً من en للتعبير عن التواجد الثابت (القول *estoy a la plaza بدلاً من estoy en la plaza)."
            ],
            "dialectNotes": [
                {
                    "region": "EG",
                    "noteAr": "في مصر نقول: «أنا في الميدان / في البنك / في المحطة». في الإسبانية نفس التركيب بالضبط: Estoy en + المكان مع أداة التعريف المناسبة."
                }
            ],
            "culturalNoteAr": "الميدان العام (la plaza) في إسبانيا وأمريكا اللاتينية ليس مجرد مفترق طرق، بل هو قلب الحياة الاجتماعية حيث يجتمع الناس في المقاهي والمساء."
        },
        "contentBlocks": [
            {
                "id": f"cb-{slug}-intro",
                "type": "explanation",
                "titleAr": "معالم ومرافق المدينة",
                "bodyAr": "عندما تتجول في مدينة ناطقة بالإسبانية، ستحتاج إلى تمييز الأماكن الأساسية:\n- **la plaza**: الميدان / الساحة العامة\n- **la calle**: الشارع\n- **el museo**: المتحف\n- **el parque**: الحديقة / المنتزه\n- **el banco**: البنك / المصرف\n- **la estación**: المحطة (قطار أو مترو)\n- **el hospital**: المستشفى\n- **el supermercado**: السوبرماركت",
                "examples": [
                    {"es": "El museo está abierto.", "ar": "المتحف مفتوح."},
                    {"es": "La plaza es muy grande.", "ar": "الميدان كبير جداً."},
                    {"es": "Hay un parque cerca de aquí.", "ar": "توجد حديقة بالقرب من هنا."}
                ]
            }
        ],
        "newVocabulary": [
            {"headword": "plaza", "meaningAr": "ميدان / ساحة عامة", "partOfSpeech": "noun", "gender": "feminine"},
            {"headword": "calle", "meaningAr": "شارع", "partOfSpeech": "noun", "gender": "feminine"},
            {"headword": "museo", "meaningAr": "متحف", "partOfSpeech": "noun", "gender": "masculine"},
            {"headword": "parque", "meaningAr": "حديقة عامة / منتزه", "partOfSpeech": "noun", "gender": "masculine"},
            {"headword": "banco", "meaningAr": "بنك / مصرف", "partOfSpeech": "noun", "gender": "masculine"},
            {"headword": "estación", "meaningAr": "محطة", "partOfSpeech": "noun", "gender": "feminine"},
            {"headword": "hospital", "meaningAr": "مستشفى", "partOfSpeech": "noun", "gender": "masculine"},
            {"headword": "supermercado", "meaningAr": "سوبرماركت / متجر كبير", "partOfSpeech": "noun", "gender": "masculine"}
        ],
        "reviewVocabulary": []
    }

    exs = [
        choice_ex(
            "ex-a1-lug-1", "word_choice",
            "اختر الأداة الصحيحة للشارع في الإسبانية",
            ["grammar", "vocabulary"], 1,
            "كلمة calle مؤنثة في الإسبانية، ما هي أداة التعريف المناسبة لها؟",
            "Vivo en _____ calle Mayor.",
            "أعيش في شارع مايور.",
            [
                opt("o1", "la", "أداة التعريف للمؤنث", True),
                opt("o2", "el", "أداة التعريف للمذكر", False, "calle كلمة مؤنثة في الإسبانية وليست مذكرة كما في العربية."),
                opt("o3", "los", "أداة الجمع المذكر", False, "calle اسم مفرد وليس جمعاً.")
            ],
            ["calle"],
            "في الإسبانية كلمة calle مؤنثة دائماً وتأخذ أداة التعريف la."
        ),
        choice_ex(
            "ex-a1-lug-2", "word_choice",
            "حدد المكان المناسب للمعنى",
            ["vocabulary", "reading"], 1,
            "أين تذهب لرؤية الآثار واللوحات التاريخية؟",
            "Voy a visitar un _____ famoso.",
            "سأزور ... شهيراً.",
            [
                opt("o1", "museo", "متحف", True),
                opt("o2", "supermercado", "سوبرماركت", False, "السوبرماركت لشراء المواد الغذائية وليس للآثار."),
                opt("o3", "banco", "بنك", False, "البنك للمعاملات المالية وليس للآثار.")
            ],
            ["museo", "supermercado", "banco"],
            "المتحف (el museo) هو المكان المخصص للآثار والمعارض الفنية."
        ),
        fill_ex(
            "ex-a1-lug-3",
            "أكمل الجملة بالاسم المناسب للمنتزه",
            ["vocabulary", "writing"], 2,
            "اكتب الكلمة الإسبانية المناسبة لـ 'الحديقة العامة / المنتزه'",
            "Los niños juegan en el _____ grande.",
            "الأطفال يلعبون في المنتزه الكبير.",
            ["parque"],
            ["parque"],
            "كلمة parque تعني الحديقة العامة أو المنتزه وتأخذ el."
        ),
        order_ex(
            "ex-a1-lug-4",
            "رتّب الكلمات لتكوين جملة صحيحة عن التواجد في الميدان",
            ["grammar", "writing"], 2,
            ["Estamos", "en", "la", "plaza", "principal"],
            "Estamos en la plaza principal",
            "الترتيب السليم: الفعل أولاً ثم حرف الجر en ثم أداة التعريف la والاسم plaza والصفة principal.",
            ["plaza"]
        ),
        choice_ex(
            "ex-a1-lug-5", "listen_choose",
            "استمع واختر المكان الذي تم ذكره",
            ["listening", "vocabulary"], 2,
            "استمع للتسجيل وحدد المكان المذكور في الجملة",
            "¿Dónde está la _____ de tren?",
            "أين تقع محطة القطار؟",
            [
                opt("o1", "estación", "محطة", True),
                opt("o2", "calle", "شارع", False, "التسجيل ذكر محطة estación وليس شارع calle."),
                opt("o3", "plaza", "ميدان", False, "التسجيل ذكر محطة وليس ميداناً.")
            ],
            ["estación", "calle", "plaza"],
            "الكلمة المسموعة هي estación وتعني محطة.",
            audioKey="pending/a1_estacion_tren.mp3",
            speechEs="¿Dónde está la estación de tren?"
        ),
        speak_ex(
            "ex-a1-lug-6",
            "انطق الجملة موضحاً مكان المستشفى",
            ["speaking", "pronunciation"], 2,
            "تحدث بنطق إسباني سليم لتحديد وجود مستشفى في المدينة",
            "Hay un hospital moderno en la ciudad.",
            "يوجد مستشفى حديث في المدينة.",
            "pending/a1_hay_un_hospital.mp3",
            ["hospital"],
            "Hay un hospital moderno en la ciudad.",
            "تذكر أن حرف h في hospital صامت ولا ينطق في الإسبانية."
        )
    ]
    return lesson_doc(doc, exs)

def make_lesson_donde_esta():
    slug = "a1-donde-esta"
    doc = {
        "slug": slug,
        "unitSlug": "a1-u8-places",
        "levelCode": "A1",
        "titleAr": "أين يوجد؟ السؤال عن الأماكن وتحديد موقعها بـ Está",
        "titleEs": "¿Dónde está? Localizar lugares",
        "subtitleAr": "استخدام ¿Dónde está? مع حروف المكان وإدغام del",
        "order": 2,
        "estimatedMinutes": 18,
        "cefrLevel": "A1",
        "review": review_block(),

        "pedagogy": {
            "learningObjectivesAr": [
                "أن يسأل المتعلم عن الأماكن المحددة باستخدام ¿Dónde está...? أو ¿Dónde están...? بدقة.",
                "أن يستخدم تعبيرات الموقع: cerca de (قريب من) و lejos de (بعيد عن) و al lado de (بجانب).",
                "أن يطبق إدغام حرف الجر de مع أداة المذكر el ليصبح del بصورة تلقائية."
            ],
            "grammarPoints": [
                {
                    "titleAr": "السؤال بـ ¿Dónde está? وإدغام del",
                    "explanationAr": "للسؤال عن موقع مكان محدد ومعرّف نستخدم: ¿Dónde está + اسم مفرد؟ مثل: ¿Dónde está el banco? وللجمع: ¿Dónde están los museos? عند الإجابة نستخدم está + ظرف المكان: está cerca de (قريب من)، está lejos de (بعيد عن). قاعدة حاسمة: عندما يلتقي de مع أداة التعريف el يندمجان إجبارياً في del: está cerca del parque (وليس *de el parque*)."
                }
            ],
            "commonMistakesAr": [
                "نسيان إدغام de + el في del (كتابة *cerca de el museo* بدلاً من cerca del museo).",
                "استخدام الفعل Ser لتحديد الموقع الجغرافي للأماكن (مثل القول *el banco es aquí* بدلاً من el banco está aquí)."
            ],
            "dialectNotes": [
                {
                    "region": "EG",
                    "noteAr": "في العامية المصرية نقول: «البنك فين؟ قريّب من هنا جنب المحطة». في الإسبانية: ¿Dónde está el banco? Está cerca de aquí, al lado de la estación."
                }
            ],
            "culturalNoteAr": "عند سؤال الإسبان في الشارع عن مكان، من المعتاد أن تبدأ بعبارة مهذبة: «Por favor, ¿dónde está...?» أو «Perdona, ¿dónde está...?» قبل طرح السؤال مباشرة."
        },
        "contentBlocks": [
            {
                "id": f"cb-{slug}-intro",
                "type": "explanation",
                "titleAr": "تحديد مواقع الأماكن",
                "bodyAr": "لتحديد موقع مكان ما في المدينة:\n- **¿Dónde está...?**: أين يوجد / أين يقع...؟ (للمفرد)\n- **está cerca de**: يقع قريباً من\n- **está lejos de**: يقع بعيداً عن\n- **de + el = del**: إدغام واجب للمذكر، بينما المؤنث يبقى **de la**.",
                "examples": [
                    {"es": "El banco está cerca del centro.", "ar": "البنك يقع قريباً من وسط المدينة."},
                    {"es": "El museo está lejos de la estación.", "ar": "المتحف يقع بعيداً عن المحطة."},
                    {"es": "La farmacia está en esta avenida.", "ar": "الصيدلية تقع في هذا الشارع العريض."}
                ]
            }
        ],
        "newVocabulary": [
            {"headword": "dónde", "meaningAr": "أين (استفهام عن المكان)", "partOfSpeech": "adverb"},
            {"headword": "cerca", "meaningAr": "قريب", "partOfSpeech": "adverb"},
            {"headword": "lejos", "meaningAr": "بعيد", "partOfSpeech": "adverb"},
            {"headword": "centro", "meaningAr": "مركز / وسط المدينة", "partOfSpeech": "noun", "gender": "masculine"},
            {"headword": "avenida", "meaningAr": "شارع عريض / جادة", "partOfSpeech": "noun", "gender": "feminine"}
        ],
        "reviewVocabulary": [
            {"headword": "banco", "meaningAr": "بنك / مصرف"},
            {"headword": "estación", "meaningAr": "محطة"},
            {"headword": "museo", "meaningAr": "متحف"},
            {"headword": "parque", "meaningAr": "حديقة عامة"}
        ]
    }

    exs = [
        choice_ex(
            "ex-a1-don-1", "word_choice",
            "اختر صيغة الإدغام الصحيحة مع المذكر",
            ["grammar"], 1,
            "كيف تدمج de مع أداة المذكر el أمام كلمة centro؟",
            "El banco está cerca _____ centro.",
            "البنك قريب من وسط المدينة.",
            [
                opt("o1", "del", "إدغام de + el الإلزامي", True),
                opt("o2", "de el", "تركيب مفصول غير جائز", False, "في الإسبانية يلزم إدغام de مع el ليصبح del."),
                opt("o3", "de la", "أداة مؤنث مع اسم مذكر", False, "centro اسم مذكر ويأخذ el المدمجة في del.")
            ],
            ["centro", "cerca", "banco"],
            "القاعدة النحوية تلزم إدغام de + el لتصبح del أمام الأسماء المذكرة."
        ),
        fill_ex(
            "ex-a1-don-2",
            "اكتب الكلمة الناقصة للسؤال عن المكان",
            ["grammar", "writing"], 1,
            "اكتب أداة الاستفهام الإسبانية التي تعني 'أين'",
            "¿_____ está el museo nacional?",
            "أين يقع المتحف الوطني؟",
            ["dónde"],
            ["dónde", "donde"],
            "أداة الاستفهام عن المكان هي dónde مع علامة النبر (tilde)."
        ),
        choice_ex(
            "ex-a1-don-3", "word_choice",
            "اختر التعبير الدال على البُعد",
            ["vocabulary", "reading"], 2,
            "إذا كانت المحطة على مسافة طويلة بالسيارة، فماذا نقول؟",
            "La estación está _____ de aquí.",
            "المحطة تقع ... من هنا.",
            [
                opt("o1", "lejos", "بعيد", True),
                opt("o2", "cerca", "قريب", False, "cerca تعني قريب وليس بعيد."),
                opt("o3", "dónde", "أين", False, "dónde أداة استفهام ولا تصف البعد في جملة خبرية.")
            ],
            ["lejos", "cerca", "estación"],
            "كلمة lejos تعني بعيداً (está lejos de aquí = بعيد عن هنا)."
        ),
        order_ex(
            "ex-a1-don-4",
            "رتّب الجملة لتوضيح موقع الحديقة بجانب الشارع العريض",
            ["grammar", "writing"], 2,
            ["El", "parque", "está", "en", "la", "avenida"],
            "El parque está en la avenida",
            "الترتيب الصحيح: الفاعل El parque ثم الفعل está ثم حرف الجر والمكان en la avenida.",
            ["parque", "avenida"]
        ),
        choice_ex(
            "ex-a1-don-5", "listen_choose",
            "استمع واختر وصف الموقع المذكور",
            ["listening", "vocabulary"], 2,
            "استمع للسؤال وحدد الكلمة المستفهم عنها",
            "¿Dónde está el museo de arte?",
            "أين يقع متحف الفنون؟",
            [
                opt("o1", "museo", "متحف", True),
                opt("o2", "parque", "حديقة", False, "المتحدث سأل عن المتحف وليس الحديقة."),
                opt("o3", "banco", "بنك", False, "المتحدث سأل عن المتحف وليس البنك.")
            ],
            ["museo", "parque", "banco", "dónde"],
            "السؤال المسموع هو: ¿Dónde está el museo de arte? والاسم هو museo.",
            audioKey="pending/a1_donde_esta_museo.mp3",
            speechEs="¿Dónde está el museo de arte?"
        ),
        speak_ex(
            "ex-a1-don-6",
            "انطق جملة توضح قرب المتحف من المحطة",
            ["speaking", "pronunciation"], 2,
            "أخبر السائل بأن المتحف قريب من المحطة بنطق صحيح",
            "El museo está cerca de la estación.",
            "المتحف يقع قريباً من المحطة.",
            "pending/a1_museo_cerca_estacion.mp3",
            ["museo", "cerca", "estación"],
            "El museo está cerca de la estación.",
            "انتبه لنطق حرف c كـ ثاء في cerca في إسبانيا، ونطق s في أمريكا اللاتينية."
        )
    ]
    return lesson_doc(doc, exs)

def make_lesson_direcciones():
    slug = "a1-direcciones"
    doc = {
        "slug": slug,
        "unitSlug": "a1-u8-places",
        "levelCode": "A1",
        "titleAr": "إعطاء الاتجاهات: الوصف خطوة بخطوة في الشارع",
        "titleEs": "Dar y pedir direcciones",
        "subtitleAr": "توجيه المارة: todo recto و a la derecha و a la izquierda",
        "order": 3,
        "estimatedMinutes": 18,
        "cefrLevel": "A1",
        "review": review_block(),

        "pedagogy": {
            "learningObjectivesAr": [
                "أن يفهم المتعلم ويعطي اتجاهات سير واضحة من خطوتين أو ثلاث.",
                "أن يستخدم عبارات الاتجاه: todo recto (للأمام مباشرة)، a la derecha (إلى اليمين)، a la izquierda (إلى اليسار).",
                "أن يوظف أفعال الحركة الأساسية: girar (يلف / ينعطف) و cruzar (يعبر الشارع)."
            ],
            "grammarPoints": [
                {
                    "titleAr": "حرف الجر a مع الاتجاهات وأفعال التوجيه",
                    "explanationAr": "عند تحديد الاتجاه، نستخدم حرف الجر a دائماً: a la derecha (يميناً)، a la izquierda (يساراً)، بينما للأمام مباشرة نقول: todo recto (بدون حرف جر). لإعطاء التوجيهات لشخص، نستخدم المضارع بصيغة tú: sigues todo recto (تكمل طوالك)، giras a la derecha (تلف يميناً)، cruzas la calle (تعبر الشارع)، tomas la primera/segunda calle (تأخذ الشارع الأول/الثاني)."
                }
            ],
            "commonMistakesAr": [
                "استخدام en بدلاً من a مع اليمين واليسار (مثل *en la derecha* بدلاً من a la derecha).",
                "الخلط بين derecho (مستقيم / مذكر) و derecha (يمين): todo recto تعني مستقيماً للأمام، بينما a la derecha تعني إلى اليمين."
            ],
            "dialectNotes": [
                {
                    "region": "EG",
                    "noteAr": "في مصر نقول: «امشِ على طول، وبعدين خش يمين، وعدّي الشارع». في الإسبانية: Sigue todo recto, luego gira a la derecha y cruza la calle."
                }
            ],
            "culturalNoteAr": "الإسبان مشهورون بكرمهم في إرشاد الغرباء في الشارع، وكثيراً ما يشيرون بأيديهم بحماس لمساعدتك على الوصول بدقة."
        },
        "contentBlocks": [
            {
                "id": f"cb-{slug}-intro",
                "type": "explanation",
                "titleAr": "تعبيرات الاتجاه والسير",
                "bodyAr": "العبارات الأساسية لإعطاء الاتجاهات في المدينة:\n- **todo recto**: للأمام مباشرة / على طول\n- **a la derecha**: إلى اليمين / ع اليمين\n- **a la izquierda**: إلى اليسار / ع الشمال\n- **girar**: يلف / ينعطف (giras a la derecha)\n- **cruzar**: يعبر (cruzas la calle)\n- **la primera / la segunda**: الأولى / الثانية (tomas la primera calle)",
                "examples": [
                    {"es": "Vas todo recto hasta la plaza.", "ar": "تمشي على طول حتى تصل إلى الميدان."},
                    {"es": "Giras a la derecha en la segunda calle.", "ar": "تنعطف يميناً في الشارع الثاني."},
                    {"es": "Cruzas la calle y allí está el banco.", "ar": "تعبر الشارع وهناك تجد البنك."}
                ]
            }
        ],
        "newVocabulary": [
            {"headword": "derecha", "meaningAr": "يمين", "partOfSpeech": "noun", "gender": "feminine"},
            {"headword": "izquierda", "meaningAr": "يسار", "partOfSpeech": "noun", "gender": "feminine"},
            {"headword": "recto", "meaningAr": "مستقيم / للأمام مباشرة", "partOfSpeech": "adverb"},
            {"headword": "girar", "meaningAr": "ينعطف / يلف", "partOfSpeech": "verb"},
            {"headword": "cruzar", "meaningAr": "يعبر (الشارع أو الميدان)", "partOfSpeech": "verb"},
            {"headword": "primera", "meaningAr": "الأولى", "partOfSpeech": "adjective"},
            {"headword": "segunda", "meaningAr": "الثانية", "partOfSpeech": "adjective"}
        ],
        "reviewVocabulary": [
            {"headword": "calle", "meaningAr": "شارع"},
            {"headword": "plaza", "meaningAr": "ميدان"}
        ]
    }

    exs = [
        choice_ex(
            "ex-a1-dir-1", "word_choice",
            "اختر التعبير الصحيح للمشي للأمام مباشرة",
            ["vocabulary", "reading"], 1,
            "كيف تقول لشخص 'امشِ على طول للأمام مباشرة'؟",
            "Para ir al museo, sigues _____.",
            "للذهاب إلى المتحف، تكمل ...",
            [
                opt("o1", "todo recto", "للأمام مباشرة", True),
                opt("o2", "a la izquierda", "إلى اليسار", False, "a la izquierda تعني إلى اليسار وليس للأمام."),
                opt("o3", "segunda", "الثانية", False, "segunda صفة تعني الثانية وليست اتجاهاً مستقلاً.")
            ],
            ["recto", "izquierda", "segunda"],
            "تعبير todo recto يعني السير مباشرة إلى الأمام دون انعطاف."
        ),
        choice_ex(
            "ex-a1-dir-2", "word_choice",
            "اختر حرف الجر الصحيح مع اليمين واليسار",
            ["grammar"], 1,
            "ما هو حرف الجر الذي يأتي مع derecha و izquierda؟",
            "En la esquina, giras _____ la derecha.",
            "عند الزاوية، تنعطف ... اليمين.",
            [
                opt("o1", "a", "حرف الجر المناسب للاتجاه", True),
                opt("o2", "en", "حرف جر للمكان الثابت", False, "مع الانعطاف والاتجاهات نستخدم a وليس en."),
                opt("o3", "de", "حرف جر للملكية أو المنشأ", False, "de لا تستخدم هنا، التعبير هو girar a la derecha.")
            ],
            ["derecha", "girar"],
            "نستخدم دائماً حرف الجر a مع الاتجاهات: a la derecha و a la izquierda."
        ),
        fill_ex(
            "ex-a1-dir-3",
            "اكتب الفعل المناسب لعبور الشارع",
            ["vocabulary", "writing"], 2,
            "اكتب الفعل الإسباني بصيغة tú الذي يعني 'تعبر الشارع'",
            "Luego _____ la calle con cuidado.",
            "ثم تعبر الشارع بحذر.",
            ["cruzar"],
            ["cruzas"],
            "تصريف الفعل cruzar مع tú في المضارع هو cruzas."
        ),
        order_ex(
            "ex-a1-dir-4",
            "رتّب الجملة لتوجيه الشخص لأخذ الشارع الأول يميناً",
            ["grammar", "writing"], 2,
            ["Tomas", "la", "primera", "calle", "a", "la", "derecha"],
            "Tomas la primera calle a la derecha",
            "الترتيب الصحيح: الفعل Tomas ثم المفعول به la primera calle ثم الاتجاه a la derecha.",
            ["primera", "calle", "derecha"]
        ),
        choice_ex(
            "ex-a1-dir-5", "listen_choose",
            "استمع واختر الاتجاه المحدد في التسجيل",
            ["listening", "vocabulary"], 2,
            "استمع للتوجيه الصوتي وحدد الاتجاه المطلوب",
            "Giras a la izquierda en la plaza.",
            "تنعطف إلى اليسار في الميدان.",
            [
                opt("o1", "izquierda", "يسار", True),
                opt("o2", "derecha", "يمين", False, "المتحدث قال a la izquierda (يسار) وليس derecha."),
                opt("o3", "recto", "على طول", False, "المتحدث طلب الانعطاف يساراً وليس المشي للأمام.")
            ],
            ["izquierda", "derecha", "recto", "plaza"],
            "المتحدث يوجه السائل نحو اليسار بقوله: a la izquierda.",
            audioKey="pending/a1_giras_izquierda.mp3",
            speechEs="Giras a la izquierda en la plaza."
        ),
        speak_ex(
            "ex-a1-dir-6",
            "انطق التوجيه بوضوح لإرشاد زميلك",
            ["speaking", "pronunciation"], 2,
            "انطق جملة التوجيه باللغة الإسبانية بلهجة طبيعية",
            "Tomas la segunda calle a la izquierda.",
            "تأخذ الشارع الثاني إلى اليسار.",
            "pending/a1_segunda_calle_izq.mp3",
            ["segunda", "calle", "izquierda"],
            "Tomas la segunda calle a la izquierda.",
            "انتبه لنطق z في izquierda كـ ثاء في إسبانيا."
        )
    ]
    return lesson_doc(doc, exs)

def make_lesson_transporte():
    slug = "a1-transporte"
    doc = {
        "slug": slug,
        "unitSlug": "a1-u8-places",
        "levelCode": "A1",
        "titleAr": "المواصلات والتنقل: السؤال عن الوسيلة وشراء تذكرة",
        "titleEs": "Los transportes y el billete",
        "subtitleAr": "استخدام ir en مع وسائل النقل وشراء تذكرة مترو أو حافلة",
        "order": 4,
        "estimatedMinutes": 18,
        "cefrLevel": "A1",
        "review": review_block(),

        "pedagogy": {
            "learningObjectivesAr": [
                "أن يسمّي وسائل المواصلات الشائعة: metro, autobús, taxi, tren.",
                "أن يستخدم حرف الجر en مع وسائل النقل (ir en metro) وحرف الجر a مع المشي (ir a pie).",
                "أن يشتري تذكرة (un billete) ويسأل عن موقف الحافلة (la parada)."
            ],
            "grammarPoints": [
                {
                    "titleAr": "حرف الجر en مع وسائل النقل و a pie",
                    "explanationAr": "في الإسبانية، نستخدم دائماً حرف الجر en مع جميع وسائل النقل الآلية: Voy en metro (أذهب بالمترو)، Vamos en autobús (نذهب بالحافلة)، Viaja en tren (يسافر بالقطار)، en taxi (بالتاكسي). الاستثناء الأساسي الوحيد هو السير على الأقدام حيث نستخدم حرف الجر a: Voy a pie (أذهب مشياً على الأقدام). عند شراء التذكرة نقول: Quería un billete para... (أريد تذكرة لـ...)."
                }
            ],
            "commonMistakesAr": [
                "استخدام con أو por بدلاً من en لوسائل النقل (مثل القول *voy con metro* تأثراً بالعربية 'بالمترو'؛ الصواب: voy en metro).",
                "قول *voy en pie* بدلاً من التعبير الثابت voy a pie."
            ],
            "dialectNotes": [
                {
                    "region": "EG",
                    "noteAr": "في مصر نقول: «أنا رايح بالمترو أو بالأوتوبيس، أو على رجليّ». في الإسبانية: Voy en metro / en autobús، أو voy a pie."
                }
            ],
            "culturalNoteAr": "في إسبانيا يُطلق على تذكرة المترو والقطار billete، بينما في معظم دول أمريكا اللاتينية (مثل المكسيك والأرجنتين) تُسمى boleto أو pasaje."
        },
        "contentBlocks": [
            {
                "id": f"cb-{slug}-intro",
                "type": "explanation",
                "titleAr": "وسائل النقل وشراء التذاكر",
                "bodyAr": "أهم وسائل النقل والمفردات المرتبطة بها:\n- **el metro**: المترو\n- **el autobús**: الحافلة / الأتوبيس\n- **el taxi**: التاكسي / سيارة الأجرة\n- **el tren**: القطار\n- **el billete**: التذكرة\n- **la parada**: الموقف (parada de autobús)\n- **el viaje**: الرحلة / السفر",
                "examples": [
                    {"es": "Voy al trabajo en metro.", "ar": "أذهب إلى العمل بالمترو."},
                    {"es": "¿Dónde está la parada de autobús?", "ar": "أين يقع موقف الحافلات؟"},
                    {"es": "Quería un billete de tren, por favor.", "ar": "أريد تذكرة قطار من فضلك."}
                ]
            }
        ],
        "newVocabulary": [
            {"headword": "metro", "meaningAr": "المترو", "partOfSpeech": "noun", "gender": "masculine"},
            {"headword": "autobús", "meaningAr": "حافلة / أتوبيس", "partOfSpeech": "noun", "gender": "masculine"},
            {"headword": "taxi", "meaningAr": "تاكسي / سيارة أجرة", "partOfSpeech": "noun", "gender": "masculine"},
            {"headword": "tren", "meaningAr": "قطار", "partOfSpeech": "noun", "gender": "masculine"},
            {"headword": "billete", "meaningAr": "تذكرة", "partOfSpeech": "noun", "gender": "masculine"},
            {"headword": "parada", "meaningAr": "موقف / محطة توقف", "partOfSpeech": "noun", "gender": "feminine"},
            {"headword": "viaje", "meaningAr": "رحلة / سفر", "partOfSpeech": "noun", "gender": "masculine"}
        ],
        "reviewVocabulary": [
            {"headword": "estación", "meaningAr": "محطة"},
            {"headword": "centro", "meaningAr": "مركز / وسط المدينة"}
        ]
    }

    exs = [
        choice_ex(
            "ex-a1-tra-1", "word_choice",
            "اختر حرف الجر الصحيح لوسائل النقل",
            ["grammar"], 1,
            "ما هو حرف الجر المستخدم مع وسيلة النقل tren؟",
            "Viajo a Madrid _____ tren.",
            "أسافر إلى مدريد بالقطار.",
            [
                opt("o1", "en", "حرف الجر الصحيح لوسائل النقل", True),
                opt("o2", "con", "خطأ ترجمة حرفية من العربية", False, "في الإسبانية لا نستخدم con مع وسائل المواصلات بل en."),
                opt("o3", "de", "حرف جر للمنشأ أو المادة", False, "de لا تعبر عن الركوب والتنقل.")
            ],
            ["tren", "viaje"],
            "في الإسبانية نستخدم حرف الجر en مع وسائل المواصلات الآلية: en tren, en metro, en autobús."
        ),
        fill_ex(
            "ex-a1-tra-2",
            "اكتب الكلمة الإسبانية المناسبة للتذكرة",
            ["vocabulary", "writing"], 1,
            "اكتب كلمة 'تذكرة' بالإسبانية (في إسبانيا)",
            "Necesito comprar un _____ para el metro.",
            "أحتاج لشراء تذكرة للمترو.",
            ["billete"],
            ["billete"],
            "كلمة billete تعني تذكرة وهي مذكرة (un billete)."
        ),
        choice_ex(
            "ex-a1-tra-3", "word_choice",
            "اختر المصطلح المناسب لموقف الحافلة",
            ["vocabulary", "reading"], 2,
            "أين ينتظر الركاب وصول الأتوبيس؟",
            "Esperamos en la _____ de autobús.",
            "ننتظر في موقف الأتوبيس.",
            [
                opt("o1", "parada", "موقف / نقطة توقف", True),
                opt("o2", "estación", "محطة رئيسية كبيرة", False, "للحافلات في الشوارع نستخدم عادة لفظ parada."),
                opt("o3", "viaje", "رحلة", False, "viaje تعني الرحلة نفسها وليس مكان الانتظار.")
            ],
            ["parada", "autobús", "estación", "viaje"],
            "موقف الحافلات في الشارع يسمى la parada de autobús."
        ),
        order_ex(
            "ex-a1-tra-4",
            "رتّب الجملة لطلب تذكرة إلى وسط المدينة بأدب",
            ["grammar", "writing"], 2,
            ["Quiero", "un", "billete", "para", "el", "metro"],
            "Quiero un billete para el metro",
            "الترتيب الصحيح: Quiero (أريد) ثم un billete (تذكرة) ثم para el metro (للمترو).",
            ["billete", "metro"]
        ),
        choice_ex(
            "ex-a1-tra-5", "listen_choose",
            "استمع واختر وسيلة النقل المذكورة",
            ["listening", "vocabulary"], 2,
            "استمع للتسجيل وحدد وسيلة المواصلات المستخدمة",
            "Prefiero ir en taxi porque es rápido.",
            "أفضل الذهاب بالتاكسي لأنه سريع.",
            [
                opt("o1", "taxi", "تاكسي", True),
                opt("o2", "metro", "مترو", False, "المتحدث قال taxi وليس metro."),
                opt("o3", "tren", "قطار", False, "المتحدث قال taxi وليس tren.")
            ],
            ["taxi", "metro", "tren"],
            "المتحدث ذكر ركوب التاكسي: en taxi.",
            audioKey="pending/a1_ir_en_taxi.mp3",
            speechEs="Prefiero ir en taxi porque es rápido."
        ),
        speak_ex(
            "ex-a1-tra-6",
            "انطق رغبتك في الذهاب إلى المحطة بالمترو",
            ["speaking", "pronunciation"], 2,
            "انطق الجملة موضحاً الذهاب بالمترو بطلاقة",
            "Voy a la estación en metro.",
            "أنا ذاهب إلى المحطة بالمترو.",
            "pending/a1_estacion_en_metro.mp3",
            ["estación", "metro"],
            "Voy a la estación en metro.",
            "تأكد من وصل الأصوات بشكل طبيعي: Voy a la estación en metro."
        )
    ]
    return lesson_doc(doc, exs)

# ==============================================================================
# UNIT 9: a1-u9-work-study (العمل والدراسة)
# ==============================================================================

def make_lesson_profesiones():
    slug = "a1-profesiones"
    doc = {
        "slug": slug,
        "unitSlug": "a1-u9-work-study",
        "levelCode": "A1",
        "titleAr": "المهن والوظائف: التذكير والتأنيث والتعبير عن العمل بـ Ser و Trabajar de",
        "titleEs": "Las profesiones: ser y trabajar de",
        "subtitleAr": "تسمية المهن وقاعدة حذف أداة النكرة بعد Ser والفرق مع trabajar de",
        "order": 1,
        "estimatedMinutes": 18,
        "cefrLevel": "A1",
        "review": review_block(),

        "pedagogy": {
            "learningObjectivesAr": [
                "أن يسمّي المتعلم المهن الشائعة ويميز صيغ المذكر والمؤنث فيها.",
                "أن يطبق القاعدة النحوية الأساسية: عدم استخدام أداة نكرة مع Ser والمهن (Soy médico).",
                "أن يميز بين Ser + profesión (المهنة الأساسية/الهوية) و Trabajar de + profesión (العمل الحالي أو المؤقت)."
            ],
            "grammarPoints": [
                {
                    "titleAr": "حذف أداة النكرة مع المهن وتأنيثها",
                    "explanationAr": "عند ذكر مهنتك مع فعل الكينونة Ser، لا تضع أداة نكرة إطلاقاً: نقول Soy profesor (أنا معلم) ولا نقول أبداً *Soy un profesor* كما في الإنجليزية. تأنيث المهن: المنتهي بـ o يتحول إلى a (médico -> médica)، المنتهي بساكن يضاف له a (profesor -> profesora)، والمنتهي بـ -ista لا يتغير شكله (el periodista / la periodista). للتعبير عن وظيفة مؤقتة أو دور حالي نستخدم trabajar de: Trabajo de camarero (أعمل كنادل)."
                }
            ],
            "commonMistakesAr": [
                "وضع أداة نكرة بعد Ser مع المهن (مثل *Soy un ingeniero* بتأثير اللغات الأخرى؛ الصواب: Soy ingeniero).",
                "تغيير نهاية المهن المنتهية بـ -ista في المؤنث (مثل كتابة *periodisto* للرجل؛ الصواب: el periodista / la periodista)."
            ],
            "dialectNotes": [
                {
                    "region": "EG",
                    "noteAr": "في مصر نقول: «أنا دكتور / شغال جرسون». في الإسبانية تماماً بنفس الطريقة دون أي أداة: Soy médico / Trabajo de camarero."
                }
            ],
            "culturalNoteAr": "عند التعارف المهني في إسبانيا، السؤال الشائع عن العمل هو: «¿A qué te dedicas?» (ما هو مجالك / ماذا تعمل؟) وتكون الإجابة مباشرة بالمهنة دون أداة."
        },
        "contentBlocks": [
            {
                "id": f"cb-{slug}-intro",
                "type": "explanation",
                "titleAr": "المهن والتذكير والتأنيث",
                "bodyAr": "أهم المهن في المستوى المبتدئ وطريقة صياغتها:\n- **el profesor / la profesora**: المعلم / المعلمة\n- **el médico / la médica**: الطبيب / الطبيبة\n- **el ingeniero / la ingeniera**: المهندس / المهندسة\n- **el enfermero / la enfermera**: الممرض / الممرضة\n- **el/la periodista**: الصحفي / الصحفية (اللاحقة -ista ثابتة للجنسين)\n- **el camarero / la camarera**: النادل / النادلة\n- **el trabajo**: العمل\n- **la profesión**: المهنة",
                "examples": [
                    {"es": "Soy ingeniera en una empresa.", "ar": "أنا مهندسة في شركة."},
                    {"es": "Mi hermano trabaja de camarero.", "ar": "أخي يعمل كنادل."},
                    {"es": "Laura es periodista famosa.", "ar": "لاورا صحفية مشهورة."}
                ]
            }
        ],
        "newVocabulary": [
            {"headword": "profesor", "meaningAr": "معلم / أستاذ", "partOfSpeech": "noun", "gender": "masculine"},
            {"headword": "médico", "meaningAr": "طبيب", "partOfSpeech": "noun", "gender": "masculine"},
            {"headword": "ingeniero", "meaningAr": "مهندس", "partOfSpeech": "noun", "gender": "masculine"},
            {"headword": "enfermero", "meaningAr": "ممرض", "partOfSpeech": "noun", "gender": "masculine"},
            {"headword": "periodista", "meaningAr": "صحفي / صحفية", "partOfSpeech": "noun"},
            {"headword": "camarero", "meaningAr": "نادل / جرسون", "partOfSpeech": "noun", "gender": "masculine"},
            {"headword": "trabajo", "meaningAr": "عمل / وظيفة", "partOfSpeech": "noun", "gender": "masculine"},
            {"headword": "profesión", "meaningAr": "مهنة", "partOfSpeech": "noun", "gender": "feminine"}
        ],
        "reviewVocabulary": [
            {"headword": "hospital", "meaningAr": "مستشفى"}
        ]
    }

    exs = [
        choice_ex(
            "ex-a1-prof-1", "word_choice",
            "اختر الصياغة النحوية الصحيحة للمهنة مع Ser",
            ["grammar"], 1,
            "كيف يقول الطبيب عن نفسه بالإسبانية بشكل صحيح؟",
            "_____ en el hospital central.",
            "أنا طبيب في المستشفى المركزي.",
            [
                opt("o1", "Soy médico", "بدون أداة نكرة (الصواب)", True),
                opt("o2", "Soy un médico", "باستخدام أداة نكرة un", False, "في الإسبانية تحذف أداة النكرة مع المهن بعد Ser."),
                opt("o3", "Estoy médico", "استخدام estar بدلاً من ser", False, "المهن تعبر عن الهوية وتأخذ الفعل Ser وليس Estar.")
            ],
            ["médico", "hospital"],
            "القاعدة الذهبية: مع Ser والمهن لا نضع أداة نكرة (Soy médico وليس Soy un médico)."
        ),
        fill_ex(
            "ex-a1-prof-2",
            "اكتب مؤنث مهنة التعليم",
            ["grammar", "writing"], 1,
            "ما هو مؤنث كلمة profesor؟",
            "María es una gran _____ de español.",
            "ماريا معلمة رائعة للغة الإسبانية.",
            ["profesor"],
            ["profesora"],
            "المهن المنتهية بساكن مثل profesor تؤنث بإضافة a فتصبح profesora."
        ),
        choice_ex(
            "ex-a1-prof-3", "word_choice",
            "اختر الكلمة المناسبة لمهنة الصحافة",
            ["vocabulary", "reading"], 2,
            "المهنة التي تنتهي بـ -ista ولا يتغير شكلها بين المذكر والمؤنث هي:",
            "Carlos trabaja como _____ de noticias.",
            "كارلوس يعمل كـ ... أخبار.",
            [
                opt("o1", "periodista", "صحفي (شكل ثابت)", True),
                opt("o2", "camarero", "نادل", False, "camarero يتغير في المؤنث إلى camarera."),
                opt("o3", "enfermero", "ممرض", False, "enfermero يتغير في المؤنث إلى enfermera.")
            ],
            ["periodista", "camarero", "enfermero"],
            "المهن المنتهية بـ -ista مثل periodista تبقى ثابتة للمذكر والمؤنث."
        ),
        order_ex(
            "ex-a1-prof-4",
            "رتّب الجملة للتعبير عن العمل كنادل في مقهى",
            ["grammar", "writing"], 2,
            ["Mi", "hermano", "trabaja", "de", "camarero"],
            "Mi hermano trabaja de camarero",
            "الترتيب الصحيح: الفاعل Mi hermano ثم الفعل trabaja ثم حرف الجر de والمهنة camarero.",
            ["camarero", "trabajo"]
        ),
        choice_ex(
            "ex-a1-prof-5", "listen_choose",
            "استمع واختر مهنة المتحدث",
            ["listening", "vocabulary"], 2,
            "استمع للتسجيل وحدد مهنة الشخص",
            "Soy ingeniero y trabajo en una empresa.",
            "أنا مهندس وأعمل في شركة.",
            [
                opt("o1", "ingeniero", "مهندس", True),
                opt("o2", "profesor", "معلم", False, "المتحدث قال ingeniero وليس profesor."),
                opt("o3", "médico", "طبيب", False, "المتحدث قال ingeniero وليس médico.")
            ],
            ["ingeniero", "profesor", "médico"],
            "المتحدث صرح بوضوح: Soy ingeniero.",
            audioKey="pending/a1_soy_ingeniero.mp3",
            speechEs="Soy ingeniero y trabajo en una empresa."
        ),
        speak_ex(
            "ex-a1-prof-6",
            "انطق جملة تعبر فيها عن مهنتك",
            ["speaking", "pronunciation"], 2,
            "انطق جملة تعريفك بمهنتك باللغة الإسبانية بطلاقة",
            "Soy enfermero en este hospital.",
            "أنا ممرض في هذا المستشفى.",
            "pending/a1_soy_enfermero.mp3",
            ["enfermero", "hospital"],
            "Soy enfermero en este hospital.",
            "تذكر عدم وضع أداة نكرة بين Soy و enfermero."
        )
    ]
    return lesson_doc(doc, exs)

def make_lesson_estudiar():
    slug = "a1-estudiar"
    doc = {
        "slug": slug,
        "unitSlug": "a1-u9-work-study",
        "levelCode": "A1",
        "titleAr": "الدراسة والمواد الأكاديمية: استخدام Estudiar والمجالات الدراسية",
        "titleEs": "Los estudios y las asignaturas",
        "subtitleAr": "تصريف الفعل estudiar والحديث عن الجامعة والمدرسة والكورسات",
        "order": 2,
        "estimatedMinutes": 18,
        "cefrLevel": "A1",
        "review": review_block(),

        "pedagogy": {
            "learningObjectivesAr": [
                "أن يصرف المتعلم الفعل القياسي estudiar في الحاضر بطلاقة مع جميع الضمائر.",
                "أن يسمّي أماكن ومستويات التعليم: universidad, escuela, clase, curso.",
                "أن يتحدث عن تعلم اللغات والمجالات المختلفة مستخدماً estudiar و aprender."
            ],
            "grammarPoints": [
                {
                    "titleAr": "تصريف estudiar في الحاضر والفرق بينه وبين aprender",
                    "explanationAr": "الفعل estudiar فعل قياسي ينتهي بـ -ar: estudio (أنا), estudias (أنت), estudia (هو/هي), estudiamos (نحن), estudiáis (أنتم), estudian (هم). الفرق الدقيق: estudiar يعني يبذل جهداً في المذاكرة أو يلتحق بتخصص، بينما aprender يعني يكتسب المعرفة أو يتعلم مهارة (Aprender español = يتعلم الإسبانية)."
                }
            ],
            "commonMistakesAr": [
                "نسيان تصريف الفعل مع الضمير المناسب واستخدام المصدر (مثل قول *yo estudiar* بدلاً من yo estudio).",
                "الخلط بين clase (الحصة أو قاعة الدرس) و curso (الدورة التعليمية الكاملة أو العام الدراسي)."
            ],
            "dialectNotes": [
                {
                    "region": "EG",
                    "noteAr": "في مصر نقول: «أنا بدرس إسباني في الجامعة / واخد كورس». في الإسبانية: Estudio español en la universidad / Hago un curso."
                }
            ],
            "culturalNoteAr": "في إسبانيا وأمريكا اللاتينية، من المعتاد جداً أن يواصل البالغون الدراسة وتعلم اللغات المسائية في escuelas oficiales de idiomas (المدارس الرسمية للغات)."
        },
        "contentBlocks": [
            {
                "id": f"cb-{slug}-intro",
                "type": "explanation",
                "titleAr": "عالم الدراسة والتعليم",
                "bodyAr": "المفردات الأكاديمية والتعليمية الأساسية:\n- **estudiar**: يدرس / يذاكر\n- **aprender**: يتعلم\n- **la lengua**: اللغة\n- **la universidad**: الجامعة\n- **la escuela**: المدرسة\n- **la clase**: الفصل / الحصة الدراسية\n- **el curso**: الدورة التدريبية / الكورس\n- **el estudiante / la estudiante**: الطالب / الطالبة",
                "examples": [
                    {"es": "Estudio lengua española en la universidad.", "ar": "أدرس اللغة الإسبانية في الجامعة."},
                    {"es": "Queremos aprender idiomas nuevos.", "ar": "نريد أن نتعلم لغات جديدة."},
                    {"es": "La clase empieza a las nueve.", "ar": "تبدأ الحصة في تمام التاسعة."}
                ]
            }
        ],
        "newVocabulary": [
            {"headword": "estudiar", "meaningAr": "يدرس / يذاكر", "partOfSpeech": "verb"},
            {"headword": "aprender", "meaningAr": "يتعلم", "partOfSpeech": "verb"},
            {"headword": "lengua", "meaningAr": "لغة / لسان", "partOfSpeech": "noun", "gender": "feminine"},
            {"headword": "universidad", "meaningAr": "جامعة", "partOfSpeech": "noun", "gender": "feminine"},
            {"headword": "escuela", "meaningAr": "مدرسة", "partOfSpeech": "noun", "gender": "feminine"},
            {"headword": "clase", "meaningAr": "فصل / حصة دراسية", "partOfSpeech": "noun", "gender": "feminine"},
            {"headword": "curso", "meaningAr": "دورة تدريبية / كورس", "partOfSpeech": "noun", "gender": "masculine"},
            {"headword": "estudiante", "meaningAr": "طالب / طالبة", "partOfSpeech": "noun"}
        ],
        "reviewVocabulary": [
            {"headword": "profesor", "meaningAr": "معلم / أستاذ"}
        ]
    }

    exs = [
        choice_ex(
            "ex-a1-est-1", "word_choice",
            "اختر التصريف الصحيح للفعل estudiar مع yo",
            ["grammar"], 1,
            "ما هو تصريف estudiar مع ضمير المتكلم المفرد yo؟",
            "Yo _____ español todos los días.",
            "أنا أدرس الإسبانية كل يوم.",
            [
                opt("o1", "estudio", "تصريف المضارع مع yo", True),
                opt("o2", "estudia", "تصريف المضارع مع él/ella", False, "estudia للغائب المفرد، بينما المتكلم ينتهي بـ o: estudio."),
                opt("o3", "estudiamos", "تصريف المضارع مع nosotros", False, "estudiamos للمتكلم الجمع (نحن).")
            ],
            ["estudiar"],
            "أفعال المجموعة الأولى المنتهية بـ -ar تأخذ اللاحقة -o مع yo: estudio."
        ),
        fill_ex(
            "ex-a1-est-2",
            "اكتب الكلمة الإسبانية المناسبة للجامعة",
            ["vocabulary", "writing"], 1,
            "اكتب كلمة 'الجامعة' بالإسبانية بدقة",
            "Mi hermana estudia medicina en la _____.",
            "أختي تدرس الطب في الجامعة.",
            ["universidad"],
            ["universidad"],
            "كلمة universidad مؤنثة وتعني الجامعة (la universidad)."
        ),
        choice_ex(
            "ex-a1-est-3", "word_choice",
            "اختر الفعل الذي يعبر عن اكتساب المعرفة",
            ["vocabulary", "reading"], 2,
            "أي فعل يعني 'يتعلم' مهارة أو لغة جديدة؟",
            "Me gusta _____ cosas nuevas en el curso.",
            "يعجبني أن أتعلم أشياء جديدة في الدورة.",
            [
                opt("o1", "aprender", "يتعلم", True),
                opt("o2", "escuela", "مدرسة (اسم)", False, "escuela اسم مكان وليس فعلاً."),
                opt("o3", "clase", "حصة (اسم)", False, "clase اسم وليس فعلاً.")
            ],
            ["aprender", "curso", "escuela", "clase"],
            "الفعل aprender يعني يتعلم ويكتسب المعرفة."
        ),
        order_ex(
            "ex-a1-est-4",
            "رتّب الجملة للتعبير عن دراسة اللغة في المدرسة",
            ["grammar", "writing"], 2,
            ["Los", "estudiantes", "estudian", "en", "la", "escuela"],
            "Los estudiantes estudian en la escuela",
            "الترتيب الصحيح: الفاعل Los estudiantes ثم الفعل estudian ثم شبه الجملة en la escuela.",
            ["estudiante", "estudiar", "escuela"]
        ),
        choice_ex(
            "ex-a1-est-5", "listen_choose",
            "استمع وحدد ما يفعله المتحدث",
            ["listening", "vocabulary"], 2,
            "استمع للتسجيل وحدد النشاط المذكور",
            "Tengo una clase de lengua esta tarde.",
            "لدي حصة لغة بعد ظهر اليوم.",
            [
                opt("o1", "clase", "حصة دراسية", True),
                opt("o2", "universidad", "جامعة", False, "المتحدث قال clase de lengua وليس universidad."),
                opt("o3", "profesor", "معلم", False, "المتحدث تحدث عن الحصة وليس الأستاذ.")
            ],
            ["clase", "lengua", "universidad", "profesor"],
            "المتحدث قال: Tengo una clase de lengua.",
            audioKey="pending/a1_clase_lengua.mp3",
            speechEs="Tengo una clase de lengua esta tarde."
        ),
        speak_ex(
            "ex-a1-est-6",
            "انطق رغبتك في دراسة لغة جديدة",
            ["speaking", "pronunciation"], 2,
            "انطق الجملة موضحاً دراسة الإسبانية في دورة تدريبية",
            "Hago un curso para aprender español.",
            "أحضر دورة تدريبية لتعلم الإسبانية.",
            "pending/a1_curso_aprender.mp3",
            ["curso", "aprender"],
            "Hago un curso para aprender español.",
            "احرص على نطق حرف r بوضوح في curso و aprender."
        )
    ]
    return lesson_doc(doc, exs)

def make_lesson_horario_trabajo():
    slug = "a1-horario-trabajo"
    doc = {
        "slug": slug,
        "unitSlug": "a1-u9-work-study",
        "levelCode": "A1",
        "titleAr": "الوقت في العمل: ساعات الدوام والروتين المهني",
        "titleEs": "El horario de trabajo",
        "subtitleAr": "التعبير عن فترات الدوام بـ de... a... و desde... hasta... ويوم العمل",
        "order": 3,
        "estimatedMinutes": 18,
        "cefrLevel": "A1",
        "review": review_block(),

        "pedagogy": {
            "learningObjectivesAr": [
                "أن يحدد ساعات دوامه اليومي باستخدام de... a... أو desde las... hasta las....",
                "أن يستخدم مفردات بيئة العمل: oficina, jornada, descanso, horario.",
                "أن يميز بين الوصول مبكراً (temprano) والتأخر (tarde) في العمل."
            ],
            "grammarPoints": [
                {
                    "titleAr": "التعبير عن الفترات الزمنية: de/a مقابل desde/hasta",
                    "explanationAr": "للتعبير عن بداية ونهاية فترة زمنية نستخدم صيغتين دقيقتين:\n1. de + ساعة + a + ساعة (بدون أداة تعريف): Trabajo de 9 a 5 (أعمل من التاسعة إلى الخامسة).\n2. desde las + ساعة + hasta las + ساعة (مع أداة التعريف إجبارياً): Trabajo desde las 9 hasta las 5.\nلا تخلط بين الصيغتين (تجنب *de las 9 a las 5* أو *desde 9 hasta 5*)."
                }
            ],
            "commonMistakesAr": [
                "الخلط بين التركيبين بوضع أداة مع de أو حذفها مع desde (مثل *de las 9 a 5*).",
                "الخلط بين tarde كظرف يعني 'متأخراً' و la tarde كاسم يعني 'فترة بعد الظهر'."
            ],
            "dialectNotes": [
                {
                    "region": "EG",
                    "noteAr": "في مصر نقول: «مواعيدي من تسعة لخمسة، وعندي استراحة ساعة». في الإسبانية: Mi horario es de nueve a cinco, y tengo un descanso de una hora."
                }
            ],
            "culturalNoteAr": "ساعات العمل في إسبانيا تنقسم تقليدياً إلى نوعين: jornada continua (دوام مستمر من 8 إلى 3) أو jornada partida (دوام مقسم يتخلله استراحة غداء طويلة)."
        },
        "contentBlocks": [
            {
                "id": f"cb-{slug}-intro",
                "type": "explanation",
                "titleAr": "ساعات العمل والمواعيد",
                "bodyAr": "الكلمات والتعبيرات الأساسية لجدول الدوام:\n- **el horario**: جدول المواعيد / الدوام\n- **la oficina**: المكتب / مقر العمل\n- **desde ... hasta ...**: من ... حتى ... (مع las للساعات)\n- **la jornada**: يوم العمل / نوبة الدوام\n- **el descanso**: الاستراحة / البريك\n- **temprano**: مبكراً\n- **tarde**: متأخراً",
                "examples": [
                    {"es": "Trabajo en una oficina moderna.", "ar": "أعمل في مكتب حديث."},
                    {"es": "Mi horario es desde las ocho hasta las cuatro.", "ar": "دوامي من الساعة الثامنة حتى الرابعة."},
                    {"es": "Llego temprano al trabajo.", "ar": "أصل مبكراً إلى العمل."}
                ]
            }
        ],
        "newVocabulary": [
            {"headword": "horario", "meaningAr": "جدول المواعيد / أوقات الدوام", "partOfSpeech": "noun", "gender": "masculine"},
            {"headword": "oficina", "meaningAr": "مكتب / مقر العمل", "partOfSpeech": "noun", "gender": "feminine"},
            {"headword": "desde", "meaningAr": "من (نقطة بداية زمنية)", "partOfSpeech": "preposition"},
            {"headword": "hasta", "meaningAr": "حتى (نقطة نهاية زمنية)", "partOfSpeech": "preposition"},
            {"headword": "jornada", "meaningAr": "يوم عمل / نوبة دوام", "partOfSpeech": "noun", "gender": "feminine"},
            {"headword": "descanso", "meaningAr": "استراحة / راحة", "partOfSpeech": "noun", "gender": "masculine"},
            {"headword": "temprano", "meaningAr": "مبكراً", "partOfSpeech": "adverb"},
            {"headword": "tarde", "meaningAr": "متأخراً / وقت بعد الظهر", "partOfSpeech": "adverb"}
        ],
        "reviewVocabulary": [
            {"headword": "trabajo", "meaningAr": "عمل / وظيفة"}
        ]
    }

    exs = [
        choice_ex(
            "ex-a1-hor-1", "word_choice",
            "اختر حرف الجر المكمل لـ desde عند تحديد نهاية الدوام",
            ["grammar"], 1,
            "ما هي الكلمة المقابلة لـ desde لتحديد نهاية الوقت؟",
            "Trabajo desde las nueve _____ las cinco.",
            "أعمل من الساعة التاسعة حتى الخامسة.",
            [
                opt("o1", "hasta", "حتى (تكملة desde)", True),
                opt("o2", "a", "تستخدم مع de وليس desde", False, "مع desde نستخدم hasta (desde... hasta...)."),
                opt("o3", "en", "في (للمكان أو الوقت المحدد)", False, "en لا تستخدم كنهاية لفترة زمنية مسبوقة بـ desde.")
            ],
            ["desde", "hasta", "horario"],
            "الصيغة الصحيحة دائماً هي: desde las... hasta las...."
        ),
        fill_ex(
            "ex-a1-hor-2",
            "اكتب الكلمة الإسبانية المناسبة لمقر العمل والمكتب",
            ["vocabulary", "writing"], 1,
            "اكتب كلمة 'المكتب' بالإسبانية",
            "Empiezo a trabajar en la _____ a las ocho.",
            "أبدأ العمل في المكتب عند الساعة الثامنة.",
            ["oficina"],
            ["oficina"],
            "كلمة oficina مؤنثة وتأخذ أداة التعريف la."
        ),
        choice_ex(
            "ex-a1-hor-3", "word_choice",
            "اختر الظرف المعبر عن الحضور قبل الموعد",
            ["vocabulary", "reading"], 2,
            "إذا وصلت قبل بدء الدوام بوقت كافٍ، فأنت تصل:",
            "Siempre llego _____ a la oficina.",
            "أصل دائماً ... إلى المكتب.",
            [
                opt("o1", "temprano", "مبكراً", True),
                opt("o2", "tarde", "متأخراً", False, "tarde تعني متأخراً وليس مبكراً."),
                opt("o3", "descanso", "استراحة (اسم)", False, "descanso اسم يعني استراحة ولا يصلح كظرف زمان هنا.")
            ],
            ["temprano", "tarde", "descanso", "oficina"],
            "كلمة temprano تعني مبكراً."
        ),
        order_ex(
            "ex-a1-hor-4",
            "رتّب الجملة لتوضيح ساعات جدول العمل",
            ["grammar", "writing"], 2,
            ["Mi", "horario", "es", "de", "ocho", "a", "cuatro"],
            "Mi horario es de ocho a cuatro",
            "الترتيب السليم: الفاعل Mi horario ثم الفعل es ثم صيغة الساعات المختصرة de ocho a cuatro.",
            ["horario"]
        ),
        choice_ex(
            "ex-a1-hor-5", "listen_choose",
            "استمع وحدد فترة الاستراحة في الدوام",
            ["listening", "vocabulary"], 2,
            "استمع لتسجيل الموظف وحدد ما يتحدث عنه في المنتصف",
            "A las dos tenemos un descanso para comer.",
            "في تمام الثانية لدينا استراحة لتناول الطعام.",
            [
                opt("o1", "descanso", "استراحة", True),
                opt("o2", "jornada", "يوم عمل", False, "المتحدث ذكر تحديداً descanso وليس jornada."),
                opt("o3", "oficina", "مكتب", False, "المتحدث ركز على فترة الاستراحة.")
            ],
            ["descanso", "jornada", "oficina"],
            "المتحدث قال: tenemos un descanso para comer.",
            audioKey="pending/a1_descanso_comer.mp3",
            speechEs="A las dos tenemos un descanso para comer."
        ),
        speak_ex(
            "ex-a1-hor-6",
            "انطق جملة ساعات عملك بوضوح",
            ["speaking", "pronunciation"], 2,
            "أخبر زميلك عن ساعات عملك من التاسعة حتى الخامسة",
            "Mi jornada de trabajo termina tarde hoy.",
            "يوم عملي ينتهي متأخراً اليوم.",
            "pending/a1_jornada_termina.mp3",
            ["jornada", "trabajo", "tarde"],
            "Mi jornada de trabajo termina tarde hoy.",
            "انتبه لنطق حرف j في jornada كـ خاء مرققة."
        )
    ]
    return lesson_doc(doc, exs)

def make_lesson_presentacion_profesional():
    slug = "a1-presentacion-profesional"
    doc = {
        "slug": slug,
        "unitSlug": "a1-u9-work-study",
        "levelCode": "A1",
        "titleAr": "تقديم نفسي في سياق مهني: دمج الاسم والمهنة واللغات ومكان العمل",
        "titleEs": "Presentación profesional",
        "subtitleAr": "صياغة نبذة مهنية متكاملة تجمع الوظيفة والشركة واللغات والخبرة",
        "order": 4,
        "estimatedMinutes": 18,
        "cefrLevel": "A1",
        "review": review_block(),

        "pedagogy": {
            "learningObjectivesAr": [
                "أن يقدم المتعلم نبذة مهنية موجزة ومتماسكة عن نفسه باللغة الإسبانية.",
                "أن يذكر شركته (empresa) ولغات عمله (idiomas) باستخدام hablo.",
                "أن يربط بين مهنته ومكان عمله وزملائه (compañeros)."
            ],
            "grammarPoints": [
                {
                    "titleAr": "التراكيب المهنية: Trabajo en + مكان / Trabajo de + دور",
                    "explanationAr": "لتقديم نفسك مهنياً ندمج عدة عناصر أساسية:\n- الاسم والمهنة: Me llamo Omar y soy ingeniero.\n- مكان العمل والشركة: Trabajo en una empresa internacional (استخدام حرف الجر en مع الشركات والمؤسسات).\n- اللغات: Hablo árabe, inglés y un poco de español (تصريف hablar مع yo: hablo).\n- الخبرة: Tengo dos años de experiencia."
                }
            ],
            "commonMistakesAr": [
                "استخدام a بدلاً من en مع الشركات ومقرات العمل (مثل *trabajo a una empresa* بدلاً من en una empresa).",
                "نسيان الربط بين الجمل بأدوات الربط البسيطة (y, además, pero) مما يجعل الكلام متقطعاً."
            ],
            "dialectNotes": [
                {
                    "region": "EG",
                    "noteAr": "في مصر نقول: «أنا فلان، مهندس وشغال في شركة اتصالات وبتكلم لغتين وعندي خبرة». في الإسبانية نفس التسلسل المهني بالضبط."
                }
            ],
            "culturalNoteAr": "في بيئة العمل الإسبانية، من الشائع استخدام صيغة tú والنداء بالاسم الأول بين الزملاء (los compañeros)، بينما تُحفظ usted للمقابلات الرسمية جداً والعملاء الجدد."
        },
        "contentBlocks": [
            {
                "id": f"cb-{slug}-intro",
                "type": "explanation",
                "titleAr": "التعريف المهني المتكامل",
                "bodyAr": "المفردات المفتاحية للتعريف عن نفسك في سياق عمل:\n- **la empresa**: الشركة / المؤسسة\n- **los idiomas**: اللغات\n- **hablo**: أتحدث (تصريف hablar مع yo)\n- **la experiencia**: الخبرة العملية\n- **el puesto**: المنصب / الوظيفة الشاغرة\n- **el compañero / la compañera**: الزميل / الزميلة",
                "examples": [
                    {"es": "Trabajo en una empresa tecnológica.", "ar": "أعمل في شركة تكنولوجية."},
                    {"es": "Hablo tres idiomas con fluidez.", "ar": "أتحدث ثلاث لغات بطلاقة."},
                    {"es": "Mis compañeros de trabajo son muy amables.", "ar": "زملائي في العمل لطفاء جداً."}
                ]
            }
        ],
        "newVocabulary": [
            {"headword": "empresa", "meaningAr": "شركة / مؤسسة", "partOfSpeech": "noun", "gender": "feminine"},
            {"headword": "idiomas", "meaningAr": "لغات", "partOfSpeech": "noun", "gender": "masculine"},
            {"headword": "hablo", "meaningAr": "أتحدث", "partOfSpeech": "verb"},
            {"headword": "experiencia", "meaningAr": "خبرة", "partOfSpeech": "noun", "gender": "feminine"},
            {"headword": "puesto", "meaningAr": "منصب / وظيفة", "partOfSpeech": "noun", "gender": "masculine"},
            {"headword": "compañero", "meaningAr": "زميل", "partOfSpeech": "noun", "gender": "masculine"}
        ],
        "reviewVocabulary": [
            {"headword": "profesor", "meaningAr": "معلم / أستاذ"},
            {"headword": "ingeniero", "meaningAr": "مهندس"},
            {"headword": "oficina", "meaningAr": "مكتب"}
        ]
    }

    exs = [
        choice_ex(
            "ex-a1-prep-1", "word_choice",
            "اختر حرف الجر المناسب للعمل في شركة",
            ["grammar"], 1,
            "ما هو حرف الجر الصحيح بعد trabajar عند ذكر مكان العمل أو الشركة؟",
            "Trabajo _____ una gran empresa internacional.",
            "أعمل في شركة دولية كبرى.",
            [
                opt("o1", "en", "حرف الجر للمكان والمؤسسات", True),
                opt("o2", "a", "حرف جر للاتجاه", False, "مع أماكن العمل والشركات نستخدم en وليس a."),
                opt("o3", "de", "حرف جر للمهنة المؤقتة", False, "de تأتي مع اسم المهنة (trabajo de camarero) وليس مع الشركة.")
            ],
            ["empresa"],
            "نستخدم دائماً حرف الجر en مع مقرات العمل والشركات: trabajar en una empresa."
        ),
        fill_ex(
            "ex-a1-prep-2",
            "اكتب تصريف فعل التحدث مع ضمير المتكلم",
            ["grammar", "writing"], 1,
            "اكتب كلمة 'أتحدث' بالإسبانية (تصريف hablar مع yo)",
            "Yo _____ español y árabe en el trabajo.",
            "أنا أتحدث الإسبانية والعربية في العمل.",
            ["hablo"],
            ["hablo"],
            "تصريف الفعل hablar مع yo هو hablo بحذف الـ -ar وإضافة -o."
        ),
        choice_ex(
            "ex-a1-prep-3", "word_choice",
            "اختر الكلمة المناسبة لسنوات الممارسة العملية",
            ["vocabulary", "reading"], 2,
            "ماذا تسمى المعرفة والمهارة المكتسبة عبر سنوات العمل؟",
            "Tengo cinco años de _____ profesional.",
            "لدي خمس سنوات من ... المهنية.",
            [
                opt("o1", "experiencia", "خبرة", True),
                opt("o2", "empresa", "شركة", False, "empresa تعني الشركة نفسها."),
                opt("o3", "idiomas", "لغات", False, "idiomas جمع لغة ولا تكمل معنى سنوات الممارسة هنا.")
            ],
            ["experiencia", "empresa", "idiomas"],
            "الخبرة المهنية تسمى experiencia profesional."
        ),
        order_ex(
            "ex-a1-prep-4",
            "رتّب الجملة لتقديم نفسك كمهندس في شركة",
            ["grammar", "writing"], 2,
            ["Soy", "ingeniero", "y", "trabajo", "en", "la", "oficina"],
            "Soy ingeniero y trabajo en la oficina",
            "الترتيب الصحيح: المهنة أولاً Soy ingeniero ثم أداة العطف y ثم الفعل والجار والمجرور trabajo en la oficina.",
            ["ingeniero", "oficina"]
        ),
        choice_ex(
            "ex-a1-prep-5", "listen_choose",
            "استمع وحدد ما يتحدث به الزميل",
            ["listening", "vocabulary"], 2,
            "استمع للتسجيل وحدد اللغات التي يذكرها المتحدث",
            "En mi puesto hablo dos idiomas cada día.",
            "في منصبي أتحدث لغتين كل يوم.",
            [
                opt("o1", "idiomas", "لغات", True),
                opt("o2", "oficina", "مكتب", False, "المتحدث ركز على التحدث باللغات."),
                opt("o3", "profesor", "معلم", False, "المتحدث لم يذكر كلمة profesor.")
            ],
            ["idiomas", "puesto", "oficina", "profesor"],
            "المتحدث قال: hablo dos idiomas cada día.",
            audioKey="pending/a1_hablo_dos_idiomas.mp3",
            speechEs="En mi puesto hablo dos idiomas cada día."
        ),
        speak_ex(
            "ex-a1-prep-6",
            "انطق تقديمك المهني وزملائك في العمل",
            ["speaking", "pronunciation"], 2,
            "انطق الجملة موضحاً علاقتك الطيبة بزملائك في الشركة",
            "Tengo buenos compañeros en la empresa.",
            "لدي زملاء جيدون في الشركة.",
            "pending/a1_buenos_companeros.mp3",
            ["compañero", "empresa"],
            "Tengo buenos compañeros en la empresa.",
            "تذكر نطق حرف ñ كـ نياء معجمة (ny) كما في كلمة compañeros."
        )
    ]
    return lesson_doc(doc, exs)

# ==============================================================================
# UNIT 10: a1-u10-health-basics (الصحة الأساسية والمساعدة)
# ==============================================================================

def make_lesson_cuerpo():
    slug = "a1-cuerpo"
    doc = {
        "slug": slug,
        "unitSlug": "a1-u10-health-basics",
        "levelCode": "A1",
        "titleAr": "أعضاء الجسم الأساسية: أسماء الأعضاء والتذكير والتأنيث",
        "titleEs": "El cuerpo humano",
        "subtitleAr": "تعلم أجزاء الجسم واستخدام أداة التعريف بدلاً من صفات الملكية",
        "order": 1,
        "estimatedMinutes": 18,
        "cefrLevel": "A1",
        "review": review_block(),

        "pedagogy": {
            "learningObjectivesAr": [
                "أن يسمّي المتعلم أعضاء الجسم الرئيسية بدقة مع تمييز جنس كل عضو.",
                "أن يلاحظ أن كلمة la mano مؤنثة رغم نهايتها بحرف o.",
                "أن يطبق القاعدة الإسبانية في استخدام أداة التعريف مع أجزاء الجسم بدلاً من صفات الملكية."
            ],
            "grammarPoints": [
                {
                    "titleAr": "أدوات التعريف مع أجزاء الجسم وشذوذ la mano",
                    "explanationAr": "أعضاء الجسم المذكرة: el ojo (العين / los ojos العيون)، el brazo (الذراع)، el estómago (المعدة)، el cuerpo (الجسم). الأعضاء المؤنثة: la cabeza (الرأس)، la pierna (الساق)، la espalda (الظهر). انتبه استثناءً هاماً: كلمة **la mano** (اليد) تنتهي بحرف o لكنها كلمة مؤنثة تماماً (la mano / las manos). قاعدة أسلوبية هامة: في الإسبانية نستخدم أداة التعريف مع أعضاء الجسم عند الحركة أو الوصف الطبي وليس صفة الملكية (Me lavo las manos = أغسل يديّ، وليس *mis manos*)."
                }
            ],
            "commonMistakesAr": [
                "اعتبار la mano مذكرة بسبب نهايتها بـ o وكتابة *el mano* (خطأ فادح؛ الصحيح: la mano).",
                "استخدام صفات الملكية mi / mis مع أجزاء الجسم بتأثير العربية أو الإنجليزية (مثل قول *me duele mi cabeza* بدلاً من me duele la cabeza)."
            ],
            "dialectNotes": [
                {
                    "region": "EG",
                    "noteAr": "في مصر نقول: «راسي، ضهري، عينيّ، بطني». في الإسبانية نضع أداة التعريف: la cabeza, la espalda, los ojos, el estómago."
                }
            ],
            "culturalNoteAr": "عند الذهاب للطبيب في إسبانيا، سيطلب منك فحص أجزاء الجسم مستخدماً أداة التعريف: «Abra la boca» (افتح الفم) أو «Levante el brazo» (ارفع الذراع)."
        },
        "contentBlocks": [
            {
                "id": f"cb-{slug}-intro",
                "type": "explanation",
                "titleAr": "أجزاء الجسم البشري",
                "bodyAr": "أهم أعضاء الجسم التي يحتاجها المتعلم في المواقف اليومية والطبية:\n- **la cabeza**: الرأس\n- **el ojo / los ojos**: العين / العيون\n- **el brazo**: الذراع\n- **la pierna**: الساق / الرِّجل\n- **la espalda**: الظهر\n- **la mano**: اليد (مؤنثة!)\n- **el estómago**: المعدة / البطن\n- **el cuerpo**: الجسم كاملاً",
                "examples": [
                    {"es": "Me lavo las manos con jabón.", "ar": "أغسل يديّ بالصابون."},
                    {"es": "Tiene los ojos verdes.", "ar": "لديه عينان خضراوان."},
                    {"es": "El ejercicio es bueno para el cuerpo.", "ar": "الرياضة مفيدة للجسم."}
                ]
            }
        ],
        "newVocabulary": [
            {"headword": "cabeza", "meaningAr": "رأس", "partOfSpeech": "noun", "gender": "feminine"},
            {"headword": "ojo", "meaningAr": "عين", "partOfSpeech": "noun", "gender": "masculine"},
            {"headword": "brazo", "meaningAr": "ذراع", "partOfSpeech": "noun", "gender": "masculine"},
            {"headword": "pierna", "meaningAr": "ساق / رِجل", "partOfSpeech": "noun", "gender": "feminine"},
            {"headword": "espalda", "meaningAr": "ظهر", "partOfSpeech": "noun", "gender": "feminine"},
            {"headword": "mano", "meaningAr": "يد", "partOfSpeech": "noun", "gender": "feminine"},
            {"headword": "estómago", "meaningAr": "معدة / بطن", "partOfSpeech": "noun", "gender": "masculine"},
            {"headword": "cuerpo", "meaningAr": "جسم", "partOfSpeech": "noun", "gender": "masculine"}
        ],
        "reviewVocabulary": [
            {"headword": "médico", "meaningAr": "طبيب"}
        ]
    }

    exs = [
        choice_ex(
            "ex-a1-cue-1", "word_choice",
            "اختر أداة التعريف الصحيحة لكلمة mano",
            ["grammar"], 1,
            "كلمة mano من الاستثناءات الشهيرة في الإسبانية، ما هي أداتها الصحيحة؟",
            "Levanta _____ mano derecha, por favor.",
            "ارفع اليد اليمنى من فضلك.",
            [
                opt("o1", "la", "أداة التعريف للمؤنث (الصواب)", True),
                opt("o2", "el", "أداة التعريف للمذكر", False, "mano كلمة مؤنثة شاذة عن القاعدة ولا تأخذ el."),
                opt("o3", "los", "أداة الجمع المذكر", False, "mano اسم مفرد مؤنث.")
            ],
            ["mano"],
            "كلمة mano مؤنثة شاذة عن القاعدة العامة، وتأخذ دائماً la mano."
        ),
        fill_ex(
            "ex-a1-cue-2",
            "اكتب الكلمة الإسبانية المناسبة لـ 'الرأس'",
            ["vocabulary", "writing"], 1,
            "اكتب كلمة 'الرأس' بالإسبانية (بدون أداة)",
            "Protege la _____ con un casco.",
            "احمِ الرأس بخوذة.",
            ["cabeza"],
            ["cabeza"],
            "كلمة cabeza تعني الرأس وهي مؤنثة (la cabeza)."
        ),
        choice_ex(
            "ex-a1-cue-3", "word_choice",
            "حدد العضو المسؤول عن الرؤية بصيغة الجمع",
            ["vocabulary", "reading"], 2,
            "ما هو العضو الذي نرى به؟",
            "Tiene los _____ muy cansados hoy.",
            "عيناه متعبتان جداً اليوم.",
            [
                opt("o1", "ojos", "عيون", True),
                opt("o2", "brazos", "أذرع", False, "brazos تعني أذرع وليس عيون."),
                opt("o3", "piernas", "سيقان", False, "piernas تعني أرجل أو سيقان.")
            ],
            ["ojo", "brazo", "pierna"],
            "كلمة ojos هي جمع ojo وتعني العيون."
        ),
        order_ex(
            "ex-a1-cue-4",
            "رتّب الجملة لتوضيح فائدة الرياضة للجسم",
            ["grammar", "writing"], 2,
            ["El", "deporte", "es", "bueno", "para", "el", "cuerpo"],
            "El deporte es bueno para el cuerpo",
            "الترتيب السليم: الفاعل El deporte ثم الفعل es والصفة bueno ثم حرف الجر para والمجرور el cuerpo.",
            ["cuerpo"]
        ),
        choice_ex(
            "ex-a1-cue-5", "listen_choose",
            "استمع واختر الجزء المصاب من الجسم",
            ["listening", "vocabulary"], 2,
            "استمع لشكوى المريض وحدد الجزء الذي يذكره",
            "Tengo un dolor fuerte en la espalda.",
            "لدي ألم شديد في الظهر.",
            [
                opt("o1", "espalda", "ظهر", True),
                opt("o2", "estómago", "معدة", False, "المتحدث ذكر espalda وليس estómago."),
                opt("o3", "pierna", "ساق", False, "المتحدث اشتكى من ظهره وليس ساقه.")
            ],
            ["espalda", "estómago", "pierna"],
            "المتحدث قال: dolor fuerte en la espalda.",
            audioKey="pending/a1_dolor_espalda.mp3",
            speechEs="Tengo un dolor fuerte en la espalda."
        ),
        speak_ex(
            "ex-a1-cue-6",
            "انطق العبارة الخاصة بفحص الطبيب للذراع",
            ["speaking", "pronunciation"], 2,
            "انطق جملة الفحص الطبي للذراع بوضوح",
            "El médico examina el brazo derecho.",
            "الطبيب يفحص الذراع اليمنى.",
            "pending/a1_medico_brazo.mp3",
            ["médico", "brazo"],
            "El médico examina el brazo derecho.",
            "احرص على نطق حرف z كـ ثاء في brazo في إسبانيا."
        )
    ]
    return lesson_doc(doc, exs)

def make_lesson_doler():
    slug = "a1-doler"
    doc = {
        "slug": slug,
        "unitSlug": "a1-u10-health-basics",
        "levelCode": "A1",
        "titleAr": "التعبير عن الألم: استخدام الفعل Doler مع الضمائر المفردة والجمع",
        "titleEs": "El verbo doler: expresar dolor",
        "subtitleAr": "تركيب Me duele / Me duelen وأعراض المرض البسيطة (الحمى والزكام)",
        "order": 2,
        "estimatedMinutes": 18,
        "cefrLevel": "A1",
        "review": review_block(),

        "pedagogy": {
            "learningObjectivesAr": [
                "أن يستخدم المتعلم الفعل doler بالشكل الصحيح: duele مع المفرد، و duelen مع الجمع.",
                "أن يوظف ضمائر المفعول غير المباشر: me, te, le, nos, os, les للتعبير عمن يشعر بالألم.",
                "أن يعبّر عن الأعراض الشائعة: dolor, fiebre, resfriado."
            ],
            "grammarPoints": [
                {
                    "titleAr": "بنية الفعل doler (شبيه gustar تماماً)",
                    "explanationAr": "الفعل doler يعمل مثل فعل gustar بالضبط، حيث الفاعل النحوي هو العضو الذي يؤلم:\n- إذا كان العضو مفرداً نستخدم **duele**: Me duele la cabeza (يؤلمني رأسي)، ¿Te duele el estómago? (هل تؤلمك بطنك؟).\n- إذا كان العضو جمعاً نستخدم **duelen**: Me duelen los ojos (تؤلمني عيناي)، Le duelen las piernas (تؤلمه ساقاه).\nالضمائر المستخدمة هي ضمائر المفعول غير المباشر: me (لي), te (لك), le (له/لها), nos (لنا), os (لكم), les (لهم). للأعراض الأخرى نستخدم tener: Tengo fiebre (عندي حمى)، Tengo un resfriado (عندي زكام)."
                }
            ],
            "commonMistakesAr": [
                "تصريف الفعل مع الفاعل البشري بدلاً من العضو (مثل قول *yo duelo*؛ هذا خطأ فادح، فالصواب دائماً me duele).",
                "استخدام duele مع أعضاء الجسم في صيغة الجمع (مثل *me duele los ojos* بدلاً من me duelen los ojos)."
            ],
            "dialectNotes": [
                {
                    "region": "EG",
                    "noteAr": "في مصر نقول: «راسي بتوجعني / عينيّ بيوجعوني». في الإسبانية نفس التمييز الدقيق: Me duele la cabeza (مفرد) / Me duelen los ojos (جمع)."
                }
            ],
            "culturalNoteAr": "عند زيارة الصيدلية أو العيادة في إسبانيا، أول سؤال يسأله الصيدلي هو: «¿Qué te pasa?» (ماذا بك؟ / مم تشكو؟) وتجيبه مباشرة: «Me duele la garganta»."
        },
        "contentBlocks": [
            {
                "id": f"cb-{slug}-intro",
                "type": "explanation",
                "titleAr": "التعبير عن الألم والمرض",
                "bodyAr": "التركيب النحوي والمفردات للتعبير عما يؤلمك:\n- **doler**: يؤلم (فعل يتغير جذره: o -> ue)\n- **duele**: يؤلم (مع المفرد: la cabeza, la garganta)\n- **duelen**: تؤلم (مع الجمع: los ojos, las piernas)\n- **la garganta**: الحلق / الزور\n- **el dolor**: الألم / الوجع\n- **la fiebre**: الحمى / السخونة (Tengo fiebre)\n- **el resfriado**: الزكام / نزلة البرد (Tengo un resfriado)\n- **fuerte**: شديد / قوي",
                "examples": [
                    {"es": "Me duele mucho la garganta.", "ar": "يؤلمني حلقي كثيراً."},
                    {"es": "A Juan le duelen las piernas.", "ar": "خوان تؤلمه ساقاه."},
                    {"es": "Tengo un dolor muy fuerte de cabeza.", "ar": "عندي صداع شديد جداً في الرأس."}
                ]
            }
        ],
        "newVocabulary": [
            {"headword": "doler", "meaningAr": "يؤلم / يوجع", "partOfSpeech": "verb"},
            {"headword": "duele", "meaningAr": "يؤلم (للمفرد)", "partOfSpeech": "verb"},
            {"headword": "duelen", "meaningAr": "تؤلم (للجمع)", "partOfSpeech": "verb"},
            {"headword": "garganta", "meaningAr": "حلق / زور", "partOfSpeech": "noun", "gender": "feminine"},
            {"headword": "dolor", "meaningAr": "ألم / وجع", "partOfSpeech": "noun", "gender": "masculine"},
            {"headword": "fiebre", "meaningAr": "حمى / سخونة", "partOfSpeech": "noun", "gender": "feminine"},
            {"headword": "resfriado", "meaningAr": "نزلة برد / زكام", "partOfSpeech": "noun", "gender": "masculine"},
            {"headword": "fuerte", "meaningAr": "شديد / قوي", "partOfSpeech": "adjective"}
        ],
        "reviewVocabulary": [
            {"headword": "cabeza", "meaningAr": "رأس"},
            {"headword": "espalda", "meaningAr": "ظهر"},
            {"headword": "ojo", "meaningAr": "عين"}
        ]
    }

    exs = [
        choice_ex(
            "ex-a1-dol-1", "word_choice",
            "اختر صيغة الفعل doler مع العضو المفرد",
            ["grammar"], 1,
            "ما هي الصيغة الصحيحة للفعل doler عندما يكون الألم في عضو مفرد؟",
            "A mí me _____ la cabeza hoy.",
            "يؤلمني رأسي اليوم.",
            [
                opt("o1", "duele", "صيغة المفرد (الصواب)", True),
                opt("o2", "duelen", "صيغة الجمع", False, "cabeza اسم مفرد، لذلك نستخدم duele وليس duelen."),
                opt("o3", "dolo", "تصريف خاطئ مع yo", False, "doler لا يصرف مع yo لأن الفاعل هو العضو المصاب.")
            ],
            ["duele", "doler", "cabeza"],
            "مع الاسم المفرد مثل la cabeza نستخدم صيغة duele."
        ),
        fill_ex(
            "ex-a1-dol-2",
            "اكتب صيغة doler مع الاسم الجمع",
            ["grammar", "writing"], 1,
            "اكتب الكلمة المناسبة عندما تؤلمك عيناك (جمع)",
            "Me _____ mucho los ojos después de leer.",
            "تؤلمني عيناي كثيراً بعد القراءة.",
            ["duelen"],
            ["duelen"],
            "مع الأسماء الجمع مثل los ojos نستخدم صيغة duelen."
        ),
        choice_ex(
            "ex-a1-dol-3", "word_choice",
            "اختر العَرَض المناسب لارتفاع درجة الحرارة",
            ["vocabulary", "reading"], 2,
            "إذا ارتفعت درجة حرارة جسم المريض إلى 39، فماذا لديه؟",
            "El niño no va a clase porque tiene _____.",
            "الطفل لا يذهب للحصة لأن لديه ...",
            [
                opt("o1", "fiebre", "حمى / سخونة", True),
                opt("o2", "fuerte", "قوي (صفة)", False, "fuerte صفة ولا تأتي بمفردها بعد tiene للتعبير عن المرض."),
                opt("o3", "resfriado", "زكام", False, "ارتفاع درجة الحرارة تحديداً يسمى fiebre.")
            ],
            ["fiebre", "fuerte", "resfriado"],
            "ارتفاع حرارة الجسم يسمى fiebre (Tener fiebre)."
        ),
        order_ex(
            "ex-a1-dol-4",
            "رتّب الجملة للتعبير عن ألم شديد في الحلق",
            ["grammar", "writing"], 2,
            ["Me", "duele", "mucho", "la", "garganta"],
            "Me duele mucho la garganta",
            "الترتيب الصحيح: الضمير Me ثم الفعل duele والظرف mucho ثم العضو la garganta.",
            ["duele", "garganta"]
        ),
        choice_ex(
            "ex-a1-dol-5", "listen_choose",
            "استمع واختر ما يعاني منه المتحدث",
            ["listening", "vocabulary"], 2,
            "استمع للشكوى الصوتية وحدد المشكلة الصحية",
            "No puedo cantar porque me duele la garganta.",
            "لا أستطيع الغناء لأن حلقي يؤلمني.",
            [
                opt("o1", "garganta", "حلق / زور", True),
                opt("o2", "espalda", "ظهر", False, "المتحدث قال garganta وليس espalda."),
                opt("o3", "cabeza", "رأس", False, "المتحدث قال garganta وليس cabeza.")
            ],
            ["garganta", "espalda", "cabeza", "duele"],
            "الشكوى تركز على الحلق: me duele la garganta.",
            audioKey="pending/a1_duele_garganta.mp3",
            speechEs="No puedo cantar porque me duele la garganta."
        ),
        speak_ex(
            "ex-a1-dol-6",
            "انطق شكواك للطبيب من ألم الظهر",
            ["speaking", "pronunciation"], 2,
            "أخبر الطبيب بأن ظهرك يؤلمك بشدة بنطق سليم",
            "Tengo un resfriado y me duele la espalda.",
            "عندي نزلة برد ويؤلمني ظهري.",
            "pending/a1_resfriado_espalda.mp3",
            ["resfriado", "duele", "espalda"],
            "Tengo un resfriado y me duele la espalda.",
            "انتبه لنطق حرف d في resfriado كـ ذال خفيفة بين الصائتين."
        )
    ]
    return lesson_doc(doc, exs)

def make_lesson_farmacia():
    slug = "a1-farmacia"
    doc = {
        "slug": slug,
        "unitSlug": "a1-u10-health-basics",
        "levelCode": "A1",
        "titleAr": "في الصيدلية: طلب دواء بسيط وفهم التعليمات",
        "titleEs": "En la farmacia: pedir medicinas",
        "subtitleAr": "صيغ الطلب المهذب (Quería algo para...) وتعليمات الجرعة بـ cada",
        "order": 3,
        "estimatedMinutes": 18,
        "cefrLevel": "A1",
        "review": review_block(),

        "pedagogy": {
            "learningObjectivesAr": [
                "أن يطلب المتعلم دواءً بسيطاً في الصيدلية بأسلوب مهذب: Quería algo para el dolor de....",
                "أن يفهم أشكال الأدوية الأساسية: pastillas, jarabe, medicina.",
                "أن يفهم تعليمات الجرعات الشائعة: cada ocho horas, antes/después de comer."
            ],
            "grammarPoints": [
                {
                    "titleAr": "صيغ الطلب المهذب واستخدام cada للتكرار",
                    "explanationAr": "عند دخول الصيدلية نستخدم صيغة الماضي الناقص المهذبة Quería بدلاً من Quiero الفجة: Quería algo para el dolor de cabeza (أريد شيئاً لصداع الرأس)، ¿Tiene pastillas para la garganta? (هل لديك أقراص للحلق؟). لتحديد تكرار الجرعة، نستخدم كلمة **cada** (كل):\n- Tomar una pastilla **cada** ocho horas (تناول قرصاً كل ثماني ساعات).\n- Una cucharada de jarabe **cada** doce horas (ملعقة شراب كل 12 ساعة)."
                }
            ],
            "commonMistakesAr": [
                "استخدام todo بدلاً من cada مع الجرعات الزمنية (مثل قول *todo ocho horas*؛ الصواب دائماً: cada ocho horas).",
                "نسيان حرف الجر para عند بيان الغرض من الدواء (الصحيح: medicina para la fiebre)."
            ],
            "dialectNotes": [
                {
                    "region": "EG",
                    "noteAr": "في مصر نقول في الأجزخانة: «لو سمحت عايز حاجة للصداع / قرص كل 8 ساعات». في الإسبانية: Quería algo para el dolor de cabeza / Una pastilla cada ocho horas."
                }
            ],
            "culturalNoteAr": "في إسبانيا، تُعرف الصيدليات بلافتة الصليب الأخضر المضيء (la cruz verde)، وتعتبر الصيدلية المصدر الأول للنصيحة الطبية السريعة للأعراض البسيطة قبل الذهاب للمستشفى."
        },
        "contentBlocks": [
            {
                "id": f"cb-{slug}-intro",
                "type": "explanation",
                "titleAr": "التعامل في الصيدلية",
                "bodyAr": "أهم المفردات والعبارات المستخدمة عند شراء الأدوية:\n- **la farmacia**: الصيدلية\n- **la pastilla**: قرص الدواء / الحبة\n- **la medicina**: الدواء / العلاج\n- **el jarabe**: الشراب الطبي (دواء سائل)\n- **la receta**: الروشتة / الوصفة الطبية\n- **cada**: كل (تكرار زمني: cada ocho horas)\n- **la caja**: علبة (una caja de pastillas)",
                "examples": [
                    {"es": "Quería una caja de pastillas para el dolor.", "ar": "أريد علبة أقراص للألم."},
                    {"es": "¿Este medicamento necesita receta médica?", "ar": "¿هل يحتاج هذا الدواء إلى روشتة طبية؟"},
                    {"es": "Tome este jarabe cada ocho horas.", "ar": "تناول هذا الشراب كل ثماني ساعات."}
                ]
            }
        ],
        "newVocabulary": [
            {"headword": "farmacia", "meaningAr": "صيدلية", "partOfSpeech": "noun", "gender": "feminine"},
            {"headword": "pastilla", "meaningAr": "قرص دواء / حبة", "partOfSpeech": "noun", "gender": "feminine"},
            {"headword": "medicina", "meaningAr": "دواء / علاج", "partOfSpeech": "noun", "gender": "feminine"},
            {"headword": "jarabe", "meaningAr": "شراب طبي", "partOfSpeech": "noun", "gender": "masculine"},
            {"headword": "receta", "meaningAr": "وصفة طبية / روشتة", "partOfSpeech": "noun", "gender": "feminine"},
            {"headword": "cada", "meaningAr": "كل (للتكرار)", "partOfSpeech": "adverb"},
            {"headword": "caja", "meaningAr": "علبة", "partOfSpeech": "noun", "gender": "feminine"}
        ],
        "reviewVocabulary": [
            {"headword": "dolor", "meaningAr": "ألم / وجع"},
            {"headword": "fiebre", "meaningAr": "حمى / سخونة"}
        ]
    }

    exs = [
        choice_ex(
            "ex-a1-far-1", "word_choice",
            "اختر صيغة الطلب المهذبة في الصيدلية",
            ["grammar"], 1,
            "كيف تطلب دواءً في الصيدلية بأسلوب مهذب ومقبول؟",
            "Buenos días, _____ algo para el dolor de cabeza.",
            "صباح الخير، ... شيئاً لألم الرأس.",
            [
                opt("o1", "quería", "صيغة الطلب المهذبة (الصواب)", True),
                opt("o2", "dame", "أمر مباشر فج", False, "في الصيدلية نستخدم أسلوباً مهذباً مثل quería وليس أمراً فجاً."),
                opt("o3", "tienes", "أنت تملك", False, "quería algo تعبر عن رغبتك بأدب.")
            ],
            ["dolor"],
            "تعبير Quería algo para... هو الأسلوب المهذب القياسي للطلب في المتاجر والصيدليات الإسبانية."
        ),
        fill_ex(
            "ex-a1-far-2",
            "اكتب الكلمة الإسبانية الدالة على تكرار الجرعة",
            ["vocabulary", "writing"], 1,
            "اكتب الكلمة الإسبانية التي تعني 'كل' (مثل: كل ثماني ساعات)",
            "Tiene que tomar una pastilla _____ ocho horas.",
            "عليك تناول قرص كل ثماني ساعات.",
            ["cada"],
            ["cada"],
            "كلمة cada تستخدم لتحديد تكرار الجرعات الزمنية: cada ocho horas."
        ),
        choice_ex(
            "ex-a1-far-3", "word_choice",
            "اختر شكل الدواء المناسب للسعال والأطفال",
            ["vocabulary", "reading"], 2,
            "الدواء السائل الذي يؤخذ بالملعقة يسمى في الإسبانية:",
            "El médico receta un _____ dulce para la tos.",
            "الطبيب يصف شراباً حلواً للسعال.",
            [
                opt("o1", "jarabe", "شراب سائل", True),
                opt("o2", "pastilla", "قرص صلب", False, "الدواء السائل يسمى jarabe وليس pastilla."),
                opt("o3", "caja", "علبة (تغليف)", False, "caja تعني العلبة وليس نوع الدواء السائل.")
            ],
            ["jarabe", "pastilla", "caja"],
            "الدواء السائل يُسمى jarabe."
        ),
        order_ex(
            "ex-a1-far-4",
            "رتّب الجملة لشراء علبة دواء بدون روشتة",
            ["grammar", "writing"], 2,
            ["Compro", "una", "caja", "de", "medicina"],
            "Compro una caja de medicina",
            "الترتيب السليم: الفعل Compro ثم أداة التنكير una والاسم caja وحرف الجر de والاسم medicina.",
            ["caja", "medicina"]
        ),
        choice_ex(
            "ex-a1-far-5", "listen_choose",
            "استمع واختر ما طلبه المريض",
            ["listening", "vocabulary"], 2,
            "استمع للتسجيل في الصيدلية وحدد الدواء المطلوب",
            "Necesito unas pastillas para la fiebre alta.",
            "أحتاج أقراصاً للحمى المرتفعة.",
            [
                opt("o1", "pastillas", "أقراص دواء", True),
                opt("o2", "jarabe", "شراب", False, "المريض طلب pastillas وليس jarabe."),
                opt("o3", "receta", "روشتة", False, "المريض طلب الدواء نفسه.")
            ],
            ["pastilla", "fiebre", "jarabe", "receta"],
            "المريض طلب: unas pastillas para la fiebre.",
            audioKey="pending/a1_pastillas_fiebre.mp3",
            speechEs="Necesito unas pastillas para la fiebre alta."
        ),
        speak_ex(
            "ex-a1-far-6",
            "انطق طلبك للدواء من الصيدلي",
            ["speaking", "pronunciation"], 2,
            "اطلب من الصيدلي دواءً للحمى بنبرة واضحة ومؤدبة",
            "Quería una medicina para la fiebre, por favor.",
            "أريد علاجاً للحمى من فضلك.",
            "pending/a1_medicina_fiebre.mp3",
            ["medicina", "fiebre"],
            "Quería una medicina para la fiebre, por favor.",
            "انتبه لنطق حرف d في medicina كـ ذال خفيفة."
        )
    ]
    return lesson_doc(doc, exs)

def make_lesson_emergencia():
    slug = "a1-emergencia"
    doc = {
        "slug": slug,
        "unitSlug": "a1-u10-health-basics",
        "levelCode": "A1",
        "titleAr": "طلب المساعدة والطوارئ: عبارات الإنقاذ والاتصال بالإسعاف",
        "titleEs": "Situaciones de emergencia y socorro",
        "subtitleAr": "نداءات الاستغاثة (¡Ayuda! ¡Socorro!) وطلب الإسعاف والطوارئ 112",
        "order": 4,
        "estimatedMinutes": 18,
        "cefrLevel": "A1",
        "review": review_block(),

        "pedagogy": {
            "learningObjectivesAr": [
                "أن يطلب المتعلم النجدة فوراً في المواقف الطارئة: ¡Ayuda! و ¡Socorro!.",
                "أن يطلب استدعاء الإسعاف أو الشرطة: Llame a una ambulancia / a la policía.",
                "أن يصف حالة خطر أو استعجال: Es una urgencia, es peligroso, venga rápido."
            ],
            "grammarPoints": [
                {
                    "titleAr": "صيغ الاستغاثة والطلب العاجل بحرف a الشخصي",
                    "explanationAr": "في حالات الطوارئ القصوى نستخدم كلمات النداء المباشرة المرفقة بعلامات التعجب:\n- **¡Ayuda!**: ساعدوني! / نجدة!\n- **¡Socorro!**: أغيثوني! / أدركوني!\nعند الطلب من شخص الاتصال بالجهات، نستخدم صيغة الاحترام أو الطلب العاجل: **Llame a** (اتصل بـ...) مع حرف a الإجباري لأن المستدعى شخص أو جهة مسؤولة: Llame a una ambulancia (اتصل بسيارة إسعاف)، Llame a la policía (اتصل بالشرطة). للتعبير عن السرعة نستخدم الظرف: rápido (بسرعة)."
                }
            ],
            "commonMistakesAr": [
                "نسيان حرف الجر a بعد الفعل llamar عند الاتصال بسيارة الإسعاف أو الشرطة (مثل قول *llame la policía*؛ الصواب: llame a la policía).",
                "الخلط بين ayuda (طلب مساعدة عامة) و socorro (استغاثة قصوى لخطر حقيقي على الحياة)."
            ],
            "dialectNotes": [
                {
                    "region": "EG",
                    "noteAr": "في مصر نقول: «الحقوني! اتصل بالإسعاف بسرعة، دي حالة طارئة!». في الإسبانية: ¡Socorro! ¡Llame a una ambulancia rápido, es una urgencia!"
                }
            ],
            "culturalNoteAr": "رقم الطوارئ الموحد في إسبانيا وجميع دول الاتحاد الأوروبي هو **112** (Uno, uno, dos)، ويشمل الإسعاف والمطافئ والشرطة ويوفر خدمات ترجمة فورية بعدة لغات."
        },
        "contentBlocks": [
            {
                "id": f"cb-{slug}-intro",
                "type": "explanation",
                "titleAr": "كلمات وتعبيرات الطوارئ",
                "bodyAr": "أهم الكلمات والعبارات لإنقاذ المواقف الطارئة:\n- **la ayuda**: المساعدة / النجدة (¡Ayuda!)\n- **el socorro**: الاستغاثة القصوى (¡Socorro!)\n- **la urgencia**: الحالة العاجلة / الطوارئ (es una urgencia)\n- **la ambulancia**: سيارة الإسعاف\n- **el peligro**: الخطر\n- **llamar**: يتصل / ينادي\n- **la policía**: الشرطة\n- **rápido**: سريع / بسرعة",
                "examples": [
                    {"es": "¡Socorro! Necesito un médico rápido.", "ar": "النجدة! أحتاج إلى طبيب بسرعة."},
                    {"es": "Por favor, llame a una ambulancia.", "ar": "من فضلك، اتصل بسيارة إسعاف."},
                    {"es": "El número de emergencias es el 112.", "ar": "رقم الطوارئ هو 112."}
                ]
            }
        ],
        "newVocabulary": [
            {"headword": "ayuda", "meaningAr": "مساعدة / نجدة", "partOfSpeech": "noun", "gender": "feminine"},
            {"headword": "socorro", "meaningAr": "استغاثة / إنقاذ", "partOfSpeech": "noun", "gender": "masculine"},
            {"headword": "urgencia", "meaningAr": "طوارئ / حالة عاجلة", "partOfSpeech": "noun", "gender": "feminine"},
            {"headword": "ambulancia", "meaningAr": "سيارة إسعاف", "partOfSpeech": "noun", "gender": "feminine"},
            {"headword": "peligro", "meaningAr": "خطر", "partOfSpeech": "noun", "gender": "masculine"},
            {"headword": "llamar", "meaningAr": "يتصل / ينادي", "partOfSpeech": "verb"},
            {"headword": "policía", "meaningAr": "شرطة / رجل شرطة", "partOfSpeech": "noun"},
            {"headword": "rápido", "meaningAr": "سريع / بسرعة", "partOfSpeech": "adverb"}
        ],
        "reviewVocabulary": [
            {"headword": "hospital", "meaningAr": "مستشفى"},
            {"headword": "médico", "meaningAr": "طبيب"}
        ]
    }

    exs = [
        choice_ex(
            "ex-a1-eme-1", "word_choice",
            "اختر نداء الاستغاثة الإسباني عند الخطر الشديد",
            ["vocabulary"], 1,
            "ما هي الكلمة الإسبانية الصريحة لطلب النجدة العاجلة في موقف خطير؟",
            "¡_____, hay un incendio aquí!",
            "النجدة، هناك حريق هنا!",
            [
                opt("o1", "Socorro", "استغاثة وإنقاذ (الصواب)", True),
                opt("o2", "Gracias", "شكر", False, "Gracias تعني شكراً ولا تستخدم للاستغاثة."),
                opt("o3", "Hola", "تحية", False, "Hola تحية ولا تعبر عن حالة خطر.")
            ],
            ["socorro", "peligro"],
            "نداء الاستغاثة في الإسبانية هو ¡Socorro! أو ¡Ayuda!."
        ),
        fill_ex(
            "ex-a1-eme-2",
            "اكتب الكلمة الإسبانية المناسبة لسيارة الإسعاف",
            ["vocabulary", "writing"], 1,
            "اكتب كلمة 'سيارة إسعاف' بالإسبانية بدقة",
            "Por favor, llame a una _____ inmediatamente.",
            "من فضلك، اتصل بسيارة إسعاف فوراً.",
            ["ambulancia"],
            ["ambulancia"],
            "سيارة الإسعاف تسمى ambulancia وهي مؤنثة (una ambulancia)."
        ),
        choice_ex(
            "ex-a1-eme-3", "word_choice",
            "اختر الوصف المناسب للموقف العاجل",
            ["vocabulary", "reading"], 2,
            "عندما يتطلب المريض علاجاً فورياً لا يحتمل الانتظار، فإن الحالة تسمى:",
            "El paciente debe ir al hospital porque es una _____ médica.",
            "يجب على المريض الذهاب للمستشفى لأنها ... طبية.",
            [
                opt("o1", "urgencia", "حالة طارئة عاجلة", True),
                opt("o2", "policía", "شرطة", False, "الحالة الطبية المستعجلة تسمى urgencia وليس policía."),
                opt("o3", "peligro", "خطر", False, "التركيب هو una urgencia médica.")
            ],
            ["urgencia", "hospital", "policía", "peligro"],
            "حالة الطوارئ الطبية تسمى urgencia médica."
        ),
        order_ex(
            "ex-a1-eme-4",
            "رتّب الجملة لطلب الاتصال بسيارة الإسعاف بسرعة",
            ["grammar", "writing"], 2,
            ["Llame", "a", "la", "ambulancia", "rápido"],
            "Llame a la ambulancia rápido",
            "الترتيب السليم: الفعل في صيغة الطلب Llame ثم حرف الجر a والأداة la والاسم ambulancia والظرف rápido.",
            ["llamar", "ambulancia", "rápido"]
        ),
        choice_ex(
            "ex-a1-eme-5", "listen_choose",
            "استمع واختر الجهة المطلوب الاتصال بها",
            ["listening", "vocabulary"], 2,
            "استمع للنداء وحدد من يطلب المتحدث استدعاءه",
            "¡Hay un accidente, llame a la policía ahora!",
            "هناك حادث، اتصل بالشرطة الآن!",
            [
                opt("o1", "policía", "الشرطة", True),
                opt("o2", "ambulancia", "إسعاف", False, "المتحدث طلب تحديداً الاتصال بالشرطة la policía."),
                opt("o3", "médico", "طبيب", False, "المتحدث طلب الاتصال بالشرطة.")
            ],
            ["policía", "ambulancia", "médico", "llamar"],
            "المتحدث قال بوضوح: llame a la policía.",
            audioKey="pending/a1_llame_policia.mp3",
            speechEs="¡Hay un accidente, llame a la policía ahora!"
        ),
        speak_ex(
            "ex-a1-eme-6",
            "انطق نداء الاستغاثة وطلب الطبيب بوضوح",
            ["speaking", "pronunciation"], 2,
            "انطق جملة الاستغاثة وطلب الطبيب بنبرة مناسبة للموقف الطارئ",
            "¡Ayuda! Necesito un médico rápido.",
            "النجدة! أحتاج إلى طبيب بسرعة.",
            "pending/a1_ayuda_medico_rapido.mp3",
            ["ayuda", "médico", "rápido"],
            "¡Ayuda! Necesito un médico rápido.",
            "انتبه للتشديد على المقاطع المنبورة في ¡Ayuda! و rápido."
        )
    ]
    return lesson_doc(doc, exs)

# ==============================================================================
# MAIN RUNNER
# ==============================================================================

def main():
    lessons = [
        # Unit 8
        make_lesson_lugares_ciudad(),
        make_lesson_donde_esta(),
        make_lesson_direcciones(),
        make_lesson_transporte(),
        # Unit 9
        make_lesson_profesiones(),
        make_lesson_estudiar(),
        make_lesson_horario_trabajo(),
        make_lesson_presentacion_profesional(),
        # Unit 10
        make_lesson_cuerpo(),
        make_lesson_doler(),
        make_lesson_farmacia(),
        make_lesson_emergencia()
    ]

    os.makedirs(OUT, exist_ok=True)
    for ldoc in lessons:
        slug = ldoc["lesson"]["slug"]
        path = os.path.join(OUT, f"lesson-{slug}.json")
        with open(path, "w", encoding="utf-8") as f:
            json.dump(ldoc, f, ensure_ascii=False, indent=2)
            f.write("\n")
        print(f"Generated {path} with {len(ldoc['lesson']['exercises'])} exercises.")

    # Update curriculum-map.v1.json
    cmap_path = "content/curriculum/curriculum-map.v1.json"
    with open(cmap_path, "r", encoding="utf-8") as f:
        cmap = json.load(f)

    main_track = next(t for t in cmap["tracks"] if t["slug"] == "main-track")
    a1_level = next(lv for lv in main_track["levels"] if lv["levelCode"] == "A1")

    # Map lessons by slug
    lessons_by_slug = {ldoc["lesson"]["slug"]: ldoc["lesson"] for ldoc in lessons}

    for unit in a1_level["units"]:
        if unit["slug"] in ["a1-u8-places", "a1-u9-work-study", "a1-u10-health-basics"]:
            unit["status"] = "draft"
            prev_slug = None
            for idx, l in enumerate(unit["lessons"]):
                slug = l["slug"]
                if slug in lessons_by_slug:
                    gen_l = lessons_by_slug[slug]
                    l["status"] = "authored"
                    l["filePath"] = f"content/drafts/a1/lesson-{slug}.json"
                    l["titleAr"] = gen_l["titleAr"]
                    l["titleEs"] = gen_l["titleEs"]
                    l["objectiveAr"] = gen_l["pedagogy"]["learningObjectivesAr"][0]
                    # entry lesson of unit has no requirements, subsequent require previous
                    if idx == 0:
                        l["requires"] = []
                    else:
                        l["requires"] = [prev_slug]
                    prev_slug = slug

    with open(cmap_path, "w", encoding="utf-8") as f:
        json.dump(cmap, f, ensure_ascii=False, indent=2)
        f.write("\n")
    print("Updated curriculum-map.v1.json successfully.")

    # Update content/drafts/a1/paths.json
    paths_path = "content/drafts/a1/paths.json"
    with open(paths_path, "r", encoding="utf-8") as f:
        paths = json.load(f)

    mt = next(p for p in paths["programs"] if p["slug"] == "main-track")
    existing_unit_slugs = {u["slug"] for u in mt["units"]}

    units_to_add = [
        {
            "slug": "a1-u8-places",
            "levelCode": "A1",
            "titleAr": "الأماكن والاتجاهات",
            "sortOrder": 8,
            "status": "draft",
            "lessons": [
                "a1-lugares-ciudad",
                "a1-donde-esta",
                "a1-direcciones",
                "a1-transporte"
            ],
            "vocabularyBundles": []
        },
        {
            "slug": "a1-u9-work-study",
            "levelCode": "A1",
            "titleAr": "العمل والدراسة",
            "sortOrder": 9,
            "status": "draft",
            "lessons": [
                "a1-profesiones",
                "a1-estudiar",
                "a1-horario-trabajo",
                "a1-presentacion-profesional"
            ],
            "vocabularyBundles": []
        },
        {
            "slug": "a1-u10-health-basics",
            "levelCode": "A1",
            "titleAr": "الصحة الأساسية والمساعدة",
            "sortOrder": 10,
            "status": "draft",
            "lessons": [
                "a1-cuerpo",
                "a1-doler",
                "a1-farmacia",
                "a1-emergencia"
            ],
            "vocabularyBundles": []
        }
    ]

    for u in units_to_add:
        if u["slug"] not in existing_unit_slugs:
            mt["units"].append(u)

    with open(paths_path, "w", encoding="utf-8") as f:
        json.dump(paths, f, ensure_ascii=False, indent=2)
        f.write("\n")
    print("Updated content/drafts/a1/paths.json successfully.")

if __name__ == "__main__":
    main()
