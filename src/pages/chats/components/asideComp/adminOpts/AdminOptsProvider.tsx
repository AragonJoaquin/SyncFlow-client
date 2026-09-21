import { useCallback, useMemo, useState, type ReactNode } from 'react'
import { ADMIN_OPTS_CONTEXT, type modals_vals } from './context'

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
