# -*- coding: utf-8 -*-
"""A2 Units 8 (Hobbies & Free Time), 9 (Phone & Appointments), and 10 (Culture & Impersonal Se).
12 Lessons completing 100% of Level A2 based on:
- Aula Plus 2 (Unidades 4, 7, 9)
- Gramática del uso del español A1-B2 (Capítulos 28-30, 55, 60-65)
- Español 2000 Nivel Elemental & Intermedio (Lecciones 14, 15, 16, 21)
- المرشد في اللغة الأسبانية (الأفعال المشابهة لـ gustar، المكالمات وحجز المواعيد، المبني للمجهول المنعكس se)
"""
import sys, os
sys.path.insert(0, os.path.dirname(__file__))
from common import opt, choice_ex, fill_ex, order_ex, speak_ex, lesson_doc, review_block

# ==============================================================================
# UNIT 8: a2-u8-hobbies (الرياضة والهوايات ووقت الفراغ)
# ==============================================================================

def make_lesson_deportes_tiempo_libre():
    slug = "a2-deportes-tiempo-libre"
    doc = {
        "slug": slug,
        "unitSlug": "a2-u8-hobbies",
        "levelCode": "A2",
        "titleAr": "الرياضة وأنشطة وقت الفراغ: ممارسة الهوايات والألعاب الرياضية",
        "titleEs": "Deportes y actividades de tiempo libre",
        "subtitleAr": "التمييز بين practicar وjugar a وhacer مع الأنشطة المختلفة",
        "order": 1,
        "estimatedMinutes": 18,
        "cefrLevel": "A2",
        "review": review_block(),
        "pedagogy": {
            "learningObjectivesAr": [
                "أن يذكر المتعلم الرياضات وأنشطة وقت الفراغ الأكثر شيوعاً باللغة الإسبانية.",
                "أن يستخدم حرف الجر المناسب مع الأفعال: jugar a + el/la، وhacer، وpracticar.",
                "أن يعبر عن هواياته المفضلة في أوقات الفراغ بثقة."
            ],
            "grammarPoints": [
                {
                    "titleAr": "أفعال ممارسة الرياضة: Jugar a مقابل Hacer وPracticar",
                    "explanationAr": "1. **jugar a**: يُستخدم مع الألعاب التنافسية والرياضات التي تستخدم كرة أو أداة:\n- juego al fútbol (ألعب كرة القدم - لاحظ إدغام a + el = al).\n- jugamos al tenis (نلعب التنس).\n- juegan al ajedrez (يلعبون الشطرنج).\n2. **hacer**: يُستخدم مع الأنشطة والتمارين والرياضات الفردية والطبيعية:\n- hago natación (أمارس السباحة).\n- hace senderismo (يمارس رياضة المشي الجبلي).\n- hacemos yoga (نمارس اليوجا).\n3. **practicar**: يأتي مباشرة مع الرياضة بدون حرف جر:\n- practico deporte (أمارس الرياضة)."
                }
            ],
            "commonMistakesAr": [
                "نسيان حرف الجر a بعد jugar مع الرياضة (الخطأ: *juego fútbol*، الصواب: juego al fútbol).",
                "استخدام jugar مع رياضات لا تعتمد على كرة أو منافسة ألعاب، مثل السباحة أو اليوجا (الصواب: hacer natación / yoga وليس *jugar a la natación*)."
            ],
            "dialectNotes": [
                {
                    "region": "EG",
                    "noteAr": "في مصر نقول: «بلعب كورة» أو «بنزل أعمل جيم/سباحة». بالإسبانية: juego al fútbol / hago natación."
                }
            ],
            "culturalNoteAr": "رياضة البادل (el pádel) والمشي في الطبيعة (el senderismo) من أكثر الأنشطة الرياضية شعبية في إسبانيا بين جميع الفئات العمرية."
        },
        "contentBlocks": [
            {
                "id": f"cb-{slug}-intro",
                "type": "explanation",
                "titleAr": "الأنشطة والرياضات في وقت الفراغ",
                "bodyAr": "أهم المفردات:\n- **el senderismo**: المشي في الطبيعة والجبال\n- **la natación**: السباحة\n- **el tenis**: التنس\n- **el ajedrez**: الشطرنج\n- **el tiempo libre**: وقت الفراغ\n- **el deporte**: الرياضة",
                "examples": [
                    {"es": "Los domingos me gusta hacer senderismo en la sierra.", "ar": "أيام الأحد يعجبني ممارسة المشي الجبلي في السلسلة الجبلية."},
                    {"es": "Mi hermano juega al tenis dos veces por semana.", "ar": "أخي يلعب التنس مرتين أسبوعياً."},
                    {"es": "¿Qué deporte practicas en tu tiempo libre?", "ar": "أي رياضة تمارس في وقت فراغك؟"}
                ]
            }
        ],
        "newVocabulary": ["senderismo", "natación", "tenis", "ajedrez", "tiempo libre", "deporte"],
        "reviewVocabulary": ["fútbol", "jugar"]
    }

    exs = [
        choice_ex(
            "ex-a2-dep-1", "word_choice",
            "اختر الفعل الصحيح مع رياضة المشي الجبلي",
            ["grammar"], 1,
            "أي فعل نستخدم عادة مع رياضة المشي في الطبيعة (senderismo)؟",
            "Los fines de semana me gusta _____ senderismo por la montaña.",
            "في عطلات نهاية الأسبوع يعجبني ممارسة رياضة المشي في الجبل.",
            [
                opt("a", "hacer", "يُستخدم مع الأنشطة الفردية والرياضات الطبيعية (الصواب)", True),
                opt("b", "jugar", "يختص بألعاب الكرة والألعاب التنافسية بمضرب أو فريق", False, "senderismo ليست لعبة كرة ليُستخدم معها jugar."),
                opt("c", "ver", "يرى / يشاهد", False, "المعنى يتطلب ممارسة الرياضة وليس مجرد مشاهدتها.")
            ],
            ["senderismo"],
            "مع رياضات مثل senderismo أو natación نستخدم الفعل hacer: hacer senderismo."
        ),
        fill_ex(
            "ex-a2-dep-2",
            "أكمل حرف الجر المدغم مع فعل jugar",
            ["grammar", "writing"], 1,
            "أكمل بحرف الجر المدغم المناسب (a + el = al) قبل كلمة tenis",
            "Por las tardes suelo jugar _____ tenis con mis amigos.",
            "في فترات بعد الظهر أعتاد لعب التنس مع أصدقائي.",
            ["tenis", "jugar"],
            ["al"],
            "فعل jugar يتطلب حرف الجر a، ومع الاسم المذكر el tenis يدغمان إلى al: jugar al tenis."
        ),
        choice_ex(
            "ex-a2-dep-3", "word_choice",
            "حدد اسم الرياضة المائية التي تُمارس في المسبح",
            ["vocabulary"], 1,
            "أي مفردة تعني رياضة السباحة؟",
            "La _____ es un deporte muy completo para la espalda.",
            "... هي رياضة متكاملة جداً لتقوية الظهر.",
            [
                opt("a", "natación", "السباحة (الصواب)", True),
                opt("b", "ajedrez", "الشطرنج (لعبة ذهنية)", False, "الشطرنج لا يُمارس في الماء وليس رياضة بدنية للظهر."),
                opt("c", "tiempo libre", "وقت الفراغ", False, "tiempo libre يعني وقت الفراغ وليس اسم رياضة معينة.")
            ],
            ["natación", "ajedrez", "tiempo libre", "deporte"],
            "كلمة la natación تعني رياضة السباحة."
        ),
        order_ex(
            "ex-a2-dep-4",
            "رتّب الكلمات لتكوين سؤال حول الهوايات في وقت الفراغ",
            ["grammar", "writing"], 2,
            ["¿Qué", "haces", "en", "tu", "tiempo", "libre?"],
            "¿Qué haces en tu tiempo libre?",
            "الترتيب السليم للسؤال: أداة الاستفهام ثم الفعل ثم شبه الجملة الظرفية.",
            ["tiempo libre"]
        ),
        choice_ex(
            "ex-a2-dep-5", "listen_choose",
            "استمع للمتحدث وحدد نشاطه الرياضي المفضل",
            ["listening", "vocabulary"], 2,
            "استمع للتسجيل وحدد اللعبة التي يمارسها المتحدث مع جده",
            "Los sábados por la tarde juego al ajedrez con mi abuelo.",
            "أيام السبت بعد الظهر ألعب الشطرنج مع جدي.",
            [
                opt("a", "ajedrez", "الشطرنج (الصواب)", True),
                opt("b", "tenis", "التنس", False, "المتحدث قال بوضوح: juego al ajedrez."),
                opt("c", "senderismo", "المشي الجبلي", False, "لم يُذكر المشي الجبلي في التسجيل بل الشطرنج.")
            ],
            ["ajedrez", "tenis", "senderismo"],
            "المتحدث قال: 'Los sábados por la tarde juego al ajedrez'.",
            audioKey="pending/a2_deportes_ajedrez.mp3",
            speechEs="Los sábados por la tarde juego al ajedrez con mi abuelo."
        ),
        speak_ex(
            "ex-a2-dep-6",
            "انطق جملتك الإسبانية عن ممارسة الرياضة",
            ["speaking", "pronunciation"], 2,
            "انطق الجملة التالية بوضوح مع إدغام al:",
            "Practico deporte tres veces por semana.",
            "أمارس الرياضة ثلاث مرات أسبوعياً.",
            "pending/a2_practico_deporte.mp3",
            ["deporte"],
            "Practico deporte tres veces por semana.",
            "انتبه لنطق حرف c في Practico كـ كاف، وحرف d كـ دال خفيفة."
        )
    ]
    return lesson_doc(doc, exs)


