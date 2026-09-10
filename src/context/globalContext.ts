import { createContext } from 'react'
import { useAnyContext } from './useAnyContext'
export interface IGlobalContext {
	pendingUserGroups: boolean
}

export const GLOBAL_CONTEXT = createContext<IGlobalContext | undefined>(undefined)
export const useGlobalContext = () => useAnyContext(GLOBAL_CONTEXT)
