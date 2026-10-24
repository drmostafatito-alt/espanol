# -*- coding: utf-8 -*-
"""B1 Units 3 (Work & Interviews) and 4 (Study & Expressing Doubt/Probability).
8 Lessons completing B1 Units 3 and 4 based on:
- Aula Plus 3 (Unidades 2 & 6)
- Gramática del uso del español A1-B2 (Capítulos 70-75, 80-85)
- Español 2000 Nivel Intermedio (Lecciones de trabajo, entrevistas y duda)
- المرشد في اللغة الأسبانية (صيغ الشك والاحتمال: quizás, tal vez, probablemente، ومصطلحات سوق العمل)
"""
import sys, os
sys.path.insert(0, os.path.dirname(__file__))
from common import opt, choice_ex, fill_ex, order_ex, speak_ex, lesson_doc, review_block

# ==============================================================================
# UNIT 3: b1-u3-work (العمل والمقابلات الوظيفية)
# ==============================================================================

def make_lesson_entrevistas_trabajo():
    slug = "b1-entrevistas-trabajo"
    doc = {
        "slug": slug,
        "unitSlug": "b1-u3-work",
        "levelCode": "B1",
        "titleAr": "المقابلات الوظيفية: تقديم المؤهلات والخبرات ونقاط القوة",
        "titleEs": "Entrevistas de trabajo: Presentar cualificaciones y fortalezas",
        "subtitleAr": "الحديث عن المسار المهني، الإنجازات السابقة، والتعامل مع أسئلة المقابل",
        "order": 1,
        "estimatedMinutes": 18,
        "cefrLevel": "B1",
        "review": review_block(),
        "pedagogy": {
            "learningObjectivesAr": [
                "أن يقدم المتعلم سيرته ومساره المهني بطلاقة وثقة في مقابلة عمل إسبانية.",
                "أن يعبر عن نقاط قوته ومهاراته الشخصية: puntualidad, capacidad de trabajo en equipo, resolución de problemas.",
                "أن يجيب عن الأسئلة الشائعة للمقابلين مثل: ¿Por qué le interesa este puesto?."
            ],
            "grammarPoints": [
                {
                    "titleAr": "تراكيب التعبير عن الخبرة والكفاءة في المقابلات",
                    "explanationAr": "1. **الحديث عن سنوات الخبرة**:\n- **Tener experiencia en**: Tengo más de cinco años de experiencia en el sector comercial.\n- **Llevar + gerundio**: Llevo tres años trabajando como coordinador de proyectos.\n2. **التعبير عن نقاط القوة**:\n- Me considero una persona responsable, proactiva y organizada.\n- Se me da muy bien la comunicación interpersonal y la negociación.\n3. **التعبير عن الدوافع المهنية**:\n- Me motiva este puesto porque ofrece oportunidades de desarrollo profesional."
                }
            ],
            "commonMistakesAr": [
                "استخدام *tengo cinco años trabajando* بدلاً من التركيب القواعدي السليم llevo cinco años trabajando.",
                "ترجمة 'نقاط القوة' بـ *puntos fuertes* فقط بينما المصطلح الأكاديمي والمهني الشائع في المقابلات هو las fortalezas."
            ],
            "dialectNotes": [
                {
                    "region": "EG",
                    "noteAr": "في مصر في المقابلة بنقول: «عندي خبرة 5 سنين وشاطر في الشغل الجماعي وعايز أطور من نفسي». بالإسبانية: Tengo cinco años de experiencia, se me da bien el trabajo en equipo y busco superarme."
                }
            ],
            "culturalNoteAr": "في سوق العمل الإسباني، يُقدّر أصحاب العمل المهارات المرنة (las habilidades blandas) والقدرة على التكيف مع روح الفريق بقدر ما يقدّرون الشهادات الأكاديمية."
        },
        "contentBlocks": [
            {
                "id": f"cb-{slug}-intro",
                "type": "explanation",
                "titleAr": "المفردات الأساسية لمقابلات العمل",
                "bodyAr": "المصطلحات المهنية:\n- **la entrevista de trabajo**: مقابلة العمل\n- **el puesto**: الوظيفة / المنصب الوظيفي\n- **la fortaleza**: نقطة القوة الشخصية\n- **el sector**: القطاع المهني أو الاقتصادي\n- **la cualificación**: التأهيل أو الكفاءة المهنية\n- **el candidato**: المتقدم للوظيفة / المرشح",
                "examples": [
                    {"es": "El candidato demostró una excelente cualificación durante la entrevista.", "ar": "أظهر المرشح كفاءة ممتازة خلال المقابلة."},
                    {"es": "¿Cuál considera que es su mayor fortaleza profesional?", "ar": "ما الذي تعتبره أكبر نقطة قوة مهنية لديك؟"},
                    {"es": "Llevo varios años desarrollándome en este sector.", "ar": "أمضيت سنوات عدة أطور نفسي في هذا القطاع."}
                ]
            }
        ],
        "newVocabulary": ["entrevista de trabajo", "puesto", "fortaleza", "sector", "cualificación", "candidato"],
        "reviewVocabulary": ["trabajo", "empresa"]
    }

    exs = [
        choice_ex(
            "ex-b1-ent-1", "word_choice",
            "اختر المفردة التي تعني نقطة القوة في المقابلة الوظيفية",
            ["vocabulary"], 1,
            "ما هو المصطلح المهني المقابل لنقطة القوة الشخصية في العمل؟",
            "Mi mayor _____ es la capacidad para resolver conflictos con calma.",
            "أكبر ... لدي هي القدرة على حل النزاعات بهدوء.",
            [
                opt("a", "fortaleza", "نقطة قوة (الصواب)", True),
                opt("b", "puesto", "وظيفة / منصب", False, "puesto اسم المنصب الوظيفي وليس صفة قوة شخصية."),
                opt("c", "candidato", "مرشح للوظيفة", False, "candidato اسم الشخص المتقدم.")
            ],
            ["fortaleza", "puesto", "candidato"],
            "كلمة fortaleza تعني نقطة القوة في المقابلات الوظيفية."
        ),
        fill_ex(
            "ex-b1-ent-2",
            "أكمل بالفعل الدال على الاستمرار الزمني في الوظيفة (llevo)",
            ["grammar", "writing"], 1,
            "أكمل بالفعل المناسب لتركيب الاستمرار الزمني مع اسم الفاعل: (_____ tres años trabajando)",
            "_____ cuatro años trabajando en el departamento de ventas.",
            "أمضيت أربع سنوات أعمل في قسم المبيعات.",
            ["trabajo"],
            ["llevo", "Llevo"],
            "نستخدم الفعل llevar + مدة زمنية + gerundio للتعبير عن استمرار العمل منذ فترة."
        ),
        choice_ex(
            "ex-b1-ent-3", "word_choice",
            "حدد المصطلح الدال على المنصب أو الوظيفة الشاغرة",
            ["vocabulary"], 2,
            "كيف نطلق باللغة الإسبانية على الشاغر الوظيفي المطلوب شغله؟",
            "He presentado mi solicitud para el _____ de director financiero.",
            "قدمت طلبي لشغل ... المدير المالي.",
            [
                opt("a", "puesto", "المنصب أو الوظيفة (الصواب)", True),
                opt("b", "entrevista de trabajo", "المقابلة الشخصية", False, "المتقدم يقدم للوظيفة (el puesto) وليس للمقابلة نفسها هنا."),
                opt("c", "sector", "القطاع الاقتصادي", False, "sector هو المجال العام وليس المنصب المحدد.")
            ],
            ["puesto", "entrevista de trabajo", "sector"],
            "el puesto يعني الوظيفة أو المنصب الشاغر."
        ),
        order_ex(
            "ex-b1-ent-4",
            "رتّب الجملة للإجابة عن سؤال المقابل حول التأهيل المهني",
            ["grammar", "writing"], 2,
            ["Tengo", "la", "cualificación", "adecuada", "para", "este", "sector"],
            "Tengo la cualificación adecuada para este sector",
            "الترتيب: الفعل Tengo ثم المفعول la cualificación adecuada ثم شبه الجملة para este sector.",
            ["cualificación", "sector"]
        ),
        choice_ex(
            "ex-b1-ent-5", "listen_choose",
            "استمع للتسجيل وحدد دافع المرشح للتقديم",
            ["listening", "vocabulary"], 2,
            "استمع لحديث المرشح وحدد ما يركز عليه في المقابلة",
            "Me apasiona este sector y creo que puedo aportar mucho a su empresa.",
            "يعشقني هذا القطاع وأعتقد أن بإمكاني تقديم الكثير لشركتكم.",
            [
                opt("a", "sector", "القطاع ومجال العمل (الصواب)", True),
                opt("b", "candidato", "المرشح", False, "المتحدث يتحدث عن شغفه بالقطاع المهني (el sector)."),
                opt("c", "fortaleza", "نقطة قوة فقط", False, "المتحدث حدد قطاع العمل ورغبته في الإسهام فيه.")
            ],
            ["sector", "candidato", "fortaleza", "empresa"],
            "المتحدث قال: 'Me apasiona este sector'.",
            audioKey="pending/b1_apasiona_sector.mp3",
            speechEs="Me apasiona este sector y creo que puedo aportar mucho a su empresa."
        ),
        speak_ex(
            "ex-b1-ent-6",
            "انطق إجابتك الاحترافية في مقابلة العمل",
            ["speaking", "pronunciation"], 2,
            "انطق الجملة التالية بأسلوب مهني واثق أمام لجنة المقابلة:",
            "Tengo una sólida cualificación y amplia experiencia en este puesto.",
            "لدي تأهيل مهني متين وخبرة واسعة في هذا المنصب.",
            "pending/b1_solida_cualificacion.mp3",
            ["cualificación", "puesto"],
            "Tengo una sólida cualificación y amplia experiencia en este puesto.",
            "انتبه لنطق مقطع ción كـ ثيون واضحة بدون مد مبالغ فيه."
        )
    ]
    return lesson_doc(doc, exs, level="B1")


