# -*- coding: utf-8 -*-
"""مسار الكول سنتر: الوحدة الأولى (4 دروس) — افتتاح المكالمة، التحقق، التعليق والتحويل، ومحاكاة كاملة.
بيانات العملاء وهمية تمامًا. المحاكاة غير مُقيَّمة آليًا (لا ASR ولا تقييم نطق).
"""
import json, os
OUT = 'content/drafts/callcenter'

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
            "spanishReviewer": None, "translationReviewer": None, "reviewedAt": None,
            "notes": note + " كل المقاطع الصوتية pending ولم يُنتج أي ملف. بيانات العملاء وهمية."}

def lesson(slug, titleAr, objectiveAr, minutes, newVocab, reviewVocab, structures, grammar, scenario, exercises, note):
    return {"schemaVersion": "1.0.0", "lesson": {
        "slug": slug, "titleAr": titleAr, "level": "B1", "programSlug": "callcenter",
        "unitSlug": "cc-u1-opening-verification", "objectiveAr": objectiveAr,
        "estimatedMinutes": minutes,
        "skills": ["listening", "reading", "speaking", "writing", "grammar", "vocabulary"],
        "newVocabulary": newVocab, "reviewVocabulary": reviewVocab,
        "targetStructures": structures, "grammarTopics": grammar,
        "scenarios": [scenario],
        "mastery": {"minAccuracy": 70, "minCorrectExercises": 4,
                    "requiredExerciseTypes": ["word_choice", "choose_reply"]},
        "unlock": {"type": "sequential"}, "offlinePriority": 1,
        "exercises": exercises, "review": review(note)}}

def scen(contextAr, settingAr, lines):
    return {"contextAr": contextAr, "settingAr": settingAr,
            "lines": [{"es": es, "ar": ar, "arEg": eg, "audioKey": f"pending/{k}"} for (es, ar, eg, k) in lines]}

RUBRIC_PHONE = {"mode": "rubric", "rubric": [
    {"labelAr": "الافتتاح والتحية المهنية", "weight": 25, "code": "opening"},
    {"labelAr": "طلب البيانات بلباقة بدل افتراضها", "weight": 25, "code": "verification"},
    {"labelAr": "وضوح الحل وخطواته", "weight": 25, "code": "solution"},
    {"labelAr": "الإغلاق والشكر", "weight": 25, "code": "closing"}]}

def entry(head, pos, gender, ipa, hint, msa, eg, gloss, ex_es, ex_ar, ex_eg, usage, err, rank):
    return {"headword": head, "normalized": head.lower(), "kind": "word", "pos": pos, "gender": gender,
            "plural": None, "level": "B1", "register": "formal", "ipa": ipa, "pronunciationHintAr": hint,
            "internalRank": rank, "tags": ["كول سنتر", "B1"],
            "senses": [{"senseNo": 1, "meaningArFusha": msa, "meaningArEg": eg, "glossEs": gloss,
                        "exampleEs": ex_es, "exampleAr": ex_ar, "exampleArEg": ex_eg,
                        "usageNoteAr": usage, "commonErrorAr": err}],
            "examples": [{"es": ex_es, "ar": ex_ar, "arEg": ex_eg}]}

