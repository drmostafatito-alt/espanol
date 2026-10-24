# -*- coding: utf-8 -*-
"""B1 Units 9 (Relationships & Subjunctive of Feelings/Wishes) and 10 (Formal Writing & Connectors).
8 Lessons completing 100% of Level B1 based on:
- Aula Plus 3 (Unidades 5 & 6)
- Gramática del uso del español A1-B2 (Capítulos 78-85: Subjuntivo con sentimientos y deseos; Capítulos 110-115: Conectores discursivos)
- Español 2000 Nivel Intermedio (Lecciones de relaciones, cartas formales y conectores)
- المرشد في اللغة الأسبانية (أسلوب التمني بـ ojalá، أفعال المشاعر بالمنصوب، وصيغ المراسلات الرسمية)
"""
import sys, os
sys.path.insert(0, os.path.dirname(__file__))
from common import opt, choice_ex, fill_ex, order_ex, speak_ex, lesson_doc, review_block

# ==============================================================================
# UNIT 9: b1-u9-relationships (العلاقات الإنسانية والتمني والمشاعر بالمنصوب)
# ==============================================================================

def make_lesson_relaciones_personales():
    slug = "b1-relaciones-personales"
    doc = {
        "slug": slug,
        "unitSlug": "b1-u9-relationships",
        "levelCode": "B1",
        "titleAr": "العلاقات الإنسانية والروابط الاجتماعية: الصداقة والانسجام والتعاطف",
        "titleEs": "Relaciones personales, la empatía y los lazos sociales",
        "subtitleAr": "التعبير عن الانسجام (llevarse bien)، الثقة (confiar en)، والذكاء العاطفي",
        "order": 1,
        "estimatedMinutes": 18,
        "cefrLevel": "B1",
        "review": review_block(),
        "pedagogy": {
            "learningObjectivesAr": [
                "أن يصف المتعلم طبيعة علاقاته الشخصية والمهنية مع الآخرين بأسلوب غني ودقيق.",
                "أن يستخدم الأفعال الاصطلاحية للعلاقات: llevarse bien/mal con, confiar en, contar con alguien.",
                "أن يعبر عن قيم التعاطف (la empatía) والتفاهم المتبادل والصدق في التعامل."
            ],
            "grammarPoints": [
                {
                    "titleAr": "أفعال وتراكيب العلاقات الإنسانية",
                    "explanationAr": "1. **التعبير عن التوافق والانسجام**:\n- **Llevarse bien / mal con**: Me llevo genial con mis compañeros de piso (أنسجم تماماً مع رفقاء سكني).\n- **Tener química / Congeniar**: Congeniamos desde el primer momento en que nos conocimos.\n2. **الثقة والاعتماد على الآخر**:\n- **Confiar en**: Confío plenamente en mi mejor amigo (أثق تماماً في صديقي المفضل - لاحظ حرف الجر en).\n- **Contar con**: Puedes contar conmigo para lo que necesites (يمكنك الاعتماد عليّ).\n3. **الذكاء الاجتماعي**:\n- **Ponerse en el lugar del otro**: La empatía consiste en ponerse en el lugar de los demás."
                }
            ],
            "commonMistakesAr": [
                "استخدام حرف الجر a بعد confiar بدلاً من en (الخطأ: *Confío a ti*؛ الصواب الحتمي: Confío en ti).",
                "ترجمة 'ينسجم' بـ *hacer armonía*؛ التعبير الاصطلاحي الإسباني السليم هو llevarse bien con alguien."
            ],
            "dialectNotes": [
                {
                    "region": "EG",
                    "noteAr": "في مصر بنقول: «أنا برتاح لفلان أوي، على وفاق معاه وبثق فيه ومقدر أعتمد عليه في أي وقت». بالإسبانية: Me llevo muy bien con él, confío en él y puedo contar con él."
                }
            ],
            "culturalNoteAr": "الصداقة في الثقافة الإسبانية ذات قيمة عالية ومبنية على اللقاءات الدورية والعفوية وتشارك الوجبات الطويلة والحديث الصريح والمباشر."
        },
        "contentBlocks": [
            {
                "id": f"cb-{slug}-intro",
                "type": "explanation",
                "titleAr": "مصطلحات الروابط الاجتماعية",
                "bodyAr": "المفردات الأساسية:\n- **llevarse bien**: ينسجم مع ويكون على وفاق طيب\n- **confiar en**: يثق في شخص أو جهة\n- **la empatía**: التعاطف والقدرة على فهم مشاعر الآخرين\n- **el vínculo**: الرابطة أو الصلة الوثيقة\n- **contar con**: يعتمد على شخص ويجده وقت الشدة\n- **la sinceridad**: الصدق والصراحة في القول",
                "examples": [
                    {"es": "Me llevo muy bien con mis colegas de trabajo y hay un gran ambiente.", "ar": "أنسجم جيداً مع زملائي في العمل وهناك أجواء ممتازة."},
                    {"es": "Es un amigo fiel en quien siempre se puede confiar plenamente.", "ar": "إنه صديق مخلص يمكن الوثوق به دائماً بكل اطمئنان."},
                    {"es": "La empatía y la sinceridad fortalecen los vínculos de amistad.", "ar": "التعاطف والصراحة يقويان روابط الصداقة."}
                ]
            }
        ],
        "newVocabulary": ["llevarse bien", "confiar en", "empatía", "vínculo", "contar con", "sinceridad"],
        "reviewVocabulary": ["amigo", "persona"]
    }

    exs = [
        choice_ex(
            "ex-b1-rel-1", "word_choice",
            "اختر حرف الجر الإلزامي مع فعل الثقة confiar",
            ["grammar"], 1,
            "أي حرف جر يأتي دائماً بعد الفعل confiar للتعبير عن الثقة بشخص؟",
            "Es una persona íntegra y todos podemos confiar _____ ella.",
            "إنه إنسان نزيه ويمكننا جميعاً الوثوق ...",
            [
                opt("a", "en", "حرف الجر الإلزامي مع confiar (الصواب)", True),
                opt("b", "a", "خطأ ترجمة حرفية", False, "فعل confiar يأخذ دائماً حرف الجر en: confiar en alguien."),
                opt("c", "con", "خطأ شائع", False, "التركيب الصحيح هو confiar en.")
            ],
            ["confiar en", "persona"],
            "نقول دائماً: confiar en alguien (يثق في شخص)."
        ),
        fill_ex(
            "ex-b1-rel-2",
            "أكمل بالمصطلح الذي يعني القدرة على فهم مشاعر الآخرين (la _____)",
            ["vocabulary", "writing"], 1,
            "اكتب الكلمة الإسبانية المؤنثة التي تعني 'التعاطف ووضع النفس مكان الآخر' (la _____)",
            "La _____ es fundamental para resolver cualquier conflicto interpersonal.",
            "التعاطف أساسي لحل أي خلاف بين الأفراد.",
            ["empatía"],
            ["empatía", "empatia"],
            "كلمة empatía تعني التعاطف وتفهم مشاعر وظروف الآخرين."
        ),
        choice_ex(
            "ex-b1-rel-3", "word_choice",
            "حدد التعبير الدال على التوافق والانسجام التام بين الأصدقاء",
            ["vocabulary"], 2,
            "ما هو الفعل الاصطلاحي الذي يعني 'يكون على وفاق ممتاز مع غيره'؟",
            "Mis dos hermanos se _____ muy bien y nunca se pelean.",
            "أخواي ... جيداً جداً ولا يتشاجران أبداً.",
            [
                opt("a", "llevan", "ينسجمان على وفاق (الصواب: llevarse bien)", True),
                opt("b", "cuentan", "يعدان", False, "التعبير عن الوفاق هو llevarse bien."),
                opt("c", "confían", "يثقان فقط", False, "سياق عدم الشجار والوفاق التام يعبر عنه بـ llevarse bien.")
            ],
            ["llevarse bien", "contar con", "confiar en"],
            "التعبير هو llevarse bien مع الآخرين للتعبير عن حسن الوفاق والتناغم."
        ),
        order_ex(
            "ex-b1-rel-4",
            "رتّب الجملة للتأكيد على إمكانية الاعتماد على الصديق وقت الضيق",
            ["grammar", "writing"], 2,
            ["Siempre", "puedes", "contar", "con", "mi", "apoyo", "total"],
            "Siempre puedes contar con mi apoyo total",
            "الترتيب: الظرف Siempre ثم الفعل puedes contar con ثم المفعول mi apoyo total.",
            ["contar con"]
        ),
        choice_ex(
            "ex-b1-rel-5", "listen_choose",
            "استمع للتسجيل وحدد الرابطة القوية التي تجمع الزملاء",
            ["listening", "vocabulary"], 2,
            "استمع للمتحدث يصف علاقته بفريق العمل",
            "Entre nosotros existe un vínculo muy estrecho basado en la sinceridad.",
            "بيننا رابطة وثيقة جداً قائمة على الصدق والصراحة.",
            [
                opt("a", "vínculo", "الرابطة والصلة الإنسانية (الصواب)", True),
                opt("b", "confiar en", "ثقة فعلية فقط", False, "المتحدث وصف الرابطة القائمة بين الفريق (el vínculo)."),
                opt("c", "empatía", "تعاطف", False, "المتحدث حدد: 'un vínculo muy estrecho'.")
            ],
            ["vínculo", "sinceridad", "confiar en", "empatía"],
            "المتحدث قال: 'existe un vínculo muy estrecho basado en la sinceridad'.",
            audioKey="pending/b1_vinculo_estrecho_sinceridad.mp3",
            speechEs="Entre nosotros existe un vínculo muy estrecho basado en la sinceridad."
        ),
        speak_ex(
            "ex-b1-rel-6",
            "انطق جملتك التعبيرية عن قيمة الصدق والانسجام في الصداقة",
            ["speaking", "pronunciation"], 2,
            "انطق الجملة التالية بأسلوب دافئ ومخلص لصديقك:",
            "Me llevo muy bien contigo porque valoro tu sinceridad y empatía.",
            "أنسجم معك تماماً لأنني أقدر صدقك وتعاطفك.",
            "pending/b1_llevo_bien_sinceridad.mp3",
            ["llevarse bien", "sinceridad", "empatía"],
            "Me llevo muy bien contigo porque valoro tu sinceridad y empatía.",
            "انتبه لنطق حرف v في valoro كصوت شفوي ناعم ونطق con-ti-go بسلاسة."
        )
    ]
    return lesson_doc(doc, exs, level="B1")


