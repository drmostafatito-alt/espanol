# -*- coding: utf-8 -*-
"""مسار السفر — الوحدة 3: المطعم (الطلب والدفع) — 4 دروس + حزمة مفردات خاصة.

يتبع نفس نمط tools/gen/travel_track.py (مساعدات مطابقة، محتوى draft بلا مراجعة بشرية،
وكل audioKey بحالة pending لأن الصوت لم يُنتج ولم يُعتمد مصدره).

الترتيب الصحيح للتشغيل:
  1) python3 tools/gen/travel_track.py            (الوحدتان 1 و2 + tr-shared)
  2) python3 tools/gen/travel_unit3_restaurant.py (هذا الملف: الوحدة 3 + حزمتها)
  3) python3 tools/gen/sync_map_lessons.py        (مزامنة خريطة المنهج)
  4) node tools/validate-content.mjs --dir content/drafts/travel

ملاحظة: هذا الملف يدمج وحدته داخل paths.json ولا يعيد بناء الوحدتين 1 و2.
"""
import json, os

OUT = 'content/drafts/travel'
UNIT = 'tr-u3-restaurant'
BUNDLE = 'tr-u3-restaurant'


def opt(oid, text, textAr=None, correct=False, why=None):
    o = {"id": oid, "text": text, "isCorrect": bool(correct)}
    if textAr:
        o["textAr"] = textAr
    if why:
        o["distractorRationaleAr"] = why
    return o


def ex(eid, typ, instructionAr, skills, difficulty, **kw):
    d = {"id": eid, "type": typ, "instructionAr": instructionAr}
    d.update(kw)
    d["skills"] = skills
    d["difficulty"] = difficulty
    d.setdefault("scoring", {"mode": "all_or_nothing"})
    return d


def review(note):
    return {"status": "draft",
            "authors": ["فريق المنهج — إعداد أصلي بمساعدة نموذج، بلا مراجعة بشرية بعد"],
            "spanishReviewer": None, "translationReviewer": None, "reviewedAt": None,
            "notes": note}


AUDIO = "كل مقاطع الصوت pending ولم يُنتج أي ملف (لم يُعتمد مصدر ولا ترخيص)."


def lesson(slug, titleAr, objectiveAr, minutes, newVocab, reviewVocab, structures, grammar,
           scenario, exercises, note):
    return {"schemaVersion": "1.0.0", "lesson": {
        "slug": slug, "titleAr": titleAr, "level": "A2", "programSlug": "travel",
        "unitSlug": UNIT, "objectiveAr": objectiveAr, "estimatedMinutes": minutes,
        "skills": ["listening", "reading", "speaking", "writing", "grammar", "vocabulary"],
        "newVocabulary": newVocab, "reviewVocabulary": reviewVocab,
        "targetStructures": structures, "grammarTopics": grammar,
        "scenarios": [scenario],
        "mastery": {"minAccuracy": 70, "minCorrectExercises": 4,
                    "requiredExerciseTypes": ["word_choice", "choose_reply"]},
        "unlock": {"type": "sequential"}, "offlinePriority": 2,
        "exercises": exercises, "review": review(note + " " + AUDIO)}}


def scen(contextAr, settingAr, lines):
    return {"contextAr": contextAr, "settingAr": settingAr,
            "lines": [{"es": es, "ar": ar, "arEg": eg, "audioKey": f"pending/{key}"}
                      for (es, ar, eg, key) in lines]}


# ---------------------------------------------------------------- المفردات
def entry(head, pos, gender, ipa, hint, msa, eg, gloss, ex_es, ex_ar, ex_eg, usage, err, rank):
    return {"headword": head, "normalized": head.lower(), "kind": "word", "pos": pos, "gender": gender,
            "plural": None, "level": "A2", "register": "neutral", "ipa": ipa,
            "pronunciationHintAr": hint, "internalRank": rank, "tags": ["سفر", "مطعم", "A2"],
            "senses": [{"senseNo": 1, "meaningArFusha": msa, "meaningArEg": eg, "glossEs": gloss,
                        "exampleEs": ex_es, "exampleAr": ex_ar, "exampleArEg": ex_eg,
                        "usageNoteAr": usage, "commonErrorAr": err}],
            "examples": [{"es": ex_es, "ar": ex_ar, "arEg": ex_eg}]}


