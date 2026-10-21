# -*- coding: utf-8 -*-
"""مسار السفر — الوحدة 4: الاتجاهات والمواصلات — 4 دروس + حزمة مفردات خاصة.

تعريف الوحدة من خريطة المنهج (`tr-u4-directions`): «أن يسأل المتعلم عن الاتجاه ويستخدم المواصلات»،
4 دروس، ومستوى الوحدة في الخريطة A2 (وهو مطابق لمستوى الدروس هنا — بخلاف تعارض A1/A2 القائم في
الوحدات 1–3، وهو موثَّق ولم يُعالج هنا لأنه قرار منهجي).

يتبع نفس نمط tools/gen/travel_track.py وtools/gen/travel_unit3_restaurant.py:
محتوى draft بلا مراجعة بشرية، وكل audioKey بحالة pending (لم يُنتج صوت ولم يُعتمد مصدره).

الترتيب الصحيح للتشغيل:
  1) python3 tools/gen/travel_unit4_directions.py   (هذا الملف: الوحدة 4 + حزمتها)
  2) python3 tools/gen/sync_map_lessons.py          (مزامنة خريطة المنهج)
  3) node tools/validate-content.mjs --dir content/drafts/travel

هذا الملف يدمج وحدته داخل paths.json ولا يعيد بناء الوحدات 1–3.
"""
import json, os

OUT = 'content/drafts/travel'
UNIT = 'tr-u4-directions'
BUNDLE = 'tr-u4-directions'


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
def entry(head, pos, gender, ipa, hint, msa, eg, gloss, ex_es, ex_ar, ex_eg, usage, err, rank,
          kind="word", forms=None):
    e = {"headword": head, "normalized": head.lower(), "kind": kind, "pos": pos, "gender": gender,
         "plural": None, "level": "A2", "register": "neutral", "ipa": ipa,
         "pronunciationHintAr": hint, "internalRank": rank, "tags": ["سفر", "اتجاهات", "مواصلات", "A2"],
         "senses": [{"senseNo": 1, "meaningArFusha": msa, "meaningArEg": eg, "glossEs": gloss,
                     "exampleEs": ex_es, "exampleAr": ex_ar, "exampleArEg": ex_eg,
                     "usageNoteAr": usage, "commonErrorAr": err}],
         "examples": [{"es": ex_es, "ar": ex_ar, "arEg": ex_eg}]}
    if forms:
        e["forms"] = [{"kind": "conjugation", "formEs": f, "tense": "presente", "mood": "indicativo",
                       "person": p, "irregular": False}
                      for p, f in zip(["1s", "2s", "3s", "1p", "2p", "3p"], forms)]
    return e


