import '../css/Navbar.css';
import dishIcon from '../assets/dish_icon.svg';
import recipeIcon from '../assets/recipe_icon.svg';
import productIcon from '../assets/product_icon.svg';

const PAGES = [
	{ title: 'Pratos', icon: dishIcon },
	{ title: 'Receitas', icon: recipeIcon },
	{ title: 'Produtos', icon: productIcon }
];

interface NavbarProps {
	currentPageIdx: number;
	onPageChange: (newIdx: number) => void;
}

export default function Navbar({ currentPageIdx, onPageChange }: NavbarProps) {
	const handlePageChange = (e: React.MouseEvent<HTMLAnchorElement>, idx: number) => {
		e.preventDefault();
		onPageChange(idx);
	}

	return (
		<nav className='Navbar'>
			<ul>
				{PAGES.map((page, idx) =>
					<li
						key={idx}
					>
						<a
							href='#'
							className={idx === currentPageIdx ? 'selected' : ''}
							onClick={e => handlePageChange(e, idx)}
						>
							<img src={page.icon} alt={page.title} title={page.title} />
							{page.title}
						</a>
					</li>
				)}
			</ul>
		</nav>
	);
}