import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { BottomBar } from '../components/Layout';
import { Card, FormGrid, ProgressBar, SecureNote } from '../components/Surface';
import { Button } from '../components/Button';
import { Alert } from '../components/Alert';
import { Switch } from '../components/Switch';
import { UploadZone, FileItem } from '../components/Upload';
import { ClientHero, BrokerContact, DocsIllustration, OfferLetter, type DocsIllustrationState } from '../patterns/Extra';
import { BROKER, ClientPage } from './kit';

const meta: Meta = { title: 'Экраны/Сценарии/Клиент — загрузка документов', parameters: { layout: 'fullscreen' } };
export default meta;
type S = StoryObj;

const Broker = () => <BrokerContact name={BROKER.name} company={BROKER.company} phone={BROKER.phone} />;
const Secure = () => <SecureNote>Документы передаются по защищённому соединению и доступны только вашему брокеру</SecureNote>;
const DEFAULT_HERO = { badge: 'Заявка № 69670348', title: 'Загрузите документы для ипотечной анкеты', text: 'Ваш брокер подготовил предложение по стандартной ипотеке. Осталось загрузить документы — это займёт пару минут' };

interface UploadProps { files?: ('passport' | 'snils')[]; co?: boolean; nothing?: boolean; hero?: typeof DEFAULT_HERO }

/** Страница клиента по ссылке из письма: герой, документы, брокер, нижняя панель */
function UploadScreen({ files = [], co: c0 = false, nothing, hero = DEFAULT_HERO }: UploadProps) {
  const [co, setCo] = useState(c0);
  const n = files.length;
  return (
    <ClientPage bar={
      <BottomBar narrow left={nothing ? undefined : `Загружено ${n} из 2`}
        alert={nothing ? <Alert type="warning" title="Пока нечего отправлять">Добавьте хотя бы один документ — паспорт или СНИЛС. Остальное можно дослать позже по этой же ссылке</Alert> : undefined}>
        <Button variant="outline">Передам документы позже</Button><Button>Отправить документы</Button>
      </BottomBar>
    }>
      <ClientHero illustration={<DocsIllustration state="upload" />} badge={hero.badge} title={hero.title}>{hero.text}</ClientHero>
      <Card title="Документы" description="Можно отправить часть сейчас и дополнить позднее" action={<b className="text-text-secondary tabular-nums">{n} из 2</b>}>
        <ProgressBar value={n} max={2} label="Загружено документов" />
        <FormGrid>
          <div className="flex flex-col gap-3">
            <UploadZone title="Паспорт РФ" error={nothing ? 'Загрузите паспорт или СНИЛС' : undefined} onFiles={() => {}} />
            {files.includes('passport') && <FileItem name="Паспорт.pdf" meta="1,8 МБ · загружен" onRemove={() => {}} />}
          </div>
          <div className="flex flex-col gap-3">
            <UploadZone title="СНИЛС" error={nothing || undefined} onFiles={() => {}} />
            {files.includes('snils') && <FileItem name="СНИЛС.pdf" meta="0,4 МБ · загружен" onRemove={() => {}} />}
          </div>
        </FormGrid>
        {hero === DEFAULT_HERO && <Switch label="Будет участвовать созаёмщик" checked={co} onChange={setCo} />}
        {co && <Alert title="Ссылка для созаёмщика">После отправки мы пришлём отдельную ссылку, чтобы созаёмщик загрузил свои документы</Alert>}
      </Card>
      <Broker />
      <Secure />
    </ClientPage>
  );
}

/** Финальные состояния: документы у брокера, передам позже, ссылка устарела */
function ResultScreen({ state, title, text, bar, children }: { state: DocsIllustrationState; title: string; text: string; bar: React.ReactNode; children?: React.ReactNode }) {
  return (
    <ClientPage bar={bar}>
      <ClientHero illustration={<DocsIllustration state={state} />} badge="Заявка № 69670348" title={title}>{text}</ClientHero>
      {children}
      <Broker />
      <Secure />
    </ClientPage>
  );
}

export const Письмо: S = {
  name: 'К.0 Письмо с предложением',
  render: () => (
    <div className="min-h-dvh bg-surface-page px-4 py-10">
      <OfferLetter firstName="Иван" requestLabel="Заявка № BD2A6E33 · 14.11.2026" program="Стандартная ипотека · г. Москва"
        params={[{ label: 'Стоимость', value: '10 000 000 ₽' }, { label: 'Взнос', value: '4 000 000 ₽' }, { label: 'Кредит', value: '6 000 000 ₽' }, { label: 'Срок', value: '25 лет' }]}
        banks={[{ bank: 'Абсолют Банк', rate: '18,95%', payment: '95 619 ₽', income: '159 365 ₽' }, { bank: 'Уралсиб', rate: '19%', payment: '95 764 ₽', income: '159 607 ₽' }]}
        manager={BROKER} />
    </div>
  ),
};
export const Пусто: S = { name: 'К.1 Загрузка — пусто', render: () => <UploadScreen /> };
export const Часть: S = { name: 'К.1 Загружена часть', render: () => <UploadScreen files={['passport']} /> };
export const Созаёмщик: S = { name: 'К.1 Будет созаёмщик', render: () => <UploadScreen files={['passport', 'snils']} co /> };
export const Нечего: S = { name: 'К.1 Нечего отправлять', render: () => <UploadScreen nothing /> };
export const УБрокера: S = {
  name: 'К.2 Документы у брокера',
  render: () => (
    <ResultScreen state="sent" title="Документы отправлены брокеру" text="Дмитрий Сорокин проверит их и свяжется с вами. Если чего-то не хватит, мы пришлём новую ссылку"
      bar={<BottomBar narrow left="Ссылка действует 14 дней"><Button>Загрузить ещё документы</Button></BottomBar>} />
  ),
};
export const Позже: S = {
  name: 'К.3 Передам позже',
  render: () => (
    <ResultScreen state="upload" title="Хорошо, загрузите документы позже" text="Ссылка из письма действует 14 дней. Брокер получил уведомление, что документы будут позже"
      bar={<BottomBar narrow left="Ссылка действует 14 дней"><Button>Загрузить документы</Button></BottomBar>} />
  ),
};
export const Устарела: S = {
  name: 'Ссылка устарела',
  render: () => {
    const [asked, setAsked] = useState(false);
    return (
      <ResultScreen state="waiting" title="Ссылка больше не действует" text="Ссылка на загрузку документов действовала 14 дней. Запросите новую — брокер отправит её на вашу почту"
        bar={<BottomBar narrow><Button disabled={asked} onClick={() => setAsked(true)}>Запросить новую ссылку</Button></BottomBar>}>
        {asked && <Alert type="success" title="Запрос отправлен брокеру">Новая ссылка придёт на ivanov@example.com в течение рабочего дня</Alert>}
      </ResultScreen>
    );
  },
};
export const СтраницаСозаёмщика: S = {
  name: 'Страница созаёмщика',
  render: () => (
    <UploadScreen hero={{ badge: 'Заявка № 69670348 · созаёмщик', title: 'Мария, загрузите свои документы', text: 'Вас добавили созаёмщиком в заявку Ивана Иванова на ипотеку. Нужны только ваши паспорт и СНИЛС' }} />
  ),
};
