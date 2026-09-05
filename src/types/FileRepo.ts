import type { UUIDv4 } from '.'

export type FileRepo = {
	id: UUIDv4
	filename: string
	submitted_at: Date
	user_id: UUIDv4

	file_type: FileType
}

export type FileType = {
	id: number
	name: string
}
