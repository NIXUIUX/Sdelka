import { forwardRef, type ReactNode } from 'react';
import { cn } from '../utils/cn';
import { Icon } from '../icons/Icon';
import { digits } from '../utils/masks';
import { Input, type InputProps } from './Input';

const clamp = (n: number, min: number, max: number) => Math.max(min, Math.min(max, n));

/** Круглая кнопка ± — общая для StepperField и MiniStepper */
function StepButton({ kind, size, disabled, onClick, label }: {
  kind: 'minus' | 'plus'; size: 'm' | 's'; disabled?: boolean; onClick: () => void; label: string;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      disabled={disabled}
      onClick={onClick}
      className={cn(
        'grid shrink-0 place-items-center bg-surface-card text-action-primary transition-colors duration-150',
        'hover:enabled:bg-surface-hover-soft disabled:cursor-not-allowed disabled:bg-surface-page disabled:text-text-muted',
        size === 'm' ? 'size-10 rounded-full' : 'size-8 rounded-[8px]',
      )}
    >
      <Icon name={kind} size={size === 'm' ? 18 : 16} />
    </button>
  );
}

export interface StepperFieldProps extends Omit<InputProps, 'value' | 'defaultValue' | 'onChange' | 'mask' | 'endSlot'> {
  /** `null` — поле пустое (минус недоступен) */
  value: number | null;
  onChange: (value: number | null) => void;
  min?: number;
  max?: number;
  step?: number;
}

/**
 * Поле с кнопками ± — Figma: Мягко / Stepper field. Стаж, количество детей, иждивенцев.
 * Можно ввести число руками; значение ограничено min…max.
 */
export const StepperField = forwardRef<HTMLInputElement, StepperFieldProps>(function StepperField(
  { value, onChange, min = 0, max = 60, step = 1, disabled, ...rest },
  ref,
) {
  return (
    <Input
      ref={ref}
      inputMode="numeric"
      placeholder="0"
      maxLength={String(max).length}
      value={value === null ? '' : String(value)}
      disabled={disabled}
      onChange={(v) => {
        const d = digits(v);
        onChange(d === '' ? null : Math.min(max, Number(d)));
      }}
      onBlur={() => { if (value !== null && value < min) onChange(min); }}
      endSlot={
        <div className="flex gap-2">
          <StepButton kind="minus" size="m" label="Уменьшить" disabled={disabled || value === null || value <= min}
            onClick={() => onChange(clamp((value ?? 0) - step, min, max))} />
          <StepButton kind="plus" size="m" label="Увеличить" disabled={disabled || (value !== null && value >= max)}
            onClick={() => onChange(value === null ? clamp(Math.max(min, step), min, max) : clamp(value + step, min, max))} />
        </div>
      }
      {...rest}
    />
  );
});

export interface MiniStepperProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  /** Что меняем — для скринридера: «срок, лет» */
  label: string;
  /** Как показать число: v => `${v} лет` */
  format?: (v: number) => ReactNode;
  disabled?: boolean;
  className?: string;
}

/**
 * Компактный степпер — Figma: Мягко / Mini stepper. Кнопки 32, радиус 8, рамка вокруг.
 * Используется в строке параметров: срок кредита в карточке банка.
 */
export function MiniStepper({ value, onChange, min = 1, max = 99, step = 1, label, format, disabled, className }: MiniStepperProps) {
  return (
    <div
      role="group"
      aria-label={label}
      className={cn('inline-flex items-center gap-1.5 rounded-12 border border-border-default bg-surface-white p-1', className)}
    >
      <StepButton kind="minus" size="s" label={`Уменьшить: ${label}`} disabled={disabled || value <= min} onClick={() => onChange(clamp(value - step, min, max))} />
      <output aria-live="polite" className={cn('min-w-7 text-center text-button-m tabular-nums', disabled ? 'text-text-disabled' : 'text-text-primary')}>
        {format ? format(value) : value}
      </output>
      <StepButton kind="plus" size="s" label={`Увеличить: ${label}`} disabled={disabled || value >= max} onClick={() => onChange(clamp(value + step, min, max))} />
    </div>
  );
}
