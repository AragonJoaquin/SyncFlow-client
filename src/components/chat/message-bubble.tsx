import { SFAvatarImage } from '@/components/SFAvatar'
import type { Message } from '@/types/Message'
import type { User } from '@/types/User'
import { FormatRelativeTime } from '@/utils'
import { FilePreview } from './file-preview'

export interface MessageBubbleProps {
	message: Message
	sender: User | undefined
	showAvatar: boolean
}

export function MessageBubble({ message, sender, showAvatar }: MessageBubbleProps) {
	const formattedTime = FormatRelativeTime(new Date(message?.sent_at) ?? new Date())

	return (
		<article
			className={`group flex gap-3 px-2 py-0.5 hover:bg-neutral-800/30 -mx-2 rounded ${!showAvatar && 'pl-[42px]'}`}
		>
			{showAvatar && (
				<span className="w-[40px] flex-shrink-0">
					<SFAvatarImage src={sender?.profile_picture} username={sender?.alias_name} size="big" />
				</span>
			)}

			<section className="flex-1 min-w-0">
				{showAvatar && (
					<header className="flex items-baseline gap-2 mb-0.5">
						<h4 className="font-semibold text-[#f2f3f5] text-[0.9375rem] leading-5">{sender?.alias_name}</h4>
						<time
							dateTime={formattedTime}
							className="text-[0.6875rem] text-neutral-400 leading-4 select-none"
							title={`Sent ${formattedTime}`}
						>
							{formattedTime}
						</time>
					</header>
				)}

				<p className="text-[#dcddde] text-[0.9375rem] whitespace-pre-wrap break-words">{message.content}</p>

				{message?.file_id && (
					<span className="mt-1">
						<FilePreview fileId={message.file_id} />
					</span>
				)}
			</section>
		</article>
	)
}
