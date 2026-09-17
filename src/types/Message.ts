import type { User, UUIDv4 } from '.'

export type Message = {
	id: number
	content: string
	is_deleted: boolean // only matters before asserting the message to the state
	sent_at: Date
	last_modified: Date | null

	modified_by: UUIDv4 | null
	citing_message: number | null
	channel_id: number
	sender_id: UUIDv4
	file_id: UUIDv4 | null
}

export const MessageClientStatus = {
	STATUS_SENT: 'sent',
	STATUS_ERROR: 'error'
} as const

export type MessageClientStatus = {
	Message: Message
	Status: (typeof MessageClientStatus)[keyof typeof MessageClientStatus]
}

export type MessageReaction = {
	user_id: UUIDv4
	message_id: number
	unicode_char: string
	reacted_at: Date
}

export type MessageMention = {
	message_id: number
	mentioned_user: UUIDv4
	mentioned_at: Date
}

export type MessageWithUser = {
	message: Message
	sender: User | undefined
}
