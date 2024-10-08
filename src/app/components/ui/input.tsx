export const Input: React.FC<React.InputHTMLAttributes<HTMLInputElement>> = (props) => {
    return (
      <input
        {...props}
        className={`bg-transparent text-white border-none focus:outline-none ${props.className}`}
      />
    );
  };
  