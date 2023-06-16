interface UserInterface {
    profile_id?: number
    email: string
    username: string
    password: string
}

interface TaskInterface {
    task_id?: number
    title: string
    description: string
    deadline: Date
    is_completed: boolean
    notify_user: boolean
    task_priority_id: number
    parent_task_id?: number
}

enum priority {
    low,
    mid,
    high,
}
interface TaskPriorityInterface {
    task_priority_id: number
    priority: priority
}

interface AttachmentInterface {
    attachment_id: number
    task_id: number
    attachment_name: string
    attachment_data: Blob | Uint8Array
}
