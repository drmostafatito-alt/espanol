# -*- coding: utf-8 -*-
"""B1 Units 7 (Media & Reported Speech) and 8 (Health & Medical Recommendations with Subjunctive).
8 Lessons completing B1 Units 7 and 8 based on:
- Aula Plus 3 (Unidades 3 & 4)
- Gramática del uso del español A1-B2 (Capítulos 88-92: Estilo indirecto y cambios de tiempos)
- Español 2000 Nivel Intermedio (Lecciones de prensa, estilo indirecto y salud)
- المرشد في اللغة الأسبانية (الكلام المنقول المباشر وغير المباشر، وتوافق الأزمنة، والتوصيات بالمنصوب)
"""
import sys, os
sys.path.insert(0, os.path.dirname(__file__))
from common import opt, choice_ex, fill_ex, order_ex, speak_ex, lesson_doc, review_block

# ==============================================================================
# UNIT 7: b1-u7-media (الإعلام والأخبار والكلام المنقول)
# ==============================================================================

def make_lesson_noticias_prensa():
    slug = "b1-noticias-prensa"
    doc = {
        "slug": slug,
        "unitSlug": "b1-u7-media",
        "levelCode": "B1",
        "titleAr": "لغة الصحافة والإعلام: قراءة العناوين وتحليل الأخبار ومصادر المعلومات",
        "titleEs": "El lenguaje de las noticias, titulares y medios de comunicación",
        "subtitleAr": "أقسام الجريدة، صياغة العناوين الجاذبة، والتحقق من موثوقية المصادر",
        "order": 1,
        "estimatedMinutes": 18,
        "cefrLevel": "B1",
        "review": review_block(),
        "pedagogy": {
            "learningObjectivesAr": [
                "أن يقرأ المتعلم عناوين الصحف والمقالات الإخبارية باللغة الإسبانية ويفهم رسالتها الأساسية.",
                "أن يتعرف على البنية الصحفية: el titular, la entradilla, la fuente fidedigna, el suceso.",
                "أن يميز بين الأخبار الموثقة والمعلومات المضللة أو الزائفة (las noticias falsas / bulos)."
            ],
            "grammarPoints": [
                {
                    "titleAr": "الخصائص اللغوية للأسلوب الصحفي الإسباني",
                    "explanationAr": "1. **لغة العناوين (Los titulares)**:\n- استخدام الحاضر التاريخي (Presente histórico) لإعطاء حيوية للحدث المنتهي: *El gobierno aprueba una nueva ley laboral*.\n- حذف أدوات التعريف أحياناً للاختصار: *Lluvias torrenciales provocan inundaciones*.\n2. **نسبة الكلام لمصادره**:\n- **Según fuentes oficiales**: وفقاً لمصادر رسمية.\n- **De acuerdo con**: بحسب ما صرح به المتحدث الرسمي.\n- **Señalar / Apuntar / Declarar**: أفعال النقل الإخباري الرصينة."
                }
            ],
            "commonMistakesAr": [
                "ترجمة 'الخبر العاجل' حرفياً بـ *noticia rápida*؛ المصطلح الإخباري المعتمد هو última hora أو noticia de última hora.",
                "استخدام *título* بدلاً من el titular عند الحديث عن عناوين المقالات والصحف."
            ],
            "dialectNotes": [
                {
                    "region": "EG",
                    "noteAr": "في مصر بنقول: «شفت المانشيت ده في الجرنال؟ المصادر بتقول كذا». بالإسبانية: ¿Has visto el titular? Según fuentes oficiales..."
                }
            ],
            "culturalNoteAr": "الصحف الإسبانية الكبرى مثل *El País* و *El Mundo* تتبع أدلة أسلوب صارمة (Libros de estilo) يُنصح دارسو الإسبانية بمطالعتها لتعلم الكتابة الموضوعية الرصينة."
        },
        "contentBlocks": [
            {
                "id": f"cb-{slug}-intro",
                "type": "explanation",
                "titleAr": "مصطلحات الإعلام والصحافة",
                "bodyAr": "المفردات الأساسية:\n- **el titular**: العنوان الصحفي البارز (المانشيت)\n- **la fuente fidedigna**: المصدر الموثوق والمعتمد\n- **el suceso**: الحدث أو الواقعة الإخبارية\n- **la última hora**: الخبر العاجل\n- **desmentir**: يكذب أو ينفي خبراً شاع\n- **el medio de comunicación**: وسيلة الإعلام",
                "examples": [
                    {"es": "El titular del periódico destaca el acuerdo internacional sobre el clima.", "ar": "العنوان الرئيسي للجريدة يبرز الاتفاق الدولي حول المناخ."},
                    {"es": "El portavoz salió a desmentir los rumores difundidos en redes sociales.", "ar": "خرج المتحدث الرسمي لنفي الشائعات المتداولة على وسائل التواصل."},
                    {"es": "Es esencial consultar fuentes fidedignas antes de compartir una noticia.", "ar": "من الجوهري مراجعة مصادر موثوقة قبل مشاركة أي خبر."}
                ]
            }
        ],
        "newVocabulary": ["titular", "fuente fidedigna", "suceso", "última hora", "desmentir", "medio de comunicación"],
        "reviewVocabulary": ["noticia", "periódico"]
    }

    exs = [
        choice_ex(
            "ex-b1-not-1", "word_choice",
            "اختر المفردة التي تعني العنوان البارز في الصحافة (المانشيت)",
            ["vocabulary"], 1,
            "ما هو المصطلح الصحفي الذي يطلق على عنوان المقال أو الخبر في الجريدة؟",
            "El impactante _____ de la portada captó la atención de todos los lectores.",
            "العنوان ... الصادم في الصفحة الأولى جذب انتباه جميع القراء.",
            [
                opt("a", "titular", "العنوان الصحفي (الصواب)", True),
                opt("b", "suceso", "الحدث الإخباري", False, "suceso هو الواقعة نفسها، أما الكلمة المكتوبة في الأعلى فهي titular."),
                opt("c", "desmentir", "ينفي خبراً (فعل)", False, "نحتاج اسماً مذكراً بعد el impactante.")
            ],
            ["titular", "suceso", "desmentir"],
            "el titular هو العنوان الصحفي البارز في الجريدة أو الموقع الإخباري."
        ),
        fill_ex(
            "ex-b1-not-2",
            "أكمل بالفعل الدال على نفي وتكذيب الشائعة في المصدر (desmentir)",
            ["grammar", "writing"], 1,
            "اكتب الفعل الإسباني الذي يعني 'ينفي أو يكذب خبراً غير صحيح' في المصدر (desmentir)",
            "El ministro convocó una rueda de prensa para _____ la información falsa.",
            "دعا الوزير لمؤتمر صحفي لنفي المعلومة الخاطئة.",
            ["desmentir"],
            ["desmentir"],
            "فعل desmentir يعني ينفي أو يكذب خبراً أو شائعة متداولة."
        ),
        choice_ex(
            "ex-b1-not-3", "word_choice",
            "حدد الوصف المهني للمصدر الموثوق للأخبار",
            ["vocabulary"], 2,
            "كيف تصف مصدراً إخبارياً يتمتع بأعلى درجات المصداقية والتحقق؟",
            "La noticia fue confirmada por una _____ cercana a la investigación.",
            "تم تأكيد الخبر من قِبل ... قريبة من التحقيقات.",
            [
                opt("a", "fuente fidedigna", "مصدر موثوق ومعتمد (الصواب)", True),
                opt("b", "última hora", "خبر عاجل", False, "نحتاج اسم الجهة أو المصدر (fuente fidedigna)."),
                opt("c", "titular", "عنوان", False, "الخبر يؤكده مصدر موثوق.")
            ],
            ["fuente fidedigna", "última hora", "titular", "noticia"],
            "una fuente fidedigna تعني مصدراً موثوقاً يتمتع بالمصداقية والأمانة."
        ),
        order_ex(
            "ex-b1-not-4",
            "رتّب الجملة للإعلان عن خبر عاجل في وسائل الإعلام",
            ["grammar", "writing"], 2,
            ["Tenemos", "una", "noticia", "de", "última", "hora", "hoy"],
            "Tenemos una noticia de última hora hoy",
            "الترتيب: الفعل Tenemos ثم المفعول una noticia de última hora ثم الظرف hoy.",
            ["última hora", "noticia"]
        ),
        choice_ex(
            "ex-b1-not-5", "listen_choose",
            "استمع للتسجيل وحدد دور وسائل الإعلام في التوعية",
            ["listening", "vocabulary"], 2,
            "استمع لنشرة الأخبار وحدد ما تؤكده المذيعة",
            "Todo medio de comunicación debe verificar rigurosamente los hechos.",
            "يجب على كل وسيلة إعلام أن تتحقق بدقة من الوقائع.",
            [
                opt("a", "medio de comunicación", "وسيلة الإعلام (الصواب)", True),
                opt("b", "desmentir", "نفي فقط", False, "المذيعة تحدثت عن مسؤولية وسيلة الإعلام ككل (medio de comunicación)."),
                opt("c", "última hora", "عاجل", False, "الحديث يدور حول واجب وسائل الإعلام المهني.")
            ],
            ["medio de comunicación", "desmentir", "última hora"],
            "المذيعة قالت: 'Todo medio de comunicación debe verificar los hechos'.",
            audioKey="pending/b1_medio_comunicacion_verificar.mp3",
            speechEs="Todo medio de comunicación debe verificar rigurosamente los hechos."
        ),
        speak_ex(
            "ex-b1-not-6",
            "انطق جملتك الإخبارية بالاستناد لمصادر موثوقة",
            ["speaking", "pronunciation"], 2,
            "انطق الجملة التالية بأسلوب صحفي رصين:",
            "Según una fuente fidedigna, el titular del periódico confirma el acuerdo.",
            "وفقاً لمصدر موثوق، يؤكد العنوان الرئيسي للجريدة التوصل للاتفاق.",
            "pending/b1_fuente_fidedigna_titular.mp3",
            ["fuente fidedigna", "titular"],
            "Según una fuente fidedigna, el titular del periódico confirma el acuerdo.",
            "انتبه لنطق حرف d بين الصائتين في fidedigna بنعومة صوتية طبيعية."
        )
    ]
    return lesson_doc(doc, exs, level="B1")


