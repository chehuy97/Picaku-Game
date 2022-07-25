import React, { useEffect, useState } from "react";

const Time = () => {
    const TIME_PLAY = 30 //minutes
    const [time, setTime] = useState(0)

    useEffect(() => {
        
        const timeDown = setInterval(() => {
            setTime(time+1)
        }, 60*1000)

        if(time === TIME_PLAY) {
            clearInterval(timeDown)
            alert('Time is up!')
        }

        return () => {
            clearInterval(timeDown)
        }
    }, [time])

    return (
        <div className="time-bar-root">
            <div className="time-bar">
                <div className="time-bar-pass" style={{"width": ` ${time / TIME_PLAY * 70}vw`}} />
                <div className="time-bar-left" style={{"width": ` ${70 - time / TIME_PLAY * 70}vw`}}/>
            </div>
        </div>
    )
}

export default Time