def make_lesson_gustos_preferencias_avanzadas():
    slug = "a2-gustos-preferencias-avanzadas"
    doc = {
        "slug": slug,
        "unitSlug": "a2-u8-hobbies",
        "levelCode": "A2",
        "titleAr": "التعبير المتقدم عن الميول: أفعال encantar وinteresar وfascinar وmolestar",
        "titleEs": "Expresar gustos e intereses avanzados",
        "subtitleAr": "بناء الجمل مع الأفعال المشابهة لـ gustar وضمائر المفعول غير المباشر",
        "order": 2,
        "estimatedMinutes": 18,
        "cefrLevel": "A2",
        "review": review_block(),
        "pedagogy": {
            "learningObjectivesAr": [
                "أن يطبق المتعلم بنية الأفعال المشابهة لـ gustar مع ضمائر المفعول غير المباشر (me, te, le, nos, os, les).",
                "أن يعبر عن درجات مختلفة من الإعجاب والشغف والاهتمام: encantar, fascinar, interesar, apasionar, molestar.",
                "أن يطابق بين صيغة الفعل المفرد أو الجمع والاسم الذي يليه."
            ],
            "grammarPoints": [
                {
                    "titleAr": "الأفعال الشبيهة بـ Gustar",
                    "explanationAr": "الأفعال مثل **encantar** (يُعجب بشدة / يعشق)، و**interesar** (يهم / يثير اهتمام)، و**fascinar** (يسحر / يفتن)، و**molestar** (يزعج / يضايق) تصرف مثل **gustar** تماماً:\n- تأخذ ضمير مفعول غير مباشر يعود على الشخص: **me / te / le / nos / os / les**.\n- يأتي الفعل في صيغتين فقط غالباً:\n  * المفرد (-a / -e): إذا تلاه فعل في المصدر أو اسم مفرد (Me encanta la música / Me fascina viajar).\n  * الجمع (-an / -en): إذا تلاه اسم جمع (Nos interesan los idiomas / Les molestan los ruidos)."
                }
            ],
            "commonMistakesAr": [
                "تصريف الفعل مع الفاعل الحقيقي للشعور (الخطأ الشائع: *Yo encanto la música*، والصواب الحصري: Me encanta la música).",
                "وضع صيغة الجمع للفعل عندما يليه فعلان في المصدر (الصواب: Me gusta leer y escribir بصيغة المفرد لأن المصادر تعامل معاملة المفرد)."
            ],
            "dialectNotes": [
                {
                    "region": "EG",
                    "noteAr": "في اللهجة المصرية نقول: «بيعجبني، بيشدني، بيبهرني، بيعصبني». بالإسبانية: me gusta, me interesa, me fascina, me molesta."
                }
            ],
            "culturalNoteAr": "الإسبان يعبرون عن شغفهم الشديد بكلمات مثل 'me chifla' أو 'me apasiona' في المحادثات الودية اليومية."
        },
        "contentBlocks": [
            {
                "id": f"cb-{slug}-intro",
                "type": "explanation",
                "titleAr": "أفعال التفضيل والشغف والاهتمام",
                "bodyAr": "درجات التعبير:\n- **encantar**: يعشق / يعجبه جداً (درجة أعلى من gustar)\n- **interesar**: يهتم بـ / يثير فضوله\n- **fascinar**: يبهره / يسحره\n- **molestar**: يضايقه / يزعجه\n- **la pasión**: الشغف / العاطفة القوية\n- **el pasatiempo**: الهواية / التسلية المفضلة",
                "examples": [
                    {"es": "A María le fascinan las novelas históricas.", "ar": "ماريا تسحرها الروايات التاريخية."},
                    {"es": "¿Te interesan los documentales de ciencia?", "ar": "هل تهمك الأفلام الوثائقية العلمية؟"},
                    {"es": "Nos molesta mucho el ruido de la calle.", "ar": "يزعجنا كثيراً ضجيج الشارع."}
                ]
            }
        ],
        "newVocabulary": ["encantar", "interesar", "fascinar", "molestar", "pasión", "pasatiempo"],
        "reviewVocabulary": ["gustar", "música"]
    }

    exs = [
        choice_ex(
            "ex-a2-gus-1", "word_choice",
            "اختر صيغة الفعل المناسبة مع الاسم الجمع",
            ["grammar"], 1,
            "أي صيغة لفعل interesar هي الصحيحة مع الاسم الجمع los idiomas؟",
            "A nosotros nos _____ mucho los idiomas extranjeros.",
            "نحن تهمنا كثيراً اللغات الأجنبية.",
            [
                opt("a", "interesan", "صيغة الجمع لتطابق الفاعل المتأخر los idiomas (الصواب)", True),
                opt("b", "interesa", "صيغة مفرد لا تطابق الاسم الجمع los idiomas", False, "los idiomas اسم جمع يتطلب فعلاً ينتهي بـ -an."),
                opt("c", "interesamos", "تصريف خاطئ لشخص المتكلم nosotros", False, "الفعل يشبه gustar ولا يُصرف مع الضمير nos مباشرة بل مع الاسم التالي.")
            ],
            ["interesar"],
            "الفعل يطابق الاسم التالي: los idiomas جمع، إذن nos interesan."
        ),
        fill_ex(
            "ex-a2-gus-2",
            "أكمل بضمير المفعول غير المباشر المناسب",
            ["grammar", "writing"], 1,
            "أكمل بضمير المفعول المناسب للغائب (A ella)",
            "A ella _____ fascina la astronomía y el espacio.",
            "هي يسحرها علم الفلك والفضاء.",
            ["fascinar"],
            ["le"],
            "مع الغائب المفرد (ella) نستخدم الضمير le: A ella le fascina."
        ),
        choice_ex(
            "ex-a2-gus-3", "word_choice",
            "اختر الفعل المعبر عن الانزعاج والضيق",
            ["vocabulary", "grammar"], 2,
            "أي فعل يعبر عن الشعور بالانزعاج من الأصوات العالية؟",
            "Me _____ mucho el desorden y los gritos cuando estudio.",
            "... كثيراً الفوضى والصراخ عندما أدرس.",
            [
                opt("a", "molesta", "يزعجني / يضايقني (الصواب)", True),
                opt("b", "encanta", "يعجبني جداً / أعشق", False, "المعنى متناقض؛ الفوضى لا تُعشق عند الدراسة."),
                opt("c", "gusta", "يعجبني", False, "المعنى يتطلب التعبير عن الضيق وليس الاستحسان.")
            ],
            ["molestar", "encantar", "gustar"],
            "فعل molestar يعني يزعج أو يضايق: Me molesta el desorden."
        ),
        order_ex(
            "ex-a2-gus-4",
            "رتّب الجملة التوكيدية مع صيغة a mí me encanta",
            ["grammar", "writing"], 2,
            ["A", "mí", "me", "encanta", "bailar", "salsa"],
            "A mí me encanta bailar salsa",
            "الترتيب السليم للتوكيد: شبه الجملة A mí ثم الضمير me ثم الفعل encanta ثم المصدر.",
            ["encantar"]
        ),
        choice_ex(
            "ex-a2-gus-5", "listen_choose",
            "استمع للتسجيل وحدد شغف المتحدث",
            ["listening", "vocabulary"], 2,
            "استمع للتسجيل وحدد ما الذي يعشقه المتحدث",
            "La pintura es mi gran pasión; me encanta pintar cuadros.",
            "الرسم هو شغفي الكبير؛ أعشق رسم اللوحات.",
            [
                opt("a", "pasión", "شغف وعشق (الصواب)", True),
                opt("b", "molestar", "إزعاج", False, "المتحدث يتحدث عن شغفه الإيجابي بالرسم."),
                opt("c", "pasatiempo", "تسلية عابرة", False, "المتحدث قال بوضوح: 'es mi gran pasión'.")
            ],
            ["pasión", "molestar", "pasatiempo", "encantar"],
            "المتحدث قال: 'La pintura es mi gran pasión'.",
            audioKey="pending/a2_gustos_pasion.mp3",
            speechEs="La pintura es mi gran pasión; me encanta pintar cuadros."
        ),
        speak_ex(
            "ex-a2-gus-6",
            "انطق جملتك للتعبير عن الاهتمام بالثقافات",
            ["speaking", "pronunciation"], 2,
            "انطق الجملة التالية بنبرة معبرة عن الاهتمام:",
            "Me fascinan la historia y las culturas antiguas.",
            "تسحرني التاريخ والحضارات القديمة.",
            "pending/a2_me_fascinan_historia.mp3",
            ["fascinar"],
            "Me fascinan la historia y las culturas antiguas.",
            "انتبه لنطق حرف s وc في fascinan."
        )
    ]
    return lesson_doc(doc, exs)


def make_lesson_frecuencia_actividades():
    slug = "a2-frecuencia-actividades"
    doc = {
        "slug": slug,
        "unitSlug": "a2-u8-hobbies",
        "levelCode": "A2",
        "titleAr": "التعبير عن التكرار والروتين: ظروف a menudo وde vez en cuando وcasi nunca",
        "titleEs": "Expresar la frecuencia de las actividades",
        "subtitleAr": "تحديد مدى تكرار الأنشطة والهوايات في الحياة الأسبوعية",
        "order": 3,
        "estimatedMinutes": 18,
        "cefrLevel": "A2",
        "review": review_block(),
        "pedagogy": {
            "learningObjectivesAr": [
                "أن يصف المتعلم مدى تكرار قيامه بالأنشطة والهوايات باستخدام ظروف التكرار المتنوعة.",
                "أن يرتب ظروف التكرار من الأكثر تكراراً إلى النادر والمنعدم: siempre > a menudo > de vez en cuando > casi nunca > nunca.",
                "أن يحدد عدد المرات في الفترة الزمنية: una vez al mes, dos veces por semana."
            ],
            "grammarPoints": [
                {
                    "titleAr": "تدرج ظروف التكرار في الإسبانية",
                    "explanationAr": "سلم التكرار من 100% إلى 0%:\n- **siempre** (دائماً - 100%)\n- **a menudo / frecuentemente** (غالباً / مراراً - 75%)\n- **a veces / de vez en cuando** (أحياناً / من حين لآخر - 50%)\n- **rara vez / casi nunca** (نادراً / تقريباً أبداً - 10%)\n- **nunca / jamás** (أبداً - 0%).\n\nتحديد المرات:\n- Una vez **al** día / **al** mes / **al** año.\n- Tres veces **por** semana / **al** año."
                }
            ],
            "commonMistakesAr": [
                "الخلط بين a veces (أحياناً) و de vez en cuando (بين الحين والآخر)، وكلاهما صحيح لكن de vez en cuando تعبر عن فترات متباعدة أكثر.",
                "نسيان حرف الجر a مع أداة التعريف عند القول una vez al mes (الخطأ: *una vez el mes*)."
            ],
            "dialectNotes": [
                {
                    "region": "EG",
                    "noteAr": "في مصر نقول: «ساعات بنزل الجيم، ومن وقت للتاني بسافر، وتقريباً مبشربش قهوة». بالإسبانية: a veces, de vez en cuando, casi nunca."
                }
            ],
            "culturalNoteAr": "في إسبانيا من المعتاد جداً لقاء الأصدقاء لتناول مشروب 'tomar algo' عدة مرات في الأسبوع بعد انتهاء العمل."
        },
        "contentBlocks": [
            {
                "id": f"cb-{slug}-intro",
                "type": "explanation",
                "titleAr": "أهم تعبيرات التكرار",
                "bodyAr": "المفردات التكرارية:\n- **a menudo**: في كثير من الأحيان / غالباً\n- **de vez en cuando**: من حين لآخر / بين الفينة والأخرى\n- **casi nunca**: نادراً جداً / تقريباً أبداً\n- **la frecuencia**: التكرار / التردد\n- **la rutina**: الروتين اليومي\n- **el hábito**: العادة المكتسبة",
                "examples": [
                    {"es": "Voy al cine a menudo porque me apasionan las películas.", "ar": "أذهب إلى السينما غالباً لأنني أعشق الأفلام."},
                    {"es": "De vez en cuando salimos a cenar a un restaurante típico.", "ar": "من حين لآخر نخرج لتناول العشاء في مطعم تقليدي."},
                    {"es": "Casi nunca veo la televisión por la noche.", "ar": "نادراً جداً ما أشاهد التلفزيون في المساء."}
                ]
            }
        ],
        "newVocabulary": ["a menudo", "de vez en cuando", "casi nunca", "frecuencia", "rutina", "hábito"],
        "reviewVocabulary": ["siempre", "nunca"]
    }

    exs = [
        choice_ex(
            "ex-a2-fre-1", "word_choice",
            "اختر التعبير الدال على التكرار المتوسط (من حين لآخر)",
            ["vocabulary"], 1,
            "أي تعبير يعني 'من حين لآخر' بالإسبانية؟",
            "No tengo mucho tiempo, pero _____ voy al teatro con mi esposa.",
            "ليس لدي وقت كثير، ولكن ... أذهب إلى المسرح مع زوجتي.",
            [
                opt("a", "de vez en cuando", "من حين لآخر (الصواب)", True),
                opt("b", "siempre", "دائماً (تكرار تام)", False, "قال إنه ليس لديه وقت كثير، فلا يصح siempre."),
                opt("c", "nunca", "أبداً (نفي تام)", False, "قال إنه يذهب، إذن nunca لا تصح دلالياً.")
            ],
            ["de vez en cuando", "siempre", "nunca"],
            "تعبير de vez en cuando يعني من حين لآخر."
        ),
        fill_ex(
            "ex-a2-fre-2",
            "أكمل التعبير الشائع a menudo",
            ["vocabulary", "writing"], 1,
            "اكتب الكلمة الناقصة في التعبير الذي يعني 'غالباً / مراراً' (a _____)",
            "Mis amigos y yo practicamos deporte a _____.",
            "أنا وأصدقائي نمارس الرياضة غالباً.",
            ["a menudo"],
            ["menudo"],
            "التعبير هو a menudo ويعني غالباً أو بكثرة."
        ),
        choice_ex(
            "ex-a2-fre-3", "word_choice",
            "حدد المعنى المقابل للندرة شبه التامة",
            ["vocabulary"], 2,
            "ما التعبير الإسباني المناسب لـ 'تقريباً لا أفعل ذلك أبداً'؟",
            "No me gustan los dulces; _____ como pasteles o chocolates.",
            "لا تعجبني الحلويات؛ ... آكل الكعك أو الشوكولاتة.",
            [
                opt("a", "casi nunca", "تقريباً أبداً / نادراً جداً (الصواب)", True),
                opt("b", "a menudo", "غالباً وبكثرة", False, "يناقض جملة عدم حبه للحلويات."),
                opt("c", "siempre", "دائماً", False, "يناقض جملة عدم حبه للحلويات.")
            ],
            ["casi nunca", "a menudo", "siempre"],
            "casi nunca تعني نادراً جداً أو بالكاد يحدث ذلك."
        ),
        order_ex(
            "ex-a2-fre-4",
            "رتّب الجملة لتحديد عدد مرات ممارسة الرياضة أسبوعياً",
            ["grammar", "writing"], 2,
            ["Voy", "al", "gimnasio", "tres", "veces", "por", "semana"],
            "Voy al gimnasio tres veces por semana",
            "الترتيب: الفعل والوجهة Voy al gimnasio ثم العبارة التكرارية tres veces por semana.",
            ["rutina"]
        ),
        choice_ex(
            "ex-a2-fre-5", "listen_choose",
            "استمع وحدد تكرار القراءة لدى المتحدث",
            ["listening", "vocabulary"], 2,
            "كم مرة يقرأ المتحدث الكتب باللغة الإسبانية؟",
            "Leo novelas en español casi todos los días; es mi hábito favorito.",
            "أقرأ الروايات بالإسبانية كل يوم تقريباً؛ إنه عادتي المفضلة.",
            [
                opt("a", "hábito", "عادة يومية متكررة (الصواب)", True),
                opt("b", "casi nunca", "نادراً جداً", False, "المتحدث يقرأ كل يوم تقريباً وليس نادراً."),
                opt("c", "de vez en cuando", "من حين لآخر", False, "المتحدث يقرأ يومياً وليس من حين لآخر.")
            ],
            ["hábito", "casi nunca", "de vez en cuando"],
            "المتحدث قال: 'es mi hábito favorito'.",
            audioKey="pending/a2_habito_lectura.mp3",
            speechEs="Leo novelas en español casi todos los días; es mi hábito favorito."
        ),
        speak_ex(
            "ex-a2-fre-6",
            "انطق جملتك عن روتينك الرياضي المعتاد",
            ["speaking", "pronunciation"], 2,
            "انطق الجملة التالية بوضوح وسلاسة:",
            "Hago ejercicio a menudo para mantener una rutina sana.",
            "أمارس التمارين الرياضية غالباً للحفاظ على روتين صحي.",
            "pending/a2_rutina_sana.mp3",
            ["a menudo", "rutina"],
            "Hago ejercicio a menudo para mantener una rutina sana.",
            "انتبه لنطق حرف j في ejercicio كـ خاء مرققة."
        )
    ]
    return lesson_doc(doc, exs)


