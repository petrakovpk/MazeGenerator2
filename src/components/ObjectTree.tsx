import React from 'react';
import { MapObject } from '@/app/page';
import { UnstyledButton, Group, Text } from '@mantine/core';

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
    <div style={{ paddingLeft: 16 }}>
      {nodes.map(node => (
        <div key={node.id}>
          <UnstyledButton
            onClick={() => onSelectObject(node)}
            style={{
              display: 'block',
              width: '100%',
              padding: '4px 8px',
              borderRadius: '4px',
              backgroundColor: selectedObject?.id === node.id ? '#e7f5ff' : 'transparent',
              color: selectedObject?.id === node.id ? '#1971c2' : '#000',
            }}
          >
            <Group>
              <Text size="sm">{node.name}</Text>
            </Group>
          </UnstyledButton>
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