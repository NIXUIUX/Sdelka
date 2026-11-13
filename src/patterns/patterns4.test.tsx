import { render, screen, fireEvent } from '@testing-library/react';
import { OfferLetter, MailPreview, DocsIllustration } from './Extra';
import { ApprovedParams } from './Params';

const manager = { name: 'Дмитрий Сорокин', company: 'ООО «Сделка.РФ»', phone: '+7 900 000-00-00', email: 'd@x.ru', hours: 'Пн–Пт' };
const params = [{ label: 'Стоимость', value: '10 000 000 ₽' }];

it('OfferLetter: обращение по имени, склонение «банку/банкам», кнопка', () => {
  const cta = vi.fn();
  const { rerender } = render(
    <OfferLetter firstName="Иван" requestLabel="№ 1" program="Стандартная ипотека" params={params} manager={manager} onCta={cta}
      banks={[{ bank: 'МКБ', rate: '18,95%', payment: '95 619 ₽', income: '159 365 ₽' }]} />,
  );
  expect(screen.getByRole('heading', { name: 'Иван, мы подобрали для вас ипотеку' })).toBeTruthy();
  expect(screen.getByText(/по 1 банку\./)).toBeTruthy();
  fireEvent.click(screen.getByRole('button', { name: 'Загрузить документы' }));
  expect(cta).toHaveBeenCalled();
  rerender(
    <OfferLetter requestLabel="№ 1" program="Стандартная ипотека" params={params} manager={manager}
      banks={[{ bank: 'МКБ', rate: '1', payment: '1', income: '1' }, { bank: 'ВТБ', rate: '1', payment: '1', income: '1' }]} />,
  );
  expect(screen.getByRole('heading', { name: 'Мы подобрали для вас ипотеку' })).toBeTruthy();
  expect(screen.getByText(/по 2 банкам\./)).toBeTruthy();
});

it('MailPreview показывает адресата и тему', () => {
  render(<MailPreview to="a@b.ru" subject="Ипотечное предложение">тело</MailPreview>);
  expect(screen.getByText('a@b.ru')).toBeTruthy();
  expect(screen.getByText('Ипотечное предложение')).toBeTruthy();
});

it('DocsIllustration: цвет значка по состоянию, sent обратно совместим', () => {
  const fill = (el: HTMLElement) => el.querySelector('circle[r="26"]')!.getAttribute('fill');
  expect(fill(render(<DocsIllustration />).container)).toBe('#0c2ad0');
  expect(fill(render(<DocsIllustration sent />).container)).toBe('#26795d');
  expect(fill(render(<DocsIllustration state="waiting" />).container)).toBe('#8a93a8');
});

it('ApprovedParams: defaultEditing открывает поля сразу', () => {
  render(<ApprovedParams defaultEditing values={{ sum: 5_820_000, rate: 17.9, term: 25 }} onSave={() => {}} items={[{ label: 'Срок', value: '25 лет' }]} />);
  expect(screen.getByRole('button', { name: 'Сохранить' })).toBeTruthy();
});
