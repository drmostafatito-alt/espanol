# -*- coding: utf-8 -*-
"""A2 Units 6 (Health & Medical Advice) and 7 (Housing & Direct Object Pronouns).
8 Lessons based on Aula Plus 2 Unidades 6 & 8 and Gramática del uso Capítulos 18-20, 35 & 40.
"""
from common import opt, choice_ex, fill_ex, order_ex, speak_ex, lesson_doc, review_block

# ==============================================================================
# UNIT 6: a2-u6-health (الطبيب والجسم والنصائح الطبية)
# ==============================================================================

def make_lesson_sintomas_medico():
    slug = "a2-sintomas-medico"
    doc = {
        "slug": slug,
        "unitSlug": "a2-u6-health",
        "levelCode": "A2",
        "titleAr": "وصف الأعراض عند الطبيب: التعبير عن الدوار والسعال والإنفلونزا",
        "titleEs": "Describir síntomas ante el médico",
        "subtitleAr": "استخدام tener مع الأعراض المركبة: tener tos, tener gripe, tener mareos",
        "order": 1,
        "estimatedMinutes": 18,
        "cefrLevel": "A2",
        "review": review_block(),
        "pedagogy": {
            "learningObjectivesAr": [
                "أن يصف المتعلم أعراض المرض المركبة بدقة للطبيب المعالج.",
                "أن يستخدم الفعل tener مع الحالات الصحية: tener gripe, tener tos, tener mareos, tener décimas de fiebre.",
                "أن يميز بين الأعراض المؤقتة (estar resfriado, estar mareado) والأمراض المستمرة."
            ],
            "grammarPoints": [
                {
                    "titleAr": "التعبير عن الأعراض بفعل Tener و Estar",
                    "explanationAr": "في الإسبانية، نعبر عن معظم الأعراض المرضية باستخدام الفعل **tener** متبوعاً باسم العرض بدون أداة:\n- Tengo tos (عندي كحة / سعال).\n- Tengo gripe (عندي إنفلونزا).\n- Tengo mareos (أشعر بدوار / دوخة).\nبينما نستخدم **estar** مع الصفات التي تصف حالة المريض المتغيرة:\n- Estoy mareado / mareada (أنا دايخ / أشعر بالدوار).\n- Estoy resfriado (أنا مصاب بالزكام).\n- Estoy cansado (أنا مرهق)."
                }
            ],
            "commonMistakesAr": [
                "استخدام soy بدلاً من estoy لوصف حالة المرض (الصواب: estoy enfermo/a، والخطأ: *soy enfermo*).",
                "وضع أداة نكرة قبل اسم العرض بعد tener (الصحيح: tengo tos، وليس *tengo una tos* إلا إذا وصفتها: tengo una tos muy fuerte)."
            ],
            "dialectNotes": [
                {
                    "region": "EG",
                    "noteAr": "في مصر نقول: «عندي كحة شديدة ودور إنفلونزا، وحاسس بدوخة». في الإسبانية: Tengo tos y gripe, y estoy mareado."
                }
            ],
            "culturalNoteAr": "في النظام الصحي الإسباني (la Seguridad Social)، الخطوة الأولى هي حجز موعد مع طبيب الأسرة (el médico de cabecera) في المركز الصحي (el centro de salud)."
        },
        "contentBlocks": [
            {
                "id": f"cb-{slug}-intro",
                "type": "explanation",
                "titleAr": "الأعراض المرضية لدى الطبيب",
                "bodyAr": "أهم الأعراض والمفردات الطبية:\n- **la gripe**: الإنفلونزا / النزلة الحادة\n- **la tos**: الكحة / السعال\n- **el mareo**: الدوار / الدوخة (estar mareado)\n- **la temperatura**: درجة الحرارة\n- **el síntoma**: العَرَض المرضي (كلمة مذكرة: un síntoma)\n- **la receta médica**: الروشتة / الوصفة الطبية",
                "examples": [
                    {"es": "El paciente tiene mucha tos y fiebre.", "ar": "المريض لديه سعال شديد وحمى."},
                    {"es": "Me siento mareado desde esta mañana.", "ar": "أشعر بالدوار منذ هذا الصباح."},
                    {"es": "¿Cuáles son los síntomas principales?", "ar": "ما هي الأعراض الرئيسية؟"}
                ]
            }
        ],
        "newVocabulary": ["gripe", "tos", "mareo", "temperatura", "receta médica", "síntoma"],
        "reviewVocabulary": ["dolor", "fiebre"]
    }

    exs = [
        choice_ex(
            "ex-a2-sin-1", "word_choice",
            "اختر الفعل الصحيح للتعبير عن الحالة المرضية المتغيرة",
            ["grammar"], 1,
            "أي فعل كينونة نستخدم عندما نشعر بدوار مؤقت؟",
            "No puedo levantarme porque _____ muy mareado hoy.",
            "لا أستطيع النهوض لأنني ... بالدوار الشديد اليوم.",
            [
                opt("a", "estoy", "يعبر عن الحالة الصحية المتغيرة (الصواب)", True),
                opt("b", "soy", "يعبر عن الصفات الدائمة والهوية", False, "المرض حالة مؤقتة تأخذ estar وليس ser."),
                opt("c", "tengo", "يحتاج اسماً بعده وليس صفة", False, "mareado صفة تأتي بعد estar، أما الاسم فهو tener mareo.")
            ],
            ["mareo"],
            "مع الصفات الصحية المؤقتة نستخدم دائماً الفعل estar: estoy mareado."
        ),
        fill_ex(
            "ex-a2-sin-2",
            "اكتب الكلمة الإسبانية الدالة على السعال والكحة",
            ["vocabulary", "writing"], 1,
            "اكتب كلمة 'السعال / الكحة' بالإسبانية (بدون أداة)",
            "Tengo una _____ seca que no me deja dormir.",
            "لدي كحة جافة لا تدعني أنام.",
            ["tos"],
            ["tos"],
            "كلمة tos تعني السعال أو الكحة وهي مؤنثة (la tos)."
        ),
        choice_ex(
            "ex-a2-sin-3", "word_choice",
            "حدد نوع الكلمة síntoma وتذكيرها",
            ["grammar", "vocabulary"], 2,
            "كلمة síntoma تنتهي بـ -ma وهي من أصل يوناني، فما هي أداتها الصحيحة؟",
            "La fiebre alta es _____ más claro de la infección.",
            "الحمى المرتفعة هي ... الأوضح للعدوى.",
            [
                opt("a", "el síntoma", "مذكر مفرد (الصواب)", True),
                opt("b", "la síntoma", "مؤنث (خطأ شائع)", False, "الكلمات المنتهية بـ -ma من أصل يوناني مذكرة: el síntoma, el problema."),
                opt("c", "las síntomas", "جمع مؤنث", False, "الاسم مفرد مذكر.")
            ],
            ["síntoma", "fiebre"],
            "كلمة síntoma مذكرة في الإسبانية وتأخذ أداة التعريف el: el síntoma."
        ),
        order_ex(
            "ex-a2-sin-4",
            "رتّب الجملة لوصف الإصابة بنزلة إنفلونزا شديدة",
            ["grammar", "writing"], 2,
            ["Tengo", "gripe", "y", "mucha", "temperatura", "alta"],
            "Tengo gripe y mucha temperatura alta",
            "الترتيب السليم: الفعل Tengo ثم المرض gripe ثم أداة العطف y والاسم والصفة mucha temperatura alta.",
            ["gripe", "temperatura"]
        ),
        choice_ex(
            "ex-a2-sin-5", "listen_choose",
            "استمع وحدد ما طلبه الصيدلي لصرف الدواء",
            ["listening", "vocabulary"], 2,
            "استمع للتسجيل وحدد الوثيقة الطبية المطلوبة",
            "Para este medicamento necesita una receta médica.",
            "لهذا الدواء تحتاج إلى وصفة طبية.",
            [
                opt("a", "receta médica", "روشتة طبية", True),
                opt("b", "síntoma", "عرض", False, "المتحدث طلب الوصفة الطبية المعتمدة receta médica."),
                opt("c", "temperatura", "حرارة", False, "المتحدث تحدث عن إذن صرف الدواء.")
            ],
            ["receta médica", "síntoma", "temperatura"],
            "المتحدث قال بوضوح: necesita una receta médica.",
            audioKey="pending/a2_receta_medica.mp3",
            speechEs="Para este medicamento necesita una receta médica."
        ),
        speak_ex(
            "ex-a2-sin-6",
            "انطق شكواك للطبيب بوضوح",
            ["speaking", "pronunciation"], 2,
            "أخبر الطبيب بأنك تعاني من الإنفلونزا والسعال منذ يومين",
            "Doctor, tengo gripe y mucha tos.",
            "يا دكتور، لدي إنفلونزا وسعال شديد.",
            "pending/a2_doctor_tengo_gripe.mp3",
            ["gripe", "tos"],
            "Doctor, tengo gripe y mucha tos.",
            "احرص على نطق حرف g في gripe برقة ونطق حرف o في tos بوضوح تام."
        )
    ]
    return lesson_doc(doc, exs)

