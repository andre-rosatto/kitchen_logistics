import TableSelect from "../components/TableSelect";
import TableInput from "../components/TableInput";
import { Recipe } from '../models/Recipe';
import { Product } from '../models/Product';
import { useState } from 'react';
import '../css/RecipeItem.css';
import { Converter } from '../utils/Converter';
import IconButton from './IconButton';

interface RecipeItemProps {
	recipe: Recipe;
	products: Product[];
	onAddProduct: (productId: string, productAmount: number) => void;
	onSelect: (idx: number, selecitedId: string) => void;
	onNameChange: (newValue: string) => void;
	onAmountChange: (productIdx: number, newValue: number) => void;
	onDeleteProduct: (productIdx: number) => void;
	onDeleteRecipe: () => void;
}

export default function RecipeItem({
	recipe,
	products,
	onAddProduct,
	onSelect,
	onNameChange,
	onAmountChange,
	onDeleteProduct,
	onDeleteRecipe,
}: RecipeItemProps) {
	const [recipeName, setRecipeName] = useState(recipe.name);
	const [newProductId, setNewProductId] = useState<string>(products[0].id);
	const [newProductAmount, setNewProductAmount] = useState('');

	if (!recipe || !products) return null;

	const handleDelete = (productIdx: number) => {
		const product = products.find(p => p.id === recipe.products[productIdx].productId)!;
		if (confirm(`Tem certeza de que quer excluir este produto?\n${product.name} - ${recipe.products[productIdx].amount}${product.unit}`)) {
			onDeleteProduct(productIdx);
		}
	}

	const handleDeleteRecipe = () => {
		if (confirm(`Tem certeza de que quer excluir esta receita?\n${recipe.name}`)) {
			onDeleteRecipe();
		}
	}

	const handleRecipeNameChange = (newValue: string) => {
		setRecipeName(newValue);
		onNameChange(newValue);
	}

	return (
		<div
			className='RecipeItem'
			id={`_${recipe.id}`}
		>
			<div className='header'>
				<TableInput
					value={recipeName}
					className='input'
					onChange={handleRecipeNameChange}
				/>
				<IconButton
					type='delete'
					title='Remover receita'
					onClick={handleDeleteRecipe}
				/>
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
					<input
						className='amount'
						value={newProductAmount}
						onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewProductAmount(e.currentTarget.value)}
						onBlur={() => setNewProductAmount(Converter.strToFloat(newProductAmount).toString())}
					/>
					{products.find(product => product.id === newProductId)!.unit}
				</label>

				<IconButton
					type='add'
					title='Adicionar produto'
					disabled={newProductAmount.trim().length === 0}
					onClick={() => onAddProduct(newProductId, Converter.strToFloat(newProductAmount))}
				/>
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
						<tr key={idx + recipe.id + item.productId}>
							<td>
								<TableSelect
									titles={products.map(product => product.name)}
									ids={products.map(product => product.id)}
									value={item.productId}
									onSelect={(id) => onSelect(idx, id)}
								/>
							</td>
							<td>
								<TableInput
									value={item.amount.toString()}
									converterFunction={Converter.strToFloat}
									onChange={newValue => onAmountChange(idx, Converter.strToFloat(newValue))}
								/>
							</td>
							<td>{products.find(p => p.id === item.productId)?.unit ?? ''}</td>
							<td>
								<IconButton
									type='delete'
									title='Remover produto'
									onClick={() => handleDelete(idx)}
								/>
							</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
}
