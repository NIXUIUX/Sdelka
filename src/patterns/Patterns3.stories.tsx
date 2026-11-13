import { useMemo, useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  StatusBankCard, ConditionsBox, InfoHero, MailItem, BankReply, MailCompose, DealsTable, DEAL_STATUS_TONE, type Deal, type BankStatus,
} from './Status';
import { ApprovedParams } from './Params';
import { FileItem } from '../components/Upload';
import { Button } from '../components/Button';
import { Alert } from '../components/Alert';
import { Badge } from '../components/Badge';
import { Avatar } from '../components/Avatar';
import { Checkbox } from '../components/Checkbox';
import { SearchField } from '../components/SearchField';
import { LineTabs } from '../components/Tabs';
import { FilterChip, Menu } from '../components/Popover';
import { ToastProvider, useToast } from '../components/Toast';
import { plural } from '../utils/format';

const meta: Meta = { title: 'Паттерны флоу/Статусы, письма, заявки', parameters: { layout: 'padded' } };
export default meta;
type S = StoryObj;

const PARAMS = [
  { label: 'Ставка', value: '18,6%' }, { label: 'Платёж в месяц', value: '93 931 ₽' }, { label: 'Сумма кредита', value: '6 000 000 ₽' },
  { label: 'Срок', value: '25 лет' }, { label: 'Первый взнос', value: '4 000 000 ₽' }, { label: 'Программа', value: 'Стандартная ипотека' },
];
const FILES = ['Анкета и согласие.pdf', 'Паспорт.pdf', 'СНИЛС.pdf', 'Справка о доходах.pdf', 'Свидетельство.pdf'];

export const Карточки: S = {
  name: 'Status bank card',
  render: () => (
    <div className="grid max-w-[1200px] grid-cols-[repeat(auto-fill,minmax(340px,1fr))] items-start gap-4">
      <StatusBankCard bank="Абсолют Банк" status="sent" meta="Отправлено сегодня, 10:50" params={PARAMS} selected onSelect={() => {}} />
      <StatusBankCard bank="Уралсиб" status="sent" meta="Отправлено сегодня, 10:50" params={PARAMS} onSelect={() => {}} />
      <StatusBankCard bank="Абсолют Банк" status="approved" meta="Отправлено сегодня, 10:50" params={PARAMS} expanded onExpandedChange={() => {}} onSelect={() => {}} />
    </div>
  ),
};

