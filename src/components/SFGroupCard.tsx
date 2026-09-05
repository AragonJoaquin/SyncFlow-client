import { SFButton } from '@/components'
import { SFImage } from '@/components/SFImage'
import type { WorkGroup } from '@/types'

interface GroupCardProps {
	group: WorkGroup
	onJoin: (groupId: number) => void
}

export function SFGroupCard({ group, onJoin }: GroupCardProps) {
	return (
		<span className="flex items-center gap-3 p-2 bg-neutral-800/50 rounded-md hover:bg-neutral-800 transition-colors">
			<SFImage imageUrl={group.group_pic} title={group.name} width={40} height={40} className="rounded-md" />

			<span className="flex flex-col flex-1 min-w-0">
				<span className="text-sm font-Cabin font-semibold text-foreground truncate" title={group.name}>
					{group.name.length > 20 ? `${group.name.slice(0, 20)}...` : group.name}
				</span>
				<span className="text-xs font-Cabin text-neutral-400 truncate" title={group.description ?? ''}>
					{group.description && group.description.length > 50
						? `${group.description.slice(0, 50)}...`
						: (group.description ?? 'No description')}
				</span>
			</span>

			<SFButton styling="primary" onClick={() => onJoin(group.id)} className="shrink-0">
				Join
			</SFButton>
		</span>
	)
}
