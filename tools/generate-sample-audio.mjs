import { existsSync, mkdirSync, readFileSync, writeFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';

const ROOT = process.cwd();
const AUDIO_DIR = join(ROOT, 'public', 'audio', 'es-ES');
const PIPER_EXE = join(ROOT, 'tools', 'audio-engine', 'piper', 'piper.exe');
const MODEL_ONNX = join(ROOT, 'tools', 'audio-engine', 'es_ES-davefx-medium.onnx');
const MANIFEST_PATH = join(ROOT, 'src', 'web', 'audio', 'assetManifest.json');

if (!existsSync(AUDIO_DIR)) mkdirSync(AUDIO_DIR, { recursive: true });

export const SAMPLE_ITEMS = [
  // 1. أصوات صعبة وحالات النبر (Phonetics)
  { id: 'phonetic_rr_perro', cat: 'phonetic', text: 'El perro corre rápido por el parque.', notes: 'نطق الراء المكررة المشددة (rr)' },
  { id: 'phonetic_rr_ferrocarril', cat: 'phonetic', text: 'El ferrocarril llega a las cinco.', notes: 'راءات متتالية في كلمة واحدة' },
  { id: 'phonetic_cz_gracias', cat: 'phonetic', text: 'Muchas gracias por su atención.', notes: 'صوت الثاء الإسبانية (distinción z/c)' },
  { id: 'phonetic_cz_cerveza', cat: 'phonetic', text: 'Una cerveza fría con limón, por favor.', notes: 'تتابع c و z في نفس العبارة' },
  { id: 'phonetic_jg_gente', cat: 'phonetic', text: 'Hay mucha gente joven en la plaza.', notes: 'صوت الخاء (jota) في g و j' },
  { id: 'phonetic_jg_trabajo', cat: 'phonetic', text: 'Mi hijo busca trabajo en Madrid.', notes: 'نطق j في hijo و trabajo' },
  { id: 'phonetic_ac_comodos', cat: 'phonetic', text: 'Estos zapatos son muy cómodos.', notes: 'نبر الكلمة على المقطع الاستباقي (esdrújula)' },
  { id: 'phonetic_ac_cancion', cat: 'phonetic', text: 'Esta canción está en la radio.', notes: 'نبرات حادة في نهاية الكلمة (aguda con tilde)' },
  { id: 'phonetic_h_hablar', cat: 'phonetic', text: 'Hola, tenemos que hablar ahora.', notes: 'صوت H الصامت في ثلاث كلمات متتالية' },
  { id: 'phonetic_h_habitacion', cat: 'phonetic', text: 'La habitación del hotel está limpia.', notes: 'H صامتة مع نبرة حادة' },
  { id: 'phonetic_ll_llamo', cat: 'phonetic', text: 'Me llamo Guillermo y vivo en Sevilla.', notes: 'نطق اللام المزدوجة (ll / yeísmo)' },
  { id: 'phonetic_ll_llegar', cat: 'phonetic', text: 'Vamos a llegar tarde a la calle Mayor.', notes: 'll في أفعال وأسماء' },

  // 2. كلمات منفردة أساسية (Core Vocabulary)
  { id: 'core_agua', cat: 'core_vocab', text: 'Agua', notes: 'اسم مؤنث يبدأ بـ a منبورة' },
  { id: 'core_cafe', cat: 'core_vocab', text: 'Café', notes: 'نبرة حادة أخيرة' },
  { id: 'core_leche', cat: 'core_vocab', text: 'Leche', notes: 'صوت ch' },
  { id: 'core_por_favor', cat: 'core_vocab', text: 'Por favor', notes: 'عبارة أدب يومية' },
  { id: 'core_adios', cat: 'core_vocab', text: 'Adiós', notes: 'وداع مع إدغام diós' },
  { id: 'core_manana', cat: 'core_vocab', text: 'Mañana', notes: 'حرف ñ النطعي' },
  { id: 'core_buenos_dias', cat: 'core_vocab', text: 'Buenos días', notes: 'تحية صباحية شائعة' },
  { id: 'core_buenas_noches', cat: 'core_vocab', text: 'Buenas noches', notes: 'تحية مسائية' },

  // 3. جمل قصيرة وأسئلة شائعة (Short Questions)
  { id: 'short_como_te_llamas', cat: 'short_question', text: '¿Cómo te llamas?', notes: 'سؤال تعارف أساسي' },
  { id: 'short_cuanto_cuesta', cat: 'short_question', text: '¿Cuánto cuesta esto?', notes: 'سؤال عن السعر' },
  { id: 'short_donde_esta_bano', cat: 'short_question', text: '¿Dónde está el baño?', notes: 'سؤال مكاني حيوي' },
  { id: 'short_no_entiendo', cat: 'short_question', text: 'Perdón, no entiendo español muy bien.', notes: 'عبارة إيضاح للمتعلم' },
  { id: 'short_puede_repetir', cat: 'short_question', text: '¿Puede repetir más despacio, por favor?', notes: 'طلب إعادة بنبرة مؤدبة' },
  { id: 'short_que_hora_es', cat: 'short_question', text: '¿Qué hora es?', notes: 'سؤال عن الوقت' },
  { id: 'short_mucho_gusto', cat: 'short_question', text: 'Mucho gusto en conocerte.', notes: 'تعارف وتودد' },
  { id: 'short_de_nada', cat: 'short_question', text: 'De nada, fue un placer ayudarte.', notes: 'رد على الشكر' },

  // 4. حوارات المطاعم والمقاهي (Restaurant Track - A1 Cafe)
  { id: 'a1-cafe-que-le-pongo', cat: 'restaurant', text: 'Buenos días, ¿qué le pongo?', notes: 'سؤال العامل في المقهى (يطابق درس A1)' },
  { id: 'a1-cafe-quiero-cafe-con-leche', cat: 'restaurant', text: 'Quiero un café con leche, por favor.', notes: 'طلب القهوة بالحليب (يطابق درس A1)' },
  { id: 'a1-cafe-para-tomar-o-llevar', cat: 'restaurant', text: '¿Para tomar aquí o para llevar?', notes: 'سؤال المكان أو الخارج (يطابق درس A1)' },
  { id: 'a1-cafe-para-llevar-cuanto-cuesta', cat: 'restaurant', text: 'Para llevar, por favor. ¿Cuánto cuesta?', notes: 'إجابة وسؤال عن التكلفة (يطابق درس A1)' },
  { id: 'a1-cafe-un-euro-cincuenta', cat: 'restaurant', text: 'Un euro con cincuenta céntimos, por favor.', notes: 'نطق المبالغ والعملة (يطابق درس A1)' },
  { id: 'restaurant_la_cuenta', cat: 'restaurant', text: 'Camarero, la cuenta, por favor.', notes: 'طلب الحساب في المطعم' },
  { id: 'restaurant_mesa_dos', cat: 'restaurant', text: 'Buenas tardes, ¿tienen mesa libre para dos personas?', notes: 'حجز طاولة' },
  { id: 'restaurant_menu_dia', cat: 'restaurant', text: '¿Tienen el menú del día?', notes: 'سؤال عن قائمة الغداء' },

  // 5. حوارات السفر والمطار والفندق (Travel Track)
  { id: 'travel_checkin', cat: 'travel', text: 'Buenos días, vengo a hacer el check-in para el vuelo.', notes: 'تسجيل الوصول بالمطار' },
  { id: 'travel_pasaporte', cat: 'travel', text: 'Aquí tiene mi pasaporte y la tarjeta de embarque.', notes: 'تقديم وثائق السفر' },
  { id: 'travel_puerta_embarque', cat: 'travel', text: '¿Cuál es la puerta de embarque para el vuelo a Barcelona?', notes: 'البحث عن بوابة الصعود' },
  { id: 'travel_recoger_equipaje', cat: 'travel', text: 'Disculpe, ¿dónde puedo recoger el equipaje de mano?', notes: 'استلام الأمتعة' },
  { id: 'travel_estacion_metro', cat: 'travel', text: '¿Dónde está la estación de metro más cercana al hotel?', notes: 'سؤال عن المواصلات' },
  { id: 'travel_billete_ida_vuelta', cat: 'travel', text: 'Quisiera comprar un billete de ida y vuelta, por favor.', notes: 'شراء تذكرة قطار' },
  { id: 'travel_hotel_reserva', cat: 'travel', text: 'Tengo una reserva de habitación a nombre de Omar.', notes: 'استقبال الفندق' },
  { id: 'travel_desayuno_incluido', cat: 'travel', text: '¿A qué hora se sirve el desayuno y está incluido?', notes: 'استفسار فندقي' },

  // 6. حوارات الكول سنتر وخدمة العملاء (Call Center Track)
  { id: 'cc1-opening-omar', cat: 'callcenter', text: 'Servicio de atención al cliente, buenos días, ¿en qué puedo ayudarle?', notes: 'افتتاحية كول سنتر رسمية (تطابق درس CC1)' },
  { id: 'cc1-ask-order-number', cat: 'callcenter', text: '¿Me puede proporcionar su número de pedido, por favor?', notes: 'طلب رقم الطلب بأدب' },
  { id: 'cc1-hold-comprobar', cat: 'callcenter', text: 'Permítame un momento en línea mientras compruebo los datos en el sistema.', notes: 'وضع العميل على الانتظار' },
  { id: 'cc1-customer-cancelar', cat: 'callcenter', text: 'Quisiera cancelar mi suscripción porque no voy a usar el servicio.', notes: 'طلب إلغاء من العميل' },
  { id: 'cc1-solicitud-registrada', cat: 'callcenter', text: 'Su solicitud ha sido registrada con éxito en nuestro sistema.', notes: 'تأكيد التسجيل بنجاح' },
  { id: 'cc1-closing', cat: 'callcenter', text: 'Gracias por comunicarse con nosotros, que tenga un excelente día.', notes: 'خاتمة مهنية للمكالمة' },

  // 7. جمل طويلة ومركبة (Complex Sentences)
  { id: 'complex_condicional', cat: 'complex', text: 'Si tuviera más tiempo libre este año, estudiaría español todos los días con entusiasmo.', notes: 'جملة شرطية افتراضية مع subjunctive' },
  { id: 'complex_academico', cat: 'complex', text: 'Es imprescindible que todos los participantes confirmen su asistencia antes del inicio de la conferencia internacional.', notes: 'تركيب رسمي متقدم' },
];

function parseWavHeader(buffer) {
  if (buffer.length < 44) return null;
  const riff = buffer.toString('ascii', 0, 4);
  const wave = buffer.toString('ascii', 8, 12);
  if (riff !== 'RIFF' || wave !== 'WAVE') return null;

  const sampleRate = buffer.readUInt32LE(24);
  const byteRate = buffer.readUInt32LE(28);
  const bitsPerSample = buffer.readUInt16LE(34);
  const channels = buffer.readUInt16LE(22);
  const dataSize = buffer.length - 44;
  const durationSec = byteRate > 0 ? dataSize / byteRate : 0;

  return { sampleRate, channels, bitsPerSample, durationSec };
}

function generate() {
  console.log(`\n🎙️ بدء توليد العينة الصوتية المحدودة (52 عنصرًا) باستخدام محرك Piper محليًا\n`);
  const manifest = {};
  let totalBytes = 0;
  let totalDuration = 0;
  const generatedList = [];

  for (let i = 0; i < SAMPLE_ITEMS.length; i++) {
    const item = SAMPLE_ITEMS[i];
    const wavName = `${item.id}.wav`;
    const wavPath = join(AUDIO_DIR, wavName);

    // تشغيل Piper عبر تمرير النص إلى stdin
    const proc = spawnSync(PIPER_EXE, [
      '--model', MODEL_ONNX,
      '--output_file', wavPath,
    ], {
      input: item.text,
      encoding: 'utf-8',
    });

    if (proc.error || proc.status !== 0) {
      console.error(`❌ فشل توليد [${item.id}]:`, proc.stderr || proc.error);
      throw new Error(`Piper generation failed for ${item.id}`);
    }

    const fileBuf = readFileSync(wavPath);
    const wavInfo = parseWavHeader(fileBuf);
    if (!wavInfo || fileBuf.length < 1000) {
      throw new Error(`ملف تالف أو فارغ لـ ${item.id}`);
    }

    totalBytes += fileBuf.length;
    totalDuration += wavInfo.durationSec;

    manifest[item.id] = {
      file: wavName,
      text: item.text,
      category: item.cat,
      durationMs: Math.round(wavInfo.durationSec * 1000),
      sizeBytes: fileBuf.length,
      sampleRate: wavInfo.sampleRate,
    };

    // إضافة مفتاح معلّق موازي إذا كان يطابق مفاتيح المحتوى (مثل pending/a1-cafe-...)
    if (item.id.startsWith('a1-cafe-') || item.id.startsWith('cc1-')) {
      manifest[`pending/${item.id}`] = manifest[item.id];
    }

    generatedList.push({
      num: i + 1,
      id: item.id,
      cat: item.cat,
      text: item.text,
      sec: wavInfo.durationSec.toFixed(2),
      kb: Math.round(fileBuf.length / 1024),
      notes: item.notes,
    });

    console.log(`  ✓ [${i + 1}/${SAMPLE_ITEMS.length}] ${item.id} (${wavInfo.durationSec.toFixed(2)}s, ${Math.round(fileBuf.length / 1024)} KB)`);
  }

  // حفظ سجل الأصول في src/web/audio/assetManifest.json
  writeFileSync(MANIFEST_PATH, JSON.stringify(manifest, null, 2), 'utf-8');
  console.log(`\n📄 كُتب بيان الأصول الصوتية: ${MANIFEST_PATH}`);

  console.log(`\n📊 ملخص التوليد:`);
  console.log(`  • إجمالي الملفات المولدة: ${SAMPLE_ITEMS.length}`);
  console.log(`  • المدة الزمنية الكلية: ${totalDuration.toFixed(1)} ثانية (~${(totalDuration / 60).toFixed(1)} دقيقة)`);
  console.log(`  • الحجم الإجمالي على القرص: ${(totalBytes / 1024 / 1024).toFixed(2)} MB (صيغة WAV 22.05kHz 16-bit)`);
  console.log(`  • الحجم التقديري إذا ضُغط بـ Opus (24kbps): ${(totalDuration * 3 / 1024).toFixed(2)} MB (~${Math.round(totalDuration * 3)} KB)`);

  return { generatedList, totalDuration, totalBytes };
}

generate();
