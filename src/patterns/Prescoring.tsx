import type { ReactNode } from 'react';
import { cn } from '../utils/cn';
import { plural } from '../utils/format';
import { Icon } from '../icons/Icon';
import { Avatar } from '../components/Avatar';
import { Badge } from '../components/Badge';

/* ───────────── Уровни рейтинга ───────────── */

/** Максимум шкалы бюро и границы уровней (как в прототипе и Figma) */
export const SCORE_MAX = 999;
export const SCORE_BOUNDS = { mid: 633, high: 861, top: 979 } as const;

export type ScoreLevel = 'low' | 'mid' | 'high' | 'top';

export const scoreLevel = (score: number): ScoreLevel =>
  score >= SCORE_BOUNDS.top ? 'top' : score >= SCORE_BOUNDS.high ? 'high' : score >= SCORE_BOUNDS.mid ? 'mid' : 'low';

export const SCORE_LABEL: Record<ScoreLevel, string> = { low: 'Низкий', mid: 'Средний', high: 'Высокий', top: 'Очень высокий' };
const SCORE_TONE: Record<ScoreLevel, string> = {
  low: 'bg-error-bg text-error', mid: 'bg-warning-bg text-warning-text', high: 'bg-success-bg text-success', top: 'bg-surface-card text-action-primary',
};

/** Бейдж уровня (прототип: .lvl) — m 28 px / 13, xs 20 px / 12. «Высокий» или «Высокий рейтинг» */
export function ScoreBadge({ score, suffix, size = 'm' }: { score: number; suffix?: string; size?: 'm' | 'xs' }) {
  const lv = scoreLevel(score);
  return (
    <span className={cn('inline-flex shrink-0 items-center rounded-999 font-medium whitespace-nowrap', SCORE_TONE[lv],
      size === 'xs' ? 'h-5 px-2 text-[12px]' : 'h-7 px-2.5 text-[13px]')}>
      {SCORE_LABEL[lv]}{suffix ? ` ${suffix}` : ''}
    </span>
  );
}

/* ───────────── Score pill ───────────── */

export interface ScorePillProps {
  score: number;
  /** Сколько ещё участников оценено: «+1» */
  more?: number;
  onClick?: () => void;
  label?: string;
  className?: string;
}

/**
 * Плашка кредитного рейтинга в шапке заявки — Figma: Флоу / Score pill. Высота 40, рамка accent.
 * Появляется вместо кнопки «Прескоринг», когда прескоринг пройден. На узком экране подпись скрывается.
 */
export function ScorePill({ score, more, onClick, label = 'Кредитный рейтинг', className }: ScorePillProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      title="Открыть результат прескоринга"
      className={cn(
        'inline-flex h-10 shrink-0 items-center gap-2 rounded-999 border border-border-blue bg-surface-white pr-1.5 pl-3.5 transition-colors duration-150',
        'hover:border-action-primary hover:bg-surface-card',
        className,
      )}
    >
      <Icon name="gauge" size={16} className="text-action-primary" />
      <span className="text-body-m text-text-secondary max-[520px]:sr-only">{label}</span>
      <b className="text-button-m text-text-primary tabular-nums">{score}</b>
      <ScoreBadge score={score} />
      {more ? <span className="pr-1.5 text-caption-medium text-action-primary" aria-label={`ещё ${more}`}>+{more}</span> : null}
    </button>
  );
}

/* ───────────── Participant ───────────── */

export interface ParticipantProps {
  /** ФИО. Пусто — «Новый участник» и номер вместо инициалов */
  name: string;
  /** Порядковый номер для аватара, пока нет имени */
  index?: number;
  /** «Заёмщик», «Созаёмщик · супруг(а)» */
  role: ReactNode;
  /** Статус анкеты: «Заполняется» (accent) или «После заёмщика» (neutral) */
  status: ReactNode;
  statusTone?: 'accent' | 'neutral' | 'success';
  /** Участник, чью анкету заполняем сейчас, — голубая карточка */
  current?: boolean;
  /** Балл прескоринга. Нет — ссылка «Пройти прескоринг» */
  score?: number;
  /** Количество замечаний прескоринга — «ⓘ 1 замечание» */
  warnings?: number;
  onPrescoring?: () => void;
  /** Крестик — убрать созаёмщика */
  onRemove?: () => void;
  className?: string;
}

