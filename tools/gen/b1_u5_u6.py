# -*- coding: utf-8 -*-
"""B1 Units 5 (Independent Travel & Incidents) and 6 (Solving Problems & Formal Complaints).
8 Lessons completing B1 Units 5 and 6 based on:
- Aula Plus 3 (Unidades 1, 3, 5)
- Gramática del uso del español A1-B2 (Capítulos 82-86: Subjuntivo con verbos de sentimiento y molestia)
- Español 2000 Nivel Intermedio (Lecciones de reclamaciones, viajes y atención al cliente)
- المرشد في اللغة الأسبانية (صيغ الشكاوى الرسمية، والمشاعر بالمنصوب: me molesta que, me indigna que)
"""
import sys, os
sys.path.insert(0, os.path.dirname(__file__))
from common import opt, choice_ex, fill_ex, order_ex, speak_ex, lesson_doc, review_block

# ==============================================================================
# UNIT 5: b1-u5-independent-travel (السفر المستقل ومشكلات الرحلات)
# ==============================================================================

def make_lesson_viajes_imprevistos():
    slug = "b1-viajes-imprevistos"
    doc = {
        "slug": slug,
        "unitSlug": "b1-u5-independent-travel",
        "levelCode": "B1",
        "titleAr": "السفر المستقل والمواقف الطارئة: التعامل مع تأخر الرحلات وفقدان الأمتعة",
        "titleEs": "Viajes independientes y situaciones imprevistas",
        "subtitleAr": "إلغاء الرحلات، ضياع الحقائب، والتواصل مع مكاتب المساعدة في المطارات",
        "order": 1,
        "estimatedMinutes": 18,
        "cefrLevel": "B1",
        "review": review_block(),
        "pedagogy": {
            "learningObjectivesAr": [
                "أن يصف المتعلم عطلاً أو ظرفاً طارئاً أثناء السفر: avería, retraso, pérdida de equipaje, cancelación.",
                "أن يتواصل بفاعلية مع مكاتب الاستعلامات وشركات الطيران للمطالبة بحل عاجل.",
                "أن يستخدم أزمنة الماضي المناسبة لبيان تسلسل الأحداث غير المتوقعة."
            ],
            "grammarPoints": [
                {
                    "titleAr": "الحديث عن المفاجآت والظروف الطارئة في السفر",
                    "explanationAr": "1. **وصف الأحداث المفاجئة**:\n- **Surgir un imprevisto**: Nos ha surgido un imprevisto y hemos perdido la conexión (طرأ لنا ظرف غير متوقع وفاتتنا رحلة المتابعة).\n- **Quedarse tirado / varado**: Nos quedamos varados en el aeropuerto durante doce horas.\n2. **الاستفسار عن الحلول والتعويضات**:\n- ¿Qué solución nos ofrecen mientras esperamos? (ما الحل الذي تقدمونه لنا أثناء الانتظار؟).\n- ¿Tienen previsto facilitarnos alojamiento o vales de comida?"
                }
            ],
            "commonMistakesAr": [
                "استخدام كلمة *accidente* لأي مشكلة في الرحلة؛ إذا كان الأمر مجرد عطل أو تأخير فالأصح استخدام avería أو retraso أو imprevisto.",
                "الخلط بين perder (يفقد/يفوته القطار) و perderse (يضل الطريق)."
            ],
            "dialectNotes": [
                {
                    "region": "EG",
                    "noteAr": "في مصر بنقول: «الطيارة اتأخرت والشنطة ضاعت وطلع لنا ظرف طارئ في المطار». بالإسبانية: El vuelo se retrasó, se perdió la maleta y surgió un imprevisto."
                }
            ],
            "culturalNoteAr": "في المطارات الأوروبية، يحق للمسافر قانونياً الحصول على وجبات وإقامة فندقية مجانية وتعويض مالي إذا تجاوز تأخير الرحلة عدداً محدداً من الساعات بموجب لائحة حقوق الركاب (Reglamento CE 261/2004)."
        },
        "contentBlocks": [
            {
                "id": f"cb-{slug}-intro",
                "type": "explanation",
                "titleAr": "مفردات طوارئ السفر",
                "bodyAr": "المصطلحات الأساسية:\n- **el imprevisto**: الظرف الطارئ أو المفاجئ\n- **el retraso**: التأخير في الموعد\n- **la cancelación**: الإلغاء الكامل للرحلة\n- **el equipaje perdido**: الأمتعة المفقودة\n- **la indemnización**: التعويض المالي أو العيني\n- **el mostrador de información**: مكتب الاستعلامات والمساعدة",
                "examples": [
                    {"es": "Debido a un imprevisto meteorológico, el vuelo sufrió un retraso de tres horas.", "ar": "بسبب ظرف جوي طارئ، تعرضت الرحلة لتأخير مدته ثلاث ساعات."},
                    {"es": "Nos dirigimos al mostrador para reclamar el equipaje perdido.", "ar": "توجهنا إلى المكتب للمطالبة بالأمتعة المفقودة."},
                    {"es": "La aerolínea está obligada a pagar una indemnización por la cancelación.", "ar": "شركة الطيران ملزمة بدفع تعويض عن الإلغاء."}
                ]
            }
        ],
        "newVocabulary": ["imprevisto", "retraso", "cancelación", "equipaje perdido", "indemnización", "mostrador"],
        "reviewVocabulary": ["vuelo", "maleta"]
    }

    exs = [
        choice_ex(
            "ex-b1-via-1", "word_choice",
            "اختر المفردة التي تعني ظرفاً مفاجئاً غير مخطط له",
            ["vocabulary"], 1,
            "ما هي الكلمة الإسبانية المقابلة لـ 'ظرف طارئ / حدث غير متوقع'؟",
            "Tuvimos que cambiar de planes por culpa de un _____ de última hora.",
            "اضطررنا لتغيير خططنا بسبب ... في اللحظة الأخيرة.",
            [
                opt("a", "imprevisto", "ظرف طارئ ومفاجئ (الصواب)", True),
                opt("b", "mostrador", "مكتب استعلامات", False, "mostrador هو المكتب الفيزيائي وليس الحدث الطارئ."),
                opt("c", "indemnización", "تعويض مالي", False, "التعويض نتيجة وليس سبباً لتغيير الخطط.")
            ],
            ["imprevisto", "mostrador", "indemnización"],
            "un imprevisto هو الأمر المفاجئ أو الظرف الطارئ غير المحسوب."
        ),
        fill_ex(
            "ex-b1-via-2",
            "أكمل بالمصطلح الذي يعني التعويض المالي للمسافر",
            ["vocabulary", "writing"], 1,
            "اكتب الكلمة الإسبانية المؤنثة التي تعني 'تعويض / جبر الضرر' (la _____)",
            "Los pasajeros tienen derecho a solicitar una _____ económica por el retraso.",
            "يحق للركاب طلب تعويض مالي عن التأخير.",
            ["indemnización", "retraso"],
            ["indemnización", "indemnizacion"],
            "كلمة indemnización تعني التعويض المالي أو القانوني."
        ),
        choice_ex(
            "ex-b1-via-3", "word_choice",
            "حدد حالة الرحلة عندما يتم إلغاؤها نهائياً",
            ["vocabulary"], 2,
            "ما هو المصطلح الدال على إلغاء الرحلة بالكامل وعدم إقلاعها؟",
            "La compañía anunció la _____ definitiva del vuelo por huelga general.",
            "أعلنت الشركة ... النهائي للرحلة بسبب إضراب عام.",
            [
                opt("a", "cancelación", "الإلغاء (الصواب)", True),
                opt("b", "retraso", "تأخير زمني فقط", False, "قال إنها لم تقلع نهائياً فالأمر إلغاء وليس مجرد تأخير."),
                opt("c", "equipaje perdido", "أمتعة ضائعة", False, "الإعلان يخص مصير الرحلة الجوية.")
            ],
            ["cancelación", "retraso", "equipaje perdido", "vuelo"],
            "la cancelación تعني إلغاء الرحلة بالكامل."
        ),
        order_ex(
            "ex-b1-via-4",
            "رتّب الجملة للتوجه إلى مكتب الاستعلامات في المطار",
            ["grammar", "writing"], 2,
            ["Vamos", "al", "mostrador", "para", "reclamar", "la", "maleta"],
            "Vamos al mostrador para reclamar la maleta",
            "الترتيب: الفعل والوجهة Vamos al mostrador ثم الغرض para reclamar la maleta.",
            ["mostrador", "maleta"]
        ),
        choice_ex(
            "ex-b1-via-5", "listen_choose",
            "استمع للتسجيل وحدد سبب توجه المسافر للمكتب",
            ["listening", "vocabulary"], 2,
            "استمع لنداء المطار وحدد المشكلة التي أعلن عنها",
            "El vuelo con destino a Barcelona sufre un retraso de dos horas.",
            "الرحلة المتجهة إلى برشلونة تعاني من تأخير مدته ساعتان.",
            [
                opt("a", "retraso", "تأخير في موعد الإقلاع (الصواب)", True),
                opt("b", "cancelación", "إلغاء نهائي", False, "النداء أعلن تأخيراً لساعتين وليس إلغاءً."),
                opt("c", "imprevisto", "ظرف غير محدد", False, "المتحدث حدد المشكلة تحديداً بـ retraso.")
            ],
            ["retraso", "cancelación", "imprevisto", "vuelo"],
            "المتحدث قال: 'sufre un retraso de dos horas'.",
            audioKey="pending/b1_vuelo_sufre_retraso.mp3",
            speechEs="El vuelo con destino a Barcelona sufre un retraso de dos horas."
        ),
        speak_ex(
            "ex-b1-via-6",
            "انطق بلاغك عن فقدان حقائب السفر في المطار",
            ["speaking", "pronunciation"], 2,
            "انطق الجملة التالية بوضوح لموظف مفقودات المطار:",
            "He llegado en este vuelo pero mi equipaje no aparece en la cinta.",
            "وصلت على متن هذه الرحلة لكن أمتعتي لا تظهر على سير الحقائب.",
            "pending/b1_equipaje_no_aparece.mp3",
            ["equipaje perdido", "vuelo"],
            "He llegado en este vuelo pero mi equipaje no aparece en la cinta.",
            "انتبه لنطق حرف ll كـ ياء مشبعة في llegado ونطق j في equipaje كـ خاء مرققة."
        )
    ]
    return lesson_doc(doc, exs, level="B1")


