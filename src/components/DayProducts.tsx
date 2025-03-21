import { useState } from 'react';
import '../css/DayProducts.css';
import { Meals } from '../models/Meals';
import { Product } from '../models/Product';
import { Recipe } from '../models/Recipe';
import { Converter } from '../utils/Converter';
import TableInput from './TableInput';

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
			const prod = products.find(p => p.id === product.productId)!;
			const item = items.find(i => i.id === prod.id);
			if (!item) {
				items.push({
					id: prod.id,
					amount: product.amount * Converter.strToInt(multiplier),
				})
			} else {
				item.amount += product.amount * Converter.strToInt(multiplier);
			}
		});
	});

	// const handleMultiplierChange = (e: React.ChangeEvent<HTMLInputElement>) => {
	// 	let value = e.currentTarget.value.replace(/[\D]+/g, '');
	// 	setMultiplier(value);
	// }

	// const handleMultiplierBlur = () => {
	// 	const value = Converter.strToInt(multiplier);
	// 	onAmountChange(value);
	// 	setMultiplier(value.toString());
	// }

	const handleMultiplierChange = (newValue: string) => {
		onAmountChange(Converter.strToInt(multiplier));
		setMultiplier(newValue);
	}

	const getAmountWithUnit = (item: ProductItem, products: Product[]) => {
		const product = products.find(p => p.id === item.id)!;
		if (item.amount > 1000 && product.x1000.length > 0) {
			return `${Math.round((item.amount / 1000 + Number.EPSILON) * 100) / 100} ${product.x1000}`;
		} else {
			return `${item.amount} ${product.unit}`;
		}
	}

	return (
		<div className='DayProducts'>
			<div className='header'>
				<h3>Produtos</h3>
				<label>
					Quant.:
					{/* <input
						value={multiplier}
						onChange={handleMultiplierChange}
						onBlur={handleMultiplierBlur}
					/> */}
					<TableInput
						value={multiplier}
						className='input'
						converterFunction={Converter.strToInt}
						onChange={newValue => handleMultiplierChange(newValue)}
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
								<td>{getAmountWithUnit(item, products)}</td>
							</tr>
						))}
				</tbody>
			</table>
		</div>
	)
}
