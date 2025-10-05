import React, { useState, useCallback } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import FieldPalette from './FieldPalette';
import FormField from './FormField';

const FormBuilder = ({ onSave }) => {
  // State for form fields and title
  const [fields, setFields] = useState([]);
  const [formTitle, setFormTitle] = useState('');
  const [activeDrag, setActiveDrag] = useState(null);
  const fieldTypes = ['text', 'dropdown', 'table'];

  // Factory function for new fields
  const createNewField = useCallback((type) => ({
    type,
    id: `field-${Date.now()}`,
    question: '',
    ...(type === 'dropdown' && { options: [''] }),
    ...(type === 'table' && { columns: [{ type: 'text', question: '' }] })
  }), []);

  // Add a new field to the form
  const addField = useCallback((type, index = fields.length) => {
    setFields(prev => {
      const newField = createNewField(type);
      return [...prev.slice(0, index), newField, ...prev.slice(index)];
    });
  }, [fields.length, createNewField]);

  // Update existing field
  const updateField = useCallback((index, updated) => {
    setFields(prev => prev.map((f, i) => i === index ? { ...f, ...updated } : f));
  }, []);

  // Remove field from form
  const removeField = useCallback((index) => {
    setFields(prev => prev.filter((_, i) => i !== index));
    setActiveDrag(null);
  }, []);

  // Reorder fields
  const moveField = useCallback((fromIndex, toIndex) => {
    if (fromIndex === toIndex) return;
    setFields(prev => {
      const newFields = [...prev];
      const [moved] = newFields.splice(fromIndex, 1);
      newFields.splice(toIndex, 0, moved);
      return newFields;
    });
  }, []);

  // Handle drop event from palette
  const handleCanvasDrop = (e) => {
    e.preventDefault();
    const type = e.dataTransfer.getData('text/plain');
    if (fieldTypes.includes(type)) addField(type);
    setActiveDrag(null);
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="form-builder">
        {/* Form title input */}
        <div className="form-title">
          <input
            type="text"
            value={formTitle}
            onChange={(e) => setFormTitle(e.target.value)}
            placeholder="Form Title"
            required
          />
        </div>

        <div className="builder-container">
          {/* Field palette for adding new fields */}
          <FieldPalette 
            fieldTypes={fieldTypes} 
            onAdd={addField}
            setActiveDrag={setActiveDrag}
          />
          
          {/* Main form canvas */}
          <div
            className={`form-canvas ${activeDrag ? 'active-drop' : ''}`}
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleCanvasDrop}
          >
            {fields.length === 0 ? (
              <div className="empty-prompt">
                {activeDrag ? 'Drop fields here' : 'Add fields from palette'}
              </div>
            ) : (
              fields.map((field, index) => (
                <FormField
                  key={field.id}
                  index={index}
                  field={field}
                  onUpdate={updateField}
                  onRemove={removeField}
                  onMove={moveField}
                  setActiveDrag={setActiveDrag}
                  allFields={fields}
                />
              ))
            )}
          </div>
        </div>

        {/* Save button */}
        <button onClick={() => onSave({ title: formTitle, structure: fields })}>
          Save Form
        </button>
      </div>
    </DndProvider>
  );
};

export default React.memo(FormBuilder);