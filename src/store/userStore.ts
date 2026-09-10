import type { GroupMemberWithProfile, User, UUIDv4 } from '@/types'
import { create } from 'zustand'
import { useWorkGroupStore } from '.'

interface UserStore {
	user: User | null

	login: (user: User) => void
	setUser: (u: User) => void
	logout: () => void
}

//NOTE: this store can be merged with the cacheUsers...
export const useOwnUserStore = create<UserStore>()((set, _) => ({
	user: null,

	login: (user) => set({ user }),
	logout: () => set({ user: null }),

	setUser: (u) => set((prev) => ({ ...prev, user: u }))
}))

interface CacheUsersStore {
	users: Map<UUIDv4, GroupMemberWithProfile>

	getUsersInGroup: () => GroupMemberWithProfile[]
	addMultipleUsers: (users: GroupMemberWithProfile[]) => void
	addUser: (user: GroupMemberWithProfile) => void
	removeUser: (user_id: UUIDv4) => void
	getUser: (user_id: UUIDv4 | undefined) => GroupMemberWithProfile | undefined
}

export const useCacheUsersStore = create<CacheUsersStore>((set, get) => ({
	users: new Map(),

	getUsersInGroup: () => {
		const groupId = useWorkGroupStore.getState().workGroup?.id
		const usersInGroup: GroupMemberWithProfile[] = []
		if (!groupId) return usersInGroup

		get().users?.forEach((val) => {
			val.membership.group_id === groupId && usersInGroup.push(val)
		})
		return usersInGroup
	},

	addMultipleUsers: (users) => {
		users.map((u) => {
			get().addUser(u)
		})
	},
	addUser: (u) => {
		const { user, membership } = u
		if (!user?.id) return

		const userExists = get().users.get(user.id)
		if (userExists) return

		set((state) => {
			const new_user = new Map(state?.users).set(user?.id, {
				membership,
				user
			})

			return {
				...state,
				users: new_user
			}
		})
	},
	removeUser: (user_id) => {
		const newMap = get().users
		const userDelete = newMap.delete(user_id)
		if (!userDelete) return
		set((state) => ({ ...state, users: newMap }))
	},

	getUser: (user_id) => user_id && get().users.get(user_id)
}))
