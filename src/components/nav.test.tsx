import { render, screen, fireEvent } from '@testing-library/react';
import { LineTabs } from './Tabs';
import { FilterChip, Menu } from './Popover';

it('LineTabs: клик и стрелки', () => {
  const fn = vi.fn();
  render(<LineTabs value="a" onChange={fn} items={[{ value: 'a', label: 'Заявки' }, { value: 'b', label: 'Архив' }]} />);
  fireEvent.click(screen.getByRole('tab', { name: 'Архив' }));
  expect(fn).toHaveBeenLastCalledWith('b');
  fireEvent.keyDown(screen.getByRole('tab', { name: 'Заявки' }), { key: 'ArrowLeft' });
  expect(fn).toHaveBeenLastCalledWith('b');
  expect(screen.getByRole('tab', { name: 'Заявки' }).getAttribute('aria-selected')).toBe('true');
});

it('FilterChip открывается, выбирает и закрывается по Esc', () => {
  const pick = vi.fn();
  render(<FilterChip label="Цель:" value="Квартира">{(close) => <Menu items={['Квартира', 'Дом']} value="Квартира" onPick={(v) => { pick(v); close(); }} />}</FilterChip>);
  const chip = screen.getByRole('button', { name: /Цель/ });
  fireEvent.click(chip);
  expect(chip.getAttribute('aria-expanded')).toBe('true');
  fireEvent.click(screen.getByRole('option', { name: 'Дом' }));
  expect(pick).toHaveBeenCalledWith('Дом');
  expect(screen.queryByRole('listbox')).toBeNull();
  fireEvent.click(chip);
  fireEvent.keyDown(document, { key: 'Escape' });
  expect(screen.queryByRole('listbox')).toBeNull();
});
