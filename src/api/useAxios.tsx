import { useAnyContext } from '@/context'
import type { AxiosRequestConfig, AxiosResponse } from 'axios'
import { createContext, useCallback, type ReactNode } from 'react'
import { AXIOS_METHODS, type axios_data, type axios_route, type IQueryStruct } from './axios_helper'
import { useAxiosInternalFetch } from './axiosInstance'

type returnFunc = <T extends any>(
	route: axios_route,
	data?: axios_data,
	conf?: AxiosRequestConfig<any>
) => Promise<AxiosResponse<IQueryStruct<T> & { error: false }, any, {}>>

interface IAxios {
	get: <T extends any>(
		route: Parameters<returnFunc>['0'],
		conf?: Parameters<returnFunc>['2']
	) => Promise<AxiosResponse<IQueryStruct<T> & { error: false }, any, {}>>
	post: returnFunc
	delete: returnFunc
	put: returnFunc
	patch: returnFunc
}

const AXIOS_CONTEXT = createContext<IAxios | null>(null)

//NOTE: yes, this is a hidden context painted as a hook
// then why is it here? its better to think its a hook rather a context because
// it avoids an unnecesary render in the useAxiosInternalFetch that brokes prod... and that can be confusing.
// it needs its own context since it CANNOT get any other update than itself
// and yes, this is peak production code
export function AxiosProvider({ children }: { children: ReactNode }) {
	const axios_fetch = useAxiosInternalFetch()

	// i could make a reducer... but i dont want to :)
	const axiosGet = useCallback(
		async <T extends any>(route: axios_route, conf?: AxiosRequestConfig<any>) =>
			await axios_fetch<T>(route, undefined, AXIOS_METHODS.GET, conf),
		[]
	)

	const axiosPost = useCallback(
		async <T extends any>(route: axios_route, data?: axios_data, conf?: AxiosRequestConfig<any>) =>
			await axios_fetch<T>(route, data, AXIOS_METHODS.POST, conf),
		[]
	)

	const axiosPatch = useCallback(
		async <T extends any>(route: axios_route, data?: axios_data, conf?: AxiosRequestConfig<any>) =>
			await axios_fetch<T>(route, data, AXIOS_METHODS.PATCH, conf),
		[]
	)

	const axiosPut = useCallback(
		async <T extends any>(route: axios_route, data?: axios_data, conf?: AxiosRequestConfig<any>) =>
			await axios_fetch<T>(route, data, AXIOS_METHODS.PUT, conf),
		[]
	)

	const axiosDelete = useCallback(
		async <T extends any>(route: axios_route, data?: axios_data, conf?: AxiosRequestConfig<any>) =>
			await axios_fetch<T>(route, data, AXIOS_METHODS.DELETE, conf),
		[]
	)

	return (
		<AXIOS_CONTEXT.Provider
			value={{
				get: axiosGet,
				delete: axiosDelete,
				patch: axiosPatch,
				post: axiosPost,
				put: axiosPut
			}}
		>
			{children}
		</AXIOS_CONTEXT.Provider>
	)
}

//NOTE: it should say "useAxiosContext"... but i prefer this way... to keep the abstraction simple
export const useAxios = () => useAnyContext<IAxios | null>(AXIOS_CONTEXT)
