import { BASE_URL } from '@/utils'
import type { IQueryStruct } from './axios_helper'

type ws_actions = (typeof WS_ACTIONS)[keyof typeof WS_ACTIONS]

type ws_client_message<T> = {
	action: ws_actions
	payload: T
}

export type websocketOpts = Partial<typeof websocketDefaultOpts>

/**
 * Reconnect strategy:
 * - RECONNECT_MS: delay before the first retry, then doubles on each failu
 * - MAX_RECONNECT_MS: upper limit for that delay.
 * - RECONNECT_JITTER (add this on some future): randomizes each delay by +/- this fraction (0.2 = +/-20%)
 *   This prevents many clients from reconnecting at the exact same moment
 *   after a server restart, which would create a burst of connections.
 * - RECONNECT_ATTEMPTS: retries before giving up
 */
const websocketDefaultOpts = {
	RECONNECT_MS: 3000,
	MAX_RECONNECT_MS: 30000,
	RECONNECT_ATTEMPTS: Infinity
} as const

export type WSConnectionSnapshot = {
	readyState: number
	isReconnecting: boolean
	reconnectAttempt: number
	hasConnected: boolean
}

export type IWSQueryStruct<T> = IQueryStruct<T> & { ws_handler: ws_actions }

//NOTE: usable externally
export const WS_ACTIONS = {
	WS_MAIN_THREAD: 'WS_MAIN_THREAD',
	WS_JOIN_GROUP: 'WS_JOIN_GROUP',
	WS_QUIT_GROUP: 'WS_QUIT_GROUP',
	WS_PUBLISH: 'WS_PUBLISH_MESSAGE',
	WS_CREATE_CATEGORY: 'WS_CREATE_CATEGORY',
	WS_UPDATE_CATEGORY: 'WS_UPDATE_CATEGORY',
	WS_DELETE_CATEGORY: 'WS_DELETE_CATEGORY',
	WS_CREATE_CHANNEL: 'WS_CREATE_CHANNEL',
	WS_UPDATE_CHANNEL: 'WS_UPDATE_CHANNEL',
	WS_DELETE_CHANNEL: 'WS_DELETE_CHANNEL',

	WS_ADD_REACTION: 'WS_ADD_REACTION',
	WS_REMOVE_REACTION: 'WS_REMOVE_REACTION',

	WS_USER_LEFT: 'WS_USER_LEFT',
	WS_USER_JOINED: 'WS_USER_JOINED',

	WS_UPDATED_STATUS: 'WS_UPDATED_STATUS'
} as const

type ws_handlers = {
	open?: (ev: Event) => void
	close?: (ev: CloseEvent) => void
	error?: (ev: Event) => void
	message?: (ev: MessageEvent) => void
}

/**
 * When the underlying WebSocket drops, this
 * creates a new one and keeps the same handlers, so consumers do not need to
 * resubscribe. Handlers, listeners and the connection snapshot live here rather
 * than on the raw socket because the raw socket is replaced on every reconnect.
 *
 * Reconnecting stops only after closeConnection() (logout or unmount).
 */
export class ChatWebSocket {
	public socket!: WebSocket
	public websocketOpts = websocketDefaultOpts
	private listeners = new Set<() => void>()
	private handlers: ws_handlers = {}
	private reconnectTimeout: ReturnType<typeof setTimeout> | null = null
	private reconnectAttempt = 0
	private manuallyClosed = false
	private snapshot: WSConnectionSnapshot = {
		readyState: WebSocket.CONNECTING,
		isReconnecting: false,
		reconnectAttempt: 0,
		hasConnected: false
	}

	constructor(opts?: websocketOpts) {
		this.websocketOpts = { ...this.websocketOpts, ...opts }
		this.openSocket()
	}

	private openSocket() {
		this.socket = new WebSocket(`${BASE_URL}/v1/ws`)

		// notify subscribers when connection state changes
		this.socket.addEventListener('open', this.handleOpen)
		this.socket.addEventListener('close', this.handleClose)
		this.socket.addEventListener('error', this.handleError)
		this.socket.addEventListener('message', this.handleMessage)

		this.updateSnapshot({
			readyState: this.socket.readyState,
			isReconnecting: this.reconnectAttempt > 0,
			reconnectAttempt: this.reconnectAttempt
		})
	}

	// A closed socket is only replaced. Every handler stays registered so the
	// reconnected socket keeps receiving messages and events.
	private handleOpen(ev: Event) {
		if (ev.target !== this.socket) return

		this.clearReconnectTimeout()
		this.reconnectAttempt = 0
		this.updateSnapshot({
			readyState: WebSocket.OPEN,
			isReconnecting: false,
			reconnectAttempt: 0,
			hasConnected: true
		})

		this.handlers.open?.(ev)
	}

	private handleClose(ev: CloseEvent) {
		if (ev.target !== this.socket) return

		this.updateSnapshot({
			readyState: WebSocket.CLOSED,
			isReconnecting: !this.manuallyClosed
		})

		this.handlers.close?.(ev)

		if (!this.manuallyClosed) this.scheduleReconnect()
	}

