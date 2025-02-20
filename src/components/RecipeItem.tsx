import addIcon from '../assets/add_icon.svg';
import deleteIcon from '../assets/delete_icon.svg';
import TableSelect from "../components/TableSelect";
import TableInput from "../components/TableInput";
import { Recipe } from '../models/Recipe';
import { Product } from '../models/Product';
import { useState } from 'react';
import '../css/RecipeItem.css';
import NumberInput from './NumberInput';

interface RecipeItemProps {
	recipe: Recipe;
	products: Product[];
	onAddProduct: (productId: string, productAmount: number) => void;
	onSelect: (idx: number, selecitedId: string) => void;
	onAmountChange: (productTdx: number, newValue: number) => void;
	onDeleteProduct: (productIdx: number) => void;
	onDeleteRecipe: () => void;
}

export default function RecipeItem({
	recipe,
	products,
	onAddProduct,
	onSelect,
	onAmountChange,
	onDeleteProduct,
	onDeleteRecipe,
}: RecipeItemProps) {
	const [newProductId, setNewProductId] = useState<string>(products[0].id);
	const [newProductAmount, setNewProductAmount] = useState('');

	if (!recipe || !products) return null;

	const handleDelete = (productIdx: number) => {
		const product = products.find(p => p.id === recipe.products[productIdx].product.id)!;
		if (confirm(`Tem certeza de que quer excluir este produto?\n${product.name} - ${recipe.products[productIdx].amount}${product.unit}`)) {
			onDeleteProduct(productIdx);
		}
	}

	const handleDeleteRecipe = () => {
		if (confirm(`Tem certeza de que quer excluir esta receita?\n${recipe.name}`)) {
			onDeleteRecipe();
		}
	}

	const handleAddClick = () => {
		onAddProduct(newProductId, parseFloat(newProductAmount));
		setNewProductAmount('');
	}

	return (
		<div className='RecipeItem'>
			<div className='header'>
				<h3>{recipe.name}</h3>
				<button
					className='buttonBad'
					onClick={() => handleDeleteRecipe()}
				>
					<img src={deleteIcon} />
				</button>
			</div>
			<div className='add-bar'>
				<label>
					Produto:
					<TableSelect
						titles={products.map(product => product.name)}
						ids={products.map(product => product.id)}
						value={newProductId ?? ''}
						onSelect={setNewProductId}
					/>
				</label>

				<label>
					Quantidade:
					<NumberInput
						className='amount'
						clearOnChange
						onChange={newValue => setNewProductAmount(newValue.toString())}
					/>
					{products.find(product => product.id === newProductId)!.unit}
				</label>

				<button
					className='buttonGood'
					disabled={newProductAmount.trim().length === 0}
					title='Adicionar produto'
					onClick={handleAddClick}
				>
					<img src={addIcon} />
				</button>
			</div>
			<table>
				<thead>
					<tr>
						<th>Produto</th>
						<th>Quantidade</th>
						<th>Unidade</th>
						<th></th>
					</tr>
				</thead>
				<tbody>
					{recipe.products.map((item, idx) => (
						<tr key={idx + recipe.id + item.product.id}>
							<td>
								<TableSelect
									titles={products.map(product => product.name)}
									ids={products.map(product => product.id)}
									value={item.product.id}
									onSelect={(id) => onSelect(idx, id)}
								/>
							</td>
							<td>
								<NumberInput
									value={item.amount.toString()}
									onChange={newValue => onAmountChange(idx, newValue)}
								/>
							</td>
							<td>{products.find(p => p.id === item.product.id)!.unit}</td>
							<td>
								<button
									className='buttonBad'
									onClick={() => handleDelete(idx)}
								>
									<img src={deleteIcon} />
								</button>
							</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
}
