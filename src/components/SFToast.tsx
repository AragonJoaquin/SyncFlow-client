import { useToastStore, type SFToast } from '@/store/toastStore'
import { Toast } from 'radix-ui'
import { useShallow } from 'zustand/shallow'

const VARIANT_STYLES = {
	error: 'border-red-500/50 bg-red-500/10',
	success: 'border-green-500/50 bg-green-500/10',
	info: 'border-blue-500/50 bg-blue-500/10'
} as const

const VARIANT_ICONS = {
	error: (
		<svg
			aria-hidden="true"
			className="h-5 w-5 text-red-500"
			fill="none"
			viewBox="0 0 24 24"
			stroke="currentColor"
			strokeWidth={2}
		>
			<path
				strokeLinecap="round"
				strokeLinejoin="round"
				d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
			/>
		</svg>
	),
	success: (
		<svg
			aria-hidden="true"
			className="h-5 w-5 text-green-500"
			fill="none"
			viewBox="0 0 24 24"
			stroke="currentColor"
			strokeWidth={2}
		>
			<path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
		</svg>
	),
	info: (
		<svg
			aria-hidden="true"
			className="h-5 w-5 text-blue-500"
			fill="none"
			viewBox="0 0 24 24"
			stroke="currentColor"
			strokeWidth={2}
		>
			<path
				strokeLinecap="round"
				strokeLinejoin="round"
				d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z"
			/>
		</svg>
	)
} as const

export function SFToastRoot() {
	const toasts = useToastStore(useShallow((e) => e.toasts))

	return (
		<Toast.Provider swipeDirection="right">
			{toasts.map((t) => {
				return <SFToastItem {...t} key={t.id} />
			})}
			<Toast.Viewport className="fixed bottom-0 right-0 flex flex-col gap-2 p-4 w-[390px] max-w-[100vw] list-none z-100 outline-none" />
		</Toast.Provider>
	)
}

export function SFToastItem({ id, title, description, variant }: SFToast) {
	const removeToast = useToastStore(useShallow((e) => e.removeToast))
	return (
		<Toast.Root
			className={`grid grid-cols-[auto_1fr_auto] items-start gap-x-3 rounded-lg border p-4 shadow-lg data-[state=open]:animate-fade-in data-[state=closed]:animate-fade-out ${VARIANT_STYLES[variant]}`}
			onOpenChange={(open) => {
				if (!open) {
					removeToast(id)
				}
			}}
		>
			<span className="mt-0.5">{VARIANT_ICONS[variant]}</span>
			<span className="flex flex-col gap-1">
				<Toast.Title className="text-sm font-semibold text-whiteText font-OpenSans">{title}</Toast.Title>
				{description && <Toast.Description className="text-xs text-unfocused">{description}</Toast.Description>}
			</span>
			<Toast.Close
				className="p-1 rounded hover:bg-white/10 transition-colors cursor-pointer"
				aria-label="Close notification"
			>
				<svg
					aria-hidden="true"
					className="h-4 w-4 text-unfocused"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
					strokeWidth={2}
				>
					<path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
				</svg>
			</Toast.Close>
		</Toast.Root>
	)
}
