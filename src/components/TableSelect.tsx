import { useState } from 'react';
import '../css/TableSelect.css';

interface TableSelectProps {
	titles: string[];
	ids: string[];
	value: string;
	onSelect: (id: string) => void;
}

export default function TableSelect({ titles, ids, value, onSelect }: TableSelectProps) {
	const [selectedId, setSelectedId] = useState(value);

	const handleOnChange = (e: React.SyntheticEvent<HTMLSelectElement>) => {
		if (e.currentTarget.value !== selectedId) {
			onSelect(e.currentTarget.value);
			setSelectedId(e.currentTarget.value);
		}
	}

	return (
		<select
			className='TableSelect'
			defaultValue={selectedId}
			onChange={handleOnChange}
		>
			{titles.map((title, idx) => (
				<option
					key={ids[idx]}
					value={ids[idx]}
				>{title}</option>
			))}
		</select>
	);
}