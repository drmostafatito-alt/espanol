/* ============================================================================
   بنك أسئلة تحديد المستوى — على الخادم حصرًا (AUD-05 + تحصين VER-02)
   ----------------------------------------------------------------------------
   الحماية طبقات:
   * البنك هنا فقط؛ العميل يستلم عيّنة من الأسئلة بمعرّفات خيارات مبهمة
     ومرتبة **بعشوائية خادمية آمنة** (crypto.getRandomValues — بلا بذرة،
     ولا دخل لأي قيمة يعرفها العميل؛ إصلاح DEFECT-1).
   * مواضع الإجابات الصحيحة داخل البنك نفسه متنوعة (ليست كلها 'a') — دفاع
     إضافي يفرضه اختبار، لا طبقة الحماية الأساسية.
   * كل محاولة تعرض **10 أسئلة معيّنة من 24** (3 تمهيدي + 4 أَوّل + 3 ثانٍ)،
     فلا توجد «مجموعة ثابتة» تُحصد إجاباتها مرة واحدة وتُعاد.
   * استجابة التسليم لا تحمل نص الإجابة الصحيحة ولا علم صحة لكل سؤال؛
     التغذية الراجعة شروح قواعد لكل الأسئلة المعروضة سواء أُصيبت أم أُخطئت،
     ومكتوبة بحيث لا تذكر نص الخيار الصحيح (يفرضها اختبار آلي).
   * `correctKey` مفتاح داخلي لا يغادر الخادم أبدًا.
   ========================================================================== */

export interface PlacementOption {
  key: string;
  text: string;
}

export interface PlacementQuestion {
  id: string;
  level: 'PREA1' | 'A1' | 'A2';
  promptAr: string;
  stemEs?: string;
  options: PlacementOption[];
  correctKey: string;
  /** شرح قاعدة — ممنوع أن يذكر نص الخيار الصحيح (يتحقق منه اختبار) */
  explanationAr: string;
}

/** تركيبة كل محاولة: عدد الأسئلة من كل طبقة */
export const PLACEMENT_STRATA: { level: PlacementQuestion['level']; take: number }[] = [
  { level: 'PREA1', take: 3 },
  { level: 'A1', take: 4 },
  { level: 'A2', take: 3 },
];

