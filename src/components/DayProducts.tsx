import { useState } from 'react';
import '../css/DayProducts.css';
import { Meals } from '../models/Meals';
import { Product } from '../models/Product';
import { Recipe } from '../models/Recipe';
import NumberInput from './NumberInput';

interface DayProductsProps {
	meals: Meals,
	recipes: Recipe[],
	products: Product[],
	onAmountChange: (newAmount: number) => void;
}

type ProductItem = {
	id: string;
	amount: number;
}

export default function DayProducts({ meals, recipes, products, onAmountChange }: DayProductsProps) {
	const [multiplier, setMultiplier] = useState(meals.amount.toString());

	const items: ProductItem[] = [];
	const mergedMeals = [...meals.lunch, ...meals.dinner];
	mergedMeals.forEach(recipeId => {
		const recipe = recipes.find(r => r.id === recipeId)!;
		recipe.products.forEach(product => {
			const prod = products.find(p => p.id === product.product.id)!;
			const item = items.find(i => i.id === prod.id);
			if (!item) {
				items.push({
					id: prod.id,
					amount: product.amount * (multiplier.trim().length > 0 ? parseInt(multiplier) : 1),
				})
			} else {
				item.amount += product.amount * (multiplier.trim().length > 0 ? parseInt(multiplier) : 1);
			}
		});
	});

	return (
		<div className='DayProducts'>
			<div className='header'>
				<h3>Produtos</h3>
				<label>
					Quant.:
					<NumberInput
						className='amount-input'
						value={multiplier}
						isFloat={false}
						onChange={newValue => setMultiplier(newValue.toString())}
					/>
				</label>
			</div>
			<table>
				<tbody>
					{
						items.map(item => (
							<tr
								key={item.id}
							>
								<td>{products.find(p => p.id === item.id)!.name}</td>
								<td>{item.amount} {products.find(p => p.id === item.id)!.unit}</td>
							</tr>
						))}
				</tbody>
			</table>
		</div>
	)
}
