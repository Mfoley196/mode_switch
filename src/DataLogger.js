import React from 'react';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Spinner from 'react-bootstrap/Spinner';

const DataLogger = (props) => {
  const { uploadWorked, onSubmit } = props;

  const successText = (
    <div>
      <p>Your data was successfully uploaded! </p>
      <p></p>
      <p>Press &quot;Continue&quot; to continue the experiment.</p>
    </div>
  );

  const failureText = (
    <div>
      <p>
        Your data did not upload properly. Don&apos;t worry! Once the experiment
        is over, you will download and email your data to the experimenters.
      </p>
      <p>Press &quot;Continue&quot; to continue the experiment.</p>
    </div>
  );

  const inProgress = (
    <div>
      <Spinner animation="border" />
      <p></p>
    </div>
  );

  function handleClick() {
    onSubmit();
  }

  function UploadStatusText() {
    if (uploadWorked === 'true') {
      return <div>{successText}</div>;
    } else if (uploadWorked === 'not_complete') {
      return <div>{inProgress}</div>;
    } else {
      return <div>{failureText}</div>;
    }
  }

  return (
    <Container fluid>
      <div>
        <UploadStatusText />

        <Button onClick={handleClick} variant="outline-success">
          Continue
        </Button>
      </div>
    </Container>
  );
};

export default DataLogger;
