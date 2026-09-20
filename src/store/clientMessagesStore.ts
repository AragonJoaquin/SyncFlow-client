import { create } from 'zustand'
import { type Channel, type Message, type MessageClientStatus, STATUS_MESSAGE } from '@/types'

type channel_id = Channel['id']

interface ClientMessagesStore {
	clientMessages: Map<channel_id, MessageClientStatus[]>
	addClientMessage: (channelId: channel_id, message: Message, tempId: string) => void
	confirmMessage: (channelId: channel_id, tempId: string, serverMessage: Message) => void
	removeClientMessage: (channelId: channel_id, tempId: string) => void
	getClientMessages: (channelId: channel_id) => MessageClientStatus[]
}

export const useClientMessagesStore = create<ClientMessagesStore>((set, get) => ({
	clientMessages: new Map(),

	addClientMessage: (channelId, message, tempId) => {
		const messageWithTemp: MessageClientStatus = {
			message,
			status: STATUS_MESSAGE.STATUS_SENT,
			tempId
		}

		set((s) => {
			const newMap = new Map(s.clientMessages)
			newMap.set(channelId, [...(newMap.get(channelId) ?? []), messageWithTemp])
			return { ...s, clientMessages: newMap }
		})
	},

	confirmMessage: (channelId, tempId, _) => {
		set((s) => {
			const c = get().getClientMessages(channelId)
			if (!c) return s
			const filtered = c.filter((m) => m.tempId !== tempId)
			const newMap = new Map(s.clientMessages)

			if (filtered.length === 0) newMap.delete(channelId)
			else newMap.set(channelId, filtered)

			return { ...s, clientMessages: newMap }
		})
	},

	removeClientMessage: (channelId, tempId) => {
		set((s) => {
			const c = get().getClientMessages(channelId)
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
