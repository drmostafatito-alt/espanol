# -*- coding: utf-8 -*-
"""مسار السفر: وحدتا المطار والفندق (8 دروس) + حزمة مفردات مشتركة.
كل المحتوى draft/unreviewed، وكل مقاطع الصوت pending (لا ملفات صوتية).
"""
import json, os
OUT = 'content/drafts/travel'

def opt(oid, text, textAr=None, correct=False, why=None):
    o = {"id": oid, "text": text, "isCorrect": bool(correct)}
    if textAr: o["textAr"] = textAr
    if why: o["distractorRationaleAr"] = why
    return o

def ex(eid, typ, instructionAr, skills, difficulty, **kw):
    d = {"id": eid, "type": typ, "instructionAr": instructionAr}
    d.update(kw); d["skills"] = skills; d["difficulty"] = difficulty
    d.setdefault("scoring", {"mode": "all_or_nothing"})
    return d

def review(note):
    return {"status": "draft", "authors": ["فريق المنهج — إعداد أصلي بمساعدة نموذج، بلا مراجعة بشرية بعد"],
            "spanishReviewer": None, "translationReviewer": None, "reviewedAt": None, "notes": note}

AUDIO = "كل مقاطع الصوت pending ولم يُنتج أي ملف (لم يُعتمد مصدر ولا ترخيص)."