def make_lesson_subjuntivo_sentimientos():
    slug = "b1-subjuntivo-sentimientos"
    doc = {
        "slug": slug,
        "unitSlug": "b1-u9-relationships",
        "levelCode": "B1",
        "titleAr": "المنصوب مع أفعال المشاعر والعواطف: Me alegra que و Temo que و Me da pena que",
        "titleEs": "El subjuntivo con verbos de sentimiento, emoción y temor",
        "subtitleAr": "التعبير عن الفرح والحزن والخوف والدهشة تجاه تصرفات الآخرين",
        "order": 2,
        "estimatedMinutes": 18,
        "cefrLevel": "B1",
        "review": review_block(),
        "pedagogy": {
            "learningObjectivesAr": [
                "أن يطبق المتعلم قاعدة المنصوب (Subjuntivo) الإلزامية بعد أفعال وعبارات المشاعر والعواطف.",
                "أن يعبر عن الفرح (me alegra que)، والحزن (me entristece que / me da pena que)، والخوف (temo que).",
                "أن يفرق بدقة بين استخدام المصدر (عند وحدة الفاعل) واستخدام المنصوب (عند اختلاف الفاعل)."
            ],
            "grammarPoints": [
                {
                    "titleAr": "قاعدة المنصوب مع أفعال المشاعر والعاطفة",
                    "explanationAr": "عندما نعبر عن مشاعرنا تجاه حدث يقوم به فاعل آخر، نستخدم **que + المنصوب (Subjuntivo)** حتماً:\n1. **أفعال الفرح والرضا**:\n- **Me alegra que** hayas aprobado el examen (يسعدني أنك نجحت في الامتحان).\n- **Me encanta que** vengas a visitarme.\n2. **أفعال الحزن والأسف**:\n- **Me da pena / lástima que** no puedas venir a la boda (يؤسفني ويحزنني ألا تتمكن من الحضور).\n- **Siento mucho que** estés enfermo.\n3. **أفعال الخوف والخشية**:\n- **Temo que / Tengo miedo de que** llueva mañana (أخشى أن تمطر غداً).\n4. **القاعدة الحاكمة للمصدر**:\n- إذا كان الفاعل واحداً، نستخدم **المصدر** فقط بدون que:\n  * Me alegro de **estar** aquí (أنا فاعل الفرح وأنا الحاضر).\n  * Me alegra que **estés** aquí (أنا فرح بحضورك أنت)."
                }
            ],
            "commonMistakesAr": [
                "استخدام المضارع الإخباري بعد me alegra que (الخطأ الشائع: *Me alegra que vienes*؛ الصواب: Me alegra que vengas بالمنصوب).",
                "وضع que عندما يكون الفاعل هو نفسه (الخطأ: *Me alegro que yo voy*؛ الصواب: Me alegro de ir بالمصدر)."
            ],
            "dialectNotes": [
                {
                    "region": "EG",
                    "noteAr": "في مصر بنقول: «فرحان أوي إنك جيت، وزعلان إنك ماشي بدري، وخايف الجو يمطر». بالإسبانية: Me alegra que hayas venido, me da pena que te vayas y temo que llueva."
                }
            ],
            "culturalNoteAr": "الإسبان شعب عاطفي واجتماعي جداً، وتعبيرات مثل '¡Me alegro un montón de que...!' أو '¡Qué pena que...!' تتردد باستمرار في التفاعل اليومي الصادق."
        },
        "contentBlocks": [
            {
                "id": f"cb-{slug}-intro",
                "type": "explanation",
                "titleAr": "تراكيب التعبير عن المشاعر العاطفية",
                "bodyAr": "أهم التراكيب:\n- **me alegra que**: يسعدني ويفرحني أن (+ منصُوب)\n- **me da pena que**: يؤسفني ويحزنني أن (+ منصُوب)\n- **temo que**: أخشى وأخاف أن (+ منصُوب)\n- **me sorprende que**: يدهشني ويثير تعجبي أن (+ منصُوب)\n- **el sentimiento**: الشعور أو الإحساس العاطفي\n- **la emoción**: العاطفة والانفعال الإيجابي",
                "examples": [
                    {"es": "Me alegra que compartas tus éxitos con nosotros.", "ar": "يسعدني أن تشارك نجاحاتك معنا (المنصوب: compartas)."},
                    {"es": "Me da pena que tengamos que despedirnos tan pronto.", "ar": "يحزنني أن نضطر للوداع بهذه السرعة (المنصوب: tengamos)."},
                    {"es": "Temo que los billetes se agoten antes de comprarlos.", "ar": "أخشى أن تنفد التذاكر قبل أن نشتريها (المنصوب: se agoten)."}
                ]
            }
        ],
        "newVocabulary": ["me alegra que", "me da pena que", "temo que", "me sorprende que", "sentimiento", "emoción"],
        "reviewVocabulary": ["feliz", "miedo"]
    }

    exs = [
        choice_ex(
            "ex-b1-sen-1", "word_choice",
            "اختر صيغة المنصوب الصحيحة بعد تعبير الفرح me alegra que",
            ["grammar"], 1,
            "أي تصريف لفعل conseguir نستخدم بعد عبارة المشاعر Me alegra que؟",
            "Me alegra mucho que tú _____ ese puesto de trabajo tan deseado.",
            "يسعدني كثيراً أن ... على ذلك المنصب الوظيفي المنشود.",
            [
                opt("a", "consigas", "صيغة المنصوب مع tú (الصواب بعد me alegra que)", True),
                opt("b", "consigues", "مضارع إخباري لا يصح بعد أفعال المشاعر", False, "تراكيب المشاعر والعواطف تفرض صيغة المنصوب Subjuntivo."),
                opt("c", "conseguir", "مصدر لا يناسب وجود الفاعل tú", False, "لاختلاف الفاعل يجب تصريف الفعل بالمنصوب.")
            ],
            ["me alegra que", "sentimiento"],
            "بعد عبارات المشاعر والفرح me alegra que نستخدم دائماً المنصوب: me alegra que consigas."
        ),
        fill_ex(
            "ex-b1-sen-2",
            "صرف فعل poder بالمنصوب المخاطب بعد me da pena que: (puedas)",
            ["grammar", "writing"], 1,
            "اكتب صيغة المنصوب من الفعل poder مع tú بعد me da pena que: (puedas)",
            "Me da mucha pena que no _____ venir con nosotros al concierto.",
            "يؤسفني كثيراً ألا تتمكن من القدوم معنا إلى الحفل الموسيقي.",
            ["me da pena que"],
            ["puedas"],
            "بعد me da pena que يأتي الفعل في صيغة المنصوب: puedas."
        ),
        choice_ex(
            "ex-b1-sen-3", "word_choice",
            "حدد التعبير الدال على الخوف والخشية من وقوع أمر سلبي",
            ["vocabulary", "grammar"], 2,
            "أي تعبير يدل على الخشية والتوجس متبوعاً بالمنصوب؟",
            "_____ que el mal tiempo arruine nuestras vacaciones en la playa.",
            "... أن يفسد الطقس السيئ عطلتنا على الشاطئ.",
            [
                opt("a", "Temo que", "أخشى أن (الصواب)", True),
                opt("b", "Me alegra que", "يسعدني أن (معنى متناقض)", False, "فساد العطلة أمر مؤسف يثير الخشية (temo que)."),
                opt("c", "Es seguro que", "من المؤكد أن (تأخذ إخبارياً)", False, "السياق يدل على التوجس والخشية من الاحتمال.")
            ],
            ["temo que", "me alegra que", "miedo"],
            "Temo que تعني أخشى أو أخاف أن، وتأخذ دائماً صيغة المنصوب: temo que arruine."
        ),
        order_ex(
            "ex-b1-sen-4",
            "رتّب الجملة للتعبير عن الدهشة والتعجب بالمنصوب",
            ["grammar", "writing"], 2,
            ["Me", "sorprende", "que", "hables", "español", "tan", "bien"],
            "Me sorprende que hables español tan bien",
            "الترتيب: عبارة الدهشة Me sorprende que ثم المنصوب hables ثم español tan bien.",
            ["me sorprende que", "emoción"]
        ),
        choice_ex(
            "ex-b1-sen-5", "listen_choose",
            "استمع للتسجيل وحدد الشعور العاطفي الذي يعبر عنه المتحدث",
            ["listening", "grammar"], 2,
            "استمع لرد فعل المتحدث عند سماع خبر ترقية صديقه",
            "¡Qué alegría! Me alegra que hayas alcanzado tu sueño profesional.",
            "يا لها من فرحة! يسعدني أنك بلغت حلمك المهني.",
            [
                opt("a", "me alegra que", "تعبير عن الفرح والسرور بالمنصوب (الصواب)", True),
                opt("b", "temo que", "خشية وخوف", False, "المتحدث يعبر عن الفرح والتهنئة (Me alegra que)."),
                opt("c", "me da pena que", "حزن وأسف", False, "السياق تهنئة حارة على النجاح.")
            ],
            ["me alegra que", "temo que", "me da pena que", "feliz"],
            "المتحدث قال بحماس: 'Me alegra que hayas alcanzado tu sueño'.",
            audioKey="pending/b1_alegra_alcanzado_sueno.mp3",
            speechEs="¡Qué alegría! Me alegra que hayas alcanzado tu sueño profesional."
        ),
        speak_ex(
            "ex-b1-sen-6",
            "انطق تهنئتك الدافئة لصديقك بالمنصوب",
            ["speaking", "pronunciation"], 2,
            "انطق الجملة التالية بابتسامة ونبرة فرح واضحة لصديقك:",
            "Me alegra mucho que todo te vaya tan bien en tu nueva vida.",
            "يسعدني كثيراً أن كل شيء يسير معك على نحو ممتاز في حياتك الجديدة.",
            "pending/b1_alegra_todo_vaya_bien.mp3",
            ["me alegra que", "sentimiento"],
            "Me alegra mucho que todo te vaya tan bien en tu nueva vida.",
            "انتبه لنطق صيغة المنصوب vaya كـ بايا مرققة ونبرة الصوت الإيجابية."
        )
    ]
    return lesson_doc(doc, exs, level="B1")