def make_lesson_dar_consejos_deber():
    slug = "a2-dar-consejos-deber"
    doc = {
        "slug": slug,
        "unitSlug": "a2-u6-health",
        "levelCode": "A2",
        "titleAr": "تقديم النصائح الطبية والتوجيهات بـ Deber و Tener que و Hay que",
        "titleEs": "Dar consejos médicos: deber, tener que y hay que",
        "subtitleAr": "التفريق بين الالتزام الأخلاقي (deber) والضرورة (tener que) والإلزام العام (hay que)",
        "order": 2,
        "estimatedMinutes": 18,
        "cefrLevel": "A2",
        "review": review_block(),
        "pedagogy": {
            "learningObjectivesAr": [
                "أن يوجه المتعلم نصائح وإرشادات صحية باستخدام: debes + مصدر (ينبغي عليك).",
                "أن يعبر عن الضرورة الشخصية باستخدام: tienes que + مصدر (يجب عليك).",
                "أن يطبق الإلزام العام غير الشخصي بـ: hay que + مصدر (يجب / ينبغي بشكل عام)."
            ],
            "grammarPoints": [
                {
                    "titleAr": "صيغ التوجيه والنصيحة الطبية",
                    "explanationAr": "تتدرج النصائح الطبية في الإسبانية حسب درجة الإلزام والأسلوب:\n1. **Deber + infinitivo** (نصيحة مهذبة / ينبغي):\n- Debes descansar más (ينبغي عليك أن ترتاح أكثر).\n- No debes fumar (لا ينبغي لك التدخين).\n2. **Tener que + infinitivo** (ضرورة مؤكدة وموجهة لشخص محدد):\n- Tienes que tomar la pastilla cada ocho horas (عليك تناول القرص كل 8 ساعات).\n3. **Hay que + infinitivo** (قاعدة عامة لجميع الناس دون فاعل محدد):\n- Hay que beber dos litros de agua al día (يجب شرب لترين من الماء يومياً)."
                }
            ],
            "commonMistakesAr": [
                "تصريف الفعل الثاني بعد deber أو tener que (الصواب دائماً بقاء الفعل الثاني في المصدر).\n- نسيان حرف الجر que مع tener (ممنوع قول *tienes tomar*؛ الصواب: tienes que tomar)."
            ],
            "dialectNotes": [
                {
                    "region": "EG",
                    "noteAr": "في مصر نقول: «لازم تريّح في السرير وتاخد الدوا / المفروض تشرب مية كتير». في الإسبانية: Tienes que guardar cama / Debes beber mucha agua."
                }
            ],
            "culturalNoteAr": "الأطباء في إسبانيا يركزون بشدة على الراحة في الفراش (guardar cama) وشرب السوائل الدافئة والشوربة التقليدية (el caldo) كجزء أساسي من العلاج."
        },
        "contentBlocks": [
            {
                "id": f"cb-{slug}-intro",
                "type": "explanation",
                "titleAr": "أفعال النصيحة والإرشاد الطبي",
                "bodyAr": "التراكيب الأساسية للنصيحة الصحية:\n- **deber + مصدر**: ينبغي / يجب (debes descansar)\n- **tener que + مصدر**: يلزمك / يجب عليك (tienes que tomar)\n- **hay que + مصدر**: يجب عموماً\n- **guardar cama**: يلزم الفراش / يستريح في السرير\n- **cuidar / cuidarse**: يعتني بـ / يحافظ على صحته\n- **saludable**: صحي / مفيد للصحة",
                "examples": [
                    {"es": "Debes guardar cama durante tres días.", "ar": "ينبغي عليك ملازمة الفراش مدة ثلاثة أيام."},
                    {"es": "Tienes que cuidar tu alimentación.", "ar": "عليك أن تعتني بغذائك."},
                    {"es": "Hay que llevar una vida saludable.", "ar": "يجب اتباع نمط حياة صحي."}
                ]
            }
        ],
        "newVocabulary": ["deber", "debes", "debe", "guardar cama", "cuidar", "saludable"],
        "reviewVocabulary": ["cada", "pastilla"]
    }

    exs = [
        choice_ex(
            "ex-a2-deb-1", "word_choice",
            "اختر صيغة النصيحة المناسبة الموجهة للمريض",
            ["grammar"], 1,
            "ما هي صيغة الفعل deber الموجهة للمخاطب tú لتقديم نصيحة؟",
            "Para curarte rápido, _____ descansar este fin de semana.",
            "لتشفى بسرعة، ... أن ترتاح في عطلة نهاية هذا الأسبوع.",
            [
                opt("a", "debes", "ينبغي عليك (الصواب مع tú)", True),
                opt("b", "debe", "صيغة المفرد الغائب أو usted", False, "الخطاب هنا موجه لصديق بصيغة tú فتكون debes."),
                opt("c", "debemos", "صيغة الجمع نحن", False, "debemos تعني ينبغي علينا نحن.")
            ],
            ["deber", "debes"],
            "مع ضمير المخاطب tú نستخدم صيغة debes لتقديم النصيحة: debes descansar."
        ),
        fill_ex(
            "ex-a2-deb-2",
            "اكتب الحرف الإلزامي في تركيب ضرورة tener que",
            ["grammar", "writing"], 1,
            "اكتب الكلمة الناقصة بعد tienes ليكتمل تركيب الإلزام",
            "Tienes _____ tomar una pastilla cada ocho horas.",
            "عليك ... تتناول قرصاً كل ثماني ساعات.",
            ["deber", "pastilla"],
            ["que"],
            "التركيب النحوي الدال على الضرورة هو tener que + infinitivo."
        ),
        choice_ex(
            "ex-a2-deb-3", "word_choice",
            "اختر التعبير الدال على ملازمة الفراش للراحة",
            ["vocabulary", "reading"], 2,
            "ما هو التعبير الطبي الذي يطلبه الطبيب لمريض الإنفلونزا الشديدة؟",
            "El médico le ha dicho que tiene que _____ dos días.",
            "أخبره الطبيب أن عليه أن ... مدة يومين.",
            [
                opt("a", "guardar cama", "يلازم الفراش / يستريح في السرير", True),
                opt("b", "saludable", "صحي (صفة)", False, "saludable صفة ولا تكمل معنى النشاط المطلوب هنا."),
                opt("c", "deber", "يجب", False, "deber فعل ولا يصح وضعه بعد tiene que مباشرة.")
            ],
            ["guardar cama", "saludable", "deber"],
            "التعبير الطبي لملازمة الفراش هو guardar cama."
        ),
        order_ex(
            "ex-a2-deb-4",
            "رتّب الجملة للتأكيد على ضرورة شرب الماء لاتباع حياة صحية",
            ["grammar", "writing"], 2,
            ["Hay", "que", "beber", "agua", "para", "estar", "saludable"],
            "Hay que beber agua para estar saludable",
            "الترتيب السليم: أداة الإلزام العام Hay que ثم المصدر beber ثم agua ثم الغرض para estar saludable.",
            ["saludable"]
        ),
        choice_ex(
            "ex-a2-deb-5", "listen_choose",
            "استمع وحدد نصيحة الطبيب للمريض",
            ["listening", "vocabulary"], 2,
            "استمع لتعليمات الطبيب وحدد ما يوصي به",
            "Usted debe cuidar su salud y no trabajar tanto.",
            "حضرتك ينبغي أن تعتني بصحتك وألا تعمل كثيراً.",
            [
                opt("a", "cuidar", "يعتني / يحافظ على", True),
                opt("b", "guardar cama", "يلازم الفراش", False, "الطبيب قال تحديداً: debe cuidar su salud."),
                opt("c", "pastilla", "قرص دواء", False, "الطبيب ركز على العناية بالصحة العامة.")
            ],
            ["cuidar", "debe", "guardar cama", "pastilla"],
            "الطبيب قال: debe cuidar su salud.",
            audioKey="pending/a2_debe_cuidar_salud.mp3",
            speechEs="Usted debe cuidar su salud y no trabajar tanto."
        ),
        speak_ex(
            "ex-a2-deb-6",
            "انطق نصيحتك لزميلك المريض",
            ["speaking", "pronunciation"], 2,
            "انصح زميلك بأن يرتاح في البيت لكي يشفى بسرعة",
            "Debes descansar en casa hoy.",
            "ينبغي عليك أن ترتاح في البيت اليوم.",
            "pending/a2_debes_descansar_casa.mp3",
            ["debes"],
            "Debes descansar en casa hoy.",
            "احرص على نطق حرف b كـ ذال خفيفة أو صوت شفوي رقيق بين الصائتين في debes."
        )
    ]
    return lesson_doc(doc, exs)

