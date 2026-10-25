import { addDays, daysBetween, startOfDay } from './dates';

/**
 * قواعد التوصيل المعتمدة في الأردن:
 * — الطلب يبقى قيد التجهيز 12 ساعة قبل أن يصبح قابلاً للتتبع.
 * — موعد الوصول المتوقع = اليوم الثالث بعد أول فتح لصفحة العنوان (/dizhi).
 */
export const DELIVERY_DAYS = 3;
export const CHECK_BACK_HOURS = 12;
export const CHECK_BACK_MS = CHECK_BACK_HOURS * 3_600_000;

/** اليوم الثالث بعد أول فتح لصفحة العنوان، مثبّت على بداية اليوم */
export function computeEta(openedAt: number): number {
  return startOfDay(addDays(openedAt, DELIVERY_DAYS));
}

/** الوقت المتبقي حتى يصبح تتبع الشحنة متاحاً داخل التطبيق */
export function msUntilTracking(openedAt: number, now = Date.now()): number {
  return Math.max(0, openedAt + CHECK_BACK_MS - now);
}

/** كم يوماً بقي على موعد الوصول المتوقع */
export function daysUntilEta(eta: number, now = Date.now()): number {
  return Math.max(0, daysBetween(now, eta));
}

/** «بعد 12 ساعة» / «بعد ساعة» — صياغة عربية سليمة */
export function formatCheckBackLabel(hours = CHECK_BACK_HOURS): string {
  if (hours === 1) return 'بعد ساعة';
  if (hours === 2) return 'بعد ساعتين';
  if (hours <= 10) return `بعد ${hours} ساعات`;
  return `بعد ${hours} ساعة`;
}
