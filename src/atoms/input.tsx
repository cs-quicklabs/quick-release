import * as React from "react";
import { cn } from "@/lib/utils";
import { XMarkIcon } from "@heroicons/react/24/solid";
import { useState, useEffect } from "react";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  className?: string;
  showClearBtn?: boolean;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, value, onChange, showClearBtn, ...props }, ref) => {
    const [inputValue, setInputValue] = useState(value || "");

    // Sync inputValue with external value (from React Hook Form or other sources)
    useEffect(() => {
      setInputValue(value || "");
    }, [value]);

    const handleClear = () => {
      setInputValue("");
      if (onChange) {
        onChange({ target: { value: "" } } as React.ChangeEvent<HTMLInputElement>);
      }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setInputValue(e.target.value);
      if (onChange) {
        onChange(e);
      }
    };

    return (
      <div className="relative w-full">
        <input
          type={type}
          className={cn(
            "bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg outline-blue-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:outline-blue-600",
            className
          )}
          ref={ref}
          {...props}
          value={inputValue}
          onChange={handleChange}
        />
        {inputValue && !props.disabled && showClearBtn && (
          <button
            type="button"
            className="absolute inset-y-0 right-2 flex items-center justify-center text-gray-500 hover:text-gray-700"
            onClick={handleClear}
          >
            <XMarkIcon className="w-5 h-5" />
          </button>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export { Input };
