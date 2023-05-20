import { Component, createSignal } from "solid-js";

import { GrapeS } from "grapes";
import { Input, Select, TextArea } from "grapes/Form/Fields";
import { Button } from "grapes/General";
import { Send } from "grapes/Icons";
import { Divisor, Stack } from "grapes/Layout";
import Validators from "grapes/Form/Validators";

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
        value={title()}
        onChange={(newValue) => setTitle(newValue)}
      />

      <TextArea
        name='description'
        label='Description'
        value={description()}
        onChange={(newValue) => setDescription(newValue)}
      />

      <Select
        name='bestGame'
        label='Which one is better?'
        helperText='OBS: choose Terraria :)'
        validators={[Validators.isEqual('terraria')]}
      >
        <Select.Option value='minecraft'>Minecraft</Select.Option>
        <Select.Option value='terraria'>Terraria</Select.Option>
        <Select.Option value='starbound'>Starbound</Select.Option>
        <Select.Option value='stardew-valley'>Stardew Valley</Select.Option>
      </Select>

      <Divisor />

      <Button size='large'>Send <Send /></Button>
    </Stack>
  </GrapeS>;
};

export default FieldsWithoutForms;
