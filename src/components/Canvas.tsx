import React, { useState, useRef, useEffect } from 'react';
import { MapObject, PlacingObject } from '@/app/page';
import { Stage, Layer, Image as KonvaImage, Transformer, Group, Rect } from 'react-konva';
import useImage from 'use-image';
import { v4 as uuidv4 } from 'uuid';
import Konva from 'konva';
import { data } from '@/lib/data';

interface MapObjectComponentProps {
  shapeProps: MapObject;
  isSelected: boolean;
  onSelect: () => void;
  onChange: (newAttrs: Partial<MapObject>) => void;
  keepAspectRatio: boolean;
}

const MapObjectComponent: React.FC<MapObjectComponentProps> = ({ shapeProps, isSelected, onSelect, onChange, keepAspectRatio }) => {
  const shapeRef = useRef<Konva.Image>(null);
  const trRef = useRef<Konva.Transformer>(null);
  const [image] = useImage(shapeProps.image, 'anonymous');

  useEffect(() => {
    if (isSelected) {
      trRef.current?.nodes([shapeRef.current!]);
      trRef.current?.getLayer()?.batchDraw();
    }
  }, [isSelected]);

  const handleDragEnd = (e: Konva.KonvaEventObject<DragEvent>) => {
    onChange({ ...shapeProps, x: e.target.x(), y: e.target.y() });
  };

  const handleTransformEnd = () => {
    const node = shapeRef.current;
    if (node) {
      const scaleX = node.scaleX();
      const scaleY = node.scaleY();
      
      node.scaleX(shapeProps.flipX ? -1 : 1);
      node.scaleY(shapeProps.flipY ? -1 : 1);

      onChange({
        ...shapeProps,
        x: node.x(),
        y: node.y(),
        width: Math.max(5, node.width() * Math.abs(scaleX)),
        height: Math.max(5, node.height() * Math.abs(scaleY)),
      });
    }
  };

  return (
    <>
      <KonvaImage
        ref={shapeRef}
        image={image}
        x={shapeProps.x}
        y={shapeProps.y}
        width={shapeProps.width}
        height={shapeProps.height}
        draggable={!shapeProps.isLocked}
        onClick={onSelect}
        onTap={onSelect}
        onDragEnd={handleDragEnd}
        onTransformEnd={handleTransformEnd}
        scaleX={shapeProps.flipX ? -1 : 1}
        scaleY={shapeProps.flipY ? -1 : 1}
        offsetX={shapeProps.flipX ? shapeProps.width : 0}
        offsetY={shapeProps.flipY ? shapeProps.height : 0}
      />
      {isSelected && (
        <Transformer
          ref={trRef}
          boundBoxFunc={(oldBox, newBox) => {
            if (keepAspectRatio) {
              const aspectRatio = oldBox.width / oldBox.height;
              newBox.width = newBox.height * aspectRatio;
            }
            if (newBox.width < 5 || newBox.height < 5) {
              return oldBox;
            }
            return newBox;
          }}
        />
      )}
    </>
  );
};

interface CanvasProps {
  mapObjects: MapObject[];
  setMapObjects: (objects: MapObject[]) => void;
  selectedObject: MapObject | null;
  setSelectedObject: (object: MapObject | null) => void;
  canvasSize: { width: number; height: number };
  placingObject: PlacingObject | null;
  setPlacingObject: (object: PlacingObject | null) => void;
  keepAspectRatio: boolean;
  onUpdateObject: (object: Partial<MapObject>) => void;
}

