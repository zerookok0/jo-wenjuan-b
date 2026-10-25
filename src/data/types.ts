export type CategoryId =
  | 'electronics'
  | 'food'
  | 'beauty'
  | 'home'
  | 'telecom'
  | 'retail'
  | 'general';

/** معرّفات قطاعات السوق المستخدمة في الاستبيانات */
export type TopicId = 'electronics' | 'food' | 'beauty' | 'home' | 'telecom' | 'retail';

export interface Topic {
  id: TopicId;
  name: string;
  accent: string;
  icon: string;
}

export type QType = 'single' | 'multi' | 'scale' | 'text';

export interface Question {
  text: string;
  type: QType;
  options?: string[];
  max?: number;
  scaleLabels?: [string, string];
  hint?: string;
}

/**
 * استبيان واحد = هدية واحدة.
 * اسم الهدية هو عنوان الاستبيان، والأسئلة تُبنى تلقائياً حسب فئة الهدية.
 */
export interface Survey {
  id: string;
  /** اسم الهدية (يأتي من قائمة الهدايا في لوحة التحكم) */
  product: string;
  /** الماركة أو المواصفة المختصرة كما تظهر تحت العنوان */
  brand: string;
  /** قطاع السوق */
  topic: TopicId;
  note: string;
  minutes: number;
  badge?: string;
  featured?: boolean;
  questions: Question[];
}

export interface Category {
  id: CategoryId;
  name: string;
  accent: string;
  icon: string;
  notes: string[];
}

export interface PrizeProduct {
  id: string;
  name: string;
  /** اسم الفئة بالعربية كما يظهر على البطاقة */
  category: string;
  icon: string;
  note: string;
  stock: number;
  hot?: boolean;
}

export type Answers = Record<string, string | string[] | number>;

export interface Address {
  name: string;
  phone: string;
  governorate: string;
  city: string;
  detail: string;
  note?: string;
}

export type OrderStatus = 'قيد التجهيز' | 'تم الإرسال' | 'تم التسليم';

export interface Order {
  id: string;
  /** معرّف الهدية في قائمة الجوائز */
  prizeId: string;
  /** اسم الهدية المرتبطة بالاستبيان */
  prizeName: string;
  /** الاستبيان الذي منح الهدية (إن وُجد) */
  surveyId?: string;
  createdAt: number;
  address: Address;
  status: OrderStatus;
  tracking: string;
  /** أول مرة فُتحت فيها صفحة العنوان /dizhi — أساس حساب موعد الوصول */
  addressOpenedAt: number;
  /** موعد الوصول المتوقع (اليوم الثالث بعد فتح صفحة العنوان) */
  eta: number;
}

export interface CompletedSurvey {
  surveyId: string;
  product: string;
  at: number;
  answers: Answers;
  /** هل نزّل التطبيق؟ إدخال العنوان يتم داخل التطبيق */
  appDownloaded?: boolean;
}
