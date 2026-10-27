/* بنك أسئلة اختبار تحديد المستوى — خادم فقط.
   ----------------------------------------------------------------------------
   لا يُستورد هذا الملف في أي كود واجهة: الإجابات الصحيحة لا تصل إلى حزمة
   العميل إطلاقًا. الواجهة تجلب الأسئلة من GET /api/me/placement/questions
   (بلا أي علامة صواب)، والخادم وحده يصحّح.
   مواضع الإجابة الصحيحة متنوّعة عمدًا — ليست كلها في الخيار الأول.
   ========================================================================== */

export interface PlacementQuestion {
  id: number;
  level: 'PREA1' | 'A1' | 'A2';
  promptAr: string;
  stemEs?: string;
  options: { id: string; text: string }[];
}

interface BankEntry extends PlacementQuestion {
  correctId: string;
}

const BANK: BankEntry[] = [
  {
    id: 1, level: 'PREA1',
    promptAr: 'ما هي التحية المناسبة في الصباح بالإسبانية؟',
    options: [
      { id: 'a', text: 'Buenos días' },
      { id: 'b', text: 'Buenas noches' },
      { id: 'c', text: 'Hasta luego' },
      { id: 'd', text: 'Por favor' },
    ],
    correctId: 'a',
  },
  {
    id: 2, level: 'PREA1',
    promptAr: 'اختر الرد المناسب على السؤال: «¿Cómo te llamas?» (ما اسمك؟)',
    options: [
      { id: 'a', text: 'Tengo treinta años' },
      { id: 'b', text: 'Me llamo Omar' },
      { id: 'c', text: 'Soy de El Cairo' },
      { id: 'd', text: 'Muy bien, gracias' },
    ],
    correctId: 'b',
  },
  {
    id: 3, level: 'PREA1',
    promptAr: 'ما هو الترتيب الصحيح للأرقام: 1، 2، 3 بالإسبانية؟',
    options: [
      { id: 'a', text: 'tres, dos, uno' },
      { id: 'b', text: 'cuatro, cinco, seis' },
      { id: 'c', text: 'uno, dos, tres' },
      { id: 'd', text: 'primero, segundo, tercero' },
    ],
    correctId: 'c',
  },
  {
    id: 4, level: 'A1',
    promptAr: 'أكمل الجملة بأداة التعريف المناسبة: «____ casa es grande.» (المنزل كبير)',
    options: [
      { id: 'a', text: 'El' },
      { id: 'b', text: 'Los' },
      { id: 'c', text: 'Un' },
      { id: 'd', text: 'La' },
    ],
    correctId: 'd',
  },
  {
    id: 5, level: 'A1',
    promptAr: 'اختر التصريف الصحيح للفعل Hablar مع الضمير Yo (أنا أتكلم الإسبانية):',
    stemEs: 'Yo ____ español todos los días.',
    options: [
      { id: 'a', text: 'hablas' },
      { id: 'b', text: 'hablo' },
      { id: 'c', text: 'habla' },
      { id: 'd', text: 'hablamos' },
    ],
    correctId: 'b',
  },
  {
    id: 6, level: 'A1',
    promptAr: 'للإخبار عن مكان تواجدك الحالي، أي فعل تختار؟ «أنا في المكتب الآن»:',
    options: [
      { id: 'a', text: 'Soy en la oficina ahora' },
      { id: 'b', text: 'Tengo en la oficina ahora' },
      { id: 'c', text: 'Estoy en la oficina ahora' },
      { id: 'd', text: 'Hago en la oficina ahora' },
    ],
    correctId: 'c',
  },
  {
    id: 7, level: 'A1',
    promptAr: 'في المطعم، كيف تطلب كوب ماء بأسلوب مهذب؟',
    options: [
      { id: 'a', text: 'Quiero agua ahora mismo' },
      { id: 'b', text: 'De nada, un vaso' },
      { id: 'c', text: '¿Dónde está la cuenta?' },
      { id: 'd', text: 'Un vaso de agua, por favor' },
    ],
    correctId: 'd',
  },
  {
    id: 8, level: 'A2',
    promptAr: 'اختر الجملة الصحيحة مع فعل الإعجاب Gustar (يعجبني هذا الكتاب):',
    options: [
      { id: 'a', text: 'Yo gusto este libro' },
      { id: 'b', text: 'Me gustan este libro' },
      { id: 'c', text: 'A mí gusto este libro' },
      { id: 'd', text: 'Me gusta este libro' },
    ],
    correctId: 'd',
  },
  {
    id: 9, level: 'A2',
    promptAr: 'اختر صيغة الماضي البسيط (Pretérito Indefinido) لجملة «أمس ذهبتُ إلى السينما»:',
    stemEs: 'Ayer ____ al cine con mis amigos.',
    options: [
      { id: 'a', text: 'voy' },
      { id: 'b', text: 'iba' },
      { id: 'c', text: 'fui' },
      { id: 'd', text: 'he ido' },
    ],
    correctId: 'c',
  },
  {
    id: 10, level: 'A2',
    promptAr: 'ما معنى الجملة الإسبانية: «¿Cuánto tiempo hace que vives en Madrid?»',
    options: [
      { id: 'a', text: 'كم تكلفة العيش في مدريد؟' },
      { id: 'b', text: 'هل تفضل العيش في مدريد؟' },
      { id: 'c', text: 'منذ متى وأنت تعيش في مدريد؟' },
      { id: 'd', text: 'متى ستسافر إلى مدريد؟' },
    ],
    correctId: 'c',
  },
];

export const PLACEMENT_QUESTION_COUNT = BANK.length;

/** الأسئلة العامة: نفس النصوص والخيارات، بلا أي علامة صواب. */
export function publicPlacementQuestions(): PlacementQuestion[] {
  return BANK.map(({ correctId: _correctId, ...q }) => ({
    ...q,
    options: q.options.map(o => ({ ...o })),
  }));
}

/** تصحيح إجابات العميل على الخادم حصرًا. */
export function gradePlacement(answers: Record<string, string>): { correct: number; score: number } {
  let correct = 0;
  for (const q of BANK) {
    if (answers[String(q.id)] === q.correctId) correct++;
  }
  return { correct, score: Math.round((correct / BANK.length) * 100) };
}
