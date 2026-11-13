import { useMemo, useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { BottomBar, Container } from '../components/Layout';
import { Button } from '../components/Button';
import { Badge } from '../components/Badge';
import { Checkbox } from '../components/Checkbox';
import { SearchField } from '../components/SearchField';
import { LineTabs } from '../components/Tabs';
import { Chip } from '../components/Chip';
import { Input } from '../components/Input';
import { FilterPanel, Menu } from '../components/Popover';
import { DealsTable, DEAL_STATUS_TONE, type Deal } from '../patterns/Status';
import { plural } from '../utils/format';
import { Header, OpenChip } from './kit';

const meta: Meta = { title: 'Экраны/Сценарии/0.0 Ипотечные заявки', parameters: { layout: 'fullscreen' } };
export default meta;
type S = StoryObj;

type Row = Omit<Deal, 'statusTone' | 'status'> & { status: keyof typeof DEAL_STATUS_TONE; mine?: boolean };
const DEALS: Row[] = [
  { id: 1009, name: 'Иванов Иван Иванович', org: 'ООО «Сделка.РФ»', region: 'Москва', banks: ['Абсолют Банк', 'Уралсиб'], sum: 6000000, term: 25, created: '13.11.2026', updated: '13.11.2026', status: 'Отправлено в банки', mine: true, unread: true },
  { id: 1002, name: 'Марина Соколова', co: ['Сергей Соколов'], org: 'ООО «Сделка.ЦП»', region: 'Екатеринбург', banks: ['ДОМ.РФ', 'Совкомбанк'], sum: 4200000, term: 20, created: '02.10.2026', updated: '05.10.2026', status: 'Заполнение' },
  { id: 1003, name: 'Илья Волков', org: 'ООО «Сделка.РФ»', region: 'Тюмень', banks: ['ПСБ', 'ВТБ'], sum: 5600000, term: 30, created: '03.10.2026', updated: '05.10.2026', status: 'Доработка', mine: true, unread: true },
  { id: 1004, name: 'Анна Лебедева', org: 'ООО «Сделка.ЦП»', region: 'Казань', banks: ['ПСБ'], sum: 2800000, term: 15, created: '04.10.2026', updated: '05.10.2026', status: 'Одобрено' },
  { id: 1005, name: 'Павел Орлов', org: 'ООО «Сделка.РФ»', region: 'Санкт-Петербург', banks: ['ВТБ'], sum: 6400000, term: 25, created: '05.10.2026', updated: '05.10.2026', status: 'Отказ', mine: true },
  { id: 1006, name: 'Ольга Белова', co: ['Дмитрий Белов'], org: 'ООО «Сделка.ЦП»', region: 'Москва', banks: ['ДОМ.РФ'], sum: 7100000, term: 30, created: '06.10.2026', updated: '06.10.2026', status: 'Подписание' },
  { id: 36968, name: 'Иванова Мария Петровна', org: 'ООО «Северсталь-Инфо»', region: 'Москва', banks: ['Уралсиб'], sum: 6000000, term: 25, created: '10.11.2026', updated: '13.11.2026', status: 'Одобрено', archived: true, mine: true },
  { id: 36101, name: 'Олег Николаев', org: 'ООО «Сделка.РФ»', region: 'Пермь', banks: ['ВТБ'], sum: 3900000, term: 20, created: '21.09.2026', updated: '30.09.2026', status: 'Отказ', archived: true },
  { id: 35877, name: 'Екатерина Смирнова', org: 'ООО «Сделка.РФ»', region: 'Казань', banks: ['Сбербанк'], sum: 3500000, term: 20, created: '12.09.2026', updated: '20.09.2026', status: 'Одобрено', archived: true },
];
const REGIONS = ['все', 'Екатеринбург', 'Казань', 'Москва', 'Пермь', 'Санкт-Петербург', 'Тюмень'];

type Open = 'region' | 'date' | null;
interface Props { q?: string; mine?: boolean; unread?: boolean; archive?: boolean; region?: string; open?: Open; dateError?: boolean }

/** Экран «Ипотечные заявки» с начальным состоянием из props — каждая история задаёт свою ветку */
function DealsScreen({ q: q0 = '', mine: m0 = false, unread: u0 = false, archive: a0 = false, region: r0 = 'все', open = null, dateError }: Props) {
  const [q, setQ] = useState(q0);
  const [mine, setMine] = useState(m0);
  const [unread, setUnread] = useState(u0);
  const [arch, setArch] = useState(a0);
  const [region, setRegion] = useState(r0);
  const list = useMemo(() => DEALS.filter((d) => (arch || !d.archived)
    && (!q.trim() || [d.name, ...(d.co ?? []), String(d.id)].join(' ').toLowerCase().includes(q.trim().toLowerCase()))
    && (!mine || d.mine) && (!unread || d.unread) && (region === 'все' || d.region === region)), [q, mine, unread, arch, region]);
  const total = DEALS.filter((d) => !d.archived).length;
  const archived = DEALS.filter((d) => d.archived).length;
  const unreadN = DEALS.filter((d) => d.unread && !d.archived).length;
  const reset = () => { setQ(''); setMine(false); setUnread(false); setArch(false); setRegion('все'); };
  const chip = (label: string, value = 'все') => <Chip label={label} value={value} />;
  return (
    <div className="flex min-h-dvh flex-col bg-surface-page">
      <Header />
      <main className="flex-1 pb-6">
        <Container className="flex flex-col pt-6">
          <LineTabs aria-label="Разделы" value="deals" onChange={() => {}} className="ml-[43px] w-max max-w-[calc(100%-43px)] max-sm:ml-0"
            items={[{ value: 'deals', label: 'Ипотечные заявки' }, { value: 'stats', label: 'Моя статистика' }]} />
          <section className="flex flex-col gap-5 rounded-20 border border-border-default bg-surface-white p-6">
            <div className="flex items-start justify-between gap-3">
              <div><h2 className="m-0 text-h2">Ипотечные заявки</h2><p className="m-0 mt-1 text-body-m text-text-secondary">Клиенты, заявки и ответы банков</p></div>
              <Badge tone="accent">{total} {plural(total, 'заявка', 'заявки', 'заявок')}</Badge>
            </div>
            <div className="flex flex-wrap items-center gap-4">
              <SearchField value={q} onChange={setQ} className="flex-[1_1_320px]" />
              <Checkbox label="Созданные мной" checked={mine} onChange={setMine} />
              <Checkbox label={<>Только непрочитанные <Badge tone="counter" size="xs" className="ml-1.5">{unreadN}</Badge></>} checked={unread} onChange={setUnread} />
              <Checkbox label="Показывать архив" checked={arch} onChange={setArch} />
            </div>
            <div className="flex flex-wrap items-center gap-2">
              {open === 'date' ? (
                <OpenChip label="Дата создания:" value="12.10 – 01.10" active width={400}>
                  <FilterPanel title="Дата создания" applyDisabled={dateError} onApply={() => {}}>
                    <div className="grid grid-cols-2 gap-3">
                      <Input label="С" mask="date" defaultValue="12.10.2026" error={dateError ? 'Дата «с» должна быть раньше даты «по»' : undefined} />
                      <Input label="По" mask="date" defaultValue="01.10.2026" error={dateError || undefined} />
                    </div>
                  </FilterPanel>
                </OpenChip>
              ) : chip('Дата создания:')}
              {chip('Обновлён статус:')}
              {open === 'region' ? (
                <OpenChip label="Регион:" value={region} active={region !== 'все'} width={240}>
                  <Menu items={REGIONS} value={region} onPick={setRegion} />
                </OpenChip>
              ) : <Chip label="Регион:" value={region} active={region !== 'все'} />}
              {chip('Программа:')}{chip('Статус:')}{chip('Банк:')}
              <Button variant="subtle" icon="rotate-ccw" onClick={reset}>Сброс фильтров</Button>
            </div>
            <DealsTable deals={list.map((d) => ({ ...d, statusTone: DEAL_STATUS_TONE[d.status] }))} onReset={reset} onOpen={() => {}} onArchiveToggle={() => {}} />
            {arch && <p className="m-0 text-caption text-text-secondary">Архив · {archived} {plural(archived, 'заявка', 'заявки', 'заявок')} — серым, вернуть можно кнопкой в строке</p>}
          </section>
        </Container>
      </main>
      <BottomBar left={`Показано ${list.length} из ${total}${arch ? ' + архив' : ''}`}><Button icon="plus">Новая заявка</Button></BottomBar>
    </div>
  );
}

export const Основной: S = { name: 'Список заявок', render: () => <DealsScreen /> };
export const НичегоНеНашли: S = { name: 'Ничего не нашли', render: () => <DealsScreen q="Петров Сергей" /> };
export const ФильтрОткрыт: S = { name: 'Фильтр открыт', render: () => <DealsScreen open="region" region="Москва" /> };
export const ОшибкаДаты: S = { name: 'Ошибка даты в фильтре', render: () => <DealsScreen open="date" dateError /> };
export const Архив: S = { name: 'Показан архив', render: () => <DealsScreen archive mine /> };
