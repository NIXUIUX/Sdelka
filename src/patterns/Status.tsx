import { useId, useState, type ReactNode } from 'react';
import { cn } from '../utils/cn';
import { rub, years } from '../utils/format';
import { Icon, type IconName } from '../icons/Icon';
import { Avatar } from '../components/Avatar';
import { Badge } from '../components/Badge';
import { Button } from '../components/Button';
import { Textarea } from '../components/Textarea';
import type { ParamRow } from './Params';

/* Источник правды — прототип флоу Б (экраны «1.5 Статус в банках» и «0.0 Ипотечные заявки»). */

/** Раскрытие: управляемое (expanded + onExpandedChange) или своё */
function useExpand(expanded?: boolean, onChange?: (v: boolean) => void, initial = false) {
  const [inner, setInner] = useState(initial);
  const open = expanded ?? inner;
  return [open, () => { onChange?.(!open); if (expanded === undefined) setInner(!open); }] as const;
}

/* ───────────── Status bank card ───────────── */

export type BankStatus = 'sent' | 'approved' | 'docs' | 'declined';
export const BANK_STATUS: Record<BankStatus, { label: string; tone: 'accent' | 'success' | 'warning' | 'error' }> = {
  sent: { label: 'Отправлено', tone: 'accent' },
  approved: { label: 'Одобрено', tone: 'success' },
  docs: { label: 'Нужны документы', tone: 'warning' },
  declined: { label: 'Отказ', tone: 'error' },
};

export interface StatusBankCardProps {
  bank: string;
  status: BankStatus;
  /** «Отправлено сегодня, 10:50» */
  meta?: ReactNode;
  /** Параметры кредита в раскрытии: Ставка, Платёж, Сумма, Срок, Первый взнос, Программа */
  params?: readonly ParamRow[];
  /** Выбрана — слева открыт этот банк */
  selected?: boolean;
  onSelect?: () => void;
  expanded?: boolean;
  onExpandedChange?: (v: boolean) => void;
  className?: string;
}

/**
 * Карточка банка в боковой колонке статусов. Выбранная — голубой фон и синяя рамка 2.
 * Внизу под линией — раскрытие «Параметры кредита».
 */
export function StatusBankCard({ bank, status, meta, params, selected, onSelect, expanded, onExpandedChange, className }: StatusBankCardProps) {
  const [open, toggle] = useExpand(expanded, onExpandedChange);
  const st = BANK_STATUS[status];
  const bodyId = useId();
  return (
    <article
      className={cn(
        'flex flex-col gap-2 rounded-20 border text-left transition-colors duration-150',
        selected ? 'border-2 border-action-primary bg-surface-card p-[19px]' : 'border-border-default bg-surface-white p-5',
        !selected && onSelect && 'hover:border-border-blue hover:bg-surface-page',
        className,
      )}
    >
      <button type="button" onClick={onSelect} disabled={!onSelect} aria-pressed={onSelect ? !!selected : undefined}
        className="flex w-full flex-col gap-2.5 text-left disabled:cursor-default">
        <span className="flex items-center gap-3">
          <Avatar name={bank} size={36} />
          <b className="min-w-0 flex-1 truncate text-[17px] leading-6 font-semibold text-text-primary">{bank}</b>
          <Badge tone={st.tone}>{st.label}</Badge>
        </span>
        {meta && <span className="text-body-s-relaxed text-text-secondary">{meta}</span>}
      </button>
      {params && params.length > 0 && (
        <>
          <button type="button" onClick={toggle} aria-expanded={open} aria-controls={bodyId}
            className="mt-1 flex w-full items-center justify-between border-t border-border-default pt-2 text-[13px] leading-[22px] font-medium text-action-primary">
            Параметры кредита
            <Icon name={open ? 'chevron-up' : 'chevron-down'} size={16} />
          </button>
          {open && (
            <dl id={bodyId} className="mt-1 grid grid-cols-[1fr_auto] gap-x-3 gap-y-2 text-body-s-relaxed tabular-nums">
              {params.map((p, i) => (
                <div key={i} className="contents">
                  <dt className="text-text-secondary">{p.label}</dt>
                  <dd className="m-0 text-right text-text-primary">{p.value}</dd>
                </div>
              ))}
            </dl>
          )}
        </>
      )}
    </article>
  );
}

