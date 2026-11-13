import { useEffect, useRef, useState, type ReactNode } from 'react';
import { cn } from '../utils/cn';
import { plural } from '../utils/format';
import { Icon, type IconName } from '../icons/Icon';
import { Avatar } from '../components/Avatar';
import { Badge } from '../components/Badge';
import { Button } from '../components/Button';
import { MiniStepper } from '../components/Stepper';
import { Container } from '../components/Layout';
import { IconTile } from '../components/Surface';

/* Блоки прототипа флоу Б, которых нет в Figma «Мягко»: участники, срок в банке, окно банка, подписание, страница клиента. */

/* ───────────── Участники заявки ───────────── */

/** Карточка «Участники заявки» (прототип: .parts): заголовок, «Добавить созаёмщика», сетка Participant (от 300 px) */
export function ParticipantsCard({ title = 'Участники заявки', onAdd, addLabel = 'Добавить созаёмщика', children, className }: {
  title?: ReactNode; onAdd?: () => void; addLabel?: ReactNode; children: ReactNode; className?: string;
}) {
  return (
    <section className={cn('flex flex-col gap-4 rounded-20 border border-border-default bg-surface-white p-6', className)}>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="m-0 text-h2 text-text-primary">{title}</h2>
        {onAdd && <Button variant="outline" size="s" icon="plus" onClick={onAdd}>{addLabel}</Button>}
      </div>
      <div className="grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-3 max-[360px]:grid-cols-1">{children}</div>
    </section>
  );
}

/* ───────────── Срок кредита в банке ───────────── */

/** «Срок кредита в этом банке» (прототип: BankTerm). Изменённый срок можно вернуть к значению из подбора */
export function TermEdit({ value, base, onChange, approved, min = 1, max = 30 }: {
  value: number; base: number; onChange: (v: number) => void; approved?: boolean; min?: number; max?: number;
}) {
  const changed = value !== base;
  return (
    <div className="flex flex-wrap items-center justify-between gap-4 rounded-16 border border-border-default px-4 py-3">
      <div className="min-w-0">
        <b className="block text-body-m font-semibold text-text-primary">Срок кредита в этом банке</b>
        <small className="text-caption text-text-secondary">
          {changed ? `Изменён · в подборе было ${base} ${plural(base, 'год', 'года', 'лет')}` : approved ? 'После одобрения банк пересчитает платёж' : 'Можно поменять до решения банка'}
        </small>
      </div>
      <div className="flex items-center gap-3">
        {changed && <Button variant="link" onClick={() => onChange(base)}>Вернуть</Button>}
        <MiniStepper label="срок кредита" value={value} onChange={onChange} min={min} max={max} />
        <span className="text-[13px] text-text-secondary">{plural(value, 'год', 'года', 'лет')}</span>
      </div>
    </div>
  );
}

/* ───────────── Окно банка ───────────── */

/** Крупные показатели в окне банка (.bm-top): 4 в ряд, значения 22/600 */
export function BankFacts({ items, note }: { items: readonly { label: ReactNode; value: ReactNode; accent?: boolean }[]; note?: ReactNode }) {
  return (
    <div className="flex flex-col gap-2">
      <dl className="m-0 grid grid-cols-4 gap-4 max-[640px]:grid-cols-2">
        {items.map((it, i) => (
          <div key={i} className="min-w-0">
            <dt className="text-caption text-text-secondary">{it.label}</dt>
            <dd className={cn('m-0 text-num-l tabular-nums', it.accent ? 'text-action-primary' : 'text-text-primary')}>{it.value}</dd>
          </div>
        ))}
      </dl>
      {note && <p className="m-0 text-caption text-text-secondary">{note}</p>}
    </div>
  );
}

/** Лимиты банка на голубой подложке (.bm-grid): ПСК, взнос, срок, сумма — значения 16/600 */
export function BankLimits({ items }: { items: readonly { label: ReactNode; value: ReactNode }[] }) {
  return (
    <dl className="m-0 grid grid-cols-4 gap-4 rounded-16 bg-surface-card px-5 py-4 max-[640px]:grid-cols-2">
      {items.map((it, i) => (
        <div key={i} className="min-w-0">
          <dt className="text-caption text-text-secondary">{it.label}</dt>
          <dd className="m-0 text-[16px] leading-6 font-semibold text-text-primary tabular-nums">{it.value}</dd>
        </div>
      ))}
    </dl>
  );
}

