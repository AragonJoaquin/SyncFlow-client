import { CLIENT_OR_SERVER, type client_or_server_message } from '@/context/hooks/useMessagesHistory'
import { STATUS_MESSAGE, type Message, type MessageReaction, type User } from '@/types'

export const getServerMessage = (message: client_or_server_message): Message | null =>
	message.type === CLIENT_OR_SERVER.SERVER ? message.message : null

export function getDeliveryState(message: client_or_server_message) {
	const isClient = message.type === CLIENT_OR_SERVER.CLIENT

	return {
		isPending: isClient && message.message.status === STATUS_MESSAGE.STATUS_PENDING,
		isError: isClient && message.message.status === STATUS_MESSAGE.STATUS_ERROR
	}
}

export function getAttachment(
	message: client_or_server_message,
	previewUrl: string | undefined,
	fileId: string | undefined
) {
	const clientPreviewUrl = message.type === CLIENT_OR_SERVER.CLIENT ? message.message.previewUrl : undefined
	const serverFileId = message.type === CLIENT_OR_SERVER.SERVER ? (message.message.file_id ?? undefined) : undefined

	return {
		previewUrl: previewUrl || clientPreviewUrl,
		fileId: fileId ?? serverFileId
	}
}

export const getSelectedEmojis = (reactions: MessageReaction[], ownUserId: User['id'] | undefined) =>
	!ownUserId
		? []
		: reactions.filter((reaction) => reaction.user_id === ownUserId).map((reaction) => reaction.unicode_char)

export const getMessageRowClassName = (showAvatar: boolean, isPending: boolean, isError: boolean) =>
	`group relative flex gap-3 px-2 py-0.5 hover:bg-neutral-800/30 -mx-2 rounded ${!showAvatar ? 'pl-[42px]' : ''} ${isPending ? 'opacity-60' : ''} ${isError ? 'bg-red-500/10' : ''}`
