# -*- coding: utf-8 -*-
"""
tools/books/perfect_data_b2.py
Pure schema definitions for B2 unit b2-u1-argument (4 lessons).
100% compliant with validate-content.mjs and vitest content-gates.
"""

B2_LESSONS = [
    # -------------------------------------------------------------
    # 1. b2-condicional-imperfecto-subjuntivo
    # -------------------------------------------------------------
    {
        "dir": "content/drafts/b2",
        "file": "lesson-b2-condicional-imperfecto-subjuntivo.json",
        "lesson": {
            "slug": "b2-condicional-imperfecto-subjuntivo",
            "titleAr": "الجمل الشرطية الافتراضية: Si + Imperfecto de Subjuntivo",
            "level": "B2",
            "programSlug": "main-track",
            "unitSlug": "b2-u1-argument",
            "objectiveAr": "أن يتقن المتعلم صياغة واستخدام الجمل الشرطية الافتراضية غير المتحققة في الحاضر (المقابلة لأداة «لو» الامتناعية في العربية) بتركيب: Si + Imperfecto de Subjuntivo -> Condicional Simple.",
            "estimatedMinutes": 12,
            "skills": ["grammar", "reading", "writing", "listening", "vocabulary"],
            "newVocabulary": ["tuviera", "fuera", "viajaría", "compraría", "condición", "imposible"],
            "reviewVocabulary": ["tiempo", "dinero", "mundo", "amigo"],
            "targetStructures": [
                "Estructura fija: Si + Imperfecto de Subjuntivo + Condicional Simple",
                "Ejemplo: Si tuviera más tiempo libre, estudiaría otro idioma",
                "Correspondencia con el árabe: لو كان معي... لفعلتُ (شرط امتناعي)",
                "Terminaciones de imperfecto de subjuntivo: -ra, -ras, -ra, -́ramos, -rais, -ran"
            ],
            "grammarTopics": ["condicionales-irreales-presente", "imperfecto-subjuntivo-formacion"],
            "scenarios": [
                {
                    "contextAr": "حوار بين رفيقين في السكن يتخيلان ما سيفعلانه لو امتلكا ثروة مالية طائلة أو وقت فراغ كبير.",
                    "settingAr": "شرفة المنزل، وقت الغروب",
                    "lines": [
                        {
                            "es": "Si tuvieras un millón de euros ahora mismo, ¿qué harías?",
                            "ar": "لو كان معك مليون يورو الآن، ماذا كنت ستفعل؟",
                            "arEg": "لو معاك مليون يورو دلوقتي في جيبك، هتعمل بيهم إيه؟",
                            "audioKey": "pending/b2-cond-amigos-1"
                        },
                        {
                            "es": "Si tuviera ese dinero, viajaría por todo el mundo y crearía una fundación benéfica.",
                            "ar": "لو كان لديّ ذلك المال، لسافرتُ حول العالم وأنشأتُ مؤسسة خيرية.",
                            "arEg": "لو معايا الفلوس دي، هلف العالم كله وأعمل مؤسسة خيرية.",
                            "audioKey": "pending/b2-cond-amigos-2"
                        },
                        {
                            "es": "¿Y dejarías tu trabajo actual?",
                            "ar": "وهل كنت ستترك عملك الحالي؟",
                            "arEg": "وكنت هتسيب شغلك؟",
                            "audioKey": "pending/b2-cond-amigos-3"
                        },
                        {
                            "es": "No lo dejaría, pero trabajaría menos horas para dedicarme a escribir.",
                            "ar": "لن أتركه، لكني سأعمل ساعات أقل لأتفرغ للكتابة.",
                            "arEg": "مش هسيبه، بس هشتغل ساعات أقل عشان أروّق للكتابة.",
                            "audioKey": "pending/b2-cond-amigos-4"
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
            "exercises": [
                {
                    "id": "b2_cond_1_listen",
                    "type": "listen_choose",
                    "instructionAr": "استمع واختر ما كان الصديق سيفعله لو امتلك مليون يورو.",
                    "audioKey": "pending/b2-cond-amigos-2",
                    "speechEs": "Si tuviera ese dinero, viajaría por todo el mundo y crearía una fundación benéfica.",
                    "options": [
                        {"id": "b2_cond_1_a", "text": "Viajar por el mundo y crear una fundación benéfica", "isCorrect": True, "textAr": "السفر حول العالم وإنشاء مؤسسة خيرية"},
                        {"id": "b2_cond_1_b", "text": "Comprar coches de lujo y quedarse en casa", "isCorrect": False, "textAr": "شراء سيارات فارهة والجلوس في المنزل", "distractorRationaleAr": "لم يذكر شراء سيارات في الحوار."},
                        {"id": "b2_cond_1_c", "text": "Mudarse solo a una isla desierta", "isCorrect": False, "textAr": "الانتقال بمفرده إلى جزيرة منعزلة", "distractorRationaleAr": "لم يتلفظ بأي فكرة عن الانتقال لجزيرة."}
                    ],
                    "answerKey": {"correctOptionIds": ["b2_cond_1_a"]},
                    "explanationAr": "قال المتحدث صراحة: «Si tuviera ese dinero, viajaría por todo el mundo y crearía una fundación benéfica» مستخدمًا صيغة الشرط الافتراضي.",
                    "errorFeedback": {
                        "b2_cond_1_b": "لم يذكر شراء سيارات في التسجيل.",
                        "b2_cond_1_c": "لم يذكر الانتقال لجزيرة منعزلة."
                    },
                    "skills": ["listening"],
                    "difficulty": 1,
                    "targetVocab": ["viajaría", "tuviera"],
                    "scoring": {"mode": "all_or_nothing"}
                },
                {
                    "id": "b2_cond_2_structure",
                    "type": "word_choice",
                    "instructionAr": "ما هو التركيب النحوي القياسي للجمل الشرطية الافتراضية في الحاضر؟",
                    "options": [
                        {"id": "b2_cond_2_a", "text": "Si + Imperfecto de Subjuntivo + Condicional Simple", "isCorrect": True, "textAr": "التركيب القياسي الصحيح للشرط الافتراضي"},
                        {"id": "b2_cond_2_b", "text": "Si + Presente de Indicativo + Futuro Simple", "isCorrect": False, "textAr": "تركيب الشرط الواقعي الممكن", "distractorRationaleAr": "هذا تركيب الشرط الممكن الحدوث (Si tengo tiempo, iré) وليس الشرط الافتراضي."},
                        {"id": "b2_cond_2_c", "text": "Si + Condicional Simple + Imperfecto de Subjuntivo", "isCorrect": False, "textAr": "عكس الأدوات غير الصحيح", "distractorRationaleAr": "قاعدة صارمة: لا يجوز وضع Condicional بعد أداة الشرط Si مباشرة."}
                    ],
                    "answerKey": {"correctOptionIds": ["b2_cond_2_a"]},
                    "explanationAr": "الشرط الافتراضي غير المتحقق في الحاضر يتطلب دائماً صيغة Imperfecto de Subjuntivo في جملة الشرط، وصيغة Condicional Simple في جواب الشرط.",
                    "errorFeedback": {
                        "b2_cond_2_b": "هذا للشرط الواقعي الممكن.",
                        "b2_cond_2_c": "لا يجوز استخدام Condicional بعد أداة Si مباشرة."
                    },
                    "skills": ["grammar"],
                    "difficulty": 1,
                    "targetVocab": ["condición"],
                    "scoring": {"mode": "all_or_nothing"}
                },
                {
                    "id": "b2_cond_3_fill_if",
                    "type": "fill_blank",
                    "instructionAr": "أكمل فعل الشرط بعد Si: «لو كنتُ مكانك، لقبلتُ العرض».",
                    "stemEs": "Si yo ____ tú, aceptaría la oferta de trabajo inmediatamente.",
                    "stemAr": "لو ____ مكانك، لقبلتُ عرض العمل على الفور.",
                    "answerKey": {
                        "accepted": ["fuera", "fuese"],
                        "caseSensitive": False
                    },
                    "explanationAr": "العبارة الإسبانية الشهيرة لتقديم النصيحة الافتراضية هي «Si yo fuera tú...» (لو كنتُ مكانك)، وتستخدم فعل ser في صيغة Imperfecto de Subjuntivo: fuera.",
                    "errorFeedback": {
                        "sería": "خطأ محظور: لا نضع صيغة Condicional بعد أداة Si أبداً.",
                        "soy": "soy في المضارع الواقعي، والافتراض هنا خيالي.",
                        "era": "era تتبع صيغة indicativo ولا تستخدم بعد Si الشرطية الافتراضية."
                    },
                    "skills": ["grammar", "writing"],
                    "difficulty": 2,
                    "targetVocab": ["fuera"],
                    "scoring": {"mode": "all_or_nothing"}
                },
                {
                    "id": "b2_cond_4_fill_apodosis",
                    "type": "fill_blank",
                    "instructionAr": "أكمل جواب الشرط بصيغة Condicional: «لو كان لدينا وقت، لدرسنا لغة ثانية».",
                    "stemEs": "Si tuviéramos más tiempo libre, ____ otro idioma extranjero.",
                    "stemAr": "لو كان لدينا المزيد من وقت الفراغ، لدرسنا لغة أجنبية أخرى.",
                    "answerKey": {
                        "accepted": ["estudiaríamos", "aprenderíamos"],
                        "caseSensitive": False
                    },
                    "explanationAr": "في جواب الشرط المقترن بـ Imperfecto de Subjuntivo نستخدم صيغة Condicional Simple مع nosotros: estudiaríamos.",
                    "errorFeedback": {
                        "estudiamos": "المطلوب صيغة الشرطي Condicional وليس المضارع.",
                        "estudiemos": "هذا منصوب مضارع ولا يصح في جواب الشرط الافتراضي."
                    },
                    "skills": ["grammar", "writing"],
                    "difficulty": 2,
                    "targetVocab": ["tuviera"],
                    "scoring": {"mode": "all_or_nothing"}
                },
                {
                    "id": "b2_cond_5_arabic_parallel",
                    "type": "word_choice",
                    "instructionAr": "أي أداة شرطية في اللغة العربية تطابق تمامًا دلالة هذا التركيب؟",
                    "options": [
                        {"id": "b2_cond_5_a", "text": "La partícula condicional irreal 'law'", "isCorrect": True, "textAr": "أداة الشرط الامتناعية (لو)"},
                        {"id": "b2_cond_5_b", "text": "La partícula condicional posible 'in'", "isCorrect": False, "textAr": "أداة الشرط الإمكانية (إن)", "distractorRationaleAr": "«إن» الشرطية في العربية تفيد الإمكان والواقعية، وتقابل Si + Presente."},
                        {"id": "b2_cond_5_c", "text": "La partícula de certeza 'qad'", "isCorrect": False, "textAr": "حرف التحقيق (قد)", "distractorRationaleAr": "«قد» حرف تحقيق أو تشكيك وليس أداة شرط."}
                    ],
                    "answerKey": {"correctOptionIds": ["b2_cond_5_a"]},
                    "explanationAr": "في البلاغة العربية، «لو» هي حرف امتناع لامتناع (امتناع الجواب لامتناع الشرط)، وهي المعادل الدقيق لـ Si + Imperfecto de Subjuntivo.",
                    "errorFeedback": {
                        "b2_cond_5_b": "«إن» تفيد الإمكان وليس الامتناع الافتراضي.",
                        "b2_cond_5_c": "«قد» حرف تحقيق وليس أداة شرط."
                    },
                    "skills": ["reading"],
                    "difficulty": 1,
                    "targetVocab": ["imposible"],
                    "scoring": {"mode": "all_or_nothing"}
                },
                {
                    "id": "b2_cond_6_speak",
                    "type": "speak_with_text",
                    "instructionAr": "انطق الجملة الشرطية التالية بنبرة افتراضية واضحة مع إبراز النبرة الصوتية على tuviéramos.",
                    "stemEs": "Si tuviera más tiempo libre, viajaría por todo el mundo.",
                    "stemAr": "لو كان لديّ المزيد من وقت الفراغ، لسافرت حول العالم بأكمله.",
                    "answerKey": {
                        "referenceAudioKey": "pending/b2-cond-speak-1",
                        "modelAnswer": "Si tuviera más tiempo libre, viajaría por todo el mundo."
                    },
                    "explanationAr": "لاحظ النطق السليم للنبرة في tuviera على المقطع قبل الأخير (tu-VIE-ra)، والنبرة في viajaría على الياء الأخيرة الممدودة (via-ja-RÍ-a).",
                    "skills": ["speaking", "pronunciation"],
                    "difficulty": 2,
                    "targetVocab": ["viajaría", "tuviera"],
                    "scoring": {
                        "mode": "rubric",
                        "rubric": [
                            {"labelAr": "نطق tuviera بنبر سليم", "weight": 50, "code": "stress_tuviera"},
                            {"labelAr": "نطق viajaría مع مد الياء المنبورة", "weight": 50, "code": "stress_viajaria"}
                        ]
                    }
                }
            ],
            "review": {
                "status": "draft",
                "authors": ["فريق المنهج - اشتقاق تطبيقي من سلاسل كتب Aula Plus 3 وEn Vocabulario B2"],
                "spanishReviewer": None,
                "translationReviewer": None,
                "reviewedAt": None,
                "notes": "الدرس يقدم الجمل الشرطية الافتراضية مع المقارنة البلاغية بأداة لو الامتناعية للمتعلم العربي."
            }
        }
    },

    # -------------------------------------------------------------
    # 2. b2-conectores-argumentativos
    # -------------------------------------------------------------
    {
        "dir": "content/drafts/b2",
        "file": "lesson-b2-conectores-argumentativos.json",
        "lesson": {
            "slug": "b2-conectores-argumentativos",
            "titleAr": "روابط المحاجة والنقاش: Conectores argumentativos",
            "level": "B2",
            "programSlug": "main-track",
            "unitSlug": "b2-u1-argument",
            "objectiveAr": "أن يوظف المتعلم روابط المحاجة والاستدراك المتقدمة (Sin embargo, Por lo tanto, No obstante, En cambio) لربط الحجج وإبراز التباين والنتيجة في النقاشات الفكرية والمهنية.",
            "estimatedMinutes": 11,
            "skills": ["grammar", "reading", "writing", "listening", "vocabulary"],
            "newVocabulary": ["embargo", "obstante", "cambio", "conector", "argumento", "resultado"],
            "reviewVocabulary": ["trabajo", "amigo", "tiempo", "bien"],
            "targetStructures": [
                "Oposición / Concesión: Sin embargo / No obstante (ومع ذلك / بيد أن)",
                "Contraste directo: En cambio / Por el contrario (في المقابل / على العكس)",
                "Consecuencia: Por lo tanto / Por consiguiente (وبناءً على ذلك / ولذلك)"
            ],
            "grammarTopics": ["conectores-discursivos-b2", "argumentacion-y-debate"],
            "scenarios": [
                {
                    "contextAr": "مناظرة في منتدى اقتصادي جامعي حول التحول إلى الطاقة النظيفة والتحديات المالية المصاحبة له.",
                    "settingAr": "قاعة المؤتمرات بجامعة سالامانكا",
                    "lines": [
                        {
                            "es": "La transición energética es urgente e inaplazable para nuestro futuro.",
                            "ar": "التحول الطاقي مسألة ملحة لا تحتمل التأجيل من أجل مستقبلنا.",
                            "arEg": "التحول للطاقة النظيفة ضروري وميستحملش تأخير عشان مستقبلنا.",
                            "audioKey": "pending/b2-conec-debate-1"
                        },
                        {
                            "es": "Es verdad; sin embargo, los costes de implementación son muy elevados.",
                            "ar": "هذا صحيح؛ ومع ذلك، فإن تكاليف التطبيق باهظة للغاية.",
                            "arEg": "ده حقيقي؛ بس مع ذلك مصاريف التنفيذ عالية جداً.",
                            "audioKey": "pending/b2-conec-debate-2"
                        },
                        {
                            "es": "No obstante, retrasar el cambio generará pérdidas ecológicas irreparables.",
                            "ar": "بيد أن تأخير التغيير سيولد خسائر بيئية لا يمكن تعويضها.",
                            "arEg": "رغم كده، تأخير الخطوة دي هيجيب خساير بيئية متتعوضش.",
                            "audioKey": "pending/b2-conec-debate-3"
                        },
                        {
                            "es": "Por lo tanto, debemos buscar financiación mixta para apoyar a la industria.",
                            "ar": "ولذلك، يتعين علينا البحث عن تمويل مختلط لدعم القطاع الصناعي.",
                            "arEg": "عشان كده، لازم ندور على تمويل مشترك نسند بيه الصناعة.",
                            "audioKey": "pending/b2-conec-debate-4"
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
            "exercises": [
                {
                    "id": "b2_conec_1_listen",
                    "type": "listen_choose",
                    "instructionAr": "استمع إلى المتحدث الأول ولاحظ كيف استدرك بالاعتراض على تكاليف المشروع.",
                    "audioKey": "pending/b2-conec-debate-2",
                    "speechEs": "Es verdad; sin embargo, los costes de implementación son muy elevados.",
                    "options": [
                        {"id": "b2_conec_1_a", "text": "Sin embargo, los costes son muy elevados", "isCorrect": True, "textAr": "ومع ذلك، التكاليف باهظة للغاية"},
                        {"id": "b2_conec_1_b", "text": "Por lo tanto, todo el proyecto es gratis", "isCorrect": False, "textAr": "ولذلك المشروع مجاني بالكامل", "distractorRationaleAr": "لم يقل ذلك، بل ذكر التكاليف المرتفعة."},
                        {"id": "b2_conec_1_c", "text": "Además, no hay ningún obstáculo económico", "isCorrect": False, "textAr": "علاوة على ذلك لا توجد عقبة اقتصادية", "distractorRationaleAr": "مناقض تماماً لما ذكره المتحدث."}
                    ],
                    "answerKey": {"correctOptionIds": ["b2_conec_1_a"]},
                    "explanationAr": "استخدم المتحدث رابط الاستدراك «sin embargo» (ومع ذلك / لكن) للتحفظ على التكاليف العالية رغم موافقته على أهمية الفكرة.",
                    "errorFeedback": {
                        "b2_conec_1_b": "لم يقل أن المشروع مجاني.",
                        "b2_conec_1_c": "لم يقل أنه لا توجد عقبات."
                    },
                    "skills": ["listening"],
                    "difficulty": 1,
                    "targetVocab": ["embargo"],
                    "scoring": {"mode": "all_or_nothing"}
                },
                {
                    "id": "b2_conec_2_function",
                    "type": "word_choice",
                    "instructionAr": "ما هي الوظيفة البلاغية للرابط «no obstante» في النصوص والمقالات الجادة؟",
                    "options": [
                        {"id": "b2_conec_2_a", "text": "Introducir una objeción formal o contraste matizado", "isCorrect": True, "textAr": "تقديم اعتراض رسمي أو استدراك دقيق"},
                        {"id": "b2_conec_2_b", "text": "Expresar causa y justificación básica", "isCorrect": False, "textAr": "التعبير عن السبب والتعليل البسيط", "distractorRationaleAr": "السبب والتعليل يعبر عنهما بأدوات مثل porque أو ya que."},
                        {"id": "b2_conec_2_c", "text": "Enumerar elementos cronológicos en una lista", "isCorrect": False, "textAr": "تعداد عناصر زمنية متتابعة", "distractorRationaleAr": "التعداد الزمني يستخدم primero أو luego وليس no obstante."}
                    ],
                    "answerKey": {"correctOptionIds": ["b2_conec_2_a"]},
                    "explanationAr": "الرابط «no obstante» هو مرادف راقٍ وأكاديمي لـ sin embargo، ويعادل في العربية الفصحى «بيد أن / مع ذلك / غير أن».",
                    "errorFeedback": {
                        "b2_conec_2_b": "السبب يُعبر عنه بـ porque.",
                        "b2_conec_2_c": "التعداد الزمني يُعبر عنه بـ primero, luego."
                    },
                    "skills": ["reading"],
                    "difficulty": 1,
                    "targetVocab": ["obstante"],
                    "scoring": {"mode": "all_or_nothing"}
                },
                {
                    "id": "b2_conec_3_fill_however",
                    "type": "fill_blank",
                    "instructionAr": "أكمل رابط الاستدراك الأشهر: «المشروع جذاب؛ ومع ذلك، ينطوي على مخاطر».",
                    "stemEs": "El plan es muy atractivo; sin ____, entraña ciertos riesgos.",
                    "stemAr": "الخطة جذابة للغاية؛ ومع ذلك، تنطوي على مخاطر معينة.",
                    "answerKey": {
                        "accepted": ["embargo"],
                        "caseSensitive": False
                    },
                    "explanationAr": "التعبير التنازلي القياسي المكون من كلمتين للاستدراك هو «sin embargo» (ومع ذلك).",
                    "errorFeedback": {
                        "duda": "sin duda تعني بلا شك (توكيد)، والمطلوب استدراك sin embargo.",
                        "falta": "sin falta تعني دون تقصير، ولا تناسب سياق الاستدراك."
                    },
                    "skills": ["writing", "grammar"],
                    "difficulty": 2,
                    "targetVocab": ["embargo"],
                    "scoring": {"mode": "all_or_nothing"}
                },
                {
                    "id": "b2_conec_4_fill_conclusion",
                    "type": "fill_blank",
                    "instructionAr": "أكمل رابط النتيجة المنطقية: «لم يلتزموا بالموعد؛ ولذلك، أُلغي العقد».",
                    "stemEs": "Incumplieron el plazo pactado; por lo ____, se rescindió el contrato.",
                    "stemAr": "أخلّوا بالموعد المتفق عليه؛ ولذلك، تم فسخ العقد.",
                    "answerKey": {
                        "accepted": ["tanto"],
                        "caseSensitive": False
                    },
                    "explanationAr": "رابط النتيجة المنطقية المباشرة في الإسبانية هو «por lo tanto» (ولذلك / وبناء عليه).",
                    "errorFeedback": {
                        "menos": "por lo menos تعني على الأقل، والمطلوب نتيجة سببية por lo tanto.",
                        "pronto": "por lo pronto تعني في الوقت الحالي مبدئياً."
                    },
                    "skills": ["writing", "grammar"],
                    "difficulty": 2,
                    "targetVocab": ["resultado"],
                    "scoring": {"mode": "all_or_nothing"}
                },
                {
                    "id": "b2_conec_5_en_cambio",
                    "type": "fill_blank",
                    "instructionAr": "أكمل رابط التباين والمقابلة: «سارة تفضل الأدب؛ في المقابل، أخوها يدرس الهندسة».",
                    "stemEs": "Sara prefiere las letras; en ____, su hermano estudia ingeniería.",
                    "stemAr": "سارة تفضل الدراسات الأدبية؛ في المقابل، يدرس شقيقها الهندسة.",
                    "answerKey": {
                        "accepted": ["cambio"],
                        "caseSensitive": False
                    },
                    "explanationAr": "رابط المقابلة بين أمرين مختلفين هو «en cambio» ويعادل في العربية «في المقابل / أما فـ...».",
                    "errorFeedback": {
                        "vez": "en vez de تعني بدلاً من وتتطلب حرف جر ومصدراً.",
                        "contra": "en contra تعني بالضد وليس في المقابل."
                    },
                    "skills": ["writing", "grammar"],
                    "difficulty": 2,
                    "targetVocab": ["cambio"],
                    "scoring": {"mode": "all_or_nothing"}
                },
                {
                    "id": "b2_conec_6_speak",
                    "type": "speak_with_text",
                    "instructionAr": "انطق هذه العبارة الحجاجية بنبرة هادئة ومقنعة مع الوقف القصير بعد الرابط.",
                    "stemEs": "Estudió mucho; no obstante, el examen resultó bastante exigente.",
                    "stemAr": "درس كثيرًا؛ بيد أن الامتحان كان متطلبًا وصعبًا للغاية.",
                    "answerKey": {
                        "referenceAudioKey": "pending/b2-conec-speak-1",
                        "modelAnswer": "Estudió mucho; no obstante, el examen resultó bastante exigente."
                    },
                    "explanationAr": "انتبه لنطق no obstante بسلاسة، مع مراعاة السكتة الخفيفة بعدها كعلامة ترقيم صوتية تمهد للاعتراض البلاغي.",
                    "skills": ["speaking", "pronunciation"],
                    "difficulty": 2,
                    "targetVocab": ["obstante"],
                    "scoring": {
                        "mode": "rubric",
                        "rubric": [
                            {"labelAr": "نطق رابط no obstante بوضوح", "weight": 50, "code": "pron_no_obstante"},
                            {"labelAr": "نطق exigente مع الجيم الخائية الإسبانية", "weight": 50, "code": "pron_exigente"}
                        ]
                    }
                }
            ],
            "review": {
                "status": "draft",
                "authors": ["فريق المنهج - اشتقاق تطبيقي من سلاسل كتب Aula Plus 3 وEn Vocabulario B2"],
                "spanishReviewer": None,
                "translationReviewer": None,
                "reviewedAt": None,
                "notes": "الدرس يركز على روابط الخطاب والمحاجة الفكرية في مستوى B2."
            }
        }
    },

    # -------------------------------------------------------------
    # 3. b2-matizar-opiniones
    # -------------------------------------------------------------
    {
        "dir": "content/drafts/b2",
        "file": "lesson-b2-matizar-opiniones.json",
        "lesson": {
            "slug": "b2-matizar-opiniones",
            "titleAr": "تعديل الرأي والتحفظ الدبلوماسي: Matizar opiniones",
            "level": "B2",
            "programSlug": "main-track",
            "unitSlug": "b2-u1-argument",
            "objectiveAr": "أن يستخدم المتعلم أساليب تعديل الرأي والتحفظ الدبلوماسي (Hasta cierto punto, En parte es verdad, Cabría añadir) لتجنب القطع الجازم في النقاشات الفكرية والمهنية الرفيعة.",
            "estimatedMinutes": 11,
            "skills": ["grammar", "reading", "writing", "listening", "vocabulary"],
            "newVocabulary": ["matiz", "punto", "verdad", "añadir", "opinión", "aspecto"],
            "reviewVocabulary": ["trabajo", "amigo", "bien", "sociedad"],
            "targetStructures": [
                "Matización: Hasta cierto punto / En cierta medida",
                "Concesión parcial: En parte es verdad, pero...",
                "Adición prudente: Cabría añadir que... / Convendría matizar que..."
            ],
            "grammarTopics": ["matizar-opiniones-b2", "diplomacia-argumentativa"],
            "scenarios": [
                {
                    "contextAr": "نقاش بين خبيرين في التخطيط العمراني حول مشروع تحويل وسط المدينة إلى منطقة للمشاة فقط.",
                    "settingAr": "مقر بلدية بلنسية (فالنسيا)، ورشة عمل",
                    "lines": [
                        {
                            "es": "Prohibir el tráfico privado en el centro revitaliza el comercio local.",
                            "ar": "حظر حركة المرور الخاصة في مركز المدينة ينعش التجارة المحلية.",
                            "arEg": "منع العربيات في وسط البلد بينشط المحلات والبيزنس.",
                            "audioKey": "pending/b2-matiz-urban-1"
                        },
                        {
                            "es": "Hasta cierto punto es verdad, pero dificulta la distribución logística para los proveedores.",
                            "ar": "إلى حدّ ما هذا صحيح، ولكنه يعرقل التوزيع اللوجستي للموردين وأصحاب البضائع.",
                            "arEg": "لحد معين ده حقيقي، بس بيعطل الشحن وتوصيل البضايع للتجار.",
                            "audioKey": "pending/b2-matiz-urban-2"
                        },
                        {
                            "es": "Cabría añadir que se pueden habilitar horarios nocturnos de carga y descarga.",
                            "ar": "وتجدر الإضافة إلى أنه يمكن تخصيص مواعيد ليلية للشحن والتفريغ.",
                            "arEg": "ونقدر نضيف كمان إننا نعمل مواعيد بالليل للتحميل والتنزيل.",
                            "audioKey": "pending/b2-matiz-urban-3"
                        },
                        {
                            "es": "Desde esa perspectiva, la propuesta resulta mucho más viable y equilibrada.",
                            "ar": "من هذا المنظور، يصبح المقترح أكثر قابلية للتطبيق وتوازنًا بكثير.",
                            "arEg": "من الزاوية دي، الفكرة بقت منطقية ومتوازنة أكتر بكتير.",
                            "audioKey": "pending/b2-matiz-urban-4"
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
            "exercises": [
                {
                    "id": "b2_matiz_1_listen",
                    "type": "listen_choose",
                    "instructionAr": "استمع إلى الخبير واختر العبارة الدبلوماسية التي استخدمها لإبداء تحفظه الجزئي.",
                    "audioKey": "pending/b2-matiz-urban-2",
                    "speechEs": "Hasta cierto punto es verdad, pero dificulta la distribución logística para los proveedores.",
                    "options": [
                        {"id": "b2_matiz_1_a", "text": "Hasta cierto punto es verdad", "isCorrect": True, "textAr": "إلى حد ما هذا صحيح"},
                        {"id": "b2_matiz_1_b", "text": "Es una propuesta completamente absurda", "isCorrect": False, "textAr": "هذا مقترح سخيف تماماً", "distractorRationaleAr": "عبارة هجومية غير لائقة لم ترد في التسجيل."},
                        {"id": "b2_matiz_1_c", "text": "Estoy totalmente en desacuerdo absoluto", "isCorrect": False, "textAr": "أنا غير موافق إطلاقاً بشكل قطعي", "distractorRationaleAr": "لم يعلن رفضاً مطلقاً بل تحفّظاً جزئياً."}
                    ],
                    "answerKey": {"correctOptionIds": ["b2_matiz_1_a"]},
                    "explanationAr": "استخدم المتحدث عبارة «Hasta cierto punto» (إلى حدّ ما / إلى درجة معينة) وهي من أرقى صيغ التعديل والتحفظ الدبلوماسي في اللغة الإسبانية.",
                    "errorFeedback": {
                        "b2_matiz_1_b": "أسلوب هجومي لم يُذكر.",
                        "b2_matiz_1_c": "لم يرفض كلياً بل وافق جزئياً."
                    },
                    "skills": ["listening"],
                    "difficulty": 1,
                    "targetVocab": ["punto", "verdad"],
                    "scoring": {"mode": "all_or_nothing"}
                },
                {
                    "id": "b2_matiz_2_collocation",
                    "type": "word_choice",
                    "instructionAr": "أيّ من هذه التعبيرات يُستخدم لإضافة ملاحظة دقيقة دون فرضها بشكل قاطع؟",
                    "options": [
                        {"id": "b2_matiz_2_a", "text": "Cabría añadir que...", "isCorrect": True, "textAr": "وتجدر الإضافة إلى أن..."},
                        {"id": "b2_matiz_2_b", "text": "Tienes que aceptar que...", "isCorrect": False, "textAr": "يجب عليك أن تقبل بأن...", "distractorRationaleAr": "أسلوب إلزامي فظ لا يناسب التحفظ الدبلوماسي."},
                        {"id": "b2_matiz_2_c", "text": "Es obligatorio reconocer que...", "isCorrect": False, "textAr": "من الإجباري الاعتراف بأن...", "distractorRationaleAr": "غير مألوف في لغة الحوار الراقي."}
                    ],
                    "answerKey": {"correctOptionIds": ["b2_matiz_2_a"]},
                    "explanationAr": "صيغة «Cabría añadir / señalar» (مشتقة من الفعل caber في صيغة condicional) تعبر عن قمة الأدب الأكاديمي والتحفظ البلاغي في إبداء الملاحظات.",
                    "errorFeedback": {
                        "b2_matiz_2_b": "أسلوب استعلائي فظ.",
                        "b2_matiz_2_c": "تعبير إلزامي غير لائق."
                    },
                    "skills": ["reading", "vocabulary"],
                    "difficulty": 1,
                    "targetVocab": ["añadir", "matiz"],
                    "scoring": {"mode": "all_or_nothing"}
                },
                {
                    "id": "b2_matiz_3_fill_measure",
                    "type": "fill_blank",
                    "instructionAr": "أكمل الفراغ بعبارة التحفظ: «في جزء منه هذا صحيح، ولكن...».",
                    "stemEs": "En ____ es verdad, pero conviene analizar todos los detalles.",
                    "stemAr": "في ____ منه هذا صحيح، ولكن يجدر بنا تحليل جميع التفاصيل.",
                    "answerKey": {
                        "accepted": ["parte"],
                        "caseSensitive": False
                    },
                    "explanationAr": "التعبير الثابت «En parte es verdad» يعني (في جزء منه هذا صحيح)، ويُستخدم لتفادي الرفض الفج والتمهيد للاعتراض المهذب.",
                    "errorFeedback": {
                        "todo": "En todo تعني كلياً وتنفي التحفظ.",
                        "nada": "En nada نفي مطلق يناقض كلمة verdad."
                    },
                    "skills": ["writing", "vocabulary"],
                    "difficulty": 2,
                    "targetVocab": ["verdad"],
                    "scoring": {"mode": "all_or_nothing"}
                },
                {
                    "id": "b2_matiz_4_fill_perspective",
                    "type": "fill_blank",
                    "instructionAr": "أكمل التعبير الراقي: «إلى حدٍّ ما معك حق، غير أن هناك استثناءات».",
                    "stemEs": "Hasta cierto ____ tienes razón, aunque hay excepciones notables.",
                    "stemAr": "إلى حدٍّ ____ معك حق، مع أن هناك استثناءات بارزة.",
                    "answerKey": {
                        "accepted": ["punto"],
                        "caseSensitive": False
                    },
                    "explanationAr": "التعبير الاصطلاحي القياسي للتعديل هو «Hasta cierto punto» (إلى حد ما / إلى نقطة معينة).",
                    "errorFeedback": {
                        "momento": "hasta cierto momento تفيد التوقيت الزمني وليس المقدار البلاغي.",
                        "lugar": "hasta cierto lugar تفيد المكان وليس الرأي."
                    },
                    "skills": ["writing", "grammar"],
                    "difficulty": 2,
                    "targetVocab": ["punto", "matiz"],
                    "scoring": {"mode": "all_or_nothing"}
                },
                {
                    "id": "b2_matiz_5_order",
                    "type": "word_order",
                    "instructionAr": "رتب الكلمات التالية لتكوين جملة تحفظ دبلوماسي راقية.",
                    "items": [
                        {"id": "b2_mat_t1", "kind": "token", "text": "Hasta"},
                        {"id": "b2_mat_t2", "kind": "token", "text": "cierto"},
                        {"id": "b2_mat_t3", "kind": "token", "text": "punto"},
                        {"id": "b2_mat_t4", "kind": "token", "text": "es"},
                        {"id": "b2_mat_t5", "kind": "token", "text": "correcto."}
                    ],
                    "answerKey": {
                        "accepted": ["Hasta cierto punto es correcto."],
                        "tokenOrder": ["b2_mat_t1", "b2_mat_t2", "b2_mat_t3", "b2_mat_t4", "b2_mat_t5"]
                    },
                    "explanationAr": "الترتيب البلاغي يبدأ بعبارة التحفظ: Hasta cierto punto (إلى حدٍّ ما) ثم يتبعها الحكم: es correcto (هذا صحيح).",
                    "skills": ["writing", "grammar"],
                    "difficulty": 2,
                    "targetVocab": ["punto", "matiz"],
                    "scoring": {"mode": "all_or_nothing"}
                },
                {
                    "id": "b2_matiz_6_speak",
                    "type": "speak_with_text",
                    "instructionAr": "انطق عبارة الإضافة الدبلوماسية التالية بنبرة هادئة ومحترفة.",
                    "stemEs": "Cabría añadir que existen otras alternativas viables.",
                    "stemAr": "وتجدر الإضافة إلى وجود بدائل أخرى قابلة للتطبيق.",
                    "answerKey": {
                        "referenceAudioKey": "pending/b2-matiz-speak-1",
                        "modelAnswer": "Cabría añadir que existen otras alternativas viables."
                    },
                    "explanationAr": "لاحظ نطق Cabríaañadir بالوصل الصوتي الخفيف بين الكلمتين، وإبراز نبرة añadir على المقطع الأخير (-ir).",
                    "skills": ["speaking", "pronunciation"],
                    "difficulty": 2,
                    "targetVocab": ["punto", "verdad"],
                    "scoring": {
                        "mode": "rubric",
                        "rubric": [
                            {"labelAr": "نطق Cabría بصيغة الشرط الصحيحة", "weight": 50, "code": "pron_cabria"},
                            {"labelAr": "نبر الفعل añadir على المقطع الأخير", "weight": 50, "code": "stress_anadir"}
                        ]
                    }
                }
            ],
            "review": {
                "status": "draft",
                "authors": ["فريق المنهج - اشتقاق تطبيقي من سلاسل كتب Aula Plus 4 وEn Vocabulario B2"],
                "spanishReviewer": None,
                "translationReviewer": None,
                "reviewedAt": None,
                "notes": "الدرس يقدم أساليب التحفظ والتعديل الدبلوماسي في النقاش المتقدم لمستوى B2."
            }
        }
    },

    # -------------------------------------------------------------
    # 4. b2-contraargumentacion
    # -------------------------------------------------------------
    {
        "dir": "content/drafts/b2",
        "file": "lesson-b2-contraargumentacion.json",
        "lesson": {
            "slug": "b2-contraargumentacion",
            "titleAr": "المحاجة المضادة ودحض الحجج: Contraargumentación",
            "level": "B2",
            "programSlug": "main-track",
            "unitSlug": "b2-u1-argument",
            "objectiveAr": "أن يتقن المتعلم تقنية الدحض البلاغي والمحاجة المضادة باستخدام أسلوب التسليم الجزئي (Si bien es cierto que... no obstante / sino) لتفنيد حجج الطرف الآخر بأناقة واقتدار.",
            "estimatedMinutes": 11,
            "skills": ["grammar", "reading", "writing", "listening", "vocabulary"],
            "newVocabulary": ["contra", "argumento", "admitir", "refutar", "discutir", "postura"],
            "reviewVocabulary": ["trabajo", "tiempo", "sociedad", "bien"],
            "targetStructures": [
                "Estructura concesiva de refutación: Si bien es cierto que... + Indicativo",
                "Conector adversativo correctivo: no... sino que...",
                "Fórmula de debate: Admito que X, pero conviene señalar que Y"
            ],
            "grammarTopics": ["contraargumentacion-b2", "refutacion-y-debate"],
            "scenarios": [
                {
                    "contextAr": "جلسة في المجلس البلدي لمناقشة ميزانية تجديد المرافق الرياضية والثقافية في المدينة.",
                    "settingAr": "قاعة المجلس البلدي، إشبيلية",
                    "lines": [
                        {
                            "es": "Muchos vecinos afirman que renovar el polideportivo es un gasto prescindible.",
                            "ar": "يزعم العديد من السكان أن تجديد المجمع الرياضي نفقة يمكن الاستغناء عنها.",
                            "arEg": "ناس كتير شايفة إن تجديد النادي مصاريف ممكن نستغنى عنها.",
                            "audioKey": "pending/b2-contra-pleno-1"
                        },
                        {
                            "es": "Si bien es cierto que la inversión es alta, los beneficios para la salud pública son incalculables.",
                            "ar": "وإن كان صحيحاً أن الاستثمار ضخم، إلا أن فوائده على الصحة العامة لا تقدر بثمن.",
                            "arEg": "لئن كان صح إن المبلغ كبير، بس فوايده على صحة الناس متتقدرش بتمن.",
                            "audioKey": "pending/b2-contra-pleno-2"
                        },
                        {
                            "es": "No estamos derrochando recursos, sino invirtiendo en el bienestar colectivo de los jóvenes.",
                            "ar": "نحن لا نبدد الموارد، بل نستثمر في الرفاه الجماعي للشباب.",
                            "arEg": "احنا مش بنضيع فلوس، بل بنستثمر في صحة ومستقبل الشباب.",
                            "audioKey": "pending/b2-contra-pleno-3"
                        },
                        {
                            "es": "Esa justificación desmonta las críticas y fundamenta sólidamente la partida presupuestaria.",
                            "ar": "هذا التعليل يفكك الانتقادات ويؤسس بقوة للبند المالي في الميزانية.",
                            "arEg": "التبرير ده بيفحم كل الانتقادات وبيثبت صحة قرار الميزانية.",
                            "audioKey": "pending/b2-contra-pleno-4"
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
            "exercises": [
                {
                    "id": "b2_contra_1_listen",
                    "type": "listen_choose",
                    "instructionAr": "استمع إلى حجة المتحدث ولاحظ كيف رد على حجة التكلفة المرتفعة.",
                    "audioKey": "pending/b2-contra-pleno-2",
                    "speechEs": "Si bien es cierto que la inversión es alta, los beneficios para la salud pública son incalculables.",
                    "options": [
                        {"id": "b2_contra_1_a", "text": "Los beneficios a largo plazo superan con creces el coste inicial", "isCorrect": True, "textAr": "الفوائد على المدى الطويل تفوق التكلفة الأولية بكثير"},
                        {"id": "b2_contra_1_b", "text": "La inversión arruinará las finanzas del municipio", "isCorrect": False, "textAr": "الاستثمار سيدمر مالية البلدية", "distractorRationaleAr": "مناقض تماماً للموقف المدافع عن المشروع."},
                        {"id": "b2_contra_1_c", "text": "No se debe gastar nada de dinero en los jóvenes", "isCorrect": False, "textAr": "لا يجوز إنفاق أي مال على الشباب", "distractorRationaleAr": "لم يقل ذلك بل أكد على استثمار المستقبل."}
                    ],
                    "answerKey": {"correctOptionIds": ["b2_contra_1_a"]},
                    "explanationAr": "استخدم المتحدث استراتيجية «Si bien es cierto que...» للتسليم بجزء من الحجة (أن التكلفة عالية) ثم دحضها بالحجة الأقوى (الفوائد التي لا تقدر بثمن).",
                    "errorFeedback": {
                        "b2_contra_1_b": "لم يقل أن الاستثمار سيدمر البلدية.",
                        "b2_contra_1_c": "لم يقل أنه لا يجب الإنفاق."
                    },
                    "skills": ["listening"],
                    "difficulty": 1,
                    "targetVocab": ["argumento", "obstante"],
                    "scoring": {"mode": "all_or_nothing"}
                },
                {
                    "id": "b2_contra_2_structure",
                    "type": "word_choice",
                    "instructionAr": "ما هو الدور الوظيفي للتركيب البلاغي «Si bien es cierto que...» في بداية المحاجة؟",
                    "options": [
                        {"id": "b2_contra_2_a", "text": "Conceder una verdad parcial para rebatirla inmediatamente", "isCorrect": True, "textAr": "التسليم بجزء من الحقيقة للتمهيد لدحضها فوراً بالحجة الأقوى"},
                        {"id": "b2_contra_2_b", "text": "Negar de forma categórica la postura del interlocutor", "isCorrect": False, "textAr": "الإنكار القاطع المطلق لموقف المحاور", "distractorRationaleAr": "التركيب يعترف بالواقع جزئياً أولاً ولا ينكر كلياً."},
                        {"id": "b2_contra_2_c", "text": "Finalizar el debate y abandonar la conversación", "isCorrect": False, "textAr": "إنهاء المناظرة والانسحاب من الحوار", "distractorRationaleAr": "التركيب هو مناورة بلاغية لمواصلة الإقناع وليس للانسحاب."}
                    ],
                    "answerKey": {"correctOptionIds": ["b2_contra_2_a"]},
                    "explanationAr": "التعبير البلاغي «Si bien es cierto que...» (وإن كان صحيحاً أن...) يُعرف بـ Concesión retórica، حيث يسلم المتحدث بصدق ملاحظة الخصم ليزيل تعصبه ثم يطرح الحجة الحاسمة.",
                    "errorFeedback": {
                        "b2_contra_2_b": "التركيب لا ينكر كلياً بل يسلم جزئياً.",
                        "b2_contra_2_c": "ليس انسحاباً بل حجة إقناعية قوية."
                    },
                    "skills": ["reading"],
                    "difficulty": 1,
                    "targetVocab": ["argumento"],
                    "scoring": {"mode": "all_or_nothing"}
                },
                {
                    "id": "b2_contra_3_fill_sibien",
                    "type": "fill_blank",
                    "instructionAr": "أكمل أداة التسليم التنازلية: «وإنْ كان صحيحاً أنه صعب، فالنجاح مضمون».",
                    "stemEs": "Si ____ es cierto que el reto es difícil, el éxito final está garantizado.",
                    "stemAr": "وإنْ كان صحيحاً أن التحدي صعب، فإن النجاح النهائي مضمون.",
                    "answerKey": {
                        "accepted": ["bien"],
                        "caseSensitive": False
                    },
                    "explanationAr": "التركيب الثابت للتسليم هو «Si bien es cierto que» ويتبعه الفعل في صيغة الواقع (Indicativo).",
                    "errorFeedback": {
                        "mucho": "التركيب القياسي هو Si bien وليس Si mucho.",
                        "todo": "Si todo لا تؤدي المعنى التنازلي المطلوب."
                    },
                    "skills": ["writing", "grammar"],
                    "difficulty": 2,
                    "targetVocab": ["verdad"],
                    "scoring": {"mode": "all_or_nothing"}
                },
                {
                    "id": "b2_contra_4_fill_contrast",
                    "type": "fill_blank",
                    "instructionAr": "أكمل أداة الاستدراك التصحيحي بعد النفي: «لم نرفض المقترح تعنتاً، بل لنقص الميزانية».",
                    "stemEs": "No rechazamos la propuesta por capricho, ____ por falta de presupuesto.",
                    "stemAr": "نحن لم نرفض المقترح نزوة، بل بسبب انعدام الميزانية.",
                    "answerKey": {
                        "accepted": ["sino"],
                        "caseSensitive": False
                    },
                    "explanationAr": "بعد جملة منفية لتصحيح وتعيين السبب الحقيقي نستخدم أداة «sino» (بل)، وهي تطابق حرف العطف «بل» في العربية بعد النفي.",
                    "errorFeedback": {
                        "pero": "pero تفيد الاستدراك العادي ولا تصح لتصحيح النفي الحصري كما تفعل sino.",
                        "aunque": "aunque تفيد رغم أن وتتطلب جملة تابعة."
                    },
                    "skills": ["writing", "grammar"],
                    "difficulty": 2,
                    "targetVocab": ["argumento"],
                    "scoring": {"mode": "all_or_nothing"}
                },
                {
                    "id": "b2_contra_5_contrast_choice",
                    "type": "word_choice",
                    "instructionAr": "متى نستخدم «sino» بدلاً من «pero» في سياق الرد على حجة؟",
                    "options": [
                        {"id": "b2_contra_5_a", "text": "Tras una negación para sustituir o corregir un elemento", "isCorrect": True, "textAr": "بعد جملة منفية لإبدال أو تصحيح العنصر المنفي بالبديل الحقيقي"},
                        {"id": "b2_contra_5_b", "text": "En oraciones totalmente afirmativas sin negación previa", "isCorrect": False, "textAr": "في الجمل المثبتة دون أي نفي سابق", "distractorRationaleAr": "sino تشترط وجود نفي سابق (no... sino...)."},
                        {"id": "b2_contra_5_c", "text": "Al formular preguntas directas o indirectas de duda", "isCorrect": False, "textAr": "عند طرح أسئلة مباشرة أو غير مباشرة", "distractorRationaleAr": "sino أداة عطف وتصحيح وليست أداة استفهام."}
                    ],
                    "answerKey": {"correctOptionIds": ["b2_contra_5_a"]},
                    "explanationAr": "القاعدة الأساسية: No A, sino B. نستخدم sino بعد النفي لتثبيت البديل الصحيح، مثل: No es un gasto, sino una inversión.",
                    "errorFeedback": {
                        "b2_contra_5_b": "sino تتطلب نفياً سابقاً دائماً.",
                        "b2_contra_5_c": "sino ليست أداة استفهام."
                    },
                    "skills": ["grammar"],
                    "difficulty": 1,
                    "targetVocab": ["admitir"],
                    "scoring": {"mode": "all_or_nothing"}
                },
                {
                    "id": "b2_contra_6_speak",
                    "type": "speak_with_text",
                    "instructionAr": "انطق عبارة التصحيح الحجاجية التالية بنبرة جازمة وحازمة.",
                    "stemEs": "No es una pérdida de tiempo, sino una inversión de futuro.",
                    "stemAr": "إنه ليس مضيعة للوقت، بل استثمار للمستقبل.",
                    "answerKey": {
                        "referenceAudioKey": "pending/b2-contra-speak-1",
                        "modelAnswer": "No es una pérdida de tiempo, sino una inversión de futuro."
                    },
                    "explanationAr": "لاحظ الوقف الخفيف قبل sino، والنطق الحاسم لكلمة inversión مع إبراز النبرة على المقطع الأخير (-sión).",
                    "skills": ["speaking", "pronunciation"],
                    "difficulty": 2,
                    "targetVocab": ["obstante"],
                    "scoring": {
                        "mode": "rubric",
                        "rubric": [
                            {"labelAr": "نطق عبارة sino una inversión بوضوح", "weight": 50, "code": "pron_sino_inversion"},
                            {"labelAr": "نبرة التناقض الصوتي الحازم بين النفي والإثبات", "weight": 50, "code": "stress_contrast"}
                        ]
                    }
                }
            ],
            "review": {
                "status": "draft",
                "authors": ["فريق المنهج - اشتقاق تطبيقي من سلاسل كتب Aula Plus 4 وEn Vocabulario B2"],
                "spanishReviewer": None,
                "translationReviewer": None,
                "reviewedAt": None,
                "notes": "الدرس يركز على استراتيجيات الدحض والمحاجة المضادة الرفيعة في مستوى B2."
            }
        }
    }
]
