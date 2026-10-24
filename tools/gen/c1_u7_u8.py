# -*- coding: utf-8 -*-
"""Generator for Level C1 Units 7 and 8 (8 lessons):
- Unit 7: c1-u7-complex-negotiation (4 lessons)
- Unit 8: c1-u8-advanced-writing (4 lessons)
"""
import sys
import os

from common import opt, choice_ex, fill_ex, order_ex, speak_ex, lesson_doc, review_block

# -------------------------------------------------------------
# UNIT 7: c1-u7-complex-negotiation (المفاوضات المعقدة والتحكيم الدولي)
# -------------------------------------------------------------

def make_lesson_diplomacia_multilateral():
    slug = "c1-diplomacia-multilateral"
    titleAr = "الدبلوماسية المتعددة الأطراف والبيانات المشتركة: Diplomacia multilateral"
    objAr = "أن يصيغ ويدير المتعلم مفاوضات دبلوماسية متعددة الأطراف محرراً بنود البيانات المشتركة بتوافق دولي (consenso unánime, veto, declaración conjunta, concordia)."
    
    newVocab = ["consenso", "veto", "concordia", "comunicado", "adhesión", "rigor"]
    revVocab = ["tiempo", "sociedad", "bien", "trabajo"]
    
    doc = {
        "slug": slug,
        "titleAr": titleAr,
        "level": "C1",
        "programSlug": "main-track",
        "unitSlug": "c1-u7-complex-negotiation",
        "objectiveAr": objAr,
        "estimatedMinutes": 12,
        "skills": ["grammar", "reading", "writing", "listening", "vocabulary"],
        "newVocabulary": newVocab,
        "reviewVocabulary": revVocab,
        "targetStructures": [
            "Fórmulas de mediación: apelar a la concordia y al espíritu de colaboración",
            "Gestión del bloqueo institucional: superar la amenaza de veto mediante enmiendas",
            "Adopción por consenso: consensuar el texto definitivo sin votación divisiva",
            "Redacción solemne: emitir una declaración conjunta de adhesión a los principios"
        ],
        "grammarTopics": ["lenguaje-diplomatico-c1", "negociacion-multilateral-e-internacional"],
        "scenarios": [
            {
                "contextAr": "قمة دبلوماسية طارئة لوزراء خارجية الدول الأيبيروأمريكية لصياغة إعلان مدريد للسلام والتنمية.",
                "settingAr": "قصر سانتا كروز، مقر وزارة الشؤون الخارجية، مدريد",
                "lines": [
                    {
                        "es": "A pesar de las discrepancias iniciales, las delegaciones lograron forjar un consenso unánime sobre el texto.",
                        "ar": "على الرغم من التباينات المبدئية، نجحت الوفود في بناء توافق جماعي غير منقسم حول مسودة النص.",
                        "arEg": "رغم الخلافات في الأول، الوفود قدرت توصل لإجماع كامل وتوافق حقيقي على نص البيان.",
                        "audioKey": "pending/c1-u7-dip-1"
                    },
                    {
                        "es": "El mediador apeló con vehemencia a la concordia para evitar la interposición de un veto destructivo.",
                        "ar": "ناشد الوسيط الأطراف بحرارة الاحتكام إلى روح الوفاق والوئام لتفادي استخدام حق نقض مدمر للمفاوضات.",
                        "arEg": "الوسيط شدد وناشد الكل بالوفاق وتحكيم العقل عشان نتفادى الفيتو اللي كان ممكن يفركش القعدة.",
                        "audioKey": "pending/c1-u7-dip-2"
                    },
                    {
                        "es": "El comunicado final refleja fielmente los compromisos adquiridos en materia de cooperación científica.",
                        "ar": "يعكس البيان الختامي بأمانة التعهدات المتبادلة المبرمة في مجال التعاون والبحث العلمي.",
                        "arEg": "البيان الختامي المشترك عبّر بكل دقة عن الالتزامات اللي الدول اتفقت عليها في البحث العلمي.",
                        "audioKey": "pending/c1-u7-dip-3"
                    },
                    {
                        "es": "Varios países han manifestado ya su formal adhesión a las cláusulas vinculantes del tratado.",
                        "ar": "أعلنت عدة دول بالفعل عن انضمامها الرسمي والتزامها بالبنود الملزمة لهذه المعاهدة التاريخية.",
                        "arEg": "كذا دولة أعلنت خلاص انضمامها والتزامها الرسمي والنهائي بالبنود القانونية للمعاهدة دي.",
                        "audioKey": "pending/c1-u7-dip-4"
                    }
                ]
            }
        ],
        "mastery": {
            "minAccuracy": 70,
            "minCorrectExercises": 6,
            "requiredExerciseTypes": ["listen_choose", "word_choice", "fill_blank"]
        },
        "unlock": {"type": "sequential"},
        "offlinePriority": 1,
        "review": review_block()
    }
    
    exs = [
        choice_ex(
            "ex-c1-dmu-1", "listen_choose",
            "استمع إلى المتحدث الدبلوماسي وحدد ما استطاعت الوفود تحقيقه لتجاوز الانقسام والفرقة.",
            ["listening", "vocabulary"], 1,
            "ما هي النتيجة التي أثمرت عنها المشاورات المكثفة للوفود؟",
            "A pesar de las discrepancias iniciales, las delegaciones lograron forjar un consenso unánime sobre el texto.",
            "على الرغم من التباينات المبدئية، نجحت الوفود في بناء توافق جماعي غير منقسم حول مسودة النص.",
            [
                opt("a", "Forjar un consenso unánime sobre el documento", "بناء وإبرام توافق جماعي وشامل حول الوثيقة", True),
                opt("b", "Declarar la guerra inmediata y romper relaciones", "إعلان الحرب وقطع العلاقات فوراً", False, "عكس الدبلوماسية والسلام."),
                opt("c", "Suspender el congreso sin redactar ninguna línea", "إلغاء المؤتمر دون كتابة سطر واحد", False, "الوفود نجحت في التوافق.")
            ],
            ["consenso", "rigor"],
            "تعبير «forjar un consenso» في الأدبيات الدبلوماسية يعني العمل الدؤوب لتقريب وجهات النظر وصولاً إلى صيغة يرتضيها الجميع بلا تصويت إقصائي.",
            "pending/c1-u7-dip-1",
            "A pesar de las discrepancias iniciales, las delegaciones lograron forjar un consenso unánime sobre el texto."
        ),
        choice_ex(
            "ex-c1-dmu-2", "word_choice",
            "ما معنى عبارة «apelar a la concordia» في خطاب وزير الخارجية أمام مؤتمر السلام؟",
            ["reading", "vocabulary"], 1,
            "اختر الدلالة السياسية والأخلاقية للدعوة إلى الوفاق:",
            "El presidente de la asamblea apeló a la concordia para superar el bloqueo parlamentario.",
            "ناشد رئيس الجمعية النواب الاحتكام إلى روح الوفاق والوئام لتجاوز الانسداد البرلماني الراهن.",
            [
                opt("a", "Invitar al entendimiento pacífico, la reconciliación y el acuerdo mutuo", "الدعوة إلى التفاهم السلمي والمصالحة والاتفاق المشترك", True),
                opt("b", "Amenazar con encarcelar a todos los opositores", "التهديد بحبس جميع المعارضين بالقوة", False, "سلوك قمعي استبدادي لا يسمى وفاقاً."),
                opt("c", "Pedir un aumento de sueldo para los ministros", "المطالبة بزيادة رواتب الوزراء", False, "لا علاقة له بالمبادئ الدبلوماسية.")
            ],
            ["concordia", "rigor"],
            "«La concordia» هي التوافق القلبي والعقلي وروح التآخي ونبذ الشقاق والنزاع من أجل المصلحة العليا المشتركة."
        ),
        fill_ex(
            "ex-c1-dmu-3",
            "أكمل الجملة بالحق القانوني الذي يملكه العضو لمنع تمرير أي قرار: «el derecho de ____».",
            ["vocabulary", "writing"], 2,
            "اكتب الكلمة اللاتينية الدالة على حق النقض الدبلوماسي:",
            "La resolución no pudo ser aprobada debido al ____ interpuesto por una potencia.",
            "لم يتسنَ اعتماد القرار رسمياً بسبب حق النقض (الفيتو) الذي مارسته إحدى الدول الكبرى.",
            ["veto"],
            ["veto"],
            "«El veto» هو الاعتراض الحاسم الذي يسقط مشروع القرار الدولي ولو حاز على تأييد الأغلبية في المنظمات ذات النصاب الإلزامي."
        ),
        choice_ex(
            "ex-c1-dmu-4", "word_choice",
            "ما هو الوصف الدبلوماسي لإعلان دولة ما انضمامها الرسمي والكامل لاتفاقية دولية؟",
            ["vocabulary", "reading"], 1,
            "اختر الكلمة الرسمية المعبرة عن الانضمام والمصادقة على الاتفاقية:",
            "El parlamento ratificó la formal ____ del país al tratado de no proliferación.",
            "صادق البرلمان على الانضمام الرسمي والكامل للدولة إلى معاهدة عدم الانتشار.",
            [
                opt("a", "adhesión", "الانضمام الرسمي والتصديق القانوني على المعاهدة", True),
                opt("b", "admiración", "الإعجاب العاطفي بالمعاهدة دون توقيع", False, "شعور شخصي لا يرتب أثراً قانونياً."),
                opt("c", "adversidad", "المحنة والشدائد الصعبة", False, "معنى سلبي لا علاقة له بالانضمام الدولي.")
            ],
            ["adhesión", "comunicado"],
            "في القانون الدولي «la adhesión a un tratado» هي الصيغة الرسمية التي تعلن بها دولة سيادتها التزامها الكامل ببنود معاهدة قائمة."
        ),
        order_ex(
            "ex-c1-dmu-5",
            "رتب الكلمات لبناء نداء دبلوماسي رفيع يدعو إلى الحوار وحسن النية.",
            ["grammar", "writing"], 2,
            ["Apelamos", "a", "la", "concordia", "entre", "las", "naciones"],
            "Apelamos a la concordia entre las naciones",
            "الفعل Apelamos متبوعاً بحرف الجر a والمفعول به la concordia وظرف المكان والاسم المجرور entre las naciones.",
            ["concordia"]
        ),
        speak_ex(
            "ex-c1-dmu-6",
            "انطق هذه الجملة بنبرة مبعوث أممي يلقي بياناً ختامياً رصيناً أمام كاميرات الصحافة العالمية.",
            ["speaking", "pronunciation"], 2,
            "نطق سليم مراعياً الوقار الدبلوماسي المخاطب للجمهور:",
            "Hemos alcanzado un consenso unánime y duradero.",
            "لقد توصلنا إلى توافق جماعي غير منقسم وراسخ الأركان.",
            "pending/c1-u7-dip-spk",
            ["consenso", "rigor"],
            "Hemos alcanzado un consenso unánime y duradero.",
            "احرص على سلامة نبر كلمة unánime على حرف a الأول ومد المقاطع المنبورة بهدوء يعكس الثقة والمصداقية."
        )
    ]
    return lesson_doc(doc, exs, "C1")


