# -*- coding: utf-8 -*-
"""
build_thematic_tech_media.py — حزمة التكنولوجيا والمعلوماتية والإعلام الرقمي (500 مدخل)
"""
import sys
import os

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from builder_engine import (
    make_noun, make_verb, make_adj, make_adv, make_expr,
    emit_bundle, get_existing_norms, norm_vocab
)

ITEMS = [
    # --- Hardware & Devices (الأجهزة والعتاد) ---
    ("noun", "servidor", "m", "A2", "خادم حاسوبي مركزي / سيرفر", "سيرفر كمبيوتر", "science"),
    ("noun", "procesador", "m", "A2", "معالج البيانات / بروسيسور", "بروسيسور ومعالج", "science"),
    ("noun", "microprocesador", "m", "B1", "معالج دقيق", "معالج دقيق بالكمبيوتر", "science"),
    ("noun", "disco duro", "m", "A2", "قرص صلب لتخزين البيانات", "هارد ديسك تخزين", "science"),
    ("noun", "memoria ram", "f", "A2", "ذاكرة الوصول العشوائي (رام)", "رامات الكمبيوتر", "science"),
    ("noun", "placa base", "f", "B1", "اللوحة الأم للحاسوب (ماذربورد)", "ماذربورد الكمبيوتر", "science"),
    ("noun", "tarjeta gráfica", "f", "A2", "بطاقة الرسوميات (كارت شاشة)", "كارت شاشة ألعاب", "science"),
    ("noun", "tarjeta de red", "f", "B1", "بطاقة الشبكة السلكية", "كارت نت وشبكة", "science"),
    ("noun", "tarjeta de sonido", "f", "B1", "بطاقة الصوت", "كارت صوت وسماعات", "science"),
    ("noun", "fuente de alimentación", "f", "B1", "وحدة التغذية بالطاقة الكهربائية", "باور سبلاي", "tools"),
    ("noun", "ventilador", "m", "A2", "مروحة تبريد الحاسوب", "مروحة تبريد كيسة", "tools"),
    ("noun", "disipador", "m", "B2", "مشتت حراري للمعالج", "مشتت حرارة", "tools"),
    ("noun", "ranura", "f", "B1", "منفذ أو شق إدخال البطاقات", "مكان إدخال الكارت وسلوت", "tools"),
    ("noun", "puerto usb", "m", "A1", "منفذ يو إس بي", "مدخل يو إس بي", "tools"),
    ("noun", "cable de red", "m", "A2", "كابل شبكة الإنترنت", "سلك نت إيثرنت", "tools"),
    ("noun", "fibra óptica", "f", "A2", "ألياف بصرية فائقة السرعة", "فايبر نت سريع", "science"),
    ("noun", "enrutador", "m", "A2", "موجه الإنترنت (راوتر)", "راوتر نت", "science"),
    ("noun", "módem", "m", "A2", "مودم اتصال", "مودم نت", "science"),
    ("noun", "conmutador", "m", "B2", "موزع شبكة (سويتش)", "سويتش شبكة", "tools"),
    ("noun", "repetidor", "m", "B1", "مقوي إشارة الواي فاي", "مقوي شبكة واي فاي", "science"),
    ("noun", "antena wifi", "f", "A2", "هوائي استقبال الواي فاي", "إريال واي فاي", "tools"),
    ("noun", "periférico", "m", "B1", "جهاز ملحق طرفي بالحاسوب", "جهاز ملحق بالكمبيوتر", "tools"),
    ("noun", "teclado numérico", "m", "A2", "لوحة الأرقام المنفصلة", "كيبورد أرقام", "tools"),
    ("noun", "ratón inalámbrico", "m", "A1", "فأرة لاسلكية", "ماوس وايرلس", "tools"),
    ("noun", "alfombrilla", "f", "A2", "وسادة الفأرة (ماوس باد)", "ماوس باد للتربيزة", "tools"),
    ("noun", "monitor curvo", "m", "A2", "شاشة عرض منحنية", "شاشة كمبيوتر كيرف", "science"),
    ("noun", "pantalla táctil", "f", "A2", "شاشة لمس ذكية", "شاشة تاتش", "science"),
    ("noun", "altavoces", "m", "A2", "سماعات مكبرة للصوت", "سماعات كمبيوتر", "tools"),
    ("noun", "auriculares con micrófono", "m", "A2", "سماعات رأس مع مايكروفون", "هيدست بالمايك", "tools"),
    ("noun", "micrófono de solapa", "m", "B1", "ميكروفون ياقة لاسلكي", "مايك ياقة صغير", "tools"),
    ("noun", "cámara web", "f", "A1", "كاميرا ويب للمحادثات", "كاميرا كمبيوتر", "science"),
    ("noun", "escáner plano", "m", "A2", "ماسح ضوئي مسطح", "سكانر ورق", "tools"),
    ("noun", "impresora láser", "f", "A2", "طابعة ليزرية سريعة", "برنتر ليزر", "tools"),
    ("noun", "impresora 3d", "f", "B1", "طابعة ثلاثية الأبعاد", "برنتر مجسمات تلاتة د", "science"),
    ("noun", "tóner", "m", "A2", "خرطوشة حبر ليزري", "حبارة برنتر", "tools"),
    ("noun", "cartucho de tinta", "m", "A2", "خرطوشة حبر سائل", "خرطوشة حبر ألوان", "tools"),
    ("noun", "disco duro externo", "m", "A2", "قرص صلب خارجي متنقل", "هارد خارجي متنقل", "science"),
    ("noun", "memoria usb", "f", "A1", "ذاكرة وميضية (فلاش ميموري)", "فلاشة كمبيوتر", "science"),
    ("noun", "tarjeta micro sd", "f", "A2", "بطاقة ذاكرة صغيرة للموبايل", "كارت ميموري صغير", "science"),
    ("noun", "lector de tarjetas", "m", "A2", "قارئ بطاقات الذاكرة", "ريدر كروت ميموري", "tools"),
    ("noun", "lector de código de barras", "m", "B1", "قارئ الباركود الضوئي", "سكانر باركود كاشير", "tools"),
    ("noun", "lector de huellas", "m", "B1", "قارئ بصمات الأصابع الحيوي", "جهاز بصمة صوابع", "science"),
    ("noun", "tableta gráfica", "f", "B1", "لوح رسم رقمي للمصممين", "تابلت رسم ديجيتال", "arts"),
    ("noun", "lápiz óptico", "m", "B1", "قلم لمس ذكي للشاشات", "قلم تاتش للشاشة", "tools"),
    ("noun", "proyector digital", "m", "A2", "جهاز عرض رقمي (داتاشو)", "داتاشو وبروجيكتور", "tools"),
    ("noun", "sistema de alimentación ininterrumpida", "m", "B2", "جهاز حفظ الطاقة عند انقطاع التيار (UPS)", "يو بي إس بطارية كهربا", "tools"),
    ("noun", "estación de trabajo", "f", "B1", "محطة عمل حاسوبية قوية", "ورك ستيشن قوي", "work"),
    ("noun", "servidor blade", "m", "B2", "خادم نصلي عالي الكثافة", "سيرفر بليد رفيع", "science"),
    ("noun", "armario rack", "m", "B2", "خزانة رفوف الخوادم والشبكات", "راك سيرفرات وشبكات", "tools"),
    ("noun", "conmutador kvm", "m", "C1", "مفتاح تحكم متعدد للحواسيب", "سويتش شاشات وماوسات", "tools"),

    # --- Software, Systems & Programming (البرمجيات والأنظمة) ---
    ("noun", "sistema operativo", "m", "A2", "نظام تشغيل الحاسوب", "نظام تشغيل ويندوز ولينكس", "science"),
    ("noun", "código fuente", "m", "B1", "الشفرة المصدرية للبرنامج", "كود السورس بتاع البرنامج", "science"),
    ("noun", "lenguaje de programación", "m", "A2", "لغة البرمجة", "لغة برمجة", "science"),
    ("noun", "compilador", "m", "B2", "مترجم لغة البرمجة (كومبايلر)", "مترجم أكواد كومبايلر", "science"),
    ("noun", "intérprete", "m", "B2", "مفسر الأكواد البرمجية", "مفسر الأكواد سطر بسطر", "science"),
    ("noun", "entorno de desarrollo", "m", "B1", "بيئة التطوير المتكاملة (IDE)", "برنامج كتابة الأكواد والبرمجة", "science"),
    ("noun", "depurador", "m", "B2", "مصحح الأخطاء البرمجية (ديباغر)", "برنامج تتبع الأخطاء ديباغر", "science"),
    ("noun", "control de versiones", "m", "B2", "نظام إدارة إصدارات الكود (Git)", "نظام تتبع تعديلات الكود", "science"),
    ("noun", "repositorio", "m", "B1", "مستودع الأكواد البرمجية", "مستودع أكواد ع النت", "science"),
    ("noun", "bifurcación", "f", "B2", "تفريعة برمجية من الكود (Fork)", "تفريعة من الكود", "science"),
    ("noun", "fusión de ramas", "f", "B2", "دمج الفروع البرمجية (Merge)", "دمج فروع الكود سوا", "science"),
    ("noun", "confirmación de cambios", "f", "B2", "تثبيت التعديلات البرمجية (Commit)", "تسجيل التعديلات وتثبيتها", "science"),
    ("noun", "base de datos", "f", "A2", "قاعدة بيانات منظمة", "قاعدة بيانات داتابيز", "science"),
    ("noun", "tabla relacional", "f", "B1", "جدول علائقي في قاعدة البيانات", "جدول بيانات مربوط بجداول", "science"),
    ("noun", "consulta sql", "f", "B1", "استعلام لقاعدة البيانات", "أمر بحث واستعلام داتابيز", "science"),
    ("noun", "índice de búsqueda", "m", "B1", "فهرس تسريع البحث في البيانات", "فهرس بحث سريع", "science"),
    ("noun", "clave primaria", "f", "B2", "المفتاح الأساسي للجدول", "المفتاح الرئيسي بالجدول", "science"),
    ("noun", "clave foránea", "f", "B2", "المفتاح الأجنبي المرتبط", "مفتاح رابط بين جدولين", "science"),
    ("noun", "migración de datos", "f", "B2", "ترحيل ونقل البيانات للنظام الجديد", "نقل الداتابيز لسيرفر جديد", "science"),
    ("noun", "copia de seguridad", "f", "A2", "نسخة احتياطية من الملفات (باك آب)", "نسخة احتياطية باك آب", "science"),
    ("noun", "restauración", "f", "B1", "استعادة البيانات المحفوظة", "ترجيع النسخة الاحتياطية", "science"),
    ("noun", "interfaz de usuario", "f", "B1", "واجهة المستخدم الرسومية", "شاشة وشكل واجهة البرنامج", "science"),
    ("noun", "experiencia de usuario", "f", "B2", "تجربة المستخدم وسهولة الاستخدام", "سهولة استخدام الموقع للزبون", "science"),
    ("noun", "algoritmo genético", "m", "B2", "خوارزمية جينية حاسوبية", "خوارزمية تطورية ذكية", "science"),
    ("noun", "aprendizaje automático", "m", "B2", "التعلم الآلي (ماشين ليرنينغ)", "تعلم الآلة والذكاء الاصطناعي", "science"),
    ("noun", "red neuronal", "f", "B2", "شبكة عصبية اصطناعية", "شبكة عصبية ذكية", "science"),
    ("noun", "modelo de lenguaje", "m", "B2", "نموذج لغوي اصطناعي كبير", "نموذج لغوي للذكاء الاصطناعي", "science"),
    ("noun", "visión artificial", "f", "B2", "الرؤية الحاسوبية ومعالجة الصور", "رؤية الكمبيوتر وتحليل الصور", "science"),
    ("noun", "procesamiento de lenguaje natural", "m", "C1", "معالجة اللغات الطبيعية حاسوبياً", "فهم الكمبيوتر للغة البشر", "science"),
    ("noun", "reconocimiento de voz", "m", "B1", "التعرف الصوتي على الكلام", "تحويل الصوت لكتابة بالكمبيوتر", "science"),
    ("noun", "síntesis de voz", "f", "B1", "توليد النطق الاصطناعي", "نطق الكلام بالصوت الاصطناعي", "science"),
    ("noun", "criptografía", "f", "B2", "علم التشفير وحماية البيانات", "علم تشفير البيانات والسرية", "science"),
    ("noun", "clave simétrica", "f", "C1", "مفتاح تشفير متماثل", "مفتاح تشفير موحد", "science"),
    ("noun", "clave asimétrica", "f", "C1", "مفتاح تشفير غير متماثل", "مفتاح تشفير عام وخاص", "science"),
    ("noun", "certificado digital", "m", "B1", "شهادة رقمية لإثبات الهوية", "شهادة إلكترونية معتمدة", "society"),
    ("noun", "firma electrónica", "f", "B1", "توقيع إلكتروني رسمي معتمد", "توقيع ديجيتال معتمد", "society"),
    ("noun", "cortafuegos", "m", "A2", "جدار حماية الشبكة (فايروول)", "جدار حماية فايروول للنت", "science"),
    ("noun", "antivirus", "m", "A1", "برنامج مكافحة الفيروسات", "برنامج أنتي فيروس", "science"),
    ("noun", "software espía", "m", "B1", "برنامج تجسس وخبيث (سباي وير)", "برامج تجسس خبيثة", "science"),
    ("noun", "código malicioso", "m", "B2", "برمجيات خبيثة وفيروسات (مالوير)", "أكواد خبيثة بتخرب النظام", "science"),
    ("noun", "secuestro de datos", "m", "B2", "برمجية فدية خبيثة (رانسوم وير)", "برنامج فدية وتشفير ملفات", "science"),
    ("noun", "suplantación de identidad", "f", "B2", "تصيد احتيالي للهوية (فيشينغ)", "نصب وسرقة حسابات بصفحة وهمية", "society"),
    ("noun", "vulnerabilidad", "f", "B2", "ثغرة أمنية في النظام البرمجي", "ثغرة أمنية في السيستم", "science"),
    ("noun", "parche de seguridad", "m", "B1", "رقعة وتحديث أمني لسد الثغرات", "تحديث وترقيع للثغرات", "science"),
    ("noun", "auditoría de seguridad", "f", "B2", "تدقيق واختبار أمني للأنظمة", "فحص واختبار أمان الشبكة", "work"),
    ("noun", "prueba de penetración", "f", "C1", "اختبار اختراق أخلاقي للمواقع", "اختبار اختراق هاكر أخلاقي", "science"),
    ("noun", "computación en la nube", "f", "B1", "الحوسبة السحابية عبر الإنترنت", "حوسبة كلاود ع السحاب", "science"),
    ("noun", "máquina virtual", "f", "B1", "حاسوب افتراضي داخل الخادم", "جهاز وهمي جوة السيرفر", "science"),
    ("noun", "contenedor digital", "m", "B2", "حاوية برمجية مستقلة (دوكر)", "حاوية برمجية دوكر", "science"),
    ("noun", "orquestación de contenedores", "f", "C1", "إدارة وتنسيق الحاويات (كوبرنيتس)", "إدارة السيرفرات السحابية", "science"),

    # --- Internet, Web & Social Media (الإنترنت والويب والتواصل) ---
    ("noun", "navegador web", "m", "A1", "متصفح الويب والإنترنت", "متصفح النت زي كروم", "science"),
    ("noun", "motor de búsqueda", "m", "A1", "محرك بحث إلكتروني (جوجل)", "محرك بحث جوجل", "science"),
    ("noun", "marcador", "m", "A2", "إشارة مرجعية لحفظ المواقع", "حفظ الصفحة في المفضلة", "tools"),
    ("noun", "pestaña", "f", "A1", "علامة تبويب في المتصفح", "تابة وصفحة في المتصفح", "tools"),
    ("noun", "historial de navegación", "m", "A2", "سجل التصفح والمواقع السابقة", "تاريخ وسجل التصفح", "daily"),
    ("noun", "galleta informática", "f", "B1", "ملف تعريف الارتباط (كوكيز)", "ملف كوكيز بالمتصفح", "science"),
    ("noun", "dirección ip", "f", "A2", "عنوان بروتوكول الإنترنت (آي بي)", "رقم وعنوان الآي بي", "science"),
    ("noun", "nombre de dominio", "m", "A2", "اسم نطاق الموقع الإلكتروني", "اسم ورابط الدومين", "science"),
    ("noun", "alojamiento web", "m", "B1", "استضافة مواقع الإنترنت (هوستينغ)", "استضافة وحجز سيرفر للموقع", "work"),
    ("noun", "comercio electrónico", "m", "A2", "التجارة الإلكترونية والبيع أونلاين", "شرا وبيع أونلاين ع النت", "shopping"),
    ("noun", "pasarela de pago", "f", "B1", "بوابة الدفع الإلكتروني بالبطاقة", "بوابة دفع بالفيزا أونلاين", "shopping"),
    ("noun", "carrito de compras", "m", "A1", "سلة المشتريات الافتراضية", "سلة الشراء في الموقع", "shopping"),
    ("noun", "correo no deseado", "m", "A1", "رسائل البريد المزعج (سبام)", "رسائل إعلانات وزبالة سبام", "daily"),
    ("noun", "bandeja de entrada", "f", "A1", "صندوق الوارد للرسائل", "صندوق الرسايل الواردة", "daily"),
    ("noun", "archivo adjunto", "m", "A1", "ملف مرفق بالبريد الإلكتروني", "ملف ملحق بالإيميل", "work"),
    ("noun", "red social", "f", "A1", "شبكة تواصل اجتماعي", "موقع تواصل وسوشيال ميديا", "social"),
    ("noun", "perfil público", "m", "A1", "الملف الشخصي العام للحساب", "بروفايل الحساب قدام الناس", "social"),
    ("noun", "foto de portada", "f", "A2", "صورة الغلاف للحساب", "صورة كفر البروفايل", "arts"),
    ("noun", "publicación", "f", "A1", "منشور أو تدوينة في الموقع", "بوست ومنشور ع النت", "social"),
    ("noun", "etiqueta temática", "f", "A2", "وسم الموضوع (هاشتاج)", "هاشتاج الكلمات", "social"),
    ("noun", "transmisión en directo", "f", "A2", "بث مباشر حي بالفيديو", "لايف وبث مباشر", "arts"),
    ("noun", "hilo de discusión", "m", "A2", "سلسلة تعليقات ونقاش (ثريد)", "سلسلة تويتات أو تعليقات", "social"),
    ("noun", "notificación emergente", "f", "A2", "إشعار منبثق على الشاشة", "إشعار طالع ع شاشة الموبايل", "daily"),
    ("noun", "mensajería instantánea", "f", "A1", "تطبيق المراسلة الفورية كواتساب", "شات ورسايل فورية", "social"),
    ("noun", "videollamada grupal", "f", "A1", "مكالمة فيديو جماعية للمؤتمرات", "مكالمة فيديو مع كذا واحد", "social"),
    ("noun", "sala de chat", "f", "A2", "غرفة محادثة نصية", "روم شات للمحادثة", "social"),
    ("noun", "emoticono", "m", "A1", "رمز تعبيري مبتسم (إيموجي)", "إيموجي ورمز تعبيري", "social"),
    ("noun", "pegatina digital", "f", "A2", "ملصق رقمي للمحادثات (ستيكر)", "ستيكر شات مضحك", "social"),
    ("noun", "seguidor", "m", "A1", "متابع ومحب للحساب الرقمي", "فولوور ومتابع ع الحساب", "social"),
    ("noun", "creador de contenido", "m", "A2", "صانع محتوى رقمي ومرئي", "صانع محتوى وفيديوهات", "arts"),
    ("noun", "suscriptor", "m", "A2", "مشترك في القناة أو المنصة", "مشترك في القناة", "arts"),
    ("noun", "canal de difusión", "m", "B1", "قناة بث وتوزيع الأخبار", "قناة تلجرام أو واتس للأخبار", "society"),
    ("noun", "algoritmo de recomendación", "m", "B2", "خوارزمية اقتراح المحتوى المفيد", "خوارزمية اقتراح الفيديوهات", "science"),
    ("noun", "viralidad", "f", "B2", "انتشار فيروسي واسع للمقطع", "انتشار واسع وترند للمقطع", "arts"),
    ("noun", "audiolibro", "m", "A2", "كتاب مسموع مسجل بصوت بشري", "كتاب صوتي مسموع", "arts"),
    ("noun", "podcast", "m", "A1", "تدوين صوتي إذاعي (بودكاست)", "بودكاست صوتي في النت", "arts"),
    ("noun", "episodio", "m", "A1", "حلقة من المسلسل أو البودكاست", "حلقة مسلسل أو تسجيل", "arts"),
    ("noun", "plataforma de streaming", "f", "A1", "منصة بث أفلام ومسلسلات", "منصة بث أفلام ومسلسلات", "arts"),
    ("noun", "suscripción mensual", "f", "A2", "اشتراك شهري في الخدمة الرقمية", "اشتراك شهري بالنت والمنصة", "shopping"),
    ("noun", "descarga digital", "f", "A1", "تنزيل رقمي للملف على الجهاز", "تحميل وتنزيل الملف", "daily"),

    # --- Telecommunications & Mobile (الاتصالات والهواتف) ---
    ("noun", "teléfono inteligente", "m", "A1", "هاتف ذكي متعدد الوظائف", "موبايل سمارت حديث", "tools"),
    ("noun", "cobertura móvil", "f", "A2", "تغطية شبكة الهاتف المحمول", "شبكة وإرسال الموبايل", "services"),
    ("noun", "tarjeta sim", "f", "A1", "شريحة الاتصال الهاتفي (خط)", "شريحة خط الموبايل", "tools"),
    ("noun", "tarjeta esim", "f", "B1", "شريحة إلكترونية مدمجة بالهاتف", "شريحة موبايل إلكترونية مدمجة", "tools"),
    ("noun", "itinerancia de datos", "f", "B1", "تجوال البيانات الدولي في السفر", "رومينج وتجوال دولي للنت", "travel"),
    ("noun", "saldo prepago", "m", "A2", "رصيد مسبق الدفع للهاتف", "رصيد كارت شحن", "shopping"),
    ("noun", "tarifa plana", "f", "A2", "باقة إنترنت غير محدودة بسعر ثابت", "باقة نت ثابتة وغير محدودة", "shopping"),
    ("noun", "llamada perdida", "f", "A1", "مكالمة هاتفية فائتة لم يُرد عليها", "ميسد كول ومكالمة لم يرد عليها", "daily"),
    ("noun", "buzón de voz", "m", "A2", "البريد الصوتي لتسجيل الرسائل", "بريد صوتي لتسجيل الكلام", "services"),
    ("noun", "tono de llamada", "m", "A1", "نغمة رنين الهاتف الصادرة", "رنة ونغمة الموبايل", "daily"),
    ("noun", "modo avión", "m", "A1", "وضع الطيران المعطل للشبكات", "وضع الطيران بالموبايل", "travel"),
    ("noun", "modo silencioso", "m", "A1", "الوضع الصامت بدون رنين", "الوضع الصامت للموبايل", "daily"),
    ("noun", "vibración", "f", "A2", "اهتزاز الهاتف عند الاتصال", "هزاز ورعشة الموبايل", "daily"),
    ("noun", "batería de litio", "f", "A2", "بطارية ليثيوم قابلة للشحن", "بطارية ليثيوم شحن", "tools"),
    ("noun", "cargador rápido", "m", "A1", "شاحن هاتف فائق السرعة", "شاحن سريع للموبايل", "tools"),
    ("noun", "batería externa", "f", "A1", "شاحن متنقل ومصرف طاقة (باوربانك)", "باوربانك شحن متنقل", "tools"),
    ("noun", "funda protectora", "f", "A1", "جراب حماية للهاتف المحمول", "جراب وكفر حماية للموبايل", "shopping"),
    ("noun", "protector de pantalla", "m", "A1", "لاصقة زجاجية لحماية الشاشة (سكرينة)", "سكرينة حماية شاشة", "shopping"),
    ("noun", "sensor de proximidad", "m", "B2", "مستشعر التقارب لإغلاق الشاشة", "حساس قرب الموبايل من الودن", "science"),
    ("noun", "giroscopio", "m", "B2", "جهاز جيروسكوب لتحديد الاتجاه", "حساس تدوير الشاشة جيروسكوب", "science"),

    # --- Tech Verbs (أفعال التكنولوجيا والبرمجة) ---
    ("verb", "programar", "ar", "A2", "برمج وكتب شفرات التطبيق", "برمج وكتب كود البرنامج", "science"),
    ("verb", "compilar", "ar", "B2", "ترجم الكود البرمجي للغة الآلة", "حول الكود لملف تنفيذي", "science"),
    ("verb", "depurar", "ar", "B2", "نقّى وفحص الأكواد من الأخطاء", "صلح أخطاء الكود ديباجينج", "science"),
    ("verb", "codificar", "ar", "B1", "شفّر البيانات أو كتب الأكواد", "شفر الكلام وكتب كود", "science"),
    ("verb", "desencriptar", "ar", "B2", "فك التشفير المعقد للملف", "فك التشفير وقرأ الملف", "science"),
    ("verb", "encriptar", "ar", "B2", "شفّر البيانات بكلمة سر قوية", "شفر البيانات بكلمة سر", "science"),
    ("verb", "instalar", "ar", "A1", "ثبّت البرنامج أو الجهاز بالمنزل", "سطب ونزل البرنامج ع الجهاز", "tools"),
    ("verb", "desinstalar", "ar", "A2", "حذف وأزال التطبيق من النظام", "مسح وشال البرنامج من السيستم", "tools"),
    ("verb", "actualizar", "ar", "A2", "حدّث النظام إلى أحدث إصدار", "حدث البرنامج لآخر فيرجن", "tools"),
    ("verb", "reiniciar", "ar", "A1", "أعاد تشغيل الحاسوب بالكامل", "عمل ريستارت وقفل وشغل", "daily"),
    ("verb", "formatear", "ar", "B1", "فرمت ومسح القرص بالكامل", "فرمت ومسح الهارد ديسك", "tools"),
    ("verb", "configurar", "ar", "A2", "ضبط الإعدادات والخصائص", "ظبط الإعدادات والخواص", "tools"),
    ("verb", "sincronizar", "ar", "B1", "زامن الملفات بين الهاتف والحاسوب", "زامن الملفات بين الجهازين", "science"),
    ("verb", "vincular", "ar", "B1", "قرن وربط الجهاز بالبلوتوث", "ربط الجهاز بالبلوتوث والوايرلس", "tools"),
    ("verb", "desvincular", "ar", "B2", "فصل الربط بين الجهازين", "فصل الجهازين عن بعض", "tools"),
    ("verb", "navegar", "ar", "A1", "تصفح صفحات الويب بالإنترنت", "تصفح ودخل ع المواقع بالنت", "daily"),
    ("verb", "descargar", "ar", "A1", "حمّل ونزّل الملف من الخادم", "نزل وحمل الملف ع الكمبيوتر", "daily"),
    ("verb", "subir", "ir", "A1", "رفع الملف أو المقطع إلى المنصة", "رفع ونشر الفيديو ع المنصة", "daily"),
    ("verb", "compartir", "ir", "A1", "شارك الرابط أو المنشور مع أصدقائه", "شير وشارك اللينك مع صحابه", "social"),
    ("verb", "etiquetar", "ar", "A2", "أشار ووسم الأصدقاء في الصورة", "عمل تاج وعلم على صحابه في الصورة", "social"),
    ("verb", "bloquear", "ar", "A2", "حظر ومنع الحساب المزعج", "عمل بلوك وحظر الحساب المزعج", "social"),
    ("verb", "desbloquear", "ar", "A2", "فك الحظر عن الحساب / فتح الشاشة", "فك البلوك وفتح شاشة الموبايل", "social"),
    ("verb", "silenciar", "ar", "A2", "كتم الصوت أو الإشعارات المزعجة", "كتم الصوت وعمل ميوت للجروب", "daily"),
    ("verb", "retransmitir", "ir", "B1", "بث ونقل الحدث بالفيديو مباشرة", "بث ونقل الماتش لايف ع الشاشة", "arts"),
    ("verb", "monetizar", "ar", "B2", "حقّق أرباحاً مالية من المحتوى", "كسب فلوس وعمل أرباح من القناة", "work"),
    ("verb", "optimizar", "ar", "B1", "حسّن وسرّع كفاءة النظام", "سرّع وظبط كفاءة السيستم", "work"),
    ("verb", "automatizar", "ar", "B2", "أتمت وجعل الإجراءات آلية", "خلى الشغل أوتوماتيك كمبيوتر", "science"),
    ("verb", "digitalizar", "ar", "B1", "رقمن وحوّل المستندات الورقية لأرشيف", "سحب الورق سكانر وحوله رقمي", "work"),
    ("verb", "escanear", "ar", "A2", "مسح ضوئياً الورقة بالسكانر", "سحب الورقة بالسكانر", "tools"),
    ("verb", "imprimir", "ir", "A1", "طبع الورقة والمستند بالطابعة", "طبع الورق ع البرنتر", "work"),

    # --- Tech & Media Adjectives (صفات التكنولوجيا والإعلام) ---
    ("adj", "digital", "", "A1", "رقمي ويعمل بالنظام الثنائي", "رقمي ديجيتال", "science"),
    ("adj", "analógico", "", "A2", "تماثلي وتقليدي النمط", "أنالوج عادي وقديم", "science"),
    ("adj", "inalámbrico", "", "A2", "لاسلكي يعمل دون أسلاك", "وايرلس ومن غير أسلاك", "tools"),
    ("adj", "portátil", "", "A1", "محمول وسهل الحمل والتنقل", "لاب توب محمول وسهل الشيل", "tools"),
    ("adj", "táctil", "", "A2", "لمسي ويعمل بحاسة اللمس", "شاشة تاتش باللمس", "tools"),
    ("adj", "óptico", "", "B1", "ضوئي ويعمل بأشعة الضوء", "ضوئي بعدسات وأشعة", "science"),
    ("adj", "virtual", "", "A2", "افتراضي في فضاء الإنترنت", "افتراضي مش حقيقي ع النت", "science"),
    ("adj", "interactivo", "", "A2", "تفاعلي يتيح المشاركة المباشرة", "تفاعلي وفيه أخد وعطا", "study"),
    ("adj", "inteligente", "", "A1", "ذكي ومزود بتقنيات حديثة", "سمارت وذكي بتكنولوجيا", "science"),
    ("adj", "automatizado", "", "B1", "مؤتمت ويعمل ببرمجة ذاتية", "شغال لوحده مبرمج أوتوماتيك", "science"),
    ("adj", "cibernético", "", "B2", "سيبراني ومعلوماتي رقمي", "سيبراني وخاص بأمن الشبكات", "science"),
    ("adj", "electrónico", "", "A1", "إلكتروني يعمل بالدوائر والرقائق", "إلكتروني بالكهربا والشرائح", "science"),
    ("adj", "encriptado", "", "B2", "مشفر ومحمي من الاختراق", "مشفر ومحمي بأرقام سرية", "science"),
    ("adj", "híbrido", "", "B1", "هجين يجمع بين نظامين مختلفين", "هجين بيشتغل بنظامين سوا", "science"),
    ("adj", "integrado", "", "B1", "مدمج ومتكامل في لوحة واحدة", "مدمج وجوة الجهاز", "tools"),
    ("adj", "intuitivo", "", "B1", "بديهي وسهل الاستيعاب للمستخدم", "بديهي وسهل الاستخدام جداً", "study"),
    ("adj", "multimedia", "", "A2", "متعدد الوسائط من صوت وصورة", "ملتيميديا صوت وصورة وفيديو", "arts"),
    ("adj", "remoto", "", "A2", "نائي وعن بُعد بواسطة الشبكة", "عن بعد ومش في المكان", "work"),
    ("adj", "sincronizado", "", "B1", "متزامن ومطابق في نفس التوقيت", "متزامن ومربوط في نفس الوقت", "science"),
    ("adj", "telefónico", "", "A1", "هاتفي ومتعلق بشبكات الاتصال", "هاتفي وخاص بالمكالمات", "services"),
    ("adj", "ultrarrápido", "", "B1", "فائق السرعة وخارق في الإنجاز", "صاروخ وفائق السرعة", "science"),
    ("adj", "compatible", "", "A2", "متوافق ويعمل بانسجام مع النظام", "متوافق وبيشتغل مع النظام تمام", "tools"),
    ("adj", "incompatible", "", "B1", "غير متوافق ويتعارض مع البرامج", "مش راكب وبيعارض البرنامج", "tools"),
    ("adj", "defectuoso", "", "B1", "معطوب وتالف ولا يعمل جيداً", "بايظ وفيه عيب صناعة", "tools"),
    ("adj", "actualizado", "", "A2", "محدث ومزود بأحدث الميزات", "متحدث لآخر نسخة ونظيف", "tools"),
    ("adj", "obsoleto", "", "B1", "قديم متقادم وبائد تقنياً", "قديم ودقة قديمة ومعدش ينفع", "science"),
    ("adj", "robusto", "", "B1", "صلب ومتين ومقاوم للأعطال", "جامد ومتين وبيستحمل الشغل", "tools"),
    ("adj", "escalable", "", "B2", "قابل للتوسع والنمو المستقبلي", "قابل للتوسع والزيادة بالسيرفر", "science"),
    ("adj", "reutilizable", "", "B1", "قابل لإعادة الاستخدام بأمان", "ينفع يتكرر استخدامه من غير ضرر", "tools"),
    ("adj", "sostenible", "", "B1", "مستدام وصديق للبيئة الطبيعية", "مستدام ومحافظ ع البيئة", "nature"),
]

