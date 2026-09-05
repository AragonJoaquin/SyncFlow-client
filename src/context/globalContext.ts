import { createContext } from 'react'
export interface IGlobalContext {
	pendingUserGroups: boolean
}

export const GLOBAL_CONTEXT = createContext<IGlobalContext | null>(null)
