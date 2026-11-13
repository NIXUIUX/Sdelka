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

/**
 * Переключатель-пилюля из прототипа (.segtabs): «Проектное финансирование / Снижение ставки» в окне ДОМ.РФ,
 * способ подписания в Сбере. Голубая подложка с рамкой accent, выбранный — белый, синий, полужирный.
 */
export function SegmentedTabs<V extends string = string>({ items, value, onChange, panelId, className, ...aria }: TabsBase<V>) {
  const { ref, onKeyDown } = useRoving(items, value, onChange);
  return (
    <div ref={ref} role="tablist" aria-label={aria['aria-label']} onKeyDown={onKeyDown}
      className={cn('inline-flex max-w-full flex-wrap gap-1 self-start rounded-999 border border-border-blue bg-surface-card p-1', className)}>
      {items.map((t) => {
        const on = t.value === value;
        return (
          <button key={t.value} type="button" role="tab" data-value={t.value} aria-selected={on} aria-controls={panelId?.(t.value)}
            tabIndex={on ? 0 : -1} disabled={t.disabled} onClick={() => onChange(t.value)}
            className={cn('h-8 rounded-999 px-3.5 text-[13px] whitespace-nowrap transition-colors duration-150 disabled:cursor-not-allowed disabled:opacity-50',
              on ? 'bg-surface-white font-semibold text-action-primary' : 'text-text-secondary hover:enabled:bg-surface-white/60 hover:enabled:text-text-primary')}>
            {t.label}
          </button>
        );
      })}
    </div>
  );
}

export interface ChoiceGroupProps<V extends string | number> {
  options: readonly { value: V; label: ReactNode }[];
  value: V | null;
  onChange: (v: V) => void;
  'aria-label': string;
  className?: string;
}

/**
 * Ряд равных кнопок выбора из прототипа (.seg): «Количество детей 1 2 3 4 5+».
 * Выбранная — голубой фон, синяя рамка 1.5, полужирный.
 */
export function ChoiceGroup<V extends string | number>({ options, value, onChange, className, ...aria }: ChoiceGroupProps<V>) {
  return (
    <div role="radiogroup" aria-label={aria['aria-label']} className={cn('grid gap-2', className)}
      style={{ gridTemplateColumns: `repeat(${options.length}, minmax(0, 1fr))` }}>
      {options.map((o) => {
        const on = o.value === value;
        return (
          <button key={String(o.value)} type="button" role="radio" aria-checked={on} onClick={() => onChange(o.value)}
            className={cn('h-9 rounded-10 border bg-surface-white text-body-m transition-colors duration-150',
              on ? 'border-[1.5px] border-action-primary bg-surface-card font-semibold text-action-primary' : 'border-border-default hover:border-border-blue')}>
            {o.label}
          </button>
        );
      })}
    </div>
  );
}
