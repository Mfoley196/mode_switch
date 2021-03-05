import React, {useState} from 'react'
import InfoForm from './InfoForm'
import InstructionsPage from './InstructionsPage'
import TaskController from './TaskController'
// let penColor = "#00FF00";
// let mouseColor = "#00FFFF";

function ExpController() {
  const [expStage, goToStage] = React.useReducer(reducer, 'info');
  //const [formSubmitted, setSubmit] = React.useState(false)
  const [pNo, setPNo] = useState("");
  

  return (((expStage === 'info') && <InfoForm goToStage={goToStage} pNo={pNo} setPNo ={setPNo}/>)
    || ((expStage === 'task') && <TaskController goToStage={goToStage}/>)
    || ((expStage === 'instruction') && <InstructionsPage goToStage={goToStage}/>)
    );
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