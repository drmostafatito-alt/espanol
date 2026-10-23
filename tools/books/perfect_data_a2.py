# -*- coding: utf-8 -*-
"""
tools/books/perfect_data_a2.py
"""

A2_LESSONS = [
    {
        "dir": "content/drafts/a2",
        "file": "lesson-a2-indefinido-regular.json",
        "lesson": {
            "slug": "a2-indefinido-regular",
            "titleAr": "الماضي البسيط: تصريف الأفعال المنتظمة",
            "level": "A2",
            "programSlug": "main-track",
            "unitSlug": "a2-u2-past",
            "objectiveAr": "أن يصرّف المتعلم أفعال المجموعات الثلاث (-ar, -er, -ir) في الماضي البسيط مع ضمائر الفاعل المختلفة، ويستخدم الظروف الزمنية الدالة على الماضي المنتهي بدقة.",
            "estimatedMinutes": 11,
            "skills": ["grammar", "reading", "writing", "listening", "vocabulary"],
            "newVocabulary": ["ayer", "anoche", "viajar", "visitar", "comer", "vivir"],
            "reviewVocabulary": ["hola", "semana", "año", "amigo"],
            "targetStructures": [
                "hablé, hablaste, habló, hablamos, hablasteis, hablaron (-ar)",
                "comí, comiste, comió, comimos, comisteis, comieron (-er / -ir)",
                "Marcadores: ayer, anoche, la semana pasada, el año pasado"
            ],
            "grammarTopics": ["preterito-indefinido-regular", "marcadores-temporales-pasado"],
            "scenarios": [
                {
                    "contextAr": "محادثة بين صديقين في مدريد يسأل أحدهما الآخر عما فعله في عطلة نهاية الأسبوع الماضي.",
                    "settingAr": "مقهى بوسط المدينة، صباح يوم الاثنين",
                    "lines": [
                        {
                            "es": "¡Hola! ¿Qué hiciste el fin de semana pasado?",
                            "ar": "مرحبًا! ماذا فعلت في عطلة نهاية الأسبوع الماضي؟",
                            "arEg": "أهلًا! عملت إيه في الويك إند اللي فات؟",
                            "audioKey": "pending/a2-indef-tariq-1"
                        },
                        {
                            "es": "El sábado viajé a Toledo y visité monumentos históricos.",
                            "ar": "يوم السبت سافرتُ إلى طليطلة وزرتُ معالم تاريخية.",
                            "arEg": "يوم السبت سافرت طليطلة وزرت آثار تاريخية.",
                            "audioKey": "pending/a2-indef-tariq-2"
                        },
                        {
                            "es": "¿Y comiste en algún restaurante típico de allí?",
                            "ar": "وهل أكلتَ في مطعم تقليدي هناك؟",
                            "arEg": "وأكلت في مطعم بلدي هناك؟",
                            "audioKey": "pending/a2-indef-tariq-3"
                        },
                        {
                            "es": "Sí, comí un plato delicioso y regresé a Madrid por la noche.",
                            "ar": "نعم، أكلتُ طبقًا لذيذًا وعدتُ إلى مدريد في المساء.",
                            "arEg": "أيوة، أكلت أكلة حلوة ورجعت مدريد بالليل.",
                            "audioKey": "pending/a2-indef-tariq-4"
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
                    "id": "a2_indreg_1_listen",
                    "type": "listen_choose",
                    "instructionAr": "استمع إلى طارق واختر المدينة التي سافر إليها يوم السبت.",
                    "audioKey": "pending/a2-indef-tariq-2",
                    "speechEs": "El sábado viajé a Toledo y visité monumentos históricos.",
                    "options": [
                        {"id": "a2_indreg_1_a", "text": "Toledo", "isCorrect": True, "textAr": "طليطلة"},
                        {"id": "a2_indreg_1_b", "text": "Madrid", "isCorrect": False, "textAr": "مدريد", "distractorRationaleAr": "مدريد هي مدينة الإقامة والعودة وليست وجهة الرحلة."},
                        {"id": "a2_indreg_1_c", "text": "Granada", "isCorrect": False, "textAr": "غرناطة", "distractorRationaleAr": "لم تُذكر غرناطة في التسجيل."}
                    ],
                    "answerKey": {"correctOptionIds": ["a2_indreg_1_a"]},
                    "explanationAr": "قال المتحدث صراحة: «El sábado viajé a Toledo». الفعل viajé مصرف في الماضي البسيط للمتكلم.",
                    "errorFeedback": {
                        "a2_indreg_1_b": "مدريد هي مكان انطلاق الرحلة والعودة إليها.",
                        "a2_indreg_1_c": "غرناطة لم تُذكر في الحوار."
                    },
                    "skills": ["listening", "vocabulary"],
                    "difficulty": 1,
                    "targetVocab": ["viajar"],
                    "scoring": {"mode": "all_or_nothing"}
                },
                {
                    "id": "a2_indreg_2_choice",
                    "type": "word_choice",
                    "instructionAr": "اختر التصريف الصحيح للفعل hablar في الماضي مع الضمير yo.",
                    "options": [
                        {"id": "a2_indreg_2_a", "text": "hablé", "isCorrect": True, "textAr": "تحدثتُ (أنا)"},
                        {"id": "a2_indreg_2_b", "text": "habló", "isCorrect": False, "textAr": "تحدث هو", "distractorRationaleAr": "habló للمفرد الغائب لوجود نبرة ó."},
                        {"id": "a2_indreg_2_c", "text": "hablaba", "isCorrect": False, "textAr": "كنتُ أتحدث (ماض مستمر)", "distractorRationaleAr": "hablaba في الماضي المستمر imperfecto وليست في الماضي البسيط."},
                        {"id": "a2_indreg_2_d", "text": "hablaste", "isCorrect": False, "textAr": "تحدثتَ أنت", "distractorRationaleAr": "hablaste خاصة بالمخاطب المفرد tú."}
                    ],
                    "answerKey": {"correctOptionIds": ["a2_indreg_2_a"]},
                    "explanationAr": "أفعال المجموعة الأولى (-ar) تأخذ النهاية -é مع الضمير yo في الماضي البسيط: hablé.",
                    "errorFeedback": {
                        "a2_indreg_2_b": "habló للغائب (هو تحدث).",
                        "a2_indreg_2_c": "hablaba في الماضي المستمر.",
                        "a2_indreg_2_d": "hablaste للمخاطب أنت."
                    },
                    "skills": ["grammar"],
                    "difficulty": 1,
                    "targetVocab": ["ayer"],
                    "scoring": {"mode": "all_or_nothing"}
                },
                {
                    "id": "a2_indreg_3_fill_comer",
                    "type": "fill_blank",
                    "instructionAr": "أكمل الجملة بتصريف الفعل comer في الماضي مع الضمير nosotros.",
                    "stemEs": "Ayer nosotros ____ paella en un restaurante valenciano.",
                    "stemAr": "أمس نحن ____ بايا في مطعم بلنسي.",
                    "answerKey": {
                        "accepted": ["comimos"],
                        "caseSensitive": False
                    },
                    "explanationAr": "أفعال المجموعة الثانية (-er) تأخذ النهاية -imos مع nosotros في الماضي البسيط: comimos.",
                    "errorFeedback": {
                        "comieron": "comieron للغائبين (ellos/ellas).",
                        "comemos": "comemos في المضارع، والماضي هو comimos."
                    },
                    "skills": ["grammar", "writing"],
                    "difficulty": 2,
                    "targetVocab": ["comer"],
                    "scoring": {"mode": "all_or_nothing"}
                },
                {
                    "id": "a2_indreg_4_fill_vivir",
                    "type": "fill_blank",
                    "instructionAr": "أكمل الجملة بتصريف الفعل vivir في الماضي مع الضمير ellos.",
                    "stemEs": "El año pasado mis primos ____ en Granada.",
                    "stemAr": "العام الماضي أبناء عمي ____ في غرناطة.",
                    "answerKey": {
                        "accepted": ["vivieron"],
                        "caseSensitive": False
                    },
                    "explanationAr": "مع الفاعل الجمع الغائب (mis primos = ellos) لأفعال المجموعة الثالثة (-ir)، النهاية هي -ieron: vivieron.",
                    "errorFeedback": {
                        "vivió": "الفاعل جمع وليس مفرداً.",
                        "viven": "viven في المضارع، والمطلوب ماضٍ."
                    },
                    "skills": ["grammar", "writing"],
                    "difficulty": 2,
                    "targetVocab": ["vivir"],
                    "scoring": {"mode": "all_or_nothing"}
                },
                {
                    "id": "a2_indreg_5_marker",
                    "type": "word_choice",
                    "instructionAr": "أيّ من هذه الكلمات يُعتبر ظرفًا زمنيًا دالاً على الماضي المنتهي؟",
                    "options": [
                        {"id": "a2_indreg_5_a", "text": "anoche", "isCorrect": True, "textAr": "البارحة ليلاً"},
                        {"id": "a2_indreg_5_b", "text": "ahora", "isCorrect": False, "textAr": "الآن", "distractorRationaleAr": "ahora تدل على الحاضر."},
                        {"id": "a2_indreg_5_c", "text": "mañana", "isCorrect": False, "textAr": "غدًا", "distractorRationaleAr": "mañana تدل على المستقبل."},
                        {"id": "a2_indreg_5_d", "text": "siempre", "isCorrect": False, "textAr": "دائمًا", "distractorRationaleAr": "siempre تدل على التكرار والعادة."}
                    ],
                    "answerKey": {"correctOptionIds": ["a2_indreg_5_a"]},
                    "explanationAr": "ظرف الزمان «anoche» (البارحة ليلاً) يحدد فترة زمنية انقضت تماماً ومفصولة عن الحاضر، ولذلك يقترن بالماضي البسيط.",
                    "errorFeedback": {
                        "a2_indreg_5_b": "ahora تدل على الحاضر.",
                        "a2_indreg_5_c": "mañana تدل على المستقبل.",
                        "a2_indreg_5_d": "siempre تفيد التكرار."
                    },
                    "skills": ["vocabulary", "grammar"],
                    "difficulty": 1,
                    "targetVocab": ["anoche"],
                    "scoring": {"mode": "all_or_nothing"}
                },
                {
                    "id": "a2_indreg_6_speak",
                    "type": "speak_with_text",
                    "instructionAr": "انطق الجملة بصوت واضح مع مراعاة النبرة على حرف é في viajé.",
                    "stemEs": "Ayer viajé a Toledo.",
                    "stemAr": "أمس سافرتُ إلى طليطلة.",
                    "answerKey": {
                        "referenceAudioKey": "pending/a2-indreg-speak-1",
                        "modelAnswer": "Ayer viajé a Toledo."
                    },
                    "explanationAr": "احرص على نطق حرف j في viajé بصوت الخاء العربية، مع نبر قوي على المقطع الأخير -jé.",
                    "skills": ["speaking", "pronunciation"],
                    "difficulty": 2,
                    "targetVocab": ["viajar"],
                    "scoring": {
                        "mode": "rubric",
                        "rubric": [
                            {"labelAr": "نطق حرف j في viajé كخاء", "weight": 50, "code": "pron_j"},
                            {"labelAr": "النبر على المقطع الأخير -jé", "weight": 50, "code": "stress_je"}
                        ]
                    }
                }
            ],
            "review": {
                "status": "draft",
                "authors": ["فريق المنهج — استخراج تربوي من سلسلة Aula Plus 2 وEn Vocabulario"],
                "spanishReviewer": None,
                "translationReviewer": None,
                "reviewedAt": None,
                "notes": "تم استخراج الدرس وصياغة الفروق الدقيقة للمتعلم العربي مع تمرين استماع وتمارين تصريف متدرجة الصعوبة."
            }
        }
    },
    {
        "dir": "content/drafts/a2",
        "file": "lesson-a2-indefinido-irregular.json",
        "lesson": {
            "slug": "a2-indefinido-irregular",
            "titleAr": "الماضي البسيط: الأفعال الشاذة الأساسية",
            "level": "A2",
            "programSlug": "main-track",
            "unitSlug": "a2-u2-past",
            "objectiveAr": "أن يتقن المتعلم تصريف واستخدام الأفعال الشاذة الرئيسية في الماضي البسيط: ser/ir (fui), estar (estuve), hacer (hice/hizo), tener (tuve)، ويميز بين ser و ir من سياق الجملة.",
            "estimatedMinutes": 12,
            "skills": ["grammar", "reading", "writing", "listening", "vocabulary"],
            "newVocabulary": ["fui", "estuve", "hice", "tuve", "ayer", "anoche"],
            "reviewVocabulary": ["viajar", "amigo", "casa", "tiempo"],
            "targetStructures": [
                "yo fui, tú fuiste, él/ella fue, nosotros fuimos, vosotros fuisteis, ellos fueron (ser / ir)",
                "estuve, estuviste, estuvo, estuvimos, estuvisteis, estuvieron (estar)",
                "hice, hiciste, hizo, hicimos, hicisteis, hicieron (hacer)",
                "tuve, tuviste, tuvo, tuvimos, tuvisteis, tuvieron (tener)"
            ],
            "grammarTopics": ["preterito-indefinido-irregular", "ser-ir-indefinido"],
            "scenarios": [
                {
                    "contextAr": "حوار بين زميلين في العمل يتحدثان عن إجازة نهاية الأسبوع المنصرمة وكيف قضياها.",
                    "settingAr": "مكتب العمل، صباح الاثنين",
                    "lines": [
                        {
                            "es": "¿Dónde estuviste el domingo pasado?",
                            "ar": "أين كنتَ يوم الأحد الماضي؟",
                            "arEg": "كنت فين يوم الحد اللي فات؟",
                            "audioKey": "pending/a2-irreg-laura-1"
                        },
                        {
                            "es": "Estuve en casa de mis padres y tuvimos una comida familiar.",
                            "ar": "كنتُ في منزل والديّ وتناولنا وجبة عائلية.",
                            "arEg": "كنت عند أهلي واتغدينا غدوة عائلية.",
                            "audioKey": "pending/a2-irreg-laura-2"
                        },
                        {
                            "es": "¿Y qué hiciste después de comer?",
                            "ar": "وماذا فعلتَ بعد تناول الطعام؟",
                            "arEg": "وعملت إيه بعد الأكل؟",
                            "audioKey": "pending/a2-irreg-laura-3"
                        },
                        {
                            "es": "Fui al cine con mi hermano. La película fue muy divertida.",
                            "ar": "ذهبتُ إلى السينما مع أخي. كان الفيلم مسليًا جدًا.",
                            "arEg": "رحت السينما مع أخويا. الفيلم كان لذيذ جداً.",
                            "audioKey": "pending/a2-irreg-laura-4"
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
                    "id": "a2_indirreg_1_listen",
                    "type": "listen_choose",
                    "instructionAr": "استمع إلى لاورا واختر المكان الذي ذهبت إليه بعد الغداء.",
                    "audioKey": "pending/a2-irreg-laura-4",
                    "speechEs": "Fui al cine con mi hermano. La película fue muy divertida.",
                    "options": [
                        {"id": "a2_indirreg_1_a", "text": "Al cine", "isCorrect": True, "textAr": "إلى السينما"},
                        {"id": "a2_indirreg_1_b", "text": "A la playa", "isCorrect": False, "textAr": "إلى الشاطئ", "distractorRationaleAr": "لم يُذكر الشاطئ في كلام لاورا."},
                        {"id": "a2_indirreg_1_c", "text": "Al museo", "isCorrect": False, "textAr": "إلى المتحف", "distractorRationaleAr": "المتحف لم يُذكر في الحوار."}
                    ],
                    "answerKey": {"correctOptionIds": ["a2_indirreg_1_a"]},
                    "explanationAr": "قالت لاورا: «Fui al cine con mi hermano». الفعل fui هنا مشتق من ir بمعنى ذهب.",
                    "errorFeedback": {
                        "a2_indirreg_1_b": "لاورا لم تذكر الشاطئ.",
                        "a2_indirreg_1_c": "المتحف لم يُذكر في الحوار."
                    },
                    "skills": ["listening"],
                    "difficulty": 1,
                    "targetVocab": ["fui"],
                    "scoring": {"mode": "all_or_nothing"}
                },
                {
                    "id": "a2_indirreg_2_ser_vs_ir",
                    "type": "word_choice",
                    "instructionAr": "ما هو أصل الفعل fue في سياق وصف الفيلم بأنه كان مسليًا؟",
                    "options": [
                        {"id": "a2_indirreg_2_a", "text": "ser (era / fue)", "isCorrect": True, "textAr": "فعل الكينونة ser"},
                        {"id": "a2_indirreg_2_b", "text": "ir (iba / fue)", "isCorrect": False, "textAr": "فعل الذهاب ir", "distractorRationaleAr": "الفيلم لا يذهب بحركة مادية، بل يُوصف بأنه كان مسليًا."},
                        {"id": "a2_indirreg_2_c", "text": "estar (estuvo)", "isCorrect": False, "textAr": "فعل التواجد estar", "distractorRationaleAr": "ماضي estar هو estuvo وليس fue."}
                    ],
                    "answerKey": {"correctOptionIds": ["a2_indirreg_2_a"]},
                    "explanationAr": "يشترك الفعلان ser و ir في نفس التصريف تمامًا في الماضي البسيط (fue)، والصفة divertida تحدد أنه من فعل ser.",
                    "errorFeedback": {
                        "a2_indirreg_2_b": "الفيلم لا يتحرك ليذهب، بل المعنى هو كان مسليًا.",
                        "a2_indirreg_2_c": "فعل estar في الماضي يصبح estuvo."
                    },
                    "skills": ["grammar"],
                    "difficulty": 2,
                    "targetVocab": ["fui"],
                    "scoring": {"mode": "all_or_nothing"}
                },
                {
                    "id": "a2_indirreg_3_fill_estar",
                    "type": "fill_blank",
                    "instructionAr": "أكمل الفراغ بتصريف فعل estar في الماضي البسيط مع الضمير yo.",
                    "stemEs": "Ayer yo ____ enfermo y no fui a trabajar.",
                    "stemAr": "أمس أنا ____ مريضًا ولم أذهب إلى العمل.",
                    "answerKey": {
                        "accepted": ["estuve"],
                        "caseSensitive": False
                    },
                    "explanationAr": "فعل estar شاذ في الماضي ويتحول جذره إلى estuv- مع نهايات غير منبورة: yo estuve.",
                    "errorFeedback": {
                        "estuvo": "estuvo خاصة بـ él/ella.",
                        "estaba": "estaba في صيغة imperfecto."
                    },
                    "skills": ["grammar", "writing"],
                    "difficulty": 2,
                    "targetVocab": ["estuve"],
                    "scoring": {"mode": "all_or_nothing"}
                },
                {
                    "id": "a2_indirreg_4_fill_hacer",
                    "type": "fill_blank",
                    "instructionAr": "أكمل الفراغ بتصريف فعل hacer مع الضمير él مع الانتباه لتغير حرف c إلى z.",
                    "stemEs": "Carlos ____ los deberes anoche.",
                    "stemAr": "كارلوس ____ الواجبات البارحة ليلاً.",
                    "answerKey": {
                        "accepted": ["hizo"],
                        "caseSensitive": False
                    },
                    "explanationAr": "مع المفرد الغائب يتحول حرف c في جذر الفعل إلى z للحفاظ على النطق الصوتي الصحيح: hizo.",
                    "errorFeedback": {
                        "hice": "hice مع المتكلم yo.",
                        "hacía": "hacía في الماضي المستمر."
                    },
                    "skills": ["grammar", "writing"],
                    "difficulty": 2,
                    "targetVocab": ["hice"],
                    "scoring": {"mode": "all_or_nothing"}
                },
                {
                    "id": "a2_indirreg_5_fill_tener",
                    "type": "fill_blank",
                    "instructionAr": "أكمل الفراغ بتصريف فعل tener مع الضمير nosotros في الماضي البسيط.",
                    "stemEs": "El domingo nosotros ____ mucha suerte.",
                    "stemAr": "يوم الأحد نحن ____ حظاً وافراً.",
                    "answerKey": {
                        "accepted": ["tuvimos"],
                        "caseSensitive": False
                    },
                    "explanationAr": "فعل tener يتحول جذره في الماضي البسيط إلى tuv- ومعه النهاية -imos للضمير nosotros: tuvimos.",
                    "errorFeedback": {
                        "tenemos": "tenemos مضارع حاضر.",
                        "tuvieron": "tuvieron للغائب الجمع."
                    },
                    "skills": ["grammar", "writing"],
                    "difficulty": 2,
                    "targetVocab": ["tuve"],
                    "scoring": {"mode": "all_or_nothing"}
                },
                {
                    "id": "a2_indirreg_6_speak",
                    "type": "speak_with_text",
                    "instructionAr": "انطق الجملة بصوت واضح مراعيًا التفريق بين صوتي fui و fue.",
                    "stemEs": "Yo fui al cine y la película fue buena.",
                    "stemAr": "أنا ذهبتُ إلى السينما وكان الفيلم جيدًا.",
                    "answerKey": {
                        "referenceAudioKey": "pending/a2-indirreg-speak-1",
                        "modelAnswer": "Yo fui al cine y la película fue buena."
                    },
                    "explanationAr": "تدرّب على كسر الياء في fui للمتكلم (ذهبتُ)، وضم الواو وفتح الهاء في fue للغائب (كان).",
                    "skills": ["speaking", "pronunciation"],
                    "difficulty": 2,
                    "targetVocab": ["fui"],
                    "scoring": {
                        "mode": "rubric",
                        "rubric": [
                            {"labelAr": "وضوح صوت fui للمتكلم", "weight": 50, "code": "pron_fui"},
                            {"labelAr": "وضوح صوت fue للغائب", "weight": 50, "code": "pron_fue"}
                        ]
                    }
                }
            ],
            "review": {
                "status": "draft",
                "authors": ["فريق المنهج — استخراج تربوي من سلسلة Aula Plus 2 وEn Vocabulario"],
                "spanishReviewer": None,
                "translationReviewer": None,
                "reviewedAt": None,
                "notes": "الدرس يركز على إزالة الخلط الشهير بين ser و ir في الماضي البسيط والشواذ الأربعة الكبرى."
            }
        }
    },
    {
        "dir": "content/drafts/a2",
        "file": "lesson-a2-imperfecto-habitos.json",
        "lesson": {
            "slug": "a2-imperfecto-habitos",
            "titleAr": "الماضي المستمر: العادات السابقة والوصف",
            "level": "A2",
            "programSlug": "main-track",
            "unitSlug": "a2-u2-past",
            "objectiveAr": "أن يستخدم المتعلم زمن الماضي المستمر (Pretérito Imperfecto) لوصف العادات والروتين اليومي في الماضي والوصف الحركي والمكاني، ويصرّف الأفعال الشاذة الثلاثة (ser, ir, ver).",
            "estimatedMinutes": 11,
            "skills": ["grammar", "reading", "writing", "listening", "vocabulary"],
            "newVocabulary": ["siempre", "antes", "vivir", "jugar", "era", "iba"],
            "reviewVocabulary": ["niño", "escuela", "casa", "amigo"],
            "targetStructures": [
                "cantaba, cantabas, cantaba, cantábamos, cantabais, cantaban (-ar)",
                "vivía, vivías, vivía, vivíamos, vivíais, vivían (-er / -ir)",
                "Los 3 únicos irregulares: ser (era), ir (iba), ver (veía)",
                "Marcadores: de niño, antes, en aquella época, todos los veranos"
            ],
            "grammarTopics": ["preterito-imperfecto-habitos", "imperfecto-irregulares"],
            "scenarios": [
                {
                    "contextAr": "أستاذ إسباني يسترجع ذكريات طفولته وكيف كانت حياته في قريته الصغيرة في الأندلس.",
                    "settingAr": "فصل تعليمي، وقت المحاضرة",
                    "lines": [
                        {
                            "es": "Cuando yo era niño, vivía en un pueblo blanco de Andalucía.",
                            "ar": "عندما كنتُ طفلاً، كنتُ أعيش في قرية بيضاء في الأندلس.",
                            "arEg": "لما كنت عيل صغير، كنت عايش في قرية بيضا في الأندلس.",
                            "audioKey": "pending/a2-imp-prof-1"
                        },
                        {
                            "es": "Todos los días iba a la escuela a pie con mis amigos.",
                            "ar": "كل يوم كنتُ أذهب إلى المدرسة سيرًا على الأقدام مع أصدقائي.",
                            "arEg": "كل يوم كنت بروح المدرسة مشي مع أصحابي.",
                            "audioKey": "pending/a2-imp-prof-2"
                        },
                        {
                            "es": "Por las tardes jugábamos al fútbol en la plaza.",
                            "ar": "وفي فترات ما بعد الظهر كنا نلعب كرة القدم في الساحة.",
                            "arEg": "وبعد الظهر كنا بنلعب كورة في الميدان.",
                            "audioKey": "pending/a2-imp-prof-3"
                        },
                        {
                            "es": "La vida era mucho más tranquila que ahora.",
                            "ar": "كانت الحياة أكثر هدوءًا بكثير من الآن.",
                            "arEg": "الحياة كانت أهدى بكتير من دلوقتي.",
                            "audioKey": "pending/a2-imp-prof-4"
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
                    "id": "a2_imp_1_listen",
                    "type": "listen_choose",
                    "instructionAr": "استمع إلى الأستاذ واختر وسيلة ذهابه إلى المدرسة عندما كان طفلاً.",
                    "audioKey": "pending/a2-imp-prof-2",
                    "speechEs": "Todos los días iba a la escuela a pie con mis amigos.",
                    "options": [
                        {"id": "a2_imp_1_a", "text": "A pie", "isCorrect": True, "textAr": "مشيًا على الأقدام"},
                        {"id": "a2_imp_1_b", "text": "En autobús", "isCorrect": False, "textAr": "بالحافلة", "distractorRationaleAr": "لم يذكر الحافلة، بل قال a pie."},
                        {"id": "a2_imp_1_c", "text": "En coche", "isCorrect": False, "textAr": "بالسيارة", "distractorRationaleAr": "لم تذكر السيارة في النص."}
                    ],
                    "answerKey": {"correctOptionIds": ["a2_imp_1_a"]},
                    "explanationAr": "قال الأستاذ صراحة: «Todos los días iba a la escuela a pie». الفعل iba يعبر عن عادة ماضية متكررة.",
                    "errorFeedback": {
                        "a2_imp_1_b": "لم يقل autobús بل a pie.",
                        "a2_imp_1_c": "لم تذكر السيارة."
                    },
                    "skills": ["listening"],
                    "difficulty": 1,
                    "targetVocab": ["iba"],
                    "scoring": {"mode": "all_or_nothing"}
                },
                {
                    "id": "a2_imp_2_irregulars",
                    "type": "word_choice",
                    "instructionAr": "كم عدد الأفعال الشاذة في زمن الماضي المستمر في اللغة الإسبانية؟",
                    "options": [
                        {"id": "a2_imp_2_a", "text": "Solo 3 verbos (ser, ir, ver)", "isCorrect": True, "textAr": "3 أفعال فقط"},
                        {"id": "a2_imp_2_b", "text": "Más de 50 verbos", "isCorrect": False, "textAr": "أكثر من 50 فعلاً", "distractorRationaleAr": "هذا ينطبق على الماضي البسيط وليس Imperfecto المنتظم جدًا."},
                        {"id": "a2_imp_2_c", "text": "Cero verbos", "isCorrect": False, "textAr": "صفر أفعال", "distractorRationaleAr": "توجد ثلاثة أفعال شاذة مشهورة."}
                    ],
                    "answerKey": {"correctOptionIds": ["a2_imp_2_a"]},
                    "explanationAr": "من أروع ميزات زمن Imperfecto أنه شديد الانتظام؛ لا يوجد سوى 3 أفعال شاذة فقط: ser (era), ir (iba), ver (veía).",
                    "errorFeedback": {
                        "a2_imp_2_b": "الماضي البسيط هو الذي يمتلك شواذ كثيرة.",
                        "a2_imp_2_c": "ser و ir و ver أفعال شاذة فيه."
                    },
                    "skills": ["grammar"],
                    "difficulty": 1,
                    "targetVocab": ["era", "iba"],
                    "scoring": {"mode": "all_or_nothing"}
                },
                {
                    "id": "a2_imp_3_fill_ar",
                    "type": "fill_blank",
                    "instructionAr": "أكمل الفراغ بتصريف الفعل jugar مع الضمير nosotros في زمن Imperfecto.",
                    "stemEs": "De niños, nosotros ____ al fútbol en la plaza.",
                    "stemAr": "عندما كنا أطفالاً، كنا نلعب كرة القدم في الساحة.",
                    "answerKey": {
                        "accepted": ["jugábamos"],
                        "caseSensitive": False
                    },
                    "explanationAr": "أفعال -ar تأخذ النهايات -aba... ومع nosotros توضع نبرة مكتوبة دائمًا على ألف المقطع: jugábamos.",
                    "errorFeedback": {
                        "jugamos": "jugamos ماضٍ بسيط يعبر عن مرة واحدة وليس عادة مستمرة في الطفولة.",
                        "jugaban": "jugaban لضمير الغائبين."
                    },
                    "skills": ["grammar", "writing"],
                    "difficulty": 2,
                    "targetVocab": ["jugar"],
                    "scoring": {"mode": "all_or_nothing"}
                },
                {
                    "id": "a2_imp_4_fill_er_ir",
                    "type": "fill_blank",
                    "instructionAr": "أكمل الفراغ بتصريف الفعل vivir مع الضمير yo في زمن Imperfecto.",
                    "stemEs": "Antes yo ____ en un pueblo pequeño.",
                    "stemAr": "في السابق كنتُ أعيش في قرية صغيرة.",
                    "answerKey": {
                        "accepted": ["vivía"],
                        "caseSensitive": False
                    },
                    "explanationAr": "أفعال المجموعتين -er و -ir تأخذ النهاية -ía مع نبرة مكتوبة دائمة: vivía.",
                    "errorFeedback": {
                        "viví": "viví للماضي القاطع المنتهي.",
                        "vivo": "vivo في الحاضر."
                    },
                    "skills": ["grammar", "writing"],
                    "difficulty": 2,
                    "targetVocab": ["vivir"],
                    "scoring": {"mode": "all_or_nothing"}
                },
                {
                    "id": "a2_imp_5_arabic_bridge",
                    "type": "word_choice",
                    "instructionAr": "ما هو التركيب في اللغة العربية الذي يعادل بدقة وظيفة زمن Imperfecto الإسباني؟",
                    "options": [
                        {"id": "a2_imp_5_a", "text": "Equivale a solía hacer", "isCorrect": True, "textAr": "يعادل بنية كان يفعل"},
                        {"id": "a2_imp_5_b", "text": "Equivale al futuro simple", "isCorrect": False, "textAr": "يعادل صيغة سوف يفعل المستقبلية", "distractorRationaleAr": "هذا يعبر عن المستقبل Futuro."},
                        {"id": "a2_imp_5_c", "text": "Equivale al imperativo", "isCorrect": False, "textAr": "يعادل صيغة الأمر والطلب", "distractorRationaleAr": "الأمر صيغة للطلب وليس للزمن الماضي."}
                    ],
                    "answerKey": {"correctOptionIds": ["a2_imp_5_a"]},
                    "explanationAr": "الجسر اللغوي الأقوى للمتعلم العربي هو أن Imperfecto يترجم دائمًا إلى «كان يفعل» أو «كان يوصف بكذا».",
                    "errorFeedback": {
                        "a2_imp_5_b": "قد + الماضي يعادل pretérito perfecto.",
                        "a2_imp_5_c": "سوف تدل على المستقبل."
                    },
                    "skills": ["grammar"],
                    "difficulty": 1,
                    "targetVocab": ["antes"],
                    "scoring": {"mode": "all_or_nothing"}
                },
                {
                    "id": "a2_imp_6_speak",
                    "type": "speak_with_text",
                    "instructionAr": "انطق الجملة بصوت معبر عن ذكريات الطفولة.",
                    "stemEs": "Cuando era niño, jugaba en la calle.",
                    "stemAr": "عندما كنتُ طفلاً، كنتُ ألعب في الشارع.",
                    "answerKey": {
                        "referenceAudioKey": "pending/a2-imp-speak-1",
                        "modelAnswer": "Cuando era niño, jugaba en la calle."
                    },
                    "explanationAr": "ركز على سلاسة الربط بين الكلمات ونطق ll في calle كنطق الياء المشددة الخفيفة.",
                    "skills": ["speaking", "pronunciation"],
                    "difficulty": 2,
                    "targetVocab": ["era"],
                    "scoring": {
                        "mode": "rubric",
                        "rubric": [
                            {"labelAr": "وضوح era", "weight": 50, "code": "pron_era"},
                            {"labelAr": "نطق ll في calle", "weight": 50, "code": "pron_calle"}
                        ]
                    }
                }
            ],
            "review": {
                "status": "draft",
                "authors": ["فريق المنهج — استخراج تربوي من سلسلة Aula Plus 2 وEn Vocabulario"],
                "spanishReviewer": None,
                "translationReviewer": None,
                "reviewedAt": None,
                "notes": "الدرس يقدم زمن Imperfecto للمتعلم العربي عبر الربط مع بنية (كان + مضارع) ويبسط الشواذ الثلاثة."
            }
        }
    },
    {
        "dir": "content/drafts/a2",
        "file": "lesson-a2-indefinido-vs-imperfecto.json",
        "lesson": {
            "slug": "a2-indefinido-vs-imperfecto",
            "titleAr": "التفريق الحاسم في الماضي: Indefinido مقابل Imperfecto",
            "level": "A2",
            "programSlug": "main-track",
            "unitSlug": "a2-u2-past",
            "objectiveAr": "أن يفرّق المتعلم بين استخدام الماضي البسيط للوقائع القاطعة والماضي المستمر للخلفية والوصف والأنشطة المتزامنة، ويستخدمهما معًا في جملة مركبة واحدة بنجاح.",
            "estimatedMinutes": 12,
            "skills": ["grammar", "reading", "writing", "listening", "vocabulary"],
            "newVocabulary": ["mientras", "cuando", "estudiar", "llamar", "entrar", "abrir"],
            "reviewVocabulary": ["ayer", "casa", "amigo", "tiempo"],
            "targetStructures": [
                "Acción en curso (Imperfecto) + Acción que interrumpe (Indefinido): Mientras caminaba, sonó el teléfono",
                "Descripción (Imperfecto) vs Suceso puntual (Indefinido): Hacía frío pero salí",
                "Marcadores: de repente, en ese momento"
            ],
            "grammarTopics": ["contraste-indefinido-imperfecto", "mientras-cuando-pasado"],
            "scenarios": [
                {
                    "contextAr": "رواية موقف مفاجئ وقع لصديقين أثناء المذاكرة في المكتبة الجامعية.",
                    "settingAr": "مكتبة الجامعة المركزية، فترة الامتحانات",
                    "lines": [
                        {
                            "es": "Ayer estudiaba tranquilamente en la biblioteca cuando sonó mi teléfono.",
                            "ar": "أمس بينما كنتُ أذاكر بهدوء في المكتبة رنّ هاتفي فجأة.",
                            "arEg": "امبارح كنت بذاكر في هدوء في المكتبة فجأة موبايلي رن.",
                            "audioKey": "pending/a2-diff-biblio-1"
                        },
                        {
                            "es": "Hacía mucho frío fuera, pero dentro el ambiente era agradable.",
                            "ar": "كان الجو باردًا جدًا في الخارج، لكن الجو بالداخل كان لطيفًا.",
                            "arEg": "الجو كان برد أوي برة، بس جوة كان حلو.",
                            "audioKey": "pending/a2-diff-biblio-2"
                        },
                        {
                            "es": "¿Y quién te llamó por teléfono?",
                            "ar": "ومن الذي اتصل بك هاتفيًا؟",
                            "arEg": "ومين اللي كلمك في التليفون؟",
                            "audioKey": "pending/a2-diff-biblio-3"
                        },
                        {
                            "es": "Fue mi madre para avisarme de que venía a visitarme a Madrid.",
                            "ar": "كانت والدتي لتخبرني بأنها قادمة لزيارتي في مدريد.",
                            "arEg": "كانت أمي عشان تقولي إنها جاية تزورني في مدريد.",
                            "audioKey": "pending/a2-diff-biblio-4"
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
                    "id": "a2_diff_1_listen",
                    "type": "listen_choose",
                    "instructionAr": "استمع واختر الحدث القاطع المفاجئ الذي قطع المذاكرة في المكتبة.",
                    "audioKey": "pending/a2-diff-biblio-1",
                    "speechEs": "Ayer estudiaba tranquilamente en la biblioteca cuando sonó mi teléfono.",
                    "options": [
                        {"id": "a2_diff_1_a", "text": "Sonó el teléfono", "isCorrect": True, "textAr": "رنين الهاتف"},
                        {"id": "a2_diff_1_b", "text": "Llegó el profesor", "isCorrect": False, "textAr": "وصول الأستاذ", "distractorRationaleAr": "لم يذكر الأستاذ في الجملة."},
                        {"id": "a2_diff_1_c", "text": "Empezó a llover", "isCorrect": False, "textAr": "بدء المطر", "distractorRationaleAr": "ذكر البرد فقط ولم يذكر المطر."}
                    ],
                    "answerKey": {"correctOptionIds": ["a2_diff_1_a"]},
                    "explanationAr": "الحدث المستمر كخلفية جاء في صيغة imperfecto: «estudiaba»، بينما الحدث المفاجئ القاطع جاء في صيغة indefinido: «sonó mi teléfono».",
                    "errorFeedback": {
                        "a2_diff_1_b": "الأستاذ لم يذكر في المقطع.",
                        "a2_diff_1_c": "لم يذكر بدء المطر بل رنين الهاتف."
                    },
                    "skills": ["listening"],
                    "difficulty": 1,
                    "targetVocab": ["cuando"],
                    "scoring": {"mode": "all_or_nothing"}
                },
                {
                    "id": "a2_diff_2_concept",
                    "type": "word_choice",
                    "instructionAr": "في أي زمن نضع الحدث القاطع المفاجئ الذي يقطع حدثاً مستمرًا في الماضي؟",
                    "options": [
                        {"id": "a2_diff_2_a", "text": "Pretérito Indefinido", "isCorrect": True, "textAr": "الماضي البسيط"},
                        {"id": "a2_diff_2_b", "text": "Pretérito Imperfecto", "isCorrect": False, "textAr": "الماضي المستمر", "distractorRationaleAr": "Imperfecto هو الحدث الممتد في الخلفية الذي تعرض للقطع."},
                        {"id": "a2_diff_2_c", "text": "Futuro Simple", "isCorrect": False, "textAr": "المستقبل البسيط", "distractorRationaleAr": "المستقبل لا علاقة له بالسرد الماضي."}
                    ],
                    "answerKey": {"correctOptionIds": ["a2_diff_2_a"]},
                    "explanationAr": "القاعدة الذهبية في السرد الإسباني: الحدث الممتد في الخلفية = Imperfecto، والحدث القاطع المفاجئ = Indefinido.",
                    "errorFeedback": {
                        "a2_diff_2_b": "Imperfecto هو الحدث الذي كان جارياً في الخلفية.",
                        "a2_diff_2_c": "المستقبل غير صالح لسرد الماضي."
                    },
                    "skills": ["grammar"],
                    "difficulty": 1,
                    "targetVocab": ["cuando"],
                    "scoring": {"mode": "all_or_nothing"}
                },
                {
                    "id": "a2_diff_3_fill_context",
                    "type": "fill_blank",
                    "instructionAr": "أكمل الفراغ بالفعل المناسب للحدث القاطع: «بينما كنت أسير، رأيتُ علي».",
                    "stemEs": "Mientras yo caminaba por la calle, ____ a Ali.",
                    "stemAr": "بينما كنتُ أمشي في الشارع، رأيتُ علي.",
                    "answerKey": {
                        "accepted": ["vi"],
                        "caseSensitive": False
                    },
                    "explanationAr": "«caminaba» حدث ممتد في صيغة Imperfecto، ورؤية علي حدث نقطي مفاجئ قاطع يوضع في Indefinido: vi.",
                    "errorFeedback": {
                        "veía": "veía تدل على رؤية ممتدة كخلفية.",
                        "veo": "veo مضارع والسياق ماضٍ."
                    },
                    "skills": ["grammar", "writing"],
                    "difficulty": 2,
                    "targetVocab": ["mientras"],
                    "scoring": {"mode": "all_or_nothing"}
                },
                {
                    "id": "a2_diff_4_weather_desc",
                    "type": "fill_blank",
                    "instructionAr": "أكمل الفراغ بفعل الطقس كخلفية مشهدية: «كان الجو مشمسًا عندما خرجنا».",
                    "stemEs": "____ mucho sol cuando salimos de casa.",
                    "stemAr": "كان الجو مشمسًا جدًا عندما خرجنا من المنزل.",
                    "answerKey": {
                        "accepted": ["Hacía", "hacía"],
                        "caseSensitive": False
                    },
                    "explanationAr": "وصف الطقس هو خلفية مشهدية للموقف، وكل ما يصف المسرح المكاني والزماني يوضع في Imperfecto: Hacía sol.",
                    "errorFeedback": {
                        "Hizo": "Hizo لا تستخدم لوصف مسرح الأحداث في هذه التراكيب.",
                        "Hace": "Hace مضارع والسياق ماضٍ."
                    },
                    "skills": ["grammar", "writing"],
                    "difficulty": 2,
                    "targetVocab": ["cuando"],
                    "scoring": {"mode": "all_or_nothing"}
                },
                {
                    "id": "a2_diff_5_sentence_order",
                    "type": "word_order",
                    "instructionAr": "رتّب الكلمات لتكوين جملة سليمة تجمع بين الزمنين.",
                    "items": [
                        {"id": "a2_diff_t1", "kind": "token", "text": "Mientras"},
                        {"id": "a2_diff_t2", "kind": "token", "text": "dormía,"},
                        {"id": "a2_diff_t3", "kind": "token", "text": "alguien"},
                        {"id": "a2_diff_t4", "kind": "token", "text": "llamó"},
                        {"id": "a2_diff_t5", "kind": "token", "text": "a la puerta."}
                    ],
                    "answerKey": {
                        "accepted": ["Mientras dormía, alguien llamó a la puerta."],
                        "tokenOrder": ["a2_diff_t1", "a2_diff_t2", "a2_diff_t3", "a2_diff_t4", "a2_diff_t5"]
                    },
                    "explanationAr": "الترتيب الصحيح: Mientras dormía (الحدث المستمر بالماضي المستمر)، ثم alguien llamó a la puerta (الحدث القاطع بالماضي البسيط).",
                    "skills": ["writing", "grammar"],
                    "difficulty": 3,
                    "targetVocab": ["mientras", "llamar"],
                    "scoring": {"mode": "all_or_nothing"}
                },
                {
                    "id": "a2_diff_6_speak",
                    "type": "speak_with_text",
                    "instructionAr": "انطق الجملة بصوت سردي مميز.",
                    "stemEs": "Estudiaba cuando sonó el teléfono.",
                    "stemAr": "كنتُ أذاكر عندما رنّ الهاتف.",
                    "answerKey": {
                        "referenceAudioKey": "pending/a2-diff-speak-1",
                        "modelAnswer": "Estudiaba cuando sonó el teléfono."
                    },
                    "explanationAr": "انطق estudiaba بنبر هادئ، واجعل النبرة قوية في sonó على حرف ó لإبراز عنصر المفاجأة في السرد.",
                    "skills": ["speaking", "pronunciation"],
                    "difficulty": 2,
                    "targetVocab": ["cuando"],
                    "scoring": {
                        "mode": "rubric",
                        "rubric": [
                            {"labelAr": "النبر على sonó في مقطع ó", "weight": 50, "code": "stress_sono"},
                            {"labelAr": "سلاسة نطق estudiaba", "weight": 50, "code": "fluency_estudiaba"}
                        ]
                    }
                }
            ],
            "review": {
                "status": "draft",
                "authors": ["فريق المنهج — استخراج تربوي من سلسلة Aula Plus 2 وEn Vocabulario"],
                "spanishReviewer": None,
                "translationReviewer": None,
                "reviewedAt": None,
                "notes": "الدرس يحسم العقدة الكبرى لدى دارسي الإسبانية: التفريق بين Indefinido و Imperfecto بنظرية (الخلفية والشرارة)."
            }
        }
    }
]
