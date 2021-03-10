import React from 'react'

const InfoForm = (props) => {
  const {goToStage, setPNo, tl, tlIndex, advanceTl} = props
  
  
  const handleSubmit = (evt) => {
      evt.preventDefault();
      // console.log(tl)
      // console.log(tlIndex)
      goToStage({type: tl[tlIndex][0]});
      //advanceTl();
  }
  
  return (
    <form onSubmit={handleSubmit}>
      <label>
        Participant Number:
        <input
          type="text"
          onChange={e => setPNo(e.target.value)}
        />
      </label>
      <input type="submit" value="Submit" />
    </form>
  );
}

export default InfoForm;