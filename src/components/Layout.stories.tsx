import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { AppHeader, FlowHead, StepsNav, StepItem, BottomBar, HelpCard, Container, HSteps, Autosave } from './Layout';
import { Button } from './Button';
import { Alert } from './Alert';
import { Input } from './Input';
import { Select } from './Select';

const STEPS = [
  { key: 'params', label: 'Подбор условий' }, { key: 'person', label: 'Персональные данные' },
  { key: 'income', label: 'Доходы и работа' }, { key: 'docs', label: 'Документы' }, { key: 'banks', label: 'Отправка в банки' },
];

const meta: Meta = { title: 'Компоненты/Каркас страницы', parameters: { layout: 'fullscreen' } };
export default meta;
type S = StoryObj;

export const Шапка: S = {
  name: 'App header',
  render: () => (
    <AppHeader user="Дмитрий Сорокин" org="ООО «Сделка.РФ»" onOrgClick={() => {}} actions={<AppHeader.IconButton icon="help-circle" label="Справка" />} />
  ),
};

export const Шаги: S = {
  name: 'Step item и Steps nav',
  render: () => {
    const [cur, setCur] = useState('person');
    return (
      <div className="flex flex-wrap items-start gap-8 p-8">
        <div className="flex w-84 flex-col gap-2 rounded-20 bg-surface-white p-4">
          <StepItem n={1} label="Персональные данные" state="done" onClick={() => {}} />
          <StepItem n={2} label="Персональные данные" state="current" />
          <StepItem n={3} label="Персональные данные" state="locked" />
        </div>
        <StepsNav className="w-96" steps={STEPS} current={cur} done={['params', 'person'].filter((k) => k !== cur)} onStep={setCur} />
        <HelpCard className="w-96" action={<Button variant="outline" size="s">Открыть чат</Button>} footer={<>Ответы на частые вопросы собрали <a className="font-semibold text-action-primary" href="#">здесь</a></>} />
        <div className="w-full"><HSteps steps={STEPS} current={cur} done={['params']} onStep={setCur} /></div>
      </div>
    );
  },
};

export const Футер: S = {
  name: 'Bottom bar — оба состояния',
  render: () => (
    <div className="flex flex-col gap-8 py-8">
      <BottomBar stuck={false} left="Шаг 1 из 5 · Подбор условий"><Button variant="outline">Сохранить и выйти</Button><Button>Продолжить</Button></BottomBar>
      <BottomBar stuck left="Шаг 1 из 5 · Подбор условий"><Button variant="outline">Сохранить и выйти</Button><Button>Продолжить</Button></BottomBar>
    </div>
  ),
};

export const Страница: S = {
  name: 'Страница анкеты целиком',
  render: () => {
    const [cur, setCur] = useState('person');
    const [rows, setRows] = useState(4);
    const [fam, setFam] = useState<string | null>(null);
    return (
      <div className="flex min-h-dvh flex-col bg-surface-page">
        <AppHeader user="Дмитрий Сорокин" org="ООО «Сделка.РФ»" onOrgClick={() => {}} actions={<AppHeader.IconButton icon="help-circle" label="Справка" />} />
        <main className="flex-1 py-8">
          <Container className="flex flex-col gap-6">
            <FlowHead title="Заявка № 1009" meta="Шаг 2 из 5 · Персональные данные" action={<Button variant="outline" size="sm" icon="gauge">Прескоринг</Button>} />
            <div className="grid grid-cols-[minmax(0,1fr)] items-start gap-6 lg:grid-cols-[minmax(0,1fr)_384px]">
              <section className="flex flex-col gap-4 rounded-20 border border-border-default bg-surface-white p-8">
                <h2 className="m-0 text-h2">Персональные данные</h2>
                {Array.from({ length: rows }, (_, i) => <Input key={i} label={['Фамилия *', 'Имя *', 'Отчество', 'Дата рождения *', 'Место рождения *', 'СНИЛС', 'Телефон *', 'Почта'][i % 8]!} />)}
                <Select label="Семейное положение *" options={['Не в браке', 'В браке', 'В разводе']} value={fam} onChange={setFam} />
                <div className="flex flex-wrap gap-3">
                  <Button variant="outline" size="s" onClick={() => setRows((r) => r + 6)}>Добавить поля</Button>
                  <Button variant="ghost" size="s" onClick={() => setRows(4)}>Сбросить</Button>
                </div>
              </section>
              <aside className="flex flex-col gap-4 max-lg:-order-1">
                <StepsNav steps={STEPS} current={cur} done={['params']} onStep={setCur} />
                <HelpCard action={<Button variant="outline" size="s">Открыть чат</Button>} footer={<>Ответы на частые вопросы собрали <a className="font-semibold text-action-primary" href="#">здесь</a></>} />
              </aside>
            </div>
          </Container>
        </main>
        <BottomBar left={<Autosave />} alert={<Alert type="warning" title="2 поля требуют внимания">Дата рождения, СНИЛС</Alert>}>
          <Button variant="outline">Назад</Button><Button>Продолжить</Button>
        </BottomBar>
      </div>
    );
  },
};
