# -*- coding: utf-8 -*-
"""Generator for Level C1 Units 5 and 6 (8 lessons):
- Unit 5: c1-u5-regional (4 lessons)
- Unit 6: c1-u6-translation (4 lessons)
"""
import sys
import os

from common import opt, choice_ex, fill_ex, order_ex, speak_ex, lesson_doc, review_block

# -------------------------------------------------------------
# UNIT 5: c1-u5-regional (الإسبانية الإيبيرية والأمريكية والتنوع اللهجي)
# -------------------------------------------------------------

def make_lesson_voseo_variacion():
    slug = "c1-voseo-variacion"
    titleAr = "ظاهرة الـ Voseo وتنوع صيغ الخطاب: El voseo y las fórmulas de tratamiento"
    objAr = "أن يستوعب المتعلم الفروق الصرفية والاجتماعية لظاهرة الـ Voseo في حوض ريو دي لا بلاتا وأمريكا الوسطى، ويتقن التحويل الدقيق بين صيغ tuteo و voseo."
    
    newVocab = ["voseo", "vos", "tratamiento", "porteño", "tuteo", "desinencia", "rigor"]
    revVocab = ["tiempo", "sociedad", "bien", "trabajo"]
    
    doc = {
        "slug": slug,
        "titleAr": titleAr,
        "level": "C1",
        "programSlug": "main-track",
        "unitSlug": "c1-u5-regional",
        "objectiveAr": objAr,
        "estimatedMinutes": 12,
        "skills": ["grammar", "reading", "writing", "listening", "vocabulary"],
        "newVocabulary": newVocab,
        "reviewVocabulary": revVocab,
        "targetStructures": [
            "Morfología verbal del voseo en presente: vos tenés, vos hablás, vos vivís",
            "El imperativo con voseo rioplatense: vení, mirá, decime, hacé",
            "El pronombre 'vos' frente al pronombre átono 'te' y posesivo 'tu'",
            "Estatus sociolingüístico del voseo culto en Argentina, Uruguay y Paraguay"
        ],
        "grammarTopics": ["voseo-rioplatense", "variedades-del-espanol-c1"],
        "scenarios": [
            {
                "contextAr": "حوار راقٍ في مقهى أدبي بحي سان تيلمو في بوينس آيرس بين ناشر أرجنتيني ومؤلف إسباني.",
                "settingAr": "مقهى تورتوني التاريخي، شارع دي مايو، بوينس آيرس",
                "lines": [
                    {
                        "es": "Che, vos sabés muy bien que tu novela tiene una potencia deslumbrante en toda la región.",
                        "ar": "اسمع يا صديقي، أنت تعلم جيداً أن روايتك تحظى بقوة مذهلة وأثر باهر في كل أرجاء المنطقة.",
                        "arEg": "يا سيدي، أنت عارف كويس جداً إن روايتك مكسرة الدنيا وليها هيبة كبيرة في المنطقة كلها.",
                        "audioKey": "pending/c1-u5-vos-1"
                    },
                    {
                        "es": "Agradezco tu entusiasmo porteño; en Madrid usamos el tuteo con otra conjugación verbal.",
                        "ar": "أقدر حماسك البوينس-آيرسي الصادق؛ فنحن في مدريد نستخدم صيغة المخاطبة tuteo بتصريف فعلي مختلف.",
                        "arEg": "شاكر جداً لذوقك وحماسك الأرجنتيني الجميل ده؛ إحنا في مدريد بنصرف الأفعال بشكل تاني مع tú.",
                        "audioKey": "pending/c1-u5-vos-2"
                    },
                    {
                        "es": "Mirá, el voseo culto rioplatense conserva una desinencia histórica que nos otorga cercanía y elegancia.",
                        "ar": "انظر، إن ظاهرة الفوسيو الراقية في ريو دي لا بلاتا تحافظ على لاحقة تاريخية تمنحنا قرباً وأناقة بالغة.",
                        "arEg": "بص يا فنان، الفوسيو الراقي عندنا في الأرجنتين محتفظ بنهايات فعل قديمة بتدي حميمية وشياكة للكلام.",
                        "audioKey": "pending/c1-u5-vos-3"
                    },
                    {
                        "es": "Es fascinante comprobar cómo una misma lengua modula sus fórmulas de tratamiento con tanta riqueza.",
                        "ar": "إنه لمن المثير حقاً التحقق من كيفية تنويع اللغة الواحدة لصيغ المخاطبة بمثل هذا الثراء العظيم.",
                        "arEg": "حاجة تبهر الصراحة إزاي نفس اللغة الواحدة بتنوّع أساليب النداء والكلام بالغنى والجمال ده كله.",
                        "audioKey": "pending/c1-u5-vos-4"
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
        "review": review_block()
    }
    
    exs = [
        choice_ex(
            "ex-c1-vva-1", "listen_choose",
            "استمع إلى الناشر الأرجنتيني ولاحظ تصريف الفعل saber مع ضمير vos في الحاضر.",
            ["listening", "grammar"], 1,
            "ما هي الصيغة الصحيحة لفعل saber مع الضمير vos في بوينس آيرس؟",
            "Che, vos sabés muy bien que tu novela tiene una potencia deslumbrante en toda la región.",
            "اسمع يا صديقي، أنت تعلم جيداً أن روايتك تحظى بقوة مذهلة وأثر باهر في كل أرجاء المنطقة.",
            [
                opt("a", "vos sabés", "تصريف الفوسيو بحذف حرف الإدغام والضغط على المقطع الأخير (sabés)", True),
                opt("b", "tú sabes", "الصيغة الإيبيرية لضمير tú في الحاضر بدون فوسيو", False, "صيغة tú في إسبانيا وليس voseo."),
                opt("c", "vos sabéis", "صيغة vosotros للجمع في إسبانيا", False, "تخص جماعة المخاطبين في شبه الجزيرة.")
            ],
            ["voseo", "porteño"],
            "في تصريف الفوسيو الحاضر، يتم إدغام النهاية التاريخية مع تسكين النبرة على حرف العلة الأخير: vos hablás, vos tenés, vos sabés.",
            "pending/c1-u5-vos-1",
            "Che, vos sabés muy bien que tu novela tiene una potencia deslumbrante en toda la región."
        ),
        choice_ex(
            "ex-c1-vva-2", "word_choice",
            "ما هي صيغة الأمر للمخاطب في ريو دي لا بلاتا لدعوة شخص ما إلى القدوم والاستماع؟",
            ["grammar", "reading"], 1,
            "اختر صيغة الأمر الصحيحة مع vos:",
            "Por favor, ____ aquí un momento que quiero comentarte una idea.",
            "من فضلك، تعال هنا لحظة فإني أريد استشارتك في فكرة.",
            [
                opt("a", "vení", "الأمر في الفوسيو بحذف حرف الراء والنبر على المقطع الأخير (vení)", True),
                opt("b", "ven", "صيغة الأمر الشاذة لضمير tú في إسبانيا", False, "صيغة إيبيرية تخص tú."),
                opt("c", "venga", "صيغة الأمر الرسمي مع usted", False, "صيغة التوقير الرسمي وليست مخاطبة حميمة.")
            ],
            ["voseo", "rigor"],
            "يصاغ أمر الفوسيو بحذف -d من صيغة vosotros القديمة مع تثبيت النبر على الصائت الأخير: vení, decí, hacé, mirá."
        ),
        fill_ex(
            "ex-c1-vva-3",
            "أكمل الجملة بالضمير المتصل التوكيدي للمخاطب في ريو دي لا بلاتا: «vos ____».",
            ["vocabulary", "writing"], 2,
            "اكتب الضمير المستقل الدال على أنت في الفوسيو:",
            "No te preocupes, ____ sos el candidato más idóneo para el puesto.",
            "لا تقلق، فأنت هو المرشح الأنسب والأجدر لشغل هذه الوظيفة.",
            ["vos"],
            ["vos"],
            "يحل الضمير «vos» محل tú في الفاعل والمجرور بحرف الجر (con vos, para vos)، بينما يبقى ضمير المفعول te دون تغيير."
        ),
        choice_ex(
            "ex-c1-vva-4", "word_choice",
            "ما هو الوضع الاجتماعي واللغوي لظاهرة الفوسيو في الأرجنتين والأوروغواي اليوم؟",
            ["reading", "vocabulary"], 1,
            "حدد المكانة السوسيولسانية للفوسيو في حوض ريو دي لا بلاتا:",
            "El voseo en Argentina goza de total legitimidad y prestigio social y académico.",
            "يتمتع الفوسيو في الأرجنتين بشرعية كاملة ومكانة اجتماعية وأكاديمية رفيعة في كافة المستويات.",
            [
                opt("a", "Norma culta estándar aceptada en todos los registros formales", "معيار فصيح وراقٍ معتمد في كافة السجلات الرسمية والتعليمية", True),
                opt("b", "Vulgarismo marginal prohibido en las escuelas y medios", "لحن عامي محظور في المدارس ووسائل الإعلام", False, "مفهوم استعماري قديم اندثر منذ زمن بعيد."),
                opt("c", "Dialecto incomprensible exclusivo de zonas rurales aisladas", "لهجة ريفية غير مفهومة للمدن", False, "الفوسيو هو لغة العواصم الكبرى كبوينس آيرس ومونتيفيديو.")
            ],
            ["tratamiento", "porteño"],
            "أقرت الأكاديمية الملكية والجمعيات اللغوية الأمريكية بأن فوسيو ريو دي لا بلاتا يمثل معياراً فصيحاً معتمداً رسمياً ومكتوباً."
        ),
        order_ex(
            "ex-c1-vva-5",
            "رتب الكلمات لبناء جملة أمرية حميمية على طريقة الفوسيو البوينس-آيرسي.",
            ["grammar", "writing"], 2,
            ["Mirá", "bien", "lo", "que", "hacés"],
            "Mirá bien lo que hacés",
            "الأمر mirá متبوعاً بالظرف bien والاسم الموصول المركب lo que وفعل الحاضر hacés.",
            ["voseo"]
        ),
        speak_ex(
            "ex-c1-vva-6",
            "انطق هذه الجملة بتنغيم أرجنتيني رخيم يعكس نبرات الفوسيو الأصيلة بكل وقار.",
            ["speaking", "pronunciation"], 2,
            "نطق سليم مراعياً النبر على المقطع الأخير في الأفعال:",
            "Vos tenés toda la razón del mundo.",
            "أنت على حق تام في كل ما تقول.",
            "pending/c1-u5-vos-spk",
            ["voseo", "porteño"],
            "Vos tenés toda la razón del mundo.",
            "احرص على رفع الصوت بنغمة موسيقية إيقاعية على كلمة tenés وإخراج حرف s النهاري خفيفاً وواضحاً."
        )
    ]
    return lesson_doc(doc, exs, "C1")


def make_lesson_americanismos_lexicos():
    slug = "c1-americanismos-lexicos"
    titleAr = "المفردات الأمريكية اللاتينية في السجل الرفيع: Americanismos léxicos cultos"
    objAr = "أن يميز المتعلم المفردات الأمريكية الشائعة في الأدب والصحافة المرموقة (platicar, manejar, celular, plata, chévere, acervo)."
    
    newVocab = ["platicar", "manejar", "celular", "plata", "acervo", "rigor"]
    revVocab = ["tiempo", "sociedad", "bien", "trabajo"]
    
    doc = {
        "slug": slug,
        "titleAr": titleAr,
        "level": "C1",
        "programSlug": "main-track",
        "unitSlug": "c1-u5-regional",
        "objectiveAr": objAr,
        "estimatedMinutes": 12,
        "skills": ["grammar", "reading", "writing", "listening", "vocabulary"],
        "newVocabulary": newVocab,
        "reviewVocabulary": revVocab,
        "targetStructures": [
            "Correspondencias léxicas panhispánicas: platicar (conversar) / manejar (conducir)",
            "Términos tecnológicos cotidianos: celular (móvil) / computadora (ordenador)",
            "Polisemia americana: plata (dinero / metonimia económica)",
            "El acervo léxico compartido regulado por la ASALE (Asociación de Academias)"
        ],
        "grammarTopics": ["lexicologia-panhispanica", "americanismos-literarios-c1"],
        "scenarios": [
            {
                "contextAr": "ندوة صحفية دولية حول أدب الصحافة في مكسيكو سيتي بمشاركة كتاب من أمريكا وإسبانيا.",
                "settingAr": "قصر الفنون الجميلة (Palacio de Bellas Artes)، مكسيكو سيتي",
                "lines": [
                    {
                        "es": "Tuvimos la oportunidad de platicar largo y tendido sobre el futuro del periodismo cultural.",
                        "ar": "سنحت لنا الفرصة للتجاذب في أطراف الحديث مطولاً حول مستقبل الصحافة الثقافية.",
                        "arEg": "قعدنا واتكلمنا ودردشنا بالساعات عن مستقبل الصحافة الثقافية في بلادنا.",
                        "audioKey": "pending/c1-u5-ame-1"
                    },
                    {
                        "es": "En México decimos 'manejar un auto', mientras en la península prefieren 'conducir un coche'.",
                        "ar": "في المكسيك نقول 'manejar un auto'، بينما يفضلون في شبه الجزيرة عبارة 'conducir un coche'.",
                        "arEg": "عندنا في المكسيك بنقول manejar un auto، وفي إسبانيا بيقولوا conducir un coche، والاثنين فصحى.",
                        "audioKey": "pending/c1-u5-ame-2"
                    },
                    {
                        "es": "Ambas formas son plenamente legítimas y enriquecen el acervo común de nuestra lengua.",
                        "ar": "كلا الصيغتين فصيحة وشرعية تماماً وتثريان الرصيد التراثي المشترك للغتنا الإسبانية.",
                        "arEg": "الشكلين صح ومليون في المية فصحى وبيغنوا الرصيد اللغوي المشترك بين بلادنا كلها.",
                        "audioKey": "pending/c1-u5-ame-3"
                    },
                    {
                        "es": "El término 'plata' se emplea con elegancia en toda Sudamérica para referirse al capital financiero.",
                        "ar": "يستخدم مصطلح 'plata' بأناقة في كافة أرجاء أمريكا الجنوبية للإشارة إلى المال ورأس المال.",
                        "arEg": "كلمة plata بتتقال بشياكة في كل أمريكا اللاتينية للدلالة على الفلوس ورأس المال.",
                        "audioKey": "pending/c1-u5-ame-4"
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
        "review": review_block()
    }
    
    exs = [
        choice_ex(
            "ex-c1-alx-1", "listen_choose",
            "استمع إلى حديث الكاتب المكسيكي وحدد الفعل الذي استخدمه للتعبير عن الحديث والتباحث الودي المطول.",
            ["listening", "vocabulary"], 1,
            "ما هو الفعل الأمريكي اللاتيني الفصيح المقابل لـ conversar / charlar؟",
            "Tuvimos la oportunidad de platicar largo y tendido sobre el futuro del periodismo cultural.",
            "سنحت لنا الفرصة للتجاذب في أطراف الحديث مطولاً حول مستقبل الصحافة الثقافية.",
            [
                opt("a", "Platicar", "التحادث والمسامرة الفصيحة في المكسيك وأمريكا الوسطى", True),
                opt("b", "Pelear", "الشجار والعراك بالأيدي", False, "تناقض تام مع الحوار الثقافي."),
                opt("c", "Callar", "الصمت والانقطاع عن الكلام", False, "عكس الحديث تماماً.")
            ],
            ["platicar", "acervo"],
            "الفعل «platicar» من أقدم وأعرق الأفعال القشتالية التي استقرت في المكسيك وأمريكا الوسطى كمعيار رفيع للحديث الودي المحترم.",
            "pending/c1-u5-ame-1",
            "Tuvimos la oportunidad de platicar largo y tendido sobre el futuro del periodismo cultural."
        ),
        choice_ex(
            "ex-c1-alx-2", "word_choice",
            "ما هو المقابل الأمريكي اللاتيني المعتمد لعبارة «conducir el coche» المستخدمة في إسبانيا؟",
            ["reading", "vocabulary"], 1,
            "اختر التعبير الشائع في أغلب بلدان أمريكا اللاتينية:",
            "Para desplazarse por la inmensa capital, decidió ____.",
            "للتنقل عبر العاصمة المترامية الأطراف، قرر قيادة السيارة بنفسه.",
            [
                opt("a", "manejar el auto", "قيادة السيارة بأسلوب المعيار الأمريكي اللاتيني", True),
                opt("b", "andar en mula", "ركوب البغل في الطرقات الجبلية", False, "وسيلة نقل تقليدية قديمة لا تناسب العاصمة الحديثة."),
                opt("c", "remar en barco", "التجذيف في القارب النهري", False, "يخص الملاحة المائية.")
            ],
            ["manejar", "rigor"],
            "في المكسيك وأمريكا الجنوبية يقال «manejar un auto» بدلاً من «conducir un coche» الإيبيرية، وكلاهما فصيح رسمي في المعاجم."
        ),
        fill_ex(
            "ex-c1-alx-3",
            "أكمل الجملة بالكلمة الأمريكية اللاتينية المعتمدة للهاتف المحمول: «el teléfono ____».",
            ["vocabulary", "writing"], 2,
            "اكتب صفة الهاتف المحمول في عموم أمريكا الناطقة بالإسبانية:",
            "Por favor, apaguen sus teléfonos ____ antes de que comience la función.",
            "يرجى إغلاق هواتفكم النقالة قبل بدء العرض المسرحي.",
            ["celular"],
            ["celulares"],
            "في كامل القارة الأمريكية يقال «el celular» أو «el teléfono celular»، بينما يقتصر استخدام «el móvil» على إسبانيا."
        ),
        choice_ex(
            "ex-c1-alx-4", "word_choice",
            "ماذا تعني كلمة «plata» في الاستخدام اليومي والأدبي في أمريكا الجنوبية؟",
            ["vocabulary", "reading"], 1,
            "اختر الدلالة الاقتصادية والاجتماعية لكلمة plata في أمريكا اللاتينية:",
            "Es un proyecto prometedor, pero hace falta mucha ____ para financiarlo.",
            "إنه مشروع واعد، بيد أنه يتطلب الكثير من المال لتمويله على الوجه الأكمل.",
            [
                opt("a", "dinero y recursos económicos", "المال والسيولة النقدية والموارد المالية", True),
                opt("b", "platos de cocina sucios", "أطباق طعام غير نظيفة", False, "خلط مع كلمة plato."),
                opt("c", "arena de la playa", "رمال الشاطئ الساحلية", False, "معنى جغرافي لا علاقة له بالاقتصاد.")
            ],
            ["plata", "rigor"],
            "كلمة «plata» (الفضة) أصبحت في القاموس الأمريكي اللاتيني كبرى الكنايات الدالة على المال النقدي نظراً لغزارة مناجم الفضة تاريخياً."
        ),
        order_ex(
            "ex-c1-alx-5",
            "رتب الكلمات لبناء تأكيد لغوي على وحدة اللغة الإسبانية وتنوع روافدها المعجمية.",
            ["grammar", "writing"], 2,
            ["Compartimos", "un", "mismo", "acervo", "lingüístico"],
            "Compartimos un mismo acervo lingüístico",
            "الفعل المتعدي Compartimos متبوعاً بالمفعول به الموصوف un mismo acervo lingüístico.",
            ["acervo"]
        ),
        speak_ex(
            "ex-c1-alx-6",
            "انطق هذه الجملة بنبرة تبرز الاحترام المتبادل لغنى المفردات في العالم الناطق بالإسبانية.",
            ["speaking", "pronunciation"], 2,
            "نطق سليم مراعياً مخارج الحروف الفصيحة:",
            "Me alegra platicar contigo sobre este tema.",
            "يسعدني كثيراً التجاذب معك في أطراف الحديث حول هذه المسألة.",
            "pending/c1-u5-ame-spk",
            ["platicar", "rigor"],
            "Me alegra platicar contigo sobre este tema.",
            "انتبه لنطق حرف t في platicar بوضوح ونعومة دون تفخيم زائد، وحافظ على الابتسامة الصوتية في نبرة الحديث."
        )
    ]
    return lesson_doc(doc, exs, "C1")


def make_lesson_prosodia_fonetica():
    slug = "c1-prosodia-fonetica"
    titleAr = "الصوتيات والتنغيم: Prosodia, seseo y yeísmo en el mundo hispánico"
    objAr = "أن يفهم المتعلم الظواهر الصوتية الكبرى (el seseo, la distinción, el yeísmo rehilado, la aspiración de la esse) ويتعرف على تنغيم اللهجات المختلفة."
    
    newVocab = ["seseo", "distinción", "yeísmo", "aspiración", "rehilado", "rigor"]
    revVocab = ["tiempo", "sociedad", "bien", "trabajo"]
    
    doc = {
        "slug": slug,
        "titleAr": titleAr,
        "level": "C1",
        "programSlug": "main-track",
        "unitSlug": "c1-u5-regional",
        "objectiveAr": objAr,
        "estimatedMinutes": 12,
        "skills": ["grammar", "reading", "writing", "listening", "vocabulary"],
        "newVocabulary": newVocab,
        "reviewVocabulary": revVocab,
        "targetStructures": [
            "La distinción fonológica peninsular: /θ/ (caza) vs. /s/ (casa)",
            "El seseo panamericano y andaluz mayoritario: pronunciación de 'c/z' como /s/",
            "El yeísmo rehilado rioplatense: pronunciación de 'll/y' como fricativa prepalatal /ʃ/ o /ʒ/",
            "La aspiración y elisión de la /-s/ implosiva en el Caribe, Andalucía y Chile"
        ],
        "grammarTopics": ["fonologia-panhispanica", "prosodia-y-dialectologia-c1"],
        "scenarios": [
            {
                "contextAr": "مختبر علم الصوتيات التجريبي في معهد اللسانيات بمدريد لتحليل تسجيلات صوتية لمناطق متعددة.",
                "settingAr": "مختبر الصوتيات وعلم اللهجات، المركز الأعلى للبحوث العلمية (CSIC)",
                "lines": [
                    {
                        "es": "En la meseta castellana predomina la distinción entre el fonema interdental /θ/ y el alveolar /s/.",
                        "ar": "في هضبة قشتالة يسود التمييز الصوتي بين الفونيم بين الأسناني /θ/ واللثوي /s/.",
                        "arEg": "في مدريد وقشتالة بيميزوا في النطق بين الثاء والسين في كلمات زي caza و casa.",
                        "audioKey": "pending/c1-u5-fon-1"
                    },
                    {
                        "es": "No obstante, el seseo es la norma mayoritaria en toda Hispanoamérica y las Islas Canarias.",
                        "ar": "ومع ذلك، فإن ظاهرة السيسيو ونطق حرفي c/z كالسين هي المعيار الأغلبي في كامل أمريكا اللاتينية وجزر الكناري.",
                        "arEg": "بس ظاهرة السيسيو ونطق حرفي c و z سين هي النطق الغالب عند أكتر من تسعين في المية من الناطقين بالإسبانية.",
                        "audioKey": "pending/c1-u5-fon-2"
                    },
                    {
                        "es": "En el Río de la Plata destaca el yeísmo rehilado, donde la 'll' suena similar a una 'sh' suave.",
                        "ar": "وفي حوض ريو دي لا بلاتا يبرز الـ Yeísmo Rehilado، حيث يُنطق حرفا 'll' و'y' بصوت يشبه الشين الخفيفة.",
                        "arEg": "في الأرجنتين وأوروغواي الـ ll والـ y بتتنطق شين أو جيم معطشة ناعمة زي كلمة calle اللي بيقولوها كاشيه.",
                        "audioKey": "pending/c1-u5-fon-3"
                    },
                    {
                        "es": "En las costas caribeñas y Andalucía observamos la aspiración sistemática de la esse al final de sílaba.",
                        "ar": "وفي السواحل الكاريبية وإقليم الأندلس نلاحظ همس حرف السين وتحويله إلى هاء رخوة في أواخر المقاطع.",
                        "arEg": "في شواطئ الكاريبي والأندلس السين اللي في آخر المقطع بتتحول لهاء خفيفة زي 'estos' اللي بتبقى 'ehto'.",
                        "audioKey": "pending/c1-u5-fon-4"
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
        "review": review_block()
    }
    
    exs = [
        choice_ex(
            "ex-c1-pfo-1", "listen_choose",
            "استمع إلى شرح عالم الصوتيات وحدد الظاهرة التي تميز غالبية الناطقين بالإسبانية حول العالم.",
            ["listening", "vocabulary"], 1,
            "ما الظاهرة الصوتية السائدة لدى أكثر من 90% من المتحدثين بالإسبانية في القارات؟",
            "No obstante, el seseo es la norma mayoritaria en toda Hispanoamérica y las Islas Canarias.",
            "ومع ذلك، فإن ظاهرة السيسيو ونطق حرفي c/z كالسين هي المعيار الأغلبي في كامل أمريكا اللاتينية وجزر الكناري.",
            [
                opt("a", "El seseo", "نطق أحرف c (قبل e/i) و z كصوت السين /s/", True),
                opt("b", "El ceceo", "نطق حرف السين كثاء دائمة في بعض قرى الجنوب", False, "ظاهرة ريفية أندلسية محلية."),
                opt("c", "El mutismo", "الخرس التام وعدم النطق", False, "عاهة مرضية لا ظاهرة صوتية.")
            ],
            ["seseo", "distinción"],
            "«El seseo» هو نطق الحروف c و z بصوت /s/، وهو النطق القياسي الرسمي في جميع دول أمريكا اللاتينية وجزر الكناري.",
            "pending/c1-u5-fon-2",
            "No obstante, el seseo es la norma mayoritaria en toda Hispanoamérica y las Islas Canarias."
        ),
        choice_ex(
            "ex-c1-pfo-2", "word_choice",
            "كيف ينطق سكان بوينس آيرس ومونتيفيديو كلمات مثل «calle» أو «playa» في ظاهرة الـ yeísmo rehilado؟",
            ["reading", "vocabulary"], 1,
            "اختر التوصيف الصوتي لنطق 'll' في بوينس آيرس:",
            "En el habla rioplatense, la palabra 'lluvia' se pronuncia con un sonido similar a la 'sh' o 'zh'.",
            "في نطق أهل ريو دي لا بلاتا، تُلفظ كلمة 'lluvia' بصوت شبيه بالشين أو الجيم الاحتكاكية اللطيفة.",
            [
                opt("a", "Como una fricativa prepalatal sorda o sonora (/ʃ/ o /ʒ/)", "بصوت احتكاكي غاري يشبه الشين أو الجيم المعطشة", True),
                opt("b", "Como una erre fuerte y vibrante", "كراء مشددة مهتزة", False, "لا علاقة له بنطق الياء."),
                opt("c", "No se pronuncia y desaparece por completo", "يحذف تماماً من الكلمة", False, "الصوت موجود وبارز جداً.")
            ],
            ["yeísmo", "rehilado"],
            "«El yeísmo rehilado» (أو zheísmo/sheísmo) هو السمة الصوتية الأكثر شهرة في لهجة ريو دي لا بلاتا، حيث يتحول صوت الياء إلى صوت شيني احتكاكي ممتع."
        ),
        fill_ex(
            "ex-c1-pfo-3",
            "أكمل المصطلح الصوتي المقابل للسيسيو في وسط وشمال إسبانيا حيث يفرق بين كازا وكاثا: «la ____ fonológica».",
            ["vocabulary", "writing"], 2,
            "اكتب الكلمة الناقصة الدالة على التفريق الصوتي بين السين والثاء:",
            "En Madrid se mantiene la ____ entre 'casa' (/kasa/) y 'caza' (/kaθa/).",
            "في مدريد يُحافظ على التفريق والتمييز الصوتي بين كلمة casa (بيت) و caza (صيد).",
            ["distinción"],
            ["distinción"],
            "«La distinción» هي السمة الفونولوجية القشتالية التي تفرق بصرامة بين الصوت اللثوي /s/ والصوت بين الأسناني /θ/ (الثاء)."
        ),
        choice_ex(
            "ex-c1-pfo-4", "word_choice",
            "ماذا يحدث لحرف السين في نهاية الكلمات والمقاطع في اللهجات الكاريبية والأندلسية؟",
            ["vocabulary", "reading"], 1,
            "اختر الظاهرة الصوتية الموصوفة لتحول صوت السين إلى هاء خفيفة:",
            "En el habla popular del Caribe, 'los amigos' suele sonar como 'loh amigoh'.",
            "في النطق الشعبي الكاريبي، غالباً ما تُسمع عبارة 'los amigos' كأنها 'loh amigoh' بالهمس.",
            [
                opt("a", "La aspiración de la esse", "همس حرف السين وتحويله إلى زفير رخو شبيه بالهاء", True),
                opt("b", "La duplicación de la letra", "مضاعفة الحرف وتشديده كحرف مشدد", False, "لا يحدث تشديد للسين."),
                opt("c", "El cambio de la esse por una zeta", "قلب السين إلى ثاء فصيحة", False, "الهمس يحول الصوت إلى هاء /h/.")
            ],
            ["aspiración", "rigor"],
            "«La aspiración de la /-s/» هي تنفيس صوت السين كهاء رخوة /h/ وهي سمة كبرى لمناطق السواحل في الأندلس وجزر الكاريبي وتشيلي."
        ),
        order_ex(
            "ex-c1-pfo-5",
            "رتب الكلمات لبناء حقيقة لسانية تصف انتشار السيسيو في القارة الأمريكية.",
            ["grammar", "writing"], 2,
            ["El", "seseo", "es", "la", "norma", "americana"],
            "El seseo es la norma americana",
            "المبتدأ El seseo يليه الفعل الرابط es وخبر المبتدأ la norma americana.",
            ["seseo"]
        ),
        speak_ex(
            "ex-c1-pfo-6",
            "انطق هذه الجملة مراعياً دقة مخارج الحروف والوعي بالتنوع الصوتي العالمي للغة الإسبانية.",
            ["speaking", "pronunciation"], 2,
            "نطق سليم مراعياً المقارنة بين الأصوات:",
            "La distinción y el seseo son normas legítimas.",
            "التفريق والسيسيو كلاهما معياران فصيحان شرعيان.",
            "pending/c1-u5-fon-spk",
            ["distinción", "seseo"],
            "La distinción y el seseo son normas legítimas.",
            "احرص على إخراج الثاء في distinción بوضع طرف اللسان بين الأسنان، ونطق السين في seseo بصوت صفيري سلس."
        )
    ]
    return lesson_doc(doc, exs, "C1")


def make_lesson_espanol_neutro():
    slug = "c1-espanol-neutro"
    titleAr = "الإسبانية المحايدة والترجمة الدولية: El español neutro e internacional"
    objAr = "أن يفهم المتعلم معايير 'الإسبانية المحايدة' في الدبلجة العالمية والإعلام العابر للحدود، ومبادئ السياسة اللغوية للـ RAE و ASALE."
    
    newVocab = ["neutro", "panhispánico", "doblaje", "homogeneización", "consenso", "rigor"]
    revVocab = ["tiempo", "sociedad", "bien", "trabajo"]
    
    doc = {
        "slug": slug,
        "titleAr": titleAr,
        "level": "C1",
        "programSlug": "main-track",
        "unitSlug": "c1-u5-regional",
        "objectiveAr": objAr,
        "estimatedMinutes": 12,
        "skills": ["grammar", "reading", "writing", "listening", "vocabulary"],
        "newVocabulary": newVocab,
        "reviewVocabulary": revVocab,
        "targetStructures": [
            "El concepto de 'español neutro': estándar deslocalizado para doblaje y medios",
            "Criterios de neutralización: evitación de localismos léxicos y modismos locales",
            "La política lingüística panhispánica: unidad en la diversidad promovida por la ASALE",
            "Tensiones entre neutralidad comercial e identidad cultural viva"
        ],
        "grammarTopics": ["politica-panhispanica", "espanol-neutro-y-medios-c1"],
        "scenarios": [
            {
                "contextAr": "مؤتمر حول صناعة الدبلجة والترجمة للسينما والمنصات الرقمية العالمية في بوغوتا.",
                "settingAr": "مركز المؤتمرات الدولي في بوغوتا، كولومبيا",
                "lines": [
                    {
                        "es": "Las plataformas de streaming exigen un español neutro para amortizar los costes de doblaje en todo el continente.",
                        "ar": "تفرض منصات البث الرقمي إسبانية محايدة لتقليص نفقات الدبلجة وتوزيع الأعمال عبر القارة بأسرها.",
                        "arEg": "منصات البث الكبيرة بتطلب دبلجة بإسبانية محايدة عشان توفر فلوس وتبيع المسلسلات لكل الدول بنفس الصوت.",
                        "audioKey": "pending/c1-u5-neu-1"
                    },
                    {
                        "es": "Ese estándar artificial evita modismos locales como el voseo o el tuteo peninsular con 'vosotros'.",
                        "ar": "يتجنب هذا المعيار المصطنع التعبيرات المحلية الصارخة مثل الفوسيو أو استخدام vosotros الإيبيرية.",
                        "arEg": "المعيار ده بيبعد تماماً عن اللهجات الخاصة زي vos الأرجنتينية أو vosotros الإسبانية عشان الكل يفهم بسهولة.",
                        "audioKey": "pending/c1-u5-neu-2"
                    },
                    {
                        "es": "La política panhispánica de las academias busca el consenso sin imponer la norma de ningún país.",
                        "ar": "تسعى السياسة الجامعة لمجامع اللغة إلى التوافق المشترك دون فرض معيار أي دولة بمفردها على البقية.",
                        "arEg": "سياسة مجامع اللغة الإسبانية كلها بتدور على الإجماع والتوافق، من غير ما تفرض كلام بلد معينة على الباقيين.",
                        "audioKey": "pending/c1-u5-neu-3"
                    },
                    {
                        "es": "Existe un debate encendido sobre si esta homogeneización empobrece la rica diversidad dialectal.",
                        "ar": "يدور نقاش محتدم حول ما إذا كان هذا التنميط والتوحيد القسري يفقر التنوع اللهجي الثري للغة.",
                        "arEg": "في خناقة كبيرة بين اللغويين: هل التوحيد ده بيضعف ويفقر التنوع والجمال اللي في لهجاتنا ولا مفيد للتواصل؟",
                        "audioKey": "pending/c1-u5-neu-4"
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
        "review": review_block()
    }
    
    exs = [
        choice_ex(
            "ex-c1-ene-1", "listen_choose",
            "استمع إلى حديث الخبير وحدد الهدف التجاري والتقني من استخدام 'الإسبانية المحايدة' في المنصات العالمية.",
            ["listening", "vocabulary"], 1,
            "لماذا تلجأ شركات الإنتاج العالمية إلى الإسبانية المحايدة؟",
            "Las plataformas de streaming exigen un español neutro para amortizar los costes de doblaje en todo el continente.",
            "تفرض منصات البث الرقمي إسبانية محايدة لتقليص نفقات الدبلجة وتوزيع الأعمال عبر القارة بأسرها.",
            [
                opt("a", "Para distribuir un único doblaje accesible en todos los países hispanohablantes", "لتوزيع دبلجة واحدة مفهومة ومقبولة في جميع الدول الناطقة بالإسبانية", True),
                opt("b", "Para obligar a todos los espectadores a aprender latín clásico", "لإجبار المشاهدين على تعلم اللغة اللاتينية القديمة", False, "خارج سياق السينما الحديثة."),
                opt("c", "Para eliminar los subtítulos de las películas mudas", "لحذف الترجمة النصية من الأفلام الصامتة", False, "لا يمت للدبلجة بصلة.")
            ],
            ["neutro", "doblaje"],
            "«El español neutro» هو نموذج مصطنع تجارياً يُجرد اللغة من النبرات المحلية والخصوصيات الصرفية لضمان فهم شامل وتسويق موحد.",
            "pending/c1-u5-neu-1",
            "Las plataformas de streaming exigen un español neutro para amortizar los costes de doblaje en todo el continente."
        ),
        choice_ex(
            "ex-c1-ene-2", "word_choice",
            "ما هي السمة الصرفية التي تُحذف وتُستبعد دائماً في الإسبانية المحايدة الدولية لصالح 'ustedes'؟",
            ["grammar", "reading"], 1,
            "اختر الضمير وتصريفه الذي يتم تجنبه في الدبلجة المحايدة:",
            "En el doblaje neutro se elimina sistemáticamente el pronombre ____ y sus formas verbales.",
            "في الدبلجة المحايدة يُحذف بصورة منهجية الضمير vosotros وتصريفاته لصالح ustedes.",
            [
                opt("a", "vosotros", "ضمير المخاطبين الجمع الإيبيري (vosotros) وتصريفاته", True),
                opt("b", "yo", "ضمير المتكلم المفرد أنا", False, "الضمير الأساسي لكل لغة."),
                opt("c", "ellos", "ضمير الغائبين هم", False, "مستخدم في كل العالم بلا استثناء.")
            ],
            ["neutro", "rigor"],
            "نظراً لأن أكثر من 90% من الناطقين بالإسبانية يستخدمون «ustedes» للجمع الحميمي والرسمي معاً، يستبعد «vosotros» تماماً من الدبلجة المحايدة."
        ),
        fill_ex(
            "ex-c1-ene-3",
            "أكمل الجملة بالصفة الدالة على السياسة اللغوية المشتركة لكافة مجامع اللغة الإسبانية الـ23: «la política ____».",
            ["vocabulary", "writing"], 2,
            "اكتب الصفة الجامعة الشاملة للعالم الناطق بالإسبانية:",
            "La Asociación de Academias promueve una visión ____ basada en el respeto mutuo.",
            "ترعى رابطة مجامع اللغة رؤية جامعة شاملة لكل العالم الإسباني قائمة على الاحترام المتبادل.",
            ["panhispánico"],
            ["panhispánica"],
            "المفهوم الأكاديمي المعتمد منذ تسعينيات القرن الماضي هو «la política panhispánica»، حيث لم تعد مدريد هي المرجع الوحيد بل تشترك 23 دولة."
        ),
        choice_ex(
            "ex-c1-ene-4", "word_choice",
            "ما هو الانتقاد الثقافي الرئيسي الموجه لظاهرة 'الإسبانية المحايدة' في الفن والأدب؟",
            ["reading", "vocabulary"], 1,
            "حدد الجانب السلبي الناتج عن محو اللهجات:",
            "Los críticos señalan que la excesiva neutralización produce una pérdida de autenticidad y vivacidad.",
            "يشير النقاد إلى أن الإفراط في الحياد ينتج عنه فقدان للأصالة والحيوية العاطفية للنصوص.",
            [
                opt("a", "Riesgo de despersonalización y pérdida de la riqueza expresiva local", "خطر نزع الخصوصية وتسطيح الحيوية التعبيرية الإنسانية الحية", True),
                opt("b", "Aumento incontrolable de errores ortográficos en los libros", "زيادة هائلة في الأخطاء الإملائية المدرسية", False, "اللغة المحايدة تلتزم الصواب الإملائي الصارم."),
                opt("c", "Imposibilidad de entender los programas de televisión", "استحالة فهم البرامج التلفزيونية", False, "المحايدة صُممت خصيصاً لتكون سهلة الفهم.")
            ],
            ["homogeneización", "rigor"],
            "يخشى الأدباء من أن يؤدي التنميط (homogeneización) إلى لغة هجينة بلا مشاعر، مجردة من النبض الحقيقي للشوارع والثقافات الشعبية."
        ),
        order_ex(
            "ex-c1-ene-5",
            "رتب الكلمات لتكوين مبدأ العمل المشترك بين مجامع اللغة الإسبانية في العالم.",
            ["grammar", "writing"], 2,
            ["Buscamos", "el", "consenso", "panhispánico", "siempre"],
            "Buscamos el consenso panhispánico siempre",
            "الفعل Buscamos متبوعاً بالمفعول به الموصوف el consenso panhispánico والظرف siempre في نهاية التركيب.",
            ["consenso", "panhispánico"]
        ),
        speak_ex(
            "ex-c1-ene-6",
            "انطق هذه الجملة بنبرة رسمية متوازنة تليق ببيان صادر عن مؤتمر أكاديمي دولي.",
            ["speaking", "pronunciation"], 2,
            "نطق سليم مراعياً فخامة الألفاظ:",
            "El consenso panhispánico preserva nuestra unidad.",
            "التوافق والتعاون الشامل لكافة البلدان يحفظ وحدة لغتنا المشتركة.",
            "pending/c1-u5-neu-spk",
            ["consenso", "panhispánico"],
            "El consenso panhispánico preserva nuestra unidad.",
            "احرص على مد مقطع -pán- المنبور في panhispánico وإعطاء حرف s في consenso صوته الصفيري الرائق دون استعجال."
        )
    ]
    return lesson_doc(doc, exs, "C1")


# -------------------------------------------------------------
# UNIT 6: c1-u6-translation (الترجمة والمقارنة اللغوية الإسبانية-العربية)
# -------------------------------------------------------------

def make_lesson_falsos_amigos_avanzados():
    slug = "c1-falsos-amigos-avanzados"
    titleAr = "النظائر الخادعة والأخطاء الشائعة في الترجمة: Falsos amigos avanzados"
    objAr = "أن يتجنب المتعلم الفخاخ المعجمية للنظائر الخادعة (constipado, pretender, realizar, soportar, eventual) عند الترجمة من وإلى الإسبانية."
    
    newVocab = ["constipado", "pretender", "realizar", "soportar", "eventual", "rigor"]
    revVocab = ["tiempo", "sociedad", "bien", "trabajo"]
    
    doc = {
        "slug": slug,
        "titleAr": titleAr,
        "level": "C1",
        "programSlug": "main-track",
        "unitSlug": "c1-u6-translation",
        "objectiveAr": objAr,
        "estimatedMinutes": 12,
        "skills": ["grammar", "reading", "writing", "listening", "vocabulary"],
        "newVocabulary": newVocab,
        "reviewVocabulary": revVocab,
        "targetStructures": [
            "Falso amigo médico: constipado (resfriado, catarro, jamás estreñimiento)",
            "Falso amigo volitivo: pretender (intentar, aspirar a, no fingir como en inglés)",
            "Falso amigo cognitivo: realizar (llevar a cabo, no darse cuenta de repente)",
            "Falso amigo de tolerancia: soportar (aguantar, tolerar, no sostener financieramente)",
            "Falso amigo temporal: eventual (incierto, provisional, no definitivo al final)"
        ],
        "grammarTopics": ["falsos-amigos-avanzados", "interferencias-lexicas-traduccion"],
        "scenarios": [
            {
                "contextAr": "ورشة تدريبية لمترجمين فوريين في مقر الأمم المتحدة بجنيف لمناقشة زلات الترجمة الكبرى.",
                "settingAr": "مقصورة الترجمة الفورية، قصر الأمم، جنيف",
                "lines": [
                    {
                        "es": "Un error garrafal es traducir 'constipado' por estreñimiento; en español significa tener un resfriado común.",
                        "ar": "من الأخطاء الفادحة ترجمة 'constipado' بالإمساك المعوي؛ ففي الإسبانية تعني ببساطة الإصابة بنزلة برد وزكام.",
                        "arEg": "غلطة شنيعة إنك تترجم constipado بإمساك؛ في الإسباني دي معناها عنده نزلة برد ورشح مش أكتر.",
                        "audioKey": "pending/c1-u6-fal-1"
                    },
                    {
                        "es": "Asimismo, 'pretender' no significa fingir, sino albergar la firme intención de lograr un objetivo.",
                        "ar": "كذلك، فإن فعل 'pretender' لا يعني التظاهر والادعاء الكاذب، بل السعي وامتلاك نية جازمة لتحقيق هدف.",
                        "arEg": "وكمان فعل pretender مش معناه بيستهبل أو بيمثل، معناه إنه بيسعى وعايز يحقق هدف بجدية.",
                        "audioKey": "pending/c1-u6-fal-2"
                    },
                    {
                        "es": "Cuando decimos que un empleo es 'eventual', nos referimos a que es temporal e incierto, no definitivo.",
                        "ar": "حين نقول إن وظيفة ما هي 'eventual'، فنحن نعني أنها مؤقتة وغير مستقرة، وليست نهائية بأي حال.",
                        "arEg": "لما نقول الشغلانة دي eventual نقصد إنها مؤقتة ومش دايمة، مش زي ما الناس فاهمة بالترجمة الحرفية.",
                        "audioKey": "pending/c1-u6-fal-3"
                    },
                    {
                        "es": "El traductor riguroso debe desconfiar de las semejanzas engañosas con otras lenguas occidentales.",
                        "ar": "يجب على المترجم الحصيف والمتمرس أن يرتاب في أوجه الشبه الخادعة مع اللغات الغربية الأخرى.",
                        "arEg": "المترجم الشاطر لازم ياخد باله ومينخدعش بالشبه الظاهري بين الكلمات الإسبانية والإنجليزي أو اللغات التانية.",
                        "audioKey": "pending/c1-u6-fal-4"
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
        "review": review_block()
    }
    
    exs = [
        choice_ex(
            "ex-c1-faa-1", "listen_choose",
            "استمع إلى تحذير مدرب الترجمة وحدد المعنى الحقيقي لكلمة «constipado» في اللغة الإسبانية الفصيحة.",
            ["listening", "vocabulary"], 1,
            "ماذا يعني شخص يقول بالإسبانية: «Estoy constipado»؟",
            "Un error garrafal es traducir 'constipado' por estreñimiento; en español significa tener un resfriado común.",
            "من الأخطاء الفادحة ترجمة 'constipado' بالإمساك المعوي؛ ففي الإسبانية تعني ببساطة الإصابة بنزلة برد وزكام.",
            [
                opt("a", "Tener un resfriado, gripe o catarro común", "مصاب بنزلة برد أو رشح وزكام حاد في الجهاز التنفسي", True),
                opt("b", "Sufrir estreñimiento intestinal", "يعاني من إمساك معوي وبطء هضم", False, "هذا هو الفخ الترجمي الشهير بسبب الإنجليزية والفرنسية."),
                opt("c", "Estar enfadado y deprimido", "يشعر بالغضب والاكتئاب النفسي", False, "لا علاقة له بالأعراض المرضية.")
            ],
            ["constipado", "rigor"],
            "في الإسبانية «constipado» مرادف لـ resfriado (نزلة برد). أما الإمساك فيسمى حصراً «estreñimiento».",
            "pending/c1-u6-fal-1",
            "Un error garrafal es traducir 'constipado' por estreñimiento; en español significa tener un resfriado común."
        ),
        choice_ex(
            "ex-c1-faa-2", "word_choice",
            "ما هو المعنى الحقيقي للفعل «pretender» في جملة مثل: «El gobierno pretende reducir el déficit»؟",
            ["reading", "vocabulary"], 1,
            "اختر الدلالة الإسبانية الفصيحة للفعل pretender:",
            "El joven investigador pretende obtener una beca postdoctoral este año.",
            "يسعى الباحث الشاب ويعتزم الحصول على منحة ما بعد الدكتوراه هذا العام.",
            [
                opt("a", "Tener la intención, aspirar o proponerse un fin", "الاعتزام والسعي الجاد والطموح لتحقيق غاية", True),
                opt("b", "Fingir o simular falsamente algo que no es", "التظاهر الكاذب والادعاء المخادع", False, "هذا معنى to pretend في الإنجليزية وهو نظير خادع."),
                opt("c", "Olvidar por completo las obligaciones", "نسيان الواجبات وإهمالها", False, "عكس النية والسعي تماماً.")
            ],
            ["pretender", "rigor"],
            "«Pretender» في الإسبانية تعني السعي والطموح (aspirar / intentar). أما التظاهر والادعاء فيقابله الفعل «fingir»."
        ),
        fill_ex(
            "ex-c1-faa-3",
            "أكمل الجملة بالصفة التي تعني في الإسبانية «مؤقت وعارض وقابل للتغير» ولا تعني نهائياً: «un contrato ____».",
            ["vocabulary", "writing"], 2,
            "اكتب الصفة الإسبانية الخادعة الدالة على العمل المؤقت:",
            "No tiene plaza fija en la empresa; por ahora tiene un contrato ____.",
            "ليس لديه وظيفة دائمة في الشركة؛ ففي الوقت الراهن لديه عقد مؤقت وعارض.",
            ["eventual"],
            ["eventual"],
            "«Eventual» في الإسبانية تعني عارض أو مؤقت (provisional / incierto). أما في الإنجليزية فتعني eventual (النهائي في العاقبة)."
        ),
        choice_ex(
            "ex-c1-faa-4", "word_choice",
            "ماذا يعني الفعل «soportar» في الإسبانية في سياق: «No soporto este calor sofocante»؟",
            ["vocabulary", "reading"], 1,
            "اختر المعنى النفسي والإدراكي الدقيق للفعل soportar:",
            "El paciente apenas puede ____ el dolor de la herida.",
            "بالكاد يستطيع المريض تحمل وطأة الألم الناتج عن الجرح ومكابدته.",
            [
                opt("a", "aguantar, tolerar o sufrir con paciencia", "التحمل والمكابدة والصبر على المكروه", True),
                opt("b", "financiar económicamente a una familia", "الإنفاق المالي وإعالة الأسرة", False, "هذا معنى to support في الإنجليزية."),
                opt("c", "aplaudir una actuación musical", "التصفيق والإشادة بعرض موسيقي", False, "لا علاقة له بتحمل الألم.")
            ],
            ["soportar", "rigor"],
            "«Soportar» تعني الصبر والتحمل (aguantar). أما الدعم والمساندة والإعالة المالية فيقابلها في الإسبانية «apoyar» أو «mantener»."
        ),
        order_ex(
            "ex-c1-faa-5",
            "رتب الكلمات لبناء جملة تحذر من الوقوع في فخاخ الكلمات الخادعة في الترجمة.",
            ["grammar", "writing"], 2,
            ["Evitemos", "los", "falsos", "amigos", "peligrosos"],
            "Evitemos los falsos amigos peligrosos",
            "صيغة الحث Evitemos متبوعة بالمفعول به los falsos amigos والصفة التحذيرية peligrosos.",
            ["rigor"]
        ),
        speak_ex(
            "ex-c1-faa-6",
            "انطق هذه الجملة بنبرة مترجم حذر يتحرى الدقة الصارمة في اختيار ألفاظه.",
            ["speaking", "pronunciation"], 2,
            "نطق سليم مراعياً الإيقاع الصوتي الرصين:",
            "No pretendo imponer mi criterio personal.",
            "لا أسعى ولا أعتزم فرض معاييري وتفضيلاتي الشخصية.",
            "pending/c1-u6-fal-spk",
            ["pretender", "rigor"],
            "No pretendo imponer mi criterio personal.",
            "انتبه لنطق حرف r الرخو في criterio وإخراج التاء غير مفخمة في pretendo لضمان الرصانة اللغوية."
        )
    ]
    return lesson_doc(doc, exs, "C1")


def make_lesson_traduccion_juridica():
    slug = "c1-traduccion-juridica"
    titleAr = "الترجمة القانونية وصياغة العقود: Traducción jurídica y redacción contractual"
    objAr = "أن يترجم ويصيغ المتعلم النصوص القانونية والعقود الدولية محترماً المصطلحات المعيارية والأسلوب القضائي الصارم (cláusula resolutoria, de conformidad con, sin perjuicio de)."
    
    newVocab = ["cláusula", "resolutoria", "conformidad", "perjuicio", "otorgar", "rigor"]
    revVocab = ["tiempo", "sociedad", "bien", "trabajo"]
    
    doc = {
        "slug": slug,
        "titleAr": titleAr,
        "level": "C1",
        "programSlug": "main-track",
        "unitSlug": "c1-u6-translation",
        "objectiveAr": objAr,
        "estimatedMinutes": 12,
        "skills": ["grammar", "reading", "writing", "listening", "vocabulary"],
        "newVocabulary": newVocab,
        "reviewVocabulary": revVocab,
        "targetStructures": [
            "Fórmulas prepositivas jurídicas: de conformidad con lo dispuesto en el artículo",
            "Fórmulas de reserva de derechos: sin perjuicio de las acciones legales pertinentes",
            "Tipología de estipulaciones: cláusula resolutoria expresa por incumplimiento",
            "Actos solemnes: otorgar escritura pública ante notario colegiado"
        ],
        "grammarTopics": ["lenguaje-juridico-c1", "traduccion-contractual-espanol-arabe"],
        "scenarios": [
            {
                "contextAr": "مراجعة الصياغة القانونية لاتفاقية تجارية كبرى بين شركتين دوليتين في مدريد.",
                "settingAr": "مكتب موثق العقود والعدل (Notaría) في شارع كاستيانا، مدريد",
                "lines": [
                    {
                        "es": "De conformidad con lo dispuesto en la legislación mercantil, el contrato entrará en vigor de inmediato.",
                        "ar": "بموجب ما تنص عليه التشريعات التجارية، يدخل هذا العقد حيز النفاذ فوراً.",
                        "arEg": "طبقاً للي نص عليه القانون التجاري، العقد ده هيسري ويتنفذ من دلوقتي علطول.",
                        "audioKey": "pending/c1-u6-jur-1"
                    },
                    {
                        "es": "Hemos incorporado una cláusula resolutoria en caso de incumplimiento manifiesto de los plazos.",
                        "ar": "لقد أدرجنا شرطاً فاسخاً وصريحاً في حال الإخلال البين بالمواعيد والآجال المحددة.",
                        "arEg": "حطينا بند شرط فاسخ صريح يفسخ العقد لو أي طرف اتأخر وأخل بالمواعيد المتفق عليها.",
                        "audioKey": "pending/c1-u6-jur-2"
                    },
                    {
                        "es": "Todo ello se entenderá sin perjuicio de las indemnizaciones por daños a que hubiere lugar.",
                        "ar": "كل ذلك يفهم ويسري دون الإخلال بحق المطالبة بالتعويضات عن الأضرار متى كان لها مقتضى.",
                        "arEg": "كل الكلام ده بيسري من غير ما يضيع حق الشركة في طلب تعويضات عن أي خساير أو أضرار.",
                        "audioKey": "pending/c1-u6-jur-3"
                    },
                    {
                        "es": "Las partes comparecen voluntariamente para otorgar esta escritura pública ante notario.",
                        "ar": "يمثل الطرفان طواعية واختياراً لتحرير وتوثيق هذا السند الرسمي أمام كاتب العدل.",
                        "arEg": "الطرفين حاضرين بمزاجهم ورضاهم التام عشان يوثقوا العقد الرسمي ده قدام الشهر العقاري.",
                        "audioKey": "pending/c1-u6-jur-4"
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
        "review": review_block()
    }
    
    exs = [
        choice_ex(
            "ex-c1-tju-1", "listen_choose",
            "استمع إلى نص البند التعاقدي واكتشف المصطلح الدال على 'الشرط الفاسخ للعقد عند الإخلال'.",
            ["listening", "vocabulary"], 1,
            "ما هو المصطلح القانوني الدال على البند الذي يبطل العقد ويفسخه عند وقوع المخالفة؟",
            "Hemos incorporado una cláusula resolutoria en caso de incumplimiento manifiesto de los plazos.",
            "لقد أدرجنا شرطاً فاسخاً وصريحاً في حال الإخلال البين بالمواعيد والآجال المحددة.",
            [
                opt("a", "Una cláusula resolutoria", "شرط فاسخ ينهي الرابطة العقدية عند الإخلال بالالتزام", True),
                opt("b", "Una cláusula cómica", "بند فكاهي للترفيه عن الموقعين", False, "العقود وثائق إلزامية لا هزل فيها."),
                opt("c", "Una cláusula provisional", "بند غير ملزم يزول بعد يوم واحد", False, "الشرط الفاسخ جزاء صارم وليس بنداً عابراً.")
            ],
            ["cláusula", "resolutoria"],
            "«La cláusula resolutoria» في القانون المدني والتجاري هي البند الذي يتفق فيه الأطراف على فسخ العقد تلقائياً بمجرد إخلال أحدهما بتعهداته.",
            "pending/c1-u6-jur-2",
            "Hemos incorporado una cláusula resolutoria en caso de incumplimiento manifiesto de los plazos."
        ),
        choice_ex(
            "ex-c1-tju-2", "word_choice",
            "ما هي العبارة القانونية المعيارية المقابلة لـ «بموجب أحكام المادة / طبقاً لما هو منصوص عليه»؟",
            ["grammar", "reading"], 1,
            "اختر التعبير الديباجي القضائي السليم:",
            "____ lo dispuesto en la normativa vigente, se procede a la firma del acta.",
            "بموجب ما هو منصوص عليه في اللوائح السارية، يُشرع في توقيع محضر الاجتماع.",
            [
                opt("a", "De conformidad con", "بموجب / طبقاً لما تنص عليه التشريعات المعمول بها", True),
                opt("b", "En contra de", "على عكس وتحدياً لما يقره القانون", False, "إقرار بمخالفة القانون."),
                opt("c", "A pesar de", "على الرغم من وجود المادة القانونية", False, "تفيد الاستدراك والمخالفة.")
            ],
            ["conformidad", "rigor"],
            "تعد صيغة «De conformidad con lo dispuesto en...» من أكثر التراكيب النمطية استقراراً في صياغة العقود والأحكام القضائية."
        ),
        fill_ex(
            "ex-c1-tju-3",
            "أكمل عبارة التحفظ القانوني الشهيرة الدالة على الحفاظ على الحقوق الأخرى: «sin ____ de».",
            ["vocabulary", "writing"], 2,
            "اكتب الكلمة الناقصة الدالة على الضرر أو المساس بالحق:",
            "La sanción se aplicará sin ____ de las responsabilidades penales correspondientes.",
            "تُطبق العقوبة دون الإخلال أو المساس بالمسؤوليات الجنائية المترتبة على الفعل.",
            ["perjuicio"],
            ["perjuicio"],
            "الصيغة القانونية القياسية هي «sin perjuicio de» وتقابل في لغة المحاكم العربية «دون إخلال بـ / دون مساس بحق كذا»."
        ),
        choice_ex(
            "ex-c1-tju-4", "word_choice",
            "ما الفعل القانوني المستخدم للتعبير عن «توثيق وتحرير العقد الرسمي أو الوصية أمام كاتب العدل»؟",
            ["vocabulary", "reading"], 1,
            "اختر الفعل الرسمي للإجراء التوثيقي المعتمد:",
            "Los comparecientes deciden ____ escritura pública de compraventa.",
            "يقرر الحاضرون توثيق وتحرير سند رسمي بالبيع والشراء أمام كاتب العدل.",
            [
                opt("a", "otorgar", "تحرير وتوثيق وإبرام السند القانوني الرسمي", True),
                opt("b", "regalar", "إهداء الوثيقة كهدية مجانية للأصدقاء", False, "معنى عادي لا ينتمي للتوثيق القضائي."),
                opt("c", "romper", "تمزيق الأوراق وإتلافها", False, "عكس إبرام العقد وتوثيقه.")
            ],
            ["otorgar", "cláusula"],
            "في لغة التوثيق القضائي يقال «otorgar testamento / otorgar escritura» بمعنى منح الإرادة الرسمية وإبرام المحرر أمام السلطة المختصة."
        ),
        order_ex(
            "ex-c1-tju-5",
            "رتب الكلمات لبناء ديباجة تعاقدية قانونية تثبت الشرعية الإجرائية.",
            ["grammar", "writing"], 2,
            ["De", "conformidad", "con", "la", "ley", "vigente"],
            "De conformidad con la ley vigente",
            "حرف الجر والاسم المجرور De conformidad متبوعاً بحرف الجر con والاسم الموصوف la ley vigente.",
            ["conformidad"]
        ),
        speak_ex(
            "ex-c1-tju-6",
            "انطق هذه العبارة التعاقدية بنبرة حازمة توحي بالهيبة الإلزامية للنصوص القانونية.",
            ["speaking", "pronunciation"], 2,
            "نطق سليم مراعياً الوقفات الإلزامية في العقود:",
            "Se incluye una cláusula resolutoria expresa.",
            "يُدرج في هذا العقد شرط فاسخ وصريح ونافذ.",
            "pending/c1-u6-jur-spk",
            ["cláusula", "resolutoria"],
            "Se incluye una cláusula resolutoria expresa.",
            "احرص على نطق التنوين الإيقاعي الدقيق لكلمة cláusula ونبر مقطع -to- في resolutoria بوضوح تام."
        )
    ]
    return lesson_doc(doc, exs, "C1")


def make_lesson_traduccion_literaria():
    slug = "c1-traduccion-literaria"
    titleAr = "الترجمة الأدبية ونقل الروح الشعرية: Traducción literaria y transposición poética"
    objAr = "أن ينقل المتعلم النص الأدبي والشعري محتفظاً بالحمولة الرمزية والإيقاع الداخلي والروح التعبيرية (equivalencia, transposición, fidelidad, registro)."
    
    newVocab = ["transposición", "equivalencia", "fidelidad", "cadencia", "sublime", "rigor"]
    revVocab = ["tiempo", "sociedad", "bien", "trabajo"]
    
    doc = {
        "slug": slug,
        "titleAr": titleAr,
        "level": "C1",
        "programSlug": "main-track",
        "unitSlug": "c1-u6-translation",
        "objectiveAr": objAr,
        "estimatedMinutes": 12,
        "skills": ["grammar", "reading", "writing", "listening", "vocabulary"],
        "newVocabulary": newVocab,
        "reviewVocabulary": revVocab,
        "targetStructures": [
            "La transposición poética: recrear la música del verso sin servilismo literal",
            "La equivalencia estética: preservar la carga emotiva frente a la traducción léxica",
            "La fidelidad a la voz del autor: tono, ironía, ambigüedad calculada",
            "La cadencia y el ritmo prosódico en la prosa poética hispanoárabe"
        ],
        "grammarTopics": ["traductologia-literaria", "poetica-comparada-espanol-arabe"],
        "scenarios": [
            {
                "contextAr": "طاولة مستديرة حول ترجمة عيون الشعر الإسباني والأندلسي إلى العربية المعاصرة.",
                "settingAr": "معهد الدراسات العربية والإسلامية في طليطلة",
                "lines": [
                    {
                        "es": "Traducir poesía exige una transposición creadora; el calco literal asesina la música del texto.",
                        "ar": "تتطلب ترجمة الشعر نقلة وتحويلاً إبداعياً خلاقاً؛ فالنقل الحرفي يغتال موسيقى النص ويفسد روحه.",
                        "arEg": "ترجمة الشعر عايزة إبداع وإعادة خلق من جديد؛ لأن النقل الحرفي كلمة بكلمة بيقتل روح القصيدة ونغمها.",
                        "audioKey": "pending/c1-u6-lit-1"
                    },
                    {
                        "es": "La verdadera fidelidad no consiste en contar palabras, sino en recrear la cadencia y el misterio.",
                        "ar": "ليست الأمانة الحقة في عد الكلمات حرفياً، بل في إعادة توليد الإيقاع وسحر الغموض الفني.",
                        "arEg": "الأمانة الحقيقية في الأدب مش إنك تترجم كلمة كلمة، الأمانة إنك توصل نغمة الشاعر وسحره للقارئ.",
                        "audioKey": "pending/c1-u6-lit-2"
                    },
                    {
                        "es": "Buscamos una equivalencia estética que suscite en el lector árabe la misma emoción sublime.",
                        "ar": "إننا ننشد تكافؤاً جمالياً يوقظ في نفس القارئ العربي ذات الشحنة العاطفية السامية.",
                        "arEg": "إحنا بندور على معادل جمالي يخلي القارئ العربي يحس بنفس الرعشة والجمال اللي حس بيهم الإسباني.",
                        "audioKey": "pending/c1-u6-lit-3"
                    },
                    {
                        "es": "El traductor literario se convierte así en un cómplice íntimo de la voz original.",
                        "ar": "وهكذا يستحيل المترجم الأدبي شريكاً وقريناً حميماً لصوت المؤلف الأصلي.",
                        "arEg": "وبالشكل ده المترجم الأدبي بيتحول لقرين وشريك روحي لصاحب النص الأصلي مش مجرد ناقل وخلاص.",
                        "audioKey": "pending/c1-u6-lit-4"
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
        "review": review_block()
    }
    
    exs = [
        choice_ex(
            "ex-c1-tli-1", "listen_choose",
            "استمع إلى حديث المترجم الأدبي وحدد ما يفعله النقل الحرفي الجامد بموسيقى النص الشعري.",
            ["listening", "vocabulary"], 1,
            "ما عاقبة الترجمة الحرفية العقيمة في ترجمة القصائد الشعرية؟",
            "Traducir poesía exige una transposición creadora; el calco literal asesina la música del texto.",
            "تتطلب ترجمة الشعر نقلة وتحويلاً إبداعياً خلاقاً؛ فالنقل الحرفي يغتال موسيقى النص ويفسد روحه.",
            [
                opt("a", "Asesina la música y la belleza intrínseca del poema", "يغتال الإيقاع الموسيقي والجمال الداخلي للقصيدة", True),
                opt("b", "Mejora enormemente la rima y el ritmo", "يحسن القافية ويجعلها أفضل من الأصل", False, "النقل الحرفي يشوه الشعر."),
                opt("c", "Hace que el libro sea gratis", "يجعل سعر الكتاب مجانياً في المكتبات", False, "لا علاقة له بالتقييم الجمالي.")
            ],
            ["transposición", "cadencia"],
            "يؤكد نقاد الترجمة أن النقل الحرفي (calco literal) في الأدب جريمة ذوقية لأنه يجرد اللغة من نبضها وإيقاعها الداخلي.",
            "pending/c1-u6-lit-1",
            "Traducir poesía exige una transposición creadora; el calco literal asesina la música del texto."
        ),
        choice_ex(
            "ex-c1-tli-2", "word_choice",
            "ما هو المفهوم النقدي الدال على «إيجاد مقابل يولد نفس الأثر الجمالي والعاطفي في لغة الهدف»؟",
            ["reading", "vocabulary"], 1,
            "اختر المصطلح المعبر عن التكافؤ الفني في الترجمة الأدبية:",
            "El poeta tradujo el soneto buscando una auténtica ____ estética.",
            "ترجم الشاعر السونيتة باحثاً عن تكافؤ جمالي حقيقي يعيد إحياء المعنى.",
            [
                opt("a", "equivalencia", "تكافؤ دلالي وتأثيري موازٍ للأصل", True),
                opt("b", "equivocación", "خطأ فادح وسوء فهم للمفردات", False, "الخطأ يفسد النص."),
                opt("c", "eliminación", "حذف الأبيات الصعبة وتجاوزها", False, "عجز وتشويه وليس ترجمة.")
            ],
            ["equivalencia", "rigor"],
            "«La equivalencia estética» هي الغاية العظمى لمترجم الأدب، حيث لا يطابق الكلمة بالكلمة بل يطابق الأثر الوجداني والجمالي للعمل."
        ),
        fill_ex(
            "ex-c1-tli-3",
            "أكمل المصطلح الدال على الموسيقى الداخلية وتناغم الإيقاع في النثر الأدبي: «la ____ del texto».",
            ["vocabulary", "writing"], 2,
            "اكتب الكلمة المعبرة عن الإيقاع الرخيم للعبارات:",
            "El traductor logró conservar la maravillosa ____ musical de la prosa de Cervantes.",
            "نجح المترجم في المحافظة على الإيقاع الموسيقي البديع لنثر ثربانتس الساحر.",
            ["cadencia"],
            ["cadencia"],
            "«La cadencia» هي الجرس الموسيقي والتتابع الإيقاعي المتناغم للمقاطع الصوتية الذي يمنح النثر الرفيع طابعه الآسر."
        ),
        choice_ex(
            "ex-c1-tli-4", "word_choice",
            "كيف تُعرّف «الأمانة الأدبية» (la fidelidad) في علم الترجمة الحديث؟",
            ["vocabulary", "reading"], 1,
            "اختر التعريف المعاصر للأمانة في نقل النصوص الروائية والشعرية:",
            "La fidelidad contemporánea consiste en ser leal al tono, la intención y el espíritu de la obra.",
            "تتمثل الأمانة المعاصرة في الوفاء لنبرة العمل وقصديته وروحه الإبداعية العميقة.",
            [
                opt("a", "Fidelidad al espíritu, al tono y a la cosmovisión del autor", "الأمانة لروح النص ونبرة صوته ورؤيته الكلية للعالم", True),
                opt("b", "Traducción palabra por palabra mediante un diccionario de bolsillo", "ترجمة كلمة بكلمة بالمعجم الصغير دون تغيير", False, "أسلوب بدائي يولد نصوصاً ميتة."),
                opt("c", "Cambiar todos los nombres de los personajes al azar", "تبديل أسماء الأبطال وفق الهوى والعبث", False, "خيانة للنص وتشويه لهويته.")
            ],
            ["fidelidad", "sublime"],
            "الأمانة الحقيقية «fidelidad» لم تعد تعني العبودية الحرفية، بل القدرة على إعادة خلق العمل في اللغة الجديدة بنفس القوة والألق."
        ),
        order_ex(
            "ex-c1-tli-5",
            "رتب الكلمات لبناء قاعدة نقدية تؤكد على البعد الإبداعي للترجمة الأدبية.",
            ["grammar", "writing"], 2,
            ["Traducir", "poesía", "es", "un", "arte", "sublime"],
            "Traducir poesía es un arte sublime",
            "المبتدأ المصدري Traducir poesía يليه الفعل الرابط es وخبر المبتدأ un arte sublime.",
            ["sublime"]
        ),
        speak_ex(
            "ex-c1-tli-6",
            "انطق هذه الجملة بنبرة حالمة توحي بتقدير سر الصنعة الأدبية وجمالها الخالد.",
            ["speaking", "pronunciation"], 2,
            "نطق سليم مراعياً الرنين العاطفي للألفاظ:",
            "La poesía exige una transposición creadora.",
            "يتطلب الشعر نقلة وتحويلاً إبداعياً خلاقاً لا مجرد نقل حرفي.",
            "pending/c1-u6-lit-spk",
            ["transposición", "rigor"],
            "La poesía exige una transposición creadora.",
            "احرص على إخراج حرف s في transposición بهدوء، ونطق مقطع -ció- المنبور بوضوح تام ووقار رفيع."
        )
    ]
    return lesson_doc(doc, exs, "C1")


def make_lesson_interferencias_sintacticas():
    slug = "c1-interferencias-sintacticas"
    titleAr = "التداخل النحوي بين الإسبانية والعربية: Interferencias sintácticas y estilización"
    objAr = "أن يتغلب المتعلم على التداخلات التركيبية بين الإسبانية والعربية (ترتيب الكلمات VSO/SVO، إسقاط الضمير، حروف الجر المتعدية)."
    
    newVocab = ["interferencia", "elipsis", "régimen", "anteposición", "asimetría", "rigor"]
    revVocab = ["tiempo", "sociedad", "bien", "trabajo"]
    
    doc = {
        "slug": slug,
        "titleAr": titleAr,
        "level": "C1",
        "programSlug": "main-track",
        "unitSlug": "c1-u6-translation",
        "objectiveAr": objAr,
        "estimatedMinutes": 12,
        "skills": ["grammar", "reading", "writing", "listening", "vocabulary"],
        "newVocabulary": newVocab,
        "reviewVocabulary": revVocab,
        "targetStructures": [
            "Orden de constituyentes: flexibilidad hispánica frente al orden VSO arábigo clásico",
            "La elipsis del sujeto pronominal (lengua pro-drop): evitar la redundancia de 'yo/él'",
            "Régimen preposicional contrastivo: soñar con (يحلم بـ) / depender de (يعتمد على)",
            "La anteposición enfática del complemento y tematización estilística"
        ],
        "grammarTopics": ["linguistica-contrastiva-espanol-arabe", "estilistica-y-sintaxis-c1"],
        "scenarios": [
            {
                "contextAr": "محاضرة في الترجمة المقارنة بجامعة غرناطة لمعالجة الأخطاء التركيبية للناطقين بالعربية.",
                "settingAr": "كلية الترجمة والترجمة الفورية، جامعة غرناطة",
                "lines": [
                    {
                        "es": "Muchos traductores caen en la trampa de la interferencia sintáctica calcando la estructura del árabe.",
                        "ar": "يقع العديد من المترجمين في فخ التداخل النحوي عبر محاكاة البنية التركيبية للغة العربية محاكاة حرفية.",
                        "arEg": "مترجمين كتير بيقعوا في فخ التداخل بين اللغتين، وبينقلوا ترتيب الجملة العربي في الإسباني زي ما هو.",
                        "audioKey": "pending/c1-u6-int-1"
                    },
                    {
                        "es": "En español la elipsis del sujeto es la norma general; repetir pronombres como 'yo' o 'él' resulta artificioso.",
                        "ar": "في الإسبانية يعد حذف ضمير الفاعل هو الأصل والقاعدة؛ وتكرار ضمائر مثل 'yo' أو 'él' يولد ركاكة وتكلفاً مصطنعاً.",
                        "arEg": "في الإسباني حذف ضمير الفاعل هو الطبيعي، وتكرار yo و él عمال على بطال بيخلي الكلام تقيل ومصطنع جداً.",
                        "audioKey": "pending/c1-u6-int-2"
                    },
                    {
                        "es": "Debemos prestar minuciosa atención al régimen preposicional de cada verbo para no errar.",
                        "ar": "يجب علينا أن نولي اهتماماً فائقاً لحروف الجر الملازمة لكل فعل حتى لا ننزلق في الأخطاء الشائعة.",
                        "arEg": "لازم نركز كويس جداً في حروف الجر اللي بتيجي مع كل فعل إسباني، عشان منترجمش حرف الجر العربي مكانه.",
                        "audioKey": "pending/c1-u6-int-3"
                    },
                    {
                        "es": "Superar estas asimetrías estructurales es el paso definitivo para lograr una prosa elegante y natural.",
                        "ar": "إن تجاوز هذه الفروق والتباينات الهيكلية هو الخطوة الحاسمة لصياغة أسلوب نثري أنيق وطبيعي الجريان.",
                        "arEg": "تخطي الفروق التركيبية دي بين اللغتين هو السر الحقيقي عشان تكتب إسباني فصيح وسلس من غير ركاكة.",
                        "audioKey": "pending/c1-u6-int-4"
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
        "review": review_block()
    }
    
    exs = [
        choice_ex(
            "ex-c1-isi-1", "listen_choose",
            "استمع إلى نصيحة أستاذ اللسانيات المقارنة وحدد القاعدة الذهبية بخصوص ضمائر الفاعل في الإسبانية.",
            ["listening", "grammar"], 1,
            "ما هو السلوك الأسلوبي السليم تجاه ضمير الفاعل (yo, tú, él) في لغة C1 الرفيعة؟",
            "En español la elipsis del sujeto es la norma general; repetir pronombres como 'yo' o 'él' resulta artificioso.",
            "في الإسبانية يعد حذف ضمير الفاعل هو الأصل والقاعدة؛ وتكرار ضمائر مثل 'yo' أو 'él' يولد ركاكة وتكلفاً مصطنعاً.",
            [
                opt("a", "Omitir el pronombre salvo cuando sea indispensable para evitar ambigüedad o enfatizar", "إسقاط الضمير وحذفه إلا عند الضرورة القصوى لرفع اللبس أو التوكيد", True),
                opt("b", "Repetir el pronombre en cada una de las frases sin excepción", "تكرار الضمير في أول كل جملة دون استثناء", False, "يولد ركاكة وثقلاً أسلوبياً معيباً."),
                opt("c", "Prohibir totalmente el uso de verbos conjugados", "منع استخدام الأفعال المصرفة تماماً", False, "مستحيل في بنية أي لغة.")
            ],
            ["elipsis", "interferencia"],
            "الإسبانية لغة «pro-drop» حيث تكفي نهايات تصريف الفعل لتحديد الفاعل، وحذف الضمير (elipsis) هو معيار الفصاحة الطبيعية.",
            "pending/c1-u6-int-2",
            "En español la elipsis del sujeto es la norma general; repetir pronombres como 'yo' o 'él' resulta artificioso."
        ),
        choice_ex(
            "ex-c1-isi-2", "word_choice",
            "ما هو حرف الجر الإسباني الصحيح المتعدي به الفعل «soñar» لمقابلة التعبير العربي «يحلم بـ»؟",
            ["grammar", "reading"], 1,
            "اختر حرف الجر المتعدي الصحيح وفق النظام النحوي الإسباني:",
            "Desde su infancia, el joven soñaba ____ viajar por todo el mundo.",
            "منذ نعومة أظفاره، كان الشاب يحلم بالسفر والتجوال حول العالم بأسره.",
            [
                opt("a", "con", "حرف الجر con وهو الملازم للفعل soñar في الفصحى", True),
                opt("b", "en", "حرف الجر en نقلاً حرفياً خاطئاً", False, "خطأ ترجمي شائع."),
                opt("c", "a", "حرف الجر a", False, "لا يتعدى به فعل الحلم مطلقاً.")
            ],
            ["régimen", "rigor"],
            "النظام الحرفي (régimen preposicional) يفرض «soñar con algo»، وترجمته بـ soñar en أو soñar de خطأ ناتج عن التداخل النحوي مع لغات أخرى."
        ),
        fill_ex(
            "ex-c1-isi-3",
            "أكمل الجملة بالمصطلح اللساني الدال على حذف الكلمة المفهومة من السياق دون إخلال: «la ____ del sujeto».",
            ["vocabulary", "writing"], 2,
            "اكتب الكلمة اللسانية الدالة على الإيجاز بالحذف:",
            "La ____ pronominal otorga fluidez y naturalidad a la redacción académica.",
            "إن إسقاط وحذف الضمير يضفي انسيابية وتدفقاً طبيعياً على الكتابة الأكاديمية الرفيعة.",
            ["elipsis"],
            ["elipsis"],
            "«La elipsis» (الإضمار أو الحذف البلاغي) ظاهرة مركزية في الإسبانية لتفادي التكرار الممل للضمائر والأسماء المحورية."
        ),
        choice_ex(
            "ex-c1-isi-4", "word_choice",
            "ما هو التوصيف اللساني لعدم التطابق البنيوي والتركيبي بين نظامين لغويين مثل الإسبانية والعربية؟",
            ["vocabulary", "reading"], 1,
            "اختر المصطلح المعبر عن التباين الهيكلي بين اللغات:",
            "El traductor profesional debe dominar las ____ sintácticas entre ambas lenguas.",
            "يجب على المترجم المتمرس أن يتقن التعامل مع التباينات وعدم التناظر التركيبي بين كلا اللغتين.",
            [
                opt("a", "asimetrías", "الفروق والتباينات الهيكلية غير المتطابقة", True),
                opt("b", "simpatías", "المشاعر الودية المتبادلة بين الناس", False, "عاطفة إنسانية لا علاقة لها باللسانيات."),
                opt("c", "compras", "عمليات الشراء في المتجر", False, "مفردات استهلاكية.")
            ],
            ["asimetría", "interferencia"],
            "«Las asimetrías sintácticas» هي التباينات في رتبة الكلمات وعلاقات الإسناد والتبعية التي تمنع النقل الحرفي وتستلزم إعادة صياغة جذرية."
        ),
        order_ex(
            "ex-c1-isi-5",
            "رتب الكلمات لبناء قاعدة أسلوبية تحث على نقاء التعبير من شوائب التداخل اللغوي.",
            ["grammar", "writing"], 2,
            ["Evita", "toda", "interferencia", "sintáctica", "innecesaria"],
            "Evita toda interferencia sintáctica innecesaria",
            "الأمر Evita متبوعاً بالمفعول به toda interferencia والصفات sintáctica innecesaria.",
            ["interferencia"]
        ),
        speak_ex(
            "ex-c1-isi-6",
            "انطق هذه الجملة بنبرة أستاذ لغويات يبرز أهمية الإيقاع الطبيعي الخالي من الشوائب الحرفية.",
            ["speaking", "pronunciation"], 2,
            "نطق سليم مراعياً خلو الصوت من التردد:",
            "La elipsis del sujeto embellece el estilo.",
            "إن حذف ضمير الفاعل يزين الأسلوب ويضفي عليه بهاءً ورشاقة.",
            "pending/c1-u6-int-spk",
            ["elipsis", "rigor"],
            "La elipsis del sujeto embellece el estilo.",
            "احرص على سلامة نبر كلمة elipsis على مقطع -lip- وإخراج حرف ll في embellece بصوت فصيح دون ابتذال."
        )
    ]
    return lesson_doc(doc, exs, "C1")
