import { createContext } from 'react'
import type { axios_config, axios_data, axios_route } from './axios_helper'
import type { return_axios_internal_fetch } from './axiosInstance'
import { useAnyContext } from '@/context'

type returnFunc = <T>(
	route: axios_route,
	data?: axios_data,
	conf?: axios_config<unknown>
) => return_axios_internal_fetch<T>

interface IAxios {
	get: <T>(route: Parameters<returnFunc>['0'], conf?: Parameters<returnFunc>['2']) => return_axios_internal_fetch<T>
	post: returnFunc
	delete: returnFunc
	put: returnFunc
	patch: returnFunc
}

export const AXIOS_CONTEXT = createContext<IAxios | undefined>(undefined)

//NOTE: it should say "useAxiosContext"... but i prefer this way... to keep the abstraction simple
export const useAxios = () => useAnyContext(AXIOS_CONTEXT)
