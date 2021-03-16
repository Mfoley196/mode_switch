import * as React from 'react';
import PropTypes from 'prop-types';

const InfoForm = ({ onSubmit }) => {
  // We could let the input uncontrolled, but it is easier this way.
  const [inputValue, setInputValue] = React.useState('');

  const handleSubmit = (evt) => {
    evt.preventDefault();
    onSubmit(Number(inputValue));
  };

  return (
    <div>
      <div>{'Please enter your participant number, and hit \"Submit\" to begin the experiment: '}</div>
      <form onSubmit={handleSubmit}>
        <label>
          Participant Number:
          <input
            type="number"
            value={inputValue}
            onChange={(event) => setInputValue(event.target.value)}
          />
        </label>
        <p></p>
        <input type="submit" value="Submit" />
      </form>
    </div>
  );
};

InfoForm.propTypes = { onSubmit: PropTypes.func.isRequired };

export default InfoForm;
