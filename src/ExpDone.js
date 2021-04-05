import React from 'react';
import createS3Uploader from './createS3Uploader';
import { saveAs } from 'file-saver';
import Button from 'react-bootstrap/Button';
import JSZip from 'jszip';

const ExpDone = (props) => {
  const { fileUploadError, pNo } = props;

  function addFilesToZip(zipObj) {
    // const items = { ...localStorage };

    // for (var item in items) {
    //   if (item.startsWith(pNo)) {
    //     zip.file(item, items[item]);
    //   }
    // }
  }

  function handleClick() {
    let zip = new JSZip();

    const items = { ...localStorage };

    for (var item in items) {
      if (item.startsWith(pNo)) {
        zip.file(item, items[item]);
      }
    }

    zip.generateAsync({ type: 'blob' }).then(function (content) {
      saveAs(content, 'example.zip');
    });
  }

  function FileDownloadText() {
    if (fileUploadError) {
      return (
        <div>
          <p>
            {' '}
            One of more of your logs failed to upload. Please click the
            &quot;Download All Logs&quot; button to download your logs as a ZIP
            file, and email them to mjfoley@uwaterloo.ca.{' '}
          </p>
          <p></p>

          <Button onClick={handleClick} variant="outline-primary">
            Download All Logs
          </Button>
          <p></p>
        </div>
      );
    } else {
      return <div></div>;
    }
  }

  return (
    <div>
      <p>You have finished the experiment!</p>

      <FileDownloadText />

      <p>
        To receive your remuneration, please email mjfoley@uwaterloo.ca or
        message the experimenters to say you have finished the experiment.
      </p>
    </div>
  );
};

export default ExpDone;
