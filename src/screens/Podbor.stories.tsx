import { useState, type ReactNode } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { BottomBar, StepsNav } from '../components/Layout';
import { Card, Inset, Hint } from '../components/Surface';
import { Button } from '../components/Button';
import { Badge } from '../components/Badge';
import { Alert } from '../components/Alert';
import { Chip } from '../components/Chip';
import { Switch } from '../components/Switch';
import { Select } from '../components/Select';
import { MoneyField } from '../components/MoneyField';
import { SearchField } from '../components/SearchField';
import { TextTabs, ChoiceGroup } from '../components/Tabs';
import { FilterPanel } from '../components/Popover';
import { Toast } from '../components/Toast';
import { BankRow, MoreButton, PickedBanks, type PickedBank } from '../patterns/Banks';
import { pct, rub } from '../utils/format';
import { BrokerPage, Help, OFFERS, UNFIT, STEPS, OpenChip } from './kit';

const meta: Meta = { title: 'Экраны/Сценарии/1.0 Подбор условий', parameters: { layout: 'fullscreen' } };
export default meta;
type S = StoryObj;

type Open = 'kids' | 'price' | 'down' | null;
interface PodborProps {
  family?: boolean;
  open?: Open;
  more?: boolean;
  tab?: 'all' | 'params' | 'sel';
  q?: string;
  selected?: string[];
  /** Банки, куда заявка уже ушла: «Отправлено · сегодня, 10:50» */
  sent?: Record<string, string>;
  needBanks?: boolean;
  sber?: boolean;
  toast?: ReactNode;
}

const SBER = { bank: 'Сбербанк', program: 'Стандартная ипотека', rate: 18.4, payment: 92670, income: 154450 };

