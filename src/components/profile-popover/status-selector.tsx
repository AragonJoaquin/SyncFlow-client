import { DropdownMenu } from 'radix-ui'
import { STATES_COLORS, STATES_NAMES } from './constants'

const STATUS_OPTIONS = [
	{
		name: STATES_NAMES.ACTIVE,
		label: 'Active',
		color: STATES_COLORS.active
	},
	{
		name: STATES_NAMES.DISCONNECTED,
		label: 'Disconnected',
		color: STATES_COLORS.disconnected
	},
	{
		name: STATES_NAMES.INVISIBLE,
		label: 'Invisible',
		color: STATES_COLORS.invisible
	}
] as const

interface StatusSelectorProps {
	currentStatus: string
	onStatusChange: (status: string) => void
}

export function StatusSelector({ currentStatus, onStatusChange }: StatusSelectorProps) {
	const current = STATUS_OPTIONS.find((s) => s.name === currentStatus) ?? STATUS_OPTIONS[STATUS_OPTIONS.length - 1]

	return (
		<DropdownMenu.Root>
			<DropdownMenu.Trigger asChild>
				<button
					type="button"
					className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-neutral-700/50 transition-colors w-full text-left cursor-pointer"
				>
					<div className={`w-3.5 h-3.5 rounded-full ${current.color}`} />
					<span className="text-sm text-whiteText font-medium capitalize">{current.label}</span>
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
					className="min-w-[200px] bg-darkFG rounded-lg border border-zinc-700 shadow-xl p-1 animate-appear-from"
					sideOffset={5}
				>
					{STATUS_OPTIONS.map(({ name, label, color }) => (
						<DropdownMenu.Item
							key={name}
							className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm text-whiteText outline-none cursor-pointer transition-colors ${
								name === currentStatus ? 'bg-neutral-700/50' : 'hover:bg-neutral-700/30'
							}`}
							onSelect={() => onStatusChange(name)}
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
