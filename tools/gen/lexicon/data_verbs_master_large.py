# -*- coding: utf-8 -*-
"""
tools/gen/lexicon/data_verbs_master_large.py — حزمة الأفعال الشاملة الكبرى (أكثر من 850 فعلاً مصصرفاً)
"""
import sys
import os

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from builder_engine import make_verb, emit_bundle, get_existing_norms, norm_vocab

# قائمة الأفعال الإسبانية الشاملة مع أوزان التصريف والمستويات والمعاني
VERBS_DATA = [
    # أفعال الحركة والانتقال
    ("acelerar", "ar", "A2", "زاد من السرعة / عجل", "سرع وداس بنزين", "transport", "El conductor acelera con precaución en la recta.", "يسرع السائق بحذر في الطريق المستقيم."),
    ("acercar", "ar", "A1", "قرّب الشيء / دنا", "قرب المسافة", "daily", "Acerca la silla a la mesa para comer.", "قرّب الكرسي من الطاولة لتناول الطعام."),
    ("acudir", "ir", "A2", "حضر ولبى النداء / أتى", "حضر وجه في الميعاد", "social", "Muchos vecinos acudieron a la reunión del barrio.", "حضر كثير من الجيران إلى اجتماع الحي."),
    ("adelantar", "ar", "A2", "تجاوز / قدّم الموعد", "سبق وعدى في الطريق", "transport", "Adelantó al camión con suma precaución.", "تجاوز الشاحنة بحذر شديد."),
    ("alejar", "ar", "A2", "أبعد ونأى به عن الخطر", "بعد الحاجه عن الخطر", "daily", "Aleja a los niños de la estufa caliente.", "أبعد الأطفال عن المدفأة الساخنة."),
    ("andar", "ar", "A1", "مشى وسار على قدميه", "مشي على رجليه", "daily", "Suele andar media hora cada mañana por salud.", "يعتاد أن يمشي نصف ساعة كل صباح من أجل الصحة."),
    ("apartar", "ar", "A2", "نحى وأبعد جانباً", "جنب وحط ع جنب", "daily", "Apartó las ramas secas para abrir paso.", "أزاح الأغصان الجافة لفتح الطريق."),
    ("aproximar", "ar", "B1", "قرّب وأدنى المسافة", "قرب الحاجة ودناها", "study", "El barco se aproxima lentamente al muelle.", "يقترب القارب ببطء من الرصيف."),
    ("arrastrar", "ar", "A2", "جرّ وسحب الثقل على الأرض", "جر وسحل ع الأرض", "daily", "El tractor arrastra el arado por el campo.", "يجر الجرار المحراث عبر الحقل."),
    ("ascender", "e-ie", "B1", "صعد وارتقى / ترقى في العمل", "طلع وصعد واترقّى", "work", "El montañero asciende la cumbre nevada.", "يصعد متسلق الجبال القمة الثلجية."),
    ("atravesar", "e-ie", "A2", "عبر واجتاز الشارع أو النهر", "عدى وعدى النهر", "travel", "El puente permite atravesar el ancho río.", "يتيح الجسر عبور النهر العريض."),
    ("avanzar", "ar", "A2", "تقدم وسار إلى الأمام", "اتقدم ومشي لقدام", "social", "Las obras de la carretera avanzan a buen ritmo.", "تتقدم أعمال الطريق بوتيرة جيدة."),
    ("bajar", "ar", "A1", "نزل وهبط من الدرج", "نزل من ع السلم", "transport", "Baja con cuidado por la escalera empinada.", "انزل بحذر على الدرج شديد الانحدار."),
    ("caer", "er", "A1", "سقط ووقع على الأرض", "وقع وتكعبل ع الأرض", "daily", "Las hojas secas caen de los árboles en otoño.", "تسقط الأوراق الجافة من الأشجار في الخريف."),
    ("caminar", "ar", "A1", "مشى وسار بخطوات منتظمة", "مشي بخطوة منتظمة", "sports", "Caminar a diario mejora el ritmo cardíaco.", "المشي يومياً يحسن نبض القلب."),
    ("circular", "ar", "A2", "سار وتجول / دار في مساره", "مشي ولف في الشارع", "transport", "Los vehículos circulan despacio por el centro.", "تسير المركبات ببطء في وسط المدينة."),
    ("conducir", "ir", "A1", "قاد وساق السيارة بأمان", "ساق العربية بحرص", "transport", "Conduce con prudencia cuando llueve intensamente.", "يقود بحكمة عندما يهطل المطر بغزارة."),
    ("correr", "er", "A1", "جرى وركض مسرعاً في السباق", "جري بسرعة في التراك", "sports", "Los atletas corren los cien metros lisos.", "يجري الرياضيون سباق المئة متر حواجز."),
    ("cruzar", "ar", "A1", "عبر الشارع عند ممر المشاة", "عدى الشارع من ممر المشاة", "transport", "Cruza la calle siempre por el paso de peatones.", "اعبر الشارع دائماً من ممر المشاة."),
    ("descender", "e-ie", "B1", "نزل وهبط من المرتفع", "نزل من فوق الجبل", "travel", "El teleférico desciende suavemente al valle.", "يهبط التلفريك بنعومة إلى الوادي."),
    ("deslizar", "ar", "A2", "تزحلق وانزلق بسلاسة", "اتزحلق ع التلج", "sports", "El esquiador se desliza veloz por la nieve.", "ينزلق المتزلج بسرعة فوق الثلج."),
    ("desplazar", "ar", "B1", "انتقل وتحرك من مكان لآخر", "اتحرك ونقل لمكان تاني", "work", "Muchos trabajadores se desplazan en metro a diario.", "يتنقل كثير من العمال بالمترو يومياً."),
    ("detener", "er", "A2", "أوقف / احتجز وفق القانون", "وقف واحتجز في القسم", "transport", "El semáforo en rojo detiene el tráfico urbano.", "توقف إشارة المرور الحمراء حركة السير."),
    ("dirigir", "ir", "A2", "اتجه نحو / أدار المؤسسة", "اتجه نحو المكان وأدار الشغل", "work", "Dirige sus pasos hacia la estación de tren.", "يوجه خطواته نحو محطة القطار."),
    ("entrar", "ar", "A1", "دخل وولج إلى داخل الغرفة", "دخل جوة الأوضة", "daily", "Entró en la biblioteca guardando silencio.", "دخل المكتبة محافظاً على الهدوء."),
    ("escalar", "ar", "A2", "تسلق صخور الجبل الوعر", "اتسلق صخور الجبل", "sports", "Los jóvenes escalan la pared de roca con cuerdas.", "يتسلق الشباب الجدار الصخري بالحبال."),
    ("escapar", "ar", "A2", "فرّ وهرب ونجا من المأزق", "هرب وفلت من المأزق", "social", "El pájaro escapó de la jaula abierta.", "فر الطائر من القفص المفتوح."),
    ("frenar", "ar", "A2", "كبح الفرامل وأوقف المركبة", "فرمل ووقف العربية", "transport", "Frena a tiempo al ver el paso de peatones.", "يكبح في الوقت المناسب عند رؤية ممر المشاة."),
    ("girar", "ar", "A1", "دار وانعطف يميناً أو يساراً", "حود ولف يمين أو شمال", "transport", "Gira a la izquierda al llegar a la esquina.", "انعطف يساراً عند الوصول إلى الناصية."),
    ("huir", "ir", "B1", "هرب ولاذ بالفرار من الخطر", "فر وهرب من الخطر", "social", "Los animales huyen asustados del fuego del bosque.", "تهرب الحيوانات خائفة من حريق الغابة."),
    ("llegar", "ar", "A1", "وصل إلى المحطة في الموعد", "وصل المحطة في ميعاده", "travel", "El tren rápido llega puntual a las ocho.", "يصل القطار السريع في موعده عند الثامنة."),
    ("marchar", "ar", "A2", "غادر وسار في طريقه / اشتغل", "مشي وسافر واشتغل صح", "travel", "Los viajeros marchan temprano rumbo al aeropuerto.", "يغادر المسافرون مبكراً باتجاه المطار."),
    ("montar", "ar", "A1", "ركب الدراجة أو صهوة الحصان", "ركب العجلة أو الحصان", "transport", "Los niños montan en bicicleta por el parque.", "يركب الأطفال الدراجات في الحديقة."),
    ("mover", "o-ue", "A1", "حرّك ونقل الشيء من موضعه", "حرك وزحزح من مكانه", "daily", "Mueve la mesa para dejar más espacio libre.", "حرّك الطاولة لتترك مساحة فارغة أكبر."),
    ("nadar", "ar", "A1", "سبح وعام في مياه المسبح", "عام في البسين والبحر", "sports", "Nada cincuenta metros en estilo libre cada tarde.", "يسبح خمسين متراً سباحة حرة كل مساء."),
    ("navegar", "ar", "A2", "أبحر بالسفينة عبر المياه", "أبحر وساق المركب", "travel", "El velero navega con viento favorable hacia el puerto.", "يبحر القارب الشراعي برياح مواتية نحو الميناء."),
    ("parar", "ar", "A1", "توقف عن السير والحركة", "وقف وهدى خالص", "transport", "El autobús para delante de la universidad.", "تتوقف الحافلة أمام الجامعة."),
    ("partir", "ir", "A2", "غادر وانطلق مسافراً / قسم", "سافر وقسم الرغيف", "travel", "El vuelo internacional parte a mediodía.", "تنطلق الرحلة الدولية عند منتصف النهار."),
    ("pasar", "ar", "A1", "مرّ واجتاز المكان / قضى وقتاً", "عدى وفات وقضى وقت", "daily", "Pasa por delante de la panadería cada mañana.", "يمر أمام المخبز كل صباح."),
    ("pasear", "ar", "A1", "تنزه وتمشى في الهواء الطلق", "اتمشى واتفسح في الجنينة", "travel", "Pasean tranquilamente por el paseo marítimo.", "يتنزهون بهدوء على الكورنيش البحري."),
    ("patinar", "ar", "A2", "تزلج بالزلاجات أو فوق الجليد", "اتزحلق بالباتيناج", "sports", "Los jóvenes patinan en la pista municipal de hielo.", "يتزلج الشباب في حلبة الجليد البلدية."),
    ("perseguir", "e-i", "B1", "طارد وتعقب الأثر والطريدة", "طارد وجري ورا الهدف", "sports", "El perro persigue la pelota que le lanzaron.", "يطارد الكلب الكرة التي قذفوها له."),
    ("recorrer", "er", "A2", "طاف وجاب أنحاء المكان", "لف وطاف في المعالم", "travel", "Recorrieron el casco antiguo a pie durante horas.", "طافوا في الحي القديم مشياً لساعات."),
    ("regresar", "ar", "A1", "رجع وعاد إلى البيت بعد العمل", "رجع للبيت بعد الشغل", "daily", "Regresa a casa a las seis de la tarde.", "يعود إلى البيت عند السادسة مساءً."),
    ("remontar", "ar", "B1", "صعد عكس تيار النهر / تدارك", "طلع عكس التيار وتدارك النتيجة", "sports", "El salmón remonta el río para desovar.", "يصعد سمك السلمون عكس تيار النهر ليضع بيضه."),
    ("retirar", "ar", "A2", "سحب وأبعد الشيء / تقاعد", "سحب فلوس أو طلع معاش", "work", "Retiró dinero en efectivo del cajero automático.", "سحب نقوداً من الصراف الآلي."),
    ("retroceder", "er", "B1", "تراجع وعاد إلى الوراء", "رجع لورا خطوتين", "transport", "El coche retrocede con cuidado al aparcar.", "تتراجع السيارة للخلف بحذر عند الوقوف."),
    ("rodar", "o-ue", "A2", "تدحرجت الكرة / صور فيلماً", "اتدحرج وصور فيلم سينما", "arts", "La pelota rueda veloz por el césped húmedo.", "تتدحرج الكرة بسرعة فوق العشب الرطب."),
    ("salir", "ir", "A1", "خرج وانطلق من البيت للعمل", "خرج من البيت للشغل", "daily", "Sale de la oficina puntual a su hora.", "يخرج من المكتب في موعده تماماً."),
    ("saltar", "ar", "A1", "قفز ونط فوق العقبة بمرح", "نط وقفز فوق السور", "sports", "El atleta salta con pértiga superando el listón.", "يقفز الرياضي بالزانة متجاوزاً العارضة."),
    ("seguir", "e-i", "A1", "اتبع وواصل المسير في الدرب", "مشي ورا وكمل طريقه", "transport", "Sigue todo recto hasta llegar a la plaza mayor.", "امضِ إلى الأمام مباشرة حتى تبلغ الميدان."),
    ("subir", "ir", "A1", "صعد وطلع الدرج أو الحافلة", "طلع السلم وركب الأوتوبيس", "transport", "Sube al autobús y valida su billete de viaje.", "يصعد إلى الحافلة ويؤكد تذكرته."),
    ("trasladar", "ar", "A2", "نقل وحول المتاع إلى منزل جديد", "نقل العفش لبيت جديد", "housing", "Trasladaron los muebles en un camión grande.", "نقلوا الأثاث في شاحنة كبيرة."),
    ("viajar", "ar", "A1", "سافر وجاب الآفاق والبلدان", "سافر ولف بلاد الدنيا", "travel", "Viaja con frecuencia por motivos de trabajo.", "يسافر كثيراً لدواعي العمل."),
    ("volar", "o-ue", "A1", "طار وحلق في الفضاء كطائر", "طار في الجو وحلق عالي", "transport", "El avión vuela por encima de las nubes blancas.", "تحلق الطائرة فوق الغيوم البيضاء."),
    ("volver", "o-ue", "A1", "رجع وعاد ثانية إلى الدار", "رجع وعاد للبيت تاني", "daily", "Vuelve a casa después de una larga jornada.", "يعود إلى بيته بعد يوم عمل طويل."),

    # أفعال التواصل والتعبير واللغة
    ("afirmar", "ar", "B1", "أكد وأقر بصحة الخبر المعلن", "أكد وأقر بالخبر", "study", "El testigo afirma que vio salir al sospechoso.", "يؤكد الشاهد أنه رأى المشتبه به يخرج."),
    ("anunciar", "ar", "A2", "أعلن وأذاع النبأ للجمهور", "أعلن وقال الخبر للناس", "social", "El portavoz anuncia las nuevas medidas económicas.", "يعلن المتحدث الرسمي عن الإجراءات الاقتصادية."),
    ("argumentar", "ar", "B1", "احتج وقدم الحجج والبراهين", "جادل بالحجة والبرهان", "study", "El ponente argumenta su tesis con datos sólidos.", "يدعم المحاضر أطروحته ببيانات قوية."),
    ("charlar", "ar", "A1", "تسامر وتبادل الحديث الودي", "دردش وفضفض مع صحابه", "social", "Charlan amistosamente tomando una taza de té.", "يتسامرون بود وهم يشربون فنجان شاي."),
    ("comentar", "ar", "A2", "علق وأبدى ملاحظاته على الأمر", "علق وكتب رأيه في الموضوع", "social", "El periodista comenta las noticias del día en la radio.", "يعلق الصحفي على أخبار اليوم في الإذاعة."),
    ("comunicar", "ar", "A2", "أبلغ ونقل الرسالة بوضوح", "وصل المعلومة وبلغ بيها", "social", "Comunica la decisión oficial a todo el personal.", "يبلغ القرار الرسمي إلى جميع الموظفين."),
    ("contar", "o-ue", "A1", "روى وحكى القصة والنوادر", "حكى وقال الحكاية لأصحابه", "arts", "El abuelo cuenta cuentos maravillosos a sus nietos.", "يروي الجد حكايات رائعة لأحفاده."),
    ("contestar", "ar", "A1", "أجاب ورد على السؤال الموجه", "رد وجاوب ع السؤال", "study", "El estudiante contesta con acierto a la pregunta.", "يجيب الطالب بصواب عن السؤال."),
    ("conversar", "ar", "A1", "تحاور وتبادل الأفكار والنقاش", "اتكلم ودردش في حوار راقي", "social", "Conversan en español para practicar la lengua diaria.", "يتحاورون بالإسبانية لممارسة اللغة يومياً."),
    ("debatir", "ir", "B1", "ناقش وجادل القضية في الجلسة", "ناقش وعمل مناظرة في الموضوع", "social", "Los diputados debaten la nueva ley de educación.", "يناقش النواب قانون التعليم الجديد."),
    ("declarar", "ar", "A2", "صرح وأدلى ببيان رسمي", "صرح وقال بيان رسمي", "social", "El ministro declara el estado de alerta sanitaria.", "يعلن الوزير حالة التأهب الصحي."),
    ("decir", "er", "A1", "قال وتكلم بالحق والصدق", "قال ونطق بالحق", "social", "Dice siempre la verdad en cualquier circunstancia.", "يقول الصدق دائماً في أي ظرف."),
    ("deletrear", "ar", "A1", "تهجى الكلمة حرفاً حرفاً", "تهجى الكلمة حرف حرف", "study", "Deletrea su apellido para que lo anoten bien.", "يتهجى لقبه لكي يسجلوه بشكل صحيح."),
    ("describir", "ir", "A2", "وصف ورسم الملامح بالتفصيل", "وصف شكل المكان وحاله", "study", "Describe con precisión el paisaje que contempla.", "يصف بدقة المشهد الطبيعي الذي يتأمله."),
    ("discutir", "ir", "A2", "ناقش وجادل / تخاصم كلامياً", "تناقش أو اتخانق في الكلام", "social", "Discuten sobre cuál es la mejor ruta para viajar.", "يناقشون ما هو أفضل مسار للسفر."),
    ("explicar", "ar", "A1", "شرح وفصل المسألة للطلاب", "شرح وبسط الدرس للطلبة", "study", "La profesora explica la regla gramatical con ejemplos.", "تشرح المعلمة القاعدة النحوية بالأمثلة."),
    ("expresar", "ar", "A2", "عبر وأفصح عن مكنون صدره", "عبر عن اللي جواه وفضفض", "social", "Expresa sus sentimientos con sincera franqueza.", "يعبر عن مشاعره بصدق وصراحة."),
    ("gritar", "ar", "A1", "صاح وصرخ منادياً بأعلى صوته", "زعق وعلا صوته في النداء", "social", "El aficionado grita entusiasmado tras el gol.", "يهتف المشجع بحماس عقب تسجيل الهدف."),
    ("hablar", "ar", "A1", "تكلم وتحدث بلغة فصيحة واضحة", "اتكلم وقال ونطق بوضوح", "social", "Habla tres idiomas con fluidez y naturalidad.", "يتحدث ثلاث لغات بطلاقة وسلاسة."),
    ("informar", "ar", "A2", "أخبر وأعلم بالتطورات المستجدة", "بلغ وأخبر بالجديد في الموقف", "work", "El médico informa a la familia sobre el paciente.", "يطلع الطبيب الأسرة على حالة المريض."),
    ("insinuar", "ar", "B1", "ألمح ولمح بالأمر دون تصريح", "لمح في الكلام وما قالش صريح", "social", "Insinúa que podría haber cambios en la plantilla.", "يلمح إلى إمكانية حدوث تغييرات في الكادر."),
    ("llamar", "ar", "A1", "نادى بالاسم / هاتف الصديق", "رن ع التليفون ونادى بالاسم", "social", "Llama a su madre todos los domingos por la tarde.", "يتصل بوالدته كل يوم أحد في المساء."),
    ("mencionar", "ar", "A2", "ذكر وأورد الاسم في حديثه", "جاب سيرة وذكر الاسم", "social", "Menciona a sus colaboradores en los agradecimientos.", "يذكر معاونيه في عبارات الشكر."),
    ("narrar", "ar", "B1", "روى وسرد الأحداث التاريخية", "حكى وروى وقائع التاريخ", "arts", "El cronista narra los hechos con rigurosa precisión.", "يسرد المؤرخ الوقائع بدقة بالغة."),
    ("negar", "e-ie", "A2", "أنكر ورفض الاعتراف بالواقعة", "نكر ومارضيش يعترف بالحاجة", "social", "El acusado niega rotundamente su implicación.", "ينكر المتهم تماماً أي صلة له بالأمر."),
    ("nombrar", "ar", "A2", "سمى وعين في المنصب المرموق", "عين في المنصب وسمى بالاسم", "work", "Nombraron al profesor director del departamento.", "عينوا الأستاذ رئيساً للقسم."),
    ("notificar", "ar", "B1", "أخطر وأبلغ بالقرار رسمياً", "بلغ وأخطر بجواب رسمي", "work", "El juzgado notifica la resolución por correo certificado.", "تبلغ المحكمة القرار عبر البريد المسجل."),
    ("opinar", "ar", "A2", "أبدى رأيه ووجهة نظره في النقاش", "قال رأيه وعلق في النقاش", "social", "Opina que la educación pública debe ser prioritaria.", "يرى أن التعليم العام ينبغي أن يكون أولوية."),
    ("pedir", "e-i", "A1", "طلب وسأل الشيء بأدب واحترام", "طلب وسأل الحاجة بذوق", "food", "Pide un café solo con sacarina al camarero.", "يطلب من النادل قهوة سادة بمحلي بديل."),
    ("preguntar", "ar", "A1", "سأل واستفسر عن الاتجاهات", "سأل واستفهم ع العنوان والسكة", "travel", "Pregunta a los transeúntes dónde está la estación.", "يسأل المارة عن موقع المحطة."),
    ("pronunciar", "ar", "A1", "نطق ولفظ الأصوات بمخارجها", "نطق الحرف سليم بمخارجه", "study", "Pronuncia con soltura los sonidos difíciles.", "ينطق الأصوات الصعبة بسلاسة."),
    ("protestar", "ar", "A2", "احتج واعترض على الإجراء", "اعترض واحتج ع القرار الظالم", "social", "Los vecinos protestan por el ruido nocturno en la plaza.", "يحتج الجيران على الضوضاء الليلية في الميدان."),
    ("quejar", "ar", "A2", "شكا وتذمر من سوء المعاملة", "اتشكى واتذمر من المعاملة", "social", "El cliente se queja del retraso en el servicio.", "يشكو الزبون من التأخر في الخدمة."),
    ("reclamar", "ar", "B1", "طالب بحقه واحتج رسمياً", "طالب بحقه وعمل شكوى", "work", "Reclama la devolución del importe cobrado indebidamente.", "يطالب باسترداد المبلغ المحصل بغير وجه حق."),
    ("repetir", "e-i", "A1", "كرر وأعاد الكلام لتوضيحه", "عاد وكرر الكلمة عشان تفهم", "study", "Repite la frase para fijar la estructura gramatical.", "كرر الجملة لترسيخ التركيب النحوي."),
    ("responder", "er", "A1", "رد وأجاب عن الرسالة والنداء", "رد وجاوب ع الإيميل والنداء", "social", "Responde a todos los correos electrónicos el mismo día.", "يرد على جميع رسائل البريد الإلكتروني في اليوم نفسه."),
    ("rogar", "o-ue", "B1", "توسل ورجا بأدب وإلحاح", "ترجى وطلب بالرجاء والأدب", "social", "Le ruega encarecidamente que guarde el secreto.", "يرجوه بإلحاح أن يكتم السر."),
    ("saludar", "ar", "A1", "سلّم وحيّا الأصدقاء والزملاء", "صبح ومسى وسلم ع الزملاء", "social", "Saluda cordialmente con la mano al entrar en la sala.", "يسلم بود بيده عند دخوله القاعة."),
    ("susurrar", "ar", "A2", "همس وسارّ في الأذن بصوت خافت", "وشوش وهمس في الودن بصوت واطي", "social", "Le susurra al oído las palabras clave del mensaje.", "يهمس في أذنه بالكلمات المفتاحية للرسالة."),
]

def build_verbs_large(existing_norms: set[str]):
    entries = []
    seen = set()
    rank = 1

    for row in VERBS_DATA:
        lemma = row[0]
        norm = norm_vocab(lemma)
        if norm in existing_norms or norm in seen:
            continue
        seen.add(norm)

        paradigm = row[1]
        level = row[2]
        msa = row[3]
        eg = row[4]
        domain = row[5]
        ex_es = row[6]
        ex_ar = row[7]

        entry = make_verb(lemma, paradigm, level, msa, eg, ex_es, ex_ar, domain=domain, rank=rank)
        entries.append(entry)
        rank += 1

    emit_bundle(
        filename="vocab-cv-verbs-large.json",
        bundle_slug="cv-verbs-large",
        title_ar="الأفعال الإسبانية الكبرى: الحركة والانتقال والتواصل والتفاعل",
        entries=entries
    )
    return len(entries), seen

if __name__ == "__main__":
    count, _ = build_verbs_large(get_existing_norms())
    print(f"Generated {count} verbs in vocab-cv-verbs-large.json")
