import { render, screen, fireEvent } from '@testing-library/react';
import { BankRow, PickedBanks } from './Banks';
import { CreditParams } from './Params';

const o = { bank: 'МКБ', program: 'Стандартная ипотека', rate: 18.95, payment: 95619, income: 159365 };

it('BankRow: выбор и «Отправлено»', () => {
  const t = vi.fn();
  const { rerender } = render(<BankRow {...o} onToggle={t} />);
  fireEvent.click(screen.getByLabelText('Выбрать МКБ'));
  expect(t).toHaveBeenCalledWith(true);
  expect(screen.getByText('18,95%')).toBeTruthy();
  t.mockClear();
  rerender(<BankRow {...o} sent={{ at: 'сегодня, 10:50' }} onToggle={t} />);
  fireEvent.click(screen.getByLabelText(/уже отправлена/));
  expect(t).not.toHaveBeenCalled();
  expect(screen.getByText(/Отправлено · сегодня/)).toBeTruthy();
});

it('BankRow: Unfit без чекбокса и с причиной', () => {
  render(<BankRow {...o} unfitReason="Укажите срок до 15 лет" onDetails={() => {}} />);
  expect(screen.queryByRole('checkbox')).toBeNull();
  expect(screen.getByText('Подробнее').closest('[aria-hidden]')).toBeTruthy();
  expect(screen.getByText('Укажите срок до 15 лет')).toBeTruthy();
});

it('PickedBanks: убрать можно только не отправленные', () => {
  const rm = vi.fn();
  render(<PickedBanks program="Стандартная" amount={6e6} onRemove={rm} banks={[{ bank: 'ВТБ', meta: 'x', locked: true }, { bank: 'МКБ', meta: 'y' }]} />);
  expect(screen.queryByLabelText('Убрать ВТБ')).toBeNull();
  fireEvent.click(screen.getByLabelText('Убрать МКБ'));
  expect(rm).toHaveBeenCalledWith('МКБ');
});

it('CreditParams раскрывается', () => {
  render(<CreditParams banks={['МКБ']} program="Стандартная" amount={6e6} params={[{ label: 'Срок', value: '25 лет' }]} />);
  expect(screen.queryByText('25 лет')).toBeNull();
  fireEvent.click(screen.getByRole('button', { name: /Параметры кредита/ }));
  expect(screen.getByText('25 лет')).toBeTruthy();
});
