import '../css/WeekProducts.css';
import { Meals } from '../models/Meals';
import { Product } from '../models/Product';
import { Recipe } from '../models/Recipe';

interface WeekProducts {
	meals: Meals[],
	recipes: Recipe[],
	products: Product[],
}

type ProductItem = {
	id: string;
	amount: number;
}

export default function WeekProducts({ meals, recipes, products }: WeekProducts) {
	const items: ProductItem[] = [];
	meals.forEach(meal => {
		const mergedMeals = [...meal.lunch, ...meal.dinner];
		mergedMeals.forEach(recipeId => {
			const recipe = recipes.find(r => r.id === recipeId)!;
			recipe.products.forEach(product => {
				const prod = products.find(p => p.id === product.productId)!;
				const item = items.find(i => i.id === prod.id);
				if (!item) {
					items.push({
						id: prod.id,
						amount: product.amount * meal.amount,
					});
				} else {
					item.amount += product.amount * meal.amount;
				}
			});
		});
	});

	return (
		<div className='WeekProducts'>
			<div className='header'>
				<h3>Total de produtos da semana</h3>
			</div>

			<div className='results-container'>
				{items.map(item => (
					<div
						key={item.id}
						className='result-container'
					>
						<p>{products.find(p => p.id === item.id)!.name}</p>
						<p>{item.amount} {products.find(p => p.id === item.id)!.unit}</p>
					</div>
				))}
			</div>
		</div>
	)
}
