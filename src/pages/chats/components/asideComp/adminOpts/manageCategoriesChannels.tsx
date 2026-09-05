import { SVGChevronArrow, SVGEdit, SVGTrash } from '@/components/svgs'
import { useWorkGroupStore } from '@/store'
import { DropdownMenu } from 'radix-ui'
import { useMemo } from 'react'
import { useShallow } from 'zustand/shallow'
import { CategoryChannels } from './categoryChannels'
import { DeleteCategoryModal } from './delete'
import { DropdownMenuSeparator } from './dropdownSeparator'
import { EditCategoryModal } from './edit'

export function ManageCategoriesChannels() {
	const cat = useWorkGroupStore(useShallow((s) => s.categories))

	const categoriesSaved = useMemo(() => [...(cat.size > 0 ? cat : [])], [cat])

	if (categoriesSaved.length === 0) return <p className="text-xs text-neutral-500 px-3 py-2">No categories yet</p>

	return (
		<article className="flex flex-col gap-1">
			<p className="text-xs font-semibold text-neutral-500 px-3 py-1 uppercase tracking-wide">Manage</p>
			{categoriesSaved.map(([id, category]) => (
				<DropdownMenu.Sub key={id}>
					<DropdownMenu.SubTrigger className="outline-none cursor-pointer flex items-center gap-2 px-3 py-2 hover:bg-neutral-800 rounded-md text-sm text-whiteText transition-colors">
						<span className="truncate flex-1">{category.name}</span>
						<SVGChevronArrow className="rotate-270 text-neutral-400 w-auto h-4" />
					</DropdownMenu.SubTrigger>
					<DropdownMenu.Portal>
						<DropdownMenu.SubContent
							className="min-w-[180px] bg-darkFG rounded-xl p-2 border border-zinc-700 shadow-xl animate-in fade-in zoom-in duration-200"
							sideOffset={8}
						>
							<DropdownMenu.Item className="outline-none cursor-pointer">
								<EditCategoryModal
									category={category}
									trigger={
										<span className="flex items-center gap-2 px-3 py-2 w-full hover:bg-neutral-800 rounded-md text-sm text-whiteText transition-colors">
											<SVGEdit className="w-4 h-4 text-neutral-400" />
											Edit Category
										</span>
									}
								/>
							</DropdownMenu.Item>

							<DropdownMenu.Item className="outline-none cursor-pointer">
								<DeleteCategoryModal
									category={category}
									trigger={
										<span className="flex items-center gap-2 px-3 py-2 w-full hover:bg-neutral-800 rounded-md text-sm text-red-400 transition-colors">
											<SVGTrash className="w-4 h-4" />
											Delete Category
										</span>
									}
								/>
							</DropdownMenu.Item>

							<DropdownMenuSeparator />

							<CategoryChannels categoryId={category.id} />
						</DropdownMenu.SubContent>
					</DropdownMenu.Portal>
				</DropdownMenu.Sub>
			))}
		</article>
	)
}
