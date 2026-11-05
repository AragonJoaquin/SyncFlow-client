import { Tooltip } from 'radix-ui'
import type { ReactElement, ReactNode } from 'react'

interface ISFTooltip {
	children: ReactElement
	content: ReactNode
	shortcut?: string
	side?: 'top' | 'right' | 'bottom' | 'left'
	align?: 'start' | 'center' | 'end'
	sideOffset?: number
	delayDuration?: number
	showArrow?: boolean
	disabled?: boolean
	className?: string
}

export function SFTooltip({
	children,
	content,
	shortcut,
	side = 'top',
	align = 'center',
	sideOffset = 8,
	delayDuration = 300,
	showArrow = false,
	disabled = false,
	className
}: ISFTooltip) {
	if (disabled || content == null || content === '') return children

	return (
		<Tooltip.Provider delayDuration={delayDuration} skipDelayDuration={150}>
			<Tooltip.Root disableHoverableContent>
				<Tooltip.Trigger asChild>{children}</Tooltip.Trigger>

				<Tooltip.Portal>
					<Tooltip.Content
						side={side}
						align={align}
						sideOffset={sideOffset}
						collisionPadding={8}
						className={`z-99999! max-w-[min(18rem,calc(100vw-1rem))] rounded-lg border border-neutral-700 bg-neutral-950/95 px-2.5 py-1.5 text-xs font-medium text-whiteText font-OpenSans shadow-xl shadow-black/40 backdrop-blur-md select-none data-[state=delayed-open]:animate-appear-from data-[state=instant-open]:animate-appear-from ${className ?? ''}`}
					>
						<span className="flex items-center gap-2">
							<span>{content}</span>
							{shortcut && (
								<kbd className="rounded border border-white/15 bg-white/10 px-1.5 py-0.5 font-Cabin text-[10px] font-normal text-unfocused">
									{shortcut}
								</kbd>
							)}
						</span>

						{showArrow && <Tooltip.Arrow className="fill-neutral-950" width={10} height={5} />}
					</Tooltip.Content>
				</Tooltip.Portal>
			</Tooltip.Root>
		</Tooltip.Provider>
	)
}
