import type { UUIDv4, FileURL } from '.'

export interface PinnedMessage {
	message_id: number
	content: string
	channel_id: number
	channel_name: string
	sender_id: UUIDv4
	sender_name: string
	sender_picture?: FileURL
	pinned_at: string
	pinned_by: UUIDv4
}
