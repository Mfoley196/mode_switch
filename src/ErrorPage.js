import * as React from 'react';
import PropTypes from 'prop-types';

const ErrorPage = ({ goToStage, error }) => {
  const testText =
    error == null || error.message == null
      ? 'Whoops, something went wrong, try again'
      : error.message;

  function handleClick(e) {
    e.preventDefault();
    goToStage({ type: 'info' });
  }

  return (
    <div>
      <div>{testText}</div>
      <input type="submit" value="Continue" onClick={handleClick} />
    </div>
  );
};

ErrorPage.propTypes = {
  error: PropTypes.instanceOf(Error),
  goToStage: PropTypes.func.isRequired,
};

export default ErrorPage;
