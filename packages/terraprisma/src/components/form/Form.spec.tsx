import { createRoot } from 'solid-js';
import { Form as FormType, createForm } from './Form';

describe('forms', () => {
  type FormValue = {
    name: string;
    foo: { bar: boolean };
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

  it('should include all fields', () => {
    expect(Form.Checkbox).toBeDefined();
    expect(Form.Toggler).toBeDefined();
    expect(Form.Datepicker).toBeDefined();
    expect(Form.TextArea).toBeDefined();
    expect(Form.RadioGroup).toBeDefined();
    expect(Form.Select).toBeDefined();
    expect(Form.Slider).toBeDefined();
  });
});
