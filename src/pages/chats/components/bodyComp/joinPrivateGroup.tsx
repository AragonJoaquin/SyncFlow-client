import { useAxios } from '@/api'
import { SFButton, SFSkeleton } from '@/components'
import { TextInput } from '@/components/input'
import { useWorkGroupStore, useToastStore } from '@/store'
import type { FullWorkGroup } from '@/types'
import { zodResolver } from '@hookform/resolvers/zod'
import { Form } from 'radix-ui'
import { FormProvider, useForm, type SubmitHandler } from 'react-hook-form'
import z from 'zod'
import { useShallow } from 'zustand/shallow'

const FIELD_NAMES = {
	GROUP_UUID: 'group_uuid'
} as const

const zodSchema = z.object({
	[FIELD_NAMES.GROUP_UUID]: z.uuidv4('Not a valid UUIDv4').nonempty().nonoptional()
})

export function FormPrivateGroup() {
	const { handleSubmit, ...methods } = useForm<z.infer<typeof zodSchema>>({
		resolver: zodResolver(zodSchema),
		mode: 'onChange'
	})

	const isPending = methods.formState.isLoading
	const addWorkGroup = useWorkGroupStore((s) => s.addWorkGroup)

	const { get } = useAxios()
	const addSuccessToast = useToastStore(useShallow((s) => s.addSuccessToast))
	const addErrorToast = useToastStore(useShallow((s) => s.addErrorToast))

	const onSubmit: SubmitHandler<z.infer<typeof zodSchema>> = async (e) => {
		try {
			const group_uuid = e[FIELD_NAMES.GROUP_UUID] ?? null

			if (!group_uuid) throw new Error()
			const { data: response } = await get<FullWorkGroup>(`/invite/${group_uuid}`)

			addWorkGroup(response.data)
			addSuccessToast('You have successfully joined the group.')
		} catch {
			addErrorToast({ title: 'Failed', description: 'Could not join the group. Check the UUID and try again.' })
		}
	}

	return (
		<FormProvider {...methods} handleSubmit={handleSubmit}>
			<Form.Root className="flex flex-col justify-between gap-4 size-full!" onSubmit={handleSubmit(onSubmit)}>
				<TextInput
					type="text"
					label="Invite UUID"
					placeholder="e.x.: 90e7fff5-06d3..."
					styling="ghost"
					inputName={FIELD_NAMES.GROUP_UUID}
					className="w-full!"
				/>

				{isPending && <SFSkeleton className="w-full h-full flex grow" />}

				<SFButton styling="primary" type="submit">
					Join
				</SFButton>
			</Form.Root>
		</FormProvider>
	)
}
