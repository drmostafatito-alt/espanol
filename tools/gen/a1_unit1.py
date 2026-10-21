# -*- coding: utf-8 -*-
"""مولّد محتوى وحدة A1 الأولى (3 دروس + حزمة مفردات الجنسيات).
يكتب ملفات JSON بصيغة المشروع نفسها؛ تمرّ بعدها على validate-content.
المحتوى أصلي، وحالته draft/reviewState=not-reviewed دائمًا.
"""
import json, os

OUT = 'content/drafts/a1'

def opt(oid, text, textAr=None, correct=False, why=None):
    o = {"id": oid, "text": text}
    if textAr: o["textAr"] = textAr
    o["isCorrect"] = bool(correct)
    if why: o["distractorRationaleAr"] = why
    return o

def ex(eid, typ, instructionAr, skills, difficulty, **kw):
    d = {"id": eid, "type": typ, "instructionAr": instructionAr}
    d.update(kw)
    d["skills"] = skills
    d["difficulty"] = difficulty
    d.setdefault("scoring", {"mode": "all_or_nothing"})
    return d

def lesson(doc):
    return {"schemaVersion": "1.0.0", "lesson": doc}

def review_note(note):
    return {
        "status": "draft",
        "authors": ["فريق المنهج — إعداد أصلي بمساعدة نموذج، بلا مراجعة بشرية بعد"],
        "spanishReviewer": None,
        "translationReviewer": None,
        "reviewedAt": None,
        "notes": note,
    }

AUDIO_NOTE = ("كل المقاطع الصوتية pending ولم يُنتج أي ملف صوتي (قرار المصدر والترخيص لم يُتخذ). "
              "دون صوت، تعمل التمارين السمعية بنص بديل ظاهر للمتعلم ولا تُحتسب خطأً.")

