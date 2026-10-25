import { readFileSync, writeFileSync, readdirSync, existsSync, mkdirSync } from 'node:fs';
import { join, resolve } from 'node:path';

const ROOT = resolve(import.meta.dirname, '..');

// جمع جميع ملفات الدروس في drafts و exemplars
function getLessonFiles() {
  const walk = (dir) => {
    let files = [];
    if (!existsSync(dir)) return files;
    for (const f of readdirSync(dir, { withFileTypes: true })) {
      const p = join(dir, f.name);
      if (f.isDirectory()) files = files.concat(walk(p));
      else if (p.endsWith('.json') && f.name.startsWith('lesson-')) files.push(p);
    }
    return files;
  };
  return [...walk(join(ROOT, 'content/drafts')), ...walk(join(ROOT, 'content/exemplars'))];
}

const ACCENT_FIXES = [
  // كلمات شائعة ذات نبرة إلزامية
  { regex: /(?<![\p{L}\p{M}])tambien(?![\p{L}\p{M}])/giu, replacement: 'también', rule: 'acento-tambien', desc: 'غياب نبرة también' },
  { regex: /(?<![\p{L}\p{M}])ingles(?![\p{L}\p{M}])/giu, replacement: 'inglés', rule: 'acento-ingles', desc: 'غياب نبرة inglés' },
  { regex: /(?<![\p{L}\p{M}])aleman(?![\p{L}\p{M}])/giu, replacement: 'alemán', rule: 'acento-aleman', desc: 'غياب نبرة alemán' },
  { regex: /(?<![\p{L}\p{M}])frances(?![\p{L}\p{M}])/giu, replacement: 'francés', rule: 'acento-frances', desc: 'غياب نبرة francés' },
  { regex: /(?<![\p{L}\p{M}])adios(?![\p{L}\p{M}])/giu, replacement: 'adiós', rule: 'acento-adios', desc: 'غياب نبرة adiós' },
  { regex: /(?<![\p{L}\p{M}])telefono(?![\p{L}\p{M}])/giu, replacement: 'teléfono', rule: 'acento-telefono', desc: 'غياب نبرة teléfono' },
  { regex: /(?<![\p{L}\p{M}])numero(?![\p{L}\p{M}])/giu, replacement: 'número', rule: 'acento-numero', desc: 'غياب نبرة número' },
  { regex: /(?<![\p{L}\p{M}])facil(?![\p{L}\p{M}])/giu, replacement: 'fácil', rule: 'acento-facil', desc: 'غياب نبرة fácil' },
  { regex: /(?<![\p{L}\p{M}])dificil(?![\p{L}\p{M}])/giu, replacement: 'difícil', rule: 'acento-dificil', desc: 'غياب نبرة difícil' },
  { regex: /(?<![\p{L}\p{M}])musica(?![\p{L}\p{M}])/giu, replacement: 'música', rule: 'acento-musica', desc: 'غياب نبرة música' },
  { regex: /(?<![\p{L}\p{M}])medico(?![\p{L}\p{M}])/giu, replacement: 'médico', rule: 'acento-medico', desc: 'غياب نبرة médico' },
  { regex: /(?<![\p{L}\p{M}])boligrafo(?![\p{L}\p{M}])/giu, replacement: 'bolígrafo', rule: 'acento-boligrafo', desc: 'غياب نبرة bolígrafo' },
  { regex: /(?<![\p{L}\p{M}])estacion(?![\p{L}\p{M}])/giu, replacement: 'estación', rule: 'acento-estacion', desc: 'غياب نبرة estación' },
  { regex: /(?<![\p{L}\p{M}])habitacion(?![\p{L}\p{M}])/giu, replacement: 'habitación', rule: 'acento-habitacion', desc: 'غياب نبرة habitación' },
  { regex: /(?<![\p{L}\p{M}])leccion(?![\p{L}\p{M}])/giu, replacement: 'lección', rule: 'acento-leccion', desc: 'غياب نبرة lección' },
  { regex: /(?<![\p{L}\p{M}])cancion(?![\p{L}\p{M}])/giu, replacement: 'canción', rule: 'acento-cancion', desc: 'غياب نبرة canción' },
  { regex: /(?<![\p{L}\p{M}])informacion(?![\p{L}\p{M}])/giu, replacement: 'información', rule: 'acento-informacion', desc: 'غياب نبرة información' },
  { regex: /(?<![\p{L}\p{M}])direccion(?![\p{L}\p{M}])/giu, replacement: 'dirección', rule: 'acento-direccion', desc: 'غياب نبرة dirección' },
  { regex: /(?<![\p{L}\p{M}])situacion(?![\p{L}\p{M}])/giu, replacement: 'situación', rule: 'acento-situacion', desc: 'غياب نبرة situación' },
  { regex: /(?<![\p{L}\p{M}])atencion(?![\p{L}\p{M}])/giu, replacement: 'atención', rule: 'acento-atencion', desc: 'غياب نبرة atención' },
  { regex: /(?<![\p{L}\p{M}])pagina(?![\p{L}\p{M}])/giu, replacement: 'página', rule: 'acento-pagina', desc: 'غياب نبرة página' },
  { regex: /(?<![\p{L}\p{M}])sabado(?![\p{L}\p{M}])/giu, replacement: 'sábado', rule: 'acento-sabado', desc: 'غياب نبرة sábado' },
  { regex: /(?<![\p{L}\p{M}])miercoles(?![\p{L}\p{M}])/giu, replacement: 'miércoles', rule: 'acento-miercoles', desc: 'غياب نبرة miércoles' },
  // نبرات أفعال الماضي البسيط الشائعة
  { regex: /(?<![\p{L}\p{M}])comio(?![\p{L}\p{M}])/giu, replacement: 'comió', rule: 'acento-comio', desc: 'غياب نبرة الماضي comió' },
  { regex: /(?<![\p{L}\p{M}])vivio(?![\p{L}\p{M}])/giu, replacement: 'vivió', rule: 'acento-vivio', desc: 'غياب نبرة الماضي vivió' },
  { regex: /(?<![\p{L}\p{M}])salio(?![\p{L}\p{M}])/giu, replacement: 'salió', rule: 'acento-salio', desc: 'غياب نبرة الماضي salió' },
  { regex: /(?<![\p{L}\p{M}])escribio(?![\p{L}\p{M}])/giu, replacement: 'escribió', rule: 'acento-escribio', desc: 'غياب نبرة الماضي escribió' },
  { regex: /(?<![\p{L}\p{M}])nacio(?![\p{L}\p{M}])/giu, replacement: 'nació', rule: 'acento-nacio', desc: 'غياب نبرة الماضي nació' },
  { regex: /\b(él|ella|usted)\s+llego\b/giu, replacement: '$1 llegó', rule: 'acento-llego', desc: 'غياب نبرة الماضي llegó مع الغائب' },
  // أفعال ناقصة النبرة في الماضي المستمر
  { regex: /(?<![\p{L}\p{M}])habia(?![\p{L}\p{M}])/giu, replacement: 'había', rule: 'acento-habia', desc: 'غياب نبرة había' },
  { regex: /(?<![\p{L}\p{M}])tenia(?![\p{L}\p{M}])/giu, replacement: 'tenía', rule: 'acento-tenia', desc: 'غياب نبرة tenía' },
  { regex: /(?<![\p{L}\p{M}])decia(?![\p{L}\p{M}])/giu, replacement: 'decía', rule: 'acento-decia', desc: 'غياب نبرة decía' },
  { regex: /(?<![\p{L}\p{M}])queria(?![\p{L}\p{M}])/giu, replacement: 'quería', rule: 'acento-queria', desc: 'غياب نبرة quería' },
  // النبرات الفارقة (tildes diacríticas) المؤكدة
  { regex: /(?<=¿\s*)como\b/giu, replacement: 'cómo', rule: 'acento-interrogativo-como', desc: 'غياب نبرة الاستفهام cómo في بداية السؤال' },
  { regex: /(?<=¿\s*)que\b/giu, replacement: 'qué', rule: 'acento-interrogativo-que', desc: 'غياب نبرة الاستفهام qué في بداية السؤال' },
  { regex: /(?<=¿\s*)donde\b/giu, replacement: 'dónde', rule: 'acento-interrogativo-donde', desc: 'غياب نبرة الاستفهام dónde في بداية السؤال' },
  { regex: /(?<=¿\s*)cuando\b/giu, replacement: 'cuándo', rule: 'acento-interrogativo-cuando', desc: 'غياب نبرة الاستفهام cuándo في بداية السؤال' },
  { regex: /(?<=¿\s*)quien\b/giu, replacement: 'quién', rule: 'acento-interrogativo-quien', desc: 'غياب نبرة الاستفهام quién في بداية السؤال' },
  { regex: /(?<=¿\s*)cual\b/giu, replacement: 'cuál', rule: 'acento-interrogativo-cual', desc: 'غياب نبرة الاستفهام cuál في بداية السؤال' },
  { regex: /(?<=¿\s*)cuanto\b/giu, replacement: 'cuánto', rule: 'acento-interrogativo-cuanto', desc: 'غياب نبرة الاستفهام cuánto في بداية السؤال' },
  { regex: /(?<=¿\s*)cuanta\b/giu, replacement: 'cuánta', rule: 'acento-interrogativo-cuanta', desc: 'غياب نبرة الاستفهام cuánta في بداية السؤال' },
  { regex: /(?<=¿\s*)cuantos\b/giu, replacement: 'cuántos', rule: 'acento-interrogativo-cuantos', desc: 'غياب نبرة الاستفهام cuántos في بداية السؤال' },
  { regex: /(?<=¿\s*)cuantas\b/giu, replacement: 'cuántas', rule: 'acento-interrogativo-cuantas', desc: 'غياب نبرة الاستفهام cuántas في بداية السؤال' },
  { regex: /\b(por\s+que)(?=\s*\?)/giu, replacement: 'por qué', rule: 'acento-por-que-interrogativo', desc: 'por qué استفهامية بلا نبرة قبل علامة الاستفهام' },
  { regex: /(?<=¿\s*)por\s+que\b/giu, replacement: 'por qué', rule: 'acento-por-que-inicio', desc: 'por qué استفهامية بلا نبرة في بداية السؤال' },
  { regex: /\b(si,\s*(?:gracias|por\s+favor))/giu, replacement: 'sí, $1', rule: 'acento-si-afirmativo', desc: 'sí التوكيدية/الإيجاب بلا نبرة' },
  { regex: /¡Si!/gu, replacement: '¡Sí!', rule: 'acento-si-exclamativo', desc: '¡Sí! بلا نبرة' },
  { regex: /¿Si\?/gu, replacement: '¿Sí?', rule: 'acento-si-interrogativo', desc: '¿Sí? بلا نبرة' },
  { regex: /\b(mas\s+o\s+menos)\b/giu, replacement: 'más o menos', rule: 'acento-mas-o-menos', desc: 'más في más o menos' },
  { regex: /\b(mas\s+tarde)\b/giu, replacement: 'más tarde', rule: 'acento-mas-tarde', desc: 'más في más tarde' },
  { regex: /\b(tu\s+eres)\b/giu, replacement: 'tú eres', rule: 'acento-tu-eres', desc: 'ضمير الفاعل tú eres' },
  { regex: /\b(tu\s+tienes)\b/giu, replacement: 'tú tienes', rule: 'acento-tu-tienes', desc: 'ضمير الفاعل tú tienes' },
  { regex: /\b(tu\s+vives)\b/giu, replacement: 'tú vives', rule: 'acento-tu-vives', desc: 'ضمير الفاعل tú vives' },
  { regex: /\b(tu\s+hablas)\b/giu, replacement: 'tú hablas', rule: 'acento-tu-hablas', desc: 'ضمير الفاعل tú hablas' },
  { regex: /\b(el\s+es)\b/giu, replacement: 'él es', rule: 'acento-el-es', desc: 'ضمير الغائب él es' },
  { regex: /\b(el\s+tiene)\b/giu, replacement: 'él tiene', rule: 'acento-el-tiene', desc: 'ضمير الغائب él tiene' },
  { regex: /\b(el\s+vive)\b/giu, replacement: 'él vive', rule: 'acento-el-vive', desc: 'ضمير الغائب él vive' },
  { regex: /\b(para\s+el)\b(?!\s+[a-zñáéíóú_])/giu, replacement: 'para él', rule: 'acento-para-el', desc: 'ضمير المجرور para él' },
  { regex: /\b(con\s+el)\b(?!\s+[a-zñáéíóú_])/giu, replacement: 'con él', rule: 'acento-con-el', desc: 'ضمير المجرور con él' },
  { regex: /\b(esta\s+bien)\b/giu, replacement: 'está bien', rule: 'acento-esta-bien', desc: 'فعل está bien' },
  { regex: /\b(esta\s+en)\b(?!\s+casa\b)/giu, replacement: 'está en', rule: 'acento-esta-en', desc: 'فعل está en' },
  { regex: /\b(esta\s+cansad[oa]s?)\b/giu, replacement: 'está cansado', rule: 'acento-esta-cansado', desc: 'فعل está cansado' },
  { regex: /\b(esta\s+list[oa]s?)\b/giu, replacement: 'está listo', rule: 'acento-esta-listo', desc: 'فعل está listo' },
  { regex: /\b(esta\s+abiert[oa]s?)\b/giu, replacement: 'está abierto', rule: 'acento-esta-abierto', desc: 'فعل está abierto' },
  { regex: /\b(esta\s+cerrad[oa]s?)\b/giu, replacement: 'está cerrado', rule: 'acento-esta-cerrado', desc: 'فعل está cerrado' },
];