	private handleError(ev: Event) {
		if (ev.target !== this.socket) return

		this.updateSnapshot({
			readyState: this.socket.readyState,
			isReconnecting: !this.manuallyClosed
		})

		this.handlers.error?.(ev)
	}

	private handleMessage(ev: MessageEvent) {
		if (ev.target !== this.socket) return

		const data: IWSQueryStruct<unknown> = ev?.data
			? JSON.parse(ev.data)
			: {
					error: true,
					data: {
						error_message: 'Unknown Error. Empty WS Body.'
					}
				}

		this.handlers.message?.({ ...ev, data })
	}

	// Each failed socket schedules exactly one retry. The attempt counter also
	// feeds the backoff calculation and the "reconnecting (attempt N)" UI.
	private scheduleReconnect() {
		if (this.manuallyClosed || this.reconnectTimeout !== null) return

		if (this.reconnectAttempt >= this.websocketOpts.RECONNECT_ATTEMPTS)
			return this.updateSnapshot({ isReconnecting: false })

		this.reconnectAttempt += 1

		this.updateSnapshot({
			readyState: WebSocket.CLOSED,
			isReconnecting: true,
			reconnectAttempt: this.reconnectAttempt
		})

		this.reconnectTimeout = setTimeout(() => {
			this.reconnectTimeout = null
			if (this.manuallyClosed) return
			this.openSocket()
		}, this.getReconnectDelay())
	}

	// Exponential backoff: 3s, 6s, 12s... capped at MAX_RECONNECT_MS
	private getReconnectDelay() {
		const { RECONNECT_MS, MAX_RECONNECT_MS } = this.websocketOpts

		return Math.max(
			0,
			Math.round(Math.min(RECONNECT_MS * 2 ** Math.max(this.reconnectAttempt - 1, 0), MAX_RECONNECT_MS))
		)
	}

	private clearReconnectTimeout() {
		if (this.reconnectTimeout === null) return
		clearTimeout(this.reconnectTimeout)
		this.reconnectTimeout = null
	}

	// used when the browser comes back online or when
	// the user asks to retry from the disconnected banner.
	reconnectNow = () => {
		if (this.manuallyClosed) return
		if (this.socket.readyState === WebSocket.OPEN || this.socket.readyState === WebSocket.CONNECTING) return

		this.clearReconnectTimeout()

		if (this.socket.readyState === WebSocket.CLOSING) {
			this.socket.addEventListener('close', () => this.reconnectNow(), { once: true })
			return
		}

		this.reconnectAttempt = 1
		this.updateSnapshot({
			readyState: WebSocket.CLOSED,
			isReconnecting: true,
			reconnectAttempt: this.reconnectAttempt
		})
		this.openSocket()
	}

	sendPayload<T>(action: ws_client_message<T>['action'], payload: ws_client_message<T>['payload']) {
		if (this.socket.readyState !== WebSocket.OPEN) {
			console.warn(`Cannot send WS action "${action}": socket is ${this.snapshot.readyState}`)
			return
		}

		const message: ws_client_message<T> = {
			action: action,
			payload: payload
		}

		this.socket.send(JSON.stringify(message))
	}

	closeConnection = () => {
		this.manuallyClosed = true
		this.clearReconnectTimeout()

		if (this.socket.readyState === WebSocket.OPEN || this.socket.readyState === WebSocket.CONNECTING)
			this.socket.close()

		this.updateSnapshot({
			readyState: this.socket.readyState,
			isReconnecting: false
		})
	}

	//NOTE: listener wrappers
	//
	// onClose = (f: (ev: CloseEvent) => void) => {
	// 	this.socket.removeEventListener('open', this.notify)
	// 	this.socket.removeEventListener('close', this.notify)
	// 	this.socket.removeEventListener('error', this.notify)
	// 	this.socket.onclose = (e) => f(e)
	// }

	onClose = (f: (ev: CloseEvent) => void) => (this.handlers.close = f)
	onError = (f: (ev: Event) => void) => (this.handlers.error = f)
	onOpen = (f: (ev: Event) => void) => (this.handlers.open = f)
	onMessage = <T>(f: (ev: MessageEvent<IWSQueryStruct<T>>) => void) =>
		(this.handlers.message = f as (ev: MessageEvent) => void)

	//WARN: store subscription API react
	subscribe = (listener: () => void) => {
		this.listeners.add(listener)
		return () => this.listeners.delete(listener)
	}

	getSnapshot = () => this.snapshot

	private updateSnapshot(patch: Partial<WSConnectionSnapshot>) {
		const next = { ...this.snapshot, ...patch }

		if (
			next.readyState === this.snapshot.readyState &&
			next.isReconnecting === this.snapshot.isReconnecting &&
			next.reconnectAttempt === this.snapshot.reconnectAttempt &&
			next.hasConnected === this.snapshot.hasConnected
		)
			return

		this.snapshot = next
		this.notify()
	}

	private notify = () => this.listeners.forEach((listener) => listener())
}
