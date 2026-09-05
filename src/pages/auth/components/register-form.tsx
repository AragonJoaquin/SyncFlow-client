import { useAxios } from '@/api'
import { ErrorServer } from '@/api/axios_helper'
import { TextInput } from '@/components/input'
import { useOwnUserStore, useToastStore } from '@/store'
import type { UserWithJWT } from '@/types'
import { zodResolver } from '@hookform/resolvers/zod'
import * as Form from '@radix-ui/react-form'
import { FormProvider, useForm, type SubmitHandler } from 'react-hook-form'
import { useLocation } from 'wouter'
import { z } from 'zod'

const FIELD_NAMES = {
	USERNAME: 'name',
	EMAIL: 'email',
	PASSWORD: 'password',
	CONFIRM_PSWRD: 'confirm_password'
} as const

const schema = z
	.object({
		[FIELD_NAMES.USERNAME]: z.string().min(3, 'Username should be at least 3 characters.'),
		[FIELD_NAMES.EMAIL]: z.email('Invalid Email'),
		[FIELD_NAMES.PASSWORD]: z.string().min(8, 'Password should be at least 8 characters.'),
		[FIELD_NAMES.CONFIRM_PSWRD]: z.string()
	})
	.refine((data) => data[FIELD_NAMES.PASSWORD] === data[FIELD_NAMES.CONFIRM_PSWRD], {
		message: 'Las contraseñas no coinciden',
		path: [FIELD_NAMES.CONFIRM_PSWRD]
	})

type RegisterFormData = z.infer<typeof schema>

export function RegisterForm() {
	const { handleSubmit, ...methods } = useForm<RegisterFormData>({
		resolver: zodResolver(schema)
	})

	const [, navigate] = useLocation()
	const { login } = useOwnUserStore()
	const addErrToast = useToastStore((s) => s.addErrorToast)
	const { post } = useAxios()

	const onSubmit: SubmitHandler<RegisterFormData> = async (data) => {
		try {
			const { data: res } = await post<UserWithJWT>('/signin', data)

			login({ user: res.data.user, token: res.data.jwt_token })
			navigate('/')
		} catch (err: unknown) {
			err instanceof ErrorServer ? addErrToast(err) : addErrToast()
		}
	}

	return (
		<FormProvider {...{ handleSubmit, ...methods }}>
			<Form.Root className="space-y-4 sm:space-y-5" onSubmit={handleSubmit(onSubmit)}>
				<TextInput type="text" label="Username" placeholder="test1234" inputName={FIELD_NAMES.USERNAME} />

				<TextInput type="email" label="Email" placeholder="email@example.com" inputName={FIELD_NAMES.EMAIL} />

				<TextInput type="password" label="Password" placeholder="••••••••" inputName={FIELD_NAMES.PASSWORD} />

				<TextInput
					type="password"
					label="Confirm Password"
					placeholder="••••••••"
					inputName={FIELD_NAMES.CONFIRM_PSWRD}
				/>

				<Form.Submit asChild>
					<button
						type="submit"
						className="w-full py-2.5 sm:py-3 px-4 bg-primary hover:bg-primary-hover text-primary-foreground font-bold font-Cabin rounded-lg sm:rounded-xl transition-all duration-200 hover:shadow-lg hover:shadow-primary/25 cursor-pointer text-sm sm:text-base"
					>
						Create Account
					</button>
				</Form.Submit>
			</Form.Root>
		</FormProvider>
	)
}
