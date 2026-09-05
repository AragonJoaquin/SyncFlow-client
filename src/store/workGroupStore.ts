import type { Category, CategoryWithChannels, Channel, FileRepo, FullWorkGroup, Message, WorkGroup } from '@/types'
import { create } from 'zustand'
import { UNDEFINED_ID } from './constants'
import { useCacheUsersStore } from './userStore'

type channel_id = Channel['id']
type message_id = Message['id']
type pagination_type = { offset: number; hasMore: boolean }

interface WorkGroupStore {
	//wk info
	workGroup: WorkGroup | null
	addWorkGroup: (wk: FullWorkGroup) => void
	removeWorkGroup: () => void

	//wk pfp
	groupImage: FileRepo | null
	removeImage: () => void
	changeImage: (img: FileRepo) => void

	//cats
	categories: Map<Category['id'], CategoryWithChannels>
	getCategory: (idCat: Category['id'] | undefined) => CategoryWithChannels | undefined
	getCategoryByName: (name: string, wkId?: WorkGroup['id']) => CategoryWithChannels | undefined

	addCategory: (cat: CategoryWithChannels) => void
	removeCategory: (cat: Category['id']) => void

	// active channel
	activeChannel: channel_id | null
	changeActiveChannel: (id: channel_id | null) => void
	getChannel: (channel_id: channel_id | null) => Channel | undefined
	getChannelByName: (name: string, catId?: Category['id']) => Channel | undefined

	// messages
	addMessage: (channel_id: channel_id, message: Message) => void
	removeMessage: (channel_id: channel_id, message_id: message_id) => void
	getMessage: (channel_id: channel_id, message_id: message_id) => [Channel | undefined, Message | undefined]
	getMessageIndex: (channel_id: channel_id, message_id: message_id) => number
	setMessages: (channel_id: channel_id, messages: Message[], hasMore: boolean) => void

	// channel fetching tracking
	fetchedChannels: Set<channel_id>
	isChannelFetched: (id: channel_id) => boolean
	setChannelFetched: (id: channel_id) => void

	// per-channel pagination state
	channelPagination: Map<channel_id, pagination_type>

	//extras
	setMoreMessages: (
		channel_id: channel_id,
		messages: Message[],
		has_more: boolean,
		pagination?: pagination_type
	) => void

	// category operations
	updateCategoryInStore: (categoryId: Category['id'], name: string, description?: string) => void
	deleteCategoryFromStore: (categoryId: Category['id']) => void
	addChannelToCategory: (categoryId: Category['id'], channel: Channel) => void
	updateChannelInStore: (channelId: Channel['id'], name: string) => void
	deleteChannelFromStore: (channelId: Channel['id'], categoryId: Category['id']) => void
}