CC_ENTRIES = [
 entry("pedido", "noun", "m", "/peˈðiðo/", "بيذيو", "طلب/طلبية (شراء)", "أوردر", "sustantivo masculino: orden de compra",
       "Su pedido salió ayer.", "طلبك خرج أمس.", "الأوردر بتاعك خرج إمبارح.",
       "número de pedido = رقم الطلب.", "«orden» تعني ترتيبًا أو أمرًا؛ للشراء «pedido».", 1),
 entry("envío", "noun", "m", "/emˈbio/", "إمبيو", "الشحن / الإرسال", "الشحن", "sustantivo masculino",
       "El envío tarda tres días.", "الشحن يستغرق ثلاثة أيام.", "الشحن بياخد تلات أيام.",
       "gastos de envío = تكاليف الشحن.", "«envío» اسم؛ الفعل enviar.", 2),
 entry("entrega", "noun", "f", "/enˈtɾeɣa/", "إنترِيغا", "التسليم", "التسليم", "sustantivo femenino",
       "La entrega está prevista para mañana.", "التسليم متوقع غدًا.", "التسليم متوقع بكرة.",
       "fecha de entrega = تاريخ التسليم.", "«entrega» ليست «entrada» (دخول).", 3),
 entry("plazo", "noun", "m", "/ˈplaθo/", "بلاثو", "المدة المحددة / الموعد النهائي", "المدة", "sustantivo masculino",
       "El plazo es de cinco días laborables.", "المدة خمسة أيام عمل.", "المدة خمس أيام عمل.",
       "días laborables = أيام عمل.", "«plazo» مدة محددة، وليست «plaza» (ساحة).", 4),
 entry("incidencia", "noun", "f", "/inθiˈðenθja/", "إنثيذينثيا", "مشكلة/حادث طارئ في الخدمة", "مشكلة", "sustantivo femenino: registro de problema",
       "Hemos abierto una incidencia.", "فتحنا بلاغ مشكلة.", "فتحنا بلاغ مشكلة.",
       "abrir una incidencia = تسجيل بلاغ.", "«incidencia» ليست «incidente» بالضرورة؛ الأولى مصطلح خدمة.", 5),
 entry("reclamación", "noun", "f", "/reklamaˈθjon/", "ريكلاماثيون", "شكوى رسمية", "شكوى", "sustantivo femenino",
       "Puede presentar una reclamación.", "يمكنك تقديم شكوى.", "ممكن تقدّم شكوى.",
       "presentar una reclamación = تقديم شكوى.", "«reclamación» رسمية؛ «queja» شكوى عامة.", 6),
 entry("reembolso", "noun", "m", "/reemˈbolso/", "رييمبولسو", "استرداد المبلغ", "استرداد الفلوس", "sustantivo masculino",
       "El reembolso tarda cinco días.", "استرداد المبلغ يستغرق خمسة أيام.", "استرداد الفلوس بياخد خمس أيام.",
       "solicitar un reembolso = طلب استرداد.", "«devolución» إعادة المنتج، و«reembolso» إعادة المال.", 7),
 entry("devolución", "noun", "f", "/deoβoluˈθjon/", "دييبولوثيون", "إعادة المنتج", "إرجاع المنتج", "sustantivo femenino",
       "La devolución es gratuita.", "إعادة المنتج مجانية.", "إرجاع المنتج مجاني.",
       "devolver = يعيد؛ devolución اسم.", "لا تخلطها بـreembolso (إعادة المال).", 8),
 entry("importe", "noun", "m", "/imˈpoɾte/", "إمبورتي", "المبلغ (المالي)", "المبلغ", "sustantivo masculino",
       "El importe total es 48,90 euros.", "المبلغ الإجمالي 48.90 يورو.", "المبلغ الإجمالي 48.90 يورو.",
       "importe total = المبلغ الإجمالي.", "«importe» ليس «importante» (مهم).", 9),
 entry("gestionar", "verb", None, "/xestjoˈnaɾ/", "خيستيونار", "يتولّى/يدير (إجراءً)", "يتابع/يدير", "verbo regular -ar",
       "Voy a gestionar su solicitud.", "سأتولّى طلبك.", "هتابع طلبك.",
       "gestión = إدارة/متابعة.", "«gestionar» ليست «gestionar con»؛ الفعل متعدٍّ بلا حرف جر.", 10),
 entry("comprobar", "verb", None, "/kompɾoˈβaɾ/", "كومبروبار", "يتحقق/يفحص", "يتأكد", "verbo regular -ar (o ⇒ ue: compruebo)",
       "Voy a comprobar el estado del envío.", "سأتحقق من حالة الشحنة.", "هتأكد من حالة الشحنة.",
       "comprobar = يتحقق فعليًا؛ verificar = يتحقق رسميًا.", "الصيغة compruebo لا comprobo.", 11),
 entry("verificar", "verb", None, "/beɾifiˈkaɾ/", "بيريفيكار", "يتحقق رسميًا من الهوية/البيانات", "يتأكد رسميًا", "verbo regular -ar",
       "Necesito verificar su identidad.", "أحتاج التحقق من هويتك.", "لازم أتأكد من هويتك.",
       "verificación = تحقق؛ تُستخدم في الإجراءات الرسمية.", "«verificar de» خطأ؛ الفعل متعدٍّ مباشرة.", 12),
 entry("anotar", "verb", None, "/anoˈtaɾ/", "أنوتار", "يدوّن/يسجّل ملاحظة", "يسجّل", "verbo regular -ar",
       "Voy a anotar su número de contacto.", "سأسجّل رقم تواصلك.", "هسجّل رقم تواصلك.",
       "anotar = تدوين سريع؛ registrar = تسجيل في النظام.", "«apuntar» مرادف شائع في إسبانيا.", 13),
 entry("transferir", "verb", None, "/tɾansfeˈɾiɾ/", "ترانسفيرير", "يحوّل المكالمة / يحوّل مبلغًا", "يحوّل", "verbo irregular (e ⇒ ie: transfiero)",
       "Le transfiero con mi compañero.", "سأحوّلك إلى زميلي.", "هحوّلك لزميلي.",
       "في المكالمات: le transfiero / le paso con.", "الصيغة transfiero لا transfero.", 14),
 entry("cliente", "noun", "mf", "/ˈkljente/", "كليينتي", "عميل", "عميل", "sustantivo de género común",
       "El cliente lleva dos días esperando.", "العميل ينتظر يومين.", "العميل مستني يومين.",
       "la clientela = العملاء كمجموعة.", "«clienta» للمؤنث جائزة، لكن الشائع في السياق المهني استخدام «cliente» للجنسين.", 15),
 entry("compañero", "noun", "m", "/kompaˈɲeɾo/", "كومبانييرو", "زميل", "زميل", "sustantivo masculino",
       "Mi compañera revisará su caso.", "زميلتي ستراجع حالتك.", "زميلتي هتراجع حالتك.",
       "compañera للمؤنث؛ compañero de trabajo = زميل عمل.", "«compañero» ليست «compañía» (شركة).", 16),
 entry("identidad", "noun", "f", "/iðentiˈðað/", "إيذينتيذاذ", "الهوية", "الهوية", "sustantivo femenino",
       "Por seguridad, necesitamos verificar su identidad.", "للأمان، نحتاج التحقق من هويتك.", "للأمان، لازم نتأكد من هويتك.",
       "لا نطلب كلمة المرور كاملة أبدًا في المكالمات؛ نطلب بيانات جزئية.", "لا تُطلب بيانات حساسة كاملة على الهاتف.", 17),
 entry("agente", "noun", "mf", "/aˈxente/", "أخينتي", "موظف الخدمة/الوكيل", "الموظف", "sustantivo de género común",
       "Le atiende el agente Omar.", "يخدمك الموظف عمر.", "الموظف عمر بيخدمك.",
       "le atiende = يخدمك (تعبير ثابت في المكالمات).", "«agente» لا يتغير للمؤنث في هذا السياق عادة.", 18),
]

