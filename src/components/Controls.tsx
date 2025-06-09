import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../store'
import { setDimensions, setIsGenerating } from '../store/mazeSlice'

const Controls = () => {
  const dispatch = useDispatch()
  const { width, height, isGenerating } = useSelector((state: RootState) => state.maze)

  const handleWidthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newWidth = parseInt(e.target.value)
    if (!isNaN(newWidth) && newWidth > 0) {
      dispatch(setDimensions({ width: newWidth, height }))
    }
  }

  const handleHeightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newHeight = parseInt(e.target.value)
    if (!isNaN(newHeight) && newHeight > 0) {
      dispatch(setDimensions({ width, height: newHeight }))
    }
  }

  const handleGenerate = () => {
    dispatch(setIsGenerating(true))
    // Здесь будет логика генерации лабиринта
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-4">
        <div className="form-control flex-1">
          <label className="label">
            <span className="label-text">Ширина</span>
          </label>
          <input
            type="number"
            value={width}
            onChange={handleWidthChange}
            className="input input-bordered w-full"
            min="1"
            disabled={isGenerating}
          />
        </div>
        <div className="form-control flex-1">
          <label className="label">
            <span className="label-text">Высота</span>
          </label>
          <input
            type="number"
            value={height}
            onChange={handleHeightChange}
            className="input input-bordered w-full"
            min="1"
            disabled={isGenerating}
          />
        </div>
      </div>
      <button
        onClick={handleGenerate}
        disabled={isGenerating}
        className="btn btn-primary w-full"
      >
        {isGenerating ? 'Генерация...' : 'Сгенерировать лабиринт'}
      </button>
    </div>
  )
}

export default Controls 