import type { HTMLAttributes, ReactNode } from 'react'

const AVAILABLE_BUTTON_STYLES = {
	primary: 'bg-primaryText text-dark1 font-bold',
	secondary: 'bg-neutral-800 text-whiteText border border-neutral-700',

	terciary: 'p-1.5! rounded-lg! hover:bg-neutral-700! text-unfocused! hover:text-whiteText! min-w-0!',
	none: 'min-w-0!'
} as const

type RequiredProps = {
	styling: keyof typeof AVAILABLE_BUTTON_STYLES
	type?: HTMLButtonElement['type']
	children: ReactNode
	disabled?: boolean
}

type ISFButton = Partial<HTMLAttributes<HTMLButtonElement>> & RequiredProps

export function SFButton({ children, styling = 'none', type = 'button', disabled = false, ...props }: ISFButton) {
	return (
		<button
			{...props}
			type={type}
			disabled={disabled}
			className={`px-4 py-1.5 min-w-[100px] text-[15px] rounded-lg hover:cursor-pointer hover:brightness-105 transition-colors ${AVAILABLE_BUTTON_STYLES[styling]} ${props?.className}`}
		>
			{children}
		</button>
	)
}