PACK = {"schemaVersion": "1.0.0", "bundleSlug": "cc-shared",
  "pronunciationNoteAr": "النقل بالحروف العربية تقريب فقط. على الهاتف تزيد صعوبة تمييز b/p وd/t؛ لذلك نطلب التهجئة بدل التخمين.",
  "source": {"title": "مفردات خدمة العملاء — إعداد داخلي لمراجعة بشرية قبل النشر", "url": "",
             "license": "internal-draft", "accessedAt": "2026-10-21",
             "rankingNote": "internalRank داخلي لسَلسَلة التدريس، وليس ادعاءً بأنها الأكثر شيوعًا."},
  "entries": CC_ENTRIES}

L = []

L.append(lesson(
  "cc-u1-opening", "افتتاح المكالمة بنبرة مهنية",
  "أن يفتتح المتعلم المكالمة بتحية مؤسسية واضحة، ويقدّم اسمه وشركته، ويسأل عن سبب الاتصال بصيغة مهنية، ويتجنب الصيغ الآمرة.",
  12, ["agente", "cliente", "compañero"], ["usted", "por favor"],
  ["Le atiende…", "¿En qué puedo ayudarle?", "¿Podría decirme su nombre, por favor?"],
  ["registro-formal-telefonico", "usted-en-mcaciones"],
  scen("مكالمة واردة من عميل يبدو متوترًا. أنت الموظف.", "مركز اتصال، مكالمة واردة (بيانات وهمية)", [
    ("Buenos días, le atiende Omar de Atención al Cliente. ¿En qué puedo ayudarle?", "صباح الخير، يخدمك عمر من خدمة العملاء. كيف أساعدك؟", "صباح الخير، معاك عمر من خدمة العملاء. أساعدك في إيه؟", "cc-u1-l1-agente-1"),
    ("Llevo dos días esperando mi pedido y nadie me dice nada.", "أنتظر طلبي منذ يومين ولا أحد يخبرني بشيء.", "مستني الأوردر بتاعي يومين ومحدش بيقولي حاجة.", "cc-u1-l1-cliente-1"),
    ("Entiendo su molestia. Voy a comprobar el estado, ¿me permite un momento?", "أتفهّم انزعاجك. سأتحقق من الحالة، هل تسمح لي بلحظة؟", "فاتهم انزعاجك. هتأكد من الحالة، تسمح لي لحظة؟", "cc-u1-l1-agente-2"),
  ]),
  [
    ex("cc_u1_1_opening", "word_choice", "أي افتتاح مكالمة أنسب في مركز اتصال؟",
       ["reading", "speaking"], 2, options=[
         opt("cc_u1_1_a", "Buenos días, le atiende Omar de Atención al Cliente. ¿En qué puedo ayudarle?", "صباح الخير، يخدمك عمر من خدمة العملاء. كيف أساعدك؟", True),
         opt("cc_u1_1_b", "Dime, ¿qué quieres?", "قل لي، ماذا تريد؟", False, "غير رسمية ومباشرة؛ تخالف سجل الخدمة."),
         opt("cc_u1_1_c", "¿Sí? ¿Quién eres?", "نعم؟ من أنت؟", False, "تبدو فظة وبلا تقديم للموظف أو الشركة.")],
       answerKey={"correctOptionIds": ["cc_u1_1_a"]},
       explanationAr="الافتتاح المهني يجمع: تحية + تعريف بالموظف والشركة + سؤال مفتوح عن سبب الاتصال. صيغة usted واجبة.",
       errorFeedback={"cc_u1_1_b": "استخدم usted وصيغة مهنية.", "cc_u1_1_c": "قدّم نفسك أولًا ثم اسأل."},
       targetVocab=["agente"]),

    ex("cc_u1_2_empathy", "choose_reply", "العميل غاضب: «¡Nadie me ayuda nunca!» اختر الردّ المهني.",
       ["speaking", "reading"], 3,
       stemEs="— ¡Nadie me ayuda nunca en esta empresa!",
       stemAr="— لا أحد يساعدني أبدًا في هذه الشركة!",
       options=[opt("cc_u1_2_a", "Entiendo su molestia y voy a ayudarle ahora mismo.", "أتفهّم انزعاجك وسأساعدك الآن.", True),
                opt("cc_u1_2_b", "No es mi culpa.", "ليس خطئي.", False, "رفض المسؤولية يزيد الغضب."),
                opt("cc_u1_2_c", "Tiene que hablar más despacio.", "عليك أن تتحدث أبطأ.", False, "مطلب آمر في لحظة غضب، ويُقابَل بالتجاهل.")],
       answerKey={"correctOptionIds": ["cc_u1_2_a"]},
       explanationAr="الاعتراف بالشعور ثم الالتزام بالفعل: «Entiendo su molestia» + «voy a ayudarle». هذه صيغة تدريب مهني قياسية.",
       errorFeedback={"cc_u1_2_b": "أكّد المساعدة ولا تدفع اللوم.", "cc_u1_2_c": "اطلب اللطف بصيغة مهنية لاحقًا عند الحاجة."},
       targetVocab=["cliente"]),

    ex("cc_u1_3_formal", "find_fix_error", "أي صيغة تحفظ الرسمية وتُصوغ الطلب بأدب في المكالمة (لا مجرد سؤال مباشر)؟",
       ["grammar", "reading"], 2,
       stemEs="Oye, dime tu número de pedido.",
       options=[opt("cc_u1_3_a", "Disculpe, ¿podría decirme su número de pedido, por favor?", "عفوًا، هل يمكنك إخباري برقم طلبك من فضلك؟", True),
                opt("cc_u1_3_b", "Dime tu número de pedido.", None, False, "أمر مباشر وصيغة tú، تخالف الرسمية."),
                opt("cc_u1_3_c", "¿Cuál es el número de pedido?", None, False, "صحيحة لكنها أقل لباقة؛ condicional + por favor أنسب في المكالمات.")],
       answerKey={"correctOptionIds": ["cc_u1_3_a"]},
       explanationAr="في المكالمات: usted + condicional (¿podría…?) + por favor. الصيغة الآمرة قد تُفهم عدوانية عبر الهاتف حيث لا تُرى ملامح الوجه.",
       errorFeedback={"cc_u1_3_b": "الأمر المباشر يبدو حادًّا على الهاتف.",
                      "cc_u1_3_c": "صحيحة لكن الأفضل condicional."},
       targetVocab=["pedido", "agente"]),

    ex("cc_u1_4_fill", "fill_blank", "أكمل العبارة المهنية لطلب وقت.",
       ["grammar", "writing"], 2,
       stemEs="¿Me ____ un momento, por favor?", stemAr="هل تسمح لي بلحظة من فضلك؟",
       answerKey={"accepted": ["permite"], "caseSensitive": False},
       explanationAr="«¿Me permite un momento?» = هل تسمح لي بلحظة؟ الفاعل usted ⇒ permite.",
       errorFeedback={"permito": "الفاعل usted ⇒ permite.", "permites": "«permites» لـtú؛ في الخدمة نستخدم usted."},
       targetVocab=["agente"]),

    ex("cc_u1_5_speak", "speak_with_text",
       "سجّل افتتاح مكالمتك بصوت واضح وبطيء. تمرين مشاركة لا يُصحَّح آليًا.",
       ["speaking"], 2,
       stemEs="Buenos días, le atiende Omar de Atención al Cliente. ¿En qué puedo ayudarle?",
       stemAr="صباح الخير، يخدمك عمر من خدمة العملاء. كيف أساعدك؟",
       answerKey={"referenceAudioKey": "pending/cc-u1-l1-agente-1",
                  "modelAnswer": "Buenos días, le atiende Omar de Atención al Cliente. ¿En qué puedo ayudarle?"},
       explanationAr="في المكالمات: سرعة أبطأ قليلًا، ونطق واضح لنهاية الكلمات، وتوقف قصير بعد التعريف. لا يوجد تقييم نطق آلي.",
       scoring=RUBRIC_PHONE,
       targetVocab=["agente"]),
  ],
  "درس الكول سنتر 1/4. يحتاج مراجعة بشرية من مدرّب خدمة عملاء فعلي لصياغات الافتتاح وللنبرة."))

