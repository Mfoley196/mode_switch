import React from 'react';
import createS3Uploader from './createS3Uploader';
import Button from 'react-bootstrap/Button';
import Spinner from 'react-bootstrap/Spinner';
import Container from 'react-bootstrap/Container';

const DataLogger = (props) => {
  const { uploadWorked, onSubmit, ...rest } = props;

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

  function handleClick() {
    onSubmit();
  }

  function UploadStatusText() {
    if (uploadWorked) {
      return <div>{successText}</div>;
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
