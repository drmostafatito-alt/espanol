/* قوالب رسائل البريد — عربية أوّلًا (جمهور المتعلمين) مع سطر إسباني، وبلا أي رابط
   غير المطلوب. لا تُوضع أسرار في القوالب: الرمز يأتي من المستدعي فقط. */

export interface RenderedMail {
  subject: string;
  text: string;
  html: string;
}

const esc = (s: string): string =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

function shell(title: string, bodyAr: string[], bodyEs: string, cta: { label: string; url: string }, footer: string): string {
  return `<!doctype html><html lang="ar" dir="rtl"><head><meta charset="utf-8"><title>${esc(title)}</title></head>
<body style="margin:0;padding:24px;background:#f6f7fb;font-family:system-ui,'Segoe UI',Tahoma,Arial,sans-serif;color:#1c2333">
  <div style="max-width:560px;margin:0 auto;background:#fff;border-radius:14px;padding:28px;border:1px solid #e5e8f0">
    <h1 style="font-size:20px;margin:0 0 16px">${esc(title)}</h1>
    ${bodyAr.map(p => `<p style="margin:0 0 12px;line-height:1.8">${esc(p)}</p>`).join('')}
    <p style="margin:24px 0"><a href="${esc(cta.url)}" style="display:inline-block;background:#1d4ed8;color:#fff;text-decoration:none;padding:12px 20px;border-radius:10px;font-weight:600">${esc(cta.label)}</a></p>
    <p style="direction:ltr;text-align:left;font-size:13px;color:#5b6478;margin:0 0 6px">${esc(bodyEs)}</p>
    <p style="font-size:12px;color:#8a93a6;margin:18px 0 0">${esc(footer)}</p>
  </div>
</body></html>`;
}

export function verifyEmailMail(link: string, ttlHours: number): RenderedMail {
  const subject = 'فعّل بريدك في Español بالعربي · Confirma tu correo';
  const bodyAr = [
    'أهلًا بك! تم إنشاء حساب على منصّة «Español بالعربي».',
    `لتأكيد بريدك اضغط الزر أدناه خلال ${ttlHours} ساعة. الرابط صالح لمرة واحدة.`,
    'إن لم تنشئ أنت هذا الحساب فتجاهل الرسالة — لن يُفعَّل شيء.',
  ];
  const text = `${bodyAr.join('\n')}\n\n${link}\n\nHola: confirma tu correo en Español بالعربي (enlace válido ${ttlHours} h, un solo uso).`;
  const html = shell('تأكيد البريد الإلكتروني', bodyAr, `Hola: confirma tu correo (válido ${ttlHours} h, un solo uso).`, { label: 'تأكيد البريد', url: link }, 'Español بالعربي — رسالة آلية، لا تُجب عليها.');
  return { subject, text, html };
}

export function resetPasswordMail(link: string, ttlMinutes: number): RenderedMail {
  const subject = 'إعادة تعيين كلمة المرور · Restablecer contraseña';
  const bodyAr = [
    'وصلك طلب لإعادة تعيين كلمة المرور في «Español بالعربي».',
    `اضغط الزر أدناه خلال ${ttlMinutes} دقيقة. الرابط صالح لمرة واحدة، وكل الجلسات الأخرى ستُغلق بعد التعيين.`,
    'إن لم تطلب ذلك فلا تفعل شيئًا: كلمة مرورك الحالية تبقى كما هي.',
  ];
  const text = `${bodyAr.join('\n')}\n\n${link}\n\nHola: restablece tu contraseña (enlace válido ${ttlMinutes} min, un solo uso).`;
  const html = shell('إعادة تعيين كلمة المرور', bodyAr, `Hola: restablece tu contraseña (válido ${ttlMinutes} min, un solo uso).`, { label: 'تعيين كلمة مرور جديدة', url: link }, 'Español بالعربي — إن لم تطلب هذا، تجاهل الرسالة.');
  return { subject, text, html };
}