def make_lesson_curriculum_competencias():
    slug = "b1-curriculum-competencias"
    doc = {
        "slug": slug,
        "unitSlug": "b1-u3-work",
        "levelCode": "B1",
        "titleAr": "السيرة الذاتية والكفاءات: صياغة المهارات والخبرة بلغة احترافية",
        "titleEs": "El currículum vitae y las competencias profesionales",
        "subtitleAr": "أقسام السيرة الذاتية، صياغة المهام السابقة، وتحديد الكفاءات اللغوية والرقمية",
        "order": 2,
        "estimatedMinutes": 18,
        "cefrLevel": "B1",
        "review": review_block(),
        "pedagogy": {
            "learningObjectivesAr": [
                "أن يكتب المتعلم أقسام سيرته الذاتية باللغة الإسبانية طبقاً للمعايير الأوروبية (Europass).",
                "أن يصف كفاءاته العملية والتقنية: competencias digitales, dominio de idiomas, liderazgo.",
                "أن يستخدم الأفعال الإجرائية القوية لوصف المسؤوليات السابقة: coordinar, gestionar, optimizar, liderar."
            ],
            "grammarPoints": [
                {
                    "titleAr": "الأفعال الإجرائية في صياغة السيرة الذاتية",
                    "explanationAr": "في السيرة الذاتية والمهنية، نستخدم مصادر الأفعال أو الأسماء المشتقة لوصف الإنجازات السابقة بدقة:\n- **Gestionar**: Gestión de equipos y presupuestos (إدارة الفرق والميزانيات).\n- **Coordinar**: Coordinación de campañas publicitarias (تنسيق الحملات الإعلانية).\n- **Optimizar**: Optimización de procesos operativos (تحسين العمليات التشغيلية).\n- **Liderar**: Liderazgo de proyectos internacionales (قيادة المشاريع الدولية)."
                }
            ],
            "commonMistakesAr": [
                "استخدام الفعل hacer أو trabajar بعبارات عامة ضعيفة بدلاً من الأفعال المحددة مثل gestionar وcoordinar.",
                "كتابة عبارات مبهمة في مستوى اللغات؛ في أوروبا يُستخدم التوصيف المعياري (Nivel intermedio B1 / Dominio fluido)."
            ],
            "dialectNotes": [
                {
                    "region": "EG",
                    "noteAr": "في مصر بنقول: «السيرة الذاتية بتاعتي فيها كل كورساتي وخبراتي وإدارتي للتيم». بالإسبانية: Mi currículum incluye mis competencias, formación y gestión de equipos."
                }
            ],
            "culturalNoteAr": "في إسبانيا ومعظم دول الاتحاد الأوروبي، من المعتاد تضمين صورة شخصية رسمية حديثة ورابط ملف LinkedIn في الجزء العلوي من الـ CV."
        },
        "contentBlocks": [
            {
                "id": f"cb-{slug}-intro",
                "type": "explanation",
                "titleAr": "المفردات المفتاحية للسيرة الذاتية",
                "bodyAr": "المصطلحات المهنية:\n- **el currículum vitae**: السيرة الذاتية (CV)\n- **la competencia**: الكفاءة أو الجدارة المهنية\n- **gestionar**: يدير وينظم\n- **el liderazgo**: القيادة وتوجيه الفريق\n- **el logro**: الإنجاز المحقق\n- **el perfil profesional**: الملف الشخصي والمهني",
                "examples": [
                    {"es": "El currículum debe ser claro, conciso y orientado a logros.", "ar": "يجب أن تكون السيرة الذاتية واضحة وموجزة وموجهة نحو الإنجازات."},
                    {"es": "Demostró una gran capacidad de liderazgo y resolución.", "ar": "أظهر قدرة كبيرة على القيادة وحل المشكلات."},
                    {"es": "Se encarga de gestionar los recursos humanos de la filial.", "ar": "يتولى إدارة الموارد البشرية للفرع."}
                ]
            }
        ],
        "newVocabulary": ["currículum vitae", "competencia", "gestionar", "liderazgo", "logro", "perfil profesional"],
        "reviewVocabulary": ["experiencia", "responsable"]
    }

    exs = [
        choice_ex(
            "ex-b1-cur-1", "word_choice",
            "اختر المفردة التي تعني الإنجاز الملموس في العمل",
            ["vocabulary"], 1,
            "ما هي الكلمة الإسبانية المقابلة لـ 'إنجاز / نجاح محقق' في السيرة الذاتية؟",
            "En mi última etapa laboral conseguí un gran _____ en reducción de costes.",
            "في مرحلتي العملية الأخيرة حققت ... كبيراً في تقليص التكاليف.",
            [
                opt("a", "logro", "إنجاز محقق (الصواب)", True),
                opt("b", "liderazgo", "قيادة (اسم مهارة)", False, "liderazgo اسم المهارة، أما النجاح المتحقق فهو logro."),
                opt("c", "competencia", "جدارة / كفاءة", False, "نحتاج اسماً يعبر عن النتيجة المحققة.")
            ],
            ["logro", "liderazgo", "competencia"],
            "كلمة logro تعني إنجازاً أو نجاحاً ملموساً في السيرة الذاتية."
        ),
        fill_ex(
            "ex-b1-cur-2",
            "أكمل بالفعل الإجرائي الدال على الإدارة والتنظيم في المصدر",
            ["grammar", "writing"], 1,
            "اكتب الفعل الذي يعني 'يدير / ينظم الموارد والمشاريع' في صيغة المصدر (gestionar)",
            "Mi responsabilidad principal consistía en _____ proyectos de innovación.",
            "كانت مسؤوليتي الرئيسية تتمثل في ... مشاريع الابتكار.",
            ["gestionar"],
            ["gestionar"],
            "فعل gestionar يعني يدير أو يتولى الإشراف والتنظيم الإداري."
        ),
        choice_ex(
            "ex-b1-cur-3", "word_choice",
            "حدد مهارة توجيه وتحفيز فريق العمل",
            ["vocabulary"], 2,
            "ما هو المصطلح الدال على القدرة القيادية وتوجيه الأفراد؟",
            "Para ser jefe de departamento se requiere una probada capacidad de _____.",
            "لتكون رئيساً للقسم يُشترط التمتع بقدرة مثبتة على ...",
            [
                opt("a", "liderazgo", "القيادة (الصواب)", True),
                opt("b", "currículum vitae", "سيرة ذاتية", False, "لا يستقيم المعنى مع متطلبات رئاسة القسم."),
                opt("c", "perfil profesional", "ملف مهني", False, "liderazgo هي المهارة القيادية المحددة.")
            ],
            ["liderazgo", "currículum vitae", "perfil profesional"],
            "el liderazgo هي مهارة القيادة وتوجيه الفرق."
        ),
        order_ex(
            "ex-b1-cur-4",
            "رتّب الجملة لوصف الكفاءات المكتسبة في الملف المهني",
            ["grammar", "writing"], 2,
            ["Tengo", "un", "perfil", "profesional", "con", "mucha", "experiencia"],
            "Tengo un perfil profesional con mucha experiencia",
            "الترتيب: الفعل Tengo ثم المفعول un perfil profesional ثم شبه الجملة con mucha experiencia.",
            ["perfil profesional", "experiencia"]
        ),
        choice_ex(
            "ex-b1-cur-5", "listen_choose",
            "استمع للتسجيل وحدد المهارة البارزة في السيرة الذاتية",
            ["listening", "vocabulary"], 2,
            "استمع لتقييم مسؤول التوظيف وحدد ما لفت نظره في المرشح",
            "El currículum vitae destaca por sus excelentes competencias analíticas.",
            "تتميز السيرة الذاتية بكفاءاتها التحليلية الممتازة.",
            [
                opt("a", "currículum vitae", "السيرة الذاتية (الصواب)", True),
                opt("b", "logro", "إنجاز فردي فقط", False, "المسؤول قيم السيرة الذاتية بالكامل (el currículum vitae)."),
                opt("c", "liderazgo", "قيادة", False, "المسؤول أشاد بالكفاءات التحليلية في الـ CV.")
            ],
            ["currículum vitae", "logro", "liderazgo", "competencia"],
            "المتحدث قال: 'El currículum vitae destaca por sus excelentes competencias'.",
            audioKey="pending/b1_curriculum_competencias.mp3",
            speechEs="El currículum vitae destaca por sus excelentes competencias analíticas."
        ),
        speak_ex(
            "ex-b1-cur-6",
            "انطق ملخص كفاءاتك ومسؤولياتك السابقة",
            ["speaking", "pronunciation"], 2,
            "انطق الجملة التالية بوضوح وثقة لتلخيص مهامك:",
            "Tengo amplia competencia para gestionar equipos y liderar proyectos.",
            "لدي كفاءة واسعة لإدارة الفرق وقيادة المشاريع.",
            "pending/b1_competencia_gestionar.mp3",
            ["competencia", "gestionar"],
            "Tengo amplia competencia para gestionar equipos y liderar proyectos.",
            "انتبه لنطق حرف g في gestionar كـ خاء مرققة ونطق مقطع pro في proyectos."
        )
    ]
    return lesson_doc(doc, exs, level="B1")


