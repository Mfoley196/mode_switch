import React, { useState } from 'react';
import Collapse from 'react-bootstrap/Collapse';
import Button from 'react-bootstrap/Button';

const InstructionsPage = (props) => {
  const { dispatch, stage } = props;
  const [open, setOpen] = useState(false);

  const modeSwitchText = (
    <div>
      <p>
        You will be switching between the <b>{stage['conds'][0]}</b> and the{' '}
        <b>{stage['conds'][1]}</b>.
      </p>
      <p>
        Please make sure the <b>{stage['conds'][0]}</b> and the{' '}
        <b>{stage['conds'][1]}</b> are connected to the iPad before pressing
        &quot;Begin&quot;.
      </p>
    </div>
  );

  const modeSwitchTextTouch1 = (
    <div>
      <p>
        You will be switching between <b>touch</b> and the{' '}
        <b>{stage['conds'][1]}</b>.
      </p>
      <p>
        Please make sure the <b>{stage['conds'][1]}</b> is connected to the iPad
        before pressing &quot;Begin&quot;.
      </p>
    </div>
  );

  const modeSwitchTextTouch2 = (
    <div>
      <p>
        You will be switching between the <b>{stage['conds'][0]}</b> and{' '}
        <b>touch</b>.
      </p>
      <p>
        Please make sure the <b>{stage['conds'][0]}</b> is connected to the iPad
        before pressing &quot;Begin&quot;.
      </p>
    </div>
  );

  const baselineText = (
    <div>
      <p>
        You will be using the <b>{stage['conds'][0]}</b>.
      </p>
      <p>
        Please make sure the <b>{stage['conds'][0]}</b> is connected to the iPad
        before pressing &quot;Begin&quot;.
      </p>
    </div>
  );

  const baselineTextTouch = (
    <p>
      You will be using <b>touch</b>.
    </p>
  );

  const connectionInst = (
    <p>
      You can check if a device is connected to the iPad by clicking on
      &quot;Settings&quot;, then &quot;Bluetooth&quot;.
    </p>
  );

  function handleClick(e) {
    //console.log(stage);
    e.preventDefault();
    dispatch({ type: 'next' });
  }

  function InstructionText() {
    if (stage['conds'][0] === stage['conds'][1]) {
      if (stage['conds'][0] === 'touch') {
        return { baselineTextTouch };
      } else {
        return <div>{baselineText}</div>;
      }
    } else {
      if (stage['conds'][0] === 'touch') {
        return <div>{modeSwitchTextTouch1}</div>;
      } else if (stage['conds'][1] === 'touch') {
        return <div>{modeSwitchTextTouch2}</div>;
      } else {
        return <div>{modeSwitchText}</div>;
      }
    }
  }

  return (
    <div>
      <InstructionText />
      {connectionInst}

      <Button
        onClick={() => setOpen(!open)}
        aria-controls="example-collapse-text"
        aria-expanded={open}
        variant="outline-secondary"
        size="sm"
      >
        Device Connection Guide
      </Button>
      <Collapse in={open}>
        <div id="example-collapse-text">
          Wow look at these instructions, sure are cool huh? Maybe add a
          container or something? Idk how bootstrap works
          <p></p>
        </div>
      </Collapse>

      <p></p>
      <p>{'Press "Begin" when you are ready to continue.'}</p>

      <Button onClick={handleClick} variant="outline-success">
        Begin
      </Button>
    </div>
  );
};

export default InstructionsPage;