def make_lesson_arbitraje_comercial():
    slug = "c1-arbitraje-comercial"
    titleAr = "التحكيم التجاري الدولي وتسوية النزاعات: Arbitraje comercial y resolución de disputas"
    objAr = "أن يفهم المتعلم ويصيغ إجراءات التحكيم التجاري الدولي ومذكرات المرافعات والقرارات التحكيمية الملزمة (laudo arbitral, jurisdicción, dirimir controversias)."
    
    newVocab = ["laudo", "arbitral", "jurisdicción", "dirimir", "controversia", "rigor"]
    revVocab = ["tiempo", "sociedad", "bien", "trabajo"]
    
    doc = {
        "slug": slug,
        "titleAr": titleAr,
        "level": "C1",
        "programSlug": "main-track",
        "unitSlug": "c1-u7-complex-negotiation",
        "objectiveAr": objAr,
        "estimatedMinutes": 12,
        "skills": ["grammar", "reading", "writing", "listening", "vocabulary"],
        "newVocabulary": newVocab,
        "reviewVocabulary": revVocab,
        "targetStructures": [
            "Fórmula de sumisión expresa: someterse al arbitraje de la Cámara de Comercio",
            "La resolución definitiva: el tribunal arbitral dictó un laudo de obligado cumplimiento",
            "La delimitación competencial: determinar la jurisdicción aplicable al litigio",
            "El objeto procesal: dirimir la controversia suscitada entre las partes"
        ],
        "grammarTopics": ["arbitraje-internacional-c1", "resolucion-de-conflictos-mercantiles"],
        "scenarios": [
            {
                "contextAr": "جلسة مرافعة ختامية في محكمة التحكيم التجاري الدولي بمدريد لفض نزاع في قطاع الطاقة.",
                "settingAr": "مقر محكمة التحكيم بمدريد (Corte de Arbitraje de Madrid)",
                "lines": [
                    {
                        "es": "Las partes acordaron someterse al presente tribunal para dirimir la controversia contractual.",
                        "ar": "اتفق الطرفان على الاحتكام إلى هذه الهيئة التحكيمية للفصل وحسم النزاع والخلاف التعاقدي بينهما.",
                        "arEg": "الشركتين اتفقوا بمزاجهم يلجأوا لهيئة التحكيم دي عشان تفصل وتحل الخلاف اللي بينهم في العقد.",
                        "audioKey": "pending/c1-u7-arb-1"
                    },
                    {
                        "es": "Queda plenamente acreditada la jurisdicción de esta corte en virtud del convenio arbitral.",
                        "ar": "ثبت بما لا يدع مجالاً للشك الاختصاص القضائي لهذه المحكمة استناداً إلى اتفاقية التحكيم المبرمة.",
                        "arEg": "ثبت بالدليل القاطع إن المحكمة دي هي صاحبة الاختصاص القانوني بناء على بند التحكيم المكتوب.",
                        "audioKey": "pending/c1-u7-arb-2"
                    },
                    {
                        "es": "El colegio arbitral procederá a dictar el laudo definitivo en el plazo legal improrrogable.",
                        "ar": "ستشرع هيئة التحكيم في إصدار ونطق الحكم التحكيمي النهائي خلال الأجل القانوني غير القابل للتمديد.",
                        "arEg": "هيئة التحكيم هتصدر حكمها النهائي الملزم للطرفين في الميعاد المحدد ومن غير أي تأجيل.",
                        "audioKey": "pending/c1-u7-arb-3"
                    },
                    {
                        "es": "Dicho laudo arbitral surtirá plenos efectos de cosa juzgada para ambas corporaciones.",
                        "ar": "وسيترتب على هذا القرار التحكيمي كافة آثار وقوة الأمر المقضي به بالنسبة لكلا الشركتين.",
                        "arEg": "والقرار ده هيكون بات ونهائي وملزم للشركتين ومفيش رجوع فيه زي حكم المحكمة بالظبط.",
                        "audioKey": "pending/c1-u7-arb-4"
                    }
                ]
            }
        ],
        "mastery": {
            "minAccuracy": 70,
            "minCorrectExercises": 6,
            "requiredExerciseTypes": ["listen_choose", "word_choice", "fill_blank"]
        },
        "unlock": {"type": "sequential"},
        "offlinePriority": 1,
        "review": review_block()
    }
    
    exs = [
        choice_ex(
            "ex-c1-aco-1", "listen_choose",
            "استمع إلى نص المرافعة واكتشف المصطلح القضائي الذي يطلق على الحكم النهائي الصادر عن هيئة التحكيم.",
            ["listening", "vocabulary"], 1,
            "ماذا يسمى الحكم والقرار الصادر عن المحكمين في النزاع التجاري؟",
            "El colegio arbitral procederá a dictar el laudo definitivo en el plazo legal improrrogable.",
            "ستشرع هيئة التحكيم في إصدار ونطق الحكم التحكيمي النهائي خلال الأجل القانوني غير القابل للتمديد.",
            [
                opt("a", "El laudo arbitral", "الحكم التحكيمي / القرار القضائي الصادر عن محكمة التحكيم", True),
                opt("b", "El poema lírico", "القصيدة الغنائية الرومانسية", False, "خارج الإطار القضائي تماماً."),
                opt("c", "El folleto publicitario", "النشرة الإعلانية للترويج للمنتجات", False, "مفردات تجارية استهلاكية.")
            ],
            ["laudo", "arbitral"],
            "«El laudo» هو المصطلح القانوني الحصري لقرار المحكمين الذي يفصل في جوهر النزاع ويتمتع بقوة السند التنفيذي كحكم المحكمة.",
            "pending/c1-u7-arb-3",
            "El colegio arbitral procederá a dictar el laudo definitivo en el plazo legal improrrogable."
        ),
        choice_ex(
            "ex-c1-aco-2", "word_choice",
            "أي فعل قانوني نوعي يستخدم في الإسبانية للتعبير عن «حسم النزاع وفض الخصومة بحكم قاطع»؟",
            ["grammar", "reading"], 1,
            "اختر الفعل القضائي الفصيح لحسم النزاع:",
            "El tribunal fue convocado con el fin de ____ el conflicto de intereses.",
            "تمت الدعوة لعقد المحكمة بهدف الفصل في النزاع وحسم تضارب المصالح القائم.",
            [
                opt("a", "dirimir", "حسم الخلاف والفصل فيه بحكم قاطع منهٍ للخصومة", True),
                opt("b", "aumentar", "توسيع النزاع وزيادته اشتعالاً وتعقيداً", False, "عكس غاية التحكيم."),
                opt("c", "olvidar", "تجاهل المشكلة وتركها معلقة", False, "لا ينهي النزاع قانونياً.")
            ],
            ["dirimir", "controversia"],
            "يقال حصراً «dirimir una controversia / dirimir un conflicto» في لغة المحاكم الرفيعة بمعنى وضع حد نهائي وحل الخصومة."
        ),
        fill_ex(
            "ex-c1-aco-3",
            "أكمل الجملة بالمصطلح الدال على نطاق السلطة القضائية المخولة للنظر في النزاع: «la ____ competente».",
            ["vocabulary", "writing"], 2,
            "اكتب الكلمة الناقصة الدالة على الاختصاص القضائي والسلطة القانونية:",
            "La empresa impugnó la ____ del tribunal alegando la falta de cláusula expresa.",
            "طعنت الشركة في الاختصاص القضائي للمحكمة مدعية خلو العقد من بند صريح بالاحتكام إليها.",
            ["jurisdicción"],
            ["jurisdicción"],
            "«La jurisdicción» هي السلطة القانونية والاختصاص الولائي الذي يخول القاضي أو المحكم الفصل في القضية بمقتضى القانون."
        ),
        choice_ex(
            "ex-c1-aco-4", "word_choice",
            "ماذا تعني كلمة «controversia» في سياق المرافعات التجارية المعقدة؟",
            ["vocabulary", "reading"], 1,
            "اختر المعنى القانوني الدقيق لمصطلح controversia:",
            "Las partes no lograron superar la ____ sobre la interpretación de las tarifas.",
            "لم يفلح الأطراف في تجاوز الخلاف والنزاع الناشئ حول تفسير جدول الرسوم والأسعار.",
            [
                opt("a", "Disputa, litigio o discrepancia legal entre dos partes", "نزاع أو خصومة أو خلاف قانوني وجوهري بين طرفين", True),
                opt("b", "Conversación amistosa sobre el tiempo meteorológico", "محادثة لطيفة وعابرة عن أحوال الطقس", False, "معنى اجتماعي سطحي."),
                opt("c", "Fiesta de celebración por fin de año", "حفلة للاحتفال برأس السنة", False, "لا علاقة له بالمحاكم.")
            ],
            ["controversia", "rigor"],
            "«Una controversia» في القانون التجاري هي النزاع القائم حول تفسير التزام أو تنفيذه أو الإخلال به ويتطلب تدخلاً قضائياً لحله."
        ),
        order_ex(
            "ex-c1-aco-5",
            "رتب الكلمات لبناء تركيب قضائي يثبت حسم النزاع بمقتضى القرار التحكيمي.",
            ["grammar", "writing"], 2,
            ["El", "laudo", "logró", "dirimir", "la", "controversia"],
            "El laudo logró dirimir la controversia",
            "المبتدأ El laudo يليه الفعل المساعد logró والمصدر dirimir والمفعول به la controversia.",
            ["laudo", "dirimir"]
        ),
        speak_ex(
            "ex-c1-aco-6",
            "انطق هذه الجملة بنبرة قاضٍ تحكيمي يعلن الحكم الحاسم بوقار لا تشوبه شائبة.",
            ["speaking", "pronunciation"], 2,
            "نطق سليم مراعياً هيبة المصطلحات القضائية:",
            "El tribunal tiene plena jurisdicción en este litigio.",
            "لهذه الهيئة التحكيمية كامل الاختصاص القضائي للفصل في هذه الخصومة.",
            "pending/c1-u7-arb-spk",
            ["jurisdicción", "rigor"],
            "El tribunal tiene plena jurisdicción en este litigio.",
            "احرص على سلامة نبر كلمة jurisdicción على مقطع -ción الأخير وإخراج صوت حرف c اللثوي بنقاء ورصانة."
        )
    ]
    return lesson_doc(doc, exs, "C1")