def make_lesson_ojala_deseos():
    slug = "b1-ojala-deseos"
    doc = {
        "slug": slug,
        "unitSlug": "b1-u9-relationships",
        "levelCode": "B1",
        "titleAr": "أسلوب التمني والدعاء: استخدام Ojalá و Deseo que مع المنصوب",
        "titleEs": "Expresar deseos y anhelos con '¡Ojalá!' y el subjuntivo",
        "subtitleAr": "الأصل العربي لكلمة Ojalá، وتمني الحاضر والمستقبل، وصيغ الدعاء الإيجابي",
        "order": 3,
        "estimatedMinutes": 18,
        "cefrLevel": "B1",
        "review": review_block(),
        "pedagogy": {
            "learningObjectivesAr": [
                "أن يطبق المتعلم أسلوب التمني بأداة ¡Ojalá! وصيغ المنصوب المرتبطة بها.",
                "أن يتعرف على الجذر التاريخي العربي لأداة Ojalá (إن شاء الله / لو شاء الله) واستمرار روحها التمنية في الإسبانية.",
                "أن يعبر عن أمنياته للآخرين في المناسبات السعيدة: ¡Que te vaya bien!, ¡Que cumplas muchos más!, ¡Que descanses!."
            ],
            "grammarPoints": [
                {
                    "titleAr": "قواعد أداة التمني Ojalá وصيغ التمني بـ Que",
                    "explanationAr": "1. **أداة التمني ¡Ojalá!**:\n- تأخذ دائماً صيغة **المنصوب (Subjuntivo)** حصراً:\n  * تمني أمر ممكن في الحاضر أو المستقبل: **Ojalá + Presente de subjuntivo**:\n    - ¡Ojalá **tengas** mucha suerte! (يا ليتك توفق! / إن شاء الله يوفقك الحظ!).\n    - ¡Ojalá **haga** buen tiempo este fin de semana!\n2. **أفعال التمني (Desear / Esperar que + Subjuntivo)**:\n- Deseo que **seáis** muy felices (أتمنى أن تكونوا سعداء جداً).\n- Espero que todo **salga** a la perfección.\n3. **صيغ الدعاء المختصرة بـ ¡Que...! (مع حذف فعل أتمنى)**:\n- ¡Que **tengas** un buen día! (يوماً طيباً لك!).\n- ¡Que te **mejores** pronto! (بالشفاء العاجل!).\n- ¡Que **aproveche**! (بالهناء والشفاء / صحة وهنا عند الطعام)."
                }
            ],
            "commonMistakesAr": [
                "استخدام المضارع الإخباري بعد Ojalá (الخطأ الفادح: *¡Ojalá tienes suerte!*؛ الصواب الحتمي: ¡Ojalá tengas suerte!).",
                "نسيان صيغة المنصوب في عبارات التهنئة اليومية مثل ¡Que descanses! و ¡Que te mejores!."
            ],
            "dialectNotes": [
                {
                    "region": "EG",
                    "noteAr": "في مصر بنقول: «يا رب تنجح، وإن شاء الله تروق وتبقى كويس، وألف هنا وشفا». بالإسبانية: ¡Ojalá apruebes!, ¡Que te mejores pronto! y ¡Que aproveche!"
                }
            ],
            "culturalNoteAr": "كلمة 'Ojalá' دخلت الإسبانية من العبارة العربية الأندلسية 'لو شاء الله' أو 'إن شاء الله'، وتعتبر من أجمل شواهد التمازج الحضاري واللغوي في شبه الجزيرة الإيبيرية."
        },
        "contentBlocks": [
            {
                "id": f"cb-{slug}-intro",
                "type": "explanation",
                "titleAr": "صيغ التمني والدعاء في الثقافة الإسبانية",
                "bodyAr": "أهم العبارات:\n- **¡ojalá!**: يا رب / يا ليت / لو شاء الله (+ Subjuntivo دائماً!)\n- **desear que**: يتمنى أن (+ Subjuntivo)\n- **esperar que**: يأمل ويرجو أن (+ Subjuntivo)\n- **¡que te mejores!**: بالشفاء العاجل وموفور الصحة\n- **¡que aproveche!**: صحة وهنا / بالهناء والعافية (عند الأكل)\n- **el anhelo**: التمني والشوق القلبي العميق",
                "examples": [
                    {"es": "¡Ojalá haga sol mañana y podamos ir a la playa!", "ar": "يا ليت الجو يكون مشمساً غداً ونتمكن من الذهاب للشاطئ!"},
                    {"es": "Deseo de corazón que consigas todo lo que te propongas.", "ar": "أتمنى من قلبي أن تحقق كل ما تصبو إليه."},
                    {"es": "—Me voy a comer. —¡Que aproveche, buen provecho!", "ar": "—أنا ذاهب لتناول الطعام. —صحة وهنا / بالهناء والشفاء!"}
                ]
            }
        ],
        "newVocabulary": ["ojalá", "desear que", "esperar que", "que te mejores", "que aproveche", "anhelo"],
        "reviewVocabulary": ["suerte", "bueno"]
    }

    exs = [
        choice_ex(
            "ex-b1-oja-1", "word_choice",
            "اختر صيغة المنصوب الإلزامية بعد أداة التمني Ojalá",
            ["grammar"], 1,
            "أي تصريف لفعل aprobar نستخدم بعد أداة التمني ¡Ojalá!؟",
            "¡Ojalá todos los estudiantes _____ el examen con buenas notas!",
            "يا ليت جميع الطلاب ... الامتحان بدرجات جيدة!",
            [
                opt("a", "aprueben", "صيغة المنصوب الحاضر (الصواب الحتمي بعد Ojalá)", True),
                opt("b", "aprueban", "مضارع إخباري لا يجوز إطلاقاً بعد Ojalá", False, "أداة Ojalá تتطلب دائماً وبلا استثناء صيغة المنصوب Subjuntivo."),
                opt("c", "aprobar", "مصدر", False, "مع وجود الفاعل todos los estudiantes يجب تصريف الفعل بالمنصوب.")
            ],
            ["ojalá", "anhelo"],
            "بعد أداة التمني ¡Ojalá! يجب دائماً استخدام صيغة المنصوب: ¡Ojalá aprueben!"
        ),
        fill_ex(
            "ex-b1-oja-2",
            "أكمل عبارة الدعاء بالشفاء العاجل: (¡Que te _____ pronto!)",
            ["vocabulary", "writing"], 1,
            "صرف فعل mejorarse بالمنصوب المخاطب في دعاء الشفاء: ¡Que te _____ pronto!",
            "He sabido que estás resfriado; ¡que te _____ pronto!",
            "علمت أنك مصاب بالزكام؛ بالشفاء العاجل لك قريباً!",
            ["que te mejores"],
            ["mejores"],
            "عبارة الدعاء بالشفاء للمريض هي: ¡Que te mejores pronto! (بالمنصوب)."
        ),
        choice_ex(
            "ex-b1-oja-3", "word_choice",
            "حدد العبارة الإسبانية التقليدية التي تقال لمن يتناول الطعام",
            ["vocabulary"], 2,
            "ماذا تقول لشخص يبدأ في تناول طعامه متمنياً له الهناء والعافية؟",
            "Cuando alguien se sienta a la mesa a comer, le decimos educadamente: ¡_____!",
            "عندما يجلس شخص إلى المائدة للأكل، نقول له بلباقة: ...!",
            [
                opt("a", "Que aproveche", "صحة وهنا / بالهناء والشفاء (الصواب)", True),
                opt("b", "Que te mejores", "بالشفاء للمريض", False, "تقال للمريض وليس لمن يأكل الطعام."),
                opt("c", "Ojalá", "يا رب تمنياً فقط", False, "التحية المحددة للطعام هي ¡Que aproveche!.")
            ],
            ["que aproveche", "que te mejores", "ojalá", "bueno"],
            "نقول لمن يتناول طعامه: ¡Que aproveche! أو ¡Buen provecho! (بالهناء والشفاء)."
        ),
        order_ex(
            "ex-b1-oja-4",
            "رتّب الجملة لتمني التوفيق والحظ الوافر لصديقك",
            ["grammar", "writing"], 2,
            ["Ojalá", "tengas", "mucha", "suerte", "en", "el", "futuro"],
            "Ojalá tengas mucha suerte en el futuro",
            "الترتيب: أداة التمني Ojalá ثم المنصوب tengas ثم mucha suerte ثم en el futuro.",
            ["ojalá", "suerte"]
        ),
        choice_ex(
            "ex-b1-oja-5", "listen_choose",
            "استمع للتسجيل وحدد الدعاء والتمني الذي ينطق به المتحدث",
            ["listening", "vocabulary"], 2,
            "استمع لما يتمنى المتحدث لأخيه المسافر",
            "Deseo de todo corazón que tengas un viaje maravilloso y seguro.",
            "أتمنى من كل قلبي أن تحظى برحلة رائعة وآمنة.",
            [
                opt("a", "desear que", "تمني قلبي صادق بالمنصوب (الصواب)", True),
                opt("b", "que aproveche", "دعاء طعام", False, "المتحدث يتمنى رحلة آمنة لمسافر (Deseo que tengas)."),
                opt("c", "que te mejores", "شفاء من مرض", False, "الحديث تمنٍ بالسفر والتوفيق.")
            ],
            ["desear que", "que aproveche", "que te mejores", "anhelo"],
            "المتحدث قال: 'Deseo de todo corazón que tengas un viaje maravilloso'.",
            audioKey="pending/b1_deseo_viaje_maravilloso.mp3",
            speechEs="Deseo de todo corazón que tengas un viaje maravilloso y seguro."
        ),
        speak_ex(
            "ex-b1-oja-6",
            "انطق دعوتك وتمنياتك الطيبة لصديقك في بداية يومه",
            ["speaking", "pronunciation"], 2,
            "انطق التمني التالي بابتجاز ونبرة مودة صادقة:",
            "¡Ojalá tengas un día excelente y que todo te salga muy bien!",
            "يا ليتك تحظى بيوم ممتاز وأن يمضي كل شيء معك على خير ما يرام!",
            "pending/b1_ojala_dia_excelente.mp3",
            ["ojalá", "desear que"],
            "¡Ojalá tengas un día excelente y que todo te salga muy bien!",
            "انتبه لنطق حرف j في Ojalá كـ خاء لطيفة ونطق صيغتي المنصوب tengas و salga."
        )
    ]
    return lesson_doc(doc, exs, level="B1")