const Canvas: React.FC<CanvasProps> = ({
  mapObjects,
  setMapObjects,
  selectedObject,
  setSelectedObject,
  canvasSize,
  placingObject,
  setPlacingObject,
  keepAspectRatio,
  onUpdateObject,
}) => {
  const [mousePos, setMousePos] = useState<{ x: number; y: number } | null>(null);
  const stageRef = useRef<Konva.Stage>(null);
  const groupRef = useRef<Konva.Group>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerSize, setContainerSize] = useState({ width: 800, height: 600 });
  const PADDING = 100;

  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        const { clientWidth, clientHeight } = containerRef.current;
        setContainerSize({ width: clientWidth, height: clientHeight });
      }
    };

    updateSize();
    const resizeObserver = new ResizeObserver(updateSize);
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    return () => resizeObserver.disconnect();
  }, []);

  const getRelativePointerPosition = (node: Konva.Node | null) => {
    if (!node) return null;
    const transform = node.getAbsoluteTransform().copy();
    transform.invert();
    const pos = node.getStage()?.getPointerPosition();
    if (!pos) return null;
    return transform.point(pos);
  };
  
  const handleStageClick = (e: Konva.KonvaEventObject<MouseEvent>) => {
    if (placingObject && groupRef.current) {
      const pos = getRelativePointerPosition(groupRef.current);
      if (!pos) return;
      
      if (placingObject.name === 'random_fruit') {
        const newObject: MapObject = {
          id: uuidv4(),
          name: 'Случайный фрукт',
          image: placingObject.image,
          x: pos.x - placingObject.width / 2,
          y: pos.y - placingObject.height / 2,
          width: placingObject.width,
          height: placingObject.height,
          originalWidth: placingObject.originalWidth,
          originalHeight: placingObject.originalHeight,
          flipX: false,
          flipY: false,
          isLocked: false,
        };
        setMapObjects([...mapObjects, newObject]);
        setPlacingObject(null);
      } else {
        const newObject: MapObject = {
          id: uuidv4(),
          ...placingObject,
          x: pos.x - placingObject.width / 2,
          y: pos.y - placingObject.height / 2,
          flipX: false,
          flipY: false,
          isLocked: false,
        };
        setMapObjects([...mapObjects, newObject]);
        setPlacingObject(null);
      }
      return;
    }

    if (e.target === e.target.getStage() || e.target.name() === 'level-background') {
      setSelectedObject(null);
    }
  };
  
  const handleMouseMove = (e: Konva.KonvaEventObject<MouseEvent>) => {
    if (placingObject && groupRef.current) {
      const pos = getRelativePointerPosition(groupRef.current);
      if (pos) {
        setMousePos(pos);
      }
    }
  };
  
  const handleMouseLeave = () => {
    setMousePos(null);
  };
  
  const [previewImage] = useImage(placingObject?.image || '', 'anonymous');

  // Вычисляем позицию для центрирования карты
  const stageWidth = Math.max(containerSize.width, canvasSize.width + PADDING * 2);
  const stageHeight = Math.max(containerSize.height, canvasSize.height + PADDING * 2);
  const offsetX = Math.max(PADDING, (containerSize.width - canvasSize.width) / 2);
  const offsetY = Math.max(PADDING, (containerSize.height - canvasSize.height) / 2);

  return (
    <div ref={containerRef} className="w-full h-full">
      <Stage
        ref={stageRef}
        width={containerSize.width}
        height={containerSize.height}
        onClick={handleStageClick}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="bg-gray-100"
      >
        <Layer>
          <Group ref={groupRef} x={offsetX} y={offsetY}>
          <Rect
            name="level-background"
            width={canvasSize.width}
            height={canvasSize.height}
            fill="white"
            shadowBlur={10}
            shadowOpacity={0.2}
          />
          {mapObjects.map((obj) => (
            <MapObjectComponent
              key={obj.id}
              shapeProps={obj}
              isSelected={selectedObject?.id === obj.id}
              onSelect={() => {
                if (placingObject) return;
                if (!obj.isLocked) {
                  setSelectedObject(obj);
                }
              }}
              onChange={onUpdateObject}
              keepAspectRatio={keepAspectRatio}
            />
          ))}
          {mousePos && placingObject && (
            <KonvaImage
              image={previewImage}
              x={mousePos.x - placingObject.width / 2}
              y={mousePos.y - placingObject.height / 2}
              width={placingObject.width}
              height={placingObject.height}
              opacity={0.6}
              listening={false}
            />
          )}
        </Group>
      </Layer>
    </Stage>
    </div>
  );
};

export default Canvas;