def make_lesson_estilo_indirecto_presente():
    slug = "b1-estilo-indirecto-presente"
    doc = {
        "slug": slug,
        "unitSlug": "b1-u7-media",
        "levelCode": "B1",
        "titleAr": "الكلام المنقول في الحاضر: نقل الأقوال والطلبات والأوامر بـ Dice que",
        "titleEs": "El estilo indirecto en presente: Transmitir mensajes y peticiones",
        "subtitleAr": "Dice que + indicativo (للإخبار) مقابل Dice que + subjuntivo (للطلب والأمر)",
        "order": 2,
        "estimatedMinutes": 18,
        "cefrLevel": "B1",
        "review": review_block(),
        "pedagogy": {
            "learningObjectivesAr": [
                "أن ينقل المتعلم أقوال الآخرين عندما يكون فعل القول في الحاضر (Dice que, Comenta que).",
                "أن يفرق بدقة بين نقل معلومة خبرية (Dice que viene) ونقل طلب أو أمر (Dice que vengas بالمنصوب).",
                "أن يغير الضمائر الشخصية وصفات الملكية والظروف بما يناسب موقع المتحدث الجديد."
            ],
            "grammarPoints": [
                {
                    "titleAr": "قواعد الكلام المنقول عندما يكون فعل القول في الحاضر",
                    "explanationAr": "عندما يكون فعل القول في الحاضر (Dice, Pregunta, Pide, Recuerda):\n1. **نقل جملة خبرية (معلومة)**: Dice que + **Indicativo** (لا يتغير زمن الفعل):\n- «Estoy cansado» ⇒ Juan dice que **está** cansado.\n- «Mañana viajaré» ⇒ Dice que mañana **viajará**.\n2. **نقل أمر أو طلب (تعليمات)**: Dice que / Pide que + **Subjuntivo**:\n- «¡Ven aquí!» ⇒ Dice que **vengas** aquí.\n- «Por favor, llámame» ⇒ Pide que lo **llames**.\n3. **نقل سؤال مباشر**:\n- سؤال نعم/لا: ¿Vienes? ⇒ Pregunta **si** vienes.\n- سؤال بأداة استفهام: ¿Qué hora es? ⇒ Pregunta **qué** hora es."
                }
            ],
            "commonMistakesAr": [
                "استخدام الإخباري عند نقل الأمر أو الطلب (الخطأ: *Dice que vienes* عندما يقصد 'يقول لك أن تأتي'؛ الصواب: Dice que vengas بالمنصوب).",
                "نسيان تحويل ضمائر الملكية (نقل *Dice que mi casa es bonita* بدلاً من su casa)."
            ],
            "dialectNotes": [
                {
                    "region": "EG",
                    "noteAr": "في مصر بنقول: «بيقولك تعال، وبيقول إنه تعبان ومش هيقدر ينزل». بالإسبانية: Dice que vengas (طلب بالمنصوب), y dice que está cansado (خبر بالإخباري)."
                }
            ],
            "culturalNoteAr": "نقل الرسائل والطلبات عبر الهاتف (Transmitir recados) باستخدام 'Dice que...' هو أحد أكثر الأساليب اللغوية استخداماً في المعاملات اليومية بإسبانيا."
        },
        "contentBlocks": [
            {
                "id": f"cb-{slug}-intro",
                "type": "explanation",
                "titleAr": "التفريق الحاسم في نقل الكلام",
                "bodyAr": "الفرق بين نقل المعلومة ونقل الأمر:\n- **dice que + Indicativo**: ينقل معلومة خبرية صريحة (Dice que tiene hambre)\n- **dice que + Subjuntivo**: ينقل طلباً أو أمراً موجهاً (Dice que comas algo)\n- **pregunta si**: يسأل عما إذا كان... (Pregunta si vas a ir)\n- **pide que**: يرجو أو يطلب أن (+ Subjuntivo)\n- **el mensaje**: الرسالة المنقولة\n- **transmitir**: ينقل أو يبلغ الكلام",
                "examples": [
                    {"es": "Carlos dice que no puede venir porque tiene trabajo.", "ar": "كارلوس يقول إنه لا يستطيع القدوم لأن لديه عملاً (خبر = puede)."},
                    {"es": "El profesor dice que estudiemos el capítulo cuatro.", "ar": "الأستاذ يقول لنا أن ندرس الفصل الرابع (أمر = estudiemos بالمنصوب)."},
                    {"es": "Mi madre pregunta si has comprado el pan.", "ar": "أمي تسأل عما إذا كنت قد اشتريت الخبز."}
                ]
            }
        ],
        "newVocabulary": ["dice que + indicativo", "dice que + subjuntivo", "pregunta si", "pide que", "transmitir", "mensaje"],
        "reviewVocabulary": ["decir", "preguntar"]
    }

    exs = [
        choice_ex(
            "ex-b1-ind-1", "word_choice",
            "اختر صيغة المنصوب لنقل أمر وطلب الطبيب للمريض",
            ["grammar"], 1,
            "عندما يقول الطبيب للمريض: «¡Descanse en cama!»، كيف ننقل هذا الأمر؟",
            "El médico dice que usted _____ en cama dos días.",
            "الطبيب يقول لك أن ... في السرير لمدة يومين.",
            [
                opt("a", "descanse", "صيغة المنصوب لنقل الأمر والتعليمات (الصواب)", True),
                opt("b", "descansa", "مضارع إخباري ينقل معلومة خبرية فقط وليس أمراً", False, "نقل الأمر والطلب يتطلب صيغة المنصوب Subjuntivo."),
                opt("c", "descansar", "مصدر", False, "مع وجود que والفاعل usted يجب تصريف الفعل بالمنصوب.")
            ],
            ["dice que + subjuntivo", "decir"],
            "عند نقل أمر أو نصيحة طبية نستخدم المنصوب: dice que descanse."
        ),
        fill_ex(
            "ex-b1-ind-2",
            "أكمل بأداة الربط لنقل السؤال المغلق: (pregunta _____)",
            ["grammar", "writing"], 1,
            "أكمل بأداة الربط الشرطية لنقل سؤال: ¿Tienes tiempo hoy? -> Pregunta _____ tienes tiempo hoy",
            "Marta pregunta _____ vas a venir a la fiesta esta noche.",
            "مارتا تسأل عما إذا كنت ستأتي إلى الحفلة الليلة.",
            ["pregunta si"],
            ["si"],
            "عند نقل سؤال نعم/لا نستخدم أداة الربط si (بدون نبرة): pregunta si vas a venir."
        ),
        choice_ex(
            "ex-b1-ind-3", "word_choice",
            "حدد الفرق عندما ينقل المتحدث معلومة خبرية واقعية",
            ["grammar"], 2,
            "عندما يقول الصديق: «Vivo en el centro»، كيف ننقل هذا الخبر؟",
            "Mi amigo dice que _____ en el centro de Madrid.",
            "صديقي يقول إنه ... في وسط مدريد.",
            [
                opt("a", "vive", "مضارع إخباري لنقل معلومة واقعية (الصواب)", True),
                opt("b", "viva", "منصوب لا مبرر له لأن الجملة الأصلية خبر وليست أمراً", False, "المنصوب يستخدم للأوامر والطلبات، وهنا الجملة خبرية."),
                opt("c", "viviendo", "اسم فاعل مستمر", False, "نحتاج فعلاً مصرفاً في الحاضر الإخباري.")
            ],
            ["dice que + indicativo", "decir"],
            "نقل الجمل الخبرية في الحاضر يبقى في صيغة الإخباري: dice que vive."
        ),
        order_ex(
            "ex-b1-ind-4",
            "رتّب الجملة لنقل طلب المدير بحضور الاجتماع فوراً",
            ["grammar", "writing"], 2,
            ["El", "jefe", "pide", "que", "vengas", "al", "despacho"],
            "El jefe pide que vengas al despacho",
            "الترتيب: الفاعل El jefe ثم الفعل pide que ثم المنصوب vengas ثم الوجهة al despacho.",
            ["pide que"]
        ),
        choice_ex(
            "ex-b1-ind-5", "listen_choose",
            "استمع للتسجيل وحدد هل المنقول خبر أم طلب بالمنصوب",
            ["listening", "grammar"], 2,
            "استمع لما ينقله المتحدث عن زميلته",
            "Laura dice que le envíes el archivo por correo ahora mismo.",
            "لاورا تقول لك أن ترسل لها الملف عبر البريد حالاً.",
            [
                opt("a", "dice que + subjuntivo", "نقل أمر وطلب بالمنصوب (الصواب)", True),
                opt("b", "dice que + indicativo", "نقل خبر مجرد", False, "الفعل envíes بالمنصوب يدل على نقل أمر أو طلب."),
                opt("c", "pregunta si", "سؤال", False, "الجملة طلب صريح وليس سؤالاً.")
            ],
            ["dice que + subjuntivo", "dice que + indicativo", "pregunta si"],
            "المتحدث قال: 'dice que le envíes' بصيغة المنصوب لنقل الطلب.",
            audioKey="pending/b1_laura_dice_envies.mp3",
            speechEs="Laura dice que le envíes el archivo por correo ahora mismo."
        ),
        speak_ex(
            "ex-b1-ind-6",
            "انطق جملتك لنقل رسالة زميلك باحترافية",
            ["speaking", "pronunciation"], 2,
            "انطق الجملة التالية لنقل طلب المدير لزميلك بوضوح:",
            "El director pide que le entregues el informe antes de las dos.",
            "المدير يطلب أن تسلمه التقرير قبل الساعة الثانية.",
            "pending/b1_director_pide_entregues.mp3",
            ["pide que", "transmitir"],
            "El director pide que le entregues el informe antes de las dos.",
            "انتبه لنطق صيغة المنصوب entregues كـ إنتريجيس بدون نطق حرف u."
        )
    ]
    return lesson_doc(doc, exs, level="B1")


