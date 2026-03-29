import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { toggleTask, editTask, deleteTask } from '../redux/tasksSlice'

/**
 * Task — Displays a single task with actions.
 *
 * Features:
 *  - Toggle isDone via checkbox (dispatches toggleTask)
 *  - Inline edit mode (dispatches editTask)
 *  - Delete with confirmation (dispatches deleteTask)
 *  - Visual distinction: completed tasks are dimmed with strikethrough
 */
function Task({ task }) {
  const dispatch = useDispatch()
  const [isEditing, setIsEditing] = useState(false)
  const [editValue, setEditValue] = useState(task.description)
  const [editError, setEditError] = useState('')
  const [showConfirm, setShowConfirm] = useState(false)

  /** Handle saving edited description. */
  const handleSave = () => {
    const trimmed = editValue.trim()
    if (!trimmed) {
      setEditError('Description cannot be empty')
      return
    }
    dispatch(editTask({ id: task.id, description: trimmed }))
    setIsEditing(false)
    setEditError('')
  }

  /** Handle cancel editing — revert to original. */
  const handleCancel = () => {
    setEditValue(task.description)
    setIsEditing(false)
    setEditError('')
  }

  /** Handle keyboard submit in edit mode. */
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSave()
    if (e.key === 'Escape') handleCancel()
  }

  /** Handle confirmed delete. */
  const confirmDelete = () => {
    dispatch(deleteTask(task.id))
    setShowConfirm(false)
  }

  return (
    <li
      className={`group flex items-start gap-4 rounded-xl border bg-bg-elevated p-5 transition-[border-color,opacity] duration-200 ${
        task.isDone
          ? 'border-border-default opacity-60'
          : 'border-border-default hover:border-border-hover'
      }`}
    >
      {/* Checkbox */}
      <label className="relative mt-0.5 flex shrink-0 cursor-pointer">
        <input
          type="checkbox"
          checked={task.isDone}
          onChange={() => dispatch(toggleTask(task.id))}
          aria-label={`Mark "${task.description}" as ${task.isDone ? 'incomplete' : 'complete'}`}
          className="peer h-5 w-5 cursor-pointer appearance-none rounded-md border-2 border-border-hover bg-transparent transition-[border-color,background-color] duration-150 checked:border-accent checked:bg-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        />
        <svg
          className="pointer-events-none absolute inset-0 h-5 w-5 text-bg opacity-0 peer-checked:opacity-100 transition-opacity duration-150"
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true"
        >
          <path
            fillRule="evenodd"
            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
            clipRule="evenodd"
          />
        </svg>
      </label>

      {/* Task content */}
      <div className="flex min-w-0 flex-1 flex-col gap-1">
        {isEditing ? (
          /* ── Edit Mode ──────────────────────────────── */
          <div className="flex flex-col gap-2">
            <input
              type="text"
              value={editValue}
              onChange={(e) => {
                setEditValue(e.target.value)
                if (editError) setEditError('')
              }}
              onKeyDown={handleKeyDown}
              autoFocus
              className="rounded-lg border border-accent-border bg-bg-input px-3 py-2 text-sm text-text-primary transition-border-color duration-150 focus-visible:border-accent focus-visible:outline-none"
              aria-label="Edit task description"
            />
            {editError && (
              <p className="text-xs text-[#ef4444]">{editError}</p>
            )}
            <div className="flex gap-2">
              <button
                type="button"
                onClick={handleSave}
                className="cursor-pointer rounded-md bg-accent px-3 py-1.5 text-xs font-semibold text-bg transition-opacity duration-150 hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-accent"
              >
                Save
              </button>
              <button
                type="button"
                onClick={handleCancel}
                className="cursor-pointer rounded-md border border-border-default px-3 py-1.5 text-xs font-medium text-text-muted transition-[border-color,color] duration-150 hover:border-border-hover hover:text-text-secondary focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-accent"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          /* ── Display Mode ───────────────────────────── */
          <p
            className={`text-sm leading-relaxed ${
              task.isDone ? 'line-through text-text-muted' : 'text-text-primary'
            }`}
          >
            {task.description}
          </p>
        )}
      </div>

      {/* Actions (hidden in edit mode) */}
      {!isEditing && (
        <div className="flex shrink-0 items-center gap-1">
          <button
            type="button"
            onClick={() => setIsEditing(true)}
            className="cursor-pointer rounded-md px-2.5 py-1.5 text-xs font-medium text-text-muted transition-[color,background-color] duration-150 hover:bg-bg-subtle hover:text-text-primary focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-accent"
            aria-label={`Edit "${task.description}"`}
          >
            Edit
          </button>
          <button
            type="button"
            onClick={() => setShowConfirm(true)}
            className="cursor-pointer rounded-md px-2.5 py-1.5 text-xs font-medium text-text-muted transition-[color,background-color] duration-150 hover:bg-danger-bg hover:text-danger focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-accent"
            aria-label={`Delete "${task.description}"`}
          >
            Delete
          </button>
        </div>
      )}

      {/* Delete confirmation modal */}
      {showConfirm && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-bg/70 backdrop-blur-sm animate-fade-in"
          role="alertdialog"
          aria-labelledby="confirm-title"
          aria-describedby="confirm-desc"
        >
          <div
            className="mx-4 flex w-full max-w-sm flex-col gap-4 rounded-xl border border-border-default bg-bg-elevated p-6 shadow-card animate-card-in"
            style={{ overscrollBehavior: 'contain' }}
          >
            <h3 id="confirm-title" className="text-base font-semibold">
              Delete Task
            </h3>
            <p id="confirm-desc" className="text-sm text-text-secondary">
              Are you sure you want to delete this task? This action cannot be undone.
            </p>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={confirmDelete}
                className="cursor-pointer rounded-lg bg-danger px-5 py-2 text-sm font-semibold text-white touch-manipulation transition-opacity duration-150 hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-danger"
              >
                Delete
              </button>
              <button
                type="button"
                onClick={() => setShowConfirm(false)}
                className="cursor-pointer rounded-lg border border-border-default bg-transparent px-5 py-2 text-sm font-medium text-text-secondary touch-manipulation transition-[border-color,color] duration-150 hover:border-border-hover hover:text-text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </li>
  )
}

export default Task
