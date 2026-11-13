import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Card, SectionTitle, FormGrid, Inset } from '../components/Surface';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { MoneyField } from '../components/MoneyField';
import { Select } from '../components/Select';
import { StepperField } from '../components/Stepper';
import { Alert } from '../components/Alert';
import { Aside, BrokerPage, StepBar } from './kit';

const meta: Meta = { title: 'Экраны/Сценарии/1.3 Доход и работа', parameters: { layout: 'fullscreen' } };
export default meta;
type S = StoryObj;

type Mode = 'hired' | 'selfEmployed' | 'extraJob' | 'missing' | 'byInn';

/** Шаг «Доход и работа»: по найму, самозанятый, доп. место работы, не хватает данных, организация по ИНН */
function IncomeScreen({ mode = 'hired' }: { mode?: Mode }) {
  const self = mode === 'selfEmployed';
  const missing = mode === 'missing';
  const [inc, setInc] = useState<number | null>(missing ? 0 : self ? 140000 : 180000);
  const [extra, setExtra] = useState<number | null>(40000);
  const [exp, setExp] = useState<number | null>(14);
  const [jobs, setJobs] = useState<number | null>(mode === 'extraJob' ? 2 : 1);
  return (
    <BrokerPage meta="Шаг 4 из 5 · Доход и работа" aside={<Aside cur="income" />}
      bar={<StepBar left={missing ? 'Шаг 4 из 5 · Доход и работа' : undefined} alert={missing ? <Alert type="warning" title="4 поля требуют внимания">Исправьте их — остальное уже сохранено</Alert> : undefined} />}>
      <Card padding="l" gap={24}>
        <SectionTitle description="Изменения сразу влияют на расчёт платёжеспособности">Доход участника</SectionTitle>
        {missing && <Alert type="error" title="Не хватает данных о доходе и работе">Не хватает: основной доход, ИНН организации и дата начала работы. Остальное уже сохранено</Alert>}
        <FormGrid>
          <Select label="Тип занятости" options={['По найму', 'ИП', 'Самозанятый']} value={self ? 'Самозанятый' : 'По найму'} onChange={() => {}} />
          {!self && <Select label="Вид трудового договора" options={['Бессрочный трудовой договор', 'Срочный']} value="Бессрочный трудовой договор" onChange={() => {}} />}
          <Select label="Тип подтверждения дохода" options={['Госуслуги / СФР', '2-НДФЛ', 'Справка о доходах НПД']} value={self ? 'Справка о доходах НПД' : 'Госуслуги / СФР'} onChange={() => {}} />
          <MoneyField label="Основной доход, ₽ / мес" value={inc} onChange={setInc} helper="После вычета налогов" error={missing ? 'Укажите ежемесячный доход после вычета налогов' : undefined} />
          {self && <Input label="ИНН самозанятого" mask="inn12" defaultValue="771234567890" helper="12 цифр" />}
        </FormGrid>
        {self && <Alert type="warning" title="Понадобится справка о доходах">Загрузите её на шаге подписания вместе с остальными документами</Alert>}
        {!self && (
          <>
            <SectionTitle>Место работы</SectionTitle>
            <Inset tone="outline" title="Основное место работы">
              <FormGrid>
                <Input label="Организация" defaultValue={missing ? undefined : 'ООО «Северсталь-Инфо»'} helper={mode === 'byInn' ? 'Подставили по ИНН' : 'Как в трудовом договоре'} />
                <Input label="ИНН организации" mask="inn10" defaultValue={missing ? '77012' : '7701234567'} helper="10 цифр"
                  error={missing ? 'У организации ИНН из 10 цифр. Его можно взять из справки или трудового договора' : undefined} />
                <Input label="Должность" defaultValue="Ведущий инженер" helper="Как в трудовом договоре" />
                <Input label="Дата начала работы" mask="date" defaultValue={missing ? undefined : '01.03.2019'}
                  error={missing ? 'Введите дату в формате дд.мм.гггг — по ней считается стаж на текущем месте' : undefined} />
              </FormGrid>
            </Inset>
            {mode === 'extraJob' ? (
              <Inset tone="outline" title="Дополнительное место работы" action={<Button variant="link" icon="trash">Убрать место работы</Button>}>
                <FormGrid>
                  <Select label="Тип работы" options={['Совместительство', 'Договор ГПХ']} value="Совместительство" onChange={() => {}} />
                  <MoneyField label="Доход на этом месте, ₽ / мес" value={extra} onChange={setExtra} helper="После вычета налогов" />
                  <Input label="Организация" defaultValue="ООО «Альфа-Проект»" helper="Как в договоре" />
                  <Input label="ИНН организации" mask="inn10" defaultValue="7709876543" helper="10 цифр" />
                </FormGrid>
              </Inset>
            ) : (
              <Button variant="outline" size="s" icon="plus" className="self-start">Добавить дополнительное место работы</Button>
            )}
          </>
        )}
        <SectionTitle description="Банки учитывают их при оценке стабильности дохода">Образование и стаж</SectionTitle>
        <FormGrid>
          <Select label="Образование" options={['Высшее', 'Неоконченное высшее', 'Среднее']} value="Высшее" onChange={() => {}} />
          <Input label="Год окончания" mask="year" defaultValue={missing ? '2030' : '2008'}
            error={missing ? 'Год окончания не может быть в будущем. Если ещё учитесь — выберите «Неоконченное высшее»' : undefined} />
          <StepperField label="Общий трудовой стаж, лет" value={exp} onChange={setExp} />
          <StepperField label="Мест работы за 3 года" value={jobs} onChange={setJobs} max={10} />
        </FormGrid>
      </Card>
    </BrokerPage>
  );
}

export const Основной: S = { name: 'По найму', render: () => <IncomeScreen /> };
export const Самозанятый: S = { name: 'Самозанятый', render: () => <IncomeScreen mode="selfEmployed" /> };
export const ДопМесто: S = { name: 'Дополнительное место работы', render: () => <IncomeScreen mode="extraJob" /> };
export const НеХватает: S = { name: 'Не хватает данных', render: () => <IncomeScreen mode="missing" /> };
export const ПоИНН: S = { name: 'Организация по ИНН', render: () => <IncomeScreen mode="byInn" /> };