# ===========================================================================
# الدرس 2 — التحية الرسمية وصيغ المخاطبة
# ===========================================================================
L2 = {
  "slug": "a1-saludos-formalidad",
  "titleAr": "التحية الرسمية: usted وtú وما بينهما",
  "level": "A1",
  "programSlug": "main-track",
  "unitSlug": "a1-u1-origen",
  "objectiveAr": ("أن يحيّي المتعلم تحية مناسبة للوقت ويختار صيغة المخاطبة الملائمة (tú للمعتاد وusted للرسمي)، "
                  "ويقدّم نفسه في موقف رسمي بجملة كاملة صحيحة، ويميّز بين المذكر والمؤنث في encantado/encantada."),
  "estimatedMinutes": 12,
  "skills": ["listening", "reading", "speaking", "writing", "grammar", "vocabulary"],
  "newVocabulary": ["buenas tardes", "buenas noches", "¿cómo está usted?", "encantado", "señor", "señora", "usted", "con permiso"],
  "reviewVocabulary": ["hola", "ser", "de", "¿de dónde?"],
  "targetStructures": ["Buenos días / Buenas tardes / Buenas noches", "¿Cómo está usted?", "usted + فعل بصيغة الغائب", "Encantado / Encantada"],
  "grammarTopics": ["tu-vs-usted", "tercera-persona-formal", "concordancia-encantado"],
  "scenarios": [{
    "contextAr": "تدخل مكتب شركة في مدريد صباحًا لتسليم ورقة، والموظفة تستقبلك رسميًا.",
    "settingAr": "مكتب استقبال، صباحًا",
    "lines": [
      {"es": "Buenos días. ¿En qué puedo ayudarle?", "ar": "صباح الخير. كيف أستطيع مساعدتك؟", "arEg": "صباح الخير. أقدر أساعدك في إيه؟", "audioKey": "pending/a1-saludos-recep-1"},
      {"es": "Buenos días, señora. Soy Omar. Traigo un documento para la oficina.", "ar": "صباح الخير يا سيدة. أنا عمر. أحضر ورقة للمكتب.", "arEg": "صباح الخير يا مدام. أنا عمر. جايب ورقة للمكتب.", "audioKey": "pending/a1-saludos-omar-1"},
      {"es": "Encantada, señor. ¿Cómo está usted hoy?", "ar": "تشرفنا يا سيد. كيف حالك اليوم؟", "arEg": "تشرفنا يا أستاذ. إزيك النهاردة؟", "audioKey": "pending/a1-saludos-recep-2"},
      {"es": "Muy bien, gracias. ¿Y usted?", "ar": "بخير جدًا، شكرًا. وأنتِ؟", "arEg": "كويس جدًا، شكرًا. وإنتِ؟", "audioKey": "pending/a1-saludos-omar-2"},
      {"es": "Con permiso, voy a llamar a mi compañera.", "ar": "عن إذنك، سأنادي زميلتي.", "arEg": "عن إذنك، هأنادي زميلتي.", "audioKey": "pending/a1-saludos-recep-3"}
    ]
  }],
  "mastery": {"minAccuracy": 70, "minCorrectExercises": 6, "requiredExerciseTypes": ["listen_choose", "word_choice", "fill_blank"]},
  "unlock": {"type": "sequential"},
  "offlinePriority": 2,
  "exercises": [
    ex("a1_sal_1_listen", "listen_choose",
       "استمع (أو اقرأ النص البديل) واختر التحية التي سمعتها.",
       ["listening", "vocabulary"], 1,
       audioKey="pending/a1-saludos-recep-2",
       speechEs="Encantada, señor. ¿Cómo está usted hoy?",
       options=[
         opt("a1_sal_1_a", "Encantada, señor. ¿Cómo está usted hoy?", "تشرفنا يا سيد. كيف حالك اليوم؟", True),
         opt("a1_sal_1_b", "Buenos días, ¿cómo estás?", "صباح الخير، كيف حالك؟", False, "تحية غير رسمية (estás) — لا تطابق المقطع الرسمي."),
         opt("a1_sal_1_c", "Hasta luego, señor.", "إلى لقاء قريب يا سيد.", False, "وداع لا تحية؛ ولا يوجد سؤال عن الحال."),
       ],
       answerKey={"correctOptionIds": ["a1_sal_1_a"]},
       explanationAr="المقطع رسمي: استُخدمت «señor» وصيغة «¿Cómo está usted?» لا «¿Cómo estás?». كلمة «Encantada» بالتاء المربوطة في النهاية تعني أن المتحدثة امرأة.",
       errorFeedback={
         "a1_sal_1_b": "استمع إلى الفعل: «está usted» رسمي، وليس «estás» غير رسمي.",
         "a1_sal_1_c": "التحية تبدأ بـ«Buenos días / Buenas tardes»؛ «Hasta luego» وداع."},
       targetVocab=["¿cómo está usted?", "encantado", "señor"]),

    ex("a1_sal_2_time", "word_choice",
       "الساعة الثامنة مساءً وأنت تدخل مطعمًا. أي تحية تختار؟",
       ["vocabulary", "reading"], 1,
       contextAr="التحية في الإسبانية تتغيّر بحسب وقت اليوم، والخطأ فيها يُلاحَظ بسرعة.",
       options=[
         opt("a1_sal_2_a", "Buenas noches.", "مساء الخير (بعد الغروب).", True),
         opt("a1_sal_2_b", "Buenos días.", "صباح الخير.", False, "للصباح فقط؛ استخدامها ليلًا خطأ شائع."),
         opt("a1_sal_2_c", "Buenas tardes.", "مساء الخير (بعد الظهر).", False, "تصلح بعد الظهر حتى الغروب؛ في الثامنة مساءً نستخدم noches."),
         opt("a1_sal_2_d", "Adiós.", "وداعًا.", False, "وداع عند المغادرة، لا تحية عند الدخول."),
       ],
       answerKey={"correctOptionIds": ["a1_sal_2_a"]},
       explanationAr="التحيات: «Buenos días» صباحًا، «Buenas tardes» من بعد الظهر إلى الغروب، «Buenas noches» بعد الغروب. لاحظ أن días مذكر فتُسبق بـBuenos، وtardes/noches مؤنث فتُسبق بـBuenas.",
       errorFeedback={
         "a1_sal_2_b": "«Buenos días» للصباح؛ في المساء نقول «Buenas noches».",
         "a1_sal_2_c": "«Buenas tardes» تنتهي عند الغروب؛ الثامنة مساءً تحتاج «Buenas noches».",
         "a1_sal_2_d": "«Adiós» عند المغادرة لا عند الدخول."},
       targetVocab=["buenas tardes", "buenas noches"]),

    ex("a1_sal_3_usted", "word_choice",
       "تخاطب مديرًا في العمل للمرة الأولى. أي صيغة مناسبة؟",
       ["grammar", "reading"], 2,
       contextAr="tú للمعتاد والأصدقاء، usted للرسمي والغرباء في السياق المهني.",
       options=[
         opt("a1_sal_3_a", "¿Cómo está usted?", "كيف حالك؟ (رسمي)", True),
         opt("a1_sal_3_b", "¿Cómo estás tú?", "كيف حالك؟ (غير رسمي)", False, "غير مناسبة مع مدير في أول لقاء؛ تُستخدم مع الأصدقاء."),
         opt("a1_sal_3_c", "¿Qué tal?", "إيه الأخبار؟", False, "غير رسمية جدًا؛ لا تصلح لأول لقاء مهني."),
       ],
       answerKey={"correctOptionIds": ["a1_sal_3_a"]},
       explanationAr="مع «usted» يأتي الفعل بصيغة الغائب: usted está (لا estás). أما «tú» فتأخذ estás. اختيار الصيغة هنا اجتماعي قبل أن يكون نحويًا.",
       errorFeedback={
         "a1_sal_3_b": "«estás» غير رسمية؛ في العمل مع مدير استخدم «usted está».",
         "a1_sal_3_c": "«¿Qué tal?» للأصدقاء؛ في أول لقاء مهني الأفضل «¿Cómo está usted?»."},
       targetVocab=["usted", "¿cómo está usted?"]),

    ex("a1_sal_4_fill", "fill_blank",
       "أكمل الفراغ بصيغة الفعل المناسبة للمخاطبة الرسمية.",
       ["grammar", "writing"], 2,
       stemEs="Buenos días, señora. ¿Cómo ____ usted?",
       stemAr="صباح الخير يا سيدة. كيف حالك؟",
       answerKey={"accepted": ["está", "esta"], "caseSensitive": False},
       explanationAr="مع «usted» نستخدم صيغة الغائب: usted está. لو خاطبنا صديقًا لقلنا «¿Cómo estás?» بلا usted.",
       errorFeedback={
         "estás": "«estás» مع tú وليس مع usted. مع usted: está.",
         "es": "«es» من الفعل ser للهوية والصفة الثابتة؛ السؤال عن الحال يستخدم estar.",
         "eres": "«eres» من ser ومع tú؛ هنا نحتاج «está» من estar مع usted."},
       targetVocab=["usted", "¿cómo está usted?"]),

    ex("a1_sal_5_conjugate", "conjugate_in_context",
       "صرّف الفعل بين القوسين بصيغة المخاطبة الرسمية.",
       ["grammar", "writing"], 3,
       stemEs="Disculpe, ¿____ (trabajar) usted en esta oficina?",
       stemAr="عن إذنك، هل تعمل في هذا المكتب؟",
       answerKey={"accepted": ["trabaja"], "caseSensitive": False, "verb": "trabajar", "expectedPerson": "3s", "expectedTense": "presente"},
       explanationAr="أفعال المجموعة الأولى (-ar) مع usted تأخذ النهاية -a: usted trabaja. مع tú تكون -as: tú trabajas. الفرق حرف واحد، لكنه يحدد مستوى اللباقة.",
       errorFeedback={
         "trabajas": "هذه صيغة tú؛ مع usted نستخدم trabaja.",
         "trabajo": "هذه صيغة yo (أنا)؛ الفاعل هنا usted.",
         "trabajan": "هذه صيغة ellos/ustedes (الجمع)؛ للمفرد الرسمي: trabaja."},
       targetVocab=["usted"]),

    ex("a1_sal_6_fix", "find_fix_error",
       "الجملة التالية تخالف صيغة المخاطبة الرسمية. أي تصحيح يعالج الخطأ ويحافظ على الرسمية في الوقت نفسه؟",
       ["grammar", "reading"], 3,
       stemEs="Usted trabajas aquí, ¿verdad?",
       options=[
         opt("a1_sal_6_a", "¿Usted trabaja aquí?", "هل تعمل هنا؟", True),
         opt("a1_sal_6_b", "¿Tú trabajas aquí?", "هل تعمل هنا؟ (غير رسمي)", False, "تصحيح لغوي لكنه يغيّر السجل إلى غير رسمي، ولا يحفظ الرسمية."),
         opt("a1_sal_6_c", "¿Usted trabajar aquí?", None, False, "المصدر لا يصلح فعلًا رئيسيًا هنا؛ الصيغة الصحيحة trabaja."),
       ],
       answerKey={"correctOptionIds": ["a1_sal_6_a"]},
       explanationAr="القاعدة: usted + الفعل بصيغة الغائب. «Usted trabajas» خلط بين الصيغتين، وهو من أشهر أخطاء المبتدئين العرب لأن العربية لا تُصرّف الفعل مع المخاطب المحترم.",
       errorFeedback={
         "a1_sal_6_b": "«tú trabajas» صحيحة نحويًا لكنها تُخرج الموقف من الرسمية.",
         "a1_sal_6_c": "«trabajar» مصدر لا يصلح هنا؛ الصيغة الصحيحة trabaja."},
       targetVocab=["usted"]),

    ex("a1_sal_7_reply", "choose_reply",
       "اختر الردّ الأنسب في الموقف الرسمي.",
       ["speaking", "reading"], 2,
       contextAr="الموظفة تقول لك: «Buenos días, ¿cómo está usted?»",
       stemEs="— Buenos días, ¿cómo está usted?",
       stemAr="— صباح الخير، كيف حالك؟",
       options=[
         opt("a1_sal_7_a", "Muy bien, gracias. ¿Y usted?", "بخير جدًا، شكرًا. وأنت؟", True),
         opt("a1_sal_7_b", "Muy bien, gracias, ¿y tú?", "بخير، شكرًا، وأنت؟", False, "«tú» تكسر الرسمية التي بدأتها الموظفة بـusted."),
         opt("a1_sal_7_c", "Me llamo Omar.", "اسمي عمر.", False, "ردّ على سؤال الاسم، لا على سؤال الحال."),
         opt("a1_sal_7_d", "Soy de Egipto.", "أنا من مصر.", False, "ردّ على سؤال الأصل، والسؤال هنا عن الحال."),
       ],
       answerKey={"correctOptionIds": ["a1_sal_7_a"]},
       explanationAr="الرد يتبع سجل السؤال: سؤال بـusted يُجاب بـusted. «¿Y usted?» تعني «وأنت؟» بالرسمية، مقابل «¿Y tú?» غير الرسمية.",
       errorFeedback={
         "a1_sal_7_b": "احفظ التطابق: usted ⇒ ¿Y usted?",
         "a1_sal_7_c": "هذا ردّ على «¿Cómo se llama?» لا على سؤال الحال.",
         "a1_sal_7_d": "هذا ردّ على «¿De dónde es?»."},
       targetVocab=["usted", "¿cómo está usted?"]),

    ex("a1_sal_8_order", "word_order",
       "رتّب الكلمات لتكوين جملة تقديم رسمية صحيحة.",
       ["grammar", "writing"], 2,
       items=[
         {"id": "a1_sal_t1", "kind": "token", "text": "Encantado"},
         {"id": "a1_sal_t2", "kind": "token", "text": "señora"},
         {"id": "a1_sal_t3", "kind": "token", "text": "me"},
         {"id": "a1_sal_t4", "kind": "token", "text": "llamo"},
         {"id": "a1_sal_t5", "kind": "token", "text": "Omar"},
       ],
       answerKey={"accepted": ["Encantado, me llamo Omar, señora.", "Encantado, me llamo Omar, señora", "Encantado me llamo Omar señora"], "caseSensitive": False, "ignorePunctuation": True},
       explanationAr="ترتيب طبيعي: كلمة التحيّة/التشرف أولًا، ثم التعريف بالاسم، ثم لقب المخاطب في النهاية بين فاصلتين. «Encantado» يقولها الرجل، و«Encantada» تقولها المرأة.",
       errorFeedback={"order": "ابدأ بـ«Encantado» ثم «me llamo Omar» ثم لقب المخاطب «señora»."},
       targetVocab=["encantado", "señora"]),

    ex("a1_sal_9_gender", "word_choice",
       "أنتِ امرأة وتعرّفين بنفسك رسميًا لمديرة. أي صيغة مناسبة؟",
       ["grammar", "vocabulary"], 2,
       options=[
         opt("a1_sal_9_a", "Encantada, señora.", "تشرفنا يا سيدة. (المتحدثة امرأة)", True),
         opt("a1_sal_9_b", "Encantado, señora.", "تشرفنا يا سيدة. (المتحدث رجل)", False, "المتحدثة امرأة، فالصفة يجب أن تُؤنَّث: encantada."),
         opt("a1_sal_9_c", "Encantada, señor.", "تشرفنا يا سيد. (المتحدثة امرأة تخاطب رجلًا)", False, "صحيحة نحويًا لكنها تخاطب رجلًا؛ النص يقول إنك تخاطبين سيدة."),
       ],
       answerKey={"correctOptionIds": ["a1_sal_9_a"]},
       explanationAr="«encantado/encantada» صفة تصف المتحدث لا المخاطب: الرجل يقول «encantado» والمرأة «encantada». الخطأ الشائع أن يتبع الوصفُ جنسَ المخاطَب.",
       errorFeedback={
         "a1_sal_9_b": "الصفة تتبع جنس المتحدّث: امرأة ⇒ encantada.",
         "a1_sal_9_c": "اللقب لا يطابق المخاطَب هنا؛ المطلوب مخاطبة سيدة: señora."},
       targetVocab=["encantado", "señora"]),

    ex("a1_sal_10_translate", "translate_short",
       "ترجم إلى الإسبانية بصيغة مهذّبة.",
       ["writing", "grammar"], 3,
       stemAr="عن إذنك، هل تعمل هنا؟",
       stemEs="",
       answerKey={"accepted": ["Con permiso, ¿trabaja usted aquí?", "Con permiso, ¿usted trabaja aquí?", "Con permiso, trabaja usted aquí", "Con permiso, ¿trabaja aquí?"], "caseSensitive": False, "ignorePunctuation": True},
       explanationAr="«عن إذنك» = Con permiso، ثم سؤال رسمي: ¿trabaja usted aquí? الضمير usted يجوز بعد الفعل أو قبله، والرسمية تُحفظ بالفعل trabaja.",
       errorFeedback={
         "Con permiso, ¿trabajas aquí?": "«trabajas» غير رسمية؛ استخدم «trabaja».",
         "Perdón, ¿trabajas aquí?": "«Perdón» للاعتذار عن خطأ؛ للاستئذان بالمرور أو الانصراف نستخدم «Con permiso»."},
       targetVocab=["con permiso", "usted"]),

    ex("a1_sal_11_speak", "speak_with_text",
       "انطق الجمل الرسمية بصوت واضح. تمرين مشاركة لا يُصحَّح آليًا.",
       ["speaking", "pronunciation"], 2,
       stemEs="Buenos días, señora. Encantado, me llamo Omar. ¿Cómo está usted?",
       stemAr="صباح الخير يا سيدة. تشرفنا، اسمي عمر. كيف حالك؟",
       answerKey={"referenceAudioKey": "pending/a1-saludos-11-model-1", "modelAnswer": "Buenos días, señora. Encantado, me llamo Omar. ¿Cómo está usted?"},
       explanationAr="ثبّت النبر: BUEnos DÍas، seÑOra، ¿cómo esTÁ usTED؟ نبرة السؤال ترتفع في النهاية. «ll» في llamo تُنطق قريبة من الياء المشدّدة، لا لامين.",
       scoring={"mode": "rubric", "rubric": [
         {"labelAr": "وضوح النبر في está", "weight": 50, "code": "pron_esta"},
         {"labelAr": "نطق ll في llamo", "weight": 50, "code": "pron_ll"}]},
       targetVocab=["encantado", "señora", "usted"]),
  ],
  "review": review_note("درس وحدة A1 الأولى (2/4). يحتاج مراجعة إسبانية أصلية: سجل «usted» في سياق المكتب، وطبيعية «Encantado, me llamo Omar» عند تقديم النفس. " + AUDIO_NOTE),
}