U3_ENTRIES = [
    # «mesa» غير مكرّرة هنا: موجودة في core-vocab (cv-band2-daily) بنفس المعنى،
    # والقاعدة في المشروع الإحالة لا إعادة الشرح (SHARED_VOCAB_REUSED).
    entry("camarero", "noun", "m", "/kamaˈɾeɾo/", "كاماريرو", "نادل", "جرسون",
          "sustantivo masculino",
          "El camarero nos trae el menú.", "النادل يُحضر لنا قائمة الطعام.", "الجرسون بيجيب لنا المنيو.",
          "camarera للنادلة. للمناداة: «Perdón» أو «Disculpe» أفصح من رفع الصوت بـ«¡Camarero!».",
          "لا تنادِ «¡Oye!» فهي غير مهذّبة مع الغرباء.", 2),
    entry("menú", "noun", "m", "/meˈnu/", "مينو", "قائمة الطعام", "المنيو",
          "sustantivo masculino",
          "¿Nos trae el menú, por favor?", "هل تُحضر لنا القائمة من فضلك؟", "تجيب لنا المنيو لو سمحت؟",
          "menú del día = قائمة اليوم بسعر ثابت. carta = القائمة الكاملة بالأسعار.",
          "«menú» ليست دائمًا القائمة الكاملة؛ في إسبانيا غالبًا وجبة اليوم الثابتة.", 3),
    {**entry("pedir", "verb", None, "/peˈðiɾ/", "بيدير", "يطلب", "يطلب",
             "verbo irregular (e→i)",
             "¿Puedo pedir ahora?", "هل يمكنني أن أطلب الآن؟", "أقدر أطلب دلوقتي؟",
             "فعل شاذ: pido, pides, pide, pedimos. الأمر الرسمي: pida.",
             "لا تخلط pedir (يطلب) بـpreguntar (يسأل).", 4),
     # تصريفات المضارع بشريًا (نفس نمط tools/gen/add_verb_forms.py) — يمنع تنبيه «فعل بلا تصريفات».
     "forms": [{"kind": "conjugation", "formEs": form, "tense": "presente", "mood": "indicativo",
                "person": person, "irregular": True}
               for person, form in zip(["1s", "2s", "3s", "1p", "2p", "3p"],
                                       ["pido", "pides", "pide", "pedimos", "pedís", "piden"])]},
    entry("plato", "noun", "m", "/ˈplato/", "بلاتو", "طبق", "طبق",
          "sustantivo masculino",
          "Este plato lleva queso.", "هذا الطبق يحتوي على جبن.", "الطبق ده فيه جبنة.",
          "primer plato / segundo plato = الطبق الأول/الثاني في القائمة.",
          "لا تخلط plato (طبق) بـplata (فضة).", 5),
    entry("bebida", "noun", "f", "/beˈβiða/", "بيبيدا", "مشروب", "مشروب",
          "sustantivo femenino",
          "¿Qué bebida quiere?", "أي مشروب تريد؟", "عايز تشرب إيه؟",
          "para beber = للشرب، وهي الصيغة الأكثر شيوعًا في المطاعم.",
          "bebida مؤنثة: una bebida، لا «un bebida».", 6),
    entry("cuenta", "noun", "f", "/ˈkwenta/", "كوينتا", "الحساب (في المطعم)", "الحساب",
          "sustantivo femenino",
          "La cuenta, por favor.", "الحساب من فضلك.", "الحساب لو سمحت.",
          "في المطعم: la cuenta. أمّا factura فهي فاتورة ضريبية/تجارية. "
          "في إسبانيا قد يُسأل: ¿Todo junto o por separado?",
          "لا تطلب «la factura» في مطعم عادي؛ المطلوب «la cuenta».", 7),
    entry("propina", "noun", "f", "/pɾoˈpina/", "بروبينا", "بقشيش", "إكرامية",
          "sustantivo femenino",
          "¿Está incluida la propina?", "هل البقشيش مشمول؟", "الإكرامية متحسبة ولا لأ؟",
          "في إسبانيا البقشيش ليس إلزاميًا (5–10% إن كانت الخدمة جيدة). "
          "«servicio incluido» تعني أن الخدمة مشمولة في السعر.",
          "لا تفترض الشمول؛ اسأل: ¿Está incluida la propina?", 8),
    entry("alérgico", "adj", None, "/aˈleɾxiko/", "أليرخيكو", "مصاب بحساسية", "عنده حساسية",
          "adjetivo",
          "Soy alérgico al marisco.", "عندي حساسية من المأكولات البحرية.", "عندي حساسية من السي فود.",
          "تطابق مع الجنس: alérgico / alérgica. وحرف الجرّ: alérgico a.",
          "لا تقل «alérgico de marisco»؛ الصواب «al marisco».", 9),
    {
        "headword": "sin gluten", "normalized": "sin gluten", "kind": "expression", "pos": "phrase",
        "gender": None, "plural": None, "level": "A2", "register": "neutral",
        "ipa": "/sin ˈɡluten/", "pronunciationHintAr": "سين غلوتين", "internalRank": 10,
        "tags": ["سفر", "مطعم", "A2"],
        "senses": [{"senseNo": 1, "meaningArFusha": "خالٍ من الغلوتين", "meaningArEg": "بدون جلوتين",
                    "glossEs": "locución adjetiva",
                    "exampleEs": "¿Tiene algún plato sin gluten?",
                    "exampleAr": "هل لديكم طبق خالٍ من الغلوتين؟",
                    "exampleArEg": "عندكم طبق بدون جلوتين؟",
                    "usageNoteAr": "مفهومة في المطاعم. لمرضى السيلياك الأدقّ: «apto para celíacos».",
                    "commonErrorAr": "«sin de gluten» خطأ؛ sin يتبعها الاسم مباشرة."}],
        "examples": [{"es": "¿Tiene algún plato sin gluten?",
                      "ar": "هل لديكم طبق خالٍ من الغلوتين؟",
                      "arEg": "عندكم طبق بدون جلوتين؟"}],
    },
]

