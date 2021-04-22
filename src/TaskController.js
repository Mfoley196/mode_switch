import React, { useState } from 'react';
import Canvas from './Canvas';
import createS3Uploader from './createS3Uploader';
import DataLogger from './DataLogger';

const NUM_OF_CIRCS = 7;
const CANVAS_Y = 800;

const TaskController = (props) => {
  const {
    dispatch,
    stage,
    timeline,
    timelineIndex,
    pNo,
    expLog,
    setExpLog,
    blockLog,
    setBlockLog,
    fileUploadError,
    setUploadError,
  } = props;
  const [path, setPath] = useState(
    generatePath(NUM_OF_CIRCS, stage['startPos']),
  );

  const [currPathIndex, setCurrIndex] = useState(0);
  const [targetId, setTargetId] = useState(path[currPathIndex][1]);
  const [tokenId, setTokenId] = useState(path[currPathIndex][0]);
  const [circles, setCircles] = useState(
    initCircles(NUM_OF_CIRCS, 45, path, stage),
  );
  const [eventList, setEventList] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [uploadWorked, setUploadStatus] = useState('not_complete');
  const [missCount, setMissCount] = useState(0);

  let upload = createS3Uploader(
    'ca-central-1',
    'ca-central-1:297440ee-2e98-4761-9bfe-3e4a60448cbb',
    'nextpc-modeswitch1',
  );

  function createTrialLog(currMode, eventList, missC) {
    let logObj = {
      pNo: pNo,
      condition: stage['conds'][0] + ',' + stage['conds'][1],
      currMode: currMode,
      taskType: stage['stage'],
      block: stage['block'],
      circRadius: circles[0].r,
      trialNo: currPathIndex,
      targetId: path[currPathIndex][1],
      tokenId: path[currPathIndex][0],
      screenWidth: window.screen.width,
      screenHeight: window.screen.height,
      scale: window.devicePixelRatio,
      missCount: missC,
      rawLog: eventList,
      //error/not error
    };

    return logObj;
  }

  function addToBlockLog(currMode, eventList, missC) {
    let newLog = createTrialLog(currMode, eventList, missC);
    setBlockLog((prevLog) => [...prevLog, newLog]);

    let keyName =
      newLog.pNo +
      '_' +
      newLog.taskType +
      '_' +
      stage['conds'][0] +
      '-' +
      stage['conds'][1] +
      '_B' +
      newLog.block;

    setExpLog({
      ...expLog,
      [keyName]: blockLog,
    });
  }

  function uploadToBucket(uploadLog) {
    let fileName =
      uploadLog[0].pNo +
      '_' +
      uploadLog[0].taskType +
      '_' +
      stage['conds'][0] +
      '-' +
      stage['conds'][1] +
      '_B' +
      uploadLog[0].block +
      '.txt';

    let isMounted = true;

    // let blah = { foo: 'bar' };
    upload(fileName, uploadLog)
      .then(function (response) {
        // eslint-disable-next-line no-console
        console.log('file upload worked');
        // eslint-disable-next-line no-console
        console.log(response);

        if (isMounted) {
          setUploadStatus('true');
        }
      })
      .catch((error) => {
        // eslint-disable-next-line no-console
        console.error('error', error);

        //if error, yeet into local storage w. filename key
        if (!fileUploadError) {
          setUploadError(true);
        }

        localStorage.setItem(fileName, JSON.stringify(uploadLog));

        setUploadStatus('false');
      });

    return () => {
      isMounted = false;
    };
  }

  function advanceTrial(pathIndex, currMode, eventList, missC) {
    if (pathIndex + 1 >= path.length) {
      addToBlockLog(currMode, eventList, missC);
      setUploading(true);

      let temp = JSON.parse(JSON.stringify(blockLog));
      let tempLog = createTrialLog(currMode, eventList);
      uploadToBucket([...temp, tempLog]);

      setEventList([]);
      setMissCount(0);
      setCurrIndex(0);
      setBlockLog([]);
      setMissCount(0);
    } else {
      let circlesCopy = JSON.parse(JSON.stringify(circles));

      for (let i = 0; i < circlesCopy.length; i++) {
        circlesCopy[i].x = circlesCopy[i].oldx;
        circlesCopy[i].y = circlesCopy[i].oldy;
        circlesCopy[i].dragOn = false;
        circlesCopy[i].mode =
          stage['conds'][0] === currMode
            ? stage['conds'][1]
            : stage['conds'][0];

        circlesCopy[i].isTarget = i === path[pathIndex + 1][1] ? true : false;
        circlesCopy[i].isToken = path[pathIndex + 1][0] === i ? true : false;

        if (i === circlesCopy.length - 1) {
          circlesCopy[i].isVisible = false;
        }
      }

      setCircles(circlesCopy);

      addToBlockLog(currMode, eventList, missC);

      setEventList([]);
      setMissCount(0);
      setCurrIndex(pathIndex + 1);
      setTokenId(path[pathIndex + 1][0]);
      setTargetId(path[pathIndex + 1][1]);
    }
  }

  function activateCenter() {
    let circlesCopy = circles.slice();

    for (let i = 0; i < circlesCopy.length; i++) {
      circlesCopy[i].x = circlesCopy[i].oldx;
      circlesCopy[i].y = circlesCopy[i].oldy;
      circlesCopy[i].dragOn = false;

      circlesCopy[i].isTarget = i === circles.length - 1 ? true : false;
      circlesCopy[i].isToken = false;
      circlesCopy[i].isVisible = true;
    }

    setCircles(circlesCopy);
    setTargetId(circles.length - 1);
  }

  return (
    (!uploading && (
      <Canvas
        circles={circles}
        setCircles={setCircles}
        path={path}
        currPathIndex={currPathIndex}
        targetId={targetId}
        tokenId={tokenId}
        advanceTrial={advanceTrial}
        activateCenter={activateCenter}
        stage={stage}
        eventList={eventList}
        setEventList={setEventList}
        missCount={missCount}
        setMissCount={setMissCount}
        canvasY={CANVAS_Y}
      />
    )) ||
    (uploading && (
      <DataLogger
        uploadWorked={uploadWorked}
        onSubmit={() => {
          setUploading(false);
          let newPath = generatePath(
            NUM_OF_CIRCS,
            timeline[timelineIndex + 1]['startPos'],
          );
          setPath(newPath);
          setCircles(
            initCircles(NUM_OF_CIRCS, 45, newPath, timeline[timelineIndex + 1]),
          );
          setTokenId(newPath[0][0]);
          setTargetId(newPath[0][1]);
          dispatch({ type: 'next' });
        }}
      />
    ))
  );
};

