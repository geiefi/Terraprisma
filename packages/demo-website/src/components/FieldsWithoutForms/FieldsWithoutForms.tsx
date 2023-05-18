import { Component, createSignal } from "solid-js";

import { GrapeS } from "grapes";
import { Input, TextArea } from "grapes/Form/Fields";
import { Button } from "grapes/General";
import { Send } from "grapes/Icons";
import { Divisor, Stack } from "grapes/Layout";

const FieldsWithoutForms: Component = () => {
  const [title, setTitle] = createSignal<string>();
  const [description, setDescription] = createSignal<string>();

  return <GrapeS>
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
  </GrapeS>;
};

export default FieldsWithoutForms;
