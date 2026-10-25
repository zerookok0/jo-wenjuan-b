import { useEffect, useMemo, useState } from 'react';
import { ArrowRight, BadgeCheck, CalendarCheck, Gift, Lock, Package, ShieldCheck, Truck } from 'lucide-react';
import { GOVERNORATES } from '../../data/constants';
import { PRIZES, PRIZE_MAP } from '../../data/prizes';
import { siteConfig } from '../../config/site';
import type { Address, Order } from '../../data/types';
import { getPendingPrizeId, setPendingPrizeId } from '../../lib/claim';
import { formatArabicDate } from '../../lib/dates';
import { computeEta } from '../../lib/delivery';
import { useApp } from '../../store/AppContext';
import { DynamicIcon } from '../ui/DynamicIcon';
import { Field } from '../ui/Field';
import { PreparationScreen } from './PreparationScreen';

const emptyAddress: Address = {
  name: '',
  phone: '',
  governorate: 'عمّان',
  city: '',
  detail: '',
  note: '',
};

interface AddressPageProps {
  onExit: () => void;
}

/**
 * صفحة العنوان المستقلة على المسار /dizhi.
 * — أول فتح لها يحدّد موعد الوصول المتوقع (اليوم الثالث).
 * — بعد الإرسال تظهر صفحة «قيد التجهيز» مع موعد التسليم ورقم التتبع.
 */