def make_lesson_conversacion_hobbies():
    slug = "a2-conversacion-hobbies"
    doc = {
        "slug": slug,
        "unitSlug": "a2-u8-hobbies",
        "levelCode": "A2",
        "titleAr": "حوار واقعي: الحديث عن الهوايات والاتفاق على نشاط مشترك",
        "titleEs": "Conversación sobre aficiones y planes de ocio",
        "subtitleAr": "تبادل الآراء حول الاهتمامات واقتراح موعد لممارسة نشاط ترفيهي",
        "order": 4,
        "estimatedMinutes": 18,
        "cefrLevel": "A2",
        "review": review_block(),
        "pedagogy": {
            "learningObjectivesAr": [
                "أن يقود المتعلم محادثة حقيقية باللغة الإسبانية للسؤال عن هوايات الطرف الآخر والرد عليها.",
                "أن يقترح نشاطاً ترفيهياً مشتركاً: ¿Por qué no vamos a...? / ¿Te apetece...?",
                "أن يعبر عن التوافق في الاهتمامات أو الاختلاف بلباقة واقتراح بدائل."
            ],
            "grammarPoints": [
                {
                    "titleAr": "أساليب الاقتراح والرد على الهوايات",
                    "explanationAr": "1. **اقتراح فكرة ترفيهية**:\n- ¿Te apetece + infinitivo? (هل ترغب في...؟ / هل تناسبك فكرة...؟)\n- ¿Por qué no vamos a + infinitivo? (لِمَ لا نذهب إلى...؟)\n2. **التعبير عن الموافقة والحماس**:\n- ¡Me parece una idea genial! (تبدو فكرة رائعة!)\n- ¡De acuerdo! Me encanta ese plan. (موافق! يعجبني هذا المخطط جداً).\n3. **الاعتذار واقتراح بديل**:\n- Es que no se me da bien... (الحقيقة أنني لست بارعاً في...)\n- Prefiero hacer otra cosa, ¿qué tal si...?"
                }
            ],
            "commonMistakesAr": [
                "استخدام gustar كفعل عادي مسبوق بـ Yo عند الرد (الخطأ: *Yo también me gusta*، والصواب: A mí también me gusta).",
                "نسيان تصريف apetece مع ضمير te أو os (الصواب: ¿Te apetece salir? وليس *¿Tú apeteces salir?*)."
            ],
            "dialectNotes": [
                {
                    "region": "EG",
                    "noteAr": "في مصر نقول: «إيه رأيك ننزل نتمشى أو نلعب ماتش؟ الفكرة دي عجباني أوي». بالإسبانية: ¿Te apetece salir a dar una vuelta? ¡Me parece genial!"
                }
            ],
            "culturalNoteAr": "عبارة '¿Te apetece...?' هي الأسلوب الأكثر عفوية وترحيباً بين الأصدقاء في إسبانيا لاقتراح أي نشاط ترفيهي."
        },
        "contentBlocks": [
            {
                "id": f"cb-{slug}-intro",
                "type": "explanation",
                "titleAr": "حوار تنظيم نشاط ترفيهي",
                "bodyAr": "المفردات التفاعلية:\n- **la afición**: الهواية / الشغف الشخصي\n- **el ocio**: وقت الراحة والاستجمام\n- **apetecer**: يرغب فيه / يروق له (تصريف مثل gustar)\n- **genial**: رائع / مذهل\n- **el plan**: المخطط أو المشروع الترفيهي\n- **coincidir**: يتطابق في الرأي أو يتفق",
                "examples": [
                    {"es": "¿Qué aficiones tienes en tu tiempo de ocio?", "ar": "ما هي هواياتك في وقت استجمامك؟"},
                    {"es": "¿Te apetece jugar un partido de tenis este sábado?", "ar": "هل تروق لك فكرة لعب مباراة تنس هذا السبت؟"},
                    {"es": "¡Me parece un plan genial! Quedamos a las diez.", "ar": "يبدو مخططاً رائعاً! نلتقي عند العاشرة."}
                ]
            }
        ],
        "newVocabulary": ["afición", "ocio", "apetecer", "genial", "plan", "coincidir"],
        "reviewVocabulary": ["quedar", "amigo"]
    }

    exs = [
        choice_ex(
            "ex-a2-cnh-1", "word_choice",
            "اختر التعبير الإسباني المناسب لاقتراح الخروج",
            ["grammar", "vocabulary"], 1,
            "أي سؤال تستخدمه لاقتراح الذهاب للسينما بطريقة ودية؟",
            "¿_____ ir al cine esta tarde a ver la nueva comedia?",
            "هل ... الذهاب إلى السينما هذا المساء لمشاهدة الفيلم الكوميدي الجديد؟",
            [
                opt("a", "Te apetece", "هل تروق لك الفكرة / هل ترغب (الصواب)", True),
                opt("b", "Tú apeteces", "تصريف شخصي خاطئ لفعل apetecer", False, "فعل apetecer يصرف مع الغائب ويأخذ ضمير مفعول te."),
                opt("c", "Te coincide", "يتطابق معك (غير مناسب دلالياً للاقتراح)", False, "coincidir لا يعبر عن الرغبة أو الاقتراح.")
            ],
            ["apetecer", "coincidir"],
            "نقول: ¿Te apetece + infinitivo? لاقتراح نشاط ترفيهي ودود."
        ),
        fill_ex(
            "ex-a2-cnh-2",
            "أكمل بكلمة تدل على الهواية أو الشغف",
            ["vocabulary", "writing"], 1,
            "اكتب المفردة الإسبانية المؤنثة التي تعني 'الهواية' (sinónimo de pasatiempo)",
            "La fotografía es mi principal _____ desde que era joven.",
            "التصوير الفوتوغرافي هو هوايتي الرئيسية منذ أن كنت شاباً.",
            ["afición"],
            ["afición", "aficion"],
            "كلمة afición تعني الهواية أو الميل الشخصي."
        ),
        choice_ex(
            "ex-a2-cnh-3", "word_choice",
            "حدد الرد الإيجابي المشجع على مخطط العطلة",
            ["vocabulary"], 2,
            "كيف تصف اقتراحاً بأنه ممتاز ورائع؟",
            "¡Me parece un plan _____! Me apunto sin dudarlo.",
            "يبدو مخططاً ...! سأنضم معكم بلا تردد.",
            [
                opt("a", "genial", "رائع / ممتاز (الصواب)", True),
                opt("b", "ocio", "وقت الفراغ (اسم وليس صفة)", False, "نحتاج صفة تصف الخطة، وocio اسم."),
                opt("c", "afición", "هواية (اسم)", False, "afición اسم لا يصف الخطة.")
            ],
            ["genial", "ocio", "afición", "plan"],
            "صفة genial تعني رائعاً أو عبقرياً وتستخدم للموافقة الحماسية."
        ),
        order_ex(
            "ex-a2-cnh-4",
            "رتّب عبارة التعبير عن تطابق الاهتمامات في وقت الراحة",
            ["grammar", "writing"], 2,
            ["Coincidimos", "en", "muchas", "aficiones", "de", "ocio"],
            "Coincidimos en muchas aficiones de ocio",
            "الترتيب: الفعل Coincidimos ثم حرف الجر en ثم الاسم aficiones de ocio.",
            ["coincidir", "afición", "ocio"]
        ),
        choice_ex(
            "ex-a2-cnh-5", "listen_choose",
            "استمع للمحادثة وحدد وقت الراحة المفضل",
            ["listening", "vocabulary"], 2,
            "استمع للحوار وحدد ما يفضله المتحدث لقضاء وقت فراغه",
            "En mi tiempo de ocio me gusta desconectar y pasear por el parque.",
            "في وقت استجمامي يعجبني فصل ذهني والتنزه في الحديقة.",
            [
                opt("a", "ocio", "وقت الاستجمام والراحة (الصواب)", True),
                opt("b", "genial", "رائع", False, "المتحدث حدد وقت استجمامه (ocio) وليس صفة genial."),
                opt("c", "plan", "مخطط عمل", False, "المتحدث قال بوضوح: 'En mi tiempo de ocio'.")
            ],
            ["ocio", "genial", "plan"],
            "المتحدث قال: 'En mi tiempo de ocio me gusta desconectar'.",
            audioKey="pending/a2_ocio_desconectar.mp3",
            speechEs="En mi tiempo de ocio me gusta desconectar y pasear por el parque."
        ),
        speak_ex(
            "ex-a2-cnh-6",
            "انطق موافقتك الودية على الخطة المقترحة",
            ["speaking", "pronunciation"], 2,
            "انطق الجملة التالية بحماس لموافقة صديقك على الخروج:",
            "¡Es un plan genial! Vamos este fin de semana.",
            "إنه مخطط رائع! لنذهب في عطلة نهاية هذا الأسبوع.",
            "pending/a2_plan_genial.mp3",
            ["plan", "genial"],
            "¡Es un plan genial! Vamos este fin de semana.",
            "انتبه لنطق علامتي التعجب بنبرة حماسية ونطق g في genial كـ خاء."
        )
    ]
    return lesson_doc(doc, exs)

# ==============================================================================
# UNIT 9: a2-u9-phone-booking (المكالمات الهاتفية وحجز المواعيد والرسائل)
# ==============================================================================

