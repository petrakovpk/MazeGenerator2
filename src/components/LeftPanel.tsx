import React, { useState, useEffect } from 'react';
import { Levels, PlacingObject } from '@/app/page';
import { data, objectCategories } from '@/lib/data';
import Image from 'next/image';
import { ObjectCategory } from './RightPanel';
import {
  Stack,
  Title,
  Button,
  NavLink,
  UnstyledButton,
  Group,
  Text,
  NumberInput,
  Box,
  Divider,
  Paper,
  Checkbox,
} from '@mantine/core';

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
        <Stack p="md">
          <Button onClick={onCreateLevel} fullWidth>
            Создать новый уровень
          </Button>
          <Stack gap="xs" mt="sm">
            {Object.keys(levels).map((name) => (
              <NavLink
                key={name}
                href="#"
                label={name}
                active={currentLevelName === name}
                onClick={() => loadLevel(name)}
                variant="filled"
              />
            ))}
          </Stack>
        </Stack>
      );
    }
    
    if (content === 'settings') {
      return (
        <Stack p="md">
          <Title order={4}>Настройки</Title>
          <NumberInput
            label="Ширина"
            value={canvasSize.width}
            onChange={(value) => handleSizeChange('width', value)}
          />
          <NumberInput
            label="Высота"
            value={canvasSize.height}
            onChange={(value) => handleSizeChange('height', value)}
          />
        </Stack>
      );
    }

    const categoryData = selectedCategory ? data[selectedCategory] : null;
    const isSizable = selectedCategory && SIZABLE_CATEGORIES.includes(selectedCategory);

    const randomItemName = selectedCategory ? `random_${SINGULAR_ENGLISH_MAP[selectedCategory] || selectedCategory}` : '';
    const randomItemImage = selectedCategory ? `/assets/${selectedCategory}/random_${SINGULAR_ENGLISH_MAP[selectedCategory] || selectedCategory}.png` : '';
    const randomItemAltText = selectedCategory ? `Случайный ${SINGULAR_RUSSIAN_MAP[selectedCategory] || objectCategories[selectedCategory]}` : '';

    return (
      <Stack p="md" gap="lg" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        <Box>
          <Title order={4} mb="md">Элементы</Title>
          <Group>
            {Object.entries(objectCategories).map(([key, name]) => (
              <Button
                key={key}
                variant={selectedCategory === key ? 'filled' : 'light'}
                onClick={() => setSelectedCategory(key as ObjectCategory)}
                radius="md"
              >
                {name}
              </Button>
            ))}
          </Group>
        </Box>

        <Box style={{ flex: '1 1 auto', overflowY: 'auto' }}>
          {selectedCategory && categoryData && (
            <>
              <Divider />
              <div>
                <Title order={4} tt="capitalize" mt="lg" mb="md">
                  {objectCategories[selectedCategory]}
                </Title>
                <Box
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(3, 1fr)',
                    gap: '0.5rem',
                  }}
                >
                  {categoryData.map((item: any) => (
                    <UnstyledButton
                      key={item.name}
                      p="xs"
                      style={{
                        borderRadius: 'var(--mantine-radius-md)',
                        border: placingObject?.name === item.name ? '2px solid var(--mantine-color-blue-6)' : '2px solid transparent',
                      }}
                      className="hover:bg-gray-100"
                      onClick={() => handleItemClick(item)}
                    >
                      <Stack align="center" gap="xs">
                        <Image src={item.image} alt={item.name} width={56} height={56} />
                      </Stack>
                    </UnstyledButton>
                  ))}
                  {isSizable && selectedCategory && (
                    <UnstyledButton
                      key={randomItemName}
                      p="xs"
                      style={{
                        borderRadius: 'var(--mantine-radius-md)',
                        border: placingObject?.name === randomItemName ? '2px solid var(--mantine-color-blue-6)' : '2px solid transparent',
                      }}
                      className="hover:bg-gray-100"
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
                      <Stack align="center" gap="xs">
                        <Image src={randomItemImage} alt={randomItemAltText} width={56} height={56} />
                      </Stack>
                    </UnstyledButton>
                  )}
                </Box>
              </div>
            </>
          )}
        </Box>

        {selectedItemForSizing && (selectedCategory === 'fruits' || selectedCategory === 'stones' || selectedCategory === 'water' || selectedCategory === 'trees' || selectedCategory === 'finish' || selectedCategory === 'extra') && (
          <Box>
            <Divider />
            <Title order={4} tt="capitalize" mt="lg" mb="md">
              Размер для: {selectedItemForSizing}
            </Title>
            <Group>
              <NumberInput
                label="Ширина"
                value={itemSize.width}
                onChange={(value) =>
                  handleDimensionChange(
                    'width',
                    value,
                    selectedCategory as 'fruits' | 'stones' | 'water' | 'trees' | 'finish' | 'extra'
                  )
                }
              />
              <NumberInput
                label="Высота"
                value={itemSize.height}
                onChange={(value) =>
                  handleDimensionChange(
                    'height',
                    value,
                    selectedCategory as 'fruits' | 'stones' | 'water' | 'trees' | 'finish' | 'extra'
                  )
                }
              />
            </Group>
            <Checkbox
              mt="md"
              checked={keepAspectRatio}
              onChange={(event) => setKeepAspectRatio(event.currentTarget.checked)}
              label="Сохранять пропорции"
            />
            <Button mt="md" onClick={handleDimensionSave}>Сохранить</Button>
          </Box>
        )}
      </Stack>
    );
  };

  return <Box py="sm">{renderContent()}</Box>;
};

export default LeftPanel;
