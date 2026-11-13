import { render, screen, fireEvent, act } from '@testing-library/react';
import { Alert } from './Alert';
import { Modal } from './Modal';
import { ToastProvider, useToast } from './Toast';
import { UploadZone } from './Upload';

it('Alert: роли и крестик', () => {
  const close = vi.fn();
  render(<><Alert type="error" title="Ошибка" onClose={close} /><Alert type="info" title="Инфо" /></>);
  expect(screen.getByRole('alert').textContent).toContain('Ошибка');
  expect(screen.getByRole('status').textContent).toContain('Инфо');
  fireEvent.click(screen.getByLabelText('Закрыть'));
  expect(close).toHaveBeenCalled();
});

it('Modal закрывается по Esc и фону', () => {
  const close = vi.fn();
  render(<Modal open onClose={close} title="Окно">текст</Modal>);
  expect(screen.getByRole('dialog').getAttribute('aria-modal')).toBe('true');
  fireEvent.keyDown(document, { key: 'Escape' });
  expect(close).toHaveBeenCalledTimes(1);
  fireEvent.mouseDown(screen.getByRole('dialog').parentElement!);
  expect(close).toHaveBeenCalledTimes(2);
});

it('Toast показывается и исчезает', () => {
  vi.useFakeTimers();
  const Btn = () => { const t = useToast(); return <button onClick={() => t('Сохранено')}>go</button>; };
  render(<ToastProvider><Btn /></ToastProvider>);
  fireEvent.click(screen.getByText('go'));
  expect(screen.getByText('Сохранено')).toBeTruthy();
  act(() => { vi.advanceTimersByTime(3000); });
  expect(screen.queryByText('Сохранено')).toBeNull();
  vi.useRealTimers();
});

it('UploadZone отклоняет большой файл', () => {
  const ok = vi.fn(), rej = vi.fn();
  const { container } = render(<UploadZone title="Паспорт" onFiles={ok} onReject={rej} maxSizeMb={1} multiple />);
  const big = new File([new Uint8Array(2 * 1048576)], 'big.pdf', { type: 'application/pdf' });
  const small = new File(['x'], 'a.jpg', { type: 'image/jpeg' });
  const exe = new File(['x'], 'a.exe');
  fireEvent.change(container.querySelector('input[type=file]')!, { target: { files: [big, small, exe] } });
  expect(ok).toHaveBeenCalledWith([small]);
  expect(rej).toHaveBeenCalledWith([big], 'size');
  expect(rej).toHaveBeenCalledWith([exe], 'type');
});