U4_ENTRIES = [
    entry("izquierda", "noun", "f", "/iθˈkjeɾða/", "إيثكييردا", "يسار", "شمال",
          "sustantivo femenino",
          "El banco está a la izquierda.", "البنك على اليسار.", "البنك على الشمال.",
          "الاتجاه يُقال بـ«a la izquierda» («إلى اليسار»). الصفة izquierdo/izquierda تُطابق الاسم: "
          "la mano izquierda.",
          "لا تقل «en la izquierda» للاتجاه؛ الصواب «a la izquierda».", 1),
    entry("derecha", "noun", "f", "/deˈɾetʃa/", "ديريتشا", "يمين", "يمين",
          "sustantivo femenino",
          "Gira a la derecha en la esquina.", "استدر يمينًا عند الناصية.", "خد يمين عند الناصية.",
          "«a la derecha» للاتجاه، و«la mano derecha» لليد اليمنى. "
          "في إسبانيا تُنطق «d» بين الحركتين قريبة من «ذ» الخفيفة.",
          "«la derecha» ليست «الحق» بالمعنى القانوني؛ للحق: el derecho.", 2),
    entry("todo recto", "phrase", None, "/ˈtoðo ˈrekto/", "تودو ريكتو", "على طول / مستقيم", "على طول",
          "locución adverbial",
          "Sigue todo recto hasta el semáforo.", "امشِ على طول حتى إشارة المرور.", "امشي على طول لحد الإشارة.",
          "«todo recto» أو «siempre recto» بمعنى «على طول». وفي أمريكا اللاتينية: «derecho» بدل «recto».",
          "«recto» ليست «right» الإنجليزية؛ معناها «مستقيم». اليمين = derecha.", 3,
          kind="expression"),
    entry("girar", "verb", None, "/xiˈɾaɾ/", "خيرار", "يستدير / يلتف", "يلفّ",
          "verbo regular",
          "Gira a la izquierda después del banco.", "استدر يسارًا بعد البنك.", "خد شمال بعد البنك.",
          "girar = يستدير. ومنها «gire» بصيغة المخاطبة الرسمية (usted) في اللافتات.",
          "«girar» تحتاج حرف «a» مع الاتجاه: girar a la derecha.", 4,
          forms=["giro", "giras", "gira", "giramos", "giráis", "giran"]),
    entry("cruzar", "verb", None, "/kɾuˈθaɾ/", "كروثار", "يعبر (الشارع)", "يعدّي",
          "verbo regular (تغيّر إملائي في 1sg)",
          "Cruza la calle en el semáforo.", "اعبر الشارع عند إشارة المرور.", "عدّي الشارع عند الإشارة.",
          "cruzar la calle = يعبر الشارع. في المتكلم المفرد تُكتب «cruzo» (z→c قبل o) وإن كانت الصيغة منتظمة لفظًا.",
          "لا تقل «cruzar en la calle» للعبور؛ المفعول به مباشر: cruzar la calle.", 5,
          forms=["cruzo", "cruzas", "cruza", "cruzamos", "cruzáis", "cruzan"]),
    entry("esquina", "noun", "f", "/esˈkina/", "إسكينا", "ناصية / زاوية الشارع", "ناصية",
          "sustantivo femenino",
          "El quiosco está en la esquina.", "الكشك عند الناصية.", "الكشك عند الناصية.",
          "«en la esquina» = عند الناصية (مكان)، بينما الاتجاه «a la derecha/izquierda».",
          "«en la esquina» للمكان؛ لا تستخدم «a la esquina» إلا مع الحركة نحوها.", 6),
    entry("semáforo", "noun", "m", "/seˈmafoɾo/", "سيمافورو", "إشارة المرور", "إشارة المرور",
          "sustantivo masculino",
          "Espera en el semáforo en rojo.", "انتظر عند الإشارة الحمراء.", "استنى عند الإشارة الحمرا.",
          "«en verde» أخضر، «en rojo» أحمر، «en ámbar» برتقالي (يُسمى أيضًا amarillo في أمريكا اللاتينية).",
          "«semáforo» مذكّر: el semáforo، لا «la semáforo».", 7),
    entry("cerca", "adv", None, "/ˈθeɾka/", "ثيركا", "قريب", "قريب",
          "adverbio",
          "La estación está cerca de aquí.", "المحطة قريبة من هنا.", "المحطة قريبة من هنا.",
          "cerca de + مكان = قريب من. و«más cerca» = أقرب.",
          "«cerca» تحتاج «de» قبل المكان: cerca de aquí، لا «cerca aquí».", 8),
    entry("lejos", "adv", None, "/ˈlexos/", "ليخوس", "بعيد", "بعيد",
          "adverbio",
          "¿Está lejos el museo?", "هل المتحف بعيد؟", "المتحف بعيد؟",
          "lejos de + مكان = بعيد عن. وللقياس: «a diez minutos a pie».",
          "«lejos» لا تُوصف بـmuy قبلها؟ صحيحة «muy lejos». الخطأ الشائع: «lejos de a aquí».", 9),
    entry("a pie", "phrase", None, "/a ˈpje/", "آ بيه", "مشيًا / على القدمين", "على رجليك",
          "locución adverbial",
          "Voy al hotel a pie.", "أذهب إلى الفندق مشيًا.", "أروح الفندق على رجليا.",
          "«a pie» = مشيًا. و«ir andando» صيغة أخرى شائعة في إسبانيا.",
          "«a pie» بلا أداة تعريف: لا تقل «al pie» للتنقّل (al pie = عند قدم الشيء).", 10,
          kind="expression"),
    entry("metro", "noun", "m", "/ˈmetɾo/", "ميترو", "مترو الأنفاق", "المترو",
          "sustantivo masculino",
          "¿Dónde está la estación de metro?", "أين محطة المترو؟", "محطة المترو فين؟",
          "«el metro» في إسبانيا؛ وفي بعض بلدان أمريكا اللاتينية «el subte» (الأرجنتين) أو «el subterráneo».",
          "«metro» مذكّر: el metro. ولا تخلطه بـ«el metro» بمعنى وحدة القياس (متر).", 11),
    entry("línea", "noun", "f", "/ˈlinea/", "لينيا", "خط (مترو/باص)", "خط",
          "sustantivo femenino",
          "Tome la línea dos.", "خذ الخط الثاني.", "خد الخط التاني.",
          "«la línea 2» أو «la línea dos». وفي المحطات: «línea de metro».",
          "«línea» مؤنثة: la línea، لا «el línea».", 12),
    entry("parada", "noun", "f", "/paˈɾaða/", "بارادا", "موقف (باص)", "موقف",
          "sustantivo femenino",
          "La parada del autobús está enfrente.", "موقف الباص في الجهة المقابلة.", "موقف الأتوبيس قصادك.",
          "«parada» للباص، و«estación» للمترو/القطار. و«parada de taxi» = موقف التاكسي.",
          "لا تخلط «parada» (موقف) بـ«paradero» (شائع في أمريكا اللاتينية للموقف النهائي).", 13),
    entry("transbordo", "noun", "m", "/tɾanzˈβoɾðo/", "ترانسبوردو", "تحويل بين خطين", "تبديل خط",
          "sustantivo masculino",
          "Tiene que hacer transbordo en la línea tres.", "عليك التحويل عند الخط الثالث.", "لازم تبدّل عند الخط التالت.",
          "«hacer transbordo» = يغيّر الخط. وفي بعض المدن «cambio de línea».",
          "«transbordo» لا يُستخدم بمعنى «تذكرة»؛ التذكرة billete.", 14),
    entry("taxi", "noun", "m", "/ˈtaksi/", "تاكسي", "سيارة أجرة", "تاكسي",
          "sustantivo masculino",
          "Vamos en taxi al aeropuerto.", "نذهب بالتاكسي إلى المطار.", "نروح المطار بالتاكسي.",
          "«coger un taxi» (إسبانيا) و«tomar un taxi» (أمريكا اللاتينية) = يستقل تاكسيًا.",
          "«taxi» مذكّر: el taxi. ولا تستخدم «coche» للتاكسي في الحوار.", 15),
    entry("parar", "verb", None, "/paˈɾaɾ/", "بارار", "يتوقف / يوقف", "يقف",
          "verbo regular",
          "El autobús para en la esquina.", "الباص يتوقف عند الناصية.", "الأتوبيس بيقف عند الناصية.",
          "مع سائق التاكسي نستخدم صيغة usted: «Pare aquí». وللسيارة نفسها: «el coche para».",
          "«parar» ≠ «pararse» (الأخيرة تعني يتوقّف عن الحركة، وفي بعض البلدان يقف واقفًا).", 16,
          forms=["paro", "paras", "para", "paramos", "paráis", "paran"]),
    entry("mapa", "noun", "m", "/ˈmapa/", "مابا", "خريطة", "خريطة",
          "sustantivo masculino",
          "¿Tiene un mapa de la ciudad?", "هل لديك خريطة للمدينة؟", "عندك خريطة للمدينة؟",
          "«el mapa» مذكّر رغم انتهائه بـ-a (كلمة يونانية الأصل) — مثل el problema وel idioma.",
          "«la mapa» خطأ شائع لأن الكلمة تنتهي بـ-a؛ الصواب «el mapa».", 17),
]

