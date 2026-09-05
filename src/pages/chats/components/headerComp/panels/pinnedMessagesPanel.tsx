import { useAxios } from '@/api'
import { ErrorServer } from '@/api/axios_helper'
import { SFAvatarImage } from '@/components'
import { SVGPin } from '@/components/svgs'
import { SIDE_PANNELS_STATE } from '@/context/chatContext'
import { useToastStore, useWorkGroupStore } from '@/store'
import type { PinnedMessage } from '@/types'
import { FormatRelativeTime } from '@/utils'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useShallow } from 'zustand/shallow'
import { PannelWrapper } from './panelWrapper'

export function PinnedMessagesPanel() {
	const [search, setSearch] = useState('')
	const [pinnedMessages, setPinnedMessages] = useState<PinnedMessage[]>([])
	const [isLoading, setIsLoading] = useState(true)

	const { workGroup } = useWorkGroupStore(
		useShallow((s) => ({
			workGroup: s.workGroup
		}))
	)

	const { get: getMethod } = useAxios()
	const { addErrorToast } = useToastStore(
		useShallow((s) => ({
			addErrorToast: s.addErrorToast
		}))
	)

	useEffect(() => {
		if (!workGroup?.id) return

		setIsLoading(true)
		try {
			getMethod<PinnedMessage[]>(`/work_group/${workGroup.id}/pinned-messages`, undefined).then(({ data: res }) =>
				setPinnedMessages(res?.data ?? [])
			)
		} catch (e) {
			e instanceof ErrorServer ? addErrorToast(e) : addErrorToast()
		} finally {
			setIsLoading(false)
		}
	}, [workGroup?.id])

	const setSearchInputVal = useCallback((val: string) => setSearch(val), [])

	const filtered = useMemo(() => {
		if (!search.trim()) return pinnedMessages
		const q = search.toLowerCase()
		return pinnedMessages.filter(
			(m) =>
				m.content.toLowerCase().includes(q) ||
				m.sender_name.toLowerCase().includes(q) ||
				m.channel_name.toLowerCase().includes(q)
		)
	}, [search, pinnedMessages])

	return (
		<PannelWrapper
			panelType={SIDE_PANNELS_STATE.PINNED}
			panelName="Pinned Messages"
			elementsCount={filtered.length}
			SVGElement={SVGPin}
			setSearchInputValue={setSearchInputVal}
		>
			{isLoading ? (
				<div className="flex items-center justify-center py-12">
					<div className="animate-spin w-6 h-6 border-2 border-neutral-500 border-t-transparent rounded-full" />
				</div>
			) : !filtered.length ? (
				<div className="flex flex-col items-center justify-center py-12 text-center">
					<SVGPin className="w-12 h-12 text-neutral-600 mb-3" />
					<p className="text-unfocused font-OpenSans text-sm">
						{search.trim() ? 'No pinned messages match your search' : 'No pinned messages yet'}
					</p>
				</div>
			) : (
				<ul className="flex flex-col gap-2">
					{filtered.map((msg) => (
						<li key={msg.message_id}>
							<button
								type="button"
								className="w-full p-3 rounded-lg bg-neutral-800/50 border border-neutral-700/40 hover:bg-neutral-700/50 transition-colors cursor-pointer text-left"
							>
								<div className="flex items-start gap-2.5">
									<SFAvatarImage src={msg.sender_picture} username={msg.sender_name} size="small" />
									<div className="flex-1 min-w-0">
										<div className="flex items-center justify-between gap-2">
											<span className="text-sm font-semibold font-OpenSans text-whiteText truncate">
												{msg.sender_name}
											</span>
											<span className="text-xs text-neutral-500 shrink-0">
												{FormatRelativeTime(new Date(msg.pinned_at))}
											</span>
										</div>
										<p className="text-sm text-unfocused line-clamp-2 mt-0.5 font-Cabin">{msg.content}</p>
										<div className="flex items-center gap-1.5 mt-2">
											<span className="text-xs bg-neutral-700/60 text-neutral-400 px-1.5 py-0.5 rounded font-OpenSans">
												#{msg.channel_name}
											</span>
										</div>
									</div>
								</div>
							</button>
						</li>
					))}
				</ul>
			)}
		</PannelWrapper>
	)
}
