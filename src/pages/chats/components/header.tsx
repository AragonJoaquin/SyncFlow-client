import { SVGChevronArrow } from '@/components/svgs'
import { useWorkGroupStore } from '@/store'
import '@/styles/chat_page.css'
import { useShallow } from 'zustand/shallow'
import { HeaderChatInfo } from './headerComp'

export function Header() {
	const { workGroup, getChannel, getCategory, actId } = useWorkGroupStore(
		useShallow((s) => ({
			workGroup: s.workGroup,
			getCategory: s.getCategory,
			actId: s.activeChannel,
			getChannel: s.getChannel
		}))
	)

	const currentChannel = getChannel(actId)
	const currentCategory = getCategory(currentChannel?.category_id)

	return (
		<>
			<header className="w-full bg-neutral-800/70 h-14 min-h-14 flex flex-col py-2 border-b-2 border-b-neutral-700 lg:justify-evenly">
				<span className="flex w-full flex-row gap-5 items-center justify-center px-4 relative">
					<HeaderChatInfo />
				</span>

				{workGroup != null && (
					<ul className="-chatPage_Index flex flex-row gap-4 px-2 items-center text-unfocused relative pl-5 lg:hidden! border-t-2 border-t-neutral-700/50 mt-2 py-1 text-base w-full bg-neutral-900/60 z-30">
						<SVGChevronArrow className="rotate-270 w-4 absolute left-0 top-0 text-white h-full" />

						{/*need to be the same height so the "/" can be at the same height*/}
						<li className="py-0.5">{workGroup.name}</li>

						{currentCategory && <li className="py1.5">{currentCategory.name}</li>}
						{currentChannel && (
							<li className="bg-dark1 px-2 py-0.5 rounded-md text-whiteText max-h-[95px]">{currentChannel.name}</li>
						)}
					</ul>
				)}
			</header>
		</>
	)
}
