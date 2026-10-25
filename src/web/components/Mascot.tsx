/* الشخصية الكرتونية التعليمية — تظهر داخل شاشات الأسئلة فقط (لا تسيطر على بقية الموقع). */

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
  const src = mood === 'celebrate' ? '/img/mascot-celebrate.png' : '/img/mascot-wave.png';
  return (
    <div className="mascot" style={{ width: size }}>
      <img src={src} alt={alt} loading="lazy" width={size} height={size} />
    </div>
  );
}
