import { createSlice, nanoid } from '@reduxjs/toolkit'

/**
 * STORAGE_KEY — localStorage key for persisting tasks.
 */
const STORAGE_KEY = 'gmc_redux_tasks'

/**
 * loadFromStorage — Load tasks from localStorage.
 * Returns parsed array or null if nothing stored.
 */
function loadFromStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : null
  } catch {
    return null
  }
}

/**
 * SEED_TASKS — Default tasks shown on first visit.
 */
const SEED_TASKS = [
  {
    id: nanoid(),
    description: 'Set up Redux Toolkit store with tasksSlice',
    isDone: true,
  },
  {
    id: nanoid(),
    description: 'Build AddTask component with form validation',
    isDone: false,
  },
  {
    id: nanoid(),
    description: 'Implement filter by done/not done status',
    isDone: false,
  },
  {
    id: nanoid(),
    description: 'Add edit functionality to each task',
    isDone: false,
  },
]

/**
 * tasksSlice — Redux slice managing the global tasks array.
 *
 * Each task: { id: string, description: string, isDone: boolean }
 *
 * Actions:
 *  - addTask(description)   — creates a new task
 *  - toggleTask(id)         — flips isDone
 *  - editTask({id, description}) — updates task description
 *  - deleteTask(id)         — removes a task
 */
const tasksSlice = createSlice({
  name: 'tasks',
  initialState: loadFromStorage() ?? SEED_TASKS,
  reducers: {
    /** Add a new task. Payload: string (the description). */
    addTask: {
      reducer(state, action) {
        state.unshift(action.payload)
      },
      prepare(description) {
        return {
          payload: {
            id: nanoid(),
            description,
            isDone: false,
          },
        }
      },
    },

    /** Toggle isDone. Payload: string (the task id). */
    toggleTask(state, action) {
      const task = state.find((t) => t.id === action.payload)
      if (task) {
        task.isDone = !task.isDone
      }
    },

    /** Edit description. Payload: { id, description }. */
    editTask(state, action) {
      const { id, description } = action.payload
      const task = state.find((t) => t.id === id)
      if (task) {
        task.description = description
      }
    },

    /** Delete a task. Payload: string (the task id). */
    deleteTask(state, action) {
      return state.filter((t) => t.id !== action.payload)
    },
  },
})

export const { addTask, toggleTask, editTask, deleteTask } = tasksSlice.actions
export default tasksSlice.reducer
