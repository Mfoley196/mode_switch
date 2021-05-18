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

function preload(url) {
  return new Promise((resolve, reject) => {
    let image = new Image();
    image.addEventListener('load', () => {
      resolve(image);
    });
    image.addEventListener('error', reject);
    image.src = url;
    return image;
  });
}

const InfoForm = ({ onSubmit, resumeFlag, setResumeFlag, participantIds }) => {
  // We could leave the input uncontrolled, but it is easier this way.
  const [inputValue, setInputValue] = React.useState('');
  React.useEffect(() => {
    MODALITIES.forEach((img) => {
      img.elm = preload(img.url);
    });
  }, []);

  const handleSubmit = (evt) => {
    console.log(inputValue);
    console.log(participantIds);
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
      if (participantIds.indexOf(inputValue > -1)) {
        //onSubmit(inputValue);
      } else {
        alert(
          'This is not a valid participant ID. ' +
            'Please make sure you typed in your provided participant ID correctly.',
        );
      }
    }
  };

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
        <p></p>
        <div>
          {resumeFlag ? <ResumeText /> : <DefaultText />}
          <Form inline onSubmit={handleSubmit}>
            <p>
              <Form.Label className="my-1 mr-2">
                Participant ID:
                <Form.Control
                  style={{ marginLeft: '0.5em' }}
                  type="text"
                  value={inputValue}
                  onChange={(event) => setInputValue(event.target.value)}
                  className="my-1 mr-2"
                />
              </Form.Label>
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

function DefaultText() {
  return (
    <div>
      <p></p>
      <p>
        In this experiment, you will performing a simple drag and drop task,
        where you drag a circular token to a target area, while switching
        between four input devices:{' '}
      </p>
      <ul>
        {MODALITIES.map(({ id, color }) => (
          <li key={id}>
            <span
              style={{
                backgroundColor: 'black',
                color,
                textTransform: 'capitalize',
              }}
            >
              {id}
            </span>{' '}
          </li>
        ))}
      </ul>
      <p>Tokens are color coded to show which device you should use:</p>
      <Container fluid>
        <Row>
          {MODALITIES.map(({ id, url, color, elm }) => (
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
                tokens look like this:
              </p>

              <img src={url} width="100px" alt={`${id} token`} />
              <p></p>
            </Col>
          ))}
        </Row>
      </Container>
      <hr />
      <p></p>
      <b>Task:</b>
      <p></p>
      <p>
        Get token with device, drag it to the target area, with dashed lines.
        You can tell when the token is entirely within the target area when the
        token changes color. Targets are arranged in a circle.
      </p>
      <p>See the task in action in the video below:</p>
      <video controls loop muted>
        <source
          src={process.env.PUBLIC_URL + '/videos/taskVid.mp4'}
          type="video/mp4"
        ></source>
      </video>
      <p></p>
      <p>
        If you do not successfully put the token in the target, or if you
        attempt to hit a token with the wrong device (for example, if you try to
        move a touch token with the pen), the screen will briefly flash red.
      </p>
      <p>After the screen flashes red, you can continue the task.</p>
      <p>See what an error looks like in the video below:</p>
      <video controls loop muted>
        <source
          src={process.env.PUBLIC_URL + '/videos/errorVid.mp4'}
          type="video/mp4"
        ></source>
      </video>
      <hr />
      <p></p>
      <b>Experiment Structure:</b>
      <p></p>
      <p>
        You will complete 6 pairs of device switches, with four blocks for each
        pair. Before and after the switching task, you will perform two baseline
        blocks with the devices used for the switching task.
      </p>
      <p>
        As an example, for the Pen & Touch task, you would complete the
        following blocks:
      </p>
      <p>
        &emsp;Pen Baseline - Block 1; Touch Baseline - Block 1; Pen & Touch -
        Block 1; Pen & Touch - Block 2; Pen & Touch - Block 3; Pen & Touch -
        Block 4; Touch Baseline - Block 2; Pen Baseline - Block 2
      </p>
      <p></p>
      <p>
        you can view your overall progress before and after completing a block.
      </p>
      <hr />
      <p></p>
      <p>
        Please enter the participant ID provided to you, and hit
        &ldquo;Submit&rdquo; to begin the experiment:
      </p>
    </div>
  );
}

function ResumeText() {
  return (
    <div>
      <p></p>
      <p>You may have accidentally refreshed the web page.</p>
      <p>
        To resume the experiment from where you left off, enter your participant
        ID below!{' '}
      </p>
    </div>
  );
}

InfoForm.propTypes = { onSubmit: PropTypes.func.isRequired };

export default InfoForm;
