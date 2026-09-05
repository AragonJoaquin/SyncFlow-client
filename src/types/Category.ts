import type { Channel, UUIDv4 } from '.'

export interface Category {
	id: number
	description: string
	name: string
	created_at: Date

	group_id: number
	user_creator: UUIDv4
}

export interface CategoryWithChannels extends Category {
	channel: Channel[]
}
