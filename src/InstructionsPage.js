import React, {useEffect} from 'react'

const InstructionsPage = (props) => {
    const {goToStage, tl, tlIndex, setTlIndex} = props
    const testText = "blah blah text here"

    function handleClick(e) {
        e.preventDefault();
        setTlIndex(tlIndex + 1)
        //console.log(tlIndex)
        //console.log(tl[tlIndex+1][0])
        //goToStage({type: 'task'});
    }

    //console.log(tlIndex)
    //console.log(tl[tlIndex])

    useEffect(() => {
        goToStage({type: tl[tlIndex][0]});

    }, [tlIndex, tl, goToStage]);

    return (
        <div>
        <div>{testText}</div>
        <input type="submit" value="Continue" onClick={handleClick}/>
        </div>
    );
    
} 

export default InstructionsPage