def make_lesson_imperativo_salud():
    slug = "a2-imperativo-salud"
    doc = {
        "slug": slug,
        "unitSlug": "a2-u6-health",
        "levelCode": "A2",
        "titleAr": "صيغة الأمر الإيجابي للنصائح الطبية: Imperativo Afirmativo",
        "titleEs": "El imperativo afirmativo para la salud",
        "subtitleAr": "تصريف الأمر المباشر مع tú (toma, bebe, descansa) وإرشادات العلاج",
        "order": 3,
        "estimatedMinutes": 18,
        "cefrLevel": "A2",
        "review": review_block(),
        "pedagogy": {
            "learningObjectivesAr": [
                "أن يصوغ المتعلم صيغة الأمر الإيجابي للمخاطب tú: أفعال -ar تأخذ -a (toma, descansa)، وأفعال -er/-ir تأخذ -e (bebe, come, duerme).",
                "أن يفهم وينفذ التعليمات الطبية المباشرة المكتوبة على علب الدواء.",
                "أن يوظف أفعال العناية الصحية: tomar, beber, comer, descansar, dormir, evitar."
            ],
            "grammarPoints": [
                {
                    "titleAr": "قاعدة الأمر الإيجابي المنتظم مع Tú",
                    "explanationAr": "صيغة الأمر الإيجابي مع ضمير المخاطب tú تطابق تماماً تصريف الغائب المفرد (él/ella) في زمن المضارع البسيط:\n- أفعال **-ar**: تأخذ النهاية **-a**:\n  - tomar -> **Toma** (تناول / خذ)\n  - descansar -> **Descansa** (استرح)\n  - evitar -> **Evita** (تجنب)\n- أفعال **-er / -ir**: تأخذ النهاية **-e**:\n  - beber -> **Bebe** (اشرب)\n  - comer -> **Come** (كُل)\n  - dormir (ue) -> **Duerme** (نَم كفاية)\nتُستخدم هذه الصيغة للأوامر والنصائح الحانية والتعليمات الطبية المباشرة."
                }
            ],
            "commonMistakesAr": [
                "وضع s في نهاية الأمر مع tú (الصواب: toma و bebe، والخطأ: *tomas* أو *bebes*؛ فالـ s للمضارع الخبري وليس للأمر).",
                "عكس النهايات (وضع -e لأفعال -ar أو -a لأفعال -er؛ تذكر: أمر tú هو نفس شكل مضارع él بالضبط)."
            ],
            "dialectNotes": [
                {
                    "region": "EG",
                    "noteAr": "في مصر يقول الطبيب: «اشرب مية كتير، ونام بدري، وخد الدوا في ميعاده». في الإسبانية بصيغة الأمر: Bebe mucha agua, duerme bien y toma la medicina a su hora."
                }
            ],
            "culturalNoteAr": "في إسبانيا صيغة الأمر الإيجابي الودي (toma, come) لا تُعد وقاحة أو تحكماً، بل تعبر عن حرص شديد واهتمام ومحبة من الصديق أو الطبيب تجاه المريض."
        },
        "contentBlocks": [
            {
                "id": f"cb-{slug}-intro",
                "type": "explanation",
                "titleAr": "الأمر الطبي والإرشادات",
                "bodyAr": "أهم أفعال الأمر للنصائح الصحية:\n- **Toma**: خذ / تناول (Toma esta medicina)\n- **Bebe**: اشرب (Bebe muchos líquidos)\n- **Come**: كُل (Come fruta fresca)\n- **Descansa**: استرح (Descansa todo lo que puedas)\n- **Duerme**: نَم (Duerme ocho horas al día)\n- **Evita**: تجنب / ابتعد عن (Evita el estrés)",
                "examples": [
                    {"es": "Toma este jarabe antes de dormir.", "ar": "تناول هذا الشراب قبل النوم."},
                    {"es": "Bebe mucha agua durante el día.", "ar": "اشرب ماء كثيراً خلال اليوم."},
                    {"es": "Evita las comidas muy pesadas.", "ar": "تجنب الوجبات الدسمة جداً."}
                ]
            }
        ],
        "newVocabulary": ["toma", "bebe", "come", "descansa", "duerme", "evita"],
        "reviewVocabulary": ["agua", "medicina"]
    }

    exs = [
        choice_ex(
            "ex-a2-imp-1", "word_choice",
            "اختر صيغة الأمر المثبت المناسبة للمخاطب الودي (tú)",
            ["grammar"], 1,
            "ما هي صيغة الأمر الموجه للمخاطب المفرد من الفعل tomar؟",
            "¡_____ esta pastilla con un vaso de agua!",
            "تناول هذا القرص مع كوب ماء!",
            [
                opt("a", "Toma", "صيغة الأمر الإيجابي مع tú (الصواب)", True),
                opt("b", "Tomas", "مضارع خبري وليس أمراً", False, "في الأمر مع tú تحذف s فتصبح Toma."),
                opt("c", "Tome", "صيغة أمر الاحترام مع usted", False, "الخطاب هنا موجه لصيغة tú الودية.")
            ],
            ["toma", "agua"],
            "أمر tú من أفعال -ar ينتهي بـ -a مثل مضارع الغائب: Toma."
        ),
        fill_ex(
            "ex-a2-imp-2",
            "اكتب صيغة الأمر المناسبة لشرب السوائل مع tú",
            ["grammar", "writing"], 1,
            "اكتب صيغة الأمر الإيجابي مع tú من الفعل beber (ينتهي بـ -e)",
            "Para no deshidratarte, _____ mucho líquido hoy.",
            "لكي لا تصاب بالجفاف، ... سوائل كثيرة اليوم.",
            ["bebe"],
            ["bebe"],
            "صيغة الأمر من أفعال -er مع tú تنتهي بـ -e: bebe."
        ),
        choice_ex(
            "ex-a2-imp-3", "word_choice",
            "اختر الفعل الدال على التحذير وتجنب الشيء الضار",
            ["vocabulary", "reading"], 2,
            "ما هو فعل الأمر الذي ينصح بالابتعاد عن التوتر؟",
            "Para proteger tu corazón, _____ las situaciones de estrés.",
            "لحماية قلبك، ... مواقف التوتر والضغط.",
            [
                opt("a", "evita", "تجنب / ابتعد عن", True),
                opt("b", "come", "كُل", False, "come تعني تناول الطعام ولا تصلح مع التوتر."),
                opt("c", "bebe", "اشرب", False, "bebe للشرب فقط.")
            ],
            ["evita", "come", "bebe"],
            "فعل الأمر evita مشتق من evitar ويعني تجنب أو تفادَ."
        ),
        order_ex(
            "ex-a2-imp-4",
            "رتّب الجملة لتقديم نصيحة طبية بالنوم والراحة",
            ["grammar", "writing"], 2,
            ["Duerme", "ocho", "horas", "y", "descansa", "bien"],
            "Duerme ocho horas y descansa bien",
            "الترتيب السليم: أمر الفعل الأول Duerme ثم الساعات ocho horas ثم أداة العطف y وأمر الفعل الثاني descansa bien.",
            ["duerme", "descansa"]
        ),
        choice_ex(
            "ex-a2-imp-5", "listen_choose",
            "استمع وحدد ما نصح به الطبيب",
            ["listening", "vocabulary"], 2,
            "استمع للتسجيل وحدد التعليمات الموجهة للمريض",
            "Descansa en casa y toma la medicina a tiempo.",
            "استرح في البيت وتناول الدواء في وقته.",
            [
                opt("a", "descansa", "استرح", True),
                opt("b", "come", "كُل", False, "المتحدث قال descansa وليس come."),
                opt("c", "duerme", "نم", False, "المتحدث بدأ بنصيحة الراحة المنزلية descansa.")
            ],
            ["descansa", "medicina", "come", "duerme"],
            "المتحدث قال: Descansa en casa y toma la medicina.",
            audioKey="pending/a2_descansa_en_casa.mp3",
            speechEs="Descansa en casa y toma la medicina a tiempo."
        ),
        speak_ex(
            "ex-a2-imp-6",
            "انطق التوجيه الطبي بثقة",
            ["speaking", "pronunciation"], 2,
            "انطق الأمر بتناول الطعام الصحي بوضوح",
            "Come comida sana y bebe mucha agua.",
            "تناول طعاماً صحياً واشرب ماءً كثيراً.",
            "pending/a2_come_sano_bebe.mp3",
            ["come", "bebe", "agua"],
            "Come comida sana y bebe mucha agua.",
            "تذكر إسقاط النبر على المقطع الأول في cOme و bEbe."
        )
    ]
    return lesson_doc(doc, exs)

