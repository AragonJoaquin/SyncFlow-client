import { Form, Select } from 'radix-ui'
import { useFormContext } from 'react-hook-form'
import { InputLabelStyles } from '.'
import { SFButton } from '../SFButton'
import { SVGChevronArrow } from '../svgs'
import { FormMessageError } from './form-message-error'

interface ISelectInput {
	inputName: string
	values: Record<string, string>
	defaultVal?: string
}

//TODO: add errors + more features
export function SelectInputField({ inputName, values, defaultVal }: ISelectInput) {
	const {
		register,
		setValue,
		formState: { errors }
	} = useFormContext()

	const error = errors[inputName as keyof typeof errors]

	return (
		<>
			<Form.Field name={inputName}>
				<Select.Root
					{...register(inputName)}
					onValueChange={(e) => setValue(inputName, e)}
					defaultValue={defaultVal ?? Object.keys(values).at(0)}
				>
					<Select.Trigger asChild>
						<SFButton styling="secondary" className="text-base!  flex justify-center gap-2 ">
							<Select.Value className={InputLabelStyles} placeholder="Pick an option" />
							<Select.Icon>
								<SVGChevronArrow />
							</Select.Icon>
						</SFButton>
					</Select.Trigger>

					<Select.Portal>
						<Select.Content className="bg-darkFG border border-neutral-700 px-2 py-2 rounded-md w-fit shadow shadow-neutral-700 ">
							<Select.ScrollUpButton>
								<SVGChevronArrow />
							</Select.ScrollUpButton>
							<Select.Viewport className="w-fit flex flex-col gap-2 *:border-b *:border-b-neutral-400/50 *:hover:bg-neutral-800 *:px-2 *:py-1 cursor-pointer *:rounded-t">
								{Object.entries(values).map(([key, val]) => {
									return (
										<Select.Item key={key} value={key}>
											<Select.ItemText>{val}</Select.ItemText>
											<Select.ItemIndicator />
										</Select.Item>
									)
								})}
							</Select.Viewport>
							<Select.ScrollDownButton>
								<SVGChevronArrow />
							</Select.ScrollDownButton>
						</Select.Content>
					</Select.Portal>
				</Select.Root>
				{error != undefined && <FormMessageError error={error} />}
			</Form.Field>
		</>
	)
}
