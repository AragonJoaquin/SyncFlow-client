import { SVGReply } from '@/components/svgs'
import type { Message } from '@/types'

interface MessageCitationProps {
	citedMessage: Message
	citedSenderName?: string
}

export function MessageCitation({ citedMessage, citedSenderName }: MessageCitationProps) {
	const jumpToMessage = () => {
		document.getElementById(`message-${citedMessage.id}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' })
	}

	return (
		<button
			type="button"
			onClick={jumpToMessage}
			className="flex items-center gap-1.5 max-w-full mb-0.5 text-xs text-unfocused hover:text-whiteText transition-colors cursor-pointer"
			title="Jump to replied message"
		>
			<SVGReply className="w-3.5 h-3.5 shrink-0 -scale-y-100" aria-hidden="true" />
			<span className="font-semibold shrink-0">{citedSenderName ?? 'Unknown'}</span>
			<span className="truncate">{citedMessage.content || 'Attachment'}</span>
		</button>
	)
}
