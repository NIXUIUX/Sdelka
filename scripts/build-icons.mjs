// Генерирует src/icons/icons.generated.ts из icons/icons.json (пути SVG как в Figma «Icon / *»).
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
const src = JSON.parse(readFileSync(new URL('../icons/icons.json', import.meta.url)));
delete src.$source;
const names = Object.keys(src).sort();
const out =
  '// Сгенерировано scripts/build-icons.mjs из icons/icons.json — не редактировать вручную\n' +
  `export const iconPaths = ${JSON.stringify(Object.fromEntries(names.map((n) => [n, src[n]])), null, 2)} as const;\n\n` +
  'export type IconName = keyof typeof iconPaths;\n';
mkdirSync(new URL('../src/icons/', import.meta.url), { recursive: true });
writeFileSync(new URL('../src/icons/icons.generated.ts', import.meta.url), out);
console.log(`icons: ${names.length}`);