L.append(lesson(
  "cc-u1-verification", "التحقق من الهوية بلا كشف بيانات",
  "أن يطلب المتعلم بيانات تحقّق جزئية (رقم الطلب، بريد مسجَّل، أربعة أرقام أخيرة) بلا طلب كلمة مرور كاملة، وأن يتعامل مع بيانات ناقصة بلا افتراض.",
  13, ["verificar", "identidad", "anotar"], ["pedido", "cliente", "importe"],
  ["Por seguridad, necesito verificar…", "¿Podría confirmarme…?", "No necesito su contraseña."],
  ["preguntas-de-verificacion", "privacidad-en-mcaciones"],
  scen("تتلقى مكالمة تطلب تفاصيل طلب، وترغب في التحقق أولًا.", "مركز اتصال، مكالمة عن شكوى (بيانات وهمية)", [
    ("Buenas tardes. Quiero saber dónde está mi pedido 48219.", "مساء الخير. أريد معرفة أين طلبي 48219.", "مساء الخير. عايز أعرف الأوردر 48219 فين.", "cc-u1-l2-cliente-1"),
    ("Por seguridad, necesito verificar su identidad. ¿Podría confirmarme su nombre completo, por favor?", "للأمان، أحتاج التحقق من هويتك. هل يمكنك تأكيد اسمك الكامل من فضلك؟", "للأمان، محتاج أتأكد من هويتك. ممكن تأكد لي اسمك الكامل؟", "cc-u1-l2-agente-1"),
    ("Claro. Lucía Ferrer.", "بالتأكيد. لوسيا فيرير.", "أكيد. لوسيا فيرير.", "cc-u1-l2-cliente-2"),
  ]),
  [
    ex("cc_u1_6_verify", "word_choice", "أي طلب تحقّق مقبول ومهني؟",
       ["reading", "speaking"], 2, options=[
         opt("cc_u1_6_a", "¿Podría confirmarme su nombre completo y los cuatro últimos dígitos del pedido?", "هل يمكنك تأكيد اسمك الكامل وآخر أربعة أرقام من الطلب؟", True),
         opt("cc_u1_6_b", "Deme su contraseña para ver el pedido.", "أعطني كلمة المرور لرؤية الطلب.", False, "طلب كلمة المرور ممنوع مهنيًا، ويتيح انتحال الهوية."),
         opt("cc_u1_6_c", "¿Quién es usted?", "من أنت؟", False, "حادّة، ولا تطلب بيانات محددة قابلة للتحقق.")],
       answerKey={"correctOptionIds": ["cc_u1_6_a"]},
       explanationAr="التحقق المهني يطلب بيانات جزئية محددة وبصيغة مهذبة. لا تُطلب كلمة المرور أبدًا، ولا يُفترض الاسم من الصوت.",
       errorFeedback={"cc_u1_6_b": "طلب كلمة المرور مخالفة صريحة للأمان.",
                      "cc_u1_6_c": "حدّد البيانات المطلوبة بصيغة لبقة."},
       targetVocab=["verificar", "identidad"]),

    ex("cc_u1_7_privacy", "review_common_errors", "أي عبارة تشرح للعميل لماذا لا تحتاج كلمة المرور؟",
       ["reading", "speaking"], 3, options=[
         opt("cc_u1_7_a", "No necesito su contraseña; solo confirmar dos datos de su cuenta.", "لا أحتاج كلمة مرورك؛ فقط تأكيد بياناتين من حسابك.", True),
         opt("cc_u1_7_b", "Dígame la contraseña, es más rápido.", "أعطني كلمة المرور، أسرع.", False, "أسرع نعم، لكنها ممنوعة وتُعرّض العميل للخطر."),
         opt("cc_u1_7_c", "Su contraseña no es importante.", "كلمة مرورك غير مهمة.", False, "خطأ مفهومي: هي مهمة جدًا، ولهذا لا تُطلب على الهاتف.")],
       answerKey={"correctOptionIds": ["cc_u1_7_a"]},
       explanationAr="الصياغة الصحيحة تطمئن العميل وتحدد البديل الآمن: تأكيد بيانات جزئية بدل كلمة المرور.",
       errorFeedback={"cc_u1_7_b": "الأمان أهم من السرعة.",
                      "cc_u1_7_c": "قل إنها مهمة ولذلك لا نطلبها."},
       targetVocab=["identidad"]),

    ex("cc_u1_8_fill", "fill_blank", "أكمل صيغة الطلب المهذب للتأكيد.",
       ["grammar", "writing"], 2,
       stemEs="¿Podría ____ su nombre completo, por favor?", stemAr="هل يمكنك تأكيد اسمك الكامل من فضلك؟",
       answerKey={"accepted": ["confirmarme", "confirmar"], "caseSensitive": False},
       explanationAr="condicional + مصدر: ¿Podría confirmarme…? و«confirmar» وحدها مقبولة بلا ضمير المفعول.",
       errorFeedback={"confirma": "بعد ¿Podría يأتي المصدر.", "confirmo": "المطلوب من العميل التأكيد لا من الموظف."},
       targetVocab=["verificar"]),

    ex("cc_u1_9_note", "translate_short", "ترجم إلى الإسبانية.",
       ["writing", "grammar"], 3, stemAr="سأسجّل رقم تواصلك وأتابع طلبك.", stemEs="",
       answerKey={"accepted": ["Voy a anotar su número de contacto y gestionar su pedido.", "Voy a anotar su número de contacto y voy a gestionar su pedido.", "Anotaré su número de contacto y gestionaré su pedido."], "caseSensitive": False, "ignorePunctuation": True},
       explanationAr="المستقبل القريب «voy a + مصدر» أكثر شيوعًا في المكالمات من المستقبل البسيط، وكلاهما صحيح.",
       errorFeedback={"Voy a anotar su número y gestiono su pedido.": "وحّد الزمن: voy a anotar… y gestionar.",
                      "Voy anotar su número.": "ناقص «a»: voy a anotar."},
       targetVocab=["anotar", "gestionar"]),
  ],
  "درس الكول سنتر 2/4. يحتاج مراجعة بشرية للتأكد من مطابقة إجراءات التحقق لسياسة شركة حقيقية (المثال تعليمي عام)."))