def make_lesson_clausulas_compromiso():
    slug = "c1-clausulas-compromiso"
    titleAr = "الشروط التعاقدية والتزامات حسن النية: Cláusulas y buena fe contractual"
    objAr = "أن يصيغ المتعلم بنود المسؤولية المدنية والشرط الجزائي وحالات القوة القاهرة مع استحضار مبدأ حسن النية (buena fe, cláusula penal, fuerza mayor)."
    
    newVocab = ["penal", "mayor", "dolo", "fortuito", "eximir", "rigor"]
    revVocab = ["tiempo", "sociedad", "bien", "trabajo"]
    
    doc = {
        "slug": slug,
        "titleAr": titleAr,
        "level": "C1",
        "programSlug": "main-track",
        "unitSlug": "c1-u7-complex-negotiation",
        "objectiveAr": objAr,
        "estimatedMinutes": 12,
        "skills": ["grammar", "reading", "writing", "listening", "vocabulary"],
        "newVocabulary": newVocab,
        "reviewVocabulary": revVocab,
        "targetStructures": [
            "El principio rector de la buena fe contractual en la interpretación de los pactos",
            "La cláusula penal indemnizatoria frente al retraso en las entregas",
            "Exoneración de responsabilidad: caso fortuito y fuerza mayor sobrevenida",
            "La tipificación del dolo y la culpa grave frente a la negligencia simple"
        ],
        "grammarTopics": ["derecho-de-obligaciones-c1", "redaccion-de-clausulas-criticas"],
        "scenarios": [
            {
                "contextAr": "مفاوضات نهائية بين بنك استثماري وشركة إنشاءات لإبرام عقد تمويل مشروع بنية تحتية.",
                "settingAr": "قاعة الاجتماعات التنفيذية، برج كاستيانا، مدريد",
                "lines": [
                    {
                        "es": "Los contratos deben ejecutarse siempre al amparo del principio universal de la buena fe.",
                        "ar": "يجب أن تنفذ العقود دائماً في ظل ومقتضى المبدأ الكوني الراسخ لحسن النية ونقاء السريرة التعاقدية.",
                        "arEg": "العقود لازم تتنفذ من أولها لآخرها على أساس النية الصافية وحسن النية اللي بيفرضه القانون.",
                        "audioKey": "pending/c1-u7-cla-1"
                    },
                    {
                        "es": "Exigimos la inclusión de una cláusula penal estricta por cada semana de demora injustificada.",
                        "ar": "نحن نطالب بإدراج شرط جزائي صارم يفرض غرامة عن كل أسبوع تأخير غير مبرر في تسليم المشروع.",
                        "arEg": "إحنا مصممين نحط شرط جزائي صارم وغرامة محسوبة عن كل أسبوع تأخير من غير عذر رسمي.",
                        "audioKey": "pending/c1-u7-cla-2"
                    },
                    {
                        "es": "Únicamente supuestos demostrables de fuerza mayor o caso fortuito podrán eximir del pago.",
                        "ar": "فقط الحالات المثبتة للقوة القاهرة أو الحادث الفجائي غير المتوقع هي ما يمكن أن تعفي من أداء الغرامة.",
                        "arEg": "حالات القوة القاهرة بس والظروف الطارئة اللي خارجة عن الإرادة هي اللي هتعفي من دفع الغرامة.",
                        "audioKey": "pending/c1-u7-cla-3"
                    },
                    {
                        "es": "Queda expresamente estipulado que la existencia de dolo anulará cualquier limitación de responsabilidad.",
                        "ar": "تم النص صراحة على أن ثبوت القصد الاحتيالي وسوء النية يبطل أي سقف محدد للمسؤولية القانونية.",
                        "arEg": "مكتوب صراحة وبنص قاطع إن ثبوت الغش وسوء النية بيلغي أي إعفاء أو حماية للمتسبب.",
                        "audioKey": "pending/c1-u7-cla-4"
                    }
                ]
            }
        ],
        "mastery": {
            "minAccuracy": 70,
            "minCorrectExercises": 6,
            "requiredExerciseTypes": ["listen_choose", "word_choice", "fill_blank"]
        },
        "unlock": {"type": "sequential"},
        "offlinePriority": 1,
        "review": review_block()
    }
    
    exs = [
        choice_ex(
            "ex-c1-ccp-1", "listen_choose",
            "استمع إلى المستشار المالي وحدد الشرط التعاقدي الذي طالب بإدراجه لضمان الالتزام بالمواعيد بدقة.",
            ["listening", "vocabulary"], 1,
            "ما هو البند التعاقدي المخصص لفرض تعويض مالي محدد مسبقاً عن التأخير؟",
            "Exigimos la inclusión de una cláusula penal estricta por cada semana de demora injustificada.",
            "نحن نطالب بإدراج شرط جزائي صارم يفرض غرامة عن كل أسبوع تأخير غير مبرر في تسليم المشروع.",
            [
                opt("a", "Una cláusula penal", "شرط جزائي محدد لتقدير التعويض سلفاً عند التأخير", True),
                opt("b", "Una cláusula de amistad", "بند صداقة ومجاملة شخصية بين المديرين", False, "العقود التزامات مالية ملزمة وليست صداقات."),
                opt("c", "Una cláusula de turismo", "بند لترتيب رحلات سياحية مجانية", False, "خارج نطاق عقود التشييد والبنية التحتية.")
            ],
            ["penal", "rigor"],
            "«La cláusula penal» (الشرط الجزائي) هو اتفاق تعاقدي يحدد مسبقاً مبلغ التعويض الواجب دفعه في حال التأخر أو عدم التنفيذ درءاً لتعقيد إثبات الضرر.",
            "pending/c1-u7-cla-2",
            "Exigimos la inclusión de una cláusula penal estricta por cada semana de demora injustificada."
        ),
        choice_ex(
            "ex-c1-ccp-2", "word_choice",
            "ما هي العبارة القانونية الدالة على «الظرف القاهر الخارجي الخارج عن إرادة المتعاقد والذي يستحيل دفعه»؟",
            ["reading", "vocabulary"], 1,
            "اختر المصطلح القانوني الدال على الظرف الطارئ المعفي من المسؤولية:",
            "El derrumbe fue calificado jurídicamente como causa de ____ imprevisible e inevitable.",
            "وُصف الانهيار الصخري قانونياً بأنه ناشئ عن قوة قاهرة يستحيل التنبؤ بها أو دفعها.",
            [
                opt("a", "fuerza mayor", "قوة قاهرة وظرف طارئ يعفي من المسؤولية لعدم إمكان توقعه", True),
                opt("b", "mala voluntad", "سوء نية وتعمد الإضرار بالمشروع", False, "يرتب المسؤولية والتعويض المشدد."),
                opt("c", "pereza mental", "كسل فكري وإهمال مهني عادي", False, "إهمال موجب للمسؤولية.")
            ],
            ["mayor", "rigor"],
            "«Fuerza mayor» (القوة القاهرة) في القانون المدني حدث خارجي لا يد لأحد فيه ولا يمكن تفاديه (كالزلازل والحروب) ويعفي المدين من التعويض."
        ),
        fill_ex(
            "ex-c1-ccp-3",
            "أكمل المصطلح القانوني الدال على نية الغش والإضرار المتعمد بالطرف الآخر: «actuar con ____».",
            ["vocabulary", "writing"], 2,
            "اكتب الكلمة القانونية اللاتينية الدالة على القصد الجنائي والاحتيال المدني:",
            "Si la empresa actuó con ____ probado, deberá abonar la totalidad de las pérdidas.",
            "إذا ثبت أن الشركة تصرفت بسوء نية وقصد احتيالي متعمد، تعين عليها تعويض كامل الخسائر.",
            ["dolo"],
            ["dolo"],
            "«El dolo» في القانون هو أعلى درجات الخطأ والمسؤولية، ويعني تعمد الإخلال بالالتزام وإلحاق الضرر بالغير عن دراية وإرادة خبيثة."
        ),
        choice_ex(
            "ex-c1-ccp-4", "word_choice",
            "ما الفعل القانوني الذي يفيد «رفع المسؤولية والالتزام عن كاهل الشخص وإبراء ذمته»؟",
            ["vocabulary", "reading"], 1,
            "اختر الفعل الدال على الإعفاء والإبراء من الالتزام المالي:",
            "El certificado médico sirvió para ____ al empleado del cumplimiento del plazo.",
            "كانت الشهادة الطبية الرسمية مسوغاً لإعفاء الموظف وإبراء ذمته من التقيد بالموعد.",
            [
                opt("a", "eximir", "إعفاء وإبراء الذمة من المسؤولية أو الغرامة", True),
                opt("b", "acusar", "توجيه الاتهام الجنائي في المحكمة", False, "عكس الإعفاء تماماً."),
                opt("c", "obligar", "إلزام وإجبار الشخص على الدفع", False, "يفرض الالتزام ولا يعفي منه.")
            ],
            ["eximir", "rigor"],
            "يقال «eximir de responsabilidad / eximir del pago» بمعنى التحرير القانوني من عبء الالتزام لوجود مسوغ شرعي."
        ),
        order_ex(
            "ex-c1-ccp-5",
            "رتب الكلمات لبناء مبدأ قانوني يعفي المدين في حالات القوة القاهرة.",
            ["grammar", "writing"], 2,
            ["La", "fuerza", "mayor", "exime", "de", "responsabilidad"],
            "La fuerza mayor exime de responsabilidad",
            "المبتدأ La fuerza mayor يليه الفعل المتعدي exime وحرف الجر de والمفعول المجرور responsabilidad.",
            ["mayor", "eximir"]
        ),
        speak_ex(
            "ex-c1-ccp-6",
            "انطق هذه الجملة بنبرة محامٍ خبير يضع شروط التعاقد بمنتهى الرصانة والوضوح.",
            ["speaking", "pronunciation"], 2,
            "نطق سليم مراعياً الجزالة القانونية للألفاظ:",
            "Pactamos una cláusula penal en caso de demora.",
            "اتفقنا على تضمين شرط جزائي صارم في حال التأخر عن التسليم.",
            "pending/c1-u7-cla-spk",
            ["penal", "rigor"],
            "Pactamos una cláusula penal en caso de demora.",
            "احرص على سلامة نبر كلمة cláusula على المقطع الأول ونطق حرف p في pactamos بصفاء غير مجهور."
        )
    ]
    return lesson_doc(doc, exs, "C1")


