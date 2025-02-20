import { useEffect, useState } from "react";
import LoadingOverlay from "../components/LoadingOverlay";
import addIcon from '../assets/add_icon.svg';
import '../css/RecipesView.css';
import { Recipe } from "../models/Recipe";
import { Product } from "../models/Product";
import useFirebase from "../hooks/useFirebase";
import RecipeItem from "../components/RecipeItem";

export default function RecipesView() {
	const [loading, setLoading] = useState(false);
	const [newRecipe, setNewRecipe] = useState('');
	const [products, setProducts] = useState<Product[]>([]);
	const [recipes, setRecipes] = useState<Recipe[]>([]);
	const { fetchData, addData, updateItem, deleteItem } = useFirebase('recipes');
	const { fetchData: fetchProductsData } = useFirebase('products');

	useEffect(() => {
		let ignore = false;
		setLoading(true);
		let nextProducts: Product[] = [];
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
			const nextRecipes: Recipe[] = recipes.map((recipe: any) => {
				const products: Recipe['products'] = [];
				recipe.data().products.forEach((item: any) => {
					const prod = nextProducts.find((p: Product) => p.id === item.product.id);
					if (prod) {
						products.push({
							product: {
								id: prod.id,
							},
							amount: item.amount,
						});
					}
				});
				return {
					id: recipe.id,
					name: recipe.data().name,
					products: products,
				}
			});
			setProducts(nextProducts);
			setRecipes(nextRecipes);
		}
		fetchRecipes().then(() => setLoading(false));
		return () => {
			ignore = true;
		}
	}, []);

	const handleAddRecipe = async () => {
		setLoading(true);
		const data = {
			name: newRecipe.trim(),
			products: [] as unknown as Recipe["products"],
		};
		const recipe = await addData(data);
		setNewRecipe('');
		console.log(recipe);

		setRecipes(recipes => [{
			id: recipe.id,
			name: data.name,
			products: data.products,
		}, ...recipes]);
		setLoading(false);
	}

	const handleSelect = async (recipe: Recipe, productIdx: number, selectedId: string) => {
		setLoading(true);
		const nextRecipe = { ...recipe };
		nextRecipe.products[productIdx].product.id = selectedId;
		console.log(selectedId);

		console.log(nextRecipe);

		await updateItem(recipe.id, nextRecipe);
		setRecipes(recipes => recipes.map(r => r.id !== nextRecipe.id ? r : nextRecipe));
		setLoading(false);
	}

	const handleAmountChange = async (recipe: Recipe, productIdx: number, newAmount: number) => {
		setLoading(true);
		const nextRecipe = { ...recipe };
		nextRecipe.products[productIdx].amount = newAmount;
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

	const handleAddProduct = async (recipe: Recipe, productId: string, productAmount: number) => {
		setLoading(true);
		const nextRecipe = { ...recipe };
		nextRecipe.products.unshift({
			product: { id: productId },
			amount: productAmount,
		});
		await updateItem(recipe.id, nextRecipe);
		setRecipes(recipes => recipes.map(r => r.id !== nextRecipe.id ? r : nextRecipe));
		setLoading(false);
	}

	const handleDeleteRecipe = async (recipe: Recipe) => {
		setLoading(true);
		setRecipes(recipes => recipes.filter(r => r.id !== recipe.id));
		await deleteItem(recipe.id);
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
					<RecipeItem
						key={recipe.id}
						recipe={recipe}
						products={products}
						onAddProduct={(productId, productAmount) => handleAddProduct(recipe, productId, productAmount)}
						onAmountChange={(productIdx, newAmount) => handleAmountChange(recipe, productIdx, newAmount)}
						onDeleteProduct={(productIdx: number) => handleDeleteProduct(recipe, productIdx)}
						onSelect={(productIdx, selectedId) => handleSelect(recipe, productIdx, selectedId)}
						onDeleteRecipe={() => handleDeleteRecipe(recipe)}
					/>

				))}
			</div>
		</main>
	);
}
