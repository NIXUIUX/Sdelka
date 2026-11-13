import { describe, it, expect } from 'vitest';
import icons from '../../icons/icons.json';

/* Регрессия: при переносе путей из прототипа «m6 9 6 6» превращали в «M6 9 6 6» — неявные координаты
   после абсолютного M становятся абсолютными L, иконка ломается. Допускаем только иконки, где так задумано в исходнике. */
const ABSOLUTE_OK = new Set(['x', 'check', 'check-check']);

describe('icons.json', () => {
  it('после M нет неявных относительных координат', () => {
    const bad = Object.entries(icons as Record<string, string>)
      .filter(([k]) => !k.startsWith('$') && !ABSOLUTE_OK.has(k))
      .filter(([, d]) => /M-?[\d.]+[ ,]-?[\d.]+(?:[ ,]-?\d|-\d)/.test(d))
      .map(([k]) => k);
    expect(bad).toEqual([]);
  });
});
