import { WS_ACTIONS } from '@/api'
import { SFButton, SFDialog } from '@/components'
import { useChatContext } from '@/context'
import type { Category } from '@/types'

interface DeleteCategoryModalProps {
	trigger: React.ReactNode
	category: Category
}

export function DeleteCategoryModal({ trigger, category }: DeleteCategoryModalProps) {
	const { websocket } = useChatContext()

	const handleDelete = () => {
		if (!websocket?.CHAT_SOCKET) return
		websocket.CHAT_SOCKET.sendPayload(WS_ACTIONS.WS_DELETE_CATEGORY, {
			category_id: category.id
		})
	}

	return (
		<SFDialog
			trigger={trigger}
			title="Delete Category"
			description={`Are you sure you want to delete "${category.name}"? This will also delete all channels within it.`}
		>
			<SFButton type="button" styling="primary" onClick={handleDelete}>
				Delete
			</SFButton>
		</SFDialog>
	)
}
