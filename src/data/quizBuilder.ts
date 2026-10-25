import type { Question, Survey } from './types';
import { AGE, FREQ, MONTHLY_SPEND } from './constants';
import { shuffle } from '../lib/utils';

/** الحد الأدنى والأعلى لعدد أسئلة أي استبيان */
export const MIN_SURVEY_QUESTIONS = 15;
export const MAX_SURVEY_QUESTIONS = 20;

const randomInt = (min: number, max: number): number =>
  Math.floor(Math.random() * (max - min + 1)) + min;

/**
 * بنك أسئلة عامة يصلح لكل الفئات.
 * تُستخدم لتكملة أسئلة الاستبيان الخاصة حتى يصل العدد إلى 15–20 سؤالاً.
 */
function genericPool(survey: Survey): Question[] {
  return [
    { text: 'أين تشتري هذا المنتج عادة؟', type: 'single', options: ['محل قريب من البيت', 'سوبرماركت أو مول', 'أونلاين مع توصيل', 'السوق الشعبي', 'لا أشتريه'] },
    { text: 'كم مرة تشتري هذا المنتج أو تستخدمه؟', type: 'single', options: FREQ },
    { text: 'كم عمرك؟', type: 'single', options: AGE },
    { text: 'أين تسكن؟', type: 'single', options: ['عمّان', 'إربد', 'الزرقاء', 'العقبة', 'محافظة أخرى'] },
    { text: 'كم إنفاقك الشهري على منتجات مشابهة؟', type: 'single', options: MONTHLY_SPEND },
    { text: 'كم المبلغ الذي تراه مناسباً لهذا المنتج؟', type: 'single', options: ['أقل من 5 دنانير', '5 إلى 10 دنانير', '10 إلى 25 دينار', 'أكثر من 25 ديناراً'] },
    {
      text: 'كيف تدفع عادة عند الشراء؟',
      type: 'single',
      options: ['نقداً', 'بطاقة بنكية', 'محفظة إلكترونية', 'حسب المتجر'],
    },
    {
      text: 'هل تفضّل الشراء من متجر قريب أم أونلاين؟',
      type: 'single',
      options: ['متجر قريب', 'أونلاين مع توصيل', 'الاثنان حسب الحاجة'],
    },
    {
      text: 'هل تؤثر تكلفة التوصيل على قرارك بالشراء؟',
      type: 'single',
      options: ['نعم بشكل كبير', 'قليلاً', 'لا تؤثر أبداً', 'أشتريه من المتجر مباشرة'],
    },
    {
      text: 'هل جرّبت هذا المنتج من قبل؟',
      type: 'single',
      options: ['نعم، أستخدمه حالياً', 'استخدمته وتركتُه', 'جرّبت نوعاً مشابهاً', 'لم أجرّبه أبداً'],
    },
    {
      text: 'ما الذي يجعلك تثق بمنتج لم تجرّبه بعد؟',
      type: 'multi',
      max: 3,
      options: ['تقييمات المستخدمين', 'اسم المتجر', 'الدفع عند الاستلام', 'ضمان الاسترجاع', 'توصية صديق'],
    },
    {
      text: 'إلى أي مدى يهمك شكل المنتج ومظهره؟',
      type: 'scale',
      scaleLabels: ['لا يهمني أبداً', 'يهمّني كثيراً'],
    },
    {
      text: 'إلى أي مدى تثق بجودة المنتجات المشابهة في السوق الأردني؟',
      type: 'scale',
      scaleLabels: ['لا أثق أبداً', 'أثق تماماً'],
    },
    {
      text: 'هل تشتري بناءً على توصية من شخص على السوشيال ميديا؟',
      type: 'single',
      options: ['نعم كثيراً', 'أحياناً', 'نادراً', 'لا أهتم'],
    },
    {
      text: 'كم مرة تراجع تقييمات المنتج قبل أن تشتري؟',
      type: 'single',
      options: ['دائماً', 'غالباً', 'أحياناً', 'لا أقرأ التقييمات'],
    },
    {
      text: 'ما أكبر سبب يجعلك تندم على عملية شراء؟',
      type: 'single',
      options: ['جودة أقل من الوصف', 'السعر مرتفع', 'تأخر التوصيل', 'لم يناسبني', 'لا أندم عادة'],
    },
    {
      text: 'هل تفضّل منتجاً محلياً أم مستورداً في نفس الفئة؟',
      type: 'single',
      options: ['محلياً', 'مستورداً', 'حسب الجودة', 'لا فرق عندي'],
    },
    {
      text: 'هل تدفع أكثر مقابل ضمان سنة إضافية؟',
      type: 'single',
      options: ['نعم بكل تأكيد', 'إذا كان الفرق بسيطاً', 'لا أدفع', 'لم أفكّر بالأمر'],
    },
    {
      text: 'أي عرض يدفعك للشراء فوراً؟',
      type: 'multi',
      max: 2,
      options: ['تخفيض مباشر', 'توصيل مجاني', 'هدية مع المنتج', 'تقسيط بدون فوائد', 'ضمان ممتد'],
    },
    {
      text: 'ما الذي يجعلك تعيد الشراء من نفس المتجر؟',
      type: 'multi',
      max: 2,
      options: ['سرعة التوصيل', 'خدمة العميل', 'السعر', 'جودة المنتج', 'سهولة الإرجاع'],
    },
    {
      text: 'كم شخصاً في بيتك يستخدم منتجات مشابهة؟',
      type: 'single',
      options: ['شخص واحد', 'شخصان', 'ثلاثة أو أكثر', 'لا أحد'],
    },
    {
      text: 'هل تطلب عادة عبر واتساب من المتاجر؟',
      type: 'single',
      options: ['نعم دائماً', 'أحياناً', 'أفضّل التطبيقات', 'لا أطلب أونلاين'],
    },
    {
      text: 'عمّن تأخذ نصيحة قبل الشراء؟',
      type: 'multi',
      max: 2,
      options: ['شخص جرّبه قبلي', 'مجموعات فيسبوك', 'مراجعات يوتيوب', 'البائع نفسه', 'لا أسأل أحداً'],
    },
    {
      text: 'كم تنتظر عادة حتى يوصلك الطلب؟',
      type: 'single',
      options: ['في نفس اليوم', 'يوم إلى يومين', 'ثلاثة أيام', 'أكثر من ثلاثة أيام'],
    },
    {
      text: 'هل تؤثر سرعة التوصيل على اختيارك للمتجر؟',
      type: 'single',
      options: ['نعم، أهم عامل', 'مهم لكن ليس الأهم', 'لا يهمني إن كان مجانياً'],
    },
    {
      text: 'هل تشتري هذا النوع من المنتجات كهدية؟',
      type: 'single',
      options: ['نعم كثيراً', 'أحياناً', 'لا، لنفسي فقط'],
    },
    {
      text: 'ما أكبر مشكلة واجهتك مع منتجات مشابهة؟',
      type: 'single',
      options: ['تنتهي بسرعة', 'جودة أقل من الصور', 'لا تتوفر قطع غيار', 'سعرها مرتفع', 'لا مشكلة تذكر'],
    },
    { text: 'ما الذي يضايقك أكثر عند الشراء أونلاين في الأردن؟', type: 'text', hint: 'سطر واحد يكفي' },
    { text: 'لو تقترح تحسيناً واحداً على هذا النوع من المنتجات، ماذا سيكون؟', type: 'text', hint: 'سطر واحد يكفي' },
    { text: `ما رأيك في سعر هذا المنتج داخل الأردن: ${survey.product}؟`, type: 'text', hint: 'اختياري' },
  ];
}

