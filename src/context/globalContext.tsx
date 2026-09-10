import { useAxios } from '@/api'
import { useOwnUserStore } from '@/store/userStore.ts'
import type { User } from '@/types'
import { useEffect, useState, type ReactNode } from 'react'
import { useShallow } from 'zustand/shallow'
import { GLOBAL_CONTEXT } from './globalContext.ts'

export function GlobalProvider({ children }: { children: ReactNode }) {
	const { get } = useAxios()
	const { setUser } = useOwnUserStore(useShallow((s) => ({ setUser: s.setUser })))

	const [isPending, setIsPending] = useState<boolean>(false)

	// TODO: implement this
	//const [theme, setTheme] = useState<"light" | "dark">("dark")

	useEffect(() => {
		if (isPending) return

		setIsPending(true)
		get<User>('/user/get_own', { silent: true })
			.then(({ data: res }) => {
				if (res.error) return
				setUser(res.data)
			})
			.finally(() => setIsPending(false))
	}, [])

	return (
		<GLOBAL_CONTEXT.Provider
			value={{
				pendingUserGroups: isPending
			}}
		>
			{children}
		</GLOBAL_CONTEXT.Provider>
	)
}
