import type { Message, UUIDv4 } from '.'

export type Channel = {
	id: number
	name: string
	created_at: Date

	user_creator: UUIDv4
	category_id: number
	messages: Message[]
}