L.append(lesson(
  "cc-u1-hold-transfer", "التعليق والتحويل بلباقة",
  "أن يطلب المتعلم من العميل الانتظار أو يحوّله إلى زميل، مع شرح السبب وتقدير الوقت، والعودة بالشكر والملخص.",
  12, ["transferir", "compañero", "plazo"], ["comprobar", "pedido", "cliente"],
  ["¿Me permite un momento, por favor?", "Le transfiero con mi compañero.", "Gracias por esperar."],
  ["pedir-espera", "transferencia-de-mcacion"],
  scen("تحتاج إلى التحقق من النظام ثم تحويل العميل إلى قسم الشحن.", "مركز اتصال، أثناء مكالمة (بيانات وهمية)", [
    ("¿Me permite un momento, por favor? Voy a comprobar el estado del envío.", "هل تسمح لي بلحظة من فضلك؟ سأتحقق من حالة الشحنة.", "تسمح لي لحظة لو سمحت؟ هتأكد من حالة الشحنة.", "cc-u1-l3-agente-1"),
    ("Sí, pero no tarde, por favor.", "نعم، لكن لا تتأخر من فضلك.", "أيوة، بس متتأخرش لو سمحت.", "cc-u1-l3-cliente-1"),
    ("Gracias por esperar. Le transfiero con mi compañera del departamento de envíos.", "شكرًا على الانتظار. سأحوّلك إلى زميلتي في قسم الشحن.", "شكرًا على استنائك. هحوّلك لزميلتي في قسم الشحن.", "cc-u1-l3-agente-2"),
  ]),
  [
    ex("cc_u1_10_hold", "choose_reply", "تحتاج وقتًا للتحقق. اختر الصيغة المهنية.",
       ["speaking", "reading"], 2,
       stemEs="— Quiero saber el estado de mi pedido ahora.", stemAr="— أريد معرفة حالة طلبي الآن.",
       options=[opt("cc_u1_10_a", "Por supuesto. ¿Me permite un momento, por favor? Voy a comprobarlo.", "بالتأكيد. هل تسمح لي بلحظة؟ سأتحقق منه.", True),
                opt("cc_u1_10_b", "Espere.", "انتظر.", False, "أمر جاف بلا تحديد مدة أو سبب."),
                opt("cc_u1_10_c", "No puedo ahora.", "لا أستطيع الآن.", False, "رفض بلا حل أو بديل.")],
       answerKey={"correctOptionIds": ["cc_u1_10_a"]},
       explanationAr="طلب الانتظار يشرح السبب ويحدد المهمة: ¿Me permite un momento? Voy a comprobarlo.",
       errorFeedback={"cc_u1_10_b": "أضف سببًا ومدة: «Voy a comprobar…».", "cc_u1_10_c": "قدّم بديلًا أو وقتًا متوقعًا."},
       targetVocab=["comprobar"]),

    ex("cc_u1_11_transfer", "fill_blank", "أكمل فعل التحويل مع usted.",
       ["grammar", "writing"], 2,
       stemEs="Le ____ con mi compañera del departamento de envíos.",
       stemAr="سأحوّلك إلى زميلتي في قسم الشحن.",
       answerKey={"accepted": ["transfiero", "paso"], "caseSensitive": False},
       explanationAr="«Le transfiero con…» أو «Le paso con…» تعبيران مهنيان ثابتان. الفاعل أنا ⇒ transfiero/paso.",
       errorFeedback={"transfiero a": "لا نضيف «a» قبل الشخص بعد «con» في هذا التعبير.",
                      "transfiere": "«transfiere» للغائب؛ المتحدث أنا ⇒ transfiero."},
       targetVocab=["transferir", "compañero"]),

    ex("cc_u1_12_afterhold", "word_choice", "بعد الانتظار، أي عبارة تفتتح عودتك؟",
       ["reading", "speaking"], 2, options=[
         opt("cc_u1_12_a", "Gracias por esperar. He comprobado el pedido y sale mañana.", "شكرًا على الانتظار. تحققت من الطلب وسيخرج غدًا.", True),
         opt("cc_u1_12_b", "Ya está.", "انتهى.", False, "مبتورة وتنتهك توقع العميل بشرح."),
         opt("cc_u1_12_c", "¿Qué quería usted?", "ماذا أردت؟", False, "تُعامِل العميل كأنه مبتدئ، وتنسى ما قاله.")],
       answerKey={"correctOptionIds": ["cc_u1_12_a"]},
       explanationAr="قاعدة العودة: شكر على الانتظار + ملخص سريع + نتيجة + خطوة تالية.",
       errorFeedback={"cc_u1_12_b": "أضف النتيجة والخطوة التالية.", "cc_u1_12_c": "لا تعِد السؤال عن طلب سبق ذكره."},
       targetVocab=["plazo"]),

    ex("cc_u1_13_phone", "phone_call_response",
       "استمع/اقرأ حالة العميل ثم سجّل ردّك. تمرين مشاركة لا يُصحَّح آليًا.",
       ["speaking", "listening"], 3,
       contextAr="العميل يريد التحويل الآن، وزميلك غير متاح قبل عشر دقائق.",
       stemEs="Cliente: No, no quiero esperar diez minutos. Transférieme ahora.",
       answerKey={
                  "modelAnswer": "Entiendo su prisa. Mi compañera está en otra llamada y estará disponible en diez minutos. ¿Prefiere que le llame ella o que anote su número y le devolvamos la llamada?",
                  "acceptableVariants": [
                    "Comprendo su urgencia. En este momento no es posible la transferencia; puedo anotar su número y llamarle en diez minutos.",
                    "Disculpe la espera. Voy a anotar su caso para que mi compañera le llame en cuanto termine."]},
       explanationAr="لا نَعِد بما لا نملكه. نعطي بديلين واضحين: اتصال من الزميلة أو معاودة الاتصال، مع تسجيل الرقم (بموافقة العميل).",
       scoring=RUBRIC_PHONE,
       targetVocab=["transferir", "compañero"]),
  ],
  "درس الكول سنتر 3/4. يحتاج مراجعة بشرية لأزمنة الانتظار الواقعية وسياسة معاودة الاتصال."))

