import { SFAvatarImage } from '@/components/SFAvatar'
import { STATUS_MESSAGE, type User } from '@/types'
import { FormatRelativeTime } from '@/utils'
import { FilePreview } from './file-preview'
import { CLIENT_OR_SERVER, type client_or_server_message } from '@/context/hooks/useMessagesHistory'

//TODO: make a component for client and server type
export interface MessageBubbleProps {
	message: client_or_server_message
	sender: User | undefined
	showAvatar: boolean
	previewUrl?: string
	file_id?: string
}

const onResend = () => alert('implement this')

export function MessageBubble({ message, file_id, sender, showAvatar, previewUrl }: MessageBubbleProps) {
	const { message: msg, type } = message

	const formattedTime = FormatRelativeTime(msg?.sent_at ? new Date(msg.sent_at) : new Date())

	const isPending = type === CLIENT_OR_SERVER.CLIENT && msg.status === STATUS_MESSAGE.STATUS_PENDING
	const isError = type === CLIENT_OR_SERVER.CLIENT && msg.status === STATUS_MESSAGE.STATUS_ERROR

	return (
		<article
			className={`group flex gap-3 px-2 py-0.5 hover:bg-neutral-800/30 -mx-2 rounded ${!showAvatar && 'pl-[42px]'} ${isPending ? 'opacity-60' : ''} ${isError ? 'bg-red-500/10' : ''}`}
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
						{isPending && <span className="text-[0.6875rem] text-neutral-500 italic">Sending...</span>}
						{isError && <span className="text-[0.6875rem] text-red-400 font-medium">Failed to send</span>}
					</header>
				)}

				<p className="text-[#dcddde] text-[0.9375rem] whitespace-pre-wrap wrap-break-words">{msg.content}</p>

				{previewUrl ? (
					<span className="mt-1 inline-flex rounded-lg overflow-hidden max-w-[300px]">
						<img
							src={previewUrl}
							alt="Attached preview"
							className="max-w-[300px] max-h-[200px] object-cover rounded-lg"
						/>
					</span>
				) : (
					file_id && (
						<span className="mt-1">
							<FilePreview fileId={file_id} />
						</span>
					)
				)}

				{isError && onResend && (
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
			</section>
		</article>
	)
}
