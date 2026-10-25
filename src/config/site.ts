import type { PrizeProduct } from '../data/types';

/**
 * ⚙️ لوحة التحكم — عدّل من هنا كل ما يظهر في الموقع دون لمس الكود.
 * أي تغيير هنا ينعكس مباشرة على الصفحة.
 */
export interface SiteConfig {
  brandName: string;
  tagline: string;
  heroTitle: string;
  heroHighlight: string;
  heroSubtitle: string;
  points: string[];
  /** عدد الاستبيانات المعروضة عشوائياً في الصفحة الرئيسية */
  visibleCount: { min: number; max: number };
  faq: { q: string; a: string }[];
  /** نص وعد البيانات */
  dataPromise: { q: string; a: string };
  supportEmail: string;
  appName: string;
  appSize: string;
  deliveryDays: string;
  prizes: PrizeProduct[];
}

export const siteConfig: SiteConfig = {
  brandName: 'رأيك الأردن',
  tagline: 'استبيانات من قلب السوق الأردني',
  heroTitle: 'أجب عن استبيان قصير',
  heroHighlight: 'وهديتك توصلك لباب البيت',
  heroSubtitle:
    'كل استبيان مرتبط بمنتج واحد. تجاوب بصراحة، تختار هديتك، وتوصل إلى عنوانك في الأردن — بدون أي رسوم وبدون بطاقة بنكية وبدون عنوان فوترة.',

  points: [
    'بدون أي رسوم أو مبالغ',
    'بدون بطاقة بنكية أو عنوان فوترة',
    'الهدية تُشحن إلى عنوانك في الأردن',
    'التوصيل خلال 1 إلى 3 أيام عمل',
    'بياناتك تُستخدم لأغراض البحث فقط',
  ],

  visibleCount: { min: 30, max: 90 },

  dataPromise: {
    q: 'هل البيانات حقيقية؟',
    a: 'نعم، البيانات حقيقية. كل إجابة تُسجَّل كما وصلتنا وتُستخدم في تحليل آراء المستهلكين داخل الأردن، ونحن لا نعدّل على النتائج ولا ننشر أرقاماً غير صحيحة.',
  },

  faq: [
    {
      q: 'هل المشاركة مجانية تماماً؟',
      a: 'نعم، مجانية بالكامل. لا نطلب أي مبلغ ولا رسوم توصيل ولا تأمين. أي صفحة تطلب منك الدفع ليست تابعة لنا.',
    },
    {
      q: 'هل أحتاج إلى بطاقة بنكية؟',
      a: 'لا. نحن لا نطلب بطاقة بنكية ولا رقم CVV ولا عنوان فوترة. تحتاج فقط اسم المستلم ورقم الهاتف والعنوان.',
    },
    {
      q: 'كيف أستلم الهدية؟',
      a: 'بعد إكمال الاستبيان تختار الهدية، ثم تُدخل عنوانك مرة واحدة، ويصلك الطلب خلال 1 إلى 3 أيام عمل. تظهر لك صفحة تتبع برقم شحنة.',
    },
    {
      q: 'لماذا يجب تحميل التطبيق؟',
      a: 'التطبيق مخصص لإدخال عنوان الشحن ومتابعة حالة الطلب. حجمه صغير ولا يحتوي على أي عملية دفع، ويمكنك استخدام نسخة الويب إن فضّلت.',
    },
    {
      q: 'هل يمكنني إكمال أكثر من استبيان؟',
      a: 'نعم. تظهر لك مجموعة استبيانات مختلفة كل مرة، ويمكنك إكمال أكثر من استبيان والحصول على هدية واحدة عن كل استبيان مكتمل.',
    },
    {
      q: 'هل بياناتي محفوظة؟',
      a: 'عنوانك يُستخدم للشحن فقط، ولا نشاركه مع أي طرف ثالث. يمكنك حذف بياناتك من صفحة محفظتي في أي وقت.',
    },
    {
      q: 'ماذا لو كانت الهدية غير متوفرة؟',
      a: 'نستبدلها بمنتج آخر بنفس الفئة، أو نعطيك خيار اختيار بديل معروض في الصفحة. لن نطلب منك أي مبلغ فارق.',
    },
  ],

  supportEmail: 'hello@rayak.jo',
  appName: 'رأيك الأردن',
  appSize: '18 ميجابايت',
  deliveryDays: '1 – 3 أيام عمل',

  prizes: [],
};

export function pickVisibleCount(config: SiteConfig, total: number): number {
  const { min, max } = config.visibleCount;
  const lo = Math.max(1, Math.min(min, total));
  const hi = Math.max(lo, Math.min(max, total));
  return Math.floor(Math.random() * (hi - lo + 1)) + lo;
}

/** نفس المنطق لكن يعتمد على القيم القابلة للتعديل من لوحة التحكم */
export function pickVisibleCountRange(
  range: { min: number; max: number },
  total: number,
): number {
  const lo = Math.max(1, Math.min(range.min, total));
  const hi = Math.max(lo, Math.min(range.max, total));
  return Math.floor(Math.random() * (hi - lo + 1)) + lo;
}
