import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Container from 'react-bootstrap/Container';
import Collapse from 'react-bootstrap/Collapse';
import errorVid from './error_demo.mp4';

const InfoForm = ({ onSubmit, resumeFlag, setResumeFlag }) => {
  // We could leave the input uncontrolled, but it is easier this way.
  const [inputValue, setInputValue] = React.useState('');
  const [open, setOpen] = useState(false);
  const [open2, setOpen2] = useState(false);

  const defaultText = (
    <div>
      <p>In this experiment, you will...</p>

      <p>See the task in action by clicking the Task Demo button</p>

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
        If you donk up, the screen will briefly flash red. Move the token to the
        docking target properly after that pls.
      </p>

      <p>See what an error looks like by clicking the Error Demo button</p>
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

      <p>
        {
          'Please enter your participant number, and hit "Submit" to begin the experiment: '
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
        number below!{' '}
      </p>
    </div>
  );

  const handleSubmit = (evt) => {
    evt.preventDefault();
    onSubmit(inputValue);
  };

  function InfoText() {
    if (resumeFlag) {
      return <div>{resumeText}</div>;
    } else {
      return <div>{defaultText}</div>;
    }
  }

  function reset() {
    localStorage.removeItem('currentStage');
    setResumeFlag(false);
  }

  return (
    <Container fluid>
      <div>
        <InfoText />

        <Form inline onSubmit={handleSubmit}>
          <Form.Label className="my-1 mr-2">Participant Number:</Form.Label>
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
