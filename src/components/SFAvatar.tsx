import type { User } from '@/types'
import { getPublicFileUrl } from '@/utils'
import { Avatar } from 'radix-ui'

interface ISFAvatar {
	src: User['profile_picture'] | string | null
	username: User['name'] | undefined
	size?: keyof typeof SIZES_OF_PICTURES
}

const SIZES_OF_PICTURES = {
	small: 28,
	medium: 42,
	big: 52,
	huge: 100,
	profile: 112
} as const

export function SFAvatarImage({ src, username, size = 'medium' }: ISFAvatar) {
	const dimensions = SIZES_OF_PICTURES[size]
	const avatar_name = username != null ? `${username}'s avatar` : 'Unknown avatar'
	const avatar_url = getPublicFileUrl(src)

	return (
		<figure className="shrink-0" style={{ width: `${dimensions}px`, height: `${dimensions}px` }}>
			<Avatar.Root className="size-full rounded-full overflow-hidden">
				{avatar_url && (
					<Avatar.Image
						src={avatar_url}
						style={{ width: `${dimensions}px`, height: `${dimensions}px` }}
						alt={avatar_name}
						className="size-full object-cover rounded-full border-2 border-darkBG"
					/>
				)}
				<Avatar.Fallback
					className="w-full h-full flex items-center justify-center font-semibold text-neutral-300 bg-dark1/80 rounded-full border-2 border-darkBG pointer-events-none select-none"
					style={{ fontSize: Math.max(11, dimensions * 0.4) }}
					aria-label={avatar_name}
				>
					{username?.trim().charAt(0).toUpperCase() || '?'}
				</Avatar.Fallback>
			</Avatar.Root>
		</figure>
	)
}
