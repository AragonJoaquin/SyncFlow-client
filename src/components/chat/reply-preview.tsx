import { SFAvatarImage } from '@/components/SFAvatar'
import { SFButton } from '@/components/SFButton'
import { SVGPlus, SVGReply } from '@/components/svgs'
import type { User } from '@/types'

interface ReplyPreviewProps {
	senderName: string
	content: string
	profilePicture?: User['profile_picture']
	onCancel: () => void
}

export function ReplyPreview({ senderName, content, profilePicture, onCancel }: ReplyPreviewProps) {
	return (
		<section className="flex items-center gap-2.5 rounded-t-xl border border-b-0 border-neutral-700 bg-neutral-800/80 px-3 py-2">
			<SVGReply className="w-4 h-4 shrink-0 text-primary" aria-hidden="true" />

			<SFAvatarImage src={profilePicture} username={senderName} size="small" />

			<span className="min-w-0 flex-1">
				<span className="block text-[11px] font-semibold text-primary font-OpenSans truncate">
					Replying to {senderName}
				</span>
				<span className="block text-xs text-unfocused font-Cabin truncate">{content || 'Attachment'}</span>
			</span>

			<SFButton
				styling="terciary"
				type="button"
				title="Cancel reply"
				aria-label="Cancel reply"
				onClick={onCancel}
				className="shrink-0"
			>
				<SVGPlus className="rotate-45 w-4 h-4" />
			</SFButton>
		</section>
	)
}
