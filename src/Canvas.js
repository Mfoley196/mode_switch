import React from 'react'
import useCanvas from './useCanvas'

function drawCircle(ctx, x, y, radius, fill, targetOn) {
  // console.log(fill);
  let rad = targetOn ? radius * 1.1 : radius
  ctx.strokeStyle = targetOn ? "#FF0000" : fill;
  ctx.lineWidth = 5;

  if (!targetOn) {
    ctx.fillStyle = fill;
  }
  
  ctx.beginPath();
  ctx.ellipse(x,y, rad, rad, 0, 0, 2*Math.PI);

  if (!targetOn) {
    ctx.fill();
  }
  
  ctx.stroke();
}

const Canvas = props => {  
  
  const {circles, setCircles, path, currPathIndex, targetId, advanceTrial, ...rest } = props
  
  const [mouseX, setMouseX] = React.useState(0)
  const [mouseY, setMouseY] = React.useState(0)

  const draw = (ctx) => {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
    ctx.fillStyle = '#00CC00';
    ctx.fillRect(0,0,window.innerWidth,window.innerHeight);
    //drawCircle(ctx, mouseX, mouseY, 15, "#FFFFFF");

    //draw targets
    for (let i = 0; i < circles.length; i++) {
      //console.log(circles[i])
      if (circles[i].dragOn) {
        circles[i].x = mouseX;
        circles[i].y = mouseY;
        circles[i].fill = "#FF0000";
      } else if (circles[i].isTarget) {
        circles[i].fill = "#00CC00";
      } else {
        if (circles[i].mode === 'pen') {
          circles[i].fill = "#FFFF00";
        } else if (circles[i].mode === 'mouse') {
          circles[i].fill = "#00FFFF";
        } else {
          circles[i].fill = "#FFFFFF";
        }
      }
      // console.log(i)
      // console.log(circles[i])

      if (circles[i].isVisible) {
        drawCircle(ctx, circles[i].x, circles[i].y, circles[i].r, circles[i].fill, circles[i].isTarget);
      }
      
    }

  }

  const canvasRef = useCanvas(draw)

  const pointerHandler = (e) => {
    //console.log(e)
    //console.log(e.pointerType + " " + e.clientX + " " + e.clientY)
    setMouseX(e.clientX)
    setMouseY(e.clientY)
  }

  const pointerDownHandler = (e) => {
    e.preventDefault()
    console.log(e.pointerType + " down")
    for (let i = 0; i < circles.length; i++){
        if (circleHitTest(e.clientX, e.clientY, circles[i].x, circles[i].y, circles[i].r)
            && e.pointerType === circles[i].mode
            && !circles[i].isTarget) {
            setCircles(
              circles.map((circle) => {
                return {
                  ...circle,
                  dragOn: circle.id === i,
                };
              })
            )
            //circles[i].dragOn = true
            console.log("Hit " + i)
        }
    }
  }

  const mouseDownHandler = (e) => {
    e.preventDefault()
    console.log("MOUSE down from mouse handler")
  }

  const pointerUpHandler = (e) => {
    e.preventDefault()
    console.log(e.pointerType + " up");


    for (let i = 0; i < circles.length; i++){
        //console.log(i + " " + circles[i].dragOn)
        if (circles[i].dragOn) {
            setCircles(
              circles.map((circle) => {
                return {
                  ...circle,
                  dragOn: false,
                };
              })
            )
            console.log("Release " + i)
        }

        if (circles[i].isTarget &&
          circleHitTest(e.clientX, e.clientY, circles[i].x, circles[i].y, circles[i].r)) {
          console.log("hit target!")
          advanceTrial(currPathIndex)

        }
    }
  }
  
  return <canvas ref={canvasRef} 
  onPointerMove={pointerHandler} 
  onMouseMove={pointerHandler}
  onPointerDown={pointerDownHandler}
  onMouseDown={mouseDownHandler}
  onMouseUp={pointerUpHandler}
  onPointerUp={pointerUpHandler}
  width="1000px"
  height="500px"
  {...rest}/>
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
  let c = Math.sqrt((a * a) + (b * b));  
  return c;
}

export default Canvas

//prevent default