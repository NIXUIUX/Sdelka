import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  AppHeader, FlowHead, StepsNav, BottomBar, HelpCard, Container, Autosave,
} from '../components/Layout';
import { Card, SectionTitle, PageLayout, FormGrid, Inset, NumberedStep, ProgressBar, SecureNote, IconTile, LoadingState } from '../components/Surface';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { MoneyField } from '../components/MoneyField';
import { Select } from '../components/Select';
import { Switch } from '../components/Switch';
import { Checkbox } from '../components/Checkbox';
import { Alert } from '../components/Alert';
import { Badge } from '../components/Badge';
import { UploadZone, FileItem } from '../components/Upload';
import { StepperField } from '../components/Stepper';
import { SegmentedTabs } from '../components/Tabs';
import { Modal } from '../components/Modal';
import { Participant, ScorePill } from './Prescoring';
import { CreditParams, SummaryList, SummaryRow } from './Params';
import {
  ParticipantsCard, BankFacts, BankLimits, IconList, SignerHeader, DocBox, SignaturePad, PackageCard, ClientHeader, ClientHero, BrokerContact, DocsIllustration,
} from './Extra';

const meta: Meta = { title: 'Экраны/Сборка из библиотеки', parameters: { layout: 'fullscreen' } };
export default meta;
type S = StoryObj;

const STEPS = [
  { key: 'podbor', label: 'Подбор условий' }, { key: 'personal', label: 'Персональные данные' }, { key: 'family', label: 'Семейное положение' },
  { key: 'income', label: 'Доход и работа' }, { key: 'signing', label: 'Подписание и отправка' },
];
const PARAMS = [
  { label: 'Цель', value: 'Квартира в новостройке' }, { label: 'Программа', value: 'Стандартная ипотека' }, { label: 'Регион', value: 'г. Москва' },
  { label: 'Стоимость', value: '10 000 000 ₽' }, { label: 'Первый взнос', value: '4 000 000 ₽ · 40%' }, { label: 'Срок', value: '25 лет' },
];
const Header = () => <AppHeader user="Дмитрий Сорокин" org="ООО «Сделка.РФ»" onOrgClick={() => {}} actions={<AppHeader.IconButton icon="help-circle" label="Справка" />} />;
const Aside = ({ cur, done }: { cur: string; done: string[] }) => (
  <>
    <CreditParams banks={['Абсолют Банк', 'Уралсиб']} program="Стандартная ипотека" amount={6_000_000} params={PARAMS} onEdit={() => {}} />
    <StepsNav steps={STEPS} current={cur} done={done} onStep={() => {}} />
    <HelpCard action={<Button variant="outline" size="s">Открыть чат</Button>} footer={<>Ответы на частые вопросы собрали <a className="font-semibold text-action-primary" href="#">здесь</a></>} />
  </>
);
const Page = ({ step, n, children, aside, bar }: { step: string; n: number; children: React.ReactNode; aside: React.ReactNode; bar: React.ReactNode }) => (
  <div className="flex min-h-dvh flex-col bg-surface-page">
    <Header />
    <main className="flex-1 pb-6">
      <Container className="flex flex-col gap-5 pt-6">
        <FlowHead title="Заявка № 1009" meta={`Шаг ${n} из 5 · ${step}`} action={<ScorePill score={902} onClick={() => {}} />} />
        <PageLayout aside={aside}>{children}</PageLayout>
      </Container>
    </main>
    {bar}
  </div>
);

