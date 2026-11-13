// Аудит: сравнение вычисленных стилей элементов прототипа флоу Б и компонентов в Storybook.
// node audit/compare.cjs  → audit/report.json
const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const PROTO = 'file://' + path.resolve(__dirname, '../../smoke/local-b.html');
const SB = (id) => `http://localhost:6107/iframe.html?id=${encodeURIComponent(id)}&viewMode=story`;
const PROPS = ['fontSize', 'fontWeight', 'lineHeight', 'color', 'backgroundColor', 'borderTopWidth', 'borderTopColor', 'borderTopLeftRadius',
  'paddingTop', 'paddingRight', 'paddingBottom', 'paddingLeft', 'height', 'columnGap', 'boxShadow'];

// [название, экран прототипа, селектор/функция в прототипе, история, функция в Storybook, список свойств (опц.)]
const q = (sel) => `document.querySelector(${JSON.stringify(sel)})`;
const PAIRS = [
  ['Button primary M', 'podbor', q('.bottom .btn.primary'), 'компоненты-button--всесостояния', `[...document.querySelectorAll('button')].find(b=>b.textContent.trim()==='Продолжить')`],
  ['Button outline M', 'podbor', q('.bottom .btn.outline'), 'компоненты-button--всесостояния', `[...document.querySelectorAll('button')].find(b=>b.textContent.includes('Отправить предложение на почту'))`],
  ['Button outline S', 'podbor', q('.bank .btn.outline.s'), 'паттерны-флоу-банки-и-параметры--подбор', `[...document.querySelectorAll('button')].find(b=>b.textContent.trim()==='Подробнее')`],
  ['Button sm «Прескоринг»', 'podbor', q('.flow-row .btn'), 'компоненты-каркас-страницы--страница', `[...document.querySelectorAll('button')].find(b=>b.textContent.trim()==='Прескоринг')`],
  ['Link «Изменить»', 'signing', q('.sum-row .link'), 'паттерны-флоу-банки-и-параметры--сводка', `[...document.querySelectorAll('button')].find(b=>b.textContent.trim()==='Изменить')`],
  ['Ghost-link «Сброс фильтров»', 'podbor', q('.ghost-link'), 'компоненты-button--всесостояния', `[...document.querySelectorAll('button')].find(b=>b.textContent.includes('Сброс фильтров'))`],
  ['Field (заполнено)', 'personal', `[...document.querySelectorAll('.field')].find(f=>f.querySelector('input')&&f.querySelector('input').value)`, 'компоненты-поля-ввода--состояния-input', `[...document.querySelectorAll('input')].find(i=>i.value==='Введите значение').closest('[class*="group/field"]')`],
  ['Field · подпись', 'personal', `[...document.querySelectorAll('.field')].find(f=>f.querySelector('input')&&f.querySelector('input').value).querySelector('.lab')`, 'компоненты-поля-ввода--состояния-input', `[...document.querySelectorAll('input')].find(i=>i.value==='Введите значение').closest('[class*="group/field"]').querySelector('label')`],
  ['Field · значение', 'personal', `[...document.querySelectorAll('.field input')].find(i=>i.value)`, 'компоненты-поля-ввода--состояния-input', `[...document.querySelectorAll('input')].find(i=>i.value==='Введите значение')`],
  ['Field · подсказка', 'personal', q('.helper'), 'компоненты-поля-ввода--состояния-input', `[...document.querySelectorAll('p')].find(p=>p.textContent==='Короткая подсказка под полем')`],
  ['Select', 'family', q('.field.select'), 'компоненты-поля-ввода--списки', `document.querySelector('[role=combobox]')`],
  ['Select · значение', 'family', q('.field.select .val'), 'компоненты-поля-ввода--списки', `document.querySelector('[id$="-val"]')`],
  ['Checkbox', 'deals', q('.cb'), 'компоненты-выбор-и-степперы--чекбоксы', `document.querySelector('label span[aria-hidden]')`],
  ['Checkbox · подпись', 'deals', q('.cb-row > span:last-child'), 'компоненты-выбор-и-степперы--чекбоксы', `document.querySelector('label span[aria-hidden]').nextElementSibling`],
  ['Switch · дорожка', 'personal', q('.switch .t'), 'компоненты-выбор-и-степперы--переключатели', `document.querySelector('[role=switch] > span')`],
  ['Switch · подпись', 'personal', q('.switch > span:last-child'), 'компоненты-выбор-и-степперы--переключатели', `document.querySelector('[role=switch] > span:last-child')`],
  ['Switch · пояснение', 'personal', q('.sw-wrap .helper'), 'компоненты-выбор-и-степперы--переключатели', `document.querySelector('[role=switch]').parentElement.querySelector('p') || [...document.querySelectorAll('p')].find(p=>p.textContent.startsWith('Ранее паспорт'))`],
  ['Chip active', 'podbor', q('.chip.active'), 'компоненты-вкладки-и-фильтры--чипы', `document.querySelectorAll('#storybook-root button')[1]`],
  ['Chip · подпись', 'podbor', q('.chip.active .l'), 'компоненты-вкладки-и-фильтры--чипы', `document.querySelectorAll('#storybook-root button')[1].querySelector('span')`],
  ['Badge accent', 'deals', q('.badge.accent'), 'паттерны-флоу-статусы-письма-заявки--заявки', `[...document.querySelectorAll('span')].find(s=>/^\\d+ заяв/.test(s.textContent))`],
  ['Avatar', 'podbor', q('.bank .avatar'), 'паттерны-флоу-банки-и-параметры--подбор', `[...document.querySelectorAll('article')].find(a=>a.getAttribute('aria-label')==='Уралсиб').querySelector('span')`],
  ['Alert info', 'personal', q('.alert'), 'компоненты-сообщения-окна-файлы--алерты', `document.querySelector('[role=status]')`],
  ['Alert · заголовок', 'personal', q('.alert b'), 'компоненты-сообщения-окна-файлы--алерты', `document.querySelector('[role=status] p')`],
  ['Alert · текст', 'personal', q('.alert span'), 'компоненты-сообщения-окна-файлы--алерты', `document.querySelector('[role=status] p').nextElementSibling`],
  ['Upload zone', 'personal', q('.upz'), 'компоненты-сообщения-окна-файлы--файлы', `[...document.querySelectorAll('button')].find(b=>b.textContent.includes('Выбрать файл'))`],
  ['File item', 'personal', q('.file'), 'компоненты-сообщения-окна-файлы--файлы', `[...document.querySelectorAll('span')].find(s=>s.textContent==='Паспорт.jpg').closest('div.border')`],
  ['File · плитка', 'personal', q('.file .fmt'), 'компоненты-сообщения-окна-файлы--файлы', `[...document.querySelectorAll('span')].find(s=>s.textContent==='Паспорт.jpg').closest('div.border').firstElementChild`],
  ['Bank row', 'podbor', q('.bank:not(.sel):not(.sent):not(.dis)'), 'паттерны-флоу-банки-и-параметры--подбор', `[...document.querySelectorAll('article')].find(a=>a.getAttribute('aria-label')==='Уралсиб')`],
  ['Bank · название', 'podbor', q('.bank-id b'), 'паттерны-флоу-банки-и-параметры--подбор', `[...document.querySelectorAll('article')].find(a=>a.getAttribute('aria-label')==='Уралсиб').querySelector('b')`],
  ['Bank · программа', 'podbor', q('.bank-id small'), 'паттерны-флоу-банки-и-параметры--подбор', `[...document.querySelectorAll('article')].find(a=>a.getAttribute('aria-label')==='Уралсиб').querySelector('small')`],
  ['Metric · значение', 'podbor', q('.metric b'), 'паттерны-флоу-банки-и-параметры--подбор', `[...document.querySelectorAll('article')].find(a=>a.getAttribute('aria-label')==='Уралсиб').querySelectorAll('b')[1]`],
  ['Metric · подпись', 'podbor', q('.metric span'), 'паттерны-флоу-банки-и-параметры--подбор', `[...document.querySelectorAll('article')].find(a=>a.getAttribute('aria-label')==='Уралсиб').querySelectorAll('b')[1].previousElementSibling`],
  ['Side card (Выбранные банки)', 'podbor', q('.side .side-card'), 'паттерны-флоу-банки-и-параметры--подбор', `[...document.querySelectorAll('section')].find(s=>s.textContent.startsWith('Выбранные банки'))`],
  ['Side card · заголовок', 'podbor', q('.side .side-card h4'), 'паттерны-флоу-банки-и-параметры--подбор', `[...document.querySelectorAll('h2')].find(h=>h.textContent==='Выбранные банки')`],
  ['Picked · банк', 'podbor', q('.pk b'), 'паттерны-флоу-банки-и-параметры--подбор', `[...document.querySelectorAll('section')].find(s=>s.textContent.startsWith('Выбранные банки')).querySelector('li b')`],
  ['Step current', 'personal', q('.step.cur'), 'компоненты-каркас-страницы--шаги', `document.querySelector('nav [aria-current=step]')`],
  ['Step · номер (закрыт)', 'personal', q('.step.locked .n'), 'компоненты-каркас-страницы--шаги', `document.querySelector('nav [aria-disabled] span')`],
  ['Help card', 'personal', q('.side-card.blue'), 'компоненты-каркас-страницы--шаги', `[...document.querySelectorAll('section')].find(s=>s.textContent.includes('Помощь по ипотеке'))`],
  ['Bottom bar', 'personal', q('.bottom .bar'), 'компоненты-каркас-страницы--футер', `document.querySelector('#storybook-root .sticky > div > div')`],
  ['Header', 'deals', q('.header .wrap'), 'компоненты-каркас-страницы--шапка', `document.querySelector('header > div')`],
  ['Header · логотип', 'deals', q('.logo'), 'компоненты-каркас-страницы--шапка', `[...document.querySelectorAll('a')].find(a=>a.textContent==='сделка.рф')`],
  ['Header · организация', 'deals', q('.org-name b'), 'компоненты-каркас-страницы--шапка', `[...document.querySelectorAll('button')].find(b=>b.textContent.includes('ООО'))`],
  ['Flow head · H1', 'personal', q('.flow-title h1'), 'компоненты-каркас-страницы--страница', `document.querySelector('#storybook-root h1')`],
  ['Flow head · назад', 'personal', q('.flow-head .back'), 'компоненты-каркас-страницы--страница', `[...document.querySelectorAll('a')].find(a=>a.textContent.includes('Ипотечные заявки'))`],
  ['LineTab active', 'deals', q('.linetabs button.on'), 'компоненты-вкладки-и-фильтры--вкладки', `document.querySelector('[role=tab][aria-selected=true]')`],
  ['TextTab active', 'podbor', q('.ftabs button.on'), 'компоненты-вкладки-и-фильтры--вкладки', `document.querySelectorAll('[role=tablist]')[1].querySelector('[aria-selected=true]')`],
  ['Search', 'podbor', q('.search'), 'паттерны-флоу-банки-и-параметры--подбор', `document.querySelector('input[type=search]').parentElement`],
  ['Card (участники)', 'personal', q('main .card'), 'экраны-сборка-из-библиотеки--персональные', `document.querySelector('main section')`],
  ['Card · H2', 'personal', q('main .card h2'), 'экраны-сборка-из-библиотеки--персональные', `document.querySelector('main section h2')`],
  ['Card анкеты (pad32)', 'personal', q('main .card.pad32'), 'экраны-сборка-из-библиотеки--персональные', `document.querySelectorAll('main section')[1]`],
  ['Заголовок раздела (h1.sec)', 'income', q('main .card.pad32 h2, main .card.pad32 h1'), 'экраны-сборка-из-библиотеки--доход', `document.querySelector('main section h2')`],
  ['Inset (место работы)', 'income', q('.inset-white'), 'экраны-сборка-из-библиотеки--доход', `[...document.querySelectorAll('h3')].find(h=>h.textContent==='Основное место работы').closest('div.border')`],
  ['Upload · иконка-плитка', 'personal', q('.upz .icon-tile'), 'экраны-сборка-из-библиотеки--персональные', `[...document.querySelectorAll('button')].find(b=>b.textContent.includes('Выбрать файл')).firstElementChild`],
  ['Signer (участник подписания)', 'signing', q('.participant'), 'экраны-сборка-из-библиотеки--подписание', `[...document.querySelectorAll('h3')].find(h=>h.textContent==='Иванов Иван Иванович').closest('div.border')`],
  ['Participant', 'personal', q('.part'), 'паттерны-флоу-прескоринг--участники', `document.querySelector('article')`],
  ['Participant · имя', 'personal', q('.part .tx b'), 'паттерны-флоу-прескоринг--участники', `document.querySelector('article b')`],
  ['Stepper · кнопка', 'income', q('.field.stepper .stp button:not(:disabled)'), 'компоненты-выбор-и-степперы--степперы', `[...document.querySelectorAll('button')].find(b=>b.getAttribute('aria-label')==='Увеличить')`],
  ['Summary row', 'signing', q('.sum-row'), 'паттерны-флоу-банки-и-параметры--сводка', `document.querySelector('[role=img][aria-label="Заполнено"]').parentElement`],
  ['Summary · пояснение', 'signing', q('.sum-row small'), 'паттерны-флоу-банки-и-параметры--сводка', `document.querySelector('[role=img][aria-label="Заполнено"]').parentElement.querySelector('small')`],
  ['Deals · th', 'deals', q('.deals-t th'), 'паттерны-флоу-статусы-письма-заявки--заявки', `document.querySelector('#storybook-root th')`],
  ['Deals · td', 'deals', q('.deals-t td:nth-child(2)'), 'паттерны-флоу-статусы-письма-заявки--заявки', `document.querySelector('#storybook-root tbody td:nth-child(2)')`],
  ['Segmented tabs', 'signing', q('.segtabs'), 'компоненты-вкладки-и-фильтры--вкладки', `document.querySelectorAll('[role=tablist]')[2]`],
  ['Segmented · активная', 'signing', q('.segtabs button.on'), 'компоненты-вкладки-и-фильтры--вкладки', `document.querySelectorAll('[role=tablist]')[2].querySelector('[aria-selected=true]')`],
  ['Bank pick (выбран)', 'status', q('.bank-pick.on'), 'паттерны-флоу-статусы-письма-заявки--статусы', `document.querySelector('aside article')`],
  ['Mail', 'status', q('.mail'), 'паттерны-флоу-статусы-письма-заявки--статусы', `[...document.querySelectorAll('article')].find(a=>a.textContent.includes('Письмо с заявкой'))`],
];

