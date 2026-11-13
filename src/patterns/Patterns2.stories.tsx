import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Participant, ScorePill, ScoreCard, SignalTile, SignalGrid, ReportSection, ReportGrid } from './Prescoring';
import { MoreButton } from './Banks';
import { Modal } from '../components/Modal';
import { Button } from '../components/Button';
import { TextTabs } from '../components/Tabs';

const meta: Meta = { title: 'Паттерны флоу/Прескоринг' };
export default meta;
type S = StoryObj;

export const Участники: S = {
  name: 'Participant',
  render: () => (
    <div className="grid max-w-[980px] grid-cols-[repeat(auto-fill,minmax(280px,1fr))] items-start gap-4">
      <Participant current name="Иванов Иван Иванович" role="Заёмщик" status="Заполняется" statusTone="accent" score={902} onPrescoring={() => {}} />
      <Participant name="Иванова Мария Сергеевна" role="Созаёмщик · супруг(а)" status="После заёмщика" score={744} warnings={1} onPrescoring={() => {}} />
      <Participant name="" index={3} role="Созаёмщик" status="После заёмщика" onPrescoring={() => {}} onRemove={() => {}} />
    </div>
  ),
};

export const Плашка: S = {
  name: 'Score pill — все уровни',
  render: () => (
    <div className="flex flex-wrap gap-3">
      <ScorePill score={512} /><ScorePill score={744} /><ScorePill score={902} more={1} /><ScorePill score={985} />
    </div>
  ),
};

export const Шкала: S = {
  name: 'Score card',
  render: () => (
    <div className="flex max-w-[720px] flex-col gap-4">
      <ScoreCard score={902} name="Иванов Иван Иванович" role="Заёмщик" />
      <ScoreCard score={744} name="Иванова Мария Сергеевна" role="Созаёмщик" />
      <ScoreCard score={410} name="Петров Пётр" role="Созаёмщик" />
    </div>
  ),
};

export const Сигналы: S = {
  name: 'Signal tile и Report section',
  render: () => (
    <div className="flex max-w-[720px] flex-col gap-6 rounded-20 bg-surface-white p-6">
      <SignalGrid>
        <SignalTile label="Банкротство" value="Нет" />
        <SignalTile label="Исп. производства" value="Штраф ГИБДД" state="warning" />
        <SignalTile label="Просрочки" value="Нет" />
        <SignalTile label="Паспорт" value="Действителен" />
      </SignalGrid>
      <ReportGrid>
        <ReportSection title="Кредитная нагрузка" rows={[
          { label: 'Действующие кредиты', value: 'Есть' }, { label: 'Количество кредитов', value: '3–4' },
          { label: 'Сумма кредитов', value: '50 000–100 000 ₽' }, { label: 'Запросы за 30 дней', value: '4', warning: true },
        ]} />
        <ReportSection title="Платёжная дисциплина" rows={[
          { label: 'Просрочки сейчас', value: 'Нет' }, { label: 'Просрочки за 2 года', value: 'Нет' }, { label: 'Максимальная просрочка', value: '—' },
        ]} />
      </ReportGrid>
    </div>
  ),
};

export const Отчёт: S = {
  name: 'Отчёт прескоринга в окне — сборка',
  render: () => {
    const [open, setOpen] = useState(true);
    const [who, setWho] = useState('main');
    const p = who === 'main' ? { score: 902, name: 'Иванов Иван Иванович', role: 'Заёмщик' } : { score: 744, name: 'Иванова Мария Сергеевна', role: 'Созаёмщик' };
    return (
      <>
        <ScorePill score={902} more={1} onClick={() => setOpen(true)} />
        <Modal open={open} onClose={() => setOpen(false)} size="l" title="Прескоринг участников" subtitle="Предварительная оценка по данным бюро кредитных историй"
          actions={<><Button variant="outline" icon="download">Скачать PDF</Button><Button onClick={() => setOpen(false)}>Готово</Button></>}>
          <div className="flex flex-col gap-5">
            <TextTabs aria-label="Участник" value={who} onChange={setWho} items={[{ value: 'main', label: 'Иванов И. И.' }, { value: 'co', label: 'Иванова М. С.' }]} />
            <ScoreCard {...p} />
            <SignalGrid>
              <SignalTile label="Банкротство" value="Нет" />
              <SignalTile label="Исп. производства" value={who === 'main' ? 'Нет' : 'Штраф ГИБДД'} state={who === 'main' ? 'ok' : 'warning'} />
              <SignalTile label="Просрочки" value="Нет" />
              <SignalTile label="Паспорт" value="Действителен" />
              <SignalTile label="Розыск" value="Нет" />
              <SignalTile label="Долговая нагрузка" value={who === 'main' ? 'Низкая' : 'Средняя'} state={who === 'main' ? 'ok' : 'warning'} />
            </SignalGrid>
            <ReportSection title="Кредитная нагрузка" rows={[
              { label: 'Действующие кредиты', value: 'Есть' }, { label: 'Количество кредитов', value: '3–4' },
              { label: 'Сумма кредитов', value: '50 000–100 000 ₽' }, { label: 'Запросы за 30 дней', value: '4', warning: true },
            ]} />
          </div>
        </Modal>
      </>
    );
  },
};
