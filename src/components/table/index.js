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

    const ALIGNMENT = {
        HORIZONTAL: 'HORIZONTAL',
        VERTICAL: 'VERTICAL'
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

    const compareCard = (firstCard, secondCard) => {
        return firstCard.vertical === secondCard.vertical && firstCard.horizontal === secondCard.horizontal
    }

    const checkIfNextCardIsFinalCard = (card, finalCard) => {
        let endPointIsNextCard = false
        if (card.vertical < VERTICAL_LENGTH + 1 && compareCard( {vertical: card.vertical + 1, horizontal: card.horizontal}, finalCard) ) {
            endPointIsNextCard = true
        }
        if (card.vertical > 0 &&  compareCard({vertical: card.vertical - 1, horizontal: card.horizontal}, finalCard)) {
            endPointIsNextCard = true
        }
        if (card.horizontal < HORIZONTAL_LENGTH + 1 && compareCard({vertical: card.vertical, horizontal: card.horizontal + 1}, finalCard)) {
            endPointIsNextCard = true
        }
        if (card.horizontal > 0 && compareCard({vertical: card.vertical, horizontal: card.horizontal - 1}, finalCard)) {
            endPointIsNextCard = true
        }
        return endPointIsNextCard
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

    const isHaveNoBlockBetweenTwoCard = (firstPoint, secondPoint, alignment) => {
        let haveNoBlock = true
        let start = 0
        let end = 0
        if(alignment === ALIGNMENT.VERTICAL) {
            if(firstPoint.vertical < secondPoint.vertical) {
                start = firstPoint.vertical
                end = secondPoint.vertical
            } else {
                start = secondPoint.vertical
                end = firstPoint.vertical
            }
        } else {
            if(firstPoint.horizontal < secondPoint.horizontal) {
                start = firstPoint.horizontal
                end = secondPoint.horizontal
            } else {
                start = secondPoint.horizontal
                end = firstPoint.horizontal
            }
        }

        if(end - start === 1) {
            return haveNoBlock
        }

        for (let i = start + 1; i < end; i++) {
            const value = alignment === ALIGNMENT.VERTICAL ? data[i][secondPoint.horizontal] : data[secondPoint.vertical][i]
            if (value) {
                haveNoBlock = false
                break
            }
        }

        return haveNoBlock
    }

    const pointsBetweenTwoCard = ( startPoint ,endPoint, alignment) => { 
        switch(alignment) {
            case ALIGNMENT.VERTICAL: 
                //check 1 line
                if (startPoint.horizontal === endPoint.horizontal) {
                    return isHaveNoBlockBetweenTwoCard(startPoint, endPoint, ALIGNMENT.VERTICAL) ? [startPoint, endPoint] : []
                } 
                //check 2 line
                if (startPoint.vertical !== endPoint.vertical && 
                    startPoint.horizontal !== endPoint.horizontal &&
                    !data[endPoint.vertical][startPoint.horizontal] &&
                    isHaveNoBlockBetweenTwoCard(startPoint, { vertical: endPoint.vertical, horizontal: startPoint.horizontal }, ALIGNMENT.VERTICAL) &&
                    isHaveNoBlockBetweenTwoCard(endPoint, { vertical: endPoint.vertical, horizontal: startPoint.horizontal }, ALIGNMENT.HORIZONTAL)) {
                    return [startPoint, { vertical: endPoint.vertical, horizontal: startPoint.horizontal }, endPoint]
                } 
                if (startPoint.vertical !== endPoint.vertical && 
                    startPoint.horizontal !== endPoint.horizontal && 
                    !data[startPoint.vertical][endPoint.horizontal] &&
                    isHaveNoBlockBetweenTwoCard(startPoint, { vertical: startPoint.vertical, horizontal: endPoint.horizontal }, ALIGNMENT.HORIZONTAL) &&
                isHaveNoBlockBetweenTwoCard(endPoint, { vertical: startPoint.vertical, horizontal: endPoint.horizontal }, ALIGNMENT.VERTICAL)) {
                return [startPoint, { vertical: startPoint.vertical, horizontal: endPoint.horizontal }, endPoint]
                } 
                //check 3 line
                var isHasThreeLine = false
                let verticalIndex = 0
                for (let i = 0; i <= VERTICAL_LENGTH + 1; i++) {
                    const a = !data[i][startPoint.horizontal] && isHaveNoBlockBetweenTwoCard(startPoint, { vertical: i, horizontal: startPoint.horizontal }, ALIGNMENT.VERTICAL) 
                    const b = !data[i][endPoint.horizontal] && isHaveNoBlockBetweenTwoCard({ vertical: i, horizontal: startPoint.horizontal }, { vertical: i, horizontal: endPoint.horizontal }, ALIGNMENT.HORIZONTAL)
                    const c = isHaveNoBlockBetweenTwoCard({ vertical: i, horizontal: endPoint.horizontal }, endPoint, ALIGNMENT.VERTICAL)
                    if (a&&b&&c) {
                        isHasThreeLine = true
                        verticalIndex = i
                        break
                    }
                }
                if (isHasThreeLine) {
                    return [startPoint, { vertical: verticalIndex, horizontal: startPoint.horizontal }, { vertical: verticalIndex, horizontal: endPoint.horizontal }, endPoint]
                } else {
                    return []
                }
                
            case ALIGNMENT.HORIZONTAL: 
                //check 1 line
                if (startPoint.vertical === endPoint.vertical) {
                    return isHaveNoBlockBetweenTwoCard(startPoint, endPoint, ALIGNMENT.HORIZONTAL) ? [startPoint, endPoint] : []
                }
                //check 2 line
                if (startPoint.vertical !== endPoint.vertical && 
                    startPoint.horizontal !== endPoint.horizontal &&
                    !data[endPoint.vertical][startPoint.horizontal] &&
                    isHaveNoBlockBetweenTwoCard(startPoint, { vertical: endPoint.vertical, horizontal: startPoint.horizontal }, ALIGNMENT.VERTICAL) &&
                    isHaveNoBlockBetweenTwoCard(endPoint, { vertical: endPoint.vertical, horizontal: startPoint.horizontal }, ALIGNMENT.HORIZONTAL)) {
                    return [startPoint, { vertical: endPoint.vertical, horizontal: startPoint.horizontal }, endPoint]
                }
                if (startPoint.vertical !== endPoint.vertical && 
                    startPoint.horizontal !== endPoint.horizontal &&
                    !data[startPoint.vertical][endPoint.horizontal] &&
                    isHaveNoBlockBetweenTwoCard(startPoint, { vertical: startPoint.vertical, horizontal: endPoint.horizontal }, ALIGNMENT.HORIZONTAL) &&
                    isHaveNoBlockBetweenTwoCard(endPoint, { vertical: startPoint.vertical, horizontal: endPoint.horizontal }, ALIGNMENT.VERTICAL)) {
                    return [startPoint, { vertical: startPoint.vertical, horizontal: endPoint.horizontal }, endPoint]
                }
                //check 3 line
                var isHasThreeLine = false
                let horizontalIndex = 0
                for (let i = 0; i <= HORIZONTAL_LENGTH + 1; i++) {
                    const a = !data[startPoint.vertical][i] && isHaveNoBlockBetweenTwoCard(startPoint, { vertical: startPoint.vertical, horizontal: i }, ALIGNMENT.HORIZONTAL)
                    const b = !data[endPoint.vertical][i] && isHaveNoBlockBetweenTwoCard({ vertical: startPoint.vertical, horizontal: i }, { vertical: endPoint.vertical, horizontal: i }, ALIGNMENT.VERTICAL)
                    const c = isHaveNoBlockBetweenTwoCard({ vertical: endPoint.vertical, horizontal: i }, endPoint, ALIGNMENT.HORIZONTAL)
                    if (a&&b&&c) {
                        isHasThreeLine = true
                        horizontalIndex = i
                        break
                    }
                }
                if (isHasThreeLine) {
                    return [startPoint, { vertical: startPoint.vertical, horizontal: horizontalIndex }, { vertical: endPoint.vertical, horizontal: horizontalIndex }, endPoint]
                } else {
                    return []
                }
                
            default:
                return
        }
    }    
    
    const handleLineOfCard = (cards) => {
        const startPoint = cards[0]
        const endPoint = cards[1]
        if (startPoint.value !== endPoint.value) {
            setStatus(STATUS.FAILURE)
            setTimeout(() => {
                setSelectedCards([])
            }, 300)
        } else {
            let points = []
            if (checkIfNextCardIsFinalCard(startPoint, endPoint)) {
                points = [startPoint, endPoint]
            } else {
                Object.values(ALIGNMENT).map(alignment => {
                    let currentPoints = pointsBetweenTwoCard(startPoint, endPoint, alignment)
                    if((!points.length && currentPoints.length) || (currentPoints.length && points.length && currentPoints.length < points.length)) {
                        points = currentPoints
                    }
                })
                console.log('POINTS:', points)
            }
            if(points.length) {
                setStatus(STATUS.SUCCESS)
                drawLineOfCard(points)
                setTimeout(() => {
                    const dataClone = [...data]
                    data[startPoint.vertical][startPoint.horizontal] = 0
                    data[endPoint.vertical][endPoint.horizontal] = 0
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