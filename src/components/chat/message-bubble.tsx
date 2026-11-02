import { SFAvatarImage } from '@/components/SFAvatar'
import { SFButton } from '@/components/SFButton'
import { SVGEdit, SVGPin, SVGReply, SVGSmile, SVGTrash } from '@/components/svgs'
import { useMessageActions } from '@/context/hooks/useMessageActions'
import { useMessagePermissions } from '@/context/hooks/useMessagePermissions'
import { CLIENT_OR_SERVER, type client_or_server_message } from '@/context/hooks/useMessagesHistory'
import { useCacheUsersStore, useMessageInteractionStore, useOwnUserStore, useWorkGroupStore } from '@/store'
import { STATUS_MESSAGE, type MessageReaction, type User } from '@/types'
import { FormatRelativeTime } from '@/utils'
import { useEffect, useRef, useState } from 'react'
import { FilePreview } from './file-preview'
import { DeleteMessageDialog, EmojiPickerDialog, PinMessageDialog } from './message-action-dialogs'
import { MessageReactions } from './message-reactions'

//TODO: make a component for client and server type
export interface MessageBubbleProps {
	message: client_or_server_message
	sender: User | undefined
	showAvatar: boolean
	previewUrl?: string
	file_id?: string
}

const NO_REACTIONS: MessageReaction[] = []
const MAX_MESSAGE_LENGTH = 150

const onResend = () => alert('implement this')

