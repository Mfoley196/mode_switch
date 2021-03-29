import * as React from 'react';
import PropTypes from 'prop-types';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

const InfoForm = ({ onSubmit, resumeFlag, setResumeFlag }) => {
  // We could leave the input uncontrolled, but it is easier this way.
  const [inputValue, setInputValue] = React.useState('');

  const defaultText = (
    <div>
      <p>In this experiment, you will...</p>
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
  );
};

InfoForm.propTypes = { onSubmit: PropTypes.func.isRequired };

export default InfoForm;