PACK = {
    # الحقول المسموحة فقط حسب content/schema/vocabulary.schema.json (additionalProperties=false).
    "schemaVersion": "1.0.0",
    "bundleSlug": BUNDLE,
    "pronunciationNoteAr": "النقل بالحروف العربية تقريب فقط. في إسبانيا تُنطق z وce قريبة من «ث»، "
                           "وفي أمريكا اللاتينية «س» — الملفات الصوتية لم تُنتج بعد.",
    "source": {"title": "مفردات الاتجاهات والمواصلات — إعداد داخلي لمراجعة بشرية قبل النشر", "url": "",
               "license": "internal-draft", "accessedAt": "2026-10-21",
               "rankingNote": "internalRank داخلي لسَلسَلة التدريس، وليس ادعاءً بأن الكلمات الأكثر شيوعًا."},
    "entries": U4_ENTRIES,
}

# ---------------------------------------------------------------- الدروس
L = []

L.append(lesson(
    "tr-u4-asking-directions", "أين ...؟ أسأل عن مكان",
    "أن يسأل المتعلم عن مكان في الشارع بصيغة مهذّبة، ويفهم جوابًا قصيرًا فيه يمين أو يسار أو «على طول»، ويسأل عن خريطة.",
    10, ["izquierda", "derecha", "todo recto", "mapa"], ["puerta"],
    ["¿Dónde está la Plaza Mayor?", "Todo recto y luego a la izquierda.", "¿Tiene un mapa, por favor?"],
    ["donde-esta-vs-donde-es", "a-la-derecha"],
    scen("أنت في شارع في مدريد وتريد الوصول إلى ساحة البلدة.", "الشارع، تسأل أحد المارّة",
         [("Perdón, ¿dónde está la Plaza Mayor?", "عفوًا، أين ساحة مايور؟", "لو سمحت، ساحة مايور فين؟", "tr-u4-l1-learner-1"),
          ("Todo recto y luego a la izquierda.", "على طول ثم إلى اليسار.", "على طول وبعدين شمال.", "tr-u4-l1-pass-1"),
          ("¿A la izquierda o a la derecha?", "إلى اليسار أم إلى اليمين؟", "شمال ولا يمين؟", "tr-u4-l1-learner-2"),
          ("A la izquierda, después del semáforo.", "إلى اليسار، بعد إشارة المرور.", "شمال، بعد الإشارة.", "tr-u4-l1-pass-2")]),
    [
        ex("tr_u4_1_straight", "fill_blank", "أكمل عبارة «على طول».",
           ["writing", "vocabulary"], 1,
           stemEs="Sigue todo ____ hasta la plaza.", stemAr="امشِ على طول حتى الساحة.",
           answerKey={"accepted": ["recto"], "caseSensitive": False},
           explanationAr="«todo recto» = على طول/مستقيم. ولا تعني «right» الإنجليزية بل «مستقيم»، "
                         "واليمين derecha.",
           errorFeedback={"derecho": "«todo derecho» صيغة أمريكا اللاتينية؛ في إسبانيا «todo recto».",
                          "derecha": "«derecha» = يمين، وليست «على طول»."},
           targetVocab=["todo recto"]),

        ex("tr_u4_2_where_ser", "word_choice", "أي سؤال صحيح عن مكان المتحف؟",
           ["reading", "grammar"], 2,
           options=[opt("tr_u4_2_a", "¿Dónde está el museo?", "أين المتحف؟", True),
                    opt("tr_u4_2_b", "¿Dónde es el museo?", "أين يكون المتحف؟", False,
                        "«ser» لا يُستخدم لموقع الأماكن؛ المكان يُسأل عنه بـestar."),
                    opt("tr_u4_2_c", "¿Dónde hay el museo?", "هل يوجد المتحف؟", False,
                        "مع أداة التعريف «el» نستخدم estar؛ «hay» بلا أداة تعريف.")],
           answerKey={"correctOptionIds": ["tr_u4_2_a"]},
           explanationAr="موقع مكان محدَّد: ¿Dónde está…? + أداة تعريف. أمّا hay فتُستخدم للتنكير: "
                         "¿Hay un museo cerca?",
           errorFeedback={"tr_u4_2_b": "الصواب: ¿Dónde está el museo?",
                          "tr_u4_2_c": "«hay» تُستخدم بلا أداة تعريف: ¿Hay un museo cerca?"},
           targetVocab=["mapa"]),

        ex("tr_u4_3_left_right", "choose_reply", "قال لك المارّة: «Todo recto y luego a la izquierda». اختر ردّك الأنسب.",
           ["speaking", "reading"], 2,
           stemEs="— Todo recto y luego a la izquierda.",
           stemAr="— على طول ثم إلى اليسار.",
           options=[opt("tr_u4_3_a", "Entendido, gracias. ¿Está lejos?", "فهمت، شكرًا. هل هو بعيد؟", True),
                    opt("tr_u4_3_b", "No, gracias. Adiós.", "لا، شكرًا. وداعًا.", False,
                        "لم يحدث ما يرفضه؛ الشكر ثم سؤال تكميلي أنسب."),
                    opt("tr_u4_3_c", "¿Cuánto cuesta?", "كم الثمن؟", False,
                        "السؤال عن السعر لا يخصّ الاتجاه في الشارع.")],
           answerKey={"correctOptionIds": ["tr_u4_3_a"]},
           explanationAr="بعد فهم الاتجاه: تأكيد + شكر + سؤال تكميلي (¿Está lejos?).",
           errorFeedback={"tr_u4_3_b": "الردّ «No, gracias» يرفض ما لا يحتاج رفضًا.",
                          "tr_u4_3_c": "لا يوجد ثمن مقابل إرشاد في الشارع."},
           targetVocab=["izquierda"]),

        ex("tr_u4_4_translate", "translate_short", "ترجم إلى الإسبانية.",
           ["writing", "grammar"], 3, stemAr="عفوًا، أين المترو من فضلك؟", stemEs="",
           answerKey={"accepted": ["Perdón, ¿dónde está el metro, por favor?",
                                   "Perdone, ¿dónde está el metro, por favor?",
                                   "Disculpe, ¿dónde está el metro, por favor?",
                                   "¿Dónde está el metro, por favor?"],
                      "caseSensitive": False, "ignorePunctuation": True},
           explanationAr="لفت الانتباه بلباقة: Perdón / Perdone / Disculpe، ثم ¿Dónde está…?",
           errorFeedback={"¿Dónde es el metro?": "المكان بـestar: ¿Dónde está el metro؟",
                          "¿Dónde está metro?": "ناقصة أداة التعريف: el metro."},
           targetVocab=["izquierda", "derecha"]),
    ],
    "درس الاتجاهات 1/4 (السؤال عن مكان). يحتاج مراجعة إسبانية أصلية لصيغ لفت الانتباه في الشارع "
    "(Perdón/Perdone/Disculpe) ولفظ recto مقابل derecho بين إسبانيا وأمريكا اللاتينية."))

