import { useState } from 'react';
import '../css/ProductsView.css';
import { Product } from '../models/Products';
import addIcon from '../assets/add_icon.svg';
import deleteIcon from '../assets/delete_icon.svg';
import TableInput from '../components/TableInput';

export default function ProductsView() {
	const [newProduct, setNewProduct] = useState('');
	const [newUnit, setNewUnit] = useState('');
	const [products, setProducts] = useState<Product[]>([]);

	const handleAddClick = () => {
		setProducts(products => [{
			id: Date.now().toString(),
			name: newProduct,
			unit: newUnit,
		}, ...products]);
		setNewProduct('');
	}

	const handleDeleteClick = (product: Product) => {
		if (confirm(`Tem certeza de que quer excluir este produto?\n${product.name} - ${product.unit}`)) {
			console.log('delete:', product);
		}
	}

	const handleProductChange = (productId: string, newValue: string) => {
		console.log(productId, newValue);
	}

	return (
		<main className='ProductsView'>
			<div className='table'>
				<h2>Produtos</h2>

				<div className='add-bar'>
					<label>
						Novo produto:
						<input
							value={newProduct}
							onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewProduct(e.target.value)}
						/>
					</label>

					<label>
						Unidade:
						<input
							className='input-small'
							value={newUnit}
							onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewUnit(e.target.value)}
						/>
					</label>

					<button
						className='buttonGood'
						disabled={newProduct.trim().length === 0}
						title='Adicionar produto'
						onClick={handleAddClick}
					>
						<img src={addIcon} />
					</button>
				</div>

				<table>
					<thead>
						<th>Produto</th>
						<th>Unidade</th>
						<th></th>
					</thead>
					{products.map(product => (
						<tr>
							<td>
								<TableInput
									key={product.id + product.name}
									value={product.name}
									onChange={(newValue) => handleProductChange(product.id, newValue)}
								/>
							</td>

							<td>
								<TableInput
									key={product.id + product.unit}
									value={product.unit}
									onChange={(newValue) => handleProductChange(product.id, newValue)}
								/>
							</td>

							<td>
								<button
									className='buttonBad'
									onClick={() => handleDeleteClick(product)}
								>
									<img src={deleteIcon} />
								</button>
							</td>
						</tr>
					))}
				</table>
			</div>
		</main>
	);
}