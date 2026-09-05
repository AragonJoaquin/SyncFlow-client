import type { SVGInterface } from '.'

export function SVGHamburger({ ...props }: SVGInterface) {
	return (
		<svg
			{...props}
			width="24"
			height="24"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="2"
			strokeLinecap="round"
			strokeLinejoin="round"
		>
			<path stroke="none" d="M0 0h24v24H0z" fill="none" />
			<path d="M4 6l16 0" />
			<path d="M4 12l16 0" />
			<path d="M4 18l16 0" />
		</svg>
	)
}
