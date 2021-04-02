import React from 'react';
import useCanvas from './useCanvas';

function drawCircle(ctx, x, y, radius, fill, targetOn, isCenter) {
  // console.log(fill);
  let rad = targetOn ? radius * 1.2 : radius;
  ctx.strokeStyle = targetOn ? '#00EE00' : fill;
  ctx.lineWidth = 5;

  if (!targetOn || isCenter) {
    ctx.fillStyle = fill;
  }

  ctx.beginPath();
  ctx.ellipse(x, y, rad, rad, 0, 0, 2 * Math.PI);

  if (!targetOn || isCenter) {
    ctx.fill();
  }

  ctx.stroke();
}

const Canvas = (props) => {
  const {
    circles,
    setCircles,
    path,
    currPathIndex,
    targetId,
    advanceTrial,
    activateCenter,
    stage,
    eventList,
    setEventList,
    ...rest
  } = props;

  const [mouseX, setMouseX] = React.useState(0);
  const [mouseY, setMouseY] = React.useState(0);

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

  //const TOKEN_COLOR = '#FF0000';
  const TARGET_COLOR = '#00EE00';
  //const HOVER_COLOR = '#00BB00';

  const appendToEventList = (event) => {
    //let eListCopy = eventList.slice();
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
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);
    //drawCircle(ctx, mouseX, mouseY, 15, "#FFFFFF");

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
        circles[i].x = mouseX;
        circles[i].y = mouseY;

        if (
          circleHitTest(
            circles[targetId].x,
            circles[targetId].y,
            circles[i].x,
            circles[i].y,
            circles[i].r * 0.6,
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
        circles[i].fill = TARGET_COLOR;
      } else if (circles[i].isToken) {
        if (circles[i].mode === 'pen') {
          circles[i].fill = PEN_COLOR;
        } else if (circles[i].mode === 'mouse') {
          circles[i].fill = MOUSE_COLOR;
        } else if (circles[i].mode === 'trackpad') {
          circles[i].fill = TRACK_COLOR;
        } else {
          circles[i].fill = TOUCH_COLOR;
        }
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
    appendToEventList([Date.now(), 'x:' + e.clientX + ',y:' + e.clientY]);
  };

  const pointerDownHandler = (e) => {
    e.preventDefault();
    // console.log(e.pointerType + ' down');
    // console.log(targetId);

    appendToEventList([Date.now(), e.pointerType + '_down']);
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
        //circles[i].dragOn = true
        console.log('Hit ' + i);
        appendToEventList([Date.now(), 'hit_token_' + i]);
      }
    }
  };

  const mouseDownHandler = (e) => {
    e.preventDefault();
    // console.log('MOUSE down from mouse handler');
    // console.log(targetId);

    appendToEventList([Date.now(), 'mouse_down']);
    for (let i = 0; i < circles.length; i++) {
      console.log(circles[i].id);
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
        //circles[i].dragOn = true
        //console.log('Hit ' + i);
        appendToEventList([Date.now(), 'hit_token_' + i]);
      }
    }
  };

  const pointerUpHandler = (e) => {
    e.preventDefault();
    //console.log(e.pointerType + ' up');
    appendToEventList([Date.now(), e.pointerType + '_up']);
    //console.log(eventList);

    for (let i = 0; i < circles.length; i++) {
      //console.log(i + " " + circles[i].dragOn)
      if (circles[i].dragOn) {
        circles[i].dragOn = false;
        appendToEventList([Date.now(), 'release_' + i]);
      }

      if (
        circles[i].isTarget &&
        !circles[i].isCenter &&
        circleHitTest(
          e.clientX,
          e.clientY,
          circles[i].x,
          circles[i].y,
          circles[i].r * 0.6,
        )
      ) {
        appendToEventList([Date.now(), 'hit_target_' + targetId]);
        //console.log('hit target!');

        activateCenter();
      }

      if (
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
        appendToEventList([Date.now(), 'hit_center']);
        //console.log('hit center!');

        advanceTrial(currPathIndex, circles[i].mode, eventList);
      }
    }
  };

  return (
    <canvas
      ref={canvasRef}
      onPointerMove={pointerHandler}
      onMouseMove={pointerHandler}
      onPointerDown={pointerDownHandler}
      onMouseDown={mouseDownHandler}
      onMouseUp={pointerUpHandler}
      onPointerUp={pointerUpHandler}
      width="1024px"
      height="800px"
      {...rest}
    />
  );
};

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
