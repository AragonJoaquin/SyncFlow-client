import { ErrorServer } from '@/api/axios_helper'
import { create } from 'zustand'

export type ToastVariant = 'error' | 'success' | 'info'

export interface SFToast {
	id: number
	title: string | number
	description: string
	variant: ToastVariant
}

interface ToastStore {
	lastToastId: number
	toasts: SFToast[]
	addToast: (toast?: Omit<SFToast, 'id'>) => void
	addErrorToast: (toast?: ErrorServer | Omit<SFToast, 'id' | 'variant'>) => void
	addSuccessToast: (message: string) => void
	removeToast: (id: number) => void
}

const UNKNOWN_TOAST_PROPS: Omit<SFToast, 'id'> = {
	title: 'Unknown Error',
	variant: 'error',
	description: 'Unknown Error Description'
} as const

export const useToastStore = create<ToastStore>((set) => ({
	lastToastId: 0,
	toasts: [],
	addToast: (t) =>
		set((s) => ({
			...s,
			toasts: [
				...s.toasts,
				{
					...(t || UNKNOWN_TOAST_PROPS),
					id: s.lastToastId++
				}
			]
		})),
	addErrorToast: (t) => {
		//very go styled
		let toast: Omit<SFToast, 'id' | 'variant'> | null

		t instanceof ErrorServer
			? (toast = {
					title: `${t.statusCode} - ${t.statusText}`,
					description: t.message
				})
			: (toast = {
					title: t?.title ?? UNKNOWN_TOAST_PROPS.title,
					description: t?.description ?? UNKNOWN_TOAST_PROPS.description
				})

		set((s) => ({
			...s,
			toasts: [
				...s.toasts,
				{
					...toast,
					variant: 'error',
					id: s.lastToastId++
				}
			]
		}))
	},
	addSuccessToast: (t) => {
		const toast: Omit<SFToast, 'id'> = {
			title: 'Success',
			variant: 'success',
			description: t ?? ''
		}

		set((s) => ({
			...s,
			toasts: [
				...s.toasts,
				{
					...toast,
					id: s.lastToastId++
				}
			]
		}))
	},
	removeToast: (id) =>
		set((s) => ({
			toasts: s.toasts.filter((t) => t.id !== id)
		}))
}))
