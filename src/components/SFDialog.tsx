import { Dialog } from 'radix-ui'
import { useCallback, useState, type ReactNode } from 'react'
import { SFButton } from './SFButton'
import { SVGPlus } from './svgs'

interface ISFDialog {
	title: string
	description?: string
	children: ReactNode
	trigger?: ReactNode
	onOpenChange?: (open: boolean) => void

	open: boolean
	onClose: () => void
	onTrigger: () => void
}

export function SFCustomDialog({
	title,
	description,
	trigger = <span />,
	children,
	onOpenChange,
	open,
	onClose,
	onTrigger
}: ISFDialog) {
	return (
		<Dialog.Root open={open} onOpenChange={onOpenChange}>
			<Dialog.Trigger asChild onClick={onTrigger}>
				{trigger}
			</Dialog.Trigger>
			<Dialog.Portal>
				<Dialog.Overlay className="fixed inset-0 bg-neutral-900/50 data-[state=open]:animate-appear-from" />
				<Dialog.Content className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-darkFG border border-zinc-700  p-4 rounded-md focus:outline-none max-h-[85vh] w-[90vw] max-w-[400px] flex flex-col gap-5 data-[state=open]:animate-appear-from">
					<span className="flex flex-col gap-2 relative">
						<Dialog.Title className="text-lg font-OpenSans font-semibold">{title}</Dialog.Title>
						{description && <Dialog.Description className="text-unfocused">{description}</Dialog.Description>}
					</span>
					{children}
					<Dialog.Close asChild className="absolute right-2 top-2">
						<SFButton
							styling="none"
							className="p-1! hover:scale-105 transition-transform cursor-pointer"
							onClick={onClose}
						>
							<SVGPlus className="rotate-45 h-6 w-6" />
						</SFButton>
					</Dialog.Close>
				</Dialog.Content>
			</Dialog.Portal>
		</Dialog.Root>
	)
}

export function SFDialog({
	title,
	description,
	trigger = <span />,
	children,
	onOpenChange
}: Omit<ISFDialog, 'open' | 'onClose' | 'onTrigger'>) {
	const [open, setOpen] = useState(false)

	const onClose = useCallback(() => setOpen(false), [])
	const onTrigger = useCallback(() => setOpen(true), [])

	return (
		<SFCustomDialog {...{ title, description, trigger, onOpenChange, open, onClose, onTrigger }}>
			{children}
		</SFCustomDialog>
	)
}