// حروف الجر والمطابقة الشائعة
const GRAMMAR_CHECKS = [
  { regex: /\b(pensar\s+de\s+[a-záéíóúñ])/giu, desc: 'الاشتباه في استخدام pensar de بدلاً من pensar en (التفكير في)', severity: 'warn' },
  { regex: /\b(soñar\s+de\s+[a-záéíóúñ])/giu, desc: 'استخدام soñar de خطأ شائع — الصحيح soñar con', severity: 'error', replacement: 'soñar con' },
  { regex: /\b(depender\s+en\s+[a-záéíóúñ])/giu, desc: 'استخدام depender en خطأ إنجليزي — الصحيح depender de', severity: 'error', replacement: 'depender de' },
  { regex: /\b(enamorarse\s+con\s+[a-záéíóúñ])/giu, desc: 'استخدام enamorarse con خطأ — الصحيح enamorarse de', severity: 'error', replacement: 'enamorarse de' },
  { regex: /\bla\s+problema\b/giu, desc: 'مطابقة خاطئة: el problema مذكر لا مؤنث', severity: 'error', replacement: 'el problema' },
  { regex: /\bla\s+tema\b/giu, desc: 'مطابقة خاطئة: el tema مذكر لا مؤنث', severity: 'error', replacement: 'el tema' },
  { regex: /\bla\s+sistema\b/giu, desc: 'مطابقة خاطئة: el sistema مذكر لا مؤنث', severity: 'error', replacement: 'el sistema' },
  { regex: /\bla\s+idioma\b/giu, desc: 'مطابقة خاطئة: el idioma مذكر لا مؤنث', severity: 'error', replacement: 'el idioma' },
  { regex: /\bla\s+dia\b/giu, desc: 'مطابقة خاطئة: el día مذكر لا مؤنث', severity: 'error', replacement: 'el día' },
  { regex: /\bel\s+mano\b/giu, desc: 'مطابقة خاطئة: la mano مؤنث لا مذكر', severity: 'error', replacement: 'la mano' },
  { regex: /\bel\s+foto\b/giu, desc: 'مطابقة خاطئة: la foto مؤنث لا مذكر', severity: 'error', replacement: 'la foto' },
];

