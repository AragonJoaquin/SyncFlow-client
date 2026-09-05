import { Tabs } from 'radix-ui'
import { FormPrivateGroup } from './joinPrivateGroup'
import { FormPublicGroup } from './joinPublicGroup'

const GROUP_FORM_TABS = {
	PUBLIC: 'Public',
	PRIVATE: 'Private'
} as const

export function JoiningFormDialog() {
	return (
		<Tabs.Root className="flex flex-col gap-y-3 w-full h-full">
			<Tabs.List
				defaultValue={GROUP_FORM_TABS.PUBLIC}
				className="flex justify-evenly *:border-2 *:border-neutral-800/70 gap-x-1 *:data-[state=active]:bg-neutral-800 *:w-full *:py-1 *:rounded-lg *:hover:bg-neutral-900"
			>
				<Tabs.Trigger value={GROUP_FORM_TABS.PUBLIC}>{GROUP_FORM_TABS.PUBLIC}</Tabs.Trigger>
				<Tabs.Trigger value={GROUP_FORM_TABS.PRIVATE}>{GROUP_FORM_TABS.PRIVATE}</Tabs.Trigger>
			</Tabs.List>

			<span className="flex grow w-full justify-center relative max-h-[200px] h-[200px] min-h-[200px]">
				{/* join public */}
				<Tabs.Content value={GROUP_FORM_TABS.PUBLIC} asChild>
					<FormPublicGroup />
				</Tabs.Content>

				{/* join private*/}
				<Tabs.Content value={GROUP_FORM_TABS.PRIVATE} asChild>
					<FormPrivateGroup />
				</Tabs.Content>
			</span>
		</Tabs.Root>
	)
}
