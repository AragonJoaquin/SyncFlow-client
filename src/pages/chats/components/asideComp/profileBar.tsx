import { SFAvatarImage, SFProfilePopover } from '@/components'
import { getUserStatusKey, USER_STATUS_COLORS, USER_STATUS_LABELS } from '@/constants/userStatus'
import { useChatContext } from '@/context'
import { useOwnUserStore } from '@/store'

export function ProfileBar() {
	const { user } = useOwnUserStore()
	const {
		websocket: { isConnected }
	} = useChatContext()

	// The connection state is authoritative for "disconnected", while the chosen
	// status is used for everything else (active, idle, dnd, invisible).
	const presence = isConnected ? getUserStatusKey(user?.user_status) : 'disconnected'

	return (
		<span className="flex border-t-2 border-t-neutral-700 h-20 flex-row gap-2 items-center px-3 w-full">
			<span className="shrink-0">
				<SFAvatarImage src={user?.profile_picture} username={user?.name} />
			</span>
			<div className="flex flex-col min-w-0 flex-1">
				<h5 className="text-sm font-semibold text-whiteText truncate">{user?.name ?? 'You'}</h5>
				<span className="flex items-center gap-1">
					<div className={`h-2.5 w-2.5 rounded-full border border-neutral-700 ${USER_STATUS_COLORS[presence]}`} />
					<p className="text-xs text-neutral-400">{USER_STATUS_LABELS[presence]}</p>
				</span>
			</div>
			<div className="ml-auto shrink-0">
				<SFProfilePopover />
			</div>
		</span>
	)
}
