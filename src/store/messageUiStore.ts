import { create } from 'zustand'

export const MESSAGE_DIALOG = {
	EMOJI: 'emoji',
	DELETE: 'delete',
	PIN: 'pin'
} as const

export type MessageDialogType = (typeof MESSAGE_DIALOG)[keyof typeof MESSAGE_DIALOG]

type ActiveDialog = {
	messageId: number
	type: MessageDialogType
}

interface MessageUiStore {
	editingMessageId: number | null
	editDraft: string
	isSavingEdit: boolean
	activeDialog: ActiveDialog | null

	startEditing: (messageId: number, content: string) => void
	updateEditDraft: (draft: string) => void
	setSavingEdit: (saving: boolean, messageId?: number) => void
	finishEditing: (messageId?: number) => void
	cancelEditing: () => void
	openDialog: (messageId: number, type: MessageDialogType) => void
	closeDialog: (messageId?: number, type?: MessageDialogType) => void
	reset: () => void
}

const EMPTY_UI_STATE = {
	editingMessageId: null,
	editDraft: '',
	isSavingEdit: false,
	activeDialog: null
} as const

export const useMessageUiStore = create<MessageUiStore>((set, get) => ({
	...EMPTY_UI_STATE,

	startEditing: (messageId, content) =>
		set((s) => ({
			...s,
			editingMessageId: messageId,
			editDraft: content,
			isSavingEdit: false
		})),

	updateEditDraft: (draft) => set((s) => ({ ...s, editDraft: draft })),

	setSavingEdit: (saving, messageId) =>
		set((s) => {
			if (messageId !== undefined && s.editingMessageId !== messageId) return s
			return { ...s, isSavingEdit: saving }
		}),

	finishEditing: (messageId) =>
		set((s) => {
			if (messageId !== undefined && s.editingMessageId !== messageId) return s

			return {
				...s,
				editingMessageId: null,
				editDraft: '',
				isSavingEdit: false
			}
		}),

	cancelEditing: () =>
		set((s) => ({
			...s,
			editingMessageId: null,
			editDraft: '',
			isSavingEdit: false
		})),

	openDialog: (messageId, type) => set((s) => ({ ...s, activeDialog: { messageId, type } })),

	closeDialog: (messageId, type) =>
		set((s) => {
			const activeDialog = s.activeDialog
			if (!activeDialog) return s
			if (messageId !== undefined && activeDialog.messageId !== messageId) return s
			if (type !== undefined && activeDialog.type !== type) return s

			return { ...s, activeDialog: null }
		}),

	reset: () => {
		const current = get()
		if (
			current.editingMessageId === null &&
			current.editDraft === '' &&
			!current.isSavingEdit &&
			current.activeDialog === null
		)
			return

		set((s) => ({ ...s, ...EMPTY_UI_STATE }))
	}
}))
