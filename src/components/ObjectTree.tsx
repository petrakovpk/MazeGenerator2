import React from 'react';
import { MapObject } from '../App';

interface ObjectTreeProps {
  objects: MapObject[];
  onSelectObject: (object: MapObject) => void;
  selectedObject: MapObject | null;
}

const ObjectTree: React.FC<ObjectTreeProps> = ({ objects, onSelectObject, selectedObject }) => {
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

  const renderTree = (nodes: MapObject[]) => (
    <div className="pl-4">
      {nodes.map(node => (
        <div key={node.id}>
          <button
            onClick={() => onSelectObject(node)}
            className={`btn btn-ghost w-full justify-start px-2 py-1 h-auto font-normal text-left ${
              selectedObject?.id === node.id ? 'btn-active btn-accent' : ''
            }`}
          >
            <span className="text-sm">{node.name}</span>
          </button>
          {node.children && node.children.length > 0 && renderTree(node.children)}
        </div>
      ))}
    </div>
  );

  return (
    <div>
      {renderTree(objectTree)}
    </div>
  );
};

export default ObjectTree; 