def make_lesson_reclamaciones_viaje():
    slug = "b1-reclamaciones-viaje"
    doc = {
        "slug": slug,
        "unitSlug": "b1-u5-independent-travel",
        "levelCode": "B1",
        "titleAr": "شكاوى السفر والخدمات السياحية: المطالبة بالتعويض وحقوق النزيل",
        "titleEs": "Reclamaciones de viaje y derechos del viajero",
        "subtitleAr": "تقديم شكوى لفندق أو وكالة سفر، طلب استرداد المبلغ، وتوثيق الأضرار",
        "order": 2,
        "estimatedMinutes": 18,
        "cefrLevel": "B1",
        "review": review_block(),
        "pedagogy": {
            "learningObjectivesAr": [
                "أن يقدم المتعلم شكوى شفهية أو كتابية واضحة ضد فندق أو شركة طيران أو وكالة سفر.",
                "أن يطلب استرداد المبلغ المدفوع أو تعويضاً مناسباً: solicitar un reembolso, exigir una compensación.",
                "أن يوثق الإخلال بالخدمة المتعاقد عليها بأدلة موضوعية."
            ],
            "grammarPoints": [
                {
                    "titleAr": "صيغ المطالبة والاحتجاج في الخدمات السياحية",
                    "explanationAr": "1. **المطالبة بالحقوق واسترداد الأموال**:\n- **Exigir / Solicitar el reembolso**: Exijo el reembolso íntegro del billete por no haber recibido el servicio contratado.\n2. **التعبير عن الإخلال بالعقد**:\n- Las condiciones no se correspondían con lo anunciado (لم تتطابق الشروط مع ما تم الإعلان عنه).\n- El hotel carecía de los servicios prometidos (افتقر الفندق إلى الخدمات الموعودة).\n3. **استخدام صيغ التهذيب الحازم**:\n- Les ruego que solucionen esta situación de inmediato / Me veo en la obligación de reclamar."
                }
            ],
            "commonMistakesAr": [
                "استخدام كلمات عامة مثل *quiero mi dinero* بدلاً من التعبير القانوني والسياحي السليم exijo el reembolso.",
                "ترجمة 'الإخلال بالوعد' حرفياً؛ المصطلح الأدق هو incumplimiento del contrato أو no cumplir con lo prometido."
            ],
            "dialectNotes": [
                {
                    "region": "EG",
                    "noteAr": "في مصر بنقول: «الأوضة مفيهاش تكييف عكس ما حجزت، وعايز أسترد فلوسي كلها فوراً». بالإسبانية: La habitación no coincide con la reserva y exijo el reembolso total."
                }
            ],
            "culturalNoteAr": "في إسبانيا والاتحاد الأوروبي، يحق للمستهلك طلب وثيقة رسمية تسمى 'Hoja de reclamaciones' في أي منشأة سياحية أو تجارية بموجب القانون الإلزامي."
        },
        "contentBlocks": [
            {
                "id": f"cb-{slug}-intro",
                "type": "explanation",
                "titleAr": "مصطلحات الشكاوى السياحية",
                "bodyAr": "المفردات المفتاحية:\n- **la reclamación**: الشكوى الرسمية أو المطالبة\n- **el reembolso**: استرداد المبلغ المالي المدفوع\n- **exigir**: يطالب بحزم وجدية\n- **el incumplimiento**: الإخلال بالعقد أو عدم الالتزام\n- **el justificante**: الإيصال أو المستند الثبوتي للحق\n- **la compensación**: التعويض عن الضرر",
                "examples": [
                    {"es": "Presenté una reclamación formal por las malas condiciones del hotel.", "ar": "قدمت شكوى رسمية بسبب سوء أوضاع الفندق."},
                    {"es": "Exijo el reembolso de la estancia por incumplimiento de lo acordado.", "ar": "أطالب باسترداد تكلفة الإقامة بسبب الإخلال بما تم الاتفاق عليه."},
                    {"es": "Guarde el justificante de pago para tramitar la indemnización.", "ar": "احتفظ بإيصال الدفع لمتابعة إجراءات التعويض."}
                ]
            }
        ],
        "newVocabulary": ["reclamación", "reembolso", "exigir", "incumplimiento", "justificante", "compensación"],
        "reviewVocabulary": ["hotel", "dinero"]
    }

    exs = [
        choice_ex(
            "ex-b1-rec-1", "word_choice",
            "اختر المفردة التي تعني استرجاع المبلغ المالي المدفوع",
            ["vocabulary"], 1,
            "ما هو المصطلح السياحي والقانوني لـ 'استرداد أموال الحجز'؟",
            "Si cancelan el viaje, los clientes tienen derecho al _____ total.",
            "إذا ألغوا الرحلة، يحق للعملاء ... الكامل لأموالهم.",
            [
                opt("a", "reembolso", "استرداد المبلغ المدفوع (الصواب)", True),
                opt("b", "incumplimiento", "إخلال بالعقد", False, "العميل يسترد أمواله (reembolso) نتيجة الإلغاء."),
                opt("c", "justificante", "إيصال أو فاتورة", False, "المال المسترد يسمى reembolso.")
            ],
            ["reembolso", "incumplimiento", "justificante"],
            "el reembolso يعني استرداد المبلغ المالي المدفوع كاملاً أو جزئياً."
        ),
        fill_ex(
            "ex-b1-rec-2",
            "أكمل بالفعل الدال على المطالبة الحازمة بالحق (exigir)",
            ["grammar", "writing"], 1,
            "صرف فعل المطالبة الحازمة مع المتكلم yo في الحاضر: (exijo)",
            "Ante esta situación tan desagradable, _____ hablar con el director.",
            "أمام هذا الموقف غير المقبول إطلاقاً، أطالب بالتحدث مع المدير.",
            ["exigir"],
            ["exijo", "Exijo"],
            "تصريف فعل exigir مع yo في الحاضر البسيط هو exijo (مع تحويل g إلى j للحفاظ على الصوت)."
        ),
        choice_ex(
            "ex-b1-rec-3", "word_choice",
            "حدد الوثيقة الرسمية المثبتة لعملية الدفع والحجز",
            ["vocabulary"], 2,
            "ماذا نسمي الإيصال أو المستند الورقي الذي يثبت دفعك للمبلغ؟",
            "Para tramitar la reclamación es imprescindible adjuntar el _____ de la reserva.",
            "لمتابعة إجراءات الشكوى من الضروري إرفاق ... الخاص بالحجز.",
            [
                opt("a", "justificante", "إيصال الإثبات والمستند (الصواب)", True),
                opt("b", "incumplimiento", "الإخلال", False, "نحتاج اسم الوثيقة المرفقة justificante."),
                opt("c", "compensación", "التعويض", False, "المستند هو justificante.")
            ],
            ["justificante", "reclamación", "incumplimiento", "compensación"],
            "el justificante هو إيصال الإثبات أو السند الورقي."
        ),
        order_ex(
            "ex-b1-rec-4",
            "رتّب الجملة للمطالبة بتقديم ورقة الشكاوى الرسمية في الفندق",
            ["grammar", "writing"], 2,
            ["Quiero", "poner", "una", "reclamación", "por", "el", "servicio"],
            "Quiero poner una reclamación por el servicio",
            "الترتيب: صيغة المبتدأ Quiero poner ثم المفعول una reclamación ثم السبب por el servicio.",
            ["reclamación"]
        ),
        choice_ex(
            "ex-b1-rec-5", "listen_choose",
            "استمع للتسجيل وحدد الإجراء الذي يطالب به العميل",
            ["listening", "vocabulary"], 2,
            "استمع لمكالمة العميل مع الشركة وحدد ما يطالب به",
            "Considero que ha habido un claro incumplimiento de las condiciones pactadas.",
            "أعتبر أنه قد حدث إخلال واضح بالشروط المتفق عليها.",
            [
                opt("a", "incumplimiento", "إخلال بالشروط والاتفاق (الصواب)", True),
                opt("b", "reembolso", "طلب مال فقط", False, "العميل أكد على وقوع الإخلال الصريح (incumplimiento)."),
                opt("c", "justificante", "إيصال", False, "العميل يحتج بحدوث إخلال بالشروط.")
            ],
            ["incumplimiento", "reembolso", "justificante"],
            "العميل قال: 'ha habido un claro incumplimiento de las condiciones'.",
            audioKey="pending/b1_incumplimiento_condiciones.mp3",
            speechEs="Considero que ha habido un claro incumplimiento de las condiciones pactadas."
        ),
        speak_ex(
            "ex-b1-rec-6",
            "انطق مطالبتك الرسمية بالتعويض المالي عن سوء الخدمة",
            ["speaking", "pronunciation"], 2,
            "انطق الجملة التالية بلهجة حازمة ومهذبة لمسؤول الفندق:",
            "Exijo una compensación adecuada y el reembolso de esta noche de estancia.",
            "أطالب بتعويض مناسب واسترداد قيمة هذه الليلة من الإقامة.",
            "pending/b1_exijo_compensacion_reembolso.mp3",
            ["exigir", "compensación", "reembolso"],
            "Exijo una compensación adecuada y el reembolso de esta noche de estancia.",
            "انتبه لنطق j في Exijo كـ خاء صريحة ونطق s في compensación بنقاء."
        )
    ]
    return lesson_doc(doc, exs, level="B1")


