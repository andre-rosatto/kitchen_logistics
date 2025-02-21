import { useEffect, useState } from "react";
import LoadingOverlay from "../components/LoadingOverlay";
import addIcon from '../assets/add_icon.svg';
import '../css/RecipesView.css';
import { Recipe } from "../models/Recipe";
import { Product } from "../models/Product";
import useFirebase from "../hooks/useFirebase";
import RecipeItem from "../components/RecipeItem";
import ProductController from "../controllers/ProductController";
import RecipeController from "../controllers/RecipeController";

export default function RecipesView() {
	const [loading, setLoading] = useState(false);
	const [newRecipe, setNewRecipe] = useState('');
	const [products, setProducts] = useState<Product[]>([]);
	const [recipes, setRecipes] = useState<Recipe[]>([]);
	const db = useFirebase();

	useEffect(() => {
		let ignore = false;
		setLoading(true);
		const fetchRecipes = async () => {
			const nextProducts = await ProductController.fetchAll(db);
			const nextRecipes = await RecipeController.fetchAll(db, nextProducts);
			if (ignore) return;
			setProducts(nextProducts);
			setRecipes(nextRecipes);
		}
		fetchRecipes().then(() => setLoading(false));
		return () => {
			ignore = true;
		}
	}, [db]);

	const handleAddRecipe = async () => {
		setLoading(true);
		const data = {
			name: newRecipe.trim(),
			products: [] as unknown as Recipe["products"],
		};
		const recipe = await RecipeController.create(db, data);
		setNewRecipe('');
		setRecipes(recipes => [{
			id: recipe.id,
			name: data.name,
			products: data.products,
		}, ...recipes]);
		setLoading(false);
	}

	const handleDeleteRecipe = async (recipe: Recipe) => {
		setLoading(true);
		setRecipes(recipes => recipes.filter(r => r.id !== recipe.id));
		await RecipeController.delete(db, recipe);
		setLoading(false);
	}

	const handleSelect = async (recipe: Recipe, productIdx: number, selectedId: string) => {
		setLoading(true);
		const nextRecipe = { ...recipe };
		nextRecipe.products[productIdx].productId = selectedId;
		await RecipeController.update(db, recipe.id, nextRecipe);
		setRecipes(recipes => recipes.map(r => r.id !== nextRecipe.id ? r : nextRecipe));
		setLoading(false);
	}

	const handleAmountChange = async (recipe: Recipe, productIdx: number, newAmount: number) => {
		setLoading(true);
		const nextRecipe = { ...recipe };
		nextRecipe.products[productIdx].amount = newAmount;
		await RecipeController.update(db, recipe.id, nextRecipe);
		setRecipes(recipes => recipes.map(r => r.id !== nextRecipe.id ? r : nextRecipe));
		setLoading(false);
	}

	const handleDeleteProduct = async (recipe: Recipe, productIdx: number) => {
		setLoading(true);
		const nextRecipe = { ...recipe };
		nextRecipe.products.splice(productIdx, 1);
		setRecipes(recipes => recipes.map(r => r.id !== recipe.id ? r : nextRecipe));
		await RecipeController.update(db, recipe.id, nextRecipe);
		setLoading(false);
	}

	const handleAddProduct = async (recipe: Recipe, productId: string, productAmount: number) => {
		setLoading(true);
		const nextRecipe = { ...recipe };
		nextRecipe.products.unshift({
			productId: productId,
			amount: productAmount,
		});
		await RecipeController.update(db, recipe.id, nextRecipe);
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
