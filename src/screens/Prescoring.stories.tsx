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

const meta: Meta = { title: 'Экраны/Брокер/Прескоринг · окно', parameters: { layout: 'fullscreen' } };
export default meta;
type S = StoryObj;

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
export const ПреВвод: S = { name: 'Ввод участников', render: () => <PreForm /> };
export const ПреОшибки: S = { name: 'Ошибки ввода', render: () => <PreForm errors /> };
export const ПреЗапрос: S = {
  name: 'Запрос в БКИ',
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
  name: 'Результат · один участник',
  render: () => (
    <ModalScene size="l" title={PRE.title} subtitle="Предварительная оценка по данным БКИ от 13.11.2026" actions={doneActions}>
      <Report score={902} name="Иванов Иван Иванович" role="Заёмщик" />
    </ModalScene>
  ),
};
export const ПреДва: S = {
  name: 'Результат · два участника',
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
  name: 'БКИ не ответило',
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
