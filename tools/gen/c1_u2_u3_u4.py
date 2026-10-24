# -*- coding: utf-8 -*-
"""Generator for Level C1 Units 2, 3, and 4 (12 lessons):
- Unit 2: c1-u2-idioms (4 lessons)
- Unit 3: c1-u3-academic-discourse (4 lessons)
- Unit 4: c1-u4-literature (4 lessons)
"""
import sys
import os

from common import opt, choice_ex, fill_ex, order_ex, speak_ex, lesson_doc, review_block

# -------------------------------------------------------------
# UNIT 2: c1-u2-idioms (التعبيرات الاصطلاحية والأمثال المتقدمة)
# -------------------------------------------------------------

def make_lesson_locuciones_adverbiales():
    slug = "c1-locuciones-adverbiales"
    titleAr = "العبارات الظرفية البليغة في الخطاب الرفيع: Locuciones adverbiales"
    objAr = "أن يوظف المتعلم العبارات الظرفية الدقيقة (por ende, a regañadientes, a ciencia cierta, de cabo a rabo) لربط الأفكار وبيان الكيفية في سياقات راقية."
    
    newVocab = ["ende", "regañadientes", "cierta", "rabo", "antonomasia", "rigor"]
    revVocab = ["tiempo", "sociedad", "bien", "trabajo"]
    
    doc = {
        "slug": slug,
        "titleAr": titleAr,
        "level": "C1",
        "programSlug": "main-track",
        "unitSlug": "c1-u2-idioms",
        "objectiveAr": objAr,
        "estimatedMinutes": 12,
        "skills": ["grammar", "reading", "writing", "listening", "vocabulary"],
        "newVocabulary": newVocab,
        "reviewVocabulary": revVocab,
        "targetStructures": [
            "Uso de 'por ende' como conector consecutivo culto",
            "Locución de modo 'a regañadientes' para expresar reticencia",
            "Locución de certeza 'a ciencia cierta' frente a la duda",
            "Locución 'de cabo a rabo' para totalidad exhaustiva"
        ],
        "grammarTopics": ["locuciones-adverbiales-c1", "registro-formal-culto"],
        "scenarios": [
            {
                "contextAr": "حوار بين مستشارين قانونيين في مدريد يحللان وثيقة تعاقدية معقدة.",
                "settingAr": "مكتب استشارات قانونية في حي سالامانكا",
                "lines": [
                    {
                        "es": "Hemos examinado el pliego de condiciones de cabo a rabo sin hallar ninguna anomalía.",
                        "ar": "لقد فحصنا كراسة الشروط من أولها إلى آخرها دون أن نعثر على أي شائبة.",
                        "arEg": "راجعنا كراسة الشروط من طقطق لسلامو عليكم وملقيناش أي غلطة.",
                        "audioKey": "pending/c1-u2-loc-1"
                    },
                    {
                        "es": "No obstante, no podemos afirmar a ciencia cierta que la otra parte firme voluntariamente.",
                        "ar": "ومع ذلك، لا يمكننا أن نجزم على وجه اليقين بأن الطرف الآخر سيوقع طواعية.",
                        "arEg": "بس مع ذلك منقدرش نأكد مليون في المية إن الطرف التاني هيمضي بمزاجه.",
                        "audioKey": "pending/c1-u2-loc-2"
                    },
                    {
                        "es": "El director aceptó las cláusulas a regañadientes tras horas de ardua deliberación.",
                        "ar": "قبل المدير البنود على مضض بعد ساعات من المداولات الشاقة.",
                        "arEg": "المدير وافق على الشروط على مضض ومغصوب بعد مناهدة ساعات طويلة.",
                        "audioKey": "pending/c1-u2-loc-3"
                    },
                    {
                        "es": "El acuerdo es vinculante y, por ende, de obligado cumplimiento para ambas partes.",
                        "ar": "الاتفاق ملزم ومن ثَمَّ، فهو واجب النفاذ على كلا الطرفين.",
                        "arEg": "الاتفاق قانوني وملزم، وبالتالي واجب التنفيذ على الطرفين من غير كلام.",
                        "audioKey": "pending/c1-u2-loc-4"
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
            "ex-c1-lad-1", "listen_choose",
            "استمع إلى المستشار ولاحظ كيف عبّر عن فحص الوثيقة بالكامل دون إغفال أي تفصيل.",
            ["listening", "vocabulary"], 1,
            "ما التعبير البليغ الذي استخدمه المستشار للدلالة على الفحص الشامل؟",
            "Hemos examinado el pliego de condiciones de cabo a rabo sin hallar ninguna anomalía.",
            "لقد فحصنا كراسة الشروط من أولها إلى آخرها دون أن نعثر على أي شائبة.",
            [
                opt("a", "De cabo a rabo", "من البداية إلى النهاية بدقة متناهية", True),
                opt("b", "A la ligera", "بسذاجة وتسرع وسطحية", False, "عكس المعنى المقصود تماماً."),
                opt("c", "Por encima", "بشكل عابر وبلا اهتمام", False, "تدل على الإهمال لا الشمولية.")
            ],
            ["rabo", "cierta"],
            "تعبير «de cabo a rabo» يفيد الإحاطة الكاملة بالأمر من أوله لآخره دون ترك شاردة ولا واردة.",
            "pending/c1-u2-loc-1",
            "Hemos examinado el pliego de condiciones de cabo a rabo sin hallar ninguna anomalía."
        ),
        choice_ex(
            "ex-c1-lad-2", "word_choice",
            "أي من العبارات التالية تفيد النتيجة المترتبة بأسلوب أكاديمي رفيع بديلاً عن «por eso»؟",
            ["grammar", "reading"], 1,
            "اختر الرابط السببي والنتيجي الراقي المناسب للسياق الأكاديمي:",
            "El proyecto carece de fondos y, ____, no podrá ejecutarse este año.",
            "المشروع يفتقر إلى التمويل، ومن ثمَّ لن يتسنى تنفيذه هذا العام.",
            [
                opt("a", "por ende", "ومن ثَمَّ / وتبعاً لذلك", True),
                opt("b", "a regañadientes", "على مضض وكره", False, "تصف كيفية القيام بفعل وليست رابطاً استنتاجياً."),
                opt("c", "a ciencia cierta", "على وجه اليقين التام", False, "تفيد درجة التيقن المعرفي.")
            ],
            ["ende", "rigor"],
            "تعد «por ende» من أرقى الروابط التتابعية الاستنتاجية في الفصحى وتفيد الترتيب السببي الصارم."
        ),
        fill_ex(
            "ex-c1-lad-3",
            "أكمل الجملة بالكلمة التي تشكل التعبير الدال على الامتثال على كره وإكراه معنوي: «a ____».",
            ["vocabulary", "writing"], 2,
            "اكتب الكلمة المناسبة بالفراغ:",
            "El testigo declaró a ____ ante el juez instructor.",
            "أدلى الشاهد بأقواله على مضض أمام قاضي التحقيق.",
            ["regañadientes"],
            ["regañadientes"],
            "العبارة الظرفية المركبة هي «a regañadientes» وتدل على القيام بالعمل مع وجود ممانعة داخلية شديدة."
        ),
        choice_ex(
            "ex-c1-lad-4", "word_choice",
            "كيف تعبر بأسلوب C1 راقٍ عن معرفة الشيء بيقين قاطع لا مراء فيه؟",
            ["vocabulary", "reading"], 1,
            "اختر التعبير الدال على المعرفة اليقينية الصادقة:",
            "Nadie sabe ____ cuál será el veredicto del tribunal.",
            "لا أحد يعلم على وجه اليقين ما سيكون عليه حكم المحكمة.",
            [
                opt("a", "a ciencia cierta", "على وجه اليقين القاطع", True),
                opt("b", "de oídas", "عن طريق السماع والشائعات", False, "تفيد الشك وتناقل الأخبار غير الموثوقة."),
                opt("c", "a ciegas", "على عمى وبلا بصيرة", False, "تفيد انعدام الرؤية والجهل بالنتائج.")
            ],
            ["cierta", "rigor"],
            "يقال «saber a ciencia cierta» للدلالة على المعرفة القائمة على أدلة دامغة لا تقبل الشك."
        ),
        order_ex(
            "ex-c1-lad-5",
            "رتب الكلمات لتكوين عبارة أكاديمية تصف المدينة بأنها النموذج الأسمى للنهضة المعمارية مستخدماً «por antonomasia».",
            ["grammar", "writing"], 2,
            ["Es", "la", "ciudad", "renacentista", "por", "antonomasia"],
            "Es la ciudad renacentista por antonomasia",
            "تستخدم عبارة «por antonomasia» لبيان أن الموصوف هو الممثل الأبرز والأعظم لجنسه ونوعه.",
            ["antonomasia"]
        ),
        speak_ex(
            "ex-c1-lad-6",
            "انطق هذه الجملة بنبرة حازمة تعبر عن الإلزام القانوني المطلق الناتج عن العقد.",
            ["speaking", "pronunciation"], 2,
            "نطق سليم مراعياً نبر الكلمات:",
            "El pacto es legal y, por ende, vinculante.",
            "المعاهدة قانونية ومن ثَمَّ فهي ملزمة.",
            "pending/c1-u2-loc-spk",
            ["ende", "rigor"],
            "El pacto es legal y, por ende, vinculante.",
            "احرص على الفصل الصوتي الطفيف بعد الرابط «por ende» لإبراز التبعية المنطقية في الخطاب القضائي."
        )
    ]
    return lesson_doc(doc, exs, "C1")


def make_lesson_modismos_cultos():
    slug = "c1-modismos-cultos"
    titleAr = "المجازات الاصطلاحية الراقية: Modismos cultos y metáforas vivas"
    objAr = "أن يفهم المتعلم ويوظف الكنايات الراقية في الخطاب الصحفي والفكري (poner el dedo en la llaga, marear la perdiz, hacer la vista gorda)."
    
    newVocab = ["llaga", "perdiz", "gorda", "bacalao", "dedo", "rigor"]
    revVocab = ["tiempo", "sociedad", "bien", "trabajo"]
    
    doc = {
        "slug": slug,
        "titleAr": titleAr,
        "level": "C1",
        "programSlug": "main-track",
        "unitSlug": "c1-u2-idioms",
        "objectiveAr": objAr,
        "estimatedMinutes": 12,
        "skills": ["grammar", "reading", "writing", "listening", "vocabulary"],
        "newVocabulary": newVocab,
        "reviewVocabulary": revVocab,
        "targetStructures": [
            "Poner el dedo en la llaga: señalar el núcleo espinoso del problema",
            "Marear la perdiz: dar rodeos innecesarios para dilatar la decisión",
            "Hacer la vista gorda: tolerar una falta fingiendo no haberla visto",
            "Cortar el bacalao: ostentar el mando y poder de decisión efectivo"
        ],
        "grammarTopics": ["modismos-cultos", "expresiones-idiomaticas-c1"],
        "scenarios": [
            {
                "contextAr": "مناظرة تلفزيونية بين محللين سياسيين حول سياسات الإصلاح الاقتصادي والبيروقراطية.",
                "settingAr": "استوديو الأخبار والتحليلات السياسية في مدريد",
                "lines": [
                    {
                        "es": "El editorialista ha puesto el dedo en la llaga al denunciar la evasión fiscal sistémica.",
                        "ar": "لقد وضع كاتب الافتتاحية إصبعه على الجرح عندما ندد بالتهرب الضريبي الهيكلي.",
                        "arEg": "كاتب المقال لمس الجرح بالظبط لما فضح التهرب الضريبي المنتشر.",
                        "audioKey": "pending/c1-u2-mod-1"
                    },
                    {
                        "es": "El comité se dedica a marear la perdiz para aplazar la votación decisiva.",
                        "ar": "اللجنة لا تفعل شيئاً سوى المماطلة وتضييع الوقت لإرجاء التصويت الحاسم.",
                        "arEg": "اللجنة عمالة تلف وتدور وتماطل عشان تأجل التصويت المهم وخلاص.",
                        "audioKey": "pending/c1-u2-mod-2"
                    },
                    {
                        "es": "Las autoridades no pueden seguir haciendo la vista gorda ante semejante arbitrariedad.",
                        "ar": "لا يجوز للسلطات أن تستمر في غض الطرف وتجاهل هذا التعسف الصارخ.",
                        "arEg": "مينفعش المسؤولين يغمضوا عينيهم ويطنشوا الظلم والتعسف الفاقع ده.",
                        "audioKey": "pending/c1-u2-mod-3"
                    },
                    {
                        "es": "En esa corporación todos saben quién corta el bacalao en los momentos críticos.",
                        "ar": "في تلك المؤسسة يعلم الجميع من هو صاحب الكلمة النافذة وقت الأزمات.",
                        "arEg": "في الشركة دي الكل عارف مين الآمر الناهي واللي كلمته سيف وقت الجد.",
                        "audioKey": "pending/c1-u2-mod-4"
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
            "ex-c1-mcu-1", "listen_choose",
            "استمع إلى تعليق المحلل السياسي وحدد التعبير الذي استخدمه لوصف تحديد موضع الخلل بدقة بالغة.",
            ["listening", "vocabulary"], 1,
            "ما التعبير المجازي المستخدم للدلالة على إصابة كبد الحقيقة؟",
            "El editorialista ha puesto el dedo en la llaga al denunciar la evasión fiscal sistémica.",
            "لقد وضع كاتب الافتتاحية إصبعه على الجرح عندما ندد بالتهرب الضريبي الهيكلي.",
            [
                opt("a", "Poner el dedo en la llaga", "وضع الإصبع على مكمن الألم والجرح الحقيقي", True),
                opt("b", "Tirar la toalla", "الاستسلام وإعلان الهزيمة", False, "معنى رياضي يفيد التراجع."),
                opt("c", "Echar leña al fuego", "إشعال الفتنة وتأجيج الصراع", False, "تفيد تصعيد النزاع لا تشخيصه.")
            ],
            ["dedo", "llaga"],
            "«Poner el dedo en la llaga» يعني تشخيص صلب المشكلة الشائكة دون مواربة مهما كان ذلك مؤلماً.",
            "pending/c1-u2-mod-1",
            "El editorialista ha puesto el dedo en la llaga al denunciar la evasión fiscal sistémica."
        ),
        choice_ex(
            "ex-c1-mcu-2", "word_choice",
            "ماذا يعني التعبير «marear la perdiz» في المحادثات الرسمية ومفاوضات العمل؟",
            ["reading", "vocabulary"], 1,
            "اختر الدلالة الاصطلاحية الدقيقة للتعبير:",
            "No marees más la perdiz y dinos tu propuesta final.",
            "كفاك مماطلة ولفاً ودوراناً وأخبرنا بعرضك النهائي.",
            [
                opt("a", "Dar rodeos innecesarios para perder el tiempo", "المماطلة وافتعال تفاصيل لتأخير القرار", True),
                opt("b", "Cazar aves en el bosque", "صيد الطيور والحيوانات في البرية", False, "المعنى الحرفي غير مقصود إطلاقاً."),
                opt("c", "Hablar con absoluta franqueza", "التحدث بصراحة مطلقة ووضوح تام", False, "عكس المعنى المراد تماماً.")
            ],
            ["perdiz", "rigor"],
            "يقال «marear la perdiz» لمن يراوغ ويضيع الوقت بحجج واهية لتفادي مواجهة القرار المطلوب."
        ),
        fill_ex(
            "ex-c1-mcu-3",
            "أكمل التعبير الذي يعني التغاضي المتعمد عن الخطأ وتمريره دون محاسبة: «hacer la vista ____».",
            ["vocabulary", "writing"], 2,
            "اكتب الكلمة الناقصة لتكوين المصطلح الفصيح:",
            "El inspector decidió hacer la vista ____ ante la falta leve.",
            "قرر المفتش التغاضي وغض الطرف عن المخالفة البسيطة.",
            ["gorda"],
            ["gorda"],
            "المصطلح الثابت في الإسبانية الفصيحة هو «hacer la vista gorda» ويعني التظاهر بعدم ملاحظة الخلل للتسامح معه."
        ),
        choice_ex(
            "ex-c1-mcu-4", "word_choice",
            "ما التعبير الدال على امتلاك السلطة الحقيقية وإدارة شؤون المنظمة في الكواليس؟",
            ["vocabulary", "reading"], 1,
            "اختر التعبير الاصطلاحي المعبر عن صاحب القرار النافذ:",
            "Aunque parezca un asesor secundario, es él quien ____ en el partido.",
            "على الرغم من أنه يبدو مستشاراً ثانوياً، إلا أنه هو صاحب الكلمة النافذة في الحزب.",
            [
                opt("a", "corta el bacalao", "يملك زمام القرار الفعلي ويدير الأمور", True),
                opt("b", "da la lata", "يزعج الآخرين بثرثرة تافهة", False, "تفيد الإزعاج والمضايقة فقط."),
                opt("c", "paga el pato", "يتحمل وزر أخطاء غيره بلا ذنب", False, "كبش فداء وليس صاحب سلطة.")
            ],
            ["bacalao", "rigor"],
            "كناية «cortar el bacalao» مأخوذة من توزيع المؤن قديماً، وتطلق على من يملك السلطة الحقيقية وتوزيع النفوذ."
        ),
        order_ex(
            "ex-c1-mcu-5",
            "رتب الكلمات لتكوين جملة نقدية تدعو لمواجهة جوهر القضية دون دوران.",
            ["grammar", "writing"], 2,
            ["Debemos", "poner", "el", "dedo", "en", "la", "llaga"],
            "Debemos poner el dedo en la llaga",
            "التركيب الفصيح: الفاعل ثم الفعل المساعد والمصدر والتعبير الاصطلاحي في موضعه المعتمد.",
            ["dedo", "llaga"]
        ),
        speak_ex(
            "ex-c1-mcu-6",
            "انطق هذه الجملة بنبرة استنكارية واضحة ترفض التواطؤ وغض البصر عن التجاوزات.",
            ["speaking", "pronunciation"], 2,
            "نطق سليم مراعياً الإيقاع الخطابي:",
            "No podemos hacer la vista gorda ante el fraude.",
            "لا يمكننا غض الطرف وتجاهل هذا الاحتيال.",
            "pending/c1-u2-mod-spk",
            ["gorda", "rigor"],
            "No podemos hacer la vista gorda ante el fraude.",
            "تأكد من النطق السليم لحرف d بين الصائتين في fraude وإعطاء العبارة الاصطلاحية وقارها المكتبي الرفيع."
        )
    ]
    return lesson_doc(doc, exs, "C1")


def make_lesson_refranes_pensamiento():
    slug = "c1-refranes-pensamiento"
    titleAr = "الأمثال التراثية وحكمة الشعوب: Refranes y pensamiento popular"
    objAr = "أن يستوعب المتعلم العمق الفلسفي والتاريخي للأمثال الإسبانية الكبرى ويستخدمها بإيجاز وبلاغة في الخطاب الثقافي."
    
    newVocab = ["madrugar", "amanece", "entendedor", "cerrada", "moscas", "rigor"]
    revVocab = ["tiempo", "sociedad", "bien", "trabajo"]
    
    doc = {
        "slug": slug,
        "titleAr": titleAr,
        "level": "C1",
        "programSlug": "main-track",
        "unitSlug": "c1-u2-idioms",
        "objectiveAr": objAr,
        "estimatedMinutes": 12,
        "skills": ["grammar", "reading", "writing", "listening", "vocabulary"],
        "newVocabulary": newVocab,
        "reviewVocabulary": revVocab,
        "targetStructures": [
            "Refrán de paciencia: No por mucho madrugar amanece más temprano",
            "Refrán de agudeza: A buen entendedor, pocas palabras bastan",
            "Refrán de prudencia: En boca cerrada no entran moscas",
            "Estructuras elípticas y paralelismo rítmico en la paremiología"
        ],
        "grammarTopics": ["paremiologia-espanola", "refranes-clasicos-c1"],
        "scenarios": [
            {
                "contextAr": "نقاش بين أستاذ فلسفة وباحث دكتوراه حول التسرع في استخلاص النتائج الأكاديمية.",
                "settingAr": "مكتبة معهد الفلسفة في المجلس الأعلى للبحوث العلمية (CSIC)",
                "lines": [
                    {
                        "es": "No precipites las conclusiones de tu tesis; recuerda que no por mucho madrugar amanece más temprano.",
                        "ar": "لا تتعجل استخلاص نتائج أطروحتك؛ تذكر أن كثرة التبكير لا تجعل الفجر يبزغ قبل أوانه.",
                        "arEg": "متستعجلش في نتايج رسالتك يا ابني؛ كل حاجة بأوانها ومفيش شروق بييجي قبل وقته.",
                        "audioKey": "pending/c1-u2-ref-1"
                    },
                    {
                        "es": "Tiene razón, profesor; las investigaciones rigurosas demandan maduración y serenidad.",
                        "ar": "معك حق يا أستاذي؛ فالأبحاث الرصينة تتطلب نضجاً وتأنياً عميقين.",
                        "arEg": "عندك حق يا دكتور؛ الأبحاث المعتبرة محتاجة وقت وتأني وصبر طويل.",
                        "audioKey": "pending/c1-u2-ref-2"
                    },
                    {
                        "es": "Exacto, y sé discreto con los datos preliminares: en boca cerrada no entran moscas.",
                        "ar": "تماماً، وكن كتوماً بشأن البيانات الأولية: فالفم المغلق يسلم من ولوج الذباب والزلات.",
                        "arEg": "بالظبط، واكتم على النتايج الأولى ومتبحترش الكلام: لسانك حصانك إن صنته صانك.",
                        "audioKey": "pending/c1-u2-ref-3"
                    },
                    {
                        "es": "Comprendo el mensaje a la perfección; a buen entendedor, pocas palabras bastan.",
                        "ar": "لقد استوعبت الرسالة على أكمل وجه؛ فاللبيب تكفيه الإشارة وأقل الكلام.",
                        "arEg": "فهمت حضرتك تماماً؛ واللبيب بالإشارة يفهم من غير رغي كتير.",
                        "audioKey": "pending/c1-u2-ref-4"
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
            "ex-c1-rpe-1", "listen_choose",
            "استمع إلى نصيحة الأستاذ الفلسفية وحدد المثل التراثي الذي استخدمه للتحذير من التسرع وقهر الطبيعة.",
            ["listening", "vocabulary"], 1,
            "ما المثل الذي يحث على الصبر وانتظار الأوان الطبيعي للأمور؟",
            "No precipites las conclusiones de tu tesis; recuerda que no por mucho madrugar amanece más temprano.",
            "لا تتعجل استخلاص نتائج أطروحتك؛ تذكر أن كثرة التبكير لا تجعل الفجر يبزغ قبل أوانه.",
            [
                opt("a", "No por mucho madrugar amanece más temprano", "الاستعجال المفرط لا يسرع حدوث الأشياء المقدرة", True),
                opt("b", "A caballo regalado no le mires el diente", "لا تتفحص عيوب الهدية المهداة إليك", False, "مثل يخص قبول العطايا."),
                opt("c", "Cría cuervos y te sacarán los ojos", "جزاء الإحسان العقوق من اللئيم", False, "مثل يخص نكران الجميل.")
            ],
            ["madrugar", "amanece"],
            "المثل الشهير «No por mucho madrugar amanece más temprano» يعني أن لكل أمر وقتاً طبيعياً لا يتقدم بالتعجل والقلق.",
            "pending/c1-u2-ref-1",
            "No precipites las conclusiones de tu tesis; recuerda que no por mucho madrugar amanece más temprano."
        ),
        choice_ex(
            "ex-c1-rpe-2", "word_choice",
            "أي مثل إسباني يقابل في البلاغة العربية حكمة «اللبيب تكفيه الإشارة»؟",
            ["reading", "vocabulary"], 1,
            "اختر المثل المعبر عن الفطنة والاكتفاء بالقليل من الشرح:",
            "No hace falta que me expliques todos los pormenores: ____.",
            "لا داعي لأن تشرح لي كافة التفاصيل المملة: فاللبيب بالإشارة يفهم.",
            [
                opt("a", "A buen entendedor, pocas palabras bastan", "الفطن تكفيه بضع كلمات يسيرة ليفهم المعنى", True),
                opt("b", "Ojos que no ven, corazón que no siente", "البعيد عن العين بعيد عن القلب والوجدان", False, "يخص المشاعر والغياب."),
                opt("c", "Más vale pájaro en mano que ciento volando", "عصفور في اليد خير من ألف على الشجرة", False, "يخص القناعة بالموجود.")
            ],
            ["entendedor", "rigor"],
            "المثل البلاغي هو «A buen entendedor, pocas palabras bastan» ويدل على سرعة البديهة والذكاء اللماح."
        ),
        fill_ex(
            "ex-c1-rpe-3",
            "أكمل المثل التراثي الداعي للصمت وحفظ السر: «En boca ____ no entran moscas».",
            ["vocabulary", "writing"], 2,
            "اكتب صفة الفم في هذا المثل الخالد:",
            "Sé prudente en tus declaraciones; ya sabes que en boca ____ no entran moscas.",
            "توخّ الحذر في تصريحاتك؛ فأنت تعلم أن الفم المطبق يسلم من الزلات.",
            ["cerrada"],
            ["cerrada"],
            "المثل الإسباني المشهور «En boca cerrada no entran moscas» يعادل «لسانك حصانك» والصمت حكمة لدرء المشاكل."
        ),
        choice_ex(
            "ex-c1-rpe-4", "word_choice",
            "ما هي القيمة الفكرية المركزية في مثل «No por mucho madrugar amanece más temprano»؟",
            ["reading", "grammar"], 1,
            "حدد المعنى البلاغي الفلسفي للمثل:",
            "El refrán subraya la necesidad de respetar los tiempos naturales de cada proceso.",
            "يؤكد المثل على ضرورة احترام الأوقات والمسارات الطبيعية لكل سيرورة عمل.",
            [
                opt("a", "La paciencia y el respeto al ritmo de las cosas", "الصبر واحترام التدرج الزمني الطبيعي للأمور", True),
                opt("b", "El desprecio absoluto por el trabajo duro", "احتقار العمل الجاد وعدم الاستيقاظ باكراً", False, "فهم سطحي خاطئ للألفاظ."),
                opt("c", "La obligación de madrugar todos los días", "وجوب الاستيقاظ قبل الفجر يومياً دون عذر", False, "المثل يدعو للتأني لا مجرد التبكير.")
            ],
            ["madrugar", "amanece"],
            "المثل لا ينهى عن التبكير كقيمة، بل ينهى عن الهوس بالنتائج قبل نضوج شروطها الموضوعية."
        ),
        order_ex(
            "ex-c1-rpe-5",
            "رتب الكلمات لتكوين المثل المشهور عن حفظ اللسان وتجنب الحرج.",
            ["grammar", "writing"], 2,
            ["En", "boca", "cerrada", "no", "entran", "moscas"],
            "En boca cerrada no entran moscas",
            "التركيب التراثي المسجوع: جار ومجرور يليه النفي ثم الفعل والفاعل.",
            ["cerrada", "moscas"]
        ),
        speak_ex(
            "ex-c1-rpe-6",
            "انطق هذا المثل البليغ بنبرة وقورة توحي بالحكمة والاكتفاء بالإيجاز.",
            ["speaking", "pronunciation"], 2,
            "نطق سليم مراعياً الوقفات البلاغية:",
            "A buen entendedor, pocas palabras bastan.",
            "اللبيب بالإشارة يفهم، والقليل من الكلم يجزئ.",
            "pending/c1-u2-ref-spk",
            ["entendedor", "rigor"],
            "A buen entendedor, pocas palabras bastan.",
            "حافظ على الإيقاع الموسيقي والوقفة بعد كلمة entendedor لبيان الصنعة البلاغية للمثل الشعبي."
        )
    ]
    return lesson_doc(doc, exs, "C1")


def make_lesson_metaforas_vida_cultura():
    slug = "c1-metaforas-vida-cultura"
    titleAr = "الاستعارة الحية في الصحافة والفكر: Metáforas en el debate público"
    objAr = "أن يحلل المتعلم ويوظف الاستعارات الكبرى في النقد الفكري والسياسي (talón de Aquiles, navegar contra corriente, poner una pica en Flandes)."
    
    newVocab = ["talon", "corriente", "pica", "brecha", "aquiles", "rigor"]
    revVocab = ["tiempo", "sociedad", "bien", "trabajo"]
    
    doc = {
        "slug": slug,
        "titleAr": titleAr,
        "level": "C1",
        "programSlug": "main-track",
        "unitSlug": "c1-u2-idioms",
        "objectiveAr": objAr,
        "estimatedMinutes": 12,
        "skills": ["grammar", "reading", "writing", "listening", "vocabulary"],
        "newVocabulary": newVocab,
        "reviewVocabulary": revVocab,
        "targetStructures": [
            "Metáfora mitológica: ser el talón de Aquiles (punto vulnerable decisivo)",
            "Metáfora náutica: navegar contra corriente (desafiar el consenso imperante)",
            "Metáfora bélica: abrir una brecha (romper una resistencia consolidada)",
            "Metáfora histórica: poner una pica en Flandes (lograr una hazaña colosal)"
        ],
        "grammarTopics": ["metaforas-conceptuales-c1", "lenguaje-figurado-debate"],
        "scenarios": [
            {
                "contextAr": "ندوة فكرية حول التحديات الاقتصادية والسياسية في العالم المعاصر.",
                "settingAr": "مركز الدراسات الاستراتيجية والدولية في فالنسيا",
                "lines": [
                    {
                        "es": "La dependencia energética sigue constituyendo el talón de Aquiles de la economía comunitaria.",
                        "ar": "ما زالت التبعية في مجال الطاقة تمثل كعب أخيل ونقطة الضعف القاتلة في اقتصاد الاتحاد.",
                        "arEg": "الاعتماد الكامل على طاقة الخارج لسه هو نقطة الضعف اللي قاصفة ضهر الاقتصاد.",
                        "audioKey": "pending/c1-u2-met-1"
                    },
                    {
                        "es": "El pensador no dudó en navegar contra corriente al criticar el conformismo intelectual.",
                        "ar": "لم يتردد المفكر في السباحة ضد التيار حين انتقد الامتثال الفكري والجمود السائد.",
                        "arEg": "المفكر مجلاش وعام ضد التيار لما هاجم النفاق والجمود الفكري المنتشر.",
                        "audioKey": "pending/c1-u2-met-2"
                    },
                    {
                        "es": "Lograr la aprobación unánime de la ley fue como poner una pica en Flandes.",
                        "ar": "كان انتزاع الموافقة بالإجماع على القانون أشبه بإنجاز تاريخي شبه مستحيل.",
                        "arEg": "إنهم ياخدوا موافقة البرلمان بالإجماع كانت معجزة أشبه بشق البحر نصين.",
                        "audioKey": "pending/c1-u2-met-3"
                    },
                    {
                        "es": "Las nuevas tecnologías han abierto una brecha insalvable entre generaciones.",
                        "ar": "لقد فتحت التكنولوجيات الحديثة فجوة وهوة لا يمكن ردمها بين الأجيال.",
                        "arEg": "التكنولوجيا الجديدة فتحت هوة وفجوة واسعة جداً بين جيل الكبار والشباب.",
                        "audioKey": "pending/c1-u2-met-4"
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
            "ex-c1-mvc-1", "listen_choose",
            "استمع إلى حديث المحلل واكتشف الاستعارة الميثولوجية التي استخدمها لوصف نقطة الضعف القاتلة.",
            ["listening", "vocabulary"], 1,
            "ما التعبير الاستعاري المستخدم لتوصيف الضعف الحرج في المنظومة؟",
            "La dependencia energética sigue constituyendo el talón de Aquiles de la economía comunitaria.",
            "ما زالت التبعية في مجال الطاقة تمثل كعب أخيل ونقطة الضعف القاتلة في اقتصاد الاتحاد.",
            [
                opt("a", "El talón de Aquiles", "كعب أخيل / نقطة الضعف الجوهرية والمهددة للكيان", True),
                opt("b", "La espada de Damocles", "الخطر الدائم والمهدد فوق الرؤوس", False, "استعارة لخطر داهم وشيك لا لنقطة ضعف ذاتية."),
                opt("c", "El caballo de Troya", "العدو المتسلل من الداخل في الخفاء", False, "استعارة للاختراق الداخلي الخبيث.")
            ],
            ["talon", "aquiles"],
            "«El talón de Aquiles» مستمدة من الأسطورة الإغريقية وتدل على موضع الخلل الوحيد القادر على إسقاط البطل القوي.",
            "pending/c1-u2-met-1",
            "La dependencia energética sigue constituyendo el talón de Aquiles de la economía comunitaria."
        ),
        choice_ex(
            "ex-c1-mvc-2", "word_choice",
            "ما معنى الاستعارة التاريخية الإسبانية «poner una pica en Flandes»؟",
            ["reading", "vocabulary"], 1,
            "اختر التفسير التاريخي البلاغي الدقيق:",
            "Conseguir financiación para esa investigación fue poner una pica en Flandes.",
            "كان الحصول على تمويل لذلك البحث بمثابة إنجاز خارق بالغ الصعوبة والتعقيد.",
            [
                opt("a", "Lograr algo sumamente arduo o casi imposible", "تحقيق أمر عسير للغاية وتاريخي التحدي", True),
                opt("b", "Declarar la guerra a un país vecino", "إعلان الحرب الرسمية والعدوان العسكري", False, "فهم حرفي مغلوط للأصل التاريخي."),
                opt("c", "Cometer una torpeza irreparable", "ارتكاب خطأ فادح لا يغتفر بحق الآخرين", False, "تفيد الفشل وليس النجاح الإعجازي.")
            ],
            ["pica", "rigor"],
            "تعود هذه العبارة إلى صعوبة إرسال الجيوش الإسبانية وتثبيت راية في فلاندرز قديماً، فصارت مثلاً للمهمة المستحيلة المنجزة."
        ),
        fill_ex(
            "ex-c1-mvc-3",
            "أكمل الاستعارة التي تدل على معارضة الفكر السائد: «navegar contra ____».",
            ["vocabulary", "writing"], 2,
            "اكتب الكلمة الناقصة الدالة على المجرى المائي المعاكس:",
            "A menudo, el intelectual crítico debe navegar contra ____ para defender la verdad.",
            "كثيراً ما يتوجب على المفكر النقدي السباحة ضد التيار نصرةً للحقيقة.",
            ["corriente"],
            ["corriente"],
            "التعبير المجازي هو «navegar contra corriente» ويعني الصمود أمام ضغط الرأي العام السائد والأفكار النمطية."
        ),
        choice_ex(
            "ex-c1-mvc-4", "word_choice",
            "ما التعبير العسكري المستعار الدال على إحداث شق واختراق في جدار المشكلة؟",
            ["vocabulary", "reading"], 1,
            "اختر الفعل والتعبير المناسب لإحداث تحول:",
            "Las reformas han logrado ____ en las estructuras conservadoras.",
            "لقد نجحت الإصلاحات في فتح ثغرة واختراق في الهياكل المحافظة القديمة.",
            [
                opt("a", "abrir una brecha", "فتح فجوة وإحداث اختراق حاسم", True),
                opt("b", "bajar la guardia", "التراخي وفقدان الحذر واليقظة", False, "تفيد الإهمال لا الاختراق."),
                opt("c", "cruzar el charco", "السفر عبر المحيط إلى قارة أخرى", False, "تعبير جغرافي عامي.")
            ],
            ["brecha", "rigor"],
            "«Abrir una brecha» مستعارة من حصار القلاع قديماً وتعني شق طريق وسط منظومة دفاعية أو فكرية كانت محصنة."
        ),
        order_ex(
            "ex-c1-mvc-5",
            "رتب الكلمات لتكوين جملة استعارية فصيحة تصف الجرأة في تحدي السائد.",
            ["grammar", "writing"], 2,
            ["No", "teme", "navegar", "contra", "corriente", "jamás"],
            "No teme navegar contra corriente jamás",
            "السياق البلاغي: النفي والفعل الرئيسي والمصدر مع التركيب الاستعاري والظرف في النهاية للتأكيد.",
            ["corriente"]
        ),
        speak_ex(
            "ex-c1-mvc-6",
            "انطق هذه الجملة الاستعارية بنبرة تحذيرية رصينة تليق بمقال اقتصادي عميق.",
            ["speaking", "pronunciation"], 2,
            "نطق سليم مراعياً الوقف النغمي:",
            "La deuda es el talón de Aquiles de la banca.",
            "الدين هو كعب أخيل ونقطة الضعف القاتلة في القطاع المصرفي.",
            "pending/c1-u2-met-spk",
            ["talon", "aquiles"],
            "La deuda es el talón de Aquiles de la banca.",
            "انتبه لنطق حرف l المشدد في Aquiles كصوت /ʎ/ أو /ʝ/ فصيح ونبر كلمة talón على المقطع الأخير."
        )
    ]
    return lesson_doc(doc, exs, "C1")


# -------------------------------------------------------------
# UNIT 3: c1-u3-academic-discourse (الخطاب الأكاديمي والمناظرة الفكرية)
# -------------------------------------------------------------

def make_lesson_conectores_metadiscursivos():
    slug = "c1-conectores-metadiscursivos"
    titleAr = "روابط الخطاب الفوقي وتنظيم الأطروحة: Conectores metadiscursivos"
    objAr = "أن يستخدم المتعلم الروابط الأكاديمية الرفيعة (en lo tocante a, cabe puntualizar que, a mayor abundamiento) لبناء مقال علمي متماسك."
    
    newVocab = ["tocante", "puntualizar", "abundamiento", "precedente", "rigor", "desempeñar"]
    revVocab = ["tiempo", "sociedad", "bien", "trabajo"]
    
    doc = {
        "slug": slug,
        "titleAr": titleAr,
        "level": "C1",
        "programSlug": "main-track",
        "unitSlug": "c1-u3-academic-discourse",
        "objectiveAr": objAr,
        "estimatedMinutes": 12,
        "skills": ["grammar", "reading", "writing", "listening", "vocabulary"],
        "newVocabulary": newVocab,
        "reviewVocabulary": revVocab,
        "targetStructures": [
            "Conector temático: en lo tocante a / por lo que atañe a",
            "Conector de precisión: cabe puntualizar que / es oportuno matizar que",
            "Conector aditivo acumulativo: a mayor abundamiento / para más señas",
            "Conector de recapitulación: a la luz de lo precedente"
        ],
        "grammarTopics": ["cohesion-textual-avanzada", "conectores-metadiscursivos-c1"],
        "scenarios": [
            {
                "contextAr": "مناقشة علنية لأطروحة دكتوراه في العلوم الإنسانية بجامعة سلمنكا.",
                "settingAr": "القاعة الكبرى للمناقشات في كلية فقه اللغة",
                "lines": [
                    {
                        "es": "En lo tocante a la metodología empírica, el corpus analizado resulta irreprochable.",
                        "ar": "فيما يتعلق بالمنهجية التجريبية، فإن المتن اللغوي الذي خضع للتحليل لا غبار عليه إطلاقاً.",
                        "arEg": "بالنسبة لمنهج البحث التطبيقي، العينة اللي اتحللت ممتازة وملهاش أي مثلبة.",
                        "audioKey": "pending/c1-u3-con-1"
                    },
                    {
                        "es": "Cabe puntualizar que las variables contextuales no fueron aisladas por completo.",
                        "ar": "يجدر التدقيق والتوضيح بأن المتغيرات السياقية لم تُعزل بصورة كلية ومطلقة.",
                        "arEg": "لازم نوضح وندقق في إن العوامل والظروف المحيطة متفصلتش بشكل كامل.",
                        "audioKey": "pending/c1-u3-con-2"
                    },
                    {
                        "es": "A mayor abundamiento, los testimonios de archivo corroboran plenamente la hipótesis central.",
                        "ar": "وزيادة في التأكيد والإثبات، فإن وثائق الأرشيف تعزز الفرضية المركزية تعزيزاً تاماً.",
                        "arEg": "وفوق كل ده وزيادة تأكيد، وثائق الأرشيف القديمة أثبتت الفرضية الأساسية تماماً.",
                        "audioKey": "pending/c1-u3-con-3"
                    },
                    {
                        "es": "A la luz de lo precedente, la tesis realiza una aportación sustancial al campo.",
                        "ar": "وعلى ضوء ما تقدم ذكره، فإن هذه الأطروحة تقدم إسهاماً جوهرياً إلى الحقل العلمي.",
                        "arEg": "وفي ضوء كل اللي فات ده، الأطروحة بتقدم إضافة علمية معتبرة للمجال كله.",
                        "audioKey": "pending/c1-u3-con-4"
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
            "ex-c1-cmd-1", "listen_choose",
            "استمع إلى تعقيب الأستاذ المناقش وحدد الرابط الدال على التخصيص الموضوعي الراقي.",
            ["listening", "vocabulary"], 1,
            "ما الرابط الذي استهل به الأستاذ تقييم المنهجية بدقة؟",
            "En lo tocante a la metodología empírica, el corpus analizado resulta irreprochable.",
            "فيما يتعلق بالمنهجية التجريبية، فإن المتن اللغوي الذي خضع للتحليل لا غبار عليه إطلاقاً.",
            [
                opt("a", "En lo tocante a", "فيما يخص / في ما يتعلق بـ في الأسلوب الأكاديمي الرفيع", True),
                opt("b", "Por casualidad", "عن طريق المصادفة والاتفاق", False, "تفيد الصدفة لا التنظيم المنهجي."),
                opt("c", "De buenas a primeras", "فجأة ومن أول وهلة بلا تمهيد", False, "أسلوب دارج غير أكاديمي.")
            ],
            ["tocante", "rigor"],
            "تستخدم عبارة «en lo tocante a» لحصر الحديث وتوجيهه نحو جانب معرفي محدد برصانة وأناقة لغوية.",
            "pending/c1-u3-con-1",
            "En lo tocante a la metodología empírica, el corpus analizado resulta irreprochable."
        ),
        choice_ex(
            "ex-c1-cmd-2", "word_choice",
            "أي تعبير يفيد «وزيادة في الاستدلال وتقديم حجة إضافية قاطعة» في لغة القضاء والأكاديميا؟",
            ["grammar", "reading"], 1,
            "اختر الرابط الاستدلالي التراكمي الأنسب:",
            "El acusado no estaba en la ciudad y, ____, varios testigos lo sitúan a cien kilómetros.",
            "لم يكن المتهم في المدينة، وزيادة في التأكيد والحجة، فقد أكد شهود وجوده على بعد مئة كيلومتر.",
            [
                opt("a", "a mayor abundamiento", "وزيادة في الحجة والإثبات التراكمي", True),
                opt("b", "a regañadientes", "على كره ومضض وبلا رغبة", False, "تصف الحالة النفسية وليست رابطاً حجاجياً."),
                opt("c", "de cabo a rabo", "من أول الأمر لآخره", False, "تفيد الشمولية المكانية أو الوصفية.")
            ],
            ["abundamiento", "rigor"],
            "تعبير «a mayor abundamiento» مصطلح قضائي وأكاديمي كلاسيكي يعني إيراد دليل إضافي يعزز ما هو ثابت بالأصل."
        ),
        fill_ex(
            "ex-c1-cmd-3",
            "أكمل عبارة التدقيق والتحفظ المنهجي: «cabe ____ que».",
            ["vocabulary", "writing"], 2,
            "اكتب الفعل المصدري الدال على ضبط المفاهيم وتحديدها:",
            "Antes de continuar, cabe ____ que las cifras corresponden solo al primer semestre.",
            "قبل المتابعة، يجدر التوضيح والتدقيق بأن الأرقام تخص النصف الأول من العام فقط.",
            ["puntualizar"],
            ["puntualizar"],
            "يقال «cabe puntualizar que» في المحافل الفكرية لإيقاف الاستطراد وتوضيح جزئية دقيقة تفادياً لسوء الفهم."
        ),
        choice_ex(
            "ex-c1-cmd-4", "word_choice",
            "كيف تختم تحليلاً علمياً برابط راقٍ يلخص المعطيات السابقة دون اللجوء لعبارة «en resumen» الدارجة؟",
            ["reading", "grammar"], 1,
            "اختر الرابط الختامي الاستنتاجي الأرقى أسلوبياً:",
            "____, los hallazgos confirman la validez del nuevo modelo teórico.",
            "وعلى ضوء ما سلف بيانه، تؤكد النتائج صحة النموذج النظري الجديد.",
            [
                opt("a", "A la luz de lo precedente", "على ضوء ما سلف بيانه من أدلة", True),
                opt("b", "Sea como fuere", "مهما يكن من أمر وكيفما اتفق", False, "تفيد التشكيك والتجاوز لا التتويج الاستدلالي."),
                opt("c", "De buenas a primeras", "من أول وهلة ومباشرة بلا مقدمات", False, "لا تناسب خاتمة تقرير علمي.")
            ],
            ["precedente", "rigor"],
            "«A la luz de lo precedente» تعبر عن التتويج المنطقي للأطروحة انطلاقاً من المقدمات المسوقة بدقة."
        ),
        order_ex(
            "ex-c1-cmd-5",
            "رتب الكلمات لبناء تركيب يمهد للتدقيق في دلالة مصطلح علمي محدد.",
            ["grammar", "writing"], 2,
            ["Cabe", "puntualizar", "un", "detalle", "metodológico", "relevante"],
            "Cabe puntualizar un detalle metodológico relevante",
            "التركيب: الفعل غير الشخصي cabe متبوعاً بالمصدر puntualizar والمفعول الأكاديمي الموصوف بدقة.",
            ["puntualizar"]
        ),
        speak_ex(
            "ex-c1-cmd-6",
            "انطق هذه الجملة بنبرة أكاديمية واثقة تعكس الرصانة والترابط المنطقي المحكم.",
            ["speaking", "pronunciation"], 2,
            "نطق سليم مراعياً فواصل الجملة المعترضة:",
            "En lo tocante al marco teórico, no caben objeciones.",
            "فيما يتعلق بالإطار النظري، لا مجال لأي اعتراضات.",
            "pending/c1-u3-con-spk",
            ["tocante", "rigor"],
            "En lo tocante al marco teórico, no caben objeciones.",
            "حافظ على هدوء التنغيم والوقف الخفيف بعد كلمة teórico لبيان الفصل الأسلوبي المتقن بين أجزاء الطرح."
        )
    ]
    return lesson_doc(doc, exs, "C1")


def make_lesson_refutacion_dialectica():
    slug = "c1-refutacion-dialectica"
    titleAr = "الدحض والمناظرة الفكرية: Refutación dialéctica y contraargumentación"
    objAr = "أن يفند المتعلم الحجج المضادة ويكشف التهافت المنهجي والمغالطات المنطقية (falacia, rebatir, desarticular, carecer de sustento)."
    
    newVocab = ["falacia", "rebatir", "desarticular", "sustento", "incurrir", "rigor"]
    revVocab = ["tiempo", "sociedad", "bien", "trabajo"]
    
    doc = {
        "slug": slug,
        "titleAr": titleAr,
        "level": "C1",
        "programSlug": "main-track",
        "unitSlug": "c1-u3-academic-discourse",
        "objectiveAr": objAr,
        "estimatedMinutes": 12,
        "skills": ["grammar", "reading", "writing", "listening", "vocabulary"],
        "newVocabulary": newVocab,
        "reviewVocabulary": revVocab,
        "targetStructures": [
            "Desarticular una tesis: desmontar sistemáticamente los pilares de un argumento",
            "Rebatir una objeción: responder con solvencia lógica a la crítica",
            "Carecer de sustento: señalar la falta de rigor o pruebas empíricas",
            "Incurrir en una falacia: denunciar razonamientos formalmente viciados"
        ],
        "grammarTopics": ["argumentacion-dialectica-c1", "refutacion-y-debate-academico"],
        "scenarios": [
            {
                "contextAr": "مناظرة فكرية حامية في ندوة حوارية بين مدرستين في علم الاجتماع المعاصر.",
                "settingAr": "مدرج أتينيو الثقافي والتاريخي في مدريد",
                "lines": [
                    {
                        "es": "La postura del ponente incurre en una falacia de generalización apresurada.",
                        "ar": "إن موقف المحاضر يقع في مغالطة منطقية تتمثل في التعميم المتسرع.",
                        "arEg": "كلام الدكتور بيقع في فخ مغالطة واضحة جداً وهي التعميم السريع من غير دليل.",
                        "audioKey": "pending/c1-u3-ref-1"
                    },
                    {
                        "es": "Su razonamiento carece de sustento empírico verificable en el terreno.",
                        "ar": "طرحه يفتقر إلى أي سند تجريبي يمكن التحقق منه على أرض الواقع الميداني.",
                        "arEg": "وجهة نظره معندهاش أي سند حقيقي في الواقع نقدر نتأكد منه بالأرقام.",
                        "audioKey": "pending/c1-u3-ref-2"
                    },
                    {
                        "es": "Basta examinar las estadísticas oficiales para rebatir semejante aseveración.",
                        "ar": "يكفي فحص الإحصاءات الرسمية لدحض وتفنيد هذا الادعاء الجازم.",
                        "arEg": "كفاية أوي نبص في الأرقام والإحصاءات الرسمية عشان نفند كلامه ده في ثواني.",
                        "audioKey": "pending/c1-u3-ref-3"
                    },
                    {
                        "es": "Hemos logrado desarticular la teoría adversaria demostrando sus contradicciones internas.",
                        "ar": "لقد نجحنا في تفكيك النظرية المنافسة عبر إثبات تناقضاتها البنيوية الداخلية.",
                        "arEg": "قدرنا نفكك النظرية المعارضة حتة حتة ونبيّن التناقضات اللي جواها قدام الكل.",
                        "audioKey": "pending/c1-u3-ref-4"
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
            "ex-c1-rdi-1", "listen_choose",
            "استمع إلى نقد المحاضر واكتشف المصطلح المنطقي الذي استخدمه لبيان الخلل في الاستدلال.",
            ["listening", "vocabulary"], 1,
            "ما الخطأ المنطقي الذي اتُهم به المحاضر؟",
            "La postura del ponente incurre en una falacia de generalización apresurada.",
            "إن موقف المحاضر يقع في مغالطة منطقية تتمثل في التعميم المتسرع.",
            [
                opt("a", "Una falacia", "مغالطة منطقية تخدع السامع بمظهر الصدق الزائف", True),
                opt("b", "Una metáfora", "استعارة بلاغية للتوضيح والبيان", False, "المجاز ليس عيباً منطقياً بحد ذاته."),
                opt("c", "Una paradoja", "مفارقة ظاهرية تحمل حقيقة عميقة", False, "المفارقة تفيد التفكير لا التدليس.")
            ],
            ["falacia", "incurrir"],
            "«Una falacia» هي حجة تبدو صحيحة في الظاهر لكنها تنطوي على خلل استدلالي يفسد نتيجتها في المنطق الصوري.",
            "pending/c1-u3-ref-1",
            "La postura del ponente incurre en una falacia de generalización apresurada."
        ),
        choice_ex(
            "ex-c1-rdi-2", "word_choice",
            "ما الفعل الأدق أسلوبياً للتعبير عن «تفنيد ودحض اعتراض الخصم بحجة ناصعة»؟",
            ["vocabulary", "reading"], 1,
            "اختر الفعل الأكاديمي النوعي للدحض:",
            "El investigador aportó documentos inéditos para ____ las críticas de sus detractores.",
            "قدم الباحث وثائق غير منشورة لدحض وتفنيد انتقادات خصومه.",
            [
                opt("a", "rebatir", "دحض وتفنيد الحجة بالأدلة العقلية", True),
                opt("b", "gritar", "الصياح ومقاطعة المتكلم في الحديث", False, "سلوك فوضوي لا ينتمي للمناظرة الفكرية."),
                opt("c", "admitir", "التسليم بصحة كلام الطرف الآخر", False, "عكس التفنيد تماماً.")
            ],
            ["rebatir", "rigor"],
            "يستخدم الفعل «rebatir» في السياق الجدلي والأكاديمي عند تقديم براهين مقابلة تبطل زعم الطرف المقابل."
        ),
        fill_ex(
            "ex-c1-rdi-3",
            "أكمل الجملة بالكلمة الدالة على الأساس والدعامة المنهجية التي تفتقر إليها الفكرة: «carecer de ____».",
            ["vocabulary", "writing"], 2,
            "اكتب الكلمة الناقصة:",
            "Esa hipótesis audaz carece de ____ científico.",
            "تلك الفرضية الجريئة تفتقر إلى أي سند وركيزة علمية.",
            ["sustento"],
            ["sustento"],
            "تعبير «carecer de sustento» شائع في تقارير التحكيم الأكاديمي ويعني أن الادعاء بلا رصيد من الأدلة التجريبية."
        ),
        choice_ex(
            "ex-c1-rdi-4", "word_choice",
            "أي فعل يفيد «تفكيك بنية الحجة حجراً حجراً وإظهار تهافتها الداخلي»؟",
            ["vocabulary", "reading"], 1,
            "اختر الفعل المعبر عن الهدم المنهجي لأطروحة الخصم:",
            "El crítico logró ____ el discurso demagógico mediante un análisis riguroso.",
            "نجح الناقد في تفكيك الخطاب الشعبوي وإبطال مفعوله عبر تحليل صارم.",
            [
                opt("a", "desarticular", "تفكيك المفاصل وإبطال الترابط المزعوم", True),
                opt("b", "celebrar", "الاحتفاء بالطرح والإشادة به", False, "عكس التفكيك والنقد."),
                opt("c", "imitar", "تقليد أسلوب الخطاب دون فحص", False, "يدل على التبعية لا النقد.")
            ],
            ["desarticular", "rigor"],
            "استعارة «desarticular» مأخوذة من فك المفاصل، وتطلق على إبطال ترابط الحجج وكشف تناقض مكوناتها."
        ),
        order_ex(
            "ex-c1-rdi-5",
            "رتب الكلمات لتكوين نقد منهجي يصف الادعاء بأنه يفتقر إلى الأدلة القاطعة.",
            ["grammar", "writing"], 2,
            ["Dicha", "afirmación", "carece", "de", "sustento", "riguroso"],
            "Dicha afirmación carece de sustento riguroso",
            "التركيب: اسم الإشارة الدال على السابق Dicha ثم الاسم والفعل وحرف الجر والاسم الموصوف.",
            ["sustento", "rigor"]
        ),
        speak_ex(
            "ex-c1-rdi-6",
            "انطق هذه الجملة بنبرة سجالية هادئة ورصينة تليق بمناظر متمكن من أدوات المنطق.",
            ["speaking", "pronunciation"], 2,
            "نطق سليم مراعياً الضغط على المقاطع المنبورة:",
            "Ese argumento incurre en una evidente falacia.",
            "تلك الحجة تنطوي على مغالطة بيّنة لا تخفى على فطن.",
            "pending/c1-u3-ref-spk",
            ["falacia", "incurrir"],
            "Ese argumento incurre en una evidente falacia.",
            "احرص على التفريق بين صوت /r/ الرخو والراء المشددة في incurre ونطق حرف c في falacia بدقة قشتالية ثائية."
        )
    ]
    return lesson_doc(doc, exs, "C1")


def make_lesson_atenuacion_academica():
    slug = "c1-atenuacion-academica"
    titleAr = "التلطيف والتحفظ المنهجي: La atenuación y el 'hedging' académico"
    objAr = "أن يصيغ المتعلم الأحكام النقدية باعتدال وتواضع علمي باستخدام أساليب التلطيف (cabría sugerir, parecería prudente, los datos apuntan a)."
    
    newVocab = ["cabria", "prudente", "apuntan", "matizar", "plausible", "rigor"]
    revVocab = ["tiempo", "sociedad", "bien", "trabajo"]
    
    doc = {
        "slug": slug,
        "titleAr": titleAr,
        "level": "C1",
        "programSlug": "main-track",
        "unitSlug": "c1-u3-academic-discourse",
        "objectiveAr": objAr,
        "estimatedMinutes": 12,
        "skills": ["grammar", "reading", "writing", "listening", "vocabulary"],
        "newVocabulary": newVocab,
        "reviewVocabulary": revVocab,
        "targetStructures": [
            "Condicional de modestia: cabría sugerir que / convendría examinar",
            "Verbos de percepción atenuada: parecería prudente esperar",
            "Fórmulas de cautela interpretativa: los indicios apuntan hacia",
            "Matización epistemológica: una hipótesis plausible pero provisional"
        ],
        "grammarTopics": ["hedging-academico", "atenuacion-y-cortesia-c1"],
        "scenarios": [
            {
                "contextAr": "ندوة حول نتائج تجارب سريرية أولية لعلاج جيني حديث.",
                "settingAr": "معهد أبحاث الطب الحيوي في برشلونة",
                "lines": [
                    {
                        "es": "A la vista de los resultados, cabría sugerir una correlación preliminar entre ambos factores.",
                        "ar": "في ضوء النتائج الراهنة، يمكننا أن نقترح بحذر وجود ارتباط أولي بين كلا العاملين.",
                        "arEg": "على ضوء النتايج دي، نقدر نقترح بهدوء وتحفظ إن في علاقة مبدئية بين العاملين دول.",
                        "audioKey": "pending/c1-u3-ate-1"
                    },
                    {
                        "es": "Parecería prudente abstenerse de formular conclusiones definitivas por el momento.",
                        "ar": "يبدو من الحكمة والكياسة المنهجية الامتناع عن صياغة استنتاجات قاطعة في الوقت الراهن.",
                        "arEg": "الأعقل والأضمن إننا منستعجلش ومنطلعش بنتايج نهائية جازمة دلوقتي خالص.",
                        "audioKey": "pending/c1-u3-ate-2"
                    },
                    {
                        "es": "Los datos obtenidos apuntan a una mejoría notable, si bien conviene matizar su alcance.",
                        "ar": "البيانات التي تم الحصول عليها تشير إلى تحسن ملحوظ، وإن كان يجدر تدقيق مداه وحدوده.",
                        "arEg": "الأرقام اللي معانا بتشاور على تحسن واضح، بس لازم نوضح ونظبط مداها بالظبط.",
                        "audioKey": "pending/c1-u3-ate-3"
                    },
                    {
                        "es": "Estamos ante una hipótesis sumamente plausible, sujeta todavía a contrastación empírica.",
                        "ar": "إننا أمام فرضية معقولة ومقبولة للغاية، لكنها ما تزال خاضعة للتحقق التجريبي المستمر.",
                        "arEg": "إحنا قدام فرضية مقنعة ومقبولة جداً، بس لسه محتاجة تجارب وتأكيدات أكتر في المعمل.",
                        "audioKey": "pending/c1-u3-ate-4"
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
            "ex-c1-aac-1", "listen_choose",
            "استمع إلى كلام الباحث وحدد الصيغة الشرطية التي لجأ إليها لتقديم اقتراحه بتواضع وتحفظ علمي رفيع.",
            ["listening", "vocabulary"], 1,
            "ما الصيغة اللفظية التي عبّر بها الباحث عن فرضيته دون جزم متعجرف؟",
            "A la vista de los resultados, cabría sugerir una correlación preliminar entre ambos factores.",
            "في ضوء النتائج الراهنة، يمكننا أن نقترح بحذر وجود ارتباط أولي بين كلا العاملين.",
            [
                opt("a", "Cabría sugerir", "يمكن اقتراح ذلك بتحفظ وتواضع منهجي", True),
                opt("b", "Es indiscutible", "من المسلم به قطعا ولا يقبل أدنى نقاش", False, "جزم قطعي يتنافى مع روح التلطيف الأكاديمي."),
                opt("c", "Exijo que crean", "أفرض عليكم التصديق بالقوة والإكراه", False, "أسلوب استبدادي لا يمت للعلم بصلة.")
            ],
            ["cabria", "rigor"],
            "صيغة الشرط البسيط «cabría + infinitivo» تمثل ذروة الأدب والتحفظ الأكاديمي لعرض فكرة دون فرضها كحقيقة مطلقة.",
            "pending/c1-u3-ate-1",
            "A la vista de los resultados, cabría sugerir una correlación preliminar entre ambos factores."
        ),
        choice_ex(
            "ex-c1-aac-2", "word_choice",
            "أي صفة تستخدم في الخطاب العلمي لوصف فرضية تبدو منطقية وقابلة للتصديق لكنها ليست يقين بعد؟",
            ["vocabulary", "reading"], 1,
            "اختر الوصف العلمي الدقيق للفرضية المقبولة عقلياً:",
            "La explicación del equipo resulta ____, pero requiere ensayos adicionales.",
            "تفسير الفريق يبدو معقولاً ومقبولاً منطقياً، بيد أنه يتطلب تجارب إضافية.",
            [
                opt("a", "plausible", "معقول / جدير بالقبول والتصديق المؤقت", True),
                opt("b", "absurda", "سخيف وعبثي ومناف للمنطق", False, "وصف سلبي قادح."),
                opt("c", "imposible", "مستحيل التحقق فيزيائياً", False, "حكم قطعي بالبطلان.")
            ],
            ["plausible", "rigor"],
            "تستخدم كلمة «plausible» لوصف الفرضيات والنظريات التي تتوافق مع العقل والمشاهدات المبدئية قبل الثبوت القاطع."
        ),
        fill_ex(
            "ex-c1-aac-3",
            "أكمل الجملة بصفة تدل على الحكمة والتأني الاحترازي: «parecería ____».",
            ["vocabulary", "writing"], 2,
            "اكتب الصفة المناسبة لبيان التريث والاحتياط في اتخاذ القرار:",
            "Parecería ____ aguardar a la publicación de los datos definitivos.",
            "يبدو من الحكمة والتعقل التريث ريثما تُنشر البيانات النهائية.",
            ["prudente"],
            ["prudente"],
            "تعبير «parecería prudente» من أكثر التراكيب الدبلوماسية والأكاديمية استخداماً لإبطاء الاندفاع وتجنب الخطأ."
        ),
        choice_ex(
            "ex-c1-aac-4", "word_choice",
            "ما الفعل الذي يفيد «إضافة لمسات تدقيق وإيضاحات تمنع التعميم الخاطئ للفكرة»؟",
            ["reading", "vocabulary"], 1,
            "اختر الفعل المعبر عن ضبط المعنى وتعديله بدقة:",
            "El autor afirma que la economía crece, si bien conviene ____ este optimismo.",
            "يؤكد المؤلف أن الاقتصاد ينمو، وإن كان يجدر ضبط هذا التفاؤل وتحديد أبعاده.",
            [
                opt("a", "matizar", "تدقيق المعنى وتعديل حواشيه لإبراز الفروق", True),
                opt("b", "borrar", "شطب وحذف الفكرة بالكامل", False, "إلغاء تام وليس تدقيقاً."),
                opt("c", "olvidar", "إهمال الأمر والنسيان", False, "لا علاقة له بالتحليل الأكاديمي.")
            ],
            ["matizar", "rigor"],
            "الفعل «matizar» من أعمدة أسلوب C1، ويعني إظهار الظلال الدقيقة والحدود الدقيقة للحكم لتفادي التعميمات الفجة."
        ),
        order_ex(
            "ex-c1-aac-5",
            "رتب الكلمات لتكوين استنتاج علمي محترس يربط بين المؤشرات والنتائج المتوقعة.",
            ["grammar", "writing"], 2,
            ["Los", "indicios", "apuntan", "hacia", "esa", "dirección"],
            "Los indicios apuntan hacia esa dirección",
            "التركيب: الفاعل Los indicios ثم الفعل الدال على التوجيه apuntan وحرف الجر hacia والمشار إليه.",
            ["apuntan"]
        ),
        speak_ex(
            "ex-c1-aac-6",
            "انطق هذه الجملة بنبرة أكاديمية متزنة توحي بالتأني والعقلانية الراجحة.",
            ["speaking", "pronunciation"], 2,
            "نطق سليم مراعياً الإيقاع الهادئ للشرط:",
            "Cabría formular una interpretación más prudente.",
            "يمكن تقديم تفسير أكثر حيطة وتأنياً في هذا السياق.",
            "pending/c1-u3-ate-spk",
            ["cabria", "prudente"],
            "Cabría formular una interpretación más prudente.",
            "تأكد من إعطاء النبر الصحيح لكلمة Cabría على مقطع -brí- وإخراج الراء الفصيحة بصوت رخو سليم."
        )
    ]
    return lesson_doc(doc, exs, "C1")


def make_lesson_ponencias_congresos():
    slug = "c1-ponencias-congresos"
    titleAr = "إدارة الندوات وإلقاء الأوراق العلمية: Ponencias y congresos internacionales"
    objAr = "أن يقدم المتعلم ورقة بحثية في مؤتمر دولي ويدير حوار الأسئلة والمناقشة بروتوكولياً (inaugurar, ceder la palabra, someter a debate)."
    
    newVocab = ["inaugurar", "ceder", "someter", "sintetizar", "plenario", "rigor"]
    revVocab = ["tiempo", "sociedad", "bien", "trabajo"]
    
    doc = {
        "slug": slug,
        "titleAr": titleAr,
        "level": "C1",
        "programSlug": "main-track",
        "unitSlug": "c1-u3-academic-discourse",
        "objectiveAr": objAr,
        "estimatedMinutes": 12,
        "skills": ["grammar", "reading", "writing", "listening", "vocabulary"],
        "newVocabulary": newVocab,
        "reviewVocabulary": revVocab,
        "targetStructures": [
            "Fórmula de apertura: Es un honor inaugurar esta sesión plenaria",
            "Gestión del turno de palabra: Sin más preámbulos, cedo la palabra al doctor",
            "Invitación a la deliberación: Someter la cuestión al debate del auditorio",
            "Cierre magistral: Permítanme sintetizar los puntos nucleares"
        ],
        "grammarTopics": ["protocolo-academico-c1", "oratoria-en-congresos-cientificos"],
        "scenarios": [
            {
                "contextAr": "الجلسة الافتتاحية للمؤتمر الدولي للدراسات الإسبانية في جامعة غرناطة.",
                "settingAr": "قاعة المؤتمرات الكبرى بمركز قصر المؤتمرات في غرناطة",
                "lines": [
                    {
                        "es": "Es para mí un auténtico honor inaugurar este simposio internacional de lingüística.",
                        "ar": "إنه لشرف حقيقي لي أن أفتتح هذه الندوة الدولية في علم اللغات واللسانيات.",
                        "arEg": "شرف عظيم ليا إني أفتتح المؤتمر الدولي ده لعلم اللغة في غرناطة النهاردة.",
                        "audioKey": "pending/c1-u3-pon-1"
                    },
                    {
                        "es": "Sin más dilación, cedo la palabra a nuestra distinguida ponente magistral.",
                        "ar": "ودون أي تأخير، أمنح الكلمة لمحاضرتنا الرئيسية المرموقة.",
                        "arEg": "ومن غير ما أطول عليكم، بسيب المايك والكلمة لضيفتنا وباحثتنا الكبيرة.",
                        "audioKey": "pending/c1-u3-pon-2"
                    },
                    {
                        "es": "Quisiera someter a debate una cuestión crucial que interpela a toda la comunidad.",
                        "ar": "أود أن أطرح للنقاش والتداول مسألة جوهرية تخاطب المجتمع العلمي بأسره.",
                        "arEg": "حابب أطرح للنقاش قدامكم قضية مهمة جداً بتهمنا كلنا كباحثين.",
                        "audioKey": "pending/c1-u3-pon-3"
                    },
                    {
                        "es": "Para concluir, permítanme sintetizar las conclusiones de mayor calado teórico.",
                        "ar": "وفي الختام، اسمحوا لي بتكثيف وتلخيص الاستنتاجات ذات العمق النظري الأكبر.",
                        "arEg": "وفي الآخر، اسمحولي ألخص أهم النتايج العميقة اللي طلعنا بيها من التجربة.",
                        "audioKey": "pending/c1-u3-pon-4"
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
            "ex-c1-pco-1", "listen_choose",
            "استمع إلى رئيس الجلسة وحدد العبارة البروتوكولية التي استخدمها لتمرير الحديث للمحاضر التالي.",
            ["listening", "vocabulary"], 1,
            "كيف أعطى رئيس الجلسة الكلمة للباحثة؟",
            "Sin más dilación, cedo la palabra a nuestra distinguida ponente magistral.",
            "ودون أي تأخير، أمنح الكلمة لمحاضرتنا الرئيسية المرموقة.",
            [
                opt("a", "Cedo la palabra", "أمنح وأعطي حق التحدث والكلمة الرسمية", True),
                opt("b", "Quito la voz", "أصادر الصوت وأمنع الكلام", False, "تعبير عدواني مخالف للأصول."),
                opt("c", "Pido silencio", "أطلب الهدوء التام", False, "ليس صيغة لمنح الكلمة للمحاضر.")
            ],
            ["ceder", "rigor"],
            "العبارة البروتوكولية القياسية في المؤتمرات الرسمية هي «ceder la palabra a alguien» وتدل على الاحترام المؤسسي.",
            "pending/c1-u3-pon-2",
            "Sin más dilación, cedo la palabra a nuestra distinguida ponente magistral."
        ),
        choice_ex(
            "ex-c1-pco-2", "word_choice",
            "ما الفعل الذي يستخدم لطرح قضية أمام الحضور لمناقشتها وتداولها علمياً؟",
            ["reading", "vocabulary"], 1,
            "اختر التعبير الأكاديمي الدال على فتح باب النقاش:",
            "El decano propuso ____ la reforma curricular a debate general.",
            "اقترح العميد طرح تعديل المناهج للنقاش العام والتداول المشترك.",
            [
                opt("a", "someter", "طرح وعرض الأمر للاختبار والنقاش أمام الآخرين", True),
                opt("b", "esconder", "إخفاء الوثائق عن الجميع", False, "تناقض تام مع الشفافية الأكاديمية."),
                opt("c", "olvidar", "إهمال الموضوع والتناسي", False, "لا ينطبق على الإدارة المؤسسية.")
            ],
            ["someter", "rigor"],
            "يقال «someter algo a debate / a votación» بمعنى تقديمه رسمياً إلى الهيئة المخولة للنظر فيه وتداول آرائه."
        ),
        fill_ex(
            "ex-c1-pco-3",
            "أكمل الجملة بالفعل الأكاديمي الدال على تلخيص الأفكار المعقدة في نقاط موجزة: «____ las conclusiones».",
            ["vocabulary", "writing"], 2,
            "اكتب الفعل المصدري الدال على التلخيص المكثف:",
            "En los últimos minutos, procuraré ____ los aspectos esenciales de la ponencia.",
            "في الدقائق الأخيرة، سأسعى إلى تلخيص وتكثيف الجوانب الجوهرية للورقة البحثية.",
            ["sintetizar"],
            ["sintetizar"],
            "الفعل الأكاديمي «sintetizar» أرقى من الفعل الدارج resumir ويفيد جمع العناصر المتفرقة في تركيب موحد ومتماسك."
        ),
        choice_ex(
            "ex-c1-pco-4", "word_choice",
            "ما التعبير الدال على افتتاح جلسة عامة يحضرها جميع أعضاء المؤتمر دون استثناء؟",
            ["vocabulary", "reading"], 1,
            "اختر الوصف المؤسسي الدقيق للجلسة العامة الشاملة:",
            "Todos los delegados asisten a la sesión ____ de apertura.",
            "يحضر جميع المندوبين الجلسة العامة الشاملة للافتتاح.",
            [
                opt("a", "plenaria", "جلسة عامة مكتملة النصاب تضم كافة الأعضاء", True),
                opt("b", "secreta", "جلسة سرية مغلقة ومحظورة", False, "جلسات المؤتمرات علنية وليست تآمرية."),
                opt("c", "casual", "لقاء عفوي غير مبرمج", False, "المؤتمرات منظمة رسمياً.")
            ],
            ["plenario", "inaugurar"],
            "«Una sesión plenaria» (الجلسة العامة) هي الجلسة المركزية التي لا تنقسم إلى لجان فرعية وتجمع كل المؤتمرين."
        ),
        order_ex(
            "ex-c1-pco-5",
            "رتب الكلمات لبناء صيغة افتتاحية بروتوكولية لمؤتمر دولي.",
            ["grammar", "writing"], 2,
            ["Es", "un", "honor", "inaugurar", "este", "congreso"],
            "Es un honor inaugurar este congreso",
            "الصيغة الكلاسيكية: الفعل Es والاسم un honor ومصدر الفعل inaugurar متبوعاً باسم الإشارة والمشار إليه.",
            ["inaugurar"]
        ),
        speak_ex(
            "ex-c1-pco-6",
            "انطق هذه الجملة بنبرة خطيب مفوه يقف أمام مئات العلماء في قاعة كبرى.",
            ["speaking", "pronunciation"], 2,
            "نطق سليم مراعياً فخامة الإلقاء المسرحي:",
            "Cedo la palabra al distinguido conferenciante.",
            "أمنح الكلمة للمحاضر الكبير المرموق.",
            "pending/c1-u3-pon-spk",
            ["ceder", "rigor"],
            "Cedo la palabra al distinguido conferenciante.",
            "احرص على مد الحروف الصائتة بوقار، ونطق مقطع -guido في distinguido بصفاء دون إدغام ركيك."
        )
    ]
    return lesson_doc(doc, exs, "C1")


# -------------------------------------------------------------
# UNIT 4: c1-u4-literature (الأدب والنقد الأدبي المعمق)
# -------------------------------------------------------------

def make_lesson_siglo_de_oro():
    slug = "c1-siglo-de-oro"
    titleAr = "العصر الذهبي وبلاغة الباروك: El Siglo de Oro y la retórica barroca"
    objAr = "أن يتذوق المتعلم ويحلل نصوص الأدب الإسباني الكلاسيكي مفرّقاً بين مذهب المعنى (Conceptismo) ومذهب الزخرف (Culteranismo)."
    
    newVocab = ["barroco", "desengaño", "culteranismo", "conceptismo", "artificio", "rigor"]
    revVocab = ["tiempo", "sociedad", "bien", "trabajo"]
    
    doc = {
        "slug": slug,
        "titleAr": titleAr,
        "level": "C1",
        "programSlug": "main-track",
        "unitSlug": "c1-u4-literature",
        "objectiveAr": objAr,
        "estimatedMinutes": 12,
        "skills": ["grammar", "reading", "writing", "listening", "vocabulary"],
        "newVocabulary": newVocab,
        "reviewVocabulary": revVocab,
        "targetStructures": [
            "El conceptismo quevediano: agudeza verbal, paradoja y condensación léxica",
            "El culteranismo gongorino: metáforas hiperbólicas, cultismos y sintaxis latinizante",
            "El tópico del 'desengaño': fugacidad de la vida mundana y vanitas",
            "El artificio retórico como vehículo de trascendencia estética"
        ],
        "grammarTopics": ["retorica-barroca", "literatura-siglo-de-oro-c1"],
        "scenarios": [
            {
                "contextAr": "محاضرة جامعية في تاريخ الأدب المقارن حول شعراء الباروك الإسباني.",
                "settingAr": "مدرج جامعة كمبلوتنسي العريقة في مدريد",
                "lines": [
                    {
                        "es": "La poética del Barroco español oscila entre la exuberancia formal y la angustia existencial.",
                        "ar": "تتراوح شعرية الباروك الإسباني بين الفيض الصوري الشكلي والقلق الوجودي العميق.",
                        "arEg": "شعر العصر الذهبي الإسباني بيتأرجح بين الزخرفة الشكلية الرهيبة والوجع الإنساني العميق.",
                        "audioKey": "pending/c1-u4-oro-1"
                    },
                    {
                        "es": "Mientras Góngora deslumbra con el culteranismo y sus cultismos latinos, Quevedo prefiere el conceptismo.",
                        "ar": "فبينما يبهر غونغورا القراء بمذهب الزخرف اللفظي ومفرداته اللاتينية، يؤثر كيبيدو مذهب المعنى وتكثيف الفكرة.",
                        "arEg": "في الوقت اللي جونجورا بيبهرك بالزخرفة والألفاظ اللاتينية الفخمة، كيفيدو بيفضل عمق المعنى والتكثيف.",
                        "audioKey": "pending/c1-u4-oro-2"
                    },
                    {
                        "es": "El tema del desengaño impregna cada verso, recordando la vanidad de los bienes terrenales.",
                        "ar": "تتخلل فكرة خيبة الأمل وفوات الأوهام كل بيت شعري، مذكرة بزوال المتاع الأرضي وزيفه.",
                        "arEg": "فكرة خيبة الأمل وزوال الدنيا مغرقة كل الأبيات، وبتفكرنا إن كل شيء أرضي مصيره للفناء.",
                        "audioKey": "pending/c1-u4-oro-3"
                    },
                    {
                        "es": "Lejos de ser mero artificio vacío, esa retórica encerraba una profunda meditación filosófica.",
                        "ar": "وبعيداً عن كونها مجرد صنعة وزخرف خاوٍ، كانت تلك البلاغة تكتنز تأملاً فلسفياً سحيقاً.",
                        "arEg": "وبعيد عن إنها مجرد شطارة لغوية وزينة ع الفاضي، البلاغة دي كان وراها تفلسف وفكر كبير.",
                        "audioKey": "pending/c1-u4-oro-4"
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
            "ex-c1-sdo-1", "listen_choose",
            "استمع إلى شرح أستاذ الأدب وحدد المفهوم الوجودي المركزي الذي يطبع أدب الباروك بالزوال والتحرر من الوهم.",
            ["listening", "vocabulary"], 1,
            "ما التيمة الفلسفية التي تصبغ أشعار العصر الذهبي بالصحوة من بريق الدنيا الزائف؟",
            "El tema del desengaño impregna cada verso, recordando la vanidad de los bienes terrenales.",
            "تتخلل فكرة خيبة الأمل وفوات الأوهام كل بيت شعري، مذكرة بزوال المتاع الأرضي وزيفه.",
            [
                opt("a", "El desengaño", "الانكشاف والتحرر من وهم الدنيا وزوال بريقها المادي", True),
                opt("b", "El optimismo ciego", "التفاؤل الساذج والمرح الدائم", False, "مناقض لروح الباروك الوجودية المظلمة."),
                opt("c", "El costumbrismo festivo", "وصف الاحتفالات والرقصات الشعبية فقط", False, "اختزال مبتذل لأعظم مراحل الشعر.")
            ],
            ["desengaño", "barroco"],
            "«El desengaño» هو المحور الفلسفي الكبرى لتيار الباروك ويعني استيقاظ العقل من سكرة المظاهر إلى حقيقة الموت والزوال.",
            "pending/c1-u4-oro-3",
            "El tema del desengaño impregna cada verso, recordando la vanidad de los bienes terrenales."
        ),
        choice_ex(
            "ex-c1-sdo-2", "word_choice",
            "ما الفرق الجوهري بين تيار «el conceptismo» وتيار «el culteranismo» في العصر الذهبي؟",
            ["reading", "vocabulary"], 1,
            "اختر الوصف الأدبي الدقيق لتيار الكونسيبتيسمو التكثيفي:",
            "El conceptismo se caracteriza por la agudeza mental y la condensación de múltiples significados en pocas palabras.",
            "يتميز تيار مذهب المعنى بالذكاء اللماح وتكثيف معانٍ متعددة ومفارقات في أقل عدد من الكلمات.",
            [
                opt("a", "La condensación conceptual y el juego de ingenio", "التكثيف الدلالي والعمق التوليدي واللعب بالمعاني", True),
                opt("b", "La repetición monótona de rimas infantiles", "ترديد القوافي البسيطة الركيكة الساذجة", False, "ينزه عنه عباقرة الأدب الإسباني."),
                opt("c", "El rechazo absoluto de cualquier figura retórica", "رفض المحسنات البلاغية والحديث كلغة الشارع", False, "الباروك هو قمة الاحتفاء بالصنعة البلاغية.")
            ],
            ["conceptismo", "rigor"],
            "مذهب كيبيدو (Conceptismo) يعتمد على كثافة الفكرة وسرعة بديهة المفارقة اللفظية المعنوية (agudeza)."
        ),
        fill_ex(
            "ex-c1-sdo-3",
            "أكمل اسم المذهب الأدبي المقترن بالشاعر لويس دي غونغورا وزخرفته اللاتينية الفخمة: «el ____».",
            ["vocabulary", "writing"], 2,
            "اكتب اسم التيار الأدبي الزخرفي:",
            "Góngora llevó el ____ a su máxima expresión en sus 'Soledades'.",
            "بلغ غونغورا بذروة تيار الزخرف اللفظي اللاتيني أقصى مداها في قصيدته الخالدة 'الخلوات'.",
            ["culteranismo"],
            ["culteranismo"],
            "«El culteranismo» أو الغونغورية مذهب اهتم ببلاغة الشكل واستعارة التركيب النحوي اللاتيني والألفاظ الفصيحة المندثرة."
        ),
        choice_ex(
            "ex-c1-sdo-4", "word_choice",
            "ماذا يقصد النقاد بكلمة «artificio» عند تحليل الشعر الباروكي الإسباني؟",
            ["vocabulary", "reading"], 1,
            "اختر المعنى النقدي البلاغي لكلمة الصنعة الفنية:",
            "El artificio de Calderón de la Barca en 'La vida es sueño' no resta emoción a su obra.",
            "إن الصنعة البلاغية المحكمة لدى كالديرون في 'الحياة حلم' لا تنقص من حرارة العاطفة شيئاً.",
            [
                opt("a", "La elaborada construcción estética y virtuosismo formal", "البناء الجمالي المتأني والمهارة الفنية المتفوقة", True),
                opt("b", "El engaño fraudulento y la mentira premeditada", "التدليس المادي والتزوير والخداع", False, "معنى سلبي مبتذل خارج الفن."),
                opt("c", "La espontaneidad improvisada sin reflexión estética", "الارتجال السطحي السريع الخالي من التأمل", False, "عكس الصنعة الباروكية الصارمة.")
            ],
            ["artificio", "barroco"],
            "«Artificio» في النقد الأدبي الكلاسيكي تعني المهارة التقنية العالية وتطويع اللغة لتصير عملاً فنياً معجزاً."
        ),
        order_ex(
            "ex-c1-sdo-5",
            "رتب الكلمات لبناء حكم نقدي يصف روح العصر الذهبي الإسباني.",
            ["grammar", "writing"], 2,
            ["El", "Barroco", "refleja", "el", "desengaño", "humano"],
            "El Barroco refleja el desengaño humano",
            "التركيب: المبتدأ El Barroco يليه الفعل المتعدي والمفعول الموصوف el desengaño humano.",
            ["barroco", "desengaño"]
        ),
        speak_ex(
            "ex-c1-sdo-6",
            "انطق هذه الجملة بنبرة وقورة تستحضر عمق التأمل الفلسفي لشعراء القرن السابع عشر.",
            ["speaking", "pronunciation"], 2,
            "نطق سليم مراعياً هيبة المصطلحات النقدية:",
            "Quevedo condensó el conceptismo con genial agudeza.",
            "كثّف كيبيدو مذهب المعنى بذكاء لماح خارق للعادة.",
            "pending/c1-u4-oro-spk",
            ["conceptismo", "rigor"],
            "Quevedo condensó el conceptismo con genial agudeza.",
            "احرص على نطق حرف z في agudeza كصوت ثاء قشتالي رصين وإعطاء النبر لكلمة condensó على المقطع الأخير."
        )
    ]
    return lesson_doc(doc, exs, "C1")


def make_lesson_generacion_del_27():
    slug = "c1-generacion-del-27"
    titleAr = "جيل 27 وشعرية الطليعة: La Generación del 27 y la metáfora lorquiana"
    objAr = "أن يحلل المتعلم شعرية الطليعة الإسبانية مبيناً التوفيق العبقري بين التراث الأندلسي الشعبي والتجديد السريالي عند لوركا وسيرنوذا."
    
    newVocab = ["vanguardia", "simbolismo", "metáfora", "lorquiana", "compromiso", "rigor"]
    revVocab = ["tiempo", "sociedad", "bien", "trabajo"]
    
    doc = {
        "slug": slug,
        "titleAr": titleAr,
        "level": "C1",
        "programSlug": "main-track",
        "unitSlug": "c1-u4-literature",
        "objectiveAr": objAr,
        "estimatedMinutes": 12,
        "skills": ["grammar", "reading", "writing", "listening", "vocabulary"],
        "newVocabulary": newVocab,
        "reviewVocabulary": revVocab,
        "targetStructures": [
            "La síntesis entre tradición popular (romancero) y vanguardia surrealista",
            "La metáfora visionaria lorquiana: luna, caballo, metales y presagio de muerte",
            "El simbolismo andaluz universalizado en 'Poeta en Nueva York'",
            "El compromiso ético y estético ante la convulsa realidad histórica"
        ],
        "grammarTopics": ["generacion-del-27", "analisis-de-la-metafora-poetica-c1"],
        "scenarios": [
            {
                "contextAr": "حلقة دراسية نقدية في معهد ثربانتس حول التراث الشعري لفيديريكو غارثيا لوركا.",
                "settingAr": "مكتبة معهد ثربانتس المركزية في مدريد",
                "lines": [
                    {
                        "es": "La Generación del 27 logró fusionar la herencia de Góngora con las audacias de la vanguardia.",
                        "ar": "نجح جيل 27 في صهر ميراث غونغورا الكلاسيكي مع جرأة مدارس الطليعة الحديثة.",
                        "arEg": "شعراء جيل 27 قدروا يمزجوا فخامة شعر العصر الذهبي مع جنون وجرأة المدارس الحديثة والسريالية.",
                        "audioKey": "pending/c1-u4-g27-1"
                    },
                    {
                        "es": "En la obra lorquiana, la metáfora no es simple adorno, sino revelación telúrica y trágica.",
                        "ar": "في إبداع لوركا، لا تعد الاستعارة مجرد زينة سطحية، بل كشفاً أرضياً مأساوياً عن أسرار الوجود.",
                        "arEg": "في شعر لوركا، الاستعارة مش مجرد كلام حلو، دي صرخة خارجة من قلب الأرض والمأساة الإنسانية.",
                        "audioKey": "pending/c1-u4-g27-2"
                    },
                    {
                        "es": "El simbolismo de la luna y el puñal anticipa premonitoriamente su propio destino fatal.",
                        "ar": "رمزية القمر والخنجر تستشرف بنبوءة مرعبة مصيره التراجيدي المحتوم.",
                        "arEg": "رموز القمر والخناجر في شعره كانت بتتنفس وتتنبأ بمصيره الحزين ونهايته المأساوية.",
                        "audioKey": "pending/c1-u4-g27-3"
                    },
                    {
                        "es": "Su poesía aúna la pureza formal con un inquebrantable compromiso humano y social.",
                        "ar": "يجمع شعره بين النقاء الشكلي الفائق والالتزام الإنساني والاجتماعي الراسخ.",
                        "arEg": "شعره بيجمع بين صفاء ورقي الصياغة، وبين إحساس والتزام إنساني حقيقي بقضايا الناس.",
                        "audioKey": "pending/c1-u4-g27-4"
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
            "ex-c1-g27-1", "listen_choose",
            "استمع إلى حديث الناقد واكتشف كيف عرّف الاستعارة في شعر لوركا الإنساني المأساوي.",
            ["listening", "vocabulary"], 1,
            "ما هي الاستعارة في شعر لوركا وفقاً للتحليل النقدي؟",
            "En la obra lorquiana, la metáfora no es simple adorno, sino revelación telúrica y trágica.",
            "في إبداع لوركا، لا تعد الاستعارة مجرد زينة سطحية، بل كشفاً أرضياً مأساوياً عن أسرار الوجود.",
            [
                opt("a", "Revelación telúrica y trágica", "كشف وجودي مأساوي نابع من أعماق الأرض والإنسان", True),
                opt("b", "Simple adorno decorativo", "مجرد زخرفة سطحية بلا روح ولا عمق", False, "الناقد نفى هذا التفسير صراحة."),
                opt("c", "Un error de métrica", "خلل في الأوزان والقوافي الشعرية", False, "شعر لوركا معجزة إيقاعية وموسيقية.")
            ],
            ["lorquiana", "metáfora"],
            "الاستعارة اللوركاوية (metáfora lorquiana) تتجاوز التشبيه التقليدي لتصدم الوعي برؤى سريالية متجذرة في التراث الأندلسي.",
            "pending/c1-u4-g27-2",
            "En la obra lorquiana, la metáfora no es simple adorno, sino revelación telúrica y trágica."
        ),
        choice_ex(
            "ex-c1-g27-2", "word_choice",
            "أي رمز شعري يتكرر في أدب لوركا كنذير شؤم وقرين للموت والقدر التراجيدي؟",
            ["reading", "vocabulary"], 1,
            "اختر الرمز اللوركاوي المشحون بالدلالة القدرية القاتمة:",
            "En el Romancero gitano, ____ simboliza constantemente la muerte acechante.",
            "في ديوان أغاني الغجر، يرمز القمر باستمرار إلى الموت المتربص في عتمة الليل.",
            [
                opt("a", "la luna", "القمر البارد المشحون بالرمزية القدرية والموت", True),
                opt("b", "el coche", "السيارة الحديثة والمحرك البخاري", False, "عنصر ميكانيكي لا ينتمي لغنائية الغجر."),
                opt("c", "el dinero", "النقود والعملات الذهبية", False, "ليست محور الرمزية التراجيدية للوركا.")
            ],
            ["simbolismo", "rigor"],
            "القمر في عالم لوركا كائن حي مريب، بارد كالمعدن، يتربص بالأبطال والفرسان ليقودهم نحو حتفهم المكتوب."
        ),
        fill_ex(
            "ex-c1-g27-3",
            "أكمل الجملة بالصفة المنسوبة إلى الشاعر والكاتب فيديريكو غارثيا لوركا: «la obra ____».",
            ["vocabulary", "writing"], 2,
            "اكتب النسبة الأكاديمية الصحيحة للشاعر:",
            "La potencia visual de la lírica ____ sigue conmoviendo al mundo entero.",
            "إن القوة البصرية للغنائية اللوركاوية لا تزال تهز وجدان العالم بأسره.",
            ["lorquiana"],
            ["lorquiana"],
            "تنسب أعمال لوركا بإضافة اللاحقة -iana فتصير «lorquiana» كقولنا «la poesía lorquiana» أو «el drama lorquiano»."
        ),
        choice_ex(
            "ex-c1-g27-4", "word_choice",
            "ما هي السمة التي ميزت جيل 27 عن الحركات الطليعية الأوروبية الأخرى؟",
            ["vocabulary", "reading"], 1,
            "اختر الصفة الجامعة لعبقرية هذا الجيل الأدبي الفريد:",
            "Supieron conjugar el respeto a la tradición clásica con el ____ formal y social.",
            "استطاعوا المزاوجة بين احترام التراث الكلاسيكي والالتزام الشكلي والاجتماعي التحرري.",
            [
                opt("a", "compromiso", "الالتزام الجمالي والأخلاقي المبدئي", True),
                opt("b", "olvido", "النسيان التام للشعب وتطلعاته", False, "أغلبهم انحاز لحرية الشعب ودفع حياته أو نُفي."),
                opt("c", "comercio", "التجارة والتربح المالي السريع", False, "كانت حركتهم فنية خالصة ذات رسالة إنسانية.")
            ],
            ["compromiso", "vanguardia"],
            "تميز شعراء جيل 27 بـ «el compromiso» (الالتزام) بالدفاع عن الحرية والعدالة ورفض القمع والاستبداد."
        ),
        order_ex(
            "ex-c1-g27-5",
            "رتب الكلمات لبناء فكرة نقدية تبرز أصالة التجربة الشعرية لجيل 27.",
            ["grammar", "writing"], 2,
            ["Fusionaron", "la", "tradición", "con", "la", "vanguardia"],
            "Fusionaron la tradición con la vanguardia",
            "الفعل في زمن الماضي البسيط Fusionaron متبوعاً بالمفعول المباشر وجار ومجرور يمثلان الثنائية الحضارية.",
            ["vanguardia"]
        ),
        speak_ex(
            "ex-c1-g27-6",
            "انطق هذه الجملة بنبرة شعرية حالمة لكنها مشبعة بالرصانة الفكرية والوقار الأكاديمي.",
            ["speaking", "pronunciation"], 2,
            "نطق سليم مراعياً الرنين الموسيقي للمفردات:",
            "El simbolismo lorquiano trasciende toda frontera.",
            "تتجاوز الرمزية اللوركاوية كل الحدود الجغرافية والثقافية.",
            "pending/c1-u4-g27-spk",
            ["simbolismo", "lorquiana"],
            "El simbolismo lorquiano trasciende toda frontera.",
            "احرص على نطق حرف z في trasciende بصوت الثاء القشتالي الرخيم والوقف الصوتي الخفيف عند انتهاء الفكرة."
        )
    ]
    return lesson_doc(doc, exs, "C1")


def make_lesson_realismo_magico():
    slug = "c1-realismo-magico"
    titleAr = "الواقعية السحرية وأدب أمريكا اللاتينية: El realismo mágico y la identidad mestiza"
    objAr = "أن يحلل المتعلم التقنيات الروائية لـ'الواقعية السحرية' في أدب غابرييل غارسيا ماركيز ورولفو، مبيناً تطبيع الخارق وتفكيك الزمن الخطي."
    
    newVocab = ["mágico", "mestiza", "lineal", "verosimilitud", "asombro", "rigor"]
    revVocab = ["tiempo", "sociedad", "bien", "trabajo"]
    
    doc = {
        "slug": slug,
        "titleAr": titleAr,
        "level": "C1",
        "programSlug": "main-track",
        "unitSlug": "c1-u4-literature",
        "objectiveAr": objAr,
        "estimatedMinutes": 12,
        "skills": ["grammar", "reading", "writing", "listening", "vocabulary"],
        "newVocabulary": newVocab,
        "reviewVocabulary": revVocab,
        "targetStructures": [
            "La naturalización de lo insólito: narrar lo sobrenatural con tono imperturbable",
            "La ruptura del tiempo lineal: analepsis, prolepsis y tiempo cíclico mítico",
            "La verosimilitud poética fundada en la cosmovisión mestiza",
            "La dialéctica entre historia trágica y exuberancia vital"
        ],
        "grammarTopics": ["tecnicas-narrativas-c1", "realismo-magico-hispanoamericano"],
        "scenarios": [
            {
                "contextAr": "ندوة حول رواية 'مئة عام من العزلة' وأثر الواقعية السحرية في الرواية العالمية.",
                "settingAr": "بيت أمريكا (Casa de América) في ساحة ثيبيليس، مدريد",
                "lines": [
                    {
                        "es": "El prodigio del realismo mágico estriba en presentar lo milagroso como un suceso cotidiano más.",
                        "ar": "تكمن إعجازية الواقعية السحرية في تقديم الخوارق والمعجزات كأنها حدث يومي مألوف وبسيط.",
                        "arEg": "سر وعبقرية الواقعية السحرية إنها بتحكي الحاجات المستحيلة والخارقة كأنها خبر عادي بنشوفه كل يوم في الشارع.",
                        "audioKey": "pending/c1-u4-rma-1"
                    },
                    {
                        "es": "García Márquez subvierte el tiempo lineal instaurando una temporalidad cíclica y mítica.",
                        "ar": "يعطل غارسيا ماركيز الزمن الخطي المتعاقب مؤسساً لزمن دائري ملحمي يدور حول نفسه.",
                        "arEg": "ماركيز كسر فكرة الزمن اللي ماشي في خط مستقيم، وعمل زمن دائري أسطوري الأحداث بتكرر فيه نفسها.",
                        "audioKey": "pending/c1-u4-rma-2"
                    },
                    {
                        "es": "Esa narrativa hunde sus raíces en la cosmovisión mestiza y el sincretismo cultural de la región.",
                        "ar": "تضرب تلك السردية بجذورها في الرؤية الهجينة المركبة للعالم والتثاقف التوفيقي للقارة.",
                        "arEg": "طريقة الحكي دي طالعة من صميم الروح اللاتينية الهجينة اللي مزجت أساطير الهنود بدم وثقافة الإسبان.",
                        "audioKey": "pending/c1-u4-rma-3"
                    },
                    {
                        "es": "La perfecta verosimilitud del relato desarma la incredulidad del lector más escéptico.",
                        "ar": "إن الصدق الفني والإقناع السردي المحكم يجرّد القارئ الأكثر تشككاً من ارتيابه ويسحره بالكامل.",
                        "arEg": "الإقناع والصدق الفني في الحكاية بيخلي حتى أكتر قارئ شكاك يصدق المعجزة ويسلّم بيها وهو مبسوط.",
                        "audioKey": "pending/c1-u4-rma-4"
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
            "ex-c1-rma-1", "listen_choose",
            "استمع إلى حديث الناقد الأدبي وحدد السمة المحورية التي تقوم عليها سردية الواقعية السحرية.",
            ["listening", "vocabulary"], 1,
            "ما جوهر الواقعية السحرية في الرواية الإسبانية الأمريكية؟",
            "El prodigio del realismo mágico estriba en presentar lo milagroso como un suceso cotidiano más.",
            "تكمن إعجازية الواقعية السحرية في تقديم الخوارق والمعجزات كأنها حدث يومي مألوف وبسيط.",
            [
                opt("a", "Presentar lo milagroso con absoluta naturalidad cotidiana", "سرد المعجزات والخوارق بأسلوب يومي هادئ وبسيط", True),
                opt("b", "Escribir exclusivamente manuales de física cuántica", "كتابة كتب فيزياء بحتة", False, "خارج نطاق الأدب الروائي."),
                opt("c", "Negar la existencia de cualquier elemento fantástico", "إنكار أي عنصر خيالي ووصف الوقائع بحرفية", False, "هذا هو الواقع المبتذل لا الواقع السحري.")
            ],
            ["mágico", "asombro"],
            "يكمن سر الواقعية السحرية في «la naturalización de lo insólito»، حيث يصعد الموتى ويطير الناس دون أن يبدي الراوي أي اندهاش.",
            "pending/c1-u4-rma-1",
            "El prodigio del realismo mágico estriba en presentar lo milagroso como un suceso cotidiano más."
        ),
        choice_ex(
            "ex-c1-rma-2", "word_choice",
            "ما نوع البناء الزمني الذي عوّضه غارسيا ماركيز عن الزمن الخطي الكلاسيكي؟",
            ["reading", "vocabulary"], 1,
            "اختر التوصيف النقدي للزمن في 'مئة عام من العزلة':",
            "Frente a la cronología rígida, el autor opta por un tiempo ____ y recurrente.",
            "في مواجهة التسلسل الزمني الصارم، يؤثر الكاتب زمناً دائرياً أسطورياً متكرراً.",
            [
                opt("a", "cíclico", "دائري تتكرر فيه أقدار السلالة والأسماء", True),
                opt("b", "inexistente", "معدوم لا وجود له في النص", False, "الزمن حاضر بقوة بالغة."),
                opt("c", "lineal", "خطي متتابع كعقارب الساعة العادية", False, "الرواية تكسر الزمن الخطي صراحة.")
            ],
            ["lineal", "rigor"],
            "في ماكوندو يتكرر الزمن في دوائر أسطورية (tiempo cíclico)، فما حدث في الماضي يعاد بأشكال جديدة عبر الأجيال."
        ),
        fill_ex(
            "ex-c1-rma-3",
            "أكمل المصطلح النقدي الدال على مطابقة الرواية لقوانين الصدق الفني الداخلي المقنع: «la ____ del relato».",
            ["vocabulary", "writing"], 2,
            "اكتب الكلمة النقدية الدالة على المصداقية الفنية والإقناع السردي:",
            "A pesar de los elementos fantásticos, la ____ interna de la historia es intachable.",
            "على الرغم من العناصر الفانتازية المدهشة، فإن المصداقية والإقناع الفني الداخلي للقصة لا تشوبه شائبة.",
            ["verosimilitud"],
            ["verosimilitud"],
            "«La verosimilitud» (الصدق الفني أو القابلية للتصديق) هي قدرة الكاتب على إقناع القارئ بقبول قوانين عالمه التخيلي دون تشكك."
        ),
        choice_ex(
            "ex-c1-rma-4", "word_choice",
            "ما هي الخلفية الثقافية والحضارية التي تشكل مهاد هذا الأدب السحري الخالد؟",
            ["vocabulary", "reading"], 1,
            "اختر الوصف الحضاري الدقيق لروح الهوية اللاتينية المركبة:",
            "Emerge de la rica identidad ____ que amalgama cosmovisiones indígenas e hispanas.",
            "ينبثق هذا الأدب من الهوية الهجينة الثرية التي تصهر رؤى السكان الأصليين مع الثقافة الإسبانية.",
            [
                opt("a", "mestiza", "هجينة ممتزجة الدماء والروافد الحضارية", True),
                opt("b", "homogénea", "متجانسة ومغلقة تماماً على نفسها", False, "أمريكا اللاتينية قارة التنوع والتعدد."),
                opt("c", "industrial", "صناعية غربية بحتة بلا أساطير", False, "مناقض لبيئة الريف والغابات الأسطورية.")
            ],
            ["mestiza", "asombro"],
            "الهوية الهجينة (identidad mestiza) هي التربة الخصبة التي امتزج فيها سحر المعتقدات ما قبل الكولومبية مع الإسبانية الكاثوليكية."
        ),
        order_ex(
            "ex-c1-rma-5",
            "رتب الكلمات لبناء عبارة نقدية تعبر عن كسر الزمن التقليدي في الرواية.",
            ["grammar", "writing"], 2,
            ["Subvierte", "el", "tiempo", "lineal", "convencional"],
            "Subvierte el tiempo lineal convencional",
            "الفعل الدال على التعطيل والثورة Subvierte متبوعاً بالمفعول به el tiempo والصفات lineales convencional.",
            ["lineal"]
        ),
        speak_ex(
            "ex-c1-rma-6",
            "انطق هذه الجملة بنبرة ساحرة توحي بالانبهار والإعجاب بعبقرية الرواية اللاتينية.",
            ["speaking", "pronunciation"], 2,
            "نطق سليم مراعياً التدفق النغمي السلس:",
            "El realismo mágico despierta un asombro infinito.",
            "توقظ الواقعية السحرية دهشة وانبهاراً لا حدود لهما في النفس.",
            "pending/c1-u4-rma-spk",
            ["mágico", "asombro"],
            "El realismo mágico despierta un asombro infinito.",
            "احرص على سلامة نبر كلمة mágico على حرف a الأول ونطق حرف s في asombro بصوت صفيري رخو رائق."
        )
    ]
    return lesson_doc(doc, exs, "C1")


def make_lesson_critica_ensayo():
    slug = "c1-critica-ensayo"
    titleAr = "المقال الفكري والتحليل الهيرمينوطيقي: El ensayo crítico y la hermenéutica"
    objAr = "أن يحلل المتعلم نصوص المقال الفلسفي والنقدي كاشفاً البنى المضمرة والأبعاد التأويلية والتناص (hermenéutica, intertextualidad, subtexto)."
    
    newVocab = ["ensayo", "hermenéutica", "intertextualidad", "subtexto", "desentrañar", "rigor"]
    revVocab = ["tiempo", "sociedad", "bien", "trabajo"]
    
    doc = {
        "slug": slug,
        "titleAr": titleAr,
        "level": "C1",
        "programSlug": "main-track",
        "unitSlug": "c1-u4-literature",
        "objectiveAr": objAr,
        "estimatedMinutes": 12,
        "skills": ["grammar", "reading", "writing", "listening", "vocabulary"],
        "newVocabulary": newVocab,
        "reviewVocabulary": revVocab,
        "targetStructures": [
            "La hermenéutica textual: desentrañar los estratos de significado profundo",
            "La intertextualidad explícita e implícita como red de diálogos culturales",
            "La elucidación del subtexto: lo que calla la voz narrativa pero insinúa el texto",
            "La prosa ensayística: argumentación especulativa con rigor estético"
        ],
        "grammarTopics": ["el-ensayo-literario-c1", "teoria-critica-e-interpretacion"],
        "scenarios": [
            {
                "contextAr": "ندوة فكرية حول تطور فن المقال عند أورتيغا إي غاسيت وخوان غويتيصولو.",
                "settingAr": "قاعة المؤتمرات في مؤسسة أورتيغا-مارانيون، مدريد",
                "lines": [
                    {
                        "es": "El ensayo moderno no pretende dogmatizar, sino suscitar una meditación compartida con el lector.",
                        "ar": "لا يرمي المقال الفكري الحديث إلى فرض عقائد جازمة، بل إلى إثارة تأمل تشاركي هادئ مع القارئ.",
                        "arEg": "المقال الحديث مش غرضه يديك أوامر ولا يفرض عليك رأي، غرضه يشغل دماغك وتفكر مع الكاتب خطوة بخطوة.",
                        "audioKey": "pending/c1-u4-ens-1"
                    },
                    {
                        "es": "La hermenéutica nos exige desentrañar los sentidos ocultos bajo la aparente sencillez del texto.",
                        "ar": "يقتضي علم التأويل والهيرمينوطيقا منا تفكيك واستجلاء المعاني الخبيئة تحت بساطة النص الظاهرة.",
                        "arEg": "التأويل النقدي بيطلب مننا ننزل تحت السطح ونكشف المعاني المستخبية ورا الكلام البسيط اللي في الظاهر.",
                        "audioKey": "pending/c1-u4-ens-2"
                    },
                    {
                        "es": "El autor teje una sutil red de intertextualidad con los pensadores del Siglo de Oro.",
                        "ar": "ينسج المؤلف شبكة بالغة الدقة والبراعة من التناص المعرفي مع مفكري العصر الذهبي الإسباني.",
                        "arEg": "الكاتب بيعمل شبكة تناص عبقرية وحوار خفي مع عمالقة الفكر والشعر بتوع العصر الذهبي.",
                        "audioKey": "pending/c1-u4-ens-3"
                    },
                    {
                        "es": "Solo prestando atención al subtexto podemos comprender la amarga ironía de su desenlace.",
                        "ar": "فقط عبر الإنصات إلى النص المضمر والباطني، يسعنا استيعاب السخرية المرة التي تختم عمله.",
                        "arEg": "مش هنفهم السخرية المرة اللي في القفلة غير لما ناخد بالنا من الكلام اللي مستخبي بين السطور كويس.",
                        "audioKey": "pending/c1-u4-ens-4"
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
            "ex-c1-cen-1", "listen_choose",
            "استمع إلى حديث المحاضر واكتشف المنهج الفلسفي المخصص لتأويل النصوص واستجلاء طبقات معناها.",
            ["listening", "vocabulary"], 1,
            "ما الحقل النقدي المنهجي الذي دعت إليه المحاضرة لاستكشاف المعنى الخبيء؟",
            "La hermenéutica nos exige desentrañar los sentidos ocultos bajo la aparente sencillez del texto.",
            "يقتضي علم التأويل والهيرمينوطيقا منا تفكيك واستجلاء المعاني الخبيئة تحت بساطة النص الظاهرة.",
            [
                opt("a", "La hermenéutica", "علم التأويل والتفسير العميق للرموز والنصوص الإنسانية", True),
                opt("b", "La ortografía básica", "قواعد الإملاء المدرسية الأولية", False, "مهارة كتابية بسيطة لا تسمى تأويلاً."),
                opt("c", "La estadística descriptiva", "علم الإحصاء الرقمي والرسوم البيانية", False, "حقل كمي لا يفكك المجاز الأدبي.")
            ],
            ["hermenéutica", "desentrañar"],
            "«La hermenéutica» هي نظرية ومنهجية تأويل النصوص الأدبية والفلسفية لفهم ما وراء الظاهر من دلالات وجودية وتاريخية.",
            "pending/c1-u4-ens-2",
            "La hermenéutica nos exige desentrañar los sentidos ocultos bajo la aparente sencillez del texto."
        ),
        choice_ex(
            "ex-c1-cen-2", "word_choice",
            "ما هو المصطلح النقدي الدال على «تفاعل النص مع نصوص أخرى سابقة واقتباسه منها أو الإشارة إليها»؟",
            ["reading", "vocabulary"], 1,
            "اختر المفهوم النقدي المعبّر عن تداخل النصوص وحوارها:",
            "La novela dialoga con El Quijote mediante una constante ____.",
            "تحاور الرواية دون كيشوت عبر تناص معرفي وأدبي مستمر.",
            [
                opt("a", "intertextualidad", "التناص / الحوار الداخلي المتبادل بين النصوص عبر الزمن", True),
                opt("b", "traducción automática", "الترجمة الآلية بواسطة الحواسيب", False, "مصطلح تقني لا علاقة له بالنقد الأدبي."),
                opt("c", "censura previa", "الرقابة المسبقة ومنع النشر", False, "إجراء سياسي سلطوي.")
            ],
            ["intertextualidad", "rigor"],
            "«La intertextualidad» مفهوم نقدي صاغته جوليا كريستيفا ويدل على أن كل نص هو فسيفساء من استشهادات واستدعاءات لنصوص سابقة."
        ),
        fill_ex(
            "ex-c1-cen-3",
            "أكمل الجملة بالمصطلح النقدي الدال على المعنى المضمر غير المصرح به علانية بين السطور: «el ____».",
            ["vocabulary", "writing"], 2,
            "اكتب الكلمة النقدية الدالة على الباطن الدلالي للنص:",
            "El crítico reveló que el verdadero conflicto de la obra yacía en el ____ silencioso.",
            "كشف الناقد أن الصراع الحقيقي للعمل الأدبي كان يكمن في المعنى المضمر الصامت خلف الحوارات.",
            ["subtexto"],
            ["subtexto"],
            "«El subtexto» (النص المضمر أو ما تحت النص) هو المعنى النفسي والفكري الدفين الذي لا يقال صراحة بل يفهم من القرائن والسياق."
        ),
        choice_ex(
            "ex-c1-cen-4", "word_choice",
            "أي فعل أدبي فصيح يعني «كشف الأسرار المعقدة وفض مغاليقها بحنكة وفطنة»؟",
            ["vocabulary", "reading"], 1,
            "اختر الفعل الأدق دلالة على حل الألغاز وتأويل النصوص الشائكة:",
            "El ensayo busca ____ los enigmas éticos de nuestro tiempo.",
            "يسعى المقال الفكري إلى استجلاء وفض الألغاز الأخلاقية الشائكة لعصرنا الراهن.",
            [
                opt("a", "desentrañar", "استجلاء الشيء الغامض وفض أحشائه ومغاليقه", True),
                opt("b", "complicar", "تعقيد الأمور وزيادتها غموضاً وتشويشاً", False, "عكس غاية النقد والتوضيح."),
                opt("c", "olvidar", "إسقاط القضية من الحساب", False, "لا يمثل هدف المفكر الجاد.")
            ],
            ["desentrañar", "ensayo"],
            "استعارة «desentrañar» مأخوذة من إخراج الأحشاء (entrañas)، وتفيد الغوص في صلب الشيء المستتر لإخراجه إلى نور الفهم."
        ),
        order_ex(
            "ex-c1-cen-5",
            "رتب الكلمات لبناء حكم نقدي يصف طبيعة قراءة المقال الفكري المعمق.",
            ["grammar", "writing"], 2,
            ["El", "ensayo", "exige", "una", "lectura", "hermenéutica"],
            "El ensayo exige una lectura hermenéutica",
            "التركيب: الفاعل El ensayo والفعل المتعدي exige والمفعول به una lectura والصفة النقدية hermenéutica.",
            ["ensayo", "hermenéutica"]
        ),
        speak_ex(
            "ex-c1-cen-6",
            "انطق هذه الجملة بنبرة أستاذ نقد أدبي يتحدث برصانة وتؤدة في ندوة فكرية رفيعة.",
            ["speaking", "pronunciation"], 2,
            "نطق سليم مراعياً الضغط الصوتي على حروف العلة الصحيحة:",
            "Debemos desentrañar el subtexto de la obra.",
            "يتعين علينا استجلاء المعنى المضمر والباطني لهذا العمل الإبداعي.",
            "pending/c1-u4-ens-spk",
            ["desentrañar", "subtexto"],
            "Debemos desentrañar el subtexto de la obra.",
            "احرص على مد مقطع -tra- المشدد في desentrañar والنطق الصحيح للمقطع المزدوج -xt- في subtexto بوضوح."
        )
    ]
    return lesson_doc(doc, exs, "C1")
