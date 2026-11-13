import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../utils/cn';
import { Icon, type IconName } from '../icons/Icon';
import { Spinner } from './Spinner';

/** Figma: Мягко / Button — Style × State × Size × Content */
export const buttonVariants = cva(
  'inline-flex shrink-0 items-center justify-center gap-2 whitespace-nowrap transition-[background-color,border-color,color,box-shadow] duration-150 disabled:cursor-not-allowed',
  {
    variants: {
      variant: {
        primary: 'bg-action-primary text-surface-white hover:bg-action-hover active:bg-action-hover disabled:bg-primary-disabled disabled:text-text-disabled',
        secondary: 'bg-surface-card text-action-primary hover:bg-chart-track-soft active:bg-chart-track disabled:bg-surface-page disabled:text-text-disabled',
        outline: 'border border-border-default bg-surface-white text-action-primary hover:bg-surface-card active:bg-chart-track-soft disabled:bg-surface-white disabled:text-text-disabled',
        ghost: 'bg-transparent text-action-primary hover:bg-surface-card active:bg-chart-track-soft disabled:text-text-disabled',
        link: 'h-auto bg-transparent p-0 text-action-primary hover:text-action-hover hover:underline disabled:text-text-disabled disabled:no-underline',
        /** Тихая ссылка-действие из прототипа («Сброс фильтров»): серая, при наведении синяя с подложкой */
        subtle: 'h-8 rounded-14 bg-transparent px-2 text-[13px] leading-[18px] font-semibold text-text-muted hover:bg-surface-card hover:text-action-primary disabled:opacity-50',
        danger: 'bg-error text-surface-white hover:brightness-90 active:brightness-85 disabled:bg-error-bg disabled:text-text-disabled',
      },
      size: {
        s: 'h-9 rounded-10 px-3.5 text-button-s',
        /** 40 — кнопка в шапке флоу («Прескоринг»), как .btn.sm в прототипе */
        sm: 'h-10 rounded-14 px-4 text-button-m',
        m: 'h-11 rounded-14 px-5 text-button-m',
        l: 'h-13 rounded-14 px-6 text-button-m',
      },
      iconOnly: { true: 'px-0' },
      fullWidth: { true: 'w-full' },
      pressed: { true: '' },
    },
    compoundVariants: [
      { iconOnly: true, size: 's', class: 'w-9' },
      { iconOnly: true, size: 'sm', class: 'w-10' },
      { iconOnly: true, size: 'm', class: 'w-11' },
      { iconOnly: true, size: 'l', class: 'w-13' },
      { variant: 'link', class: 'h-auto rounded-none px-0 text-[13px] leading-[18px] font-semibold' },
      { variant: 'subtle', class: 'h-8 px-2 text-[13px] leading-[18px]' },
      { variant: 'outline', pressed: true, class: 'border-border-blue bg-surface-card' },
    ],
    defaultVariants: { variant: 'primary', size: 'm' },
  },
);

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
  /** Иконка слева от текста (Figma: свойство «Иконка») */
  icon?: IconName;
  /** Иконка справа — например chevron-right у ссылок «Изменить параметры» */
  iconRight?: IconName;
  /** Показывает спиннер, блокирует кнопку и оставляет текст: «Готовим PDF» */
  loading?: boolean;
  /** Нажатая кнопка-переключатель (outline): голубой фон, рамка accent — «Фильтры» в прототипе */
  pressed?: boolean;
  /** Счётчик справа в синем кружке: «Фильтры 3» */
  count?: number;
  children?: ReactNode;
}

/**
 * Кнопка. Правило: на экране одна `primary` — в футере. Остальные действия — `outline` или `link`.
 * Размеры: s 36 (радиус 10), m 44, l 52. Для кнопки-иконки передайте `icon` без children и `aria-label`.
 */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant, size, fullWidth, icon, iconRight, loading, pressed, count, disabled, className, children, type = 'button', ...rest },
  ref,
) {
  const iconOnly = !children && !!icon;
  const iconSize = size === 's' || variant === 'link' || variant === 'subtle' ? 16 : 18;
  return (
    <button
      ref={ref}
      type={type}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      aria-pressed={pressed}
      className={cn(buttonVariants({ variant, size, iconOnly, fullWidth, pressed }), className)}
      {...rest}
    >
      {loading ? <Spinner size={14} label="" /> : icon && <Icon name={icon} size={iconSize} />}
      {children}
      {count ? <span className="inline-grid h-5 min-w-5 place-items-center rounded-999 bg-action-primary px-1.5 text-[12px] leading-none text-surface-white">{count}</span> : null}
      {iconRight && !loading && <Icon name={iconRight} size={16} />}
    </button>
  );
});
