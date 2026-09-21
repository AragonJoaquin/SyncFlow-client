import { useRef } from 'react'
import { Cropper, type CropperRef } from 'react-advanced-cropper'
import 'react-advanced-cropper/dist/style.css' // cropper styles
import { SVGTrash } from '../../svgs'
import { useFormContext } from 'react-hook-form'
import { useImageUploaderContext } from './context'
import { SFButton } from '@/components/SFButton'
import { Dialog } from 'radix-ui'

interface AdjustImageProps {
	fieldName: string
}

export function AdjustImage({ fieldName }: AdjustImageProps) {
	const { setValue, getValues } = useFormContext<Record<typeof fieldName, unknown>>()
	const { preview, setPreview, setIsModalOpen, isModalOpen } = useImageUploaderContext()

	const cropperRef = useRef<CropperRef>(null)

	const handleCrop = () => {
		const cropper = cropperRef.current
		if (!cropper) return setIsModalOpen(false)

		const canvas = cropper.getCanvas()
		if (!canvas) return setIsModalOpen(false)

		const prev = getValues(fieldName) as FileList | undefined
		const orig = prev?.item?.(0) as File | undefined
		const type = orig?.type || 'image/jpeg'
		const name = orig?.name || 'cropped.jpg'

		canvas.toBlob(
			(blob) => {
				if (!blob) return setIsModalOpen(false)
				const file = new File([blob], name, { type: blob.type || type })
				const dt = new DataTransfer()
				dt.items.add(file)
				setValue(fieldName, dt.files, { shouldValidate: true })
				setPreview(canvas.toDataURL(type, 0.92))
				setIsModalOpen(false)
			},
			type,
			0.92
		)
	}

	return (
		<div className="size-full p-0.5">
			{preview && (
				<span className="relative size-full inline-block">
					<button
						type="button"
						onClick={(e) => {
							e.preventDefault()
							e.stopPropagation()
							setValue(fieldName, null, { shouldValidate: true })
							setPreview(undefined)
						}}
						className="inline-block absolute top-0 right-0 -translate-x-1 translate-y-1 bg-red-500 hover:bg-red-600 text-white p-1 rounded-md z-10 cursor-pointer"
					>
						<SVGTrash className="w-4 h-4" />
					</button>

					<img
						src={preview}
						alt="Preview"
						className={`size-full object-cover rounded-md cursor-pointer aspect-square transition-opacity hover:opacity-80 ${isModalOpen && 'pointer-events-none'}`}
						onClick={() => setIsModalOpen(true)}
					/>
				</span>
			)}

			{isModalOpen && preview && (
				<Dialog.Root open={isModalOpen} onOpenChange={(o) => !o && setIsModalOpen(false)}>
					<Dialog.Portal>
						<Dialog.Overlay className="fixed inset-0 z-100 bg-black/60 backdrop-blur-md data-[state=open]:animate-appear-from" />
						<Dialog.Content
							onEscapeKeyDown={() => setIsModalOpen(false)}
							className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-101 bg-darkBG border-2 border-darkFG rounded-lg p-4 w-[90vw] max-w-lg flex flex-col items-center gap-4 shadow-xl focus:outline-none"
						>
							<h3 className="text-lg font-semibold text-whiteText">Adjust Image</h3>
							<div className="w-full h-80 bg-gray-900 rounded-md overflow-hidden border-2 border-neutral-800">
								<Cropper
									ref={cropperRef}
									src={preview}
									className="h-full w-full"
									stencilProps={{ aspectRatio: 1 / 1 }}
								/>
							</div>
							<div className="flex justify-end gap-2 w-full">
								<SFButton styling="secondary" onClick={() => setIsModalOpen(false)}>
									Cancel
								</SFButton>
								<SFButton styling="primary" onClick={handleCrop}>
									Apply Crop
								</SFButton>
							</div>
						</Dialog.Content>
					</Dialog.Portal>
				</Dialog.Root>
			)}
		</div>
	)
}
