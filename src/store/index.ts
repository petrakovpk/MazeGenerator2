import { configureStore } from '@reduxjs/toolkit'
import mazeReducer from './mazeSlice'

export const store = configureStore({
  reducer: {
    maze: mazeReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch 