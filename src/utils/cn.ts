import { clsx, type ClassValue } from 'clsx';
import { extendTailwindMerge } from 'tailwind-merge';

/** Наши текстовые стили (text-h1, text-body-m …) — это размер шрифта, а не цвет: учим tailwind-merge */
const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      'font-size': [{ text: ['h1', 'h2', 'h3', 'overline', 'body-l', 'body-m', 'body-m-medium', 'body-s', 'caption', 'caption-medium', 'button-m', 'button-s', 'num-l', 'num-xl', 'h4', 'body-s-relaxed', 'caption-xs', 'num-m'] }],
    },
  },
});

/** Склеивает классы и убирает конфликты Tailwind: cn('px-4', cond && 'px-6') */
export const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs));
