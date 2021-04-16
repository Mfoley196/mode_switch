import React, { useState, useEffect, useReducer } from 'react';
import InfoForm from './InfoForm';
import InstructionsPage from './InstructionsPage';
import ErrorPage from './ErrorPage';
import TaskController from './TaskController';
import Loading from './Loading';
import ExpDone from './ExpDone';
import ConsentForm from './ConsentForm';
import GoogleFormSurvey from './GoogleFormSurvey';

const DEFAULT_STATE = {
  timeline: null,
  timelineIndex: -1,
  stage: ['loading'],
  error: null,
};

function ExpController() {
  const [
    { stage, participantNumber, timelineIndex, timeline, error },
    dispatch,
  ] = useReducer(reducer, DEFAULT_STATE);
  const [expLog, setExpLog] = useState({});
  const [blockLog, setBlockLog] = useState([]);
  const [resumeFlag, setResumeFlag] = useState(false);
  const [resumeState, setResumeState] = useState({});
  const [fileUploadError, setUploadError] = useState(false);

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

  useEffect(() => {
    if ('currentStage' in localStorage) {
      //console.log(localStorage.getItem('currentStage'));
      setResumeState(JSON.parse(localStorage.getItem('currentStage')));
      setResumeFlag(true);
    }
  }, []);

  useEffect(() => {
    if (timelineIndex >= 0) {
      localStorage.setItem(
        'currentStage',
        JSON.stringify({
          participantId: participantNumber,
          stage: timeline[timelineIndex],
          timelineIndex: timelineIndex,
        }),
      );
    }
  }, [timelineIndex, participantNumber, timeline]);

  function beginOrResume(participantId) {
    if (resumeFlag) {
      dispatch({ type: 'start', participantId });
      let tl = resumeState.timelineIndex;
      let pID = participantId;
      let st = resumeState.stage;
      dispatch({ type: 'goToIndex', tl, pID, st });
    } else {
      dispatch({ type: 'start', participantId });
    }
  }

  return (
    (stage['stage'] === 'loading' && <Loading />) ||
    (stage['stage'] === 'consent' && (
      <ConsentForm
        onSubmit={() => {
          dispatch({ type: 'next' });
        }}
      />
    )) ||
    (stage['stage'] === 'info' && (
      // I don't like to share dispatch. No one needs to know how this component
      // deals with its reducer. I am using a callback instead.
      <InfoForm
        onSubmit={beginOrResume}
        resumeFlag={resumeFlag}
        setResumeFlag={setResumeFlag}
      />
    )) ||
    ((stage['stage'] === 'task' || stage['stage'] === 'baseline') && (
      <div>
        <TaskController
          dispatch={dispatch}
          stage={stage}
          timeline={timeline}
          timelineIndex={timelineIndex}
          pNo={participantNumber}
          expLog={expLog}
          setExpLog={setExpLog}
          blockLog={blockLog}
          setBlockLog={setBlockLog}
          fileUploadError={fileUploadError}
          setUploadError={setUploadError}
        />
      </div>
    )) ||
    (stage['stage'] === 'instruction' && (
      <InstructionsPage dispatch={dispatch} stage={stage} />
    )) ||
    (stage['stage'] === 'error' && (
      <ErrorPage pNo={participantNumber} blockLog={blockLog} error={error} />
    )) ||
    (stage['stage'] === 'survey' && (
      <GoogleFormSurvey pNo={participantNumber} dispatch={dispatch} />
    )) ||
    (stage['stage'] === 'done' && (
      <ExpDone fileUploadError={fileUploadError} pNo={participantNumber} />
    ))
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
    case 'goToIndex':
      return {
        ...state,
        participantNumber: action.pID,
        timelineIndex: action.tl,
        stage: action.st,
      };
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
  if (participantId in data) {
    return data[participantId];
  } else {
    throw new Error(
      `Cannot create timeline, participant id not found: ${participantId}`,
    );
  }
}

export default ExpController;
