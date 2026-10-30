import { WS_ACTIONS } from '@/api'
import { SFButton } from '@/components'
import { ImageUploader, TextInput } from '@/components/input'
import { SVGPlus, SVGSendArrow } from '@/components/svgs'
import { useChatContext } from '@/context'
import { useOwnUserStore, useClientMessagesStore, useWorkGroupStore } from '@/store'
import { ZOD_VALIDATE_FILE } from '@/utils'
import { zodResolver } from '@hookform/resolvers/zod'
import { Form } from 'radix-ui'
import { useRef, useState } from 'react'
import { FormProvider, useForm, type SubmitHandler } from 'react-hook-form'
import z from 'zod'
import { useShallow } from 'zustand/shallow'

const EXTRA_FIELDS = {
	CHANNEL_ID: 'channel_id',
	TEMP_ID: 'temp_id'
} as const

const FIELD_NAMES = {
	SEND_MESSAGE: 'content',
	CITING_ID: 'citing_id',
	FILE: 'file'
} as const

const schema = z
	.object({
		[FIELD_NAMES.SEND_MESSAGE]: z.string(),
		[FIELD_NAMES.CITING_ID]: z.number().nullable().default(null),
		[FIELD_NAMES.FILE]: ZOD_VALIDATE_FILE().nullable().default(null)
	})
	.refine((e) => e[FIELD_NAMES.SEND_MESSAGE] || e[FIELD_NAMES.FILE], 'Cannot send an empty message')

type formData = z.infer<typeof schema>

