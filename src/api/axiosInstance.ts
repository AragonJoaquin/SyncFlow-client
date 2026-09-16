import { type AxiosResponse } from 'axios'
import { useCallback } from 'react'
import {
	AXIOS_INSTANCE,
	AXIOS_METHODS,
	default_axios_config,
	ErrorServer,
	type axios_avail_methods,
	type axios_config,
	type axios_data,
	type axios_route,
	type ErrorData,
	type IQueryStruct
} from './axios_helper'
import { useToastStore } from '@/store'

export type return_axios_internal_fetch<T> = Promise<AxiosResponse<IQueryStruct<T>>>

export function useAxiosInternalFetch() {
	const errToast = useToastStore((s) => s.addErrorToast)

	const axios_fetch = useCallback(
		async <T>(
			route: axios_route,
			data: axios_data | undefined,
			met: axios_avail_methods,
			cfg?: axios_config<any>
		): return_axios_internal_fetch<T> => {
			const c = { ...default_axios_config, ...cfg }

			try {
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
					...c?.axios_conf
				})

				if (!res || !res?.data || res.data.error) {
					const { status, data, statusText } = res
					if (!c?.silent)
						errToast(new ErrorServer(data?.data as ErrorData, status || 500, statusText || 'Unexpected Error'))
					return res as AxiosResponse<Extract<IQueryStruct<T>, { error: true }>>
				}

				return res as AxiosResponse<Extract<IQueryStruct<T>, { error: false }>>
			} catch {
				const e = new ErrorServer({ error_message: 'ohmygod the servers are burning down' })
				errToast(e)
				throw e
			}
		},
		[errToast]
	)

	return axios_fetch
}
