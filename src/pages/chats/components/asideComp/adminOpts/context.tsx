import { useAnyContext } from '@/context'
import { createContext, useCallback, useState, type ReactNode } from 'react'

interface IAdminOpts {
	ActiveModal: modals_vals
	SetActiveModal: (v?: modals_vals) => void
	CloseActiveModal: () => void
}

export const ADMIN_OPTS_CONTEXT = createContext<IAdminOpts>({} as IAdminOpts)

export const ADMIN_MODALS_OPEN = {
	CREATE_CHANNEL: 'create_channel',
	CREATE_CATEGORY: 'create_category'
} as const
type modals_vals = (typeof ADMIN_MODALS_OPEN)[keyof typeof ADMIN_MODALS_OPEN] | undefined

export function AdminOptsProvider({ children }: { children: ReactNode }) {
	const [mod, setMod] = useState<modals_vals>()

	const SetModal = useCallback((v?: modals_vals) => setMod(v), [])
	const CloseModal = useCallback(() => setMod(undefined), [])

	return (
		<ADMIN_OPTS_CONTEXT.Provider
			value={{
				ActiveModal: mod,
				SetActiveModal: SetModal,
				CloseActiveModal: CloseModal
			}}
		>
			{children}
		</ADMIN_OPTS_CONTEXT.Provider>
	)
}

export const useAdminOptsContext = () => useAnyContext<IAdminOpts>(ADMIN_OPTS_CONTEXT)