/** Экран «1.0 Подбор условий»: параметры сделки (чипы), предложения банков, выбранные банки справа */
function PodborScreen({ family, open = null, more, tab: t0 = 'all', q: q0 = '', selected: s0 = ['Абсолют Банк'], sent = {}, needBanks, sber, toast }: PodborProps) {
  const [sel, setSel] = useState<string[]>(s0);
  const [tab, setTab] = useState(t0);
  const [q, setQ] = useState(q0);
  const [showAll, setShowAll] = useState(false);
  const [kids, setKids] = useState<number | null>(2);
  const [disabledKid, setDisabledKid] = useState(false);
  const [cert, setCert] = useState(true);
  const [subsidy, setSubsidy] = useState(true);
  const offers = sber ? [SBER, ...OFFERS] : OFFERS;
  const toggle = (b: string, v: boolean) => setSel((s) => (v ? [...s, b] : s.filter((x) => x !== b)));
  const list = offers.filter((o) => (!q.trim() || o.bank.toLowerCase().includes(q.trim().toLowerCase())) && (tab !== 'sel' || sel.includes(o.bank) || sent[o.bank]));
  const shown = showAll ? list : list.slice(0, 6);
  const picked: PickedBank[] = [
    ...Object.entries(sent).map(([bank, at]) => ({ bank, meta: at, locked: true })),
    ...offers.filter((o) => sel.includes(o.bank) && !sent[o.bank]).map((o) => ({ bank: o.bank, meta: `${pct(o.rate)} · ${rub(o.payment)} в месяц` })),
  ];
  const onlySber = sber && picked.length === 1 && picked[0]!.bank === 'Сбербанк';
  const n = picked.length;
  return (
    <BrokerPage meta="Шаг 1 из 5 · Подбор условий" score={null}
      aside={<>
        <PickedBanks program="Стандартная ипотека" amount={6_000_000} banks={picked} onRemove={(b) => toggle(b, false)}
          notice={onlySber ? <Alert type="info" title="Короткая анкета: 3 шага и отправка без подписания">Для Сбербанка достаточно паспорта и двух вопросов о доходе</Alert> : undefined} />
        <StepsNav steps={onlySber ? [STEPS[0]!, { key: 'personal', label: 'Персональные данные' }, { key: 'send', label: 'Отправка в банк' }] : STEPS} current="podbor" done={[]} />
        <Help />
      </>}
      bar={
        <BottomBar left="Шаг 1 из 5 · Подбор условий"
          alert={needBanks ? <Alert type="warning" title="Сначала выберите банки">Отметьте галочкой хотя бы один банк в списке — так мы поймём, кому отправить предложение и заявку</Alert> : undefined}>
          <Button variant="outline">Отправить предложение на почту</Button><Button>Продолжить</Button>
        </BottomBar>
      }>
      {toast && <div className="pointer-events-none fixed inset-x-0 top-[84px] z-50 flex justify-center"><Toast>{toast}</Toast></div>}
      <Card padding="l" title="Подбор условий" description="Задайте параметры сделки и отметьте банки, в которые отправим заявку">
        <div className="flex flex-wrap items-center gap-2">
          <Chip label="Цель:" value="Квартира в новостройке" active />
          <Chip label="Программа:" value={family ? 'Семейная' : 'Стандартная'} active />
          {family && (open === 'kids' ? (
            <OpenChip label="Дети:" value={kids === 5 ? '5+' : String(kids ?? '')} active>
              <FilterPanel title="Количество детей" onApply={() => {}}>
                <ChoiceGroup aria-label="Количество детей" value={kids} onChange={setKids} options={[1, 2, 3, 4, 5].map((k) => ({ value: k, label: k === 5 ? '5+' : String(k) }))} />
                <Switch label="Ребёнок с инвалидностью до 18 лет" checked={disabledKid} onChange={setDisabledKid} />
                <Hint>Хотя бы один ребёнок должен быть младше 7 лет на дату кредитного договора. Для ребёнка с инвалидностью — до 18 лет</Hint>
              </FilterPanel>
            </OpenChip>
          ) : <Chip label="Дети:" value="2" active />)}
          <Chip label="Регион:" value="г. Москва" active />
          {open === 'price' ? (
            <OpenChip label="Стоимость:" value="300 000 ₽" active>
              <FilterPanel title="Стоимость недвижимости" applyDisabled onApply={() => {}}>
                <MoneyField label="Стоимость" value={300000} error="Минимальная стоимость — 500 000 ₽. Проверьте сумму: банки не выдают ипотеку на меньшие объекты" />
              </FilterPanel>
            </OpenChip>
          ) : <Chip label="Стоимость:" value="10 000 000 ₽" active />}
          {open === 'down' ? (
            <OpenChip label="Взнос:" value="1 000 000 ₽" active>
              <FilterPanel title="Первоначальный взнос" applyDisabled onApply={() => {}}>
                <div className="grid grid-cols-[1fr_96px] gap-3">
                  <MoneyField label="ПВ" value={1000000} error />
                  <MoneyField label="Процент" value={10} suffix="%" />
                </div>
                <Alert type="error" title="Взнос меньше минимального">Для программы «Семейная» взнос от 20% — это 2 000 000 ₽. Увеличьте взнос или добавьте сертификат</Alert>
              </FilterPanel>
            </OpenChip>
          ) : <Chip label="Взнос:" value="4 000 000 ₽" active />}
          <Chip label="Срок:" value="25 лет" active />
          <Button variant="link" icon={more ? 'chevron-up' : 'sliders'}>Больше параметров</Button>
        </div>
        {more && (
          <Inset tone="outline" title="Дополнительные параметры">
            <Switch label="Использовать сертификат" checked={cert} onChange={setCert} />
            {cert && (
              <div className="grid grid-cols-2 gap-4 max-[640px]:grid-cols-1">
                <Select label="Тип сертификата" options={['Материнский капитал', 'Региональный сертификат']} value="Материнский капитал" onChange={() => {}} />
                <MoneyField label="Сумма сертификата, ₽" value={690266} helper="Добавляется к собственным средствам" />
              </div>
            )}
            <Switch label="Учитывать субсидию застройщика" checked={subsidy} onChange={setSubsidy} />
            {subsidy && (
              <>
                <Button variant="outline" size="s" icon="sliders" className="self-start">Настроить условия ДОМ.РФ</Button>
                <Alert type="success" title="Условия ДОМ.РФ применены">Снижение на 1 п.п. · ЖК «Северный парк», корпус 3</Alert>
              </>
            )}
          </Inset>
        )}
        <div><Button variant="subtle" icon="rotate-ccw">Сброс фильтров</Button></div>
      </Card>
      <Card padding="l" title={<span className="inline-flex items-center gap-2">Предложения банков <Badge tone="counter">{offers.length}</Badge></span>}>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <TextTabs aria-label="Фильтр предложений" value={tab} onChange={setTab}
            items={[{ value: 'all', label: 'Все' }, { value: 'params', label: 'По параметрам' }, { value: 'sel', label: `Выбрано: ${n}` }]} />
          <Chip label="Сортировка:" value="По комиссии платформы" />
        </div>
        <SearchField value={q} onChange={setQ} placeholder="Найти банк" label="Найти банк" />
        {list.length ? (
          <div>
            {shown.map((o) => (
              <BankRow key={o.bank} {...o} selected={sel.includes(o.bank)} onToggle={(v) => toggle(o.bank, v)} onDetails={() => {}}
                sent={sent[o.bank] ? { label: sent[o.bank]!.split(' · ')[0], at: sent[o.bank]!.split(' · ')[1] ?? '' } : undefined} />
            ))}
          </div>
        ) : (
          <p className="m-0 rounded-16 bg-surface-page px-5 py-6 text-center text-body-m text-text-secondary">
            {tab === 'sel' ? 'Вы ещё не выбрали банки — отметьте их галочкой в списке' : 'Банк не найден. Проверьте название'}
          </p>
        )}
        {list.length > 6 && <MoreButton open={showAll} onClick={() => setShowAll(!showAll)}>{showAll ? 'Свернуть' : `Ещё ${list.length - 6} предложения`}</MoreButton>}
        {tab !== 'sel' && !q && (
          <div className="flex flex-col gap-2.5 pt-2">
            <div className="flex items-center gap-2"><h3 className="m-0 text-body-l font-semibold">Не подошли под параметры</h3><Badge tone="counter">{UNFIT.length}</Badge></div>
            <p className="-mt-1 m-0 text-[13px] text-text-secondary">Измените параметры сделки, чтобы эти банки появились в подборе</p>
            <div>{UNFIT.map((o) => <BankRow key={o.bank} {...o} unfitReason={o.reason} />)}</div>
          </div>
        )}
      </Card>
    </BrokerPage>
  );
}

