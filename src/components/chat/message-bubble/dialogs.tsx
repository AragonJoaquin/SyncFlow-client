import { useMessageUIStore } from '@/store'
import { MESSAGE_DIALOG, type MessageDialogType } from '@/store/messageUIStore'
import type { Message } from '@/types'
import { EmojiPickerDialog } from './action-emoji-picker'
import { DeleteMessageDialog } from './action-delete-message'
import { PinMessageDialog } from './action-pin-message'

interface MessageDialogsProps {
	serverMessage: Message
	isPinned: boolean
	selectedEmojis: string[]
	onDelete: () => Promise<boolean>
	onToggleReaction: (emoji: string) => Promise<boolean>
	onTogglePin: () => Promise<boolean>
}

export function MessageDialogs({
	serverMessage,
	isPinned,
	selectedEmojis,
	onDelete,
	onToggleReaction,
	onTogglePin
}: MessageDialogsProps) {
	const activeDialogType = useMessageUIStore((s) =>
		s.activeDialog?.messageId === serverMessage.id ? s.activeDialog.type : null
	)
	const closeDialog = useMessageUIStore((s) => s.closeDialog)

	const handleDialogOpenChange = (type: MessageDialogType) => (open: boolean) => {
		if (!open) closeDialog(serverMessage.id, type)
	}

	return (
		<>
			{activeDialogType === MESSAGE_DIALOG.EMOJI && (
				<EmojiPickerDialog
					open
					onOpenChange={handleDialogOpenChange(MESSAGE_DIALOG.EMOJI)}
					selectedEmojis={selectedEmojis}
					onSelect={onToggleReaction}
				/>
			)}

			{activeDialogType === MESSAGE_DIALOG.DELETE && (
				<DeleteMessageDialog
					open
					onOpenChange={handleDialogOpenChange(MESSAGE_DIALOG.DELETE)}
					content={serverMessage.content || 'Attachment'}
					onConfirm={onDelete}
				/>
			)}

			{activeDialogType === MESSAGE_DIALOG.PIN && (
				<PinMessageDialog
					open
					onOpenChange={handleDialogOpenChange(MESSAGE_DIALOG.PIN)}
					content={serverMessage.content || 'Attachment'}
					isPinned={isPinned}
					onConfirm={onTogglePin}
				/>
			)}
		</>
	)
}
