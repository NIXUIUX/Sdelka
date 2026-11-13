import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { BottomBar, StepsNav } from '../components/Layout';
import { Card, SectionTitle, FormGrid, Inset, IconTile, NumberedStep, ProgressBar } from '../components/Surface';
import { Button } from '../components/Button';
import { Badge } from '../components/Badge';
import { Alert } from '../components/Alert';
import { Checkbox } from '../components/Checkbox';
import { SegmentedTabs } from '../components/Tabs';
import { UploadZone, FileItem } from '../components/Upload';
import { SummaryList, SummaryRow } from '../patterns/Params';
import { SignerHeader, DocBox, SignaturePad, PackageCard } from '../patterns/Extra';
import { BrokerPage, STEPS, doneBefore } from './kit';

const meta: Meta = { title: 'Экраны/Сценарии/1.4 Подписание и отправка', parameters: { layout: 'fullscreen' } };
export default meta;
type S = StoryObj;

type Method = 'phone' | 'paper' | 'screen';
type SignState = 'none' | 'linkSent' | 'signed';
interface Signer { name: string; role: string; method: Method; state: SignState }

/** Блок подписания одного участника: способ (телефон / бумага / экран) и его состояние */
function SignerBlock({ s, errors }: { s: Signer; errors?: boolean }) {
  const [m, setM] = useState<Method>(s.method);
  const [agree, setAgree] = useState(false);
  const [key, setKey] = useState(0);
  const badge = s.state === 'signed' ? <Badge tone="success">Подписано</Badge> : s.state === 'linkSent' ? <Badge tone="accent">Ссылка отправлена</Badge> : <Badge tone="warning">Не подписано</Badge>;
  return (
    <Inset tone="outline" className="gap-5">
      <SignerHeader name={s.name} role={`${s.role} · анкета и согласие`} status={badge} />
      {s.state === 'signed' ? (
        <div className="flex flex-wrap items-center gap-5">
          <IconTile icon="circle-check" tone="success" size={72} />
          <div className="flex min-w-0 flex-1 flex-col gap-1"><h3 className="m-0 text-h3">Документы подписаны</h3><p className="m-0 text-[13px] text-text-secondary">Анкета и согласие готовы к отправке. Нажмите «Отправить в банки»</p></div>
          <Button variant="outline" icon="pen">Подписать заново</Button>
        </div>
      ) : (
        <>
          <SegmentedTabs aria-label="Способ подписания" value={m} onChange={setM} items={[{ value: 'phone', label: 'На телефоне' }, { value: 'paper', label: 'Бумажная версия' }, { value: 'screen', label: 'На экране' }]} />
          {m === 'phone' && (s.state === 'linkSent' ? (
            <div className="flex flex-wrap items-center gap-5">
              <IconTile icon="clock" tone="blue" size={72} />
              <div className="flex min-w-0 flex-1 flex-col gap-1"><h3 className="m-0 text-h3">Ждём, пока клиент подпишет по ссылке</h3><p className="m-0 text-[13px] text-text-secondary">Ссылка отправлена на +7 (900) 123-45-67 · сегодня, 15:20</p></div>
              <Button variant="outline" icon="send">Отправить ещё раз</Button>
            </div>
          ) : (
            <div className="flex flex-wrap items-center gap-5">
              <IconTile icon="phone" tone="blue" size={72} />
              <div className="flex flex-col gap-3"><h3 className="m-0 text-h3">Отправьте ссылку участнику</h3><p className="m-0 text-[13px] text-text-secondary">+7 (900) 123-45-67 · отдельная ссылка на анкету и согласие</p><div><Button variant="outline" icon="send">Отправить ссылку по СМС</Button></div></div>
            </div>
          ))}
          {m === 'paper' && (
            <div className="flex flex-col gap-4">
              <NumberedStep n={1} title="Скачайте и распечатайте документы" description="Анкета и согласие для этого участника" action={<Button variant="outline" icon="download">Скачать</Button>} />
              <NumberedStep n={2} title="Получите подпись на анкете и согласии" description="Участник подписывает каждую страницу" />
              <NumberedStep n={3} title="Загрузите сканы подписанных документов" description="Проверьте комплект перед загрузкой" />
              <UploadZone title="Подписанные документы" limits="PDF, JPEG, PNG до 10 МБ · можно один файл" multiple onFiles={() => {}}
                error={errors ? 'Загрузите сканы подписанных анкеты и согласия — без них банк не примет заявку' : undefined} />
              <ProgressBar value={0} max={2} label="Загружено документов" />
              <div className="flex flex-wrap items-center justify-between gap-3"><span className="text-caption text-text-secondary">Загружено 0 из 2</span><Button variant="outline" disabled>Подтвердить комплект</Button></div>
            </div>
          )}
          {m === 'screen' && (
            <div className="flex flex-col gap-4">
              <DocBox title="Анкета и согласие" onOpen={() => {}}><p className="m-0">Участник ознакомлен с параметрами ипотечной заявки: Стандартная ипотека, 6 000 000 ₽ на 25 лет.</p></DocBox>
              <Checkbox label="Ознакомлен с документами" checked={agree} onChange={setAgree} error={errors && !agree}
                helper={errors && !agree ? <span className="text-error">Отметьте, что клиент ознакомился с документами — это обязательное условие банка</span> : undefined} />
              <SignaturePad clearKey={key} error={errors} />
              {errors && <span className="text-caption text-error">Нужна подпись клиента в поле ниже</span>}
              <div className="flex flex-wrap gap-3"><Button variant="outline" onClick={() => setKey((k) => k + 1)}>Очистить</Button><Button variant="outline" icon="check">Подписать документы</Button></div>
            </div>
          )}
        </>
      )}
    </Inset>
  );
}