L.append(lesson(
    "tr-u4-walking-route", "امشِ واستدر واعبر",
    "أن يتبع المتعلم تعليمات سير متتابعة (استدر، اعبر، عند الناصية، عند الإشارة)، ويسأل هل المكان قريب أو بعيد وكم دقيقة مشيًا.",
    12, ["girar", "cruzar", "esquina", "semáforo", "cerca", "lejos", "a pie"], ["llegada", "salida"],
    ["Gira a la derecha en la esquina.", "Cruza la calle en el semáforo.", "¿Está lejos? A cinco minutos a pie."],
    ["girar-a", "cruzar-la-calle", "cerca-de"],
    scen("تسأل عن الطريق إلى متحف قريب، والجواب تعليمات متتابعة.", "في الشارع مع أحد المارّة",
         [("Sigue recto hasta el semáforo y gira a la derecha.", "امشِ على طول حتى الإشارة ثم استدر يمينًا.", "امشي على طول لحد الإشارة وبعدين خد يمين.", "tr-u4-l2-pass-1"),
          ("¿Y después?", "وبعد ذلك؟", "وبعدين؟", "tr-u4-l2-learner-1"),
          ("Cruza la calle en la esquina. El museo está cerca.", "اعبر الشارع عند الناصية. المتحف قريب.", "عدّي الشارع عند الناصية. المتحف قريب.", "tr-u4-l2-pass-2"),
          ("¿Está lejos? — No, a cinco minutos a pie.", "هل هو بعيد؟ — لا، خمس دقائق مشيًا.", "بعيد؟ — لأ، خمس دقايق على رجليك.", "tr-u4-l2-learner-2")]),
    [
        ex("tr_u4_5_girar", "fill_blank", "أكمل تعليمة الاستدارة (المخاطبة الرسمية usted).",
           ["writing", "grammar"], 2,
           stemEs="____ a la derecha en la esquina, por favor.", stemAr="استدر يمينًا عند الناصية من فضلك.",
           answerKey={"accepted": ["Gire", "Gira"], "caseSensitive": False},
           explanationAr="«Gire» بصيغة usted (الأدقّ مع الغرباء)، و«Gira» بصيغة tú. كلتاهما مستخدمة، "
                         "والمخاطبة الرسمية أنسب في الشارع.",
           errorFeedback={"Girar": "هذه صيغة المصدر؛ المطلوب صيغة أمر: Gire/Gira.",
                          "Giro": "«Giro» = أنا أستدير (متكلم)؛ المطلوب أمر للمخاطب."},
           targetVocab=["girar", "esquina"]),

        ex("tr_u4_6_cruzar", "word_choice", "كيف تقول «اعبر الشارع عند الإشارة»؟",
           ["reading", "grammar"], 2,
           options=[opt("tr_u4_6_a", "Cruza la calle en el semáforo.", "اعبر الشارع عند إشارة المرور.", True),
                    opt("tr_u4_6_b", "Cruza en la calle al semáforo.", "اعبر في الشارع إلى الإشارة؟", False,
                        "الشارع مفعول به مباشر بلا حرف جر: cruzar la calle."),
                    opt("tr_u4_6_c", "Pasa la calle por el semáforo.", "مرّ الشارع عبر الإشارة؟", False,
                        "«pasar la calle» غير مستخدمة بهذا المعنى؛ الصواب cruzar.")],
           answerKey={"correctOptionIds": ["tr_u4_6_a"]},
           explanationAr="cruzar + مفعول به مباشر (la calle)، وتحديد المكان بـ«en el semáforo».",
           errorFeedback={"tr_u4_6_b": "لا حرف جر بين cruzar والشارع: cruzar la calle.",
                          "tr_u4_6_c": "الفعل المناسب للعبور: cruzar."},
           targetVocab=["cruzar", "semáforo"]),

        ex("tr_u4_7_far", "choose_reply", "المارّة قالوا إن المتحف «a cinco minutos a pie». اختر الردّ السليم على سؤال «هل هو بعيد؟».",
           ["speaking", "reading"], 2,
           stemEs="— ¿Está lejos el museo?",
           stemAr="— هل المتحف بعيد؟",
           options=[opt("tr_u4_7_a", "No, está cerca. A cinco minutos a pie.", "لا، إنه قريب. خمس دقائق مشيًا.", True),
                    opt("tr_u4_7_b", "Sí, está muy cerca.", "نعم، إنه قريب جدًا.", False,
                        "تناقض: «sí» مع «cerca»؛ والجواب المنطقي «no»."),
                    opt("tr_u4_7_c", "No, está lejos de cerca.", "لا، إنه بعيد من قريب؟", False,
                        "تركيب غير سليم لغويًا ولا معنى له.")],
           answerKey={"correctOptionIds": ["tr_u4_7_a"]},
           explanationAr="«no + cerca» أو «sí + lejos» — التطابق المنطقي مطلوب. والقياس: a + مدة + a pie.",
           errorFeedback={"tr_u4_7_b": "«Sí, muy cerca» متناقض؛ الصواب: No, está cerca.",
                          "tr_u4_7_c": "لا يوجد «lejos de cerca»؛ إمّا cerca وإمّا lejos."},
           targetVocab=["cerca", "lejos", "a pie"]),

        ex("tr_u4_8_translate", "translate_short", "ترجم إلى الإسبانية.",
           ["writing", "grammar"], 3, stemAr="اعبر الشارع عند الإشارة من فضلك.", stemEs="",
           answerKey={"accepted": ["Cruza la calle en el semáforo, por favor.",
                                   "Cruce la calle en el semáforo, por favor.",
                                   "Cruza la calle en el semáforo por favor.",
                                   "Cruce la calle en el semáforo por favor."],
                      "caseSensitive": False, "ignorePunctuation": True},
           explanationAr="«Cruza» (tú) أو «Cruce» (usted)، ثم la calle بلا حرف جر، ثم en el semáforo.",
           errorFeedback={"Cruza en la calle el semáforo": "الترتيب والمعنى مختلطان؛ الصواب en el semáforo.",
                          "Cruzar la calle": "المطلوب صيغة أمر: Cruza/Cruce."},
           targetVocab=["cruzar", "semáforo"]),
    ],
    "درس الاتجاهات 2/4 (تعليمات السير). يحتاج مراجعة إسبانية أصلية: هل «Pasa la calle» مستخدمة إقليميًا؟ "
    "ومقابل «a pie» مقابل «andando» في إسبانيا."))

