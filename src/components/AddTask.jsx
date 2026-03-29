import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { addTask } from '../redux/tasksSlice'

/**
 * AddTask — Form component for adding new tasks.
 *
 * Dispatches the `addTask` Redux action on valid submission.
 * Validates that the description is not empty before dispatching.
 */
function AddTask() {
  const dispatch = useDispatch()
  const [description, setDescription] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    const trimmed = description.trim()

    // Validation: description must not be empty
    if (!trimmed) {
      setError('Task description is required')
      return
    }

    dispatch(addTask(trimmed))
    setDescription('')
    setError('')
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-3 rounded-xl border border-border-default bg-bg-elevated p-5 shadow-card animate-card-in"
      noValidate
    >
      <label
        htmlFor="new-task"
        className="text-xs font-medium uppercase tracking-widest text-text-muted"
      >
        New Task
      </label>
      <div className="flex gap-3">
        <input
          id="new-task"
          type="text"
          value={description}
          onChange={(e) => {
            setDescription(e.target.value)
            if (error) setError('')
          }}
          placeholder="What needs to be done\u2026"
          autoComplete="off"
          className="min-w-0 flex-1 rounded-lg border border-border-default bg-bg-input px-4 py-2.5 text-sm text-text-primary placeholder:text-text-muted transition-border-color duration-150 focus-visible:border-accent focus-visible:outline-none"
        />
        <button
          type="submit"
          className="cursor-pointer shrink-0 rounded-lg bg-accent px-5 py-2.5 text-sm font-semibold text-bg touch-manipulation transition-[opacity,transform] duration-150 hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent active:scale-[0.97]"
        >
          Add Task
        </button>
      </div>
      {error && (
        <p className="text-xs text-[#ef4444]">{error}</p>
      )}
    </form>
  )
}

export default AddTask
