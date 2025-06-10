'use client';

import { useEffect, useState, useRef } from 'react';
import Toolbar from '../components/Toolbar';
import LeftPanel from '../components/LeftPanel';
import RightPanel, { ObjectCategory } from '../components/RightPanel';
import dynamic from 'next/dynamic';
import { toast } from "sonner"

const Canvas = dynamic(() => import('../components/Canvas'), {
  ssr: false,
  loading: () => <div className="flex-grow flex justify-center items-center bg-gray-100"><p>Loading Canvas...</p></div>
});

export interface MapObject {
  id: string;
  name: string;
  image: string;
  x: number;
  y: number;
  width: number;
  height: number;
  originalWidth?: number;
  originalHeight?: number;
  flipX: boolean;
  flipY: boolean;
  isLocked: boolean;
  parentId?: string;
  children?: MapObject[];
}

export interface PlacingObject {
  name: string;
  image: string;
  width: number;
  height: number;
  originalWidth: number;
  originalHeight: number;
}

export type Tool = 'pointer' | 'placing' | 'map';

export interface Levels {
  [key: string]: {
    objects: MapObject[];
    dimensions: { width: number, height: number };
  }
}

export default function Home() {
  const [levels, setLevels] = useState<Levels>({});
  const [currentLevelName, setCurrentLevelName] = useState('');
  const [mapObjects, setMapObjects] = useState<MapObject[]>([]);
  const [selectedObject, setSelectedObject] = useState<MapObject | null>(null);
  const [selectedObjectIds, setSelectedObjectIds] = useState<string[]>([]);
  const [activeTool, setActiveTool] = useState<Tool>('pointer');
  const [leftPanelContent, setLeftPanelContent] = useState<ObjectCategory | "levels" | "settings" | "islands" | null>('islands');
  const [placingObject, setPlacingObject] = useState<PlacingObject | null>(null);
  const [keepAspectRatio, setKeepAspectRatio] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [keepObjectAfterPlacement, setKeepObjectAfterPlacement] = useState(false);
  
  const [isRightPanelVisible, setIsRightPanelVisible] = useState(true);
  const [rightPanelWidth, setRightPanelWidth] = useState(350);

  const [canvasSize, setCanvasSize] = useState({ width: 800, height: 600 });
  const canvasContainerRef = useRef<HTMLDivElement>(null);

  const [islandDimensions, setIslandDimensions] = useState<Record<string, { width: number; height: number }>>({});
  const [startDimensions, setStartDimensions] = useState<Record<string, { width: number; height: number }>>({});
  const [fruitDimensions, setFruitDimensions] = useState<Record<string, { width: number; height: number }>>({});
  const [stoneDimensions, setStoneDimensions] = useState<Record<string, { width: number; height: number }>>({});
  const [waterDimensions, setWaterDimensions] = useState<Record<string, { width: number; height: number }>>({});
  const [treeDimensions, setTreeDimensions] = useState<Record<string, { width: number; height: number }>>({});
  const [finishDimensions, setFinishDimensions] = useState<Record<string, { width: number; height: number }>>({});
  const [extraDimensions, setExtraDimensions] = useState<Record<string, { width: number; height: number }>>({});

  const fetchLevels = async () => {
    const response = await fetch('/api/levels');
    const data = await response.json();
    setLevels(data);
    return data;
  };

  useEffect(() => {
    const initLevels = async () => {
      const data = await fetchLevels();
      const levelNames = Object.keys(data);
      const lastOpened = localStorage.getItem('maze-editor-last-level-name');
      if (lastOpened && data[lastOpened]) {
        loadLevel(lastOpened, data);
      } else if (levelNames.length > 0) {
        loadLevel(levelNames[0], data);
      }
    };
    initLevels();
  }, []);

  useEffect(() => {
    if (activeTool === 'map') {
      setLeftPanelContent('levels');
    } else if (activeTool === 'pointer' && leftPanelContent === 'levels') {
      setLeftPanelContent('islands');
    }
  }, [activeTool]);

  useEffect(() => {
    const savedIslandDimensions = localStorage.getItem('island-dimensions');
    if (savedIslandDimensions) setIslandDimensions(JSON.parse(savedIslandDimensions));
    const savedStartDimensions = localStorage.getItem('start-dimensions');
    if (savedStartDimensions) setStartDimensions(JSON.parse(savedStartDimensions));
    const savedFruitDimensions = localStorage.getItem('fruit-dimensions');
    if (savedFruitDimensions) setFruitDimensions(JSON.parse(savedFruitDimensions));
    const savedStoneDimensions = localStorage.getItem('stone-dimensions');
    if (savedStoneDimensions) setStoneDimensions(JSON.parse(savedStoneDimensions));
    const savedWaterDimensions = localStorage.getItem('water-dimensions');
    if (savedWaterDimensions) setWaterDimensions(JSON.parse(savedWaterDimensions));
    const savedTreeDimensions = localStorage.getItem('tree-dimensions');
    if (savedTreeDimensions) setTreeDimensions(JSON.parse(savedTreeDimensions));
    const savedFinishDimensions = localStorage.getItem('finish-dimensions');
    if (savedFinishDimensions) setFinishDimensions(JSON.parse(savedFinishDimensions));
    const savedExtraDimensions = localStorage.getItem('extra-dimensions');
    if (savedExtraDimensions) setExtraDimensions(JSON.parse(savedExtraDimensions));
  }, []);

  useEffect(() => {
    if (placingObject) {
      setActiveTool('placing');
    } else if (activeTool === 'placing') {
      setActiveTool('pointer');
    }
  }, [placingObject]);

  const handleSetIslandDimension = (name: string, size: { width: number; height: number }) => {
    const newDimensions = { ...islandDimensions, [name]: size };
    setIslandDimensions(newDimensions);
    localStorage.setItem('island-dimensions', JSON.stringify(newDimensions));
  };

  const handleSetStartDimension = (name: string, size: { width: number; height: number }) => {
    const newDimensions = { ...startDimensions, [name]: size };
    setStartDimensions(newDimensions);
    localStorage.setItem('start-dimensions', JSON.stringify(newDimensions));
  };

  const handleSetFruitDimension = (name: string, size: { width: number; height: number }) => {
    const newDimensions = { ...fruitDimensions, [name]: size };
    setFruitDimensions(newDimensions);
    localStorage.setItem('fruit-dimensions', JSON.stringify(newDimensions));
  };

  const handleSetStoneDimension = (name: string, size: { width: number; height: number }) => {
    const newDimensions = { ...stoneDimensions, [name]: size };
    setStoneDimensions(newDimensions);
    localStorage.setItem('stone-dimensions', JSON.stringify(newDimensions));
  };

  const handleSetWaterDimension = (name: string, size: { width: number; height: number }) => {
    const newDimensions = { ...waterDimensions, [name]: size };
    setWaterDimensions(newDimensions);
    localStorage.setItem('water-dimensions', JSON.stringify(newDimensions));
  };

  const handleSetTreeDimension = (name: string, size: { width: number; height: number }) => {
    const newDimensions = { ...treeDimensions, [name]: size };
    setTreeDimensions(newDimensions);
    localStorage.setItem('tree-dimensions', JSON.stringify(newDimensions));
  };

  const handleSetFinishDimension = (name: string, size: { width: number; height: number }) => {
    const newDimensions = { ...finishDimensions, [name]: size };
    setFinishDimensions(newDimensions);
    localStorage.setItem('finish-dimensions', JSON.stringify(newDimensions));
  };

  const handleSetExtraDimension = (name: string, size: { width: number; height: number }) => {
    const newDimensions = { ...extraDimensions, [name]: size };
    setExtraDimensions(newDimensions);
    localStorage.setItem('extra-dimensions', JSON.stringify(newDimensions));
  };

  const loadLevel = (name: string, allLevels: Levels) => {
    const levelData = allLevels[name];
    if (levelData) {
      setMapObjects(levelData.objects || []);
      setCanvasSize(levelData.dimensions || { width: 800, height: 600 });
      setCurrentLevelName(name);
      setSelectedObject(null);
      localStorage.setItem('maze-editor-last-level-name', name);
    }
  };

  const handleCreateLevel = async () => {
    const name = prompt(`Введите имя нового уровня:`, `Уровень ${Object.keys(levels).length + 1}`);
    if (name) {
        if (levels[name]) {
            alert('Уровень с таким именем уже существует.');
            return;
        }
        
        const newLevelData = {
            objects: [],
            dimensions: { width: 800, height: 600 }
        };

        try {
            await fetch('/api/save-level', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, data: newLevelData })
            });
            const updatedLevels = await fetchLevels();
            loadLevel(name, updatedLevels);
        } catch (error) {
            console.error('Ошибка при создании уровня:', error);
            alert(`Не удалось создать уровень: ${error}`);
        }
    }
  };

  const handleToolSelect = (tool: Tool) => {
    if (tool === 'pointer') {
      setPlacingObject(null);
    }
    setActiveTool(tool);
  };

  const handleSaveLevel = async () => {
    if (!currentLevelName) {
        toast.error('Ошибка', {
          description: 'Не выбран уровень для сохранения.',
        });
        return;
    }
    setIsSaving(true);
    const levelData = {
        objects: mapObjects,
        dimensions: canvasSize
    };
    try {
        await fetch('/api/save-level', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: currentLevelName, data: levelData })
        });
        toast.success('Сохранено', {
            description: `Уровень "${currentLevelName}" успешно сохранен.`,
        });
    } catch (error) {
        console.error('Ошибка при сохранении уровня:', error);
        toast.error('Ошибка сохранения', {
            description: `Не удалось сохранить уровень: ${error}`,
        });
    } finally {
      setIsSaving(false);
    }
    setSelectedObject(null);
  };

  const handleUpdateObject = (updatedAttrs: Partial<MapObject>) => {
    if (!selectedObject) return;

    let newAttrs: Partial<MapObject> = { ...updatedAttrs };

    const originalWidth = selectedObject.originalWidth || selectedObject.width;
    const originalHeight = selectedObject.originalHeight || selectedObject.height;

    if (keepAspectRatio && originalWidth && originalHeight) {
      if (updatedAttrs.width !== undefined && updatedAttrs.width !== selectedObject.width) {
        const aspectRatio = originalHeight / originalWidth;
        newAttrs.height = Number(updatedAttrs.width) * aspectRatio;
      } else if (updatedAttrs.height !== undefined && updatedAttrs.height !== selectedObject.height) {
        const aspectRatio = originalWidth / originalHeight;
        newAttrs.width = Number(updatedAttrs.height) * aspectRatio;
      }
    }
    
    const idToUpdate = selectedObject.id;

    const newMapObjects = mapObjects.map(obj => {
      if (obj.id === idToUpdate) {
        return { ...obj, ...newAttrs };
      }
      return obj;
    });
    setMapObjects(newMapObjects);

    if (selectedObject && selectedObject.id === idToUpdate) {
      setSelectedObject(prev => ({ ...prev!, ...newAttrs }));
    }
  };

  const handleSelectObject = (object: MapObject | null, isMultiSelect: boolean = false) => {
    if (object === null) {
      setSelectedObject(null);
      setSelectedObjectIds([]);
      return;
    }

    const newSelectedIds = isMultiSelect 
      ? selectedObjectIds.includes(object.id)
        ? selectedObjectIds.filter(id => id !== object.id)
        : [...selectedObjectIds, object.id]
      : [object.id];

    setSelectedObjectIds(newSelectedIds);

    if (newSelectedIds.length === 1) {
      const fullObject = mapObjects.find(obj => obj.id === newSelectedIds[0]) || null;
      setSelectedObject(fullObject);
    } else {
      setSelectedObject(null);
    }
  };

  const handleCloneObject = (id: string) => {
    const objectToClone = mapObjects.find(obj => obj.id === id);
    if (!objectToClone) return;

    const newObject: MapObject = {
      ...objectToClone,
      id: crypto.randomUUID(),
      x: objectToClone.x + 10,
      y: objectToClone.y + 10,
      name: `${objectToClone.name} (копия)`,
    };

    const index = mapObjects.findIndex(obj => obj.id === id);
    const newMapObjects = [...mapObjects];
    newMapObjects.splice(index + 1, 0, newObject);

    setMapObjects(newMapObjects);
    handleSelectObject(newObject, false);
  };

  const handleGroupObjects = () => {
    if (selectedObjectIds.length < 2) return;

    const newGroupId = crypto.randomUUID();
    let minX = Infinity, minY = Infinity, maxX = 0, maxY = 0;

    selectedObjectIds.forEach(id => {
        const obj = mapObjects.find(o => o.id === id);
        if (obj) {
            minX = Math.min(minX, obj.x);
            minY = Math.min(minY, obj.y);
            maxX = Math.max(maxX, obj.x + obj.width);
            maxY = Math.max(maxY, obj.y + obj.height);
        }
    });

    const newGroup: MapObject = {
        id: newGroupId,
        name: 'Группа',
        image: '/icons/group.svg',
        x: minX,
        y: minY,
        width: maxX - minX,
        height: maxY - minY,
        isLocked: false,
        flipX: false,
        flipY: false,
        children: [],
        parentId: undefined,
    };

    const updatedMapObjects = mapObjects.map(obj => {
        if (selectedObjectIds.includes(obj.id)) {
            return { ...obj, parentId: newGroupId };
        }
        return obj;
    });

    setMapObjects([...updatedMapObjects, newGroup]);
    setSelectedObjectIds([newGroupId]);
    setSelectedObject(newGroup);
  };

  const handleUngroupObjects = (groupId: string) => {
    const group = mapObjects.find(obj => obj.id === groupId);
    if (!group) return;

    const newMapObjects = mapObjects
        .map(obj => {
            if (obj.parentId === groupId) {
                return { ...obj, parentId: undefined };
            }
            return obj;
        })
        .filter(obj => obj.id !== groupId);
    
    const childrenIds = mapObjects.filter(obj => obj.parentId === groupId).map(obj => obj.id);

    setMapObjects(newMapObjects);
    setSelectedObjectIds(childrenIds);
    setSelectedObject(null);
  };

  const handleMoveObject = (id: string, direction: 'up' | 'down') => {
    const index = mapObjects.findIndex(obj => obj.id === id);
    if (index === -1) return;

    const newMapObjects = [...mapObjects];
    const item = newMapObjects.splice(index, 1)[0];

    let newIndex = index;
    if (direction === 'up' && index > 0) {
      newIndex = index - 1;
    } else if (direction === 'down' && index < mapObjects.length - 1) {
      newIndex = index + 1;
    }

    newMapObjects.splice(newIndex, 0, item);
    setMapObjects(newMapObjects);
  };

  const handleDeleteObject = (id: string) => {
    // Also delete children if it's a group
    const objectToDelete = mapObjects.find(obj => obj.id === id);
    if (!objectToDelete) return;

    let idsToDelete = [id];
    if (objectToDelete.children && objectToDelete.children.length > 0) {
      const childIds = mapObjects.filter(obj => obj.parentId === id).map(o => o.id);
      idsToDelete = [...idsToDelete, ...childIds];
    }
    
    // If it's a child, remove from parent's children array
    if(objectToDelete.parentId){
       const parent = mapObjects.find(obj => obj.id === objectToDelete.parentId);
       if(parent && parent.children){
           parent.children = parent.children.filter(child => child.id !== id);
       }
    }


    setMapObjects(mapObjects.filter(obj => !idsToDelete.includes(obj.id)));
    setSelectedObject(null);
    setSelectedObjectIds([]);
  };

  const handleToggleRightPanel = () => {
    setIsRightPanelVisible(!isRightPanelVisible);
  };

  const handleResetRightPanel = () => {
    setRightPanelWidth(350);
    setIsRightPanelVisible(true);
  };

  const handleResizeMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    const startX = e.clientX;
    const startWidth = rightPanelWidth;

    const handleMouseMove = (e: MouseEvent) => {
      const newWidth = startWidth - (e.clientX - startX);
      if (newWidth >= 250 && newWidth <= 600) {
        setRightPanelWidth(newWidth);
      }
    };

    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const handleAddObject = (newObjectData: Omit<MapObject, 'id'>) => {
    const newObject: MapObject = {
      ...newObjectData,
      id: crypto.randomUUID(),
    };
    setMapObjects(prev => [...prev, newObject]);
    if (!keepObjectAfterPlacement) {
      setPlacingObject(null);
    }
  };

  return (
    <div className="flex h-screen bg-gray-200">
      <div className="flex flex-col flex-grow">
        <Toolbar 
          activeTool={activeTool}
          onToolSelect={handleToolSelect}
          onSave={handleSaveLevel}
          isSaving={isSaving}
          isRightPanelVisible={isRightPanelVisible}
          onToggleRightPanel={handleToggleRightPanel}
          onResetRightPanel={handleResetRightPanel}
        />
        <div className="flex flex-grow overflow-hidden">
          <div className="w-[300px] bg-white dark:bg-zinc-950 border-r border-gray-300 dark:border-zinc-800 flex-shrink-0 flex flex-col">
            <LeftPanel
              content={leftPanelContent}
              setContent={setLeftPanelContent}
              levels={levels}
              currentLevelName={currentLevelName}
              loadLevel={(name: string) => loadLevel(name, levels)}
              onCreateLevel={handleCreateLevel}
              canvasSize={canvasSize}
              setCanvasSize={setCanvasSize}
              placingObject={placingObject}
              setPlacingObject={setPlacingObject}
              keepObjectAfterPlacement={keepObjectAfterPlacement}
              onKeepObjectAfterPlacementChange={setKeepObjectAfterPlacement}
              islandDimensions={islandDimensions}
              onIslandDimensionChange={handleSetIslandDimension}
              startDimensions={startDimensions}
              onStartDimensionChange={handleSetStartDimension}
              fruitDimensions={fruitDimensions}
              onFruitDimensionChange={handleSetFruitDimension}
              stoneDimensions={stoneDimensions}
              onStoneDimensionChange={handleSetStoneDimension}
              waterDimensions={waterDimensions}
              onWaterDimensionChange={handleSetWaterDimension}
              treeDimensions={treeDimensions}
              onTreeDimensionChange={handleSetTreeDimension}
              finishDimensions={finishDimensions}
              onFinishDimensionChange={handleSetFinishDimension}
              extraDimensions={extraDimensions}
              onExtraDimensionChange={handleSetExtraDimension}
            />
          </div>
          <div ref={canvasContainerRef} className="flex-grow flex justify-center items-center bg-gray-100 relative overflow-auto min-w-0">
            <Canvas
              objects={mapObjects}
              onAddObject={handleAddObject}
              selectedObject={selectedObject}
              onSelectObject={handleSelectObject}
              width={canvasSize.width}
              height={canvasSize.height}
              placingObject={placingObject}
              setPlacingObject={setPlacingObject}
              onUpdateObject={handleUpdateObject}
              activeTool={activeTool}
              keepObjectAfterPlacement={keepObjectAfterPlacement}
            />
          </div>
          
          {isRightPanelVisible && (
            <div
              className="relative bg-white dark:bg-zinc-950 border-l-2 border-gray-300 dark:border-zinc-700 flex-shrink-0 shadow-lg"
              style={{ width: rightPanelWidth, minWidth: '250px', maxWidth: '600px' }}
            >
              <div 
                className="absolute top-0 bottom-0 -left-1 w-2 bg-blue-500 hover:bg-blue-600 cursor-col-resize z-10 opacity-50 hover:opacity-100 transition-opacity"
                onMouseDown={handleResizeMouseDown}
                title="Перетащите для изменения размера панели"
              />
              <RightPanel
                allObjects={mapObjects}
                selectedObject={selectedObject}
                selectedObjectIds={selectedObjectIds}
                onSelectObject={handleSelectObject}
                onUpdateObject={handleUpdateObject}
                onDeleteObject={handleDeleteObject}
                onCloneObject={handleCloneObject}
                onGroupObjects={handleGroupObjects}
                onUngroupObjects={handleUngroupObjects}
                onMoveObject={handleMoveObject}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 