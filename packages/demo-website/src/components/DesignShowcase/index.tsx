import { Component } from 'solid-js';

import { GrapeS } from 'grapes';
import { Col, Row } from 'grapes/Layout/Grid';
import { Table } from 'grapes/DataDisplay';
import { Container, Stack } from 'grapes/Layout';
import { Box, Button } from 'grapes/General';
import { RadioGroup, Input, Select, Slider, Toggler, Checkbox, TextArea, Datepicker, ButtonChooser } from 'grapes/Form/Fields';
import Validators from 'grapes/Form/Validators';
import { Step, Steps } from 'grapes/Navigation';
import { Check, CopyAll, Delete, QuestionMark, SelfCare, Send } from 'grapes/Icons';

const DesignShowcase: Component = () => {
  return <GrapeS defaultThemeId="dark">
    <Container maxWidth="lg">
      <Box>
        <Row gap="5px">
          <Col size={14}>
            <Table identification="MostPopulatedCountries" boxed>
              <Table.Row headRow>
                <Table.Column> Country </Table.Column>
                <Table.Column> Population </Table.Column>
              </Table.Row>
              <Table.Row>
                <Table.Column> China </Table.Column>
                <Table.Column> 1,439,323,776 </Table.Column>
              </Table.Row>
              <Table.Row>
                <Table.Column> India </Table.Column>
                <Table.Column> 1,380,004,385 </Table.Column>
              </Table.Row>
              <Table.Row>
                <Table.Column> United States </Table.Column>
                <Table.Column> 331,002,651 </Table.Column>
              </Table.Row>
            </Table>
          </Col>
          <Col size={10} style={{ 'display': 'flex' }}>
            <Box style={{ width: '100%', margin: 'auto' }}>
              <RadioGroup 
                name="ShowcasingRadioGroup" 
                label="What is the best game?" 
                validateOnStartup
                validators={[Validators.isEqual('terraria')]}
                value="minecraft"
              >
                <RadioGroup.Option value="terraria"> Terraria </RadioGroup.Option>
                <RadioGroup.Option value="minecraft"> Minecraft </RadioGroup.Option>
                <RadioGroup.Option value="roblox" disabled> Roblox </RadioGroup.Option>
                <RadioGroup.Option value="necesse"> Necesse </RadioGroup.Option>
              </RadioGroup>
            </Box>
          </Col>
          <Col size={16}>
            <Steps identification="ShowcasingSteps" current={1}>
              <Step description="This is the description for the finished step">
                Finished
              </Step>
              <Step description="An awesome description right here">
                Doing
              </Step>
              <Step description="Lorem Ipsum and all that good stuff">
                To-do
              </Step>
            </Steps>
          </Col>
          <Col size={8}>
            <Box>
              <Stack direction="vertical" spacing={10}>
                <Stack direction="horizontal" align="center" spacing={5}>
                  <Button color="primary">Primary</Button>
                  <Button color="secondary">Secondary</Button>
                  <Button color="tertiary">Tertiary</Button>
                </Stack>
                <Stack direction="horizontal" align="center" spacing={5}>
                  <Button.Rounded color="primary">Send <Send/></Button.Rounded>
                  <Button.Rounded color="secondary">Are you sure? <QuestionMark/></Button.Rounded>
                  <Button.Rounded color="tertiary">Delete <Delete/></Button.Rounded>
                </Stack>
                <Stack direction="horizontal" align="center" spacing={5}>
                  <Button.Empty color="primary">Cancel</Button.Empty>
                  <Button.Empty color="primary">Confirm</Button.Empty>
                </Stack>
                <Stack direction="horizontal" align="center" spacing={5}>
                  <Button.Icon color="primary"><Send/></Button.Icon>
                  <Button.Icon color="secondary"><CopyAll/></Button.Icon>
                  <Button.Icon color="tertiary"><Delete/></Button.Icon>
                </Stack>
              </Stack>
            </Box>
          </Col>
          <Col size={24}>
            <Box>
              <Row gap="5px" rowGap="10px">
                <Col size={4}>
                  <Input label="Input field" name="inputField"/>
                </Col>
                <Col size={4}>
                  <Input label="Masked Input field" placeholder="(99) 99999-9999" mask="(99) 99999-9999" name="maskedInputField"/>
                </Col>
                <Col size={4}>
                  <Select label="Select Field" value="loremIpsum" name="selectField" focused>
                    <Select.Option value="loremIpsum">Lorem Ipsum</Select.Option>
                    <Select.Option value="dolorSit">Dolor Sit</Select.Option>
                    <Select.Option value="ametIpsum">Amet Ipsum</Select.Option>
                  </Select>
                </Col>
                <Col size={8}>
                  <Datepicker name="datepickerField" value={new Date()} focused/>
                </Col>
                <Col size={4}>
                  <Slider label="Slider Field" focused value={20} name="sliderField"/>
                </Col>
                <Col size={8}>
                  <Row>
                    <Col size={4}>
                      <Toggler value={false} name="togglerField"/>
                    </Col>
                    <Col size={4}>
                      <Toggler value name="checkedTogglerField"/>
                    </Col>
                    <Col size={4}>
                      <Toggler disabled name="disabledTogglerField"/>
                    </Col>
                    <Col size={4}>
                      <Toggler value disabled name="disabledCheckedTogglerField"/>
                    </Col>
                  </Row>
                </Col>
                <Col size={14}></Col>
                <Col size={8}>
                  <Row>
                    <Col size={3}>
                      <Checkbox name="checkbox" />
                    </Col>
                    <Col size={3}>
                      <Checkbox name="checkedCheckbox" value />
                    </Col>
                    <Col size={3}>
                      <Checkbox name="disabledCheckbox" disabled />
                    </Col>
                    <Col size={3}>
                      <Checkbox name="checkedDisabledCheckbox" value disabled />
                    </Col>
                  </Row>
                </Col>
              </Row>
            </Box>
          </Col>
        </Row>
      </Box>
    </Container>
  </GrapeS>;
};

export default DesignShowcase;