def make_lesson_comunicacion_crisis():
    slug = "c1-comunicacion-crisis"
    titleAr = "إدارة الاتصال المؤسسي والأزمات الكبرى: Gestión de crisis y portavocía"
    objAr = "أن يقود المتعلم مؤتمراً صحفياً عاصفاً في سياق أزمة كبرى، مهدئاً الرأي العام ومفنّداً الشائعات باحترافية (mitigar impacto, desmentir categóricamente, asumir responsabilidad)."
    
    newVocab = ["crisis", "mitigar", "desmentir", "transparencia", "rueda", "rigor"]
    revVocab = ["tiempo", "sociedad", "bien", "trabajo"]
    
    doc = {
        "slug": slug,
        "titleAr": titleAr,
        "level": "C1",
        "programSlug": "main-track",
        "unitSlug": "c1-u7-complex-negotiation",
        "objectiveAr": objAr,
        "estimatedMinutes": 12,
        "skills": ["grammar", "reading", "writing", "listening", "vocabulary"],
        "newVocabulary": newVocab,
        "reviewVocabulary": revVocab,
        "targetStructures": [
            "Fórmula de comparecencia: comparecer en rueda de prensa con total transparencia",
            "Desmentido oficial: desmentir categóricamente los bulos malintencionados",
            "Contención del daño: implementar medidas de choque para mitigar el impacto",
            "Asunción ética de compromisos: asumir la máxima responsabilidad ante los afectados"
        ],
        "grammarTopics": ["comunicacion-de-crisis-c1", "portavocia-y-medios-de-comunicacion"],
        "scenarios": [
            {
                "contextAr": "مؤتمر صحفي عاجل للمتحدث الرسمي باسم شركة طيران وطنية إثر عطل سيبراني أوقف الرحلات.",
                "settingAr": "قاعة المؤتمرات الصحفية، مطار باراخاس أدولفو سواريث، مدريد",
                "lines": [
                    {
                        "es": "Comparecemos ante ustedes en esta rueda de prensa con el firme compromiso de actuar con absoluta transparencia.",
                        "ar": "نقف ونمثل أمامكم في هذا المؤتمر الصحفي بالتزام راسخ لا يتزعزع بالعمل بمنتهى الشفافية والوضوح.",
                        "arEg": "إحنا واقفين قدامكم في المؤتمر الصحفي ده ومعندناش أي حاجة نخبيها وملتزمين بأعلى درجات الشفافية.",
                        "audioKey": "pending/c1-u7-cri-1"
                    },
                    {
                        "es": "Queremos desmentir categóricamente las informaciones infundadas que hablan de un sabotaje interno.",
                        "ar": "نود أن نفند ونكذب بصورة قاطعة لا لبس فيها الأنباء المغلوطة التي تروج لوقوع عمل تخريبي من الداخل.",
                        "arEg": "حابين ننفي نفي قاطع كل الإشاعات المغرضة اللي بتقول إن في تخريب حصل من جوه الشركة.",
                        "audioKey": "pending/c1-u7-cri-2"
                    },
                    {
                        "es": "Hemos activado un plan de contingencia de choque para mitigar el impacto sobre los pasajeros afectados.",
                        "ar": "لقد فعلنا خطة طوارئ وتدخل سريع لتخفيف وطأة الأثر والضرر الواقع على المسافرين المتضررين.",
                        "arEg": "شغلنا خطة طوارئ عاجلة ومحكمة عشان نقلل من الأثر والتعب اللي حصله للمسافرين بتوعنا.",
                        "audioKey": "pending/c1-u7-cri-3"
                    },
                    {
                        "es": "La dirección asume la plena responsabilidad y garantizará el reembolso íntegro a cada usuario.",
                        "ar": "تتحمل إدارة الشركة كامل المسؤولية الأخلاقية والمادية وستضمن الاسترداد الكامل لأموال كل مستخدم.",
                        "arEg": "إدارة الشركة بتتحمل المسؤولية كاملة من غير تهرب وهترجع كل قرش اتدفع لكل راكب متضرر.",
                        "audioKey": "pending/c1-u7-cri-4"
                    }
                ]
            }
        ],
        "mastery": {
            "minAccuracy": 70,
            "minCorrectExercises": 6,
            "requiredExerciseTypes": ["listen_choose", "word_choice", "fill_blank"]
        },
        "unlock": {"type": "sequential"},
        "offlinePriority": 1,
        "review": review_block()
    }
    
    exs = [
        choice_ex(
            "ex-c1-ccr-1", "listen_choose",
            "استمع إلى إعلان المتحدث الرسمي وحدد ما قام به رداً على الشائعات المغرضة المنتشرة في الصحافة.",
            ["listening", "vocabulary"], 1,
            "كيف تعامل المتحدث الرسمي مع الشائعات العارية عن الصحة؟",
            "Queremos desmentir categóricamente las informaciones infundadas que hablan de un sabotaje interno.",
            "نود أن نفند ونكذب بصورة قاطعة لا لبس فيها الأنباء المغلوطة التي تروج لوقوع عمل تخريبي من الداخل.",
            [
                opt("a", "Desmentir categóricamente las informaciones falsas", "التكذيب والتفنيد القاطع والحاسم للأنباء الكاذبة", True),
                opt("b", "Confirmar los rumores y presentar la dimisión", "تأكيد صحة الشائعات وتقديم الاستقالة الجماعية", False, "المتحدث نفى الشائعة بحزم."),
                opt("c", "Recomendar la compra de acciones de la competencia", "نصح الناس بشراء أسهم الشركات المنافسة", False, "خارج السياق الإعلامي للأزمة.")
            ],
            ["desmentir", "transparencia"],
            "تعبير «desmentir categóricamente» هو الصيغة المؤسسية الأقوى لنفي الشائعات في المؤتمرات الرسمية وقطع دابر التأويلات المغرضة.",
            "pending/c1-u7-cri-2",
            "Queremos desmentir categóricamente las informaciones infundadas que hablan de un sabotaje interno."
        ),
        choice_ex(
            "ex-c1-ccr-2", "word_choice",
            "ما هو الفعل الأنسب أسلوبياً في إدارة الأزمات للدلالة على «تخفيف حدة الضرر ووطأة الأثر السلبي»؟",
            ["reading", "vocabulary"], 1,
            "اختر الفعل المعبر عن تقليص الخسائر وتلطيف الآثار:",
            "El gabinete de crisis adoptó medidas urgentes para ____ los daños ecológicos del vertido.",
            "اتخذت خلية الأزمة تدابير عاجلة للحد من الأضرار البيئية للتسرب وتخفيف وطأتها.",
            [
                opt("a", "mitigar", "تخفيف وتلطيف وطأة الضرر وتقليص حدته السلبية", True),
                opt("b", "fomentar", "تشجيع الأضرار وزيادة انتشارها وتفاقمها", False, "عكس خطة احتواء الأزمة."),
                opt("c", "festejar", "الاحتفال بالأزمة وإقامة المهرجانات", False, "سلوك عبثي غير مسؤول.")
            ],
            ["mitigar", "crisis"],
            "الفعل «mitigar» (كقولنا mitigar el impacto / mitigar los efectos) هو المصطلح القياسي في إدارة المخاطر والأزمات البيئية والاقتصادية."
        ),
        fill_ex(
            "ex-c1-ccr-3",
            "أكمل التعبير الإسباني المعتمد لعقد لقاء مع الصحفيين ووسائل الإعلام: «____ de prensa».",
            ["vocabulary", "writing"], 2,
            "اكتب الكلمة الناقصة الدالة على عجلة وحلقة المؤتمر الصحفي:",
            "El portavoz compareció en ____ de prensa ante decenas de corresponsales.",
            "مثل المتحدث الرسمي في مؤتمر صحفي جامع أمام عشرات المراسلين الدوليين.",
            ["rueda"],
            ["rueda"],
            "يقال حصراً في الإسبانية «rueda de prensa» أو «conferencia de prensa» لمقابلة مصطلح المؤتمر الصحفي."
        ),
        choice_ex(
            "ex-c1-ccr-4", "word_choice",
            "ما هي القيمة المؤسسية الأولى التي يطالب بها الرأي العام في أوقات الكوارث والأزمات الكبرى؟",
            ["vocabulary", "reading"], 1,
            "اختر المبدأ الحاكم للمصداقية والتواصل النزيه:",
            "La opinión pública exige máxima ____ y rigor en la difusión de los partes oficiales.",
            "يطالب الرأي العام بأعلى درجات الشفافية والنزاهة والدقة في نشر البيانات الرسمية.",
            [
                opt("a", "transparencia", "الشفافية والوضوح التام ومكاشفة الجمهور بالحقائق", True),
                opt("b", "opacidad", "الغموض والتعتيم وحجب المعلومات عن الصحافة", False, "التعتيم يفقد المؤسسة مصداقيتها فوراً."),
                opt("c", "lentitud", "البطء والتكاسل في الرد على استفسارات الناس", False, "البطء يغذي الشائعات الهدامة.")
            ],
            ["transparencia", "rigor"],
            "«La transparencia» (الشفافية) هي حجر الزاوية في علم الاتصال المؤسسي لإعادة بناء الثقة المنهارة بين الهيئة والجمهور."
        ),
        order_ex(
            "ex-c1-ccr-5",
            "رتب الكلمات لبناء التزام قاطع بإجراء تحقيق شفاف ومستقل.",
            ["grammar", "writing"], 2,
            ["Garantizamos", "una", "total", "transparencia", "informativa"],
            "Garantizamos una total transparencia informativa",
            "الفعل Garantizamos متبوعاً بالمفعول الموصوف una total transparencia informativa.",
            ["transparencia"]
        ),
        speak_ex(
            "ex-c1-ccr-6",
            "انطق هذه الجملة بنبرة متحدث رسمي واثق يتحلى بالشجاعة والصدق والتحكم الكامل في الموقف.",
            ["speaking", "pronunciation"], 2,
            "نطق سليم مراعياً الهدوء النفسي في مواجهة العاصفة الإعلامية:",
            "Trabajamos sin descanso para mitigar la crisis.",
            "نحن نعمل دون كلل ولا انقطاع لاحتواء الأزمة وتخفيف آثارها.",
            "pending/c1-u7-cri-spk",
            ["mitigar", "crisis"],
            "Trabajamos sin descanso para mitigar la crisis.",
            "احرص على مد نبرة Trabajamos بثبات وإخراج حرف g في mitigar بصوت رخو سليم لبيان التماسك والهدوء القيادي."
        )
    ]
    return lesson_doc(doc, exs, "C1")


