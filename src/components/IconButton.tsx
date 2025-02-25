import '../css/IconButton.css';
import addIcon from '../assets/add_icon.svg';
import deleteIcon from '../assets/delete_icon.svg';

interface IconButtonProps {
	type: 'add' | 'delete';
	disabled?: boolean;
	className?: string;
	title?: string;
	onClick: () => void;
}

export default function IconButton({
	type,
	disabled = false,
	className = '',
	title = '',
	onClick
}: IconButtonProps) {
	return (
		<button
			className={`IconButton ${type} ${className}`}
			disabled={disabled}
			title={title}
			onClick={onClick}
		><img src={type === 'add' ? addIcon : deleteIcon} />
		</button>
	)
}
