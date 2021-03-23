import React, { useState, useEffect, useReducer } from 'react';
import InfoForm from './InfoForm';
import InstructionsPage from './InstructionsPage';
import ErrorPage from './ErrorPage';
import TaskController from './TaskController';
import DataLogger from './DataLogger';
import Loading from './Loading';
import ExpDone from './ExpDone';

const DEFAULT_STATE = {
  timeline: null,
  timelineIndex: -1,
  stage: ['loading'],
  error: null,
};

function ExpController() {
  const [{ stage, participantNumber, error }, dispatch] = useReducer(
    reducer,
    DEFAULT_STATE,
  );
  const [expLog, setExpLog] = useState({});
  const [blockLog, setBlockLog] = useState([]);

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
        console.log(data);
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
    (stage['stage'] === 'loading' && <Loading />) ||
    (stage['stage'] === 'info' && (
      // I don't like to share dispatch. No one needs to know how this component
      // deals with its reducer. I am using a callback instead.
      <InfoForm
        onSubmit={(participantId) => {
          dispatch({ type: 'start', participantId });
        }}
      />
    )) ||
    ((stage['stage'] === 'task' || stage['stage'] === 'baseline') && (
      <div>
        <TaskController
          dispatch={dispatch}
          stage={stage}
          pNo={participantNumber}
          expLog={expLog}
          setExpLog={setExpLog}
          blockLog={blockLog}
          setBlockLog={setBlockLog}
        />
        <DataLogger
          expLog={expLog}
          setExpLog={setExpLog}
          blockLog={blockLog}
          setBlockLog={setBlockLog}
        />
      </div>
    )) ||
    (stage['stage'] === 'instruction' && (
      <InstructionsPage dispatch={dispatch} stage={stage} />
    )) ||
    (stage['stage'] === 'error' && (
      <ErrorPage pNo={participantNumber} blockLog={blockLog} error={error} />
    )) ||
    (stage['stage'] === 'done' && <ExpDone />)
    //<DataLogger />
  );
}

function reducer(state, action) {
  switch (action.type) {
    case 'dataReceived':
      return { ...state, data: action.data, stage: { stage: 'info' } };
    case 'start':
      try {
        if (state.data == null) {
          throw new Error(`Data has not been received yet`);
        }
        let timeline = makeTimeline(state.data, action.participantId);
        return {
          ...state,
          // Start at 1 since 0 should already be done (it is required to get
          // the timeline itself).
          participantNumber: action.participantId,
          timelineIndex: 1,
          timeline,
          stage: timeline[1],
        };
      } catch (error) {
        return reducer(state, { type: 'error', error });
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

function makeTimeline(data, participantId) {
  return data[participantId];
  throw new Error(
    `Cannot create timeline, participant id not found: ${participantId}`,
  );
}

export default ExpController;
