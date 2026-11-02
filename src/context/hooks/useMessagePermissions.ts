import { useCacheUsersStore, useOwnUserStore, useWorkGroupStore } from '@/store'
import type { Message } from '@/types'

export function useMessagePermissions(message: Message | null) {
	const ownUser = useOwnUserStore((s) => s.user)
	const workGroup = useWorkGroupStore((s) => s.workGroup)
	const ownMembership = useCacheUsersStore((s) => (ownUser ? s.users.get(ownUser.id)?.membership : undefined))
	const isPinned = useWorkGroupStore((s) =>
		message ? s.pinnedMessages.some((pinned) => pinned.message_id === message.id) : false
	)

	const roleName = ownMembership?.group_role?.name?.toLowerCase()
	const isOwner = workGroup?.owner_id === ownUser?.id || roleName === 'owner'
	const isAdmin = isOwner || roleName === 'admin'
	const isOwnMessage = !!message && !!ownUser && message.sender_id === ownUser.id

	return {
		isOwner,
		isAdmin,
		isOwnMessage,
		isPinned,
		canReply: !!message,
		canReact: !!message && !!ownUser,
		canEdit: isOwnMessage,
		canDelete: isOwnMessage || isAdmin,
		canPin: isAdmin
	}
}
