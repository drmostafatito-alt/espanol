#!/usr/bin/env python3
"""
tools/books/add_remaining_lessons.py
Generates the remaining 5 lessons to complete the 4-lesson units for B2 and C1:
  - B2: b2-matizar-opiniones, b2-contraargumentacion
  - C1: c1-nominalizacion, c1-refranes-modismos, c1-correspondencia-formal
Updates paths.json for B2 and C1.
"""

import json
import os
import sys
from pathlib import Path

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")

ROOT = Path(__file__).resolve().parent.parent.parent

EXTRA_LESSONS = [
    # -------------------------------------------------------------
    # B2: b2-matizar-opiniones
    # -------------------------------------------------------------
    {
        "dir": "content/drafts/b2",
        "filename": "lesson-b2-matizar-opiniones.json",
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
                        {"id": "b2_matiz_1_a", "text": "Hasta cierto punto es verdad (إلى حد ما هذا صحيح)", "isCorrect": True, "textAr": "Hasta cierto punto"},
                        {"id": "b2_matiz_1_b", "text": "No tienes ni idea de urbanismo (ليس لديك فكرة عن التخطيط)", "isCorrect": False, "textAr": "عبارة هجومية", "distractorRationaleAr": "عبارة هجومية غير لائقة."},
                        {"id": "b2_matiz_1_c", "text": "Estoy totalmente en contra (أنا ضد الفكرة تمامًا)", "isCorrect": False, "textAr": "رفض مطلق", "distractorRationaleAr": "لم يعلن رفضاً مطلقاً بل تحفّظاً جزئياً."}
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
                        {"id": "b2_matiz_2_a", "text": "Cabría añadir que... (وتجدر الإضافة إلى أن...)", "isCorrect": True, "textAr": "Cabría añadir que"},
                        {"id": "b2_matiz_2_b", "text": "Tienes que saber que... (يجب عليك أن تعلم)", "isCorrect": False, "textAr": "أسلوب فظ", "distractorRationaleAr": "أسلوب إلزامي فظ لا يناسب التحفظ الدبلوماسي."},
                        {"id": "b2_matiz_2_c", "text": "Es obligatorio decir que... (من الإجباري القول)", "isCorrect": False, "textAr": "أسلوب قسري", "distractorRationaleAr": "غير مألوف في لغة الحوار الراقي."}
                    ],
                    "answerKey": {"correctOptionIds": ["b2_matiz_2_a"]},
                    "explanationAr": "صيغة «Cabría añadir / señalar» (مشتقة من الفعل caber في صيغة condicional) تعبر عن قمة الأدب الأكاديمي والتحفظ البلاغي في إبداء الملاحظات.",
                    "errorFeedback": {
                        "b2_matiz_2_b": "أسلوب استعلائي.",
                        "b2_matiz_2_c": "تعبير ركيك."
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
                    "options": [
                        {"id": "b2_matiz_3_a", "text": "parte", "isCorrect": True, "textAr": "جزء (En parte)"},
                        {"id": "b2_matiz_3_b", "text": "todo", "isCorrect": False, "textAr": "كل", "distractorRationaleAr": "En todo لا تفيد التعديل والتحفظ الجزئي."},
                        {"id": "b2_matiz_3_c", "text": "nada", "isCorrect": False, "textAr": "لا شيء", "distractorRationaleAr": "En nada نفي كلي يناقض كلمة verdad."},
                        {"id": "b2_matiz_3_d", "text": "tiempo", "isCorrect": False, "textAr": "وقت", "distractorRationaleAr": "En tiempo لا تفيد المعنى المطلوب."}
                    ],
                    "answerKey": {"correctOptionIds": ["b2_matiz_3_a"]},
                    "explanationAr": "التعبير الثابت «En parte es verdad» يعني (في جزء منه هذا صحيح)، ويُستخدم لتفادي الرفض الفج والتمهيد للاعتراض المهذب.",
                    "errorFeedback": {
                        "b2_matiz_3_b": "En todo تعني كلياً.",
                        "b2_matiz_3_c": "En nada تنفي تماماً.",
                        "b2_matiz_3_d": "tiempo لا تناسب هذا السياق."
                    },
                    "skills": ["writing", "vocabulary"],
                    "difficulty": 2,
                    "targetVocab": ["verdad"],
                    "scoring": {"mode": "all_or_nothing"}
                },
                {
                    "id": "b2_matiz_4_fill_perspective",
                    "type": "fill_blank",
                    "instructionAr": "أكمل الفراغ بالعبارة الدالة على زاوية الرؤية: «من هذا المنظور...».",
                    "stemEs": "Desde esa ____, el proyecto resulta muy conveniente.",
                    "stemAr": "من ذلك ____، يبدو المشروع مناسبًا للغاية.",
                    "options": [
                        {"id": "b2_matiz_4_a", "text": "perspectiva", "isCorrect": True, "textAr": "منظور / زاوية نظر"},
                        {"id": "b2_matiz_4_b", "text": "distancia", "isCorrect": False, "textAr": "مسافة مكانية", "distractorRationaleAr": "المقصود هنا المنظور الفكري وليس المسافة الجغرافية."},
                        {"id": "b2_matiz_4_c", "text": "hora", "isCorrect": False, "textAr": "ساعة زمنية", "distractorRationaleAr": "غير مطابقة للمعنى الحجاجي."},
                        {"id": "b2_matiz_4_d", "text": "calle", "isCorrect": False, "textAr": "شارع", "distractorRationaleAr": "غير ملائمة."}
                    ],
                    "answerKey": {"correctOptionIds": ["b2_matiz_4_a"]},
                    "explanationAr": "«Desde esa perspectiva» (من هذا المنظور / من تلك الزاوية) من التعبيرات الجوهرية في الخطاب البلاغي المتقدم لربط الحجج وإعادة تقييم المواقف.",
                    "errorFeedback": {
                        "b2_matiz_4_b": "المسافة الجغرافية غير مقصودة.",
                        "b2_matiz_4_c": "الساعة الزمنية لا تفيد المعنى.",
                        "b2_matiz_4_d": "calle شارع حقيقي."
                    },
                    "skills": ["reading", "vocabulary"],
                    "difficulty": 2,
                    "targetVocab": ["punto", "matiz"],
                    "scoring": {"mode": "all_or_nothing"}
                },
                {
                    "id": "b2_matiz_5_order",
                    "type": "word_order",
                    "instructionAr": "رتّب الكلمات لتكوين عبارة تحفظ مهذبة تبدأ بـ Hasta cierto punto.",
                    "contextAr": "إلى حد ما أتفق معك في هذه النقطة.",
                    "options": [
                        {"id": "b2_matiz_5_1", "text": "Hasta", "isCorrect": True, "textAr": "إلى"},
                        {"id": "b2_matiz_5_2", "text": "cierto", "isCorrect": True, "textAr": "حد"},
                        {"id": "b2_matiz_5_3", "text": "punto", "isCorrect": True, "textAr": "معين"},
                        {"id": "b2_matiz_5_4", "text": "coincido", "isCorrect": True, "textAr": "أتفق"},
                        {"id": "b2_matiz_5_5", "text": "contigo", "isCorrect": True, "textAr": "معك"},
                        {"id": "b2_matiz_5_6", "text": "en", "isCorrect": True, "textAr": "في"},
                        {"id": "b2_matiz_5_7", "text": "esto.", "isCorrect": True, "textAr": "هذا."}
                    ],
                    "answerKey": {
                        "accepted": [
                            "Hasta cierto punto coincido contigo en esto.",
                            "Hasta cierto punto coincido contigo en esto"
                        ]
                    },
                    "explanationAr": "الترتيب القياسي: Hasta cierto punto (عبارة التحفظ التمهيدية) + coincido contigo en esto (الاتفاق الجزئي).",
                    "skills": ["writing", "grammar"],
                    "difficulty": 3,
                    "targetVocab": ["punto", "matiz"],
                    "scoring": {"mode": "all_or_nothing"}
                },
                {
                    "id": "b2_matiz_6_speak",
                    "type": "speak_with_text",
                    "instructionAr": "انطق عبارة التحفظ بنبرة رصينة ومحايدة.",
                    "stemEs": "Hasta cierto punto es verdad lo que dices.",
                    "stemAr": "إلى حدّ ما ما تقوله صحيح.",
                    "answerKey": {
                        "referenceAudioKey": "pending/b2-matiz-urban-2",
                        "modelAnswer": "Hasta cierto punto es verdad lo que dices."
                    },
                    "explanationAr": "نطق c في cierto كثاء [θ] وسلاسة دمج lo que dices بنبر هادئ غير حاد.",
                    "skills": ["speaking", "pronunciation"],
                    "difficulty": 2,
                    "targetVocab": ["punto", "verdad"],
                    "scoring": {
                        "mode": "rubric",
                        "rubric": [
                            {"labelAr": "نطق c في cierto كثاء", "weight": 50, "code": "pron_c_cierto"},
                            {"labelAr": "الهدوء التنغيمي في العبارة", "weight": 50, "code": "intonation_matiz"}
                        ]
                    }
                }
            ],
            "review": {
                "status": "draft",
                "authors": ["فريق المنهج — استخراج تربوي من سلسلة Aula 5 وAula 6"],
                "spanishReviewer": None,
                "translationReviewer": None,
                "reviewedAt": None,
                "notes": "الدرس يدرب الدارس على فن التعديل والتحفظ الدبلوماسي وهو ركيزة التحدث الراقي في B2."
            }
        }
    },
    # -------------------------------------------------------------
    # B2: b2-contraargumentacion
    # -------------------------------------------------------------
    {
        "dir": "content/drafts/b2",
        "filename": "lesson-b2-contraargumentacion.json",
        "lesson": {
            "slug": "b2-contraargumentacion",
            "titleAr": "فن الرد والاعتراض المقنع: La Contraargumentación",
            "level": "B2",
            "programSlug": "main-track",
            "unitSlug": "b2-u1-argument",
            "objectiveAr": "أن يبني المتعلم حجة مضادة مقنعة باستخدام تقنية التسليم الجزئي للخصم ثم الرد الحاسم (Si bien es cierto que... no obstante / Es verdad que... pero) في الحوارات والمقالات الجدلية.",
            "estimatedMinutes": 12,
            "skills": ["grammar", "reading", "writing", "listening", "vocabulary"],
            "newVocabulary": ["argumento", "embargo", "obstante", "verdad", "cambio", "admitir"],
            "reviewVocabulary": ["tiempo", "sociedad", "trabajo", "bien"],
            "targetStructures": [
                "Técnica de concesión y refutación: Si bien es cierto que [argumento A], no obstante [contraargumento B]",
                "Es indudable que [tesis], pero convendría recordar que [antítesis]",
                "Por una parte... por otra parte..."
            ],
            "grammarTopics": ["contraargumentacion-b2", "concesion-refutacion"],
            "scenarios": [
                {
                    "contextAr": "مناظرة تلفزيونية ثقافية بين باحثين حول دور السياحة المكثفة في المدن التاريخية كغرناطة وقرطبة.",
                    "settingAr": "استوديو قناة تلفزيونية ثقافية في إشبيلية",
                    "lines": [
                        {
                            "es": "El turismo masivo genera riqueza inmediata y dinamiza la economía local.",
                            "ar": "السياحة المكثفة تولد ثروة فورية وتنعش الاقتصاد المحلي للمدن.",
                            "arEg": "السياحة بتجيب فلوس سريعة وبتنعش حركة الاقتصاد في البلد.",
                            "audioKey": "pending/b2-contra-tv-1"
                        },
                        {
                            "es": "Si bien es cierto que genera ingresos, no obstante provoca la expulsión de los vecinos del centro histórico.",
                            "ar": "لئن كان صحيحًا أنها تدرّ دخلاً، إلا أنها مع ذلك تؤدي إلى طرد السكان الأصليين من قلب المدينة التاريخي.",
                            "arEg": "صحيح إنها بتدخل دخل، بس مع ذلك بتطرد السكان الأصليين من وسط البلد التاريخي.",
                            "audioKey": "pending/b2-contra-tv-2"
                        },
                        {
                            "es": "Es verdad que encarece la vivienda, pero también financia la restauración de monumentos.",
                            "ar": "صحيح أنها ترفع أسعار الإيجارات، ولكنها تمول أيضًا ترميم المعالم التاريخية وصيانتها.",
                            "arEg": "صحيح بتغلي الإيجارات، بس برضه بتمول تصليح وترميم الآثار.",
                            "audioKey": "pending/b2-contra-tv-3"
                        },
                        {
                            "es": "El reto no consiste en frenar el turismo, sino en regularlo con criterios sostenibles.",
                            "ar": "ليس التحدي في كبح جماح السياحة، بل في تنظيمها وفق معايير الاستدامة.",
                            "arEg": "التحدي مش إننا نوقف السياحة، التحدي إننا ننظمها بمعايير مستدامة.",
                            "audioKey": "pending/b2-contra-tv-4"
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
                    "instructionAr": "استمع إلى الباحث المعارض واختر الحجة المقنعة التي أوردها ردًا على المكاسب المادية للسياحة.",
                    "audioKey": "pending/b2-contra-tv-2",
                    "speechEs": "Si bien es cierto que genera ingresos, no obstante provoca la expulsión de los vecinos del centro histórico.",
                    "options": [
                        {"id": "b2_contra_1_a", "text": "طرد السكان المحليين وتفريغ الأحياء التاريخية من أهلها", "isCorrect": True, "textAr": "طرد السكان المحليين"},
                        {"id": "b2_contra_1_b", "text": "انعدام المعالم الأثرية في غرناطة", "isCorrect": False, "textAr": "انعدام المعالم", "distractorRationaleAr": "المعالم موجودة بكثرة ولم يقل ذلك."},
                        {"id": "b2_contra_1_c", "text": "هبوط أسعار العقارات بصورة حادة", "isCorrect": False, "textAr": "هبوط العقارات", "distractorRationaleAr": "الأسعار ارتفعت ولم تهبط."}
                    ],
                    "answerKey": {"correctOptionIds": ["b2_contra_1_a"]},
                    "explanationAr": "استخدم الباحث أسلوب الحجة المضادة الكلاسيكي: سلّم بأنها تولد دخلاً («Si bien es cierto que genera ingresos»)، ثم نسفها بالنتيجة الاجتماعية السلبية («no obstante provoca la expulsión de los vecinos»).",
                    "errorFeedback": {
                        "b2_contra_1_b": "غرناطة مليئة بالآثار.",
                        "b2_contra_1_c": "العقارات غلت جداً."
                    },
                    "skills": ["listening"],
                    "difficulty": 1,
                    "targetVocab": ["argumento", "obstante"],
                    "scoring": {"mode": "all_or_nothing"}
                },
                {
                    "id": "b2_contra_2_structure",
                    "type": "word_choice",
                    "instructionAr": "ما هو الأسلوب الأكثر إقناعًا في بناء الحجة المضادة في الكتابة والنقاش؟",
                    "options": [
                        {"id": "b2_contra_2_a", "text": "التسليم الجزئي بنقطة الخصم ثم الرد عليها بدليل أقوى (Concesión y refutación)", "isCorrect": True, "textAr": "التسليم ثم الرد الحاسم"},
                        {"id": "b2_contra_2_b", "text": "إنكار كلام الخصم بالكامل وتكذيبه فورًا", "isCorrect": False, "textAr": "الإنكار المباشر", "distractorRationaleAr": "الإنكار المباشر يضعف الحجة ويجعل النقاش عناداً غير مقنع."},
                        {"id": "b2_contra_2_c", "text": "تجاهل حجة الخصم والحديث في موضوع آخر", "isCorrect": False, "textAr": "الهروب وتغيير الموضوع", "distractorRationaleAr": "مغالطة منطقية تسمى رجل القش أو الحياد عن الموضوع."}
                    ],
                    "answerKey": {"correctOptionIds": ["b2_contra_2_a"]},
                    "explanationAr": "تقنية «Concesión y refutación» هي جوهر البلاغة الأكاديمية: تظهر للمتلقي أنك عادل ومدرك لحجة الطرف الآخر، ثم تقدم الحجة المقابلة الأقوى.",
                    "errorFeedback": {
                        "b2_contra_2_b": "الإنكار يقلل من مصداقيتك الأكاديمية.",
                        "b2_contra_2_c": "تغيير الموضوع مغالطة منطقية."
                    },
                    "skills": ["reading"],
                    "difficulty": 1,
                    "targetVocab": ["argumento"],
                    "scoring": {"mode": "all_or_nothing"}
                },
                {
                    "id": "b2_contra_3_fill_sibien",
                    "type": "fill_blank",
                    "instructionAr": "أكمل الفراغ بالرابط الدال على التسليم المبدئي: «لئن كان صحيحًا أن... إلا أن...».",
                    "stemEs": "____ es verdad que el plan es costoso, sus beneficios superan los gastos.",
                    "stemAr": "____ كان صحيحًا أن الخطة مكلفة، إلا أن فوائدها تفوق تكاليفها.",
                    "options": [
                        {"id": "b2_contra_3_a", "text": "Si bien", "isCorrect": True, "textAr": "لئن / وإن كان (Si bien)"},
                        {"id": "b2_contra_3_b", "text": "Porque", "isCorrect": False, "textAr": "لأن", "distractorRationaleAr": "Porque للتعليل وليست للتسليم التنازلي المقابل."},
                        {"id": "b2_contra_3_c", "text": "Por lo tanto", "isCorrect": False, "textAr": "لذلك", "distractorRationaleAr": "Por lo tanto للنتيجة."},
                        {"id": "b2_contra_3_d", "text": "Para que", "isCorrect": False, "textAr": "لكي", "distractorRationaleAr": "Para que للهدف والغاية."}
                    ],
                    "answerKey": {"correctOptionIds": ["b2_contra_3_a"]},
                    "explanationAr": "الرابط البلاغي الرفيع «Si bien es verdad que...» يقابل في العربية الفصحى: «لئن كان صحيحًا أن... / ومع التسليم بأن...».",
                    "errorFeedback": {
                        "b2_contra_3_b": "Porque تعليلية.",
                        "b2_contra_3_c": "Por lo tanto استنتاجية.",
                        "b2_contra_3_d": "Para que للغايات."
                    },
                    "skills": ["writing", "grammar"],
                    "difficulty": 2,
                    "targetVocab": ["verdad"],
                    "scoring": {"mode": "all_or_nothing"}
                },
                {
                    "id": "b2_contra_4_fill_contrast",
                    "type": "fill_blank",
                    "instructionAr": "أكمل الجملة بصيغة الحصر والنفي البلاغي: «ليس الهدف منع كذا، بل...».",
                    "stemEs": "El objetivo no es prohibir la tecnología, ____ regular su uso ético.",
                    "stemAr": "ليس الهدف حظر التكنولوجيا، ____ تنظيم استخدامها الأخلاقي.",
                    "options": [
                        {"id": "b2_contra_4_a", "text": "sino", "isCorrect": True, "textAr": "بل (sino بعد نفي)"},
                        {"id": "b2_contra_4_b", "text": "pero", "isCorrect": False, "textAr": "لكن", "distractorRationaleAr": "بعد النفي الصريح (no... sino) نستخدم sino للإضراب والإثبات البديل، ولا نستخدم pero."},
                        {"id": "b2_contra_4_c", "text": "y", "isCorrect": False, "textAr": "و", "distractorRationaleAr": "حرف العطف y لا يفيد المقابلة والإضراب الحصري."},
                        {"id": "b2_contra_4_d", "text": "o", "isCorrect": False, "textAr": "أو", "distractorRationaleAr": "o للتخيير."}
                    ],
                    "answerKey": {"correctOptionIds": ["b2_contra_4_a"]},
                    "explanationAr": "قاعدة التفريق بين pero و sino: عندما تنفي شيئًا لتثبت بديله تمامًا نستخدم «sino» (تطابق حرف الإضراب «بَلْ» في العربية بعد نفي: ليس كذا بل كذا).",
                    "errorFeedback": {
                        "b2_contra_4_b": "pero للاستدراك العام، أما لنفي شيء وإثبات بديله نستخدم sino.",
                        "b2_contra_4_c": "حرف العطف y لا يفيد الإضراب.",
                        "b2_contra_4_d": "o للتخيير."
                    },
                    "skills": ["grammar", "reading"],
                    "difficulty": 2,
                    "targetVocab": ["argumento"],
                    "scoring": {"mode": "all_or_nothing"}
                },
                {
                    "id": "b2_contra_5_speak",
                    "type": "speak_with_text",
                    "instructionAr": "انطق الجملة الحجاجية مظهرًا التقابل الواضح بين طرفي التنازل والرد.",
                    "stemEs": "Si bien es difícil, no obstante es viable.",
                    "stemAr": "لئن كان صعبًا، إلا أنه مع ذلك قابل للتطبيق.",
                    "answerKey": {
                        "referenceAudioKey": "pending/b2-contra-tv-2",
                        "modelAnswer": "Si bien es difícil, no obstante es viable."
                    },
                    "explanationAr": "ضع نبرة هادئة على Si bien es difícil، ثم ارفع الصوت قليلاً عند no obstante لإبراز قوة الرد المنطقي.",
                    "skills": ["speaking", "pronunciation"],
                    "difficulty": 2,
                    "targetVocab": ["obstante"],
                    "scoring": {
                        "mode": "rubric",
                        "rubric": [
                            {"labelAr": "إبراز التباين التنغيمي بين الشطرين", "weight": 50, "code": "intonation_contrast"},
                            {"labelAr": "نطق حرف b في viable بضم خفيف", "weight": 50, "code": "pron_b_viable"}
                        ]
                    }
                }
            ],
            "review": {
                "status": "draft",
                "authors": ["فريق المنهج — استخراج تربوي من سلسلة Aula 5 وAula 6"],
                "spanishReviewer": None,
                "translationReviewer": None,
                "reviewedAt": None,
                "notes": "الدرس يقدم قواعد المناظرة وصياغة الحجة المقابلة والفرق الدقيق بين pero و sino."
            }
        }
    },
    # -------------------------------------------------------------
    # C1: c1-nominalizacion
    # -------------------------------------------------------------
    {
        "dir": "content/drafts/c1",
        "filename": "lesson-c1-nominalizacion.json",
        "lesson": {
            "slug": "c1-nominalizacion",
            "titleAr": "التكثيف الأسلوبي: البناء بالمصادر والأسماء (La Nominalización)",
            "level": "C1",
            "programSlug": "main-track",
            "unitSlug": "c1-u1-style",
            "objectiveAr": "أن يتقن المتعلم تقنية التكثيف الأسلوبي عبر تحويل التراكيب الفعلية الطويلة إلى مصادر وأسماء نوعية (Nominalización) لرفع الكثافة المعجمية ورصانة النص في الكتابة الأكاديمية والرسمية.",
            "estimatedMinutes": 12,
            "skills": ["grammar", "reading", "writing", "listening", "vocabulary"],
            "newVocabulary": ["reducción", "promulgación", "adopción", "incremento", "precisión", "matiz"],
            "reviewVocabulary": ["gobierno", "ley", "sociedad", "trabajo"],
            "targetStructures": [
                "De oración verbal a sintagma nominal: El gobierno redujo el gasto -> La reducción del gasto público por parte del gobierno",
                "Sufijos nominalizadores frecuentes: -ción (reducir->reducción), -miento (crecer->crecimiento), -ura, -eza, -dad",
                "Ventajas de estilo C1: Objetividad, densidad informativa, elegancia formal"
            ],
            "grammarTopics": ["nominalizacion-estilo-c1", "morfologia-derivativa-c1"],
            "scenarios": [
                {
                    "contextAr": "محرر لغوي بمجلة أكاديمية مرموقة يراجع مسودة مقال ويشرح للباحث كيفية تحسين الأسلوب ورفع كثافته.",
                    "settingAr": "مكتب هيئة التحرير، مدريد",
                    "lines": [
                        {
                            "es": "Has escrito: 'El parlamento aprobó la ley y los ciudadanos protestaron en las calles'.",
                            "ar": "لقد كتبتَ: 'وافق البرلمان على القانون واحتج المواطنون في الشوارع'.",
                            "arEg": "إنت كاتب: 'البرلمان وافق على القانون والناس احتجت في الشارع'.",
                            "audioKey": "pending/c1-nom-edit-1"
                        },
                        {
                            "es": "En un registro C1 es preferible nominalizar: 'La aprobación de la ley suscitó protestas ciudadanas'.",
                            "ar": "في المستوى المتقدم C1 من الأفضل تكثيف العبارة اسميًا: 'أثارت المصادقة على القانون احتجاجات شعبية'.",
                            "arEg": "في أسلوب C1 الأحسن نكثفها: 'أثارت الموافقة على القانون احتجاجات شعبية'.",
                            "audioKey": "pending/c1-nom-edit-2"
                        },
                        {
                            "es": "Es verdad, la versión nominalizada suena mucho más rigurosa y académica.",
                            "ar": "هذا صحيح، الصيغة المصدرية تبدو أكثر رصانة وعلمية بكثير.",
                            "arEg": "حقيقي، الصيغة الاسمية دي طالعة فخمة وأكاديمية أكتر.",
                            "audioKey": "pending/c1-nom-edit-3"
                        },
                        {
                            "es": "Exacto: la nominalización concentra la información y aporta mayor elegancia discursiva.",
                            "ar": "تمامًا: فالتكثيف الاسمي يركز المعلومات ويمنح النص أناقة بلاغية رفيعة.",
                            "arEg": "بالظبط: التركيب الاسمي بيركز المعلومة وبيدي شياكة للكتابة.",
                            "audioKey": "pending/c1-nom-edit-4"
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
                    "id": "c1_nom_1_listen",
                    "type": "listen_choose",
                    "instructionAr": "استمع إلى المحرر واختر الصيغة المكثفة اسميًا التي اقترحها بديلاً للجملة الفعلية البسيطة.",
                    "audioKey": "pending/c1-nom-edit-2",
                    "speechEs": "En un registro C1 es preferible nominalizar: 'La aprobación de la ley suscitó protestas ciudadanas'.",
                    "options": [
                        {"id": "c1_nom_1_a", "text": "La aprobación de la ley suscitó protestas ciudadanas", "isCorrect": True, "textAr": "الصيغة الاسمية المكثفة"},
                        {"id": "c1_nom_1_b", "text": "Aprobaron la ley y la gente gritó mucho", "isCorrect": False, "textAr": "صيغة ركيكة", "distractorRationaleAr": "صيغة عامية ركيكة."},
                        {"id": "c1_nom_1_c", "text": "No aprobaron nada en el parlamento", "isCorrect": False, "textAr": "نفي الحدث", "distractorRationaleAr": "لم يقل ذلك."}
                    ],
                    "answerKey": {"correctOptionIds": ["c1_nom_1_a"]},
                    "explanationAr": "تحولت الجملة من فعلين متباعدين (aprobó / protestaron) إلى تركيب اسمي فصيح ومكثف: «La aprobación de la ley suscitó protestas ciudadanas».",
                    "errorFeedback": {
                        "c1_nom_1_b": "أسلوب دارج بسيط.",
                        "c1_nom_1_c": "القانون تمت الموافقة عليه بالفعل."
                    },
                    "skills": ["listening"],
                    "difficulty": 1,
                    "targetVocab": ["promulgación", "precisión"],
                    "scoring": {"mode": "all_or_nothing"}
                },
                {
                    "id": "c1_nom_2_suffix",
                    "type": "word_choice",
                    "instructionAr": "ما هو الاسم المصدري المشتق من الفعل «reducir» (خفّضَ / قلّصَ) في اللغة الإسبانية؟",
                    "options": [
                        {"id": "c1_nom_2_a", "text": "la reducción (التقليص / التخفيض)", "isCorrect": True, "textAr": "la reducción"},
                        {"id": "c1_nom_2_b", "text": "el reducimiento", "isCorrect": False, "textAr": "كلمة غير صحيحة", "distractorRationaleAr": "لا توجد كلمة reducimiento في المعاجم القياسية."},
                        {"id": "c1_nom_2_c", "text": "la reducida", "isCorrect": False, "textAr": "غير مستخدمة كمصدر", "distractorRationaleAr": "اسم مفعول مؤنث وليست مصدراً رسمياً."}
                    ],
                    "answerKey": {"correctOptionIds": ["c1_nom_2_a"]},
                    "explanationAr": "الأفعال المنتهية بـ -ducir (مثل reducir, producir, conducir) تشتق مصادرها باللاحقة -cción: reducción, producción, conducción.",
                    "errorFeedback": {
                        "c1_nom_2_b": "لا وجود لهذه الكلمة.",
                        "c1_nom_2_c": "ليست مصدراً للعملية."
                    },
                    "skills": ["vocabulary"],
                    "difficulty": 1,
                    "targetVocab": ["reducción"],
                    "scoring": {"mode": "all_or_nothing"}
                },
                {
                    "id": "c1_nom_3_fill_rewrite",
                    "type": "fill_blank",
                    "instructionAr": "أكمل التركيب المصدري المكثف: «أدى ارتفاع الأسعار إلى أزمة».",
                    "stemEs": "El constante ____ de los precios provocó una crisis de consumo.",
                    "stemAr": "أدى ____ المستمر في الأسعار إلى أزمة استهلاك.",
                    "options": [
                        {"id": "c1_nom_3_a", "text": "incremento", "isCorrect": True, "textAr": "الارتفاع / التزايد"},
                        {"id": "c1_nom_3_b", "text": "subir", "isCorrect": False, "textAr": "مصدر فعلي بسيط", "distractorRationaleAr": "subir فعل مصدر، وفي السياق الأكاديمي نفضل الاسم المعجمي incremento أو aumento."},
                        {"id": "c1_nom_3_c", "text": "sube", "isCorrect": False, "textAr": "مضارع مصرف", "distractorRationaleAr": "sube فعل مصرف لا يصح بعد أداة التعريف وصفة constante."},
                        {"id": "c1_nom_3_d", "text": "grande", "isCorrect": False, "textAr": "كبير", "distractorRationaleAr": "صفة وليست اسماً."}
                    ],
                    "answerKey": {"correctOptionIds": ["c1_nom_3_a"]},
                    "explanationAr": "الاسم المصدري «El incremento / El aumento» يمنح الجملة دقة ورصانة اقتصادية أعلى بكثير من الجمل الفعلية البسيطة مثل (los precios subieron mucho).",
                    "errorFeedback": {
                        "c1_nom_3_b": "subir فعل بسيط.",
                        "c1_nom_3_c": "sube فعل مصرف ولا يأتي هنا.",
                        "c1_nom_3_d": "grande صفة."
                    },
                    "skills": ["writing", "vocabulary"],
                    "difficulty": 2,
                    "targetVocab": ["incremento", "precisión"],
                    "scoring": {"mode": "all_or_nothing"}
                },
                {
                    "id": "c1_nom_4_fill_promulgate",
                    "type": "fill_blank",
                    "instructionAr": "أكمل الفراغ بالاسم الرسمي المعبّر عن إصدار مرسوم أو قانون: «إصدار المرسوم...».",
                    "stemEs": "La ____ del decreto ministerial generó gran expectación.",
                    "stemAr": "أثار ____ المرسوم الوزاري ترقبًا كبيرًا.",
                    "options": [
                        {"id": "c1_nom_4_a", "text": "promulgación", "isCorrect": True, "textAr": "الإصدار الرسمي / النفاذ"},
                        {"id": "c1_nom_4_b", "text": "decisión de hacer", "isCorrect": False, "textAr": "صيغة عامية", "distractorRationaleAr": "صياغة ركيكة لا تليق بالسياق القانوني الرفيع."},
                        {"id": "c1_nom_4_c", "text": "puesta en papel", "isCorrect": False, "textAr": "تعبير ركيك", "distractorRationaleAr": "تعبير سطحي مبتذل."},
                        {"id": "c1_nom_4_d", "text": "salida de", "isCorrect": False, "textAr": "خروج", "distractorRationaleAr": "salida غير مطابقة للمعنى القانوني."}
                    ],
                    "answerKey": {"correctOptionIds": ["c1_nom_4_a"]},
                    "explanationAr": "المصطلح القانوني والسياسي المعتمد في مستوى C1 لصدور المراسيم والقوانين هو «promulgación» (المشتق من الفعل promulgó).",
                    "errorFeedback": {
                        "c1_nom_4_b": "صياغة ركيكة جداً.",
                        "c1_nom_4_c": "تعبير عامي غير لائق.",
                        "c1_nom_4_d": "salida تعني خروجاً حسياً."
                    },
                    "skills": ["vocabulary", "reading"],
                    "difficulty": 2,
                    "targetVocab": ["promulgación"],
                    "scoring": {"mode": "all_or_nothing"}
                },
                {
                    "id": "c1_nom_5_speak",
                    "type": "speak_with_text",
                    "instructionAr": "انطق الجملة المكثفة اسميًا بنبرة محكمة ومخارج حروف واضحة.",
                    "stemEs": "La adopción de estas medidas garantiza la estabilidad económica.",
                    "stemAr": "إن تبنّي هذه التدابير يضمن الاستقرار الاقتصادي.",
                    "answerKey": {
                        "referenceAudioKey": "pending/c1-nom-edit-4",
                        "modelAnswer": "La adopción de estas medidas garantiza la estabilidad económica."
                    },
                    "explanationAr": "نطق c في adopción و económica كثاء خفيفة [θ]، مع الضغط على النبرات في adopción و económica.",
                    "skills": ["speaking", "pronunciation"],
                    "difficulty": 2,
                    "targetVocab": ["adopción", "precisión"],
                    "scoring": {
                        "mode": "rubric",
                        "rubric": [
                            {"labelAr": "النبر على ción في adopción", "weight": 50, "code": "stress_adopcion"},
                            {"labelAr": "سلاسة نطق الجملة الأكاديمية", "weight": 50, "code": "fluency_academic"}
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
                "notes": "الدرس يدرب الدارس على التحول من الجمل الفعلية الممتدة إلى التراكيب الاسمية المكثفة وهو لب أسلوب C1 الأكاديمي."
            }
        }
    },
    # -------------------------------------------------------------
    # C1: c1-refranes-modismos
    # -------------------------------------------------------------
    {
        "dir": "content/drafts/c1",
        "filename": "lesson-c1-refranes-modismos.json",
        "lesson": {
            "slug": "c1-refranes-modismos",
            "titleAr": "التعبيرات الاصطلاحية والأمثال في السياق الحي",
            "level": "C1",
            "programSlug": "main-track",
            "unitSlug": "c1-u1-style",
            "objectiveAr": "أن يفهم المتعلم ويوظف أشهر الأمثال والتعبيرات المجازية الإسبانية الأصيلة (Estar en las nubes, No tener pelos en la lengua, Dar en el clavo, Tomar el pelo) مع إدراك مقابلاتها الثقافية في العربية.",
            "estimatedMinutes": 11,
            "skills": ["reading", "listening", "vocabulary", "speaking"],
            "newVocabulary": ["clavo", "lengua", "nube", "pelo", "matiz", "precisión"],
            "reviewVocabulary": ["amigo", "trabajo", "verdad", "tiempo"],
            "targetStructures": [
                "Dar en el clavo = أصاب كبد الحقيقة / أصاب عين الصواب",
                "No tener pelos en la lengua = صريح لا يخشى في الحق لومة لائم / لا يوارب",
                "Estar en las nubes = شارد الذهن / ساهٍ",
                "Tomar el pelo a alguien = يمزح معه / يداعبه / «يشتغله» بالمصري"
            ],
            "grammarTopics": ["modismos-espanoles-c1", "fraseologia-refranes"],
            "scenarios": [
                {
                    "contextAr": "محادثة ودية بين صديقين إسبانيين يحللان شخصية زميل جديد في فريق العمل وأسلوبه في إبداء الملاحظات.",
                    "settingAr": "مقهى مجاور للعمل، بعد انتهاء الدوام",
                    "lines": [
                        {
                            "es": "Me gusta cómo trabaja Mateo: no tiene pelos en la lengua a la hora de decir las cosas.",
                            "ar": "يعجبني أسلوب ماتيو في العمل: صريح للغاية ولا يوارب عند قول الحقيقة.",
                            "arEg": "بيعجبني ماتيو أوي: لسانه صريح ومابيجاملش في الشغل.",
                            "audioKey": "pending/c1-modis-cafe-1"
                        },
                        {
                            "es": "Totalmente. En la reunión de hoy dio en el clavo con su diagnóstico sobre el cliente.",
                            "ar": "تمامًا. في اجتماع اليوم أصاب عين الصواب تمامًا في تحليله لشخصية العميل.",
                            "arEg": "جداً! في اجتماع النهاردة جاب التايهة وحط إيده على الجرح.",
                            "audioKey": "pending/c1-modis-cafe-2"
                        },
                        {
                            "es": "Aunque al principio pensé que me estaba tomando el pelo con esa broma sobre el presupuesto.",
                            "ar": "مع أنني في البداية ظننت أنه كان يمازحني بتلك النكتة حول الميزانية.",
                            "arEg": "مع إني في الأول افتكرته بيهزر معايا وبيشتغلني في حوار الميزانية ده.",
                            "audioKey": "pending/c1-modis-cafe-3"
                        },
                        {
                            "es": "Para nada; a veces parece que está en las nubes, pero no se le escapa ningún detalle.",
                            "ar": "أبدًا؛ أحيانًا يبدو كأنه شارد الذهن، لكن لا تفوته شاردة ولا واردة.",
                            "arEg": "خالص! هو ساعات يبان سرحان في الملكوت، بس مابتفوتوش تفصيلة.",
                            "audioKey": "pending/c1-modis-cafe-4"
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
                    "id": "c1_modis_1_listen",
                    "type": "listen_choose",
                    "instructionAr": "استمع إلى الحوار واختر المعنى المقصود بعبارة «dio en el clavo».",
                    "audioKey": "pending/c1-modis-cafe-2",
                    "speechEs": "Totalmente. En la reunión de hoy dio en el clavo con su diagnóstico sobre el cliente.",
                    "options": [
                        {"id": "c1_modis_1_a", "text": "أصاب كبد الحقيقة وعين الصواب تمامًا", "isCorrect": True, "textAr": "أصاب كبد الحقيقة"},
                        {"id": "c1_modis_1_b", "text": "ضرب الطاولة بمسمار حقيقي", "isCorrect": False, "textAr": "معنى حرفي خاطئ", "distractorRationaleAr": "فخ الترجمة الحرفية لكلمة clavo (مسمار)؛ التعبير مجازي شهير."},
                        {"id": "c1_modis_1_c", "text": "أخطأ خطأً فادحًا في الاجتماع", "isCorrect": False, "textAr": "معنى مناقض", "distractorRationaleAr": "المعنى مناقض تمامًا للصواب."}
                    ],
                    "answerKey": {"correctOptionIds": ["c1_modis_1_a"]},
                    "explanationAr": "التعبير الاصطلاحي «Dar en el clavo» يعني حرفيًا الطرق على رأس المسمار مباشرة، ومجازه هو إصابة عين الحقيقة وبؤرة الصواب دون خطأ.",
                    "errorFeedback": {
                        "c1_modis_1_b": "تجنب الترجمة الحرفية؛ clavo هنا جزء من مثل مجازي.",
                        "c1_modis_1_c": "المعنى هو الصواب الكامل."
                    },
                    "skills": ["listening"],
                    "difficulty": 1,
                    "targetVocab": ["clavo"],
                    "scoring": {"mode": "all_or_nothing"}
                },
                {
                    "id": "c1_modis_2_idiom_match",
                    "type": "word_choice",
                    "instructionAr": "ماذا يعني التعبير الإسباني الأصيل «No tener pelos en la lengua»؟",
                    "options": [
                        {"id": "c1_modis_2_a", "text": "أن يكون الشخص صريحًا وجريئًا يقول الحق دون مداهنة أو خوف", "isCorrect": True, "textAr": "الصراحة التامة والجرأة"},
                        {"id": "c1_modis_2_b", "text": "أن يكون الشخص عاجزًا عن الكلام ومصابًا بالخرس", "isCorrect": False, "textAr": "العجز عن الكلام", "distractorRationaleAr": "غير صحيح، بل هو يتكلم بكل طلاقة وصراحة."},
                        {"id": "c1_modis_2_c", "text": "أن يتكلم بلغة أجنبية صعبة", "isCorrect": False, "textAr": "التحدث بلغة أجنبية", "distractorRationaleAr": "لا علاقة له باللغات الأجنبية."}
                    ],
                    "answerKey": {"correctOptionIds": ["c1_modis_2_a"]},
                    "explanationAr": "«No tener pelos en la lengua» يقابله في العربية: «لا يوارب / لا يخشى في الحق لومة لائم / صريح بلا مجاملة».",
                    "errorFeedback": {
                        "c1_modis_2_b": "هو يتكلم بجرأة تامة.",
                        "c1_modis_2_c": "لا علاقة له باللغات الأخرى."
                    },
                    "skills": ["reading", "vocabulary"],
                    "difficulty": 1,
                    "targetVocab": ["lengua", "pelo"],
                    "scoring": {"mode": "all_or_nothing"}
                },
                {
                    "id": "c1_modis_3_fill_pelo",
                    "type": "fill_blank",
                    "instructionAr": "أكمل الفراغ بالتعبير الإسباني الشهير للممازحة: «هل تمازحني؟ / هل تخدعني؟».",
                    "stemEs": "¿Me estás tomando el ____?",
                    "stemAr": "هل ____ بي وتمزح معي؟",
                    "options": [
                        {"id": "c1_modis_3_a", "text": "pelo", "isCorrect": True, "textAr": "الشعر (Tomar el pelo)"},
                        {"id": "c1_modis_3_b", "text": "brazo", "isCorrect": False, "textAr": "الذراع", "distractorRationaleAr": "Tomar el brazo لا تعني الممازحة."},
                        {"id": "c1_modis_3_c", "text": "ojo", "isCorrect": False, "textAr": "العين", "distractorRationaleAr": "Costar un ojo تعني غالي الثمن، ولا تأتي مع tomar بهذا المعنى."},
                        {"id": "c1_modis_3_d", "text": "pie", "isCorrect": False, "textAr": "القدم", "distractorRationaleAr": "غير مطابقة للمثل."}
                    ],
                    "answerKey": {"correctOptionIds": ["c1_modis_3_a"]},
                    "explanationAr": "«Tomar el pelo a alguien» من أشهر التعبيرات العامية الراقية للمداعبة والممازحة (يقابل بالمصري: «إنت بتشتغلني؟» أو «بتهزر معايا؟»).",
                    "errorFeedback": {
                        "c1_modis_3_b": "brazo لا تأتي في هذا المثل.",
                        "c1_modis_3_c": "ojo تعني غالي في Costar un ojo de la cara.",
                        "c1_modis_3_d": "pie لا تصح هنا."
                    },
                    "skills": ["vocabulary", "writing"],
                    "difficulty": 2,
                    "targetVocab": ["pelo"],
                    "scoring": {"mode": "all_or_nothing"}
                },
                {
                    "id": "c1_modis_4_fill_clouds",
                    "type": "fill_blank",
                    "instructionAr": "أكمل الفراغ بالتعبير الدال على شرود الذهن: «شارد في السحب».",
                    "stemEs": "El estudiante no escuchó la pregunta porque estaba en las ____.",
                    "stemAr": "لم يسمع الطالب السؤال لأنه كان شاردًا في ____.",
                    "options": [
                        {"id": "c1_modis_4_a", "text": "nubes", "isCorrect": True, "textAr": "السحب (Estar en las nubes)"},
                        {"id": "c1_modis_4_b", "text": "casas", "isCorrect": False, "textAr": "المنازل", "distractorRationaleAr": "لا وجود لتعبير estar en las casas للشرود."},
                        {"id": "c1_modis_4_c", "text": "calles", "isCorrect": False, "textAr": "الشوارع", "distractorRationaleAr": "estar en la calle تعني بدون مأوى أو مطرود."},
                        {"id": "c1_modis_4_d", "text": "mesas", "isCorrect": False, "textAr": "الطاولات", "distractorRationaleAr": "غير مطابقة."}
                    ],
                    "answerKey": {"correctOptionIds": ["c1_modis_4_a"]},
                    "explanationAr": "تعبير «Estar en las nubes» يعني شارد الذهن وساهيًا عن الواقع (يقابل في العربية: «في عالم آخر / سارح في الملكوت»).",
                    "errorFeedback": {
                        "c1_modis_4_b": "ليست تعبيراً مجازياً.",
                        "c1_modis_4_c": "estar en la calle لها معنى مختلف تماماً.",
                        "c1_modis_4_d": "mesas غير صحيحة."
                    },
                    "skills": ["vocabulary"],
                    "difficulty": 1,
                    "targetVocab": ["nube"],
                    "scoring": {"mode": "all_or_nothing"}
                },
                {
                    "id": "c1_modis_5_speak",
                    "type": "speak_with_text",
                    "instructionAr": "انطق المثل الإسباني الشهير بنبرة تأكيدية معبرة.",
                    "stemEs": "Mateo dio en el clavo con su respuesta.",
                    "stemAr": "أصاب ماتيو عين الصواب بإجابته.",
                    "answerKey": {
                        "referenceAudioKey": "pending/c1-modis-cafe-2",
                        "modelAnswer": "Mateo dio en el clavo con su respuesta."
                    },
                    "explanationAr": "انطق dio بنبر سريع، وركز على وضوح clavo وسلاسة respuesta.",
                    "skills": ["speaking", "pronunciation"],
                    "difficulty": 2,
                    "targetVocab": ["clavo"],
                    "scoring": {
                        "mode": "rubric",
                        "rubric": [
                            {"labelAr": "نطق clavo بوضوح", "weight": 50, "code": "pron_clavo"},
                            {"labelAr": "سلاسة نطق التعبير الاصطلاحي", "weight": 50, "code": "fluency_idiom"}
                        ]
                    }
                }
            ],
            "review": {
                "status": "draft",
                "authors": ["فريق المنهج — استخراج تربوي من مراجع معهد ثربانتس وسلسلة Aula Plus 7"],
                "spanishReviewer": None,
                "translationReviewer": None,
                "reviewedAt": None,
                "notes": "الدرس يقدم التعبيرات الاصطلاحية الشعبية الحية ويوضح نظائرها الدقيقة في الثقافة العربية والمصرية."
            }
        }
    },
    # -------------------------------------------------------------
    # C1: c1-correspondencia-formal
    # -------------------------------------------------------------
    {
        "dir": "content/drafts/c1",
        "filename": "lesson-c1-correspondencia-formal.json",
        "lesson": {
            "slug": "c1-correspondencia-formal",
            "titleAr": "المراسلات الرسمية والبروتوكول الأكاديمي والمهني",
            "level": "C1",
            "programSlug": "main-track",
            "unitSlug": "c1-u1-style",
            "objectiveAr": "أن يحرر المتعلم خطابًا رسميًا أو بريدًا إلكترونيًا أكاديميًا متقنًا مستخدمًا ديباجات الافتتاح الرسمية وصيغ الطلب المهذب وخواتيم الاحترام والتقدير البروتوكولية المتعارف عليها في إسبانيا وأمريكا اللاتينية.",
            "estimatedMinutes": 12,
            "skills": ["writing", "reading", "grammar", "vocabulary"],
            "newVocabulary": ["estimado", "propósito", "atentamente", "disposición", "cordial", "rector"],
            "reviewVocabulary": ["gracias", "tiempo", "trabajo", "amigo"],
            "targetStructures": [
                "Encabezamientos: Estimado/a Sr./Sra. [Apellido], / Ilustrísimo/a Sr./Sra.,",
                "Fórmulas de apertura: Me dirijo a usted con el propósito de solicitar...",
                "Fórmulas de cortesía en peticiones: Le agradecería enormemente si pudiera facilitarme...",
                "Fórmulas de despedida: Sin otro particular, le saluda atentamente, / Quedo a su entera disposición"
            ],
            "grammarTopics": ["cartas-formales-c1", "registro-epistolar-protocolo"],
            "scenarios": [
                {
                    "contextAr": "طالب دراسات عليا يراسل عميد كلية الآداب بجامعة غرناطة لطلب منحة بحثية في المخطوطات الأندلسية.",
                    "settingAr": "خطاب رسمي موجه لعمادة الكلية",
                    "lines": [
                        {
                            "es": "Estimado Sr. Decano: Me dirijo a usted con el propósito de solicitar una estancia de investigación.",
                            "ar": "سيادة العميد المحترم: أتوجه إلى سيادتكم بغرض التقدم بطلب للحصول على إقامة بحثية.",
                            "arEg": "السيد العميد المحترم: بكتب لحضرتك بخصوص التقديم على منحة إقامة بحثية.",
                            "audioKey": "pending/c1-carta-decan-1"
                        },
                        {
                            "es": "Le agradecería sinceramente que considerase mi candidatura para el departamento de Filología.",
                            "ar": "سأكون ممتنًا لسيادتكم خالص الامتنان لو تفضلتم بالنظر في ملف ترشحي لقسم فقه اللغة.",
                            "arEg": "هكون شاكر جداً لحضرتك لو نظرت في ملف ترشيحي لقسم اللغات.",
                            "audioKey": "pending/c1-carta-decan-2"
                        },
                        {
                            "es": "Adjunto a la presente mi currículum vitae detallado junto con el proyecto de tesis.",
                            "ar": "وأرفق طي هذا الخطاب سيرتي الذاتية المفصلة مشفوعة بمخطط مشروع الأطروحة.",
                            "arEg": "ومرفق مع الإيميل السي في بتاعي وخطة مشروع الدكتوراه.",
                            "audioKey": "pending/c1-carta-decan-3"
                        },
                        {
                            "es": "Quedo a su entera disposición para cualquier aclaración. Sin otro particular, le saluda atentamente.",
                            "ar": "وأظل رهن إشارتكم الكاملة لأي استيضاح. وتفضلوا بقبول فائق الاحترام والتقدير.",
                            "arEg": "وتحت أمر حضرتك في أي استفسار. وتفضلوا بقبول فائق الاحترام.",
                            "audioKey": "pending/c1-carta-decan-4"
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
                    "id": "c1_carta_1_listen",
                    "type": "listen_choose",
                    "instructionAr": "استمع إلى خاتمة الخطاب الرسمي واختر العبارة البروتوكولية التي استخدمها الباحث لإعلان استعداده لأي استفسار.",
                    "audioKey": "pending/c1-carta-decan-4",
                    "speechEs": "Quedo a su entera disposición para cualquier aclaración. Sin otro particular, le saluda atentamente.",
                    "options": [
                        {"id": "c1_carta_1_a", "text": "Quedo a su entera disposición (أظل رهن إشارتكم الكاملة)", "isCorrect": True, "textAr": "Quedo a su entera disposición"},
                        {"id": "c1_carta_1_b", "text": "Llámame cuando puedas (اتصل بي عندما تستطيع)", "isCorrect": False, "textAr": "عبارة غير رسمية", "distractorRationaleAr": "عبارة دارجة لا تناسب مخاطبة عميد كلية."},
                        {"id": "c1_carta_1_c", "text": "Nos vemos mañana (نلتقي غدًا)", "isCorrect": False, "textAr": "لقاء عادي", "distractorRationaleAr": "تحية عامية بين الأقران."}
                    ],
                    "answerKey": {"correctOptionIds": ["c1_carta_1_a"]},
                    "explanationAr": "صيغة «Quedo a su entera disposición para cualquier aclaración» هي الصيغة البروتوكولية القياسية في نهاية المراسلات الرسمية (C1).",
                    "errorFeedback": {
                        "c1_carta_1_b": "أسلوب دارج غير لائق بمخاطبة عميد.",
                        "c1_carta_1_c": "تحية عامية بين الأصدقاء."
                    },
                    "skills": ["listening"],
                    "difficulty": 1,
                    "targetVocab": ["disposición", "atentamente"],
                    "scoring": {"mode": "all_or_nothing"}
                },
                {
                    "id": "c1_carta_2_opening",
                    "type": "word_choice",
                    "instructionAr": "ما هي التحية الرسمية الافتتاحية الأنسب عند مخاطبة شخص لا تعرف اسمه شخصيًا وتخاطب وظيفته الرسمية؟",
                    "options": [
                        {"id": "c1_carta_2_a", "text": "Estimado/a Sr./Sra.: / A la atención de la Dirección:", "isCorrect": True, "textAr": "التحية الرسمية القياسية"},
                        {"id": "c1_carta_2_b", "text": "¡Hola, amigo mío! (أهلاً يا صديقي)", "isCorrect": False, "textAr": "تحية غير رسمية", "distractorRationaleAr": "غير لائقة بالمراسلات الإدارية الرسمية."},
                        {"id": "c1_carta_2_c", "text": "¿Qué pasa, colega? (ما الأخبار يا زميل؟)", "isCorrect": False, "textAr": "عامية مبتذلة", "distractorRationaleAr": "لغة شوارع غير مقبولة مطلقاً."}
                    ],
                    "answerKey": {"correctOptionIds": ["c1_carta_2_a"]},
                    "explanationAr": "في المراسلات الرسمية الإسبانية (Correspondencia formal) يُستهل الخطاب بـ «Estimado/a Sr./Sra.» متبوعة بنقطتين رأسيتين (dos puntos)، ولا نستخدم الفاصلة كما في الإنجليزية.",
                    "errorFeedback": {
                        "c1_carta_2_b": "تحية ودية للأصدقاء فقط.",
                        "c1_carta_2_c": "لغة مبتذلة."
                    },
                    "skills": ["reading"],
                    "difficulty": 1,
                    "targetVocab": ["estimado"],
                    "scoring": {"mode": "all_or_nothing"}
                },
                {
                    "id": "c1_carta_3_fill_purpose",
                    "type": "fill_blank",
                    "instructionAr": "أكمل الفراغ بالعبارة الدالة على مقصد الخطاب: «أتوجه إليكم بغرض...».",
                    "stemEs": "Me dirijo a usted con el ____ de presentar mi solicitud formal.",
                    "stemAr": "أتوجه إلى سيادتكم بـ ____ تقديم طلبي الرسمي.",
                    "options": [
                        {"id": "c1_carta_3_a", "text": "propósito", "isCorrect": True, "textAr": "غرض / مقصد (con el propósito de)"},
                        {"id": "c1_carta_3_b", "text": "juego", "isCorrect": False, "textAr": "لعب", "distractorRationaleAr": "لا علاقة لها بالمراسلات."},
                        {"id": "c1_carta_3_c", "text": "sueño", "isCorrect": False, "textAr": "حلم", "distractorRationaleAr": "ليست تعبيرًا إداريًا."},
                        {"id": "c1_carta_3_d", "text": "camino", "isCorrect": False, "textAr": "طريق", "distractorRationaleAr": "غير مطابقة للتعبير الثابت."}
                    ],
                    "answerKey": {"correctOptionIds": ["c1_carta_3_a"]},
                    "explanationAr": "الديباجة الإدارية الثابتة في مستوى C1 هي: «Me dirijo a usted con el propósito de + Infinitivo» (أتوجه لسيادتكم بغرض كذا).",
                    "errorFeedback": {
                        "c1_carta_3_b": "juego تعني لعباً.",
                        "c1_carta_3_c": "sueño حلم شخصي.",
                        "c1_carta_3_d": "camino طريق مادي."
                    },
                    "skills": ["writing", "vocabulary"],
                    "difficulty": 2,
                    "targetVocab": ["propósito"],
                    "scoring": {"mode": "all_or_nothing"}
                },
                {
                    "id": "c1_carta_4_fill_closing",
                    "type": "fill_blank",
                    "instructionAr": "أكمل الفراغ بعبارة الختام البروتوكولية الكبرى: «وتفضلوا بقبول فائق الاحترام...».",
                    "stemEs": "Sin otro particular, le saluda ____.",
                    "stemAr": "دون أمر آخر، يحيي سيادتكم ____.",
                    "options": [
                        {"id": "c1_carta_4_a", "text": "atentamente", "isCorrect": True, "textAr": "فائق الاحترام (le saluda atentamente)"},
                        {"id": "c1_carta_4_b", "text": "rápido", "isCorrect": False, "textAr": "بسرعة", "distractorRationaleAr": "غير لائقة بخاتمة رسمية."},
                        {"id": "c1_carta_4_c", "text": "mal", "isCorrect": False, "textAr": "بسوء", "distractorRationaleAr": "كلمة سلبية."},
                        {"id": "c1_carta_4_d", "text": "fuerte", "isCorrect": False, "textAr": "بقوة", "distractorRationaleAr": "Un fuerte abrazo للأصدقاء المقربين فقط."}
                    ],
                    "answerKey": {"correctOptionIds": ["c1_carta_4_a"]},
                    "explanationAr": "الخاتمة الإدارية الرصينة في الإسبانية هي «Sin otro particular, le saluda atentamente» أو «Atentamente» متبوعة بالتوقيع.",
                    "errorFeedback": {
                        "c1_carta_4_b": "rápido غير مناسبة إطلاقاً.",
                        "c1_carta_4_c": "mal كلمة سلبية.",
                        "c1_carta_4_d": "fuerte abrazo للأصدقاء المقربين فقط."
                    },
                    "skills": ["writing", "reading"],
                    "difficulty": 2,
                    "targetVocab": ["atentamente"],
                    "scoring": {"mode": "all_or_nothing"}
                },
                {
                    "id": "c1_carta_5_speak",
                    "type": "speak_with_text",
                    "instructionAr": "انطق عبارة الاستعداد الرسمية بنبرة بروتوكولية واضحة.",
                    "stemEs": "Quedo a su entera disposición para cualquier consulta.",
                    "stemAr": "أظل رهن إشارتكم الكاملة لأي استفسار.",
                    "answerKey": {
                        "referenceAudioKey": "pending/c1-carta-decan-4",
                        "modelAnswer": "Quedo a su entera disposición para cualquier consulta."
                    },
                    "explanationAr": "نطق حرف s في disposición واضحًا والنبر على المقطع الأخير -ción لوجود علامة النبرة (tilde).",
                    "skills": ["speaking", "pronunciation"],
                    "difficulty": 2,
                    "targetVocab": ["disposición"],
                    "scoring": {
                        "mode": "rubric",
                        "rubric": [
                            {"labelAr": "النبر على مقطع ción في disposición", "weight": 50, "code": "stress_disposicion"},
                            {"labelAr": "مخارج الحروف الفصيحة للعبارة", "weight": 50, "code": "pron_protocol"}
                        ]
                    }
                }
            ],
            "review": {
                "status": "draft",
                "authors": ["فريق المنهج — استخراج تربوي من مراجع الدبلوماسية والمراسلات الرسمية بمعهد ثربانتس"],
                "spanishReviewer": None,
                "translationReviewer": None,
                "reviewedAt": None,
                "notes": "الدرس يدرب الدارس على البروتوكول الإداري والأكاديمي في صياغة الخطابات والبريد الإلكتروني الرسمي بمستوى C1."
            }
        }
    }
]

def main():
    print("=== توليد الدروس الإضافية لإكمال وحدات B2 و C1 ===")
    for item in EXTRA_LESSONS:
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
        print(f"✅ تم إنشاء درس: {item['dir']}/{item['filename']} ({item['lesson']['slug']})")

    # Update paths.json for B2 and C1
    b2_paths_file = ROOT / "content/drafts/b2/paths.json"
    b2_paths_data = {
        "schemaVersion": "1.0.0",
        "programs": [
            {
                "slug": "main-track",
                "kind": "main",
                "titleAr": "المسار الأساسي: من الصفر إلى C1",
                "levelCode": "B2",
                "category": "core",
                "objectiveAr": "المسار الأساسي للمستوى B2.",
                "units": [
                    {
                        "slug": "b2-u1-argument",
                        "levelCode": "B2",
                        "titleAr": "بناء الحجة والشرط الافتراضي",
                        "sortOrder": 1,
                        "status": "draft",
                        "lessons": [
                            "b2-condicional-imperfecto-subjuntivo",
                            "b2-conectores-argumentativos",
                            "b2-matizar-opiniones",
                            "b2-contraargumentacion"
                        ],
                        "vocabularyBundles": []
                    }
                ]
            }
        ]
    }
    with open(b2_paths_file, "w", encoding="utf-8") as f:
        json.dump(b2_paths_data, f, ensure_ascii=False, indent=2)
        f.write("\n")
    print("✅ تم تحديث paths.json للمستوى B2 (4 دروس مكتملة)")

    c1_paths_file = ROOT / "content/drafts/c1/paths.json"
    c1_paths_data = {
        "schemaVersion": "1.0.0",
        "programs": [
            {
                "slug": "main-track",
                "kind": "main",
                "titleAr": "المسار الأساسي: من الصفر إلى C1",
                "levelCode": "C1",
                "category": "core",
                "objectiveAr": "المسار الأساسي للمستوى C1.",
                "units": [
                    {
                        "slug": "c1-u1-style",
                        "levelCode": "C1",
                        "titleAr": "الدقة الأسلوبية والتعبير المتقدم",
                        "sortOrder": 1,
                        "status": "draft",
                        "lessons": [
                            "c1-precision-estilistica",
                            "c1-nominalizacion",
                            "c1-refranes-modismos",
                            "c1-correspondencia-formal"
                        ],
                        "vocabularyBundles": []
                    }
                ]
            }
        ]
    }
    with open(c1_paths_file, "w", encoding="utf-8") as f:
        json.dump(c1_paths_data, f, ensure_ascii=False, indent=2)
        f.write("\n")
    print("✅ تم تحديث paths.json للمستوى C1 (4 دروس مكتملة)")

if __name__ == "__main__":
    main()