def make_lesson_conflictos_convivencia():
    slug = "b1-conflictos-convivencia"
    doc = {
        "slug": slug,
        "unitSlug": "b1-u9-relationships",
        "levelCode": "B1",
        "titleAr": "حل الخلافات والاعتذار والتصالح: الحوار البنّاء والتفاهم في السكن المشترك",
        "titleEs": "Resolución de conflictos, pedir disculpas y reconciliarse",
        "subtitleAr": "تقديم الاعتذار الصادق، التسامح، والتفاوض حول قواعد البيت والمجتمع",
        "order": 4,
        "estimatedMinutes": 18,
        "cefrLevel": "B1",
        "review": review_block(),
        "pedagogy": {
            "learningObjectivesAr": [
                "أن يقود المتعلم حواراً هادئاً لحل سوء تفاهم أو خلاف بين الأصدقاء أو رفقاء السكن.",
                "أن يقدم اعتذاراً بليغاً ومقنعاً باللغة الإسبانية: te pido disculpas, no era mi intención.",
                "أن يقبل الاعتذار ويعلن التصالح واستعادة الود: no pasa nada, olvídalo, reconciliarse."
            ],
            "grammarPoints": [
                {
                    "titleAr": "صيغ تقديم وقبول الاعتذار وحل النزاع",
                    "explanationAr": "1. **تقديم الاعتذار الصريح**:\n- **Pedir disculpas / perdón**: Te pido sinceras disculpas por lo que dije (أعتذر لك بصدق عما قلته).\n- **No era mi intención + infinitivo**: Siento si te molestó, no era mi intención ofenderte (لم يكن في نيتي الإساءة إليك).\n- **Reconocer el error**: Reconozco que me equivoqué y asumo la culpa.\n2. **قبول الاعتذار والتصافي**:\n- **Aceptar las disculpas**: Acepto tus disculpas, borrón y cuenta nueva (تعبير اصطلاحي: صفحة جديدة).\n- **Restar importancia**: No te preocupes, no tiene importancia / No pasa nada."
                }
            ],
            "commonMistakesAr": [
                "استخدام *yo disculpo* بمعنى 'أنا أعتذر'؛ الصحيح هو te pido disculpas (أطلب عذرك) أو discúlpame (اعذرني).",
                "ترجمة 'نبدأ صفحة جديدة' حرفياً بـ *página nueva*؛ التعبير الاصطلاحي الإسباني الشهير هو borrón y cuenta nueva."
            ],
            "dialectNotes": [
                {
                    "region": "EG",
                    "noteAr": "في مصر في الصلح بنقول: «حقك عليا ومكنش قصدي، ومسافة السكة ونفتح صفحة جديدة ومفيش زعل». بالإسبانية: Te pido disculpas, no era mi intención y hagamos borrón y cuenta nueva."
                }
            ],
            "culturalNoteAr": "عبارة 'Borrón y cuenta nueva' (حرفياً: شطب الحساب القديم وفتح حساب جديد) هي المفهوم الإسباني الأسمى لطي صفحة الخلافات وبدء مرحلة جديدة من الثقة."
        },
        "contentBlocks": [
            {
                "id": f"cb-{slug}-intro",
                "type": "explanation",
                "titleAr": "مصطلحات الصلح وإنهاء النزاع",
                "bodyAr": "المفردات التفاعلية:\n- **el conflicto**: النزاع أو الخلاف القائم\n- **pedir disculpas**: يقدم اعتذاراً صادقاً\n- **reconciliarse**: يتصالح ويتصافى بعد خلاف\n- **el malentendido**: سوء الفهم غير المقصود\n- **borrón y cuenta nueva**: فتح صفحة جديدة ونسيان ما مضى\n- **el perdón**: التسامح والعفو",
                "examples": [
                    {"es": "Fue un simple malentendido que resolvimos hablando con calma.", "ar": "كان مجرد سوء فهم بسيط حللناه بالحديث بهدوء."},
                    {"es": "Te pido disculpas de corazón; no era mi intención ofenderte.", "ar": "أعتذر لك من قلبي؛ لم يكن في نيتي الإساءة إليك."},
                    {"es": "Hagamos borrón y cuenta nueva para recuperar nuestra amistad.", "ar": "فلنفتح صفحة جديدة ونطوِ الماضي لاستعادة صداقتنا."}
                ]
            }
        ],
        "newVocabulary": ["conflicto", "pedir disculpas", "reconciliarse", "malentendido", "borrón y cuenta nueva", "perdón"],
        "reviewVocabulary": ["amigo", "hablar"]
    }

    exs = [
        choice_ex(
            "ex-b1-cnf-1", "word_choice",
            "اختر التعبير الاصطلاحي الإسباني لـ 'طي صفحة الماضي وبدء صفحة جديدة'",
            ["vocabulary"], 1,
            "ما هو المثل الاصطلاحي الإسباني الذي يعني تجاوز الخلاف والبدء من جديد؟",
            "Olvidemos lo que pasó y hagamos _____ a partir de hoy.",
            "لننسَ ما حدث ولنفتح ... اعتباراً من اليوم.",
            [
                opt("a", "borrón y cuenta nueva", "فتح صفحة جديدة ومحو الماضي (الصواب)", True),
                opt("b", "conflicto", "نزاع", False, "الهدف هو إنهاء النزاع وفتح صفحة جديدة borrón y cuenta nueva."),
                opt("c", "malentendido", "سوء فهم", False, "المثل الاصطلاحي الدال على التسامح هو borrón y cuenta nueva.")
            ],
            ["borrón y cuenta nueva", "conflicto", "malentendido"],
            "borrón y cuenta nueva هو التعبير الاصطلاحي لطي صفحة الماضي والتسامح وبدء مرحلة جديدة."
        ),
        fill_ex(
            "ex-b1-cnf-2",
            "أكمل بالكلمة التي تعني سوء الفهم غير المقصود (el _____)",
            ["vocabulary", "writing"], 1,
            "اكتب الكلمة الإسبانية المذكرة التي تعني 'سوء فهم / التباس في القصد' (el _____)",
            "Todo fue un lamentable _____ que podemos solucionar con una charla sincera.",
            "كان الأمر كله سوء فهم مؤسفاً يمكننا حله بحديث صادق.",
            ["malentendido"],
            ["malentendido"],
            "كلمة malentendido تعني سوء الفهم أو الالتباس بين طرفين."
        ),
        choice_ex(
            "ex-b1-cnf-3", "word_choice",
            "حدد الفعل المنعكس الذي يعني عودة الود والمصالحة بعد الخصام",
            ["vocabulary"], 2,
            "ما هو الفعل الذي يعني 'يتصالح الصديقان ويعودان للوفاق بعد قطيعة'؟",
            "Después de aclarar las cosas, los dos amigos decidieron _____.",
            "بعد توضيح الأمور، قرر الصديقان ...",
            [
                opt("a", "reconciliarse", "يتصالحان (الصواب)", True),
                opt("b", "conflicto", "نزاع (اسم)", False, "نحتاج فعلاً في المصدر بعد decidieron."),
                opt("c", "malentendido", "سوء فهم", False, "القرار هو التصالح reconciliarse.")
            ],
            ["reconciliarse", "conflicto", "malentendido", "amigo"],
            "فعل reconciliarse يعني يتصالح ويعود إلى الود بعد النزاع."
        ),
        order_ex(
            "ex-b1-cnf-4",
            "رتّب الجملة لتقديم اعتذار صادق لرفيق السكن",
            ["grammar", "writing"], 2,
            ["Te", "pido", "sinceras", "disculpas", "por", "el", "retraso"],
            "Te pido sinceras disculpas por el retraso",
            "الترتيب: الضمير Te ثم الفعل pido ثم sinceras disculpas ثم السبب por el retraso.",
            ["pedir disculpas"]
        ),
        choice_ex(
            "ex-b1-cnf-5", "listen_choose",
            "استمع للتسجيل وحدد نية المتحدث الحقيقية وراء الخلاف",
            ["listening", "vocabulary"], 2,
            "استمع لما يؤكده الصديق في اعتذاره",
            "Siento si te molesté, de verdad que no era mi intención ofenderte.",
            "أعتذر إن كنت قد ضايقتك، حقاً لم يكن في نيتي الإساءة إليك.",
            [
                opt("a", "pedir disculpas", "طلب العفو والاعتذار وتوضيح النية (الصواب)", True),
                opt("b", "conflicto", "إشعال نزاع جديد", False, "المتحدث يعتذر ويوضح حسن نيته (no era mi intención)."),
                opt("c", "reconciliarse", "تصالح منتهي", False, "المتحدث في مرحلة تقديم الاعتذار الصادق.")
            ],
            ["pedir disculpas", "conflicto", "reconciliarse", "perdón"],
            "المتحدث قال: 'Siento si te molesté, no era mi intención ofenderte'.",
            audioKey="pending/b1_siento_no_era_intencion.mp3",
            speechEs="Siento si te molesté, de verdad que no era mi intención ofenderte."
        ),
        speak_ex(
            "ex-b1-cnf-6",
            "انطق مبادرتك الكريمة للصلح وفتح صفحة جديدة من الصداقة",
            ["speaking", "pronunciation"], 2,
            "انطق الجملة التالية بلهجة تصالحية دافئة وصادقة لزميلك:",
            "Te pido perdón de corazón; hagamos borrón y cuenta nueva y seamos amigos.",
            "أطلب عفوك من قلبي؛ فلنفتح صفحة جديدة ولنكن أصدقاء.",
            "pending/b1_pido_perdon_borron_nueva.mp3",
            ["perdón", "borrón y cuenta nueva", "pedir disculpas"],
            "Te pido perdón de corazón; hagamos borrón y cuenta nueva y seamos amigos.",
            "انتبه لنطق حرف z في corazón كـ ثاء ونطق rr المشددة في borrón."
        )
    ]
    return lesson_doc(doc, exs, level="B1")

