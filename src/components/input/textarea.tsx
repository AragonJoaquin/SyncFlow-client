import { Form } from 'radix-ui'
import { useId } from 'react'
import { useFormContext, type FieldError, type FieldErrorsImpl, type Merge, type UseFormReturn } from 'react-hook-form'
import { INPUT_STYLINGS, type AVAILABLE_INPUT_STYLES } from '.'
import { InputLabelStyles } from './text-input'
import { FormMessageError } from './form-message-error'

type ITextarea = {
	styling?: AVAILABLE_INPUT_STYLES
	label: string
	inputName: string
	placeholder: string
	className?: string
	fieldClassName?: string
	rows?: number
	error?: FieldError | Merge<FieldError, FieldErrorsImpl<any>>
	register?: UseFormReturn<any>['register']
}

export function Textarea({
	label,
	inputName,
	placeholder,
	styling = 'classic',
	className,
	fieldClassName,
	rows = 3,
	error: errorProp,
	register: registerProp
}: ITextarea) {
	const {
		register,
		formState: { errors }
	} = useFormContext<Record<typeof inputName, any>>()

	const registerFn = registerProp ?? register
	const error = errorProp ?? errors[inputName as keyof typeof errors]

	const id = useId()
	return (
		<Form.Field className={`flex flex-col ${fieldClassName}`} {...registerFn(inputName)}>
			<Form.Label className={InputLabelStyles} htmlFor={id}>
				{label}
			</Form.Label>
			<Form.Control asChild>
				<textarea
					className={`${INPUT_STYLINGS[styling]} ${className} focus:outline-none focus:ring-2 focus:ring-primaryText/30 focus:border-primaryText transition-all duration-200 resize-y`}
					id={id}
					placeholder={placeholder}
					rows={rows}
				/>
			</Form.Control>

			{error !== undefined && <FormMessageError error={error} />}
		</Form.Field>
	)
}