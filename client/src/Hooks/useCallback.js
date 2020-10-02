import {useRef} from 'react';

const useCallback = func => {
	const funcRef = useRef(func)
	funcRef.current = func
	return (...args) => funcRef.current(...args)
}

export default useCallback
