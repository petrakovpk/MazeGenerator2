import React, { useState } from 'react';
import { MapObject } from '@/app/page';
import { Trash2, Lock, Unlock } from 'lucide-react';
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
      <div className="card bg-base-100 shadow-xl m-4">
        <div className="card-body">
          <h2 className="card-title">Размеры уровня</h2>
          <div className="form-control w-full">
            <label className="label">
              <span className="label-text">Ширина (пикс.)</span>
            </label>
            <input
              type="number"
              className="input input-bordered w-full"
              value={canvasSize.width}
              onChange={(e) => handleCanvasSizeChange('width', e.target.value)}
              min={100}
            />
          </div>
          <div className="form-control w-full">
            <label className="label">
              <span className="label-text">Высота (пикс.)</span>
            </label>
            <input
              type="number"
              className="input input-bordered w-full"
              value={canvasSize.height}
              onChange={(e) => handleCanvasSizeChange('height', e.target.value)}
              min={100}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 h-full flex flex-col">
      <div className="tabs tabs-boxed w-full mb-4">
        <a 
          className={`tab ${view === 'properties' ? 'tab-active' : ''}`}
          onClick={() => setView('properties')}
        >
          Свойства
        </a>
        <a 
          className={`tab ${view === 'tree' ? 'tab-active' : ''}`}
          onClick={() => setView('tree')}
        >
          Дерево
        </a>
      </div>
      
      {view === 'tree' && (
        <div className="card bg-base-100 shadow-xl h-full">
          <div className="card-body">
            <h2 className="card-title">
              Дерево объектов
              <div className="badge badge-secondary">{mapObjects.length}</div>
            </h2>
            <div className="overflow-y-auto h-[calc(100vh-300px)]">
              <ObjectTree objects={mapObjects} onSelectObject={onSelectObject} selectedObject={selectedObject} />
            </div>
          </div>
        </div>
      )}
      
      {view === 'properties' && (
        <div className="card bg-base-100 shadow-xl h-full">
          <div className="card-body">
            <h2 className="card-title flex justify-between items-center">
              Свойства объекта
              {selectedObject && (
                <div className="flex items-center gap-2">
                  <button 
                    className="btn btn-sm btn-ghost"
                    onClick={() => onUpdateObject({ ...selectedObject, isLocked: !selectedObject.isLocked })}
                  >
                    {selectedObject.isLocked ? <Lock className="h-4 w-4" /> : <Unlock className="h-4 w-4" />}
                  </button>
                  <button 
                    className="btn btn-sm btn-error"
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
              <div className="overflow-y-auto h-[calc(100vh-400px)]">
                <div className="space-y-4">
                  <div className="form-control w-full">
                    <label className="label">
                      <span className="label-text">Имя</span>
                    </label>
                    <input
                      className="input input-bordered w-full"
                      value={selectedObject.name}
                      onChange={(event) => onUpdateObject({ ...selectedObject, name: event.currentTarget.value })}
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
                      onChange={(e) => handleInputChange('width', e.target.value)}
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
                      onChange={(e) => handleInputChange('height', e.target.value)}
                      min={1}
                    />
                  </div>
                  {selectedObject.originalWidth && (
                    <div className="form-control w-full">
                      <label className="label">
                        <span className="label-text">Ширина (%)</span>
                      </label>
                      <input
                        className="input input-bordered w-full"
                        type="number"
                        value={Math.round((selectedObject.width / selectedObject.originalWidth) * 100)}
                        onChange={(e) => handleInputChange('widthPercent', e.target.value)}
                        min={1}
                      />
                    </div>
                  )}
                  {selectedObject.originalHeight && (
                    <div className="form-control w-full">
                      <label className="label">
                        <span className="label-text">Высота (%)</span>
                      </label>
                      <input
                        className="input input-bordered w-full"
                        type="number"
                        value={Math.round((selectedObject.height / selectedObject.originalHeight) * 100)}
                        onChange={(e) => handleInputChange('heightPercent', e.target.value)}
                        min={1}
                      />
                    </div>
                  )}
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
                  <div className="form-control">
                    <label className="label cursor-pointer">
                      <span className="label-text">Отразить по горизонтали</span>
                      <input
                        type="checkbox"
                        className="toggle toggle-primary"
                        checked={selectedObject.flipX}
                        onChange={(e) => onUpdateObject({ ...selectedObject, flipX: e.target.checked })}
                      />
                    </label>
                  </div>
                  <div className="form-control">
                    <label className="label cursor-pointer">
                      <span className="label-text">Отразить по вертикали</span>
                      <input
                        type="checkbox"
                        className="toggle toggle-primary"
                        checked={selectedObject.flipY}
                        onChange={(e) => onUpdateObject({ ...selectedObject, flipY: e.target.checked })}
                      />
                    </label>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default RightPanel;
