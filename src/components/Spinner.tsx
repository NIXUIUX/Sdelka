import { cn } from '../utils/cn';

export interface SpinnerProps {
  /** Диаметр в px: 14 — в кнопке, 36 — на экране загрузки */
  size?: number;
  className?: string;
  /** Текст для скринридера */
  label?: string;
}

/** Индикатор загрузки (Figma: Мягко / Spinner) */
export function Spinner({ size = 36, className, label = 'Загрузка' }: SpinnerProps) {
  const w = size <= 16 ? 2 : 3;
  return (
    <span
      role="status"
      aria-label={label}
      className={cn('inline-block shrink-0 animate-spin rounded-full border-surface-card border-t-action-primary', className)}
      style={{ width: size, height: size, borderWidth: w }}
    />
  );
}