def make_lesson_condiciones_laborales():
    slug = "b1-condiciones-laborales"
    doc = {
        "slug": slug,
        "unitSlug": "b1-u3-work",
        "levelCode": "B1",
        "titleAr": "شروط العمل والعقود: الرواتب وساعات الدوام والإجازات والتأمين",
        "titleEs": "Condiciones laborales, contratos y derechos del trabajador",
        "subtitleAr": "أنواع العقود، الراتب الإجمالي والصافي، والبدلات وحقوق الضمان الاجتماعي",
        "order": 3,
        "estimatedMinutes": 18,
        "cefrLevel": "B1",
        "review": review_block(),
        "pedagogy": {
            "learningObjectivesAr": [
                "أن يفهم المتعلم بنود عقد العمل الإسباني: contrato indefinido, contrato temporal, periodo de prueba.",
                "أن يميز بين الراتب الإجمالي (el sueldo bruto) والصافي (el sueldo neto) واستقطاعات الضرائب (el IRPF).",
                "أن يناقش ساعات العمل، والعمل الإضافي (las horas extraordinarias)، والإجازات مدفوعة الأجر (las vacaciones pagadas)."
            ],
            "grammarPoints": [
                {
                    "titleAr": "تراكيب التفاوض حول شروط العمل",
                    "explanationAr": "1. **السؤال عن الراتب والبدلات**:\n- ¿Cuál es el sueldo bruto anual? (كم يبلغ الراتب الإجمالي السنوي؟).\n- ¿El puesto incluye pagas extraordinarias? (هل يشمل المنصب رواتب إضافية كعلاوة الصيف وعيد الميلاد؟).\n2. **الدوام والعقود**:\n- Jornada completa (دوام كامل - 40 ساعة أسبوعياً) مقابل Jornada parcial (دوام جزئي).\n- Contrato indefinido (عقد دائم / غير محدد المدة).\n3. **فترة التجربة**:\n- El contrato tiene un periodo de prueba de tres meses (يتضمن العقد فترة تجربة مدتها ثلاثة أشهر)."
                }
            ],
            "commonMistakesAr": [
                "الخلط بين sueldo bruto (الراتب قبل خصم الضرائب والتأمينات) و sueldo neto (الراتب الصافي المستلم في الحساب البنكي).",
                "قول *horas más* بدلاً من المصطلح القانوني الصحيح las horas extraordinarias (أو horas extras)."
            ],
            "dialectNotes": [
                {
                    "region": "EG",
                    "noteAr": "في مصر بنقول: «المرتب ده صافي ولا قبل الضرائب؟ وفيه تأمين وعقد تثبيت؟». بالإسبانية: ¿El sueldo es neto o bruto? ¿Hay contrato indefinido y Seguridad Social?"
                }
            ],
            "culturalNoteAr": "في إسبانيا ينص القانون عادة على 14 دفعة راتب سنوياً (12 شهراً + راتبين إضافيين: la paga de verano و la paga de Navidad)، ما لم يتم تقسيمها على 12 شهراً بالتراضي."
        },
        "contentBlocks": [
            {
                "id": f"cb-{slug}-intro",
                "type": "explanation",
                "titleAr": "مصطلحات العقود والشروط الوظيفية",
                "bodyAr": "المفردات الأساسية:\n- **el contrato indefinido**: العقد الدائم غير محدد المدة\n- **el sueldo bruto**: الراتب الإجمالي قبل الاستقطاعات\n- **el sueldo neto**: الراتب الصافي بعد الضرائب\n- **la jornada laboral**: يوم الدوام وساعات العمل\n- **el periodo de prueba**: فترة التجربة والتقييم\n- **las horas extras**: الساعات الإضافية للعمل",
                "examples": [
                    {"es": "Me han ofrecido un contrato indefinido con jornada completa.", "ar": "عرضوا عليّ عقداً دائماً بدوام كامل."},
                    {"es": "El sueldo neto mensual se ingresa a final de mes.", "ar": "يُودع الراتب الصافي الشهري في نهاية الشهر."},
                    {"es": "El periodo de prueba es de dos meses según el convenio.", "ar": "فترة التجربة شهران وفقاً للاتفاقية الجماعية."}
                ]
            }
        ],
        "newVocabulary": ["contrato indefinido", "sueldo bruto", "sueldo neto", "jornada laboral", "periodo de prueba", "horas extras"],
        "reviewVocabulary": ["salario", "mes"]
    }

    exs = [
        choice_ex(
            "ex-b1-cnd-1", "word_choice",
            "اختر المصطلح الدال على الراتب الصافي المستلم في البنك",
            ["vocabulary"], 1,
            "ما هو الراتب الفعلي الذي يتسلمه الموظف بعد خصم الضرائب والتأمين؟",
            "Después de las deducciones fiscales, el _____ es de dos mil euros.",
            "بعد الاستقطاعات الضريبية، يبلغ ... ألفي يورو.",
            [
                opt("a", "sueldo neto", "الراتب الصافي (الصواب)", True),
                opt("b", "sueldo bruto", "الراتب الإجمالي قبل الخصم", False, "الراتب بعد الاستقطاعات هو الصافي (neto)."),
                opt("c", "periodo de prueba", "فترة التجربة", False, "periodo de prueba يعني فترة تجربة وليس راتباً.")
            ],
            ["sueldo neto", "sueldo bruto", "periodo de prueba"],
            "el sueldo neto هو الراتب الصافي بعد خصم الضرائب."
        ),
        fill_ex(
            "ex-b1-cnd-2",
            "أكمل نوع العقد المستقر غير محدد المدة",
            ["vocabulary", "writing"], 1,
            "اكتب الصفة الإسبانية للعقد الدائم غير محدد المدة: (contrato _____)",
            "La empresa me ofreció un contrato _____ desde el primer día.",
            "عرضت عليّ الشركة عقداً دائماً غير محدد المدة منذ اليوم الأول.",
            ["contrato indefinido"],
            ["indefinido"],
            "المصطلح هو contrato indefinido ويعني العقد الثابت والدائم."
        ),
        choice_ex(
            "ex-b1-cnd-3", "word_choice",
            "حدد الساعات الإضافية التي يعملها الموظف خارج دوامه الرسمي",
            ["vocabulary"], 2,
            "ماذا تسمى الساعات الإضافية المدفوعة فوق الدوام الرسمي؟",
            "Este mes he trabajado muchas _____ para terminar el proyecto.",
            "هذا الشهر عملت الكثير من ... لإنهاء المشروع.",
            [
                opt("a", "horas extras", "الساعات الإضافية (الصواب)", True),
                opt("b", "jornada laboral", "يوم وساعات العمل العادية", False, "jornada laboral هو الدوام الرسمي الأساسي."),
                opt("c", "sueldo bruto", "الراتب الإجمالي", False, "ساعات العمل الإضافية تسمى horas extras.")
            ],
            ["horas extras", "jornada laboral", "sueldo bruto"],
            "las horas extras تعني الساعات الإضافية للعمل."
        ),
        order_ex(
            "ex-b1-cnd-4",
            "رتّب الجملة لتحديد مدة فترة التجربة في عقد العمل",
            ["grammar", "writing"], 2,
            ["El", "periodo", "de", "prueba", "dura", "tres", "meses"],
            "El periodo de prueba dura tres meses",
            "الترتيب: المبتدأ El periodo de prueba ثم الفعل dura ثم المدة tres meses.",
            ["periodo de prueba", "mes"]
        ),
        choice_ex(
            "ex-b1-cnd-5", "listen_choose",
            "استمع للتسجيل وحدد تفاصيل ساعات الدوام اليومي",
            ["listening", "vocabulary"], 2,
            "استمع للمدير وحدد طبيعة الدوام المعروض على الموظف",
            "Nuestra jornada laboral es de ocho horas diarias con horario flexible.",
            "يوم دوامنا هو ثماني ساعات يومياً مع جدول مواعيد مرن.",
            [
                opt("a", "jornada laboral", "ساعات الدوام اليومي (الصواب)", True),
                opt("b", "sueldo neto", "الراتب الصافي", False, "المتحدث حدد ساعات الدوام (la jornada laboral)."),
                opt("c", "periodo de prueba", "فترة تجربة", False, "المتحدث يشرح تفاصيل ساعات العمل اليومية.")
            ],
            ["jornada laboral", "sueldo neto", "periodo de prueba"],
            "المتحدث قال: 'Nuestra jornada laboral es de ocho horas'.",
            audioKey="pending/b1_jornada_laboral.mp3",
            speechEs="Nuestra jornada laboral es de ocho horas diarias con horario flexible."
        ),
        speak_ex(
            "ex-b1-cnd-6",
            "انطق سؤالك المهني عن طبيعة العقد والراتب الإجمالي",
            ["speaking", "pronunciation"], 2,
            "انطق السؤال التالي بوضوح ولباقة مهنية في ختام المقابلة:",
            "¿El puesto ofrece contrato indefinido y cuál es el sueldo bruto?",
            "هل يوفر المنصب عقداً دائماً وما هو الراتب الإجمالي؟",
            "pending/b1_pregunta_sueldo_contrato.mp3",
            ["contrato indefinido", "sueldo bruto"],
            "¿El puesto ofrece contrato indefinido y cuál es el sueldo bruto?",
            "انتبه لنطق حرف d بين الصائتين في indefinido بنعومة صوتية طبيعية."
        )
    ]
    return lesson_doc(doc, exs, level="B1")