function initCircles(numCircs, radius, path, stage) {
  let circs = [];
  let angle = 0;
  let largeRad = 500 / 2;
  let step = (2 * Math.PI) / numCircs;

  for (let i = 0; i < numCircs; i++) {
    let x = Math.round(window.innerWidth / 2 + largeRad * Math.cos(angle));
    let y = Math.round(CANVAS_Y / 2 + largeRad * Math.sin(angle));
    let fill = '#FFFF00';
    let mode = stage['conds'][1];

    let circle = {
      id: i,
      x: x,
      y: y,
      oldx: x,
      oldy: y,
      r: radius,
      fill: fill,
      dragOn: false,
      isTarget: path[0][1] === i ? true : false,
      isToken: path[0][0] === i ? true : false,
      isVisible: true,
      mode: mode,
      isCenter: false,
    };
    circs.push(circle);
    angle += step;
  }

  let center = {
    id: numCircs,
    x: window.innerWidth / 2,
    y: CANVAS_Y / 2,
    oldx: window.innerWidth / 2,
    oldy: CANVAS_Y / 2,
    r: radius,
    fill: '#FFFF00',
    dragOn: false,
    isTarget: false,
    isToken: false,
    isVisible: false,
    mode: stage['conds'][1],
    isCenter: true,
  };

  circs.push(center);

  return circs;
}

function generatePath(numCircs, startPos) {
  let step = Math.floor(numCircs / 2);
  let target = startPos;
  let path = [];

  for (let i = 0; i < numCircs * 2; i++) {
    path.push([target % numCircs, (target + step) % numCircs]);
    target += step;
  }

  return path;
}

export default TaskController;
