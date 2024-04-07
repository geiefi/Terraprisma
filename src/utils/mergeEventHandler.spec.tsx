import { fireEvent, render } from '@solidjs/testing-library';
import { mergeEventHandlers } from './mergeEventHandlers';
import { createRoot } from 'solid-js';

test('mergeEventHandler', () => {
  const firstEventHandler = vi.fn((event: MouseEvent) => {
    event.stopImmediatePropagation();
  });
  const secondEventHandler = vi.fn(() => {
    console.log('hello');
  });

  let results!: ReturnType<typeof render>;
  createRoot(() => {
    results = render(() => (
      <div
        onClick={mergeEventHandlers(firstEventHandler, secondEventHandler)}
        data-testid="testing-div"
      >
        This is a testing div
      </div>
    ));
  });

  results.getByTestId('testing-div').click();

  expect(firstEventHandler).toHaveBeenCalledTimes(1);
  expect(secondEventHandler).toHaveBeenCalledTimes(0);
});
