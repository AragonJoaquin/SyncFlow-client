import { FilePreview } from './file-preview'

interface MessageAttachmentsProps {
	previewUrl?: string
	fileId?: string
}

export function MessageAttachments({ previewUrl, fileId }: MessageAttachmentsProps) {
	if (previewUrl) {
		return (
			<span className="mt-1 inline-flex rounded-lg overflow-hidden max-w-[300px]">
				<img src={previewUrl} alt="Attached preview" className="max-w-[300px] max-h-[200px] object-cover rounded-lg" />
			</span>
		)
	}

	if (!fileId) return null

	return (
		<span className="mt-1">
			<FilePreview fileId={fileId} />
		</span>
	)
}
