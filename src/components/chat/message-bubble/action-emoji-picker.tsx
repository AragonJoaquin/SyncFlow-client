import { useState } from 'react'
import type { DialogControlProps } from './types'
import { SFDialog } from '@/components/SFDialog'
import { SVGCheck, SVGSmile } from '@/components/svgs'

const COMMON_EMOJIS = [
	'👍',
	'👎',
	'❤️',
	'😂',
	'😮',
	'😢',
	'😡',
	'🎉',
	'🔥',
	'👏',
	'🙌',
	'🤝',
	'✅',
	'❌',
	'👀',
	'🤔',
	'😍',
	'😎',
	'🥳',
	'😴',
	'🙏',
	'💯',
	'💪',
	'🚀',
	'⭐',
	'💡',
	'🍕',
	'☕',
	'🌱',
	'🐛'
] as const

interface EmojiPickerDialogProps extends DialogControlProps {
	selectedEmojis: string[]
	onSelect: (emoji: string) => Promise<boolean>
}

export function EmojiPickerDialog({ open, onOpenChange, selectedEmojis, onSelect }: EmojiPickerDialogProps) {
	const [isSaving, setIsSaving] = useState(false)

	const handleSelect = async (emoji: string) => {
		setIsSaving(true)
		try {
			const success = await onSelect(emoji)
			if (success) onOpenChange(false)
		} finally {
			setIsSaving(false)
		}
	}

	return (
		<SFDialog
			open={open}
			onOpenChange={onOpenChange}
			title="Add Reaction"
			description="Pick an emoji to react to this message."
		>
			<section className="flex flex-col gap-3">
				<div className="flex items-center gap-2 text-xs text-unfocused font-Cabin">
					<SVGSmile className="w-4 h-4" />
					<span>Anyone can react to any message.</span>
				</div>

				<div className="grid grid-cols-6 gap-1.5">
					{COMMON_EMOJIS.map((emoji) => {
						const isSelected = selectedEmojis.includes(emoji)

						return (
							<button
								key={emoji}
								type="button"
								disabled={isSaving}
								onClick={() => handleSelect(emoji)}
								aria-label={`React with ${emoji}`}
								aria-pressed={isSelected}
								className={`relative flex items-center justify-center aspect-square rounded-lg border text-xl transition-colors cursor-pointer disabled:opacity-50 ${
									isSelected
										? 'border-primary/60 bg-primary/15'
										: 'border-neutral-700/70 bg-neutral-800/60 hover:bg-neutral-700/70'
								}`}
							>
								{emoji}
								{isSelected && (
									<SVGCheck className="absolute right-0.5 bottom-0.5 w-3 h-3 text-primary" aria-hidden="true" />
								)}
							</button>
						)
					})}
				</div>

				<p className="text-[11px] text-neutral-500 font-Cabin">Click a selected emoji again to remove your reaction.</p>
			</section>
		</SFDialog>
	)
}