export const useWorkGroupStore = create<WorkGroupStore>((set, get) => ({
	workGroup: null,
	categories: new Map(),
	groupImage: null,
	activeChannel: null,

	//NOTE: wk
	addWorkGroup: (wk) =>
		set((s) => {
			const categories = wk?.category ?? []
			const catMap = new Map<Category['id'], CategoryWithChannels>()

			useCacheUsersStore.getState().addMultipleUsers(wk.users)
			categories?.forEach((cat) => {
				catMap.set(cat.id, cat)
			})

			return { ...s, workGroup: wk?.work_group, groupImage: wk?.file_repo, categories: catMap }
		}),
	removeWorkGroup: () => set((s) => ({ ...s, workGroup: null })),

	///NOTE: Categories
	getCategory: (id) => get().categories.get(id ?? UNDEFINED_ID),

	getCategoryByName: (name, wkId) => {
		if (name === '') return

		for (const cat of get().categories.values()) {
			if (cat.name !== name) continue

			if (wkId) {
				if (cat.group_id === wkId) return cat
				continue
			}

			return cat
		}
		return
	},

	addCategory: (cat) =>
		set((s) => ({
			...s,
			categories: s.categories.set(cat.id, {
				...cat,
				channel: cat?.channel ?? []
			})
		})),
	removeCategory: (cat) =>
		set((s) => {
			const categories = get().categories
			categories.delete(cat)
			return {
				...s,
				categories: categories
			}
		}),

	//NOTE: WK PFP Image
	removeImage: () => set((s) => ({ ...s, groupImage: null })),
	changeImage: (img: FileRepo) => set((s) => ({ ...s, groupImage: img })),

	//NOTE: Active channel
	changeActiveChannel: (id: channel_id | null) => set((s) => ({ ...s, activeChannel: id })),

	getChannel: (channel_id: channel_id | null) => {
		//can be improved with a map, its O(N) now
		if (!channel_id) return

		for (const category of get().categories.values()) {
			const channel = category.channel.find((ch) => ch.id === channel_id)
			if (channel) return channel
		}
		return undefined
	},

	getChannelByName: (name, catId) => {
		if (name === '') return

		const categories = get().categories
		const cat = catId ? [categories?.get(catId)] : [...categories.values()]

		let ch: Channel | undefined

		cat?.some((c) => {
			if (catId && catId !== c?.id) return
			ch = c?.channel.find((ch) => ch.name === name)
			return !!ch
		})

		return ch
	},

	//NOTE: Messages utils
	addMessage: (channel_id: channel_id, message: Message) => {
		const channel = get().getChannel(channel_id)
		if (!channel) return

		const categories = get().categories
		const category = categories.get(channel.category_id)
		if (!category) return

		// we find the category, then channel, and then we modify it. and we return everything
		set((s) => ({
			...s,
			categories: new Map(categories).set(category.id, {
				...category,
				channel: category.channel.map((ch) =>
					ch.id === channel_id
						? {
								...channel,
								messages: [...(channel?.messages ?? []), message]
							}
						: ch
				)
			})
		}))
	},

	removeMessage: (channel_id: channel_id, message_id: message_id) => {
		const channel = get().getChannel(channel_id)
		if (!channel) return

		const messageIndex = get().getMessageIndex(channel_id, message_id)
		if (messageIndex < 0) return

		const category = get().categories.get(channel.category_id)
		if (!category) return

		//find the cat, channel, modify channel. return eveyrhting
		const newCategories = new Map(get().categories)

		newCategories.set(category.id, {
			...category,
			channel: category.channel.map((ch) =>
				ch.id === channel_id
					? {
							...channel,
							messages: [...channel.messages.slice(0, messageIndex), ...channel.messages.slice(messageIndex + 1)]
						}
					: ch
			)
		})

		set((s) => ({ ...s, categories: newCategories }))
	},

	getMessage: (channel_id: channel_id, message_id: message_id) => {
		const channel = get().getChannel(channel_id)
		if (!channel) return [undefined, undefined]

		const message = channel.messages.find((msg) => msg.id === message_id)
		return [channel, message]
	},

	getMessageIndex: (channel_id: channel_id, message_id: message_id) => {
		const channel = get().getChannel(channel_id)
		if (!channel) return -1
		return channel.messages.findIndex((msg) => msg.id === message_id)
	},

	//NOTE: Channel fetching tracking
	fetchedChannels: new Set<channel_id>(),
	isChannelFetched: (id: channel_id) => get().fetchedChannels.has(id),
	setChannelFetched: (id: channel_id) => set((s) => ({ ...s, fetchedChannels: new Set(s.fetchedChannels).add(id) })),

	//NOTE: Per-channel pagination state
	channelPagination: new Map<channel_id, { offset: number; hasMore: boolean }>(),

	//NOTE: Message operations
	setMessages: (channel_id: channel_id, messages: Message[], hasMore: boolean) => {
		const channel = get().getChannel(channel_id)
		if (!channel) return

		const categories = get().categories
		const category = categories.get(channel.category_id)
		if (!category) return

		const currentPagination = get().channelPagination.get(channel_id) ?? { offset: 0, hasMore: true }
		const newOffset = currentPagination.offset + messages.length

		set((s) => ({
			...s,
			fetchedChannels: new Set(s.fetchedChannels).add(channel_id),
			channelPagination: new Map(s.channelPagination).set(channel_id, {
				offset: newOffset,
				hasMore
			}),
			categories: new Map(categories).set(category.id, {
				...category,
				channel: category.channel.map((ch) =>
					ch.id === channel_id
						? {
								...channel,
								messages: messages
							}
						: ch
				)
			})
		}))
	},

	setMoreMessages: (channel_id, messages, has_more, pagination = { hasMore: true, offset: 0 }) => {
		const channel = get().getChannel(channel_id)
		if (!channel) return

		const categories = get().categories
		const category = categories.get(channel.category_id)
		if (!category) return

		set((s) => ({
			...s,
			channelPagination: new Map(s.channelPagination).set(channel_id, {
				offset: pagination.offset + messages.length,
				hasMore: has_more
			}),
			categories: new Map(categories).set(category.id, {
				...category,
				channel: category.channel.map((ch) =>
					ch.id === channel_id
						? {
								...channel,
								messages: [...(channel?.messages ?? []), ...messages]
							}
						: ch
				)
			})
		}))
	},

	// Category operations
	updateCategoryInStore: (categoryId, name, description) => {
		const categories = get().categories
		const category = categories.get(categoryId)
		if (!category) return

		set((s) => ({
			...s,
			categories: new Map(categories).set(categoryId, {
				...category,
				name,
				description: description ?? category.description
			})
		}))
	},

	deleteCategoryFromStore: (categoryId) => {
		const categories = get().categories
		categories.delete(categoryId)
		set((s) => ({ ...s, categories: new Map(categories) }))
	},

	addChannelToCategory: (categoryId, channel) => {
		const categories = get().categories
		const category = categories.get(categoryId)
		if (!category) return

		set((s) => ({
			...s,
			categories: new Map(categories).set(categoryId, {
				...category,
				channel: [...(category.channel ?? []), channel]
			})
		}))
	},

	updateChannelInStore: (channelId, name) => {
		const categories = get().categories
		for (const [catId, category] of categories) {
			const channelIndex = category.channel?.findIndex((ch) => ch.id === channelId)
			if (channelIndex !== undefined && channelIndex >= 0) {
				set((s) => {
					const newCategories = new Map(s.categories)
					newCategories.set(catId, {
						...category,
						channel: category.channel?.map((ch, idx) => (idx === channelIndex ? { ...ch, name } : ch))
					})
					return { ...s, categories: newCategories }
				})
				return
			}
		}
	},

	deleteChannelFromStore: (channelId, categoryId) => {
		const categories = get().categories
		const category = categories.get(categoryId)
		if (!category) return

		set((s) => ({
			...s,
			categories: new Map(categories).set(categoryId, {
				...category,
				channel: category.channel?.filter((ch) => ch.id !== channelId)
			})
		}))
	}
}))
