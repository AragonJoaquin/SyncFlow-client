import { WS_ACTIONS } from '@/api'
import { useCacheUsersStore, useWorkGroupStore } from '@/store'
import type { Category, Channel, Message, UUIDv4 } from '@/types'
import { useCallback } from 'react'
import { useShallow } from 'zustand/shallow'

type function_ws_types =
	| ((m: Message) => void)
	| ((c: Category) => void)
	| ((ch: Channel) => void)
	| (() => void)
	| ((u: UUIDv4) => void)
	| ((id: number) => void)

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

	const { removeUser } = useCacheUsersStore(
		useShallow((s) => ({
			addUser: s.addUser,
			removeUser: s.removeUser
		}))
	)

	//yeah... anu better ideas?
	const IndexWSActions = useCallback(() => {
		const MAP_ACTIONS: Record<(typeof WS_ACTIONS)[keyof typeof WS_ACTIONS], function_ws_types> = {
			[WS_ACTIONS.WS_PUBLISH]: (m: Message) => addMessage(m.channel_id, m),
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
			[WS_ACTIONS.WS_USER_LEFT]: (u: UUIDv4) => removeUser(u),
			[WS_ACTIONS.WS_USER_JOINED]: () => {}
		} as const

		return MAP_ACTIONS
	}, [workGroup])

	return IndexWSActions
}
