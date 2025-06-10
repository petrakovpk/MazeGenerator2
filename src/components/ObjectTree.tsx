import React from 'react';
import { MapObject } from '../App';
import { ArrowUp, ArrowDown } from 'lucide-react';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';

interface ObjectTreeProps {
  objects: MapObject[];
  onSelectObject: (object: MapObject, isMultiSelect: boolean, isShiftSelect: boolean) => void;
  selectedObject: MapObject | null;
  selectedObjectIds: string[];
  onMoveObject: (id: string, direction: 'up' | 'down') => void;
  onReorderObjects: (startIndex: number, endIndex: number) => void;
}

const ObjectTree: React.FC<ObjectTreeProps> = ({ objects, onSelectObject, selectedObject, selectedObjectIds, onMoveObject, onReorderObjects }) => {
  const buildTree = (items: MapObject[]): MapObject[] => {
    const itemMap = new Map<string, MapObject>();
    items.forEach(item => {
      itemMap.set(item.id, { ...item, children: [] });
    });

    const tree: MapObject[] = [];
    items.forEach(item => {
      if (item.parentId && itemMap.has(item.parentId)) {
        const parent = itemMap.get(item.parentId);
        parent?.children?.push(itemMap.get(item.id)!);
      } else {
        tree.push(itemMap.get(item.id)!);
      }
    });

    return tree;
  };

  const objectTree = buildTree(objects);

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) {
      return;
    }
    onReorderObjects(result.source.index, result.destination.index);
  };

  const renderTree = (nodes: MapObject[], isTopLevel: boolean) => (
    isTopLevel ? (
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="droppable-objects">
          {(provided) => (
            <div {...provided.droppableProps} ref={provided.innerRef} className="pl-0">
              {nodes.map((node, index) => (
                <Draggable key={node.id} draggableId={node.id} index={index}>
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      className="flex items-center group rounded-md hover:bg-base-200"
                    >
                      <button
                        onClick={(e) => onSelectObject(node, e.ctrlKey || e.metaKey, e.shiftKey)}
                        className={`btn btn-ghost flex-1 justify-start px-2 py-1 h-auto font-normal text-left truncate ${
                          selectedObjectIds.includes(node.id) ? 'btn-active' : ''
                        }`}
                      >
                        <span className="text-sm">{node.name}</span>
                      </button>
                      <div className="flex items-center ml-auto pr-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          className="btn btn-xs btn-ghost" 
                          onClick={() => onMoveObject(node.id, 'up')}
                          disabled={objects.findIndex(o => o.id === node.id) === 0}
                          title="Переместить выше"
                        >
                          <ArrowUp className="h-4 w-4" />
                        </button>
                        <button 
                          className="btn btn-xs btn-ghost" 
                          onClick={() => onMoveObject(node.id, 'down')}
                          disabled={objects.findIndex(o => o.id === node.id) === objects.length - 1}
                          title="Переместить ниже"
                        >
                          <ArrowDown className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    ) : (
      <div className="pl-4"> 
        {nodes.map((node) => (
          <div key={node.id} className="flex items-center group rounded-md hover:bg-base-200">
            <button
              onClick={(e) => onSelectObject(node, e.ctrlKey || e.metaKey, e.shiftKey)}
              className={`btn btn-ghost flex-1 justify-start px-2 py-1 h-auto font-normal text-left truncate ${
                selectedObjectIds.includes(node.id) ? 'btn-active' : ''
              }`}
            >
              <span className="text-sm">{node.name}</span>
            </button>
          </div>
        ))}
      </div>
    )
  );
  
  return (
    <div>
      {renderTree(objectTree, true)}
    </div>
  );
};

export default ObjectTree; 