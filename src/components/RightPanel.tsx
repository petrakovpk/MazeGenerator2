import React, { useState } from 'react';
import { MapObject } from '@/app/page';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Trash2 } from 'lucide-react';
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
      <div className="p-4 space-y-4">
        <h3 className="text-lg font-medium">Размеры уровня</h3>
        <div className="grid gap-2">
          <Label htmlFor="width">Ширина</Label>
          <Input
            id="width"
            type="number"
            value={canvasSize.width}
            onChange={(e) => handleCanvasSizeChange('width', e.target.value)}
            min={100}
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="height">Высота</Label>
          <Input
            id="height"
            type="number"
            value={canvasSize.height}
            onChange={(e) => handleCanvasSizeChange('height', e.target.value)}
            min={100}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 h-full flex flex-col">
      <Tabs value={view} onValueChange={(value) => setView(value as 'properties' | 'tree')} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="properties">Свойства</TabsTrigger>
          <TabsTrigger value="tree">Дерево</TabsTrigger>
        </TabsList>
        <TabsContent value="tree" className="flex-grow">
          <div className="space-y-4 mt-4">
            <h3 className="text-lg font-medium">Дерево объектов</h3>
            <ObjectTree objects={mapObjects} onSelectObject={onSelectObject} selectedObject={selectedObject} />
          </div>
        </TabsContent>
        <TabsContent value="properties" className="flex-grow">
          <div className="space-y-4 mt-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium">Свойства объекта</h3>
              {selectedObject && (
                <Button variant="destructive" size="icon" onClick={() => onDeleteObject(selectedObject.id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>
            
            {!selectedObject ? (
              <p className="text-muted-foreground">Объект не выбран</p>
            ) : (
              <>
                <div className="grid gap-2">
                  <Label htmlFor="name">Имя</Label>
                  <Input
                    id="name"
                    value={selectedObject.name}
                    onChange={(event) => onUpdateObject({ ...selectedObject, name: event.currentTarget.value })}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="width">Ширина (пикс.)</Label>
                  <Input
                    id="width"
                    type="number"
                    value={Math.round(selectedObject.width)}
                    onChange={(e) => handleInputChange('width', e.target.value)}
                    min={1}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="height">Высота (пикс.)</Label>
                  <Input
                    id="height"
                    type="number"
                    value={Math.round(selectedObject.height)}
                    onChange={(e) => handleInputChange('height', e.target.value)}
                    min={1}
                  />
                </div>
                {selectedObject.originalWidth && (
                  <div className="grid gap-2">
                    <Label htmlFor="widthPercent">Ширина (%)</Label>
                    <Input
                      id="widthPercent"
                      type="number"
                      value={Math.round((selectedObject.width / selectedObject.originalWidth) * 100)}
                      onChange={(e) => handleInputChange('widthPercent', e.target.value)}
                      min={1}
                    />
                  </div>
                )}
                {selectedObject.originalHeight && (
                  <div className="grid gap-2">
                    <Label htmlFor="heightPercent">Высота (%)</Label>
                    <Input
                      id="heightPercent"
                      type="number"
                      value={Math.round((selectedObject.height / selectedObject.originalHeight) * 100)}
                      onChange={(e) => handleInputChange('heightPercent', e.target.value)}
                      min={1}
                    />
                  </div>
                )}
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="keepAspectRatio"
                    checked={keepAspectRatio}
                    onCheckedChange={(checked) => setKeepAspectRatio(Boolean(checked))}
                  />
                  <Label htmlFor="keepAspectRatio">Сохранять пропорции</Label>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <Button 
                    variant="outline" 
                    onClick={() => onUpdateObject({ ...selectedObject, flipX: !selectedObject.flipX })}>
                      Отразить X
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => onUpdateObject({ ...selectedObject, flipY: !selectedObject.flipY })}>
                      Отразить Y
                  </Button>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="isLocked"
                    checked={selectedObject.isLocked}
                    onCheckedChange={(checked) => handleInputChange('isLocked', Boolean(checked))}
                  />
                  <Label htmlFor="isLocked">Заблокировать</Label>
                </div>
              </>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default RightPanel;
