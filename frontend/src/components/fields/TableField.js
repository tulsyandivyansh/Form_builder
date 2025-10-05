import React from 'react';
import TextField from './TextField';
import DropdownField from './DropdownField';

const TableField = ({ field, onChange, allFields = [] }) => {
  // Handle column changes
  const handleColumnChange = (colIndex, key, value) => {
    const newColumns = [...field.columns];
    newColumns[colIndex][key] = value;
    onChange('columns', newColumns);
  };

  // Add new column
  const addColumn = () => {
    onChange('columns', [...(field.columns || []), { 
      type: 'text', //Keeping text column as default
      question: '',
      options: [], // for dropdown options
      optionJumpTos: [] 
    }]);
  };

  // Rendering appropriate field type for column
  const renderColumnField = (column, colIndex) => {
    switch (column.type) {
      case 'dropdown':
        return (
          <DropdownField
            field={column}
            onChange={(key, value) => handleColumnChange(colIndex, key, value)}
            allFields={allFields}
          />
        );
      case 'text':
      default:
        return (
          <TextField
            field={column}
            onChange={(key, value) => handleColumnChange(colIndex, key, value)}
          />
        );
    }
  };

  return (
    <div className="field-config">
      {/* Table question */}
      <label>
        Table Question:
        <input 
          type="text" 
          name="question" 
          value={field.question || ''} 
          onChange={(e) => onChange('question', e.target.value)} 
          required 
        />
      </label>

      {/* Columns configuration */}
      <div className="table-config">
        <h4>Columns:</h4>
        {field.columns?.map((column, colIndex) => (
          <div key={colIndex} className="table-column">
            {/* Column type selector */}
            <div className="column-type-selector">
              <label>
                Column Type:
                <select
                  value={column.type}
                  onChange={(e) => handleColumnChange(colIndex, 'type', e.target.value)}
                >
                  <option value="text">Text Input</option>
                  <option value="dropdown">Dropdown</option>
                </select>
              </label>
            </div>
            
            {/* Render column field */}
            {renderColumnField(column, colIndex)}
          </div>
        ))}
        <button type="button" onClick={addColumn}>Add Column</button>
      </div>
    </div>
  );
};

export default TableField;