const SCREENS = { deals: null, podbor: '1.0 Подбор условий', personal: '1.1 Персональные данные', family: '1.2 Семейное положение', income: '1.3 Доход и работа', signing: '1.4 Подписание и отправка', status: '1.5 Статус в банках' };

(async () => {
  const b = await chromium.launch();
  const proto = await b.newPage({ viewport: { width: 1280, height: 900 } });
  const sb = await b.newPage({ viewport: { width: 1280, height: 900 } });
  const grab = (page, expr) => page.evaluate(({ expr, props }) => {
    let el; try { el = eval(expr); } catch (e) { return { error: String(e) }; }
    if (!el) return { error: 'не найден' };
    const cs = getComputedStyle(el); const o = {};
    for (const p of props) o[p] = cs[p];
    o.height = Math.round(el.getBoundingClientRect().height) + 'px';
    return o;
  }, { expr, props: PROPS });
  const out = []; let cur = '';
  for (const [name, screen, pexpr, story, sexpr] of PAIRS) {
    if (screen !== cur) {
      await proto.goto(PROTO + '#'); await proto.waitForTimeout(500);
      if (SCREENS[screen]) { await proto.getByRole('button', { name: 'Экраны прототипа' }).click(); await proto.getByText(SCREENS[screen], { exact: true }).click(); await proto.waitForTimeout(900); }
      cur = screen;
    }
    await sb.goto(SB(story)); await sb.waitForTimeout(600);
    const a = await grab(proto, pexpr), c = await grab(sb, sexpr);
    out.push({ name, proto: a, lib: c });
  }
  fs.writeFileSync(path.join(__dirname, 'report.json'), JSON.stringify(out, null, 1));
  // краткий вывод расхождений
  const num = (v) => parseFloat(v);
  for (const r of out) {
    if (r.proto.error || r.lib.error) { console.log(`✗ ${r.name}: прототип ${r.proto.error || 'ok'} / библиотека ${r.lib.error || 'ok'}`); continue; }
    const diffs = [];
    for (const k of [...PROPS, 'height']) {
      const x = r.proto[k], y = r.lib[k];
      if (x === y) continue;
      if (!isNaN(num(x)) && !isNaN(num(y)) && /px$/.test(x) && Math.abs(num(x) - num(y)) <= 0.6) continue;
      if (k === 'lineHeight' && (x === 'normal' || y === 'normal')) { diffs.push(`${k}: ${x} → ${y}`); continue; }
      if (k === 'borderTopColor' && num(r.proto.borderTopWidth) === 0 && num(r.lib.borderTopWidth) === 0) continue;
      diffs.push(`${k}: ${x} → ${y}`);
    }
    console.log((diffs.length ? '△ ' : '✓ ') + r.name + (diffs.length ? '\n    ' + diffs.join('\n    ') : ''));
  }
  await b.close();
})();
