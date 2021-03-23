import React from 'react';
import createS3Uploader from './createS3Uploader';

const DataLogger = (props) => {

  const {expLog, setExpLog, ...rest} = props

  let upload = createS3Uploader(
    'ca-central-1',
    'ca-central-1:297440ee-2e98-4761-9bfe-3e4a60448cbb',
    'nextpc-modeswitch1',
  );


  return <div></div>;
};

export default DataLogger;
