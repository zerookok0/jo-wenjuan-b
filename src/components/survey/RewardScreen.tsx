import { useEffect, useState } from 'react';
import { CheckCircle2, Gift, PartyPopper, Sparkles, Truck } from 'lucide-react';
import type { PrizeProduct, Survey } from '../../data/types';
import { DynamicIcon } from '../ui/DynamicIcon';

interface RewardProps {
  survey: Survey;
  prizes: PrizeProduct[];
  onClaim: (prize: PrizeProduct) => void;
  onBackHome: () => void;
}

const CONFETTI = Array.from({ length: 24 }).map((_, i) => ({
  id: i,
  left: (i * 37) % 100,
  delay: (i % 9) * 0.16,
  duration: 2.4 + (i % 5) * 0.4,
  color: ['#9E7FFF', '#38bdf8', '#f472b6', '#10b981', '#E4C88A'][i % 5],
  size: 4 + (i % 4) * 2,
}));

export function RewardScreen({ survey, prizes, onClaim, onBackHome }: RewardProps) {
  const [showConfetti, setShowConfetti] = useState(true);

  useEffect(() => {
    const id = window.setTimeout(() => setShowConfetti(false), 3600);
    return () => window.clearTimeout(id);
  }, []);

  const suggestions = prizes.slice(0, 3);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-bg">
      {showConfetti ? (
        <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-10 overflow-hidden">
          {CONFETTI.map((p) => (
            <span
              key={p.id}
              className="absolute top-[-10%] block rounded-sm"
              style={{
                left: `${p.left}%`,
                width: p.size,
                height: p.size * 1.6,
                background: p.color,
                animation: `confettiFall ${p.duration}s ${p.delay}s cubic-bezier(0.35,0.6,0.4,1) forwards`,
              }}
            />
          ))}
        </div>
      ) : null}

      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-0 h-[420px] w-[520px] -translate-x-1/2 rounded-full bg-primary/25 blur-[130px]"
      />

      <div className="container-page relative mx-auto max-w-xl py-10 pb-16">
        <div className="animate-popin text-center">
          <span className="mx-auto grid h-20 w-20 place-items-center rounded-[26px] bg-brand shadow-glow">
            <PartyPopper className="h-9 w-9 text-[#141218]" strokeWidth={1.9} />
          </span>
          <span className="mt-6 inline-flex items-center gap-1.5 rounded-full border border-success/30 bg-success/10 px-3 py-1.5 text-[11.5px] font-bold text-success">
            <CheckCircle2 className="h-3.5 w-3.5" /> تم إكمال الاستبيان · {survey.questions.length} سؤالاً
          </span>
          <h1 className="mt-4 font-display text-[28px] font-extrabold leading-snug text-white sm:text-[34px]">
            شكراً لك،
            <br />
            <span className="text-brand">هديتك جاهزة الآن</span>
          </h1>
          <p className="mt-3 text-[14px] leading-[1.95] text-muted">
            اختر هدية واحدة، ثم أدخل عنوان الشحن. التوصيل داخل الأردن بدون أي رسوم.
          </p>
        </div>

        <div className="mt-7 grid grid-cols-3 gap-2.5">
          {[
            { icon: Gift, label: 'هدية متاحة', value: '1' },
            { icon: Truck, label: 'مدة التوصيل', value: '1–3 أيام' },
            { icon: Sparkles, label: 'التكلفة', value: '0 دينار' },
          ].map((item) => (
            <div key={item.label} className="rounded-2xl border border-line bg-surface/50 p-3 text-center">
              <item.icon className="mx-auto h-4 w-4 text-primary" />
              <p className="mt-1.5 font-display text-[14px] font-extrabold leading-none text-white">
                {item.value}
              </p>
              <p className="mt-1 text-[10px] text-muted">{item.label}</p>
            </div>
          ))}
        </div>

        <div className="mt-6 rounded-3xl border border-line bg-surface/50 p-5">
          <div className="flex items-center justify-between">
            <p className="text-[13px] font-bold text-white">اختر هديتك</p>
            <Sparkles className="h-3.5 w-3.5 text-primary" />
          </div>

          <div className="mt-3 space-y-2.5">
            {suggestions.map((prize) => (
              <button
                key={prize.id}
                type="button"
                onClick={() => onClaim(prize)}
                className="group flex w-full items-center gap-3 rounded-2xl border border-line bg-deep/70 p-3 text-right transition hover:border-primary/50 hover:bg-deep"
              >
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl border border-white/10 bg-white/[0.04] text-white/80">
                  <DynamicIcon name={prize.icon} className="h-5 w-5" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[13px] font-bold text-white">{prize.name}</p>
                  <p className="text-[11px] text-muted">{prize.note}</p>
                </div>
                <span className="shrink-0 rounded-lg bg-primary/15 px-2.5 py-1 text-[10.5px] font-bold text-primary">
                  اختر
                </span>
              </button>
            ))}
          </div>

          <p className="mt-3 text-center text-[11px] text-white/35">
            يمكنك اختيار أي هدية أخرى من قائمة الهدايا الكاملة
          </p>
        </div>

        <div className="mt-6 flex flex-col gap-2.5">
          <button type="button" onClick={onBackHome} className="btn-ghost h-12 text-[13.5px]">
            العودة وإكمال استبيان آخر
          </button>
        </div>

        <style>{`
          @keyframes confettiFall {
            0% { transform: translate3d(0,-10vh,0) rotate(0deg); opacity: 1; }
            100% { transform: translate3d(0,105vh,0) rotate(540deg); opacity: 0; }
          }
        `}</style>
      </div>
    </div>
  );
}
