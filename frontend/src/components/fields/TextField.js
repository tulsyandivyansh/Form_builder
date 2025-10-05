import React from 'react';

const TextField = ({ field, onChange }) => {
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

      {/* Min length validation */}
      <label>
        Min Length:
        <input 
          type="number" 
          name="minLength" 
          min="0"
          value={field.minLength || ''} 
          onChange={(e) => onChange('minLength', e.target.value ? parseInt(e.target.value) : '')} 
        />
      </label>

      {/* Max length validation */}
      <label>
        Max Length:
        <input 
          type="number" 
          name="maxLength" 
          min="1"
          value={field.maxLength || ''} 
          onChange={(e) => onChange('maxLength', e.target.value ? parseInt(e.target.value) : '')} 
        />
      </label>
    </div>
  );
};

export default TextField;