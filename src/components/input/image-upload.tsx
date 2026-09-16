import { ImageUploaderProvider } from './image-upload/context'
import { PrivateImageUploader, type ImageUploaderProps } from './image-upload/private-image-upload'

export function ImageUploader(props: ImageUploaderProps) {
	return (
		<ImageUploaderProvider>
			<PrivateImageUploader {...props} />
		</ImageUploaderProvider>
	)
}
