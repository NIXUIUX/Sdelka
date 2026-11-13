import type { ReactNode } from 'react';
import { cn } from '../utils/cn';
import { pct, rub } from '../utils/format';
import { Icon } from '../icons/Icon';
import { Avatar } from '../components/Avatar';
import { Badge } from '../components/Badge';
import { Button } from '../components/Button';
import { Checkbox } from '../components/Checkbox';

/** Число-показатель: подпись Caption серым + значение Numeric/L */
export function Metric({ label, value, tone = 'default', className }: {
  label: ReactNode; value: ReactNode; tone?: 'default' | 'accent' | 'success' | 'muted'; className?: string;
}) {
  return (
    <div className={cn('flex min-w-0 flex-col gap-0.5', className)}>
      <span className="text-caption text-text-secondary">{label}</span>
      <span className={cn('text-num-l tabular-nums', {
        default: 'text-text-primary', accent: 'text-action-primary', success: 'text-success', muted: 'text-text-muted',
      }[tone])}>{value}</span>
    </div>
  );
}

export interface BankOffer {
  /** Название банка: «МКБ», «Абсолют Банк» — из него инициалы */
  bank: string;
  /** Программа: «Стандартная ипотека» */
  program: string;
  /** Ставка в процентах: 18.95 */
  rate: number;
  /** Платёж в месяц, ₽ */
  payment: number;
  /** Рекомендуемый доход, ₽ */
  income: number;
}

export interface BankRowProps extends BankOffer {
  /** Банк отмечен для отправки — ставка синим, чекбокс отмечен */
  selected?: boolean;
  onToggle?: (selected: boolean) => void;
  /** Заявка уже отправлена: бейдж «Отправлено · …», серая заблокированная галочка */
  sentAt?: ReactNode;
  /** Банк не подходит: всё приглушено, без чекбокса и «Подробнее», причина жёлтым */
  unfitReason?: ReactNode;
  onDetails?: () => void;
  className?: string;
}

/**
 * Строка предложения банка — Figma: Флоу / Bank row (Default · Selected · Sent · Unfit).
 * Default/Selected — строка с линией снизу. Sent/Unfit — карточка на светлом фоне, радиус 16.
 * На узком экране показатели переносятся, «Подробнее» уходит вниз.
 */
export function BankRow({ bank, program, rate, payment, income, selected, onToggle, sentAt, unfitReason, onDetails, className }: BankRowProps) {
  const unfit = !!unfitReason;
  const card = unfit || sentAt;
  const metricTone = unfit ? 'muted' : selected && !sentAt ? 'accent' : 'default';
  return (
    <article
      aria-label={bank}
      className={cn(
        'flex flex-col gap-3.5 px-4 py-5',
        card ? 'rounded-16 border border-border-default bg-surface-page' : 'border-b border-border-default',
        className,
      )}
    >
      <div className={cn('flex items-center gap-3', unfit && 'opacity-60')}>
        <Avatar name={bank} variant={unfit ? 'disabled' : 'initials'} size={36} />
        <div className="flex min-w-0 flex-1 flex-col gap-0.5">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className={cn('m-0 text-h3', unfit ? 'text-text-muted' : 'text-text-primary')}>{bank}</h3>
            {sentAt && <Badge tone="sent">Отправлено · {sentAt}</Badge>}
          </div>
          <span className="text-caption text-text-secondary">{program}</span>
        </div>
        {!unfit && (
          <Checkbox
            aria-label={sentAt ? `${bank}: заявка уже отправлена` : `Выбрать ${bank}`}
            locked={!!sentAt}
            checked={!!selected}
            onChange={(v) => onToggle?.(v)}
          />
        )}
      </div>
      <div className="flex flex-wrap items-end gap-x-6 gap-y-3">
        <div className={cn('grid min-w-0 flex-1 grid-cols-3 gap-x-6 gap-y-3 max-sm:grid-cols-2', unfit && 'opacity-60')}>
          <Metric label="Ставка" value={pct(rate)} tone={metricTone} />
          <Metric label="Платёж в месяц" value={rub(payment)} tone={unfit ? 'muted' : 'default'} />
          <Metric label="Рекомендуемый доход" value={rub(income)} tone={unfit ? 'muted' : 'default'} />
        </div>
        {!unfit && onDetails && (
          <Button variant="outline" size="s" onClick={onDetails} className="max-sm:w-full">Подробнее</Button>
        )}
        {/* У неподходящего банка кнопки нет, но место под неё держим — колонки совпадают со строками выше (как в Figma) */}
        {unfit && <span aria-hidden className="invisible h-9 w-[101px] max-sm:hidden" />}
      </div>
      {unfit && (
        <p className="m-0 flex items-start gap-1.5 text-body-s text-warning-text">
          <Icon name="info" size={14} className="mt-0.5 shrink-0" />
          <span>{unfitReason}</span>
        </p>
      )}
    </article>
  );
}

export interface PickedBank {
  bank: string;
  /** Вторая строка: «18,95% · 95 619 ₽ в месяц», «Отправлено сегодня, 10:50», «Одобрено …» */
  meta: ReactNode;
  /** Заявка уже ушла в банк — замок вместо крестика, убрать нельзя */
  locked?: boolean;
}

export interface PickedBanksProps {
  banks: readonly PickedBank[];
  program: ReactNode;
  /** Сумма кредита, ₽ */
  amount: number;
  onRemove?: (bank: string) => void;
  title?: ReactNode;
  /** Пусто — подсказка вместо списка */
  emptyText?: ReactNode;
  className?: string;
}

/**
 * Боковая карточка выбранных банков — Figma: Флоу / Picked banks.
 * Отправленные/одобренные — с замком, новые — с крестиком.
 */
export function PickedBanks({ banks, program, amount, onRemove, title = 'Выбранные банки', emptyText = 'Отметьте банки в списке — они появятся здесь', className }: PickedBanksProps) {
  return (
    <section className={cn('flex flex-col gap-3 rounded-20 border border-border-default bg-surface-white p-6', className)}>
      <div className="flex items-center justify-between gap-3">
        <h2 className="m-0 text-h2 text-text-primary">{title}</h2>
        <Badge tone="counter">{banks.length}</Badge>
      </div>
      <div className="flex items-baseline justify-between gap-3">
        <span className="text-body-s text-text-secondary">{program}</span>
        <span className="text-num-l whitespace-nowrap text-text-primary tabular-nums">{rub(amount)}</span>
      </div>
      {banks.length === 0 ? (
        <p className="m-0 py-2 text-body-s text-text-muted">{emptyText}</p>
      ) : (
        <ul className="m-0 flex list-none flex-col p-0">
          {banks.map((b) => (
            <li key={b.bank} className="flex items-center gap-3 py-2">
              <Avatar name={b.bank} size={36} />
              <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                <span className="truncate text-body-m-medium text-text-primary">{b.bank}</span>
                <span className="truncate text-caption text-text-secondary">{b.meta}</span>
              </div>
              {b.locked ? (
                <Icon name="lock" size={16} label="Заявка отправлена — убрать нельзя" className="shrink-0 text-text-muted" />
              ) : (
                <button type="button" onClick={() => onRemove?.(b.bank)} aria-label={`Убрать ${b.bank}`}
                  className="-m-1.5 grid size-7 shrink-0 place-items-center rounded-6 text-text-secondary hover:bg-surface-page hover:text-text-primary">
                  <Icon name="x" size={16} />
                </button>
              )}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