def make_lesson_conversacion_profesional():
    slug = "b1-conversacion-profesional"
    doc = {
        "slug": slug,
        "unitSlug": "b1-u3-work",
        "levelCode": "B1",
        "titleAr": "حوار احترافي: مناقشة مشروع عمل والتفاوض على المهام والحلول",
        "titleEs": "Conversación profesional: Coordinar proyectos y negociar acuerdos",
        "subtitleAr": "إدارة اجتماع عمل، توزيع المهام، واقتراح بدائل وحلول استراتيجية",
        "order": 4,
        "estimatedMinutes": 18,
        "cefrLevel": "B1",
        "review": review_block(),
        "pedagogy": {
            "learningObjectivesAr": [
                "أن يشارك المتعلم بفاعلية في اجتماع عمل حقيقي باللغة الإسبانية.",
                "أن يقترح استراتيجيات عمل وحلولاً تنفيذية: propongo que + subjuntivo, sugiero reconsiderar.",
                "أن يتفاوض حول المواعيد النهائية (los plazos de entrega) وتوزيع الأدوار بين الزملاء."
            ],
            "grammarPoints": [
                {
                    "titleAr": "صيغ الاقتراح والتفاوض في اجتماعات العمل",
                    "explanationAr": "1. **تقديم اقتراح رسمي باستخدام المنصوب (Subjuntivo)**:\n- **Propongo que** revisemos el informe antes del viernes (أقترح أن نراجع التقرير قبل الجمعة).\n- **Sugiero que** repartamos las tareas de forma equitativa (أقترح أن نوزع المهام بالتساوي).\n2. **التعبير عن المواعيد النهائية**:\n- **El plazo de entrega**: Tenemos que cumplir con el plazo de entrega (علينا الالتزام بالموعد النهائي للتسليم).\n3. **التوصل إلى اتفاق وتفاوض**:\n- Llegar a un acuerdo / Cerrar el trato."
                }
            ],
            "commonMistakesAr": [
                "استخدام المضارع الإخباري بعد propongo que (الخطأ: *Propongo que revisamos*، والصواب الحصري: Propongo que revisemos بالمنصوب).",
                "ترجمة 'الموعد النهائي' بـ *tiempo final*؛ المصطلح المهني المعتمد هو el plazo de entrega أو la fecha límite."
            ],
            "dialectNotes": [
                {
                    "region": "EG",
                    "noteAr": "في مصر في الاجتماع بنقول: «أنا بقترح نقسم الشغل وكل واحد يلتزم بالديدلاين». بالإسبانية: Propongo que dividamos el trabajo y respetemos el plazo de entrega."
                }
            ],
            "culturalNoteAr": "في بيئة الأعمال الإسبانية، الاجتماعات تبدأ عادة بحديث ودي قصير (charla informal) لكسر الجليد قبل الدخول في جدول الأعمال الرسمي."
        },
        "contentBlocks": [
            {
                "id": f"cb-{slug}-intro",
                "type": "explanation",
                "titleAr": "مصطلحات التفاوض وإدارة الاجتماعات",
                "bodyAr": "المفردات التفاعلية:\n- **la reunión de trabajo**: اجتماع العمل\n- **el plazo de entrega**: الموعد النهائي للتسليم (الديدلاين)\n- **proponer**: يقترح فكرة أو خطة\n- **el acuerdo**: الاتفاق أو التوافق المشترك\n- **la tarea**: المهمة أو الواجب المكلف به\n- **el equipo**: الفريق المهني المشترك",
                "examples": [
                    {"es": "Propongo que celebremos una reunión de trabajo para fijar los plazos.", "ar": "أقترح أن نعقد اجتماع عمل لتحديد المواعيد النهائية."},
                    {"es": "Es fundamental cumplir con el plazo de entrega establecido.", "ar": "من الضروري للغاية الالتزام بالموعد النهائي المحدد للتسليم."},
                    {"es": "Hemos llegado a un acuerdo beneficioso para ambas partes.", "ar": "توصلنا إلى اتفاق مفيد لكلا الطرفين."}
                ]
            }
        ],
        "newVocabulary": ["reunión de trabajo", "plazo de entrega", "proponer", "acuerdo", "tarea", "equipo"],
        "reviewVocabulary": ["proyecto", "cliente"]
    }

    exs = [
        choice_ex(
            "ex-b1-pro-1", "word_choice",
            "اختر صيغة المنصوب الصحيحة بعد فعل الاقتراح propongo que",
            ["grammar"], 1,
            "أي صيغة فعلية نستخدم بعد تركيب الاقتراح المهني Propongo que؟",
            "Propongo que nosotros _____ los detalles técnicos mañana mismo.",
            "أقترح أن نناقش التفاصيل الفنية غداً بالذات.",
            [
                opt("a", "analicemos", "صيغة المنصوب الحاضر (الصواب بعد propongo que)", True),
                opt("b", "analizamos", "مضارع إخباري لا يصح بعد أفعال الاقتراح", False, "propongo que تتطلب فعلاً في صيغة المنصوب Subjuntivo."),
                opt("c", "analizar", "مصدر غير مصرف لوجود الفاعل que nosotros", False, "مع وجود que والفاعل نحتاج فعلاً مصرفاً بالمنصوب.")
            ],
            ["proponer", "acuerdo"],
            "بعد فعل الاقتراح propongo que يأتي دائماً زمن المنصوب: propongo que analicemos."
        ),
        fill_ex(
            "ex-b1-pro-2",
            "أكمل بالكلمة التي تعني الموعد النهائي المحدد للتسليم",
            ["vocabulary", "writing"], 1,
            "اكتب الكلمة الناقصة في مصطلح الموعد النهائي: (el _____ de entrega)",
            "Debemos entregar el informe antes de que venza el _____ de entrega.",
            "يجب أن نسلم التقرير قبل أن ينقضي الموعد النهائي للتسليم.",
            ["plazo de entrega"],
            ["plazo"],
            "المصطلح هو el plazo de entrega ويعني الموعد النهائي للتسليم."
        ),
        choice_ex(
            "ex-b1-pro-3", "word_choice",
            "حدد الجلسة التنسيقية المشتركة لمناقشة العمل",
            ["vocabulary"], 2,
            "ماذا تسمى الجلسة التي يجتمع فيها الموظفون لتنسيق المهام؟",
            "Hemos convocado una _____ urgente para resolver las incidencias.",
            "دعونا إلى ... عاجل لحل المشكلات الطارئة.",
            [
                opt("a", "reunión de trabajo", "اجتماع عمل رسمي (الصواب)", True),
                opt("b", "plazo de entrega", "موعد نهائي للتسليم", False, "الجلسة نفسها تسمى اجتماع عمل reunión de trabajo."),
                opt("c", "tarea", "مهمة فردية", False, "الدعوة موجهة لعقد جلسة مشتركة.")
            ],
            ["reunión de trabajo", "plazo de entrega", "tarea"],
            "una reunión de trabajo تعني اجتماع عمل لمناقشة المشروعات والمهام."
        ),
        order_ex(
            "ex-b1-pro-4",
            "رتّب الجملة للتعبير عن التوصل إلى اتفاق إيجابي في الفريق",
            ["grammar", "writing"], 2,
            ["Hemos", "llegado", "a", "un", "buen", "acuerdo", "de", "equipo"],
            "Hemos llegado a un buen acuerdo de equipo",
            "الترتيب: الفعل المركب Hemos llegado ثم شبه الجملة a un buen acuerdo de equipo.",
            ["acuerdo", "equipo"]
        ),
        choice_ex(
            "ex-b1-pro-5", "listen_choose",
            "استمع للتسجيل وحدد خطة توزيع المهام في المشروع",
            ["listening", "vocabulary"], 2,
            "استمع لمدير المشروع وحدد ما يطلبه من الفريق",
            "Cada miembro del equipo debe asumir su tarea con total compromiso.",
            "يجب على كل عضو في الفريق أن يتحمل مهمته بالتزام تام.",
            [
                opt("a", "tarea", "المهمة المكلف بها (الصواب)", True),
                opt("b", "acuerdo", "اتفاق مكتوب", False, "المتحدث ركز على التزام كل فرد بمهمته (su tarea)."),
                opt("c", "reunión de trabajo", "اجتماع", False, "المتحدث يتحدث عن تنفيذ المهام المسندة.")
            ],
            ["tarea", "equipo", "acuerdo", "reunión de trabajo"],
            "المتحدث قال: 'debe asumir su tarea con total compromiso'.",
            audioKey="pending/b1_asumir_tarea_equipo.mp3",
            speechEs="Cada miembro del equipo debe asumir su tarea con total compromiso."
        ),
        speak_ex(
            "ex-b1-pro-6",
            "انطق مقترحك للالتزام بالموعد النهائي للتسليم",
            ["speaking", "pronunciation"], 2,
            "انطق الجملة التالية بأسلوب تفاوضي راقٍ وواضح في الاجتماع:",
            "Propongo coordinar las tareas para cumplir con el plazo de entrega.",
            "أقترح تنسيق المهام للالتزام بالموعد النهائي للتسليم.",
            "pending/b1_coordinar_plazo_entrega.mp3",
            ["proponer", "tarea", "plazo de entrega"],
            "Propongo coordinar las tareas para cumplir con el plazo de entrega.",
            "انتبه لنطق حرف z في plazo كـ ثاء ونطق rr المشددة في coordinar."
        )
    ]
    return lesson_doc(doc, exs, level="B1")

