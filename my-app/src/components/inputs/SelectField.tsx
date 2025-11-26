import React, { useState } from "react";
import type { FormFieldRule } from "../../utils/validations";
import { validate } from "../../utils/validations";

interface Props {
    name: string;
    label: string;
    options: { value: number | string; label: string }[];
    value?: string | number;
    onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
    rules?: FormFieldRule[];
    onValidationChange?: (isValid: boolean, key: string) => void;
}

const SelectField: React.FC<Props> = ({
                                                       name,
                                                       label,
                                                       options,
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

    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
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

            <select
                id={name}
                name={name}
                value={value}
                onChange={handleChange}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg
                   focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5
                   dark:bg-gray-700 dark:border-gray-600 dark:text-white
                   dark:focus:ring-blue-500 dark:focus:border-blue-500"
            >
                <option value="">Select...</option>
                {options.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                        {opt.label}
                    </option>
                ))}
            </select>

            {errorMessage && (
                <p className="text-sm text-red-600 dark:text-red-400 mt-1">{errorMessage}</p>
            )}
        </div>
    );
};

export default SelectField;