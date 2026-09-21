import { SFButton } from '@/components'
import { SVGCirclePlus } from '@/components/svgs'
import { useCacheUsersStore, useOwnUserStore } from '@/store'
import { DropdownMenu } from 'radix-ui'
import { useShallow } from 'zustand/shallow'
import { ROLE_TYPES_ENUM } from '../constants'
import { ADMIN_MODALS_OPEN, useAdminOptsContext } from './adminOpts/context'
import { CreateCategoryModal, CreateChannelModal } from './adminOpts/create'
import { DropdownMenuSeparator } from './adminOpts/dropdownSeparator'
import { ManageCategoriesChannels } from './adminOpts/manageCategoriesChannels'

export function AdminOptions() {
	const userId = useOwnUserStore(useShallow((e) => e.user))

	const getUser = useCacheUsersStore(useShallow((s) => s.getUser))
	const user = getUser(userId?.id)

	const { SetActiveModal } = useAdminOptsContext()

	if (user === undefined) return

	const {
		membership: {
			group_role: { name }
		}
	} = user

	const ROLE = ROLE_TYPES_ENUM[name.toUpperCase() as keyof typeof ROLE_TYPES_ENUM] ?? ROLE_TYPES_ENUM.MEMBER

	if (ROLE === ROLE_TYPES_ENUM.MEMBER) return
	return (
		<section className="px-2 py-1">
			<DropdownMenu.Root>
				<DropdownMenu.Trigger asChild>
					<SFButton
						styling="terciary"
						type="button"
						className="flex flex-row items-center gap-2 w-full justify-between px-3 py-2 hover:bg-neutral-800/50 rounded-md transition-colors"
					>
						<span className="text-sm font-semibold text-neutral-300">Admin Tools</span>
						<SVGCirclePlus className="w-4 h-4 text-neutral-400" />
					</SFButton>
				</DropdownMenu.Trigger>

				<DropdownMenu.Portal>
					<DropdownMenu.Content
						className="min-w-[220px] bg-darkFG rounded-xl p-2 border border-zinc-700 shadow-xl animate-in fade-in zoom-in duration-200"
						sideOffset={5}
					>
						<DropdownMenu.Item
							className="outline-none cursor-pointer"
							onSelect={(e) => {
								e.preventDefault()
								SetActiveModal(ADMIN_MODALS_OPEN.CREATE_CATEGORY)
							}}
						>
							<span className="flex items-center gap-2 px-3 py-2 w-full hover:bg-neutral-800 rounded-md text-sm text-whiteText transition-colors">
								<SVGCirclePlus className="w-4 h-4 text-neutral-400" />
								Create Category
							</span>
						</DropdownMenu.Item>

						<DropdownMenu.Item
							className="outline-none cursor-pointer"
							onSelect={(e) => {
								e.preventDefault()
								SetActiveModal(ADMIN_MODALS_OPEN.CREATE_CHANNEL)
							}}
						>
							<span className="flex items-center gap-2 px-3 py-2 w-full hover:bg-neutral-800 rounded-md text-sm text-whiteText transition-colors">
								<SVGCirclePlus className="w-4 h-4 text-neutral-400" />
								Create Channel
							</span>
						</DropdownMenu.Item>

						<DropdownMenuSeparator />

						<ManageCategoriesChannels />
					</DropdownMenu.Content>
				</DropdownMenu.Portal>
			</DropdownMenu.Root>

			<CreateCategoryModal />
			<CreateChannelModal />
		</section>
	)
}
