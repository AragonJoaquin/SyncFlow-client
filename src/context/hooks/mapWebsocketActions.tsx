import { WS_ACTIONS } from '@/api'
import { userStatusFromDto } from '@/constants/userStatus'
import { useCacheUsersStore, useWorkGroupStore, useOwnUserStore, useClientMessagesStore } from '@/store'
import type { Category, Channel, ReceivedMessage, UserStatusUpdate, UUIDv4 } from '@/types'
import { useCallback } from 'react'
import { useShallow } from 'zustand/shallow'

type function_ws_types =
	| ((m: ReceivedMessage) => void)
	| ((c: Category) => void)
	| ((ch: Channel) => void)
	| (() => void)
	| ((u: UUIDv4) => void)
	| ((id: number) => void)
	| ((status: UserStatusUpdate) => void)

export function useWebsocketActions() {
	const {
		workGroup,
		removeWGroup,
		addMessage,
		addCategory,
		updateCategory,
		deleteCategory,
		getCategory,
		addChannelToCategory,
		updateChannel,
		deleteChannel
	} = useWorkGroupStore(
		useShallow((s) => ({
			workGroup: s.workGroup,
			removeWGroup: s.removeWorkGroup,

			addMessage: s.addMessage,

			addCategory: s.addCategory,
			updateCategory: s.updateCategoryInStore,
			deleteCategory: s.deleteCategoryFromStore,
			getCategory: s.getCategory,

			addChannelToCategory: s.addChannelToCategory,
			updateChannel: s.updateChannelInStore,
			deleteChannel: s.deleteChannelFromStore
		}))
	)

	const { removeUser, updateUserStatus } = useCacheUsersStore(
		useShallow((s) => ({
			removeUser: s.removeUser,
			updateUserStatus: s.updateUserStatus
		}))
	)

	const { user, setUserStatus } = useOwnUserStore(
		useShallow((s) => ({
			user: s.user,
			setUserStatus: s.setUserStatus
		}))
	)

	const removeClientMsg = useClientMessagesStore((s) => s.removeClientMessage)

	//yeah... anu better ideas?
	const IndexWSActions = useCallback(() => {
		const MAP_ACTIONS: Record<(typeof WS_ACTIONS)[keyof typeof WS_ACTIONS], function_ws_types> = {
			[WS_ACTIONS.WS_PUBLISH]: (msg: ReceivedMessage) => {
				const { message: m, temp_id } = msg
				if (m && m.channel_id) {
					addMessage(m.channel_id, m)
					if (user?.id === m.sender_id && temp_id) removeClientMsg(m.channel_id, temp_id)
				}
			},
			[WS_ACTIONS.WS_CREATE_CATEGORY]: (c: Category) => addCategory({ ...c, channel: [] }),
			[WS_ACTIONS.WS_UPDATE_CATEGORY]: (c: Category) => updateCategory(c.id, c.name, c.description ?? undefined),
			[WS_ACTIONS.WS_DELETE_CATEGORY]: (c: Category) => deleteCategory(c.id),

			[WS_ACTIONS.WS_CREATE_CHANNEL]: (ch: Channel) => addChannelToCategory(ch.category_id, ch),
			[WS_ACTIONS.WS_UPDATE_CHANNEL]: (ch: Channel) => updateChannel(ch.id, ch.name),
			[WS_ACTIONS.WS_DELETE_CHANNEL]: (id: number) => {
				const cat = getCategory(id)
				if (!cat) return
				deleteChannel(id, cat.id)
			},

			[WS_ACTIONS.WS_QUIT_GROUP]: () => removeWGroup(),

			//not implemented yet
			[WS_ACTIONS.WS_MAIN_THREAD]: () => alert('not implemented yet'),
			[WS_ACTIONS.WS_JOIN_GROUP]: () => alert('not implemented yet'),

			//broadcasted
			[WS_ACTIONS.WS_UPDATED_STATUS]: (status: UserStatusUpdate) => {
				const nextStatus = userStatusFromDto(status)
				updateUserStatus(status.user_id, nextStatus)
				if (user?.id === status.user_id) setUserStatus(nextStatus)
			},
			[WS_ACTIONS.WS_USER_LEFT]: (u: UUIDv4) => removeUser(u),
			[WS_ACTIONS.WS_USER_JOINED]: () => {}
		} as const

		return MAP_ACTIONS
		// oxlint-disable-next-line react-hooks/exhaustive-deps
	}, [workGroup, user, setUserStatus, updateUserStatus])

	return IndexWSActions
}
