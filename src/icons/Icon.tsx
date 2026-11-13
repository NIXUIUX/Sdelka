import type { SVGProps } from 'react';
import { iconPaths, type IconName } from './icons.generated';

export type { IconName };
export { iconPaths };

export interface IconProps extends Omit<SVGProps<SVGSVGElement>, 'name'> {
  /** Имя иконки как в Figma: «Icon / chevron-down» → "chevron-down" */
  name: IconName;
  /** Размер в px: 12, 14, 16, 18, 20, 24 */
  size?: number;
  /** Подпись для скринридера. Без неё иконка считается декоративной */
  label?: string;
}

/** Иконка 24×24 с обводкой 2. Цвет берётся из текста (currentColor) */
export function Icon({ name, size = 20, label, ...rest }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      role={label ? 'img' : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      focusable="false"
      {...rest}
    >
      <path d={iconPaths[name]} />
    </svg>
  );
}
