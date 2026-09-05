import { WS_ACTIONS } from '@/api'
import { SFButton, SFDialog } from '@/components'
import { useChatContext } from '@/context'
import type { Channel } from '@/types'

interface DeleteChannelModalProps {
	trigger: React.ReactNode
	channel: Channel
}

export function DeleteChannelModal({ trigger, channel }: DeleteChannelModalProps) {
	const { websocket } = useChatContext()

	const handleDelete = () => {
		if (!websocket?.CHAT_SOCKET) return
		websocket.CHAT_SOCKET.sendPayload(WS_ACTIONS.WS_DELETE_CHANNEL, {
			channel_id: channel.id
		})
	}

	return (
		<SFDialog
			trigger={trigger}
			title="Delete Channel"
			description={`Are you sure you want to delete "#${channel.name}"? This action cannot be undone.`}
		>
			<SFButton type="button" onClick={handleDelete} styling="primary">
				Delete
			</SFButton>
		</SFDialog>
	)
}
