export * from './Activity'
export * from './Category'
export * from './Channel'
export * from './FileRepo'
export * from './Message'
export * from './PinnedMessage'
export * from './User'
export * from './WorkGroup'

export type UUIDv4 = `${string}-${string}-${string}-${string}`
export type Email = `${string}@${string}.${'com' | 'org' | 'net' | 'edu' | 'gov'}`
export type FileURL = `http${'s' | ''}://${string}`
