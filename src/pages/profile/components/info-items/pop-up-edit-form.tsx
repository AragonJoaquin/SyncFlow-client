import * as Form from '@radix-ui/react-form'
import { cloneElement, isValidElement } from 'react'

export function PopUpEdit({
	children,
	close,
	formId
}: {
	children: React.ReactNode
	close: () => void
	formId: string
}) {
	const childrenWithClose = isValidElement(children) ? cloneElement(children as React.ReactElement<{ close: () => void }>, { close }) : children

	return (
		<article className="absolute top-0 left-0 h-screen w-screen bg-black/50 flex items-center justify-center">
			<div className="relative bg-card p-6 w-full sm:w-[80%] sm:max-w-[500px] rounded-md shadow-card">
				{childrenWithClose}
				<div className="flex justify-center gap-4">
					<button
						type="button"
						className="bg-secondary text-secondary-foreground font-bold py-3 text-2xl rounded-md w-1/2"
						onClick={() => close()}
					>
						Cancelar
					</button>
					<Form.Submit asChild>
						<button
							type="submit"
							form={formId}
							className="bg-primary text-primary-foreground font-bold py-3 text-2xl rounded-md w-1/2"
						>
							Confirmar
						</button>
					</Form.Submit>
				</div>
			</div>
		</article>
	)
}
