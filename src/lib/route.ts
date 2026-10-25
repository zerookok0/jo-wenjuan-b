/**
 * مسارات الموقع. صفحة إدخال العنوان لها مسار ثابت /dizhi
 * حتى يمكن فتحها مباشرة من رابط يُرسل للمستخدم.
 *
 * ملاحظة مهمة: الاستضافات الثابتة لا تُرجع index.html للمسارات الفرعية
 * ما لم تُضبط قاعدة إرجاع. لذلك ندعم أيضاً الصيغة المحصّنة `/#dizhi`
 * التي تبقى على الجذر وتعمل على أي استضافة بلا إعدادات.
 */
export const ADDRESS_PATH = '/dizhi';
export const ADDRESS_HASH = 'dizhi';

const HASH_PATTERN = /^#\/?dizhi\/?$/i;

/** /dizhi أو /dizhi/ بأي حالة أحرف */
export function isAddressPath(pathname: string): boolean {
  return pathname.replace(/\/+$/, '').toLowerCase() === ADDRESS_PATH;
}

/** #dizhi أو #/dizhi */
export function isAddressHash(hash: string): boolean {
  return HASH_PATTERN.test(hash);
}

/** يقرأ العنوان الحالي ويدعم الصيغتين معاً */
export function isAddressRoute(): boolean {
  if (typeof window === 'undefined') return false;
  return isAddressPath(window.location.pathname) || isAddressHash(window.location.hash);
}

/** رابط صفحة العنوان بالصيغة التي تعمل على أي استضافة */
export function addressSafeLink(): string {
  return `#${ADDRESS_HASH}`;
}

/** يبني مساراً مطلقاً بغض النظر عن مكان نشر الموقع */
export function toAbsolutePath(path: string): string {
  const base = import.meta.env.BASE_URL || '/';
  const trimmedBase = base.endsWith('/') ? base.slice(0, -1) : base;
  return `${trimmedBase}${path}`;
}
