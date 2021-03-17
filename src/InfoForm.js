import * as React from 'react';
import PropTypes from 'prop-types';
import createS3Uploader from './createS3Uploader';

const InfoForm = ({ onSubmit }) => {
  // We could leave the input uncontrolled, but it is easier this way.
  const [inputValue, setInputValue] = React.useState('');

  let upload = createS3Uploader(
    'ca-central-1',
    'ca-central-1:297440ee-2e98-4761-9bfe-3e4a60448cbb',
    'nextpc-modeswitch1',
  );

  const handleSubmit = (evt) => {
    evt.preventDefault();
    let blah = { foo: 'bar' };
    upload('test.txt', blah)
      .then(function (response) {
        console.log('it worked?');
        console.log(response);
      })
      .catch((error) => {
        console.log("error");
        console.log(error);
      });

    onSubmit(inputValue);
  };

  return (
    <div>
      <p>Description of experiment</p>
      <p>
        {
          'Please enter your participant number, and hit "Submit" to begin the experiment: '
        }
      </p>
      <form onSubmit={handleSubmit}>
        <label>
          Participant Number:
          <input
            name="participantNumber"
            type="text"
            value={inputValue}
            onChange={(event) => setInputValue(event.target.value)}
          />
        </label>
        <input type="submit" value="Submit" />
      </form>
    </div>
  );
};

InfoForm.propTypes = { onSubmit: PropTypes.func.isRequired };

export default InfoForm;