export function FooterChat() {
	const [imageName, setImageName] = useState<string>()
	const [previewUrl, setPreviewUrl] = useState<string | null>(null)
	const [showUploadModal, setShowUploadModal] = useState(false)

	const fileInputRef = useRef<HTMLInputElement>(null)

	const { activeChannel } = useWorkGroupStore(useShallow((s) => ({ activeChannel: s.activeChannel })))
	const user = useOwnUserStore(useShallow((s) => s.user))
	const addClientMessage = useClientMessagesStore((s) => s.addClientMessage)

	const { handleSubmit, register, setValue, reset, watch, ...methods } = useForm({
		resolver: zodResolver(schema),
		mode: 'onChange'
	})

	const watchedFile = watch(FIELD_NAMES.FILE)

	const {
		websocket: { CHAT_SOCKET }
	} = useChatContext()

	const {
		formState: { errors }
	} = methods

	const errorsArray = Object.entries(errors)

	const removeAttachedImage = () => {
		setValue(FIELD_NAMES.FILE, null)
		if (previewUrl) URL.revokeObjectURL(previewUrl)

		setPreviewUrl(null)
		setImageName(undefined)
		setShowUploadModal(false)
		if (fileInputRef.current) fileInputRef.current.value = ''
	}

	const onSubmit: SubmitHandler<formData> = (data) => {
		if (!activeChannel || !user) return

		const tempId = `${Date.now()}-${Math.random().toString(36).slice(2)}`

		addClientMessage(activeChannel, {
			tempId,
			content: data[FIELD_NAMES.SEND_MESSAGE] ?? '',
			citing_message: data[FIELD_NAMES.CITING_ID],
			file: data[FIELD_NAMES.FILE],
			previewUrl: previewUrl ?? undefined
		})

		CHAT_SOCKET.sendPayload<formData & { [EXTRA_FIELDS.CHANNEL_ID]: number; [EXTRA_FIELDS.TEMP_ID]: string }>(
			WS_ACTIONS.WS_PUBLISH,
			{
				[FIELD_NAMES.SEND_MESSAGE]: data[FIELD_NAMES.SEND_MESSAGE] ?? '',
				[EXTRA_FIELDS.CHANNEL_ID]: activeChannel,
				[FIELD_NAMES.FILE]: data[FIELD_NAMES.FILE],
				[FIELD_NAMES.CITING_ID]: data[FIELD_NAMES.CITING_ID],
				[EXTRA_FIELDS.TEMP_ID]: tempId
			}
		)

		reset({
			[FIELD_NAMES.SEND_MESSAGE]: '',
			[FIELD_NAMES.CITING_ID]: null,
			[FIELD_NAMES.FILE]: undefined
		})

		setPreviewUrl(null)
		setShowUploadModal(false)
		if (fileInputRef.current) fileInputRef.current.value = ''
	}

	return (
		<FormProvider {...{ handleSubmit, register, setValue, reset, watch, ...methods }}>
			<Form.Root
				className="bg-darkBG flex relative flex-col grow gap-2w-full rounded-xl"
				onSubmit={handleSubmit(onSubmit)}
			>
				{errorsArray.length > 0 &&
					errorsArray.map(([id, value]) => {
						return (
							<h4
								className="text-red-500 bg-red-500/10 px-3 py-1.5 rounded-md text-xs font-medium absolute top-0 left-3 -translate-y-[calc(100%+0.5rem)] shadow"
								key={id}
							>
								{value?.message ?? 'Unknown'}
							</h4>
						)
					})}

				{showUploadModal && (
					<section className="absolute bottom-full mb-3 left-3 bg-darkBG border border-neutral-700 p-4 rounded-xl shadow-xl z-20 flex flex-col gap-3 min-w-[320px] items-center">
						<div className="flex items-center justify-between w-full px-3">
							<span className="text-sm font-semibold text-foreground">Attach an image</span>
							<SFButton
								type="button"
								onClick={() => setShowUploadModal(false)}
								styling="terciary"
								className="text-secondary-foreground hover:text-foreground"
							>
								<SVGPlus className="rotate-45 size-5" />
							</SFButton>
						</div>
						<ImageUploader fieldName={FIELD_NAMES.FILE} label="" enableCrop />
						{watchedFile && (
							<button
								type="button"
								onClick={() => {
									const file = watchedFile instanceof FileList ? watchedFile[0] : watchedFile
									if (!file) return

									if (previewUrl) URL.revokeObjectURL(previewUrl)
									setImageName(file.name ?? 'Image attached')
									setPreviewUrl(URL.createObjectURL(file))
									setShowUploadModal(false)
								}}
								className="w-full bg-primary hover:bg-primary-hover text-primary-foreground py-2 rounded-md font-medium text-sm transition-colors"
							>
								Confirm Attachment
							</button>
						)}
					</section>
				)}

				{previewUrl && !showUploadModal && (
					<section className="absolute bottom-0 left-0 bg-darkBG/70 -translate-y-full flex items-center gap-3 px-3 py-2 rounded-lg max-w-fit border border-neutral-700 shadow">
						<div className="relative size-12 rounded overflow-hidden">
							<img src={previewUrl} alt="Upload preview" className="size-full object-cover" />
						</div>
						<div className="flex flex-col">
							<span className="text-xs font-semibold text-foreground  max-w-44 w-full overflow-hidden text-ellipsis text-nowrap">
								{imageName}
							</span>
							<span className="text-[10px] text-secondary-foreground">Ready to send</span>
						</div>
						<button
							type="button"
							onClick={removeAttachedImage}
							className="ml-4 text-xs text-red-500 hover:text-red-400 font-medium px-2 py-1 rounded bg-red-500/10 hover:bg-red-500/20 transition-colorscursor-pointer"
						>
							Remove
						</button>
					</section>
				)}

				<section className="flex flex-row items-center gap-3 w-full px-4 py-2.5 rounded-xl border border-neutral-700">
					<SFButton
						styling="terciary"
						type="button"
						onClick={() => setShowUploadModal(!showUploadModal)}
						aria-label="Adjuntar imagen"
						className="flex justify-center items-center p-2 rounded-full h-8 w-8 min-w-8 transition-colors cursor-pointer"
					>
						<SVGPlus className="h-5 w-5 text-secondary-foreground" />
					</SFButton>

					<TextInput
						label=""
						inputName={FIELD_NAMES.SEND_MESSAGE}
						styling="ghost"
						placeholder="Write your message..."
						className="border-0! outline-0! bg-transparent text-foreground placeholder:text-secondary-foreground text-sm focus:border-0! focus:ring-0!"
						fieldClassName="w-full! max-w-none! grow! px-0! py-0!"
						type="text"
						disableErrors
					/>

					<Form.Submit type="submit" disabled={!activeChannel}>
						<SVGSendArrow className="h-5 w-5 text-secondary-foreground hover:text-primary transition-colors cursor-pointer" />
					</Form.Submit>
				</section>
			</Form.Root>
		</FormProvider>
	)
}
