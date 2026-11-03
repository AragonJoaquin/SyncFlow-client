import type { UserStatus } from '@/types'

export const USER_STATUS_KEYS = {
	ACTIVE: 'active',
	IDLE: 'idle',
	NO_DISTURB: 'no_disturb',
	DISCONNECTED: 'disconnected',
	INVISIBLE: 'invisible'
} as const

export type UserStatusKey = (typeof USER_STATUS_KEYS)[keyof typeof USER_STATUS_KEYS]

export const USER_STATUS: Record<UserStatusKey, number> = {
	[USER_STATUS_KEYS.ACTIVE]: 1,
	[USER_STATUS_KEYS.IDLE]: 2,
	[USER_STATUS_KEYS.NO_DISTURB]: 3,
	[USER_STATUS_KEYS.DISCONNECTED]: 4,
	[USER_STATUS_KEYS.INVISIBLE]: 5
} as const

export const USER_STATUS_LABELS: Record<UserStatusKey, string> = {
	[USER_STATUS_KEYS.ACTIVE]: 'Active',
	[USER_STATUS_KEYS.IDLE]: 'Idle',
	[USER_STATUS_KEYS.NO_DISTURB]: 'Do Not Disturb',
	[USER_STATUS_KEYS.DISCONNECTED]: 'Disconnected',
	[USER_STATUS_KEYS.INVISIBLE]: 'Invisible'
} as const

export const USER_STATUS_COLORS: Record<UserStatusKey, string> = {
	[USER_STATUS_KEYS.ACTIVE]: 'bg-green-500',
	[USER_STATUS_KEYS.IDLE]: 'bg-amber-500',
	[USER_STATUS_KEYS.NO_DISTURB]: 'bg-red-500',
	[USER_STATUS_KEYS.DISCONNECTED]: 'bg-zinc-500',
	[USER_STATUS_KEYS.INVISIBLE]: 'bg-zinc-500'
} as const

// "disconnected" is a connection state. The user cannot pick it manually.
export const SELECTABLE_USER_STATUSES: readonly UserStatusKey[] = [
	USER_STATUS_KEYS.ACTIVE,
	USER_STATUS_KEYS.IDLE,
	USER_STATUS_KEYS.NO_DISTURB,
	USER_STATUS_KEYS.INVISIBLE
] as const

export const DEFAULT_USER_STATUS: UserStatusKey = USER_STATUS_KEYS.ACTIVE

export function isUserStatusKey(value?: string | null): value is UserStatusKey {
	return value != null && Object.hasOwn(USER_STATUS, value)
}

export function userStatusFromId(id?: number | null): UserStatusKey | null {
	const entry = Object.entries(USER_STATUS).find(([, statusId]) => statusId === id)
	return entry ? (entry[0] as UserStatusKey) : null
}

export function getUserStatusKey(status?: Partial<UserStatus> | null): UserStatusKey {
	if (!status) return USER_STATUS_KEYS.INVISIBLE
	if (isUserStatusKey(status.name)) return status.name
	return userStatusFromId(status.id) ?? USER_STATUS_KEYS.INVISIBLE
}

export const createUserStatus = (key: UserStatusKey): UserStatus => ({ id: USER_STATUS[key], name: key })

export function userStatusFromDto(dto: { status_id: number; status_name: string }): UserStatus {
	const key = isUserStatusKey(dto.status_name)
		? dto.status_name
		: (userStatusFromId(dto.status_id) ?? USER_STATUS_KEYS.INVISIBLE)
	return createUserStatus(key)
}