# ==============================================================================
# UNIT 4: b1-u4-study (الدراسة والتعلّم وصيغ الشك والاحتمال)
# ==============================================================================

def make_lesson_estudios_universidad():
    slug = "b1-estudios-universidad"
    doc = {
        "slug": slug,
        "unitSlug": "b1-u4-study",
        "levelCode": "B1",
        "titleAr": "التعليم الجامعي والدراسات العليا: الكليات والدرجات العلمية والمنح",
        "titleEs": "Estudios universitarios, titulaciones y becas de investigación",
        "subtitleAr": "نظام البكالوريوس (Grado) والماجستير (Máster)، والمنح الدراسية ورسائل التخرج",
        "order": 1,
        "estimatedMinutes": 18,
        "cefrLevel": "B1",
        "review": review_block(),
        "pedagogy": {
            "learningObjectivesAr": [
                "أن يصف المتعلم دراسته الأكاديمية والجامعية وتخصصه الدقيق باللغة الإسبانية.",
                "أن يتعرف على مسميات المراحل الجامعية في إسبانيا وأوروبا: Grado (بكالوريوس 4 سنوات)، Máster (ماجستير)، Doctorado (دكتوراه).",
                "أن يقدم طلباً لمنحة دراسية أو تدريب أكاديمي: solicitar una beca, matricularse, proyecto de fin de grado."
            ],
            "grammarPoints": [
                {
                    "titleAr": "مصطلحات وتراكيب الحياة الجامعية",
                    "explanationAr": "1. **التسجيل والدراسة**:\n- **Matricularse en**: Me he matriculado en el Grado de Traducción (سجلت في درجة البكالوريوس في الترجمة).\n- **Hacer / Cursar**: Estoy cursando un máster en relaciones internacionales.\n2. **المنح والتمويل**:\n- **Solicitar una beca**: Solicité una beca de investigación para financiar mis estudios.\n3. **التخرج ومشروع النهاية**:\n- **Graduarse**: Se graduó con honores el año pasado.\n- **El Trabajo de Fin de Grado (TFG)**: بحث أو مشروع التخرج الإلزامي في الجامعات الإسبانية."
                }
            ],
            "commonMistakesAr": [
                "استخدام كلمة *carrera* لوصف البكالوريوس الحديث في الوثائق الرسمية؛ الاسم الرسمي الحالي في إسبانيا هو el Grado (بينما carrera تستخدم في الحديث الدارج).",
                "نسيان حرف الجر en بعد الفعل matricularse (الصحيح: matricularse en la universidad)."
            ],
            "dialectNotes": [
                {
                    "region": "EG",
                    "noteAr": "في مصر بنقول: «قدمت على منحة ماجستير، وشغال على مشروع التخرج في الكلية». بالإسبانية: He pedido una beca de máster y estoy con el proyecto de fin de grado."
                }
            ],
            "culturalNoteAr": "برنامج إيراسموس (Erasmus+) هو أشهر برنامج أوروبي للتبادل الطلابي الجامعي، وتعد إسبانيا الوجهة الأولى المفضلة للطلاب في أوروبا."
        },
        "contentBlocks": [
            {
                "id": f"cb-{slug}-intro",
                "type": "explanation",
                "titleAr": "المفردات الأكاديمية والجامعية",
                "bodyAr": "المصطلحات الجامعية:\n- **el grado universitario**: درجة البكالوريوس الجامعية\n- **el máster**: الماجستير والدراسات التخصصية\n- **la beca**: المنحة الدراسية\n- **matricularse**: يسجل في الفصل الدراسي أو الكلية\n- **la facultad**: الكلية (مثل كلية الطب أو الحقوق)\n- **el expediente académico**: السجل الأكاديمي وكشف الدرجات",
                "examples": [
                    {"es": "Ha obtenido una beca completa para cursar un máster en Madrid.", "ar": "حصلت على منحة كاملة لدراسة الماجستير في مدريد."},
                    {"es": "Los estudiantes deben matricularse antes del quince de septiembre.", "ar": "يجب على الطلاب التسجيل قبل الخامس عشر من سبتمبر."},
                    {"es": "Presentó su expediente académico para acceder a la facultad.", "ar": "قدم سجله الأكاديمي للالتحاق بالكلية."}
                ]
            }
        ],
        "newVocabulary": ["grado universitario", "máster", "beca", "matricularse", "facultad", "expediente académico"],
        "reviewVocabulary": ["universidad", "estudiante"]
    }

    exs = [
        choice_ex(
            "ex-b1-est-1", "word_choice",
            "اختر المصطلح الذي يعني منحة دراسية أو تمويلاً جامعياً",
            ["vocabulary"], 1,
            "ما هي الكلمة الإسبانية المقابلة لـ 'منحة دراسية' للطلاب المتميزين؟",
            "Consiguió una _____ de excelencia para financiar su investigación.",
            "حصلت على ... تفوق لتمويل بحثها العلمي.",
            [
                opt("a", "beca", "منحة دراسية (الصواب)", True),
                opt("b", "facultad", "كلية جامعية", False, "facultad هي الكلية نفسها وليست المنحة المالية."),
                opt("c", "máster", "درجة ماجستير", False, "المنحة تسمى beca.")
            ],
            ["beca", "facultad", "máster"],
            "una beca تعني منحة دراسية أو مساعدة مالية للتعليم."
        ),
        fill_ex(
            "ex-b1-est-2",
            "أكمل بالفعل الدال على التسجيل الجامعي في المصدر المنعكس",
            ["grammar", "writing"], 1,
            "اكتب الفعل المنعكس الذي يعني 'يسجل في الكلية' في المصدر: (_____ en la facultad)",
            "Para poder asistir a clase es obligatorio _____ en el sistema oficial.",
            "لتتمكن من حضور المحاضرات من الإلزامي التسجيل في النظام الرسمي.",
            ["matricularse", "facultad"],
            ["matricularse"],
            "فعل matricularse يعني يسجل في الكلية أو المدرسة."
        ),
        choice_ex(
            "ex-b1-est-3", "word_choice",
            "حدد الدرجة الأكاديمية للدراسات العليا بعد البكالوريوس",
            ["vocabulary"], 2,
            "ما اسم البرنامج الأكاديمي المتقدم بعد الانتهاء من درجة البكالوريوس (Grado)؟",
            "Después de terminar el grado universitario, decidió hacer un _____ de especialización.",
            "بعد إنهاء البكالوريوس الجامعي، قرر عمل ... تخصصي.",
            [
                opt("a", "máster", "ماجستير (الصواب)", True),
                opt("b", "beca", "منحة", False, "نحتاج اسم الدرجة الأكاديمية التالية."),
                opt("c", "expediente académico", "سجل درجات", False, "السجل وثيقة وليس البرنامج الأكاديمي نفسه.")
            ],
            ["máster", "grado universitario", "beca", "expediente académico"],
            "el máster هو درجة الماجستير التي تلي البكالوريوس."
        ),
        order_ex(
            "ex-b1-est-4",
            "رتّب الجملة لوصف تقديم السجل الأكاديمي للكلية",
            ["grammar", "writing"], 2,
            ["Entregó", "su", "expediente", "académico", "en", "la", "facultad"],
            "Entregó su expediente académico en la facultad",
            "الترتيب: الفعل Entregó ثم المفعول su expediente académico ثم المكان en la facultad.",
            ["expediente académico", "facultad"]
        ),
        choice_ex(
            "ex-b1-est-5", "listen_choose",
            "استمع للتسجيل وحدد المرحلة الجامعية التي يدرسها الطالب",
            ["listening", "vocabulary"], 2,
            "استمع للطالب وحدد درجته العلمية الحالية",
            "Estoy en el último curso del grado universitario de Medicina.",
            "أنا في السنة الأخيرة من درجة البكالوريوس الجامعي في الطب.",
            [
                opt("a", "grado universitario", "درجة البكالوريوس الجامعي (الصواب)", True),
                opt("b", "máster", "ماجستير", False, "الطالب قال بوضوح: 'del grado universitario de Medicina'."),
                opt("c", "beca", "منحة", False, "الطالب يحدد درجته الجامعية الحالية.")
            ],
            ["grado universitario", "máster", "beca"],
            "الطالب قال: 'del grado universitario de Medicina'.",
            audioKey="pending/b1_grado_universitario.mp3",
            speechEs="Estoy en el último curso del grado universitario de Medicina."
        ),
        speak_ex(
            "ex-b1-est-6",
            "انطق جملتك عن أهدافك الأكاديمية والمنحة الدراسية",
            ["speaking", "pronunciation"], 2,
            "انطق الجملة التالية بأسلوب أكاديمي فصيح:",
            "He solicitado una beca para estudiar un máster en la facultad de Ciencias.",
            "لقد تقدمت بطلب منحة لدراسة الماجستير في كلية العلوم.",
            "pending/b1_beca_estudiar_master.mp3",
            ["beca", "máster", "facultad"],
            "He solicitado una beca para estudiar un máster en la facultad de Ciencias.",
            "انتبه لنطق حرف d في solicitado و b في beca بدقة."
        )
    ]
    return lesson_doc(doc, exs, level="B1")


