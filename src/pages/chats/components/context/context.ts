import { useAnyContext } from '@/context'
import { createContext } from 'react'

interface IAside {
	isMobileOpen: boolean
	setIsMobileOpen: (v: boolean) => void
	toggleIsMobileOpen: () => void
}

export const ASIDE_BAR_CONTEXT = createContext<IAside | undefined>(undefined)

export const useAsideBarContext = () => useAnyContext<IAside>(ASIDE_BAR_CONTEXT)
