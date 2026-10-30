import { useOwnUserStore, useToastStore } from '@/store'
import { useEffect, useRef } from 'react'
import { useShallow } from 'zustand/shallow'
import { useWebsocketActions } from './mapWebsocketActions'
import { useGetWebsocketInstance } from './useGetWebsocketInstance'
import { ErrorServer } from '@/api/axios_helper'
import { createUserStatus } from '@/constants/userStatus'

export function useWebsocket() {
	const WS_MAPPED_ACTIONS = useWebsocketActions()
	const WS_MAPPED_ACTIONS_REF = useRef(WS_MAPPED_ACTIONS)
	WS_MAPPED_ACTIONS_REF.current = WS_MAPPED_ACTIONS

	const { addErrorToast } = useToastStore(
		useShallow((s) => ({
			addErrorToast: s.addErrorToast
		}))
	)

	const { user, setUserStatus } = useOwnUserStore(
		useShallow((s) => ({
			user: s.user,
			setUserStatus: s.setUserStatus
		}))
	)

	const { chatWS: socket } = useGetWebsocketInstance(!!user)

	useEffect(() => {
		if (!socket) return

		// The server marks the user as active when the socket connects.
		// Keep the local profile in sync even when the user is not in a group.
		const markUserAsActive = () => setUserStatus(createUserStatus('active'))
		if (socket.socket.readyState === WebSocket.OPEN) markUserAsActive()
		socket.onOpen(markUserAsActive)

		socket.onClose((close) => {
			console.warn('Socket closed: ', close)
		})

		socket.onError((err) => {
			console.warn("Socket error'ed:", err)
			addErrorToast({
				title: "Couldn't connect to the ws",
				description: "Its possible the rest of the application won't work from now on. Reloading can be helpful."
			})
		})

		socket.onMessage((ev) => {
			const res = ev.data
			if (res.error) return addErrorToast(new ErrorServer({ error_message: res.message }, undefined, 'WEBSOCKET ERROR'))
			const map_actions = WS_MAPPED_ACTIONS_REF.current()

			const action = ev?.data?.ws_handler
			const func = map_actions[action]
			if (!func) return

			;(func as (data: unknown) => void)(res?.data)
		})

		return () => {
			socket.closeConnection()
		}
	}, [socket, addErrorToast, setUserStatus])

	return socket!
}
