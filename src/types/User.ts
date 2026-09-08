import type { FileRepo, Group_User, UUIDv4 } from '.'

export type User = {
	id: UUIDv4
	name: string
	description?: string
	created_at: Date
	alias_name: string
	email: string

	profile_picture?: FileRepo
	user_status: UserStatus
}

export type UserStatus = {
	id: number
	name: string
}

export type GroupMemberWithProfile = {
	membership: Group_User
	user: User
}
