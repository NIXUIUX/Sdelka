/** Форматирование чисел, сумм и склонений — так же, как в прототипе флоу Б */

/** Склонение по числу: plural(3, 'банк', 'банка', 'банков') → «банка» */
export function plural(n: number, one: string, few: string, many: string): string {
  const a = Math.abs(n) % 100;
  const b = a % 10;
  if (b === 1 && a !== 11) return one;
  if (b >= 2 && b <= 4 && (a < 10 || a >= 20)) return few;
  return many;
}

/** 6000000 → «6 000 000 ₽» (неразрывные пробелы, как в ru-RU) */
export const rub = (n: number): string => Math.round(n).toLocaleString('ru-RU') + ' ₽';

/** 18.95 → «18,95%» */
export const pct = (n: number): string => (Math.round(n * 100) / 100).toString().replace('.', ',') + '%';

/** 25 → «25 лет» */
export const years = (n: number): string => `${n} ${plural(n, 'год', 'года', 'лет')}`;

/** Аннуитетный платёж: сумма, ставка в % годовых, срок в годах */
export function annuity(sum: number, ratePct: number, termYears: number): number {
  const m = ratePct / 1200;
  const n = termYears * 12;
  return m ? (sum * m) / (1 - Math.pow(1 + m, -n)) : sum / n;
}

/** Время отправки: «сегодня, 10:50» или «08.11, 10:50» */
export function formatSentAt(iso: string, now: Date = new Date()): string {
  const d = new Date(iso);
  const t = d.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
  const day = d.toDateString() === now.toDateString() ? 'сегодня' : d.toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit' });
  return `${day}, ${t}`;
}
