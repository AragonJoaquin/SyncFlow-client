import type { User, UUIDv4 } from '.'

export type Message = {
	id: number
	content: string
	is_deleted?: boolean // only matters before asserting the message to the state
	sent_at: Date
	last_modified?: Date

	modified_by?: UUIDv4
	citing_message?: number
	channel_id: number
	sender_id: UUIDv4
	file_id?: UUIDv4
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
