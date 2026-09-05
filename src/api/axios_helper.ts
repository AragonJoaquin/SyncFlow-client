import { BASE_URL } from '@/utils'
import axios, { type AxiosResponse } from 'axios'

export class ErrorServer extends Error {
	statusCode: number = 0
	statusText: string = ''
	columnError: ErrorData['column']
	validationsError: ErrorData['validation_error']

	constructor(msg: ErrorData | undefined, statusCode: number = 500, statusText: string = 'UNKNOWN') {
		super()
		this.statusCode = statusCode
		this.statusText = statusText

		this.name = 'Error'
		this.message = msg?.error_message ?? 'CLIENT MESSAGE: Server did not responded'
		this.columnError = msg?.column
		this.validationsError = msg?.validation_error

		this.stack = ''
	}
}

export interface ErrorData {
	error_message: string
	validation_error?: Record<string, string>
	column?: string
}

export const CreateErrorServerFromAxiosError = (error: AxiosResponse<IQueryStruct<ErrorData>> | undefined) =>
	new ErrorServer(error && error?.data?.data, error?.status, error?.statusText)

export type IQueryStruct<T> = {
	message: string
	date_response: Date
} & ({ error: true; data: ErrorData } | { error: false; data: T })

export const AXIOS_METHODS = {
	GET: 'get',
	POST: 'post',
	DELETE: 'delete',
	PATCH: 'patch',
	PUT: 'put'
} as const

export type axios_avail_methods = (typeof AXIOS_METHODS)[keyof typeof AXIOS_METHODS]
export type axios_data = Record<string, unknown> | FormData
export type axios_route = `/${string}`

export const AXIOS_INSTANCE = axios.create({
	baseURL: BASE_URL,
	timeout: 5000,
	withCredentials: true
})
