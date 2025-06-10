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

const SIZABLE_CATEGORIES: ObjectCategory[] = ['fruits', 'stones', 'water', 'trees', 'finish', 'extra'];
const SINGULAR_RUSSIAN_MAP: Partial<Record<ObjectCategory, string>> = {
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

export type LeftPanelContent = 'islands' | 'settings' | 'levels' | ObjectCategory | null;

interface LeftPanelProps {
  content: LeftPanelContent;
  setContent: (content: LeftPanelContent) => void;
  levels: Levels;
  currentLevelName: string;
  loadLevel: (name: string) => void;
  onCreateLevel: () => void;
  canvasSize: { width: number; height: number };
  setCanvasSize: (size: { width: number; height: number }) => void;
  placingObject: PlacingObject | null;
  setPlacingObject: (obj: PlacingObject | null) => void;
  fruitDimensions: Record<string, { width: number; height: number }>;
  onFruitDimensionChange: (name: string, size: { width: number; height: number }) => void;
  stoneDimensions: Record<string, { width: number; height: number }>;
  onStoneDimensionChange: (name: string, size: { width: number; height: number }) => void;
  waterDimensions: Record<string, { width: number; height: number }>;
  onWaterDimensionChange: (name: string, size: { width: number; height: number }) => void;
  treeDimensions: Record<string, { width: number; height: number }>;
  onTreeDimensionChange: (name: string, size: { width: number; height: number }) => void;
  finishDimensions: Record<string, { width: number; height: number }>;
  onFinishDimensionChange: (name: string, size: { width: number; height: number }) => void;
  extraDimensions: Record<string, { width: number; height: number }>;
  onExtraDimensionChange: (name: string, size: { width: number; height: number }) => void;
}

const LeftPanel: React.FC<LeftPanelProps> = ({
  content,
  setContent,
  levels,
  currentLevelName,
  loadLevel,
  onCreateLevel,
  canvasSize,
  setCanvasSize,
  placingObject,
  setPlacingObject,
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
        const isFruit = content === 'fruits';
        const isStone = content === 'stones';
        const isWater = content === 'water';
        const isTree = content === 'trees';
        const isFinish = content === 'finish';
        const isExtra = content === 'extra';
        
        let dimensions = fruitDimensions;
        if (isStone) dimensions = stoneDimensions;
        if (isWater) dimensions = waterDimensions;
        if (isTree) dimensions = treeDimensions;
        if (isFinish) dimensions = finishDimensions;
        if (isExtra) dimensions = extraDimensions;

        const savedDim = dimensions[item.name];

        if ((isFruit || isStone || isWater || isTree || isFinish || isExtra) && savedDim) {
          width = savedDim.width;
          height = savedDim.height;
        } else if (isFruit || isStone || isWater || isTree || isFinish || isExtra) {
          width = 64;
          height = 64;
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

        if (isFruit || isStone || isWater || isTree || isFinish || isExtra) {
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

  const handleDimensionChange = (
    key: 'width' | 'height',
    value: string | number,
    category: 'fruits' | 'stones' | 'water' | 'trees' | 'finish' | 'extra'
  ) => {
    const numValue = Number(value);
    if (selectedItemForSizing && !isNaN(numValue) && numValue > 0) {
      if (keepAspectRatio) {
        const dimensions = { fruitDimensions, stoneDimensions, waterDimensions, treeDimensions, finishDimensions, extraDimensions };
        const dimKey = `${category}Dimensions` as keyof typeof dimensions;
        const originalDim = dimensions[dimKey][selectedItemForSizing];
        const ratio = originalDim ? originalDim.width / originalDim.height : 1;

        if (key === 'width') {
          setItemSize({ width: numValue, height: Math.round(numValue / ratio) });
        } else {
          setItemSize({ width: Math.round(numValue * ratio), height: numValue });
        }
      } else {
        setItemSize((prev) => ({ ...prev, [key]: numValue }));
      }
    }
  };

  const handleDimensionSave = () => {
    if (!selectedItemForSizing || !content) return;

    switch (content) {
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

  const renderContent = () => {
    if (content === 'levels') {
      return (
        <div className="p-4">
          <h2 className="text-xl font-bold mb-4">Уровни</h2>
          <div className="flex flex-col gap-2">
            {Object.keys(levels).map((name) => (
              <button
                key={name}
                className={`btn ${name === currentLevelName ? 'btn-primary' : 'btn-ghost'}`}
                onClick={() => loadLevel(name)}
              >
                {name}
              </button>
            ))}
          </div>
          <button 
            className="btn btn-outline btn-sm mt-4 w-full" 
            onClick={onCreateLevel}
          >
            <PlusCircle className="h-4 w-4 mr-2" />
            Создать уровень
          </button>
        </div>
      );
    }

    if (content === 'settings') {
      return (
        <div className="p-4">
          <h2 className="text-xl font-bold mb-4">Настройки</h2>
          <div className="form-control w-full">
            <label className="label">
              <span className="label-text">Ширина карты (пикс.)</span>
            </label>
            <input
              className="input input-bordered w-full"
              type="number"
              value={canvasSize.width}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleSizeChange('width', e.target.value)}
              min={100}
              step={50}
            />
          </div>
          <div className="form-control w-full mt-2">
            <label className="label">
              <span className="label-text">Высота карты (пикс.)</span>
            </label>
            <input
              className="input input-bordered w-full"
              type="number"
              value={canvasSize.height}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleSizeChange('height', e.target.value)}
              min={100}
              step={50}
            />
          </div>
        </div>
      );
    }

    // Категории объектов
    const categoryEntries = Object.entries(objectCategories) as [ObjectCategory, string][];
    const categories = categoryEntries.map(([id, name]) => ({
      id,
      name,
      icon: iconMap[id],
    }));

    return (
      <div className="flex flex-col h-full">
        <div className="p-4 bg-base-200/30 border-b border-base-300">
          <h2 className="text-lg font-semibold mb-2">Категории</h2>
          <div className="tabs tabs-boxed w-full">
            {categories.map((category) => (
              <a
                key={category.id}
                className={`tab flex-grow ${content === category.id ? 'tab-active' : ''}`}
                onClick={() => setContent(category.id)}
              >
                {category.name}
              </a>
            ))}
          </div>
        </div>

        <div className="flex-grow overflow-y-auto p-4">
          <h2 className="text-xl font-bold mb-4">{
            content === 'islands' ? 'Остров' :
            content === 'start' ? 'Старт' :
            content === 'fruits' ? 'Фрукты' :
            content === 'stones' ? 'Камни' :
            content === 'water' ? 'Вода' :
            content === 'trees' ? 'Деревья' :
            content === 'finish' ? 'Финиш' :
            'Экстра'
          }</h2>

          {content && (
            <div className="grid grid-cols-3 gap-2">
              {data[content]?.map((item, index) => (
                <div 
                  key={`${item.name}-${index}`}
                  className={`flex flex-col items-center justify-center p-2 rounded-lg cursor-pointer transition-all border-2 ${placingObject?.name === item.name ? 'border-primary bg-primary/10' : 'border-transparent hover:bg-base-200'}`}
                  onClick={() => handleItemClick(item)}
                >
                  <div className="w-16 h-16 flex items-center justify-center">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="max-w-full max-h-full object-contain"
                    />
                  </div>
                  <span className="text-xs mt-1 text-center break-all">{item.name}</span>
                </div>
              ))}
            </div>
          )}

          {selectedItemForSizing && SIZABLE_CATEGORIES.includes(content as ObjectCategory) && (
            <div className="mt-4 p-4 border-t border-base-300 bg-base-200/30 rounded-lg">
              <h3 className="text-lg font-semibold mb-3">
                Размер для{' '}
                <span className="font-bold text-primary">{
                  (SINGULAR_RUSSIAN_MAP[content as ObjectCategory] || 'объекта') + ' ' + selectedItemForSizing
                }</span>
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

              <div className="grid grid-cols-2 gap-2 mt-2">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Ширина</span>
                  </label>
                  <input
                    type="number"
                    className="input input-sm input-bordered"
                    value={Math.round(itemSize.width)}
                    onChange={(e) => {
                      if (SIZABLE_CATEGORIES.includes(content as ObjectCategory)) {
                        handleDimensionChange('width', e.target.value, content as any)
                      }
                    }}
                    min={8}
                  />
                </div>
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Высота</span>
                  </label>
                  <input
                    type="number"
                    className="input input-sm input-bordered"
                    value={Math.round(itemSize.height)}
                    onChange={(e) => {
                      if (SIZABLE_CATEGORIES.includes(content as ObjectCategory)) {
                        handleDimensionChange('height', e.target.value, content as any)
                      }
                    }}
                    min={8}
                    disabled={keepAspectRatio}
                  />
                </div>
              </div>
              
              <button
                className="btn btn-primary btn-sm mt-3 w-full"
                onClick={handleDimensionSave}
              >
                Сохранить размер
              </button>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="h-full flex flex-col overflow-y-auto">
      {renderContent()}
    </div>
  );
};

export default LeftPanel;