def lesson(slug, titleAr, unit, objectiveAr, minutes, newVocab, reviewVocab, structures, grammar, scenario, exercises, note):
    return {"schemaVersion": "1.0.0", "lesson": {
        "slug": slug, "titleAr": titleAr, "level": "A2", "programSlug": "travel", "unitSlug": unit,
        "objectiveAr": objectiveAr, "estimatedMinutes": minutes,
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
            "lines": [{"es": es, "ar": ar, "arEg": eg, "audioKey": f"pending/{key}"} for (es, ar, eg, key) in lines]}

# ---------------------------------------------------------------- المفردات
def entry(head, pos, gender, ipa, hint, msa, eg, gloss, ex_es, ex_ar, ex_eg, usage, err, rank):
    return {"headword": head, "normalized": head.lower(), "kind": "word", "pos": pos, "gender": gender,
            "plural": None, "level": "A2", "register": "neutral", "ipa": ipa, "pronunciationHintAr": hint,
            "internalRank": rank, "tags": ["سفر", "A2"],
            "senses": [{"senseNo": 1, "meaningArFusha": msa, "meaningArEg": eg, "glossEs": gloss,
                        "exampleEs": ex_es, "exampleAr": ex_ar, "exampleArEg": ex_eg,
                        "usageNoteAr": usage, "commonErrorAr": err}],
            "examples": [{"es": ex_es, "ar": ex_ar, "arEg": ex_eg}]}

TR_ENTRIES = [
 entry("vuelo", "noun", "m", "/ˈbwelo/", "بويلو", "رحلة جوية", "طيرانة/رحلة", "sustantivo masculino",
       "Mi vuelo sale a las siete.", "رحلتي تنطلق الساعة السابعة.", "رحلتي بتقوم الساعة سبعة.",
       "vuelo = الرحلة، volar = يطير.", "لا تخلط vuelo (رحلة) بـvuelta (عودة).", 1),
 entry("aeropuerto", "noun", "m", "/aeɾoˈpweɾto/", "أيروبويرتو", "مطار", "مطار", "sustantivo masculino",
       "El aeropuerto está lejos.", "المطار بعيد.", "المطار بعيد.",
       "en el aeropuerto = في المطار.", "«la aeropuerto» خطأ؛ مذكر.", 2),
 entry("billete", "noun", "m", "/biˈʎete/", "بيييتي", "تذكرة", "تذكرة", "sustantivo masculino",
       "Aquí tiene su billete.", "تفضل تذكرتك.", "اتفضل تذكرتك.",
       "في أمريكا اللاتينية: boleto/pasaje.", "«la billete» خطأ؛ مذكر.", 3),
 entry("puerta", "noun", "f", "/ˈpweɾta/", "بويرتا", "بوابة (في المطار) / باب", "بوابة", "sustantivo femenino",
       "El vuelo sale por la puerta 12.", "الرحلة من البوابة 12.", "الرحلة من بوابة 12.",
       "puerta de embarque = بوابة الصعود.", "لا تخلط puerta (باب) بـpuerto (ميناء).", 4),
 entry("embarque", "noun", "m", "/emˈbaɾke/", "إمباركي", "الصعود إلى الطائرة", "الصعود للطيارة", "sustantivo masculino",
       "El embarque empieza a las seis.", "الصعود يبدأ الساعة السادسة.", "الصعود بيبدأ الساعة ستة.",
       "tarjeta de embarque = بطاقة الصعود.", "«embarcación» قارب، وليست الصعود.", 5),
 entry("retraso", "noun", "m", "/reˈtɾaso/", "ريتراسو", "تأخير", "تأخير", "sustantivo masculino",
       "Hay un retraso de dos horas.", "هناك تأخير ساعتين.", "في تأخير ساعتين.",
       "con retraso = متأخرًا؛ llegar con retraso = يصل متأخرًا.", "«retrasado» صفة الشخص المتأخر لا التأخير نفسه.", 6),
 entry("equipaje", "noun", "m", "/ekiˈpaxe/", "إكيباتشي", "الأمتعة", "الشنط", "sustantivo masculino colectivo",
       "Mi equipaje es esta maleta.", "أمتعتي هي هذه الحقيبة.", "شنطي هي الشنطة دي.",
       "equipaje de mano = الأمتعة اليدوية.", "«equipajes» نادر في الكلام اليومي.", 7),
 entry("facturar", "verb", None, "/faktuˈɾaɾ/", "فاكتورار", "يسجّل الأمتعة / يصدر فاتورة", "يودّع الشنطة", "verbo regular -ar",
       "Quiero facturar esta maleta.", "أريد تسجيل هذه الحقيبة.", "عايز أودّع الشنطة دي.",
       "في المطار: facturar el equipaje. وفي المحلات: facturar = يصدر فاتورة.", "«facturo la maleta» صحيحة، لكن بلا «a» قبله.", 8),
 entry("asiento", "noun", "m", "/aˈsjento/", "أسيينتو", "مقعد", "كرسي/مقعد", "sustantivo masculino",
       "¿Puedo cambiar de asiento?", "هل أستطيع تغيير مقعدي؟", "ممكن أغير كرسيي؟",
       "asiento de ventanilla = مقعد النافذة، de pasillo = الممر.", "لا تخلط asiento (مقعد) بـacento (نبر).", 9),
 entry("aduanas", "noun", "f", "/aˈðwanas/", "أذواناس", "الجمارك", "الجمارك", "sustantivo femenino plural",
       "Tiene que pasar por aduanas.", "عليك المرور بالجمارك.", "لازم تعدّي من الجمارك.",
       "تأتي جمعًا عادة: las aduanas.", "«la aduana» تستخدم مفردة في سياقات رسمية، والشائع الجمع.", 10),
 entry("reserva", "noun", "f", "/reˈseɾβa/", "ريسيرفا", "حجز", "حجز", "sustantivo femenino",
       "Tengo una reserva a nombre de Omar.", "عندي حجز باسم عمر.", "عندي حجز باسم عمر.",
       "reservar = يحجز؛ a nombre de = باسم.", "«reservación» أمريكية لاتينية؛ في إسبانيا reserva.", 11),
 entry("habitación doble", "phrase", "f", "/aβitaˈθjon ˈdoβle/", "أبيتاثيون دوبلي", "غرفة مزدوجة", "أوضة دوبل", "expresión nominal femenina",
       "Quiero una habitación doble.", "أريد غرفة مزدوجة.", "عايز أوضة دوبل.",
       "habitación individual = فردية، doble = مزدوجة بسرير كبير أو سريرين.", "«habitación doble para una persona» مقبولة لكن تُدفع كاملة.", 12),
 entry("cama", "noun", "f", "/ˈkama/", "كامَ", "سرير", "سرير", "sustantivo femenino",
       "La cama es muy cómoda.", "السرير مريح جدًا.", "السرير مريح جدًا.",
       "cama de matrimonio = سرير مزدوج كبير.", "«el cama» خطأ؛ مؤنث.", 13),
 entry("desayuno", "noun", "m", "/desaˈʝuno/", "ديسايونو", "فطور", "فطار", "sustantivo masculino",
       "El desayuno es a las ocho.", "الفطور الساعة الثامنة.", "الفطار الساعة تمانية.",
       "desayuno incluido = فطور مشمول.", "desayunar فعل، desayuno اسم.", 14),
 entry("factura", "noun", "f", "/fakˈtuɾa/", "فاكتورا", "فاتورة", "فاتورة", "sustantivo femenino",
       "¿Me puede dar la factura?", "هل يمكنك إعطائي الفاتورة؟", "ممكن تديني الفاتورة؟",
       "في الفندق: factura = فاتورة الإقامة.", "«factura» ليست «facturar»؛ الأولى اسم والثانية فعل.", 15),
 entry("llegada", "noun", "f", "/ʎeˈɣaða/", "ييغاذا", "الوصول", "الوصول", "sustantivo femenino",
       "La llegada está prevista a las diez.", "الوصول المتوقع الساعة العاشرة.", "الوصول المتوقع الساعة عشرة.",
       "salida = المغادرة، llegada = الوصول.", "لا تخلط llegada (وصول) بـllegar (يصل) فالأولى اسم.", 16),
 entry("salida", "noun", "f", "/saˈliða/", "ساليذا", "المغادرة / مخرج", "الخروج", "sustantivo femenino",
       "¿A qué hora es la salida?", "في أي ساعة المغادرة؟", "المغادرة الساعة كام؟",
       "salida de emergencia = مخرج الطوارئ.", "«salida» اسم؛ «salir» فعل.", 17),
 entry("pasajero", "noun", "m", "/pasaˈxeɾo/", "باساتشيرو", "مسافر", "مسافر", "sustantivo masculino",
       "Los pasajeros deben esperar aquí.", "على المسافرين الانتظار هنا.", "المسافرين لازم يستنوا هنا.",
       "pasajera للمؤنث.", "«pasajero» ليست صفة للمرور السريع.", 18),
 entry("tarjeta de crédito", "phrase", "f", "/taɾˈxeta de ˈkɾeðito/", "تارخيتا دي كريذيتو", "بطاقة ائتمان", "فيزا", "expresión nominal femenina",
       "¿Puedo pagar con tarjeta de crédito?", "هل أستطيع الدفع ببطاقة الائتمان؟", "ممكن أدفع بالفيزا؟",
       "pagar con tarjeta = دفع بالبطاقة؛ en efectivo = نقدًا.", "«pagar por tarjeta» أقل شيوعًا؛ الأفضل con tarjeta.", 19),
 entry("efectivo", "noun", "m", "/efeɡˈtiβo/", "إفيختيبو", "نقود سائلة", "كاش", "sustantivo masculino",
       "Lo siento, no aceptamos efectivo.", "آسف، لا نقبل النقد.", "معلش، مش بنقبل كاش.",
       "en efectivo = نقدًا.", "«efectivo» ليست «فعال» بل نقد.", 20),
]

PACK = {
  "schemaVersion": "1.0.0", "bundleSlug": "tr-shared",
  "pronunciationNoteAr": "النقل بالحروف العربية تقريب فقط. في إسبانيا تُنطق z وce قريبة من «ث»، وفي أمريكا اللاتينية «س» — الملفات الصوتية لم تُنتج بعد.",
  "source": {"title": "مفردات السفر (المطار والفندق) — إعداد داخلي لمراجعة بشرية قبل النشر", "url": "",
             "license": "internal-draft", "accessedAt": "2026-10-21",
             "rankingNote": "internalRank داخلي لسَلسَلة التدريس، وليس ادعاءً بأن الكلمات الأكثر شيوعًا."},
  "entries": TR_ENTRIES,
}

# ---------------------------------------------------------------- الدروس
L = []

L.append(lesson(
  "tr-u1-checkin", "تسجيل الوصول في المطار", "tr-u1-airport",
  "أن يسجّل المتعلم وصوله في مكتب شركة الطيران، ويعطي جواز سفره وحقيبته، ويفهم سؤال المقعد والبوابة بأجوبة قصيرة صحيحة.",
  12, ["vuelo", "billete", "equipaje", "facturar", "asiento"], ["pasaporte", "por favor"],
  ["Quiero facturar el equipaje.", "¿Dónde está la puerta de embarque?", "Un asiento de ventanilla, por favor."],
  ["facturar-equipaje", "preguntas-de-aeropuerto"],
  scen("أنت في مطار مدريد لتسجيل الوصول لرحلة إلى القاهرة.", "مكتب تسجيل الوصول، قبل الإقلاع بساعتين", [
    ("Buenos días, ¿su pasaporte y su billete, por favor?", "صباح الخير، جواز سفرك وتذكرتك من فضلك.", "صباح الخير، الباسبور والتذكرة لو سمحت.", "tr-u1-l1-agente-1"),
    ("Buenos días. Aquí tiene. Quiero facturar esta maleta.", "صباح الخير. تفضل. أريد تسجيل هذه الحقيبة.", "صباح الخير. اتفضل. عايز أودّع الشنطة دي.", "tr-u1-l1-omar-1"),
    ("Muy bien. ¿Prefiere asiento de ventanilla o de pasillo?", "جيد. هل تفضّل مقعد النافذة أم الممر؟", "تمام. تفضل كرسي الشباك ولا الممر؟", "tr-u1-l1-agente-2"),
    ("De ventanilla, por favor. ¿A qué hora es el embarque?", "النافذة من فضلك. في أي ساعة الصعود؟", "الشباك لو سمحت. الصعود الساعة كام؟", "tr-u1-l1-omar-2"),
  ]),
  [
    ex("tr_u1_1_reply", "choose_reply",
       "الموظف سألك عن جواز سفرك. اختر الردّ المناسب.",
       ["speaking", "reading"], 1,
       contextAr="الموظف يقول: «¿Su pasaporte, por favor?»",
       stemEs="— ¿Su pasaporte, por favor?", stemAr="— جواز سفرك، من فضلك؟",
       options=[opt("tr_u1_1_a", "Aquí tiene.", "تفضل / ها هو.", True),
                opt("tr_u1_1_b", "De nada.", "عفوا (ردًّا على الشكر)", False, "«De nada» ردّ على «gracias» لا تسليم وثيقة."),
                opt("tr_u1_1_c", "No entiendo nada.", "لا أفهم شيئًا.", False, "ردّ يوقف الموقف بلا داعٍ؛ المطلوب تسليم الوثيقة.")],
       answerKey={"correctOptionIds": ["tr_u1_1_a"]},
       explanationAr="عند تسليم شيء نقول «Aquí tiene» (تفضل)، وتُقال أيضًا «Aquí está» عند الإشارة إلى الشيء.",
       errorFeedback={"tr_u1_1_b": "«De nada» تعني «عفوا» ردًّا على الشكر.", "tr_u1_1_c": "الطلب واضح؛ سلّم الجواز وقل Aquí tiene."},
       targetVocab=["pasaporte"]),

    ex("tr_u1_2_fill", "fill_blank", "أكمل الفراغ بالفعل المناسب لتسجيل الأمتعة.",
       ["grammar", "writing"], 2,
       stemEs="Quiero ____ esta maleta.", stemAr="أريد تسجيل هذه الحقيبة.",
       answerKey={"accepted": ["facturar"], "caseSensitive": False},
       explanationAr="بعد «querer» يأتي المصدر مباشرة: quiero facturar. facturar تعني هنا تسجيل الأمتعة في المطار.",
       errorFeedback={"facturo": "بعد querer لا نُصرّف الفعل الثاني؛ نقول facturar.",
                      "factura": "«factura» اسم (فاتورة)؛ الفعل facturar."},
       targetVocab=["facturar", "equipaje"]),

    ex("tr_u1_3_window", "word_choice", "تريد مقعد النافذة. أي عبارة تستخدم؟",
       ["reading", "vocabulary"], 2,
       options=[opt("tr_u1_3_a", "Un asiento de ventanilla, por favor.", "مقعد النافذة، من فضلك.", True),
                opt("tr_u1_3_b", "Un asiento de pasillo, por favor.", "مقعد الممر، من فضلك.", False, "pasillo = الممر، وليس النافذة."),
                opt("tr_u1_3_c", "Una silla de ventana, por favor.", "كرسي النافذة، من فضلك.", False, "«silla» للكرسي المنزلي؛ مقعد الطائرة asiento.")],
       answerKey={"correctOptionIds": ["tr_u1_3_a"]},
       explanationAr="asiento = مقعد، ventanilla = النافذة الصغيرة (في الطائرة والقطار والمكتب)، pasillo = الممر.",
       errorFeedback={"tr_u1_3_b": "pasillo ممر لا نافذة.", "tr_u1_3_c": "في الطائرة نقول asiento لا silla."},
       targetVocab=["asiento"]),

    ex("tr_u1_4_order", "word_order", "رتّب الكلمات لسؤال مهذّب عن بوابة الصعود.",
       ["grammar", "writing"], 2,
       items=[{"id": "tr_u1_t1", "kind": "token", "text": "¿Dónde"},
              {"id": "tr_u1_t2", "kind": "token", "text": "está"},
              {"id": "tr_u1_t3", "kind": "token", "text": "la"},
              {"id": "tr_u1_t4", "kind": "token", "text": "puerta"},
              {"id": "tr_u1_t5", "kind": "token", "text": "de"},
              {"id": "tr_u1_t6", "kind": "token", "text": "embarque"}],
       answerKey={"accepted": ["¿Dónde está la puerta de embarque?", "¿Dónde está la puerta de embarque"], "caseSensitive": False, "ignorePunctuation": True},
       explanationAr="السؤال عن المكان: ¿Dónde está…? + الاسم. و«puerta de embarque» تعني بوابة الصعود، وde تربط الاسمين.",
       errorFeedback={"order": "الترتيب: ¿Dónde está la puerta de embarque?"},
       targetVocab=["puerta", "embarque"]),

    ex("tr_u1_5_translate", "translate_short", "ترجم إلى الإسبانية.",
       ["writing", "grammar"], 3, stemAr="رحلتي تتأخر ساعتين.", stemEs="",
       answerKey={"accepted": ["Mi vuelo llega con dos horas de retraso.", "Mi vuelo tiene dos horas de retraso.", "Mi vuelo se retrasa dos horas.", "Mi vuelo está retrasado dos horas."], "caseSensitive": False, "ignorePunctuation": True},
       explanationAr="التأخير يُعبَّر عنه بعدة صيغ شائعة: con dos horas de retraso / tener retraso / estar retrasado. كلها صحيحة في المطار.",
       errorFeedback={"Mi vuelo retrasa dos horas.": "ناقص التعبير: se retrasa أو tiene retraso.",
                      "Mi vuelo es retraso.": "«es retraso» غير صحيحة؛ الصواب tiene retraso."},
       targetVocab=["vuelo", "retraso"]),

    ex("tr_u1_6_speak", "speak_with_text",
       "سجّل وصولك بصوت واضح. تمرين مشاركة لا يُصحَّح آليًا (لا يوجد تقييم نطق).",
       ["speaking"], 2,
       stemEs="Buenos días. Aquí tiene mi pasaporte. Quiero facturar el equipaje.",
       stemAr="صباح الخير. تفضل جواز سفري. أريد تسجيل الأمتعة.",
       answerKey={"referenceAudioKey": "pending/tr-u1-6-model-1",
                  "modelAnswer": "Buenos días. Aquí tiene mi pasaporte. Quiero facturar el equipaje."},
       explanationAr="قِس نفسك على الوضوح واللباقة: تحية، تسليم، طلب. لا ندّعي قياس نطق آلي؛ الملف الصوتي المرجعي غير متوفر بعد.",
       scoring={"mode": "rubric", "rubric": [{"labelAr": "وضوح الطلب", "weight": 50, "code": "clarity"},
                                            {"labelAr": "لباقة الصيغة", "weight": 50, "code": "politeness"}]},
       targetVocab=["pasaporte", "facturar"]),
  ],
  "درس المطار 1/4. يحتاج مراجعة إسبانية أصلية لصيغة «¿Su pasaporte, por favor?» في مطارات إسبانيا، وتأكيد أن A2 مناسب للصياغات."))

L.append(lesson(
  "tr-u1-boarding-delay", "الأمن والصعود والتأخير", "tr-u1-airport",
  "أن يفهم المتعلم إعلان صعود أو تأخير، ويطلب توضيحًا عند عدم الفهم، ويعتذر بلباقة عند المرور في طابور.",
  12, ["retraso", "salida", "pasajero"], ["embarque", "vuelo", "puerta"],
  ["¿Puede repetirlo más despacio, por favor?", "El vuelo sale con retraso.", "¿Es esta la puerta 12?"],
  ["pedir-aclaracion", "anuncios-de-vuelo"],
  scen("تسمع إعلانًا في المطار وتحتاج أن تتأكد من بوابتك.", "صالة المغادرة، إعلان مكتوب على الشاشة", [
    ("Atención, pasajeros del vuelo 345: el embarque se retrasa treinta minutos.", "انتباه، مسافرو الرحلة 345: يتأخر الصعود ثلاثين دقيقة.", "انتباه، مسافري رحلة 345: الصعود اتأخر تلاتين دقيقة.", "tr-u1-l2-anuncio-1"),
    ("Perdone, ¿ha dicho treinta minutos de retraso?", "عفوًا، هل قلت تأخير ثلاثين دقيقة؟", "لو سمحت، قلت تأخير تلاتين دقيقة؟", "tr-u1-l2-omar-1"),
    ("Sí, exacto. La salida es a las nueve y media.", "نعم، بالضبط. المغادرة الساعة التاسعة والنصف.", "أيوة بالظبط. المغادرة الساعة تسعة ونص.", "tr-u1-l2-agente-1"),
  ]),
  [
    ex("tr_u1_7_notice", "listen_choose", "استمع (أو اقرأ النص البديل) واختر مدة التأخير المذكورة.",
       ["listening", "reading"], 2,
       audioKey="pending/tr-u1-7-notice-1",
       speechEs="El embarque se retrasa treinta minutos.",
       options=[opt("tr_u1_7_a", "Treinta minutos.", "ثلاثون دقيقة.", True),
                opt("tr_u1_7_b", "Tres horas.", "ثلاث ساعات.", False, "«treinta» = ثلاثون، و«tres» = ثلاثة؛ التشابه في البداية فقط."),
                opt("tr_u1_7_c", "Trece minutos.", "ثلاث عشرة دقيقة.", False, "«trece» = ثلاثة عشر، مختلفة عن treinta.")],
       answerKey={"correctOptionIds": ["tr_u1_7_a"]},
       explanationAr="treinta = 30، trece = 13، tres = 3. في إعلانات المطارات الأرقام تُنطق بسرعة، والتمييز بينها مهارة سمعية تحتاج تدريبًا.",
       errorFeedback={"tr_u1_7_b": "tres = 3، والمسموع treinta = 30.", "tr_u1_7_c": "trece = 13، والمسموع treinta = 30."},
       targetVocab=["retraso"]),

    ex("tr_u1_8_clarify", "choose_reply", "لم تفهم الإعلان. اختر الطلب الأنسب.",
       ["speaking", "reading"], 2,
       contextAr="الإعلان كان سريعًا ولم تفهم الرقم.",
       stemEs="— El embarque se retrasa… (no lo has entendido)",
       stemAr="— يتأخر الصعود… (لم تفهم)", options=[
         opt("tr_u1_8_a", "Perdone, ¿puede repetirlo más despacio, por favor?", "عفوًا، هل يمكنك تكراره أبطأ من فضلك؟", True),
         opt("tr_u1_8_b", "Repite.", "أعِد.", False, "أمر مباشر بلا لباقة في سياق رسمي."),
         opt("tr_u1_8_c", "No hablo español, adiós.", "لا أتحدث الإسبانية، وداعًا.", False, "انسحاب مبكر رغم وجود صيغة مهذبة للطلب.")],
       answerKey={"correctOptionIds": ["tr_u1_8_a"]},
       explanationAr="طلب التوضيح المهذب: Perdone + ¿puede repetirlo más despacio, por favor? بديل: ¿Puede hablarme más despacio?",
       errorFeedback={"tr_u1_8_b": "«Repite» صيغة أمر غير رسمية وقاسية؛ استخدم «¿Puede repetirlo?».",
                      "tr_u1_8_c": "لا تنسحب من الموقف؛ اطلب التكرار ببطء."},
       targetVocab=["retraso"]),

    ex("tr_u1_9_fill", "fill_blank", "أكمل بالسؤال المناسب للتأكد من القاعة.",
       ["grammar", "writing"], 2,
       stemEs="Perdone, ¿es esta la ____ 12?", stemAr="عفوًا، هل هذه البوابة 12؟",
       answerKey={"accepted": ["puerta"], "caseSensitive": False},
       explanationAr="puerta de embarque = بوابة الصعود، ويجوز اختصارها إلى puerta في المطار.",
       errorFeedback={"portal": "«portal» مدخل مبنى سكني، لا بوابة مطار.", "salida": "salida = مخرج/مغادرة، لا بوابة الصعود."},
       targetVocab=["puerta"]),

    ex("tr_u1_10_fix", "find_fix_error", "أي جملة صحيحة عند الاعتذار للمرور في طابور؟",
       ["reading", "speaking"], 2,
       stemEs="Disculpe, puedo pasar por favor, ¿no?",
       options=[opt("tr_u1_10_a", "Disculpe, ¿puedo pasar, por favor?", "عفوًا، هل يمكنني المرور من فضلك؟", True),
                opt("tr_u1_10_b", "Disculpe, puedo pasar por favor, ¿no?", None, False, "ذيل «¿no?» ونقص علامة الاستفهام يجعلان الجملة غير مرتبة."),
                opt("tr_u1_10_c", "Paso.", "أمرر.", False, "«Paso» تصريح لا طلب؛ الأفضل «¿puedo pasar?».")],
       answerKey={"correctOptionIds": ["tr_u1_10_a"]},
       explanationAr="طلب مهذب: Disculpe + ¿puedo + مصدر + por favor?. علامتا الاستفهام ¿…? تحصران السؤال.",
       errorFeedback={"tr_u1_10_b": "احذف «¿no?» وضع علامتي الاستفهام.", "tr_u1_10_c": "اطلب الإذن بصيغة سؤال."},
       targetVocab=["pasajero"]),
  ],
  "درس المطار 2/4. يحتاج مراجعة إسبانية أصلية لصياغة الإعلان «se retrasa treinta minutos» في مطار إسباني، وتحديد سرعة مناسبة للملف الصوتي لاحقًا."))

L.append(lesson(
  "tr-u1-problem-luggage", "مشكلة أمتعة أو تذكرة", "tr-u1-airport",
  "أن يشرح المتعلم مشكلة (حقيبة مفقودة أو خطأ في الاسم) بلباقة، ويطلب حلًّا بديلًا، ويفهم مواعيد المتابعة.",
  13, ["equipaje", "factura"], ["equipaje", "asiento", "retraso"],
  ["No encuentro mi equipaje.", "Hay un error en mi billete.", "¿Cuándo llega?"],
  ["reclamaciones", "preguntar-plazos"],
  scen("حقيبتك لم تصل مع الرحلة.", "مكتب المفقودات في صالة الوصول", [
    ("Buenas tardes, ¿en qué puedo ayudarle?", "مساء الخير، كيف أساعدك؟", "مساء الخير، أساعدك في إيه؟", "tr-u1-l3-agente-1"),
    ("No encuentro mi equipaje. Mi vuelo era el 345.", "لا أجد أمتعتي. رحلتي كانت 345.", "مش لاقي شنطي. رحلتي كانت 345.", "tr-u1-l3-omar-1"),
    ("Lo siento. ¿Puede describir la maleta, por favor?", "آسف. هل يمكنك وصف الحقيبة من فضلك؟", "معلش. ممكن توصف الشنطة لو سمحت؟", "tr-u1-l3-agente-2"),
  ]),
  [
    ex("tr_u1_11_report", "choose_reply", "اختر صيغة الشكوى المهذبة الأولى.",
       ["speaking", "reading"], 2,
       contextAr="أنت في مكتب المفقودات وتريد الإبلاغ عن حقيبة لم تصل.",
       stemEs="— Buenos días, ¿en qué puedo ayudarle?", stemAr="— صباح الخير، كيف أساعدك؟",
       options=[opt("tr_u1_11_a", "Perdone, no encuentro mi equipaje.", "عفوًا، لا أجد أمتعتي.", True),
                opt("tr_u1_11_b", "¡Vosotros habéis perdido mi maleta!", "أنتم ضيّعتم حقيبتي!", False, "اتهام مباشر وبنبرة عدوانية، وقد يكون السبب خارج سيطرة الموظف."),
                opt("tr_u1_11_c", "Quiero una factura.", "أريد فاتورة.", False, "طلب غير متعلق بالمشكلة في هذه اللحظة.")],
       answerKey={"correctOptionIds": ["tr_u1_11_a"]},
       explanationAr="البداية الهادئة تُنجح الشكوى: وصف الحقيقة («no encuentro») بلا اتهام. ثم يُطلب الوصف ورقم تقرير الشكوى.",
       errorFeedback={"tr_u1_11_b": "الاتهام يوقف التعاون؛ ابدأ بوصف المشكلة.",
                      "tr_u1_11_c": "الفاتورة ليست مطلبك هنا."},
       targetVocab=["equipaje"]),

    ex("tr_u1_12_describe", "word_choice", "أي وصف للحقيبة دقيق ومفهوم؟",
       ["reading", "vocabulary"], 2,
       options=[opt("tr_u1_12_a", "Es negra y grande, con una etiqueta roja.", "إنها سوداء وكبيرة، عليها بطاقة حمراء.", True),
                opt("tr_u1_12_b", "Es la maleta normal.", "إنها الحقيبة العادية.", False, "وصف غامض لا يساعد الموظف."),
                opt("tr_u1_12_c", "Es muy bonita.", "إنها جميلة جدًا.", False, "جمالها لا يميّزها عن غيرها.")],
       answerKey={"correctOptionIds": ["tr_u1_12_a"]},
       explanationAr="الوصف المفيد يجمع: اللون + الحجم + علامة مميِّزة. «etiqueta» = بطاقة، «roja» = حمراء (مؤنث).",
       errorFeedback={"tr_u1_12_b": "«normal» لا يميّز شيئًا.", "tr_u1_12_c": "الجمال ليس علامة تعريف."},
       targetVocab=["equipaje"]),

    ex("tr_u1_13_fill", "fill_blank", "أكمل السؤال عن موعد وصول الحقيبة.",
       ["grammar", "writing"], 2,
       stemEs="¿Cuándo ____ mi maleta?", stemAr="متى تصل حقيبتي؟",
       answerKey={"accepted": ["llega"], "caseSensitive": False},
       explanationAr="«cuándo» للسؤال عن الزمن، والفعل llegar مع المفرد الغائب: llega.",
       errorFeedback={"llego": "«llego» للمتحدث؛ الحقيبة مفرد غائب ⇒ llega.", "llegar": "المصدر لا يصلح سؤالًا بلا فعل مصرَّف."},
       targetVocab=["llegada"]),

    ex("tr_u1_14_translate", "translate_short", "ترجم إلى الإسبانية.",
       ["writing", "grammar"], 3, stemAr="هل يمكنك أن تعطيني رقم التقرير؟", stemEs="",
       answerKey={"accepted": ["¿Puede darme el número del informe?", "¿Me puede dar el número del informe?", "¿Puede darme el número de informe?"], "caseSensitive": False, "ignorePunctuation": True},
       explanationAr="لباقة الطلب: ¿Puede + مصدر + مفعول؟ «informe» تقرير، و«número del informe» رقمه.",
       errorFeedback={"Dame el número.": "أمر مباشر؛ استخدم ¿Puede darme…?",
                      "¿Puedo darme el número?": "الفاعل غير صحيح؛ نطلب من الموظف: ¿Puede darme…?"},
       targetVocab=["factura"]),
  ],
  "درس المطار 3/4. يحتاج مراجعة إسبانية أصلية لمصطلح «informe» في تقارير المفقودات (PIR)، وتأكيد المفردات البديلة."))

L.append(lesson(
  "tr-u1-arrival-customs", "الوصول والجمارك", "tr-u1-airport",
  "أن يجيب المتعلم عن أسئلة الجمارك القصيرة (الغرض من الزيارة، مدة الإقامة، ما في الحقيبة) بأجوبة صحيحة موجزة.",
  12, ["aduanas", "llegada"], ["pasaporte", "equipaje", "vuelo"],
  ["Vengo de vacaciones.", "Voy a quedarme dos semanas.", "No tengo nada que declarar."],
  ["preguntas-de-aduana", "futuro-proximo"],
  scen("تصل إلى إسبانيا ويطرح موظف الجمارك أسئلة قصيرة.", "ممر الجمارك في المطار", [
    ("¿Cuál es el motivo de su visita?", "ما سبب زيارتك؟", "سبب زيارتك إيه؟", "tr-u1-l4-aduana-1"),
    ("Vengo de vacaciones. Voy a quedarme dos semanas.", "أنا في عطلة. سأبقى أسبوعين.", "أنا في أجازة. هأقعد أسبوعين.", "tr-u1-l4-omar-1"),
    ("¿Lleva algo que declarar?", "هل تحمل شيئًا يجب الإفصاح عنه؟", "معاك حاجة محتاجة تصريح؟", "tr-u1-l4-aduana-2"),
    ("No, nada que declarar.", "لا، لا شيء للإفصاح عنه.", "لأ، مفيش حاجة.", "tr-u1-l4-omar-2"),
  ]),
  [
    ex("tr_u1_15_motive", "word_choice", "اختر الجواب الصحيح عن سبب الزيارة (عطلة).",
       ["reading", "speaking"], 2, options=[
         opt("tr_u1_15_a", "Vengo de vacaciones.", "أنا في عطلة.", True),
         opt("tr_u1_15_b", "Vengo de Egipto.", "أنا قادم من مصر.", False, "جواب صحيح عن السؤال «¿De dónde viene?» لا «¿Cuál es el motivo?»."),
         opt("tr_u1_15_c", "Voy a Egipto.", "أنا ذاهب إلى مصر.", False, "اتجاه لا سبب؛ والوقت زمن المستقبل.")],
       answerKey={"correctOptionIds": ["tr_u1_15_a"]},
       explanationAr="motivo = السبب، والسياحة تكون «de vacaciones». لاحظ الفرق بين de (من/بسبب) وa (إلى).",
       errorFeedback={"tr_u1_15_b": "هذا جواب سؤال المنشأ.", "tr_u1_15_c": "هذا جواب سؤال الوجهة المستقبلية."},
       targetVocab=["llegada"]),

    ex("tr_u1_16_declare", "fill_blank", "أكمل الجواب: لا شيء للإفصاح عنه.",
       ["writing", "vocabulary"], 2,
       stemEs="No, nada que ____.", stemAr="لا، لا شيء للإفصاح عنه.",
       answerKey={"accepted": ["declarar"], "caseSensitive": False},
       explanationAr="«nada que declarar» تركيب ثابت في الجمارك، ويأتي الفعل في المصدر بعد «nada que».",
       errorFeedback={"declaro": "بعد «nada que» يأتي المصدر declarar.", "declaración": "«declaración» اسم، والتركيب الثابت يستخدم المصدر."},
       targetVocab=["aduanas"]),

    ex("tr_u1_17_duration", "word_choice", "كيف تقول إنك ستبقى أسبوعين؟",
       ["grammar", "reading"], 3, options=[
         opt("tr_u1_17_a", "Voy a quedarme dos semanas.", "سأبقى أسبوعين.", True),
         opt("tr_u1_17_b", "Voy a quedar dos semanas.", "سأتفق على أسبوعين.", False, "«quedar» ≠ «quedarse»؛ الثانية وحدها تعني «يبقى»."),
         opt("tr_u1_17_c", "Soy dos semanas aquí.", "أنا أسبوعان هنا.", False, "تركيب غير صحيح؛ المدة تُعبَّر بـquedarse أو estar + مدة.")],
       answerKey={"correctOptionIds": ["tr_u1_17_a"]},
       explanationAr="quedarse = يبقى (فعل انعكاسي). المستقبل القريب: ir a + مصدر ⇒ voy a quedarme.",
       errorFeedback={"tr_u1_17_b": "«quedar» بدون الضمير تعني يتفق/يقع موعدًا.", "tr_u1_17_c": "استخدم quedarse أو estar aquí durante dos semanas."},
       targetVocab=["llegada"]),

    ex("tr_u1_18_listen", "listen_choose", "استمع (أو اقرأ النص البديل) واختر السؤال الذي سُمع.",
       ["listening", "reading"], 2, audioKey="pending/tr-u1-l4-aduana-2",
       speechEs="¿Lleva algo que declarar?",
       options=[opt("tr_u1_18_a", "¿Lleva algo que declarar?", "هل تحمل شيئًا للإفصاح عنه؟", True),
                opt("tr_u1_18_b", "¿Cuánto cuesta el billete?", "كم سعر التذكرة؟", False, "سؤال سعر لا جمارك."),
                opt("tr_u1_18_c", "¿Dónde está la maleta?", "أين الحقيبة؟", False, "سؤال مكان؛ والمسموع عن الإفصاح.")],
       answerKey={"correctOptionIds": ["tr_u1_18_a"]},
       explanationAr="الفعل llevar = يحمل، algo = شيئًا، que declarar = للإفصاح عنه. جملة قصيرة تُنطق سريعًا في الجمارك.",
       errorFeedback={"tr_u1_18_b": "المسموع فيه «declarar» لا «cuesta».", "tr_u1_18_c": "المسموع لا يسأل عن المكان."},
       targetVocab=["aduanas"]),

    ex("tr_u1_19_speak_free", "speak_free",
       "تحدّث 30 ثانية عن رحلتك القادمة: إلى أين، ولماذا، وكم يومًا. تمرين غير مُقيَّم آليًا وليس له درجة.",
       ["speaking"], 2,
       contextAr="موضوع حر لتدريب الطلاقة. لا يوجد تصحيح آلي ولا ادعاء بتقييم النطق.",
       answerKey={"modelAnswer": "Voy a viajar a España la próxima semana. Voy de vacaciones y voy a quedarme diez días. Quiero visitar Madrid y Granada."},
       explanationAr="استخدم: voy a + مصدر للمستقبل القريب، وpara + مصدر للهدف، وdurante أو المدة مباشرة. سجّل نفسك واسمعها مرة ثانية؛ لا تقييم آلي.",
       scoring={"mode": "rubric", "rubric": [
         {"labelAr": "أداء المهمة (ذكرت الوجهة والهدف والمدة)", "weight": 60, "code": "task"},
         {"labelAr": "استخدام voy a + مصدر", "weight": 40, "code": "structure"}]},
       targetVocab=["vuelo", "llegada"]),
  ],
  "درس المطار 4/4. يحتاج مراجعة إسبانية أصلية لأسئلة الجمارك الفعلية وتأكيد أن تمارين المحادثة الحرة معلَّمة كغير مُقيَّمة."))

# ---------------------------------------------------------------- الوحدة 2: الفندق
L.append(lesson(
  "tr-u2-booking", "حجز غرفة", "tr-u2-hotel",
  "أن يحجز المتعلم غرفة عبر الهاتف أو الإنترنت: يحدد التواريخ وعدد الليالي ونوع الغرفة، ويسأل عن السعر والإفطار.",
  12, ["reserva", "habitación doble", "cama"], ["noche", "precio", "desayuno"],
  ["Quiero reservar una habitación doble.", "¿Está incluido el desayuno?", "¿Cuánto cuesta la noche?"],
  ["reservar", "precios-y-fechas"],
  scen("تحجز غرفة بالفندق هاتفيًا لرحلتك القادمة.", "مكالمة مع مكتب الحجز", [
    ("Hotel Sol, buenos días. ¿En qué puedo ayudarle?", "فندق سول، صباح الخير. كيف أساعدك؟", "فندق سول، صباح الخير. أساعدك في إيه؟", "tr-u2-l1-hotel-1"),
    ("Quiero reservar una habitación doble para tres noches.", "أريد حجز غرفة مزدوجة لثلاث ليالٍ.", "عايز أحجز أوضة دوبل تلات ليالي.", "tr-u2-l1-omar-1"),
    ("¿Está incluido el desayuno?", "هل الفطور مشمول؟", "الفطار مشمول؟", "tr-u2-l1-omar-2"),
  ]),
  [
    ex("tr_u2_1_book", "fill_blank", "أكمل بفعل الحجز المناسب.",
       ["grammar", "writing"], 1,
       stemEs="Quiero ____ una habitación doble.", stemAr="أريد حجز غرفة مزدوجة.",
       answerKey={"accepted": ["reservar"], "caseSensitive": False},
       explanationAr="بعد querer يأتي المصدر: reservar. الاسم منها reserva.",
       errorFeedback={"reservo": "بعد querer: reservar لا reservo.", "reserva": "«reserva» اسم؛ الفعل reservar."},
       targetVocab=["reserva", "habitación doble"]),

    ex("tr_u2_2_nights", "word_choice", "كيف تسأل عن سعر الليلة؟",
       ["reading", "vocabulary"], 2, options=[
         opt("tr_u2_2_a", "¿Cuánto cuesta la noche?", "كم سعر الليلة؟", True),
         opt("tr_u2_2_b", "¿Cuántas noches cuesta?", "كم ليلة تُكلّف؟", False, "«cuántas» للسؤال عن العدد لا السعر."),
         opt("tr_u2_2_c", "¿Qué noche es?", "أي ليلة؟", False, "سؤال عن تحديد الليلة لا عن السعر.")],
       answerKey={"correctOptionIds": ["tr_u2_2_a"]},
       explanationAr="للسؤال عن السعر: ¿Cuánto cuesta…? ومع «la noche» يبقى الفعل مفردًا: cuesta.",
       errorFeedback={"tr_u2_2_b": "«cuánto» للسعر و«cuántas» للعدد.", "tr_u2_2_c": "«¿Qué noche?» تسأل عن التعيين لا الثمن."},
       targetVocab=["reserva"]),

    ex("tr_u2_3_breakfast", "choose_reply", "اسأل عمّا إذا كان الفطور مشمولًا.",
       ["speaking", "reading"], 2,
       stemEs="— Son 90 euros por noche.", stemAr="— السعر 90 يورو في الليلة.",
       options=[opt("tr_u2_3_a", "¿Está incluido el desayuno?", "هل الفطور مشمول؟", True),
                opt("tr_u2_3_b", "¿Dónde está el desayuno?", "أين الفطور؟", False, "سؤال مكان لا شمول."),
                opt("tr_u2_3_c", "¿El desayuno es caro?", "هل الفطور غالٍ؟", False, "سؤال آخر، لكن الأهم أولًا معرفة الشمول من عدمه.")],
       answerKey={"correctOptionIds": ["tr_u2_3_a"]},
       explanationAr="«incluido» = مشمول. السؤال الثابت: ¿Está incluido el desayuno? / ¿El desayuno está incluido?",
       errorFeedback={"tr_u2_3_b": "هذا سؤال مكان الفطور.", "tr_u2_3_c": "قبل السعر اسأل: هل هو مشمول أصلًا؟"},
       targetVocab=["desayuno"]),

    ex("tr_u2_4_dates", "translate_short", "ترجم إلى الإسبانية.",
       ["writing", "grammar"], 3, stemAr="أريد الحجز من الثالث إلى السادس من مايو.", stemEs="",
       answerKey={"accepted": ["Quiero reservar del 3 al 6 de mayo.", "Quiero reservar del tres al seis de mayo.", "Quiero hacer una reserva del 3 al 6 de mayo."], "caseSensitive": False, "ignorePunctuation": True},
       explanationAr="نطاق التواريخ: «del … al …» = من … إلى … . في الإسبانية الشهر بعد اليوم بلا حرف جر إضافي: el 3 de mayo.",
       errorFeedback={"del 3 hasta el 6": "الأفصح في الحجوزات: del 3 al 6.",
                      "de 3 a 6 mayo": "ناقص أداة التعريف: del 3 al 6 de mayo."},
       targetVocab=["reserva"]),
  ],
  "درس الفندق 1/4. يحتاج مراجعة إسبانية أصلية لصيغ الحجز الهاتفي في إسبانيا (del … al … فعّالة)."))

L.append(lesson(
  "tr-u2-checkin", "تسجيل الدخول إلى الفندق", "tr-u2-hotel",
  "أن يقدّم المتعلم حجزه وجواز سفره عند الاستقبال، ويسأل عن الإفطار والمفتاح والواي فاي.",
  11, ["llave", "desayuno"], ["reserva", "pasaporte", "habitación doble"],
  ["Tengo una reserva a nombre de…", "¿A qué hora es el desayuno?", "¿Hay wifi?"],
  ["presentar-reserva", "preguntas-en-recepcion"],
  scen("تصل إلى الفندق مساءً وتقدّم حجزك.", "مكتب الاستقبال، الساعة الثامنة مساءً", [
    ("Buenas noches, ¿tiene una reserva?", "مساء الخير، هل لديك حجز؟", "مساء الخير، عندك حجز؟", "tr-u2-l2-recep-1"),
    ("Sí, a nombre de Omar Hassan, para tres noches.", "نعم، باسم عمر حسن، لثلاث ليالٍ.", "أيوة، باسم عمر حسن، تلات ليالي.", "tr-u2-l2-omar-1"),
    ("Perfecto. Aquí tiene su llave. El desayuno es de siete a diez.", "تمام. تفضل مفتاحك. الفطور من السابعة إلى العاشرة.", "تمام. اتفضل مفتاحك. الفطار من سبعة لعشرة.", "tr-u2-l2-recep-2"),
  ]),
  [
    ex("tr_u2_5_name", "fill_blank", "أكمل بتركيب الحجز باسمك.",
       ["writing", "grammar"], 2,
       stemEs="Tengo una reserva a ____ de Omar Hassan.", stemAr="عندي حجز باسم عمر حسن.",
       answerKey={"accepted": ["nombre"], "caseSensitive": False},
       explanationAr="«a nombre de» تركيب ثابت = باسم. لا نستخدم «con el nombre» في هذا السياق.",
       errorFeedback={"name": "لا تستخدم اسمًا إنجليزيًا؛ الصيغة الإسبانية: a nombre de.", "nombres": "المفرد nombre في التركيب الثابت."},
       targetVocab=["reserva"]),

    ex("tr_u2_6_time", "word_choice", "الفطور من السابعة إلى العاشرة. أي جملة هي الصيغة المعتادة في جداول الفندق؟",
       ["reading", "grammar"], 2, options=[
         opt("tr_u2_6_a", "El desayuno es de siete a diez.", "الفطور من السابعة إلى العاشرة.", True),
         opt("tr_u2_6_b", "El desayuno es desde siete hasta diez.", "الفطور من السابعة حتى العاشرة.", False, "«desde… hasta» مقبولة لكنها أقل شيوعًا في الجداول اليومية؛ «de… a…» هي الصيغة المعتادة."),
         opt("tr_u2_6_c", "El desayuno es en siete y diez.", "الفطور في السابعة وعشر دقائق.", False, "معناها وقت محدد 7:10 ولا تعبّر عن فترة.")],
       answerKey={"correctOptionIds": ["tr_u2_6_a"]},
       explanationAr="للجداول اليومية: «de + ساعة + a + ساعة». أما «en» فتفيد وقتًا محددًا لا فترة.",
       errorFeedback={"tr_u2_6_b": "صحيحة لكن أقل طبيعية في جداول الفندق.", "tr_u2_6_c": "هذا وقت 7:10 وليس فترة."},
       targetVocab=["desayuno"]),

    ex("tr_u2_7_wifi", "choose_reply", "اختر السؤال الأنسب عن الواي فاي.",
       ["speaking", "reading"], 2,
       stemEs="— Aquí tiene su llave.", stemAr="— تفضل مفتاحك.",
       options=[opt("tr_u2_7_a", "Gracias. ¿Hay wifi en la habitación?", "شكرًا. هل يوجد واي فاي في الغرفة؟", True),
                opt("tr_u2_7_b", "¿Dónde está la wifi?", "أين الواي فاي؟", False, "سؤال مكان العدة، لا توفّر الخدمة."),
                opt("tr_u2_7_c", "Quiero wifi.", "أريد واي فاي.", False, "صيغة طلب مباشرة بلا سؤال عن التوفّر.")],
       answerKey={"correctOptionIds": ["tr_u2_7_a"]},
       explanationAr="¿Hay…? = هل يوجد…؟ وهي أنسب صيغة للسؤال عن توفّر خدمة.",
       errorFeedback={"tr_u2_7_b": "اسأل أولًا: ¿Hay wifi?", "tr_u2_7_c": "أضف سؤالًا مهذبًا بدل الأمر."},
       targetVocab=["llave"]),

    ex("tr_u2_8_fix", "find_fix_error", "أي جملة صحيحة ومهذبة في طلب مفتاح بديل؟",
       ["reading", "speaking"], 2,
       stemEs="Quiero la llave otra vez, porque no funciona.",
       options=[opt("tr_u2_8_a", "Disculpe, mi llave no funciona. ¿Me da otra, por favor?", "عفوًا، مفتاحي لا يعمل. هل تعطيني آخر من فضلك؟", True),
                opt("tr_u2_8_b", "La llave no funciona. Dame otra ya.", None, False, "نبرة آمرة بلا لباقة («ya»)."),
                opt("tr_u2_8_c", "Mi llave es roto.", "مفتاحي مكسور.", False, "الصيغة صحيحة أخرى: está rota؛ «es roto» خطأ في الفعل والجنس.")],
       answerKey={"correctOptionIds": ["tr_u2_8_a"]},
       explanationAr="«no funciona» = لا يعمل (لجهاز/مفتاح). واللباقة: Disculpe + الطلب بصيغة سؤال + por favor.",
       errorFeedback={"tr_u2_8_b": "أضف «Disculpe» و«¿Me da…?» بلا «ya».",
                      "tr_u2_8_c": "الحالة تكون بـestar: está rota."},
       targetVocab=["llave"]),
  ],
  "درس الفندق 2/4. يحتاج مراجعة إسبانية أصلية لصيغ الاستقبال والصيغة «¿Me da otra?»."))

L.append(lesson(
  "tr-u2-room-problem", "مشكلة في الغرفة", "tr-u2-hotel",
  "أن يشرح المتعلم مشكلة في الغرفة (لا يعمل المكيف، ضجيج، ماء بارد) ويطلب حلًّا أو غرفة بديلة بلباقة.",
  12, ["habitación doble"], ["llave", "cama", "desayuno"],
  ["El aire acondicionado no funciona.", "Hay mucho ruido.", "¿Puedo cambiar de habitación?"],
  ["quejas-educadas", "problemas-en-hotel"],
  scen("المكيف في غرفتك لا يعمل والجو حار.", "غرفتك في الفندق، العاشرة مساءً", [
    ("Recepción, buenas noches. ¿En qué puedo ayudarle?", "الاستقبال، مساء الخير. كيف أساعدك؟", "الاستقبال، مساء الخير. أساعدك في إيه؟", "tr-u2-l3-recep-1"),
    ("Buenas noches. El aire acondicionado no funciona.", "مساء الخير. المكيف لا يعمل.", "مساء الخير. التكييف مش شغال.", "tr-u2-l3-omar-1"),
    ("Lo siento. ¿Puedo cambiar de habitación?", "آسف. هل أستطيع تغيير الغرفة؟", "معلش. ممكن أغير الأوضة؟", "tr-u2-l3-omar-2"),
  ]),
  [
    ex("tr_u2_9_notworking", "fill_blank", "أكمل: المكيف لا يعمل.",
       ["writing", "grammar"], 2,
       stemEs="El aire acondicionado no ____.", stemAr="المكيف لا يعمل.",
       answerKey={"accepted": ["funciona"], "caseSensitive": False},
       explanationAr="«funcionar» = يعمل (للأجهزة). لا نقول «no trabaja» للجهاز.",
       errorFeedback={"trabaja": "«trabajar» للبشر؛ الجهاز «funciona».", "funciono": "الفاعل الجهاز ⇒ funciona."},
       targetVocab=["habitación doble"]),

    ex("tr_u2_10_noise", "word_choice", "أنت تشكو الآن لموظف الاستقبال من ضجيج الممر. أي جملة أنسب للشكوى؟",
       ["reading", "vocabulary"], 2, options=[
         opt("tr_u2_10_a", "Hay mucho ruido en el pasillo.", "هناك ضجيج كثير في الممر.", True),
         opt("tr_u2_10_b", "Hay muchas ruidos.", "هناك ضجيجات كثيرة.", False, "«ruido» مذكر ومن ثمّ «muchos ruidos» إن أردنا الجمع، لكن الشائع «mucho ruido»."),
         opt("tr_u2_10_c", "Es muy ruidoso el pasillo.", "الممر صاخب جدًا.", False, "صحيحة لغويًا لكنها لا تُستخدم كشكوى مباشرة عن الليلة الحالية.")],
       answerKey={"correctOptionIds": ["tr_u2_10_a"]},
       explanationAr="«ruido» مذكر: mucho ruido. للتعبير الاسمي «hay» أفضل من الصفة.",
       errorFeedback={"tr_u2_10_b": "المطابقة: «mucho ruido» أو «muchos ruidos».",
                      "tr_u2_10_c": "صحيحة لكنها أقل مباشرة في الشكوى."},
       targetVocab=["habitación doble"]),

    ex("tr_u2_11_change", "choose_reply", "اطلب غرفة بديلة بلباقة.",
       ["speaking", "reading"], 2,
       stemEs="— Lo sentimos mucho. No sabemos qué pasa.", stemAr="— نأسف جدًا. لا نعرف ما المشكلة.",
       options=[opt("tr_u2_11_a", "¿Sería posible cambiar de habitación, por favor?", "هل سيكون ممكنًا تغيير الغرفة من فضلك؟", True),
                opt("tr_u2_11_b", "Quiero otra habitación ahora.", "أريد غرفة أخرى الآن.", False, "طلب آمر بلا لباقة («ahora»)."),
                opt("tr_u2_11_c", "Entonces me voy a otro hotel.", "إذًا سأذهب إلى فندق آخر.", False, "تصعيد قبل محاولة الحل؛ الفندق طلب تعاونًا.")],
       answerKey={"correctOptionIds": ["tr_u2_11_a"]},
       explanationAr="«¿Sería posible…?» صيغة شرطية مهذبة عالية، تصلح للطلبات الحساسة. ثم por favor.",
       errorFeedback={"tr_u2_11_b": "أضف لباقة: «¿Sería posible…?».",
                      "tr_u2_11_c": "أعطِ فرصة للحل قبل التصعيد."},
       targetVocab=["habitación doble"]),

    ex("tr_u2_12_summary", "summarize_dialogue", "أي ملخص يعبّر بدقة عن الشكوى؟",
       ["reading", "writing"], 3,
       contextAr="لخّص ما قلته للموظف: المكيف لا يعمل، والغرفة في ممر صاخب، وتريد غرفة هادئة.",
       options=[opt("tr_u2_12_a", "El aire no funciona y hay ruido; pido una habitación más tranquila.", "المكيف لا يعمل وهناك ضجيج؛ أطلب غرفة أهدأ.", True),
                opt("tr_u2_12_b", "Todo está perfecto, gracias.", "كل شيء ممتاز، شكرًا.", False, "يناقض المشكلة تمامًا."),
                opt("tr_u2_12_c", "Quiero desayunar ahora.", "أريد أن أفطر الآن.", False, "مطلب غير متعلق بالشكوى المذكورة.")],
       answerKey={"correctOptionIds": ["tr_u2_12_a"],
                  "accepted": ["El aire no funciona y hay ruido; pido una habitación más tranquila."]},
       explanationAr="الملخص الجيد يجمع المشكلتين ثم الطلب. «más tranquila» = أهدأ (مؤنث تابع لـhabitación).",
       errorFeedback={"tr_u2_12_b": "الملخص يجب أن يعكس الشكوى.", "tr_u2_12_c": "هذا مطلب آخر."},
       targetVocab=["habitación doble"]),
  ],
  "درس الفندق 3/4. يحتاج مراجعة إسبانية أصلية لصيغة «¿Sería posible…?» وحساسية مضمون الشكوى."))

L.append(lesson(
  "tr-u2-checkout", "المغادرة والفاتورة", "tr-u2-hotel",
  "أن يسأل المتعلم عن الفاتورة ووقت المغادرة وطريقة الدفع، ويتعامل مع بند غامض في الفاتورة.",
  11, ["factura", "salida", "efectivo"], ["llave", "tarjeta de crédito", "reserva"],
  ["Hago el check-out ahora.", "¿Puede explicarme este cargo?", "Pago con tarjeta."],
  ["pagos", "preguntas-sobre-factura"],
  scen("تغادر الفندق صباحًا وتريد دفع الفاتورة.", "الاستقبال، قبل المغادرة", [
    ("Buenos días, ¿hace el check-out ahora?", "صباح الخير، هل ستغادر الآن؟", "صباح الخير، هتمشي دلوقتي؟", "tr-u2-l4-recep-1"),
    ("Sí. ¿Me puede dar la factura, por favor?", "نعم. هل يمكنك إعطائي الفاتورة من فضلك؟", "أيوة. ممكن تديني الفاتورة لو سمحت؟", "tr-u2-l4-omar-1"),
    ("Claro. ¿Paga en efectivo o con tarjeta?", "بالتأكيد. هل تدفع نقدًا أم بالبطاقة؟", "أكيد. بتدفع كاش ولا بالفيزا؟", "tr-u2-l4-recep-2"),
  ]),
  [
    ex("tr_u2_13_checkout", "word_choice", "أي صيغة هي المعتادة في السؤال عن الدفع بالبطاقة؟",
       ["reading", "vocabulary"], 2, options=[
         opt("tr_u2_13_a", "¿Puedo pagar con tarjeta?", "هل أستطيع الدفع بالبطاقة؟", True),
         opt("tr_u2_13_b", "¿Puedo pagar por tarjeta de crédito?", None, False, "«por» أقل شيوعًا؛ الصيغة المعتادة «con tarjeta»."),
         opt("tr_u2_13_c", "¿Pago tarjeta?", "هل أدفع بطاقة؟", False, "ناقصة حرف الجر والصيغة السليمة: ¿Puedo pagar con tarjeta?")],
       answerKey={"correctOptionIds": ["tr_u2_13_a"]},
       explanationAr="طريقة الدفع: pagar con tarjeta / en efectivo. الفعل «pagar» يتطلب أداة الوسيلة.",
       errorFeedback={"tr_u2_13_b": "الأشيع «con tarjeta».", "tr_u2_13_c": "المطلوب: ¿Puedo pagar con tarjeta?"},
       targetVocab=["efectivo", "tarjeta de crédito"]),

    ex("tr_u2_14_receipt", "fill_blank", "أكمل السؤال عن بند في الفاتورة.",
       ["writing", "grammar"], 3,
       stemEs="¿Puede ____ este cargo, por favor?", stemAr="هل يمكنك تفسير هذا البند من فضلك؟",
       answerKey={"accepted": ["explicarme", "explicar"], "caseSensitive": False},
       explanationAr="«explicarme» = أن يشرح لي. تركيب مهذب: ¿Puede explicarme…?",
       errorFeedback={"explica": "بعد ¿Puede? يأتي المصدر.", "explícame": "صيغة أمر غير مناسبة هنا؛ الأفضل ¿Puede explicarme…?"},
       targetVocab=["factura"]),

    ex("tr_u2_15_departure", "translate_short", "ترجم إلى الإسبانية.",
       ["writing", "grammar"], 3, stemAr="متى يجب أن أترك الغرفة؟", stemEs="",
       answerKey={"accepted": ["¿A qué hora tengo que dejar la habitación?", "¿A qué hora debo dejar la habitación?", "¿A qué hora hay que dejar la habitación?"], "caseSensitive": False, "ignorePunctuation": True},
       explanationAr="الالتزام الشخصي: tener que + مصدر أو deber + مصدر. وفي الفنادق يُستخدم أيضًا «la hora de salida».",
       errorFeedback={"¿Cuándo dejo la habitación?" : "صحيحة لكنها أقل دقة في سؤال الالتزام.",
                      "¿A qué hora tengo dejar?": "ناقصة «que»: tengo que dejar."},
       targetVocab=["salida"]),

    ex("tr_u2_16_formal", "choose_reply", "الموظف يقول: «Ha habido un error con el cargo.» اختر الردّ المناسب.",
       ["reading", "speaking"], 3,
       stemEs="— Ha habido un error con el cargo del minibar.",
       stemAr="— حدث خطأ في بند الميني بار.",
       options=[opt("tr_u2_16_a", "Ah, entiendo. ¿Puede corregirlo, por favor?", "آه، أفهم. هل يمكنك تصحيحه من فضلك؟", True),
                opt("tr_u2_16_b", "¡Sois unos ladrones!", "أنتم لصوص!", False, "إهانة مباشرة تخرج عن اللباقة وقد تكون اتهامًا بلا دليل."),
                opt("tr_u2_16_c", "No entiendo nada de nada.", "لا أفهم شيئًا على الإطلاق.", False, "الموظف شرح الخطأ؛ الأفضل طلب التصحيح.")],
       answerKey={"correctOptionIds": ["tr_u2_16_a"]},
       explanationAr="عند إقرار الموظف بالخطأ: افهم ثم اطلب التصحيح: ¿Puede corregirlo? بلباقة.",
       errorFeedback={"tr_u2_16_b": "تجنّب الاتهام؛ اطلب التصحيح.",
                      "tr_u2_16_c": "الطلب الواضح أفضل من إعلان عدم الفهم."},
       targetVocab=["factura"]),
  ],
  "درس الفندق 4/4. يحتاج مراجعة إسبانية أصلية لمصطلح «cargo» في الفواتير، وصيغة «hora de salida»."))

# ---------------------------------------------------------------- الكتابة
for item in L:
    json.dump(item, open(os.path.join(OUT, f"lesson-{item['lesson']['slug']}.json"), 'w'), ensure_ascii=False, indent=2)

json.dump({
  "schemaVersion": "1.0.0",
  "programs": [{
    "slug": "travel", "kind": "path", "titleAr": "مسار السفر", "levelCode": "A2", "category": "travel",
    "objectiveAr": "مسار مستقل للسفر: المطار والفندق والمطعم والاتجاهات، بمهام تواصلية حقيقية.",
    "units": [
      {"slug": "tr-u1-airport", "levelCode": "A2", "titleAr": "المطار والوصول", "sortOrder": 1, "status": "draft",
       "lessons": ["tr-u1-checkin", "tr-u1-boarding-delay", "tr-u1-problem-luggage", "tr-u1-arrival-customs"],
       "vocabularyBundles": ["tr-shared"]},
      {"slug": "tr-u2-hotel", "levelCode": "A2", "titleAr": "الفندق والحجز", "sortOrder": 2, "status": "draft",
       "lessons": ["tr-u2-booking", "tr-u2-checkin", "tr-u2-room-problem", "tr-u2-checkout"],
       "vocabularyBundles": ["tr-shared"]},
    ],
  }],
}, open(os.path.join(OUT, 'paths.json'), 'w'), ensure_ascii=False, indent=2)
json.dump(PACK, open(os.path.join(OUT, 'vocab-tr-shared.json'), 'w'), ensure_ascii=False, indent=2)
print('travel:', len(L), 'lessons,', len(TR_ENTRIES), 'vocab entries')
