import React, { useEffect } from 'react';

const InstructionsPage = (props) => {
  const { goToStage, dispatch, stage, timeline } = props;
  const instructionText = `You will be switching between the ${stage[1]} and the ${stage[2]}.`;

  function handleClick(e) {
    console.log(stage);
    e.preventDefault();
    dispatch({ type: 'next', timeline: timeline });
  }

  //console.log(tlIndex)
  //console.log(tl[tlIndex])

  // useEffect(() => {
  //     goToStage({type: tl[tlIndex][0]});

  // }, [tlIndex, tl, goToStage]);

  return (
    <div>
      <div>{instructionText}</div>
      <div>{'Press "Begin" when you are ready to continue.'}</div>
      <input type="submit" value="Begin" onClick={handleClick} />
    </div>
  );
};

export default InstructionsPage;
