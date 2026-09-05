import type { SVGInterface } from '.'

export function SVGChevronArrow({ ...props }: SVGInterface) {
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
			<path d="M4 11l8 3l8 -3" />
		</svg>
	)
}
