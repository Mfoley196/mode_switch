import React from 'react'

const InstructionsPage = (props) => {
    const {goToStage} = props
    const testText = "blah blah text here"

    function handleClick(e) {
        e.preventDefault();
        goToStage({type: 'task'});
    }

    return (
        <div>
        <div>{testText}</div>
        <input type="submit" value="Continue" onClick={handleClick}/>
        </div>
    );
    
} 

export default InstructionsPage