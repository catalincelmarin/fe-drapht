"use client";

type CustomInputProps = {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
  className?: string;
};

const CustomInput: React.FC<CustomInputProps> = ({ value, onChange, placeholder, className, ...props }) => (
  <input
    type="text"
    value={value}
    onChange={onChange}
    placeholder={placeholder}
    className={`w-full bg-[#1e1e1e] text-gray-100 border border-[#3a3a3a] rounded-md px-3 py-2 focus:outline-none focus:border-[#00e676] focus:ring-1 focus:ring-[#00e676] placeholder-gray-500 ${className}`}
    {...props}
  />
);

export default CustomInput;

