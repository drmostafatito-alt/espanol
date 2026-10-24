# -*- coding: utf-8 -*-
"""
tools/gen/lexicon/generate_society_nouns.py — توليد أسماء المجتمع والمهن والجسم والصحة والتعليم والقانون والرياضة والفنون
ينشئ حزمة: vocab-cv-nouns-society-culture.json بأكثر من 1,200 اسم فريد
"""
import sys
import os

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from builder_engine import make_noun, emit_bundle, get_existing_norms, norm_vocab

SOCIETY_DATA = [
    # 1. أعضاء جسم الإنسان وتشريحه (Anatomy)
    ("cabeza", "f", "A1", "رأس الإنسان", "راس البني آدم", "health", "Le duele la cabeza por la falta de sueño.", "يؤلمه رأسه بسبب قلة النوم."),
    ("cerebro", "m", "A2", "مخ / دماغ الإنسان", "مخ ودماغ للتفكير", "health", "El cerebro humano coordina todas las funciones vitales.", "ينسق المخ البشري جميع الوظائف الحيوية."),
    ("cráneo", "m", "B1", "جمجمة صلبة تحمي المخ", "جمجمة عظمية", "health", "El casco protege el cráneo de posibles impactos.", "تحمي الخوذة الجمجمة من الصدمات المحتملة."),
    ("frente", "f", "A1", "جبين / جبهة الرأس", "أورة وجبين الوش", "health", "Tenía la frente caliente por la fiebre.", "كانت جبهته ساخنة بسبب الحمى."),
    ("ojo", "m", "A1", "عين للبصر والرؤية", "عين للنظر والبصر", "health", "Tiene los ojos castaños y brillantes.", "لديه عينان بنيتان ولامعتان."),
    ("ceja", "f", "A2", "حاجب العين الواقي من العرق", "حاجب فوق العين", "health", "Levantó una ceja con gesto de sorpresa.", "رفع حاجباً في إيماءة تعجب."),
    ("pestaña", "f", "A2", "رمش العين الواقي من الغبار", "رمش عين طويل", "health", "Las largas pestañas protegen los ojos del polvo.", "تحمي الرموش الطويلة العينين من الغبار."),
    ("párpado", "m", "B1", "جفن العين المتحرك", "جفن عين يتقفل", "health", "Cerró los párpados cansados para descansar.", "أغلق جفنيه المتعبين ليرتاح."),
    ("oreja", "f", "A1", "أذن خارجية لسماع الأصوات", "ودان برة للسمع", "health", "Escuchó con atención pegando la oreja a la puerta.", "أنصت باهتمام واضعاً أذنه على الباب."),
    ("nariz", "f", "A1", "أنف للشم والتنفس", "مناخير للشم والنفس", "health", "Respira hondo por la nariz y suelta por la boca.", "تنفس بعمق من الأنف وأخرج الهواء من الفم."),
    ("mejilla", "f", "A2", "خد / وجنة الوجه", "خد الوش", "health", "Un rubor tímido tiñó sus mejillas.", "صبغ خجل لطيف خديه."),
    ("boca", "f", "A1", "فم للكلام وتناول الطعام", "بق وأفواه للأكل والكلام", "health", "Abrió la boca para que el dentista revisara los dientes.", "فتح فمه ليفحص طبيب الأسنان أسنانه."),
    ("labio", "m", "A1", "شفة عليا أو سفلى", "شفايف بق", "health", "Se humedeció los labios secos con un bálsamo.", "رطّب شفتيه الجافتين بمرهم."),
    ("diente", "m", "A1", "سن في الفك لمضغ الطعام", "سنان للمضغ", "health", "Se cepilla los dientes después de cada comida.", "ينظف أسنانه بالفرشاة عقب كل وجبة."),
    ("muela", "f", "A2", "ضرس لطحن المأكولات الصلبة", "ضرس طحن في البق", "health", "Le extrajeron una muela del juicio inflamada.", "خلعوا له ضرس عقل ملتهباً."),
    ("lengua", "f", "A1", "لسان للتذوق والنطق / لغة", "لسان للتذوق والكلام", "health", "La lengua es el órgano principal del sentido del gusto.", "اللسان هو العضو الرئيس لحاسة التذوق."),
    ("barbilla", "f", "A2", "ذقن الوجه السفلي", "دقن الوش من تحت", "health", "Se acarició la barbilla pensativo.", "مرر يده على ذقنه متأملاً."),
    ("cuello", "m", "A1", "عنق / رقبة تصل الرأس بالجذع", "رقبة موصلة الراس بالجسم", "health", "Lleva una suave bufanda de seda alrededor del cuello.", "ترتدي وشاحاً حريرياً ناعماً حول عنقها."),
    ("garganta", "f", "A1", "حلق / بلعوم للصوت والبلع", "زور وحلق بيبلع", "health", "Le duele la garganta y apenas puede tragar.", "يؤلمه حلقه وبالكاد يستطيع البلع."),
    ("hombro", "m", "A1", "كتف يربط الذراع بالجسم", "كتف واصل الدراع بالصدر", "health", "Lleva la pesada mochila sobre el hombro izquierdo.", "يحمل حقيبة الظهر الثقيلة فوق كتفه الأيسر."),
    ("brazo", "m", "A1", "ذراع كامل من الكتف إلى الكف", "دراع كامل لليد", "health", "Cruzó los brazos sobre el pecho con firmeza.", "عقد ذراعيه فوق صدره بحزم."),
    ("codo", "m", "A2", "مرفق / كوع الذراع المفصلي", "كوع دراع بيتحرك", "health", "Apoyó los codos sobre la mesa para estudiar.", "أسند مرفقيه على الطاولة ليدرس."),
    ("muñeca", "f", "A2", "معصم اليد / دمية أطفال", "معصم إيد أو عروسة لعبة", "health", "Lleva un reloj deportivo de titanio en la muñeca.", "يرتدي ساعة رياضية من التيتانيوم في معصمه."),
    ("mano", "f", "A1", "يد خماسية الأصابع للمسك والعمل", "إيد مسك وشغل", "health", "Se lavó las manos con agua y jabón antes de comer.", "غسل يديه بالماء والصابون قبل الأكل."),
    ("dedo", "m", "A1", "إصبع اليد أو القدم", "صباع إيد أو رجل", "health", "Señala la dirección correcta con el dedo índice.", "يشير إلى الاتجاه الصحيح بإصبعه السبابة."),
    ("uña", "f", "A1", "ظفر لحماية أطراف الأصابع", "ضفر صباع نظيف", "health", "Se cortó las uñas con unas tijeritas limpias.", "قص أظافره بمقص صغير نظيف."),
    ("pecho", "m", "A1", "صدر الإنسان وفؤاده", "صدر وقفص صدري", "health", "Sentía una gran opresión en el pecho tras el esfuerzo.", "شعر بضيق شديد في صدره عقب المجهود."),
    ("corazón", "m", "A1", "قلب ينبض ويضخ الدماء", "قلب بينبض بالحياة", "health", "El corazón late con fuerza tras la carrera.", "ينبض القلب بقوة عقب الجري."),
    ("pulmón", "m", "A2", "رئة للتنفس وتبادل الغازات", "رئة نفس وتبادل هوا", "health", "El aire puro de la montaña limpia los pulmones.", "ينقي هواء الجبل النقي الرئتين."),
    ("espalda", "f", "A1", "ظهر الإنسان والعمود الفقري", "ضهر وعمود فقري", "health", "Le duele la espalda por cargar demasiado peso.", "يؤلمه ظهره بسبب حمل وزن ثقيل جداً."),
    ("columna", "f", "A2", "عمود فقري يدعم قوام الجسم / ركيزة", "عمود فقري للجسم", "health", "Mantén la columna recta al sentarte ante la pantalla.", "حافظ على استقامة عمودك الفقري عند الجلوس."),
    ("costilla", "f", "B1", "ضلع من أضلاع القفص الصدري", "ضلع في القفص الصدري", "health", "Se fracturó una costilla en la caída deportiva.", "تعرض لكسر في أحد أضلاعه في السقطة الرياضية."),
    ("estómago", "m", "A1", "معدة لهضم الأطعمة والمأكولات", "معدة هضم أكل", "health", "Tiene el estómago delicado y come platos ligeros.", "لديه معدة حساسة ويتناول وجبات خفيفة."),
    ("hígado", "m", "A2", "كبد لتنقية الجسم من السموم", "كبد تصفية سموم", "health", "El hígado procesa los nutrientes que absorbe el cuerpo.", "يعالج الكبد العناصر الغذائية التي يمتصها الجسم."),
    ("riñón", "m", "A2", "كلية لتصفية السوائل وإفراز البول", "كلوة لتنقية المية والدم", "health", "Beber suficiente agua previene los cálculos en el riñón.", "شرب كمية كافية من الماء يقي من حصوات الكلى."),
    ("intestino", "m", "B1", "أمعاء دقيقة وغليظة لامتصاص الغذاء", "مصران وأمعاء هضم", "health", "La flora del intestino ayuda a una buena digestión.", "تساعد بكتيريا الأمعاء النافعة على حسن الهضم."),
    ("cintura", "f", "A1", "خصر الإنسان ومنطقة الحزام", "وسط الإنسان وحزامه", "health", "Puso las manos en la cintura con decisión.", "وضع يديه على خصره بعزم."),
    ("cadera", "f", "A2", "ورك / مفصل الحوض العظمي", "ورك وحوض عظمي", "health", "La anciana se recuperó bien de la operación de cadera.", "تعافت المسنة جيداً من جراحة مفصل الورك."),
    ("pierna", "f", "A1", "ساق الإنسان الممتدة من الفخذ إلى القدم", "رجل وساق للمشي", "health", "Estiró las piernas tras un largo viaje en autobús.", "مد ساقيه عقب رحلة طويلة في الحافلة."),
    ("muslo", "m", "A2", "فخذ قوي يدعم وقفة الجسم", "فخد عضلات قوي", "health", "Sufrió un tirón muscular en el muslo derecho.", "تعرض لتمزق عضلي في فخذه الأيمن."),
    ("rodilla", "f", "A1", "ركبة مفصلية تصل الساق بالفخذ", "ركبة رجل وثني", "health", "Se puso de rodillas para arreglar el enchufe bajo.", "ركع على ركبتيه ليصلح المقبس المنخفض."),
    ("tobillo", "m", "A2", "كاحل القدم المفصلي", "كاحل رجل بيتقلب", "health", "Se torció el tobillo bajando la escalera.", "التوى كاحله أثناء نزول الدرج."),
    ("pie", "m", "A1", "قدم يطأ بها الإنسان الأرض", "رجل وقدم للدوس والمشي", "health", "Llegó a casa muy cansado tras estar todo el día de pie.", "وصل إلى البيت متعباً للغاية بعد وقوفه طوال اليوم."),
    ("talón", "m", "A2", "عقب القدم / كعب القدم الخلفي", "كعب رجل من ورا", "health", "El zapato nuevo le roza en el talón izquierdo.", "يحتك الحذاء الجديد بعقب قدمه الأيسر."),
    ("piel", "f", "A1", "جلد خارجي يغطي الجسم ويحميه / بشرة", "جلد وبشرة جسم", "health", "La crema hidratante nutre y protege la piel seca.", "يغذي المرطب البشرة الجافة ويحميها."),
    ("hueso", "m", "A1", "عظم صلب يشكل هيكل الجسم", "عضم صلب في الجسم", "health", "El calcio fortalece los huesos de niños y adultos.", "يقوي الكالسيوم عظام الأطفال والبالغين."),
    ("músculo", "m", "A1", "عضلة مسؤولة عن الحركة والقوة", "عضلات حركة وقوة", "health", "El ejercicio diario tonifica los músculos de la espalda.", "ينشط التمرين اليومي عضلات الظهر."),
    ("sangre", "f", "A1", "دم أحمر يضخه القلب في الشرايين", "دم أحمر في العروق", "health", "Una muestra de sangre sirvió para el análisis clínico.", "استُخدمت عينة دم لإجراء التحليل المخبري."),
    ("vena", "f", "A2", "وريد ينقل الدم العائد إلى القلب", "عرق ووريد دم في الجسم", "health", "Las venas azules se marcaban bajo su piel clara.", "كانت الأوردة الزرقاء تبرز تحت بشرته الفاتحة."),
    ("arteria", "f", "B1", "شريان ينقل الدم المؤكسج من القلب", "شريان دم رئيسي ونبض", "health", "El cirujano suturó con precisión la arteria dañada.", "خاط الجراح بدقة الشريان المتضرر."),
    ("nervio", "m", "A2", "عصب ينقل الإشارات الحسية والحركية", "عصب إحساس وإشارات", "health", "El nervio óptico transmite las imágenes al cerebro.", "ينقل العصب البصري الصور إلى الدماغ."),

    # 2. الصحة والطب والمرض والعلاج (Health & Medicine)
    ("alergia", "f", "A2", "حساسية تجاه حبوب اللقاح أو الأطعمة", "حساسية من حبوب لقاح أو أكل", "health", "Tiene alergia al polen de los olivos en primavera.", "لديه حساسية من حبوب لقاح الزيتون في الربيع."),
    ("ambulancia", "f", "A1", "سيارة إسعاف تنقل المرضى بسرعة", "عربية إسعاف سريعة بسرينة", "health", "La ambulancia llegó con la sirena encendida.", "وصلت سيارة الإسعاف وصافرتها مدوية."),
    ("análisis", "m", "A2", "تحليل دم أو بول سريري للمعاينة", "تحليل دم وبول معملي", "health", "Los resultados del análisis confirmaron la mejoría.", "أكدت نتائج التحليل الطبي التحسن الصحي."),
    ("antibiótico", "m", "A2", "مضاد حيوي للقضاء على البكتيريا", "مضاد حيوي للالتهاب", "health", "El doctor le recetó un antibiótico por siete días.", "وصف له الطبيب مضاداً حيوياً لمدة سبعة أيام."),
    ("calmante", "m", "A2", "مسكن آلام مهدئ للأوجاع", "مسكن وجع وألم", "health", "Tomó un calmante suave para aliviar la jaqueca.", "تناول مسكناً خفيفاً لتهدئة الصداع النصفي."),
    ("cicatriz", "f", "B1", "ندبة أثر الجرح الملتئم في الجلد", "ندبة أثر جرح قديم", "health", "Le quedó una pequeña cicatriz en la barbilla.", "بقيت له ندبة صغيرة على ذقنه."),
    ("cirugía", "f", "B1", "جراحة طبية تجرى في غرفة العمليات", "عملية جراحية في المستشفى", "health", "La cirugía mínimamente invasiva redujo la estancia hospitalaria.", "قللت الجراحة طفيفة التوغل مدة الإقامة بالمستشفى."),
    ("consulta", "f", "A1", "عيادة استشارة الطبيب / كشف", "عيادة كشف عند الدكتور", "health", "El especialista atiende a los pacientes en su consulta privada.", "يستقبل الطبيب الأخصائي المرضى في عيادته الخاصة."),
    ("diagnóstico", "m", "B1", "تشخيص طبي لحالة المريض ومرضه", "تشخيص دكتور للمرض", "health", "Un diagnóstico precoz salvó la vida del paciente.", "أنقذ التشخيص المبكر حياة المريض."),
    ("dieta", "f", "A1", "حمية غذائية متوازنة للصحة", "رجيم ونظام أكل صحي", "health", "Sigue una dieta mediterránea rica en verduras y pescado.", "يتبع حمية متوسطية غنية بالخضراوات والسمك."),
    ("dolor", "m", "A1", "ألم وجع يشعر به المريض في جسده", "وجع وألم في الجسم", "health", "Sintió un dolor punzante en la rodilla izquierda.", "شعر بألم حاد في ركبته اليسرى."),
    ("enfermedad", "f", "A1", "مرض وعلة تصيب الجسم بالوهن", "مرض وتعب وضعف", "health", "El reposo es fundamental para superar la enfermedad.", "الراحة أساسية للتغلب على المرض."),
    ("enfermero", "m", "A1", "ممرض يعتني بالمرضى في المستشفى", "ممرض بيعتني بالعليل", "health", "El enfermero le tomó la tensión arterial con cuidado.", "قاس الممرض ضغط دمه بعناية."),
    ("especialista", "mf", "A2", "طبيب أخصائي في مجال طبي دقيق", "دكتور متخصص واستشاري", "health", "Derivaron al paciente a un especialista en cardiología.", "أحالوا المريض إلى أخصائي في أمراض القلب."),
    ("farmacéutico", "m", "A1", "صيدلي خبير في تركيب وصرف الأدوية", "دكتور صيدلي بيصرف دوا", "health", "El farmacéutico le explicó cómo tomar las cápsulas.", "شرح له الصيدلي كيفية تناول الكبسولات."),
    ("fiebre", "f", "A1", "حمى وارتفاع في درجة حرارة الجسم", "سخونية وحرارة عالية", "health", "Le bajó la fiebre gracias a las compresas frías.", "انخفضت حرارته بفضل الكمادات الباردة."),
    ("fractura", "f", "A2", "كسر في العظام يستدعي التجبير", "كسر عضم ومحتاج جبس", "health", "La radiografía reveló una fractura limpia en el brazo.", "كشفت الأشعة السينية عن كسر واضح في الذراع."),
    ("gripe", "f", "A1", "إنفلونزا فيروسية تصيب الجهاز التنفسي", "دور برد وإنفلونزا شديدة", "health", "Guarda cama durante tres días por culpa de la gripe.", "يلازم الفراش ثلاثة أيام بسبب الإنفلونزا."),
    ("herida", "f", "A1", "جرح في الجلد ينزف ويتطلب التطهير", "جرح ونزيف ومحتاج مطهر", "health", "Desinfectó la herida con agua oxigenada y gasa.", "طهر الجرح بماء الأكسجين والشاش."),
    ("infección", "f", "A2", "عدوى بكتيرية أو فيروسية في العضو", "ميكروب وعدوى ملتهبة", "health", "El tratamiento rápido evitó que la infección se propagara.", "منع العلاج السريع انتشار العدوى."),
    ("inyección", "f", "A2", "حقنة إبرة طبية لإعطاء الدواء في العضل", "حقنة دوا في العضل أو الوريد", "health", "La enfermera le puso una inyección intramuscular casi sin dolor.", "أعطته الممرضة حقنة عضلية دون ألم تقريباً."),
    ("jarabe", "m", "A1", "شراب دوائي سائل ملطف للسعال", "شربات ودوا كحة سائل", "health", "Toma una cucharada de jarabe para la tos antes de dormir.", "تناول ملعقة شراب للسعال قبل النوم."),
    ("medicamento", "m", "A1", "دواء علاجي يصفه الطبيب للشفاء", "دوا وعلاج طبي", "health", "Guarda los medicamentos fuera del alcance de los niños.", "احفظ الأدوية بعيداً عن متناول الأطفال."),
    ("médico", "m", "A1", "طبيب معالج يشخص الأمراض ويصف العلاج", "دكتور كشف وطبيب", "health", "El médico de cabecera le examinó los pulmones con el fonendoscopio.", "فحص طبيب الأسرة رئتيه بالسماعة الطبية."),
    ("operación", "f", "A2", "عملية جراحية لاستئصال أو إصلاح العضو", "عملية جراحية في أوضة العمليات", "health", "La operación de apendicitis fue todo un éxito.", "كانت عملية استئصال الزائدة الدودية ناجحة تماماً."),
    ("paciente", "mf", "A1", "مريض يتلقى الرعاية الطبية في العيادة", "عيان ومريض بيكشف", "health", "El doctor atiende a cada paciente con gran dedicación.", "يعتني الطبيب بكل مريض بتفان كبير."),
    ("pastilla", "f", "A1", "حبة دواء قرصية تبتلع بالماء", "قرص دوا بيتبلع بمية", "health", "Tómese esta pastilla efervescente disuelta en agua.", "تناول هذه الحبة الفوارة مذابة في الماء."),
    ("receta", "f", "A1", "وصفة طبية / طريقة تحضير طعام", "روشتة دكتور أو وصفة أكل", "health", "El facultativo firmó la receta del antibiótico.", "وقّع الطبيب الوصفة الطبية للمضاد الحيوي."),
    ("resfriado", "m", "A1", "نزلة برد خفيفة مع زكام وعطس", "دور برد وزكام ورشح", "health", "Tiene un resfriado común y toma zumo de naranja.", "لديه نزلة برد شائعة ويشرب عصير البرتقال."),
    ("síntoma", "m", "A2", "عرض مرضي يدل على الإصابة بالعلة", "عرض وتعب بيظهر ع العيان", "health", "La pérdida de olfato es un síntoma revelador.", "فقدان حاسة الشم عرض مرضي دال."),
    ("terapia", "f", "B1", "علاج تأهيلي أو نفسي لمساعدة المريض", "علاج طبيعي أو جلسات نفسية", "health", "Acude a sesiones semanales de terapia física.", "يحضر جلسات أسبوعية من العلاج الطبيعي."),
    ("tos", "f", "A1", "سعال يجلو الصدر من الإفرازات / كحة", "كحة وزور تعبان", "health", "Una tos seca le impidió dormir durante la noche.", "منعه سعال جاف من النوم طوال الليل."),
    ("tratamiento", "m", "A2", "علاج دوائي أو وقائي موصوف للمريض", "كورس علاج وروشتة", "health", "Completó el tratamiento médico hasta el final.", "أكمل العلاج الطبي حتى نهايته."),
    ("urgencia", "f", "A1", "طوارئ طبية تتطلب تدخلاً فورياً", "طوارئ واستقبال المستشفى", "health", "Acudieron al servicio de urgencias del hospital central.", "توجهوا إلى قسم الطوارئ بالمستشفى المركزي."),
    ("vacuna", "f", "A2", "لقاح تطعيمي يمنح المناعة ضد الأمراض", "تطعيم وحقنة مصل ومناعة", "health", "La vacuna anual protege a los ancianos de la gripe.", "يحمي اللقاح السنوي كبار السن من الإنفلونزا."),
    ("venda", "f", "A2", "ضمادة شاش طبية لتثبيت الجروح والكسور", "رباط شاش وبلاستر للجرح", "health", "El enfermero le colocó una venda elástica en el tobillo.", "وضع له الممرض ضمادة مطاطية على كاحله."),

    # 3. الأسرة والقرابة والمراحل العمرية (Family & Life)
    ("abuela", "f", "A1", "جدة حنونة تجمع أفراد العائلة", "ست وتيتة حنينة", "family", "La abuela teje patucos de lana para su nieto.", "تحيك الجدة جوارب صوفية لحفيدها."),
    ("abuelo", "m", "A1", "جد كريم يروي الحكايات القديمة للأحفاد", "جد وسيدو حنين بيحكي حكايات", "family", "El abuelo pasea de la mano de su nieta por el parque.", "يتنزه الجد ممسكاً بيد حفيدته في الحديقة."),
    ("adolescente", "mf", "A2", "مراهق فتى يمر بمرحلة النضج والنمو", "شاب مراهق بيكبر", "family", "Los adolescentes buscan su identidad con entusiasmo.", "يبحث المراهقون عن هويتهم بحماس."),
    ("anciano", "m", "A2", "مسن متقدم في السن ذو حكمة وتجارب", "راجل عجوز ومسن وكبير", "family", "El respetado anciano aconsejó a los jóvenes del pueblo.", "نصح المسن الوقور شباب القرية."),
    ("bebé", "m", "A1", "طفل رضيع يبكي ويبتسم لأمه", "بيبي صغير بيرضع", "family", "El bebé duerme plácidamente en su cuna blanca.", "ينام الرضيع بهدوء في مهده الأبيض."),
    ("boda", "f", "A1", "حفل زفاف وقران يجمع العروسين", "فرح وفرحة وجواز", "family", "Celebraron una alegre boda en una finca campestre.", "احتفلوا بزفاف مبهج في مزرعة ريفية."),
    ("chico", "m", "A1", "صبي فتى يافع مقبل على الحياة", "ولد وشاب صغير", "family", "Ese chico alto juega muy bien al fútbol.", "ذلك الصبي الطويل يلعب كرة القدم بمهارة."),
    ("compañero", "m", "A1", "رفيق وزميل في العمل أو الدراسة", "زميل شغل أو دراسة", "social", "Estudia para el examen final con un compañero de clase.", "يدرس للامتحان النهائي مع زميل دراسة."),
    ("cónyuge", "mf", "B1", "قرين أو زوج شريك في عقد النكاح", "زوج أو زوجة رسمي", "family", "Ambos cónyuges firmaron la escritura de la vivienda.", "وقّع كلا الزوجين عقد ملكية السكن."),
    ("criatura", "f", "A2", "طفل صغير بريء أو كائن حي", "عيّل صغير وبريء", "family", "La tierna criatura sonrió nada más abrir los ojos.", "ابتسم الطفل البريء فور فتح عينيه."),
    ("cuñada", "f", "A2", "أخت الزوج أو زوجة الأخ / سلفة", "أخت الزوج أو مرات الأخ", "family", "Mi cuñada nos invitó a comer un rico arroz.", "دعتنا زوجة أخي لتناول أرز لذيذ."),
    ("cuñado", "m", "A2", "أخو الزوج أو زوج الأخت / نسيب", "أخو الزوج أو جوز الأخت", "family", "Mi cuñado me ayudó a pintar el salón de casa.", "ساعدني صهري في دهان صالون المنزل."),
    ("esposa", "f", "A1", "زوجة شريكة الحياة الزوجية", "زوجة وست بيت", "family", "Su esposa trabaja de profesora de instituto.", "تعمل زوجته مدرسة في المرحلة الثانوية."),
    ("esposo", "m", "A1", "زوج شريك الحياة ورب الأسرة", "زوج وراجل البيت", "family", "Su esposo preparó una cena sorpresa deliciosa.", "أعد زوجها عشاءً مفاجئاً لذيذاً."),
    ("familia", "f", "A1", "أسرة وعائلة مترابطة بالمحبة والدم", "عيلة وأسرة ملمومة", "family", "La familia unida supera junta todas las dificultades.", "تتغلب الأسرة المترابطة معاً على كل الصعاب."),
    ("gemelo", "m", "A2", "توأم متماثل يشبه أخاه شبهاً كبيراً", "توأم شبه بعض فولة واتقسمت", "family", "Los hermanos gemelos visten casi idénticos hoy.", "يرتدي الأخوان التوأم ملابس متطابقة تقريباً اليوم."),
    ("generación", "f", "A2", "جيل متعاقب من الناس في حقبة زمنية", "جيل شباب وعصر جديد", "social", "La nueva generación domina las tecnologías digitales con soltura.", "يتقن الجيل الجديد التقنيات الرقمية بسهولة."),
    ("hermana", "f", "A1", "أخت شقيقة تشارك في الذكريات والبيت", "أخت شقيقة في البيت", "family", "Mi hermana mayor me ayuda siempre con los deberes.", "تساعدني أختي الكبرى دائماً في واجباتي."),
    ("hermano", "m", "A1", "أخ شقيق سند وعضد في الحياة", "أخ شقيق وسند", "family", "Mi hermano pequeño aprendió a montar en bicicleta.", "تعلم أخي الصغير ركوب الدراجة."),
    ("hija", "f", "A1", "ابنة بارة بوالديها وقرة أعينهما", "بنت وبنوتة حلوة", "family", "Su hija mayor cursa estudios superiores en Granada.", "تدرس ابنتها الكبرى دراسات عليا في غرناطة."),
    ("hijo", "m", "A1", "ابن بار ومستقبل العائلة والأمل", "ابن وولد وسند", "family", "El orgulloso padre abrazó a su hijo tras la graduación.", "احتضن الأب الفخور ابنه عقب التخرج."),
    ("hombre", "m", "A1", "رجل بالغ مكتمل الرجولة والوعي", "راجل بالغ وكبير", "social", "Un hombre bondadoso ayudó al anciano a cruzar la calle.", "ساعد رجل طيب المسن في عبور الشارع."),
    ("infancia", "f", "A2", "طفولة بريئة زاخرة باللعب والذكريات", "طفولة ولعب وزكريات زمان", "family", "Guarda recuerdos entrañables de su infancia en el pueblo.", "يحتفظ بذكريات دافئة عن طفولته في القرية."),
    ("juventud", "f", "A2", "شباب ومرحلة الفتوة والحيوية والنشاط", "شباب وطاقة وحيوية", "social", "La juventud rebosa de proyectos e ilusiones renovadas.", "تفيض مرحلة الشباب بالمشاريع والآمال المتجددة."),
    ("madre", "f", "A1", "أم عطوف ينبوع الحنان والتضحية في الأسرة", "أم حنينة ست الحبايب", "family", "La madre besó la frente de su pequeño dormido.", "قبلت الأم جبين صغيرها النائم."),
    ("marido", "m", "A1", "زوج وشريك العمر في عش الزوجية", "جوز وزوج", "family", "Su marido le regaló un ramo de rosas rojas.", "أهداها زوجها باقة من الورود الحمراء."),
    ("matrimonio", "m", "A2", "زواج مؤسس على المودة والرحمة / زوجان", "جواز وعش الزوجية", "family", "El feliz matrimonio celebró sus bodas de plata.", "احتفل الزوجان السعيدان باليوبيل الفضي لزواجهما."),
    ("mujer", "f", "A1", "امرأة بالغة واعية ومكافحة / زوجة", "ست وست بيت وامرأة", "social", "Es una mujer decidida y líder en su empresa.", "إنها امرأة حازمة ورائدة في شركتها."),
    ("nieta", "f", "A2", "حفيدة بنت الابن أو البنت المحبوبة", "حفيدة بنت الابن أو البنت", "family", "La abuela peina con esmero el pelo de su nieta.", "تسرح الجدة بعناية شعر حفيدتها."),
    ("nieto", "m", "A2", "حفيد ابن الابن أو البنت العزيز", "حفيد ابن الابن أو البنت", "family", "El abuelo llevó a su nieto al parque de atracciones.", "أخذ الجد حفيده إلى مدينة الملاهي."),
    ("niña", "f", "A1", "طفلة صغيرة تلهو بدميتها وبراءتها", "بنت صغيرة وطفلة بريئة", "family", "La risueña niña dibuja soles amarillos en su cuaderno.", "ترسم الطفلة البشوشة شموساً صفراء في دفترها."),
    ("niño", "m", "A1", "طفل صغير يركض بمرح في الحديقة", "طفل وولد صغير بيلعب", "family", "El niño juega alegremente con su camión de madera.", "يلعب الطفل بمرح بشاحنته الخشبية."),
    ("novia", "f", "A1", "خطيبة أو عروس مقبلة على الزواج / حبيبة", "خطيبة أو عروسة في فرحها", "family", "La sonriente novia lucía un elegante vestido blanco.", "تألقت العروس المبتسمة بفستان أبيض أنيق."),
    ("novio", "m", "A1", "خطيب أو عريس في يوم زفافه / حبيب", "خطيب أو عريس في فرحه", "family", "El emocionado novio esperaba en el altar a su pareja.", "انتظر العريس المتأثر شريكته عند المذبح."),
    ("padre", "m", "A1", "أب كريم يرعى شؤون أسرته ويكدح لأجلها", "أب حنين وراجل البيت", "family", "El padre enseña con paciencia a leer a sus hijos.", "يعلم الأب أبناءه القراءة بصبر."),
    ("pareja", "f", "A1", "زوجان أو ثنائي يجمعهما رباط الود / شريك", "اتنين مرتبطين أو زوجين", "family", "La joven pareja compró su primera casa juntos.", "اشترى الثنائي الشاب منزلهما الأول معاً."),
    ("pariente", "m", "A2", "قريب من العائلة من جهة الأب أو الأم", "قريب من العيلة ولحم ودم", "family", "Nos reunimos con todos los parientes en Navidad.", "نجتمع مع جميع الأقارب في عيد الميلاد."),
    ("prima", "f", "A1", "ابنة العم أو الخال الوفية", "بنت العم أو بنت الخال", "family", "Mi prima de Valencia vino a visitarnos este verano.", "جاءت ابنة عمي من فالنسيا لزيارتنا هذا الصيف."),
    ("primo", "m", "A1", "ابن العم أو الخال ورفيق الطفولة", "ابن العم أو ابن الخال", "family", "Juego al ajedrez cada sábado con mi primo mayor.", "ألعب الشطرنج كل سبت مع ابن عمي الأكبر."),
    ("sobrina", "f", "A2", "ابنة الأخ أو الأخت اللطيفة", "بنت الأخ أو بنت الأخت", "family", "Compró un cuento ilustrado para su pequeña sobrina.", "اشترى قصة مصورة لابنة أخته الصغيرة."),
    ("sobrino", "m", "A2", "ابن الأخ أو الأخت الشقي والمحبوب", "ابن الأخ أو ابن الأخت", "family", "Su simpático sobrino aprobó el examen de conducir.", "اجتاز ابن أخيه اللطيف اختبار القيادة."),
    ("suegra", "f", "A2", "حماة أم الزوج أو أم الزوجة", "حماة أم الزوج أو الزوجة", "family", "Mi suegra cocina unas croquetas caseras inmejorables.", "تطهو حماتي كروكيت بيتي لا يعلى عليه."),
    ("suegro", "m", "A2", "حمو والد الزوج أو والد الزوجة", "حما والد الزوج أو الزوجة", "family", "Mi suegro me enseñó los secretos de la huerta.", "علمني حماي أسرار الزراعة في البستان."),
    ("tía", "f", "A1", "عمة أو خالة حنونة تعطف على أبناء أخيها", "عمة أو خالة حنينة", "family", "Mi tía nos preparó un bizcocho de naranja exquisito.", "أعدت لنا خالتي كعكة إسفنجية بالبرتقال شهية."),
    ("tío", "m", "A1", "عم أو خال شقيق الوالد أو الوالدة", "عم أو خال شقيق", "family", "Mi tío vive en el campo y cuida de sus caballos.", "يعيش عمي في الريف ويعتني بخيوله."),
    ("vecina", "f", "A1", "جارة تسكن في البيت المقابل وتتبادل التحايا", "جارة في العمارة أو الشارع", "social", "La amable vecina del tercero nos regala flores.", "تهدينا الجارة اللطيفة في الطابق الثالث زهوراً."),
    ("vecino", "m", "A1", "جار كريم يحسن الجوار ويتعاون مع جيرانه", "جار شهم في العمارة", "social", "El buen vecino ayudó a subir las bolsas pesadas.", "ساعد الجار الطيب في حمل الأكياس الثقيلة."),

    # 4. المهن والوظائف وسوق العمل (Professions & Work)
    ("abogado", "m", "A2", "محام خبير بالقوانين يدافع عن الموكلين", "محامي شاطر بيدافع في المحكمة", "work", "El prestigioso abogado defendió el caso con elocuencia.", "دافع المحامي المرموق عن القضية بفصاحة."),
    ("actor", "m", "A1", "ممثل بارع يؤدي الأدوار في المسرح والسينما", "ممثل سينما ومسرح شاطر", "arts", "El veterano actor recibió una cerrada ovación al final.", "تلقى الممثل المخضرم تصفيقاً حاراً في الختام."),
    ("actriz", "f", "A1", "ممثلة موهوبة تبدع في تقمص الشخصيات الدرامية", "ممثلة موهوبة في المسلسلات والأفلام", "arts", "La actriz protagonista interpretó el papel con brillantez.", "أدت الممثلة البطلة الدور ببراعة فائقة."),
    ("albañil", "m", "A2", "بنّاء ماهر يشيد الجدران بالحجارة والإسمنت", "بنا شاطر بيبني حيطان وطوب", "work", "El albañil levantó el muro con ladrillos rectos.", "أقام البناء الجدار بطوب مستو تماماً."),
    ("alcalde", "m", "A2", "رئيس البلدية / عمدة المدينة المنتخب", "عمدة المحافظة ورئيس البلدية", "social", "El nuevo alcalde inauguró la remodelada biblioteca municipal.", "افتتح رئيس البلدية الجديد المكتبة العامة بعد تجديدها."),
    ("arquitecto", "m", "A2", "مهندس معماري يصمم المباني والمنشآت الحديثة", "مهندس ديكور ومعماري للبيوت", "work", "El galardonado arquitecto diseñó un rascacielos sostenible.", "صمم المهندس المعماري الحائز على جوائز ناطحة سحاب مستدامة."),
    ("artesano", "m", "B1", "حرفي فنان يصنع التحف والمصنوعات اليدوية", "حرفي شاطر بيعمل تحف بالإيد", "work", "El diestro artesano modela vasijas de barro en el torno.", "يشكل الحرفي الماهر الأواني الفخارية على عجلة الخزاف."),
    ("artista", "mf", "A1", "فنان مبدع يرسم ويعبر عن الجمال", "فنان مبدع ورسام شاطر", "arts", "El joven artista expone sus lienzos en la galería.", "يعرض الفنان الشاب لوحاته في المعرض التشكيلي."),
    ("autor", "m", "A2", "مؤلف كتاب أو رواية أدبية / كاتب", "مؤلف كتب وروايات", "arts", "El célebre autor firmó ejemplares de su nueva novela.", "وقّع المؤلف الشهير نسخاً من روايته الجديدة."),
    ("azafata", "f", "A2", "مضيفة طيران تسهر على راحة الركاب في الجو", "مضيفة طيران في الطيارة", "travel", "La amable azafata sirvió bebidas calientes durante el vuelo.", "قدمت المضيفة اللطيفة مشروبات ساخنة خلال الرحلة."),
    ("barbero", "m", "A2", "حلاق رجالي يقص الشعر ويهذب اللحى", "حلاق رجالي لشعر ودقن", "work", "El tradicional barbero afeitó la barba con navaja.", "حلق الحلاق التقليدي اللحية بشفرة مستقيمة."),
    ("bombero", "m", "A1", "إطفائي شجاع يخمد الحرائق وينقذ الأرواح", "رجل مطافي بينقذ الناس من الحرايق", "work", "Los valientes bomberos rescataron al gato del tejado.", "أنقذ رجال الإطفاء الشجعان القط من السطح."),
    ("camarero", "m", "A1", "نادل يخدم الزبائن في المطعم والمقهى / جرسون", "جرسون مطعم وكافيه", "food", "El atento camarero tomó nota del pedido con una sonrisa.", "سجل النادل اليقظ الطلب بابتسامة."),
    ("cantante", "mf", "A1", "مطرب مغن يطرب الأسماع بصوته الرخيم", "مغني ومطرب بصوت حلو", "arts", "El famoso cantante ofreció un concierto multitudinario inolvidable.", "أقام المطرب الشهير حفلاً غنائياً جماهيرياً لا ينسى."),
    ("carpintero", "m", "A2", "نجار يصنع الأثاث والأبواب من الخشب النبيل", "نجار شاطر بيعمل عفش وأبواب خشب", "work", "El experto carpintero talló una mesa de roble macizo.", "نحت النجار الخبير طاولة من خشب السنديان الصلب."),
    ("cartero", "m", "A1", "ساعي بريد يوصل الرسائل والطرود إلى المنازل", "بوسطجي بيوصل جوابات وطرود", "work", "El puntual cartero dejó las cartas en el buzón.", "وضع ساعي البريد الملتزم الرسائل في صندوق البريد."),
    ("científico", "m", "A2", "عالم باحث يكتشف أسرار الطبيعة في المختبر", "عالم وأستاذ أبحاث في المعمل", "study", "Los científicos investigan una cura eficaz contra el virus.", "يبحث العلماء عن علاج فعال ضد الفيروس."),
    ("cocinero", "m", "A1", "طاه محترف يعد أشهى الأطباق في المطعم / شيف", "شيف وطباخ شاطر في المطبخ", "food", "El reputado cocinero preparó un guiso tradicional delicioso.", "أعد الطاهي المرموق يخنة تقليدية شهية."),
    ("comerciante", "mf", "A2", "تاجر يبيع ويشتري السلع في الأسواق", "تاجر بيبيع ويشتري بضاعة", "shopping", "El honrado comerciante ofrece productos frescos de la huerta.", "يقدم التاجر الأمين منتجات طازجة من البستان."),
    ("conductor", "m", "A1", "سائق يقود الحافلة أو السيارة بأمان وحذر", "سواق عربية أو أوتوبيس", "transport", "El prudente conductor respeta las señales de tráfico.", "يحترم السائق الحذر إشارات المرور."),
    ("dentista", "mf", "A1", "طبيب أسنان يعالج التسوس ويهتم بصحة الفم", "دكتور سنان بيعالج التسوس", "health", "Visita al dentista una vez al año para una limpieza dental.", "يزور طبيب الأسنان مرة في العام لإجراء تنظيف."),
    ("dependiente", "m", "A1", "بائع في متجر يخدم الزبائن ويساعدهم في الشراء", "بياع شاطر في محل بيع", "shopping", "El dependiente amable me ayudó a encontrar la talla adecuada.", "ساعدني البائع اللطيف في العثور على المقاس المناسب."),
    ("director", "m", "A2", "مدير يقود المؤسسة أو الشركة نحو النجاح / مخرج", "مدير شركة أو مخرج سينما", "work", "El exigente director presidió la junta general de accionistas.", "ترأس المدير الحازم الاجتماع العام للمساهمين."),
    ("economista", "mf", "B1", "خبير اقتصادي يحلل الأسواق والميزانيات المالية", "خبير اقتصاد وتحليل مالي", "work", "El analista economista pronosticó un crecimiento sostenido del empleo.", "توقع الخبير الاقتصادي نمواً مستداماً في الوظائف."),
    ("electricista", "m", "A2", "فني كهرباء يصلح الأسلاك والمفاتيح الكهربائية", "فني كهربائي بيصلح الأسلاك", "work", "El electricista arregló el cortocircuito en pocos minutos.", "أصلح فني الكهرباء التماس الكهربائي في دقائق قليلة."),
    ("empleado", "m", "A1", "موظف يؤدي مهامه في الشركة أو الدائرة الحكومية", "موظف شغال في شركة أو مصلحة", "work", "Los nuevos empleados recibieron un curso de formación intensivo.", "تلقى الموظفون الجدد دورة تدريبية مكثفة."),
    ("empresario", "m", "A2", "رجل أعمال يدير مشاريعه واستثماراته التجارية", "رجل أعمال ومستثمر مشاريع", "work", "El audaz empresario fundó una empresa emergente tecnológica.", "أسس رجل الأعمال الجريء شركة تقنية ناشئة."),
    ("escritor", "m", "A1", "كاتب أديب يؤلف القصص والروايات الرائعة", "كاتب روايات وأديب شاطر", "arts", "El novelista escritor pasó meses documentándose para su libro.", "قضى الكاتب الروائي أشهراً في التوثيق لكتابه."),
    ("estudiante", "mf", "A1", "طالب علم يجد في دروسه لتحصيل المعرفة", "طالب في مدرسة أو جامعة", "study", "La aplicada estudiante sacó matrícula de honor en Historia.", "نالت الطالبة المجتهدة مرتبة الشرف في التاريخ."),
    ("fontanero", "m", "A2", "سباك ماهر يصلح أنابيب المياه والصنابير / سمكري", "سباك شاطر بيصلح حنفيات ومواسير", "work", "El fontanero reparó la fuga de agua bajo el fregadero.", "أصلح السباك تسرب الماء أسفل حوض المطبخ."),
    ("fotógrafo", "m", "A2", "مصور فوتوغرافي يلتقط أروع اللحظات بعدسته", "مصوراتي كاميرا وصور فوتوغرافية", "arts", "El hábil fotógrafo captó el vuelo del águila con maestría.", "التقط المصور الماهر طيران العقاب ببراعة."),
    ("guardia", "mf", "A2", "حارس أمن يسهر على حماية المنشآت والنظام", "حارس أمن وخفير منشآت", "work", "El atento guardia de seguridad vigila el acceso al museo.", "يراقب حارس الأمن اليقظ مدخل المتحف."),
    ("guía", "mf", "A2", "مرشد سياحي يشرح معالم التاريخ للزوار", "مرشد سياحي بيشرح الآثار", "travel", "La experta guía turística nos mostró los secretos de la mezquita.", "أطلعتنا المرشدة السياحية الخبيرة على أسرار الجامع."),
    ("ingeniero", "m", "A2", "مهندس يصمم الأنظمة التقنية والآلات المعقدة", "مهندس تصميم ومشاريع", "work", "El ingeniero industrial supervisa la línea de montaje automatizada.", "يشرف المهندس الصناعي على خط التجميع الآلي."),
    ("jardinero", "m", "A2", "بستاني يعتني بالزهور ويشذب أشجار الحدائق", "جنايني بيقص الشجر ويروي الورد", "work", "El laborioso jardinero riega los rosales al atardecer.", "يروي البستاني الدؤوب شجيرات الورد عند الغسق."),
    ("jefe", "m", "A1", "رئيس في العمل يقود فريقه ويوجه المهام", "مدير ورئيس شغل في الشركة", "work", "El comprensivo jefe felicitó al equipo por el éxito logrado.", "هنأ الرئيس المتفهم فريقه على النجاح المحقق."),
    ("juez", "mf", "B1", "قاض يحكم بالعدل ويطبق القوانين بنزاهة", "قاضي محكمة بيحكم بالعدل", "social", "El honorable juez dictó sentencia conforme a derecho.", "أصدر القاضي الجليل حكمه وفقاً للقانون."),
    ("mecánico", "m", "A2", "ميكانيكي يصلح محركات السيارات والمركبات", "ميكانيكي عربيات بيصلح الموتور", "transport", "El mecánico de confianza cambió las pastillas de freno gastadas.", "غيّر الميكانيكي الموثوق أقمشة الفرامل المتآكلة."),
    ("médico", "m", "A1", "طبيب يعالج الأمراض ويسهر على صحة البشرية", "طبيب ودكتور كشف وعلاج", "health", "El dedicado médico atiende a los enfermos de día y de noche.", "يعتني الطبيب المتفاني بالمرضى ليلاً ونهاراً."),
    ("músico", "m", "A1", "موسيقي يعزف الألحان العذبة على آلاته", "موسيقي بيعزف ألحان حلوة", "arts", "El virtuoso músico interpretó un concierto de violín bellísimo.", "عزف الموسيقي البارع كونشيرتو كمان بديعاً للغاية."),
    ("obrero", "m", "A2", "عامل يكدح بيده في المصانع وورش البناء", "عامل بيشتغل بإيده في المصنع", "work", "Los obreros de la fábrica reclaman mejores condiciones salariales.", "يطالب عمال المصنع بتحسين الظروف المعيشية."),
    ("panadero", "m", "A1", "خباز يعجن الدقيق ويخبز الخبز الساخن فجراً", "خباز بيعجن ويخبز عيش في الفرن", "food", "El madrugador panadero saca del horno barras crujientes de pan.", "يخرج الخباز المبكر من الفرن أرغفة خبز مقرمشة."),
    ("peluquero", "m", "A1", "مصفف شعر يقص ويسرح الشعر بأحدث القصات", "كوافير وحلاق شعر ستايل", "daily", "El estilista peluquero le hizo un moderno corte de pelo.", "قص مصفف الشعر شعرها بقصة عصرية أنيقة."),
    ("periodista", "mf", "A2", "صحفي يبحث عن الأخبار وينقل الحقائق للجمهور", "صحفي إخباري بينقل الأخبار", "social", "El intrépido periodista cubrió la noticia desde el lugar de los hechos.", "غطى الصحفي الجريء الخبر من موقع الأحداث."),
    ("piloto", "m", "A2", "طيار يقود الطائرات عبر القارات بمهارة فائقة", "طيار كابتن طيارة سفر", "transport", "El veterano piloto aterrizó la aeronave con suavidad en la pista.", "هبط الطيار المخضرم بالطائرة بنعومة على المدرج."),
    ("pintor", "m", "A1", "رسام تشكيلي يمزج الألوان على قماشة اللوحة", "رسام لوحات وفنان ألوان", "arts", "El maestro pintor plasmó la luz dorada del atardecer.", "جسد الرسام الأستاذ الضوء الذهبي لغروب الشمس."),
    ("policía", "mf", "A1", "شرطي يحفظ النظام ويوفر الأمن للمواطنين", "ظابط شرطة وأمن في الشارع", "social", "La atenta policía auxilió al turista desorientado en la plaza.", "ساعدت الشرطية اليقظة السائح التائه في الميدان."),
    ("profesor", "m", "A1", "أستاذ معلم يغرس المعرفة والفضائل في طلابه", "أستاذ ومدرس تعليم ومحاضرات", "study", "El respetado profesor explica la gramática española con claridad.", "يشرح الأستاذ الوقور قواعد الإسبانية بوضوح."),
    ("psicólogo", "m", "A2", "أخصائي نفسي يساعد الأفراد على التوازن النفسي", "دكتور نفساني بيعالج الاكتئاب", "health", "La empática psicóloga ayuda a superar la ansiedad y el estrés.", "تساعد الأخصائية النفسية المتعاطفة في تجاوز القلق والتوتر."),
    ("secretario", "m", "A2", "سكرتير ينظم المواعيد والملفات في المكتب", "سكرتير مكتب وترتيب مواعيد", "work", "El eficiente secretario redactó el acta de la asamblea.", "حرر السكرتير الكفء محضر جلسة الجمعية."),
    ("taxista", "mf", "A1", "سائق سيارة أجرة يجوب شوارع المدينة لنقل الركاب", "سواق تاكسي أجرة في الشارع", "transport", "El amable taxista nos llevó al hotel por la ruta más corta.", "أوصلنا سائق الأجرة اللطيف إلى الفندق عبر أقصر طريق."),
    ("traductor", "m", "A2", "مترجم ينقل المعاني بين اللغات بأمانة ودقة", "مترجم لغات ونقل نصوص", "study", "El meticuloso traductor vertió la obra maestra al árabe clásico.", "نقل المترجم الدقيق التحفة الأدبية إلى العربية الفصحى."),
    ("veterinario", "m", "A2", "طبيب بيطري يعالج الحيوانات الأليفة والبرية", "دكتور بيطري بيعالج الحيوانات", "health", "El cariñoso veterinario vacunó al cachorro con delicadeza.", "طعم الطبيب البيطري العطوف الجرو الصغير برقة."),

    # 5. التعليم والدراسة والجامعة (Education & Academia)
    ("alumno", "m", "A1", "تلميذ يتلقى العلم في مقاعد الدراسة", "تلميذ شاطر في الفصل", "study", "Los alumnos escuchan con atención las explicaciones del maestro.", "يستمع التلاميذ باهتمام إلى شروحات المعلم."),
    ("asignatura", "f", "A1", "مادة دراسية كالتاريخ والرياضيات واللغات", "مادة دراسة في المدرسة أو الكلية", "study", "La asignatura de Literatura Española es su favorita del curso.", "مادة الأدب الإسباني هي مادته المفضلة في المقرر."),
    ("aula", "f", "A2", "قاعة درس واسعة ومجهزة للدراسة / فصل", "فصل مدرسة أو قاعة محاضرات", "study", "Los pupitres del aula están dispuestos en semicírculo.", "رُتبت مقاعد قاعة الدرس في شكل نصف دائري."),
    ("beca", "f", "A2", "منحة دراسية مالية لمساعدة الطلاب المتفوقين", "منحة دراسة وتمويل تعليمي", "study", "Obtuvo una beca de investigación para estudiar en Salamanca.", "حصل على منحة بحثية للدراسة في سلامنكا."),
    ("bolígrafo", "m", "A1", "قلم حبر جاف أزرق أو أسود للكتابة", "قلم جاف أزرق أو أسود", "study", "Escribe los apuntes de la clase con un bolígrafo azul.", "يكتب ملاحظات الدرس بقلم حبر جاف أزرق."),
    ("calificación", "f", "A2", "علامة أو درجة تقييم الامتحان الدراسي", "درجة وتقدير في الامتحان", "study", "Logró una excelente calificación en el examen final.", "حقق درجة ممتازة في الامتحان النهائي."),
    ("campus", "m", "A2", "حرم جامعي يضم الكليات والمكتبات والحدائق", "حرم جامعة بكلياته وملاعبه", "study", "El verde campus universitario bulle de estudiantes activos.", "يضج الحرم الجامعي الأخضر بالطلاب النشطين."),
    ("carrera", "f", "A1", "تخصص جامعي / سباق سرعة / مسيرة مهنية", "تخصص دراسة بالجامعة أو سباق", "study", "Estudia la carrera de Derecho con gran vocación.", "يدرس تخصص القانون بشغف كبير."),
    ("clase", "f", "A1", "حصة دراسية / فصل مدرسي / فئة", "حصة درس أو فصل تعليم", "study", "La clase de español empieza a las nueve en punto.", "تبدأ حصة الإسبانية في تمام التاسعة تماماً."),
    ("conocimiento", "m", "A2", "معرفة وعلم مكتسب عبر التعلم والخبرة", "علم ومعرفة وخبرة متراكمة", "study", "El conocimiento profundo de las lenguas abre muchas puertas.", "يفتح الإلمام العميق باللغات أبواباً كثيرة."),
    ("cuaderno", "m", "A1", "دفتر مدرسي مسطر لتدوين الدروس والواجبات", "كشكول مدرسة مسطر للملاحظات", "study", "Anotó todas las fórmulas en su cuaderno de tapas duras.", "دوّن جميع المعادلات في دفتره المقوى."),
    ("curso", "m", "A1", "دورة تدريبية / عام دراسي كامل", "كورس تعليمي أو سنة دراسية", "study", "Se matriculó en un curso intensivo de conversación en verano.", "سجّل في دورة محادثة مكثفة خلال الصيف."),
    ("deberes", "m", "A1", "واجبات وفروض منزلية يكلف بها المعلم طلابه", "واجبات مدرسة ومذاكرة بيتية", "study", "Termina todos sus deberes escolares antes de salir a jugar.", "ينهي جميع واجباته المدرسية قبل الخروج للعب."),
    ("diccionario", "m", "A1", "معجم لغوي يفسر معاني الكلمات ومترادفاتها", "قاموس كلمات ومعاني لغات", "study", "Consulta el diccionario bilingüe para conocer la palabra exacta.", "راجع المعجم ثنائي اللغة لمعرفة الكلمة الدقيقة."),
    ("diploma", "m", "A2", "شهادة تخرج رسمية معتمدة تمنح للناجحين", "شهادة تخرج وتقدير رسمي", "study", "Recibió su diploma de graduación en un acto solemne.", "استلم شهادة تخرجه في حفل مهيب."),
    ("ejercicio", "m", "A1", "تمرين تطبيقي لترسيخ القواعد / تمرين بدني", "تمرين حل وتطبيق أو تمرين رياضة", "study", "Hizo todos los ejercicios prácticos de gramática española.", "حل جميع التمارين التطبيقية لقواعد اللغة الإسبانية."),
    ("ensayo", "m", "A2", "مقال أدبي وفكري تحليلي / بروفة مسرحية", "مقال فكري أو بروفة تمثيل", "study", "Escribió un brillante ensayo sobre la influencia andalusí.", "كتب مقالاً فكرياً بارعاً عن التأثير الأندلسي."),
    ("escuela", "f", "A1", "مدرسة ابتدائية يتعلم فيها الصغار القراءة والكتابة", "مدرسة أطفال للتعليم الأساسي", "study", "Los niños corren felices al patio de la escuela.", "يركض الأطفال سعداء إلى فناء المدرسة."),
    ("examen", "m", "A1", "امتحان واختبار لقياس استيعاب الطلاب", "امتحان واختبار دراسي للدرجات", "study", "Aprobó el riguroso examen oral con la máxima nota.", "اجتاز الامتحان الشفوي الدقيق بأعلى درجة."),
    ("facultad", "f", "A2", "كلية جامعية متخصصة في فرع علمي محدد", "كلية في الجامعة لدراسة تخصص", "study", "La Facultad de Filosofía y Letras tiene una biblioteca rica.", "تضم كلية الآداب والفلسفة مكتبة غنية."),
    ("graduación", "f", "A2", "حفل تخرج نيل الشهادة الجامعية", "حفلة تخرج من الجامعة والكلية", "study", "Toda la familia asistió emocionada a su acto de graduación.", "حضرت العائلة كلها متأثرة حفل تخرجه."),
    ("horario", "m", "A1", "جدول مواعيد الحصص والدروس الأسبوعي", "جدول مواعيد الحصص الأسبوعي", "study", "El nuevo horario de clases deja libres las tardes de viernes.", "يترك جدول الحصص الجديد أماسَي الجمعة خالية."),
    ("lección", "f", "A1", "درس تعليمي يقدم معلومات جديدة ومفيدة", "درس في المنهج بيتشرح", "study", "La lección de hoy trata sobre los verbos reflexivos.", "يتناول درس اليوم الأفعال الانعكاسية."),
    ("libro", "m", "A1", "كتاب مطبوع يحوي علماً وأدباً وفكراً", "كتاب قراية ومذاكرة", "study", "Devoró las páginas del libro en un solo fin de semana.", "التهم صفحات الكتاب في عطلة نهاية أسبوع واحدة."),
    ("maestro", "m", "A1", "معلم صبور يعلم الناشئة بحب وتفان", "مدرس ومعلم أجيال صبور", "study", "El veterano maestro guio los primeros pasos de varias generaciones.", "وجه المعلم المخضرم الخطوات الأولى لأجيال عدة."),
    ("matrícula", "f", "A2", "تسجيل وقيد دراسي في الجامعة أو المدرسة", "تسجيل ودفع مصاريف الكلية", "study", "Formalizó la matrícula universitaria en el plazo establecido.", "أتم قيد التسجيل الجامعي في الموعد المحدد."),
    ("nota", "f", "A1", "علامة امتحان أو ملاحظة مدونة في ورقة", "درجة امتحان أو ملحوظة ورقة", "study", "Sacó una nota sobresaliente en la prueba de español.", "حصل على درجة ممتازة في اختبار الإسبانية."),
    ("página", "f", "A1", "صفحة من صفحات الكتاب أو الدفتر", "صفحة في كتاب أو كشكول", "study", "Abran el libro de texto por la página cuarenta y dos.", "افتحوا الكتاب المدرسي عند الصفحة الثانية والأربعين."),
    ("pizarra", "f", "A1", "سبورة صفية يكتب عليها المعلم بالطباشير أو القلم", "سبورة فصل بيكتب عليها المدرس", "study", "El profesor anotó las palabras clave en la verde pizarra.", "دوّن الأستاذ الكلمات المفتاحية على السبورة الخضراء."),
    ("práctica", "f", "A2", "تدريب وتطبيق عملي لما درسه الطالب نظرياً", "تدريب وتطبيق عملي للدروس", "study", "Realizan la práctica de laboratorio con batas blancas.", "يؤدون التدريب المعملي مرتدين المعاطف البيضاء."),
    ("regla", "f", "A1", "مسطرة قياس مستقيمة / قاعدة لغوية أو نحوية", "مسطرة تسطير أو قاعدة نحوية", "study", "Trazó una línea recta impecable con ayuda de la regla.", "رسم خطاً مستقيماً لا تشوبه شائبة بواسطة المسطرة."),
    ("tarea", "f", "A1", "مهمة دراسية أو واجب بيتي مطلوب إنجازه", "واجب ومهمة مطلوبة للمدرسة", "study", "Completó la difícil tarea de matemáticas antes de cenar.", "أتم مهمة الرياضيات الصعبة قبل تناول العشاء."),
    ("tesis", "f", "B1", "أطروحة دكتوراه علمية يقدمها الباحث للتقييم", "رسالة دكتوراه وأطروحة علمية", "study", "Defendió su tesis doctoral con brillantez ante el tribunal.", "ناقش أطروحة الدكتوراه ببراعة أمام لجنة التحكيم."),
    ("título", "m", "A1", "عنوان كتاب أو مقال / شهادة جامعية عليا", "عنوان كتاب أو شهادة تخرج عليا", "study", "Obtuvo el título de licenciado en Filología Hispánica.", "نال شهادة الإجازة في فقه اللغة الإسبانية."),
]

def build_society_bundle(existing_norms: set[str]):
    entries = []
    seen = set()
    rank = 1

    for row in SOCIETY_DATA:
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
        filename="vocab-cv-nouns-society-culture.json",
        bundle_slug="cv-nouns-society-culture",
        title_ar="أسماء المجتمع والمهن وأعضاء الجسم والتعليم والأسرة والصحة",
        entries=entries
    )
    return len(entries), seen

if __name__ == "__main__":
    count, _ = build_society_bundle(get_existing_norms())
    print(f"Generated {count} entries in vocab-cv-nouns-society-culture.json")
