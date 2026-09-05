import { useAxios } from '@/api'
import { useWorkGroupStore } from '@/store'
import type { Channel, Message } from '@/types'
import { useCallback, useState, type ReactNode } from 'react'
import { useShallow } from 'zustand/shallow'
import { CHAT_CONTEXT, type all_side_pannels } from './chatContext'
import { useWebsocket } from './hooks/websocket'

const SET_CHANNEL_SEARCHED = new Set<Channel['id']>()

export function ChatProvider({ children }: { children: ReactNode }) {
	const [sideActivePanel, setSideActivePanel] = useState<all_side_pannels | null>(null)
	const { get } = useAxios()
	const { channelPagination, setMoreMsgs } = useWorkGroupStore(
		useShallow((s) => ({ channelPagination: s.channelPagination, setMoreMsgs: s.setMoreMessages }))
	)

	const openSidePanel = useCallback((panel: all_side_pannels) => {
		setSideActivePanel((prev) => (prev === panel ? null : panel))
	}, [])

	const closeSidePanels = useCallback(() => {
		setSideActivePanel(null)
	}, [])

	const socket = useWebsocket()

	const loadMoreMessages = useCallback(async (channel_id: Channel['id']) => {
		if (SET_CHANNEL_SEARCHED.has(channel_id)) return

		const pagination = channelPagination.get(channel_id) ?? { offset: 0, hasMore: true }
		if (!pagination.hasMore) return

		const { data: res } = await get<{ messages: Message[]; has_more: boolean }>(
			`/channel/${channel_id}/messages?limit=50&offset=${pagination.offset}`
		)
		if (!res.data) return

		SET_CHANNEL_SEARCHED.add(channel_id)
		setMoreMsgs(channel_id, res.data?.messages ?? [], res.data?.has_more ?? true, pagination)
	}, [])

	return (
		<CHAT_CONTEXT.Provider
			value={{
				sidePanel: {
					openPanel: openSidePanel,
					activePanel: sideActivePanel,
					closePanels: closeSidePanels
				},
				websocket: {
					CHAT_SOCKET: socket
				},
				loadMoreMessages
			}}
		>
			{children}
		</CHAT_CONTEXT.Provider>
	)
}
