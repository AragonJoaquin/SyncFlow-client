import { useContext } from 'react'

//NOTE: generic context provider
const ERROR_MESSAGE_OUT_OF_BOUNDS_CONTEXT = 'context was called outside its own provider. skill issue'

export function useAnyContext<T>(ctx: React.Context<T | undefined>) {
	const context = useContext(ctx)
	if (!context) throw new Error(ERROR_MESSAGE_OUT_OF_BOUNDS_CONTEXT)
	return context
}
