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
const SCORE_TONE = { low: 'error', mid: 'warning', high: 'success', top: 'accent' } as const;

/** Бейдж уровня: «Высокий» / «Высокий рейтинг» */
export function ScoreBadge({ score, suffix, size }: { score: number; suffix?: string; size?: 's' | 'xs' }) {
  const lv = scoreLevel(score);
  return <Badge tone={SCORE_TONE[lv]} size={size} dot={false}>{SCORE_LABEL[lv]}{suffix ? ` ${suffix}` : ''}</Badge>;
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
  name: string;
  /** «Заёмщик», «Созаёмщик · супруг(а)» */
  role: ReactNode;
  /** Статус анкеты: «Заполняется» (accent) или «Не начато» (neutral) */
  status: ReactNode;
  statusTone?: 'accent' | 'neutral' | 'success';
  /** Балл прескоринга. Нет — ссылка «Пройти прескоринг» */
  score?: number;
  /** Количество замечаний прескоринга — жёлтая строка «1 замечание» */
  warnings?: number;
  onPrescoring?: () => void;
  /** Крестик — убрать созаёмщика */
  onRemove?: () => void;
  className?: string;
}

/**
 * Карточка участника заявки — Figma: Флоу / Participant (Borrower · scored, Co-borrower · warning, Not scored).
 * Рамка, радиус 16, отступ 16.
 */
export function Participant({ name, role, status, statusTone = 'neutral', score, warnings, onPrescoring, onRemove, className }: ParticipantProps) {
  return (
    <article className={cn('relative flex min-w-0 gap-3 rounded-16 border border-border-default bg-surface-white p-4', onRemove && 'pr-11', className)}>
      <Avatar name={name} size={36} />
      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <h3 className="m-0 truncate text-body-m-medium text-text-primary">{name || 'Новый участник'}</h3>
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-caption text-text-secondary">{role}</span>
          <Badge tone={statusTone}>{status}</Badge>
        </div>
        {score === undefined ? (
          <button type="button" onClick={onPrescoring}
            className="inline-flex items-center gap-1.5 self-start pt-1 text-caption-medium text-action-primary hover:text-action-hover">
            <Icon name="gauge" size={14} />Пройти прескоринг
          </button>
        ) : (
          <button type="button" onClick={onPrescoring} title="Открыть результат прескоринга"
            className="flex flex-wrap items-center gap-1.5 self-start rounded-6 pt-1 text-left">
            <Icon name="gauge" size={14} className="text-action-primary" />
            <span className="text-caption text-text-secondary">Прескоринг</span>
            <b className="text-caption-medium text-text-primary tabular-nums">{score}</b>
            <ScoreBadge score={score} />
            {warnings ? (
              <span className="flex basis-full items-center gap-[3px] text-caption text-warning-text">
                <Icon name="info" size={12} />{warnings} {plural(warnings, 'замечание', 'замечания', 'замечаний')}
              </span>
            ) : null}
          </button>
        )}
      </div>
      {onRemove && (
        <button type="button" onClick={onRemove} aria-label={`Убрать: ${name || 'участник'}`}
          className="absolute top-3 right-3 grid size-7 place-items-center rounded-6 text-text-secondary hover:bg-surface-page hover:text-text-primary">
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
      <div className="flex min-w-20 flex-col items-center">
        <span className="text-num-xl text-text-primary tabular-nums">{score}</span>
        <span className="text-caption text-text-secondary">из {SCORE_MAX}</span>
      </div>
      <div className="flex min-w-0 flex-1 flex-col items-start gap-2.5">
        <div className="flex flex-wrap items-baseline gap-x-2">
          <span className="text-body-m-medium text-text-primary">{name}</span>
          {role && <span className="text-caption text-text-secondary">{role}</span>}
        </div>
        <ScoreBadge score={score} suffix="рейтинг" />
        <div className="relative mt-1 w-full">
          <div
            role="meter" aria-valuemin={1} aria-valuemax={SCORE_MAX} aria-valuenow={score} aria-label="Кредитный рейтинг"
            className="flex h-2 w-full overflow-hidden rounded-[4px]"
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
        <div className="relative h-4.5 w-full text-caption text-text-secondary">
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
      <span className="truncate text-caption text-text-secondary">{label}</span>
      <span className={cn('flex items-center gap-1 text-body-m-medium', warn ? 'text-warning-text' : 'text-text-primary')}>
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
    <section className={cn('flex flex-col gap-1.5', className)}>
      <h4 className="m-0 text-overline text-text-secondary">{title}</h4>
      <dl className="m-0 flex flex-col gap-1.5">
        {rows.map((r, i) => (
          <div key={i} className="flex items-baseline justify-between gap-4 text-body-s">
            <dt className="text-text-secondary">{r.label}</dt>
            <dd className={cn('m-0 text-right', r.warning ? 'text-warning-text' : 'text-text-primary')}>{r.value}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
