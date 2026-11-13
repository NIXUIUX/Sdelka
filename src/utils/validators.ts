import { digits } from './masks';

/** Валидаторы возвращают текст ошибки или '' — тексты без точки в конце (редполитика) */
export const isEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim());

export function isDate(v: string): boolean {
  const m = /^(\d{2})\.(\d{2})\.(\d{4})$/.exec(v);
  if (!m) return false;
  const [d, mo, y] = [+m[1], +m[2], +m[3]];
  const dt = new Date(y, mo - 1, d);
  return dt.getFullYear() === y && dt.getMonth() === mo - 1 && dt.getDate() === d;
}

export const validate = {
  required: (v: string, msg = 'Заполните поле') => (v.trim() ? '' : msg),
  phone: (v: string) => (digits(v).length === 11 ? '' : 'Введите номер полностью'),
  email: (v: string) => (isEmail(v) ? '' : 'Проверьте адрес: на него придут уведомления по заявке и ответ банка'),
  date: (v: string) => (isDate(v) ? '' : 'Введите дату в формате дд.мм.гггг'),
  snils: (v: string) => (digits(v).length === 11 ? '' : 'СНИЛС — 11 цифр'),
  inn10: (v: string) => (digits(v).length === 10 ? '' : 'ИНН организации — 10 цифр'),
  passportSeries: (v: string) => (digits(v).length === 4 ? '' : 'Серия — 4 цифры'),
  passportNumber: (v: string) => (digits(v).length === 6 ? '' : 'Номер — 6 цифр'),
};

/** Собирает ошибки и отдаёт первую по порядку — для перехода к верхнему полю и текста в плашке */
export function collectErrors<K extends string>(rules: Record<K, string>): { errors: Partial<Record<K, string>>; first: K | null } {
  const errors: Partial<Record<K, string>> = {};
  let first: K | null = null;
  for (const k in rules) if (rules[k]) { errors[k] = rules[k]; first ??= k; }
  return { errors, first };
}

/** «Заполните поле «X»» / «Проверьте поля «X» и «Y»» / «… и ещё N» */
export function errorSummary(names: string[]): string {
  const uniq = [...new Set(names)].map((n) => `«${n}»`);
  if (!uniq.length) return '';
  if (uniq.length === 1) return `Заполните поле ${uniq[0]}`;
  const shown = uniq.slice(0, 3);
  const rest = uniq.length - shown.length;
  if (rest > 0) return `Проверьте поля ${shown.join(', ')} и ещё ${rest}`;
  return `Проверьте поля ${shown.slice(0, -1).join(', ')} и ${shown.at(-1)}`;
}