def make_lesson_consulta_medica():
    slug = "a2-consulta-medica"
    doc = {
        "slug": slug,
        "unitSlug": "a2-u6-health",
        "levelCode": "A2",
        "titleAr": "محاكاة زيارة العيادة: الحوار الطبي بين الطبيب والمريض",
        "titleEs": "En la consulta médica: diálogo y tratamiento",
        "subtitleAr": "إجراء فحص طبي كامل ومناقشة التحاليل والعلاج والتحسن",
        "order": 4,
        "estimatedMinutes": 18,
        "cefrLevel": "A2",
        "review": review_block(),
        "pedagogy": {
            "learningObjectivesAr": [
                "أن يدير المتعلم حواراً متكاملاً داخل العيادة الطبية (la consulta).",
                "أن يفهم أسئلة الطبيب حول التاريخ المرضي وفترة الأعراض والتحاليل (los análisis).",
                "أن يستوعب خطة العلاج (el tratamiento) وتوقعات التحسن (mejorar)."
            ],
            "grammarPoints": [
                {
                    "titleAr": "أسئلة العيادة وصيغ التحسن والعلاج",
                    "explanationAr": "العبارات النمطية داخل العيادة الطبية:\n- الطبيب يسأل: ¿Desde cuándo le duele? (منذ متى يؤلمك هذا؟) / ¿Qué síntomas tiene? (ما هي الأعراض التي تعاني منها؟).\n- الفحص السريري: Voy a auscultarle (سأفحص نبضك ورئتيك) / Abra la boca (افتح فمك).\n- التوجيه بالعلاج: Vamos a hacer unos análisis de sangre (سنجري بعض تحاليل الدم) / Debe seguir este tratamiento (عليك اتباع هذا العلاج).\n- المتابعة: Si no mejora en tres días, vuelva a la consulta (إذا لم تتحسن خلال 3 أيام، عُد للعيادة)."
                }
            ],
            "commonMistakesAr": [
                "استخدام tiempo بدلاً من cuándo بعد desde للسؤال عن بداية الألم (الصحيح: ¿Desde cuándo le duele?).",
                "تأنيث palabra كـ análisis (análisis كلمة مذكرة مفردها وجمعها متماثل: el análisis / los análisis)."
            ],
            "dialectNotes": [
                {
                    "region": "EG",
                    "noteAr": "في مصر يسأل الطبيب: «خير بتشتكي من إيه ومن امتى؟ محتاجين نعمل تحاليل ونمشي على العلاج ده وإن شاء الله تخف». في الإسبانية نفس الخطوات في الكشف الطبي."
                }
            ],
            "culturalNoteAr": "في إسبانيا يحظى الأطباء باحترام كبير، وتُستخدم صيغة usted مع الأطباء غير المعارف، ولكن الأطباء أنفسهم قد يستخدمون صيغة tú اللطيفة لتهدئة روع المريض وبث الطمأنينة."
        },
        "contentBlocks": [
            {
                "id": f"cb-{slug}-intro",
                "type": "explanation",
                "titleAr": "مصطلحات الكشف والعلاج",
                "bodyAr": "المفردات التخصصية للعيادة:\n- **la consulta**: عيادة الطبيب / الكشف الطبي\n- **el paciente**: المريض\n- **los análisis**: التحاليل والفحوصات المخبرية\n- **la enfermedad**: المرض\n- **el tratamiento**: العلاج / خطة الاستشفاء\n- **mejorar**: يتحسن / يتماثل للشفاء",
                "examples": [
                    {"es": "El doctor atiende al paciente en la consulta.", "ar": "الطبيب يستقبل المريض في العيادة."},
                    {"es": "Los resultados de los análisis son normales.", "ar": "نتائج التحاليل طبيعية."},
                    {"es": "Espero que mejores pronto con este tratamiento.", "ar": "آمل أن تتحسن قريباً مع هذا العلاج."}
                ]
            }
        ],
        "newVocabulary": ["consulta", "paciente", "análisis", "enfermedad", "tratamiento", "mejorar"],
        "reviewVocabulary": ["hospital", "médico"]
    }

    exs = [
        choice_ex(
            "ex-a2-med-1", "word_choice",
            "اختر الكلمة المناسبة لعيادة الطبيب وغرفة الكشف",
            ["vocabulary"], 1,
            "أين يستقبل الطبيب المريض لإجراء الفحص الطبي؟",
            "El doctor recibe al paciente en la _____ médica.",
            "الطبيب يستقبل المريض في ... الطبية.",
            [
                opt("a", "consulta", "العيادة / غرفة الفحص (الصواب)", True),
                opt("b", "enfermedad", "مرض", False, "enfermedad تعني المرض نفسه وليس مكان الفحص."),
                opt("c", "análisis", "تحاليل", False, "análisis هي الفحوصات وليست العيادة.")
            ],
            ["consulta", "paciente", "enfermedad"],
            "المكان الذي يمارس فيه الطبيب كشفه يُسمى la consulta."
        ),
        fill_ex(
            "ex-a2-med-2",
            "اكتب الفعل الإسباني الذي يعني 'يتحسن ويتعافى'",
            ["vocabulary", "writing"], 1,
            "اكتب الفعل المصدر الذي يعني 'يتحسن / يتماثل للشفاء'",
            "Con este tratamiento vas a _____ en pocos días.",
            "مع هذا العلاج سوف ... في غضون أيام قليلة.",
            ["mejorar"],
            ["mejorar"],
            "الفعل mejorar يعني يتحسن وتتحسن حالته الصحية."
        ),
        choice_ex(
            "ex-a2-med-3", "word_choice",
            "حدد أداة التعريف المناسبة لكلمة análisis",
            ["grammar"], 2,
            "كلمة análisis مذكرة، فما هي أداة التعريف للجمع؟",
            "El médico necesita ver _____ de sangre para dar el diagnóstico.",
            "الطبيب يحتاج لرؤية ... الدم لإعطاء التشخيص.",
            [
                opt("a", "los análisis", "جمع مذكر (الصواب)", True),
                opt("b", "las análisis", "جمع مؤنث (خطأ)", False, "análisis اسم مذكر في الإسبانية ولا يؤنث."),
                opt("c", "la análisis", "مفرد مؤنث", False, "الاسم مذكر ويأخذ los في الجمع.")
            ],
            ["análisis"],
            "كلمة análisis مذكرة وتأخذ los في الجمع: los análisis de sangre."
        ),
        order_ex(
            "ex-a2-med-4",
            "رتّب الجملة لوصف التزام المريض بالعلاج الموصوف",
            ["grammar", "writing"], 2,
            ["El", "paciente", "debe", "seguir", "el", "tratamiento"],
            "El paciente debe seguir el tratamiento",
            "الترتيب السليم: الفاعل El paciente ثم الفعل المساعد debe ثم المصدر seguir ثم المفعول به el tratamiento.",
            ["paciente", "tratamiento"]
        ),
        choice_ex(
            "ex-a2-med-5", "listen_choose",
            "استمع وحدد ما نصح به الطبيب عند عدم التحسن",
            ["listening", "vocabulary"], 2,
            "استمع لتوجيه الطبيب في نهاية الكشف",
            "Si no mejora en tres días, vuelva al hospital.",
            "إذا لم تتحسن خلال ثلاثة أيام، عُد إلى المستشفى.",
            [
                opt("a", "mejorar", "يتحسن", True),
                opt("b", "enfermedad", "مرض", False, "المتحدث اشترط عدم التحسن mejora."),
                opt("c", "consulta", "عيادة", False, "الشرط مبني على فعل التحسن.")
            ],
            ["mejorar", "hospital", "enfermedad", "consulta"],
            "الطبيب قال: Si no mejora en tres días, vuelva al hospital.",
            audioKey="pending/a2_si_no_mejora.mp3",
            speechEs="Si no mejora en tres días, vuelva al hospital."
        ),
        speak_ex(
            "ex-a2-med-6",
            "انطق تمنيك بالشفاء لزميلك المريض",
            ["speaking", "pronunciation"], 2,
            "تمنَّ لزميلك الشفاء العاجل باللغة الإسبانية بأسلوب ودود",
            "Espero que mejores pronto de tu enfermedad.",
            "آمل أن تتحسن قريباً من وعكتك الصحية.",
            "pending/a2_espero_mejores_pronto.mp3",
            ["mejorar", "enfermedad"],
            "Espero que mejores pronto de tu enfermedad.",
            "انتبه لنطق حرف j في mejores كـ خاء مرققة ونطق d في enfermedad كـ ذال خفيفة."
        )
    ]
    return lesson_doc(doc, exs)

