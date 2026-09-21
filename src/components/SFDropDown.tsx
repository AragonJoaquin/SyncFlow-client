import { DropdownMenu } from 'radix-ui'
import type { MouseEvent, ReactNode } from 'react'
import { SVGMention } from './svgs'

const STYLES_AVAILABLE = {
	DELETE: 'delete',
	NORMAL: 'normal'
}

type SFDDItems = {
	name: string
	//more easy
	SVG?: typeof SVGMention
	style?: (typeof STYLES_AVAILABLE)[keyof typeof STYLES_AVAILABLE]
	onClick: (e?: MouseEvent<HTMLDivElement>) => void
}

interface ISFDrop {
	children: ReactNode
	elements: Record<string, SFDDItems[]>
}
export function SFDropDown({ children, elements }: ISFDrop) {
	return (
		<DropdownMenu.Root>
			<DropdownMenu.Trigger asChild>{children}</DropdownMenu.Trigger>

			<DropdownMenu.Portal>
				<DropdownMenu.Content
					className="min-w-[260px] bg-darkFG rounded-xl p-4 border border-zinc-700 shadow-xl animate-in fade-in zoom-in duration-200"
					sideOffset={5}
				>
					{Object.entries(elements)?.map(([keyName, values]) => {
						return (
							<section key={`${keyName}`}>
								<span className="flex items-center my-2">
									<div className="flex-grow h-[1px] bg-zinc-600"></div>
									<h6 className="px-3 text-[12px] text-zinc-400 font-semibold font-OpenSans">{keyName}</h6>
									<div className="flex-grow h-[1px] bg-zinc-600"></div>
								</span>

								{values?.map(({ name, SVG, style = 'normal', onClick }) => (
									<DropdownMenu.Item
										className={`
                                            min-h-[40px] relative
                                            flex items-center justify-between px-4 py-3 mb-2 text-white outline-none 
                                            cursor-pointer border border-zinc-600 rounded-2xl transition-colors font-OpenSans
                                            ${style === STYLES_AVAILABLE.DELETE ? 'bg-red-800 hover:bg-red-700 justify-center' : 'hover:bg-zinc-800 bg-darkBG'}`}
										key={name}
										onClick={(e) => {
											e.preventDefault()
											onClick(e)
										}}
									>
										<span className="font-semibold text-sm">{name}</span>

										{SVG && (
											<SVG
												className={`${style === STYLES_AVAILABLE.DELETE ? 'text-whiteText' : 'text-zinc-400'} absolute right-2 top-1/2 -translate-y-1/2`}
											/>
										)}
									</DropdownMenu.Item>
								))}
							</section>
						)
					})}
					<DropdownMenu.Arrow className="fill-darkBG size-4" />
				</DropdownMenu.Content>
			</DropdownMenu.Portal>
		</DropdownMenu.Root>
	)
}