L.append(lesson(
    "tr-u4-bus-metro", "المترو والباص",
    "أن يسأل المتعلم عن الخط المناسب، ويشتري تذكرة، ويفهم تعليمة التحويل بين خطين، ويعرف أين الموقف.",
    12, ["metro", "línea", "parada", "transbordo"], ["billete"],
    ["¿Qué línea va al centro?", "Tiene que hacer transbordo en Goya.", "¿Dónde está la parada del autobús?"],
    ["tener-que", "linea-parada"],
    scen("في محطة المترو، تسأل موظف المحطة عن الطريق إلى المركز.", "شبّاك معلومات محطة المترو",
         [("Perdone, ¿qué línea va al centro?", "عفوًا، أي خط يذهب إلى المركز؟", "لو سمحت، أنهي خط رايح الداون تاون؟", "tr-u4-l3-learner-1"),
          ("La línea dos. Tiene que hacer transbordo en Goya.", "الخط الثاني. عليك التحويل في جويا.", "الخط التاني. لازم تبدّل في جويا.", "tr-u4-l3-staff-1"),
          ("¿Cuánto cuesta el billete?", "كم سعر التذكرة؟", "التذكرة بكام؟", "tr-u4-l3-learner-2"),
          ("Dos euros. La parada del autobús está enfrente.", "يوروان. موقف الباص في الجهة المقابلة.", "اتنين يورو. موقف الأتوبيس قصادك.", "tr-u4-l3-staff-2")]),
    [
        ex("tr_u4_9_transfer", "fill_blank", "أكمل تعليمة التحويل بين خطين.",
           ["writing", "vocabulary"], 2,
           stemEs="Tiene que hacer ____ en la próxima estación.", stemAr="عليك التحويل في المحطة القادمة.",
           answerKey={"accepted": ["transbordo"], "caseSensitive": False},
           explanationAr="«hacer transbordo» = يغيّر الخط. والفعل المساعد: tener que + مصدر.",
           errorFeedback={"cambio": "«cambio» تعني «تغيير» عمومًا؛ في المواصلات المصطلح «transbordo».",
                          "transferencia": "«transferencia» للحوالات البنكية لا للمترو."},
           targetVocab=["transbordo"]),

        ex("tr_u4_10_line", "word_choice", "كيف تسأل: «أي خط يذهب إلى المركز؟»",
           ["reading", "grammar"], 2,
           options=[opt("tr_u4_10_a", "¿Qué línea va al centro?", "أي خط يذهب إلى المركز؟", True),
                    opt("tr_u4_10_b", "¿Qué línea es al centro?", "أي خط يكون إلى المركز؟", False,
                        "الحركة تُعبَّر عنها بـir: va al centro، لا ser."),
                    opt("tr_u4_10_c", "¿Qué línea va centro?", "أي خط يذهب مركز؟", False,
                        "ناقصة «a» + أداة التعريف: al centro.")],
           answerKey={"correctOptionIds": ["tr_u4_10_a"]},
           explanationAr="a + el = al. و«ir al centro» = يذهب إلى المركز.",
           errorFeedback={"tr_u4_10_b": "الحركة بـir: ¿Qué línea va al centro?",
                          "tr_u4_10_c": "«al» ضرورية: al centro."},
           targetVocab=["línea", "metro"]),

        ex("tr_u4_11_transfer_reply", "choose_reply", "قال الموظف: «Tiene que hacer transbordo en Goya». اختر الردّ الأنسب.",
           ["speaking", "reading"], 3,
           stemEs="— Tiene que hacer transbordo en Goya.",
           stemAr="— عليك التحويل في جويا.",
           options=[opt("tr_u4_11_a", "Entendido. ¿Y luego qué línea tomo?", "فهمت. وأي خط آخذ بعد ذلك؟", True),
                    opt("tr_u4_11_b", "No, gracias, voy a pie.", "لا، شكرًا، سأذهب مشيًا.", False,
                        "ردّ يرفض المعلومة بلا سبب داخل المحطة."),
                    opt("tr_u4_11_c", "¿Dónde está la cuenta?", "أين الحساب؟", False,
                        "الحساب في المطعم لا في محطة المترو.")],
           answerKey={"correctOptionIds": ["tr_u4_11_a"]},
           explanationAr="تأكيد الفهم ثم سؤال الخط التالي: ¿Y luego qué línea tomo?",
           errorFeedback={"tr_u4_11_b": "الرفض لا معنى له بعد التعليمة.",
                          "tr_u4_11_c": "خلط بين سياق المطعم وسياق المواصلات."},
           targetVocab=["transbordo", "línea"]),

        ex("tr_u4_12_translate", "translate_short", "ترجم إلى الإسبانية.",
           ["writing", "grammar"], 3, stemAr="أين موقف الباص من فضلك؟", stemEs="",
           answerKey={"accepted": ["¿Dónde está la parada del autobús, por favor?",
                                   "¿Dónde está la parada del autobús por favor?",
                                   "Perdone, ¿dónde está la parada del autobús?",
                                   "¿Dónde está la parada de autobús, por favor?"],
                      "caseSensitive": False, "ignorePunctuation": True},
           explanationAr="«la parada del autobús»: de + el = del. والتذكير/التأنيث: parada مؤنثة.",
           errorFeedback={"¿Dónde está el parada?": "parada مؤنثة: la parada.",
                          "¿Dónde está la parada de el autobús?": "تُدمج: del autobús."},
           targetVocab=["parada", "billete"]),
    ],
    "درس الاتجاهات 3/4 (المترو والباص). يحتاج مراجعة إسبانية أصلية لمصطلح «transbordo» مقابل «cambio» "
    "و«parada» مقابل «estación» في مدن إسبانيا."))

