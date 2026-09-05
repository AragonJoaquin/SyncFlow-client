import type { SVGInterface } from '.'

export function SVGHash(props: SVGInterface) {
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
			<path d="M5 9l14 0" />
			<path d="M5 15l14 0" />
			<path d="M11 4l-4 16" />
			<path d="M17 4l-4 16" />
		</svg>
	)
}
