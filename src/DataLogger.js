import React, { useEffect } from 'react';
import createS3Uploader from './createS3Uploader';

const DataLogger = (props) => {
  const { expLog, setExpLog, blockLog, setBlockLog, ...rest } = props;

  let upload = createS3Uploader(
    'ca-central-1',
    'ca-central-1:297440ee-2e98-4761-9bfe-3e4a60448cbb',
    'nextpc-modeswitch1',
  );

  useEffect(() => {
    console.log(blockLog);
    let keyName = 'default';
    if (blockLog.length > 0) {
      keyName =
        blockLog[0].pNo +
        '_' +
        blockLog[0].taskType +
        '_' +
        blockLog[0].condition +
        '_' +
        blockLog[0].block;

      setExpLog({
        ...expLog,
        [keyName]: blockLog,
      });
    }
  }, [blockLog]);

  useEffect(() => {
    console.log(expLog);
  }, [expLog]);

  return <div></div>;
};

export default DataLogger;
