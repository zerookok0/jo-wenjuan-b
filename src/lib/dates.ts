/**
 * أدوات التاريخ بصيغة أردنية محلية:
 * أسماء الأشهر الشامية (آذار، نيسان، أيار...) وأسماء أيام الأسبوع،
 * مع أرقام لاتينية لأنها المتعارف عليها في الأردن.
 */

export const MINUTE_MS = 60_000;
export const HOUR_MS = 3_600_000;
export const DAY_MS = 86_400_000;

const MONTHS = [
  'كانون الثاني',
  'شباط',
  'آذار',
  'نيسان',
  'أيار',
  'حزيران',
  'تموز',
  'آب',
  'أيلول',
  'تشرين الأول',
  'تشرين الثاني',
  'كانون الأول',
] as const;

const WEEKDAYS = [
  'الأحد',
  'الاثنين',
  'الثلاثاء',
  'الأربعاء',
  'الخميس',
  'الجمعة',
  'السبت',
] as const;

/** إضافة أيام تقويمية مع الحفاظ على الساعة (آمن مع التوقيت الصيفي) */
export function addDays(ts: number, days: number): number {
  const d = new Date(ts);
  d.setDate(d.getDate() + days);
  return d.getTime();
}

export function startOfDay(ts: number): number {
  const d = new Date(ts);
  d.setHours(0, 0, 0, 0);
  return d.getTime();
}

/** عدد الأيام التقويمية بين تاريخين */
export function daysBetween(from: number, to: number): number {
  return Math.round((startOfDay(to) - startOfDay(from)) / DAY_MS);
}

export function weekdayName(ts: number): string {
  return WEEKDAYS[new Date(ts).getDay()];
}

export function formatArabicDate(
  ts: number,
  options: { withWeekday?: boolean; withYear?: boolean } = {},
): string {
  const { withWeekday = false, withYear = true } = options;
  const d = new Date(ts);
  const parts = [`${d.getDate()} ${MONTHS[d.getMonth()]}`];
  if (withYear) parts.push(String(d.getFullYear()));
  const date = parts.join(' ');
  return withWeekday ? `${weekdayName(ts)} ${date}` : date;
}

/** صيغة مناسبة للمواعيد القريبة: «الاثنين 13 حزيران» */
export function formatShortDate(ts: number): string {
  return formatArabicDate(ts, { withWeekday: true, withYear: false });
}

export function formatClock(ts: number): string {
  const d = new Date(ts);
  const hour24 = d.getHours();
  const hour12 = hour24 % 12 === 0 ? 12 : hour24 % 12;
  const minutes = String(d.getMinutes()).padStart(2, '0');
  const suffix = hour24 < 12 ? 'صباحاً' : hour24 < 17 ? 'ظهراً' : 'مساءً';
  return `${hour12}:${minutes} ${suffix}`;
}

/** «بعد 3 ساعات» / «بعد 12 ساعة» مع التذكير والتأنيث الصحيحين */
export function formatHoursFromNow(hours: number): string {
  if (hours <= 1) return 'خلال ساعة';
  if (hours === 2) return 'خلال ساعتين';
  if (hours <= 10) return `خلال ${hours} ساعات`;
  return `خلال ${hours} ساعة`;
}

export function formatCountdown(ms: number): string {
  const total = Math.max(0, Math.floor(ms / 1000));
  const hours = Math.floor(total / 3600);
  const minutes = Math.floor((total % 3600) / 60);
  const seconds = total % 60;
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
}

/** فرق نسبي بالعربية للتواريخ القريبة */
export function formatRelative(ts: number, now = Date.now()): string {
  const diff = now - ts;
  if (diff < MINUTE_MS) return 'الآن';
  if (diff < HOUR_MS) {
    const minutes = Math.floor(diff / MINUTE_MS);
    return minutes === 1 ? 'قبل دقيقة' : `قبل ${minutes} دقيقة`;
  }
  if (diff < DAY_MS) {
    const hours = Math.floor(diff / HOUR_MS);
    return hours === 1 ? 'قبل ساعة' : `قبل ${hours} ساعات`;
  }
  const days = daysBetween(ts, now);
  if (days === 1) return 'أمس';
  if (days === 2) return 'قبل يومين';
  if (days <= 10) return `قبل ${days} أيام`;
  return formatArabicDate(ts, { withYear: false });
}
