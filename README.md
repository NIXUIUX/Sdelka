# @sdelka/ui

Библиотека интерфейса Сделка.рф «Мягко»: токены, типографика, иконки, компоненты и паттерны ипотечного флоу.
Источник правды — кликабельный прототип флоу Б; Figma «Мягко» отстаёт в части мест (см. docs/figma-vs-prototype.md).

## Стек
React 18/19 · TypeScript · Vite (режим библиотеки) · Tailwind CSS v4 · Storybook · Vitest

## Подключение в проект

```bash
npm i @sdelka/ui
```

Требования: React 18 или 19, сборщик с поддержкой ESM (Vite, Webpack 5, Next.js).

```tsx
import '@sdelka/ui/styles.css';      // шрифт Geist, токены, стили компонентов — один раз в корне приложения
import { Button, Input, Card, PageLayout } from '@sdelka/ui';
```
Если проект на Tailwind v4 — подключите тему, чтобы использовать те же токены в своей вёрстке:
```css
@import "tailwindcss";
@import "@sdelka/ui/theme.css";   /* bg-action-primary, rounded-14, text-h1, shadow-pop … */
```
Без Tailwind: `@sdelka/ui/tokens.css` — CSS-переменные (`var(--color-action-primary)`) и классы текстовых стилей (`.text-h1`).
Значения токенов для JS: `import { tokens } from '@sdelka/ui'` или `@sdelka/ui/tokens.json`.

Витрина компонентов и готовые экраны: https://nixuiux.github.io/Sdelka/ · Изменения по версиям — [CHANGELOG.md](CHANGELOG.md)

## Что внутри
| Раздел | Где |
|---|---|
| Токены и типографика | `tokens/figma-tokens.json` → `npm run tokens` |
| Иконки: 37 шт. | `<Icon name="chevron-down" size={16} />` |
| Маски, валидаторы, форматирование | `masks`, `validate`, `errorSummary`, `focusFirstError`, `rub`, `annuity` |
| Компоненты (поля, кнопки, вкладки, окна, файлы, каркас страницы) | `src/components` |
| Паттерны флоу (банки, прескоринг, статусы, подписание, клиент) | `src/patterns` |
| Экраны, собранные только из библиотеки | Storybook → «Экраны» |

## Правила (из прототипа)
- На экране одна основная (Primary) кнопка — в футере
- Футер: без скролла — карточка в 24px от низа; со скроллом — прибит к краю, без нижних скруглений, с тенью
- Поля с маской не принимают лишние символы; в пустом поле при фокусе виден формат
- Ошибка поля — красная граница и текст с иконкой под полем; при отправке — переход к первому полю с ошибкой и названия полей в плашке
- Ховер на всех кликабельных элементах, фокус-обводка только с клавиатуры
- Редполитика: без точки в заголовках и в конце фраз интерфейса

## Команды
| Команда | Что делает |
|---|---|
| `npm run storybook` | витрина компонентов на http://localhost:6006 |
| `npm test` | тесты утилит и компонентов |
| `npm run build` | сборка пакета в `dist` |
| `npm run tokens` / `npm run icons` | пересобрать токены и иконки из выгрузки Figma |

## Выпуск версии
1. Опишите изменения в `CHANGELOG.md` под заголовком новой версии (`## 0.2.0 — дата`)
2. `npm run release -- minor` (или `patch` / `major`) — поднимет версию, сделает коммит и тег
3. `git push --follow-tags` — GitHub Actions проверит, опубликует пакет и создаст релиз

## Обновление токенов из Figma
1. Выгрузить переменные коллекции «Мягко · Токены» в `tokens/figma-tokens.json` (имя, значение, CSS-имя из Code syntax)
2. `npm run tokens` — пересоберутся `tokens.css`, `theme.css`, `tokens.ts`
3. Проверить Storybook → «Основа / Токены»