/** Карточка участника заявки (прототип: .part). Текущий — голубой фон и рамка accent */
export function Participant({ name, index, role, status, statusTone = 'neutral', current, score, warnings, onPrescoring, onRemove, className }: ParticipantProps) {
  const link = '-ml-1 mt-2 inline-flex items-center gap-1.5 self-start rounded-[8px] px-1 py-0.5 text-[12px] leading-[18px] transition-colors duration-150 hover:bg-surface-card';
  return (
    <article aria-current={current || undefined}
      className={cn('flex min-w-0 items-center gap-3 rounded-16 border px-4 py-3', current ? 'border-border-blue bg-surface-card' : 'border-border-default bg-surface-white', className)}>
      {name ? <Avatar name={name} size={36} className={cn(current && 'bg-surface-white')} />
        : <Avatar text={String(index ?? 1)} size={36} className={cn(current && 'bg-surface-white')} />}
      <div className="flex min-w-0 flex-1 flex-col">
        <b className="truncate text-[15px] leading-[22px] font-semibold text-text-primary">{name || 'Новый участник'}</b>
        <div className="mt-1 flex flex-wrap items-center gap-2">
          <small className="text-[12px] text-text-secondary">{role}</small>
          <Badge tone={statusTone} className={cn('h-[22px] text-[12px]', current && 'bg-surface-white')}>{status}</Badge>
        </div>
        {score === undefined ? (
          <button type="button" onClick={onPrescoring} className={cn(link, 'text-action-primary')}>
            <Icon name="gauge" size={14} />Пройти прескоринг
          </button>
        ) : (
          <button type="button" onClick={onPrescoring} title="Открыть результат прескоринга" className={cn(link, 'flex-wrap text-text-secondary')}>
            <Icon name="gauge" size={14} className="text-action-primary" />
            <span>Прескоринг</span>
            <b className="font-semibold text-text-primary tabular-nums">{score}</b>
            <ScoreBadge score={score} size="xs" />
            {warnings ? (
              <span className="inline-flex items-center gap-[3px] text-warning-text">
                <Icon name="info" size={12} />{warnings} {plural(warnings, 'замечание', 'замечания', 'замечаний')}
              </span>
            ) : null}
          </button>
        )}
      </div>
      {onRemove && (
        <button type="button" onClick={onRemove} aria-label={`Убрать: ${name || 'участник'}`}
          className="inline-flex shrink-0 self-start rounded-10 p-1 text-text-secondary hover:bg-surface-page">
          <Icon name="x" size={16} />
        </button>
      )}
    </article>
  );
}

/* ───────────── Score card ───────────── */

export interface ScoreCardProps {
  score: number;
  name: string;
  role?: ReactNode;
  className?: string;
}

const pos = (v: number) => `${(v / SCORE_MAX) * 100}%`;

/**
 * Рейтинг участника в отчёте прескоринга — Figma: Флоу / Score card.
 * Крупный балл «из 999», бейдж уровня, шкала из 4 цветов (rating/low…top) и маркер.
 */