export async function runDeepAudit() {
  const files = getLessonFiles();
  console.log(`🚀 بدء الفحص اللغوي والتربوي العميق لـ ${files.length} ملف درس...\n`);

  const inventory = {
    totalLessons: files.length,
    byLevel: {},
    exercises: [],
    scenarios: [],
    vocabReferences: [],
    stats: {
      totalExercises: 0,
      totalOptions: 0,
      totalDialogueLines: 0,
      totalStemsChecked: 0,
      totalTranslationsChecked: 0,
    }
  };

  const findings = {
    confirmedErrors: [],
    stylisticObservations: [],
    humanReviewNeeded: []
  };

  for (const f of files) {
    const content = JSON.parse(readFileSync(f, 'utf8'));
    const lesson = content.lesson;
    if (!lesson) continue;

    const lvl = lesson.level || 'PREA1';
    inventory.byLevel[lvl] = (inventory.byLevel[lvl] || 0) + 1;

    // تسجيل المفردات
    for (const v of lesson.newVocabulary || []) {
      inventory.vocabReferences.push({ lesson: lesson.slug, level: lvl, word: v, role: 'new' });
    }
    for (const v of lesson.reviewVocabulary || []) {
      inventory.vocabReferences.push({ lesson: lesson.slug, level: lvl, word: v, role: 'review' });
    }

    // فحص حوارات السيناريو
    for (const sc of lesson.scenarios || []) {
      for (const line of sc.lines || []) {
        inventory.stats.totalDialogueLines++;
        inventory.stats.totalTranslationsChecked++;

        // فحص الترقيم الإسباني (علامات الاستفهام المقلوبة)
        if (line.es.includes('?') && !line.es.includes('¿')) {
          findings.confirmedErrors.push({
            file: f,
            lesson: lesson.slug,
            level: lvl,
            type: 'dialogue_punctuation',
            item: line.audioKey || 'dialogue_line',
            field: 'line.es',
            original: line.es,
            correction: '¿' + line.es,
            reason: 'سؤال ينتهي بـ ? دون علامة الاستفهام المقلوبة ¿ في بدايته',
            rule: 'missing-inverted-question'
          });
        }
        if (line.es.includes('!') && !line.es.includes('¡')) {
          findings.confirmedErrors.push({
            file: f,
            lesson: lesson.slug,
            level: lvl,
            type: 'dialogue_punctuation',
            item: line.audioKey || 'dialogue_line',
            field: 'line.es',
            original: line.es,
            correction: '¡' + line.es,
            reason: 'تعجب ينتهي بـ ! دون علامة التعجب المقلوبة ¡ في بدايته',
            rule: 'missing-inverted-exclamation'
          });
        }

        // فحص النبرات على السطر الإسباني
        for (const rule of ACCENT_FIXES) {
          if (rule.regex.test(line.es)) {
            findings.confirmedErrors.push({
              file: f,
              lesson: lesson.slug,
              level: lvl,
              type: 'dialogue_accent',
              item: line.audioKey || 'dialogue_line',
              field: 'line.es',
              original: line.es,
              reason: rule.desc,
              rule: rule.rule
            });
          }
        }

        // فحص القواعد على السطر الإسباني
        for (const g of GRAMMAR_CHECKS) {
          if (g.regex.test(line.es)) {
            const bucket = g.severity === 'error' ? findings.confirmedErrors : findings.stylisticObservations;
            bucket.push({
              file: f,
              lesson: lesson.slug,
              level: lvl,
              type: 'dialogue_grammar',
              item: line.audioKey || 'dialogue_line',
              field: 'line.es',
              original: line.es,
              reason: g.desc,
              rule: 'grammar-concordance'
            });
          }
        }

        // فحص اتساق الترجمة (النفي والإثبات)
        const isNegativeEs = /\b(no(?!(\s+obstante\b))|nunca|nadie|nada|tampoco)\b/i.test(line.es);
        const isNegativeAr = /(^|[\s،,.:!؟?-])(لا|ولا|فلا|لم|ولم|لن|ولن|ليس|ليست|ما|وما|مش|غير|مافيش|بدون|دون|يسلم)([\s،,.:!؟?-]|$)/.test(line.ar || '');
        if (isNegativeEs && !isNegativeAr && (line.ar || '').length > 0) {
          // التحقق من أنه ليس إثباتًا معنويًا خاصًا
          findings.humanReviewNeeded.push({
            file: f,
            lesson: lesson.slug,
            level: lvl,
            type: 'polarity_mismatch',
            item: line.audioKey || 'dialogue_line',
            originalEs: line.es,
            originalAr: line.ar,
            reason: 'الجملة الإسبانية منفية بـ no/nunca بينما الترجمة العربية قد تفتقر للنفي الصريح'
          });
        }
      }
    }

    // فحص التمارين
    for (const ex of lesson.exercises || []) {
      inventory.stats.totalExercises++;
      inventory.stats.totalOptions += (ex.options || []).length;
      if (ex.stemEs) inventory.stats.totalStemsChecked++;
      if (ex.stemAr) inventory.stats.totalTranslationsChecked++;

      // 1. فحص stemEs
      if (ex.stemEs) {
        if (ex.stemEs.includes('?') && !ex.stemEs.includes('¿')) {
          findings.confirmedErrors.push({
            file: f,
            lesson: lesson.slug,
            level: lvl,
            type: 'stem_punctuation',
            item: ex.id,
            field: 'stemEs',
            original: ex.stemEs,
            reason: 'نص السؤال الإسباني ينتهي بـ ? دون علامة الاستفهام المقلوبة ¿ في بدايته',
            rule: 'missing-inverted-question'
          });
        }
        if (ex.stemEs.includes('!') && !ex.stemEs.includes('¡')) {
          findings.confirmedErrors.push({
            file: f,
            lesson: lesson.slug,
            level: lvl,
            type: 'stem_punctuation',
            item: ex.id,
            field: 'stemEs',
            original: ex.stemEs,
            reason: 'نص التعجب الإسباني ينتهي بـ ! دون علامة التعجب المقلوبة ¡ في بدايته',
            rule: 'missing-inverted-exclamation'
          });
        }
        for (const rule of ACCENT_FIXES) {
          if (rule.regex.test(ex.stemEs)) {
            findings.confirmedErrors.push({
              file: f,
              lesson: lesson.slug,
              level: lvl,
              type: 'stem_accent',
              item: ex.id,
              field: 'stemEs',
              original: ex.stemEs,
              reason: rule.desc,
              rule: rule.rule
            });
          }
        }
        for (const g of GRAMMAR_CHECKS) {
          if (g.regex.test(ex.stemEs)) {
            const bucket = g.severity === 'error' ? findings.confirmedErrors : findings.stylisticObservations;
            bucket.push({
              file: f,
              lesson: lesson.slug,
              level: lvl,
              type: 'stem_grammar',
              item: ex.id,
              field: 'stemEs',
              original: ex.stemEs,
              reason: g.desc,
              rule: 'grammar-concordance'
            });
          }
        }
      }

      // 2. فحص الخيارات
      const seenOpts = new Set();
      for (const opt of ex.options || []) {
        const text = (opt.text || '').trim();
        for (const rule of ACCENT_FIXES) {
          if (rule.regex.test(text)) {
            findings.confirmedErrors.push({
              file: f,
              lesson: lesson.slug,
              level: lvl,
              type: 'option_accent',
              item: ex.id,
              optionId: opt.id,
              field: 'option.text',
              original: text,
              reason: rule.desc,
              rule: rule.rule
            });
          }
        }
        if (seenOpts.has(text.toLowerCase()) && text.length > 0) {
          findings.confirmedErrors.push({
            file: f,
            lesson: lesson.slug,
            level: lvl,
            type: 'duplicate_option',
            item: ex.id,
            optionId: opt.id,
            original: text,
            reason: `خيار مكرر في التمرين نفسه: "${text}"`,
            rule: 'duplicate-option-choice'
          });
        }
        seenOpts.add(text.toLowerCase());
      }

      // 3. فحص مفاتيح الإجابة (تطابق الخيارات)
      if (ex.options && ex.options.length > 0 && ex.answerKey?.correctOptionIds) {
        const optIds = new Set(ex.options.map(o => o.id));
        for (const cid of ex.answerKey.correctOptionIds) {
          if (!optIds.has(cid)) {
            findings.confirmedErrors.push({
              file: f,
              lesson: lesson.slug,
              level: lvl,
              type: 'broken_answer_key',
              item: ex.id,
              reason: `معرف الإجابة الصحيحة ${cid} غير موجود في خيارات التمرين`,
              rule: 'invalid-correct-option-id'
            });
          }
        }
      }

      // 4. فحص تمارين ملء الفراغ
      if (['fill_blank', 'type_missing_word'].includes(ex.type)) {
        if (ex.stemEs && !ex.stemEs.includes('____') && !ex.stemEs.includes('___')) {
          findings.confirmedErrors.push({
            file: f,
            lesson: lesson.slug,
            level: lvl,
            type: 'missing_blank_marker',
            item: ex.id,
            original: ex.stemEs,
            reason: 'تمرين ملء فراغ لا يحتوي على علامة الفراغ (____)',
            rule: 'missing-blank-marker'
          });
        }
        const acc = ex.answerKey?.accepted || [];
        if (acc.length === 0) {
          findings.confirmedErrors.push({
            file: f,
            lesson: lesson.slug,
            level: lvl,
            type: 'empty_accepted_answers',
            item: ex.id,
            reason: 'تمرين نصي بلا أي إجابات مقبولة في answerKey.accepted',
            rule: 'empty-accepted-key'
          });
        }
      }

      // 5. فحص الشرح العربي
      if (!ex.explanationAr || ex.explanationAr.trim().length === 0) {
        findings.confirmedErrors.push({
          file: f,
          lesson: lesson.slug,
          level: lvl,
          type: 'missing_explanation',
          item: ex.id,
          reason: 'التمرين يفتقر تمامًا إلى الشرح العربي التعليمي',
          rule: 'empty-explanation-ar'
        });
      }
    }
  }

  return { inventory, findings };
}

