import * as Collapsible from '@radix-ui/react-collapsible'
import { useState } from 'react'

export function CollapsibleList({ name, children }: { name: string; children: React.ReactNode }) {
	const [open, setOpen] = useState(false)

	return (
		<div className="w-full">
			<Collapsible.Root open={open} onOpenChange={setOpen}>
				<Collapsible.Trigger className="w-full px-4 py-3 bg-card text-white text-left cursor-pointer">
					{name}
				</Collapsible.Trigger>

				<Collapsible.Content className="flex flex-col w-full">
					<div className="w-full px-4 py-3 bg-card/10 hover:bg-card/20 cursor-pointer">{children}</div>
				</Collapsible.Content>
			</Collapsible.Root>
		</div>
	)
}
