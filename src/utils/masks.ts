/**
 * Маски полей: формат и длина — по подсказке поля. Лишние символы и буквы не вводятся.
 * Перенесено из прототипа флоу Б без изменения поведения.
 */
export const digits = (v: string): string => String(v).replace(/\D/g, '');

const group = (d: string, parts: number[], seps: string[]): string => {
  let out = '';
  let i = 0;
  parts.forEach((n, k) => {
    const p = d.slice(i, i + n);
    if (!p) return;
    out += (k && i < d.length ? seps[k - 1] : '') + p;
    i += n;
  });
  return out;
};

export const masks = {
  phone: (v: string) => {
    let d = digits(v);
    if (!d) return '';
    if (d[0] === '8') d = '7' + d.slice(1);
    if (d[0] !== '7') d = '7' + d;
    d = d.slice(0, 11);
    const b = d.slice(1);
    let o = '+7';
    if (b.length) o += ' (' + b.slice(0, 3);
    if (b.length > 3) o += ') ' + b.slice(3, 6);
    if (b.length > 6) o += '-' + b.slice(6, 8);
    if (b.length > 8) o += '-' + b.slice(8, 10);
    return o;
  },
  date: (v: string) => group(digits(v).slice(0, 8), [2, 2, 4], ['.', '.']),
  snils: (v: string) => group(digits(v).slice(0, 11), [3, 3, 3, 2], ['-', '-', ' ']),
  passport: (v: string) => group(digits(v).slice(0, 10), [4, 6], [' ']),
  passportSeries: (v: string) => group(digits(v).slice(0, 4), [2, 2], [' ']),
  passportNumber: (v: string) => digits(v).slice(0, 6),
  divisionCode: (v: string) => group(digits(v).slice(0, 6), [3, 3], ['-']),
  inn10: (v: string) => digits(v).slice(0, 10),
  inn12: (v: string) => digits(v).slice(0, 12),
  year: (v: string) => digits(v).slice(0, 4),
  years: (v: string) => digits(v).slice(0, 2).replace(/^0(\d)/, '$1'),
  months: (v: string) => digits(v).slice(0, 2).replace(/^0(\d)/, '$1'),
  money: (v: string) => digits(v).slice(0, 10),
  name: (v: string) => v.replace(/[^A-Za-zА-Яа-яЁё\s-]/g, '').replace(/\s{2,}/g, ' ').slice(0, 100),
  email: (v: string) => v.replace(/\s/g, '').slice(0, 80),
  text: (v: string) => v.slice(0, 200),
} as const;

export type MaskName = keyof typeof masks;

/** Формат, который видно в пустом поле при фокусе */
export const maskPlaceholder: Partial<Record<MaskName, string>> = {
  phone: '+7 (000) 000-00-00', date: 'дд.мм.гггг', snils: '000-000-000 00', passport: '0000 000000',
  passportSeries: '00 00', passportNumber: '000000', divisionCode: '000-000', inn10: '0000000000',
  inn12: '000000000000', year: 'гггг', email: 'name@example.com',
};

/** Какую клавиатуру открыть на телефоне */
export const maskInputMode: Partial<Record<MaskName, 'tel' | 'numeric' | 'email' | 'decimal'>> = {
  phone: 'tel', date: 'numeric', snils: 'numeric', passport: 'numeric', passportSeries: 'numeric', passportNumber: 'numeric',
  divisionCode: 'numeric', inn10: 'numeric', inn12: 'numeric', year: 'numeric', years: 'numeric', months: 'numeric',
  money: 'numeric', email: 'email',
};

/** Длина полностью введённого значения */
export const maskLength: Partial<Record<MaskName, number>> = {
  phone: 18, date: 10, snils: 14, passport: 11, passportSeries: 5, passportNumber: 6, divisionCode: 7, inn10: 10, inn12: 12, year: 4, years: 2, months: 2, email: 80, name: 100, text: 200,
};
