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
import ProductController from '../controllers/ProductController';
import RecipeController from '../controllers/RecipeController';
import MealsController from '../controllers/MealsController';

type MealNames = 'lunch' | 'dinner';

export default function MealsView() {
	const [loading, setLoading] = useState(false);
	const [products, setProducts] = useState<Product[]>([]);
	const [recipes, setRecipes] = useState<Recipe[]>([]);
	const [meals, setMeals] = useState<Meals[]>([]);
	const db = useFirebase();

	useEffect(() => {
		let ignore = false;
		setLoading(true);

		const fetchMeals = async () => {
			const nextProducts = await ProductController.fetchAll(db);
			if (ignore) return;
			const nextRecipes = await RecipeController.fetchAll(db, nextProducts);
			if (ignore) return;
			const nextMeals = await MealsController.fetchAll(db, nextRecipes);
			if (ignore) return;
			setProducts(nextProducts);
			setRecipes(nextRecipes);
			setMeals(nextMeals);
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
		await MealsController.update(db, nextMeals[mealsIdx].id, nextMeals[mealsIdx]);
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
		await MealsController.update(db, nextMeals[mealsIdx].id, nextMeals[mealsIdx]);
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
		await MealsController.update(db, nextMeals[mealsIdx].id, nextMeals[mealsIdx]);
		setMeals(nextMeals);
		setLoading(false);
	}

	const handleMealAmountChange = async (mealIdx: number, newAmount: number) => {
		setLoading(true);
		const nextMeals = [...meals];
		nextMeals[mealIdx].amount = newAmount;
		await MealsController.update(db, nextMeals[mealIdx].id, nextMeals[mealIdx]);
		setLoading(false);
	}

	const handlePrintClick = () => {
		window.print();
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

			<button
				className='print-button'
				onClick={handlePrintClick}
			>Imprimir</button>
		</main>
	);
}
