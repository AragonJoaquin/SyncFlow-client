import { useAnyContext } from '@/context'
import { createContext } from 'react'

export const ADMIN_MODALS_OPEN = {
	CREATE_CHANNEL: 'create_channel',
	CREATE_CATEGORY: 'create_category'
} as const

export type modals_vals = (typeof ADMIN_MODALS_OPEN)[keyof typeof ADMIN_MODALS_OPEN] | undefined

interface IAdminOpts {
	ActiveModal: modals_vals
	SetActiveModal: (v?: modals_vals) => void
	CloseActiveModal: () => void
}

export const ADMIN_OPTS_CONTEXT = createContext<IAdminOpts | undefined>(undefined)

export const useAdminOptsContext = () => useAnyContext<IAdminOpts>(ADMIN_OPTS_CONTEXT)