PACK = {
    # الحقول المسموحة فقط حسب content/schema/vocabulary.schema.json
    # (additionalProperties=false ⇒ لا titleAr ولا levelCode هنا؛ عنوان الحزمة يأتي من paths.json).
    "schemaVersion": "1.0.0",
    "bundleSlug": BUNDLE,
    "pronunciationNoteAr": "النقل بالحروف العربية تقريب فقط. في إسبانيا تُنطق z وce قريبة من «ث»، "
                           "وفي أمريكا اللاتينية «س» — الملفات الصوتية لم تُنتج بعد.",
    "source": {"title": "مفردات المطعم والدفع — إعداد داخلي لمراجعة بشرية قبل النشر", "url": "",
               "license": "internal-draft", "accessedAt": "2026-10-21",
               "rankingNote": "internalRank داخلي لسَلسَلة التدريس، وليس ادعاءً بأن الكلمات الأكثر شيوعًا."},
    "entries": U3_ENTRIES,
}

# ---------------------------------------------------------------- الدروس
L = []

L.append(lesson(
    "tr-u3-getting-table", "طاولة لشخصين", 
    "أن يطلب المتعلم طاولة في مطعم، ويحدد عدد الأشخاص، ويفهم سؤال النادل عن العدد وأي الأماكن متاح.",
    10, ["mesa", "camarero"], ["reserva"],
    ["Una mesa para dos, por favor.", "Somos dos.", "¿Hay que esperar?"],
    ["para-vs-por", "ser-con-numeros"],
    scen("تدخل مطعمًا في مدريد وقت الغداء وتطلب طاولة.", "مدخل المطعم مع النادل",
         [("Buenas tardes. ¿Cuántas personas son?", "مساء الخير. كم عدد الأشخاص؟", "مساء الخير. أنتم كام واحد؟", "tr-u3-l1-host-1"),
          ("Una mesa para dos, por favor.", "طاولة لشخصين من فضلك.", "ترابيزة لاتنين لو سمحت.", "tr-u3-l1-learner-1"),
          ("¿Prefieren dentro o fuera?", "تفضّلون بالداخل أم بالخارج؟", "تحبوا جوه ولا بره؟", "tr-u3-l1-host-2"),
          ("Dentro, por favor. Hace calor.", "بالداخل من فضلك. الجو حار.", "جوه لو سمحت. الدنيا حر.", "tr-u3-l1-learner-2")]),
    [
        ex("tr_u3_1_table", "fill_blank", "أكمل طلب الطاولة.",
           ["writing", "vocabulary"], 1,
           stemEs="Una ____ para dos, por favor.", stemAr="طاولة لشخصين من فضلك.",
           answerKey={"accepted": ["mesa"], "caseSensitive": False},
           explanationAr="طلب الطاولة الصيغة الثابتة: «Una mesa para dos». "
                        "«para» للغرض/المستفيد، وعدد الأشخاص بعدها.",
           errorFeedback={"tabla": "«tabla» = لوح/خشب. طاولة الطعام mesa.",
                          "mesa para dos personas": "صحيحة، لكن الصيغة المختصرة الأشيع: una mesa para dos."},
           targetVocab=["mesa"]),

        ex("tr_u3_2_por_para", "word_choice", "أي صيغة صحيحة لطلب طاولة لشخصين؟",
           ["reading", "grammar"], 2,
           options=[opt("tr_u3_2_a", "Una mesa para dos, por favor.", "طاولة لشخصين من فضلك.", True),
                    opt("tr_u3_2_b", "Una mesa por dos, por favor.", "طاولة مقابل اثنين؟", False,
                        "«por» هنا تعني المقابل/الوسيلة، لا المستفيد."),
                    opt("tr_u3_2_c", "Una mesa a dos, por favor.", "طاولة إلى اثنين؟", False,
                        "«a» لا تُستخدم لتحديد عدد الأشخاص في هذه العبارة.")],
           answerKey={"correctOptionIds": ["tr_u3_2_a"]},
           explanationAr="«para + عدد» لتحديد المستفيدين: mesa para dos / para tres personas. "
                         "أما por فتعني «مقابل» أو «بواسطة».",
           errorFeedback={"tr_u3_2_b": "«por dos» تعني «مقابل اثنين»؛ المطلوب para dos.",
                          "tr_u3_2_c": "لا نقول «mesa a dos»؛ الصواب para dos."},
           targetVocab=["mesa"]),

        ex("tr_u3_3_count", "choose_reply", "النادل يسأل: «¿Cuántas personas son؟» اختر الردّ السليم.",
           ["speaking", "grammar"], 2,
           stemEs="— ¿Cuántas personas son?",
           stemAr="— كم عدد الأشخاص؟",
           options=[opt("tr_u3_3_a", "Somos dos.", "نحن اثنان.", True),
                    opt("tr_u3_3_b", "Estamos dos.", "موجودان اثنان؟", False,
                        "«estar» للمكان والحال؛ العدد الثابت يُقال بـser."),
                    opt("tr_u3_3_c", "Tenemos dos.", "لدينا اثنان؟", False,
                        "«tener» للملكية؛ السؤال عن العدد لا عمّا نملك.")],
           answerKey={"correctOptionIds": ["tr_u3_3_a"]},
           explanationAr="عدد الأشخاص الثابت يُعبَّر عنه بـser: Somos dos / Somos tres. "
                         "وتُستخدم صيغة الجمع لأن المتحدث جزء من العدد.",
           errorFeedback={"tr_u3_3_b": "العبارة الصحيحة للعدد: Somos dos.",
                          "tr_u3_3_c": "«Tenemos dos» تعني «لدينا اثنان» ولا تجيب عن العدد."},
           targetVocab=["mesa"]),

        ex("tr_u3_4_translate", "translate_short", "ترجم إلى الإسبانية.",
           ["writing", "grammar"], 3, stemAr="هل عندكم طاولة لثلاثة أشخاص؟", stemEs="",
           answerKey={"accepted": ["¿Tienen una mesa para tres?",
                                   "¿Tienen una mesa para tres personas?",
                                   "¿Hay una mesa para tres?",
                                   "¿Hay una mesa para tres personas?"],
                      "caseSensitive": False, "ignorePunctuation": True},
           explanationAr="للسؤال المهذّب في المطعم: ¿Tienen…? أو ¿Hay…? مع para + العدد.",
           errorFeedback={"¿Tienen mesa por tres?": "الصواب para tres.",
                          "¿Hay una mesa a tres personas?": "الصواب para tres personas."},
           targetVocab=["mesa"]),
    ],
    "درس المطعم 1/4 (طلب الطاولة). يحتاج مراجعة إسبانية أصلية لصيغ الاستقبال في مطاعم إسبانيا "
    "(dentro/fuera، و¿Cuántas personas son?)."))

