import type { UserStatus } from '@/types'

export const USER_STATUS = {
	active: 1,
	idle: 2,
	no_disturb: 3,
	disconnected: 4,
	invisible: 5
} as const

export type UserStatusKey = keyof typeof USER_STATUS

export const USER_STATUS_LABELS: Record<UserStatusKey, string> = {
	active: 'Active',
	idle: 'Idle',
	no_disturb: 'Do Not Disturb',
	disconnected: 'Disconnected',
	invisible: 'Invisible'
}

export const USER_STATUS_COLORS: Record<UserStatusKey, string> = {
	active: 'bg-green-500',
	idle: 'bg-amber-500',
	no_disturb: 'bg-red-500',
	disconnected: 'bg-zinc-500',
	invisible: 'bg-zinc-500'
}

// "disconnected" is a connection state. The user cannot pick it manually.
export const SELECTABLE_USER_STATUSES: readonly UserStatusKey[] = ['active', 'idle', 'no_disturb', 'invisible']

export const DEFAULT_USER_STATUS: UserStatusKey = 'active'

export function isUserStatusKey(value?: string | null): value is UserStatusKey {
	return value != null && Object.hasOwn(USER_STATUS, value)
}

export function userStatusFromId(id?: number | null): UserStatusKey | null {
	const entry = Object.entries(USER_STATUS).find(([, statusId]) => statusId === id)
	return entry ? (entry[0] as UserStatusKey) : null
}

export function getUserStatusKey(status?: Partial<UserStatus> | null): UserStatusKey {
	if (!status) return 'invisible'
	if (isUserStatusKey(status.name)) return status.name
	return userStatusFromId(status.id) ?? 'invisible'
}

export function createUserStatus(key: UserStatusKey): UserStatus {
	return { id: USER_STATUS[key], name: key }
}

export function userStatusFromDto(dto: { status_id: number; status_name: string }): UserStatus {
	const key = isUserStatusKey(dto.status_name) ? dto.status_name : (userStatusFromId(dto.status_id) ?? 'invisible')
	return createUserStatus(key)
}
