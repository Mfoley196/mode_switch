import React, {useState} from 'react'
import Canvas from './Canvas'
import InfoForm from './InfoForm'
import InstructionsPage from './InstructionsPage'
// let penColor = "#00FF00";
// let mouseColor = "#00FFFF";

function ExpController() {
  const [expStage, goToStage] = React.useReducer(reducer, 'info');
  //const [formSubmitted, setSubmit] = React.useState(false)
  const [mouseX, setMouseX] = React.useState(0)
  const [mouseY, setMouseY] = React.useState(0)
  const [circles, setCircles] = React.useState(initCircles(11, 20));
  const [pNo, setPNo] = useState("");
  
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

      drawCircle(ctx, circles[i].x, circles[i].y, circles[i].r, circles[i].fill);
    }

  }

  return (((expStage === 'info') && <InfoForm goToStage={goToStage} pNo={pNo} setPNo ={setPNo}/>)
    || ((expStage === 'task') && <Canvas 
      draw={draw} 
      setMouseX={setMouseX} setMouseY={setMouseY} 
      setCircles={setCircles} circles={circles} />)
    || ((expStage === 'instruction') && <InstructionsPage goToStage={goToStage}/>)
    );
  
  //<Canvas 
  //draw={draw} 
  //setMouseX={setMouseX} 
  //setMouseY={setMouseY}
  //setCircles={setCircles} 
  //circles={circles} />
}

function drawCircle(ctx, x, y, radius, fill) {
  // console.log(fill);
  ctx.fillStyle = fill;
  ctx.beginPath();
  ctx.ellipse(x,y, radius, radius, 0, 0, 2*Math.PI);
  ctx.fill()
}

function initCircles(numCircs, radius){
  let circs = [];
  let angle = 0;
  let largeRad = 400/2
  let step = (2*Math.PI) / numCircs;

  for (let i = 0; i < numCircs; i++) {
    let x = Math.round(1000/2 + (radius + largeRad) * Math.cos(angle))
    let y = Math.round(500/2 + (radius + largeRad) * Math.sin(angle))
    let fill = "#FFFF00"
    let mode = "touch"

    if (i === 1 || i === 2) {
      mode = "pen"
    }

    if (i === 10 || i === 9) {
      mode = "mouse"
    }

    let circle = {
      x: x,
      y: y,
      r: radius,
      fill: fill,
      dragOn: false,
      isTarget: false,
      mode: mode,
    }
    circs.push(circle);
    angle += step;
  }
  return circs;
}

function reducer(state, action) {
  switch(action.type) {
    case 'info':
      return 'info';
    case 'instruction':
      return 'instruction';
    case 'task':
      return 'task';
    default:
      return 'info';
  }
}

export default ExpController