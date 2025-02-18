import { useState } from "react";
import '../css/TableInput.css';

interface TableInputProps {
	value: string;
	onChange: (newValue: string) => void;
}

export default function TableInput({ value, onChange }: TableInputProps) {
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
		const trimmedValue = value.trim();
		if (trimmedValue.length > 0 && trimmedValue !== oldValue) {
			onChange(trimmedValue);
			setOldValue(trimmedValue);
			setNewValue(trimmedValue);
		} else {
			setNewValue(oldValue);
		}
	}

	return (
		<input
			className='TableInput'
			value={newValue}
			onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewValue(e.target.value)}
			onKeyDown={handleKeyDown}
			onBlur={() => handleBlur(newValue)}
		/>
	);
}