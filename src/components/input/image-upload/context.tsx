import { useAnyContext } from '@/context'
import { createContext, useMemo, useState, type ReactNode } from 'react'

interface IImageUploader {
	preview: string | undefined
	setPreview: (s: string | undefined) => void

	isModalOpen: boolean
	setIsModalOpen: (s: boolean) => void
}

export const IMAGE_UPLOADER_CONTEXT = createContext<IImageUploader | undefined>(undefined)

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

export const useImageUploaderContext = () => useAnyContext<IImageUploader>(IMAGE_UPLOADER_CONTEXT)
