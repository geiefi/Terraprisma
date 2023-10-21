import { Tooltip } from '@terraprisma/data-display';
import { Validators, createForm } from '@terraprisma/form';
import { Box, Button, OutlinedButton } from '@terraprisma/general';
import { Send } from '@terraprisma/icons';
import { Container, Stack } from '@terraprisma/layout';
import { GrowFade } from '@terraprisma/transitions';
import { createSignal } from 'solid-js';
import { Title } from 'solid-start';

type FormValue = {
  name: string;
  email: string;
  password: string;

  birthDate: Date;

  rememberMe: boolean;
};

export default function Index() {
  const IndexForm = createForm<FormValue>('testing index form');

  let passwordInput: HTMLInputElement;
  const [isPasswordInputVisible, setPasswordInputVisible] = createSignal(false);

  return (
    <main>
      <Title>Index login form</Title>
      <Container horizontalAlign="center">
        <Box style={{ 'max-width': '368px' }}>
          <Stack direction="vertical">
            <Stack
              direction="vertical"
              spacing={20}
              style={{ 'padding-block': '20px' }}
            >
              <IndexForm.Input
                name="name"
                label="Name"
                validators={[Validators.required]}
              />
              <IndexForm.Input
                name="email"
                label="Email"
                type="email"
                validators={[Validators.required, Validators.email]}
              />
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
              <IndexForm.Datepicker
                name="birthDate"
                label="Birth date"
                validators={[Validators.required]}
              />
              <GrowFade growingOrigin="bottom">
                <Tooltip
                  position="bottom"
                  visible={isPasswordInputVisible()}
                  identification="testing tooltip"
                  anchor={passwordInput!}
                >
                  We are never going to share your password with anyone, and it
                  is encrypted!
                </Tooltip>
              </GrowFade>
              <IndexForm.Checkbox name="rememberMe" label="Remember me" />
            </Stack>

            <Stack align="space-around">
              <OutlinedButton>Cancel</OutlinedButton>
              <Button>Submit</Button>
            </Stack>
          </Stack>
        </Box>
      </Container>
    </main>
  );
}
