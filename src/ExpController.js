import React, {useState, useEffect} from 'react'
import InfoForm from './InfoForm'
import InstructionsPage from './InstructionsPage'
import ErrorPage from './InstructionsPage'
import TaskController from './TaskController'
// let penColor = "#00FF00";
// let mouseColor = "#00FFFF";

function ExpController() {
  const [expStage, goToStage] = React.useReducer(reducer, 'info');
  const [data,setData]=useState([]);
  const [tl, setTimeline] = useState([]);
  const [tlIndex, setTlIndex] = useState(0);
  //const [formSubmitted, setSubmit] = React.useState(false)
  const [pNo, setPNo] = useState(0);

  const getData=()=>{
    fetch('timelines.json'
    ,{
      headers : { 
        'Content-Type': 'application/json',
        'Accept': 'application/json'
       }
    }
    )
      .then(function(response){
        //console.log(response)
        return response.json();
      })
      .then(function(myJson) {
        console.log(myJson);
        setData(myJson);
      });
  }

  useEffect(()=>{
    getData()
  },[])

  useEffect(()=>{
    console.log(pNo);
    console.log(data[pNo]);
    let l = []
    if (data !== undefined && pNo !== 0) {
      for (let i = 0; i < data[pNo].length; i++) {
        l.push(data[pNo][i].split(","))
      }
      //console.log(l)
      setTimeline(l)
      setTlIndex(0)
    }
  },[pNo, data])

  const goToNext = () => {
    console.log(tlIndex)
    setTlIndex(tlIndex => tlIndex + 1)
    console.log(tlIndex)
  }
  

  return (((expStage === 'info') && <InfoForm goToStage={goToStage} pNo={pNo} setPNo ={setPNo} goToNext={goToNext}/>)
    || ((expStage === 'task') && <TaskController goToStage={goToStage} tl={tl} tlIndex={tlIndex} setTlIndex={setTlIndex}/>)
    || ((expStage === 'instruction') && <InstructionsPage goToStage={goToStage} goToNext={goToNext}/>)
    || ((expStage === 'error') && <ErrorPage goToStage={goToStage}/>)
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
  switch(action.type) {
    case 'info':
      return 'info';
    case 'instruction':
      return 'instruction';
    case 'task':
      return 'task';
    case 'training':
      return 'error';
    default:
      return 'error';
  }
}

export default ExpController