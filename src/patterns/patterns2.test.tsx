import { render, screen, fireEvent } from '@testing-library/react';
import { scoreLevel, ScorePill, Participant, ScoreCard } from './Prescoring';

it('scoreLevel: границы 633 / 861 / 979', () => {
  expect([1, 632, 633, 860, 861, 978, 979, 999].map(scoreLevel)).toEqual(['low', 'low', 'mid', 'mid', 'high', 'high', 'top', 'top']);
});

it('ScorePill показывает уровень и +N', () => {
  render(<ScorePill score={902} more={1} />);
  expect(screen.getByText('Высокий')).toBeTruthy();
  expect(screen.getByText('+1')).toBeTruthy();
});

it('Participant: без балла — ссылка на прескоринг, замечания склоняются', () => {
  const go = vi.fn();
  const { rerender } = render(<Participant name="Иванов" role="Заёмщик" status="Заполняется" onPrescoring={go} />);
  fireEvent.click(screen.getByText('Пройти прескоринг'));
  expect(go).toHaveBeenCalled();
  rerender(<Participant name="Иванов" role="Заёмщик" status="Заполняется" score={744} warnings={2} />);
  expect(screen.getByText(/2 замечания/)).toBeTruthy();
  expect(screen.getByText('Средний')).toBeTruthy();
});

it('ScoreCard: шкала с текущим значением', () => {
  render(<ScoreCard score={902} name="Иванов" />);
  expect(screen.getByRole('meter').getAttribute('aria-valuenow')).toBe('902');
  expect(screen.getByText('Высокий рейтинг')).toBeTruthy();
});
