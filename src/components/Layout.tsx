import { useEffect, useState, type HTMLAttributes, type ReactNode } from 'react';
import { cn } from '../utils/cn';
import { Icon, type IconName } from '../icons/Icon';
import { Avatar } from './Avatar';

/* ───────────────────────── Container ───────────────────────── */

/** Колонка контента: до 1232 (1200 + поля), поля по бокам 16 px и не меньше safe-area на телефоне */
export function Container({ narrow, className, ...rest }: HTMLAttributes<HTMLDivElement> & { narrow?: boolean }) {
  return (
    <div
      className={cn('mx-auto w-full pr-[max(16px,env(safe-area-inset-right,0px))] pl-[max(16px,env(safe-area-inset-left,0px))]', narrow ? 'max-w-[824px]' : 'max-w-[1232px]', className)}
      {...rest}
    />
  );
}

/** Круглая кнопка-иконка 40 для шапки */
function IconButton({ icon, label, onClick }: { icon: IconName; label: string; onClick?: () => void }) {
  return (
    <button type="button" aria-label={label} onClick={onClick}
      className="grid size-10 shrink-0 place-items-center rounded-full text-text-secondary transition-colors duration-150 hover:bg-surface-page hover:text-text-primary">
      <Icon name={icon} size={22} />
    </button>
  );
}

/* ───────────────────────── AppHeader ───────────────────────── */

export interface AppHeaderProps {
  /** Раздел рядом с логотипом: «Ипотека» */
  section?: ReactNode;
  /** Организация брокера: «ООО «Сделка.РФ»». По клику — смена организации */
  org?: string;
  onOrgClick?: () => void;
  /** Пользователь: «Дмитрий Сорокин» — из него инициалы аватара */
  user: string;
  onMenu?: () => void;
  /** Ссылка логотипа (по умолчанию «/») */
  logoHref?: string;
  onLogoClick?: (e: React.MouseEvent) => void;
  /** Доп. кнопки слева от аватара (справка, уведомления) */
  actions?: ReactNode;
  onAvatarClick?: () => void;
}

/**
 * Шапка приложения — Figma: Мягко / App header. Высота 72, белая, линия снизу.
 * На ширине до 640 скрываются раздел и организация — остаются меню, логотип, действия и аватар.
 */
export function AppHeader({ section = 'Ипотека', org, onOrgClick, user, onMenu, logoHref = '/', onLogoClick, actions, onAvatarClick }: AppHeaderProps) {
  return (
    <header className="border-b border-border-default bg-surface-white">
      <Container className="flex h-18 items-center gap-4">
        <IconButton icon="menu" label="Меню" onClick={onMenu} />
        <a href={logoHref} onClick={onLogoClick} className="text-num-l tracking-[-0.02em] text-action-primary no-underline hover:text-action-hover">
          сделка.рф
        </a>
        {section && (
          <>
            <span aria-hidden className="h-5.5 w-px bg-border-default max-sm:hidden" />
            <span className="text-body-m text-text-primary max-sm:hidden">{section}</span>
          </>
        )}
        <div className="ml-auto flex items-center gap-4">
          {org && (
            <div className="flex flex-col items-end max-sm:hidden">
              <button type="button" onClick={onOrgClick} className="inline-flex items-center gap-1 text-button-s text-action-primary hover:text-action-hover">
                {org}{onOrgClick && <span aria-hidden> ▾</span>}
              </button>
              <span className="text-caption text-text-secondary">{user}</span>
            </div>
          )}
          {actions}
          <button type="button" onClick={onAvatarClick} aria-label={`Профиль: ${user}`} className="rounded-full">
            <Avatar name={user} size={36} />
          </button>
        </div>
      </Container>
    </header>
  );
}
AppHeader.IconButton = IconButton;

/* ───────────────────────── FlowHead ───────────────────────── */

export interface FlowHeadProps {
  /** Ссылка назад: «Ипотечные заявки» */
  backLabel?: ReactNode;
  backHref?: string;
  onBack?: (e: React.MouseEvent) => void;
  /** «Заявка № 1009» */
  title: ReactNode;
  /** «Шаг 1 из 5 · Подбор условий» */
  meta?: ReactNode;
  /** Справа: кнопка «Прескоринг» или плашка кредитного рейтинга */
  action?: ReactNode;
  /** Под заголовком — например горизонтальные шаги */
  children?: ReactNode;
  className?: string;
}

/** Шапка флоу заявки — Figma: Мягко / Flow head. Ссылка назад, заголовок H1 + шаг, действие справа */
export function FlowHead({ backLabel = 'Ипотечные заявки', backHref = '/', onBack, title, meta, action, children, className }: FlowHeadProps) {
  return (
    <div className={cn('flex flex-col gap-3', className)}>
      {backLabel && (
        <a href={backHref} onClick={onBack} className="inline-flex items-center gap-1 self-start text-button-m text-action-primary no-underline hover:text-action-hover">
          <Icon name="chevron-left" size={16} />
          {backLabel}
        </a>
      )}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex min-w-0 flex-wrap items-baseline gap-x-3 gap-y-1">
          <h1 className="m-0 text-h1 text-text-primary">{title}</h1>
          {meta && <span className="text-body-m text-text-secondary">{meta}</span>}
        </div>
        {action}
      </div>
      {children}
    </div>
  );
}

