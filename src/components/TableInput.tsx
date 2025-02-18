import { useState } from "react";
import '../css/TableInput.css';

interface TableInputProps {
	value: string;
	onChange: (newValue: string) => void;
}

export default function TableInput({ value, onChange }: TableInputProps) {
	const [inputValue, setInputValue] = useState(value);

	const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key === 'Enter') {
			console.log(e);
			(e.target as HTMLInputElement).blur();
		}
	}

	return (
		<input
			className='TableInput'
			value={inputValue}
			onChange={(e: React.ChangeEvent<HTMLInputElement>) => setInputValue(e.target.value)}
			onKeyDown={handleKeyDown}
			onBlur={() => onChange(inputValue)}
		/>
	);
}