L.append(lesson(
  "cc-u1-roleplay", "محاكاة مكالمة كاملة",
  "أن يدير المتعلم مكالمة شكوى كاملة: افتتاح، تحقق، تشخيص، حل أو بديل، إغلاق — بلا كشف بيانات حساسة وبلا وعود غير قابلة للتنفيذ.",
  15, ["incidencia", "reclamación", "reembolso", "devolución", "importe"], ["pedido", "envío", "entrega", "plazo"],
  ["Le atiende…", "Voy a abrir una incidencia.", "¿Hay algo más en lo que pueda ayudarle?"],
  ["estructura-de-mcacion", "manejo-de-reclamaciones"],
  scen("محاكاة كاملة: عميل يطلب استرداد مبلغ لطلب وصل متأخرًا وتالفًا. بيانات وهمية.", "مركز اتصال — محاكاة تدريبية (بيانات خيالية)", [
    ("Buenos días, llamo por el pedido 48219. Llegó tarde y la caja está rota.", "صباح الخير، أتصل بخصوص الطلب 48219. وصل متأخرًا والعلبة مكسورة.", "صباح الخير، بخصوص الأوردر 48219. وصل متأخر والعلبة مكسورة.", "cc-u1-l4-cliente-1"),
    ("Buenos días, le atiende Omar. Lamento lo ocurrido. ¿Podría confirmarme su nombre completo, por favor?", "صباح الخير، يخدمك عمر. أعتذر عمّا حدث. هل يمكنك تأكيد اسمك الكامل؟", "صباح الخير، معاك عمر. معلش على اللي حصل. ممكن تأكد اسمك الكامل؟", "cc-u1-l4-agente-1"),
    ("Lucía Ferrer. ¿Puedo pedir un reembolso?", "لوسيا فيرير. هل أستطيع طلب استرداد المبلغ؟", "لوسيا فيرير. ممكن أطلب استرداد الفلوس؟", "cc-u1-l4-cliente-2"),
    ("Sí. Voy a abrir una incidencia y tramitar el reembolso del importe total. Recibirá un correo en 24 horas.", "نعم. سأفتح بلاغًا وأتولّى استرداد المبلغ الإجمالي. ستتلقى بريدًا خلال 24 ساعة.", "أيوة. هفتح بلاغ وهعمل استرداد المبلغ كله. هيوصلك إيميل خلال 24 ساعة.", "cc-u1-l4-agente-2"),
  ]),
  [
    ex("cc_u1_14_issue", "word_choice", "أي تعبير يفتح بلاغ المشكلة رسميًا؟",
       ["reading", "vocabulary"], 2, options=[
         opt("cc_u1_14_a", "Voy a abrir una incidencia.", "سأفتح بلاغ مشكلة.", True),
         opt("cc_u1_14_b", "Voy a abrir una reclamación de dinero.", "سأفتح شكوى مال.", False, "التركيب غير صحيح؛ «reclamación» تُقدَّم لا تُفتح، ولا «reclamación de dinero»."),
         opt("cc_u1_14_c", "Voy a hacer un problema.", "سأصنع مشكلة.", False, "المعنى معكوس تمامًا.")],
       answerKey={"correctOptionIds": ["cc_u1_14_a"]},
       explanationAr="«abrir una incidencia» = تسجيل بلاغ فني/خدمي. و«presentar una reclamación» = تقديم شكوى رسمية. لكلٍّ موضعه.",
       errorFeedback={"cc_u1_14_b": "الشكوى تُقدَّم (presentar)، والبلاغ يُفتح (abrir).",
                      "cc_u1_14_c": "«hacer un problema» ليست تركيبًا مهنيًا."},
       targetVocab=["incidencia", "reclamación"]),

    ex("cc_u1_15_refund", "fill_blank", "أكمل: استرداد المبلغ الإجمالي.",
       ["writing", "vocabulary"], 2,
       stemEs="Voy a tramitar el ____ del importe total.", stemAr="سأتولّى استرداد المبلغ الإجمالي.",
       answerKey={"accepted": ["reembolso"], "caseSensitive": False},
       explanationAr="tramitar = يتولّى إجراءً. وإعادة المال = reembolso، أما إعادة المنتج = devolución.",
       errorFeedback={"devolución": "إعادة المنتج devolución؛ إعادة المال reembolso.",
                      "pago": "pago دفع لا استرداد."},
       targetVocab=["reembolso", "importe"]),

    ex("cc_u1_16_structure", "dialogue_order", "رتّب مراحل المكالمة المهنية.",
       ["reading", "writing"], 3,
       items=[{"id": "cc_u1_s1", "kind": "token", "text": "Buenos días, le atiende Omar. ¿En qué puedo ayudarle?"},
              {"id": "cc_u1_s2", "kind": "token", "text": "Entiendo su molestia. ¿Podría confirmarme su nombre completo?"},
              {"id": "cc_u1_s3", "kind": "token", "text": "Voy a comprobar el pedido. ¿Me permite un momento?"},
              {"id": "cc_u1_s4", "kind": "token", "text": "Gracias por esperar. Vamos a tramitar el reembolso."},
              {"id": "cc_u1_s5", "kind": "token", "text": "¿Hay algo más en lo que pueda ayudarle? Gracias por su llamada."}],
       answerKey={"accepted": ["Buenos días, le atiende Omar. ¿En qué puedo ayudarle? Entiendo su molestia. ¿Podría confirmarme su nombre completo? Voy a comprobar el pedido. ¿Me permite un momento? Gracias por esperar. Vamos a tramitar el reembolso. ¿Hay algo más en lo que pueda ayudarle? Gracias por su llamada."]},
       explanationAr="البنية الثابتة: تحية وتقديم ← تعاطف وتحقق ← فحص ← نتيجة ← إغلاق. أي إعادة ترتيب تُربك العميل.",
       errorFeedback={"order": "البداية دائمًا بالتحية، والنهاية دائمًا بالإغلاق."},
       targetVocab=["incidencia"]),

    ex("cc_u1_17_roleplay", "roleplay_simulation",
       "محاكاة كاملة (غير مُقيَّمة آليًا): أنت الموظف. العميل يطلب استردادًا لطلب متأخر وتالف. أدر المكالمة ثم قيّم نفسك.",
       ["speaking", "listening"], 4,
       contextAr="بيانات وهمية للتدريب فقط: العميل «Lucía Ferrer»، رقم الطلب 48219، الطلب متأخر ثلاثة أيام، العلبة تالفة. لا بيانات حقيقية ولا يُخزَّن أي صوت.",
       stemEs="Cliente: Llevo tres días esperando y la caja llegó rota. Quiero el reembolso completo.",
       answerKey={
                  "modelScript": [
                    "— Buenos días, le atiende Omar de Atención al Cliente. ¿En qué puedo ayudarle?",
                    "— Lamento lo ocurrido. ¿Podría confirmarme su nombre completo y el número de pedido, por favor?",
                    "— Gracias. ¿Me permite un momento? Voy a comprobar el estado del envío.",
                    "— Le confirmo: el pedido salió con retraso y la incidencia está registrada. Vamos a tramitar el reembolso del importe total.",
                    "— Recibirá un correo de confirmación en 24 horas. ¿Hay algo más en lo que pueda ayudarle? Gracias por su llamada."
                  ],
                  "acceptableVariants": ["Ofrecer sustitución sin coste en lugar del reembolso, si el cliente prefiere."]},
       explanationAr="لا تعِد بما لا تملك: قل «24 horas» فقط إن كانت سياستك تسمح. لا تطلب كلمة المرور. لا تُقيَّم المحاكاة آليًا؛ قيّم نفسك بمعايير التقييم.",
       scoring=RUBRIC_PHONE,
       targetVocab=["reembolso", "incidencia", "pedido"]),

    ex("cc_u1_18_closing", "choose_reply", "اختر الإغلاق المهني الصحيح.",
       ["speaking", "reading"], 2,
       stemEs="— Vale, gracias. Eso es todo.", stemAr="— حسنًا، شكرًا. هذا كل شيء.",
       options=[opt("cc_u1_18_a", "¿Hay algo más en lo que pueda ayudarle? Gracias por su llamada. Que tenga un buen día.", "هل هناك شيء آخر أساعدك به؟ شكرًا على اتصالك. أتمنى لك يومًا طيبًا.", True),
                opt("cc_u1_18_b", "Ya está, adiós.", "انتهى، وداعًا.", False, "مبتور وغير مهني."),
                opt("cc_u1_18_c", "Vale, vale, vale.", "تمام تمام تمام.", False, "عامية متكررة لا تصلح إغلاقًا مهنيًا.")],
       answerKey={"correctOptionIds": ["cc_u1_18_a"]},
       explanationAr="الإغلاق المهني: سؤال عن أي حاجة أخرى + شكر + تحية ختامية.",
       errorFeedback={"cc_u1_18_b": "أضف سؤالًا ختاميًا وشكرًا.", "cc_u1_18_c": "استخدم صيغة مهنية."},
       targetVocab=["cliente"]),
  ],
  "درس الكول سنتر 4/4 (محاكاة). يحتاج مراجعة بشرية من مدرّب خدمة عملاء، وتأكيد أن بيانات المحاكاة وهمية وأنها غير مُقيَّمة آليًا."))

