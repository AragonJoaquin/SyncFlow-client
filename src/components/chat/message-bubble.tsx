import { SFAvatarImage } from '@/components/SFAvatar'
import { useMessageActions } from '@/context/hooks/useMessageActions'
import { useMessagePermissions } from '@/context/hooks/useMessagePermissions'
import { useMessageInteractionStore, useOwnUserStore } from '@/store'
import { FormatRelativeTime } from '@/utils'
import { memo, useMemo } from 'react'
import type { client_or_server_message } from '@/context/hooks/useMessagesHistory'
import type { Message, MessageReaction, User } from '@/types'
import {
	getAttachment,
	getDeliveryState,
	getMessageRowClassName,
	getSelectedEmojis,
	getServerMessage
} from './message-bubble/utils'
import { MessageActionBar } from './message-bubble/action-bar'
import { MessageHeader } from './message-bubble/header'
import { MessageCitation } from './message-bubble/citation'
import { MessageContent } from './message-bubble/content'
import { MessageExtras } from './message-bubble/extras'
import { MessageDialogs } from './message-bubble/dialogs'

//TODO: make a component for client and server type
export interface MessageBubbleProps {
	message: client_or_server_message
	sender: User | undefined
	showAvatar: boolean
	previewUrl?: string
	file_id?: string
	citedMessage?: Message
	citedSenderName?: string
}

const NO_REACTIONS: MessageReaction[] = []
const onResend = () => alert('implement this')

function MessageBubbleComponent({
	message,
	file_id,
	sender,
	showAvatar,
	previewUrl,
	citedMessage,
	citedSenderName
}: MessageBubbleProps) {
	const { message: msg } = message
	const serverMessage = getServerMessage(message)
	const messageId = serverMessage?.id ?? null

	const ownUserId = useOwnUserStore((s) => s.user?.id)
	const reactions = useMessageInteractionStore((s) =>
		messageId != null ? s.getMessageReactions(messageId) : NO_REACTIONS
	)

	const permissions = useMessagePermissions(serverMessage)
	const { editMessage, deleteMessage, toggleReaction, togglePin } = useMessageActions(serverMessage)

	const { isPending, isError } = getDeliveryState(message)
	const attachment = getAttachment(message, previewUrl, file_id)
	const formattedTime = FormatRelativeTime(msg?.sent_at ? new Date(msg.sent_at) : new Date())

	const selectedEmojis = useMemo(() => getSelectedEmojis(reactions, ownUserId), [ownUserId, reactions])

	return (
		<article
			id={serverMessage ? `message-${serverMessage.id}` : undefined}
			className={getMessageRowClassName(showAvatar, isPending, isError)}
		>
			{serverMessage && <MessageActionBar serverMessage={serverMessage} sender={sender} />}

			{showAvatar && (
				<span className="shrink-0">
					<SFAvatarImage src={sender?.profile_picture} username={sender?.alias_name} size="big" />
				</span>
			)}

			<section className="flex-1 min-w-0">
				{showAvatar && (
					<MessageHeader
						sender={sender}
						formattedTime={formattedTime}
						lastModified={!!serverMessage?.last_modified}
						isPending={isPending}
						isError={isError}
					/>
				)}

				{citedMessage && <MessageCitation citedMessage={citedMessage} citedSenderName={citedSenderName} />}

				<MessageContent serverMessage={serverMessage} content={msg.content} onSave={editMessage} />

				<MessageExtras
					showAvatar={showAvatar}
					lastModified={!!serverMessage?.last_modified}
					isError={isError}
					onResend={onResend}
					showReactions={serverMessage !== null}
					reactions={reactions}
					canReact={permissions.canReact}
					onToggleReaction={toggleReaction}
					previewUrl={attachment.previewUrl}
					fileId={attachment.fileId}
				/>
			</section>

			{serverMessage && (
				<MessageDialogs
					serverMessage={serverMessage}
					isPinned={permissions.isPinned}
					selectedEmojis={selectedEmojis}
					onDelete={deleteMessage}
					onToggleReaction={toggleReaction}
					onTogglePin={togglePin}
				/>
			)}
		</article>
	)
}

export const MessageBubble = memo(MessageBubbleComponent, (prev: MessageBubbleProps, next: MessageBubbleProps) => {
	return (
		prev.message.type === next.message.type &&
		prev.message.message === next.message.message &&
		prev.sender?.id === next.sender?.id &&
		prev.sender?.alias_name === next.sender?.alias_name &&
		prev.sender?.profile_picture?.id === next.sender?.profile_picture?.id &&
		prev.showAvatar === next.showAvatar &&
		prev.previewUrl === next.previewUrl &&
		prev.file_id === next.file_id &&
		prev.citedMessage === next.citedMessage &&
		prev.citedSenderName === next.citedSenderName
	)
})
