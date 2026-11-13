import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Card, SectionTitle, FormGrid, Hint } from '../components/Surface';
import { Select } from '../components/Select';
import { Switch } from '../components/Switch';
import { Alert } from '../components/Alert';
import { ParticipantsCard } from '../patterns/Extra';
import { Participant } from '../patterns/Prescoring';
import { Aside, BrokerPage, StepBar } from './kit';

const meta: Meta = { title: 'Экраны/Сценарии/1.2 Семейное положение', parameters: { layout: 'fullscreen' } };
export default meta;
type S = StoryObj;

type Status = 'Женат / замужем' | 'Не женат / не замужем' | 'В разводе' | 'Вдовец / вдова';
interface Props { status?: Status; excluded?: 'Нет' | 'Да, по брачному договору'; kids?: string; spouseCo?: boolean }

/** Шаг «Семейное положение»: супруг-созаёмщик, исключён по брачному договору, не в браке */
function FamilyScreen({ status: s0 = 'Женат / замужем', excluded: e0 = 'Нет', kids: k0 = 'Нет', spouseCo: c0 = false }: Props) {
  const [status, setStatus] = useState<Status>(s0);
  const [excluded, setExcluded] = useState(e0);
  const [kids, setKids] = useState(k0);
  const [co, setCo] = useState(c0);
  const married = status === 'Женат / замужем';
  return (
    <BrokerPage meta="Шаг 3 из 5 · Семейное положение" aside={<Aside cur="family" />} bar={<StepBar />}>
      <ParticipantsCard onAdd={() => {}}>
        <Participant current name="Иванов Иван Иванович" role="Заёмщик" status="Заполняется" statusTone="accent" score={902} onPrescoring={() => {}} />
        {married && co && <Participant name="Иванова Мария Петровна" role="Созаёмщик · супруга" status="После заёмщика" onPrescoring={() => {}} onRemove={() => setCo(false)} />}
      </ParticipantsCard>
      <Card padding="l" gap={24}>
        <SectionTitle description="Укажите семейное положение и количество несовершеннолетних детей">Семейное положение</SectionTitle>
        <FormGrid cols={3}>
          <Select label="Семейное положение" options={['Женат / замужем', 'Не женат / не замужем', 'В разводе', 'Вдовец / вдова'] as Status[]} value={status} onChange={setStatus} />
          {married && <Select label="Супруг исключён из сделки" options={['Нет', 'Да, по брачному договору'] as const} value={excluded} onChange={setExcluded} />}
          <Select label="Несовершеннолетние дети" options={['Нет', '1', '2', '3 и более']} value={kids} onChange={setKids} />
        </FormGrid>
        {married && excluded === 'Нет' && (
          <Switch label="Супруг(а) участвует как созаёмщик" checked={co} onChange={setCo}
            helper={co ? 'Добавим созаёмщика после основной анкеты' : 'Если не участвует, банк может запросить нотариальное согласие супруга'} />
        )}
        {married && excluded === 'Нет' && co && <Alert title="Ссылку на анкету для супруга отправим, когда заполните данные заёмщика">Семейное положение и детей возьмём из этой анкеты</Alert>}
        {married && excluded !== 'Нет' && <Alert type="warning" title="Понадобится брачный договор">Загрузите его на шаге подписания вместе с остальными документами</Alert>}
        <Hint>Данные семьи используются для проверки комплекта документов</Hint>
      </Card>
    </BrokerPage>
  );
}

export const Основной: S = { name: 'Женат / замужем', render: () => <FamilyScreen /> };
export const СупругСозаёмщик: S = { name: 'Супруг — созаёмщик', render: () => <FamilyScreen kids="1" spouseCo /> };
export const СупругИсключён: S = { name: 'Супруг исключён из сделки', render: () => <FamilyScreen excluded="Да, по брачному договору" /> };
export const НеВБраке: S = { name: 'Не в браке', render: () => <FamilyScreen status="В разводе" kids="2" /> };
