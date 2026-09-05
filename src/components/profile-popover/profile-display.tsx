import { SVGEdit, SVGPen } from '@/components/svgs'
import type { User } from '@/types'
import { INVALID_DATE } from '@/utils'
import { SFAvatarImage } from '../SFAvatar'
import { SFButton } from '../SFButton'
import { STATES_ENUM, STATES_NAMES } from './constants'
import { StatusSelector } from './status-selector'

interface ProfileDisplayProps {
	user: User
	onEdit: () => void
	onStatusChange: (status: string) => void
}

export function ProfileDisplay({ user, onEdit, onStatusChange }: ProfileDisplayProps) {
	const statusName: keyof typeof STATES_ENUM = STATES_ENUM[user.user_status.name as keyof typeof STATES_ENUM]
		? (user.user_status.name as keyof typeof STATES_ENUM)
		: STATES_NAMES.INVISIBLE

	return (
		<article className="flex flex-col gap-3">
			<header className="flex items-start gap-3">
				<span className="shrink-0 relative overflow-hidden *:last:opacity-0 hover:*:last:opacity-100 *:transition-all">
					<SFAvatarImage src={user.profile_picture} username={user.name} />
					<div className="absolute w-full h-full inset-0 bg-neutral-900/20 rounded-4xl">
						<SVGPen className="w-6 h-6 absolute top-1/2 left-1/2 -translate-1/2" />
					</div>
				</span>

				<span className="flex-1 min-w-0">
					<h4 className="text-base font-semibold text-whiteText truncate">{user.name}</h4>
					<p className="text-sm text-unfocused truncate">@{user.alias_name}</p>
				</span>

				<SFButton
					styling="none"
					type="button"
					onClick={onEdit}
					className="p-1.5 rounded-lg hover:bg-neutral-700 transition-colors cursor-pointer text-unfocused hover:text-whiteText"
					aria-label="Edit profile"
				>
					<SVGEdit className="w-4 h-4" />
				</SFButton>
			</header>

			{user.description && <p className="text-sm text-unfocused leading-relaxed">{user.description}</p>}

			<span className="border-t border-zinc-700 pt-2">
				<StatusSelector currentStatus={statusName} onStatusChange={onStatusChange} />
			</span>

			<footer className="border-t border-zinc-700 pt-2 space-y-1">
				<span className="flex justify-between items-center text-sm">
					<h6 className="text-unfocused">Email</h6>
					<p className="text-whiteText truncate ml-4">{user?.email ?? 'Unknown'}</p>
				</span>

				<span className="flex justify-between items-center text-sm">
					<h6 className="text-unfocused">Member since</h6>
					<p className="text-whiteText">
						{user.created_at.toString() !== INVALID_DATE
							? user.created_at.toLocaleDateString('en-US', {
									month: 'short',
									year: '2-digit'
								})
							: 'Unknown'}
					</p>
				</span>
			</footer>
		</article>
	)
}
