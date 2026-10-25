import type { Question } from './types';
import { AGE, BUY_PLACES, FREQ, MONTHLY_SPEND } from './constants';

/** أسئلة عامة عن السلوك الشرائي في الأردن */
export const qBuyPlace = (): Question => ({
  text: 'أين تشتري هذا المنتج عادة؟',
  type: 'single',
  options: BUY_PLACES,
});

export const qFrequency = (): Question => ({
  text: 'كم مرة تشتري هذا المنتج أو تستخدمه؟',
  type: 'single',
  options: FREQ,
});

export const qPrice = (options: string[] = ['أقل من 5 دنانير', '5 إلى 10 دنانير', '10 إلى 20 دينار', 'أكثر من 20 دينار']): Question => ({
  text: 'كم تدفع عادة لهذا المنتج؟',
  type: 'single',
  options,
});

export const qDecide = (): Question => ({
  text: 'ما أهم شيء يحسم قرارك بالشراء؟',
  type: 'single',
  options: ['السعر', 'الجودة', 'اسم الماركة', 'تجربة شخص سابق', 'الضمان وخدمة ما بعد البيع'],
});

export const qDiscovery = (): Question => ({
  text: 'كيف تعرفت على هذا المنتج آخر مرة؟',
  type: 'single',
  options: ['تيك توك أو إنستغرام', 'توصية صديق أو قريب', 'إعلان في الشارع', 'البحث في جوجل', 'شاهدته على رف المتجر'],
});

export const qSatisfaction = (): Question => ({
  text: 'ما مدى رضاك عن المنتج الذي تستخدمه حالياً؟',
  type: 'scale',
  scaleLabels: ['غير راضٍ أبداً', 'راضٍ تماماً'],
});

export const qRecommend = (): Question => ({
  text: 'هل تنصح صديقاً بهذا المنتج؟',
  type: 'single',
  options: ['أنصح به بالتأكيد', 'ربما أنصح به', 'لا أنصح به', 'لم أجرّبه بعد'],
});

export const qSwitch = (): Question => ({
  text: 'ما الذي يجعلك تغيّر المنتج الذي تستخدمه؟',
  type: 'multi',
  max: 3,
  options: ['ارتفاع السعر', 'سوء الجودة', 'عرض أو خصم على منتج آخر', 'نفاد المنتج من السوق', 'تجربة سيئة مع خدمة العميل'],
});

export const qGovernorate = (): Question => ({
  text: 'أين تسكن؟',
  type: 'single',
  options: ['عمّان', 'إربد', 'الزرقاء', 'العقبة', 'محافظة أخرى'],
});

export const qAge = (): Question => ({
  text: 'كم عمرك؟',
  type: 'single',
  options: AGE,
});

export const qSpend = (): Question => ({
  text: 'كمية إنفاقك الشهري على المنتجات المشابهة؟',
  type: 'single',
  options: MONTHLY_SPEND,
});

export const qOffers = (): Question => ({
  text: 'ما نوع العرض الذي يدفعك للشراء فوراً؟',
  type: 'multi',
  max: 2,
  options: ['تخفيض مباشر', 'توصيل مجاني', 'هدية مع المنتج', 'تقسيط بدون فوائد', 'ضمان ممتد'],
});

export const qTrust = (): Question => ({
  text: 'ما الذي يزيد ثقتك بمتجر أونلاين أردني؟',
  type: 'multi',
  max: 3,
  options: ['تقييمات حقيقية بالصور', 'الدفع عند الاستلام', 'رقم واتساب للتواصل', 'سياسة استرجاع واضحة', 'صور المنتج الفعلية'],
});

export const qDelivery = (): Question => ({
  text: 'كم تنتظر عادة حتى يوصلك الطلب؟',
  type: 'single',
  options: ['في نفس اليوم', 'يوم إلى يومين', 'ثلاثة أيام', 'أكثر من ثلاثة أيام'],
});

export const qNote = (text: string, hint?: string): Question => ({
  text,
  type: 'text',
  ...(hint ? { hint } : {}),
});

export const qAnyProblem = (): Question => ({
  text: 'ما أكبر مشكلة واجهتك مع المنتجات المشابهة؟',
  type: 'single',
  options: ['تنتهي بسرعة', 'جودة أقل من الصور', 'قطعة غيار غير متوفرة', 'سعرها مرتفع', 'لا مشكلة تذكر'],
});