def make_lesson_expresar_duda_probabilidad():
    slug = "b1-expresar-duda-probabilidad"
    doc = {
        "slug": slug,
        "unitSlug": "b1-u4-study",
        "levelCode": "B1",
        "titleAr": "الشك والاحتمال: قواعد استخدام المنصوب والإخباري مع Quizás و Tal vez و Probablemente",
        "titleEs": "Expresar duda y probabilidad: Subjuntivo frente a Indicativo",
        "subtitleAr": "محددات اختيار صيغة المنصوب مع أدوات الشك، ودرجات اليقين والترجيح",
        "order": 2,
        "estimatedMinutes": 18,
        "cefrLevel": "B1",
        "review": review_block(),
        "pedagogy": {
            "learningObjectivesAr": [
                "أن يميز المتعلم بين استخدام المنصوب (Subjuntivo) والإخباري (Indicativo) مع أدوات الشك.",
                "أن يطبق القاعدة النحوية لأدوات: quizás, tal vez, probablemente, posiblemente.",
                "أن يتعرف على الأدوات التي تفرض المنصوب وجوباً (a lo mejor لا تأخذ إلا الإخباري، بينما puede que تأخذ المنصوب حتماً)."
            ],
            "grammarPoints": [
                {
                    "titleAr": "قواعد أدوات الشك والاحتمال",
                    "explanationAr": "1. **Quizás / Tal vez / Probablemente / Posiblemente**:\n- إذا جاءت في **أول الجملة**: يجوز بعدها **المنصوب** (إذا كان الشك كبيراً واليقين ضعيفاً) أو **الإخباري** (إذا كان المتحدث يرجح الحدوث):\n  * Quizás **venga** mañana (ربما يأتي غداً - شك أكبر).\n  * Quizás **viene** mañana (ربما يأتي غداً - ترجيح أكبر).\n- إذا جاءت في **وسط أو نهاية الجملة**: تأخذ **الإخباري فقط** (Vendrá tal vez / Viene quizás).\n2. **A lo mejor**: تأخذ دائماً صيغة **الإخباري Indicativo** فقط:\n- A lo mejor **llega** tarde (الخطأ الشائع: *A lo mejor llegue*).\n3. **Puede que**: تأخذ دائماً صيغة **المنصوب Subjuntivo** حتماً:\n- Puede que **tengamos** examen el lunes."
                }
            ],
            "commonMistakesAr": [
                "استخدام المنصوب بعد a lo mejor (الخطأ الأكثر شيوعاً عند الطلاب: *A lo mejor venga*؛ الصواب الحتمي: A lo mejor viene).",
                "استخدام الإخباري بعد puede que (الخطأ: *Puede que viene*؛ الصواب: Puede que venga)."
            ],
            "dialectNotes": [
                {
                    "region": "EG",
                    "noteAr": "في مصر بنقول: «يمكن ييجي بكرة، جايز الامتحان يتأجل، غالباً مش هلحق». بالإسبانية: Quizás venga mañana, puede que se aplace, probablemente no llegue."
                }
            ],
            "culturalNoteAr": "الإسبان في الحديث اليومي العفوي يفضلون استخدام 'A lo mejor' بكثرة للتعبير عن الاحتمال البسيط، مع الحفاظ الدائم على صيغة الإخباري معها."
        },
        "contentBlocks": [
            {
                "id": f"cb-{slug}-intro",
                "type": "explanation",
                "titleAr": "أدوات التعبير عن الشك والاحتمال",
                "bodyAr": "أهم التراكيب:\n- **quizás / tal vez**: ربما / قد (يأتي معها المنصوب أو الإخباري)\n- **a lo mejor**: يمكن / لعل (يأتي معها الإخباري فقط!)\n- **puede que**: من المحتمل أن (يأتي معها المنصوب وجوباً!)\n- **probablemente**: من المرجح / على الأرجح\n- **la duda**: الشك وعدم اليقين\n- **la probabilidad**: الاحتمالية والترجيح",
                "examples": [
                    {"es": "Quizás vayamos a la biblioteca por la tarde.", "ar": "ربما نذهب إلى المكتبة في فترة بعد الظهر (شك ومنصوب)."},
                    {"es": "A lo mejor aprueba el examen sin problemas.", "ar": "لعلّه ينجح في الامتحان بلا مشكلات (إخباري حتمي)."},
                    {"es": "Puede que no tengamos clase mañana.", "ar": "من المحتمل ألا يكون لدينا محاضرة غداً (منصوب حتمي)."}
                ]
            }
        ],
        "newVocabulary": ["quizás", "tal vez", "a lo mejor", "puede que", "probablemente", "duda"],
        "reviewVocabulary": ["seguro", "tiempo"]
    }

    exs = [
        choice_ex(
            "ex-b1-dud-1", "word_choice",
            "اختر الأداة التي تأخذ الإخباري Indicativo حصراً وبلا استثناء",
            ["grammar"], 1,
            "أي أداة احتمال تتطلب حتماً صيغة الإخباري (Indicativo) ولا تأخذ المنصوب أبداً؟",
            "_____ mañana hace buen tiempo y salimos al parque.",
            "... غداً يكون الطقس جميلاً ونخرج إلى الحديقة.",
            [
                opt("a", "A lo mejor", "تأخذ الإخباري دائماً (الصواب)", True),
                opt("b", "Puede que", "تفرض صيغة المنصوب وجوباً", False, "puede que تأخذ المنصوب وليس hace."),
                opt("c", "Es posible que", "تفرض صيغة المنصوب", False, "التركيب يتطلب المنصوب لو كان es posible que.")
            ],
            ["a lo mejor", "puede que", "duda"],
            "أداة A lo mejor تأخذ دائماً وبلا استثناء صيغة الإخباري Indicativo: A lo mejor hace."
        ),
        fill_ex(
            "ex-b1-dud-2",
            "أكمل صيغة المنصوب المطلوبة وجوباً بعد puede que",
            ["grammar", "writing"], 1,
            "صرف فعل tener في صيغة المنصوب الغائب المفرد بعد peut-être / puede que: (tenga)",
            "No estoy seguro, pero puede que el profesor _____ otra opinión.",
            "لست متأكداً، ولكن من المحتمل أن يكون للأستاذ رأي آخر.",
            ["puede que", "seguro"],
            ["tenga"],
            "بعد تركيب puede que يجب استخدام صيغة المنصوب: puede que tenga."
        ),
        choice_ex(
            "ex-b1-dud-3", "word_choice",
            "حدد صيغة الفعل بعد quizás الدالة على الشك الأكبر وعدم الجزم",
            ["grammar"], 2,
            "أي صيغة لفعل viajar تدل على الشك القوي بعد quizás في أول الجملة؟",
            "Quizás ellos _____ a España el próximo verano, pero no tienen billetes.",
            "ربما ... إلى إسبانيا في الصيف القادم، لكنهم لا يملكون تذاكر.",
            [
                opt("a", "viajen", "صيغة المنصوب للشك الأكبر (الصواب)", True),
                opt("b", "viajan", "مضارع إخباري لليقين الأكبر", False, "قال إنهم لا يملكون تذاكر فالشك أكبر وتناسبه viajen."),
                opt("c", "viajar", "مصدر", False, "نحتاج فعلاً مصرفاً مع ellos.")
            ],
            ["quizás", "duda"],
            "مع quizás في بداية الجملة، استخدام المنصوب viajen يعبر عن درجة شك قوية."
        ),
        order_ex(
            "ex-b1-dud-4",
            "رتّب الجملة للتعبير عن الاحتمال والترجيح",
            ["grammar", "writing"], 2,
            ["Probablemente", "lleguen", "a", "tiempo", "al", "aeropuerto"],
            "Probablemente lleguen a tiempo al aeropuerto",
            "الترتيب: الظرف Probablemente ثم الفعل بالمنصوب lleguen ثم a tiempo ثم الوجهة al aeropuerto.",
            ["probablemente", "tiempo"]
        ),
        choice_ex(
            "ex-b1-dud-5", "listen_choose",
            "استمع للتسجيل وحدد درجة الشك لدى المتحدث",
            ["listening", "vocabulary"], 2,
            "استمع للتسجيل وحدد هل المتحدث جازم بأمره أم يساوره شك",
            "Tengo muchas dudas; tal vez sea mejor esperar unos días más.",
            "لدي شكوك كثيرة؛ ربما يكون من الأفضل الانتظار بضعة أيام أخرى.",
            [
                opt("a", "tal vez", "شك واحتمال مع المنصوب (الصواب)", True),
                opt("b", "seguro", "يقين تام", False, "المتحدث قال: 'Tengo muchas dudas'."),
                opt("c", "a lo mejor", "إخباري فقط", False, "المتحدث استخدم tal vez sea.")
            ],
            ["tal vez", "duda", "seguro"],
            "المتحدث قال: 'Tengo muchas dudas; tal vez sea mejor'.",
            audioKey="pending/b1_dudas_tal_vez.mp3",
            speechEs="Tengo muchas dudas; tal vez sea mejor esperar unos días más."
        ),
        speak_ex(
            "ex-b1-dud-6",
            "انطق جملتك المعبرة عن الاحتمال الدراسي بالمنصوب",
            ["speaking", "pronunciation"], 2,
            "انطق الجملة التالية بوضوح مع إبراز صيغة المنصوب:",
            "Quizás obtengamos la beca si presentamos un buen proyecto.",
            "ربما نحصل على المنحة إذا قدمنا مشروعاً جيداً.",
            "pending/b1_quizas_obtengamos_beca.mp3",
            ["quizás", "duda"],
            "Quizás obtengamos la beca si presentamos un buen proyecto.",
            "انتبه لنطق حرف z في Quizás كـ ثاء ونطق obtengamos بطلاقة."
        )
    ]
    return lesson_doc(doc, exs, level="B1")


