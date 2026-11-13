import type { HTMLAttributes } from 'react';
import { cn } from '../utils/cn';

export interface AvatarProps extends HTMLAttributes<HTMLSpanElement> {
  /** Имя или название банка — из него берутся инициалы (до 2 букв) */
  name?: string;
  /** Готовый текст вместо инициалов, например «+5» */
  text?: string;
  /** Initials — банк или участник; neutral — счётчик «+N»; disabled — банк не подошёл */
  variant?: 'initials' | 'neutral' | 'disabled';
  size?: number;
}

/** «Абсолют Банк» → «АБ», «Иванов Иван» → «ИИ», одно слово «МКБ» → «МК» (как в прототипе) */
export const initials = (name = '') => {
  const words = name.replace(/[«»"']/g, '').split(/[\s.-]+/).filter(Boolean);
  if (!words.length) return '?';
  return (words.length === 1 ? words[0].slice(0, 2) : words[0][0] + words[1][0]).toUpperCase();
};

/** Аватар с инициалами (Figma: Core / Avatar / Initials, Neutral, Disabled) */
export function Avatar({ name, text, variant = 'initials', size = 36, className, style, ...rest }: AvatarProps) {
  return (
    <span
      title={name}
      className={cn(
        'inline-grid shrink-0 place-items-center rounded-999 text-caption-medium font-semibold select-none',
        variant === 'initials' && 'bg-surface-card text-action-primary',
        variant === 'neutral' && 'bg-chart-track-soft text-text-secondary',
        variant === 'disabled' && 'bg-surface-page text-text-disabled',
        className,
      )}
      style={{ width: size, height: size, ...style }}
      {...rest}
    >
      {text ?? initials(name)}
    </span>
  );
}

export interface AvatarGroupProps { names: string[]; max?: number; size?: number; className?: string }

/** Стопка аватаров (Figma: Core / Avatar / Group): до `max`, остальные — «+N» */
export function AvatarGroup({ names, max = 3, size = 36, className }: AvatarGroupProps) {
  const shown = names.slice(0, max);
  const rest = names.length - shown.length;
  return (
    <span className={cn('inline-flex', className)}>
      {shown.map((n, i) => <Avatar key={n + i} name={n} size={size} className={cn('ring-2 ring-surface-white', i && '-ml-2')} />)}
      {rest > 0 && <Avatar variant="neutral" text={`+${rest}`} size={size} className="-ml-2 ring-2 ring-surface-white" />}
    </span>
  );
}