def make_lesson_llamadas_telefonicas():
    slug = "a2-llamadas-telefonicas"
    doc = {
        "slug": slug,
        "unitSlug": "a2-u9-phone-booking",
        "levelCode": "A2",
        "titleAr": "المكالمات الهاتفية: عبارات الرد والتحية وطلب التحدث لشخص",
        "titleEs": "Llamadas telefónicas y fórmulas de cortesía",
        "subtitleAr": "¿Dígame?, ¿De parte de quién?, ¿Está Carlos?, No se retire",
        "order": 1,
        "estimatedMinutes": 18,
        "cefrLevel": "A2",
        "review": review_block(),
        "pedagogy": {
            "learningObjectivesAr": [
                "أن يرد المتعلم على الهاتف بالعبارات الإسبانية المناسبة رسمياً وغير رسمي: ¡Dígame!, ¡Hola, buenos días!, ¿Sí?.",
                "أن يطلب التحدث مع شخص معين: ¿Está Carmen? / ¿Podría hablar con el señor López?.",
                "أن يسأل عن هوية المتصل بأدب: ¿De parte de quién? / ¿Quién llama, por favor?."
            ],
            "grammarPoints": [
                {
                    "titleAr": "صيغ المحادثات الهاتفية في إسبانيا وأمريكا اللاتينية",
                    "explanationAr": "1. **الرد على الهاتف**:\n- في إسبانيا: **¡Dígame!** (تفضل / نعم - الأكثر شيوعاً) أو **¿Sí? / ¿Diga?**.\n- في المكسيك وأمريكا اللاتينية: **¿Bueno? / ¿Aló?**.\n2. **طلب التحدث لشخص**:\n- غير رسمي: ¿Está Pedro? (هل بيدرو موجود؟).\n- رسمي: ¿Podría ponerme con la señora Martínez, por favor? (هل تفضلت بتحويلي للسيدة مارتينيز؟).\n3. **السؤال عن المتصل والرد**:\n- ¿De parte de quién? (مَن المتصل؟ - حرفياً: من طرف مَن؟).\n- Soy Raúl / De parte de Raúl (أنا راؤول / من طرف راؤول)."
                }
            ],
            "commonMistakesAr": [
                "استخدام Hola كطريقة وحيدة للرد على الهاتف؛ في إسبانيا الرد القياسي عند رفع السماعة هو ¡Dígame! أو ¿Diga?.",
                "ترجمة حرفية لجملة 'أنا فلان' بـ *Yo soy en el teléfono*؛ الصحيح: Soy + الاسم، أو Habla + الاسم."
            ],
            "dialectNotes": [
                {
                    "region": "EG",
                    "noteAr": "في مصر نقول: «ألو، مين معايا؟، فلان موجود؟». بالإسبانية: ¡Dígame! ¿De parte de quién? ¿Está fulano?"
                }
            ],
            "culturalNoteAr": "في بيئة العمل الإسبانية، يبدأ الرد بذكر اسم الشركة متبوعاً بالتحية: 'Empresa Sol, buenos días, ¿en qué puedo ayudarle?'."
        },
        "contentBlocks": [
            {
                "id": f"cb-{slug}-intro",
                "type": "explanation",
                "titleAr": "المفردات الأساسية للمكالمة الهاتفية",
                "bodyAr": "المصطلحات الشائعة:\n- **la llamada**: المكالمة الهاتفية\n- **el teléfono**: الهاتف\n- **contestar**: يرد على الهاتف\n- **comunicar**: مشغول (الخط مشغول: la línea comunica)\n- **poner con**: يحول المكالمة إلى شخص (poner con el director)\n- **el prefijo**: كود الدولة أو المنطقة",
                "examples": [
                    {"es": "—¿Dígame? —Hola, ¿podría hablar con Laura? —Un momento, ahora la pongo.", "ar": "—ألو / تفضل؟ —مرحباً، هل يمكنني التحدث مع لاورا؟ —لحظة، أحولك إليها حالاً."},
                    {"es": "¿De parte de quién, por favor?", "ar": "من المتصل، من فضلك؟"},
                    {"es": "El número comunica; volveré a llamar más tarde.", "ar": "الرقم مشغول؛ سأعاود الاتصال لاحقاً."}
                ]
            }
        ],
        "newVocabulary": ["llamada", "teléfono", "contestar", "comunicar", "poner con", "prefijo"],
        "reviewVocabulary": ["hablar", "momento"]
    }

    exs = [
        choice_ex(
            "ex-a2-tel-1", "word_choice",
            "اختر العبارة الإسبانية القياسية للرد على الهاتف",
            ["vocabulary"], 1,
            "ما هي العبارة الأكثر شيوعاً في إسبانيا عند رفع سماعة الهاتف؟",
            "Suena el teléfono y al descolgar digo: ¡_____!",
            "يرن الهاتف وعند رفع السماعة أقول: ...!",
            [
                opt("a", "Dígame", "تفضل / نعم أسمعك (العبارة القياسية)", True),
                opt("b", "Contestar", "المصدر 'يرد' (غير مناسب كصيغة تحية)", False, "contestar هو اسم الفعل وليس صيغة التحية المنطوقة."),
                opt("c", "Prefijo", "مفتاح الرقم", False, "prefijo يعني كود الدولة ولا يقال كتحية.")
            ],
            ["contestar", "prefijo"],
            "في إسبانيا، الرد القياسي اليومي هو ¡Dígame! أو ¿Diga?."
        ),
        fill_ex(
            "ex-a2-tel-2",
            "أكمل عبارة السؤال عن هوية المتصل",
            ["vocabulary", "writing"], 1,
            "أكمل السؤال بأداة الاستفهام المناسبة: ¿De parte de _____?",
            "¿De parte de _____, por favor?",
            "من المتصل، من فضلك؟",
            ["llamada"],
            ["quién", "quien"],
            "السؤال القياسي هو: ¿De parte de quién? (من المتصل؟)."
        ),
        choice_ex(
            "ex-a2-tel-3", "word_choice",
            "حدد حالة الخط عندما يكون الطرف الآخر يجري مكالمة",
            ["vocabulary"], 2,
            "عندما تتصل ويكون الخط مشغولاً، نقول باللغة الإسبانية:",
            "He intentado llamar al despacho pero la línea _____.",
            "حاولت الاتصال بالمكتب لكن الخط ...",
            [
                opt("a", "comunica", "مشغول (تتوالى نغمات الانشغال)", True),
                opt("b", "contesta", "يرد", False, "لو كان الخط contesta لكان قد رد أحد."),
                opt("c", "pone con", "يحول إلى", False, "لا يستقيم المعنى مع حالة الخط المشغول.")
            ],
            ["comunicar", "contestar", "poner con"],
            "نقول: La línea comunica عندما يكون الهاتف مشغولاً."
        ),
        order_ex(
            "ex-a2-tel-4",
            "رتّب الجملة لطلب تحويل المكالمة إلى المدير بأدب",
            ["grammar", "writing"], 2,
            ["¿Podría", "ponerme", "con", "el", "director?", "gracias"],
            "¿Podría ponerme con el director? gracias",
            "الترتيب: صيغة الرجاء ¿Podría ثم ponerme con ثم الشخص المستهدف ثم الشكر.",
            ["poner con"]
        ),
        choice_ex(
            "ex-a2-tel-5", "listen_choose",
            "استمع وحدد هوية الشخص المطلوب في المكالمة",
            ["listening", "vocabulary"], 2,
            "استمع للمكالمة وحدد مع من يريد المتصل أن يتحدث",
            "Buenos días, ¿está la doctora García en su consulta?",
            "صباح الخير، هل الدكتورة غارثيا موجودة في عيادتها؟",
            [
                opt("a", "teléfono", "هاتف", False, "المتصل يسأل عن شخص محدد في العيادة."),
                opt("b", "llamada", "مكالمة هاتفية", True),
                opt("c", "prefijo", "كود الاتصال", False, "المتصل يجري مكالمة هاتفية مباشرة.")
            ],
            ["teléfono", "llamada", "prefijo"],
            "المتحدث يجري مكالمة هاتفية رسمية للسؤال عن الطبيبة.",
            audioKey="pending/a2_llamada_doctora.mp3",
            speechEs="Buenos días, ¿está la doctora García en su consulta?"
        ),
        speak_ex(
            "ex-a2-tel-6",
            "انطق ردك الرسمي واللبق على الهاتف",
            ["speaking", "pronunciation"], 2,
            "انطق جملة التحويل المؤقت للمكالمة بوضوح:",
            "Un momento, por favor, ahora mismo le pongo con él.",
            "لحظة واحدة من فضلك، سأحولك إليه في الحال.",
            "pending/a2_le_pongo_ahora.mp3",
            ["poner con"],
            "Un momento, por favor, ahora mismo le pongo con él.",
            "انتبه لنطق le pongo con él بسلاسة بدون توقف طويل."
        )
    ]
    return lesson_doc(doc, exs)


def make_lesson_pedir_citas():
    slug = "a2-pedir-citas"
    doc = {
        "slug": slug,
        "unitSlug": "a2-u9-phone-booking",
        "levelCode": "A2",
        "titleAr": "حجز المواعيد وتعديلها: عند الطبيب أو الموظف أو مصفف الشعر",
        "titleEs": "Pedir y modificar citas",
        "subtitleAr": "تحديد اليوم والساعة، تأكيد الحجز، وتغيير الموعد أو إلغاؤه",
        "order": 2,
        "estimatedMinutes": 18,
        "cefrLevel": "A2",
        "review": review_block(),
        "pedagogy": {
            "learningObjectivesAr": [
                "أن يطلب المتعلم موعداً جديداً باللغة الإسبانية: Quería pedir cita con... / Quisiera concertar una cita.",
                "أن يتفاوض حول اليوم والتوقيت المناسب: ¿Le viene bien el martes a las cuatro?.",
                "أن يغير موعداً سابقاً أو يلغيه بلباقة: ¿Sería posible cambiar la cita para el jueves?."
            ],
            "grammarPoints": [
                {
                    "titleAr": "أفعال وتعبيرات حجز وتعديل المواعيد",
                    "explanationAr": "1. **طلب الموعد بأدب**:\n- **Quería / Quisiera** pedir cita para el médico (كنت أود حجز موعد للطبيب - استخدام الماضي الناقص أو صيغة الرجاء للتهذيب).\n2. **التعبير عن ملاءمة الوقت**:\n- **venirle bien/mal a alguien**: ¿Le viene bien el jueves por la mañana? (هل يناسب حضرتك يوم الخميس صباحاً؟) — Sí, me viene perfecto (نعم، يناسبني تماماً).\n3. **تعديل أو إلغاء الموعد**:\n- **cambiar / aplazar**: Me gustaría cambiar la cita para la próxima semana.\n- **anular / cancelar**: Deseo anular mi cita de hoy por un imprevisto."
                }
            ],
            "commonMistakesAr": [
                "استخدام فعل مناسب حرفي بدلاً من venire bien؛ في الإسبانية نقول me viene bien / mal للتعبير عن ملاءمة الموعد.",
                "استخدام المضارع المباشر القاسي Quiero una cita بدلاً من الأسلوب المهذب Quería pedir cita."
            ],
            "dialectNotes": [
                {
                    "region": "EG",
                    "noteAr": "في مصر نقول: «عايز أظبط ميعاد مع الدكتور، هل يناسبك يوم التلات الساعة خمسة؟». بالإسبانية: Quería pedir cita. ¿Te viene bien el martes a las cinco?"
                }
            ],
            "culturalNoteAr": "في معظم المصالح والمراكز الطبية في إسبانيا، يُطلب نظام 'cita previa' (موعد مسبق) إلكترونياً أو هاتفياً قبل الحضور."
        },
        "contentBlocks": [
            {
                "id": f"cb-{slug}-intro",
                "type": "explanation",
                "titleAr": "المفردات الخاصة بالمواعيد",
                "bodyAr": "المصطلحات الأساسية:\n- **la cita**: الموعد المقابل أو الطبي\n- **venir bien**: يناسب الوقت (me viene bien)\n- **aplazar**: يؤجل الموعد لوقت لاحق\n- **anular**: يلغي الموعد نهائياً\n- **confirmar**: يؤكد الحجز والموعد\n- **el hueco**: خانة شاغرة أو وقت متاح في الجدول",
                "examples": [
                    {"es": "Quería pedir cita con el dentista para una revisión.", "ar": "كنت أود حجز موعد مع طبيب الأسنان لإجراء فحص."},
                    {"es": "El miércoles a las cinco me viene muy bien.", "ar": "الأربعاء عند الخامسة يناسبني جداً."},
                    {"es": "Llamo para anular mi cita porque tengo que viajar.", "ar": "أتصل لإلغاء موعدي لأنني مضطر للسفر."}
                ]
            }
        ],
        "newVocabulary": ["cita", "venir bien", "aplazar", "anular", "confirmar", "hueco"],
        "reviewVocabulary": ["cambiar", "hora"]
    }

    exs = [
        choice_ex(
            "ex-a2-cit-1", "word_choice",
            "اختر التعبير المناسب للقول بأن الموعد ملائم لك",
            ["grammar", "vocabulary"], 1,
            "كيف تقول باللغة الإسبانية 'هذا الموعد يناسبني جداً'؟",
            "El viernes por la tarde _____ perfecto para la reunión.",
            "الجمعة بعد الظهر ... تماماً للاجتماع.",
            [
                opt("a", "me viene", "يناسبني وقتاً (الصواب)", True),
                opt("b", "me anula", "يلغيني (غير صحيح)", False, "anular يعني يلغي ولا يعبر عن ملاءمة الموعد."),
                opt("c", "me aplaza", "يؤجلني", False, "aplazar يعني يؤجل.")
            ],
            ["venir bien", "anular", "aplazar"],
            "التعبير هو venir bien للشخص: me viene perfecto."
        ),
        fill_ex(
            "ex-a2-cit-2",
            "أكمل بالفعل الدال على تأكيد الموعد",
            ["vocabulary", "writing"], 1,
            "اكتب الفعل الإسباني الذي يعني 'يؤكد' بصيغة المصدر (confirmar)",
            "Le llamo desde la clínica para _____ su cita de mañana.",
            "أتصل بك من العيادة لتأكيد موعدك غداً.",
            ["confirmar", "cita"],
            ["confirmar"],
            "فعل confirmar يعني يؤكد الموعد أو الحجز."
        ),
        choice_ex(
            "ex-a2-cit-3", "word_choice",
            "حدد معنى إلغاء الموعد بالكامل",
            ["vocabulary"], 2,
            "أي فعل يعني شطب الموعد نهائياً وعدم الحضور؟",
            "No podré asistir a la consulta; tengo que _____ la cita.",
            "لن أتمكن من الحضور للكشف؛ عليّ أن ... الموعد.",
            [
                opt("a", "anular", "يلغي / يشطب الموعد (الصواب)", True),
                opt("b", "confirmar", "يؤكد الحضور", False, "قال إنه لن يتمكن من الحضور."),
                opt("c", "hueco", "وقت شاغر (اسم)", False, "نحتاج فعلاً بعد tengo que وليس اسماً.")
            ],
            ["anular", "confirmar", "hueco", "cita"],
            "فعل anular una cita يعني إلغاء الموعد."
        ),
        order_ex(
            "ex-a2-cit-4",
            "رتّب الجملة لطلب موعد جديد مع الطبيب بتهذيب",
            ["grammar", "writing"], 2,
            ["Quería", "pedir", "cita", "para", "el", "médico"],
            "Quería pedir cita para el médico",
            "الترتيب: صيغة التهذيب Quería ثم المصدر pedir ثم cita ثم الجهة para el médico.",
            ["cita"]
        ),
        choice_ex(
            "ex-a2-cit-5", "listen_choose",
            "استمع وحدد إمكانية وجود خانة شاغرة في الجدول",
            ["listening", "vocabulary"], 2,
            "استمع للموظفة وحدد هل يوجد وقت شاغر في جدول المواعيد",
            "Déjeme mirar la agenda; sí, tenemos un hueco libre el jueves.",
            "دعني أنظر في الأجندة؛ نعم، لدينا وقت شاغر يوم الخميس.",
            [
                opt("a", "hueco", "خانة شاغرة / وقت متاح (الصواب)", True),
                opt("b", "anular", "إلغاء الموعد", False, "الموظفة وجدت وقتاً متاحاً ولم تلغِ الموعد."),
                opt("c", "aplazar", "تأجيل الموعد", False, "الموظفة تعرض موعداً شاغراً.")
            ],
            ["hueco", "anular", "aplazar"],
            "الموظفة قالت: 'tenemos un hueco libre el jueves'.",
            audioKey="pending/a2_hueco_agenda.mp3",
            speechEs="Déjeme mirar la agenda; sí, tenemos un hueco libre el jueves."
        ),
        speak_ex(
            "ex-a2-cit-6",
            "انطق طلبك لتأجيل الموعد لأسبوع قادم",
            ["speaking", "pronunciation"], 2,
            "انطق الجملة التالية بتهذيب ووضوح:",
            "Por favor, ¿podríamos aplazar la cita para la próxima semana?",
            "من فضلك، هل يمكننا تأجيل الموعد للأسبوع القادم؟",
            "pending/a2_aplazar_cita.mp3",
            ["aplazar", "cita"],
            "Por favor, ¿podríamos aplazar la cita para la próxima semana?",
            "انتبه لنطق حرف z في aplazar كنطق الثاء في الإسبانية القشتالية."
        )
    ]
    return lesson_doc(doc, exs)


