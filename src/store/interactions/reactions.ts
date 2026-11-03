import type { MessageReaction } from '@/types'
import { useMessageInteractionStore } from '../messageInteractionStore'
import {
	REACTION_REQ_KIND,
	type PendingReactionRequest,
	type ReactionRequestKind,
	type ReactionRequestMatch
} from './types'

const pendingReactionRequests: Record<ReactionRequestKind, PendingReactionRequest[]> = {
	[REACTION_REQ_KIND.ADD]: [],
	[REACTION_REQ_KIND.REMOVE]: []
} as const

export function rollbackReactionRequest(kind: ReactionRequestKind) {
	const req = pendingReactionRequests[kind].shift()
	if (!req) return

	const hasNewerRequest = [...pendingReactionRequests.add, ...pendingReactionRequests.remove].some(
		(pending) =>
			pending.seq > req.seq &&
			pending.messageId === req.messageId &&
			pending.userId === req.userId &&
			pending.emoji === req.emoji
	)

	if (hasNewerRequest) return
	const store = useMessageInteractionStore.getState()

	if (kind === REACTION_REQ_KIND.ADD) return store.removeMessageReaction(req.messageId, req.userId, req.emoji)

	store.addMessageReaction({
		user_id: req.userId,
		message_id: req.messageId,
		unicode_char: req.emoji,
		reacted_at: req.reactedAt
	})
}

export function clearPendingReactionRequests() {
	pendingReactionRequests.add.length = 0
	pendingReactionRequests.remove.length = 0
}

export function areReactionsEqual(a: MessageReaction[] | undefined, b: MessageReaction[]) {
	if (!a || a.length !== b.length) return false

	return a.every(
		(reaction, index) =>
			reaction.user_id === b[index]?.user_id &&
			reaction.message_id === b[index]?.message_id &&
			reaction.unicode_char === b[index]?.unicode_char &&
			reaction.reacted_at.getTime() === b[index]?.reacted_at.getTime()
	)
}

//horrible queue update. maybe delete
let reactionRequestSeq = 0
export function queueReactionRequest(request: Omit<PendingReactionRequest, 'seq'>) {
	const pending = { ...request, seq: ++reactionRequestSeq }
	pendingReactionRequests[pending.kind].push(pending)
}

export function settleReactionRequest(match: ReactionRequestMatch, kind?: ReactionRequestKind) {
	if (!kind) return

	const queue = pendingReactionRequests[kind]
	const index = queue.findIndex(
		(request) =>
			request.messageId === match.messageId && request.userId === match.userId && request.emoji === match.emoji
	)

	if (index !== -1) queue.splice(index, 1)
}