# -------------------------------------------------------------
# UNIT 8: c1-u8-advanced-writing (الكتابة المتقدمة والمقالات الكبرى)
# -------------------------------------------------------------

def make_lesson_articulo_opinion():
    slug = "c1-articulo-opinion"
    titleAr = "مقال الرأي في الصحافة الفكرية الكبرى: La tribuna de opinión periodística"
    objAr = "أن يحرر المتعلم مقال رأي فكري معمق (tribuna de opinión / columna) مستخدماً البلاغة الإقناعية والأسلبة الساخرة الرصينة (agudeza, sesgo, vehemencia)."
    
    newVocab = ["tribuna", "columna", "agudeza", "sesgo", "vehemencia", "rigor"]
    revVocab = ["tiempo", "sociedad", "bien", "trabajo"]
    
    doc = {
        "slug": slug,
        "titleAr": titleAr,
        "level": "C1",
        "programSlug": "main-track",
        "unitSlug": "c1-u8-advanced-writing",
        "objectiveAr": objAr,
        "estimatedMinutes": 12,
        "skills": ["grammar", "reading", "writing", "listening", "vocabulary"],
        "newVocabulary": newVocab,
        "reviewVocabulary": revVocab,
        "targetStructures": [
            "La estructura clásica del artículo de fondo: gancho inicial, tesis, antítesis y remate",
            "El estilo de la columna de opinión: agudeza conceptual y mordacidad contenida",
            "Detección y denuncia del sesgo cognitivo y partidista en el debate público",
            "La modulación de la vehemencia dialéctica mediante recursos irónicos cultos"
        ],
        "grammarTopics": ["generos-periodisticos-de-opinion-c1", "redaccion-argumentativa-avanzada"],
        "scenarios": [
            {
                "contextAr": "حلقة نقاشية في هيئة تحرير صحيفة 'الباييس' (El País) حول فن كتابة مقال الرأي لكبار الكتاب.",
                "settingAr": "مقر هيئة تحرير صحيفة إل باييس، مدريد",
                "lines": [
                    {
                        "es": "Una tribuna de opinión no es un mero desahogo visceral, sino una pieza de arquitectura intelectual.",
                        "ar": "إن منبر الرأي ليس مجرد تنفيس انفعالي سطحي، بل قطعة معمارية فكرية محكمة التشييد.",
                        "arEg": "مقال الرأي في الصحافة مش شوية كلام خارج من الغضب والانفعال، ده بنيان فكري هندسي محسوب بالمللي.",
                        "audioKey": "pending/c1-u8-opi-1"
                    },
                    {
                        "es": "El columnista debe cultivar la agudeza crítica y despojar su análisis de todo sesgo ideológico ciego.",
                        "ar": "يجب على كاتب العمود الصحفي أن يصقل بصيرته النقدية وأن يجرد تحليله من كل تحيز وانحياز أيديولوجي أعمى.",
                        "arEg": "كاتب العمود لازم دماغه تبقى صاحية وذكية ويطهر تحليله من أي انحياز أعمى لأي طرف.",
                        "audioKey": "pending/c1-u8-opi-2"
                    },
                    {
                        "es": "Conviene graduar la vehemencia expresiva para que la solidez de los argumentos brille con luz propia.",
                        "ar": "يجدر ضبط وتدريج حرارة الاندفاع والحماسة الخطابية حتى تسطع رصانة الحجج بنورها الخاص الذاتي.",
                        "arEg": "الأشيك إننا نهدي النبرة الحامية شوية عشان قوة الحجة نفسها هي اللي تبان وتلمع في عين القارئ.",
                        "audioKey": "pending/c1-u8-opi-3"
                    },
                    {
                        "es": "El remate final debe resonar en la mente del lector como un eco lúcido e imperecedero.",
                        "ar": "يجب أن تتردد الخاتمة وقفلة المقال في عقل القارئ كرنين مضيء لا يُمحى أثره مع الأيام.",
                        "arEg": "قفلة المقال في الآخر لازم تفضل ترن وتلف في دماغ القارئ وتخليه يفكر في الكلام ومينساهوش.",
                        "audioKey": "pending/c1-u8-opi-4"
                    }
                ]
            }
        ],
        "mastery": {
            "minAccuracy": 70,
            "minCorrectExercises": 6,
            "requiredExerciseTypes": ["listen_choose", "word_choice", "fill_blank"]
        },
        "unlock": {"type": "sequential"},
        "offlinePriority": 1,
        "review": review_block()
    }
    
    exs = [
        choice_ex(
            "ex-c1-aop-1", "listen_choose",
            "استمع إلى حديث رئيس التحرير وحدد كيف عرّف مقال الرأي الفكري الحقيقي.",
            ["listening", "vocabulary"], 1,
            "ما هو المقال الصحفي الفكري وفقاً لحديث رئيس التحرير؟",
            "Una tribuna de opinión no es un mero desahogo visceral, sino una pieza de arquitectura intelectual.",
            "إن منبر الرأي ليس مجرد تنفيس انفعالي سطحي، بل قطعة معمارية فكرية محكمة التشييد.",
            [
                opt("a", "Una pieza de arquitectura intelectual rigurosamente construida", "قطعة بناء فكرية معمقة محكمة الصياغة والترابط", True),
                opt("b", "Un desahogo visceral lleno de gritos e insultos", "تنفيس انفعالي مبتذل مليء بالسباب والشتم", False, "الكاتب نفى هذا الانحدار صراحة."),
                opt("c", "Un anuncio de rebajas en grandes almacenes", "إعلان عن تخفيضات في المركز التجاري", False, "إعلانات تجارية لا رأي فيها.")
            ],
            ["tribuna", "rigor"],
            "«Una tribuna de opinión» في الصحافة الراقية مساحة يكتب فيها كبار المفكرين والخبراء لمخاطبة عقل القارئ بحجج رصينة وبناء هندسي متقن.",
            "pending/c1-u8-opi-1",
            "Una tribuna de opinión no es un mero desahogo visceral, sino una pieza de arquitectura intelectual."
        ),
        choice_ex(
            "ex-c1-aop-2", "word_choice",
            "ما المصطلح الدال على «الميل والنزعة الذاتية غير الموضوعية التي تشوه إدراك الحقائق وتفسيرها»؟",
            ["reading", "vocabulary"], 1,
            "اختر المصطلح المعبر عن الانحياز المعرفي أو الأيديولوجي المسبق:",
            "El ensayista advierte contra el peligro de analizar la historia con un evidente ____ partidista.",
            "يحذر كاتب المقال من مغبة تحليل التاريخ بانحياز وتحامل حزبي فاقع يشوه الحقائق.",
            [
                opt("a", "sesgo", "انحياز / تحيز مسبق يعمي عن رؤية الحقيقة بموضوعية", True),
                opt("b", "amor", "حب عاطفي بريء بين الأصدقاء", False, "عاطفة لا تعبر عن الخلل التحليلي."),
                opt("c", "descanso", "راحة واستجمام في عطلة نهاية الأسبوع", False, "خارج الإطار النقدي.")
            ],
            ["sesgo", "agudeza"],
            "«El sesgo» (أو sesgo cognitivo / ideológico) هو الميل والانحراف عن جادة الإنصاف والحياد بسبب قوالب فكرية أو مصالح مسبقة."
        ),
        fill_ex(
            "ex-c1-aop-3",
            "أكمل المصطلح الدال على المساحة المخصصة لمقال الكاتب الثابت في الجريدة: «la ____ semanal».",
            ["vocabulary", "writing"], 2,
            "اكتب الكلمة المعبرة عن العمود الصحفي الدوري:",
            "El prestigioso escritor publica cada domingo su ____ de opinión en el suplemento.",
            "ينشر الكاتب المرموق كل أحد عموده الصحفي التحليلي في الملحق الأسبوعي للجريدة.",
            ["columna"],
            ["columna"],
            "«La columna» (العمود الصحفي) مساحة ثابتة الشكل والموقع يطل منها كاتب ذو أسلوب مميز للتعبير عن رؤيته الخاصة للأحداث."
        ),
        choice_ex(
            "ex-c1-aop-4", "word_choice",
            "ما هي السمة الذهنية والأسلوبية المطلوبة لدى كاتب المقال لاقتناص المفارقات والتعبير عنها ببراعة؟",
            ["vocabulary", "reading"], 1,
            "اختر الصفة الدالة على الذكاء اللماح والفطنة النقدية النافذة:",
            "El texto destaca por la deslumbrante ____ verbal e irónica de su autor.",
            "يتميز النص بالذكاء اللماح والفطنة اللفظية والتهكم البارع لكاتبه.",
            [
                opt("a", "agudeza", "الذكاء اللماح والفطنة وسرعة البديهة النافذة", True),
                opt("b", "torpeza", "الغباء والخرق والبلادة الذهنية", False, "عكس النبوغ الصحفي."),
                opt("c", "ceguera", "العمى وانعدام الرؤية التام", False, "تناقض تام مع البصيرة.")
            ],
            ["agudeza", "vehemencia"],
            "«La agudeza» هي حدة الفطنة والقدرة على رؤية ما لا يراه الآخرون والتعبير عن ذلك بصياغة بارعة مكثفة."
        ),
        order_ex(
            "ex-c1-aop-5",
            "رتب الكلمات لبناء قاعدة أدبية وصحفية تحث على ضبط الانفعال في الكتابة.",
            ["grammar", "writing"], 2,
            ["Evita", "la", "vehemencia", "excesiva", "al", "escribir"],
            "Evita la vehemencia excesiva al escribir",
            "الأمر Evita متبوعاً بالمفعول به la vehemencia والصفة excesiva وحرف الجر المدمج بالمصدر al escribir.",
            ["vehemencia"]
        ),
        speak_ex(
            "ex-c1-aop-6",
            "انطق هذه الجملة بنبرة كاتب مقال عميق يزن كلماته بدقة واقتدار أدبي بالغ.",
            ["speaking", "pronunciation"], 2,
            "نطق سليم مراعياً الإيقاع الرصين للنثر الصحفي الرفيع:",
            "La columna exige rigor conceptual y agudeza estilística.",
            "يتطلب مقال العمود الصحفي رصانة مفاهيمية وذكاءً أسلوبياً لماحاً.",
            "pending/c1-u8-opi-spk",
            ["columna", "agudeza"],
            "La columna exige rigor conceptual y agudeza estilística.",
            "احرص على نطق حرف x في exige بصوت خاء فصيح رخو ونبر مقطع -tí- في estilística بدقة لا تشوبها لكنة."
        )
    ]
    return lesson_doc(doc, exs, "C1")


