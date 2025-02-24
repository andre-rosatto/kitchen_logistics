import { useState } from "react";
import '../css/TableInput.css';
import { Converter } from "../utils/Converter";

interface TableInputProps {
	value: string;
	allowEmpty?: boolean;
	className?: string;
	converterFunction?: typeof Converter.strToFloat;
	onChange: (newValue: string) => void;
}

export default function TableInput({
	value,
	allowEmpty = false,
	className = '',
	converterFunction,
	onChange
}: TableInputProps) {
	const [oldValue, setOldValue] = useState(value);
	const [newValue, setNewValue] = useState(value);

	const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key === 'Enter') {
			(e.target as HTMLInputElement).blur();
		} else if (e.key === 'Escape') {
			setNewValue(oldValue);
		}
	}

	const handleBlur = (value: string) => {
		let formattedValue: string;
		if (!allowEmpty && value.trim().length === 0) {
			formattedValue = oldValue;
		} else {
			formattedValue = converterFunction ? converterFunction(value).toString() : value.trim();
		}
		onChange(formattedValue);
		setOldValue(formattedValue);
		setNewValue(formattedValue);
	}

	return (
		<input
			className={`TableInput ${className}`}
			value={newValue}
			onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewValue(e.target.value)}
			onKeyDown={handleKeyDown}
			onBlur={() => handleBlur(newValue)}
		/>
	);
}