def make_lesson_estilo_indirecto_pasado():
    slug = "b1-estilo-indirecto-pasado"
    doc = {
        "slug": slug,
        "unitSlug": "b1-u7-media",
        "levelCode": "B1",
        "titleAr": "الكلام المنقول في الماضي: توافق الأزمنة وتحولات Dijo que",
        "titleEs": "El estilo indirecto en pasado y la correlación temporal",
        "subtitleAr": "تحول المضارع إلى ماضٍ ناقص (Imperfecto) والمستقبل إلى مشروط (Condicional)",
        "order": 3,
        "estimatedMinutes": 18,
        "cefrLevel": "B1",
        "review": review_block(),
        "pedagogy": {
            "learningObjectivesAr": [
                "أن يطبق المتعلم قواعد توافق الأزمنة (Correlación de tiempos) عندما يكون فعل القول في الماضي (Dijo que, Aseguró que).",
                "أن يحول الحاضر إلى ماضٍ ناقص (Presente -> Imperfecto): «Tengo frío» -> Dijo que tenía frío.",
                "أن يحول المستقبل إلى مشروط بسيط (Futuro -> Condicional): «Llegaré tarde» -> Dijo que llegaría tarde.",
                "أن يحول الماضي البسيط إلى ماضٍ أسبق (Indefinido -> Pluscuamperfecto): «Compré el libro» -> Dijo que había comprado."
            ],
            "grammarPoints": [
                {
                    "titleAr": "جدول تحولات الأزمنة في الكلام المنقول في الماضي",
                    "explanationAr": "عندما يكون فعل القول في الماضي (**Dijo / Afirmó / Explicó que**):\n1. **المضارع الإخباري** يتحول إلى **ماضٍ ناقص** (Imperfecto):\n- «Estoy ocupado» ⇒ Dijo que **estaba** ocupado.\n2. **المستقبل البسيط** يتحول إلى **المشروط البسيط** (Condicional):\n- «Iré mañana» ⇒ Dijo que **iría** al día siguiente.\n3. **الماضي البسيط أو المركب** يتحول إلى **ماضٍ أسبق** (Pluscuamperfecto):\n- «Ya comí / He comido» ⇒ Dijo que ya **había comido**.\n4. **الأمر أو المنصوب الحاضر** يتحول إلى **منصوب ناقص** (Imperfecto de subjuntivo):\n- «¡Ven!» ⇒ Me dijo que **viniera / viniese**."
                }
            ],
            "commonMistakesAr": [
                "الإبقاء على المضارع بعد dijo que (الخطأ الشائع: *Dijo que tiene dinero*؛ الصواب: Dijo que tenía dinero).",
                "الإبقاء على المستقبل بعد فعل القول الماضي بدلاً من تحويله إلى Condicional (الصواب: dijo que vendría، والخطأ: *dijo que vendrá*)."
            ],
            "dialectNotes": [
                {
                    "region": "EG",
                    "noteAr": "في مصر بنقول: «هو قال إنه كان تعبان وهيجي تاني يوم». بالإسبانية: Dijo que estaba cansado y que vendría al día siguiente."
                }
            ],
            "culturalNoteAr": "الصحافة الإسبانية تستخدم أسلوب النقل في الماضي مع المشروط بكثرة لتغطية المؤتمرات والبيانات الدبلوماسية: 'El ministro aseguró que viajaría a Bruselas'."
        },
        "contentBlocks": [
            {
                "id": f"cb-{slug}-intro",
                "type": "explanation",
                "titleAr": "جدول توافق الأزمنة في الماضي",
                "bodyAr": "التحولات الأساسية:\n- **dijo que + Imperfecto**: (أصله مضارع: estaba / tenía)\n- **dijo que + Condicional**: (أصله مستقبل: viajaría / vendría)\n- **dijo que + Pluscuamperfecto**: (أصله ماضٍ: había visto / había dicho)\n- **asegurar**: يؤكد ويجزم في تصريحه\n- **afirmar**: يصرح أو يقر في كلامه\n- **la correlación temporal**: توافق وتناغم الأزمنة النحوية",
                "examples": [
                    {"es": "El testigo afirmó que había visto al sospechoso huir.", "ar": "صرح الشاهد بأنه كان قد رأى المشتبه به يفر (ماضٍ أسبق)."},
                    {"es": "El presidente aseguró que no subiría los impuestos.", "ar": "أكد الرئيس أنه لن يرفع الضرائب (مشروط: subiría)."},
                    {"es": "María me dijo que estaba muy contenta con su nuevo trabajo.", "ar": "ماريا أخبرتني أنها كانت سعيدة جداً بعملها الجديد (ماضٍ ناقص: estaba)."}
                ]
            }
        ],
        "newVocabulary": ["dijo que + imperfecto", "dijo que + condicional", "dijo que + pluscuamperfecto", "asegurar", "afirmar", "correlación temporal"],
        "reviewVocabulary": ["tiempo", "pasado"]
    }

    exs = [
        choice_ex(
            "ex-b1-inp-1", "word_choice",
            "اختر صيغة الماضي الناقص المناسبة لنقل المضارع بعد dijo que",
            ["grammar"], 1,
            "عندما قال أحمد أمس: «Tengo mucho trabajo»، كيف ننقل كلامه في الماضي؟",
            "Ahmed me dijo ayer que _____ mucho trabajo.",
            "أحمد أخبرني بالأمس أنه ... الكثير من العمل.",
            [
                opt("a", "tenía", "ماضٍ ناقص تحول عن المضارع tengo (الصواب)", True),
                opt("b", "tiene", "مضارع لا يصح بعد فعل القول الماضي dijo", False, "بعد dijo que يتحول المضارع إلى ماضٍ ناقص tenía."),
                opt("c", "tendrá", "مستقبل غير مناسب لمعنى الجملة الأصلية", False, "الجملة الأصلية كانت في الحاضر tengo.")
            ],
            ["dijo que + imperfecto", "pasado"],
            "المضارع tengo يتحول بعد فعل القول الماضي dijo que إلى ماضٍ ناقص: tenía."
        ),
        fill_ex(
            "ex-b1-inp-2",
            "حول المستقبل viajaré إلى المشروط بعد dijo que: (viajaría)",
            ["grammar", "writing"], 1,
            "اكتب صيغة المشروط المناسبة لتحويل «Viajaré a Roma» بعد dijo que: (viajaría)",
            "Carlos dijo que _____ a Roma la semana siguiente.",
            "كارلوس قال إنه سيسافر إلى روما في الأسبوع التالي.",
            ["dijo que + condicional"],
            ["viajaría", "viajaria"],
            "المستقبل البسيط viajaré يتحول بعد فعل القول الماضي إلى مشروط بسيط: viajaría."
        ),
        choice_ex(
            "ex-b1-inp-3", "word_choice",
            "حدد الزمن المناسب لنقل حدث ماضٍ منتهٍ بعد فعل القول الماضي",
            ["grammar"], 2,
            "عندما قالت لورا: «He terminado el examen»، كيف ننقل كلامها بعد dijo que؟",
            "Laura aseguró que ya _____ el examen.",
            "لاورا أكدت أنها كانت قد أنهت الامتحان بالفعل.",
            [
                opt("a", "había terminado", "ماضٍ أسبق Pluscuamperfecto (الصواب)", True),
                opt("b", "ha terminado", "ماضٍ مركب لا يصح بعد فعل القول الماضي aseguró", False, "الماضي المركب يتحول بعد الماضي إلى ماضٍ أسبق había terminado."),
                opt("c", "terminaría", "مشروط ينقل المستقبل وليس الماضي", False, "الجملة الأصلية كانت ماضياً he terminado.")
            ],
            ["dijo que + pluscuamperfecto", "asegurar"],
            "الماضي he terminado يتحول بعد فعل القول الماضي إلى ماضٍ أسبق: había terminado."
        ),
        order_ex(
            "ex-b1-inp-4",
            "رتّب الجملة لنقل تصريح المدير المستقبلي في الماضي",
            ["grammar", "writing"], 2,
            ["El", "jefe", "afirmó", "que", "firmaría", "el", "contrato"],
            "El jefe afirmó que firmaría el contrato",
            "الترتيب: الفاعل El jefe ثم الفعل afirmó que ثم المشروط firmaría ثم المفعول el contrato.",
            ["afirmar", "dijo que + condicional"]
        ),
        choice_ex(
            "ex-b1-inp-5", "listen_choose",
            "استمع للتسجيل وحدد التحول الزمني المستخدم في النقل",
            ["listening", "grammar"], 2,
            "استمع لما ينقله المذيع عن المتحدث الرسمي",
            "El portavoz aseguró que el gobierno tomaría medidas urgentes.",
            "المتحدث الرسمي أكد أن الحكومة ستتخذ تدابير عاجلة.",
            [
                opt("a", "dijo que + condicional", "نقل المستقبل كصيغة مشروط (الصواب)", True),
                opt("b", "dijo que + imperfecto", "ماضٍ ناقص", False, "الفعل tomaría بصيغة المشروط Condicional."),
                opt("c", "dijo que + pluscuamperfecto", "ماضٍ أسبق", False, "المتحدث نقل وعداً مستقبلياً بالمشروط tomaría.")
            ],
            ["dijo que + condicional", "asegurar", "dijo que + imperfecto"],
            "المذيع قال: 'aseguró que el gobierno tomaría medidas' بصيغة المشروط.",
            audioKey="pending/b1_portavoz_aseguro_tomaria.mp3",
            speechEs="El portavoz aseguró que el gobierno tomaría medidas urgentes."
        ),
        speak_ex(
            "ex-b1-inp-6",
            "انطق جملتك في نقل كلام صديقك بدقة في توافق الأزمنة",
            ["speaking", "pronunciation"], 2,
            "انطق الجملة التالية بأسلوب سردي صحيح ومتقن لتوافق الأزمنة:",
            "Me dijo que no podía venir porque estaba enfermo y tenía fiebre.",
            "أخبرني أنه لم يكن يستطيع القدوم لأنه كان مريضاً ولديه حمى.",
            "pending/b1_dijo_no_podia_enfermo.mp3",
            ["dijo que + imperfecto", "pasado"],
            "Me dijo que no podía venir porque estaba enfermo y tenía fiebre.",
            "انتبه لنطق النبرة على حرف i في podía و tenía بوضوح وثبات."
        )
    ]
    return lesson_doc(doc, exs, level="B1")


