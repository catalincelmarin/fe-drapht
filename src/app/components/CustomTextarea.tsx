"use client";

import { useEffect, useRef } from 'react';

type CustomTextareaProps = {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  placeholder: string;
  className?: string;
};

const CustomTextarea: React.FC<CustomTextareaProps> = ({ value, onChange, placeholder, className, ...props }) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [value]);

  return (
    <textarea
      ref={textareaRef}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={`w-full bg-[#1e1e1e] text-gray-100 border border-[#3a3a3a] rounded-md px-4 py-3 focus:outline-none ${className}`}
      style={{ minHeight: '120px', maxHeight: '300px', overflowY: 'auto' }}
      {...props}
    />
  );
};

export default CustomTextarea;

