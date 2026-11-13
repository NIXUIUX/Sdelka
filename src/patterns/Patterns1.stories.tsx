import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { BankRow, MoreButton, PickedBanks, type BankOffer } from './Banks';
import { CreditParams, ApprovedParams, SummaryRow, SummaryList, type ApprovedValues } from './Params';
import { TextTabs } from '../components/Tabs';
import { SearchField } from '../components/SearchField';
import { Badge } from '../components/Badge';
import { annuity, pct, rub, years } from '../utils/format';

const meta: Meta = { title: 'Паттерны флоу/Банки и параметры' };
export default meta;
type S = StoryObj;

type Offer = BankOffer & { sentAt?: string; unfit?: string };
const OFFERS: Offer[] = [
  { bank: 'Абсолют Банк', program: 'Стандартная ипотека', rate: 18.6, payment: 93931, income: 156552, sentAt: 'сегодня, 10:50' },
  { bank: 'МКБ', program: 'Стандартная ипотека', rate: 18.95, payment: 95619, income: 159365 },
  { bank: 'Уралсиб', program: 'Стандартная ипотека', rate: 19.2, payment: 97118, income: 161863 },
  { bank: 'Альфа-Банк', program: 'Стандартная ипотека', rate: 19.4, payment: 98121, income: 163535 },
  { bank: 'ВТБ', program: 'Стандартная ипотека', rate: 18.95, payment: 95619, income: 159365, unfit: 'Укажите срок кредита до 15 лет' },
  { bank: 'Сбербанк', program: 'Стандартная ипотека', rate: 19.1, payment: 96500, income: 160800, unfit: 'Укажите первый взнос от 50%' },
];

export const Подбор: S = {
  name: 'Список банков — как в подборе',
  render: () => {
    const [sel, setSel] = useState<string[]>(['МКБ']);
    const [tab, setTab] = useState('all');
    const [q, setQ] = useState('');
    const [more, setMore] = useState(false);
    const toggle = (b: string, v: boolean) => setSel((s) => (v ? [...s, b] : s.filter((x) => x !== b)));
    const fit = OFFERS.filter((o) => !o.unfit && (!q || o.bank.toLowerCase().includes(q.toLowerCase())) && (tab !== 'sel' || sel.includes(o.bank) || o.sentAt));
    const unfit = OFFERS.filter((o) => o.unfit);
    const picked = [
      ...OFFERS.filter((o) => o.sentAt).map((o) => ({ bank: o.bank, meta: `Отправлено ${o.sentAt}`, locked: true })),
      ...OFFERS.filter((o) => sel.includes(o.bank) && !o.sentAt).map((o) => ({ bank: o.bank, meta: `${pct(o.rate)} · ${rub(o.payment)} в месяц` })),
    ];
    return (
      <div className="grid grid-cols-[minmax(0,1fr)] items-start gap-6 lg:grid-cols-[minmax(0,1fr)_384px]">
        <section className="flex flex-col gap-3 rounded-20 border border-border-default bg-surface-white p-8 max-sm:p-5">
          <TextTabs aria-label="Фильтр" value={tab} onChange={setTab} items={[{ value: 'all', label: 'Все' }, { value: 'params', label: 'По параметрам' }, { value: 'sel', label: `Выбрано: ${picked.length}` }]} />
          <SearchField value={q} onChange={setQ} placeholder="Найти банк" label="Найти банк" />
          <div>
            {fit.slice(0, more ? undefined : 3).map((o) => (
              <BankRow key={o.bank} {...o} sent={o.sentAt ? { at: o.sentAt } : undefined} selected={sel.includes(o.bank)} onToggle={(v) => toggle(o.bank, v)} onDetails={() => {}} />
            ))}
          </div>
          {fit.length > 3 && <MoreButton open={more} onClick={() => setMore(!more)}>{more ? 'Свернуть' : `Ещё ${fit.length - 3} предложение`}</MoreButton>}
          {tab !== 'sel' && (
            <div className="flex flex-col gap-2.5 pt-2">
              <div className="flex items-center gap-2"><h3 className="m-0 text-[16px] leading-6 font-semibold">Не подошли под параметры</h3><Badge dot={false}>{unfit.length}</Badge></div>
              <p className="-mt-1 m-0 text-[13px] text-text-secondary">Измените параметры сделки, чтобы эти банки появились в подборе</p>
              <div>{unfit.map((o) => <BankRow key={o.bank} {...o} unfitReason={o.unfit} />)}</div>
            </div>
          )}
        </section>
        <PickedBanks program="Стандартная ипотека" amount={6_000_000} banks={picked} onRemove={(b) => toggle(b, false)} />
      </div>
    );
  },
};

const PARAMS = [
  { label: 'Цель', value: 'Квартира в новостройке' }, { label: 'Программа', value: 'Стандартная ипотека' },
  { label: 'Регион', value: 'г. Москва' }, { label: 'Стоимость', value: '10 000 000 ₽' },
  { label: 'Первый взнос', value: '4 000 000 ₽ · 40%' }, { label: 'Срок', value: '25 лет' },
];

export const Параметры: S = {
  name: 'Credit params и Approved params',
  render: () => {
    const [v, setV] = useState<ApprovedValues>({ sum: 6_000_000, rate: 18.2, term: 25 });
    return (
      <div className="flex flex-wrap items-start gap-6">
        <CreditParams className="w-96" banks={['Абсолют Банк', 'Уралсиб']} program="Стандартная ипотека" amount={6_000_000} params={PARAMS} onEdit={() => {}} />
        <CreditParams className="w-96" defaultExpanded banks={['МКБ', 'Альфа-Банк', 'Промсвязьбанк', 'ВТБ']} program="Стандартная ипотека" amount={6_000_000} params={PARAMS} onEdit={() => {}} />
        <ApprovedParams className="w-full max-w-[680px]" values={v} onSave={setV} note="Направляли: 18,6% · 6 000 000 ₽ · 25 лет" items={[
          { label: 'Сумма кредита', value: rub(v.sum) }, { label: 'Ставка', value: pct(v.rate), highlight: true }, { label: 'Срок', value: years(v.term) },
          { label: 'Платёж в месяц', value: rub(annuity(v.sum, v.rate, v.term)) }, { label: 'Первый взнос', value: '4 000 000 ₽' }, { label: 'Решение действует до', value: '09.02.2027' },
        ]} />
      </div>
    );
  },
};

export const Сводка: S = {
  name: 'Summary — «Проверьте данные заявки»',
  render: () => (
    <div className="max-w-[760px] rounded-20 bg-surface-white p-8">
      <h1 className="m-0 text-h1">Проверьте данные заявки</h1>
      <p className="m-0 mt-1 mb-6 text-body-m text-text-secondary">Краткая сводка по шагам анкеты. Если что-то не так — вернитесь к нужному разделу</p>
      <SummaryList>
        <SummaryRow state="done" title="Персональные данные" summary="Иванов Иван Иванович · 12.04.1988 · паспорт 4510 123456" onEdit={() => {}} />
        <SummaryRow state="done" title="Семейное положение" summary="В браке · детей: нет · супруг не созаёмщик" onEdit={() => {}} />
        <SummaryRow state="missing" title="Доход и работа" onEdit={() => {}} />
      </SummaryList>
    </div>
  ),
};
