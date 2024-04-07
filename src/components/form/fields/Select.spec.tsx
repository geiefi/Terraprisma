import { createRoot } from 'solid-js';
import { Form as FormType, createForm } from '../Form';

describe('Select', () => {
  type FormValue = {
    name: 'gabriel' | 'me' | 'fern';
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
    <Form.Select name="name.square"/>;

    // @ts-expect-error should not allow for values that do not match the respective property on the form's value
    <Form.Select name="name">{(Option) => <Option value={123}>Test value</Option>}</Form.Select>;

    // @ts-expect-error should not allow for values that do not match the respective property on the form's value
    <Form.Select name="name">{(Option) => <Option value="">Test value</Option>}</Form.Select>;

    <Form.Select name="name">{(Option) => <Option value="me">Test value</Option>}</Form.Select>;
  });
});
