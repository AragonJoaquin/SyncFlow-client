import { BASE_URL } from '@/utils'
import type { IQueryStruct } from './axios_helper'

type ws_actions = (typeof WS_ACTIONS)[keyof typeof WS_ACTIONS]

type ws_client_message<T> = {
	action: ws_actions
	payload: T
}

export type websocketOpts = Partial<typeof websocketDefaultOpts>

const websocketDefaultOpts = {
	RECONNECT_MS: 3000,
	RECONNECT_ATTEMPTS: Infinity
} as const

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

	WS_USER_LEFT: 'WS_USER_LEFT',
	WS_USER_JOINED: 'WS_USER_JOINED'
} as const

export class ChatWebSocket {
	public socket: WebSocket
	public websocketOpts = websocketDefaultOpts
	private listeners = new Set<() => void>()

	constructor(opts?: websocketOpts) {
		this.socket = new WebSocket(`${BASE_URL}/ws`)
		this.websocketOpts = { ...this.websocketOpts, ...opts }

		// notify subscribers when connection state changes
		this.socket.addEventListener('open', this.notify)
		this.socket.addEventListener('close', this.notify)
		this.socket.addEventListener('error', this.notify)
	}

	sendPayload<T>(action: ws_client_message<T>['action'], payload: ws_client_message<T>['payload']) {
		const message: ws_client_message<T> = {
			action: action,
			payload: payload
		}

		this.socket.send(JSON.stringify(message))
	}

	closeConnection = () => this.socket.close()

	//NOTE: listener wrappers
	onClose = (f: (ev: CloseEvent) => void) => {
		this.socket.removeEventListener('open', this.notify)
		this.socket.removeEventListener('close', this.notify)
		this.socket.removeEventListener('error', this.notify)
		this.socket.onclose = (e) => f(e)
	}

	onError = (f: (ev: Event) => void) => {
		this.socket.onerror = (e) => f(e)
	}

	onOpen = (f: (ev: Event) => void) => {
		this.socket.onopen = (e) => f(e)
	}

	onMessage = <T>(f: (ev: MessageEvent<IWSQueryStruct<T>>) => void) => {
		this.socket.onmessage = (e) => {
			const data: IWSQueryStruct<T> = e?.data
				? JSON.parse(e.data)
				: {
						error: true,
						data: {
							error_message: 'Unknown Error. Empty WS Body.'
						}
					}
			f({ ...e, data: data })
		}
	}

	//WARN: store subscription API react
	subscribe = (listener: () => void) => {
		this.listeners.add(listener)
		return () => this.listeners.delete(listener)
	}

	getSnapshot = () => this.socket.readyState
	private notify = () => this.listeners.forEach((listener) => listener())
}
