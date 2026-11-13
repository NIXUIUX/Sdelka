import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { LineTabs, TextTabs, SegmentedTabs, ChoiceGroup } from './Tabs';
import { Chip } from './Chip';
import { FilterChip, FilterPanel, Menu } from './Popover';
import { MoneyField } from './MoneyField';
import { MiniStepper } from './Stepper';
import { rub, years } from '../utils/format';

const Card = ({ title, hint, children }: { title: string; hint?: string; children: React.ReactNode }) => (
  <section className="flex flex-col gap-2 rounded-20 border border-border-default bg-surface-white p-8">
    <h2 className="text-h2">{title}</h2>
    {hint && <p className="text-body-s text-text-secondary">{hint}</p>}
    <div className="mt-4 flex flex-col gap-6">{children}</div>
  </section>
);
const Cap = ({ children }: { children: React.ReactNode }) => <span className="mb-2 block text-overline text-text-muted">{children}</span>;

const meta: Meta = { title: 'Компоненты/Вкладки и фильтры' };
export default meta;
type S = StoryObj;

export const Вкладки: S = {
  name: 'LineTab и TextTab',
  render: () => {
    const [a, setA] = useState('deals');
    const [b, setB] = useState('params');
    const [c, setC] = useState('project');
    const [k, setK] = useState<number | null>(2);
    return (
      <Card title="Вкладки" hint="Стрелки ← → переключают вкладки. LineTab — разделы страницы, TextTab — фильтр списка, SegmentedTabs и ChoiceGroup — из прототипа.">
        <div><Cap>LineTab</Cap>
          <LineTabs aria-label="Разделы" value={a} onChange={setA} items={[
            { value: 'deals', label: 'Ипотечные заявки', count: 12 }, { value: 'archive', label: 'Архив', count: 3 }, { value: 'clients', label: 'Клиенты' },
          ]} />
        </div>
        <div><Cap>TextTab</Cap>
          <TextTabs aria-label="Вид" value={b} onChange={setB} items={[
            { value: 'all', label: 'Все' }, { value: 'params', label: 'По параметрам' }, { value: 'sel', label: 'Выбрано: 2' },
          ]} />
        </div>
        <div><Cap>SegmentedTabs — окно ДОМ.РФ, подписание</Cap>
          <SegmentedTabs aria-label="Условия" value={c} onChange={setC} items={[
            { value: 'project', label: 'Проектное финансирование' }, { value: 'cut', label: 'Снижение ставки' },
          ]} />
        </div>
        <div className="max-w-[320px]"><Cap>ChoiceGroup — количество детей</Cap>
          <ChoiceGroup aria-label="Количество детей" value={k} onChange={setK} options={[1, 2, 3, 4, 5].map((n) => ({ value: n, label: n === 5 ? '5+' : n }))} />
        </div>
      </Card>
    );
  },
};

export const Чипы: S = {
  name: 'Chip — состояния',
  render: () => (
    <Card title="Chip" hint="Default — значение по умолчанию. Active — параметр задан. Open — открыт поповер. Наведите, чтобы увидеть Hover.">
      <div className="flex flex-wrap gap-2">
        <Chip label="Цель:" value="Квартира в новостройке" />
        <Chip label="Цель:" value="Квартира в новостройке" active />
        <Chip label="Цель:" value="Квартира в новостройке" active open />
        <Chip label="Регион:" value="Москва" disabled />
      </div>
    </Card>
  ),
};

const GOALS = ['Квартира в новостройке', 'Квартира на вторичке', 'Дом с участком', 'Рефинансирование'];
const PROGRAMS = ['Стандартная', 'Семейная ипотека', 'IT-ипотека', 'Дальневосточная'];

export const Фильтры: S = {
  name: 'Строка фильтров',
  render: () => {
    const [goal, setGoal] = useState('Квартира в новостройке');
    const [program, setProgram] = useState('Стандартная');
    const [price, setPrice] = useState(12_500_000);
    const [draft, setDraft] = useState<number | null>(price);
    const [term, setTerm] = useState(25);
    return (
      <div className="pb-72">
        <Card title="Строка фильтров подбора" hint="Чип открывает поповер: список вариантов или Filter popover с полем и кнопкой «Применить». Закрывается кликом снаружи и Esc.">
          <div className="flex flex-wrap gap-2">
            <FilterChip label="Цель:" value={goal} active width={undefined}>
              {(close) => <Menu items={GOALS} value={goal} onPick={(v) => { setGoal(v); close(); }} />}
            </FilterChip>
            <FilterChip label="Программа:" value={program} active={program !== 'Стандартная'} width={undefined}>
              {(close) => <Menu items={PROGRAMS} value={program} onPick={(v) => { setProgram(v); close(); }} />}
            </FilterChip>
            <FilterChip label="Стоимость:" value={rub(price)} active onOpenChange={(o) => o && setDraft(price)}>
              {(close) => (
                <FilterPanel title="Стоимость недвижимости" applyDisabled={!draft} onApply={() => { if (draft) setPrice(draft); close(); }}>
                  <MoneyField label="Стоимость, ₽" value={draft} onChange={setDraft} error={draft ? undefined : 'Укажите стоимость'} />
                </FilterPanel>
              )}
            </FilterChip>
            <FilterChip label="Срок:" value={years(term)} active align="end" width={undefined}>
              {() => (
                <div className="flex items-center justify-between gap-4 p-4">
                  <span className="text-body-m">Срок кредита</span>
                  <MiniStepper label="срок" value={term} onChange={setTerm} min={1} max={30} />
                </div>
              )}
            </FilterChip>
          </div>
        </Card>
      </div>
    );
  },
};
