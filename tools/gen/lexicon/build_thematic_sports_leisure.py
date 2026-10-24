# -*- coding: utf-8 -*-
"""
build_thematic_sports_leisure.py — حزمة الرياضة والأنشطة الترفيهية واللياقة (350 مدخل)
"""
import sys
import os

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from builder_engine import (
    make_noun, make_verb, make_adj, make_adv, make_expr,
    emit_bundle, get_existing_norms, norm_vocab
)

ITEMS = [
    # --- Football & Team Sports (كرة القدم والرياضات الجماعية) ---
    ("noun", "delantero centro", "m", "A2", "قلب هجوم هداف", "مهاجم صريح هداف", "sports"),
    ("noun", "centrocampista", "mf", "A2", "لاعب خط وسط الملعب", "لاعب نص ملعب", "sports"),
    ("noun", "defensa central", "m", "A2", "مدافع قلب الدفاع", "مدافع ومساك قلب دفاع", "sports"),
    ("noun", "portero suplente", "m", "A2", "حارس مرمى احتياطي", "حارس مرمى بديل", "sports"),
    ("noun", "árbitro principal", "m", "A2", "حكم الساحة الرئيسي", "حكم الساحة بالماتش", "sports"),
    ("noun", "árbitro asistente", "m", "B1", "حكم الراية المساعد (مراقب خط)", "حكم راية خط تماس", "sports"),
    ("noun", "fuera de juego", "m", "A2", "تسلل غير قانوني (أوفسايد)", "أوفسايد وتسلل كورة", "sports"),
    ("noun", "saque de esquina", "m", "A2", "ضربة ركنية (كورنر)", "ضربة ركنية وكورنر", "sports"),
    ("noun", "tiro penal", "m", "A2", "ركلة جزاء مباشرة (ضربة جزاء)", "ضربة جزاء وبنالتي", "sports"),
    ("noun", "tarjeta amarilla", "f", "A1", "بطاقة إنذار صفراء", "كارت أصفر إنذار", "sports"),
    ("noun", "tarjeta roja", "f", "A1", "بطاقة طرد حمراء من الملعب", "كارت أحمر طرد", "sports"),
    ("noun", "tiempo añadido", "m", "A2", "الوقت بدل الضائع في المباراة", "وقت بدل ضايع", "sports"),
    ("noun", "tanda de penaltis", "f", "B1", "ركلات الترجيح الحاسمة", "ضربات ترجيح بعد التعادل", "sports"),
    ("noun", "grada de aficionados", "f", "A2", "مدرجات المشجعين بالملعب", "مدرجات الجماهير", "sports"),
    ("noun", "banquillo de suplentes", "m", "A2", "دكة البدلاء والاحتياط", "دكة الاحتياطي للمدرب", "sports"),
    ("noun", "vestuario deportivo", "m", "A1", "غرفة تبديل الملابس للرياضيين", "غرفة لبس اللعيبة", "sports"),
    ("noun", "pitido final", "m", "A2", "صفارة النهاية لانتهاء اللقاء", "صفارة الحكم بنهاية الماتش", "sports"),
    ("noun", "regate", "m", "B1", "مراوغة وتجاوز للمدافع بالكرة", "ترقيصة ومراوغة حريفة", "sports"),
    ("noun", "remate de cabeza", "m", "A2", "ضربة رأسية متقنة نحو المرمى", "ضربة بالراس في الجول", "sports"),
    ("noun", "chilena", "f", "B2", "ضربة مقصية بهلوانية في الهواء", "ضربة مقص ودبل كيك بهلواني", "sports"),
    ("noun", "saque de banda", "m", "A2", "رمية تماس باليدين من الخط", "رمية تماس باليدين", "sports"),
    ("noun", "saque de puerta", "m", "A2", "ضربة مرمى من منطقة الحارس", "ضربة مرمى من خط الستة", "sports"),
    ("noun", "larguero", "m", "B1", "عارضة المرمى الأفقية العليا", "عارضة الجول العالية", "sports"),
    ("noun", "poste lateral", "m", "B1", "قائم المرمى العمودي", "قائم الجول الجانبي", "sports"),
    ("noun", "red de la portería", "f", "A1", "شباك المرمى الممزقة بالهدف", "شبكة الجول البيضا", "sports"),
    ("noun", "canasta de baloncesto", "f", "A1", "سلة كرة السلة مع الشباك", "باسكت وشبكة السلة", "sports"),
    ("noun", "tablero de baloncesto", "m", "A2", "لوح السلة الخلفي المستطيل", "لوح الباسكت الشفاف", "sports"),
    ("noun", "tiro libre", "m", "A2", "رمية حرة مباشرة دون اعتراض", "رمية حرة في السلة", "sports"),
    ("noun", "triple", "m", "A2", "رمية ثلاثية من خارج القوس", "رمية تلات نقاط من بعيد", "sports"),
    ("noun", "rebote ofensivo", "m", "B1", "التقاط الكرة المرتدة الهجومية", "ريبوند ومتابعة الكورة المرتدة", "sports"),
    ("noun", "tapón defensivo", "m", "B2", "صد وتصدي لكرة السلة في الهواء (بلوك)", "بلوك وتصدي للكورة بالسلة", "sports"),
    ("noun", "falta personal", "f", "A2", "خطأ شخصي ضد لاعب الخصم", "فاول وخطأ شخصي بالماتش", "sports"),

    # --- Racket Sports & Tennis (رياضات المضرب والتنس) ---
    ("noun", "raqueta de grafito", "f", "A2", "مضرب تنس مصنوع من الجرافيت", "مضرب تنس جرافيت خفيف", "sports"),
    ("noun", "red de tenis", "f", "A1", "شبكة التنس الفاصلة بين نصفي الملعب", "شبكة التنس في نص الملعب", "sports"),
    ("noun", "saque directo", "m", "B1", "إرسال ساحق مباشر لا يُرد (آيس)", "إرسال ساحق آيس بالتنس", "sports"),
    ("noun", "revés a dos manos", "m", "B1", "ضربة خلفية باليدين (باكهاند)", "ضربة خلفية باكهاند بالتنس", "sports"),
    ("noun", "derechazo", "m", "B1", "ضربة أمامية قوية باليد المفضلة", "فورهاند قوية باليمين", "sports"),
    ("noun", "volea en la red", "f", "B2", "ضربة طائرة قرب الشبكة قبل لمس الأرض", "فولي طائر عند الشبكة", "sports"),
    ("noun", "dejada sutil", "f", "B2", "كرة ساقطة قصيرة بمكر خلف الشبكة (دروب شوت)", "دروب شوت ساقطة ورا الشبكة", "sports"),
    ("noun", "globo defensivo", "m", "B2", "كرة ساقطة عالية فوق رأس الخصم (لوب)", "كرة عالية لوب من فوق الخصم", "sports"),
    ("noun", "pista de tierra batida", "f", "B1", "ملعب تنس ترابي من الصلصال الأحمر", "ملعب تنس تراب أحمر رولان جاروس", "sports"),
    ("noun", "punto de partido", "m", "A2", "نقطة حسم المباراة (ماتش بوينت)", "نقطة حسم الماتش ماتش بوينت", "sports"),
    ("noun", "desempate", "m", "B1", "شوط كسر التعادل الفاصل (تاي بريك)", "شوط فاصل تاي بريك لكسر التعادل", "sports"),
    ("noun", "juez de silla", "m", "B1", "حكم التنس الجالس على الكرسي العالي", "حكم كرسي التنس العالي", "sports"),
    ("noun", "recogepelotas", "m", "A2", "جامع الكرات السريع في الملعب", "ولد جامع الكرات بالملعب", "sports"),

    # --- Water & Swimming Sports (السباحة والرياضات المائية) ---
    ("noun", "estilo libre", "m", "A2", "سباحة حرة كراول", "عوم سباحة حرة كراول", "sports"),
    ("noun", "estilo braza", "m", "A2", "سباحة الصدر والضفدع", "عوم الصدر بالبسين", "sports"),
    ("noun", "estilo espalda", "m", "A2", "سباحة الظهر والطفو", "عوم ع الظهر في المية", "sports"),
    ("noun", "estilo mariposa", "m", "B1", "سباحة الفراشة القوية", "عوم فراشة للمحترفين", "sports"),
    ("noun", "trampolín de saltos", "m", "A2", "منصة القفز العالية إلى المسبح", "نطاطة ومنصة قفز عالي بالمسبح", "sports"),
    ("noun", "gorro de natación", "m", "A1", "قبعة سباحة سيليكون للشعر", "بونيه سباحة سيليكون للبسين", "sports"),
    ("noun", "gafas de buceo", "f", "A1", "نظارات غطس وسباحة مانعة للماء", "نظارة غطس وعوم للبحر", "sports"),
    ("noun", "piscina olímpica", "f", "A2", "مسبح أولمبي بطول خمسين متراً", "حمام سباحة أولمبي كبير", "sports"),
    ("noun", "socorrista acuático", "m", "A2", "منقذ سباحة وساهر على سلامة المسبح", "لايف جارد ومنقذ شاطئ", "services"),
    ("noun", "tabla de surf", "f", "A1", "لوح ركوب أمواج البحر الشاهقة", "بورد ركوب أمواج البحر", "sports"),
    ("noun", "traje de neopreno", "m", "B1", "بذلة غطس من النيوبرين العازل للبرودة", "بدلة غطس نيوبرين دافية", "sports"),
    ("noun", "piragüismo", "m", "B1", "رياضة التجديف بالكانو وقوارب الكاياك", "تجديف قوارب كاياك في النهر", "sports"),
    ("noun", "submarinismo", "m", "B1", "رياضة الغوص في الأعماق بأسطوانة الأكسجين", "غطس بالأنبوبة في أعماق البحر", "sports"),
    ("noun", "tubo de esnórquel", "m", "A2", "أنبوب تنفس سطحي لمشاهدة الأسماك", "قصبة تنفس سنوركل للسطح", "sports"),
    ("noun", "chaleco salvavidas", "m", "A1", "سترة نجاة برتقالية للسلامة البحرية", "لايف جاكيت وسترة نجاة", "tools"),

    # --- Winter & Mountain Sports (الرياضات الشتوية والجبلية) ---
    ("noun", "esquí alpino", "m", "A2", "تزلج المنحدرات الجبلية الوعرة", "تزلج جبال وتلج سريع", "sports"),
    ("noun", "esquí de fondo", "m", "B1", "تزلج المسافات الطويلة عبر السهول الثلجية", "تزلج مسافات طويلة في السهل", "sports"),
    ("noun", "tabla de snowboard", "f", "A2", "لوح تزلج أحادي على الثلوج", "بورد سنوبورد ع التلج", "sports"),
    ("noun", "trineo de nieve", "m", "A1", "مزلجة ثلجية للأطفال والمنحدرات", "مزلقة وزحليقة تلج", "sports"),
    ("noun", "pista de patinaje", "f", "A2", "حلبة تزلج جليدية مغطاة أو مفتوحة", "صالة تزلج ع الجليد", "sports"),
    ("noun", "patines de hielo", "m", "A2", "أحذية تزلج جليدية بنصل حاد", "شوز تزلج بسكاكين للجليد", "sports"),
    ("noun", "telesilla", "m", "A2", "تلفريك المقاعد المعلقة لصعود المتزلجين", "تليفريك كراسي لقمة الجبل", "transport"),
    ("noun", "bastón de esquí", "m", "A2", "عصا تزلج ثلجي لتوجيه التوازن", "عصاية تزلج لتثبيت الخطوة", "sports"),
    ("noun", "botas de nieve", "f", "A1", "حذاء شتوي ثقيل مانع للانزلاق", "بوت تلج شتوي تقيل ودافي", "shopping"),
    ("noun", "ropa térmica", "f", "A2", "ملابس حرارية داخلية عازلة للبرد", "هدوم داخلية حرارية للشتا", "shopping"),

    # --- Athletics & Running (ألعاب القوى والسباقات) ---
    ("noun", "carrera de velocidad", "f", "A2", "سباق السرعة القصير لمائة متر", "سباق سرعة مية متر جري", "sports"),
    ("noun", "carrera de vallas", "f", "B1", "سباق الحواجز والقفز السريع", "سباق حواجز وموانع جري", "sports"),
    ("noun", "salto de longitud", "m", "B1", "الوثب الطويل في حفرة الرمل", "وثب طويل في حفرة الرمل", "sports"),
    ("noun", "salto de altura", "m", "B1", "الوثب العالي فوق العارضة الأفقية", "وثب عالي من فوق العارضة", "sports"),
    ("noun", "salto con pértiga", "m", "B2", "القفز بالزانة المرنة لارتفاعات قياسية", "قفز بالزانة العالية", "sports"),
    ("noun", "lanzamiento de peso", "m", "B1", "دفع الجلة الحديدية الثقيلة", "رمي الجلة الحديدية التقيلة", "sports"),
    ("noun", "lanzamiento de jabalina", "m", "B1", "رمي الرمح المدبب لمسافات بعيدة", "رمي الرمح لمسافة بعيدة", "sports"),
    ("noun", "lanzamiento de disco", "m", "B1", "رمي القرص الدائري في الميدان", "رمي القرص في حلبة ألعاب القوى", "sports"),
    ("noun", "carrera de relevos", "f", "B1", "سباق التتابع بتبادل العصا", "سباق تتابع وتسليم العصاية", "sports"),
    ("noun", "testigo de relevo", "m", "B2", "عصا سباق التتابع الخشبية", "عصاية التتابع بين اللعيبة", "sports"),
    ("noun", "pista de tartán", "f", "B1", "مضمار سباق الجري المطاطي", "تراك جري أحمر مطاطي", "sports"),
    ("noun", "línea de meta", "f", "A1", "خط النهاية وشريط الفوز في السباق", "خط النهاية والفوز بالسباق", "sports"),
    ("noun", "cronómetro digital", "m", "A2", "ساعة إيقاف رقمية دقيقة للجري", "ستوب ووتش وساعة قياس ثواني", "tools"),

    # --- Cycling (ركوب الدراجات) ---
    ("noun", "bicicleta de montaña", "f", "A1", "دراجة جبلية ذات إطارات عريضة", "عجلة جبلية للمدقات الوعرة", "sports"),
    ("noun", "bicicleta de carretera", "f", "A2", "دراجة سباق خفيفة وسريعة للأسفلت", "عجلة سباق سرعة خفيفة", "sports"),
    ("noun", "casco de ciclista", "m", "A1", "خوذة دراجات واقية للرأس", "خوذة أمان لراكب العجلة", "tools"),
    ("noun", "maillot transpirable", "m", "B1", "قميص دراجين رياضي يمتص العرق", "فانلة سباق عجل بجيوب", "sports"),
    ("noun", "culotte acolchado", "m", "B2", "سروال دراجين مبطن لحماية المقعد", "شورت عجل مبطن ومريح", "sports"),
    ("noun", "cambio de marchas", "m", "A2", "مغير سرعات وتروس الدراجة", "فتيس وسرعات العجلة", "tools"),
    ("noun", "cadena engrasada", "f", "A2", "سلسلة دراجة مزيتة بانتظام", "جنزير عجلة مدهون شحم", "tools"),
    ("noun", "bomba de aire", "f", "A1", "منفاخ هواء يدوي لإطارات الدراجات", "منفاخ عجل يدوي للموتوسيكل", "tools"),
    ("noun", "pelotón ciclista", "m", "B1", "مجموعة المتسابقين الكبرى في الدراجات", "كتلة المتسابقين وطابور العجل", "sports"),
    ("noun", "etapa de montaña", "f", "B1", "مرحلة صعود جبلي شاقة في طواف الدراجات", "مرحلة جبلية صعبة في السباق", "sports"),

    # --- Martial Arts & Combat (الفنون القتالية والملاكمة) ---
    ("noun", "tatami acolchado", "m", "B1", "بساط الحلبة المرن للجودو والكاراتيه", "بساط حلبة التاتامي للجودو", "sports"),
    ("noun", "cuadrilátero", "m", "B1", "حلبة الملاكمة المربعة المحاطة بالحبال", "حلبة ملاكمة بحبالها الأربعة", "sports"),
    ("noun", "cinturón negro", "m", "A2", "الحزام الأسود لمرتبة الأستاذية في الدفاع", "حزام أسود أستاذ في الكاراتيه", "sports"),
    ("noun", "guantes de boxeo", "m", "A1", "قفازات ملاكمة جلدية مبطنة", "جوانتيات بوكس جلد للملاكمة", "sports"),
    ("noun", "protector bucal", "m", "A2", "واقي أسنان مطاطي للملاكمين", "واقي سنان للملاكمة والألعاب القتالية", "health"),
    ("noun", "saco de boxeo", "m", "A2", "كيس ملاكمة جلدي معلق للتدريب", "كيس رمل وتدريب بوكس معلق", "sports"),
    ("noun", "asalto de boxeo", "m", "B1", "جولة نزال مدتها ثلاث دقائق", "جولة ملاكمة تلات دقايق", "sports"),
    ("noun", "golpe de derecha", "m", "A2", "لكمة يمينية مباشرة وقوية (كروس)", "لكمة ولطشة يمين قوية", "sports"),

    # --- Gym, Fitness & Training (كمال الأجسام واللياقة البدنية) ---
    ("noun", "pesas de hierro", "f", "A1", "أثقال حديدية لتمارين العضلات", "أوزان وحديد للجيم", "sports"),
    ("noun", "mancuernas ajustables", "f", "A2", "أثقال يد فردية قابلة للوزن (دمبلز)", "دمبلز يد للتدريب", "sports"),
    ("noun", "barra de dominadas", "f", "A2", "قضيب حديدي لتمارين العقلة ورفع الجسم", "عقلة حيطة لرفع الجسم", "sports"),
    ("noun", "banco de pesas", "m", "A2", "مقعد رفع الأثقال للصدر والذراعين", "دكة بنش رفع حديد", "sports"),
    ("noun", "cinta de correr", "f", "A2", "جهاز مشي وجري كهربائي بالصالات (تريدميل)", "مشاية كهربائية للجري بالجيم", "sports"),
    ("noun", "bicicleta estática", "f", "A1", "دراجة تمارين رياضية ثابتة بالمنزل", "عجلة ثابتة للتخسيس بالبيت", "sports"),
    ("noun", "máquina elíptica", "f", "A2", "جهاز تدريب بيضاوي هوائي شامل", "مشاية إلبنيكال بيضاوية للتخسيس", "sports"),
    ("noun", "máquina de remo", "f", "B1", "جهاز محاكاة التجديف المائي لتقوية الظهر", "مكنة تجديف للجيم وكارديو", "sports"),
    ("noun", "colchoneta de yoga", "f", "A1", "سجادة تمارين يوجا مرنة ومانعة للانزلاق", "مات يوجا وتمارين أرضية", "sports"),
    ("noun", "flexiones de brazos", "f", "A2", "تمارين الضغط على الأرض لتقوية الصدر", "تمرين ضغط بالأرض", "sports"),
    ("noun", "sentadillas profundas", "f", "A2", "تمارين القرفصاء لتقوية عضلات الساقين", "تمرين سكوات ورجلين بالجيم", "sports"),
    ("noun", "abdominales", "m", "A1", "تمارين عضلات البطن وشد القوام", "تمارين شد بطن وستة باكس", "sports"),
    ("noun", "estiramiento muscular", "m", "A2", "تمارين إطالة العضلات والمرونة بعد الجهد", "إطالة واسترتشات عضلات", "sports"),
    ("noun", "calentamiento previo", "m", "A2", "تمارين إحماء وتسخين قبل البدء باللعب", "تسخين وإحماء قبل الماتش", "sports"),
    ("noun", "entrenador personal", "m", "A2", "مدرب لياقة بدنية خاص وتأهيل رياضي", "مدرب جيم شخصي بي تي", "work"),
    ("noun", "rutina de ejercicios", "f", "A2", "جدول تمارين أسبوعي منظم", "جدول تمارين وروتين أسبوعي", "sports"),
    ("noun", "repetición", "f", "A2", "تكرار حركة التمرين الرياضي", "عدة وتكرار في التمرين", "sports"),
    ("noun", "serie de ejercicios", "f", "A2", "مجموعة حركات متتالية من التمارين", "مجموعة وسيت تمارين ورا بعض", "sports"),

    # --- Chess, Board Games & Hobbies (الشطرنج وألعاب الطاولة والهوايات) ---
    ("noun", "tablero de ajedrez", "m", "A1", "رقعة شطرنج خشبية بالأبيض والأسود", "رقعة شطرنج خشب بمربعاتها", "sports"),
    ("noun", "peón de madera", "m", "A2", "بيدق شطرنج وجندي الخط الأمامي", "عسكري شطرنج وبيدق", "sports"),
    ("noun", "torre de marfil", "f", "A2", "قلعة الشطرنج الحصينة في الزوايا (طابية)", "طابية ورخ الشطرنج في الزاوية", "sports"),
    ("noun", "caballo saltador", "m", "A2", "حصان الشطرنج الذي يقفز بحرف L", "حصان شطرنج بينط بحرف إل", "sports"),
    ("noun", "alfil diagonal", "m", "A2", "فيل الشطرنج الذي يتحرك قطرياً", "فيل شطرنج بيمشي بالورب", "sports"),
    ("noun", "reina poderosa", "f", "A1", "وزير الشطرنج والملكة متعددة الاتجاهات", "وزير وملكة الشطرنج الحرة", "sports"),
    ("noun", "rey protegido", "m", "A1", "ملك الشطرنج المحمي من الخصم", "ملك شطرنج محمي ومتحصن", "sports"),
    ("noun", "jaque mate", "m", "A2", "كش ملك وإعلان الفوز النهائي في الجولة", "كش ملك وفوز نهائي بالدور", "sports"),
    ("noun", "fichas de dominó", "f", "A2", "قطع الدومينو المرقطة بالأرقام", "حجارة دومينو منقطة بأرقام", "sports"),
    ("noun", "mesa de billar", "f", "A2", "طاولة بلياردو مكسوة بالجوخ الأخضر", "تربيزة بلياردو بجوخ أخضر", "sports"),
    ("noun", "taco de billar", "m", "A2", "عصا بلياردو خشبية مستقيمة ودقيقة", "عصاية بلياردو خشب مستقيمة", "sports"),
    ("noun", "diana de dardos", "f", "A2", "لوحة رمي السهام الدائرية المقسمة", "لوحة دارتس وسهام للتصويب", "sports"),
    ("noun", "crucigrama dominical", "m", "A2", "شبكة كلمات متقاطعة في الصحيفة", "كلمات متقاطعة مسلية بالجورنال", "study"),
    ("noun", "puzle de mil piezas", "m", "A2", "أحجية صور مقطعة لتركيب المعالم", "بازل تركيب ألف قطعة صورة", "arts"),
    ("noun", "mando de videoconsola", "m", "A1", "ذراع تحكم بألعاب الفيديو اللاسلكي", "دراع بلايستيشن وايرلس", "tools"),

    # --- Sports Verbs (أفعال الرياضة واللياقة) ---
    ("verb", "entrenar", "ar", "A1", "تدرب وتمرن يومياً للحفاظ على اللياقة", "اتمرن وتدرب كل يوم عشان يحافظ ع صحته", "sports"),
    ("verb", "calentar", "e-ie", "A2", "أحمى وسخن العضلات قبل بدء النزال", "سخن العضلات قبل الماتش", "sports"),
    ("verb", "estirar", "ar", "A2", "مدد عضلات الساقين لتفادي التشنج", "عمل استرتشات للرجلين لمنع الشد العضلي", "sports"),
    ("verb", "fichar", "ar", "B1", "تعاقد وضم لاعباً محترفاً جديداً", "مضى وتعاقد مع لاعب محترف جديد", "sports"),
    ("verb", "rematar", "ar", "A2", "سدد الكرة بقوة نحو الشباك بالمرمى", "شاط الكرة في الجول برجليه", "sports"),
    ("verb", "regatear", "ar", "A2", "راوغ المدافع بمهارة وبراعة لافتة", "رقص المدافع وعدى منه بحرفنة", "sports"),
    ("verb", "cabecear", "ar", "A2", "ضرب الكرة برأسه ببراعة وهدف", "نط وضرب الكرة براسه في الشباك", "sports"),
    ("verb", "despejar", "ar", "A2", "شتت الكرة وأبعد الخطر عن المرمى", "شتت الكورة وطلعها برة المنطقة", "sports"),
    ("verb", "arbitrar", "ar", "B1", "قاد المباراة وحكّم بنزاهة بين الفريقين", "حكّم الماتش بأمانة بين الفرقتين", "sports"),
    ("verb", "empatar", "ar", "A2", "تعادل الفريقان بنتيجة إيجابية", "اتعادلت الفرقتين بنفس الأهداف", "sports"),
    ("verb", "clasificar", "ar", "A2", "تأهل للدور النهائي من البطولة", "صعد وتأهل للدور النهائي من الكاس", "sports"),
    ("verb", "eliminar", "ar", "A2", "أقصى وأخرج الخصم من المنافسة", "أقصى وخرج المنافس برة البطولة", "sports"),
    ("verb", "descender", "e-ie", "B1", "هبط الفريق إلى دوري الدرجة الثانية", "نزل وهبط النادي لدوري المظاليم", "sports"),
    ("verb", "ascender", "e-ie", "B1", "صعد وتأهل إلى دوري الأضواء الممتاز", "صعد للدرجة الأولى والممتاز", "sports"),
    ("verb", "revalidar", "ar", "B2", "حافظ على لقبه وتوج بالبطولة ثانية", "حافظ على كاس البطولة وفاز تاني", "sports"),
]

