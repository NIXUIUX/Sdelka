import { useEffect, useId, useRef, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { cn } from '../utils/cn';
import { Icon } from '../icons/Icon';

export interface ModalProps {
  open: boolean;
  onClose: () => void;
  /** Заголовок H2: «Прескоринг участников» */
  title: ReactNode;
  /** Подзаголовок серым под заголовком */
  subtitle?: ReactNode;
  children: ReactNode;
  /** Кнопки внизу справа: вторичная, затем основная */
  actions?: ReactNode;
  /** m — 520 (формы, подтверждения), l — 800 (таблицы, отчёт прескоринга, данные банка) */
  size?: 'm' | 'l';
  /** Закрывать кликом по затемнению (по умолчанию да) */
  closeOnOverlay?: boolean;
  className?: string;
}

const FOCUSABLE = 'a[href],button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])';

/**
 * Модальное окно — Figma: Мягко / Modal (Size M 520 · L 800). Радиус 20, отступ 24, тень Pop.
 * Шапка и кнопки прилипают, содержимое прокручивается внутри окна.
 * Esc и клик по затемнению закрывают, фокус заперт внутри и возвращается на кнопку, которая открыла окно.
 */
export function Modal({ open, onClose, title, subtitle, children, actions, size = 'm', closeOnOverlay = true, className }: ModalProps) {
  const box = useRef<HTMLDivElement>(null);
  const titleId = useId();
  const subId = useId();
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  useEffect(() => {
    if (!open) return;
    const prevFocus = document.activeElement as HTMLElement | null;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const first = box.current?.querySelector<HTMLElement>('[data-autofocus]') ?? box.current;
    first?.focus({ preventScroll: true });

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { e.stopPropagation(); onCloseRef.current(); return; }
      if (e.key !== 'Tab' || !box.current) return;
      const list = [...box.current.querySelectorAll<HTMLElement>(FOCUSABLE)].filter((el) => el.offsetParent !== null || el === document.activeElement);
      if (!list.length) return;
      const a = list[0]!, z = list[list.length - 1]!;
      if (e.shiftKey && (document.activeElement === a || document.activeElement === box.current)) { e.preventDefault(); z.focus(); }
      else if (!e.shiftKey && document.activeElement === z) { e.preventDefault(); a.focus(); }
    };
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
      prevFocus?.focus?.({ preventScroll: true });
    };
  }, [open]);

  if (!open || typeof document === 'undefined') return null;

  return createPortal(
    <div
      className="fixed inset-0 z-50 grid grid-cols-[minmax(0,1fr)] place-items-center bg-overlay p-4 backdrop-blur-[3px]"
      onMouseDown={(e) => { if (closeOnOverlay && e.target === e.currentTarget) onClose(); }}
    >
      <div
        ref={box}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={subtitle ? subId : undefined}
        tabIndex={-1}
        className={cn(
          'flex max-h-[calc(100dvh-32px)] w-full flex-col overflow-hidden rounded-20 border border-border-default bg-surface-white shadow-pop outline-none',
          size === 'l' ? 'max-w-200' : 'max-w-130',
          className,
        )}
      >
        <header className="flex shrink-0 items-start gap-4 px-6 pt-6 pb-3">
          <div className="flex min-w-0 flex-1 flex-col gap-1">
            <h2 id={titleId} className="m-0 text-h2 text-text-primary">{title}</h2>
            {subtitle && <p id={subId} className="m-0 text-body-s text-text-secondary">{subtitle}</p>}
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Закрыть"
            className="grid size-10 shrink-0 place-items-center rounded-full border-[1.5px] border-border-blue text-action-primary transition-colors duration-150 hover:bg-surface-card"
          >
            <Icon name="x" size={20} />
          </button>
        </header>
        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-6 py-3">{children}</div>
        {actions && <footer className="flex shrink-0 flex-wrap justify-end gap-3 px-6 pt-4 pb-6">{actions}</footer>}
        {!actions && <div className="h-3 shrink-0" />}
      </div>
    </div>,
    document.body,
  );
}
