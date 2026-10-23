# -*- coding: utf-8 -*-
"""
build_thematic_c1_advanced.py — حزمة المفردات المتقدمة والأكاديمية والبلاغية (C1 / B2)
"""
import sys
import os

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from builder_engine import (
    make_noun, make_verb, make_adj, make_adv, make_expr,
    emit_bundle, get_existing_norms, norm_vocab
)

# Lists of structured items
# Format for nouns: (head, "noun", gender, level, msa, eg, ex_es, ex_ar, domain)
# Format for verbs: (head, "verb", paradigm, level, msa, eg, ex_es, ex_ar, domain)
# Format for adj:   (head, "adj", level, msa, eg, ex_es, ex_ar, domain)
# Format for adv:   (head, "adv", level, msa, eg, ex_es, ex_ar, domain)
# Format for expr:  (head, "expr", level, msa, eg, ex_es, ex_ar, domain)

C1_ITEMS = [
    # --- Advanced Academic & Philosophical Nouns ---
    ("axioma", "noun", "m", "C1", "بديهية لا تحتاج برهاناً", "حقيقة بديهية مسلم بيها", "Aceptamos como axioma la igualdad de todos los seres humanos.", "نقبل بديهية المساواة بين جميع البشر.", "study"),
    ("premisa", "noun", "f", "C1", "مقدمة منطقية / فرضية", "مقدمة منطقية", "La conclusión deriva lógicamente de la primera premisa.", "تنبثق النتيجة منطقياً من المقدمة الأولى.", "study"),
    ("corolario", "noun", "m", "C1", "نتيجة ملازمة / استنتاج مباشر", "نتيجة مباشرة", "Este hallazgo es un corolario natural de la teoría previa.", "يُعدّ هذا الاكتشاف نتيجة ملازمة طبيعية للنظرية السابقة.", "study"),
    ("silogismo", "noun", "m", "C1", "قياس منطقي", "قياس منطقي", "Construyó un silogismo impecable para defender su tesis.", "بنى قياساً منطقياً محكماً للدفاع عن أطروحته.", "study"),
    ("paradoja", "noun", "f", "B2", "مفارقة ظاهرية / تناقض ظاهري", "مفارقة غريبة", "Resulta una paradoja que en la era de la información abunde la desinformación.", "إنها لمفارقة ظاهرية أن تكثر المغالطات في عصر تدفق المعلومات.", "study"),
    ("aporía", "noun", "f", "C1", "معضلة فكرية مستعصية", "طريق مسدود في التفكير", "El debate desembocó en una aporía filosófica insoluble.", "انتهى النقاش إلى معضلة فكرية مستعصية على الحل.", "study"),
    ("antinomia", "noun", "f", "C1", "تناقض بين قاعدتين أو مبدأين", "تناقض بين فكرتين", "Kant expuso la antinomia entre libertad y necesidad.", "عرض كانط التناقض القائم بين الحرية والحتمية.", "study"),
    ("falacia", "noun", "f", "B2", "مغالطة منطقية", "مغالطة وتضليل", "Su argumentación incurre en una evidente falacia de generalización.", "يقع استدلاله في مغالطة تعميم واضحة.", "study"),
    ("sofisma", "noun", "m", "C1", "مغالطة سفسطائية مضللة", "كلام معسول بس مضلل", "Rechazó el sofisma con argumentos documentados.", "دحض المغالطة السفسطائية بحجج موثقة بالأدلة.", "study"),
    ("dialéctica", "noun", "f", "C1", "جدلية فكرية / علم الجدل", "ديالكتيك وجدلية", "La dialéctica histórica explica la evolución de las sociedades.", "تفسر الجدلية التاريخية تطور المجتمعات البشرية.", "study"),
    ("retórica", "noun", "f", "B2", "علم البلاغة والبيان", "فن الكلام والبلاغة", "Dominaba la retórica clásica con admirable maestría.", "أتقن علم البلاغة الكلاسيكي ببراعة لافتة.", "study"),
    ("hermenéutica", "noun", "f", "C1", "علم التأويل وتفسير النصوص", "علم التفسير والتأويل", "La hermenéutica jurídica permite interpretar leyes antiguas.", "يُتيح علم التأويل القانوني تفسير النصوص التشريعية القديمة.", "study"),
    ("epistemología", "noun", "f", "C1", "نظرية المعرفة (إبستمولوجيا)", "فلسفة المعرفة", "La epistemología cuestiona los fundamentos del saber científico.", "تبحث نظرية المعرفة في أسس المعرفة العلمية ويقينها.", "study"),
    ("ontología", "noun", "f", "C1", "علم الوجود (أنطولوجيا)", "علم الوجود والماهية", "La ontología estudia la naturaleza del ser y de la realidad.", "يبحث علم الوجود في ماهية الكينونة والواقع الموضوعي.", "study"),
    ("deontología", "noun", "f", "C1", "أخلاقيات المهنة وآدابها", "ميثاق الشرف المهني", "El médico respetó escrupulosamente la deontología profesional.", "احترم الطبيب أخلاقيات المهنة بدقة متناهية.", "study"),
    ("teleología", "noun", "f", "C1", "علم الغائيات والعلل الغائية", "فلسفة الغاية والهدف", "Aristóteles aplicó la teleología a la explicación de la naturaleza.", "طبّق أرسطو علم الغائيات في تفسير ظواهر الطبيعة.", "study"),
    ("heurística", "noun", "f", "C1", "منهجية الاستكشاف والابتكار", "طرق حل المشكلات الذكية", "La heurística permite resolver problemas complejos con reglas prácticas.", "تُتيح منهجية الاستكشاف حل المعضلات المعقدة بقواعد عملية.", "study"),
    ("eclecticismo", "noun", "m", "C1", "انتقائية فكرية وفنية", "الجمع بين مدارس مختلفة", "Su obra se distingue por un fértil eclecticismo estilístico.", "يتميز عمله بانتقائية أسلوبية خصبة تجمع أطيافاً متباينة.", "study"),
    ("nihilismo", "noun", "m", "C1", "عدمية فلسفية", "العدمية", "El nihilismo rechaza todo valor o creencia trascendente.", "ترفض العدمية الفلسفية أي قيمة أو إيمان بغاية عليا.", "study"),
    ("solipsismo", "noun", "m", "C1", "الأنانية المطلقة / حصر الوجود في الذات", "إن مفيش غير الذات في الوجود", "El solipsismo extremo sostiene que solo existe la propia mente.", "يرى مذهب حصر الوجود في الذات أن العقل الفردي هو الحقيقة الوحيدة.", "study"),
    ("catarsis", "noun", "f", "C1", "تطهير نفسي وشعوري (كاثارسيس)", "تطهير الوجدان والمشاعر", "El drama provocó una profunda catarsis en los espectadores.", "أحدثت المسرحية تطهيراً نفسياً عميقاً في وجدان المشاهدين.", "arts"),
    ("némesis", "noun", "f", "C1", "العدو اللدود / العقاب الحتمي", "الند والعدو اللدود", "El detective se enfrentó por fin a su némesis.", "واجه المحقق أخيراً عدوه اللدود وخصمه التقليدي.", "arts"),
    ("serendipia", "noun", "f", "C1", "اكتشاف غير متوقع وموفق (سرنديب)", "اكتشاف صدفة وحظ سعيد", "La penicilina se descubrió por una afortunada serendipia.", "تم اكتشاف البنسلين عبر مصادفة حسنة واكتشاف غير متوقع.", "science"),
    ("anomia", "noun", "f", "C1", "فوضى اجتماعية / غياب القواعد", "غياب القانون والنظام في المجتمع", "El colapso de las instituciones generó anomia social.", "أدى انهيار المؤسسات إلى حالة من الفوضى الاجتماعية وتفكك القواعد.", "society"),
    ("ostracismo", "noun", "m", "C1", "نبذ وعزل اجتماعي", "عزل وتهميش ونفي", "Sufrió el ostracismo político tras discrepar con la cúpula.", "تعرض للنفي والعزل الاجتماعي والسياسي بعد معارضته للقيادة.", "society"),
    ("panacea", "noun", "f", "B2", "علاج شامل لكل داء / حل سحري", "حل سحري لكل المشاكل", "La tecnología no es una panacea para todos los males.", "ليست التكنولوجيا حلاً سحرياً وعلاجاً شاملاً لكل المشكلات.", "science"),
    ("entelequia", "noun", "f", "C1", "حلم مثالي لا واقع له", "وهم أو شيء في الخيال بس", "La sociedad perfecta sin conflictos es una pura entelequia.", "المجتمع المثالي الخالي من الصراعات هو مجرد حلم مثالي لا واقع له.", "study"),
    ("quimera", "noun", "f", "C1", "وهم مستحيل التحقق", "وهم مستحيل وسراب", "Perseguir la inmortalidad física es una quimera.", "إن السعي وراء الخلود الجسدي وهم مستحيل وسراب.", "study"),
    ("paradigma", "noun", "m", "B2", "نموذج فكري مهيمن", "نموذج فكري أو إطار عام", "La teoría cuántica introdujo un nuevo paradigma científico.", "أدخلت نظرية الكم نموذجاً فكرياً وإطاراً علمياً جديداً.", "science"),
    ("metonimia", "noun", "f", "C1", "كناية مجازية / مجاز مرسل", "كناية أو مجاز", "La metonimia enriquece el lenguaje literario.", "تُثري الكناية والمجاز المرسل اللغة الأدبية والبيانية.", "study"),
    ("oxímoron", "noun", "m", "C1", "طباق الجمع بين الضدين (تناقض ظاهري)", "الجمع بين كلمتين متناقضتين", "«Silencio elocuente» es un célebre oxímoron poético.", "«الصمت الناطق» هو جمع بليغ بين الضدين في الشعر.", "study"),
    ("metáfora", "noun", "f", "B1", "استعارة بلاغية", "استعارة وتشبيه", "Utilizó una hermosa metáfora sobre la primavera de la vida.", "استخدم استعارة بلاغية بديعة عن ربيع الحياة.", "arts"),
    ("alegoría", "noun", "f", "B2", "تمثيل رمزي مجازي", "قصة رمزية", "La novela es una profunda alegoría sobre el poder.", "تُعتبر الرواية تمثيلاً رمزياً مجازياً عميقاً حول السلطة.", "arts"),
    ("hipérbole", "noun", "f", "B2", "مبالغة بيانية", "مبالغة وتضخيم", "El autor recurre a la hipérbole para enfatizar el dolor.", "يلجأ المؤلف إلى المبالغة البيانية لتأكيد مشاعر الألم.", "arts"),
    ("eufemismo", "noun", "m", "B2", "تعبير تلطيفي مهذب", "تلطيف الكلام", "Usa el eufemismo «desaceleración» en vez de «crisis».", "يستخدم التعبير التلطيفي «تباطؤ» بدلاً من كلمة «أزمة».", "study"),
    ("circunloquio", "noun", "m", "C1", "مواربة ودوران في الكلام", "لف ودوران بالكلام", "Evitó la respuesta directa recurriendo a un largo circunloquio.", "تجنب الإجابة المباشرة باللجوء إلى دوران ومواربة طويلة في الكلام.", "study"),
    ("laconismo", "noun", "m", "C1", "إيجاز شديد في التعبير", "كلام قليل وموجز جداً", "Respondió con un laconismo propio de su carácter reservado.", "أجاب بإيجاز شديد يعكس طبعه الكتوم والموجز.", "study"),
    ("elocuencia", "noun", "f", "B2", "فصاحة وبيان آسر", "فصاحة ولباقة", "Cautivó a la multitud gracias a su desbordante elocuencia.", "أسر الجماهير بفضل فصاحته وبيانه الآسر.", "arts"),
    ("diatriba", "noun", "f", "C1", "هجوم كلامي لاذع", "هجوم حاد وشتيمة", "Publicó una feroz diatriba contra la política gubernamental.", "نشر هجوماً كلامياً لاذعاً وعنيفاً ضد السياسة الحكومية.", "study"),
    ("panegírico", "noun", "m", "C1", "مديح وإشادة حماسية", "مدح وتبجيل عالي", "Pronunció un sincero panegírico en honor del fundador.", "ألقى مديحاً صادقاً وإشادة حماسية تكريماً للمؤسس.", "arts"),
    ("apología", "noun", "f", "B2", "دفاع وتبرير فكري", "دفاع وتأييد علني", "El ensayo constituye una lúcida apología de la libertad.", "تُعد المقالة دفاعاً فكرياً مستنيراً عن قيمة الحرية.", "study"),
    ("epítome", "noun", "m", "C1", "خلاصة مكثفة / نموذج مصغر", "خلاصة مركزة ونموذج", "Su carrera representa el epítome de la constancia académica.", "تمثل مسيرته نموذجاً مكثفاً وخلاصة للاجتهاد الأكاديمي.", "study"),
    ("compendio", "noun", "m", "B2", "موجز شامل / مختصر وافٍ", "ملخص وافي وكتاب جامع", "El libro ofrece un compendio de las leyes ambientales.", "يقدم الكتاب موجزاً شاملاً ومختصراً وافياً للقوانين البيئية.", "study"),
    ("sinopsis", "noun", "f", "B1", "ملخص عام للمحتوى", "ملخص أو نبذة سريعة", "Lee la sinopsis antes de elegir la película de la noche.", "اقرأ الملخص العام للمحتوى قبل اختيار فيلم السهرة.", "arts"),
    ("preámbulo", "noun", "m", "B2", "ديباجة / مقدمة تمهيدية", "ديباجة ومقدمة", "El preámbulo de la constitución consagra los derechos humanos.", "تُكرّس ديباجة الدستور صون حقوق الإنسان وحرياته.", "society"),
    ("epílogo", "noun", "m", "B1", "خاتمة العمل الأدبي", "خاتمة الرواية أو الكتاب", "El epílogo desvela el misterio planteado al inicio.", "تكشف خاتمة العمل الأدبي الغموض الذي طُرح في البداية.", "arts"),
    ("exégesis", "noun", "f", "C1", "تفسير وتحليل نقدي للنص", "تفسير نقدي للنصوص", "Realizó una rigurosa exégesis del manuscrito medieval.", "أجرى تفسيراً وتحليلاً نقدياً دقيقاً للمخطوطة العائدة للقرون الوسطى.", "study"),
    ("idiosincrasia", "noun", "f", "B2", "سمات شخصية ومزاج قومي مميز", "طباع وهوية مميزة", "Para comprender el país hay que conocer su idiosincrasia.", "لفهم البلاد فهماً حقيقياً، ينبغي استيعاب سمات شعبها ومزاجه القومي.", "society"),
    ("lucidez", "noun", "f", "B2", "صفاء ذهني وبصيرة نافذة", "حضور ذهن وبصيرة", "Analizó el problema con asombrosa lucidez intelectual.", "حلل المعضلة بصفاء ذهني مدهش وبصيرة فكرية نافذة.", "study"),
    ("perspicacia", "noun", "f", "B2", "فراسة ودقة ملاحظة", "نباهة وذكاء لماح", "Su aguda perspicacia le permitió descubrir la trampa oculta.", "مكّنته فراسته ودقة ملاحظته من كشف الفخ المستتر.", "study"),
    ("sagacidad", "noun", "f", "C1", "دهاء وفطنة عملية", "دهاء وفطانة وحيلة", "Negoció con extraordinaria sagacidad comercial.", "تفاوض بدهاء وفطنة عملية استثنائية في المعاملة التجارية.", "study"),
    ("agudeza", "noun", "f", "B2", "حدة الذهن ونفاذ البصيرة", "ذكاء حاد وسرعة بديهة", "Respondió a la crítica con fina agudeza e ingenio.", "رد على الانتقاد بحدة ذهن ونفاذ بصيرة وذكاء راقٍ.", "study"),
    ("mordacidad", "noun", "f", "C1", "سخرية لاذعة وقاطعة", "تريقة لاذعة وحامية", "Sus artículos destacan por una mordacidad implacable.", "تتميز مقالاته بسخرية لاذعة وقاطعة لا ترحم.", "arts"),
    ("ecuanimidad", "noun", "f", "C1", "اتزان نفسي وإنصاف", "هدوء نفس وعدل", "Aceptó tanto el elogio como la crítica con ecuanimidad.", "تقبل كلاً من المدح والنقد باتزان نفسي وإنصاف تام.", "study"),
    ("magnanimidad", "noun", "f", "C1", "عظمة النفس وسماحتها", "نبل وكرم أخلاق عالي", "Tuvo la magnanimidad de perdonar a su ofensor.", "تحلى بعظمة النفس وسماحتها فعفا عمن أساء إليه.", "social"),
    ("abnegación", "noun", "f", "C1", "إنكار الذات والتفاني المطلق", "تضحية وإنكار ذات", "Trabajó con ejemplar abnegación para ayudar a los heridos.", "عمل بتفانٍ مطلق وإنكار ذات نموذجي لمساعدة الجرحى.", "social"),
    ("resiliencia", "noun", "f", "B2", "مرونة نفسية وقدرة على التعافي", "صمود ومرونة وقت الأزمات", "Demostró una admirable resiliencia ante la adversidad.", "أظهر مرونة نفسية وقدرة باهرة على الصمود أمام الشدائد.", "health"),
    ("vehemencia", "noun", "f", "C1", "حدة الحماس واندفاعه", "حماس زايد واندفاع", "Defendió su postura con vehemencia apasionada.", "دافع عن موقفه بحدة حماس واندفاع جارف.", "social"),
    ("pusilanimidad", "noun", "f", "C1", "جبن وخور عزيمة", "جبن وتردد وضعف قلب", "La pusilanimidad le impidió asumir el liderazgo del proyecto.", "منعه جبنه وخور عزيمته من تولي قيادة المشروع.", "social"),
    ("ignominia", "noun", "f", "C1", "خزي وعار فادح", "فضيحة وعار كبير", "Aquel tratado desigual fue recordado como una ignominia nacional.", "ظلت تلك المعاهدة الجائرة تُذكر بوصفها خزياً وعاراً فادحاً على الأمة.", "society"),
    ("oprobio", "noun", "m", "C1", "إهانة علنية وشنار", "خزي ومذلة للكل", "Sus actos deshonestos le acarrearon el oprobio general.", "جلبت عليه تصرفاته الملتوية الخزي والشنار أمام المجتمع.", "society"),
    ("vicisitud", "noun", "f", "C1", "تقلبات الدهر ونوازله", "تقلبات وصروف الزمن", "Superaron juntos cada vicisitud a lo largo de los años.", "تجاوزا معاً كل تقلبات الدهر ونوازله على مر السنين.", "social"),
    ("disyuntiva", "noun", "f", "B2", "مفترق طرق وخيار حاسم", "حيرة بين خيارين صعبين", "Se enfrentó a la difícil disyuntiva de partir o quedarse.", "واجه مفترق طرق وخياراً حاسماً بين الرحيل أو البقاء.", "study"),
    ("encrucijada", "noun", "f", "B2", "مفترق طرق مصيري", "مفترق طرق حاسم", "La economía mundial se halla en una encrucijada decisiva.", "يقف الاقتصاد العالمي عند مفترق طرق مصيري وحاسم.", "society"),

    # --- Advanced C1 Verbs of Intellect, Rhetoric & Analysis ---
    ("argüir", "verb", "ir", "C1", "احتجّ بحجة / برهن منطقياً", "حجّ بحجة وبرهن", "El abogado decidió argüir que no existía prueba material.", "قرر المحامي الاحتجاج بعدم وجود دليل مادي ملموس.", "study"),
    ("colegir", "verb", "ir", "C1", "استنتج بالاستدلال المنطقي", "استنتج وفهم من الكلام", "De sus palabras podemos colegir una clara intención de pactar.", "من كلماته نستطيع استنتاج رغبة واضحة في التوصل إلى تسوية.", "study"),
    ("conjeturar", "verb", "ar", "C1", "خمّن وظنّ استناداً لقرائن", "خمّن وخمن بالظن", "Es arriesgado conjeturar sobre el desenlace sin datos firmes.", "من المجازفة التخمين بشأن النهاية دون بيانات قاطعة.", "study"),
    ("contrastar", "verb", "ar", "B2", "قارن لملاحظة الفروق", "قارن وشاف الفرق", "Debemos contrastar las dos fuentes antes de dar por buena la noticia.", "يجب علينا مضاهاة المصدرين ومقارنتهما قبل اعتماد صحة الخبر.", "study"),
    ("deliberar", "verb", "ar", "B2", "تداول وتشاور بعمق", "تشاور وفكر كويس", "El comité se reunió para deliberar sobre las candidaturas.", "اجتمعت اللجنة للتداول والتشاور بعمق حول ملفات الترشح.", "society"),
    ("desentrañar", "verb", "ar", "C1", "فكك الغموض واستجلى الحقيقة", "حل اللغز وفك الطلاسم", "El científico logró desentrañar el mecanismo genético del virus.", "تمكن العالم من فك غموض الآلية الجينية للفيروس واستجلائها.", "science"),
    ("dilucidar", "verb", "ar", "C1", "أوضح وجلّى المسألة الغامضة", "وضّح وفصّل الغامض", "La investigación servirá para dilucidar los motivos del suceso.", "سيسهم التحقيق في إيضاح وتجلية دوافع الحادث الغامض.", "study"),
    ("discernir", "verb", "ir", "B2", "ميّز بين الأمور ببصيرة", "ميّز وفصل بين الصح والغلط", "Hay que saber discernir entre lo urgente y lo verdaderamente importante.", "ينبغي التمييز ببصيرة نافذة بين ما هو عاجل وما هو جوهري بحق.", "study"),
    ("disertar", "verb", "ar", "C1", "ألقى محاضرة علمية معمقة", "حاضر وتكلم بعمق", "El profesor va a disertar sobre la poesía renacentista.", "سيلقي الأستاذ محاضرة علمية معمقة حول شعر عصر النهضة.", "arts"),
    ("elucidar", "verb", "ar", "C1", "شرح وفسر مسألة معقدة", "شرح وفكك المسألة", "Su ensayo ayuda a elucidar conceptos filosóficos complejos.", "تساعد مقالته في شرح وتفسير مفاهيم فلسفية معقدة.", "study"),
    ("elucubrar", "verb", "ar", "C1", "تأمل ونسج فرضيات فكرية", "قعد يتخيل ويألف نظريات", "No conviene elucubrar sin fundamentos empíricos sólidos.", "لا يجدر نسج فرضيات وتأملات فكرية دون أسس تجريبية راسخة.", "study"),
    ("escudriñar", "verb", "ar", "C1", "تفحص واستقصى بدقة متناهية", "بحلق وفحص كويس أوي", "El inspector se detuvo a escudriñar cada rincón de la estancia.", "توقف المفتش ليتفحص كل زاوية في الغرفة بدقة متناهية.", "study"),
    ("esgrimir", "verb", "ir", "C1", "شهر حجة أو دليلاً كالسلاح", "استخدم حجة قوية دفاعاً", "El portavoz supo esgrimir datos sólidos en su defensa.", "استطاع المتحدث إشهار حجج وبيانات متينة في الدفاع عن موقفه.", "society"),
    ("extrapolar", "verb", "ar", "C1", "عمم النتائج على سياق آخر", "عمم التجربة على مجال تاني", "No es prudente extrapolar estos resultados a la población general.", "ليس من الحكمة تعميم هذه النتائج واستقراؤها على عموم السكان.", "science"),
    ("inferir", "verb", "ir", "B2", "استنبط واستدل منطقياً", "استنتج واستنبط بالعقل", "De los experimentos podemos inferir una correlación causal directa.", "من التجارب نستطيع استنباط علاقة سببية مباشرة بين الظاهرتين.", "science"),
    ("postular", "verb", "ar", "C1", "افترض مبدأ أساسياً / رشح نظرية", "حط فرضية وقدم نظرية", "El físico se atrevió a postular la existencia de una nueva partícula.", "تجرأ الفيزيائي على افتراض وترشيح وجود جسيم أولي جديد.", "science"),
    ("preconizar", "verb", "ar", "C1", "أشاد بمبدأ ونادى به", "بشر بفكرة ودافع عنها", "Los expertos suelen preconizar el diálogo constructivo como vía de solución.", "دأب الخبراء على الإشادة بالحوار البناء والمناداة به سبيلاً للحل.", "society"),
    ("problematizar", "verb", "ar", "C1", "طرح المسألة كإشكالية نقدية", "شغّل مخه وطرح الموضوع كأزمة", "El seminario busca problematizar las certezas asumidas por la sociedad.", "يهدف الملتقى إلى طرح المسلمات المجتمعية كإشكالية نقدية للبحث.", "study"),
    ("propugnar", "verb", "ar", "C1", "دافع عن مذهب أو قضية بحماس", "دافع وناصر القضية", "Su organización decide propugnar los derechos de la infancia.", "قررت منظمته الدفاع بحماس عن حقوق الطفولة ومناصرتها.", "society"),
    ("rebatir", "verb", "ir", "B2", "دحض وفند الحجة بالدليل", "رد على الحجة وفندها", "El ponente logró rebatir todas las objeciones con elegancia.", "تمكن المحاضر من دحض وتفنيد جميع الاعتراضات برقي واقتدار.", "study"),
    ("refutar", "verb", "ar", "B2", "أبطل ونقض برهان الخصم", "نقض وفند كلام التاني", "Logró refutar la hipótesis con datos experimentales incontrovertibles.", "استطاع نقض الفرضية وإبطالها ببيانات تجريبية قاطعة.", "science"),
    ("sintetizar", "verb", "ar", "B2", "لخص وكثف الأفكار الجوهرية", "لخص الفكرة في نقاط", "El autor supo sintetizar siglos de historia en trescientas páginas.", "أجاد المؤلف تلخيص قرون من التاريخ وتكثيفها في ثلاثمائة صفحة.", "study"),
    ("sopesar", "verb", "ar", "B2", "وازن بين الاحتمالات والخيارات", "وزن الأمور وقارن", "Debemos sopesar los pros y los contras antes de tomar la decisión.", "يجب علينا موازنة الإيجابيات والسلبيات قبل اتخاذ القرار النهائي.", "study"),
    ("soslayar", "verb", "ar", "C1", "تجاهل بذكاء / تحاشى التطرق", "تفادى الموضوع وما جابش سيرته", "El informe intenta soslayar la cuestión espinosa del presupuesto.", "يحاول التقرير تفادي المسألة الشائكة الخاصة بالميزانية وتجاهلها بذكاء.", "study"),
    ("tergiversar", "verb", "ar", "C1", "حرّف الكلام وزيّفه عمداً", "لوى الكلام وحرفه قصد", "No debes tergiversar mis palabras para defender tu punto de vista.", "لا ينبغي لك تحريف كلامي وتزييفه عمداً لتبرير وجهة نظرك.", "social"),
    ("vindicar", "verb", "ar", "C1", "رد الاعتبار / ناصر حقاً مسلوباً", "رد الاعتبار وأخذ الحق", "La biografía logra vindicar la memoria del científico olvidado.", "نجحت السيرة في رد الاعتبار لذكرى العالم الذي طواه النسيان.", "arts"),
    ("vislumbrar", "verb", "ar", "B2", "استشف لمحاً / لمس بدايات الشيء", "لمح من بعيد وحس بيه", "A través de la niebla pudieron vislumbrar la silueta del faro.", "استطاعوا من وراء الضباب استشفاف ملامح المنارة ورؤية طيفها.", "nature"),

    # --- Sophisticated C1 Adjectives ---
    ("abstruso", "adj", "C1", "غامض ومستغلق على الفهم", "معقد وصعب يتفهم", "El tratado contiene un lenguaje abstruso y denso.", "يشتمل البحث على لغة مستغلقة على الفهم وبالغة التعقيد.", "study"),
    ("acérrimo", "adj", "C1", "شديد الحماس / خصم لدود", "مخلص جداً أو عدو لدود", "Es un acérrimo defensor de la educación pública.", "إنه مدافع شديد الحماس والصلابة عن التعليم المجاني العام.", "social"),
    ("anodino", "adj", "C1", "باهت لا طعم له ولا أثر", "عادي جداً وما لوش لازمة", "Pronunció un discurso anodino que no aportó novedad.", "ألقى خطاباً باهتاً لا طعم له ولم يأتِ بأي جديد يذكر.", "arts"),
    ("antitético", "adj", "C1", "نقيض ومضاد تماماً في المعنى", "متناقض وعكس بعض تماماً", "Defienden visiones antitéticas sobre el desarrollo económico.", "يتبنيان رؤيتين نقيضتين تماماً حول آفاق التنمية الاقتصادية.", "study"),
    ("axiomático", "adj", "C1", "بديهي مسلّم به بلا برهان", "بديهي ولا خلاف عليه", "Se considera un principio axiomático en este campo.", "يُعتبر مبدأ بديهياً مسلماً به في هذا الحقل المعرفي.", "study"),
    ("categórico", "adj", "B2", "جزمي قاطع لا يحتمل شكاً", "قاطع وحاسم وما فيش نقاش", "Emitió un rechazo categórico a las presiones externas.", "أصدر رفضاً جزمياً وقاطعاً للضغوط والتدخلات الخارجية.", "social"),
    ("concomitante", "adj", "C1", "ملازم ومصاحب للحدث", "ملازم ومصاحب للموضوع", "El dolor agudo vino con otros síntomas concomitantes.", "رافق الألم الحاد ظهور أعراض أخرى مصاحبة وملازمة له.", "health"),
    ("conspicuo", "adj", "C1", "بارز مرموق وذائع الصيت", "واضح ومرموق ومعروف", "Fue un miembro conspicuo de la academia de ciencias.", "كان عضواً بارزاً ومرموقاً في المجمع العلمي للعلوم.", "study"),
    ("críptico", "adj", "C1", "مبهم مشفر كالألغاز", "مشفر ومبهم كأنه لغز", "Dejó un mensaje críptico antes de desaparecer sin rastro.", "ترك رسالة مبهمة ومشفرة كالألغاز قبل أن يختفي بلا أثر.", "arts"),
    ("deletéreo", "adj", "C1", "سام ومهلك للصحة والبيئة", "سام ومهلك ومضر جداً", "Las emisiones fabriles ejercen un efecto deletéreo sobre el bosque.", "تمارس الانبعاثات الصناعية تأثيراً ساماً ومهلكاً على بيئة الغابة.", "nature"),
    ("deontológico", "adj", "C1", "أخلاقي مهني ومرتبط بالواجب", "أخلاقي خاص بميثاق الشرف", "Vulneró el código deontológico del periodismo de investigación.", "انتهك ميثاق الشرف والأخلاق المهنية لصحافة التحقيقات.", "society"),
    ("diacrónico", "adj", "C1", "تطوري عبر تتابع الزمان", "تاريخي على مر الزمن", "Hizo un estudio diacrónico de la lengua castellana.", "أجرى دراسة تطورية عبر تتابع الزمان للغة القشتالية.", "study"),
    ("dogmático", "adj", "B2", "عقائدي متعصب لآرائه", "متحجر ومتمسك برأيه عمياني", "Mantiene una postura dogmática que impide el diálogo constructivo.", "يتمسك بموقف عقائدي جامد يقطع الطريق أمام كل حوار بناء.", "social"),
    ("dúctil", "adj", "C1", "مرن قابل للتشكيل والتكيف", "مرن ولين وسهل التشكيل", "El oro es un metal sumamente dúctil y maleable.", "الذهب معدن مرن ولين للغاية وقابل للتشكيل بالسحب والطرق.", "science"),
    ("ecuánime", "adj", "C1", "منصف عادل متجرد من الهوى", "محايد وعادل من غير انحياز", "El tribunal emitió una resolución ecuánime e irreprochable.", "أصدرت المحكمة حكماً منصفاً ومتجرداً من الهوى لا شائبة فيه.", "society"),
    ("efímero", "adj", "B2", "عابر زائل لا يدوم طويلاً", "قصير ومؤقت وزائل بسرعة", "La gloria mundana suele ser un fenómeno efímero.", "غالباً ما يكون المجد الدنيوي ظاهرة عابرة وسريعة الزوال.", "arts"),
    ("elocuente", "adj", "B2", "بليغ ومفصح عن المعنى بوضوح", "فصيح ومعبّر جداً", "El silencio de la sala fue un testimonio elocuente del asombro.", "كان الصمت الذي لف القاعة شهادة بليغة ومفصحة عن الذهول.", "arts"),
    ("empírico", "adj", "B2", "تجريبي مستمد من الواقع والخبرة", "قائم على التجربة العملية", "Apoyó su hipótesis en abundantes datos empíricos contrastados.", "أسند فرضيته إلى بيانات تجريبية مستمدة من الواقع ووفيرة.", "science"),
    ("epistemológico", "adj", "C1", "معرفي متعلق بنظرية العلم", "متعلق بنظرية المعرفة", "El debate epistemológico enriqueció los métodos de estudio.", "أثرى النقاش المعرفي المناهج المتبعة في دراسة العلوم الإنسانية.", "study"),
    ("esotérico", "adj", "C1", "باطني خاص بالنخبة العارفة", "باطني ومخصوص للخاصة", "El texto contiene doctrinas de carácter marcadamente esotérico.", "يشتمل النص على تعاليم ذات طابع باطني مقصور على النخبة.", "arts"),
    ("fáctico", "adj", "C1", "واقعي مستند إلى الوقائع الملموسة", "واقعي قائم على الوقائع", "Se limitó a describir los hechos fácticos comprobados.", "اقتصر على وصف الوقائع الملموسة والمثبتة بالأدلة القاطعة.", "study"),
    ("farragoso", "adj", "C1", "مشوش مربك لكثرة حشوه", "مليان حشو وملخبط وصعب", "El manual resultó farragoso y difícil de seguir para los novatos.", "بدا الدليل مشوشاً ومربكاً لكثرة حشوه وصعب المتابعة للمبتدئين.", "study"),
    ("fidedigno", "adj", "C1", "موثوق وصادق لا شك فيه", "موثوق فيه ومية مية", "Obtuvimos los datos de un testimonio fidedigno e intachable.", "حصلنا على البيانات من شاهد موثوق وصادق لا يرقى إليه الشك.", "study"),
    ("heurístico", "adj", "C1", "استكشافي يساعد على الابتكار", "استكشافي وابتكاري", "El algoritmo heurístico resolvió el enigma en pocos segundos.", "تمكنت الخوارزمية الاستكشافية من حل المعضلة في ثوانٍ معدودة.", "science"),
    ("holístico", "adj", "C1", "شامل كلي ينظر للمنظومة برمتها", "نظرة شاملة لكل الجوانب", "La medicina moderna aboga por un enfoque holístico de la salud.", "يدعو الطب الحديث إلى تبني مقاربة شاملة وكلية لرعاية الصحة.", "health"),
    ("impertérrito", "adj", "C1", "رابط الجأش لا يتزعزع", "هادي ومش متأثر خالص", "Permaneció impertérrito ante las amenazas de los adversarios.", "ظل رابط الجأش لا يتزعزع أمام تهديدات الخصوم ووعيدهم.", "social"),
    ("incisivo", "adj", "B2", "نافذ ثاقب يصيب كبد الحقيقة", "ثاقب ولاذع في الصميم", "Hizo una pregunta incisiva que descolocó al entrevistado.", "طرح سؤالاً نافذاً وثاقباً أصاب كبد الحقيقة وأربك الضيف.", "arts"),
    ("inexorable", "adj", "C1", "حتمي لا مفر منه ولا يلين", "حتمي ومفيش منه مفر", "El paso inexorable del tiempo no perdona a nadie.", "إن مضي الزمان الحتمي الذي لا يلين لا يستثني أحداً.", "nature"),
    ("intrínseco", "adj", "B2", "جوهري متأصل في الذات", "أصلي وجوهري في الشيء", "La dignidad es un valor intrínseco de cada persona humana.", "إن الكرامة قيمة جوهرية متأصلة في كل إنسان بذاته.", "social"),
    ("lacónico", "adj", "C1", "مقتضب موجز قليل الكلام", "موجز ومابيقولش كلام كتير", "Envió un mensaje lacónico confirmando su llegada sin más detalles.", "أرسل رسالة مقتضبة وموجزة تؤكد وصوله دون الخوض في تفاصيل.", "social"),
    ("locuaz", "adj", "C1", "ثرثار طلق اللسان كثير الحديث", "رغاي وكلامه كتير ولبق", "El guía turístico era un hombre simpático y muy locuaz.", "كان المرشد السياحي رجلاً لطيفاً وطلق اللسان كثير الحديث.", "social"),
    ("lúcido", "adj", "B2", "ثاقب الذهن فصيح التفكير", "مخه صاحي وفاهم كويس", "Mantuvo un pensamiento lúcido hasta el final de sus días.", "حافظ على تفكير ثاقب الذهن ووعي مستنير حتى آخر أيامه.", "health"),
    ("maleable", "adj", "C1", "طَيع سهل التشكيل والتأثير", "طري وسهل تشكيله والتأثير عليه", "La arcilla húmeda es sumamente maleable en manos del alfarero.", "الصلصال الرطب مادة طَيعة للغاية وسهلة التشكيل بيد الخزاف.", "arts"),
    ("mesurado", "adj", "B2", "رزين معتدل رصين في تصرفه", "عاقل وموزون في تصرفاته", "Adoptó un tono mesurado para calmar los ánimos encendidos.", "اعتمد نبرة رزينة ومعتدلة لتهدئة النفوس المنفعلة.", "social"),
    ("meticuloso", "adj", "B2", "شديد التدقيق بالغ العناية", "دقيق جداً وبيراجع كل فتفوتة", "El arqueólogo hizo un registro minucioso y meticuloso de las piezas.", "أجرى عالم الآثار توثيقاً شديد التدقيق وبالغ العناية للقطع.", "science"),
    ("mordaz", "adj", "C1", "لاذع قاطع في نقده", "سخريته حامية وقاطعة", "El crítico literario es temido por su pluma mordaz y despiadada.", "يُخشى جانب الناقد الأدبي لقلمه اللاذع والقاطع بلا هوادة.", "arts"),
    ("omnímodo", "adj", "C1", "شامل مطلق نافذ في كل شأن", "مطلق وشامل لكل حاجة", "El soberano ejercía un poder omnímodo sobre sus súbditos.", "مارس الحاكم سلطة مطلقة وشاملة نافذة في كل شؤون رعاياه.", "society"),
    ("ontológico", "adj", "C1", "وجودي يتعلق بماهية الكينونة", "وجودي خاص بأصل الوجود", "Planteó el problema de la identidad desde un ángulo ontológico.", "طرح مسألة الهوية انطلاقاً من زاوية وجودية تتعلق بماهية الكينونة.", "study"),
    ("paradigmático", "adj", "C1", "نموذجي يُحتذى به كمعيار", "نموذجي ومثالي للتقليد", "Este caso se considera paradigmático en la jurisprudencia moderna.", "تُعد هذه الواقعة نموذجية يُحتذى بها كمعيار في الفقه الحديث.", "study"),
    ("perentorio", "adj", "C1", "قاطع ملزم لا يحتمل تأجيلاً", "عاجل وحاسم ولازم حالاً", "Recibió una orden perentoria de presentarse de inmediato.", "تلقى أمراً قاطعاً وملزماً بالمثول فوراً دون أي إرجاء.", "society"),
    ("pernicioso", "adj", "B2", "ضار وخبيث العواقب", "مضر جداً وخبيث", "El consumo desmedido de tabaco tiene efectos perniciosos.", "ينجم عن التدخين المفرط عواقب ضارة وخبيثة على صحة البدن.", "health"),
    ("perspicaz", "adj", "B2", "نافذ البصيرة ذكي لماح", "لماح وعينه بتلقط بسرعة", "El detective perspicaz descubrió la inconsistencia del relato.", "اكتشف المحقق نافذ البصيرة والذكي اللماح التناقض في الرواية.", "social"),
    ("pertinaz", "adj", "C1", "عنيد ملح لا ينقطع", "عنيد ومستمر مابيبطلش", "La pertinaz sequía arruinó las cosechas de la comarca.", "أهلك الجفاف العنيد والمستمر دون انقطاع محاصيل المنطقة الزراعية.", "nature"),
    ("plausible", "adj", "B2", "معقول ومقبول عقلاً", "معقول ويتصدق منطقياً", "Ofreció una explicación plausible que convenció al jurado.", "قدّم تفسيراً معقولاً ومقبولاً عقلاً أقنع به هيئة المحلفين.", "study"),
    ("prolijo", "adj", "C1", "مستفيض مفصل بإسهاب", "كلام طويل ومفصل بتطويل", "El autor ofreció un relato prolijo de sus viajes por Oriente.", "سرد المؤلف رواية مستفيضة ومفصلة بإسهاب عن رحلاته إلى الشرق.", "arts"),
    ("sagaz", "adj", "C1", "داهية فطن فاحص الدقائق", "داهية وشاطر وذكي جداً", "El sagaz diplomático esquivó la trampa tendida por su rival.", "تخلص الدبلوماسي الداهية والفطن من الفخ الذي نصبه له غريمه.", "society"),
    ("sincrónico", "adj", "C1", "تزامني في لحظة زمنية محددة", "تزامني في نفس الوقت", "Hizo un análisis sincrónico del sistema fonológico actual.", "أجرى تحليلاً تزامنياً لمنظومة الأصوات في لحظتها الراهنة.", "study"),
    ("somero", "adj", "C1", "سطحي موجز لا يتعمق", "سطحي وسريع من غير غوص", "Basta una revisión somera para detectar las erratas más obvias.", "تكفي مراجعة سطحية وموجزة لرصد الأخطاء الطباعية الأكثر جلاءً.", "study"),
    ("sucinto", "adj", "C1", "موجز مكثف جامع المعاني", "مختصر ومفيد جداً", "Redactó un informe sucinto que resumía diez años de labores.", "حرر تقريراً موجزاً ومكثفاً لخص فيه حصيلة عشر سنوات من العمل.", "study"),
    ("taxativo", "adj", "C1", "حصري قاطع لا يحتمل الزيادة", "محدد وقاطع ومفيش غيره", "La ley enumera de modo taxativo los supuestos de excepción.", "يُعدد القانون على نحو حصري وقاطع الحالات الاستثنائية.", "society"),
    ("ubicuo", "adj", "C1", "حاضر في كل مكان في آن واحد", "موجود في كل حتة في نفس الوقت", "El teléfono inteligente se ha convertido en un objeto ubicuo.", "تحول الهاتف الذكي إلى أداة حاضرة في كل مكان في آن واحد.", "science"),
    ("utópico", "adj", "B2", "خيالي طوباوي منقطع عن الواقع", "مثالي وخيالي ومش واقعي", "Diseñar una ciudad sin contaminación parecía un plan utópico.", "بدا تخطيط مدينة خالية تماماً من التلوث مشروعاً خيالياً وطوباوياً.", "society"),
    ("verosímil", "adj", "B2", "شبيه بالحق قابل للتصديق", "ممكن يتصدق وشكله حقيقي", "Su coartada sonaba bastante verosímil para los agentes.", "بدت حجته حول مكان وجوده شبيهة بالحق وقابلة للتصديق لدى المحققين.", "study"),
    ("inverosímil", "adj", "B2", "غير معقول ومستبعد التصديق", "مش معقول وصعب يتصدق", "La excusa que presentó resultaba a todas luces inverosímil.", "كان العذر الذي قدمه غير معقول ومستبعد التصديق بكل وضوح.", "study"),

    # --- Academic Discourse Connectors & Expressions ---
    ("habida cuenta de", "expr", "C1", "بالنظر إلى / مع مراعاة", "علشان ونظراً لـ", "Habida cuenta de las circunstancias, decidieron posponer la firma.", "بالنظر إلى الظروف الراهنة ومع مراعاتها، قرروا تأجيل التوقيع.", "study"),
    ("en virtud de", "expr", "C1", "بمقتضى / استناداً إلى سلطة", "بموجب وبناءً على", "En virtud de las atribuciones concedidas, aprobó el reglamento.", "بمقتضى الصلاحيات الممنوحة له، صادق على اللائحة التنظيمية.", "society"),
    ("a tenor de", "expr", "C1", "طبقاً لما ورد في / على ضوء", "على حسب اللي جه في النص", "A tenor de lo acordado en la sesión, se redactó el acta final.", "طبقاً لما تم الاتفاق عليه في الجلسة، حُرِّر المحضر الختامي.", "study"),
    ("a fin de cuentas", "expr", "B2", "في نهاية المطاف / في المحصلة", "في الآخر وفي النهاية", "A fin de cuentas, lo que importa es el resultado pedagógico.", "في نهاية المطاف والمحصلة، ما يهم حقاً هو الأثر التربوي المتحقق.", "social"),
    ("por ende", "expr", "C1", "بناءً على ذلك ومن ثمّ", "وبالتالي ومن هنا", "No se alcanzaron los objetivos y, por ende, revisaremos la estrategia.", "لم تتحقق الأهداف المنشودة، ومن ثمّ سنعيد النظر في الخطة المعتمدة.", "study"),
    ("a priori", "expr", "C1", "قبلياً / انطلاقاً من المبادئ النظرية", "من الأول كده نظرياً", "No podemos descartar esa hipótesis a priori sin ensayarla.", "لا يجوز لنا استبعاد تلك الفرضية قبلياً دون إخضاعها للتجربة والتحقق.", "study"),
    ("a posteriori", "expr", "C1", "بعدياً / استناداً إلى التجربة الفعلية", "بعد التجربة والواقع", "Evaluaron los efectos de la reforma a posteriori con datos reales.", "قيّموا آثار الإصلاح تقييماً بعدياً استناداً إلى البيانات والواقع.", "study"),
    ("grosso modo", "expr", "C1", "بصورة تقريبية وعامة", "تقريباً وبشكل عام", "El presupuesto total asciende, grosso modo, a dos millones.", "يصل إجمالي الميزانية بصورة تقريبية وعامة إلى مليوني يورو.", "study"),
    ("de facto", "expr", "C1", "بحكم الواقع والأمر الواقع", "بالأمر الواقع وعلى الأرض", "Asumió el control del partido como líder de facto tras la crisis.", "تولى قيادة الحزب كزعيم بحكم الأمر الواقع بعد تفجر الأزمة.", "society"),
    ("de iure", "expr", "C1", "بحكم القانون والنص الشرعي", "بحكم القانون الرسمي", "Era el presidente de iure, aunque otro mandara en la sombra.", "كان الرئيس بحكم القانون والنص الرسمي، رغم أن غيره يدير الخفاء.", "society"),
    ("sine qua non", "expr", "C1", "شرط لا غنى عنه ولا قيام بدونه", "شرط أساسي ولا بد منه", "El respeto mutuo es condición sine qua non para la paz.", "إن الاحترام المتبادل شرط لا غنى عنه ولا قيام للسلام الدائم بدونه.", "social"),
    ("ipso facto", "expr", "C1", "على الفور وبحكم الفعل نفسه", "في ساعتها ومن غير كلام", "La infracción grave anula el contrato ipso facto.", "يؤدي ارتكاب المخالفة الجسيمة إلى فسخ العقد على الفور بحكم الواقع.", "society"),
    ("mutatis mutandis", "expr", "C1", "مع مراعاة الفوارق والتبديل الواجب", "مع تغيير اللي لازم يتغير", "La misma regla se aplica, mutatis mutandis, al sector bancario.", "تُطبق القاعدة نفسها، مع مراعاة الفوارق والتبديل الواجب، في المصارف.", "study"),
]

