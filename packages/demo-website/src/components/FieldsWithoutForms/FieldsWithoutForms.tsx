import { Component, createEffect, createSignal } from "solid-js";

import { FoxPox } from "foxpox";
import { Input, TextArea } from "foxpox/Components/Form/Fields";
import { Button } from "foxpox/Components/General";
import { Send } from "foxpox/Components/Icons";
import { Divisor, Stack } from "foxpox/Components/Layout";

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