# ==============================================================================
# UNIT 7: a2-u7-housing (السكن والبحث عن شقة والضمائر المباشرة)
# ==============================================================================

def make_lesson_tipos_vivienda():
    slug = "a2-tipos-vivienda"
    doc = {
        "slug": slug,
        "unitSlug": "a2-u7-housing",
        "levelCode": "A2",
        "titleAr": "أنواع السكن ومواصفات الشقق: piso و chalet و amueblado",
        "titleEs": "Tipos de vivienda y características del piso",
        "subtitleAr": "تصنيف المساكن (شقة، شاليه، استوديو) ومواصفاتها (مفروش، مشمس، شرفة)",
        "order": 1,
        "estimatedMinutes": 18,
        "cefrLevel": "A2",
        "review": review_block(),
        "pedagogy": {
            "learningObjectivesAr": [
                "أن يسمّي المتعلم أنواع المساكن المختلفة في إسبانيا: piso, apartamento, chalet, estudio.",
                "أن يصف خصائص الشقة: amueblado (مفروش), luminoso (مشمس ومضيء), exterior (مطل على الشارع), con terraza (مع شرفة).",
                "أن يقرأ ويفهم إعلانات تأجير العقارات البسيطة."
            ],
            "grammarPoints": [
                {
                    "titleAr": "مصطلحات السكن والصفات العقارية",
                    "explanationAr": "في إسبانيا، تُستخدم مصطلحات سكنية مميزة:\n- **El piso**: الشقة السكنية العادية في عمارة (وهي الكلمة الأكثر شيوعاً).\n- **El apartamento**: شقة صغيرة (غرفة أو غرفتان، غالباً سياحية أو شاطئية).\n- **El chalet**: فيلا أو منزل مستقل بحديقة.\nصفات الشقة الهامة:\n- **amueblado / sin amueblar**: مفروش / بدون أثاث.\n- **exterior**: تطل غرفه على الشارع الخارجي (يدخلها ضوء وشمس كثيرة).\n- **interior**: تطل غرفه على فناء العمارة الداخلي (أكثر هدوءاً لكن أقل إضاءة).\n- **con terraza**: مزود بتراس أو شرفة واسعة."
                }
            ],
            "commonMistakesAr": [
                "ترجمة 'شقة' دائماً بـ apartamento؛ في إسبانيا الكلمة اليومية القياسية لشقة العيش الدائم هي piso.",
                "الخلط بين exterior (مطل على الشارع) و fuera (في الخارج كظرف مكان)."
            ],
            "dialectNotes": [
                {
                    "region": "EG",
                    "noteAr": "في مصر نقول: «بدور على شقة مفروشة وتكون منورة وببلكونة كبيرة». في الإسبانية: Busco un piso amueblado, luminoso y con terraza grande."
                }
            ],
            "culturalNoteAr": "الإسبان يعشقون الشرفات (las terrazas) والضوء الطبيعي؛ لذلك تجد إعلانات الشقق تضع كلمة «luminoso» و «exterior» كأهم ميزتين تنافسيتين لرفع الإيجار."
        },
        "contentBlocks": [
            {
                "id": f"cb-{slug}-intro",
                "type": "explanation",
                "titleAr": "أنواع المساكن ومميزاتها",
                "bodyAr": "المفردات العقارية الأساسية:\n- **el piso**: الشقة السكنية\n- **el apartamento**: الشقة الصغيرة / السياحية\n- **el chalet**: الفيلا المستقلة / المنزل بحديقة\n- **amueblado**: مفروش بالأثاث\n- **luminoso**: مشمس / مليء بالضوء الطبيعي\n- **la terraza**: الشرفة / التراس",
                "examples": [
                    {"es": "Alquilo un piso muy luminoso en el centro.", "ar": "أؤجر شقة مشمسة جداً في وسط المدينة."},
                    {"es": "Buscamos un chalet con jardín para el verano.", "ar": "نبحث عن فيلا بحديقة لفصل الصيف."},
                    {"es": "El apartamento está completamente amueblado.", "ar": "الشقة مفروشة بالكامل."}
                ]
            }
        ],
        "newVocabulary": ["piso", "apartamento", "chalet", "amueblado", "luminoso", "terraza"],
        "reviewVocabulary": ["habitación", "casa"]
    }

    exs = [
        choice_ex(
            "ex-a2-viv-1", "word_choice",
            "اختر المصطلح الإسباني الأكثر شيوعاً للشقة السكنية",
            ["vocabulary"], 1,
            "ما هي الكلمة القياسية في إسبانيا للشقة في مبنى سكني؟",
            "Vivo en un _____ de tres habitaciones en Madrid.",
            "أعيش في ... من ثلاث غرف في مدريد.",
            [
                opt("a", "piso", "شقة سكنية (الصواب)", True),
                opt("b", "chalet", "فيلا مستقلة بحديقة", False, "chalet منزل مستقل بحديقة وليس شقة في عمارة."),
                opt("c", "terraza", "شرفة (جزء من الشقة)", False, "terraza هي الشرفة وليست الشقة نفسها.")
            ],
            ["piso", "chalet", "terraza", "habitación"],
            "في إسبانيا كلمة piso هي الكلمة الشائعة للشقة السكنية."
        ),
        fill_ex(
            "ex-a2-viv-2",
            "اكتب الصفة الإسبانية للشقة المشمسة والمضيئة",
            ["vocabulary", "writing"], 1,
            "اكتب الصفة الإسبانية التي تعني 'مضيء / مشمس يدخله نور الشمس'",
            "El salón tiene grandes ventanas y es muy _____.",
            "غرفة الجلوس بها نوافذ كبيرة وهي ... جداً.",
            ["luminoso"],
            ["luminoso"],
            "الصفة luminoso تعني مشمساً ومضاءً بنور طبيعي وفير."
        ),
        choice_ex(
            "ex-a2-viv-3", "word_choice",
            "حدد الوصف المناسب للشقة المزودة بكافة الأثاث والأجهزة",
            ["vocabulary", "reading"], 2,
            "ماذا تسمى الشقة الجاهزة للسكن فوراً بكامل أثاثها؟",
            "El propietario alquila el piso totalmente _____.",
            "المالك يؤجر الشقة ... بالكامل بالأثاث.",
            [
                opt("a", "amueblado", "مفروشة بالأثاث", True),
                opt("b", "chalet", "فيلا", False, "chalet نوع سكن وليس صفة للأثاث."),
                opt("c", "apartamento", "شقة صغيرة", False, "المطلوب صفة توضح وجود الأثاث.")
            ],
            ["amueblado", "chalet", "apartamento"],
            "الصفة amueblado تعني مفروش بالأثاث (piso amueblado)."
        ),
        order_ex(
            "ex-a2-viv-4",
            "رتّب الجملة لوصف شقة جديدة ذات شرفة واسعة",
            ["grammar", "writing"], 2,
            ["Tenemos", "un", "apartamento", "bonito", "con", "terraza"],
            "Tenemos un apartamento bonito con terraza",
            "الترتيب السليم: الفعل Tenemos ثم الاسم والصفة un apartamento bonito ثم الإضافة con terraza.",
            ["apartamento", "terraza"]
        ),
        choice_ex(
            "ex-a2-viv-5", "listen_choose",
            "استمع وحدد ما يبحث عنه المستأجر",
            ["listening", "vocabulary"], 2,
            "استمع للتسجيل العقاري وحدد نوع المسكن المطلوب",
            "Queremos comprar un chalet tranquilo en las afueras.",
            "نريد شراء فيلا هادئة في الضواحي.",
            [
                opt("a", "chalet", "فيلا / منزل مستقل", True),
                opt("b", "piso", "شقة", False, "المشتري قال بوضوح: comprar un chalet."),
                opt("c", "apartamento", "شقة صغيرة", False, "المشتري طلب chalet في الضواحي.")
            ],
            ["chalet", "piso", "apartamento"],
            "المتحدث قال: comprar un chalet tranquilo.",
            audioKey="pending/a2_comprar_chalet.mp3",
            speechEs="Queremos comprar un chalet tranquilo en las afueras."
        ),
        speak_ex(
            "ex-a2-viv-6",
            "انطق مواصفات شقتك المفضلة",
            ["speaking", "pronunciation"], 2,
            "أخبر الوكيل العقاري بأنك تبحث عن شقة مفروشة ومشمسة",
            "Busco un piso amueblado y muy luminoso.",
            "أبحث عن شقة مفروشة ومضيئة جداً.",
            "pending/a2_piso_amueblado_luminoso.mp3",
            ["piso", "amueblado", "luminoso"],
            "Busco un piso amueblado y muy luminoso.",
            "احرص على نطق حرف s في piso و z في luminoso بنطق صافٍ غير مغلظ."
        )
    ]
    return lesson_doc(doc, exs)