# ==============================================================================
# UNIT 10: b1-u10-writing-basics (الكتابة الوظيفية والمراسلات الرسمية وأدوات الربط)
# ==============================================================================

def make_lesson_conectores_discursivos():
    slug = "b1-conectores-discursivos"
    doc = {
        "slug": slug,
        "unitSlug": "b1-u10-writing-basics",
        "levelCode": "B1",
        "titleAr": "أدوات الربط المنطقي: مهارات تنظيم النص بـ Sin embargo و Por lo tanto و No obstante",
        "titleEs": "Conectores discursivos: Causa, consecuencia, contraste y orden",
        "subtitleAr": "الربط بين الأفكار، تنظيم الفقرات، وتفادي التكرار الركيك في الكتابة",
        "order": 1,
        "estimatedMinutes": 18,
        "cefrLevel": "B1",
        "review": review_block(),
        "pedagogy": {
            "learningObjectivesAr": [
                "أن يوظف المتعلم روابط الخطاب المتقدمة للربط المنطقي بين الجمل والفقرات باللغة الإسبانية.",
                "أن يميز بين روابط التناقض والاستدراك (sin embargo, no obstante, en cambio) والنتيجة (por lo tanto, por consiguiente, de modo que).",
                "أن يطبق علامات الترقيم الصحيحة المصاحبة للروابط (الفواصل والنقطة والفاصلة المنقوطة)."
            ],
            "grammarPoints": [
                {
                    "titleAr": "تصنيف روابط الخطاب الكتابية في الإسبانية",
                    "explanationAr": "1. **روابط الاستدراك والتعارض (Oposición y Contraste)**:\n- **Sin embargo / No obstante**: تعني (ومع ذلك / غير أن) وتوضع بين فاصلتين أو بعد نقطة:\n  * Estudió mucho; sin embargo, el examen fue muy difícil.\n- **En cambio**: تعني (بالمقابل / في المقابل) للمقارنة المباشرة بين شيئين.\n2. **روابط النتيجة والسببية (Causa y Consecuencia)**:\n- **Por lo tanto / Por consiguiente**: تعني (وبناءً على ذلك / لذلك) لبيان النتيجة المنطقية:\n  * No cumplió los requisitos; por lo tanto, la solicitud fue denegada.\n- **Ya que / Puesto que**: تعني (بما أن / نظراً لأن) وتأتي في أول الجملة أو وسطها.\n3. **روابط الترتيب والإضافة (Orden y Adición)**:\n- **En primer lugar / Por último** (أولاً / أخيراً).\n- **Asimismo / Además** (كذلك / فضلاً عن ذلك)."
                }
            ],
            "commonMistakesAr": [
                "استخدام *pero sin embargo* معاً في نفس الجملة (وهو حشو ركيك وخاطئ قواعدياً؛ اختر pero وحدها أو sin embargo وحدها).",
                "نسيان الفاصلة بعد sin embargo أو por lo tanto عندما تأتي في أول الجملة."
            ],
            "dialectNotes": [
                {
                    "region": "EG",
                    "noteAr": "في مصر في الكتابة بنقول: «وعلى الرغم من كدة، وبالتالي، وعشان كدة، وفي المقابل». بالإسبانية: sin embargo, por lo tanto, por consiguiente, en cambio."
                }
            ],
            "culturalNoteAr": "في اختبارات ديلي DELE B1، تقييم مهارة التعبير الكتابي يمنح وزناً كبيراً لمدى التنوع في استخدام روابط الخطاب (la coherencia y cohesión)."
        },
        "contentBlocks": [
            {
                "id": f"cb-{slug}-intro",
                "type": "explanation",
                "titleAr": "أهم روابط الخطاب والتماسك النصي",
                "bodyAr": "الروابط الرئيسية:\n- **sin embargo**: ومع ذلك / غير أن\n- **no obstante**: على الرغم من ذلك / بَيْدَ أن\n- **por lo tanto**: ولذلك / بناءً عليه\n- **en cambio**: في المقابل / بالمقابل\n- **puesto que**: بما أن / نظراً لأن\n- **asimismo**: كذلك / وبالإضافة إلى ذلك",
                "examples": [
                    {"es": "El proyecto era arriesgado; sin embargo, obtuvimos un éxito rotundo.", "ar": "كان المشروع محفوفاً بالمخاطر؛ ومع ذلك، حققنا نجاحاً باهراً."},
                    {"es": "El plazo finaliza hoy; por lo tanto, debemos enviar los documentos ya.", "ar": "الموعد ينتهي اليوم؛ ولذلك، يجب أن نرسل الوثائق الآن."},
                    {"es": "Marta prefiere el cine; en cambio, su hermano adora el teatro.", "ar": "مارتا تفضل السينما؛ في المقابل، أخوها يعشق المسرح."}
                ]
            }
        ],
        "newVocabulary": ["sin embargo", "no obstante", "por lo tanto", "en cambio", "puesto que", "asimismo"],
        "reviewVocabulary": ["texto", "escritura"]
    }

    exs = [
        choice_ex(
            "ex-b1-con-1", "word_choice",
            "اختر رابط النتيجة والسببية المنطقية المناسب",
            ["grammar"], 1,
            "أي رابط نستخدم لبيان النتيجة المترتبة على الجملة السابقة؟",
            "El informe contiene errores graves; _____, debemos revisarlo de nuevo.",
            "التقرير يحتوي على أخطاء جسيمة؛ ...، يجب أن نراجعه مجدداً.",
            [
                opt("a", "por lo tanto", "ولذلك / بناءً عليه (الصواب لبيان النتيجة)", True),
                opt("b", "sin embargo", "ومع ذلك (تعارض)", False, "المراجعة نتيجة منطقية للأخطاء وليست تعارضاً."),
                opt("c", "en cambio", "في المقابل", False, "en cambio تستخدم للمقارنة المتقابلة.")
            ],
            ["por lo tanto", "sin embargo", "en cambio"],
            "por lo tanto هو رابط النتيجة والسببية المنطقية (ولذلك / بناءً عليه)."
        ),
        fill_ex(
            "ex-b1-con-2",
            "أكمل برابط الاستدراك والتعارض الأكثر شيوعاً: (sin _____)",
            ["grammar", "writing"], 1,
            "اكتب الكلمة الناقصة في رابط الاستدراك الشهير: (sin _____)",
            "Llovía con intensidad; sin _____, salimos a dar un paseo por la ciudad.",
            "كانت تمطر بغزارة؛ ومع ذلك، خرجنا للتنزه في المدينة.",
            ["sin embargo"],
            ["embargo"],
            "الرابط هو sin embargo ويعني مع ذلك أو غير أن."
        ),
        choice_ex(
            "ex-b1-con-3", "word_choice",
            "حدد الرابط المستخدم للمقارنة والمقابلة بين أمرين متخالفين",
            ["vocabulary"], 2,
            "أي رابط يعني 'في المقابل / بالمقابل' لمقارنة وضعين مختلفين؟",
            "En el norte hace frío; _____, en el sur disfrutan de un clima cálido.",
            "في الشمال الطقس بارد؛ ...، في الجنوب يستمتعون بمناخ دافئ.",
            [
                opt("a", "en cambio", "في المقابل / بالمقابل (الصواب)", True),
                opt("b", "por lo tanto", "لذلك (نتيجة)", False, "الجملة تقارن بين منطقتين متقابلتين."),
                opt("c", "puesto que", "بما أن", False, "puesto que رابط تعليلي سببي.")
            ],
            ["en cambio", "por lo tanto", "puesto que"],
            "en cambio يعني بالمقابل أو في المقابل لإبراز التباين بين طرفين."
        ),
        order_ex(
            "ex-b1-con-4",
            "رتّب الجملة لاستخدام الرابط الرصين no obstante في الاستدراك",
            ["grammar", "writing"], 2,
            ["No", "obstante", "seguiremos", "trabajando", "en", "el", "proyecto"],
            "No obstante seguiremos trabajando en el proyecto",
            "الترتيب: الرابط No obstante ثم الفعل seguiremos trabajando ثم شبه الجملة en el proyecto.",
            ["no obstante"]
        ),
        choice_ex(
            "ex-b1-con-5", "listen_choose",
            "استمع للتسجيل وحدد الرابط المنطقي الذي استخدمه الكاتب",
            ["listening", "vocabulary"], 2,
            "استمع للفقرة وحدد الرابط المستخدم في بداية الجملة الثانية",
            "El candidato no tenía experiencia previa. Asimismo, demostró un gran talento.",
            "لم يكن لدى المرشح خبرة سابقة. كذلك، أظهر موهبة كبيرة.",
            [
                opt("a", "asimismo", "كذلك / بالإضافة إلى ذلك (الصواب)", True),
                opt("b", "sin embargo", "مع ذلك", False, "المتحدث استخدم تحديداً رابط الإضافة: Asimismo."),
                opt("c", "por lo tanto", "لذلك", False, "المتحدث استخدم asimismo.")
            ],
            ["asimismo", "sin embargo", "por lo tanto"],
            "المتحدث قال: 'Asimismo, demostró un gran talento'.",
            audioKey="pending/b1_asimismo_gran_talento.mp3",
            speechEs="El candidato no tenía experiencia previa. Asimismo, demostró un gran talento."
        ),
        speak_ex(
            "ex-b1-con-6",
            "انطق جملتك المركبة مستخدماً رابط النتيجة والاستدراك بفصاحة",
            ["speaking", "pronunciation"], 2,
            "انطق الجملة التالية بأسلوب كتابي فصيح مع التوقف عند علامات الترقيم:",
            "Estudiamos mucho; por lo tanto, aprobaremos el examen sin dificultades.",
            "درسنا كثيراً؛ ولذلك، سنجتاز الامتحان دون صعوبات.",
            "pending/b1_estudiamos_por_lo_tanto.mp3",
            ["por lo tanto", "escritura"],
            "Estudiamos mucho; por lo tanto, aprobaremos el examen sin dificultades.",
            "توقف قليلاً بعد الفاصلة المنقوطة وبعد por lo tanto بنبرة كتابية متزنة."
        )
    ]
    return lesson_doc(doc, exs, level="B1")


