# -*- coding: utf-8 -*-
"""الدرس 4 من وحدة A1 الأولى + حزمة مفردات الجنسيات."""
import json, os
OUT = 'content/drafts/a1'

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

def entry(head, norm, pos, gender, ipa, hint, rank, msa, eg, gloss, ex_es, ex_ar, ex_eg, usage, err, tags, plural=None):
    return {"headword": head, "normalized": norm, "kind": "word", "pos": pos, "gender": gender, "plural": plural,
            "level": "A1", "register": "neutral", "ipa": ipa, "pronunciationHintAr": hint, "internalRank": rank,
            "tags": tags + ["A1", "u3-nacionalidades"],
            "senses": [{"senseNo": 1, "meaningArFusha": msa, "meaningArEg": eg, "glossEs": gloss,
                        "exampleEs": ex_es, "exampleAr": ex_ar, "exampleArEg": ex_eg,
                        "usageNoteAr": usage, "commonErrorAr": err}],
            "examples": [{"es": ex_es, "ar": ex_ar, "arEg": ex_eg}]}

PACK = {
  "schemaVersion": "1.0.0",
  "bundleSlug": "a1-u3-nacionalidades",
  "pronunciationNoteAr": "النقل بالحروف العربية تقريب فقط. راعِ أن الحرف h صامت دائمًا، وأن j تُنطق قريبة من الخاء، وأن الألف الممدودة في alemán تحمل نبرًا في آخر الكلمة.",
  "source": {"title": "مفردات الجنسيات — إعداد داخلي لمراجعة بشرية قبل أي نشر", "url": "", "license": "internal-draft",
             "accessedAt": "2026-10-21",
             "rankingNote": "internalRank هنا لسَلسَلة التدريس داخل هذه الوحدة فقط، وليس ادعاءً بأن الكلمة من الأكثر شيوعًا في الإسبانية."},
  "entries": [
    entry("egipcia", "egipcia", "adj", "f", "/eˈxipθja/", "إخيبثيا (إسبانيا) — j خاء خفيفة", 1,
          "مصرية (صفة المؤنث)", "مصرية", "nacionalidad femenina de Egipto",
          "Nour es egipcia.", "نور مصرية.", "نور مصرية.",
          "المذكر «egipcio» والمؤنث «egipcia». الصفة تتبع الشخص الموصوف.",
          "لا تقل «Nour es egipcio» عن امرأة؛ الصحيح egipcia.", ["جنسيات"]),
    entry("española", "española", "adj", "f", "/espaˈɲola/", "إسبانيُولا — ñ نون مع ياء", 2,
          "إسبانية (صفة المؤنث)", "إسبانية", "nacionalidad femenina de España",
          "Marta es española.", "مارتا إسبانية.", "مارتا إسبانية.",
          "المذكر «español» بلا علامة، والمؤنث «española» بزيادة a. لاحظ أن حرف o في español يحمل نبرًا.",
          "«Ella es español» خطأ شائع: المؤنث يحتاج española.", ["جنسيات"]),
    entry("Francia", "francia", "noun", "f", "/ˈfɾanθja/", "فرانثيا", 3,
          "فرنسا (اسم البلد)", "فرنسا", "nombre del país",
          "París está en Francia.", "باريس في فرنسا.", "باريس في فرنسا.",
          "أسماء البلدان تُكتب بحرف كبير. فرنسا مؤنثة: «Francia es bonita».",
          "لا تخلط البلد «Francia» بالجنسية «francés/francesa».", ["بلدان"]),
    entry("francés", "francés", "adj", "m", "/fɾanˈθes/", "فرانثِس — النبر في الآخر", 4,
          "فرنسي (صفة المذكر)", "فرنسي", "nacionalidad masculina de Francia",
          "Karim es francés.", "كريم فرنسي.", "كريم فرنسي.",
          "الصفات المنتهية بحرف ساكن تُضاف لها a للمؤنث: francés ⇒ francesa (بلا نبر).",
          "«Karim es Francia» خطأ: البلد ليس جنسية.", ["جنسيات"]),
    entry("francesa", "francesa", "adj", "f", "/fɾanˈθesa/", "فرانثيسا", 5,
          "فرنسية (صفة المؤنث)", "فرنسية", "nacionalidad femenina de Francia",
          "Sara es francesa.", "سارة فرنسية.", "سارة فرنسية.",
          "لاحظ اختفاء النبر المكتوب عند إضافة a: francés ⇒ francesa.",
          "لا تكتب «francésa» بنبر؛ الصيغة المؤنثة بلا نبر.", ["جنسيات"]),
    entry("Italia", "italia", "noun", "f", "/iˈtalja/", "إيتاليا", 6,
          "إيطاليا (اسم البلد)", "إيطاليا", "nombre del país",
          "Roma está en Italia.", "روما في إيطاليا.", "روما في إيطاليا.",
          "يُستخدم معها حرف الجر «en» للمكان و«de» للأصل: soy de Italia.",
          "«soy de Italiano» خطأ؛ البلد Italia والجنسية italiano.", ["بلدان"]),
    entry("italiano", "italiano", "adj", "m", "/itaˈljano/", "إيتاليانو", 7,
          "إيطالي (صفة المذكر)", "إيطالي", "nacionalidad masculina de Italia",
          "Marco es italiano.", "ماركو إيطالي.", "ماركو إيطالي.",
          "الصفات المنتهية بـ-o تصير -a للمؤنث: italiano ⇒ italiana.",
          "الصفة تتبع الموصوف لا المتحدث: «Marta es italiano» غير صحيحة.", ["جنسيات"]),
    entry("italiana", "italiana", "adj", "f", "/itaˈljana/", "إيتاليانا", 8,
          "إيطالية (صفة المؤنث)", "إيطالية", "nacionalidad femenina de Italia",
          "Sara es italiana.", "سارة إيطالية.", "سارة إيطالية.",
          "نفس قاعدة italiano + a.",
          "لا تقل «Sara es italiano» عند وصف امرأة.", ["جنسيات"]),
    entry("Marruecos", "marruecos", "noun", "m", "/maˈrwekos/", "مَرّويكوس — rr مشددة", 9,
          "المغرب (اسم البلد)", "المغرب", "nombre del país",
          "Marruecos está en el norte de África.", "المغرب في شمال أفريقيا.", "المغرب في شمال أفريقيا.",
          "اسم البلد فقط؛ الجنسية «marroquí» لا تتغير بين المذكر والمؤنث.",
          "«Soy de marroquí» خطأ؛ الصواب «Soy marroquí» أو «Soy de Marruecos».", ["بلدان"]),
    entry("marroquí", "marroquí", "adj", "mf", "/maroˈki/", "مَرّوكي", 10,
          "مغربي/مغربية (صفة لا تتغير)", "مغربي/مغربية", "nacionalidad invariable en género",
          "Yassine es marroquí. Salma es marroquí.", "ياسين مغربي. سلمى مغربية.", "ياسين مغربي. سلمى مغربية.",
          "الصفات المنتهية بـ-í لا تتغير بين المذكر والمؤنث.",
          "لا تضف a: «marroquía» غير موجودة.", ["جنسيات"]),
    entry("Alemania", "alemania", "noun", "f", "/aleˈmanja/", "أليمانيا", 11,
          "ألمانيا (اسم البلد)", "ألمانيا", "nombre del país",
          "Berlín está en Alemania.", "برلين في ألمانيا.", "برلين في ألمانيا.",
          "البلد Alemania والجنسية alemán/alemana.",
          "لا تقل «soy de alemán»؛ الأصل «soy de Alemania» والجنسية «soy alemán».", ["بلدان"]),
    entry("alemán", "alemán", "adj", "m", "/aleˈman/", "أليمان — النبر في الآخر", 12,
          "ألماني (صفة المذكر)", "ألماني", "nacionalidad masculina de Alemania",
          "Hans es alemán.", "هانس ألماني.", "هانس ألماني.",
          "عند إضافة a للمؤنث يسقط النبر المكتوب: alemán ⇒ alemana.",
          "«Ella es alemán» غير صحيحة؛ المؤنث alemana.", ["جنسيات"]),
    entry("alemana", "alemana", "adj", "f", "/aleˈmana/", "أليمانا", 13,
          "ألمانية (صفة المؤنث)", "ألمانية", "nacionalidad femenina de Alemania",
          "Anna es alemana.", "آنا ألمانية.", "آنا ألمانية.",
          "نفس قاعدة alemana بلا نبر مكتوب.",
          "لا تكتب «alemána».", ["جنسيات"]),
  ],
}

