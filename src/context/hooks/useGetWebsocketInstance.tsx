import { ChatWebSocket } from '@/api'
import { useMemo, useSyncExternalStore } from 'react'

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

	const readyState = useSyncExternalStore(
		chatWS ? chatWS.subscribe : () => () => {},
		chatWS ? chatWS.getSnapshot : () => WebSocket.CLOSED
	)

	return {
		chatWS,
		readyState,
		isConnected: chatWS != null && readyState === WebSocket.OPEN
	}
}
