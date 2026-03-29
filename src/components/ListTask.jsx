import { useSelector } from 'react-redux'
import Task from './Task'

/**
 * ListTask — Renders the filtered list of Task components.
 *
 * Reads tasks from the Redux store and applies the filter
 * passed via the `filter` prop ("all" | "done" | "notDone").
 *
 * Displays an empty state when no tasks match the filter.
 */
function ListTask({ filter }) {
  const tasks = useSelector((state) => state.tasks)

  // Apply filter
  const filtered = tasks.filter((task) => {
    if (filter === 'done') return task.isDone
    if (filter === 'notDone') return !task.isDone
    return true // "all"
  })

  if (filtered.length === 0) {
    return (
      <div className="flex flex-col items-center gap-2 rounded-xl border border-border-default bg-bg-elevated px-8 py-16 text-center">
        <p className="text-lg text-text-muted">No tasks found</p>
        <p className="text-sm text-text-muted/60">
          {filter === 'all'
            ? 'Add a new task to get started.'
            : 'Try changing the filter to see more tasks.'}
        </p>
      </div>
    )
  }

  return (
    <ul className="flex flex-col gap-3" role="list">
      {filtered.map((task) => (
        <Task key={task.id} task={task} />
      ))}
    </ul>
  )
}

export default ListTask
