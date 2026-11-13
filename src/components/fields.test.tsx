import { render, screen, fireEvent } from '@testing-library/react';
import { useState } from 'react';
import { Input } from './Input';
import { MoneyField } from './MoneyField';
import { Select } from './Select';

describe('Input', () => {
  it('применяет маску телефона', () => {
    const fn = vi.fn();
    render(<Input label="Телефон" mask="phone" onChange={fn} />);
    fireEvent.change(screen.getByLabelText('Телефон'), { target: { value: '89991234567' } });
    expect(fn).toHaveBeenLastCalledWith('+7 (999) 123-45-67');
  });
  it('показывает ошибку и связывает её с полем', () => {
    render(<Input label="Имя" error="Укажите имя" helper="подсказка" />);
    const input = screen.getByLabelText('Имя');
    expect(input.getAttribute('aria-invalid')).toBe('true');
    expect(screen.getByRole('alert').textContent).toContain('Укажите имя');
    expect(screen.queryByText('подсказка')).toBeNull();
  });
});

describe('MoneyField', () => {
  it('отдаёт число и форматирует разряды', () => {
    const Wrap = () => { const [v, setV] = useState<number | null>(null); return <MoneyField label="Доход" value={v} onChange={setV} />; };
    render(<Wrap />);
    const input = screen.getByLabelText('Доход') as HTMLInputElement;
    fireEvent.change(input, { target: { value: '150000' } });
    expect(input.value.replace(/\s/g, ' ')).toBe('150 000');
  });
});

describe('Select', () => {
  it('выбирает пункт с клавиатуры', () => {
    const fn = vi.fn();
    render(<Select label="Банк" options={['ВТБ', 'Сбербанк']} value={null} onChange={fn} />);
    const box = screen.getByRole('combobox');
    fireEvent.keyDown(box, { key: 'ArrowDown' });
    expect(screen.getByRole('listbox')).toBeTruthy();
    fireEvent.keyDown(box, { key: 'ArrowDown' });
    fireEvent.keyDown(box, { key: 'Enter' });
    expect(fn).toHaveBeenCalledWith('Сбербанк');
    expect(screen.queryByRole('listbox')).toBeNull();
  });
});
