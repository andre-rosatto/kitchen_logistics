import { useState } from 'react';
import '../css/ProductsView.css';

export default function ProductsView() {
	const [newProduct, setNewProduct] = useState('');
	const [newUnit, setNewUnit] = useState('');

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

					<button></button>
				</div>
			</div>
		</main>
	);
}