def make_lesson_planes_academicos():
    slug = "b1-planes-academicos"
    doc = {
        "slug": slug,
        "unitSlug": "b1-u4-study",
        "levelCode": "B1",
        "titleAr": "الخطط الأكاديمية والمستقبلية: التعبير عن النوايا والمشاريع الدراسية",
        "titleEs": "Planes académicos y proyectos de futuro",
        "subtitleAr": "تراكيب pensar + infinitivo, tener la intención de, y la voz de futuro",
        "order": 3,
        "estimatedMinutes": 18,
        "cefrLevel": "B1",
        "review": review_block(),
        "pedagogy": {
            "learningObjectivesAr": [
                "أن يعبر المتعلم عن مخططاته وطموحاته الأكاديمية والمهنية المستقبلية.",
                "أن يطبق التراكيب الدالة على النية والتخطيط: pensar + مصدر، tener la intención de + مصدر، querer especializarse en.",
                "أن يربط بين أهدافه الحالية وتطلعاته المستقبلية باستخدام أدوات الغرض: con el fin de, para que + subjuntivo."
            ],
            "grammarPoints": [
                {
                    "titleAr": "تراكيب التعبير عن النوايا والمشاريع المستقبلية",
                    "explanationAr": "1. **التعبير عن النية المسبقة**:\n- **Pensar + infinitivo**: Pienso matricularme en un doctorado el año que viene (أنوي التسجيل في الدكتوراه العام المقبل).\n- **Tener la intención de + infinitivo**: Tengo la intención de aprender dos lenguas más.\n2. **التعبير عن الهدف والغرض الموجه**:\n- **Con el objetivo / fin de + infinitivo**: Estudio con el objetivo de trabajar en organismos internacionales.\n- **Para que + Subjuntivo**: Me esfuerzo para que mis padres se sientan orgullosos.\n3. **التخصص والتعمق**:\n- **Especializarse en**: Quiero especializarme en inteligencia artificial aplicada a la lingüística."
                }
            ],
            "commonMistakesAr": [
                "استخدام *tengo intención para* بدلاً من حرف الجر السليم de: tener la intención de + infinitivo.",
                "استخدام الإخباري بعد para que بدلاً من المنصوب الإلزامي: para que + subjuntivo."
            ],
            "dialectNotes": [
                {
                    "region": "EG",
                    "noteAr": "في مصر بنقول: «ناوي أقدم على دبلومة أو ماستر عشان أتخصص في الترجمة الفورية». بالإسبانية: Pienso hacer un máster para especializarme en traducción simultánea."
                }
            ],
            "culturalNoteAr": "في إسبانيا يُنصح الطلاب دائماً بتحديد أهداف مشروع التخرج (TFG/TFM) بما يتوافق مع فرص التوظيف والتدريب العملي في الشركات (las prácticas en empresa)."
        },
        "contentBlocks": [
            {
                "id": f"cb-{slug}-intro",
                "type": "explanation",
                "titleAr": "مصطلحات التخطيط الأكاديمي",
                "bodyAr": "المفردات الأساسية:\n- **la intención**: النية والقصد المسبق\n- **especializarse**: يتخصص في مجال دقيق\n- **el objetivo**: الهدف الأكاديمي أو المهني\n- **la aspiración**: الطموح والتطلع المستقبلي\n- **las prácticas**: التدريب العملي في مؤسسة أو شركة\n- **conseguir**: يحقق أو ينال الهدف",
                "examples": [
                    {"es": "Mi aspiración académica es realizar una estancia de investigación en el extranjero.", "ar": "طموحي الأكاديمي هو قضاء فترة بحثية في الخارج."},
                    {"es": "Tengo la intención de especializarme en derecho internacional.", "ar": "لدي النية للتخصص في القانون الدولي."},
                    {"es": "Hará las prácticas en un hospital universitario prestigioso.", "ar": "سيجري التدريب العملي في مستشفى جامعي مرموق."}
                ]
            }
        ],
        "newVocabulary": ["intención", "especializarse", "objetivo", "aspiración", "prácticas", "conseguir"],
        "reviewVocabulary": ["estudio", "futuro"]
    }

    exs = [
        choice_ex(
            "ex-b1-pln-1", "word_choice",
            "اختر الفعل الذي يعني التعمق والتخصص في فرع علمي",
            ["vocabulary"], 1,
            "أي فعل يعني التركيز والتخصص في مجال أكاديمي محدد؟",
            "Al terminar la carrera médica, quiero _____ en cardiología.",
            "عند إنهاء الدراسة الجامعية، أريد ... في أمراض القلب.",
            [
                opt("a", "especializarme", "أتخصص في (الصواب)", True),
                opt("b", "aspiración", "طموح (اسم)", False, "نحتاج فعلاً بعد quiero وليس اسماً."),
                opt("c", "prácticas", "تدريب عملي", False, "prácticas اسم جمع ولا يكمل البناء.")
            ],
            ["especializarse", "aspiración", "prácticas"],
            "فعل especializarse en يعني يتخصص في فرع أو مجال محدد."
        ),
        fill_ex(
            "ex-b1-pln-2",
            "أكمل حرف الجر في تركيب النية: (tener la intención _____)",
            ["grammar", "writing"], 1,
            "أكمل بحرف الجر الصحيح في التعبير: tener la intención _____ viajar",
            "Tengo la intención _____ continuar mis estudios en el extranjero.",
            "لدي النية لمواصلة دراستي في الخارج.",
            ["intención"],
            ["de"],
            "التركيب النحوي هو tener la intención de + infinitivo."
        ),
        choice_ex(
            "ex-b1-pln-3", "word_choice",
            "حدد ما يطلق على التدريب التطبيقي في بيئة العمل للطلاب",
            ["vocabulary"], 2,
            "ما هو المصطلح الإسباني للتدريب الميداني للطلبة في الشركات والمؤسسات؟",
            "El próximo semestre voy a realizar mis _____ profesionales en una editorial.",
            "في الفصل الدراسي القادم سأجري ... المهنية في دار نشر.",
            [
                opt("a", "prácticas", "التدريب الميداني والعملي (الصواب)", True),
                opt("b", "intención", "النية", False, "المعنى يتطلب فترة التدريب العملي الميداني."),
                opt("c", "aspiración", "الطموح", False, "المصطلح الشائع للتدريب هو las prácticas.")
            ],
            ["prácticas", "intención", "aspiración"],
            "las prácticas profesionales هي فترة التدريب الميداني والعملي للطلاب."
        ),
        order_ex(
            "ex-b1-pln-4",
            "رتّب الجملة لوصف السعي لتحقيق الهدف الأكاديمي",
            ["grammar", "writing"], 2,
            ["Quiero", "conseguir", "mi", "objetivo", "en", "el", "futuro"],
            "Quiero conseguir mi objetivo en el futuro",
            "الترتيب: الفعل Quiero ثم المصدر conseguir ثم المفعول mi objetivo ثم الظرف en el futuro.",
            ["conseguir", "objetivo", "futuro"]
        ),
        choice_ex(
            "ex-b1-pln-5", "listen_choose",
            "استمع للتسجيل وحدد طموح الطالبة المستقبلي",
            ["listening", "vocabulary"], 2,
            "استمع للتسجيل وحدد ما هي الرغبة المستقبلية للمتحدثة",
            "Mi mayor aspiración es ser profesora universitaria y publicar investigaciones.",
            "أكبر طموح لدي هو أن أكون أستاذة جامعية وأن أنشر أبحاثاً علمية.",
            [
                opt("a", "aspiración", "طموح وتطلع أكاديمي (الصواب)", True),
                opt("b", "prácticas", "مجرد تدريب قصير", False, "المتحدثة وصفت هدف حياتها الأكاديمي (aspiración)."),
                opt("c", "intención", "نية مؤقتة", False, "المتحدثة قالت بوضوح: 'Mi mayor aspiración'.")
            ],
            ["aspiración", "prácticas", "intención"],
            "المتحدثة قالت: 'Mi mayor aspiración es ser profesora universitaria'.",
            audioKey="pending/b1_aspiracion_profesora.mp3",
            speechEs="Mi mayor aspiración es ser profesora universitaria y publicar investigaciones."
        ),
        speak_ex(
            "ex-b1-pln-6",
            "انطق خطتك المستقبلية للتخصص وإكمال الدراسات",
            ["speaking", "pronunciation"], 2,
            "انطق الجملة التالية بأسلوب طموح ومحدد:",
            "Pienso especializarme en lingüística con el objetivo de investigar.",
            "أنوي التخصص في اللسانيات بهدف إجراء البحوث العلمية.",
            "pending/b1_especializarme_linguistica.mp3",
            ["especializarse", "objetivo"],
            "Pienso especializarme en lingüística con el objetivo de investigar.",
            "انتبه لنطق حرف ü بالنقطتين (diéresis) في lingüística حيث ينطق واواً صريحة."
        )
    ]
    return lesson_doc(doc, exs, level="B1")


