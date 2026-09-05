import type { ChatWebSocket } from '@/api'
import type { Channel } from '@/types'
import { createContext } from 'react'

export const SIDE_PANNELS_STATE = {
	PINNED: 'pinned',
	USERS: 'users'
} as const

export type all_side_pannels = (typeof SIDE_PANNELS_STATE)[keyof typeof SIDE_PANNELS_STATE]

export interface IChatContext {
	sidePanel: {
		openPanel: (panel: all_side_pannels) => void
		closePanels: () => void
		activePanel: all_side_pannels | null
	}

	websocket: {
		CHAT_SOCKET: ChatWebSocket
	}

	loadMoreMessages: (channel_id: Channel['id']) => Promise<void>
}

export const CHAT_CONTEXT = createContext<IChatContext | null>(null)
