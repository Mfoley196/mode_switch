import * as React from 'react';
import PropTypes from 'prop-types';
import createS3Uploader from './createS3Uploader';

const InfoForm = ({ onSubmit, resumeFlag, setResumeFlag }) => {
  // We could leave the input uncontrolled, but it is easier this way.
  const [inputValue, setInputValue] = React.useState('');

  let upload = createS3Uploader(
    'ca-central-1',
    'ca-central-1:297440ee-2e98-4761-9bfe-3e4a60448cbb',
    'nextpc-modeswitch1',
  );

  const defaultText = (
    <div>
      <p>Description of experiment</p>
      <p>
        {
          'Please enter your participant number, and hit "Submit" to begin the experiment: '
        }
      </p>
    </div>
  );

  const resumeText = (
    <div>
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
      <form onSubmit={handleSubmit}>
        <label>
          Participant Number:{'  '}
          <input
            name="participantNumber"
            type="text"
            value={inputValue}
            onChange={(event) => setInputValue(event.target.value)}
          />
        </label>
        <input type="submit" value="Submit" />
      </form>
      <button onClick={reset}>Restart</button>
    </div>
  );
};

InfoForm.propTypes = { onSubmit: PropTypes.func.isRequired };

export default InfoForm;
