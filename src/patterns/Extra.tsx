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

export type DocsIllustrationState = 'upload' | 'sent' | 'waiting';
const DOCS_BADGE: Record<DocsIllustrationState, { fill: string; mark: ReactNode }> = {
  upload: { fill: '#0c2ad0', mark: <path d="M168 144v-22M159 130l9-9 9 9" stroke="#fff" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" /> },
  sent: { fill: '#26795d', mark: <path d="M157 132l8 8 15-16" stroke="#fff" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" /> },
  waiting: {
    fill: '#8a93a8',
    mark: <><circle cx="168" cy="132" r="12" stroke="#fff" strokeWidth="3.5" /><path d="M168 125v7l5 3" stroke="#fff" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" /></>,
  },
};

/**
 * Иллюстрация героя клиента (svg.ill из прототипа; Figma: «Иллюстрация / Документы»): стопка листов и значок состояния.
 * upload — синяя стрелка (загрузите, передам позже), sent — зелёная галочка (документы у брокера), waiting — серые часы (ссылка устарела).
 */
export function DocsIllustration({ sent = false, state, width = 200 }: { /** @deprecated используйте state="sent" */ sent?: boolean; state?: DocsIllustrationState; width?: number }) {
  const b = DOCS_BADGE[state ?? (sent ? 'sent' : 'upload')];
  return (
    <svg width={width} height={(width * 176) / 220} viewBox="0 0 220 176" fill="none" aria-hidden="true">
      <circle cx="112" cy="90" r="78" fill="#fff" fillOpacity=".7" />
      <rect x="44" y="40" width="96" height="120" rx="12" transform="rotate(-8 44 40)" fill="#fff" stroke="#c3d3f7" strokeWidth="2" />
      <rect x="72" y="30" width="96" height="120" rx="12" fill="#fff" stroke="#c3d3f7" strokeWidth="2" />
      <rect x="88" y="50" width="40" height="8" rx="4" fill="#0c2ad0" />
      <rect x="88" y="68" width="64" height="6" rx="3" fill="#d6e4f5" />
      <rect x="88" y="82" width="56" height="6" rx="3" fill="#d6e4f5" />
      <rect x="88" y="96" width="62" height="6" rx="3" fill="#d6e4f5" />
      <circle cx="168" cy="132" r="26" fill={b.fill} />
      {b.mark}
    </svg>
  );
}

/** Иллюстрация письма с предложением (HOUSE_ART из прототипа; Figma: «Иллюстрация / Дом»): дом, ключ и монета ₽ */
export function HouseIllustration({ width = 168, className }: { width?: number; className?: string }) {
  return (
    <svg width={width} height={(width * 150) / 200} viewBox="0 0 200 150" fill="none" aria-hidden="true" className={cn('shrink-0', className)}>
      <ellipse cx="100" cy="136" rx="84" ry="9" fill="#c3d3f7" opacity=".55" />
      <circle cx="150" cy="38" r="26" fill="#fff" />
      <path d="M46 70 100 28l54 42" stroke="#0c2ad0" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M58 66v66h84V66L100 36Z" fill="#fff" stroke="#0c2ad0" strokeWidth="3" strokeLinejoin="round" />
      <rect x="88" y="94" width="24" height="38" rx="4" fill="#0c2ad0" />
      <circle cx="106" cy="114" r="2" fill="#fff" />
      <rect x="68" y="78" width="16" height="16" rx="3" fill="#c3d3f7" /><rect x="116" y="78" width="16" height="16" rx="3" fill="#c3d3f7" />
      <rect x="124" y="34" width="10" height="22" rx="2" fill="#0c2ad0" />
      <g transform="rotate(-28 160 104)">
        <circle cx="160" cy="104" r="11" stroke="#4e68de" strokeWidth="5" />
        <path d="M171 104h22M187 104v8M181 104v6" stroke="#4e68de" strokeWidth="5" strokeLinecap="round" />
      </g>
      <circle cx="36" cy="112" r="16" fill="#0c2ad0" />
      <path d="M33 121V103h6a5 5 0 0 1 0 10h-9M30 117h9" stroke="#fff" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M30 40v10M25 45h10M178 74v8M174 78h8" stroke="#4e68de" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  );
}

/* ───────────── Письмо клиенту с предложением ───────────── */

/** Превью письма в окне «Предложение для клиента» (.mail-prev): «Так письмо увидит клиент», Кому, Тема и холст с письмом */
export function MailPreview({ to, subject, caption = 'Так письмо увидит клиент', children, className }: {
  to: ReactNode; subject: ReactNode; caption?: ReactNode; children: ReactNode; className?: string;
}) {
  return (
    <section className={cn('overflow-hidden rounded-20 border border-border-default', className)}>
      <div className="flex flex-col gap-1.5 bg-surface-white px-5 py-4">
        <span className="mb-0.5 text-caption tracking-[.04em] text-text-muted uppercase">{caption}</span>
        {[['Кому', to], ['Тема', subject]].map(([k, v], i) => (
          <div key={i} className="flex min-w-0 gap-3 text-[13px]">
            <span className="w-11 shrink-0 text-text-secondary">{k}</span>
            <b className="truncate font-medium">{v}</b>
          </div>
        ))}
      </div>
      <div className="bg-surface-page px-4 py-6">{children}</div>
    </section>
  );
}

export interface OfferLetterProps {
  /** Имя клиента для обращения: «Иван» → «Иван, мы подобрали…». Пусто — «Мы подобрали…» */
  firstName?: string;
  /** «Заявка № BD2A6E33 · 14.11.2026» */
  requestLabel: ReactNode;
  /** «Стандартная ипотека · г. Москва» */
  program: ReactNode;
  /** Стоимость, Взнос, Кредит, Срок */
  params: readonly { label: ReactNode; value: ReactNode }[];
  banks: readonly { bank: string; rate: string; payment: string; income: string }[];
  docs?: readonly { title: ReactNode; description: ReactNode }[];
  manager: { name: string; company: ReactNode; phone: string; email: string; hours: ReactNode };
  ctaLabel?: ReactNode;
  onCta?: () => void;
  className?: string;
}

const DEFAULT_DOCS = [
  { title: 'Паспорт РФ', description: 'Разворот с фото и страница с регистрацией' },
  { title: 'СНИЛС', description: 'Лицевая сторона' },
];

/** Письмо клиенту с предварительным расчётом (.letter из прототипа): шапка, герой с домом, параметры, банки, документы, кнопка, менеджер, сноска */
export function OfferLetter({
  firstName, requestLabel, program, params, banks, docs = DEFAULT_DOCS, manager, ctaLabel = 'Загрузить документы', onCta, className,
}: OfferLetterProps) {
  return (
    <article className={cn('mx-auto flex max-w-[560px] flex-col gap-5 rounded-20 border border-border-default bg-surface-white p-7 max-[640px]:p-5', className)}>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <span className="text-[18px] font-bold text-action-primary">сделка.рф</span>
        <small className="text-caption text-text-secondary">{requestLabel}</small>
      </div>
      <div className="flex items-center gap-4 rounded-16 bg-surface-card p-6 max-[640px]:flex-col-reverse max-[640px]:items-start">
        <div className="flex min-w-0 flex-1 flex-col gap-2">
          <h3 className="m-0 text-[22px] leading-7 font-semibold text-balance">{firstName ? `${firstName}, мы` : 'Мы'} подобрали для вас ипотеку</h3>
          <p className="m-0 text-body-m text-text-secondary">
            {program}. Предварительный расчёт по {banks.length} {plural(banks.length, 'банку', 'банкам', 'банкам')}. Чтобы брокер заполнил анкету и отправил её в банки, загрузите документы
          </p>
        </div>
        <HouseIllustration width={168} className="max-[640px]:w-[140px]" />
      </div>
      <div className="grid grid-cols-4 gap-3 max-[640px]:grid-cols-2">
        {params.map((p, i) => (
          <div key={i}><span className="block text-caption text-text-secondary">{p.label}</span><b className="text-h4 whitespace-nowrap">{p.value}</b></div>
        ))}
      </div>
      <div className="flex flex-col gap-2">
        {banks.map((b) => (
          <div key={b.bank} className="flex items-center gap-3 rounded-16 border border-border-default px-4 py-3.5">
            <Avatar name={b.bank} size={36} />
            <div className="flex min-w-0 flex-1 flex-col"><b className="text-h4">{b.bank}</b><small className="text-caption text-text-secondary">Доход от {b.income}</small></div>
            <div className="flex flex-col text-right"><b className="text-num-m text-action-primary">{b.rate}*</b><small className="text-caption text-text-secondary">{b.payment} / мес*</small></div>
          </div>
        ))}
      </div>
      <div className="flex flex-col gap-3">
        <h4 className="m-0 text-body-l font-semibold">Необходимые документы для заполнения ипотечной анкеты</h4>
        <ul className="m-0 flex list-none flex-col gap-2 p-0">
          {docs.map((d, i) => (
            <li key={i} className="flex items-center gap-3 rounded-16 bg-surface-card px-4 py-3">
              <span className="inline-flex size-8 shrink-0 items-center justify-center rounded-10 bg-surface-white text-action-primary"><Icon name="file" size={16} /></span>
              <div><b className="block text-body-m font-semibold">{d.title}</b><small className="block text-caption text-text-secondary">{d.description}</small></div>
            </li>
          ))}
        </ul>
        <p className="m-0 text-body-m text-text-secondary">Анкету заполнять не нужно — это сделает ваш брокер по загруженным документам</p>
      </div>
      <div className="flex flex-col items-center gap-2 py-1">
        <Button className="min-w-[220px]" onClick={onCta}>{ctaLabel}</Button>
        <small className="text-center text-caption text-text-muted">Откроется страница на сайте сделка.рф · ссылка действует 14 дней</small>
      </div>
      <div className="flex flex-col gap-3.5 rounded-16 border border-border-default p-5">
        <div className="flex items-center gap-3">
          <Avatar name={manager.name} size={36} />
          <div>
            <small className="block text-caption text-text-secondary">Ваш персональный менеджер</small>
            <b className="block text-h4">{manager.name}</b>
            <small className="block text-caption text-text-secondary">Ипотечный брокер · {manager.company}</small>
          </div>
        </div>
        <div className="grid grid-cols-[repeat(auto-fit,minmax(180px,1fr))] gap-x-4 gap-y-2">
          {([['phone', manager.phone], ['mail', manager.email], ['clock', manager.hours]] as const).map(([ic, v]) => (
            <div key={ic} className="flex min-w-0 items-center gap-2 text-[13px]"><Icon name={ic} size={16} className="shrink-0 text-action-primary" /><span className="truncate">{v}</span></div>
          ))}
        </div>
        <p className="m-0 text-[13px] text-text-secondary">Ответим на вопросы по условиям банков и поможем с документами</p>
      </div>
      <p className="m-0 text-caption-xs text-text-muted">* Предварительный расчёт, не является публичной офертой. Окончательные условия определяет банк после рассмотрения анкеты</p>
    </article>
  );
}
