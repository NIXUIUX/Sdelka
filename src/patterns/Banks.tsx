import type { ReactNode } from 'react';
import { cn } from '../utils/cn';
import { pct, rub } from '../utils/format';
import { Icon } from '../icons/Icon';
import { Avatar } from '../components/Avatar';
import { Badge } from '../components/Badge';
import { Button } from '../components/Button';
import { Checkbox } from '../components/Checkbox';

/* Источник правды — прототип флоу Б, экран «1.0 Подбор условий». */

/**
 * Показатель: подпись 12 серым + значение. size l — 20/700 (список банков, условия), m — 18/600 (параметры одобрения).
 */
export function Metric({ label, value, tone = 'default', size = 'l', className }: {
  label: ReactNode; value: ReactNode; tone?: 'default' | 'accent' | 'success' | 'muted'; size?: 'l' | 'm'; className?: string;
}) {
  return (
    <div className={cn('flex min-w-0 flex-col', className)}>
      <span className="text-caption text-text-secondary">{label}</span>
      <b className={cn('tabular-nums', size === 'l' ? 'text-[20px] leading-7 font-bold' : 'text-[18px] leading-[26px] font-semibold', {
        default: 'text-text-primary', accent: 'text-action-primary', success: 'text-success', muted: 'text-text-muted',
      }[tone])}>{value}</b>
    </div>
  );
}

export interface BankOffer {
  /** Название банка: «МКБ», «Абсолют Банк» — из него инициалы */
  bank: string;
  /** Программа: «Стандартная ипотека» */
  program: string;
  /** Ставка, %: 18.95 */
  rate: number;
  /** Платёж в месяц, ₽ */
  payment: number;
  /** Рекомендуемый доход, ₽ */
  income: number;
}

export interface BankRowProps extends BankOffer {
  /** Отмечен для отправки — строка на голубой подложке */
  selected?: boolean;
  onToggle?: (selected: boolean) => void;
  /** Заявка уже ушла: бейдж «Отправлено · сегодня, 10:50», серая галочка, строка приглушена */
  sent?: { label?: ReactNode; at: ReactNode };
  /** Банк не подходит под параметры: «срок до 15 лет» → «Укажите срок до 15 лет» */
  unfitReason?: ReactNode;
  /** Ставка синим — применена субсидия/снижение (ДОМ.РФ) */
  rateAccent?: boolean;
  onDetails?: () => void;
  className?: string;
}

/**
 * Строка предложения банка (прототип: .bank). Слева — банк и 3 показателя, справа — чекбокс и «Подробнее».
 * Selected — голубая подложка, Sent — светлая карточка с бейджем, Unfit — приглушено, причина жёлтым.
 */
export function BankRow({ bank, program, rate, payment, income, selected, onToggle, sent, unfitReason, rateAccent, onDetails, className }: BankRowProps) {
  const unfit = !!unfitReason;
  return (
    <article
      aria-label={bank}
      aria-disabled={unfit || undefined}
      className={cn(
        'grid grid-cols-[minmax(0,1fr)_auto] gap-x-4 gap-y-3 border-b border-border-default py-4 transition-colors duration-150 max-[720px]:grid-cols-1',
        sent ? '-mx-4 my-1 rounded-16 border-b-0 bg-surface-page px-4'
          : selected ? '-mx-3 rounded-12 border-b-transparent bg-surface-card px-3' : '',
        className,
      )}
    >
      <div className={cn('flex min-w-0 items-center gap-3', unfit && 'opacity-50 grayscale', sent && 'opacity-65')}>
        <Avatar name={bank} size={36} />
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <b className="text-[15px] leading-[22px] font-semibold text-text-primary">{bank}</b>
            {sent && (
              <span className="inline-flex h-[22px] items-center gap-1.5 rounded-999 border border-border-default bg-surface-white px-2 text-[11px] whitespace-nowrap text-text-secondary">
                <Icon name="send" size={12} />{sent.label ?? 'Отправлено'} · {sent.at}
              </span>
            )}
          </div>
          <small className="block text-caption text-text-secondary">{program}</small>
        </div>
      </div>
      <div className={cn('row-span-2 flex flex-col items-end justify-between gap-3 max-[720px]:row-span-1 max-[720px]:flex-row-reverse max-[720px]:items-center',
        unfit && 'invisible max-[720px]:hidden')} aria-hidden={unfit || undefined}>
        {sent ? (
          <Checkbox locked aria-label={`Заявка в ${bank} уже отправлена — снять выбор нельзя`} />
        ) : !unfit ? (
          <Checkbox aria-label={`Выбрать ${bank}`} checked={!!selected} onChange={(v) => onToggle?.(v)} />
        ) : <span />}
        <Button variant="outline" size="s" onClick={onDetails} tabIndex={unfit ? -1 : undefined}>Подробнее</Button>
      </div>
      <div className={cn('grid grid-cols-3 gap-4 max-[720px]:grid-cols-2', unfit && 'opacity-50 grayscale', sent && 'opacity-65')}>
        <Metric label="Ставка" value={pct(rate)} tone={rateAccent ? 'accent' : 'default'} />
        <Metric label="Платёж в месяц" value={rub(payment)} />
        <Metric label="Рекомендуемый доход" value={rub(income)} />
      </div>
      {unfit && (
        <p className="col-span-full m-0 flex items-center gap-1.5 text-[13px] leading-[18px] text-warning-text">
          <Icon name="info" size={14} className="shrink-0" /><span>{unfitReason}</span>
        </p>
      )}
    </article>
  );
}

