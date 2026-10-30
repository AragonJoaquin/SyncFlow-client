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

// Payload broadcast by the server through WS_UPDATED_STATUS.
export type UserStatusUpdate = {
	user_id: UUIDv4
	status_id: number
	status_name: string
}

export type GroupMemberWithProfile = {
	membership: Group_User
	user: User
}
