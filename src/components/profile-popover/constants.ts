import {
	SELECTABLE_USER_STATUSES,
	USER_STATUS,
	USER_STATUS_COLORS,
	USER_STATUS_LABELS,
	type UserStatusKey
} from '@/constants/userStatus'

export {
	SELECTABLE_USER_STATUSES,
	USER_STATUS as STATES_ENUM,
	USER_STATUS_COLORS as STATES_COLORS,
	USER_STATUS_LABELS as STATES_LABELS
}
export type { UserStatusKey }

export const STATES_NAMES: Record<Uppercase<UserStatusKey>, UserStatusKey> = {
	ACTIVE: 'active',
	IDLE: 'idle',
	NO_DISTURB: 'no_disturb',
	DISCONNECTED: 'disconnected',
	INVISIBLE: 'invisible'
} as const
