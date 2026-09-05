import type { User } from '@/types'
import { Avatar } from 'radix-ui'
import { SFSkeleton } from './SFSkeleton'

interface ISFAvatar {
	src: User['profile_picture']
	username: User['name'] | undefined
	size?: keyof typeof SIZES_OF_PICTURES
}

const SIZES_OF_PICTURES = {
	small: 24,
	medium: 38,
	big: 42,
	huge: 54
} as const

export function SFAvatarImage({ src, username, size = 'medium' }: ISFAvatar) {
	const avatar_name = username != null ? `${username}'s avatar` : 'Unknown avatar'
	return (
		<figure className="flex flex-col items-center w-fit">
			<Avatar.Root className="rounded-full overflow-hidden">
				<Avatar.Image src={src} alt={avatar_name} title={avatar_name} className="w-64 h-64 rounded-full" />
				<Avatar.Fallback className="text-1xl w-full h-full bg-neutral-700 flex items-center justify-center">
					<SFSkeleton variant="circle" width={SIZES_OF_PICTURES[size]} height={SIZES_OF_PICTURES[size]} />
				</Avatar.Fallback>
			</Avatar.Root>
		</figure>
	)
}
