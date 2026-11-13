import type { HTMLAttributes, ReactNode } from 'react';
import { cva } from 'class-variance-authority';
import { cn } from '../utils/cn';
import { Icon, type IconName } from '../icons/Icon';

const alertVariants = cva('flex items-start gap-3 rounded-20 p-5 text-left', {
  variants: {
    type: {
      info: 'bg-surface-card text-action-primary',
      success: 'bg-success-bg text-success',
      warning: 'bg-warning-bg text-warning-text',
      error: 'bg-error-bg text-error',
    },
  },
  defaultVariants: { type: 'info' },
});

const ICONS: Record<AlertType, IconName> = { info: 'info', success: 'circle-check', warning: 'triangle-alert', error: 'alert-circle' };

export type AlertType = 'info' | 'success' | 'warning' | 'error';

export interface AlertProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  type?: AlertType;
  /** Заголовок цветом типа: «Доступна новая версия» */
  title: ReactNode;
  /** Описание серым под заголовком */
  children?: ReactNode;
  /** Крестик справа (Figma: свойство «Крестик») */
  onClose?: () => void;
  /** Кнопка или ссылка под описанием */
  action?: ReactNode;
}

/**
 * Уведомление в потоке страницы — Figma: Мягко / Alert. Радиус 20, отступ 20, иконка 20.
 * warning и error объявляются скринридеру сразу (role="alert"), info и success — вежливо.
 */
export function Alert({ type = 'info', title, children, onClose, action, className, ...rest }: AlertProps) {
  const urgent = type === 'warning' || type === 'error';
  return (
    <div role={urgent ? 'alert' : 'status'} className={cn(alertVariants({ type }), className)} {...rest}>
      <Icon name={ICONS[type]} size={20} className="shrink-0" />
      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <p className="m-0 text-button-m">{title}</p>
        {children && <div className="text-caption text-text-secondary">{children}</div>}
        {action && <div className="mt-2">{action}</div>}
      </div>
      {onClose && (
        <button type="button" onClick={onClose} aria-label="Закрыть" className="-m-1 grid size-6 shrink-0 place-items-center rounded-6 opacity-80 hover:opacity-100">
          <Icon name="x" size={16} />
        </button>
      )}
    </div>
  );
}
