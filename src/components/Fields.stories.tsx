import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Input } from './Input';
import { MoneyField } from './MoneyField';
import { Textarea } from './Textarea';
import { Select } from './Select';

const Card = ({ title, hint, children }: { title: string; hint?: string; children: React.ReactNode }) => (
  <section className="flex flex-col gap-2 rounded-20 border border-border-default bg-surface-white p-8">
    <h2 className="text-h2">{title}</h2>
    {hint && <p className="text-body-s text-text-secondary">{hint}</p>}
    <div className="mt-4 grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-x-6 gap-y-5">{children}</div>
  </section>
);
const Cap = ({ children }: { children: React.ReactNode }) => (
  <span className="mb-1.5 block text-overline text-text-muted">{children}</span>
);

const meta: Meta<typeof Input> = {
  title: 'Компоненты/Поля ввода',
  component: Input,
  args: { label: 'Название *', helper: 'Короткая подсказка под полем', size: 'm' },
  argTypes: {
    size: { control: 'inline-radio', options: ['s', 'm', 'l'] },
    mask: { control: 'select', options: [undefined, 'phone', 'date', 'snils', 'passport', 'divisionCode', 'inn10', 'inn12', 'email', 'name'] },
  },
};
export default meta;
type S = StoryObj<typeof Input>;

export const Песочница: S = {
  render: (a) => {
    const [v, setV] = useState('');
    return <div className="max-w-[360px]"><Input {...a} value={v} onChange={setV} /></div>;
  },
};

const BANKS = ['Сбербанк', 'ВТБ', 'Альфа-Банк', 'Т-Банк', 'Газпромбанк', 'Росбанк', 'ДОМ.РФ'];

export const Состояния_Input: S = {
  name: 'Input — все состояния',
  render: () => (
    <Card title="Input" hint="Пустое поле показывает подпись крупно. В фокусе подпись уезжает вверх и видна подсказка формата (маска).">
      <div><Cap>Default</Cap><Input label="Название *" helper="Короткая подсказка под полем" /></div>
      <div><Cap>Filled</Cap><Input label="Название *" defaultValue="Введите значение" helper="Короткая подсказка под полем" /></div>
      <div><Cap>Focus с маской — кликните</Cap><Input label="Телефон *" mask="phone" helper="На него придёт код подтверждения" /></div>
      <div><Cap>Error</Cap><Input label="Название *" defaultValue="Введите значение" error="Короткая подсказка под полем" /></div>
      <div><Cap>Disabled</Cap><Input label="Название *" defaultValue="Введите значение" helper="Короткая подсказка под полем" disabled /></div>
      <div><Cap>С суффиксом</Cap><Input label="Срок кредита" defaultValue="20" mask="years" suffix="лет" /></div>
      <div><Cap>Size S · 56</Cap><Input size="s" label="Название *" helper="Короткая подсказка под полем" /></div>
      <div><Cap>Size M · 64</Cap><Input size="m" label="Название *" helper="Короткая подсказка под полем" /></div>
      <div><Cap>Size L · 72</Cap><Input size="l" label="Название *" helper="Короткая подсказка под полем" /></div>
    </Card>
  ),
};

export const Маски: S = {
  name: 'Маски',
  render: () => (
    <Card title="Маски" hint="Лишние символы не вводятся, длина ограничена, на телефоне открывается цифровая клавиатура.">
      <Input label="Телефон *" mask="phone" />
      <Input label="Дата рождения *" mask="date" />
      <Input label="СНИЛС" mask="snils" />
      <Input label="Серия и номер паспорта *" mask="passport" />
      <Input label="Код подразделения *" mask="divisionCode" />
      <Input label="ИНН организации" mask="inn10" />
      <Input label="Электронная почта" mask="email" />
      <Input label="Фамилия *" mask="name" />
    </Card>
  ),
};

export const Деньги: S = {
  name: 'MoneyField',
  render: () => {
    const [a, setA] = useState<number | null>(150000);
    const [b, setB] = useState<number | null>(null);
    return (
      <Card title="MoneyField" hint="Разряды разделяются пробелами, в onChange приходит число.">
        <MoneyField label="Основной доход, ₽ / мес" value={a} onChange={setA} helper="После вычета налогов" />
        <MoneyField label="Основной доход, ₽ / мес" value={b} onChange={setB} error="Укажите ежемесячный доход после вычета налогов" />
        <MoneyField label="Стоимость недвижимости" value={12500000} disabled helper="Из параметров подбора" />
      </Card>
    );
  },
};

export const Списки: S = {
  name: 'Select',
  render: () => {
    const [a, setA] = useState<string | null>('Русский');
    const [b, setB] = useState<string | null>(null);
    const [c, setC] = useState<string | null>(null);
    return (
      <div className="flex flex-col gap-6 pb-80">
        <Card title="Select" hint="Клик или ↓ открывает список, Esc закрывает. Выбранный пункт отмечен галочкой.">
          <div><Cap>Filled</Cap><Select label="Язык интерфейса" options={['Русский', 'English']} value={a} onChange={setA} helper="Выберите одно значение из списка" /></div>
          <div><Cap>Placeholder</Cap><Select label="Банк" options={BANKS} value={b} onChange={setB} helper="Выберите одно значение из списка" /></div>
          <div><Cap>Error</Cap><Select label="Тип занятости *" options={['Найм', 'ИП', 'Самозанятый', 'Собственник бизнеса']} value={c} onChange={setC} error={c ? undefined : 'Выберите значение из списка'} /></div>
          <div><Cap>Disabled</Cap><Select label="Язык интерфейса" options={['Русский']} value="Русский" onChange={() => {}} helper="Выберите одно значение из списка" disabled /></div>
        </Card>
      </div>
    );
  },
};

export const Многострочное: S = {
  name: 'Textarea',
  render: () => {
    const [t, setT] = useState('');
    return (
      <Card title="Textarea" hint="Подпись всегда сверху. Счётчик — при maxLength.">
        <Textarea label="Текст письма" placeholder="Например: направляем дополнительные документы по заявке" value={t} onChange={setT} maxLength={1000} counter />
        <Textarea label="Комментарий" value="" onChange={() => {}} error="Напишите комментарий для банка" />
      </Card>
    );
  },
};
