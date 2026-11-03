import { useChatContext } from '@/context'
import { SFButton } from './SFButton'

/**
 * Persistent connection hint. It appears when the socket is down, shows the
 * automatic reconnect attempt, and lets the user skip the remaining backoff.
 */
export function SFConnectionBanner() {
	const {
		websocket: { isConnected, isReconnecting, reconnectAttempt, hasConnected, reconnectNow }
	} = useChatContext()

	// Don't flash a banner during the initial connection attempt.
	if (isConnected || (!hasConnected && !isReconnecting)) return null

	const title = hasConnected ? "You're disconnected" : "Can't reach SyncFlow"
	const description = isReconnecting
		? `Trying to reconnect${reconnectAttempt > 1 ? ` (attempt ${reconnectAttempt})` : ''}… Messages can't be sent until the connection is back.`
		: 'The connection was lost. Retry to keep receiving messages.'

	return (
		<aside
			role="status"
			aria-live="polite"
			className="fixed top-3 left-1/2 z-[200] flex w-[min(540px,calc(100vw-1.5rem))] -translate-x-1/2 items-center gap-3 rounded-xl border border-amber-500/40 bg-neutral-900/95 px-4 py-3 shadow-lg shadow-black/40 backdrop-blur-xl"
		>
			<span
				className={`h-2.5 w-2.5 shrink-0 rounded-full ${isReconnecting ? 'animate-pulse bg-amber-400' : 'bg-red-500'}`}
			/>

			<div className="flex min-w-0 flex-1 flex-col">
				<p className="text-sm font-semibold text-whiteText font-OpenSans">{title}</p>
				<p className="text-xs text-unfocused font-Cabin">{description}</p>
			</div>

			<SFButton
				styling="secondary"
				type="button"
				className="shrink-0 px-3! py-1! min-w-0! text-xs!"
				onClick={reconnectNow}
			>
				Retry now
			</SFButton>
		</aside>
	)
}
