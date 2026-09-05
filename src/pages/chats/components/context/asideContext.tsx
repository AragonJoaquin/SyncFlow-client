import { useAnyContext } from '@/context'
import { createContext, useCallback, useState, type ReactNode } from 'react'

interface IAside {
	isMobileOpen: boolean
	setIsMobileOpen: (v: boolean) => void
	toggleIsMobileOpen: () => void
}

export const ASIDE_BAR_CONTEXT = createContext<IAside>({} as IAside)

export function AsideBarProvider({ children }: { children: ReactNode }) {
	const [isMobileOpen, setMob] = useState(false)

	const setIsMobileOpen = useCallback((b: boolean) => {
		setMob(b)
	}, [])

	const toggleIsMobileOpen = useCallback(() => {
		setMob((b) => !b)
	}, [])

	return (
		<ASIDE_BAR_CONTEXT.Provider
			value={{
				isMobileOpen,
				setIsMobileOpen,
				toggleIsMobileOpen
			}}
		>
			{children}
		</ASIDE_BAR_CONTEXT.Provider>
	)
}

export const useAsideBarContext = () => useAnyContext<IAside>(ASIDE_BAR_CONTEXT)
