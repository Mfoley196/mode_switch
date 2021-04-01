import React from 'react';
import Button from 'react-bootstrap/Button';

const DataLogger = (props) => {
  const { onSubmit, ...rest } = props;

  function handleClick() {
    onSubmit();
  }

  return (
    <div>
      <p>insert placeholder text until I get ORE wording</p>

      <Button onClick={handleClick} variant="outline-success">
        I Agree
      </Button>
    </div>
  );
};

export default DataLogger;
