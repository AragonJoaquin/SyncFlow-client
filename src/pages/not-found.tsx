import { SFButton } from '@/components'
import { Link } from 'wouter'

export function NotFoundPage() {
	return (
		<main className="min-h-screen flex items-center justify-center p-4 bg-darkBG">
			<article className="text-center max-w-md">
				<header className="mb-6">
					<p className="text-8xl font-bold text-primary font-Cabin">404</p>
					<h1 className="text-2xl font-semibold text-whiteText mt-2">Page Not Found</h1>
				</header>

				<p className="text-foreground/70 mb-8">The page you're looking for doesn't exist or has been moved.</p>

				<nav>
					<Link href="/">
						<SFButton styling="primary">Go to Home</SFButton>
					</Link>
				</nav>
			</article>
		</main>
	)
}
