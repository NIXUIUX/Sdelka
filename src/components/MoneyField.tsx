import { forwardRef } from 'react';
import { digits } from '../utils/masks';
import { Input, type InputProps } from './Input';

export interface MoneyFieldProps extends Omit<InputProps, 'value' | 'defaultValue' | 'onChange' | 'mask'> {
  /** Сумма в рублях. `null` — поле пустое */
  value: number | null;
  onChange?: (value: number | null) => void;
  /** Максимум цифр, по умолчанию 10 (до 9 999 999 999) */
  maxDigits?: number;
}

/** 150000 → «150 000» (неразрывные пробелы между разрядами) */
export const formatMoney = (n: number | null | undefined): string =>
  n === null || n === undefined || Number.isNaN(n) ? '' : Math.round(n).toLocaleString('ru-RU');

/**
 * Поле суммы — Figma: Мягко / MoneyField. Разбивает разряды пробелами, справа «₽».
 * Пример: «Основной доход, ₽ / мес», подсказка «После вычета налогов».
 */
export const MoneyField = forwardRef<HTMLInputElement, MoneyFieldProps>(function MoneyField(
  { value, onChange, suffix = '₽', maxDigits = 10, placeholder = '0', floatingLabel = false, ...rest },
  ref,
) {
  return (
    <Input
      ref={ref}
      inputMode="numeric"
      suffix={suffix}
      placeholder={placeholder}
      floatingLabel={floatingLabel}
      value={formatMoney(value)}
      onChange={(v) => {
        const d = digits(v).slice(0, maxDigits);
        onChange?.(d ? Number(d) : null);
      }}
      {...rest}
    />
  );
});
