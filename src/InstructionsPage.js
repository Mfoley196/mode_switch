import React, { useState } from 'react';
import Collapse from 'react-bootstrap/Collapse';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

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
      &quot;Settings&quot;, then &quot;Bluetooth&quot;. Click &quot;Device
      Connection Guide&quot; for more detailed instructions.
    </p>
  );

  const connectionGuide = (
    <div>
      <p>
        To check if a device is connected, click on the &quot;Settings&quot;
        app, then &quot;Bluetooth&quot;. Make sure &quot;Bluetooth&quot; is
        turned on.
      </p>
      <p>
        <Container fluid>
          <Row className="justify-content-md-center">
            <Col>
              <img
                src={process.env.PUBLIC_URL + '/devices/bluetooth_location.png'}
                width="400px"
              />
            </Col>
          </Row>
        </Container>
      </p>

      <p>
        In the &quot;Bluetooth&quot; screen, you can view the devices&apos;
        connection status.
      </p>
      <p>
        <Container fluid>
          <Row className="justify-content-md-center">
            <Col>
              <img
                src={process.env.PUBLIC_URL + '/devices/device_status.png'}
                width="400px"
              />
            </Col>
          </Row>
        </Container>
      </p>
      <p>
        <b>To reconnect the pen</b>, plug it into the charging port on the
        bottom of the iPad.
      </p>
      <Container fluid>
        <Row className="justify-content-md-center">
          <Col>
            <img
              src={process.env.PUBLIC_URL + '/devices/pencil_docked.jpeg'}
              width="200px"
            />
          </Col>
        </Row>
      </Container>
      <p>
        <b>To reconnect the mouse or trackpad</b>, first make sure the devices
        are turned on. Check that their power switches are turned on (switches
        are circled in red)
      </p>
      <p>
        <Container fluid>
          <Row className="justify-content-md-center">
            <Col>
              <img
                src={process.env.PUBLIC_URL + '/devices/mouse_switch.jpeg'}
                width="200px"
              />
            </Col>
            <Col>
              <img
                src={process.env.PUBLIC_URL + '/devices/trackpad_switch.jpeg'}
                width="200px"
              />
            </Col>
          </Row>
        </Container>
      </p>
      <p>
        Once the mouse or trackpad is on, you can reconnect them by tapping on
        the device name in the &quot;Bluetooth&quot; screen. (one image of
        unconnected mouse. draw circle to show where you tap) tap Magic Mouse
        (next image, with connected mouse)
      </p>
      <p>
        <Container fluid>
          <Row className="justify-content-md-center">
            <Col>
              <img
                src={
                  process.env.PUBLIC_URL + '/devices/mouse_not_connected.png'
                }
                width="400px"
              />
            </Col>
            <Col>
              <img
                src={process.env.PUBLIC_URL + '/devices/mouse_connected.png'}
                width="400px"
              />
            </Col>
          </Row>
        </Container>
      </p>
    </div>
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
        <div id="example-collapse-text" className="bg-light">
          {connectionGuide}
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
