import { ChatWebSocket } from '@/api'
import { useCallback, useMemo, useSyncExternalStore } from 'react'

interface get_websocket_instance {
	chatWS: ChatWebSocket | null
	readyState: number
	isConnected: boolean
}

export function useGetWebsocketInstance(isLogged: boolean): get_websocket_instance {
	const chatWS = useMemo(() => {
		if (!isLogged) return null
		return new ChatWebSocket()
	}, [isLogged])

	const subscribe = useCallback(
		(listener: () => void) => {
			if (!chatWS) return () => {}
			const unsub = chatWS.subscribe(() => {
				listener()
			})
			return unsub
		},
		[chatWS]
	)

	const getSnapshot = useMemo(() => (chatWS ? chatWS.getSnapshot : () => WebSocket.CLOSED), [chatWS])

	const getServerSnapshot = useMemo(() => (chatWS ? chatWS.getSnapshot : () => WebSocket.CLOSED), [chatWS])

	const readyState = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)

	return {
		chatWS,
		readyState,
		isConnected: chatWS != null && readyState === WebSocket.OPEN
	}
}
