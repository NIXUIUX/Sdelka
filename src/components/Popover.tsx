import { useEffect, useId, useRef, useState, type ReactNode } from 'react';
import { cn } from '../utils/cn';
import { Icon } from '../icons/Icon';
import { Button } from './Button';
import { Chip, type ChipProps } from './Chip';

export interface PopoverProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Кнопка, к которой привязан поповер. Получает props для доступности */
  trigger: (p: { 'aria-expanded': boolean; 'aria-controls': string; onClick: () => void }) => ReactNode;
  children: ReactNode;
  /** К какому краю кнопки прижать панель */
  align?: 'start' | 'end';
  /** Ширина панели в px (по умолчанию по содержимому, от 240) */
  width?: number;
  className?: string;
}

/**
 * Всплывающая панель под кнопкой — Figma: тень Shadow/Pop, радиус 16, рамка border/default.
 * Закрывается кликом снаружи и Esc (фокус возвращается на кнопку).
 * На узком экране не вылезает за край: max-width = ширина экрана − 32.
 */
export function Popover({ open, onOpenChange, trigger, children, align = 'start', width, className }: PopoverProps) {
  const root = useRef<HTMLDivElement>(null);
  const id = useId();

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => { if (!root.current?.contains(e.target as Node)) onOpenChange(false); };
    const onKey = (e: globalThis.KeyboardEvent) => {
      if (e.key !== 'Escape') return;
      onOpenChange(false);
      root.current?.querySelector<HTMLElement>('[aria-controls]')?.focus();
    };
    document.addEventListener('mousedown', onDown);
    document.addEventListener('keydown', onKey);
    return () => { document.removeEventListener('mousedown', onDown); document.removeEventListener('keydown', onKey); };
  }, [open, onOpenChange]);

  return (
    <div ref={root} className="relative inline-flex">
      {trigger({ 'aria-expanded': open, 'aria-controls': id, onClick: () => onOpenChange(!open) })}
      {open && (
        <div
          id={id}
          role="dialog"
          className={cn(
            'absolute top-[calc(100%+6px)] z-30 max-w-[calc(100vw-32px)] min-w-60 rounded-16 border border-border-default bg-surface-white shadow-pop',
            align === 'end' ? 'right-0' : 'left-0',
            className,
          )}
          style={width ? { width } : undefined}
        >
          {children}
        </div>
      )}
    </div>
  );
}

export interface MenuProps<V extends string = string> {
  items: readonly (V | { value: V; label: ReactNode })[];
  value: V | null;
  onPick: (value: V) => void;
}

/** Список вариантов внутри поповера — как в Select: выбранный подсвечен и с галочкой */
export function Menu<V extends string = string>({ items, value, onPick }: MenuProps<V>) {
  return (
    <div role="listbox" className="flex max-h-80 flex-col gap-0.5 overflow-auto p-2">
      {items.map((it) => {
        const o = typeof it === 'string' ? { value: it, label: it as ReactNode } : it;
        const sel = o.value === value;
        return (
          <button
            key={o.value}
            type="button"
            role="option"
            aria-selected={sel}
            onClick={() => onPick(o.value)}
            className={cn(
              'flex items-center justify-between gap-3 rounded-10 px-3 py-2.25 text-left text-body-m transition-colors duration-150',
              sel ? 'bg-surface-card font-medium text-action-primary' : 'text-text-primary hover:bg-surface-page',
            )}
          >
            <span className="min-w-0">{o.label}</span>
            {sel && <Icon name="check" size={16} className="shrink-0" />}
          </button>
        );
      })}
    </div>
  );
}

export interface FilterPanelProps {
  /** Заголовок: «Стоимость недвижимости» */
  title: ReactNode;
  children: ReactNode;
  /** Кнопка «Применить». Без обработчика кнопки нет — значения применяются сразу */
  onApply?: () => void;
  applyLabel?: string;
  /** Блокирует «Применить» (например, при ошибке в поле) */
  applyDisabled?: boolean;
}

/**
 * Содержимое поповера-фильтра — Figma: Мягко / Filter popover. Ширина 320, отступы 16:
 * заголовок H3, поле(я), кнопка «Применить» на всю ширину.
 */
export function FilterPanel({ title, children, onApply, applyLabel = 'Применить', applyDisabled }: FilterPanelProps) {
  return (
    <form
      className="flex flex-col gap-4 p-4"
      onSubmit={(e) => { e.preventDefault(); if (!applyDisabled) onApply?.(); }}
    >
      <h4 className="m-0 text-h3 text-text-primary">{title}</h4>
      {children}
      {onApply && <Button type="submit" fullWidth disabled={applyDisabled}>{applyLabel}</Button>}
    </form>
  );
}

export interface FilterChipProps extends Omit<ChipProps, 'open' | 'onClick' | 'children'> {
  /** Содержимое поповера. `close()` закрывает его, например после выбора пункта */
  children: (close: () => void) => ReactNode;
  align?: 'start' | 'end';
  /** Ширина поповера: 320 для FilterPanel (по умолчанию), undefined — по содержимому */
  width?: number;
  /** Вызывается при открытии/закрытии — например, чтобы сбросить черновик значения */
  onOpenChange?: (open: boolean) => void;
}

/** Чип + поповер в одном: самый частый случай в строке параметров подбора */
export function FilterChip({ children, align, width = 320, onOpenChange, ...chip }: FilterChipProps) {
  const [open, setOpen] = useState(false);
  const set = (v: boolean) => { setOpen(v); onOpenChange?.(v); };
  return (
    <Popover open={open} onOpenChange={set} align={align} width={width}
      trigger={(p) => <Chip {...chip} {...p} open={open} />}>
      {children(() => set(false))}
    </Popover>
  );
}
