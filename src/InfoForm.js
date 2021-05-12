import React from 'react';
import PropTypes from 'prop-types';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

const MODALITIES = [
  {
    id: 'touch',
    url: process.env.PUBLIC_URL + '/token/touch_token.PNG',
    color: '#FF4000',
  },
  {
    id: 'pen',
    url: process.env.PUBLIC_URL + '/token/pen_token.PNG',
    color: '#FFFF00',
  },
  {
    id: 'mouse',
    url: process.env.PUBLIC_URL + '/token/mouse_token.PNG',
    color: '#00CCCC',
  },
  {
    id: 'trackpad',
    url: process.env.PUBLIC_URL + '/token/trackpad_token.PNG',
    color: '#FF00FF',
  },
];

const InfoForm = ({ onSubmit, resumeFlag, setResumeFlag }) => {
  // We could leave the input uncontrolled, but it is easier this way.
  const [inputValue, setInputValue] = React.useState('');

  const defaultText = (
    <div>
      <p></p>
      <p>In this experiment, you will...</p>

      <Container fluid>
        <Row>
          {MODALITIES.map(({ id, url, color }) => (
            <Col key={id}>
              <p>
                <span
                  style={{
                    backgroundColor: 'black',
                    color,
                    textTransform: 'capitalize',
                  }}
                >
                  {id}
                </span>{' '}
                targets look like this:
              </p>

              <img src={url} width="100px" alt={`${id} token`} />
              <p></p>
            </Col>
          ))}
        </Row>
      </Container>

      <hr />

      <p>See the task in action in the video below:</p>

      <video width="640" controls loop muted>
        <source
          src={process.env.PUBLIC_URL + '/videos/taskVid_comp.mp4'}
          type="video/mp4"
        ></source>
      </video>
      <p></p>

      <p>
        If you do not successfully put the token in the target, or if you
        attempt to hit a token with the wrong device, the screen will briefly
        flash red.
      </p>

      <p>After the screen flashes red, you can continue the task.</p>

      <p>See what an error looks like in the video below:</p>

      <video width="640" controls loop muted>
        <source
          src={process.env.PUBLIC_URL + '/videos/errorVid_comp.mp4'}
          type="video/mp4"
        ></source>
      </video>

      <hr />

      <p></p>
      <p>
        Please enter the participant ID provided to you, and hit
        &quot;Submit&quot; to begin the experiment:
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
    <div className="ml-4">
      <Container fluid>
        <div>
          <InfoText />
          <Form inline onSubmit={handleSubmit}>
            <p>
              <Form.Label className="my-1 mr-2">Participant ID:</Form.Label>
              <Form.Control
                type="text"
                value={inputValue}
                onChange={(event) => setInputValue(event.target.value)}
                className="my-1 mr-2"
              />
            </p>
            <p>
              <Button
                className="my-1 mr-2"
                type="submit"
                variant="outline-success"
              >
                Submit
              </Button>
            </p>
          </Form>
          <p></p>
          <p></p>
          <p>
            <button onClick={reset}>Restart</button>
          </p>
        </div>
      </Container>
    </div>
  );
};

InfoForm.propTypes = { onSubmit: PropTypes.func.isRequired };

export default InfoForm;