/* ───────────── Sent conditions / Info hero ───────────── */

/** Направленные условия: рамка, 4 показателя в строку (2 на телефоне). `accent` — значение синим, `note` — сноска «*» */
export function ConditionsBox({ items, note, className }: {
  items: readonly (ParamRow & { accent?: boolean })[]; note?: ReactNode; className?: string;
}) {
  return (
    <div className={className}>
      <dl className="m-0 grid grid-cols-4 gap-4 rounded-16 border border-border-default p-5 max-[720px]:grid-cols-2">
        {items.map((it, i) => (
          <div key={i} className="min-w-0">
            <dt className="text-caption text-text-secondary">{it.label}</dt>
            <dd className={cn('m-0 text-[20px] leading-7 font-bold tabular-nums', it.accent ? 'text-action-primary' : 'text-text-primary')}>{it.value}</dd>
          </div>
        ))}
      </dl>
      {note && <p className="m-0 mt-2 text-caption text-text-secondary">{note}</p>}
    </div>
  );
}

/** Крупный информационный блок по центру: «Ожидаем решение банка» (голубой) или успех (зелёный) */
export function InfoHero({ icon = 'clock', title, children, tone = 'info', action, className }: {
  icon?: IconName; title: ReactNode; children?: ReactNode; tone?: 'info' | 'success'; action?: ReactNode; className?: string;
}) {
  return (
    <section className={cn('flex flex-col items-center gap-3 rounded-16 p-8 text-center', tone === 'success' ? 'bg-success-bg' : 'bg-surface-card', className)}>
      <span className={cn('grid size-10 place-items-center rounded-12 bg-surface-white', tone === 'success' ? 'text-success' : 'text-action-primary')}>
        <Icon name={icon} size={24} />
      </span>
      <h3 className="m-0 text-h3 text-text-primary">{title}</h3>
      {children && <p className="m-0 max-w-[480px] text-body-m text-text-secondary">{children}</p>}
      {action}
    </section>
  );
}

/* ───────────── Mail ───────────── */

export interface MailItemProps {
  /** «Письмо с заявкой», «Письмо в банк» */
  title: ReactNode;
  /** «Исходный пакет и направленные условия» или автор «Дмитрий Сорокин» */
  subtitle?: ReactNode;
  /** «10:50» */
  time?: ReactNode;
  /** out — отправили мы (send), in — пришло от банка (mail) */
  direction?: 'out' | 'in';
  to?: ReactNode;
  subject?: ReactNode;
  /** Плашка над текстом — например Alert «Не меняйте тему письма…» */
  notice?: ReactNode;
  /** Текст письма */
  children?: ReactNode;
  /** Подпись серым: «С уважением, ООО «Сделка.РФ», …» */
  signature?: ReactNode;
  /** Вложения — FileItem; выводятся сеткой в 2 колонки с заголовком «Вложения · N» */
  attachments?: readonly ReactNode[];
  /** Можно ли сворачивать. false — всегда открыто (так в прототипе показаны свои письма) */
  collapsible?: boolean;
  expanded?: boolean;
  onExpandedChange?: (v: boolean) => void;
  defaultExpanded?: boolean;
  className?: string;
}

/**
 * Письмо в переписке с банком: голубая карточка, белое тело письма, вложения сеткой.
 */
