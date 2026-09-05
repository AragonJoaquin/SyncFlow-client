import { useOwnUserStore } from '@/store'
import { AxiosError, type AxiosRequestConfig, type AxiosResponse } from 'axios'
import { useCallback } from 'react'
import {
    AXIOS_INSTANCE,
    AXIOS_METHODS,
    CreateErrorServerFromAxiosError,
    ErrorServer,
    type axios_avail_methods,
    type axios_data,
    type axios_route,
    type IQueryStruct
} from './axios_helper'

const HEADER_NEWTOKEN = 'X-User_new-Token' as const
const UNPROCESSABLE_ENTITY = 422 as const // cookies auth failed

AXIOS_INSTANCE.interceptors.response.use(
	(response) => {
		const newToken = response?.headers[HEADER_NEWTOKEN.toLowerCase()] ?? undefined

		//we check if we received a new token from the server refreshing our session
		if (newToken)
			useOwnUserStore.getState().login({
				user: useOwnUserStore.getState().user!,
				token: newToken
			})

		return response
	},
	(error: AxiosError) => {
		if (error.status === UNPROCESSABLE_ENTITY) useOwnUserStore.getState().logout()
		return Promise.reject(CreateErrorServerFromAxiosError(error.response as never))
	}
)

export function useAxiosInternalFetch() {
	const { token } = useOwnUserStore()

	const default_headers = {
		Authorization: `Bearer ${token}`
	}

	const axios_fetch = useCallback(
		async <T>(
			route: axios_route,
			data: axios_data | undefined,
			met: axios_avail_methods,
			conf?: AxiosRequestConfig<any>
		): Promise<AxiosResponse<IQueryStruct<T> & { error: false }>> => {
			const res = await AXIOS_INSTANCE<IQueryStruct<T>>({
				url: route,
				method: met,
				...(met !== AXIOS_METHODS.GET && data != undefined
					? {
							data,
							headers: {
								'Content-Type': data instanceof FormData ? 'multipart/form-data' : 'application/json',
								...default_headers
							}
						}
					: { headers: default_headers }),
				...conf
			})

			if (!res || !res?.data || res.data.error === true) {
				const { status, data } = res as AxiosResponse<Extract<IQueryStruct<T>, { error: true }>>
				throw new ErrorServer(data?.data, status)
			}
			return res as AxiosResponse<Extract<IQueryStruct<T>, { error: false }>>
		},
		[token]
	)

	return axios_fetch
}
