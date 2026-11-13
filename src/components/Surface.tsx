import type { HTMLAttributes, ReactNode } from 'react';
import { cn } from '../utils/cn';
import { Icon, type IconName } from '../icons/Icon';

/* Строительные блоки страниц — из прототипа флоу Б (.card, .layout, .grid g2/g3, .inset, .num-step, .progress, .secure). */

export interface CardProps extends Omit<HTMLAttributes<HTMLElement>, 'title'> {
  /** m — отступ 24 (.card), l — 32 (.card.pad32, на телефоне 20) */
  padding?: 'm' | 'l';
  /** Заголовок H2 18/26 */
  title?: ReactNode;
  /** Пояснение под заголовком, 14 серым */
  description?: ReactNode;
  /** Справа от заголовка: кнопка «Добавить созаёмщика», бейдж «7 заявок» */
  action?: ReactNode;
  /** Расстояние между блоками внутри: 16 (stack) или 24 (stack-24) */
  gap?: 16 | 24 | 40;
  as?: 'section' | 'div' | 'article';
}

/** Белая карточка раздела: рамка, радиус 20 */
export function Card({ padding = 'm', title, description, action, gap = 16, as: Tag = 'section', className, children, ...rest }: CardProps) {
  return (
    <Tag
      className={cn('flex min-w-0 flex-col rounded-20 border border-border-default bg-surface-white',
        padding === 'l' ? 'p-8 max-[640px]:p-5' : 'p-6', { 16: 'gap-4', 24: 'gap-6', 40: 'gap-10' }[gap], className)}
      {...rest}
    >
      {(title || action) && (
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0">
            {title && <h2 className="m-0 text-h2 text-text-primary">{title}</h2>}
            {description && <p className="m-0 mt-1 text-body-m text-text-secondary">{description}</p>}
          </div>
          {action}
        </div>
      )}
      {children}
    </Tag>
  );
}

/** Заголовок секции внутри карточки анкеты (h1.sec, 24/32) с пояснением */
export function SectionTitle({ children, description, className }: { children: ReactNode; description?: ReactNode; className?: string }) {
  return (
    <div className={className}>
      <h2 className="m-0 text-h1 text-text-primary">{children}</h2>
      {description && <p className="m-0 mt-1 text-body-m text-text-secondary">{description}</p>}
    </div>
  );
}

/**
 * Раскладка экрана флоу: основная колонка + боковая 384, промежуток 24.
 * До 980 px — одна колонка, боковая уходит наверх (как в прототипе).
 */
export function PageLayout({ aside, children, className }: { aside?: ReactNode; children: ReactNode; className?: string }) {
  return (
    <div className={cn('grid items-start gap-6', aside ? 'grid-cols-[minmax(0,1fr)_384px] max-[980px]:grid-cols-1' : 'grid-cols-1', className)}>
      <div className="flex min-w-0 flex-col gap-4">{children}</div>
      {aside && <aside className="flex min-w-0 flex-col gap-4 max-[980px]:-order-1">{aside}</aside>}
    </div>
  );
}

/** Сетка полей формы: 2 или 3 колонки, промежуток 16, на телефоне (до 640) — одна колонка */
export function FormGrid({ cols = 2, className, ...rest }: HTMLAttributes<HTMLDivElement> & { cols?: 1 | 2 | 3 }) {
  return <div className={cn('grid gap-4 max-[640px]:grid-cols-1', { 1: 'grid-cols-1', 2: 'grid-cols-2', 3: 'grid-cols-3' }[cols], className)} {...rest} />;
}

/**
 * Группа внутри формы.
 * tone="blue" (.inset) — голубая подложка, радиус 16, отступ 12 — для коротких связанных полей.
 * tone="outline" (.inset-white) — рамка, радиус 20, отступ 24 — «Основное место работы», участник подписания.
 */
