import type { PrizeProduct } from './types';

/**
 * الجوائز: أسماء منتجات فقط — بدون ذكر أي سعر أو قيمة.
 * الأسماء شائعة في السوق الأردني ويمكن تعديلها من لوحة التحكم.
 */
export const PRIZES: PrizeProduct[] = [
  {
    id: 'p1',
    name: 'باور بانك شاومي 10,000 مللي أمبير',
    category: 'إلكترونيات',
    icon: 'BatteryCharging',
    stock: 40,
    note: 'شحن سريع مع كيبل مدمج',
    hot: true,
  },
  {
    id: 'p2',
    name: 'سماعات بلوتوث لاسلكية',
    category: 'إلكترونيات',
    icon: 'Headphones',
    stock: 32,
    note: 'علبة شحن وعمر بطارية طويل',
    hot: true,
  },
  {
    id: 'p3',
    name: 'فرشاة أسنان كهربائية',
    category: 'عناية',
    icon: 'Zap',
    stock: 28,
    note: 'مع رأسين إضافيين',
  },
  {
    id: 'p4',
    name: 'مروحة مكتب قابلة للشحن',
    category: 'منزل',
    icon: 'Fan',
    stock: 65,
    note: 'ثلاث سرعات وضوء ليلي',
  },
  {
    id: 'p5',
    name: 'مكبر صوت بلوتوث صغير',
    category: 'إلكترونيات',
    icon: 'Speaker',
    stock: 22,
    note: 'صوت واضح وحجم صغير',
  },
  {
    id: 'p6',
    name: 'كوب حفظ حرارة ستانلس',
    category: 'منزل',
    icon: 'CupSoda',
    stock: 54,
    note: 'يحفظ الحرارة ساعات طويلة',
  },
  {
    id: 'p7',
    name: 'شاحن جداري سريع مع كيبل',
    category: 'إلكترونيات',
    icon: 'Cable',
    stock: 90,
    note: 'منفذ USB-C وكيبل مقاوم',
  },
  {
    id: 'p8',
    name: 'مصباح مكتب LED',
    category: 'منزل',
    icon: 'Lamp',
    stock: 47,
    note: 'إضاءة مريحة للعين وقابل للطي',
  },
  {
    id: 'p9',
    name: 'ساعة يد رقمية',
    category: 'إلكترونيات',
    icon: 'Watch',
    stock: 26,
    note: 'مقاومة للماء وشاشة واضحة',
  },
  {
    id: 'p10',
    name: 'طقم أدوات عناية شخصية',
    category: 'عناية',
    icon: 'Scissors',
    stock: 38,
    note: 'مقص وأدوات بجودة جيدة',
  },
  {
    id: 'p11',
    name: 'حافظة هاتف مع شاشة حماية',
    category: 'إلكترونيات',
    icon: 'Smartphone',
    stock: 110,
    note: 'حماية من الصدمات والخدوش',
  },
  {
    id: 'p12',
    name: 'حقيبة ظهر خفيفة',
    category: 'منزل',
    icon: 'Backpack',
    stock: 21,
    note: 'مكان للابتوب والجوال',
  },
];

export const PRIZE_MAP: Record<string, PrizeProduct> = Object.fromEntries(
  PRIZES.map((p) => [p.id, p]),
);
