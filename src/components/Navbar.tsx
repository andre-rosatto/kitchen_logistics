import '../css/Navbar.css';

const PAGES = ['Pratos', 'Receitas', 'Produtos'];

interface NavbarProps {
	currentPageIdx: number;
	onPageChange: (newIdx: number) => void;
}

export default function Navbar({ currentPageIdx, onPageChange }: NavbarProps) {
	return (
		<nav className='Navbar'>
			<ul>
				{PAGES.map((page, idx) =>
					<li
						key={idx}
						className={idx === currentPageIdx ? 'selected' : ''}
						onClick={() => onPageChange(idx)}
					>{page}</li>
				)}
			</ul>
		</nav>
	);
}