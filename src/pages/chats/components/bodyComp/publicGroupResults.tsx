import { SFButton, SFGroupCard, SFSkeleton } from '@/components'
import type { WorkGroup } from '@/types'
import { MIN_INPUT_LENGTH } from './usePublicGroupSearch'

const EMPTY_STATE_CLASS =
	'size-full flex items-center justify-center p-6 text-neutral-400 font-Cabin text-sm bg-darkBG/50 rounded-lg border border-neutral-800'

interface PublicGroupResultsProps {
	fieldInput: string
	groups: WorkGroup[]
	hasMore: boolean
	isPending: boolean
	onJoin: (groupId: number) => void
	onLoadMore: () => void
}

function PublicGroupSkeleton() {
	return (
		<div className="size-full flex flex-col gap-2.5 shadow-[0_2px_10px] shadow-neutral-800/50 bg-darkBG/80 backdrop-blur-sm rounded-lg p-3 animate-pulse">
			{new Array(3).fill(null).map((_, idx) => (
				<div key={`skeleton-${idx}`} className="flex items-center gap-3 p-2 bg-neutral-800/40 rounded-md">
					<SFSkeleton className="size-[40px] rounded-full shrink-0" height={40} />
					<div className="flex flex-col gap-1.5 flex-1">
						<SFSkeleton className="w-1/2 h-[16px]" height={16} />
						<SFSkeleton className="w-1/3 h-[12px]" height={12} />
					</div>
					<SFSkeleton className="w-[60px] h-[30px] rounded-md shrink-0" height={30} />
				</div>
			))}
		</div>
	)
}

function PublicGroupEmptyState({ message }: { message: string }) {
	return <div className={EMPTY_STATE_CLASS}>{message}</div>
}

interface PublicGroupListProps {
	groups: WorkGroup[]
	hasMore: boolean
	isPending: boolean
	onJoin: (groupId: number) => void
	onLoadMore: () => void
}

function PublicGroupList({ groups, hasMore, isPending, onJoin, onLoadMore }: PublicGroupListProps) {
	return (
		<div className="size-full flex flex-col gap-2 shadow-[0_2px_10px] shadow-neutral-800 bg-darkBG/70 rounded-lg p-2">
			{groups.map((group) => (
				<SFGroupCard key={group.id} group={group} onJoin={onJoin} />
			))}
			{hasMore && (
				<SFButton styling="primary" onClick={onLoadMore} className="mt-2 w-full" disabled={isPending}>
					{isPending ? 'Loading more...' : 'Load More'}
				</SFButton>
			)}
			{isPending && (
				<div className="flex items-center justify-center py-2 text-xs text-neutral-400 font-Cabin animate-pulse">
					Loading more groups...
				</div>
			)}
		</div>
	)
}

export function PublicGroupResults({
	fieldInput,
	groups,
	hasMore,
	isPending,
	onJoin,
	onLoadMore
}: PublicGroupResultsProps) {
	if (groups.length > 0) {
		return (
			<PublicGroupList
				groups={groups}
				hasMore={hasMore}
				isPending={isPending}
				onJoin={onJoin}
				onLoadMore={onLoadMore}
			/>
		)
	}

	if (isPending) return <PublicGroupSkeleton />

	if (fieldInput.length >= MIN_INPUT_LENGTH) {
		return <PublicGroupEmptyState message={`No public groups found matching "${fieldInput}"`} />
	}

	if (fieldInput.length > 0) {
		return <PublicGroupEmptyState message={`Please enter at least ${MIN_INPUT_LENGTH} characters to search...`} />
	}

	return <PublicGroupEmptyState message="Type a group name above to browse public groups." />
}