def make_lesson_pronombres_objeto_directo():
    slug = "a2-pronombres-objeto-directo"
    doc = {
        "slug": slug,
        "unitSlug": "a2-u7-housing",
        "levelCode": "A2",
        "titleAr": "ضمائر المفعول به المباشر: Lo و La و Los و Las وموضعها",
        "titleEs": "Los pronombres de objeto directo (OD)",
        "subtitleAr": "استبدال الاسم المفعول بالضمير المناسب وموضعه قبل الفعل المصرف",
        "order": 2,
        "estimatedMinutes": 18,
        "cefrLevel": "A2",
        "review": review_block(),
        "pedagogy": {
            "learningObjectivesAr": [
                "أن يحدد المتعلم المفعول المباشر ويستبدله بالضمير المناسب: lo (مفرد مذكر), la (مفرد مؤنث), los (جمع مذكر), las (جمع مؤنث).",
                "أن يضع الضمير في موضعه النحوي الصحيح: قبل الفعل المصرف مباشرة (Lo compro, La alquilo).",
                "أن يستخدم الضمائر لتجنب التكرار الركيك في المحادثات العقارية والتسوقية."
            ],
            "grammarPoints": [
                {
                    "titleAr": "قواعد ضمائر المفعول به المباشر (OD)",
                    "explanationAr": "تُستخدم ضمائر المفعول المباشر للحلول محل اسم سبق ذكره وتفادي تكراره:\n- للمفرد المذكر: **lo** (¿Compras el piso? -> Sí, **lo** compro).\n- للمفرد المؤنث: **la** (¿Alquilas la casa? -> Sí, **la** alquilo).\n- للجمع المذكر: **los** (¿Ves los apartamentos? -> Sí, **los** veo).\n- للجمع المؤنث: **las** (¿Buscas las llaves? -> Sí, **las** busco).\nموضع الضمير:\n1. قبل الفعل المصرف مباشرة ككلمة منفصلة: **Lo** compro.\n2. في النفي يأتي الضمير بين no والفعل: No **lo** compro.\n3. مع المصدر يمكن أن يلتصق بنهايته: Quiero comprar**lo** أو **Lo** quiero comprar."
                }
            ],
            "commonMistakesAr": [
                "وضع الضمير بعد الفعل المصرف (مثل قول *compro lo*؛ هذا خطأ فاحش في الإسبانية، الصواب دائماً: lo compro).",
                "الخلط بين lo (للمفعول المذكر) و le (ضمير المفعول غير المباشر، أو ظاهرة Leísmo في بعض مناطق إسبانيا)."
            ],
            "dialectNotes": [
                {
                    "region": "EG",
                    "noteAr": "في مصر نقول: «الشقة دي عجبتني وأنا حأجرها، والبيت ده شفته». الهاء في 'حأجرها' هي la، وفي 'شفته' هي lo: La alquilo / Lo he visto."
                }
            ],
            "culturalNoteAr": "في إسبانيا استخدام ضمائر المفعول المباشر علامة على طلاقة المتحدث وفصاحته، وتكرار الاسم الصريح مرتين في نفس الجملة يعتبر ركاكة أسلوبية واضحة."
        },
        "contentBlocks": [
            {
                "id": f"cb-{slug}-intro",
                "type": "explanation",
                "titleAr": "ضمائر المفعول به المباشر",
                "bodyAr": "الضمائر الأربعة الأساسية واستبدالها:\n- **lo**: يحل محل المفرد المذكر (el piso -> lo)\n- **la**: يحل محل المفرد المؤنث (la casa -> la)\n- **los**: يحل محل الجمع المذكر (los libros -> los)\n- **las**: يحل محل الجمع المؤنث (las llaves -> las)\n- **alquilar**: يؤجر / يستأجر\n- **vender**: يبيع",
                "examples": [
                    {"es": "El piso es muy caro, no lo voy a alquilar.", "ar": "الشقة غالية جداً، لن أستأجرها."},
                    {"es": "¿Has visto esa casa? Sí, la he visto hoy.", "ar": "¿هل رأيت ذلك البيت؟ نعم، رأيته اليوم."},
                    {"es": "Estas llaves son mías, las necesito.", "ar": "هذه المفاتيح لي، أحتاج إليها."}
                ]
            }
        ],
        "newVocabulary": ["lo", "la", "los", "las", "alquilar", "vender"],
        "reviewVocabulary": ["comprar", "buscar"]
    }

    exs = [
        choice_ex(
            "ex-a2-pod-1", "word_choice",
            "اختر ضمير المفعول المناسب للشقة المفردة المؤنثة la casa",
            ["grammar"], 1,
            "ما هو الضمير الذي يحل محل la casa في الجملة؟",
            "Esta casa me gusta mucho y voy a comprar_____ mañana.",
            "هذا البيت يعجبني كثيراً وسوف أشتريه غداً.",
            [
                opt("a", "la", "ضمير المفرد المؤنث المتصل بالمصدر (الصواب)", True),
                opt("b", "lo", "ضمير المفرد المذكر", False, "casa كلمة مؤنثة فيحل محلها la وليس lo."),
                opt("c", "las", "ضمير الجمع المؤنث", False, "casa اسم مفرد وليس جمعاً.")
            ],
            ["la", "lo", "comprar"],
            "كلمة casa مؤنثة مفردة، فيحل محلها ضمير المفعول المباشر la ملتصقاً بالمصدر: comprarla."
        ),
        fill_ex(
            "ex-a2-pod-2",
            "اكتب ضمير المفعول المباشر الذي يحل محل el piso",
            ["grammar", "writing"], 1,
            "اكتب ضمير المفعول المباشر الذي يعود على el piso قبل الفعل المصرف",
            "El piso es perfecto; _____ alquilo este mes.",
            "الشقة مثالية؛ سأستأجرها هذا الشهر.",
            ["lo"],
            ["lo"],
            "اسم المفرد المذكر el piso يُستبدل بضمير المفعول المباشر lo: lo alquilo."
        ),
        choice_ex(
            "ex-a2-pod-3", "word_choice",
            "حدد الضمير المناسب للجمع المذكر los muebles",
            ["grammar", "reading"], 2,
            "أي ضمير يحل محل los muebles القديمة لتفادي تكرارها؟",
            "Los muebles son viejos, por eso quiero vender_____ todos.",
            "الأثاث قديم، لذلك أريد أن أبيعه كله.",
            [
                opt("a", "los", "ضمير الجمع المذكر (الصواب)", True),
                opt("b", "las", "ضمير الجمع المؤنث", False, "muebles كلمة مذكرة وتأخذ los وليس las."),
                opt("c", "lo", "ضمير المفرد المذكر", False, "muebles جمع وتحتاج ضمير جمع los.")
            ],
            ["los", "las", "vender"],
            "الاسم الجمع المذكر los muebles يُستبدل بضمير الجمع los: venderlos."
        ),
        order_ex(
            "ex-a2-pod-4",
            "رتّب الجملة بالضمير المباشر قبل الفعل المنفي",
            ["grammar", "writing"], 2,
            ["Ese", "coche", "es", "caro", "no", "lo", "compro"],
            "Ese coche es caro no lo compro",
            "الترتيب السليم: الجملة الأولى Ese coche es caro ثم أداة النفي no ثم الضمير lo ثم الفعل compro.",
            ["lo", "comprar"]
        ),
        choice_ex(
            "ex-a2-pod-5", "listen_choose",
            "استمع وحدد ما قاله المتحدث عن تأجير الشقة",
            ["listening", "vocabulary"], 2,
            "استمع للتسجيل وحدد الضمير المستخدم",
            "Esa vivienda es ideal, la voy a alquilar hoy mismo.",
            "ذلك المسكن مثالي، سأستأجره اليوم بالذات.",
            [
                opt("a", "la", "ضمير المؤنث العائد على vivienda", True),
                opt("b", "lo", "ضمير مذكر", False, "المتحدث استبدل la vivienda بـ la."),
                opt("c", "las", "ضمير جمع", False, "الاسم مفرد مؤنث.")
            ],
            ["la", "lo", "alquilar"],
            "المتحدث قال: la voy a alquilar عائداً على esa vivienda.",
            audioKey="pending/a2_vivienda_voy_alquilar.mp3",
            speechEs="Esa vivienda es ideal, la voy a alquilar hoy mismo."
        ),
        speak_ex(
            "ex-a2-pod-6",
            "انطق جملتك مستخدماً الضمير المباشر بطلاقة",
            ["speaking", "pronunciation"], 2,
            "أخبر المالك بأنك رأيت الشقة وقررت استئجارها",
            "He visto el piso y lo quiero alquilar.",
            "لقد رأيت الشقة وأريد استئجارها.",
            "pending/a2_visto_piso_alquilar.mp3",
            ["lo", "alquilar"],
            "He visto el piso y lo quiero alquilar.",
            "تذكر أن lo تسبق quiero أو تلتصق بالمصدر: quiero alquilarlo."
        )
    ]
    return lesson_doc(doc, exs)

