import { useState } from "react";
import '../css/NumberInput.css';

interface NumberInputProps {
	value?: string;
	className?: string;
	isFloat?: boolean;
	minValue?: number;
	onChange: (newValue: number) => void;
}

export default function NumberInput({
	value = '',
	className = '',
	isFloat = true,
	minValue = 1,
	onChange,
}: NumberInputProps) {
	const [oldValue, setOldValue] = useState(value);
	const [newValue, setNewValue] = useState(value);

	const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key === 'Escape') {
			setNewValue(oldValue);
		} else if (e.key === 'Enter') {
			e.currentTarget.blur();
		}
	}

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setNewValue(e.currentTarget.value);
	}

	const handleBlur = () => {
		let formattedValue = newValue.trim().replace(/[\,]+/g, '.');
		formattedValue = newValue.replace(/[^(0-9\.)]+/g, '.');
		if (formattedValue.length === 0) {
			formattedValue = minValue.toString();
		}
		let numberValue = parseFloat(formattedValue);
		if (!isFloat) {
			numberValue = Math.floor(numberValue);
		}
		const result = isFloat ? numberValue : Math.floor(numberValue);

		setNewValue(result.toString());
		setOldValue(result.toString());
		onChange(result);
	}

	return (
		<input
			className={`NumberInput ${className}`}
			value={newValue}
			onKeyDown={handleKeyDown}
			onChange={handleChange}
			onBlur={handleBlur}
		/>
	);
}
