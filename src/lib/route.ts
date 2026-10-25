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

/* ————— لوحة التحكم ————— */

export const ADMIN_HASH = 'admin';
const ADMIN_HASH_PATTERN = /^#?\/?admin\/?$/i;

/**
 * يدعم كل الصيغ التي قد يكتبها المستخدم في شريط العنوان:
 *   /?admin      /?admin=1      /admin      #admin      #/admin
 */
export function isAdminRoute(): boolean {
  if (typeof window === 'undefined') return false;
  const { hash, pathname, search } = window.location;

  // 1) الهاش: #admin أو #/admin
  if (ADMIN_HASH_PATTERN.test(hash.trim())) return true;

  // 2) المسار: /admin
  const path = pathname.replace(/\/+$/, '').toLowerCase();
  if (path.endsWith('/admin')) return true;

  // 3) الاستعلام: ?admin أو ?admin=1 أو ?panel=admin
  const params = new URLSearchParams(search);
  if (params.has('admin')) return true;
  if ((params.get('panel') ?? '').toLowerCase() === 'admin') return true;

  return false;
}

/** يزيل علامة لوحة التحكم من الرابط بعد فتحها حتى لا تتكرر لاحقاً */
export function clearAdminRoute(): void {
  if (typeof window === 'undefined') return;
  const { pathname, search, hash } = window.location;
  const params = new URLSearchParams(search);
  let changed = false;

  if (params.has('admin')) {
    params.delete('admin');
    changed = true;
  }
  if ((params.get('panel') ?? '').toLowerCase() === 'admin') {
    params.delete('panel');
    changed = true;
  }
  if (ADMIN_HASH_PATTERN.test(hash.trim())) changed = true;

  if (!changed) return;

  const nextSearch = params.toString();
  window.history.replaceState({}, '', `${pathname}${nextSearch ? `?${nextSearch}` : ''}`);
}

/** يبني مساراً مطلقاً بغض النظر عن مكان نشر الموقع */
export function toAbsolutePath(path: string): string {
  const base = import.meta.env.BASE_URL || '/';
  const trimmedBase = base.endsWith('/') ? base.slice(0, -1) : base;
  return `${trimmedBase}${path}`;
}
