import { useId, useRef, useState, type ReactNode } from 'react';
import { cn } from '../utils/cn';
import { Icon } from '../icons/Icon';
import { Spinner } from './Spinner';

export interface UploadZoneProps {
  /** Что загрузить: «Паспорт РФ · разворот с фото» */
  title: ReactNode;
  /** Ограничения серым под заголовком */
  limits?: ReactNode;
  /** Ошибка — красная пунктирная рамка, текст ошибки вместо ограничений */
  error?: ReactNode;
  onFiles: (files: File[]) => void;
  multiple?: boolean;
  accept?: string;
  /** Максимальный размер файла в МБ. Больше — onReject */
  maxSizeMb?: number;
  /** Файлы, отклонённые по размеру или формату — покажите ошибку */
  onReject?: (files: File[], reason: 'size' | 'type') => void;
  actionLabel?: string;
  disabled?: boolean;
  className?: string;
}

const matchesAccept = (f: File, accept?: string) => {
  if (!accept) return true;
  const name = f.name.toLowerCase();
  return accept.split(',').map((s) => s.trim().toLowerCase()).some((a) =>
    a.startsWith('.') ? name.endsWith(a) : a.endsWith('/*') ? f.type.startsWith(a.slice(0, -1)) : f.type === a);
};

/**
 * Зона загрузки — Figma: Мягко / Upload zone. Пунктирная рамка, радиус 16, голубой фон.
 * Клик или перетаскивание файла. States: Default, Hover (и drag-over) — синяя рамка, Error — красная.
 */
export function UploadZone({
  title, limits = 'PDF, JPG или PNG до 10 МБ', error, onFiles, multiple, accept = '.pdf,.jpg,.jpeg,.png',
  maxSizeMb = 10, onReject, actionLabel = 'Выбрать файл', disabled, className,
}: UploadZoneProps) {
  const input = useRef<HTMLInputElement>(null);
  const [drag, setDrag] = useState(false);
  const id = useId();

  const take = (list: FileList | null) => {
    if (!list || disabled) return;
    const all = [...list].slice(0, multiple ? undefined : 1);
    const badType = all.filter((f) => !matchesAccept(f, accept));
    const big = all.filter((f) => matchesAccept(f, accept) && f.size > maxSizeMb * 1048576);
    const ok = all.filter((f) => !badType.includes(f) && !big.includes(f));
    if (badType.length) onReject?.(badType, 'type');
    if (big.length) onReject?.(big, 'size');
    if (ok.length) onFiles(ok);
  };

  return (
    <div className={className}>
      <button
        type="button"
        disabled={disabled}
        aria-describedby={`${id}-hint`}
        onClick={() => input.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
        onDragLeave={() => setDrag(false)}
        onDrop={(e) => { e.preventDefault(); setDrag(false); take(e.dataTransfer.files); }}
        className={cn(
          'flex w-full items-center gap-3 rounded-16 border border-dashed bg-surface-card py-4 pr-5 pl-4 text-left transition-colors duration-150',
          'disabled:cursor-not-allowed disabled:opacity-60',
          error ? 'border-error' : drag ? 'border-action-primary' : 'border-chart-track hover:enabled:border-action-primary',
        )}
      >
        <span className="grid size-10 shrink-0 place-items-center rounded-12 bg-surface-white text-action-primary">
          <Icon name="upload" size={20} />
        </span>
        <span className="flex min-w-0 flex-1 flex-col gap-0.5">
          <span className="text-body-m font-semibold text-text-primary">{title}</span>
          <span id={`${id}-hint`} role={error ? 'alert' : undefined} className={cn('text-caption', error ? 'text-error' : 'text-text-secondary')}>
            {error && error !== true ? error : limits}
          </span>
        </span>
        <span className="shrink-0 text-button-s whitespace-nowrap text-action-primary">{actionLabel}</span>
      </button>
      <input
        ref={input}
        type="file"
        tabIndex={-1}
        className="sr-only"
        multiple={multiple}
        accept={accept}
        onChange={(e) => { take(e.target.files); e.target.value = ''; }}
      />
    </div>
  );
}

export interface FileItemProps {
  /** Имя файла — длинное обрезается многоточием; из него берётся расширение для плитки */
  name: string;
  /** Вторая строка: «1,2 МБ · загружен», «1,2 МБ · из прескоринга» или ФИО владельца (только просмотр) */
  meta?: ReactNode;
  /** Зелёная галочка «файл принят». По умолчанию есть, кроме загрузки */
  ok?: boolean;
  /** Крестик удаления. Без него — только просмотр */
  onRemove?: () => void;
  /** Загрузка — спиннер вместо галочки и крестика */
  loading?: boolean;
  className?: string;
}

/** Размер в МБ с запятой: 1258291 → «1,2 МБ» */
export const fileSize = (bytes: number) => `${(bytes / 1048576).toFixed(1).replace('.', ',')} МБ`;

/** «Паспорт.jpg» → «JPG» (до 4 символов) */
export const fileExt = (name: string) => (name.includes('.') ? name.split('.').pop()! : '').toUpperCase().slice(0, 4);

/**
 * Загруженный файл — как в прототипе флоу Б: плитка с расширением («JPG», «PDF»), имя, вторая строка,
 * зелёная галочка и крестик удаления. Рамка, радиус 14.
 */
export function FileItem({ name, meta, ok = true, onRemove, loading, className }: FileItemProps) {
  const ext = fileExt(name);
  return (
    <div className={cn('flex min-w-0 items-center gap-3 rounded-14 border border-border-default bg-surface-white px-4 py-3', className)}>
      <span aria-hidden className="grid size-9 shrink-0 place-items-center rounded-10 bg-surface-card text-[10px] leading-none font-bold text-action-primary">
        {ext || <Icon name="file" size={18} />}
      </span>
      <span className="flex min-w-0 flex-1 flex-col gap-0.5">
        <span title={name} className="truncate text-body-m-medium text-text-primary">{name}</span>
        {meta && <span className="truncate text-caption text-text-secondary">{meta}</span>}
      </span>
      {loading ? (
        <Spinner size={18} label="Загружаем файл" className="shrink-0" />
      ) : (
        <>
          {ok && <Icon name="badge-check" size={18} label="Файл загружен" className="shrink-0 text-success" />}
          {onRemove && (
            <button
              type="button"
              onClick={onRemove}
              aria-label={`Удалить ${name}`}
              className="-m-1.5 grid size-7 shrink-0 place-items-center rounded-6 text-text-secondary transition-colors duration-150 hover:bg-surface-page hover:text-text-primary"
            >
              <Icon name="x" size={16} />
            </button>
          )}
        </>
      )}
    </div>
  );
}
