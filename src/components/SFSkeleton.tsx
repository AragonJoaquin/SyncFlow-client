import { type HTMLAttributes } from 'react'

interface SkeletonProps extends HTMLAttributes<HTMLDivElement> {
	variant?: keyof typeof VARIANTS
	width?: string | number
	height?: string | number
}

const VARIANTS = {
	rect: 'rounded-md',
	circle: 'rounded-full',
	text: 'rounded-sm h-4 w-full'
}

export function SFSkeleton({ variant = 'rect', width, height, className, ...props }: SkeletonProps) {
	return (
		<div
			className={`animate-pulse bg-zinc-700 ${VARIANTS[variant]} ${className}`}
			style={{
				width,
				height
			}}
			{...props}
		/>
	)
}
