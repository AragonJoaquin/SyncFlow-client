import { useMemo } from 'react'
import { useClientMessagesStore, useWorkGroupStore } from '@/store'
import type { Channel, ClientMessageQueueItem, Message } from '@/types'

export const CLIENT_OR_SERVER = {
	SERVER: 'server',
	CLIENT: 'client'
} as const

export type client_or_server_message =
	| {
			type: (typeof CLIENT_OR_SERVER)['SERVER']
			message: Message
	  }
	| {
			type: (typeof CLIENT_OR_SERVER)['CLIENT']
			message: ClientMessageQueueItem
	  }

//TODO: optimize this
export function useMessagesHistory(channelId: Channel['id'] | null) {
	const categories = useWorkGroupStore((s) => s.categories)
	const clientMessages = useClientMessagesStore((s) => s.getClientMessages(channelId ?? -1))

	const history: client_or_server_message[] = useMemo(() => {
		if (!channelId) return []

		let serverMessages: Message[] = []

		for (const cat of categories.values()) {
			const ch = cat.channel.find((c) => c.id === channelId)
			if (!ch) continue
			serverMessages = ch.messages ?? []
			break
		}

		const merge = [
			...serverMessages.map<client_or_server_message>((s) => ({ type: CLIENT_OR_SERVER.SERVER, message: s })),
			...clientMessages.map<client_or_server_message>((s) => ({ type: CLIENT_OR_SERVER.CLIENT, message: s }))
		]

		return merge.sort((a, b) => a.message.sent_at.getTime() - b.message.sent_at.getTime())
	}, [categories, channelId, clientMessages])

	return history
}
