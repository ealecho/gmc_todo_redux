import { configureStore } from '@reduxjs/toolkit'
import tasksReducer from './tasksSlice'

/**
 * STORAGE_KEY — Must match the key used in tasksSlice.
 */
const STORAGE_KEY = 'gmc_redux_tasks'

/**
 * localStorageMiddleware — Redux middleware that persists
 * the tasks slice to localStorage after every dispatched action.
 *
 * This replaces the useEffect-based approach from the previous
 * project with a Redux-idiomatic solution.
 */
const localStorageMiddleware = (storeAPI) => (next) => (action) => {
  const result = next(action)
  try {
    const state = storeAPI.getState()
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state.tasks))
  } catch {
    // Storage full or unavailable — fail silently
  }
  return result
}

/**
 * store — The Redux store, configured with the tasks reducer
 * and a custom middleware for localStorage persistence.
 */
const store = configureStore({
  reducer: {
    tasks: tasksReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(localStorageMiddleware),
})

export default store