def make_lesson_debate_educacion():
    slug = "b1-debate-educacion"
    doc = {
        "slug": slug,
        "unitSlug": "b1-u4-study",
        "levelCode": "B1",
        "titleAr": "مناظرة وحوار: التعليم التقليدي مقابل التعليم عن بُعد والذكاء الاصطناعي",
        "titleEs": "Debate sobre modelos educativos y nuevas tecnologías",
        "subtitleAr": "المفاضلة بين النماذج التعليمية، تقديم البراهين، وتفنيد الحجج بلباقة",
        "order": 4,
        "estimatedMinutes": 18,
        "cefrLevel": "B1",
        "review": review_block(),
        "pedagogy": {
            "learningObjectivesAr": [
                "أن يشارك المتعلم في مناظرة فكرية وأكاديمية حول تحديات التعليم والتكنولوجيا.",
                "أن يقدم حججاً وبراهين منطقية: por un lado, por otro lado, desde mi punto de vista.",
                "أن يعترض ويفند آراء الطرف الآخر بلباقة: no comparto esa opinión, es cierto que... pero..."
            ],
            "grammarPoints": [
                {
                    "titleAr": "روابط المناظرة وتبادل الحجج الأكاديمية",
                    "explanationAr": "1. **عرض وجهتي نظر متقابلتين**:\n- **Por un lado / Por otro lado**: Por un lado, la educación presencial fomenta las relaciones sociales; por otro lado, la enseñanza online ofrece mayor flexibilidad.\n2. **الاعتراض الدبلوماسي**:\n- **Es verdad que..., pero...**: Es verdad que ahorra tiempo, pero se pierde el contacto directo con el profesor.\n- **No estoy del todo convencido de que + Subjuntivo**: No estoy convencido de que sea la mejor solución.\n3. **التلخيص والخلاصة**:\n- **En conclusión / Para resumir**: En conclusión, un modelo híbrido combina lo mejor de ambos mundos."
                }
            ],
            "commonMistakesAr": [
                "استخدام *en mi opinión yo creo* مكررة بلا داعٍ؛ الأفضل اختيار أسلوب واحد رصين: desde mi punto de vista أو en mi opinión.",
                "نسيان المنصوب بعد عبارات الشك في الاقتناع مثل no estoy convencido de que + subjuntivo."
            ],
            "dialectNotes": [
                {
                    "region": "EG",
                    "noteAr": "في مصر في النقاش بنقول: «من ناحية، التعليم الأونلاين بيوفر وقت، بس من ناحية تانية، اللمة في المدرج مفيدة». بالإسبانية: Por un lado ahorra tiempo, pero por otro lado el contacto presencial es clave."
                }
            ],
            "culturalNoteAr": "الجامعات الإسبانية واللاتينية تشجع بقوة أسلوب المناظرة الطلابية (los torneos de debate) لتطوير مهارات الإقناع والخطابة العامة."
        },
        "contentBlocks": [
            {
                "id": f"cb-{slug}-intro",
                "type": "explanation",
                "titleAr": "مصطلحات الحوار والمناظرة",
                "bodyAr": "المفردات التفاعلية:\n- **el debate**: المناظرة أو النقاش الفكري\n- **el argumento**: الحجة أو البرهان المنطقي\n- **convencer**: يُقنع بالدليل\n- **la ventaja**: الميزة أو الإيجابية\n- **el inconveniente**: العيب أو العقبة\n- **el punto de vista**: وجهة النظر",
                "examples": [
                    {"es": "El debate sobre la inteligencia artificial en la educación es fundamental.", "ar": "المناظرة حول الذكاء الاصطناعي في التعليم أمر جوهري."},
                    {"es": "Su argumento fue muy sólido y logró convencer al tribunal.", "ar": "كانت حجته متينة للغاية ونجح في إقناع لجنة التحكيم."},
                    {"es": "Debemos sopesar las ventajas y los inconvenientes de cada modelo.", "ar": "علينا أن نزن مزايا وعيوب كل نموذج بعناية."}
                ]
            }
        ],
        "newVocabulary": ["debate", "argumento", "convencer", "ventaja", "inconveniente", "punto de vista"],
        "reviewVocabulary": ["opinión", "educación"]
    }

    exs = [
        choice_ex(
            "ex-b1-deb-1", "word_choice",
            "اختر المفردة التي تعني البرهان أو الحجة المنطقية",
            ["vocabulary"], 1,
            "ما هي الكلمة الإسبانية المقابلة لـ 'حجة منطقية / دليل إقناع' في المناظرة؟",
            "Presentó un _____ muy convincente basado en datos estadísticos.",
            "قدم ... مقنعاً جداً مستنداً إلى بيانات إحصائية.",
            [
                opt("a", "argumento", "حجة / برهان (الصواب)", True),
                opt("b", "inconveniente", "عائق أو عيب", False, "inconveniente يعني سلبية أو عائق."),
                opt("c", "debate", "المناظرة ككل", False, "الدليل الفردي يسمى un argumento.")
            ],
            ["argumento", "inconveniente", "debate"],
            "un argumento هو الحجة أو البرهان المنطقي في النقاش."
        ),
        fill_ex(
            "ex-b1-deb-2",
            "أكمل بالفعل الدال على الإقناع والتأثير الفكري في المصدر",
            ["grammar", "writing"], 1,
            "اكتب الفعل الذي يعني 'يقنع الآخرين بحجته' في صيغة المصدر (convencer)",
            "Con sus explicaciones claras consiguió _____ a toda la audiencia.",
            "بتفسيراته الواضحة نجح في إقناع جميع الحاضرين.",
            ["convencer"],
            ["convencer"],
            "فعل convencer يعني يقنع الطرف الآخر بالدليل والبرهان."
        ),
        choice_ex(
            "ex-b1-deb-3", "word_choice",
            "حدد المصطلح الدال على العيب أو السلبية المقابلة للميزة",
            ["vocabulary"], 2,
            "ما هو المصطلح المقابل لكلمة ventaja (ميزة) والذي يعني عيباً أو سلبية؟",
            "El principal _____ de estudiar a distancia es la falta de interacción directa.",
            "... الرئيسي للدراسة عن بُعد هو قلة التفاعل المباشر.",
            [
                opt("a", "inconveniente", "العيب / السلبية (الصواب)", True),
                opt("b", "ventaja", "الميزة", False, "قلة التفاعل سلبية (inconveniente) وليست ميزة."),
                opt("c", "punto de vista", "وجهة نظر", False, "inconveniente هو المصطلح المحدد للعيب أو العائق.")
            ],
            ["inconveniente", "ventaja", "punto de vista"],
            "el inconveniente يعني العيب أو العقبة أو السلبية."
        ),
        order_ex(
            "ex-b1-deb-4",
            "رتّب الجملة للتعبير عن وجهة النظر الشخصية باحترام",
            ["grammar", "writing"], 2,
            ["Desde", "mi", "punto", "de", "vista", "es", "fundamental"],
            "Desde mi punto de vista es fundamental",
            "الترتيب: العبارة التمهيدية Desde mi punto de vista ثم الفعل والخبر es fundamental.",
            ["punto de vista"]
        ),
        choice_ex(
            "ex-b1-deb-5", "listen_choose",
            "استمع للتسجيل وحدد طبيعة الميزة المذكورة في التعليم",
            ["listening", "vocabulary"], 2,
            "استمع للمتحدث في المناظرة وحدد ما يصفه كأكبر فائدة",
            "La mayor ventaja de este sistema es que permite estudiar a cualquier hora.",
            "أكبر ميزة في هذا النظام أنه يسمح بالدراسة في أي وقت.",
            [
                opt("a", "ventaja", "ميزة وفائدة إيجابية (الصواب)", True),
                opt("b", "inconveniente", "عيب وسلبية", False, "المتحدث يتحدث عن ميزة وفائدة إيجابية (ventaja)."),
                opt("c", "argumento", "حجة مجردة", False, "المتحدث يحدد تحديداً: 'La mayor ventaja'.")
            ],
            ["ventaja", "inconveniente", "argumento"],
            "المتحدث قال: 'La mayor ventaja de este sistema'.",
            audioKey="pending/b1_mayor_ventaja_sistema.mp3",
            speechEs="La mayor ventaja de este sistema es que permite estudiar a cualquier hora."
        ),
        speak_ex(
            "ex-b1-deb-6",
            "انطق موقفك في المناظرة مقدماً الحجة والبينة",
            ["speaking", "pronunciation"], 2,
            "انطق الجملة التالية بأسلوب خطابي متزن في المناظرة:",
            "En este debate, debemos valorar tanto las ventajas como los inconvenientes.",
            "في هذه المناظرة، يجب أن نقدر كلاً من المزايا والعيوب.",
            "pending/b1_debate_valorar_ventajas.mp3",
            ["debate", "ventaja", "inconveniente"],
            "En este debate, debemos valorar tanto las ventajas como los inconvenientes.",
            "انتبه لنطق حرف b في debate وحرف v في ventajas كأصوات شفوية متسقة."
        )
    ]
    return lesson_doc(doc, exs, level="B1")
