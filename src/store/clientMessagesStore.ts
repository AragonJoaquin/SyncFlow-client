import { create } from 'zustand'
import { type Channel, type ClientMessageQueueItem, STATUS_MESSAGE } from '@/types'
import { useOwnUserStore } from './userStore'

type channel_id = Channel['id']
type client_message = Omit<ClientMessageQueueItem, 'status' | 'sent_at' | 'channel_id' | 'sender_id'>

interface ClientMessagesStore {
	clientMessages: Map<channel_id, ClientMessageQueueItem[]>
	addClientMessage: (channelId: channel_id, message: client_message) => void
	removeClientMessage: (channelId: channel_id, tempId: string) => void
	getClientMessages: (channelId: channel_id) => ClientMessageQueueItem[]
}

export const useClientMessagesStore = create<ClientMessagesStore>((set, get) => ({
	clientMessages: new Map<channel_id, ClientMessageQueueItem[]>(),

	addClientMessage: (channelId, item) => {
		const user = useOwnUserStore.getState().user
		if (!user) return

		set((s) => {
			const newMap = new Map(s.clientMessages)
			newMap.set(channelId, [
				...(newMap.get(channelId) ?? []),
				{
					...item,
					sent_at: new Date(),
					sender_id: user.id,
					channel_id: channelId,
					status: STATUS_MESSAGE.STATUS_PENDING
				}
			])
			return { ...s, clientMessages: newMap }
		})
	},

	removeClientMessage: (channelId, tempId) => {
		const c = get().getClientMessages(channelId)
		set((s) => {
			if (!c) return s

			const filtered = c.filter((m) => m.tempId !== tempId)
			const newMap = new Map(s.clientMessages)
			if (filtered.length === 0) newMap.delete(channelId)
			else newMap.set(channelId, filtered)

			return { ...s, clientMessages: newMap }
		})
	},

	getClientMessages: (channelId) => get().clientMessages.get(channelId) ?? []
}))
