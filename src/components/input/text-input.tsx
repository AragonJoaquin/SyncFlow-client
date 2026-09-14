import { useId, type HTMLInputAutoCompleteAttribute, type HTMLInputTypeAttribute } from 'react'
import { useFormContext } from 'react-hook-form'
import { INPUT_STYLINGS, type AVAILABLE_INPUT_STYLES } from '.'
import { FormMessageError } from './form-message-error'
import { FormField, FormControl, FormLabel } from '@radix-ui/react-form'

type ITextInput = {
	styling?: AVAILABLE_INPUT_STYLES
	type: HTMLInputTypeAttribute
	label: string
	inputName: string
	placeholder: string
	className?: string
	fieldClassName?: string
	autoComplete?: HTMLInputAutoCompleteAttribute
	disableErrors?: boolean
}

export const InputLabelStyles = 'block text-xs sm:text-sm font-semibold font-Cabin text-foreground mb-1 sm:mb-1.5'
export function TextInput({
	type = 'text',
	label,
	inputName,
	placeholder,
	styling = 'classic',
	className,
	fieldClassName,
	autoComplete = 'off',
	disableErrors = false
}: ITextInput) {
	const {
		register,
		formState: { errors }
	} = useFormContext<Record<typeof inputName, any>>()

	const error = errors[inputName as keyof typeof errors]
	const id = useId()

	return (
		<FormField className={`flex flex-col ${fieldClassName}`} {...register(inputName)}>
			{label != '' && (
				<FormLabel className={InputLabelStyles} htmlFor={id}>
					{label}
				</FormLabel>
			)}
			<FormControl
				type={type}
				className={`${INPUT_STYLINGS[styling]} ${className} focus:outline-none focus:ring-2 focus:ring-primaryText/30 focus:border-primaryText transition-all duration-200`}
				id={id}
				placeholder={placeholder}
				autoComplete={autoComplete}
			/>

			{!disableErrors && error != undefined && <FormMessageError error={error} />}
		</FormField>
	)
}
