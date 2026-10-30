import { useAxios } from '@/api'
import { SFButton } from '@/components'
import { ImageUploader, Textarea, TextInput } from '@/components/input'
import { useOwnUserStore, useToastStore } from '@/store'
import type { FileRepo, User } from '@/types'
import { MAX_MB_FILE } from '@/utils'
import { zodResolver } from '@hookform/resolvers/zod'
import { Form } from 'radix-ui'
import { useState } from 'react'
import { FormProvider, useForm, type SubmitHandler } from 'react-hook-form'
import { z } from 'zod'
import { SVGChevronArrow } from '../svgs'

const FIELD_NAMES = {
	ALIAS_NAME: 'alias_name',
	DESCRIPTION: 'description',
	PROFILE_PICTURE: 'profile_picture'
} as const

const IMAGE_FIELD = 'upload_image' as const

const schema = z.object({
	[FIELD_NAMES.ALIAS_NAME]: z
		.string()
		.min(3, 'Username should be at least 3 characters.')
		.max(30, 'Username should be at most 30 characters.'),
	[FIELD_NAMES.DESCRIPTION]: z.string().max(50, 'Description should be at most 50 characters.').optional(),
	[FIELD_NAMES.PROFILE_PICTURE]: z
		.any()
		.nullish()
		.refine((files) => !files?.[0] || files[0].size <= MAX_MB_FILE, 'Max file size is 5MB')
		.refine((files) => !files?.[0] || files[0].type.startsWith('image/'), 'Only images are allowed')
})

type ProfileEditFormData = z.infer<typeof schema>

interface ProfileEditFormProps {
	user: User
	onCancel: () => void
}

export function ProfileEditForm({ user, onCancel }: ProfileEditFormProps) {
	const { post, put } = useAxios()
	const setUser = useOwnUserStore((s) => s.setUser)
	const addSuccessToast = useToastStore((s) => s.addSuccessToast)
	const [isLoading, setIsLoading] = useState(false)

	const methods = useForm<ProfileEditFormData>({
		resolver: zodResolver(schema),
		mode: 'onChange',
		defaultValues: {
			[FIELD_NAMES.ALIAS_NAME]: user.alias_name,
			[FIELD_NAMES.DESCRIPTION]: user.description ?? '',
			[FIELD_NAMES.PROFILE_PICTURE]: undefined
		}
	})
	const { handleSubmit, reset } = methods

	const onSubmit: SubmitHandler<ProfileEditFormData> = async (data) => {
		const picture = data[FIELD_NAMES.PROFILE_PICTURE]?.[0] as File | undefined
		const aliasName = data[FIELD_NAMES.ALIAS_NAME]
		const description = data[FIELD_NAMES.DESCRIPTION] ?? ''

		const aliasChanged = aliasName !== user.alias_name
		const descriptionChanged = description !== (user.description ?? '')

		if (!picture && !aliasChanged && !descriptionChanged) {
			onCancel()
			return
		}

		setIsLoading(true)

		try {
			let profilePictureId: string | undefined

			if (picture) {
				const formData = new FormData()
				formData.append(IMAGE_FIELD, picture)

				const { data: uploadResponse } = await post<FileRepo>('/upload/public', formData)
				if (uploadResponse.error) return

				profilePictureId = uploadResponse.data.id
			}

			const payload: Record<string, unknown> = {}
			if (aliasChanged) payload[FIELD_NAMES.ALIAS_NAME] = aliasName
			if (descriptionChanged) payload[FIELD_NAMES.DESCRIPTION] = description
			if (profilePictureId) payload.profile_picture_id = profilePictureId

			const { data: updateResponse } = await put<User>('/user', payload)
			if (updateResponse.error) return

			setUser(updateResponse.data)
			reset()
			addSuccessToast('Profile updated successfully')
			onCancel()
		} catch {
			return
		} finally {
			setIsLoading(false)
		}
	}

	return (
		<FormProvider {...methods}>
			<section className="flex flex-col gap-2">
				<span className="flex items-center gap-2">
					<SFButton styling="terciary" type="button" onClick={onCancel} aria-label="Back to profile">
						<SVGChevronArrow className="size-5 rotate-90" fill="none" stroke="currentColor">
							<title>Back to profile</title>
						</SVGChevronArrow>
					</SFButton>
					<h4 className="text-base font-semibold text-whiteText">Edit Profile</h4>
				</span>

				<Form.Root className="flex flex-col items-center gap-3" onSubmit={handleSubmit(onSubmit)}>
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

					<ImageUploader fieldName={FIELD_NAMES.PROFILE_PICTURE} label="Profile picture" enableCrop />

					<span className="flex gap-2 justify-end pt-2 border-t border-zinc-700">
						<SFButton styling="secondary" onClick={onCancel} disabled={isLoading}>
							Cancel
						</SFButton>
						<Form.Submit asChild>
							<SFButton styling="primary" disabled={isLoading}>
								{isLoading ? 'Saving...' : 'Save'}
							</SFButton>
						</Form.Submit>
					</span>
				</Form.Root>
			</section>
		</FormProvider>
	)
}
