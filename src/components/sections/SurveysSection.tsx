import { useEffect, useMemo, useState } from 'react';
import { ArrowLeft, CheckCheck, Clock3, RefreshCw, Shuffle } from 'lucide-react';
import { ALL_SURVEYS, totalSurveys } from '../../data/surveys';
import { TOPICS, TOPIC_MAP } from '../../data/topics';
import type { TopicId } from '../../data/types';
import { useConfig } from '../../config/useConfig';
import { pickVisibleCountRange } from '../../config/site';
import { cn, shuffle } from '../../lib/utils';
import { DynamicIcon } from '../ui/DynamicIcon';
import { Reveal } from '../ui/Reveal';

interface SurveysProps {
  completedIds: string[];
  onStart: (id: string) => void;
}

type Filter = 'all' | TopicId;

export function SurveysSection({ completedIds, onStart }: SurveysProps) {
  const config = useConfig();
  const [filter, setFilter] = useState<Filter>('all');
  const [limit, setLimit] = useState(() =>
    pickVisibleCountRange({ min: config.visibleMin, max: config.visibleMax }, totalSurveys),
  );
  const [seed, setSeed] = useState(0);

  // ترتيب عشوائي لكل جلسة، وعدد ظاهر متغيّر بين الحد الأدنى والأعلى
  const [shuffled, setShuffled] = useState(() => shuffle(ALL_SURVEYS));

  useEffect(() => {
    setShuffled(shuffle(ALL_SURVEYS));
  }, [seed]);

  const pool = useMemo(() => {
    const base = filter === 'all' ? shuffled : shuffled.filter((s) => s.topic === filter);
    return base;
  }, [filter, shuffled]);

  const visibleCount = Math.min(limit, pool.length);
  const visible = pool.slice(0, visibleCount);

  useEffect(() => {
    setLimit(pickVisibleCountRange({ min: config.visibleMin, max: config.visibleMax }, totalSurveys));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter, seed, config.visibleMin, config.visibleMax]);

  return (
    <section id="surveys" className="scroll-mt-20 py-16 sm:py-20">
      <div className="container-page">
        <Reveal className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <span className="chip border-primary/30 text-primary">
              <ClipboardCheckIcon /> الاستبيانات المتاحة
            </span>
            <h2 className="mt-4 max-w-2xl font-display text-[28px] font-extrabold leading-snug text-white sm:text-[36px]">
              كل استبيان مرتبط بمنتج واحد —
              <span className="text-brand"> اختر ما يهمك</span>
            </h2>
            <p className="mt-3 max-w-xl text-[14.5px] leading-[1.9] text-muted">
              لدينا {totalSurveys} استبياناً في السوق الأردني، ويظهر لك الآن {visibleCount} منها بشكل
              عشوائي. اضغط لتحديث القائمة أو اختر القطاع.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setSeed((s) => s + 1)}
              className="btn-ghost h-11 px-4 text-[13px]"
            >
              <Shuffle className="h-4 w-4" />
              استبيانات أخرى
            </button>
            <div className="rounded-2xl border border-line bg-surface/50 px-4 py-2.5 text-center">
              <p className="font-display text-[18px] font-extrabold leading-none text-white">
                {completedIds.length}
              </p>
              <p className="mt-1 text-[10.5px] text-muted">أكملت</p>
            </div>
          </div>
        </Reveal>

        <Reveal delay={60} className="mt-7 flex gap-2 overflow-x-auto pb-1 no-scrollbar">
          <FilterChip
            active={filter === 'all'}
            onClick={() => setFilter('all')}
            label="الكل"
            count={totalSurveys}
          />
          {TOPICS.map((t) => (
            <FilterChip
              key={t.id}
              active={filter === t.id}
              onClick={() => setFilter(t.id)}
              label={t.name}
              count={ALL_SURVEYS.filter((s) => s.topic === t.id).length}
            />
          ))}
        </Reveal>

        <div className="mt-6 grid gap-3.5 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((survey, i) => {
            const topic = TOPIC_MAP[survey.topic];
            const done = completedIds.includes(survey.id);
            return (
              <Reveal key={`${survey.id}-${seed}-${filter}`} delay={Math.min(i, 6) * 40}>
                <article
                  className={cn(
                    'group relative flex h-full flex-col overflow-hidden rounded-3xl border p-5 transition-all duration-300',
                    done
                      ? 'border-success/30 bg-success/[0.06]'
                      : 'border-line bg-surface/55 hover:-translate-y-1 hover:border-white/20 hover:bg-surface/85 hover:shadow-card',
                  )}
                >
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute -left-16 -top-16 h-40 w-40 rounded-full opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-100"
                    style={{ background: `${topic.accent}33` }}
                  />

                  <div className="relative flex items-start justify-between gap-2">
                    <span
                      className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl border"
                      style={{
                        borderColor: `${topic.accent}33`,
                        background: `${topic.accent}14`,
                        color: topic.accent,
                      }}
                    >
                      <DynamicIcon name={topic.icon} className="h-5 w-5" />
                    </span>

                    <div className="flex flex-col items-end gap-1.5">
                      <span
                        className="rounded-full px-2 py-0.5 text-[10px] font-bold"
                        style={{ background: `${topic.accent}1f`, color: topic.accent }}
                      >
                        {topic.name}
                      </span>
                      {done ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-success/15 px-2 py-0.5 text-[10px] font-bold text-success">
                          <CheckCheck className="h-2.5 w-2.5" /> مكتمل
                        </span>
                      ) : null}
                    </div>
                  </div>

                  <h3 className="relative mt-4 text-[16px] font-bold leading-snug text-white">
                    {survey.product}
                  </h3>
                  <p className="relative mt-1 text-[12px] text-white/45">{survey.brand}</p>
                  <p className="relative mt-2 flex-1 text-[12.5px] leading-relaxed text-muted">
                    {survey.note}
                  </p>

                  <div className="relative mt-3 flex items-center gap-3 text-[11.5px] text-muted">
                    <span className="inline-flex items-center gap-1">
                      <ClipboardCheckIcon className="h-3 w-3" /> {survey.questions.length} أسئلة
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <Clock3 className="h-3 w-3" /> {survey.minutes} دقائق
                    </span>
                  </div>

                  <div className="relative mt-4 border-t border-line/70 pt-3.5">
                    <button
                      type="button"
                      onClick={() => onStart(survey.id)}
                      className={cn(
                        'h-11 w-full rounded-xl text-[13px] font-bold transition-all',
                        done
                          ? 'border border-line bg-white/[0.03] text-white/70 hover:border-primary/40 hover:text-white'
                          : 'bg-brand text-[#141218] hover:brightness-110',
                      )}
                    >
                      {done ? 'إعادة الإجابة' : 'ابدأ الاستبيان'}
                    </button>
                  </div>
                </article>
              </Reveal>
            );
          })}
        </div>

        {visibleCount < pool.length ? (
          <div className="mt-6 flex flex-col items-center gap-2">
            <button
              type="button"
              onClick={() => setLimit((l) => Math.min(pool.length, l + 20))}
              className="btn-ghost h-12 px-5 text-[13.5px]"
            >
              <ArrowLeft className="h-4 w-4" />
              اعرض المزيد ({pool.length - visibleCount} متبقٍ)
            </button>
          </div>
        ) : (
          <p className="mt-6 flex items-center justify-center gap-2 text-center text-[12px] text-white/30">
            <RefreshCw className="h-3 w-3" /> اضغط «استبيانات أخرى» لترى مجموعة مختلفة
          </p>
        )}
      </div>
    </section>
  );
}

function ClipboardCheckIcon({ className = 'h-3.5 w-3.5' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path
        d="M9 5h6a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2Z"
        stroke="currentColor"
        strokeWidth="1.7"
      />
      <path d="M9.5 12l2 2 3.5-3.5" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" />
      <path d="M10 5V4a2 2 0 0 1 4 0v1" stroke="currentColor" strokeWidth="1.7" />
    </svg>
  );
}

function FilterChip({
  active,
  onClick,
  label,
  count,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  count: number;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        'inline-flex shrink-0 items-center gap-2 rounded-full border px-4 py-2.5 text-[13px] font-medium transition-all',
        active
          ? 'border-primary/60 bg-primary/15 text-white'
          : 'border-line bg-surface/40 text-muted hover:border-white/20 hover:text-white',
      )}
    >
      {label}
      <span className={cn('text-[11px]', active ? 'text-primary' : 'text-white/30')}>{count}</span>
    </button>
  );
}
