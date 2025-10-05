import React, { useState } from 'react';
import FormBuilder from './components/FormBuilder';
import FormPreview from './components/FormPreview';
import './index.css';
import axios from 'axios';

function App() {
  // State for form data and view mode
  const [formData, setFormData] = useState(null);
  const [mode, setMode] = useState('builder'); // 'builder' or 'preview'

  // Handle form saving to backend
  const handleSaveForm = async (formStructure) => {
    try {
      const response = await axios.post('http://localhost:5001/api/forms', formStructure, {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });
      
      // Fetch the latest form after saving
      const latestForm = await axios.get('http://localhost:5001/api/forms/latest', {
        withCredentials: true
      });
      setFormData(latestForm.data);
    } catch (err) {
      console.error('Detailed error:', err.response?.data || err.message);
    }
  };

  return (
    <div className="app">
      <header>
        <h1>Marketing Campaign Form</h1>
        
        {/* Mode switcher buttons */}
        <div className="mode-switcher">
          <button 
            onClick={() => setMode('builder')} 
            className={mode === 'builder' ? 'active' : ''}
          >
            Form Builder
          </button>
          <button 
            onClick={() => setMode('preview')} 
            className={mode === 'preview' ? 'active' : ''}
          >
            Preview
          </button>
        </div>
      </header>

      <main>
        {/* Render builder or preview based on mode */}
        {mode === 'builder' ? (
          <FormBuilder onSave={handleSaveForm} />
        ) : (
          <FormPreview formData={formData} />
        )}
      </main>
    </div>
  );
}

export default App;