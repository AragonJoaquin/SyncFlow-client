import { WS_ACTIONS } from '@/api'
import { ErrorServer } from '@/api/axios_helper'
import { SFButton, SFDialog, SFDropDown } from '@/components'
import { DumbInput } from '@/components/input'
import { SVGChevronArrow, SVGPhoto, SVGPin, SVGPlus, SVGSearch, SVGTrash, SVGUsers } from '@/components/svgs'
import { useChatContext } from '@/context'
import { SIDE_PANNELS_STATE } from '@/context/chatContext'
import { useToastStore, useWorkGroupStore } from '@/store'
import { APP_NAME } from '@/utils'
import { useCallback, useState } from 'react'
import { useShallow } from 'zustand/shallow'
import { GroupUsersPanel, PinnedMessagesPanel } from './panels'

export function HeaderChatInfo() {
	const { workGroup, actId, getChannel } = useWorkGroupStore(
		useShallow((s) => ({
			workGroup: s.workGroup,
			actId: s.activeChannel,
			getChannel: s.getChannel
		}))
	)

	const currentChannel = getChannel(actId)

	const { websocket } = useChatContext()

	const { addErrorToast, addSuccessToast } = useToastStore(
		useShallow((s) => ({
			addErrorToast: s.addErrorToast,
			addSuccessToast: s.addSuccessToast
		}))
	)

	const {
		sidePanel: { openPanel, activePanel }
	} = useChatContext()

	const [inviteUuid, setInviteUuid] = useState<string>('')
	const [isInviteOpen, setIsInviteOpen] = useState<boolean>(false)

	const LeaveGroup = useCallback(async () => {
		try {
			if (!workGroup?.id) return
			websocket.CHAT_SOCKET.sendPayload<{ group_id: number }>(WS_ACTIONS.WS_QUIT_GROUP, { group_id: workGroup?.id })
		} catch (e: unknown) {
			return e instanceof ErrorServer ? addErrorToast(e) : addErrorToast()
		}
	}, [workGroup?.id, addErrorToast, websocket.CHAT_SOCKET])

	const AboutThisGroup = useCallback(() => {}, [])

	const InvitePeople = useCallback(() => {
		const uuid = crypto.randomUUID()
		setInviteUuid(uuid)
		setIsInviteOpen(true)
	}, [])

	const copyInviteUuid = useCallback(() => {
		navigator.clipboard
			.writeText(inviteUuid)
			.then(() => {
				addSuccessToast('Invite UUID copied to clipboard!')
			})
			.catch(() => {
				addSuccessToast('Invite UUID generated!')
			})
	}, [inviteUuid, addSuccessToast])

	const ELEMENTS_DD: Parameters<typeof SFDropDown>[0]['elements'] = {
		General: [
			{
				name: 'About this group',
				SVG: SVGPhoto,
				onClick: AboutThisGroup
			},
			{
				name: 'Invite people',
				SVG: SVGPlus,
				onClick: InvitePeople
			}
		],
		Options: [
			{
				name: 'Leave group',
				SVG: SVGTrash,
				style: 'delete',
				onClick: LeaveGroup
			}
		]
	}

	return (
		<article className="justify-between items-center flex w-full">
			{/*visible on smaller devices*/}
			<span className="lg:hidden flex justify-center gap-4 pl-14">
				<h3 className="text-2xl font-bold text-primaryText leading-6">{APP_NAME}</h3>
			</span>

			{/*visible on lg: devices */}
			<span className="flex-row items-center gap-1 hidden lg:flex">
				{workGroup?.name ?? 'Not found'}
				<SFDropDown elements={ELEMENTS_DD}>
					<SFButton styling="terciary" type="button">
						<SVGChevronArrow />
					</SFButton>
				</SFDropDown>
			</span>

			{currentChannel && (
				<h4 className="text-2xl font-OpenSans font-semibold text-whiteText grow w-full justify-center hidden lg:flex">
					{currentChannel?.name}
				</h4>
			)}

			<span className="justify-end md:w-full gap-4 flex">
				{/*TODO: upgrade to an omnibar*/}
				<span className="h-fit w-fit relative hidden sm:inline-block!">
					<DumbInput
						type="search"
						placeholder="Search messages..."
						className="py-0.5! border-2! border-neutral-400/60! pr-8"
						styling="ghost"
					/>

					<SVGSearch className="absolute top-0 translate-y-1/3 -translate-x-1/2 right-0 h-5 w-5 text-neutral-300" />
				</span>

				{/* implement a horizontal tab */}
				<div className="flex flex-row gap-2">
					<SFButton
						styling="terciary"
						title="Pinned Messages"
						aria-label="Toggle pinned messages"
						aria-expanded={activePanel === SIDE_PANNELS_STATE.PINNED}
						onClick={() => openPanel(SIDE_PANNELS_STATE.PINNED)}
					>
						<SVGPin className="" />
					</SFButton>

					<SFButton
						styling="terciary"
						title="Group Users"
						aria-label="Toggle group members"
						aria-expanded={activePanel === SIDE_PANNELS_STATE.USERS}
						onClick={() => openPanel(SIDE_PANNELS_STATE.USERS)}
					>
						<SVGUsers className="" />
					</SFButton>
				</div>
			</span>

			<PinnedMessagesPanel />
			<GroupUsersPanel />

			<SFDialog
				title="Invite People"
				description="Share this invite UUID with others so they can join this group."
				trigger={<span />}
				open={isInviteOpen}
				onOpenChange={setIsInviteOpen}
			>
				<div className="flex flex-col gap-4">
					<div className="flex items-center gap-2">
						<DumbInput
							type="text"
							className="w-full! py-2! bg-neutral-800 text-white font-mono text-sm select-all"
							styling="ghost"
							opts={{
								value: inviteUuid,
								readOnly: true
							}}
						/>
					</div>
					<div className="flex justify-end gap-2">
						<SFButton styling="secondary" onClick={() => setIsInviteOpen(false)}>
							Close
						</SFButton>
						<SFButton styling="primary" onClick={copyInviteUuid}>
							Copy UUID
						</SFButton>
					</div>
				</div>
			</SFDialog>
		</article>
	)
}
