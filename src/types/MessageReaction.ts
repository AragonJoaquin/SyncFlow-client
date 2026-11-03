import type { UUIDv4 } from '.'

export type MessageReaction = {
	user_id: UUIDv4
	message_id: number
	unicode_char: string
	reacted_at: Date
	deleted_at?: unknown
}

export type MessageReactionRemoved = Pick<MessageReaction, 'user_id' | 'message_id' | 'unicode_char'>

export type MessageReactionAdded = MessageReactionRemoved & Pick<MessageReaction, 'reacted_at'>