def make_lesson_alquilar_piso():
    slug = "a2-alquilar-piso"
    doc = {
        "slug": slug,
        "unitSlug": "a2-u7-housing",
        "levelCode": "A2",
        "titleAr": "إجراءات وشروط الإيجار: العقد والتأمين ومصاريف الخدمات",
        "titleEs": "El alquiler: contrato, fianza y gastos",
        "subtitleAr": "التفاوض حول السعر الشهري (precio mensual) والتأمين (fianza) والخدمات",
        "order": 3,
        "estimatedMinutes": 18,
        "cefrLevel": "A2",
        "review": review_block(),
        "pedagogy": {
            "learningObjectivesAr": [
                "أن يسأل المتعلم عن شروط وتكاليف استئجار عقار في إسبانيا.",
                "أن يفهم مصطلحات الإيجار الأساسية: el alquiler, la fianza, el contrato, los gastos incluidos.",
                "أن يستفسر عما يشمله الإيجار الشهري: ¿Están los gastos incluidos? (الكهرباء، الماء، الإنترنت)."
            ],
            "grammarPoints": [
                {
                    "titleAr": "المفردات التعاقدية للإيجار في إسبانيا",
                    "explanationAr": "عند استئجار سكن في إسبانيا، تُطرح أسئلة محددة:\n- **El precio del alquiler**: قيمة الإيجار الشهرية (¿Cuánto cuesta el alquiler al mes?).\n- **La fianza**: مبلغ التأمين المسترد، والقانون الإسباني يطلب عادة شهرين تأمين (Dos meses de fianza).\n- **El contrato**: عقد الإيجار الرسمي (Firmar el contrato = توقيع العقد).\n- **Los gastos**: الفواتير ومصاريف الخدمات:\n  - gastos incluidos = الفواتير مشمولة في الإيجار.\n  - gastos aparte = الفواتير منفصلة ويدفعها المستأجر (la luz الكهرباء، el agua الماء، el gas الغاز، la comunidad صيانة العمارة)."
                }
            ],
            "commonMistakesAr": [
                "الخلط بين alquilar (يؤجر لشخص أو يستأجر من شخص) و el alquiler (قيمة الإيجار نفسه كاسم).",
                "اعتقاد أن fianza تعني كفالة قضائية فقط؛ في السياق السكني تعني حصراً مبلغ التأمين الوديعة."
            ],
            "dialectNotes": [
                {
                    "region": "EG",
                    "noteAr": "في مصر نقول: «الإيجار بكام في الشهر؟ وفيه شهرين تأمين، ومصاريف الخدمات داخلة في الإيجار ولا برة؟». في الإسبانية: ¿Cuánto es el alquiler? Dos meses de fianza, ¿gastos incluidos o aparte?"
                }
            ],
            "culturalNoteAr": "في إسبانيا يُطلب من المستأجر عادة تقديم إثبات دخل أو عقد عمل (el contrato de trabajo) وكشف حساب بنكي (las nóminas) كضمان قبل توقيع العقد."
        },
        "contentBlocks": [
            {
                "id": f"cb-{slug}-intro",
                "type": "explanation",
                "titleAr": "مصطلحات عقد الإيجار",
                "bodyAr": "المفردات المالية والتعاقدية:\n- **el alquiler**: الإيجار\n- **la fianza**: التأمين المالي المسترد\n- **el contrato**: العقد\n- **los gastos**: المصاريف والفواتير\n- **el precio**: السعر / الثمن\n- **mensual**: شهرياً / شهري",
                "examples": [
                    {"es": "¿Cuánto es el precio del alquiler mensual?", "ar": "كم هو سعر الإيجار الشهري؟"},
                    {"es": "El propietario pide un mes de fianza.", "ar": "المالك يطلب شهراً واحداً كتأمين."},
                    {"es": "El agua y la luz son gastos aparte.", "ar": "الماء والكهرباء مصاريف منفصلة."}
                ]
            }
        ],
        "newVocabulary": ["alquiler", "fianza", "contrato", "gastos", "precio", "mensual"],
        "reviewVocabulary": ["centro", "oficina"]
    }

    exs = [
        choice_ex(
            "ex-a2-alq-1", "word_choice",
            "اختر المصطلح المعبر عن مبلغ التأمين المسترد",
            ["vocabulary"], 1,
            "ماذا يُسمى مبلغ التأمين الذي يودعه المستأجر لدى المالك كضمان؟",
            "Para entrar al piso hay que pagar dos meses de _____.",
            "لدخول الشقة يجب دفع شهرين من ...",
            [
                opt("a", "fianza", "التأمين المسترد (الصواب)", True),
                opt("b", "contrato", "عقد", False, "العقد وثيقة قانونية وليس مبلغ التأمين."),
                opt("c", "precio", "سعر", False, "المصطلح العقاري الدقيق للوديعة هو fianza.")
            ],
            ["fianza", "contrato", "precio"],
            "مبلغ التأمين السكني يُسمى في الإسبانية la fianza."
        ),
        fill_ex(
            "ex-a2-alq-2",
            "اكتب الكلمة الإسبانية الدالة على الفواتير والمصاريف",
            ["vocabulary", "writing"], 1,
            "اكتب كلمة 'المصاريف / الفواتير' بالإسبانية (صيغة الجمع)",
            "¿Están los _____ de luz y agua incluidos en el precio?",
            "هل مصاريف الكهرباء والماء مشمولة في السعر؟",
            ["gastos"],
            ["gastos"],
            "كلمة gastos تعني المصاريف أو النفقات وهي جمع مذكر."
        ),
        choice_ex(
            "ex-a2-alq-3", "word_choice",
            "حدد الوثيقة القانونية الملزمة بين المالك والمستأجر",
            ["vocabulary", "reading"], 2,
            "ما هي الوثيقة الرسمية التي يوقعها الطرفان لبدء الإيجار؟",
            "Antes de pagar tenemos que firmar el _____ de alquiler.",
            "قبل الدفع يجب أن نوقع ... الإيجار.",
            [
                opt("a", "contrato", "العقد الرسمي", True),
                opt("b", "alquiler", "إيجار", False, "alquiler الإيجار نفسه، والوثيقة هي el contrato."),
                opt("c", "mensual", "شهري (صفة)", False, "mensual صفة وليست الوثيقة الموقعة.")
            ],
            ["contrato", "alquiler", "mensual"],
            "الوثيقة القانونية الموقعة هي el contrato."
        ),
        order_ex(
            "ex-a2-alq-4",
            "رتّب السؤال للاستفسار عن قيمة الإيجار الشهري للشقة",
            ["grammar", "writing"], 2,
            ["¿Cuánto", "es", "el", "precio", "del", "alquiler", "mensual?"],
            "¿Cuánto es el precio del alquiler mensual?",
            "الترتيب السليم: أداة الاستفهام ¿Cuánto ثم الفعل es ثم el precio ثم del alquiler mensual مع علامة الاستفهام في النهاية.",
            ["precio", "alquiler", "mensual"]
        ),
        choice_ex(
            "ex-a2-alq-5", "listen_choose",
            "استمع وحدد ما إذا كانت الفواتير مشمولة في الإيجار",
            ["listening", "vocabulary"], 2,
            "استمع لإجابة المالك وحدد حالة مصاريف الخدمات",
            "El alquiler son 800 euros con los gastos incluidos.",
            "الإيجار 800 يورو مع الفواتير مشمولة.",
            [
                opt("a", "gastos", "المصاريف مشمولة", True),
                opt("b", "fianza", "تأمين فقط", False, "المتحدث قال بوضوح: con los gastos incluidos."),
                opt("c", "oficina", "مكتب", False, "المتحدث تحدث عن شمول الفواتير في الإيجار.")
            ],
            ["gastos", "alquiler", "fianza", "oficina"],
            "المتحدث قال: con los gastos incluidos.",
            audioKey="pending/a2_gastos_incluidos.mp3",
            speechEs="El alquiler son 800 euros con los gastos incluidos."
        ),
        speak_ex(
            "ex-a2-alq-6",
            "انطق سؤالك عن شروط العقد والتأمين",
            ["speaking", "pronunciation"], 2,
            "اسأل المالك بنطق سليم عن عدد أشهر التأمين المطلوبة",
            "¿Cuántos meses de fianza pide para el contrato?",
            "كم شهر تأمين تطلب للعقد؟",
            "pending/a2_meses_fianza_contrato.mp3",
            ["fianza", "contrato"],
            "¿Cuántos meses de fianza pide para el contrato?",
            "احرص على نطق حرف z في fianza كـ ثاء في إسبانيا."
        )
    ]
    return lesson_doc(doc, exs)

