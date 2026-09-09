import { ChatWebSocket } from '@/api'
import { useSyncExternalStore } from 'react'

// singleton instance
export const chatWS = new ChatWebSocket()

export function useGetWebsocketInstance() {
	const readyState = useSyncExternalStore(chatWS.subscribe, chatWS.getSnapshot)

	return {
		chatWS,
		readyState,
		isConnected: readyState === WebSocket.OPEN
	}
}
