import { SFAvatarImage } from '@/components'
import { getUserStatusKey, USER_STATUS_COLORS, USER_STATUS_LABELS } from '@/constants/userStatus'
import { useOwnUserStore } from '@/store'
import type { GroupMemberWithProfile, User } from '@/types'
import { Popover } from 'radix-ui'
import type { ReactNode } from 'react'

interface UserProfilePopoverProps {
	user: User | GroupMemberWithProfile['user']
	membership?: GroupMemberWithProfile['membership']
	children: ReactNode
	side?: 'top' | 'bottom' | 'left' | 'right'
	align?: 'start' | 'center' | 'end'
}

export function UserProfilePopover({
	user,
	membership,
	children,
	side = 'left',
	align = 'start'
}: UserProfilePopoverProps) {
	const ownUser = useOwnUserStore((s) => s.user)

	if (!user) return <>{children}</>

	const isOwnUser = user.id === ownUser?.id
	const status = getUserStatusKey(isOwnUser ? ownUser?.user_status : user.user_status)
	const statusLabel = status === 'invisible' ? 'Offline' : USER_STATUS_LABELS[status]
	const statusColor = USER_STATUS_COLORS[status]

	return (
		<Popover.Root>
			<Popover.Trigger asChild>{children}</Popover.Trigger>

			<Popover.Portal>
				<Popover.Content
					className="w-[320px] sm:w-[360px] bg-darkFG rounded-2xl border border-neutral-700 shadow-2xl shadow-neutral-950 p-4 data-[state=open]:animate-appear-from z-[1002]"
					side={side}
					align={align}
					sideOffset={12}
					collisionPadding={16}
				>
					<article className="flex flex-col gap-4">
						{/* Header banner / avatar */}
						<header className="flex items-start gap-3.5">
							<span className="relative shrink-0">
								<SFAvatarImage src={user.profile_picture} username={user.name} size="huge" />
							</span>

							<div className="flex-1 min-w-0">
								<h4 className="text-base font-bold font-OpenSans text-whiteText truncate">
									{isOwnUser ? 'You' : user.name}
								</h4>
								<p className="text-xs text-neutral-400 font-Cabin truncate">@{user.alias_name}</p>
								<div className="flex items-center gap-1 mt-1.5">
									<span className={`inline-block w-2 h-2 rounded-full ${statusColor}`} />
									<span className="text-[11px] text-unfocused font-OpenSans">{statusLabel}</span>
								</div>
							</div>
						</header>

						{/* Bio / Description */}
						{user.description ? (
							<div className="bg-neutral-900/60 rounded-xl p-3 border border-neutral-800">
								<h6 className="text-[11px] font-bold font-OpenSans uppercase text-neutral-400 tracking-wider mb-1">
									About Me
								</h6>
								<p className="text-sm text-unfocused font-Cabin leading-relaxed break-words">{user.description}</p>
							</div>
						) : (
							<div className="bg-neutral-900/40 rounded-xl p-3 border border-neutral-800 text-center">
								<p className="text-xs text-neutral-500 font-Cabin italic">This user has not added a bio yet.</p>
							</div>
						)}

						{/* Member stats & info */}
						<footer className="border-t border-neutral-800 pt-3 space-y-2">
							{membership?.group_role && (
								<span className="flex justify-between items-center text-xs">
									<span className="text-neutral-400 font-OpenSans">Group Role</span>
									<span className="font-semibold text-whiteText font-OpenSans px-2 py-0.5 bg-neutral-800 rounded">
										{membership.group_role.name}
									</span>
								</span>
							)}

							<span className="flex justify-between items-center text-xs">
								<span className="text-neutral-400 font-OpenSans">Member Since</span>
								<span className="text-whiteText font-OpenSans">
									{user.created_at
										? new Date(user.created_at).toLocaleDateString('en-US', {
												month: 'short',
												day: 'numeric',
												year: 'numeric'
											})
										: 'Unknown'}
								</span>
							</span>
						</footer>
					</article>
				</Popover.Content>
			</Popover.Portal>
		</Popover.Root>
	)
}
