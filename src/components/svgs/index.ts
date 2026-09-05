import type { SVGProps } from 'react'

export * from './arrow-chevron'
export * from './circle-plus'
export * from './edit'
export * from './hamburger'
export * from './hashtag'
export * from './mention'
export * from './no-chats'
export * from './pen'
export * from './photo'
export * from './pin'
export * from './plus'
export * from './search'
export * from './send-arrow'
export * from './settings'
export * from './sleep'
export * from './trash'
export * from './users'

type svgProps = SVGProps<SVGSVGElement>
export type SVGInterface = {
	[K in keyof svgProps]: svgProps[K]
}
