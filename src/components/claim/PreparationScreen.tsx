import { useEffect, useMemo, useState } from 'react';
import {
  ArrowLeft,
  Check,
  Clock,
  Copy,
  MapPin,
  Package,
  Phone,
  Truck,
  Wallet,
} from 'lucide-react';
import type { Order } from '../../data/types';
import { siteConfig } from '../../config/site';
import { formatArabicDate, formatShortDate } from '../../lib/dates';
import { CHECK_BACK_HOURS, daysUntilEta } from '../../lib/delivery';

interface PreparationScreenProps {
  order: Order;
  onBackToSite: () => void;
}

/**
 * صفحة ما بعد إدخال العنوان:
 * «طلبك قيد التجهيز — ارجع إلى التطبيق بعد 12 ساعة لمتابعة حالة الشحنة»
 * مع موعد وصول متوقع = اليوم الثالث بعد أول فتح لصفحة العنوان.
 */
export function PreparationScreen({ order, onBackToSite }: PreparationScreenProps) {
  const [copied, setCopied] = useState(false);
  const remainingDays = daysUntilEta(order.eta);

  const steps = [
    {
      label: 'تم تسجيل الطلب',
      desc: formatShortDate(order.createdAt),
      state: 'done' as const,
      icon: Check,
    },
    {
      label: 'جاري التجهيز',
      desc: 'نحضّر هديتك الآن',
      state: 'active' as const,
      icon: Package,
    },
    {
      label: 'التسليم المتوقع',
      desc: formatShortDate(order.eta),
      state: 'next' as const,
      icon: Truck,
    },
  ];

  const copyTracking = async () => {
    try {
      await navigator.clipboard.writeText(order.tracking);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-0 h-[420px] w-[520px] -translate-x-1/2 rounded-full bg-success/12 blur-[130px]"
      />

      <div className="container-page relative mx-auto max-w-2xl py-10 pb-16">
        <div className="animate-popin text-center">
          <span className="mx-auto grid h-20 w-20 place-items-center rounded-[26px] bg-success/15 ring-1 ring-success/30">
            <Package className="h-9 w-9 text-success" strokeWidth={1.7} />
          </span>

          <p className="mt-5 inline-flex items-center gap-1.5 rounded-full border border-success/30 bg-success/10 px-3 py-1 text-[11px] font-bold text-success">
            <Check className="h-3 w-3" strokeWidth={3} /> وصلنا عنوانك بنجاح
          </p>

          <h1 className="mt-4 font-display text-[27px] font-extrabold leading-[1.4] text-white sm:text-[33px]">
            طلبك قيد التجهيز
          </h1>
          <p className="mx-auto mt-3 max-w-md text-[13.5px] leading-[2] text-muted">
            {order.address.name}، سجّلنا طلب «{order.prizeName}» على عنوانك في{' '}
            {order.address.governorate}. فريقنا يجهّز الشحنة الآن، وما في أي رسوم ولا مبالغ عند
            الاستلام.
          </p>
        </div>

        {/* موعد الوصول المتوقع */}
        <div className="mt-7 overflow-hidden rounded-3xl border border-primary/25 bg-gradient-to-bl from-surface/80 to-deep p-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-[11px] font-bold text-primary">التسليم المتوقع</p>
              <p className="mt-1.5 font-display text-[21px] font-extrabold leading-snug text-white">
                {formatArabicDate(order.eta, { withWeekday: true })}
              </p>
              <p className="mt-1 text-[11.5px] text-white/45">
                {remainingDays === 0
                  ? 'متوقع وصول الشحنة اليوم'
                  : remainingDays === 1
                    ? 'باقي يوم واحد على الوصول'
                    : `باقي ${remainingDays} أيام على الوصول`}
              </p>
            </div>
            <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl border border-primary/25 bg-primary/10 text-primary">
              <Truck className="h-5 w-5" />
            </span>
          </div>

          <div className="my-4 hairline" />

          <div className="flex items-start gap-2.5 rounded-2xl border border-secondary/20 bg-secondary/[0.07] p-3.5">
            <Clock className="mt-0.5 h-4 w-4 shrink-0 text-secondary" />
            <p className="text-[12px] leading-[1.95] text-white/75">
              ارجع إلى التطبيق{' '}
              <span className="font-extrabold text-white">بعد {CHECK_BACK_HOURS} ساعة</span> لمتابعة
              حالة الشحنة برقم التتبع{' '}
              <span className="font-mono text-[11.5px] font-bold text-secondary">
                {order.tracking}
              </span>
              .
            </p>
          </div>
        </div>

        {/* مراحل الطلب */}
        <div className="mt-4 rounded-3xl border border-line bg-surface/50 p-5">
          <ol className="grid grid-cols-3 gap-2">
            {steps.map((step, i) => (
              <li key={step.label} className="relative flex flex-col items-center text-center">
                {i < steps.length - 1 ? (
                  <span
                    aria-hidden="true"
                    className={`absolute left-1/2 top-[15px] h-0.5 w-full ${
                      step.state === 'done' ? 'bg-success/40' : 'bg-white/10'
                    }`}
                  />
                ) : null}
                <span
                  className={`relative z-10 grid h-8 w-8 place-items-center rounded-full border-2 ${
                    step.state === 'done'
                      ? 'border-success bg-success text-[#141218]'
                      : step.state === 'active'
                        ? 'border-primary bg-primary/20 text-primary'
                        : 'border-white/15 bg-deep text-white/25'
                  }`}
                >
                  <step.icon className="h-3.5 w-3.5" strokeWidth={2.6} />
                </span>
                <p
                  className={`mt-2 text-[11px] font-bold ${
                    step.state === 'next' ? 'text-white/45' : 'text-white'
                  }`}
                >
                  {step.label}
                </p>
                <p className="mt-0.5 text-[9.5px] leading-tight text-white/30">{step.desc}</p>
              </li>
            ))}
          </ol>
        </div>

        {/* تفاصيل الشحنة */}
        <div className="mt-4 rounded-3xl border border-line bg-surface/40 p-5">
          <div className="flex items-center justify-between gap-3">
            <p className="text-[11px] font-bold text-white/40">تفاصيل الشحنة</p>
            <span className="rounded-full bg-success/15 px-2.5 py-1 text-[10px] font-bold text-success">
              شحن مجاني
            </span>
          </div>

          <div className="mt-3 space-y-2.5 text-[12px]">
            <Row label="رقم الطلب" value={order.id} mono />
            <Row label="رقم التتبع" value={order.tracking} mono onCopy={copyTracking} copied={copied} />
            <Row label="الهدية" value={order.prizeName} />
            <Row
              label="عنوان التسليم"
              value={`${order.address.governorate}، ${order.address.city} — ${order.address.detail}`}
            />
            <Row label="رقم التواصل" value={order.address.phone} />
          </div>

          <p className="mt-3 flex items-start gap-1.5 text-[10.5px] leading-relaxed text-white/30">
            <Phone className="mt-0.5 h-3 w-3 shrink-0" />
            سيتواصل معك مندوب التوصيل على هذا الرقم قبل الوصول. لا تشارك أي رمز تحقق مع أي شخص.
          </p>
        </div>

        <div className="mt-4 flex items-start gap-2.5 rounded-2xl border border-line bg-surface/30 p-3.5">
          <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-muted" />
          <p className="text-[11px] leading-[1.9] text-white/45">
            التوصيل داخل الأردن خلال {siteConfig.deliveryDays}، بدون رسوم توصيل وبدون أي دفعة عند
            الاستلام. العنوان يُستخدم للشحن فقط ولا يُشارك مع أي طرف ثالث.
          </p>
        </div>

        <div className="mt-5 grid gap-2.5 sm:grid-cols-2">
          <button type="button" onClick={onBackToSite} className="btn-ghost h-12 text-[13px]">
            <ArrowLeft className="h-4 w-4" /> العودة إلى الموقع
          </button>
          <a
            href="#tracking"
            onClick={(e) => {
              e.preventDefault();
              copyTracking();
            }}
            className="btn-primary h-12 text-[13px]"
          >
            <Wallet className="h-4 w-4" />
            {copied ? 'تم نسخ رقم التتبع' : 'نسخ رقم التتبع'}
          </a>
        </div>
      </div>
    </div>
  );
}

function Row({
  label,
  value,
  mono,
  onCopy,
  copied,
}: {
  label: string;
  value: string;
  mono?: boolean;
  onCopy?: () => void;
  copied?: boolean;
}) {
  return (
    <div className="flex items-start justify-between gap-3">
      <span className="shrink-0 text-white/35">{label}</span>
      <span className="flex items-center gap-1.5 text-left text-white/80">
        <span className={mono ? 'font-mono text-[11.5px]' : ''}>{value}</span>
        {onCopy ? (
          <button
            type="button"
            onClick={onCopy}
            aria-label="نسخ رقم التتبع"
            className="grid h-5 w-5 shrink-0 place-items-center rounded text-white/35 transition hover:bg-white/10 hover:text-white"
          >
            {copied ? <Check className="h-3 w-3 text-success" /> : <Copy className="h-3 w-3" />}
          </button>
        ) : null}
      </span>
    </div>
  );
}
