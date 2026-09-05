import { BASE_URL } from '@/utils'
import type { CSSProperties, ImgHTMLAttributes } from 'react'
import { SFSkeleton } from './SFSkeleton'

interface ISFImage {
	className?: string
	imageUrl: string | undefined
	title: string
	groupId?: number
	width?: number
	height?: number
	props?: ImgHTMLAttributes<HTMLImageElement>
}

//groupId means its private
export function SFImage({ imageUrl, title, groupId, width = 75, height = 75, props, className }: ISFImage) {
	const sharedStyles: CSSProperties = {
		width,
		height
	}
	const url = `${BASE_URL}/upload/${groupId != undefined ? 'private' : 'public'}/${imageUrl}${groupId != undefined ? `/${groupId}` : ''}`

	return (
		<>
			{imageUrl != null ? (
				<img
					title={title}
					alt={`Image ${title}`}
					src={url}
					loading="lazy"
					className={`${className}`}
					{...props}
					style={sharedStyles}
				/>
			) : (
				<>
					{/*change to an actual default image*/}
					<SFSkeleton width={width} height={height} style={sharedStyles} title="Image not found" />
				</>
			)}
		</>
	)
}
