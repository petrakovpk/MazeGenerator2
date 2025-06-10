import React, { useState, useRef, useEffect, useCallback } from 'react';
import { MapObject, PlacingObject } from '../App';
import { Stage, Layer, Image as KonvaImage, Transformer, Group, Rect } from 'react-konva';
import useImage from 'use-image';
import { v4 as uuidv4 } from 'uuid';
import Konva from 'konva';
import { data } from '../lib/data';

interface MapObjectComponentProps {
  shapeProps: MapObject;
  isSelected: boolean;
  onSelect: (e: Konva.KonvaEventObject<MouseEvent>) => void;
  onChange: (newAttrs: Partial<MapObject>) => void;
  keepAspectRatio: boolean;
}

const MapObjectComponent: React.FC<MapObjectComponentProps> = ({ shapeProps, isSelected, onSelect, onChange, keepAspectRatio }) => {
  const shapeRef = useRef<Konva.Image>(null);
  const trRef = useRef<Konva.Transformer>(null);
  const [image] = useImage(shapeProps.image, 'anonymous');

  useEffect(() => {
    if (isSelected && trRef.current && shapeRef.current) {
      trRef.current.nodes([shapeRef.current]);
      trRef.current.getLayer()?.batchDraw();
    }
  }, [isSelected, shapeProps]);

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
        id={shapeProps.id}
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
            if (newBox.width < 5 || newBox.height < 5) {
              return oldBox;
            }
            return newBox;
          }}
          keepRatio={keepAspectRatio}
        />
      )}
    </>
  );
};

interface MultiTransformerProps {
    selectedNodes: Konva.Node[];
}

const MultiTransformer: React.FC<MultiTransformerProps> = ({ selectedNodes }) => {
    const trRef = useRef<Konva.Transformer>(null);

    useEffect(() => {
        if (trRef.current) {
            trRef.current.nodes(selectedNodes);
            trRef.current.getLayer()?.batchDraw();
        }
    }, [selectedNodes]);

    return <Transformer ref={trRef} />;
};

interface CanvasProps {
  width: number;
  height: number;
  objects: MapObject[];
  selectedObjectIds: string[];
  onSelectObject: (object: MapObject | null, isMultiSelect: boolean, isShiftSelect: boolean) => void;
  onSetSelectedObjectIds: (ids: string[]) => void;
  placingObject: PlacingObject | null;
  setPlacingObject: (object: PlacingObject | null) => void;
  onUpdateObject: (object: Partial<MapObject>) => void;
  onAddObject: (object: Omit<MapObject, 'id'>) => void;
  activeTool: string;
  keepObjectAfterPlacement: boolean;
}

