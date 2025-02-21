import { useEffect, useState } from 'react';
import '../css/ProductsView.css';
import { Product } from '../models/Product';
import addIcon from '../assets/add_icon.svg';
import deleteIcon from '../assets/delete_icon.svg';
import TableInput from '../components/TableInput';
import useFirebase from '../hooks/useFirebase';
import LoadingOverlay from '../components/LoadingOverlay';
import ProductController from '../controllers/ProductController';

export default function ProductsView() {
	const [loading, setLoading] = useState(true);
	const [newProduct, setNewProduct] = useState('');
	const [newUnit, setNewUnit] = useState('');
	const [newX1000, setNewX1000] = useState('');
	const [products, setProducts] = useState<Product[]>([]);
	const db = useFirebase();

	useEffect(() => {
		setLoading(true);
		let ignore = false;
		const fetchProducts = async () => {
			const nextProducts = await ProductController.fetchAll(db);
			if (ignore) return;
			setProducts(nextProducts);
			setLoading(false);
		}
		fetchProducts();

		return () => {
			ignore = true;
		}
	}, [db]);

	const handleAddClick = async () => {
		setLoading(true);
		const data = {
			name: newProduct.trim(),
			unit: newUnit.trim(),
			x1000: newX1000.trim(),
		};
		const product = await ProductController.create(db, data);
		setProducts(products => [product, ...products]);
		setNewProduct('');
		setNewUnit('');
		setLoading(false);
	}

	const handleDeleteClick = async (product: Product) => {
		setLoading(true);
		await ProductController.delete(db, product);
		setProducts(products => products.filter(p => p.id !== product.id));
		setLoading(false);
	}

	const handleProductChange = async (productId: string, newValue: Product) => {
		setLoading(true);
		await ProductController.update(db, productId, {
			name: newValue.name.trim(),
			unit: newValue.unit.trim(),
			x1000: newValue.x1000.trim(),
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

					<label>
						Unid. (x1000):
						<input
							className='input-small'
							value={newX1000}
							onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewX1000(e.target.value)}
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
							<th>x1000</th>
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
									<TableInput
										value={product.x1000 ?? ''}
										onChange={(newValue) => handleProductChange(product.id, { ...product, x1000: newValue })}
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