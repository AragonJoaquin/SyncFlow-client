import { WS_ACTIONS } from '@/api'
import { SFButton, SFCustomDialog } from '@/components'
import { SelectInputField, TextInput } from '@/components/input'
import { useChatContext } from '@/context'
import { useWorkGroupStore } from '@/store'
import { zodResolver } from '@hookform/resolvers/zod'
import { Form } from 'radix-ui'
import { useMemo } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import z from 'zod'
import { useShallow } from 'zustand/shallow'
import { ADMIN_MODALS_OPEN, useAdminOptsContext } from '../context'

const FIELD_NAMES = {
	NAME: 'channel_name',
	CATEGORY_ID: 'category_id'
} as const

const zodSchema = z.object({
	[FIELD_NAMES.NAME]: z.string().min(3, 'At least 3 characters').max(16, 'Maximum 16 characters'),
	[FIELD_NAMES.CATEGORY_ID]: z
		.string()
		.min(1, 'Please select a category')
		.transform((val) => Number(val))
})

type ChannelFormData = z.infer<typeof zodSchema>

export function CreateChannelModal() {
	const { handleSubmit, setError, ...methods } = useForm<ChannelFormData>({
		resolver: zodResolver(zodSchema) as any, // i dont care anymore
		mode: 'onChange'
	})

	const { ActiveModal, CloseActiveModal, SetActiveModal } = useAdminOptsContext()
	const { websocket } = useChatContext()
	const categories = useWorkGroupStore(useShallow((s) => s.categories))
	const getChannelByName = useWorkGroupStore(useShallow((s) => s.getChannelByName))

	const onSubmit = (data: ChannelFormData) => {
		if (!websocket?.CHAT_SOCKET) return

		if (getChannelByName(data[FIELD_NAMES.NAME]) != undefined)
			return setError(FIELD_NAMES.NAME, { message: 'Channel already exists' })

		CloseActiveModal()
		websocket.CHAT_SOCKET.sendPayload(WS_ACTIONS.WS_CREATE_CHANNEL, {
			channel_name: data[FIELD_NAMES.NAME],
			category_id: data[FIELD_NAMES.CATEGORY_ID]
		})
	}

	const valuesSelect: Record<string, string> = useMemo(() => {
		const vals = [...categories].map(([id, { name }]) => [`${id}`, name])
		return Object.fromEntries(vals)
	}, [categories])

	return (
		<SFCustomDialog
			open={ActiveModal === ADMIN_MODALS_OPEN.CREATE_CHANNEL}
			onClose={CloseActiveModal}
			onTrigger={() => SetActiveModal(ADMIN_MODALS_OPEN.CREATE_CHANNEL)}
			title="Create Channel"
			description="Channels are where conversations happen"
		>
			<FormProvider {...{ handleSubmit, setError, ...methods }}>
				<Form.Root onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
					<TextInput
						type="text"
						label="Channel Name"
						inputName={FIELD_NAMES.NAME}
						placeholder="e.g. general, announcements, voice"
					/>

					<span className="flex flex-col">
						<label className="block text-xs sm:text-sm font-semibold font-Cabin text-foreground mb-1.5">Category</label>

						<SelectInputField
							inputName={FIELD_NAMES.CATEGORY_ID}
							values={valuesSelect}
							defaultVal={valuesSelect[0] ?? ''}
						/>
					</span>

					<Form.Submit asChild>
						<SFButton type="submit" styling="primary">
							Create Channel
						</SFButton>
					</Form.Submit>
				</Form.Root>
			</FormProvider>
		</SFCustomDialog>
	)
}