def make_lesson_memoria_institucional():
    slug = "c1-memoria-institucional"
    titleAr = "التقرير السنوي والمذكرات المؤسسية: La memoria institucional y rendición de cuentas"
    objAr = "أن يصيغ المتعلم التقرير السنوي الإداري والمالي لمؤسسة كبرى مع تقييم مؤشرات الأداء والشفافية (memoria de gestión, rendición de cuentas, balance cualitativo)."
    
    newVocab = ["memoria", "rendición", "balance", "cualitativo", "hito", "rigor"]
    revVocab = ["tiempo", "sociedad", "bien", "trabajo"]
    
    doc = {
        "slug": slug,
        "titleAr": titleAr,
        "level": "C1",
        "programSlug": "main-track",
        "unitSlug": "c1-u8-advanced-writing",
        "objectiveAr": objAr,
        "estimatedMinutes": 12,
        "skills": ["grammar", "reading", "writing", "listening", "vocabulary"],
        "newVocabulary": newVocab,
        "reviewVocabulary": revVocab,
        "targetStructures": [
            "Estructura de la memoria corporativa: balance cuantitativo y balance cualitativo",
            "Principio de rendición de cuentas (accountability) ante el patronato y la sociedad",
            "Identificación de hitos estratégicos y grado de cumplimiento de los objetivos",
            "Proyección prospectiva: lecciones aprendidas y líneas de actuación futuras"
        ],
        "grammarTopics": ["comunicacion-corporativa-c1", "redaccion-de-informes-ejecutivos"],
        "scenarios": [
            {
                "contextAr": "العرض السنوي لتقرير الأداء والشفافية لمؤسسة ثقافية عالمية أمام مجلس الأمناء في مدريد.",
                "settingAr": "قاعة مجلس إدارة مؤسسة كازا أرافي (Casa Árabe)، مدريد",
                "lines": [
                    {
                        "es": "Presentamos esta memoria anual de gestión como un ejercicio insoslayable de rendición de cuentas.",
                        "ar": "نقدم هذا التقرير السنوي للإدارة بوصفه ممارسة حتمية لا غنى عنها للمساءلة والشفافية المؤسسية.",
                        "arEg": "بنقدم التقرير السنوي ده لمجلس الإدارة عشان دي مسؤولية وواجب علينا في الشفافية ومحاسبة النفس قدام الكل.",
                        "audioKey": "pending/c1-u8-mem-1"
                    },
                    {
                        "es": "El balance cualitativo evidencia un salto histórico en el impacto formativo de nuestros programas.",
                        "ar": "تثبت الحصيلة والتقييم النوعي حدوث قفزة تاريخية فارقة في الأثر التدريبي والتكويني لبرامجنا.",
                        "arEg": "التقييم النوعي بيبين بوضوح النقلة الكبيرة والتطور التاريخي اللي حصل في برامجنا التدريبية السنة دي.",
                        "audioKey": "pending/c1-u8-mem-2"
                    },
                    {
                        "es": "Hemos alcanzado con éxito el principal hito estratégico fijado al comienzo del ejercicio presupuestario.",
                        "ar": "لقد حققنا بنجاح المعلم والمحطة الاستراتيجية الكبرى التي حددت عند مستهل السنة المالية.",
                        "arEg": "قدرنا نوصل بفضل الله لأهم هدف ومعلم رئيسي حطيناه لنفسنا في أول ميزانية السنة دي.",
                        "audioKey": "pending/c1-u8-mem-3"
                    },
                    {
                        "es": "El documento combina el máximo rigor estadístico con una visión prospectiva esperanzadora.",
                        "ar": "تجمع هذه الوثيقة بين أقصى درجات الدقة الإحصائية الصارمة والرؤية المستقبلية الواعدة بالخير.",
                        "arEg": "التقرير جامع بين منتهى الدقة والصرامة في الأرقام، وبين نظرة تفاؤلية ذكية لبكرة وللمستقبل.",
                        "audioKey": "pending/c1-u8-mem-4"
                    }
                ]
            }
        ],
        "mastery": {
            "minAccuracy": 70,
            "minCorrectExercises": 6,
            "requiredExerciseTypes": ["listen_choose", "word_choice", "fill_blank"]
        },
        "unlock": {"type": "sequential"},
        "offlinePriority": 1,
        "review": review_block()
    }
    
    exs = [
        choice_ex(
            "ex-c1-min-1", "listen_choose",
            "استمع إلى تقديم المدير العام للتقرير وحدد المفهوم المؤسسي الذي وصف به تقديم وثيقة التقرير السنوي.",
            ["listening", "vocabulary"], 1,
            "ما المبدأ الرقابي والأخلاقي الذي جسده تقديم التقرير السنوي للمؤسسة؟",
            "Presentamos esta memoria anual de gestión como un ejercicio insoslayable de rendición de cuentas.",
            "نقدم هذا التقرير السنوي للإدارة بوصفه ممارسة حتمية لا غنى عنها للمساءلة والشفافية المؤسسية.",
            [
                opt("a", "Rendición de cuentas", "المساءلة وتقديم الحساب وإبراء الذمة الإدارية والمالية", True),
                opt("b", "Ocultación de fondos", "إخفاء الأموال ودفن السجلات في سراديب مظلمة", False, "فساد مالي يعاقب عليه القانون."),
                opt("c", "Fiesta de cumpleaños", "حفلة عيد ميلاد ترفيهية للموظفين", False, "التقرير وثيقة رسمية قانونية.")
            ],
            ["rendición", "memoria"],
            "«La rendición de cuentas» (المساءلة المؤسسية / accountability) هي التزام الإدارة بعرض نتائج أعمالها بالأرقام والأدلة أمام الهيئات المشرفة والمجتمع.",
            "pending/c1-u8-mem-1",
            "Presentamos esta memoria anual de gestión como un ejercicio insoslayable de rendición de cuentas."
        ),
        choice_ex(
            "ex-c1-min-2", "word_choice",
            "ما المصطلح الدال على «المحطة البارزة أو الإنجاز المفصلي في مسار خطة العمل المؤسسية»؟",
            ["reading", "vocabulary"], 1,
            "اختر الكلمة المعبرة عن المعلم الاستراتيجي المهم:",
            "La inauguración de la nueva sede representó un auténtico ____ en la trayectoria de la entidad.",
            "شكل افتتاح المقر الجديد محطة ومعلماً تاريخياً فاصلاً في مسيرة المؤسسة وتطورها.",
            [
                opt("a", "hito", "معلم بارز / محطة مفصلية ونقطة تحول كبرى", True),
                opt("b", "hilo", "خيط رفيع تستخدمه الحياكة اليدوية", False, "معنى مادي لا يصف الإنجاز الاستراتيجي."),
                opt("c", "hielo", "جليد بارد متجمد في القطب", False, "عنصر طبيعي خارج الإدارة.")
            ],
            ["hito", "rigor"],
            "«Un hito estratégico» (Milestone) مأخوذ من علامات الأميال القديمة في الطرقات، ويطلق على الإنجاز النوعي الذي يؤرخ لمرحلة جديدة في المؤسسة."
        ),
        fill_ex(
            "ex-c1-min-3",
            "أكمل الجملة بالصفة المقابلة للكمي والمخصصة لتقييم عمق التحول والأثر: «el balance ____».",
            ["vocabulary", "writing"], 2,
            "اكتب الصفة المعبرة عن التقييم النوعي والكيفي:",
            "Más allá de las cifras de ventas, el balance ____ de este año es extraordinariamente positivo.",
            "بمعزل عن أرقام المبيعات المجردة، فإن التقييم النوعي والكيفي لهذا العام إيجابي لدرجة استثنائية.",
            ["cualitativo"],
            ["cualitativo"],
            "«El balance cualitativo» يفحص جودة الإنجاز ومدى رضاء المستفيدين والتغيرات الهيكلية، مكملاً بذلك التقييم الكمي الرقمي (cuantitativo)."
        ),
        choice_ex(
            "ex-c1-min-4", "word_choice",
            "ماذا تسمى الوثيقة الرسمية الشاملة التي ترصد كافة أنشطة المؤسسة وأرقامها خلال عام كامل؟",
            ["vocabulary", "reading"], 1,
            "اختر الاسم المعتمد للتقرير السنوي الشامل:",
            "El patronato aprobó por unanimidad la ____ anual de actividades y finanzas.",
            "وافق مجلس الأمناء بالإجماع على التقرير والبيان السنوي الشامل للأنشطة والمالية.",
            [
                opt("a", "memoria", "التقرير السنوي المؤسسي التوثيقي الشامل", True),
                opt("b", "novela", "رواية أدبية خيالية من نسج الأوهام", False, "التقرير وثيقة حقائق وأرقام."),
                opt("c", "canción", "أغنية شعبية في الإذاعة", False, "فن غنائي خارج الإدارة.")
            ],
            ["memoria", "balance"],
            "«La memoria anual» (أو memoria de gestión) هي الوثيقة المرجعية القانونية التي تقدمها المؤسسات والشركات لتوثيق أعمالها السنوية."
        ),
        order_ex(
            "ex-c1-min-5",
            "رتب الكلمات لبناء مبدأ الشفافية وإبراء الذمة الإدارية السنوية.",
            ["grammar", "writing"], 2,
            ["Cumplimos", "con", "la", "rendición", "de", "cuentas"],
            "Cumplimos con la rendición de cuentas",
            "الفعل Cumplimos متبوعاً بحرف الجر con والاسم المجرور المركب la rendición de cuentas.",
            ["rendición"]
        ),
        speak_ex(
            "ex-c1-min-6",
            "انطق هذه الجملة بنبرة مدير تنفيذي يقدم تقريره السنوي أمام كبار المساهمين بثقة واعتزاز.",
            ["speaking", "pronunciation"], 2,
            "نطق سليم مراعياً الرصانة التنظيمية والإدارية:",
            "Esta memoria refleja un riguroso balance cualitativo.",
            "يعكس هذا التقرير السنوي تقييماً نوعياً بالغ الرصانة والدقة.",
            "pending/c1-u8-mem-spk",
            ["memoria", "cualitativo"],
            "Esta memoria refleja un riguroso balance cualitativo.",
            "احرص على سلامة نبر كلمة cualitativo على مقطع -ti- وإعطاء حرف r المشدد في riguroso حقه من الاهتزاز الفصيح."
        )
    ]
    return lesson_doc(doc, exs, "C1")


