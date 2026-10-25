import { useCallback, useEffect, useMemo, useState } from 'react';
import { ArrowRight, Check, CornerDownLeft, X } from 'lucide-react';
import type { Answers, Survey } from '../../data/types';
import { cn, pct } from '../../lib/utils';

interface QuizRunnerProps {
  survey: Survey;
  onExit: () => void;
  onComplete: (answers: Answers) => void;
}

const LETTERS = ['أ', 'ب', 'ج', 'د', 'هـ', 'و', 'ز', 'ح'];

export function QuizRunner({ survey, onExit, onComplete }: QuizRunnerProps) {
  const questions = useMemo(() => survey.questions, [survey]);
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});
  const [shake, setShake] = useState(false);

  const question = questions[index];
  const key = `q${index}`;
  const current = answers[key];
  const isLast = index === questions.length - 1;

  const answeredCount = questions.filter((q, i) => {
    const v = answers[`q${i}`];
    if (q.type === 'text') return typeof v === 'string' && v.trim().length > 0;
    return Array.isArray(v) ? v.length > 0 : v !== undefined && v !== '';
  }).length;

  const isValid =
    question.type === 'text'
      ? true
      : question.type === 'multi'
        ? Array.isArray(current) && current.length > 0
        : current !== undefined && current !== '';

  const goNext = useCallback(() => {
    if (!isValid) {
      setShake(true);
      window.setTimeout(() => setShake(false), 420);
      return;
    }
    if (isLast) onComplete(answers);
    else setIndex((i) => Math.min(i + 1, questions.length - 1));
  }, [isValid, isLast, onComplete, answers, questions.length]);

  const goBack = useCallback(() => {
    if (index === 0) onExit();
    else setIndex((i) => Math.max(0, i - 1));
  }, [index, onExit]);

  const selectSingle = (option: string) => {
    setAnswers((prev) => ({ ...prev, [key]: option }));
    if (!isLast) {
      window.setTimeout(() => setIndex((i) => Math.min(i + 1, questions.length - 1)), 250);
    }
  };

  const toggleMulti = (option: string) => {
    const limit = question.max ?? 5;
    setAnswers((prev) => {
      const list = Array.isArray(prev[key]) ? (prev[key] as string[]) : [];
      if (list.includes(option)) return { ...prev, [key]: list.filter((o) => o !== option) };
      if (list.length >= limit) return prev;
      return { ...prev, [key]: [...list, option] };
    });
  };

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, [index]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      const tag = (event.target as HTMLElement)?.tagName;
      if (tag === 'TEXTAREA' || tag === 'INPUT') return;
      if (event.key === 'Enter') {
        event.preventDefault();
        goNext();
      }
      if (event.key === 'Escape') onExit();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [goNext, onExit]);

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-bg">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-primary/20 blur-[110px]"
      />

      <div className="relative z-10 border-b border-line/80 bg-bg/80 backdrop-blur-xl">
        <div className="container-page flex h-16 items-center justify-between gap-3">
          <button
            type="button"
            onClick={goBack}
            className="inline-flex items-center gap-1.5 rounded-full px-2 py-2 text-[13px] text-muted transition hover:text-white"
            aria-label={index === 0 ? 'خروج' : 'السؤال السابق'}
          >
            {index === 0 ? <X className="h-4 w-4" /> : <ArrowRight className="h-4 w-4" />}
            <span className="hidden sm:inline">{index === 0 ? 'خروج' : 'السابق'}</span>
          </button>

          <div className="min-w-0 flex-1 text-center">
            <p className="truncate text-[12.5px] font-bold text-white/85">{survey.product}</p>
            <p className="text-[10.5px] text-muted">
              السؤال {index + 1} من {questions.length} · أجبت عن {answeredCount}
            </p>
          </div>

          <div className="rounded-full border border-primary/30 bg-primary/10 px-2.5 py-1 text-[11px] font-bold text-primary">
            هدية
          </div>
        </div>
        <div className="h-[3px] w-full bg-white/[0.06]">
          <div
            className="h-full rounded-l-full bg-brand transition-all duration-500 ease-out"
            style={{ width: `${pct(index + 1, questions.length)}%` }}
          />
        </div>
      </div>

      <div className="relative z-10 flex-1 overflow-y-auto">
        <div className="container-page mx-auto max-w-2xl py-8 pb-32 sm:py-12">
          <div key={key} className="animate-popin">
            <div className="flex items-center gap-2">
              <span className="font-display text-[11px] font-extrabold text-primary">
                السؤال {String(index + 1).padStart(2, '0')}
              </span>
              {question.type === 'multi' ? (
                <span className="rounded-full bg-white/[0.06] px-2 py-0.5 text-[10px] text-white/50">
                  اختيار متعدد · حتى {question.max ?? 5}
                </span>
              ) : null}
              {question.type === 'text' ? (
                <span className="rounded-full bg-white/[0.06] px-2 py-0.5 text-[10px] text-white/50">
                  يمكنك التخطي
                </span>
              ) : null}
            </div>

            <h2 className="mt-3 font-display text-[22px] font-extrabold leading-[1.5] text-white sm:text-[27px]">
              {question.text}
            </h2>
            {question.hint ? <p className="mt-2 text-[12.5px] text-muted">{question.hint}</p> : null}

            <div className={cn('mt-7 space-y-2.5', shake && 'animate-[shake_0.4s]')}>
              {question.options?.map((option, i) => {
                const selected =
                  question.type === 'multi'
                    ? Array.isArray(current) && current.includes(option)
                    : current === option;
                return (
                  <button
                    key={option}
                    type="button"
                    role={question.type === 'multi' ? 'checkbox' : 'radio'}
                    aria-checked={selected}
                    data-selected={selected}
                    onClick={() => (question.type === 'multi' ? toggleMulti(option) : selectSingle(option))}
                    className="option-row group"
                  >
                    <span
                      className={cn(
                        'grid h-7 w-7 shrink-0 place-items-center rounded-lg border text-[11px] font-bold transition',
                        selected
                          ? 'border-primary bg-primary text-[#141218]'
                          : 'border-white/15 text-white/40 group-hover:border-white/30',
                      )}
                    >
                      {selected ? <Check className="h-3.5 w-3.5" strokeWidth={3} /> : (LETTERS[i] ?? i + 1)}
                    </span>
                    <span className="flex-1">{option}</span>
                  </button>
                );
              })}

              {question.type === 'scale' ? (
                <ScaleInput
                  labels={question.scaleLabels}
                  value={typeof current === 'number' ? current : undefined}
                  onChange={(v) => setAnswers((prev) => ({ ...prev, [key]: v }))}
                />
              ) : null}

              {question.type === 'text' ? (
                <div>
                  <textarea
                    value={typeof current === 'string' ? current : ''}
                    onChange={(e) => setAnswers((prev) => ({ ...prev, [key]: e.target.value }))}
                    rows={4}
                    maxLength={200}
                    placeholder="اكتب رأيك هنا (أو تخطَّ السؤال)"
                    className="w-full resize-none rounded-2xl border border-line bg-surface/60 p-4 text-[14px] leading-[1.9] text-white placeholder:text-white/30 focus:border-primary/50 focus:outline-none"
                  />
                  <p className="mt-1.5 text-left text-[11px] text-white/30">
                    {(typeof current === 'string' ? current : '').length}/200
                  </p>
                </div>
              ) : null}
            </div>

            <p className="mt-6 hidden items-center gap-1.5 text-[11px] text-white/25 sm:flex">
              <CornerDownLeft className="h-3 w-3" /> اضغط Enter للانتقال للسؤال التالي
            </p>
          </div>
        </div>
      </div>

      <div className="safe-bottom relative z-10 border-t border-line/80 bg-bg/90 px-5 pt-3 backdrop-blur-xl">
        <div className="container-page mx-auto flex max-w-2xl items-center gap-3 pb-1">
          <button type="button" onClick={goBack} className="btn-ghost h-12 w-12 shrink-0 px-0" aria-label="السابق">
            <ArrowRight className="h-4 w-4" />
          </button>
          <button type="button" onClick={goNext} disabled={!isValid} className="btn-primary h-12 flex-1 text-[14px]">
            {isLast ? 'إرسال واستلام الهدية' : 'التالي'}
          </button>
        </div>
      </div>
    </div>
  );
}