export function AddressPage({ onExit }: AddressPageProps) {
  const { addressOpenedAt, markAddressOpened, submitAddressOrder } = useApp();
  const [order, setOrder] = useState<Order | null>(null);
  const [address, setAddress] = useState<Address>(emptyAddress);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  // الموعد المتوقع للوصول = اليوم الثالث بعد أول فتح لهذه الصفحة
  const eta = useMemo(() => computeEta(addressOpenedAt ?? Date.now()), [addressOpenedAt]);

  /* المستخدم يصل من رابط مُرسل مباشرة، فلا توجد هدية محفوظة مسبقاً.
     نبدأ بالهدية المحفوظة إن وُجدت، وإلا بأول هدية متاحة، مع إمكانية التغيير. */
  const [prize, setPrize] = useState(() => {
    const pendingId = getPendingPrizeId();
    if (pendingId && PRIZE_MAP[pendingId]) return PRIZE_MAP[pendingId];
    return PRIZES[0];
  });

  // تسجيل أول فتح للصفحة — أساس حساب موعد الوصول
  useEffect(() => {
    markAddressOpened();
  }, [markAddressOpened]);

  // تغيير الهدية يُحفظ فوراً حتى لا يضيع إن أعاد المستخدم تحميل الصفحة
  const selectPrize = (prizeId: string) => {
    const next = PRIZE_MAP[prizeId];
    if (!next) return;
    setPrize(next);
    setPendingPrizeId(next.id);
  };

  // تمرير لأعلى الصفحة عند تبديل الشاشة
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, [order]);

  const validate = (): boolean => {
    const next: Record<string, string> = {};
    if (address.name.trim().length < 3) next.name = 'اكتب الاسم الكامل كما في الهوية';
    const digits = address.phone.replace(/\D/g, '');
    if (digits.length < 9) next.phone = 'رقم الهاتف يجب أن يكون 9 أرقام على الأقل';
    else if (!/^07\d{8}$/.test(digits)) next.phone = 'الرقم يبدأ بـ 07 ويكون 10 أرقام';
    if (!address.city.trim()) next.city = 'اكتب المدينة أو المنطقة';
    if (address.detail.trim().length < 8) next.detail = 'اكتب عنواناً أوضح (شارع، بناية، طابق)';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;
    if (!validate()) return;
    setSubmitting(true);
    const created = submitAddressOrder(prize.id, prize.name, address);
    setOrder(created);
    setSubmitting(false);
  };

  if (order) {
    return <PreparationScreen order={order} onBackToSite={onExit} />;
  }

  return (
    <div className="relative min-h-screen overflow-hidden">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-24 top-0 h-[400px] w-[420px] rounded-full bg-primary/18 blur-[130px]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-20 top-40 h-[320px] w-[320px] rounded-full bg-secondary/12 blur-[120px]"
      />

      <div className="container-page relative mx-auto max-w-2xl py-8 pb-16">
        <div className="flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={onExit}
            className="inline-flex items-center gap-1.5 rounded-full px-2 py-2 text-[13px] text-muted transition hover:text-white"
          >
            <ArrowRight className="h-4 w-4" /> رجوع
          </button>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-success/30 bg-success/10 px-2.5 py-1 text-[10.5px] font-bold text-success">
            <Lock className="h-2.5 w-2.5" /> بدون بطاقة بنكية
          </span>
        </div>

        <header className="mt-5 animate-popin">
          <p className="inline-flex items-center gap-1.5 rounded-full border border-line bg-surface/70 px-3 py-1 text-[10.5px] font-bold text-primary">
            <Package className="h-3 w-3" /> خطوة أخيرة · إدخال عنوان الشحن
          </p>
          <h1 className="mt-3 font-display text-[26px] font-extrabold leading-[1.4] text-white sm:text-[32px]">
            وين نوصّل هديتك؟
          </h1>
          <p className="mt-2 text-[13.5px] leading-[2] text-muted">
            اكتب عنوانك مرة واحدة، ومنوصّلها لباب البيت خلال {siteConfig.deliveryDays} — بدون أي
            رسوم توصيل وبدون أي دفعة عند الاستلام.
          </p>
        </header>

        {/* اختيار الهدية — متاح لأن المستخدم قد يصل من رابط مباشر بلا اختيار سابق */}
        <div className="mt-5 rounded-3xl border border-line bg-surface/40 p-4">
          <div className="flex items-center justify-between gap-2">
            <p className="text-[11px] font-bold text-white/40">الهدية المختارة</p>
            <span className="rounded-full bg-success/15 px-2.5 py-1 text-[10px] font-bold text-success">
              مجاناً
            </span>
          </div>

          <div className="mt-3 flex items-center gap-3">
            <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl border border-primary/25 bg-primary/10 text-primary">
              <DynamicIcon name={prize.icon} className="h-5 w-5" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-[14px] font-extrabold text-white">{prize.name}</p>
              <p className="truncate text-[11px] text-muted">{prize.note}</p>
            </div>
          </div>

          <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
            {PRIZES.map((item) => {
              const active = item.id === prize.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => selectPrize(item.id)}
                  aria-pressed={active}
                  className={
                    'shrink-0 rounded-xl border px-2.5 py-2 text-[10.5px] font-bold transition ' +
                    (active
                      ? 'border-primary/60 bg-primary/15 text-white'
                      : 'border-line bg-white/[0.03] text-white/45 hover:border-white/25 hover:text-white/80')
                  }
                >
                  {item.name.length > 22 ? `${item.name.slice(0, 22)}…` : item.name}
                </button>
              );
            })}
          </div>
        </div>

        <form onSubmit={handleSubmit} noValidate className="mt-5">
          <div className="space-y-3.5 rounded-3xl border border-line bg-surface/40 p-5">
            <Field
              label="اسم المستلم"
              required
              value={address.name}
              error={errors.name}
              placeholder="الاسم الكامل كما في الهوية"
              onChange={(v) => setAddress((a) => ({ ...a, name: v }))}
              autoComplete="name"
            />
            <Field
              label="رقم الهاتف"
              required
              value={address.phone}
              error={errors.phone}
              placeholder="07XXXXXXXX"
              inputMode="tel"
              maxLength={13}
              onChange={(v) => setAddress((a) => ({ ...a, phone: v }))}
              autoComplete="tel"
              hint="سيتصل بك مندوب التوصيل على هذا الرقم قبل الوصول."
            />

            <div>
              <label
                htmlFor="gov"
                className="mb-1.5 flex items-center gap-1 text-[12.5px] font-bold text-white/80"
              >
                المحافظة <span className="text-danger">*</span>
              </label>
              <select
                id="gov"
                value={address.governorate}
                onChange={(e) => setAddress((a) => ({ ...a, governorate: e.target.value }))}
                className="h-12 w-full rounded-2xl border border-line bg-surface/60 px-4 text-[13.5px] text-white transition focus:border-primary/50 focus:outline-none"
              >
                {GOVERNORATES.map((g) => (
                  <option key={g} value={g} className="bg-deep">
                    {g}
                  </option>
                ))}
              </select>
            </div>

            <Field
              label="المدينة / المنطقة"
              required
              value={address.city}
              error={errors.city}
              placeholder="مثال: الجبيهة، الحصن، الرصيفة"
              onChange={(v) => setAddress((a) => ({ ...a, city: v }))}
            />
            <Field
              label="العنوان بالتفصيل"
              required
              value={address.detail}
              error={errors.detail}
              placeholder="الشارع، رقم البناية، الطابق، علامة مميزة"
              onChange={(v) => setAddress((a) => ({ ...a, detail: v }))}
              autoComplete="street-address"
            />

            <div>
              <label
                htmlFor="addr-note"
                className="mb-1.5 flex items-center gap-1 text-[12.5px] font-bold text-white/80"
              >
                ملاحظات <span className="text-white/30">(اختياري)</span>
              </label>
              <textarea
                id="addr-note"
                rows={2}
                value={address.note ?? ''}
                onChange={(e) => setAddress((a) => ({ ...a, note: e.target.value }))}
                placeholder="مثال: الاتصال قبل الوصول، أو التسليم بعد العصر"
                className="w-full resize-none rounded-2xl border border-line bg-surface/60 p-3.5 text-[13.5px] leading-[1.9] text-white placeholder:text-white/30 transition focus:border-primary/50 focus:outline-none"
              />
            </div>
          </div>

          <div className="mt-4 grid gap-2.5 sm:grid-cols-2">
            <div className="flex items-start gap-2.5 rounded-2xl border border-secondary/20 bg-secondary/[0.06] p-3.5">
              <Truck className="mt-0.5 h-4 w-4 shrink-0 text-secondary" />
              <p className="text-[11.5px] leading-[1.9] text-white/60">
                التوصيل متاح لجميع محافظات المملكة. الشحنة تُجهَّز خلال{' '}
                <span className="font-bold text-white">12 ساعة</span>، ويصلك إشعار التتبع بعدها.
              </p>
            </div>
            <div className="flex items-start gap-2.5 rounded-2xl border border-primary/20 bg-primary/[0.07] p-3.5">
              <CalendarCheck className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
              <p className="text-[11.5px] leading-[1.9] text-white/60">
                الوصول المتوقع:{' '}
                <span className="font-bold text-white">
                  {formatArabicDate(eta, { withWeekday: true })}
                </span>
              </p>
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="btn-primary mt-4 h-14 w-full text-[15px]"
          >
            <Gift className="h-4 w-4" />
            تأكيد العنوان (بدون دفع)
          </button>

          <div className="mt-3 flex flex-wrap items-center justify-center gap-x-3 gap-y-1.5 text-[10.5px] text-white/30">
            <span className="inline-flex items-center gap-1">
              <ShieldCheck className="h-3 w-3 text-success" /> بياناتك للشحن فقط
            </span>
            <span className="inline-flex items-center gap-1">
              <BadgeCheck className="h-3 w-3 text-success" /> لا نطلب أي بيانات بنكية
            </span>
            <span className="inline-flex items-center gap-1">
              <Lock className="h-3 w-3 text-success" /> اتصال مشفّر
            </span>
          </div>
        </form>
      </div>
    </div>
  );
}
