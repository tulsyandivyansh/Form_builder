import React from 'react';
import { useDrag } from 'react-dnd';

const FieldPalette = ({ fieldTypes, onAdd }) => {
  const fieldLabels = {
    text: 'Text Input',
    dropdown: 'Dropdown',
    table: 'Table'
  };

  const FieldItem = ({ type, label }) => {
    const [{ isDragging }, drag] = useDrag(() => ({
      type: 'palette-field',
      item: { type },
      end: (item, monitor) => {
        if (!monitor.didDrop()) {
          onAdd(item.type);
        }
      },
      collect: (monitor) => ({
        isDragging: !!monitor.isDragging()
      })
    }));

    return (
      <div
        ref={drag}
        className="field-item"
        style={{ opacity: isDragging ? 0.5 : 1 }}
        draggable
        onDragStart={(e) => e.dataTransfer.setData('text/plain', type)}
        onClick={() => onAdd(type)}
      >
        {label}
      </div>
    );
  };

  return (
    <div className="fields-palette">
      <h3>Available Fields</h3>
      {fieldTypes.map((type) => (
        <FieldItem 
          key={type}
          type={type}
          label={fieldLabels[type]}
        />
      ))}
    </div>
  );
};

export default FieldPalette;