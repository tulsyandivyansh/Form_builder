import React from 'react';
import { useDrag, useDrop } from 'react-dnd';
import TextField from './fields/TextField';
import DropdownField from './fields/DropdownField';
import TableField from './fields/TableField';

const FormField = ({ field, index, onUpdate, onRemove, onMove, allFields = [] }) => {
  // Mapping each field type to its configuration component
  const fieldComponents = {
    text: (
      <TextField 
        field={field} 
        onChange={(key, value) => onUpdate(index, { ...field, [key]: value })} 
      />
    ),
    dropdown: (
      <DropdownField 
        field={field} 
        onChange={(key, value) => onUpdate(index, { ...field, [key]: value })} 
        allFields={allFields}
      />
    ),
    table: (
      <TableField 
        field={field} 
        onChange={(key, value) => onUpdate(index, { ...field, [key]: value })} 
        allFields={allFields}
      />
    )
  };

  // Field type labels
  const fieldLabels = {
    text: 'Text Input',
    dropdown: 'Dropdown',
    table: 'Table'
  };

  // Drag functionality for reordering
  const [{ isDragging }, drag] = useDrag({
    type: 'FORM_FIELD',
    item: { id: field.id, index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging()
    })
  });

  // Drop functionality for reordering
  const [{ isOver }, drop] = useDrop({
    accept: 'FORM_FIELD',
    hover: (item) => {
      if (item.index !== index) {
        onMove(item.index, index);
        item.index = index;
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver()
    })
  });

  return (
    <div
      ref={(node) => drag(drop(node))}
      className={`form-field 
        ${isDragging ? 'dragging' : ''} 
        ${isOver ? 'drag-over' : ''}`}
      style={{
        opacity: isDragging ? 0.5 : 1,
        cursor: isDragging ? 'grabbing' : 'grab'
      }}
    >
      {/* Field header with remove button */}
      <div className="field-header">
        <h4>{fieldLabels[field.type]}</h4>
        <button 
          className="remove-btn"
          onClick={() => onRemove(index)}
        >
          ×
        </button>
      </div>
      
      {/* Render the appropriate field component */}
      {fieldComponents[field.type]}
    </div>
  );
};

export default React.memo(FormField);