def make_lesson_alojamiento_alternativo():
    slug = "b1-alojamiento-alternativo"
    doc = {
        "slug": slug,
        "unitSlug": "b1-u5-independent-travel",
        "levelCode": "B1",
        "titleAr": "أنماط الإقامة البديلة: بيوت الشباب والسياحة الريفية وتبادل المنازل",
        "titleEs": "Alojamientos alternativos: Albergues, casas rurales e intercambio",
        "subtitleAr": "مقارنة أنواع السكن السياحي، تجربة البيوت الريفية، والمشاركة في النفقات",
        "order": 3,
        "estimatedMinutes": 18,
        "cefrLevel": "B1",
        "review": review_block(),
        "pedagogy": {
            "learningObjectivesAr": [
                "أن يقارن المتعلم بين الفنادق التقليدية وخيارات الإقامة البديلة: albergue juvenil, casa rural, intercambio de casas.",
                "أن يصف مرافق وخدمات بيت الشباب والبيت الريفي: habitación compartida, cocina comunitaria, entorno natural.",
                "أن يتفاوض حول قواعد التعايش المشترك وتقاسم المساحات والنفقات."
            ],
            "grammarPoints": [
                {
                    "titleAr": "المقارنة والتفضيل في خيارات الإقامة",
                    "explanationAr": "1. **المفاضلة بين الأنماط**:\n- **Preferir + sustantivo / infinitivo**: Prefiero alojarme en una casa rural antes que en un gran hotel de ciudad.\n- **Resultar más económico**: El albergue juvenil resulta mucho más económico para mochileros.\n2. **التعبير عن البيئة والأجواء**:\n- **Estar rodeado de**: La casa rural está rodeada de naturaleza y tranquilidad.\n- **Compartir zonas comunes**: En el albergue compartimos la cocina y los baños."
                }
            ],
            "commonMistakesAr": [
                "ترجمة 'بيت الشباب' بـ *casa de jóvenes*؛ المصطلح المعياري المعتمد في كل إسبانيا هو el albergue juvenil.",
                "استخدام حرف الجر con بدلاً من de بعد rodeado (الصحيح: rodeado de naturaleza)."
            ],
            "dialectNotes": [
                {
                    "region": "EG",
                    "noteAr": "في مصر بنقول: «هنأجر بيت في الريف أو نقعد في بيت شباب عشان نوفر ونستمتع بالطبيعة». بالإسبانية: Nos alojaremos en una casa rural o un albergue para ahorrar y disfrutar de la naturaleza."
                }
            ],
            "culturalNoteAr": "السياحة الريفية (el turismo rural) وقضاء عطلات نهاية الأسبوع في بيوت القرى الجبلية (casas rurales) من أحب التقاليد العائلية لدى الإسبان للهروب من ضغوط المدن الكبرى."
        },
        "contentBlocks": [
            {
                "id": f"cb-{slug}-intro",
                "type": "explanation",
                "titleAr": "مصطلحات السكن البديل والريفي",
                "bodyAr": "المفردات الأساسية:\n- **el albergue juvenil**: بيت الشباب / الهوستل\n- **la casa rural**: البيت الريفي السياحي\n- **la habitación compartida**: الغرفة المشتركة (Dormitorio)\n- **el entorno natural**: المحيط أو البيئة الطبيعية\n- **el intercambio de casas**: تبادل المنازل لقضاء العطلة\n- **la convivencia**: التعايش المشترك واحترام الآخرين",
                "examples": [
                    {"es": "Nos alojamos en un albergue juvenil con habitaciones compartidas muy limpias.", "ar": "أقمنا في بيت شباب بغرف مشتركة نظيفة للغاية."},
                    {"es": "Alquilamos una casa rural situada en un entorno natural privilegiado.", "ar": "استأجرنا بيتاً ريفياً يقع في محيط طبيعي مميز."},
                    {"es": "La buena convivencia es esencial cuando se comparten zonas comunes.", "ar": "التعايش الطيب أساسي عند التشارك في المساحات المشتركة."}
                ]
            }
        ],
        "newVocabulary": ["albergue juvenil", "casa rural", "habitación compartida", "entorno natural", "intercambio de casas", "convivencia"],
        "reviewVocabulary": ["naturaleza", "alojarse"]
    }

    exs = [
        choice_ex(
            "ex-b1-alo-1", "word_choice",
            "اختر المفردة التي تعني بيوت الشباب الاقتصادية للرحالة",
            ["vocabulary"], 1,
            "ما هو المصطلح الإسباني لـ 'بيت الشباب' المفضل للمسافرين الشباب؟",
            "Para no gastar mucho dinero, los estudiantes durmieron en un _____.",
            "لكي لا ينفقوا أموالاً كثيرة، نام الطلاب في ...",
            [
                opt("a", "albergue juvenil", "بيت الشباب (الصواب)", True),
                opt("b", "casa rural", "بيت ريفي", False, "الخيار الاقتصادي الجماعي الشائع للطلاب هو albergue juvenil."),
                opt("c", "entorno natural", "محيط طبيعي", False, "نحتاج اسم مكان السكن والإيواء.")
            ],
            ["albergue juvenil", "casa rural", "entorno natural"],
            "el albergue juvenil هو بيت الشباب المخصص للرحالة والطلاب."
        ),
        fill_ex(
            "ex-b1-alo-2",
            "أكمل المصطلح الخاص بالسياحة والإقامة الريفية: (casa _____)",
            ["vocabulary", "writing"], 1,
            "اكتب الصفة الإسبانية المؤنثة للبيت الريفي المخصص للاستجمام في الطبيعة: (casa _____)",
            "Pasamos un fin de semana inolvidable en una casa _____ en Asturias.",
            "قضينا عطلة نهاية أسبوع لا تُنسى في بيت ريفي في أستورياس.",
            ["casa rural"],
            ["rural"],
            "المصطلح هو la casa rural وتعني البيت الريفي السياحي."
        ),
        choice_ex(
            "ex-b1-alo-3", "word_choice",
            "حدد مفهوم الاحترام والعيش المشترك في الأماكن التشاركية",
            ["vocabulary"], 2,
            "ما هي القيمة الاجتماعية التي تعني 'التعايش المشترك والتوافق'؟",
            "En el albergue es imprescindible respetar las normas de _____.",
            "في بيت الشباب من الضروري احترام قواعد ...",
            [
                opt("a", "convivencia", "التعايش المشترك (الصواب)", True),
                opt("b", "habitación compartida", "غرفة مشتركة", False, "القواعد تخص أسلوب التعايش (convivencia)."),
                opt("c", "intercambio de casas", "تبادل المنازل", False, "المعنى يتعلق بقواعد العيش المشترك.")
            ],
            ["convivencia", "habitación compartida", "intercambio de casas", "albergue juvenil"],
            "la convivencia تعني التعايش المشترك بين الأفراد باحترام متبادل."
        ),
        order_ex(
            "ex-b1-alo-4",
            "رتّب الجملة لوصف موقع البيت الريفي في قلب الطبيعة",
            ["grammar", "writing"], 2,
            ["La", "casa", "rural", "está", "en", "un", "entorno", "natural"],
            "La casa rural está en un entorno natural",
            "الترتيب: المبتدأ La casa rural ثم الفعل está ثم شبه الجملة en un entorno natural.",
            ["casa rural", "entorno natural"]
        ),
        choice_ex(
            "ex-b1-alo-5", "listen_choose",
            "استمع للتسجيل وحدد نوع الغرفة في بيت الشباب",
            ["listening", "vocabulary"], 2,
            "استمع لحديث الرحالة وحدد نوع الغرفة التي حجزها",
            "He reservado una cama en una habitación compartida de seis plazas.",
            "حجزت سريراً في غرفة مشتركة تسع ستة أفراد.",
            [
                opt("a", "habitación compartida", "غرفة مشتركة (الصواب)", True),
                opt("b", "casa rural", "بيت ريفي خاص", False, "المتحدث حجز سريراً في غرفة مشتركة."),
                opt("c", "intercambio de casas", "تبادل بيوت", False, "المتحدث وصف سكنه في غرفة نوم جماعية.")
            ],
            ["habitación compartida", "casa rural", "intercambio de casas"],
            "المتحدث قال: 'una cama en una habitación compartida'.",
            audioKey="pending/b1_cama_habitacion_compartida.mp3",
            speechEs="He reservado una cama en una habitación compartida de seis plazas."
        ),
        speak_ex(
            "ex-b1-alo-6",
            "انطق تفضيلك للإقامة في الطبيعة والاستجمام الريفي",
            ["speaking", "pronunciation"], 2,
            "انطق الجملة التالية بأسلوب معبر عن حب الطبيعة والاسترخاء:",
            "Prefiero alojarme en una casa rural rodeada de un bello entorno natural.",
            "أفضل الإقامة في بيت ريفي محاط بمحيط طبيعي جميل.",
            "pending/b1_alojarme_casa_rural.mp3",
            ["casa rural", "entorno natural", "alojarse"],
            "Prefiero alojarme en una casa rural rodeada de un bello entorno natural.",
            "انتبه لنطق حرف r في casa rural و entorno بنقاء صوتي واضح."
        )
    ]
    return lesson_doc(doc, exs, level="B1")


