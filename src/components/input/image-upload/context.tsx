import { useMemo, useState, type ReactNode } from 'react'
import { IMAGE_UPLOADER_CONTEXT } from './context'

export function ImageUploaderProvider({ children }: { children: ReactNode }) {
	const [preview, setPreview] = useState<string>()
	const [isModalOpen, setIsModalOpen] = useState<boolean>(false)

	const val = useMemo(
		() => ({
			preview,
			setPreview,
			isModalOpen,
			setIsModalOpen
		}),
		[preview, setPreview, isModalOpen, setIsModalOpen]
	)

	return <IMAGE_UPLOADER_CONTEXT.Provider value={val}>{children}</IMAGE_UPLOADER_CONTEXT.Provider>
}