function StatusScreen() {
  const toast = useToast();
  const [list, setList] = useState<{ name: string; status: BankStatus }[]>([{ name: 'Абсолют Банк', status: 'sent' }, { name: 'Уралсиб', status: 'sent' }]);
  const [cur, setCur] = useState('Абсолют Банк');
  const [compose, setCompose] = useState(false);
  const [draft, setDraft] = useState('');
  const [err, setErr] = useState<string>();
  const [mine, setMine] = useState<Record<string, { text: string; t: string }[]>>({});
  const b = list.find((x) => x.name === cur)!;
  const approved = b.status === 'approved';
  const refresh = () => {
    const i = list.findIndex((x) => x.status === 'sent');
    if (i < 0) return toast('Новых решений пока нет');
    setList(list.map((x, j) => (j === i ? { ...x, status: 'approved' } : x)));
    toast(`${list[i]!.name}: заявка одобрена`);
  };
  const send = () => {
    if (!draft.trim()) return setErr('Напишите текст письма');
    setMine((m) => ({ ...m, [cur]: [...(m[cur] ?? []), { text: draft.trim(), t: 'сейчас' }] }));
    setDraft(''); setCompose(false); toast(`Письмо отправлено в ${cur}`);
  };
  return (
    <div className="grid grid-cols-[minmax(0,1fr)] items-start gap-6 lg:grid-cols-[minmax(0,1fr)_384px]">
      <section className="flex flex-col gap-6 rounded-20 border border-border-default bg-surface-white p-8 max-sm:p-5">
        <div className="flex items-center gap-3">
          <Avatar name={b.name} size={36} />
          <div className="min-w-0 flex-1"><h2 className="m-0 text-h2">{b.name}</h2><small className="text-body-s text-text-secondary">Заявка № 036968-58791 · отправлена сегодня, 10:50</small></div>
          <Badge tone={approved ? 'success' : 'accent'}>{approved ? 'Одобрено' : 'Отправлено'}</Badge>
        </div>
        {approved ? (
          <ApprovedParams onEdit={() => {}} note="Направляли: 18,6% · 6 000 000 ₽ · 25 лет" items={[
            { label: 'Сумма кредита', value: '6 000 000 ₽' }, { label: 'Ставка', value: '18,2%', highlight: true }, { label: 'Срок', value: '25 лет' },
            { label: 'Платёж в месяц', value: '93 523 ₽' }, { label: 'Первый взнос', value: '4 000 000 ₽' }, { label: 'Решение действует до', value: '09.02.2027' },
          ]} />
        ) : (
          <>
            <ConditionsBox note="* Направлено по анкете. Окончательные условия подтверждает банк" items={[
              { label: 'Ставка', value: '18,6%*', accent: true }, { label: 'Платёж в месяц', value: '93 931 ₽' },
              { label: 'Сумма кредита', value: '6 000 000 ₽' }, { label: 'Срок', value: '25 лет' },
            ]} />
            <InfoHero title="Ожидаем решение банка">
              Направленные параметры сохранены. Сумма, ставка и платёж по решению появятся после ответа банка — обычно в течение 1–3 рабочих дней
            </InfoHero>
          </>
        )}
        <div className="flex flex-col gap-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h3 className="m-0 flex items-center gap-2 text-h3"><span className="text-action-primary"><Icon20 /></span>Переписка с банком</h3>
            {!compose && <Button variant="link" icon="message" onClick={() => setCompose(true)}>Написать письмо</Button>}
          </div>
          {compose && (
            <MailCompose to={`${b.name} · mortgage@example.com`} subject="Re: Новая заявка на ипотеку № 036968-58791" value={draft} error={err}
              onChange={(v) => { setDraft(v); setErr(undefined); }} onCancel={() => { setCompose(false); setDraft(''); }} onSend={send} />
          )}
          {(mine[cur] ?? []).slice().reverse().map((m, i) => (
            <MailItem key={i} collapsible={false} title="Письмо в банк" subtitle="Дмитрий Сорокин" time={m.t}>{m.text}</MailItem>
          ))}
          <MailItem title="Письмо с заявкой" subtitle="Исходный пакет и направленные условия" time="10:50"
            to="mortgage@example.com" subject="Новая заявка на ипотеку № 036968-58791"
            notice={<Alert type="warning" title="Не меняйте тему письма и отвечайте через «Ответить всем»">Так ответ банка не потеряется и мы быстрее его обработаем</Alert>}
            signature="С уважением, ООО «Сделка.РФ», Дмитрий Сорокин, +7 900 000-00-00"
            attachments={FILES.map((f) => <FileItem key={f} name={f} meta="Иванов Иван Иванович" />)}>
            Добрый день! Просим рассмотреть новую заявку на ипотеку № 036968-58791 и отправить результат рассмотрения ответным письмом. Документы по заявке во вложении
          </MailItem>
          <BankReply received={approved}>{approved ? 'Заявка одобрена. Ставка 18,2%, сумма 6 000 000 ₽, срок 25 лет. Решение действует 90 дней' : undefined}</BankReply>
        </div>
      </section>
      <aside className="flex flex-col gap-4 max-lg:-order-1">
        <div className="flex items-center justify-between gap-3">
          <span className="text-caption text-text-secondary">Статусы обновлены<br />сегодня в 16:52</span>
          <Button variant="outline" size="s" icon="refresh" onClick={refresh}>Обновить статусы</Button>
        </div>
        {list.map((x) => <StatusBankCard key={x.name} bank={x.name} status={x.status} meta="Отправлено сегодня, 10:50" params={PARAMS} selected={x.name === cur} onSelect={() => { setCur(x.name); setCompose(false); }} />)}
        <Button variant="outline" icon="plus" fullWidth>Отправить в другой банк</Button>
      </aside>
    </div>
  );
}
const Icon20 = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>;

export const Статусы: S = {
  name: 'Экран «Статус в банках» — сборка',
  render: () => <ToastProvider top={16}><StatusScreen /></ToastProvider>,
};

const DEALS0: (Omit<Deal, 'statusTone'> & { program: string; mine?: boolean; status: keyof typeof DEAL_STATUS_TONE })[] = [
  { id: 1001, program: 'Стандартная ипотека', name: 'Алексей Морозов', org: 'ООО «Сделка.РФ»', region: 'Москва', banks: ['ПСБ'], sum: 3000000, term: 25, created: '01.10.2026', updated: '05.10.2026', status: 'Консультация', mine: true },
  { id: 1002, program: 'Семейная ипотека', name: 'Марина Соколова', co: ['Сергей Соколов'], org: 'ООО «Сделка.ЦП»', region: 'Екатеринбург', banks: ['ДОМ.РФ', 'Совкомбанк'], sum: 4200000, term: 20, created: '02.10.2026', updated: '05.10.2026', status: 'Заполнение' },
  { id: 1003, program: 'Стандартная ипотека', name: 'Илья Волков', org: 'ООО «Сделка.РФ»', region: 'Тюмень', banks: ['ПСБ', 'ВТБ'], sum: 5600000, term: 30, created: '03.10.2026', updated: '05.10.2026', status: 'Доработка', mine: true, unread: true },
  { id: 1004, program: 'IT-ипотека', name: 'Анна Лебедева', org: 'ООО «Сделка.ЦП»', region: 'Казань', banks: ['ПСБ'], sum: 2800000, term: 15, created: '04.10.2026', updated: '05.10.2026', status: 'Одобрено' },
  { id: 1005, program: 'Стандартная ипотека', name: 'Павел Орлов', org: 'ООО «Сделка.РФ»', region: 'Санкт-Петербург', banks: ['ВТБ'], sum: 6400000, term: 25, created: '05.10.2026', updated: '05.10.2026', status: 'Отказ', mine: true },
  { id: 1006, program: 'Семейная ипотека', name: 'Ольга Белова', co: ['Дмитрий Белов'], org: 'ООО «Сделка.ЦП»', region: 'Москва', banks: ['ДОМ.РФ'], sum: 7100000, term: 30, created: '06.10.2026', updated: '06.10.2026', status: 'Подписание' },
  { id: 1007, program: 'Стандартная ипотека', name: 'Иван Иванов', org: 'ООО «Сделка.РФ»', region: 'Тверь', banks: ['Абсолют Банк', 'Уралсиб'], sum: 6000000, term: 25, created: '07.10.2026', updated: '08.10.2026', status: 'Отправлено в банки', mine: true, unread: true },
  { id: 1008, program: 'Дальневосточная ипотека', name: 'Екатерина Смирнова', org: 'ООО «Сделка.РФ»', region: 'Казань', banks: ['Сбербанк'], sum: 3500000, term: 20, created: '12.09.2026', updated: '20.09.2026', status: 'Одобрено', mine: true, archived: true },
];

