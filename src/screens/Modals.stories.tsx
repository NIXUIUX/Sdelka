import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { Select } from '../components/Select';
import { Alert } from '../components/Alert';
import { Checkbox } from '../components/Checkbox';
import { Inset, Hint, LoadingState, IconTile } from '../components/Surface';
import { SegmentedTabs, ChoiceGroup } from '../components/Tabs';
import { UploadZone, FileItem } from '../components/Upload';
import { BankFacts, BankLimits, IconList, MailPreview, OfferLetter } from '../patterns/Extra';
import { Participant, ScoreCard, SignalGrid, SignalTile, ReportGrid, ReportSection } from '../patterns/Prescoring';
import { BROKER, ModalScene } from './kit';

const meta: Meta = { title: 'Экраны/Сценарии/Окна', parameters: { layout: 'fullscreen' } };
export default meta;
type S = StoryObj;

/* ───────────── 1.0 Подбор условий — окна ───────────── */

function DomRf({ mode: m0 }: { mode: 'project' | 'cut' }) {
  const [mode, setMode] = useState(m0);
  const [cut, setCut] = useState<string | null>('1');
  return (
    <ModalScene title="Условия ставки ДОМ.РФ" subtitle="Субсидированная ставка по программе застройщика"
      actions={<><Button variant="outline">Отмена</Button><Button disabled={mode === 'project'}>Применить условия</Button></>}>
      <div className="flex flex-col gap-4">
        <SegmentedTabs aria-label="Тип условий" value={mode} onChange={setMode} items={[{ value: 'project', label: 'Проектное финансирование' }, { value: 'cut', label: 'Снижение ставки' }]} />
        {mode === 'project' ? (
          <>
            <Select label="Проект финансирования" options={['ЖК «Северный парк», корпус 3', 'ЖК «Речной», корпус 1']} value={null} placeholder="Не выбран" onChange={() => {}}
              helper="Выберите объект — ДОМ.РФ считает субсидированную ставку для конкретного корпуса застройщика" />
            <Hint>Условия субсидии согласуются с застройщиком. Итоговая ставка пересчитается после выбора</Hint>
          </>
        ) : (
          <div className="flex flex-col gap-3">
            <span className="text-body-m font-medium">Размер снижения</span>
            <ChoiceGroup aria-label="Размер снижения" value={cut} onChange={setCut}
              options={[{ value: '0.5', label: '0,5 п.п.' }, { value: '1', label: '1 п.п.' }, { value: '2', label: '2 п.п.' }, { value: '3', label: '3 п.п.' }]} />
          </div>
        )}
      </div>
    </ModalScene>
  );
}
export const ДомРфПроект: S = { name: '1.0 · Условия ДОМ.РФ · проектное финансирование', render: () => <DomRf mode="project" /> };
export const ДомРфСнижение: S = { name: '1.0 · Условия ДОМ.РФ · снижение ставки', render: () => <DomRf mode="cut" /> };

export const КарточкаБанка: S = {
  name: '1.0 · Карточка банка',
  render: () => (
    <ModalScene size="l" title="МКБ" subtitle="Стандартная ипотека · карточка банка из списка предложений"
      actions={<><Button variant="outline">Закрыть</Button><Button>Выбрать банк</Button></>}>
      <div className="flex flex-col gap-5">
        <BankFacts note="Окончательные условия банк определит после рассмотрения заявки" items={[
          { label: 'Расчётная ставка', value: '18,95%', accent: true }, { label: 'Платёж в месяц · 25 лет', value: '95 619 ₽' },
          { label: 'Сумма кредита', value: '6 000 000 ₽' }, { label: 'Рекомендуемый доход', value: '159 365 ₽' },
        ]} />
        <BankLimits items={[{ label: 'Первоначальный взнос', value: 'от 20%' }, { label: 'Максимальный срок', value: '30 лет' }, { label: 'Максимальная сумма', value: '30 000 000 ₽' }]} />
        <div className="grid grid-cols-2 gap-6 max-[640px]:grid-cols-1">
          <IconList title="Требования к заёмщику" groups={[{ items: ['Возраст от 21 года до 75 лет на дату погашения', 'Гражданство РФ', 'Стаж на текущем месте от 3 месяцев', 'Общий стаж от 1 года за последние 5 лет'] }]} />
          <IconList kind="doc" title="Необходимые документы" groups={[{ items: ['Паспорт РФ', 'СНИЛС', 'Справка о доходах или выписка из СФР', 'Договор долевого участия или купли-продажи', 'Отчёт об оценке объекта', 'Выписка из ЕГРН'] }]} />
        </div>
      </div>
    </ModalScene>
  ),
};

