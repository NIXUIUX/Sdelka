import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { tokens, textStyles } from '../tokens';
import { Icon, iconPaths, type IconName } from '../icons/Icon';

const meta: Meta = { title: 'Основа', parameters: { layout: 'fullscreen' } };
export default meta;

type Leaf = { value: string | number; css: string };
const flatten = (obj: Record<string, unknown>, prefix = ''): [string, Leaf][] =>
  Object.entries(obj).flatMap(([k, v]) =>
    v && typeof v === 'object' && 'value' in (v as object) ? [[prefix + k, v as Leaf]] : flatten(v as Record<string, unknown>, prefix + k + '/'),
  );

const Section = ({ title, hint, children }: { title: string; hint?: string; children: React.ReactNode }) => (
  <section className="flex flex-col gap-4 rounded-20 border border-border-default bg-surface-white p-8">
    <div className="flex flex-col gap-1">
      <h2 className="text-h2">{title}</h2>
      {hint && <p className="text-body-s text-text-secondary">{hint}</p>}
    </div>
    {children}
  </section>
);

const Copy = ({ text }: { text: string }) => {
  const [ok, setOk] = useState(false);
  return (
    <button
      className="rounded-6 px-1 text-left font-mono text-[11px] text-text-secondary hover:bg-surface-card hover:text-action-primary"
      onClick={() => navigator.clipboard?.writeText(text).then(() => { setOk(true); setTimeout(() => setOk(false), 1200); })}
      title="Скопировать"
    >
      {ok ? 'Скопировано' : text}
    </button>
  );
};

export const Токены: StoryObj = {
  render: () => {
    const all = flatten(tokens as unknown as Record<string, unknown>);
    const groups = [
      ['Действия', 'color/action/'], ['Поверхности', 'color/surface/'], ['Границы', 'color/border/'], ['Текст', 'color/text/'],
      ['Статусы', 'color/status/'], ['Графики', 'color/chart/'], ['Рейтинг прескоринга', 'color/rating/'],
    ] as const;
    return (
      <div className="flex flex-col gap-6 p-8">
        <div>
          <h1 className="text-h1">Токены</h1>
          <p className="text-body-m text-text-secondary">Выгружены из Figma «Мягко · Токены». Клик по имени копирует CSS-переменную</p>
        </div>
        {groups.map(([title, pre]) => (
          <Section key={pre} title={title}>
            <div className="grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-3">
              {all.filter(([n]) => n.startsWith(pre)).map(([n, t]) => (
                <div key={n} className="flex items-center gap-3 rounded-14 border border-border-default p-3">
                  <span className="size-10 shrink-0 rounded-10 border border-border-default" style={{ background: t.css }} />
                  <div className="flex min-w-0 flex-col">
                    <span className="text-caption-medium truncate">{n.replace('color/', '')}</span>
                    <span className="text-caption text-text-secondary">{String(t.value)}</span>
                    <Copy text={t.css} />
                  </div>
                </div>
              ))}
            </div>
          </Section>
        ))}
        <Section title="Радиусы" hint="В Tailwind: rounded-6 … rounded-999">
          <div className="flex flex-wrap gap-4">
            {all.filter(([n]) => n.startsWith('radius/')).map(([n, t]) => (
              <div key={n} className="flex flex-col items-center gap-2">
                <span className="size-16 border-2 border-action-primary bg-surface-card" style={{ borderRadius: t.css }} />
                <span className="text-caption">{n}</span>
              </div>
            ))}
          </div>
        </Section>
        <Section title="Отступы" hint="В Tailwind шаг 4px: p-2 = 8px, gap-6 = 24px, p-2.5 = 10px">
          <div className="flex flex-col gap-2">
            {all.filter(([n]) => n.startsWith('space/')).map(([n, t]) => (
              <div key={n} className="flex items-center gap-3">
                <span className="text-caption w-20">{n}</span>
                <span className="h-3 rounded-6 bg-chart-track" style={{ width: t.css }} />
                <Copy text={t.css} />
              </div>
            ))}
          </div>
        </Section>
        <Section title="Тени">
          <div className="flex flex-wrap gap-8 p-4">
            <div className="rounded-16 bg-surface-white p-6 shadow-pop">Shadow/Pop · попапы, тосты</div>
            <div className="rounded-t-20 bg-surface-card p-6 shadow-footer">Shadow/Footer stuck · футер у края</div>
          </div>
        </Section>
      </div>
    );
  },
};

export const Типографика: StoryObj = {
  render: () => (
    <div className="flex flex-col gap-6 p-8">
      <div>
        <h1 className="text-h1">Типографика · Geist</h1>
        <p className="text-body-m text-text-secondary">14 текстовых стилей из Figma. Класс: text-h1, text-body-m …</p>
      </div>
      <Section title="Стили">
        <div className="flex flex-col divide-y divide-border-default">
          {Object.entries(textStyles).map(([k, t]) => (
            <div key={k} className="grid grid-cols-[180px_1fr] items-baseline gap-6 py-3">
              <div className="flex flex-col">
                <span className="text-caption-medium">{t.name}</span>
                <span className="text-caption text-text-secondary">{t.size}/{t.lineHeight} · {t.weight}</span>
                <Copy text={t.className} />
              </div>
              <span className={t.className}>{k.startsWith('num') ? '6 000 000 ₽' : 'Заявка на ипотеку № 1009'}</span>
            </div>
          ))}
        </div>
      </Section>
    </div>
  ),
};

export const Иконки: StoryObj = {
  render: () => (
    <div className="flex flex-col gap-6 p-8">
      <div>
        <h1 className="text-h1">Иконки</h1>
        <p className="text-body-m text-text-secondary">{Object.keys(iconPaths).length} иконок, 24×24, обводка 2. Цвет — от текста. Клик копирует код</p>
      </div>
      <Section title="Набор">
        <div className="grid grid-cols-[repeat(auto-fill,minmax(120px,1fr))] gap-3">
          {(Object.keys(iconPaths) as IconName[]).map((n) => (
            <button key={n} className="flex flex-col items-center gap-2 rounded-14 border border-border-default p-4 text-action-primary hover:bg-surface-card"
              onClick={() => navigator.clipboard?.writeText(`<Icon name="${n}" />`)}>
              <Icon name={n} size={24} />
              <span className="text-caption text-text-secondary">{n}</span>
            </button>
          ))}
        </div>
      </Section>
    </div>
  ),
};
