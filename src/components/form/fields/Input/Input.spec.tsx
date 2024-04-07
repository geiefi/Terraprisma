import { createRoot } from 'solid-js';
import { Form as FormType, createForm } from '../../Form';
import Input from './Input';

describe('Input', () => {
  type FormValue = {
    name: string;
    text: {
      color: string;
      opacity: number;
      fontSize: number;
      stroke: { color: string; width: number };
    };
  };
  let Form: FormType<FormValue>;

  beforeAll(() => {
    createRoot(() => {
      Form = createForm('testing form');
    });
  });

  test('types', () => {
    // @ts-expect-error should not allow for names that don't exist
    <Form.Input name="name.square" />;

    // @ts-expect-error should not allow for values that do not match the respective property on the form's value
    <Form.Input name="name" value={123123} />;

    // @ts-expect-error should not allow for string fields when the type is number
    <Form.Input name="name" type="number" value={123123} />;

    <Form.Input name="name" value="testing value" />;

    <Form.Input
      name="text.stroke.width"
      type="number"
      // @ts-expect-error should make the value inside of onChange the same as the one that comes on the value prop
      onChange={(v) => v === '123'}
    />;

    // @ts-expect-error should make the value inside of onChange the same as the one that comes on the value prop
    <Form.Input name="text.stroke.color" onChange={(v) => v === 123} />;

    // @ts-expect-error
    <Input name="test" type="text" onChange={(v) => v === 123} />;
  });
});
