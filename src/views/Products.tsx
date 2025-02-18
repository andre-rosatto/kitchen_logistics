import { useEffect, useState } from 'react';
import '../css/ProductsView.css';
import { Product } from '../models/Products';
import addIcon from '../assets/add_icon.svg';
import deleteIcon from '../assets/delete_icon.svg';
import TableInput from '../components/TableInput';
import useFirebase from '../hooks/useFirebase';
import LoadingOverlay from '../components/LoadingOverlay';

export default function ProductsView() {
	const [loading, setLoading] = useState(true);
	const [newProduct, setNewProduct] = useState('');
	const [newUnit, setNewUnit] = useState('');
	const [products, setProducts] = useState<Product[]>([]);
	const { fetchData, addData, deleteItem, updateItem } = useFirebase('products');

	useEffect(() => {
		setLoading(true);
		fetchData().then(docs => {
			const nextProducts: Product[] = [];
			docs.forEach((doc: any) => {
				nextProducts.push({
					id: doc.id,
					name: doc.data().name,
					unit: doc.data().unit,
				});
			});
			setProducts(nextProducts);
			setLoading(false);
		});
	}, []);

	const handleAddClick = async () => {
		setLoading(true);
		const data = {
			name: newProduct.trim(),
			unit: newUnit.trim(),
		};
		const product = await addData(data);
		setProducts(products => [{
			id: product.id,
			name: data.name,
			unit: data.unit,
		}, ...products]);
		setNewProduct('');
		setNewUnit('');
		setLoading(false);
	}

	const handleDeleteClick = async (product: Product) => {
		if (confirm(`Tem certeza de que quer excluir este produto?\n${product.name} - ${product.unit}`)) {
			setLoading(true);
			await deleteItem(product.id);
			setProducts(products => products.filter(p => p.id !== product.id));
			setLoading(false);
		}
	}

	const handleProductChange = async (productId: string, newValue: Product) => {
		setLoading(true);
		await updateItem(productId, {
			name: newValue.name.trim(),
			unit: newValue.unit.trim(),
		});
		setProducts(products => products.map(p => p.id !== productId ? p : newValue));
		setLoading(false);
	}

	return (
		<main className='ProductsView'>
			{loading && <LoadingOverlay />}

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
						<tr>
							<th>Produto</th>
							<th>Unidade</th>
							<th></th>
						</tr>
					</thead>
					<tbody>
						{products.map(product => (
							<tr key={product.id}>
								<td>
									<TableInput
										value={product.name}
										onChange={(newValue) => handleProductChange(product.id, { ...product, name: newValue })}
									/>
								</td>

								<td>
									<TableInput
										value={product.unit}
										onChange={(newValue) => handleProductChange(product.id, { ...product, unit: newValue })}
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
					</tbody>
				</table>
			</div>
		</main>
	);
}