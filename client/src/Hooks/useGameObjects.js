import {useState} from 'react';
import useSubscriber from 'Hooks/useSubscriber'

function useGameObjects({seeing}, defaultSeeing) {
	const [seeingObjects, setSeeingObjects] = useState(() => 
		seeing.concat(defaultSeeing)
	)

	useSubscriber('socket@see', objectData => 
		setSeeingObjects(seeingObjects.concat(objectData))
	)
	
	return seeingObjects
}

export default useGameObjects
