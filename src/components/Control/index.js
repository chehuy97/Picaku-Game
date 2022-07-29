import React from "react";
import bulbIcon from '../../images/bulb.png'
import newIcon from '../../images/new.png'
import changeIcon from '../../images/change.png'
import playIcon from '../../images/play.png'

const Control = ({triggerEvent}) => {

    return <div className="control">
        <img className="control-button" src={playIcon} onClick={() => triggerEvent('PLAY')}/>
        {/* <img className="control-button" src={changeIcon} onClick={() => triggerEvent('CHANGE')}/> */}
        <img className="control-button" src={bulbIcon} onClick={() => triggerEvent('SUGGEST')}/>
        {/* <img className="control-button" src={newIcon} onClick={() => triggerEvent('NEW')}/> */}
    </div>
}

export default Control