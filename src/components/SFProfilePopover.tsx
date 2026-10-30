import { useAxios, WS_ACTIONS } from '@/api'
import { useChatContext } from '@/context'
import { createUserStatus, userStatusFromDto, userStatusFromId } from '@/constants/userStatus'
import { useOwnUserStore, useToastStore } from '@/store'
import type { UserStatusUpdate } from '@/types'
import { Popover } from 'radix-ui'
import { useCallback, useState } from 'react'
import { ProfileDisplay, ProfileEditForm } from './profile-popover'
import { SFButton } from './SFButton'
import { SVGSettings } from './svgs'

export function SFProfilePopover() {
	const { user, setUserStatus } = useOwnUserStore()
	const { put } = useAxios()
	const { websocket } = useChatContext()
	const addErrorToast = useToastStore((s) => s.addErrorToast)
	const [open, setOpen] = useState(false)
	const [isEditing, setIsEditing] = useState(false)

	const handleStatusChange = useCallback(
		async (statusId: number) => {
			const statusName = userStatusFromId(statusId)
			if (!user || !statusName) return

			const previousStatus = user.user_status
			const nextStatus = createUserStatus(statusName)
			setUserStatus(nextStatus)

			try {
				if (websocket.isConnected)
					return websocket.CHAT_SOCKET.sendPayload(WS_ACTIONS.WS_UPDATED_STATUS, {
						status_id: statusId
					})

				// fallback when the socket is closed
				const { data: res } = await put<UserStatusUpdate>('/user/status', {
					status_id: statusId
				})

				if (res.error || !res.data) {
					setUserStatus(previousStatus)
					if (res.error) {
						addErrorToast({ title: 'Status not updated', description: res.data.error_message })
					}
					return
				}

				setUserStatus(userStatusFromDto(res.data))
			} catch {
				setUserStatus(previousStatus)
				addErrorToast({
					title: 'Status not updated',
					description: 'Could not reach the server. Check your connection and try again.'
				})
			}
		},
		[user, setUserStatus, websocket, put, addErrorToast]
	)

	if (!user) return null

	const handleOpenChange = (nextOpen: boolean) => {
		setOpen(nextOpen)
		if (!nextOpen) setIsEditing(false)
	}

	return (
		<Popover.Root open={open} onOpenChange={handleOpenChange}>
			<Popover.Trigger asChild>
				<SFButton styling="terciary" aria-label="Open profile settings">
					<SVGSettings className="w-5 h-5" />
				</SFButton>
			</Popover.Trigger>

			<Popover.Portal>
				<Popover.Content
					className="min-w-[320px] max-w-[400px] bg-darkFG rounded-xl border border-zinc-700 shadow-xl p-2 data-[state=open]:animate-appear-from z-101"
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
