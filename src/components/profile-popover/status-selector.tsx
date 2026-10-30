import {
	SELECTABLE_USER_STATUSES,
	USER_STATUS,
	USER_STATUS_COLORS,
	USER_STATUS_LABELS,
	type UserStatusKey
} from '@/constants/userStatus'
import { DropdownMenu } from 'radix-ui'

const STATUS_OPTIONS = SELECTABLE_USER_STATUSES.map((status) => ({
	id: USER_STATUS[status],
	name: status,
	label: USER_STATUS_LABELS[status],
	color: USER_STATUS_COLORS[status]
}))

interface StatusSelectorProps {
	currentStatus: UserStatusKey
	onStatusChange: (statusId: number) => void
}

export function StatusSelector({ currentStatus, onStatusChange }: StatusSelectorProps) {
	const current = STATUS_OPTIONS.find((s) => s.name === currentStatus)
	const currentLabel = current?.label ?? USER_STATUS_LABELS[currentStatus]
	const currentColor = current?.color ?? USER_STATUS_COLORS[currentStatus]

	return (
		<DropdownMenu.Root>
			<DropdownMenu.Trigger asChild>
				<button
					type="button"
					className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-neutral-700/50 transition-colors w-full text-left cursor-pointer"
				>
					<div className={`w-3.5 h-3.5 rounded-full ${currentColor}`} />
					<span className="text-sm text-whiteText font-medium capitalize">{currentLabel}</span>
					<svg
						className="w-4 h-4 text-unfocused ml-auto"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
						role="img"
						aria-label="Expand status menu"
					>
						<title>Expand status menu</title>
						<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
					</svg>
				</button>
			</DropdownMenu.Trigger>

			<DropdownMenu.Portal>
				<DropdownMenu.Content
					className="min-w-[200px] bg-darkFG rounded-lg border border-zinc-700 shadow-xl p-1 animate-appear-from z-200"
					sideOffset={5}
				>
					{STATUS_OPTIONS.map(({ id, name, label, color }) => (
						<DropdownMenu.Item
							key={name}
							className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm text-whiteText outline-none cursor-pointer transition-colors ${
								name === currentStatus ? 'bg-neutral-700/50' : 'hover:bg-neutral-700/30'
							}`}
							onSelect={() => onStatusChange(id)}
						>
							<div className={`w-3 h-3 rounded-full ${color}`} />
							<span className="capitalize">{label}</span>
						</DropdownMenu.Item>
					))}
				</DropdownMenu.Content>
			</DropdownMenu.Portal>
		</DropdownMenu.Root>
	)
}
