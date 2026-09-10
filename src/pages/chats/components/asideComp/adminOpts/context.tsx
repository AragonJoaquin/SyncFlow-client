import { useAnyContext } from '@/context'
import { createContext, useCallback, useMemo, useState, type ReactNode } from 'react'

interface IAdminOpts {
	ActiveModal: modals_vals
	SetActiveModal: (v?: modals_vals) => void
	CloseActiveModal: () => void
}

export const ADMIN_OPTS_CONTEXT = createContext<IAdminOpts | undefined>(undefined)

export const ADMIN_MODALS_OPEN = {
	CREATE_CHANNEL: 'create_channel',
	CREATE_CATEGORY: 'create_category'
} as const

type modals_vals = (typeof ADMIN_MODALS_OPEN)[keyof typeof ADMIN_MODALS_OPEN] | undefined

export function AdminOptsProvider({ children }: { children: ReactNode }) {
	const [mod, setMod] = useState<modals_vals>()

	const SetModal = useCallback((v?: modals_vals) => setMod(v), [])
	const CloseModal = useCallback(() => setMod(undefined), [])

	const val = useMemo(
		() => ({
			ActiveModal: mod,
			SetActiveModal: SetModal,
			CloseActiveModal: CloseModal
		}),
		[mod, SetModal, CloseModal]
	)

	return <ADMIN_OPTS_CONTEXT.Provider value={val}>{children}</ADMIN_OPTS_CONTEXT.Provider>
}

export const useAdminOptsContext = () => useAnyContext<IAdminOpts>(ADMIN_OPTS_CONTEXT)
