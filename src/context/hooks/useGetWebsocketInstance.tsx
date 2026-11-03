import { ChatWebSocket } from '@/api'
import { useCallback, useMemo, useSyncExternalStore } from 'react'

interface get_websocket_instance {
	chatWS: ChatWebSocket | null
	readyState: number
	isConnected: boolean
}

// useSyncExternalStore requires the fallback snapshot to keep the same identity
// between reads, otherwise it treats every read as a state change.
const DISCONNECTED_SNAPSHOT = {
	readyState: WebSocket.CLOSED,
	isReconnecting: false,
	reconnectAttempt: 0,
	hasConnected: false
} as const

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

	const getSnapshot = useMemo(() => (chatWS ? chatWS.getSnapshot : () => DISCONNECTED_SNAPSHOT), [chatWS])
	const connection = useSyncExternalStore(subscribe, getSnapshot, getSnapshot)

	return {
		chatWS,
		readyState: connection.readyState,
		isConnected: chatWS != null && connection.readyState === WebSocket.OPEN
	}
}
