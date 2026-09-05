import { useAxios } from '@/api'
import { SFButton } from '@/components'
import { Textarea, TextInput } from '@/components/input'
import type { User } from '@/types'
import { zodResolver } from '@hookform/resolvers/zod'
import * as Form from '@radix-ui/react-form'
import { FormProvider, useForm, type SubmitHandler } from 'react-hook-form'
import { z } from 'zod'

const FIELD_NAMES = {
	ALIAS_NAME: 'alias_name',
	DESCRIPTION: 'description'
} as const

const schema = z.object({
	[FIELD_NAMES.ALIAS_NAME]: z.string().min(3, 'Username should be at least 3 characters.'),
	[FIELD_NAMES.DESCRIPTION]: z.string().max(500, 'Description should be at most 500 characters.').optional()
})

type ProfileEditFormData = z.infer<typeof schema>

interface ProfileEditFormProps {
	user: User
	onCancel: () => void
}

export function ProfileEditForm({ user, onCancel }: ProfileEditFormProps) {
	const { handleSubmit, ...methods } = useForm<ProfileEditFormData>({
		resolver: zodResolver(schema),
		mode: 'onChange',
		defaultValues: {
			[FIELD_NAMES.ALIAS_NAME]: user.alias_name,
			[FIELD_NAMES.DESCRIPTION]: user.description ?? ''
		}
	})

	const {} = useAxios()

	const onSubmit: SubmitHandler<ProfileEditFormData> = () => {}

	return (
		<FormProvider {...{ handleSubmit, ...methods }}>
			<section className="flex flex-col gap-2">
				<span className="flex items-center gap-2">
					<SFButton styling="terciary" type="button" onClick={onCancel} aria-label="Back to profile">
						<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<title>Back to profile</title>
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
						</svg>
					</SFButton>
					<h4 className="text-base font-semibold text-whiteText">Edit Profile</h4>
				</span>

				<Form.Root className="flex flex-col gap-3" onSubmit={handleSubmit(onSubmit)}>
					<TextInput
						type="text"
						label="Username"
						placeholder="Username"
						inputName={FIELD_NAMES.ALIAS_NAME}
						styling="compact"
						fieldClassName="gap-1.5"
					/>

					<Textarea
						label="Description"
						placeholder="Tell us about yourself..."
						inputName={FIELD_NAMES.DESCRIPTION}
						styling="compact"
						fieldClassName="gap-1.5"
					/>

					<span className="flex gap-2 justify-end pt-2 border-t border-zinc-700">
						<SFButton styling="secondary" onClick={onCancel}>
							Cancel
						</SFButton>
						<Form.Submit asChild>
							<SFButton styling="primary">Save</SFButton>
						</Form.Submit>
					</span>
				</Form.Root>
			</section>
		</FormProvider>
	)
}
