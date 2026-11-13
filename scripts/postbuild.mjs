// Кладёт в dist файлы, которые Vite в режиме библиотеки встраивает или не копирует:
// шрифты отдельными файлами (а не base64 в CSS), токены в CSS/JSON и тему Tailwind.
import { cpSync, readFileSync, writeFileSync, mkdirSync } from 'node:fs';
const r = (p) => new URL('../' + p, import.meta.url);
mkdirSync(r('dist/fonts'), { recursive: true });
cpSync(r('src/fonts'), r('dist/fonts'), { recursive: true });
writeFileSync(r('dist/fonts.css'), readFileSync(r('src/styles/fonts.css'), 'utf8').replaceAll('../fonts/', './fonts/'));
cpSync(r('src/styles/tokens.css'), r('dist/tokens.css'));
cpSync(r('src/styles/theme.css'), r('dist/theme.css'));
cpSync(r('tokens/figma-tokens.json'), r('dist/tokens.json'));
const css = readFileSync(r('dist/styles.css'), 'utf8');
if (!css.startsWith('@import "./fonts.css"')) writeFileSync(r('dist/styles.css'), '@import "./fonts.css";\n' + css);
console.log('postbuild: шрифты, токены и тема скопированы в dist');
