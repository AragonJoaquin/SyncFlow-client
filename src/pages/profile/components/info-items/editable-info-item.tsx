import { useState } from 'react'
import { UserInfoItem } from './user-info-item'
import { PopUpEdit } from './pop-up-edit-form'
export function EditableInfoItem({
	label,
	value,
	children,
	formId
}: {
	label: string
	value: string
	children: React.ReactNode
	formId: string
}) {
	const [isEditing, setIsEditing] = useState(false)

	return (
		<>
			<UserInfoItem infoName={label} infoValue={value} setIsEditing={setIsEditing} />
			{isEditing && (
				<PopUpEdit close={() => setIsEditing(false)} formId={formId}>
					{children}
				</PopUpEdit>
			)}
		</>
	)
}
