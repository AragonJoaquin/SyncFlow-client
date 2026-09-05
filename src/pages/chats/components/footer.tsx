import { WS_ACTIONS } from '@/api'
import { SFButton } from '@/components'
import { ImageUploader, TextInput } from '@/components/input'
import { SVGPlus, SVGSendArrow } from '@/components/svgs'
import { useChatContext } from '@/context'
import { useWorkGroupStore } from '@/store'
import { ZOD_VALIDATE_FILE } from '@/utils'
import { zodResolver } from '@hookform/resolvers/zod'
import { Form } from 'radix-ui'
import { useRef } from 'react'
import { FormProvider, useForm, type SubmitHandler } from 'react-hook-form'
import z from 'zod'

const EXTRA_FIELDS = {
	CHANNEL_ID: 'channel_id'
} as const

const FIELD_NAMES = {
	SEND_MESSAGE: 'content',
	CITING_ID: 'citing_id',
	FILE: 'file'
} as const

const schema = z
	.object({
		[FIELD_NAMES.SEND_MESSAGE]: z.string(),
		[FIELD_NAMES.CITING_ID]: z.number().nullable(),
		[FIELD_NAMES.FILE]: ZOD_VALIDATE_FILE().nullable()
	})
	.refine((e) => e[FIELD_NAMES.SEND_MESSAGE] || e[FIELD_NAMES.FILE], 'Cannot send an empty message')

type formData = z.infer<typeof schema>

export function FooterChat() {
	const fileInputRef = useRef<HTMLInputElement>(null)

	const activeChannel = useWorkGroupStore((s) => s.activeChannel)

	const { handleSubmit, register, setValue, reset, ...methods } = useForm({
		resolver: zodResolver(schema),
		mode: 'onChange'
	})

	const {
		websocket: { CHAT_SOCKET }
	} = useChatContext()

	const {
		formState: { errors }
	} = methods

	const errorsArray = Object.entries(errors)

	const removeAttachedImage = () => {
		setValue(FIELD_NAMES.FILE, null)
		if (fileInputRef.current) fileInputRef.current.value = ''
	}

	const onSubmit: SubmitHandler<formData> = (data) => {
		if (!activeChannel) return

		CHAT_SOCKET.sendPayload<formData & { [EXTRA_FIELDS.CHANNEL_ID]: number }>(WS_ACTIONS.WS_PUBLISH, {
			[FIELD_NAMES.SEND_MESSAGE]: data[FIELD_NAMES.SEND_MESSAGE] ?? '',
			[EXTRA_FIELDS.CHANNEL_ID]: activeChannel,
			[FIELD_NAMES.FILE]: data[FIELD_NAMES.FILE],
			[FIELD_NAMES.CITING_ID]: data[FIELD_NAMES.CITING_ID]
		})
		reset({
			[FIELD_NAMES.SEND_MESSAGE]: '',
			[FIELD_NAMES.CITING_ID]: null,
			[FIELD_NAMES.FILE]: undefined
		})
		removeAttachedImage()
	}

	return (
		<FormProvider {...{ handleSubmit, register, setValue, reset, ...methods }}>
			<Form.Root
				className="bg-darkBG flex relative flex-row justify-center grow gap-4 items-center w-full"
				onSubmit={handleSubmit(onSubmit)}
			>
				{errorsArray.length > 0 &&
					errorsArray.map(([_, value]) => {
						return (
							<h4 className="text-red-600 bg-red-500/20 px-2 py-1 rounded absolute top-0 left-0 -translate-y-[calc(100%+1.5ch)]">
								{value?.message ?? 'Unknown'}
							</h4>
						)
					})}
				<span>
					<ImageUploader fieldName={FIELD_NAMES.FILE} />
				</span>

				{/* {attachedImage ? ( */}
				{/* 	<span className="relative flex items-center"> */}
				{/* 		<img */}
				{/* 			src={`data:image/jpeg;base64,${attachedImage}`} */}
				{/* 			alt="Image" */}
				{/* 			className="h-10 w-10 object-cover shadow shadow-neutral-600 bg-neutral-800 rounded-md" */}
				{/* 		/> */}
				{/* 		<SFButton */}
				{/* 			styling="none" */}
				{/* 			onClick={removeAttachedImage} */}
				{/* 			className="absolute -top-1 -right-1 bg-red-500 rounded-full p-0.5!" */}
				{/* 			aria-label="Eliminar imagen" */}
				{/* 		> */}
				{/* 			<SVGTrash className="h-3 w-3 text-white" /> */}
				{/* 		</SFButton> */}
				{/* 	</span> */}
				{/* ) : ( */}
				<SFButton
					styling="terciary"
					onClick={() => fileInputRef.current?.click()}
					aria-label="Adjuntar imagen"
					className="flex justify-center items-center"
				>
					<SVGPlus className="min-h-6 min-w-6 h-7 w-7" />
				</SFButton>
				{/* )} */}

				<TextInput
					label=""
					inputName={FIELD_NAMES.SEND_MESSAGE}
					styling="ghost"
					placeholder="Write your message..."
					className={`border-0! outline-0! transition-all ${errorsArray.length == 0 ? 'ring-0!' : 'ring-2! ring-red-600/50!'}`}
					fieldClassName="w-full! max-w-none! grow! px-2! py-1!"
					type="text"
					disableErrors
				/>

				<Form.Submit type="submit" disabled={!activeChannel}>
					<SVGSendArrow className="min-h-6 min-w-6 h-7 w-7" />
				</Form.Submit>
			</Form.Root>
		</FormProvider>
	)
}
