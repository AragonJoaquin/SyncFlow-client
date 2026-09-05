import type { CategoryWithChannels, FileRepo, GroupMemberWithProfile, UUIDv4 } from '.'

export type WorkGroup = {
	id: number
	name: string
	description?: string
	created_at: Date
	deleted_at?: Date

	group_type: GroupType
	owner_id: UUIDv4
	group_pic?: UUIDv4
}

export type GroupRole = {
	id: number
	name: string
}

export type GroupType = {
	id: number
	name: string
}

export interface Group_User {
	group_id: number
	user_id: UUIDv4

	group_role: GroupRole
	status_id: number
}

export type FullWorkGroup = {
	work_group: WorkGroup
	file_repo: FileRepo | null
	category: CategoryWithChannels[]
	users: GroupMemberWithProfile[]
}
