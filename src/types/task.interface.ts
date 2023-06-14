export interface TaskFilter {
    completedQuery: boolean | null
    titleQuery: string | null
    priorityQuery: number | null
    startDateQuery: Date | null
    endDateQuery: Date | null
}