def make_lesson_carta_formal_correo():
    slug = "b1-carta-formal-correo"
    doc = {
        "slug": slug,
        "unitSlug": "b1-u10-writing-basics",
        "levelCode": "B1",
        "titleAr": "الرسائل والبريد الإلكتروني الرسمي: أصول المكاتبات الإدارية والأكاديمية",
        "titleEs": "La carta formal y el correo electrónico institucional",
        "subtitleAr": "صيغ التحية الرسمية، عرض الطلب باحترام، وعبارات الختام المعتمدة",
        "order": 2,
        "estimatedMinutes": 18,
        "cefrLevel": "B1",
        "review": review_block(),
        "pedagogy": {
            "learningObjectivesAr": [
                "أن يكتب المتعلم رسالة بريد إلكتروني رسمية (correo formal) موجهة لجامعة أو شركة أو إدارة حكومية.",
                "أن يستخدم صيغ التحية الرسمية المعتمدة: Estimado/a señor/a, Distinguido director.",
                "أن يختم المراسلة بالعبارات البروتوكولية اللبقة: Atentamente, Le saluda atentamente, Quedo a su entera disposición."
            ],
            "grammarPoints": [
                {
                    "titleAr": "هيكل المراسلات الرسمية في الإسبانية",
                    "explanationAr": "1. **صيغة التحية والافتتاح (El saludo)**:\n- **Estimado/a Sr./Sra. + اللقب** (الأكثر شيوعاً): *Estimado señor Martínez:* (لاحظ وضع النقطتين فوق بعض : بعد التحية في الإسبانية وليس الفاصلة كما في الإنجليزية).\n- **Distinguido/a + المنصب**: *Distinguida Directora:*\n2. **بيان سبب المراسلة (El cuerpo)**:\n- **Me dirijo a usted con el fin de / para solicitar...** (أتوجه إلى حضرتكم بهدف...).\n- **Le escribo en relación con la convocatoria de becas...**\n3. **الخاتمة والتوديع (La despedida)**:\n- **Quedo a la espera de sus noticias / de su respuesta** (في انتظار أخباركم/ردكم الكريم).\n- **Atentamente, / Le saluda atentamente,** (وتفضلوا بقبول فائق الاحترام والتقدير)."
                }
            ],
            "commonMistakesAr": [
                "وضع فاصلة (,) بعد التحية بدلاً من النقطتين (:)؛ القاعدة الإسبانية الصارمة تفرض النقطتين: *Estimado señor:*.",
                "خلط صيغة الخطاب tú مع صيغة الاحترام usted داخل نفس الرسالة الرسمية."
            ],
            "dialectNotes": [
                {
                    "region": "EG",
                    "noteAr": "في مصر في الإيميل الرسمي بنبدأ بـ «السيد المحترم فلان، أتشرف بمراسلتكم، وتفضلوا بقبول فائق الاحترام». بالإسبانية: Estimado señor Martínez:, Me dirijo a usted para..., Atentamente."
                }
            ],
            "culturalNoteAr": "في إسبانيا والبلدان الناطقة بالإسبانية، الخطابات الإدارية تبدأ دائماً بـ 'Me dirijo a usted...' وتعتبر النقطتان (:) بعد الاسم التحية دليلاً قاطعاً على إتقان أصول المراسلات."
        },
        "contentBlocks": [
            {
                "id": f"cb-{slug}-intro",
                "type": "explanation",
                "titleAr": "مصطلحات المراسلات الرسمية",
                "bodyAr": "العبارات المعتمدة:\n- **estimado señor**: سيدي المحترم / الفاضل\n- **atentamente**: وتفضلوا بقبول فائق الاحترام والتقدير\n- **me dirijo a usted**: أتوجه إلى حضرتكم بكتابي هذا\n- **quedar a su disposición**: أبقى تحت تصرفكم لأي استفسار\n- **el asunto**: موضوع الرسالة في خانة الإيميل\n- **adjuntar**: يرفق ملفاً أو مستنداً بالبريد",
                "examples": [
                    {"es": "Estimada señora Gómez: Me dirijo a usted para solicitar información sobre el máster.", "ar": "سيدتي الفاضلة غوميث: أتوجه إلى حضرتك لطلب معلومات حول الماجستير."},
                    {"es": "Le adjunto mi currículum vitae actualizado para su revisión.", "ar": "أرفق لحضرتكم سيرتي الذاتية المحدثة لمراجعتها."},
                    {"es": "Agradeciendo de antemano su atención, le saluda atentamente.", "ar": "شاكراً لحضرتكم سلفاً حسن الاهتمام، وتفضلوا بقبول فائق الاحترام."}
                ]
            }
        ],
        "newVocabulary": ["estimado señor", "atentamente", "me dirijo a usted", "quedar a su disposición", "asunto", "adjuntar"],
        "reviewVocabulary": ["carta", "correo"]
    }

    exs = [
        choice_ex(
            "ex-b1-car-1", "word_choice",
            "اختر صيغة الختام والوداع الرسمية الأكثر شيوعاً في الرسائل",
            ["vocabulary"], 1,
            "ما هي الكلمة البروتوكولية التي تختم بها الخطابات الرسمية (المقابلة لـ مع فائق الاحترام)؟",
            "Esperando su pronta respuesta, le saluda _____.",
            "في انتظار ردكم الكريم، وتفضلوا بقبول فائق ...",
            [
                opt("a", "atentamente", "مع فائق الاحترام والتقدير (الصواب)", True),
                opt("b", "estimado señor", "تحية الافتتاح وليست الختام", False, "estimado señor تأتي في أول الرسالة."),
                opt("c", "asunto", "الموضوع", False, "asunto هو خانة عنوان الرسالة.")
            ],
            ["atentamente", "estimado señor", "asunto"],
            "atentamente هي الصيغة الرسمية المعيارية للختام في الخطابات والإيميلات الإدارية."
        ),
        fill_ex(
            "ex-b1-car-2",
            "أكمل بالفعل الدال على إرفاق الملفات والمستندات في الإيميل (adjuntar)",
            ["grammar", "writing"], 1,
            "صرف فعل إرفاق المستندات مع المتكلم yo في الحاضر: (adjunto)",
            "En este correo le _____ el formulario oficial debidamente cumplimentado.",
            "في هذا البريد ... لحضرتكم النموذج الرسمي بعد تعبئته كما ينبغي.",
            ["adjuntar"],
            ["adjunto", "Adjunto"],
            "فعل adjuntar يعني يرفق وثيقة أو ملفاً بالبريد: le adjunto el archivo."
        ),
        choice_ex(
            "ex-b1-car-3", "word_choice",
            "حدد العبارة الرسمية التي تفتتح بها بيان سبب مراسلة المسؤول",
            ["vocabulary"], 2,
            "كيف تبدأ متن رسالتك لمدير مؤسسة لبيان سبب كتابتك للخطاب؟",
            "_____ para solicitar una prórroga en el plazo de matrícula.",
            "... لطلب تمديد في مهلة التسجيل الجامعي.",
            [
                opt("a", "Me dirijo a usted", "أتوجه إلى حضرتكم (الصواب)", True),
                opt("b", "Atentamente", "خاتمة الرسالة", False, "atentamente تأتي في الختام وليس لبيان السبب."),
                opt("c", "Asunto", "خانة العنوان", False, "نحتاج العبارة الاستفتاحية للنص.")
            ],
            ["me dirijo a usted", "atentamente", "asunto"],
            "Me dirijo a usted هي العبارة المعيارية الرسمية لبدء متن الرسالة وتحديد الغرض."
        ),
        order_ex(
            "ex-b1-car-4",
            "رتّب الجملة لعرض الاستعداد التام لتقديم أي توضيحات إضافية",
            ["grammar", "writing"], 2,
            ["Quedo", "a", "su", "entera", "disposición", "para", "cualquier", "duda"],
            "Quedo a su entera disposición para cualquier duda",
            "الترتيب: الفعل Quedo ثم a su entera disposición ثم الغرض para cualquier duda.",
            ["quedar a su disposición"]
        ),
        choice_ex(
            "ex-b1-car-5", "listen_choose",
            "استمع للتسجيل وحدد التحية وعلامة الترقيم الإسبانية الصحيحة بعدها",
            ["listening", "vocabulary"], 2,
            "استمع للتحية الافتتاحية في الرسالة الرسمية",
            "Estimado señor Director: Me pongo en contacto con su departamento.",
            "سيدي المدير المحترم: أتواصل مع قسمكم الكريم.",
            [
                opt("a", "estimado señor", "تحية رسمية متبوعة بنقطتين (الصواب)", True),
                opt("b", "atentamente", "خاتمة", False, "المتحدث قرأ افتتاحية الخطاب (Estimado señor Director:)."),
                opt("c", "asunto", "موضوع", False, "المتحدث بدأ بتحية المخاطب الرسمي.")
            ],
            ["estimado señor", "atentamente", "asunto"],
            "المتحدث قال: 'Estimado señor Director:' كافتتاحية رسمية.",
            audioKey="pending/b1_estimado_senor_director.mp3",
            speechEs="Estimado señor Director: Me pongo en contacto con su departamento."
        ),
        speak_ex(
            "ex-b1-car-6",
            "انطق عبارتك الختامية في البريد الرسمي باحترافية كاملة",
            ["speaking", "pronunciation"], 2,
            "انطق العبارة البروتوكولية التالية في ختام رسالتك الرسمية:",
            "Quedo a su disposición y le saluda atentamente.",
            "أبقى تحت تصرفكم، وتفضلوا بقبول فائق الاحترام والتقدير.",
            "pending/b1_quedo_disposicion_atentamente.mp3",
            ["quedar a su disposición", "atentamente"],
            "Quedo a su disposición y le saluda atentamente.",
            "انتبه لنطق حرف c في disposición كـ ثاء ونطق atentamente بوقار."
        )
    ]
    return lesson_doc(doc, exs, level="B1")


