import React, { useState, useEffect } from 'react';
import { Levels, PlacingObject } from '../App';
import { data, objectCategories } from '../lib/data';
import { ObjectCategory } from './RightPanel';
import {
  Apple,
  Component,
  PlayCircle,
  PlusCircle,
  Trees,
  Waves,
  CheckCircle2,
  Sailboat,
} from 'lucide-react';

const SIZABLE_CATEGORIES: string[] = ['islands', 'start', 'fruits', 'stones', 'water', 'trees', 'finish', 'extra'];
const SINGULAR_RUSSIAN_MAP: Partial<Record<string, string>> = {
    islands: 'остров',
    start: 'старт',
    fruits: 'фрукт',
    stones: 'камень',
    trees: 'дерево',
    finish: 'финиш',
    extra: 'экстра',
    water: 'объект',
};
const SINGULAR_ENGLISH_MAP: Partial<Record<ObjectCategory, string>> = {
    fruits: 'fruit',
    stones: 'stone',
    trees: 'tree',
    finish: 'finish',
    extra: 'extra',
    water: 'water',
};

const iconMap: Record<string, React.ElementType> = {
  islands: Sailboat,
  start: PlayCircle,
  fruits: Apple,
  stones: Component,
  water: Waves,
  trees: Trees,
  finish: CheckCircle2,
  extra: PlusCircle,
};

export type LeftPanelContent = 'islands' | 'settings' | ObjectCategory | null;

interface LeftPanelProps {
  levels: Levels;
  currentLevelName: string;
  loadLevel: (name: string) => void;
  onCreateLevel: () => void;
  canvasSize: { width: number; height: number };
  setCanvasSize: (size: { width: number; height: number }) => void;
  placingObject: PlacingObject | null;
  setPlacingObject: (obj: PlacingObject | null) => void;
  islandDimensions: Record<string, { width: number; height: number }>;
  onIslandDimensionChange: (name: string, size: { width: number; height: number }) => void;
  startDimensions: Record<string, { width: number; height: number }>;
  onStartDimensionChange: (name: string, size: { width: number; height: number }) => void;
  fruitDimensions: Record<string, { width: number; height: number }>;
  onFruitDimensionChange: (name: string, size: { width: number; height: number }) => void;
  stoneDimensions: Record<string, { width: number; height: number }>;
  onStoneDimensionChange: (name: string, size: { width: number; height: number }) => void;
  waterDimensions: Record<string, { width: number; height: number }>;
  onWaterDimensionChange: (name: string, size: { width: number; height: number }) => void;
  treeDimensions: Record<string, { width: number; height: number }>;
  onTreeDimensionChange: (name: string, size: { width: number; height: number }) => void;
  finishDimensions: Record<string, { width: number; height: number }>;
  onFinishDimensionChange: (name:string, size: { width: number; height: number }) => void;
  extraDimensions: Record<string, { width: number; height: number }>;
  onExtraDimensionChange: (name: string, size: { width: number; height: number }) => void;
}