export function MailItem({
  title, subtitle, time, direction = 'out', to, subject, notice, children, signature, attachments, collapsible = true,
  expanded, onExpandedChange, defaultExpanded = true, className,
}: MailItemProps) {
  const [openState, toggle] = useExpand(expanded, onExpandedChange, defaultExpanded);
  const open = collapsible ? openState : true;
  const bodyId = useId();
  const head = (
    <>
      <span className="grid size-10 shrink-0 place-items-center rounded-12 bg-surface-white text-action-primary">
        <Icon name={direction === 'in' ? 'mail' : 'send'} size={18} />
      </span>
      <span className="flex min-w-0 flex-1 flex-col">
        <b className="truncate text-body-m leading-[22px] font-semibold text-text-primary">{title}</b>
        {subtitle && <span className="truncate text-caption leading-[22px] text-text-secondary">{subtitle}</span>}
      </span>
      {time && <span className="shrink-0 text-caption text-text-secondary">{time}</span>}
      {collapsible && <Icon name={open ? 'chevron-up' : 'chevron-down'} size={18} className="shrink-0 text-text-secondary" />}
    </>
  );
  return (
    <article className={cn('flex flex-col gap-4 rounded-16 border border-border-default bg-surface-card p-5', className)}>
      {collapsible ? (
        <button type="button" onClick={toggle} aria-expanded={open} aria-controls={bodyId}
          className="-m-1 flex items-center gap-3 rounded-12 p-1 text-left transition-colors duration-150 hover:bg-surface-page">{head}</button>
      ) : <div className="flex items-center gap-3">{head}</div>}
      {open && (
        <div id={bodyId} className="flex flex-col gap-4">
          <div className="flex flex-col gap-3 rounded-12 border border-border-default bg-surface-white p-5 text-body-s-relaxed text-text-primary">
            {to && <p className="m-0 break-words"><b className="font-semibold">Получатели:</b> {to}</p>}
            {subject && <p className="m-0"><b className="font-semibold">Тема:</b> {subject}</p>}
            {notice}
            {children && <div className="whitespace-pre-wrap">{children}</div>}
            {signature && <p className="m-0 text-text-secondary">{signature}</p>}
          </div>
          {attachments && attachments.length > 0 && (
            <>
              <b className="text-[13px] font-semibold text-text-primary">Вложения · {attachments.length}</b>
              <div className="grid grid-cols-2 gap-3 max-[640px]:grid-cols-1">{attachments}</div>
            </>
          )}
        </div>
      )}
    </article>
  );
}

/** Сворачиваемый «Ответ банка»: белая строка с бейджем «Получен» / «Ожидаем» */
export function BankReply({ received, children, title = 'Ответ банка', defaultExpanded = false, className }: {
  received: boolean; children?: ReactNode; title?: ReactNode; defaultExpanded?: boolean; className?: string;
}) {
  const [open, toggle] = useExpand(undefined, undefined, defaultExpanded);
  const bodyId = useId();
  return (
    <div className={cn('flex flex-col gap-3', className)}>
      <button type="button" onClick={toggle} aria-expanded={open} aria-controls={bodyId}
        className="flex w-full items-center gap-3 rounded-16 border border-border-default bg-surface-white px-5 py-4 text-left transition-colors duration-150 hover:border-border-blue hover:bg-surface-page">
        <b className="flex-1 text-body-m font-semibold text-text-primary">{title}</b>
        {received ? <Badge tone="success">Получен</Badge> : <Badge tone="warning">Ожидаем</Badge>}
      </button>
      {open && (
        <div id={bodyId} className="rounded-12 border border-border-default bg-surface-white p-5 text-[13px] leading-5 text-text-primary">
          {children ?? <span className="text-text-secondary">Ответа пока нет. Нажмите «Обновить статусы», чтобы проверить</span>}
        </div>
      )}
    </div>
  );
}

export interface MailComposeProps {
  /** «Абсолют Банк · mortgage@example.com» */
  to: ReactNode;
  subject: ReactNode;
  value: string;
  onChange: (v: string) => void;
  onSend: () => void;
  onCancel?: () => void;
  error?: ReactNode;
  sending?: boolean;
  /** Над кнопками — например UploadZone для вложений */
  children?: ReactNode;
  className?: string;
}

