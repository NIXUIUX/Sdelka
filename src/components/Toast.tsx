import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { cn } from '../utils/cn';

/**
 * Короткое сообщение о результате действия — Figma: Мягко / Toast.
 * Тёмная плашка по центру сверху (под шапкой), радиус 12, текст Body/M белым. Исчезает сама.
 */
export function Toast({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div
      role="status"
      className={cn(
        'pointer-events-auto max-w-[calc(100vw-32px)] rounded-12 bg-text-primary px-4 py-3 text-body-m text-surface-white shadow-pop',
        'animate-[toast-in_.18s_ease-out] motion-reduce:animate-none',
        className,
      )}
    >
      {children}
    </div>
  );
}

type ToastFn = (message: ReactNode, opts?: { duration?: number }) => void;
const ToastCtx = createContext<ToastFn | null>(null);

/**
 * Оберните приложение один раз: <ToastProvider>…</ToastProvider>.
 * `top` — отступ сверху, по умолчанию 84 (под AppHeader).
 */
export function ToastProvider({ children, top = 84, duration = 2800 }: { children: ReactNode; top?: number; duration?: number }) {
  const [msg, setMsg] = useState<{ id: number; text: ReactNode; ms: number } | null>(null);
  const seq = useRef(0);
  const show = useCallback<ToastFn>((text, opts) => setMsg({ id: ++seq.current, text, ms: opts?.duration ?? duration }), [duration]);

  useEffect(() => {
    if (!msg) return;
    const t = setTimeout(() => setMsg(null), msg.ms);
    return () => clearTimeout(t);
  }, [msg]);

  return (
    <ToastCtx.Provider value={show}>
      {children}
      {typeof document !== 'undefined' &&
        createPortal(
          <div
            aria-live="polite"
            className="pointer-events-none fixed inset-x-0 z-60 flex justify-center px-4"
            style={{ top: `calc(${top}px + env(safe-area-inset-top, 0px))` }}
          >
            {msg && <Toast key={msg.id}>{msg.text}</Toast>}
          </div>,
          document.body,
        )}
    </ToastCtx.Provider>
  );
}

/** const toast = useToast(); toast('Рейтинг сохранён в заявке') */
export function useToast(): ToastFn {
  const fn = useContext(ToastCtx);
  if (!fn) throw new Error('useToast: оберните приложение в <ToastProvider>');
  return fn;
}
