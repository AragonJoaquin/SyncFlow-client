import { ACCEPTED_IMAGE_TYPES } from '@/utils'
import { AspectRatio, Form } from 'radix-ui'
import { useRef, useState } from 'react'
import { useFormContext } from 'react-hook-form'
import { InputLabelStyles } from '.'
import { SVGTrash } from '../svgs'
import { FormMessageError } from './form-message-error'

interface ImageUploaderProps {
	fieldName: string
	label?: string

	enableCrop?: boolean
	cropAspect?: number
}

export const ImageUploader = ({ fieldName, label }: ImageUploaderProps) => {
	const {
		register,
		setValue,
		formState: { errors }
	} = useFormContext<Record<typeof fieldName, any>>()

	const error = errors[fieldName] ?? null
	const [preview, setPreview] = useState<string>()
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
		<Form.Field className="grid mb-4" name={fieldName}>
			<Form.Label className={`${InputLabelStyles} text-center`}>{label}</Form.Label>

			<div
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
				className={`mt-2 flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-1 transition-colors cursor-pointer
        ${isDragging ? 'border-neutral-100 bg-neutral-600/70' : 'border-neutral-300 hover:border-neutral-400'}`}
			>
				<Form.Control asChild>
					<input
						type="file"
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
				</Form.Control>

				<span className="relative flex size-36 justify-center items-center text-center">
					{preview ? (
						<>
							<AspectRatio.Root ratio={1 / 1} className="w-full">
								<img src={preview} alt="Preview" className="w-full h-full object-cover rounded-md" />
							</AspectRatio.Root>
							<span className="absolute top-0 -right-10 ">
								<SVGTrash
									className="bg-red-500 rounded-md p-0.5 z-50!"
									onClick={(e) => {
										e.preventDefault()
										e.stopPropagation()
										setValue(fieldName, null)
										setPreview(undefined)
									}}
								/>
							</span>
						</>
					) : (
						<span className="text-neutral-400 text-sm">Drag and drop or click to upload</span>
					)}
				</span>
			</div>
			<span className="mt-1 flex text-center w-full justify-center items-baseline">
				<Form.Message className="text-xs text-neutral-400">
					{preview ? 'Click to change' : 'PNG, JPG up to 10MB'}
				</Form.Message>
			</span>

			{error && <FormMessageError error={error} />}
		</Form.Field>
	)
}
