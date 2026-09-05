import { useContext } from 'react'
import { CHAT_CONTEXT, type IChatContext } from './chatContext.ts'
import { GLOBAL_CONTEXT, type IGlobalContext } from './globalContext'

//NOTE: generic context provider
const ERROR_MESSAGE_OUT_OF_BOUNDS_CONTEXT = 'context was called outside its own provider. skill issue'

export function useAnyContext<T>(ctx: React.Context<T>) {
	const context = useContext<T>(ctx)
	if (!context) throw new Error(ERROR_MESSAGE_OUT_OF_BOUNDS_CONTEXT)
	return context
}

//contexts
export const useGlobalContext = () => useAnyContext<IGlobalContext | null>(GLOBAL_CONTEXT)
export const useChatContext = () => useAnyContext<IChatContext | null>(CHAT_CONTEXT)

export * from './chatContext.tsx'
export * from './globalContext.tsx'
