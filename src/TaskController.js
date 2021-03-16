import React from 'react';
import Canvas from './Canvas';

function initCircles(numCircs, radius, path, stage) {
  let circs = [];
  let angle = 0;
  let largeRad = 700 / 2;
  let step = (2 * Math.PI) / numCircs;

  for (let i = 0; i < numCircs; i++) {
    let x = Math.round(1024 / 2 + (radius + largeRad) * Math.cos(angle));
    let y = Math.round(800 / 2 + (radius + largeRad) * Math.sin(angle));
    let fill = '#FFFF00';
    let mode = stage[1];

    // if (i === 1 || i === 2) {
    //   mode = "pen"
    // }

    // if (i === 10 || i === 9) {
    //   mode = "mouse"
    // }

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
      //isVisible: (path[0][1] === i || path[0][0] === i ? true: false),
      mode: mode,
    };
    circs.push(circle);
    angle += step;
  }

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

const NUM_OF_CIRCS = 7;

const TaskController = (props) => {
  const { dispatch, timeline, stage, setLog } = props;
  const [path, setPath] = React.useState(generatePath(NUM_OF_CIRCS, 0));
  const [currPathIndex, setCurrIndex] = React.useState(0);
  const [targetId, setTargetId] = React.useState(path[currPathIndex][1]);
  const [circles, setCircles] = React.useState(
    initCircles(NUM_OF_CIRCS, 20, path, stage),
  );
  const [eventList, setEventList] = React.useState([]);

  // useEffect(() => {
  //     setTargetId(path[currPathIndex][1])
  // }, [currPathIndex]);

  function createTrialLog() {
    let logObj = {
      //participantNo
      //block name (stage[1] + "," stage[2])
      //baseline/not baseline
      //currPathIndex
      //path
      //targetId (path[currPathIndex][1])
      //tokenId (path[currPathIndex][0])
      //circle mode
      //eventList
      //error/not error
    };
  }

  function advanceTrial(pathIndex, currMode) {
    // console.log(path[currPathIndex]);
    //console.log(pathIndex + 1)
    //console.log(path.length)

    if (pathIndex + 1 >= path.length) {
      setCurrIndex(0);
      dispatch({ type: 'next', timeline: timeline });
    } else {
      setCurrIndex(pathIndex + 1);
      setTargetId(path[pathIndex + 1][1]);
      let circlesCopy = circles.slice();

      for (let i = 0; i < circlesCopy.length; i++) {
        circlesCopy[i].x = circlesCopy[i].oldx;
        circlesCopy[i].y = circlesCopy[i].oldy;
        circlesCopy[i].dragOn = false;
        circlesCopy[i].mode = stage[1] === currMode ? stage[2] : stage[1];

        circlesCopy[i].isTarget = i === path[pathIndex + 1][1] ? true : false;
        circlesCopy[i].isToken = path[pathIndex + 1][0] === i ? true : false;
        //circlesCopy[i].isVisible = (path[pathIndex + 1][1] === i || path[pathIndex + 1][0] === i ? true: false);
      }

      setCircles(circlesCopy);
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
      stage={stage}
      eventList={eventList}
      setEventList={setEventList}
    />
  );
};

export default TaskController;
