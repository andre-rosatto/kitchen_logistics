import { Product } from "../models/Product";
import '../css/Summary.css';
import { Recipe } from "../models/Recipe";

interface SummaryProps {
	items: Product[] | Recipe[];
	icon: string;
}

export default function Summary({ items, icon }: SummaryProps) {
	const handleItemClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
		e.preventDefault();
		document.querySelector(`#_${id}`)?.scrollIntoView({
			behavior: 'smooth',
		});
	}

	return (
		<section className='Summary'>
			<div className="header">
				<img src={icon} />
				<h3>Índice</h3>
			</div>
			{items.map(item => (
				<a
					key={item.id}
					href='#'
					onClick={(e) => handleItemClick(e, item.id)}
				>{item.name}</a>
			))}
		</section>
	)
}
