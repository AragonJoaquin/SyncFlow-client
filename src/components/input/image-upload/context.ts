import { useAnyContext } from '@/context'
import { createContext } from 'react'

interface IImageUploader {
	preview: string | undefined
	setPreview: (s: string | undefined) => void

	isModalOpen: boolean
	setIsModalOpen: (s: boolean) => void
}

export const IMAGE_UPLOADER_CONTEXT = createContext<IImageUploader | undefined>(undefined)
export const useImageUploaderContext = () => useAnyContext<IImageUploader>(IMAGE_UPLOADER_CONTEXT)