def make_lesson_guia_consejos_viajero():
    slug = "b1-guia-consejos-viajero"
    doc = {
        "slug": slug,
        "unitSlug": "b1-u5-independent-travel",
        "levelCode": "B1",
        "titleAr": "دليل المسافر المستقل: نصائح الأمان والميزانية والتنقل الذكي",
        "titleEs": "Guía práctica y consejos para el viajero independiente",
        "subtitleAr": "نصائح تجنب الاحتيال، بطاقات النقل السياحية، وتوفير النفقات",
        "order": 4,
        "estimatedMinutes": 18,
        "cefrLevel": "B1",
        "review": review_block(),
        "pedagogy": {
            "learningObjectivesAr": [
                "أن يقدم المتعلم توصيات وإرشادات سياحية عملية للمسافرين الآخرين مستخدماً المنصوب والأمر.",
                "أن يقدم نصائح لتفادي النصب وتأمين المقتنيات: precauciones, evitar timos, cuidar pertenencias.",
                "أن يشرح طرق التوفير في المواصلات والتذاكر السياحية المدمجة: abono transporte, tarjeta turística."
            ],
            "grammarPoints": [
                {
                    "titleAr": "صيغ التوصية والنصيحة للمسافر",
                    "explanationAr": "1. **التوصية باستخدام صيغة المنصوب (Subjuntivo)**:\n- **Recomiendo / Aconsejo que + Subjuntivo**: Recomiendo que compres el abono de transporte con antelación (أنصحك بأن تشتري بطاقة النقل مسبقاً).\n- **Es aconsejable que + Subjuntivo**: Es aconsejable que lleves una copia de tu pasaporte en la nube.\n2. **التحذير والاحتياط**:\n- **Tener cuidado con**: Ten cuidado con los carteristas en las zonas concurridas (احذر من النشالين في الأماكن المزدحمة).\n- **Tomar precauciones**: Conviene tomar ciertas precauciones con el dinero en efectivo."
                }
            ],
            "commonMistakesAr": [
                "استخدام المضارع الإخباري بعد recomiendo que (الخطأ: *Recomiendo que compras*، والصواب: Recomiendo que compres بالمنصوب).",
                "ترجمة 'النشال' حرفياً بـ *ladrón de bolsillos*؛ الكلمة الإسبانية اليومية المحددة هي el carterista."
            ],
            "dialectNotes": [
                {
                    "region": "EG",
                    "noteAr": "في مصر بننصح المسافر ونقوله: «خلي بالك من محفظتك في الزحمة، واشتري كارت المترو السياحي عشان توفر فلوس». بالإسبانية: Ten cuidado con la cartera en el metro y saca el abono turístico."
                }
            ],
            "culturalNoteAr": "معظم المدن الإسبانية الكبرى كـ مدريد وبرشلونة تقدم بطاقات سياحية تشمل ركوب المترو والحافلات غير المحدود وتخفيضات كبرى على دخول المتاحف (como el abono turístico)."
        },
        "contentBlocks": [
            {
                "id": f"cb-{slug}-intro",
                "type": "explanation",
                "titleAr": "مصطلحات دليل السفر والتوفير",
                "bodyAr": "المفردات التوجيهية:\n- **la precaución**: الحيطة والاحتياط الوقائي\n- **el abono de transporte**: بطاقة وتذكرة الاشتراك في المواصلات العامة\n- **el carterista**: النشال في الأماكن المزدحمة\n- **el timo**: الاحتيال أو الخدعة السياحية (timo / estafa)\n- **ahorrar**: يوفر ويدخر المال\n- **la recomendación**: التوصية والنصيحة المفيدة",
                "examples": [
                    {"es": "Conviene tomar precauciones para evitar los timos habituales a turistas.", "ar": "ينبغي أخذ الحيطة لتجنب الاحتيالات المعتادة على السياح."},
                    {"es": "Comprar el abono de transporte permite ahorrar mucho dinero en la ciudad.", "ar": "شراء بطاقة المواصلات يتيح توفير الكثير من المال في المدينة."},
                    {"es": "Siga estas recomendaciones para disfrutar de un viaje seguro y económico.", "ar": "اتبع هذه التوصيات للاستمتاع برحلة آمنة واقتصادية."}
                ]
            }
        ],
        "newVocabulary": ["precaución", "abono de transporte", "carterista", "timo", "ahorrar", "recomendación"],
        "reviewVocabulary": ["seguridad", "ciudad"]
    }

    exs = [
        choice_ex(
            "ex-b1-gui-1", "word_choice",
            "اختر صيغة المنصوب الصحيحة بعد فعل التوصية te aconsejo que",
            ["grammar"], 1,
            "أي صيغة فعلية تناسب النصيحة بعد تركيب Te aconsejo que؟",
            "Te aconsejo que _____ el billete turístico por internet.",
            "أنصحك بأن ... التذكرة السياحية عبر الإنترنت.",
            [
                opt("a", "compres", "صيغة المنصوب الحاضر (الصواب بعد aconsejo que)", True),
                opt("b", "compras", "مضارع إخباري لا يصح بعد أفعال التوصية", False, "أفعال التوصية والنصيحة تتطلب صيغة المنصوب Subjuntivo."),
                opt("c", "comprar", "مصدر لا يناسب وجود الفاعل tú", False, "مع وجود que والفاعل tú يجب تصريف الفعل بالمنصوب.")
            ],
            ["recomendación"],
            "بعد أفعال النصيحة والتوصية (aconsejar que / recomendar que) نستخدم المنصوب: aconsejo que compres."
        ),
        fill_ex(
            "ex-b1-gui-2",
            "أكمل بالمصطلح الذي يعني بطاقة الاشتراك في شبكة المواصلات: (el _____ de transporte)",
            ["vocabulary", "writing"], 1,
            "اكتب الكلمة الناقصة في مصطلح بطاقة الاشتراك: (el _____ de transporte)",
            "Para moverte en metro y autobús es muy rentable adquirir el _____ de transporte.",
            "للتنقل بالمترو والحافلة من المجدي للغاية شراء ... النقل.",
            ["abono de transporte"],
            ["abono"],
            "المصطلح هو el abono de transporte ويعني بطاقة الاشتراك أو التذكرة الشاملة."
        ),
        choice_ex(
            "ex-b1-gui-3", "word_choice",
            "حدد المصطلح الدال على السارق الذي يخطف المحافظ في الزحام",
            ["vocabulary"], 2,
            "ما هي الكلمة الإسبانية التي تطلق على النشال في محطات المترو والأماكن المكتظة؟",
            "En las estaciones concurridas hay que vigilar la mochila por los _____.",
            "في المحطات المزدحمة يجب الانتباه للحقيبة بسبب ...",
            [
                opt("a", "carteristas", "النشالون (الصواب)", True),
                opt("b", "precauciones", "احتياطات", False, "نحتاج اسم الأشخاص الذين يسرقون المحافظ."),
                opt("c", "recomendaciones", "توصيات", False, "التحذير موجه من النشالين carteristas.")
            ],
            ["carterista", "precaución", "recomendación"],
            "los carteristas هم النشالون الذين يستهدفون المحافظ في الزحام."
        ),
        order_ex(
            "ex-b1-gui-4",
            "رتّب الجملة للتأكيد على ضرورة أخذ الحيطة لتفادي الاحتيال",
            ["grammar", "writing"], 2,
            ["Hay", "que", "tomar", "precauciones", "para", "evitar", "el", "timo"],
            "Hay que tomar precauciones para evitar el timo",
            "الترتيب: العبارة الإلزامية Hay que tomar precauciones ثم الغرض para evitar el timo.",
            ["precaución", "timo"]
        ),
        choice_ex(
            "ex-b1-gui-5", "listen_choose",
            "استمع للتسجيل وحدد أفضل نصيحة لتوفير المال في السفر",
            ["listening", "vocabulary"], 2,
            "استمع للمرشد السياحي وحدد ما يقترحه لتقليل النفقات",
            "Cocinar en el albergue te permite ahorrar una gran parte del presupuesto.",
            "الطهي في بيت الشباب يسمح لك بتوفير جزء كبير من الميزانية.",
            [
                opt("a", "ahorrar", "توفير وادخار النفقات (الصواب)", True),
                opt("b", "timo", "احتيال", False, "المرشد يقدم نصيحة لتوفير المال (ahorrar)."),
                opt("c", "carterista", "نشال", False, "الحديث يدور حول ميزانية السفر وتوفيرها.")
            ],
            ["ahorrar", "timo", "carterista"],
            "المتحدث قال: 'te permite ahorrar una gran parte del presupuesto'.",
            audioKey="pending/b1_ahorrar_presupuesto_viaje.mp3",
            speechEs="Cocinar en el albergue te permite ahorrar una gran parte del presupuesto."
        ),
        speak_ex(
            "ex-b1-gui-6",
            "انطق نصيحتك السياحية للأصدقاء لرحلة آمنة واقتصادية",
            ["speaking", "pronunciation"], 2,
            "انطق الجملة التالية بوضوح وود لتقديم النصيحة لزملائك:",
            "Recomiendo tomar precauciones con la cartera y comprar el abono de transporte.",
            "أنصح بأخذ الحيطة بشأن المحفظة وشراء بطاقة المواصلات العامة.",
            "pending/b1_recomiendo_precauciones_abono.mp3",
            ["precaución", "abono de transporte", "recomendación"],
            "Recomiendo tomar precauciones con la cartera y comprar el abono de transporte.",
            "انتبه لنطق حرف c في precauciones كـ ثاء ونطق b في abono بلطف."
        )
    ]
    return lesson_doc(doc, exs, level="B1")

