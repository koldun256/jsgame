import eventSystem from 'Other/eventSystem';
import {useEffect} from 'react';
export default function useSubscriber(event, callback, deps = []) {
	useEffect(() => eventSystem.subscribe(event, callback), deps)
}
