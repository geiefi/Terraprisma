/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/ban-ts-comment */

import { JSX, splitProps } from 'solid-js';

import type { AnyProps } from '../types';
import { componentBuilder, type ComponentFactory } from './componentBuilder';

function keyInProps<BaseProps extends AnyProps, Key extends string>(key: Key) {
  return ((propsIntoFactory: BaseProps & { [key in Key]: 'hi' }) => {
    const [_others, props] = splitProps(propsIntoFactory, [key]);
    return {
      baseProps: props as BaseProps,
      args: [_others[key]]
    };
  }) satisfies ComponentFactory<
    BaseProps,
    BaseProps & { [key in Key]: 'hi' },
    [Key]
  >;
}

type TestProps = {
  id: number;
  name: string;
};

test('compatibility with compound components', () => {
  const Component = componentBuilder<TestProps>()
    .factory(keyInProps<TestProps, 'factory_1'>('factory_1'))
    .create((props, key) => {
      return {
        props,
        key
      } as unknown as JSX.Element;
    });

  Component.Item = () => <>My compounded component works!</>;
});

test('with one factory', () => {
  const Component = componentBuilder<TestProps>()
    .factory(keyInProps<TestProps, 'factory_1'>('factory_1'))
    .create((props, key) => {
      return {
        props,
        key
      } as unknown as JSX.Element;
    });

  expect(<Component factory_1="hi" name="roberto" id={1} />).toEqual({
    props: { name: 'roberto', id: 1 },
    key: 'hi'
  });

  /* @ts-expect-error */
  <Component factory_2="hi" name="roberto" id={1} />;

  /* @ts-expect-error */
  <Component factory_2="hi" id={1} />;

  /* @ts-expect-error */
  <Component factory_2="hi" id="" />;

  /* @ts-expect-error */
  <Component factory_1="hi" id="" />;

  /* @ts-expect-error */
  <Component />;

  /* @ts-expect-error */
  <Component name="roberto" id={1} />;
});

test('factory without the correct BaseProps', () => {
  const Component = componentBuilder<TestProps>()
    /* @ts-expect-error */
    .factory(keyInProps<Record<string, never>, 'factory_1'>('factory_1'))
    .create((props, key) => {
      return {
        props,
        key
      } as unknown as JSX.Element;
    });
});

test('with two factories', () => {
  const ErrorComponent = componentBuilder<TestProps>()
    .factory(keyInProps<TestProps, 'factory_1'>('factory_1'))
    /* @ts-expect-error */
    .factory(keyInProps<TestProps, 'factory_2'>('factory_2'))
    .create((props, key) => {
      return {
        props,
        key
      } as unknown as JSX.Element;
    });

  const Component = componentBuilder<TestProps>()
    .factory(keyInProps<TestProps, 'factory_1'>('factory_1'))
    .factory(
      keyInProps<TestProps & { factory_1: 'hi' }, 'factory_2'>('factory_2')
    )
    .create((props, key, key2) => {
      return {
        props,
        key,
        key2
      } as unknown as JSX.Element;
    });

  expect(
    <Component factory_1="hi" factory_2="hi" id={2} name="usuario" />
  ).toEqual({
    key: 'hi',
    key2: 'hi',
    props: {
      id: 2,
      name: 'usuario'
    }
  });
});