def make_lesson_ensayo_cultural():
    slug = "c1-ensayo-cultural"
    titleAr = "المقال الفلسفي والنقد الثقافي: El ensayo cultural y la prosa meditativa"
    objAr = "أن يكتب المتعلم مقالاً نقدياً وفلسفياً رفيعاً يتناول قضايا الفكر والجماليات بلغة تأملية متسقة ومجازات فكرية متينة (prosa meditativa, trascendencia, dialéctica)."
    
    newVocab = ["meditativa", "trascendencia", "dialéctica", "estética", "cohesión", "rigor"]
    revVocab = ["tiempo", "sociedad", "bien", "trabajo"]
    
    doc = {
        "slug": slug,
        "titleAr": titleAr,
        "level": "C1",
        "programSlug": "main-track",
        "unitSlug": "c1-u8-advanced-writing",
        "objectiveAr": objAr,
        "estimatedMinutes": 12,
        "skills": ["grammar", "reading", "writing", "listening", "vocabulary"],
        "newVocabulary": newVocab,
        "reviewVocabulary": revVocab,
        "targetStructures": [
            "La prosa meditativa: cadencia pausada, digresiones fecundas y rigor conceptual",
            "La búsqueda de la trascendencia ética a través de la experiencia estética",
            "La dialéctica entre tradición histórica e innovación iconoclasta",
            "La cohesión textual micro y macroestructural en el ensayo filosófico"
        ],
        "grammarTopics": ["el-ensayo-filosofico-c1", "estilistica-del-pensamiento-critico"],
        "scenarios": [
            {
                "contextAr": "ورشة لتطوير كتابة المقال الفلسفي في دائرة الفنون الجميلة (Círculo de Bellas Artes) بمدريد.",
                "settingAr": "قاعة الأعمدة، دائرة الفنون الجميلة، مدريد",
                "lines": [
                    {
                        "es": "El ensayo filosófico debe fluir con el ritmo sereno de una prosa meditativa que invite al recogimiento.",
                        "ar": "يجب أن يتدفق المقال الفلسفي بالإيقاع المتأني الساكن لنثر تأملي عميق يدعو القارئ للسكينة والاستبطان.",
                        "arEg": "المقال الفلسفي لازم يمشي بإيقاع هادي ونغم تأملي عميق يخلي القارئ يقعد مع نفسه ويفكر براحة.",
                        "audioKey": "pending/c1-u8-ens-1"
                    },
                    {
                        "es": "A través de la experiencia estética, el ser humano intuye una forma superior de trascendencia.",
                        "ar": "عبر التجربة الجمالية الخالصة، يستشعر الكائن البشري نمطاً أسمى وأرفع من التجرد والتعالي الوجودي.",
                        "arEg": "من خلال تذوق الفن والجمال، الإنسان بيحس بحاجة أكبر وأسمى بكتير من المادة ومشاكل اليومية.",
                        "audioKey": "pending/c1-u8-ens-2"
                    },
                    {
                        "es": "La dialéctica entre la memoria viva y el olvido forja la identidad de las civilizaciones.",
                        "ar": "إن الجدل الديالكتيكي بين الذاكرة الحية والنسيان هو الذي يصوغ ويبني هوية الحضارات الإنسانية.",
                        "arEg": "الصراع والجدل المستمر بين الذاكرة اللي مش بتموت وبين النسيان هو اللي بيشكل شخصية أي حضارة في التاريخ.",
                        "audioKey": "pending/c1-u8-ens-3"
                    },
                    {
                        "es": "Es indispensable asegurar una perfecta cohesión entre los estratos especulativos del discurso.",
                        "ar": "من الضروري للغاية تأمين اتساق وترابط محكم لا انفصام فيه بين الطبقات التأملية النظرية لهذا الخطاب.",
                        "arEg": "لازم نضمن ترابط واتساق ميه في الميه بين الأفكار الفلسفية اللي بنطرحها عشان المقال يبقى كتلة واحدة متماسكة.",
                        "audioKey": "pending/c1-u8-ens-4"
                    }
                ]
            }
        ],
        "mastery": {
            "minAccuracy": 70,
            "minCorrectExercises": 6,
            "requiredExerciseTypes": ["listen_choose", "word_choice", "fill_blank"]
        },
        "unlock": {"type": "sequential"},
        "offlinePriority": 1,
        "review": review_block()
    }
    
    exs = [
        choice_ex(
            "ex-c1-ecu-1", "listen_choose",
            "استمع إلى حديث أستاذ الفلسفة واكتشف النمط النثري الذي دعا إليه لتحفيز الفكر والتأمل الباطني.",
            ["listening", "vocabulary"], 1,
            "ما هو النمط النثري الملائم لكتابة المقال الفلسفي الثقافي الرفيع؟",
            "El ensayo filosófico debe fluir con el ritmo sereno de una prosa meditativa que invite al recogimiento.",
            "يجب أن يتدفق المقال الفلسفي بالإيقاع المتأني الساكن لنثر تأملي عميق يدعو القارئ للسكينة والاستبطان.",
            [
                opt("a", "Una prosa meditativa y serena", "نثر تأملي رصين وهادئ يدعو لاستبطان المعاني", True),
                opt("b", "Un titular sensacionalista y chillón", "عنوان صحفي فضائحي مثير ومبتذل", False, "يناقض وقار الفلسفة والتأمل."),
                opt("c", "Una lista desordenada de la compra", "قائمة مشتريات عشوائية للبيت", False, "خارج السياق الفكري كلياً.")
            ],
            ["meditativa", "estética"],
            "«La prosa meditativa» هي أسلوب كبار المفكرين كأونامونو وثامبرانو ومونتيني، حيث تسير الجمل بتأنٍ مدروس يتيح للعقل هضم الأفكار المجردة.",
            "pending/c1-u8-ens-1",
            "El ensayo filosófico debe fluir con el ritmo sereno de una prosa meditativa que invite al recogimiento."
        ),
        choice_ex(
            "ex-c1-ecu-2", "word_choice",
            "ما هو المفهوم الفلسفي المعبر عن «تجاوز المادة والحدود الضيقة للعالم المحسوس نحو المطلق»؟",
            ["reading", "vocabulary"], 1,
            "اختر المصطلح المعبر عن التعالي والتسامي الوجودي:",
            "El arte aspira a dotar a la existencia cotidiana de un anhelo de ____ espiritual.",
            "يصبو الفن الرفيع إلى إسباغ شوق وتطلع للتعالي والتسامي الروحي على تفاصيل الحياة اليومية.",
            [
                opt("a", "trascendencia", "التسامي والتجرد وتجاوز حدود الزوال المادي", True),
                opt("b", "trivialidad", "الابتذال والتفاهة والسقوط في الرداءة", False, "عكس السمو الفني والروحي."),
                opt("c", "trampa", "الفخ والخديعة الرخيصة", False, "لا يمت للفلسفة الجمالية بصلة.")
            ],
            ["trascendencia", "dialéctica"],
            "«La trascendencia» في الفلسفة وعلم الجمال هي قدرة الروح البشرية على الارتقاء فوق الواقع الفاني وملامسة المعنى الخالد للوجود."
        ),
        fill_ex(
            "ex-c1-ecu-3",
            "أكمل المصطلح اللساني والنقدي الدال على ترابط أجزاء النص وتلاحم فقراته تلاحماً منطقياً: «la ____ textual».",
            ["vocabulary", "writing"], 2,
            "اكتب الكلمة المعبرة عن الاتساق والتماسك العضوي للنص:",
            "Un ensayo magistral se distingue por la impecable ____ lógica entre sus párrafos.",
            "يتميز المقال الفلسفي البارع بالاتساق والترابط المنطقي الذي لا تشوبه شائبة بين كافة فقراته.",
            ["cohesión"],
            ["cohesión"],
            "«La cohesión textual» هي التماسك الشكلي والمعنوي الذي يربط الجمل والأفكار عبر روابط ملائمة بحيث يبدو المقال نسيجاً متكاملاً لا انفصام فيه."
        ),
        choice_ex(
            "ex-c1-ecu-4", "word_choice",
            "ما هي المنهجية الفلسفية القائمة على حوار الأضداد وتفاعل الفكرة مع نقيضها لإنتاج مركب أسمى؟",
            ["vocabulary", "reading"], 1,
            "اختر المنهج الجدلي الحواري المعبر عن تطور الفكر:",
            "El pensador despliega una rigurosa ____ entre razón teórica y sensibilidad poética.",
            "يبسط المفكر جدلاً وحواراً ديالكتيكياً صارماً بين العقل النظري والحساسية الشعرية.",
            [
                opt("a", "dialéctica", "الديالكتيك / الجدل الفلسفي التفاعلي بين الأضداد", True),
                opt("b", "distracción", "تشتت الذهن والغفلة والسهو", False, "عجز ذهني يتنافى مع الصرامة."),
                opt("c", "diversión", "المرح والتسلية والألعاب الخفيفة", False, "ليست منهجاً فلسفياً.")
            ],
            ["dialéctica", "rigor"],
            "«La dialéctica» هي فن المناظرة والحركة التطورية للفكر التي تختبر الفكرة بنقيضها وصولاً إلى تركيب فكري أكثر شمولاً ونضجاً."
        ),
        order_ex(
            "ex-c1-ecu-5",
            "رتب الكلمات لبناء حكم فلسفي يربط بين الفن والسمو الإنساني.",
            ["grammar", "writing"], 2,
            ["El", "arte", "busca", "la", "trascendencia", "humana"],
            "El arte busca la trascendencia humana",
            "المبتدأ El arte يليه الفعل المتعدي busca والمفعول به la trascendencia والصفة humana.",
            ["trascendencia"]
        ),
        speak_ex(
            "ex-c1-ecu-6",
            "انطق هذه الجملة بنبرة فيلسوف متأمل يتحدث في سكينة وهيبة فكرية بالغة.",
            ["speaking", "pronunciation"], 2,
            "نطق سليم مراعياً الوقفات البلاغية المعبرة:",
            "La experiencia estética nos conduce a la trascendencia.",
            "تقودنا التجربة الجمالية الخالصة إلى السمو والتسامي الوجودي الأرفع.",
            "pending/c1-u8-ens-spk",
            ["trascendencia", "estética"],
            "La experiencia estética nos conduce a la trascendencia.",
            "احرص على سلامة نبر كلمة estética على مقطع -té- ونطق حرف s في trascendencia بهدوء ووقار رفيع."
        )
    ]
    return lesson_doc(doc, exs, "C1")