L.append(lesson(
    "tr-u4-taxi", "التاكسي",
    "أن يطلب المتعلم تاكسيًا ويحدد الوجهة، ويسأل عن السعر التقريبي، ويطلب التوقف، ويسأل عن طريقة الدفع.",
    10, ["taxi", "parar"], ["tarjeta de crédito", "efectivo", "aeropuerto"],
    ["Lléveme al aeropuerto, por favor.", "¿Cuánto cuesta, más o menos?", "Pare aquí, por favor."],
    ["llevar-imperativo-usted", "pare-aqui"],
    scen("تستقل تاكسيًا من الفندق إلى المطار.", "داخل التاكسي مع السائق",
         [("Buenas. ¿Adónde vamos?", "مساء الخير. إلى أين نذهب؟", "مساء الخير. رايحين فين؟", "tr-u4-l4-driver-1"),
          ("Lléveme al aeropuerto, por favor.", "خذني إلى المطار من فضلك.", "ودّيني المطار لو سمحت.", "tr-u4-l4-learner-1"),
          ("¿Cuánto cuesta, más o menos?", "كم التكلفة تقريبًا؟", "هيكلّف كام تقريبًا؟", "tr-u4-l4-learner-2"),
          ("Unos doce euros. ¿Puede pagar con tarjeta?", "حوالي اثني عشر يورو. هل يمكنك الدفع بالبطاقة؟", "حوالي اتناشر يورو. تقدر تدفع بالكارت؟", "tr-u4-l4-driver-2")]),
    [
        ex("tr_u4_13_stop", "fill_blank", "أكمل طلب التوقف بصيغة المخاطبة الرسمية (usted).",
           ["writing", "grammar"], 2,
           stemEs="____ aquí, por favor.", stemAr="توقف هنا من فضلك.",
           answerKey={"accepted": ["Pare"], "caseSensitive": False},
           explanationAr="مع سائق التاكسي نستخدم usted: «Pare aquí». وصيغة tú هي «Para aquí».",
           errorFeedback={"Para": "«Para» صحيحة مع tú؛ مع الغرباء الأنسب «Pare».",
                          "Parar": "هذه صيغة المصدر؛ المطلوب أمر: Pare."},
           targetVocab=["parar", "taxi"]),

        ex("tr_u4_14_destination", "word_choice", "كيف تطلب من السائق أن يأخذك إلى المطار؟",
           ["reading", "speaking"], 2,
           options=[opt("tr_u4_14_a", "Lléveme al aeropuerto, por favor.", "خذني إلى المطار من فضلك.", True),
                    opt("tr_u4_14_b", "Llevo al aeropuerto, por favor.", "أنا آخذ إلى المطار؟", False,
                        "«Llevo» = أنا آخذ (متكلم)؛ المطلوب أمر للمخاطب: Lléveme."),
                    opt("tr_u4_14_c", "Voy al aeropuerto con tú.", "أذهب إلى المطار معك أنت؟", False,
                        "ضمير بعد حرف الجر يكون «ti»: contigo، والتركيب غير مناسب لطلب الوجهة.")],
           answerKey={"correctOptionIds": ["tr_u4_14_a"]},
           explanationAr="طلب الوجهة: «Lléveme a…» (usted) أو «Llévame a…» (tú). وa + el = al.",
           errorFeedback={"tr_u4_14_b": "المطلوب أمر: Lléveme / Llévame.",
                          "tr_u4_14_c": "بعد حرف الجر: ti لا tú، والأفضل «Lléveme al aeropuerto»."},
           targetVocab=["aeropuerto", "taxi"]),

        ex("tr_u4_15_pay", "choose_reply", "قال السائق: «Son doce euros». اختر الردّ الأنسب.",
           ["speaking", "reading"], 2,
           stemEs="— Son doce euros.",
           stemAr="— التكلفة اثنا عشر يورو.",
           options=[opt("tr_u4_15_a", "¿Puedo pagar con tarjeta?", "هل يمكنني الدفع بالبطاقة؟", True),
                    opt("tr_u4_15_b", "La cuenta, por favor.", "الحساب من فضلك.", False,
                        "«la cuenta» في المطعم؛ في التاكسي يُقال «Son doce euros» ثم تدفع."),
                    opt("tr_u4_15_c", "No entiendo el menú.", "لا أفهم القائمة.", False,
                        "لا قائمة في التاكسي؛ الموقف مختلف.")],
           answerKey={"correctOptionIds": ["tr_u4_15_a"]},
           explanationAr="السؤال عن طريقة الدفع: ¿Puedo pagar con tarjeta? أو «¿Acepta tarjeta?».",
           errorFeedback={"tr_u4_15_b": "«La cuenta» تخصّ المطعم؛ هنا ذكر السائق السعر مباشرة.",
                          "tr_u4_15_c": "لا علاقة للقائمة بالموقف."},
           targetVocab=["tarjeta de crédito", "efectivo"]),

        ex("tr_u4_16_translate", "translate_short", "ترجم إلى الإسبانية.",
           ["writing", "grammar"], 3, stemAr="أريد الذهاب إلى المطار.", stemEs="",
           answerKey={"accepted": ["Quiero ir al aeropuerto.",
                                   "Quisiera ir al aeropuerto.",
                                   "Quiero ir al aeropuerto, por favor."],
                      "caseSensitive": False, "ignorePunctuation": True},
           explanationAr="querer + مصدر: quiero ir. وa + el = al: al aeropuerto.",
           errorFeedback={"Quiero voy al aeropuerto": "فعلان مصرّفان معًا؛ بعد querer يأتي المصدر: ir.",
                          "Quiero ir a el aeropuerto": "تُدمج: al aeropuerto."},
           targetVocab=["aeropuerto", "taxi"]),
    ],
    "درس الاتجاهات 4/4 (التاكسي). يحتاج مراجعة إسبانية أصلية لـ«Lléveme» مقابل «Lléveme a» إقليميًا، "
    "ولعرف الدفع بالبطاقة في تاكسيات إسبانيا (بعضها نقدًا فقط)."))

