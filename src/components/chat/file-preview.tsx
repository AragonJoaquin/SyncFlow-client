import { SFSkeleton } from '@/components/SFSkeleton'
import { BASE_URL } from '@/utils'
import { useState } from 'react'

interface FilePreviewProps {
	fileId: string
}

export function FilePreview({ fileId }: FilePreviewProps) {
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState(false)

	const imageUrl = `${BASE_URL}/upload/public/${fileId}`

	return (
		<div className="inline-flex rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800 max-w-[300px]">
			{error ? (
				<div className="w-[75px] h-[75px] flex items-center justify-center text-xs text-gray-500">Failed to load</div>
			) : (
				<>
					{loading && <SFSkeleton width={75} height={75} />}
					<img
						src={imageUrl}
						alt={`File ${fileId}`}
						className="max-w-[300px] max-h-[200px] object-cover rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
						style={{ display: loading ? 'none' : 'block' }}
						onLoad={() => setLoading(false)}
						onError={() => {
							setLoading(false)
							setError(true)
						}}
					/>
				</>
			)}
		</div>
	)
}
