import { useAxios } from '@/api'
import { ErrorServer } from '@/api/axios_helper'
import { SFButton } from '@/components'
import { ImageUploader, SelectInputField, TextInput } from '@/components/input'
import { useToastStore, useWorkGroupStore } from '@/store'
import type { FullWorkGroup } from '@/types'
import { ZOD_VALIDATE_FILE } from '@/utils'
import { zodResolver } from '@hookform/resolvers/zod'
import { Form } from 'radix-ui'
import { FormProvider, useForm } from 'react-hook-form'
import z from 'zod'

const FIELD_NAMES = {
	GROUP_NAME: 'group_name',
	PICTURE: 'group_picture',
	DESCRIPTION: 'group_description',
	TYPE: 'group_type' // 1, 2 or 3
} as const

const GROUP_TYPES = {
	'1': 'Private',
	'2': 'Public',
	'3': 'Invite Only'
} as const

const zodSchema = z.object({
	[FIELD_NAMES.GROUP_NAME]: z.string().min(3, 'At least 3 characters are required').max(32, 'Maximum 32 characters'),
	[FIELD_NAMES.PICTURE]: ZOD_VALIDATE_FILE(),
	[FIELD_NAMES.TYPE]: z
		.string()
		.refine((val) => Object.keys(GROUP_TYPES).includes(val), { message: 'Needs to be a valid option' }),
	[FIELD_NAMES.DESCRIPTION]: z.string().max(100).nullable()
})

type CreateGroupType = z.infer<typeof zodSchema>

export function CreateGroupForm() {
	const { handleSubmit, ...methods } = useForm({
		resolver: zodResolver(zodSchema),
		mode: 'onChange',
		defaultValues: {
			[FIELD_NAMES.TYPE]: '1'
		}
	})

	const addWK = useWorkGroupStore((s) => s.addWorkGroup)

	const { post } = useAxios()
	const addErrToast = useToastStore((s) => s.addErrorToast)
	const onSubmit = async (e: CreateGroupType) => {
		const file = e[FIELD_NAMES.PICTURE]

		try {
			const formData = new FormData()

			for (const k in e)
				(k as (typeof FIELD_NAMES)[keyof typeof FIELD_NAMES]) === FIELD_NAMES.PICTURE
					? formData.append(k, file ? file?.slice() : new Blob())
					: formData.append(k, e[k as keyof Omit<typeof e, typeof FIELD_NAMES.PICTURE>] as string)

			const { data: res } = await post<FullWorkGroup>('/work_group', formData)
			addWK(res.data)
		} catch (e) {
			e instanceof ErrorServer ? addErrToast(e) : addErrToast()
		}
	}

	return (
		<FormProvider {...{ handleSubmit, ...methods }}>
			<Form.Root className="flex flex-col gap-2" encType="multipart/form-data" onSubmit={handleSubmit(onSubmit)}>
				<TextInput
					className="w-full!"
					styling="ghost"
					type="text"
					label="Group Name"
					placeholder=""
					inputName={FIELD_NAMES.GROUP_NAME}
				/>

				<TextInput
					className="w-full!"
					styling="ghost"
					type="text"
					label="Group Description"
					placeholder="(can be null)"
					inputName={FIELD_NAMES.DESCRIPTION}
				/>

				<span className="w-full flex flex-col gap-1">
					<label className="block text-md font-Cabin text-foreground">Select the group type</label>
					<SelectInputField inputName={FIELD_NAMES.TYPE} values={GROUP_TYPES} />
				</span>

				<span className="flex flex-col justify-center items-center w-full">
					<ImageUploader fieldName={FIELD_NAMES.PICTURE} label="Upload an image" />
				</span>

				<Form.Submit asChild>
					<SFButton styling="primary" type="submit">
						Submit
					</SFButton>
				</Form.Submit>
			</Form.Root>
		</FormProvider>
	)
}
