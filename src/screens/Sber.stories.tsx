import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { BottomBar, StepsNav, Autosave } from '../components/Layout';
import { Card, SectionTitle, FormGrid, Inset, IconTile } from '../components/Surface';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { MoneyField } from '../components/MoneyField';
import { Alert } from '../components/Alert';
import { UploadZone, FileItem } from '../components/Upload';
import { StepperField } from '../components/Stepper';
import { SummaryList, SummaryRow, CreditParams } from '../patterns/Params';
import { StatusBankCard, InfoHero } from '../patterns/Status';
import { BrokerPage, Help, PARAMS } from './kit';

const meta: Meta = { title: 'Экраны/Сценарии/Короткий флоу Сбербанка', parameters: { layout: 'fullscreen' } };
export default meta;
type S = StoryObj;

const SBER_STEPS = [{ key: 'podbor', label: 'Подбор условий' }, { key: 'personal', label: 'Персональные данные' }, { key: 'send', label: 'Отправка в банк' }];
const SberAside = ({ cur }: { cur: string }) => (
  <>
    <CreditParams banks={['Сбербанк']} program="Стандартная ипотека" amount={6_000_000} params={PARAMS} onEdit={() => {}} />
    <StepsNav steps={SBER_STEPS} current={cur} done={SBER_STEPS.slice(0, SBER_STEPS.findIndex((s) => s.key === cur)).map((s) => s.key)} />
    <Help />
  </>
);

export const Персональные: S = {
  name: 'С.1 Персональные данные · Сбер',
  render: () => {
    const [inc, setInc] = useState<number | null>(180000);
    const [months, setMonths] = useState<number | null>(32);
    return (
      <BrokerPage meta="Шаг 2 из 3 · Персональные данные" aside={<SberAside cur="personal" />}
        bar={<BottomBar left={<Autosave />}><Button variant="outline">Назад</Button><Button>Продолжить</Button></BottomBar>}>
        <Card padding="l" gap={40}>
          <SectionTitle description="Загрузите паспорт и введите контакты — анкета для Сбербанка короткая">Персональные данные</SectionTitle>
          <div className="flex flex-col gap-3"><UploadZone title="Паспорт РФ" onFiles={() => {}} /><FileItem name="Паспорт.pdf" meta="1,8 МБ · загружен" onRemove={() => {}} /></div>
          <FormGrid>
            <Input label="Фамилия, имя, отчество" defaultValue="Иванов Иван Иванович" helper="Распознано из паспорта" />
            <Input label="Номер телефона" mask="phone" defaultValue="+7 (900) 123-45-67" />
          </FormGrid>
          <SectionTitle description="Для заявки в Сбербанк достаточно двух вопросов — остальное банк уточнит сам">Доход и работа</SectionTitle>
          <FormGrid>
            <MoneyField label="Основной доход, ₽ / мес" value={inc} onChange={setInc} helper="После вычета налогов" />
            <StepperField label="Месяцев на текущем месте работы" value={months} onChange={setMonths} max={600} />
          </FormGrid>
        </Card>
      </BrokerPage>
    );
  },
};

export const Отправка: S = {
  name: 'С.2 Отправка в банк · Сбер',
  render: () => (
    <BrokerPage meta="Шаг 3 из 3 · Отправка в банк" aside={<SberAside cur="send" />}
      bar={<BottomBar left="Шаг 3 из 3 · Отправка в банк"><Button variant="outline">Назад</Button><Button icon="send">Отправить в Сбербанк</Button></BottomBar>}>
      <Card padding="l" gap={24}>
        <SectionTitle description="Короткая анкета для Сбербанка. Если что-то не так — вернитесь к нужному шагу">Проверьте данные заявки</SectionTitle>
        <SummaryList>
          <SummaryRow state="done" title="Персональные данные" summary="Иванов Иван Иванович · паспорт 6915 482731" onEdit={() => {}} />
          <SummaryRow state="done" title="Доход и работа" summary="180 000 ₽ / мес · 32 месяца на текущем месте" onEdit={() => {}} />
          <SummaryRow state="done" title="Условия" summary="Сбербанк · 6 000 000 ₽ на 25 лет" onEdit={() => {}} />
        </SummaryList>
        <Inset className="flex-row items-center gap-4">
          <IconTile icon="send" />
          <div className="flex min-w-0 flex-1 flex-col"><b className="text-h4">Отправка без подписания</b><span className="text-[13px] text-text-secondary">Для заявки в Сбербанк подписание анкеты не нужно — после отправки заявка сразу уходит в банк</span></div>
        </Inset>
        <Alert type="success" title="Готово к отправке">Все обязательные данные заполнены</Alert>
      </Card>
    </BrokerPage>
  ),
};

export const Отправлено: S = {
  name: 'С.3 Отправлено в Сбербанк',
  render: () => (
    <BrokerPage meta="Статус в банках"
      aside={<StatusBankCard bank="Сбербанк" status="sent" meta="Отправлено сегодня, 15:42" selected onSelect={() => {}}
        params={[{ label: 'Ставка', value: '18,4%' }, { label: 'Платёж в месяц', value: '92 670 ₽' }, { label: 'Сумма кредита', value: '6 000 000 ₽' }, { label: 'Срок', value: '25 лет' }]} />}
      bar={<BottomBar left="Заявка отправлена в Сбербанк"><Button variant="outline">К списку заявок</Button></BottomBar>}>
      <Card padding="l" gap={24}>
        <InfoHero tone="success" icon="circle-check" title="Заявка отправлена в Сбербанк">
          Сбербанк сам свяжется с клиентом, чтобы уточнить данные о работе. Решение появится здесь — обычно в течение 1–2 рабочих дней
        </InfoHero>
      </Card>
    </BrokerPage>
  ),
};