# ==============================================================================
# UNIT 6: b1-u6-problems (حل المشكلات والشكاوى وحقوق المستهلك)
# ==============================================================================

def make_lesson_hoja_reclamaciones():
    slug = "b1-hoja-reclamaciones"
    doc = {
        "slug": slug,
        "unitSlug": "b1-u6-problems",
        "levelCode": "B1",
        "titleAr": "ورقة الشكاوى الرسمية: حقوق المستهلك وتعبئة النماذج القانونية",
        "titleEs": "La hoja de reclamaciones y los derechos del consumidor",
        "subtitleAr": "طلب النموذج الرسمي، كتابة وقائع الشكوى، وإرسالها لإدارة حماية المستهلك",
        "order": 1,
        "estimatedMinutes": 18,
        "cefrLevel": "B1",
        "review": review_block(),
        "pedagogy": {
            "learningObjectivesAr": [
                "أن يعرف المتعلم الإجراء القانوني لطلب ورقة الشكاوى الرسمية (Hoja de reclamaciones) في إسبانيا.",
                "أن يملأ بيانات النموذج بدقة: datos del reclamante, hechos reclamados, pretensión o solución solicitada.",
                "أن يفهم حقوق المستهلك والمسار الإداري للشكوى لدى هيئة الرقابة وحماية المستهلك (Consumo)."
            ],
            "grammarPoints": [
                {
                    "titleAr": "صيغ طلب وتعبئة ورقة الشكاوى الرسمية",
                    "explanationAr": "1. **طلب الورقة القانونية بحزم**:\n- **Por favor, facilíteme la hoja de reclamaciones** (من فضلك، أعطني ورقة الشكاوى الرسمية).\n- Todos los establecimientos están obligados por ley a disponer de hojas de reclamaciones.\n2. **صياغة الوقائع (Los hechos)**:\n- استخدام أزمنة الماضي الدقيقة لسرد الواقعة: El día 14 compré... y el producto presentó el siguiente defecto...\n3. **تحديد الطلب (La pretensión)**:\n- Solicito la sustitución del producto o la devolución del importe abonado."
                }
            ],
            "commonMistakesAr": [
                "الخلط بين شكوى داخلية عادية غير ملزمة والورقة الرسمية الحكومية الثلاثية النسخ (La hoja de reclamaciones oficial).",
                "نسيان التوقيع أو نسيان أخذ النسخة المخصصة للمستهلك (Ejemplar para el reclamante) لإيداعها لدى مصلحة حماية المستهلك."
            ],
            "dialectNotes": [
                {
                    "region": "EG",
                    "noteAr": "في مصر بنقول: «أنا من حقي أعمل شكوى في جهاز حماية المستهلك وأملى الاستمارة الرسمية». بالإسبانية: Exijo la hoja de reclamaciones oficial para presentarla en Consumo."
                }
            ],
            "culturalNoteAr": "رفض إعطاء ورقة الشكاوى للمستهلك في إسبانيا يعد مخالفة إدارية جسيمة تترتب عليها غرامات فورية باهظة من الشرطة المحلية (la Policía Local)."
        },
        "contentBlocks": [
            {
                "id": f"cb-{slug}-intro",
                "type": "explanation",
                "titleAr": "مصطلحات ورقة الشكاوى وحماية المستهلك",
                "bodyAr": "المفردات القانونية والتجارية:\n- **la hoja de reclamaciones**: ورقة الشكاوى الرسمية المعتمدة حكومياً\n- **el consumidor**: المستهلك أو المشتري\n- **el establecimiento**: المحل أو المنشأة التجارية\n- **los hechos**: الوقائع وتفاصيل الحادثة\n- **la pretensión**: المطلب أو الحل المطلوب تحقيقه\n- **la copia sellada**: النسخة المختومة بختم المحل",
                "examples": [
                    {"es": "El consumidor tiene derecho a recibir una copia sellada de la hoja de reclamaciones.", "ar": "يحق للمستهلك الحصول على نسخة مختومة من ورقة الشكاوى."},
                    {"es": "En el apartado de hechos describí detalladamente lo sucedido.", "ar": "في خانة الوقائع وصفت بالتفصيل ما حدث."},
                    {"es": "El establecimiento no puede negarse a facilitar este formulario oficial.", "ar": "لا يمكن للمنشأة الامتناع عن تقديم هذا النموذج الرسمي."}
                ]
            }
        ],
        "newVocabulary": ["hoja de reclamaciones", "consumidor", "establecimiento", "hechos", "pretensión", "copia sellada"],
        "reviewVocabulary": ["ley", "oficial"]
    }

    exs = [
        choice_ex(
            "ex-b1-hoj-1", "word_choice",
            "اختر المفردة التي تعني المستند والنموذج الرسمي للشكوى القانونية",
            ["vocabulary"], 1,
            "ما هي الوثيقة الرسمية الإلزامية التي يطلبها الزبون لتوثيق شكواه قانونياً؟",
            "Pido la _____ para tramitar mi queja ante la oficina de Consumo.",
            "أطلب ... لمتابعة شكواي أمام مكتب حماية المستهلك.",
            [
                opt("a", "hoja de reclamaciones", "ورقة الشكاوى الرسمية (الصواب)", True),
                opt("b", "pretensión", "المطلب فقط", False, "pretensión خانة داخل الورقة وليس اسم الوثيقة الرسمية ككل."),
                opt("c", "establecimiento", "المنشأة", False, "الوثيقة تسمى hoja de reclamaciones.")
            ],
            ["hoja de reclamaciones", "pretensión", "establecimiento"],
            "la hoja de reclamaciones هي الاستمارة الرسمية ثلاثية النسخ للشكاوى في إسبانيا."
        ),
        fill_ex(
            "ex-b1-hoj-2",
            "أكمل بالكلمة التي تعني المستهلك المحمي قانونياً (el _____)",
            ["vocabulary", "writing"], 1,
            "اكتب الكلمة الإسبانية المذكرة التي تعني 'المستهلك / الزبون' (el _____)",
            "La ley protege los derechos fundamentales de cada _____.",
            "يحمي القانون الحقوق الأساسية لكل مستهلك.",
            ["consumidor"],
            ["consumidor"],
            "كلمة consumidor تعني المستهلك في القوانين التجارية."
        ),
        choice_ex(
            "ex-b1-hoj-3", "word_choice",
            "حدد الخانة التي يكتب فيها الزبون ما جرى بالتفصيل",
            ["vocabulary"], 2,
            "ماذا تسمى الفقرة المخصصة في النموذج لسرد تفاصيل المشكلة وما جرى؟",
            "En el apartado de los _____ debe explicar claramente lo sucedido.",
            "في خانة ... يجب أن تشرح بوضوح ما حدث.",
            [
                opt("a", "hechos", "الوقائع والأحداث (الصواب)", True),
                opt("b", "establecimiento", "اسم المنشأة", False, "الخانة المخصصة لسرد المشكلة هي los hechos."),
                opt("c", "copia sellada", "النسخة المختومة", False, "los hechos هي وقائع الحادثة.")
            ],
            ["hechos", "establecimiento", "copia sellada"],
            "los hechos تعني الوقائع وسرد مجريات الحادثة في الشكوى."
        ),
        order_ex(
            "ex-b1-hoj-4",
            "رتّب الجملة لطلب الحصول على النسخة المختومة كإثبات",
            ["grammar", "writing"], 2,
            ["Necesito", "mi", "copia", "sellada", "para", "la", "ley"],
            "Necesito mi copia sellada para la ley",
            "الترتيب: الفعل Necesito ثم المفعول mi copia sellada ثم الغرض para la ley.",
            ["copia sellada", "ley"]
        ),
        choice_ex(
            "ex-b1-hoj-5", "listen_choose",
            "استمع للتسجيل وحدد التزام المنشأة القانوني",
            ["listening", "vocabulary"], 2,
            "استمع لما يؤكده المفتش القانوني في التسجيل",
            "Cualquier establecimiento comercial debe tener hojas de reclamaciones disponibles.",
            "يجب على أي منشأة تجارية توفير أوراق شكاوى متاحة للجمهور.",
            [
                opt("a", "establecimiento", "المنشأة أو المحل التجاري (الصواب)", True),
                opt("b", "pretensión", "مطلب فقط", False, "المفتش ركز على التزام المنشأة التجارية (establecimiento)."),
                opt("c", "copia sellada", "نسخة مختومة", False, "المتحدث حدد إلزام المنشآت بتوفير النماذج.")
            ],
            ["establecimiento", "pretensión", "copia sellada", "hoja de reclamaciones"],
            "المفتش قال: 'Cualquier establecimiento comercial debe tener hojas de reclamaciones'.",
            audioKey="pending/b1_establecimiento_hojas_reclamaciones.mp3",
            speechEs="Cualquier establecimiento comercial debe tener hojas de reclamaciones disponibles."
        ),
        speak_ex(
            "ex-b1-hoj-6",
            "انطق طلبك الرسمي الحازم لورقة الشكاوى القانونية",
            ["speaking", "pronunciation"], 2,
            "انطق الجملة التالية بأدب وحزم لمسؤول المحل عند الامتناع عن حل مشكلتك:",
            "Por favor, facilíteme la hoja de reclamaciones oficial de inmediato.",
            "من فضلك، أعطني ورقة الشكاوى الرسمية على الفور.",
            "pending/b1_faciliteme_hoja_reclamaciones.mp3",
            ["hoja de reclamaciones", "oficial"],
            "Por favor, facilíteme la hoja de reclamaciones oficial de inmediato.",
            "انتبه لنطق حرف c في facilíteme كـ ثاء ونطق النبرة الحازمة باحترام."
        )
    ]
    return lesson_doc(doc, exs, level="B1")


