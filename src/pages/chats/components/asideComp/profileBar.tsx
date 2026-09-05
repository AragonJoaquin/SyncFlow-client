import { SFAvatarImage, SFProfilePopover } from '@/components'
import { STATES_COLORS } from '@/components/profile-popover'
import { useOwnUserStore } from '@/store'

export function ProfileBar() {
	const { user } = useOwnUserStore()
	const user_status: keyof typeof STATES_COLORS =
		(user?.user_status?.name?.toLowerCase() as keyof typeof STATES_COLORS) ?? 'invisible'

	return (
		<span className="flex border-t-2 border-t-neutral-700 h-20 flex-row gap-2 items-center px-3 w-full">
			<span className="shrink-0">
				<SFAvatarImage src={user?.profile_picture} username={user?.name} />
			</span>
			<div className="flex flex-col min-w-0 flex-1">
				<h5 className="text-sm font-semibold text-whiteText truncate">{user?.name ?? 'You'}</h5>
				<span className="flex items-center gap-1">
					<div
						className={`h-2.5 w-2.5 rounded-full border border-neutral-700 ${STATES_COLORS[user_status as keyof typeof STATES_COLORS]}`}
					/>
					<p className="text-xs text-neutral-400 capitalize">{user_status}</p>
				</span>
			</div>
			<div className="ml-auto shrink-0">
				<SFProfilePopover />
			</div>
		</span>
	)
}