/** Форма письма в банк: «Кому / Тема», поле текста, кнопки S «Отмена» и «Отправить» */
export function MailCompose({ to, subject, value, onChange, onSend, onCancel, error, sending, children, className }: MailComposeProps) {
  return (
    <form className={cn('flex flex-col gap-3 rounded-16 border border-border-blue p-4', className)} onSubmit={(e) => { e.preventDefault(); onSend(); }}>
      <p className="m-0 text-[13px] leading-5 text-text-secondary">
        <b className="font-semibold text-text-primary">Кому:</b> {to}<br />
        <b className="font-semibold text-text-primary">Тема:</b> {subject}
      </p>
      <Textarea label="Текст письма" rows={4} value={value} onChange={onChange} error={error}
        placeholder="Например: направляем дополнительные документы по заявке" data-autofocus />
      {children}
      <div className="flex flex-wrap gap-3">
        {onCancel && <Button variant="outline" size="s" onClick={onCancel}>Отмена</Button>}
        <Button type="submit" size="s" icon="send" loading={sending}>Отправить</Button>
      </div>
    </form>
  );
}

/* ───────────── Deals table ───────────── */

export interface Deal {
  id: string | number;
  /** Заёмщик */
  name: string;
  /** Созаёмщики — серыми строками под именем */
  co?: readonly string[];
  /** Организация брокера */
  org?: ReactNode;
  region: ReactNode;
  banks: readonly string[];
  /** Сумма, ₽ и срок, лет */
  sum: number;
  term: number;
  created: ReactNode;
  updated: ReactNode;
  status: ReactNode;
  statusTone?: 'neutral' | 'accent' | 'success' | 'warning' | 'error';
  /** Есть новое сообщение от банка — иконка письма и голубой фон строки */
  unread?: boolean;
  archived?: boolean;
}

export interface DealRowProps {
  deal: Deal;
  onOpen?: (deal: Deal) => void;
  /** В архив / вернуть из архива */
  onArchiveToggle?: (deal: Deal) => void;
}

/** Статусы заявки и их цвета (из прототипа) */
export const DEAL_STATUS_TONE = {
  'Консультация': 'neutral', 'Заполнение': 'accent', 'Подписание': 'accent', 'Отправлено в банки': 'accent',
  'Доработка': 'warning', 'Одобрено': 'success', 'Отказ': 'error',
} as const;

/** Строка таблицы заявок. Непрочитанная — голубая, архивная — серая с кнопкой «Вернуть из архива» */
export function DealRow({ deal: d, onOpen, onArchiveToggle }: DealRowProps) {
  const td = 'border-b border-border-default px-3 py-4 align-top text-body-m leading-[22px]';
  const bg = d.archived ? 'bg-surface-page group-hover/row:bg-[#eff1f4]' : d.unread ? 'bg-surface-card group-hover/row:bg-[#e4effd]' : 'bg-surface-white group-hover/row:bg-surface-page';
  const cell = cn(td, bg, 'transition-colors duration-150', d.archived ? 'text-text-secondary' : 'text-text-primary');
  const small = 'block text-caption text-text-secondary';
  return (
    <tr onClick={onOpen ? () => onOpen(d) : undefined} className={cn('group/row', onOpen && 'cursor-pointer')}>
      <td className={cell}>
        <button type="button" onClick={(e) => { e.stopPropagation(); onOpen?.(d); }}
          className={cn('group/name inline-flex items-center gap-1.5 text-left', d.archived ? 'text-text-secondary' : 'text-action-primary')}>
          {d.unread && !d.archived && <Icon name="mail" size={16} label="Есть новое сообщение от банка" />}
          <b className={cn('group-hover/name:underline', d.archived ? 'font-medium' : 'font-semibold')}>{d.name}</b>
          <Icon name="arrow-right" size={14} />
        </button>
        {d.co?.map((c) => <span key={c} className={small}>{c}</span>)}
        {d.org && <span className={small}>{d.org}</span>}
      </td>
      <td className={cell}>{d.region}</td>
      <td className={cell}>{d.banks.map((b) => <div key={b}>{b}</div>)}</td>
      <td className={cn(cell, 'whitespace-nowrap tabular-nums')}>
        <b className={d.archived ? 'font-medium' : 'font-semibold'}>{rub(d.sum)}</b>
        <span className={small}>на {years(d.term)}</span>
      </td>
      <td className={cn(cell, 'tabular-nums')}>{d.id}</td>
      <td className={cn(cell, 'tabular-nums')}>{d.created}</td>
      <td className={cn(cell, 'tabular-nums')}>{d.updated}</td>
      <td className={cell}>
        <Badge tone={d.archived ? 'neutral' : d.statusTone ?? 'neutral'} className={cn((d.archived || d.unread) && 'bg-surface-white')}>{d.status}</Badge>
      </td>
      <td className={cn(cell, 'w-12')}>
        {onArchiveToggle && (
          <button
            type="button"
            title={d.archived ? 'Вернуть из архива' : 'В архив'}
            aria-label={`${d.archived ? 'Вернуть из архива' : 'В архив'}: ${d.name}`}
            onClick={(e) => { e.stopPropagation(); onArchiveToggle(d); }}
            className={cn('-my-1.5 grid size-9 place-items-center rounded-10 text-action-primary transition-colors duration-150',
              d.archived ? 'bg-surface-card hover:bg-surface-hover-soft' : 'hover:bg-surface-card')}
          >
            <Icon name={d.archived ? 'archive-restore' : 'archive'} size={18} />
          </button>
        )}
      </td>
    </tr>
  );
}

