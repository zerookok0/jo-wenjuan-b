import { useEffect, useState } from 'react';
import {
  ArrowRight,
  Check,
  Download,
  Gift,
  Info,
  Lock,
  ShieldCheck,
  Smartphone,
  Sparkles,
} from 'lucide-react';
import { siteConfig } from '../../config/site';
import { useConfig } from '../../config/useConfig';
import type { PrizeProduct } from '../../data/types';
import { setPendingPrizeId } from '../../lib/claim';
import { cn } from '../../lib/utils';
import { DynamicIcon } from '../ui/DynamicIcon';

type Step = 'pick' | 'download';

interface ClaimFlowProps {
  prizes: PrizeProduct[];
  initialPrize?: PrizeProduct | null;
  onClose: () => void;
}

const STEP_LABEL: Record<Step, string> = {
  pick: 'اختر الهدية',
  download: 'حمّل التطبيق',
};

export function ClaimFlow({ prizes, initialPrize, onClose }: ClaimFlowProps) {
  const config = useConfig();
  const [step, setStep] = useState<Step>(initialPrize ? 'download' : 'pick');
  const [prize, setPrize] = useState<PrizeProduct | null>(initialPrize ?? null);
  const [downloaded, setDownloaded] = useState(false);

  const stepIndex = step === 'pick' ? 0 : 1;

  // الهدية القادمة من شاشة المكافأة تُحفظ حتى تظهر في صفحة /dizhi
  useEffect(() => {
    if (initialPrize) setPendingPrizeId(initialPrize.id);
  }, [initialPrize]);

  const selectPrize = (next: PrizeProduct) => {
    setPrize(next);
    setPendingPrizeId(next.id);
    setStep('download');
  };

  /* صفحة التحميل هي نهاية المسار على الموقع.
     لا يوجد زر «متابعة» ولا انتقال تلقائي إلى صفحة العنوان:
     إدخال العنوان يتم داخل التطبيق بعد تحميله.
     الرابط قابل للتغيير من لوحة التحكم (appDownloadUrl). */
  const downloadUrl = (config.appDownloadUrl || siteConfig.appDownloadUrl).trim();

  const handleDownload = () => {
    setDownloaded(true);
    if (!downloadUrl) return;
    window.open(downloadUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-bg">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-0 top-0 h-80 w-80 rounded-full bg-primary/20 blur-[120px]"
      />

      <div className="relative border-b border-line/80 bg-bg/90 backdrop-blur-xl">
        <div className="container-page flex h-16 items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => {
              if (step === 'pick') onClose();
              else setStep('pick');
            }}
            className="inline-flex items-center gap-1.5 rounded-full px-2 py-2 text-[13px] text-muted transition hover:text-white"
          >
            <ArrowRight className="h-4 w-4" />
            رجوع
          </button>
          <p className="text-[13px] font-bold text-white">استلام الهدية · بدون أي رسوم</p>
          <span className="inline-flex items-center gap-1 rounded-full border border-success/30 bg-success/10 px-2.5 py-1 text-[10.5px] font-bold text-success">
            <Lock className="h-2.5 w-2.5" /> لا بطاقة
          </span>
        </div>

        <div className="container-page pb-4">
          <ol className="flex items-center gap-1.5">
            {(['pick', 'download'] as Step[]).map((s, i) => (
              <li key={s} className="flex flex-1 items-center gap-1.5">
                <div className="flex items-center gap-2">
                  <span
                    className={cn(
                      'grid h-6 w-6 shrink-0 place-items-center rounded-full text-[11px] font-bold transition',
                      i < stepIndex
                        ? 'bg-success/20 text-success'
                        : i === stepIndex
                          ? 'bg-brand text-[#141218]'
                          : 'bg-white/[0.06] text-white/35',
                    )}
                  >
                    {i < stepIndex ? <Check className="h-3 w-3" strokeWidth={3} /> : i + 1}
                  </span>
                  <span
                    className={cn(
                      'whitespace-nowrap text-[11.5px] font-medium transition-colors',
                      i === stepIndex ? 'text-white' : 'text-white/40',
                    )}
                  >
                    {STEP_LABEL[s]}
                  </span>
                </div>
                {i < 1 ? (
                  <span
                    className={cn(
                      'h-px flex-1 rounded-full transition-colors',
                      i < stepIndex ? 'bg-success/40' : 'bg-white/10',
                    )}
                  />
                ) : null}
              </li>
            ))}
          </ol>
        </div>
      </div>

      <div className="container-page mx-auto max-w-2xl py-7 pb-12">
        {step === 'pick' ? (
          <div className="animate-popin">
            <h1 className="font-display text-[24px] font-extrabold text-white sm:text-[28px]">
              اختر هديتك
            </h1>
            <p className="mt-2 text-[13.5px] leading-relaxed text-muted">
              هدية واحدة مقابل كل استبيان مكتمل. الشحن مجاني داخل الأردن ولا يوجد أي مبلغ.
            </p>

            <div className="mt-5 space-y-2.5">
              {prizes.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => selectPrize(item)}
                  className="flex w-full items-center gap-3.5 rounded-2xl border border-line bg-surface/50 p-3.5 text-right transition-all hover:border-primary/50 hover:bg-surface/80"
                >
                  <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl border border-white/10 bg-white/[0.04] text-white/80">
                    <DynamicIcon name={item.icon} className="h-5 w-5" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5">
                      <p className="truncate text-[13.5px] font-bold text-white">{item.name}</p>
                      {item.hot ? <Sparkles className="h-3 w-3 shrink-0 text-accent" /> : null}
                    </div>
                    <p className="mt-0.5 truncate text-[11.5px] text-muted">{item.note}</p>
                  </div>
                  <div className="shrink-0 text-left">
                    <p className="rounded-lg bg-success/15 px-2 py-1 text-[10.5px] font-bold text-success">
                      متاح
                    </p>
                    <p className="mt-1 text-[10px] text-white/30">متبقٍ {item.stock}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        ) : null}

        {step === 'download' && prize ? (
          <div className="animate-popin">
            <div className="rounded-3xl border border-line bg-surface/55 p-4">
              <div className="flex items-center gap-3">
                <span className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl border border-primary/25 bg-primary/10 text-primary">
                  <DynamicIcon name={prize.icon} className="h-6 w-6" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-[10.5px] text-white/35">الهدية المختارة</p>
                  <p className="truncate text-[14.5px] font-extrabold text-white">{prize.name}</p>
                  <p className="text-[11.5px] text-muted">{prize.note}</p>
                </div>
                <Gift className="h-4 w-4 shrink-0 text-success" />
              </div>
            </div>

            <h1 className="mt-6 font-display text-[24px] font-extrabold leading-[1.35] text-white sm:text-[28px]">
              هديتك محفوظة — حمّل التطبيق لتستلمها
            </h1>
            <p className="mt-2 text-[13.5px] leading-[1.95] text-muted">
              وصلت إلى آخر خطوة على الموقع. لإكمال الطلب وإدخال عنوان الشحن، حمّل التطبيق وافتحه:
              <span className="font-bold text-white/85">
                {' '}
                إدخال العنوان واستلام الهدية يتم داخل التطبيق فقط.
              </span>{' '}
              حجمه {config.appSize || siteConfig.appSize} وبدون أي عملية دفع.
            </p>

            <div className="mt-5 rounded-3xl border border-line bg-deep/70 p-5">
              <p className="text-[11px] font-bold text-white/40">كيف تستلم هديتك؟</p>
              <ol className="mt-3 space-y-3">
                {[
                  'اضغط زر «تحميل التطبيق» أدناه وثبّته على هاتفك.',
                  `افتح التطبيق بنفس رقم هاتفك لتظهر لك هدية «${prize.name}».`,
                  `أدخل عنوان الشحن داخل التطبيق، ويصلك الطلب خلال ${config.deliveryDays || siteConfig.deliveryDays}.`,
                ].map((line, i) => (
                  <li key={line} className="flex items-start gap-3">
                    <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-primary/15 text-[11px] font-extrabold text-primary">
                      {i + 1}
                    </span>
                    <p className="text-[12.5px] leading-[1.85] text-white/75">{line}</p>
                  </li>
                ))}
              </ol>
            </div>

            <div className="mt-4 rounded-3xl border border-line bg-surface/45 p-5">
              <div className="flex items-center gap-4">
                <span className="grid h-16 w-16 place-items-center rounded-2xl bg-brand text-[#141218]">
                  <Smartphone className="h-7 w-7" strokeWidth={1.8} />
                </span>
                <div className="flex-1">
                  <p className="text-[15px] font-extrabold text-white">
                    {config.appName || siteConfig.appName}
                  </p>
                  <p className="text-[11.5px] text-muted">
                    الإصدار 2.4 · {config.appSize || siteConfig.appSize}
                  </p>
                  <div className="mt-1.5 flex items-center gap-2 text-[10.5px] text-success">
                    <ShieldCheck className="h-3 w-3" /> بدون مشتريات · بدون صلاحيات دفع
                  </div>
                </div>
              </div>

              <div className="my-4 hairline" />

              <div className="grid gap-2 text-[12px] text-white/70">
                {[
                  'صلاحيات التطبيق: التخزين والإنترنت فقط',
                  'لا يقرأ جهات الاتصال أو الرسائل أو الصور',
                  'لا يحتوي على أي بوابة دفع أو ربط بطاقة',
                ].map((line) => (
                  <p key={line} className="flex items-start gap-2">
                    <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-success" strokeWidth={3} />
                    {line}
                  </p>
                ))}
              </div>

              <button
                type="button"
                onClick={handleDownload}
                className="btn-primary mt-5 h-12 w-full text-[14.5px]"
              >
                {downloaded ? (
                  <>
                    <Check className="h-4 w-4" strokeWidth={3} /> تم بدء التحميل
                  </>
                ) : (
                  <>
                    <Download className="h-4 w-4" /> تحميل التطبيق
                  </>
                )}
              </button>
              <p className="mt-2.5 text-center text-[11px] leading-relaxed text-white/35">
                {downloaded
                  ? 'أكمل الخطوات داخل التطبيق لإدخال العنوان واستلام الهدية.'
                  : 'بعد التحميل افتح التطبيق وأدخل عنوانك هناك لإتمام الاستلام.'}
              </p>
              {downloadUrl ? (
                <a
                  href={downloadUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setDownloaded(true)}
                  className="mt-2 block text-center text-[11px] font-bold text-primary/80 underline-offset-4 transition hover:text-primary hover:underline"
                >
                  لم يبدأ التحميل؟ اضغط هنا
                </a>
              ) : null}
            </div>

            <div className="mt-4 flex items-start gap-2.5 rounded-2xl border border-secondary/20 bg-secondary/[0.06] p-3.5">
              <Info className="mt-0.5 h-4 w-4 shrink-0 text-secondary" />
              <p className="text-[11.5px] leading-relaxed text-white/60">
                لا يوجد على الموقع صفحة لإدخال العنوان ولا زر «متابعة». كل ما تحتاجه هو تحميل
                التطبيق، ثم إدخال العنوان والاستلام من داخله. لا نطلب أي بيانات بنكية في أي خطوة.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setStep('pick')}
              className="mt-4 inline-flex items-center gap-1.5 rounded-full px-1 py-2 text-[12px] text-white/45 transition hover:text-white"
            >
              <ArrowRight className="h-3.5 w-3.5" /> تغيير الهدية
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );
}
