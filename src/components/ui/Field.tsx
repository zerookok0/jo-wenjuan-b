import { useId } from 'react';
import { cn } from '../../lib/utils';

interface FieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  error?: string;
  required?: boolean;
  optionalHint?: string;
  inputMode?: 'text' | 'tel' | 'numeric';
  autoComplete?: string;
  maxLength?: number;
  hint?: string;
}

/** حقل إدخال موحّد الشكل مع رسالة خطأ ووصف لقارئ الشاشة */
export function Field({
  label,
  value,
  onChange,
  placeholder,
  error,
  required,
  optionalHint = '(اختياري)',
  inputMode,
  autoComplete,
  maxLength,
  hint,
}: FieldProps) {
  const id = useId();
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 flex items-center gap-1 text-[12.5px] font-bold text-white/80">
        {label}
        {required ? (
          <span className="text-danger">*</span>
        ) : (
          <span className="text-white/30">{optionalHint}</span>
        )}
      </label>
      <input
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        inputMode={inputMode}
        autoComplete={autoComplete}
        maxLength={maxLength}
        aria-invalid={Boolean(error)}
        aria-describedby={error || hint ? `${id}-msg` : undefined}
        className={cn(
          'h-12 w-full rounded-2xl border bg-surface/60 px-4 text-[13.5px] text-white placeholder:text-white/30 transition focus:outline-none',
          error ? 'border-danger/60 focus:border-danger' : 'border-line focus:border-primary/50',
        )}
      />
      {error ? (
        <p id={`${id}-msg`} className="mt-1 text-[11px] text-danger">
          {error}
        </p>
      ) : hint ? (
        <p id={`${id}-msg`} className="mt-1 text-[11px] text-white/30">
          {hint}
        </p>
      ) : null}
    </div>
  );
}
