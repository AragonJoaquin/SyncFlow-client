import { useAxios } from '@/api'
import { ErrorServer } from '@/api/axios_helper'
import { TextInput } from '@/components/input/text-input'
import { useOwnUserStore, useToastStore } from '@/store'
import type { UserWithJWT } from '@/types'
import { zodResolver } from '@hookform/resolvers/zod'
import * as Form from '@radix-ui/react-form'
import { FormProvider, useForm, type SubmitHandler } from 'react-hook-form'
import { useLocation } from 'wouter'
import { z } from 'zod'

const FIELD_NAMES = {
	USERNAME_OR_EMAIL: 'username_or_email',
	PASSWORD: 'password'
} as const

const schema = z.object({
	[FIELD_NAMES.USERNAME_OR_EMAIL]: z.string().min(3, 'Username should be at least 3 characters.'),
	[FIELD_NAMES.PASSWORD]: z.string().min(8, 'Password should be at least 8 characters.')
})

type FormData = z.infer<typeof schema>

export function LoginForm() {
	const [, navigate] = useLocation()
	const { handleSubmit, setError, ...methods } = useForm<FormData>({
		resolver: zodResolver(schema),
		mode: 'onChange'
	})

	const { login } = useOwnUserStore()
	const addErrToast = useToastStore((s) => s.addErrorToast)
	const { post } = useAxios()

	const onSubmit: SubmitHandler<FormData> = async (data) => {
		try {
			const user_or_email = data[FIELD_NAMES.USERNAME_OR_EMAIL]
			const itsEmail = z.email().safeParse(user_or_email)

			const { data: res } = await post<UserWithJWT>('/login', {
				password: data[FIELD_NAMES.PASSWORD],
				...(itsEmail.success ? { email: user_or_email } : { name: user_or_email })
			})

			login({ user: res.data?.user, token: res.data.jwt_token })
			navigate('/')
		} catch (err: unknown) {
			err instanceof ErrorServer ? addErrToast(err) : addErrToast()
		}
	}

	return (
		<FormProvider {...{ handleSubmit, setError, ...methods }}>
			<Form.Root className="space-y-4 sm:space-y-5" onSubmit={handleSubmit(onSubmit)}>
				<TextInput
					type="text"
					label="Username or Email"
					placeholder="test@example.com"
					inputName={FIELD_NAMES.USERNAME_OR_EMAIL}
				/>

				<TextInput type="password" label="Password" placeholder="••••••••" inputName={FIELD_NAMES.PASSWORD} />

				<Form.Submit asChild>
					<button
						type="submit"
						className="w-full py-2.5 sm:py-3 px-4 bg-primary hover:bg-primary-hover text-primary-foreground font-bold font-Cabin rounded-lg sm:rounded-xl transition-all duration-200 hover:shadow-lg hover:shadow-primary/25 cursor-pointer text-sm sm:text-base"
					>
						Log in
					</button>
				</Form.Submit>

				<p className="flex justify-center w-full text-xs sm:text-sm text-primary cursor-pointer hover:underline">
					Forgot your password?
				</p>
			</Form.Root>
		</FormProvider>
	)
}
