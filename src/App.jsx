import { useState } from 'react'
import { useSelector } from 'react-redux'
import AddTask from './components/AddTask'
import ListTask from './components/ListTask'

/**
 * App — Root component.
 *
 * State management is handled entirely by Redux (tasksSlice).
 * This component owns only the UI filter state and the form
 * toggle, reading task counts from the Redux store via useSelector.
 */
function App() {
  const [filter, setFilter] = useState('all')
  const [showForm, setShowForm] = useState(false)

  // Read counts from Redux store
  const tasks = useSelector((state) => state.tasks)
  const doneCount = tasks.filter((t) => t.isDone).length
  const notDoneCount = tasks.filter((t) => !t.isDone).length

  const filterOptions = [
    { value: 'all', label: 'All' },
    { value: 'notDone', label: 'Active' },
    { value: 'done', label: 'Done' },
  ]

  return (
    <main className="flex flex-col gap-8 pt-12 max-sm:pt-8">
      {/* ── Header ────────────────────────────────────── */}
      <header className="flex flex-col gap-1">
        <h1 className="heading-gradient text-4xl font-bold tracking-tight max-sm:text-2xl">
          To-Do Redux
        </h1>
        <p className="text-sm text-text-muted">
          {notDoneCount} active &middot; {doneCount} done &middot;{' '}
          {tasks.length} total
        </p>
      </header>

      {/* ── Toolbar: Filter + Add Button ──────────────── */}
      <section className="flex flex-col gap-5">
        <div className="flex flex-wrap items-end gap-4">
          {/* Filter segmented control */}
          <fieldset className="flex flex-col gap-1.5">
            <legend className="text-xs font-medium uppercase tracking-widest text-text-muted">
              Filter
            </legend>
            <div className="flex overflow-hidden rounded-lg border border-border-default" role="radiogroup">
              {filterOptions.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  role="radio"
                  aria-checked={filter === opt.value}
                  onClick={() => setFilter(opt.value)}
                  className={`cursor-pointer border-none px-4 py-2 text-xs font-medium touch-manipulation transition-[background-color,color] duration-150 focus-visible:outline-2 focus-visible:outline-offset-2px focus-visible:outline-accent ${
                    filter === opt.value
                      ? 'bg-accent-bg text-accent'
                      : 'bg-transparent text-text-muted hover:bg-bg-subtle hover:text-text-secondary'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </fieldset>

          {/* Add Task toggle button */}
          <button
            type="button"
            onClick={() => setShowForm((prev) => !prev)}
            className="cursor-pointer self-end rounded-lg border border-accent-border bg-accent-bg px-5 py-2.5 text-sm font-medium text-accent touch-manipulation transition-[background-color,box-shadow,border-color] duration-200 hover:bg-[rgba(0,212,170,0.12)] hover:border-[rgba(0,212,170,0.4)] hover:shadow-glow focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            aria-expanded={showForm}
            aria-controls="add-task-form"
          >
            {showForm ? 'Cancel' : '+ Add Task'}
          </button>
        </div>

        {/* ── AddTask Form ─────────────────────────────── */}
        {showForm && (
          <div id="add-task-form">
            <AddTask />
          </div>
        )}
      </section>

      {/* ── Task List ─────────────────────────────────── */}
      <section>
        <ListTask filter={filter} />
      </section>
    </main>
  )
}

export default App
