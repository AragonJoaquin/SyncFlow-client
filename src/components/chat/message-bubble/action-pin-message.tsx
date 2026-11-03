import { useState } from 'react'
import type { DialogControlProps } from './types'
import { SFDialog } from '@/components/SFDialog'
import { SFButton } from '@/components/SFButton'
import { SVGPin } from '@/components/svgs'

interface PinMessageDialogProps extends DialogControlProps {
	content: string
	isPinned: boolean
	onConfirm: () => Promise<boolean>
}

export function PinMessageDialog({ open, onOpenChange, content, isPinned, onConfirm }: PinMessageDialogProps) {
	const [isSaving, setIsSaving] = useState(false)

	const handleConfirm = async () => {
		setIsSaving(true)
		try {
			const success = await onConfirm()
			if (success) onOpenChange(false)
		} finally {
			setIsSaving(false)
		}
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
