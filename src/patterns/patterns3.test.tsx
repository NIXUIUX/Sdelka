import { render, screen, fireEvent } from '@testing-library/react';
import { StatusBankCard, MailItem, MailCompose, DealsTable } from './Status';

it('StatusBankCard: выбор и раскрытие параметров', () => {
  const sel = vi.fn();
  render(<StatusBankCard bank="ВТБ" status="approved" onSelect={sel} params={[{ label: 'Срок', value: '25 лет' }]} />);
  expect(screen.getByText('Одобрено')).toBeTruthy();
  fireEvent.click(screen.getByRole('button', { pressed: false }));
  expect(sel).toHaveBeenCalled();
  fireEvent.click(screen.getByRole('button', { name: /Параметры кредита/ }));
  expect(screen.getByText('25 лет')).toBeTruthy();
});

it('MailItem раскрывается', () => {
  render(<MailItem title="Письмо с заявкой" subject="Тема X" defaultExpanded={false}>Текст</MailItem>);
  expect(screen.queryByText('Текст')).toBeNull();
  fireEvent.click(screen.getByRole('button', { name: /Письмо с заявкой/ }));
  expect(screen.getByText('Текст')).toBeTruthy();
});

it('MailCompose отправляет', () => {
  const send = vi.fn();
  render(<MailCompose to="Банк" subject="Re" value="Привет" onChange={() => {}} onSend={send} />);
  fireEvent.click(screen.getByRole('button', { name: 'Отправить' }));
  expect(send).toHaveBeenCalled();
});

it('DealsTable: непрочитанные, архивная группа, пустое состояние', () => {
  const arch = vi.fn(), reset = vi.fn();
  const base = { region: 'Москва', banks: ['ПСБ'], sum: 3e6, term: 25, created: '01.10', updated: '05.10', status: 'Одобрено' };
  const { rerender } = render(<DealsTable onArchiveToggle={arch} deals={[{ ...base, id: 1, name: 'Петров', unread: true }, { ...base, id: 2, name: 'Смирнова', archived: true }]} />);
  expect(screen.getByLabelText('Есть новое сообщение от банка')).toBeTruthy();
  expect(screen.getByText(/Архив · 1/)).toBeTruthy();
  expect(screen.getAllByText('на 25 лет').length).toBe(2);
  fireEvent.click(screen.getByLabelText('В архив: Петров'));
  expect(arch).toHaveBeenCalled();
  expect(screen.getByLabelText('Вернуть из архива: Смирнова')).toBeTruthy();
  rerender(<DealsTable deals={[]} onReset={reset} />);
  fireEvent.click(screen.getByText('Сбросить всё'));
  expect(reset).toHaveBeenCalled();
});

it('MailItem: вложения сеткой с заголовком', () => {
  render(<MailItem title="Письмо" attachments={[<span key="a">a.pdf</span>, <span key="b">b.pdf</span>]} />);
  expect(screen.getByText('Вложения · 2')).toBeTruthy();
});
