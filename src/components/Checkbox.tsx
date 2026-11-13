import { forwardRef, useEffect, useId, useImperativeHandle, useRef, type InputHTMLAttributes, type ReactNode } from 'react';
import { cn } from '../utils/cn';
import { Icon } from '../icons/Icon';

export interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'type' | 'size'> {
  /** Подпись справа. Без подписи передайте `aria-label` */
  label?: ReactNode;
  /** Пояснение под подписью */
  helper?: ReactNode;
  onChange?: (checked: boolean) => void;
  /** Частично выбрано — минус вместо галочки («выбраны не все банки») */
  indeterminate?: boolean;
  /** Красная рамка — не отмечено обязательное согласие */
  error?: boolean;
  /**
   * Закреплено: серая галочка, изменить нельзя. Так в подборе отмечены банки, куда заявка уже отправлена.
   * Отличается от disabled тем, что значение видно и оно «отправлено».
   */
  locked?: boolean;
}

/**
 * Чекбокс — Figma: Мягко / Checkbox. Квадрат 20, радиус 6, рамка 1.5.
 * Состояния: Default, Hover, Selected, Mixed, Error, Disabled, Locked.
 */
export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(function Checkbox(
  { label, helper, onChange, indeterminate, error, locked, disabled, checked, defaultChecked, id, className, ...rest },
  ref,
) {
  const inputRef = useRef<HTMLInputElement>(null);
  useImperativeHandle(ref, () => inputRef.current as HTMLInputElement);
  useEffect(() => { if (inputRef.current) inputRef.current.indeterminate = !!indeterminate; }, [indeterminate]);
  const autoId = useId();
  const cbId = id ?? autoId;
  const inert = disabled || locked;
  const on = locked ? true : checked;

  return (
    <div className={cn('flex flex-col', className)}>
      <label htmlFor={cbId} className={cn('group/cb inline-flex min-h-7 items-start gap-3 self-start', inert ? 'cursor-not-allowed' : 'cursor-pointer')}>
        <input
          ref={inputRef}
          id={cbId}
          type="checkbox"
          className="peer sr-only"
          checked={on}
          defaultChecked={defaultChecked}
          disabled={disabled}
          aria-disabled={locked || undefined}
          aria-invalid={error || undefined}
          aria-describedby={helper ? `${cbId}-help` : undefined}
          onChange={(e) => { if (locked) return; onChange?.(e.target.checked); }}
          {...rest}
        />
        <span
          aria-hidden
          className={cn(
            !indeterminate && '[&>svg]:hidden peer-checked:[&>svg]:block',
            'mt-1 grid size-5 shrink-0 place-items-center rounded-6 border-[1.5px] text-surface-white transition-[background-color,border-color] duration-150',
            'peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-action-primary',
            // базовое: белый, серая рамка; при наведении — синяя
            'border-border-default bg-surface-white group-hover/cb:border-action-primary',
            'peer-checked:border-action-primary peer-checked:bg-action-primary peer-checked:group-hover/cb:border-action-hover peer-checked:group-hover/cb:bg-action-hover',
            indeterminate && 'border-action-primary bg-action-primary group-hover/cb:border-action-hover group-hover/cb:bg-action-hover',
            error && 'border-error group-hover/cb:border-error',
            disabled && 'border-border-default bg-chart-track-soft group-hover/cb:border-border-default peer-checked:border-chart-track peer-checked:bg-chart-track peer-checked:group-hover/cb:border-chart-track peer-checked:group-hover/cb:bg-chart-track',
            locked && 'border-text-muted bg-text-muted group-hover/cb:border-text-muted peer-checked:border-text-muted peer-checked:bg-text-muted peer-checked:group-hover/cb:border-text-muted peer-checked:group-hover/cb:bg-text-muted',
          )}
        >
          {indeterminate ? (
            <Icon name="minus" size={14} strokeWidth={3} />
          ) : (
            <Icon name="check" size={14} strokeWidth={3} />
          )}
        </span>
        {label && (
          <span className={cn('py-0.75 text-body-m', disabled ? 'text-text-disabled' : locked ? 'text-text-secondary' : 'text-text-primary')}>
            {label}
          </span>
        )}
      </label>
      {helper && <p id={`${cbId}-help`} className="mt-0.5 ml-8 text-caption text-text-secondary">{helper}</p>}
    </div>
  );
});
