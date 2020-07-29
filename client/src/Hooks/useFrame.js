import {useEffect, useState} from 'react'
const interval = 100

export function useFrame(operation, filters){
    let [then, setThen] = useState(Date.now())
    useEffect(() => {
        let frame = () => {
            if((Date.now() - then) > interval){
                operation()
                setThen(Date.now())
            }else {
                window.requestAnimationFrame(frame)
            }
        }
        window.requestAnimationFrame(frame)
    }, filters)
}
