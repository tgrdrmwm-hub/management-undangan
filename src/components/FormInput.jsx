import React from 'react';

const FormInput = ({ label, id, type = 'text', placeholder, value, onChange, required = false, as = 'input', rows }) => {
  const Component = as;
  
  return (
    <div className="mb-1">
      <label htmlFor={id} className="block text-[13px] font-medium text-surface-500 dark:text-surface-400 mb-2 tracking-wide">
        {label} {required && <span className="text-accent-gold ml-0.5">*</span>}
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
        className="w-full px-4 py-3 
          bg-surface-100 dark:bg-surface-800/50
          border border-surface-300 dark:border-surface-700/50
          text-surface-900 dark:text-white 
          placeholder-surface-400 dark:placeholder-surface-600
          rounded-xl
          focus:outline-none focus:ring-2 focus:ring-accent-gold/30 focus:border-accent-gold/40
          dark:focus:ring-accent-gold/20 dark:focus:border-accent-gold/30
          transition-all duration-500 ease-premium
          text-[14px]"
      />
    </div>
  );
};

export default FormInput;
