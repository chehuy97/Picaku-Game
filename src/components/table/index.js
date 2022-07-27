import React, { useState } from "react";

const Table = () => {
    const HORIZONTAL_LENGTH = 12
    const VERTICAL_LENGTH = 5
    const CARD_SIZE = 70
    const STATUS = {
        SUCCESS: 'SUCCESS',
        FAILURE: 'FAILURE',
        SELECTED: 'SELECTED',
        DEFAULT: 'DEFAULT'
    }

    // const initTwoDimentionArray = () => {
    //     const arr = []
    //     for (let i = 0; i <= VERTICAL_LENGTH + 1; i++) {
    //         const arrItem = []
    //         for (let j = 0; j <= HORIZONTAL_LENGTH + 1; j++) {
    //             arrItem.push(0)
    //         }
    //         arr.push(arrItem)
    //     }
    //     return arr
    //}

    const [data, setData] = useState([
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,1,2,3,4,5,6,5,7,8,9,9,10,0],
        [0,4,11,2,10,3,9,12,13,2,1,11,14,0],
        [0,6,15,12,15,4,14,8,8,9,10,11,3,0],
        [0,11,10,12,2,13,6,1,14,4,7,3,7,0],
        [0,8,15,14,15,12,7,13,5,13,6,5,1,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        
    ])
    const [selectedCards, setSelectedCards] = useState([])
    const [status, setStatus] = useState(STATUS.DEFAULT)

    const getNearestCardHasNoValue = (card) => {
        const nonValueArr = []
        if (card.vertical < VERTICAL_LENGTH + 1 && data[card.vertical + 1][card.horizontal] === 0) {
            nonValueArr.push({ vertical: card.vertical + 1, horizontal: card.horizontal, direction: 'DOWN' })
        }
        if (card.vertical > 0 &&  data[card.vertical - 1][card.horizontal] === 0) {
            nonValueArr.push({ vertical: card.vertical - 1, horizontal: card.horizontal, direction: 'UP' })
        }
        if (card.horizontal < HORIZONTAL_LENGTH + 1 && data[card.vertical][card.horizontal + 1] === 0) {
            nonValueArr.push({ vertical: card.vertical, horizontal: card.horizontal + 1, direction: 'RIGHT' })
        }
        if (card.horizontal > 0 && data[card.vertical][card.horizontal - 1] === 0) {
            nonValueArr.push({ vertical: card.vertical, horizontal: card.horizontal - 1, direction: 'LEFT' })
        }
        
        return nonValueArr
    }

    const compareCard = (firstCard, secondCard) => {
        return firstCard.vertical === secondCard.vertical && firstCard.horizontal === secondCard.horizontal
    }

    const checkIfNextCardIsFinalCard = (card, finalCard) => {
        let finalPointIsNextCard = false
        if (card.vertical < VERTICAL_LENGTH + 1 && compareCard( {vertical: card.vertical + 1, horizontal: card.horizontal}, finalCard) ) {
            finalPointIsNextCard = true
        }
        if (card.vertical > 0 &&  compareCard({vertical: card.vertical - 1, horizontal: card.horizontal}, finalCard)) {
            finalPointIsNextCard = true
        }
        if (card.horizontal < HORIZONTAL_LENGTH + 1 && compareCard({vertical: card.vertical, horizontal: card.horizontal + 1}, finalCard)) {
            finalPointIsNextCard = true
        }
        if (card.horizontal > 0 && compareCard({vertical: card.vertical, horizontal: card.horizontal - 1}, finalCard)) {
            finalPointIsNextCard = true
        }
        return finalPointIsNextCard
    }

    const drawLineOfCard = (points) => {
        const c = document.getElementById('game-canvas')
        const ctx = c.getContext("2d");
        ctx.beginPath();
        ctx.strokeStyle = '#ff0000';
        ctx.lineWidth = 5;
        for(let i = 0; i < points.length-1; i++) {
            ctx.moveTo(points[i].horizontal*CARD_SIZE+CARD_SIZE/2, points[i].vertical*CARD_SIZE+CARD_SIZE/2)
            ctx.lineTo(points[i+1].horizontal*CARD_SIZE+CARD_SIZE/2, points[i+1].vertical*CARD_SIZE+CARD_SIZE/2)
            ctx.stroke()
        }
        setTimeout(() => {
            ctx.clearRect(0, 0, c.width, c.height);

        }, 300)
    }

    const pointsBetweenTwoCard = (point, arrPoints, finalPoint) => {
        //console.log(point, arrPoints)
        if (point.direction === 'UP') {
            let nextPoint = {}
            if (point.horizontal === HORIZONTAL_LENGTH + 1 || point.horizontal === 0) {
                if (point.vertical > finalPoint.vertical) {
                    nextPoint = point.horizontal === HORIZONTAL_LENGTH + 1 ? {
                        vertical: finalPoint.vertical,
                        horizontal: HORIZONTAL_LENGTH + 1,
                        direction: 'LEFT'
                    } : {
                        vertical: finalPoint.horizontal,
                        horizontal: 0,
                        direction: 'RIGHT'
                    }
                    return pointsBetweenTwoCard(nextPoint, [...arrPoints, nextPoint], finalPoint)
                } else {
                    return []
                }
            } else if (data[finalPoint.vertical][point.horizontal] === 0 && 
                (point.horizontal < finalPoint.horizontal && data[finalPoint.vertical][finalPoint.horizontal - 1] !== 0 ||
                point.horizontal > finalPoint.horizontal && data[finalPoint.vertical][finalPoint.horizontal + 1] !== 0)) {
                nextPoint = point
            } else {
                for (let i = point.vertical; i >= 0; i--) {
                    if (i === finalPoint.vertical && point.horizontal === finalPoint.horizontal) {
                        return [...arrPoints, finalPoint]
                    }

                    if (i === finalPoint.vertical && data[i][point.horizontal] === 0) {
                        nextPoint = { value: 0, vertical: i, horizontal: point.horizontal }
                        break
                    }

                    if (data[i][point.horizontal] !== 0 || i === 0) {
                        const vertical = i === 0 ? 0 : i + 1
                        nextPoint = { value: data[vertical][point.horizontal], vertical, horizontal: point.horizontal }
                        break
                    }
                }
            }

            if (nextPoint && arrPoints.length < 3) {
                if (checkIfNextCardIsFinalCard(nextPoint, finalPoint)) {
                    return [...arrPoints, nextPoint, finalPoint]
                } else {
                    const nextPointWays = getNearestCardHasNoValue(nextPoint)
                    if (nextPointWays.length === 0) {
                        setStatus(STATUS.FAILURE)
                        return []
                    } else {
                        let points = []
                        nextPointWays.forEach(nextPointWay => {
                            const currentPoints = pointsBetweenTwoCard(nextPointWay, [...arrPoints, nextPoint], finalPoint)
                            if ((currentPoints.length && !points.length || currentPoints.length && points.length && currentPoints.length < points.length) && currentPoints[currentPoints.length - 1].vertical === finalPoint.vertical && currentPoints[currentPoints.length - 1].horizontal === finalPoint.horizontal) {
                                points = currentPoints
                                return
                            }
                        });
                        return points
                    }
                }
            } else return []

        } else if (point.direction === 'DOWN') {
            let nextPoint = {}
            if (point.horizontal === HORIZONTAL_LENGTH + 1 || point.horizontal === 0) {
                if (point.vertical < finalPoint.vertical) {
                    nextPoint = point.horizontal === HORIZONTAL_LENGTH + 1 ? {
                        vertical: finalPoint.vertical,
                        horizontal: HORIZONTAL_LENGTH + 1,
                        direction: 'LEFT'
                    } : {
                        vertical: finalPoint.vertical,
                        horizontal: 0,
                        direction: 'RIGHT'
                    }
                    return pointsBetweenTwoCard(nextPoint, [...arrPoints, nextPoint], finalPoint)
                } else {
                    return []
                }
            } else if (data[finalPoint.vertical][point.horizontal] === 0 && 
                (point.horizontal < finalPoint.horizontal && data[finalPoint.vertical][finalPoint.horizontal - 1] !== 0 ||
                point.horizontal > finalPoint.horizontal && data[finalPoint.vertical][finalPoint.horizontal + 1] !== 0)) {
                nextPoint = point
            } else {
                for (let i = point.vertical; i <= VERTICAL_LENGTH + 1; i++) {
                    if (i === finalPoint.vertical && point.horizontal === finalPoint.horizontal) {
                        return [...arrPoints, finalPoint]
                    }

                    if (i === finalPoint.vertical && data[i][point.horizontal] === 0) {
                        nextPoint = { value: 0, vertical: i, horizontal: point.horizontal }
                        break
                    }

                    if (data[i][point.horizontal] !== 0 || i === VERTICAL_LENGTH + 1) {
                        const vertical = i === VERTICAL_LENGTH + 1 ? VERTICAL_LENGTH + 1 : i - 1
                        nextPoint = { value: data[vertical][point.horizontal], vertical, horizontal: point.horizontal }
                        break
                    }
                }
            }
            if (nextPoint && arrPoints.length < 3) {
                if (checkIfNextCardIsFinalCard(nextPoint, finalPoint)) {
                    return [...arrPoints, nextPoint, finalPoint]
                } else {
                    const nextPointWays = getNearestCardHasNoValue(nextPoint)
                    if (nextPointWays.length === 0) {
                        setStatus(STATUS.FAILURE)
                        return []
                    } else {
                        let points = []
                        nextPointWays.forEach(nextPointWay => {
                            const currentPoints = pointsBetweenTwoCard(nextPointWay, [...arrPoints, nextPoint], finalPoint)
                            if ((currentPoints.length && !points.length || currentPoints.length && points.length && currentPoints.length < points.length) && currentPoints[currentPoints.length - 1].vertical === finalPoint.vertical && currentPoints[currentPoints.length - 1].horizontal === finalPoint.horizontal) {
                                points = currentPoints
                                return
                            }
                        });
                        return points
                    }
                }
            } else return []

        } else if (point.direction === 'LEFT') {
            let nextPoint = {}
            if (point.vertical === VERTICAL_LENGTH + 1 || point.vertical === 0) {
                if (point.horizontal > finalPoint.horizontal) {
                    nextPoint = point.vertical === VERTICAL_LENGTH + 1 ? {
                        vertical: VERTICAL_LENGTH + 1,
                        horizontal: finalPoint.horizontal,
                        direction: 'UP'
                    } : {
                        vertical: 0,
                        horizontal: finalPoint.horizontal,
                        direction: 'DOWN'
                    }
                    return pointsBetweenTwoCard(nextPoint, [...arrPoints, nextPoint], finalPoint)
                } else {
                    return []
                }
            } else if (data[point.vertical][finalPoint.horizontal] === 0 && 
                (point.vertical < finalPoint.vertical && data[finalPoint.vertical - 1][finalPoint.horizontal] !== 0 ||
                point.vertical > finalPoint.vertical && data[finalPoint.vertical + 1][finalPoint.horizontal] !== 0)) {
                nextPoint = point
            } else {
                for (let i = point.horizontal; i >= 0; i--) {
                    if (i === finalPoint.horizontal && point.vertical === finalPoint.vertical) {
                        return [...arrPoints, finalPoint]
                    }

                    if (i === finalPoint.horizontal && data[point.vertical][i] === 0) {
                        nextPoint = { value: 0, vertical: point.vertical, horizontal: i }
                        break
                    }

                    if (data[point.vertical][i] !== 0 || i === 0) {
                        const horizontal = i === 0 ? 0 : i + 1
                        nextPoint = { value: data[point.vertical][horizontal], vertical: point.vertical, horizontal }
                        break
                    }
                }
            }
            if (nextPoint && arrPoints.length < 3) {
                if (checkIfNextCardIsFinalCard(nextPoint, finalPoint)) {
                    return [...arrPoints, nextPoint, finalPoint]
                } else {
                    const nextPointWays = getNearestCardHasNoValue(nextPoint)
                    if (nextPointWays.length === 0) {
                        setStatus(STATUS.FAILURE)
                        return []
                    } else {
                        let points = []
                        nextPointWays.forEach(nextPointWay => {
                            const currentPoints = pointsBetweenTwoCard(nextPointWay, [...arrPoints, nextPoint], finalPoint)
                            if ((currentPoints.length && !points.length || currentPoints.length && points.length && currentPoints.length < points.length) && currentPoints[currentPoints.length - 1].vertical === finalPoint.vertical && currentPoints[currentPoints.length - 1].horizontal === finalPoint.horizontal) {
                                points = currentPoints
                                return
                            }
                        });
                        return points
                    }
                }
            } else return []

        } else if (point.direction === 'RIGHT') {
            let nextPoint = {}
            if (point.vertical === VERTICAL_LENGTH + 1 || point.vertical === 0) {
                if (point.horizontal < finalPoint.horizontal) {
                    nextPoint = point.vertical === VERTICAL_LENGTH + 1 ? {
                        vertical: VERTICAL_LENGTH + 1,
                        horizontal: finalPoint.horizontal,
                        direction: 'UP'
                    } : {
                        vertical: 0,
                        horizontal: finalPoint.horizontal,
                        direction: 'DOWN'
                    }
                    return pointsBetweenTwoCard(nextPoint, [...arrPoints, nextPoint], finalPoint)
                } else {
                    return []
                }
            } else if (data[point.vertical][finalPoint.horizontal] === 0 && 
                (point.vertical < finalPoint.vertical && data[finalPoint.vertical - 1][finalPoint.horizontal] !== 0 ||
                point.vertical > finalPoint.vertical && data[finalPoint.vertical + 1][finalPoint.horizontal] !== 0)) {
                nextPoint = point
            } else {
                for (let i = point.horizontal; i <= HORIZONTAL_LENGTH + 1; i++) {
                    if (i === finalPoint.horizontal && point.vertical === finalPoint.vertical) {
                        return [...arrPoints, finalPoint]
                    }

                    if (i === finalPoint.horizontal && data[point.vertical][i] === 0) {
                        nextPoint = { value: 0, vertical: point.vertical, horizontal: i }
                        break
                    }

                    if (data[point.vertical][i] !== 0 || i === HORIZONTAL_LENGTH + 1) {
                        const horizontal = i === HORIZONTAL_LENGTH + 1 ? HORIZONTAL_LENGTH + 1 : i - 1
                        nextPoint = { value: data[point.vertical][horizontal], vertical: point.vertical, horizontal }
                        break
                    }
                }
            }

            if (nextPoint && arrPoints.length < 3) {
                if (checkIfNextCardIsFinalCard(nextPoint, finalPoint)) {
                    return [...arrPoints, nextPoint, finalPoint]
                } else {
                    const nextPointWays = getNearestCardHasNoValue(nextPoint)
                    if (nextPointWays.length === 0) {
                        setStatus(STATUS.FAILURE)
                        return []
                    } else {
                        let points = []
                        nextPointWays.forEach(nextPointWay => {
                            const currentPoints = pointsBetweenTwoCard(nextPointWay, [...arrPoints, nextPoint], finalPoint)
                            if ((currentPoints.length && !points.length || currentPoints.length && points.length && currentPoints.length < points.length) && currentPoints[currentPoints.length - 1].vertical === finalPoint.vertical && currentPoints[currentPoints.length - 1].horizontal === finalPoint.horizontal) {
                                points = currentPoints
                                return
                            }
                        });
                        return points
                    }
                }
            } else return []

        }
    }
    
    const handleLineOfCard = (cards) => {
        const startPoint = cards[0]
        const finalPoint = cards[1]
        if (startPoint.value !== finalPoint.value) {
            setStatus(STATUS.FAILURE)
            setTimeout(() => {
                setSelectedCards([])
            }, 300)
        } else {
            let points = []
            if (checkIfNextCardIsFinalCard(startPoint, finalPoint)) {
                points = [startPoint, finalPoint]
            } else {
                const ways = getNearestCardHasNoValue(startPoint)
                if (ways.length === 0) {
                    setStatus(STATUS.FAILURE)
                } else {
                    ways.forEach(point => {
                        const currentPoints = pointsBetweenTwoCard(point, [{ ...startPoint }], finalPoint)
                        console.log('RESULT', currentPoints)
                        if( currentPoints.length && !points.length || currentPoints.length && currentPoints.length < points.length){
                            points = currentPoints
                        }
                    });
                }
            }
            if(points.length) {
                setStatus(STATUS.SUCCESS)
                drawLineOfCard(points)
                setTimeout(() => {
                    const dataClone = [...data]
                    data[startPoint.vertical][startPoint.horizontal] = 0
                    data[finalPoint.vertical][finalPoint.horizontal] = 0
                    setData(dataClone)
                }, 400)
            } else {
                setStatus(STATUS.FAILURE)
            }
            setTimeout(() => {
                setSelectedCards([])
            }, 300)
        }

    }

    const selectGameCard = (value, vIndex, hIndex) => {
        if(!value) return
        if(selectedCards.length === 0) {
            setSelectedCards([ {value, vertical: vIndex, horizontal: hIndex}])
            setStatus(STATUS.SELECTED)
        } 
        else if(compareCard(selectedCards[0], {vertical: vIndex, horizontal: hIndex})) {
            setStatus(STATUS.DEFAULT)
            setSelectedCards([])
        } else {
            setSelectedCards([...selectedCards, {value, vertical: vIndex, horizontal: hIndex}])
            handleLineOfCard([...selectedCards, {value, vertical: vIndex, horizontal: hIndex}])
        }
    }

    const showStatusOfSelectedCard = (vIndex, hIndex) => {
        if(selectedCards.some(item => item.vertical === vIndex && item.horizontal === hIndex)) {
             switch(status) {
                case STATUS.SELECTED: 
                    return "game-table-card-selected"
                case STATUS.SUCCESS:
                    return "game-table-card-success"    
                case STATUS.FAILURE:
                    return "game-table-card-failure"    
                default:
                    return "game-table-card"    
             }
        }

        return "game-table-card"
    }

    const renderPicachuCard = (value, vIndex, hIndex) => {
        return <div 
            className={showStatusOfSelectedCard(vIndex, hIndex)} 
            onClick={() => selectGameCard(value, vIndex, hIndex)} 
            style={{opacity: value === 0 ? 0 : 1}} key={hIndex}
            >
           {
            value !== 0 &&  <img alt="club" src={require(`../../images/club/club_${value}.png`)} width="30" height="30"/>
           }
        </div>
    }

    return <div className="game-table">
        <canvas
            id="game-canvas"
            width={`${(HORIZONTAL_LENGTH + 2) * CARD_SIZE}`}
            height={`${(VERTICAL_LENGTH + 2) * CARD_SIZE}`} />
        {data.map((verticalItem, vIndex) => <div key={vIndex} className="game-table-horizontal">
            {
                verticalItem.map((item, hIndex) => renderPicachuCard(item, vIndex, hIndex))
            }
        </div>)}
    </div>
}

export default Table