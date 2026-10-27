/**
 * حساب سلسلة أيام النشاط من تواريخ مميزة بصيغة YYYY-MM-DD (بتوقيت UTC،
 * وهو نفس توقيت الطوابع المخزنة في القاعدة).
 *
 * التعريف: «يوم نشاط» هو أي يوم سُجّل فيه إكمال درس أو مراجعة SRS أو منح XP.
 * السلسلة الحالية: عدد الأيام المتتالية التي تنتهي اليوم أو أمس — فإن كان
 * آخر نشاط قبل أمس، فالسلسلة الحالية صفر (لا تُعرض سلسلة منتهية كأنها حية).
 * أطول سلسلة: أطول تتابع أيام متتالية في السجل كله.
 */
export function computeStreaks(
  dates: string[],
  today: string,
): { current: number; longest: number } {
  const dayNums = new Set<number>();
  for (const d of dates) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(d)) continue;
    const ms = Date.parse(`${d}T00:00:00.000Z`);
    if (Number.isNaN(ms)) continue;
    dayNums.add(Math.floor(ms / 86_400_000));
  }
  if (dayNums.size === 0) return { current: 0, longest: 0 };

  const todayNum = Math.floor(Date.parse(`${today}T00:00:00.000Z`) / 86_400_000);

  // أطول سلسلة: مسح كل الأيام وعدّ التتابعات
  let longest = 0;
  for (const n of dayNums) {
    if (dayNums.has(n - 1)) continue; // ليس بداية تتابع
    let run = 1;
    while (dayNums.has(n + run)) run++;
    if (run > longest) longest = run;
  }

  // السلسلة الحالية: تبدأ من أحدث يوم نشاط إن كان اليوم أو أمس
  const latest = Math.max(...dayNums);
  if (latest < todayNum - 1) return { current: 0, longest };
  let current = 1;
  while (dayNums.has(latest - current)) current++;
  return { current, longest };
}
