import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Alert } from './Alert';
import { Toast, ToastProvider, useToast } from './Toast';
import { Modal } from './Modal';
import { UploadZone, FileItem, fileSize } from './Upload';
import { Button } from './Button';
import { Input } from './Input';

const Card = ({ title, hint, children }: { title: string; hint?: string; children: React.ReactNode }) => (
  <section className="flex flex-col gap-2 rounded-20 border border-border-default bg-surface-white p-8">
    <h2 className="text-h2">{title}</h2>
    {hint && <p className="text-body-s text-text-secondary">{hint}</p>}
    <div className="mt-4 flex flex-col gap-4">{children}</div>
  </section>
);

const meta: Meta = { title: 'Компоненты/Сообщения, окна, файлы' };
export default meta;
type S = StoryObj;

export const Алерты: S = {
  name: 'Alert',
  render: () => (
    <Card title="Alert" hint="Четыре типа. Крестик — по onClose. warning и error объявляются скринридеру сразу.">
      <div className="grid max-w-[1040px] grid-cols-[repeat(auto-fill,minmax(420px,1fr))] items-start gap-4">
        <Alert type="info" title="Доступна новая версия" onClose={() => {}}>Обновите страницу, чтобы увидеть изменения.</Alert>
        <Alert type="success" title="Заявка отправлена в 3 банка" onClose={() => {}}>Решение придёт в течение 1–2 рабочих дней.</Alert>
        <Alert type="warning" title="2 поля требуют внимания">Дата выдачи паспорта, СНИЛС</Alert>
        <Alert type="error" title="Не удалось загрузить файл" action={<Button size="s" variant="outline">Повторить</Button>}>Файл больше 10 МБ — сожмите его или загрузите другой.</Alert>
      </div>
    </Card>
  ),
};

function ToastDemo() {
  const toast = useToast();
  return (
    <div className="flex flex-wrap gap-3">
      <Button variant="outline" onClick={() => toast('Рейтинг сохранён в заявке')}>Показать тост</Button>
      <Button variant="outline" onClick={() => toast('Ссылка скопирована', { duration: 1500 })}>Короткий тост</Button>
    </div>
  );
}
export const Тосты: S = {
  name: 'Toast',
  render: () => (
    <ToastProvider top={24}>
      <Card title="Toast" hint="Сообщение о результате действия. Появляется сверху по центру и пропадает через 2,8 с. В приложении — под шапкой (84 px).">
        <Toast className="self-start">Рейтинг сохранён в заявке</Toast>
        <ToastDemo />
      </Card>
    </ToastProvider>
  ),
};

export const Окно: S = {
  name: 'Modal',
  render: () => {
    const [m, setM] = useState(false);
    const [l, setL] = useState(false);
    const [email, setEmail] = useState('');
    return (
      <Card title="Modal" hint="M — 520, L — 800. Шапка и кнопки прилипают, содержимое прокручивается. Esc, клик по фону и крестик закрывают.">
        <div className="flex flex-wrap gap-3">
          <Button variant="outline" onClick={() => setM(true)}>Открыть M</Button>
          <Button variant="outline" onClick={() => setL(true)}>Открыть L с длинным содержимым</Button>
        </div>
        <Modal open={m} onClose={() => setM(false)} title="Отправить отчёт клиенту" subtitle="Отчёт прескоринга уйдёт PDF-файлом на почту"
          actions={<><Button variant="outline" onClick={() => setM(false)}>Отмена</Button><Button icon="send" onClick={() => setM(false)}>Отправить</Button></>}>
          <Input label="Электронная почта клиента" mask="email" value={email} onChange={setEmail} data-autofocus />
        </Modal>
        <Modal open={l} size="l" onClose={() => setL(false)} title="Прескоринг участников" subtitle="Предварительная оценка по данным бюро кредитных историй"
          actions={<><Button variant="outline" onClick={() => setL(false)}>Закрыть</Button><Button icon="download">Скачать PDF</Button></>}>
          <div className="flex flex-col gap-3">
            {Array.from({ length: 14 }, (_, i) => (
              <div key={i} className="rounded-12 bg-surface-page p-4 text-body-m">Блок отчёта {i + 1} — содержимое прокручивается внутри окна</div>
            ))}
          </div>
        </Modal>
      </Card>
    );
  },
};

export const Файлы: S = {
  name: 'Upload zone и File item',
  render: () => {
    const [files, setFiles] = useState<{ name: string; size: number }[]>([{ name: 'Паспорт_разворот_с_фото_Иванов.jpg', size: 1258291 }]);
    const [err, setErr] = useState<string | undefined>();
    return (
      <Card title="Загрузка документов" hint="Перетащите файл или нажмите. Больше 10 МБ или не тот формат — ошибка в зоне.">
        <div className="flex max-w-[420px] flex-col gap-3">
          <UploadZone title="Паспорт РФ · разворот с фото" multiple error={err}
            onFiles={(fs) => { setErr(undefined); setFiles((o) => [...o, ...fs.map((f) => ({ name: f.name, size: f.size }))]); }}
            onReject={(_, why) => setErr(why === 'size' ? 'Файл больше 10 МБ — сожмите его' : 'Подходят только PDF, JPG или PNG')} />
          {files.map((f, i) => (
            <FileItem key={i} name={f.name} meta={`${fileSize(f.size)} · загружен`} onRemove={() => setFiles((o) => o.filter((_, j) => j !== i))} />
          ))}
          <FileItem name="Паспорт.jpg" meta="1,2 МБ · из прескоринга" onRemove={() => {}} />
          <FileItem name="Паспорт.jpg" meta="Иванов Иван Иванович" />
          <FileItem name="Справка_2-НДФЛ.pdf" meta="Загружается…" loading />
        </div>
        <div className="max-w-[420px]"><UploadZone title="Паспорт РФ · разворот с фото" error="Загрузите разворот паспорта с фото" onFiles={() => {}} /></div>
      </Card>
    );
  },
};