def make_lesson_expresar_quejas_molestias():
    slug = "b1-expresar-quejas-molestias"
    doc = {
        "slug": slug,
        "unitSlug": "b1-u6-problems",
        "levelCode": "B1",
        "titleAr": "التعبير عن الاستياء والشكوى: استخدام المنصوب مع Me molesta que و Me indigna que",
        "titleEs": "Expresar quejas y malestar: Subjuntivo con verbos de molestia",
        "subtitleAr": "تراكيب التعبير عن الغضب وعدم الرضا: me parece inaceptable que, me molesta que",
        "order": 2,
        "estimatedMinutes": 18,
        "cefrLevel": "B1",
        "review": review_block(),
        "pedagogy": {
            "learningObjectivesAr": [
                "أن يطبق المتعلم قاعدة المنصوب (Subjuntivo) الإلزامية مع أفعال وعبارات الاستياء والشعور بالضيق.",
                "أن يعبر عن درجات مختلفة من الغضب والشكوى: me molesta que, me da rabia que, me indigna que, es intolerable que.",
                "أن يفرق بين البناء مع المصدر (عند وحدة الفاعل) والبناء مع المنصوب (عند اختلاف الفاعل)."
            ],
            "grammarPoints": [
                {
                    "titleAr": "قاعدة المنصوب مع أفعال الاستياء والشكوى",
                    "explanationAr": "عند التعبير عن الاستياء أو الشكوى من تصرف شخص آخر أو جهة، نستخدم **صيغة المنصوب (Subjuntivo)** حتماً:\n1. **أفعال الاستياء + que + Subjuntivo**:\n- **Me molesta que** no respondan a mis mensajes (يزعجني أنهم لا يردون على رسائلي).\n- **Me indigna que** traten así a los clientes (يغضبني ويثير استيائي أن يعاملوا العملاء هكذا).\n- **Me da rabia que** se rompa el aparato tan pronto (يغيظني أن يتعطل الجهاز بهذه السرعة).\n2. **العبارات الوصفية للتقييم السلبي**:\n- **Es inaceptable que** no nos den una solución (من غير المقبول ألا يعطونا حلاً).\n- **Es intolerable que** cobren de más sin avisar (من غير المحتمل أن يفرضوا رسوماً إضافية بلا إشعار)."
                }
            ],
            "commonMistakesAr": [
                "استخدام المضارع الإخباري بعد me molesta que (الخطأ الشائع: *Me molesta que no responden*؛ الصواب الحتمي: Me molesta que no respondan بالمنصوب).",
                "استخدام que والمنصوب عندما يكون الفاعل واحداً (الصواب: Me molesta esperar، والخطأ: *Me molesta que yo espere*)."
            ],
            "dialectNotes": [
                {
                    "region": "EG",
                    "noteAr": "في مصر بنقول: «بيضايقني أوي إنهم ميردوش، ومينفعش وميقبلش العقل المعاملة دي». بالإسبانية: Me molesta que no respondan y me parece inaceptable que traten así a la gente."
                }
            ],
            "culturalNoteAr": "في إسبانيا يُستحسن التعبير عن الشكوى بوضوح وحزم مدروس مع الحفاظ على كلمات التهذيب، فالحدة المفرطة والشتائم تفقدك تعاطف الطرف الآخر فوراً."
        },
        "contentBlocks": [
            {
                "id": f"cb-{slug}-intro",
                "type": "explanation",
                "titleAr": "أهم تراكيب الشكوى والاستياء",
                "bodyAr": "تراكيب التعبير عن الضيق:\n- **me molesta que**: يضايقني / يزعجني أن (+ منصُوب)\n- **me indigna que**: يثير سخطي واستيائي الشديد أن (+ منصُوب)\n- **es inaceptable que**: من غير المقبول إطلاقاً أن (+ منصُوب)\n- **me da rabia que**: يغيظني ويثير غضبي أن (+ منصُوب)\n- **el malestar**: الشعور بالضيق والاستياء العام\n- **la queja**: الشكوى والاحتجاج",
                "examples": [
                    {"es": "Me molesta que el tren llegue con retraso todos los días.", "ar": "يزعجني أن يصل القطار بتأخير كل يوم (المنصوب: llegue)."},
                    {"es": "Es inaceptable que no nos hayan devuelto el dinero todavía.", "ar": "من غير المقبول ألا يكونوا قد أعادوا لنا المال حتى الآن."},
                    {"es": "Me indigna que nadie asuma la responsabilidad del error.", "ar": "يثير سخطي ألا يتحمل أحد مسؤولية هذا الخطأ."}
                ]
            }
        ],
        "newVocabulary": ["me molesta que", "me indigna que", "es inaceptable que", "me da rabia que", "malestar", "queja"],
        "reviewVocabulary": ["problema", "solución"]
    }

    exs = [
        choice_ex(
            "ex-b1-mol-1", "word_choice",
            "اختر صيغة المنصوب الصحيحة بعد تركيب الاستياء me molesta que",
            ["grammar"], 1,
            "أي تصريف لفعل hablar نستخدم بعد عبارة الشكوى والاستياء Me molesta que؟",
            "Me molesta que la gente _____ a gritos en el cine.",
            "يزعجني أن ... الناس بالصراخ في السينما.",
            [
                opt("a", "hable", "صيغة المنصوب الحاضر (الصواب بعد me molesta que)", True),
                opt("b", "habla", "مضارع إخباري لا يصح بعد أفعال الشعور والاستياء", False, "تراكيب الاستياء تتطلب حتماً صيغة المنصوب Subjuntivo."),
                opt("c", "hablar", "مصدر لا يناسب وجود الفاعل la gente", False, "لاختلاف الفاعل يجب تصريف الفعل بالمنصوب.")
            ],
            ["me molesta que", "queja"],
            "بعد تركيب me molesta que يأتي دائماً زمن المنصوب: me molesta que la gente hable."
        ),
        fill_ex(
            "ex-b1-mol-2",
            "صرف فعل dar بالمنصوب الغائب بعد عبارة es inaceptable que: (den)",
            ["grammar", "writing"], 1,
            "اكتب صيغة المنصوب للغائب الجمع من الفعل dar بعد es inaceptable que: (den)",
            "Es inaceptable que no nos _____ ninguna explicación por la avería.",
            "من غير المقبول ألا يقدموا لنا أي توضيح عن هذا العطل.",
            ["es inaceptable que"],
            ["den"],
            "بعد es inaceptable que يجب تصريف الفعل في المنصوب: den."
        ),
        choice_ex(
            "ex-b1-mol-3", "word_choice",
            "حدد التعبير الدال على السخط والغضب الشديد من سوء المعاملة",
            ["vocabulary", "grammar"], 2,
            "أي تعبير ينقل شعوراً بالسخط البالغ إزاء الظلم وسوء التصرف؟",
            "_____ que se rían de los derechos de los clientes.",
            "... أن يسخروا من حقوق العملاء.",
            [
                opt("a", "Me indigna que", "يثير سخطي البالغ أن (الصواب)", True),
                opt("b", "Me alegra que", "يسعدني أن (معنى متناقض)", False, "السخرية من حقوق العملاء تثير السخط وليس السعادة."),
                opt("c", "Me gusta que", "يعجبني أن", False, "يناقض سياق الاحتجاج والشكوى.")
            ],
            ["me indigna que", "queja", "malestar"],
            "Me indigna que يعبر عن السخط والغضب البالغ والاستنكار الشديد."
        ),
        order_ex(
            "ex-b1-mol-4",
            "رتّب الجملة للتعبير عن الشعور بالغضب من انقطاع الخدمة",
            ["grammar", "writing"], 2,
            ["Me", "da", "rabia", "que", "se", "corte", "la", "conexión"],
            "Me da rabia que se corte la conexión",
            "الترتيب: عبارة الغضب Me da rabia que ثم المنصوب se corte ثم الفاعل la conexión.",
            ["me da rabia que"]
        ),
        choice_ex(
            "ex-b1-mol-5", "listen_choose",
            "استمع للتسجيل وحدد درجة استياء العميل من التأخير",
            ["listening", "vocabulary"], 2,
            "استمع لشكوى العميل وحدد التعبير الذي يصف به الموقف",
            "Es inaceptable que tengamos que esperar tres horas sin recibir agua.",
            "من غير المقبول أن نضطر للانتظار ثلاث ساعات دون الحصول على ماء.",
            [
                opt("a", "es inaceptable que", "غير مقبول إطلاقاً مع المنصوب (الصواب)", True),
                opt("b", "me alegra que", "يسرني", False, "العميل يحتج بغضب على طول الانتظار."),
                opt("c", "malestar", "استياء اسمي فقط", False, "المتحدث استخدم العبارة التقويمية es inaceptable que.")
            ],
            ["es inaceptable que", "malestar", "queja"],
            "المتحدث قال: 'Es inaceptable que tengamos que esperar'.",
            audioKey="pending/b1_inaceptable_esperar_horas.mp3",
            speechEs="Es inaceptable que tengamos que esperar tres horas sin recibir agua."
        ),
        speak_ex(
            "ex-b1-mol-6",
            "انطق عبارتك الاحتجاجية بالمنصوب لرفض الإهمال",
            ["speaking", "pronunciation"], 2,
            "انطق الجملة التالية بأسلوب احتجاجي حازم ومؤدب:",
            "Me molesta mucho que no respeten el plazo acordado para la entrega.",
            "يزعجني كثيراً ألا يحترموا الموعد المتفق عليه للتسليم.",
            "pending/b1_molesta_respeten_plazo.mp3",
            ["me molesta que", "queja"],
            "Me molesta mucho que no respeten el plazo acordado para la entrega.",
            "انتبه لنطق صيغة المنصوب respeten بكسرة واضحة قبل النون."
        )
    ]
    return lesson_doc(doc, exs, level="B1")


