import { Component, createSignal } from 'solid-js';
import Box from './Components/General/Box/Box';
import Button from './Components/General/Button/Button';
import Stack from './Components/Layout/Stack/Stack';

import Steps, { Step } from './Components/Navigation/Steps/Steps';

const App: Component = () => {
  const [currentStep, setCurrentStep] = createSignal<number>(1);

  return (<>
    <Steps current={currentStep} identification='Testing steps'>
      <Step>First</Step>
      <Step>Second</Step>
      <Step>Last</Step>
    </Steps>

    <Box>
      <Stack spacing={5} direction='horizontal' align='space-between'>
        <Button
          size='large'
          onClick={() => setCurrentStep(currentStep() - 1)}
        >Previous</Button>
        <Button
          size='large'
          onClick={() => setCurrentStep(currentStep() + 1)}
        >Next</Button>
      </Stack>
    </Box>
  </>);
};

export default App;
