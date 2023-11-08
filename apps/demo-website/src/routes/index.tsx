import { createSignal } from 'solid-js';
import { Title } from 'solid-start';

import { Tooltip } from '@terraprisma/data-display';
import { Validators, createForm } from '@terraprisma/form';
import { Box, Button, TextButton } from '@terraprisma/general';
import { Menu, MenuItem } from '@terraprisma/navigation';
import {
  Female,
  Help,
  Logout,
  Male,
  Person,
  Settings
} from '@terraprisma/icons';
import { Col, Container, Row, Stack } from '@terraprisma/layout';
import { GrowFade } from '@terraprisma/transitions';

type FormValue = {
  name: string;
  email: string;
  password: string;

  gender: 'male' | 'female';
  birthDate: Date;

  rememberMe: boolean;
};

export default function Index() {
  const IndexForm = createForm<FormValue>('testing index form');

  let passwordInput: HTMLInputElement;
  const [isPasswordInputVisible, setPasswordInputVisible] = createSignal(false);

  let profileButton: HTMLButtonElement;
  const [isShowingProfileMenu, setShowingProfileMenu] = createSignal(false);

  return (
    <main>
      <Title>Index login form</Title>
      <div class="w-full flex flex-row-reverse h-fit px-10 py-5 border-0 border-b border-solid border-b-[var(--floating-border)] mb-auto">
        <TextButton
          onClick={() => setShowingProfileMenu((v) => !v)}
          ref={(ref) => (profileButton = ref)}
        >
          menu
        </TextButton>

        <GrowFade growingOrigin="top">
          <Menu visible={isShowingProfileMenu()} for={profileButton!}>
            <MenuItem class="flex gap-2">
              <Person /> profile
            </MenuItem>
            <MenuItem class="flex gap-2">
              <Settings /> settings
            </MenuItem>
            <MenuItem class="flex gap-2">
              <Logout /> logout
            </MenuItem>
            <MenuItem class="flex gap-2">
              <Help /> help
            </MenuItem>
          </Menu>
        </GrowFade>
      </div>

      <Container class="h-screen flex">
        <Box class="max-w-[568px] mx-auto mb-auto my-20">
          <IndexForm>
            <Stack direction="vertical">
              <h1 class="text-center">login</h1>

              <Stack direction="vertical" class="py-5" spacing={20}>
                <Row>
                  <Col size={12}>
                    <IndexForm.Input
                      name="name"
                      label="Name"
                      validators={[Validators.required]}
                    />
                  </Col>
                  <Col size={12}>
                    <IndexForm.Input
                      name="email"
                      label="Email"
                      type="email"
                      validators={[Validators.required, Validators.email]}
                    />
                  </Col>
                  <Col size={12}>
                    <IndexForm.Input
                      ref={(i) => (passwordInput = i)}
                      name="password"
                      label="Password"
                      type="password"
                      onMouseOver={() => setPasswordInputVisible(true)}
                      onMouseOut={() => setPasswordInputVisible(false)}
                      validators={[
                        Validators.required,
                        (value: string | null | undefined) =>
                          value
                            ? value[0].toUpperCase() !== value[0]
                              ? 'First letter must be upper case!'
                              : undefined
                            : 'First letter must be upper case!',
                        (value: string | null | undefined) =>
                          value
                            ? value.length < 6
                              ? 'Minimum of 6 characters is required!'
                              : undefined
                            : 'Minimum of 6 characters is required!'
                      ]}
                    />
                  </Col>
                  <Col size={12}>
                    <IndexForm.Select name="gender" label="Gender">
                      {(Option) => (
                        <>
                          <Option value="male">
                            <Male /> Male
                          </Option>
                          <Option value="female">
                            <Female /> Female
                          </Option>
                        </>
                      )}
                    </IndexForm.Select>
                  </Col>
                  <IndexForm.Datepicker
                    name="birthDate"
                    label="Birth date"
                    validators={[Validators.required]}
                  />
                </Row>
                <GrowFade growingOrigin="bottom">
                  <Tooltip
                    position="bottom"
                    visible={isPasswordInputVisible()}
                    identification="testing tooltip"
                    anchor={passwordInput!}
                  >
                    We are never going to share your password with anyone, and
                    it is encrypted!
                  </Tooltip>
                </GrowFade>
                <IndexForm.Checkbox name="rememberMe" label="Remember me" />
              </Stack>

              <Stack align="space-around">
                <TextButton>Cancel</TextButton>
                <Button>Submit</Button>
              </Stack>
            </Stack>
          </IndexForm>
        </Box>
      </Container>
    </main>
  );
}
