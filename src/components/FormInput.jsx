import React from 'react';

const FormInput = ({ label, id, type = 'text', placeholder, value, onChange, required = false, as = 'input', rows }) => {
  const Component = as;
  
  return (
    <div className="mb-4">
      <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <Component
        type={type !== 'textarea' ? type : undefined}
        id={id}
        name={id}
        rows={rows}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required={required}
        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-wedding-gold focus:border-wedding-gold shadow-sm outline-none transition-all duration-200"
      />
    </div>
  );
};

export default FormInput;
