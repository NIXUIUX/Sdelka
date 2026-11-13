// Генерирует из tokens/figma-tokens.json:
//   src/styles/tokens.css — CSS-переменные и текстовые классы (работают без Tailwind)
//   src/styles/theme.css  — тема Tailwind v4 (@theme + @utility) с теми же значениями
//   src/tokens.ts         — типизированные константы для JS/TS
// Источник правды — Figma. Не правьте сгенерированные файлы руками: обновите JSON и запустите `npm run tokens`.
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';

const src = JSON.parse(readFileSync(new URL('../tokens/figma-tokens.json', import.meta.url)));
const HEAD = '/* Сгенерировано scripts/build-tokens.mjs из tokens/figma-tokens.json — не редактировать вручную */\n';

const px = (v) => (typeof v === 'number' ? `${v}px` : v);
const vars = Object.entries(src.variables).map(([name, t]) => ({ name, css: t.css, value: px(t.value), type: t.type }));

// Имена текстовых стилей Figma → классы
const slug = (n) =>
  ({
    'Heading/H1': 'h1', 'Heading/H2': 'h2', 'Heading/H3': 'h3', 'Heading/Overline': 'overline',
    'Body/L': 'body-l', 'Body/M': 'body-m', 'Body/M Medium': 'body-m-medium', 'Body/S': 'body-s',
    'Caption/Regular': 'caption', 'Caption/Medium': 'caption-medium',
    'Button/M': 'button-m', 'Button/S': 'button-s', 'Numeric/L': 'num-l', 'Numeric/XL': 'num-xl',
    'Heading/H4': 'h4', 'Body/S Relaxed': 'body-s-relaxed', 'Caption/XS': 'caption-xs', 'Numeric/M': 'num-m',
  })[n];
const textRule = (t) =>
  [
    `font-family: var(--font-sans)`,
    `font-size: ${t.size}px`,
    `line-height: ${t.lineHeight}px`,
    `font-weight: ${t.weight}`,
    t.upper ? 'text-transform: uppercase' : null,
    t.letterSpacing ? `letter-spacing: ${t.letterSpacing / 100}em` : null,
    t.name.startsWith('Numeric') ? 'font-variant-numeric: tabular-nums' : null,
  ].filter(Boolean).join('; ');

const FONT = `"Geist", system-ui, -apple-system, "Segoe UI", Roboto, Arial, sans-serif`;

// 1) tokens.css
let css = HEAD + ':root {\n';
for (const v of vars) css += `  ${v.css}: ${v.value};\n`;
for (const e of src.effects) css += `  ${e.css}: ${e.value};\n`;
css += `  --font-sans: ${FONT};\n}\n\n`;
for (const t of src.text) css += `.text-${slug(t.name)} { ${textRule(t)}; }\n`;

// 2) theme.css (Tailwind v4)
let theme = HEAD + '@theme {\n  --font-sans: ' + FONT + ';\n  --spacing: 4px;\n';
for (const v of vars) {
  if (v.type === 'color') theme += `  ${v.css.startsWith('--color-') ? v.css : '--color-' + v.css.slice(2)}: ${v.value};\n`;
  else if (v.css.startsWith('--radius-')) theme += `  ${v.css}: ${v.value};\n`;
}
for (const e of src.effects) theme += `  ${e.css}: ${e.value};\n`;
theme += '}\n\n/* Текстовые стили Figma как утилиты: class="text-h1", "text-body-m" … */\n';
for (const t of src.text) theme += `@utility text-${slug(t.name)} { ${textRule(t)}; }\n`;

// 3) tokens.ts
const tree = {};
for (const [name, t] of Object.entries(src.variables)) {
  const parts = name.split('/');
  let node = tree;
  parts.slice(0, -1).forEach((p) => (node = node[p] ??= {}));
  node[parts.at(-1)] = { value: t.value, css: `var(${t.css})` };
}
const ts =
  '// Сгенерировано scripts/build-tokens.mjs — не редактировать вручную\n' +
  `export const tokens = ${JSON.stringify(tree, null, 2)} as const;\n\n` +
  `export const textStyles = ${JSON.stringify(Object.fromEntries(src.text.map((t) => [slug(t.name), { ...t, className: 'text-' + slug(t.name) }])), null, 2)} as const;\n\n` +
  'export type TextStyle = keyof typeof textStyles;\n';

mkdirSync(new URL('../src/styles/', import.meta.url), { recursive: true });
writeFileSync(new URL('../src/styles/tokens.css', import.meta.url), css);
writeFileSync(new URL('../src/styles/theme.css', import.meta.url), theme);
writeFileSync(new URL('../src/tokens.ts', import.meta.url), ts);
console.log(`tokens: ${vars.length} переменных, ${src.text.length} текстовых стилей, ${src.effects.length} тени`);
