import React from 'react';
import './FormInput.css';

function FormInput({ 
  label, 
  error, 
  icon, 
  helperText,
  ...props 
}) {
  return (
    <div className="form-input-wrapper">
      {label && <label className="form-label">{label}</label>}
      <div className="input-container">
        {icon && <span className="input-icon">{icon}</span>}
        <input 
          className={`form-input ${error ? 'error' : ''} ${icon ? 'with-icon' : ''}`}
          {...props}
        />
      </div>
      {error && <span className="error-message">{error}</span>}
      {helperText && !error && <span className="helper-text">{helperText}</span>}
    </div>
  );
}

export default FormInput;
