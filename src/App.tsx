import { useEffect, useState, useRef, Suspense, useCallback } from 'react';
import LeftPanel from './components/LeftPanel';
import RightPanel, { ObjectCategory } from './components/RightPanel';
import { toast } from "sonner"
import React from 'react';
import { MousePointerClick, Lock, Layers, Save, Infinity } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";

const Canvas = React.lazy(() => import('./components/Canvas'));

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

export default function App() {
  const [levels, setLevels] = useState<Levels>({});
  const [currentLevelName, setCurrentLevelName] = useState('');
  const [mapObjects, setMapObjects] = useState<MapObject[]>([]);
  const [history, setHistory] = useState<MapObject[][]>([[]]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const [isDirty, setIsDirty] = useState(false);
  const [selectedObject, setSelectedObject] = useState<MapObject | null>(null);
  const [selectedObjectIds, setSelectedObjectIds] = useState<string[]>([]);
  const [lastSelectedObjectId, setLastSelectedObjectId] = useState<string | null>(null);
  const [activeTool, setActiveTool] = useState<Tool>('pointer');
  const [leftPanelContent, setLeftPanelContent] = useState<ObjectCategory | "levels" | "settings" | "islands" | null>('islands');
  const [placingObject, setPlacingObject] = useState<PlacingObject | null>(null);
  const [keepAspectRatio, setKeepAspectRatio] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [keepObjectAfterPlacement, setKeepObjectAfterPlacement] = useState(false);
  
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
  const [leftPanelSize, setLeftPanelSize] = useState(20);
  const [rightPanelSize, setRightPanelSize] = useState(20);

  const updateMapObjects = (newObjects: MapObject[] | ((prev: MapObject[]) => MapObject[]), fromHistory = false) => {
    const resolvedObjects = typeof newObjects === 'function' ? newObjects(mapObjects) : newObjects;
    
    setMapObjects(resolvedObjects);

    if (!fromHistory) {
      const newHistory = history.slice(0, historyIndex + 1);
      newHistory.push(resolvedObjects);
      setHistory(newHistory);
      setHistoryIndex(newHistory.length - 1);
      setIsDirty(true);
    }
  };

  const handleMoveObject = (id: string, direction: 'up' | 'down') => {
    const index = mapObjects.findIndex(o => o.id === id);
    if (index === -1) return;

    const newObjects = [...mapObjects];
    const item = newObjects.splice(index, 1)[0];
    
    if (direction === 'up') {
        if (index > 0) {
            newObjects.splice(index - 1, 0, item);
            updateMapObjects(newObjects);
        }
    } else {
        if (index < newObjects.length) {
            newObjects.splice(index + 1, 0, item);
            updateMapObjects(newObjects);
        }
    }
  };

  const handleReorderObjects = (startIndex: number, endIndex: number) => {
    const result = Array.from(mapObjects);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    updateMapObjects(result);
  };

  const handleSetSelectedObjectIds = (ids: string[]) => {
    setSelectedObjectIds(ids);
    if (ids.length === 0) {
      setSelectedObject(null);
    } else if (ids.length === 1) {
      setSelectedObject(mapObjects.find(obj => obj.id === ids[0]) || null);
    } else {
      const lastSelected = mapObjects.find(obj => obj.id === ids[ids.length - 1]);
      setSelectedObject(lastSelected || null);
    }
  };

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
    if (leftPanelContent === 'levels') {
      setLeftPanelContent('islands');
    }
  }, [leftPanelContent]);

  useEffect(() => {
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
    const savedIslandDimensions = localStorage.getItem('island-dimensions');
    if (savedIslandDimensions) setIslandDimensions(JSON.parse(savedIslandDimensions));
    const savedStartDimensions = localStorage.getItem('start-dimensions');
    if (savedStartDimensions) setStartDimensions(JSON.parse(savedStartDimensions));
  }, []);

  useEffect(() => {
    if (placingObject) {
      setActiveTool('placing');
    } else if (activeTool === 'placing') {
      setActiveTool('pointer');
    }
  }, [placingObject]);

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

  const loadLevel = (name: string, allLevels: Levels) => {
    const levelData = allLevels[name];
    if (levelData) {
      const newObjects = levelData.objects || [];
      setMapObjects(newObjects);
      setHistory([newObjects]);
      setHistoryIndex(0);
      setIsDirty(false);
      setCanvasSize(levelData.dimensions || { width: 800, height: 600 });
      setCurrentLevelName(name);
      setSelectedObject(null);
      setSelectedObjectIds([]);
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
    setSelectedObject(null);
    setSelectedObjectIds([]);
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
        setIsDirty(false);
        // Reset history baseline
        setHistory([mapObjects]);
        setHistoryIndex(0);
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

  const handleSelectObject = (object: MapObject | null, isMultiSelect: boolean, isShiftSelect: boolean) => {
    if (object === null) {
      setSelectedObject(null);
      setSelectedObjectIds([]);
      setLastSelectedObjectId(null);
      return;
    }

    const { id } = object;

    if (isShiftSelect && lastSelectedObjectId) {
      const lastIndex = mapObjects.findIndex(obj => obj.id === lastSelectedObjectId);
      const currentIndex = mapObjects.findIndex(obj => obj.id === id);
      
      if (lastIndex !== -1 && currentIndex !== -1) {
        const start = Math.min(lastIndex, currentIndex);
        const end = Math.max(lastIndex, currentIndex);
        const newSelectedIds = mapObjects.slice(start, end + 1).map(obj => obj.id);
        
        const combinedIds = Array.from(new Set([...selectedObjectIds, ...newSelectedIds]));
        setSelectedObjectIds(combinedIds);
        setSelectedObject(object);
        return;
      }
    }

    if (isMultiSelect) {
      const newSelectedIds = selectedObjectIds.includes(id)
        ? selectedObjectIds.filter(selectedId => selectedId !== id)
        : [...selectedObjectIds, id];
      
      setSelectedObjectIds(newSelectedIds);
      if (newSelectedIds.length === 1) {
        setSelectedObject(mapObjects.find(o => o.id === newSelectedIds[0]) || null);
      } else {
        setSelectedObject(object);
      }
    } else {
      setSelectedObjectIds([id]);
      setSelectedObject(object);
    }

    setLastSelectedObjectId(id);
  };

  const handleUpdateObject = (updatedAttrs: Partial<MapObject>) => {
    if (selectedObjectIds.length > 0) {
        updateMapObjects(currentObjects =>
            currentObjects.map(obj =>
                selectedObjectIds.includes(obj.id) ? { ...obj, ...updatedAttrs } : obj
            )
        );
        if (selectedObject && selectedObjectIds.length === 1 && selectedObjectIds[0] === selectedObject.id) {
            setSelectedObject(prev => prev ? { ...prev, ...updatedAttrs } : null);
        }
    }
  };

  const handleDeleteObject = (id: string) => {
    const idsToDelete = selectedObjectIds.length > 1 ? selectedObjectIds : [id];
    updateMapObjects(currentObjects => currentObjects.filter(obj => !idsToDelete.includes(obj.id)));
    setSelectedObject(null);
    setSelectedObjectIds([]);
  };

  const handleAddObject = (obj: Omit<MapObject, 'id'>) => {
    const newObject = {
      ...obj,
      id: `${Date.now()}-${Math.random()}`,
    };
    updateMapObjects(currentObjects => [...currentObjects, newObject]);
    setSelectedObject(newObject);
    setSelectedObjectIds([newObject.id]);
  };

  const handleCloneObject = (id: string) => {
    const objectToClone = mapObjects.find(obj => obj.id === id);
    if (objectToClone) {
      const newObject = {
        ...objectToClone,
        id: `${Date.now()}-${Math.random()}`,
        x: objectToClone.x + 20,
        y: objectToClone.y + 20,
      };
      updateMapObjects(currentObjects => [...currentObjects, newObject]);
      setSelectedObject(newObject);
    }
  };

  const handleGroupObjects = () => {
    if (selectedObjectIds.length < 2) return;

    const newGroupId = uuidv4();
    const children = mapObjects.filter(obj => selectedObjectIds.includes(obj.id));
    
    if (children.some(c => c.parentId)) {
        toast.error("Нельзя группировать уже сгруппированные объекты");
        return;
    }

    const newGroup: MapObject = {
        id: newGroupId,
        name: 'Новая группа',
        image: 'group-icon.svg', // Placeholder
        x: Math.min(...children.map(c => c.x)),
        y: Math.min(...children.map(c => c.y)),
        width: Math.max(...children.map(c => c.x + c.width)) - Math.min(...children.map(c => c.x)),
        height: Math.max(...children.map(c => c.y + c.height)) - Math.min(...children.map(c => c.y)),
        flipX: false,
        flipY: false,
        isLocked: false,
        children: children,
    };

    const newMapObjects = mapObjects.filter(obj => !selectedObjectIds.includes(obj.id));
    
    const updatedChildren = children.map(child => ({ ...child, parentId: newGroupId }));

    const finalObjects = [...newMapObjects, newGroup, ...updatedChildren];
    updateMapObjects(finalObjects);
    setSelectedObjectIds([newGroupId]);
    setSelectedObject(newGroup);
  };

  const handleUngroupObjects = (id: string) => {
    console.log("Ungrouping object:", id);
    toast.info("Функция разгруппировки в разработке.");
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        if (e.key === 'z') {
          e.preventDefault();
          if (!e.shiftKey) { // Undo
            if (historyIndex > 0) {
              const newIndex = historyIndex - 1;
              setHistoryIndex(newIndex);
              setMapObjects(history[newIndex]);
              setIsDirty(newIndex !== 0);
              setSelectedObject(null);
              setSelectedObjectIds([]);
            }
          } else { // Redo
            if (historyIndex < history.length - 1) {
              const newIndex = historyIndex + 1;
              setHistoryIndex(newIndex);
              setMapObjects(history[newIndex]);
              setIsDirty(newIndex !== 0);
              setSelectedObject(null);
              setSelectedObjectIds([]);
            }
          }
          return;
        }
         if (e.key === 'y') {
           e.preventDefault();
           // Redo
            if (historyIndex < history.length - 1) {
              const newIndex = historyIndex + 1;
              setHistoryIndex(newIndex);
              setMapObjects(history[newIndex]);
              setIsDirty(newIndex !== 0);
              setSelectedObject(null);
              setSelectedObjectIds([]);
            }
          return;
        }
      }

      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      if (selectedObject) {
        const moveSpeed = e.shiftKey ? 10 : 1;

        switch (e.key) {
          case 'ArrowUp':
            e.preventDefault();
            handleUpdateObject({ id: selectedObject.id, y: selectedObject.y - moveSpeed });
            break;
          case 'ArrowDown':
            e.preventDefault();
            handleUpdateObject({ id: selectedObject.id, y: selectedObject.y + moveSpeed });
            break;
          case 'ArrowLeft':
            e.preventDefault();
            handleUpdateObject({ id: selectedObject.id, x: selectedObject.x - moveSpeed });
            break;
          case 'ArrowRight':
            e.preventDefault();
            handleUpdateObject({ id: selectedObject.id, x: selectedObject.x + moveSpeed });
            break;
          case 'Delete':
          case 'Backspace':
            e.preventDefault();
            handleDeleteObject(selectedObject.id);
            break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [selectedObject, handleUpdateObject, handleDeleteObject]);

  useEffect(() => {
    const savedLeftPanelSize = localStorage.getItem('left-panel-size');
    if (savedLeftPanelSize) {
      setLeftPanelSize(Number(savedLeftPanelSize));
    }
    const savedRightPanelSize = localStorage.getItem('right-panel-size');
    if (savedRightPanelSize) {
      setRightPanelSize(Number(savedRightPanelSize));
    }
  }, []);

  const handleLayout = (sizes: number[]) => {
    setLeftPanelSize(sizes[0]);
    localStorage.setItem('left-panel-size', String(sizes[0]));
    if (sizes.length > 2) {
      setRightPanelSize(sizes[2]);
      localStorage.setItem('right-panel-size', String(sizes[2]));
    }
  };

  return (
    <div className="h-screen bg-base-100 text-base-content" data-theme="bumblebee">
      <PanelGroup direction="horizontal" onLayout={handleLayout}>
        <Panel defaultSize={leftPanelSize} minSize={15} maxSize={40}>
          <LeftPanel
            levels={levels}
            currentLevelName={currentLevelName}
            loadLevel={(name) => loadLevel(name, levels)}
            onCreateLevel={handleCreateLevel}
            canvasSize={canvasSize}
            setCanvasSize={setCanvasSize}
            placingObject={placingObject}
            setPlacingObject={setPlacingObject}
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
        </Panel>
        <PanelResizeHandle className="w-2 bg-base-300 hover:bg-primary transition-colors" />
        <Panel minSize={30}>
          <div className="flex flex-col h-full w-full" onClick={(e) => {
                if (e.target === e.currentTarget) {
                  handleSelectObject(null, false, false);
                }
              }}>
            <div className="flex-shrink-0 bg-base-100 border-b border-base-300 p-2 flex items-center gap-2">
              <button
                className={`btn ${activeTool === 'pointer' ? 'btn-primary' : 'btn-ghost'}`}
                onClick={() => handleToolSelect('pointer')}
              >
                <MousePointerClick />
              </button>
              <button
                className={`btn ${keepObjectAfterPlacement ? 'btn-primary' : 'btn-ghost'}`}
                onClick={() => setKeepObjectAfterPlacement(!keepObjectAfterPlacement)}
              >
                <Lock />
              </button>
              
              <div className="flex-grow"></div>
              
              <button className="btn btn-primary" onClick={handleSaveLevel} disabled={isSaving || !isDirty}>
                {isSaving ? <span className="loading loading-spinner"></span> : <Save />}
                Сохранить
              </button>
            </div>
            <div 
              className="flex-grow w-full h-full flex items-center justify-center overflow-auto bg-base-200"
            >
              <Suspense fallback={<div className="flex-grow flex items-center justify-center"><span className="loading loading-spinner loading-lg"></span></div>}>
                <Canvas
                  width={canvasSize.width}
                  height={canvasSize.height}
                  objects={mapObjects}
                  selectedObjectIds={selectedObjectIds}
                  onSelectObject={handleSelectObject}
                  onSetSelectedObjectIds={handleSetSelectedObjectIds}
                  placingObject={placingObject}
                  setPlacingObject={setPlacingObject}
                  onUpdateObject={handleUpdateObject}
                  onAddObject={handleAddObject}
                  activeTool={activeTool}
                  keepObjectAfterPlacement={keepObjectAfterPlacement}
                />
              </Suspense>
            </div>
          </div>
        </Panel>
        <PanelResizeHandle className="w-2 bg-base-300 hover:bg-primary transition-colors" />
        <Panel defaultSize={rightPanelSize} minSize={15} maxSize={40}>
          <RightPanel
            selectedObject={selectedObject}
            selectedObjectIds={selectedObjectIds}
            onUpdateObject={handleUpdateObject}
            onDeleteObject={handleDeleteObject}
            onCloneObject={handleCloneObject}
            onGroupObjects={handleGroupObjects}
            onUngroupObjects={handleUngroupObjects}
            allObjects={mapObjects}
            onMoveObject={handleMoveObject}
            onSelectObject={handleSelectObject}
            onReorderObjects={handleReorderObjects}
          />
        </Panel>
      </PanelGroup>
    </div>
  );
} 