interface Props { signers: Signer[]; errors?: boolean; allSent?: boolean }

function SigningScreen({ signers, errors, allSent }: Props) {
  const ready = signers.every((s) => s.state === 'signed');
  return (
    <BrokerPage meta="Шаг 5 из 5 · Подписание и отправка"
      aside={<><PackageCard signers={signers.map((s) => ({ name: s.name, signed: s.state === 'signed' }))} banks={['Абсолют Банк', 'Уралсиб']} ready={ready} /><StepsNav steps={STEPS} current="signing" done={doneBefore('signing')} /></>}
      bar={<BottomBar left="Шаг 5 из 5 · Подписание и отправка"
        alert={errors ? <Alert type="warning" title="Документы ещё не подписаны">Выберите способ подписания для участника и завершите его — после этого пакет уйдёт в банки</Alert> : undefined}>
        <Button variant="outline">Назад</Button><Button disabled={allSent}>Отправить в банки</Button>
      </BottomBar>}>
      {allSent && (
        <Alert type="info" title="Во все выбранные банки заявка уже отправлена" action={<Button variant="link">Вернуться к подбору</Button>}>
          Отметьте новый банк на шаге подбора — и отправим заявку туда
        </Alert>
      )}
      <Card padding="l" gap={40}>
        <div className="flex flex-col gap-4">
          <SectionTitle description="Краткая сводка по шагам анкеты. Если что-то не так — вернитесь к нужному разделу">Проверьте данные заявки</SectionTitle>
          <SummaryList>
            <SummaryRow state="done" title="Персональные данные" summary="Иванов Иван Иванович · 17.04.1986 · паспорт 6915 482731" onEdit={() => {}} />
            <SummaryRow state="done" title="Семейное положение" summary="Женат · детей: нет" onEdit={() => {}} />
            <SummaryRow state="done" title="Доход и работа" summary="По найму · 180 000 ₽ / мес · ООО «Северсталь-Инфо»" onEdit={() => {}} />
          </SummaryList>
        </div>
        <div className="flex flex-col gap-4">
          <SectionTitle>Документы</SectionTitle>
          <FormGrid><FileItem name="Паспорт.pdf" meta="1,8 МБ · загружен" /><FileItem name="Выписка СФР о доходах.pdf" meta="0,9 МБ · загружен" /></FormGrid>
        </div>
        <div className="flex flex-col gap-4">
          <SectionTitle description="Каждый участник выбирает удобный способ подписания анкеты и согласия">Способ подписания</SectionTitle>
          {signers.map((s) => <SignerBlock key={s.name} s={s} errors={errors} />)}
        </div>
      </Card>
    </BrokerPage>
  );
}

const IVANOV: Signer = { name: 'Иванов Иван Иванович', role: 'Заёмщик', method: 'screen', state: 'none' };
const MARIA: Signer = { name: 'Иванова Мария Петровна', role: 'Созаёмщик', method: 'phone', state: 'none' };

export const НаЭкране: S = { name: 'На экране', render: () => <SigningScreen signers={[IVANOV]} /> };
export const Бумажная: S = { name: 'Бумажная версия', render: () => <SigningScreen signers={[{ ...IVANOV, method: 'paper' }]} /> };
export const СсылкаОтправлена: S = { name: 'Ссылка отправлена', render: () => <SigningScreen signers={[{ ...IVANOV, method: 'phone', state: 'linkSent' }]} /> };
export const Подписаны: S = { name: 'Документы подписаны', render: () => <SigningScreen signers={[{ ...IVANOV, state: 'signed' }]} /> };
export const БезПодписи: S = { name: 'Отправка без подписи', render: () => <SigningScreen errors signers={[IVANOV]} /> };
export const ДваУчастника: S = { name: 'Два участника', render: () => <SigningScreen signers={[{ ...IVANOV, state: 'signed' }, MARIA]} /> };
export const ВсеБанки: S = { name: 'Все банки уже получили заявку', render: () => <SigningScreen allSent signers={[{ ...IVANOV, state: 'signed' }]} /> };
