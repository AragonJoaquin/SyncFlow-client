import { ACCEPTED_IMAGE_TYPES } from '@/utils'
import { Field, Label, Control, Message } from '@radix-ui/react-form'
import { useRef, useState } from 'react'
import { useFormContext } from 'react-hook-form'
import { InputLabelStyles } from '..'
import { FormMessageError } from '../form-message-error'
import { AdjustImage } from './adjust-image'
import { useImageUploaderContext } from './context'

export interface ImageUploaderProps {
	fieldName: string
	label?: string

	enableCrop?: boolean
	// cropAspect?: number
}

export const PrivateImageUploader = ({ fieldName, label, enableCrop = false }: ImageUploaderProps) => {
	const {
		register,
		setValue,
		formState: { errors }
	} = useFormContext<Record<typeof fieldName, any>>()

	const { preview, setPreview } = useImageUploaderContext()

	const error = errors[fieldName] ?? null
	const [isDragging, setIsDragging] = useState(false)
	const fileInputRef = useRef<HTMLInputElement>(null)

	const handleFiles = (files: FileList | null) => {
		setValue(fieldName, files)
		// preview
		try {
			const file = files?.[0] ?? null
			if (!file) return

			const reader = new FileReader()
			reader.onloadend = () => setPreview(reader?.result as string)
			reader.readAsDataURL(file)
		} catch {}
	}

	return (
		<Field className="grid mb-4" name={fieldName}>
			<Label className={`${InputLabelStyles} mb-0! pb-0! text-center`}>{label}</Label>

			<div
				role="button"
				tabIndex={0}
				onDragOver={(e) => {
					e.preventDefault()
					setIsDragging(true)
				}}
				onDragLeave={() => setIsDragging(false)}
				onDrop={(e) => {
					e.preventDefault()
					setIsDragging(false)
					handleFiles(e.dataTransfer.files)
				}}
				onClick={() => fileInputRef.current?.click()}
				className={`mt-2 flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-1 
          transition-colors cursor-pointer aspect-square size-60 max-h-60 max-w-60
        ${isDragging ? 'border-neutral-100 bg-neutral-600/70' : 'border-neutral-300 hover:border-neutral-400'}`}
			>
				<Control asChild>
					<input
						type="file"
						disabled={!!preview}
						accept={ACCEPTED_IMAGE_TYPES.join(',')}
						className="hidden"
						aria-label="Send Image"
						{...register(fieldName)}
						ref={(e) => {
							register(fieldName).ref(e)
							;(fileInputRef as any).current = e
						}}
						onChange={(e) => {
							register(fieldName).onChange(e)
							handleFiles(e.target.files)
						}}
					/>
				</Control>

				{!preview ? (
					<span className="text-neutral-400 w-full h-full flex justify-center items-center text-sm text-center p-10">
						Drag and drop or click to upload
					</span>
				) : (
					enableCrop && <AdjustImage {...{ fieldName }} />
				)}
			</div>
			<span className="mt-1 flex text-center w-full justify-center items-baseline">
				<Message className="text-xs text-neutral-400">{preview ? 'Click to change' : 'PNG, JPG up to 10MB'}</Message>
			</span>

			{error && <FormMessageError error={error} />}
		</Field>
	)
}
