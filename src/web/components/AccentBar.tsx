/**
 * شريط الأحرف الإسبانية الخاصة — يدرج الحرف عند موضع المؤشر في حقول الكتابة
 * دون حاجة إلى تثبيت لوحة مفاتيح إسبانية على جهاز المتعلم العربي.
 */
const SPANISH_CHARS = ['á', 'é', 'í', 'ó', 'ú', 'ü', 'ñ', '¿', '¡'] as const;

export function AccentBar({
  onInsert,
  disabled = false,
  label = 'أحرف إسبانية مساعدة',
}: {
  onInsert: (ch: string) => void;
  disabled?: boolean;
  label?: string;
}) {
  return (
    <div className="accent-bar" role="toolbar" aria-label={label} dir="ltr">
      {SPANISH_CHARS.map(ch => (
        <button
          key={ch}
          type="button"
          className="accent-key es"
          disabled={disabled}
          onMouseDown={e => e.preventDefault()}
          onClick={() => onInsert(ch)}
          aria-label={`إدراج الحرف ${ch}`}
        >
          {ch}
        </button>
      ))}
    </div>
  );
}

/** يدرج حرفًا في موضع المؤشر داخل input/textarea مع الحفاظ على موضع المؤشر */
export function insertAtCursor(
  el: HTMLInputElement | HTMLTextAreaElement | null,
  currentValue: string,
  ch: string,
  onChange: (next: string) => void,
): void {
  if (!el) {
    onChange(`${currentValue}${ch}`);
    return;
  }
  const start = el.selectionStart ?? currentValue.length;
  const end = el.selectionEnd ?? currentValue.length;
  const next = `${currentValue.slice(0, start)}${ch}${currentValue.slice(end)}`;
  onChange(next);
  window.requestAnimationFrame(() => {
    try {
      el.focus();
      el.setSelectionRange(start + ch.length, start + ch.length);
    } catch {
      /* تجاهل البيئات التي لا تدعم setSelectionRange */
    }
  });
}
