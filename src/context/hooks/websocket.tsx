import { WS_ACTIONS } from '@/api'
import { useEffect, useRef } from 'react'
import { useShallow } from 'zustand/shallow'
import { useWebsocketActions } from './mapWebsocketActions'
import { useGetWebsocketInstance } from './useGetWebsocketInstance'
import { ErrorServer } from '@/api/axios_helper'
import { createUserStatus, USER_STATUS_KEYS } from '@/constants/userStatus'
import { clearPendingReactionRequests, REACTION_REQ_KIND, rollbackReactionRequest } from '@/store/interactions'
import { useOwnUserStore, useToastStore } from '@/store'

type ReactionEventPayload = {
	user_id?: unknown
	message_id?: unknown
	unicode_char?: unknown
	reacted_at?: unknown
}

// The server broadcasts reactions without tagging them with their WS action,
// so the payload shape is the only reliable way to route them.
function getReactionAction(data: unknown) {
	if (!data || typeof data !== 'object') return null

	const payload = data as ReactionEventPayload
	if (
		typeof payload.user_id !== 'string' ||
		typeof payload.message_id !== 'number' ||
		typeof payload.unicode_char !== 'string'
	)
		return null

	return 'reacted_at' in payload ? WS_ACTIONS.WS_ADD_REACTION : WS_ACTIONS.WS_REMOVE_REACTION
}

export function useWebsocket() {
	const WS_MAPPED_ACTIONS = useWebsocketActions()
	const WS_MAPPED_ACTIONS_REF = useRef(WS_MAPPED_ACTIONS)

	useEffect(() => {
		WS_MAPPED_ACTIONS_REF.current = WS_MAPPED_ACTIONS
	}, [WS_MAPPED_ACTIONS])

	const { addErrorToast, addSuccessToast } = useToastStore(
		useShallow((s) => ({
			addErrorToast: s.addErrorToast,
			addSuccessToast: s.addSuccessToast
		}))
	)

	const { user, setUserStatus } = useOwnUserStore(
		useShallow((s) => ({
			user: s.user,
			setUserStatus: s.setUserStatus
		}))
	)

	const { chatWS: socket } = useGetWebsocketInstance(!!user)
	const hasConnectedRef = useRef(false)

	useEffect(() => {
		if (!socket) return

		const markUserAsActive = () => setUserStatus(createUserStatus(USER_STATUS_KEYS.ACTIVE))

		if (socket.socket.readyState === WebSocket.OPEN) {
			hasConnectedRef.current = true
			markUserAsActive()
		}

		socket.onOpen(() => {
			const wasReconnect = hasConnectedRef.current
			hasConnectedRef.current = true

			markUserAsActive()
			if (wasReconnect) addSuccessToast('Reconnected to SyncFlow')
		})

		socket.onClose((close) => {
			clearPendingReactionRequests()
			console.warn('Socket closed: ', close)
		})

		socket.onError((err) => {
			// The connection banner reports disconnects. Avoid stacking a toast
			// for every reconnect attempt while the socket is down.
			console.warn("Socket error'ed:", err)
		})

		socket.onMessage((ev) => {
			const res = ev.data

			if (res.error) {
				switch (ev.data.ws_handler) {
					case WS_ACTIONS.WS_ADD_REACTION:
						rollbackReactionRequest(REACTION_REQ_KIND.ADD)
						break
					case WS_ACTIONS.WS_REMOVE_REACTION:
						rollbackReactionRequest(REACTION_REQ_KIND.REMOVE)
						break
				}

				return addErrorToast(new ErrorServer({ error_message: res.message }, undefined, 'WEBSOCKET ERROR'))
			}

			const map_actions = WS_MAPPED_ACTIONS_REF.current()
			const action = getReactionAction(res.data) ?? ev.data.ws_handler
			const func = map_actions[action]
			if (!func) return

			;(func as (data: unknown) => void)(res.data)
		})

		// skip the backoff as soon as the browser reports network access again.
		const handleOnline = () => socket.reconnectNow()
		window.addEventListener('online', handleOnline)

		return () => {
			window.removeEventListener('online', handleOnline)
			socket.closeConnection()
		}
	}, [socket, addErrorToast, addSuccessToast, setUserStatus])

	return socket!
}
