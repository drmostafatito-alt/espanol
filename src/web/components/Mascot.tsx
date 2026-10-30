/* الشخصية التعليمية — تُعرض داخل شاشات الأسئلة فقط (لا تسيطر على بقية الموقع).
   الصورة النقطية القديمة (1.5–1.8MB لكل صورة) استُبدلت برسم متجهي أصلي
   (Solecito) بنفس الواجهة البرمجية، فلا يتغير أي مكان يستدعيها. */
import { Solecito } from './Illustrations';

export type MascotMood = 'wave' | 'celebrate';

export function Mascot({
  mood = 'wave',
  size = 132,
  alt = 'مرشدتك التعليمية',
}: {
  mood?: MascotMood;
  size?: number;
  alt?: string;
}) {
  return (
    <div className="mascot" style={{ width: size }} role="img" aria-label={alt}>
      <Solecito mood={mood} size={size} />
    </div>
  );
}
