import { render, screen, fireEvent } from '@testing-library/react';
import { StepsNav, BottomBar } from './Layout';

it('StepsNav: пройденный шаг кликабелен, закрытый — нет', () => {
  const fn = vi.fn();
  render(<StepsNav steps={[{ key: 'a', label: 'Подбор' }, { key: 'b', label: 'Данные' }, { key: 'c', label: 'Доходы' }]} current="b" done={['a']} onStep={fn} />);
  fireEvent.click(screen.getByRole('button', { name: /Подбор/ }));
  expect(fn).toHaveBeenCalledWith('a');
  expect(screen.getByText('Данные').closest('[aria-current]')?.getAttribute('aria-current')).toBe('step');
  expect(screen.queryByRole('button', { name: /Доходы/ })).toBeNull();
});

it('BottomBar: состояние stuck', () => {
  const { container, rerender } = render(<BottomBar stuck left="Шаг 1"><button>Далее</button></BottomBar>);
  expect(container.querySelector('[data-stuck]')).toBeTruthy();
  rerender(<BottomBar stuck={false} left="Шаг 1"><button>Далее</button></BottomBar>);
  expect(container.querySelector('[data-stuck]')).toBeNull();
});