/* ───────────────────────── Steps ───────────────────────── */

export type StepState = 'done' | 'current' | 'locked';

export interface StepItemProps {
  n: number;
  label: ReactNode;
  state: StepState;
  /** Только для done: переход к пройденному шагу */
  onClick?: () => void;
}

/**
 * Пункт шагов анкеты — Figma: Мягко / Step item. Высота 48, радиус 12.
 * По прототипу флоу Б: Done — синий кружок с галочкой и шеврон, кликабелен. Current — голубой фон, полужирный.
 * Locked — серый кружок и текст, недоступен.
 */
export function StepItem({ n, label, state, onClick }: StepItemProps) {
  const base = 'flex w-full items-center gap-3 rounded-14 px-3 py-2.5 text-left';
  const num = 'grid size-7 shrink-0 place-items-center rounded-full text-caption-medium';
  if (state === 'done') {
    return (
      <button type="button" onClick={onClick} className={cn(base, 'transition-colors duration-150 hover:bg-surface-page')}>
        <span className={cn(num, 'bg-action-primary text-surface-white')}><Icon name="check" size={14} strokeWidth={3} /></span>
        <span className="min-w-0 flex-1 truncate text-body-m text-text-primary">{label}</span>
        <Icon name="chevron-right" size={18} className="shrink-0 text-text-secondary" />
      </button>
    );
  }
  const cur = state === 'current';
  return (
    <div aria-current={cur ? 'step' : undefined} aria-disabled={cur ? undefined : true} className={cn(base, cur && 'bg-surface-card')}>
      <span className={cn(num, cur ? 'border border-chart-track bg-surface-white text-action-primary' : 'bg-surface-page text-text-disabled')}>{n}</span>
      <span className={cn('min-w-0 flex-1 truncate', cur ? 'text-button-m text-action-primary' : 'text-body-m text-text-disabled')}>{label}</span>
    </div>
  );
}

export interface StepsNavProps {
  title?: ReactNode;
  steps: readonly { key: string; label: ReactNode }[];
  current: string;
  /** Какие шаги пройдены — к ним можно вернуться */
  done: readonly string[];
  onStep?: (key: string) => void;
  className?: string;
}

/** Боковая карточка шагов — Figma: Мягко / Steps nav. Белая, радиус 20, отступ 24 */
export function StepsNav({ title = 'Шаги анкеты', steps, current, done, onStep, className }: StepsNavProps) {
  return (
    <nav aria-label={typeof title === 'string' ? title : 'Шаги'} className={cn('flex flex-col gap-4 rounded-20 border border-border-default bg-surface-white p-6', className)}>
      <h2 className="m-0 text-h2 text-text-primary">{title}</h2>
      <ol className="m-0 flex list-none flex-col gap-1 p-0">
        {steps.map((s, i) => {
          const state: StepState = s.key === current ? 'current' : done.includes(s.key) ? 'done' : 'locked';
          return <li key={s.key}><StepItem n={i + 1} label={s.label} state={state} onClick={() => onStep?.(s.key)} /></li>;
        })}
      </ol>
    </nav>
  );
}

/* ───────────────────────── BottomBar ───────────────────────── */

/**
 * true, пока под футером есть контент (страницу можно прокрутить ниже).
 * Правило прототипа: без прокрутки футер стоит в 24 px от низа, иначе прибит к краю.
 */
export function useStuck(threshold = 12) {
  const [stuck, setStuck] = useState(false);
  useEffect(() => {
    const upd = () => {
      const el = document.scrollingElement || document.documentElement;
      setStuck(el.scrollHeight - el.clientHeight - el.scrollTop > threshold);
    };
    upd();
    addEventListener('scroll', upd, { passive: true });
    addEventListener('resize', upd);
    const ro = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(upd) : null;
    ro?.observe(document.body);
    return () => { removeEventListener('scroll', upd); removeEventListener('resize', upd); ro?.disconnect(); };
  }, [threshold]);
  return stuck;
}

export interface BottomBarProps {
  /** Слева: «Шаг 1 из 5 · Подбор условий» или «Выбрано 3 банка» */
  left?: ReactNode;
  /** Кнопки справа: outline, затем одна primary */
  children: ReactNode;
  /** Над панелью: Alert «2 поля требуют внимания» */
  alert?: ReactNode;
  /** Узкая колонка 824 (анкета без боковой панели) */
  narrow?: boolean;
  /** Принудительно задать состояние (для Storybook/тестов). По умолчанию — по прокрутке */
  stuck?: boolean;
}

