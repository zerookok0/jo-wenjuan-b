import { useState } from 'react';
import { Check, Copy, Download, RotateCcw, Save, Settings2, X } from 'lucide-react';
import { ALL_SURVEYS } from '../../data/surveys';
import { PRIZES } from '../../data/prizes';
import { defaultConfig, loadConfig, saveConfig, resetConfig, type EditableConfig } from '../../config/store';

/**
 * لوحة تحكم بسيطة: تُعدّل نصوص الموقع وعدد الاستبيانات الظاهرة،
 * ويمكن تصدير كل المحتوى كملف JSON للتعديل خارجياً.
 */
export function AdminPanel({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [draft, setDraft] = useState<EditableConfig>(() => loadConfig());
  const [saved, setSaved] = useState(false);
  const [copied, setCopied] = useState(false);

  if (!open) return null;

  const update = <K extends keyof EditableConfig>(key: K, value: EditableConfig[K]) => {
    setDraft((prev) => ({ ...prev, [key]: value }));
    setSaved(false);
  };

  const handleSave = () => {
    saveConfig(draft);
    setSaved(true);
    window.setTimeout(() => setSaved(false), 2000);
  };

  const handleReset = () => {
    resetConfig();
    setDraft(defaultConfig);
    setSaved(true);
    window.setTimeout(() => setSaved(false), 2000);
  };

  const exportJson = () => {
    const payload = {
      config: draft,
      surveys: ALL_SURVEYS.map((s) => ({
        id: s.id,
        product: s.product,
        brand: s.brand,
        topic: s.topic,
        note: s.note,
        minutes: s.minutes,
        questions: s.questions,
      })),
      prizes: PRIZES,
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'rayak-content.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const copyJson = async () => {
    try {
      await navigator.clipboard.writeText(JSON.stringify(draft, null, 2));
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] overflow-y-auto bg-bg">
      <div className="sticky top-0 z-10 border-b border-line bg-bg/95 backdrop-blur-xl">
        <div className="container-page flex h-16 items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-primary/15 text-primary">
              <Settings2 className="h-4 w-4" />
            </span>
            <div>
              <p className="text-[13.5px] font-extrabold text-white">لوحة التحكم</p>
              <p className="text-[10.5px] text-muted">تعديل المحتوى بدون لمس الكود</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex items-center gap-1.5 rounded-full border border-line px-3 py-2 text-[12.5px] text-muted transition hover:text-white"
          >
            <X className="h-3.5 w-3.5" /> إغلاق
          </button>
        </div>
      </div>

      <div className="container-page mx-auto max-w-2xl py-7 pb-28">
        <section className="rounded-3xl border border-line bg-surface/50 p-5">
          <h2 className="text-[15px] font-extrabold text-white">نصوص الصفحة الرئيسية</h2>
          <div className="mt-4 space-y-3.5">
            <TextField label="اسم الموقع" value={draft.brandName} onChange={(v) => update('brandName', v)} />
            <TextField label="السطر التعريفي" value={draft.tagline} onChange={(v) => update('tagline', v)} />
            <TextField label="العنوان الرئيسي" value={draft.heroTitle} onChange={(v) => update('heroTitle', v)} />
            <TextField
              label="العنوان المميز (بلون)"
              value={draft.heroHighlight}
              onChange={(v) => update('heroHighlight', v)}
            />
            <TextArea
              label="الوصف تحت العنوان"
              value={draft.heroSubtitle}
              onChange={(v) => update('heroSubtitle', v)}
            />
          </div>
        </section>

        <section className="mt-4 rounded-3xl border border-line bg-surface/50 p-5">
          <h2 className="text-[15px] font-extrabold text-white">عدد الاستبيانات الظاهرة</h2>
          <p className="mt-1 text-[11.5px] text-muted">
            يظهر للزائر عدد عشوائي بين الحد الأدنى والأعلى في كل زيارة.
          </p>
          <div className="mt-4 grid grid-cols-2 gap-3">
            <NumberField
              label="الأدنى"
              value={draft.visibleMin}
              onChange={(v) => update('visibleMin', v)}
            />
            <NumberField
              label="الأعلى"
              value={draft.visibleMax}
              onChange={(v) => update('visibleMax', v)}
            />
          </div>
        </section>

        <section className="mt-4 rounded-3xl border border-line bg-surface/50 p-5">
          <h2 className="text-[15px] font-extrabold text-white">التوصيل والتطبيق</h2>
          <div className="mt-4 space-y-3.5">
            <TextField label="اسم التطبيق" value={draft.appName} onChange={(v) => update('appName', v)} />
            <TextField label="حجم التطبيق" value={draft.appSize} onChange={(v) => update('appSize', v)} />
            <TextField label="مدة التوصيل" value={draft.deliveryDays} onChange={(v) => update('deliveryDays', v)} />
            <TextField label="بريد التواصل" value={draft.supportEmail} onChange={(v) => update('supportEmail', v)} />
          </div>
        </section>

        <section className="mt-4 rounded-3xl border border-line bg-surface/50 p-5">
          <h2 className="text-[15px] font-extrabold text-white">إجابة «هل البيانات حقيقية؟»</h2>
          <div className="mt-4 space-y-3.5">
            <TextField label="السؤال" value={draft.promiseQ} onChange={(v) => update('promiseQ', v)} />
            <TextArea label="الإجابة" value={draft.promiseA} onChange={(v) => update('promiseA', v)} rows={4} />
          </div>
        </section>

        <section className="mt-4 rounded-3xl border border-line bg-surface/50 p-5">
          <h2 className="text-[15px] font-extrabold text-white">المحتوى الكامل</h2>
          <p className="mt-1 text-[11.5px] leading-relaxed text-muted">
            يحتوي الموقع على {ALL_SURVEYS.length} استبياناً و {PRIZES.length} هدية. يمكنك تصدير كل
            المحتوى كملف JSON للتعديل ثم إعادة استخدامه.
          </p>
          <div className="mt-4 grid gap-2 sm:grid-cols-2">
            <button type="button" onClick={exportJson} className="btn-ghost h-11 text-[12.5px]">
              <Download className="h-3.5 w-3.5" /> تصدير JSON
            </button>
            <button type="button" onClick={copyJson} className="btn-ghost h-11 text-[12.5px]">
              {copied ? <Check className="h-3.5 w-3.5 text-success" /> : <Copy className="h-3.5 w-3.5" />}
              {copied ? 'تم النسخ' : 'نسخ الإعدادات'}
            </button>
          </div>
        </section>

        <div className="mt-5 flex items-center gap-2">
          <button type="button" onClick={handleSave} className="btn-primary h-12 flex-1 text-[13.5px]">
            {saved ? <Check className="h-4 w-4" strokeWidth={3} /> : <Save className="h-4 w-4" />}
            {saved ? 'تم الحفظ' : 'حفظ التغييرات'}
          </button>
          <button type="button" onClick={handleReset} className="btn-ghost h-12 px-4 text-[13px]">
            <RotateCcw className="h-4 w-4" /> استعادة
          </button>
        </div>
        <p className="mt-2.5 text-center text-[10.5px] text-white/30">
          التغييرات تُحفظ على هذا الجهاز، ويتم تحديث الصفحة تلقائياً عند الإغلاق.
        </p>
      </div>
    </div>
  );
}

function TextField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-[12px] font-bold text-white/80">{label}</label>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-11 w-full rounded-xl border border-line bg-surface/70 px-3.5 text-[13px] text-white focus:border-primary/50 focus:outline-none"
      />
    </div>
  );
}

function TextArea({
  label,
  value,
  onChange,
  rows = 3,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  rows?: number;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-[12px] font-bold text-white/80">{label}</label>
      <textarea
        rows={rows}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full resize-none rounded-xl border border-line bg-surface/70 p-3.5 text-[13px] leading-[1.9] text-white focus:border-primary/50 focus:outline-none"
      />
    </div>
  );
}

function NumberField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-[12px] font-bold text-white/80">{label}</label>
      <input
        type="number"
        min={1}
        max={120}
        value={value}
        onChange={(e) => onChange(Number(e.target.value) || 1)}
        className="h-11 w-full rounded-xl border border-line bg-surface/70 px-3.5 text-[13px] text-white focus:border-primary/50 focus:outline-none"
      />
    </div>
  );
}
