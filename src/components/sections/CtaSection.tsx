import { useEffect, useState } from 'react';
import { ArrowLeft, Clock, Gift, Lock, RefreshCw, Users } from 'lucide-react';
import { totalSurveys } from '../../data/surveys';
import { Reveal } from '../ui/Reveal';

interface CtaProps {
  giftsAvailable: number;
  onStart: () => void;
  onOpenWallet: () => void;
}

export function CtaSection({ giftsAvailable, onStart, onOpenWallet }: CtaProps) {
  const [today, setToday] = useState(() => new Date());
  const [remaining, setRemaining] = useState(0);

  useEffect(() => {
    // عدد الاستبيانات المتاحة اليوم يتغيّر بين 30 و 90
    const seed = new Date().getDate() + new Date().getMonth() * 31;
    setRemaining(30 + (seed * 7) % 61);
    const timer = window.setInterval(() => setToday(new Date()), 60_000);
    return () => window.clearInterval(timer);
  }, []);

  const dateLabel = today.toLocaleDateString('ar-JO', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <section className="relative overflow-hidden py-16 sm:py-20">
      <div className="container-page">
        <Reveal>
          <div className="grain relative overflow-hidden rounded-[34px] border border-white/10 bg-[#191521] px-6 py-12 text-center sm:px-12 sm:py-16">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -right-20 -top-24 h-72 w-72 rounded-full bg-primary/30 blur-[100px] animate-drift"
            />
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -left-16 bottom-[-80px] h-72 w-72 rounded-full bg-sand/20 blur-[100px] animate-drift [animation-delay:-9s]"
            />

            <div className="relative">
              <div className="flex flex-wrap items-center justify-center gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/[0.06] px-3 py-1.5 text-[11.5px] font-medium text-white/70">
                  <Clock className="h-3.5 w-3.5" /> {dateLabel}
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full border border-success/25 bg-success/10 px-3 py-1.5 text-[11.5px] font-medium text-success">
                  <RefreshCw className="h-3.5 w-3.5" /> {remaining} استبياناً متاحاً اليوم
                </span>
              </div>

              <h2 className="mx-auto mt-5 max-w-2xl font-display text-[30px] font-extrabold leading-tight text-white sm:text-[44px]">
                رأيك يستحق هدية —
                <br className="sm:hidden" />
                <span className="text-brand"> ابدأ من استبيان واحد</span>
              </h2>

              <p className="mx-auto mt-4 max-w-lg text-[14.5px] leading-[1.95] text-white/60">
                {totalSurveys} استبياناً مرتبطاً بمنتجات السوق الأردني. بدون رسوم، بدون بطاقة بنكية،
                والهدية تصلك إلى باب البيت.
              </p>

              <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <button
                  type="button"
                  onClick={onStart}
                  className="btn-primary h-14 w-full px-7 text-[15px] sm:w-auto"
                >
                  <Gift className="h-[18px] w-[18px]" />
                  ابدأ استبيانك الآن
                  <ArrowLeft className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={onOpenWallet}
                  className="btn-ghost h-14 w-full px-6 text-[14px] sm:w-auto"
                >
                  <Users className="h-[18px] w-[18px]" />
                  {giftsAvailable > 0 ? `لديك ${giftsAvailable} هدية` : 'هداياي وطلباتي'}
                </button>
              </div>

              <div className="mt-8 flex flex-wrap items-center justify-center gap-x-5 gap-y-2.5 text-[11.5px] text-white/40">
                <span className="inline-flex items-center gap-1.5">
                  <Lock className="h-3 w-3 text-success" /> 0 دينار
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Lock className="h-3 w-3 text-secondary" /> بدون بطاقة
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Lock className="h-3 w-3 text-primary" /> بدون عنوان فوترة
                </span>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
