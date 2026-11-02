import { SFButton, SFDialog } from '@/components'
import { SVGCheck, SVGPin, SVGSmile, SVGTrash } from '@/components/svgs'
import { useState } from 'react'

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

type DialogControlProps = {
	open: boolean
	onOpenChange: (open: boolean) => void
}

interface DeleteMessageDialogProps extends DialogControlProps {
	content: string
	onConfirm: () => Promise<boolean>
}

export function DeleteMessageDialog({ open, onOpenChange, content, onConfirm }: DeleteMessageDialogProps) {
	const [isDeleting, setIsDeleting] = useState(false)

	const handleConfirm = async () => {
		setIsDeleting(true)
		const success = await onConfirm()
		setIsDeleting(false)
		if (success) onOpenChange(false)
	}

	return (
		<SFDialog
			open={open}
			onOpenChange={onOpenChange}
			title="Delete Message"
			description="Are you sure you want to delete this message? This action cannot be undone."
		>
			<section className="flex flex-col gap-4">
				<blockquote className="border-l-2 border-red-500/60 bg-neutral-900/60 px-3 py-2 rounded-r-md text-sm text-unfocused font-Cabin line-clamp-3 break-words">
					{content}
				</blockquote>

				<div className="flex justify-end gap-2">
					<SFButton styling="secondary" onClick={() => onOpenChange(false)} disabled={isDeleting}>
						Cancel
					</SFButton>
					<SFButton
						styling="secondary"
						onClick={handleConfirm}
						disabled={isDeleting}
						className="border-red-500/40! bg-red-600! text-whiteText! hover:bg-red-500!"
					>
						<SVGTrash className="w-4 h-4 inline-block mr-1.5" />
						{isDeleting ? 'Deleting...' : 'Delete'}
					</SFButton>
				</div>
			</section>
		</SFDialog>
	)
}

interface PinMessageDialogProps extends DialogControlProps {
	content: string
	isPinned: boolean
	onConfirm: () => Promise<boolean>
}

export function PinMessageDialog({ open, onOpenChange, content, isPinned, onConfirm }: PinMessageDialogProps) {
	const [isSaving, setIsSaving] = useState(false)

	const handleConfirm = async () => {
		setIsSaving(true)
		const success = await onConfirm()
		setIsSaving(false)
		if (success) onOpenChange(false)
	}

	return (
		<SFDialog
			open={open}
			onOpenChange={onOpenChange}
			title={isPinned ? 'Unpin Message' : 'Pin Message'}
			description={
				isPinned
					? 'This message will no longer appear in the pinned messages panel.'
					: 'This message will be added to the pinned messages panel for everyone in this group.'
			}
		>
			<section className="flex flex-col gap-4">
				<blockquote className="border-l-2 border-primary/60 bg-neutral-900/60 px-3 py-2 rounded-r-md text-sm text-unfocused font-Cabin line-clamp-3 break-words">
					{content}
				</blockquote>

				<div className="flex justify-end gap-2">
					<SFButton styling="secondary" onClick={() => onOpenChange(false)} disabled={isSaving}>
						Cancel
					</SFButton>
					<SFButton styling="primary" onClick={handleConfirm} disabled={isSaving}>
						<SVGPin className="w-4 h-4 inline-block mr-1.5" />
						{isSaving ? 'Saving...' : isPinned ? 'Unpin' : 'Pin'}
					</SFButton>
				</div>
			</section>
		</SFDialog>
	)
}

interface EmojiPickerDialogProps extends DialogControlProps {
	selectedEmojis: string[]
	onSelect: (emoji: string) => Promise<boolean>
}

export function EmojiPickerDialog({ open, onOpenChange, selectedEmojis, onSelect }: EmojiPickerDialogProps) {
	const [isSaving, setIsSaving] = useState(false)

	const handleSelect = async (emoji: string) => {
		setIsSaving(true)
		const success = await onSelect(emoji)
		setIsSaving(false)
		if (success) onOpenChange(false)
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