export function Inset({ tone = 'blue', title, action, className, children, ...rest }: Omit<HTMLAttributes<HTMLDivElement>, 'title'> & {
  tone?: 'blue' | 'outline'; title?: ReactNode; action?: ReactNode;
}) {
  return (
    <div className={cn('flex min-w-0 flex-col',
      tone === 'blue' ? 'gap-3 rounded-16 bg-surface-card p-3' : 'gap-4 rounded-20 border border-border-default p-6 max-[640px]:p-4', className)} {...rest}>
      {(title || action) && (
        <div className="flex flex-wrap items-center justify-between gap-3">
          {title && <h3 className="m-0 text-h3 text-text-primary">{title}</h3>}
          {action}
        </div>
      )}
      {children}
    </div>
  );
}

/** Квадратная плитка с иконкой (.icon-tile): белая на голубом или голубая на белом */
export function IconTile({ icon, tone = 'white', size = 40, className }: { icon: IconName; tone?: 'white' | 'blue' | 'success'; size?: 40 | 72; className?: string }) {
  return (
    <span className={cn('grid shrink-0 place-items-center',
      size === 72 ? 'size-18 rounded-16' : 'size-10 rounded-12',
      tone === 'white' ? 'bg-surface-white text-action-primary' : tone === 'blue' ? 'bg-surface-card text-action-primary' : 'bg-surface-white text-success', className)}>
      <Icon name={icon} size={size === 72 ? 28 : 20} />
    </span>
  );
}

/** Нумерованный шаг инструкции (.num-step): «1 Скачайте и распечатайте документы» + действие справа */
export function NumberedStep({ n, title, description, action }: { n: number; title: ReactNode; description?: ReactNode; action?: ReactNode }) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <span className="grid size-7 shrink-0 place-items-center rounded-full border border-chart-track text-[12px] text-action-primary">{n}</span>
      <div className="min-w-0 flex-1">
        <b className="block text-h4 text-text-primary">{title}</b>
        {description && <small className="text-body-s-relaxed text-text-secondary">{description}</small>}
      </div>
      {action}
    </div>
  );
}

/** Полоса прогресса 6 px (.progress) — «Загружено 1 из 2» */
export function ProgressBar({ value, max = 1, label, className }: { value: number; max?: number; label: string; className?: string }) {
  const pct = Math.max(0, Math.min(100, (value / max) * 100));
  return (
    <div role="progressbar" aria-label={label} aria-valuemin={0} aria-valuemax={max} aria-valuenow={value}
      className={cn('h-1.5 overflow-hidden rounded-[3px] bg-chart-track-soft', className)}>
      <i className="block h-full bg-action-primary transition-[width] duration-300" style={{ width: `${pct}%` }} />
    </div>
  );
}

/** Строка безопасности по центру (.secure): щит + «Документы передаются по защищённому соединению…» */
export function SecureNote({ children, icon = 'shield' }: { children: ReactNode; icon?: IconName }) {
  return (
    <p className="m-0 flex items-center justify-center gap-2 text-center text-caption text-text-secondary">
      <Icon name={icon} size={16} className="shrink-0" />{children}
    </p>
  );
}

/** Мелкое пояснение 12 px (.hint) */
export function Hint({ children, className }: { children: ReactNode; className?: string }) {
  return <p className={cn('m-0 text-[12px] leading-[1.45] text-text-secondary', className)}>{children}</p>;
}

/** Состояние загрузки по центру (.ps-load): спиннер 36 + заголовок и пояснение */
export function LoadingState({ title, children }: { title: ReactNode; children?: ReactNode }) {
  return (
    <div role="status" aria-live="polite" className="flex flex-col items-center gap-2 pt-10 pb-12 text-center">
      <span aria-hidden className="mb-2 size-9 animate-spin rounded-full border-[3px] border-surface-card border-t-action-primary motion-reduce:animate-none" />
      <b className="text-h3 text-text-primary">{title}</b>
      {children && <p className="m-0 max-w-[420px] text-body-m text-text-secondary">{children}</p>}
    </div>
  );
}
