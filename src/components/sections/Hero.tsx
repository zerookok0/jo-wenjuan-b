import { ArrowRight, BadgeCheck, ClipboardCheck, Gift, Lock, MapPin, ShieldCheck, Truck } from 'lucide-react';
import { useConfig } from '../../config/useConfig';
import { totalSurveys } from '../../data/surveys';
import { Reveal } from '../ui/Reveal';

interface HeroProps {
  onStart: () => void;
  giftsAvailable: number;
}

export function Hero({ onStart, giftsAvailable }: HeroProps) {
  const config = useConfig();
  return (
    <section id="top" className="relative overflow-hidden pt-6 sm:pt-10">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-40 top-10 h-[420px] w-[420px] rounded-full bg-primary/25 blur-[120px] animate-drift"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-32 top-0 h-[380px] w-[380px] rounded-full bg-sand/15 blur-[110px] animate-drift [animation-delay:-7s]"
      />

      <div className="container-page relative grid items-center gap-12 pb-16 lg:grid-cols-[1.05fr_0.95fr] lg:gap-10 lg:pb-24">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/[0.08] px-3.5 py-1.5 text-[12px] font-medium text-primary">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-primary" />
            </span>
            استبيانات السوق الأردني · {totalSurveys} استبياناً متاحاً
          </div>

          <h1 className="mt-6 font-display text-[38px] font-extrabold leading-[1.25] text-white sm:text-[52px] lg:text-[58px]">
            {config.heroTitle}
            <br />
            <span className="text-brand">{config.heroHighlight}</span>
          </h1>

          <p className="mt-5 max-w-xl text-[16px] leading-[1.9] text-white/70 sm:text-[17px]">
            {config.heroSubtitle}
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
            <button type="button" onClick={onStart} className="btn-primary group h-14 px-7 text-[15.5px]">
              <Gift className="h-[18px] w-[18px]" />
              اختر استبياناً وابدأ
              <ArrowRight className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
            </button>
            <a href="#how" className="btn-ghost h-14 px-6 text-[15px]">
              <ClipboardCheck className="h-[18px] w-[18px]" />
              كيف تحصل على الهدية
            </a>
          </div>

          <div className="mt-7 flex flex-wrap items-center gap-x-5 gap-y-3 text-[12.5px] text-muted">
            <span className="inline-flex items-center gap-1.5">
              <Lock className="h-3.5 w-3.5 text-success" /> بدون أي رسوم
            </span>
            <span className="inline-flex items-center gap-1.5">
              <ShieldCheck className="h-3.5 w-3.5 text-secondary" /> بدون بطاقة بنكية
            </span>
            <span className="inline-flex items-center gap-1.5">
              <MapPin className="h-3.5 w-3.5 text-primary" /> بدون عنوان فوترة
            </span>
          </div>

          <div className="mt-8 grid max-w-lg grid-cols-3 gap-3">
            {[
              { value: `${totalSurveys}`, label: 'استبياناً متاحاً' },
              { value: '4–6', label: 'دقائق للاستبيان' },
              { value: '0', label: 'دينار تدفعه' },
            ].map((item) => (
              <div key={item.label} className="rounded-2xl border border-line/80 bg-surface/40 px-3 py-3.5">
                <div className="font-display text-[24px] font-extrabold leading-none text-white">
                  {item.value}
                </div>
                <div className="mt-1.5 text-[11.5px] leading-tight text-muted">{item.label}</div>
              </div>
            ))}
          </div>

          {giftsAvailable > 0 ? (
            <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-success/30 bg-success/10 px-3.5 py-2 text-[12.5px] font-medium text-success">
              <BadgeCheck className="h-3.5 w-3.5" />
              لديك {giftsAvailable} هدية جاهزة للاستلام
            </div>
          ) : null}
        </div>

        {/* معاينة الجوال */}
        <div className="relative mx-auto w-full max-w-[420px] lg:max-w-none">
          <div className="pointer-events-none absolute inset-0 -m-6 rounded-[48px] bg-gradient-to-br from-primary/25 via-secondary/10 to-sand/20 blur-3xl" />

          <div className="relative animate-floaty [animation-duration:9s]">
            <div className="relative mx-auto w-[300px] rounded-[42px] border border-white/15 bg-[#0F0D14] p-2 shadow-[0_50px_120px_-40px_rgba(0,0,0,0.95)] sm:w-[330px]">
              <div className="absolute left-1/2 top-2.5 z-10 h-5 w-24 -translate-x-1/2 rounded-full bg-black" />
              <div className="grain relative overflow-hidden rounded-[34px] bg-[#141018] px-4 pb-5 pt-10">
                <div className="absolute -left-10 -top-12 h-40 w-40 rounded-full bg-primary/25 blur-2xl" />

                <div className="relative flex items-center justify-between">
                  <span className="text-[11px] font-medium text-white/50">استبيان اليوم</span>
                  <span className="rounded-full bg-success/15 px-2 py-0.5 text-[10px] font-bold text-success">
                    بدون رسوم
                  </span>
                </div>

                <div className="relative mt-3 rounded-2xl border border-white/10 bg-white/[0.04] p-3.5">
                  <p className="text-[10px] text-white/40">المنتج</p>
                  <p className="mt-0.5 text-[13px] font-bold text-white">باور بانك 10,000 مللي أمبير</p>
                  <div className="mt-2.5 h-1 overflow-hidden rounded-full bg-white/10">
                    <div className="h-full w-2/3 rounded-full bg-brand" />
                  </div>
                  <p className="mt-1.5 text-[10px] text-white/40">السؤال 5 من 8</p>
                </div>

                <div className="relative mt-3 space-y-2">
                  <p className="text-[12.5px] font-bold leading-snug text-white">
                    ما أهم شيء يحسم قرارك بالشراء؟
                  </p>
                  {['السعر', 'الجودة', 'اسم الماركة'].map((opt, i) => (
                    <div
                      key={opt}
                      className={
                        i === 1
                          ? 'flex items-center justify-between rounded-xl border border-primary/60 bg-primary/15 px-3 py-2.5 text-[11.5px] text-white'
                          : 'flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2.5 text-[11.5px] text-white/55'
                      }
                    >
                      {opt}
                      <span
                        className={
                          i === 1
                            ? 'grid h-4 w-4 place-items-center rounded-full bg-primary text-[#141218]'
                            : 'h-4 w-4 rounded-full border border-white/25'
                        }
                      >
                        {i === 1 ? <BadgeCheck className="h-3 w-3" strokeWidth={3} /> : null}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="relative mt-3.5 flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2.5">
                  <span className="text-[10.5px] text-white/45">بعد الانتهاء تختار هديتك</span>
                  <span className="inline-flex items-center gap-1 rounded-lg bg-brand px-2.5 py-1 text-[10.5px] font-extrabold text-[#141218]">
                    التالي <ArrowRight className="h-3 w-3" />
                  </span>
                </div>
              </div>
            </div>

            <div className="absolute -right-3 top-[20%] hidden animate-floaty rounded-2xl border border-white/10 bg-[#1D1A24]/95 px-3.5 py-2.5 shadow-card backdrop-blur [animation-delay:-2.5s] sm:block">
              <div className="flex items-center gap-2">
                <span className="grid h-7 w-7 place-items-center rounded-full bg-success/15 text-success">
                  <Truck className="h-3.5 w-3.5" />
                </span>
                <div>
                  <p className="text-[11px] font-bold text-white">توصيل داخل الأردن</p>
                  <p className="text-[9.5px] text-white/40">{config.deliveryDays}</p>
                </div>
              </div>
            </div>

            <div className="absolute -left-2 bottom-[14%] hidden animate-floaty rounded-2xl border border-white/10 bg-[#1D1A24]/95 px-3.5 py-2.5 shadow-card backdrop-blur [animation-delay:-4.5s] sm:block">
              <p className="text-[9.5px] text-white/40">بدون أي دفع</p>
              <p className="mt-0.5 font-display text-[15px] font-extrabold text-white">0 دينار</p>
            </div>
          </div>
        </div>
      </div>

      <Reveal className="container-page">
        <div className="grid gap-2.5 rounded-3xl border border-line bg-surface/40 p-4 sm:grid-cols-2 lg:grid-cols-5">
          {config.points.map((point) => (
            <div key={point} className="flex items-start gap-2 text-[12.5px] leading-relaxed text-white/75">
              <BadgeCheck className="mt-0.5 h-3.5 w-3.5 shrink-0 text-success" />
              {point}
            </div>
          ))}
        </div>
      </Reveal>
    </section>
  );
}
