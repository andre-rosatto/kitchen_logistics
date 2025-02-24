import { collection, doc, Firestore, getDocs, updateDoc } from "firebase/firestore";
import { Meals } from "../models/Meals";
import { Recipe } from "../models/Recipe";

export default class MealsController {
	private static collectionName = 'meals';

	static async fetchAll(db: Firestore, recipes: Recipe[]): Promise<Meals[]> {
		const docs = await getDocs(collection(db, MealsController.collectionName));
		const result: Meals[] = [];
		docs.forEach((doc: any) => {
			const lunchIds: string[] = doc.data().lunch.filter((lunchId: string) => recipes.find(recipe => recipe.id === lunchId));
			const dinnerIds: string[] = doc.data().dinner.filter((dinnerId: string) => recipes.find(recipe => recipe.id === dinnerId));
			result.push({
				id: doc.id,
				day: doc.data().day,
				amount: doc.data().amount,
				lunch: lunchIds,
				dinner: dinnerIds,
			});
		});
		return result.sort((a, b) => a.day - b.day);
	}

	static async update(db: Firestore, id: string, newMeals: Omit<Meals, 'id'>) {
		await updateDoc(doc(db, MealsController.collectionName, id), newMeals);
	}
}