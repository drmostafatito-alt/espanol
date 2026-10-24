#!/usr/bin/env python3
"""
tools/books/generate_integrated_lessons.py
Generates 16 platform-native interactive lessons based directly on pedagogical topics
extracted from authentic Spanish curriculum books (Aula Plus 1..7, Aula Internacional 1..6, Sueña 1..3, En Vocabulario B1).

Levels covered:
  - A2 (a2-u2-past): 4 lessons on Past tenses (Indefinido regular/irregular, Imperfecto, Indefinido vs Imperfecto)
  - B1 (b1-u2-opinions): 4 lessons on Subjunctive, Opinions, and Por vs Para
  - B2 (b2-u1-argument): 4 lessons on Hypothetical Conditionals (Si + Imp. Subj.) and Discourse Connectors
  - C1 (c1-u1-style): 4 lessons on Advanced Stylistic Precision, Nominalization, Idioms, and Formal Writing
"""

import json
import os
import sys
from pathlib import Path

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")

ROOT = Path(__file__).resolve().parent.parent.parent

LESSONS = [
    # =========================================================================
    # A2: Unit a2-u2-past (الحكاية في الماضي)
    # =========================================================================
    {
        "dir": "content/drafts/a2",
        "filename": "lesson-a2-indefinido-regular.json",
        "lesson": {
            "slug": "a2-indefinido-regular",
            "titleAr": "الماضي البسيط: تصريف الأفعال المنتظمة",
            "level": "A2",
            "programSlug": "main-track",
            "unitSlug": "a2-u2-past",
            "objectiveAr": "أن يصرّف المتعلم أفعال المجموعات الثلاث (-ar, -er, -ir) في الماضي البسيط (Indefinido) مع ضمائر الفاعل المختلفة، ويستخدم الظروف الزمنية الدالة على الماضي المنتهي بدقة.",
            "estimatedMinutes": 11,
            "skills": ["grammar", "reading", "writing", "listening", "vocabulary"],
            "newVocabulary": ["ayer", "anoche", "viajar", "visitar", "comer", "vivir", "escribir"],
            "reviewVocabulary": ["hola", "semana", "año", "amigo"],
            "targetStructures": [
                "hablé, hablaste, habló, hablamos, hablasteis, hablaron (-ar)",
                "comí, comiste, comió, comimos, comisteis, comieron (-er / -ir)",
                "Marcadores: ayer, anoche, la semana pasada, el año pasado, en 2022"
            ],
            "grammarTopics": ["preterito-indefinido-regular", "marcadores-temporales-pasado"],
            "scenarios": [
                {
                    "contextAr": "محادثة بين صديقين في مدريد يسأل أحدهما الآخر عما فعله في عطلة نهاية الأسبوع الماضي.",
                    "settingAr": "مقهى بوسط المدينة، صباح يوم الاثنين",
                    "lines": [
                        {
                            "es": "¡Hola, Tariq! ¿Qué hiciste el fin de semana?",
                            "ar": "مرحبًا يا طارق! ماذا فعلت في عطلة نهاية الأسبوع؟",
                            "arEg": "أهلًا يا طارق! عملت إيه في الويك إند؟",
                            "audioKey": "pending/a2-indef-tariq-1"
                        },
                        {
                            "es": "El sábado viajé a Toledo y visité la mezquita del Cristo de la Luz.",
                            "ar": "يوم السبت سافرتُ إلى طليطلة وزرتُ مسجد باب المردوم (كريستو دي لا لوث).",
                            "arEg": "يوم السبت سافرت طليطلة وزرت مسجد باب المردوم.",
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
                "minCorrectExercises": 6,
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
                    "speechEs": "El sábado viajé a Toledo y visité la mezquita del Cristo de la Luz.",
                    "options": [
                        {"id": "a2_indreg_1_a", "text": "Toledo", "isCorrect": True, "textAr": "طليطلة"},
                        {"id": "a2_indreg_1_b", "text": "Madrid", "isCorrect": False, "textAr": "مدريد", "distractorRationaleAr": "مدريد هي المدينة التي يقيم فيها وعاد إليها، لا وجهة الرحلة."},
                        {"id": "a2_indreg_1_c", "text": "Granada", "isCorrect": False, "textAr": "غرناطة", "distractorRationaleAr": "لم تُذكر غرناطة في التسجيل مطلقًا."}
                    ],
                    "answerKey": {"correctOptionIds": ["a2_indreg_1_a"]},
                    "explanationAr": "قال المتحدث صراحة: «El sábado viajé a Toledo» (يوم السبت سافرتُ إلى طليطلة). الفعل viajé مصرف في الماضي البسيط للمتكلم (yo).",
                    "errorFeedback": {
                        "a2_indreg_1_b": "مدريد هي مكان انطلاق الرحلة والعودة إليها، وليست الوجهة.",
                        "a2_indreg_1_c": "غرناطة لم تُذكر في الحوار."
                    },
                    "skills": ["listening", "vocabulary"],
                    "difficulty": 1,
                    "targetVocab": ["viajar", "ayer"],
                    "scoring": {"mode": "all_or_nothing"}
                },
                {
                    "id": "a2_indreg_2_choice",
                    "type": "word_choice",
                    "instructionAr": "اختر التصريف الصحيح للفعل hablar في الماضي مع الضمير yo.",
                    "options": [
                        {"id": "a2_indreg_2_a", "text": "hablé", "isCorrect": True, "textAr": "تحدثتُ (أنا)"},
                        {"id": "a2_indreg_2_b", "text": "habló", "isCorrect": False, "textAr": "تحدث هو / هي", "distractorRationaleAr": "habló تنتهي بنبرة ó وهي للمفرد الغائب (él/ella)، بينما للمتكلم نستخدم é."},
                        {"id": "a2_indreg_2_c", "text": "hablo", "isCorrect": False, "textAr": "أتحدثُ (مضارع)", "distractorRationaleAr": "hablo بدون نبرة هي صيغة المضارع الحاضر (Presente) وليست ماضيًا."},
                        {"id": "a2_indreg_2_d", "text": "hablaste", "isCorrect": False, "textAr": "تحدثتَ أنت", "distractorRationaleAr": "hablaste خاصة بالمخاطب المفرد (tú)."}
                    ],
                    "answerKey": {"correctOptionIds": ["a2_indreg_2_a"]},
                    "explanationAr": "أفعال المجموعة الأولى (-ar) تأخذ النهاية -é مع الضمير yo في الماضي البسيط: hablé (تحدثتُ). انتبه لوجود النبرة المكتوبة (tilde) لأن كلمة hablo تعني (أتحدث الآن).",
                    "errorFeedback": {
                        "a2_indreg_2_b": "habló للغائب (هو تحدث)، أما أنا فتأخذ hablé.",
                        "a2_indreg_2_c": "hablo في المضارع. في الماضي للمتكلم نقول hablé بالهمزة المكتوبة.",
                        "a2_indreg_2_d": "hablaste للمخاطب (أنت تحدثت)."
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
                    "stemAr": "أمس نحن ____ بايا (باييلا) في مطعم بلنسي.",
                    "options": [
                        {"id": "a2_indreg_3_a", "text": "comimos", "isCorrect": True, "textAr": "أكلنا"},
                        {"id": "a2_indreg_3_b", "text": "comieron", "isCorrect": False, "textAr": "أكلوا", "distractorRationaleAr": "comieron للغائبين (ellos/ellas)، ومع nosotros نستخدم comimos."},
                        {"id": "a2_indreg_3_c", "text": "comemos", "isCorrect": False, "textAr": "نأكل (مضارع)", "distractorRationaleAr": "comemos مضارع، وفي الماضي لأفعال -er تصبح النهاية -imos: comimos."},
                        {"id": "a2_indreg_3_d", "text": "comió", "isCorrect": False, "textAr": "أكل هو", "distractorRationaleAr": "comió للمفرد الغائب."}
                    ],
                    "answerKey": {"correctOptionIds": ["a2_indreg_3_a"]},
                    "explanationAr": "أفعال المجموعة الثانية والثالثة (-er, -ir) تأخذ النهاية -imos مع nosotros في الماضي البسيط: comimos (أكلنا)، vivimos (عشنا).",
                    "errorFeedback": {
                        "a2_indreg_3_b": "comieron مع هم (ellos/ellas).",
                        "a2_indreg_3_c": "comemos مضارع لأفعال -er. في الماضي تصبح comimos.",
                        "a2_indreg_3_d": "comió للمفرد (él/ella)."
                    },
                    "skills": ["grammar", "writing"],
                    "difficulty": 2,
                    "targetVocab": ["comer", "ayer"],
                    "scoring": {"mode": "all_or_nothing"}
                },
                {
                    "id": "a2_indreg_4_fill_vivir",
                    "type": "fill_blank",
                    "instructionAr": "أكمل الجملة بتصريف الفعل vivir في الماضي مع الضمير ellos.",
                    "stemEs": "El año pasado mis primos ____ en Granada.",
                    "stemAr": "العام الماضي أبناء عمي ____ في غرناطة.",
                    "options": [
                        {"id": "a2_indreg_4_a", "text": "vivieron", "isCorrect": True, "textAr": "عاشوا"},
                        {"id": "a2_indreg_4_b", "text": "vivió", "isCorrect": False, "textAr": "عاش هو", "distractorRationaleAr": "الفاعل جمع (mis primos = ellos)، لذا يلزم صيغة الجمع vivieron."},
                        {"id": "a2_indreg_4_c", "text": "vivisteis", "isCorrect": False, "textAr": "عشتم أنتم", "distractorRationaleAr": "vivisteis للمخاطبين الجمع في إسبانيا (vosotros)."},
                        {"id": "a2_indreg_4_d", "text": "viven", "isCorrect": False, "textAr": "يعيشون (مضارع)", "distractorRationaleAr": "viven مضارع، والمحدد الزمني هو el año pasado (العام الماضي)."}
                    ],
                    "answerKey": {"correctOptionIds": ["a2_indreg_4_a"]},
                    "explanationAr": "مع الفاعل الجمع الغائب (mis primos = ellos) لأفعال المجموعة الثالثة (-ir)، النهاية هي -ieron: vivieron (عاشوا).",
                    "errorFeedback": {
                        "a2_indreg_4_b": "الفاعل جمع (mis primos) وليس مفرداً.",
                        "a2_indreg_4_c": "vivisteis للمخاطب (vosotros).",
                        "a2_indreg_4_d": "الجملة تتحدث عن الماضي (El año pasado)."
                    },
                    "skills": ["grammar"],
                    "difficulty": 2,
                    "targetVocab": ["vivir"],
                    "scoring": {"mode": "all_or_nothing"}
                },
                {
                    "id": "a2_indreg_5_marker",
                    "type": "word_choice",
                    "instructionAr": "أيّ من هذه العبارات يُعتبر ظرفًا زمنيًا خاصًا بالماضي المنتهي (Pretérito Indefinido)؟",
                    "options": [
                        {"id": "a2_indreg_5_a", "text": "anoche", "isCorrect": True, "textAr": "البارحة ليلاً"},
                        {"id": "a2_indreg_5_b", "text": "ahora", "isCorrect": False, "textAr": "الآن", "distractorRationaleAr": "ahora تدل على الحاضر والمضارع المستمر."},
                        {"id": "a2_indreg_5_c", "text": "mañana", "isCorrect": False, "textAr": "غدًا", "distractorRationaleAr": "mañana تدل على المستقبل."},
                        {"id": "a2_indreg_5_d", "text": "siempre", "isCorrect": False, "textAr": "دائمًا", "distractorRationaleAr": "siempre تدل على التكرار والعادة وغالبًا تأتي مع المضارع أو Imperfecto."}
                    ],
                    "answerKey": {"correctOptionIds": ["a2_indreg_5_a"]},
                    "explanationAr": "ظرف الزمان «anoche» (الليلة الماضية/البارحة) يحدد فترة زمنية انقضت تماماً ومفصولة عن الحاضر، ولذلك يقترن بالماضي البسيط (Indefinido).",
                    "errorFeedback": {
                        "a2_indreg_5_b": "ahora تدل على اللحظة الراهنة.",
                        "a2_indreg_5_c": "mañana ظرف مستقبل.",
                        "a2_indreg_5_d": "siempre ظرف تكرار لا يحدد حدثاً منتهياً بعينه."
                    },
                    "skills": ["vocabulary", "grammar"],
                    "difficulty": 1,
                    "targetVocab": ["anoche", "ayer"],
                    "scoring": {"mode": "all_or_nothing"}
                },
                {
                    "id": "a2_indreg_6_speak",
                    "type": "speak_with_text",
                    "instructionAr": "انطق الجملة بصوت واضح مع مراعاة النبرة على حرف é في viajé.",
                    "stemEs": "Ayer viajé a Toledo.",
                    "stemAr": "أمس سافرتُ إلى طليطلة.",
                    "answerKey": {
                        "referenceAudioKey": "pending/a2-indef-tariq-2",
                        "modelAnswer": "Ayer viajé a Toledo."
                    },
                    "explanationAr": "احرص على نطق حرف j في viajé بصوت الخاء العربية الصريحة [x]، مع وضع نبرة قوية وواضحة على المقطع الأخير -jé لوجود علامة النبرة (tilde).",
                    "skills": ["speaking", "pronunciation"],
                    "difficulty": 2,
                    "targetVocab": ["viajar", "ayer"],
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
        "filename": "lesson-a2-indefinido-irregular.json",
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
                            "es": "¿Dónde estuviste el domingo, Laura?",
                            "ar": "أين كنتِ يوم الأحد يا لاورا؟",
                            "arEg": "كنتِ فين يوم الحد يا لاورا؟",
                            "audioKey": "pending/a2-irreg-laura-1"
                        },
                        {
                            "es": "Estuve en casa de mis padres. Tuvimos una comida familiar maravillosa.",
                            "ar": "كنتُ في منزل والديّ. تناولنا وجبة عائلية رائعة.",
                            "arEg": "كنت عند أهلي. اتغدينا غدوة عائلية تحفة.",
                            "audioKey": "pending/a2-irreg-laura-2"
                        },
                        {
                            "es": "¿Y qué hiciste después de comer?",
                            "ar": "وماذا فعلتِ بعد تناول الطعام؟",
                            "arEg": "وعملتِ إيه بعد الأكل؟",
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
                "minCorrectExercises": 6,
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
                        {"id": "a2_indirreg_1_c", "text": "A la mezquita", "isCorrect": False, "textAr": "إلى المسجد", "distractorRationaleAr": "لم يُذكر المسجد في هذا الحوار."}
                    ],
                    "answerKey": {"correctOptionIds": ["a2_indirreg_1_a"]},
                    "explanationAr": "قالت لاورا: «Fui al cine con mi hermano» (ذهبتُ إلى السينما مع أخي). الفعل fui هنا مشتق من ir بمعنى ذهب.",
                    "errorFeedback": {
                        "a2_indirreg_1_b": "لاورا لم تذكر الشاطئ إطلاقًا.",
                        "a2_indirreg_1_c": "المسجد ذُكر في درس طليطلة السابق وليس في هذا الحوار."
                    },
                    "skills": ["listening"],
                    "difficulty": 1,
                    "targetVocab": ["fui"],
                    "scoring": {"mode": "all_or_nothing"}
                },
                {
                    "id": "a2_indirreg_2_ser_vs_ir",
                    "type": "word_choice",
                    "instructionAr": "في الجملة: «La película fue muy divertida»، ما هو أصل الفعل fue؟",
                    "options": [
                        {"id": "a2_indirreg_2_a", "text": "فعل الكينونة ser (كان)", "isCorrect": True, "textAr": "كان (من ser)"},
                        {"id": "a2_indirreg_2_b", "text": "فعل الذهاب ir (ذهب)", "isCorrect": False, "textAr": "ذهب (من ir)", "distractorRationaleAr": "الفيلم لا يذهب، بل يُوصف بأنه كان مسليًا؛ لذا fue هنا من ser."},
                        {"id": "a2_indirreg_2_c", "text": "فعل التواجد estar", "isCorrect": False, "textAr": "تواجد (من estar)", "distractorRationaleAr": "ماضي estar هو estuvo وليس fue."}
                    ],
                    "answerKey": {"correctOptionIds": ["a2_indirreg_2_a"]},
                    "explanationAr": "في اللغة الإسبانية يشترك الفعلان ser و ir في نفس التصريف تمامًا في الماضي البسيط (fui, fuiste, fue...)، والسياق هو الفيصل: «fue divertida» صفة تعني (كان الفيلم مسليًا)، لذا هو من فعل ser.",
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
                    "options": [
                        {"id": "a2_indirreg_3_a", "text": "estuve", "isCorrect": True, "textAr": "كنتُ (حالة مرضية)"},
                        {"id": "a2_indirreg_3_b", "text": "estuvo", "isCorrect": False, "textAr": "كان هو", "distractorRationaleAr": "estuvo للمفرد الغائب، ومع yo نستخدم estuve."},
                        {"id": "a2_indirreg_3_c", "text": "estaba", "isCorrect": False, "textAr": "كنتُ (imperfecto)", "distractorRationaleAr": "estaba في الماضي المستمر، والمطلوب هنا صيغة الماضي البسيط Indefinido مع ayer."},
                        {"id": "a2_indirreg_3_d", "text": "fui", "isCorrect": False, "textAr": "كنت (من ser)", "distractorRationaleAr": "المرض حالة مؤقتة تأخذ estar (estuve enfermo) ولا تأخذ ser (fui enfermo)."}
                    ],
                    "answerKey": {"correctOptionIds": ["a2_indirreg_3_a"]},
                    "explanationAr": "فعل estar شاذ في الماضي ويتحول جذره إلى estuv- مع نهايات غير منبورة: yo estuve, tú estuviste, él estuvo. ولأن المرض حالة مؤقتة نستخدم estar حصراً: estuve enfermo.",
                    "errorFeedback": {
                        "a2_indirreg_3_b": "estuvo خاصة بـ él/ella.",
                        "a2_indirreg_3_c": "estaba في صيغة imperfecto.",
                        "a2_indirreg_3_d": "لا نستخدم ser مع الحالات المؤقتة مثل المرض."
                    },
                    "skills": ["grammar", "writing"],
                    "difficulty": 2,
                    "targetVocab": ["estuve", "ayer"],
                    "scoring": {"mode": "all_or_nothing"}
                },
                {
                    "id": "a2_indirreg_4_fill_hacer",
                    "type": "fill_blank",
                    "instructionAr": "أكمل الفراغ بتصريف فعل hacer مع الضمير él مع الانتباه لتغير حرف c إلى z.",
                    "stemEs": "Carlos ____ los deberes anoche.",
                    "stemAr": "كارلوس ____ الواجبات البارحة ليلاً.",
                    "options": [
                        {"id": "a2_indirreg_4_a", "text": "hizo", "isCorrect": True, "textAr": "فعلَ / عملَ"},
                        {"id": "a2_indirreg_4_b", "text": "hico", "isCorrect": False, "textAr": "خطأ إملائي", "distractorRationaleAr": "في الإسبانية حرف c أمام o ينطق كافاً [k]، لذا يجب استبداله بـ z ليظل صوته ثاءً [θ] أو سين: hizo."},
                        {"id": "a2_indirreg_4_c", "text": "hice", "isCorrect": False, "textAr": "فعلتُ أنا", "distractorRationaleAr": "hice مع المتكلم yo، بينما الفاعل هنا Carlos (él)."},
                        {"id": "a2_indirreg_4_d", "text": "hacía", "isCorrect": False, "textAr": "كان يفعل", "distractorRationaleAr": "hacía صيغة imperfecto وليست ماضيًا بسيطًا."}
                    ],
                    "answerKey": {"correctOptionIds": ["a2_indirreg_4_a"]},
                    "explanationAr": "جذر الفعل hacer في الماضي هو hic- (hice, hiciste)، لكن مع المفرد الغائب (él/ella) يتحول c إلى z للحفاظ على النطق الصوتي الصحيح فتكتب: hizo.",
                    "errorFeedback": {
                        "a2_indirreg_4_b": "لا توجد كلمة hico في الإسبانية؛ يكتب حرف z قبل o للحفاظ على النطق: hizo.",
                        "a2_indirreg_4_c": "hice للمتكلم (أنا فعلت).",
                        "a2_indirreg_4_d": "hacía في زمن الماضي المستمر."
                    },
                    "skills": ["grammar", "writing"],
                    "difficulty": 2,
                    "targetVocab": ["hice", "anoche"],
                    "scoring": {"mode": "all_or_nothing"}
                },
                {
                    "id": "a2_indirreg_5_fill_tener",
                    "type": "fill_blank",
                    "instructionAr": "أكمل الفراغ بتصريف فعل tener مع الضمير nosotros في الماضي البسيط.",
                    "stemEs": "El domingo nosotros ____ mucha suerte.",
                    "stemAr": "يوم الأحد نحن ____ حظاً وافراً.",
                    "options": [
                        {"id": "a2_indirreg_5_a", "text": "tuvimos", "isCorrect": True, "textAr": "كان لدينا / حالفنا"},
                        {"id": "a2_indirreg_5_b", "text": "tenemos", "isCorrect": False, "textAr": "لدينا (مضارع)", "distractorRationaleAr": "tenemos مضارع، بينما المحدد الزمني هو el domingo الماضي."},
                        {"id": "a2_indirreg_5_c", "text": "tuvieron", "isCorrect": False, "textAr": "كان لديهم", "distractorRationaleAr": "tuvieron مع هم ellos وليس nosotros."},
                        {"id": "a2_indirreg_5_d", "text": "teníamos", "isCorrect": False, "textAr": "كان لدينا (imperfecto)", "distractorRationaleAr": "teníamos في الماضي المستمر."}
                    ],
                    "answerKey": {"correctOptionIds": ["a2_indirreg_5_a"]},
                    "explanationAr": "فعل tener يتحول جذره في الماضي البسيط إلى tuv- ومعه النهاية -imos للضمير nosotros: tuvimos mucha suerte (حالفنا حظ كبير).",
                    "errorFeedback": {
                        "a2_indirreg_5_b": "tenemos مضارع حاضر.",
                        "a2_indirreg_5_c": "tuvieron للغائب الجمع.",
                        "a2_indirreg_5_d": "teníamos في زمن imperfecto."
                    },
                    "skills": ["grammar"],
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
                        "referenceAudioKey": "pending/a2-irreg-laura-4",
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
        "filename": "lesson-a2-imperfecto-habitos.json",
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
                            "es": "Por las tardes jugábamos al fútbol en la plaza y no teníamos teléfonos móviles.",
                            "ar": "وفي فترات ما بعد الظهر كنا نلعب كرة القدم في الساحة ولم تكن لدينا هواتف محمولة.",
                            "arEg": "وبعد الظهر كنا بنلعب كورة في الميدان وماكنش معانا موبايلات.",
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
                "minCorrectExercises": 6,
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
                        {"id": "a2_imp_1_c", "text": "En bicicleta", "isCorrect": False, "textAr": "بالدراجة", "distractorRationaleAr": "لم تذكر الدراجة في النص."}
                    ],
                    "answerKey": {"correctOptionIds": ["a2_imp_1_a"]},
                    "explanationAr": "قال الأستاذ: «Todos los días iba a la escuela a pie» أي مشياً على الأقدام. الفعل iba يعبر عن عادة ماضية متكررة.",
                    "errorFeedback": {
                        "a2_imp_1_b": "لم يقل autobús بل a pie.",
                        "a2_imp_1_c": "لم تذكر الدراجة في كلام الأستاذ."
                    },
                    "skills": ["listening"],
                    "difficulty": 1,
                    "targetVocab": ["iba"],
                    "scoring": {"mode": "all_or_nothing"}
                },
                {
                    "id": "a2_imp_2_irregulars",
                    "type": "word_choice",
                    "instructionAr": "كم عدد الأفعال الشاذة في زمن الماضي المستمر (Pretérito Imperfecto) في كل اللغة الإسبانية؟",
                    "options": [
                        {"id": "a2_imp_2_a", "text": "3 أفعال فقط (ser, ir, ver)", "isCorrect": True, "textAr": "3 أفعال فقط"},
                        {"id": "a2_imp_2_b", "text": "أكثر من 50 فعلاً", "isCorrect": False, "textAr": "أكثر من 50 فعلاً", "distractorRationaleAr": "هذا ينطبق على الماضي البسيط Indefinido وليس Imperfecto المنتظم جداً."},
                        {"id": "a2_imp_2_c", "text": "لا يوجد أي فعل شاذ", "isCorrect": False, "textAr": "صفر أفعال", "distractorRationaleAr": "توجد ثلاثة أفعال شاذة مشهورة."}
                    ],
                    "answerKey": {"correctOptionIds": ["a2_imp_2_a"]},
                    "explanationAr": "من أروع ميزات زمن Imperfecto في الإسبانية أنه شديد الانتظام؛ لا يوجد في اللغة بأكملها سوى 3 أفعال شاذة فقط: ser (era), ir (iba), ver (veía).",
                    "errorFeedback": {
                        "a2_imp_2_b": "الماضي البسيط هو الذي يمتلك شواذ كثيرة، أما Imperfecto فلديه 3 فقط.",
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
                    "stemAr": "عندما كنا أطفالاً، كنا ____ كرة القدم في الساحة.",
                    "options": [
                        {"id": "a2_imp_3_a", "text": "jugábamos", "isCorrect": True, "textAr": "كنا نلعب"},
                        {"id": "a2_imp_3_b", "text": "jugamos", "isCorrect": False, "textAr": "لعبنا (مرة واحدة)", "distractorRationaleAr": "jugamos تدل على حدث واحد منتهٍ، بينما «De niños» تدل على عادة مستمرة."},
                        {"id": "a2_imp_3_c", "text": "jugaban", "isCorrect": False, "textAr": "كانوا يلعبون", "distractorRationaleAr": "jugaban مع ellos وليس nosotros."},
                        {"id": "a2_imp_3_d", "text": "jugaba", "isCorrect": False, "textAr": "كنت ألعب (مفرد)", "distractorRationaleAr": "الفاعل جمع نحن nosotros."}
                    ],
                    "answerKey": {"correctOptionIds": ["a2_imp_3_a"]},
                    "explanationAr": "أفعال -ar تأخذ النهايات -aba, -abas, -aba, -ábamos... ومع nosotros توضع نبرة مكتوبة دائمًا على ألف المقطع: jugábamos.",
                    "errorFeedback": {
                        "a2_imp_3_b": "jugamos ماضٍ بسيط يعبر عن مرة واحدة وليس عادة مستمرة في الطفولة.",
                        "a2_imp_3_c": "jugaban لضمير الغائبين.",
                        "a2_imp_3_d": "الفاعل جمع nosotros."
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
                    "stemAr": "في السابق كنتُ ____ في قرية صغيرة.",
                    "options": [
                        {"id": "a2_imp_4_a", "text": "vivía", "isCorrect": True, "textAr": "كنتُ أعيش"},
                        {"id": "a2_imp_4_b", "text": "viví", "isCorrect": False, "textAr": "عشتُ (مرة واحدة)", "distractorRationaleAr": "viví ماضٍ بسيط منتهٍ، أما مع antes (سابقاً كحالة ممتدة) نستخدم vivía."},
                        {"id": "a2_imp_4_c", "text": "vivo", "isCorrect": False, "textAr": "أعيش (مضارع)", "distractorRationaleAr": "vivo مضارع حاضر ولا يتوافق مع الظرف antes."},
                        {"id": "a2_imp_4_d", "text": "vivías", "isCorrect": False, "textAr": "كنتَ تعيش أنت", "distractorRationaleAr": "vivías مع الضمير tú."}
                    ],
                    "answerKey": {"correctOptionIds": ["a2_imp_4_a"]},
                    "explanationAr": "أفعال المجموعتين -er و -ir تأخذ النهاية -ía مع نبرة مكتوبة دائمة: vivía, comía, tenía. وهي تعادل في العربية تمامًا تركيب: «كنتُ + أفعل».",
                    "errorFeedback": {
                        "a2_imp_4_b": "viví للماضي القاطع المنتهي.",
                        "a2_imp_4_c": "vivo في الحاضر.",
                        "a2_imp_4_d": "vivías للمخاطب أنت."
                    },
                    "skills": ["grammar"],
                    "difficulty": 2,
                    "targetVocab": ["vivir", "antes"],
                    "scoring": {"mode": "all_or_nothing"}
                },
                {
                    "id": "a2_imp_5_arabic_bridge",
                    "type": "word_choice",
                    "instructionAr": "ما هو التركيب في اللغة العربية الذي يعادل بدقة وظيفة زمن Pretérito Imperfecto الإسباني؟",
                    "options": [
                        {"id": "a2_imp_5_a", "text": "كان + الفعل المضارع (مثل: كان يلعب، كان يعيش)", "isCorrect": True, "textAr": "كان + المضارع"},
                        {"id": "a2_imp_5_b", "text": "قد + الفعل الماضي (مثل: قد أكل)", "isCorrect": False, "textAr": "قد + الماضي", "distractorRationaleAr": "هذا يعادل Pretérito Perfecto (المضارع التام) وليس Imperfecto."},
                        {"id": "a2_imp_5_c", "text": "سوف + الفعل المضارع (مثل: سوف يسافر)", "isCorrect": False, "textAr": "المستقبل", "distractorRationaleAr": "هذا يعبر عن المستقبل Futuro."}
                    ],
                    "answerKey": {"correctOptionIds": ["a2_imp_5_a"]},
                    "explanationAr": "الجسر اللغوي الأقوى للمتعلم العربي هو أن Imperfecto يترجم دائمًا إلى «كان يفعل» أو «كان يوصف بكذا» (عادة أو خلفية وصفية مستمرة في الماضي).",
                    "errorFeedback": {
                        "a2_imp_5_b": "قد + الماضي يعادل pretérito perfecto.",
                        "a2_imp_5_c": "سوف تدل على المستقبل."
                    },
                    "skills": ["grammar"],
                    "difficulty": 1,
                    "targetVocab": ["antes", "siempre"],
                    "scoring": {"mode": "all_or_nothing"}
                },
                {
                    "id": "a2_imp_6_speak",
                    "type": "speak_with_text",
                    "instructionAr": "انطق الجملة بصوت معبر عن ذكريات الطفولة.",
                    "stemEs": "Cuando era niño, jugaba en la calle.",
                    "stemAr": "عندما كنتُ طفلاً، كنتُ ألعب في الشارع.",
                    "answerKey": {
                        "referenceAudioKey": "pending/a2-imp-prof-3",
                        "modelAnswer": "Cuando era niño, jugaba en la calle."
                    },
                    "explanationAr": "ركز على سلاسة الربط بين الكلمات ونطق ll في calle كنطق الياء المشددة الشامية أو المصرية الخفيفة [ʝ].",
                    "skills": ["speaking", "pronunciation"],
                    "difficulty": 2,
                    "targetVocab": ["era", "jugar"],
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
        "filename": "lesson-a2-indefinido-vs-imperfecto.json",
        "lesson": {
            "slug": "a2-indefinido-vs-imperfecto",
            "titleAr": "التفريق الحاسم في الماضي: Indefinido مقابل Imperfecto",
            "level": "A2",
            "programSlug": "main-track",
            "unitSlug": "a2-u2-past",
            "objectiveAr": "أن يفرّق المتعلم بين استخدام الماضي البسيط (Indefinido) للوقائع القاطعة والماضي المستمر (Imperfecto) للخلفية والوصف والأنشطة المتزامنة، ويستخدمهما معًا في جملة مركبة واحدة بنجاح.",
            "estimatedMinutes": 12,
            "skills": ["grammar", "reading", "writing", "listening", "vocabulary"],
            "newVocabulary": ["mientras", "cuando", "estudiar", "llamar", "entrar", "abrir"],
            "reviewVocabulary": ["ayer", "casa", "amigo", "tiempo"],
            "targetStructures": [
                "Acción en curso (Imperfecto) + Acción que interrumpe (Indefinido): Mientras caminaba por la calle, vi a Pedro",
                "Descripción (Imperfecto) vs Suceso puntual (Indefinido): Hacía frío pero salí",
                "Marcadores de corte: de repente, de pronto, en ese momento"
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
                            "es": "¿Y quién te llamó?",
                            "ar": "ومن الذي اتصل بك؟",
                            "arEg": "ومين اللي كلمك؟",
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
                "minCorrectExercises": 6,
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
                    "instructionAr": "عندما يقطع حدث مفاجئ حدثاً آخر كان مستمرًا في الماضي، في أي زمن نضع الحدث القاطع المفاجئ؟",
                    "options": [
                        {"id": "a2_diff_2_a", "text": "الماضي البسيط (Pretérito Indefinido)", "isCorrect": True, "textAr": "الماضي البسيط"},
                        {"id": "a2_diff_2_b", "text": "الماضي المستمر (Pretérito Imperfecto)", "isCorrect": False, "textAr": "الماضي المستمر", "distractorRationaleAr": "Imperfecto هو الحدث الممتد في الخلفية الذي تعرض للقطع، وليس القاطع."},
                        {"id": "a2_diff_2_c", "text": "المضارع التام (Pretérito Perfecto)", "isCorrect": False, "textAr": "المضارع التام", "distractorRationaleAr": "المضارع التام يتعلق بالماضي المتصل باليوم وليس لقطع الأحداث في الماضي المنتهي."}
                    ],
                    "answerKey": {"correctOptionIds": ["a2_diff_2_a"]},
                    "explanationAr": "القاعدة الذهبية في السرد الإسباني: الحدث الممتد في الخلفية (الستارة) = Imperfecto، والحدث القاطع المفاجئ (الشرارة) = Indefinido.",
                    "errorFeedback": {
                        "a2_diff_2_b": "Imperfecto هو الحدث الذي كان جارياً في الخلفية.",
                        "a2_diff_2_c": "المضارع التام لا يُستخدم في هذا التركيب السردي."
                    },
                    "skills": ["grammar"],
                    "difficulty": 1,
                    "targetVocab": ["cuando", "mientras"],
                    "scoring": {"mode": "all_or_nothing"}
                },
                {
                    "id": "a2_diff_3_fill_context",
                    "type": "fill_blank",
                    "instructionAr": "اختر الفعل المناسب للحدث القاطع: «بينما كنت أسير، رأيتُ علي».",
                    "stemEs": "Mientras yo caminaba por la calle, ____ a Ali.",
                    "stemAr": "بينما كنتُ أمشي في الشارع، ____ علي.",
                    "options": [
                        {"id": "a2_diff_3_a", "text": "vi", "isCorrect": True, "textAr": "رأيتُ (indefinido قاطع)"},
                        {"id": "a2_diff_3_b", "text": "veía", "isCorrect": False, "textAr": "كنت أرى (imperfecto مستمر)", "distractorRationaleAr": "الرؤية هنا حدث مفاجئ وقع في لحظة محددة، لذا يلزم الماضي البسيط vi."},
                        {"id": "a2_diff_3_c", "text": "veo", "isCorrect": False, "textAr": "أرى (مضارع)", "distractorRationaleAr": "الجملة تسرد أحداثاً في الماضي."},
                        {"id": "a2_diff_3_d", "text": "visto", "isCorrect": False, "textAr": "اسم مفعول غير مصرف", "distractorRationaleAr": "visto اسم مفعول يحتاج فعل مساعد."}
                    ],
                    "answerKey": {"correctOptionIds": ["a2_diff_3_a"]},
                    "explanationAr": "«caminaba» (كنت أمشي) حدث ممتد في صيغة Imperfecto، ورؤية علي حدث نقطي مفاجئ قاطع يوضع في Indefinido: vi.",
                    "errorFeedback": {
                        "a2_diff_3_b": "veía تدل على رؤية ممتدة كخلفية، والموقف هنا مصادفة قاطعة.",
                        "a2_diff_3_c": "veo مضارع والسياق ماضٍ.",
                        "a2_diff_3_d": "visto ليس فعلاً مصرفاً."
                    },
                    "skills": ["grammar", "writing"],
                    "difficulty": 2,
                    "targetVocab": ["mientras"],
                    "scoring": {"mode": "all_or_nothing"}
                },
                {
                    "id": "a2_diff_4_weather_desc",
                    "type": "fill_blank",
                    "instructionAr": "اختر الفعل المناسب لوصف الطقس كخلفية: «كان الجو مشمسًا عندما خرجنا».",
                    "stemEs": "____ mucho sol cuando salimos de casa.",
                    "stemAr": "____ الجو مشمسًا جدًا عندما خرجنا من المنزل.",
                    "options": [
                        {"id": "a2_diff_4_a", "text": "Hacía", "isCorrect": True, "textAr": "كان (طقس مستمر)"},
                        {"id": "a2_diff_4_b", "text": "Hizo", "isCorrect": False, "textAr": "عمل / كان (قاطع)", "distractorRationaleAr": "وصف الطقس وحالة الطبيعة خلفية سردية تتطلب دائمًا زمن Imperfecto: Hacía sol."},
                        {"id": "a2_diff_4_c", "text": "Hace", "isCorrect": False, "textAr": "مضارع حاضر", "distractorRationaleAr": "الجملة في الماضي بدليل salimos."},
                        {"id": "a2_diff_4_d", "text": "Haga", "isCorrect": False, "textAr": "منصوب subjuntivo", "distractorRationaleAr": "الجملة خبرية واقعية لا تتطلب منصّوباً."}
                    ],
                    "answerKey": {"correctOptionIds": ["a2_diff_4_a"]},
                    "explanationAr": "وصف الطقس (Hacía sol, llovía, hacía frío) هو خلفية مشهدية للموقف، وكل ما يصف المسرح المكاني والزماني يوضع في Imperfecto: Hacía sol.",
                    "errorFeedback": {
                        "a2_diff_4_b": "Hizo لا تستخدم لوصف مسرح الأحداث إلا في التلخيص الكلي لليوم.",
                        "a2_diff_4_c": "Hace مضارع.",
                        "a2_diff_4_d": "Haga صيغة منصوب غير مطلوبة هنا."
                    },
                    "skills": ["grammar"],
                    "difficulty": 2,
                    "targetVocab": ["cuando"],
                    "scoring": {"mode": "all_or_nothing"}
                },
                {
                    "id": "a2_diff_5_sentence_order",
                    "type": "word_order",
                    "instructionAr": "رتّب الكلمات لتكوين جملة سليمة تجمع بين الزمنين.",
                    "contextAr": "أثناء نومي رن جرس الباب.",
                    "options": [
                        {"id": "a2_diff_5_1", "text": "Mientras", "isCorrect": True, "textAr": "بينما"},
                        {"id": "a2_diff_5_2", "text": "dormía,", "isCorrect": True, "textAr": "كنتُ نائمًا،"},
                        {"id": "a2_diff_5_3", "text": "alguien", "isCorrect": True, "textAr": "شخص ما"},
                        {"id": "a2_diff_5_4", "text": "llamó", "isCorrect": True, "textAr": "طرقَ"},
                        {"id": "a2_diff_5_5", "text": "a", "isCorrect": True, "textAr": "على"},
                        {"id": "a2_diff_5_6", "text": "la", "isCorrect": True, "textAr": "الـ"},
                        {"id": "a2_diff_5_7", "text": "puerta.", "isCorrect": True, "textAr": "باب."}
                    ],
                    "answerKey": {
                        "accepted": [
                            "Mientras dormía, alguien llamó a la puerta.",
                            "Mientras dormía alguien llamó a la puerta"
                        ]
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
                        "referenceAudioKey": "pending/a2-diff-biblio-1",
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
    },

    # =========================================================================
    # B1: Unit b1-u2-opinions (الرأي والاتفاق والمنصوب)
    # =========================================================================
    {
        "dir": "content/drafts/b1",
        "filename": "lesson-b1-expresar-opinion-creo-que.json",
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
            "reviewVocabulary": ["es", "sea", "amigo", "trabajo"],
            "targetStructures": [
                "Afirmación (Certeza): Creo que / Pienso que + INDICATIVO (Creo que es una buena idea)",
                "Negación (Duda/Rechazo): No creo que / No pienso que + SUBJUNTIVO (No creo que sea una buena idea)",
                "Pregunta: ¿Crees que es...? / ¿No crees que sea...?"
            ],
            "grammarTopics": ["subjuntivo-opinion-negativa", "creo-que-indicativo"],
            "scenarios": [
                {
                    "contextAr": "نقاش بين مدير ونائبه حول خطة تسويقية جديدة ومشروع توسع للشركة في مصر.",
                    "settingAr": "غرفة اجتماعات، مدريد",
                    "lines": [
                        {
                            "es": "Creo que el mercado egipcio tiene un potencial enorme para nuestra empresa.",
                            "ar": "أعتقد أن السوق المصري يمتلك إمكانات هائلة لشركتنا.",
                            "arEg": "شايف إن السوق المصري فيه فرص كبيرة جداً لشركتنا.",
                            "audioKey": "pending/b1-op-reunion-1"
                        },
                        {
                            "es": "Estoy de acuerdo, pero no creo que este sea el mejor momento para empezar.",
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
                            "es": "Sí, pero no pienso que tengamos suficientes recursos financieros este mes.",
                            "ar": "نعم، لكني لا أظن أن لدينا موارد مالية كافية هذا الشهر.",
                            "arEg": "تمام، بس مش فاكر إن عندنا سيولة كافية الشهر ده.",
                            "audioKey": "pending/b1-op-reunion-4"
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
                    "id": "b1_op_1_listen",
                    "type": "listen_choose",
                    "instructionAr": "استمع إلى النائب واختر سبب تحفظه على بدء المشروع الآن.",
                    "audioKey": "pending/b1-op-reunion-4",
                    "speechEs": "Sí, pero no pienso que tengamos suficientes recursos financieros este mes.",
                    "options": [
                        {"id": "b1_op_1_a", "text": "نقص الموارد المالية الكافية هذا الشهر", "isCorrect": True, "textAr": "نقص الموارد المالية"},
                        {"id": "b1_op_1_b", "text": "صعوبة السوق في مصر", "isCorrect": False, "textAr": "صعوبة السوق", "distractorRationaleAr": "هو اتفق على أن السوق واعد ولديه إمكانات."},
                        {"id": "b1_op_1_c", "text": "عدم وجود فريق عمل مؤهل", "isCorrect": False, "textAr": "نقص الكوادر", "distractorRationaleAr": "لم يتطرق إلى فريق العمل في كلامه."}
                    ],
                    "answerKey": {"correctOptionIds": ["b1_op_1_a"]},
                    "explanationAr": "قال النائب بوضوح: «no pienso que tengamos suficientes recursos financieros este mes» (لا أظن أن لدينا موارد مالية كافية هذا الشهر)، واستخدم الفعل tengamos في صيغة Subjuntivo لوجود النفي في no pienso.",
                    "errorFeedback": {
                        "b1_op_1_b": "هو متفق أن السوق ممتاز.",
                        "b1_op_1_c": "لم يذكر فريق العمل."
                    },
                    "skills": ["listening"],
                    "difficulty": 1,
                    "targetVocab": ["pensar"],
                    "scoring": {"mode": "all_or_nothing"}
                },
                {
                    "id": "b1_op_2_subj_trigger",
                    "type": "word_choice",
                    "instructionAr": "متى نستخدم زمن المنصوب (Subjuntivo) بعد أفعال الرأي والتفكير (creer / pensar)؟",
                    "options": [
                        {"id": "b1_op_2_a", "text": "عندما تكون الجملة منفية: No creo que / No pienso que", "isCorrect": True, "textAr": "مع النفي"},
                        {"id": "b1_op_2_b", "text": "دائمًا في الإثبات والنفي", "isCorrect": False, "textAr": "دائمًا", "distractorRationaleAr": "في الإثبات نستخدم Indicativo حصراً: Creo que es verdad."},
                        {"id": "b1_op_2_c", "text": "في السؤال فقط", "isCorrect": False, "textAr": "في السؤال فقط", "distractorRationaleAr": "السؤال العادي يأخذ Indicativo: ¿Crees que es verdad?"}
                    ],
                    "answerKey": {"correctOptionIds": ["b1_op_2_a"]},
                    "explanationAr": "القاعدة الأساسية لمستوى B1: في الإثبات (اليقين والاعتقاد) = Indicativo: «Creo que es verdad»، وفي النفي (الشك وإنكار الواقعة) = Subjuntivo: «No creo que sea verdad».",
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
                    "stemAr": "أعتقد أنه ____ شخص نزيه جدًا.",
                    "options": [
                        {"id": "b1_op_3_a", "text": "es", "isCorrect": True, "textAr": "يكون (indicativo)"},
                        {"id": "b1_op_3_b", "text": "sea", "isCorrect": False, "textAr": "يكون (subjuntivo)", "distractorRationaleAr": "الجملة مثبتة (Creo que) لذا لا يجوز استخدام المنصوب sea هنا."},
                        {"id": "b1_op_3_c", "text": "era", "isCorrect": False, "textAr": "كان (ماضي)", "distractorRationaleAr": "الرأي في الحاضر بدليل creo."},
                        {"id": "b1_op_3_d", "text": "fuera", "isCorrect": False, "textAr": "منصوب ماضي", "distractorRationaleAr": "غير مناسب سياقيًا."}
                    ],
                    "answerKey": {"correctOptionIds": ["b1_op_3_a"]},
                    "explanationAr": "مع صيغة الإثبات (Creo que) نستخدم صيغة الواقع واليقين (Indicativo)، لذا نختار es: «Creo que él es una persona honesta».",
                    "errorFeedback": {
                        "b1_op_3_b": "sea منصوب ولا تأتي إلا مع النفي No creo que.",
                        "b1_op_3_c": "era في الماضي والموقف حاضر.",
                        "b1_op_3_d": "fuera منصوب ماضٍ."
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
                    "stemAr": "لا أعتقد أن الحل ____ سهلاً إلى هذا الحد.",
                    "options": [
                        {"id": "b1_op_4_a", "text": "sea", "isCorrect": True, "textAr": "يكون (subjuntivo)"},
                        {"id": "b1_op_4_b", "text": "es", "isCorrect": False, "textAr": "يكون (indicativo)", "distractorRationaleAr": "وجود النفي No creo que يفرض لزوم المنصوب sea."},
                        {"id": "b1_op_4_c", "text": "será", "isCorrect": False, "textAr": "سيكون (مستقبل)", "distractorRationaleAr": "المستقبل لا يُستخدم بعد No creo que."},
                        {"id": "b1_op_4_d", "text": "ha sido", "isCorrect": False, "textAr": "قد كان", "distractorRationaleAr": "ماضٍ تام غير مطابق للسياق."}
                    ],
                    "answerKey": {"correctOptionIds": ["b1_op_4_a"]},
                    "explanationAr": "النفي مع أفعال الرأي (No creo que) يعبر عن الشك وعدم الإقرار، مما يستدعي زمن المنصوب (Presente de Subjuntivo): sea.",
                    "errorFeedback": {
                        "b1_op_4_b": "es خطأ فادح في مستوى B1 لوجود No creo que.",
                        "b1_op_4_c": "será مستقبل غير مسموح به هنا.",
                        "b1_op_4_d": "ha sido مضارع تام."
                    },
                    "skills": ["grammar", "writing"],
                    "difficulty": 2,
                    "targetVocab": ["creer"],
                    "scoring": {"mode": "all_or_nothing"}
                },
                {
                    "id": "b1_op_5_contrast_quiz",
                    "type": "word_choice",
                    "instructionAr": "أي الجملتين الآتيتين صحيحة نحويًا وفق قواعد اللغة الإسبانية القياسية؟",
                    "options": [
                        {"id": "b1_op_5_a", "text": "No pienso que ellos tengan razón.", "isCorrect": True, "textAr": "لا أظن أن معهم حق (منصوب)"},
                        {"id": "b1_op_5_b", "text": "No pienso que ellos tienen razón.", "isCorrect": False, "textAr": "خطأ باستخدام tienen مع النفي", "distractorRationaleAr": "استخدام tienen (indicativo) بعد No pienso que خطأ تركيبي شائع لدى الأجانب."}
                    ],
                    "answerKey": {"correctOptionIds": ["b1_op_5_a"]},
                    "explanationAr": "الجملة الصحيحة هي «No pienso que ellos tengan razón» لأن No pienso que تحتم المنصوب (tengan من فعل tener).",
                    "errorFeedback": {
                        "b1_op_5_b": "tienen صيغة indicativo ولا يجوز استخدامها بعد No pienso que."
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
                        "referenceAudioKey": "pending/b1-op-reunion-4",
                        "modelAnswer": "No creo que tengamos tiempo hoy."
                    },
                    "explanationAr": "ركز على نطق g في tengamos بصوت الغين الخفيفة [ɣ] ونطق hoy بصوت الـ h الصامت تمامًا كأنك تبدأ من حرف o.",
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
    {
        "dir": "content/drafts/b1",
        "filename": "lesson-b1-subjuntivo-deseos.json",
        "lesson": {
            "slug": "b1-subjuntivo-deseos",
            "titleAr": "المضارع المنصوب: التعبير عن الرغبات والأمنيات",
            "level": "B1",
            "programSlug": "main-track",
            "unitSlug": "b1-u2-opinions",
            "objectiveAr": "أن يصيغ المتعلم صيغة المضارع المنصوب (Presente de Subjuntivo) لأفعال المجموعات الثلاث والشواذ، ويستخدمه في التعبير عن الرغبات والأمنيات مع التراكيب: Quiero que, Ojalá, Espero que.",
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
                            "ar": "هذا طبيعي. إن شاء الله (أتمنى) أن يحالفك حظ وافر وتنجح بدرجة ممتازة!",
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
                "minCorrectExercises": 6,
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
                        {"id": "b1_deseos_1_a", "text": "أن يحالفه الحظ وينجح بدرجة ممتازة", "isCorrect": True, "textAr": "النجاح والتوفيق"},
                        {"id": "b1_deseos_1_b", "text": "أن يؤجل الامتحان إلى الغد", "isCorrect": False, "textAr": "تأجيل الامتحان", "distractorRationaleAr": "لم تطلب تأجيل الامتحان."},
                        {"id": "b1_deseos_1_c", "text": "أن يعود إلى النوم فورًا", "isCorrect": False, "textAr": "العودة للنوم", "distractorRationaleAr": "هذا وقت الذهاب للامتحان."}
                    ],
                    "answerKey": {"correctOptionIds": ["b1_deseos_1_a"]},
                    "explanationAr": "قالت الأم: «¡Ojalá tengas mucha suerte y apruebes con buena nota!»، واستخدمت الفعلين tengas و apruebes في صيغة Subjuntivo بعد كلمة Ojalá.",
                    "errorFeedback": {
                        "b1_deseos_1_b": "لم تذكر التأجيل إطلاقًا.",
                        "b1_deseos_1_c": "هو ذاهب للامتحان وليس للنوم."
                    },
                    "skills": ["listening"],
                    "difficulty": 1,
                    "targetVocab": ["ojalá", "aprobar"],
                    "scoring": {"mode": "all_or_nothing"}
                },
                {
                    "id": "b1_deseos_2_rule",
                    "type": "word_choice",
                    "instructionAr": "ما هي القاعدة الذهبية لتصريف الأفعال المنتظمة في المضارع المنصوب (Presente de Subjuntivo)؟",
                    "options": [
                        {"id": "b1_deseos_2_a", "text": "تبادل الحروف المتحركة: أفعال -ar تأخذ e، وأفعال -er/-ir تأخذ a", "isCorrect": True, "textAr": "قاعدة العكس"},
                        {"id": "b1_deseos_2_b", "text": "إضافة حرف s إلى نهاية كل فعل", "isCorrect": False, "textAr": "إضافة s", "distractorRationaleAr": "إضافة s تخص ضمير tú فقط في كل الأزمنة."},
                        {"id": "b1_deseos_2_c", "text": "استخدام نفس تصريف الماضي التام", "isCorrect": False, "textAr": "الماضي التام", "distractorRationaleAr": "الماضي التام زمن مركب مختلف تمامًا."}
                    ],
                    "answerKey": {"correctOptionIds": ["b1_deseos_2_a"]},
                    "explanationAr": "سر حفظ المضارع المنصوب في الإسبانية هو «قاعدة الحروف المعكوسة»: أفعال -ar (مثل hablar) تصبح hable, hables, hable... وأفعال -er/-ir (مثل comer, vivir) تصبح coma, viva.",
                    "errorFeedback": {
                        "b1_deseos_2_b": "حرف s ليس قاعدة تصريف شاملة.",
                        "b1_deseos_2_c": "الماضي التام تركيب بـ haber."
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
                    "stemAr": "أريدك أن ____ معي إلى الحفلة.",
                    "options": [
                        {"id": "b1_deseos_3_a", "text": "vengas", "isCorrect": True, "textAr": "تأتي (منصوب)"},
                        {"id": "b1_deseos_3_b", "text": "vienes", "isCorrect": False, "textAr": "تأتي (مضارع indicativo)", "distractorRationaleAr": "vienes صيغة indicativo، بينما بعد Quiero que يلزم المنصوب لوجود رغبة واختلاف الفاعل."},
                        {"id": "b1_deseos_3_c", "text": "venir", "isCorrect": False, "textAr": "مصدر غير مصرف", "distractorRationaleAr": "المصدر نستخدمه فقط إذا كان الفاعل واحداً: Quiero ir، أما هنا الفاعل تغير (أنا أريد + أنت تأتي)."},
                        {"id": "b1_deseos_3_d", "text": "vino", "isCorrect": False, "textAr": "أتى (ماضي)", "distractorRationaleAr": "vino ماضٍ بسيط."}
                    ],
                    "answerKey": {"correctOptionIds": ["b1_deseos_3_a"]},
                    "explanationAr": "فعل venir مشتق من جذر المتكلم في المضارع (vengo)، وفي المنصوب يأخذ النهاية المعكوسة -as: vengas. «Quiero que tú vengas».",
                    "errorFeedback": {
                        "b1_deseos_3_b": "vienes مرفوع indicativo، وبعد الرغبة يلزم المنصوب.",
                        "b1_deseos_3_c": "المصدر لا يصح لوجود فاعلين مختلفين (yo / tú).",
                        "b1_deseos_3_d": "vino في الماضي."
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
                    "stemAr": "أتمنى أن ____ حظاً وافراً في المقابلة!",
                    "options": [
                        {"id": "b1_deseos_4_a", "text": "tengas", "isCorrect": True, "textAr": "يكون لديك (منصوب)"},
                        {"id": "b1_deseos_4_b", "text": "tienes", "isCorrect": False, "textAr": "لديك (مضارع indicativo)", "distractorRationaleAr": "كلمة Ojalá تتطلب وجوباً زمن Subjuntivo بعدها."},
                        {"id": "b1_deseos_4_c", "text": "tendrás", "isCorrect": False, "textAr": "سيكون لديك", "distractorRationaleAr": "المستقبل لا يُستخدم بعد Ojalá."},
                        {"id": "b1_deseos_4_d", "text": "tuviste", "isCorrect": False, "textAr": "كان لديك (ماضي)", "distractorRationaleAr": "الموقف يتعلق بمقابلة مستقبلية قادمة."}
                    ],
                    "answerKey": {"correctOptionIds": ["b1_deseos_4_a"]},
                    "explanationAr": "كلمة «¡Ojalá!» من أصل عربي خالص («لو شاء الله» أو «يا ألله»)، وتأخذ دائماً بعدها زمن المنصوب Subjuntivo: ¡Ojalá tengas suerte! (عسى أن يوفقك الله).",
                    "errorFeedback": {
                        "b1_deseos_4_b": "tienes مرفوع indicativo، وأداة Ojalá تفرض المنصوب.",
                        "b1_deseos_4_c": "tendrás مستقبل غير جائز بعد Ojalá.",
                        "b1_deseos_4_d": "المقابلة لم تنته بعد."
                    },
                    "skills": ["grammar"],
                    "difficulty": 2,
                    "targetVocab": ["ojalá"],
                    "scoring": {"mode": "all_or_nothing"}
                },
                {
                    "id": "b1_deseos_5_esperar",
                    "type": "fill_blank",
                    "instructionAr": "أكمل الفراغ بتصريف فعل estar مع él في المنصوب: «آمل أن يكون بخير».",
                    "stemEs": "Espero que mi hermano ____ bien.",
                    "stemAr": "آمل أن ____ أخي بخير.",
                    "options": [
                        {"id": "b1_deseos_5_a", "text": "esté", "isCorrect": True, "textAr": "يكون (منصوب)"},
                        {"id": "b1_deseos_5_b", "text": "está", "isCorrect": False, "textAr": "يكون (indicativo)", "distractorRationaleAr": "Espero que تعبر عن أمنية وتتطلب المنصوب esté."},
                        {"id": "b1_deseos_5_c", "text": "es", "isCorrect": False, "textAr": "يكون (من ser)", "distractorRationaleAr": "الحال والصحة تأخذ estar وليس ser."},
                        {"id": "b1_deseos_5_d", "text": "sea", "isCorrect": False, "textAr": "منصوب من ser", "distractorRationaleAr": "مع الظرف bien نستخدم estar حصراً: esté bien."}
                    ],
                    "answerKey": {"correctOptionIds": ["b1_deseos_5_a"]},
                    "explanationAr": "فعل estar في المنصوب شاذ ويحمل علامة النبرة: esté (esté, estés, esté, estemos, estéis, estén). ولأن الحديث عن الصحة والحال نقول: esté bien.",
                    "errorFeedback": {
                        "b1_deseos_5_b": "está مرفوع ويجب نصبه بعد Espero que.",
                        "b1_deseos_5_c": "الحال والصحة مع estar.",
                        "b1_deseos_5_d": "sea من ser ولا تأتي مع bien."
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
                        "referenceAudioKey": "pending/b1-deseos-madre-3",
                        "modelAnswer": "¡Ojalá tengas mucha suerte!"
                    },
                    "explanationAr": "انطق حرف j في Ojalá بصوت الخاء [x] ونبر على المقطع الأخير -lá لوجود علامة النبرة: أوخالَا.",
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
    {
        "dir": "content/drafts/b1",
        "filename": "lesson-b1-por-vs-para.json",
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
                "PARA: Finalidad (para estudiar), Destinatario (para ti), Fecha límite (para el lunes), Dirección (hacia)",
                "POR: Causa/Motivo (por la lluvia), Medio (por teléfono), Tiempo aproximado/Duración (por tres horas), Agradecimiento (gracias por...)"
            ],
            "grammarTopics": ["por-vs-para-contraste", "preposiciones-causa-finalidad"],
            "scenarios": [
                {
                    "contextAr": "محادثة بين طالب يوضح لزميله أسباب سفره إلى إسبانيا وتحضيراته للمشروع الدراسي.",
                    "settingAr": "مكتبة المعهد، إسبانيا",
                    "lines": [
                        {
                            "es": "¿Por qué decidiste venir a España, Karim?",
                            "ar": "لماذا قررت القدوم إلى إسبانيا يا كريم؟",
                            "arEg": "ليه قررت تيجي إسبانيا يا كريم؟",
                            "audioKey": "pending/b1-porpara-karim-1"
                        },
                        {
                            "es": "Vine a Madrid para estudiar un máster y mejorar mi español.",
                            "ar": "جئتُ إلى مدريد لأجل دراسة الماجستير وتحسين لغتي الإسبانية.",
                            "arEg": "جيت مدريد عشان أعمل ماجستير وأحسّن الإسباني بتاعي.",
                            "audioKey": "pending/b1-porpara-karim-2"
                        },
                        {
                            "es": "¡Qué bien! ¿Y tienes que entregar el trabajo final pronto?",
                            "ar": "رائع! وهل عليك تسليم مشروع التخرج قريبًا؟",
                            "arEg": "حلو أوي! ولازم تسلّم المشروع قريب؟",
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
                "minCorrectExercises": 6,
                "requiredExerciseTypes": ["listen_choose", "word_choice", "fill_blank"]
            },
            "unlock": {"type": "sequential"},
            "offlinePriority": 1,
            "exercises": [
                {
                    "id": "b1_porpara_1_listen",
                    "type": "listen_choose",
                    "instructionAr": "استمع إلى كريم واختر الغاية (الهدف) من قدومه إلى مدريد.",
                    "audioKey": "pending/b1-porpara-karim-2",
                    "speechEs": "Vine a Madrid para estudiar un máster y mejorar mi español.",
                    "options": [
                        {"id": "b1_porpara_1_a", "text": "لدراسة الماجستير وتحسين لغته الإسبانية", "isCorrect": True, "textAr": "دراسة الماجستير"},
                        {"id": "b1_porpara_1_b", "text": "للسياحة وقضاء عطلة الصيف", "isCorrect": False, "textAr": "السياحة", "distractorRationaleAr": "لم يذكر السياحة."},
                        {"id": "b1_porpara_1_c", "text": "للعمل في مطعم", "isCorrect": False, "textAr": "العمل في مطعم", "distractorRationaleAr": "لم يذكر العمل في مطعم."}
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
                        {"id": "b1_porpara_2_a", "text": "لأن اللغة العربية تستخدم حرف الجر «اللام» لكليهما (جئتُ للدراسة / عُوقبَ لغيابه)", "isCorrect": True, "textAr": "اشتراك اللام في العربية"},
                        {"id": "b1_porpara_2_b", "text": "لأنهما يبدآن بنفس الحرف p في الإسبانية", "isCorrect": False, "textAr": "تشابه الحرف الأول", "distractorRationaleAr": "السبب لغوي دلالي وليس مجرد تشابه الحرف الأول."},
                        {"id": "b1_porpara_2_c", "text": "لأنهما يعبران عن نفس المعنى دائماً في الإسبانية", "isCorrect": False, "textAr": "تطابق المعنى", "distractorRationaleAr": "لهما معنيان مختلفان تماماً في الإسبانية (الدافع السابق مقابل الغاية اللاحقة)."}
                    ],
                    "answerKey": {"correctOptionIds": ["b1_porpara_2_a"]},
                    "explanationAr": "في العربية نقول «لـ» للسبب (عوقب لإهماله = por) ونقول «لـ» للهدف (سافر ليتعلم = para)، بينما في الإسبانية: Por تنظر إلى الخلف (الدافع والسبب)، و Para تنظر إلى الأمام (الهدف والوجهة).",
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
                    "stemAr": "لم نخرج من المنزل ____ المطر الشديد.",
                    "options": [
                        {"id": "b1_porpara_3_a", "text": "por", "isCorrect": True, "textAr": "بسبب (دافع/علّة)"},
                        {"id": "b1_porpara_3_b", "text": "para", "isCorrect": False, "textAr": "لأجل (غاية)", "distractorRationaleAr": "المطر هو سبب عدم الخروج وليس هدفاً نسعى لتحقيقه!"},
                        {"id": "b1_porpara_3_c", "text": "de", "isCorrect": False, "textAr": "من", "distractorRationaleAr": "de لا تعبر عن السببية المباشرة هنا."},
                        {"id": "b1_porpara_3_d", "text": "con", "isCorrect": False, "textAr": "مع", "distractorRationaleAr": "مع المطر لا تفيد السببية."}
                    ],
                    "answerKey": {"correctOptionIds": ["b1_porpara_3_a"]},
                    "explanationAr": "المطر هو الدافع والعلة (Causa/Motivo) المسببة للقرار، لذا نستخدم por حصرًا: «por la lluvia» (بسبب المطر).",
                    "errorFeedback": {
                        "b1_porpara_3_b": "المطر ليس غاية نرجوها، بل سبب وقع مسبقًا.",
                        "b1_porpara_3_c": "de تفيد الملكية أو الأصل.",
                        "b1_porpara_3_d": "con تفيد المصاحبة."
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
                    "stemAr": "هذا الواجب مطلوب بحلول ____ يوم الإثنين.",
                    "options": [
                        {"id": "b1_porpara_4_a", "text": "para", "isCorrect": True, "textAr": "بحلول / لـ (موعد نهائي)"},
                        {"id": "b1_porpara_4_b", "text": "por", "isCorrect": False, "textAr": "بسبب / خلال", "distractorRationaleAr": "por el lunes تعني تقريباً يوم الاثنين أو في وقت ما، وليست موعداً نهائياً صارماً."},
                        {"id": "b1_porpara_4_c", "text": "en", "isCorrect": False, "textAr": "في", "distractorRationaleAr": "في الإسبانية مع المواعيد المحددة للتسليم نستخدم para."},
                        {"id": "b1_porpara_4_d", "text": "a", "isCorrect": False, "textAr": "إلى", "distractorRationaleAr": "a تستخدم للساعة (a las 8) وليس للأيام في هذا التركيب."}
                    ],
                    "answerKey": {"correctOptionIds": ["b1_porpara_4_a"]},
                    "explanationAr": "عند الحديث عن الموعد النهائي (Fecha límite) نستخدم دائمًا حرف الجر para: «para el lunes» (تسليم يوم الإثنين).",
                    "errorFeedback": {
                        "b1_porpara_4_b": "por لا تعبر عن موعد التسليم النهائي.",
                        "b1_porpara_4_c": "en تعني في يوم كذا، لكن para تحدد الأجل والتسليم.",
                        "b1_porpara_4_d": "a لا تستخدم هكذا مع الأيام."
                    },
                    "skills": ["grammar"],
                    "difficulty": 2,
                    "targetVocab": ["para"],
                    "scoring": {"mode": "all_or_nothing"}
                },
                {
                    "id": "b1_porpara_5_gratitude",
                    "type": "fill_blank",
                    "instructionAr": "اختر حرف الجر الصحيح مع عبارات الشكر: «شكرًا لك على كل شيء».",
                    "stemEs": "Muchas gracias ____ todo.",
                    "stemAr": "شكرًا جزيلاً لك ____ كل شيء.",
                    "options": [
                        {"id": "b1_porpara_5_a", "text": "por", "isCorrect": True, "textAr": "على (دافع الشكر)"},
                        {"id": "b1_porpara_5_b", "text": "para", "isCorrect": False, "textAr": "لأجل", "distractorRationaleAr": "الشكر يُقدم نظير سبب وقع في الماضي، لذا يأخذ دائمًا por: gracias por todo."},
                        {"id": "b1_porpara_5_c", "text": "de", "isCorrect": False, "textAr": "من", "distractorRationaleAr": "de لا تستخدم مع الشكر."},
                        {"id": "b1_porpara_5_d", "text": "a", "isCorrect": False, "textAr": "إلى", "distractorRationaleAr": "a للشخص المشكور: gracias a ti، ولكن للسبب نقول por."}
                    ],
                    "answerKey": {"correctOptionIds": ["b1_porpara_5_a"]},
                    "explanationAr": "عبارات الشكر والاعتذار تأخذ دائماً حرف الجr por لأنه يعبر عن الدافع والعلة التي استوجبت الشكر: «Gracias por tu ayuda» (شكرًا لمساعدتك).",
                    "errorFeedback": {
                        "b1_porpara_5_b": "para خطأ فادح بعد gracias.",
                        "b1_porpara_5_c": "de غير صحيحة هنا.",
                        "b1_porpara_5_d": "نقول gracias a ti للشخص، و gracias por للسبب."
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
                        "referenceAudioKey": "pending/b1-porpara-karim-2",
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
    {
        "dir": "content/drafts/b1",
        "filename": "lesson-b1-acuerdo-desacuerdo.json",
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
                "Acuerdo parcial: Sí, pero... / Hasta cierto punto / Depende",
                "Desacuerdo educado: No lo veo así / No estoy de acuerdo / Discrepo en ese punto"
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
                            "es": "Tienes toda la razón en eso, pero reduce el contacto humano entre compañeros.",
                            "ar": "معك كل الحق في ذلك، لكنه يقلل من التواصل البشري بين الزملاء.",
                            "arEg": "عندك حق تماماً في النقطة دي، بس بيقلل اللمة والتعامل مع زمايلك.",
                            "audioKey": "pending/b1-debate-lunch-2"
                        },
                        {
                            "es": "No lo veo exactamente así; la tecnología nos mantiene comunicados.",
                            "ar": "لا أرى الأمر هكذا تمامًا؛ فالتكنولوجيا تبقينا على تواصل مستمر.",
                            "arEg": "مش شايفها كدة بالظبط؛ التكنولوجيا مخليانا متواصلين طول الوقت.",
                            "audioKey": "pending/b1-debate-lunch-3"
                        },
                        {
                            "es": "Bueno, depende de cada persona y del tipo de trabajo que hagamos.",
                            "ar": "حسنًا، يعتمد الأمر على كل شخص وطبيعة العمل الذي نقوم به.",
                            "arEg": "عموماً ده بيعتمد على كل شخص وطبيعة الشغلانة.",
                            "audioKey": "pending/b1-debate-lunch-4"
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
                    "id": "b1_acuerdo_1_listen",
                    "type": "listen_choose",
                    "instructionAr": "استمع إلى الزميل واختر العبارة التي استخدمها لتأييد كلام زميله مبدئيًا.",
                    "audioKey": "pending/b1-debate-lunch-2",
                    "speechEs": "Tienes toda la razón en eso, pero reduce el contacto humano entre compañeros.",
                    "options": [
                        {"id": "b1_acuerdo_1_a", "text": "Tienes toda la razón en eso (معك كل الحق في ذلك)", "isCorrect": True, "textAr": "معك كل الحق"},
                        {"id": "b1_acuerdo_1_b", "text": "Estás completamente equivocado (أنت مخطئ تمامًا)", "isCorrect": False, "textAr": "أنت مخطئ", "distractorRationaleAr": "لم يقل ذلك، بل اتفق معه مبدئياً بأدب."},
                        {"id": "b1_acuerdo_1_c", "text": "No me importa el tema (لا يهمني الأمر)", "isCorrect": False, "textAr": "لا يهمني", "distractorRationaleAr": "لم يتلفظ بهذه العبارة."}
                    ],
                    "answerKey": {"correctOptionIds": ["b1_acuerdo_1_a"]},
                    "explanationAr": "عبارة «Tienes toda la razón» من أرقى صيغ الاتفاق التام في النقاش الإسباني المهني.",
                    "errorFeedback": {
                        "b1_acuerdo_1_b": "هو اتفق معه أولاً ثم استدرك بـ pero.",
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
                        {"id": "b1_acuerdo_2_a", "text": "tener (Tener razón)", "isCorrect": True, "textAr": "tener razón"},
                        {"id": "b1_acuerdo_2_b", "text": "ser (Ser razón)", "isCorrect": False, "textAr": "ser razón", "distractorRationaleAr": "خطأ شهير ناشئ عن الترجمة من الإنجليزية: لا نقول Ser razón."},
                        {"id": "b1_acuerdo_2_c", "text": "estar (Estar razón)", "isCorrect": False, "textAr": "estar razón", "distractorRationaleAr": "لا يُستخدم estar مع razón."}
                    ],
                    "answerKey": {"correctOptionIds": ["b1_acuerdo_2_a"]},
                    "explanationAr": "في الإسبانية يقترن فعل tener بالحق: «Tener razón» أي (يمتلك الحق / معه حق)، ولا يُستخدم أبدًا ser أو estar.",
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
                    "stemAr": "أنا ____ متفقًا معك.",
                    "options": [
                        {"id": "b1_acuerdo_3_a", "text": "estoy", "isCorrect": True, "textAr": "أكون (estar)"},
                        {"id": "b1_acuerdo_3_b", "text": "soy", "isCorrect": False, "textAr": "أكون (ser)", "distractorRationaleAr": "الاتفاق حالة ذهنية تقترن بـ estar: Estoy de acuerdo، ولا يجوز مطلقاً استخدام soy."},
                        {"id": "b1_acuerdo_3_c", "text": "tengo", "isCorrect": False, "textAr": "عندي", "distractorRationaleAr": "نقول tengo razón، ولكن مع de acuerdo نستخدم estoy."},
                        {"id": "b1_acuerdo_3_d", "text": "hago", "isCorrect": False, "textAr": "أفعل", "distractorRationaleAr": "hago de acuerdo غير صحيحة."}
                    ],
                    "answerKey": {"correctOptionIds": ["b1_acuerdo_3_a"]},
                    "explanationAr": "عبارة الاتفاق تتطلب حصراً فعل estar: «Estoy de acuerdo» (أنا متفق / على اتفاق).",
                    "errorFeedback": {
                        "b1_acuerdo_3_b": "لا يجوز استخدام soy مع de acuerdo.",
                        "b1_acuerdo_3_c": "tengo مع razón وليس مع de acuerdo.",
                        "b1_acuerdo_3_d": "hago لا تناسب السياق."
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
                        {"id": "b1_acuerdo_4_a", "text": "No lo veo exactamente así. (لا أرى الأمر هكذا تمامًا)", "isCorrect": True, "textAr": "اعتراض مهذب"},
                        {"id": "b1_acuerdo_4_b", "text": "¡Eso es una tontería! (هذا هراء!)", "isCorrect": False, "textAr": "عبارة غير لائقة", "distractorRationaleAr": "أسلوب فظ لا يناسب البيئة المهنية."},
                        {"id": "b1_acuerdo_4_c", "text": "Te equivocas por completo. (أنت مخطئ تمامًا)", "isCorrect": False, "textAr": "أسلوب هجومي", "distractorRationaleAr": "أسلوب حاد جداً ينبغي تجنبه."}
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
                    "stemAr": "نجاح المشروع يعتمد ____ علينا.",
                    "options": [
                        {"id": "b1_acuerdo_5_a", "text": "de", "isCorrect": True, "textAr": "على (يقترن بـ depende)"},
                        {"id": "b1_acuerdo_5_b", "text": "en", "isCorrect": False, "textAr": "في", "distractorRationaleAr": "خطأ قادم من الإنجليزية depend on: في الإسبانية نستخدم de حصراً."},
                        {"id": "b1_acuerdo_5_c", "text": "sobre", "isCorrect": False, "textAr": "على الفوقية", "distractorRationaleAr": "sobre لا تقترن بـ depender."},
                        {"id": "b1_acuerdo_5_d", "text": "a", "isCorrect": False, "textAr": "إلى", "distractorRationaleAr": "غير مطابقة للقاعدة."}
                    ],
                    "answerKey": {"correctOptionIds": ["b1_acuerdo_5_a"]},
                    "explanationAr": "فعل «Depender» في الإسبانية يأخذ دائمًا حرف الجر de: «Depende de ti» (يعتمد عليك / الأمر راجع إليك).",
                    "errorFeedback": {
                        "b1_acuerdo_5_b": "depende en خطأ تركيبي.",
                        "b1_acuerdo_5_c": "sobre لا تستخدم مع هذا الفعل.",
                        "b1_acuerdo_5_d": "a غير صحيحة هنا."
                    },
                    "skills": ["grammar"],
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
                        "referenceAudioKey": "pending/b1-debate-lunch-2",
                        "modelAnswer": "Tienes toda la razón en este punto."
                    },
                    "explanationAr": "انطق حرف z في razón كالثاء العربية [θ]، مع وضع نبرة صوت واضحة على حرف ó في razón.",
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
    },

    # =========================================================================
    # B2: Unit b2-u1-argument (بناء الحجة والشرط الافتراضي)
    # =========================================================================
    {
        "dir": "content/drafts/b2",
        "filename": "lesson-b2-condicional-imperfecto-subjuntivo.json",
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
                        {"id": "b2_cond_1_a", "text": "السفر حول العالم وتأسيس جمعية خيرية", "isCorrect": True, "textAr": "السفر وإنشاء جمعية خيرية"},
                        {"id": "b2_cond_1_b", "text": "شراء سيارات فارهة والجلوس في المنزل", "isCorrect": False, "textAr": "شراء سيارات", "distractorRationaleAr": "لم يذكر شراء سيارات."},
                        {"id": "b2_cond_1_c", "text": "ترك أسرته والانتقال إلى جزيرة منعزلة", "isCorrect": False, "textAr": "الانتقال لجزيرة", "distractorRationaleAr": "لم يتلفظ بذلك."}
                    ],
                    "answerKey": {"correctOptionIds": ["b2_cond_1_a"]},
                    "explanationAr": "قال المتحدث: «Si tuviera ese dinero, viajaría por todo el mundo y crearía una fundación benéfica» مستخدمًا الشرط الافتراضي.",
                    "errorFeedback": {
                        "b2_cond_1_b": "لم يذكر السيارات.",
                        "b2_cond_1_c": "لم يذكر الجزر."
                    },
                    "skills": ["listening"],
                    "difficulty": 1,
                    "targetVocab": ["viajaría", "tuviera"],
                    "scoring": {"mode": "all_or_nothing"}
                },
                {
                    "id": "b2_cond_2_structure",
                    "type": "word_choice",
                    "instructionAr": "ما هو التركيب النحوي الدقيق للجمل الشرطية الافتراضية غير الممكنة في الحاضر؟",
                    "options": [
                        {"id": "b2_cond_2_a", "text": "Si + Imperfecto de Subjuntivo + Condicional Simple", "isCorrect": True, "textAr": "التركيب القياسي الصحيح"},
                        {"id": "b2_cond_2_b", "text": "Si + Presente + Futuro", "isCorrect": False, "textAr": "شرط إمكاني واقعي", "distractorRationaleAr": "Si + Presente + Futuro للشرط الممكن القابل للتحقق (إذا درست ستنجح) وليس الافتراضي."},
                        {"id": "b2_cond_2_c", "text": "Si + Condicional + Condicional", "isCorrect": False, "textAr": "تكرار الشرطي خطأ", "distractorRationaleAr": "لا يجوز مطلقاً وضع فعل الشرط بعد Si في صيغة Condicional."}
                    ],
                    "answerKey": {"correctOptionIds": ["b2_cond_2_a"]},
                    "explanationAr": "القاعدة الصارمة في الإسبانية: بعد Si الافتراضية لا يأتي أبدًا Condicional، بل Imperfecto de Subjuntivo (مثل tuviera)، ويأتي Condicional Simple (مثل viajaría) في جواب الشرط.",
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
                    "options": [
                        {"id": "b2_cond_3_a", "text": "fuera", "isCorrect": True, "textAr": "كنتُ (منصوب ماضي)"},
                        {"id": "b2_cond_3_b", "text": "sería", "isCorrect": False, "textAr": "شرطي condicional", "distractorRationaleAr": "خطأ محظور: بعد Si لا نضع صيغة Condicional أبداً."},
                        {"id": "b2_cond_3_c", "text": "soy", "isCorrect": False, "textAr": "مضارع واقعي", "distractorRationaleAr": "الافتراض خيالي (أنا لست أنت ولن أكون)، لذا يلزم المنصوب الماضي fuera."},
                        {"id": "b2_cond_3_d", "text": "era", "isCorrect": False, "textAr": "ماضٍ مستمر indicativo", "distractorRationaleAr": "era تتبع صيغة indicativo ولا تستخدم بعد Si الشرطية الافتراضية."}
                    ],
                    "answerKey": {"correctOptionIds": ["b2_cond_3_a"]},
                    "explanationAr": "العبارة الإسبانية الشهيرة لتقديم النصيحة هي «Si yo fuera tú...» (لو كنتُ مكانك)، وتستخدم فعل ser في صيغة Imperfecto de Subjuntivo: fuera.",
                    "errorFeedback": {
                        "b2_cond_3_b": "لا نستخدم sería بعد Si أبداً.",
                        "b2_cond_3_c": "soy للواقع الحقيقي.",
                        "b2_cond_3_d": "era لا تصح بعد Si الشرطية."
                    },
                    "skills": ["grammar", "writing"],
                    "difficulty": 2,
                    "targetVocab": ["fuera"],
                    "scoring": {"mode": "all_or_nothing"}
                },
                {
                    "id": "b2_cond_4_fill_apodosis",
                    "type": "fill_blank",
                    "instructionAr": "أكمل جواب الشرط بصيغة Condicional Simple: «لو كان عندي وقت، لساعدتك».",
                    "stemEs": "Si tuviera tiempo, te ____ con mucho gusto.",
                    "stemAr": "لو كان لديّ وقت، ____ بكل سرور.",
                    "options": [
                        {"id": "b2_cond_4_a", "text": "ayudaría", "isCorrect": True, "textAr": "لساعدتُك (condicional)"},
                        {"id": "b2_cond_4_b", "text": "ayudo", "isCorrect": False, "textAr": "أساعدك (مضارع)", "distractorRationaleAr": "المضارع لا يتطابق مع فعل الشرط الافتراضي tuviera."},
                        {"id": "b2_cond_4_c", "text": "ayudé", "isCorrect": False, "textAr": "ساعدتك (ماضي بسيط)", "distractorRationaleAr": "الماضي البسيط لا يأتي في جواب هذا الشرط الافتراضي."},
                        {"id": "b2_cond_4_d", "text": "ayudara", "isCorrect": False, "textAr": "منصوب ماضي", "distractorRationaleAr": "جواب الشرط يتطلب صيغة Condicional Simple وليس المنصوب."}
                    ],
                    "answerKey": {"correctOptionIds": ["b2_cond_4_a"]},
                    "explanationAr": "جواب الشرط المقترن بـ Si tuviera يأخذ دائمًا صيغة Condicional Simple: ayudaría (لساعدتك).",
                    "errorFeedback": {
                        "b2_cond_4_b": "ayudo مضارع واقعي.",
                        "b2_cond_4_c": "ayudé ماضٍ منتهٍ.",
                        "b2_cond_4_d": "ayudara منصوب، والمطلوب صيغة الشرطي المشتق من المصدر."
                    },
                    "skills": ["grammar", "writing"],
                    "difficulty": 2,
                    "targetVocab": ["tuviera"],
                    "scoring": {"mode": "all_or_nothing"}
                },
                {
                    "id": "b2_cond_5_arabic_parallel",
                    "type": "word_choice",
                    "instructionAr": "ما هي الأداة في اللغة العربية التي تطابق بدقة أسلوب الشرط «Si + Imperfecto de Subjuntivo»؟",
                    "options": [
                        {"id": "b2_cond_5_a", "text": "أداة الشرط الامتناعية «لَوْ» (لو كنتُ غنيًا لسافرتُ)", "isCorrect": True, "textAr": "«لَوْ» الامتناعية"},
                        {"id": "b2_cond_5_b", "text": "أداة الشرط الإمكانية «إِذَا» (إذا جاء الربيع تتفتح الأزهار)", "isCorrect": False, "textAr": "«إِذَا» الإمكانية", "distractorRationaleAr": "«إذا» تطابق في الإسبانية Si + Presente (الشرط الممكن) وليس الامتناعي."},
                        {"id": "b2_cond_5_c", "text": "حرف العطف «أَوْ»", "isCorrect": False, "textAr": "«أَوْ» العاطفة", "distractorRationaleAr": "أو حرف عطف للتخيير ولا علاقة له بالشرط."}
                    ],
                    "answerKey": {"correctOptionIds": ["b2_cond_5_a"]},
                    "explanationAr": "الموازنة البلاغية: في العربية «لو» حرف امتناع لامتناع (امتنع الجواب لامتناع الشرط)، وهو بالضبط ما تؤديه تركيبة: Si tuviera... viajaría.",
                    "errorFeedback": {
                        "b2_cond_5_b": "«إذا» تفيد تحقق الشرط وتوازي Si tengo... viajaré.",
                        "b2_cond_5_c": "أو للتخيير."
                    },
                    "skills": ["grammar"],
                    "difficulty": 1,
                    "targetVocab": ["condición", "imposible"],
                    "scoring": {"mode": "all_or_nothing"}
                },
                {
                    "id": "b2_cond_6_speak",
                    "type": "speak_with_text",
                    "instructionAr": "انطق جملة النصيحة الافتراضية بنبرة حكيمة وهادئة.",
                    "stemEs": "Si yo fuera tú, aceptaría la oferta.",
                    "stemAr": "لو كنتُ مكانك، لقبلتُ العرض.",
                    "answerKey": {
                        "referenceAudioKey": "pending/b2-cond-amigos-1",
                        "modelAnswer": "Si yo fuera tú, aceptaría la oferta."
                    },
                    "explanationAr": "احرص على مد الياء في aceptaría لوجود النبرة المكتوبة (tilde) على حرف í، وسلاسة وصل yo fuera tú.",
                    "skills": ["speaking", "pronunciation"],
                    "difficulty": 2,
                    "targetVocab": ["fuera"],
                    "scoring": {
                        "mode": "rubric",
                        "rubric": [
                            {"labelAr": "النبر على مقطع rí في aceptaría", "weight": 50, "code": "stress_aceptaria"},
                            {"labelAr": "وصل yo fuera tú دون توقف", "weight": 50, "code": "liaison_yo_fuera"}
                        ]
                    }
                }
            ],
            "review": {
                "status": "draft",
                "authors": ["فريق المنهج — استخراج تربوي من سلسلة Aula 5 وسلسلة Sueña 3"],
                "spanishReviewer": None,
                "translationReviewer": None,
                "reviewedAt": None,
                "notes": "الدرس يقدم الجمل الشرطية الافتراضية عبر الموازنة مع أداة (لو) في العربية وينهي خطأ وضع Condicional بعد Si."
            }
        }
    },
    {
        "dir": "content/drafts/b2",
        "filename": "lesson-b2-conectores-argumentativos.json",
        "lesson": {
            "slug": "b2-conectores-argumentativos",
            "titleAr": "روابط الخطاب والمحاجة: Sin embargo و No obstante",
            "level": "B2",
            "programSlug": "main-track",
            "unitSlug": "b2-u1-argument",
            "objectiveAr": "أن يستخدم المتعلم الروابط الحجاجية المتقدمة (Sin embargo, No obstante, En cambio, Por lo tanto, A pesar de que) لتنظيم الأفكار المعقدة والرد على الحجج المضادة في مقال أو نقاش أكاديمي ومهني.",
            "estimatedMinutes": 12,
            "skills": ["grammar", "reading", "writing", "listening", "vocabulary"],
            "newVocabulary": ["embargo", "obstante", "cambio", "consecuencia", "argumento", "pesar"],
            "reviewVocabulary": ["trabajo", "tiempo", "sociedad", "bien"],
            "targetStructures": [
                "Oposición y contraste: Sin embargo / No obstante / En cambio",
                "Causa y consecuencia: Por lo tanto / Por consiguiente / En consecuencia",
                "Concesión: A pesar de que + Indicativo/Subjuntivo"
            ],
            "grammarTopics": ["conectores-discursivos-b2", "argumentacion-academica"],
            "scenarios": [
                {
                    "contextAr": "مناظرة اقتصادية وأكاديمية حول تأثير الذكاء الاصطناعي على أسواق العمل في إسبانيا والعالم العربي.",
                    "settingAr": "مدرج جامعي، مؤتمر اقتصادي",
                    "lines": [
                        {
                            "es": "La inteligencia artificial aumentará la productividad en todos los sectores.",
                            "ar": "سيزيد الذكاء الاصطناعي من الإنتاجية في جميع القطاعات.",
                            "arEg": "الذكاء الاصطناعي هيزود الإنتاجية في كل المجالات.",
                            "audioKey": "pending/b2-conec-debate-1"
                        },
                        {
                            "es": "Sin embargo, puede destruir miles de puestos de trabajo tradicionales.",
                            "ar": "ومع ذلك، فإنه قد يقضي على آلاف الوظائف التقليدية.",
                            "arEg": "بس مع ذلك، ممكن يضيع آلاف الوظائف العادية.",
                            "audioKey": "pending/b2-conec-debate-2"
                        },
                        {
                            "es": "No obstante, la historia demuestra que la tecnología siempre crea nuevas profesiones.",
                            "ar": "بيد أن التاريخ يثبت أن التكنولوجيا تخلق دائمًا مهنًا جديدة.",
                            "arEg": "مع ذلك، التاريخ بيثبت إن التكنولوجيا دايماً بتخلق شغلانات جديدة.",
                            "audioKey": "pending/b2-conec-debate-3"
                        },
                        {
                            "es": "Por lo tanto, la solución radica en formar a los trabajadores para el futuro.",
                            "ar": "ومن ثَمّ، فإن الحل يكمن في تدريب العمال وتأهيلهم للمستقبل.",
                            "arEg": "وبالتالي، الحل يكمن في إننا ندرب الناس للمستقبل.",
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
                    "instructionAr": "استمع إلى المناظرة واختر النتيجة والاستنتاج النهائي الذي اقترحه المتحدث الأخير.",
                    "audioKey": "pending/b2-conec-debate-4",
                    "speechEs": "Por lo tanto, la solución radica en formar a los trabajadores para el futuro.",
                    "options": [
                        {"id": "b2_conec_1_a", "text": "تدريب العمال وتأهيلهم لوظائف المستقبل", "isCorrect": True, "textAr": "تدريب العمال وتأهيلهم"},
                        {"id": "b2_conec_1_b", "text": "منع استخدام التكنولوجيا الحديثة فورًا", "isCorrect": False, "textAr": "منع التكنولوجيا", "distractorRationaleAr": "لم يطالب بمنع التكنولوجيا بل بالتدريب والتأقلم."},
                        {"id": "b2_conec_1_c", "text": "إغلاق جميع الشركات التقليدية", "isCorrect": False, "textAr": "إغلاق الشركات", "distractorRationaleAr": "لم يتطرق إلى الإغلاق."}
                    ],
                    "answerKey": {"correctOptionIds": ["b2_conec_1_a"]},
                    "explanationAr": "استخدم المتحدث الرابط الاستنتاجي «Por lo tanto» (بناءً على ذلك / ومن ثم) لطرح الخلاصة والحل العملي.",
                    "errorFeedback": {
                        "b2_conec_1_b": "الحل كان التأهيل والتدريب وليس الحظر.",
                        "b2_conec_1_c": "لم يذكر الإغلاق."
                    },
                    "skills": ["listening"],
                    "difficulty": 1,
                    "targetVocab": ["consecuencia"],
                    "scoring": {"mode": "all_or_nothing"}
                },
                {
                    "id": "b2_conec_2_contrast_pair",
                    "type": "word_choice",
                    "instructionAr": "أيّ من الروابط الآتية يُستخدم للتعبير عن الاستدراك والتعارض (يقابل «بيد أن / مع ذلك» في العربية)؟",
                    "options": [
                        {"id": "b2_conec_2_a", "text": "No obstante / Sin embargo", "isCorrect": True, "textAr": "روابط الاستدراك والتعارض"},
                        {"id": "b2_conec_2_b", "text": "Por lo tanto / Por consiguiente", "isCorrect": False, "textAr": "روابط النتيجة والسبب", "distractorRationaleAr": "هذه روابط استنتاج ونتيجة (وبالتالي)."},
                        {"id": "b2_conec_2_c", "text": "En primer lugar / Para empezar", "isCorrect": False, "textAr": "روابط الترتيب والبدء", "distractorRationaleAr": "هذه روابط لتنظيم وترتيب الفقرات في بداية المقال."}
                    ],
                    "answerKey": {"correctOptionIds": ["b2_conec_2_a"]},
                    "explanationAr": "الرابطان «Sin embargo» و «No obstante» هما أرقى أدوات الاستدراك والتقابل في الخطاب المتقدم (المستوى B2/C1).",
                    "errorFeedback": {
                        "b2_conec_2_b": "هذه تفيد النتيجة والسببية.",
                        "b2_conec_2_c": "هذه روابط استهلالية للترتيب."
                    },
                    "skills": ["reading", "vocabulary"],
                    "difficulty": 1,
                    "targetVocab": ["embargo", "obstante"],
                    "scoring": {"mode": "all_or_nothing"}
                },
                {
                    "id": "b2_conec_3_fill_however",
                    "type": "fill_blank",
                    "instructionAr": "أكمل الفراغ برابط الاستدراك المناسب: «الخطة طموحة، ومع ذلك فإن تكلفتها باهظة».",
                    "stemEs": "El plan es muy ambicioso; ____, su coste es demasiado elevado.",
                    "stemAr": "الخطة طموحة للغاية؛ ____، فإن تكلفتها باهظة جدًا.",
                    "options": [
                        {"id": "b2_conec_3_a", "text": "sin embargo", "isCorrect": True, "textAr": "مع ذلك / غير أن"},
                        {"id": "b2_conec_3_b", "text": "por eso", "isCorrect": False, "textAr": "لذلك", "distractorRationaleAr": "التكلفة الباهظة تناقض الطموح وتستدرك عليه وليست نتيجة مباشرة له."},
                        {"id": "b2_conec_3_c", "text": "porque", "isCorrect": False, "textAr": "لأن", "distractorRationaleAr": "porque تعلل ولا تفيد الاستدراك بعد الفاصلة المنقوطة."},
                        {"id": "b2_conec_3_d", "text": "además", "isCorrect": False, "textAr": "بالإضافة إلى", "distractorRationaleAr": "además تفيد الإضافة في نفس الاتجاه وليس التعارض."}
                    ],
                    "answerKey": {"correctOptionIds": ["b2_conec_3_a"]},
                    "explanationAr": "توضع الفاصلة المنقوطة متبوعة بـ «sin embargo,» أو «no obstante,» للربط بين فكرتين متعارضتين أو لإيراد استدراك قوي.",
                    "errorFeedback": {
                        "b2_conec_3_b": "por eso تفيد النتيجة.",
                        "b2_conec_3_c": "porque تفيد التعليل.",
                        "b2_conec_3_d": "además تفيد الإضافة الإيجابية."
                    },
                    "skills": ["writing", "grammar"],
                    "difficulty": 2,
                    "targetVocab": ["embargo"],
                    "scoring": {"mode": "all_or_nothing"}
                },
                {
                    "id": "b2_conec_4_fill_conclusion",
                    "type": "fill_blank",
                    "instructionAr": "أكمل الفراغ برابط الاستنتاج المنطقي: «لم نصل إلى الاتفاق المطلوب، وبالتالي أُلغيت الصفقة».",
                    "stemEs": "No alcanzamos un acuerdo; ____, se canceló la operación.",
                    "stemAr": "لم نتوصل إلى اتفاق؛ ____، تم إلغاء العملية.",
                    "options": [
                        {"id": "b2_conec_4_a", "text": "por consiguiente", "isCorrect": True, "textAr": "بناءً على ذلك / بالتبعية"},
                        {"id": "b2_conec_4_b", "text": "a pesar de", "isCorrect": False, "textAr": "على الرغم من", "distractorRationaleAr": "a pesar de تفيد التنازل ولا تبدأ جملة استنتاجية بعد فاصلة منقوطة بهذا الشكل."},
                        {"id": "b2_conec_4_c", "text": "en cambio", "isCorrect": False, "textAr": "في المقابل", "distractorRationaleAr": "en cambio للمقارنة بين طرفين وليس لإيراد نتيجة."},
                        {"id": "b2_conec_4_d", "text": "mientras", "isCorrect": False, "textAr": "بينما", "distractorRationaleAr": "mientras ظرف زمني."}
                    ],
                    "answerKey": {"correctOptionIds": ["b2_conec_4_a"]},
                    "explanationAr": "الرابط «Por consiguiente» أو «Por lo tanto» هو الرابط الرسمي الرصين للتعبير عن النتيجة الحتمية المترتبة على المعطى السابق.",
                    "errorFeedback": {
                        "b2_conec_4_b": "a pesar de لا تفيد الاستنتاج.",
                        "b2_conec_4_c": "en cambio للمقارنة بين شيئين.",
                        "b2_conec_4_d": "mientras زمنية."
                    },
                    "skills": ["writing", "reading"],
                    "difficulty": 2,
                    "targetVocab": ["consecuencia"],
                    "scoring": {"mode": "all_or_nothing"}
                },
                {
                    "id": "b2_conec_5_en_cambio",
                    "type": "fill_blank",
                    "instructionAr": "أكمل الفراغ برابط المقابلة بين أمرين: «علي يفضل العمل المكتبي، في المقابل أخوه يفضل السفر».",
                    "stemEs": "Ali prefiere trabajar en la oficina; ____, su hermano prefiere viajar continuamente.",
                    "stemAr": "علي يفضل العمل في المكتب؛ ____، شقيقه يفضل السفر باستمرار.",
                    "options": [
                        {"id": "b2_conec_5_a", "text": "en cambio", "isCorrect": True, "textAr": "في المقابل / على النقيض"},
                        {"id": "b2_conec_5_b", "text": "por lo tanto", "isCorrect": False, "textAr": "لذلك", "distractorRationaleAr": "تفضيل الأخ للسفر ليس نتيجة لرأي علي بل نقيض ومقابلة له."},
                        {"id": "b2_conec_5_c", "text": "porque", "isCorrect": False, "textAr": "لأن", "distractorRationaleAr": "لا تفيد المقابلة بين شخصين."},
                        {"id": "b2_conec_5_d", "text": "así que", "isCorrect": False, "textAr": "لذا", "distractorRationaleAr": "así que تفيد النتيجة في اللغة الدارجة."}
                    ],
                    "answerKey": {"correctOptionIds": ["b2_conec_5_a"]},
                    "explanationAr": "«En cambio» هو الرابط المثالي للمقابلة بين خيارين أو مقارنة حالتين مختلفتين لشخصين أو شيئين (يقابل في العربية: «في المقابل / على العكس من ذلك»).",
                    "errorFeedback": {
                        "b2_conec_5_b": "ليست علاقة سبب ونتيجة.",
                        "b2_conec_5_c": "ليست علاقة تعليل.",
                        "b2_conec_5_d": "ليست نتيجة عامية."
                    },
                    "skills": ["reading", "vocabulary"],
                    "difficulty": 2,
                    "targetVocab": ["cambio"],
                    "scoring": {"mode": "all_or_nothing"}
                },
                {
                    "id": "b2_conec_6_speak",
                    "type": "speak_with_text",
                    "instructionAr": "انطق الجملة الحجاجية بنبرة أكاديمية واثقة مع التوقف الخفيف بعد الوقفات.",
                    "stemEs": "Es un proyecto difícil; sin embargo, es necesario.",
                    "stemAr": "إنه مشروع صعب؛ ومع ذلك، فهو ضروري.",
                    "answerKey": {
                        "referenceAudioKey": "pending/b2-conec-debate-2",
                        "modelAnswer": "Es un proyecto difícil; sin embargo, es necesario."
                    },
                    "explanationAr": "ضع سكتة صوتية قصيرة (وقفة تنفسية) قبل وبعد «sin embargo» كما يقتضي التنغيم الخطابي الإسباني الفصيح.",
                    "skills": ["speaking", "pronunciation"],
                    "difficulty": 2,
                    "targetVocab": ["embargo"],
                    "scoring": {
                        "mode": "rubric",
                        "rubric": [
                            {"labelAr": "الوقفة التنغيمية الصحيحة مع sin embargo", "weight": 50, "code": "pause_sin_embargo"},
                            {"labelAr": "نطق حرف c في difícil و necesario كثاء", "weight": 50, "code": "pron_c_theta"}
                        ]
                    }
                }
            ],
            "review": {
                "status": "draft",
                "authors": ["فريق المنهج — استخراج تربوي من سلسلة Aula 5 وسلسلة Sueña 3"],
                "spanishReviewer": None,
                "translationReviewer": None,
                "reviewedAt": None,
                "notes": "الدرس يزود الدارس بأدوات المحاجة والربط الخطابي الأكاديمي والمهني لبلوغ مستوى الإتقان B2."
            }
        }
    },

    # =========================================================================
    # C1: Unit c1-u1-style (الدقة الأسلوبية والتعبير المتقدم)
    # =========================================================================
    {
        "dir": "content/drafts/c1",
        "filename": "lesson-c1-precision-estilistica.json",
        "lesson": {
            "slug": "c1-precision-estilistica",
            "titleAr": "الدقة الأسلوبية: اختيار الأفعال النوعية بدل الأفعال العامة",
            "level": "C1",
            "programSlug": "main-track",
            "unitSlug": "c1-u1-style",
            "objectiveAr": "أن يستبدل المتعلم الأفعال العامة الخالية من الدلالة الدقيقة (مثل hacer, tener, decir, poner) بأفعال فصيحة نوعية تعبر عن المقصد بدقة بالغة في السياقات الأكاديمية والمهنية الرفيعة.",
            "estimatedMinutes": 12,
            "skills": ["grammar", "reading", "writing", "listening", "vocabulary"],
            "newVocabulary": ["formular", "manifestar", "desempeñar", "suscitar", "precisión", "matiz"],
            "reviewVocabulary": ["trabajo", "pregunta", "sociedad", "tiempo"],
            "targetStructures": [
                "hacer una pregunta -> FORMULAR una pregunta",
                "hacer un papel -> DESEMPEÑAR un papel crucial",
                "decir una opinión -> MANIFESTAR / EXPRESAR una postura",
                "tener miedo/dudas -> EXPERIMENTAR temor / ABRIGAR dudas",
                "poner un ejemplo -> CITAR / ILUSTRAR con un ejemplo",
                "causar polémica -> SUSCITAR una viva controversia"
            ],
            "grammarTopics": ["precision-lexica-c1", "deslexicalizacion-verbos"],
            "scenarios": [
                {
                    "contextAr": "مناقشة أطروحة دكتوراه في العلوم الإنسانية في جامعة مدريد المستقلة (UAM).",
                    "settingAr": "قاعة المناقشات الكبرى بالجامعة",
                    "lines": [
                        {
                            "es": "El doctorando desempeñó una labor de investigación encomiable.",
                            "ar": "قام الباحث (طالب الدكتوراه) بجهد بحثي جدير بالثناء والتقدير.",
                            "arEg": "الباحث عمل شغل بحثي يشرف ومحترم جداً.",
                            "audioKey": "pending/c1-style-tesis-1"
                        },
                        {
                            "es": "Su hipótesis sobre las raíces andalusíes suscitó un vivo debate en el tribunal.",
                            "ar": "أثارت فرضيته حول الجذور الأندلسية نقاشًا حيويًا ومثمرًا في لجنة التحكيم.",
                            "arEg": "فكرته عن الجذور الأندلسية عملت نقاش جامد في لجنة الحكم.",
                            "audioKey": "pending/c1-style-tesis-2"
                        },
                        {
                            "es": "¿Quisiera algún miembro de la mesa formular alguna objeción adicional?",
                            "ar": "هل يود أي عضو من أعضاء المنصة طرح أي اعتراض إضافي؟",
                            "arEg": "حد من الدكاترة يحب يطرح أي سؤال أو تعليق تاني؟",
                            "audioKey": "pending/c1-style-tesis-3"
                        },
                        {
                            "es": "Solo deseo manifestar mi más sincera felicitación por el rigor metodológico mostrado.",
                            "ar": "أرغب فقط في الإعراب عن خالص تهنئتي على الدقة المنهجية التي ظهرت في البحث.",
                            "arEg": "عايز بس أعبّر عن خالص تهنئتي على الدقة العلمية دي.",
                            "audioKey": "pending/c1-style-tesis-4"
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
                    "id": "c1_prec_1_listen",
                    "type": "listen_choose",
                    "instructionAr": "استمع إلى رئيس اللجنة واختر التعبير الراقي الذي استخدمه لطرح السؤال/الاعتراض.",
                    "audioKey": "pending/c1-style-tesis-3",
                    "speechEs": "¿Quisiera algún miembro de la mesa formular alguna objeción adicional?",
                    "options": [
                        {"id": "c1_prec_1_a", "text": "formular alguna objeción (صياغة اعتراض / طرحه)", "isCorrect": True, "textAr": "formular objeción"},
                        {"id": "c1_prec_1_b", "text": "hacer una queja (تقديم شكوى)", "isCorrect": False, "textAr": "hacer queja", "distractorRationaleAr": "لم يقل hacer una queja، فهذا أسلوب دارج لا يناسب مناقشة أطروحة."},
                        {"id": "c1_prec_1_c", "text": "decir una cosa mala (قول شيء سيء)", "isCorrect": False, "textAr": "تعبير عامي", "distractorRationaleAr": "تعبير عامي مبتذل."}
                    ],
                    "answerKey": {"correctOptionIds": ["c1_prec_1_a"]},
                    "explanationAr": "في المستوى المتقدم C1 نستبدل الفعل العام «hacer una pregunta / hacer una objeción» بالفعل النوعي الدقيق «formular una objeción» (صياغة اعتراض علمي محكم).",
                    "errorFeedback": {
                        "c1_prec_1_b": "hacer una queja تعبير دارج.",
                        "c1_prec_1_c": "تعبير ركيك لا يناسب الأكاديميا."
                    },
                    "skills": ["listening"],
                    "difficulty": 1,
                    "targetVocab": ["formular"],
                    "scoring": {"mode": "all_or_nothing"}
                },
                {
                    "id": "c1_prec_2_role",
                    "type": "word_choice",
                    "instructionAr": "ما هو البديل الفصيح الراقي للعبارة العامة «hacer un papel importante»؟",
                    "options": [
                        {"id": "c1_prec_2_a", "text": "desempeñar un papel crucial (أداء دور حاسم)", "isCorrect": True, "textAr": "desempeñar un papel"},
                        {"id": "c1_prec_2_b", "text": "trabajar un papel grande (عمل دور كبير)", "isCorrect": False, "textAr": "trabajar un papel", "distractorRationaleAr": "تركيب ركيك وغير مألوف في الإسبانية."},
                        {"id": "c1_prec_2_c", "text": "poner un papel bueno (وضع دور جيد)", "isCorrect": False, "textAr": "poner un papel", "distractorRationaleAr": "poner لا تأتي مع papel بهذا المعنى المجازي."}
                    ],
                    "answerKey": {"correctOptionIds": ["c1_prec_2_a"]},
                    "explanationAr": "المصاحبة اللغوية (Colocación) الفصيحة للدور هي الفعل «desempeñar»: «Desempeñar un papel fundamental / crucial» (لعب دورًا محوريًا/أداء دور حاسم).",
                    "errorFeedback": {
                        "c1_prec_2_b": "trabajar un papel ركيكة لغويًا.",
                        "c1_prec_2_c": "poner un papel تعني وضع ورقة مادية."
                    },
                    "skills": ["vocabulary"],
                    "difficulty": 1,
                    "targetVocab": ["desempeñar"],
                    "scoring": {"mode": "all_or_nothing"}
                },
                {
                    "id": "c1_prec_3_fill_suscite",
                    "type": "fill_blank",
                    "instructionAr": "أكمل الفراغ بالفعل النوعي المعبر عن إثارة النقاش أو الخلاف: «أثار القرار جدلاً واسعًا».",
                    "stemEs": "La nueva ley ____ una intensa polémica en los medios de comunicación.",
                    "stemAr": "أثارت اللائحة الجديدة ____ واسعًا في وسائل الإعلام.",
                    "options": [
                        {"id": "c1_prec_3_a", "text": "suscitó", "isCorrect": True, "textAr": "أثارت / فجرت (جدلاً)"},
                        {"id": "c1_prec_3_b", "text": "hizo", "isCorrect": False, "textAr": "عملت (فعل عام)", "distractorRationaleAr": "hizo polémica ركيكة جدًا ولا تليق بمستوى C1."},
                        {"id": "c1_prec_3_c", "text": "puso", "isCorrect": False, "textAr": "وضعت", "distractorRationaleAr": "poner لا تأتي مع polémica."},
                        {"id": "c1_prec_3_d", "text": "dio", "isCorrect": False, "textAr": "أعطت", "distractorRationaleAr": "dar polémica غير مستخدمة."}
                    ],
                    "answerKey": {"correctOptionIds": ["c1_prec_3_a"]},
                    "explanationAr": "الفعل الأكاديمي والأسلوبي الرفيع لإثارة الجدل أو الفضول أو التساؤلات هو «suscitar»: «suscitar polémica / suscitar dudas» (أثار جدلاً / شكوكًا).",
                    "errorFeedback": {
                        "c1_prec_3_b": "hacer فعل عام مفرغ من الدقة.",
                        "c1_prec_3_c": "poner غير ملائمة دلاليًا.",
                        "c1_prec_3_d": "dar لا تتطابق مع هذا الاسم."
                    },
                    "skills": ["vocabulary", "writing"],
                    "difficulty": 2,
                    "targetVocab": ["suscitar"],
                    "scoring": {"mode": "all_or_nothing"}
                },
                {
                    "id": "c1_prec_4_fill_opinion",
                    "type": "fill_blank",
                    "instructionAr": "أكمل الفراغ ببديل الفعل decir في السياقات الدبلوماسية: «أعرب السفير عن قلقه الشديد».",
                    "stemEs": "El embajador ____ su profunda preocupación por los acontecimientos.",
                    "stemAr": "____ السفير عن قلقه البالغ إزاء التطورات الجارية.",
                    "options": [
                        {"id": "c1_prec_4_a", "text": "manifestó", "isCorrect": True, "textAr": "أعربَ / أظهرَ رسمياً"},
                        {"id": "c1_prec_4_b", "text": "dijo", "isCorrect": False, "textAr": "قال (فعل دارج بسيط)", "distractorRationaleAr": "dijo بسيط جداً ولا يناسب البيان الدبلوماسي الرسمي."},
                        {"id": "c1_prec_4_c", "text": "habló", "isCorrect": False, "textAr": "تحدث", "distractorRationaleAr": "habló لا تتعدى إلى مفعول مباشر كـ preocupación بهذا الشكل."},
                        {"id": "c1_prec_4_d", "text": "contó", "isCorrect": False, "textAr": "روى / حكى", "distractorRationaleAr": "contó تعني سرد قصة."}
                    ],
                    "answerKey": {"correctOptionIds": ["c1_prec_4_a"]},
                    "explanationAr": "في الخطاب الدبلوماسي والإعلامي الرفيع (C1)، يُستبدل decir بالأفعال النوعية: «manifestar / expresar / declarar su preocupación».",
                    "errorFeedback": {
                        "c1_prec_4_b": "dijo عامي بسيط.",
                        "c1_prec_4_c": "habló غير متعدية للمفعول هنا.",
                        "c1_prec_4_d": "contó للسرد القصصي."
                    },
                    "skills": ["vocabulary", "writing"],
                    "difficulty": 2,
                    "targetVocab": ["manifestar"],
                    "scoring": {"mode": "all_or_nothing"}
                },
                {
                    "id": "c1_prec_5_match_collocations",
                    "type": "word_choice",
                    "instructionAr": "أي الأفعال الآتية يقترن بكلمة «dudas» (شكوك) ليعبر عن معنى (ساورته الشكوك / خالجته الريبة)؟",
                    "options": [
                        {"id": "c1_prec_5_a", "text": "Abrigarse / Albergar dudas (إيواء الشكوك واحتضانها)", "isCorrect": True, "textAr": "Albergar dudas"},
                        {"id": "c1_prec_5_b", "text": "Comer dudas (أكل الشكوك)", "isCorrect": False, "textAr": "تعبير خاطئ", "distractorRationaleAr": "لا وجود لهذا التعبير."},
                        {"id": "c1_prec_5_c", "text": "Caminar dudas (مشي الشكوك)", "isCorrect": False, "textAr": "تعبير خاطئ", "distractorRationaleAr": "لا وجود لهذا التعبير."}
                    ],
                    "answerKey": {"correctOptionIds": ["c1_prec_5_a"]},
                    "explanationAr": "من أبلغ التعبيرات الإسبانية الأدبية في مستوى C1 استخدام «Albergar dudas» أو «Abrigarse de dudas» للتعبير عن الشكوك التي تستقر في النفس.",
                    "errorFeedback": {
                        "c1_prec_5_b": "تركيب وهمي.",
                        "c1_prec_5_c": "تركيب وهمي."
                    },
                    "skills": ["vocabulary"],
                    "difficulty": 2,
                    "targetVocab": ["precisión", "matiz"],
                    "scoring": {"mode": "all_or_nothing"}
                },
                {
                    "id": "c1_prec_6_speak",
                    "type": "speak_with_text",
                    "instructionAr": "انطق الجملة الأكاديمية بنبرة فصيحة ومخارج حروف واضحة.",
                    "stemEs": "El investigador formuló una hipótesis novedosa.",
                    "stemAr": "صاغ الباحث فرضية مبتكرة ومستحدثة.",
                    "answerKey": {
                        "referenceAudioKey": "pending/c1-style-tesis-1",
                        "modelAnswer": "El investigador formuló una hipótesis novedosa."
                    },
                    "explanationAr": "انطق h الصامتة في hipótesis دون أي أثر صوتي، وضع النبرة على حرف o لوجود النبرة المكتوبة (tilde): hipó-tesis.",
                    "skills": ["speaking", "pronunciation"],
                    "difficulty": 2,
                    "targetVocab": ["formular", "precisión"],
                    "scoring": {
                        "mode": "rubric",
                        "rubric": [
                            {"labelAr": "النبر على مقطع pó في hipótesis", "weight": 50, "code": "stress_hipotesis"},
                            {"labelAr": "نطق حرف g في investigador كخاء", "weight": 50, "code": "pron_g_inves"}
                        ]
                    }
                }
            ],
            "review": {
                "status": "draft",
                "authors": ["فريق المنهج — استخراج تربوي من سلسلة Aula Plus 7 (C1)"],
                "spanishReviewer": None,
                "translationReviewer": None,
                "reviewedAt": None,
                "notes": "الدرس يرتقي بالدارس إلى مستوى الإتقان الأسلوبي C1 عبر استبدال الأفعال العامة بأفعال تخصصية نوعية."
            }
        }
    }
]

def main():
    print("=== توليد الدروس التفاعلية المستخرجة من أمهات الكتب الإسبانية ===")
    
    # 1. Write the lesson files
    for item in LESSONS:
        target_dir = ROOT / item["dir"]
        target_dir.mkdir(parents=True, exist_ok=True)
        target_file = target_dir / item["filename"]
        
        doc = {
            "schemaVersion": "1.0.0",
            "lesson": item["lesson"]
        }
        
        with open(target_file, "w", encoding="utf-8") as f:
            json.dump(doc, f, ensure_ascii=False, indent=2)
            f.write("\n")
        print(f"✅ تم إنشاء ملف الدرس: {item['dir']}/{item['filename']} ({item['lesson']['slug']})")

    # 2. Update paths.json for each directory: a2, b1, b2, c1
    # Check what paths.json need to be created/updated
    level_units_lessons = {
        "a2": {
            "levelCode": "A2",
            "unitSlug": "a2-u2-past",
            "unitTitleAr": "الحكاية في الماضي",
            "sortOrder": 2,
            "lessons": [
                "a2-indefinido-regular",
                "a2-indefinido-irregular",
                "a2-imperfecto-habitos",
                "a2-indefinido-vs-imperfecto"
            ]
        },
        "b1": {
            "levelCode": "B1",
            "unitSlug": "b1-u2-opinions",
            "unitTitleAr": "الرأي والاتفاق والمنصوب",
            "sortOrder": 2,
            "lessons": [
                "b1-expresar-opinion-creo-que",
                "b1-subjuntivo-deseos",
                "b1-por-vs-para",
                "b1-acuerdo-desacuerdo"
            ]
        },
        "b2": {
            "levelCode": "B2",
            "unitSlug": "b2-u1-argument",
            "unitTitleAr": "بناء الحجة والشرط الافتراضي",
            "sortOrder": 1,
            "lessons": [
                "b2-condicional-imperfecto-subjuntivo",
                "b2-conectores-argumentativos"
            ]
        },
        "c1": {
            "levelCode": "C1",
            "unitSlug": "c1-u1-style",
            "unitTitleAr": "الدقة الأسلوبية والتعبير المتقدم",
            "sortOrder": 1,
            "lessons": [
                "c1-precision-estilistica"
            ]
        }
    }

    for lvl, info in level_units_lessons.items():
        dir_path = ROOT / f"content/drafts/{lvl}"
        paths_file = dir_path / "paths.json"
        
        paths_data = {
            "schemaVersion": "1.0.0",
            "programs": [
                {
                    "slug": "main-track",
                    "kind": "main",
                    "titleAr": "المسار الأساسي: من الصفر إلى C1",
                    "levelCode": info["levelCode"],
                    "category": "core",
                    "objectiveAr": f"المسار الأساسي للمستوى {info['levelCode']}.",
                    "units": [
                        {
                            "slug": info["unitSlug"],
                            "levelCode": info["levelCode"],
                            "titleAr": info["unitTitleAr"],
                            "sortOrder": info["sortOrder"],
                            "status": "draft",
                            "lessons": info["lessons"],
                            "vocabularyBundles": []
                        }
                    ]
                }
            ]
        }
        
        with open(paths_file, "w", encoding="utf-8") as f:
            json.dump(paths_data, f, ensure_ascii=False, indent=2)
            f.write("\n")
        print(f"✅ تم تحديث paths.json: content/drafts/{lvl}/paths.json")

    print("\nتم اكتمال توليد جميع الدروس وهياكل المسارات بنجاح.")

if __name__ == "__main__":
    main()
