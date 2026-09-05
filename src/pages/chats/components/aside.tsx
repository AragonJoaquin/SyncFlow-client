import { SFButton } from '@/components'
import { SVGHamburger, SVGSleep } from '@/components/svgs'
import { useWorkGroupStore } from '@/store'
import { CLIENT_VER } from '@/utils'
import { AsideChatBar, ProfileBar } from './asideComp'
import { useAsideBarContext } from './context'

function SidebarContent() {
	const workGroup = useWorkGroupStore((s) => s.workGroup)

	return (
		<>
			<nav className="flex flex-row min-h-14 max-h-14 items-center justify-center gap-x-4 py-2 border-b-2 border-b-neutral-700 w-full">
				<span className="flex justify-center items-center relative max-h-14 w-full overflow-clip">
					<div className="w-40 h-full max-h-full aspect-video">
						<img src="/imgs/syncflow_logo.gif" alt="SyncFlow Logo" className="w-full h-full object-contain" />
					</div>
					<p className="text-unfocused/70 text-sm font-Cabin absolute right-2 bottom-2">v{CLIENT_VER}</p>
				</span>
			</nav>

			<section className="grow">
				{workGroup != null ? (
					<AsideChatBar />
				) : (
					<figure className="flex items-center justify-center h-full px-4 flex-col gap-4">
						<SVGSleep className="opacity-20 h-auto w-[80%]" />
						<p className="text-center opacity-40 font-semibold">You're not in a group... yet...</p>
					</figure>
				)}
			</section>

			<ProfileBar />
		</>
	)
}

export function AsideBar() {
	const { toggleIsMobileOpen, setIsMobileOpen, isMobileOpen } = useAsideBarContext()
	return (
		<>
			<SFButton
				styling="terciary"
				type="button"
				className="lg:hidden fixed top-2 left-3 z-30 p-2 rounded-md bg-darkBG border border-neutral-700"
				onClick={toggleIsMobileOpen}
			>
				<SVGHamburger className="w-6 h-6 text-whiteText" />
			</SFButton>

			<div
				//make the transition work lol
				className={`fixed ${!isMobileOpen ? 'hidden opacity-0' : 'opacity-100'} bg-black/50 h-full w-full transition-all duration-200 z-99`}
				onClick={() => setIsMobileOpen(false)}
			/>

			<div
				className={`
				fixed left-0 top-0 h-full w-[280px] bg-darkBG lg:hidden
				transition-transform duration-300 z-100
				${isMobileOpen ? 'translate-x-0' : '-translate-x-full'}
			`}
			>
				<aside className="flex flex-col h-full shadow-xl shadow-neutral-800 border-r-2 border-r-neutral-700 ">
					<SidebarContent />
				</aside>
			</div>

			<aside className="lg:flex hidden min-w-[250px] max-w-[250px] bg-darkBG border-r-2 border-r-neutral-700 flex-col gap-4 h-full">
				<SidebarContent />
			</aside>
		</>
	)
}