function Offer({ errors }: { errors?: boolean }) {
  const v = errors
    ? { name: 'Иванов', phone: '+7 (900) 123-45', email: 'ivanov@examle' }
    : { name: 'Иванов Иван Иванович', phone: '+7 (900) 123-45-67', email: 'ivanov@example.com' };
  const first = v.name.trim().split(/\s+/)[1];
  return (
    <ModalScene size="l" title="Предложение для клиента" subtitle="Заполните контакты — клиент получит предварительный расчёт на почту"
      actions={<div className="flex w-full flex-wrap gap-3"><Button variant="outline">Сохранить в PDF</Button><Button>Отправить предложение на почту</Button></div>}>
      <div className="flex flex-col gap-5">
        <div className="grid grid-cols-2 gap-4 max-[640px]:grid-cols-1">
          <Input label="ФИО клиента" defaultValue={v.name} mask="name" helper="Как в паспорте"
            error={errors ? 'Укажите фамилию и имя — так клиент поймёт, что предложение подготовлено для него' : undefined} />
          <Input label="Мобильный телефон" defaultValue={v.phone} mask="phone" helper="Для связи по заявке"
            error={errors ? 'Номер нужен полностью, 11 цифр — по нему клиент получит ссылку на анкету' : undefined} />
          <Input label="Электронная почта" defaultValue={v.email} mask="email" helper="Сюда придёт предложение"
            error={errors ? 'Проверьте почту: на этот адрес придёт предложение, ошибка в одной букве — и письмо не дойдёт' : undefined} />
        </div>
        <MailPreview to={v.email || 'почта клиента'} subject="Ипотечное предложение по вашей заявке">
          <OfferLetter firstName={first} requestLabel="Заявка № BD2A6E33 · 14.11.2026" program="Стандартная ипотека · г. Москва"
            params={[{ label: 'Стоимость', value: '10 000 000 ₽' }, { label: 'Взнос', value: '4 000 000 ₽' }, { label: 'Кредит', value: '6 000 000 ₽' }, { label: 'Срок', value: '25 лет' }]}
            banks={[{ bank: 'Абсолют Банк', rate: '18,95%', payment: '95 619 ₽', income: '159 365 ₽' }]} manager={BROKER} />
        </MailPreview>
      </div>
    </ModalScene>
  );
}
export const Предложение: S = { name: '1.0 · Предложение для клиента', render: () => <Offer /> };
export const ПредложениеОшибки: S = { name: '1.0 · Предложение — ошибки', render: () => <Offer errors /> };

/* ───────────── Прескоринг ───────────── */

const PRE = { title: 'Прескоринг участников', subtitle: 'Предварительная оценка по данным бюро кредитных историй. На заявку в банк не влияет' };

function PreForm({ errors }: { errors?: boolean }) {
  const [agree, setAgree] = useState(!errors);
  return (
    <ModalScene {...PRE} actions={<><Button variant="outline">Отмена</Button><Button>Рассчитать рейтинг</Button></>}>
      <div className="flex flex-col gap-4">
        {errors && <Alert type="error" title="Проверьте данные участника">Без телефона, паспорта и согласия бюро не выдаст кредитную историю</Alert>}
        <Inset tone="outline" title={<>Заёмщик <span className="font-normal text-text-secondary">· Иванов Иван Иванович</span></>}>
          <Input label="Телефон" mask="phone" defaultValue={errors ? '+7 (900) 123' : '+7 (900) 123-45-67'}
            helper="На этот номер придёт код подтверждения согласия" error={errors ? 'Введите номер полностью' : undefined} />
          {errors
            ? <UploadZone title="Паспорт РФ · разворот с фото" error="Загрузите разворот паспорта с фото" onFiles={() => {}} />
            : <FileItem name="Паспорт.pdf" meta="1,8 МБ · загружен" onRemove={() => {}} />}
          <Checkbox label="Дал согласие на запрос кредитной истории" checked={agree} onChange={setAgree} error={errors && !agree}
            helper={errors && !agree ? <span className="text-error">Нужно согласие на запрос в БКИ</span> : undefined} />
        </Inset>
        <Button variant="outline" size="s" icon="plus" className="self-start">Добавить созаёмщика</Button>
      </div>
    </ModalScene>
  );
}
export const ПреВвод: S = { name: 'Прескоринг · ввод участников', render: () => <PreForm /> };
export const ПреОшибки: S = { name: 'Прескоринг · ошибки ввода', render: () => <PreForm errors /> };
export const ПреЗапрос: S = {
  name: 'Прескоринг · запрос в БКИ',
  render: () => <ModalScene {...PRE}><LoadingState title="Запрашиваем кредитную историю">Обычно это занимает несколько секунд</LoadingState></ModalScene>,
};

