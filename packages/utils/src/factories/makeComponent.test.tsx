import {
  Accessor,
  children,
  createMemo,
  createRoot,
  splitProps
} from 'solid-js';
import {
  ComponentFactory,
  createComponent,
  createComponentFactory
} from './createComponent';
import { AnyProps } from './types';

describe('createComponent()', () => {
  let dummyFactory: <Props extends AnyProps, Name extends string>(
    name: Name
  ) => ComponentFactory<
    [Accessor<number>],
    Props,
    Props & { [key in Name]: number }
  >;

  beforeAll(() => {
    dummyFactory = <Props extends AnyProps, Name extends string>(name: Name) =>
      createComponentFactory<Props, Props & { [K in Name]: number }>().setup(
        (allProps) => {
          const [objWithName, props] = splitProps(allProps, [name]);

          const nameAcc = createMemo(() => objWithName[name]);

          return {
            abstractedProps: props as Props,
            addedArgs: [nameAcc]
          };
        }
      );
  });

  it('should work properly for one factory', () => {
    createRoot((dispose) => {
      const factory = dummyFactory<{ name: string }, 'my fact'>('my fact');
      const Testing = createComponent([factory], (props, fact) => {
        return [props, fact()] as any;
      });
      const accessed = children(() =>
        Testing({
          name: 'hello',
          'my fact': 99
        })
      );

      expect(accessed()).toEqual([
        {
          name: 'hello'
        },
        'my fact'
      ]);

      dispose();
    });
  });

  it('should work properly for two factories', () => {
    createRoot((dispose) => {
      const firstFactory = dummyFactory<{ name: string }, 'first'>('first');
      const secondFactory = dummyFactory<
        { name: string; first: number },
        'second'
      >('second');
      const testing = createComponent(
        [firstFactory, secondFactory],
        (props, first, second) => {
          console.log(first());
          expect(first()).toBe(123);
          expect(second()).toBe(99);

          expect(props.name).toBe('my text');

          return JSON.stringify(props);
        }
      );
      const accessed = children(() =>
        testing({
          name: 'my text',
          first: 123,
          second: 99
        })
      );
      expect(JSON.parse(accessed() as string)).toEqual({
        name: 'my text'
      });
      dispose();
    });
  });
});
