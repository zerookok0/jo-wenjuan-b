import { useState } from 'react';
import { Gift, Lock, MapPin, PackageCheck, Truck } from 'lucide-react';
import type { PrizeProduct } from '../../data/types';
import { cn } from '../../lib/utils';
import { DynamicIcon } from '../ui/DynamicIcon';
import { Reveal } from '../ui/Reveal';

interface GiftsProps {
  prizes: PrizeProduct[];
  giftsAvailable: number;
  onClaim: () => void;
  onStart: () => void;
}

const CATEGORIES = ['الكل', 'إلكترونيات', 'عناية', 'منزل'] as const;
type Cat = (typeof CATEGORIES)[number];

export function GiftsSection({ prizes, giftsAvailable, onClaim, onStart }: GiftsProps) {
  const [cat, setCat] = useState<Cat>('الكل');
  const list = cat === 'الكل' ? prizes : prizes.filter((p) => p.category === cat);

  return (
    <section id="gifts" className="scroll-mt-20 py-16 sm:py-20">
      <div className="container-page">
        <Reveal className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <span className="chip border-accent/30 text-accent">
              <Gift className="h-3.5 w-3.5" /> الهدايا
            </span>
            <h2 className="mt-4 max-w-2xl font-display text-[28px] font-extrabold leading-snug text-white sm:text-[36px]">
              هدايا عملية تستخدمها كل يوم
            </h2>
            <p className="mt-3 max-w-xl text-[14.5px] leading-[1.9] text-muted">
              اختر منتجاً واحداً بعد إكمال أي استبيان. الهدية تُشحن إلى عنوانك داخل الأردن، والمخزون
              يتحدّث تلقائياً.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setCat(c)}
                aria-pressed={cat === c}
                className={cn(
                  'rounded-full border px-4 py-2 text-[12.5px] font-medium transition',
                  cat === c
                    ? 'border-primary/60 bg-primary/15 text-white'
                    : 'border-line bg-surface/40 text-muted hover:text-white',
                )}
              >
                {c}
              </button>
            ))}
          </div>
        </Reveal>

        <div className="mt-8 grid gap-3.5 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((prize, i) => (
            <Reveal key={prize.id} delay={Math.min(i, 6) * 40}>
              <article className="group relative flex h-full flex-col overflow-hidden rounded-3xl border border-line bg-gradient-to-bl from-surface/80 to-deep/80 p-5 transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-glow-sm">
                <div className="relative flex items-start justify-between">
                  <div className="relative grid h-16 w-16 place-items-center rounded-2xl border border-white/10 bg-white/[0.04]">
                    <DynamicIcon name={prize.icon} className="h-7 w-7 text-white/85" strokeWidth={1.4} />
                  </div>
                  <span className="rounded-full border border-line bg-deep px-2 py-0.5 text-[9.5px] font-bold text-muted">
                    {prize.category}
                  </span>
                </div>

                <h3 className="relative mt-4 text-[15px] font-bold leading-snug text-white">
                  {prize.name}
                </h3>
                <p className="relative mt-1.5 flex-1 text-[12px] leading-relaxed text-muted">
                  {prize.note}
                </p>

                <div className="relative mt-4 flex items-center justify-between border-t border-line/70 pt-3.5">
                  <p className="inline-flex items-center gap-1 text-[10.5px] text-white/35">
                    <PackageCheck className="h-3 w-3" /> متبقٍ {prize.stock}
                  </p>
                  <button
                    type="button"
                    onClick={() => (giftsAvailable > 0 ? onClaim() : onStart())}
                    className={cn(
                      'h-10 rounded-xl px-4 text-[12.5px] font-bold transition-all',
                      giftsAvailable > 0
                        ? 'bg-brand text-[#141218] hover:brightness-110'
                        : 'border border-line bg-white/[0.03] text-white/70 hover:border-primary/40 hover:text-white',
                    )}
                  >
                    {giftsAvailable > 0 ? 'اطلب الهدية' : 'أكمل استبياناً'}
                  </button>
                </div>
              </article>
            </Reveal>
          ))}
        </div>

        <Reveal delay={60} className="mt-6">
          <div className="flex flex-col items-start gap-3 rounded-3xl border border-line bg-surface/40 p-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-3">
              <span className="mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-success/12 text-success">
                <Truck className="h-4 w-4" />
              </span>
              <p className="text-[13px] leading-relaxed text-muted">
                جميع الهدايا تُشحن <strong className="font-bold text-white">مجاناً</strong> داخل
                الأردن، ولا تُطلب منك أي رسوم عند الاستلام.
              </p>
            </div>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-line px-3 py-1.5 text-[11.5px] text-muted">
              <Lock className="h-3 w-3 text-success" /> بدون بيانات دفع
            </span>
          </div>
        </Reveal>

        <Reveal delay={80} className="mt-3">
          <p className="flex items-center justify-center gap-1.5 text-center text-[11px] text-white/25">
            <MapPin className="h-3 w-3" /> التوصيل متاح داخل الأردن فقط
          </p>
        </Reveal>
      </div>
    </section>
  );
}
