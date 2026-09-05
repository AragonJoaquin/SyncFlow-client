import { BASE_URL } from '@/utils'
import type { IQueryStruct } from './axios_helper'

const createWS = () => new WebSocket(`${BASE_URL}/ws`)

type ws_actions = (typeof WS_ACTIONS)[keyof typeof WS_ACTIONS]

type ws_client_message<T> = {
	action: ws_actions
	payload: T
}

export type websocketOpts = Partial<typeof websocketDefaultOpts>

const websocketDefaultOpts = {
	RECONNECT_MS: 3000,
	RECONNECT_ATTEMPTS: Infinity,
	SEND_TOKEN_ON_OPEN: true
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

	constructor(token: string | null, opts?: websocketOpts) {
		console.warn('Creating a new instance')
		this.socket = createWS()
		this.websocketOpts = { ...this.websocketOpts, ...opts }
		if (opts?.SEND_TOKEN_ON_OPEN) return

		//this makes impossible to use the onOpen method. but whos going to use it anyways
		// make a pr if you REALLY need this (we can skip the token with the opts anyways lmao)
		this.onOpen(() => {
			this.socket.send(
				JSON.stringify({
					jwt_token: token
				})
			)
		})
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
}
