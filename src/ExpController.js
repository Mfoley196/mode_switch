import React, { useState, useEffect, useReducer } from 'react';
import InfoForm from './InfoForm';
import InstructionsPage from './InstructionsPage';
import ErrorPage from './ErrorPage';
import TaskController from './TaskController';
import DataLogger from './DataLogger';

function ExpController() {
  const [data, setData] = useState([]);
  const [pNo, setPNo] = useState(0);
  const [{ timeline, timelineIndex, stage }, dispatch] = useReducer(reducer, {
    timeline: null,
    timelineIndex: -1,
    stage: ['info'],
  });
  const [trialLog, setLog] = useState([]);

  const getData = () => {
    fetch('timelines.json', {
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    })
      .then(function (response) {
        //console.log(response)
        return response.json();
      })
      .then(function (myJson) {
        console.log(myJson);
        setData(myJson);
      });
  };

  useEffect(() => {
    getData();
  }, []);

  useEffect(() => {
    console.log(pNo);
    console.log(data[pNo]);
    let l = [];
    if (data !== undefined && pNo !== 0 && data[pNo] !== undefined) {
      for (let i = 0; i < data[pNo].length; i++) {
        l.push(data[pNo][i].split(','));
      }
      //console.log(l)
      //setTimeline(l)
      dispatch({ type: 'start', timeline: l });
      //setTlIndex(0)
    }
  }, [pNo, data]);

  return (
    (stage[0] === 'info' && (
      <InfoForm
        pNo={pNo}
        setPNo={setPNo}
        dispatch={dispatch}
        timeline={timeline}
      />
    )) ||
    (stage[0] === 'task' && (
      <TaskController
        dispatch={dispatch}
        timeline={timeline}
        stage={stage}
        setLog={setLog}
      />
    )) ||
    (stage[0] === 'instruction' && (
      <InstructionsPage dispatch={dispatch} timeline={timeline} stage={stage} />
    )) ||
    (stage[0] === 'error' && <ErrorPage pNo={pNo} trialLog={trialLog} />)
    //<DataLogger />
  );
}

//make token a different colour
//X don't make the others disappear
//X make target different colour
//if you fail once, mark it as an error and move on?
//maybe just redo the trial
// log experiment events
// log all input events (cursor, touch) - get xy position, pointer up pointer down
// log init position of token, position of target in each trial

function reducer(state, action) {
  switch (action.type) {
    case 'start':
      return {
        ...state,
        timelineIndex: 0,
        timeline: action.timeline,
        stage: action.timeline[0],
      };
    case 'next':
      if (state.timeline == null)
        throw new Error(`Timeline has not started yet.`);
      console.log(action.timeline[state.timelineIndex + 1]);
      return {
        ...state,
        timelineIndex: state.timelineIndex + 1,
        stage: action.timeline[state.timelineIndex + 1],
      };
    default:
      throw new Error(`Unknown action type: ${action.type}`);
  }
}
export default ExpController;
