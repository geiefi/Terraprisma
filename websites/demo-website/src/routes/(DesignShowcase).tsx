import { Component, createSignal } from 'solid-js';

import { Col, Row, Container, Stack } from '@grapos/layout';
import { List, Table } from '@grapos/data-display';
import { Box, Button, Modal } from '@grapos/core';
import { Step, Steps } from '@grapos/navigation';
import {
  RadioGroup,
  Input,
  Select,
  Slider,
  Toggler,
  Checkbox,
  Datepicker,
  Validators
} from '@grapos/form';
import {
  CopyAll,
  Delete,
  Drafts,
  Inbox,
  QuestionMark,
  Send,
  Star
} from '@grapos/icons';
import { Paragraph, Typography, Marked } from '@grapos/typography';

const DesignShowcase: Component = () => {
  const [modalOpen, setModalOpen] = createSignal(false);
  return (
    <Container maxWidth="lg">
      <Box>
        <Row gap="5px">
          <Col size={8}>
            <Box style={{ padding: 0 }}>
              <List>
                <List.Item icon={<Inbox variant="rounded" />} clickable>
                  Inbox
                </List.Item>

                <List.Divisor />

                <List.ItemWithDetails
                  icon={<Drafts variant="rounded" />}
                  subItems={
                    <List.Item icon={<Star variant="rounded" />} clickable>
                      Star
                    </List.Item>
                  }
                >
                  Drafts
                </List.ItemWithDetails>
              </List>
            </Box>
          </Col>
          <Col size={16}>
            <Button onClick={() => setModalOpen(true)}>Open modal</Button>

            <Modal
              title="Hello, this is a modal"
              visible={modalOpen()}
              onOk={() => setModalOpen(false)}
              onCancel={() => setModalOpen(false)}
            >
              <Typography>
                <Paragraph>
                  A modal consists of a dialog box that can be used for almost
                  anything when you want to add something new to the website
                  without needing to find a way to add too much information on
                  the user's screen.
                </Paragraph>
                <Paragraph>
                  You can create many modals with <Marked>GrapeS</Marked> and
                  still not have enough of it. Have fun!
                </Paragraph>
              </Typography>
            </Modal>
          </Col>
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
          <Col size={10} style={{ display: 'flex' }}>
            <Box style={{ width: '100%', margin: 'auto' }}>
              <RadioGroup
                name="ShowcasingRadioGroup"
                label="What is the best game?"
                validateOnStartup
                validators={[Validators.isEqual('terraria')]}
                value="minecraft"
              >
                <RadioGroup.Option value="terraria">Terraria</RadioGroup.Option>
                <RadioGroup.Option value="minecraft">
                  Minecraft
                </RadioGroup.Option>
                <RadioGroup.Option value="roblox" disabled>
                  Roblox
                </RadioGroup.Option>
                <RadioGroup.Option value="necesse">Necesse</RadioGroup.Option>
              </RadioGroup>
            </Box>
          </Col>
          <Col size={16}>
            <Steps identification="ShowcasingSteps" current={1}>
              <Step description="This is the description for the finished step">
                Finished
              </Step>
              <Step description="An awesome description right here">Doing</Step>
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
                  <Button.Rounded color="primary">
                    Send <Send />
                  </Button.Rounded>
                  <Button.Rounded color="secondary">
                    Are you sure? <QuestionMark />
                  </Button.Rounded>
                  <Button.Rounded color="tertiary">
                    Delete <Delete />
                  </Button.Rounded>
                </Stack>
                <Stack direction="horizontal" align="center" spacing={5}>
                  <Button.Empty color="primary">Cancel</Button.Empty>
                  <Button.Empty color="primary">Confirm</Button.Empty>
                </Stack>
                <Stack direction="horizontal" align="center" spacing={5}>
                  <Button.Icon color="primary">
                    <Send />
                  </Button.Icon>
                  <Button.Icon color="secondary">
                    <CopyAll />
                  </Button.Icon>
                  <Button.Icon color="tertiary">
                    <Delete />
                  </Button.Icon>
                </Stack>
              </Stack>
            </Box>
          </Col>
          <Col size={24}>
            <Box>
              <Row gap="5px" rowGap="10px">
                <Col size={4}>
                  <Input label="Input field" name="inputField" />
                </Col>
                <Col size={4}>
                  <Input
                    label="Masked Input field"
                    placeholder="(99) 99999-9999"
                    mask="(99) 99999-9999"
                    name="maskedInputField"
                  />
                </Col>
                <Col size={4}>
                  <Select
                    label="Select Field"
                    value="loremIpsum"
                    name="selectField"
                    focused
                  >
                    <Select.Option value="loremIpsum">
                      Lorem Ipsum
                    </Select.Option>
                    <Select.Option value="dolorSit">Dolor Sit</Select.Option>
                    <Select.Option value="ametIpsum">Amet Ipsum</Select.Option>
                  </Select>
                </Col>
                <Col size={8}>
                  <Datepicker
                    name="datepickerField"
                    value={new Date()}
                    focused
                  />
                </Col>
                <Col size={4}>
                  <Slider
                    label="Slider Field"
                    focused
                    value={20}
                    name="sliderField"
                  />
                </Col>
                <Col size={8}>
                  <Row>
                    <Col size={4}>
                      <Toggler value={false} name="togglerField" />
                    </Col>
                    <Col size={4}>
                      <Toggler value name="checkedTogglerField" />
                    </Col>
                    <Col size={4}>
                      <Toggler disabled name="disabledTogglerField" />
                    </Col>
                    <Col size={4}>
                      <Toggler
                        value
                        disabled
                        name="disabledCheckedTogglerField"
                      />
                    </Col>
                  </Row>
                </Col>
                <Col size={14} />
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
  );
};

export default DesignShowcase;