function DealsScreen() {
  const toast = useToast();
  const [deals, setDeals] = useState(DEALS0);
  const [q, setQ] = useState('');
  const [mine, setMine] = useState(false);
  const [unread, setUnread] = useState(false);
  const [arch, setArch] = useState(false);
  const [region, setRegion] = useState('все');
  const regions = ['все', ...[...new Set(DEALS0.map((d) => String(d.region)))].sort()];
  const list = useMemo(() => deals.filter((d) => (arch || !d.archived)
    && (!q.trim() || [d.name, ...(d.co ?? []), String(d.id)].join(' ').toLowerCase().includes(q.trim().toLowerCase()))
    && (!mine || d.mine) && (!unread || d.unread) && (region === 'все' || d.region === region)), [deals, q, mine, unread, arch, region]);
  const total = deals.filter((d) => !d.archived).length;
  const unreadN = deals.filter((d) => d.unread && !d.archived).length;
  const reset = () => { setQ(''); setMine(false); setUnread(false); setArch(false); setRegion('все'); };
  return (
    <div className="flex flex-col">
      <LineTabs aria-label="Разделы" value="deals" onChange={() => toast('Моя статистика — следующий этап')} className="ml-[43px] w-max max-w-[calc(100%-43px)] max-sm:ml-0"
        items={[{ value: 'deals', label: 'Ипотечные заявки' }, { value: 'stats', label: 'Моя статистика' }]} />
      <section className="flex flex-col gap-5 rounded-20 border border-border-default bg-surface-white p-6">
        <div className="flex items-start justify-between gap-3">
          <div><h2 className="m-0 text-h2">Ипотечные заявки</h2><p className="m-0 mt-1 text-body-m text-text-secondary">Клиенты, заявки и ответы банков</p></div>
          <Badge tone="accent">{total} {plural(total, 'заявка', 'заявки', 'заявок')}</Badge>
        </div>
        <div className="flex flex-wrap items-center gap-4">
          <SearchField value={q} onChange={setQ} className="flex-[1_1_320px]" />
          <Checkbox label="Созданные мной" checked={mine} onChange={setMine} />
          <Checkbox label={<>Только непрочитанные <Badge tone="accent" dot={false} size="xs" className="ml-1.5">{unreadN}</Badge></>} checked={unread} onChange={setUnread} />
          <Checkbox label="Показывать архив" checked={arch} onChange={setArch} />
        </div>
        <div className="flex flex-wrap gap-2">
          <FilterChip label="Регион:" value={region} active width={undefined}>{(close) => <Menu items={regions} value={region} onPick={(v) => { setRegion(v); close(); }} />}</FilterChip>
          <Button variant="ghost" size="s" icon="rotate-ccw" onClick={reset}>Сброс фильтров</Button>
        </div>
        <DealsTable deals={list.map((d) => ({ ...d, statusTone: DEAL_STATUS_TONE[d.status as keyof typeof DEAL_STATUS_TONE] }))} onReset={reset}
          onOpen={(d) => setDeals((all) => all.map((x) => (x.id === d.id ? { ...x, unread: false } : x)))}
          onArchiveToggle={(d) => { setDeals((all) => all.map((x) => (x.id === d.id ? { ...x, archived: !x.archived } : x))); toast(d.archived ? `Заявка № ${d.id} возвращена из архива` : `Заявка № ${d.id} перенесена в архив`); }} />
      </section>
    </div>
  );
}

export const Заявки: S = {
  name: 'Экран «Ипотечные заявки» — сборка',
  render: () => <ToastProvider top={16}><DealsScreen /></ToastProvider>,
};
