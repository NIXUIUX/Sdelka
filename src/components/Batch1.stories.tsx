import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button } from './Button';
import { Badge } from './Badge';
import { Avatar, AvatarGroup } from './Avatar';
import { Spinner } from './Spinner';

const Row = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div className="grid grid-cols-[140px_1fr] items-center gap-6 py-3">
    <span className="text-caption text-text-secondary">{title}</span>
    <div className="flex flex-wrap items-center gap-3">{children}</div>
  </div>
);
const Card = ({ title, hint, children }: { title: string; hint?: string; children: React.ReactNode }) => (
  <section className="flex flex-col gap-2 rounded-20 border border-border-default bg-surface-white p-8">
    <h2 className="text-h2">{title}</h2>
    {hint && <p className="text-body-s text-text-secondary">{hint}</p>}
    <div className="mt-2 divide-y divide-border-default">{children}</div>
  </section>
);

const meta: Meta<typeof Button> = {
  title: 'Компоненты/Button',
  component: Button,
  args: { children: 'Продолжить', variant: 'primary', size: 'm' },
  argTypes: {
    variant: { control: 'inline-radio', options: ['primary', 'secondary', 'outline', 'ghost', 'link', 'danger'] },
    size: { control: 'inline-radio', options: ['s', 'm', 'l'] },
    icon: { control: 'select', options: [undefined, 'plus', 'gauge', 'download', 'send', 'refresh'] },
  },
};
export default meta;
type S = StoryObj<typeof Button>;

export const Песочница: S = {};

export const ВсеСостояния: S = {
  name: 'Все состояния',
  render: () => (
    <Card title="Button" hint="Одна primary на экране — в футере. Hover и нажатие проверяйте мышью, фокус — клавишей Tab">
      {(['primary', 'secondary', 'outline', 'ghost', 'danger'] as const).map((v) => (
        <Row key={v} title={v}>
          <Button variant={v}>Продолжить</Button>
          <Button variant={v} icon="plus">Новая заявка</Button>
          <Button variant={v} loading>Готовим PDF</Button>
          <Button variant={v} disabled>Недоступно</Button>
          <Button variant={v} icon="refresh" aria-label="Обновить" />
        </Row>
      ))}
      <Row title="link">
        <Button variant="link" iconRight="chevron-down">Ещё 6 предложений</Button>
        <Button variant="link" icon="message">Написать письмо</Button>
        <Button variant="link" iconRight="chevron-right">Изменить параметры подбора</Button>
        <Button variant="link" disabled>Вернуть</Button>
      </Row>
      <Row title="subtle">
        <Button variant="subtle" icon="rotate-ccw">Сброс фильтров</Button>
      </Row>
      <Row title="Переключатель">
        <Button variant="outline" size="s" icon="sliders">Фильтры</Button>
        <Button variant="outline" size="s" icon="sliders" pressed count={3}>Фильтры</Button>
      </Row>
      <Row title="Размеры s / sm / m / l">
        <Button size="s" variant="outline">Подробнее</Button>
        <Button size="sm" variant="outline" icon="gauge">Прескоринг</Button>
        <Button size="m" variant="outline">Отправить предложение на почту</Button>
        <Button size="l">Отправить в банки</Button>
      </Row>
    </Card>
  ),
};

export const Бейджи: S = {
  render: () => (
    <Card title="Badge" hint="Статусы заявок и банков, уровни рейтинга, счётчики">
      <Row title="Тоны">
        <Badge>Черновик</Badge><Badge tone="accent">Отправлено</Badge><Badge tone="success">Одобрено</Badge>
        <Badge tone="warning">Нужны документы</Badge><Badge tone="error">Отказ</Badge>
      </Row>
      <Row title="Счётчик, отправлено"><Badge tone="counter">20</Badge><Badge tone="sent">Отправлено · сегодня, 10:50</Badge></Row>
      <Row title="XS"><Badge size="xs" tone="accent">Заполняется</Badge><Badge size="xs" tone="success" dot={false}>Высокий</Badge></Row>
      <Row title="Удаляемый"><Badge tone="accent" dot={false} onRemove={() => {}}>Москва</Badge></Row>
    </Card>
  ),
};

export const Аватары: S = {
  render: () => (
    <Card title="Avatar">
      <Row title="Варианты"><Avatar name="Абсолют Банк" /><Avatar name="Иванов Иван" /><Avatar variant="neutral" text="+5" /><Avatar variant="disabled" name="ВТБ" /></Row>
      <Row title="Группа"><AvatarGroup names={['МКБ', 'Альфа-Банк', 'Почта Банк']} /><AvatarGroup names={['МКБ', 'Альфа-Банк', 'Почта Банк', 'ВТБ', 'Уралсиб']} /></Row>
      <Row title="Spinner"><Spinner /><Spinner size={14} /></Row>
    </Card>
  ),
};
