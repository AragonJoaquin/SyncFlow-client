import type { User } from '@/types'
import { useOwnUserStore } from '@/store/userStore'
import { CollapsibleList, EditUserForm, EditableAvatar } from './components'

export function Profile({ user }: { user: User }) {
	const { setUser } = useOwnUserStore()

	const handleAvatarUpdate = (updatedUser: User) => {
		setUser(updatedUser)
	}

	return (
		<section className="flex flex-col items-center">
			<EditableAvatar user={user} onAvatarUpdate={handleAvatarUpdate} />
			<CollapsibleList name="Datos del usuario">
				<EditUserForm user={user} />
			</CollapsibleList>
		</section>
	)
}