# ---------------------------------------------------------------- تمرين تحدث لكل درس
SPEAK = {
    "tr-u4-asking-directions": (
        "اسأل عن مكان ثم أكّد فهمك للاتجاه.",
        "Perdón, ¿dónde está la Plaza Mayor? — Todo recto y a la izquierda. — Entendido, gracias.",
        "عفوًا، أين ساحة مايور؟ — على طول ثم إلى اليسار. — فهمت، شكرًا.",
        ["todo recto", "izquierda"],),
    "tr-u4-walking-route": (
        "كرّر تعليمات السير بصوت واضح ثم اسأل عن المسافة.",
        "Gira a la derecha en la esquina y cruza la calle. ¿Está lejos? — No, a cinco minutos a pie.",
        "استدر يمينًا عند الناصية واعبر الشارع. هل هو بعيد؟ — لا، خمس دقائق مشيًا.",
        ["girar", "cruzar", "esquina", "lejos"],),
    "tr-u4-bus-metro": (
        "اسأل عن الخط المناسب ثم عن سعر التذكرة.",
        "Perdone, ¿qué línea va al centro? ¿Cuánto cuesta el billete?",
        "عفوًا، أي خط يذهب إلى المركز؟ كم سعر التذكرة؟",
        ["línea", "metro", "billete"],),
    "tr-u4-taxi": (
        "حدّد وجهتك واطلب التوقف بصيغة مهذّبة.",
        "Lléveme al aeropuerto, por favor. ¿Cuánto cuesta, más o menos? Pare aquí, por favor.",
        "خذني إلى المطار من فضلك. كم التكلفة تقريبًا؟ توقف هنا من فضلك.",
        ["taxi", "aeropuerto", "parar"],),
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

# دمج الوحدة في paths.json دون إعادة بناء الوحدات السابقة
paths_path = os.path.join(OUT, 'paths.json')
paths = json.load(open(paths_path))
prog = next(p for p in paths['programs'] if p['slug'] == 'travel')
unit = {
    "slug": UNIT, "levelCode": "A2", "titleAr": "الاتجاهات والمواصلات", "sortOrder": 4,
    "status": "draft",
    "lessons": ["tr-u4-asking-directions", "tr-u4-walking-route", "tr-u4-bus-metro", "tr-u4-taxi"],
    "vocabularyBundles": ["tr-shared", BUNDLE],
}
prog['units'] = [u for u in prog['units'] if u['slug'] != UNIT] + [unit]
prog['units'].sort(key=lambda u: u.get('sortOrder', 99))
json.dump(paths, open(paths_path, 'w'), ensure_ascii=False, indent=2)

print(f"tr-u4: {len(L)} lessons, {len(U4_ENTRIES)} vocab entries, paths.json merged")
