import { useAnyContext } from '@/context'
import { createContext, useCallback, useMemo, useState, type ReactNode } from 'react'

interface IAside {
	isMobileOpen: boolean
	setIsMobileOpen: (v: boolean) => void
	toggleIsMobileOpen: () => void
}

export const ASIDE_BAR_CONTEXT = createContext<IAside | undefined>(undefined)

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

export const useAsideBarContext = () => useAnyContext<IAside>(ASIDE_BAR_CONTEXT)
