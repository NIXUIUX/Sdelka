import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { BottomBar } from '../components/Layout';
import { Card, Inset } from '../components/Surface';
import { Button } from '../components/Button';
import { Badge } from '../components/Badge';
import { Alert } from '../components/Alert';
import { Avatar } from '../components/Avatar';
import { Icon } from '../icons/Icon';
import { Textarea } from '../components/Textarea';
import { Toast } from '../components/Toast';
import { UploadZone, FileItem } from '../components/Upload';
import { IconList } from '../patterns/Extra';
import { ApprovedParams, type ApprovedValues } from '../patterns/Params';
import { StatusBankCard, ConditionsBox, InfoHero, MailItem, BankReply, MailCompose, BANK_STATUS, type BankStatus } from '../patterns/Status';
import { annuity, pct, rub, years } from '../utils/format';
import { BrokerPage } from './kit';

const meta: Meta = { title: 'Экраны/Сценарии/1.5 Статус в банках', parameters: { layout: 'fullscreen' } };
export default meta;
type S = StoryObj;

const PARAMS = [
  { label: 'Ставка', value: '18,95%' }, { label: 'Платёж в месяц', value: '95 619 ₽' }, { label: 'Сумма кредита', value: '6 000 000 ₽' },
  { label: 'Срок', value: '25 лет' }, { label: 'Первый взнос', value: '4 000 000 ₽' }, { label: 'Программа', value: 'Стандартная ипотека' },
];
const FILES = ['Анкета и согласие.pdf', 'Паспорт.pdf', 'СНИЛС.pdf', 'Выписка СФР о доходах.pdf'];
const BANKS: Record<string, { no: string; meta: string; mail: string }> = {
  'Абсолют Банк': { no: '036968-58791', meta: 'Отправлено сегодня, 10:50', mail: 'mortgage@absolutbank.ru' },
  Уралсиб: { no: '036968-58792', meta: 'Отправлено сегодня, 10:50', mail: 'ipoteka@uralsib.ru' },
};

type View = 'waiting' | 'approved' | 'editApproved' | 'reply' | 'compose' | 'declined' | 'docs';
const STATUS_OF: Record<View, BankStatus> = { waiting: 'sent', approved: 'approved', editApproved: 'approved', reply: 'approved', compose: 'sent', declined: 'declined', docs: 'docs' };

function Approved({ edit }: { edit?: boolean }) {
  const [v, setV] = useState<ApprovedValues>({ sum: 5_820_000, rate: 17.9, term: 25 });
  return (
    <ApprovedParams values={v} onSave={setV} defaultEditing={edit} note="Направляли: 6 000 000 ₽ · 18,95% · 30 лет" items={[
      { label: 'Сумма кредита', value: rub(v.sum) }, { label: 'Ставка', value: pct(v.rate), highlight: true }, { label: 'Срок', value: years(v.term) },
      { label: 'Платёж в месяц', value: rub(annuity(v.sum, v.rate, v.term)) }, { label: 'Первый взнос', value: '1 380 000 ₽' }, { label: 'Решение действует до', value: '11.02.2027' },
    ]} />
  );
}

