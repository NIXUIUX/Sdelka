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
  phone: (v: string, msg: string = 'Нужен полный номер, 11 цифр — банк позвонит по нему, чтобы подтвердить заявку') => (digits(v).length === 11 ? '' : msg),
  email: (v: string) => (isEmail(v) ? '' : 'Проверьте адрес: на него придут уведомления по заявке и ответ банка'),
  date: (v: string, msg = 'Введите дату в формате дд.мм.гггг') => (isDate(v) ? '' : msg),
  snils: (v: string) => (digits(v).length === 11 ? '' : 'В СНИЛС 11 цифр. Его можно найти на лицевой стороне свидетельства или в Госуслугах'),
  inn10: (v: string) => (digits(v).length === 10 ? '' : 'У организации ИНН из 10 цифр. Его можно взять из справки или трудового договора'),
  inn12: (v: string) => (!v || digits(v).length === 12 ? '' : 'ИНН физлица — 12 цифр. Можно оставить поле пустым, если клиент его не знает'),
  passport: (v: string) => (digits(v).length === 10 ? '' : 'Серия и номер — 10 цифр с разворота паспорта'),
  divisionCode: (v: string) => (digits(v).length === 6 ? '' : 'Код подразделения — 6 цифр, например 690-014'),
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

/** Названия полей для плашки ошибок (прототип: FIELD_NAMES) — чтобы было понятно, что именно не заполнено */
export const FIELD_NAMES: Record<string, string> = {
  passport: 'Паспорт', fio: 'ФИО', birthDate: 'Дата рождения', birthPlace: 'Место рождения', passNum: 'Серия и номер', passDate: 'Когда выдан',
  passCode: 'Код подразделения', passWho: 'Кем выдан', regAddr: 'Адрес регистрации', phone: 'Номер телефона', snils: 'СНИЛС',
  email: 'Электронная почта', inn: 'ИНН физлица', factAddr: 'Фактический адрес', income: 'Основной доход', org: 'Организация',
  orgInn: 'ИНН организации', position: 'Должность', workPhone: 'Рабочий телефон', startDate: 'Дата начала работы', eduLevel: 'Образование',
  expYears: 'Общий трудовой стаж', jobs3: 'Мест работы за 3 года', exp5: 'Стаж за последние 5 лет', prevSer: 'Серия предыдущего паспорта',
  prevNo: 'Номер предыдущего паспорта', prevDate: 'Когда выдан предыдущий паспорт', monthsHere: 'Месяцев на текущем месте',
  level: 'Уровень образования', year: 'Год окончания', place: 'Учебное заведение',
};

/** Тексты ошибок полей — дословно из прототипа флоу Б. Без точки в конце */
export const MESSAGES = {
  fio: 'Укажите ФИО как в паспорте',
  clientName: 'Укажите фамилию и имя — так клиент поймёт, что предложение подготовлено для него',
  birthDate: 'Введите дату рождения в формате дд.мм.гггг',
  birthPlace: 'Укажите место рождения — как в паспорте',
  passport: 'Загрузите паспорт — по нему банк сверит личность, а мы заполним данные за вас',
  passNum: 'Серия и номер — 10 цифр с разворота паспорта',
  passSeries: 'Серия — 4 цифры',
  passNo: 'Номер — 6 цифр',
  passDate: 'Введите дату выдачи в формате дд.мм.гггг',
  passCode: 'Код подразделения — 6 цифр, например 690-014',
  passWho: 'Укажите, кем выдан паспорт',
  regAddr: 'Укажите адрес регистрации со страницы прописки',
  factAddr: 'Укажите, где клиент живёт сейчас — банк проверяет оба адреса',
  phone: 'Нужен полный номер, 11 цифр — банк позвонит по нему, чтобы подтвердить заявку',
  clientPhone: 'Номер нужен полностью, 11 цифр — по нему клиент получит ссылку на анкету',
  workPhone: 'Нужен рабочий номер полностью — банк может позвонить в отдел кадров для подтверждения',
  snils: 'В СНИЛС 11 цифр. Его можно найти на лицевой стороне свидетельства или в Госуслугах',
  email: 'Проверьте адрес: на него придут уведомления по заявке и ответ банка',
  clientEmail: 'Проверьте почту: на этот адрес придёт предложение, ошибка в одной букве — и письмо не дойдёт',
  inn: 'ИНН физлица — 12 цифр. Можно оставить поле пустым, если клиент его не знает',
  orgInn: 'У организации ИНН из 10 цифр. Его можно взять из справки или трудового договора',
  income: 'Укажите доход после вычета налогов — от него зависит, какую сумму одобрит банк',
  incomeMonthly: 'Укажите ежемесячный доход после вычета налогов',
  jobIncome: 'Укажите доход на этом месте после вычета налогов',
  org: 'Укажите работодателя так, как в трудовом договоре — банк проверит его по ИНН',
  jobOrg: 'Укажите организацию — как в договоре',
  position: 'Укажите должность — банк учитывает её при оценке стабильности дохода',
  jobPosition: 'Укажите должность или вид работ',
  startDate: 'Введите дату начала в формате дд.мм.гггг',
  startDateHere: 'Введите дату в формате дд.мм.гггг — по ней считается стаж на текущем месте',
  monthsHere: 'Укажите, сколько месяцев клиент работает на текущем месте',
  expYears: 'Укажите общий стаж — можно 0, если клиент только начал работать',
  jobs3: 'Укажите хотя бы одно место работы за последние 3 года',
  exp5: 'Выберите стаж за последние 5 лет',
  eduLevel: 'Выберите уровень образования',
  eduYear: 'Проверьте год окончания',
  eduPlace: 'Укажите учебное заведение — как в дипломе',
  price: 'Минимальная стоимость — 500 000 ₽. Проверьте сумму: банки не выдают ипотеку на меньшие объекты',
  signAgree: 'Отметьте, что клиент ознакомился с документами — это обязательное условие банка',
  signDrawn: 'Нужна подпись клиента в поле ниже',
  signPaper: 'Загрузите сканы подписанных анкеты и согласия — без них банк не примет заявку',
  clientDocs: 'Добавьте хотя бы один документ — паспорт или СНИЛС. Остальное можно дослать позже по этой же ссылке',
  date: 'Введите дату в формате дд.мм.гггг',
} as const;

