import { useOwnUserStore } from '@/store'
import type { MessageReaction } from '@/types'
import { useMemo } from 'react'

interface MessageReactionsProps {
	reactions: MessageReaction[]
	onToggle: (emoji: string) => void
	disabled?: boolean
}

export function MessageReactions({ reactions, onToggle, disabled = false }: MessageReactionsProps) {
	const ownUser = useOwnUserStore((s) => s.user)

	const grouped = useMemo(() => {
		const map = new Map<string, { emoji: string; count: number; hasOwn: boolean }>()

		for (const reaction of reactions) {
			const entry = map.get(reaction.unicode_char) ?? {
				emoji: reaction.unicode_char,
				count: 0,
				hasOwn: false
			}

			entry.count += 1
			if (ownUser && reaction.user_id === ownUser.id) entry.hasOwn = true
			map.set(reaction.unicode_char, entry)
		}

		return [...map.values()]
	}, [ownUser, reactions])

	if (grouped.length === 0) return null

	return (
		<div className="flex flex-wrap items-center gap-1 mt-1.5">
			{grouped.map(({ emoji, count, hasOwn }) => (
				<button
					key={emoji}
					type="button"
					disabled={disabled}
					onClick={() => onToggle(emoji)}
					aria-label={`${emoji} reaction, ${count} ${count === 1 ? 'person' : 'people'} reacted`}
					aria-pressed={hasOwn}
					title={hasOwn ? 'Remove your reaction' : 'Add your reaction'}
					className={`inline-flex items-center gap-1 rounded-md border px-1.5 py-0.5 text-xs transition-colors cursor-pointer disabled:cursor-not-allowed disabled:opacity-60 ${
						hasOwn
							? 'border-primary/60 bg-primary/15 text-whiteText'
							: 'border-neutral-700/80 bg-neutral-800/70 text-unfocused hover:border-neutral-600 hover:bg-neutral-700/70'
					}`}
				>
					<span className="text-sm leading-none">{emoji}</span>
					<span className="font-semibold leading-none">{count}</span>
				</button>
			))}
		</div>
	)
}
