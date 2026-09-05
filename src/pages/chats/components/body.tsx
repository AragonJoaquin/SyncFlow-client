import { SFTipCard } from '@/components'
import { MessageBubble, type MessageBubbleProps } from '@/components/chat/message-bubble'
import { SFImage } from '@/components/SFImage'
import { useCacheUsersStore, useWorkGroupStore } from '@/store'
import { useEffect, useMemo, useRef } from 'react'
import { useShallow } from 'zustand/shallow'

const CHAIN_THRESHOLD = 10 as const

export function Body() {
	const categories = useWorkGroupStore((s) => s.categories)
	const activeChannelId = useWorkGroupStore((s) => s.activeChannel)
	const containerRef = useRef<HTMLElement>(null)

	const currentChannel = useMemo(() => {
		if (!activeChannelId) return undefined
		for (const cat of categories.values()) {
			const ch = cat.channel.find((c) => c.id === activeChannelId)
			if (ch) return ch
		}
		return undefined
	}, [categories, activeChannelId])

	const messages = currentChannel?.messages ?? []

	useEffect(() => {
		if (!messages.length) return
		setTimeout(() => {
			containerRef.current?.scrollTo({
				top: containerRef.current?.scrollHeight,
				behavior: 'instant'
			})
		}, 0)
	}, [messages])

	const { getUser } = useCacheUsersStore(
		useShallow((s) => ({
			getUser: s.getUser
		}))
	)
	const groupedMessages = useMemo(() => {
		const result: MessageBubbleProps[] = []

		let currentChainLength: number = 0
		messages.forEach((msg) => {
			const isConsecutive = result[result.length - 1]?.message.sender_id === msg.sender_id

			const showAvatar = !(isConsecutive && currentChainLength < CHAIN_THRESHOLD)
			if (!showAvatar) {
				currentChainLength++
			} else {
				currentChainLength = 0
			}

			result.push({ message: msg, sender: getUser(msg.sender_id)?.user, showAvatar })
		})

		return result
	}, [messages, getUser])

	return (
		<article ref={containerRef} className="flex-1 overflow-y-auto h-full">
			<section className={`font-Cabin flex flex-col grow h-full gap-4 p-3`}>
				{currentChannel ? (
					messages?.length > 0 &&
					groupedMessages.map(({ message: msg, showAvatar, sender }) => (
						<MessageBubble key={msg.id} message={msg} sender={sender} showAvatar={showAvatar} />
					))
				) : (
					<NoChannelSelected />
				)}
			</section>
		</article>
	)
}

function NoChannelSelected() {
	const workGroup = useWorkGroupStore((s) => s.workGroup)

	return (
		<article className="relative flex flex-col gap-6 grow size-full justify-center items-center p-8 text-center select-none pb-18">
			<header className="flex flex-col justify-between items-center gap-4">
				<SFImage
					title={workGroup?.name ?? ''}
					imageUrl={workGroup?.group_pic}
					className="shadow-lg border border-primaryText/10"
				/>
				<span className="flex flex-col gap-y-1">
					<h4 className="text-3xl font-semibold text-primaryText tracking-tight">{workGroup?.name}</h4>
					<p className={`text-lg ${workGroup?.description ? 'text-whiteText' : 'text-disabled font-sans italic'}`}>
						{workGroup?.description ?? 'No description provided'}
					</p>
				</span>
			</header>

			{/* Tips Grid */}
			<article className="grid items-center place-items-center grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl w-full ">
				<SFTipCard title="Quick Search" description="Find messages across the group" shortcut="Ctrl + K" />
				<SFTipCard title="Next Channel" description="Go ciclying between channels" shortcut="Ctrl + N" />
				<SFTipCard title="Prev Channel" description="Go ciclying between channels" shortcut="Ctrl + P" />

				<SFTipCard title="Group Settings" description="Manage members and group preferences" />
			</article>

			<footer className="absolute bottom-0 -translate-y-5">
				<button type="button" className="text-sm text-unfocused">
					Always be nice!
				</button>
			</footer>
		</article>
	)
}
