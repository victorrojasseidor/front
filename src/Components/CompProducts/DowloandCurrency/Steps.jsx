import React, { useState } from 'react';
import { Steps, Panel, Placeholder, ButtonGroup, Button } from 'rsuite';

const StepsBar = () => {
  const [step, setStep] = useState(0);

  const onChange = (nextStep) => {
    setStep(nextStep < 0 ? 0 : nextStep > 3 ? 3 : nextStep);
  };

  const onNext = () => onChange(step + 1);
  const onPrevious = () => onChange(step - 1);

  return (
    <div>
      <Steps current={step}>
        <Steps.Item title="Finished" description="Description" />
        <Steps.Item title="In Progress" description="Description" />
        <Steps.Item title="Waiting" description="Description" />
        <Steps.Item title="Waiting" description="Description" />
      </Steps>
      <hr />
      <Panel header={`Step: ${step + 1}`}>
        <Placeholder.Paragraph />
      </Panel>
      <hr />
      <ButtonGroup>
        <Button onClick={onPrevious} disabled={step === 0}>
          Previous
        </Button>
        <Button onClick={onNext} disabled={step === 3}>
          Next
        </Button>
      </ButtonGroup>
    </div>
  );
};

export default StepsBar;
