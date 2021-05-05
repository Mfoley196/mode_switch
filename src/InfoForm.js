import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Collapse from 'react-bootstrap/Collapse';
import errorVid from './error_demo.mp4';

const InfoForm = ({ onSubmit, resumeFlag, setResumeFlag }) => {
  // We could leave the input uncontrolled, but it is easier this way.
  const [inputValue, setInputValue] = React.useState('');
  const [open, setOpen] = useState(false);
  const [open2, setOpen2] = useState(false);

  const PEN_COLOR = '#FFFF00';
  const MOUSE_COLOR = '#00CCCC';
  const TOUCH_COLOR = '#FF4000';
  const TRACK_COLOR = '#FF00FF';

  function getFillColor(input) {
    switch (input) {
      case 'pen':
        return PEN_COLOR;
      case 'touch':
        return TOUCH_COLOR;
      case 'mouse':
        return MOUSE_COLOR;
      case 'trackpad':
        return TRACK_COLOR;
      default:
        return 'white';
    }
  }

  const defaultText = (
    <div>
      <p>In this experiment, you will...</p>

      <Container fluid>
        <Row>
          <Col>
            <p>
              <span
                style={{
                  backgroundColor: 'black',
                  color: getFillColor('touch'),
                }}
              >
                Touch
              </span>{' '}
              targets look like this:
            </p>

            <img
              src={process.env.PUBLIC_URL + '/token/touch_token.PNG'}
              width="100px"
              alt="touch token."
            />
            <p></p>
          </Col>

          <Col>
            <p>
              <span
                style={{ backgroundColor: 'black', color: getFillColor('pen') }}
              >
                Pen
              </span>{' '}
              targets look like this:
            </p>
            <img
              src={process.env.PUBLIC_URL + '/token/pen_token.PNG'}
              width="100px"
              alt="pen token."
            />
            <p></p>
          </Col>
        </Row>

        <Row>
          <Col>
            <p>
              <span
                style={{
                  backgroundColor: 'black',
                  color: getFillColor('mouse'),
                }}
              >
                Mouse
              </span>{' '}
              targets look like this:
            </p>
            <img
              src={process.env.PUBLIC_URL + '/token/mouse_token.PNG'}
              width="100px"
              alt="pen token."
            />
            <p></p>
          </Col>

          <Col>
            <p>
              <span
                style={{
                  backgroundColor: 'black',
                  color: getFillColor('trackpad'),
                }}
              >
                Trackpad
              </span>{' '}
              targets look like this:
            </p>
            <img
              src={process.env.PUBLIC_URL + '/token/trackpad_token.PNG'}
              width="100px"
              alt="pen token."
            />
            <p></p>
          </Col>
        </Row>
      </Container>

      <p>See the task in action by clicking on &quot;Task Demo&quot;:</p>

      <Button
        onClick={() => setOpen(!open)}
        aria-controls="example-error-text"
        aria-expanded={open2}
        variant="outline-secondary"
      >
        Task Demo
      </Button>
      <Collapse in={open}>
        <div id="example-error-text">
          <video width="480" controls loop muted>
            <source src={errorVid} type="video/mp4"></source>
          </video>
        </div>
      </Collapse>
      <p></p>

      <p>
        If you do not successfully put the token in the target, or if you
        attempt to hit a token with the wrong device, the screen will briefly
        flash red.
      </p>

      <p>After the screen flashes red, you can continue the task.</p>

      <p>See what an error looks like by clicking &quot;Error Demo&quot;:</p>
      <Button
        onClick={() => setOpen2(!open2)}
        aria-controls="example-error-text"
        aria-expanded={open2}
        variant="outline-secondary"
      >
        Error Demo
      </Button>
      <Collapse in={open2}>
        <div id="example-error-text">
          <video width="480" controls loop muted>
            <source src={errorVid} type="video/mp4"></source>
          </video>
        </div>
      </Collapse>

      <p></p>
      <p>
        {
          'Please enter the participant ID provided to you, and hit "Submit" to begin the experiment: '
        }
      </p>
    </div>
  );

  const resumeText = (
    <div>
      <p></p>
      <p>You may have accidentally refreshed the web page.</p>
      <p>
        To resume the experiment from where you left off, enter your participant
        ID below!{' '}
      </p>
    </div>
  );

  const handleSubmit = (evt) => {
    evt.preventDefault();
    if ('currentStage' in localStorage) {
      //console.log(localStorage.getItem('currentStage'));
      let state = JSON.parse(localStorage.getItem('currentStage'));

      if (state.participantId === inputValue) {
        onSubmit(inputValue);
      } else {
        alert(
          'This participant ID does not match the saved ID. Please enter ' +
            'the correct participant ID, or hit the "Restart" button to delete ' +
            'all experiment progress.',
        );
      }

      //setResumeFlag(true);
    } else {
      onSubmit(inputValue);
    }
  };

  function InfoText() {
    if (resumeFlag) {
      return <div>{resumeText}</div>;
    } else {
      return <div>{defaultText}</div>;
    }
  }

  function reset() {
    if (
      window.confirm(
        'WARNING: You are deleting all experiment progress.' +
          ' Are you sure you want to do this?',
      )
    ) {
      localStorage.removeItem('currentStage');
      setResumeFlag(false);
    }
  }

  return (
    <Container fluid>
      <div>
        <InfoText />

        <Form inline onSubmit={handleSubmit}>
          <Form.Label className="my-1 mr-2">Participant ID:</Form.Label>
          <Form.Control
            type="text"
            value={inputValue}
            onChange={(event) => setInputValue(event.target.value)}
            className="my-1 mr-2"
          />
          <p></p>
          <Button className="my-1 mr-2" type="submit" variant="outline-success">
            Submit
          </Button>
        </Form>
        <p></p>
        <button onClick={reset}>Restart</button>
      </div>
    </Container>
  );
};

InfoForm.propTypes = { onSubmit: PropTypes.func.isRequired };

export default InfoForm;