def make_lesson_pedir_soluciones_reparacion():
    slug = "b1-pedir-soluciones-reparacion"
    doc = {
        "slug": slug,
        "unitSlug": "b1-u6-problems",
        "levelCode": "B1",
        "titleAr": "طلب الحلول والإصلاح: الضمان الفني واستبدال الأجهزة المعيبة",
        "titleEs": "Exigir soluciones, garantía y reparación de productos defectuosos",
        "subtitleAr": "تفعيل الضمان (Garantía)، طلب الاستبدال (Sustitución)، وتحديد موعد الفني",
        "order": 3,
        "estimatedMinutes": 18,
        "cefrLevel": "B1",
        "review": review_block(),
        "pedagogy": {
            "learningObjectivesAr": [
                "أن يطالب المتعلم بتصليح منتج معيب أو استبداله بموجب شهادة الضمان (la garantía).",
                "أن يصف العيب الفني للسلعة: no enciende, hace un ruido extraño, tiene un defecto de fábrica.",
                "أن يطلب حلاً بديلاً أو استرداد الثمن إذا تعذر الإصلاح السريع."
            ],
            "grammarPoints": [
                {
                    "titleAr": "تراكيب تفعيل الضمان وطلب الإصلاح الفني",
                    "explanationAr": "1. **المطالبة بحق الضمان القانوني**:\n- **Estar en garantía**: El aparato todavía está en garantía de tres años (الجهاز لا يزال تحت الضمان لمدة 3 سنوات).\n- **Cubrir la garantía**: La garantía cubre tanto las piezas como la mano de obra.\n2. **طلب الاستبدال أو التصليح**:\n- **La sustitución / La reparación**: Solicito la reparación inmediata o la sustitución por uno nuevo.\n3. **وصف العيوب الفنية**:\n- **Tener un defecto de fábrica**: Presenta un defecto de fábrica evidente.\n- **Dejar de funcionar**: Dejó de funcionar de repente tras dos días de uso."
                }
            ],
            "commonMistakesAr": [
                "استخدام كلمة *seguro* (تأمين الحوادث) بدلاً من la garantía (ضمان الجودة ضد عيوب الصناعة).",
                "ترجمة 'قطعة غيار' بـ *parte de cambio*؛ المصطلح الفني الصحيح هو la pieza de repuesto أو el recambio."
            ],
            "dialectNotes": [
                {
                    "region": "EG",
                    "noteAr": "في مصر بنقول: «الجهاز لسه في الضمان وفيه عيب صناعة، عايز أصلحه أو أبدله بواحد جديد». بالإسبانية: El aparato está en garantía con defecto de fábrica; quiero la reparación o sustitución."
                }
            ],
            "culturalNoteAr": "ينص القانون الإسباني لحماية المستهلك على فترة ضمان إلزامية لا تقل عن ثلاث سنوات للأجهزة والسلع الإلكترونية الجديدة المباعة في إسبانيا."
        },
        "contentBlocks": [
            {
                "id": f"cb-{slug}-intro",
                "type": "explanation",
                "titleAr": "مصطلحات الضمان والدعم الفني",
                "bodyAr": "المفردات الفنية والتجارية:\n- **la garantía**: شهادة الضمان وحق التصليح المجاني\n- **el defecto de fábrica**: عيب الصناعة الأصلي\n- **la reparación**: الإصلاح والتصليح الفني\n- **la sustitución**: الاستبدال بسلعة جديدة\n- **la pieza de repuesto**: قطعة الغيار الأصلية\n- **el servicio técnico**: قسم الصيانة والدعم الفني",
                "examples": [
                    {"es": "El ordenador está en garantía y lo he llevado al servicio técnico.", "ar": "الحاسوب تحت الضمان وقد أخذته إلى قسم الصيانة الفنية."},
                    {"es": "Si no hay piezas de repuesto, exigiré la sustitución del equipo.", "ar": "إذا لم توجد قطع غيار، سأطالب باستبدال الجهاز."},
                    {"es": "El fallo se debe a un claro defecto de fábrica cubierto por la ley.", "ar": "العطل يرجع إلى عيب صناعة واضح مشمول بالقانون."}
                ]
            }
        ],
        "newVocabulary": ["garantía", "defecto de fábrica", "reparación", "sustitución", "pieza de repuesto", "servicio técnico"],
        "reviewVocabulary": ["aparato", "nuevo"]
    }

    exs = [
        choice_ex(
            "ex-b1-rep-1", "word_choice",
            "اختر المصطلح الذي يعني استبدال الجهاز التالف بآخر جديد",
            ["vocabulary"], 1,
            "ما هي الكلمة التي تعني 'استبدال السلعة بمنتج جديد تماماً'؟",
            "Como no es posible arreglarlo, solicito la _____ inmediata del producto.",
            "بما أنه لا يمكن تصليحه، أطلب ... الفوري للمنتج.",
            [
                opt("a", "sustitución", "الاستبدال بسلعة جديدة (الصواب)", True),
                opt("b", "reparación", "التصليح فقط", False, "قال إنه لا يمكن تصليحه، فالطلب هو الاستبدال sustitución."),
                opt("c", "pieza de repuesto", "قطعة غيار", False, "الطلب يتعلق بالاستبدال الشامل للسلعة.")
            ],
            ["sustitución", "reparación", "pieza de repuesto"],
            "la sustitución تعني استبدال المنتج المعيب بمنتج آخر جديد وصالح."
        ),
        fill_ex(
            "ex-b1-rep-2",
            "أكمل بالكلمة التي تعني شهادة الضمان القانوني (la _____)",
            ["vocabulary", "writing"], 1,
            "اكتب الكلمة الإسبانية المؤنثة التي تعني 'الضمان التجاري ضد الأعطال' (la _____)",
            "Conserve la factura de compra porque sirve como justificante de la _____.",
            "احتفظ بفاتورة الشراء لأنها تعد سنداً لـ ...",
            ["garantía"],
            ["garantía", "garantia"],
            "كلمة garantía تعني الضمان ضد عيوب الصناعة والأعطال."
        ),
        choice_ex(
            "ex-b1-rep-3", "word_choice",
            "حدد نوع العيب الناتج عن أخطاء التصنيع في المصنع",
            ["vocabulary"], 2,
            "ماذا نسمي العيب الأصلي الموجود في السلعة منذ خروجها من المصنع؟",
            "El perito confirmó que la avería se debía a un _____ indiscutible.",
            "أكد الخبير الفني أن العطل يعود إلى ... لا جدال فيه.",
            [
                opt("a", "defecto de fábrica", "عيب صناعة أصلي (الصواب)", True),
                opt("b", "servicio técnico", "قسم الدعم الفني", False, "السبب هو عيب الصناعة وليس قسم الخدمة نفسه."),
                opt("c", "reparación", "تصليح", False, "السبب هو defecto de fábrica.")
            ],
            ["defecto de fábrica", "servicio técnico", "reparación"],
            "un defecto de fábrica هو عيب الصناعة الأصلي الناتج عن التصنيع."
        ),
        order_ex(
            "ex-b1-rep-4",
            "رتّب الجملة لإرسال الجهاز إلى قسم الصيانة والدعم الفني",
            ["grammar", "writing"], 2,
            ["Llevé", "el", "aparato", "al", "servicio", "técnico", "oficial"],
            "Llevé el aparato al servicio técnico oficial",
            "الترتيب: الفعل Llevé ثم المفعول el aparato ثم الوجهة al servicio técnico oficial.",
            ["servicio técnico", "aparato"]
        ),
        choice_ex(
            "ex-b1-rep-5", "listen_choose",
            "استمع للتسجيل وحدد مدى تغطية الضمان لقطع الغيار",
            ["listening", "vocabulary"], 2,
            "استمع لرد موظف الصيانة وحدد ما يغطيه الضمان",
            "No se preocupe, la garantía cubre la sustitución de cualquier pieza de repuesto.",
            "لا تقلق، الضمان يغطي استبدال أي قطعة غيار.",
            [
                opt("a", "pieza de repuesto", "قطع الغيار الأصلية (الصواب)", True),
                opt("b", "defecto de fábrica", "عيب صناعة فقط", False, "الموظف أكد تغطية قطع الغيار (pieza de repuesto)."),
                opt("c", "reparación", "تصليح مدفوع", False, "المتحدث أكد التغطية الشاملة لقطع الغيار مجاناً.")
            ],
            ["pieza de repuesto", "garantía", "defecto de fábrica", "reparación"],
            "الموظف قال: 'la garantía cubre la sustitución de cualquier pieza de repuesto'.",
            audioKey="pending/b1_garantia_cubre_piezas.mp3",
            speechEs="No se preocupe, la garantía cubre la sustitución de cualquier pieza de repuesto."
        ),
        speak_ex(
            "ex-b1-rep-6",
            "انطق طلبك لتفعيل الضمان وتصليح الجهاز مجاناً",
            ["speaking", "pronunciation"], 2,
            "انطق الجملة التالية بوضوح لموظف خدمة ما بعد البيع:",
            "El aparato está en garantía y exijo su reparación inmediata sin coste.",
            "الجهاز تحت الضمان وأطالب بتصليحه فوراً دون أي تكلفة.",
            "pending/b1_aparato_garantia_reparacion.mp3",
            ["garantía", "reparación", "aparato"],
            "El aparato está en garantía y exijo su reparación inmediata sin coste.",
            "انتبه لنطق حرف r في reparación كـ راء مشددة واضحة ونطق sin coste بسلاسة."
        )
    ]
    return lesson_doc(doc, exs, level="B1")


