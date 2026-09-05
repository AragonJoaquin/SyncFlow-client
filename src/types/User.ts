import type { FileURL, Group_User, UUIDv4 } from '.'

export type User = {
	id: UUIDv4
	name: string
	description?: string
	created_at: Date
	alias_name: string
	email: string

	profile_picture?: FileURL
	user_status: UserStatus
}

export type UserStatus = {
	id: number
	name: string
}

// extras:
export type UserWithJWT = {
	user: User
	jwt_token: string
}

export type GroupMemberWithProfile = {
	membership: Group_User
	user: User
}
