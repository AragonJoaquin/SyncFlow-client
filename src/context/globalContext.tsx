import { useAxios } from '@/api'
import type { ErrorServer } from '@/api/axios_helper.ts'
import { useOwnUserStore } from '@/store/userStore.ts'
import type { User } from '@/types'
import { useEffect, useState, type ReactNode } from 'react'
import { useShallow } from 'zustand/shallow'
import { GLOBAL_CONTEXT } from './globalContext.ts'

export function GlobalProvider({ children }: { children: ReactNode }) {
	const { get } = useAxios()
	const { token, setUser } = useOwnUserStore(useShallow((s) => ({ token: s.token, setUser: s.setUser })))

	const [isPending, setIsPending] = useState<boolean>(false)

	// TODO: implement this
	//const [theme, setTheme] = useState<"light" | "dark">("dark")

	useEffect(() => {
		if (!token && isPending) return

		setIsPending(true)
		get<User>('/user/get_own')
			.then(({ data: res }) => {
				if (res?.data == null) return
				setUser(res.data)
			})
			.catch((error: ErrorServer) => {
				console.error('could not get the own user information: ', error)
			})
			.finally(() => setIsPending(false))
	}, [false])

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