def make_lesson_cronica_periodistica():
    slug = "b1-cronica-periodistica"
    doc = {
        "slug": slug,
        "unitSlug": "b1-u7-media",
        "levelCode": "B1",
        "titleAr": "صياغة التقرير والخبر الصحفي: السرد الإخباري الموضوعي ونقل الشهادات",
        "titleEs": "Redacción de la crónica periodística y el reportaje breve",
        "subtitleAr": "الإجابة عن الأسئلة الصحفية الستة (6W)، دمج الشهادات، وبناء الهرم المقلوب",
        "order": 4,
        "estimatedMinutes": 18,
        "cefrLevel": "B1",
        "review": review_block(),
        "pedagogy": {
            "learningObjectivesAr": [
                "أن يكتب المتعلم خبراً أو تقريراً صحفياً موجزاً يجيب عن الأسئلة الصحفية الكبرى: ¿Quién? ¿Qué? ¿Cuándo? ¿Dónde? ¿Por qué? ¿Cómo?.",
                "أن يطبق بنية الهرم المقلوب (la pirámide invertida) بوضع الأهم في المقدمة ثم التفاصيل.",
                "أن يدمج شهادات الشهود بأسلوبي الكلام المباشر وغير المباشر بسلاسة وموضوعية."
            ],
            "grammarPoints": [
                {
                    "titleAr": "تراكيب السرد في التقرير والخبر الصحفي",
                    "explanationAr": "1. **افتتاح الخبر (La entradilla)**:\n- الجمع بين الماضي البسيط للإنجاز والماضي الناقص للظروف المحيطة:\n  * Ayer por la tarde se produjo un incendio mientras los trabajadores realizaban tareas de mantenimiento.\n2. **دمج شهادات العيان**:\n- **Según declaraciones de testigos presenciales**: وفقاً لإفادات شهود العيان.\n- «Todo ocurrió en cuestión de segundos», declaró una vecina.\n3. **الربط الإخباري**:\n- **Asimismo / Por su parte / Al cierre de esta edición**: روابط صحفية متقدمة لتنظيم تدفق المعلومات."
                }
            ],
            "commonMistakesAr": [
                "البدء بمقدمات إنشائية طويلة؛ الخبر الصحفي يتطلب الدخول المباشر في الحدث عبر الإجابة عن الأسئلة الجوهرية في السطرين الأولين.",
                "خلط الرأي الشخصي بالخبر؛ التقرير الصحفي يتطلب نبرة حيادية موضوعية ونسبة الآراء لأصحابها."
            ],
            "dialectNotes": [
                {
                    "region": "EG",
                    "noteAr": "في مصر بنقول: «شهود العيان قالوا إن الحادثة حصلت فجأة والمطافي جت في دقايق». بالإسبانية: Los testigos afirmaron que todo ocurrió de repente y los bomberos llegaron en minutos."
                }
            ],
            "culturalNoteAr": "الـ 'crónica' في الصحافة الإسبانية والأمريكية اللاتينية نوع صحفي وأدبي رفيع يجمع بين دقة نقل الوقائع والجمالية السردية المشوقة."
        },
        "contentBlocks": [
            {
                "id": f"cb-{slug}-intro",
                "type": "explanation",
                "titleAr": "مصطلحات التقرير الصحفي",
                "bodyAr": "المفردات التحريرية:\n- **la crónica**: التقرير الإخباري أو السرد الصحفي التفصيلي\n- **el testigo presencial**: شاهد العيان الذي عاين الحدث بنفسه\n- **el acontecimiento**: الحدث أو التطور الإخباري الهام\n- **la declaración**: التصريح أو الإفادة الرسمية\n- **la pirámide invertida**: تقنية الهرم المقلوب في التحرير الصحفي\n- **la cobertura mediática**: التغطية الإعلامية للحدث",
                "examples": [
                    {"es": "El acontecimiento contó con una amplia cobertura mediática internacional.", "ar": "حظي الحدث بتغطية إعلامية دولية واسعة النطاق."},
                    {"es": "Varios testigos presenciales prestaron declaración ante las autoridades.", "ar": "أدلى العديد من شهود العيان بإفاداتهم أمام السلطات."},
                    {"es": "La crónica relata paso a paso cómo se desarrolló la jornada histórica.", "ar": "يسرد التقرير الصحفي خطوة بخطوة كيف مضى هذا اليوم التاريخي."}
                ]
            }
        ],
        "newVocabulary": ["crónica", "testigo presencial", "acontecimiento", "declaración", "pirámide invertida", "cobertura mediática"],
        "reviewVocabulary": ["información", "suceso"]
    }

    exs = [
        choice_ex(
            "ex-b1-cro-1", "word_choice",
            "اختر المفردة التي تعني شاهد العيان الذي حضر الواقعة بنفسه",
            ["vocabulary"], 1,
            "ماذا نسمي الشخص الذي رأى الحادثة بعينيه وحضرها في الميدان؟",
            "Según el relato de un _____, la policía llegó en menos de cinco minutos.",
            "وفقاً لرواية ...، وصلت الشرطة في أقل من خمس دقائق.",
            [
                opt("a", "testigo presencial", "شاهد عيان حضوري (الصواب)", True),
                opt("b", "acontecimiento", "الحدث نفسه", False, "الرواية تصدر عن شاهد عيان (testigo presencial)."),
                opt("c", "pirámide invertida", "الهرم المقلوب", False, "الهرم المقلوب تقنية تحريرية وليس شخصاً.")
            ],
            ["testigo presencial", "acontecimiento", "pirámide invertida"],
            "el testigo presencial هو شاهد العيان الذي شهد الواقعة شخصياً."
        ),
        fill_ex(
            "ex-b1-cro-2",
            "أكمل بالكلمة التي تعني التقرير أو السرد الإخباري المفصل (la _____)",
            ["vocabulary", "writing"], 1,
            "اكتب الكلمة الإسبانية المؤنثة التي تعني 'السرد الإخباري / التقرير الصحفي' (la _____)",
            "El corresponsal redactó una emotiva _____ sobre la reconstrucción del pueblo.",
            "حرر المراسل تقريراً صحفياً مؤثراً عن إعادة إعمار القرية.",
            ["crónica"],
            ["crónica", "cronica"],
            "كلمة crónica تعني التقرير الصحفي أو السرد الإخباري المتسلسل."
        ),
        choice_ex(
            "ex-b1-cro-3", "word_choice",
            "حدد التقنية الصحفية لكتابة الخبر من الأهم إلى الأقل أهمية",
            ["vocabulary"], 2,
            "ما اسم التقنية الكلاسيكية التي تبدأ بأهم المعلومات في صدر الخبر؟",
            "En el periodismo moderno se estructura la noticia siguiendo la _____.",
            "في الصحافة الحديثة تُبنى الأخبار باتباع أسلوب ...",
            [
                opt("a", "pirámide invertida", "الهرم المقلوب (الصواب)", True),
                opt("b", "declaración", "تصريح رسمي", False, "البنية التحريرية تسمى الهرم المقلوب pirámide invertida."),
                opt("c", "cobertura mediática", "تغطية إعلامية", False, "التقنية التحريرية هي الهرم المقلوب.")
            ],
            ["pirámide invertida", "declaración", "cobertura mediática"],
            "la pirámide invertida هي تقنية الهرم المقلوب التي تضع جوهر الخبر في البداية."
        ),
        order_ex(
            "ex-b1-cro-4",
            "رتّب الجملة لوصف التغطية الإعلامية لحدث تاريخي كبير",
            ["grammar", "writing"], 2,
            ["El", "acontecimiento", "tuvo", "una", "gran", "cobertura", "mediática"],
            "El acontecimiento tuvo una gran cobertura mediática",
            "الترتيب: الفاعل El acontecimiento ثم الفعل tuvo ثم المفعول una gran cobertura mediática.",
            ["acontecimiento", "cobertura mediática"]
        ),
        choice_ex(
            "ex-b1-cro-5", "listen_choose",
            "استمع للتسجيل وحدد التصريحات التي أدلى بها المسؤول",
            ["listening", "vocabulary"], 2,
            "استمع للتقرير الإخباري وحدد ما يشير إليه المذيع",
            "En su declaración ante la prensa, el alcalde prometió ayudas urgentes.",
            "في تصريحه أمام الصحافة، وعد العمدة بتقديم مساعدات عاجلة.",
            [
                opt("a", "declaración", "التصريح والإفادة الرسمية (الصواب)", True),
                opt("b", "crónica", "التقرير ككل", False, "المذيع ركز على تصريح العمدة المحدد (su declaración)."),
                opt("c", "pirámide invertida", "هرم مقلوب", False, "المتحدث نقل مضمون التصريح الرسمي.")
            ],
            ["declaración", "crónica", "pirámide invertida"],
            "المذيع قال: 'En su declaración ante la prensa'.",
            audioKey="pending/b1_declaracion_alcalde_prensa.mp3",
            speechEs="En su declaración ante la prensa, el alcalde prometió ayudas urgentes."
        ),
        speak_ex(
            "ex-b1-cro-6",
            "انطق جملتك التحريرية لنقل أقوال شهود العيان بموضوعية",
            ["speaking", "pronunciation"], 2,
            "انطق الجملة التالية بأسلوب مراسل إخباري محترف:",
            "Según un testigo presencial, el acontecimiento tuvo una enorme repercusión.",
            "وفقاً لأحد شهود العيان، كان للحدث صدى هائل وأثر بالغ.",
            "pending/b1_testigo_presencial_acontecimiento.mp3",
            ["testigo presencial", "acontecimiento"],
            "Según un testigo presencial, el acontecimiento tuvo una enorme repercusión.",
            "انتبه لنطق حرف c في presencial و repercusión كـ ثاء واضحة."
        )
    ]
    return lesson_doc(doc, exs, level="B1")

