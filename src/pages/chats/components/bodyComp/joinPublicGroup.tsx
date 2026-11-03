import { DumbInput } from '@/components/input'
import { SVGChevronArrow } from '@/components/svgs'
import { debouncer } from '@/utils'
import { ScrollArea } from 'radix-ui'
import { useRef } from 'react'
import { PublicGroupResults } from './publicGroupResults'
import { usePublicGroupSearch } from './usePublicGroupSearch'

export function FormPublicGroup() {
	const { fieldInput, setFieldInput, groups, hasMore, isPending, getMoreResults, joinGroup } = usePublicGroupSearch()

	const inputRef = useRef<HTMLInputElement>({} as HTMLInputElement)

	const debouncedSetInput = useRef<ReturnType<typeof debouncer> | null>(null)

	// lazily initialize
	if (!debouncedSetInput.current) {
		debouncedSetInput.current = debouncer((value: string) => {
			setFieldInput(value)
		}, 300) as ReturnType<typeof debouncer>
	}

	return (
		<form className="w-full h-full flex flex-col gap-3 relative" onSubmit={(e) => e.preventDefault()}>
			<fieldset className="relative shrink-0">
				<DumbInput
					ref={inputRef}
					type="text"
					className="w-full! py-2!"
					styling="ghost"
					placeholder="Search by group name (at least 3 characters)"
					opts={{
						onChange: (e) => debouncedSetInput.current?.(e.currentTarget.value ?? '')
					}}
				/>
				<SVGChevronArrow className="absolute top-0 right-2 translate-y-1.5" />
			</fieldset>
			<div className="relative flex-1 min-h-[225px] w-full">
				<ScrollArea.Root className="size-full absolute inset-0 flex flex-col overflow-hidden">
					<ScrollArea.Viewport className="size-full rounded pr-2">
						<PublicGroupResults
							fieldInput={fieldInput}
							groups={groups}
							hasMore={hasMore}
							isPending={isPending}
							onJoin={joinGroup}
							onLoadMore={getMoreResults}
						/>
					</ScrollArea.Viewport>

					<ScrollArea.Scrollbar
						className="flex touch-none select-none bg-zinc-700/70 p-0.5 transition-colors duration-160 ease-out hover:bg-zinc-700/30 w-2.5"
						orientation="vertical"
					>
						<ScrollArea.Thumb className="relative flex-1 rounded-[10px] bg-zinc-500 before:absolute before:left-1/2 before:top-1/2 before:size-full before:min-h-11 before:min-w-11 before:-translate-x-1/2 before:-translate-y-1/2" />
					</ScrollArea.Scrollbar>
					<ScrollArea.Corner />
				</ScrollArea.Root>
			</div>
		</form>
	)
}
