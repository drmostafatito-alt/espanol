# -*- coding: utf-8 -*-
"""Generator for A1 Units 5 (Shopping), 6 (Home), and 7 (Routine).
Creates 12 interactive lessons based on Gramática del uso, Español 2000,
and المرشد في اللغة الأسبانية.
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
# UNIT 5: a1-u5-shopping (التسوق والحاجات)
# ==============================================================================

# Lesson 1: a1-colores-ropa
L_COL = {
    "slug": "a1-colores-ropa",
    "titleAr": "الألوان والملابس: وصف القطع ومطابقة الصفات في الجنس والعدد",
    "level": "A1",
    "programSlug": "main-track",
    "unitSlug": "a1-u5-shopping",
    "objectiveAr": "أن يسمّي المتعلم الملابس الأساسية والألوان، ويطابق صفات الألوان مع الأسماء الموصوفة تذكيراً وتأنيثاً وإفراداً وجمعاً (camisa blanca, zapatos negros).",
    "estimatedMinutes": 12,
    "skills": ["vocabulary", "reading", "grammar", "listening", "speaking"],
    "newVocabulary": ["ropa", "camisa", "pantalón", "zapato", "blanco", "negro", "rojo", "azul", "verde", "amarillo"],
    "reviewVocabulary": ["dos", "bueno", "casa"],
    "targetStructures": [
        "Llevo una camisa blanca y un pantalón negro.",
        "Estos zapatos son muy cómodos.",
        "¿De qué color es la chaqueta?"
    ],
    "grammarTopics": ["concordancia-genero-numero-colores", "posicion-adjetivo-color", "sustantivos-ropa"],
    "scenarios": [
        {
            "contextAr": "رانيا تتسوق في متجر ملابس في مدريد وتصف لصديقتها ما ترتديه وما ترغب في شرائه.",
            "settingAr": "متجر ملابس وسط مدريد",
            "lines": [
                {
                    "es": "Mira, me gusta mucho esta camisa blanca.",
                    "ar": "انظري، يعجبني كثيراً هذا القميص الأبيض.",
                    "arEg": "بصي، عجباني أوي البلوزة البيضا دي.",
                    "audioKey": "pending/a1-col-sc-1"
                },
                {
                    "es": "Es muy bonita, y combina bien con tu pantalón negro.",
                    "ar": "إنها جميلة جداً، وتتناسق جيداً مع بنطالك الأسود.",
                    "arEg": "حلوة جداً، وماشية كويس مع بنطلونك الأسود.",
                    "audioKey": "pending/a1-col-sc-2"
                },
                {
                    "es": "¿Y qué zapatos llevas hoy?",
                    "ar": "وما هو الحذاء الذي ترتدينه اليوم؟",
                    "arEg": "ولابسة جزمة إيه النهاردة؟",
                    "audioKey": "pending/a1-col-sc-3"
                },
                {
                    "es": "Llevo unos zapatos marrones muy cómodos.",
                    "ar": "أرتدي حذاء بنياً مريحاً للغاية.",
                    "arEg": "لابسة جزمة بني مريحة جداً.",
                    "audioKey": "pending/a1-col-sc-4"
                }
            ]
        }
    ],
    "culturalNoteAr": "في إسبانيا واللغة الإسبانية، صفات الألوان تأتي بعد الاسم الموصوف دائماً (una camisa roja وليس *una roja camisa)، وتطابق الاسم الموصوف تماماً في التذكير والتأنيث والجمع.",
    "pedagogicalRationaleAr": "الألوان مثل azul وverde لا تتغير في التأنيث (camisa azul / pantalón azul)، بينما الألوان المنتهية بـ o مثل blanco وnegro وrojo تتغير بتأنيث آخرها إلى a (camisa blanca). يكثر خطأ المتعلمين العرب في إلحاق علامة التأنيث بما لا يؤنث أو نسيان جمع الصفة مع الاسم الجمع.",
    "status": "draft",
    "review": review_block()
}

EX_COL = [
    choice_ex(
        "a1_col_1_listen",
        "listen_choose",
        "استمع للمتحدث وحدد لون القميص المذكور.",
        ["listening", "vocabulary"],
        1,
        "استمع جيداً للوصف:",
        "Quiero comprar una camisa blanca de manga corta.",
        "أريد شراء قميص أبيض بأكمام قصيرة.",
        [
            opt("a1_col_1_a", "Una camisa blanca", "قميص أبيض", True),
            opt("a1_col_1_b", "Una camisa negra", "قميص أسود", False, "الصوت ذكر blanca (أبيض) وليس negra."),
            opt("a1_col_1_c", "Una camisa azul", "قميص أزرق", False, "لم يُذكر اللون الأزرق في التسجيل.")
        ],
        ["camisa", "blanco", "ropa"],
        "المتحدث قال بوضوح: camisa blanca أي قميص أبيض.",
        audioKey="pending/a1-col-ex-1",
        speechEs="Quiero comprar una camisa blanca de manga corta."
    ),
    choice_ex(
        "a1_col_2_agreement",
        "word_choice",
        "اختر صفة اللون المناسبة للاسم المؤنث (la falda).",
        ["grammar"],
        2,
        "كيف نصف التنورة (اسم مؤنث) باللون الأحمر؟",
        "María lleva una falda ____.",
        "ماريا ترتدي تنورة ____.",
        [
            opt("a1_col_2_a", "roja", "حمراء (مطابقة للمؤنث)", True),
            opt("a1_col_2_b", "rojo", "أحمر (مذكر غير مطابق)", False, "خطأ: كلمة falda مؤنثة ويجب أن تتطابق الصفة معها وتصبح roja."),
            opt("a1_col_2_c", "rojos", "حمر (جمع مذكر)", False, "الاسم مفرد مؤنث وليس جمعاً.")
        ],
        ["rojo", "ropa"],
        "تطابق صفة اللون الاسم في التأنيث: falda roja."
    ),
    fill_ex(
        "a1_col_3_fill",
        "اكتب كلمة الحذاء بالإسبانية في الفراغ.",
        ["writing", "vocabulary"],
        1,
        "اكتب كلمة (zapato) في الفراغ:",
        "Necesito un ____ nuevo para la fiesta.",
        "أحتاج ____ جديداً للحفلة.",
        ["zapato", "ropa"],
        ["zapato"],
        "كلمة حذاء في الإسبانية هي zapato للمفرد و zapatos للزوجين."
    ),
    order_ex(
        "a1_col_4_order",
        "رتّب الكلمات لتكوين جملة وصف الملابس.",
        ["grammar", "reading"],
        2,
        ["Llevo", "un", "pantalón", "negro", "elegante."],
        "Llevo un pantalón negro elegante.",
        "الترتيب المعياري: الفعل Llevo + أداة التنكير un + الاسم pantalón + صفة اللون negro + الصفة elegante.",
        ["pantalón", "negro", "ropa"]
    ),
    choice_ex(
        "a1_col_5_plural",
        "word_choice",
        "اختر صيغة اللون المطابقة للاسم الجمع (los zapatos).",
        ["grammar"],
        2,
        "كيف نصف الحذاء (جمع مذكر) باللون الأسود؟",
        "Tengo unos zapatos ____.",
        "لدي حذاء ____.",
        [
            opt("a1_col_5_a", "negros", "سود (جمع مذكر)", True),
            opt("a1_col_5_b", "negro", "أسود (مفرد)", False, "خطأ: الاسم unos zapatos جمع، والصفة يجب أن تجمع أيضاً بإضافة s."),
            opt("a1_col_5_c", "negras", "سوداء (جمع مؤنث)", False, "كلمة zapatos مذكرة وتأخذ negros.")
        ],
        ["zapato", "negro"],
        "مطابقة الصفة للجمع المذكر: zapatos negros."
    ),
    speak_ex(
        "a1_col_6_speak",
        "انطق جملة وصف الملابس بنطق واضح.",
        ["speaking"],
        2,
        "اقرأ الجملة بصوت واضح وثقة:",
        "Me gusta mucho esta camisa azul.",
        "يعجبني كثيراً هذا القميص الأزرق.",
        "pending/a1-col-ex-6",
        ["camisa", "azul", "ropa"],
        "Me gusta mucho esta camisa azul.",
        "انتبه لنطق حرف z كحرف ثاء خفيف في a-ZUL."
    )
]

# Lesson 2: a1-necesitar
L_NEC = {
    "slug": "a1-necesitar",
    "titleAr": "التعبير عن الحاجة والرغبة: استخدام Necesitar و Querer للتسوق",
    "level": "A1",
    "programSlug": "main-track",
    "unitSlug": "a1-u5-shopping",
    "objectiveAr": "أن يعبّر المتعلم عن حاجته لشراء ملابس أو أغراض مستخدماً necesito / quiero مع الأسماء والمصادر بدقة.",
    "estimatedMinutes": 12,
    "skills": ["grammar", "speaking", "listening", "reading", "writing"],
    "newVocabulary": ["necesitar", "querer", "comprar", "ropa", "camisa", "pantalón", "zapato"],
    "reviewVocabulary": ["bueno", "dos", "tres"],
    "targetStructures": [
        "Necesito comprar ropa de invierno.",
        "Quiero ver esa camisa, por favor.",
        "¿Qué necesita usted?"
    ],
    "grammarTopics": ["verbo-necesitar-presente", "verbo-querer-irregular", "verbo-mas-infinitivo"],
    "scenarios": [
        {
            "contextAr": "طارق في مركز تجاري في مدريد يبحث عن معطف شتوي ويشرح للبائع ما يحتاجه.",
            "settingAr": "قسم الملابس الرجالية في متجر كبير",
            "lines": [
                {
                    "es": "¡Hola! ¿Le puedo ayudar en algo?",
                    "ar": "مرحباً! هل يمكنني مساعدتك في شيء؟",
                    "arEg": "أهلاً! أقدر أساعد حضرتك في حاجة؟",
                    "audioKey": "pending/a1-nec-sc-1"
                },
                {
                    "es": "Sí, gracias. Necesito un abrigo caliente para el invierno.",
                    "ar": "نعم، شكراً. أحتاج معطفاً دافئاً للشتاء.",
                    "arEg": "أيوه شكراً. محتاج بالطو دافي للشتا.",
                    "audioKey": "pending/a1-nec-sc-2"
                },
                {
                    "es": "¿Prefiere algún color en particular?",
                    "ar": "هل تفضل لوناً معيناً؟",
                    "arEg": "تفضل لون معين؟",
                    "audioKey": "pending/a1-nec-sc-3"
                },
                {
                    "es": "Quiero ver los modelos en color negro o azul oscuro.",
                    "ar": "أريد رؤية الموديلات باللون الأسود أو الأزرق الداكن.",
                    "arEg": "عايز أشوف الموديلات اللي بالأسود أو الكحلي.",
                    "audioKey": "pending/a1-nec-sc-4"
                }
            ]
        }
    ],
    "culturalNoteAr": "الفعل necesitar يدل على الحاجة والضرورة، بينما querer يدل على الرغبة والإرادة. في المتاجر، كلاهما شائع ومقبول جداً عند التحدث مع البائع.",
    "pedagogicalRationaleAr": "الفعل necesitar منتظم تماماً (necesito, necesitas, necesita)، بينما querer فعل غير منتظم يحدث فيه تبادل حرفي (e -> ie): quiero, quieres, quiere. يجب تثبيت تصريف quiero للمتكلم.",
    "status": "draft",
    "review": review_block()
}

EX_NEC = [
    choice_ex(
        "a1_nec_1_listen",
        "listen_choose",
        "استمع وحدد ماذا يحتاج المشتري.",
        ["listening", "vocabulary"],
        1,
        "استمع جيداً لكلام المشتري:",
        "Hola, buenos días. Necesito unos pantalones cómodos para viajar.",
        "مرحباً، صباح الخير. أحتاج بنطالاً مريحاً للسفر.",
        [
            opt("a1_nec_1_a", "Unos pantalones", "بنطال مريح", True),
            opt("a1_nec_1_b", "Una camisa blanca", "قميص أبيض", False, "الصوت ذكر pantalones وليس camisa."),
            opt("a1_nec_1_c", "Unos zapatos de fiesta", "حذاء سهرة", False, "لم يذكر المتحدث الأحذية إطلاقاً.")
        ],
        ["necesitar", "pantalón", "ropa"],
        "المشتري قال بوضوح: Necesito unos pantalones.",
        audioKey="pending/a1-nec-ex-1",
        speechEs="Hola, buenos días. Necesito unos pantalones cómodos para viajar."
    ),
    choice_ex(
        "a1_nec_2_verb_querer",
        "word_choice",
        "اختر تصريف الفعل querer المناسب لضمير المتكلم (yo).",
        ["grammar"],
        2,
        "كيف تقول: «أنا أريد شراء هذا القميص»؟",
        "Yo ____ comprar esta camisa.",
        "أنا ____ شراء هذا القميص.",
        [
            opt("a1_nec_2_a", "quiero", "أريد (تصريف المتكلم الصحيح)", True),
            opt("a1_nec_2_b", "quere", "تصريف غير موجود", False, "فعل querer غير منتظم ويتحول إلى quiero مع yo."),
            opt("a1_nec_2_c", "quieren", "هم يريدون", False, "هذا تصريف ضمير الغائب الجمع ellos/ellas.")
        ],
        ["querer", "comprar", "camisa"],
        "تصريف الفعل querer مع ضمير المتكلم هو: Yo quiero."
    ),
    fill_ex(
        "a1_nec_3_fill",
        "أكمل الجملة بتصريف فعل necesitar مع ضمير المتكلم.",
        ["writing", "grammar"],
        1,
        "اكتب كلمة (necesito) في الفراغ:",
        "Hoy ____ comprar zapatos nuevos.",
        "اليوم ____ شراء حذاء جديد.",
        ["necesitar", "comprar", "zapato"],
        ["necesito"],
        "تصريف الفعل المنتظم necesitar مع المتكلم هو: necesito."
    ),
    order_ex(
        "a1_nec_4_order",
        "رتّب الكلمات للتعبير عن الرغبة في الشراء.",
        ["grammar", "reading"],
        2,
        ["Quiero", "comprar", "ropa", "nueva."],
        "Quiero comprar ropa nueva.",
        "الترتيب: الفعل المصرف Quiero + المصدر comprar + المفعول به ropa nueva.",
        ["querer", "comprar", "ropa"]
    ),
    choice_ex(
        "a1_nec_5_infinitive",
        "word_choice",
        "ما هي الصيغة الصحيحة للفعل الذي يأتي بعد necesito؟",
        ["grammar"],
        2,
        "بعد الفعل المصرف، يأتي الفعل الثاني في صيغة:",
        "Necesito ____ esta camisa.",
        "أحتاج ____ هذا القميص.",
        [
            opt("a1_nec_5_a", "cambiar", "المصدر (بدون تصريف)", True),
            opt("a1_nec_5_b", "cambio", "مصرف مع yo", False, "خطأ: في الإسبانية لا نصرف فعلين متتاليين لنفس الفاعل، بل يأتي الثاني في المصدر."),
            opt("a1_nec_5_c", "cambias", "مصرف مع tú", False, "خطأ: الفعل الثاني يجب أن يكون في المصدر.")
        ],
        ["necesitar", "camisa"],
        "القاعدة الذهبية: فعل مصرف + فعل في المصدر (Necesito cambiar...)."
    ),
    speak_ex(
        "a1_nec_6_speak",
        "انطق جملة التعبير عن الحاجة للشراء بنطق واضح.",
        ["speaking"],
        2,
        "اقرأ الجملة بصوت واضح:",
        "Necesito comprar un pantalón negro para el trabajo.",
        "أحتاج شراء بنطال أسود للعمل.",
        "pending/a1-nec-ex-6",
        ["necesitar", "comprar", "pantalón"],
        "Necesito comprar un pantalón negro para el trabajo.",
        "انتبه لنطق حرف c في ne-ce-SI-to ونطق التنوين الصوتي في pan-ta-LÓN."
    )
]

# Lesson 3: a1-tallas
L_TAL = {
    "slug": "a1-tallas",
    "titleAr": "المقاسات والتجربة: السؤال عن القياس وغرفة القياس",
    "level": "A1",
    "programSlug": "main-track",
    "unitSlug": "a1-u5-shopping",
    "objectiveAr": "أن يسأل المتعلم عن المقاس ويفهم الإجابة ويطلب تجربة الملابس في غرفة القياس (¿Puedo probármelo?).",
    "estimatedMinutes": 12,
    "skills": ["speaking", "listening", "vocabulary", "reading", "grammar"],
    "newVocabulary": ["ropa", "camisa", "pantalón", "zapato", "blanco", "negro", "necesitar"],
    "reviewVocabulary": ["dos", "bueno", "tres"],
    "targetStructures": [
        "¿Qué talla tiene? — Uso la talla mediana (M).",
        "¿Tiene una talla más grande o más pequeña?",
        "¿Dónde están los probadores? — Al fondo a la derecha."
    ],
    "grammarTopics": ["vocabulario-tallas", "comparativos-grande-pequeno", "pedir-probarse"],
    "scenarios": [
        {
            "contextAr": "سامي يجرب قميصاً في محل ملابس ويطلب من الموظف مقاساً أكبر.",
            "settingAr": "غرفة القياس في متجر ملابس",
            "lines": [
                {
                    "es": "Perdón, esta camisa me queda un poco pequeña.",
                    "ar": "معذرة، هذا القميص ضيق عليّ قليلاً.",
                    "arEg": "لو سمحت، القميص ده ضيق عليا شوية.",
                    "audioKey": "pending/a1-tal-sc-1"
                },
                {
                    "es": "¿Qué talla lleva usted?",
                    "ar": "ما هو مقاس حضرتك؟",
                    "arEg": "مقاس حضرتك إيه؟",
                    "audioKey": "pending/a1-tal-sc-2"
                },
                {
                    "es": "Llevo la talla mediana, necesito una talla más grande.",
                    "ar": "أرتدي المقاس المتوسط، أحتاج مقاساً أكبر.",
                    "arEg": "بلبس مقاس وسط، محتاج مقاس أكبر.",
                    "audioKey": "pending/a1-tal-sc-3"
                },
                {
                    "es": "Un momento, voy a buscar la talla grande en el almacén.",
                    "ar": "لحظة واحدة، سأبحث عن المقاس الكبير في المخزن.",
                    "arEg": "لحظة واحدة، هشوف المقاس الكبير في المخزن.",
                    "audioKey": "pending/a1-tal-sc-4"
                }
            ]
        }
    ],
    "culturalNoteAr": "المقاسات في إسبانيا للملابس يُشار إليها بالحروف: S (pequeña), M (mediana), L (grande), XL (extragrande). وللأحذية يُستخدم رقم القياس الأوروبي (مثل: talla 42). وغرفة القياس تُسمى 'el probador' (وجمعها los probadores).",
    "pedagogicalRationaleAr": "المتعلم العربي يحتاج إلى التمييز بين talla للملابس والأحذية وnúmero للأرقام العامة، واستخدام تعبير me queda bien / me queda pequeño لوصف ملاءمة القطعة للجسد.",
    "status": "draft",
    "review": review_block()
}

EX_TAL = [
    choice_ex(
        "a1_tal_1_listen",
        "listen_choose",
        "استمع للمقاس المطلوب وحدد الحرف المطابق له.",
        ["listening", "vocabulary"],
        1,
        "استمع جيداً للزبون وهو يطلب مقاسه:",
        "Disculpe, necesito probarme esta camisa en talla mediana.",
        "عفواً، أحتاج تجربة هذا القميص في المقاس المتوسط.",
        [
            opt("a1_tal_1_a", "Talla M (mediana)", "المقاس المتوسط M", True),
            opt("a1_tal_1_b", "Talla S (pequeña)", "المقاس الصغير S", False, "الصوت ذكر mediana وليس pequeña."),
            opt("a1_tal_1_c", "Talla L (grande)", "المقاس الكبير L", False, "الصوت طلب المقاس المتوسط M.")
        ],
        ["camisa", "necesitar", "ropa"],
        "المقاس المطلوب هو talla mediana أي المقاس M.",
        audioKey="pending/a1-tal-ex-1",
        speechEs="Disculpe, necesito probarme esta camisa en talla mediana."
    ),
    choice_ex(
        "a1_tal_2_bigger",
        "word_choice",
        "كيف تطلب مقاساً أكبر عندما تكون القطعة ضيقة؟",
        ["speaking", "vocabulary"],
        2,
        "عندما يكون القميص صغيراً وتريد مقاساً أكبر، تقول:",
        "¿Tiene una talla más ____, por favor?",
        "هل لديك مقاس ____، من فضلك؟",
        [
            opt("a1_tal_2_a", "grande", "أكبر", True),
            opt("a1_tal_2_b", "pequeña", "أصغر", False, "إذا كان صغيراً فأنت بحاجة لمقاس أكبر (grande) وليس أصغر."),
            opt("a1_tal_2_c", "blanca", "بيضاء", False, "هذا لون وليس مقاساً.")
        ],
        ["ropa", "camisa"],
        "لطلب مقاس أكبر نقول: una talla más grande."
    ),
    fill_ex(
        "a1_tal_3_fill",
        "اكتب كلمة الملابس العامة بالإسبانية.",
        ["writing", "vocabulary"],
        1,
        "اكتب كلمة (ropa) في الفراغ:",
        "En esta tienda hay ____ muy bonita.",
        "في هذا المتجر توجد ____ جميلة جداً.",
        ["ropa"],
        ["ropa"],
        "كلمة ملابس في الإسبانية هي ropa وهي اسم مفرد مؤنث جامع."
    ),
    order_ex(
        "a1_tal_4_order",
        "رتّب السؤال للسؤال عن مكان غرف القياس.",
        ["grammar", "speaking"],
        2,
        ["¿Dónde", "están", "los", "probadores,", "por", "favor?"],
        "¿Dónde están los probadores, por favor?",
        "الترتيب القياسي للسؤال: أداة الاستفهام ¿Dónde + فعل الكينونة están + الفاعل los probadores + عبارة التأدب por favor?",
        ["ropa"]
    ),
    choice_ex(
        "a1_tal_5_shoes",
        "word_choice",
        "ما هو الرقم المستخدم للسؤال عن قياس الأحذية؟",
        ["vocabulary"],
        2,
        "للسؤال عن قياس الحذاء، نستخدم كلمة número أو talla:",
        "¿Qué ____ de zapatos calza usted?",
        "ما هو ____ حذاء حضرتك؟",
        [
            opt("a1_tal_5_a", "número", "رقم المقاس", True),
            opt("a1_tal_5_b", "color", "لون", False, "السؤال هنا عن المقاس وليس اللون."),
            opt("a1_tal_5_c", "camisa", "قميص", False, "سياق الجملة عن الأحذية zapatos.")
        ],
        ["zapato"],
        "مع الأحذية يُستخدم تعبير número de zapato أو talla."
    ),
    speak_ex(
        "a1_tal_6_speak",
        "انطق طلب تجربة الملابس بنبرة مهذبة.",
        ["speaking"],
        2,
        "اقرأ الجملة بصوت واضح ونبرة مؤدبة:",
        "¿Puedo probarme este pantalón en el probador?",
        "هل يمكنني تجربة هذا البنطال في غرفة القياس؟",
        "pending/a1-tal-ex-6",
        ["pantalón", "ropa"],
        "¿Puedo probarme este pantalón en el probador?",
        "انتبه لنطق حرف p المشدود في pro-bar-me وحرف b المرقق."
    )
]

# Lesson 4: a1-comprar
L_COM_P = {
    "slug": "a1-comprar",
    "titleAr": "إتمام عملية الشراء: الدفع والإيصال والاسترجاع",
    "level": "A1",
    "programSlug": "main-track",
    "unitSlug": "a1-u5-shopping",
    "objectiveAr": "أن يُجري المتعلم حوار شراء متكاملاً من السؤال عن السعر إلى اختيار وسيلة الدفع واستلام الفاتورة.",
    "estimatedMinutes": 12,
    "skills": ["speaking", "listening", "writing", "reading", "vocabulary"],
    "newVocabulary": ["comprar", "euro", "ropa", "camisa", "pantalón", "zapato", "cuenta"],
    "reviewVocabulary": ["bueno", "dos", "tres"],
    "targetStructures": [
        "Me lo llevo. ¿Cuánto es en total?",
        "¿Va a pagar en efectivo o con tarjeta?",
        "Aquí tiene su ticket de compra y el cambio."
    ],
    "grammarTopics": ["dialogo-compra-tienda", "pago-efectivo-tarjeta", "ticket-cambio"],
    "scenarios": [
        {
            "contextAr": "هدى تدفع ثمن قميص وحذاء في متجر ملابس عند صندوق المحاسبة (la caja).",
            "settingAr": "صندوق الدفع في متجر ملابس",
            "lines": [
                {
                    "es": "Hola, me llevo esta camisa y estos zapatos.",
                    "ar": "مرحباً، سآخذ هذا القميص وهذا الحذاء.",
                    "arEg": "أهلاً، هاخد القميص ده والجزمة دي.",
                    "audioKey": "pending/a1-cmp-sc-1"
                },
                {
                    "es": "Muy bien. Son cincuenta y cinco euros en total.",
                    "ar": "ممتاز. المجموع خمسة وخمسون يورو في الإجمالي.",
                    "arEg": "تمام. الحساب خمسة وخمسين يورو في التوتال.",
                    "audioKey": "pending/a1-cmp-sc-2"
                },
                {
                    "es": "¿Puedo pagar con tarjeta contactless?",
                    "ar": "هل يمكنني الدفع بالبطاقة اللاتلامسية؟",
                    "arEg": "ممكن أدفع بالفيزا تاتش؟",
                    "audioKey": "pending/a1-cmp-sc-3"
                },
                {
                    "es": "Sí, claro, acérquela al datáfono. Aquí tiene su ticket.",
                    "ar": "نعم بالطبع، قرّبيها من جهاز الدفع. تفضلي إيصال الشراء.",
                    "arEg": "أيوه طبعاً، قربيها من المكنة. اتفضلي الوصل.",
                    "audioKey": "pending/a1-cmp-sc-4"
                }
            ]
        }
    ],
    "culturalNoteAr": "الإيصال في المتاجر الإسبانية يُسمى 'el ticket' أو 'el recibo'. الدفع بالبطاقة والهاتف شائع جداً حتى للمبالغ الصغيرة (un euro أو menos). وتعبير 'Me lo llevo' يعني حرفياً: 'سآخذه / سأشتريه'.",
    "pedagogicalRationaleAr": "التعبير الحاسم لإتمام القرار بالشراء هو 'Me lo llevo' (للمذكر) أو 'Me la llevo' (للمؤنث). المتعلمون العرب يترجمون حرفياً *Voy a comprarlo، بينما التعبير الطبيعي اليومي هو Me lo llevo.",
    "status": "draft",
    "review": review_block()
}

EX_COM_P = [
    choice_ex(
        "a1_cmp_1_listen",
        "listen_choose",
        "استمع وحدد طريقة الدفع التي اختارتها المشتشية.",
        ["listening", "vocabulary"],
        1,
        "استمع إلى حوار الدفع:",
        "Voy a pagar con tarjeta de crédito, por favor.",
        "سأدفع ببطاقة الائتمان، من فضلك.",
        [
            opt("a1_cmp_1_a", "Con tarjeta", "بالبطاقة المصرفية", True),
            opt("a1_cmp_1_b", "En efectivo", "نقداً بالعملات الورقية", False, "الصوت ذكر con tarjeta وليس en efectivo."),
            opt("a1_cmp_1_c", "A plazos", "بالتقسيط", False, "لم يُذكر التقسيط في الحوار.")
        ],
        ["comprar", "ropa"],
        "المشترية قالت: Voy a pagar con tarjeta.",
        audioKey="pending/a1-cmp-ex-1",
        speechEs="Voy a pagar con tarjeta de crédito, por favor."
    ),
    choice_ex(
        "a1_cmp_2_take_it",
        "word_choice",
        "ما هو التعبير الطبيعي الذي تقوله للبائع عندما تقرر شراء القميص؟",
        ["speaking", "vocabulary"],
        2,
        "لتأكيد قرار الشراء للبائع نقول:",
        "Me gusta mucho, me lo ____.",
        "يعجبني كثيراً، سأـ____.",
        [
            opt("a1_cmp_2_a", "llevo", "آخذه / أشتريه", True),
            opt("a1_cmp_2_b", "dejo", "أتركه", False, "dejo تعني أتركه ولا أشتريه."),
            opt("a1_cmp_2_c", "pongo", "أضعه", False, "التعبير الإسباني الاصطلاحي للشراء هو Me lo llevo.")
        ],
        ["comprar", "camisa"],
        "التعبير الإسباني اليومي للشراء هو: Me lo llevo."
    ),
    fill_ex(
        "a1_cmp_3_fill",
        "اكتب كلمة اليورو بالإسبانية في الفراغ.",
        ["writing", "vocabulary"],
        1,
        "اكتب اسم العملة الأوروبية (euro):",
        "El pantalón cuesta cuarenta ____.",
        "البنطال يكلف أربعين ____.",
        ["euro", "pantalón"],
        ["euros"],
        "العملة هي euro وتُجمع بإضافة s: cuarenta euros."
    ),
    order_ex(
        "a1_cmp_4_order",
        "رتّب كلمات سؤال السؤال عن الدفع بالبطاقة.",
        ["grammar", "speaking"],
        2,
        ["¿Puedo", "pagar", "con", "tarjeta", "aquí?"],
        "¿Puedo pagar con tarjeta aquí?",
        "الترتيب: فعل الاستئذان ¿Puedo + المصدر pagar + حرف الجر con + الاسم tarjeta + ظرف المكان aquí?",
        ["comprar"]
    ),
    choice_ex(
        "a1_cmp_5_receipt",
        "word_choice",
        "ما هي الكلمة الإسبانية الدالة على إيصال الشراء؟",
        ["vocabulary"],
        1,
        "عند استلام إيصال الدفع في المتجر، يعطيك البائع:",
        "Aquí tiene su ____ de compra.",
        "تفضل ____ الشراء الخاص بك.",
        [
            opt("a1_cmp_5_a", "ticket", "إيصال الشراء", True),
            opt("a1_cmp_5_b", "zapato", "حذاء", False, "zapato تعني حذاء وليس إيصالاً."),
            opt("a1_cmp_5_c", "camisa", "قميص", False, "camisa تعني قميص.")
        ],
        ["comprar"],
        "إيصال الشراء في المتاجر الإسبانية يسمى el ticket."
    ),
    speak_ex(
        "a1_cmp_6_speak",
        "انطق جملة قرار الشراء والاستفسار عن السعر.",
        ["speaking"],
        2,
        "اقرأ الجملة بصوت واضح وواثق:",
        "Me lo llevo. ¿Cuánto es todo en total?",
        "سآخذه. كم يبلغ الحساب الإجمالي؟",
        "pending/a1-cmp-ex-6",
        ["comprar", "cuenta"],
        "Me lo llevo. ¿Cuánto es todo en total?",
        "احرص على الوصل الصوتي بين Me lo lle-vo و ¿Cuán-to es to-do?"
    )
]

# ==============================================================================
# UNIT 6: a1-u6-home (المنزل والغرف)
# ==============================================================================

# Lesson 1: a1-habitaciones
L_HAB = {
    "slug": "a1-habitaciones",
    "titleAr": "غرف المنزل: أجزاء البيت وتسمية المساحات",
    "level": "A1",
    "programSlug": "main-track",
    "unitSlug": "a1-u6-home",
    "objectiveAr": "أن يسمّي المتعلم غرف المنزل الأساسية (cocina, salón, baño, habitación) مع أدوات التعريف والتنكير المناسبة.",
    "estimatedMinutes": 12,
    "skills": ["vocabulary", "reading", "grammar", "listening", "speaking"],
    "newVocabulary": ["casa", "habitación", "cocina", "baño", "salón", "cama", "mesa", "silla"],
    "reviewVocabulary": ["dos", "tres", "bueno"],
    "targetStructures": [
        "Mi casa tiene un salón grande, una cocina y dos habitaciones.",
        "El baño está al lado del dormitorio.",
        "En mi habitación hay una cama y una mesa de estudio."
    ],
    "grammarTopics": ["vocabulario-partes-casa", "articulos-genero-habitaciones", "cuantificadores-habitaciones"],
    "scenarios": [
        {
            "contextAr": "بلال يُري صديقه خافيير شقته الجديدة التي استأجرها في فالنسيا ويصف له الغرف.",
            "settingAr": "شقة سكنية جديدة في فالنسيا",
            "lines": [
                {
                    "es": "¡Bienvenido a mi casa! Pasa, por favor.",
                    "ar": "أهلاً بك في منزلي! تفضل بالدخول، من فضلك.",
                    "arEg": "نورت بيتي! اتفضل ادخل.",
                    "audioKey": "pending/a1-hab-sc-1"
                },
                {
                    "es": "¡Qué casa tan luminosa! ¿Cuántas habitaciones tiene?",
                    "ar": "يا له من منزل مضيء! كم غرفة فيه؟",
                    "arEg": "يا له من بيت منور! فيه كام أوضة؟",
                    "audioKey": "pending/a1-hab-sc-2"
                },
                {
                    "es": "Tiene dos habitaciones, un salón amplio, la cocina y un baño.",
                    "ar": "فيه غرفتان وصالون واسع والمطبخ وحمام واحد.",
                    "arEg": "فيه أوضتين وصالة واسعة والمطبخ وحمام.",
                    "audioKey": "pending/a1-hab-sc-3"
                },
                {
                    "es": "Es un piso perfecto para ti, Bilal.",
                    "ar": "إنها شقة مثالية لك يا بلال.",
                    "arEg": "شقة ممتازة على مقاسك يا بلال.",
                    "audioKey": "pending/a1-hab-sc-4"
                }
            ]
        }
    ],
    "culturalNoteAr": "في إسبانيا معظم الناس في المدن يعيشون في شقق سكنية (pisos)، ومصطلح 'el salón' يعني غرفة المعيشة واستقبال الضيوف، بينما 'la cocina' المطبخ، و'el dormitorio' أو 'la habitación' غرفة النوم.",
    "pedagogicalRationaleAr": "كلمة habitación مؤنثة (la habitación / una habitación)، وcocina مؤنثة، بينما salón وbaño مذكران (el salón, el baño). يجب ترسيخ حفظ جنس كل غرفة مع أداتها.",
    "status": "draft",
    "review": review_block()
}

EX_HAB = [
    choice_ex(
        "a1_hab_1_listen",
        "listen_choose",
        "استمع للمتحدث وحدد عدد الغرف في الشقة.",
        ["listening", "vocabulary"],
        1,
        "استمع جيداً لوصف المنزل:",
        "Mi nuevo piso tiene tres habitaciones y un salón muy amplio.",
        "شقتي الجديدة فيها ثلاث غرف وصالون واسع للغاية.",
        [
            opt("a1_hab_1_a", "Tres habitaciones", "ثلاث غرف", True),
            opt("a1_hab_1_b", "Dos habitaciones", "غرفتان فقط", False, "الصوت ذكر tres (ثلاثة) وليس dos."),
            opt("a1_hab_1_c", "Una habitación", "غرفة واحدة", False, "الصوت ذكر ثلاث غرف.")
        ],
        ["habitación", "salón", "casa"],
        "المتحدث قال بوضوح: tiene tres habitaciones.",
        audioKey="pending/a1-hab-ex-1",
        speechEs="Mi nuevo piso tiene tres habitaciones y un salón muy amplio."
    ),
    choice_ex(
        "a1_hab_2_gender_salón",
        "word_choice",
        "اختر أداة التعريف المناسبة لكلمة salón (الصالون).",
        ["grammar"],
        1,
        "ما هي أداة التعريف المناسبة لكلمة salón؟",
        "En mi casa, ____ salón es muy luminoso.",
        "في منزلي، الـ____ صالون مضيء جداً.",
        [
            opt("a1_hab_2_a", "el", "أداة المذكر المفرد", True),
            opt("a1_hab_2_b", "la", "أداة المؤنث المفرد", False, "خطأ: كلمة salón مذكرة وتأخذ el وليس la."),
            opt("a1_hab_2_c", "las", "أداة الجمع المؤنث", False, "الكلمة مفردة مذكرة.")
        ],
        ["salón", "casa"],
        "كلمة salón مذكرة في الإسبانية: el salón."
    ),
    fill_ex(
        "a1_hab_3_fill",
        "اكتب كلمة المطبخ بالإسبانية في الفراغ.",
        ["writing", "vocabulary"],
        1,
        "اكتب كلمة (cocina) في الفراغ:",
        "Preparo la cena en la ____.",
        "أعد وجبة العشاء في الـ____.",
        ["cocina", "casa"],
        ["cocina"],
        "المطبخ في الإسبانية هو: la cocina."
    ),
    order_ex(
        "a1_hab_4_order",
        "رتّب الجملة لوصف أجزاء المنزل.",
        ["grammar", "reading"],
        2,
        ["La", "casa", "tiene", "un", "baño", "moderno."],
        "La casa tiene un baño moderno.",
        "الترتيب: الفاعل La casa + الفعل tiene + المفعول un baño + الصفة moderno.",
        ["casa", "baño"]
    ),
    choice_ex(
        "a1_hab_5_bed",
        "word_choice",
        "ما هو الأثاث الأساسي الذي يوجد في غرفة النوم؟",
        ["vocabulary"],
        1,
        "في غرفة النوم (la habitación) توجد عادة:",
        "En el dormitorio hay una ____ cómoda.",
        "في غرفة النوم يوجد ____ مريح.",
        [
            opt("a1_hab_5_a", "cama", "سرير", True),
            opt("a1_hab_5_b", "cocina", "مطبخ", False, "cocina هي غرفة وليست قطعة أثاث للنوم."),
            opt("a1_hab_5_c", "baño", "حمام", False, "baño هو الحمام.")
        ],
        ["cama", "habitación"],
        "السرير بالإسبانية هو la cama وهو مؤنث."
    ),
    speak_ex(
        "a1_hab_6_speak",
        "انطق جملة وصف غرف الشقة بنطق سليم.",
        ["speaking"],
        2,
        "اقرأ الجملة بصوت واضح:",
        "Mi casa tiene dos habitaciones, salón, cocina y baño.",
        "منزلي يضم غرفتين وصالوناً ومطبخاً وحماماً.",
        "pending/a1-hab-ex-6",
        ["casa", "habitación", "salón", "cocina", "baño"],
        "Mi casa tiene dos habitaciones, salón, cocina y baño.",
        "انتبه لنطق حرف b في ha-bi-ta-cio-nes وحرف c في co-ci-na."
    )
]

# Lesson 2: a1-hay-estar
L_HAY = {
    "slug": "a1-hay-estar",
    "titleAr": "الوجود والمكان: التمييز الحاسم بين Hay و Está / Están",
    "level": "A1",
    "programSlug": "main-track",
    "unitSlug": "a1-u6-home",
    "objectiveAr": "أن يفرّق المتعلم بين التعبير عن الوجود غير المحدد (hay + un/una/sustantivo sin artículo) وبين تحديد مكان شيء معروف أو معرّف (está/están + el/la/los/las).",
    "estimatedMinutes": 12,
    "skills": ["grammar", "reading", "writing", "listening", "speaking"],
    "newVocabulary": ["casa", "habitación", "cocina", "baño", "salón", "mesa", "silla", "cama", "estar"],
    "reviewVocabulary": ["bueno", "grande", "dos"],
    "targetStructures": [
        "En el salón hay una mesa grande. (وجود نكرة)",
        "La mesa está en el salón. (تحديد موضع معرّف)",
        "¿Dónde está el baño? — Al final del pasillo."
    ],
    "grammarTopics": ["diferencia-hay-vs-esta", "haber-existencia-indeterminada", "estar-localizacion-determinada"],
    "scenarios": [
        {
            "contextAr": "منى تسأل مالكة الشقة الإسبانية دونيا كارمن عما يتوفر في الشقة وأين تقع المرافق.",
            "settingAr": "جولة تفقدية في شقة للإيجار",
            "lines": [
                {
                    "es": "¿En la cocina hay lavadora y microondas?",
                    "ar": "هل يوجد في المطبخ غسالة وميكروويف؟",
                    "arEg": "هو في المطبخ فيه غسالة وميكروويف؟",
                    "audioKey": "pending/a1-hay-sc-1"
                },
                {
                    "es": "Sí, en la cocina hay de todo. Está todo equipado.",
                    "ar": "نعم، في المطبخ يوجد كل شيء. كل شيء مجهز.",
                    "arEg": "أيوه، في المطبخ فيه كل حاجة. مجهز تماماً.",
                    "audioKey": "pending/a1-hay-sc-2"
                },
                {
                    "es": "¿Y dónde está la llave de paso del agua?",
                    "ar": "وأين يوجد محبس الماء الرئيسي؟",
                    "arEg": "وفين محبس المية الرئيسي؟",
                    "audioKey": "pending/a1-hay-sc-3"
                },
                {
                    "es": "La llave está debajo del fregadero.",
                    "ar": "المحبس يقع تحت حوض الغسيل.",
                    "arEg": "المحبس تحت الحوض.",
                    "audioKey": "pending/a1-hay-sc-4"
                }
            ]
        }
    ],
    "culturalNoteAr": "قاعدة التفريق بين Hay و Está من الركائز الأساسية في اللغة الإسبانية: Hay لا تأتي أبداً مع أدوات التعريف (el, la, los, las) ولا مع أسماء العلم أو ضمائر الملكية، بينما Está/Están تأتي لتحديد مكان هذه الأشياء المعرّفة حصراً.",
    "pedagogicalRationaleAr": "المتعلم العربي يترجم 'يوجد' و'كائن' بنفس الكلمة، فيقع في أخطاء فادحة مثل: *¿Dónde hay el baño? بدلاً من ¿Dónde está el baño? أو *En la habitación está una cama بدلاً من En la habitación hay una cama. التركيز الصارم على نوع الأداة (نكرة = hay / معرفة = está) يحل المشكلة جذرياً.",
    "status": "draft",
    "review": review_block()
}

EX_HAY = [
    choice_ex(
        "a1_hay_1_listen",
        "listen_choose",
        "استمع وحدد ما إذا كانت الجملة تعبر عن وجود شيء أم موضعه.",
        ["listening", "grammar"],
        1,
        "استمع جيداً للجملة:",
        "En mi habitación hay dos ventanas grandes.",
        "في غرفتي توجد نافذتان كبيرتان.",
        [
            opt("a1_hay_1_a", "Expresa existencia (hay)", "تعبير عن وجود شيء (hay)", True),
            opt("a1_hay_1_b", "Expresa localización (está)", "تعبير عن موضع شيء محدد (está)", False, "الجملة استخدمت hay مع عدد dos ventanas للدلالة على الوجود وليس está."),
            opt("a1_hay_1_c", "Expresa deseo (querer)", "تعبير عن الرغبة (querer)", False, "لم يُستخدم فعل querer هنا.")
        ],
        ["habitación", "casa"],
        "استخدام hay مع الأعداد (dos ventanas) يدل على بيان الوجود غير المحدد.",
        audioKey="pending/a1-hay-ex-1",
        speechEs="En mi habitación hay dos ventanas grandes."
    ),
    choice_ex(
        "a1_hay_2_choice_hay",
        "word_choice",
        "اختر الفعل المناسب قبل أداة التنكير (una mesa).",
        ["grammar"],
        2,
        "مع أداة التنكير (una mesa) للدلالة على الوجود، نستخدم:",
        "En el salón ____ una mesa redonda.",
        "في الصالون ____ طاولة مستديرة.",
        [
            opt("a1_hay_2_a", "hay", "يوجد (مع النكرة)", True),
            opt("a1_hay_2_b", "está", "يقع/يكون للمعرّف", False, "خطأ: está لا تُستخدم مع أداة التنكير una، بل hay una mesa."),
            opt("a1_hay_2_c", "es", "يكون للتعريف", False, "es لا تُستخدم للإخبار عن وجود الأشياء في الأماكن.")
        ],
        ["mesa", "salón"],
        "القاعدة: hay + una mesa (نكرة)."
    ),
    fill_ex(
        "a1_hay_3_fill",
        "أكمل بالفعل المناسب للسؤال عن موضع الحمام المعرّف (el baño).",
        ["writing", "grammar"],
        2,
        "اكتب صيغة الفعل estar المناسبة في السؤال: «أين الحمام؟»",
        "¿Dónde ____ el baño, por favor?",
        "أين ____ الحمام، من فضلك؟",
        ["baño", "estar"],
        ["está"],
        "مع الاسم المعرّف بـ el (el baño) نسأل بـ: ¿Dónde está el baño?"
    ),
    order_ex(
        "a1_hay_4_order",
        "رتّب الجملة لبيان موضع الكراسي المعرفة في المطبخ.",
        ["grammar", "reading"],
        2,
        ["Las", "sillas", "están", "en", "la", "cocina."],
        "Las sillas están en la cocina.",
        "الترتيب: الفاعل المعرّف بالجمع Las sillas + الفعل están + شبه الجملة en la cocina.",
        ["silla", "cocina", "estar"]
    ),
    choice_ex(
        "a1_hay_5_plural_hay",
        "word_choice",
        "اختر الكلمة المناسبة لبيان عدم وجود كراسٍ في الغرفة.",
        ["grammar"],
        2,
        "لبيان عدم وجود أي كراسي، نقول:",
        "En esta habitación no ____ sillas.",
        "في هذه الغرفة لا ____ كراسٍ.",
        [
            opt("a1_hay_5_a", "hay", "لا يوجد (اسم بلا أداة)", True),
            opt("a1_hay_5_b", "están", "لا يقعون (للمعرّف فقط)", False, "خطأ: كلمة sillas بدون أداة تعريف، لذا نستخدم hay وليس están."),
            opt("a1_hay_5_c", "son", "لا يكونون", False, "الفعل ser لا يُستخدم لوجود الأشياء في الأماكن.")
        ],
        ["silla", "habitación"],
        "مع الأسماء المجردة من الأداة نستخدم hay: no hay sillas."
    ),
    speak_ex(
        "a1_hay_6_speak",
        "انطق جملة السؤال عن موضع المطبخ بنطق سليم.",
        ["speaking"],
        1,
        "اقرأ الجملة بصوت واضح ونبرة استفهامية صحيحة:",
        "¿Dónde está la cocina de la casa?",
        "أين يقع مطبخ المنزل؟",
        "pending/a1-hay-ex-6",
        ["cocina", "casa", "estar"],
        "¿Dónde está la cocina de la casa?",
        "ركز على نبرة الاستفهام في ¿Dón-de es-tá...?"
    )
]

# Lesson 3: a1-muebles
L_MUE = {
    "slug": "a1-muebles",
    "titleAr": "الأثاث والمواضع: حروف وظروف المكان داخل المنزل",
    "level": "A1",
    "programSlug": "main-track",
    "unitSlug": "a1-u6-home",
    "objectiveAr": "أن يصف المتعلم موضع الأثاث مستخدماً حروف وظروف المكان: encima de, debajo de, al lado de, delante de, detrás de مع فعل estar.",
    "estimatedMinutes": 12,
    "skills": ["grammar", "vocabulary", "reading", "listening", "speaking"],
    "newVocabulary": ["mesa", "silla", "cama", "habitación", "salón", "cocina", "casa", "estar"],
    "reviewVocabulary": ["dos", "bueno", "tres"],
    "targetStructures": [
        "El libro está encima de la mesa.",
        "La silla está al lado de la cama.",
        "Los zapatos están debajo de la cama."
    ],
    "grammarTopics": ["preposiciones-lugar", "encima-debajo-al-lado", "localizacion-objetos-cotidianos"],
    "scenarios": [
        {
            "contextAr": "كريم يبحث عن مفاتيحه وهاتفه في الشقة ويسأل زميله كارلوس عن مكانهما.",
            "settingAr": "غرفة المعيشة في الشقة المشتركة",
            "lines": [
                {
                    "es": "Carlos, ¿has visto mis llaves? No las encuentro.",
                    "ar": "كارلوس، هل رأيت مفاتيحي؟ لا أجدها.",
                    "arEg": "كارلوس، شفت مفاتيحي؟ مش لاقيها.",
                    "audioKey": "pending/a1-mue-sc-1"
                },
                {
                    "es": "Sí, están encima de la mesa del salón, al lado de tu ordenador.",
                    "ar": "نعم، هي فوق طاولة الصالون، بجانب حاسوبك.",
                    "arEg": "أيوه، فوق ترابيزة الصالة، جنب اللاب توب بتاعك.",
                    "audioKey": "pending/a1-mue-sc-2"
                },
                {
                    "es": "¡Ah, qué alivio! ¿Y mis zapatillas?",
                    "ar": "يا لراحة البال! وماذا عن حذائي المنزلي؟",
                    "arEg": "الحمد لله! والشبشب بتاعي فين؟",
                    "audioKey": "pending/a1-mue-sc-3"
                },
                {
                    "es": "Están debajo de la cama, en tu habitación.",
                    "ar": "تحت السرير، في غرفتك.",
                    "arEg": "تحت السرير في أوضتك.",
                    "audioKey": "pending/a1-mue-sc-4"
                }
            ]
        }
    ],
    "culturalNoteAr": "ظروف المكان المركبة في الإسبانية تنتهي دائماً بحرف الجر 'de' قبل الاسم المجرور: encima de la mesa, debajo de la cama, al lado de la silla. وإسقاط 'de' خطأ لغوي شائع جداً.",
    "pedagogicalRationaleAr": "المتعلم العربي قد يقول *encima la mesa بترجمة حرفية لـ'فوق الطاولة' دون وضع de. يجب التشديد على أن 'de' ملازمة لكل من: encima de, debajo de, al lado de, detrás de, delante de.",
    "status": "draft",
    "review": review_block()
}

EX_MUE = [
    choice_ex(
        "a1_mue_1_listen",
        "listen_choose",
        "استمع للمتحدث وحدد أين يقع الهاتف.",
        ["listening", "vocabulary"],
        1,
        "استمع جيداً لموضع الشيء:",
        "El teléfono móvil está encima de la mesa.",
        "الهاتف المحمول موجود فوق الطاولة.",
        [
            opt("a1_mue_1_a", "Encima de la mesa", "فوق الطاولة", True),
            opt("a1_mue_1_b", "Debajo de la mesa", "تحت الطاولة", False, "الصوت قال encima de (فوق) وليس debajo de (تحت)."),
            opt("a1_mue_1_c", "Dentro del armario", "داخل الخزانة", False, "لم تُذكر الخزانة في التسجيل.")
        ],
        ["mesa", "estar"],
        "الصوت ذكر بوضوح: encima de la mesa (فوق الطاولة).",
        audioKey="pending/a1-mue-ex-1",
        speechEs="El teléfono móvil está encima de la mesa."
    ),
    choice_ex(
        "a1_mue_2_preposition",
        "word_choice",
        "اختر حرف الجر الإلزامي بعد ظرف المكان (debajo).",
        ["grammar"],
        2,
        "ما هو الحرف المكمل لظرف المكان debajo؟",
        "Los zapatos están debajo ____ la cama.",
        "الأحذية موجودة تحت ____ السرير.",
        [
            opt("a1_mue_2_a", "de", "حرف الجر de الإلزامي", True),
            opt("a1_mue_2_b", "en", "حرف الجر en", False, "خطأ: التركيب الصحيح هو debajo de وليس debajo en."),
            opt("a1_mue_2_c", "a", "حرف الجر a", False, "خطأ: التركيب الإسباني يتطلب de.")
        ],
        ["cama", "estar"],
        "التركيب الصحيح هو دائماً: debajo de."
    ),
    fill_ex(
        "a1_mue_3_fill",
        "اكتب كلمة الكرسي بالإسبانية في الفراغ.",
        ["writing", "vocabulary"],
        1,
        "اكتب كلمة (silla) في الفراغ:",
        "La ____ está al lado de la ventana.",
        "الـ____ بجانب النافذة.",
        ["silla", "estar"],
        ["silla"],
        "الكرسي بالإسبانية هو: la silla وهو اسم مؤنث."
    ),
    order_ex(
        "a1_mue_4_order",
        "رتّب الجملة لبيان موضع الكرسي بالنسبة للطاولة.",
        ["grammar", "reading"],
        2,
        ["La", "silla", "está", "al", "lado", "de", "la", "mesa."],
        "La silla está al lado de la mesa.",
        "الترتيب: الفاعل La silla + الفعل está + ظرف المكان المركب al lado de + المجرور la mesa.",
        ["silla", "mesa", "estar"]
    ),
    choice_ex(
        "a1_mue_5_under",
        "word_choice",
        "كيف نقول إن القطة موجودة «تحت الطاولة»؟",
        ["vocabulary", "grammar"],
        1,
        "التعبير الصحيح لـ «تحت الطاولة» هو:",
        "El gato duerme ____ de la mesa.",
        "القط ينام ____ الطاولة.",
        [
            opt("a1_mue_5_a", "debajo", "تحت", True),
            opt("a1_mue_5_b", "encima", "فوق", False, "encima تعني فوق، والمطلوب تحت."),
            opt("a1_mue_5_c", "lejos", "بعيد", False, "lejos تعني بعيد.")
        ],
        ["mesa"],
        "debajo de تعني تحـت."
    ),
    speak_ex(
        "a1_mue_6_speak",
        "انطق جملة موضع الأثاث بنطق واضح.",
        ["speaking"],
        2,
        "اقرأ الجملة بصوت مسموع:",
        "La cama está al lado de la mesa de noche.",
        "السرير يقع بجانب طاولة السرير.",
        "pending/a1-mue-ex-6",
        ["cama", "mesa", "estar"],
        "La cama está al lado de la mesa de noche.",
        "انتبه لوصل al la-do de la me-sa."
    )
]

# Lesson 4: a1-rutina-casa
L_RUT_C = {
    "slug": "a1-rutina-casa",
    "titleAr": "وصف المنزل والعيش: التعبير المتكامل عن السكن",
    "level": "A1",
    "programSlug": "main-track",
    "unitSlug": "a1-u6-home",
    "objectiveAr": "أن يكتب المتعلم وينطق فقرة وصفية متكاملة عن منزله وموقعه ومحتوياته وتفضيلاته للغرف.",
    "estimatedMinutes": 12,
    "skills": ["writing", "speaking", "reading", "listening", "grammar"],
    "newVocabulary": ["casa", "habitación", "salón", "cocina", "baño", "mesa", "estar", "gustar"],
    "reviewVocabulary": ["blanco", "grande", "dos"],
    "targetStructures": [
        "Vivo en un piso luminoso en el centro.",
        "Mi habitación favorita es el salón porque es muy amplio.",
        "En mi casa me gusta descansar y leer."
    ],
    "grammarTopics": ["redaccion-descripcion-vivienda", "expresar-preferencia-estancias", "conectores-basicos-y-pero-porque"],
    "scenarios": [
        {
            "contextAr": "سلمى تكتب نصاً قصيراً لمدونتها في معهد سيرفانتس تصف فيه منزلها وحياتها اليومية فيه.",
            "settingAr": "فصل تعليم اللغة الإسبانية في المعهد",
            "lines": [
                {
                    "es": "Vivo en un apartamento pequeño pero muy cómodo.",
                    "ar": "أعيش في شقة صغيرة لكنها مريحة للغاية.",
                    "arEg": "عايشة في شقة صغيرة بس مريحة جداً.",
                    "audioKey": "pending/a1-rc-sc-1"
                },
                {
                    "es": "Tiene un salón con dos ventanas grandes y mucha luz.",
                    "ar": "فيها صالون بنافذتين كبيرتين وكثير من الضوء.",
                    "arEg": "فيها صالة بشباكين كبار ونور كتير.",
                    "audioKey": "pending/a1-rc-sc-2"
                },
                {
                    "es": "Mi rincón preferido es la mesa del salón para estudiar.",
                    "ar": "ركني المفضل هو طاولة الصالون للدراسة.",
                    "arEg": "مكاني المفضل هو ترابيزة الصالة للمذاكرة.",
                    "audioKey": "pending/a1-rc-sc-3"
                },
                {
                    "es": "Me gusta mucho mi casa porque es tranquila.",
                    "ar": "يعجبني منزلي كثيراً لأنه هادئ.",
                    "arEg": "بحب بيتي أوي عشان هادي.",
                    "audioKey": "pending/a1-rc-sc-4"
                }
            ]
        }
    ],
    "culturalNoteAr": "الإسبان يقضون وقتاً طويلاً في 'el salón' مع العائلة، ولكن 'la cocina' تُعد في كثير من البيوت مكاناً حيوياً للأحاديث الصباحية وتناول القهوة السريعة.",
    "pedagogicalRationaleAr": "الهدف هنا هو دمج المفردات والقواعد السابقة (غرف، أثاث، hay، está، gustar) في فقرة سردية متصلة باستخدام أدوات الربط: y (و)، pero (لكن)، porque (لأن).",
    "status": "draft",
    "review": review_block()
}

EX_RUT_C = [
    choice_ex(
        "a1_rc_1_listen",
        "listen_choose",
        "استمع للفقرة وحدد لماذا يفضل المتحدث منزله.",
        ["listening", "reading"],
        1,
        "استمع جيداً لرأي المتحدث في منزله:",
        "Me gusta mucho mi casa porque es muy tranquila y luminosa.",
        "يعجبني منزلي كثيراً لأنه هادئ ومضيء للغاية.",
        [
            opt("a1_rc_1_a", "Es tranquila y luminosa", "هادئ ومضيء", True),
            opt("a1_rc_1_b", "Es grande y barata", "كبير ورخيص", False, "الصوت ذكر tranquila y luminosa وليس barata."),
            opt("a1_rc_1_c", "Está cerca de la playa", "قريب من الشاطئ", False, "لم يُذكر الشاطئ في التسجيل.")
        ],
        ["casa", "gustar"],
        "المتحدث قال: porque es muy tranquila y luminosa.",
        audioKey="pending/a1-rc-ex-1",
        speechEs="Me gusta mucho mi casa porque es muy tranquila y luminosa."
    ),
    choice_ex(
        "a1_rc_2_connector",
        "word_choice",
        "اختر أداة التعليل المناسبة لبيان السبب (لأن).",
        ["grammar"],
        2,
        "كيف نعلل سبب إعجابنا بالمنزل بـ «لأن»؟",
        "Me gusta mi habitación ____ es muy cómoda.",
        "تعجبني غرفتي ____ مريحة جداً.",
        [
            opt("a1_rc_2_a", "porque", "لأن (أداة التعليل متصلة)", True),
            opt("a1_rc_2_b", "¿por qué?", "لماذا (سؤال منفصل)", False, "خطأ: ¿por qué? للاستفهام، أما للإجابة والتعليل فنكتب porque ككلمة واحدة وبلا نبرة."),
            opt("a1_rc_2_c", "pero", "لكن (استدراك)", False, "الجملة تذكر سبباً وليس استدراكاً.")
        ],
        ["habitación", "gustar"],
        "أداة بيان السبب هي: porque."
    ),
    fill_ex(
        "a1_rc_3_fill",
        "اكتب كلمة المنزل بالإسبانية في الفراغ.",
        ["writing", "vocabulary"],
        1,
        "اكتب كلمة (casa) في الفراغ:",
        "Por las tardes descanso en ____.",
        "في المساء أستريح في الـ____.",
        ["casa"],
        ["casa"],
        "كلمة منزل أو بيت بالإسبانية هي: casa."
    ),
    order_ex(
        "a1_rc_4_order",
        "رتّب الجملة لوصف المنزل وصفاً متكاملاً.",
        ["grammar", "writing"],
        2,
        ["Vivo", "en", "una", "casa", "muy", "tranquila."],
        "Vivo en una casa muy tranquila.",
        "الترتيب: الفعل Vivo + حرف الجر en + أداة التنكير una + الاسم casa + الظرف muy + الصفة tranquila.",
        ["casa"]
    ),
    choice_ex(
        "a1_rc_5_verb_live",
        "word_choice",
        "اختر تصريف فعل السكن والعيش (vivir) مع ضمير المتكلم (yo).",
        ["grammar"],
        1,
        "كيف تقول: «أنا أعيش في مدريد»؟",
        "Yo ____ en un piso céntrico.",
        "أنا ____ في شقة وسط المدينة.",
        [
            opt("a1_rc_5_a", "vivo", "أعيش (تصريف المتكلم)", True),
            opt("a1_rc_5_b", "vives", "أنت تعيش", False, "vives تصريف ضمير المخاطب tú."),
            opt("a1_rc_5_c", "vive", "هو يعيش", False, "vive تصريف الغائب él/ella.")
        ],
        ["casa"],
        "تصريف فعل vivir مع yo هو: vivo."
    ),
    speak_ex(
        "a1_rc_6_speak",
        "انطق جملة وصف المنزل وثقتك فيه بنطق واضح.",
        ["speaking"],
        2,
        "اقرأ الجملة بصوت معبر وواضح:",
        "Mi casa tiene un salón luminoso y me gusta mucho.",
        "منزلي يضم صالوناً مضيئاً ويعجبني كثيراً.",
        "pending/a1-rc-ex-6",
        ["casa", "salón", "gustar"],
        "Mi casa tiene un salón luminoso y me gusta mucho.",
        "احرص على الربط السلس بين lu-mi-no-so y me gus-ta mu-cho."
    )
]

# ==============================================================================
# UNIT 7: a1-u7-routine (الروتين اليومي وأوقات الفراغ)
# ==============================================================================

# Lesson 1: a1-verbos-rutina
L_VRUT = {
    "slug": "a1-verbos-rutina",
    "titleAr": "أفعال الروتين اليومي: تصريف الأفعال الأساسية في المضارع البسيط",
    "level": "A1",
    "programSlug": "main-track",
    "unitSlug": "a1-u7-routine",
    "objectiveAr": "أن يصرّف المتعلم أفعال الروتين اليومي (desayunar, comer, cenar, trabajar, estudiar, dormir) في المضارع البسيط مع ضمائر الفاعل المختلفة بدقة.",
    "estimatedMinutes": 12,
    "skills": ["grammar", "vocabulary", "reading", "writing", "speaking"],
    "newVocabulary": ["desayunar", "comer", "cenar", "trabajar", "estudiar", "dormir", "rutina", "diario"],
    "reviewVocabulary": ["casa", "pan", "café"],
    "targetStructures": [
        "Por la mañana desayuno café con tostadas.",
        "Como en el trabajo a las dos de la tarde.",
        "Ceno con mi familia a las nueve."
    ],
    "grammarTopics": ["verbos-rutina-presente", "verbos-comidas-desayunar-comer-cenar", "cambio-vocalico-dormir"],
    "scenarios": [
        {
            "contextAr": "عصام يصف لزميله الإسباني خوليو جدوله اليومي المعتاد من الإفطار حتى العشاء.",
            "settingAr": "كافتيريا الجامعة في إشبيلية",
            "lines": [
                {
                    "es": "¿A qué hora desayunas normalmente, Issam?",
                    "ar": "في أي ساعة تتناول إفطارك عادة يا عصام؟",
                    "arEg": "بتفطر الساعة كام عادة يا عصام؟",
                    "audioKey": "pending/a1-vr-sc-1"
                },
                {
                    "es": "Desayuno a las ocho en casa, y luego salgo a estudiar.",
                    "ar": "أتناول الإفطار في الثامنة بالبيت، ثم أخرج للدراسة.",
                    "arEg": "بفطر الساعة تمانية في البيت، وبعدها بخرج أذاكر.",
                    "audioKey": "pending/a1-vr-sc-2"
                },
                {
                    "es": "¿Y dónde comes al mediodía?",
                    "ar": "وأين تتناول الغداء وقت الظهيرة؟",
                    "arEg": "وبتتغدى فين الضهر؟",
                    "audioKey": "pending/a1-vr-sc-3"
                },
                {
                    "es": "Como en el comedor universitario con mis compañeros.",
                    "ar": "أتغدى في مطعم الجامعة مع زملائي.",
                    "arEg": "بتغدى في مطعم الجامعة مع زمايلي.",
                    "audioKey": "pending/a1-vr-sc-4"
                }
            ]
        }
    ],
    "culturalNoteAr": "في إسبانيا الوجبات لها أفعال مخصصة: desayunar (الإفطار)، comer أو almorzar (الغداء، وهو الوجبة الأكبر وتكون بين 14:00 و15:30)، وcenar (العشاء، ويكون متأخراً عادة بعد 21:00).",
    "pedagogicalRationaleAr": "الفعل dormir يحدث فيه تحول حرفي (o -> ue): duermo, duermes, duerme, duermen (ولكن dormimos). بينما desayunar, comer, cenar, trabajar, estudiar أفعال منتظمة. يجب تثبيت هذه المنظومة للمتعلم.",
    "status": "draft",
    "review": review_block()
}

EX_VRUT = [
    choice_ex(
        "a1_vr_1_listen",
        "listen_choose",
        "استمع وحدد ماذا يفعل المتحدث في الصباح.",
        ["listening", "vocabulary"],
        1,
        "استمع لنشاط الصباح:",
        "Todas las mañanas desayuno café con leche y una tostada.",
        "كل صباح أتناول في الإفطار قهوة بالحليب وخبزاً محمصاً.",
        [
            opt("a1_vr_1_a", "Desayuna café con leche", "يتناول الإفطار قهوة بحليب", True),
            opt("a1_vr_1_b", "Come carne y arroz", "يتناول الغداء لحماً وأرزاً", False, "الصوت ذكر desayunar وليس comer."),
            opt("a1_vr_1_c", "Duerme hasta tarde", "ينام لوقت متأخر", False, "المتحدث يفطر صباحاً ولا ينام.")
        ],
        ["desayunar", "café", "rutina"],
        "الصوت ذكر بوضوح: desayuno café con leche.",
        audioKey="pending/a1-vr-ex-1",
        speechEs="Todas las mañanas desayuno café con leche y una tostada."
    ),
    choice_ex(
        "a1_vr_2_conjugation_comer",
        "word_choice",
        "اختر تصريف الفعل comer المناسب لضمير المتكلم (yo).",
        ["grammar"],
        1,
        "كيف تقول: «أنا أتناول الغداء في البيت»؟",
        "Normalmente yo ____ en casa con mi familia.",
        "عادة أنا ____ في البيت مع عائلتي.",
        [
            opt("a1_vr_2_a", "como", "أتغدى / آكل (تصريف yo)", True),
            opt("a1_vr_2_b", "comes", "تتغدى (تصريف tú)", False, "comes مع ضمير المخاطب tú."),
            opt("a1_vr_2_c", "come", "يتغدى (تصريف él)", False, "come مع ضمير الغائب él/ella.")
        ],
        ["comer", "casa", "rutina"],
        "تصريف الفعل comer مع yo هو: como."
    ),
    fill_ex(
        "a1_vr_3_fill",
        "أكمل بتصريف فعل العمل (trabajar) مع ضمير المتكلم.",
        ["writing", "grammar"],
        1,
        "اكتب كلمة (trabajo) في الفراغ:",
        "De lunes a viernes ____ en una oficina.",
        "من الاثنين إلى الجمعة ____ في مكتب.",
        ["trabajar", "rutina"],
        ["trabajo"],
        "تصريف الفعل trabajar مع yo هو: trabajo."
    ),
    order_ex(
        "a1_vr_4_order",
        "رتّب الجملة لبيان تناول العشاء ليلاً.",
        ["grammar", "reading"],
        2,
        ["Ceno", "con", "mi", "familia", "por", "la", "noche."],
        "Ceno con mi familia por la noche.",
        "الترتيب: الفعل Ceno + شبه الجملة con mi familia + الظرف الزمني por la noche.",
        ["cenar", "rutina"]
    ),
    choice_ex(
        "a1_vr_5_dormir",
        "word_choice",
        "اختر التصريف الصحيح لفعل النوم (dormir) مع ضمير المتكلم.",
        ["grammar"],
        2,
        "فعل dormir غير منتظم مع yo ويصبح:",
        "Todos los días ____ ocho horas.",
        "كل يوم ____ ثماني ساعات.",
        [
            opt("a1_vr_5_a", "duermo", "أنام (بتحول o إلى ue)", True),
            opt("a1_vr_5_b", "dormo", "تصريف خاطئ بدون تحول", False, "فعل dormir غير منتظم ويتحول إلى duermo مع yo."),
            opt("a1_vr_5_c", "duermes", "تنام (مع tú)", False, "duermes مع ضمير المخاطب tú.")
        ],
        ["dormir", "rutina"],
        "الفعل dormir يتحول إلى duermo مع ضمير المتكلم."
    ),
    speak_ex(
        "a1_vr_6_speak",
        "انطق جملة روتين الدراسة والعمل بنطق واضح.",
        ["speaking"],
        2,
        "اقرأ الجملة بصوت واضح وثقة:",
        "Por las mañanas estudio y por las tardes trabajo.",
        "في الصباح أدرس وفي المساء أعمل.",
        "pending/a1-vr-ex-6",
        ["estudiar", "trabajar", "rutina"],
        "Por las mañanas estudio y por las tardes trabajo.",
        "انتبه للتقابل الصوتي بين es-tu-dio و tra-ba-jo."
    )
]

# Lesson 2: a1-hora-rutina
L_HRUT = {
    "slug": "a1-hora-rutina",
    "titleAr": "الروتين والوقت: ربط الأنشطة اليومية بالساعات والتكرار",
    "level": "A1",
    "programSlug": "main-track",
    "unitSlug": "a1-u7-routine",
    "objectiveAr": "أن يربط المتعلم بين النشاط اليومي وتوقيته المحدد باستخدام a las... وظروف التكرار (siempre, normalmente, nunca).",
    "estimatedMinutes": 12,
    "skills": ["grammar", "listening", "speaking", "reading", "writing"],
    "newVocabulary": ["hora", "tiempo", "siempre", "nunca", "desayunar", "comer", "cenar", "trabajar", "dormir"],
    "reviewVocabulary": ["dos", "tres", "cuatro"],
    "targetStructures": [
        "Me levanto siempre a las siete de la mañana.",
        "Normalmente como a las dos y media.",
        "Nunca ceno muy tarde."
    ],
    "grammarTopics": ["adverbios-frecuencia-siempre-nunca", "conector-a-las-horas-rutina", "rutina-cronologica"],
    "scenarios": [
        {
            "contextAr": "أميرة تشرح لمرشدتها الطلابية في الجامعة كيف تنظم يومها بين المحاضرات والمذاكرة.",
            "settingAr": "مكتب الإرشاد الطلابي في الجامعة",
            "lines": [
                {
                    "es": "¿A qué hora empiezas tu día de estudio, Amira?",
                    "ar": "في أي ساعة تبدئين يومك الدراسي يا أميرة؟",
                    "arEg": "بتبدأي يومك الدراسي الساعة كام يا أميرة؟",
                    "audioKey": "pending/a1-hr-sc-1"
                },
                {
                    "es": "Siempre me levanto a las siete y desayuno a las siete y media.",
                    "ar": "دائماً أستيقظ في السابعة وأفطر في السابعة والنصف.",
                    "arEg": "دايماً بصحى سبعة وبفطر سبعة ونص.",
                    "audioKey": "pending/a1-hr-sc-2"
                },
                {
                    "es": "¿Y tienes tiempo libre por la tarde?",
                    "ar": "وهل لديك وقت فراغ بعد الظهر؟",
                    "arEg": "وعندك وقت فراغ بعد الضهر؟",
                    "audioKey": "pending/a1-hr-sc-3"
                },
                {
                    "es": "Sí, a las seis salgo a caminar con mis amigas.",
                    "ar": "نعم، في السادسة أخرج للمشي مع صديقاتي.",
                    "arEg": "أيوه، الساعة ستة بخرج أتمشى مع صحباتي.",
                    "audioKey": "pending/a1-hr-sc-4"
                }
            ]
        }
    ],
    "culturalNoteAr": "ظروف التكرار في الإسبانية تتدرج: siempre (دائماً = 100%)، normalmente (عادة = 80%)، a veces (أحياناً = 50%)، nunca (أبداً = 0%). وظرف nunca يأتي قبل الفعل: 'Nunca ceno tarde' أو بعده مع النفي: 'No ceno nunca tarde'.",
    "pedagogicalRationaleAr": "الربط بين وقت الحدث وحرف الجر 'a las': Desayuno a las ocho (أفطر في الثامنة). حذف 'a' خطأ متكرر. كما يجب ضبط وضع ظروف التكرار بسلاسة.",
    "status": "draft",
    "review": review_block()
}

EX_HRUT = [
    choice_ex(
        "a1_hr_1_listen",
        "listen_choose",
        "استمع للوقت المحدد لنشاط الغداء.",
        ["listening", "vocabulary"],
        1,
        "استمع جيداً لموعد الغداء:",
        "Normalmente como a las dos y media de la tarde.",
        "عادة أتناول الغداء في الثانية والنصف بعد الظهر.",
        [
            opt("a1_hr_1_a", "A las 14:30 (dos y media)", "في الثانية والنصف", True),
            opt("a1_hr_1_b", "A las 14:00 (dos en punto)", "في الثانية تماماً", False, "الصوت ذكر y media (والنصف)."),
            opt("a1_hr_1_c", "A las 15:30 (tres y media)", "في الثالثة والنصف", False, "الصوت ذكر las dos (الثانية) وليس las tres.")
        ],
        ["comer", "hora"],
        "المتحدث قال: a las dos y media (14:30).",
        audioKey="pending/a1-hr-ex-1",
        speechEs="Normalmente como a las dos y media de la tarde."
    ),
    choice_ex(
        "a1_hr_2_adverb_siempre",
        "word_choice",
        "اختر ظرف التكرار المناسب لحدث يتكرر بنسبة 100% (دائماً).",
        ["grammar", "vocabulary"],
        1,
        "للتعبير عن أنك تفعل الشيء بشكل دائم بدون انقطاع، نستخدم:",
        "Yo ____ desayuno antes de salir de casa.",
        "أنا ____ أتناول الإفطار قبل الخروج من المنزل.",
        [
            opt("a1_hr_2_a", "siempre", "دائماً", True),
            opt("a1_hr_2_b", "nunca", "أبداً (نفي تام)", False, "nunca تعني أبداً ولا تفيد الدوام."),
            opt("a1_hr_2_c", "poco", "قليلاً", False, "poco تفيد القلة.")
        ],
        ["siempre", "desayunar"],
        "ظرف التكرار الدائم هو: siempre."
    ),
    fill_ex(
        "a1_hr_3_fill",
        "أكمل بحرف الجر الإلزامي قبل ساعات المواعيد اليومية.",
        ["writing", "grammar"],
        1,
        "اكتب حرف الجر (a) في الفراغ:",
        "Entro a trabajar ____ las nueve de la mañana.",
        "أبدأ العمل في تمام ____ التاسعة صباحاً.",
        ["trabajar", "hora"],
        ["a"],
        "نستخدم دائماً حرف الجر a مع ساعات المواعيد والروتين: a las nueve."
    ),
    order_ex(
        "a1_hr_4_order",
        "رتّب الجملة لبيان موعد النوم اليومي.",
        ["grammar", "reading"],
        2,
        ["Siempre", "duermo", "a", "las", "once."],
        "Siempre duermo a las once.",
        "الترتيب: ظرف التكرار Siempre + الفعل duermo + حرف الجر a + الأداة las + العدد once.",
        ["siempre", "dormir", "hora"]
    ),
    choice_ex(
        "a1_hr_5_never",
        "word_choice",
        "كيف ننفي القيام بالنشاط إطلاقاً بكلمة «أبداً»؟",
        ["grammar"],
        2,
        "لنفي تناول العشاء متأخراً نستخدم:",
        "Yo ____ ceno después de medianoche.",
        "أنا ____ أتعشى بعد منتصف الليل.",
        [
            opt("a1_hr_5_a", "nunca", "أبداً", True),
            opt("a1_hr_5_b", "siempre", "دائماً", False, "siempre تثبت الحدث ولا تنفيه."),
            opt("a1_hr_5_c", "mucho", "كثيراً", False, "mucho ليست ظرف نفي.")
        ],
        ["nunca", "cenar"],
        "nunca تعني أبداً وتفيد النفي المطلق."
    ),
    speak_ex(
        "a1_hr_6_speak",
        "انطق جملة بيان مواعيد روتينك بنطق واضح.",
        ["speaking"],
        2,
        "اقرأ الجملة بصوت مسموع:",
        "Ceno a las nueve y duermo a las once de la noche.",
        "أتعشى في التاسعة وأنام في الحادية عشرة ليلاً.",
        "pending/a1-hr-ex-6",
        ["cenar", "dormir", "hora"],
        "Ceno a las nueve y duermo a las once de la noche.",
        "انتبه لنطق حرف d في duermo وربط a las nue-ve."
    )
]

# Lesson 3: a1-hobbies
L_HOB = {
    "slug": "a1-hobbies",
    "titleAr": "الهوايات وأوقات الفراغ: التعبير عن الاهتمامات والأنشطة",
    "level": "A1",
    "programSlug": "main-track",
    "unitSlug": "a1-u7-routine",
    "objectiveAr": "أن يقول المتعلم ما يحب وما لا يحب فعله في وقت الفراغ وعطلة نهاية الأسبوع مستخدماً أفعال الهوايات والتفضيل.",
    "estimatedMinutes": 12,
    "skills": ["vocabulary", "speaking", "listening", "reading", "grammar"],
    "newVocabulary": ["tiempo", "gustar", "estudiar", "amigo", "casa", "semana", "deporte"],
    "reviewVocabulary": ["bueno", "mucho", "dos"],
    "targetStructures": [
        "En mi tiempo libre me gusta hacer deporte y leer.",
        "Los fines de semana salgo con mis amigos.",
        "¿Cuáles son tus aficiones favoritas?"
    ],
    "grammarTopics": ["vocabulario-hobbies-aficiones", "gustar-con-infinitivos", "expresiones-tiempo-libre"],
    "scenarios": [
        {
            "contextAr": "زياد يتعرف على صديقه الإسباني إينيغو ويتحدثان عن هواياتهما المفضلة في عطلة نهاية الأسبوع.",
            "settingAr": "نادي رياضي في مدريد",
            "lines": [
                {
                    "es": "¿Qué te gusta hacer en tu tiempo libre, Ziad?",
                    "ar": "ماذا تحب أن تفعل في وقت فراغك يا زياد؟",
                    "arEg": "بتحب تعمل إيه في وقت فراغك يا زياد؟",
                    "audioKey": "pending/a1-hob-sc-1"
                },
                {
                    "es": "Me gusta mucho hacer deporte, jugar al fútbol y escuchar música.",
                    "ar": "يعجبني كثيراً ممارسة الرياضة ولعب كرة القدم وسماع الموسيقى.",
                    "arEg": "بحب أوي أعمل رياضة، وألعب كورة وأسمع مزيكا.",
                    "audioKey": "pending/a1-hob-sc-2"
                },
                {
                    "es": "¡A mí también! Los sábados solemos jugar un partido con amigos.",
                    "ar": "وأنا أيضاً! أيام السبت اعتدنا أن نلعب مباراة مع الأصدقاء.",
                    "arEg": "وأنا كمان! أيام السبت متعودين نلعب ماتش مع الأصحاب.",
                    "audioKey": "pending/a1-hob-sc-3"
                },
                {
                    "es": "¡Qué bien! Me encantaría jugar con vosotros este sábado.",
                    "ar": "يا لروعة ذلك! يسعدني جداً اللعب معكم هذا السبت.",
                    "arEg": "حلو جداً! يسعدني ألعب معاكم السبت ده.",
                    "audioKey": "pending/a1-hob-sc-4"
                }
            ]
        }
    ],
    "culturalNoteAr": "الرياضة والأنشطة الخارجية (al aire libre) مثل المشي في الطبيعة (hacer senderismo) ولقاء الأصدقاء في الساحات العامة من أهم مظاهر قضاء وقت الفراغ في الثقافة الإسبانية.",
    "pedagogicalRationaleAr": "عند استخدام فعل gustar مع الأفعال (المصادر)، يظل الفعل دائماً في صيغة المفرد gusta حتى لو تعددت المصادر: Me gusta leer y viajar (وليس *me gustan leer y viajar).",
    "status": "draft",
    "review": review_block()
}

EX_HOB = [
    choice_ex(
        "a1_hob_1_listen",
        "listen_choose",
        "استمع وحدد هواية المتحدث المفضلة.",
        ["listening", "vocabulary"],
        1,
        "استمع لهواية المتحدث:",
        "En mi tiempo libre me gusta mucho hacer deporte al aire libre.",
        "في وقت فراغي يعجبني كثيراً ممارسة الرياضة في الهواء الطلق.",
        [
            opt("a1_hob_1_a", "Hacer deporte", "ممارسة الرياضة", True),
            opt("a1_hob_1_b", "Cocinar en casa", "الطبخ في البيت", False, "الصوت ذكر hacer deporte وليس cocinar."),
            opt("a1_hob_1_c", "Ver la televisión", "مشاهدة التلفاز", False, "لم تُذكر مشاهدة التلفاز.")
        ],
        ["deporte", "gustar", "tiempo"],
        "المتحدث قال: me gusta mucho hacer deporte.",
        audioKey="pending/a1-hob-ex-1",
        speechEs="En mi tiempo libre me gusta mucho hacer deporte al aire libre."
    ),
    choice_ex(
        "a1_hob_2_gustar_infinitives",
        "word_choice",
        "اختر الصيغة النحوية الصحيحة لفعل التفضيل مع الأنشطة والمصادر.",
        ["grammar"],
        2,
        "عند التعبير عن إعجابك بأنشطة متعددة في صيغة المصدر، نختار:",
        "A mí me ____ leer novelas y escribir poesía.",
        "أنا يعجبني قراءة الروايات وكتابة الشعر.",
        [
            opt("a1_hob_2_a", "gusta", "صيغة المفرد (مع المصادر)", True),
            opt("a1_hob_2_b", "gustan", "صيغة الجمع (للأسماء الجمع فقط)", False, "خطأ شائع: مع المصادر نستخدم دائماً gusta في المفرد حتى لو تعددت."),
            opt("a1_hob_2_c", "gusto", "أنا أعجب", False, "خطأ في تصريف الفعل.")
        ],
        ["gustar"],
        "مع الأفعال في المصدر نستخدم دائماً صيغة المفرد: me gusta leer y escribir."
    ),
    fill_ex(
        "a1_hob_3_fill",
        "اكتب كلمة الرياضة بالإسبانية في الفراغ.",
        ["writing", "vocabulary"],
        1,
        "اكتب كلمة (deporte) في الفراغ:",
        "Los fines de semana practico ____ con mis amigos.",
        "في عطلات نهاية الأسبوع أمارس ____ مع أصدقائي.",
        ["deporte", "amigo"],
        ["deporte"],
        "الرياضة بالإسبانية هي: el deporte."
    ),
    order_ex(
        "a1_hob_4_order",
        "رتّب الجملة للتعبير عما تفعله في وقت الفراغ.",
        ["grammar", "reading"],
        2,
        ["En", "mi", "tiempo", "libre", "hago", "deporte."],
        "En mi tiempo libre hago deporte.",
        "الترتيب: شبه الجملة الظرفية En mi tiempo libre + الفعل hago + المفعول deporte.",
        ["tiempo", "deporte"]
    ),
    choice_ex(
        "a1_hob_5_weekend",
        "word_choice",
        "ما هو التعبير الإسباني الدال على «عطلة نهاية الأسبوع»؟",
        ["vocabulary"],
        1,
        "عطلة نهاية الأسبوع تسمى بالإسبانية:",
        "Paso el ____ de semana con mi familia.",
        "أقضي ____ الأسبوع مع عائلتي.",
        [
            opt("a1_hob_5_a", "fin", "نهاية (fin de semana)", True),
            opt("a1_hob_5_b", "medio", "منتصف", False, "التعبير القياسي هو fin de semana."),
            opt("a1_hob_5_c", "principio", "بداية", False, "principio تعني بداية وليس نهاية.")
        ],
        ["semana"],
        "عطلة نهاية الأسبوع هي: el fin de semana."
    ),
    speak_ex(
        "a1_hob_6_speak",
        "انطق جملة هواياتك في وقت الفراغ بنطق واضح.",
        ["speaking"],
        2,
        "اقرأ الجملة بصوت واضح ونبرة واثقة:",
        "En mi tiempo libre me gusta salir con amigos y hacer deporte.",
        "في وقت فراغي يعجبني الخروج مع الأصدقاء وممارسة الرياضة.",
        "pending/a1-hob-ex-6",
        ["tiempo", "amigo", "deporte", "gustar"],
        "En mi tiempo libre me gusta salir con amigos y hacer deporte.",
        "حافظ على سلاسة نطق sa-lir con a-mi-gos y ha-cer de-por-te."
    )
]

# Lesson 4: a1-mi-dia
L_MIDIA = {
    "slug": "a1-mi-dia",
    "titleAr": "يومي في فقرة: سرد الجدول اليومي الكامل بروابط زمنية",
    "level": "A1",
    "programSlug": "main-track",
    "unitSlug": "a1-u7-routine",
    "objectiveAr": "أن يكتب المتعلم وينطق سردية متصلة من 4 إلى 5 جمل تصف يومه المعتاد من الصباح حتى المساء باستخدام روابط التسلسل (primero, luego, después, finalmente).",
    "estimatedMinutes": 12,
    "skills": ["writing", "speaking", "reading", "listening", "grammar"],
    "newVocabulary": ["mañana", "tarde", "noche", "desayunar", "comer", "cenar", "dormir", "trabajar", "rutina", "estudiar"],
    "reviewVocabulary": ["casa", "hora", "dos"],
    "targetStructures": [
        "Primero desayuno en casa, luego voy a trabajar.",
        "Después de comer descanso un poco.",
        "Finalmente ceno y duermo ocho horas."
    ],
    "grammarTopics": ["conectores-secuencia-primero-luego-despues", "redaccion-parrafo-rutina", "cohesion-textual-a1"],
    "scenarios": [
        {
            "contextAr": "ياسين يقدم عرضاً شفهياً قصيراً أمام زملائه في معهد اللغة يروي فيه تفاصيل يومه النموذجي.",
            "settingAr": "قاعة دراسية في معهد اللغات بمدريد",
            "lines": [
                {
                    "es": "Mi día a día es muy activo pero organizado.",
                    "ar": "يومي حافل بالنشاط ولكنه منظم للغاية.",
                    "arEg": "يومي مليان حركة بس منظم جداً.",
                    "audioKey": "pending/a1-md-sc-1"
                },
                {
                    "es": "Primero me levanto a las siete y desayuno tranquilamente.",
                    "ar": "أولاً أستيقظ في السابعة وأتناول إفطاري بهدوء.",
                    "arEg": "أول حاجة بصحى سبعة وبفطر براحتي.",
                    "audioKey": "pending/a1-md-sc-2"
                },
                {
                    "es": "Luego trabajo hasta las tres, y después como con amigos.",
                    "ar": "ثم أعمل حتى الثالثة، وبعد ذلك أتغدى مع الأصدقاء.",
                    "arEg": "بعدين بشتغل لحد تلاتة، وبعدها بتغدى مع أصحابي.",
                    "audioKey": "pending/a1-md-sc-3"
                },
                {
                    "es": "Por la noche ceno ligero y duermo temprano.",
                    "ar": "في المساء أتعشى خفيفاً وأنام مبكراً.",
                    "arEg": "بالليل بتعشى خفيف وبنام بدري.",
                    "audioKey": "pending/a1-md-sc-4"
                }
            ]
        }
    ],
    "culturalNoteAr": "روابط التسلسل الزمني (los conectores temporales) هي سر طلاقة النص في الإسبانية: primero (أولاً)، luego (ثم)، después (بعد ذلك)، finalmente (أخيراً). استخدامها ينقل مستوى المتعلم من جمل متقطعة إلى لغة طبيعية مترابطة.",
    "pedagogicalRationaleAr": "تتويج وحدة الروتين بكتابة فقرة متماسكة. يجب تدريب المتعلم على تجنب تكرار الفاعل 'yo' في بداية كل جملة، لأن تصريف الفعل الإسباني يدل على الفاعل تلقائياً.",
    "status": "draft",
    "review": review_block()
}

EX_MIDIA = [
    choice_ex(
        "a1_md_1_listen",
        "listen_choose",
        "استمع لترتيب أحداث اليوم وحدد ماذا يفعل المتحدث أولاً.",
        ["listening", "reading"],
        1,
        "استمع للخطوة الأولى في اليوم:",
        "Primero desayuno en casa y luego voy a la universidad.",
        "أولاً أفطر في البيت ثم أذهب إلى الجامعة.",
        [
            opt("a1_md_1_a", "Desayunar en casa", "تناول الإفطار في البيت أولاً", True),
            opt("a1_md_1_b", "Ir a la universidad", "الذهاب للجامعة أولاً", False, "الصوت ذكر primero desayuno ثم الذهاب للجامعة."),
            opt("a1_md_1_c", "Dormir una siesta", "أخذ قيلولة", False, "لم تُذكر القيلولة.")
        ],
        ["desayunar", "casa", "rutina"],
        "المتحدث قال: Primero desayuno en casa.",
        audioKey="pending/a1-md-ex-1",
        speechEs="Primero desayuno en casa y luego voy a la universidad."
    ),
    choice_ex(
        "a1_md_2_connector_luego",
        "word_choice",
        "اختر رابط التسلسل المناسب لـ «ثم / بعد ذلك».",
        ["grammar"],
        2,
        "لربط حدثين متتاليين بمعنى «ثم»، نستخدم:",
        "Desayuno a las ocho y ____ voy a trabajar.",
        "أفطر في الثامنة و____ أذهب للعمل.",
        [
            opt("a1_md_2_a", "luego", "ثم / بعد ذلك", True),
            opt("a1_md_2_b", "nunca", "أبداً", False, "nunca تعني أبداً وليست رابط تسلسل."),
            opt("a1_md_2_c", "pero", "لكن", False, "pero تفيد الاستدراك وليس التتابع الزمني.")
        ],
        ["desayunar", "trabajar", "rutina"],
        "رابط التتابع الزمني هو: luego."
    ),
    fill_ex(
        "a1_md_3_fill",
        "اكتب كلمة الرابط الزمني «أولاً» (Primero) في بداية الفقرة.",
        ["writing", "grammar"],
        1,
        "اكتب كلمة (Primero) في الفراغ:",
        "____ me levanto a las siete de la mañana.",
        "____ أستيقظ في السابعة صباحاً.",
        ["mañana", "rutina"],
        ["Primero", "primero"],
        "رابط البداية في التسلسل هو: Primero."
    ),
    order_ex(
        "a1_md_4_order",
        "رتّب جمل السرد الزمني لليوم الكامل.",
        ["grammar", "writing"],
        2,
        ["Por", "la", "noche", "ceno", "y", "duermo."],
        "Por la noche ceno y duermo.",
        "الترتيب: الظرف الزمني Por la noche + الفعل الأول ceno + حرف العطف y + الفعل الثاني duermo.",
        ["noche", "cenar", "dormir"]
    ),
    choice_ex(
        "a1_md_5_finally",
        "word_choice",
        "ما هو رابط الختام المناسب لإنهاء سردية اليوم (أخيراً)؟",
        ["vocabulary"],
        1,
        "لختام سرد أحداث اليوم نستخدم:",
        "Y ____ me acuesto a las once.",
        "و____ أخلد للنوم في الحادية عشرة.",
        [
            opt("a1_md_5_a", "finalmente", "أخيراً / في النهاية", True),
            opt("a1_md_5_b", "primero", "أولاً", False, "primero للبداية وليس الختام."),
            opt("a1_md_5_c", "siempre", "دائماً", False, "siempre ظرف تكرار وليس رابط ختام تسلسلي.")
        ],
        ["rutina"],
        "رابط الختام هو: finalmente."
    ),
    speak_ex(
        "a1_md_6_speak",
        "انطق فقرة ملخص يومك بنطق متصل وسليم.",
        ["speaking"],
        2,
        "اقرأ الجملة بصوت واضح وطلاقة متصلة:",
        "Por la mañana estudio, por la tarde trabajo y por la noche descanso.",
        "في الصباح أدرس، وفي بعد الظهر أعمل، وفي الليل أستريح.",
        "pending/a1-md-ex-6",
        ["mañana", "tarde", "noche", "estudiar", "trabajar"],
        "Por la mañana estudio, por la tarde trabajo y por la noche descanso.",
        "حافظ على التوازن الإيقاعي بين فترات اليوم الثلاث: mañana, tarde, noche."
    )
]

def main():
    os.makedirs(OUT, exist_ok=True)
    all_lessons = [
        # Unit 5
        (L_COL, EX_COL, "lesson-a1-colores-ropa.json"),
        (L_NEC, EX_NEC, "lesson-a1-necesitar.json"),
        (L_TAL, EX_TAL, "lesson-a1-tallas.json"),
        (L_COM_P, EX_COM_P, "lesson-a1-comprar.json"),
        # Unit 6
        (L_HAB, EX_HAB, "lesson-a1-habitaciones.json"),
        (L_HAY, EX_HAY, "lesson-a1-hay-estar.json"),
        (L_MUE, EX_MUE, "lesson-a1-muebles.json"),
        (L_RUT_C, EX_RUT_C, "lesson-a1-rutina-casa.json"),
        # Unit 7
        (L_VRUT, EX_VRUT, "lesson-a1-verbos-rutina.json"),
        (L_HRUT, EX_HRUT, "lesson-a1-hora-rutina.json"),
        (L_HOB, EX_HOB, "lesson-a1-hobbies.json"),
        (L_MIDIA, EX_MIDIA, "lesson-a1-mi-dia.json")
    ]
    for doc, exercises, filename in all_lessons:
        full_doc = lesson_doc(doc, exercises)
        path = os.path.join(OUT, filename)
        with open(path, 'w', encoding='utf-8') as f:
            json.dump(full_doc, f, ensure_ascii=False, indent=2)
        print(f"Generated {path} with {len(exercises)} exercises.")

if __name__ == '__main__':
    main()
