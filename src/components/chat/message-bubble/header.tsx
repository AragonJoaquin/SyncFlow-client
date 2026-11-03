import type { User } from '@/types'

interface MessageHeaderProps {
	sender: User | undefined
	formattedTime: string
	lastModified: boolean
	isPending: boolean
	isError: boolean
}

export function MessageHeader({ sender, formattedTime, lastModified, isPending, isError }: MessageHeaderProps) {
	return (
		<header className="flex items-baseline gap-2 mb-0.5">
			<h4 className="font-semibold text-[#f2f3f5] text-[0.9375rem] leading-5">{sender?.alias_name}</h4>
			<time
				dateTime={formattedTime}
				className="text-[0.6875rem] text-neutral-400 leading-4 select-none"
				title={`Sent ${formattedTime}`}
			>
				{formattedTime}
			</time>
			{lastModified && <span className="text-[0.6875rem] text-neutral-500 italic">(edited)</span>}
			{isPending && <span className="text-[0.6875rem] text-neutral-500 italic">Sending...</span>}
			{isError && <span className="text-[0.6875rem] text-red-400 font-medium">Failed to send</span>}
		</header>
	)
}
