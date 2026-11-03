import { useMessageUIStore } from '@/store'
import type { Message } from '@/types'
import { useEffect, useRef } from 'react'

const MAX_MESSAGE_LENGTH = 150

interface MessageEditFormProps {
	serverMessage: Message
	onSave: (content: string) => Promise<boolean>
}

export function MessageEditForm({ serverMessage, onSave }: MessageEditFormProps) {
	const draft = useMessageUIStore((s) => s.editDraft)
	const isSavingEdit = useMessageUIStore((s) => s.isSavingEdit)
	const updateEditDraft = useMessageUIStore((s) => s.updateEditDraft)
	const cancelEditing = useMessageUIStore((s) => s.cancelEditing)

	const editRef = useRef<HTMLTextAreaElement>(null)

	useEffect(() => {
		const input = editRef.current
		if (!input) return

		input.focus()
		input.setSelectionRange(input.value.length, input.value.length)
	}, [])

	const submitEdit = async () => {
		const current = useMessageUIStore.getState()
		if (current.isSavingEdit) return

		const nextContent = current.editDraft.trim()
		if (!nextContent) return
		if (nextContent === serverMessage.content.trim()) {
			current.finishEditing(serverMessage.id)
			return
		}

		current.setSavingEdit(true, serverMessage.id)
		try {
			const success = await onSave(nextContent)
			if (success) useMessageUIStore.getState().finishEditing(serverMessage.id)
		} finally {
			useMessageUIStore.getState().setSavingEdit(false, serverMessage.id)
		}
	}

	return (
		<section className="mt-0.5">
			<textarea
				ref={editRef}
				value={draft}
				maxLength={MAX_MESSAGE_LENGTH}
				rows={2}
				disabled={isSavingEdit}
				onChange={(e) => updateEditDraft(e.target.value)}
				onKeyDown={(e) => {
					if (e.key === 'Enter' && !e.shiftKey) {
						e.preventDefault()
						void submitEdit()
					}

					if (e.key === 'Escape') {
						e.preventDefault()
						cancelEditing()
					}
				}}
				className="w-full resize-none rounded-md border border-neutral-600 bg-neutral-900 px-2.5 py-1.5 text-[0.9375rem] text-[#dcddde] focus:outline-none focus:ring-2 focus:ring-primary/30 disabled:opacity-60"
				aria-label="Edit message content"
			/>

			<div className="flex items-center gap-2 mt-1">
				<span className="text-[0.6875rem] text-neutral-500">Enter to save • Esc to cancel</span>
				<span className="ml-auto text-[0.6875rem] text-neutral-500">
					{draft.length}/{MAX_MESSAGE_LENGTH}
				</span>
				<button
					type="button"
					onClick={cancelEditing}
					disabled={isSavingEdit}
					className="text-[0.6875rem] font-medium text-unfocused hover:text-whiteText disabled:opacity-50 cursor-pointer"
				>
					Cancel
				</button>
				<button
					type="button"
					onClick={() => void submitEdit()}
					disabled={isSavingEdit || !draft.trim()}
					className="text-[0.6875rem] font-semibold text-primary hover:brightness-125 disabled:opacity-50 cursor-pointer"
				>
					{isSavingEdit ? 'Saving...' : 'Save'}
				</button>
			</div>
		</section>
	)
}
