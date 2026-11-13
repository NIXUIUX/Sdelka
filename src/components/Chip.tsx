import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react';
import { cn } from '../utils/cn';
import { Icon } from '../icons/Icon';

export interface ChipProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'value'> {
  /** Название параметра серым: «Цель:» */
  label?: ReactNode;
  /** Значение полужирным: «Квартира в новостройке» */
  value: ReactNode;
  /** Параметр задан (не значение по умолчанию) — голубой фон и синий текст */
  active?: boolean;
  /** Открыт поповер — синяя рамка, шеврон вверх */
  open?: boolean;
}

/**
 * Чип фильтра — Figma: Мягко / Chip. Высота 32, радиус 12.
 * States: Default (белый), Hover (синяя рамка), Active (голубой фон), Open (голубой фон + синяя рамка).
 * Обычно используется вместе с Popover — см. FilterChip.
 */
export const Chip = forwardRef<HTMLButtonElement, ChipProps>(function Chip(
  { label, value, active = false, open = false, className, type = 'button', ...rest },
  ref,
) {
  return (
    <button
      ref={ref}
      type={type}
      aria-expanded={open}
      className={cn(
        'inline-flex h-8 max-w-full shrink-0 items-center gap-1.5 rounded-12 border px-3 whitespace-nowrap transition-[background-color,border-color,color] duration-150',
        'disabled:cursor-not-allowed disabled:opacity-50',
        open
          ? 'border-action-primary bg-surface-card'
          : active
            ? 'border-border-blue bg-surface-card hover:enabled:border-action-primary hover:enabled:bg-surface-white'
            : 'border-border-default bg-surface-white hover:enabled:border-action-primary',
        className,
      )}
      {...rest}
    >
      {label && <span className="text-body-s text-text-secondary">{label}</span>}
      <span className={cn('min-w-0 truncate text-button-s', active || open ? 'text-action-primary' : 'text-text-primary')}>{value}</span>
      <Icon
        name="chevron-down"
        size={14}
        className={cn('shrink-0 transition-transform duration-150', open && 'rotate-180', active || open ? 'text-action-primary' : 'text-text-secondary')}
      />
    </button>
  );
});