def main():
    existing = get_existing_norms(exclude_slugs={"cv-topic-sports-leisure"})
    entries = []
    skipped = 0
    rank = 1

    for row in ITEMS:
        kind = row[0]
        headword = row[1]
        norm = norm_vocab(headword)
        if norm in existing:
            skipped += 1
            continue

        if kind == "noun":
            gender = row[2]
            level = row[3]
            msa = row[4]
            eg = row[5]
            domain = row[6]
            art = "El" if gender == "m" else "La"
            ex_es = f"{art} {headword} resulta muy popular entre los deportistas."
            ex_ar = f"يحظى الـ{msa} بشعبية واسعة بين الرياضيين."
            entry = make_noun(headword, gender, level, msa, eg, ex_es, ex_ar, domain=domain, rank=rank)
        elif kind == "verb":
            paradigm = row[2]
            level = row[3]
            msa = row[4]
            eg = row[5]
            domain = row[6]
            ex_es = f"Los atletas suelen {headword} con disciplina en los entrenamientos."
            ex_ar = f"يعتاد الرياضيون أن {msa} بانضباط كبير في التدريبات."
            entry = make_verb(headword, paradigm, level, msa, eg, ex_es, ex_ar, domain=domain, rank=rank)
        else:
            continue

        entries.append(entry)
        existing.add(norm)
        rank += 1

    print(f"Sports & Leisure: Prepared {len(entries)} new entries (skipped {skipped} existing).")
    emit_bundle("vocab-cv-topic-sports-leisure.json", "cv-topic-sports-leisure", "الرياضة والأنشطة الترفيهية واللياقة والبدنية", entries)

if __name__ == "__main__":
    main()
