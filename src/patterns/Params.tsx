import { useId, useState, type ReactNode } from 'react';
import { cn } from '../utils/cn';
import { rub } from '../utils/format';
import { Icon } from '../icons/Icon';
import { AvatarGroup } from '../components/Avatar';
import { Button } from '../components/Button';
import { Metric } from './Banks';

export type ParamRow = { label: ReactNode; value: ReactNode };

export interface CreditParamsProps {
  /** Банки заявки — стопка аватаров */
  banks: readonly string[];
  program: ReactNode;
  /** Сумма кредита, ₽ */
  amount: number;
  /** Параметры подбора: Цель, Программа, Регион, Стоимость, Первый взнос, Срок */
  params: readonly ParamRow[];
  /** Ссылка «Изменить параметры подбора ›» */
  onEdit?: () => void;
  editLabel?: ReactNode;
  /** Управляемое раскрытие; без него — своё состояние, по умолчанию свёрнуто */
  expanded?: boolean;
  onExpandedChange?: (v: boolean) => void;
  defaultExpanded?: boolean;
  title?: ReactNode;
  className?: string;
}

/**
 * Карточка «Параметры кредита» на финальном экране — Figma: Флоу / Credit params (Collapsed · Expanded).
 * Свёрнута: банки и сумма. Раскрыта: список параметров из подбора и ссылка на изменение.
 */
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
        className="-m-1 flex items-center justify-between gap-3 rounded-10 p-1 text-left">
        <h2 className="m-0 text-h2 text-text-primary">{title}</h2>
        <Icon name={open ? 'chevron-up' : 'chevron-down'} size={20} className="shrink-0 text-text-secondary" />
      </button>
      <div className="flex items-center justify-between gap-3">
        <AvatarGroup names={[...banks]} max={3} size={36} />
        <div className="flex min-w-0 flex-col items-end">
          <span className="text-caption text-text-secondary">{program}</span>
          <span className="text-num-l whitespace-nowrap text-text-primary tabular-nums">{rub(amount)}</span>
        </div>
      </div>
      {open && (
        <div id={bodyId} className="flex flex-col gap-4">
          <dl className="m-0 flex flex-col gap-2 border-t border-border-default pt-4">
            {params.map((p, i) => (
              <div key={i} className="flex items-baseline justify-between gap-4">
                <dt className="text-body-m text-text-secondary">{p.label}</dt>
                <dd className="m-0 text-right text-body-m-medium text-text-primary">{p.value}</dd>
              </div>
            ))}
          </dl>
          {onEdit && (
            <button type="button" onClick={onEdit} className="inline-flex items-center gap-1 self-start text-button-m text-action-primary hover:text-action-hover">
              {editLabel}<Icon name="chevron-right" size={16} />
            </button>
          )}
        </div>
      )}
    </section>
  );
}

export interface ApprovedParamsProps {
  /** Шесть показателей: Сумма, Ставка, Срок, Платёж, Первый взнос, Решение действует до */
  items: readonly (ParamRow & { highlight?: boolean })[];
  /** Сноска: «Направляли: 18,6% · 6 000 000 ₽ · 25 лет» */
  note?: ReactNode;
  onEdit?: () => void;
  title?: ReactNode;
  className?: string;
}

/**
 * Параметры одобрения банка — Figma: Флоу / Approved params. Зелёный фон, радиус 16, сетка 3 × 2.
 * `highlight` — значение зелёным (ставка, если она лучше той, что направляли).
 */
export function ApprovedParams({ items, note, onEdit, title = 'Параметры одобрения', className }: ApprovedParamsProps) {
  return (
    <section className={cn('flex flex-col gap-4 rounded-16 bg-success-bg p-5', className)}>
      <div className="flex min-h-9 items-center justify-between gap-3">
        <h3 className="m-0 flex items-center gap-2 text-h3 text-text-primary">
          <Icon name="badge-check" size={18} className="shrink-0 text-success" />{title}
        </h3>
        {onEdit && <Button variant="outline" size="s" onClick={onEdit}>Изменить</Button>}
      </div>
      <div className="grid grid-cols-3 gap-4 max-sm:grid-cols-2">
        {items.map((it, i) => <Metric key={i} label={it.label} value={it.value} tone={it.highlight ? 'success' : 'default'} />)}
      </div>
      {note && <p className="m-0 text-caption text-text-secondary">{note}</p>}
    </section>
  );
}

export interface SummaryRowProps {
  /** Раздел анкеты: «Персональные данные» */
  title: ReactNode;
  /** Кратко что заполнено: «Иванов Иван Иванович · 12.04.1988 · паспорт 4510 123456». Пусто — «Не заполнено» */
  summary?: ReactNode;
  /** done — зелёная галочка; missing — жёлтый «!» */
  state: 'done' | 'missing';
  onEdit?: () => void;
  className?: string;
}

/** Строка сводки перед отправкой — Figma: Флоу / Summary row (Done · Missing). Линия снизу */
export function SummaryRow({ title, summary, state, onEdit, className }: SummaryRowProps) {
  const done = state === 'done';
  return (
    <div className={cn('flex items-center gap-3 border-b border-border-default py-3', className)}>
      <span aria-label={done ? 'Заполнено' : 'Не заполнено'} role="img"
        className={cn('grid size-6 shrink-0 place-items-center rounded-full', done ? 'bg-success-bg text-success' : 'bg-warning-bg text-warning-text')}>
        {done ? <Icon name="check" size={14} /> : <span className="text-caption-medium">!</span>}
      </span>
      <div className="flex min-w-0 flex-1 flex-col gap-0.5">
        <span className="text-body-m-medium text-text-primary">{title}</span>
        <span className="truncate text-caption text-text-secondary">{summary || 'Не заполнено'}</span>
      </div>
      {onEdit && (
        <button type="button" onClick={onEdit} className="shrink-0 text-button-s text-action-primary hover:text-action-hover">Изменить</button>
      )}
    </div>
  );
}
