import React from 'react';
import { MapObject } from '../App';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

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
          <Button
            variant="ghost"
            onClick={() => onSelectObject(node)}
            className={cn(
              'w-full justify-start px-2 py-1 h-auto',
              selectedObject?.id === node.id && 'bg-accent text-accent-foreground'
            )}
          >
            <span className="text-sm">{node.name}</span>
          </Button>
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