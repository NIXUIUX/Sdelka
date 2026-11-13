import { render, screen, fireEvent } from '@testing-library/react';
import { useState } from 'react';
import { Checkbox } from './Checkbox';
import { Switch } from './Switch';
import { RadioGroup } from './Radio';
import { StepperField, MiniStepper } from './Stepper';

it('Checkbox переключается, Locked — нет', () => {
  const fn = vi.fn();
  render(<><Checkbox label="Согласие" checked={false} onChange={fn} /><Checkbox label="ВТБ" locked onChange={fn} /></>);
  fireEvent.click(screen.getByLabelText('Согласие'));
  expect(fn).toHaveBeenCalledWith(true);
  fn.mockClear();
  fireEvent.click(screen.getByLabelText('ВТБ'));
  expect(fn).not.toHaveBeenCalled();
});

it('Switch отдаёт новое значение', () => {
  const fn = vi.fn();
  render(<Switch label="Уведомления" checked={false} onChange={fn} />);
  const sw = screen.getByRole('switch');
  expect(sw.getAttribute('aria-checked')).toBe('false');
  fireEvent.click(sw);
  expect(fn).toHaveBeenCalledWith(true);
});

it('RadioGroup выбирает вариант', () => {
  const fn = vi.fn();
  render(<RadioGroup label="Дети" value={null} onChange={fn} options={[{ value: 'yes', label: 'Да' }, { value: 'no', label: 'Нет' }]} />);
  fireEvent.click(screen.getByLabelText('Нет'));
  expect(fn).toHaveBeenCalledWith('no');
});

it('StepperField: кнопки и границы', () => {
  const W = () => { const [v, setV] = useState<number | null>(null); return <StepperField label="Стаж" value={v} onChange={setV} max={2} />; };
  render(<W />);
  const minus = screen.getByLabelText('Уменьшить') as HTMLButtonElement;
  const plus = screen.getByLabelText('Увеличить') as HTMLButtonElement;
  expect(minus.disabled).toBe(true);
  fireEvent.click(plus); fireEvent.click(plus);
  expect((screen.getByLabelText('Стаж') as HTMLInputElement).value).toBe('2');
  expect(plus.disabled).toBe(true);
});

it('MiniStepper не уходит ниже min', () => {
  const fn = vi.fn();
  render(<MiniStepper label="срок" value={1} onChange={fn} min={1} />);
  expect((screen.getByLabelText('Уменьшить: срок') as HTMLButtonElement).disabled).toBe(true);
  fireEvent.click(screen.getByLabelText('Увеличить: срок'));
  expect(fn).toHaveBeenCalledWith(2);
});
