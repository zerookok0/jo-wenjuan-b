/**
 * الهدية التي اختارها المستخدم قبل فتح صفحة العنوان (/dizhi).
 * تُحفظ محلياً لأن إدخال العنوان يتم في صفحة مستقلة داخل التطبيق.
 */
const KEY = 'rayak.claim.prize';

export function setPendingPrizeId(prizeId: string): void {
  try {
    localStorage.setItem(KEY, prizeId);
  } catch {
    /* تجاهل أخطاء التخزين */
  }
}

export function getPendingPrizeId(): string | null {
  try {
    return localStorage.getItem(KEY);
  } catch {
    return null;
  }
}
