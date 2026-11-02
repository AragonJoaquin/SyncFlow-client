import { useCacheUsersStore, useOwnUserStore, useWorkGroupStore } from '@/store'
import type { Message } from '@/types'

export function useMessagePermissions(message: Message | null) {
	const ownUserId = useOwnUserStore((s) => s.user?.id)
	const ownerId = useWorkGroupStore((s) => s.workGroup?.owner_id)
	const ownRoleName = useCacheUsersStore((s) =>
		ownUserId ? s.users.get(ownUserId)?.membership?.group_role?.name?.toLowerCase() : undefined
	)
	const isPinned = useWorkGroupStore((s) =>
		message ? s.pinnedMessages.some((pinned) => pinned.message_id === message.id) : false
	)

	const isOwner = !!ownUserId && (ownerId === ownUserId || ownRoleName === 'owner')
	const isAdmin = isOwner || ownRoleName === 'admin'
	const isOwnMessage = !!message && !!ownUserId && message.sender_id === ownUserId

	return {
		isOwner,
		isAdmin,
		isOwnMessage,
		isPinned,
		canReply: !!message,
		canReact: !!message && !!ownUserId,
		canEdit: isOwnMessage,
		canDelete: isOwnMessage || isAdmin,
		canPin: isAdmin
	}
}
