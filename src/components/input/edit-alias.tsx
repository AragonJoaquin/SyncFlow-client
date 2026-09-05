import { useForm, type SubmitHandler, FormProvider } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import * as Form from '@radix-ui/react-form'
import { TextInput } from './text-input'
import { useAxios } from '@/api'
import { ErrorServer } from '@/api/axios_helper'
import { useOwnUserStore, useToastStore } from '@/store'
import type { User } from '@/types'

const schema = z.object({
	alias_name: z
		.string()
		.min(3, 'Alias must be at least 3 characters')
		.max(30, 'Alias must be at most 30 characters')
		.or(z.literal(''))
		.pipe(z.transform((v) => (v === '' ? null : v)))
		.nullable()
})

type FormData = z.infer<typeof schema>

export function EditAlias({
	value,
	inputName,
	formId,
	close
}: {
	value: string
	inputName: string
	formId: string
	close?: () => void
}) {
	const { patch } = useAxios()
	const setUser = useOwnUserStore((s) => s.setUser)
	const addSuccessToast = useToastStore((s) => s.addSuccessToast)
	const addErrorToast = useToastStore((s) => s.addErrorToast)

	const methods = useForm<FormData>({
		resolver: zodResolver(schema),
		defaultValues: { [inputName]: value }
	})

	const onSubmit: SubmitHandler<FormData> = async (data) => {
		// If alias unchanged, skip update
		if (data.alias_name === value) {
			close?.()
			return
		}

		try {
			const payload = { [inputName]: data.alias_name }
			const { data: res } = await patch<User>('/user', payload)
			setUser(res.data)
			addSuccessToast('Alias updated successfully.')
			close?.()
		} catch (err) {
			if (err instanceof ErrorServer) {
				addErrorToast(err)
			} else {
				addErrorToast()
			}
		}
	}

	return (
		<FormProvider {...methods}>
			<Form.Root onSubmit={methods.handleSubmit(onSubmit)} id={formId}>
				<h2 className="text-3xl font-bold text-center pb-5">Editar alias</h2>
				<h4 className="pb-5">
					Alias actual: <span className="font-bold">{value || 'Sin alias'}</span>
				</h4>
				<TextInput type="text" label="Nuevo alias" placeholder="alias" inputName={inputName} />
			</Form.Root>
		</FormProvider>
	)
}
