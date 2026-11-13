import type { HTMLAttributes } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../utils/cn';
import { Icon } from '../icons/Icon';

/** Figma: Мягко / Badge — Tone × Size */
export const badgeVariants = cva('inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-999 font-medium', {
  variants: {
    tone: {
      neutral: 'bg-chart-track-soft text-text-secondary',
      accent: 'bg-surface-card text-action-primary',
      success: 'bg-success-bg text-success',
      warning: 'bg-warning-bg text-warning-text',
      error: 'bg-error-bg text-error',
      counter: 'bg-chart-track-soft text-text-secondary tabular-nums',
      sent: 'border border-border-default bg-surface-white text-text-secondary',
    },
    size: {
      s: 'h-6 px-2.5 text-caption-medium',
      xs: 'h-5 px-2 text-caption',
    },
  },
  defaultVariants: { tone: 'neutral', size: 's' },
});

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement>, VariantProps<typeof badgeVariants> {
  /** Точка слева. По умолчанию есть у статусных тонов и нет у counter и sent */
  dot?: boolean;
  /** Крестик удаления (Figma: Tone=Removable) */
  onRemove?: () => void;
}

/**
 * Бейдж статуса. Уровни рейтинга прескоринга: error — низкий, warning — средний, success — высокий, accent — очень высокий.
 * `sent` — белый с обводкой и иконкой отправки: «Отправлено · сегодня, 10:50».
 */
export function Badge({ tone = 'neutral', size, dot, onRemove, className, children, ...rest }: BadgeProps) {
  const showDot = dot ?? !(tone === 'counter' || tone === 'sent');
  return (
    <span className={cn(badgeVariants({ tone, size }), className)} {...rest}>
      {tone === 'sent' && <Icon name="send" size={12} />}
      {showDot && <span aria-hidden className="size-[5px] rounded-full bg-current" />}
      {children}
      {onRemove && (
        <button type="button" onClick={onRemove} aria-label="Убрать" className="-mr-1 grid size-4 place-items-center rounded-999 hover:bg-chart-track-soft">
          <Icon name="x" size={12} />
        </button>
      )}
    </span>
  );
}
