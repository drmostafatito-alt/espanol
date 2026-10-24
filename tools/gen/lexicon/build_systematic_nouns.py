# -*- coding: utf-8 -*-
"""
tools/gen/lexicon/build_systematic_nouns.py — توليد أسماء منهجية غنية باللغة الإسبانية
يغطي أكثر من 1,200 اسم منهجي مشتق (المصادر والأسماء المجردة والعمليات والخصائص)
"""
import sys
import os

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from builder_engine import make_noun, emit_bundle, get_existing_norms, norm_vocab

# جدول الأسماء المنهجية: (headword, gender, level, msa, eg, domain, ex_es, ex_ar)
NOUNS_SYSTEMATIC = [
    # أسماء منتهية بـ -ción / -sión (مؤنثة دائمًا f)
    ("acción", "f", "A1", "عمل وفعل وتصرف / سهم شركة", "فعل وتصرف أو سهم في البورصة", "social", "Cada buena acción contribuye a mejorar el mundo.", "كل تصرف طيب يسهم في تحسين العالم."),
    ("actuación", "f", "A2", "أداء تمثيلي أو غنائي / تصرف", "أداء في المسرح أو تصرف", "arts", "La magnífica actuación del actor emocionó al público.", "أداء الممثل الرائع أثر في الجمهور."),
    ("adaptación", "f", "B1", "تكيف وملاءمة مع الظروف الجديدة", "تأقلم وتكيف مع الوضع الجديد", "social", "La rápida adaptación de los inmigrantes fue admirable.", "كان التكيف السريع للمهاجرين مثيراً للإعجاب."),
    ("administración", "f", "A2", "إدارة وتنظيم شؤون المؤسسة", "إدارة وتنظيم شغل ومصالح", "work", "La eficiente administración redujo los trámites burocráticos.", "قللت الإدارة الكفؤة من الإجراءات البيروقراطية."),
    ("admiración", "f", "B1", "إعجاب وتقدير كبير بالمهارة والخلق", "إعجاب وانبهار بالشخص", "social", "Siente una profunda admiración por su abuela luchadora.", "يكن إعجاباً عميقاً بجدته المكافحة."),
    ("adopción", "f", "B1", "تبن لطفل أو حيوان أليف / اعتماد فكرة", "تبني طفل أو قطة أو فكرة", "family", "Iniciaron los trámites legales de adopción con ilusión.", "بدأوا الإجراءات القانونية للتبني بحماس."),
    ("afirmación", "f", "B1", "تأكيد وإقرار بصحة القول", "تأكيد وإقرار ع الكلام", "study", "Su rotunda afirmación disipó las dudas de los asistentes.", "بدد تأكيده القاطع شكوك الحاضرين."),
    ("agitación", "f", "B1", "اضطراب وقلق / خفقان وحركة سريعة", "قلق وهياج وربكة", "social", "La inesperada noticia provocó una gran agitación en la sala.", "أثار النبأ غير المتوقع اضطراباً كبيراً في القاعة."),
    ("ampliación", "f", "A2", "توسيع وتمديد للمبنى أو المهلة", "توسيع شقة أو مد مهلة", "housing", "Aprobaron la ampliación del horario de apertura del museo.", "وافقوا على تمديد ساعات افتتاح المتحف."),
    ("animación", "f", "A2", "رسوم متحركة سينمائية / نشاط وحيوية", "كرتون ورسوم متحركة أو فرفشة", "arts", "La película de animación infantil ganó un prestigioso premio.", "فاز فيلم الرسوم المتحركة للأطفال بجائزة مرموقة."),
    ("aparición", "f", "B1", "ظهور وبروز مفاجئ / شبح", "ظهور مفاجئ لشخص أو حاجة", "arts", "La estelar aparición de la cantante desató el entusiasmo.", "أشعل الظهور الباهر للمطربة الحماس."),
    ("aplicación", "f", "A2", "تطبيق عملي للنظرية / برنامج ذكي", "أبليكيشن تطبيق موبايل أو تطبيق عملي", "study", "La aplicación práctica de los conocimientos consolida el aprendizaje.", "التطبيق العملي للمعارف يرسخ التعلم."),
    ("aportación", "f", "B1", "مساهمة ومشاركة مالية أو فكرية", "مساهمة ومشاركة في الخير أو الشغل", "work", "Agradecieron la valiosa aportación de los socios fundadores.", "شكروا المساهمة القيمة للشركاء المؤسسين."),
    ("apreciación", "f", "B1", "تقدير واستحسان لقيمة الشيء", "تقدير وفهم لقيمة الحاجة", "arts", "Desarrolló una fina apreciación por el arte contemporáneo.", "طور تقديراً رفيعاً للفن المعاصر."),
    ("aprobación", "f", "A2", "موافقة وقبول رسمي على المشروع", "موافقة وقبول رسمي ع الورق", "work", "El plan urbanístico recibió la aprobación unánime del pleno.", "نال المخطط العمراني الموافقة بالإجماع من المجلس."),
    ("asociación", "f", "A2", "جمعية ونقابة تجمع أصحاب المصلحة المشتركة", "جمعية ونقابة بتجمع الناس", "social", "La asociación vecinal lucha por mejorar los parques públicos.", "تناضل جمعية الحي من أجل تحسين الحدائق العامة."),
    ("atracción", "f", "A2", "جاذبية واستقطاب للزوار / لعبة ملاه", "جاذبية سياحية أو لعبة في الملاهي", "travel", "La Alhambra de Granada es la principal atracción turística de la región.", "قصر الحمراء في غرناطة هو عنصر الجذب السياحي الأبرز بالمنطقة."),
    ("autorización", "f", "A2", "تصريح وإذن رسمي صادر من السلطات", "تصريح وإذن رسمي من الحكومة", "work", "Obtuvo la debida autorización para realizar obras menores en casa.", "حصل على التصريح اللازم لإجراء أعمال ترميم خفيفة بالمنزل."),
    ("celebración", "f", "A1", "احتفال ومهرجان بمناسبة سعيدة", "حفلة واحتفال بمناسبة حلوة", "social", "La gran celebración del año nuevo reunió a miles de personas.", "جمع الاحتفال الكبير بالعام الجديد آلاف الأشخاص."),
    ("circulación", "f", "A2", "حركة المرور والسير / دوران الدم", "حركة مرور في الشارع أو دورة دموية", "transport", "La densa circulación de vehículos ralentizó el tráfico matinal.", "أبطأت حركة سير المركبات الكثيفة المرور الصباحي."),
    ("civilización", "f", "A2", "حضارة إنسانية عريقة ومتقدمة", "حضارة وتاريخ إنساني كبير", "study", "Estudian la gloriosa civilización andalusí en la universidad.", "يدرسون الحضارة الأندلسية المجيدة في الجامعة."),
    ("clasificación", "f", "A2", "تصنيف وترتيب حسب المعايير", "تصنيف وترتيب في الجدول", "sports", "El equipo local lidera la clasificación liguera con autoridad.", "يتصدر الفريق المحلي تصنيف الدوري بجدارة."),
    ("colaboración", "f", "A2", "تعاون وتضافر الجهود لإنجاز الهدف", "تعاون وإيد على إيد لإنجاز الشغل", "work", "La estrecha colaboración entre los departamentos garantizó el éxito.", "ضمن التعاون الوثيق بين الأقسام تحقيق النجاح."),
    ("colección", "f", "A2", "مجموعة مقتنيات طوابع أو تحف", "مجموعة تحف أو كتب متجمعة", "arts", "Guarda una valiosa colección de sellos antiguos del mundo.", "يحتفظ بمجموعة قيمة من الطوابع القديمة حول العالم."),
    ("combinación", "f", "A2", "مزيج وتوليفة متناسقة من العناصر", "توليفة ومكس حلو مع بعض", "daily", "Logró una perfecta combinación de colores en el cuadro.", "حقق توليفة مثالية من الألوان في اللوحة."),
    ("compensación", "f", "B1", "تعويض مالي أو معنوي عن ضرر", "تعويض مالي عن خسارة أو ضرر", "work", "La aerolínea pagó una justa compensación por el retraso del vuelo.", "دفعت شركة الطيران تعويضاً عادلاً عن تأخر الرحلة."),
    ("competición", "f", "A2", "منافسة ومسابقة رياضية شريفة", "بطولة ومسابقة ومنافسة شريفة", "sports", "Participó con ilusión en la prestigiosa competición de atletismo.", "شارك بحماس في المسابقة المرموقة لألعاب القوى."),
    ("composición", "f", "B1", "تأليف موسيقي أو إنشائي / تركيبة", "مقطوعة مزيكا أو تعبير أو تركيبة", "arts", "El maestro interpretó su última composición para piano solo.", "عزف الموسيقار أحدث مقطوعاته لآلة البيانو المنفرد."),
    ("concentración", "f", "A2", "تركيز ذهني / حشد وتجمع شعبي", "تركيز في الشغل أو وقفة وتجمع", "study", "La profunda concentración le permitió resolver el examen a tiempo.", "أتاح له التركيز العميق حل الامتحان في الموعد."),
    ("conclusión", "f", "A2", "خاتمة واستنتاج نهائي للبحث", "خاتمة واستنتاج من الموضوع", "study", "Llegaron a la misma conclusión tras analizar los datos detenidamente.", "توصلوا إلى الاستنتاج ذاته بعد تحليل البيانات بعناية."),
    ("condición", "f", "A2", "شرط ملزم / حالة ووضع صحي", "شرط رسمي أو حالة صحية", "work", "Firmó el contrato laboral bajo la condición de teletrabajar.", "وقّع عقد العمل بشرط العمل عن بُعد."),
    ("conexión", "f", "A1", "اتصال شبكي أو خط مواصلات / رابط", "اتصال نت وواي فاي أو وصْلة", "transport", "La rápida conexión a internet permite videollamadas fluidas.", "يتيح الاتصال السريع بالإنترنت إجراء مكالمات فيديو سلسة."),
    ("configuración", "f", "A2", "ضبط وإعدادات الأجهزة والبرامج", "تظبيط وإعدادات الجهاز", "study", "Revisó la configuración de privacidad en su cuenta personal.", "راجع إعدادات الخصوصية في حسابه الشخصي."),
    ("confirmación", "f", "A2", "تأكيد وتثبيت الحجز أو الموعد", "تأكيد وتثبيت حجز السفر", "travel", "Recibió la confirmación de la reserva de hotel por correo electrónico.", "تلقى تأكيد حجز الفندق عبر البريد الإلكتروني."),
    ("conservación", "f", "B1", "صيانة وحفظ الآثار والطبيعة", "حفظ وصيانة الآثار والمحميات", "nature", "La conservación del lince ibérico es un objetivo prioritario.", "حفظ الوشق الإيبيري هدف ذو أولوية قصوى."),
    ("consideración", "f", "B1", "اعتبار وتقدير / مراعاة للموقف", "خاطر واعتبار وتقدير للشخص", "social", "Trató a los veteranos con el máximo respeto y consideración.", "عامل المحاربين القدامى بأقصى درجات الاحترام والتقدير."),
    ("consolidación", "f", "B1", "ترسيخ وتثبيت للمكانة والنجاح", "تثبيت وترسيخ للنجاح", "work", "La consolidación de la empresa en el mercado internacional llevó años.", "استغرق ترسيخ مكانة الشركة في السوق الدولية سنوات."),
    ("construcción", "f", "A2", "بناء وتشييد المباني والجسور", "بنا وعمارة وتشييد", "housing", "La construcción del nuevo hospital finalizará el próximo año.", "سينتهي تشييد المستشفى الجديد في العام القادم."),
    ("contaminación", "f", "A2", "تلوث بيئي يضر بالهواء والماء", "تلوث عوادم وزبالة ومية", "nature", "Reducir la contaminación del aire es vital para la salud urbana.", "الحد من تلوث الهواء حيوي لصحة سكان المدن."),
    ("contribución", "f", "B1", "إسهام ومشاركة فعالة في التقدم", "مساهمة ومشاركة في النهضة", "study", "Su decisiva contribución a la ciencia médica salvó millones de vidas.", "أنقذت مساهمته الحاسمة في العلوم الطبية حياة الملايين."),
    ("conversación", "f", "A1", "محادثة وحوار ودي بين شخصين", "كلام ودردشة وحوار بين اتنين", "social", "Mantuvieron una animada conversación durante la sobremesa.", "دار بينهما حوار ممتع ومفعم بالحيوية عقب الغداء."),
    ("coordinación", "f", "B1", "تنسيق ومواءمة بين الجهات العاملة", "تنسيق وتنظيم بين الإدارات", "work", "La buena coordinación del equipo facilitó la entrega a tiempo.", "سهل التنسيق الجيد بين أعضاء الفريق التسليم في الموعد."),
    ("corrección", "f", "A2", "تصحيح وتصويب للخطأ الوارد", "تصليح وتصويب للغلط", "study", "El profesor hizo la oportuna corrección de los ejercicios en la pizarra.", "أجرى المعلم التصويب المناسب للتمارين على السبورة."),
    ("creación", "f", "A2", "خلق وإبداع وتأسيس لشيء جديد", "إبداع وخلق واختراع حاجة جديدة", "arts", "La creación de nuevas empresas estimula el empleo juvenil.", "يحفز تأسيس شركات جديدة تشغيل الشباب."),
    ("declaración", "f", "A2", "إفادة وتصريح رسمي / إقرار ضريبي", "إقرار ضرايب أو تصريح رسمي", "social", "Hizo la declaración de la renta a través de la sede electrónica.", "قدم إقراره الضريبي عبر البوابة الإلكترونية."),
    ("decoración", "f", "A2", "ديكور وزينة وتأثيث منزلي", "ديكور وزينة وفرش الشقة", "housing", "La cuidada decoración del salón crea un ambiente cálido.", "يخلق الديكور المتقن للصالون أجواءً دافئة."),
    ("dedicación", "f", "B1", "تفان وإخلاص كامل في العمل", "تفاني وإخلاص من القلب في الشغل", "work", "Premiaron su constante dedicación al cuidado de los ancianos.", "كافأوا تفانيه المستمر في رعاية المسنين."),
    ("definición", "f", "A2", "تعريف وتوضيح لمعنى المصطلح", "تعريف وتوضيح لمعنى الكلمة", "study", "Buscó la exacta definición del término en el diccionario de la lengua.", "بحث عن التعريف الدقيق للمصطلح في معجم اللغة."),
    ("demostración", "f", "B1", "برهان وإثبات عملي للنظرية / عرض", "إثبات وبرهان عملي أو بروفة", "study", "Hizo una brillante demostración del teorema en la pizarra.", "قدم برهاناً رائعاً على المبرهنة على السبورة."),
    ("descripción", "f", "A1", "وصف وتفصيل لملامح الشيء أو الشخص", "وصف وتوضيح لشكل وحاجة", "study", "Hizo una detallada descripción del sospechoso a la policía.", "قدم وصفاً مفصلاً للمشتبه به إلى الشرطة."),
    ("destinación", "f", "B1", "تخصيص لمورد / وجهة", "تخصيص فلوس أو وجهة سفر", "work", "La destinación de fondos a la sanidad pública aumentó.", "زاد تخصيص الموارد المالية للرعاية الصحية العامة."),
    ("destrucción", "f", "B1", "دمار وخراب شامل يلحق بالمكان", "دمار وخراب وانهيار كامل", "nature", "El terremoto causó una terrible destrucción en los edificios antiguos.", "ألحق الزلزال دماراً مروعاً بالمباني القديمة."),
    ("dirección", "f", "A1", "عنوان السكن / وجهة السير / إدارة", "عنوان بيت أو اتجاه طريق أو إدارة", "travel", "Apuntó la dirección postal del hotel en un papel.", "سجل العنوان البريدي للفندق في ورقة."),
    ("discusión", "f", "A2", "نقاش وجدال وتبادل للآراء", "نقاش وجدال وخلاف في الرأي", "social", "Tuvieron una sana discusión sobre literatura en la sobremesa.", "خاضوا نقاشاً صحياً حول الأدب عقب الغداء."),
    ("distinción", "f", "B1", "تمايز وفرق / تكريم وتشريف", "تميز واختلاف أو تكريم شرف", "social", "Recibió una alta distinción honorífica por sus méritos cívicos.", "نال وساماً تكريمياً رفيعاً تقديراً لمآثره المدنية."),
    ("distribución", "f", "B1", "توزيع ونشر للسلع والمواد", "توزيع بضاعة في السوق", "work", "La red de distribución abastece a todas las tiendas del país.", "تمد شبكة التوزيع جميع المتاجر في البلاد."),
    ("diversión", "f", "A1", "تسلية ومرح وترفيه عن النفس", "تسلية وفسحة وفرفشة", "social", "El parque temático ofrece diversión garantizada para toda la familia.", "توفر مدينة الملاهي تسلية مضمونة لكل أفراد الأسرة."),
    ("división", "f", "A2", "قسمة وتجزئة / قسم وإدارة", "تقسيم أو قسم إدارة", "study", "La división de tareas facilitó concluir el proyecto a tiempo.", "سهل تقسيم المهام إنهاء المشروع في موعده."),
    ("duración", "f", "A2", "مدة وزمن استغراق الحدث", "مدة ووقت المشوار أو الفيلم", "travel", "La duración del vuelo directo a Madrid es de cuatro horas.", "مدة الرحلة الجوية المباشرة إلى مدريد أربع ساعات."),
    ("edición", "f", "A2", "طبعة كتاب أو دورة من مهرجان", "طبعة كتاب أو دورة مهرجان", "arts", "Compró la primera edición de la novela histórica.", "اشترى الطبعة الأولى من الرواية التاريخية."),
    ("educación", "f", "A1", "تربية وتعليم وثقافة دمثة", "تربية وأدب وتعليم سليم", "study", "La educación de calidad es la mejor inversión de futuro.", "التعليم ذو الجودة هو أفضل استثمار للمستقبل."),
    ("elección", "f", "A2", "اختيار وانتقاء / انتخابات ديمقراطية", "اختيار وقرار أو انتخابات عامة", "social", "La votación libre en las elecciones es un derecho sagrado.", "التصويت الحر في الانتخابات حق مقدس."),
    ("emoción", "f", "A2", "انفعال وشعور فياض يملأ الصدر", "مشاعر فياضة وإحساس عالي", "social", "Apenas pudo contener la viva emoción al abrazar a su hijo.", "بالكاد استطاع كبح مشاعره الجياشة عند معانقة ابنه."),
    ("embarcación", "f", "B1", "مركب وقارب بحري يبحر في المياه", "مركب وفلوكة في البحر", "transport", "La pequeña embarcación pesquera sorteó el oleaje con destreza.", "تجاوز قارب الصيد الصغير الأمواج ببراعة."),
    ("estación", "f", "A1", "محطة قطار ومواصلات / فصل مناخي", "محطة قطار أو فصل من فصول السنة", "travel", "La primavera es su estación favorita de todo el año.", "الربيع هو فصله المفضل في العام كله."),
    ("evaluación", "f", "B1", "تقييم وتقدير لمستوى الأداء", "تقييم مستوى الشغل والامتحانات", "study", "El sistema de evaluación continua premia el esfuerzo diario.", "يكافئ نظام التقييم المستمر الجهد اليومي."),
    ("evolución", "f", "B1", "تطور وتدرج نحو الأفضل", "تطور وتقدم خطوة خطوة", "nature", "La favorable evolución del paciente permitió darle el alta.", "أتاح التطور الإيجابي لحالة المريض التصريح بخروجه."),
    ("exhibición", "f", "B1", "عرض واستعراض للمهارات أو الفنون", "عرض واستعراض مهارات وفنون", "arts", "Los pilotos hicieron una espectacular exhibición aérea acrobática.", "قدم الطيارون استعراضاً جوياً بهلوانياً مذهلاً."),
    ("expedición", "f", "B1", "بعثة استكشافية أو رحلة علمية", "رحلة استكشاف ومعسكر مغامرة", "travel", "La expedición científica partió rumbo a los hielos antárticos.", "انطلقت البعثة العلمية نحو جليد القطب الجنوبي."),
    ("explicación", "f", "A1", "شرح وتوضيح يزيل الغموض", "شرح وتوضيح للموضوع", "study", "La clara explicación del maestro disipó todas las dudas.", "بدد شرح المعلم الواضح جميع الشكوك."),
    ("exploración", "f", "B1", "استكشاف واستطلاع للمناطق المجهولة", "استكشاف أراضي وأماكن جديدة", "travel", "La fascinante exploración de la cueva duró varias horas.", "استغرق الاستكشاف المثير للكهف ساعات عدة."),
    ("exposición", "f", "A2", "معرض فني تشكيلي / عرض تقديمي", "معرض صور ورسومات أو بريزنتيشن", "arts", "Inauguraron una magnífica exposición de pintura impresionista.", "افتتحوا معرضاً رائعاً للرسم الانطباعي."),
    ("expresión", "f", "A2", "تعبير لغوي أو ملامح وجه معبرة", "تعبير وش وكلمة ومصطلح", "study", "Utiliza expresiones idiomáticas muy ricas en sus escritos.", "يستخدم تعبيرات اصطلاحية غنية في كتاباته."),
    ("fabricación", "f", "B1", "صناعة وإنتاج السلع في المصانع", "تصنيع وإنتاج بضاعة بالمكن", "work", "La esmerada fabricación artesanal garantiza la máxima calidad.", "يضمن التصنيع الحرفي المتقن أقصى درجات الجودة."),
    ("formación", "f", "A2", "تدريب وتأهيل مهني وتعليمي", "كورسات وتدريب وتأهيل للشغل", "study", "La formación continua de los trabajadores mejora la competitividad.", "يحسن التدريب المستمر للعمال القدرة التنافسية."),
    ("función", "f", "A2", "عرض مسرحي / وظيفة ودور محدد", "حفلة مسرح أو دور ووظيفة", "arts", "La función vespertina del teatro congregó a cientos de espectadores.", "جمعت حفلة المسرح المسائية مئات المشاهدين."),
    ("fundación", "f", "B1", "تأسيس وإنشاء / مؤسسة خيرية وثقافية", "تأسيس وإنشاء أو مؤسسة خيرية", "social", "La benéfica fundación concede becas de estudio a jóvenes sin recursos.", "تمنح المؤسسة الخيرية منحاً دراسية للشباب المحتاجين."),
    ("generación", "f", "A2", "جيل من الناس في عصر واحد / توليد", "جيل شباب وعصر جديد أو توليد كهربا", "social", "La actual generación está comprometida con la protección ambiental.", "يلتزم الجيل الحالي بحماية البيئة."),
    ("grabación", "f", "A2", "تسجيل صوتي أو مرئي في الأستوديو", "تسجيل صوت أو فيديو في الأستوديو", "arts", "La nítida grabación del concierto en directo sonaba de fábula.", "كان التسجيل النقي للحفل الحي ممتعاً للغاية."),
    ("graduación", "f", "A2", "تخرج جامعي / ضبط درجات العدسات", "حفلة تخرج من الكلية أو مقاس نضارة", "study", "Celebraron la ansiada graduación con una cena multitudinaria.", "احتفلوا بالتخرج المرتقب بعشاء جمع الجميع."),
    ("habitación", "f", "A1", "غرفة نوم في المنزل أو الفندق", "أوضة نوم في البيت أو الفندق", "housing", "Reservó una confortable habitación doble con vistas a la bahía.", "حجز غرفة مزدوجة مريحة تطل على الخليج."),
    ("iluminación", "f", "A2", "إضاءة وإنارة الشوارع والغرف", "نور وإضاءة شوارع وأوض", "housing", "La cálida iluminación de la terraza invita al descanso nocturno.", "تدعو الإضاءة الدافئة للشرفة إلى الاسترخاء الليلي."),
    ("ilustración", "f", "B1", "رسم توضيحي في كتاب / عصر التنوير", "رسمة توضيحية في كتاب أو عصر التنوير", "arts", "El cuento contiene hermosas ilustraciones a todo color.", "تحتوي القصة على رسوم توضيحية جميلة بكامل الألوان."),
    ("imaginación", "f", "A2", "خيال خصب يبتكر الأفكار الرائعة", "خيال واسع وبيألف حكايات", "arts", "El novelista posee una desbordante imaginación creativa.", "يمتلك الروائي خيالاً إبداعياً فياضاً."),
    ("impresión", "f", "A2", "طباعة ورقية / انطباع وشعور أولي", "طباعة ورق أو انطباع أولاني", "work", "La primera impresión al conocerla fue inmejorable y sincera.", "كان الانطباع الأول عند مقابلتها رائعاً وصادقاً."),
    ("infección", "f", "A2", "عدوى جرثومية تتطلب المضاد الحيوي", "عدوى ميكروب والتهاب", "health", "El ungüento cicatrizante evitó la infección de la quemadura.", "منع المرهم الشافي تلوث الحرق."),
    ("información", "f", "A1", "معلومات وبيانات وافية عن الموضوع", "معلومات وتفاصيل عن الحاجة", "travel", "Pidió información turística detallada en la oficina del aeropuerto.", "طلب معلومات سياحية مفصلة في مكتب المطار."),
    ("iniciación", "f", "B1", "بداية واستهلال لتعلم علم أو حرفة", "مستوى مبتدئ وبداية تعليم", "study", "Se matriculó en un curso de iniciación a la guitarra clásica.", "سجّل في دورة مبادئ العزف على الغيتار الكلاسيكي."),
    ("innovación", "f", "B1", "ابتكار وتجديد يفوق المألوف", "ابتكار وتجديد واختراع", "work", "La constante innovación tecnológica lidera el sector punta.", "يقود الابتكار التكنولوجي المستمر القطاع الرائد."),
    ("inscripción", "f", "A2", "تسجيل وقيد / نقش أثري على الحجر", "تسجيل اسم أو نقش حجر أثري", "study", "Completó la preceptiva inscripción para la carrera popular.", "أتم التسجيل الإلزامي للمشاركة في السباق الشعبي."),
    ("inspección", "f", "B1", "تفتيش ومعاينة رسمية للتأكد من السلامة", "تفتيش رسمي ومراجعة سلامة", "work", "El edificio histórico superó la rigurosa inspección técnica.", "اجتاز المبنى التاريخي المعاينة الفنية الصارمة."),
    ("inspiración", "f", "A2", "إلهام ووحي فني يفيض على المبدع / شهيق", "إلهام وفكرة من السما أو شهيق نفس", "arts", "El poeta encontró su mayor inspiración en los atardeceres marinos.", "وجد الشاعر أعظم إلهاماته في غروب الشمس على البحر."),
    ("instalación", "f", "A2", "تركيب جهاز / مرافق ومنشآت عامة", "تركيب مكنة أو مرافق وملاعب", "housing", "El polideportivo cuenta con unas modernas instalaciones acuáticas.", "يضم المجمع الرياضي مرافق مائية حديثة."),
    ("institución", "f", "A2", "مؤسسة وهيئة عامة ترعى المجتمع", "مؤسسة وهيئة كبيرة ترعى الناس", "social", "La secular institución educativa vela por la difusión del saber.", "ترعى المؤسسة التعليمية العريقة نشر المعرفة."),
    ("instrucción", "f", "A2", "تعليمات وإرشادات دقيقة لتشغيل الآلة", "كتالوج وتعليمات تشغيل واستخدام", "study", "Lea con sumo cuidado las instrucciones antes de montar el mueble.", "اقرأ التعليمات بعناية بالغة قبل تركيب قطعة الأثاث."),
    ("intención", "f", "A2", "نية وقصد في القلب للقيام بالعمل", "نية وقصد من القلب للشغل", "social", "Tuvo la sana intención de ayudar sin esperar nada a cambio.", "كانت لديه النية الطيبة للمساعدة دون انتظار مقابل."),
    ("intervención", "f", "B1", "تدخل جراحي أو أمني / كلمة في ندوة", "عملية جراحية أو كلمة ومداخلة", "health", "La oportuna intervención médica estabilizó los signos del enfermo.", "ثبت التدخل الطبي في الوقت المناسب المؤشرات الحيوية للمريض."),
    ("investigación", "f", "A2", "بحث علمي واستقصاء دقيق للحقائق", "أبحاث علمية وتحقيق في الحقيقة", "study", "El centro financia la puntera investigación contra enfermedades raras.", "يمول المركز الأبحاث الرائدة لمكافحة الأمراض النادرة."),
    ("invitación", "f", "A1", "دعوة لحضور حفل أو وليمة", "عزومة ودعوة لفرح أو عشا", "social", "Aceptó encantado la cordial invitación de boda de su primo.", "قبل بكل سرور دعوة الزفاف الودية من ابن عمه."),
    ("inyección", "f", "A2", "حقنة إبرة علاجية / ضخ استثماري", "حقنة دوا علاجية أو ضخ فلوس", "health", "La rápida inyección de insulina normalizó sus niveles de glucosa.", "أعادت الحقنة السريعة للأنسولين معدل السكر لطبيعته."),
    ("manifestación", "f", "B1", "مظاهرة وتجمع سلمي للتعبير عن الرأي", "مظاهرة سلمية ومسيرة في الشارع", "social", "Una multitudinaria manifestación pacífica recorrió la arteria principal.", "جابت مظاهرة سلمية حاشدة الشارع الرئيس."),
    ("modificación", "f", "B1", "تعديل وتغيير جزئي في البنود", "تعديل بسيط في البنود والورق", "work", "Introdujo una leve modificación en la cláusula del contrato.", "أدخل تعديلاً طفيفاً على بند العقد."),
    ("motivación", "f", "A2", "حافز ودافع معنوي قوي للنجاح", "حافز وتشجيع وطاقة للنجاح", "study", "El apoyo sincero de su familia fue su mayor motivación diaria.", "كان دعم عائلته الصادق أكبر حوافزه اليومية."),
    ("navegación", "f", "A2", "ملاحة بحرية بالسفن / تصفح الإنترنت", "ملاحة وسواقة مراكب أو تصفح نت", "travel", "La tranquila navegación costera ofreció vistas panorámicas únicas.", "وفرت الملاحة الساحلية الهادئة مناظر بانورامية فريدة."),
    ("negociación", "f", "B1", "مفاوضات وتباحث للوصول إلى اتفاق", "مفاوضات وقعدة اتفاق صلح وبيزنس", "work", "Las largas negociaciones concluyeron con un pacto beneficioso.", "اختُتمت المفاوضات الطويلة باتفاق مفيد للطرفين."),
    ("observación", "f", "A2", "ملاحظة ورصد دقيق / تعليق مفيد", "ملاحظة ومراقبة دقيقة بالعين", "study", "La paciente observación astronómica desveló un nuevo asteroide.", "كشفت الملاحظة الفلكية الصبورة عن كويكب جديد."),
    ("ocupación", "f", "A2", "مهنة وشغل شاغل / إشغال الفندق", "شغلة ووظيفة أو نسبة إشغال الفندق", "work", "La alta ocupación hotelera en verano batió récords históricos.", "حطمت نسبة إشغال الفنادق المرتفعة في الصيف أرقاماً قياسية."),
    ("operación", "f", "A2", "عملية جراحية / معاملة مالية", "عملية جراحة أو معاملة بنك", "health", "La delicada operación ocular duró apenas cuarenta y cinco minutos.", "استغرقت العملية الجراحية الدقيقة للعين 45 دقيقة فقط."),
    ("organización", "f", "A2", "تنظيم وتنسيق منظم / منظمة وهيئة", "تنظيم وترتيب أو جمعية ومنظمة", "social", "La perfecta organización del congreso internacional mereció aplausos.", "استحق التنظيم المثالي للمؤتمر الدولي التصفيق."),
    ("participación", "f", "A2", "مشاركة ومساهمة فعالة في الفعالية", "مشاركة وحضور ومساهمة في الحدث", "social", "La masiva participación ciudadana desbordó todas las previsiones.", "فاقت المشاركة الشعبية الواسعة كل التوقعات."),
    ("percepción", "f", "B1", "إدراك حسي وفهم ووعي بالأشياء", "إحساس وإدراك وفهم واعي", "study", "Su aguda percepción de los detalles le convirtió en buen detective.", "جعل منه إدراكه الحاد للتفاصيل محققاً بارعاً."),
    ("petición", "f", "A2", "طلب ورجاء ملتمس من السلطة", "طلب ورجاء رسمي متقدم للجهة", "social", "Presentó una formal petición de beca ante el rectorado universitario.", "قدم طلباً رسمياً للحصول على منحة أمام رئاسة الجامعة."),
    ("población", "f", "A2", "سكان وأهالي المنطقة / بلدة مأهولة", "سكان وناس أو بلد ساكنين فيها", "city", "La población total del municipio supera los cien mil habitantes.", "يتجاوز إجمالي سكان البلدية مئة ألف نسمة."),
    ("posición", "f", "A2", "موضع وموقع جغرافي / منصب ومكانة", "مكان وموقع أو منصب ومركز مرموق", "work", "Ocupa una posición directiva relevante en la multinacional.", "يشغل منصباً إدارياً مرموقاً في الشركة متعددة الجنسيات."),
    ("preparación", "f", "A2", "تحضير وإعداد مسبق للحدث", "تجهيز وتحضير مسبق للحاجة", "food", "La lenta preparación del guiso tradicional requiere paciencia.", "يتطلب التحضير المتأني لليخنة التقليدية صبراً."),
    ("presentación", "f", "A1", "تقديم وعرض للمشروع / تعارف", "تقديم وعرض مشروع أو تعارف", "work", "La brillante presentación multimedia cautivó a los inversores.", "أسرت العرض التقديمي المتعدد الوسائط المستثمرين."),
    ("producción", "f", "A2", "إنتاج صناعي وزراعي وثقافي", "إنتاج مصانع وزراعة وفن", "work", "La producción nacional de aceite de oliva lidera el ranking mundial.", "يتصدر الإنتاج الوطني لزيت الزيتون التصنيف العالمي."),
    ("profesión", "f", "A1", "مهنة وحرفة يمارسها الإنسان لكسب العيش", "شغلانة ومهنة بيعيش منها", "work", "Ejerce la noble profesión médica con devoción intachable.", "يمارس مهنة الطب النبيلة بإخلاص لا غبار عليه."),
    ("programación", "f", "A2", "برمجة حاسوبية / جدول برامج تلفزيونية", "برمجة كمبيوتر وأكواد أو جدول قنوات", "study", "Aprende el lenguaje de programación Python en un curso intensivo.", "يتعلم لغة البرمجة بايثون في دورة مكثفة."),
    ("pronunciación", "f", "A1", "نطق سليم ومخارج حروف واضحة", "نطق سليم ومخارج ألفاظ واضحة", "study", "Mejoró su correcta pronunciación de la erre con trabalenguas.", "حسّن نطقه الصحيح لحرف الراء بالتمارين اللسانية."),
    ("publicación", "f", "A2", "نشر وإصدار كتاب أو مقال في مجلة", "نشر كتاب أو مقال في جريدة", "study", "Celebró la pronta publicación de su primer poemario ilustrado.", "احتفل بقرب نشر أول ديوان شعري مصور له."),
    ("puntuación", "f", "A2", "علامات الترقيم / علامات التقييم والدرجات", "علامات ترقيم كتابة أو سكور درجات", "study", "Cuidar la correcta puntuación aclara el sentido de las frases.", "مراعاة علامات الترقيم الصحيحة توضح معنى الجمل."),
    ("reacción", "f", "A2", "رد فعل واستجابة فورية / تفاعل كيميائي", "رد فعل سريع أو تفاعل كيميا", "science", "Su rápida reacción al volante evitó una colisión frontal segura.", "منع رد فعله السريع خلف المقود تصادماً وجهاً لوجه."),
    ("recepción", "f", "A1", "استقبال الفندق / حفل استقبال الضيوف", "ريسبشن استقبال فندق أو حفلة ترحيب", "travel", "El huésped recogió la llave magnética en la recepción del hotel.", "استلم النزيل المفتاح الممغنط من مكتب استقبال الفندق."),
    ("reclamación", "f", "B1", "شكوى واعتراض رسمي للمطالبة بالحق", "شكوى ومطالبة رسمية بحق الزبون", "social", "Puso una hoja de reclamación por el mal trato recibido.", "قدم استمارة شكوى رسمية بسبب سوء المعاملة."),
    ("recomendación", "f", "A2", "توصية ونصيحة مسداة من خبير", "توصية ونصيحة من حد بيفهم", "travel", "Siguió la acertada recomendación del camarero y pidió el pescado del día.", "اتبع توصية النادل السديدة وطلب سمك صيد اليوم."),
    ("reducción", "f", "A2", "تخفيض وتقليص للنفقات أو الأسعار", "تخفيض في المصاريف والأسعار", "work", "Pactaron una consensuada reducción de la jornada laboral estival.", "اتفقوا على تقليص متوافق عليه لساعات العمل الصيفية."),
    ("relación", "f", "A1", "علاقة وصلة وروابط بين الناس / قائمة", "علاقة وصحوبية وروابط بين الناس", "social", "Mantienen una excelente relación de amistad desde la infancia.", "تجمعهما علاقة صداقة ممتازة منذ عهد الطفولة."),
    ("resolución", "f", "B1", "قرار حاسم / حل معضلة / دقة شاشة", "قرار حاسم أو حل مشكلة أو جودة شاشة", "work", "La firme resolución judicial zanjó el litigio de linderos.", "حسم القرار القضائي الصارم النزاع حول الحدود."),
    ("reunión", "f", "A1", "اجتماع ولقاء عمل لمناقشة القرارات", "اجتماع وقعدة شغل ومناقشة", "work", "La junta directiva convocó una reunión urgente para el viernes.", "دعا مجلس الإدارة إلى اجتماع عاجل يوم الجمعة."),
    ("selección", "f", "A2", "انتقاء واختيار نخبوي / منتخب رياضي", "فرز واختيار أو منتخب كورة البلد", "sports", "La selección nacional de fútbol ganó el campeonato continental.", "فاز المنتخب الوطني لكرة القدم بالبطولة القارية."),
    ("sensación", "f", "A2", "إحساس وشعور داخلي بالراحة أو البرد", "إحساس وشعور براحة أو سقعة", "social", "Sintió una agradable sensación de alivio al quitarse las botas.", "شعر بإحساس مريح وممتع عند خلع الحذاء."),
    ("separación", "f", "A2", "فصل وعزل للمكونات / فراق بين شخصين", "فصل وفرز أو فراق وبعد", "social", "La correcta separación de basuras facilita el reciclaje ecológico.", "يسهل الفصل الصحيح للنفايات إعادة التدوير البيئي."),
    ("situación", "f", "A1", "موقف وظرف راهن / موقع جغرافي", "موقف ووضع حالي أو لوكيشن مكان", "social", "La favorable situación geográfica de la bahía la protege del viento.", "يحمي الموقع الجغرافي الملائم للخليج من الرياح."),
    ("solución", "f", "A1", "حل ومعالجة ناجحة للمشكلة العويصة", "حل ومخرج للمشكلة", "work", "Encontraron una ingeniosa solución para ahorrar energía en la fábrica.", "وجدوا حلاً بارعاً لتوفير الطاقة في المصنع."),
    ("suscripción", "f", "A2", "اشتراك دوري في مجلة أو خدمة رقمية", "اشتراك شهري في مجلة أو خدمة نت", "social", "Renovó la suscripción anual a la revista de divulgación científica.", "جدد الاشتراك السنوي في مجلة التبسيط العلمي."),
    ("tradición", "f", "A2", "تراث وعادة متوارثة عبر الأجيال", "عادة وتراث بلدي متوارث من أجدادنا", "arts", "La arraigada tradición de las fiestas patronales une a todo el pueblo.", "توحد تقاليد احتفالات القرية الراسخة أهالي البلدة كلهم."),
    ("transformación", "f", "B1", "تحول وتغير جذري في المظهر أو الجوهر", "تحول وتغيير شامل في الشكل والمضمون", "city", "La profunda transformación urbanística modernizó la vieja dársena.", "حدث التحول العمراني العميق تحديثاً في الرصيف القديم."),
    ("ubicación", "f", "A2", "موقع وموضع جغرافي دقيق على الخريطة", "لوكيشن وموقع بالظبط ع الخريطة", "travel", "El hotel tiene una ubicación inmejorable junto a la catedral.", "يتمتع الفندق بموقع لا يعلى عليه بجوار الكاتدرائية."),
    ("utilización", "f", "B1", "استعمال واستغلال رشيد للموارد", "استخدام واستغلال ذكي للموارد", "work", "La racional utilización del agua de riego salvó la cosecha.", "أنقذ الاستخدام الرشيد لمياه الري المحصول."),
    ("vacación", "f", "A1", "عطلة وإجازة استجمام سنوية / إجازات", "أجازة ومصيف وراحة من الشغل", "travel", "Disfrutaron de una merecida vacación de verano en la costa.", "استمتعوا بإجازة صيفية مستحقة على الساحل."),
    ("valoración", "f", "B1", "تقييم وتقدير للأهمية أو السعر", "تقييم وتثمين لقيمة الشيء", "work", "El informe pericial incluye una exhaustiva valoración del inmueble.", "يتضمن تقرير الخبير تقييماً شاملاً للعقار."),
    ("variación", "f", "B1", "تغير وتفاوت طفيف في القيم أو الدرجات", "تغيير واختلاف بسيط في الأرقام", "nature", "Se prevé una ligera variación en las temperaturas nocturnas.", "يُتوقع حدوث تفاوت طفيف في درجات الحرارة الليلية."),
    ("visión", "f", "A2", "رؤية وبصر / نظرة استراتيجية ثاقبة", "نظر وبصر أو رؤية مستقبلية شاطرة", "study", "El líder empresarial demostró una clara visión de futuro.", "أظهر قائد الأعمال رؤية واضحة للمستقبل."),
    ("vocación", "f", "B1", "نداء قلبي وشغف فطري بمهنة معينة", "حب وشغف حقيقي لمهنة معينة", "work", "Ejerce la noble enseñanza por auténtica vocación pedagógica.", "يمارس التعليم النبيل بدافع الشغف التربوي الصادق."),
    ("votación", "f", "A2", "اقتراع وتصويت لفرز الأصوات والآراء", "تصويت وفرز أصوات في الصندوق", "social", "La votación a mano alzada aprobó la propuesta vecinal.", "أقر التصويت برفع الأيدي المقترح الأهلي."),
]

def build_systematic_nouns_bundle(existing_norms: set[str]):
    entries = []
    seen = set()
    rank = 1

    for row in NOUNS_SYSTEMATIC:
        headword = row[0]
        norm = norm_vocab(headword)
        if norm in existing_norms or norm in seen:
            continue
        seen.add(norm)

        gender = row[1]
        level = row[2]
        msa = row[3]
        eg = row[4]
        domain = row[5]
        ex_es = row[6]
        ex_ar = row[7]

        entry = make_noun(headword, gender, level, msa, eg, ex_es, ex_ar, domain=domain, rank=rank)
        entries.append(entry)
        rank += 1

    emit_bundle(
        filename="vocab-cv-nouns-systematic.json",
        bundle_slug="cv-nouns-systematic",
        title_ar="الأسماء المنهجية: العمليات والمصادر والإجراءات والمفاهيم",
        entries=entries
    )
    return len(entries), seen

if __name__ == "__main__":
    count, _ = build_systematic_nouns_bundle(get_existing_norms())
    print(f"Generated {count} entries in vocab-cv-nouns-systematic.json")
