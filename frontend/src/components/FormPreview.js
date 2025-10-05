import React, { useState } from 'react';
import axios from 'axios';

const FormPreview = ({ formData }) => {
  // State management
  const [formValues, setFormValues] = useState({});
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [submissionStatus, setSubmissionStatus] = useState(null);
  const [errors, setErrors] = useState({});

  // Field validation logic
  const validateField = (field, value) => {
    const newErrors = {};
    
    // Required field validation
    if (field.required && !value?.toString().trim()) {
      newErrors[currentQuestion] = 'This field is required';
    }
    
    // Text field specific validations
    if (field.type === 'text') {
      const strValue = value?.toString() || '';
      
      if (field.minLength && strValue.length < field.minLength) {
        newErrors[currentQuestion] = `Minimum ${field.minLength} characters required`;
      }
      
      if (field.maxLength && strValue.length > field.maxLength) {
        newErrors[currentQuestion] = `Maximum ${field.maxLength} characters allowed`;
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle regular field changes
  const handleChange = (fieldIndex, value) => {
    setFormValues({
      ...formValues,
      [fieldIndex.toString()]: value
    });
    
    // Clear error if it was fixed
    if (errors[fieldIndex]) {
      const newErrors = {...errors};
      delete newErrors[fieldIndex];
      setErrors(newErrors);
    }
  };

  // Handle table cell changes
  const handleTableChange = (fieldIndex, rowIndex, colIndex, value) => {
    const fieldValues = formValues[fieldIndex] || { rows: [] };
    
    // Initialize row if doesn't exist
    if (!fieldValues.rows[rowIndex]) {
      fieldValues.rows[rowIndex] = {};
    }
    
    // Update specific cell value
    fieldValues.rows[rowIndex][colIndex] = value;
    
    // Update form values
    handleChange(fieldIndex, fieldValues);
  };

  // Add new row to table
  const addTableRow = (fieldIndex) => {
    const fieldValues = formValues[fieldIndex] || { rows: [] };
    handleChange(fieldIndex, { 
      ...fieldValues, 
      rows: [...fieldValues.rows, {}] 
    });
  };

  // Navigation to next question
  const handleNext = () => {
    const field = formData.structure[currentQuestion];
    const value = formValues[currentQuestion];
    
    // Validate before proceeding
    if (!validateField(field, value)) {
      return;
    }

    // Handle conditional jumps for dropdowns
    if (field.type === 'dropdown' && field.optionJumpTos && value) {
      const selectedOptionIndex = field.options?.indexOf(value);
      
      if (selectedOptionIndex !== -1 && field.optionJumpTos[selectedOptionIndex]) {
        const jumpToId = field.optionJumpTos[selectedOptionIndex];
        const jumpToIndex = formData.structure.findIndex(f => f.id === jumpToId);
        
        if (jumpToIndex !== -1) {
          setCurrentQuestion(jumpToIndex);
          return;
        }
      }
    }

    // Move to next question if not at end
    if (currentQuestion < formData.structure.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  // Navigation to previous question
  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  // Form submission handler
  const handleSubmit = async () => {
    let isValid = true;
    const submissionErrors = {};
    
    // Validate all fields before submission
    formData.structure.forEach((field, index) => {
      if (!validateField(field, formValues[index])) {
        isValid = false;
        submissionErrors[index] = errors[index] || 'This field is required';
      }
    });
  
    // Handle validation errors
    if (!isValid) {
      setErrors(submissionErrors);
      // Jump to first error
      const firstErrorIndex = formData.structure.findIndex(
        (field, index) => submissionErrors[index]
      );
      setCurrentQuestion(firstErrorIndex);
      return;
    }

    // Submit to API
    try {
      const response = await axios.post(
        `http://localhost:5001/api/forms/${formData.id || 1}/responses`,
        { responses: formValues },
        { headers: { 'Content-Type': 'application/json' } }
      );
  
      if (response.status === 200) {
        setSubmissionStatus('success');
      } else {
        throw new Error('Unexpected response from server');
      }
    } catch (error) {
      console.error('Submission failed:', error);
      setSubmissionStatus('error');
      alert(`Submission failed: ${error.response?.data?.error || error.message}`);
    }
  };

  // Success state view
  if (submissionStatus === 'success') {
    return (
      <div className="submission-success">
        <h2>Thank You!</h2>
        <p>Your form has been submitted successfully.</p>
      </div>
    );
  }

  // Current field being displayed
  const currentField = formData.structure[currentQuestion];

  return (
    <div className="form-preview">
      {/* Form title */}
      <h2>{formData.title}</h2>
      
      {/* Field display container */}
      <div className="preview-field">
        {/* Field question */}
        <h3>
          {currentField.question}
          {currentField.required && <span className="required">*</span>}
        </h3>

        {/* Text Field */}
        {currentField.type === 'text' && (
          <div className="text-input-container">
            <input
              type="text"
              value={formValues[currentQuestion] || ''}
              onChange={(e) => handleChange(currentQuestion, e.target.value)}
              maxLength={currentField.maxLength}
              className={errors[currentQuestion] ? 'error' : ''}
            />
            {/* Error message */}
            {errors[currentQuestion] && (
              <div className="error-message">{errors[currentQuestion]}</div>
            )}
            {/* Character counter */}
            {currentField.maxLength && (
              <div className="char-counter">
                {(formValues[currentQuestion]?.length || 0)}/{currentField.maxLength}
              </div>
            )}
          </div>
        )}

        {/* Dropdown Field */}
        {currentField.type === 'dropdown' && (
          <div className={`dropdown-container ${errors[currentQuestion] ? 'has-error' : ''}`}>
            <select
              value={formValues[currentQuestion] || ''}
              onChange={(e) => handleChange(currentQuestion, e.target.value)}
              className={errors[currentQuestion] ? 'error' : ''}
              required={currentField.required}
            >
              <option value="">Select an option</option>
              {currentField.options?.map((option, i) => (
                <option key={i} value={option}>{option}</option>
              ))}
            </select>
            {/* Error message */}
            {errors[currentQuestion] && (
              <div className="error-message">{errors[currentQuestion]}</div>
            )}
          </div>
        )}

        {/* Table Field */}
        {currentField.type === 'table' && (
          <div className="table-preview">
            <table>
              <thead>
                <tr>
                  {currentField.columns?.map((col, colIndex) => (
                    <th key={colIndex}>
                      {col.question}
                      {col.required && <span className="required">*</span>}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {(formValues[currentQuestion]?.rows || [{}]).map((row, rowIndex) => (
                  <tr key={rowIndex}>
                    {currentField.columns?.map((col, colIndex) => (
                      <td key={colIndex}>
                        {/* Text column */}
                        {col.type === 'text' ? (
                          <div className="table-input-container">
                            <input
                              type="text"
                              value={row[colIndex] || ''}
                              onChange={(e) => handleTableChange(
                                currentQuestion, 
                                rowIndex, 
                                colIndex, 
                                e.target.value
                              )}
                              className={errors[`${currentQuestion}-${rowIndex}-${colIndex}`] ? 'error' : ''}
                              required={col.required}
                            />
                            {/* Error message */}
                            {errors[`${currentQuestion}-${rowIndex}-${colIndex}`] && (
                              <div className="error-message">
                                {errors[`${currentQuestion}-${rowIndex}-${colIndex}`]}
                              </div>
                            )}
                          </div>
                        ) : (
                          /* Dropdown column */
                          <select
                            value={row[colIndex] || ''}
                            onChange={(e) => handleTableChange(
                              currentQuestion, 
                              rowIndex, 
                              colIndex, 
                              e.target.value
                            )}
                            className={errors[`${currentQuestion}-${rowIndex}-${colIndex}`] ? 'error' : ''}
                            required={col.required}
                          >
                            <option value="">Select</option>
                            {col.options?.map((opt, i) => (
                              <option key={i} value={opt}>{opt}</option>
                            ))}
                          </select>
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
            {/* Add row button */}
            <button 
              type="button" 
              onClick={() => addTableRow(currentQuestion)}
            >
              Add Row
            </button>
          </div>
        )}
      </div>

      {/* Navigation buttons */}
      <div className="navigation-buttons">
        {/* Previous button (only shown if not on first question) */}
        {currentQuestion > 0 && (
          <button type="button" onClick={handlePrevious}>Previous</button>
        )}
        
        {/* Next or Submit button */}
        {currentQuestion < formData.structure.length - 1 ? (
          <button type="button" onClick={handleNext}>Next</button>
        ) : (
          <button type="button" onClick={handleSubmit}>Submit</button>
        )}
      </div>

      {/* Submission error message */}
      {submissionStatus === 'error' && (
        <div className="error-message">
          There was an error submitting your form. Please try again.
        </div>
      )}
    </div>
  );
};

export default FormPreview;