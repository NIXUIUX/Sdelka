import { useId, useState, type ReactNode } from 'react';
import { cn } from '../utils/cn';
import { rub } from '../utils/format';
import { digits } from '../utils/masks';
import { Icon } from '../icons/Icon';
import { AvatarGroup } from '../components/Avatar';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { MoneyField } from '../components/MoneyField';
import { Metric } from './Banks';

/* Источник правды — прототип флоу Б (CreditParams, ApprovedParams, сводка на шаге подписания). */

export type ParamRow = { label: ReactNode; value: ReactNode };

export interface CreditParamsProps {
  /** Банки заявки — стопка аватаров (до 3 и «+N») */
  banks: readonly string[];
  program: ReactNode;
  /** Сумма кредита, ₽ */
  amount: number;
  /** Параметры подбора: Цель, Программа, (Дети), Регион, Стоимость, Первый взнос, (Сертификат), Срок */
  params: readonly ParamRow[];
  /** Ссылка «Изменить параметры подбора ›» */
  onEdit?: () => void;
  editLabel?: ReactNode;
  expanded?: boolean;
  onExpandedChange?: (v: boolean) => void;
  defaultExpanded?: boolean;
  title?: ReactNode;
  className?: string;
}

/** Боковая карточка «Параметры кредита» на финальных экранах. Свёрнута — банки и сумма; раскрыта — параметры подбора */
export function CreditParams({
  banks, program, amount, params, onEdit, editLabel = 'Изменить параметры подбора', expanded, onExpandedChange, defaultExpanded = false,
  title = 'Параметры кредита', className,
}: CreditParamsProps) {
  const [inner, setInner] = useState(defaultExpanded);
  const open = expanded ?? inner;
  const toggle = () => { onExpandedChange?.(!open); if (expanded === undefined) setInner(!open); };
  const bodyId = useId();
  return (
    <section className={cn('flex flex-col gap-4 rounded-20 border border-border-default bg-surface-white p-6', className)}>
      <button type="button" onClick={toggle} aria-expanded={open} aria-controls={bodyId}
        className="group/cp flex w-full items-center justify-between gap-3 rounded-10 text-left">
        <h2 className="m-0 text-h2 text-text-primary">{title}</h2>
        <Icon name={open ? 'chevron-up' : 'chevron-down'} size={20} className="shrink-0 text-text-secondary group-hover/cp:text-action-primary" />
      </button>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <AvatarGroup names={[...banks]} max={3} size={36} />
        <div className="text-right">
          <span className="text-caption text-text-secondary">{program}</span>
          <div className="text-[20px] leading-7 font-bold whitespace-nowrap text-text-primary tabular-nums">{rub(amount)}</div>
        </div>
      </div>
      {open && (
        <div id={bodyId} className="flex flex-col gap-3">
          <dl className="m-0 grid grid-cols-[1fr_auto] gap-x-3 gap-y-2 border-t border-border-default pt-4 text-body-m tabular-nums">
            {params.map((p, i) => (
              <div key={i} className="contents">
                <dt className="text-text-secondary">{p.label}</dt>
                <dd className="m-0 text-right font-medium text-text-primary">{p.value}</dd>
              </div>
            ))}
          </dl>
          {onEdit && (
            <button type="button" onClick={onEdit} className="inline-flex items-center gap-1 self-start text-body-m font-semibold text-action-primary hover:text-action-hover hover:underline">
              {editLabel}<Icon name="chevron-right" size={16} />
            </button>
          )}
        </div>
      )}
    </section>
  );
}

export type ApprovedValues = { sum: number; rate: number; term: number };

export interface ApprovedParamsProps {
  /** Шесть показателей: Сумма, Ставка, Срок, Платёж, Первый взнос, Решение действует до */
  items: readonly (ParamRow & { highlight?: boolean })[];
  /** Сноска: «Направляли: 18,6% · 6 000 000 ₽ · 25 лет» */
  note?: ReactNode;
  /** Кнопка «Изменить» без формы — своё поведение */
  onEdit?: () => void;
  /**
   * Встроенное редактирование (как в прототипе): «Изменить» → поля Сумма / Ставка / Срок → «Сохранить».
   * Передайте текущие значения и обработчик сохранения.
   */
  values?: ApprovedValues;
  onSave?: (v: ApprovedValues) => void;
  title?: ReactNode;
  className?: string;
}