L.append(lesson(
    "tr-u3-ordering", "الطلب من القائمة",
    "أن يطلب المتعلم القائمة، ويسمّي طبقًا ومشروبًا، ويستخدم صيغة مهذّبة للطلب، ويفهم سؤال النادل عن الطبق الأول.",
    12, ["menú", "pedir", "plato", "bebida"], ["mesa"],
    ["¿Nos trae el menú, por favor?", "De primero, una sopa.", "Para beber, agua."],
    ["pedir-irregular", "primero-segundo"],
    scen("تجلس على الطاولة وتطلب من القائمة.", "طاولة في المطعم مع النادل",
         [("Aquí tiene el menú. ¿Qué le traigo de primero?", "تفضّل القائمة. ماذا أحضر لك أولًا؟", "اتفضل المنيو. أجيبلك إيه الأول؟", "tr-u3-l2-waiter-1"),
          ("¿Nos trae el menú del día, por favor?", "هل تُحضر لنا قائمة اليوم من فضلك؟", "تجيب لنا منيو اليوم لو سمحت؟", "tr-u3-l2-learner-1"),
          ("De primero, una sopa. Y de segundo, pollo.", "أولًا شوربة، وثانيًا دجاج.", "الأول شوربة، والتاني فراخ.", "tr-u3-l2-learner-2"),
          ("¿Y para beber?", "وللشرب؟", "وتشرب إيه؟", "tr-u3-l2-waiter-2")]),
    [
        ex("tr_u3_5_menu", "fill_blank", "أكمل الطلب المهذّب للقائمة.",
           ["writing", "vocabulary"], 1,
           stemEs="¿Nos ____ el menú, por favor?", stemAr="هل تُحضر لنا القائمة من فضلك؟",
           answerKey={"accepted": ["trae"], "caseSensitive": False},
           explanationAr="بعد «nos» يأتي الفعل مصرّفًا للنادل (usted): ¿Nos trae…? = هل تُحضر لنا…؟",
           errorFeedback={"traer": "بعد ¿Nos…? يأتي الفعل مصرّفًا: trae.",
                          "traes": "«traes» لمخاطبة tú؛ مع النادل نستخدم usted: trae."},
           targetVocab=["menú"]),

        ex("tr_u3_6_polite", "word_choice", "أي صيغة أليق لطلب طبق في مطعم؟",
           ["reading", "speaking"], 2,
           options=[opt("tr_u3_6_a", "Quisiera pedir, por favor.", "أودّ أن أطلب من فضلك.", True),
                    opt("tr_u3_6_b", "Dame la comida.", "أعطني الطعام.", False,
                        "صيغة أمر مباشرة بلا «من فضلك»؛ غير مناسبة مع النادل."),
                    opt("tr_u3_6_c", "Quiero comer ya.", "أريد أن آكل الآن.", False,
                        "تلحّ على السرعة ولا تطلب بلباقة.")],
           answerKey={"correctOptionIds": ["tr_u3_6_a"]},
           explanationAr="«Quisiera» (أودّ) ألطف من «Quiero» (أريد)، خاصة مع الغرباء وفي الخدمة.",
           errorFeedback={"tr_u3_6_b": "الأمر المباشر «Dame» خشن في المطعم؛ استخدم Quisiera + por favor.",
                          "tr_u3_6_c": "«ya» توحي بالإلحاح؛ الطلب المهذّب أنسب."},
           targetVocab=["pedir"]),

        ex("tr_u3_7_first_course", "choose_reply", "النادل يسأل: «¿Qué le traigo de primero؟» اختر الردّ السليم.",
           ["speaking", "reading"], 2,
           stemEs="— ¿Qué le traigo de primero?",
           stemAr="— ماذا أحضر لك أولًا؟",
           options=[opt("tr_u3_7_a", "De primero, una sopa, por favor.", "أولًا شوربة من فضلك.", True),
                    opt("tr_u3_7_b", "De primero, una bebida, por favor.", "أولًا مشروب من فضلك.", False,
                        "المشروب يُطلب في «para beber» لا كطبق أول."),
                    opt("tr_u3_7_c", "Primero la cuenta, por favor.", "أولًا الحساب من فضلك.", False,
                        "الحساب في نهاية الوجبة لا في بدايتها.")],
           answerKey={"correctOptionIds": ["tr_u3_7_a"]},
           explanationAr="ترتيب الوجبة: de primero (طبق أول) ثم de segundo ثم para beber ثم el postre.",
           errorFeedback={"tr_u3_7_b": "المشروب ليس طبقًا أول؛ يُطلب «para beber».",
                          "tr_u3_7_c": "الحساب في النهاية: la cuenta, por favor."},
           targetVocab=["plato", "bebida"]),

        ex("tr_u3_8_translate", "translate_short", "ترجم إلى الإسبانية.",
           ["writing", "grammar"], 3, stemAr="أريد طبق دجاج ومشروبًا باردًا.", stemEs="",
           answerKey={"accepted": ["Quiero un plato de pollo y una bebida fría.",
                                   "Quisiera un plato de pollo y una bebida fría.",
                                   "Quiero un plato de pollo y una bebida fría, por favor.",
                                   "Quisiera un plato de pollo y una bebida fría, por favor."],
                      "caseSensitive": False, "ignorePunctuation": True},
           explanationAr="«un plato de + نوع الطعام» لوصف الطبق. ولأن bebida مؤنثة: una bebida fría.",
           errorFeedback={"un bebida frío": "bebida مؤنثة ⇒ una bebida fría.",
                          "un plato de pollo y una bebida": "أضف الصفة: fría، ليطابق المطلوب."},
           targetVocab=["plato", "bebida"]),
    ],
    "درس المطعم 2/4 (الطلب). يحتاج مراجعة إسبانية أصلية لصيغة «de primero/de segundo» "
    "و«menú del día» في مطاعم إسبانيا."))