/** Список с иконками (.bm-list): требования — зелёные галочки, документы — синие файлы. Можно группировать с подзаголовком */
export function IconList({ title, groups, kind = 'check' }: {
  title?: ReactNode; kind?: 'check' | 'doc'; groups: readonly { caption?: ReactNode; items: readonly ReactNode[] }[];
}) {
  const icon: IconName = kind === 'check' ? 'check' : 'file';
  return (
    <div className="flex flex-col gap-2.5">
      {title && <h3 className="m-0 text-[16px] leading-6 font-semibold text-text-primary">{title}</h3>}
      {groups.map((g, gi) => (
        <div key={gi}>
          {g.caption && <h5 className="m-0 mb-1.5 text-[12px] leading-4 font-semibold tracking-[0.04em] text-text-secondary uppercase">{g.caption}</h5>}
          <ul className="m-0 mb-3 flex list-none flex-col gap-2 p-0 text-body-m leading-5">
            {g.items.map((it, i) => (
              <li key={i} className="flex items-start gap-2">
                <Icon name={icon} size={14} className={cn('mt-[3px] shrink-0', kind === 'check' ? 'text-success' : 'text-action-primary')} />
                <span>{it}</span>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

/* ───────────── Подписание ───────────── */

/** Шапка участника подписания (.p-head): аватар, имя H3, «Заёмщик · анкета и согласие», статус справа */
export function SignerHeader({ name, role, status }: { name: string; role: ReactNode; status?: ReactNode }) {
  return (
    <div className="flex items-center gap-3">
      <Avatar name={name} size={36} />
      <div className="min-w-0 flex-1">
        <h3 className="m-0 text-h3 text-text-primary">{name}</h3>
        <small className="block text-[13px] text-text-secondary">{role}</small>
      </div>
      {status}
    </div>
  );
}

/** Документ для ознакомления (.doc-box): голубая подложка, заголовок, «Открыть полностью», текст 13 */
export function DocBox({ title, onOpen, children }: { title: ReactNode; onOpen?: () => void; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-3 rounded-16 bg-surface-card p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h3 className="m-0 text-h3 text-text-primary">{title}</h3>
        {onOpen && <Button variant="link" onClick={onOpen}>Открыть полностью</Button>}
      </div>
      <div className="flex flex-col gap-3 text-[13px] text-text-secondary">{children}</div>
    </div>
  );
}

/**
 * Поле для подписи (прототип: SignaturePad). Холст 180 px, пунктирная рамка, рисование мышью или пальцем.
 * `clearKey` — смените значение, чтобы очистить. onChange(true) — подпись появилась.
 */
export function SignaturePad({ onChange, clearKey, error, color = '#0c2ad0' }: {
  onChange?: (hasSignature: boolean) => void; clearKey?: unknown; error?: boolean; color?: string;
}) {
  const ref = useRef<HTMLCanvasElement>(null);
  const drawing = useRef(false);
  const [has, setHas] = useState(false);
  useEffect(() => {
    const c = ref.current; if (!c) return;
    const r = c.getBoundingClientRect(); const dpr = window.devicePixelRatio || 1;
    c.width = r.width * dpr; c.height = r.height * dpr;
    const x = c.getContext('2d'); if (!x) return;
    x.scale(dpr, dpr); x.lineWidth = 2.2; x.lineCap = 'round'; x.lineJoin = 'round'; x.strokeStyle = color;
    setHas(false); onChange?.(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clearKey]);
  const pos = (e: React.PointerEvent) => { const r = ref.current!.getBoundingClientRect(); return [e.clientX - r.left, e.clientY - r.top] as const; };
  return (
    <div className={cn('relative h-45 touch-none overflow-hidden rounded-16 border border-dashed bg-surface-white', error ? 'border-error' : 'border-chart-track')}>
      <canvas
        ref={ref}
        aria-label="Поле для подписи"
        className="absolute inset-0 size-full cursor-crosshair"
        onPointerDown={(e) => { drawing.current = true; ref.current!.setPointerCapture(e.pointerId); const x = ref.current!.getContext('2d')!; x.beginPath(); x.moveTo(...pos(e)); }}
        onPointerMove={(e) => { if (!drawing.current) return; const x = ref.current!.getContext('2d')!; x.lineTo(...pos(e)); x.stroke(); if (!has) { setHas(true); onChange?.(true); } }}
        onPointerUp={() => { drawing.current = false; }}
      />
      {!has && (
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center gap-2 text-[13px] text-text-muted">
          <Icon name="pen" size={22} />Нарисуйте подпись мышью или пальцем
        </div>
      )}
    </div>
  );
}

/** Боковая карточка «Пакет к отправке»: участники со статусом подписи и банки-получатели */
export function PackageCard({ signers, banks, ready }: {
  signers: readonly { name: string; signed?: boolean }[]; banks: readonly string[]; ready?: boolean;
}) {
  return (
    <section className="flex flex-col gap-4 rounded-20 border border-border-default bg-surface-white p-6">
      <IconTile icon="shield" tone="blue" />
      <div>
        <h2 className="m-0 text-h2 text-text-primary">Пакет к отправке</h2>
        <p className="m-0 text-[13px] text-text-secondary">Каждый участник подписывает свою анкету и согласие</p>
      </div>
      {signers.map((s) => (
        <div key={s.name} className="flex items-center gap-3">
          <Icon name="file" size={20} className="shrink-0 text-text-secondary" />
          <div className="min-w-0 flex-1">
            <b className="block truncate text-body-m font-semibold">{s.name}</b>
            <span className="text-caption text-text-secondary">Анкета и согласие · {s.signed ? 'подписаны' : 'ожидают подпись'}</span>
          </div>
          <Icon name={s.signed ? 'badge-check' : 'clock'} size={18} className={s.signed ? 'text-success' : 'text-text-secondary'} />
        </div>
      ))}
      <b className="mt-2 text-body-m font-semibold">Банки-получатели</b>
      {banks.map((b) => (
        <div key={b} className="flex items-center justify-between gap-3 text-body-m">
          <span>{b}</span><Badge tone={ready ? 'success' : 'neutral'}>{ready ? 'Готово' : 'Ждёт подписи'}</Badge>
        </div>
      ))}
    </section>
  );
}

/** Рекомендация по итогам прескоринга (.ps-reco): рамка accent, радиус 12 */
export function Recommendation({ children }: { children: ReactNode }) {
  return <div className="rounded-12 border border-border-blue px-4 py-3 text-body-m text-text-primary">{children}</div>;
}

/* ───────────── Страница клиента ───────────── */

/** Упрощённая шапка для клиента (.client-head): логотип, «Заявка на ипотеку», «Помощь» */
export function ClientHeader({ title = 'Заявка на ипотеку', onHelp }: { title?: ReactNode; onHelp?: () => void }) {
  return (
    <header className="border-b border-border-default bg-surface-white">
      <Container narrow className="flex h-18 items-center gap-4">
        <span className="text-num-l tracking-[-0.02em] text-action-primary">сделка.рф</span>
        <span aria-hidden className="h-5.5 w-px bg-border-default" />
        <span className="flex-1 text-body-m text-text-secondary">{title}</span>
        {onHelp && <Button variant="link" onClick={onHelp}>Помощь</Button>}
      </Container>
    </header>
  );
}

/** Голубой баннер клиента (.c-hero): бейдж заявки, H1 26/32, текст, иллюстрация справа (скрывается до 640) */
export function ClientHero({ badge, title, children, illustration }: { badge?: ReactNode; title: ReactNode; children?: ReactNode; illustration?: ReactNode }) {
  return (
    <section className="flex items-center gap-6 rounded-20 bg-surface-card p-8 max-[640px]:flex-col max-[640px]:items-start">
      <div className="flex flex-1 flex-col gap-3">
        {badge && <div><Badge tone="accent">{badge}</Badge></div>}
        <h1 className="m-0 text-[26px] leading-8 font-semibold text-balance text-text-primary">{title}</h1>
        {children && <p className="m-0 text-body-m text-text-secondary">{children}</p>}
      </div>
      {illustration && <div className="shrink-0 max-[640px]:hidden">{illustration}</div>}
    </section>
  );
}

/** Контакт брокера для клиента: аватар, имя, «Ваш ипотечный брокер · ООО…», телефон (выделяется целиком) */
export function BrokerContact({ name, company, phone }: { name: string; company: ReactNode; phone: string }) {
  return (
    <section className="flex flex-wrap items-center gap-3 rounded-20 border border-border-default bg-surface-white p-6">
      <Avatar name={name} size={36} />
      <div className="min-w-0 flex-1">
        <b className="block text-body-m font-semibold">{name}</b>
        <span className="text-[13px] text-text-secondary">Ваш ипотечный брокер · {company}</span>
      </div>
      <b className="text-body-m font-semibold whitespace-nowrap text-action-primary tabular-nums select-all">{phone}</b>
    </section>
  );
}

/** Иллюстрация героя клиента (svg.ill из прототипа): листы документов + круг со стрелкой; sent — зелёный круг с галочкой */
export function DocsIllustration({ sent = false }: { sent?: boolean }) {
  return (
    <svg width="200" height="160" viewBox="0 0 220 176" fill="none" aria-hidden="true">
      <circle cx="112" cy="90" r="78" fill="#fff" fillOpacity=".7" />
      <rect x="44" y="40" width="96" height="120" rx="12" transform="rotate(-8 44 40)" fill="#fff" stroke="#c3d3f7" strokeWidth="2" />
      <rect x="72" y="30" width="96" height="120" rx="12" fill="#fff" stroke="#c3d3f7" strokeWidth="2" />
      <rect x="88" y="50" width="40" height="8" rx="4" fill="#0c2ad0" />
      <rect x="88" y="68" width="64" height="6" rx="3" fill="#d6e4f5" />
      <rect x="88" y="82" width="56" height="6" rx="3" fill="#d6e4f5" />
      <rect x="88" y="96" width="62" height="6" rx="3" fill="#d6e4f5" />
      <circle cx="168" cy="132" r="26" fill={sent ? '#26795d' : '#0c2ad0'} />
      {sent
        ? <path d="M157 132l8 8 15-16" stroke="#fff" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
        : <path d="M168 144v-22M159 130l9-9 9 9" stroke="#fff" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />}
    </svg>
  );
}
