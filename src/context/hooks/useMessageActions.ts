import { useAxios } from '@/api'
import {
	useCacheUsersStore,
	useMessageInteractionStore,
	useOwnUserStore,
	useToastStore,
	useWorkGroupStore
} from '@/store'
import type { Message, MessageRaw, PinnedMessage } from '@/types'
import { MessageRaw_To_Message } from '@/types'
import { useCallback } from 'react'
import { useShallow } from 'zustand/shallow'

const MAX_MESSAGE_LENGTH = 150

export function useMessageActions(message: Message | null) {
	const { get, put, post, delete: remove } = useAxios()

	const ownUser = useOwnUserStore((s) => s.user)

	const { addSuccessToast } = useToastStore(useShallow((s) => ({ addSuccessToast: s.addSuccessToast })))

	const { updateMessage, removeMessage, addPinnedMessage, removePinnedMessage, setPinnedMessages } = useWorkGroupStore(
		useShallow((s) => ({
			updateMessage: s.updateMessage,
			removeMessage: s.removeMessage,
			addPinnedMessage: s.addPinnedMessage,
			removePinnedMessage: s.removePinnedMessage,
			setPinnedMessages: s.setPinnedMessages
		}))
	)

	const { addMessageReaction, removeMessageReaction, clearMessageReactions, clearReplyTarget } =
		useMessageInteractionStore(
			useShallow((s) => ({
				addMessageReaction: s.addMessageReaction,
				removeMessageReaction: s.removeMessageReaction,
				clearMessageReactions: s.clearMessageReactions,
				clearReplyTarget: s.clearReplyTarget
			}))
		)

	const refreshPinnedMessages = useCallback(async () => {
		const groupId = useWorkGroupStore.getState().workGroup?.id
		if (!groupId) return

		const { data } = await get<PinnedMessage[]>(`/work_group/${groupId}/pinned_messages`, { silent: true })
		if (!data.error) setPinnedMessages(data.data ?? [])
	}, [get, setPinnedMessages])

	const editMessage = useCallback(
		async (content: string) => {
			if (!message) return false

			const nextContent = content.trim()
			if (!nextContent || nextContent.length > MAX_MESSAGE_LENGTH) return false

			const { data } = await put<MessageRaw>(`/channel/${message.channel_id}/messages/${message.id}`, {
				content: nextContent
			})

			if (data.error) return false

			updateMessage(message.channel_id, message.id, MessageRaw_To_Message(data.data))

			const pinnedMessages = useWorkGroupStore.getState().pinnedMessages
			if (pinnedMessages.some((pinned) => pinned.message_id === message.id)) {
				setPinnedMessages(
					pinnedMessages.map((pinned) =>
						pinned.message_id === message.id ? { ...pinned, content: nextContent } : pinned
					)
				)
			}

			addSuccessToast('Message updated')
			return true
		},
		[addSuccessToast, message, put, setPinnedMessages, updateMessage]
	)

	const deleteMessage = useCallback(async () => {
		if (!message) return false

		const { data } = await remove<null>(`/channel/${message.channel_id}/messages/${message.id}`)
		if (data.error) return false

		removeMessage(message.channel_id, message.id)
		removePinnedMessage(message.id)
		clearMessageReactions(message.id)

		const replyTarget = useMessageInteractionStore.getState().replyTarget
		if (replyTarget?.messageId === message.id) clearReplyTarget()

		addSuccessToast('Message deleted')
		return true
	}, [addSuccessToast, clearMessageReactions, clearReplyTarget, message, remove, removeMessage, removePinnedMessage])

	const toggleReaction = useCallback(
		async (emoji: string) => {
			if (!message || !ownUser) return false

			const reactions = useMessageInteractionStore.getState().getMessageReactions(message.id)
			const hasReacted = reactions.some((r) => r.user_id === ownUser.id && r.unicode_char === emoji)

			const { data } = hasReacted
				? await remove<null>(`/channel/${message.channel_id}/messages/${message.id}/reactions`, { emoji })
				: await put<null>(`/channel/${message.channel_id}/messages/${message.id}/reactions`, { emoji })

			if (data.error) return false

			if (hasReacted) removeMessageReaction(message.id, ownUser.id, emoji)
			else
				addMessageReaction({
					user_id: ownUser.id,
					message_id: message.id,
					unicode_char: emoji,
					reacted_at: new Date()
				})

			return true
		},
		[addMessageReaction, message, ownUser, put, remove, removeMessageReaction]
	)

	const togglePin = useCallback(async () => {
		if (!message) return false

		const isPinned = useWorkGroupStore.getState().isMessagePinned(message.id)
		const { data } = isPinned
			? await remove<null>(`/channel/${message.channel_id}/messages/${message.id}/pin`)
			: await post<null>(`/channel/${message.channel_id}/messages/${message.id}/pin`)

		if (data.error) return false

		if (isPinned) {
			removePinnedMessage(message.id)
			addSuccessToast('Message unpinned')
		} else {
			const channel = useWorkGroupStore.getState().getChannel(message.channel_id)
			const sender = useCacheUsersStore.getState().getUser(message.sender_id)?.user

			addPinnedMessage({
				message_id: message.id,
				content: message.content,
				channel_id: message.channel_id,
				channel_name: channel?.name ?? '',
				sender_id: message.sender_id,
				sender_name: sender?.alias_name ?? sender?.name ?? 'Unknown',
				pinned_at: new Date().toISOString(),
				pinned_by: ownUser?.id ?? message.sender_id
			})
			addSuccessToast('Message pinned')
		}

		await refreshPinnedMessages()
		return true
	}, [
		addPinnedMessage,
		addSuccessToast,
		message,
		ownUser?.id,
		post,
		refreshPinnedMessages,
		remove,
		removePinnedMessage
	])

	return {
		editMessage,
		deleteMessage,
		toggleReaction,
		togglePin
	}
}
