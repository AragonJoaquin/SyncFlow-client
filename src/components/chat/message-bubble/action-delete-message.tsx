import { useState } from 'react'
import type { DialogControlProps } from './types'
import { SFDialog } from '@/components/SFDialog'
import { SFButton } from '@/components/SFButton'
import { SVGTrash } from '@/components/svgs'

interface DeleteMessageDialogProps extends DialogControlProps {
	content: string
	onConfirm: () => Promise<boolean>
}

export function DeleteMessageDialog({ open, onOpenChange, content, onConfirm }: DeleteMessageDialogProps) {
	const [isDeleting, setIsDeleting] = useState(false)

	const handleConfirm = async () => {
		setIsDeleting(true)
		try {
			const success = await onConfirm()
			if (success) onOpenChange(false)
		} finally {
			setIsDeleting(false)
		}
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
