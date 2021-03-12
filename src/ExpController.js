import React, { useState, useEffect, useReducer } from 'react';
import InfoForm from './InfoForm';
import InstructionsPage from './InstructionsPage';
import ErrorPage from './ErrorPage';
import TaskController from './TaskController';
import DataLogger from './DataLogger';
import Loading from './Loading';

const DEFAULT_STATE = {
  timeline: null,
  timelineIndex: -1,
  stage: ['loading'],
};

function ExpController() {
  const [{ stage, participantNumber }, dispatch] = useReducer(
    reducer,
    DEFAULT_STATE,
  );
  const [trialLog, setLog] = useState([]);

  useEffect(() => {
    let isCanceled = false;

    fetch('timelines.json', {
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    })
      .then(function (response) {
        return response.json();
      })
      .then(function (data) {
        // Dispatching if the component is gone will trigger a React warning.
        if (!isCanceled) {
          dispatch({ type: 'dataReceived', data });
        }
      })
      .catch((error) => {
        if (!isCanceled) {
          dispatch({ type: 'error', error });
        }
      });
    return () => {
      isCanceled = true;
    };
  }, []);

  return (
    (stage[0] === 'loading' && <Loading />) ||
    (stage[0] === 'info' && (
      // I don't like to share dispatch. No one needs to know how this component
      // deals with its reducer. I am using a callback instead.
      <InfoForm
        onSubmit={(participantNumber) => {
          dispatch({ type: 'start', participantNumber });
        }}
      />
    )) ||
    (stage[0] === 'task' && (
      <TaskController dispatch={dispatch} stage={stage} setLog={setLog} />
    )) ||
    (stage[0] === 'instruction' && (
      <InstructionsPage dispatch={dispatch} stage={stage} />
    )) ||
    (stage[0] === 'error' && (
      <ErrorPage pNo={participantNumber} trialLog={trialLog} />
    ))
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
    case 'dataReceived':
      return { ...state, data: action.data, stage: ['info'] };
    case 'start': {
      if (state.data == null) {
        return reducer(state, {
          type: 'error',
          error: new Error(`Data has not been received yet`),
        });
      }
      let timeline = makeTimeline(state.data, action.participantNumber);
      return {
        ...state,
        // Starts at 1 since 0 should already be done (it is required to get
        // the timeline itself)
        timelineIndex: 1,
        timeline,
        stage: timeline[1],
      };
    }
    case 'next':
      if (state.timeline == null) {
        return reducer(state, {
          type: 'error',
          error: new Error(`Timeline has not started yet`),
        });
      }
      return {
        ...state,
        timelineIndex: state.timelineIndex + 1,
        stage: state.timeline[state.timelineIndex + 1],
      };
    case 'error':
      return { ...state, stage: ['error'], error: action.error };
    default:
      return reducer(state, {
        type: 'error',
        error: new Error(`Unknown action type: ${action.type}`),
      });
  }
}

function makeTimeline(data, pNo) {
  let l = [];
  if (data !== undefined && pNo !== 0 && data[pNo] !== undefined) {
    for (let i = 0; i < data[pNo].length; i++) {
      l.push(data[pNo][i].split(','));
    }
  }
  return l;
}

export default ExpController;
