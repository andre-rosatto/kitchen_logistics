import { useEffect, useState } from 'react';
import LoadingOverlay from '../components/LoadingOverlay';
import '../css/MealsView.css';
import useFirebase from '../hooks/useFirebase';
import { Product } from '../models/Product';
import { Recipe } from '../models/Recipe';
import { Meals } from '../models/Meals';
import MealsItem from '../components/MealsItem';
import DayProducts from '../components/DayProducts';
import WeekProducts from '../components/WeekProducts';

type MealNames = 'lunch' | 'dinner';

export default function MealsView() {
	const [loading, setLoading] = useState(false);
	const [products, setProducts] = useState<Product[]>([]);
	const [recipes, setRecipes] = useState<Recipe[]>([]);
	const [meals, setMeals] = useState<Meals[]>([]);
	const { fetchData: fetchProducts } = useFirebase('products');
	const { fetchData: fetchRecipes } = useFirebase('recipes');
	const { fetchData, updateItem } = useFirebase('meals');

	useEffect(() => {
		let ignore = false;
		setLoading(true);

		const fetchMeals = async () => {
			const products = await fetchProducts();
			if (ignore) return;
			const nextProducts: Product[] = products.map((product: any) => ({
				id: product.id,
				name: product.data().name,
				unit: product.data().unit,
			}));

			const recipes = await fetchRecipes();
			if (ignore) return;
			const nextRecipes: Recipe[] = recipes.map((recipe: any) => ({
				id: recipe.id,
				name: recipe.data().name,
				products: recipe.data().products.map((item: any) => {
					const product = nextProducts.find((p: Product) => p.id === item.product.id)!;
					if (product) {
						return {
							product: {
								id: product.id,
							},
							amount: item.amount,
						}
					} else {
						return {
							product: {
								id: null,
							},
							amount: null,
						}
					}
				})
			}));

			const filtered = nextRecipes.filter(r => r.products.filter(p => p.amount !== null));
			// console.log('nextRecipes:', nextRecipes.length);
			// console.log('filtered:', filtered.length);
			console.log(nextRecipes[5]);
			console.log(filtered[5]);



			const meals = await fetchData();
			if (ignore) return;
			const nextMeals: Meals[] = meals.map((meal: any) => ({
				id: meal.id,
				day: meal.data().day,
				amount: meal.data().amount,
				lunch: meal.data().lunch.map((item: any) => {
					const recipe = nextRecipes.find((r: Recipe) => r.id === item)!;
					return recipe.id;
				}),
				dinner: meal.data().dinner.map((item: any) => {
					const recipe = nextRecipes.find((r: Recipe) => r.id === item)!;
					return recipe.id;
				}),
			}));
			nextMeals.sort((a, b) => a.day - b.day);

			setProducts(nextProducts);
			setRecipes(nextRecipes);
			setMeals(nextMeals);
			setLoading(false);
		}

		fetchMeals().then(() => setLoading(false));
		return () => {
			ignore = true;
		}
	}, []);

	const handleRecipeAdd = async (mealsIdx: number, mealName: MealNames) => {
		setLoading(true);
		const nextMeals = [...meals];
		if (mealName === 'lunch') {
			nextMeals[mealsIdx].lunch.unshift(recipes[0].id);
		} else {
			nextMeals[mealsIdx].dinner.unshift(recipes[0].id);
		}
		await updateItem(nextMeals[mealsIdx].id, nextMeals[mealsIdx]);
		setMeals(nextMeals);
		setLoading(false);
	}

	const handleRecipeChange = async (mealsIdx: number, recipeIdx: number, newId: string, mealName: MealNames) => {
		setLoading(true);
		const nextMeals = [...meals];
		if (mealName === 'lunch') {
			nextMeals[mealsIdx].lunch[recipeIdx] = newId;
		} else {
			nextMeals[mealsIdx].dinner[recipeIdx] = newId;
		}
		await updateItem(nextMeals[mealsIdx].id, nextMeals[mealsIdx]);
		setMeals(nextMeals);
		setLoading(false);
	}

	const handleRecipeDelete = async (mealsIdx: number, recipeIdx: number, mealName: MealNames) => {
		setLoading(true);
		const nextMeals = [...meals];
		if (mealName === 'lunch') {
			nextMeals[mealsIdx].lunch.splice(recipeIdx, 1);
		} else {
			nextMeals[mealsIdx].dinner.splice(recipeIdx, 1);
		}
		await updateItem(nextMeals[mealsIdx].id, nextMeals[mealsIdx]);
		setMeals(nextMeals);
		setLoading(false);
	}

	const handleMealAmountChange = async (mealIdx: number, newAmount: number) => {
		setLoading(true);
		const nextMeals = [...meals];
		nextMeals[mealIdx].amount = newAmount;
		await updateItem(nextMeals[mealIdx].id, nextMeals[mealIdx]);
		setLoading(false);
	}

	return (
		<main className='MealsView'>
			{loading && <LoadingOverlay />}

			<div className='days-container'>
				{meals.map((meal, idx) => (
					<section
						key={meal.id}
						className='day-container'
					>
						<MealsItem
							meal={meal}
							recipes={recipes}
							onLunchAdd={() => handleRecipeAdd(idx, 'lunch')}
							onDinnerAdd={() => handleRecipeAdd(idx, 'dinner')}
							onLunchChange={(recipeIdx, newId) => handleRecipeChange(idx, recipeIdx, newId, 'lunch')}
							onDinnerChange={(recipeIdx, newId) => handleRecipeChange(idx, recipeIdx, newId, 'dinner')}
							onLunchDelete={recipeIdx => handleRecipeDelete(idx, recipeIdx, 'lunch')}
							onDinnerDelete={recipeIdx => handleRecipeDelete(idx, recipeIdx, 'dinner')}
						/>
						<DayProducts
							meals={meal}
							recipes={recipes}
							products={products}
							onAmountChange={newAmount => handleMealAmountChange(idx, newAmount)}
						/>
					</section>
				))}
			</div>

			<WeekProducts
				meals={meals}
				recipes={recipes}
				products={products}
			/>
		</main>
	);
}