def main():
    existing = get_existing_norms(exclude_slugs={"cv-topic-c1-advanced"})
    entries = []
    skipped = 0

    for item in C1_ITEMS:
        head = item[0]
        norm = norm_vocab(head)
        if norm in existing:
            skipped += 1
            continue

        pos_type = item[1]

        if pos_type in ("noun", "verb"):
            level = item[3]
            msa = item[4]
            eg = item[5]
            ex_es = item[6]
            ex_ar = item[7]
            domain = item[8] if len(item) > 8 else "study"
            if pos_type == "noun":
                gender = item[2]
                entry = make_noun(head, gender, level, msa, eg, ex_es, ex_ar, domain=domain, rank=12)
            else:
                paradigm = item[2]
                entry = make_verb(head, paradigm, level, msa, eg, ex_es, ex_ar, domain=domain, rank=12)
        elif pos_type in ("adj", "adv", "expr", "phrase", "idiom"):
            level = item[2]
            msa = item[3]
            eg = item[4]
            ex_es = item[5]
            ex_ar = item[6]
            domain = item[7] if len(item) > 7 else "study"
            if pos_type == "adj":
                entry = make_adj(head, level, msa, eg, ex_es, ex_ar, domain=domain, rank=12)
            elif pos_type == "adv":
                entry = make_adv(head, level, msa, eg, ex_es, ex_ar, domain=domain, rank=12)
            else:
                entry = make_expr(head, "expression", level, msa, eg, ex_es, ex_ar, domain=domain, rank=12)
        else:
            continue

        entries.append(entry)
        existing.add(norm)

    print(f"C1 Advanced: Prepared {len(entries)} new entries (skipped {skipped} existing).")
    emit_bundle("vocab-cv-topic-c1-advanced.json", "cv-topic-c1-advanced", "المفردات المتقدمة والأكاديمية والبلاغية (C1)", entries)

if __name__ == "__main__":
    main()
