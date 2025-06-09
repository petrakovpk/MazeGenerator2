import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface MazeState {
  width: number
  height: number
  cells: number[][]
  isGenerating: boolean
}

const initialState: MazeState = {
  width: 20,
  height: 20,
  cells: [],
  isGenerating: false,
}

export const mazeSlice = createSlice({
  name: 'maze',
  initialState,
  reducers: {
    setDimensions: (state, action: PayloadAction<{ width: number; height: number }>) => {
      state.width = action.payload.width
      state.height = action.payload.height
    },
    setCells: (state, action: PayloadAction<number[][]>) => {
      state.cells = action.payload
    },
    setIsGenerating: (state, action: PayloadAction<boolean>) => {
      state.isGenerating = action.payload
    },
  },
})

export const { setDimensions, setCells, setIsGenerating } = mazeSlice.actions
export default mazeSlice.reducer 