export interface TaskFilter {
    completedQuery: boolean | null
    titleQuery: string | null
    priorityQuery: string | null
    startDateQuery: Date | null
    endDateQuery: Date | null
}
