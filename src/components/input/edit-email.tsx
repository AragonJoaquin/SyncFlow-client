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
	email: z.email('Please enter a valid email address')
})

type FormData = z.infer<typeof schema>

export function EditEmail({ value, inputName, formId, close }: { value: string; inputName: string; formId: string; close?: () => void }) {
	const { patch } = useAxios()
	const setUser = useOwnUserStore((s) => s.setUser)
	const addSuccessToast = useToastStore((s) => s.addSuccessToast)
	const addErrorToast = useToastStore((s) => s.addErrorToast)

	const methods = useForm<FormData>({
		resolver: zodResolver(schema),
		defaultValues: { [inputName]: value }
	})

	const onSubmit: SubmitHandler<FormData> = async (data) => {
		try {
			const { data: res } = await patch<User>('/user', { email: data.email })
			setUser(res.data)
			addSuccessToast('Email updated successfully')
			close?.()
		} catch (err) {
			err instanceof ErrorServer ? addErrorToast(err) : addErrorToast()
		}
	}

	return (
		<FormProvider {...methods}>
			<Form.Root onSubmit={methods.handleSubmit(onSubmit)} id={formId}>
				<h2 className="text-3xl font-bold text-center pb-5">Editar email</h2>
				<h4 className="pb-5">
					Email actual: <span className="font-bold">{value}</span>
				</h4>
				<TextInput
					type="email"
					label="Nuevo Email"
					placeholder="email@example.com"
					inputName={inputName}
				/>
			</Form.Root>
		</FormProvider>
	)
}