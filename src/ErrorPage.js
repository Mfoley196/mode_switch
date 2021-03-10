import React from 'react'

const ErrorPage = (props) => {
    const {goToStage} = props
    const testText = "Whoops, something fucked up, try again"

    function handleClick(e) {
        e.preventDefault();
        goToStage({type: 'info'});
    }

    return (
        <div>
        <div>{testText}</div>
        <input type="submit" value="Continue" onClick={handleClick}/>
        </div>
    );
    
} 

export default ErrorPage