import { useAxios } from '@/api'
import { useToastStore, useWorkGroupStore } from '@/store'
import type { FullWorkGroup, WorkGroup } from '@/types'
import { useCallback, useEffect, useState } from 'react'
import { useShallow } from 'zustand/shallow'

const PAGESIZE_FORM = 5 as const
export const MIN_INPUT_LENGTH = 3 as const

export function usePublicGroupSearch() {
	const [fieldInput, setFieldInput] = useState<string>('')
	const [pageNumber, setPageNumber] = useState<number>(0)
	const [isPending, setIsPending] = useState<boolean>(false)

	const [groups, setGroups] = useState<WorkGroup[]>([])
	const [hasMore, setHasMore] = useState<boolean>(true)

	const addWorkGroup = useWorkGroupStore((s) => s.addWorkGroup)
	const addSuccessToast = useToastStore(useShallow((s) => s.addSuccessToast))

	const { get, post } = useAxios()

	const fetchGroups = useCallback(
		async (name: string, page: number) => {
			const { data } = await get<WorkGroup[]>('/work_group/all', {
				axios_conf: {
					params: {
						pageNumber: page,
						pageSize: PAGESIZE_FORM,
						name
					}
				}
			})

			return data
		},
		[get]
	)

	const getMoreResults = useCallback(() => {
		if (!hasMore || isPending) return
		setPageNumber((prev) => prev + 1)
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
		if (fieldInput.length < MIN_INPUT_LENGTH) return

		setIsPending(true)
		setGroups([])
		setPageNumber(0)
		setHasMore(true)

		fetchGroups(fieldInput, 0)
			.then((req) => {
				if (req.error || !req?.data) return
				setGroups(req.data)
				setHasMore(req.data.length === PAGESIZE_FORM)
			})
			.finally(() => setIsPending(false))
	}, [fieldInput, fetchGroups])

	useEffect(() => {
		if (pageNumber === 0) return
		if (fieldInput.length < MIN_INPUT_LENGTH) return

		setIsPending(true)

		fetchGroups(fieldInput, pageNumber)
			.then((req) => {
				if (req.error) return
				setGroups((prev) => [...prev, ...req.data])
			})
			.finally(() => setIsPending(false))
	}, [pageNumber, fieldInput, fetchGroups])

	return {
		fieldInput,
		setFieldInput,
		groups,
		hasMore,
		isPending,
		getMoreResults,
		joinGroup
	}
}
