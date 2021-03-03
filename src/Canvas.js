import React from 'react'
import useCanvas from './useCanvas'

const Canvas = (props) => {
  const { draw, setMouseX, setMouseY, setCircles, circles, ...rest } = props
  const canvasRef = useCanvas(draw)

  const pointerHandler = (e) => {
    //console.log(e)
    //console.log(e.pointerType + " " + e.clientX + " " + e.clientY)
    setMouseX(e.clientX)
    setMouseY(e.clientY)
  }

  const pointerDownHandler = (e) => {
    e.preventDefault()
    console.log(e.pointerType + ' down')
    for (let i = 0; i < circles.length; i++) {
      if (
        circleHitTest(
          e.clientX,
          e.clientY,
          circles[i].x,
          circles[i].y,
          circles[i].r,
        ) &&
        e.pointerType === circles[i].mode
      ) {
        circles[i].dragOn = true
        console.log('Hit ' + i)
      }
    }
  }

  const mouseDownHandler = (e) => {
    e.preventDefault()
    console.log('MOUSE down from mouse handler')
  }

  const pointerUpHandler = (e) => {
    e.preventDefault()
    console.log(e.pointerType + ' up')
    for (let i = 0; i < circles.length; i++) {
      //console.log(i + " " + circles[i].dragOn)
      if (circles[i].dragOn) {
        circles[i].dragOn = false
        console.log('Release ' + i)
      }
    }
  }

  return (
    <canvas
      ref={canvasRef}
      onPointerMove={pointerHandler}
      //onMouseMove={pointerHandler}
      onPointerDown={pointerDownHandler}
      onMouseDown={mouseDownHandler}
      onPointerUp={pointerUpHandler}
      width="1000px"
      height="500px"
      {...rest}
    />
  )
}

function circleHitTest(pX, pY, cX, cY, radius) {
  // calculate distance from pX, pY  to centre of circle
  let d = myDist(pX, pY, cX, cY)

  // if it's less than radius, we have a hit
  if (d <= radius) {
    return true
  } else {
    return false
  }
}

function myDist(pX, pY, qX, qY) {
  let a = pY - qY // y difference
  let b = pX - qX // x difference
  let c = Math.sqrt(a * a + b * b)
  return c
}

export default Canvas

//prevent default
