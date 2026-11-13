import { useEffect, useId, useRef, useState, type KeyboardEvent, type ReactNode } from 'react';
import { cn } from '../utils/cn';
import { Icon } from '../icons/Icon';
import { describedBy, fieldBox, FieldFoot, fieldState, type FieldSize } from './Field';

export type SelectOption<V extends string = string> = V | { value: V; label: ReactNode; disabled?: boolean };

export interface SelectProps<V extends string = string> {
  label: ReactNode;
  options: readonly SelectOption<V>[];
  value: V | null;
  onChange: (value: V) => void;
  /** Текст, пока ничего не выбрано */
  placeholder?: string;
  helper?: ReactNode;
  error?: ReactNode;
  disabled?: boolean;
  size?: FieldSize;
  id?: string;
  className?: string;
}

const norm = <V extends string>(o: SelectOption<V>) => (typeof o === 'string' ? { value: o, label: o as ReactNode, disabled: false } : { disabled: false, ...o });

/**
 * Выпадающий список — Figma: Мягко / Select. Открытый — синяя рамка и шеврон вверх,
 * выбранный пункт подсвечен и отмечен галочкой. Клавиатура: ↑ ↓ Home End, Enter/Пробел, Esc.
 */
export function Select<V extends string = string>({
  label, options, value, onChange, placeholder = 'Выберите из списка', helper, error, disabled, size = 'm', id, className,
}: SelectProps<V>) {
  const autoId = useId();
  const baseId = id ?? autoId;
  const items = options.map(norm);
  const selIndex = items.findIndex((o) => o.value === value);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);
  const root = useRef<HTMLDivElement>(null);
  const btn = useRef<HTMLButtonElement>(null);
  const list = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const close = (e: MouseEvent) => { if (!root.current?.contains(e.target as Node)) setOpen(false); };
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, [open]);

  useEffect(() => {
    if (open && active >= 0) list.current?.querySelector(`[data-i="${active}"]`)?.scrollIntoView?.({ block: 'nearest' });
  }, [open, active]);

  const show = () => { setActive(selIndex >= 0 ? selIndex : items.findIndex((o) => !o.disabled)); setOpen(true); };
  const pick = (i: number) => {
    const o = items[i];
    if (!o || o.disabled) return;
    onChange(o.value);
    setOpen(false);
    btn.current?.focus();
  };
  const move = (dir: 1 | -1, from = active) => {
    let i = from;
    for (let n = 0; n < items.length; n++) {
      i = (i + dir + items.length) % items.length;
      if (!items[i]!.disabled) return setActive(i);
    }
  };

  const onKey = (e: KeyboardEvent) => {
    if (disabled) return;
    const k = e.key;
    if (!open) {
      if (k === 'ArrowDown' || k === 'ArrowUp' || k === 'Enter' || k === ' ') { e.preventDefault(); show(); }
      return;
    }
    if (k === 'Escape' || k === 'Tab') { if (k === 'Escape') e.preventDefault(); setOpen(false); }
    else if (k === 'ArrowDown') { e.preventDefault(); move(1); }
    else if (k === 'ArrowUp') { e.preventDefault(); move(-1); }
    else if (k === 'Home') { e.preventDefault(); move(1, -1); }
    else if (k === 'End') { e.preventDefault(); move(-1, items.length); }
    else if (k === 'Enter' || k === ' ') { e.preventDefault(); pick(active); }
  };

  const current = selIndex >= 0 ? items[selIndex] : null;
  const state = fieldState(error, disabled);

  return (
    <div ref={root} className={cn('relative', className)}>
      <button
        ref={btn}
        type="button"
        id={baseId}
        disabled={disabled}
        role="combobox"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={`${baseId}-list`}
        aria-activedescendant={open && active >= 0 ? `${baseId}-o${active}` : undefined}
        aria-labelledby={`${baseId}-lab ${baseId}-val`}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy(baseId, error, helper)}
        onClick={() => (open ? setOpen(false) : show())}
        onKeyDown={onKey}
        className={cn(
          fieldBox({ size, state }),
          'cursor-pointer pr-10 outline-none disabled:cursor-not-allowed',
          open && state === 'default' && 'border-action-primary shadow-[inset_0_0_0_1px_var(--color-action-primary)] hover:border-action-primary',
          state === 'default' && 'focus-visible:border-action-primary focus-visible:shadow-[inset_0_0_0_1px_var(--color-action-primary)]',
        )}
      >
        <span id={`${baseId}-lab`} className="block truncate text-caption text-text-muted">{label}</span>
        <span
          id={`${baseId}-val`}
          className={cn('block truncate pt-0.5 text-body-l leading-[22px]', disabled ? 'text-text-secondary' : current ? 'text-text-primary' : 'text-text-muted')}
        >
          {current ? current.label : placeholder}
        </span>
        <Icon
          name={open ? 'chevron-up' : 'chevron-down'}
          size={18}
          className="absolute top-1/2 right-3 -translate-y-1/2 text-text-secondary"
        />
      </button>
      <FieldFoot baseId={baseId} error={error} helper={helper} disabled={disabled} />
      {open && (
        <div
          ref={list}
          id={`${baseId}-list`}
          role="listbox"
          aria-labelledby={`${baseId}-lab`}
          className="absolute top-[calc(100%+6px)] left-0 z-30 flex max-h-80 w-full flex-col gap-0.5 overflow-auto rounded-16 border border-border-default bg-surface-white p-2 shadow-pop"
          style={{ top: btn.current ? btn.current.offsetHeight + 6 : undefined }}
        >
          {items.map((o, i) => {
            const sel = i === selIndex;
            return (
              <div
                key={o.value}
                id={`${baseId}-o${i}`}
                data-i={i}
                role="option"
                aria-selected={sel}
                aria-disabled={o.disabled || undefined}
                onMouseEnter={() => !o.disabled && setActive(i)}
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => pick(i)}
                className={cn(
                  'flex cursor-pointer items-center justify-between gap-3 rounded-10 px-3 py-2.25 text-body-m',
                  sel ? 'bg-surface-card font-medium text-action-primary' : 'text-text-primary',
                  !sel && i === active && 'bg-surface-page',
                  o.disabled && 'cursor-not-allowed text-text-disabled',
                )}
              >
                <span className="min-w-0 truncate">{o.label}</span>
                {sel && <Icon name="check" size={16} className="shrink-0" />}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