def make_lesson_agradecimiento_disculpa():
    slug = "b1-agradecimiento-disculpa"
    doc = {
        "slug": slug,
        "unitSlug": "b1-u10-writing-basics",
        "levelCode": "B1",
        "titleAr": "رسائل الشكر والاعتذار المهني: الصياغة الراقية في بيئة العمل والمؤسسات",
        "titleEs": "Cartas de agradecimiento y disculpa en el ámbito profesional",
        "subtitleAr": "التعبير عن الامتنان للتعاون، الاعتذار عن الأخطاء المؤسسية، وتقديم الحلول",
        "order": 3,
        "estimatedMinutes": 18,
        "cefrLevel": "B1",
        "review": review_block(),
        "pedagogy": {
            "learningObjectivesAr": [
                "أن يكتب المتعلم رسالة شكر رسمية ومهنية تعبر عن الامتنان لحسن التعاون والدعم.",
                "أن يصيغ خطاب اعتذار مؤسسي رصين عند وقوع خطأ أو تأخير في تقديم الخدمة.",
                "أن يقترح تدابير تصحيحية تضمن عدم تكرار المشكلة واستعادة ثقة العميل أو الشريك."
            ],
            "grammarPoints": [
                {
                    "titleAr": "تراكيب الشكر والاعتذار المؤسسي",
                    "explanationAr": "1. **صيغ الامتنان والشكر (Agradecimiento)**:\n- **Quisiera expresar mi sincero agradecimiento por...** (أود التعبير عن خالص امتناني لـ...).\n- **Le agradecemos enormemente su valiosa colaboración** (نشكر لحضرتكم جزيلاً تعاونكم القيم).\n2. **صيغ الاعتذار المؤسسي (Disculpa)**:\n- **Le rogamos acepte nuestras más sinceras disculpas por...** (نرجو من حضرتكم قبول خالص اعتذارنا عن...).\n- **Lamentamos profundamente los inconvenientes ocasionados** (نأسف بشدة للإزعاج الناجم عن ذلك).\n3. **التعهد بالإصلاح**:\n- **Tomar medidas para subsanar**: Hemos tomado medidas para subsanar el error a la mayor brevedad."
                }
            ],
            "commonMistakesAr": [
                "استخدام *gracias por todo* في سياق مؤسسي رفيع؛ العبارة المهنية الأرقى هي Le agradecemos sinceramente su colaboración.",
                "ترجمة 'تدارك الخطأ' بـ *arreglar el error* في الخطابات؛ المصطلح الإداري الرصين هو subsanar el error."
            ],
            "dialectNotes": [
                {
                    "region": "EG",
                    "noteAr": "في مصر في الإيميل بنقول: «بنشكركم جداً على تعاونكم، وبنعتذر لحضرتك عن التأخير وأخدنا إجراءات عشان ميتكررش». بالإسبانية: Le agradecemos su colaboración, lamentamos los inconvenientes y subsanamos el error."
                }
            ],
            "culturalNoteAr": "رسائل الشكر بعد المقابلات الوظيفية (Cartas de agradecimiento tras la entrevista) تعطي انطباعاً احترافياً فائق التميز لدى مديري الموارد البشرية في إسبانيا."
        },
        "contentBlocks": [
            {
                "id": f"cb-{slug}-intro",
                "type": "explanation",
                "titleAr": "مصطلحات الامتنان والاعتذار المهني",
                "bodyAr": "المفردات الراقية:\n- **el agradecimiento**: الامتنان والشكر الجزيل\n- **lamentar**: يأسف بشدة ويعتذر\n- **la colaboración**: التعاون والشراكة المثمرة\n- **los inconvenientes**: الإزعاج أو المتاعب الناتجة\n- **subsanar**: يتدارك ويصلح الخلل\n- **la confianza**: الثقة الممنوحة",
                "examples": [
                    {"es": "Quiero manifestar mi profundo agradecimiento por su cálida acogida.", "ar": "أريد الإعراب عن خالص امتناني لحسن استقبالكم الدافئ."},
                    {"es": "Lamentamos los inconvenientes que este retraso haya podido causarle.", "ar": "نأسف للإزعاج الذي قد يكون هذا التأخير سببه لحضرتكم."},
                    {"es": "Nos comprometemos a subsanar el fallo técnico de inmediato.", "ar": "نتعهد بتدارك وإصلاح الخلل الفني على الفور."}
                ]
            }
        ],
        "newVocabulary": ["agradecimiento", "lamentar", "colaboración", "inconvenientes", "subsanar", "confianza"],
        "reviewVocabulary": ["gracias", "ayuda"]
    }

    exs = [
        choice_ex(
            "ex-b1-agr-1", "word_choice",
            "اختر المفردة التي تعني التعبير عن الامتنان والشكر الرسمي",
            ["vocabulary"], 1,
            "ما هي الكلمة الإسبانية الرسمية المقابلة لـ 'الامتنان والشكر البالغ'؟",
            "Quiero hacerle llegar mi más sincero _____ por su apoyo constante.",
            "أود أن أنقل لحضرتكم خالص ... لدعمكم المستمر.",
            [
                opt("a", "agradecimiento", "الامتنان والشكر (الصواب)", True),
                opt("b", "inconvenientes", "المتاعب والإزعاج", False, "السياق شكر وتقدير للدعم."),
                opt("c", "subsanar", "يصلح الخطأ (فعل)", False, "نحتاج اسماً مذكراً بعد mi más sincero.")
            ],
            ["agradecimiento", "inconvenientes", "subsanar"],
            "el agradecimiento يعني الامتنان والشكر الرسمي والتقدير البالغ."
        ),
        fill_ex(
            "ex-b1-agr-2",
            "أكمل بالفعل الإداري الرصين الذي يعني 'يتدارك ويصلح الخلل' في المصدر (subsanar)",
            ["grammar", "writing"], 1,
            "اكتب الفعل الإداري الذي يعني 'يتدارك ويصحح الخطأ' في صيغة المصدر (subsanar)",
            "Estamos trabajando intensamente para _____ las deficiencias detectadas.",
            "نحن نعمل بشكل مكثف لتدارك وتصحيح أوجه القصور المرصودة.",
            ["subsanar"],
            ["subsanar"],
            "فعل subsanar يعني يتدارك أو يصحح خطأ أو خللاً إدارياً أو فنياً."
        ),
        choice_ex(
            "ex-b1-agr-3", "word_choice",
            "حدد الفعل الدال على الأسف والاعتذار المؤسسي الراقي",
            ["vocabulary"], 2,
            "أي فعل إسباني يعني 'يأسف بشدة ويعتذر رسمياً عن الموقف'؟",
            "_____ profundamente las molestias causadas por la cancelación.",
            "... بشدة للإزعاج والمتاعب الناتجة عن الإلغاء.",
            [
                opt("a", "Lamentamos", "نأسف ونعتذر بشدة (الصواب)", True),
                opt("b", "Agradecemos", "نشكر (معنى غير مناسب للإزعاج)", False, "الإلغاء يتطلب الاعتذار والأسف Lamentamos."),
                opt("c", "Subsanamos", "نصلح", False, "الاعتذار اللفظي يبدأ بـ Lamentamos.")
            ],
            ["lamentar", "inconvenientes", "agradecimiento"],
            "lamentar يعني يأسف ويعتذر رسمياً عن المتاعب غير المقصودة."
        ),
        order_ex(
            "ex-b1-agr-4",
            "رتّب الجملة لشكر الشريك على تعاونه المثمر وثقته",
            ["grammar", "writing"], 2,
            ["Le", "agradecemos", "su", "valiosa", "colaboración", "y", "confianza"],
            "Le agradecemos su valiosa colaboración y confianza",
            "الترتيب: الضمير Le ثم الفعل agradecemos ثم su valiosa colaboración y confianza.",
            ["colaboración", "confianza"]
        ),
        choice_ex(
            "ex-b1-agr-5", "listen_choose",
            "استمع للتسجيل وحدد اعتذار الشركة للعملاء",
            ["listening", "vocabulary"], 2,
            "استمع للبيان الرسمي الصادر عن إدارة الشركة",
            "Pedimos disculpas a nuestros clientes por todos los inconvenientes sufridos.",
            "نطلب العفو والاعتذار من عملائنا عن جميع المتاعب والإزعاج الذي لحق بهم.",
            [
                opt("a", "inconvenientes", "المتاعب والإزعاج الناتج (الصواب)", True),
                opt("b", "colaboración", "تعاون", False, "الشركة تعتذر عن المتاعب والإزعاج (los inconvenientes)."),
                opt("c", "agradecimiento", "شكر", False, "البيان تضمن اعتذاراً عن المتاعب.")
            ],
            ["inconvenientes", "colaboración", "agradecimiento"],
            "المتحدث قال: 'por todos los inconvenientes sufridos'.",
            audioKey="pending/b1_disculpas_inconvenientes_clientes.mp3",
            speechEs="Pedimos disculpas a nuestros clientes por todos los inconvenientes sufridos."
        ),
        speak_ex(
            "ex-b1-agr-6",
            "انطق رسالتك الختامية بالشكر والامتنان للتعاون المثمر",
            ["speaking", "pronunciation"], 2,
            "انطق الجملة التالية بأسلوب مهني يعكس الشكر والتقدير:",
            "Reitero mi agradecimiento por su valiosa colaboración y su confianza.",
            "أجدد لحضرتكم خالص امتناني لتعاونكم القيم وثقتكم الغالية.",
            "pending/b1_reitero_agradecimiento_colaboracion.mp3",
            ["agradecimiento", "colaboración", "confianza"],
            "Reitero mi agradecimiento por su valiosa colaboración y su confianza.",
            "انتبه لنطق حرف r في Reitero ونطق مقطع ción كـ ثيون برصانة صوتية."
        )
    ]
    return lesson_doc(doc, exs, level="B1")


