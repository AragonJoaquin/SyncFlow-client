export const ROLE_TYPES_ENUM = {
	OWNER: 'Owner',
	ADMIN: 'Admin',
	MEMBER: 'Member'
} as const

export type role_types = (typeof ROLE_TYPES_ENUM)[keyof typeof ROLE_TYPES_ENUM]

export const ROLE_COLORS: Record<keyof typeof ROLE_TYPES_ENUM, string> = {
	OWNER: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
	ADMIN: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
	// Moderator: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
	MEMBER: 'bg-neutral-600/30 text-neutral-400 border-neutral-500/30'
} as const

export const ROLE_ORDER: role_types[] = ['Owner', 'Admin', 'Member'] as const
