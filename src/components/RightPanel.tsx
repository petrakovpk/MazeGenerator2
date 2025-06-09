import React, { useState } from 'react';
import { MapObject } from '@/app/page';
import {
  Stack,
  Title,
  Text,
  TextInput,
  NumberInput,
  Checkbox,
  Button,
  Paper,
  Divider,
  Group,
  ActionIcon,
  SegmentedControl,
} from '@mantine/core';
import { IconTrash } from '@tabler/icons-react';
import ObjectTree from './ObjectTree';

export type ObjectCategory = 'islands' | 'start' | 'fruits' | 'stones' | 'water' | 'trees' | 'finish' | 'extra';

interface RightPanelProps {
  mapObjects: MapObject[];
  selectedObject: MapObject | null;
  onSelectObject: (object: MapObject) => void;
  onUpdateObject: (updatedObject: MapObject) => void;
  onDeleteObject: (id: string) => void;
  leftPanelContent: 'islands' | 'settings' | 'levels' | ObjectCategory | null;
  canvasSize: { width: number; height: number };
  setCanvasSize: (size: { width: number; height: number }) => void;
  keepAspectRatio: boolean;
  setKeepAspectRatio: (value: boolean) => void;
}

const RightPanel: React.FC<RightPanelProps> = ({
  mapObjects,
  selectedObject,
  onSelectObject,
  onUpdateObject,
  onDeleteObject,
  leftPanelContent,
  canvasSize,
  setCanvasSize,
  keepAspectRatio,
  setKeepAspectRatio,
}) => {
  const [view, setView] = useState<'properties' | 'tree'>('properties');

  const handleInputChange = (id: string, value: any) => {
    if (!selectedObject) return;

    let newObject: MapObject = { ...selectedObject, [id]: value };

    if (keepAspectRatio) {
      if (id === 'width' && selectedObject.originalWidth && selectedObject.originalHeight) {
        const aspectRatio = selectedObject.originalHeight / selectedObject.originalWidth;
        newObject.height = Number(value) * aspectRatio;
      } else if (id === 'height' && selectedObject.originalWidth && selectedObject.originalHeight) {
        const aspectRatio = selectedObject.originalWidth / selectedObject.originalHeight;
        newObject.width = Number(value) * aspectRatio;
      } else if (id === 'widthPercent' && selectedObject.originalWidth && selectedObject.originalHeight) {
        newObject.height = selectedObject.originalHeight * (Number(value) / 100);
      } else if (id === 'heightPercent' && selectedObject.originalWidth && selectedObject.originalHeight) {
        newObject.width = selectedObject.originalWidth * (Number(value) / 100);
      }
    }

    if (id === 'widthPercent' && selectedObject.originalWidth) {
      newObject.width = selectedObject.originalWidth * (Number(value) / 100);
    } else if (id === 'heightPercent' && selectedObject.originalHeight) {
      newObject.height = selectedObject.originalHeight * (Number(value) / 100);
    }
    
    onUpdateObject(newObject);
  };

  const handleCanvasSizeChange = (id: 'width' | 'height', value: number | string) => {
    const newSize = {
      ...canvasSize,
      [id]: Number(value) || 0,
    };
    setCanvasSize(newSize);
  };

  if (leftPanelContent === 'levels') {
    return (
      <Stack>
        <Title order={4}>Размеры уровня</Title>
        <NumberInput
          label="Ширина"
          id="width"
          value={canvasSize.width}
          onChange={(value) => handleCanvasSizeChange('width', value)}
          min={100}
        />
        <NumberInput
          label="Высота"
          id="height"
          value={canvasSize.height}
          onChange={(value) => handleCanvasSizeChange('height', value)}
          min={100}
        />
      </Stack>
    );
  }

  return (
    <Stack>
      <SegmentedControl
        value={view}
        onChange={(value) => setView(value as 'properties' | 'tree')}
        data={[
          { label: 'Свойства', value: 'properties' },
          { label: 'Дерево', value: 'tree' },
        ]}
        fullWidth
      />

      {view === 'tree' && (
        <Stack>
          <Title order={4}>Дерево объектов</Title>
          <ObjectTree objects={mapObjects} onSelectObject={onSelectObject} selectedObject={selectedObject} />
        </Stack>
      )}
      
      {view === 'properties' && (
        <>
          <Group justify="space-between">
            <Title order={4}>Свойства объекта</Title>
            {selectedObject && (
              <ActionIcon variant="light" color="red" onClick={() => onDeleteObject(selectedObject.id)}>
                <IconTrash size={18} />
              </ActionIcon>
            )}
          </Group>
          
          {!selectedObject ? (
            <Text c="dimmed">Объект не выбран</Text>
          ) : (
            <>
              <TextInput
                label="Имя"
                value={selectedObject.name}
                onChange={(event) => onUpdateObject({ ...selectedObject, name: event.currentTarget.value })}
              />
              <NumberInput
                label="Ширина (пикс.)"
                id="width"
                value={Math.round(selectedObject.width)}
                onChange={(value) => handleInputChange('width', value)}
                min={1}
              />
              <NumberInput
                label="Высота (пикс.)"
                id="height"
                value={Math.round(selectedObject.height)}
                onChange={(value) => handleInputChange('height', value)}
                min={1}
              />
              {selectedObject.originalWidth && (
                <NumberInput
                  label="Ширина (%)"
                  value={Math.round((selectedObject.width / selectedObject.originalWidth) * 100)}
                  onChange={(value) => handleInputChange('widthPercent', value)}
                  min={1}
                />
              )}
              {selectedObject.originalHeight && (
                <NumberInput
                  label="Высота (%)"
                  value={Math.round((selectedObject.height / selectedObject.originalHeight) * 100)}
                  onChange={(value) => handleInputChange('heightPercent', value)}
                  min={1}
                />
              )}
              <Checkbox
                checked={keepAspectRatio}
                onChange={(event) => setKeepAspectRatio(event.currentTarget.checked)}
                label="Сохранять пропорции"
              />
              <Group grow>
                <Button 
                  variant="default" 
                  onClick={() => onUpdateObject({ ...selectedObject, flipX: !selectedObject.flipX })}>
                    Отразить X
                </Button>
                <Button 
                  variant="default" 
                  onClick={() => onUpdateObject({ ...selectedObject, flipY: !selectedObject.flipY })}>
                    Отразить Y
                </Button>
              </Group>
              <Checkbox
                id="isLocked"
                label="Заблокировать"
                checked={selectedObject.isLocked}
                onChange={(event) => handleInputChange('isLocked', event.currentTarget.checked)}
              />
            </>
          )}
        </>
      )}
    </Stack>
  );
};

export default RightPanel;