L.append(lesson(
    "tr-u3-allergy-diet", "الحساسية والنظام الغذائي",
    "أن يعبّر المتعلم عن حساسية غذائية بوضوح، ويسأل هل يحتوي الطبق على مكوّن معيّن، ويطلب بديلًا خاليًا من الغلوتين.",
    12, ["alérgico", "sin gluten"], ["plato", "pedir"],
    ["Soy alérgico al marisco.", "¿Este plato lleva gluten?", "Sin gluten, por favor."],
    ["llevar-contener", "ser-alergico-a"],
    scen("قبل الطلب، تشرح حساسيتك الغذائية للنادل.", "طاولة في المطعم",
         [("¿Alguna alergia o intolerancia?", "هل هناك أي حساسية أو عدم تحمّل؟", "عندك أي حساسية أو مشكلة في الأكل؟", "tr-u3-l3-waiter-1"),
          ("Sí, soy alérgico a los frutos secos.", "نعم، عندي حساسية من المكسرات.", "أيوه، عندي حساسية من المكسرات.", "tr-u3-l3-learner-1"),
          ("¿Este plato lleva frutos secos?", "هل هذا الطبق يحتوي على مكسرات؟", "الطبق ده فيه مكسرات؟", "tr-u3-l3-learner-2"),
          ("No, este no. Y tenemos pan sin gluten.", "لا، هذا لا. وعندنا خبز خالٍ من الغلوتين.", "لأ، ده مافيهوش. وعندنا عيش بدون جلوتين.", "tr-u3-l3-waiter-2")]),
    [
        ex("tr_u3_9_allergic", "fill_blank", "أكمل التعبير عن الحساسية.",
           ["writing", "vocabulary"], 1,
           stemEs="Soy ____ al marisco.", stemAr="عندي حساسية من المأكولات البحرية.",
           answerKey={"accepted": ["alérgico", "alérgica"], "caseSensitive": False},
           explanationAr="alérgico/alérgica تطابق جنس المتحدث، ويتبعها الحرف «a»: alérgico al marisco. "
                         "الأنثى تقول: Soy alérgica.",
           errorFeedback={"alergia": "«alergia» اسم (الحساسية)؛ الصفة هنا: alérgico/alérgica.",
                          "alérgico de marisco": "الصواب «al marisco» لا «de marisco»."},
           targetVocab=["alérgico"]),

        ex("tr_u3_10_llevar", "word_choice", "كيف تسأل عمّا إذا كان الطبق يحتوي على مكسرات؟",
           ["reading", "grammar"], 2,
           options=[opt("tr_u3_10_a", "¿Este plato lleva frutos secos?", "هل هذا الطبق يحتوي على مكسرات؟", True),
                    opt("tr_u3_10_b", "¿Este plato es frutos secos?", "هل هذا الطبق مكسرات؟", False,
                        "صيغة غير سليمة؛ الطبق لا «يكون» مكسرات."),
                    opt("tr_u3_10_c", "¿Lleva el plato a la mesa?", "هل تأخذ الطبق إلى الطاولة؟", False,
                        "سؤال عن توصيل الطبق لا عن مكوّناته.")],
           answerKey={"correctOptionIds": ["tr_u3_10_a"]},
           explanationAr="للسؤال عن المكوّنات: ¿lleva…? أو ¿tiene…? — «llevar» هنا بمعنى «يحتوي على».",
           errorFeedback={"tr_u3_10_b": "الصيغة الصحيحة: ¿lleva frutos secos?",
                          "tr_u3_10_c": "المعنى مختلف تمامًا؛ السؤال عن المكوّنات."},
           targetVocab=["plato"]),

        ex("tr_u3_11_reply_allergy", "choose_reply", "النادل يسأل: «¿Alguna alergia؟» اختر الردّ الأنسب.",
           ["speaking", "reading"], 2,
           stemEs="— ¿Alguna alergia o intolerancia?",
           stemAr="— هل هناك أي حساسية أو عدم تحمّل؟",
           options=[opt("tr_u3_11_a", "Sí, soy alérgico a los frutos secos.", "نعم، عندي حساسية من المكسرات.", True),
                    opt("tr_u3_11_b", "Sí, no me gustan los frutos secos.", "نعم، لا أحب المكسرات.", False,
                        "عدم الإعجاب ليس حساسية؛ الفرق مهم صحيًا."),
                    opt("tr_u3_11_c", "No, gracias. La cuenta, por favor.", "لا، شكرًا. الحساب من فضلك.", False,
                        "ردّ غير مناسب في بداية الوجبة.")],
           answerKey={"correctOptionIds": ["tr_u3_11_a"]},
           explanationAr="الحساسية تُعبَّر عنها بـser alérgico a، وتُذكر بوضوح لأنها مسألة سلامة لا تفضيل.",
           errorFeedback={"tr_u3_11_b": "الحساسية ليست تفضيلًا؛ استخدم «soy alérgico a».",
                          "tr_u3_11_c": "طلبت الحساب قبل الأكل؛ غير منطقي."},
           targetVocab=["alérgico"]),

        ex("tr_u3_12_translate", "translate_short", "ترجم إلى الإسبانية.",
           ["writing", "grammar"], 3, stemAr="أريد هذا الطبق بدون غلوتين من فضلك.", stemEs="",
           answerKey={"accepted": ["Quiero este plato sin gluten, por favor.",
                                   "Quisiera este plato sin gluten, por favor.",
                                   "Quiero este plato sin gluten por favor.",
                                   "Para mí, este plato sin gluten, por favor."],
                      "caseSensitive": False, "ignorePunctuation": True},
           explanationAr="«sin gluten» تُوضع بعد الاسم مباشرة: un plato sin gluten. ولا تُستخدم «de» بعد sin.",
           errorFeedback={"sin de gluten": "sin يتبعها الاسم مباشرة: sin gluten.",
                          "sin gluten plato": "الترتيب: el plato sin gluten."},
           targetVocab=["sin gluten", "plato"]),
    ],
    "درس المطعم 3/4 (الحساسية). يحتاج مراجعة إسبانية أصلية، ومراجعة سلامة غذائية: "
    "العبارات لا تُغني عن سؤال المطعم عن التلوّث المتبادل (contaminación cruzada)."))

