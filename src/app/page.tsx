'use client';

import { useEffect, useState, useRef } from 'react';
import Toolbar from '@/components/Toolbar';
import LeftPanel from '@/components/LeftPanel';
import RightPanel, { ObjectCategory } from '@/components/RightPanel';
import dynamic from 'next/dynamic';
import { toast } from "sonner"

const Canvas = dynamic(() => import('@/components/Canvas'), {
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
  const [activeTool, setActiveTool] = useState<Tool>('pointer');
  const [leftPanelContent, setLeftPanelContent] = useState<ObjectCategory | "levels" | "settings" | "islands" | null>('islands');
  const [placingObject, setPlacingObject] = useState<PlacingObject | null>(null);
  const [keepAspectRatio, setKeepAspectRatio] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  
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
    const savedDimensions = localStorage.getItem('fruit-dimensions');
    if (savedDimensions) {
      setFruitDimensions(JSON.parse(savedDimensions));
    }
    const savedStoneDimensions = localStorage.getItem('stone-dimensions');
    if (savedStoneDimensions) {
      setStoneDimensions(JSON.parse(savedStoneDimensions));
    }
    const savedWaterDimensions = localStorage.getItem('water-dimensions');
    if (savedWaterDimensions) {
      setWaterDimensions(JSON.parse(savedWaterDimensions));
    }
    const savedTreeDimensions = localStorage.getItem('tree-dimensions');
    if (savedTreeDimensions) {
      setTreeDimensions(JSON.parse(savedTreeDimensions));
    }
    const savedFinishDimensions = localStorage.getItem('finish-dimensions');
    if (savedFinishDimensions) {
      setFinishDimensions(JSON.parse(savedFinishDimensions));
    }
    const savedExtraDimensions = localStorage.getItem('extra-dimensions');
    if (savedExtraDimensions) {
      setExtraDimensions(JSON.parse(savedExtraDimensions));
    }
    const savedIslandDimensions = localStorage.getItem('island-dimensions');
    if (savedIslandDimensions) {
      setIslandDimensions(JSON.parse(savedIslandDimensions));
    }
    const savedStartDimensions = localStorage.getItem('start-dimensions');
    if (savedStartDimensions) {
      setStartDimensions(JSON.parse(savedStartDimensions));
    }
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
    if (!updatedAttrs.id) return;
    const newMapObjects = mapObjects.map(obj => {
      if (obj.id === updatedAttrs.id) {
        return { ...obj, ...updatedAttrs };
      }
      return obj;
    });
    setMapObjects(newMapObjects);

    if (selectedObject && selectedObject.id === updatedAttrs.id) {
      setSelectedObject(prev => ({ ...prev!, ...updatedAttrs }));
    }
  };

  const handleDeleteObject = (id: string) => {
    setMapObjects(mapObjects.filter(obj => obj.id !== id));
    setSelectedObject(null);
  };

  return (
    <>
      <div className="app-container flex flex-col h-screen">
        <main className="main-content flex flex-grow overflow-hidden">
          <div className="left-panel w-[250px] bg-white border-r border-gray-300 flex-shrink-0 flex">
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
          <div className="center-panel flex-grow flex flex-col min-w-0">
            <Toolbar
              activeTool={activeTool}
              onToolSelect={handleToolSelect}
              onSave={handleSaveLevel}
              isSaving={isSaving}
            />
            <div className="canvas-container flex-grow overflow-auto bg-gray-100 p-5 flex justify-center items-center">
              <Canvas
                mapObjects={mapObjects}
                setMapObjects={setMapObjects}
                selectedObject={selectedObject}
                setSelectedObject={setSelectedObject}
                canvasSize={canvasSize}
                placingObject={placingObject}
                setPlacingObject={setPlacingObject}
                keepAspectRatio={keepAspectRatio}
                onUpdateObject={handleUpdateObject}
              />
            </div>
          </div>
          <div className="right-panel w-[250px] bg-white border-l border-gray-300 p-4 overflow-y-auto flex-shrink-0">
            <RightPanel
              mapObjects={mapObjects}
              selectedObject={selectedObject}
              onSelectObject={setSelectedObject}
              onUpdateObject={handleUpdateObject}
              onDeleteObject={handleDeleteObject}
              leftPanelContent={leftPanelContent}
              canvasSize={canvasSize}
              setCanvasSize={setCanvasSize}
              keepAspectRatio={keepAspectRatio}
              setKeepAspectRatio={setKeepAspectRatio}
            />
          </div>
        </main>
      </div>
    </>
  );
} 