export const Основной: S = { name: 'Подбор условий', render: () => <PodborScreen /> };
export const Семейная: S = { name: 'Семейная ипотека', render: () => <PodborScreen family open="kids" /> };
export const ОшибкаСтоимости: S = { name: 'Ошибки параметров · стоимость', render: () => <PodborScreen open="price" /> };
export const ОшибкаВзноса: S = { name: 'Ошибки параметров · взнос', render: () => <PodborScreen family open="down" /> };
export const БольшеПараметров: S = { name: 'Больше параметров', render: () => <PodborScreen more /> };
export const ВыбраноПусто: S = { name: 'Вкладка «Выбрано» пустая', render: () => <PodborScreen tab="sel" selected={[]} /> };
export const БанкНеНайден: S = { name: 'Банк не найден', render: () => <PodborScreen q="Тинькофф" /> };
export const Повторный: S = {
  name: 'Повторный подбор',
  render: () => <PodborScreen selected={['МКБ']} sent={{ 'Абсолют Банк': 'Отправлено · сегодня, 10:50', Уралсиб: 'Одобрено · сегодня, 12:40' }} />,
};
export const БезБанков: S = { name: '«Продолжить» без банков', render: () => <PodborScreen selected={[]} needBanks /> };
export const ТолькоСбер: S = { name: 'Выбран только Сбербанк', render: () => <PodborScreen sber selected={['Сбербанк']} /> };
export const ПредложениеОтправлено: S = { name: 'Предложение отправлено', render: () => <PodborScreen toast="Предложение отправлено на ivanov@example.com" /> };