# ===========================================================================
# الدرس 3 — تقديم شخص آخر
# ===========================================================================
L3 = {
  "slug": "a1-presentar-a-otro",
  "titleAr": "قدّم صديقك: te presento a…",
  "level": "A1",
  "programSlug": "main-track",
  "unitSlug": "a1-u1-origen",
  "objectiveAr": ("أن يقدّم المتعلم شخصًا ثالثًا بجملة صحيحة (Te presento a… / Este es… / Esta es…)، "
                  "ويستخدم es مع الطرف الثالث ويذكر أصله، ويميّز este من esta حسب جنس الاسم."),
  "estimatedMinutes": 11,
  "skills": ["listening", "reading", "speaking", "writing", "grammar", "vocabulary"],
  "newVocabulary": ["señor", "señora", "encantado", "usted"],
  "reviewVocabulary": ["ser", "de", "¿de dónde?", "Egipto", "España"],
  "targetStructures": ["Te presento a + شخص", "Este es… / Esta es…", "Es de + بلد", "él / ella es"],
  "grammarTopics": ["ser-tercera-persona", "demostrativos-este-esta", "presentar-a-alguien"],
  "scenarios": [{
    "contextAr": "في دورة إسبانية، تقدّم صديقتك المصرية إلى زميل إسباني.",
    "settingAr": "قاعة درس، بعد الحصة",
    "lines": [
      {"es": "Hola, Marta. Te presento a mi amiga Nour.", "ar": "مرحبًا مارتا. أقدّم لك صديقتي نور.", "arEg": "أهلًا مارتا. دي صاحبتي نور.", "audioKey": "pending/a1-presentar-omar-1"},
      {"es": "Encantada, Nour. ¿De dónde eres?", "ar": "تشرفنا يا نور. من أين أنتِ؟", "arEg": "تشرفنا يا نور. إنتِ منين؟", "audioKey": "pending/a1-presentar-marta-1"},
      {"es": "Soy de Egipto, de Alejandría.", "ar": "أنا من مصر، من الإسكندرية.", "arEg": "أنا من مصر، من إسكندرية.", "audioKey": "pending/a1-presentar-nour-1"},
      {"es": "Ella es Marta, es de España.", "ar": "هي مارتا، من إسبانيا.", "arEg": "دي مارتا، من إسبانيا.", "audioKey": "pending/a1-presentar-omar-2"}
    ]
  }],
  "mastery": {"minAccuracy": 70, "minCorrectExercises": 6, "requiredExerciseTypes": ["word_choice", "fill_blank", "choose_reply"]},
  "unlock": {"type": "sequential"},
  "offlinePriority": 2,
  "exercises": [
    ex("a1_pres_1_reply", "choose_reply",
       "قدّمك صديقك إلى شخص جديد. اختر الردّ المناسب.",
       ["speaking", "reading"], 1,
       contextAr="صديقك يقول: «Te presento a Marta.» وأنت رجل.",
       stemEs="— Te presento a Marta.",
       stemAr="— أقدّم لك مارتا.",
       options=[
         opt("a1_pres_1_a", "Encantado, Marta. Me llamo Omar.", "تشرفنا يا مارتا. اسمي عمر.", True),
         opt("a1_pres_1_b", "Encantada, Marta.", "تشرفنا يا مارتا. (بصيغة المؤنث)", False, "«Encantada» تقولها امرأة؛ المتحدث هنا رجل فيقول «Encantado»."),
         opt("a1_pres_1_c", "Soy de Egipto.", "أنا من مصر.", False, "معلومة صحيحة محتملة لكنها ليست ردًّا على التقديم؛ الرد يبدأ بـEncantado."),
       ],
       answerKey={"correctOptionIds": ["a1_pres_1_a"]},
       explanationAr="الرد المعتاد على التقديم: «Encantado/a» + الاسم، ثم غالبًا «Me llamo…». جنس الصفة يتبع المتحدث: الرجل encantado، المرأة encantada.",
       errorFeedback={
         "a1_pres_1_b": "أنت رجل ⇒ Encantado بالواو، لا Encantada.",
         "a1_pres_1_c": "أجب أولًا بالتشرف، ثم يمكنك ذكر بلدك."},
       targetVocab=["encantado"]),

    ex("a1_pres_2_este", "word_choice",
       "أي جملة صحيحة عند تقديم صديق (رجل)؟",
       ["grammar", "reading"], 2,
       options=[
         opt("a1_pres_2_a", "Este es mi amigo Karim.", "هذا صديقي كريم.", True),
         opt("a1_pres_2_b", "Esta es mi amigo Karim.", "هذه صديقي كريم.", False, "«amigo» مذكر ⇒ «Este es»، لا «Esta es»."),
         opt("a1_pres_2_c", "Este eres mi amigo Karim.", "أنت صديقي كريم.", False, "«eres» للمخاطَب (tú)؛ عند الحديث عن شخص ثالث نستخدم «es»."),
         opt("a1_pres_2_d", "Este es mi amiga Karim.", "هذا صديقتي كريم.", False, "«amiga» مؤنث؛ الاسم كريم مذكر هنا، والأصح «amigo»."),
       ],
       answerKey={"correctOptionIds": ["a1_pres_2_a"]},
       explanationAr="«Este» للمذكر و«Esta» للمؤنث، ويتبعهما الفعل «es» للشخص الثالث. «amigo/amiga» يحدّد جنس الصديق لا جنس المتحدث.",
       errorFeedback={
         "a1_pres_2_b": "طابق الجنس: amigo مذكر ⇒ Este es.",
         "a1_pres_2_c": "«eres» للشخص المخاطَب؛ للشخص الثالث «es».",
         "a1_pres_2_d": "«amiga» مؤنث ولا يصلح مع اسم مذكر هنا."},
       targetVocab=["señor", "ser"]),

    ex("a1_pres_3_fill", "fill_blank",
       "أكمل الفراغ بفعل الكينونة المناسب للشخص الثالث.",
       ["grammar", "writing"], 2,
       stemEs="Mi amiga Nour ____ de Egipto.",
       stemAr="صديقتي نور من مصر.",
       answerKey={"accepted": ["es"], "caseSensitive": False},
       explanationAr="للشخص الثالث (هو/هي) نستخدم «es» من الفعل ser: Nour es de Egipto. الجملة تبقى نفسها مع هو أو هي.",
       errorFeedback={
         "eres": "«eres» للمخاطَب tú، لا للشخص الثالث.",
         "soy": "«soy» للمتحدث (أنا)؛ هنا نتحدث عن نور.",
         "está": "«está» من estar للمكان المؤقت؛ الأصل والجنسية يكونان بـser."},
       targetVocab=["ser"]),

    ex("a1_pres_4_order", "word_order",
       "رتّب الكلمات لتكوين جملة تقديم صحيحة.",
       ["grammar", "writing"], 2,
       items=[
         {"id": "a1_pres_t1", "kind": "token", "text": "Te"},
         {"id": "a1_pres_t2", "kind": "token", "text": "presento"},
         {"id": "a1_pres_t3", "kind": "token", "text": "a"},
         {"id": "a1_pres_t4", "kind": "token", "text": "mi"},
         {"id": "a1_pres_t5", "kind": "token", "text": "compañera"},
         {"id": "a1_pres_t6", "kind": "token", "text": "Nour"},
       ],
       answerKey={"accepted": ["Te presento a mi compañera Nour.", "Te presento a mi compañera Nour", "te presento a mi compañera nour"], "caseSensitive": False, "ignorePunctuation": True},
       explanationAr="التركيب الثابت: «Te presento a + شخص». حرف الجر «a» واجب قبل الشخص المقدَّم (a mi compañera)، وهو ما يميّز هذا التعبير عن ترجمة حرفية من العربية.",
       errorFeedback={"order": "«Te presento a…» ثم الشخص: a mi compañera Nour."},
       targetVocab=["señora"]),

    ex("a1_pres_5_fix", "find_fix_error",
       "في الجملة خطأ في تقديم شخص. اختر التصحيح.",
       ["grammar", "reading"], 3,
       stemEs="Te presento a ella es mi amiga Nour.",
       options=[
         opt("a1_pres_5_a", "Te presento a mi amiga Nour.", "أقدّم لك صديقتي نور.", True),
         opt("a1_pres_5_b", "Te presento a ella es mi amiga.", None, False, "سوء استخدام الضمير «ella» مع «es» داخل التقديم."),
         opt("a1_pres_5_c", "Te presento mi amiga Nour.", None, False, "ناقصة حرف الجر «a» قبل الشخص؛ غير صحيحة في هذا التعبير."),
       ],
       answerKey={"correctOptionIds": ["a1_pres_5_a"]},
       explanationAr="«Te presento a + شخص» تركيب كامل، فلا نضيف «ella es» بعده. لو أردنا جملتين: «Ella es mi amiga. Te la presento.»",
       errorFeedback={
         "a1_pres_5_b": "لا نجمع تقديمًا وجملة وصف في تركيب واحد: «Te presento a…» وحدها كافية.",
         "a1_pres_5_c": "«a» قبل الشخص واجبة: Te presento a mi amiga."},
       targetVocab=["ser"]),

    ex("a1_pres_6_formal", "word_choice",
       "تقدّم زميلك إلى مديرك. أي صيغة أنسب؟",
       ["grammar", "reading"], 3,
       options=[
         opt("a1_pres_6_a", "Señor director, le presento a mi compañero Karim.", "سيد المدير، أقدّم لك زميلي كريم.", True),
         opt("a1_pres_6_b", "Te presento a mi compañero Karim.", "أقدّم لك زميلي كريم. (غير رسمي)", False, "«Te» غير رسمية؛ مع المدير نستخدم «le»."),
         opt("a1_pres_6_c", "Le presento a mi compañero Karim, ¿vale?", None, False, "«¿vale?» عامية غير رسمية وتناقض سجل الجملة الرسمي."),
       ],
       answerKey={"correctOptionIds": ["a1_pres_6_a"]},
       explanationAr="في التقديم الرسمي: «le presento a + شخص» بدل «te presento a…». الضمير le يعود على المخاطَب الرسمي (usted)، والاسم يبقى مع «a».",
       errorFeedback={
         "a1_pres_6_b": "مع المدير استخدم «le presento» لا «te presento».",
         "a1_pres_6_c": "«¿vale?» غير مناسبة في سياق رسمي."},
       targetVocab=["usted", "señor"]),

    ex("a1_pres_7_translate", "translate_short",
       "ترجم إلى الإسبانية.",
       ["writing", "grammar"], 3,
       stemAr="هي صديقتي، وهي من إسبانيا.",
       stemEs="",
       answerKey={"accepted": ["Ella es mi amiga y es de España.", "Ella es mi amiga, es de España.", "Ella es mi amiga y es de España", "Ella es mi amiga. Es de España."], "caseSensitive": False, "ignorePunctuation": True},
       explanationAr="«هي» = Ella، والفعل «es» يخدم الجملتين. لا نحذف الفعل الثاني كما تفعل العربية عند العطف: نكرّره أو نستخدم «y es».",
       errorFeedback={
         "Ella es mi amiga y de España.": "ناقصة الفعل الثاني: …y es de España.",
         "Ella es mi amiga, ella de España.": "جملة بلا فعل؛ الإسبانية توجب «es»."},
       targetVocab=["ser", "España"]),

    ex("a1_pres_8_listen", "listen_choose",
       "استمع (أو اقرأ النص البديل) واختر من الذي قُدّم.",
       ["listening", "reading"], 2,
       audioKey="pending/a1-presentar-omar-1",
       speechEs="Hola, Marta. Te presento a mi amiga Nour.",
       options=[
         opt("a1_pres_8_a", "Nour", "نور", True),
         opt("a1_pres_8_b", "Marta", "مارتا", False, "مارتا هي المخاطَبة (يُقدَّم لها)، لا المقدَّمة."),
         opt("a1_pres_8_c", "Omar", "عمر", False, "عمر هو المتحدث الذي يقدّم، لا المقدَّم."),
       ],
       answerKey={"correctOptionIds": ["a1_pres_8_a"]},
       explanationAr="«Te presento a mi amiga Nour» = أقدّم لك صديقتي نور. التراكيب: te = لك، presento = أقدّم، a = حرف جر قبل الشخص، mi amiga = صديقتي.",
       errorFeedback={
         "a1_pres_8_b": "مارتا هي من نتحدث إليها (te).",
         "a1_pres_8_c": "عمر هو المتحدث (presento = أقدّم)."},
       targetVocab=["ser"]),

    ex("a1_pres_9_speak", "speak_with_text",
       "قدّم صديقك بصوت واضح. تمرين مشاركة لا يُصحَّح آليًا.",
       ["speaking", "pronunciation"], 2,
       stemEs="Te presento a mi amigo Karim. Es de Egipto.",
       stemAr="أقدّم لك صديقي كريم. هو من مصر.",
       answerKey={"referenceAudioKey": "pending/a1-presentar-9-model-1", "modelAnswer": "Te presento a mi amigo Karim. Es de Egipto."},
       explanationAr="«presento» نبرتها على المقطع الثاني: preSENto. «Egipto» تُنطق إخيبتو تقريبًا، والحرف j في الإسبانية لا يُنطق جيمًا مصريًا في معظم الكلمات.",
       scoring={"mode": "rubric", "rubric": [
         {"labelAr": "نبر preSENto", "weight": 50, "code": "pron_presento"},
         {"labelAr": "وصل «a mi amigo» بلا توقف", "weight": 50, "code": "pron_link"}]},
       targetVocab=["ser", "Egipto"]),
  ],
  "review": review_note("درس وحدة A1 الأولى (3/4). يحتاج مراجعة إسبانية أصلية لطبيعية «le presento a mi compañero» في سياق العمل، ومراجعة ترجمة للعربية. " + AUDIO_NOTE),
}

json.dump(lesson(L2), open(os.path.join(OUT, 'lesson-a1-saludos-formalidad.json'), 'w'), ensure_ascii=False, indent=2)
json.dump(lesson(L3), open(os.path.join(OUT, 'lesson-a1-presentar-a-otro.json'), 'w'), ensure_ascii=False, indent=2)
print('written L2, L3')
