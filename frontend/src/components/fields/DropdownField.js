import React from 'react';

const DropdownField = ({ field, onChange, allFields = [] }) => {
  // Handling dropdowns option text change
  const handleOptionChange = (index, value) => {
    const newOptions = [...field.options];
    newOptions[index] = value;
    onChange('options', newOptions);
  };

  // Adding new option
  const addOption = () => {
    onChange('options', [...(field.options || []), '']);
  };

  // Handling jump-to question selection
  const handleJumpToChange = (optionIndex, jumpToQuestion) => {
    const newOptionJumpTos = [...(field.optionJumpTos || [])];
    newOptionJumpTos[optionIndex] = jumpToQuestion;
    onChange('optionJumpTos', newOptionJumpTos);
  };

  return (
    <div className="field-config">
      {/* Question input */}
      <label>
        Question:
        <input 
          type="text" 
          name="question" 
          value={field.question || ''} 
          onChange={(e) => onChange('question', e.target.value)} 
          required 
        />
      </label>

      {/* Options configuration */}
      <div className="options-container">
        <h4>Options:</h4>
        {field.options?.map((option, i) => (
          <div key={i} className="option-item">
            <div className="option-input-row">
              {/* Option text input */}
              <input
                type="text"
                value={option}
                onChange={(e) => handleOptionChange(i, e.target.value)}
                required
              />
              
              {/* Jump-to selection */}
              <label>
                Jump to:
                <select
                  value={field.optionJumpTos?.[i] || ''}
                  onChange={(e) => handleJumpToChange(i, e.target.value)}
                >
                  <option value="">default</option>
                  {allFields && allFields.map((f, index) => (
                    f.id !== field.id && (
                      <option key={f.id} value={f.id}>
                        {f.question || `Question ${index + 1}`}
                      </option>
                    )
                  ))}
                </select>
              </label>
            </div>
          </div>
        ))}
        <button type="button" onClick={addOption}>Add Option</button>
      </div>
    </div>
  );
};

export default DropdownField;