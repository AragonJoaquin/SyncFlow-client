import { WS_ACTIONS } from '@/api'
import { SFButton, SFDialog } from '@/components'
import { TextInput } from '@/components/input'
import { useChatContext } from '@/context'
import type { Category } from '@/types'
import { zodResolver } from '@hookform/resolvers/zod'
import { Form } from 'radix-ui'
import { FormProvider, useForm } from 'react-hook-form'
import z from 'zod'

const FIELD_NAMES = {
	NAME: 'category_name',
	DESCRIPTION: 'category_description'
} as const

const zodSchema = z.object({
	[FIELD_NAMES.NAME]: z.string().min(3, 'At least 3 characters').max(16, 'Maximum 16 characters'),
	[FIELD_NAMES.DESCRIPTION]: z.string().max(100).optional()
})

type CategoryFormData = z.infer<typeof zodSchema>

interface EditCategoryModalProps {
	trigger: React.ReactNode
	category: Category
}

export function EditCategoryModal({ trigger, category }: EditCategoryModalProps) {
	const { handleSubmit, ...methods } = useForm<CategoryFormData>({
		resolver: zodResolver(zodSchema),
		mode: 'onChange',
		defaultValues: {
			[FIELD_NAMES.NAME]: category.name,
			[FIELD_NAMES.DESCRIPTION]: category.description ?? ''
		}
	})

	const { websocket } = useChatContext()
	const onSubmit = (data: CategoryFormData) => {
		if (!websocket?.CHAT_SOCKET) return

		websocket.CHAT_SOCKET.sendPayload(WS_ACTIONS.WS_UPDATE_CATEGORY, {
			category_id: category.id,
			payload: {
				category_name: data[FIELD_NAMES.NAME],
				category_description: data[FIELD_NAMES.DESCRIPTION] ?? null
			}
		})
	}

	return (
		<SFDialog trigger={trigger} title="Edit Category" description="Update category name and description">
			<FormProvider {...{ handleSubmit, ...methods }}>
				<Form.Root onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
					<TextInput
						type="text"
						label="Category Name"
						placeholder="e.g. General, Voice, Text"
						inputName={FIELD_NAMES.NAME}
					/>

					<TextInput
						type="text"
						label="Description (optional)"
						placeholder="What's this category about?"
						inputName={FIELD_NAMES.DESCRIPTION}
					/>

					<SFButton type="submit" styling="primary">
						Save Changes
					</SFButton>
				</Form.Root>
			</FormProvider>
		</SFDialog>
	)
}