L.append(lesson(
    "tr-u3-paying", "الفاتورة والدفع",
    "أن يطلب المتعلم الحساب، ويسأل عن طريقة الدفع والبقشيش، ويفهم سؤال النادل عن الدفع منفصلًا أو مجتمعًا.",
    10, ["cuenta", "propina"], ["tarjeta de crédito", "efectivo"],
    ["La cuenta, por favor.", "¿Podemos pagar con tarjeta?", "¿Está incluida la propina?"],
    ["pagar-con", "cuenta-vs-factura"],
    scen("انتهت الوجبة وتريد الدفع.", "طاولة في المطعم بعد الأكل",
         [("¿Todo junto o por separado?", "الكل معًا أم منفصلًا؟", "الحساب كله مع بعض ولا كل واحد لوحده؟", "tr-u3-l4-waiter-1"),
          ("Todo junto, por favor. La cuenta, por favor.", "كله معًا من فضلك. الحساب من فضلك.", "كله مع بعض لو سمحت. الحساب لو سمحت.", "tr-u3-l4-learner-1"),
          ("¿Está incluida la propina?", "هل البقشيش مشمول؟", "الإكرامية متحسبة؟", "tr-u3-l4-learner-2"),
          ("No, no está incluida. ¿Efectivo o tarjeta?", "لا، غير مشمولة. نقدًا أم بالبطاقة؟", "لأ، مش متحسبة. كاش ولا كارت؟", "tr-u3-l4-waiter-2")]),
    [
        ex("tr_u3_13_bill", "fill_blank", "أكمل طلب الحساب.",
           ["writing", "vocabulary"], 1,
           stemEs="La ____, por favor.", stemAr="الحساب من فضلك.",
           answerKey={"accepted": ["cuenta"], "caseSensitive": False},
           explanationAr="في المطعم: la cuenta, por favor. أمّا factura فهي فاتورة ضريبية/تجارية.",
           errorFeedback={"factura": "«factura» فاتورة تجارية؛ في المطعم المطلوب «la cuenta».",
                          "bill": "المطلوب الكلمة الإسبانية: cuenta."},
           targetVocab=["cuenta"]),

        ex("tr_u3_14_card", "word_choice", "كيف تسأل عمّا إذا كان الدفع بالبطاقة ممكنًا؟",
           ["reading", "grammar"], 2,
           options=[opt("tr_u3_14_a", "¿Podemos pagar con tarjeta?", "هل يمكننا الدفع بالبطاقة؟", True),
                    opt("tr_u3_14_b", "¿Podemos pagar por tarjeta?", "هل يمكننا الدفع مقابل بطاقة؟", False,
                        "الأشيع «con tarjeta»؛ «por» توحي بالوسيط/المقابل."),
                    opt("tr_u3_14_c", "¿La tarjeta paga?", "هل البطاقة تدفع؟", False,
                        "البطاقة وسيلة دفع لا فاعل؛ الصيغة: pagar con tarjeta.")],
           answerKey={"correctOptionIds": ["tr_u3_14_a"]},
           explanationAr="طريقة الدفع: pagar con tarjeta / en efectivo. الفعل pagar يتبع بأداة الوسيلة.",
           errorFeedback={"tr_u3_14_b": "الصيغة المعتادة «con tarjeta».",
                          "tr_u3_14_c": "المطلوب: ¿Podemos pagar con tarjeta?"},
           targetVocab=["cuenta"]),

        ex("tr_u3_15_payment_reply", "choose_reply", "النادل يسأل: «¿Efectivo o tarjeta؟» اختر الردّ السليم.",
           ["speaking", "reading"], 2,
           stemEs="— ¿Efectivo o tarjeta?",
           stemAr="— نقدًا أم بالبطاقة؟",
           options=[opt("tr_u3_15_a", "Con tarjeta, por favor.", "بالبطاقة من فضلك.", True),
                    opt("tr_u3_15_b", "Sí, gracias.", "نعم، شكرًا.", False,
                        "السؤال اختيار بين طريقتين لا سؤال نعم/لا."),
                    opt("tr_u3_15_c", "La propina, por favor.", "البقشيش من فضلك.", False,
                        "لم يُطلب منك البقشيش؛ السؤال عن طريقة الدفع.")],
           answerKey={"correctOptionIds": ["tr_u3_15_a"]},
           explanationAr="الإجابة عن الاختيار بـ«Con tarjeta» أو «En efectivo». وللبقشيش سؤال مستقل.",
           errorFeedback={"tr_u3_15_b": "السؤال ليس نعم/لا؛ اختر طريقة الدفع.",
                          "tr_u3_15_c": "الموضوع الآن طريقة الدفع."},
           targetVocab=["propina"]),

        ex("tr_u3_16_translate", "translate_short", "ترجم إلى الإسبانية.",
           ["writing", "grammar"], 3,
           stemAr="الحساب من فضلك، وهل البقشيش مشمول؟", stemEs="",
           answerKey={"accepted": ["La cuenta, por favor. ¿Está incluida la propina?",
                                   "La cuenta, por favor, ¿está incluida la propina?",
                                   "La cuenta, por favor. ¿La propina está incluida?",
                                   "La cuenta por favor. ¿Está incluida la propina?"],
                      "caseSensitive": False, "ignorePunctuation": True},
           explanationAr="سؤال الشمول: ¿Está incluida la propina? بصيغة المبني للمجهول مع estar + participio.",
           errorFeedback={"¿Es incluida la propina?": "الصواب «¿Está incluida…؟» مع estar.",
                          "¿La propina incluye?": "البقشيش لا يُشمِل؛ الصيغة: ¿está incluida?"},
           targetVocab=["cuenta", "propina"]),
    ],
    "درس المطعم 4/4 (الفاتورة والدفع). يحتاج مراجعة إسبانية أصلية لعرف البقشيش في إسبانيا "
    "(غير إلزامي، ويُترك نقدًا عادةً) ولصيغة «¿Todo junto o por separado?»."))