# ==============================================================================
# UNIT 8: b1-u8-health-lifestyle (الصحة ونمط الحياة والتوصيات بالمنصوب)
# ==============================================================================

def make_lesson_habitos_saludables():
    slug = "b1-habitos-saludables"
    doc = {
        "slug": slug,
        "unitSlug": "b1-u8-health-lifestyle",
        "levelCode": "B1",
        "titleAr": "العادات الصحية والحمية المتوسطية: التغذية السليمة والنشاط البدني",
        "titleEs": "Hábitos saludables, la dieta mediterránea y el ejercicio físico",
        "subtitleAr": "فوائد زيت الزيتون، الغذاء المتوازن، والوقاية من الأمراض المزمنة",
        "order": 1,
        "estimatedMinutes": 18,
        "cefrLevel": "B1",
        "review": review_block(),
        "pedagogy": {
            "learningObjectivesAr": [
                "أن يصف المتعلم عاداته الغذائية والبدنية بدقة ومصطلحات متقدمة باللغة الإسبانية.",
                "أن يتعرف على مكونات الحمية المتوسطية (la dieta mediterránea) وفوائدها الصحية المعترف بها عالمياً.",
                "أن يناقش عوامل الوقاية من الأمراض ونمط العيش الصحي المتوازن: vida sedentaria مقابل vida activa."
            ],
            "grammarPoints": [
                {
                    "titleAr": "تراكيب التعبير عن العادات والتأثير الصحي",
                    "explanationAr": "1. **التعبير عن الإيجابيات الصحية**:\n- **Contribuir a + infinitivo / sustantivo**: El consumo de aceite de oliva contribuye a prevenir enfermedades cardiovasculares.\n- **Ser rico en**: Las legumbres son ricas en fibra y proteínas vegetales.\n2. **التحذير من العادات الضارة**:\n- **El sedentarismo**: El estilo de vida sedentario aumenta el riesgo de problemas de salud.\n- **Evitar los ultraprocesados**: Es fundamental reducir el consumo de alimentos ultraprocesados."
                }
            ],
            "commonMistakesAr": [
                "استخدام كلمة *dieta* بمعنى الرجيم القاسي فقط؛ في الإسبانية la dieta تعني النظام الغذائي الطبيعي للإنسان (como la dieta mediterránea).",
                "قول *vida sentada* بدلاً من المصطلح الطبي والاجتماعي المعتمد la vida sedentaria (نمط الحياة الخامل)."
            ],
            "dialectNotes": [
                {
                    "region": "EG",
                    "noteAr": "في مصر بنقول: «لازم نغير أسلوب أكلنا ونلعب رياضة عشان نقلل الكوليسترول ونبعد عن الكسل». بالإسبانية: Hay que cambiar la alimentación y hacer ejercicio para combatir el sedentarismo."
                }
            ],
            "culturalNoteAr": "الحمية المتوسطية الإسبانية (La dieta mediterránea) مصنفة من قِبل اليونسكو كتراث ثقافي غير مادي للإنسانية لما تحمله من توازن غذائي وقيم اجتماعية تشاركية."
        },
        "contentBlocks": [
            {
                "id": f"cb-{slug}-intro",
                "type": "explanation",
                "titleAr": "مصطلحات التغذية ونمط العيش الصحي",
                "bodyAr": "المفردات الصحية:\n- **la dieta mediterránea**: حمية البحر الأبيض المتوسط الغذائية المتوازنة\n- **el sedentarismo**: الخمول البدني وقلة الحركة (نمط العيش الجالس)\n- **los nutrientes**: العناصر الغذائية المفيدة\n- **el bienestar**: العافية والراحة الجسدية والنفسية\n- **prevenir**: يقي ويحمي من الأمراض\n- **la fibra**: الألياف الغذائية الطبيعية",
                "examples": [
                    {"es": "La dieta mediterránea es rica en aceite de oliva, verduras y pescado.", "ar": "الحمية المتوسطية غنية بزيت الزيتون والخضراوات والسمك."},
                    {"es": "Caminar treinta minutos al día ayuda a combatir el sedentarismo.", "ar": "المشي ثلاثين دقيقة يومياً يساعد في مكافحة الخمول البدني."},
                    {"es": "Una alimentación variada aporta todos los nutrientes necesarios.", "ar": "التغذية المتنوعة توفر جميع العناصر الغذائية الضرورية."}
                ]
            }
        ],
        "newVocabulary": ["dieta mediterránea", "sedentarismo", "nutrientes", "bienestar", "prevenir", "fibra"],
        "reviewVocabulary": ["salud", "comida"]
    }

    exs = [
        choice_ex(
            "ex-b1-hab-1", "word_choice",
            "اختر المصطلح الطبي الذي يعني الخمول وقلة الحركة البدنية",
            ["vocabulary"], 1,
            "ما هي الكلمة التي تعني 'نمط الحياة الخامل والجلوس الطويل دون حركة'؟",
            "El _____ es uno de los mayores factores de riesgo para el corazón.",
            "... هو أحد أكبر عوامل الخطر على صحة القلب.",
            [
                opt("a", "sedentarismo", "الخمول البدني وقلة الحركة (الصواب)", True),
                opt("b", "bienestar", "العافية والراحة", False, "المعنى يتعلق بالخطر الصحي (الخمول وليس العافية)."),
                opt("c", "nutrientes", "عناصر غذائية", False, "الخمول هو sedentarismo.")
            ],
            ["sedentarismo", "bienestar", "nutrientes"],
            "el sedentarismo يعني الخمول البدني وقلة الحركة والنشاط الرياضي."
        ),
        fill_ex(
            "ex-b1-hab-2",
            "أكمل بالفعل الدال على الوقاية والحماية في المصدر (prevenir)",
            ["grammar", "writing"], 1,
            "اكتب الفعل الذي يعني 'يقي من الأمراض ويحمي الصحة' في صيغة المصدر (prevenir)",
            "Una buena alimentación es la mejor manera de _____ dolencias crónicas.",
            "التغذية السليمة هي أفضل وسيلة للوقاية من الأمراض المزمنة.",
            ["prevenir"],
            ["prevenir"],
            "فعل prevenir يعني يقي أو يتجنب حدوث الأمراض."
        ),
        choice_ex(
            "ex-b1-hab-3", "word_choice",
            "حدد النمط الغذائي التراثي المشهور بزيت الزيتون والخضار في إسبانيا",
            ["vocabulary"], 2,
            "ماذا تسمى الحمية الغذائية المتوازنة لمنطقة البحر الأبيض المتوسط؟",
            "Los médicos recomiendan seguir las pautas de la _____ tradicional.",
            "يوصي الأطباء باتباع إرشادات ... التقليدية.",
            [
                opt("a", "dieta mediterránea", "حمية البحر المتوسط (الصواب)", True),
                opt("b", "sedentarismo", "الخمول", False, "الأطباء يوصون بالحمية الغذائية dieta mediterránea."),
                opt("c", "fibra", "الألياف فقط", False, "النمط الغذائي المتكامل يسمى la dieta mediterránea.")
            ],
            ["dieta mediterránea", "sedentarismo", "fibra"],
            "la dieta mediterránea هي حمية البحر المتوسط الغذائية الشهيرة بتوازنها الصحي."
        ),
        order_ex(
            "ex-b1-hab-4",
            "رتّب الجملة لوصف دور الرياضة في تعزيز العافية والراحة",
            ["grammar", "writing"], 2,
            ["El", "ejercicio", "aporta", "salud", "y", "bienestar", "general"],
            "El ejercicio aporta salud y bienestar general",
            "الترتيب: الفاعل El ejercicio ثم الفعل aporta ثم المفعول salud y bienestar general.",
            ["bienestar", "salud"]
        ),
        choice_ex(
            "ex-b1-hab-5", "listen_choose",
            "استمع للتسجيل وحدد المكون الغذائي الغني في الخضار والحبوب",
            ["listening", "vocabulary"], 2,
            "استمع لأخصائي التغذية وحدد ما يوصي به للهضم الصحي",
            "Las legumbres y las frutas frescas aportan una gran cantidad de fibra.",
            "البقوليات والفواكه الطازجة توفر كمية كبيرة من الألياف.",
            [
                opt("a", "fibra", "الألياف الغذائية (الصواب)", True),
                opt("b", "sedentarismo", "خمول", False, "الأخصائي ركز على الفائدة الغذائية (la fibra)."),
                opt("c", "dieta mediterránea", "حمية كاملة", False, "المتحدث حدد مادة الألياف الغذائية تحديداً.")
            ],
            ["fibra", "sedentarismo", "dieta mediterránea"],
            "المتحدث قال: 'aportan una gran cantidad de fibra'.",
            audioKey="pending/b1_frutas_aportan_fibra.mp3",
            speechEs="Las legumbres y las frutas frescas aportan una gran cantidad de fibra."
        ),
        speak_ex(
            "ex-b1-hab-6",
            "انطق نصيحتك لاتباع نمط حياة صحي ومكافحة الخمول",
            ["speaking", "pronunciation"], 2,
            "انطق الجملة التالية بأسلوب مشجع ومقنع للأصدقاء:",
            "Para mejorar nuestro bienestar, debemos comer sano y evitar el sedentarismo.",
            "لتحسين عافيتنا، يجب أن نأكل طعاماً صحياً ونتجنب الخمول البدني.",
            "pending/b1_mejorar_bienestar_sedentarismo.mp3",
            ["bienestar", "sedentarismo"],
            "Para mejorar nuestro bienestar, debemos comer sano y evitar el sedentarismo.",
            "انتبه لنطق مقطع tar في bienestar ونطق se في sedentarismo بنقاء صوتي."
        )
    ]
    return lesson_doc(doc, exs, level="B1")


