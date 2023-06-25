interface TaskDto {
    title: string
    description: string | null
    deadline: Date
    converted_is_notified: Boolean
    converted_task_priority_id: number
    profile_id: number
}
