import { SVGEdit } from "@/components/svgs";

export function UserInfoItem({
	infoName,
	infoValue,
	setIsEditing,
}: {
	infoName: string;
	infoValue: string;
	setIsEditing: (value: boolean) => void;
}) {
	return (
		<div className="flex justify-between items-center w-full px-4 py-3 cursor-pointer">
			<div>
				<h3>{infoName}</h3>
				<p className="font-bold text-2xl">{infoValue}</p>
			</div>
			<button
				type="button"
				className="cursor-pointer p-1 rounded hover:bg-neutral-700 transition-colors text-unfocused hover:text-whiteText"
				onClick={(e) => {
					e.preventDefault();
					setIsEditing(true);
				}}
				aria-label={`Edit ${infoName}`}
			>
				<SVGEdit className="w-4 h-4" />
			</button>
		</div>
	);
}
