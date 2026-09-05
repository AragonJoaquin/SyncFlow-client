export const STATES_ENUM = {
	active: 1,
	disconnected: 2,
	invisible: 3
} as const

export const STATES_NAMES: Record<Uppercase<keyof typeof STATES_ENUM>, keyof typeof STATES_ENUM> = {
	ACTIVE: 'active',
	DISCONNECTED: 'disconnected',
	INVISIBLE: 'invisible'
} as const

export const STATES_COLORS: Record<keyof typeof STATES_ENUM, `bg-${string}`> = {
	invisible: 'bg-zinc-500',
	disconnected: 'bg-red-600!',
	active: 'bg-green-600!'
} as const
