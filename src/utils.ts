import z from 'zod'

export const APP_NAME = 'SyncFlow' as const

export const CUSTOM_HEADERS = {
	HEADER_REQUESTS_LEFT: 'X-Request_Left',
	HEADER_TOTAL_LIMITER: 'X-Request_Max-Bucket',
	HEADER_WAIT_UNTIL: 'X-Request_Wait'
} as const

// this is also possible with an useEffect custom hook
export const DEFAULT_DEBOUNCE_MS = 500 as const //500ms
export const debouncer = <T extends unknown[]>(callback: (...args: T) => void, delay: number = DEFAULT_DEBOUNCE_MS) => {
	let timeoutTimer: ReturnType<typeof setTimeout>

	return (...args: T) => {
		clearTimeout(timeoutTimer)

		timeoutTimer = setTimeout(() => {
			callback(...args)
		}, delay)
	}
}

export const BASE_URL: string = import.meta.env.DEV ? 'http://localhost:8080/v1' : import.meta.env.VITE_API_URL
export const CLIENT_VER: string = import.meta.env.VITE_CLIENT_VER ?? '???'

export const INVALID_DATE = '0001-01-01T00:00:00Z' as const

export const FormatRelativeTime = (date: Date): string => {
	const diffMs = new Date().getTime() - date.getTime()

	const diffMins = Math.floor(diffMs / 60000)
	if (diffMins < 1) return 'just now'
	if (diffMins < 60) return `${diffMins}m ago`

	const diffHours = Math.floor(diffMins / 60)
	if (diffHours < 24) return `${diffHours}h ago`

	const diffDays = Math.floor(diffHours / 24)
	if (diffDays < 7) return `${diffDays}d ago`

	return date.toLocaleDateString()
}

// images conf
export const MAX_FILE_SIZE = 5 * 1024 * 1024
export const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/jpg']

export const MAX_MB_FILE = 5 * 1024 * 1024 // ~= max 5mb
const needs_to_start_with = 'image/' as const

export const ZOD_VALIDATE_FILE = (maxSize = MAX_MB_FILE) =>
	z
		.custom<FileList>()
		.transform((file) => (file.length > 0 ? file.item(0)! : new File([], '')))
		.refine((file) => file.size > 0, {
			message: 'File must exists'
		})
		.refine((file) => file && file.size <= maxSize, {
			message: 'File size maximum is 5MB.'
		})
		.refine((file) => file && file.type?.startsWith(needs_to_start_with), {
			message: 'Only images are allowed to be sent.'
		})
