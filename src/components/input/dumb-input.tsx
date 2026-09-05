import type { HTMLInputTypeAttribute, HTMLProps, RefObject } from 'react'
import { INPUT_STYLINGS, type AVAILABLE_INPUT_STYLES } from '.'

type inputProps = HTMLProps<HTMLInputElement>

type IDumbInput = {
	styling?: AVAILABLE_INPUT_STYLES
	ref?: RefObject<HTMLInputElement>
	className?: string
	type: HTMLInputTypeAttribute
	placeholder?: string
	opts?: {
		[K in keyof inputProps]: inputProps[K]
	}
}

// its dumb bc it doesnt have any logic
export function DumbInput({ styling = 'none', ref, className, type, placeholder, opts }: IDumbInput) {
	return (
		<input
			type={type}
			ref={ref}
			className={`focus:outline-none focus:ring-0 focus:border-transparent ${INPUT_STYLINGS[styling]} ${className}`}
			placeholder={placeholder}
			{...(opts != null && { ...opts })}
		/>
	)
}
