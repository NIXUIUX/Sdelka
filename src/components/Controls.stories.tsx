import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Checkbox } from './Checkbox';
import { Switch } from './Switch';
import { RadioGroup } from './Radio';
import { StepperField, MiniStepper } from './Stepper';
import { plural } from '../utils/format';

const Card = ({ title, hint, cols = 'grid-cols-[repeat(auto-fill,minmax(220px,1fr))]', children }: { title: string; hint?: string; cols?: string; children: React.ReactNode }) => (
  <section className="flex flex-col gap-2 rounded-20 border border-border-default bg-surface-white p-8">
    <h2 className="text-h2">{title}</h2>
    {hint && <p className="text-body-s text-text-secondary">{hint}</p>}
    <div className={`mt-4 grid gap-x-6 gap-y-5 ${cols}`}>{children}</div>
  </section>
);
const Cap = ({ children }: { children: React.ReactNode }) => <span className="mb-1.5 block text-overline text-text-muted">{children}</span>;

const meta: Meta = { title: 'Компоненты/Выбор и степперы' };
export default meta;
type S = StoryObj;

export const Чекбоксы: S = {
  name: 'Checkbox',
  render: () => {
    const [a, setA] = useState(false);
    const [b, setB] = useState(true);
    return (
      <Card title="Checkbox" hint="Наведите на первый — рамка станет синей. Locked — банк, куда заявка уже отправлена: галочка видна, снять нельзя.">
        <div><Cap>Default</Cap><Checkbox label="Название опции" checked={a} onChange={setA} /></div>
        <div><Cap>Selected</Cap><Checkbox label="Название опции" checked={b} onChange={setB} /></div>
        <div><Cap>Mixed</Cap><Checkbox label="Выбрать все банки" indeterminate checked={false} onChange={() => {}} /></div>
        <div><Cap>Error</Cap><Checkbox label="Согласен на обработку данных" checked={false} error onChange={() => {}} /></div>
        <div><Cap>Disabled</Cap><Checkbox label="Название опции" disabled checked={false} /></div>
        <div><Cap>Locked</Cap><Checkbox label="ВТБ — отправлено" locked /></div>
        <div><Cap>С пояснением</Cap><Checkbox label="Есть созаёмщик" helper="Супруг(а) или другой участник сделки" checked={a} onChange={setA} /></div>
      </Card>
    );
  },
};

export const Переключатели: S = {
  name: 'Switch',
  render: () => {
    const [a, setA] = useState(false);
    const [b, setB] = useState(true);
    const [c, setC] = useState(false);
    return (
      <Card title="Switch" hint="Выключен — серая дорожка, при наведении голубая. Disabled включённый — полупрозрачный.">
        <div><Cap>Default</Cap><Switch label="Уведомления" checked={a} onChange={setA} /></div>
        <div><Cap>Selected</Cap><Switch label="Уведомления" checked={b} onChange={setB} /></div>
        <div><Cap>Disabled</Cap><Switch label="Уведомления" checked={false} disabled /></div>
        <div><Cap>Selected disabled</Cap><Switch label="Уведомления" checked disabled /></div>
        <div className="col-span-full"><Cap>С пояснением</Cap>
          <Switch label="Паспорт РФ получен впервые" helper="Ранее паспорт РФ не выдавался, например при получении гражданства РФ" checked={c} onChange={setC} />
        </div>
      </Card>
    );
  },
};

export const Радио: S = {
  name: 'Radio',
  render: () => {
    const [a, setA] = useState<string | null>('married');
    const [b, setB] = useState<string | null>(null);
    return (
      <Card title="Radio" hint="Выбор одного из видимых вариантов. Есть только в коде — визуально продолжает Checkbox: круг 20, рамка 1.5." cols="grid-cols-[repeat(auto-fill,minmax(300px,1fr))]">
        <RadioGroup label="Семейное положение *" value={a} onChange={setA} options={[
          { value: 'single', label: 'Не в браке' }, { value: 'married', label: 'В браке' },
          { value: 'contract', label: 'В браке, есть брачный договор', helper: 'Понадобится скан договора' },
          { value: 'divorced', label: 'В разводе', disabled: true },
        ]} />
        <div className="flex flex-col gap-6">
          <RadioGroup label="Есть дети до 18 лет?" inline value={b} onChange={setB} error={b ? undefined : 'Выберите вариант'}
            options={[{ value: 'yes', label: 'Да' }, { value: 'no', label: 'Нет' }]} />
          <RadioGroup label="Недоступная группа" inline disabled value="yes" onChange={() => {}}
            options={[{ value: 'yes', label: 'Да' }, { value: 'no', label: 'Нет' }]} />
        </div>
      </Card>
    );
  },
};

export const Степперы: S = {
  name: 'Stepper field и Mini stepper',
  render: () => {
    const [a, setA] = useState<number | null>(null);
    const [b, setB] = useState<number | null>(14);
    const [c, setC] = useState<number | null>(null);
    const [t, setT] = useState(25);
    return (
      <div className="flex flex-col gap-6">
        <Card title="Stepper field" hint="Число можно ввести руками или кнопками ±. Пустое поле — минус недоступен." cols="grid-cols-[repeat(auto-fill,minmax(320px,1fr))]">
          <div><Cap>Empty</Cap><StepperField label="Общий трудовой стаж, лет" value={a} onChange={setA} /></div>
          <div><Cap>Filled</Cap><StepperField label="Общий трудовой стаж, лет" value={b} onChange={setB} /></div>
          <div><Cap>Error</Cap><StepperField label="Общий трудовой стаж, лет" value={c} onChange={setC} error={c === null ? 'Укажите общий стаж — можно 0' : undefined} /></div>
        </Card>
        <Card title="Mini stepper" hint="Срок кредита в карточке банка. Кнопки 32, рамка вокруг.">
          <div><Cap>Default</Cap><MiniStepper label="срок, лет" value={t} onChange={setT} min={1} max={30} /></div>
          <div><Cap>С единицами</Cap><MiniStepper label="срок" value={t} onChange={setT} min={1} max={30} format={(v) => `${v} ${plural(v, 'год', 'года', 'лет')}`} /></div>
          <div><Cap>На минимуме</Cap><MiniStepper label="срок" value={1} onChange={() => {}} min={1} /></div>
          <div><Cap>Disabled</Cap><MiniStepper label="срок" value={25} onChange={() => {}} disabled /></div>
        </Card>
      </div>
    );
  },
};
