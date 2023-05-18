import { Component, createEffect, createSignal } from "solid-js";

import { FoxPox } from "foxpox";
import { Input, TextArea } from "foxpox/Form/Fields";
import { Button } from "foxpox/General";
import { Send } from "foxpox/Icons";
import { Divisor, Stack } from "foxpox/Layout";

const FieldsWithoutForms: Component = () => {
  const [title, setTitle] = createSignal<string>();
  const [description, setDescription] = createSignal<string>();

  return <FoxPox>
    <Stack direction="vertical" style={{
      'max-width': '568px',
      'margin-inline': 'auto',
      'margin-top': '40vh',
    }}>
      <Input
        name='title'
        label='Title'
        value={title}
        onChange={(newValue) => setTitle(newValue)}
      />

      <TextArea
        name='description'
        label='Description'
        value={description}
        onChange={(newValue) => setDescription(newValue)}
      />
      
      <Divisor/>

      <Button size='large'>Send <Send /></Button>
    </Stack>
  </FoxPox>;
};

export default FieldsWithoutForms;
