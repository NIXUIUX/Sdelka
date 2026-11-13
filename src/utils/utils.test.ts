import { masks, digits } from './masks';
import { validate, errorSummary, collectErrors, isDate } from './validators';
import { plural, rub, pct, years, annuity } from './format';
import { cn } from './cn';

describe('masks', () => {
  it('phone: 8 → +7, лишние цифры отрезаются, буквы не проходят', () => {
    expect(masks.phone('89001234567999')).toBe('+7 (900) 123-45-67');
    expect(masks.phone('9ab001')).toBe('+7 (900) 1');
    expect(masks.phone('')).toBe('');
  });
  it('snils, passport, date, code', () => {
    expect(masks.snils('12345678901')).toBe('123-456-789 01');
    expect(masks.passport('451012345699')).toBe('4510 123456');
    expect(masks.passportSeries('65aa43')).toBe('65 43');
    expect(masks.date('12041988')).toBe('12.04.1988');
    expect(masks.divisionCode('770001')).toBe('770-001');
  });
  it('years/months убирают ведущий ноль, money только цифры', () => {
    expect(masks.years('07')).toBe('7');
    expect(masks.money('150 000 ₽')).toBe('150000');
    expect(masks.name('Иван2 Иванов')).toBe('Иван Иванов');
    expect(digits('+7 (900)')).toBe('7900');
  });
});

describe('validators', () => {
  it('date проверяет реальную дату', () => {
    expect(isDate('31.02.2020')).toBe(false);
    expect(isDate('29.02.2024')).toBe(true);
    expect(validate.date('12.04')).toMatch(/дд\.мм\.гггг/);
  });
  it('тексты ошибок без точки в конце', () => {
    for (const fn of Object.values(validate)) expect((fn as (v: string) => string)('')).not.toMatch(/\.$/);
  });
  it('errorSummary как в плашке футера', () => {
    expect(errorSummary(['org'])).toBe('Заполните поле «Организация». Остальное уже сохранено');
    expect(errorSummary(['snils', 'email'])).toBe('Проверьте поля «СНИЛС» и «Электронная почта». Остальное уже сохранено');
    expect(errorSummary(['fio', 'snils', 'email', 'inn'])).toBe('Проверьте поля «ФИО», «СНИЛС», «Электронная почта» и ещё 1. Остальное уже сохранено');
    expect(errorSummary(['org', 'x1'])).toBe('Проверьте поля «Организация» и ещё 1. Остальное уже сохранено');
    expect(errorSummary(['x1', 'x2'])).toBe('Проверьте поля, отмеченные красным: 2 поля требуют внимания. Остальное уже сохранено');
  });
  it('collectErrors отдаёт первое поле по порядку', () => {
    expect(collectErrors({ fio: '', phone: 'x', email: 'y' }).first).toBe('phone');
  });
});

describe('format', () => {
  it('plural и years', () => {
    expect(plural(1, 'банк', 'банка', 'банков')).toBe('банк');
    expect(plural(3, 'банк', 'банка', 'банков')).toBe('банка');
    expect(plural(11, 'банк', 'банка', 'банков')).toBe('банков');
    expect(years(21)).toBe('21 год');
    expect(years(25)).toBe('25 лет');
  });
  it('rub, pct, annuity', () => {
    expect(rub(6000000).replace(/\s/g, ' ')).toBe('6 000 000 ₽');
    expect(pct(18.95)).toBe('18,95%');
    expect(Math.round(annuity(6_000_000, 18.6, 25))).toBe(93931);
  });
});

describe('cn', () => {
  it('текстовый стиль не вытесняет цвет текста', () => {
    expect(cn('text-h1 text-text-secondary')).toBe('text-h1 text-text-secondary');
    expect(cn('text-h1', 'text-h2')).toBe('text-h2');
  });
});
