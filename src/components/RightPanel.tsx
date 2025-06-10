import React, { useState, useEffect } from 'react';
import { MapObject } from '../App';
import { Trash2, Lock, Unlock, Copy, Group, Ungroup } from 'lucide-react';
import ObjectTree from './ObjectTree';

export type ObjectCategory = 'islands' | 'start' | 'fruits' | 'stones' | 'water' | 'trees' | 'finish' | 'extra';

interface RightPanelProps {
  selectedObject: MapObject | null;
  selectedObjectIds: string[];
  onUpdateObject: (updatedAttrs: Partial<MapObject>) => void;
  onDeleteObject: (id: string) => void;
  onCloneObject: (id: string) => void;
  onGroupObjects: () => void;
  onUngroupObjects: (id: string) => void;
  allObjects: MapObject[];
  onMoveObject: (id: string, direction: 'up' | 'down') => void;
  onSelectObject: (object: MapObject, isMultiSelect: boolean, isShiftSelect: boolean) => void;
  onReorderObjects: (startIndex: number, endIndex: number) => void;
}

const RightPanel: React.FC<RightPanelProps> = ({
  selectedObject,
  selectedObjectIds,
  onUpdateObject,
  onDeleteObject,
  onCloneObject,
  onGroupObjects,
  onUngroupObjects,
  allObjects,
  onMoveObject,
  onSelectObject,
  onReorderObjects,
}) => {
  const [keepAspectRatio, setKeepAspectRatio] = useState(true);
  const [view, setView] = useState<'properties' | 'tree'>('tree');

  const safeSelectedObjectIds = selectedObjectIds || [];

  const handleInputChange = (id: string, value: any) => {
    if (!selectedObject) return;

    let newAttrs: Partial<MapObject> = { [id]: value };

    if (keepAspectRatio) {
      const originalWidth = selectedObject.originalWidth || selectedObject.width;
      const originalHeight = selectedObject.originalHeight || selectedObject.height;

      if (id === 'width' && originalWidth && originalHeight) {
        const aspectRatio = originalHeight / originalWidth;
        newAttrs.height = Number(value) * aspectRatio;
      } else if (id === 'height' && originalWidth && originalHeight) {
        const aspectRatio = originalWidth / originalHeight;
        newAttrs.width = Number(value) * aspectRatio;
      }
    }
    
    onUpdateObject({ ...newAttrs });
  };

  const handleCanvasSizeChange = (id: 'width' | 'height', value: number | string) => {
    const newSize = {
      ...selectedObject,
      [id]: Number(value) || 0,
    };
    onUpdateObject(newSize);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="tabs tabs-boxed flex-shrink-0 m-4">
        <a 
          className={`tab flex-grow ${view === 'properties' ? 'tab-active' : ''}`}
          onClick={() => setView('properties')}
        >
          Свойства
        </a>
        <a 
          className={`tab flex-grow ${view === 'tree' ? 'tab-active' : ''}`}
          onClick={() => setView('tree')}
        >
          Слои
        </a>
      </div>
      
      <div className="flex-grow overflow-y-auto flex flex-col">
        {view === 'tree' && (
            <div className="flex flex-col flex-grow min-h-0 p-4">
              <h2 className="text-lg font-semibold mb-2 flex justify-between items-center flex-shrink-0">
                Слои объектов
                <div className="badge badge-secondary">{allObjects.length}</div>
              </h2>
              <div className="flex items-center gap-2 mb-2">
                <button 
                  className="btn btn-sm btn-outline flex-1" 
                  onClick={onGroupObjects} 
                  disabled={safeSelectedObjectIds.length < 2}
                  title="Сгруппировать выбранные объекты"
                >
                  <Group className="h-4 w-4" />
                  <span>Группа</span>
                </button>
                <button 
                  className="btn btn-sm btn-outline flex-1" 
                  onClick={() => selectedObject && onUngroupObjects(selectedObject.id)}
                  disabled={!selectedObject || !selectedObject.children}
                  title="Разгруппировать выбранный объект"
                >
                  <Ungroup className="h-4 w-4" />
                  <span>Разгруппировать</span>
                </button>
              </div>
              <div className="flex-grow overflow-y-auto">
                <ObjectTree 
                  objects={allObjects} 
                  onSelectObject={onSelectObject} 
                  selectedObject={selectedObject} 
                  selectedObjectIds={safeSelectedObjectIds}
                  onMoveObject={onMoveObject} 
                  onReorderObjects={onReorderObjects}
                />
              </div>
            </div>
        )}
        
        {view === 'properties' && (
          <div className="p-4">
              <h2 className="text-lg font-semibold mb-2 flex justify-between items-center">
                Свойства объекта
                {selectedObject && (
                  <div className="flex items-center gap-1">
                    <button 
                      className="btn btn-sm btn-ghost btn-circle"
                      title="Клонировать"
                      onClick={() => onCloneObject(selectedObject.id)}
                    >
                      <Copy className="h-4 w-4" />
                    </button>
                    <button 
                      className="btn btn-sm btn-ghost btn-circle"
                      title={selectedObject.isLocked ? "Разблокировать" : "Заблокировать"}
                      onClick={() => onUpdateObject({ isLocked: !selectedObject.isLocked })}
                    >
                      {selectedObject.isLocked ? <Lock className="h-4 w-4" /> : <Unlock className="h-4 w-4" />}
                    </button>
                    <button 
                      className="btn btn-sm btn-ghost btn-circle text-error"
                      title="Удалить"
                      onClick={() => onDeleteObject(selectedObject.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                )}
              </h2>
              
              {!selectedObject ? (
                <div className="text-center py-8">
                  <p className="text-base-content opacity-70">Объект не выбран</p>
                  <p className="text-sm text-base-content opacity-50 mt-2">
                    Выберите объект на карте для редактирования его свойств
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                    <div className="form-control w-full">
                      <label className="label">
                        <span className="label-text">Имя</span>
                      </label>
                      <input
                        className="input input-bordered w-full"
                        value={selectedObject.name}
                        onChange={(event) => onUpdateObject({ name: event.currentTarget.value })}
                      />
                    </div>
                    <div className="form-control w-full">
                      <label className="label">
                        <span className="label-text">Ширина (пикс.)</span>
                      </label>
                      <input
                        className="input input-bordered w-full"
                        type="number"
                        value={Math.round(selectedObject.width)}
                        onChange={(e) => handleInputChange('width', Number(e.target.value))}
                        min={1}
                      />
                    </div>
                    <div className="form-control w-full">
                      <label className="label">
                        <span className="label-text">Высота (пикс.)</span>
                      </label>
                      <input
                        className="input input-bordered w-full"
                        type="number"
                        value={Math.round(selectedObject.height)}
                        onChange={(e) => handleInputChange('height', Number(e.target.value))}
                        min={1}
                      />
                    </div>
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
                    <div className="form-control w-full">
                      <label className="label">
                        <span className="label-text">X координата</span>
                      </label>
                      <input
                        className="input input-bordered w-full"
                        type="number"
                        value={Math.round(selectedObject.x)}
                        onChange={(e) => handleInputChange('x', Number(e.target.value))}
                      />
                    </div>
                    <div className="form-control w-full">
                      <label className="label">
                        <span className="label-text">Y координата</span>
                      </label>
                      <input
                        className="input input-bordered w-full"
                        type="number"
                        value={Math.round(selectedObject.y)}
                        onChange={(e) => handleInputChange('y', Number(e.target.value))}
                      />
                    </div>

                    <div className="flex space-x-2">
                        <button
                            className="btn btn-sm btn-outline flex-1"
                            onClick={() => onUpdateObject({ flipX: !selectedObject.flipX })}
                        >
                            Отразить по X
                        </button>
                        <button
                            className="btn btn-sm btn-outline flex-1"
                            onClick={() => onUpdateObject({ flipY: !selectedObject.flipY })}
                        >
                            Отразить по Y
                        </button>
                    </div>
                  </div>
              )}
            </div>
        )}
      </div>
    </div>
  );
};

export default RightPanel;