/** Заголовок плашки над футером, когда шаг не проходит проверку */
export const ERROR_ALERT_TITLE = 'Чтобы перейти дальше, заполните недостающие данные';

const listRu = (a: string[]) => (a.length < 2 ? a[0]! : `${a.slice(0, -1).join(', ')} и ${a[a.length - 1]}`);

/**
 * Текст плашки ошибок — как в прототипе (firstErrAlert):
 * «Заполните поле «X». Остальное уже сохранено» · «Проверьте поля «X», «Y» и «Z»…» · «… и ещё N» ·
 * без названий — «Проверьте поля, отмеченные красным: 2 поля требуют внимания».
 * `keys` — ключи полей с ошибкой (имена берутся из FIELD_NAMES или `names`).
 */
export function errorSummary(keys: string[], names: Record<string, string> = FIELD_NAMES): string {
  if (!keys.length) return '';
  const raw = keys.map((k) => names[k] ?? null);
  const named = [...new Set(raw.filter((x): x is string => !!x))].map((n) => `«${n}»`);
  const shown = named.slice(0, 3);
  const rest = named.length - shown.length + raw.filter((x) => !x).length;
  const n = keys.length;
  const txt = !shown.length
    ? `Проверьте поля, отмеченные красным: ${n} ${n % 10 === 1 && n % 100 !== 11 ? 'поле требует' : n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 10 || n % 100 >= 20) ? 'поля требуют' : 'полей требуют'} внимания`
    : named.length === 1 && rest === 0 ? `Заполните поле ${shown[0]}`
    : `Проверьте ${rest > 0 ? `поля ${shown.join(', ')} и ещё ${rest}` : `поля ${listRu(shown)}`}`;
  return `${txt}. Остальное уже сохранено`;
}

/**
 * Якорь к первой ошибке (прототип: toFirstErr): прокручивает к самому верхнему полю с ошибкой и ставит в него фокус.
 * Ищет внутри открытого окна, иначе в <main>. Вызывайте после отрисовки ошибок: setTimeout(focusFirstError, 40).
 */
export function focusFirstError(root?: ParentNode): void {
  const scope = root ?? document.querySelector('[role=dialog][aria-modal=true]') ?? document.querySelector('main') ?? document;
  const el = scope.querySelector<HTMLElement>('[aria-invalid=true], [role=alert]');
  if (!el) return;
  el.scrollIntoView?.({ block: 'center', behavior: 'smooth' });
  const target = el.matches('input, textarea, button, select') ? el : el.closest('div')?.querySelector<HTMLElement>('input, textarea, button');
  target?.focus({ preventScroll: true });
}