for item in L:
    json.dump(item, open(os.path.join(OUT, f"lesson-{item['lesson']['slug']}.json"), 'w'), ensure_ascii=False, indent=2)

json.dump({"schemaVersion": "1.0.0", "programs": [{
  "slug": "callcenter", "kind": "path", "titleAr": "مسار الكول سنتر", "levelCode": "B1", "category": "callcenter",
  "objectiveAr": "تدريب مهني على مكالمات خدمة العملاء بالإسبانية بسيناريوهات وبيانات وهمية، مع وعي صريح بحدود التدريب.",
  "units": [{"slug": "cc-u1-opening-verification", "levelCode": "B1", "titleAr": "الافتتاح والتحقق من الهوية",
             "sortOrder": 1, "status": "draft",
             "lessons": ["cc-u1-opening", "cc-u1-verification", "cc-u1-hold-transfer", "cc-u1-roleplay"],
             "vocabularyBundles": ["cc-shared"]}]}]},
  open(os.path.join(OUT, 'paths.json'), 'w'), ensure_ascii=False, indent=2)
json.dump(PACK, open(os.path.join(OUT, 'vocab-cc-shared.json'), 'w'), ensure_ascii=False, indent=2)
print('callcenter:', len(L), 'lessons,', len(CC_ENTRIES), 'entries')
