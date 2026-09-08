import { type AxiosRequestConfig, type AxiosResponse } from 'axios'
import { useCallback } from 'react'
import {
	AXIOS_INSTANCE,
	AXIOS_METHODS,
	ErrorServer,
	type axios_avail_methods,
	type axios_data,
	type axios_route,
	type IQueryStruct
} from './axios_helper'

export function useAxiosInternalFetch() {
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
								'Content-Type': data instanceof FormData ? 'multipart/form-data' : 'application/json'
							}
						}
					: { headers: {} }),
				...conf
			})

			if (!res || !res?.data || res.data.error === true) {
				const { status, data } = res as AxiosResponse<Extract<IQueryStruct<T>, { error: true }>>
				throw new ErrorServer(data?.data, status)
			}
			return res as AxiosResponse<Extract<IQueryStruct<T>, { error: false }>>
		},
		[]
	)

	return axios_fetch
}
