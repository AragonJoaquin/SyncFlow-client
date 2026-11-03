import { SFButton } from '@/components/SFButton'
import { SVGEdit, SVGPin, SVGReply, SVGSmile, SVGTrash } from '@/components/svgs'
import { useMessagePermissions } from '@/context/hooks/useMessagePermissions'
import { useMessageInteractionStore, useMessageUIStore } from '@/store'
import { MESSAGE_DIALOG, type MessageDialogType } from '@/store/messageUIStore'
import type { Message, User } from '@/types'

interface MessageActionBarProps {
	serverMessage: Message
	sender: User | undefined
}

export function MessageActionBar({ serverMessage, sender }: MessageActionBarProps) {
	const permissions = useMessagePermissions(serverMessage)
	const isEditing = useMessageUIStore((s) => s.editingMessageId === serverMessage.id)
	const openDialog = useMessageUIStore((s) => s.openDialog)
	const startEditing = useMessageUIStore((s) => s.startEditing)
	const setReplyTarget = useMessageInteractionStore((s) => s.setReplyTarget)

	const handleReply = () => {
		setReplyTarget({
			messageId: serverMessage.id,
			channelId: serverMessage.channel_id,
			senderId: serverMessage.sender_id,
			senderName: sender?.alias_name ?? sender?.name ?? 'Unknown',
			content: serverMessage.content || (serverMessage.file_id ? 'Attachment' : '')
		})
	}

	const handleOpenDialog = (type: MessageDialogType) => openDialog(serverMessage.id, type)

	return (
		<section className="absolute -top-3 right-2 z-20 flex items-center gap-0.5 rounded-lg border border-neutral-700 bg-darkFG/95 p-0.5 shadow-lg backdrop-blur opacity-0 pointer-events-none transition-opacity group-hover:opacity-100 group-hover:pointer-events-auto group-focus-within:opacity-100 group-focus-within:pointer-events-auto">
			{permissions.canReact && (
				<SFButton
					styling="none"
					type="button"
					title="Add reaction"
					aria-label="Add reaction"
					onClick={() => handleOpenDialog(MESSAGE_DIALOG.EMOJI)}
					className="p-1.5! rounded-md! text-unfocused! hover:text-whiteText! hover:bg-neutral-700! transition-colors"
				>
					<SVGSmile className="w-4 h-4" />
				</SFButton>
			)}

			{permissions.canReply && (
				<SFButton
					styling="none"
					type="button"
					title="Reply"
					aria-label="Reply to message"
					onClick={handleReply}
					className="p-1.5! rounded-md! text-unfocused! hover:text-whiteText! hover:bg-neutral-700! transition-colors"
				>
					<SVGReply className="w-4 h-4" />
				</SFButton>
			)}

			{permissions.canEdit && !isEditing && (
				<SFButton
					styling="none"
					type="button"
					title="Edit message"
					aria-label="Edit message"
					onClick={() => startEditing(serverMessage.id, serverMessage.content)}
					className="p-1.5! rounded-md! text-unfocused! hover:text-whiteText! hover:bg-neutral-700! transition-colors"
				>
					<SVGEdit className="w-4 h-4" />
				</SFButton>
			)}

			{permissions.canPin && (
				<SFButton
					styling="none"
					type="button"
					title={permissions.isPinned ? 'Unpin message' : 'Pin message'}
					aria-label={permissions.isPinned ? 'Unpin message' : 'Pin message'}
					onClick={() => handleOpenDialog(MESSAGE_DIALOG.PIN)}
					className={`p-1.5! rounded-md! transition-colors hover:bg-neutral-700! ${
						permissions.isPinned ? 'text-primary!' : 'text-unfocused! hover:text-whiteText!'
					}`}
				>
					<SVGPin className="w-4 h-4" />
				</SFButton>
			)}

			{permissions.canDelete && (
				<SFButton
					styling="none"
					type="button"
					title="Delete message"
					aria-label="Delete message"
					onClick={() => handleOpenDialog(MESSAGE_DIALOG.DELETE)}
					className="p-1.5! rounded-md! text-unfocused! hover:text-red-400! hover:bg-red-500/10! transition-colors"
				>
					<SVGTrash className="w-4 h-4" />
				</SFButton>
			)}
		</section>
	)
}