L4 = {
  "schemaVersion": "1.0.0",
  "lesson": {
    "slug": "a1-nacionalidades",
    "titleAr": "الجنسيات: كيف تُطابق الصفة جنس صاحبها",
    "level": "A1",
    "programSlug": "main-track",
    "unitSlug": "a1-u1-origen",
    "objectiveAr": ("أن يميّز المتعلم بين اسم البلد والجنسية (Francia / francés)، ويطابق صفة الجنسية مع جنس الشخص "
                    "(egipcio/egipcia, alemán/alemana)، ويعرف أن بعض الجنسيات لا تتغير (marroquí)."),
    "estimatedMinutes": 12,
    "skills": ["listening", "reading", "speaking", "writing", "grammar", "vocabulary"],
    "newVocabulary": ["egipcia", "española", "francés", "francesa", "alemán", "alemana", "italiano", "marroquí", "Francia", "Italia"],
    "reviewVocabulary": ["ser", "de", "egipcio", "español", "Egipto", "España"],
    "targetStructures": ["ser + جنسية (مطابقة الجنس)", "ser de + بلد", "الجنسيات المنتهية بـ-í لا تتغير"],
    "grammarTopics": ["concordancia-genero-nacionalidad", "paises-vs-nacionalidades"],
    "scenarios": [{
      "contextAr": "تعرّف في مؤتمر على ثلاثة أشخاص من بلدان مختلفة، وكل واحد يعرّف بنفسه.",
      "settingAr": "مؤتمر طلابي، استراحة قهوة",
      "lines": [
        {"es": "Hola, soy Anna. Soy alemana, de Múnich.", "ar": "مرحبًا، أنا آنا. أنا ألمانية، من ميونخ.", "arEg": "أهلًا، أنا آنا. أنا ألمانية، من ميونخ.", "audioKey": "pending/a1-nac-anna-1"},
        {"es": "Encantado. Yo soy Marco, italiano de Roma.", "ar": "تشرفنا. أنا ماركو، إيطالي من روما.", "arEg": "تشرفنا. أنا ماركو، إيطالي من روما.", "audioKey": "pending/a1-nac-marco-1"},
        {"es": "Y yo soy Salma. Soy marroquí, de Rabat.", "ar": "وأنا سلمى. أنا مغربية، من الرباط.", "arEg": "وأنا سلمى. أنا مغربية، من الرباط.", "audioKey": "pending/a1-nac-salma-1"},
        {"es": "¡Qué bien! Yo soy egipcio, de El Cairo.", "ar": "ما أجمل هذا! أنا مصري، من القاهرة.", "arEg": "جامد! أنا مصري، من القاهرة.", "audioKey": "pending/a1-nac-omar-1"}
      ]
    }],
    "mastery": {"minAccuracy": 70, "minCorrectExercises": 6, "requiredExerciseTypes": ["word_choice", "fill_blank", "find_fix_error"]},
    "unlock": {"type": "sequential"},
    "offlinePriority": 2,
    "exercises": [
      ex("a1_nac_1_fem", "word_choice",
         "أنتِ امرأة من مصر. أي جملة صحيحة؟",
         ["grammar", "vocabulary"], 1,
         options=[
           opt("a1_nac_1_a", "Soy egipcia.", "أنا مصرية.", True),
           opt("a1_nac_1_b", "Soy egipcio.", "أنا مصري. (مذكر)", False, "«egipcio» للمذكر؛ المتحدثة امرأة."),
           opt("a1_nac_1_c", "Soy Egipto.", "أنا مصر.", False, "Egipto بلد لا جنسية: نقول «soy de Egipto»."),
           opt("a1_nac_1_d", "Soy de egipcia.", "أنا من مصرية.", False, "خلط بين حرف الجر والصفة: «soy de Egipto» أو «soy egipcia»."),
         ],
         answerKey={"correctOptionIds": ["a1_nac_1_a"]},
         explanationAr="الجنسية صفة تتبع جنس صاحبها: الرجل «egipcio»، المرأة «egipcia». أما البلد فيأتي بعد «de»: soy de Egipto.",
         errorFeedback={
           "a1_nac_1_b": "الصفة تتبعك أنتِ: امرأة ⇒ egipcia.",
           "a1_nac_1_c": "Egipto بلد لا صفة؛ الصواب soy de Egipto أو soy egipcia.",
           "a1_nac_1_d": "لا نجمع «de» مع الصفة؛ إما البلد بعد de أو الجنسية وحدها."},
         targetVocab=["egipcia", "ser"]),

      ex("a1_nac_2_fill", "fill_blank",
         "أكمل بصفة الجنسية المناسبة للمؤنث.",
         ["grammar", "writing"], 2,
         stemEs="Nour es de Francia. Es ____.",
         stemAr="نور من فرنسا. هي فرنسية.",
         answerKey={"accepted": ["francesa"], "caseSensitive": False},
         explanationAr="البلد «Francia» والجنسية «francés» للمذكر و«francesa» للمؤنث. لاحظ اختفاء النبر المكتوب في المؤنث: francés ⇒ francesa.",
         errorFeedback={
           "francés": "«francés» للمذكر؛ نور امرأة ⇒ francesa.",
           "france": "لا نستخدم اسم البلد الإنجليزي؛ الجنسية بالإسبانية francesa.",
           "francia": "Francia بلد لا صفة؛ الصفة francesa."},
         targetVocab=["francesa", "Francia"]),

      ex("a1_nac_3_masc", "word_choice",
         "كريم من ألمانيا. أي جملة صحيحة؟",
         ["grammar", "vocabulary"], 2,
         options=[
           opt("a1_nac_3_a", "Karim es alemán.", "كريم ألماني.", True),
           opt("a1_nac_3_b", "Karim es alemana.", "كريم ألمانية.", False, "«alemana» للمؤنث؛ كريم رجل."),
           opt("a1_nac_3_c", "Karim es Alemania.", "كريم ألمانيا.", False, "Alemania بلد لا جنسية."),
           opt("a1_nac_3_d", "Karim es alemanes.", "كريم ألمان.", False, "«alemanes» جمع؛ المفرد المذكر alemán."),
         ],
         answerKey={"correctOptionIds": ["a1_nac_3_a"]},
         explanationAr="alemán للمذكر المفرد، alemana للمؤنث، alemanes للجمع المذكر. النبر في alemán على المقطع الأخير ويسقط عند إضافة a.",
         errorFeedback={
           "a1_nac_3_b": "المؤنث alemana لا يصلح لرجل.",
           "a1_nac_3_c": "نقول «es de Alemania» أو «es alemán»، لا «es Alemania».",
           "a1_nac_3_d": "الجمع للحديث عن أكثر من شخص؛ هنا مفرد."},
         targetVocab=["alemán", "ser"]),

      ex("a1_nac_4_fix", "find_fix_error",
         "في الجملة خطأ في مطابقة الجنسية. اختر التصحيح.",
         ["grammar", "reading"], 2,
         stemEs="Marta es español.",
         options=[
           opt("a1_nac_4_a", "Marta es española.", "مارتا إسبانية.", True),
           opt("a1_nac_4_b", "Marta es España.", "مارتا إسبانيا.", False, "اسم البلد لا يُستخدم صفة."),
           opt("a1_nac_4_c", "Marta es españolas.", "مارتا إسبانيات.", False, "الجمع لا يصلح لشخص واحد."),
         ],
         answerKey={"correctOptionIds": ["a1_nac_4_a"]},
         explanationAr="«español» مذكر؛ مع امرأة نقول «española». القاعدة الأوسع: الصفة تتبع الاسم الموصوف في الجنس والعدد.",
         errorFeedback={
           "a1_nac_4_b": "الصفة española لا اسم البلد España.",
           "a1_nac_4_c": "مفرد واحد ⇒ صفة مفردة española."},
         targetVocab=["española"]),

      ex("a1_nac_5_invariable", "word_choice",
         "أي جملة صحيحة عن سلمى (مغربية)؟",
         ["grammar", "reading"], 3,
         options=[
           opt("a1_nac_5_a", "Salma es marroquí.", "سلمى مغربية.", True),
           opt("a1_nac_5_b", "Salma es marroquía.", "سلمى مغربية. (بإضافة a)", False, "الجنسيات المنتهية بـ-í لا تُضاف لها a."),
           opt("a1_nac_5_c", "Salma es de marroquí.", "سلمى من مغربية.", False, "لا نجمع de مع الصفة."),
         ],
         answerKey={"correctOptionIds": ["a1_nac_5_a"]},
         explanationAr="بعض الجنسيات لا تتغير بين المذكر والمؤنث، وأشهرها ما ينتهي بـ-í مثل marroquí، وقليل مثل «israelí». الشكل نفسه يخدم الرجل والمرأة.",
         errorFeedback={
           "a1_nac_5_b": "لا توجد صيغة «marroquía»؛ الصفة لا تتغير.",
           "a1_nac_5_c": "إما «es de Marruecos» أو «es marroquí»."},
         targetVocab=["marroquí"]),

      ex("a1_nac_6_order", "word_order",
         "رتّب الكلمات لتكوين جملة تصف شخصين.",
         ["grammar", "writing"], 3,
         items=[
           {"id": "a1_nac_t1", "kind": "token", "text": "Mi"},
           {"id": "a1_nac_t2", "kind": "token", "text": "hermano"},
           {"id": "a1_nac_t3", "kind": "token", "text": "es"},
           {"id": "a1_nac_t4", "kind": "token", "text": "italiano"},
           {"id": "a1_nac_t5", "kind": "token", "text": "y"},
           {"id": "a1_nac_t6", "kind": "token", "text": "mi"},
           {"id": "a1_nac_t7", "kind": "token", "text": "hermana"},
           {"id": "a1_nac_t8", "kind": "token", "text": "italiana"},
           {"id": "a1_nac_t9", "kind": "token", "text": "es"},
         ],
         answerKey={"accepted": ["Mi hermano es italiano y mi hermana italiana.", "Mi hermano es italiano y mi hermana es italiana."], "caseSensitive": False, "ignorePunctuation": True},
         explanationAr="«hermano» مذكر ⇒ italiano، و«hermana» مؤنث ⇒ italiana. تكرار الفعل «es» مستحسن؛ حذفه في الثانية مقبول لكنه أسلوب أعلى قليلًا.",
         errorFeedback={"order": "ابدأ «Mi hermano es italiano y mi hermana (es) italiana»."},
         targetVocab=["italiano", "ser"]),

      ex("a1_nac_7_pais", "review_common_errors",
         "أي جملة تفرّق بين البلد والجنسية بشكل صحيح؟",
         ["grammar", "reading"], 2,
         contextAr="الخطأ الأشهر: استخدام اسم البلد مكان الصفة، أو الصفة مكان البلد.",
         options=[
           opt("a1_nac_7_a", "Soy de Italia. Soy italiano.", "أنا من إيطاليا. أنا إيطالي.", True),
           opt("a1_nac_7_b", "Soy de italiano. Soy Italia.", "أنا من إيطالي. أنا إيطاليا.", False, "عكس الوظيفتين تمامًا: البلد بعد de والصفة بعد ser."),
           opt("a1_nac_7_c", "Soy italiano de Italia nacionalidad.", None, False, "تركيب لا وجود له في الإسبانية."),
         ],
         answerKey={"correctOptionIds": ["a1_nac_7_a"]},
         explanationAr="قاعدتان متكاملتان: «ser de + بلد» للأصل، و«ser + جنسية» للوصف. لا تُستبدل إحداهما بالأخرى.",
         errorFeedback={
           "a1_nac_7_b": "اقلب الترتيب: البلد يأتي بعد de، والجنسية تأتي بعد ser.",
           "a1_nac_7_c": "لا حاجة لكلمة nacionalidad؛ التركيب بسيط: soy italiano."},
         targetVocab=["Italia", "italiano", "de"]),

      ex("a1_nac_8_translate", "translate_short",
         "ترجم إلى الإسبانية.",
         ["writing", "grammar"], 3,
         stemAr="هي مصرية، من القاهرة.",
         stemEs="",
         answerKey={"accepted": ["Ella es egipcia, de El Cairo.", "Ella es egipcia, de El Cairo", "Es egipcia, de El Cairo.", "Ella es egipcia de El Cairo."], "caseSensitive": False, "ignorePunctuation": True},
         explanationAr="«هي» = Ella، والجنسية للمؤنث egipcia، ثم المكان «de El Cairo». لاحظ أن «El Cairo» يحتفظ بأداة التعريف El.",
         errorFeedback={
           "Ella es egipcio, de El Cairo.": "الجنسية تتبع «هي» ⇒ egipcia.",
           "Ella es Egipto, de El Cairo.": "Egipto بلد لا جنسية؛ الصفة egipcia."},
         targetVocab=["egipcia", "ser"]),

      ex("a1_nac_9_listen", "listen_choose",
         "استمع (أو اقرأ النص البديل) واختر جنسية المتحدثة.",
         ["listening", "reading"], 2,
         audioKey="pending/a1-nac-anna-1",
         speechEs="Hola, soy Anna. Soy alemana, de Múnich.",
         options=[
           opt("a1_nac_9_a", "alemana", "ألمانية", True),
           opt("a1_nac_9_b", "italiana", "إيطالية", False, "الجنسية الإيطالية ذُكرت في المقطع التالي لماركو لا هنا."),
           opt("a1_nac_9_c", "marroquí", "مغربية", False, "مغربية هي جنسية سلمى في الحوار."),
         ],
         answerKey={"correctOptionIds": ["a1_nac_9_a"]},
         explanationAr="قالت Anna: «Soy alemana, de Múnich» — ألمانية من ميونخ. الجنسية جاءت مؤنثة لأنها امرأة، والمدينة بعد de.",
         errorFeedback={
           "a1_nac_9_b": "Italiana جنسية ماركو (italiano)، وليست جنسية آنا.",
           "a1_nac_9_c": "marroquí جنسية سلمى."},
         targetVocab=["alemana"]),

      ex("a1_nac_10_speak", "speak_with_text",
         "انطق الجمل بصوت واضح. تمرين مشاركة لا يُصحَّح آليًا.",
         ["speaking", "pronunciation"], 2,
         stemEs="Soy egipcia, de El Cairo. Soy egipcia y hablo español.",
         stemAr="أنا مصرية، من القاهرة. أنا مصرية وأتحدث الإسبانية.",
         answerKey={"referenceAudioKey": "pending/a1-nac-10-model-1", "modelAnswer": "Soy egipcia, de El Cairo. Hablo español."},
         explanationAr="«egipcia» نبرتها على المقطع الثاني: e-GIP-cia. «español» نبرتها على الآخر: espa-ÑOL. النقل التقريبي بالعربية إرشادي فقط.",
         scoring={"mode": "rubric", "rubric": [
           {"labelAr": "نطق ñ في español", "weight": 50, "code": "pron_enie"},
           {"labelAr": "نبر eGIPcia", "weight": 50, "code": "pron_egipcia"}]},
         targetVocab=["egipcia", "española"]),
    ],
    "review": {
      "status": "draft",
      "authors": ["فريق المنهج — إعداد أصلي بمساعدة نموذج، بلا مراجعة بشرية بعد"],
      "spanishReviewer": None, "translationReviewer": None, "reviewedAt": None,
      "notes": ("درس وحدة A1 الأولى (4/4). يحتاج مراجعة إسبانية أصلية للتأكد من استعمال الجنسيات في إسبانيا "
                "(خاصة alemán/alemana وmarroquí) وتأكيد مستوى الصعوبة. كل المقاطع الصوتية pending ولم يُنتج أي ملف صوتي."),
    },
  },
}

json.dump(PACK, open(os.path.join(OUT, 'vocab-a1-u3-nacionalidades.json'), 'w'), ensure_ascii=False, indent=2)
json.dump(L4, open(os.path.join(OUT, 'lesson-a1-nacionalidades.json'), 'w'), ensure_ascii=False, indent=2)
print('written L4 + pack')
