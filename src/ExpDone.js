import React, { useState, useEffect } from 'react';
import createS3Uploader from './createS3Uploader';
import { saveAs } from 'file-saver';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import JSZip from 'jszip';

const ExpDone = (props) => {
  const { fileUploadError, pNo } = props;
  const [zipFile, setZipFile] = useState();
  const [url, setURL] = useState('');

  useEffect(() => {
    let zip = new JSZip();

    const items = { ...localStorage };

    for (var item in items) {
      if (item.startsWith(pNo)) {
        zip.file(item, items[item]);
      }
    }

    zip.generateAsync({ type: 'blob' }).then(function (content) {
      //saveAs(content, 'example.zip');
      setZipFile(content);
      setURL(window.URL.createObjectURL(content));
    });
  }, []);

  function handleClick() {
    console.log(zipFile);
    console.log(url);
  }

  function FileDownloadText() {
    if (fileUploadError) {
      return (
        <div>
          <p>
            {' '}
            One of more of your logs failed to upload. Please click the
            &quot;Download All Logs&quot; link below to download your logs as a
            ZIP file, and email them to mjfoley@uwaterloo.ca.{' '}
          </p>
          <p></p>

          <a download={`${pNo}_logs.zip`} href={url}>
            Download All Logs
          </a>
          <p></p>
        </div>
      );
    } else {
      return <div></div>;
    }
  }

  return (
    <Container fluid>
      <div>
        <p>You have finished the experiment!</p>

        <FileDownloadText />

        <p>
          To receive your remuneration, please email mjfoley@uwaterloo.ca or
          message the experimenters to say you have finished the experiment.
        </p>
      </div>
    </Container>
  );
};

export default ExpDone;
