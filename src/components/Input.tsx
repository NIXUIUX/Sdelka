import { forwardRef, useId, useImperativeHandle, useRef, useState, type InputHTMLAttributes, type ReactNode } from 'react';
import { cn } from '../utils/cn';
import { masks, maskInputMode, maskLength, maskPlaceholder, type MaskName } from '../utils/masks';
import { describedBy, fieldBox, FieldFoot, FieldLabel, fieldState, type FieldSize } from './Field';

export interface InputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size' | 'onChange' | 'value' | 'defaultValue' | 'prefix'> {
  /** Подпись поля. Пустое поле без фокуса показывает её крупно — «плавающая» подпись. Обязательные поля: «Название *» */
  label: ReactNode;
  value?: string;
  defaultValue?: string;
  /** Возвращает уже отформатированное маской значение */
  onChange?: (value: string) => void;
  /** Маска: формат, длина, клавиатура и подсказка формата в фокусе задаются автоматически */
  mask?: MaskName;
  /** Текст или символ справа: «₽», «лет», «%» */
  suffix?: ReactNode;
  /** Подсказка под полем */
  helper?: ReactNode;
  /** Текст ошибки — красная рамка и сообщение с иконкой. `true` — только рамка */
  error?: ReactNode;
  size?: FieldSize;
  /** `false` — подпись всегда сверху, даже в пустом поле (так у MoneyField) */
  floatingLabel?: boolean;
  /** Элемент справа внутри поля (кнопки степпера и т. п.) */
  endSlot?: ReactNode;
}

/**
 * Текстовое поле — Figma: Мягко / Input.
 * Состояния: Default, Hover, Focus, Filled, Error, Disabled. Плейсхолдер формата виден только в фокусе.
 */
export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { label, value, defaultValue, onChange, mask, suffix, helper, error, size = 'm', disabled, id, placeholder, inputMode, maxLength,
    className, endSlot, floatingLabel = true, onFocus, onBlur, ...rest },
  ref,
) {
  const inner_ref = useRef<HTMLInputElement>(null);
  useImperativeHandle(ref, () => inner_ref.current as HTMLInputElement);
  const autoId = useId();
  const inputId = id ?? autoId;
  const [inner, setInner] = useState(defaultValue ?? '');
  const [focused, setFocused] = useState(false);
  const current = value ?? inner;
  const floating = floatingLabel && !focused && !current;
  const fmt = mask ? masks[mask] : undefined;

  return (
    <div className={className}>
      <div
        className={cn(fieldBox({ size, state: fieldState(error, disabled) }), !disabled && 'cursor-text', endSlot && 'pr-28')}
        onMouseDown={(e) => {
          // клик по рамке или подписи ставит курсор в поле (кнопки внутри — не трогаем)
          const t = e.target as HTMLElement;
          if (disabled || t === inner_ref.current || t.closest('button')) return;
          e.preventDefault();
          inner_ref.current?.focus();
        }}
      >
        <FieldLabel htmlFor={inputId} floating={floating} disabled={disabled} rightInset={!!suffix} className={endSlot && floating ? 'right-28' : undefined}>{label}</FieldLabel>
        <div className="flex items-center gap-2">
          <input
            ref={inner_ref}
            id={inputId}
            value={current}
            disabled={disabled}
            aria-invalid={error ? true : undefined}
            aria-describedby={describedBy(inputId, error, helper)}
            placeholder={placeholder ?? (mask ? maskPlaceholder[mask] : undefined)}
            inputMode={inputMode ?? (mask ? maskInputMode[mask] : undefined)}
            maxLength={maxLength ?? (mask ? maskLength[mask] : undefined)}
            onFocus={(e) => { setFocused(true); onFocus?.(e); }}
            onBlur={(e) => { setFocused(false); onBlur?.(e); }}
            onChange={(e) => {
              const next = fmt ? fmt(e.target.value) : e.target.value;
              if (value === undefined) setInner(next);
              onChange?.(next);
            }}
            className={cn(
              'w-full min-w-0 bg-transparent pt-1 text-body-l leading-[22px] text-text-primary outline-none placeholder:text-text-muted disabled:cursor-not-allowed disabled:text-text-secondary',
              floating && 'placeholder:text-transparent',
            )}
            {...rest}
          />
          {suffix && (
            <span className={cn('shrink-0 text-body-l', 'text-text-secondary', floating && 'opacity-0')}>
              {suffix}
            </span>
          )}
        </div>
        {endSlot && <div className="absolute top-1/2 right-3 -translate-y-1/2">{endSlot}</div>}
      </div>
      <FieldFoot baseId={inputId} error={error} helper={helper} disabled={disabled} />
    </div>
  );
});