/** Экран «1.5 Статус в банках»: слева выбранный банк и переписка, справа карточки банков */
function StatusScreen({ view = 'waiting', bank = 'Абсолют Банк' }: { view?: View; bank?: string }) {
  const [compose, setCompose] = useState(view === 'compose');
  const [draft, setDraft] = useState('Добрый день! Уточните, пожалуйста, нужна ли справка по форме банка или подойдёт 2-НДФЛ?');
  const [sent, setSent] = useState(false);
  const [comment, setComment] = useState('Направляем справку и копию трудовой книжки по заявке');
  const status = STATUS_OF[view];
  const st = BANK_STATUS[status];
  const b = BANKS[bank]!;
  const when = { waiting: 'отправлена сегодня, 10:50', compose: 'отправлена сегодня, 10:50', approved: 'решение получено сегодня, 12:40', editApproved: 'решение получено сегодня, 12:40', reply: 'решение получено сегодня, 12:40', declined: 'решение получено сегодня, 14:05', docs: 'запрос получен сегодня, 11:30' }[view];
  const other = bank === 'Абсолют Банк' ? 'Уралсиб' : 'Абсолют Банк';
  return (
    <BrokerPage title="Заявка № 1009" meta="Статус в банках" score={902}
      aside={<>
        <div className="flex items-center justify-between gap-3">
          <span className="text-caption text-text-secondary">Статусы обновлены<br />сегодня в 16:52</span>
          <Button variant="outline" size="s" icon="refresh">Обновить статусы</Button>
        </div>
        {[bank, other].map((x) => (
          <StatusBankCard key={x} bank={x} status={x === bank ? status : 'sent'} meta={BANKS[x]!.meta} params={PARAMS} selected={x === bank} onSelect={() => {}} />
        ))}
        <Button variant="outline" icon="plus" fullWidth>Отправить в другой банк</Button>
      </>}
      bar={view === 'docs'
        ? <BottomBar left="Загружено 1 из 2"><Button>Отправить в банк</Button></BottomBar>
        : <BottomBar left="Заявка отправлена в 2 банка"><Button variant="outline">К списку заявок</Button></BottomBar>}>
      {sent && <div className="pointer-events-none fixed inset-x-0 top-[84px] z-50 flex justify-center"><Toast>Письмо отправлено в {bank}</Toast></div>}
      <Card padding="l" gap={24}>
        <div className="flex items-center gap-3">
          <Avatar name={bank} size={36} />
          <div className="min-w-0 flex-1"><h2 className="m-0 text-h2">{bank}</h2><small className="text-body-s text-text-secondary">Заявка № {b.no} · {when}</small></div>
          <Badge tone={st.tone}>{view === 'docs' ? 'Доработка' : st.label}</Badge>
        </div>

        {(view === 'waiting' || view === 'compose') && (
          <>
            <ConditionsBox note="* Направлено по анкете. Окончательные условия подтверждает банк" items={[
              { label: 'Ставка', value: '18,95%*', accent: true }, { label: 'Платёж в месяц', value: '95 619 ₽' }, { label: 'Сумма кредита', value: '6 000 000 ₽' }, { label: 'Срок', value: '25 лет' },
            ]} />
            <InfoHero title="Ожидаем решение банка">Направленные параметры сохранены. Сумма, ставка и платёж по решению появятся после ответа банка — обычно в течение 1–3 рабочих дней</InfoHero>
          </>
        )}
        {(view === 'approved' || view === 'reply') && <Approved />}
        {view === 'editApproved' && <Approved edit />}
        {view === 'approved' && <Alert type="success" title="Заявка одобрена. Ставка 17,9%">Решение действует 90 дней — до 11.02.2027</Alert>}

        {view === 'declined' && (
          <>
            <InfoHero icon="alert-circle" title="Банк отказал в ипотеке"
              action={<div className="flex flex-wrap gap-3"><Button icon="send">Отправить в другой банк</Button><Button variant="outline" icon="rotate-ccw">Новый подбор</Button></div>}>
              Банк не раскрывает причину. Анкета и документы уже готовы — отправьте заявку в другой банк, это займёт пару минут
            </InfoHero>
            <ConditionsBox note="Отказ получен сегодня, 14:05" items={[
              { label: 'Ставка', value: '18,95%' }, { label: 'Платёж в месяц', value: '95 619 ₽' }, { label: 'Сумма кредита', value: '6 000 000 ₽' }, { label: 'Срок', value: '25 лет' },
            ]} />
          </>
        )}

        {view === 'docs' && (
          <Inset tone="outline" className="gap-4">
            <Alert type="warning" title="Банк запросил дополнительные документы">Загрузите их здесь — мы отправим ответным письмом в ту же переписку, тема не изменится</Alert>
            <IconList kind="doc" title="Что нужно загрузить" groups={[{ items: ['Справка о доходах по форме банка', 'Копия трудовой книжки'] }]} />
            <UploadZone title="Документы для банка" limits="PDF, JPEG, PNG до 10 МБ · можно несколько файлов" multiple onFiles={() => {}} />
            <FileItem name="Трудовая книжка.pdf" meta="3,2 МБ · загружен" onRemove={() => {}} />
            <Textarea label="Комментарий для банка" value={comment} onChange={setComment} helper="Необязательно" rows={3} />
          </Inset>
        )}

        <div className="flex flex-col gap-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h3 className="m-0 flex items-center gap-2 text-h3"><Icon name="message" className="text-action-primary" />Переписка с банком</h3>
            {!compose && <Button variant="link" icon="message" onClick={() => setCompose(true)}>Написать письмо</Button>}
          </div>
          {compose && (
            <MailCompose to={`${bank} · ${b.mail}`} subject={`Re: Новая заявка на ипотеку № ${b.no}`} value={draft} onChange={setDraft}
              onCancel={() => setCompose(false)} onSend={() => { setCompose(false); setSent(true); }} />
          )}
          {view === 'docs' && (
            <MailItem direction="in" title="Запрос банка" subtitle={b.mail} time="11:30" collapsible={false}>
              Для рассмотрения заявки направьте, пожалуйста, справку о доходах по форме банка и копию трудовой книжки, заверенную работодателем
            </MailItem>
          )}
          <MailItem title="Письмо с заявкой" subtitle="Исходный пакет и направленные условия" time="Сегодня, 10:50" defaultExpanded={view === 'waiting'}
            to={b.mail} subject={`Новая заявка на ипотеку № ${b.no}`}
            notice={<Alert type="warning" title="Не меняйте тему письма и отвечайте через «Ответить всем»">Так ответ банка не потеряется и мы быстрее его обработаем</Alert>}
            signature="С уважением, ООО «Сделка.РФ», Дмитрий Сорокин, +7 900 000-00-00"
            attachments={FILES.map((f) => <FileItem key={f} name={f} meta="Иванов Иван Иванович" />)}>
            Добрый день! Просим рассмотреть новую заявку на ипотеку № {b.no} и отправить результат рассмотрения ответным письмом. Документы по заявке во вложении
          </MailItem>
          {view !== 'docs' && (
            <BankReply received={status !== 'sent'} defaultExpanded={view === 'reply'}>
              {status === 'approved' ? 'Заявка одобрена. Ставка 17,9%, сумма 5 820 000 ₽, срок 25 лет. Решение действует 90 дней. С уважением, ипотечный центр'
                : status === 'declined' ? 'По результатам рассмотрения банк принял решение отказать в предоставлении кредита. С уважением, ипотечный центр' : undefined}
            </BankReply>
          )}
        </div>
      </Card>
    </BrokerPage>
  );
}

export const Ожидание: S = { name: 'Ожидаем решение банка', render: () => <StatusScreen /> };
export const Одобрено: S = { name: 'Одобрено', render: () => <StatusScreen view="approved" /> };
export const Правка: S = { name: 'Правка параметров одобрения', render: () => <StatusScreen view="editApproved" /> };
export const Ответ: S = { name: 'Получен ответ банка', render: () => <StatusScreen view="reply" /> };
export const Письмо: S = { name: 'Письмо в банк', render: () => <StatusScreen view="compose" /> };
export const Отказ: S = { name: 'Отказ банка', render: () => <StatusScreen view="declined" bank="Уралсиб" /> };
export const Документы: S = { name: 'Банк запросил документы', render: () => <StatusScreen view="docs" /> };
