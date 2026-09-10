import { useOwnUserStore, useToastStore } from '@/store'
import { useEffect } from 'react'
import { useShallow } from 'zustand/shallow'
import { useWebsocketActions } from './mapWebsocketActions'
import { useGetWebsocketInstance } from './useGetWebsocketInstance'

export function useWebsocket() {
	const WS_MAPPED_ACTIONS = useWebsocketActions()

	const { addErrorToast } = useToastStore(
		useShallow((s) => ({
			addErrorToast: s.addErrorToast
		}))
	)

	const user = useOwnUserStore(useShallow((s) => s.user))

	const { chatWS: socket } = useGetWebsocketInstance(!!user)

	useEffect(() => {
		if (!socket) return

		//reconnect attempt, attempt
		socket.onClose((close) => {
			console.warn('Socket closed: ', close)
		})

		//socket error'ed
		socket.onError((err) => {
			console.warn("Socket error'ed:", err)
			addErrorToast({
				title: "Couldn't connect to the ws",
				description: "Its possible the rest of the application won't work from now on. Reloading can be helpful."
			})
		})

		socket.onMessage((ev) => {
			const res = ev.data
			if (res.error) console.warn('error message: ', ev.data.data)
			const map_actions = WS_MAPPED_ACTIONS()

			const action = ev?.data?.ws_handler
			const func = map_actions[action]
			if (!func) return

			//TODO: fix this ... Parameters<> wont work
			;(func as (data: any) => void)(res?.data)
		})

		return () => {
			socket.closeConnection()
		}
	}, [socket])

	return socket!
}