const Report = ({ score, name, role }: { score: number; name: string; role: string }) => (
  <div className="flex flex-col gap-5">
    <ScoreCard score={score} name={name} role={role} />
    <SignalGrid>
      <SignalTile label="Кредитная нагрузка" value="Низкая" />
      <SignalTile label="Просрочки" value="Нет" />
      <SignalTile label="Банкротство" value="Нет" />
      <SignalTile label="Активные кредиты" value="2" />
      <SignalTile label="Запросы за 30 дней" value="5 — много" state="warning" />
      <SignalTile label="Судебные дела" value="Нет" />
    </SignalGrid>
    <ReportGrid>
      <ReportSection title="Кредитная история" rows={[{ label: 'Активные кредиты', value: '2' }, { label: 'Ежемесячные платежи', value: '38 400 ₽' }]} />
      <ReportSection title="Платёжная дисциплина" rows={[{ label: 'Просрочки за 12 мес.', value: '1' }, { label: 'Запросы за 30 дней', value: '3', warning: true }]} />
    </ReportGrid>
  </div>
);
const doneActions = <><Button variant="outline" icon="refresh">Пересчитать</Button><Button>Готово</Button></>;

export const ПреОдин: S = {
  name: 'Прескоринг · результат, один участник',
  render: () => (
    <ModalScene size="l" title={PRE.title} subtitle="Предварительная оценка по данным БКИ от 13.11.2026" actions={doneActions}>
      <Report score={902} name="Иванов Иван Иванович" role="Заёмщик" />
    </ModalScene>
  ),
};
export const ПреДва: S = {
  name: 'Прескоринг · результат, два участника',
  render: () => (
    <ModalScene size="l" title={PRE.title} subtitle="С учётом всех участников — высокий рейтинг" actions={doneActions}>
      <div className="flex flex-col gap-4">
        <div className="grid grid-cols-2 gap-4 max-[640px]:grid-cols-1">
          <Participant current name="Иванов Иван Иванович" role="Заёмщик" status="Заполняется" statusTone="accent" score={902} />
          <Participant name="Иванова Мария Петровна" role="Созаёмщик · супруга" status="После заёмщика" score={741} warnings={2} />
        </div>
        <Alert type="warning" title="У созаёмщика 2 замечания">Много запросов в БКИ за последний месяц — банки могут попросить объяснение</Alert>
        <Report score={741} name="Иванова Мария Петровна" role="Созаёмщик · супруга" />
      </div>
    </ModalScene>
  ),
};
export const ПреБКИ: S = {
  name: 'Прескоринг · БКИ не ответило',
  render: () => (
    <ModalScene {...PRE} actions={<><Button variant="outline">Закрыть</Button><Button icon="refresh">Повторить запрос</Button></>}>
      <div className="flex flex-col items-center gap-3 py-6 text-center">
        <IconTile icon="triangle-alert" tone="blue" size={72} />
        <h3 className="m-0 text-h3">Не удалось получить кредитную историю</h3>
        <p className="m-0 max-w-[400px] text-body-m text-text-secondary">Бюро кредитных историй не ответило. Данные участников сохранены — попробуйте ещё раз через пару минут</p>
      </div>
    </ModalScene>
  ),
};
