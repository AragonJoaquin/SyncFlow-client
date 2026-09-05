import type { UUIDv4 } from '.'

export type ActivityUser = {
    group_id: number
    activity_id: UUIDv4
    user_id: UUIDv4

    joined_at: Date
    left_at?: Date
}

export type ActivityGroup = {
    group_id: number
    activity_id: UUIDv4

    started_at: Date
    started_by: UUIDv4

    body: any // TODO: define activity body type
}
