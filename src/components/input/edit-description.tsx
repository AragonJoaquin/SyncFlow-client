import { useForm, type SubmitHandler, FormProvider } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import * as Form from '@radix-ui/react-form'
import { Textarea } from './textarea'
import { useAxios } from '@/api'
import { ErrorServer } from '@/api/axios_helper'
import { useOwnUserStore, useToastStore } from '@/store'
import type { User } from '@/types'

const schema = z.object({
	description: z.string().max(500, 'La descripción debe tener como máximo 500 caracteres').optional()
})

type FormData = z.infer<typeof schema>

export function EditDescription({
	value,
	inputName,
	formId,
	close
}: {
	value?: string
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
		defaultValues: { [inputName]: value ?? '' }
	})

	const onSubmit: SubmitHandler<FormData> = async (data) => {
		try {
			const { data: res } = await patch<User>('/user', { description: data.description ?? null })
			setUser(res.data)
			addSuccessToast('Descripción actualizada correctamente')
			close?.()
		} catch (err) {
			err instanceof ErrorServer ? addErrorToast(err) : addErrorToast()
		}
	}

	return (
		<FormProvider {...methods}>
			<Form.Root onSubmit={methods.handleSubmit(onSubmit)} id={formId}>
				<h2 className="text-3xl font-bold text-center pb-5">Editar descripción</h2>
				<h4 className="pb-5">
					Descripción actual:{' '}
					<span className="font-bold">{value || 'Sin descripción'}</span>
				</h4>
				<Textarea
					label="Nueva descripción"
					placeholder="Escribe una descripción..."
					inputName={inputName}
					rows={4}
				/>
			</Form.Root>
		</FormProvider>
	)
}