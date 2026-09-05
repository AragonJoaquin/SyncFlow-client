import { SFButton } from '@/components'
import { DumbInput } from '@/components/input'
import { SVGPlus, type SVGUsers } from '@/components/svgs'
import { useChatContext } from '@/context'
import type { SIDE_PANNELS_STATE } from '@/context/chatContext'
import type { ReactNode } from 'react'

interface IPanelWrapper {
	children: ReactNode

	panelName: string
	SVGElement: typeof SVGUsers //selected one randomly
	elementsCount: number
	panelType: (typeof SIDE_PANNELS_STATE)[keyof typeof SIDE_PANNELS_STATE]
	setSearchInputValue: (val: string) => void

	className?: string
}
export function PannelWrapper({
	panelName,
	panelType,
	SVGElement,
	elementsCount,
	setSearchInputValue,
	className,
	children
}: IPanelWrapper) {
	const {
		sidePanel: { closePanels: onClose, activePanel }
	} = useChatContext()

	const isOpen = activePanel === panelType

	return (
		<article
			role="dialog"
			aria-label="Group Members"
			aria-modal="true"
			className={`fixed inset-0 transition-all duration-300 z-90 ${isOpen ? 'visible' : 'invisible pointer-events-none'}`}
		>
			{/*black bg*/}
			<div
				className={`absolute inset-0 bg-neutral-900/60 transition-opacity duration-300 z-99 ${isOpen ? 'opacity-100' : 'opacity-0'}`}
				onClick={onClose}
			/>

			<aside
				className={`absolute right-0 top-0 h-full w-[320px] bg-darkBG border-l-2 border-l-neutral-700 shadow-xl shadow-neutral-800 flex flex-col transition-transform duration-300 ease-out z-100 md:block ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
			>
				<header className="flex items-center justify-between px-4 py-3 border-b border-neutral-700/50">
					<span className="flex items-center gap-2">
						<SVGElement className="w-5 h-5 text-neutral-400" />
						<h3 className="text-base font-semibold font-OpenSans text-whiteText">{panelName}</h3>
						<span className="text-xs bg-neutral-700 text-unfocused px-2 py-0.5 rounded-full">{elementsCount}</span>
					</span>
					<SFButton
						styling="terciary"
						onClick={onClose}
						aria-label="Close group members"
						className="p-1 hover:scale-105 transition-transform cursor-pointer"
					>
						<SVGPlus className="rotate-45 h-5 w-5 text-neutral-400 hover:text-whiteText" />
					</SFButton>
				</header>

				<span className="px-3 py-2 flex">
					<DumbInput
						type="search"
						placeholder="Search members..."
						styling="ghost"
						className="w-full! py-1! border-2! border-neutral-400/60!"
						opts={{ onChange: (e) => setSearchInputValue(e.currentTarget.value) }}
					/>
				</span>

				<main className={`flex-1 overflow-y-auto px-3 pb-3 ${className}`}>{children}</main>
			</aside>
		</article>
	)
}
