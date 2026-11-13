import { forwardRef, useId, type ButtonHTMLAttributes, type ReactNode } from 'react';
import { cn } from '../utils/cn';

export interface SwitchProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'onChange'> {
  checked: boolean;
  onChange?: (checked: boolean) => void;
  label?: ReactNode;
  /** Пояснение под подписью: «Ранее паспорт РФ не выдавался, например при получении гражданства РФ» */
  helper?: ReactNode;
}

/**
 * Переключатель — Figma: Мягко / Switch. Дорожка 40×24, бегунок 18.
 * Выключен — серая дорожка, наведение — голубая; включён — синяя. Disabled включённый — полупрозрачный.
 */
export const Switch = forwardRef<HTMLButtonElement, SwitchProps>(function Switch(
  { checked, onChange, label, helper, disabled, id, className, ...rest },
  ref,
) {
  const autoId = useId();
  const swId = id ?? autoId;
  return (
    <div className={cn('flex flex-col', className)}>
      <button
        ref={ref}
        id={swId}
        type="button"
        role="switch"
        aria-checked={checked}
        aria-describedby={helper ? `${swId}-help` : undefined}
        disabled={disabled}
        onClick={() => onChange?.(!checked)}
        className={cn(
          'group/sw inline-flex min-h-7 items-center gap-2.5 self-start rounded-6 text-left',
          disabled ? 'cursor-not-allowed' : 'cursor-pointer',
          disabled && checked && 'opacity-50',
        )}
        {...rest}
      >
        <span
          aria-hidden
          className={cn(
            'relative h-6 w-10 shrink-0 rounded-999 transition-colors duration-150',
            checked
              ? cn('bg-action-primary', !disabled && 'group-hover/sw:bg-action-hover')
              : disabled
                ? 'bg-chart-track-soft'
                : 'bg-border-default group-hover/sw:bg-border-blue',
          )}
        >
          <span
            className={cn(
              'absolute top-0.75 left-0.75 size-4.5 rounded-full bg-surface-white shadow-[0_1px_2px_rgb(0_0_0/0.2)] transition-transform duration-150',
              checked && 'translate-x-4',
            )}
          />
        </span>
        {label && <span className={cn('text-body-m', disabled && !checked ? 'text-text-disabled' : 'text-text-primary')}>{label}</span>}
      </button>
      {helper && <p id={`${swId}-help`} className="mt-0.5 ml-12.5 text-caption text-text-secondary">{helper}</p>}
    </div>
  );
});
