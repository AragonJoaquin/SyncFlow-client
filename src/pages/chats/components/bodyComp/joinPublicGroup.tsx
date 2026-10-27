import { useAxios } from '@/api'
import { SFButton, SFGroupCard, SFSkeleton } from '@/components'
import { DumbInput } from '@/components/input'
import { SVGChevronArrow } from '@/components/svgs'
import { useWorkGroupStore, useToastStore } from '@/store'
import type { FullWorkGroup, WorkGroup } from '@/types'
import { debouncer } from '@/utils'
import { ScrollArea } from 'radix-ui'
import { useCallback, useEffect, useRef, useState } from 'react'
import { useShallow } from 'zustand/shallow'

const PAGESIZE_FORM = 5 as const
const MIN_INPUT_LENGTH = 3 as const

export function FormPublicGroup() {
	const [fieldInput, setFieldInput] = useState<string>('')
	const [pageNumber, setPageNumber] = useState<number>(0)
	const [isPending, setIsPending] = useState<boolean>(false)

	const [groups, setGroups] = useState<WorkGroup[]>([])
	const [hasMore, setHasMore] = useState<boolean>(true)

	const inputRef = useRef<HTMLInputElement>({} as HTMLInputElement)

	const debouncedSetInput = useRef<ReturnType<typeof debouncer> | null>(null)

	// lazily initialize
	if (!debouncedSetInput.current) {
		debouncedSetInput.current = debouncer((value: string) => {
			setFieldInput(value)
		}, 300) as ReturnType<typeof debouncer>
	}

	const addWorkGroup = useWorkGroupStore((s) => s.addWorkGroup)

	const { get, post } = useAxios()
	const addSuccessToast = useToastStore(useShallow((s) => s.addSuccessToast))

	const getMoreResults = useCallback(() => {
		if (hasMore && !isPending) {
			setPageNumber((prev) => prev + 1)
		}
	}, [hasMore, isPending])

	const joinGroup = useCallback(
		async (groupId: number) => {
			const { data: response } = await post<FullWorkGroup>(`/work_group/${groupId}`)
			if (response.error) return

			addWorkGroup(response.data)
			addSuccessToast('Successfully joined the group!')
		},
		[addWorkGroup, post, addSuccessToast]
	)

	useEffect(() => {
		if (!inputRef.current || fieldInput.length < MIN_INPUT_LENGTH) return
		setIsPending(true)
		setGroups([])
		setPageNumber(0)
		setHasMore(true)

		get<WorkGroup[]>('/work_group/all', {
			axios_conf: {
				params: {
					pageNumber: 0,
					pageSize: PAGESIZE_FORM,
					name: fieldInput
				}
			}
		})
			.then(({ data: req }) => {
				if (req.error || !req?.data) return
				setGroups(req.data)
				setHasMore(req.data.length === PAGESIZE_FORM)
			})
			.finally(() => setIsPending(false))
	}, [fieldInput, get])

	useEffect(() => {
		if (pageNumber === 0) return
		if (!inputRef.current || fieldInput.length < MIN_INPUT_LENGTH) return
		setIsPending(true)

		get<WorkGroup[]>('/work_group/all', {
			axios_conf: {
				params: {
					pageNumber: pageNumber,
					pageSize: PAGESIZE_FORM,
					name: fieldInput
				}
			}
		})
			.then(({ data: req }) => {
				if (req.error) return
				setGroups((prev) => [...prev, ...req.data])
				//setHasMore(req.data.length === PAGESIZE_FORM)
			})
			.finally(() => setIsPending(false))
	}, [pageNumber, fieldInput, get])

	return (
		<form className="w-full h-full flex flex-col gap-3 relative" onSubmit={(e) => e.preventDefault()}>
			<fieldset className="relative shrink-0">
				<DumbInput
					ref={inputRef}
					type="text"
					className="w-full! py-2!"
					styling="ghost"
					placeholder="Search by group name (at least 3 characters)"
					opts={{
						onChange: (e) => debouncedSetInput.current?.(e.currentTarget.value ?? '')
					}}
				/>
				<SVGChevronArrow className="absolute top-0 right-2 translate-y-1.5" />
			</fieldset>
			<div className="relative flex-1 min-h-[225px] w-full">
				<ScrollArea.Root className="size-full absolute inset-0 flex flex-col overflow-hidden">
					<ScrollArea.Viewport className="size-full rounded pr-2">
						{isPending && groups.length === 0 && (
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
						)}

						{groups.length > 0 && (
							<div className="size-full flex flex-col gap-2 shadow-[0_2px_10px] shadow-neutral-800 bg-darkBG/70 rounded-lg p-2">
								{groups.map((group) => (
									<SFGroupCard key={group.id} group={group} onJoin={joinGroup} />
								))}
								{hasMore && (
									<SFButton styling="primary" onClick={getMoreResults} className="mt-2 w-full" disabled={isPending}>
										{isPending ? 'Loading more...' : 'Load More'}
									</SFButton>
								)}
								{isPending && groups.length > 0 && (
									<div className="flex items-center justify-center py-2 text-xs text-neutral-400 font-Cabin animate-pulse">
										Loading more groups...
									</div>
								)}
							</div>
						)}

						{!isPending && groups.length === 0 && fieldInput.length >= MIN_INPUT_LENGTH && (
							<div className="size-full flex items-center justify-center p-6 text-neutral-400 font-Cabin text-sm bg-darkBG/50 rounded-lg border border-neutral-800">
								No public groups found matching "{fieldInput}"
							</div>
						)}

						{!isPending && groups.length === 0 && fieldInput.length > 0 && fieldInput.length < MIN_INPUT_LENGTH && (
							<div className="size-full flex items-center justify-center p-6 text-neutral-500 font-Cabin text-sm bg-darkBG/50 rounded-lg border border-neutral-800">
								Please enter at least {MIN_INPUT_LENGTH} characters to search...
							</div>
						)}

						{!isPending && groups.length === 0 && fieldInput.length === 0 && (
							<div className="size-full flex items-center justify-center p-6 text-neutral-500 font-Cabin text-sm bg-darkBG/50 rounded-lg border border-neutral-800">
								Type a group name above to browse public groups.
							</div>
						)}
					</ScrollArea.Viewport>

					<ScrollArea.Scrollbar
						className="flex touch-none select-none bg-zinc-700/70 p-0.5 transition-colors duration-160 ease-out hover:bg-zinc-700/30 w-2.5"
						orientation="vertical"
					>
						<ScrollArea.Thumb className="relative flex-1 rounded-[10px] bg-zinc-500 before:absolute before:left-1/2 before:top-1/2 before:size-full before:min-h-11 before:min-w-11 before:-translate-x-1/2 before:-translate-y-1/2" />
					</ScrollArea.Scrollbar>
					<ScrollArea.Corner />
				</ScrollArea.Root>
			</div>
		</form>
	)
}