def make_lesson_subjuntivo_recomendaciones():
    slug = "b1-subjuntivo-recomendaciones"
    doc = {
        "slug": slug,
        "unitSlug": "b1-u8-health-lifestyle",
        "levelCode": "B1",
        "titleAr": "المنصوب في التوجيهات الطبية: Es aconsejable que و Te recomiendo que",
        "titleEs": "El subjuntivo en consejos de salud: Es aconsejable que y te sugiero que",
        "subtitleAr": "الصيغ غير الشخصية (Es necesario que) وتوصيات الأطباء الموجهة للمريض",
        "order": 2,
        "estimatedMinutes": 18,
        "cefrLevel": "B1",
        "review": review_block(),
        "pedagogy": {
            "learningObjectivesAr": [
                "أن يطبق المتعلم صيغة المنصوب (Subjuntivo) بدقة مع التراكيب التقييمية غير الشخصية (Es importante que, Es conveniente que).",
                "أن يقدم نصائح وتوصيات طبية مخصصة للأفراد: Te aconsejo que tomes, Le sugiero que camine.",
                "أن يفرق بين القاعدة العامة بالمصدر (Es bueno hacer deporte) والتوجيه الشخصي بالمنصوب (Es bueno que hagas deporte)."
            ],
            "grammarPoints": [
                {
                    "titleAr": "قاعدة المنصوب مع التراكيب غير الشخصية وأفعال التوصية",
                    "explanationAr": "1. **العبارات غير الشخصية (Es + صفة + que + Subjuntivo)**:\n- **Es aconsejable que** reduzcas el consumo de sal (من المستحسن أن تقلل استهلاك الملح).\n- **Es fundamental que** bebas al menos dos litros de agua al día (من الجوهري أن تشرب لترين ماء).\n- **Es conveniente que** duermas ocho horas diarias (من المفيد والملائم أن تنام 8 ساعات).\n2. **ملاحظة محورية**: إذا لم نحدد الشخص بعد التعبير غير الشخصي (بدون que)، نستخدم **المصدر** فقط:\n- Es importante **hacer** ejercicio (عام).\n- Es importante que **hagas** ejercicio (موجه للمخاطب).\n3. **أفعال التوصية المباشرة (Recomendar / Sugerir / Aconsejar que + Subjuntivo)**:\n- Te recomiendo que **vayas** al médico especialista."
                }
            ],
            "commonMistakesAr": [
                "استخدام المضارع الإخباري بعد es importante que (الخطأ الشائع: *Es importante que comes sano*؛ الصواب: Es importante que comas sano بالمنصوب).",
                "وضع que مع المصدر (الخطأ: *Es necesario que descansar*؛ الصواب: Es necesario descansar، أو Es necesario que descanses)."
            ],
            "dialectNotes": [
                {
                    "region": "EG",
                    "noteAr": "في مصر الدكتور بيقولك: «مهم أوي تقلل الملح وتشرب ميه كتير، وبنصحك ترتاح أسبوع». بالإسبانية: Es fundamental que reduzcas la sal y te aconsejo que descanses."
                }
            ],
            "culturalNoteAr": "الأطباء الإسبان يفضلون استخدام العبارات التقييمية الرقيقة مثل 'Es conveniente que...' بدلاً من لغة الأوامر الصارمة لإشراك المريض في تحمل مسؤولية علاجه."
        },
        "contentBlocks": [
            {
                "id": f"cb-{slug}-intro",
                "type": "explanation",
                "titleAr": "تراكيب التوصيات الطبية والصحية",
                "bodyAr": "أهم التراكيب:\n- **es aconsejable que**: من المستحسن أن (+ منصُوب)\n- **es fundamental que**: من الضروري والجوهري أن (+ منصُوب)\n- **es conveniente que**: من الملائم والمفيد أن (+ منصُوب)\n- **te sugiero que**: أقترح عليك أن (+ منصُوب)\n- **reducir**: يقلل ويخفض الكمية\n- **el tratamiento**: العلاج الطبي والخطة العلاجية",
                "examples": [
                    {"es": "Es aconsejable que evites las bebidas azucaradas durante el tratamiento.", "ar": "من المستحسن أن تتجنب المشروبات السكرية أثناء العلاج (المنصوب: evites)."},
                    {"es": "Es fundamental que sigas las instrucciones del médico al pie de la letra.", "ar": "من الجوهري أن تتبع تعليمات الطبيب بدقة تامة (المنصوب: sigas)."},
                    {"es": "Te sugiero que hagas pausas activas si trabajas muchas horas sentado.", "ar": "أقترح عليك أن تأخذ فترات راحة حركية إذا كنت تعمل ساعات طويلة جالساً."}
                ]
            }
        ],
        "newVocabulary": ["es aconsejable que", "es fundamental que", "es conveniente que", "te sugiero que", "reducir", "tratamiento"],
        "reviewVocabulary": ["médico", "salud"]
    }

    exs = [
        choice_ex(
            "ex-b1-sre-1", "word_choice",
            "اختر صيغة المنصوب المناسبة بعد التركيب الطبي es aconsejable que",
            ["grammar"], 1,
            "أي تصريف لفعل reducir نستخدم بعد العبارة الطبية Es aconsejable que؟",
            "Para controlar la tensión, es aconsejable que usted _____ la sal.",
            "لضبط ضغط الدم، من المستحسن أن ... استهلاك الملح.",
            [
                opt("a", "reduzca", "صيغة المنصوب مع usted (الصواب بعد es aconsejable que)", True),
                opt("b", "reduce", "مضارع إخباري لا يصح بعد التراكيب التقييمية", False, "العبارة es aconsejable que تتطلب صيغة المنصوب Subjuntivo."),
                opt("c", "reducir", "مصدر لا يناسب وجود que usted", False, "مع وجود que والفاعل usted يجب تصريف الفعل بالمنصوب.")
            ],
            ["es aconsejable que", "reducir"],
            "بعد es aconsejable que + فاعل نستخدم المنصوب: es aconsejable que usted reduzca."
        ),
        fill_ex(
            "ex-b1-sre-2",
            "صرف فعل tomar بالمنصوب المخاطب بعد es fundamental que: (tomes)",
            ["grammar", "writing"], 1,
            "اكتب صيغة المنصوب من الفعل tomar مع المخاطب tú بعد es fundamental que: (tomes)",
            "Es fundamental que _____ la medicación a las horas prescritas.",
            "من الجوهري أن تتناول الدواء في المواعيد المحددة.",
            ["es fundamental que"],
            ["tomes"],
            "بعد es fundamental que يأتي الفعل مصرفاً بالمنصوب: tomes."
        ),
        choice_ex(
            "ex-b1-sre-3", "word_choice",
            "حدد الفرق النحوي بين صيغة العموم بالمصدر والتوجيه الشخصي بالمنصوب",
            ["grammar"], 2,
            "عندما لا يوجد شخص محدد موجه له الكلام (بدون que)، أي صيغة نستخدم؟",
            "Es muy conveniente _____ deporte tres veces por semana para estar sano.",
            "من المفيد جداً ... الرياضة ثلاث مرات أسبوعياً للحفاظ على الصحة.",
            [
                opt("a", "hacer", "صيغة المصدر للتعبير عن القاعدة العامة بدون que (الصواب)", True),
                opt("b", "hagas", "منصوب يحتاج إلى وجود que قبله", False, "بدون que لا نستخدم المنصوب بل نستخدم المصدر العام hacer."),
                opt("c", "hace", "مضارع إخباري لا يصح بعد es conveniente", False, "التعبير العام بدون que يأخذ المصدر دائماً.")
            ],
            ["es conveniente que"],
            "عند التعبير العام دون تحديد فاعل (غياب que) نستخدم المصدر مباشرة: Es conveniente hacer."
        ),
        order_ex(
            "ex-b1-sre-4",
            "رتّب الجملة لتقديم نصيحة علاجية للمريض باتباع الخطة",
            ["grammar", "writing"], 2,
            ["Te", "sugiero", "que", "sigas", "el", "tratamiento", "médico"],
            "Te sugiero que sigas el tratamiento médico",
            "الترتيب: عبارة الاقتراح Te sugiero que ثم المنصوب sigas ثم المفعول el tratamiento médico.",
            ["te sugiero que", "tratamiento"]
        ),
        choice_ex(
            "ex-b1-sre-5", "listen_choose",
            "استمع للتسجيل وحدد التوصية الطبية التي يقدمها الطبيب",
            ["listening", "grammar"], 2,
            "استمع لنصيحة الطبيب للمريض في العيادة",
            "Es fundamental que descanse adecuadamente para que el tratamiento sea efectivo.",
            "من الجوهري أن ترتاح كما ينبغي لكي يكون العلاج فعالاً.",
            [
                opt("a", "es fundamental que", "توصية جوهرية بالمنصوب (الصواب)", True),
                opt("b", "es aconsejable que", "توصية عادية فقط", False, "الطبيب شدد العبارة بـ es fundamental que."),
                opt("c", "te sugiero que", "اقتراح ودي", False, "الطبيب استخدم التعبير غير الشخصي الصارم es fundamental que.")
            ],
            ["es fundamental que", "tratamiento", "es aconsejable que", "te sugiero que"],
            "الطبيب قال: 'Es fundamental que descanse adecuadamente'.",
            audioKey="pending/b1_fundamental_descanse_tratamiento.mp3",
            speechEs="Es fundamental que descanse adecuadamente para que el tratamiento sea efectivo."
        ),
        speak_ex(
            "ex-b1-sre-6",
            "انطق نصيحتك الطبية لزميلك بأسلوب المنصوب الودود",
            ["speaking", "pronunciation"], 2,
            "انطق الجملة التالية لتقديم نصيحة صحية متكاملة لزميلك:",
            "Te sugiero que descanses más y reduzcas el nivel de estrés diario.",
            "أقترح عليك أن ترتاح أكثر وأن تقلل من مستوى التوتر اليومي.",
            "pending/b1_sugiero_descanses_reduzcas.mp3",
            ["te sugiero que", "reducir"],
            "Te sugiero que descanses más y reduzcas el nivel de estrés diario.",
            "انتبه لنطق صيغتي المنصوب descanses و reduzcas بنبرة متوازنة وسلسة."
        )
    ]
    return lesson_doc(doc, exs, level="B1")