# ---------------------------------------------------------------- تمرين تحدث لكل درس
# النوع speak_with_text يندرج تحت RUBRIC_TYPES في المدقق، فيرفع تنبيه «مستوى A2 بلا تمرين إنتاج/تحدث».
# التقييم ذاتي (self_assessment) لأن المشروع لا يملك تقييم نطق آلي — ولا ندّعي غير ذلك.
SPEAK = {
    "tr-u3-getting-table": (
        "اطلب طاولة بصوت واضح، ثم أجِب عن عدد الأشخاص.",
        "Buenas tardes. Una mesa para dos, por favor. Somos dos.",
        "مساء الخير. طاولة لشخصين من فضلك. نحن اثنان.",
        ["mesa"],),
    "tr-u3-ordering": (
        "اطلب القائمة ثم طبقًا ومشروبًا بصوت واضح.",
        "¿Nos trae el menú, por favor? De primero, una sopa. Para beber, agua.",
        "هل تُحضر لنا القائمة من فضلك؟ أولًا شوربة. وللشرب ماء.",
        ["menú", "plato", "bebida"],),
    "tr-u3-allergy-diet": (
        "اشرح حساسيتك واسأل عن مكوّنات الطبق.",
        "Soy alérgico a los frutos secos. ¿Este plato lleva frutos secos?",
        "عندي حساسية من المكسرات. هل هذا الطبق يحتوي على مكسرات؟",
        ["alérgico", "plato"],),
    "tr-u3-paying": (
        "اطلب الحساب واسأل عن البقشيش وطريقة الدفع.",
        "La cuenta, por favor. ¿Está incluida la propina? ¿Podemos pagar con tarjeta?",
        "الحساب من فضلك. هل البقشيش مشمول؟ هل يمكننا الدفع بالبطاقة؟",
        ["cuenta", "propina"],),
}

