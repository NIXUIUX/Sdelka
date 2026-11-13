import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from './Button';
import { Badge } from './Badge';
import { initials } from './Avatar';

describe('Button', () => {
  it('по умолчанию type=button и вызывает onClick', () => {
    const fn = vi.fn();
    render(<Button onClick={fn}>Продолжить</Button>);
    const b = screen.getByRole('button', { name: 'Продолжить' });
    expect(b).toHaveProperty('type', 'button');
    fireEvent.click(b);
    expect(fn).toHaveBeenCalledOnce();
  });
  it('loading блокирует кнопку и ставит aria-busy', () => {
    const fn = vi.fn();
    render(<Button loading onClick={fn}>Готовим PDF</Button>);
    const b = screen.getByRole('button', { name: /Готовим PDF/ });
    expect(b).toHaveProperty('disabled', true);
    expect(b.getAttribute('aria-busy')).toBe('true');
  });
});

describe('Badge и Avatar', () => {
  it('у счётчика нет точки, у статуса есть', () => {
    const { container } = render(<><Badge tone="counter">3</Badge><Badge tone="success">Одобрено</Badge></>);
    const spans = container.querySelectorAll('span[aria-hidden]');
    expect(spans.length).toBe(1);
  });
  it('initials', () => {
    expect(initials('Абсолют Банк')).toBe('АБ');
    expect(initials('«Сделка.РФ»')).toBe('СР');
    expect(initials('МКБ')).toBe('МК');
  });
});
