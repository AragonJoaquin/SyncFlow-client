import { useAxios } from '@/api'
import { useChatContext } from '@/context'
import { useWorkGroupStore } from '@/store'
import type { FullWorkGroup } from '@/types'
import { useEffect } from 'react'
import { useShallow } from 'zustand/shallow'
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

	useEffect(() => {
		get<FullWorkGroup>('/chats_info')
			.then(({ data }) => {
				if (!data) return
				addWorkGroup(data?.data)
			})
			.catch(() => {})
	}, [])

	useEffect(() => {
		if (!activeId) return
		const store = useWorkGroupStore.getState()
		if (!store.isChannelFetched(activeId)) loadMoreMessages(activeId)
	}, [activeId])

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
						<footer className="shrink-0 bg-darkBG flex flex-row py-2 px-4 border-2 border-neutral-700 items-center w-[calc(100%-40px)] mx-auto mb-2 rounded-xl">
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
