import { useCallback, useMemo, type ReactNode } from 'react'
import { AXIOS_METHODS, type axios_config, type axios_data, type axios_route } from './axios_helper'
import { useAxiosInternalFetch } from './axiosInstance'
import { AXIOS_CONTEXT } from './context'

//NOTE: yes, this is a hidden context painted as a hook
// then why is it here? its better to think its a hook rather a context because
// it avoids an unnecesary render in the useAxiosInternalFetch that brokes prod... and that can be confusing.
// it needs its own context since it CANNOT get any other update than itself
// and yes, this is peak production code
export function AxiosProvider({ children }: { children: ReactNode }) {
	const axios_fetch = useAxiosInternalFetch()

	// i could make a reducer... but i dont want to :)
	const axiosGet = useCallback(
		async <T,>(route: axios_route, conf?: axios_config<unknown>) =>
			await axios_fetch<T>(route, undefined, AXIOS_METHODS.GET, conf),
		[axios_fetch]
	)

	const axiosPost = useCallback(
		async <T,>(route: axios_route, data?: axios_data, conf?: axios_config<unknown>) =>
			await axios_fetch<T>(route, data, AXIOS_METHODS.POST, conf),
		[axios_fetch]
	)

	const axiosPatch = useCallback(
		async <T,>(route: axios_route, data?: axios_data, conf?: axios_config<unknown>) =>
			await axios_fetch<T>(route, data, AXIOS_METHODS.PATCH, conf),
		[axios_fetch]
	)

	const axiosPut = useCallback(
		async <T,>(route: axios_route, data?: axios_data, conf?: axios_config<unknown>) =>
			await axios_fetch<T>(route, data, AXIOS_METHODS.PUT, conf),
		[axios_fetch]
	)

	const axiosDelete = useCallback(
		async <T,>(route: axios_route, data?: axios_data, conf?: axios_config<unknown>) =>
			await axios_fetch<T>(route, data, AXIOS_METHODS.DELETE, conf),
		[axios_fetch]
	)

	const contextValue = useMemo(
		() => ({
			get: axiosGet,
			delete: axiosDelete,
			patch: axiosPatch,
			post: axiosPost,
			put: axiosPut
		}),
		[axiosGet, axiosDelete, axiosPatch, axiosPost, axiosPut]
	)

	return <AXIOS_CONTEXT.Provider value={contextValue}>{children}</AXIOS_CONTEXT.Provider>
}