for item in L:
    slug = item['lesson']['slug']
    instruction, exemplar, exemplar_ar, vocab = SPEAK[slug]
    item['lesson']['exercises'].append(ex(
        f"{slug.replace('-', '_')}_speak", "speak_with_text",
        instruction + " تمرين مشاركة لا يُصحَّح آليًا (لا يوجد تقييم نطق).",
        ["speaking"], 2,
        stemEs=exemplar, stemAr=exemplar_ar,
        answerKey={"referenceAudioKey": f"pending/{slug}-model-1", "modelAnswer": exemplar},
        explanationAr="قِس نفسك على الوضوح واللباقة وسلامة الصيغة. لا يوجد تقييم نطق آلي، "
                      "والملف الصوتي المرجعي غير متوفر بعد (كل الصوت pending).",
        # المخطط يسمح بـ all_or_nothing / per_item / rubric فقط (self_assessment ليس ضمن enum).
        scoring={"mode": "rubric", "rubric": [
            {"labelAr": "الوضوح", "weight": 50, "code": "clarity"},
            {"labelAr": "سلامة الصيغة واللباقة", "weight": 50, "code": "accuracy"}]},
        targetVocab=vocab))

# ---------------------------------------------------------------- الكتابة
for item in L:
    path = os.path.join(OUT, f"lesson-{item['lesson']['slug']}.json")
    json.dump(item, open(path, 'w'), ensure_ascii=False, indent=2)

json.dump(PACK, open(os.path.join(OUT, f'vocab-{BUNDLE}.json'), 'w'),
          ensure_ascii=False, indent=2)

# دمج الوحدة في paths.json دون إعادة بناء الوحدتين 1 و2
paths_path = os.path.join(OUT, 'paths.json')
paths = json.load(open(paths_path))
prog = next(p for p in paths['programs'] if p['slug'] == 'travel')
unit = {
    "slug": UNIT, "levelCode": "A2", "titleAr": "المطعم: الطلب والدفع", "sortOrder": 3,
    "status": "draft",
    "lessons": ["tr-u3-getting-table", "tr-u3-ordering", "tr-u3-allergy-diet", "tr-u3-paying"],
    "vocabularyBundles": ["tr-shared", BUNDLE],
}
prog['units'] = [u for u in prog['units'] if u['slug'] != UNIT] + [unit]
prog['units'].sort(key=lambda u: u.get('sortOrder', 99))
json.dump(paths, open(paths_path, 'w'), ensure_ascii=False, indent=2)

print(f"tr-u3: {len(L)} lessons, {len(U3_ENTRIES)} vocab entries, paths.json merged")