function ScaleInput({
  labels,
  value,
  onChange,
}: {
  labels?: [string, string];
  value?: number;
  onChange: (v: number) => void;
}) {
  const display = value ?? 7;
  return (
    <div className="rounded-3xl border border-line bg-surface/55 p-5">
      <div className="flex items-end justify-between">
        <span className="text-[11px] text-white/40">1</span>
        <div className="text-center">
          <p className="font-display text-[36px] font-extrabold leading-none text-white">{display}</p>
          <p className="mt-1 text-[10.5px] text-primary">تقييمك</p>
        </div>
        <span className="text-[11px] text-white/40">10</span>
      </div>

      <input
        type="range"
        min={1}
        max={10}
        step={1}
        value={display}
        onChange={(e) => onChange(Number(e.target.value))}
        aria-label="مقياس التقييم"
        className="mt-5 h-2 w-full cursor-pointer appearance-none rounded-full accent-primary"
        style={{
          background: `linear-gradient(270deg, #9E7FFF ${((display - 1) / 9) * 100}%, rgba(255,255,255,0.1) ${((display - 1) / 9) * 100}%)`,
        }}
      />

      <div className="mt-3 flex justify-between gap-4 text-[11px] text-muted">
        <span>{labels?.[0] ?? 'غير موافق'}</span>
        <span>{labels?.[1] ?? 'موافق تماماً'}</span>
      </div>

      <div className="mt-4 grid grid-cols-10 gap-1">
        {Array.from({ length: 10 }).map((_, i) => {
          const n = i + 1;
          return (
            <button
              key={n}
              type="button"
              onClick={() => onChange(n)}
              aria-label={`تقييم ${n}`}
              className={cn(
                'h-8 rounded-lg text-[11px] font-bold transition',
                n === display
                  ? 'bg-primary text-[#141218]'
                  : 'bg-white/[0.04] text-white/40 hover:bg-white/10 hover:text-white',
              )}
            >
              {n}
            </button>
          );
        })}
      </div>
    </div>
  );
}
