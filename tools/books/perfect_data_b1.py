# -*- coding: utf-8 -*-
"""
tools/books/perfect_data_b1.py
"""

B1_LESSONS = [
    # 1. b1-expresar-opinion-creo-que
    {
        "dir": "content/drafts/b1",
        "file": "lesson-b1-expresar-opinion-creo-que.json",
        "lesson": {
            "slug": "b1-expresar-opinion-creo-que",
            "titleAr": "إبداء الرأي والشك: Creo que مقابل No creo que",
            "level": "B1",
            "programSlug": "main-track",
            "unitSlug": "b1-u2-opinions",
            "objectiveAr": "أن يتقن المتعلم التعبير عن الرأي واليقين باستخدام صيغة الإثبات (Creo que + Indicativo) والتعبير عن الشك والإنكار بصيغة النفي (No creo que + Subjuntivo) بدقة لغوية عالية.",
            "estimatedMinutes": 11,
            "skills": ["grammar", "reading", "writing", "listening", "vocabulary"],
            "newVocabulary": ["creer", "pensar", "opinar", "verdad", "duda", "posible"],
            "reviewVocabulary": ["amigo", "trabajo", "tiempo", "bien"],
            "targetStructures": [
                "Afirmación (Certeza): Creo que / Pienso que + INDICATIVO",
                "Negación (Duda): No creo que / No pienso que + SUBJUNTIVO",
                "Pregunta: ¿Crees que es verdad?"
            ],
            "grammarTopics": ["subjuntivo-opinion-negativa", "creo-que-indicativo"],
            "scenarios": [
                {
                    "contextAr": "نقاش بين مدير ونائبه حول خطة تسويقية جديدة ومشروع توسع للشركة في مصر.",
                    "settingAr": "غرفة اجتماعات، مدريد",
                    "lines": [
                        {
                            "es": "Creo que el mercado tiene un potencial enorme para nuestra empresa.",
                            "ar": "أعتقد أن السوق يمتلك إمكانات هائلة لشركتنا.",
                            "arEg": "شايف إن السوق فيه فرص كبيرة جداً لشركتنا.",
                            "audioKey": "pending/b1-op-reunion-1"
                        },
                        {
                            "es": "Estoy de acuerdo, pero no creo que este sea el mejor momento.",
                            "ar": "أنا متفق معك، لكني لا أعتقد أن هذا هو الوقت الأنسب للبدء.",
                            "arEg": "أنا متفق معاك، بس مش شايف إن ده أحسن وقت نبدأ فيه.",
                            "audioKey": "pending/b1-op-reunion-2"
                        },
                        {
                            "es": "¿Por qué no? Pienso que la demanda es muy alta ahora mismo.",
                            "ar": "ولماذا لا؟ أعتقد أن الطلب مرتفع للغاية في الوقت الراهن.",
                            "arEg": "ليه لأ؟ أنا شايف الطلب عالي أوي دلوقتي.",
                            "audioKey": "pending/b1-op-reunion-3"
                        },
                        {
                            "es": "Sí, pero no pienso que tengamos suficientes recursos este mes.",
                            "ar": "نعم، لكني لا أظن أن لدينا موارد كافية هذا الشهر.",
                            "arEg": "تمام، بس مش فاكر إن عندنا سيولة كافية الشهر ده.",
                            "audioKey": "pending/b1-op-reunion-4"
                        }
                    ]
                }
            ],
            "mastery": {
                "minAccuracy": 70,
                "minCorrectExercises": 5,
                "requiredExerciseTypes": ["listen_choose", "word_choice", "fill_blank"]
            },
            "unlock": {"type": "sequential"},
            "offlinePriority": 1,
            "exercises": [
                {
                    "id": "b1_op_1_listen",
                    "type": "listen_choose",
                    "instructionAr": "استمع إلى النائب واختر سبب تحفظه على بدء المشروع الآن.",
                    "audioKey": "pending/b1-op-reunion-4",
                    "speechEs": "Sí, pero no pienso que tengamos suficientes recursos este mes.",
                    "options": [
                        {"id": "b1_op_1_a", "text": "Falta de recursos suficientes este mes", "isCorrect": True, "textAr": "نقص الموارد الكافية هذا الشهر"},
                        {"id": "b1_op_1_b", "text": "Mercado sin potencial alguno", "isCorrect": False, "textAr": "سوق بلا إمكانات", "distractorRationaleAr": "هو اتفق على أن السوق واعد."},
                        {"id": "b1_op_1_c", "text": "Problemas de personal", "isCorrect": False, "textAr": "مشاكل في الموظفين", "distractorRationaleAr": "لم يتطرق إلى الموظفين."}
                    ],
                    "answerKey": {"correctOptionIds": ["b1_op_1_a"]},
                    "explanationAr": "قال النائب بوضوح: «no pienso que tengamos suficientes recursos este mes».",
                    "errorFeedback": {
                        "b1_op_1_b": "هو متفق أن السوق ممتاز.",
                        "b1_op_1_c": "لم يذكر مشاكل الموظفين."
                    },
                    "skills": ["listening"],
                    "difficulty": 1,
                    "targetVocab": ["pensar"],
                    "scoring": {"mode": "all_or_nothing"}
                },
                {
                    "id": "b1_op_2_subj_trigger",
                    "type": "word_choice",
                    "instructionAr": "متى نستخدم زمن المنصوب بعد أفعال الرأي والتفكير في الإسبانية؟",
                    "options": [
                        {"id": "b1_op_2_a", "text": "Con la negación (No creo que / No pienso que)", "isCorrect": True, "textAr": "مع النفي"},
                        {"id": "b1_op_2_b", "text": "En la afirmación (Creo que)", "isCorrect": False, "textAr": "في الإثبات", "distractorRationaleAr": "في الإثبات نستخدم Indicativo حصراً."},
                        {"id": "b1_op_2_c", "text": "En las preguntas directas", "isCorrect": False, "textAr": "في السؤال المباشر", "distractorRationaleAr": "السؤال العادي يأخذ Indicativo."}
                    ],
                    "answerKey": {"correctOptionIds": ["b1_op_2_a"]},
                    "explanationAr": "في الإثبات (اليقين) = Indicativo: Creo que es verdad، وفي النفي (الشك) = Subjuntivo: No creo que sea verdad.",
                    "errorFeedback": {
                        "b1_op_2_b": "الإثبات يأخذ indicativo دائمًا.",
                        "b1_op_2_c": "السؤال لا يشترط المنصوب."
                    },
                    "skills": ["grammar"],
                    "difficulty": 1,
                    "targetVocab": ["creer"],
                    "scoring": {"mode": "all_or_nothing"}
                },
                {
                    "id": "b1_op_3_fill_affirmative",
                    "type": "fill_blank",
                    "instructionAr": "أكمل الفراغ بالصيغة الصحيحة من فعل ser في الإثبات: «أعتقد أنه رجل طيب».",
                    "stemEs": "Creo que él ____ una persona muy honesta.",
                    "stemAr": "أعتقد أنه شخص نزيه جدًا.",
                    "answerKey": {
                        "accepted": ["es"],
                        "caseSensitive": False
                    },
                    "explanationAr": "مع صيغة الإثبات (Creo que) نستخدم صيغة الواقع واليقين (Indicativo)، لذا نختار es.",
                    "errorFeedback": {
                        "sea": "sea منصوب ولا تأتي إلا مع النفي No creo que.",
                        "era": "era في الماضي والموقف حاضر."
                    },
                    "skills": ["grammar", "writing"],
                    "difficulty": 2,
                    "targetVocab": ["creer"],
                    "scoring": {"mode": "all_or_nothing"}
                },
                {
                    "id": "b1_op_4_fill_negative",
                    "type": "fill_blank",
                    "instructionAr": "أكمل الفراغ بالصيغة الصحيحة مع النفي: «لا أعتقد أن الحل سهلاً».",
                    "stemEs": "No creo que la solución ____ tan fácil.",
                    "stemAr": "لا أعتقد أن الحل سهلاً إلى هذا الحد.",
                    "answerKey": {
                        "accepted": ["sea"],
                        "caseSensitive": False
                    },
                    "explanationAr": "النفي مع أفعال الرأي (No creo que) يعبر عن الشك وعدم الإقرار، مما يستدعي زمن المنصوب (Presente de Subjuntivo): sea.",
                    "errorFeedback": {
                        "es": "es خطأ بعد No creo que.",
                        "será": "será مستقبل غير مسموح به هنا."
                    },
                    "skills": ["grammar", "writing"],
                    "difficulty": 2,
                    "targetVocab": ["creer"],
                    "scoring": {"mode": "all_or_nothing"}
                },
                {
                    "id": "b1_op_5_contrast_quiz",
                    "type": "word_choice",
                    "instructionAr": "أي الجملتين الآتيتين صحيحة نحويًا وفق قواعد اللغة الإسبانية؟",
                    "options": [
                        {"id": "b1_op_5_a", "text": "No pienso que ellos tengan razón.", "isCorrect": True, "textAr": "لا أظن أن معهم حق (منصوب)"},
                        {"id": "b1_op_5_b", "text": "No pienso que ellos tienen razón.", "isCorrect": False, "textAr": "خطأ باستخدام tienen مع النفي", "distractorRationaleAr": "استخدام tienen (indicativo) بعد No pienso que خطأ تركيبي شائع."}
                    ],
                    "answerKey": {"correctOptionIds": ["b1_op_5_a"]},
                    "explanationAr": "الجملة الصحيحة هي «No pienso que ellos tengan razón» لأن No pienso que تحتم المنصوب (tengan).",
                    "errorFeedback": {
                        "b1_op_5_b": "tienen صيغة indicativo ولا تجوز بعد No pienso que."
                    },
                    "skills": ["reading", "grammar"],
                    "difficulty": 2,
                    "targetVocab": ["pensar"],
                    "scoring": {"mode": "all_or_nothing"}
                },
                {
                    "id": "b1_op_6_speak",
                    "type": "speak_with_text",
                    "instructionAr": "انطق الجملة بصوت تفاوضي واضح.",
                    "stemEs": "No creo que tengamos tiempo hoy.",
                    "stemAr": "لا أعتقد أن لدينا وقتًا اليوم.",
                    "answerKey": {
                        "referenceAudioKey": "pending/b1-op-speak-1",
                        "modelAnswer": "No creo que tengamos tiempo hoy."
                    },
                    "explanationAr": "ركز على نطق g في tengamos بصوت الغين الخفيفة، ونطق hoy دون نطق حرف h الصامت.",
                    "skills": ["speaking", "pronunciation"],
                    "difficulty": 2,
                    "targetVocab": ["creer"],
                    "scoring": {
                        "mode": "rubric",
                        "rubric": [
                            {"labelAr": "إسقاط h الصامت في hoy", "weight": 50, "code": "silent_h"},
                            {"labelAr": "نطق tengamos بسلاسة", "weight": 50, "code": "fluency_tengamos"}
                        ]
                    }
                }
            ],
            "review": {
                "status": "draft",
                "authors": ["فريق المنهج — استخراج تربوي من مراجع Aula Plus 3 وEn Vocabulario B1"],
                "spanishReviewer": None,
                "translationReviewer": None,
                "reviewedAt": None,
                "notes": "الدرس يقدم التباين الجوهري بين Indicativo في الإثبات و Subjuntivo في النفي مع تطبيقات تفاوضية واقعية."
            }
        }
    },

    # 2. b1-subjuntivo-deseos
    {
        "dir": "content/drafts/b1",
        "file": "lesson-b1-subjuntivo-deseos.json",
        "lesson": {
            "slug": "b1-subjuntivo-deseos",
            "titleAr": "المضارع المنصوب: التعبير عن الرغبات والأمنيات",
            "level": "B1",
            "programSlug": "main-track",
            "unitSlug": "b1-u2-opinions",
            "objectiveAr": "أن يصيغ المتعلم صيغة المضارع المنصوب لأفعال المجموعات الثلاث والشواذ، ويستخدمه في التعبير عن الرغبات والأمنيات مع التراكيب: Quiero que, Ojalá, Espero que.",
            "estimatedMinutes": 12,
            "skills": ["grammar", "reading", "writing", "listening", "vocabulary"],
            "newVocabulary": ["ojalá", "querer", "esperar", "desear", "venir", "aprobar"],
            "reviewVocabulary": ["amigo", "examen", "tiempo", "bien"],
            "targetStructures": [
                "Regla de vocales opuestas: -ar toma -e (hable), -er/-ir toma -a (coma, viva)",
                "Irregulares clave: sea, esté, vaya, tenga, haga, pueda, sepa",
                "Verbo de deseo + que + sujeto distinto + Subjuntivo: Quiero que vengas",
                "Ojalá + Subjuntivo: ¡Ojalá apruebes el examen!"
            ],
            "grammarTopics": ["subjuntivo-deseos-ojala", "formacion-presente-subjuntivo"],
            "scenarios": [
                {
                    "contextAr": "أم تتحدث مع ابنها قبل خوضه لامتحان القبول الجامعي في إسبانيا.",
                    "settingAr": "المنزل، صباح يوم الامتحان",
                    "lines": [
                        {
                            "es": "¡Hijo! Quiero que estés tranquilo y que descanses bien.",
                            "ar": "بني! أريدك أن تكون هادئًا وأن ترتاح جيدًا.",
                            "arEg": "يا ابني! عايزاك تكون هادي وترتاح كويس.",
                            "audioKey": "pending/b1-deseos-madre-1"
                        },
                        {
                            "es": "Gracias, mamá. He estudiado mucho, pero estoy un poco nervioso.",
                            "ar": "شكرًا يا أمي. لقد ذاكرتُ كثيرًا، لكني متوتر قليلاً.",
                            "arEg": "شكراً يا ماما. ذاكرت كتير، بس متوتر شوية.",
                            "audioKey": "pending/b1-deseos-madre-2"
                        },
                        {
                            "es": "Es normal. ¡Ojalá tengas mucha suerte y apruebes con buena nota!",
                            "ar": "هذا طبيعي. أتمنى أن يحالفك حظ وافر وتنجح بدرجة ممتازة!",
                            "arEg": "طبيعي يا حبيبي. يا رب بالتوفيق وتعدي بتقدير حلو!",
                            "audioKey": "pending/b1-deseos-madre-3"
                        },
                        {
                            "es": "Espero que el examen sea fácil. ¡Hasta luego!",
                            "ar": "آمل أن يكون الامتحان سهلاً. إلى اللقاء!",
                            "arEg": "أتمنى الامتحان ييجي سهل. يلا مع السلامة!",
                            "audioKey": "pending/b1-deseos-madre-4"
                        }
                    ]
                }
            ],
            "mastery": {
                "minAccuracy": 70,
                "minCorrectExercises": 5,
                "requiredExerciseTypes": ["listen_choose", "word_choice", "fill_blank"]
            },
            "unlock": {"type": "sequential"},
            "offlinePriority": 1,
            "exercises": [
                {
                    "id": "b1_deseos_1_listen",
                    "type": "listen_choose",
                    "instructionAr": "استمع إلى دعاء الأم لابنها واختر ما تتمناه له.",
                    "audioKey": "pending/b1-deseos-madre-3",
                    "speechEs": "Es normal. ¡Ojalá tengas mucha suerte y apruebes con buena nota!",
                    "options": [
                        {"id": "b1_deseos_1_a", "text": "Aprobar con buena nota y tener suerte", "isCorrect": True, "textAr": "النجاح والتوفيق"},
                        {"id": "b1_deseos_1_b", "text": "Aplazar el examen para mañana", "isCorrect": False, "textAr": "تأجيل الامتحان", "distractorRationaleAr": "لم تطلب تأجيل الامتحان."},
                        {"id": "b1_deseos_1_c", "text": "Volver a dormir inmediatamente", "isCorrect": False, "textAr": "العودة للنوم", "distractorRationaleAr": "هذا وقت الذهاب للامتحان."}
                    ],
                    "answerKey": {"correctOptionIds": ["b1_deseos_1_a"]},
                    "explanationAr": "قالت الأم: «¡Ojalá tengas mucha suerte y apruebes con buena nota!» مستخدمة المنصوب بعد Ojalá.",
                    "errorFeedback": {
                        "b1_deseos_1_b": "لم تذكر التأجيل.",
                        "b1_deseos_1_c": "هو ذاهب للامتحان."
                    },
                    "skills": ["listening"],
                    "difficulty": 1,
                    "targetVocab": ["ojalá", "aprobar"],
                    "scoring": {"mode": "all_or_nothing"}
                },
                {
                    "id": "b1_deseos_2_rule",
                    "type": "word_choice",
                    "instructionAr": "ما هي القاعدة الذهبية لتصريف الأفعال المنتظمة في المضارع المنصوب؟",
                    "options": [
                        {"id": "b1_deseos_2_a", "text": "Inversión vocálica (-ar toma -e, y -er/-ir toma -a)", "isCorrect": True, "textAr": "قاعدة العكس"},
                        {"id": "b1_deseos_2_b", "text": "Añadir la letra s al final siempre", "isCorrect": False, "textAr": "إضافة حرف s", "distractorRationaleAr": "إضافة s تخص ضمير tú فقط."},
                        {"id": "b1_deseos_2_c", "text": "Usar el pretérito indefinido", "isCorrect": False, "textAr": "استخدام الماضي البسيط", "distractorRationaleAr": "الماضي زمن آخر مختلف تمامًا."}
                    ],
                    "answerKey": {"correctOptionIds": ["b1_deseos_2_a"]},
                    "explanationAr": "أفعال -ar تأخذ النهايات -e, -es, -e... وأفعال -er/-ir تأخذ -a, -as, -a... (قاعدة الحروف المعكوسة).",
                    "errorFeedback": {
                        "b1_deseos_2_b": "حرف s ليس قاعدة شاملة.",
                        "b1_deseos_2_c": "الماضي البسيط زمن آخر."
                    },
                    "skills": ["grammar"],
                    "difficulty": 1,
                    "targetVocab": ["esperar"],
                    "scoring": {"mode": "all_or_nothing"}
                },
                {
                    "id": "b1_deseos_3_fill_venir",
                    "type": "fill_blank",
                    "instructionAr": "أكمل الفراغ بتصريف فعل venir مع tú في صيغة المنصوب: «أريدك أن تأتي معي».",
                    "stemEs": "Quiero que tú ____ conmigo a la fiesta.",
                    "stemAr": "أريدك أن تأتي معي إلى الحفلة.",
                    "answerKey": {
                        "accepted": ["vengas"],
                        "caseSensitive": False
                    },
                    "explanationAr": "فعل venir مشتق من جذر المتكلم (vengo)، وفي المنصوب يأخذ النهاية المعكوسة -as: vengas.",
                    "errorFeedback": {
                        "vienes": "vienes مرفوع indicativo، وبعد الرغبة يلزم المنصوب.",
                        "venir": "المصدر لا يصح لوجود فاعلين مختلفين (yo / tú)."
                    },
                    "skills": ["grammar", "writing"],
                    "difficulty": 2,
                    "targetVocab": ["querer", "venir"],
                    "scoring": {"mode": "all_or_nothing"}
                },
                {
                    "id": "b1_deseos_4_fill_ojala",
                    "type": "fill_blank",
                    "instructionAr": "أكمل الجملة بعد أداة التمني Ojalá بتصريف فعل tener مع tú.",
                    "stemEs": "¡Ojalá ____ mucha suerte en la entrevista!",
                    "stemAr": "أتمنى أن يحالفك حظ وافر في المقابلة!",
                    "answerKey": {
                        "accepted": ["tengas"],
                        "caseSensitive": False
                    },
                    "explanationAr": "كلمة «¡Ojalá!» من أصل عربي خالص وتأخذ دائماً بعدها زمن المنصوب Subjuntivo: ¡Ojalá tengas suerte!",
                    "errorFeedback": {
                        "tienes": "tienes مرفوع indicativo، وأداة Ojalá تفرض المنصوب.",
                        "tendrás": "tendrás مستقبل غير جائز بعد Ojalá."
                    },
                    "skills": ["grammar", "writing"],
                    "difficulty": 2,
                    "targetVocab": ["ojalá"],
                    "scoring": {"mode": "all_or_nothing"}
                },
                {
                    "id": "b1_deseos_5_esperar",
                    "type": "fill_blank",
                    "instructionAr": "أكمل الفراغ بتصريف فعل estar مع él في المنصوب: «آمل أن يكون بخير».",
                    "stemEs": "Espero que mi hermano ____ bien.",
                    "stemAr": "آمل أن يكون أخي بخير.",
                    "answerKey": {
                        "accepted": ["esté"],
                        "caseSensitive": False
                    },
                    "explanationAr": "فعل estar في المنصوب شاذ ويحمل علامة النبرة: esté (Espero que esté bien).",
                    "errorFeedback": {
                        "está": "está مرفوع ويجب نصبه بعد Espero que.",
                        "sea": "sea من ser ولا تأتي مع الحال bien."
                    },
                    "skills": ["grammar", "writing"],
                    "difficulty": 2,
                    "targetVocab": ["esperar"],
                    "scoring": {"mode": "all_or_nothing"}
                },
                {
                    "id": "b1_deseos_6_speak",
                    "type": "speak_with_text",
                    "instructionAr": "انطق عبارة التمني الإسبانية الشهيرة ذات الأصل العربي بنبرة رجاء حارة.",
                    "stemEs": "¡Ojalá tengas mucha suerte!",
                    "stemAr": "أتمنى لك حظًا وافرًا من كل قلبي!",
                    "answerKey": {
                        "referenceAudioKey": "pending/b1-deseos-speak-1",
                        "modelAnswer": "¡Ojalá tengas mucha suerte!"
                    },
                    "explanationAr": "انطق حرف j في Ojalá بصوت الخاء ونبر على المقطع الأخير -lá لوجود علامة النبرة.",
                    "skills": ["speaking", "pronunciation"],
                    "difficulty": 2,
                    "targetVocab": ["ojalá"],
                    "scoring": {
                        "mode": "rubric",
                        "rubric": [
                            {"labelAr": "النبر على مقطع lá في Ojalá", "weight": 50, "code": "stress_ojala"},
                            {"labelAr": "نطق حرف j كخاء صريحة", "weight": 50, "code": "pron_j_ojala"}
                        ]
                    }
                }
            ],
            "review": {
                "status": "draft",
                "authors": ["فريق المنهج — استخراج تربوي من مراجع Aula Plus 3 وEn Vocabulario B1"],
                "spanishReviewer": None,
                "translationReviewer": None,
                "reviewedAt": None,
                "notes": "الدرس يربط أداة Ojalá بأصلها العربي (لو شاء الله) ويشرح قاعدة العكس في تصريف المنصوب."
            }
        }
    },

    # 3. b1-por-vs-para
    {
        "dir": "content/drafts/b1",
        "file": "lesson-b1-por-vs-para.json",
        "lesson": {
            "slug": "b1-por-vs-para",
            "titleAr": "التمييز القاطع بين Por و Para للمتعلم العربي",
            "level": "B1",
            "programSlug": "main-track",
            "unitSlug": "b1-u2-opinions",
            "objectiveAr": "أن يفرّق المتعلم بدقة تامة بين حرفي الجر Por و Para في جميع سياقات الاستخدام (السبب والدافع مقابل الهدف والغاية، والمدة مقابل الموعد النهائي، والواسطة مقابل المستقبل).",
            "estimatedMinutes": 12,
            "skills": ["grammar", "reading", "writing", "listening", "vocabulary"],
            "newVocabulary": ["por", "para", "estudiar", "trabajar", "viajar", "tiempo"],
            "reviewVocabulary": ["gracias", "mañana", "amigo", "Madrid"],
            "targetStructures": [
                "PARA: Finalidad (para estudiar), Destinatario (para ti), Fecha límite (para el lunes)",
                "POR: Causa/Motivo (por la lluvia), Medio (por teléfono), Agradecimiento (gracias por...)"
            ],
            "grammarTopics": ["por-vs-para-contraste", "preposiciones-causa-finalidad"],
            "scenarios": [
                {
                    "contextAr": "محادثة بين طالب يوضح لزميله أسباب سفره إلى إسبانيا وتحضيراته للمشروع الدراسي.",
                    "settingAr": "مكتبة المعهد، إسبانيا",
                    "lines": [
                        {
                            "es": "¿Por qué decidiste venir a España?",
                            "ar": "لماذا قررت القدوم إلى إسبانيا؟",
                            "arEg": "ليه قررت تيجي إسبانيا؟",
                            "audioKey": "pending/b1-porpara-karim-1"
                        },
                        {
                            "es": "Vine a Madrid para estudiar un máster y mejorar mi español.",
                            "ar": "جئتُ إلى مدريد لأجل دراسة الماجستير وتحسين لغتي الإسبانية.",
                            "arEg": "جيت مدريد عشان أعمل ماجستير وأحسّن الإسباني بتاعي.",
                            "audioKey": "pending/b1-porpara-karim-2"
                        },
                        {
                            "es": "¿Y tienes que entregar el trabajo final pronto?",
                            "ar": "وهل عليك تسليم مشروع التخرج قريبًا؟",
                            "arEg": "ولازم تسلّم المشروع قريب؟",
                            "audioKey": "pending/b1-porpara-karim-3"
                        },
                        {
                            "es": "Sí, el informe es para el viernes, así que gracias por tu ayuda.",
                            "ar": "نعم، التقرير مطلوب بحلول يوم الجمعة، لذا شكرًا لك على مساعدتك.",
                            "arEg": "أيوة، التقرير ميعاده الجمعة، فشكراً على مساعدتك.",
                            "audioKey": "pending/b1-porpara-karim-4"
                        }
                    ]
                }
            ],
            "mastery": {
                "minAccuracy": 70,
                "minCorrectExercises": 5,
                "requiredExerciseTypes": ["listen_choose", "word_choice", "fill_blank"]
            },
            "unlock": {"type": "sequential"},
            "offlinePriority": 1,
            "exercises": [
                {
                    "id": "b1_porpara_1_listen",
                    "type": "listen_choose",
                    "instructionAr": "استمع إلى كريم واختر الغاية من قدومه إلى مدريد.",
                    "audioKey": "pending/b1-porpara-karim-2",
                    "speechEs": "Vine a Madrid para estudiar un máster y mejorar mi español.",
                    "options": [
                        {"id": "b1_porpara_1_a", "text": "Estudiar un máster y mejorar el español", "isCorrect": True, "textAr": "دراسة الماجستير وتحسين اللغة"},
                        {"id": "b1_porpara_1_b", "text": "Pasar las vacaciones de verano", "isCorrect": False, "textAr": "قضاء عطلة الصيف", "distractorRationaleAr": "لم يذكر السياحة الصيفية."},
                        {"id": "b1_porpara_1_c", "text": "Trabajar de camarero", "isCorrect": False, "textAr": "العمل نادلاً", "distractorRationaleAr": "لم يذكر ذلك."}
                    ],
                    "answerKey": {"correctOptionIds": ["b1_porpara_1_a"]},
                    "explanationAr": "استخدم كريم حرف الجر para لأن الحديث هنا عن الهدف والغاية المستقبلية (Finalidad): «para estudiar un máster».",
                    "errorFeedback": {
                        "b1_porpara_1_b": "جاء للدراسة وليس للسياحة.",
                        "b1_porpara_1_c": "الهدف هو الماجستير واللغة."
                    },
                    "skills": ["listening"],
                    "difficulty": 1,
                    "targetVocab": ["para", "estudiar"],
                    "scoring": {"mode": "all_or_nothing"}
                },
                {
                    "id": "b1_porpara_2_concept",
                    "type": "word_choice",
                    "instructionAr": "لماذا يقع المتحدث العربي في الخلط المتكرر بين Por و Para؟",
                    "options": [
                        {"id": "b1_porpara_2_a", "text": "Porque el árabe usa la misma partícula li- para causa y finalidad", "isCorrect": True, "textAr": "اشتراك اللام في العربية"},
                        {"id": "b1_porpara_2_b", "text": "Porque empiezan por la misma letra", "isCorrect": False, "textAr": "تشابه الحرف الأول", "distractorRationaleAr": "السبب لغوي دلالي وليس تشابه حروف."},
                        {"id": "b1_porpara_2_c", "text": "Porque significan exactamente lo mismo", "isCorrect": False, "textAr": "تطابق المعنى", "distractorRationaleAr": "لهما معنيان مختلفان تماماً."}
                    ],
                    "answerKey": {"correctOptionIds": ["b1_porpara_2_a"]},
                    "explanationAr": "في العربية نقول «لـ» للسبب ونقول «لـ» للهدف، بينما في الإسبانية: Por تنظر إلى الخلف (الدافع والسبب)، و Para تنظر إلى الأمام (الهدف والوجهة).",
                    "errorFeedback": {
                        "b1_porpara_2_b": "السبب أعمق من مجرد الحرف الأول.",
                        "b1_porpara_2_c": "معناهما مختلف جذرياً."
                    },
                    "skills": ["grammar"],
                    "difficulty": 1,
                    "targetVocab": ["por", "para"],
                    "scoring": {"mode": "all_or_nothing"}
                },
                {
                    "id": "b1_porpara_3_fill_cause",
                    "type": "fill_blank",
                    "instructionAr": "أكمل الفراغ بالسبب والدافع: «لم نخرج بسبب المطر الغزير».",
                    "stemEs": "No salimos de casa ____ la lluvia intensa.",
                    "stemAr": "لم نخرج من المنزل بسبب المطر الشديد.",
                    "answerKey": {
                        "accepted": ["por"],
                        "caseSensitive": False
                    },
                    "explanationAr": "المطر هو الدافع والعلة المسببة للقرار، لذا نستخدم por حصرًا: «por la lluvia».",
                    "errorFeedback": {
                        "para": "المطر ليس غاية نرجوها، بل سبب وقع مسبقًا.",
                        "de": "de تفيد الملكية أو الأصل."
                    },
                    "skills": ["grammar", "writing"],
                    "difficulty": 2,
                    "targetVocab": ["por"],
                    "scoring": {"mode": "all_or_nothing"}
                },
                {
                    "id": "b1_porpara_4_fill_deadline",
                    "type": "fill_blank",
                    "instructionAr": "أكمل الفراغ بالموعد النهائي والتسليم: «هذا الواجب مطلوب ليوم الإثنين».",
                    "stemEs": "Esta tarea es ____ el lunes.",
                    "stemAr": "هذا الواجب مطلوب بحلول يوم الإثنين.",
                    "answerKey": {
                        "accepted": ["para"],
                        "caseSensitive": False
                    },
                    "explanationAr": "عند الحديث عن الموعد النهائي (Fecha límite) نستخدم دائمًا حرف الجر para: «para el lunes».",
                    "errorFeedback": {
                        "por": "por لا تعبر عن موعد التسليم النهائي.",
                        "en": "en تعني في يوم كذا، لكن para تحدد الأجل والتسليم."
                    },
                    "skills": ["grammar", "writing"],
                    "difficulty": 2,
                    "targetVocab": ["para"],
                    "scoring": {"mode": "all_or_nothing"}
                },
                {
                    "id": "b1_porpara_5_gratitude",
                    "type": "fill_blank",
                    "instructionAr": "اختر حرف الجر الصحيح مع عبارات الشكر: «شكرًا لك على كل شيء».",
                    "stemEs": "Muchas gracias ____ todo.",
                    "stemAr": "شكرًا جزيلاً لك على كل شيء.",
                    "answerKey": {
                        "accepted": ["por"],
                        "caseSensitive": False
                    },
                    "explanationAr": "عبارات الشكر والاعتذار تأخذ دائماً حرف الجر por لأنه يعبر عن الدافع والعلة التي استوجبت الشكر: «Gracias por tu ayuda».",
                    "errorFeedback": {
                        "para": "para خطأ فادح بعد gracias.",
                        "de": "de غير صحيحة هنا."
                    },
                    "skills": ["vocabulary", "grammar"],
                    "difficulty": 1,
                    "targetVocab": ["por"],
                    "scoring": {"mode": "all_or_nothing"}
                },
                {
                    "id": "b1_porpara_6_speak",
                    "type": "speak_with_text",
                    "instructionAr": "انطق الجملة موضحًا التمييز بين الغاية والدافع.",
                    "stemEs": "Estudio español para trabajar en España.",
                    "stemAr": "أدرس الإسبانية لأجل العمل في إسبانيا.",
                    "answerKey": {
                        "referenceAudioKey": "pending/b1-porpara-speak-1",
                        "modelAnswer": "Estudio español para trabajar en España."
                    },
                    "explanationAr": "تدرّب على نطق para بوضوح كحرف دال على الغاية المستقبلية (para trabajar).",
                    "skills": ["speaking", "pronunciation"],
                    "difficulty": 2,
                    "targetVocab": ["para", "trabajar"],
                    "scoring": {
                        "mode": "rubric",
                        "rubric": [
                            {"labelAr": "وضوح كلمة para الدالة على الهدف", "weight": 50, "code": "pron_para"},
                            {"labelAr": "نطق حرف j في trabajar كخاء", "weight": 50, "code": "pron_j_trabajar"}
                        ]
                    }
                }
            ],
            "review": {
                "status": "draft",
                "authors": ["فريق المنهج — استخراج تربوي من مراجع Aula Plus 3 وEn Vocabulario B1"],
                "spanishReviewer": None,
                "translationReviewer": None,
                "reviewedAt": None,
                "notes": "الدرس يقدم حلاً نهائيًا لعقدة Por مقابل Para عبر المقارنة الدلالية الصريحة مع حرف اللام في العربية."
            }
        }
    },

    # 4. b1-acuerdo-desacuerdo
    {
        "dir": "content/drafts/b1",
        "file": "lesson-b1-acuerdo-desacuerdo.json",
        "lesson": {
            "slug": "b1-acuerdo-desacuerdo",
            "titleAr": "التعبير عن الاتفاق والاختلاف والتفاوض",
            "level": "B1",
            "programSlug": "main-track",
            "unitSlug": "b1-u2-opinions",
            "objectiveAr": "أن يعبّر المتعلم عن الاتفاق الكامل أو الجزئي والاختلاف المهذب في النقاشات الرسمية والاجتماعية باستخدام تعبيرات: Estoy de acuerdo, Tienes razón, No lo veo así, Por una parte... por otra.",
            "estimatedMinutes": 11,
            "skills": ["grammar", "reading", "writing", "listening", "vocabulary"],
            "newVocabulary": ["acuerdo", "razón", "depende", "punto", "vista", "discrepar"],
            "reviewVocabulary": ["verdad", "amigo", "trabajo", "bien"],
            "targetStructures": [
                "Acuerdo total: Estoy totalmente de acuerdo / Tienes toda la razón",
                "Acuerdo parcial: Sí, pero... / Hasta cierto punto / Depende de...",
                "Desacuerdo educado: No lo veo exactamente así / Discrepo en este punto"
            ],
            "grammarTopics": ["expresar-acuerdo-desacuerdo", "debate-negociacion-b1"],
            "scenarios": [
                {
                    "contextAr": "نقاش بين زميلين في العمل حول تطبيق نظام العمل عن بُعد بشكل دائم.",
                    "settingAr": "كافيتيريا الشركة، استراحة الغداء",
                    "lines": [
                        {
                            "es": "El teletrabajo mejora la productividad y reduce el estrés.",
                            "ar": "العمل عن بُعد يحسن الإنتاجية ويقلل من التوتر.",
                            "arEg": "الشغل من البيت بيزود الإنتاجية وبيقلل الاسترس.",
                            "audioKey": "pending/b1-debate-lunch-1"
                        },
                        {
                            "es": "Tienes toda la razón en eso, pero reduce el contacto humano.",
                            "ar": "معك كل الحق في ذلك، لكنه يقلل من التواصل البشري.",
                            "arEg": "عندك حق تماماً في النقطة دي، بس بيقلل اللمة والتعامل.",
                            "audioKey": "pending/b1-debate-lunch-2"
                        },
                        {
                            "es": "No lo veo exactamente así; la tecnología nos mantiene comunicados.",
                            "ar": "لا أرى الأمر هكذا تمامًا؛ فالتكنولوجيا تبقينا على تواصل مستمر.",
                            "arEg": "مش شايفها كدة بالظبط؛ التكنولوجيا مخليانا متواصلين طول الوقت.",
                            "audioKey": "pending/b1-debate-lunch-3"
                        },
                        {
                            "es": "Bueno, depende de cada persona y del tipo de trabajo.",
                            "ar": "حسنًا، يعتمد الأمر على كل شخص وطبيعة العمل.",
                            "arEg": "عموماً ده بيعتمد على كل شخص وطبيعة الشغلانة.",
                            "audioKey": "pending/b1-debate-lunch-4"
                        }
                    ]
                }
            ],
            "mastery": {
                "minAccuracy": 70,
                "minCorrectExercises": 5,
                "requiredExerciseTypes": ["listen_choose", "word_choice", "fill_blank"]
            },
            "unlock": {"type": "sequential"},
            "offlinePriority": 1,
            "exercises": [
                {
                    "id": "b1_acuerdo_1_listen",
                    "type": "listen_choose",
                    "instructionAr": "استمع إلى الزميل واختر العبارة التي استخدمها لتأييد كلام زميله مبدئيًا.",
                    "audioKey": "pending/b1-debate-lunch-2",
                    "speechEs": "Tienes toda la razón en eso, pero reduce el contacto humano.",
                    "options": [
                        {"id": "b1_acuerdo_1_a", "text": "Tienes toda la razón en eso", "isCorrect": True, "textAr": "معك كل الحق في ذلك"},
                        {"id": "b1_acuerdo_1_b", "text": "Estás completamente equivocado", "isCorrect": False, "textAr": "أنت مخطئ تمامًا", "distractorRationaleAr": "لم يقل ذلك، بل اتفق معه مبدئياً بأدب."},
                        {"id": "b1_acuerdo_1_c", "text": "No me importa este asunto", "isCorrect": False, "textAr": "لا يهمني هذا الأمر", "distractorRationaleAr": "لم يتلفظ بهذه العبارة."}
                    ],
                    "answerKey": {"correctOptionIds": ["b1_acuerdo_1_a"]},
                    "explanationAr": "عبارة «Tienes toda la razón» من أرقى صيغ الاتفاق التام في النقاش الإسباني المهني.",
                    "errorFeedback": {
                        "b1_acuerdo_1_b": "هو اتفق معه أولاً ثم استدرك.",
                        "b1_acuerdo_1_c": "هو مهتم بالنقاش."
                    },
                    "skills": ["listening"],
                    "difficulty": 1,
                    "targetVocab": ["razón"],
                    "scoring": {"mode": "all_or_nothing"}
                },
                {
                    "id": "b1_acuerdo_2_collocation",
                    "type": "word_choice",
                    "instructionAr": "ما هو الفعل الإسباني الصحيح المستخدم مع عبارة «على حق / معه حق»؟",
                    "options": [
                        {"id": "b1_acuerdo_2_a", "text": "tener razón", "isCorrect": True, "textAr": "معه حق (بفعل tener)"},
                        {"id": "b1_acuerdo_2_b", "text": "ser razón", "isCorrect": False, "textAr": "استخدام غير صحيح لفعل ser", "distractorRationaleAr": "لا نقول Ser razón في الإسبانية."},
                        {"id": "b1_acuerdo_2_c", "text": "estar razón", "isCorrect": False, "textAr": "استخدام غير صحيح لفعل estar", "distractorRationaleAr": "لا يُستخدم estar مع razón."}
                    ],
                    "answerKey": {"correctOptionIds": ["b1_acuerdo_2_a"]},
                    "explanationAr": "في الإسبانية يقترن فعل tener بالحق: «Tener razón» (معه حق)، ولا يُستخدم أبدًا ser أو estar.",
                    "errorFeedback": {
                        "b1_acuerdo_2_b": "ser razón خطأ لغوي جسيم.",
                        "b1_acuerdo_2_c": "estar لا تأتي مع razón."
                    },
                    "skills": ["vocabulary", "grammar"],
                    "difficulty": 1,
                    "targetVocab": ["razón"],
                    "scoring": {"mode": "all_or_nothing"}
                },
                {
                    "id": "b1_acuerdo_3_fill_acuerdo",
                    "type": "fill_blank",
                    "instructionAr": "أكمل الفراغ بالفعل المناسب: «أنا متفق تمامًا معك».",
                    "stemEs": "Yo ____ de acuerdo contigo.",
                    "stemAr": "أنا متفق تمامًا معك.",
                    "answerKey": {
                        "accepted": ["estoy"],
                        "caseSensitive": False
                    },
                    "explanationAr": "عبارة الاتفاق تتطلب حصراً فعل estar: «Estoy de acuerdo» (أنا متفق).",
                    "errorFeedback": {
                        "soy": "لا يجوز استخدام soy مع de acuerdo.",
                        "tengo": "tengo مع razón وليس مع de acuerdo."
                    },
                    "skills": ["grammar", "writing"],
                    "difficulty": 2,
                    "targetVocab": ["acuerdo"],
                    "scoring": {"mode": "all_or_nothing"}
                },
                {
                    "id": "b1_acuerdo_4_polite_disagree",
                    "type": "word_choice",
                    "instructionAr": "أي من العبارات الآتية تعتبر التعبير الأكثر تهذيبًا واحترافية للاعتراض في اجتماع عمل؟",
                    "options": [
                        {"id": "b1_acuerdo_4_a", "text": "No lo veo exactamente así", "isCorrect": True, "textAr": "لا أرى الأمر هكذا تمامًا"},
                        {"id": "b1_acuerdo_4_b", "text": "Eso es una tontería absoluta", "isCorrect": False, "textAr": "هذا هراء تام", "distractorRationaleAr": "أسلوب فظ لا يناسب البيئة المهنية."},
                        {"id": "b1_acuerdo_4_c", "text": "Te equivocas por completo", "isCorrect": False, "textAr": "أنت مخطئ تمامًا", "distractorRationaleAr": "أسلوب حاد جداً ينبغي تجنبه."}
                    ],
                    "answerKey": {"correctOptionIds": ["b1_acuerdo_4_a"]},
                    "explanationAr": "«No lo veo exactamente así» تعبّر عن وجهة نظر مغايرة دون تجريح الطرف الآخر، وهي من المعايير التواصلية لمستوى B1 المهني.",
                    "errorFeedback": {
                        "b1_acuerdo_4_b": "أسلوب غير لائق بتاتاً.",
                        "b1_acuerdo_4_c": "أسلوب قاطع يفتقد للدبلوماسية."
                    },
                    "skills": ["reading"],
                    "difficulty": 1,
                    "targetVocab": ["punto", "vista"],
                    "scoring": {"mode": "all_or_nothing"}
                },
                {
                    "id": "b1_acuerdo_5_fill_depende",
                    "type": "fill_blank",
                    "instructionAr": "أكمل الفراغ بحرف الجر الصحيح الذي يقترن دائمًا بالفعل depender: «يعتمد على...».",
                    "stemEs": "El éxito del proyecto depende ____ nosotros.",
                    "stemAr": "نجاح المشروع يعتمد علينا.",
                    "answerKey": {
                        "accepted": ["de"],
                        "caseSensitive": False
                    },
                    "explanationAr": "فعل «Depender» في الإسبانية يأخذ دائمًا حرف الجر de: «Depende de ti» (يعتمد عليك).",
                    "errorFeedback": {
                        "en": "depende en خطأ تركيبي.",
                        "sobre": "sobre لا تستخدم مع هذا الفعل."
                    },
                    "skills": ["grammar", "writing"],
                    "difficulty": 2,
                    "targetVocab": ["depende"],
                    "scoring": {"mode": "all_or_nothing"}
                },
                {
                    "id": "b1_acuerdo_6_speak",
                    "type": "speak_with_text",
                    "instructionAr": "انطق عبارة الاتفاق بنبرة هادئة ومؤكدة.",
                    "stemEs": "Tienes toda la razón en este punto.",
                    "stemAr": "معك كل الحق في هذه النقطة.",
                    "answerKey": {
                        "referenceAudioKey": "pending/b1-acuerdo-speak-1",
                        "modelAnswer": "Tienes toda la razón en este punto."
                    },
                    "explanationAr": "انطق حرف z في razón كالثاء العربية، مع نبر واضح على حرف ó في razón.",
                    "skills": ["speaking", "pronunciation"],
                    "difficulty": 2,
                    "targetVocab": ["razón", "punto"],
                    "scoring": {
                        "mode": "rubric",
                        "rubric": [
                            {"labelAr": "نطق z في razón كثاء", "weight": 50, "code": "pron_z_razon"},
                            {"labelAr": "النبر على مقطع zón", "weight": 50, "code": "stress_razon"}
                        ]
                    }
                }
            ],
            "review": {
                "status": "draft",
                "authors": ["فريق المنهج — استخراج تربوي من مراجع Aula Plus 3 وEn Vocabulario B1"],
                "spanishReviewer": None,
                "translationReviewer": None,
                "reviewedAt": None,
                "notes": "الدرس يقدم مهارات التفاوض وإبداء الرأي والاتفاق المهني وفق معايير معهد سيرفانتس لمستوى B1."
            }
        }
    }
]
