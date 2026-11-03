import { useMessageUIStore } from '@/store'
import type { Message } from '@/types'
import { MessageEditForm } from './edit-form'

interface MessageContentProps {
	serverMessage: Message | null
	content: string
	onSave: (content: string) => Promise<boolean>
}

export function MessageContent({ serverMessage, content, onSave }: MessageContentProps) {
	const isEditing = useMessageUIStore((s) => serverMessage != null && s.editingMessageId === serverMessage.id)

	if (isEditing && serverMessage) {
		return <MessageEditForm serverMessage={serverMessage} onSave={onSave} />
	}

	return <p className="text-[#dcddde] text-[0.9375rem] whitespace-pre-wrap wrap-break-words">{content}</p>
}
