import { useId, type InputHTMLAttributes } from 'react';
import { cn } from '../utils/cn';
import { Icon } from '../icons/Icon';

export interface SearchFieldProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'value' | 'size'> {
  value: string;
  onChange: (value: string) => void;
  /** Подпись для скринридера (видимой подписи нет — как в прототипе) */
  label?: string;
}

/**
 * Поиск по списку — из прототипа флоу Б (список заявок): высота 52, радиус 14, лупа слева,
 * крестик очистки появляется, когда есть текст.
 */
export function SearchField({ value, onChange, label = 'Поиск', placeholder = 'Заёмщик, созаёмщик или номер заявки', className, id, ...rest }: SearchFieldProps) {
  const auto = useId();
  const fid = id ?? auto;
  return (
    <div className={cn('flex h-13 items-center gap-2.5 rounded-14 border border-border-default bg-surface-white px-3.5 text-text-secondary transition-colors duration-150',
      'hover:border-border-blue focus-within:border-action-primary focus-within:shadow-[inset_0_0_0_1px_var(--color-action-primary)] focus-within:hover:border-action-primary', className)}>
      <Icon name="search" size={18} className="shrink-0" />
      <label htmlFor={fid} className="sr-only">{label}</label>
      <input id={fid} type="search" value={value} placeholder={placeholder} onChange={(e) => onChange(e.target.value)}
        className="min-w-0 flex-1 bg-transparent text-[15px] text-text-primary outline-none placeholder:text-text-muted [&::-webkit-search-cancel-button]:hidden" {...rest} />
      {value && (
        <button type="button" onClick={() => onChange('')} aria-label="Очистить поиск"
          className="-mr-1 grid size-7 shrink-0 place-items-center rounded-6 hover:bg-surface-page hover:text-text-primary">
          <Icon name="x" size={16} />
        </button>
      )}
    </div>
  );
}