def make_lesson_mensajes_recados():
    slug = "a2-mensajes-recados"
    doc = {
        "slug": slug,
        "unitSlug": "a2-u9-phone-booking",
        "levelCode": "A2",
        "titleAr": "ترك الرسائل وأخذ الملاحظات: التعامل مع غياب الشخص المطلوب",
        "titleEs": "Dejar recados y tomar notas telefónicas",
        "subtitleAr": "ترك رسالة شفهية، تسجيل رقم الهاتف، وإبلاغ المتصل بتعاود الاتصال",
        "order": 3,
        "estimatedMinutes": 18,
        "cefrLevel": "A2",
        "review": review_block(),
        "pedagogy": {
            "learningObjectivesAr": [
                "أن يترك المتعلم رسالة لشخص غير متاح: ¿Puedo dejarle un recado? / Dígale que he llamado.",
                "أن يأخذ ملاحظات هاتفية للغير: ¿Quiere dejar algún mensaje? / Tomo nota de su número.",
                "أن يعد بإبلاغ الزميل بالاتصال فور عودته: En cuanto llegue, le digo que le llame."
            ],
            "grammarPoints": [
                {
                    "titleAr": "التراكيب المستخدمة في ترك الرسائل الهاتفية",
                    "explanationAr": "1. **عرض أو طلب ترك رسالة**:\n- **dejar un recado**: ¿Quiere dejarle un recado? (هل تود ترك رسالة شفهية له؟) — Sí, por favor, dígale que me llame.\n2. **تدوين البيانات**:\n- **tomar nota**: Tomo nota de su nombre y teléfono (أسجل اسمك ورقم هاتفك).\n3. **الإخبار بالانشغال أو الغياب**:\n- En este momento no está en su mesa (حالياً ليس على مكتبه).\n- Está reunido / Ha salido a comer (هو في اجتماع / خرج لتناول الغداء)."
                }
            ],
            "commonMistakesAr": [
                "الخلط بين mensaje (رسالة عامة أو مكتوبة) و recado (رسالة شفهية شائعة هاتفياً).",
                "قول *yo escribo su teléfono* بدلاً من التعبير الاصطلاحي المهني tomo nota de su teléfono."
            ],
            "dialectNotes": [
                {
                    "region": "EG",
                    "noteAr": "في مصر نقول: «تحب تسيبله رسالة؟ هقوله يكلمك أول ما يرجع». بالإسبانية: ¿Quiere dejarle un recado? Le diré que le llame en cuanto vuelva."
                }
            ],
            "culturalNoteAr": "كلمة 'recado' في إسبانيا هي المصطلح اليومي الأكثر استخداماً للرسائل الهاتفية الشفهية بين الزملاء."
        },
        "contentBlocks": [
            {
                "id": f"cb-{slug}-intro",
                "type": "explanation",
                "titleAr": "مصطلحات الرسائل الهاتفية",
                "bodyAr": "المفردات الأساسية:\n- **el recado**: الرسالة الشفهية\n- **el mensaje**: الرسالة النصية أو العامة\n- **tomar nota**: يدون ملاحظة أو رقماً\n- **reunido**: في اجتماع عمل (estar reunido)\n- **devolver la llamada**: يعاود الاتصال هاتفياً\n- **urgente**: عاجل / طارئ",
                "examples": [
                    {"es": "El señor Gómez está reunido; ¿desea dejarle algún recado?", "ar": "السيد غوميث في اجتماع؛ هل ترغب في ترك أي رسالة له؟"},
                    {"es": "Tomo nota de su teléfono y le diré que le devuelva la llamada.", "ar": "أسجل رقم هاتفك وسأخبره بأن يعاود الاتصال بك."},
                    {"es": "Es un asunto muy urgente; por favor, avísele en cuanto pueda.", "ar": "إنه أمر عاجل جداً؛ من فضلك أبلغه فور استطاعته."}
                ]
            }
        ],
        "newVocabulary": ["recado", "mensaje", "tomar nota", "reunido", "devolver la llamada", "urgente"],
        "reviewVocabulary": ["número", "decir"]
    }

    exs = [
        choice_ex(
            "ex-a2-rec-1", "word_choice",
            "اختر التعبير الإسباني المناسب لترك رسالة شفهية",
            ["vocabulary"], 1,
            "ما هي العبارة القياسية لـ 'ترك رسالة شفهية'؟",
            "Como no está disponible, ¿puedo dejarle un _____?",
            "بما أنه غير متاح، هل يمكنني ترك ... له؟",
            [
                opt("a", "recado", "رسالة شفهية هاتفية (الصواب)", True),
                opt("b", "urgente", "عاجل (صفة)", False, "urgente صفة ولا تأتي مسبوقة بـ un هنا."),
                opt("c", "reunido", "في اجتماع (صفة)", False, "reunido صفة تصف الشخص الغائب.")
            ],
            ["recado", "urgente", "reunido"],
            "التعبير هو dejar un recado (ترك رسالة شفهية)."
        ),
        fill_ex(
            "ex-a2-rec-2",
            "أكمل بالفعل الدال على تدوين وتسجيل الرقم",
            ["vocabulary", "writing"], 1,
            "أكمل التعبير الاصطلاحي لتدوين الملاحظة: (Tomo _____ de su número)",
            "Dígame su teléfono, que tomo _____ ahora mismo.",
            "أخبرني برقمك، وأنا أدونه في الحال.",
            ["tomar nota"],
            ["nota"],
            "التعبير هو tomar nota (يدون ملاحظة)."
        ),
        choice_ex(
            "ex-a2-rec-3", "word_choice",
            "حدد حالة المسؤول عندما يكون في جلسة عمل رسمية",
            ["vocabulary"], 2,
            "إذا كان المدير في قاعة الاجتماعات مع الوفد، نقول:",
            "El jefe no puede ponerse ahora al teléfono porque está _____.",
            "المدير لا يستطيع الرد على الهاتف الآن لأنه ...",
            [
                opt("a", "reunido", "في اجتماع رسمي (الصواب)", True),
                opt("b", "tomar nota", "يدون ملاحظة (مصدر فعل)", False, "يحتاج اسم مفعول/صفة تصف حالته."),
                opt("c", "recado", "رسالة", False, "recado اسم لا يصف الشخص.")
            ],
            ["reunido", "tomar nota", "recado"],
            "نقول: estar reunido (في اجتماع)."
        ),
        order_ex(
            "ex-a2-rec-4",
            "رتّب الجملة لتطلب منه معاودة الاتصال بك",
            ["grammar", "writing"], 2,
            ["Dígale", "que", "me", "devuelva", "la", "llamada"],
            "Dígale que me devuelva la llamada",
            "الترتيب: صيغة الطلب Dígale ثم que ثم الضمير me ثم الفعل devuelva la llamada.",
            ["devolver la llamada"]
        ),
        choice_ex(
            "ex-a2-rec-5", "listen_choose",
            "استمع وحدد درجة أهمية المكالمة",
            ["listening", "vocabulary"], 2,
            "استمع للتسجيل وحدد هل الأمر يحتمل التأجيل أم طارئ",
            "Dígale que me llame cuanto antes, por favor; es un asunto muy urgente.",
            "أخبره بأن يتصل بي في أقرب وقت، من فضلك؛ إنه أمر عاجل جداً.",
            [
                opt("a", "urgente", "عاجل وطارئ (الصواب)", True),
                opt("b", "mensaje", "مجرد رسالة عادية", False, "المتحدث قال بوضوح: 'es un asunto muy urgente'."),
                opt("c", "reunido", "اجتماع", False, "المتحدث يصف درجة أهمية المكالمة وليس المكان.")
            ],
            ["urgente", "mensaje", "reunido"],
            "المتحدث قال: 'es un asunto muy urgente'.",
            audioKey="pending/a2_asunto_urgente.mp3",
            speechEs="Dígale que me llame cuanto antes, por favor; es un asunto muy urgente."
        ),
        speak_ex(
            "ex-a2-rec-6",
            "انطق وعدك بتسجيل البيانات وإبلاغ الزميل",
            ["speaking", "pronunciation"], 2,
            "انطق الجملة التالية باحترافية وهدوء:",
            "He tomado nota de su recado y se lo transmitiré en seguida.",
            "لقد سجلت رسالتك وسأنقلها إليه فوراً.",
            "pending/a2_transmitir_recado.mp3",
            ["recado", "tomar nota"],
            "He tomado nota de su recado y se lo transmitiré en seguida.",
            "انتبه لنطق مقطع guida كـ جيدا مرققة وليس جويدا."
        )
    ]
    return lesson_doc(doc, exs)


def make_lesson_dialogo_reserva():
    slug = "a2-dialogo-reserva"
    doc = {
        "slug": slug,
        "unitSlug": "a2-u9-phone-booking",
        "levelCode": "A2",
        "titleAr": "حوار متكامل: حجز طاولة في مطعم أو غرفة في فندق هاتفياً",
        "titleEs": "Diálogo completo: Reservar mesa o habitación por teléfono",
        "subtitleAr": "تحديد عدد الأفراد، طلب غرفة هادئة، والتأكيد على التفاصيل",
        "order": 4,
        "estimatedMinutes": 18,
        "cefrLevel": "A2",
        "review": review_block(),
        "pedagogy": {
            "learningObjectivesAr": [
                "أن يجري المتعلم مكالمة حجز كاملة لطاولة في مطعم أو غرفة في فندق.",
                "أن يحدد التفاصيل الأساسية: التاريخ، التوقيت، عدد الأفراد (para cuatro personas)، والموقع (en la terraza / con vistas).",
                "أن يطلب تأكيد الحجز باسم المتصل ورقم هاتفه وبريده الإلكتروني."
            ],
            "grammarPoints": [
                {
                    "titleAr": "صيغ الحجز الفندقي والمطعمي بالهاتف",
                    "explanationAr": "1. **الافتتاح وطلب الحجز**:\n- Llamo para reservar una mesa para cenar esta noche (أتصل لحجز طاولة للعشاء هذه الليلة).\n- Quería hacer una reserva de una habitación doble para dos noches.\n2. **تحديد التفاصيل**:\n- ¿Para cuántas personas sería? (لكم فرداً سيكون الحجز؟).\n- ¿A nombre de quién hago la reserva? (باسم مَن أسجل الحجز؟).\n- A nombre de Carlos Gómez, por favor.\n3. **التأكيد والختام**:\n- La reserva queda confirmada para hoy a las nueve (تم تأكيد الحجز لليوم عند التاسعة)."
                }
            ],
            "commonMistakesAr": [
                "نسيان حرف الجر para عند تحديد عدد الأفراد؛ نقول para cuatro personas وليس *a cuatro personas*.",
                "الخلط بين reservar (الفعل: يحجز) و reserva (الاسم: حجز)."
            ],
            "dialectNotes": [
                {
                    "region": "EG",
                    "noteAr": "في مصر نقول: «عايز أحجز ترابيزة لأربعة الساعة تمانية باسم كذا». بالإسبانية: Quería reservar una mesa para cuatro a las ocho a nombre de..."
                }
            ],
            "culturalNoteAr": "في إسبانيا يُفضل الحجز مسبقاً إذا كنت ترغب في الجلوس على الشرفة الخارجية (la terraza)، خصوصاً في ليالي الربيع والصيف."
        },
        "contentBlocks": [
            {
                "id": f"cb-{slug}-intro",
                "type": "explanation",
                "titleAr": "مفردات إجراء الحجز الهاتفي",
                "bodyAr": "المصطلحات الرئيسية:\n- **la reserva**: الحجز\n- **reservar**: يحجز\n- **a nombre de**: باسم (فلان)\n- **la terraza**: الشرفة / التراس الخارجي للمطعم\n- **el comensal**: الضيف / الآكل على المائدة\n- **el número de personas**: عدد الأشخاص",
                "examples": [
                    {"es": "Quisiera reservar una mesa en la terraza para cinco comensales.", "ar": "أود حجز طاولة في الشرفة الخارجية لخمسة أشخاص."},
                    {"es": "¿A nombre de quién dejo la reserva?", "ar": "باسم من أسجل الحجز؟"},
                    {"es": "A nombre del señor Pérez; muchas gracias.", "ar": "باسم السيد بيريث؛ شكراً جزيلاً."}
                ]
            }
        ],
        "newVocabulary": ["reserva", "reservar", "a nombre de", "terraza", "comensal", "número de personas"],
        "reviewVocabulary": ["mesa", "noche"]
    }

    exs = [
        choice_ex(
            "ex-a2-dia-1", "word_choice",
            "اختر العبارة الدالة على تسجيل الحجز باسم العميل",
            ["vocabulary"], 1,
            "كيف يسأل موظف الاستقبال عن اسم صاحب الحجز؟",
            "Muy bien, ¿_____ quién pongo la mesa?",
            "حسناً جداً، باسم من أسجل الطاولة؟",
            [
                opt("a", "a nombre de", "باسم (الصواب)", True),
                opt("b", "a reserva de", "مع التحفظ", False, "التعبير القياسي لتسجيل الأسماء هو a nombre de."),
                opt("c", "en terraza de", "في شرفة", False, "السؤال هنا عن هوية الشخص وليس الموقع.")
            ],
            ["a nombre de", "reserva", "terraza"],
            "نقول: ¿A nombre de quién hago la reserva? (باسم من الحجز؟)."
        ),
        fill_ex(
            "ex-a2-dia-2",
            "أكمل بالفعل المناسب للحجز في صيغة المصدر",
            ["vocabulary", "writing"], 1,
            "اكتب الفعل الإسباني الذي يعني 'يحجز' في المصدر (reservar)",
            "Llamo para _____ una habitación con vistas al mar.",
            "أتصل لحجز غرفة مطلة على البحر.",
            ["reservar"],
            ["reservar"],
            "فعل reservar يعني يحجز طاولة أو غرفة."
        ),
        choice_ex(
            "ex-a2-dia-3", "word_choice",
            "حدد الموقع الخارجي المفضل في المطاعم الإسبانية",
            ["vocabulary"], 2,
            "أين يفضل الناس الجلوس في المطعم خلال الطقس اللطيف؟",
            "Si no hace frío, preferimos cenar al aire libre en la _____.",
            "إذا لم يكن الجو بارداً، نفضل العشاء في الهواء الطلق في ...",
            [
                opt("a", "terraza", "الشرفة / التراس الخارجي (الصواب)", True),
                opt("b", "reserva", "الحجز (اسم العملية)", False, "reserva اسم الحجز ولا يمثل مكاناً للجلوس."),
                opt("c", "número de personas", "عدد الأشخاص", False, "لا يمثل مكاناً للجلوس.")
            ],
            ["terraza", "reserva", "número de personas"],
            "la terraza هي الشرفة أو الجلسة الخارجية في المطعم أو المقهى."
        ),
        order_ex(
            "ex-a2-dia-4",
            "رتّب الجملة لتحديد عدد الأفراد في حجز الطاولة",
            ["grammar", "writing"], 2,
            ["Quería", "una", "mesa", "para", "cuatro", "personas"],
            "Quería una mesa para cuatro personas",
            "الترتيب: صيغة الرجاء Quería ثم una mesa ثم شبه الجملة para cuatro personas.",
            ["número de personas"]
        ),
        choice_ex(
            "ex-a2-dia-5", "listen_choose",
            "استمع للمكالمة وحدد موعد وتفاصيل الحجز",
            ["listening", "vocabulary"], 2,
            "استمع للتسجيل وحدد هل الحجز يخص طاولة أم غرفة",
            "Le confirmo la reserva de una mesa para cenar el viernes a las diez.",
            "أؤكد لك حجز طاولة للعشاء يوم الجمعة عند العاشرة.",
            [
                opt("a", "reserva", "حجز مؤكد (الصواب)", True),
                opt("b", "terraza", "شرفة فقط", False, "الموظف يؤكد عملية الحجز الكاملة (la reserva)."),
                opt("c", "comensal", "ضيف", False, "المتحدث يؤكد حجز الطاولة.")
            ],
            ["reserva", "terraza", "comensal"],
            "الموظف قال: 'Le confirmo la reserva de una mesa'.",
            audioKey="pending/a2_confirmo_reserva.mp3",
            speechEs="Le confirmo la reserva de una mesa para cenar el viernes a las diez."
        ),
        speak_ex(
            "ex-a2-dia-6",
            "انطق جملتك لحجز طاولة لشخصين الليلة",
            ["speaking", "pronunciation"], 2,
            "انطق الجملة التالية بوضوح لموظف المطعم:",
            "Buenas tardes, quería reservar una mesa para dos personas esta noche.",
            "مساء الخير، كنت أود حجز طاولة لشخصين هذه الليلة.",
            "pending/a2_mesa_dos_personas.mp3",
            ["reservar", "número de personas"],
            "Buenas tardes, quería reservar una mesa para dos personas esta noche.",
            "انتبه لنطق r في reservar و personas بنعومة ودقة."
        )
    ]
    return lesson_doc(doc, exs)