export const Персональные: S = {
  name: '1.1 Персональные данные',
  render: () => {
    const [first, setFirst] = useState(true);
    return (
      <Page step="Персональные данные" n={2} aside={<Aside cur="personal" done={['podbor']} />}
        bar={<BottomBar left={<Autosave />}><Button variant="outline">Назад</Button><Button>Продолжить</Button></BottomBar>}>
        <ParticipantsCard onAdd={() => {}}>
          <Participant current name="Иванов Иван Иванович" role="Заёмщик" status="Заполняется" statusTone="accent" onPrescoring={() => {}} />
        </ParticipantsCard>
        <Card padding="l" gap={40}>
          <SectionTitle description="Загрузите паспорт и СНИЛС для заполнения данных или введите реквизиты вручную">Персональные данные</SectionTitle>
          <FormGrid>
            <div className="flex flex-col gap-3"><UploadZone title="Паспорт РФ" onFiles={() => {}} /><FileItem name="Паспорт.pdf" meta="1,8 МБ · загружен" onRemove={() => {}} /></div>
            <UploadZone title="СНИЛС" onFiles={() => {}} />
          </FormGrid>
          <Alert title="Данные распознаны из паспорта">Проверьте их — если что-то не так, загрузите более чёткий скан</Alert>
          <FormGrid>
            <Input label="Фамилия, имя, отчество" defaultValue="Иванов Иван Иванович" helper="Распознано из паспорта" />
            <Input label="Дата рождения" mask="date" defaultValue="17.04.1986" helper="Распознано из паспорта" />
            <Input label="Место рождения" defaultValue="г. Тверь" helper="Распознано из паспорта" />
            <Input label="Гражданство" defaultValue="Российская Федерация" disabled helper="Распознано из паспорта" />
          </FormGrid>
          <SectionTitle>Паспорт и СНИЛС</SectionTitle>
          <FormGrid cols={3}>
            <Input label="Серия и номер" mask="passport" defaultValue="6915 482731" helper="Распознано из паспорта" />
            <Input label="Когда выдан" mask="date" defaultValue="23.07.2015" helper="Распознано из паспорта" />
            <Input label="Код подразделения" mask="divisionCode" defaultValue="690-014" helper="Распознано из паспорта" />
          </FormGrid>
          <Switch label="Паспорт РФ получен впервые" helper="Ранее паспорт РФ не выдавался, например при получении гражданства РФ" checked={first} onChange={setFirst} />
        </Card>
      </Page>
    );
  },
};

export const Доход: S = {
  name: '1.3 Доход и работа',
  render: () => {
    const [inc, setInc] = useState<number | null>(180000);
    const [exp, setExp] = useState<number | null>(14);
    const [jobs, setJobs] = useState<number | null>(1);
    return (
      <Page step="Доход и работа" n={4} aside={<Aside cur="income" done={['podbor', 'personal', 'family']} />}
        bar={<BottomBar left={<Autosave />}><Button variant="outline">Назад</Button><Button>Продолжить</Button></BottomBar>}>
        <Card padding="l" gap={24}>
          <SectionTitle description="Изменения сразу влияют на расчёт платёжеспособности">Доход участника</SectionTitle>
          <FormGrid>
            <Select label="Тип занятости" options={['По найму', 'ИП', 'Самозанятый']} value="По найму" onChange={() => {}} />
            <Select label="Вид трудового договора" options={['Бессрочный трудовой договор', 'Срочный']} value="Бессрочный трудовой договор" onChange={() => {}} />
            <Select label="Тип подтверждения дохода" options={['Госуслуги / СФР', '2-НДФЛ']} value="Госуслуги / СФР" onChange={() => {}} />
            <MoneyField label="Основной доход, ₽ / мес" value={inc} onChange={setInc} helper="Сумма после вычета налогов" />
          </FormGrid>
          <SectionTitle>Место работы</SectionTitle>
          <Inset tone="outline" title="Основное место работы">
            <FormGrid>
              <Input label="Организация" defaultValue="ООО «Северсталь-Инфо»" helper="Как в трудовом договоре" />
              <Input label="ИНН организации" mask="inn10" defaultValue="7701234567" helper="10 цифр" />
              <Input label="Должность" defaultValue="Ведущий инженер" helper="Как в трудовом договоре" />
              <Input label="Рабочий телефон" mask="phone" defaultValue="+7 (495) 123-45-67" helper="Отдел кадров или бухгалтерия" />
            </FormGrid>
          </Inset>
          <Button variant="outline" size="s" icon="plus" className="self-start">Добавить дополнительное место работы</Button>
          <SectionTitle description="Банки учитывают их при оценке стабильности дохода">Образование и стаж</SectionTitle>
          <FormGrid>
            <Select label="Образование" options={['Высшее', 'Среднее']} value="Высшее" onChange={() => {}} />
            <StepperField label="Общий трудовой стаж, лет" value={exp} onChange={setExp} />
            <StepperField label="Мест работы за 3 года" value={jobs} onChange={setJobs} max={10} />
            <Select label="Стаж за последние 5 лет" options={['5 лет и более', 'Меньше 5 лет']} value="5 лет и более" onChange={() => {}} />
          </FormGrid>
        </Card>
      </Page>
    );
  },
};

