import React from 'react';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Spinner from 'react-bootstrap/Spinner';

const DataLogger = (props) => {
  const { uploadWorked, onSubmit } = props;

  const successText = (
    <div>
      <p>Your experiment log was successfully uploaded! </p>
      <p></p>
      <p>Press &quot;Continue&quot; to continue the experiment.</p>
      <p></p>
      <Button onClick={handleClick} variant="outline-success">
        Continue
      </Button>
    </div>
  );

  const failureText = (
    <div>
      <p>
        Your experiment log did not upload properly. Don&apos;t worry! Once the
        experiment is over, you will download and email your experiment data to
        the experimenters.
      </p>
      <p>Press &quot;Continue&quot; to continue the experiment.</p>
      <p></p>
      <Button onClick={handleClick} variant="outline-success">
        Continue
      </Button>
    </div>
  );

  const inProgress = (
    <div>
      <p></p>
      <p></p>
      <Spinner animation="border" />
      <p></p>
      Uploading experiment log...
      <p></p>
    </div>
  );

  function handleClick() {
    onSubmit();
  }

  function UploadStatus() {
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
        <UploadStatus />
      </div>
    </Container>
  );
};

export default DataLogger;
