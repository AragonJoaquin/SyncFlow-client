interface ISFTipCard {
	className?: string

	title: string
	description: string
	shortcut?: string
}
export function SFTipCard({ className, title, description, shortcut }: ISFTipCard) {
	return (
		<section
			className={`p-4 min-w-[280px] max-w-[280px] min-h-[70px] max-h-[70px] border border-primaryText/10 rounded-lg bg-white/5 flex flex-row items-start justify-between ${className}`}
		>
			<span className="flex flex-col justify-center items-start grow">
				<h5 className="text-sm font-medium text-primary">{title}</h5>
				<p className="text-xs text-whiteText ">{description}</p>
			</span>

			{shortcut && (
				<kbd className="mt-2 px-2 py-1 text-[10px] rounded bg-primaryText/10 border border-primaryText/20">
					{shortcut}
				</kbd>
			)}
		</section>
	)
}