export const Подписание: S = {
  name: '1.4 Подписание и отправка',
  render: () => {
    const [m, setM] = useState('screen');
    const [agree, setAgree] = useState(false);
    const [key, setKey] = useState(0);
    return (
      <Page step="Подписание и отправка" n={5}
        aside={<><PackageCard signers={[{ name: 'Иванов Иван Иванович' }]} banks={['Абсолют Банк', 'Уралсиб']} /><StepsNav steps={STEPS} current="signing" done={['podbor', 'personal', 'family', 'income']} /></>}
        bar={<BottomBar left="Шаг 5 из 5 · Подписание и отправка"><Button variant="outline">Назад</Button><Button>Отправить в банки</Button></BottomBar>}>
        <Card padding="l" gap={40}>
          <div className="flex flex-col gap-4">
            <SectionTitle description="Краткая сводка по шагам анкеты. Если что-то не так — вернитесь к нужному разделу">Проверьте данные заявки</SectionTitle>
            <SummaryList>
              <SummaryRow state="done" title="Персональные данные" summary="Иванов Иван Иванович · 17.04.1986 · паспорт 6915 482731" onEdit={() => {}} />
              <SummaryRow state="done" title="Доход и работа" summary="По найму · 180 000 ₽ / мес · ООО «Северсталь-Инфо»" onEdit={() => {}} />
            </SummaryList>
          </div>
          <div className="flex flex-col gap-4">
            <SectionTitle>Документы</SectionTitle>
            <FormGrid><FileItem name="Паспорт.pdf" meta="1,8 МБ · загружен" /><FileItem name="Выписка СФР о доходах.pdf" meta="0,9 МБ · загружен" /></FormGrid>
          </div>
          <div className="flex flex-col gap-4">
            <SectionTitle description="Каждый участник выбирает удобный способ подписания анкеты и согласия">Способ подписания</SectionTitle>
            <Inset tone="outline" className="gap-5">
              <SignerHeader name="Иванов Иван Иванович" role="Заёмщик · анкета и согласие" status={<Badge tone="warning">Не подписано</Badge>} />
              <SegmentedTabs aria-label="Способ подписания" value={m} onChange={setM} items={[{ value: 'phone', label: 'На телефоне' }, { value: 'paper', label: 'Бумажная версия' }, { value: 'screen', label: 'На экране' }]} />
              {m === 'phone' && (
                <div className="flex items-center gap-5">
                  <IconTile icon="phone" tone="blue" size={72} />
                  <div className="flex flex-col gap-3"><h3 className="m-0 text-h3">Отправьте ссылку участнику</h3><p className="m-0 text-[13px] text-text-secondary">+7 (900) 123-45-67 · отдельная ссылка на анкету и согласие</p><div><Button variant="outline" icon="send">Отправить ссылку по СМС</Button></div></div>
                </div>
              )}
              {m === 'paper' && (
                <div className="flex flex-col gap-4">
                  <NumberedStep n={1} title="Скачайте и распечатайте документы" description="Анкета и согласие для этого участника" action={<Button variant="outline" icon="download">Скачать</Button>} />
                  <NumberedStep n={2} title="Получите подпись на анкете и согласии" description="Проверьте комплект перед загрузкой" />
                  <UploadZone title="Подписанные документы" limits="PDF, JPEG, PNG до 20 МБ · можно один PDF с обоими документами" multiple onFiles={() => {}} />
                </div>
              )}
              {m === 'screen' && (
                <div className="flex flex-col gap-4">
                  <DocBox title="Анкета и согласие" onOpen={() => {}}>
                    <p className="m-0">Участник ознакомлен с параметрами ипотечной заявки: Стандартная ипотека, 6 000 000 ₽ на 25 лет.</p>
                  </DocBox>
                  <Checkbox label="Ознакомлен с документами" checked={agree} onChange={setAgree} />
                  <SignaturePad clearKey={key} />
                  <div className="flex flex-wrap gap-3"><Button variant="outline" onClick={() => setKey((k) => k + 1)}>Очистить</Button><Button variant="outline" icon="check">Подписать документы</Button></div>
                </div>
              )}
            </Inset>
          </div>
        </Card>
      </Page>
    );
  },
};

export const Клиент: S = {
  name: 'Клиент · загрузка документов',
  render: () => {
    const [n, setN] = useState(0);
    const [co, setCo] = useState(false);
    return (
      <div className="flex min-h-dvh flex-col bg-surface-page">
        <ClientHeader onHelp={() => {}} />
        <main className="flex-1">
          <Container narrow className="flex flex-col gap-4 pt-10 pb-6">
            <ClientHero illustration={<DocsIllustration />} badge="Заявка № 69670348" title="Загрузите документы для ипотечной анкеты">
              Ваш брокер подготовил предложение по стандартной ипотеке. Осталось загрузить документы — это займёт пару минут
            </ClientHero>
            <Card title="Документы" description="Можно отправить часть сейчас и дополнить позднее" action={<b className="text-text-secondary tabular-nums">{n} из 2</b>}>
              <ProgressBar value={n} max={2} label="Загружено документов" />
              <FormGrid><UploadZone title="Паспорт РФ" onFiles={() => setN((x) => Math.min(2, x + 1))} /><UploadZone title="СНИЛС" onFiles={() => setN((x) => Math.min(2, x + 1))} /></FormGrid>
              <Switch label="Будет участвовать созаёмщик" checked={co} onChange={setCo} />
            </Card>
            <BrokerContact name="Дмитрий Сорокин" company="ООО «Сделка.РФ»" phone="+7 900 000-00-00" />
            <SecureNote>Документы передаются по защищённому соединению и доступны только вашему брокеру</SecureNote>
          </Container>
        </main>
        <BottomBar narrow left={`Загружено ${n} из 2`}><Button variant="outline">Передам документы позже</Button><Button>Отправить документы</Button></BottomBar>
      </div>
    );
  },
};

