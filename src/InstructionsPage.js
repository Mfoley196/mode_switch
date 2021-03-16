import React from 'react';

const InstructionsPage = (props) => {
  const { dispatch, stage } = props

  const modeSwitchText = (
    <div>
      <p>You will be switching between the <b>{stage[1]}</b> and the <b>{stage[2]}</b>.</p>
      <p>Please make sure the <b>{stage[1]}</b> and the <b>{stage[2]}</b> are connected to the iPad before pressing &quot;Begin&quot;.</p>
    </div>
  );

  const modeSwitchTextTouch1 = (
    <div>
      <p>You will be switching between <b>touch</b> and the <b>{stage[2]}</b>.</p>
      <p>Please make sure the <b>{stage[2]}</b> is connected to the iPad before pressing &quot;Begin&quot;.</p>
    </div>
  );

  const modeSwitchTextTouch2 = (
    <div>
      <p>You will be switching between the <b>{stage[1]}</b> and <b>touch</b>.</p>
      <p>Please make sure the <b>{stage[1]}</b> is connected to the iPad before pressing &quot;Begin&quot;.</p>
    </div>
  );

  const baselineText = (
    <div>
      <p>You will be using the <b>{stage[1]}</b>.</p>
      <p>Please make sure the <b>{stage[1]}</b> is connected to the iPad before pressing &quot;Begin&quot;.</p>
    </div>
  );

  const baselineTextTouch = (
    <p>You will be using <b>touch</b>.</p>);

  const connectionInst = (
    <p>You can check if a device is connected to the iPad by clicking on &quot;Settings&quot;, then &quot;Bluetooth&quot;.</p>
  );


  function handleClick(e) {
    //console.log(stage);
    e.preventDefault();
    dispatch({ type: 'next' });
  }

  function InstructionText() {
    if (stage[1] === stage[2]) {
      if (stage[1] === 'touch') {
        return ({baselineTextTouch});
      } else {
        return (
          <div>
            {baselineText}
          </div>
        );
      }
    } else {
      if (stage[1] === 'touch') {
        return (
          <div>
            {modeSwitchTextTouch1}
          </div>
        );
      } else if (stage[2] === 'touch') {
        return (
          <div>
            {modeSwitchTextTouch2}
          </div>
        );

      } else {
        return (
          <div>
            {modeSwitchText}
          </div>
        );
      }
    }
  }

  return (
    <div>
      <InstructionText />
      {connectionInst}

      <p>{'Press "Begin" when you are ready to continue.'}</p>
      <input type="submit" value="Begin" onClick={handleClick} />
    </div>
  );
};

export default InstructionsPage;