/**
 * يبني قائمة أسئلة الاستبيان:
 * يبدأ بأسئلة الاستبيان الخاصة، ثم يضيف أسئلة عشوائية من البنك العام
 * حتى يصل العدد إلى قيمة عشوائية بين 15 و 20، ثم يخلط الترتيب.
 */
export function buildSurveyQuestions(survey: Survey): Question[] {
  const target = randomInt(MIN_SURVEY_QUESTIONS, MAX_SURVEY_QUESTIONS);
  const ownRaw = Array.isArray(survey.questions) ? survey.questions : [];

  /* نُزيل تكرار الأسئلة من قائمة الاستبيان نفسها أولاً،
     لأن بعض الاستبيانات تحتوي سؤالين بنفس النص. */
  const seen = new Set<string>();
  const picked: Question[] = [];
  for (const question of ownRaw) {
    const key = question.text.trim();
    if (seen.has(key)) continue;
    seen.add(key);
    picked.push(question);
  }

  let textCount = picked.filter((q) => q.type === 'text').length;

  for (const question of shuffle(genericPool(survey))) {
    if (picked.length >= target) break;
    const key = question.text.trim();
    if (seen.has(key)) continue;
    // لا نُثقل المستخدم بالأسئلة الكتابية
    if (question.type === 'text' && textCount >= 3) continue;
    picked.push(question);
    seen.add(key);
    if (question.type === 'text') textCount += 1;
  }

  return shuffle(picked);
}

/** وقت تقديري بالدقائق بحسب عدد الأسئلة الفعلي */
export function estimateMinutes(count: number): number {
  return Math.max(4, Math.min(9, Math.ceil(count / 3)));
}
