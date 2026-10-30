import { useAxios } from '@/api'
import { useChatContext } from '@/context'
import { useWorkGroupStore } from '@/store'
import type { FullWorkGroup } from '@/types'
import { useEffect, useState } from 'react'
import { useShallow } from 'zustand/shallow'
import { SFSkeleton } from '@/components'
import { AsideBar, Body, FooterChat, Header } from './components'
import { MainMenuNoGroup } from './components/bodyComp'
import { AsideBarProvider } from './components/context'

export function ChatPage() {
	const { workGroup, addWorkGroup, activeId, getChannel } = useWorkGroupStore(
		useShallow((s) => ({
			workGroup: s.workGroup,
			addWorkGroup: s.addWorkGroup,
			activeId: s.activeChannel,
			getChannel: s.getChannel
		}))
	)

	const { get } = useAxios()
	const activeChan = getChannel(activeId)
	const { loadMoreMessages } = useChatContext()
	const [isChatsInfoLoading, setIsChatsInfoLoading] = useState<boolean>(true)

	useEffect(() => {
		setIsChatsInfoLoading(true)
		get<FullWorkGroup>('/chats_info', { silent: true })
			.then(({ data }) => {
				if (!data || data.error) return
				addWorkGroup(data?.data)
			})
			.finally(() => {
				setIsChatsInfoLoading(false)
			})
	}, [addWorkGroup, get])

	useEffect(() => {
		if (!activeId) return
		const store = useWorkGroupStore.getState()
		if (!store.isChannelFetched(activeId)) loadMoreMessages(activeId)
	}, [activeId, loadMoreMessages])

	if (isChatsInfoLoading) {
		return (
			<section className="flex flex-col items-center justify-center w-full h-full bg-darkBG gap-6">
				<div className="flex flex-col items-center gap-2">
					<SFSkeleton className="w-16 h-16 rounded-full" />
					<h3 className="text-xl font-semibold text-whiteText font-OpenSans mt-2">Loading SyncFlow...</h3>
					<p className="text-sm text-neutral-400 font-Cabin">Fetching your chats and workspace data</p>
				</div>
				<div className="w-64 flex flex-col gap-3 mt-4">
					<SFSkeleton className="w-full h-10 rounded-lg" />
					<SFSkeleton className="w-3/4 h-8 rounded-lg mx-auto" />
				</div>
			</section>
		)
	}

	return (
		<section className="flex flex-row w-full h-full max-h-screen overflow-hidden">
			<AsideBarProvider>
				<AsideBar />
			</AsideBarProvider>

			{/*chat rendering - first case is when you're already in a group */}
			{workGroup != null ? (
				<main className="flex flex-col h-full w-full bg-darkFG relative">
					<Header />

					<Body />

					{activeChan && (
						<footer className="shrink-0 flex flex-row py-2 px-4 items-center w-[calc(100%-40px)] mx-auto mb-2">
							<FooterChat />
						</footer>
					)}
				</main>
			) : (
				<MainMenuNoGroup />
			)}
		</section>
	)
}
