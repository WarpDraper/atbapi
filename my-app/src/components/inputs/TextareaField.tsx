import React, { useState } from "react";
import { validate } from "../../utils/validations";
import type { FormFieldRule } from "../../utils/validations";

interface Props {
    name: string;
    label: string;
    placeholder?: string;
    value?: string;
    onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
    rules?: FormFieldRule[];
    onValidationChange?: (isValid: boolean, key: string) => void;
}

const TextareaField: React.FC<Props> = ({
                                                           name,
                                                           label,
                                                           placeholder,
                                                           value,
                                                           onChange,
                                                           rules,
                                                           onValidationChange,
                                                       }) => {
    const [errorMessage, setErrorMessage] = useState<string | undefined>(undefined);

    const validateField = (val: string) => {
        const error = validate(val, rules);
        setErrorMessage(error);
        onValidationChange?.(!error, name);
    };

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        onChange?.(e);
        validateField(e.target.value);
    };

    return (
        <div className="w-full mb-5">
            <label
                htmlFor={name}
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
                {label}
            </label>

            <textarea
                id={name}
                name={name}
                placeholder={placeholder}
                value={value}
                onChange={handleChange}
                rows={4}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg
                   focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5
                   dark:bg-gray-700 dark:border-gray-600 dark:text-white
                   dark:focus:ring-blue-500 dark:focus:border-blue-500 resize-none"
            />

            {errorMessage && (
                <p className="text-sm text-red-600 dark:text-red-400 mt-1">{errorMessage}</p>
            )}
        </div>
    );
};

export default TextareaField;