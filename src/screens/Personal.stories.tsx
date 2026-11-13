import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { BottomBar, Autosave } from '../components/Layout';
import { Card, SectionTitle, FormGrid, Inset } from '../components/Surface';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { Switch } from '../components/Switch';
import { Alert } from '../components/Alert';
import { Spinner } from '../components/Spinner';
import { UploadZone, FileItem } from '../components/Upload';
import { ParticipantsCard } from '../patterns/Extra';
import { Participant } from '../patterns/Prescoring';
import { Aside, BrokerPage, StepBar } from './kit';

const meta: Meta = { title: 'Экраны/Сценарии/1.1 Персональные данные', parameters: { layout: 'fullscreen' } };
export default meta;
type S = StoryObj;

type Mode = 'filled' | 'errors' | 'recognizing' | 'manual' | 'extra' | 'unrecognized' | 'uploadFail' | 'offline';

/** Шаг «Персональные данные». mode — ветка из Figma «1.1 Персональные данные — ветки и состояния» */
function PersonalScreen({ mode = 'filled' }: { mode?: Mode }) {
  const [first, setFirst] = useState(false);
  const [changed, setChanged] = useState(mode === 'extra');
  const [addr, setAddr] = useState(mode === 'extra');
  const [prev, setPrev] = useState(mode === 'extra');
  const recognized = mode === 'filled' || mode === 'errors' || mode === 'extra' || mode === 'offline';
  const empty = mode === 'manual' || mode === 'recognizing' || mode === 'unrecognized' || mode === 'uploadFail';
  const help = recognized ? 'Распознано из паспорта' : undefined;
  const val = (v: string) => (empty ? undefined : v);
  const errors = mode === 'errors';

  const passport = {
    filled: <FileItem name="Паспорт.pdf" meta="1,8 МБ · загружен" onRemove={() => {}} />,
    recognizing: <FileItem name="Паспорт.pdf" meta="1,8 МБ · распознаём…" loading />,
    unrecognized: <FileItem name="IMG_2034.jpg" meta="2,4 МБ · загружен" onRemove={() => {}} />,
  };

  return (
    <BrokerPage meta="Шаг 2 из 5 · Персональные данные" aside={<Aside cur="personal" />}
      bar={mode === 'offline'
        ? <BottomBar left={<span className="flex items-center gap-2 text-caption text-warning-text"><Spinner size={14} />Сохраним, когда появится связь</span>}><Button variant="outline">Назад</Button><Button>Продолжить</Button></BottomBar>
        : <StepBar alert={errors ? <Alert type="warning" title="3 поля требуют внимания">Исправьте их — остальное уже сохранено</Alert> : undefined} left={errors ? 'Шаг 2 из 5 · Персональные данные' : <Autosave />} />}>
      {mode === 'offline' && <Alert type="warning" title="Нет связи — изменения сохранятся, когда интернет появится">Можно продолжать заполнять анкету: данные останутся на этом устройстве</Alert>}
      <ParticipantsCard onAdd={() => {}}>
        <Participant current name="Иванов Иван Иванович" role="Заёмщик" status="Заполняется" statusTone="accent" score={902} onPrescoring={() => {}} />
      </ParticipantsCard>
      <Card padding="l" gap={40}>
        <SectionTitle description="Загрузите паспорт и СНИЛС для заполнения данных или введите реквизиты вручную">Персональные данные</SectionTitle>
        {errors && <Alert type="error" title="Чтобы перейти дальше, заполните недостающие данные">Не хватает: дата рождения, номер телефона и СНИЛС. Остальное уже сохранено</Alert>}
        <FormGrid>
          <div className="flex flex-col gap-3">
            {mode === 'uploadFail'
              ? <UploadZone title="Паспорт РФ" error="Файл больше 10 МБ — сожмите его или сфотографируйте заново" onFiles={() => {}} />
              : <UploadZone title="Паспорт РФ" onFiles={() => {}} />}
            {mode === 'recognizing' ? passport.recognizing : mode === 'unrecognized' ? passport.unrecognized : mode === 'manual' || mode === 'uploadFail' ? null : passport.filled}
          </div>
          {mode === 'uploadFail'
            ? <UploadZone title="СНИЛС" error="Формат HEIC не поддерживается — нужен PDF, JPEG или PNG" onFiles={() => {}} />
            : <UploadZone title="СНИЛС" onFiles={() => {}} />}
        </FormGrid>
        {mode === 'recognizing' && <Alert title="Распознаём паспорт — заполним поля автоматически">Обычно это занимает несколько секунд. Можно пока ввести телефон</Alert>}
        {mode === 'unrecognized' && <Alert type="warning" title="Не удалось распознать паспорт">Скан нечёткий или на нём не разворот с фото. Загрузите другой файл или заполните поля вручную</Alert>}
        {mode === 'uploadFail' && <Alert type="error" title="Не удалось загрузить файл" action={<Button variant="link">Выбрать файл ещё раз</Button>}>Связь прервалась на 60%. Проверьте интернет и нажмите «Выбрать файл» ещё раз</Alert>}
        {recognized && !errors && <Alert title="Данные распознаны из паспорта">Проверьте их — если что-то не так, загрузите более чёткий скан</Alert>}
        <FormGrid>
          <Input label="Фамилия, имя, отчество" defaultValue={val('Иванов Иван Иванович')} mask="name" helper={help ?? 'Как в паспорте'} />
          <Input label="Дата рождения" mask="date" defaultValue={errors ? undefined : val('17.04.1986')} helper={help}
            error={errors ? 'Введите дату рождения в формате дд.мм.гггг' : undefined} />
          <Input label="Место рождения" defaultValue={val('г. Тверь')} helper={help ?? 'Город или населённый пункт'} />
          <Input label="Номер телефона" mask="phone" defaultValue={errors ? '+7 (900) 123' : val('+7 (900) 123-45-67')}
            error={errors ? 'Нужен полный номер, 11 цифр — банк позвонит по нему, чтобы подтвердить заявку' : undefined} />
        </FormGrid>
        <SectionTitle>Паспорт и СНИЛС</SectionTitle>
        <FormGrid cols={3}>
          <Input label="Серия и номер" mask="passport" defaultValue={val('6915 482731')} helper={help} />
          <Input label="Когда выдан" mask="date" defaultValue={val('23.07.2015')} helper={help} />
          <Input label="Код подразделения" mask="divisionCode" defaultValue={val('690-014')} helper={help} />
          <Input label="СНИЛС" mask="snils" defaultValue={errors ? '123-456' : val('123-456-789 01')}
            error={errors ? 'В СНИЛС 11 цифр. Его можно найти на лицевой стороне свидетельства или в Госуслугах' : undefined} />
          <Input label="ИНН физлица" mask="inn12" helper="12 цифр, необязательно" />
        </FormGrid>
        <div className="flex flex-col gap-4">
          <Switch label="Паспорт РФ получен впервые" helper="Ранее паспорт РФ не выдавался, например при получении гражданства РФ" checked={first} onChange={setFirst} />
          <Switch label="Менялась фамилия, имя, отчество" checked={changed} onChange={setChanged} />
          {changed && (
            <Inset tone="outline" title="Менялась фамилия">
              <FormGrid><Input label="Предыдущая фамилия" defaultValue="Петров" /><Input label="Год изменения" defaultValue="2010" inputMode="numeric" /></FormGrid>
            </Inset>
          )}
          <Switch label="Фактический адрес отличается от регистрации" checked={addr} onChange={setAddr} />
          {addr && <Input label="Фактический адрес" defaultValue="г. Москва, ул. Лесная, д. 5, кв. 12" helper="Укажите, где клиент живёт сейчас — банк проверяет оба адреса" />}
          <Switch label="Есть предыдущий паспорт" checked={prev} onChange={setPrev} />
          {prev && (
            <Inset tone="outline" title="Предыдущий паспорт">
              <FormGrid cols={3}><Input label="Серия" defaultValue="6905" inputMode="numeric" /><Input label="Номер" defaultValue="123456" inputMode="numeric" /><Input label="Когда выдан" mask="date" defaultValue="12.05.2006" /></FormGrid>
            </Inset>
          )}
        </div>
      </Card>
    </BrokerPage>
  );
}