def make_lesson_bienestar_emocional():
    slug = "b1-bienestar-emocional"
    doc = {
        "slug": slug,
        "unitSlug": "b1-u8-health-lifestyle",
        "levelCode": "B1",
        "titleAr": "الصحة النفسية والعاطفية: إدارة التوتر والقلق وفصل الذهن عن العمل",
        "titleEs": "El bienestar emocional, la gestión del estrés y la desconexión digital",
        "subtitleAr": "مكافحة الإرهاق (el agotamiento)، الاسترخاء، والحق في فصل العمل عن الحياة",
        "order": 3,
        "estimatedMinutes": 18,
        "cefrLevel": "B1",
        "review": review_block(),
        "pedagogy": {
            "learningObjectivesAr": [
                "أن يعبر المتعلم عن حالته النفسية والعاطفية ومصادر الضغط اليومي باللغة الإسبانية.",
                "أن يصف مشاعر القلق والإرهاق: tener ansiedad, sufrir agotamiento, sentirse desbordado.",
                "أن يناقش استراتيجيات التوازن النفسي وفصل الذهن عن العمل: desconectar del trabajo, practicar meditación."
            ],
            "grammarPoints": [
                {
                    "titleAr": "تراكيب التعبير عن الضغط النفسي والتخلص منه",
                    "explanationAr": "1. **التعبير عن الضغوط والمشاعر السلبية**:\n- **Estar sometido a estrés**: El equipo está sometido a mucho estrés por los plazos.\n- **Sentirse desbordado/a**: Me siento desbordado por tantas responsabilidades (أشعر بالإرهاق والعجز عن الملاحقة).\n- **Sufrir de ansiedad / insomnio**: Mucha gente sufre de insomnio por preocupaciones laborales.\n2. **التعبير عن التعافي والاسترخاء**:\n- **Desconectar de**: Necesito desconectar del móvil durante el fin de semana.\n- **Recargar las pilas**: Salir al campo me ayuda a recargar las pilas (تعبير اصطلاحي: شحن طاقتي مجدداً)."
                }
            ],
            "commonMistakesAr": [
                "ترجمة 'يفصل ذهنه عن الشغل' بـ *separar la mente*؛ التعبير الاصطلاحي الإسباني الشائع هو desconectar del trabajo.",
                "استخدام حرف الجر por بدلاً من de بعد desconectar (الصحيح: desconectar del trabajo / de las redes)."
            ],
            "dialectNotes": [
                {
                    "region": "EG",
                    "noteAr": "في مصر بنقول: «محتاج أفصل خالص عن الشغل والموبايل يومين عشان أشحن طاقتي ومحسش بالضغط». بالإسبانية: Necesito desconectar del trabajo para recargar las pilas y reducir el estrés."
                }
            ],
            "culturalNoteAr": "ينص القانون الإسباني لحماية البيانات على 'الحق في فصل الاتصال الرقمي' (el derecho a la desconexión digital)، والذي يمنع الشركات من مراسلة الموظف بعد انتهاء ساعات العمل الرسمية."
        },
        "contentBlocks": [
            {
                "id": f"cb-{slug}-intro",
                "type": "explanation",
                "titleAr": "مصطلحات الصحة النفسية والتوازن",
                "bodyAr": "المفردات الأساسية:\n- **el estrés**: التوتر والضغط العصبي\n- **la ansiedad**: القلق النفسي والاضطراب\n- **desconectar**: يفصل ذهنه عن ضغوط العمل والمشاغل\n- **el agotamiento**: الإرهاق الشديد واستنزاف الطاقة (Burnout)\n- **la salud mental**: الصحة النفسية والعقلية\n- **el equilibrio**: التوازن والاستقرار بين العمل والحياة",
                "examples": [
                    {"es": "Cuidar la salud mental es tan importante como cuidar la salud física.", "ar": "العناية بالصحة النفسية مهمة تماماً مثل العناية بالصحة الجسدية."},
                    {"es": "Durante las vacaciones apago el teléfono para desconectar de verdad.", "ar": "خلال الإجازة أغلق الهاتف لكي أفصل ذهني حقاً عن المشاغل."},
                    {"es": "El exceso de trabajo continuado provoca agotamiento y ansiedad.", "ar": "الإفراط المستمر في العمل يسبب الإرهاق التام والقلق."}
                ]
            }
        ],
        "newVocabulary": ["estrés", "ansiedad", "desconectar", "agotamiento", "salud mental", "equilibrio"],
        "reviewVocabulary": ["vida", "cuerpo"]
    }

    exs = [
        choice_ex(
            "ex-b1-emo-1", "word_choice",
            "اختر التعبير الاصطلاحي الذي يعني فصل الذهن والابتعاد عن ضغوط العمل",
            ["vocabulary"], 1,
            "ما هو الفعل الإسباني الشائع الذي يعني التوقف التام عن التفكير في مشاغل الشغل؟",
            "El fin de semana me voy a la montaña para _____ del trabajo.",
            "في عطلة نهاية الأسبوع أذهب إلى الجبل لكي ... عن العمل.",
            [
                opt("a", "desconectar", "يفصل ذهنه ويستجم (الصواب)", True),
                opt("b", "estrés", "التوتر (اسم)", False, "نحتاج فعلاً بعد para وليس اسماً."),
                opt("c", "agotamiento", "الإرهاق", False, "الذهاب للجبل بهدف فصل الذهن (desconectar).")
            ],
            ["desconectar", "estrés", "agotamiento"],
            "فعل desconectar del trabajo يعني فصل الذهن والابتعاد التام عن ضغوط المشاغل."
        ),
        fill_ex(
            "ex-b1-emo-2",
            "أكمل بالمصطلح الذي يعني التوازن بين متطلبات العمل والحياة (el _____)",
            ["vocabulary", "writing"], 1,
            "اكتب الكلمة الإسبانية المذكرة التي تعني 'التوازن والاستقرار' (el _____)",
            "Es necesario encontrar un buen _____ entre la vida profesional y la personal.",
            "من الضروري إيجاد توازن جيد بين الحياة المهنية والشخصية.",
            ["equilibrio", "vida"],
            ["equilibrio"],
            "كلمة equilibrio تعني التوازن والاعتدال بين مختلف جوانب الحياة."
        ),
        choice_ex(
            "ex-b1-emo-3", "word_choice",
            "حدد الحالة النفسية الناتجة عن تراكم القلق والضغوط المستمرة",
            ["vocabulary"], 2,
            "ما هو المصطلح الذي يصف حالة القلق والتوتر النفسي المصحوب بالخوف من المستقبل؟",
            "Las técnicas de respiración profunda ayudan a calmar los episodios de _____.",
            "تساعد تقنيات التنفس العميق في تهدئة نوبات ...",
            [
                opt("a", "ansiedad", "القلق النفسي (الصواب)", True),
                opt("b", "equilibrio", "التوازن", False, "التنفس العميق يعالج نوبات القلق (ansiedad)."),
                opt("c", "desconectar", "فصل الذهن", False, "المطلوب اسم الحالة النفسية المرضية.")
            ],
            ["ansiedad", "equilibrio", "desconectar"],
            "la ansiedad هي حالة القلق النفسي والاضطراب الداخلي."
        ),
        order_ex(
            "ex-b1-emo-4",
            "رتّب الجملة للتأكيد على أولوية حماية الصحة النفسية",
            ["grammar", "writing"], 2,
            ["Debemos", "cuidar", "nuestra", "salud", "mental", "siempre"],
            "Debemos cuidar nuestra salud mental siempre",
            "الترتيب: الفعل Debes cuidar ثم المفعول nuestra salud mental ثم الظرف siempre.",
            ["salud mental"]
        ),
        choice_ex(
            "ex-b1-emo-5", "listen_choose",
            "استمع للتسجيل وحدد العارض النفسي والجسدي الناتج عن الإفراط في العمل",
            ["listening", "vocabulary"], 2,
            "استمع للمتحدث يصف حالته بعد أسابيع من العمل المتواصل",
            "Si no descanso pronto, voy a sufrir un grave agotamiento físico y mental.",
            "إذا لم أسترح قريباً، سأعاني من إرهاق جسدي ونفسي حاد.",
            [
                opt("a", "agotamiento", "الإرهاق الشديد واستنزاف الطاقة (الصواب)", True),
                opt("b", "equilibrio", "توازن", False, "المتحدث يحذر من الانهيار والإرهاق (agotamiento)."),
                opt("c", "desconectar", "استجمام", False, "المتحدث يشكو من الإجهاد الشديد.")
            ],
            ["agotamiento", "equilibrio", "desconectar"],
            "المتحدث قال: 'voy a sufrir un grave agotamiento físico y mental'.",
            audioKey="pending/b1_sufrir_grave_agotamiento.mp3",
            speechEs="Si no descanso pronto, voy a sufrir un grave agotamiento físico y mental."
        ),
        speak_ex(
            "ex-b1-emo-6",
            "انطق نصيحتك لتخفيف التوتر والحفاظ على التوازن النفسي",
            ["speaking", "pronunciation"], 2,
            "انطق الجملة التالية بأسلوب دافئ وهادئ ناصحاً صديقك:",
            "Para reducir el estrés, es vital desconectar del móvil y buscar el equilibrio.",
            "لتقليل التوتر، من الضروري فصل الذهن عن الهاتف والبحث عن التوازن.",
            "pending/b1_reducir_estres_desconectar.mp3",
            ["estrés", "desconectar", "equilibrio"],
            "Para reducir el estrés, es vital desconectar del móvil y buscar el equilibrio.",
            "انتبه لنطق حرف s المكرر في estrés ونطق qu كـ كاف في equilibrio."
        )
    ]
    return lesson_doc(doc, exs, level="B1")


