import type { Preview } from '@storybook/react-vite';
import '../src/styles/fonts.css';
import '../src/styles/index.css';

const preview: Preview = {
  parameters: {
    layout: 'padded',
    backgrounds: { options: { page: { name: 'Страница', value: '#f8fafe' }, white: { name: 'Белый', value: '#ffffff' } } },
    options: { storySort: { order: ['Основа', ['Токены', 'Типографика', 'Иконки'], 'Компоненты', 'Паттерны флоу', 'Экраны'] } },
  },
  initialGlobals: { backgrounds: { value: 'page' } },
};
export default preview;
