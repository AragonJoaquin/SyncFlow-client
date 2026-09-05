import { SFAvatarImage, SFButton } from '@/components'
import { STATES_ENUM } from '@/components/profile-popover'
import { SVGUsers } from '@/components/svgs'
import { SIDE_PANNELS_STATE } from '@/context/chatContext'
import { useCacheUsersStore } from '@/store'
import type { GroupMemberWithProfile } from '@/types'
import { useCallback, useMemo, useState } from 'react'
import { ROLE_COLORS, ROLE_ORDER, ROLE_TYPES_ENUM } from '../../constants'
import { PannelWrapper } from './panelWrapper'

type RoleGroup = {
	label: string
	color: string
	users: GroupMemberWithProfile[]
}

export function GroupUsersPanel() {
	const [search, setSearch] = useState('')

	const setSearchInputVal = useCallback((val: string) => setSearch(val), [])
	const users = useCacheUsersStore((s) => s.getUsersInGroup)()

	// we filter the user based on the search
	const filtered = useMemo(() => {
		if (!search.trim()) return users
		const q = search.toLowerCase()
		return users.filter(
			({ user, membership }) =>
				user.name.toLowerCase().includes(q) ||
				user.alias_name.toLowerCase().includes(q) ||
				membership.group_role.name.toLowerCase().includes(q)
		)
	}, [search, users])

	// we group them by role
	const grouped = useMemo(() => {
		const groups: RoleGroup[] = ROLE_ORDER.map((role) => {
			const roleUpper = role.toUpperCase() as Uppercase<typeof role>
			return {
				label: roleUpper,
				color: ROLE_COLORS[roleUpper] ?? ROLE_COLORS.MEMBER,
				users: filtered.filter(({ membership: m }) => m.group_role.name.toUpperCase() === roleUpper)
			}
		}).filter((g) => g.users.length > 0)
		return groups
	}, [filtered])

	//count the total to then display it
	const totalMembers = useMemo(() => users.length, [users])

	return (
		<PannelWrapper
			panelName="Group Users"
			elementsCount={totalMembers}
			SVGElement={SVGUsers}
			panelType={SIDE_PANNELS_STATE.USERS}
			setSearchInputValue={setSearchInputVal}
		>
			{grouped.length ? (
				<div className="flex flex-col gap-3">
					{grouped.map((group) => (
						<section key={group.label}>
							<h4 className="text-xs font-semibold font-OpenSans text-neutral-500 uppercase tracking-wider mb-1.5 px-1">
								{group.label} — {group.users.length}
							</h4>
							<ul className="flex flex-col gap-0.5">
								{group.users.map(({ user, membership }) => {
									const roleUpper = membership?.group_role?.name?.toUpperCase() as keyof typeof ROLE_COLORS
									return (
										<li key={user.id}>
											<SFButton
												styling="terciary"
												className="w-full flex items-center gap-3 rounded-lg hover:bg-neutral-700/40! text-left"
											>
												<span className="relative shrink-0">
													<SFAvatarImage src={user.profile_picture} username={user.name} size="small" />
													<p
														className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-darkBG ${membership.status_id === STATES_ENUM.active ? 'bg-green-500' : 'bg-neutral-500'}`}
													/>
												</span>

												<span className="flex-1 min-w-0">
													<div className="flex items-center gap-2">
														<h5 className="text-sm font-semibold font-OpenSans text-whiteText truncate">{user.name}</h5>
														<p
															className={`text-[10px] px-1.5 py-0.5 rounded border shrink-0 font-OpenSans ${ROLE_COLORS[roleUpper] ?? ROLE_COLORS.MEMBER}`}
														>
															{ROLE_TYPES_ENUM[roleUpper] ?? 'Uknown'}
														</p>
													</div>
													<h6 className="text-xs text-neutral-500 font-Cabin">@{user.alias_name}</h6>
												</span>
											</SFButton>
										</li>
									)
								})}
							</ul>
						</section>
					))}
				</div>
			) : (
				<div className="flex flex-col items-center justify-center py-12 text-center">
					{/*filter unknown / couldnt get any user*/}
					<SVGUsers className="w-12 h-12 text-neutral-600 mb-3" />
					<p className="text-unfocused font-OpenSans text-sm font-semibold">
						{search.trim() ? 'No members match your search' : 'No members found'}
					</p>
				</div>
			)}
		</PannelWrapper>
	)
}