def make_lesson_dialogo_atencion_cliente():
    slug = "b1-dialogo-atencion-cliente"
    doc = {
        "slug": slug,
        "unitSlug": "b1-u6-problems",
        "levelCode": "B1",
        "titleAr": "حوار متكامل: الاتصال بخدمة العملاء وحل نزاع تجاري بفاعلية",
        "titleEs": "Diálogo completo: Atención al cliente y resolución de conflictos",
        "subtitleAr": "تقديم رقم المشترك، شرح المشكلة بهدوء، ومتابعة رقم البلاغ والحل",
        "order": 4,
        "estimatedMinutes": 18,
        "cefrLevel": "B1",
        "review": review_block(),
        "pedagogy": {
            "learningObjectivesAr": [
                "أن يقود المتعلم محادثة حقيقية ناجحة مع قسم خدمة العملاء لحل نزاع تجاري أو تقني.",
                "أن يزود الموظف بالبيانات المرجعية: número de incidencia, código de cliente, fecha de facturación.",
                "أن يطلب حلاً ملزماً بجدول زمني ومتابعة حالة التذكرة أو البلاغ."
            ],
            "grammarPoints": [
                {
                    "titleAr": "عبارات التخاطب وحل النزاعات مع خدمة العملاء",
                    "explanationAr": "1. **افتتاح المكالمة وتحديد الهوية**:\n- Llamo en relación con una factura incorrecta / con una avería en mi línea.\n- Mi número de cliente o de abonado es el... y el número de incidencia es...\n2. **طلب الحل الملموس بمهنية**:\n- ¿Me puede confirmar qué medidas van a tomar para solucionarlo?\n- ¿En qué plazo se pondrán en contacto conmigo?\n3. **تدوين مرجع البلاغ**:\n- Por favor, facilíteme el número de referencia de esta llamada."
                }
            ],
            "commonMistakesAr": [
                "إنهاء المكالمة دون الحصول على رقم البلاغ الرسمي المعتمد (el número de incidencia).",
                "استخدام أسلوب هجومي شخصي على الموظف الهاتف؛ الأسلوب المهني يركز بموضوعية على المشكلة وحلها."
            ],
            "dialectNotes": [
                {
                    "region": "EG",
                    "noteAr": "في مصر مع خدمة العملاء بنقول: «أنا عندي مشكلة في الفاتورة والخدمة مقطوعة، عايز رقم الشكوى والحل هيخلص إمتى؟». بالإسبانية: Tengo una incidencia con la factura; deme el número de referencia y el plazo de solución."
                }
            ],
            "culturalNoteAr": "خدمات العملاء في إسبانيا تسجل المكالمات لأغراض الجودة ('esta llamada puede ser grabada')، ويمكن للمستهلك طلب تفريغ المكالمة كدليل قانوني."
        },
        "contentBlocks": [
            {
                "id": f"cb-{slug}-intro",
                "type": "explanation",
                "titleAr": "مصطلحات خدمة العملاء والمتابعة",
                "bodyAr": "المفردات التفاعلية:\n- **la atención al cliente**: خدمة العملاء ورعاية المشتركين\n- **el número de incidencia**: رقم البلاغ أو التذكرة الفنية\n- **la facturación**: الفوترة وحساب الرسوم\n- **resolver**: يحل المشكلة جذرياً\n- **el operador**: موظف أو ممثل خدمة العملاء\n- **el compromiso**: التعهد والالتزام بتقديم الحل",
                "examples": [
                    {"es": "El servicio de atención al cliente me asignó un número de incidencia.", "ar": "حدد لي قسم خدمة العملاء رقم بلاغ لمتابعة المشكلة."},
                    {"es": "El operador se comprometió a resolver el error en la facturación en 24 horas.", "ar": "تعهد الموظف بحل الخطأ الوارد في الفاتورة خلال 24 ساعة."},
                    {"es": "Necesito un compromiso firme para restablecer el servicio.", "ar": "أحتاج إلى التزام قاطع بإعادة تشغيل الخدمة."}
                ]
            }
        ],
        "newVocabulary": ["atención al cliente", "número de incidencia", "facturación", "resolver", "operador", "compromiso"],
        "reviewVocabulary": ["cliente", "llamada"]
    }

    exs = [
        choice_ex(
            "ex-b1-dia-1", "word_choice",
            "اختر المصطلح الذي يمنحه الموظف للعميل لمتابعة حالة الشكوى",
            ["vocabulary"], 1,
            "ماذا يسمى الرمز أو الرقم المرجعي المخصص لتتبع المشكلة الفنية؟",
            "Guarde este _____ para cualquier consulta posterior sobre su caso.",
            "احتفظ بهذا ... لأي استفسار لاحق بخصوص حالتك.",
            [
                opt("a", "número de incidencia", "رقم البلاغ / التذكرة الفنية (الصواب)", True),
                opt("b", "facturación", "عملية الفوترة", False, "الرقم المرجعي يسمى número de incidencia."),
                opt("c", "operador", "الموظف نفسه", False, "المطلوب هو الرمز الرقمي المرجعي.")
            ],
            ["número de incidencia", "facturación", "operador"],
            "el número de incidencia هو الرقم المرجعي للبلاغ أو التذكرة الفنية."
        ),
        fill_ex(
            "ex-b1-dia-2",
            "أكمل بالفعل الدال على حل المشكلة جذرياً في المصدر (resolver)",
            ["grammar", "writing"], 1,
            "اكتب الفعل الإسباني الذي يعني 'يحل مشكلة أو مسألة' في صيغة المصدر (resolver)",
            "Llamo para exigir que vengan a _____ esta avería de inmediato.",
            "أتصل للمطالبة بأن يأتوا لحل هذا العطل فوراً.",
            ["resolver"],
            ["resolver"],
            "فعل resolver يعني يحل المشكلة أو النزاع بشكل قاطع."
        ),
        choice_ex(
            "ex-b1-dia-3", "word_choice",
            "حدد القسم المسؤول عن تلقي شكاوى المشتركين بالهاتف",
            ["vocabulary"], 2,
            "كيف يسمى القسم المتخصص في مساعدة العملاء والرد على استفساراتهم؟",
            "Me puse en contacto con el departamento de _____ de la compañía.",
            "تواصلت مع قسم ... في الشركة.",
            [
                opt("a", "atención al cliente", "خدمة العملاء (الصواب)", True),
                opt("b", "compromiso", "التعهد فقط", False, "القسم المعني يسمى atención al cliente."),
                opt("c", "facturación", "الفوترة المالية", False, "القسم العام لاستقبال شكاوى المشتركين هو atención al cliente.")
            ],
            ["atención al cliente", "compromiso", "facturación"],
            "el departamento de atención al cliente هو قسم خدمة العملاء ورعاية المشتركين."
        ),
        order_ex(
            "ex-b1-dia-4",
            "رتّب الجملة لطلب التزام حقيقي من الشركة بحل العطل",
            ["grammar", "writing"], 2,
            ["Exijo", "un", "compromiso", "firme", "para", "el", "cliente"],
            "Exijo un compromiso firme para el cliente",
            "الترتيب: الفعل Exijo ثم المفعول un compromiso firme ثم شبه الجملة para el cliente.",
            ["compromiso", "cliente"]
        ),
        choice_ex(
            "ex-b1-dia-5", "listen_choose",
            "استمع للتسجيل وحدد خطأ الحسابات الذي يشكو منه العميل",
            ["listening", "vocabulary"], 2,
            "استمع لشكوى العميل عبر الهاتف وحدد ما يشكو منه",
            "Hay un cobro indebido en la facturación del mes pasado.",
            "توجد رسوم غير مبررة في الفوترة للشهر الماضي.",
            [
                opt("a", "facturación", "الفوترة والحسابات (الصواب)", True),
                opt("b", "operador", "الموظف", False, "العميل يشكو من خطأ الفوترة (la facturación)."),
                opt("c", "compromiso", "تعهد", False, "المشكلة تتعلق بالفوترة المالية.")
            ],
            ["facturación", "operador", "compromiso"],
            "العميل قال: 'Hay un cobro indebido en la facturación'.",
            audioKey="pending/b1_cobro_indebido_facturacion.mp3",
            speechEs="Hay un cobro indebido en la facturación del mes pasado."
        ),
        speak_ex(
            "ex-b1-dia-6",
            "انطق طلبك الاحترافي لرقم البلاغ وتأكيد موعد الحل",
            ["speaking", "pronunciation"], 2,
            "انطق الجملة التالية بوضوح وثقة لممثل خدمة العملاء قبل إنهاء المكالمة:",
            "Por favor, facilíteme el número de incidencia y la fecha límite para resolverlo.",
            "من فضلك، أعطني رقم البلاغ والمهلة المحددة لحل المشكلة.",
            "pending/b1_numero_incidencia_resolver.mp3",
            ["número de incidencia", "resolver"],
            "Por favor, facilíteme la fecha límite y el número de incidencia.",
            "انتبه لنطق حرف c في incidencia كـ ثاء ونطق resolver بسلاسة."
        )
    ]
    return lesson_doc(doc, exs, level="B1")