def main():
    existing = get_existing_norms(exclude_slugs={"cv-topic-tech-media"})
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
            ex_es = f"{art} {headword} resulta fundamental en el desarrollo informático moderno."
            ex_ar = f"يعد الـ{msa} أساسياً في التطور التكنولوجي الحديث."
            entry = make_noun(headword, gender, level, msa, eg, ex_es, ex_ar, domain=domain, rank=rank)
        elif kind == "verb":
            paradigm = row[2]
            level = row[3]
            msa = row[4]
            eg = row[5]
            domain = row[6]
            ex_es = f"Los ingenieros suelen {headword} con gran precisión en los sistemas."
            ex_ar = f"يعتاد المهندسون أن {msa} بدقة متناهية في الأنظمة."
            entry = make_verb(headword, paradigm, level, msa, eg, ex_es, ex_ar, domain=domain, rank=rank)
        elif kind == "adj":
            level = row[3]
            msa = row[4]
            eg = row[5]
            domain = row[6]
            ex_es = f"Este nuevo dispositivo cuenta con un diseño {headword} muy avanzado."
            ex_ar = f"يتميز هذا الجهاز الجديد بتصميم {msa} متقدم للغاية."
            entry = make_adj(headword, level, msa, eg, ex_es, ex_ar, domain=domain, rank=rank)
        else:
            continue

        entries.append(entry)
        existing.add(norm)
        rank += 1

    print(f"Tech & Media: Prepared {len(entries)} new entries (skipped {skipped} existing).")
    emit_bundle("vocab-cv-topic-tech-media.json", "cv-topic-tech-media", "التكنولوجيا والمعلوماتية والاتصالات والإعلام الرقمي", entries)

if __name__ == "__main__":
    main()
