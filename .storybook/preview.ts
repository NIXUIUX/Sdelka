import type { Preview } from '@storybook/react-vite';
import '../src/styles/fonts.css';
import '../src/styles/index.css';

const preview: Preview = {
  parameters: {
    layout: 'padded',
    backgrounds: { options: { page: { name: 'Страница', value: '#f8fafe' }, white: { name: 'Белый', value: '#ffffff' } } },
    options: { storySort: { order: ['Основа', ['Токены', 'Типографика', 'Иконки'], 'Компоненты', 'Паттерны флоу', 'Экраны', ['Брокер', ['0.0 Ипотечные заявки', '1.0 Подбор условий', '1.0 Подбор условий · окна', '1.1 Персональные данные', '1.2 Семейное положение', '1.3 Доход и работа', '1.4 Подписание и отправка', '1.5 Статус в банках', 'Прескоринг · окно', 'С · Короткий флоу Сбербанка'], 'Клиент']] } },
  },
  initialGlobals: { backgrounds: { value: 'page' } },
};
export default preview;