/** Кнопка «Ещё N предложений ⌄» / «Свернуть ⌃» под списками (прототип: .more-btn) */
export function MoreButton({ open, children, onClick }: { open?: boolean; children: ReactNode; onClick: () => void }) {
  return (
    <button type="button" onClick={onClick} aria-expanded={open}
      className="-ml-2 inline-flex items-center gap-1 self-start rounded-10 px-2 py-1.5 text-body-m font-medium text-action-primary transition-colors duration-150 hover:bg-surface-card">
      {children}<Icon name={open ? 'chevron-up' : 'chevron-down'} size={16} />
    </button>
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
  /** Плашка под суммой — например «Короткая анкета: 3 шага и отправка без подписания» (Сбер) */
  notice?: ReactNode;
  title?: ReactNode;
  emptyText?: ReactNode;
  className?: string;
}

/** Боковая карточка «Выбранные банки» (прототип: PickedBanks). Отправленные — с замком, новые — с крестиком */
export function PickedBanks({ banks, program, amount, onRemove, notice, title = 'Выбранные банки', emptyText = 'Отметьте банки в списке — они появятся здесь', className }: PickedBanksProps) {
  return (
    <section className={cn('flex flex-col gap-4 rounded-20 border border-border-default bg-surface-white p-6', className)}>
      <div className="flex items-center justify-between gap-3">
        <h2 className="m-0 text-h2 text-text-primary">{title}</h2>
        <Badge tone={banks.length ? 'accent' : 'neutral'} dot={false} className="tabular-nums">{banks.length}</Badge>
      </div>
      <div className="flex items-baseline justify-between gap-3">
        <span className="text-[13px] text-text-secondary">{program}</span>
        <b className="text-[20px] leading-7 font-bold whitespace-nowrap text-text-primary tabular-nums">{rub(amount)}</b>
      </div>
      {notice && (
        <div className="flex items-start gap-2 rounded-12 bg-surface-card px-3 py-2.5 text-[13px] leading-[18px] text-text-primary">
          <Icon name="info" size={14} className="mt-0.5 shrink-0 text-action-primary" /><span>{notice}</span>
        </div>
      )}
      {banks.length === 0 ? (
        <p className="m-0 text-[13px] text-text-secondary">{emptyText}</p>
      ) : (
        <ul className="-mx-2 m-0 flex list-none flex-col gap-1 p-0">
          {banks.map((b) => (
            <li key={b.bank} className="flex items-center gap-3 rounded-12 p-2">
              <Avatar name={b.bank} size={36} />
              <div className="min-w-0 flex-1">
                <b className="block truncate text-body-m font-semibold text-text-primary">{b.bank}</b>
                <small className="block truncate text-caption text-text-secondary tabular-nums">{b.meta}</small>
              </div>
              {b.locked ? (
                <span className="grid size-8 shrink-0 place-items-center text-text-muted" title="Анкета уже отправлена в банк — убрать нельзя">
                  <Icon name="lock" size={16} label="Анкета отправлена, убрать нельзя" />
                </span>
              ) : (
                <button type="button" onClick={() => onRemove?.(b.bank)} aria-label={`Убрать ${b.bank}`}
                  className="inline-flex shrink-0 rounded-10 p-1 text-text-secondary hover:bg-surface-page">
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