// تشغيل الفحص وحفظ التقرير
(async () => {
  const result = await runDeepAudit();
  const reportPath = join(ROOT, 'reports/audit/deep-linguistic-audit-report.json');
  writeFileSync(reportPath, JSON.stringify(result, null, 2), 'utf8');
  console.log('✅ تم الانتهاء من الفحص وتوليد تقرير التدقيق العميق.');
  console.log(`📊 الإحصائيات:`);
  console.log(`  • الدروس: ${result.inventory.totalLessons}`);
  console.log(`  • التمارين: ${result.inventory.stats.totalExercises}`);
  console.log(`  • أسطر الحوار: ${result.inventory.stats.totalDialogueLines}`);
  console.log(`  • الخيارات المفحوصة: ${result.inventory.stats.totalOptions}`);
  console.log(`  • نصوص الأسئلة (stems) المفحوصة: ${result.inventory.stats.totalStemsChecked}`);
  console.log(`  • الترجمات المفحوصة: ${result.inventory.stats.totalTranslationsChecked}`);
  console.log(`\n🔍 النتائج:`);
  console.log(`  • أخطاء مؤكدة: ${result.findings.confirmedErrors.length}`);
  console.log(`  • ملاحظات أسلوبية: ${result.findings.stylisticObservations.length}`);
  console.log(`  • حالات تتطلب مراجعة بشرية: ${result.findings.humanReviewNeeded.length}`);
})();
