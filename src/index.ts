// @sdelka/ui — библиотека интерфейса Сделка.рф «Мягко»
import './styles/index.css';
export { tokens, textStyles, type TextStyle } from './tokens';
export { Icon, iconPaths, type IconName, type IconProps } from './icons/Icon';
export * from './components';
export { cn } from './utils/cn';
export { masks, digits, maskPlaceholder, maskInputMode, maskLength, type MaskName } from './utils/masks';
export { validate, isEmail, isDate, collectErrors, errorSummary } from './utils/validators';
export { plural, rub, pct, years, annuity, formatSentAt } from './utils/format';
export * from './patterns';
