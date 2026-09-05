import { SFButton } from '@/components'
import { DumbInput } from '@/components/input'
import { SVGChevronArrow, SVGHash, SVGNoChats, SVGSearch } from '@/components/svgs'
import { useWorkGroupStore } from '@/store'
import type { Category, CategoryWithChannels, Channel } from '@/types'
import { useMemo, useState } from 'react'
import { useShallow } from 'zustand/shallow'
import { AdminOptions } from './adminOptions'
import { AdminOptsProvider } from './adminOpts/context'

const FALLBACK_NAME = 'No name' as const

export function AsideChatBar() {
	const { categories, changeActiveChannel, activeChannel } = useWorkGroupStore(
		useShallow((s) => ({
			categories: s.categories,
			changeActiveChannel: s.changeActiveChannel,
			activeChannel: s.activeChannel
		}))
	)

	const [collapsedCategories, setCollapsedCategories] = useState<Set<Category['id']>>(new Set())
	const [searchQuery, setSearchQuery] = useState('')
	const [unreadChannels, setUnreadChannels] = useState<Set<Channel['id']>>(new Set())

	//	const { toggleIsMobileOpen } = useAsideBarContext()

	const filteredCategories = useMemo(() => {
		if (!searchQuery.trim()) return [...categories]
		const query = searchQuery.toLowerCase()
		return [...categories]
			.filter(([, category]) => {
				return category.channel?.some((ch) => ch.name?.toLowerCase().includes(query))
			})
			.map(([catId, category]): [Category['id'], CategoryWithChannels] => {
				const filteredChannels = category.channel?.filter((ch) => ch.name?.toLowerCase().includes(query))
				return [catId, { ...category, channel: filteredChannels }]
			})
	}, [categories, searchQuery])

	//NOTE: for the section translate, do gap/2
	return (
		<section
			className={`
        flex flex-col h-full gap-4 *:relative *:after:translate-y-[8px]
        *:after:h-0.5 *:after:w-full *:after:content-[""] *:after:bg-neutral-700 *:after:absolute *:after:bottom-0 *:after:right-0
        *:last:after:h-0
        `}
		>
			<AdminOptsProvider>
				<AdminOptions />
			</AdminOptsProvider>

			<section className="px-2 py-1">
				<span className="flex items-center gap-2 bg-neutral-800 rounded-md px-2 py-1.5 border border-neutral-700">
					<SVGSearch className="w-4 h-4 text-neutral-400 shrink-0" />
					<DumbInput
						type="text"
						placeholder="Filter channels..."
						className="bg-transparent py-0.5 text-sm text-whiteText placeholder:text-neutral-500 outline-none w-full truncate"
						opts={{
							value: searchQuery,
							onChange: (e) => setSearchQuery(e.currentTarget?.value)
						}}
					/>
					{searchQuery && (
						<SFButton
							styling="none"
							type="button"
							className="w-fit! h-fit! p-0!  text-neutral-400 hover:text-whiteText transition-colors"
							onClick={() => setSearchQuery('')}
						>
							×
						</SFButton>
					)}
				</span>
			</section>

			{categories.size > 0 ? (
				<article className="overflow-y-auto h-full">
					{filteredCategories.length > 0 ? (
						<ul className="flex flex-col gap-5 grow mx-2">
							{filteredCategories.map(([catId, category]) => {
								const isExpanded = searchQuery.trim() ? true : !collapsedCategories.has(catId)
								return (
									<li key={catId} className="flex flex-col gap-2">
										<SFButton
											styling="terciary"
											className="flex flex-row gap-2 items-center cursor-pointer hover:text-neutral-300 transition-colors bg-transparent border-none p-0"
											onClick={() => {
												setCollapsedCategories((prev) => {
													const next = new Set(prev)
													if (next.has(catId)) next.delete(catId)
													else next.add(catId)

													return next
												})
											}}
											type="button"
										>
											<SVGChevronArrow
												className={`w-3 h-3 shrink-0 transition-transform duration-150 ${collapsedCategories.has(catId) ? '-rotate-90' : 'rotate-0'}`}
											/>
											<h5
												className="text-xs font-semibold uppercase text-neutral-400 tracking-wide truncate"
												title={category.name ?? FALLBACK_NAME}
											>
												{category.name ?? FALLBACK_NAME}
											</h5>
										</SFButton>

										{isExpanded && (
											<ul className="flex flex-col gap-0.5 mx-2">
												{category?.channel?.map((channel) => {
													const isUnread = unreadChannels.has(channel.id)
													return (
														<SFButton
															styling="none"
															className={`flex flex-row items-center py-1.5 rounded-md gap-1.5 cursor-pointer transition-colors duration-100 w-full text-left bg-transparent ${activeChannel === channel.id ? 'bg-neutral-700/50! text-whiteText' : 'text-whiteText/70 hover:bg-neutral-700/50 hover:text-whiteText'}`}
															key={channel.id}
															onClick={() => {
																if (activeChannel === channel.id) return changeActiveChannel(null)
																setUnreadChannels((prev) => {
																	const next = new Set(prev)
																	next.delete(channel?.id)

																	return next
																})
																changeActiveChannel(channel.id)
															}}
															title={channel.name ?? FALLBACK_NAME}
															type="button"
														>
															<SVGHash
																className={`w-4 h-4 shrink-0 transition-colors duration-100 ${activeChannel === channel.id ? 'text-primaryText' : 'text-neutral-500 hover:text-neutral-300'}`}
															/>
															<p className={`text-sm truncate min-w-0 ${isUnread ? 'font-semibold' : ''}`}>
																{channel.name ?? FALLBACK_NAME}
															</p>
															{isUnread && <span className="ml-auto w-2 h-2 rounded-full bg-primaryText shrink-0" />}
														</SFButton>
													)
												})}
											</ul>
										)}
									</li>
								)
							})}
						</ul>
					) : (
						<NoChatsAvailable />
					)}
				</article>
			) : (
				<NoChatsAvailable />
			)}
		</section>
	)
}

const NoChatsAvailable = () => {
	return (
		<figure className="flex grow items-center justify-center h-full px-4 flex-col gap-4">
			<SVGNoChats className="opacity-20 h-auto w-[80%]" />
			<p className="text-center opacity-40 font-semibold">No chats available...</p>
		</figure>
	)
}
