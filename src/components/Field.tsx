import { cva } from 'class-variance-authority';
import type { ReactNode } from 'react';
import { cn } from '../utils/cn';
import { Icon } from '../icons/Icon';

/**
 * Общая «рамка» полей — Figma: Мягко / Input (Size S 56 · M 64 · L 72).
 * Используется Input, Select, Textarea и MoneyField; отдельно её применять не нужно.
 */
export const fieldBox = cva(
  'group/field relative flex w-full flex-col justify-center rounded-14 border bg-surface-white px-4 text-left transition-[border-color,box-shadow] duration-150',
  {
    variants: {
      size: { s: 'min-h-14 py-1.5', m: 'min-h-16 py-2.5', l: 'min-h-18 py-3.5' },
      state: {
        default:
          'border-border-default hover:border-border-blue focus-within:border-action-primary focus-within:shadow-[inset_0_0_0_1px_var(--color-action-primary)] focus-within:hover:border-action-primary',
        error:
          'border-error focus-within:shadow-[inset_0_0_0_1px_var(--color-error)]',
        disabled: 'cursor-not-allowed border-border-default bg-surface-page',
      },
    },
    defaultVariants: { size: 'm', state: 'default' },
  },
);

export type FieldSize = 's' | 'm' | 'l';

/** Подпись поля. `floating` — пустое поле без фокуса: подпись крупно по центру, как плейсхолдер. */
export function FieldLabel({ htmlFor, id, floating, disabled, rightInset, children }: {
  htmlFor?: string; id?: string; floating?: boolean; disabled?: boolean; rightInset?: boolean; children: ReactNode;
}) {
  return (
    <label
      htmlFor={htmlFor}
      id={id}
      className={cn(
        'pointer-events-none block truncate transition-[font-size,line-height,top] duration-150',
        floating
          ? cn('absolute top-1/2 left-4 -translate-y-1/2 text-body-l', rightInset ? 'right-12' : 'right-4')
          : 'text-caption',
        disabled ? 'text-text-disabled' : 'text-text-muted',
      )}
    >
      {children}
    </label>
  );
}

/** Ошибка под полем — красный текст с иконкой (как в прототипе). Сообщение без точки в конце. */
export function FieldError({ id, children }: { id?: string; children: ReactNode }) {
  return (
    <p id={id} role="alert" className="mt-1.5 flex items-start gap-1.5 text-caption text-error">
      <Icon name="alert-circle" size={14} className="mt-0.5 shrink-0" />
      <span>{children}</span>
    </p>
  );
}

/** Подсказка под полем. При ошибке вместо неё показывается FieldError. */
export function FieldHelper({ id, disabled, children }: { id?: string; disabled?: boolean; children: ReactNode }) {
  return <p id={id} className={cn('mt-1.5 text-caption', disabled ? 'text-text-disabled' : 'text-text-secondary')}>{children}</p>;
}

/** Низ поля: ошибка или подсказка. Возвращает id для aria-describedby. */
export function FieldFoot({ baseId, error, helper, disabled }: { baseId: string; error?: ReactNode; helper?: ReactNode; disabled?: boolean }) {
  if (error && error !== true) return <FieldError id={`${baseId}-msg`}>{error}</FieldError>;
  if (helper) return <FieldHelper id={`${baseId}-msg`} disabled={disabled}>{helper}</FieldHelper>;
  return null;
}

export const fieldState = (error?: unknown, disabled?: boolean) => (disabled ? 'disabled' : error ? 'error' : 'default') as
  'disabled' | 'error' | 'default';

export const describedBy = (baseId: string, error?: ReactNode, helper?: ReactNode) =>
  (error && error !== true) || helper ? `${baseId}-msg` : undefined;
