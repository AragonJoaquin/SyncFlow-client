import type { ChatWebSocket } from '@/api'
import { useSyncExternalStore } from 'react'

export function useSocketConnectionState(socket: ChatWebSocket) {
	return useSyncExternalStore(socket.subscribe, socket.getSnapshot, socket.getSnapshot)
}
