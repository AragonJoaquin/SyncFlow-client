import { Redirect, Route, Switch } from 'wouter'
import { useShallow } from 'zustand/shallow'
import { SFSkeleton } from './components/SFSkeleton'
import { SFToastRoot } from './components/SFToast'
import { ChatProvider } from './context'
import { useGlobalContext } from './context/globalContext'
import { AuthPage } from './pages/auth'
import { ChatPage } from './pages/chats/chats'
import { NotFoundPage } from './pages/not-found'
import { useOwnUserStore } from './store/userStore'

export default function App() {
	const user = useOwnUserStore(useShallow((s) => s.user))
	const { pendingUserGroups } = useGlobalContext()

	if (pendingUserGroups) {
		return (
			<main className="min-h-screen h-screen w-full bg-darkBG font-OpenSans text-whiteText flex flex-col items-center justify-center gap-6">
				<div className="flex flex-col items-center gap-2">
					<SFSkeleton className="w-16 h-16 rounded-full" />
					<h3 className="text-xl font-semibold text-whiteText font-OpenSans mt-2">Loading SyncFlow...</h3>
					<p className="text-sm text-neutral-400 font-Cabin">Authenticating and loading your profile</p>
				</div>
				<div className="w-64 flex flex-col gap-3 mt-4">
					<SFSkeleton className="w-full h-10 rounded-lg" />
					<SFSkeleton className="w-3/4 h-8 rounded-lg mx-auto" />
				</div>
				<SFToastRoot />
			</main>
		)
	}

	return (
		<main className="min-h-screen h-screen w-full bg-darkBG font-OpenSans text-whiteText">
			<Switch>
				<Route
					path="/"
					component={() =>
						user != null ? (
							<ChatProvider>
								<ChatPage />
							</ChatProvider>
						) : (
							<Redirect to="/auth" />
						)
					}
				/>
				<Route path="/auth" component={() => (user ? <Redirect to="/" /> : <AuthPage />)} />

				<Route component={NotFoundPage} />
			</Switch>

			<SFToastRoot />
		</main>
	)
}
