import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { BankRow, PickedBanks, type BankOffer } from './Banks';
import { CreditParams, ApprovedParams, SummaryRow } from './Params';
import { pct, rub } from '../utils/format';

const meta: Meta = { title: 'Паттерны флоу/Банки и параметры' };
export default meta;
type S = StoryObj;

const OFFERS: (BankOffer & { sentAt?: string; unfit?: string })[] = [
  { bank: 'МКБ', program: 'Стандартная ипотека', rate: 18.95, payment: 95619, income: 159365 },
  { bank: 'Абсолют Банк', program: 'Стандартная ипотека', rate: 18.6, payment: 93523, income: 155872, sentAt: 'сегодня, 10:50' },
  { bank: 'Уралсиб', program: 'Стандартная ипотека', rate: 19.2, payment: 97118, income: 161863 },
  { bank: 'ВТБ', program: 'Стандартная ипотека', rate: 18.95, payment: 95619, income: 159365, unfit: 'Укажите срок кредита до 15 лет' },
];

export const Строки: S = {
  name: 'Bank row — все состояния',
  render: () => (
    <div className="flex max-w-[744px] flex-col gap-4 rounded-20 bg-surface-white p-4">
      <BankRow {...OFFERS[0]!} onToggle={() => {}} onDetails={() => {}} />
      <BankRow {...OFFERS[0]!} selected onToggle={() => {}} onDetails={() => {}} />
      <BankRow {...OFFERS[0]!} sentAt="сегодня, 10:50" onDetails={() => {}} />
      <BankRow {...OFFERS[3]!} bank="ВТБ" unfitReason="Укажите срок кредита до 15 лет" />
    </div>
  ),
};

export const Подбор: S = {
  name: 'Выбор банков — живой пример',
  render: () => {
    const [sel, setSel] = useState<string[]>(['МКБ']);
    const toggle = (b: string, v: boolean) => setSel((s) => (v ? [...s, b] : s.filter((x) => x !== b)));
    const picked = [
      ...OFFERS.filter((o) => o.sentAt).map((o) => ({ bank: o.bank, meta: `Отправлено ${o.sentAt}`, locked: true })),
      ...OFFERS.filter((o) => sel.includes(o.bank)).map((o) => ({ bank: o.bank, meta: `${pct(o.rate)} · ${rub(o.payment)} в месяц` })),
    ];
    return (
      <div className="grid grid-cols-[minmax(0,1fr)] items-start gap-6 lg:grid-cols-[minmax(0,1fr)_384px]">
        <section className="flex flex-col rounded-20 border border-border-default bg-surface-white p-4">
          {OFFERS.filter((o) => !o.unfit).map((o) => (
            <BankRow key={o.bank} {...o} selected={sel.includes(o.bank)} onToggle={(v) => toggle(o.bank, v)} onDetails={() => {}} />
          ))}
          <h3 className="mx-4 mt-6 mb-3 text-overline text-text-muted">Не подходят по условиям</h3>
          {OFFERS.filter((o) => o.unfit).map((o) => <BankRow key={o.bank} {...o} unfitReason={o.unfit} />)}
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
  render: () => (
    <div className="flex flex-wrap items-start gap-6">
      <CreditParams className="w-96" banks={['МКБ', 'Альфа-Банк', 'Промсвязьбанк']} program="Стандартная ипотека" amount={6_000_000} params={PARAMS} onEdit={() => {}} />
      <CreditParams className="w-96" defaultExpanded banks={['МКБ', 'Альфа-Банк', 'Промсвязьбанк', 'ВТБ']} program="Стандартная ипотека" amount={6_000_000} params={PARAMS} onEdit={() => {}} />
      <ApprovedParams className="w-full max-w-[680px]" onEdit={() => {}} note="Направляли: 18,6% · 6 000 000 ₽ · 25 лет" items={[
        { label: 'Сумма кредита', value: '6 000 000 ₽' }, { label: 'Ставка', value: '18,2%', highlight: true }, { label: 'Срок', value: '25 лет' },
        { label: 'Платёж в месяц', value: '93 523 ₽' }, { label: 'Первый взнос', value: '4 000 000 ₽' }, { label: 'Решение действует до', value: '09.02.2027' },
      ]} />
    </div>
  ),
};

export const Сводка: S = {
  name: 'Summary row',
  render: () => (
    <div className="max-w-[680px] rounded-20 bg-surface-white px-6 py-2">
      <SummaryRow state="done" title="Подбор условий" summary="Квартира в новостройке · 6 000 000 ₽ · 25 лет" onEdit={() => {}} />
      <SummaryRow state="done" title="Персональные данные" summary="Иванов Иван Иванович · 12.04.1988 · паспорт 4510 123456" onEdit={() => {}} />
      <SummaryRow state="missing" title="Доходы и работа" onEdit={() => {}} />
      <SummaryRow state="done" title="Документы" summary="5 файлов" onEdit={() => {}} />
    </div>
  ),
};
