import { useAxios, WS_ACTIONS } from '@/api'
import { useChatSocket } from '@/context/chatContext'
import {
	useCacheUsersStore,
	useMessageInteractionStore,
	useOwnUserStore,
	useToastStore,
	useWorkGroupStore
} from '@/store'
import { queueReactionRequest, REACTION_REQ_KIND } from '@/store/interactions'
import type { Message, MessageRaw, MessageReaction, PinnedMessage } from '@/types'
import { MessageRaw_To_Message } from '@/types'
import { useCallback } from 'react'
import { useShallow } from 'zustand/shallow'

const MAX_MESSAGE_LENGTH = 150

export function useMessageActions(message: Message | null) {
	const { get, put, post, delete: remove } = useAxios()
	const socket = useChatSocket()

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

		const interactionStore = useMessageInteractionStore.getState()
		removeMessage(message.channel_id, message.id)
		removePinnedMessage(message.id)
		interactionStore.clearMessageReactions(message.id)

		if (interactionStore.replyTarget?.messageId === message.id) interactionStore.clearReplyTarget()

		return true
	}, [message, remove, removeMessage, removePinnedMessage])

	const toggleReaction = useCallback(
		async (emoji: string) => {
			const ownUser = useOwnUserStore.getState().user
			if (!message || !ownUser) return false
			if (socket.socket.readyState !== WebSocket.OPEN) return false

			const interactionStore = useMessageInteractionStore.getState()

			const optimisticReaction: MessageReaction = {
				user_id: ownUser.id,
				message_id: message.id,
				unicode_char: emoji,
				reacted_at: new Date()
			} as const

			const hasReacted = interactionStore
				.getMessageReactions(message.id)
				.some((r) => r.user_id === ownUser.id && r.unicode_char === emoji)

			// Apply the change immediately so the UI never waits on the server.
			if (hasReacted) interactionStore.removeMessageReaction(message.id, ownUser.id, emoji)
			else interactionStore.addMessageReaction(optimisticReaction)

			const kind = hasReacted ? REACTION_REQ_KIND.REMOVE : REACTION_REQ_KIND.ADD

			try {
				socket.sendPayload(
					kind === REACTION_REQ_KIND.ADD ? WS_ACTIONS.WS_ADD_REACTION : WS_ACTIONS.WS_REMOVE_REACTION,
					{
						channel_id: message.channel_id,
						message_id: message.id,
						emoji
					}
				)
			} catch {
				// the request never left the client, so undo the optimistic change.
				if (kind === REACTION_REQ_KIND.ADD) interactionStore.removeMessageReaction(message.id, ownUser.id, emoji)
				else interactionStore.addMessageReaction(optimisticReaction)
				return false
			}

			queueReactionRequest({
				kind,
				messageId: message.id,
				userId: ownUser.id,
				emoji,
				reactedAt: optimisticReaction.reacted_at
			})

			return true
		},
		[message, socket]
	)

	const togglePin = useCallback(async () => {
		if (!message) return false

		const ownUser = useOwnUserStore.getState().user
		const isPinned = useWorkGroupStore.getState().isMessagePinned(message.id)
		const { data } = isPinned
			? await remove<null>(`/channel/${message.channel_id}/messages/${message.id}/pin`)
			: await post<null>(`/channel/${message.channel_id}/messages/${message.id}/pin`)

		if (data.error) return false

		//this just saves like 4 lines
		const togglePinCb = () => {
			if (isPinned) {
				removePinnedMessage(message.id)
				addSuccessToast('Message unpinned')
				return
			}

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

		//remember to call it lol
		togglePinCb()
		await refreshPinnedMessages()
		return true
	}, [addPinnedMessage, addSuccessToast, message, post, refreshPinnedMessages, remove, removePinnedMessage])

	return {
		editMessage,
		deleteMessage,
		toggleReaction,
		togglePin
	}
}