export function ScoreCard({ score, name, role, className }: ScoreCardProps) {
  const ticks = [1, SCORE_BOUNDS.mid, SCORE_BOUNDS.high];
  return (
    <section className={cn('flex items-center gap-6 rounded-16 bg-surface-card p-5 max-[520px]:flex-col max-[520px]:items-stretch', className)}>
      <div className="flex min-w-24 flex-col items-center">
        <span className="text-num-xl text-text-primary tabular-nums">{score}</span>
        <span className="text-caption text-text-secondary">из {SCORE_MAX}</span>
      </div>
      <div className="flex min-w-0 flex-1 flex-col items-start gap-2.5">
        <div className="flex flex-wrap items-baseline gap-x-2">
          <b className="text-[15px] leading-[22px] font-semibold text-text-primary">{name}</b>
          {role && <span className="text-[12px] text-text-secondary">{role}</span>}
        </div>
        <ScoreBadge score={score} suffix="рейтинг" />
        <div className="relative mt-1 w-full">
          <div
            role="meter" aria-valuemin={1} aria-valuemax={SCORE_MAX} aria-valuenow={score} aria-label="Кредитный рейтинг"
            className="flex h-2 w-full overflow-hidden rounded-999"
          >
            <span className="bg-rating-low" style={{ width: pos(SCORE_BOUNDS.mid) }} />
            <span className="bg-rating-mid" style={{ width: pos(SCORE_BOUNDS.high - SCORE_BOUNDS.mid) }} />
            <span className="bg-rating-high" style={{ width: pos(SCORE_BOUNDS.top - SCORE_BOUNDS.high) }} />
            <span className="flex-1 bg-rating-top" />
          </div>
          <span
            aria-hidden
            className="absolute top-1/2 size-4 -translate-1/2 rounded-full border-[3px] border-action-primary bg-surface-white shadow-[0_1px_4px_rgb(16_36_94/0.2)]"
            style={{ left: pos(Math.min(Math.max(score, 1), SCORE_MAX)) }}
          />
        </div>
        <div className="relative h-4 w-full text-[11px] leading-4 text-text-secondary">
          {ticks.map((t, i) => (
            // 861 на узком экране наезжает на «979 · 999» — прячем, граница видна по цвету шкалы
            <span key={t} className={cn('absolute top-0', i === 2 && 'max-[520px]:hidden')} style={{ left: pos(t), transform: i === 0 ? 'none' : 'translateX(-50%)' }}>{t}</span>
          ))}
          <span className="absolute top-0 right-0">{SCORE_BOUNDS.top} · {SCORE_MAX}</span>
        </div>
      </div>
    </section>
  );
}

/* ───────────── Signal tile ───────────── */

export interface SignalTileProps {
  /** «Банкротство», «Исп. производства» */
  label: ReactNode;
  value: ReactNode;
  /** ok — серая плитка с галочкой; warning — жёлтая с info */
  state?: 'ok' | 'warning';
  className?: string;
}

/** Плитка проверки в отчёте прескоринга — Figma: Флоу / Signal tile (OK · Warning). Радиус 10 */
export function SignalTile({ label, value, state = 'ok', className }: SignalTileProps) {
  const warn = state === 'warning';
  return (
    <div className={cn('flex min-w-0 flex-col gap-0.5 rounded-10 px-2.5 py-2', warn ? 'bg-warning-bg' : 'bg-surface-page', className)}>
      <span className="truncate text-[11px] leading-4 text-text-secondary">{label}</span>
      <span className={cn('flex items-center gap-1 text-[13px] leading-[18px] font-medium', warn ? 'text-warning-text' : 'text-text-primary')}>
        <Icon name={warn ? 'info' : 'check'} size={12} className={cn('shrink-0', !warn && 'text-success')} />
        <span className="min-w-0 truncate">{value}</span>
      </span>
    </div>
  );
}

/* ───────────── Report section ───────────── */

export interface ReportSectionProps {
  /** Заголовок капсом: «Кредитная нагрузка» */
  title: ReactNode;
  rows: readonly { label: ReactNode; value: ReactNode; warning?: boolean }[];
  className?: string;
}

/** Раздел отчёта прескоринга — Figma: Флоу / Report section. Overline + строки «подпись — значение» Body/S */
export function ReportSection({ title, rows, className }: ReportSectionProps) {
  return (
    <section className={cn('min-w-0', className)}>
      <h5 className="m-0 mb-1.5 text-[12px] leading-4 font-semibold tracking-[0.04em] text-text-secondary uppercase">{title}</h5>
      <dl className="m-0 grid grid-cols-[minmax(0,1fr)_auto] gap-x-3 gap-y-1 text-[13px] leading-[18px]">
        {rows.map((r, i) => (
          <div key={i} className="contents">
            <dt className="text-text-secondary">{r.label}</dt>
            <dd className={cn('m-0 text-right font-medium', r.warning ? 'text-warning-text' : 'text-text-primary')}>{r.value}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

/** Сетка плиток проверок (прототип: .ps-key) — 3 в ряд, 2 на телефоне */
export function SignalGrid({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn('grid grid-cols-3 gap-2 max-[520px]:grid-cols-2', className)}>{children}</div>;
}

/** Полный отчёт БКИ (прототип: .ps-full) — разделы в 2 колонки, 1 на телефоне */
export function ReportGrid({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn('grid grid-cols-2 gap-x-6 gap-y-4 max-[520px]:grid-cols-1', className)}>{children}</div>;
}
