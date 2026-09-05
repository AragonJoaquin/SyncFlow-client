import { WS_ACTIONS } from '@/api'
import { SFButton, SFCustomDialog } from '@/components'
import { TextInput } from '@/components/input'
import { useChatContext } from '@/context'
import { useWorkGroupStore } from '@/store'
import { zodResolver } from '@hookform/resolvers/zod'
import { Form } from 'radix-ui'
import { FormProvider, useForm } from 'react-hook-form'
import z from 'zod'
import { useShallow } from 'zustand/shallow'
import { ADMIN_MODALS_OPEN, useAdminOptsContext } from '../context'

const FIELD_NAMES = {
	NAME: 'category_name',
	DESCRIPTION: 'category_description'
} as const

const zodSchema = z.object({
	[FIELD_NAMES.NAME]: z.string().min(3, 'At least 3 characters').max(16, 'Maximum 16 characters'),
	[FIELD_NAMES.DESCRIPTION]: z.string().max(100).optional()
})

type CategoryFormData = z.infer<typeof zodSchema>

export function CreateCategoryModal() {
	const { handleSubmit, setError, ...methods } = useForm<CategoryFormData>({
		resolver: zodResolver(zodSchema),
		mode: 'onChange',
		defaultValues: {
			[FIELD_NAMES.NAME]: '',
			[FIELD_NAMES.DESCRIPTION]: ''
		}
	})

	const { ActiveModal, CloseActiveModal, SetActiveModal } = useAdminOptsContext()

	const { websocket } = useChatContext()
	const workGroup = useWorkGroupStore(useShallow((s) => s.workGroup))
	const getCatByName = useWorkGroupStore(useShallow((s) => s.getCategoryByName))

	const onSubmit = (data: CategoryFormData) => {
		if (!workGroup || !websocket?.CHAT_SOCKET) return

		//TODO: make validation in the server as well
		if (getCatByName(data[FIELD_NAMES.NAME]) != undefined)
			return setError(FIELD_NAMES.NAME, { message: 'Category already exists' })

		CloseActiveModal()

		websocket.CHAT_SOCKET.sendPayload(WS_ACTIONS.WS_CREATE_CATEGORY, {
			category_name: data[FIELD_NAMES.NAME],
			category_description: data[FIELD_NAMES.DESCRIPTION] ?? null,
			group_id: workGroup.id
		})
	}

	return (
		<SFCustomDialog
			open={ActiveModal === ADMIN_MODALS_OPEN.CREATE_CATEGORY}
			onClose={CloseActiveModal}
			onTrigger={() => SetActiveModal(ADMIN_MODALS_OPEN.CREATE_CATEGORY)}
			title="Create Category"
			description="Categories help organize your channels"
		>
			<FormProvider {...{ handleSubmit, setError, ...methods }}>
				<Form.Root onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
					<TextInput
						inputName={FIELD_NAMES.NAME}
						label="Category Name"
						type="text"
						placeholder="e.g. Genera, Voice. Text"
					/>

					<TextInput
						inputName={FIELD_NAMES.DESCRIPTION}
						label="Description (optional)"
						type="text"
						placeholder="What's this category about?"
					/>

					<SFButton type="submit" styling="primary">
						Create Category
					</SFButton>
				</Form.Root>
			</FormProvider>
		</SFCustomDialog>
	)
}
