import { useId, type ReactNode } from 'react';
import { cn } from '../utils/cn';
import { FieldError } from './Field';

export type RadioOption<V extends string = string> = { value: V; label: ReactNode; helper?: ReactNode; disabled?: boolean };

export interface RadioGroupProps<V extends string = string> {
  /** Заголовок группы: «Семейное положение *» */
  label?: ReactNode;
  options: readonly RadioOption<V>[];
  value: V | null;
  onChange: (value: V) => void;
  /** Текст ошибки под группой и красные рамки */
  error?: ReactNode;
  disabled?: boolean;
  /** В строку — для 2–3 коротких вариантов («Да / Нет») */
  inline?: boolean;
  name?: string;
  className?: string;
}

/**
 * Радиокнопки — выбор одного из нескольких видимых вариантов.
 * Визуально продолжают Checkbox (20 px, рамка 1.5, те же состояния), но круглые.
 * В Figma отдельного компонента нет — решено оставить только в коде (13.11.2026).
 */
export function RadioGroup<V extends string = string>({
  label, options, value, onChange, error, disabled, inline, name, className,
}: RadioGroupProps<V>) {
  const autoId = useId();
  const groupName = name ?? autoId;
  return (
    <fieldset className={cn('m-0 min-w-0 border-0 p-0', className)} aria-invalid={error ? true : undefined}>
      {label && <legend className="mb-2 p-0 text-body-m-medium text-text-primary">{label}</legend>}
      <div className={cn('flex', inline ? 'flex-wrap gap-x-6 gap-y-2' : 'flex-col gap-2')}>
        {options.map((o) => {
          const off = disabled || o.disabled;
          const on = value === o.value;
          const oid = `${groupName}-${o.value}`;
          return (
            <div key={o.value} className="flex flex-col">
              <label htmlFor={oid} className={cn('group/rd inline-flex min-h-[22px] items-start gap-2.5 self-start', off ? 'cursor-not-allowed' : 'cursor-pointer')}>
                <input
                  id={oid}
                  type="radio"
                  name={groupName}
                  value={o.value}
                  checked={on}
                  disabled={off}
                  onChange={() => onChange(o.value)}
                  className="peer sr-only"
                  aria-describedby={o.helper ? `${oid}-help` : undefined}
                />
                <span
                  aria-hidden
                  className={cn(
                    'mt-px grid size-5 shrink-0 place-items-center rounded-full border-[1.5px] bg-surface-white transition-[border-color] duration-150',
                    'peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-action-primary',
                    off
                      ? cn('border-border-default bg-chart-track-soft', on && 'border-chart-track')
                      : error && !value
                        ? 'border-error'
                        : on
                          ? 'border-action-primary group-hover/rd:border-action-hover'
                          : 'border-border-default group-hover/rd:border-action-primary',
                  )}
                >
                  {on && <span className={cn('size-2.5 rounded-full', off ? 'bg-chart-track' : 'bg-action-primary group-hover/rd:bg-action-hover')} />}
                </span>
                <span className={cn('text-body-m', off ? 'text-text-disabled' : 'text-text-primary')}>{o.label}</span>
              </label>
              {o.helper && <p id={`${oid}-help`} className="mt-0.5 ml-[30px] text-caption text-text-secondary">{o.helper}</p>}
            </div>
          );
        })}
      </div>
      {error && error !== true && <FieldError>{error}</FieldError>}
    </fieldset>
  );
}
