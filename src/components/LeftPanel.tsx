import React, { useState, useEffect } from 'react';
import { Levels, PlacingObject } from '@/app/page';
import { data, objectCategories } from '@/lib/data';
import Image from 'next/image';
import { ObjectCategory } from './RightPanel';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';

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
  const [selectedCategory, setSelectedCategory] = useState<ObjectCategory | null>('islands');
  const [selectedItemForSizing, setSelectedItemForSizing] = useState<string | null>(null);
  const [keepAspectRatio, setKeepAspectRatio] = useState(true);
  const [itemSize, setItemSize] = useState<{ width: number; height: number }>({ width: 0, height: 0 });

  useEffect(() => {
    setSelectedItemForSizing(null);
  }, [selectedCategory]);

  const handleItemClick = (item: { name: string; image: string }) => {
    if (placingObject?.name === item.name) {
      setPlacingObject(null);
      setSelectedItemForSizing(null);
    } else {
      const img = new window.Image();
      img.src = item.image;
      img.onload = () => {
        let width, height;
        const isFruit = selectedCategory === 'fruits';
        const isStone = selectedCategory === 'stones';
        const isWater = selectedCategory === 'water';
        const isTree = selectedCategory === 'trees';
        const isFinish = selectedCategory === 'finish';
        const isExtra = selectedCategory === 'extra';
        
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
    if (selectedItemForSizing && selectedCategory) {
      const changeHandlers = {
        fruits: onFruitDimensionChange,
        stones: onStoneDimensionChange,
        water: onWaterDimensionChange,
        trees: onTreeDimensionChange,
        finish: onFinishDimensionChange,
        extra: onExtraDimensionChange,
      };
      const handler = changeHandlers[selectedCategory as keyof typeof changeHandlers];
      if (handler) {
        handler(selectedItemForSizing, itemSize);
      }
    }
  };

  const renderContent = () => {
    if (content === 'levels') {
      return (
        <div className="p-4 flex flex-col space-y-2">
          <Button onClick={onCreateLevel} className="w-full">
            Создать новый уровень
          </Button>
          <div className="flex flex-col space-y-1 mt-2">
            {Object.keys(levels).map((name) => (
              <Button
                key={name}
                variant={currentLevelName === name ? 'secondary' : 'ghost'}
                onClick={() => loadLevel(name)}
                className="w-full justify-start"
              >
                {name}
              </Button>
            ))}
          </div>
        </div>
      );
    }
    
    if (content === 'settings') {
      return (
        <div className="p-4 flex flex-col space-y-4">
          <h3 className="text-lg font-medium">Настройки</h3>
          <div className="grid gap-2">
            <Label htmlFor="canvas-width">Ширина</Label>
            <Input
              id="canvas-width"
              type="number"
              value={canvasSize.width}
              onChange={(e) => handleSizeChange('width', e.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="canvas-height">Высота</Label>
            <Input
              id="canvas-height"
              type="number"
              value={canvasSize.height}
              onChange={(e) => handleSizeChange('height', e.target.value)}
            />
          </div>
        </div>
      );
    }

    const categoryData = selectedCategory ? data[selectedCategory] : null;
    const isSizable = selectedCategory && SIZABLE_CATEGORIES.includes(selectedCategory);

    const randomItemName = selectedCategory ? `random_${SINGULAR_ENGLISH_MAP[selectedCategory] || selectedCategory}` : '';
    const randomItemImage = selectedCategory ? `/assets/${selectedCategory}/random_${SINGULAR_ENGLISH_MAP[selectedCategory] || selectedCategory}.png` : '';
    const randomItemAltText = selectedCategory ? `Случайный ${SINGULAR_RUSSIAN_MAP[selectedCategory] || objectCategories[selectedCategory]}` : '';

    return (
      <div className="p-4 flex flex-col gap-4 h-full">
        <div>
          <h3 className="text-lg font-medium mb-4">Элементы</h3>
          <div className="flex flex-wrap gap-2">
            {Object.entries(objectCategories).map(([key, name]) => (
              <Button
                key={key}
                variant={selectedCategory === key ? 'secondary' : 'outline'}
                size="sm"
                onClick={() => setSelectedCategory(key as ObjectCategory)}
              >
                {name}
              </Button>
            ))}
          </div>
        </div>

        <div className="flex-grow overflow-y-auto">
          {selectedCategory && categoryData && (
            <>
              <Separator />
              <div>
                <h3 className="text-lg font-medium capitalize mt-6 mb-4">
                  {objectCategories[selectedCategory]}
                </h3>
                <div className="grid grid-cols-3 gap-2">
                  {categoryData.map((item: any) => (
                    <button
                      key={item.name}
                      className={cn(
                        'p-2 rounded-md border-2 hover:bg-accent',
                        placingObject?.name === item.name ? 'border-primary' : 'border-transparent'
                      )}
                      onClick={() => handleItemClick(item)}
                    >
                      <div className="flex flex-col items-center gap-1">
                        <Image src={item.image} alt={item.name} width={56} height={56} />
                      </div>
                    </button>
                  ))}
                  {isSizable && selectedCategory && (
                    <button
                      key={randomItemName}
                      className={cn(
                        'p-2 rounded-md border-2 hover:bg-accent',
                        placingObject?.name === randomItemName ? 'border-primary' : 'border-transparent'
                      )}
                      onClick={() => {
                        if (placingObject?.name === randomItemName) {
                          setPlacingObject(null);
                          setSelectedItemForSizing(null);
                        } else {
                          const allDimensions = {
                              fruits: fruitDimensions,
                              stones: stoneDimensions,
                              water: waterDimensions,
                              trees: treeDimensions,
                              finish: finishDimensions,
                              extra: extraDimensions,
                          };
                          const categoryKey = selectedCategory as keyof typeof allDimensions;
                          const categoryDimensions = allDimensions[categoryKey];
                          const savedDim = categoryDimensions ? categoryDimensions[randomItemName] : undefined;

                          const width = savedDim?.width || 64;
                          const height = savedDim?.height || 64;
                          setPlacingObject({
                            name: randomItemName,
                            image: randomItemImage,
                            width,
                            height,
                            originalWidth: width,
                            originalHeight: height,
                          });
                          setSelectedItemForSizing(randomItemName);
                        }
                      }}
                    >
                      <div className="flex flex-col items-center gap-1">
                        <Image src={randomItemImage} alt={randomItemAltText} width={56} height={56} />
                      </div>
                    </button>
                  )}
                </div>
              </div>
            </>
          )}
        </div>

        {selectedItemForSizing && (selectedCategory === 'fruits' || selectedCategory === 'stones' || selectedCategory === 'water' || selectedCategory === 'trees' || selectedCategory === 'finish' || selectedCategory === 'extra') && (
          <div>
            <Separator />
            <h3 className="text-lg font-medium capitalize mt-6 mb-4">
              Размер для: {selectedItemForSizing}
            </h3>
            <div className="flex gap-4">
              <div className="grid gap-2">
                <Label htmlFor="item-width">Ширина</Label>
                <Input
                  id="item-width"
                  type="number"
                  value={itemSize.width}
                  onChange={(e) =>
                    handleDimensionChange(
                      'width',
                      e.target.value,
                      selectedCategory as 'fruits' | 'stones' | 'water' | 'trees' | 'finish' | 'extra'
                    )
                  }
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="item-height">Высота</Label>
                <Input
                  id="item-height"
                  type="number"
                  value={itemSize.height}
                  onChange={(e) =>
                    handleDimensionChange(
                      'height',
                      e.target.value,
                      selectedCategory as 'fruits' | 'stones' | 'water' | 'trees' | 'finish' | 'extra'
                    )
                  }
                />
              </div>
            </div>
            <div className="flex items-center space-x-2 mt-4">
              <Checkbox
                id="keep-aspect-ratio"
                checked={keepAspectRatio}
                onCheckedChange={(checked) => setKeepAspectRatio(Boolean(checked))}
              />
              <Label htmlFor="keep-aspect-ratio">Сохранять пропорции</Label>
            </div>
            <Button className="mt-4" onClick={handleDimensionSave}>Сохранить</Button>
          </div>
        )}
      </div>
    );
  };

  return <div className="py-2">{renderContent()}</div>;
};

export default LeftPanel;
