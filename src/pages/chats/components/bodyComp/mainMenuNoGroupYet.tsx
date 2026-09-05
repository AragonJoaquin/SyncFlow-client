import { SFButton, SFDialog } from '@/components'
import { SVGSearch, SVGSettings, SVGUsers } from '@/components/svgs'
import { Separator } from 'radix-ui'
import { CreateGroupForm } from './createGroup'
import { JoiningFormDialog } from './joinGroup'

export function MainMenuNoGroup() {
	return (
		<main className="flex flex-col gap-y-3 justify-center items-center bg-darkFG w-full">
			{/*you dont belong to a group... yet*/}

			<span className="flex flex-col gap-y-4 items-center">
				<div className="flex flex-col items-center gap-y-2">
					<h3 className="text-3xl md:text-4xl font-semibold font-Cabin text-primaryText">Welcome back!</h3>
					<p className="text-lg md:text-xl text-center">Don't be missed out and join a work group!</p>
				</div>

				{/*TODO: make a link for referencing on how making your own group*/}
				<span className="flex flex-row items-center gap-2">
					<SFDialog
						title="Join a group"
						description="Ask an admin about the group name & password or create your own group"
						trigger={<SFButton styling="primary">Join Group</SFButton>}
					>
						<JoiningFormDialog />
					</SFDialog>

					<p className="font-bold"> or </p>

					<SFDialog
						title="Create your own group"
						description="Start creating your own group for a new experience blah blah blah scheisse"
						trigger={
							<SFButton styling="secondary" className="font-semibold!">
								Create Group
							</SFButton>
						}
					>
						<CreateGroupForm />
					</SFDialog>
				</span>
			</span>
			<Separator.Root decorative className="bg-neutral-700! h-0.5! w-[50%]!" />

			<p className="text-unfocused text-pretty text-center">Or start tinkering with these buttons!</p>

			<ul className="flex flex-row gap-4 bg-neutral-800/40 px-2  py-2 rounded-lg *:bg-neutral-800 *:rounded-md *:p-2 *:hover:scale-105 *:transition-all *:hover:bg-neutral-700 *:cursor-pointer">
				<li>
					<SVGUsers />
				</li>
				<li>
					<SVGSettings />
				</li>
				<li>
					<SVGSearch />
				</li>
			</ul>
		</main>
	)
}