const LeftPanel: React.FC<LeftPanelProps> = ({
  levels,
  currentLevelName,
  loadLevel,
  onCreateLevel,
  canvasSize,
  setCanvasSize,
  placingObject,
  setPlacingObject,
  islandDimensions,
  onIslandDimensionChange,
  startDimensions,
  onStartDimensionChange,
  fruitDimensions,
  onFruitDimensionChange,
  stoneDimensions,
  onStoneDimensionChange,
  waterDimensions,
  onWaterDimensionChange,
  treeDimensions,
  onTreeDimensionChange,
  finishDimensions,
  onFinishDimensionChange,
  extraDimensions,
  onExtraDimensionChange,
}) => {
  const [view, setView] = useState<'editor' | 'levels'>('editor');
  const [content, setContent] = useState<LeftPanelContent>('islands');
  const [selectedItemForSizing, setSelectedItemForSizing] = useState<string | null>(null);
  const [keepAspectRatio, setKeepAspectRatio] = useState(true);
  const [itemSize, setItemSize] = useState<{ width: number; height: number }>({ width: 0, height: 0 });

  useEffect(() => {
    setSelectedItemForSizing(null);
  }, [content]);

  const handleItemClick = (item: { name: string; image: string }) => {
    if (placingObject?.name === item.name) {
      setPlacingObject(null);
      setSelectedItemForSizing(null);
    } else {
      const img = new window.Image();
      img.src = item.image;
      img.onload = () => {
        let width, height;
        const isSizable = content && SIZABLE_CATEGORIES.includes(content);

        let dimensions: Record<string, { width: number; height: number }> | undefined;

        if (content === 'islands') dimensions = islandDimensions;
        if (content === 'start') dimensions = startDimensions;
        if (content === 'fruits') dimensions = fruitDimensions;
        if (content === 'stones') dimensions = stoneDimensions;
        if (content === 'water') dimensions = waterDimensions;
        if (content === 'trees') dimensions = treeDimensions;
        if (content === 'finish') dimensions = finishDimensions;
        if (content === 'extra') dimensions = extraDimensions;
        
        const savedDim = dimensions?.[item.name];

        if (isSizable && savedDim) {
          width = savedDim.width;
          height = savedDim.height;
        } else if (isSizable) {
          width = 64;
          if (img.naturalWidth > 0) {
            height = Math.round(width * (img.naturalHeight / img.naturalWidth));
          } else {
            height = 64;
          }
        } else {
          const MAX_DIM = 128;
          const scale = Math.min(1, MAX_DIM / img.naturalWidth, MAX_DIM / img.naturalHeight);
          width = img.naturalWidth * scale;
          height = img.naturalHeight * scale;
        }

        setPlacingObject({
          ...item,
          width,
          height,
          originalWidth: img.naturalWidth,
          originalHeight: img.naturalHeight,
        } as PlacingObject);

        if (isSizable) {
          setSelectedItemForSizing(item.name);
          setItemSize({ width, height });
        } else {
          setSelectedItemForSizing(null);
        }
      };
    }
  };

  const handleSizeChange = (key: 'width' | 'height', value: string | number) => {
    const numValue = Number(value);
    if (!isNaN(numValue) && numValue > 0) {
      setCanvasSize({ ...canvasSize, [key]: numValue });
    }
  };

  const handleDimensionChange = (key: 'width' | 'height', value: string | number) => {
    const numValue = Number(value);
    if (!selectedItemForSizing || isNaN(numValue) || numValue <= 0) {
      return;
    }

    if (keepAspectRatio) {
      if (placingObject?.originalWidth && placingObject?.originalHeight) {
        const ratio = placingObject.originalWidth / placingObject.originalHeight;
        if (key === 'width') {
          setItemSize({ width: numValue, height: Math.round(numValue / ratio) });
        } else {
          setItemSize({ width: Math.round(numValue * ratio), height: numValue });
        }
      }
    } else {
      setItemSize((prev) => ({ ...prev, [key]: numValue }));
    }
  };

  const handleDimensionSave = () => {
    if (!selectedItemForSizing || !content) return;

    switch (content) {
      case 'islands':
        onIslandDimensionChange(selectedItemForSizing, itemSize);
        break;
      case 'start':
        onStartDimensionChange(selectedItemForSizing, itemSize);
        break;
      case 'fruits':
        onFruitDimensionChange(selectedItemForSizing, itemSize);
        break;
      case 'stones':
        onStoneDimensionChange(selectedItemForSizing, itemSize);
        break;
      case 'water':
        onWaterDimensionChange(selectedItemForSizing, itemSize);
        break;
      case 'trees':
        onTreeDimensionChange(selectedItemForSizing, itemSize);
        break;
      case 'finish':
        onFinishDimensionChange(selectedItemForSizing, itemSize);
        break;
      case 'extra':
        onExtraDimensionChange(selectedItemForSizing, itemSize);
        break;
    }

    if (placingObject) {
      setPlacingObject({
        ...placingObject,
        width: itemSize.width,
        height: itemSize.height,
      });
    }
  };

  const renderLevels = () => (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Уровни</h2>
      <div className="flex flex-col gap-2">
        {Object.keys(levels).map((name) => (
          <button
            key={name}
            className={`btn ${name === currentLevelName ? 'btn-active' : ''}`}
            onClick={() => loadLevel(name)}
          >
            {name}
          </button>
        ))}
      </div>
      <button onClick={onCreateLevel} className="btn btn-primary mt-4 w-full">
        Создать новый уровень
      </button>
    </div>
  );

  const renderEditor = () => (
    <>
      <div className="tabs tabs-bordered px-4 pt-2">
        {(Object.entries(objectCategories) as [ObjectCategory, string][]).map(([id, name]) => {
          const Icon = iconMap[id] || Component;
          return (
            <a
              key={id}
              className={`tab tab-bordered ${content === id ? 'tab-active' : ''}`}
              onClick={() => setContent(id)}
            >
              <Icon className="h-5 w-5 mr-2" />
              {name}
            </a>
          );
        })}
      </div>

      <div className="flex-grow p-4 overflow-y-auto">
        {content && content !== 'settings' && data[content as ObjectCategory] && (
          <div className="grid grid-cols-2 gap-2">
            {data[content as ObjectCategory].map((item: any) => (
              <div
                key={item.name}
                className={`card card-compact bg-base-200 cursor-pointer transition-all duration-200 ${
                  placingObject?.name === item.name ? 'ring-2 ring-primary ring-offset-2 ring-offset-base-100' : ''
                }`}
                onClick={() => handleItemClick(item)}
              >
                <figure className="px-2 pt-2">
                  <img src={item.image} alt={item.name} className="rounded-xl h-20 object-contain" />
                </figure>
                <div className="card-body items-center text-center p-2">
                  <h2 className="card-title text-sm">{item.name}</h2>
                </div>
              </div>
            ))}
          </div>
        )}

        {content && SIZABLE_CATEGORIES.includes(content) && selectedItemForSizing && (
          <div className="mt-4 p-4 rounded-lg bg-base-200 space-y-4">
            <h3 className="font-bold text-center">
              Размер для <span className='text-primary'>{selectedItemForSizing}</span>
            </h3>
            <div className="form-control">
              <label className="label cursor-pointer">
                <span className="label-text">Сохранять пропорции</span>
                <input
                  type="checkbox"
                  className="toggle toggle-primary"
                  checked={keepAspectRatio}
                  onChange={(e) => setKeepAspectRatio(e.target.checked)}
                />
              </label>
            </div>
            <div className="flex gap-2">
              <div className="form-control w-full">
                <label className="label">
                  <span className="label-text">Ширина</span>
                </label>
                <input
                  type="number"
                  className="input input-bordered w-full"
                  value={Math.round(itemSize.width)}
                  onChange={(e) => handleDimensionChange('width', e.target.value)}
                />
              </div>
              <div className="form-control w-full">
                <label className="label">
                  <span className="label-text">Высота</span>
                </label>
                <input
                  type="number"
                  className="input input-bordered w-full"
                  value={Math.round(itemSize.height)}
                  onChange={(e) => handleDimensionChange('height', e.target.value)}
                />
              </div>
            </div>
            <button className="btn btn-primary btn-sm w-full" onClick={handleDimensionSave}>
              Применить размер для всех "{SINGULAR_RUSSIAN_MAP[content]}"
            </button>
          </div>
        )}

        {content === 'settings' && (
          <div>
            <h2 className="text-xl font-bold mb-4">Настройки холста</h2>
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text">Ширина холста (px)</span>
              </label>
              <input
                type="number"
                className="input input-bordered w-full"
                value={canvasSize.width}
                onChange={(e) => handleSizeChange('width', e.target.value)}
              />
            </div>
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text">Высота холста (px)</span>
              </label>
              <input
                type="number"
                className="input input-bordered w-full"
                value={canvasSize.height}
                onChange={(e) => handleSizeChange('height', e.target.value)}
              />
            </div>
          </div>
        )}
      </div>
    </>
  );

  return (
    <div className="flex flex-col h-full">
      <div className="tabs tabs-boxed flex-shrink-0 m-4">
        <a 
          className={`tab flex-grow ${view === 'editor' ? 'tab-active' : ''}`}
          onClick={() => setView('editor')}
        >
          Редактор
        </a>
        <a 
          className={`tab flex-grow ${view === 'levels' ? 'tab-active' : ''}`}
          onClick={() => setView('levels')}
        >
          Уровни
        </a>
      </div>
      <div className="flex-grow flex flex-col overflow-y-auto">
        {view === 'editor' ? renderEditor() : renderLevels()}
      </div>
    </div>
  );
};

export default LeftPanel;
