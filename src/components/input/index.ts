export * from './dumb-input'
export * from './edit-alias'
export * from './edit-description'
export * from './edit-email'
export * from './edit-name'
export * from './image-upload'
export * from './select-input'
export * from './text-input'
export * from './textarea'

export type AVAILABLE_INPUT_STYLES = 'classic' | 'ghost' | 'compact' | 'none'
export const INPUT_STYLINGS: Record<AVAILABLE_INPUT_STYLES, string> = {
	classic:
		'block w-full rounded-lg sm:rounded-xl border border-whiteText/70 bg-card py-2 px-3 sm:py-2.5 sm:px-4 text-sm sm:text-base text-foreground placeholder:text-foreground/40',
	ghost: 'border border-neutral-500! focus:border-neutral-300! rounded-md px-3 py-1',
	compact:
		'w-full px-3 py-2 bg-neutral-800 border border-zinc-700 rounded-lg text-whiteText text-sm outline-none focus:border-primaryText transition-colors',

	none: ''
}