/** Параметры одобрения банка: зелёный блок, сетка 3 × 2 (2 колонки на телефоне), значения 18/600, ставка зелёным */
export function ApprovedParams({ items, note, onEdit, values, onSave, title = 'Параметры одобрения', className }: ApprovedParamsProps) {
  const [edit, setEdit] = useState(false);
  const [d, setD] = useState({ sum: values?.sum ?? null as number | null, rate: String(values?.rate ?? '').replace('.', ','), term: String(values?.term ?? '') });
  const editable = !!(values && onSave);
  const start = () => {
    if (editable) { setD({ sum: values!.sum, rate: String(values!.rate).replace('.', ','), term: String(values!.term) }); setEdit(true); }
    else onEdit?.();
  };
  const rate = parseFloat(d.rate.replace(',', '.'));
  const valid = !!d.sum && rate > 0 && +d.term > 0;
  return (
    <section className={cn('flex flex-col gap-4 rounded-16 bg-success-bg p-5', className)}>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h3 className="m-0 flex items-center gap-2 text-[16px] leading-6 font-semibold text-text-primary">
          <Icon name="badge-check" size={18} className="shrink-0 text-success" />{title}
        </h3>
        {!edit && (editable || onEdit) && <Button variant="outline" size="s" onClick={start}>Изменить</Button>}
      </div>
      {edit ? (
        <form className="flex flex-col gap-4" onSubmit={(e) => { e.preventDefault(); if (valid) { onSave!({ sum: d.sum!, rate, term: +d.term }); setEdit(false); } }}>
          <div className="grid grid-cols-3 gap-4 max-[640px]:grid-cols-1">
            <MoneyField label="Сумма кредита, ₽" value={d.sum} onChange={(v) => setD({ ...d, sum: v })} />
            <Input label="Ставка, %" inputMode="decimal" value={d.rate} onChange={(v) => setD({ ...d, rate: v.replace(/[^\d,.]/g, '').slice(0, 5) })} />
            <Input label="Срок, лет" mask="years" value={d.term} onChange={(v) => setD({ ...d, term: digits(v) })} />
          </div>
          <div className="flex flex-wrap gap-3">
            <Button variant="outline" size="s" onClick={() => setEdit(false)}>Отмена</Button>
            <Button type="submit" size="s" disabled={!valid}>Сохранить</Button>
          </div>
        </form>
      ) : (
        <>
          <div className="grid grid-cols-3 gap-4 max-[640px]:grid-cols-2">
            {items.map((it, i) => <Metric key={i} size="m" label={it.label} value={it.value} tone={it.highlight ? 'success' : 'default'} />)}
          </div>
          {note && <p className="m-0 text-caption text-text-secondary">{note}</p>}
        </>
      )}
    </section>
  );
}

export interface SummaryRowProps {
  /** Раздел анкеты: «Персональные данные» */
  title: ReactNode;
  /** Кратко: «Иванов Иван Иванович · 12.04.1988 · паспорт 4510 123456». Пусто — «Не заполнено» */
  summary?: ReactNode;
  /** done — синий кружок с галочкой; missing — серый «!» */
  state: 'done' | 'missing';
  onEdit?: () => void;
  className?: string;
}

/** Строка сводки «Проверьте данные заявки». Кладите в SummaryList — он рисует рамку и разделители */
export function SummaryRow({ title, summary, state, onEdit, className }: SummaryRowProps) {
  const done = state === 'done';
  return (
    <div className={cn('flex items-center gap-3 border-t border-border-default px-5 py-3.5 first:border-t-0', className)}>
      <span role="img" aria-label={done ? 'Заполнено' : 'Не заполнено'}
        className={cn('grid size-6 shrink-0 place-items-center rounded-full', done ? 'bg-action-primary text-surface-white' : 'bg-chart-track-soft text-text-secondary')}>
        {done ? <Icon name="check" size={14} strokeWidth={3} /> : <span className="text-caption-medium">!</span>}
      </span>
      <div className="min-w-0 flex-1">
        <b className="block text-body-m font-semibold text-text-primary">{title}</b>
        <small className="block truncate text-[13px] text-text-secondary">{summary || 'Не заполнено'}</small>
      </div>
      {onEdit && <Button variant="link" onClick={onEdit}>Изменить</Button>}
    </div>
  );
}

/** Рамка сводки (прототип: .sum) — радиус 16, строки через линии */
export function SummaryList({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn('overflow-hidden rounded-16 border border-border-default', className)}>{children}</div>;
}