/**
 * Нижняя панель действий — Figma: Мягко / Bottom bar (Default · Stuck).
 * Default — карточка со скруглением 20 в 24 px от низа. Stuck — пока под ней есть контент:
 * прибита к краю экрана, без нижних скруглений и нижней рамки, с тенью Shadow/Footer.
 */
export function BottomBar({ left, children, alert, narrow, stuck: forced }: BottomBarProps) {
  const auto = useStuck();
  const stuck = forced ?? auto;
  return (
    <div className="sticky bottom-0 z-20 mt-auto mb-[calc(24px+env(safe-area-inset-bottom,0px))]">
      <Container narrow={narrow}>
        {alert && <div className="mb-3">{alert}</div>}
        <div
          data-stuck={stuck || undefined}
          className={cn(
            'flex flex-wrap items-center justify-between gap-x-4 gap-y-3 border border-border-default bg-surface-card p-6 transition-[border-radius,box-shadow,padding] duration-200',
            stuck ? 'rounded-t-20 rounded-b-none border-b-transparent pb-[calc(24px+env(safe-area-inset-bottom,0px))] shadow-footer' : 'rounded-20',
          )}
        >
          <div className="flex min-w-0 items-center gap-2 text-body-m text-text-secondary">{left}</div>
          <div className="flex flex-wrap gap-3 max-sm:w-full max-sm:[&>*]:flex-1">{children}</div>
        </div>
      </Container>
    </div>
  );
}

/* ───────────────────────── HelpCard ───────────────────────── */

export interface HelpCardProps {
  /** Строка под карточкой: «Ответы на частые вопросы собрали здесь» */
  footer?: ReactNode;
  title?: ReactNode;
  children?: ReactNode;
  icon?: IconName;
  /** Кнопка внизу: <Button variant="outline" size="s">Открыть чат</Button> */
  action?: ReactNode;
  className?: string;
}

/** Карточка помощи в боковой колонке — Figma: Мягко / Help card. Голубая, рамка accent, радиус 20 */
export function HelpCard({ title = 'Помощь по ипотеке', children = 'Задайте вопрос и получите больше информации на консультации с нашим специалистом', icon = 'folder', action, footer, className }: HelpCardProps) {
  return (
    <div className={cn('flex flex-col gap-4', className)}>
      <section className="flex flex-col items-start gap-4 rounded-20 border border-border-default bg-surface-card p-6">
        <span className="grid size-10 place-items-center rounded-12 bg-surface-white text-action-primary"><Icon name={icon} size={20} /></span>
        <h2 className="m-0 text-h2 text-text-primary">{title}</h2>
        <p className="m-0 text-body-s text-text-secondary">{children}</p>
        {action}
      </section>
      {footer && <p className="m-0 px-6 text-body-s text-text-secondary">{footer}</p>}
    </div>
  );
}

/* ───────────── Горизонтальные шаги и автосохранение (прототип) ───────────── */

export interface HStepsProps {
  steps: readonly { key: string; label: ReactNode }[];
  current: string;
  done: readonly string[];
  onStep?: (key: string) => void;
  className?: string;
}

/** Шаги-пилюли под заголовком заявки (прототип: .hsteps). Пройденные кликабельны */
export function HSteps({ steps, current, done, onStep, className }: HStepsProps) {
  const pill = 'inline-flex h-9 items-center gap-2 rounded-999 border pr-3.5 pl-1.5 text-[13px] transition-colors duration-150';
  const n = 'grid size-6 place-items-center rounded-full text-[12px] font-semibold';
  return (
    <ol className={cn('m-0 mt-1 flex list-none flex-wrap gap-2 p-0', className)}>
      {steps.map((s, i) => {
        const cur = s.key === current;
        const d = !cur && done.includes(s.key);
        return (
          <li key={s.key}>
            {d ? (
              <button type="button" onClick={() => onStep?.(s.key)}
                className={cn(pill, 'border-border-default bg-surface-white text-text-primary hover:border-border-blue hover:bg-surface-page')}>
                <span className={cn(n, 'bg-action-primary text-surface-white')}><Icon name="check" size={12} strokeWidth={3} /></span>{s.label}
              </button>
            ) : (
              <span aria-current={cur ? 'step' : undefined}
                className={cn(pill, cur ? 'border-border-blue bg-surface-card font-semibold text-action-primary' : 'border-border-default bg-surface-white text-text-disabled')}>
                <span className={cn(n, cur ? 'bg-action-primary text-surface-white' : 'bg-surface-page')}>{i + 1}</span>{s.label}
              </span>
            )}
          </li>
        );
      })}
    </ol>
  );
}

/** «Изменения сохраняются автоматически» — слева в футере анкеты (прототип: .autosave) */
export function Autosave({ children = 'Изменения сохраняются автоматически' }: { children?: ReactNode }) {
  return (
    <span className="inline-flex items-center gap-2 text-[13px] text-text-secondary">
      <Icon name="check-check" size={16} className="text-success" />{children}
    </span>
  );
}
