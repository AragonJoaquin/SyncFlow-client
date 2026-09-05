import { useAxios } from '@/api'
import { ErrorServer } from '@/api/axios_helper'
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

	const debouncedSetInput = useRef(
		debouncer((value: string) => {
			setFieldInput(value)
		}, 300)
	).current

	const addWorkGroup = useWorkGroupStore((s) => s.addWorkGroup)

	const { get, post } = useAxios()
	const addSuccessToast = useToastStore(useShallow((s) => s.addSuccessToast))
	const addErrorToast = useToastStore(useShallow((s) => s.addErrorToast))

	const getMoreResults = useCallback(() => {
		if (hasMore && !isPending) {
			setPageNumber((prev) => prev + 1)
		}
	}, [hasMore, isPending])

	const joinGroup = useCallback(async (groupId: number) => {
		try {
			const { data: response } = await post<FullWorkGroup>(`/work_group/${groupId}`)
			addWorkGroup(response.data)
			addSuccessToast('Successfully joined the group!')
		} catch (e) {
			e instanceof ErrorServer ? addErrorToast(e) : addErrorToast()
		}
	}, [addWorkGroup, post, addSuccessToast, addErrorToast])

	useEffect(() => {
		if (!inputRef.current || fieldInput.length < MIN_INPUT_LENGTH) return
		setIsPending(true)
		setGroups([])
		setPageNumber(0)
		setHasMore(true)

		get<WorkGroup[]>('/work_group/all', {
			params: {
				pageNumber: 0,
				pageSize: PAGESIZE_FORM,
				name: fieldInput
			}
		})
			.then((req) => {
				if (req?.data?.data) {
					setGroups(req.data.data)
					setHasMore(req.data.data.length === PAGESIZE_FORM)
				}
			})
			.catch()
			.finally(() => setIsPending(false))
	}, [fieldInput, get])

	useEffect(() => {
		if (pageNumber === 0) return
		if (!inputRef.current || fieldInput.length < MIN_INPUT_LENGTH) return
		setIsPending(true)

		get<WorkGroup[]>('/work_group/all', {
			params: {
				pageNumber: pageNumber,
				pageSize: PAGESIZE_FORM,
				name: fieldInput
			}
		})
			.then((req) => {
				if (req?.data?.data) {
					setGroups((prev) => [...prev, ...req.data.data])
					setHasMore(req.data.data.length === PAGESIZE_FORM)
				}
			})
			.catch((e) => (e instanceof ErrorServer ? addErrorToast(e) : addErrorToast()))
			.finally(() => setIsPending(false))
	}, [pageNumber, fieldInput, get, addErrorToast])

	return (
		<form className="w-full h-full justify-center relative" onSubmit={(e) => e.preventDefault()}>
			<fieldset className="relative">
				<DumbInput
					ref={inputRef}
					type="text"
					className="w-full! py-2!"
					styling="ghost"
					placeholder="Search by group name"
					opts={{
						onChange: (e) => {
							debouncedSetInput(e.currentTarget.value ?? '')
						}
					}}
				/>
				<SVGChevronArrow className="absolute top-0 right-2 translate-y-1.5" />
			</fieldset>
			<ScrollArea.Root className="h-[225px] w-full absolute inset-0 flex flex-col gap-10 overflow-hidden">
				<ScrollArea.Viewport className="size-full rounded pr-2">
					{isPending && groups.length === 0 && (
						<span className="size-full flex flex-col gap-2 shadow-[0_2px_10px] shadow-neutral-800 bg-darkBG/70 rounded-lg p-2">
							{new Array(5).fill(null).map((_, idx) => (
								<SFSkeleton key={`skeleton-${idx}`} className="w-full h-[50px]" height={50} />
							))}
						</span>
					)}

					{groups.length > 0 && (
						<span className="size-full flex flex-col gap-2 shadow-[0_2px_10px] shadow-neutral-800 bg-darkBG/70 rounded-lg p-2">
							{groups.map((group) => (
								<SFGroupCard key={group.id} group={group} onJoin={joinGroup} />
							))}
							{hasMore && (
								<SFButton styling="primary" onClick={getMoreResults} className="mt-2" disabled={isPending}>
									{isPending ? 'Loading...' : 'Load More'}
								</SFButton>
							)}
						</span>
					)}

					{!isPending && groups.length === 0 && fieldInput.length > 3 && (
						<span className="size-full flex items-center justify-center text-neutral-500 font-Cabin text-sm">
							No groups found
						</span>
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
		</form>
	)
}
