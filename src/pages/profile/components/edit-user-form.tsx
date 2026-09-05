import { EditAlias, EditDescription, EditEmail, EditName } from '@/components/input'
import type { User } from '@/types'
import { EditableInfoItem } from './info-items'

export function EditUserForm({ user }: { user: User }) {
	return (
		<ul>
			<li>
				<EditableInfoItem label="Nombre" value={user.name} formId="edit-name-form">
					<EditName value={user.name} inputName="name" formId="edit-name-form" />
				</EditableInfoItem>

				<EditableInfoItem label="Email" value={user.email} formId="edit-email-form">
					<EditEmail value={user.email} inputName="email" formId="edit-email-form" />
				</EditableInfoItem>

				<EditableInfoItem label="Descripción" value={user.description || ''} formId="edit-description-form">
					<EditDescription value={user.description || ''} inputName="description" formId="edit-description-form" />
				</EditableInfoItem>

				<EditableInfoItem label="Alias" value={user.alias_name || ''} formId="edit-alias-form">
					<EditAlias value={user.alias_name || ''} inputName="alias_name" formId="edit-alias-form" />
				</EditableInfoItem>
			</li>
		</ul>
	)
}
