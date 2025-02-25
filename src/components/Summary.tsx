import { Product } from "../models/Product";
import '../css/Summary.css';
import { Recipe } from "../models/Recipe";

interface SummaryProps {
	items: Product[] | Recipe[];
}

export default function Summary({ items }: SummaryProps) {
	const handleItemClick = (id: string) => {
		document.querySelector(`#_${id}`)?.scrollIntoView({
			behavior: 'smooth',
		});
	}

	return (
		<section className='Summary'>
			<h3>Índice</h3>
			{items.map(item => (
				<a
					key={item.id}
					onClick={() => handleItemClick(item.id)}
				>{item.name}</a>
			))}
		</section>
	)
}
