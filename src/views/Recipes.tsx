import { useEffect, useState } from "react";
import LoadingOverlay from "../components/LoadingOverlay";
import addIcon from '../assets/add_icon.svg';
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
	const { fetchData, updateItem } = useFirebase('recipes');
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
							name: product.name,
							unit: product.unit,
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

	const handleSelect = async (recipe: Recipe, productId: string, selectedId: string) => {
		setLoading(true);
		const oldProduct = recipe.products.find(item => item.product.id === productId)!;
		const newProduct = products.find(product => product.id === selectedId)!;
		const oldProductIdx = recipe.products.indexOf(oldProduct);
		const newProducts = [...recipe.products];
		newProducts[oldProductIdx].product = newProduct;
		const nextRecipes = recipes.map(r => r.id != recipe.id ? r : ({ ...recipe, products: newProducts } as Recipe));
		setRecipes(nextRecipes);
		await updateItem(recipe.id, nextRecipes.find(r => r.id === recipe.id)!);
		setLoading(false);
	}

	const handleAmountChange = async (recipe: Recipe, productId: string, newAmount: string) => {
		setLoading(true);
		const amount = parseFloat(newAmount);
		const oldProduct = recipe.products.find(item => item.product.id === productId)!;
		const oldProductIdx = recipe.products.indexOf(oldProduct);
		const newProducts = [...recipe.products];
		newProducts[oldProductIdx].amount = amount;
		const nextRecipes = recipes.map(r => r.id != recipe.id ? r : ({ ...recipe, products: newProducts } as Recipe));
		setRecipes(nextRecipes);
		await updateItem(recipe.id, nextRecipes.find(r => r.id === recipe.id)!);
		setLoading(false);
	}

	const handleAddProduct = (recipeId: string) => {
		setLoading(true);
		const recipe = recipes.find(r => r.id === recipeId)!;
		console.log(recipe);
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
						<input />
					</label>

					<button
						className='buttonGood'
						disabled={newRecipe.trim().length === 0}
						title='Adicionar receita'
					// onClick={handleAddClick}
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
								onClick={() => handleAddProduct(recipe.id)}
							>
								<img src={addIcon} />
							</button>
						</div>
						<table>
							<tbody>
								{recipe.products.map((item, idx) => (
									<tr key={idx + recipe.id + item.product.id}>
										<td>
											<TableSelect
												titles={products.map(product => product.name)}
												ids={products.map(product => product.id)}
												value={item.product.id}
												onSelect={id => handleSelect(recipe, item.product.id, id)}
											/>
										</td>
										<td>
											<TableInput
												value={item.amount.toString()}
												onChange={newValue => handleAmountChange(recipe, item.product.id, newValue)}
											/>
										</td>
										<td>{item.product.unit}</td>
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
