/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/ban-ts-comment */

import {
  Accessor,
  children,
  createMemo,
  createRoot,
  splitProps
} from 'solid-js';
import {
  ComponentFactory,
  makeComponent,
  createComponentFactory
} from './makeComponent';
import { AnyProps } from '../types';

describe('makeComponent()', () => {
  let dummyFactory: <Props extends AnyProps, Name extends string>(
    name: Name
  ) => ComponentFactory<
    [Accessor<number>],
    Props,
    Props & { [K in Name]: number }
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
      const Testing = makeComponent([factory], (props, fact) => {
        return [props, fact()] as any;
      });
      const accessed = children(() =>
        Testing({
          name: 'hello',
          'my fact': 123
        })
      );

      expect(accessed()).toEqual([
        {
          name: 'hello'
        },
        123
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
      const Testing = makeComponent(
        [firstFactory, secondFactory],
        (props, first, second) => {
          expect(first()).toBe(123);
          expect(second()).toBe(99);

          expect(props.name).toBe('my text');

          return JSON.stringify(props);
        }
      );
      const accessed = children(() =>
        Testing({
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

  it('the factories should have coherent receiving props', () => {
    const firstFactory = dummyFactory<{ name: string }, 'first'>('first');
    const secondFactory = dummyFactory<{ name: string }, 'second'>('second');

    // @ts-expect-error - the factories should only be allowed if they have coherent types in the proper order
    makeComponent([firstFactory, secondFactory], () => <></>);
  });
});
