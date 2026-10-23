# -*- coding: utf-8 -*-
"""
tools/books/perfect_data_c1.py
Pure schema definitions for C1 unit c1-u1-style (4 lessons).
100% compliant with validate-content.mjs and vitest content-gates.
"""

C1_LESSONS = [
    # -------------------------------------------------------------
    # 1. c1-precision-estilistica
    # -------------------------------------------------------------
    {
        "dir": "content/drafts/c1",
        "file": "lesson-c1-precision-estilistica.json",
        "lesson": {
            "slug": "c1-precision-estilistica",
            "titleAr": "الدقة الأسلوبية وبلاغة المفردات: Precisión estilística",
            "level": "C1",
            "programSlug": "main-track",
            "unitSlug": "c1-u1-style",
            "objectiveAr": "أن يستبدل المتعلم الأفعال العامة المبتذلة (hacer, decir, tener, poner) بأفعال دقيقة وبليغة (formular, manifestar, desempeñar, suscitar) تلائم الخطاب الأكاديمي والمهني الرفيع في مستوى C1.",
            "estimatedMinutes": 12,
            "skills": ["grammar", "reading", "writing", "listening", "vocabulary"],
            "newVocabulary": ["desempeñar", "suscitar", "formular", "manifestar", "precisión", "rigor"],
            "reviewVocabulary": ["trabajo", "tiempo", "sociedad", "bien"],
            "targetStructures": [
                "Sustitución de 'hacer': desempeñar un cargo, formular una pregunta",
                "Sustitución de 'decir': manifestar su desacuerdo, alegar razones",
                "Sustitución de 'poner': suscitar dudas, infligir daños"
            ],
            "grammarTopics": ["precision-lexica-c1", "registro-formal-y-academico"],
            "scenarios": [
                {
                    "contextAr": "اجتماع لمجلس أمناء مؤسسة أبحاث أكاديمية لمناقشة الصياغة النهائية للتقرير السنوي.",
                    "settingAr": "قاعة الاجتماعات الكبرى في الأكاديمية الملكية، مدريد",
                    "lines": [
                        {
                            "es": "El borrador inicial contiene demasiados verbos genéricos y expresiones coloquiales.",
                            "ar": "المسودة الأولية تتضمن الكثير من الأفعال العامة والتعبيرات الدارجة.",
                            "arEg": "المسودة الأولى فيها أفعال عامة كتيرة وأسلوبها مش أكاديمي كفاية.",
                            "audioKey": "pending/c1-prec-reunion-1"
                        },
                        {
                            "es": "Es verdad; en lugar de 'hacer una queja', debemos formular una reclamación formal.",
                            "ar": "هذا صحيح؛ فبدلاً من 'عمل شكوى'، يتعين علينا صياغة مطالبة رسمية.",
                            "arEg": "تمام؛ بدل ما نقول 'عمل شكوى'، الأصح نصيغ شكوى رسمية معتبرة.",
                            "audioKey": "pending/c1-prec-reunion-2"
                        },
                        {
                            "es": "Asimismo, conviene manifestar nuestro profundo agradecimiento a los patrocinadores.",
                            "ar": "كذلك، يجدر بنا الإعراب عن شكرنا العميق للرعاة والداعمين.",
                            "arEg": "وكمان لازم نعرب عن شكرنا الكبير للجهات الراعية للمشروع.",
                            "audioKey": "pending/c1-prec-reunion-3"
                        },
                        {
                            "es": "Ese nivel de precisión léxica confiere un rigor intachable a todo el documento.",
                            "ar": "هذا المستوى من الدقة اللفظية يضفي رصانة لا تشوبها شائبة على الوثيقة بأكملها.",
                            "arEg": "المستوى ده من الدقة في الكلام بيدي رصانة وهيبة كبيرة للتقرير كله.",
                            "audioKey": "pending/c1-prec-reunion-4"
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
                    "instructionAr": "استمع إلى الأكاديمي ولاحظ كيف استبدل الفعل العام بتعبير بليغ رفيع.",
                    "audioKey": "pending/c1-prec-reunion-2",
                    "speechEs": "Es verdad; en lugar de 'hacer una queja', debemos formular una reclamación formal.",
                    "options": [
                        {"id": "c1_prec_1_a", "text": "Formular una reclamación formal", "isCorrect": True, "textAr": "صياغة مطالبة رسمية بدقة"},
                        {"id": "c1_prec_1_b", "text": "Gritar muy fuerte en la calle", "isCorrect": False, "textAr": "الصراخ بصوت عال في الشارع", "distractorRationaleAr": "أسلوب سوقي لم يرد في التسجيل."},
                        {"id": "c1_prec_1_c", "text": "Olvidar el problema y no hacer nada", "isCorrect": False, "textAr": "نسيان المشكلة وعدم اتخاذ أي إجراء", "distractorRationaleAr": "مناقض لما ورد في الحوار الأكاديمي."}
                    ],
                    "answerKey": {"correctOptionIds": ["c1_prec_1_a"]},
                    "explanationAr": "استخدم المتحدث الفعل الدقيق «formular» بديلاً عن الفعل العام المبتذل hacer عند الحديث عن الشكاوى والمطالبات الرسمية.",
                    "errorFeedback": {
                        "c1_prec_1_b": "لم يقل الصراخ في الشارع.",
                        "c1_prec_1_c": "لم يقل نسيان المشكلة."
                    },
                    "skills": ["listening"],
                    "difficulty": 1,
                    "targetVocab": ["formular", "precisión"],
                    "scoring": {"mode": "all_or_nothing"}
                },
                {
                    "id": "c1_prec_2_verb_hacer",
                    "type": "word_choice",
                    "instructionAr": "ما هو البديل البلاغي الأكاديمي الرفيع لعبارة «hacer una pregunta»؟",
                    "options": [
                        {"id": "c1_prec_2_a", "text": "Formular una pregunta", "isCorrect": True, "textAr": "طرح وسياقة السؤال بدقة (formular)"},
                        {"id": "c1_prec_2_b", "text": "Decir una pregunta", "isCorrect": False, "textAr": "قول السؤال", "distractorRationaleAr": "تعبير ركيك غير دقيق أسلوبياً."},
                        {"id": "c1_prec_2_c", "text": "Poner una pregunta", "isCorrect": False, "textAr": "وضع السؤال", "distractorRationaleAr": "غير مستخدم إطلاقاً في الإسبانية الفصيحة."}
                    ],
                    "answerKey": {"correctOptionIds": ["c1_prec_2_a"]},
                    "explanationAr": "الفعل «formular» هو الاختيار الأسلوبي الأرقى في الإسبانية مع الأسئلة والفرضيات (formular una hipótesis / una pregunta).",
                    "errorFeedback": {
                        "c1_prec_2_b": "Decir una pregunta ركيكة.",
                        "c1_prec_2_c": "Poner una pregunta غير صحيحة."
                    },
                    "skills": ["reading", "vocabulary"],
                    "difficulty": 1,
                    "targetVocab": ["formular"],
                    "scoring": {"mode": "all_or_nothing"}
                },
                {
                    "id": "c1_prec_3_fill_cargo",
                    "type": "fill_blank",
                    "instructionAr": "أكمل الفراغ بالفعل الأسلوبي الدقيق لتولي المناصب: «شغل المنصب باقتدار».",
                    "stemEs": "La catedrática pasó a ____ el cargo de decana con gran prestigio.",
                    "stemAr": "تولت الأستاذة الجامعية شغل منصب العميدة بهيبة وتقدير واسع.",
                    "answerKey": {
                        "accepted": ["desempeñar", "ejercer"],
                        "caseSensitive": False
                    },
                    "explanationAr": "مع المناصب والوظائف المرموقة، لا نستخدم hacer بل نستخدم الفعل الراقي «desempeñar un cargo» أو «ejercer».",
                    "errorFeedback": {
                        "hacer": "مع المناصب الرسمية نستخدم الفعل البليغ desempeñar أو ejercer.",
                        "tener": "tener فعل عام سطحي لا يعبر عن ممارسة المنصب بنشاط."
                    },
                    "skills": ["writing", "vocabulary"],
                    "difficulty": 2,
                    "targetVocab": ["desempeñar"],
                    "scoring": {"mode": "all_or_nothing"}
                },
                {
                    "id": "c1_prec_4_fill_interes",
                    "type": "fill_blank",
                    "instructionAr": "أكمل بالفعل البلاغي الدقيق لإثارة الاهتمام والجدل في الأوساط العلمية.",
                    "stemEs": "La ponencia logró ____ un debate apasionado entre los asistentes.",
                    "stemAr": "نجحت المحاضرة في إثارة نقاش محتدم بين الحاضرين.",
                    "answerKey": {
                        "accepted": ["suscitar", "despertar", "provocar"],
                        "caseSensitive": False
                    },
                    "explanationAr": "مع النقاشات والشكوك والمشاعر، نستخدم الفعل البليغ «suscitar» (suscitar dudas / debate) بدلاً من الأفعال الشائعة المبتذلة.",
                    "errorFeedback": {
                        "hacer": "hacer un debate ركيكة جداً في مستوى C1.",
                        "poner": "poner un debate غير صحيحة لغوياً."
                    },
                    "skills": ["writing", "vocabulary"],
                    "difficulty": 2,
                    "targetVocab": ["suscitar"],
                    "scoring": {"mode": "all_or_nothing"}
                },
                {
                    "id": "c1_prec_5_collocation_choice",
                    "type": "word_choice",
                    "instructionAr": "ما هو الفعل الأدق لغوياً للتعبير عن إلحاق الضرر أو الخسارة الجسيمة في التقارير؟",
                    "options": [
                        {"id": "c1_prec_5_a", "text": "Infligir u ocasionar daños", "isCorrect": True, "textAr": "إلحاق أو تسبيب الأضرار (infligir / ocasionar)"},
                        {"id": "c1_prec_5_b", "text": "Fabricar daños graves", "isCorrect": False, "textAr": "صناعة أضرار", "distractorRationaleAr": "fabricar تخص المنتجات المادية ولا تصح مع الأضرار."},
                        {"id": "c1_prec_5_c", "text": "Construir perjuicios", "isCorrect": False, "textAr": "بناء أضرار", "distractorRationaleAr": "تناقض لغوي فج؛ البناء نقيض الأضرار."}
                    ],
                    "answerKey": {"correctOptionIds": ["c1_prec_5_a"]},
                    "explanationAr": "المصاحبة اللفظية الأرقى في النصوص القانونية والصحفية هي «infligir daños» (إلحاق أضرار) أو «ocasionar pérdidas».",
                    "errorFeedback": {
                        "c1_prec_5_b": "fabricar لا تصح مع المعنويات.",
                        "c1_prec_5_c": "construir لا تناسب الأضرار."
                    },
                    "skills": ["reading", "vocabulary"],
                    "difficulty": 1,
                    "targetVocab": ["rigor"],
                    "scoring": {"mode": "all_or_nothing"}
                },
                {
                    "id": "c1_prec_6_speak",
                    "type": "speak_with_text",
                    "instructionAr": "انطق هذه الجملة الأكاديمية بنبرة رصينة ومخارج حروف واضحة.",
                    "stemEs": "El informe suscita serias dudas sobre la viabilidad del plan.",
                    "stemAr": "يثير التقرير شكوكاً جدية حول جدوى الخطة الاقتصادية.",
                    "answerKey": {
                        "referenceAudioKey": "pending/c1-prec-speak-1",
                        "modelAnswer": "El informe suscita serias dudas sobre la viabilidad del plan."
                    },
                    "explanationAr": "انتبه لنطق حرف c في suscita كحرف ثاء لثوي في النطق القشتالي، وإبراز النبرة على مقطع -bi- في viabilidad.",
                    "skills": ["speaking", "pronunciation"],
                    "difficulty": 2,
                    "targetVocab": ["suscitar", "rigor"],
                    "scoring": {
                        "mode": "rubric",
                        "rubric": [
                            {"labelAr": "نطق حرف c في suscita بصوت الثاء القشتالي", "weight": 50, "code": "ceceo_suscita"},
                            {"labelAr": "سلامة نبر viabilidad على المقطع الأخير -dad", "weight": 50, "code": "stress_viabilidad"}
                        ]
                    }
                }
            ],
            "review": {
                "status": "draft",
                "authors": ["فريق المنهج - اشتقاق تطبيقي من سلاسل كتب Aula C1 وEn Vocabulario C1"],
                "spanishReviewer": None,
                "translationReviewer": None,
                "reviewedAt": None,
                "notes": "الدرس يركز على الرقي الأسلوبي واستبدال الأفعال العامة بألفاظ بليغة في مستوى C1."
            }
        }
    },

    # -------------------------------------------------------------
    # 2. c1-nominalizacion
    # -------------------------------------------------------------
    {
        "dir": "content/drafts/c1",
        "file": "lesson-c1-nominalizacion.json",
        "lesson": {
            "slug": "c1-nominalizacion",
            "titleAr": "الاسمية الأكاديمية وصياغة التقارير: Nominalización",
            "level": "C1",
            "programSlug": "main-track",
            "unitSlug": "c1-u1-style",
            "objectiveAr": "أن يحوّل المتعلم الجمل الفعلية الممتدة إلى صيغ اسمية موجزة وبليغة (Nominalización) باستخدام المصادر والأسماء المشتقة لتعزيز الكثافة المعلوماتية والموضوعية في النصوص الرسمية.",
            "estimatedMinutes": 11,
            "skills": ["grammar", "reading", "writing", "listening", "vocabulary"],
            "newVocabulary": ["reducción", "promulgación", "incremento", "adopción", "crecimiento", "gestión"],
            "reviewVocabulary": ["trabajo", "tiempo", "sociedad", "bien"],
            "targetStructures": [
                "De verbo a sustantivo: reducir -> la reducción de",
                "De verbo a sustantivo: promulgar -> la promulgación de la ley",
                "Condensación sintáctica: La rápida adopción de medidas evitó la crisis"
            ],
            "grammarTopics": ["nominalizacion-c1", "estilo-periodistico-y-academico"],
            "scenarios": [
                {
                    "contextAr": "مؤتمر صحفي بمقر وزارة الاقتصاد لإعلان المؤشرات المالية السنوية والتشريعات الجديدة.",
                    "settingAr": "قاعة المؤتمرات الوزارية، مدريد",
                    "lines": [
                        {
                            "es": "La promulgación de la nueva ley tributaria favoreció la reducción del déficit fiscal.",
                            "ar": "إن إصدار القانون الضريبي الجديد ساعد في تقليص العجز المالي.",
                            "arEg": "صدور القانون الضريبي الجديد ساعد في تقليل عجز الموازنة.",
                            "audioKey": "pending/c1-nom-parlamento-1"
                        },
                        {
                            "es": "Asimismo, constatamos un notable incremento en las exportaciones tecnológicas.",
                            "ar": "كذلك، نسجل ارتفاعاً ملحوظاً في الصادرات التكنولوجية.",
                            "arEg": "وكمان شايفين زيادة كبيرة وواضحة في تصدير التكنولوجيا.",
                            "audioKey": "pending/c1-nom-parlamento-2"
                        },
                        {
                            "es": "La adopción de estas medidas garantiza una gestión presupuestaria más transparente.",
                            "ar": "إن تبنّي هذه الإجراءات يضمن إدارة أكثر شفافية للميزانية.",
                            "arEg": "تطبيق الخطوات دي بيضمن إدارة أوضح وأحسن للمصاريف.",
                            "audioKey": "pending/c1-nom-parlamento-3"
                        },
                        {
                            "es": "Este balance demuestra la solidez de las reformas estructurales emprendidas.",
                            "ar": "هذه الحصيلة تبرهن على متانة الإصلاحات الهيكلية المتخذة.",
                            "arEg": "النتيجة دي بتثبت إن الإصلاحات ماشية في سكتها الصح.",
                            "audioKey": "pending/c1-nom-parlamento-4"
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
                    "instructionAr": "استمع إلى المتحدث ولاحظ كيف صاغ الحدث بأسلوب اسمي مكثف.",
                    "audioKey": "pending/c1-nom-parlamento-1",
                    "speechEs": "La promulgación de la nueva ley tributaria favoreció la reducción del déficit fiscal.",
                    "options": [
                        {"id": "c1_nom_1_a", "text": "La promulgación de la ley favoreció la reducción del déficit", "isCorrect": True, "textAr": "إصدار القانون ساهم في تقليص العجز المالي"},
                        {"id": "c1_nom_1_b", "text": "El parlamento decidió anular todas las leyes tributarias", "isCorrect": False, "textAr": "قرر البرلمان إلغاء جميع القوانين الضريبية", "distractorRationaleAr": "لم يقل ذلك بل تحدث عن إصدار قانون جديد."},
                        {"id": "c1_nom_1_c", "text": "El déficit aumentó de manera descontrolada", "isCorrect": False, "textAr": "العجز المالي ارتفع بشكل خارج عن السيطرة", "distractorRationaleAr": "مناقض تماماً لما أعلنه الوزير."}
                    ],
                    "answerKey": {"correctOptionIds": ["c1_nom_1_a"]},
                    "explanationAr": "صاغ المتحدث الجملة باستخدام اسمين مشتقين رئيسيين: «la promulgación» (بدلاً من cuando se promulgó) و«la reducción» (بدلاً من que se redujera).",
                    "errorFeedback": {
                        "c1_nom_1_b": "لم يقل إلغاء القوانين.",
                        "c1_nom_1_c": "لم يقل أن العجز ارتفع."
                    },
                    "skills": ["listening"],
                    "difficulty": 1,
                    "targetVocab": ["promulgación", "reducción"],
                    "scoring": {"mode": "all_or_nothing"}
                },
                {
                    "id": "c1_nom_2_concept",
                    "type": "word_choice",
                    "instructionAr": "ما هو الأثر البلاغي والأسلوبي لظاهرة الاسمية (Nominalización) في الخطاب الأكاديمي؟",
                    "options": [
                        {"id": "c1_nom_2_a", "text": "Aportar concisión, rigor y una mayor densidad informativa", "isCorrect": True, "textAr": "إضفاء الإيجاز والرصانة وكثافة معلوماتية عالية"},
                        {"id": "c1_nom_2_b", "text": "Hacer que el texto parezca una conversación informal de café", "isCorrect": False, "textAr": "جعل النص أشبه بحديث مقهى غير رسمي", "distractorRationaleAr": "عكس وظيفتها تماماً؛ الاسمية ترفع من رسمية النص."},
                        {"id": "c1_nom_2_c", "text": "Eliminar todos los sustantivos del párrafo", "isCorrect": False, "textAr": "حذف جميع الأسماء من الفقرة", "distractorRationaleAr": "الاسمية تعتمد على تحويل الأفعال لأسماء مشتقة."}
                    ],
                    "answerKey": {"correctOptionIds": ["c1_nom_2_a"]},
                    "explanationAr": "الاسمية تحول الجمل الطويلة المليئة بأفعال إلى عبارات اسمية رصينة ومحكمة تناسب الأوراق البحثية والتقارير الصحفية الرصينة.",
                    "errorFeedback": {
                        "c1_nom_2_b": "الاسمية ترفع المستوى ولا تجعله عامياً.",
                        "c1_nom_2_c": "الاسمية تضيف أسماء ولا تحذفها."
                    },
                    "skills": ["reading"],
                    "difficulty": 1,
                    "targetVocab": ["gestión"],
                    "scoring": {"mode": "all_or_nothing"}
                },
                {
                    "id": "c1_nom_3_fill_reducir",
                    "type": "fill_blank",
                    "instructionAr": "حوّل الفعل reducir إلى الاسم المشتق المناسب في الجملة التقريرية.",
                    "stemEs": "Se constató una notable ____ en el consumo energético global.",
                    "stemAr": "لوحظ انخفاض ملحوظ في الاستهلاك الإجمالي للطاقة.",
                    "answerKey": {
                        "accepted": ["reducción"],
                        "caseSensitive": False
                    },
                    "explanationAr": "الاسم المشتق القياسي من الفعل reducir هو «reducción»، ويُستخدم بكثرة في التقارير الاقتصادية والبيئية.",
                    "errorFeedback": {
                        "reducir": "المطلوب الاسم المشتق وليس المصدر المجرد الفعل reduccion.",
                        "reducimiento": "صيغة غير قياسية في الإسبانية الفصيحة."
                    },
                    "skills": ["writing", "grammar"],
                    "difficulty": 2,
                    "targetVocab": ["reducción"],
                    "scoring": {"mode": "all_or_nothing"}
                },
                {
                    "id": "c1_nom_4_fill_incrementar",
                    "type": "fill_blank",
                    "instructionAr": "حوّل الفعل incrementar إلى الاسم المشتق الدال على النمو والزيادة.",
                    "stemEs": "El informe destaca un fuerte ____ de la productividad laboral.",
                    "stemAr": "يبرز التقرير زيادة قوية في الإنتاجية العمالية.",
                    "answerKey": {
                        "accepted": ["incremento", "aumento"],
                        "caseSensitive": False
                    },
                    "explanationAr": "الاسم المشتق من الفعل incrementar هو «incremento»، وهو من أكثر الكلمات شيوعاً في تقارير المؤسسات المالية.",
                    "errorFeedback": {
                        "incrementar": "المطلوب الاسم المشتق من الفعل.",
                        "incrementación": "صيغة ركيكة غير معتمدة؛ الصحيح incremento."
                    },
                    "skills": ["writing", "grammar"],
                    "difficulty": 2,
                    "targetVocab": ["incremento"],
                    "scoring": {"mode": "all_or_nothing"}
                },
                {
                    "id": "c1_nom_5_parallel",
                    "type": "word_choice",
                    "instructionAr": "ما الذي يوازي ظاهرة الاسمية تمامًا في الصياغة الصحفية والبلاغة العربية؟",
                    "options": [
                        {"id": "c1_nom_5_a", "text": "El uso preferente de fuentes verbales (masdar)", "isCorrect": True, "textAr": "تفضيل استخدام المصادر الصريحة (المصدر الصريح) في العناوين والتقارير"},
                        {"id": "c1_nom_5_b", "text": "El uso exclusivo de adjetivos en grado superlativo", "isCorrect": False, "textAr": "استخدام صيغ التفضيل الحصرية فقط", "distractorRationaleAr": "صيغ التفضيل وصفية ولا تتعلق بالاشتقاق الاسمي للأحداث."},
                        {"id": "c1_nom_5_c", "text": "La eliminación obligatoria de todas las vocales", "isCorrect": False, "textAr": "حذف جميع الحركات الصوتية إجبارياً", "distractorRationaleAr": "لا صلة له بالنحو أو البلاغة."}
                    ],
                    "answerKey": {"correctOptionIds": ["c1_nom_5_a"]},
                    "explanationAr": "في الصحافة العربية الرصينة، تُصاغ العناوين والتقارير بالمصادر الصريحة (مثل: انخفاض العجز، إصدار القانون) وهو المعادل التام للـ Nominalización الإسبانية.",
                    "errorFeedback": {
                        "c1_nom_5_b": "صيغ التفضيل لا تشكل بنية اسمية.",
                        "c1_nom_5_c": "خيار لا معنى له."
                    },
                    "skills": ["reading"],
                    "difficulty": 1,
                    "targetVocab": ["adopción"],
                    "scoring": {"mode": "all_or_nothing"}
                },
                {
                    "id": "c1_nom_6_speak",
                    "type": "speak_with_text",
                    "instructionAr": "انطق هذه العبارة الاسمية المكثفة بنبرة مذيع إخباري محترف.",
                    "stemEs": "La rápida adopción de medidas evitó el colapso del sistema.",
                    "stemAr": "إن التبني السريع للإجراءات جنّب المنظومة خطر الانهيار.",
                    "answerKey": {
                        "referenceAudioKey": "pending/c1-nom-speak-1",
                        "modelAnswer": "La rápida adopción de medidas evitó el colapso del sistema."
                    },
                    "explanationAr": "لاحظ الوقف الإيقاعي بعد كلمة medidas، والنبرة الصحيحة لكلمة adopción على المقطع المنتهي بـ -ción المنبور.",
                    "skills": ["speaking", "pronunciation"],
                    "difficulty": 2,
                    "targetVocab": ["adopción"],
                    "scoring": {
                        "mode": "rubric",
                        "rubric": [
                            {"labelAr": "نطق adopción مع النبر على مقطع -ción", "weight": 50, "code": "stress_adopcion"},
                            {"labelAr": "سلاسة الربط الصوتي في عبارة evitó el colapso", "weight": 50, "code": "fluency_evito"}
                        ]
                    }
                }
            ],
            "review": {
                "status": "draft",
                "authors": ["فريق المنهج - اشتقاق تطبيقي من سلاسل كتب Aula C1 وEn Vocabulario C1"],
                "spanishReviewer": None,
                "translationReviewer": None,
                "reviewedAt": None,
                "notes": "الدرس يقدم أسلوب الاسمية الأكاديمية والصحفية بمقارنة مباشرة مع المصدر الصريح في العربية."
            }
        }
    },

    # -------------------------------------------------------------
    # 3. c1-refranes-modismos
    # -------------------------------------------------------------
    {
        "dir": "content/drafts/c1",
        "file": "lesson-c1-refranes-modismos.json",
        "lesson": {
            "slug": "c1-refranes-modismos",
            "titleAr": "الأمثال والكنايات الإسبانية: Refranes y modismos",
            "level": "C1",
            "programSlug": "main-track",
            "unitSlug": "c1-u1-style",
            "objectiveAr": "أن يفهم المتعلم ويوظف أشهر الأمثال الشعبية والكنايات الثقافية الإسبانية (Dar en el clavo, No tener pelos en la lengua, Estar en las nubes) في سياقاتها الاجتماعية والبلاغية الملائمة.",
            "estimatedMinutes": 11,
            "skills": ["grammar", "reading", "writing", "listening", "vocabulary"],
            "newVocabulary": ["refrán", "modismo", "clavo", "lengua", "nube", "acertar"],
            "reviewVocabulary": ["amigo", "trabajo", "tiempo", "bien"],
            "targetStructures": [
                "Expresión figurada: Dar en el clavo (أصاب كبد الحقيقة)",
                "Expresión figurada: No tener pelos en la lengua (صريح لا يداري)",
                "Expresión figurada: Estar en las nubes (سارح في أفكاره)",
                "Refrán popular: Más vale pájaro en mano que ciento volando"
            ],
            "grammarTopics": ["modismos-idiomaticos-c1", "fraseologia-espanola"],
            "scenarios": [
                {
                    "contextAr": "نقاش في برنامج حواري ثقافي حول كتاب سياسي جديد أثار جدلاً واسعاً في إسبانيا.",
                    "settingAr": "استوديو البث التلفزيوني، مدريد",
                    "lines": [
                        {
                            "es": "El autor no tiene pelos en la lengua al denunciar las malas prácticas.",
                            "ar": "المؤلف صريح لا يداري ولا يتردد في التنديد بالممارسات السيئة.",
                            "arEg": "الكاتب لسانه صريح جداً ومبيجاملش حد في فضح الغلط.",
                            "audioKey": "pending/c1-mod-tertulia-1"
                        },
                        {
                            "es": "Es verdad; en su análisis sobre la economía sumergida dio en el clavo.",
                            "ar": "هذا صحيح؛ فقد أصاب كبد الحقيقة في تحليله للاقتصاد الخفي.",
                            "arEg": "حقيقي؛ في تحليله للاقتصاد الموازي جاب التايهة وجابها في الجون.",
                            "audioKey": "pending/c1-mod-tertulia-2"
                        },
                        {
                            "es": "Sin embargo, en el capítulo social parece estar en las nubes.",
                            "ar": "ومع ذلك، يبدو في الفصل الاجتماعي غارقاً في أوهامه وسارحاً في السحاب.",
                            "arEg": "بس مع ذلك في الجزء بتاع المجتمع تحس إنه سارح ومش في الواقع.",
                            "audioKey": "pending/c1-mod-tertulia-3"
                        },
                        {
                            "es": "Aun así, la obra constituye un testimonio lúcido y valiente.",
                            "ar": "ورغم ذلك، يشكل العمل شهادة واعية وشجاعة.",
                            "arEg": "رغم كل ده، الكتاب شهادة قوية وجريئة جداً.",
                            "audioKey": "pending/c1-mod-tertulia-4"
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
                    "id": "c1_rec_1_listen",
                    "type": "listen_choose",
                    "instructionAr": "استمع إلى الناقد ولاحظ المعنى المجازي لعبارة «dar en el clavo».",
                    "audioKey": "pending/c1-mod-tertulia-2",
                    "speechEs": "Es verdad; en su análisis sobre la economía sumergida dio en el clavo.",
                    "options": [
                        {"id": "c1_rec_1_a", "text": "Acertó con exactitud y precisión plena en su diagnóstico", "isCorrect": True, "textAr": "أصاب كبد الحقيقة تماماً وبدقة بالغة"},
                        {"id": "c1_rec_1_b", "text": "Se equivocó por completo al usar datos falsos", "isCorrect": False, "textAr": "أخطأ تماماً باستخدام بيانات مغلوطة", "distractorRationaleAr": "المثل dar en el clavo يفيد الإصابة الدقيقة وليس الخطأ."},
                        {"id": "c1_rec_1_c", "text": "Golpeó la mesa con un martillo y clavos", "isCorrect": False, "textAr": "ضرب الطاولة بمطرقة ومسامير", "distractorRationaleAr": "تفسير حرفي ساذج يتجاهل المعنى الكنائي."}
                    ],
                    "answerKey": {"correctOptionIds": ["c1_rec_1_a"]},
                    "explanationAr": "المثل الكنائي «dar en el clavo» (أصاب المسمار بمطرقته) يقابل في العربية «أصاب كبد الحقيقة / أصاب شاكلة الصواب».",
                    "errorFeedback": {
                        "c1_rec_1_b": "المثل يعني الصواب التام.",
                        "c1_rec_1_c": "تفسير حرفي للمسمار."
                    },
                    "skills": ["listening"],
                    "difficulty": 1,
                    "targetVocab": ["clavo", "acertar"],
                    "scoring": {"mode": "all_or_nothing"}
                },
                {
                    "id": "c1_rec_2_pelos",
                    "type": "word_choice",
                    "instructionAr": "ماذا يعني التعبير الإسباني الشهير «No tener pelos en la lengua»؟",
                    "options": [
                        {"id": "c1_rec_2_a", "text": "Decir lo que se piensa con total franqueza y sin rodeos", "isCorrect": True, "textAr": "قول الحقيقة بصراحة مطلقة ودون مواربة"},
                        {"id": "c1_rec_2_b", "text": "Padecer una dolencia médica en la boca", "isCorrect": False, "textAr": "المعاناة من مرض عضوي في الفم", "distractorRationaleAr": "تفسير حرفي؛ التعبير مجازي بحت."},
                        {"id": "c1_rec_2_c", "text": "Hablar una lengua extranjera con dificultad", "isCorrect": False, "textAr": "التحدث بلغة أجنبية بصعوبة", "distractorRationaleAr": "لا صلة للتعبير باللغات الأجنبية."}
                    ],
                    "answerKey": {"correctOptionIds": ["c1_rec_2_a"]},
                    "explanationAr": "التعبير «no tener pelos en la lengua» يعني أن الشخص جريء وصريح لا يخشى قول رأيه، ويقابله في العامية المصرية «ما بيجاملش ولسانه صريح».",
                    "errorFeedback": {
                        "c1_rec_2_b": "ليس مرضاً طبياً.",
                        "c1_rec_2_c": "لا علاقة له باللغات الأجنبية."
                    },
                    "skills": ["reading"],
                    "difficulty": 1,
                    "targetVocab": ["lengua", "modismo"],
                    "scoring": {"mode": "all_or_nothing"}
                },
                {
                    "id": "c1_rec_3_fill_clavo",
                    "type": "fill_blank",
                    "instructionAr": "أكمل الكناية الإسبانية لإصابة عين الصواب: «أصاب الطبيب كبد الحقيقة».",
                    "stemEs": "Con ese diagnóstico tan certero, el especialista dio en el ____.",
                    "stemAr": "بذلك التشخيص الصائب تماماً، أصاب الطبيب كبد الحقيقة.",
                    "answerKey": {
                        "accepted": ["clavo"],
                        "caseSensitive": False
                    },
                    "explanationAr": "التعبير الثابت هو «dar en el clavo».",
                    "errorFeedback": {
                        "blanco": "dar en el blanco واردة أيضاً، ولكن clavo هي الأوسع شيوعاً في هذا المثل.",
                        "ojo": "dar en el ojo لا تفيد الصواب."
                    },
                    "skills": ["writing", "vocabulary"],
                    "difficulty": 2,
                    "targetVocab": ["clavo"],
                    "scoring": {"mode": "all_or_nothing"}
                },
                {
                    "id": "c1_rec_4_fill_nubes",
                    "type": "fill_blank",
                    "instructionAr": "أكمل التعبير الكنائي الدال على التشتت وعدم التركيز: «سارح في السحاب».",
                    "stemEs": "No escuchó la pregunta del profesor porque estaba en las ____.",
                    "stemAr": "لم يسمع سؤال الأستاذ لأنه كان سارحاً في أفكاره (في السحاب).",
                    "answerKey": {
                        "accepted": ["nubes"],
                        "caseSensitive": False
                    },
                    "explanationAr": "الكناية الإسبانية «estar en las nubes» تعني الشرود الذهني، وتطابق التعبير العربي الدارج «فلان سارح في السحاب».",
                    "errorFeedback": {
                        "estrellas": "estar en las estrellas غير شائعة لهذا المعنى.",
                        "alturas": "estar en las alturas لا تعني الشرود الذهني."
                    },
                    "skills": ["writing", "vocabulary"],
                    "difficulty": 2,
                    "targetVocab": ["nube"],
                    "scoring": {"mode": "all_or_nothing"}
                },
                {
                    "id": "c1_rec_5_order",
                    "type": "word_order",
                    "instructionAr": "رتب الكلمات التالية لتكوين المثل الإسباني الشهير: «عصفور في اليد خير من ألف على الشجرة».",
                    "items": [
                        {"id": "c1_ref_t1", "kind": "token", "text": "Más"},
                        {"id": "c1_ref_t2", "kind": "token", "text": "vale"},
                        {"id": "c1_ref_t3", "kind": "token", "text": "pájaro"},
                        {"id": "c1_ref_t4", "kind": "token", "text": "en"},
                        {"id": "c1_ref_t5", "kind": "token", "text": "mano."}
                    ],
                    "answerKey": {
                        "accepted": ["Más vale pájaro en mano."],
                        "tokenOrder": ["c1_ref_t1", "c1_ref_t2", "c1_ref_t3", "c1_ref_t4", "c1_ref_t5"]
                    },
                    "explanationAr": "المثل الشهير هو «Más vale pájaro en mano que ciento volando»، والمقطع الأول منه يمثل النصف الأساسي للمثل.",
                    "skills": ["writing"],
                    "difficulty": 2,
                    "targetVocab": ["refrán"],
                    "scoring": {"mode": "all_or_nothing"}
                },
                {
                    "id": "c1_rec_6_speak",
                    "type": "speak_with_text",
                    "instructionAr": "انطق هذه العبارة الكنائية بنبرة حيوية وسلسة.",
                    "stemEs": "El periodista no tiene pelos en la lengua al criticar las medidas.",
                    "stemAr": "الصحفي لا يتردد في قول الحقيقة بصراحة تامة عند انتقاد الإجراءات.",
                    "answerKey": {
                        "referenceAudioKey": "pending/c1-rec-speak-1",
                        "modelAnswer": "El periodista no tiene pelos en la lengua al criticar las medidas."
                    },
                    "explanationAr": "لاحظ الوصل الصوتي في pelos en la lengua ونطق الـ g في lengua كصوت خفيف مرقق.",
                    "skills": ["speaking", "pronunciation"],
                    "difficulty": 2,
                    "targetVocab": ["lengua", "modismo"],
                    "scoring": {
                        "mode": "rubric",
                        "rubric": [
                            {"labelAr": "نطق pelos en la lengua بسلاسة تامة", "weight": 50, "code": "fluency_pelos"},
                            {"labelAr": "مخارج الحروف في criticar las medidas", "weight": 50, "code": "pron_medidas"}
                        ]
                    }
                }
            ],
            "review": {
                "status": "draft",
                "authors": ["فريق المنهج - اشتقاق تطبيقي من سلاسل كتب Aula C1 وSueña 3"],
                "spanishReviewer": None,
                "translationReviewer": None,
                "reviewedAt": None,
                "notes": "الدرس يقدم الأمثال الشعبية والكنايات الثقافية الإسبانية ومقابلاتها الدقيقة في الثقافة العربية."
            }
        }
    },

    # -------------------------------------------------------------
    # 4. c1-correspondencia-formal
    # -------------------------------------------------------------
    {
        "dir": "content/drafts/c1",
        "file": "lesson-c1-correspondencia-formal.json",
        "lesson": {
            "slug": "c1-correspondencia-formal",
            "titleAr": "المراسلات الرسمية والبروتوكول الإداري: Correspondencia formal",
            "level": "C1",
            "programSlug": "main-track",
            "unitSlug": "c1-u1-style",
            "objectiveAr": "أن يحرر المتعلم خطابات ومراسلات إدارية ودبلوماسية متكاملة ومتقنة الصياغة (تحية، تمهيد، عرض، خاتمة بروتوكولية) وفق أرقى معايير الكتابة الرسمية في العالم الناطق بالإسبانية.",
            "estimatedMinutes": 12,
            "skills": ["grammar", "reading", "writing", "listening", "vocabulary"],
            "newVocabulary": ["estimado", "propósito", "atentamente", "disposición", "cordial", "reclamación"],
            "reviewVocabulary": ["trabajo", "amigo", "tiempo", "bien"],
            "targetStructures": [
                "Fórmula de encabezamiento: Estimado/a Sr./Sra. (+ Apellido):",
                "Fórmula de apertura: Me dirijo a usted con el propósito de...",
                "Fórmula de disponibilidad: Quedo a su entera disposición para...",
                "Fórmula de despedida: Atentamente / Le saluda atentamente"
            ],
            "grammarTopics": ["correspondencia-epistolar-c1", "formula-de-cortesia"],
            "scenarios": [
                {
                    "contextAr": "موظف رفيع يحرر خطاباً رسمياً موجهاً إلى مدير المعهد الثقافي لطلب رعاية مؤتمر دولي.",
                    "settingAr": "مكتب العلاقات المؤسسية، مدريد",
                    "lines": [
                        {
                            "es": "Estimado Sr. Director: Me dirijo a usted con el propósito de presentarle nuestro proyecto.",
                            "ar": "سيدي المدير المحترم: أتوجه إلى سيادتكم بغرض عرض مشروعنا العلمي عليكم.",
                            "arEg": "السيد المدير المحترم: بتشرف بمراسلة حضرتك عشان أعرض على سيادتك مشروعنا.",
                            "audioKey": "pending/c1-corr-carta-1"
                        },
                        {
                            "es": "Sería un gran honor contar con el prestigioso patrocinio de su institución.",
                            "ar": "سيكون شرفاً كبيراً لنا أن نحظى بالرعاية الكريمة لمؤسستكم الموقرة.",
                            "arEg": "هيبقى شرف كبير لينا رعاية مؤسستكم المحترمة للحدث ده.",
                            "audioKey": "pending/c1-corr-carta-2"
                        },
                        {
                            "es": "Quedo a su entera disposición para cualquier aclaración o reunión que estime oportuna.",
                            "ar": "وأظل تحت تصرف سيادتكم التام لأي إيضاح أو اجتماع ترونه مناسباً.",
                            "arEg": "وأنا تحت أمر حضرتك تماماً في أي توضيح أو مقابلة تحددوها.",
                            "audioKey": "pending/c1-corr-carta-3"
                        },
                        {
                            "es": "Sin otro particular, le saluda atentamente, Dr. Alejandro Morales.",
                            "ar": "وتفضلوا بقبول فائق الاحترام والتقدير، د. أليخاندرو موراليس.",
                            "arEg": "ولكم وافر الاحترام والتقدير، د. أليخاندرو موراليس.",
                            "audioKey": "pending/c1-corr-carta-4"
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
                    "id": "c1_corr_1_listen",
                    "type": "listen_choose",
                    "instructionAr": "استمع إلى مطلع الخطاب الرسمي ولاحظ العبارة المستخدمة لتحديد الغرض من الرسالة.",
                    "audioKey": "pending/c1-corr-carta-1",
                    "speechEs": "Estimado Sr. Director: Me dirijo a usted con el propósito de presentarle nuestro proyecto.",
                    "options": [
                        {"id": "c1_corr_1_a", "text": "Me dirijo a usted con el propósito de presentarle nuestro proyecto", "isCorrect": True, "textAr": "أتوجه إلى سيادتكم بغرض عرض مشروعنا عليكم"},
                        {"id": "c1_corr_1_b", "text": "Te escribo para pedirte dinero urgente", "isCorrect": False, "textAr": "أكتب لك لأطلب مالاً عاجلاً", "distractorRationaleAr": "أسلوب شخصي فظ لا يمت للبروتوكول الرسمي."},
                        {"id": "c1_corr_1_c", "text": "Hola amigo, ¿cómo va todo por allí?", "isCorrect": False, "textAr": "أهلاً يا صديقي كيف حالك", "distractorRationaleAr": "تحية عامية غير رسمية."}
                    ],
                    "answerKey": {"correctOptionIds": ["c1_corr_1_a"]},
                    "explanationAr": "الافتتاحية الإدارية القياسية في الإسبانية هي: «Me dirijo a usted con el propósito / fin de...» (أتوجه إلى سيادتكم بغرض...).",
                    "errorFeedback": {
                        "c1_corr_1_b": "أسلوب غير لائق إدارياً.",
                        "c1_corr_1_c": "تحية أصدقاء غير رسمية."
                    },
                    "skills": ["listening"],
                    "difficulty": 1,
                    "targetVocab": ["propósito", "estimado"],
                    "scoring": {"mode": "all_or_nothing"}
                },
                {
                    "id": "c1_corr_2_salutation",
                    "type": "word_choice",
                    "instructionAr": "ما هي التحية الرسمية القياسية لرسالة موجهة لمسؤول لا نعرف اسمه الشخصي؟",
                    "options": [
                        {"id": "c1_corr_2_a", "text": "Estimado/a Sr./Sra.:", "isCorrect": True, "textAr": "سيدي الفاضل / سيدتي الفاضلة المحترمة"},
                        {"id": "c1_corr_2_b", "text": "¡Hola, colega!", "isCorrect": False, "textAr": "مرحباً يا زميل", "distractorRationaleAr": "أسلوب عامي دارج لا يصح في الخطابات الإدارية."},
                        {"id": "c1_corr_2_c", "text": "¿Qué hay de nuevo?", "isCorrect": False, "textAr": "ما الجديد عندك", "distractorRationaleAr": "عبارة محادثة شفوية غير لائقة."}
                    ],
                    "answerKey": {"correctOptionIds": ["c1_corr_2_a"]},
                    "explanationAr": "التحية الرسمية الأكثر وقاراً في العالم الإسباني هي «Estimado/a Sr./Sra.:» وتتبعها دائماً النقطتان الرأسيتان (:) وليس الفاصلة كما في الإنجليزية.",
                    "errorFeedback": {
                        "c1_corr_2_b": "أسلوب عامي غير لائق.",
                        "c1_corr_2_c": "عبارة شفوية مبتذلة."
                    },
                    "skills": ["reading"],
                    "difficulty": 1,
                    "targetVocab": ["estimado"],
                    "scoring": {"mode": "all_or_nothing"}
                },
                {
                    "id": "c1_corr_3_fill_proposito",
                    "type": "fill_blank",
                    "instructionAr": "أكمل التعبير الإداري لتحديد غرض المراسلة: «بغرض تقديم عرضنا».",
                    "stemEs": "Nos dirigimos a usted con el ____ de solicitar una entrevista formal.",
                    "stemAr": "نتوجه إلى سيادتكم بغرض طلب مقابلة رسمية.",
                    "answerKey": {
                        "accepted": ["propósito", "fin", "objeto"],
                        "caseSensitive": False
                    },
                    "explanationAr": "العبارة الإدارية القياسية هي «con el propósito de» أو «con el fin / objeto de».",
                    "errorFeedback": {
                        "tiempo": "con el tiempo تعني بمرور الوقت.",
                        "gusto": "con el gusto تعني بسرور ولا تحدد الغرض الإداري."
                    },
                    "skills": ["writing", "vocabulary"],
                    "difficulty": 2,
                    "targetVocab": ["propósito"],
                    "scoring": {"mode": "all_or_nothing"}
                },
                {
                    "id": "c1_corr_4_fill_atentamente",
                    "type": "fill_blank",
                    "instructionAr": "أكمل كلمة الختام البروتوكولية القياسية: «وتفضلوا بقبول فائق الاحترام».",
                    "stemEs": "Sin otro particular, le saluda ____, Laura Gómez.",
                    "stemAr": "وتفضلوا بقبول فائق الاحترام والتقدير، لاورا غوميز.",
                    "answerKey": {
                        "accepted": ["atentamente", "cordialmente"],
                        "caseSensitive": False
                    },
                    "explanationAr": "الظرف «atentamente» هو الختام الرسمي الأكثر اعتماداً ورسوخاً في البروتوكول الإداري الإسباني.",
                    "errorFeedback": {
                        "bien": "le saluda bien غير صحيحة أسلوبياً.",
                        "pronto": "le saluda pronto عامية وركيكة."
                    },
                    "skills": ["writing", "vocabulary"],
                    "difficulty": 2,
                    "targetVocab": ["atentamente"],
                    "scoring": {"mode": "all_or_nothing"}
                },
                {
                    "id": "c1_corr_5_disposition_choice",
                    "type": "word_choice",
                    "instructionAr": "ما هي العبارة البروتوكولية الإسبانية لإعلان الجاهزية التامة للمساعدة والاستفسار؟",
                    "options": [
                        {"id": "c1_corr_5_a", "text": "Quedo a su entera disposición", "isCorrect": True, "textAr": "أظل تحت تصرف سيادتكم التام"},
                        {"id": "c1_corr_5_b", "text": "Llámame si te apetece", "isCorrect": False, "textAr": "اتصل بي إذا رغبت", "distractorRationaleAr": "صيغة عامية تفتقر للاحترام البروتوكولي."},
                        {"id": "c1_corr_5_c", "text": "Ya hablaremos algún día", "isCorrect": False, "textAr": "سنتحدث يوماً ما", "distractorRationaleAr": "أسلوب تسويفي لا يليق بالمعاملات الرسمية."}
                    ],
                    "answerKey": {"correctOptionIds": ["c1_corr_5_a"]},
                    "explanationAr": "صيغة «Quedo a su entera disposición» هي المعادل الدقيق لقولنا في المخاطبات الرسمية العربية: «وأنا تحت تصرف سيادتكم لأي استيضاح».",
                    "errorFeedback": {
                        "c1_corr_5_b": "أسلوب عامي لا يليق.",
                        "c1_corr_5_c": "أسلوب تسويفي غير رسمي."
                    },
                    "skills": ["reading"],
                    "difficulty": 1,
                    "targetVocab": ["disposición"],
                    "scoring": {"mode": "all_or_nothing"}
                },
                {
                    "id": "c1_corr_6_speak",
                    "type": "speak_with_text",
                    "instructionAr": "انطق هذه العبارة البروتوكولية بنبرة مؤدبة ومحترفة للغاية.",
                    "stemEs": "Quedo a su entera disposición para cualquier consulta adicional.",
                    "stemAr": "أظل تحت تصرف سيادتكم التام لأي استفسار إضافي.",
                    "answerKey": {
                        "referenceAudioKey": "pending/c1-corr-speak-1",
                        "modelAnswer": "Quedo a su entera disposición para cualquier consulta adicional."
                    },
                    "explanationAr": "احرص على سلامة نطق حرف d في disposición كحرف مرقق بين الصوائت، والنبر على المقطع الأخير -sión.",
                    "skills": ["speaking", "pronunciation"],
                    "difficulty": 2,
                    "targetVocab": ["disposición", "cordial"],
                    "scoring": {
                        "mode": "rubric",
                        "rubric": [
                            {"labelAr": "نطق disposición مع النبر على -sión", "weight": 50, "code": "stress_disposicion"},
                            {"labelAr": "مخارج الحروف وسلاسة الإلقاء الرسمي", "weight": 50, "code": "fluency_formal"}
                        ]
                    }
                }
            ],
            "review": {
                "status": "draft",
                "authors": ["فريق المنهج - اشتقاق تطبيقي من سلاسل كتب Aula C1 وSueña 3"],
                "spanishReviewer": None,
                "translationReviewer": None,
                "reviewedAt": None,
                "notes": "الدرس يقدم قواعد وبروتوكول المراسلات الرسمية والإدارية في مستوى C1."
            }
        }
    }
]