def make_lesson_discurso_conmemorativo():
    slug = "c1-discurso-conmemorativo"
    titleAr = "الخطب الاحتفالية والمحاضرات التكريمية: El discurso conmemorativo y la oratoria solemne"
    objAr = "أن يلقي المتعلم خطبة احتفالية أو محاضرة افتتاحية جامعة (discurso magistral / laudatio) مستخدماً البلاغة الكلاسيكية والبيان المؤثر (elocuencia, homenaje, solemne, magno)."
    
    newVocab = ["magistral", "elocuencia", "homenaje", "solemne", "magno", "rigor"]
    revVocab = ["tiempo", "sociedad", "bien", "trabajo"]
    
    doc = {
        "slug": slug,
        "titleAr": titleAr,
        "level": "C1",
        "programSlug": "main-track",
        "unitSlug": "c1-u8-advanced-writing",
        "objectiveAr": objAr,
        "estimatedMinutes": 12,
        "skills": ["grammar", "reading", "writing", "listening", "vocabulary"],
        "newVocabulary": newVocab,
        "reviewVocabulary": revVocab,
        "targetStructures": [
            "Fórmulas de exordio solemne: congregarse para rendir un merecido homenaje",
            "Laudatio académica: ensalzar los méritos imperecederos de una trayectoria magna",
            "Recursos de la elocuencia clásica: anáforas rítmicas, períodos amplios y clímax",
            "Peroración conmovedora: apelación al legado perenne ante la posteridad"
        ],
        "grammarTopics": ["oratoria-solemne-c1", "laudatio-y-discursos-magistrales"],
        "scenarios": [
            {
                "contextAr": "حفل تسليم جائزة ثربانتس للآداب في القاعة الكبرى (Paraninfo) بجامعة ألكالا دي إيناريس.",
                "settingAr": "مدرج جامعة ألكالا التاريخي، ألكالا دي إيناريس، مدريد",
                "lines": [
                    {
                        "es": "Nos congrega hoy en este paraninfo histórico un motivo de honda solemnidad institucional.",
                        "ar": "تجمعنا اليوم في هذا المدرج الجامعي التاريخي مناسبة ذات وقار ومهابة مؤسسية عميقة.",
                        "arEg": "متجمعين النهاردة في هذا الصرح التاريخي العريق في مناسبة ليها هيبة ووقار كبير في قلوبنا كلنا.",
                        "audioKey": "pending/c1-u8-dis-1"
                    },
                    {
                        "es": "Nos reunimos para rendir un tributo y homenaje imperecedero a una vida entregada a las letras.",
                        "ar": "نلتئم هاهنا لنزجي آيات التكريم والإجلال الخالد لمسيرة حياة نُذرت لخدمة لغة الضاد والأدب الإنساني.",
                        "arEg": "إحنا متجمعين عشان نكرم ونوجه تحية تقدير وإجلال خالدة لشخص كرّس عمره كله لخدمة الأدب والكلمة الصادقة.",
                        "audioKey": "pending/c1-u8-dis-2"
                    },
                    {
                        "es": "Su magno magisterio ha dejado una huella indeleble en varias generaciones de hispanistas.",
                        "ar": "لقد تركت أستاذيته الكبرى ورسالته التربوية الجليلة أثراً لا يُمحى في وجدان أجيال متعاقبة من دارسي الإسبانية.",
                        "arEg": "عطاؤه العظيم وأستاذيته الكبيرة سابت بصمة وعلامة مش هتتمحي أبداً في أجيال الباحثين والمحبين للغة.",
                        "audioKey": "pending/c1-u8-dis-3"
                    },
                    {
                        "es": "La elocuencia conmovedora de sus palabras seguirá inspirándonos en la incansable búsqueda de la belleza.",
                        "ar": "إن البلاغة الآسرة لكلماته ستظل مصدر إلهام لنا جميعاً في سعينا الدؤوب نحو معانقة الجمال السامي.",
                        "arEg": "الفصاحة والبلاغة اللي بتهز القلوب في كلامه هتفضل تنور طريقنا وإحنا بندور على الجمال والحق.",
                        "audioKey": "pending/c1-u8-dis-4"
                    }
                ]
            }
        ],
        "mastery": {
            "minAccuracy": 70,
            "minCorrectExercises": 6,
            "requiredExerciseTypes": ["listen_choose", "word_choice", "fill_blank"]
        },
        "unlock": {"type": "sequential"},
        "offlinePriority": 1,
        "review": review_block()
    }
    
    exs = [
        choice_ex(
            "ex-c1-dco-1", "listen_choose",
            "استمع إلى مستهل الخطبة الأكاديمية وحدد الغاية العظمى التي اجتمع الحاضرون لأجلها في المدرج التاريخي.",
            ["listening", "vocabulary"], 1,
            "ما هي الغاية النبيلة التي دعت الحضور للالتئام في هذا الحفل الجامعي؟",
            "Nos reunimos para rendir un tributo y homenaje imperecedero a una vida entregada a las letras.",
            "نلتئم هاهنا لنزجي آيات التكريم والإجلال الخالد لمسيرة حياة نُذرت لخدمة لغة الأدب الإنساني.",
            [
                opt("a", "Rendir un homenaje imperecedero a una trayectoria ejemplar", "إزجاء التكريم والإجلال الخالد لمسيرة حياة رائدة", True),
                opt("b", "Repartir premios de la lotería nacional", "توزيع تذاكر اليانصيب وأموال الحظ", False, "خارج الإطار التكريمي الأكاديمي."),
                opt("c", "Protestar por el mal tiempo en la ciudad", "الاحتجاج على هطول المطر وبرودة الجو", False, "لا صلة له بمراسم التكريم.")
            ],
            ["homenaje", "solemne"],
            "تعبير «rendir homenaje» هو التعبير الفصيح لتقديم التكريم والتقدير الرسمي المستحق لشخصية قدمت إسهامات جليلة للمجتمع والثقافة.",
            "pending/c1-u8-dis-2",
            "Nos reunimos para rendir un tributo y homenaje imperecedero a una vida entregada a las letras."
        ),
        choice_ex(
            "ex-c1-dco-2", "word_choice",
            "ما هي الملكة البيانية والخطابية العظمى التي تعني «الفصاحة الساحرة والقدرة على هز الوجدان والتأثير في السامعين»؟",
            ["reading", "vocabulary"], 1,
            "اختر الكلمة الكلاسيكية المعبرة عن البيان الساحر والفصاحة المؤثرة:",
            "El orador cautivó al auditorio gracias a su prodigiosa ____ verbal.",
            "سحر الخطيب المفوه قلوب الحاضرين بفضل فصاحته وبيانه المعجز وبلاغته اللفظية الأخاذة.",
            [
                opt("a", "elocuencia", "الفصاحة والبلاغة الآسرة وقوة البيان والتأثير", True),
                opt("b", "tartamudez", "التأتأة والتلعثم والتعثر في النطق", False, "عاهة نطقية تناقض الفصاحة."),
                opt("c", "timidez", "الخجل الشديد والرهاب من مواجهة الناس", False, "يمنع الخطابة العامة.")
            ],
            ["elocuencia", "magistral"],
            "«La elocuencia» هي قمة فن الخطابة الكلاسيكية، وتجمع بين دقة المعنى وجرس الإيقاع والقدرة على تحريك مشاعر الجماهير وإقناعهم."
        ),
        fill_ex(
            "ex-c1-dco-3",
            "أكمل الجملة بالصفة الكبرى الدالة على الجلالة والعظمة الفائقة للحدث أو العمل: «un acontecimiento ____».",
            ["vocabulary", "writing"], 2,
            "اكتب الصفة المعبرة عن العظمة والمهابة الاستثنائية:",
            "La celebración del centenario de la universidad fue un acontecimiento ____ que congregó a sabios de todo el orbe.",
            "كان الاحتفال بمئوية الجامعة حدثاً جليلاً هائلاً جمع كبار العلماء والمفكرين من كل بقاع الأرض.",
            ["magno"],
            ["magno"],
            "الصفة التراثية الفصيحة «magno» (من اللاتينية magnus) تفيد العظمة البالغة والأهمية التاريخية الفائقة كقولنا «obra magna» أو «evento magno»."
        ),
        choice_ex(
            "ex-c1-dco-4", "word_choice",
            "ماذا يسمى الخطاب الرفيع أو الدرس النموذجي البارع الذي يلقيه أستاذ علامة في افتتاح العام الجامعي؟",
            ["vocabulary", "reading"], 1,
            "اختر الوصف الدقيق للدرس الافتتاحي الرفيع:",
            "El catedrático emérito pronunció una lección ____ que fue ovacionada por todos los decanos.",
            "ألقى الأستاذ المتفرغ المرموق محاضرة ودرساً افتتاحياً جامعاً قوبل بعاصفة من التصفيق الحار من كافة العمداء.",
            [
                opt("a", "magistral", "درس أستاذي جامع ومتقن يمثل ذروة العلم والبيان", True),
                opt("b", "mediocre", "سطحي وركيك ومبتذل لا قيمة له", False, "حكم تحقيري مناقض للتميز."),
                opt("c", "infantil", "طفولي ساذج موجه للصغار", False, "لا يلقى في مدرجات الجامعات الكبرى.")
            ],
            ["magistral", "solemne"],
            "«Una lección magistral» (أو discurso magistral) هو الخطاب الأكاديمي النموذجي الذي يتوج المناسبات الرسمية ويفيض بالمعرفة العميقة."
        ),
        order_ex(
            "ex-c1-dco-5",
            "رتب الكلمات لبناء استهلال خطابي وقور يعبر عن إجلال الحضور للمناسبة.",
            ["grammar", "writing"], 2,
            ["Rendimos", "un", "solemne", "homenaje", "al", "maestro"],
            "Rendimos un solemne homenaje al maestro",
            "الفعل Rendimos متبوعاً بالمفعول به un solemne homenaje وجار ومجرور al maestro.",
            ["solemne", "homenaje"]
        ),
        speak_ex(
            "ex-c1-dco-6",
            "انطق هذه الجملة بنبرة خطيب مفوه يقف في محراب العلم والأدب ممتلئاً بالوقار والجلال.",
            ["speaking", "pronunciation"], 2,
            "نطق سليم مراعياً الرنين الخطابي الفخم للمفردات:",
            "Su elocuencia magistral perdura en la memoria.",
            "إن فصاحته الأستاذية الباهرة تخلد وتبقى حية في ذاكرة الأجيال.",
            "pending/c1-u8-dis-spk",
            ["elocuencia", "magistral"],
            "Su elocuencia magistral perdura en la memoria.",
            "احرص على ملء الرئتين بالنفس ونطق مقطع -cuen- في elocuencia بنغم صاعد ونبر magistral على المقطع الأخير بوقار."
        )
    ]
    return lesson_doc(doc, exs, "C1")