# ==============================================================================
# UNIT 10: a2-u10-culture (الثقافة الإسبانية والتقاليد وصيغة se غير المحددة للفاعل)
# ==============================================================================

def make_lesson_fiestas_tradiciones():
    slug = "a2-fiestas-tradiciones"
    doc = {
        "slug": slug,
        "unitSlug": "a2-u10-culture",
        "levelCode": "A2",
        "titleAr": "الأعياد والتقاليد الإسبانية: أشهر المهرجانات والمناسبات الشعبية",
        "titleEs": "Fiestas y tradiciones populares de España",
        "subtitleAr": "Las Fallas, San Fermín, La Tomatina, El Día de Reyes",
        "order": 1,
        "estimatedMinutes": 18,
        "cefrLevel": "A2",
        "review": review_block(),
        "pedagogy": {
            "learningObjectivesAr": [
                "أن يتعرف المتعلم على كبرى الاحتفالات والمهرجانات الشعبية في إسبانيا والعالم الناطق بالإسبانية.",
                "أن يصف طقوس الاحتفال باستخدام أفعال: celebrar, disfrazarse, fuegos artificiales, procesiones.",
                "أن يقارن بين مواعيد وتقاليد الاحتفالات بين المناطق المختلفة."
            ],
            "grammarPoints": [
                {
                    "titleAr": "أفعال وتراكيب التعبير عن الاحتفال والتقاليد",
                    "explanationAr": "1. **أفعال الاحتفال**:\n- **celebrar**: En Valencia se celebran Las Fallas en marzo (في فالنسيا يُحتفل بمهرجان الفاياس في مارس).\n- **festejar**: Festejan la llegada de la primavera con música y flores.\n2. **وصف الأحداث والطقوس**:\n- **tener lugar**: El festival tiene lugar en las calles del centro (يقام المهرجان في شوارع الوسط).\n- **participar en**: Miles de personas participan en La Tomatina de Buñol."
                }
            ],
            "commonMistakesAr": [
                "استخدام فعل hacer بدلاً من celebrar عند الحديث عن المهرجانات (الأفصح: celebrar una fiesta).",
                "الخلط بين Las Fallas (في فالنسيا بمجسمات ضخمة تحرق) و San Fermín (في بامبلونا مع ركض الثيران)."
            ],
            "dialectNotes": [
                {
                    "region": "EG",
                    "noteAr": "في مصر نقول: «بنحتفل بشم النسيم، وفيه مهرجانات وألعاب نارية». بالإسبانية: Celebramos las fiestas con fuegos artificiales y música."
                }
            ],
            "culturalNoteAr": "يوم الملوك المجوس (El Día de Reyes) في 6 يناير هو اليوم التقليدي الأول لتبادل الهدايا العائلية للأطفال في إسبانيا، متقدماً تاريخياً على بابا نويل."
        },
        "contentBlocks": [
            {
                "id": f"cb-{slug}-intro",
                "type": "explanation",
                "titleAr": "أشهر الاحتفالات الإسبانية",
                "bodyAr": "المفردات الثقافية:\n- **la fiesta popular**: العيد الشعبي\n- **la tradición**: التقليد الموروث\n- **celebrar**: يحتفل بـ\n- **los fuegos artificiales**: الألعاب النارية\n- **el disfraz**: الزي التنكري (disfrazarse)\n- **el desfile**: الموكب أو المسيرة الاحتفالية",
                "examples": [
                    {"es": "En marzo se queman los monumentos de Las Fallas en Valencia.", "ar": "في مارس تُحرق مجسمات مهرجان الفاياس في فالنسيا."},
                    {"es": "Durante la fiesta popular hay un desfile impresionante con música.", "ar": "خلال العيد الشعبي هناك موكب مذهل مصحوب بالموسيقى."},
                    {"es": "El cielo de la ciudad se ilumina con fuegos artificiales espectaculares.", "ar": "تضاء سماء المدينة بألعاب نارية مبهرة."}
                ]
            }
        ],
        "newVocabulary": ["fiesta popular", "tradición", "celebrar", "fuegos artificiales", "disfraz", "desfile"],
        "reviewVocabulary": ["año", "calle"]
    }

    exs = [
        choice_ex(
            "ex-a2-fie-1", "word_choice",
            "اختر الفعل المناسب للاحتفال بمناسبة شعبية",
            ["vocabulary"], 1,
            "أي فعل يعني 'يحتفل بـ' في الإسبانية؟",
            "Todos los años los vecinos _____ la llegada de la primavera.",
            "كل عام يحتفل الجيران بقدوم فصل الربيع.",
            [
                opt("a", "celebran", "يحتفلون (الصواب)", True),
                opt("b", "disfraz", "زي تنكري (اسم مفرد)", False, "نحتاج فعلاً مصرفاً للجمع مع los vecinos."),
                opt("c", "desfile", "موكب استعراضي (اسم)", False, "desfile اسم وليس فعلاً مصرفاً.")
            ],
            ["celebrar", "disfraz", "desfile"],
            "فعل celebrar يعني يحتفل: celebran la fiesta."
        ),
        fill_ex(
            "ex-a2-fie-2",
            "أكمل بالكلمة التي تعني التقليد الموروث",
            ["vocabulary", "writing"], 1,
            "اكتب الكلمة الإسبانية المؤنثة التي تعني 'تقليد / عُرف موروث' (la _____)",
            "Comer doce uvas en Nochevieja es una antigua _____ en España.",
            "تناول اثنتي عشرة حبة عنب في ليلة رأس السنة هو تقليد قديم في إسبانيا.",
            ["tradición"],
            ["tradición", "tradicion"],
            "كلمة tradición تعني التقليد أو العرف الثقافي المتوارث."
        ),
        choice_ex(
            "ex-a2-fie-3", "word_choice",
            "حدد ما يضيء سماء المهرجانات في الليل",
            ["vocabulary"], 2,
            "ما هي العروض الضوئية الملونة التي تطلق في ختام الاحتفال؟",
            "A medianoche podemos disfrutar del espectáculo de _____.",
            "في منتصف الليل يمكننا الاستمتاع بعرض ...",
            [
                opt("a", "fuegos artificiales", "الألعاب النارية (الصواب)", True),
                opt("b", "fiesta popular", "العيد الشعبي", False, "عرض ضوئي في السماء يُسمى fuegos artificiales."),
                opt("c", "disfraz", "زي تنكري", False, "disfraz يرتديه الشخص ولا يطلق في السماء.")
            ],
            ["fuegos artificiales", "fiesta popular", "disfraz"],
            "los fuegos artificiales تعني الألعاب النارية الملونة."
        ),
        order_ex(
            "ex-a2-fie-4",
            "رتّب الجملة لوصف موكب الاحتفال في الشوارع",
            ["grammar", "writing"], 2,
            ["El", "desfile", "pasa", "por", "las", "calles", "principales"],
            "El desfile pasa por las calles principales",
            "الترتيب: الفاعل El desfile ثم الفعل pasa ثم شبه الجملة por las calles principales.",
            ["desfile"]
        ),
        choice_ex(
            "ex-a2-fie-5", "listen_choose",
            "استمع للتسجيل وحدد العيد والتقاليد المذكورة",
            ["listening", "vocabulary"], 2,
            "استمع للتسجيل وحدد ما يميز هذه المناسبة الشعبية",
            "La fiesta popular reúne a miles de turistas de todo el mundo.",
            "العيد الشعبي يجمع آلاف السياح من جميع أنحاء العالم.",
            [
                opt("a", "fiesta popular", "المناسبة والعيد الشعبي (الصواب)", True),
                opt("b", "disfraz", "تنكر", False, "المتحدث تحدث عن العيد الشعبي الشامل fiesta popular."),
                opt("c", "fuegos artificiales", "ألعاب نارية فقط", False, "المتحدث ذكر تجمع السياح في العيد الشعبي.")
            ],
            ["fiesta popular", "disfraz", "fuegos artificiales"],
            "المتحدث قال: 'La fiesta popular reúne a miles de turistas'.",
            audioKey="pending/a2_fiesta_popular.mp3",
            speechEs="La fiesta popular reúne a miles de turistas de todo el mundo."
        ),
        speak_ex(
            "ex-a2-fie-6",
            "انطق جملتك عن تقاليد الاحتفال في بلدك",
            ["speaking", "pronunciation"], 2,
            "انطق الجملة التالية بوضوح واعتزاز ثقافي:",
            "Es una tradición muy hermosa que celebramos en familia cada año.",
            "إنه تقليد جميل جداً نحتفل به مع العائلة كل عام.",
            "pending/a2_tradicion_hermosa.mp3",
            ["tradición", "celebrar"],
            "Es una tradición muy hermosa que celebramos en familia cada año.",
            "انتبه لنطق حرف h في hermosa؛ فهو صامت تماماً في الإسبانية."
        )
    ]
    return lesson_doc(doc, exs)


