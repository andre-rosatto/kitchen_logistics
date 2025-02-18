import { useEffect, useState } from "react";
import LoadingOverlay from "../components/LoadingOverlay";
import addIcon from '../assets/add_icon.svg';
import deleteIcon from '../assets/delete_icon.svg';
import '../css/RecipesView.css';
import { Recipe } from "../models/Recipe";
import { Product } from "../models/Product";
import useFirebase from "../hooks/useFirebase";
import TableSelect from "../components/TableSelect";
import TableInput from "../components/TableInput";

export default function RecipesView() {
	const [loading, setLoading] = useState(false);
	const [newRecipe, setNewRecipe] = useState('');
	const [products, setProducts] = useState<Product[]>([]);
	const [newProductId, setNewProductId] = useState<string>();
	const [newProductAmount, setNewProductAmount] = useState('');
	const [recipes, setRecipes] = useState<Recipe[]>([]);
	const { fetchData, addData, updateItem, deleteItem } = useFirebase('recipes');
	const { fetchData: fetchProductsData } = useFirebase('products');

	useEffect(() => {
		let ignore = false;
		setLoading(true);
		let nextProducts: Product[] = [];
		let nextRecipes: Recipe[] = [];
		const fetchRecipes = async () => {
			const products = await fetchProductsData();
			if (ignore) return;
			nextProducts = products.map((product: any) => ({
				id: product.id,
				name: product.data().name,
				unit: product.data().unit,
			}));

			const recipes = await fetchData();
			if (ignore) return;
			nextRecipes = recipes.map((recipe: any) => ({
				id: recipe.id,
				name: recipe.data().name,
				products: recipe.data().products.map((item: any) => {
					const product = nextProducts.find((p: Product) => p.id === item.product.id)!;
					return {
						product: {
							id: product.id,
						},
						amount: item.amount,
					}
				})
			}));
			setNewProductId(nextProducts[0].id);
			setProducts(nextProducts);
			setRecipes(nextRecipes);
		}
		fetchRecipes().then(() => setLoading(false));
		return () => {
			ignore = true;
		}
	}, []);

	const handleAddRecipe = () => {
		setLoading(true);

		setLoading(false);
	}

	const handleSelect = async (recipe: Recipe, productIdx: number, selectedId: string) => {
		setLoading(true);
		const nextRecipe = { ...recipe };
		nextRecipe.products[productIdx].product.id = selectedId;
		await updateItem(recipe.id, nextRecipe);
		setRecipes(recipes => recipes.map(r => r.id !== nextRecipe.id ? r : nextRecipe));
		setLoading(false);
	}

	const handleAmountChange = async (recipe: Recipe, productIdx: number, newAmount: string) => {
		setLoading(true);
		const nextRecipe = { ...recipe };
		nextRecipe.products[productIdx].amount = parseFloat(newAmount);
		await updateItem(recipe.id, nextRecipe);
		setRecipes(recipes => recipes.map(r => r.id !== nextRecipe.id ? r : nextRecipe));
		setLoading(false);
	}

	const handleDeleteProduct = async (recipe: Recipe, productIdx: number) => {
		setLoading(true);
		const nextRecipe = { ...recipe };
		nextRecipe.products.splice(productIdx, 1);
		setRecipes(recipes => recipes.map(r => r.id !== recipe.id ? r : nextRecipe));
		await updateItem(recipe.id, nextRecipe);
		setLoading(false);
	}

	const handleAddProduct = async (recipe: Recipe) => {
		setLoading(true);
		const nextRecipe = { ...recipe };
		nextRecipe.products.unshift({
			product: { id: newProductId! },
			amount: parseFloat(newProductAmount),
		});
		await updateItem(recipe.id, nextRecipe);
		setRecipes(recipes => recipes.map(r => r.id !== nextRecipe.id ? r : nextRecipe));
		setLoading(false);
	}

	return (
		<main className='RecipesView'>
			{loading && <LoadingOverlay />}

			<div className='table'>
				<h2>Receitas</h2>

				<div className='add-bar'>
					<label>
						Nova receita:
						<input
							value={newRecipe}
							onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewRecipe(e.currentTarget.value)}
						/>
					</label>

					<button
						className='buttonGood'
						disabled={newRecipe.trim().length === 0}
						title='Adicionar receita'
						onClick={handleAddRecipe}
					>
						<img src={addIcon} />
					</button>
				</div>

				{recipes.map(recipe => (
					<div
						className='subtable'
						key={recipe.id}
					>
						<h3>{recipe.name}</h3>
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
								/>
								{products.find(product => product.id === newProductId)!.unit}
							</label>

							<button
								className='buttonGood'
								disabled={newProductAmount.trim().length === 0}
								title='Adicionar produto'
								onClick={() => handleAddProduct(recipe)}
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
												onSelect={id => handleSelect(recipe, idx, id)}
											/>
										</td>
										<td>
											<TableInput
												value={item.amount.toString()}
												onChange={newValue => handleAmountChange(recipe, idx, newValue)}
											/>
										</td>
										<td>{products.find(p => p.id === item.product.id)!.unit}</td>
										<td>
											<button
												className='buttonBad'
												onClick={() => handleDeleteProduct(recipe, idx)}
											>
												<img src={deleteIcon} />
											</button>
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				))}
			</div>
		</main>
	);
}
