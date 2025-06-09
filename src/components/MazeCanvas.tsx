import { useEffect, useRef } from 'react'
import { Stage, Layer, Rect } from 'react-konva'
import { useSelector } from 'react-redux'
import { RootState } from '../store'

interface MazeCanvasProps {
  width: number
  height: number
  isGenerating: boolean
}

const CELL_SIZE = 20
const WALL_COLOR = '#1f2937'
const PATH_COLOR = '#ffffff'

const MazeCanvas = ({ width, height, isGenerating }: MazeCanvasProps) => {
  const stageRef = useRef(null)
  const { cells } = useSelector((state: RootState) => state.maze)

  const canvasWidth = width * CELL_SIZE
  const canvasHeight = height * CELL_SIZE

  useEffect(() => {
    if (stageRef.current) {
      // Центрируем канвас
      const stage = stageRef.current as any
      const container = stage.container()
      const containerWidth = container.offsetWidth
      const containerHeight = container.offsetHeight
      
      stage.x((containerWidth - canvasWidth) / 2)
      stage.y((containerHeight - canvasHeight) / 2)
    }
  }, [canvasWidth, canvasHeight])

  return (
    <div className="w-full h-[600px] bg-gray-200 rounded-lg overflow-hidden">
      <Stage
        ref={stageRef}
        width={canvasWidth}
        height={canvasHeight}
        scale={{ x: 1, y: 1 }}
      >
        <Layer>
          {cells.map((row, y) =>
            row.map((cell, x) => (
              <Rect
                key={`${x}-${y}`}
                x={x * CELL_SIZE}
                y={y * CELL_SIZE}
                width={CELL_SIZE}
                height={CELL_SIZE}
                fill={cell === 1 ? WALL_COLOR : PATH_COLOR}
                stroke="#e5e7eb"
                strokeWidth={1}
              />
            ))
          )}
        </Layer>
      </Stage>
    </div>
  )
}

export default MazeCanvas 