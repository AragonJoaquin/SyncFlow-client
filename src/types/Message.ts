import type { MessageReaction, UUIDv4 } from '.'

export type MessageCreate = {
	content?: string
	citing_id?: number
	channel_id: number
	temp_id: string
}

export type MessageUpdate = {
	content: string
}

export type Message_NoSensibleData = {
	id: number
	content: string
	is_deleted: boolean
	sent_at: Date
	last_modified: Date | null

	modified_by: UUIDv4 | null
	citing_message: number | null
	channel_id: number
	sender_id: UUIDv4
	file_id: UUIDv4 | null
	reactions: MessageReaction[]
}

export type Message = Message_NoSensibleData
export type MessageRaw = Omit<Message, 'sent_at' | 'last_modified' | 'reactions'> & {
	sent_at: string
	last_modified: string | null
	reactions?: MessageReaction[] | null
}

export const MessageReactionRaw_To_MessageReaction = (reaction: MessageReaction): MessageReaction => ({
	...reaction,
	reacted_at: new Date(reaction.reacted_at)
})

export const MessageRaw_To_Message = (m: MessageRaw): Message => ({
	...m,
	sent_at: new Date(m.sent_at ?? ''),
	last_modified: m.last_modified ? new Date(m.last_modified) : null,
	reactions: (m.reactions ?? []).map(MessageReactionRaw_To_MessageReaction)
})

export type MessageMention = {
	message_id: number
	mentioned_user: UUIDv4
	mentioned_at: Date
}

//NOTE: "dtos"
export type ReceivedMessage = {
	message: MessageRaw
	temp_id?: string
}

export const STATUS_MESSAGE = {
	// STATUS_SENT: 'sent',
	STATUS_ERROR: 'error',
	STATUS_PENDING: 'pending'
} as const

export type ClientMessageQueueItem = {
	tempId: string
	status: (typeof STATUS_MESSAGE)[keyof typeof STATUS_MESSAGE]
	content: string
	sent_at: Date
	channel_id: number
	citing_message: number | null
	sender_id: UUIDv4
	file?: File | null
	previewUrl?: string
}