export const PLACEMENT_QUESTIONS: PlacementQuestion[] = [
  {
    id: '1', level: 'PREA1',
    promptAr: 'ما هي التحية المناسبة في الصباح بالإسبانية؟',
    options: [
      { key: 'a', text: 'Buenos días' },
      { key: 'b', text: 'Buenas noches' },
      { key: 'c', text: 'Hasta luego' },
      { key: 'd', text: 'Por favor' },
    ],
    correctKey: 'a',
    explanationAr: 'التحيات في الإسبانية مرتبطة بوقت اليوم: تحية الصباح مختلفة عن تحية المساء والليل، وعبارات الوداع والرجاء ليست تحيات افتتاحية.',
  },
  {
    id: '2', level: 'PREA1',
    promptAr: 'اختر الرد المناسب على السؤال: «¿Cómo te llamas?» (ما اسمك؟)',
    options: [
      { key: 'a', text: 'Tengo treinta años' },
      { key: 'b', text: 'Soy de El Cairo' },
      { key: 'c', text: 'Muy bien, gracias' },
      { key: 'd', text: 'Me llamo Omar' },
    ],
    correctKey: 'd',
    explanationAr: 'عند السؤال عن الاسم نرد بصيغة التعريف بالاسم نفسه، لا بمعلومات عن العمر أو الأصل أو الحال.',
  },
  {
    id: '3', level: 'PREA1',
    promptAr: 'ما هو الترتيب الصحيح للأرقام: 1، 2، 3 بالإسبانية؟',
    options: [
      { key: 'a', text: 'cuatro, cinco, seis' },
      { key: 'b', text: 'primero, segundo, tercero' },
      { key: 'c', text: 'uno, dos, tres' },
      { key: 'd', text: 'tres, dos, uno' },
    ],
    correctKey: 'c',
    explanationAr: 'المطلوب الأعداد الأساسية بترتيبها العددي الطبيعي، لا ترتيبًا معكوسًا ولا أعدادًا أخرى ولا الصيغ الترتيبية (الأول/الثاني).',
  },
  {
    id: '11', level: 'PREA1',
    promptAr: 'اختر الرد المناسب على السؤال: «¿De dónde eres?» (من أين أنت؟)',
    options: [
      { key: 'a', text: 'Son las ocho' },
      { key: 'b', text: 'Soy de Egipto' },
      { key: 'c', text: 'Estoy muy bien' },
      { key: 'd', text: 'Es lunes' },
    ],
    correctKey: 'b',
    explanationAr: 'السؤال عن الأصل أو البلد يُجاب عنه بذكر المكان الذي تنتمي إليه، لا بوصف الحال أو اليوم أو الوقت.',
  },
  {
    id: '12', level: 'PREA1',
    promptAr: 'كيف تشكر شخصًا بالإسبانية؟',
    options: [
      { key: 'a', text: 'Gracias' },
      { key: 'b', text: 'De nada' },
      { key: 'c', text: 'Perdón' },
      { key: 'd', text: 'Buenas tardes' },
    ],
    correctKey: 'a',
    explanationAr: 'لكل عبارة مجاملة موضعها: كلمة الشكر تُقال لمن قدّم خدمة، بينما عبارة «على الرحب» ردٌّ على الشكر، والاعتذار والتحية سياقات أخرى.',
  },
  {
    id: '13', level: 'PREA1',
    promptAr: 'ما اليوم الذي يأتي مباشرة بعد الاثنين (lunes)؟',
    options: [
      { key: 'a', text: 'miércoles' },
      { key: 'b', text: 'domingo' },
      { key: 'c', text: 'viernes' },
      { key: 'd', text: 'martes' },
    ],
    correctKey: 'd',
    explanationAr: 'أيام الأسبوع سلسلة ثابتة تُحفظ بترتيبها؛ اليوم التالي للاثنين هو ثاني أيام الأسبوع العاملة.',
  },
  {
    id: '4', level: 'A1',
    promptAr: 'أكمل الجملة بأداة التعريف المناسبة: «____ casa es grande.» (المنزل كبير)',
    stemEs: '____ casa es grande.',
    options: [
      { key: 'a', text: 'Los' },
      { key: 'b', text: 'Un' },
      { key: 'c', text: 'La' },
      { key: 'd', text: 'El' },
    ],
    correctKey: 'c',
    explanationAr: 'أداة التعريف تطابق الاسم في الجنس والعدد؛ والاسم هنا مؤنث مفرد. لاحظ الفرق بين أداة التعريف وأداة التنكير في الجملة.',
  },
  {
    id: '5', level: 'A1',
    promptAr: 'اختر التصريف الصحيح للفعل Hablar مع الضمير Yo (أنا أتكلم الإسبانية):',
    stemEs: 'Yo ____ español todos los días.',
    options: [
      { key: 'a', text: 'hablamos' },
      { key: 'b', text: 'hablo' },
      { key: 'c', text: 'hablas' },
      { key: 'd', text: 'habla' },
    ],
    correctKey: 'b',
    explanationAr: 'في المضارع البسيط لكل ضمير نهاية ثابتة حسب مجموعة الفعل؛ نهاية المتكلم المفرد في المجموعة الأولى تختلف عن نهايات بقية الضمائر المعروضة.',
  },
  {
    id: '6', level: 'A1',
    promptAr: 'للإخبار عن مكان تواجدك الحالي، أي فعل تختار؟ «أنا في المكتب الآن»:',
    options: [
      { key: 'a', text: 'Estoy en la oficina ahora' },
      { key: 'b', text: 'Soy en la oficina ahora' },
      { key: 'c', text: 'Tengo en la oficina ahora' },
      { key: 'd', text: 'Hago en la oficina ahora' },
    ],
    correctKey: 'a',
    explanationAr: 'الإسبانية تفرّق بين فعلين بمعنى «يكون»: أحدهما للهوية والسمات الثابتة، والآخر للموقع والحالة المؤقتة — ومكان التواجد الآن من النوع الثاني.',
  },
  {
    id: '7', level: 'A1',
    promptAr: 'في المطعم، كيف تطلب كوب ماء بأسلوب مهذب؟',
    options: [
      { key: 'a', text: 'Quiero agua ahora mismo' },
      { key: 'b', text: 'De nada, un vaso' },
      { key: 'c', text: '¿Dónde está la cuenta?' },
      { key: 'd', text: 'Un vaso de agua, por favor' },
    ],
    correctKey: 'd',
    explanationAr: 'الطلب المهذب اليومي يذكر المطلوب متبوعًا بكلمة الرجاء، بخلاف أسلوب الأمر المباشر أو الرد على شكر أو السؤال عن الفاتورة.',
  },
  {
    id: '14', level: 'A1',
    promptAr: 'أكمل بأداة التعريف المناسبة: «____ libros son nuevos.» (الكتب جديدة)',
    stemEs: '____ libros son nuevos.',
    options: [
      { key: 'a', text: 'La' },
      { key: 'b', text: 'Las' },
      { key: 'c', text: 'Los' },
      { key: 'd', text: 'El' },
    ],
    correctKey: 'c',
    explanationAr: 'الاسم هنا مذكر جمع، وأداة التعريف يجب أن تطابقه في الجنس والعدد معًا؛ بقية الخيارات مفردة أو لا تناسب هذا الاسم.',
  },
  {
    id: '15', level: 'A1',
    promptAr: 'أكمل التعبير الصحيح عن العمر: «Tengo veinticinco ____.»',
    stemEs: 'Tengo veinticinco ____.',
    options: [
      { key: 'a', text: 'horas' },
      { key: 'b', text: 'años' },
      { key: 'c', text: 'meses' },
      { key: 'd', text: 'días' },
    ],
    correctKey: 'b',
    explanationAr: 'العمر في الإسبانية يُعبَّر عنه بفعل الامتلاك مع وحدة زمنية هي السنوات؛ بقية الوحدات لا تُستخدم لذكر العمر بهذا العدد.',
  },
  {
    id: '16', level: 'A1',
    promptAr: 'اختر التصريف الصحيح: «Nosotros ____ al mercado los sábados.» (نحن نذهب إلى السوق)',
    stemEs: 'Nosotros ____ al mercado los sábados.',
    options: [
      { key: 'a', text: 'vamos' },
      { key: 'b', text: 'voy' },
      { key: 'c', text: 'van' },
      { key: 'd', text: 'vas' },
    ],
    correctKey: 'a',
    explanationAr: 'فعل الذهاب شاذ التصريف، ولكل ضمير صيغته الخاصة؛ المطلوب صيغة المتكلمين بصيغة الجمع (نحن).',
  },
  {
    id: '17', level: 'A1',
    promptAr: 'اختر أداة الاستفهام المناسبة للسؤال عن المكان: «¿____ está la estación?»',
    stemEs: '¿____ está la estación?',
    options: [
      { key: 'a', text: 'Cuándo' },
      { key: 'b', text: 'Quién' },
      { key: 'c', text: 'Cuánto' },
      { key: 'd', text: 'Dónde' },
    ],
    correctKey: 'd',
    explanationAr: 'لكل أداة استفهام دلالة: للمكان أداة، وللزمان أخرى، وللأشخاص والكمية غيرهما. السؤال هنا عن موقع مكان.',
  },
  {
    id: '18', level: 'A1',
    promptAr: 'أكمل الجملة عن الوقت: «____ las tres de la tarde.» (الساعة الثالثة عصرًا)',
    stemEs: '____ las tres de la tarde.',
    options: [
      { key: 'a', text: 'Están' },
      { key: 'b', text: 'Soy' },
      { key: 'c', text: 'Son' },
      { key: 'd', text: 'Es' },
    ],
    correctKey: 'c',
    explanationAr: 'عند ذكر الساعة نستخدم فعل الكينونة الخاص بالهوية، وبصيغة الجمع متى كانت الساعة بعد الواحدة؛ الواحدة وحدها تأخذ المفرد.',
  },
  {
    id: '19', level: 'A1',
    promptAr: 'اختر الصفة المطابقة: «una casa ____» (منزل أبيض)',
    stemEs: 'una casa ____',
    options: [
      { key: 'a', text: 'blancos' },
      { key: 'b', text: 'blanca' },
      { key: 'c', text: 'blanco' },
      { key: 'd', text: 'blancas' },
    ],
    correctKey: 'b',
    explanationAr: 'الصفة في الإسبانية تطابق موصوفها في الجنس والعدد؛ والموصوف هنا اسم مؤنث مفرد، فتُستبعد الصيغ المذكرة وصيغ الجمع.',
  },
  {
    id: '8', level: 'A2',
    promptAr: 'اختر الجملة الصحيحة مع فعل الإعجاب Gustar (يعجبني هذا الكتاب):',
    options: [
      { key: 'a', text: 'Me gusta este libro' },
      { key: 'b', text: 'Yo gusto este libro' },
      { key: 'c', text: 'Me gustan este libro' },
      { key: 'd', text: 'A mí gusto este libro' },
    ],
    correctKey: 'a',
    explanationAr: 'هذا الفعل يعمل بتركيب خاص: الشيء المُعجَب به هو الفاعل النحوي، والشخص يأتي ضمير مفعول. لذلك تطابق صيغة الفعل عددَ الشيء لا عدد الأشخاص.',
  },
  {
    id: '9', level: 'A2',
    promptAr: 'اختر صيغة الماضي البسيط (Pretérito Indefinido) لجملة «أمس ذهبتُ إلى السينما»:',
    stemEs: 'Ayer ____ al cine con mis amigos.',
    options: [
      { key: 'a', text: 'voy' },
      { key: 'b', text: 'iba' },
      { key: 'c', text: 'he ido' },
      { key: 'd', text: 'fui' },
    ],
    correctKey: 'd',
    explanationAr: 'ظرف «أمس» مع حدث واحد مكتمل يستدعي الماضي البسيط؛ وفعل الذهاب فيه شاذ تمامًا. بقية الصيغ مضارع أو ماضٍ مستمر أو ماضٍ مركب.',
  },
  {
    id: '10', level: 'A2',
    promptAr: 'ما معنى الجملة الإسبانية: «¿Cuánto tiempo hace que vives en Madrid?»',
    options: [
      { key: 'a', text: 'هل تفضل العيش في مدريد؟' },
      { key: 'b', text: 'متى ستعيش في مدريد؟' },
      { key: 'c', text: 'منذ متى وأنت تعيش في مدريد؟' },
      { key: 'd', text: 'كم تكلفة العيش في مدريد؟' },
    ],
    correctKey: 'c',
    explanationAr: 'هذا تركيب ثابت يسأل عن مدة حدث بدأ في الماضي وما زال مستمرًا حتى الآن، ويأتي الفعل بعده في المضارع رغم أن البداية سابقة.',
  },
  {
    id: '20', level: 'A2',
    promptAr: 'أكمل بخطة مستقبلية قريبة: «Mañana ____ estudiar en casa.» (غدًا سأذاكر في البيت)',
    stemEs: 'Mañana ____ estudiar en casa.',
    options: [
      { key: 'a', text: 'ir a' },
      { key: 'b', text: 'voy a' },
      { key: 'c', text: 'voy' },
      { key: 'd', text: 'va' },
    ],
    correctKey: 'b',
    explanationAr: 'المستقبل القريب يُبنى من فعل الذهاب مصرّفًا مع المتكلم، يليه حرف ثم المصدر. غياب الحرف أو تغيير الضمير يكسر التركيب.',
  },
  {
    id: '21', level: 'A2',
    promptAr: 'أكمل الروتين اليومي: «Cada mañana me levanto y ____ la cara.» (أغسل وجهي)',
    stemEs: 'Cada mañana me levanto y ____ la cara.',
    options: [
      { key: 'a', text: 'me lavo' },
      { key: 'b', text: 'lavo me' },
      { key: 'c', text: 'se lavo' },
      { key: 'd', text: 'me lava' },
    ],
    correctKey: 'a',
    explanationAr: 'الأفعال الانعكاسية تحمل ضميرًا يسبق الفعل المصرّف ويطابق الفاعل؛ ترتيب الضمير بعد الفعل المصرّف أو تغيير شخصه يجعل الجملة خاطئة.',
  },
  {
    id: '22', level: 'A2',
    promptAr: 'أكمل المقارنة: «Este libro es ____ que el otro.» (هذا الكتاب أكثر إثارة من الآخر)',
    stemEs: 'Este libro es ____ que el otro.',
    options: [
      { key: 'a', text: 'interesante más' },
      { key: 'b', text: 'el interesante' },
      { key: 'c', text: 'muy interesante' },
      { key: 'd', text: 'más interesante' },
    ],
    correctKey: 'd',
    explanationAr: 'المقارنة بين شيئين تُبنى بكلمة الزيادة قبل الصفة ثم أداة المقارنة؛ الترتيب المعكوس أو كلمات الشدة لا يؤديان معنى «أكثر من».',
  },
  {
    id: '23', level: 'A2',
    promptAr: 'أكمل بعادة ماضية متكررة: «Cuando era niño, ____ en el parque todos los días.» (كنت ألعب)',
    stemEs: 'Cuando era niño, ____ en el parque todos los días.',
    options: [
      { key: 'a', text: 'juego' },
      { key: 'b', text: 'jugaré' },
      { key: 'c', text: 'jugaba' },
      { key: 'd', text: 'jugué' },
    ],
    correctKey: 'c',
    explanationAr: 'العادات المتكررة في الماضي ووصف خلفيتها يأخذان الماضي المستمر (الناقص)، بينما الماضي البسيط لأحداث منقطعة مكتملة، وبقية الصيغ ليست ماضية.',
  },
  {
    id: '24', level: 'A2',
    promptAr: 'أكمل الرد بضمير المفعول المناسب: «—¿Conoces a María? —Sí, ____ conozco.»',
    stemEs: '¿Conoces a María? —Sí, ____ conozco.',
    options: [
      { key: 'a', text: 'las' },
      { key: 'b', text: 'la' },
      { key: 'c', text: 'lo' },
      { key: 'd', text: 'le' },
    ],
    correctKey: 'b',
    explanationAr: 'ضمير المفعول المباشر يطابق الاسم الذي يعود إليه في الجنس والعدد، ويسبق الفعل المصرّف؛ والمشار إليها هنا مؤنثة مفردة.',
  },
];

export const PLACEMENT_PASS_SCORE = 60;
/** عند هذه النسبة أو أعلى يُحتسب فتح A2، ودونها (مع النجاح) فتح A1 */
export const PLACEMENT_A2_SCORE = 80;
/** VER-02: سقف بدء المحاولات لكل مستخدم في الساعة — مكافحة إساءة لا عقوبة تعلم */
export const PLACEMENT_MAX_STARTS_PER_HOUR = 5;
