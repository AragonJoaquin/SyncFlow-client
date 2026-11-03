import type { MessageReaction } from '@/types'
import { MessageAttachments } from './attachments'
import { MessageReactions } from './action-reactions'

interface MessageExtrasProps {
	showAvatar: boolean
	lastModified: boolean
	isError: boolean
	onResend: () => void
	showReactions: boolean
	reactions: MessageReaction[]
	canReact: boolean
	onToggleReaction: (emoji: string) => void
	previewUrl?: string
	fileId?: string
}

export function MessageExtras({
	showAvatar,
	lastModified,
	isError,
	onResend,
	showReactions,
	reactions,
	canReact,
	onToggleReaction,
	previewUrl,
	fileId
}: MessageExtrasProps) {
	return (
		<>
			{!showAvatar && lastModified && <span className="text-[0.6875rem] text-neutral-500 italic">(edited)</span>}

			<MessageAttachments previewUrl={previewUrl} fileId={fileId} />

			{showReactions && <MessageReactions reactions={reactions} onToggle={onToggleReaction} disabled={!canReact} />}

			{isError && (
				<span className="mt-1 flex items-center gap-2">
					<button
						type="button"
						onClick={onResend}
						className="text-xs font-medium text-red-300 hover:text-red-200 underline underline-offset-2"
					>
						Resend
					</button>
				</span>
			)}
		</>
	)
}
