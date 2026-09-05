import { useOwnUserStore } from '@/store'
import { Popover } from 'radix-ui'
import { useState } from 'react'
import { ProfileDisplay, ProfileEditForm, STATES_ENUM } from './profile-popover'
import { SFButton } from './SFButton'
import { SVGSettings } from './svgs'

export function SFProfilePopover() {
	const { user, setUser } = useOwnUserStore()
	const [open, setOpen] = useState(false)
	const [isEditing, setIsEditing] = useState(false)

	if (!user) return null

	const handleStatusChange = (statusName: string) => {
		const st = statusName?.toLowerCase()
		setUser({
			...user,
			user_status: {
				id: STATES_ENUM[st as keyof typeof STATES_ENUM] ?? STATES_ENUM.invisible,
				name: st
			}
		})
	}

	return (
		<Popover.Root open={open} onOpenChange={setOpen}>
			<Popover.Trigger asChild>
				<SFButton styling="terciary" aria-label="Open profile settings">
					<SVGSettings className="w-5 h-5" />
				</SFButton>
			</Popover.Trigger>

			<Popover.Portal>
				<Popover.Content
					className="min-w-[320px] max-w-[400px] bg-darkFG rounded-xl border border-zinc-700 shadow-xl p-4 data-[state=open]:animate-appear-from z-101"
					side="top"
					align="start"
					sideOffset={8}
					collisionPadding={16}
				>
					{isEditing ? (
						<ProfileEditForm user={user} onCancel={() => setIsEditing(false)} />
					) : (
						<ProfileDisplay user={user} onEdit={() => setIsEditing(true)} onStatusChange={handleStatusChange} />
					)}
				</Popover.Content>
			</Popover.Portal>
		</Popover.Root>
	)
}