export interface DealsTableProps extends Omit<DealRowProps, 'deal'> {
  deals: readonly Deal[];
  /** Пусто — блок «Ничего не нашли» с кнопкой сброса */
  onReset?: () => void;
  emptyTitle?: ReactNode;
  emptyText?: ReactNode;
  className?: string;
}

/**
 * Таблица заявок как в прототипе: архивные идут отдельной группой «Архив · N» внизу.
 * На узком экране прокручивается по горизонтали (мин. ширина 960).
 */
export function DealsTable({
  deals, onOpen, onArchiveToggle, onReset, emptyTitle = 'Ничего не нашли', emptyText = 'Попробуйте изменить запрос или сбросить фильтры', className,
}: DealsTableProps) {
  if (!deals.length) {
    return (
      <div className={cn('px-4 py-12 text-center text-text-secondary', className)}>
        <span className="mx-auto mb-3 grid size-10 place-items-center rounded-12 bg-surface-card text-action-primary"><Icon name="search" size={22} /></span>
        <h3 className="m-0 mb-1 text-h3 text-text-primary">{emptyTitle}</h3>
        <p className="m-0 text-body-m">{emptyText}</p>
        {onReset && <Button variant="outline" className="mt-4" onClick={onReset}>Сбросить всё</Button>}
      </div>
    );
  }
  const active = deals.filter((d) => !d.archived);
  const archived = deals.filter((d) => d.archived);
  const th = 'border-b border-border-default px-3 py-3 text-left text-[13px] [line-height:normal] font-normal whitespace-nowrap text-text-secondary';
  return (
    <div className={cn('-mx-2 overflow-x-auto', className)}>
      <table className="w-full min-w-[960px] border-separate border-spacing-0">
        <thead>
          <tr>
            <th className={th}>Заёмщик и созаёмщики</th><th className={th}>Регион</th><th className={th}>Банки</th>
            <th className={th}>Сумма и срок</th><th className={th}>№ заявки</th><th className={th}>Создана</th>
            <th className={th}>Обновлён статус</th><th className={th}>Статус</th><th className={th}><span className="sr-only">Действия</span></th>
          </tr>
        </thead>
        <tbody>
          {active.map((d) => <DealRow key={d.id} deal={d} onOpen={onOpen} onArchiveToggle={onArchiveToggle} />)}
          {archived.length > 0 && (
            <tr>
              <td colSpan={9} className="px-3 pt-5 pb-2 text-[13px] font-semibold text-text-secondary">
                <Icon name="archive" size={16} className="mr-1 inline align-[-3px]" />Архив · {archived.length}
              </td>
            </tr>
          )}
          {archived.map((d) => <DealRow key={d.id} deal={d} onOpen={onOpen} onArchiveToggle={onArchiveToggle} />)}
        </tbody>
      </table>
    </div>
  );
}
