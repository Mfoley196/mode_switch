import React from 'react';
import Canvas from './Canvas';

const NUM_OF_CIRCS = 5;

const TaskController = (props) => {
  const {
    dispatch,
    stage,
    pNo,
    expLog,
    setExpLog,
    blockLog,
    setBlockLog,
  } = props;
  const [path, setPath] = React.useState(
    generatePath(NUM_OF_CIRCS, stage['startPos']),
  );
  const [currPathIndex, setCurrIndex] = React.useState(0);
  const [targetId, setTargetId] = React.useState(path[currPathIndex][1]);
  const [circles, setCircles] = React.useState(
    initCircles(NUM_OF_CIRCS, 20, path, stage),
  );
  const [eventList, setEventList] = React.useState([]);

  function createTrialLog(currMode, eventList) {
    let logObj = {
      pNo: pNo,
      condition: stage['conds'][0] + ',' + stage['conds'][1],
      currMode: currMode,
      taskType: stage['stage'],
      block: stage['block'],
      currPathIndex: currPathIndex,
      path: path,
      targetId: path[currPathIndex][1],
      tokenId: path[currPathIndex[0]],
      rawLog: eventList,
      //X participantNo
      //X block name (stage[1] + "," stage[2])
      //X baseline/not baseline
      //X currPathIndex
      //X path
      //X targetId (path[currPathIndex][1])
      //X tokenId (path[currPathIndex][0])
      //X circle mode
      //X eventList
      //error/not error
    };

    return logObj;
  }

  function activateCenter() {
    let circlesCopy = circles.slice();

    for (let i = 0; i < circlesCopy.length; i++) {
      circlesCopy[i].x = circlesCopy[i].oldx;
      circlesCopy[i].y = circlesCopy[i].oldy;
      circlesCopy[i].dragOn = false;

      circlesCopy[i].isTarget = i === circles.length - 1 ? true : false;
      circlesCopy[i].isToken = i === targetId ? true : false;
    }

    setCircles(circlesCopy);
  }

  function advanceTrial(pathIndex, currMode, eventList) {
    if (pathIndex + 1 >= path.length) {
      setCurrIndex(0);
      dispatch({ type: 'next' });
    } else {
      setCurrIndex(pathIndex + 1);
      setTargetId(path[pathIndex + 1][1]);
      let circlesCopy = circles.slice();

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
        //circlesCopy[i].isVisible = (path[pathIndex + 1][1] === i || path[pathIndex + 1][0] === i ? true: false);
      }

      setCircles(circlesCopy);

      let newLog = createTrialLog(currMode, eventList);
      setBlockLog((prevLog) => [...prevLog, newLog]);
    }
  }

  return (
    <Canvas
      circles={circles}
      setCircles={setCircles}
      path={path}
      currPathIndex={currPathIndex}
      targetId={targetId}
      advanceTrial={advanceTrial}
      activateCenter={activateCenter}
      stage={stage}
      eventList={eventList}
      setEventList={setEventList}
    />
  );
};

function initCircles(numCircs, radius, path, stage) {
  let circs = [];
  let angle = 0;
  let largeRad = 500 / 2;
  let step = (2 * Math.PI) / numCircs;

  for (let i = 0; i < numCircs; i++) {
    let x = Math.round(1024 / 2 + largeRad * Math.cos(angle));
    let y = Math.round(800 / 2 + largeRad * Math.sin(angle));
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
      mode: mode,
      isCenter: false,
    };
    circs.push(circle);
    angle += step;
  }

  let centerX = circs[0].x;

  let center = {
    id: numCircs,
    x: 1024 / 2,
    y: 800 / 2,
    oldx: 1024 / 2,
    oldy: 800 / 2,
    r: radius,
    fill: '#FFFF00',
    dragOn: false,
    isTarget: false,
    isToken: false,
    mode: stage['conds'][1],
    isCenter: true,
  };

  circs.push(center);

  //console.log(circs);
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
  //console.log(path);

  return path;
}

export default TaskController;
