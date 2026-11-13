/* Общие куски экранов для историй «Экраны/…». В пакет не входят — только Storybook. */
import { useState, type ReactNode } from 'react';
import { AppHeader, FlowHead, StepsNav, BottomBar, HelpCard, Container, Autosave } from '../components/Layout';
import { PageLayout } from '../components/Surface';
import { Button } from '../components/Button';
import { Chip, type ChipProps } from '../components/Chip';
import { Popover } from '../components/Popover';
import { Modal, type ModalProps } from '../components/Modal';
import { ToastProvider } from '../components/Toast';
import { ScorePill } from '../patterns/Prescoring';
import { CreditParams } from '../patterns/Params';
import { ClientHeader } from '../patterns/Extra';

export const STEPS = [
  { key: 'podbor', label: 'Подбор условий' }, { key: 'personal', label: 'Персональные данные' }, { key: 'family', label: 'Семейное положение' },
  { key: 'income', label: 'Доход и работа' }, { key: 'signing', label: 'Подписание и отправка' },
];
export const STEP_N: Record<string, number> = { podbor: 1, personal: 2, family: 3, income: 4, signing: 5 };
export const doneBefore = (key: string) => STEPS.slice(0, STEPS.findIndex((s) => s.key === key)).map((s) => s.key);

export const PARAMS = [
  { label: 'Цель', value: 'Квартира в новостройке' }, { label: 'Программа', value: 'Стандартная ипотека' }, { label: 'Регион', value: 'г. Москва' },
  { label: 'Стоимость', value: '10 000 000 ₽' }, { label: 'Первый взнос', value: '4 000 000 ₽ · 40%' }, { label: 'Срок', value: '25 лет' },
];

export const OFFERS = [
  { bank: 'Абсолют Банк', program: 'Стандартная ипотека', rate: 18.95, payment: 95619, income: 159365 },
  { bank: 'Уралсиб', program: 'Стандартная ипотека', rate: 19.0, payment: 95764, income: 159607 },
  { bank: 'МКБ', program: 'Стандартная ипотека', rate: 19.1, payment: 96344, income: 160574 },
  { bank: 'Альфа-Банк', program: 'Стандартная ипотека', rate: 19.45, payment: 98280, income: 163801 },
  { bank: 'Промсвязьбанк', program: 'Стандартная ипотека', rate: 19.25, payment: 97106, income: 161843 },
  { bank: 'ВТБ', program: 'Стандартная ипотека', rate: 19.3, payment: 97408, income: 162347 },
];
export const UNFIT = [
  { bank: 'Сбербанк', program: 'Стандартная ипотека', rate: 18.4, payment: 94895, income: 158159, reason: 'Укажите первый взнос от 50%' },
  { bank: 'Т-Банк', program: 'Стандартная ипотека', rate: 18.8, payment: 95320, income: 158867, reason: 'Укажите срок кредита до 20 лет' },
  { bank: 'Совкомбанк', program: 'Стандартная ипотека', rate: 19.6, payment: 99010, income: 165017, reason: 'Минимальная стоимость объекта — 12 000 000 ₽' },
];

export const BROKER = { name: 'Дмитрий Сорокин', company: 'ООО «Сделка.РФ»', phone: '+7 900 000-00-00', email: 'd.sorokin@sdelka.rf', hours: 'Пн–Пт, 9:00–19:00 (МСК)' };

export const Header = () => (
  <AppHeader user={BROKER.name} org={BROKER.company} onOrgClick={() => {}} actions={<AppHeader.IconButton icon="help-circle" label="Справка" />} />
);

/** Боковая колонка анкеты: параметры кредита, шаги, помощь */
export function Aside({ cur, banks = ['Абсолют Банк', 'Уралсиб'], top, steps = STEPS, done }: {
  cur: string; banks?: string[]; top?: ReactNode; steps?: typeof STEPS; done?: string[];
}) {
  return (
    <>
      {top ?? <CreditParams banks={banks} program="Стандартная ипотека" amount={6_000_000} params={PARAMS} onEdit={() => {}} />}
      <StepsNav steps={steps} current={cur} done={done ?? doneBefore(cur)} onStep={() => {}} />
      <Help />
    </>
  );
}

export const Help = () => (
  <HelpCard action={<Button variant="outline" size="s">Открыть чат</Button>} footer={<>Ответы на частые вопросы собрали <a className="font-semibold text-action-primary" href="#">здесь</a></>} />
);

/** Страница анкеты брокера: шапка, «Заявка № 1009», двухколоночная раскладка, нижняя панель */
export function BrokerPage({ meta, children, aside, bar, title = 'Заявка № 1009', action, score = 902 }: {
  meta: ReactNode; children: ReactNode; aside?: ReactNode; bar?: ReactNode; title?: ReactNode; action?: ReactNode; score?: number | null;
}) {
  return (
    <ToastProvider top={84}>
      <div className="flex min-h-dvh flex-col bg-surface-page">
        <Header />
        <main className="flex-1 pb-6">
          <Container className="flex flex-col gap-5 pt-6">
            <FlowHead title={title} meta={meta}
              action={action ?? (score ? <ScorePill score={score} onClick={() => {}} /> : <Button variant="outline" size="s" icon="gauge">Прескоринг</Button>)} />
            {aside ? <PageLayout aside={aside}>{children}</PageLayout> : children}
          </Container>
        </main>
        {bar}
      </div>
    </ToastProvider>
  );
}

/** Нижняя панель шага анкеты: «Назад» + основная кнопка */
export function StepBar({ left, primary = 'Продолжить', alert, back = true }: { left?: ReactNode; primary?: ReactNode; alert?: ReactNode; back?: boolean }) {
  return (
    <BottomBar alert={alert} left={left ?? <Autosave />}>
      {back && <Button variant="outline">Назад</Button>}
      <Button>{primary}</Button>
    </BottomBar>
  );
}

/** Страница клиента: упрощённая шапка, узкая колонка, нижняя панель */
export function ClientPage({ children, bar }: { children: ReactNode; bar?: ReactNode }) {
  return (
    <div className="flex min-h-dvh flex-col bg-surface-page">
      <ClientHeader onHelp={() => {}} />
      <main className="flex-1">
        <Container narrow className="flex flex-col gap-4 pt-10 pb-6">{children}</Container>
      </main>
      {bar}
    </div>
  );
}

/** Открытое модальное окно поверх пустой страницы — для историй с окнами */
export function ModalScene(props: Omit<ModalProps, 'open' | 'onClose'> & { onClose?: () => void }) {
  const [open, setOpen] = useState(true);
  return (
    <div className="min-h-dvh bg-surface-page p-6">
      {!open && <Button variant="outline" onClick={() => setOpen(true)}>Открыть окно</Button>}
      <Modal {...props} open={open} onClose={props.onClose ?? (() => setOpen(false))} />
    </div>
  );
}

/** Чип фильтра с уже открытым поповером — для историй «фильтр открыт», «ошибка в фильтре» */
export function OpenChip({ children, width = 320, align, ...chip }: Omit<ChipProps, 'open' | 'children'> & { children: ReactNode; width?: number; align?: 'start' | 'end' }) {
  const [open, setOpen] = useState(true);
  return (
    <Popover open={open} onOpenChange={setOpen} width={width} align={align} trigger={(p) => <Chip {...chip} {...p} open={open} />}>
      {children}
    </Popover>
  );
}