def make_lesson_redaccion_argumentativa():
    slug = "b1-redaccion-argumentativa"
    doc = {
        "slug": slug,
        "unitSlug": "b1-u10-writing-basics",
        "levelCode": "B1",
        "titleAr": "صياغة مقال الرأي: بناء الحجة المنطقية، الاستشهاد، وخاتمة التوصيات",
        "titleEs": "Redacción argumentativa: Estructurar ensayos y artículos de opinión",
        "subtitleAr": "كتابة الأطروحة (Tesis)، استعراض الأدلة، وصياغة خاتمة مقنعة",
        "order": 4,
        "estimatedMinutes": 18,
        "cefrLevel": "B1",
        "review": review_block(),
        "pedagogy": {
            "learningObjectivesAr": [
                "أن يكتب المتعلم مقال رأي متماسكاً ومنطقياً باللغة الإسبانية من أربع إلى خمس فقرات.",
                "أن يصيغ الأطروحة المركزية (la tesis) ويدعمها بحجج موضوعية (argumentos a favor y en contra).",
                "أن يختم المقال بتلخيص وتوصيات مستقبلية مقنعة للقارئ (en conclusión, es necesario que...)."
            ],
            "grammarPoints": [
                {
                    "titleAr": "بنية مقال الرأي الأكاديمي والفكري",
                    "explanationAr": "1. **المقدمة وطرح القضية (Introducción y Tesis)**:\n- Hoy en día nadie puede dudar de que... / El debate en torno a... suscita gran interés.\n2. **جسم المقال ومناقشة الحجج (Cuerpo argumentativo)**:\n- **Argumentos a favor**: En primer término, cabe destacar que... (في المقام الأول يجدر إبراز أن...).\n- **Argumentos en contra**: Frente a esta postura, otros sostienen que... (في مواجهة هذا الموقف، يرى آخرون أن...).\n3. **الخاتمة والتوصيات (Conclusión)**:\n- **Para concluir / En definitiva**: En definitiva, no se trata de elegir entre blanco o negro, sino de hallar un equilibrio sensato."
                }
            ],
            "commonMistakesAr": [
                "القفز مباشرة إلى إبداء الرأي دون تمهيد موضوعي للمسألة في الفقرة الافتتاحية.",
                "تكرار نفس الفكرة بصياغات مختلفة؛ المقال الناجح يتطلب حججاً متنوعة (بيئية، اقتصادية، اجتماعية، إنسانية)."
            ],
            "dialectNotes": [
                {
                    "region": "EG",
                    "noteAr": "في مصر في كتابة المقال بنبدأ بالمقدمة ونعرض وجهات النظر المختلفة ونختم بحل وتوصية. بالإسبانية: Introducción con tesis, argumentos a favor y en contra, y conclusión equilibrada."
                }
            ],
            "culturalNoteAr": "في امتحانات شهادة الـ DELE لمستوى B1 و B2، يُطلب من الطالب كتابة مقال رأي يعالج إيجابيات وسلبيات ظاهرة حديثة مع تقديم مقترح شخصي متوازن."
        },
        "contentBlocks": [
            {
                "id": f"cb-{slug}-intro",
                "type": "explanation",
                "titleAr": "مصطلحات صياغة المقال والتحرير",
                "bodyAr": "المفردات المنهجية:\n- **el ensayo**: المقال الفكري أو الأكاديمي\n- **la tesis**: الأطروحة أو الفكرة المحورية للمقال\n- **argumentar**: يدافع بالحجة والبرهان\n- **la conclusión**: الخاتمة والاستنتاج النهائي\n- **la postura**: الموقف أو وجهة النظر المتبناة\n- **coherente**: متماسك ومنطقي في التدفق",
                "examples": [
                    {"es": "El autor defiende su tesis mediante argumentos sólidos y contrastados.", "ar": "يدافع الكاتب عن أطروحته بواسطة حجج متينة ومحققة."},
                    {"es": "Para escribir un buen ensayo es crucial mantener una estructura coherente.", "ar": "لكتابة مقال جيد من الحاسم الحفاظ على بنية متماسكة."},
                    {"es": "En conclusión, debemos adoptar una postura abierta ante los cambios tecnológicos.", "ar": "ختاماً، يجب أن نتبنى موقفاً منفتحاً أمام التغيرات التكنولوجية."}
                ]
            }
        ],
        "newVocabulary": ["ensayo", "tesis", "argumentar", "conclusión", "postura", "coherente"],
        "reviewVocabulary": ["escribir", "opinión"]
    }

    exs = [
        choice_ex(
            "ex-b1-red-1", "word_choice",
            "اختر المفردة التي تعني الأطروحة والفكرة المركزية للمقال",
            ["vocabulary"], 1,
            "ما هي الكلمة التي تعني 'الأطروحة الأساسية التي يدافع عنها الكاتب'؟",
            "En el primer párrafo el autor presenta con claridad su _____ principal.",
            "في الفقرة الأولى يعرض الكاتب بوضوح ... الرئيسية له.",
            [
                opt("a", "tesis", "الأطروحة المركزية (الصواب)", True),
                opt("b", "conclusión", "الخاتمة", False, "الخاتمة تأتي في النهاية وليس في الفقرة الأولى."),
                opt("c", "ensayo", "المقال ككل", False, "الفكرة الأساسية تسمى الأطروحة la tesis.")
            ],
            ["tesis", "conclusión", "ensayo"],
            "la tesis هي الأطروحة أو الفكرة الجوهرية التي يسعى المقال لإثباتها."
        ),
        fill_ex(
            "ex-b1-red-2",
            "أكمل بالكلمة التي تعني الخاتمة والاستنتاج النهائي: (la _____)",
            ["vocabulary", "writing"], 1,
            "اكتب الكلمة الإسبانية المؤنثة التي تعني 'الخاتمة / الخلاصة النهائية' (la _____)",
            "En la _____ el autor resume los puntos clave y ofrece una recomendación.",
            "في الخاتمة يلخص الكاتب النقاط الرئيسية ويقدم توصية.",
            ["conclusión"],
            ["conclusión", "conclusion"],
            "كلمة conclusión تعني الخاتمة أو الاستنتاج النهائي للمقال."
        ),
        choice_ex(
            "ex-b1-red-3", "word_choice",
            "حدد الوصف الإيجابي للنص المترابط منطقياً ودلالياً",
            ["vocabulary"], 2,
            "كيف تصف نصاً تترابط أفكاره بتسلسل منطقي سليم وسلس؟",
            "El texto está muy bien organizado y presenta un desarrollo _____.",
            "النص منظم جداً ويعرض تسلسلاً ...",
            [
                opt("a", "coherente", "متماسكاً ومنطقياً (الصواب)", True),
                opt("b", "postura", "موقف (اسم)", False, "نحتاج صفة تصف التسلسل un desarrollo coherente."),
                opt("c", "tesis", "أطروحة", False, "coherente هي الصفة الدالة على التماسك.")
            ],
            ["coherente", "postura", "tesis"],
            "un texto coherente يعني نصاً متماسكاً ومترابط الأفكار منطقياً."
        ),
        order_ex(
            "ex-b1-red-4",
            "رتّب الجملة لوصف الدفاع بالحجج المنطقية عن الموقف المتبنى",
            ["grammar", "writing"], 2,
            ["Supo", "argumentar", "su", "postura", "con", "gran", "claridad"],
            "Supo argumentar su postura con gran claridad",
            "الترتيب: الفعل Supo ثم المصدر argumentar ثم المفعول su postura ثم con gran claridad.",
            ["argumentar", "postura"]
        ),
        choice_ex(
            "ex-b1-red-5", "listen_choose",
            "استمع للتسجيل وحدد نوع العمل التحريري والأطروحة المعروضة",
            ["listening", "vocabulary"], 2,
            "استمع لأستاذ الكتابة الأكاديمية يقيم عمل الطالب",
            "Has redactado un ensayo excelente con argumentos sólidos y bien estructurados.",
            "لقد حررت مقالاً ممتازاً بحجج متينة ومبنية على نحو رائع.",
            [
                opt("a", "ensayo", "المقال الفكري أو الأكاديمي (الصواب)", True),
                opt("b", "postura", "موقف فردي", False, "الأستاذ قيم المقال ككل (un ensayo excelente)."),
                opt("c", "conclusión", "خاتمة فقط", False, "التقييم يخص المقال بأكمله.")
            ],
            ["ensayo", "postura", "conclusión", "argumentar"],
            "الأستاذ قال: 'Has redactado un ensayo excelente'.",
            audioKey="pending/b1_ensayo_excelente_argumentos.mp3",
            speechEs="Has redactado un ensayo excelente con argumentos sólidos y bien estructurados."
        ),
        speak_ex(
            "ex-b1-red-6",
            "انطق خاتمتك المقنعة التي تلخص أطروحة المقال ببراعة",
            ["speaking", "pronunciation"], 2,
            "انطق الجملة الختامية التالية بثقة وإقناع للقراء:",
            "En conclusión, debemos adoptar una postura coherente y constructiva.",
            "ختاماً، يجب أن نتبنى موقفاً متماسكاً وبنّاءً.",
            "pending/b1_conclusion_postura_coherente.mp3",
            ["conclusión", "postura", "coherente"],
            "En conclusión, debemos adoptar una postura coherente y constructiva.",
            "انتبه لنطق حرف c في conclusión كـ ثاء ونطق النبرة الختامية الرزينة."
        )
    ]
    return lesson_doc(doc, exs, level="B1")