def make_lesson_visita_piso():
    slug = "a2-visita-piso"
    doc = {
        "slug": slug,
        "unitSlug": "a2-u7-housing",
        "levelCode": "A2",
        "titleAr": "معاينة الشقة ومرافق البناية: المصعد والتدفئة والجيران",
        "titleEs": "La visita al piso y las instalaciones",
        "subtitleAr": "فحص مرافق العمارة (ascensor, calefacción, portero) والاستعلام عن الحي",
        "order": 4,
        "estimatedMinutes": 18,
        "cefrLevel": "A2",
        "review": review_block(),
        "pedagogy": {
            "learningObjectivesAr": [
                "أن يجري المتعلم محادثة معاينة عقار مع الوكيل أو المالك مباشرة.",
                "أن يسأل عن مرافق وخدمات العمارة: ¿Tiene ascensor? ¿Cómo es la calefacción? ¿Hay portero?.",
                "أن يستفسر عن الطابق (la planta) والجيران (los vecinos) وطبيعة الحي (la zona)."
            ],
            "grammarPoints": [
                {
                    "titleAr": "مفردات المرافق والمعاينة العقارية",
                    "explanationAr": "أثناء زيارة الشقة وفحص مرافقها، تبرز عناصر هامة:\n- **El ascensor**: المصعد (خاصة في الطوابق العليا: ¿En qué planta está? Está en la cuarta planta y tiene ascensor).\n- **La calefacción**: التدفئة الشتوية (calefacción central تدفئة مركزية للعمارة، أو individual مستقلة بالغاز).\n- **El portero / El conserje**: حارس العمارة / البواب.\n- **La zona**: الحي أو المنطقة (una zona tranquila / bien comunicada).\n- **Los vecinos**: الجيران والمجتمع السكني."
                }
            ],
            "commonMistakesAr": [
                "استخدام piso بدلاً من planta عند تحديد رقم الطابق (الصحيح: está en la tercera planta، بينما piso تعني الشقة كاملة).",
                "الخلط بين portero كبواب عمارة و portero كحارس مرمى في كرة القدم (السياق هو الذي يحدد)."
            ],
            "dialectNotes": [
                {
                    "region": "EG",
                    "noteAr": "في مصر نسأل: «العمارة فيها أسانسير وبواب؟ والشقة في الدور الكام والمنطقة أمان والجيران هاديين؟». في الإسبانية: ¿El edificio tiene ascensor y portero? ¿En qué planta está y cómo son los vecinos?"
                }
            ],
            "culturalNoteAr": "في المدن الإسبانية القديمة كمدريد وبرشلونة، العديد من المباني التاريخية لا تحتوي على مصاعد (sin ascensor)؛ لذا فإن وجود المصعد ميزة أساسية يُسأل عنها أولاً."
        },
        "contentBlocks": [
            {
                "id": f"cb-{slug}-intro",
                "type": "explanation",
                "titleAr": "مرافق العمارة والمعاينة",
                "bodyAr": "أهم الكلمات لمقابلة المعاينة:\n- **el vecino / la vecina**: الجار / الجارة\n- **el ascensor**: المصعد\n- **la calefacción**: التدفئة\n- **la planta**: الطابق / الدور\n- **la zona**: المنطقة / الحي\n- **el portero**: البواب / حارس المبنى",
                "examples": [
                    {"es": "El piso está en la tercera planta con ascensor.", "ar": "الشقة في الطابق الثالث مع وجود مصعد."},
                    {"es": "La calefacción central funciona muy bien en invierno.", "ar": "التدفئة المركزية تعمل بشكل ممتاز في الشتاء."},
                    {"es": "Es una zona muy bien comunicada con metro.", "ar": "هي منطقة ذات مواصلات ممتازة بالمترو."}
                ]
            }
        ],
        "newVocabulary": ["vecino", "portero", "ascensor", "calefacción", "planta", "zona"],
        "reviewVocabulary": ["edificio", "calle"]
    }

    exs = [
        choice_ex(
            "ex-a2-vis-1", "word_choice",
            "اختر الكلمة المناسبة للمصعد الكهربائي في البناية",
            ["vocabulary"], 1,
            "ماذا تسمى آلة الصعود والهبوط في المباني السكنية؟",
            "El piso está en el quinto piso y afortunadamente tiene _____.",
            "الشقة في الطابق الخامس ولحسن الحظ تحتوي على ...",
            [
                opt("a", "ascensor", "مصعد (الصواب)", True),
                opt("b", "calefacción", "تدفئة", False, "الصعود للطابق الخامس يتطلب مصعداً ascensor."),
                opt("c", "portero", "بواب", False, "الآلة هي المصعد ascensor.")
            ],
            ["ascensor", "calefacción", "portero"],
            "المصعد في الإسبانية هو el ascensor."
        ),
        fill_ex(
            "ex-a2-vis-2",
            "اكتب الكلمة الإسبانية الدالة على نظام التدفئة الشتوية",
            ["vocabulary", "writing"], 1,
            "اكتب كلمة 'التدفئة' بالإسبانية بدقة",
            "En invierno es fundamental tener una buena _____ en casa.",
            "في الشتاء من الأساسي وجود ... جيدة في البيت.",
            ["calefacción"],
            ["calefacción", "calefaccion"],
            "كلمة calefacción تعني التدفئة وهي مؤنثة وتأخذ علامة نبر على المقطع الأخير."
        ),
        choice_ex(
            "ex-a2-vis-3", "word_choice",
            "حدد الكلمة الصحيحة للطابق الذي تقع فيه الشقة",
            ["vocabulary", "reading"], 2,
            "أي كلمة تستخدم لتحديد رقم الطابق أو الدور في العمارة؟",
            "El apartamento se encuentra en la segunda _____ del edificio.",
            "الشقة تقع في ... الثانية من المبنى.",
            [
                opt("a", "planta", "طابق / دور", True),
                opt("b", "zona", "منطقة", False, "zona تعني الحي أو المنطقة وليس الطابق السكني."),
                opt("c", "vecino", "جار", False, "vecino هو الشخص الجار وليس الطابق.")
            ],
            ["planta", "zona", "vecino", "edificio"],
            "الطابق السكني في العمارة يُسمى la planta (la segunda planta)."
        ),
        order_ex(
            "ex-a2-vis-4",
            "رتّب الجملة لوصف هدوء الجيران في البناية",
            ["grammar", "writing"], 2,
            ["Los", "vecinos", "del", "edificio", "son", "muy", "tranquilos"],
            "Los vecinos del edificio son muy tranquilos",
            "الترتيب السليم: الفاعل Los vecinos del edificio ثم الفعل son ثم الصفة muy tranquilos.",
            ["vecino", "edificio"]
        ),
        choice_ex(
            "ex-a2-vis-5", "listen_choose",
            "استمع وحدد ميزة الحي السكني المذكورة",
            ["listening", "vocabulary"], 2,
            "استمع للوكيل العقاري وحدد وصف المنطقة",
            "El piso está en una zona residencial muy tranquila.",
            "الشقة تقع في منطقة سكنية هادئة جداً.",
            [
                opt("a", "zona", "حي / منطقة", True),
                opt("b", "portero", "بواب", False, "المتحدث وصف طبيعة المنطقة السكنية una zona residencial."),
                opt("c", "calle", "شارع", False, "المتحدث ركز على وصف الحي zona.")
            ],
            ["zona", "calle", "portero"],
            "المتحدث قال: una zona residencial muy tranquila.",
            audioKey="pending/a2_zona_residencial.mp3",
            speechEs="El piso está en una zona residencial muy tranquila."
        ),
        speak_ex(
            "ex-a2-vis-6",
            "انطق سؤالك عن تواجد حارس البناية",
            ["speaking", "pronunciation"], 2,
            "اسأل بنطق سليم عما إذا كان المبنى مزوداً ببواب أو حارس",
            "¿El edificio tiene portero por las mañanas?",
            "هل يوجد بالمبنى بواب في الفترات الصباحية؟",
            "pending/a2_edificio_tiene_portero.mp3",
            ["portero", "edificio"],
            "¿El edificio tiene portero por las mañanas?",
            "تذكر نطق حرف d كـ ذال خفيفة في edificio."
        )
    ]
    return lesson_doc(doc, exs)

def get_lessons():
    return [
        make_lesson_sintomas_medico(),
        make_lesson_dar_consejos_deber(),
        make_lesson_imperativo_salud(),
        make_lesson_consulta_medica(),
        make_lesson_tipos_vivienda(),
        make_lesson_pronombres_objeto_directo(),
        make_lesson_alquilar_piso(),
        make_lesson_visita_piso()
    ]
