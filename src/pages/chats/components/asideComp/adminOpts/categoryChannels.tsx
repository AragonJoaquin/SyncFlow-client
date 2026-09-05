import { SVGEdit, SVGTrash } from '@/components/svgs'
import { useWorkGroupStore } from '@/store'
import { DropdownMenu } from 'radix-ui'
import { useShallow } from 'zustand/shallow'
import { DeleteChannelModal } from './delete'
import { EditChannelModal } from './edit'

export function CategoryChannels({ categoryId }: { categoryId: number }) {
	const getCategory = useWorkGroupStore(useShallow((s) => s.getCategory))

	const category = getCategory(categoryId)
	const channels = category?.channel ?? []

	if (channels.length === 0) return <p className="text-xs text-neutral-500 px-3 py-2">No channels</p>

	return (
		<div className="flex flex-col gap-1">
			<p className="text-xs font-semibold text-neutral-600 px-3 py-1">Channels</p>
			{channels.map((channel) => (
				<DropdownMenu.Sub key={channel.id}>
					<DropdownMenu.SubTrigger className="outline-none cursor-pointer flex items-center gap-2 px-3 py-2 hover:bg-neutral-800 rounded-md text-sm text-neutral-300 transition-colors">
						<span className="truncate flex-1"># {channel.name}</span>
					</DropdownMenu.SubTrigger>
					<DropdownMenu.Portal>
						<DropdownMenu.SubContent
							className="min-w-[180px] bg-darkFG rounded-xl p-2 border border-zinc-700 shadow-xl animate-in fade-in zoom-in duration-200"
							sideOffset={8}
						>
							<DropdownMenu.Item className="outline-none cursor-pointer">
								<EditChannelModal
									channel={channel}
									trigger={
										<span className="flex items-center gap-2 px-3 py-2 w-full hover:bg-neutral-800 rounded-md text-sm text-whiteText transition-colors">
											<SVGEdit className="w-4 h-4 text-neutral-400" />
											Edit Channel
										</span>
									}
								/>
							</DropdownMenu.Item>

							<DropdownMenu.Item className="outline-none cursor-pointer">
								<DeleteChannelModal
									channel={channel}
									trigger={
										<span className="flex items-center gap-2 px-3 py-2 w-full hover:bg-neutral-800 rounded-md text-sm text-red-400 transition-colors">
											<SVGTrash className="w-4 h-4" />
											Delete Channel
										</span>
									}
								/>
							</DropdownMenu.Item>
						</DropdownMenu.SubContent>
					</DropdownMenu.Portal>
				</DropdownMenu.Sub>
			))}
		</div>
	)
}
