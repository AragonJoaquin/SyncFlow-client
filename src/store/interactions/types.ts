import type { UUIDv4 } from '@/types'

//NOTE: reaction types
export type ReactionRequestMatch = Pick<PendingReactionRequest, 'messageId' | 'userId' | 'emoji'>

export type PendingReactionRequest = {
	seq: number
	kind: ReactionRequestKind
	messageId: number
	userId: UUIDv4
	emoji: string
	reactedAt: Date
}

export const REACTION_REQ_KIND = {
	ADD: 'add',
	REMOVE: 'remove'
	// NONE: 'none'
} as const

export type ReactionRequestKind = (typeof REACTION_REQ_KIND)[keyof typeof REACTION_REQ_KIND]

//NOTE: reply types:

export type ReplyTarget = {
	messageId: number
	channelId: number
	senderId: UUIDv4
	senderName: string
	content: string
}
