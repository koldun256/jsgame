import {useState} from 'react'
export function useMovement(startPosition, step, end){
    let [position, setPosition] = useState(startPosition)
    let [ended, setEnded] = useState(false)
    let direction = [step[0] > 0 ? 1 : -1, step[1] > 0 ? 1 : -1]

    return [
        position,
        () => {
            if(ended) return setPosition(position)
            setPosition([
                position[0] + step[0],
                position[1] + step[1]
            ])

            setEnded(   position[0] * direction[0] > end[0] &&
                        position[1] * direction[1] > end[1])
        }
    ]
}
