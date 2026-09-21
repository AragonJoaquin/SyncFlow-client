import { useCallback, useMemo, useState, type ReactNode } from 'react'
import { ASIDE_BAR_CONTEXT } from './context'

export function AsideBarProvider({ children }: { children: ReactNode }) {
	const [isMobileOpen, setMob] = useState(false)

	const setIsMobileOpen = useCallback((b: boolean) => {
		setMob(b)
	}, [])

	const toggleIsMobileOpen = useCallback(() => {
		setMob((b) => !b)
	}, [])

	const ctx_value = useMemo(() => {
		return {
			isMobileOpen,
			setIsMobileOpen,
			toggleIsMobileOpen
		}
	}, [isMobileOpen, setIsMobileOpen, toggleIsMobileOpen])

	return <ASIDE_BAR_CONTEXT.Provider value={ctx_value}>{children}</ASIDE_BAR_CONTEXT.Provider>
}
