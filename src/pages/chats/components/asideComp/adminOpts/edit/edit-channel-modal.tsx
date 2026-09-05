import { WS_ACTIONS } from '@/api'
import { SFButton, SFDialog } from '@/components'
import { TextInput } from '@/components/input'
import { useChatContext } from '@/context'
import type { Channel } from '@/types'
import { zodResolver } from '@hookform/resolvers/zod'
import { Form } from 'radix-ui'
import { FormProvider, useForm } from 'react-hook-form'
import z from 'zod'

const FIELD_NAMES = {
	NAME: 'channel_name'
} as const

const zodSchema = z.object({
	[FIELD_NAMES.NAME]: z.string().min(3, 'At least 3 characters').max(16, 'Maximum 16 characters')
})

type ChannelFormData = z.infer<typeof zodSchema>

interface EditChannelModalProps {
	trigger: React.ReactNode
	channel: Channel
}

export function EditChannelModal({ trigger, channel }: EditChannelModalProps) {
	const { handleSubmit, ...methods } = useForm<ChannelFormData>({
		resolver: zodResolver(zodSchema),
		mode: 'onChange',
		defaultValues: {
			[FIELD_NAMES.NAME]: channel.name
		}
	})

	const { websocket } = useChatContext()

	const onSubmit = (data: ChannelFormData) => {
		if (!websocket?.CHAT_SOCKET) return
		websocket.CHAT_SOCKET.sendPayload(WS_ACTIONS.WS_UPDATE_CHANNEL, {
			channel_id: channel.id,
			payload: {
				channel_name: data[FIELD_NAMES.NAME]
			}
		})
	}

	return (
		<SFDialog trigger={trigger} title="Edit Channel" description="Update channel name">
			<FormProvider {...{ handleSubmit, ...methods }}>
				<Form.Root onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
					<TextInput
						inputName={FIELD_NAMES.NAME}
						placeholder="e.g. general, announcements"
						label="Channel Name"
						type="text"
					/>

					<SFButton type="submit" styling="primary">
						Save Changes
					</SFButton>
				</Form.Root>
			</FormProvider>
		</SFDialog>
	)
}

