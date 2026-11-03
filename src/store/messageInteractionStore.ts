import type { Message, MessageReaction, UUIDv4 } from '@/types'
import { create } from 'zustand'
import { areReactionsEqual, type ReplyTarget } from './interactions'

type HydratableMessage = Pick<Message, 'id' | 'reactions'>

interface MessageInteractionStore {
	replyTarget: ReplyTarget | null
	setReplyTarget: (target: ReplyTarget) => void
	clearReplyTarget: () => void

	reactions: Map<number, MessageReaction[]>
	getMessageReactions: (messageId: number) => MessageReaction[]
	hydrateMessageReactions: (messages: ReadonlyArray<HydratableMessage>) => void
	addMessageReaction: (reaction: MessageReaction) => void
	removeMessageReaction: (messageId: number, userId: UUIDv4, emoji: string) => void
	clearMessageReactions: (messageId: number) => void
}

export const useMessageInteractionStore = create<MessageInteractionStore>((set, get) => ({
	replyTarget: null,
	setReplyTarget: (target) => set((s) => ({ ...s, replyTarget: target })),
	clearReplyTarget: () => set((s) => ({ ...s, replyTarget: null })),

	reactions: new Map<number, MessageReaction[]>(),

	getMessageReactions: (messageId) => get().reactions.get(messageId) ?? [],

	hydrateMessageReactions: (messages) =>
		set((s) => {
			let reactions: Map<number, MessageReaction[]> | null = null

			for (const message of messages) {
				const next = message.reactions ?? []
				const current = s.reactions.get(message.id)

				if (areReactionsEqual(current, next)) continue
				if (!current && next.length === 0) continue

				reactions ??= new Map(s.reactions)

				if (next.length === 0) reactions.delete(message.id)
				else reactions.set(message.id, next)
			}

			return reactions ? { ...s, reactions } : s
		}),

	addMessageReaction: (reaction) =>
		set((s) => {
			const current = s.reactions.get(reaction.message_id) ?? []
			const alreadyExists = current.some(
				(r) => r.user_id === reaction.user_id && r.unicode_char === reaction.unicode_char
			)
			if (alreadyExists) return s

			return {
				...s,
				reactions: new Map(s.reactions).set(reaction.message_id, [...current, reaction])
			}
		}),

	removeMessageReaction: (messageId, userId, emoji) =>
		set((s) => {
			const current = s.reactions.get(messageId)
			if (!current) return s

			const filtered = current.filter((r) => !(r.user_id === userId && r.unicode_char === emoji))
			const reactions = new Map(s.reactions)

			if (filtered.length === 0) reactions.delete(messageId)
			else reactions.set(messageId, filtered)

			return { ...s, reactions }
		}),

	clearMessageReactions: (messageId) =>
		set((s) => {
			if (!s.reactions.has(messageId)) return s

			const reactions = new Map(s.reactions)
			reactions.delete(messageId)
			return { ...s, reactions }
		})
}))