const Canvas: React.FC<CanvasProps> = ({
  width,
  height,
  objects,
  selectedObjectIds,
  onSelectObject,
  onSetSelectedObjectIds,
  placingObject,
  setPlacingObject,
  onUpdateObject,
  onAddObject,
  activeTool,
  keepObjectAfterPlacement,
}) => {
  const [mousePos, setMousePos] = useState<{ x: number; y: number } | null>(null);
  const stageRef = useRef<Konva.Stage>(null);
  const groupRef = useRef<Konva.Group>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerSize, setContainerSize] = useState({ width: 800, height: 600 });
  const [selectionRect, setSelectionRect] = useState({ x1: 0, y1: 0, x2: 0, y2: 0, visible: false });
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
  
  const updateSelection = useCallback((rect: {x: number, y: number, width: number, height: number}, isMulti: boolean) => {
    const stage = stageRef.current;
    const group = groupRef.current;
    if (!stage || !group) return;

    let newSelectedIds = new Set(isMulti ? selectedObjectIds : []);
    
    stage.find('Image').forEach((imageNode) => {
      const imageObject = objects.find(o => o.id === imageNode.id());
      if (imageObject && imageObject.isLocked) {
        return;
      }

      const imageRect = imageNode.getClientRect({ relativeTo: group });
      const isContained =
        imageRect.x >= rect.x &&
        imageRect.y >= rect.y &&
        imageRect.x + imageRect.width <= rect.x + rect.width &&
        imageRect.y + imageRect.height <= rect.y + rect.height;
        
      if (isContained) {
        const id = imageNode.id();
        if (id) {
          if (isMulti && newSelectedIds.has(id)) {
            newSelectedIds.delete(id);
          } else {
            newSelectedIds.add(id);
          }
        }
      }
    });

    onSetSelectedObjectIds(Array.from(newSelectedIds));

  }, [onSetSelectedObjectIds, selectedObjectIds, objects]);

  const handleMouseDown = (e: Konva.KonvaEventObject<MouseEvent>) => {
    if (activeTool !== 'pointer') return;
    if (e.target !== stageRef.current) return;

    const pos = getRelativePointerPosition(groupRef.current);
    if (!pos) return;
    
    setSelectionRect({ x1: pos.x, y1: pos.y, x2: pos.x, y2: pos.y, visible: true });
  };
  
  const handleStageClick = (e: Konva.KonvaEventObject<MouseEvent>) => {
    if (selectionRect.visible) return;

    if (activeTool === 'placing' && placingObject && groupRef.current) {
      const pos = getRelativePointerPosition(groupRef.current);
      if (!pos) return;
      
      const newObject = {
        name: placingObject.name,
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
      
      onAddObject(newObject);

      if (!keepObjectAfterPlacement) {
        setPlacingObject(null);
      }
      return;
    }

    const target = e.target;
    if (
      target === target.getStage() ||
      target instanceof Konva.Layer ||
      target.name() === 'level-background'
    ) {
      onSelectObject(null, false, false);
    }
  };
  
  const handleMouseMove = (e: Konva.KonvaEventObject<MouseEvent>) => {
    if (placingObject && groupRef.current) {
      const pos = getRelativePointerPosition(groupRef.current);
      if (pos) {
        setMousePos(pos);
      }
      return;
    }

    if (!selectionRect.visible) return;

    const pos = getRelativePointerPosition(groupRef.current);
    if (!pos) return;
    setSelectionRect(prev => ({ ...prev, x2: pos.x, y2: pos.y }));
  };
  
  const handleMouseUp = (e: Konva.KonvaEventObject<MouseEvent>) => {
    if (!selectionRect.visible) return;

    const { x1, y1, x2, y2 } = selectionRect;
    const selectionBox = {
      x: Math.min(x1, x2),
      y: Math.min(y1, y2),
      width: Math.abs(x1 - x2),
      height: Math.abs(y1 - y2),
    };

    if (selectionBox.width > 5 || selectionBox.height > 5) {
      const isMulti = e.evt.ctrlKey || e.evt.metaKey || e.evt.shiftKey;
      updateSelection(selectionBox, isMulti);
    }
    
    setSelectionRect({ x1: 0, y1: 0, x2: 0, y2: 0, visible: false });
  };

  const handleMouseLeave = () => {
    setMousePos(null);
  };
  
  const [previewImage] = useImage(placingObject?.image || '', 'anonymous');

  const stageWidth = Math.max(containerSize.width, width + PADDING * 2);
  const stageHeight = Math.max(containerSize.height, height + PADDING * 2);
  const offsetX = Math.max(PADDING, (containerSize.width - width) / 2);
  const offsetY = Math.max(PADDING, (containerSize.height - height) / 2);

  return (
    <div ref={containerRef} className="w-full h-full">
      <Stage
        ref={stageRef}
        width={containerSize.width}
        height={containerSize.height}
        onClick={handleStageClick}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
        className="bg-gray-100"
      >
        <Layer>
          <Group ref={groupRef} x={offsetX} y={offsetY}>
          <Rect
            name="level-background"
            width={width}
            height={height}
            fill="white"
            shadowBlur={10}
            shadowOpacity={0.2}
          />
          {objects.map((obj) => (
            <MapObjectComponent
              key={obj.id}
              shapeProps={obj}
              isSelected={selectedObjectIds.includes(obj.id)}
              onSelect={(e) => {
                if (placingObject) return;
                if (!obj.isLocked) {
                  const isMulti = e.evt.ctrlKey || e.evt.metaKey;
                  const isShift = e.evt.shiftKey;
                  onSelectObject(obj, isMulti, isShift);
                }
              }}
              onChange={(newAttrs) => onUpdateObject({ ...newAttrs, id: obj.id })}
              keepAspectRatio={true}
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
          {selectionRect.visible && (
            <Rect
              x={Math.min(selectionRect.x1, selectionRect.x2)}
              y={Math.min(selectionRect.y1, selectionRect.y2)}
              width={Math.abs(selectionRect.x1 - selectionRect.x2)}
              height={Math.abs(selectionRect.y1 - selectionRect.y2)}
              fill="rgba(0, 162, 255, 0.3)"
              stroke="rgba(0, 162, 255, 0.7)"
              strokeWidth={1}
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
