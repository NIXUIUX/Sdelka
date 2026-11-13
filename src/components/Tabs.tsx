import { useRef, type KeyboardEvent, type ReactNode } from 'react';
import { cn } from '../utils/cn';
import { Badge } from './Badge';

export type TabItem<V extends string = string> = { value: V; label: ReactNode; count?: number; disabled?: boolean };

interface TabsBase<V extends string> {
  items: readonly TabItem<V>[];
  value: V;
  onChange: (value: V) => void;
  /** Подпись для скринридера: «Разделы заявки» */
  'aria-label'?: string;
  /** id панели, которой управляет вкладка: (value) => `panel-${value}` */
  panelId?: (value: V) => string;
  className?: string;
}

/** Стрелки ← → Home End переключают вкладки (табы с автоматической активацией) */
function useRoving<V extends string>(items: readonly TabItem<V>[], value: V, onChange: (v: V) => void) {
  const ref = useRef<HTMLDivElement>(null);
  const onKeyDown = (e: KeyboardEvent) => {
    const enabled = items.filter((i) => !i.disabled);
    const idx = enabled.findIndex((i) => i.value === value);
    const go = { ArrowRight: idx + 1, ArrowLeft: idx - 1, Home: 0, End: enabled.length - 1 }[e.key as 'Home'];
    if (go === undefined) return;
    e.preventDefault();
    const next = enabled[(go + enabled.length) % enabled.length]!;
    onChange(next.value);
    ref.current?.querySelector<HTMLButtonElement>(`[data-value="${CSS.escape(next.value)}"]`)?.focus();
  };
  return { ref, onKeyDown };
}

/**
 * Вкладки с линией — Figma: Мягко / LineTab. Высота 48, линия снизу.
 * Default — серая линия 1, Hover — голубая 2 и синий текст, Active — синяя 2 и полужирный.
 * Для разделов страницы: «Ипотечные заявки / Архив».
 */
export function LineTabs<V extends string = string>({ items, value, onChange, panelId, className, ...aria }: TabsBase<V>) {
  const { ref, onKeyDown } = useRoving(items, value, onChange);
  return (
    <div ref={ref} role="tablist" aria-label={aria['aria-label']} onKeyDown={onKeyDown}
      className={cn('flex overflow-x-auto border-b border-border-default [scrollbar-width:none]', className)}>
      {items.map((t) => {
        const on = t.value === value;
        return (
          <button
            key={t.value}
            type="button"
            role="tab"
            data-value={t.value}
            aria-selected={on}
            aria-controls={panelId?.(t.value)}
            tabIndex={on ? 0 : -1}
            disabled={t.disabled}
            onClick={() => onChange(t.value)}
            className={cn(
              '-mb-px inline-flex h-12 shrink-0 items-center gap-2 border-b-2 px-4 whitespace-nowrap transition-colors duration-150',
              'disabled:cursor-not-allowed disabled:text-text-disabled',
              on
                ? 'border-action-primary text-button-m text-action-primary'
                : 'border-transparent text-body-m text-text-primary hover:enabled:border-border-blue hover:enabled:text-action-primary',
            )}
          >
            {t.label}
            {t.count !== undefined && <Badge tone={on ? 'counter' : 'neutral'} size="xs" dot={false}>{t.count}</Badge>}
          </button>
        );
      })}
    </div>
  );
}

/**
 * Текстовые вкладки — Figma: Мягко / TextTab. Высота 28, радиус 6.
 * Default — серый текст, Hover — светлый фон, Active — голубой фон и синий полужирный текст.
 * Для переключения вида внутри блока: «По параметрам / По банкам».
 */
export function TextTabs<V extends string = string>({ items, value, onChange, panelId, className, ...aria }: TabsBase<V>) {
  const { ref, onKeyDown } = useRoving(items, value, onChange);
  return (
    <div ref={ref} role="tablist" aria-label={aria['aria-label']} onKeyDown={onKeyDown} className={cn('inline-flex flex-wrap gap-1', className)}>
      {items.map((t) => {
        const on = t.value === value;
        return (
          <button
            key={t.value}
            type="button"
            role="tab"
            data-value={t.value}
            aria-selected={on}
            aria-controls={panelId?.(t.value)}
            tabIndex={on ? 0 : -1}
            disabled={t.disabled}
            onClick={() => onChange(t.value)}
            className={cn(
              'inline-flex h-7 items-center gap-1.5 rounded-6 px-2.5 whitespace-nowrap transition-colors duration-150',
              'disabled:cursor-not-allowed disabled:text-text-disabled',
              on
                ? 'bg-surface-card text-button-s text-action-primary'
                : 'text-body-s text-text-secondary hover:enabled:bg-surface-page hover:enabled:text-text-primary',
            )}
          >
            {t.label}
            {t.count !== undefined && <span className="tabular-nums opacity-70">{t.count}</span>}
          </button>
        );
      })}
    </div>
  );
}
