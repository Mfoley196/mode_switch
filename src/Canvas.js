import React, { useEffect, useCallback } from 'react';
import style from './Canvas.module.css';
import useCanvas from './hooks/useCanvas';
import usePreventDefault from './hooks/usePreventDefault';
import _ from 'lodash';

const PEN_COLOR = '#FFFF00';
const PEN_DRAG_COLOR = '#999900';
const PEN_HIT_COLOR = '#FFFF99';

const MOUSE_COLOR = '#00FFFF';
const MOUSE_DRAG_COLOR = '#009999';
const MOUSE_HIT_COLOR = '#99FFFF';

const TOUCH_COLOR = '#FF4000';
const TOUCH_DRAG_COLOR = '#992600';
const TOUCH_HIT_COLOR = '#ff8c66';

const TRACK_COLOR = '#FF00FF';
const TRACK_DRAG_COLOR = '#990099';
const TRACK_HIT_COLOR = '#FF99FF';

const interval = 300;
const tolerance = 0.45;

const Canvas = (props) => {
  const {
    circles,
    setCircles,
    path,
    currPathIndex,
    targetId,
    tokenId,
    advanceTrial,
    activateCenter,
    stage,
    eventList,
    setEventList,
    missCount,
    setMissCount,
    canvasY,
    numOfTasks,
    taskIndex,
    ...rest
  } = props;

  const [mouseX, setMouseX] = React.useState(0);
  const [mouseY, setMouseY] = React.useState(0);
  const [xDiff, setXDiff] = React.useState(0);
  const [yDiff, setYDiff] = React.useState(0);
  const [errorFlag, setErrorFlag] = React.useState(false);

  const throttledAppend = useCallback(
    _.throttle((log) => appendToEventList(log), 100),
    [],
  );

  useEffect(() => {
    if (errorFlag) {
      let timeoutId = setTimeout(clearErrorFlag, interval);
      return () => clearTimeout(timeoutId);
    }
  }, [errorFlag]);

  function clearErrorFlag() {
    setErrorFlag(false);
  }

  const appendToEventList = (event) => {
    setEventList((prevList) => [...prevList, event]);
  };

  function getFillColor(input) {
    switch (input) {
      case 'pen':
        return PEN_COLOR;
      case 'touch':
        return TOUCH_COLOR;
      case 'mouse':
        return MOUSE_COLOR;
      case 'trackpad':
        return TRACK_COLOR;
      default:
        return 'white';
    }
  }

  function getDragColor(input) {
    switch (input) {
      case 'pen':
        return PEN_DRAG_COLOR;
      case 'touch':
        return TOUCH_DRAG_COLOR;
      case 'mouse':
        return MOUSE_DRAG_COLOR;
      case 'trackpad':
        return TRACK_DRAG_COLOR;
      default:
        return 'white';
    }
  }

  function getHitColor(input) {
    switch (input) {
      case 'pen':
        return PEN_HIT_COLOR;
      case 'touch':
        return TOUCH_HIT_COLOR;
      case 'mouse':
        return MOUSE_HIT_COLOR;
      case 'trackpad':
        return TRACK_HIT_COLOR;
      default:
        return 'white';
    }
  }

  const draw = (ctx) => {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    if (!errorFlag) {
      ctx.fillStyle = '#000000';
    } else {
      ctx.fillStyle = '#EE0000';
    }

    ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);

    ctx.font = '40px Arial';

    let textColor1 = getFillColor(stage['conds'][0]);
    let textColor2 = getFillColor(stage['conds'][1]);

    ctx.fillStyle = textColor1;
    if (stage['stage'] === 'baseline') {
      ctx.fillText(capitalize(stage['conds'][0]), 10, 40);
    } else {
      ctx.fillText(capitalize(stage['conds'][0]), 10, 40);

      ctx.fillStyle = 'white';
      ctx.fillText(', ', 175, 40);

      ctx.fillStyle = textColor2;
      ctx.fillText(capitalize(stage['conds'][1]), 195, 40);
    }

    ctx.fillStyle = 'white';
    ctx.fillText('Task: ' + taskIndex + '/' + numOfTasks, 10, 80);
    ctx.fillText('Block: ' + stage['block'], 10, 120);
    ctx.fillText('Trial: ' + (currPathIndex + 1) + '/' + path.length, 10, 160);

    //draw targets
    for (let i = 0; i < circles.length; i++) {
      if (circles[i].dragOn) {
        //if a circle is being dragged
        circles[i].x = mouseX - xDiff;
        circles[i].y = mouseY - yDiff;

        //if the dragged circle is on the target
        if (
          circleHitTest(
            circles[targetId].x,
            circles[targetId].y,
            circles[i].x,
            circles[i].y,
            circles[i].r * tolerance,
          )
        ) {
          circles[i].fill = getHitColor(circles[i].mode);
        } else {
          //if circle is being dragged
          circles[i].fill = getDragColor(circles[i].mode);
        }
      } else if (circles[i].isTarget) {
        //target color
        //if token is docked on target & target is not center
        if (
          circleHitTest(
            circles[i].x,
            circles[i].y,
            circles[tokenId].x,
            circles[tokenId].y,
            circles[tokenId].r * tolerance,
          )
        ) {
          circles[i].fill = getHitColor(circles[i].mode);
        } else if (
          circleHitTest(
            mouseX,
            mouseY,
            circles[i].x,
            circles[i].y,
            circles[i].r,
          ) &&
          circles[i].isCenter &&
          circles[i].isTarget
        ) {
          circles[i].fill = getDragColor(circles[i].mode);
        } else {
          //otherwise, set to default color
          circles[i].fill = getFillColor(circles[i].mode);
        }
      } else if (circles[i].isToken) {
        circles[i].fill = getFillColor(circles[i].mode);
      } else {
        circles[i].fill = '#333333';
      }

      if (circles[i].isVisible) {
        drawCircle(
          ctx,
          circles[i].x,
          circles[i].y,
          circles[i].r,
          circles[i].fill,
          circles[i].isTarget,
          circles[i].isCenter,
        );
      }
    }
  };

  const canvasRef = useCanvas(draw);

  const pointerHandler = (e) => {
    setMouseX(e.clientX);
    setMouseY(e.clientY);

    throttledAppend([
      Date.now(),
      'move',
      'null',
      e.pointerType,
      e.clientX,
      e.clientY,
      e.pressure.toFixed(2),
      e.tiltX,
      e.tiltY,
    ]);

    // appendToEventList([
    //   Date.now(),
    //   'move',
    //   'null',
    //   e.pointerType,
    //   e.clientX,
    //   e.clientY,
    //   e.pressure.toFixed(2),
    //   e.tiltX,
    //   e.tiltY,
    // ]);
  };

  const mouseHandler = (e) => {
    setMouseX(e.clientX);
    setMouseY(e.clientY);

    throttledAppend([
      Date.now(),
      'move',
      'null',
      'mouse',
      e.clientX,
      e.clientY,
      0,
      0,
      0,
    ]);

    // appendToEventList([
    //   Date.now(),
    //   'move',
    //   'null',
    //   'mouse',
    //   e.clientX,
    //   e.clientY,
    //   e.pressure.toFixed(2),
    //   e.tiltX,
    //   e.tiltY,
    // ]);
  };

  const pointerDownHandler = (e) => {
    e.preventDefault();

    appendToEventList([
      Date.now(),
      'down',
      'null',
      e.pointerType,
      e.clientX,
      e.clientY,
      e.pressure.toFixed(2),
      e.tiltX,
      e.tiltY,
    ]);

    if (
      circleHitTest(
        e.clientX,
        e.clientY,
        circles[tokenId].x,
        circles[tokenId].y,
        circles[tokenId].r,
      ) &&
      (e.pointerType === circles[tokenId].mode ||
        (e.pointerType === 'mouse' && circles[tokenId].mode === 'trackpad'))
    ) {
      setXDiff(e.clientX - circles[tokenId].x);
      setYDiff(e.clientY - circles[tokenId].y);
      setMouseX(e.clientX);
      setMouseY(e.clientY);
      // setMouseX(e.clientX - (e.clientX - circles[tokenId].x));
      // setMouseY(e.clientY - (e.clientY - circles[tokenId].y));

      setCircles(
        circles.map((circle) => {
          return {
            ...circle,
            dragOn: circle.id === tokenId,
          };
        }),
      );

      appendToEventList([
        Date.now(),
        'token',
        tokenId,
        e.pointerType,
        e.clientX,
        e.clientY,
        e.pressure.toFixed(2),
        e.tiltX,
        e.tiltY,
      ]);
    } else if (
      !circleHitTest(
        e.clientX,
        e.clientY,
        circles[tokenId].x,
        circles[tokenId].y,
        circles[tokenId].r,
      ) &&
      !circleHitTest(
        e.clientX,
        e.clientY,
        circles[circles.length - 1].x,
        circles[circles.length - 1].y,
        circles[circles.length - 1].r,
      )
    ) {
      appendToEventList([
        Date.now(),
        'miss',
        'null',
        e.pointerType,
        e.clientX,
        e.clientY,
        e.pressure.toFixed(2),
        e.tiltX,
        e.tiltY,
      ]);
      setErrorFlag(true);
      setMissCount(missCount + 1);
    }
  };

  const mouseDownHandler = (e) => {
    e.preventDefault();

    appendToEventList([
      Date.now(),
      'down',
      'null',
      'mouse',
      e.clientX,
      e.clientY,
      0,
      0,
      0,
    ]);

    if (
      circleHitTest(
        e.clientX,
        e.clientY,
        circles[tokenId].x,
        circles[tokenId].y,
        circles[tokenId].r,
      ) &&
      (circles[tokenId].mode === 'mouse' ||
        circles[tokenId].mode === 'trackpad')
    ) {
      setXDiff(e.clientX - circles[tokenId].x);
      setYDiff(e.clientY - circles[tokenId].y);
      setMouseX(e.clientX);
      setMouseY(e.clientY);

      setCircles(
        circles.map((circle) => {
          return {
            ...circle,
            dragOn: circle.id === tokenId,
          };
        }),
      );
      appendToEventList([
        Date.now(),
        'token',
        tokenId,
        'mouse',
        e.clientX,
        e.clientY,
        0,
        0,
        0,
      ]);
    } else if (
      !circleHitTest(
        e.clientX,
        e.clientY,
        circles[tokenId].x,
        circles[tokenId].y,
        circles[tokenId].r,
      ) &&
      !circleHitTest(
        e.clientX,
        e.clientY,
        circles[circles.length - 1].x,
        circles[circles.length - 1].y,
        circles[circles.length - 1].r,
      )
    ) {
      appendToEventList([
        Date.now(),
        'miss',
        'null',
        'mouse',
        e.clientX,
        e.clientY,
        0,
        0,
        0,
      ]);
      setErrorFlag(true);
      setMissCount(missCount + 1);
    }
  };

  const pointerUpHandler = (e) => {
    e.preventDefault();
    setXDiff(0);
    setYDiff(0);

    if (typeof e.pointerType !== 'undefined') {
      appendToEventList([
        Date.now(),
        'up',
        'null',
        e.pointerType,
        e.clientX,
        e.clientY,
        e.pressure.toFixed(2),
        e.tiltX,
        e.tiltY,
      ]);
    } else {
      appendToEventList([
        Date.now(),
        'up',
        'null',
        'mouse',
        e.clientX,
        e.clientY,
        0.0,
        0,
        0,
      ]);
    }

    if (circles[tokenId].dragOn) {
      if (typeof e.pointerType !== 'undefined') {
        appendToEventList([
          Date.now(),
          'release',
          tokenId,
          e.pointerType,
          e.clientX,
          e.clientY,
          e.pressure.toFixed(2),
          e.tiltX,
          e.tiltY,
        ]);
      } else {
        appendToEventList([
          Date.now(),
          'release',
          tokenId,
          'mouse',
          e.clientX,
          e.clientY,
          0.0,
          0,
          0,
        ]);
      }
    }

    setCircles(
      circles.map((circle) => {
        return {
          ...circle,
          dragOn: false,
        };
      }),
    );

    if (
      circleHitTest(
        circles[tokenId].x,
        circles[tokenId].y,
        circles[targetId].x,
        circles[targetId].y,
        circles[targetId].r * tolerance,
      ) &&
      (circles[circles.length - 1].mode === e.pointerType ||
        circles[circles.length - 1].mode === 'mouse' ||
        circles[circles.length - 1].mode === 'trackpad') &&
      circles[targetId].isTarget
    ) {
      if (typeof e.pointerType !== 'undefined') {
        appendToEventList([
          Date.now(),
          'hit_target',
          targetId,
          e.pointerType,
          e.clientX,
          e.clientY,
          e.pressure.toFixed(2),
          e.tiltX,
          e.tiltY,
        ]);
      } else {
        appendToEventList([
          Date.now(),
          'hit_target',
          targetId,
          'mouse',
          e.clientX,
          e.clientY,
          0.0,
          0,
          0,
        ]);
      }

      activateCenter();
    } else if (
      circleHitTest(
        e.clientX,
        e.clientY,
        circles[circles.length - 1].x,
        circles[circles.length - 1].y,
        circles[circles.length - 1].r,
      ) &&
      (circles[circles.length - 1].mode === e.pointerType ||
        circles[circles.length - 1].mode === 'mouse' ||
        circles[circles.length - 1].mode === 'trackpad') &&
      circles[circles.length - 1].isTarget
    ) {
      if (typeof e.pointerType !== 'undefined') {
        appendToEventList([
          Date.now(),
          'hit_center',
          circles.length - 1,
          e.pointerType,
          e.clientX,
          e.clientY,
          e.pressure.toFixed(2),
          e.tiltX,
          e.tiltY,
        ]);
      } else {
        appendToEventList([
          Date.now(),
          'hit_center',
          circles.length - 1,
          'mouse',
          e.clientX,
          e.clientY,
          0.0,
          0,
          0,
        ]);
      }

      advanceTrial(currPathIndex, circles[tokenId].mode, eventList, missCount);
    } else {
      if (
        circles[tokenId].dragOn &&
        !circleHitTest(
          e.clientX,
          e.clientY,
          circles[targetId].x,
          circles[targetId].y,
          circles[targetId].r * tolerance,
        ) &&
        !circleHitTest(
          e.clientX,
          e.clientY,
          circles[circles.length - 1].x,
          circles[circles.length - 1].y,
          circles[circles.length - 1].r,
        )
      ) {
        if (typeof e.pointerType !== 'undefined') {
          appendToEventList([
            Date.now(),
            'miss',
            'null',
            e.pointerType,
            e.clientX,
            e.clientY,
            e.pressure.toFixed(2),
            e.tiltX,
            e.tiltY,
          ]);
        } else {
          appendToEventList([
            Date.now(),
            'miss',
            'null',
            e.pointerType,
            e.clientX,
            e.clientY,
            0.0,
            0,
            0,
          ]);
        }

        setErrorFlag(true);
        setMissCount(missCount + 1);
      }
    }
  };

  return (
    <div ref={usePreventDefault()}>
      <canvas
        className={style.canvas}
        ref={canvasRef}
        onPointerMove={pointerHandler}
        onMouseMove={mouseHandler}
        onPointerDown={pointerDownHandler}
        onMouseDown={mouseDownHandler}
        onMouseUp={pointerUpHandler}
        onPointerUp={pointerUpHandler}
        width={window.innerWidth}
        height={canvasY.toString() + 'px'}
        {...rest}
      />
    </div>
  );
};