def make_lesson_impersonal_se():
    slug = "a2-impersonal-se"
    doc = {
        "slug": slug,
        "unitSlug": "a2-u10-culture",
        "levelCode": "A2",
        "titleAr": "صيغة التعميم والمبني للمجهول المنعكس بـ Se: القواعد والعادات العامة",
        "titleEs": "El uso impersonal y la pasiva refleja con 'se'",
        "subtitleAr": "Se habla español, se come bien, se celebran fiestas, se prohíbe fumar",
        "order": 2,
        "estimatedMinutes": 18,
        "cefrLevel": "A2",
        "review": review_block(),
        "pedagogy": {
            "learningObjectivesAr": [
                "أن يفهم المتعلم بنية المبني للمجهول المنعكس (Pasiva refleja) مع الأداة se.",
                "أن يطابق الفعل مع الاسم المرفوع بعده في المفرد والجمع: Se habla español / Se hablan varios idiomas.",
                "أن يستخدم صيغة se غير المحددة للفاعل (se impersonal) للتعبير عن القواعد والتعميمات: Se vive bien aquí / En este lugar se trabaja mucho."
            ],
            "grammarPoints": [
                {
                    "titleAr": "المبني للمجهول المنعكس بـ Se (Pasiva Refleja)",
                    "explanationAr": "عندما لا نريد ذكر الفاعل، أو عندما نتحدث عن عادات وقواعد عامة، نستخدم **se** متبوعة بفعل في صيغة الغائب (المفرد أو الجمع):\n1. **مع اسم مفرد**: se + فعل مفرد (-a / -e):\n- **Se habla** español (يُتحدث بالإسبانية / الناس يتحدثون الإسبانية).\n- **Se vende** este piso (تُباع هذه الشقة).\n2. **مع اسم جمع**: se + فعل جمع (-an / -en):\n- **Se hablan** varios idiomas (تُتحدث لغات عدة).\n- **Se venden** pisos (تُباع شقق).\n3. **الصيغة غير المحددة للفاعل (بدون اسم)**:\n- **Se come** muy bien en este restaurante (يؤكل طعام ممتاز هنا / الناس يأكلون جيداً هنا).\n- **Se prohíbe** fumar (يُمنع التدخين)."
                }
            ],
            "commonMistakesAr": [
                "استخدام الفعل في المفرد دائماً حتى لو كان الاسم جمعاً (الخطأ الشائع: *Se habla dos idiomas*، والصواب: Se hablan dos idiomas لأن اللغات فاعل نحوي للفعل المنعكس).",
                "محاولة إضافة فاعل صريح بـ por كما في الإنجليزية (الخطأ: *Se habla español por la gente*؛ صيغة se وُجدت تحديداً لإخفاء الفاعل)."
            ],
            "dialectNotes": [
                {
                    "region": "EG",
                    "noteAr": "في مصر نقول: «هنا بيتكلموا عربي، وفي المطعم ده بتاكل أكل يجنن، وممنوع التدخين». بالإسبانية: Aquí se habla árabe, se come genial, se prohíbe fumar."
                }
            ],
            "culturalNoteAr": "اللافتات والإعلانات العامة في شوارع إسبانيا تعتمد دائماً على se: 'Se alquila', 'Se vende', 'Se prohíbe el paso'."
        },
        "contentBlocks": [
            {
                "id": f"cb-{slug}-intro",
                "type": "explanation",
                "titleAr": "التعبير عن التعميمات بـ Se",
                "bodyAr": "أمثلة شائعة في الحياة اليومية:\n- **se habla**: يُتحدث بـ / الناس يتكلمون\n- **se prohíbe**: يُمنع / محظور\n- **se permite**: يُسمح / مصرح\n- **se acostumbra**: من العادة / يُعتاد\n- **se vende**: معروض للبيع\n- **se alquila**: معروض للإيجار",
                "examples": [
                    {"es": "En España se cena más tarde que en otros países de Europa.", "ar": "في إسبانيا يتعشى الناس في وقت متأخر مقارنة بدول أوروبا الأخرى."},
                    {"es": "Aquí se prohíbe aparcar durante el fin de semana.", "ar": "هنا يُمنع ركن السيارات خلال عطلة نهاية الأسبوع."},
                    {"es": "En esta región se producen vinos de excelente calidad.", "ar": "في هذه المنطقة تُنتج خمور ذات جودة ممتازة."}
                ]
            }
        ],
        "newVocabulary": ["se habla", "se prohíbe", "se permite", "se acostumbra", "se vende", "se alquila"],
        "reviewVocabulary": ["país", "idioma"]
    }

    exs = [
        choice_ex(
            "ex-a2-ips-1", "word_choice",
            "اختر صيغة الفعل المطابقة للاسم الجمع بعد se",
            ["grammar"], 1,
            "أي صيغة نستخدم عند الحديث عن لغات متعددة (idiomas)؟",
            "En Suiza se _____ cuatro lenguas oficiales.",
            "في سويسرا تُتحدث أربع لغات رسمية.",
            [
                opt("a", "hablan", "صيغة الجمع لتطابق lenguas oficiales (الصواب)", True),
                opt("b", "habla", "صيغة مفرد لا تطابق الاسم الجمع lenguas", False, "مع الاسم الجمع يجب أن ينتهي الفعل بـ -n."),
                opt("c", "hablando", "اسم الفاعل المستمر ولا يصح هنا", False, "نحتاج فعلاً مصرفاً في الحاضر البسيط.")
            ],
            ["se habla", "idioma"],
            "في المبني للمجهول المنعكس: se + hablan + cuatro lenguas (الاسم جمع إذن الفعل جمع)."
        ),
        fill_ex(
            "ex-a2-ips-2",
            "أكمل صيغة المنع والحظر الرسمية",
            ["grammar", "writing"], 1,
            "اكتب الفعل الناقص في عبارة المنع الرسمية: Se _____ fumar en lugares públicos",
            "En el hospital se _____ fumar en todas las salas.",
            "في المستشفى يُمنع التدخين في جميع القاعات.",
            ["se prohíbe"],
            ["prohíbe", "prohibe"],
            "العبارة هي: se prohíbe (يُمنع / محظور)."
        ),
        choice_ex(
            "ex-a2-ips-3", "word_choice",
            "حدد لافتة العقار المعروض للبيع",
            ["vocabulary"], 2,
            "ما هي العبارة المكتوبة على الشرفات عندما يكون المنزل معروضاً للبيع؟",
            "Hay un cartel en el balcón que dice: '_____ este piso luminoso'.",
            "يوجد لافتة على الشرفة تقول: '... هذه الشقة المضيئة'.",
            [
                opt("a", "Se vende", "للبيع (الصواب)", True),
                opt("b", "Se prohíbe", "ممنوع", False, "اللافتة لبيع العقار وليس للمنع."),
                opt("c", "Se permite", "مسموح", False, "اللافتة العقارية الشائعة هي Se vende أو Se alquila.")
            ],
            ["se vende", "se prohíbe", "se permite"],
            "اللافتة الشائعة لبيع العقارات هي: Se vende."
        ),
        order_ex(
            "ex-a2-ips-4",
            "رتّب الجملة لوصف جودة المعيشة في إسبانيا بأسلوب التعميم",
            ["grammar", "writing"], 2,
            ["En", "España", "se", "vive", "muy", "bien"],
            "En España se vive muy bien",
            "الترتيب: شبه الجملة الظرفية En España ثم se ثم الفعل vive ثم الظرف muy bien.",
            ["se acostumbra", "país"]
        ),
        choice_ex(
            "ex-a2-ips-5", "listen_choose",
            "استمع للتسجيل وحدد العادة الشائعة في المجتمع",
            ["listening", "vocabulary"], 2,
            "استمع للتسجيل وحدد وقت العشاء المعتاد",
            "En mi ciudad se acostumbra a cenar alrededor de las diez de la noche.",
            "في مدينتي من المعتاد العشاء حوالي العاشرة مساءً.",
            [
                opt("a", "se acostumbra", "من المعتاد / يُعتاد (الصواب)", True),
                opt("b", "se prohíbe", "يُمنع", False, "المتحدث يتحدث عن عادة العشاء وليس المنع."),
                opt("c", "se vende", "للبيع", False, "المتحدث يصف عادة اجتماعية.")
            ],
            ["se acostumbra", "se prohíbe", "se vende"],
            "المتحدث قال: 'se acostumbra a cenar alrededor de las diez'.",
            audioKey="pending/a2_se_acostumbra_cenar.mp3",
            speechEs="En mi ciudad se acostumbra a cenar alrededor de las diez de la noche."
        ),
        speak_ex(
            "ex-a2-ips-6",
            "انطق القاعدة العامة التي تسمح بدخول الحيوانات الأليفة",
            ["speaking", "pronunciation"], 2,
            "انطق الجملة التالية بوضوح وثقة:",
            "En este parque se permite pasear con perros.",
            "في هذه الحديقة يُسمح بالتنزه مع الكلاب.",
            "pending/a2_se_permite_perros.mp3",
            ["se permite"],
            "En este parque se permite pasear con perros.",
            "انتبه لنطق حرف r المكرر في perros بنبرة اهتزازية واضحة."
        )
    ]
    return lesson_doc(doc, exs)


def make_lesson_contrastes_culturales():
    slug = "a2-contrastes-culturales"
    doc = {
        "slug": slug,
        "unitSlug": "a2-u10-culture",
        "levelCode": "A2",
        "titleAr": "الفروق والعادات الثقافية: المواعيد وأوقات الوجبات والقيلولة والحديث بعد الطعام",
        "titleEs": "Contrastes culturales: Horarios, sobremesa y estilo de vida",
        "subtitleAr": "مقارنة نمط الحياة بين العالم العربي وإسبانيا: la sobremesa, los horarios",
        "order": 3,
        "estimatedMinutes": 18,
        "cefrLevel": "A2",
        "review": review_block(),
        "pedagogy": {
            "learningObjectivesAr": [
                "أن يقارن المتعلم بين العادات الاجتماعية وجداول المواعيد اليومية بين الثقافة الإسبانية والعربية.",
                "أن يتعرف على المفاهيم الثقافية الخاصة مثل la sobremesa (جلسة السمر وتبادل الأحاديث بعد الأكل مباشرة).",
                "أن يستخدم أدوات المقارنة للتعبير عن التشابه والاختلاف الثقافي: al igual que, a diferencia de, mientras que."
            ],
            "grammarPoints": [
                {
                    "titleAr": "تراكيب التباين والمقارنة الثقافية",
                    "explanationAr": "1. **التعبير عن التباين والاختلاف**:\n- **a diferencia de**: A diferencia de otros países, en España se come entre las dos y las tres (على عكس دول أخرى، يؤكل الغداء في إسبانيا بين الثانية والثالثة).\n- **mientras que**: En Egipto comemos más temprano, mientras que en España el almuerzo es más tarde.\n2. **التعبير عن التشابه والتوافق**:\n- **al igual que**: Al igual que en los países árabes, la familia es el centro de la vida social en España (تماماً كما في الدول العربية، الأسرة هي محور الحياة الاجتماعية في إسبانيا).\n- **tanto... como...**: Tanto en España como en el mundo árabe disfrutamos de la buena comida."
                }
            ],
            "commonMistakesAr": [
                "اعتبار la sobremesa نوعاً من الحلوى أو الطعام؛ هي اسم للجلسة الحوارية وتبادل الأحاديث الودية حول المائدة بعد الفراغ من تناول الطعام.",
                "استخدام *diferente de* بدلاً من التركيب الظرفي السليم a diferencia de."
            ],
            "dialectNotes": [
                {
                    "region": "EG",
                    "noteAr": "في مصر عندنا «قعدة الشاي والفضفضة بعد الغدا ولمة العيلة». في إسبانيا نفس المفهوم بالظبط وبيسموه la sobremesa."
                }
            ],
            "culturalNoteAr": "الـ sobremesa في إسبانيا قد تمتد لساعة أو ساعتين في عطلة نهاية الأسبوع؛ حيث يتناول الجميع القهوة ويتناقشون بود حول كافة الموضوعات."
        },
        "contentBlocks": [
            {
                "id": f"cb-{slug}-intro",
                "type": "explanation",
                "titleAr": "المفاهيم الثقافية لنمط الحياة",
                "bodyAr": "أهم المفردات الثقافية:\n- **la sobremesa**: جلسة السمر والحديث بعد الطعام حول المائدة\n- **el horario**: جدول المواعيد وتوزيع ساعات اليوم\n- **el contraste**: التباين أو الاختلاف الواضح\n- **a diferencia de**: على عكس / بخلاف\n- **la costumbre**: العادة الاجتماعية\n- **el estilo de vida**: أسلوب ونمط المعيشة",
                "examples": [
                    {"es": "La sobremesa de los domingos dura varias horas con la familia.", "ar": "جلسة ما بعد الغداء أيام الأحد تستمر ساعات عدة مع العائلة."},
                    {"es": "A diferencia del norte de Europa, la vida nocturna en Madrid es muy activa.", "ar": "على عكس شمال أوروبا، الحياة الليلية في مدريد نشطة للغاية."},
                    {"es": "Tenemos un estilo de vida muy cálido y sociable.", "ar": "لدينا أسلوب حياة دافئ جداً واجتماعي."}
                ]
            }
        ],
        "newVocabulary": ["sobremesa", "horario", "contraste", "a diferencia de", "costumbre", "estilo de vida"],
        "reviewVocabulary": ["familia", "comida"]
    }

    exs = [
        choice_ex(
            "ex-a2-con-1", "word_choice",
            "اختر المفهوم الثقافي الإسباني لجلسة الحديث بعد الطعام",
            ["vocabulary"], 1,
            "ما هو المصطلح الإسباني الذي يطلق على التسامر حول المائدة بعد انتهاء الأكل؟",
            "Después de comer nos quedamos charlando durante la _____.",
            "بعد الأكل نبقى نتجاذب أطراف الحديث خلال ...",
            [
                opt("a", "sobremesa", "جلسة ما بعد الطعام (الصواب)", True),
                opt("b", "horario", "جدول المواعيد", False, "horario يعني جدول المواعيد وليس جلسة السمر بعد الأكل."),
                opt("c", "contraste", "تباين واختلاف", False, "contraste يعني تبايناً.")
            ],
            ["sobremesa", "horario", "contraste"],
            "la sobremesa هي العادة الإسبانية الأصيلة للبقاء حول المائدة والحديث بعد الانتهاء من الوجبة."
        ),
        fill_ex(
            "ex-a2-con-2",
            "أكمل عبارة المقارنة الدالة على التباين (a _____ de)",
            ["grammar", "writing"], 1,
            "اكتب الكلمة الناقصة في التعبير الذي يعني 'على عكس / بخلاف': A _____ de",
            "A _____ de otros países, cenamos muy tarde.",
            "على عكس الدول الأخرى، نتعشى في وقت متأخر جداً.",
            ["a diferencia de"],
            ["diferencia"],
            "التركيب هو a diferencia de ويعني على خلاف أو على عكس."
        ),
        choice_ex(
            "ex-a2-con-3", "word_choice",
            "حدد العبارة الدالة على نمط وطريقة العيش اليومية",
            ["vocabulary"], 2,
            "أي مصطلح يعبر عن 'أسلوب الحياة وطريقة العيش'؟",
            "El clima mediterráneo favorece un _____ muy abierto y saludable.",
            "مناخ البحر المتوسط يشجع على ... منفتح وصحي للغاية.",
            [
                opt("a", "estilo de vida", "أسلوب ونمط الحياة (الصواب)", True),
                opt("b", "sobremesa", "جلسة ما بعد الأكل", False, "sobremesa جزء من النمط ولكن التعبير الأشمل هو estilo de vida."),
                opt("c", "horario", "جدول ساعات فقط", False, "المعنى يتطلب نمط المعيشة الشامل.")
            ],
            ["estilo de vida", "sobremesa", "horario"],
            "المصطلح هو el estilo de vida (أسلوب الحياة)."
        ),
        order_ex(
            "ex-a2-con-4",
            "رتّب الجملة لوصف التشابه بين الثقافة العربية والإسبانية في الترابط الأسري",
            ["grammar", "writing"], 2,
            ["La", "familia", "es", "el", "centro", "de", "nuestra", "costumbre"],
            "La familia es el centro de nuestra costumbre",
            "الترتيب: المبتدأ La familia ثم الفعل es ثم الخبر el centro de nuestra costumbre.",
            ["costumbre", "familia"]
        ),
        choice_ex(
            "ex-a2-con-5", "listen_choose",
            "استمع للتسجيل وحدد وقت الغداء المعتاد",
            ["listening", "vocabulary"], 2,
            "استمع للتسجيل وحدد ما يميز جدول المواعيد في إسبانيا",
            "El horario comercial de la tarde suele empezar a las cinco.",
            "جدول مواعيد المتاجر في فترة بعد الظهر يبدأ عادة عند الخامسة.",
            [
                opt("a", "horario", "جدول المواعيد (الصواب)", True),
                opt("b", "sobremesa", "سمر ما بعد الأكل", False, "المتحدث يتحدث عن ساعات فتح المتاجر (el horario comercial)."),
                opt("c", "contraste", "تباين", False, "المتحدث حدد horario المتاجر.")
            ],
            ["horario", "sobremesa", "contraste"],
            "المتحدث قال: 'El horario comercial de la tarde'.",
            audioKey="pending/a2_horario_comercial.mp3",
            speechEs="El horario comercial de la tarde suele empezar a las cinco."
        ),
        speak_ex(
            "ex-a2-con-6",
            "انطق جملتك المقارنة بين عادات المائدة",
            ["speaking", "pronunciation"], 2,
            "انطق الجملة التالية بطلاقة وأسلوب حواري جميل:",
            "Me encanta la sobremesa porque une a la familia después de la comida.",
            "تعجبني جلسة السمر بعد الطعام لأنها توحد العائلة بعد الوجبة.",
            "pending/a2_encanta_sobremesa.mp3",
            ["sobremesa", "familia", "comida"],
            "Me encanta la sobremesa porque une a la familia después de la comida.",
            "انتبه لنطق حرف b في sobremesa وحرف d في después بنعومة."
        )
    ]
    return lesson_doc(doc, exs)


