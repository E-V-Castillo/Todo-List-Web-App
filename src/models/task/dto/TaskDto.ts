interface TaskDto {
    title: string
    description: string | null
    deadline: Date
    is_notified: Boolean
    task_priority_id: number
    profile_id: number
}