export function MessageBubble({ message, file_id, sender, showAvatar, previewUrl }: MessageBubbleProps) {
	const { message: msg, type } = message
	const serverMessage = type === CLIENT_OR_SERVER.SERVER ? message.message : null

	const ownUser = useOwnUserStore((s) => s.user)
	const setReplyTarget = useMessageInteractionStore((s) => s.setReplyTarget)
	const reactions = useMessageInteractionStore((s) =>
		serverMessage ? s.getMessageReactions(serverMessage.id) : NO_REACTIONS
	)

	const channel = useWorkGroupStore((s) => s.getChannel(serverMessage?.channel_id ?? null))
	const citedMessage =
		serverMessage?.citing_message != null
			? channel?.messages.find((candidate) => candidate.id === serverMessage.citing_message)
			: undefined
	const citedMember = useCacheUsersStore((s) => s.getUser(citedMessage?.sender_id))
	const citedSenderName = citedMember?.user.alias_name ?? citedMember?.user.name ?? 'Unknown'

	const permissions = useMessagePermissions(serverMessage)
	const { editMessage, deleteMessage, toggleReaction, togglePin } = useMessageActions(serverMessage)

	const [isEditing, setIsEditing] = useState(false)
	const [draft, setDraft] = useState(serverMessage?.content ?? '')
	const [isSaving, setIsSaving] = useState(false)
	const [isEmojiOpen, setIsEmojiOpen] = useState(false)
	const [isDeleteOpen, setIsDeleteOpen] = useState(false)
	const [isPinOpen, setIsPinOpen] = useState(false)
	const editRef = useRef<HTMLTextAreaElement>(null)

	const formattedTime = FormatRelativeTime(msg?.sent_at ? new Date(msg.sent_at) : new Date())

	const isPending = type === CLIENT_OR_SERVER.CLIENT && msg.status === STATUS_MESSAGE.STATUS_PENDING
	const isError = type === CLIENT_OR_SERVER.CLIENT && msg.status === STATUS_MESSAGE.STATUS_ERROR

	const effectivePreviewUrl =
		previewUrl || (type === CLIENT_OR_SERVER.CLIENT && msg.previewUrl ? msg.previewUrl : undefined)
	const effectiveFileId = file_id ?? (type === CLIENT_OR_SERVER.SERVER ? (msg.file_id ?? undefined) : undefined)

	useEffect(() => {
		if (!isEditing) return
		const input = editRef.current
		if (!input) return

		input.focus()
		input.setSelectionRange(input.value.length, input.value.length)
	}, [isEditing])

	const startEditing = () => {
		if (!serverMessage) return
		setDraft(serverMessage.content)
		setIsEditing(true)
	}

	const cancelEditing = () => {
		if (!serverMessage) return
		setDraft(serverMessage.content)
		setIsEditing(false)
	}

	const submitEdit = async () => {
		if (!serverMessage || isSaving) return

		const nextContent = draft.trim()
		if (!nextContent) return
		if (nextContent === serverMessage.content.trim()) {
			setIsEditing(false)
			return
		}

		setIsSaving(true)
		const success = await editMessage(nextContent)
		setIsSaving(false)
		if (success) setIsEditing(false)
	}

	const handleReply = () => {
		if (!serverMessage) return

		setReplyTarget({
			messageId: serverMessage.id,
			channelId: serverMessage.channel_id,
			senderId: serverMessage.sender_id,
			senderName: sender?.alias_name ?? sender?.name ?? 'Unknown',
			content: serverMessage.content || (serverMessage.file_id ? 'Attachment' : '')
		})
	}

	const selectedEmojis = reactions
		.filter((reaction) => ownUser && reaction.user_id === ownUser.id)
		.map((reaction) => reaction.unicode_char)

	return (
		<article
			id={serverMessage ? `message-${serverMessage.id}` : undefined}
			className={`group relative flex gap-3 px-2 py-0.5 hover:bg-neutral-800/30 -mx-2 rounded ${!showAvatar && 'pl-[42px]'} ${isPending ? 'opacity-60' : ''} ${isError ? 'bg-red-500/10' : ''}`}
		>
			{serverMessage && (
				<section className="absolute -top-3 right-2 z-20 flex items-center gap-0.5 rounded-lg border border-neutral-700 bg-darkFG/95 p-0.5 shadow-lg backdrop-blur opacity-0 pointer-events-none transition-opacity group-hover:opacity-100 group-hover:pointer-events-auto group-focus-within:opacity-100 group-focus-within:pointer-events-auto">
					{permissions.canReact && (
						<SFButton
							styling="none"
							type="button"
							title="Add reaction"
							aria-label="Add reaction"
							onClick={() => setIsEmojiOpen(true)}
							className="p-1.5! rounded-md! text-unfocused! hover:text-whiteText! hover:bg-neutral-700! transition-colors"
						>
							<SVGSmile className="w-4 h-4" />
						</SFButton>
					)}

					{permissions.canReply && (
						<SFButton
							styling="none"
							type="button"
							title="Reply"
							aria-label="Reply to message"
							onClick={handleReply}
							className="p-1.5! rounded-md! text-unfocused! hover:text-whiteText! hover:bg-neutral-700! transition-colors"
						>
							<SVGReply className="w-4 h-4" />
						</SFButton>
					)}

					{permissions.canEdit && !isEditing && (
						<SFButton
							styling="none"
							type="button"
							title="Edit message"
							aria-label="Edit message"
							onClick={startEditing}
							className="p-1.5! rounded-md! text-unfocused! hover:text-whiteText! hover:bg-neutral-700! transition-colors"
						>
							<SVGEdit className="w-4 h-4" />
						</SFButton>
					)}

					{permissions.canPin && (
						<SFButton
							styling="none"
							type="button"
							title={permissions.isPinned ? 'Unpin message' : 'Pin message'}
							aria-label={permissions.isPinned ? 'Unpin message' : 'Pin message'}
							onClick={() => setIsPinOpen(true)}
							className={`p-1.5! rounded-md! transition-colors hover:bg-neutral-700! ${
								permissions.isPinned ? 'text-primary!' : 'text-unfocused! hover:text-whiteText!'
							}`}
						>
							<SVGPin className="w-4 h-4" />
						</SFButton>
					)}

					{permissions.canDelete && (
						<SFButton
							styling="none"
							type="button"
							title="Delete message"
							aria-label="Delete message"
							onClick={() => setIsDeleteOpen(true)}
							className="p-1.5! rounded-md! text-unfocused! hover:text-red-400! hover:bg-red-500/10! transition-colors"
						>
							<SVGTrash className="w-4 h-4" />
						</SFButton>
					)}
				</section>
			)}

			{showAvatar && (
				<span className="w-[40px] flex-shrink-0">
					<SFAvatarImage src={sender?.profile_picture} username={sender?.alias_name} size="big" />
				</span>
			)}

			<section className="flex-1 min-w-0">
				{showAvatar && (
					<header className="flex items-baseline gap-2 mb-0.5">
						<h4 className="font-semibold text-[#f2f3f5] text-[0.9375rem] leading-5">{sender?.alias_name}</h4>
						<time
							dateTime={formattedTime}
							className="text-[0.6875rem] text-neutral-400 leading-4 select-none"
							title={`Sent ${formattedTime}`}
						>
							{formattedTime}
						</time>
						{serverMessage?.last_modified && <span className="text-[0.6875rem] text-neutral-500 italic">(edited)</span>}
						{isPending && <span className="text-[0.6875rem] text-neutral-500 italic">Sending...</span>}
						{isError && <span className="text-[0.6875rem] text-red-400 font-medium">Failed to send</span>}
					</header>
				)}

				{citedMessage && (
					<button
						type="button"
						onClick={() =>
							document
								.getElementById(`message-${citedMessage.id}`)
								?.scrollIntoView({ behavior: 'smooth', block: 'center' })
						}
						className="flex items-center gap-1.5 max-w-full mb-0.5 text-xs text-unfocused hover:text-whiteText transition-colors cursor-pointer"
						title="Jump to replied message"
					>
						<SVGReply className="w-3.5 h-3.5 shrink-0 -scale-y-100" aria-hidden="true" />
						<span className="font-semibold shrink-0">{citedSenderName}</span>
						<span className="truncate">{citedMessage.content || 'Attachment'}</span>
					</button>
				)}

				{isEditing && serverMessage ? (
					<section className="mt-0.5">
						<textarea
							ref={editRef}
							value={draft}
							maxLength={MAX_MESSAGE_LENGTH}
							rows={2}
							onChange={(e) => setDraft(e.target.value)}
							onKeyDown={(e) => {
								if (e.key === 'Enter' && !e.shiftKey) {
									e.preventDefault()
									void submitEdit()
								}

								if (e.key === 'Escape') {
									e.preventDefault()
									cancelEditing()
								}
							}}
							className="w-full resize-none rounded-md border border-neutral-600 bg-neutral-900 px-2.5 py-1.5 text-[0.9375rem] text-[#dcddde] focus:outline-none focus:ring-2 focus:ring-primary/30"
							aria-label="Edit message content"
						/>

						<div className="flex items-center gap-2 mt-1">
							<span className="text-[0.6875rem] text-neutral-500">Enter to save • Esc to cancel</span>
							<span className="ml-auto text-[0.6875rem] text-neutral-500">
								{draft.length}/{MAX_MESSAGE_LENGTH}
							</span>
							<button
								type="button"
								onClick={cancelEditing}
								disabled={isSaving}
								className="text-[0.6875rem] font-medium text-unfocused hover:text-whiteText disabled:opacity-50 cursor-pointer"
							>
								Cancel
							</button>
							<button
								type="button"
								onClick={() => void submitEdit()}
								disabled={isSaving || !draft.trim()}
								className="text-[0.6875rem] font-semibold text-primary hover:brightness-125 disabled:opacity-50 cursor-pointer"
							>
								{isSaving ? 'Saving...' : 'Save'}
							</button>
						</div>
					</section>
				) : (
					<p className="text-[#dcddde] text-[0.9375rem] whitespace-pre-wrap wrap-break-words">{msg.content}</p>
				)}

				{!showAvatar && serverMessage?.last_modified && (
					<span className="text-[0.6875rem] text-neutral-500 italic">(edited)</span>
				)}

				{effectivePreviewUrl ? (
					<span className="mt-1 inline-flex rounded-lg overflow-hidden max-w-[300px]">
						<img
							src={effectivePreviewUrl}
							alt="Attached preview"
							className="max-w-[300px] max-h-[200px] object-cover rounded-lg"
						/>
					</span>
				) : (
					effectiveFileId && (
						<span className="mt-1">
							<FilePreview fileId={effectiveFileId} />
						</span>
					)
				)}

				{serverMessage && (
					<MessageReactions reactions={reactions} onToggle={toggleReaction} disabled={!permissions.canReact} />
				)}

				{isError && onResend && (
					<span className="mt-1 flex items-center gap-2">
						<button
							type="button"
							onClick={onResend}
							className="text-xs font-medium text-red-300 hover:text-red-200 underline underline-offset-2"
						>
							Resend
						</button>
					</span>
				)}
			</section>

			{serverMessage && (
				<>
					<EmojiPickerDialog
						open={isEmojiOpen}
						onOpenChange={setIsEmojiOpen}
						selectedEmojis={selectedEmojis}
						onSelect={toggleReaction}
					/>

					<DeleteMessageDialog
						open={isDeleteOpen}
						onOpenChange={setIsDeleteOpen}
						content={serverMessage.content || 'Attachment'}
						onConfirm={deleteMessage}
					/>

					<PinMessageDialog
						open={isPinOpen}
						onOpenChange={setIsPinOpen}
						content={serverMessage.content || 'Attachment'}
						isPinned={permissions.isPinned}
						onConfirm={togglePin}
					/>
				</>
			)}
		</article>
	)
}
