import { useMemo } from 'react'
import { useClientMessagesStore, useWorkGroupStore } from '@/store'
import type { Channel, MessageClientStatus, Message } from '@/types'

//TODO: optimize this
export function useMessagesHistory(channelId: Channel['id'] | null) {
	const categories = useWorkGroupStore((s) => s.categories)
	const clientMessages = useClientMessagesStore((s) => s.getClientMessages(channelId ?? -1))

	const history = useMemo(() => {
		if (!channelId) return []

		let serverMessages: Message[] = []

		for (const cat of categories.values()) {
			const ch = cat.channel.find((c) => c.id === channelId)
			if (!ch) continue
			serverMessages = ch.messages ?? []
			break
		}

		const merged: MessageClientStatus[] = [
			...serverMessages.map((m) => ({ message: m, status: undefined })),
			...clientMessages.map((pcs) => ({ message: pcs.message, status: pcs.status }))
		]

		merged.sort((a, b) => a.message.sent_at.getTime() - b.message.sent_at.getTime())

		return merged
	}, [categories, channelId, clientMessages])

	return history
}
