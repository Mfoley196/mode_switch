import React, { useEffect } from 'react';
import style from './Canvas.module.css';
import useCanvas from './hooks/useCanvas';
import usePreventDefault from './hooks/usePreventDefault';

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
const tolerance = 0.25;

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
    ...rest
  } = props;

  const [mouseX, setMouseX] = React.useState(0);
  const [mouseY, setMouseY] = React.useState(0);
  const [errorFlag, setErrorFlag] = React.useState(false);

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
    ctx.fillText('Block: ' + stage['block'], 10, 80);
    ctx.fillText(currPathIndex + 1 + '/' + path.length, 10, 120);

    //draw targets
    for (let i = 0; i < circles.length; i++) {
      if (circles[i].dragOn) {
        //if a circle is being dragged
        circles[i].x = mouseX;
        circles[i].y = mouseY;

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
          if (circles[i].mode === 'pen') {
            circles[i].fill = PEN_HIT_COLOR;
          } else if (circles[i].mode === 'mouse') {
            circles[i].fill = MOUSE_HIT_COLOR;
          } else if (circles[i].mode === 'trackpad') {
            circles[i].fill = TRACK_HIT_COLOR;
          } else {
            circles[i].fill = TOUCH_HIT_COLOR;
          }
        } else {
          //if circle is being dragged
          if (circles[i].mode === 'pen') {
            circles[i].fill = PEN_DRAG_COLOR;
          } else if (circles[i].mode === 'mouse') {
            circles[i].fill = MOUSE_DRAG_COLOR;
          } else if (circles[i].mode === 'trackpad') {
            circles[i].fill = TRACK_DRAG_COLOR;
          } else {
            circles[i].fill = TOUCH_DRAG_COLOR;
          }
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
          if (circles[i].mode === 'pen') {
            circles[i].fill = PEN_HIT_COLOR;
          } else if (circles[i].mode === 'mouse') {
            circles[i].fill = MOUSE_HIT_COLOR;
          } else if (circles[i].mode === 'trackpad') {
            circles[i].fill = TRACK_HIT_COLOR;
          } else {
            circles[i].fill = TOUCH_HIT_COLOR;
          }
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
          if (circles[i].mode === 'pen') {
            circles[i].fill = PEN_DRAG_COLOR;
          } else if (circles[i].mode === 'mouse') {
            circles[i].fill = MOUSE_DRAG_COLOR;
          } else if (circles[i].mode === 'trackpad') {
            circles[i].fill = TRACK_DRAG_COLOR;
          } else {
            circles[i].fill = TOUCH_DRAG_COLOR;
          }
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

    appendToEventList([
      Date.now(),
      'move',
      e.pointerType,
      'x:' + e.clientX + ',y:' + e.clientY,
      'pressure:' + e.pressure.toFixed(5),
      'tiltX:' + e.tiltX + ',tiltY:' + e.tiltY,
    ]);
  };

  const mouseHandler = (e) => {
    setMouseX(e.clientX);
    setMouseY(e.clientY);

    appendToEventList([
      Date.now(),
      'move',
      'mouse',
      'x:' + e.clientX + ',y:' + e.clientY,
    ]);
  };

  const pointerDownHandler = (e) => {
    e.preventDefault();

    appendToEventList([
      Date.now(),
      'down',
      e.pointerType,
      'x:' + e.clientX + ',y:' + e.clientY,
      'pressure:' + e.pressure.toFixed(5),
      'tiltX:' + e.tiltX + ',tiltY:' + e.tiltY,
    ]);
    for (let i = 0; i < circles.length; i++) {
      if (
        circleHitTest(
          e.clientX,
          e.clientY,
          circles[i].x,
          circles[i].y,
          circles[i].r,
        ) &&
        (e.pointerType === circles[i].mode ||
          (e.pointerType === 'mouse' && circles[i].mode === 'trackpad')) &&
        !circles[i].isTarget &&
        circles[i].isToken
      ) {
        setCircles(
          circles.map((circle) => {
            return {
              ...circle,
              dragOn: circle.id === i,
            };
          }),
        );
        appendToEventList([
          Date.now(),
          'hit_token',
          i,
          'x:' + e.clientX + ',y:' + e.clientY,
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
          e.pointerType,
          'x:' + e.clientX + ',y:' + e.clientY,
        ]);
        setErrorFlag(true);
        setMissCount(missCount + 1);
      }
    }
  };

  const mouseDownHandler = (e) => {
    e.preventDefault();

    appendToEventList([
      Date.now(),
      'down',
      'mouse',
      'x:' + e.clientX + ',y:' + e.clientY,
    ]);
    for (let i = 0; i < circles.length; i++) {
      if (
        circleHitTest(
          e.clientX,
          e.clientY,
          circles[i].x,
          circles[i].y,
          circles[i].r,
        ) &&
        (circles[i].mode === 'mouse' || circles[i].mode === 'trackpad') &&
        !circles[i].isTarget &&
        circles[i].isToken
      ) {
        setCircles(
          circles.map((circle) => {
            return {
              ...circle,
              dragOn: circle.id === i,
            };
          }),
        );
        appendToEventList([
          Date.now(),
          'hit_token',
          i,
          'x:' + e.clientX + ',y:' + e.clientY,
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
          'mouse',
          'x:' + e.clientX + ',y:' + e.clientY,
        ]);
        setErrorFlag(true);
        setMissCount(missCount + 1);
      }
    }
  };

  const pointerUpHandler = (e) => {
    e.preventDefault();
    appendToEventList([
      Date.now(),
      'up',
      e.pointerType,
      'x:' + e.clientX + ',y:' + e.clientY,
      'pressure:' + e.pressure.toFixed(5),
      'tiltX:' + e.tiltX + ',tiltY:' + e.tiltY,
    ]);

    for (let i = 0; i < circles.length; i++) {
      if (circles[i].dragOn) {
        setCircles(
          circles.map((circle) => {
            return {
              ...circle,
              dragOn: false,
            };
          }),
        );
        appendToEventList([Date.now(), 'release', i]);
      }

      if (
        circles[i].isTarget &&
        !circles[i].isCenter &&
        circleHitTest(
          circles[tokenId].x,
          circles[tokenId].y,
          circles[i].x,
          circles[i].y,
          circles[i].r * tolerance,
        )
      ) {
        appendToEventList([
          Date.now(),
          'hit_target',
          targetId,
          'x:' + e.clientX + ',y:' + e.clientY,
        ]);

        activateCenter();
      } else if (
        circles[i].isTarget &&
        circles[i].isCenter &&
        circleHitTest(
          e.clientX,
          e.clientY,
          circles[i].x,
          circles[i].y,
          circles[i].r,
        )
      ) {
        appendToEventList([
          Date.now(),
          'hit_center',
          'x:' + e.clientX + ',y:' + e.clientY,
        ]);

        advanceTrial(currPathIndex, circles[i].mode, eventList, missCount);
      } else {
        if (
          circles[i].isTarget &&
          !circles[i].isCenter &&
          circles[tokenId].dragOn &&
          !circleHitTest(
            e.clientX,
            e.clientY,
            circles[i].x,
            circles[i].y,
            circles[i].r * tolerance,
          )
        ) {
          if (typeof e.pointerType !== 'undefined') {
            appendToEventList([
              Date.now(),
              'miss',
              e.pointerType,
              'x:' + e.clientX + ',y:' + e.clientY,
            ]);
          } else {
            appendToEventList([
              Date.now(),
              'miss',
              'mouse',
              'x:' + e.clientX + ',y:' + e.clientY,
            ]);
          }

          setErrorFlag(true);
          setMissCount(missCount + 1);
        }
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
  let rad = targetOn && !isCenter ? radius * 1.3 : radius;
  //ctx.strokeStyle = targetOn && !isCenter ? '#00EE00' : fill;
  ctx.strokeStyle = fill;
  ctx.lineWidth = 5;

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
    ctx.setLineDash([7, 7]);
    ctx.beginPath();
    ctx.ellipse(x, y, rad * 1.3, rad * 1.3, 0, 0, 2 * Math.PI);
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
