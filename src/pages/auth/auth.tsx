import { APP_NAME } from '@/utils'
import { Tabs } from 'radix-ui'
import { LoginForm, RegisterForm } from './components'

const TABS_PAGES = {
	LOGIN_TAB: 'login_tab',
	REGISTER_TAB: 'register_tab'
} as const

export function AuthPage() {
	return (
		<section className="min-h-screen flex items-center justify-center p-3 sm:p-4 relative overflow-hidden">
			<article className="flex flex-col w-full max-w-[320px] xs:max-w-sm sm:max-w-md animate-fade-in">
				<span className="flex flex-col gap-1 text-center mb-6 sm:mb-8">
					<h2 className="text-4xl xs:text-5xl sm:text-5xl font-bold text-primary font-Cabin mb-1 sm:mb-2">
						{APP_NAME}
					</h2>
					<p className="text-sm md:text-lg text-foreground/70">Connect, Share and Synchronize</p>
				</span>

				<div className="bg-card rounded-xl sm:rounded-2xl shadow-card p-4 sm:p-6 border border-neutral-600">
					<Tabs.Root defaultValue={TABS_PAGES.LOGIN_TAB}>
						<Tabs.List className="flex gap-1 p-1 bg-darkFG rounded-lg sm:rounded-xl mb-4 sm:mb-6">
							<Tabs.Trigger
								value={TABS_PAGES.LOGIN_TAB}
								className="flex-1 py-2 px-2 sm:py-2.5 sm:px-4 rounded-md sm:rounded-lg text-xs sm:text-sm font-semibold font-Cabin text-secondary-foreground transition-all duration-200 data-[state=active]:bg-neutral-700/70 data-[state=active]:text-primary data-[state=active]:shadow-sm"
							>
								Log In
							</Tabs.Trigger>
							<Tabs.Trigger
								value={TABS_PAGES.REGISTER_TAB}
								className="flex-1 py-2 px-2 sm:py-2.5 sm:px-4 rounded-md sm:rounded-lg text-xs sm:text-sm font-semibold font-Cabin text-secondary-foreground transition-all duration-200 data-[state=active]:bg-neutral-700/70 data-[state=active]:text-primary data-[state=active]:shadow-sm"
							>
								Register
							</Tabs.Trigger>
						</Tabs.List>

						<Tabs.Content value={TABS_PAGES.LOGIN_TAB}>
							<LoginForm />
						</Tabs.Content>

						<Tabs.Content value={TABS_PAGES.REGISTER_TAB}>
							<RegisterForm />
						</Tabs.Content>
					</Tabs.Root>
				</div>

				<p className="text-center text-xs sm:text-sm text-foreground/50 mt-4 sm:mt-6 leading-relaxed">
					By continuing, you agree to our{' '}
					<span className="text-primary cursor-pointer hover:underline">Terms and Privacy Policy</span>
				</p>
			</article>
		</section>
	)
}
