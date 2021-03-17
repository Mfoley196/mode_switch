import React from 'react';
import useCanvas from './useCanvas';

function drawCircle(ctx, x, y, radius, fill, targetOn) {
  // console.log(fill);
  let rad = targetOn ? radius * 1.2 : radius;
  ctx.strokeStyle = targetOn ? '#00EE00' : fill;
  ctx.lineWidth = 5;

  if (!targetOn) {
    ctx.fillStyle = fill;
  }

  ctx.beginPath();
  ctx.ellipse(x, y, rad, rad, 0, 0, 2 * Math.PI);

  if (!targetOn) {
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
    stage,
    eventList,
    setEventList,
    ...rest
  } = props;

  const [mouseX, setMouseX] = React.useState(0);
  const [mouseY, setMouseY] = React.useState(0);

  const PEN_COLOR = '#FFFF00';
  const MOUSE_COLOR = '#00FFFF';
  const TOUCH_COLOR = '#CCCC00';
  const TRACK_COLOR = '#FF00FF';
  const TOKEN_COLOR = '#FF0000';
  const TARGET_COLOR = '#00AA00';
  const HOVER_COLOR = '#00BB00';

  const appendToEventList = (event) => {
    //let eListCopy = eventList.slice();
    setEventList((prevList) => [...prevList, event]);
  };

  function getFillColor(input) {
    switch(input) {
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

    let textColor1 = getFillColor(stage[1]);
    let textColor2 = getFillColor(stage[2]);

    ctx.fillStyle = textColor1;
    if (stage[0] === 'baseline') {
      ctx.fillText(capitalize(stage[1]), 10, 40);
    } else {
      ctx.fillText(capitalize(stage[1]), 10, 40);

      ctx.fillStyle = 'white';
      ctx.fillText(', ', 175, 40);

      ctx.fillStyle = textColor2;
      ctx.fillText(capitalize(stage[2]), 195, 40);
    }
    
    ctx.fillStyle = 'white';
    ctx.fillText(currPathIndex + 1 + '/' + path.length, 10, 80);

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
            circles[i].r,
          )
        ) {
          circles[i].fill = HOVER_COLOR;
        } else {
          circles[i].fill = TOKEN_COLOR;
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
        circles[i].fill = '#FFFFFF';
      }

      drawCircle(
        ctx,
        circles[i].x,
        circles[i].y,
        circles[i].r,
        circles[i].fill,
        circles[i].isTarget,
      );
    }
  };

  const canvasRef = useCanvas(draw);

  const pointerHandler = (e) => {
    //console.log(e)
    //console.log(e.pointerType + " " + e.clientX + " " + e.clientY)
    setMouseX(e.clientX);
    setMouseY(e.clientY);
    //appendToEventList([Date.now(), "x:" + e.clientX +",y:" + e.clientY])
  };

  const pointerDownHandler = (e) => {
    e.preventDefault();
    console.log(e.pointerType + ' down');
    console.log(targetId);
    appendToEventList([Date.now(), e.pointerType + ' down']);
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
        appendToEventList([Date.now(), 'Hit Token ' + i]);
      }
    }
  };

  const mouseDownHandler = (e) => {
    e.preventDefault();
    console.log('MOUSE down from mouse handler');
    console.log(targetId);

    appendToEventList([Date.now(), 'mouse down']);
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
        console.log('Hit ' + i);
        appendToEventList([Date.now(), 'Hit circle ' + i]);
      }
    }
  };

  const pointerUpHandler = (e) => {
    e.preventDefault();
    console.log(e.pointerType + ' up');
    appendToEventList([Date.now(), e.pointerType + ' up']);
    console.log(eventList);

    for (let i = 0; i < circles.length; i++) {
      //console.log(i + " " + circles[i].dragOn)
      if (circles[i].dragOn) {
        setCircles(
          circles.map((circle) => {
            return {
              ...circle,
              dragOn: false,
            };
          }),
        );
        appendToEventList([Date.now(), 'Release ' + i]);
      }

      if (
        circles[i].isTarget &&
        circleHitTest(
          e.clientX,
          e.clientY,
          circles[i].x,
          circles[i].y,
          circles[i].r,
        )
      ) {
        appendToEventList([Date.now(), 'Hit Target ' + targetId]);
        console.log('hit target!');
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
