import { useAxios } from '@/api'
import { SFButton, SFDialog } from '@/components'
import { ImageUploader } from '@/components/input'
import { SFSkeleton } from '@/components/SFSkeleton'
import { SVGEdit } from '@/components/svgs'
import { useOwnUserStore, useToastStore } from '@/store'
import type { User } from '@/types'
import { zodResolver } from '@hookform/resolvers/zod'
import { Avatar, Form } from 'radix-ui'
import { useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import z from 'zod'

interface EditableAvatarProps {
	user: User
	onAvatarUpdate: (updatedUser: User) => void
}

const FIELD_NAMES = {
	PICTURE: 'profile_picture'
} as const

const MAX_MB_FILE = 5 * 1024 * 1024 // ~= max 5mb
const ALLOWED_IMAGE_TYPES = 'image/' as const

const zodSchema = z.object({
	[FIELD_NAMES.PICTURE]: z
		.any()
		.refine((files) => files?.[0], 'Image is required')
		.refine((files) => !files?.[0] || files[0].size <= MAX_MB_FILE, 'Max file size is 5MB')
		.refine((files) => !files?.[0] || files[0].type.startsWith(ALLOWED_IMAGE_TYPES), 'Only images are allowed')
})

type AvatarFormType = z.infer<typeof zodSchema>

export function EditableAvatar({ user, onAvatarUpdate }: EditableAvatarProps) {
	const [isLoading, setIsLoading] = useState(false)
	const { patch, post } = useAxios()
	const { setUser } = useOwnUserStore()
	const { addSuccessToast, addErrorToast } = useToastStore()

	const methods = useForm<AvatarFormType>({
		resolver: zodResolver(zodSchema),
		mode: 'onChange'
	})
	const { handleSubmit } = methods

	const onSubmit = async (data: AvatarFormType) => {
		const file = data[FIELD_NAMES.PICTURE]?.[0]
		if (!file) return

		setIsLoading(true)

		//TODO: this is HORRIBLE and BUGGY
		try {
			const formData = new FormData()
			formData.append('file', file)

			const { data: res } = await post<{ url: string }>('/upload/public', formData)
			const updateResponse = await patch<User>('/user', { profile_picture: res.data.url })

			const updatedUser = updateResponse.data.data

			setUser(updatedUser)
			onAvatarUpdate(updatedUser)
			addSuccessToast('Profile picture updated successfully')
			methods.reset()
		} catch (error) {
			if (error instanceof Error)
				addErrorToast({
					title: 'Upload failed',
					description: error?.message ?? 'Failed to update profile picture'
				})

			addErrorToast({
				title: 'Upload failed',
				description: 'An unexpected error occurred'
			})
		} finally {
			setIsLoading(false)
		}
	}

	const handleCancel = () => {
		methods.reset()
	}

	const avatar_name = user.name != null ? `${user.name}'s avatar` : 'Unknown avatar'

	return (
		<div className="relative group">
			<SFDialog
				title="Update Profile Picture"
				description="Upload a new profile picture"
				trigger={
					<SFButton
						styling="none"
						className="relative cursor-pointer focus:outline-none"
						type="button"
						aria-label="Edit profile picture"
					>
						<Avatar.Root>
							<Avatar.Image
								src={user.profile_picture}
								alt={avatar_name}
								title={avatar_name}
								className="w-64 h-64 rounded-full"
							/>
							<Avatar.Fallback className="text-1xl">
								<SFSkeleton variant="circle" width={52} height={52} />
							</Avatar.Fallback>
						</Avatar.Root>

						{/* Edit Overlay */}
						<div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
							<SVGEdit className="w-8 h-8 text-white" />
						</div>
					</SFButton>
				}
			>
				<FormProvider {...methods}>
					<Form.Root className="flex flex-col gap-4" encType="multipart/form-data" onSubmit={handleSubmit(onSubmit)}>
						<ImageUploader fieldName={FIELD_NAMES.PICTURE} label="Profile Picture" />

						<div className="flex gap-3 justify-end mt-4">
							<SFButton styling="secondary" onClick={handleCancel} disabled={isLoading} type="button">
								Cancel
							</SFButton>
							<SFButton styling="primary" disabled={isLoading} type="submit">
								{isLoading ? 'Uploading...' : 'Upload'}
							</SFButton>
						</div>
					</Form.Root>
				</FormProvider>
			</SFDialog>
		</div>
	)
}
