import { forwardRef, useId, type ReactNode, type TextareaHTMLAttributes } from 'react';
import { cn } from '../utils/cn';
import { describedBy, fieldBox, FieldFoot, FieldLabel, fieldState } from './Field';

export interface TextareaProps extends Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'onChange'> {
  label: ReactNode;
  onChange?: (value: string) => void;
  helper?: ReactNode;
  error?: ReactNode;
  /** Счётчик символов под полем при заданном maxLength */
  counter?: boolean;
}

/**
 * Многострочное поле — письмо в банк, комментарий. Подпись всегда сверху, высота от 4 строк, тянется вниз.
 */
export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea(
  { label, onChange, helper, error, disabled, id, rows = 4, className, counter, maxLength, value, ...rest },
  ref,
) {
  const autoId = useId();
  const taId = id ?? autoId;
  const len = typeof value === 'string' ? value.length : 0;
  return (
    <div className={className}>
      <div className={cn(fieldBox({ size: 'm', state: fieldState(error, disabled) }), 'justify-start')}>
        <FieldLabel htmlFor={taId} disabled={disabled}>{label}</FieldLabel>
        <textarea
          ref={ref}
          id={taId}
          rows={rows}
          value={value}
          maxLength={maxLength}
          disabled={disabled}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy(taId, error, helper)}
          onChange={(e) => onChange?.(e.target.value)}
          className="min-h-22 w-full resize-y bg-transparent pt-1 text-[15px] leading-[22px] text-text-primary outline-none placeholder:text-text-muted disabled:cursor-not-allowed disabled:text-text-disabled"
          {...rest}
        />
      </div>
      <div className="flex items-start justify-between gap-3">
        <FieldFoot baseId={taId} error={error} helper={helper} disabled={disabled} />
        {counter && maxLength ? <span className="mt-1.5 ml-auto shrink-0 text-caption text-text-muted">{len} / {maxLength}</span> : null}
      </div>
    </div>
  );
});
