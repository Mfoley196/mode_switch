import React from 'react';

const InfoForm = (props) => {
  const { setPNo, dispatch, timeline } = props;

  const handleSubmit = (evt) => {
    evt.preventDefault();
    dispatch({ type: 'next', timeline: timeline });
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Participant Number:
        <input type="text" onChange={(e) => setPNo(e.target.value)} />
      </label>
      <input type="submit" value="Submit" />
    </form>
  );
};

export default InfoForm;
