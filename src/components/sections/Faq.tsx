import { useState } from 'react';
import { ChevronDown, Database, HelpCircle } from 'lucide-react';
import { useConfig } from '../../config/useConfig';
import { cn } from '../../lib/utils';
import { Reveal } from '../ui/Reveal';

export function Faq() {
  const config = useConfig();
  const [open, setOpen] = useState<number | null>(0);
  const faqs = [{ q: config.promiseQ, a: config.promiseA }, ...config.faq];

  return (
    <section id="faq" className="scroll-mt-20 py-16 sm:py-20">
      <div className="container-page grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:gap-14">
        <Reveal>
          <span className="chip border-warning/30 text-warning">
            <HelpCircle className="h-3.5 w-3.5" /> أسئلة شائعة
          </span>
          <h2 className="mt-4 font-display text-[28px] font-extrabold leading-snug text-white sm:text-[34px]">
            نوضّح قبل أن تبدأ
          </h2>
          <p className="mt-3 max-w-sm text-[14px] leading-[1.9] text-muted">
            أهم الأسئلة عن الرسوم والخصوصية والتوصيل، مع إجابة مباشرة على سؤال «هل البيانات حقيقية؟».
          </p>

          <div className="mt-6 rounded-2xl border border-primary/25 bg-primary/[0.07] p-4">
            <div className="flex items-center gap-2">
              <Database className="h-4 w-4 text-primary" />
              <p className="text-[12px] font-bold text-white">وعد البيانات</p>
            </div>
            <p className="mt-2 text-[13px] leading-[1.95] text-white/75">{config.promiseA}</p>
          </div>

          <div className="mt-3 rounded-2xl border border-line bg-surface/40 p-4">
            <p className="text-[12px] font-bold text-white/50">للتواصل</p>
            <p className="mt-1.5 text-[13px] leading-relaxed text-muted">
              راسلنا على {config.supportEmail} وسنرد خلال يوم عمل. لا ترسل أي بيانات بنكية في
              الرسالة.
            </p>
          </div>
        </Reveal>

        <Reveal delay={70}>
          <div className="divide-y divide-line/70 overflow-hidden rounded-3xl border border-line bg-surface/35">
            {faqs.map((item, index) => {
              const isOpen = open === index;
              return (
                <div key={item.q}>
                  <button
                    type="button"
                    onClick={() => setOpen(isOpen ? null : index)}
                    aria-expanded={isOpen}
                    className="flex w-full items-start justify-between gap-4 px-5 py-4 text-right transition hover:bg-white/[0.03]"
                  >
                    <span
                      className={cn(
                        'text-[14px] font-bold leading-snug transition-colors',
                        isOpen ? 'text-white' : 'text-white/80',
                      )}
                    >
                      {item.q}
                    </span>
                    <ChevronDown
                      className={cn(
                        'mt-1 h-4 w-4 shrink-0 text-white/40 transition-transform duration-300',
                        isOpen && 'rotate-180 text-primary',
                      )}
                    />
                  </button>
                  <div
                    className={cn(
                      'grid overflow-hidden transition-all duration-300',
                      isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0',
                    )}
                  >
                    <p className="min-h-0 px-5 pb-4 text-[13px] leading-[1.95] text-muted">{item.a}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
