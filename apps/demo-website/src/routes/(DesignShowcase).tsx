import { Component, createRoot, createSignal, getOwner } from 'solid-js';

import { Col, Row, Container, Stack } from '@terraprisma/layout';
import { List, Table } from '@terraprisma/data-display';
import {
  Box,
  Button,
  IconButton,
  Modal,
  OutlinedButton,
  createModal,
  useGrapeS
} from '@terraprisma/core';
import { Step, Steps } from '@terraprisma/navigation';
import {
  RadioGroup,
  Input,
  Select,
  Slider,
  Toggler,
  Checkbox,
  Datepicker,
  Validators,
  TextArea
} from '@terraprisma/form';
import {
  CopyAll,
  Delete,
  Drafts,
  Inbox,
  QuestionMark,
  Send,
  Star
} from '@terraprisma/icons';
import { Paragraph, Typography, Marked } from '@terraprisma/typography';

const confirm = (message: string) => {
  createModal({
    identification: 'Confirmation',
    title: message,
    body: <></>,
    onOk: () => console.log('confirmed!'),
    onCancel: () => console.log('cancelled!')
  });
};

const DesignShowcase: Component = () => {
  const [modalOpen, setModalOpen] = createSignal(false);

  return (
    <Container maxWidth="lg">
      <Box>
        <Row gap="5px">
          <Col size={8}>
            <Box style={{ padding: 0 }}>
              <List>
                <List.Item
                  icon={<Inbox variant="rounded" />}
                  onClick={() => confirm('Are you bananas!?')}
                  clickable
                >
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
                {(Option) => (
                  <>
                    <Option value="terraria">Terraria</Option>
                    <Option value="minecraft">Minecraft</Option>
                    <Option value="roblox" disabled>
                      Roblox
                    </Option>
                    <Option value="necesse">Necesse</Option>
                  </>
                )}
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
                  <Button color="accent">Primary</Button>
                  <Button color="accent">Secondary</Button>
                  <Button color="accent">Tertiary</Button>
                </Stack>
                {/* <Stack direction="horizontal" align="center" spacing={5}> */}
                {/*   <Button.Rounded color="accent"> */}
                {/*     Send <Send /> */}
                {/*   </Button.Rounded> */}
                {/*   <Button.Rounded color="transparent"> */}
                {/*     Are you sure? <QuestionMark /> */}
                {/*   </Button.Rounded> */}
                {/*   <Button.Rounded color="accent"> */}
                {/*     Delete <Delete /> */}
                {/*   </Button.Rounded> */}
                {/* </Stack> */}
                <Stack direction="horizontal" align="center" spacing={5}>
                  <OutlinedButton>Cancel</OutlinedButton>
                  <OutlinedButton>Confirm</OutlinedButton>
                </Stack>
                <Stack direction="horizontal" align="center" spacing={5}>
                  <IconButton>
                    <Send />
                  </IconButton>
                  <IconButton>
                    <CopyAll />
                  </IconButton>
                  <IconButton>
                    <Delete />
                  </IconButton>
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
                <Col size={8}>
                  <Datepicker
                    name="datepickerField"
                    label="Datepicker field"
                    value={new Date()}
                    focused
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
                <Col size={4}>
                  <TextArea label="Textarea field" name="textareField" />
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
                      <Toggler
                        color="success"
                        value
                        name="checkedTogglerField"
                      />
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