export const ОкноБанка: S = {
  name: 'Окно банка «Подробнее»',
  render: () => {
    const [open, setOpen] = useState(true);
    return (
      <div className="p-6">
        <Button variant="outline" size="s" onClick={() => setOpen(true)}>Подробнее</Button>
        <Modal open={open} onClose={() => setOpen(false)} size="l" title="МКБ" subtitle="Стандартная ипотека · Квартира в новостройке"
          actions={<><Button variant="outline" onClick={() => setOpen(false)}>Закрыть</Button><Button>Выбрать банк</Button></>}>
          <div className="flex flex-col gap-5">
            <BankFacts note="* Окончательные условия банк определит после рассмотрения заявки" items={[
              { label: 'Расчётная ставка', value: '18,95%*' }, { label: 'Платёж в месяц · 25 лет', value: '95 619 ₽' },
              { label: 'Сумма кредита', value: '6 000 000 ₽' }, { label: 'Рекомендуемый доход', value: '159 365 ₽' },
            ]} />
            <BankLimits items={[{ label: 'ПСК', value: '19,85–22,05%' }, { label: 'Первоначальный взнос', value: 'от 10%' }, { label: 'Максимальный срок', value: '30 лет' }, { label: 'Максимальная сумма', value: '50 000 000 ₽' }]} />
            <div className="grid grid-cols-2 gap-6 max-[640px]:grid-cols-1">
              <IconList title="Требования к заёмщику" groups={[{ items: ['Возраст от 21 года до 85 лет на момент погашения', 'Гражданство РФ', 'Стаж на текущем месте от 3 месяцев', 'Общий стаж от 1 года за последние 5 лет'] }]} />
              <IconList kind="doc" title="Необходимые документы" groups={[
                { caption: 'Для рассмотрения заявки', items: ['Паспорт РФ', 'СНИЛС', 'Справка о доходах или выписка из СФР'] },
                { caption: 'Для сделки', items: ['Договор долевого участия или купли-продажи', 'Отчёт об оценке объекта', 'Выписка из ЕГРН'] },
              ]} />
            </div>
          </div>
        </Modal>
      </div>
    );
  },
};

export const Прескоринг: S = {
  name: 'Окно прескоринга — форма и расчёт',
  render: () => {
    const [stage, setStage] = useState<'form' | 'load'>('form');
    const [agree, setAgree] = useState(false);
    return (
      <div className="p-6">
        <Modal open onClose={() => {}} title="Прескоринг участников" subtitle="Предварительная оценка по данным бюро кредитных историй. На заявку в банк не влияет"
          actions={stage === 'form' ? <><Button variant="outline">Отмена</Button><Button onClick={() => setStage('load')}>Рассчитать рейтинг</Button></> : undefined}>
          {stage === 'form' ? (
            <div className="flex flex-col gap-4">
              <Inset tone="outline" title={<>Заёмщик <span className="font-normal text-text-secondary">· Иванов Иван Иванович</span></>}>
                <Input label="Телефон" mask="phone" defaultValue="+7 (900) 123-45-67" helper="На этот номер придёт код подтверждения согласия" />
                <UploadZone title="Паспорт РФ · разворот с фото" onFiles={() => {}} />
                <FileItem name="Паспорт.pdf" meta="1,8 МБ · загружен" onRemove={() => {}} />
                <Checkbox label="Дал согласие на запрос кредитной истории" checked={agree} onChange={setAgree} />
              </Inset>
              <Button variant="outline" size="s" icon="plus" className="self-start">Добавить созаёмщика</Button>
            </div>
          ) : (
            <LoadingState title="Запрашиваем кредитную историю">Обычно это занимает до минуты. Окно можно закрыть — результат сохранится в заявке</LoadingState>
          )}
        </Modal>
      </div>
    );
  },
};