export const Основной: S = { name: 'Данные распознаны', render: () => <PersonalScreen /> };
export const Ошибки: S = { name: 'Ошибки при переходе дальше', render: () => <PersonalScreen mode="errors" /> };
export const Распознаём: S = { name: 'Распознаём паспорт', render: () => <PersonalScreen mode="recognizing" /> };
export const Вручную: S = { name: 'Ввод вручную', render: () => <PersonalScreen mode="manual" /> };
export const Дополнительно: S = { name: 'Дополнительные поля', render: () => <PersonalScreen mode="extra" /> };
export const НеРаспознан: S = { name: 'Паспорт не распознан', render: () => <PersonalScreen mode="unrecognized" /> };
export const НеЗагрузился: S = { name: 'Файл не загрузился', render: () => <PersonalScreen mode="uploadFail" /> };
export const НетСвязи: S = { name: 'Нет связи', render: () => <PersonalScreen mode="offline" /> };

/* ───────────── Анкета созаёмщика ───────────── */

const CO_STEPS = [
  { key: 'podbor', label: 'Подбор условий' }, { key: 'main', label: 'Заёмщик · Иванов И. И.' },
  { key: 'co-personal', label: 'Созаёмщик · персональные данные' }, { key: 'co-income', label: 'Созаёмщик · доход и работа' }, { key: 'signing', label: 'Подписание и отправка' },
];

export const Созаёмщик: S = {
  name: 'Анкета созаёмщика · персональные данные',
  render: () => (
    <BrokerPage meta="Созаёмщик · шаг 2 из 4 · Персональные данные" aside={<Aside cur="co-personal" steps={CO_STEPS} done={['podbor', 'main']} />} bar={<StepBar />}>
      <ParticipantsCard onAdd={() => {}}>
        <Participant name="Иванов Иван Иванович" role="Заёмщик" status="Заполнено" statusTone="success" score={902} />
        <Participant current name="Иванова Мария Петровна" role="Созаёмщик · супруга" status="Заполняется" statusTone="accent" onPrescoring={() => {}} />
      </ParticipantsCard>
      <Card padding="l" gap={40}>
        <SectionTitle description="Иванова Мария Петровна · загрузите паспорт и СНИЛС или введите данные вручную">Персональные данные созаёмщика</SectionTitle>
        <Alert type="success" title="Анкета заёмщика заполнена">Теперь те же шаги для созаёмщика: персональные данные, доход и работа. Семейное положение возьмём из анкеты заёмщика</Alert>
        <FormGrid><UploadZone title="Паспорт РФ" onFiles={() => {}} /><UploadZone title="СНИЛС" onFiles={() => {}} /></FormGrid>
        <FormGrid>
          <Input label="Фамилия, имя, отчество" defaultValue="Иванова Мария Петровна" mask="name" helper="Как в паспорте" />
          <Input label="Номер телефона" mask="phone" defaultValue="+7 (900) 765-43-21" />
          <Input label="Дата рождения" mask="date" />
          <Input label="Место рождения" helper="Город или населённый пункт" />
        </FormGrid>
      </Card>
    </BrokerPage>
  ),
};