def make_lesson_consulta_especialista():
    slug = "b1-consulta-especialista"
    doc = {
        "slug": slug,
        "unitSlug": "b1-u8-health-lifestyle",
        "levelCode": "B1",
        "titleAr": "استشارة الأخصائي: الحوار الطبي المعمق في التغذية والعلاج الطبيعي",
        "titleEs": "Consulta con el especialista: Nutrición, fisioterapia y diagnóstico",
        "subtitleAr": "شرح التاريخ الصحي، قراءة التحاليل، والاتفاق على برنامج علاجي",
        "order": 4,
        "estimatedMinutes": 18,
        "cefrLevel": "B1",
        "review": review_block(),
        "pedagogy": {
            "learningObjectivesAr": [
                "أن يجري المتعلم حواراً متقدماً مع طبيب أخصائي (especialista / nutricionista / fisioterapeuta).",
                "أن يشرح نتائج الفحوصات والتحاليل الطبية: análisis de sangre, radiografía, resonancia.",
                "أن يستفسر عن الآثار الجانبية للأدوية (efectos secundarios) والجرعات المقررة ومتابعة العلاج."
            ],
            "grammarPoints": [
                {
                    "titleAr": "تراكيب الاستشارة الطبية المعمقة",
                    "explanationAr": "1. **الاستفسار عن التحاليل والتشخيص**:\n- Los resultados del análisis de sangre indican un nivel bajo de hierro (تدل نتائج تحليل الدم على نقص في الحديد).\n- ¿Cuál es el diagnóstico definitivo? (ما هو التشخيص النهائي للحالة؟).\n2. **السؤال عن الآثار الجانبية والجرعات**:\n- ¿Este fármaco tiene algún efecto secundario? (هل لهذا العقار أي أثر جانبي؟).\n- ¿Durante cuánto tiempo debo seguir este tratamiento de fisioterapia?\n3. **المتابعة والمراجعة الطبية**:\n- Le programo una cita de revisión dentro de un mes (سأحدد لك موعد مراجعة بعد شهر)."
                }
            ],
            "commonMistakesAr": [
                "استخدام كلمة *efecto malo* بدلاً من المصطلح الطبي العلمي المعياري el efecto secundario.",
                "ترجمة 'العلاج الطبيعي' بـ *tratamiento natural*؛ الاسم الطبي الدقيق هو la fisioterapia."
            ],
            "dialectNotes": [
                {
                    "region": "EG",
                    "noteAr": "في مصر عند الأخصائي بنقول: «عملت تحاليل الدم وأشعة عشان الركبة، وعايز أعرف العلاج الطبيعي هياخد كام جلسة؟». بالإسبانية: Me hice análisis de sangre y radiografía; ¿cuántas sesiones de fisioterapia necesito?"
                }
            ],
            "culturalNoteAr": "في إسبانيا للوصول إلى الطبيب الأخصائي (el especialista) عبر التأمين الصحي الحكومي، يجب المرور أولاً بطبيب الأسرة (médico de cabecera) ليمنحك إحالة رسمية (el volante)."
        },
        "contentBlocks": [
            {
                "id": f"cb-{slug}-intro",
                "type": "explanation",
                "titleAr": "مصطلحات العيادة التخصصية",
                "bodyAr": "المفردات السريرية:\n- **el especialista**: الطبيب الأخصائي في فرع محدد\n- **el análisis de sangre**: تحليل الدم المخبري\n- **el diagnóstico**: التشخيص الطبي للحالة\n- **el efecto secundario**: العَرَض أو الأثر الجانبي للدواء\n- **la fisioterapia**: العلاج الطبيعي والتأهيلي\n- **la sesión**: الجلسة العلاجية المقررة",
                "examples": [
                    {"es": "El especialista revisó el análisis de sangre y confirmó el diagnóstico.", "ar": "راجع الأخصائي تحليل الدم وأكد التشخيص."},
                    {"es": "El médico me advirtió de los posibles efectos secundarios del antibiótico.", "ar": "حذرني الطبيب من الآثار الجانبية المحتملة للمضاد الحيوي."},
                    {"es": "Necesito realizar diez sesiones de fisioterapia para recuperar la movilidad.", "ar": "أحتاج لإجراء عشر جلسات علاج طبيعي لاستعادة الحركة."}
                ]
            }
        ],
        "newVocabulary": ["especialista", "análisis de sangre", "diagnóstico", "efecto secundario", "fisioterapia", "sesión"],
        "reviewVocabulary": ["consulta", "medicamento", "médico"]
    }

    exs = [
        choice_ex(
            "ex-b1-ces-1", "word_choice",
            "اختر المفردة التي تعني التشخيص الطبي للحالة المرضية",
            ["vocabulary"], 1,
            "ما هي الكلمة التي تعني 'تحديد الطبيب لنوع المرض وسببه'؟",
            "Tras revisar todas las pruebas, el médico dio un _____ claro y preciso.",
            "بعد مراجعة جميع الفحوصات، أعطى الطبيب ... واضحاً ودقيقاً.",
            [
                opt("a", "diagnóstico", "تشخيص طبي (الصواب)", True),
                opt("b", "efecto secundario", "أثر جانبي", False, "النتيجة الشاملة للفحوصات هي التشخيص diagnóstico."),
                opt("c", "sesión", "جلسة علاجية", False, "التقييم يسمى التشخيص.")
            ],
            ["diagnóstico", "efecto secundario", "sesión"],
            "el diagnóstico هو التشخيص الطبي الذي يحدد طبيعة المرض بناءً على الفحوصات."
        ),
        fill_ex(
            "ex-b1-ces-2",
            "أكمل بالمصطلح الذي يعني العلاج الطبيعي والتأهيلي: (la _____)",
            ["vocabulary", "writing"], 1,
            "اكتب الكلمة الإسبانية المؤنثة التي تعني 'العلاج الطبيعي للحركة والمفاصل' (la _____)",
            "Para recuperarse de la lesión en la rodilla tuvo que hacer _____ durante dos meses.",
            "للتعافي من إصابة الركبة اضطر للخضوع لـ ... مدة شهرين.",
            ["fisioterapia"],
            ["fisioterapia"],
            "كلمة fisioterapia تعني العلاج الطبيعي والتأهيلي للأوتار والمفاصل."
        ),
        choice_ex(
            "ex-b1-ces-3", "word_choice",
            "حدد ما يسمى بالأثر غير المرغوب فيه الذي قد يسببه الدواء",
            ["vocabulary"], 2,
            "ماذا نسمي الأعراض غير المستحبة التي تصاحب تناول بعض العقاقير الطبية؟",
            "La somnolencia es el principal _____ de este medicamento para la alergia.",
            "النعاس هو ... الرئيسي لهذا الدواء المعالج للحساسية.",
            [
                opt("a", "efecto secundario", "أثر جانبي (الصواب)", True),
                opt("b", "análisis de sangre", "تحليل دم", False, "النعاس أثر مصاحب للدواء (efecto secundario)."),
                opt("c", "especialista", "أخصائي", False, "النعاس أثر جانبي للدواء.")
            ],
            ["efecto secundario", "análisis de sangre", "especialista", "medicamento"],
            "el efecto secundario هو الأثر الجانبي غير المقصود للدواء."
        ),
        order_ex(
            "ex-b1-ces-4",
            "رتّب الجملة لطلب تحويل المريض إلى الطبيب الأخصائي",
            ["grammar", "writing"], 2,
            ["El", "médico", "me", "derivó", "a", "un", "especialista"],
            "El médico me derivó a un especialista",
            "الترتيب: الفاعل El médico ثم الضمير me ثم الفعل derivó ثم شبه الجملة a un especialista.",
            ["especialista", "médico"]
        ),
        choice_ex(
            "ex-b1-ces-5", "listen_choose",
            "استمع للتسجيل وحدد الفحص المخبري الذي يطلبه الطبيب",
            ["listening", "vocabulary"], 2,
            "استمع لتعليمات الطبيب في العيادة وحدد الفحص المطلوب",
            "Le recomiendo que se haga un análisis de sangre completo en ayunas.",
            "أنصحك بإجراء تحليل دم شامل وأنت صائم.",
            [
                opt("a", "análisis de sangre", "تحليل دم مخبري (الصواب)", True),
                opt("b", "fisioterapia", "علاج طبيعي", False, "الطبيب طلب فحصاً مخبرياً (análisis de sangre)."),
                opt("c", "efecto secundario", "أثر جانبي", False, "المطلوب في الاستماع هو الفحص المخبري.")
            ],
            ["análisis de sangre", "fisioterapia", "efecto secundario"],
            "الطبيب قال: 'se haga un análisis de sangre completo en ayunas'.",
            audioKey="pending/b1_analisis_sangre_ayunas.mp3",
            speechEs="Le recomiendo que se haga un análisis de sangre completo en ayunas."
        ),
        speak_ex(
            "ex-b1-ces-6",
            "انطق استفسارك للطبيب عن التشخيص والخطة العلاجية",
            ["speaking", "pronunciation"], 2,
            "انطق السؤال التالي بوضوح ولباقة في عيادة الطبيب الأخصائي:",
            "¿Cuál es el diagnóstico y cuántas sesiones de fisioterapia necesitaré?",
            "ما هو التشخيص وكم جلسة علاج طبيعي سأحتاج؟",
            "pending/b1_diagnostico_sesiones_fisioterapia.mp3",
            ["diagnóstico", "sesión", "fisioterapia"],
            "¿Cuál es el diagnóstico y cuántas sesiones de fisioterapia necesitaré?",
            "انتبه لنطق g في diagnóstico كـ جيم مرققة ونطق sesion كـ سيثيون بلباقة."
        )
    ]
    return lesson_doc(doc, exs, level="B1")