def make_lesson_mi_pais_costumbres():
    slug = "a2-mi-pais-costumbres"
    doc = {
        "slug": slug,
        "unitSlug": "a2-u10-culture",
        "levelCode": "A2",
        "titleAr": "تقديم عرض عن بلدك: التحدث عن عاداتك وتقاليدك ووجباتك للناطقين بالإسبانية",
        "titleEs": "Presentar las costumbres y tradiciones de mi país",
        "subtitleAr": "الضيافة والكرم، الأكلات الشعبية، والمناسبات العائلية باللغة الإسبانية",
        "order": 4,
        "estimatedMinutes": 18,
        "cefrLevel": "A2",
        "review": review_block(),
        "pedagogy": {
            "learningObjectivesAr": [
                "أن يقدم المتعلم عرضاً شفهياً أو كتابياً متكاملاً لوصف عادات بلده الأصلي باللغة الإسبانية.",
                "أن يعبر عن قيم الضيافة والكرم: la hospitalidad, la generosidad, recibir a los invitados.",
                "أن يصف طبقاً تقليدياً ومكوناته الأساسية وطريقة تقديمه في المناسبات."
            ],
            "grammarPoints": [
                {
                    "titleAr": "تراكيب تقديم العروض الثقافية",
                    "explanationAr": "1. **افتتاح العرض**:\n- Hoy voy a hablarles sobre las costumbres más destacadas de mi país (اليوم سأحدثكم عن أبرز عادات بلدي).\n2. **وصف كرم الضيافة**:\n- En mi cultura se valora mucho la hospitalidad (في ثقافتي يُقدّر كرم الضيافة عالياً).\n- Cuando viene un invitado, se le ofrece té con menta y dulces típicos.\n3. **وصف الأكلات التراثية**:\n- El plato más representativo es... y se prepara con... (الطبق الأكثر تمثيلاً هو... ويُحضر بـ...).\n4. **الختام**:\n- En conclusión, les invito a todos a visitar mi país y conocer su rica cultura."
                }
            ],
            "commonMistakesAr": [
                "ترجمة 'كرم الضيافة' حرفياً بكلمات غير اصطلاحية؛ الكلمة الدقيقة المعبرة في الإسبانية هي la hospitalidad.",
                "نسيان se في جمل التعميم الثقافي (الصحيح: En mi país se bebe mucho té، وليس *En mi país bebe mucho té*)."
            ],
            "dialectNotes": [
                {
                    "region": "EG",
                    "noteAr": "في مصر بنقول: «أهم حاجة عندنا كرم الضيافة وواجب الضيف، وبنعمل أكل بيتي أصيل». بالإسبانية: Lo más importante es la hospitalidad con los invitados y la comida casera."
                }
            ],
            "culturalNoteAr": "الحديث عن تقاليد الطهي والضيافة العربية يثير إعجاباً وشغفاً كبيراً لدى الإسبان بسبب الجذور التاريخية المشتركة وتقارب حب التجمع العائلي حول الطعام."
        },
        "contentBlocks": [
            {
                "id": f"cb-{slug}-intro",
                "type": "explanation",
                "titleAr": "مفردات تقديم العرض الثقافي",
                "bodyAr": "المفردات الأساسية:\n- **la hospitalidad**: كرم الضيافة والترحيب بالزائر\n- **el invitado**: الضيف / الزائر المدعو\n- **el plato típico**: الطبق الشعبي أو التقليدي\n- **la generosidad**: السخاء والكرم\n- **destacar**: يبرز / يلفت النظر بتميزه\n- **la riqueza cultural**: الثراء والتنوع الثقافي",
                "examples": [
                    {"es": "La hospitalidad es uno de los valores más profundos de nuestra gente.", "ar": "كرم الضيافة هو أحد أعمق قيم شعبنا."},
                    {"es": "Siempre recibimos a los invitados con una sonrisa y una mesa llena.", "ar": "نستقبل الضيوف دائماً بابتسامة ومائدة عامرة."},
                    {"es": "El plato típico más famoso se prepara a fuego lento con especias.", "ar": "أشهر طبق تقليدي يُطهى على نار هادئة بالتوابل."}
                ]
            }
        ],
        "newVocabulary": ["hospitalidad", "invitado", "plato típico", "generosidad", "destacar", "riqueza cultural"],
        "reviewVocabulary": ["país", "cultura"]
    }

    exs = [
        choice_ex(
            "ex-a2-pai-1", "word_choice",
            "اختر المفردة المعبرة عن كرم الترحيب بالضيوف",
            ["vocabulary"], 1,
            "ما هي القيمة الاجتماعية التي تعني 'كرم الضيافة وحسن الوفادة'؟",
            "En el mundo árabe la _____ es una cualidad sagrada con cualquier visitante.",
            "في العالم العربي ... هي صفة مقدسة مع أي زائر.",
            [
                opt("a", "hospitalidad", "كرم الضيافة (الصواب)", True),
                opt("b", "plato típico", "طبق تقليدي", False, "plato típico يعني طعاماً وليس صفة الضيافة."),
                opt("c", "destacar", "يبرز (فعل)", False, "نحتاج اسماً مؤنثاً بعد أداة التعريف la.")
            ],
            ["hospitalidad", "plato típico", "destacar"],
            "la hospitalidad تعني كرم الضيافة وحسن استقبال الغريب والزائر."
        ),
        fill_ex(
            "ex-a2-pai-2",
            "أكمل بالكلمة التي تعني 'الضيف'",
            ["vocabulary", "writing"], 1,
            "اكتب الكلمة الإسبانية المذكرة التي تعني 'الضيف المدعو' (el _____)",
            "Tratamos a cada _____ como si fuera un miembro de la familia.",
            "نعامل كل ضيف كما لو كان فرداً من العائلة.",
            ["invitado"],
            ["invitado"],
            "كلمة invitado تعني الضيف أو الزائر المدعو."
        ),
        choice_ex(
            "ex-a2-pai-3", "word_choice",
            "حدد التعبير الدال على الطعام الشعبي والتراثي للبلد",
            ["vocabulary"], 2,
            "كيف نطلق على الأكلة الشعبية المميزة لبلد ما؟",
            "El cuscús o el koshari es el _____ más representativo de nuestra cocina.",
            "الكسكسي أو الكشري هو ... الأكثر تمثيلاً لمطبخنا.",
            [
                opt("a", "plato típico", "الطبق التقليدي الشعبي (الصواب)", True),
                opt("b", "generosidad", "الكرم والسخاء", False, "الكسكسي أو الكشري طعام (plato) وليس صفة الكرم."),
                opt("c", "hospitalidad", "الضيافة", False, "المعنى يتعلق بالوجبة الغذائية.")
            ],
            ["plato típico", "generosidad", "hospitalidad"],
            "un plato típico يعني طبقاً شعبياً أو أكلة تراثية مميزة."
        ),
        order_ex(
            "ex-a2-pai-4",
            "رتّب الجملة لافتتاح العرض التعريفي بثقافة بلدك",
            ["grammar", "writing"], 2,
            ["Hoy", "voy", "a", "presentar", "la", "cultura", "de", "mi", "país"],
            "Hoy voy a presentar la cultura de mi país",
            "الترتيب: الظرف Hoy ثم المستقبل القريب voy a presentar ثم المفعول la cultura de mi país.",
            ["riqueza cultural", "país", "cultura"]
        ),
        choice_ex(
            "ex-a2-pai-5", "listen_choose",
            "استمع للتسجيل وحدد السمة الأبرز لثقافة المتحدث",
            ["listening", "vocabulary"], 2,
            "استمع للتسجيل وحدد ما يميز الشعب حسب حديث المتكلم",
            "La generosidad de nuestra gente se nota en el trato diario y en las fiestas.",
            "كرم شعبنا يظهر بوضوح في التعامل اليومي وفي الاحتفالات.",
            [
                opt("a", "generosidad", "الكرم والسخاء (الصواب)", True),
                opt("b", "plato típico", "طبق الطعام فقط", False, "المتحدث تحدث عن سمة الكرم وسخاء الناس."),
                opt("c", "destacar", "يبرز", False, "المتحدث حدد صفة generosidad.")
            ],
            ["generosidad", "plato típico", "destacar"],
            "المتحدث قال: 'La generosidad de nuestra gente se nota'.",
            audioKey="pending/a2_generosidad_gente.mp3",
            speechEs="La generosidad de nuestra gente se nota en el trato diario y en las fiestas."
        ),
        speak_ex(
            "ex-a2-pai-6",
            "انطق دعوتك للآخرين لزيارة بلدك والتعرف على كرم أهله",
            ["speaking", "pronunciation"], 2,
            "انطق جملة الختام الدافئة والمرحبة:",
            "Les invito a conocer mi país y disfrutar de nuestra gran hospitalidad.",
            "أدعوكم للتعرف على بلدي والاستمتاع بكرم ضيافتنا الكبير.",
            "pending/a2_invito_hospitalidad.mp3",
            ["hospitalidad", "país"],
            "Les invito a conocer mi país y disfrutar de nuestra gran hospitalidad.",
            "انتبه لنطق حرف d في disfrutar كـ دال صريحة ونطق h في hospitalidad كحرف صامت."
        )
    ]
    return lesson_doc(doc, exs)