function drawCircle(ctx, x, y, radius, fill, targetOn, isCenter) {
  let rad = targetOn && !isCenter ? radius * 1.5 : radius;
  //ctx.strokeStyle = targetOn && !isCenter ? '#00EE00' : fill;
  ctx.strokeStyle = fill;
  ctx.lineWidth = 2;

  if (targetOn && !isCenter) {
    ctx.setLineDash([10, 10]);
  } else {
    ctx.setLineDash([]);
  }

  if (!targetOn || isCenter) {
    ctx.fillStyle = fill;
  }

  ctx.beginPath();
  ctx.ellipse(x, y, rad, rad, 0, 0, 2 * Math.PI);

  if (!targetOn || isCenter) {
    ctx.fill();
  }

  ctx.stroke();

  if (isCenter) {
    ctx.setLineDash([10, 10]);
    ctx.beginPath();
    ctx.ellipse(x, y, rad * 1.15, rad * 1.15, 0, 0, 2 * Math.PI);
    ctx.stroke();
    ctx.setLineDash([]);
  }
}

function circleHitTest(pX, pY, cX, cY, radius) {
  // calculate distance from pX, pY  to centre of circle
  let d = myDist(pX, pY, cX, cY);

  // if it's less than radius, we have a hit
  if (d <= radius) {
    return true;
  } else {
    return false;
  }
}

function myDist(pX, pY, qX, qY) {
  let a = pY - qY; // y difference
  let b = pX - qX; // x difference
  let c = Math.sqrt(a * a + b * b);
  return c;
}

function capitalize(s) {
  return s[0].toUpperCase() + s.slice(1);
}

export default Canvas;

//prevent default
